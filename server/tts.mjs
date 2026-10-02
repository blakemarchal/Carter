// Narration voice: Grok's "Ara" voice via the xAI text-to-speech API (https://api.x.ai/v1/tts).
// Every line is generated once, then served from a disk cache, so a sentence is only ever paid for once.
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
  const ready = mkdir(dir, { recursive: true })

  return async function tts(text, voice, speed) {
    const id = createHash('sha256').update(`${voice}|${speed}|${text}`).digest('hex')
    const file = join(dir, `${id}.mp3`)
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
}
