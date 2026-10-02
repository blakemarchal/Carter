// Background music: short original loops played by the synth instruments in audio.ts.
// Each scene has a mood; changing mood crossfades to that tune. No audio files, works offline.
import { ac, bass, buses, chip, kick, mallet, musicBox, pad, pluck, shaker, snare } from './audio'

export type Mood = 'home' | 'story' | 'play' | 'battle'

type Lead = 'mallet' | 'musicBox' | 'pluck' | 'chip'

interface Track {
  bpm: number
  vol: number
  swing?: number // 0..0.5 of an eighth note
  lead?: Lead
  leadVel?: number
  chords: string[] // one per bar
  melody?: string // bars separated by |, 8 eighth-note tokens per bar: note, '-' (hold) or '.' (rest)
  arp?: number[] // music-box arpeggio over chord tones, one per eighth (index into [root, 3rd, 5th, octave])
  bass: [at: number, interval: number, len: number][] // per bar, in eighth notes
  bassVel?: number
  padVel?: number
  kick?: number[]
  snare?: number[]
  shaker?: boolean
}

const TRACKS: Record<Mood, Track> = {
  // Adventure Map and menus: bouncy and sunny.
  home: {
    bpm: 112, vol: 0.7, swing: 0.14, lead: 'mallet', leadVel: 0.8,
    chords: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G'],
    melody:
      'C5 E5 G5 E5 C6 - G5 - | B4 D5 G5 D5 B5 - G5 - | A5 G5 E5 C5 E5 - A5 - | G5 F5 E5 D5 C5 - . . |' +
      'E5 . E5 G5 G5 . C6 . | B5 A5 G5 . D5 - G5 . | A5 - G5 F5 E5 F5 G5 A5 | G5 - D5 - B4 - . .',
    bass: [[0, 0, 2], [3, 7, 1], [4, 0, 2], [6, 7, 1], [7, 12, 1]],
    padVel: 0.8, kick: [0, 4], snare: [2, 6], shaker: true,
  },
  // Bible story pages: a soft music box lullaby, so the words stay front and center.
  story: {
    bpm: 76, vol: 0.75,
    chords: ['F', 'C', 'Dm', 'Bb', 'F', 'C', 'Bb', 'C'],
    arp: [0, 1, 2, 3, 2, 1, 2, 1],
    bass: [[0, 0, 8]], bassVel: 0.55, padVel: 1,
  },
  // Activities (matching, words, numbers, verse): light and curious, out of the narrator's way.
  play: {
    bpm: 100, vol: 0.6, lead: 'pluck', leadVel: 0.7,
    chords: ['G', 'Em', 'C', 'D', 'G', 'Em', 'C', 'D'],
    melody:
      'D5 . B4 . G4 . B4 D5 | E5 . D5 . B4 - . . | C5 . E5 . G5 . E5 C5 | D5 - A4 - F#4 - . . |' +
      'G5 . F#5 . E5 . D5 . | E5 . G5 . B5 - . . | A5 G5 E5 C5 D5 E5 C5 A4 | D5 - - - . . . .',
    bass: [[0, 0, 3], [4, 7, 3]], bassVel: 0.8,
    padVel: 0.6, kick: [0, 4], shaker: true,
  },
  // Friendly battle: brave and bouncy, never scary.
  battle: {
    bpm: 128, vol: 0.6, lead: 'chip', leadVel: 0.9,
    chords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'],
    melody:
      'A4 . C5 E5 A5 - G5 E5 | F5 - E5 - C5 - A4 . | G4 . C5 E5 G5 - E5 G5 | B5 - A5 - G5 - D5 . |' +
      'E5 E5 . E5 A5 - . G5 | A5 G5 F5 E5 F5 - C5 . | E5 G5 C6 - B5 C6 D6 - | B5 - G5 - D5 - G5 .',
    bass: [[0, 0, 1], [1, 0, 1], [2, 12, 1], [3, 0, 1], [4, 0, 1], [5, 0, 1], [6, 12, 1], [7, 7, 1]],
    bassVel: 0.75, padVel: 0.5, kick: [0, 2, 4, 6], snare: [2, 6], shaker: true,
  },
}

// ---------- Notation helpers ----------

const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

function noteMidi(n: string): number {
  const m = /^([A-G])(#|b)?(\d)$/.exec(n)
  if (!m) throw new Error(`bad note ${n}`)
  return 12 * (Number(m[3]) + 1) + PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0)
}

