// Narration. Today this uses the device's built-in voice (Web Speech API).
// Later, each line can be swapped for a Mom/Dad recording: if `audio/<id>.m4a`
// exists in the voice pack, it is played instead of synthesized speech.

let voice: SpeechSynthesisVoice | null = null
let rate = 0.9

const PREFERRED = ['Samantha', 'Karen', 'Moira', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny']

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? []
  for (const name of PREFERRED) {
    const v = voices.find((x) => x.name.includes(name))
    if (v) return (voice = v)
  }
  voice = voices.find((v) => v.lang.startsWith('en')) ?? null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice()
  window.speechSynthesis.onvoiceschanged = pickVoice
}

export function setRate(r: number) {
  rate = r
}

/** Speak text aloud. Resolves when finished (or immediately if speech is unavailable). */
export function speak(text: string, opts: { interrupt?: boolean; pitch?: number } = {}): Promise<void> {
  const synth = window.speechSynthesis
  if (!synth) return Promise.resolve()
  if (opts.interrupt !== false) synth.cancel()
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    if (voice) u.voice = voice
    u.rate = rate
    u.pitch = opts.pitch ?? 1.1
    // Some browsers occasionally never fire `onend`; never let the game get stuck waiting.
    const words = text.split(/\s+/).length
    const fallback = setTimeout(resolve, 1500 + (words * 450) / rate)
    const done = () => { clearTimeout(fallback); resolve() }
    u.onend = done
    u.onerror = done
    synth.speak(u)
  })
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
}

/** iOS only allows speech after a user gesture; call this from the first tap. */
export function unlockSpeech() {
  const synth = window.speechSynthesis
  if (!synth) return
  const u = new SpeechSynthesisUtterance(' ')
  u.volume = 0
  synth.speak(u)
}

const PRAISE = ['Great job!', 'You did it!', 'Wonderful!', 'Way to go, Carter!', 'Amazing!', 'Super smart!', 'Yay!']
const RETRY = ['Oops, try again!', 'Almost! Try again.', 'Good try! Let’s try once more.']
export const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)]
export const retry = () => RETRY[Math.floor(Math.random() * RETRY.length)]
