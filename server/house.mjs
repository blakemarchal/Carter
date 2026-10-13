// The house voices (docs/BUSINESS-PLAN.md §2): the owner's own family recording the game's lines once, for
// every family. Each voice (mom, dad, child, and any added later) keeps its clips in STATE_DIRECTORY/house/<voice>,
// each named by its fingerprint: the first 16 hex characters of SHA-256 of what was said (the line's text, the
// same fingerprint as a family's own recordings, or a slot's key for the parts that are stitched together:
// src/voice/keys.ts). house/index.json says, for each clip, what it is, when it was recorded, where its sound
// starts and ends (the studio trims silence), how loud to play it, and whether it's shared.
//
// A voice can be private: the child's voice is, by default, for the owner's family only. The owner shares it
// clip by clip. Nothing else in the house set is private: it's the game's own narration.
//
// Every family: GET /voice/house (what there is: { version, voices, clips: { voice: { id: [v, start, end, gain] } } }),
//   GET /voice/house/<voice>/<id> (the audio; ?v= makes the address change when it's re-recorded).
// The owner (a parent in the first family): GET /voice/house/index (everything, for the studio),
//   PUT and DELETE /voice/house/<voice>/<id>, POST /voice/house/share, POST /voice/house/promote,
//   POST /voice/house/voice (a voice's label).
import { copyFile, mkdir, readdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import { statSync } from 'node:fs'
import { join } from 'node:path'

export const ID = /^[0-9a-f]{16}$/
export const VOICE = /^[a-z][a-z0-9-]{1,15}$/
export const MAX_BYTES = 3 * 1024 * 1024
const TYPES = { 'audio/mp4': 'm4a', 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'audio/wav': 'wav' }
const typeOf = (ext) => Object.entries(TYPES).find(([, e]) => e === ext)?.[0] ?? 'application/octet-stream'
/** The voices there are to begin with. Labels can be changed by the owner; the child's voice is private. */
export const DEFAULT_VOICES = {
  mom: { label: 'Mom' },
  dad: { label: 'Dad' },
  child: { label: 'Our child', private: true },
}
const err = (status, message = 'voice') => Object.assign(new Error(message), { status })
const ms = (v) => (Number.isFinite(Number(v)) && Number(v) >= 0 ? Math.round(Number(v)) : null)

/** The house set, kept in `dir`. */
export function createHouse(dir, { clock = () => Date.now() } = {}) {
  const ready = mkdir(dir, { recursive: true })
  ready.catch((e) => console.error(`House voice folder ${dir} unavailable: ${e.message}`))
  const indexFile = join(dir, 'index.json')
  let index = null
  let loadedAt = 0 // (index.json's time when it was read: scripts/warm-house-grok.mjs writes it while the server runs)
  const fileTime = () => { try { return statSync(indexFile).mtimeMs } catch { return 0 } }
  async function load() {
    if (index && fileTime() <= loadedAt) return index
    await ready
    loadedAt = fileTime()
    try {
      index = JSON.parse(await readFile(indexFile, 'utf8'))
    } catch {
      index = { version: 0, voices: {}, clips: {} }
    }
    index.voices = { ...structuredClone(DEFAULT_VOICES), ...index.voices }
    index.clips ??= {}
    return index
  }
  // (one write at a time, each a whole new file swapped in)
  let writing = Promise.resolve()
  function persist() {
    index.version = Math.max(clock(), index.version + 1)
    const body = JSON.stringify(index)
    writing = writing.then(async () => {
      const tmp = `${indexFile}.${process.pid}.tmp`
      await writeFile(tmp, body)
      await rename(tmp, indexFile)
      loadedAt = fileTime()
    })
    return writing
  }
  const folder = (voice) => join(dir, voice)
  const fileOf = (voice, id, ext) => join(folder(voice), `${id}.${ext}`)
  const checkVoice = (voice) => { if (!VOICE.test(voice)) throw err(400, 'bad voice') }
  const checkId = (id) => { if (!ID.test(id)) throw err(400, 'bad id') }

  return {
    /** What a family's device may play: every clip, except a private voice's unshared ones (unless `own`). */
    async manifest({ own = false } = {}) {
      const ix = await load()
      const clips = {}
      for (const [voice, all] of Object.entries(ix.clips)) {
        const hidden = !own && ix.voices[voice]?.private
        const mine = {}
        for (const [id, c] of Object.entries(all)) {
          if (hidden && !c.shared) continue
          mine[id] = [c.at.toString(36), c.start ?? 0, c.end ?? 0, c.gain ?? 1, ...(c.flagged ? [1] : [])]
        }
        if (Object.keys(mine).length) clips[voice] = mine
      }
      const voices = Object.fromEntries(Object.entries(ix.voices).map(([v, d]) => [v, { label: d.label }]))
      return { version: ix.version, voices, clips }
    },

    /** Saves the index (after puts made with { save: false }, as the warm script makes them in batches). */
    async flush() {
      await load()
      await persist()
    },

    /** Everything about every clip (the owner's studio). */
    async index() {
      return structuredClone(await load())
    },

    async get(voice, id) {
      if (!VOICE.test(voice) || !ID.test(id)) return null
      const c = (await load()).clips[voice]?.[id]
      if (!c) return null
      try {
        return { type: typeOf(c.ext), body: await readFile(fileOf(voice, id, c.ext)), private: !!(await load()).voices[voice]?.private && !c.shared }
      } catch {
        return null
      }
    },

    /**
     * Saves a clip. `meta`: key (what was said, or a slot's key), said (the words read), ref (where the line is
     * in the script, so a change to its words can be flagged), start and end (ms of sound to play), gain.
     */
    async put(voice, id, type, body, meta = {}, { save = true } = {}) {
      checkVoice(voice)
      checkId(id)
      const ext = TYPES[String(type).split(';')[0].trim()]
      if (!ext) throw err(415, 'unsupported audio type')
      if (!body?.length || body.length > MAX_BYTES) throw err(413, 'too large')
      const ix = await load()
      if (!ix.voices[voice]) ix.voices[voice] = { label: voice }
      await mkdir(folder(voice), { recursive: true })
      const old = ix.clips[voice]?.[id]
      if (old && old.ext !== ext) await unlink(fileOf(voice, id, old.ext)).catch(() => {})
      const tmp = `${fileOf(voice, id, ext)}.tmp`
      await writeFile(tmp, body)
      await rename(tmp, fileOf(voice, id, ext))
      const gain = Number(meta.gain)
      ix.clips[voice] ??= {}
      ix.clips[voice][id] = {
        ext, at: clock(), bytes: body.length,
        key: typeof meta.key === 'string' ? meta.key.slice(0, 2000) : old?.key ?? null,
        ref: typeof meta.ref === 'string' ? meta.ref.slice(0, 2000) : old?.ref ?? null,
        said: typeof meta.said === 'string' ? meta.said.slice(0, 2000) : old?.said ?? null,
        start: ms(meta.start) ?? 0, end: ms(meta.end) ?? 0,
        gain: Number.isFinite(gain) && gain > 0 && gain <= 8 ? Math.round(gain * 100) / 100 : 1,
        ...(old?.shared ? { shared: true } : {}),
        // (which of its prompts made it: a Grok clip flagged on the sound check page is made again with the next)
        ...(Number.isInteger(meta.attempt) && meta.attempt > 0 ? { attempt: meta.attempt } : {}),
      }
      if (save) await persist()
      return ix.clips[voice][id]
    },

    async remove(voice, id) {
      checkVoice(voice)
      checkId(id)
      const ix = await load()
      const c = ix.clips[voice]?.[id]
      if (!c) return
      await unlink(fileOf(voice, id, c.ext)).catch(() => {})
      delete ix.clips[voice][id]
      await persist()
    },

    /** Shares one of a private voice's clips with every family, or stops sharing it. */
    async setShared(voice, id, on) {
      const ix = await load()
      const c = ix.clips[voice]?.[id]
      if (!c) throw err(404, 'no such clip')
      if (on) c.shared = true
      else delete c.shared
      await persist()
    },

    /** Flags a clip that sounds wrong (the owner's sound check page), or unflags it. */
    async setFlag(voice, id, on) {
      const ix = await load()
      const c = ix.clips[voice]?.[id]
      if (!c) throw err(404, 'no such clip')
      if (on) c.flagged = true
      else delete c.flagged
      await persist()
    },

    /** Names a voice ("Mom"); a new voice can be added this way too. */
    async setVoice(voice, { label }) {
      checkVoice(voice)
      const ix = await load()
      const clean = String(label ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 40)
      if (!clean) throw err(400, 'no label')
      ix.voices[voice] = { ...ix.voices[voice], label: clean }
      await persist()
    },

    /**
     * Copies a family's own recordings (its Family voices, from `fromDir`) into a house voice, under the same
     * fingerprints, so they play for every family. Lines the voice already has are left as they are.
     */
    async promote(fromDir, voice) {
      checkVoice(voice)
      const ix = await load()
      let files = []
      try { files = await readdir(fromDir) } catch { /* no recordings yet */ }
      let copied = 0, had = 0
      await mkdir(folder(voice), { recursive: true })
      ix.clips[voice] ??= {}
      if (!ix.voices[voice]) ix.voices[voice] = { label: voice }
      for (const f of files) {
        const [id, ext] = f.split('.')
        if (!ID.test(id) || !Object.values(TYPES).includes(ext)) continue
        if (ix.clips[voice][id]) { had++; continue }
        await copyFile(join(fromDir, f), fileOf(voice, id, ext))
        const { size } = await stat(fileOf(voice, id, ext))
        ix.clips[voice][id] = { ext, at: clock(), bytes: size, key: null, said: null, ref: null, start: 0, end: 0, gain: 1, promoted: true }
        copied++
      }
      if (copied) await persist()
      return { copied, had }
    },
  }
}

// ---- HTTP ----

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(body === undefined ? '' : JSON.stringify(body))
}
async function readBody(req, max) {
  const chunks = []
  let size = 0
  for await (const c of req) {
    size += c.length
    if (size > max) throw err(413, 'too large')
    chunks.push(c)
  }
  return Buffer.concat(chunks)
}

