// Rhythm: tap along with the music (types.ts, RhythmKit). The island turns its music off for this
// step, so the game makes all its own sound: a synthesized instrument (harp, tambourine, drum or
// trumpet), a soft backing that keeps the beat, and a one-bar count-in. Each note of the tune glows in
// from the side and reaches the big circle on its beat; a tap near then (about a quarter of a beat
// either way) plays it brightly, with a sparkle. A tap off the beat still makes a soft note, and a
// note nobody taps plays quietly by itself, so the tune always comes out whole and tapping never feels
// wrong. Sound and pictures both run on the audio clock (AudioContext.currentTime), never on timers,
// so it keeps time on an iPad. At the end: a fanfare, a kind word about how she played, the island's
// line, and the choice to play again or go on.
import { useEffect, useId, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import type { RhythmKit } from './types'
import { Board, BoardLayer } from './Board'
import { BigButton, Confetti } from '../../components/ui'
import { ac, buses, kick, midiHz, musicBox, noiseBuffer, pad, unlockAudio } from '../../lib/audio'
import { sparkle } from '../../art/scenes/kit'
import { speak, stopSpeaking } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import { numberWords } from '../../lib/spoken'
import { useAlive } from '../../lib/useAlive'
import { wait } from '../../lib/util'
import './Rhythm.css'

type Instrument = RhythmKit['instrument']

const LEAD = 2.5 // beats a note is on its way before it reaches the circle
const EARLY = 0.3 // a tap this many beats before a note still plays it…
const LATE = 0.36 // …and this many after (small hands tap a little late)
const LOOKAHEAD = 0.25 // seconds of sound scheduled ahead of the audio clock
const TX = 610, TY = 245, R = 64 // the big circle to tap
const FROM_X = 880 // where the notes fly in from (just off the board)
const QUIET = 0.3 // how loud a note plays by itself
const SOFT = 0.45 // how loud a tap off the beat plays
const IDLE = 6.5 // seconds without a tap before the hand shows when to tap again

// ---------- The song: the tune, its beat, and chords to go with it ----------

const MAJOR = [0, 2, 4, 5, 7, 9, 11]
/** The chords of a major key: root, third and fifth above the key note, and how much we like each. */
const TRIADS: [number, number, number, number][] = [[0, 4, 7, 1], [5, 9, 0, 0.75], [7, 11, 2, 0.75], [9, 0, 4, 0.45], [2, 5, 9, 0.35], [4, 7, 11, 0.2]]
const pcOf = (m: number) => ((Math.round(m) % 12) + 12) % 12
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

interface Song {
  notes: [number, number][]
  /** How long each note lasts, in beats (until the next one, at most a beat and a half). */
  lens: number[]
  /** Seconds a beat. */
  beat: number
  /** Beats of backing (whole bars of four). */
  length: number
  /** The beat when it's all over. */
  end: number
  /** The chord for each half bar (two beats): its notes as pitch classes, root first. */
  chords: number[][]
  /** The middle of the tune (notes above it fly in higher). */
  mid: number
}

function prepare(kit: RhythmKit): Song {
  const notes = [...kit.notes]
    .filter(([b, m]) => Number.isFinite(b) && Number.isFinite(m) && b >= 0)
    .map(([b, m]): [number, number] => [b, Math.round(m)])
    .sort((a, b) => a[0] - b[0])
  const lens = notes.map(([b], i) => clamp((notes[i + 1]?.[0] ?? b + 1.5) - b, 0.25, 1.5))
  const bpm = clamp(Number(kit.bpm) || 80, 50, 140)
  const last = notes.length ? notes[notes.length - 1][0] : 0
  const length = Math.ceil((last + 1) / 4) * 4
  // The key: the major scale that fits the notes best, ending at home if it can.
  const weight = new Array(12).fill(0)
  notes.forEach(([, m], i) => { weight[pcOf(m)] += lens[i] })
  let key = 0, bestKey = -Infinity
  for (let k = 0; k < 12; k++) {
    let sc = 0
    for (let pc = 0; pc < 12; pc++) sc += weight[pc] * (MAJOR.includes((pc - k + 12) % 12) ? 1 : -1.2)
    if (notes.length && pcOf(notes[notes.length - 1][1]) === k) sc += 1.5
    if (sc > bestKey) (bestKey = sc), (key = k)
  }
  // A chord for every half bar: the one whose notes the tune lands on most, changing only when it helps.
  const pick: number[] = []
  for (let h = 0; h < length / 2; h++) {
    const lo = h * 2, hi = lo + 2
    const inside = notes.map((n, i) => ({ b: n[0], pc: pcOf(n[1]), len: lens[i] })).filter((n) => n.b >= lo && n.b < hi)
    if (!inside.length) { pick.push(pick[h - 1] ?? 0); continue }
    let best = 0, bestScore = -Infinity
    TRIADS.forEach(([r, t, f, like], c) => {
      const tones = [r, t, f].map((x) => (x + key) % 12)
      let sc = like * 0.6 + (c === pick[h - 1] ? 0.35 : 0)
      for (const n of inside) {
        const w = Math.min(n.len, hi - n.b) * (n.b === lo ? 1.5 : 1)
        sc += w * (tones.includes(n.pc) ? 1 : MAJOR.includes((n.pc - key + 12) % 12) ? -0.3 : -1)
      }
      if (sc > bestScore) (bestScore = sc), (best = c)
    })
    pick.push(best)
  }
  // …and it ends at home.
  if (notes.length && [0, 4, 7].map((x) => (x + key) % 12).includes(pcOf(notes[notes.length - 1][1]))) {
    for (let h = Math.floor(last / 2); h < pick.length; h++) pick[h] = 0
  }
  const pitches = notes.map((n) => n[1])
  return {
    notes, lens, beat: 60 / bpm, length,
    end: Math.max(last + 1.5, length - 0.5),
    chords: pick.map((c) => TRIADS[c].slice(0, 3).map((x) => (x + key) % 12)),
    mid: pitches.length ? (Math.min(...pitches) + Math.max(...pitches)) / 2 : 64,
  }
}

// ---------- The clock: the audio clock (what she hears), or the plain clock if sound can't start ----------

interface Clock {
  sound: boolean
  /** Seconds, now. */
  now(): number
  /** Seconds at a moment given as performance.now() milliseconds (when a finger touched). */
  at(perfMs: number): number
  stop(): void
}

function audioClock(c: AudioContext): Clock {
  let last = -Infinity
  let seen = -1, seenAt = 0 // when currentTime last moved on (it moves in small steps)
  const at = (pms: number) => {
    // The moment being heard right now: the output timestamp says which audio time reached the
    // speakers at which performance time (it allows for the speakers' delay).
    const ts = typeof c.getOutputTimestamp === 'function' ? c.getOutputTimestamp() : null
    if (ts && ts.performanceTime && ts.contextTime !== undefined && c.state === 'running' && Math.abs(pms - ts.performanceTime) < 300) {
      return ts.contextTime + (pms - ts.performanceTime) / 1000
    }
    // Without one: currentTime, smoothed between its steps so the notes glide rather than stutter.
    const now = performance.now(), ct = c.currentTime
    if (ct !== seen) (seen = ct), (seenAt = now)
    const t = c.state === 'running' ? ct + Math.min(0.06, (now - seenAt) / 1000) : ct
    return t - (c.outputLatency || 0) - Math.max(0, now - pms) / 1000
  }
  return {
    sound: true, at,
    now: () => (last = Math.max(last, at(performance.now()))),
    stop() {},
  }
}

function plainClock(): Clock {
  // (It stops while the app is in the background, as the audio clock does.)
  let base = performance.now(), acc = 0, paused = document.hidden
  const onVis = () => {
    if (document.hidden && !paused) (acc += performance.now() - base), (paused = true)
    else if (!document.hidden && paused) (base = performance.now()), (paused = false)
  }
  document.addEventListener('visibilitychange', onVis)
  const at = (pms: number) => (acc + (paused ? 0 : Math.max(0, pms - base))) / 1000
  return { sound: false, at, now: () => at(performance.now()), stop: () => document.removeEventListener('visibilitychange', onVis) }
}

/** The audio context, if there can be one. */
function audio(): AudioContext | null {
  try {
    return ac()
  } catch {
    return null
  }
}

/** Whether the audio clock is really ticking (it may need a tap to start on an iPad). */
async function ticking(c: AudioContext, ms = 350): Promise<boolean> {
  if (c.state !== 'running') await Promise.race([c.resume().catch(() => {}), wait(400)])
  const t0 = c.currentTime, p0 = performance.now()
  await wait(ms)
  return c.state === 'running' && c.currentTime - t0 > (performance.now() - p0) / 2000
}

// ---------- The instruments, synthesized ----------

/** A note that has been started (or is waiting to start), which can be hushed. */
interface Played { hush(): void }

/** A note's own volume control, so it can be hushed (or never start). */
function voice(c: AudioContext, out: AudioNode, t: number) {
  const g = c.createGain()
  g.connect(out)
  const sources: AudioScheduledSourceNode[] = []
  const played: Played = {
    hush() {
      const now = c.currentTime
      if (t > now + 0.004) {
        for (const s of sources) { try { s.stop() } catch { /* already */ } }
        return
      }
      g.gain.cancelScheduledValues(now)
      g.gain.setValueAtTime(g.gain.value, now)
      g.gain.linearRampToValueAtTime(0, now + 0.05)
    },
  }
  return { g, sources, played }
}

function osc(c: AudioContext, type: OscillatorType, f: number, t: number, end: number, to: AudioNode, sources: AudioScheduledSourceNode[]) {
  const o = c.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  o.connect(to)
  o.start(t)
  o.stop(end)
  sources.push(o)
  return o
}

function noise(c: AudioContext, t: number, dur: number, to: AudioNode, sources: AudioScheduledSourceNode[]) {
  const s = c.createBufferSource()
  s.buffer = noiseBuffer()
  s.connect(to)
  s.start(t, Math.random() * 0.5)
  s.stop(t + dur)
  sources.push(s)
}

function env(p: AudioParam, t: number, peak: number, attack: number, decay: number) {
  p.setValueAtTime(0.0001, t)
  p.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack)
  p.exponentialRampToValueAtTime(0.0001, t + attack + decay)
}

