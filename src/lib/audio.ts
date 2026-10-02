// One shared Web Audio graph for music, sound effects and the narrator voice:
//   music ─┐
//   sfx   ─┼─> master ─> compressor ─> speakers
//   voice ─┘
// Music ducks (gets quieter) while the narrator is talking.

let ctx: AudioContext | null = null
let master: GainNode, musicBus: GainNode, sfxBus: GainNode, voiceBus: GainNode
let noise: AudioBuffer

const MUSIC_LEVEL = 0.55
const DUCKED_LEVEL = 0.2

function build(c: AudioContext) {
  const comp = c.createDynamicsCompressor()
  comp.threshold.value = -12
  comp.ratio.value = 4
  comp.connect(c.destination)
  master = c.createGain()
  master.gain.value = 0.9
  master.connect(comp)
  musicBus = c.createGain()
  musicBus.gain.value = MUSIC_LEVEL
  sfxBus = c.createGain()
  voiceBus = c.createGain()
  voiceBus.gain.value = 1.15
  for (const b of [musicBus, sfxBus, voiceBus]) b.connect(master)
  noise = c.createBuffer(1, c.sampleRate, c.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
}

export function ac(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext({ latencyHint: 'interactive' })
    build(ctx)
    // Pause everything while the app is in the background.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) ctx?.suspend()
      else ctx?.resume()
    })
  }
  return ctx
}

export const buses = () => (ac(), { music: musicBus, sfx: sfxBus, voice: voiceBus })
export const noiseBuffer = () => (ac(), noise)

/** iOS only allows audio after a user gesture; call this from the first tap. */
export function unlockAudio() {
  // Play through the ringer/silent switch, like a game (Safari 16.4+).
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession
  if (session) session.type = 'playback'
  const c = ac()
  if (c.state !== 'running') c.resume()
  // A silent blip inside the gesture fully unlocks older iOS versions.
  const s = c.createBufferSource()
  s.buffer = c.createBuffer(1, 1, c.sampleRate)
  s.connect(c.destination)
  s.start()
}

let ducks = 0
/** Lower the music while the narrator speaks. Calls nest: duck(true) twice needs duck(false) twice. */
export function duck(on: boolean) {
  if (!ctx) return
  ducks = Math.max(0, ducks + (on ? 1 : -1))
  const g = musicBus.gain
  g.cancelScheduledValues(ctx.currentTime)
  g.setTargetAtTime(ducks ? DUCKED_LEVEL : MUSIC_LEVEL, ctx.currentTime, ducks ? 0.08 : 0.4)
}

export const midiHz = (m: number) => 440 * 2 ** ((m - 69) / 12)

// ---------- Instruments (shared by music and sound effects) ----------

type Out = AudioNode

function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
}

function osc(type: OscillatorType, freq: number, t: number, stop: number, out: Out, detune = 0) {
  const c = ac()
  const o = c.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  o.detune.value = detune
  o.connect(out)
  o.start(t)
  o.stop(stop)
  return o
}

/** Wooden marimba-ish mallet: sine plus a quick bright overtone. */
export function mallet(out: Out, t: number, midi: number, vel = 1, decay = 0.5) {
  const c = ac()
  const f = midiHz(midi)
  const g = c.createGain()
  env(g, t, 0.32 * vel, 0.004, decay)
  g.connect(out)
  osc('sine', f, t, t + decay + 0.05, g)
  const g2 = c.createGain()
  env(g2, t, 0.09 * vel, 0.002, decay * 0.25)
  g2.connect(out)
  osc('sine', f * 4, t, t + decay * 0.3, g2)
}

/** Twinkly music box: pure tone with a soft bell partial and a long tail. */
export function musicBox(out: Out, t: number, midi: number, vel = 1, decay = 1.4) {
  const c = ac()
  const f = midiHz(midi)
  const g = c.createGain()
  env(g, t, 0.22 * vel, 0.003, decay)
  g.connect(out)
  osc('sine', f, t, t + decay + 0.05, g)
  const g2 = c.createGain()
  env(g2, t, 0.05 * vel, 0.002, decay * 0.5)
  g2.connect(out)
  osc('triangle', f * 3, t, t + decay * 0.6, g2)
}