/**
 * /voice/house… for a signed-in session `s`. `own`: whether the session's family is the owner's (it hears the
 * private voices too); `owner`: whether it may change the house set; `familyRecordingsDir`: the owner family's
 * own recordings, for promoting.
 */
export async function handleHouse(req, res, url, house, { own, owner, familyRecordingsDir }) {
  const [, , , a = '', b = ''] = url.pathname.split('/') // /voice/house/<a>/<b>
  try {
    if (!a && req.method === 'GET') return json(res, 200, await house.manifest({ own }))
    if (a === 'index' && req.method === 'GET') {
      if (!owner) return json(res, 403)
      return json(res, 200, await house.index())
    }
    if (['share', 'promote', 'voice', 'flag'].includes(a) && req.method === 'POST') {
      if (!owner) return json(res, 403)
      const body = JSON.parse((await readBody(req, 4096)).toString('utf8') || '{}')
      if (a === 'share') await house.setShared(String(body.voice ?? ''), String(body.id ?? ''), !!body.shared)
      if (a === 'flag') await house.setFlag(String(body.voice ?? ''), String(body.id ?? ''), !!body.flagged)
      if (a === 'voice') await house.setVoice(String(body.voice ?? ''), { label: body.label })
      if (a === 'promote') return json(res, 200, await house.promote(familyRecordingsDir, String(body.voice ?? 'mom')))
      return json(res, 204)
    }
    if (a && b) {
      if (req.method === 'GET') {
        const clip = await house.get(a, b)
        if (!clip || (clip.private && !own)) return json(res, 404)
        // (the address carries the clip's version, ?v=, so a device can keep it, for offline play)
        res.writeHead(200, { 'Content-Type': clip.type, 'Cache-Control': url.searchParams.has('v') ? 'private, max-age=31536000, immutable' : 'no-store' })
        return res.end(clip.body)
      }
      if (!owner) return json(res, 403)
      if (req.method === 'PUT') {
        const q = url.searchParams
        const meta = { key: q.get('key') ?? undefined, said: q.get('said') ?? undefined, ref: q.get('ref') ?? undefined, start: q.get('start'), end: q.get('end'), gain: q.get('gain') }
        return json(res, 200, await house.put(a, b, req.headers['content-type'] ?? '', await readBody(req, MAX_BYTES), meta))
      }
      if (req.method === 'DELETE') {
        await house.remove(a, b)
        return json(res, 204)
      }
    }
    return json(res, 405)
  } catch (e) {
    if (!e.status) console.error(`house voice: ${e.message}`)
    return json(res, e.status ?? 400)
  }
}