/**
 * A harp string: a Karplus-Strong pluck (a burst of soft noise fed round a delay one wavelength
 * long, losing a little each time round), worked out once per note into a buffer.
 */
function harpString(c: AudioContext, midi: number) {
  const sr = c.sampleRate, f = midiHz(midi)
  const N = Math.max(2, Math.round(sr / f - 0.5))
  const rate = (f * (N + 0.5)) / sr // (the loop's averaging adds half a sample; playbackRate puts it in tune)
  const T = clamp(3.2 * Math.sqrt(262 / f), 1.2, 4) // low strings ring longer
  const len = Math.ceil(sr * T)
  const buf = c.createBuffer(1, len, sr)
  const d = buf.getChannelData(0)
  let lp = 0, mean = 0
  for (let i = 0; i < N; i++) { lp += 0.5 * (Math.random() * 2 - 1 - lp); d[i] = lp; mean += lp }
  for (let i = 0; i < N; i++) d[i] -= mean / N
  const rho = Math.pow(0.001, 1 / (T * f))
  for (let i = N; i < len; i++) d[i] = rho * 0.5 * (d[i - N] + d[Math.max(0, i - N - 1)])
  let peak = 1e-6
  for (let i = 0; i < Math.min(len, N * 4); i++) peak = Math.max(peak, Math.abs(d[i]))
  const fade = Math.floor(sr * 0.05)
  for (let i = 0; i < len; i++) d[i] *= (0.8 / peak) * (i > len - fade ? (len - i) / fade : 1)
  return { buf, rate }
}