/** Soft plucked string: triangle through a closing low-pass filter. */
export function pluck(out: Out, t: number, midi: number, vel = 1, decay = 0.35) {
  const c = ac()
  const f = c.createBiquadFilter()
  f.type = 'lowpass'
  f.Q.value = 2
  f.frequency.setValueAtTime(4000, t)
  f.frequency.exponentialRampToValueAtTime(500, t + decay)
  const g = c.createGain()
  env(g, t, 0.28 * vel, 0.003, decay)
  f.connect(g).connect(out)
  osc('triangle', midiHz(midi), t, t + decay + 0.05, f)
  osc('square', midiHz(midi), t, t + decay + 0.05, f).detune.value = 6
}

/** Round, friendly bass. */
export function bass(out: Out, t: number, midi: number, dur: number, vel = 1) {
  const c = ac()
  const f = c.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 520
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.5 * vel, t + 0.012)
  g.gain.setTargetAtTime(0.0001, t + dur * 0.8, 0.06)
  f.connect(g).connect(out)
  osc('triangle', midiHz(midi), t, t + dur + 0.3, f)
  osc('sine', midiHz(midi - 12), t, t + dur + 0.3, f)
}

/** Warm pad chord for the background. */
export function pad(out: Out, t: number, notes: number[], dur: number, vel = 1) {
  const c = ac()
  const f = c.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 1100
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.045 * vel, t + 0.35)
  g.gain.setValueAtTime(0.045 * vel, t + dur - 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.4)
  f.connect(g).connect(out)
  for (const n of notes) {
    osc('sawtooth', midiHz(n), t, t + dur + 0.5, f, -7)
    osc('sawtooth', midiHz(n), t, t + dur + 0.5, f, 7)
  }
}

/** Gentle bright lead (a soft 8-bit flavor) for the battle theme. */
export function chip(out: Out, t: number, midi: number, dur: number, vel = 1) {
  const c = ac()
  const f = c.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 2600
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.07 * vel, t + 0.01)
  g.gain.setTargetAtTime(0.0001, t + dur * 0.85, 0.04)
  f.connect(g).connect(out)
  osc('square', midiHz(midi), t, t + dur + 0.2, f)
}

function noiseHit(out: Out, t: number, type: BiquadFilterType, freq: number, vol: number, decay: number, q = 1) {
  const c = ac()
  const s = c.createBufferSource()
  s.buffer = noiseBuffer()
  const f = c.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  const g = c.createGain()
  env(g, t, vol, 0.002, decay)
  s.connect(f).connect(g).connect(out)
  s.start(t, Math.random() * 0.5)
  s.stop(t + decay + 0.05)
}

export function kick(out: Out, t: number, vel = 1) {
  const c = ac()
  const g = c.createGain()
  env(g, t, 0.55 * vel, 0.003, 0.22)
  g.connect(out)
  const o = osc('sine', 130, t, t + 0.3, g)
  o.frequency.exponentialRampToValueAtTime(45, t + 0.14)
}

export const snare = (out: Out, t: number, vel = 1) => noiseHit(out, t, 'bandpass', 1900, 0.22 * vel, 0.13, 0.8)
export const shaker = (out: Out, t: number, vel = 1) => noiseHit(out, t, 'highpass', 7000, 0.07 * vel, 0.045)
export const whooshAt = (out: Out, t: number) => {
  const c = ac()
  const s = c.createBufferSource()
  s.buffer = noiseBuffer()
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 1.5
  f.frequency.setValueAtTime(400, t)
  f.frequency.exponentialRampToValueAtTime(3500, t + 0.25)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.25, t + 0.1)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
  s.connect(f).connect(g).connect(out)
  s.start(t)
  s.stop(t + 0.4)
}

/** A pitch slide (for boings, bubbles and zaps). */
export function slide(out: Out, t: number, from: number, to: number, dur: number, type: OscillatorType = 'sine', vol = 0.25) {
  const c = ac()
  const g = c.createGain()
  env(g, t, vol, 0.005, dur)
  g.connect(out)
  const o = osc(type, from, t, t + dur + 0.05, g)
  o.frequency.exponentialRampToValueAtTime(to, t + dur)
  return o
}
