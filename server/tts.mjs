// Narration voice: Grok's "Ara" voice via the xAI text-to-speech API (https://api.x.ai/v1/tts).
// Every line is generated once, then served from a disk cache, so a sentence is only ever paid for once.
// The public game only plays clips made ahead of time (scripts/warm-narration.mjs, from the game's fixed
// lines): it never asks for a new one, so no child's name is ever sent to xAI. `tts.cached` reads those.
import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const VOICES = new Set(['ara', 'eve'])
export const SPEEDS = new Set(['0.85', '1', '1.1'])
export const MAX_CHARS = 600
const API_URL = process.env.XAI_TTS_URL ?? 'https://api.x.ai/v1/tts'

/** Calls xAI and returns MP3 bytes. Throws with the API's message on failure. */
export async function synthesize(text, voice, speed, apiKey) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice_id: voice,
      language: 'en',
      speed: Number(speed),
      output_format: { codec: 'mp3', sample_rate: 24000, bit_rate: 64000 },
    }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!res.ok) throw new Error(`xAI TTS HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Returns a cached synthesizer: (text, voice, speed) -> MP3 bytes.
 * `dailyChars` caps how much *new* speech can be generated per day, as a guard against runaway cost.
 */
export function createTtsCache({ apiKey, dir, dailyChars }) {
  const inFlight = new Map()
  let day = ''
  let used = 0
  // If the cache folder can't be made, keep the server up: narration falls back to the device voice.
  const ready = mkdir(dir, { recursive: true }).catch((e) => {
    console.error(`TTS cache folder ${dir} unavailable: ${e.message}`)
    throw e
  })
  ready.catch(() => {})

  const fileFor = (text, voice, speed) => join(dir, `${createHash('sha256').update(`${voice}|${speed}|${text}`).digest('hex')}.mp3`)

  async function tts(text, voice, speed) {
    const id = createHash('sha256').update(`${voice}|${speed}|${text}`).digest('hex')
    const file = fileFor(text, voice, speed)
    await ready
    try {
      return await readFile(file)
    } catch {
      /* not cached yet */
    }
    if (inFlight.has(id)) return inFlight.get(id)
    const today = new Date().toISOString().slice(0, 10)
    if (today !== day) (day = today), (used = 0)
    if (used + text.length > dailyChars) throw Object.assign(new Error('daily voice budget used up'), { budget: true })
    used += text.length
    const job = synthesize(text, voice, speed, apiKey)
      .catch((e) => {
        used -= text.length // nothing was generated, so it doesn't count against today's budget
        throw e
      })
      .then(async (mp3) => {
        const tmp = `${file}.${process.pid}.tmp`
        await writeFile(tmp, mp3)
        await rename(tmp, file)
        return mp3
      })
      .finally(() => inFlight.delete(id))
    inFlight.set(id, job)
    return job
  }
  /** A clip that was made already (warmed at build time), or null: never makes a new one. */
  tts.cached = async (text, voice, speed) => {
    await ready
    return readFile(fileFor(text, voice, speed)).catch(() => null)
  }
  return tts
}