type Bank = Map<number, { buf: AudioBuffer; rate: number }>

function harp(c: AudioContext, out: AudioNode, bank: Bank, t: number, midi: number, vel: number, bright: boolean): Played {
  const v = voice(c, out, t)
  let s = bank.get(midi)
  if (!s) bank.set(midi, (s = harpString(c, midi)))
  const src = c.createBufferSource()
  src.buffer = s.buf
  src.playbackRate.value = s.rate
  const f = c.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = bright ? 6500 : 1700
  f.Q.value = 0.4
  const g = c.createGain()
  g.gain.value = 0.75 * vel
  src.connect(f).connect(g).connect(v.g)
  src.start(t)
  v.sources.push(src)
  return v.played
}

function tambourine(c: AudioContext, out: AudioNode, t: number, midi: number, vel: number, bright: boolean): Played {
  const v = voice(c, out, t)
  const tone = 2 ** ((midi - 67) / 36)
  // A tap on the skin…
  const sg = c.createGain()
  env(sg.gain, t, 0.22 * vel, 0.002, 0.08)
  sg.connect(v.g)
  osc(c, 'sine', 230 * tone, t, t + 0.12, sg, v.sources).frequency.exponentialRampToValueAtTime(150 * tone, t + 0.08)
  // …the jingles rattling…
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 5200 * tone
  const bp = c.createBiquadFilter()
  bp.type = 'peaking'
  bp.frequency.value = 9000 * tone
  bp.gain.value = 5
  hp.connect(bp).connect(v.g)
  ;[0, 0.019, 0.036, 0.058].forEach((dt, k) => {
    const g = c.createGain()
    env(g.gain, t + dt, (bright ? 0.36 : 0.26) * vel * [1, 0.65, 0.4, 0.22][k], 0.0015, bright ? 0.11 : 0.07)
    g.connect(hp)
    noise(c, t + dt, 0.16, g, v.sources)
  })
  // …and ringing a moment, like little bells.
  for (const fr of [3150, 4630, 6020, 7410]) {
    const g = c.createGain()
    env(g.gain, t, 0.028 * vel, 0.002, bright ? 0.32 : 0.18)
    g.connect(v.g)
    osc(c, 'sine', fr * tone, t, t + 0.4, g, v.sources)
  }
  // The jingles barely change pitch, so a little bell rings the tune's own note: the melody comes through.
  musicBox(v.g, t, above(midi, 12), 0.55 * vel, bright ? 0.9 : 0.6)
  return v.played
}

/** `midi` raised by `up` semitones, or by one octave less when that would go past the highest bell (C7). */
const above = (midi: number, up: number) => (midi + up <= 96 ? midi + up : midi + up - 12)

function drum(c: AudioContext, out: AudioNode, t: number, midi: number, vel: number, bright: boolean): Played {
  const v = voice(c, out, t)
  // A hand drum, pitched in the range small speakers play: the tune's high and low notes are higher and lower drums.
  const f = 140 * 2 ** ((midi - 60) / 24)
  const body = c.createGain()
  env(body.gain, t, 0.5 * vel, 0.003, bright ? 0.45 : 0.3)
  body.connect(v.g)
  osc(c, 'sine', f * 1.5, t, t + 0.55, body, v.sources).frequency.exponentialRampToValueAtTime(f, t + 0.05)
  // (the drumhead's ring above the thump)
  const ring = c.createGain()
  env(ring.gain, t, 0.22 * vel, 0.002, bright ? 0.2 : 0.12)
  ring.connect(v.g)
  osc(c, 'triangle', f * 2.3, t, t + 0.25, ring, v.sources)
  // (and the slap of the hand)
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = bright ? 1600 : 900
  bp.Q.value = 0.8
  const slap = c.createGain()
  env(slap.gain, t, (bright ? 0.32 : 0.2) * vel, 0.001, 0.045)
  slap.connect(bp).connect(v.g)
  noise(c, t, 0.07, slap, v.sources)
  return v.played
}

