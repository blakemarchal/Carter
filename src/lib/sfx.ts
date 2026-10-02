// Synthesized sound effects, so the game needs no audio files. Gentle on purpose:
// even "oops" is a friendly boing, never a buzzer.
import { ac, buses, mallet, musicBox, slide, whooshAt, snare, kick } from './audio'

let enabled = true
export function setSfxEnabled(on: boolean) {
  enabled = on
}

/** Runs `fn` with the current time and the sfx bus, if sound effects are on. */
function play(fn: (t: number, out: AudioNode) => void) {
  if (!enabled) return
  try {
    const c = ac()
    if (c.state !== 'running') c.resume()
    fn(c.currentTime + 0.01, buses().sfx)
  } catch {
    /* audio unavailable */
  }
}

// C major pentatonic, so any run of notes sounds happy.
const PENTA = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86, 88]

export const sfx = {
  /** Button tap: a little bubble pop. */
  pop: () => play((t, o) => slide(o, t, 420, 980, 0.07, 'sine', 0.22)),
  /** Right answer: a sparkly rising arpeggio. */
  good: () => play((t, o) => {
    ;[72, 76, 79, 84].forEach((n, i) => mallet(o, t + i * 0.07, n, 0.9, 0.45))
    ;[96, 100, 103].forEach((n, i) => musicBox(o, t + 0.28 + i * 0.05, n, 0.35, 0.5))
  }),
  /** Wrong answer: a soft, silly boing. */
  oops: () => play((t, o) => {
    const s = slide(o, t, 330, 160, 0.32, 'sine', 0.2)
    const lfo = ac().createOscillator()
    const depth = ac().createGain()
    lfo.frequency.value = 14
    depth.gain.value = 18
    lfo.connect(depth).connect(s.frequency)
    lfo.start(t)
    lfo.stop(t + 0.4)
  }),
  /** Big moments: a little marching fanfare. */
  fanfare: () => play((t, o) => {
    const notes: [number, number][] = [[67, 0], [72, 0.14], [76, 0.28], [79, 0.42], [76, 0.62], [79, 0.74], [84, 0.9]]
    for (const [n, at] of notes) {
      mallet(o, t + at, n, 1, 0.6)
      mallet(o, t + at, n - 12, 0.5, 0.6)
    }
    kick(o, t + 0.9, 0.7)
    snare(o, t + 0.9, 0.5)
    ;[96, 100, 103, 108].forEach((n, i) => musicBox(o, t + 1.0 + i * 0.06, n, 0.3, 0.8))
  }),
  /** A Pal's friendly power move: a magic sparkle sweep. */
  zap: () => play((t, o) => {
    whooshAt(o, t)
    PENTA.slice(4).forEach((n, i) => musicBox(o, t + 0.05 + i * 0.035, n + 12, 0.4, 0.4))
  }),
  /** Turning a page. */
  whoosh: () => play((t, o) => whooshAt(o, t)),
  /** Counting: each number rings a little higher than the last. */
  count: (n: number) => play((t, o) => mallet(o, t, PENTA[Math.min(PENTA.length - 1, n)], 1, 0.5)),
  /** Twinkle, for magical moments like a Pal growing. */
  sparkle: () => play((t, o) => {
    for (let i = 0; i < 10; i++) musicBox(o, t + i * 0.06, PENTA[(i * 3) % PENTA.length] + 12, 0.35, 0.6)
  }),
}
