// Tiny synthesized sound effects so the prototype needs no audio files.
let ctx: AudioContext | null = null
const ac = () => (ctx ??= new AudioContext())

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
  const c = ac()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(vol, c.currentTime + start)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime + start)
  o.stop(c.currentTime + start + dur)
}

export const sfx = {
  pop: () => tone(660, 0, 0.12, 'triangle'),
  good: () => [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle')),
  oops: () => tone(220, 0, 0.25, 'sine', 0.1),
  fanfare: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.35, 'triangle')),
  zap: () => [880, 1320, 1760].forEach((f, i) => tone(f, i * 0.05, 0.15, 'square', 0.05)),
}