function trumpet(c: AudioContext, out: AudioNode, t: number, midi: number, vel: number, bright: boolean, len: number): Played {
  const v = voice(c, out, t)
  const f = midiHz(midi)
  const end = t + Math.max(0.18, len)
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.Q.value = 1
  lp.frequency.setValueAtTime(450, t)
  lp.frequency.exponentialRampToValueAtTime(bright ? 2700 : 1300, t + 0.05)
  lp.frequency.exponentialRampToValueAtTime(bright ? 1900 : 1000, t + 0.25)
  const amp = c.createGain()
  amp.gain.setValueAtTime(0.0001, t)
  amp.gain.exponentialRampToValueAtTime(0.2 * vel, t + 0.022)
  amp.gain.exponentialRampToValueAtTime(0.15 * vel, t + 0.16)
  amp.gain.setValueAtTime(0.15 * vel, end)
  amp.gain.exponentialRampToValueAtTime(0.0001, end + 0.12)
  lp.connect(amp).connect(v.g)
  // A little scoop up into the note, and a gentle vibrato once it's sounding.
  const lfo = c.createOscillator()
  lfo.frequency.value = 5.2
  const depth = c.createGain()
  depth.gain.setValueAtTime(0, t)
  depth.gain.linearRampToValueAtTime(0, t + 0.12)
  depth.gain.linearRampToValueAtTime(8, t + 0.35)
  lfo.connect(depth)
  lfo.start(t)
  lfo.stop(end + 0.2)
  v.sources.push(lfo)
  const square = c.createGain()
  square.gain.value = 0.35
  square.connect(lp)
  for (const [type, to] of [['sawtooth', lp], ['square', square]] as const) {
    const o = osc(c, type, f, t, end + 0.2, to, v.sources)
    o.detune.setValueAtTime(-40, t)
    o.detune.linearRampToValueAtTime(type === 'square' ? 4 : 0, t + 0.06)
    depth.connect(o.detune)
  }
  return v.played
}

/** A woodblock click for the count-in (higher on the first beat). */
function click(c: AudioContext, out: AudioNode, t: number, first: boolean) {
  const sources: AudioScheduledSourceNode[] = []
  const g = c.createGain()
  env(g.gain, t, first ? 0.32 : 0.24, 0.002, 0.06)
  g.connect(out)
  osc(c, 'sine', first ? 1760 : 1320, t, t + 0.1, g, sources)
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 2600
  bp.Q.value = 3
  const n = c.createGain()
  env(n.gain, t, 0.3, 0.001, 0.03)
  n.connect(bp).connect(out)
  noise(c, t, 0.05, n, sources)
}

/** A soft plucked bass note for the backing, in the range small speakers can still play. */
function softBass(c: AudioContext, out: AudioNode, t: number, midi: number, dur: number) {
  const sources: AudioScheduledSourceNode[] = []
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(900, t)
  lp.frequency.exponentialRampToValueAtTime(350, t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  lp.connect(g).connect(out)
  osc(c, 'triangle', midiHz(midi), t, t + dur + 0.05, lp, sources)
  osc(c, 'sine', midiHz(midi + 12), t, t + dur + 0.05, lp, sources)
}

/** The pulse under the music: a soft tick on every beat (a little stronger on the first of the bar). */
function tick(c: AudioContext, out: AudioNode, t: number, strong: boolean, instrument: Instrument) {
  const sources: AudioScheduledSourceNode[] = []
  if (instrument === 'tambourine') {
    // (a wooden tock, so it isn't mistaken for her tambourine)
    const g = c.createGain()
    env(g.gain, t, strong ? 0.12 : 0.08, 0.002, 0.05)
    g.connect(out)
    osc(c, 'sine', strong ? 900 : 760, t, t + 0.08, g, sources)
  } else {
    const hp = c.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 6500
    const g = c.createGain()
    env(g.gain, t, strong ? 0.1 : 0.06, 0.002, 0.045)
    g.connect(hp).connect(out)
    noise(c, t, 0.07, g, sources)
  }
  if (strong && instrument !== 'drum') kick(out, t, 0.18)
}

/** Plays one note of the tune on the kit's instrument. */
function note(c: AudioContext, out: AudioNode, bank: Bank, instrument: Instrument, t: number, midi: number, vel: number, bright: boolean, len: number): Played {
  switch (instrument) {
    case 'tambourine': return tambourine(c, out, t, midi, vel, bright)
    case 'drum': return drum(c, out, t, midi, vel, bright)
    case 'trumpet': return trumpet(c, out, t, midi, vel, bright, len)
    default: return harp(c, out, bank, t, midi, vel, bright)
  }
}

// ---------- Pictures ----------

const NOTE_COLORS = ['#ff6b6b', '#ff8c42', '#ffb627', '#ffd34d', '#9bd85a', '#4cc98a', '#3fc1c9', '#4ea8ff', '#6f8cff', '#9b7bff', '#d07bff', '#ff7bc0']

/** An eighth note, in white, centred on (0, 0). */
const NoteGlyph = () => (
  <g fill="#ffffff">
    <ellipse cx={-4} cy={7} rx={6.5} ry={4.8} transform="rotate(-22 -4 7)" />
    <rect x={1.2} y={-13} width={3.2} height={20} rx={1.4} />
    <path d="M3 -13 C 9 -10 12 -6 9 0 C 10 -5 7 -7 3 -8 Z" />
  </g>
)

/** The instrument, drawn in the middle of the circle. */
function InstrumentIcon({ kind }: { kind: Instrument }) {
  const ink = '#6b4a2a'
  switch (kind) {
    case 'tambourine':
      return (
        <g>
          <circle r={33} fill="#fff1d6" stroke="#c98a3d" strokeWidth={9} />
          <circle r={33} fill="none" stroke={ink} strokeWidth={2} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <g key={a} transform={`rotate(${a}) translate(0 -33)`}>
              <rect x={-9} y={-6} width={18} height={12} rx={3} fill="#fff1d6" stroke={ink} strokeWidth={1.5} />
              <circle cx={-4} r={4.5} fill="#ffd34d" stroke="#b8860b" strokeWidth={1.5} />
              <circle cx={4} r={4.5} fill="#ffd34d" stroke="#b8860b" strokeWidth={1.5} />
            </g>
          ))}
          <path d="M22 24 q10 8 4 18 M26 22 q14 4 12 16" fill="none" stroke="#ff6fae" strokeWidth={4} strokeLinecap="round" />
        </g>
      )
    case 'drum':
      return (
        <g>
          <path d="M-31 -8 L-31 22 Q0 38 31 22 L31 -8 Z" fill="#e76f51" stroke={ink} strokeWidth={3} strokeLinejoin="round" />
          <path d="M-31 -2 L-15 24 L0 2 L15 26 L31 -2" fill="none" stroke="#ffd9a0" strokeWidth={3} strokeLinejoin="round" />
          <ellipse cy={-8} rx={31} ry={11} fill="#fff4dc" stroke={ink} strokeWidth={3} />
          <path d="M-20 -34 L-4 -14 M22 -36 L6 -15" stroke={ink} strokeWidth={5} strokeLinecap="round" />
          <circle cx={-21} cy={-35} r={5} fill="#ffd34d" stroke={ink} strokeWidth={2} />
          <circle cx={23} cy={-37} r={5} fill="#ffd34d" stroke={ink} strokeWidth={2} />
        </g>
      )
    case 'trumpet':
      return (
        <g transform="translate(-2 4)">
          <path d="M-36 -2 L12 -2 L12 6 L-36 6 Z" fill="#ffd34d" stroke={ink} strokeWidth={2.5} />
          <path d="M10 -3 Q22 -6 36 -22 L36 30 Q22 12 10 9 Z" fill="#ffd34d" stroke={ink} strokeWidth={3} strokeLinejoin="round" />
          <path d="M-30 6 Q-30 20 -16 20 L4 20 Q12 20 12 10" fill="none" stroke={ink} strokeWidth={8} strokeLinecap="round" />
          <path d="M-30 6 Q-30 20 -16 20 L4 20 Q12 20 12 10" fill="none" stroke="#ffd34d" strokeWidth={4} strokeLinecap="round" />
          {[-20, -10, 0].map((x) => <rect key={x} x={x - 3} y={-14} width={6} height={12} rx={2} fill="#fff1b0" stroke={ink} strokeWidth={2} />)}
          <rect x={-42} y={-4} width={7} height={12} rx={2} fill="#e0b030" stroke={ink} strokeWidth={2} />
        </g>
      )
    default: {
      // A harp: the pillar, the curved neck, the sound box, and strings between.
      const strings = [-17, -9, -1, 7, 15, 23]
      return (
        <g transform="translate(-2 0)">
          {strings.map((x) => (
            <line key={x} x1={x} y1={-36 + ((x + 26) / 56) * 8 + 4} x2={x} y2={-28 + ((32 - x) / 52) * 66} stroke="#c98a3d" strokeWidth={2} />
          ))}
          <path d="M32 -28 L-20 38" stroke="#b5651d" strokeWidth={11} strokeLinecap="round" />
          <path d="M-26 40 L-26 -34 Q-6 -50 12 -32 Q22 -22 32 -30" fill="none" stroke="#8b4a1c" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={-26} cy={-36} r={5} fill="#ffd34d" stroke={ink} strokeWidth={2} />
        </g>
      )
    }
  }
}

