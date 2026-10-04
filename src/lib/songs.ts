// Playing sing-along songs, and the songs a parent adds in the Parent Corner.
// Songs play through the game's own audio (lib/audio.ts), so they start without another tap on
// iOS, pause with the app, and keep exact time for the words lighting up. The service worker
// keeps each song after its first play, so they work offline too.
import { useEffect, useRef, useState } from 'react'
import { ac, buses } from './audio'
import { speak } from './speech'
import { timedLines, type Song } from '../data/songs'

// ---------- playback ----------

const decoded = new Map<string, Promise<AudioBuffer>>()

/** Downloads and decodes a song (the last two stay in memory: both versions of the current song). */
export function loadSong(url: string): Promise<AudioBuffer> {
  let p = decoded.get(url)
  if (!p) {
    p = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.arrayBuffer()
      })
      .then((data) => ac().decodeAudioData(data))
    p.catch(() => decoded.delete(url))
    decoded.set(url, p)
    while (decoded.size > 2) decoded.delete(decoded.keys().next().value!)
  }
  return p
}

/** One song playing. `time()` is where it is (seconds); it can pause, resume and jump. */
export class Playback {
  private source: AudioBufferSourceNode | null = null
  private startedAt = 0
  private offset = 0
  private gain: GainNode
  playing = false
  onEnd: (() => void) | null = null

  constructor(public buffer: AudioBuffer) {
    this.gain = ac().createGain()
    this.gain.connect(buses().song)
  }

  get duration() {
    return this.buffer.duration
  }

  time() {
    return this.playing ? Math.min(this.duration, ac().currentTime - this.startedAt) : this.offset
  }

  play(from = this.offset) {
    this.stopSource()
    const c = ac()
    if (c.state !== 'running') c.resume()
    const s = c.createBufferSource()
    s.buffer = this.buffer
    s.connect(this.gain)
    const at = Math.max(0, Math.min(from, this.duration - 0.05))
    s.start(0, at)
    this.startedAt = c.currentTime - at
    this.source = s
    this.playing = true
    s.onended = () => {
      if (this.source !== s) return
      this.playing = false
      this.offset = 0
      this.source = null
      this.onEnd?.()
    }
  }

  pause() {
    this.offset = this.time()
    this.stopSource()
    this.playing = false
  }

  /** Swap to another recording of the same song (Ara singing <-> sing it yourself), same place. */
  swap(buffer: AudioBuffer) {
    const at = this.time()
    const was = this.playing
    this.stopSource()
    this.buffer = buffer
    this.offset = at
    if (was) this.play(at)
  }

  stop() {
    this.stopSource()
    this.playing = false
    this.offset = 0
    this.gain.disconnect()
  }

  private stopSource() {
    const s = this.source
    this.source = null
    if (s) {
      s.onended = null
      try {
        s.stop()
      } catch {
        /* already stopped */
      }
    }
  }
}

/**
 * For a playing song with a name in it ("Happy birthday, dear ___"): call with the time as it plays,
 * and it says the name where it goes (only while Ara is singing; when they sing, they say it).
 */
export function useNameSlot(song: Song, name: string, araSinging: () => boolean) {
  const said = useRef(false)
  return (t: number) => {
    if (!song.name) return
    if (t < song.name[0] - 0.5) said.current = false // back to the start: say it again next time
    else if (!said.current && t >= song.name[0] - 0.04 && t < song.name[1]) {
      said.current = true
      if (araSinging()) speak(`${name}!`)
    }
  }
}

// ---------- family songs (kept on the server: server/songs.mjs) ----------

export interface FamilySong {
  id: string
  title?: string
  lines?: string[]
  times?: number[]
  /** Version stamp of the recording, or null when it has none yet. */
  audio: number | null
}

let family: FamilySong[] = []
let loaded = false
const listeners = new Set<() => void>()
const changed = () => listeners.forEach((f) => f())

export async function loadFamilySongs() {
  try {
    const r = await fetch('/songs', { cache: 'no-store' })
    if (r.ok) family = await r.json()
  } catch {
    /* offline: keep what we had */
  }
  loaded = true
  changed()
}

export const familyAudioUrl = (s: FamilySong) => `/songs/${s.id}/audio?v=${s.audio}`

/** Family songs that are ready to sing (they have a recording), as Songs. */
export function familyAsSongs(list = family): Song[] {
  return list
    .filter((s) => s.audio)
    .map((s, i) => ({
      id: `family:${s.id}`,
      title: s.title || 'Our song',
      emoji: ['🎶', '💗', '🎤', '🌈'][i % 4],
      color: '#ff9ec9',
      family: true,
      audio: { ara: familyAudioUrl(s) },
      // Word timings are filled in once the recording's length is known (see withTimings).
      lines: timedLines(s.lines ?? [], s.times ?? [], 60),
    }))
}

/** A family song's lines, spread over the real length of its recording. */
export function withTimings(song: Song, duration: number): Song {
  if (!song.family) return song
  const f = family.find((x) => `family:${x.id}` === song.id)
  return f ? { ...song, lines: timedLines(f.lines ?? [], f.times ?? [], duration) } : song
}

export function useFamilySongs() {
  const [, set] = useState(0)
  useEffect(() => {
    const f = () => set((n) => n + 1)
    listeners.add(f)
    if (!loaded) loadFamilySongs()
    return () => { listeners.delete(f) }
  }, [])
  return family
}

const slug = (title: string) =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'song'}-${Math.random().toString(36).slice(2, 7)}`

async function ok(r: Response) {
  if (r.status === 507) throw new Error("Your family's songs are full. Delete one to make room.")
  if (!r.ok) throw new Error((await r.text().catch(() => '')) || `HTTP ${r.status}`)
}

/** Adds a song: its title, words (one line each) and recording. Returns its id. */
export async function addFamilySong(title: string, lines: string[], file: File): Promise<string> {
  const id = slug(title)
  await ok(await fetch(`/songs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, lines }) }))
  try {
    await ok(await fetch(`/songs/${id}/audio`, { method: 'PUT', headers: { 'Content-Type': file.type || 'audio/mpeg' }, body: file }))
  } catch (e) {
    await fetch(`/songs/${id}`, { method: 'DELETE' }).catch(() => {})
    throw e
  }
  await loadFamilySongs()
  return id
}

export async function saveFamilySong(id: string, meta: { title?: string; lines?: string[]; times?: number[] }) {
  await ok(await fetch(`/songs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(meta) }))
  await loadFamilySongs()
}

export async function deleteFamilySong(id: string) {
  await ok(await fetch(`/songs/${id}`, { method: 'DELETE' }))
  await loadFamilySongs()
}
