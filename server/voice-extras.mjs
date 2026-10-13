// Two small things for the narrator's voice (docs/CLOUD-BRIEF.md, wave 11):
//
// A child's name the narrator can say. A name in the name library is said by the house Grok voice already
// (the SSA's public list: no family's data). A name that isn't is read by the device's own voice, unless a
// parent chooses "Let the narrator say <name>" in the Parent Corner (off until then). Only then is that one
// name sent to xAI, once, to make its two clips ("…, Zuri." and "Zuri!"), which are kept with the family's own
// recordings (Family voices) and play like them. Turning it off deletes them. Which names a family agreed to is
// kept in its folder (voice-names.json), with its download and deleted with it.
//
// The voice coverage log (the owner's devices only): a line that fell to the device voice is sent here (never
// one with a family's name: lib/speech.ts checks), so it can be added to the next Grok warm-up
// (scripts/warm-house-grok.mjs --missed reads STATE_DIRECTORY/house/missed.json). The studio lists them.
import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const err = (status, message = 'voice') => Object.assign(new Error(message), { status })

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')) } catch { return fallback }
}
async function writeJson(file, value) {
  await mkdir(dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  await writeFile(tmp, JSON.stringify(value))
  await rename(tmp, file)
}

/** A name as a parent typed it, tidied: letters, spaces, hyphens and apostrophes, up to 30 characters. */
export function cleanChildName(name) {
  const n = String(name ?? '').normalize('NFC').replace(/\s+/g, ' ').trim()
  return n && n.length <= 30 && /^[\p{L}][\p{L}' ’-]*$/u.test(n) ? n : null
}

/** A name clip's key and fingerprint, as the game makes them (src/voice/keys.ts, src/voice/names.ts nameKey). */
export function nameClipId(name, take) {
  const key = `⟪name⟫ ${name.trim().toLowerCase().normalize('NFC')} ${take}`
  return createHash('sha256').update(key.trim()).digest('hex').slice(0, 16)
}

/** The names a family agreed the narrator may say: kept in its folder. */
export function createNameConsent(file) {
  return {
    async list() { return readJson(file, []) },
    async has(name) { return (await this.list()).some((n) => n.toLowerCase() === name.toLowerCase()) },
    async add(name) {
      const all = await this.list()
      if (!all.some((n) => n.toLowerCase() === name.toLowerCase())) await writeJson(file, [...all, name])
    },
    async remove(name) {
      await writeJson(file, (await this.list()).filter((n) => n.toLowerCase() !== name.toLowerCase()))
    },
  }
}

/**
 * "Let the narrator say <name>": makes the name's two clips with `synth(text)` (xAI, once each) into the
 * family's `recordings`, and notes the family agreed. Returns the clips' fingerprints.
 */
export async function makeNameClips(name, { synth, recordings, consent }) {
  const clean = cleanChildName(name)
  if (!clean) throw err(400, 'not a name')
  const ids = {}
  for (const [take, text] of [['mid', clean], ['exclaim', `${clean}!`]]) {
    const mp3 = await synth(text)
    ids[take] = nameClipId(clean, take)
    await recordings.put(ids[take], 'audio/mpeg', mp3)
  }
  await consent.add(clean)
  return ids
}

/** Turning it off: the two clips are deleted, and so is the family's OK. */
export async function removeNameClips(name, { recordings, consent }) {
  const clean = cleanChildName(name)
  if (!clean) throw err(400, 'not a name')
  for (const take of ['mid', 'exclaim']) await recordings.remove(nameClipId(clean, take))
  await consent.remove(clean)
}

/** Lines that fell to the device voice: { line, spoken, count, last }, the most recent 2,000. */
export function createMissed(file, { clock = () => Date.now(), max = 2000 } = {}) {
  let queue = Promise.resolve()
  return {
    async list() { return readJson(file, []) },
    add(line, spoken) {
      const l = String(line ?? '').replace(/\s+/g, ' ').trim().slice(0, 600)
      if (!l || !/\p{L}/u.test(l)) return Promise.resolve()
      queue = queue.then(async () => {
        const all = await readJson(file, [])
        const had = all.find((x) => x.line === l)
        if (had) Object.assign(had, { count: had.count + 1, last: clock() })
        else all.push({ line: l, spoken: String(spoken ?? l).slice(0, 600), count: 1, last: clock() })
        all.sort((a, b) => b.last - a.last)
        await writeJson(file, all.slice(0, max))
      })
      return queue
    },
    async clear() { await writeJson(file, []) },
  }
}