/** A friendly pointing hand, its fingertip at (0, 0). */
function Hand() {
  const shapes = (
    <>
      <rect x={-9} y={-2} width={18} height={48} rx={9} />
      <rect x={-15} y={30} width={52} height={48} rx={17} />
      <circle cx={13} cy={35} r={9} />
      <circle cx={24} cy={38} r={8.5} />
      <circle cx={33} cy={43} r={8} />
      <ellipse cx={-15} cy={54} rx={9} ry={15} transform="rotate(-28 -15 54)" />
    </>
  )
  return (
    <g transform="rotate(-14) scale(.95)">
      <g fill="#6b4a8a" stroke="#6b4a8a" strokeWidth={8} strokeLinejoin="round">{shapes}</g>
      <g fill="#ffffff">{shapes}</g>
      <path d="M-3 6 v14" stroke="#e7dcf2" strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

function praiseFor(hits: number, total: number) {
  if (total > 0 && hits >= total) return 'Wow! You played every single note!'
  const r = total ? hits / total : 0
  const n = `${numberWords(hits)} ${hits === 1 ? 'note' : 'notes'}`
  if (r >= 0.7) return `Wonderful! You played ${n} right on the beat!`
  if (r >= 0.35) return `Lovely music! You played ${n} on the beat!`
  if (hits > 0) return `Good listening! You played ${n} on the beat!`
  return 'What a happy song! Next time, tap when a note reaches the circle.'
}

// ---------- The game ----------

type Phase = 'intro' | 'start' | 'count' | 'play' | 'end' | 'ask'

/** One play-through of the song. */
interface Run {
  clock: Clock
  /** When beat 0 is heard, on the clock. */
  start: number
  out: GainNode | null
  backing: GainNode | null
  events: { t: number; run: (t: number) => void }[]
  next: number
  hit: boolean[]
  quiet: (Played | undefined)[]
  hits: number
  lastTap: number
  hinting: boolean
  hintSaid: boolean
  phase: 'count' | 'play'
  over: boolean
  timer: number
  raf: number
}

interface Burst { id: number; hit: boolean; color: string }

export default function Rhythm({ title, intro, done, kit, onDone }: {
  title: string; intro: string; done: string; kit: RhythmKit; onDone: () => void
}) {
  const alive = useAlive()
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const song = useMemo(() => prepare(kit), [kit])
  const instrument: Instrument = useMemo(() => kit.instrument, [kit])
  const [phase, setPhase] = useState<Phase>('intro')
  const [beat, setBeat] = useState(-99)
  const [hits, setHits] = useState(0)
  const [hitList, setHitList] = useState<boolean[]>(() => song.notes.map(() => false))
  const [bursts, setBursts] = useState<Burst[]>([])
  const [hint, setHint] = useState(false)
  const [cheer, setCheer] = useState(false)
  const run = useRef<Run | null>(null)
  const bank = useRef<Bank>(new Map())
  const sound = useRef(true) // whether the audio clock ticks (if not, the game plays silently on the plain clock)
  const free = useRef(0) // after the song: each tap plays the next note of the tune

  const addBurst = (hit: boolean, color: string) => {
    const id = Math.random()
    setBursts((b) => [...b.slice(-6), { id, hit, color }])
    setTimeout(() => { if (alive.current) setBursts((b) => b.filter((x) => x.id !== id)) }, 900)
  }

  const stopRun = () => {
    const r = run.current
    if (!r) return
    run.current = null
    r.over = true
    clearInterval(r.timer)
    cancelAnimationFrame(r.raf)
    r.clock.stop()
    const c = r.out ? audio() : null
    if (c && r.out) {
      const g = r.out.gain
      g.cancelScheduledValues(c.currentTime)
      g.setValueAtTime(g.value, c.currentTime)
      g.linearRampToValueAtTime(0, c.currentTime + 0.15)
      const out = r.out
      setTimeout(() => { try { out.disconnect() } catch { /* gone */ } }, 400)
    }
  }

  /** Schedules the sound that's due within the next moment (the audio clock plays it exactly on time). */
  const pump = (r: Run) => {
    const c = audio()
    if (!c || r.over) return
    const horizon = c.currentTime + LOOKAHEAD
    while (r.next < r.events.length && r.events[r.next].t < horizon) {
      const e = r.events[r.next++]
      // (If the page stalled, skip what's already past rather than play a late burst.)
      if (e.t > c.currentTime - 0.05) e.run(Math.max(e.t, c.currentTime))
    }
  }

  const endSong = async (r: Run) => {
    r.over = true
    clearInterval(r.timer)
    const c = r.backing ? audio() : null
    if (c && r.backing) r.backing.gain.setTargetAtTime(0.0001, c.currentTime, 0.3)
    setHint(false)
    setPhase('end')
    await wait(350)
    if (!alive.current || run.current !== r) return
    sfx.fanfare()
    setCheer(true)
    await speak(praiseFor(r.hits, song.notes.length))
    if (!alive.current || run.current !== r) return
    await speak(done)
    if (!alive.current || run.current !== r) return
    free.current = 0
    setPhase('ask')
    speak('Play again, or go on?')
  }

  /** Each frame: where the song is (by the clock), for the notes, the circle and the backdrop. */
  const frame = () => {
    const r = run.current
    if (!r || r.over) return
    const t = r.clock.now()
    const b = (t - r.start) / song.beat
    setBeat(b)
    if (r.phase === 'count' && b >= 0) {
      r.phase = 'play'
      setPhase('play')
    }
    // The hand shows when to tap: through the count-in and the first notes (until she taps), and
    // again, with a word, whenever she hasn't tapped for a while.
    const quiet = t - Math.max(r.lastTap, r.start)
    const notesLeft = song.notes.some(([nb]) => nb > b + 0.5)
    const tapped = r.lastTap > r.start - 4 * song.beat
    const want = notesLeft && ((!tapped && b < 1.6) || quiet > IDLE)
    if (want !== r.hinting) {
      r.hinting = want
      setHint(want)
      if (want && b >= 1.6 && !r.hintSaid) {
        r.hintSaid = true
        speak('Tap when a note reaches the circle!')
      }
    }
    if (b >= song.end) {
      endSong(r)
      return
    }
    r.raf = requestAnimationFrame(frame)
  }

  /** Starts the song: the count-in, then the tune. */
  const begin = () => {
    stopRun()
    const c = sound.current ? audio() : null
    const clock = c ? audioClock(c) : plainClock()
    const start = clock.now() + 0.4 + 4 * song.beat
    const r: Run = {
      clock, start, out: null, backing: null, events: [], next: 0,
      hit: song.notes.map(() => false), quiet: [], hits: 0, lastTap: -Infinity,
      hinting: false, hintSaid: false, phase: 'count', over: false, timer: 0, raf: 0,
    }
    if (c) {
      const out = (r.out = c.createGain())
      out.connect(buses().song)
      const backing = (r.backing = c.createGain())
      backing.gain.value = 0.6
      backing.connect(out)
      const at = (b: number) => start + b * song.beat
      const ev = r.events
      for (let k = 0; k < 4; k++) ev.push({ t: at(k - 4), run: (t) => click(c, out, t, k === 0) })
      for (let b = 0; b < song.length; b++) ev.push({ t: at(b), run: (t) => tick(c, backing, t, b % 4 === 0, instrument) })
      song.chords.forEach((ch, h) => {
        // The chord rings until it changes or the bar ends; the bass plays its root every half bar.
        const sameAsBefore = h % 2 === 1 && song.chords[h - 1].join() === ch.join()
        const lasts = h % 2 === 0 && song.chords[h + 1]?.join() === ch.join() ? 4 : 2
        if (!sameAsBefore) ev.push({ t: at(h * 2), run: (t) => pad(backing, t, ch.map((pc) => 55 + ((pc - 7 + 12) % 12)), lasts * song.beat, 1.1) })
        ev.push({ t: at(h * 2), run: (t) => softBass(c, backing, t, 45 + ((ch[0] - 9 + 12) % 12), song.beat * 1.8) })
      })
      song.notes.forEach(([nb, m], i) => {
        ev.push({ t: at(nb), run: (t) => { if (!r.hit[i]) r.quiet[i] = note(c, out, bank.current, instrument, t, m, QUIET, false, song.lens[i] * song.beat * 0.85) } })
      })
      ev.sort((a, b) => a.t - b.t)
      r.timer = window.setInterval(() => pump(r), 40)
    }
    run.current = r
    // (Development only: the film script reads the song's clock, to tap in time like a child would, and
    // how early or late a tap still plays a note, to check every tap in time counted.)
    if (import.meta.env.DEV) Object.assign(window, { __rhythm: { now: () => clock.now(), start, beat: song.beat, notes: song.notes, sound: !!c, early: EARLY, late: LATE } })
    setHits(0)
    setHitList(song.notes.map(() => false))
    setCheer(false)
    setHint(false)
    setPhase('count')
    if (c) pump(r)
    r.raf = requestAnimationFrame(frame)
  }

  // The intro first (and get the instrument ready meanwhile), then the count-in.
  useEffect(() => {
    // (Development only: one note on its own, for checking how the instrument sounds.)
    if (import.meta.env.DEV) {
      Object.assign(window, { __rhythmNote: (m: number, vel: number, bright: boolean) => {
        const c = audio()
        if (c) note(c, buses().song, bank.current, instrument, c.currentTime + 0.02, m, vel, bright, song.beat * 0.85)
      } })
    }
    ;(async () => {
      const c = audio()
      const t0 = c?.currentTime ?? 0, p0 = performance.now()
      if (c && instrument === 'harp') for (const m of new Set(song.notes.map((n) => n[1]))) bank.current.set(m, harpString(c, m))
      await speak(intro)
      if (!alive.current) return
      // Is the music ready to play? (On an iPad it can need a tap first.)
      const took = (performance.now() - p0) / 1000
      let ok = !!c && c.state === 'running' && took > 0.6 && c.currentTime - t0 > took / 2
      if (!ok && c) ok = await ticking(c)
      if (!alive.current) return
      sound.current = ok
      if (ok) begin()
      else setPhase('start')
    })()
    return stopRun
  }, [])

  /** The big play button, for when the music needs a tap to start. */
  const tapStart = async () => {
    unlockAudio()
    const c = audio()
    const ok = !!c && (await ticking(c, 300))
    if (!alive.current) return
    sound.current = ok
    begin()
  }

  const tap = (e: RPointerEvent<SVGSVGElement>) => {
    const r = run.current
    const c = sound.current ? audio() : null
    if (phase === 'ask') {
      // After the song, the circle plays the tune, a note a tap.
      const [, m] = song.notes[free.current++ % Math.max(1, song.notes.length)] ?? [0, 64]
      if (c) note(c, buses().song, bank.current, instrument, c.currentTime + 0.005, m, 0.7, true, song.beat * 0.8)
      addBurst(true, NOTE_COLORS[pcOf(m)])
      return
    }
    if (!r || r.over) return
    // When her finger touched, on the song's clock.
    const ms = Math.abs(e.timeStamp - performance.now()) < 1000 ? e.timeStamp : performance.now()
    const t = r.clock.at(ms)
    let best = -1, bestD = Infinity
    song.notes.forEach(([nb], i) => {
      if (r.hit[i]) return
      const d = (t - (r.start + nb * song.beat)) / song.beat
      if (d >= -EARLY && d <= LATE && Math.abs(d) < bestD) (bestD = Math.abs(d)), (best = i)
    })
    r.lastTap = t
    if (best >= 0) {
      const [, m] = song.notes[best]
      r.hit[best] = true
      r.quiet[best]?.hush()
      r.hits++
      if (c && r.out) {
        note(c, r.out, bank.current, instrument, c.currentTime + 0.005, m, 1, true, song.lens[best] * song.beat * 0.85)
        musicBox(r.out, c.currentTime + 0.01, above(m, 24), 0.16, 0.6)
      }
      setHits(r.hits)
      setHitList([...r.hit])
      addBurst(true, NOTE_COLORS[pcOf(m)])
    } else {
      // Off the beat: a soft note anyway (the nearest one of the tune), never a wrong sound.
      let m = song.notes[0]?.[1] ?? 64, near = Infinity
      for (const [nb, p] of song.notes) {
        const d = Math.abs(t - (r.start + nb * song.beat))
        if (d < near) (near = d), (m = p)
      }
      if (c && r.out) note(c, r.out, bank.current, instrument, c.currentTime + 0.005, m, SOFT, false, song.beat * 0.5)
      addBurst(false, '#ffffff')
    }
  }

  // ---------- Drawing ----------

  const bd = phase === 'intro' || phase === 'start' ? 0 : Math.max(0, Math.round(beat * 100) / 100)
  const backdrop = useMemo(() => <kit.Backdrop beat={bd} hits={hits} />, [kit, bd, hits])
  const playing = phase === 'count' || phase === 'play' || phase === 'end'
  const frac = ((beat % 1) + 1) % 1
  const pulse = playing && beat > -4 && beat < song.end ? Math.exp(-frac * 5) : 0
  const near = playing && song.notes.some(([nb], i) => !hitList[i] && Math.abs(nb - beat) < 0.35)
  const flash = bursts.some((b) => b.hit)
  const count = phase === 'count' && beat >= -4 && beat < 0 ? Math.floor(beat) + 5 : 0

  const staff = useMemo(() => [-56, -28, 0, 28, 56].map((off) => {
    const pts: string[] = []
    for (let x = 800; x >= TX + R * 0.7; x -= 10) {
      const k = (FROM_X - x) / (FROM_X - TX)
      pts.push(`${x},${(TY + off * (1 - k) ** 1.2).toFixed(1)}`)
    }
    return <polyline key={off} points={pts.join(' ')} className="rhythm-staff" />
  }), [])
  const sprites: ReactNode[] = []
  if (playing) {
    song.notes.forEach(([nb, m], i) => {
      if (hitList[i]) return
      const ahead = nb - beat
      if (ahead > LEAD || ahead < -(LATE + 0.3)) return
      const k = clamp(1 - ahead / LEAD, 0, 1)
      const off = clamp((song.mid - m) * 7, -84, 84)
      const x = FROM_X + (TX - FROM_X) * k
      const y = TY + (off + Math.sin(k * 6 + i) * 7) * (1 - k) ** 1.2
      const opacity = clamp((1 - ahead / LEAD) / 0.12, 0, 1) * (ahead < 0 ? clamp(1 + ahead / (LATE + 0.3), 0, 1) : 1)
      const s = 1.02 + 0.33 * k
      sprites.push(
        <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})`} opacity={opacity.toFixed(2)}>
          <circle r={32} fill={`url(#${uid}glow)`} />
          <circle r={20} fill={NOTE_COLORS[pcOf(m)]} stroke="#ffffff" strokeWidth={4} />
          <NoteGlyph />
        </g>,
      )
    })
  }

  return (
    <div className="activity game rhythm">
      <div className="practice-head">
        <h2>{title}</h2>
        {/* (not while the intro is said: the music starts when it ends) */}
        {(phase === 'intro' || phase === 'start' || phase === 'ask') && (
          <button type="button" className="icon-btn speaker" aria-label="Hear it again" disabled={phase === 'intro'} onClick={() => speak(intro)}>🔊</button>
        )}
      </div>
      <Board className="rhythm-board">
        {backdrop}
        <BoardLayer className="scene rhythm-layer" aria-label={title} onPointerDown={tap}
          data-phase={phase} data-hits={hits} data-notes={song.notes.length} data-sound={sound.current ? 'yes' : 'no'}>
          <defs>
            <radialGradient id={`${uid}glow`}>
              <stop offset="0" stopColor="#ffffff" stopOpacity={0.95} />
              <stop offset="0.5" stopColor="#fff6c8" stopOpacity={0.5} />
              <stop offset="1" stopColor="#fff6c8" stopOpacity={0} />
            </radialGradient>
            <linearGradient id={`${uid}lane`} x1="1" x2="0" y1="0" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity={0} />
              <stop offset="1" stopColor="#ffffff" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          {/* The way the notes come: a soft band, and a little music staff, narrowing into the circle. */}
          <path d={`M800 ${TY - 100} C 720 ${TY - 96} ${TX + 40} ${TY - R} ${TX} ${TY - R} L ${TX} ${TY + R} C ${TX + 40} ${TY + R} 720 ${TY + 96} 800 ${TY + 100} Z`} fill={`url(#${uid}lane)`} className="rhythm-lane" />
          {staff}
          <g transform={`translate(${TX} ${TY})`}>
            <circle r={R + 34} fill={`url(#${uid}glow)`} opacity={(0.35 + 0.55 * pulse + (near ? 0.2 : 0)).toFixed(2)} />
            <g transform={`scale(${(1 + 0.05 * pulse + (flash ? 0.05 : 0)).toFixed(3)})`}>
              <circle r={R} className={`rhythm-target ${near ? 'near' : ''} ${flash ? 'flash' : ''}`} />
              <circle r={R - 10} fill="none" stroke="#ffe3a0" strokeWidth={3} strokeDasharray="5 9" />
              {kit.Icon ? <kit.Icon /> : <InstrumentIcon kind={instrument} />}
            </g>
            {bursts.map((b) => (
              <g key={b.id} className={b.hit ? 'rhythm-burst' : 'rhythm-ripple'}>
                <circle r={R} fill="none" stroke={b.hit ? b.color : '#ffffff'} strokeWidth={b.hit ? 10 : 5} />
                {b.hit && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
                  <path key={k} d={sparkle(0, -R - 22, k % 2 ? 8 : 12)} transform={`rotate(${k * 36})`} fill={k % 2 ? '#ffffff' : b.color} />
                ))}
              </g>
            ))}
          </g>
          {sprites}
          {count > 0 && <text key={count} x={400} y={150} className="rhythm-count">{count}</text>}
          {hint && (
            <g transform={`translate(${TX + 18} ${TY + 22 - 16 * Math.max(0, 1 - frac * 3)})`} className="rhythm-hand">
              <Hand />
            </g>
          )}
        </BoardLayer>
        {phase === 'start' && (
          <div className="rhythm-overlay">
            <button className="rhythm-play" aria-label="Start the music" onClick={() => { sfx.pop(); tapStart() }}>▶</button>
          </div>
        )}
        {phase === 'ask' && (
          <div className="rhythm-overlay rhythm-ask">
            <BigButton color="yellow" className="rhythm-again" onClick={() => { stopSpeaking(); begin() }}>🎵 Again!</BigButton>
            <BigButton color="pink" className="rhythm-next" onClick={() => { stopRun(); onDone() }}>➡️</BigButton>
          </div>
        )}
      </Board>
      {cheer && <Confetti />}
    </div>
  )
}
