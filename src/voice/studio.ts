// The recording studio's workings (screens/Studio.tsx is what it looks like): which lines a voice has recorded,
// which changed since, progress per queue, and checking a fresh take (trimming its silence, setting its level).
import { soundBounds } from './player'
import type { Queue, ScriptItem } from './script'

/** A clip as the server's index keeps it (server/house.mjs). */
export interface IndexClip { key: string | null; said: string | null; ref: string | null; at: number; start: number; end: number; gain: number; shared?: boolean; promoted?: boolean }
export interface HouseIndex { version: number; voices: Record<string, { label: string; private?: boolean }>; clips: Record<string, Record<string, IndexClip>> }

export type LineStatus = 'todo' | 'done' | 'changed'

/** A voice's clips, looked up by where they are in the script. */
export function byRef(clips: Record<string, IndexClip> = {}): Map<string, IndexClip> {
  const m = new Map<string, IndexClip>()
  for (const c of Object.values(clips)) if (c.ref && (!m.has(c.ref) || m.get(c.ref)!.at < c.at)) m.set(c.ref, c)
  return m
}

/**
 * A line's status in its voice: done (recorded with these words), changed (recorded, but its words have
 * changed since: record it again), or still to do. `id` is the fingerprint of the line's key.
 */
export function lineStatus(item: ScriptItem, id: string, clips: Record<string, IndexClip> = {}, refs = byRef(clips)): LineStatus {
  const atRef = refs.get(item.ref)
  if (atRef && atRef.said !== null && atRef.said !== item.say) return 'changed'
  return clips[id] ? 'done' : 'todo'
}

/** "412 of 1,030", per queue: done, changed and how many in all. */
export function progress(items: ScriptItem[], ids: Map<ScriptItem, string>, clips: Record<string, IndexClip> = {}): Partial<Record<Queue, { done: number; changed: number; total: number }>> {
  const refs = byRef(clips)
  const out: Partial<Record<Queue, { done: number; changed: number; total: number }>> = {}
  for (const it of items) {
    const q = (out[it.queue] ??= { done: 0, changed: 0, total: 0 })
    q.total++
    const s = lineStatus(it, ids.get(it)!, clips, refs)
    if (s === 'done') q.done++
    if (s === 'changed') q.changed++
  }
  return out
}

/** How loud a take should end up (its average loudness while speaking). */
export const TARGET_RMS = 0.1

/** A take, checked: where its sound starts and ends (ms), the gain to bring it to a steady level, and any problem. */
export interface TakeCheck { start: number; end: number; gain: number; peak: number; warning: '' | 'quiet' | 'loud' | 'empty' }

export function checkTake(channel: Float32Array, rate: number): TakeCheck {
  const [a, b] = soundBounds(channel, rate)
  const from = Math.floor(a * rate)
  const to = Math.min(channel.length, Math.ceil(b * rate))
  let peak = 0
  let sum = 0
  for (let i = from; i < to; i++) {
    const v = Math.abs(channel[i])
    peak = Math.max(peak, v)
    sum += v * v
  }
  const rms = to > from ? Math.sqrt(sum / (to - from)) : 0
  const warning = peak < 0.01 ? 'empty' : peak >= 0.99 ? 'loud' : rms < 0.02 ? 'quiet' : ''
  // (never so much gain that the loudest moment clips)
  const gain = rms ? Math.min(4, Math.max(0.5, TARGET_RMS / rms), 0.98 / Math.max(peak, 0.01)) : 1
  return { start: Math.round(a * 1000), end: Math.round(b * 1000), gain: Math.round(gain * 100) / 100, peak, warning }
}

export const WARNINGS: Record<TakeCheck['warning'], string> = {
  '': '',
  empty: 'Nothing was heard. Check the microphone, and try again.',
  quiet: 'That was quiet. Move a little closer to the microphone and try again.',
  loud: 'That was too loud for the microphone. Move back a little and try again.',
}

/** Where a take is saved: the clip's address, with what it is and how to play it. */
export function saveUrl(voice: string, id: string, item: ScriptItem, take: Pick<TakeCheck, 'start' | 'end' | 'gain'>): string {
  const q = new URLSearchParams({ key: item.key, said: item.say, ref: item.ref, start: String(take.start), end: String(take.end), gain: String(take.gain) })
  return `/voice/house/${voice}/${id}?${q}`
}

/** The printable script for a voice and queue: numbered lines, with how to say each where it helps. */
export function scriptLines(items: ScriptItem[]): string[] {
  return items.map((it, i) => `${i + 1}. ${it.say}${it.context ? `   (${it.context})` : ''}`)
}