/** 'Am' -> root 57 and the triad, voiced around middle C. */
function chordNotes(name: string) {
  const m = /^([A-G])(#|b)?(m?)$/.exec(name)!
  const root = 48 + ((PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12)
  const third = root + (m[3] ? 3 : 4)
  return { root, tones: [root, third, root + 7, root + 12] }
}

type Hit = { midi: number; len: number }

/** Parses a melody into one slot per eighth note. */
function parseMelody(src: string): (Hit | null)[] {
  const tokens = src.split('|').flatMap((bar) => {
    const t = bar.trim().split(/\s+/)
    if (t.length !== 8) throw new Error(`melody bar needs 8 eighths: "${bar}"`)
    return t
  })
  return tokens.map((tok, i) => {
    if (tok === '.' || tok === '-') return null
    let len = 1
    while (tokens[i + len] === '-') len++
    return { midi: noteMidi(tok), len }
  })
}

const LEADS: Record<Lead, (out: AudioNode, t: number, midi: number, vel: number, len: number) => void> = {
  mallet: (o, t, m, v, len) => mallet(o, t, m, v, Math.max(0.35, len * 0.25)),
  musicBox: (o, t, m, v) => musicBox(o, t, m, v),
  pluck: (o, t, m, v, len) => pluck(o, t, m, v, Math.max(0.3, len * 0.22)),
  chip: (o, t, m, v, len) => chip(o, t, m, len * 0.21, v),
}

// ---------- Player ----------

interface Player {
  mood: Mood
  stop(): void
}

function startTrack(mood: Mood): Player {
  const c = ac()
  const tr = TRACKS[mood]
  const chords = tr.chords.map(chordNotes)
  const melody = tr.melody ? parseMelody(tr.melody) : []
  const total = tr.chords.length * 8
  const eighth = 60 / tr.bpm / 2

  const out = c.createGain()
  out.gain.setValueAtTime(0.0001, c.currentTime)
  out.gain.exponentialRampToValueAtTime(tr.vol, c.currentTime + 1.5)
  out.connect(buses().music)

  const schedule = (step: number, t: number) => {
    const bar = Math.floor(step / 8)
    const i = step % 8
    const ch = chords[bar]
    if (i % 2 === 1 && tr.swing) t += tr.swing * eighth
    if (i === 0 && tr.padVel) pad(out, t, ch.tones.slice(0, 3).map((n) => n + 12), eighth * 8, tr.padVel)
    for (const [at, iv, len] of tr.bass) if (at === i) bass(out, t, ch.root - 12 + iv, len * eighth, tr.bassVel ?? 1)
    const hit = melody[step]
    if (hit && tr.lead) LEADS[tr.lead](out, t, hit.midi, tr.leadVel ?? 1, hit.len)
    if (tr.arp) musicBox(out, t, ch.tones[tr.arp[i]] + 24, i === 0 ? 0.8 : 0.55, 1.6)
    if (tr.kick?.includes(i)) kick(out, t, 0.7)
    if (tr.snare?.includes(i)) snare(out, t, 0.45)
    if (tr.shaker) shaker(out, t, i % 2 ? 1 : 0.5)
  }

  let step = 0
  let next = c.currentTime + 0.15
  const timer = setInterval(() => {
    // If the page stalled, skip ahead instead of playing a burst of late notes.
    if (next < c.currentTime - 0.05) next = c.currentTime + 0.05
    while (next < c.currentTime + 0.25) {
      schedule(step, next)
      step = (step + 1) % total
      next += eighth
    }
  }, 60)

  return {
    mood,
    stop() {
      clearInterval(timer)
      const now = c.currentTime
      out.gain.cancelScheduledValues(now)
      out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), now)
      out.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)
      setTimeout(() => out.disconnect(), 1500)
    },
  }
}

let enabled = true
let ready = false
let mood: Mood | null = null
let player: Player | null = null

function refresh() {
  const want = enabled && ready ? mood : null
  if ((player?.mood ?? null) === want) return
  player?.stop()
  player = null
  try {
    if (want) player = startTrack(want)
  } catch {
    /* audio unavailable */
  }
}

export function setMusicEnabled(on: boolean) {
  enabled = on
  refresh()
}

/** Which tune should be playing. null = silence. */
export function setMood(m: Mood | null) {
  mood = m
  refresh()
}

/** Call after the first tap has unlocked audio. */
export function musicReady() {
  ready = true
  refresh()
}
