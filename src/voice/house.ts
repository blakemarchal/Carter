// The house voices on this device (server/house.mjs): which clips each voice has recorded, asked of the server
// when the game starts and kept for offline play. A clip's audio is fetched the first time it's played, and the
// device keeps it (its address carries its version, so a re-recorded line is fetched again).
import { NS } from '../lib/storageKeys'
import { fingerprint } from './keys'
import type { Voice } from './roles'

/** A clip: its version, where its sound starts and ends (ms; 0 = the whole recording) and how loud to play it. */
export type ClipInfo = [v: string, start: number, end: number, gain: number]
export interface HouseManifest { version: number; voices: Record<string, { label: string }>; clips: Record<string, Record<string, ClipInfo>> }

const KEY = `${NS}-voice:house`
let manifest: HouseManifest | null = null
const listeners = new Set<() => void>()

function saved(): HouseManifest | null {
  try {
    const m = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    return m && typeof m === 'object' && m.clips ? m : null
  } catch {
    return null
  }
}

/** Asks the server what the house voices have recorded (keeps the last answer when offline). */
export async function loadHouse() {
  manifest ??= saved()
  try {
    const r = await fetch('/voice/house', { cache: 'no-store' })
    if (r.ok) {
      manifest = await r.json()
      try { localStorage.setItem(KEY, JSON.stringify(manifest)) } catch { /* storage full: kept in memory */ }
    }
  } catch { /* offline */ }
  listeners.forEach((l) => l())
}
export const onHouseChange = (l: () => void) => (listeners.add(l), () => { listeners.delete(l) })
/** For tests, and the studio after it saves. */
export function setHouse(m: HouseManifest | null) {
  manifest = m
  listeners.forEach((l) => l())
}
export const houseManifest = () => manifest ?? (manifest = saved())

/** What a voice recorded under this fingerprint, or null. */
export function clipInfo(voice: Voice, id: string): ClipInfo | null {
  return houseManifest()?.clips[voice]?.[id] ?? null
}

export const clipUrl = (voice: Voice, id: string, v: string) => `/voice/house/${voice}/${id}?v=${v}`

const audio = new Map<string, Promise<ArrayBuffer | null>>()
const MAX_AUDIO = 300

/** A clip's audio (kept in memory for a while; the device keeps it too). */
export function clipAudio(voice: Voice, id: string, v: string): Promise<ArrayBuffer | null> {
  const url = clipUrl(voice, id, v)
  const hit = audio.get(url)
  if (hit) {
    audio.delete(url)
    audio.set(url, hit)
    return hit
  }
  const p = fetch(url).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null)
  p.then((b) => { if (!b) audio.delete(url) })
  audio.set(url, p)
  while (audio.size > MAX_AUDIO) audio.delete(audio.keys().next().value!)
  return p
}

/** The first of `voices` that recorded `key`: its voice, fingerprint and clip, or null. */
export async function houseFind(voices: Voice[], key: string): Promise<{ voice: Voice; id: string; info: ClipInfo } | null> {
  if (!houseManifest()) return null
  const id = await fingerprint(key)
  for (const voice of voices) {
    const info = clipInfo(voice, id)
    if (info) return { voice, id, info }
  }
  return null
}
