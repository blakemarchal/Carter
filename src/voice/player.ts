// Plays one or more recorded clips back to back, as one line (Web Audio). Each clip plays only its sound:
// the silence a recording starts and ends with is trimmed (where the studio marked it, or found here), so
// stitched parts ("Way to go," + "Olivia!") meet with just a short natural gap.
import { ac, buses } from '../lib/audio'

export interface Part {
  audio: Promise<ArrayBuffer | null> | ArrayBuffer | null
  /** Where its sound starts and ends, in ms (0 or missing: found by listening for it). */
  start?: number
  end?: number
  gain?: number
  /** Silence after it, in ms (default: a short gap). */
  gap?: number
}

/** The gap between stitched parts, and between sentences. */
export const PART_GAP = 40
export const SENTENCE_GAP = 220

/**
 * Where the sound is in a recording, in seconds: from a little before the first sample louder than
 * `threshold` (of the loudest) to a little after the last one.
 */
export function soundBounds(channel: Float32Array, rate: number, { threshold = 0.06, pad = 0.03 } = {}): [number, number] {
  let peak = 0
  for (let i = 0; i < channel.length; i++) peak = Math.max(peak, Math.abs(channel[i]))
  if (!peak) return [0, channel.length / rate]
  const t = peak * threshold
  let a = 0
  while (a < channel.length && Math.abs(channel[a]) < t) a++
  let b = channel.length - 1
  while (b > a && Math.abs(channel[b]) < t) b--
  return [Math.max(0, a / rate - pad), Math.min(channel.length / rate, (b + 1) / rate + pad)]
}

let playing: AudioBufferSourceNode[] = []

/** Stops whatever is playing. */
export function stopParts() {
  for (const s of playing) {
    try { s.stop() } catch { /* already stopped */ }
  }
  playing = []
}

/**
 * Plays the parts in order. Resolves true when done (or when `wanted()` turned false: it was interrupted), and
 * false if any part couldn't be had or decoded (then nothing plays, and the caller tries the next voice).
 */
export async function playParts(parts: Part[], wanted: () => boolean = () => true): Promise<boolean> {
  if (!parts.length) return false
  const c = ac()
  const raw = await Promise.all(parts.map((p) => p.audio))
  if (raw.some((r) => !r)) return false
  let bufs: AudioBuffer[]
  try {
    bufs = await Promise.all(raw.map((r) => c.decodeAudioData(r!.slice(0))))
  } catch {
    return false
  }
  if (!wanted()) return true
  if (c.state !== 'running') await c.resume().catch(() => {})
  const stitched = parts.length > 1
  let t = c.currentTime + 0.03
  const sources: AudioBufferSourceNode[] = []
  parts.forEach((p, i) => {
    const buf = bufs[i]
    let [a, b] = p.start || p.end ? [(p.start ?? 0) / 1000, (p.end || buf.duration * 1000) / 1000] : stitched ? soundBounds(buf.getChannelData(0), buf.sampleRate) : [0, buf.duration]
    b = Math.min(b, buf.duration)
    if (b <= a) [a, b] = [0, buf.duration]
    const src = c.createBufferSource()
    src.buffer = buf
    const g = c.createGain()
    g.gain.value = p.gain ?? 1
    src.connect(g).connect(buses().voice)
    src.start(t, a, b - a)
    sources.push(src)
    t += b - a + (i < parts.length - 1 ? (p.gap ?? PART_GAP) / 1000 : 0)
  })
  playing = sources
  return new Promise((resolve) => {
    const last = sources[sources.length - 1]
    // If iOS suspends audio mid-line (screen locked, a call), `onended` may never fire. Don't hang.
    const safety = setTimeout(done, (t - c.currentTime) * 1000 + 1500)
    function done() {
      clearTimeout(safety)
      if (playing === sources) playing = []
      resolve(true)
    }
    last.onended = done
  })
}
