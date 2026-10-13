// Narration. Each line is spoken by the first of these that has it (docs/BUSINESS-PLAN.md §2):
//   1. the family's own recording of that line (Family voices);
//   2. the house voices, the owner's family recorded once for everyone: the voice for the line's role
//      (src/voice/roles.ts), reading the line or stitched from recorded pieces (src/voice/resolve.ts);
//   3. Grok's "Ara" voice: a clip made ahead of time for the game's fixed lines (/tts never makes a new one
//      in the public game, and a line with a family's name in it is never asked for);
//   4. the device's built-in voice, which always works, offline too.
import { duck } from './audio'
import { playerName, type Narrator } from './progress'
import { toSpoken } from './spoken'
import { planLine } from '../voice/resolve'
import { playParts, stopParts } from '../voice/player'
import { mentionsPrivateName } from '../voice/privacy'
import type { Role } from '../voice/roles'

let narrator: Narrator = 'ara'
let familyVoices = true // play Mom/Dad recordings when a line has one
let rate = 0.9
let grokAvailable = true // false once the server says the voice isn't set up
let signedOut = false // the login cookie expired: the server refuses /tts until a grown-up signs in again

export function setRate(r: number) {
  rate = r
}

export function setNarrator(n: Narrator) {
  narrator = n
}

export function setFamilyVoices(on: boolean) {
  familyVoices = on
}

/** True when the Grok voice is set up on the server (as far as we know). */
export const grokVoiceAvailable = () => grokAvailable
/** True when the server turned us away because the login expired (the app itself still runs offline). */
export const voiceSignedOut = () => signedOut

// The rate setting was tuned for device voices (0.9 = normal); map it onto Grok's speed scale.
const grokSpeed = () => (rate <= 0.75 ? '0.85' : rate >= 1 ? '1.1' : '1')

// ---------- Device voice (fallback) ----------

let deviceVoice: SpeechSynthesisVoice | null = null
const PREFERRED = ['Samantha', 'Karen', 'Moira', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny']

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? []
  for (const name of PREFERRED) {
    const v = voices.find((x) => x.name.includes(name))
    if (v) return (deviceVoice = v)
  }
  deviceVoice = voices.find((v) => v.lang.startsWith('en')) ?? null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice()
  window.speechSynthesis.onvoiceschanged = pickVoice
}

function deviceSpeak(text: string, pitch: number): Promise<void> {
  const synth = window.speechSynthesis
  if (!synth) return Promise.resolve()
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    if (deviceVoice) u.voice = deviceVoice
    u.rate = rate
    u.pitch = pitch
    // Some browsers occasionally never fire `onend`; never let the game get stuck waiting.
    const words = text.split(/\s+/).length
    const fallback = setTimeout(done, 1500 + (words * 450) / rate)
    function done() {
      clearTimeout(fallback)
      resolve()
    }
    u.onend = done
    u.onerror = done
    synth.speak(u)
  })
}

// ---------- Grok voice ----------

const clips = new Map<string, Promise<ArrayBuffer | null>>() // encoded mp3s, newest last
const MAX_CLIPS = 200

function fetchClip(text: string): Promise<ArrayBuffer | null> {
  const voice = narrator
  const speed = grokSpeed()
  const key = `${voice}|${speed}|${text}`
  const hit = clips.get(key)
  if (hit) {
    clips.delete(key) // move to the end: recently used
    clips.set(key, hit)
    return hit
  }
  const qs = new URLSearchParams({ voice, speed, text })
  const p = fetch(`/tts?${qs}`)
    .then((r) => {
      if (r.status === 503) grokAvailable = false // (404: no clip was made ahead of time for this line)
      if (r.status === 401) signedOut = true
      return r.ok ? r.arrayBuffer() : null
    })
    .catch(() => null)
  p.then((b) => { if (!b) clips.delete(key) })
  clips.set(key, p)
  while (clips.size > MAX_CLIPS) clips.delete(clips.keys().next().value!)
  return p
}

const within = <T,>(p: Promise<T>, ms: number, fallback: T) =>
  Promise.race([p, new Promise<T>((r) => setTimeout(() => r(fallback), ms))])

const playClip = (mp3: ArrayBuffer, g: number) => playParts([{ audio: mp3 }], () => g === gen)

// ---------- Public API ----------

let gen = 0 // bumped on every interruption; stale lines check it and bow out
let queue: Promise<void> = Promise.resolve()

let talking = 0
/** True while the narrator is saying something. */
export const isSpeaking = () => talking > 0

/** Whether a line may be asked of the narration service: never one with a family's name in it. */
export const mayAskVoice = (text: string) => !mentionsPrivateName(text)

async function sayNow(text: string, pitch: number, g: number, role: Role) {
  if (g !== gen || !toSpoken(text, 'device')) return
  duck(true)
  talking++
  try {
    // Recordings: the family's own, then the house voices (whole, or stitched from pieces).
    const plan = await within(planLine(text, role, { family: familyVoices }), 3000, null)
    if (g !== gen) return
    if (plan && (await playParts(plan.parts, () => g === gen))) return
    if (narrator !== 'device' && grokAvailable && mayAskVoice(text)) {
      // Wait up to 4 seconds for a new line to be generated; after that use the device voice
      // (the clip keeps downloading in the background, so it's ready next time).
      const mp3 = await within(fetchClip(toSpoken(text, 'grok')), 4000, null)
      if (g !== gen) return
      if (mp3 && (await playClip(mp3, g))) return
    }
    if (g === gen) await deviceSpeak(toSpoken(text, 'device'), pitch)
  } finally {
    talking--
    duck(false)
  }
}

let important = 0 // lines that must not be cut off are playing or waiting
let paused: Promise<void> | null = null
let unpause: (() => void) | null = null

/** While paused, ordinary lines wait (important ones still play), e.g. behind a "leave?" prompt. */
export function pauseNarration(on: boolean) {
  if (on && !paused) paused = new Promise((r) => (unpause = r))
  if (!on && paused) {
    unpause!()
    paused = unpause = null
  }
}

/**
 * Speak text aloud. Resolves when finished (or right away if interrupted).
 * By default this interrupts whatever is being said; `interrupt: false` queues after it.
 * `important` lines (like a Pal growing) can't be interrupted by other lines: those wait their
 * turn instead. Only stopSpeaking() (leaving a screen) cuts them off.
 */
export function speak(text: string, opts: { interrupt?: boolean; pitch?: number; important?: boolean; role?: Role } = {}): Promise<void> {
  if (opts.interrupt !== false && !important) stopSpeaking()
  const g = gen
  const p = queue
    .then(() => (opts.important ? undefined : paused ?? undefined))
    .then(() => sayNow(text, opts.pitch ?? 1.1, g, opts.role ?? 'narrator'))
  queue = p
  if (opts.important) {
    important++
    p.finally(() => { important-- })
  }
  return p
}

export function stopSpeaking() {
  gen++
  queue = Promise.resolve()
  stopParts()
  window.speechSynthesis?.cancel()
}

/**
 * Download lines in the background so they play instantly later: their recordings (the house voices, Grok's
 * among them, whole or in pieces), or else a clip made ahead of time.
 */
export async function preload(lines: string[], role: Role = 'narrator') {
  for (const line of lines) {
    // (planning a line starts fetching its recordings' audio, which is then kept)
    const plan = await planLine(line, role, { family: familyVoices }).catch(() => null)
    if (plan || narrator === 'device' || !grokAvailable) continue
    if (mayAskVoice(line)) await fetchClip(toSpoken(line, 'grok'))
  }
}

/** iOS only allows speech after a user gesture; call this from the first tap. */
export function unlockSpeech() {
  const synth = window.speechSynthesis
  if (!synth) return
  const u = new SpeechSynthesisUtterance(' ')
  u.volume = 0
  synth.speak(u)
}

export const PRAISE = ['Great job!', 'You did it!', 'Wonderful!', 'Way to go, {name}!', 'Amazing!', 'Super smart!', 'Yay!']
export const RETRY = ['Oops, try again!', 'Almost! Try again.', 'Good try! Let’s try once more.']
const named = (s: string) => s.replace('{name}', playerName())
export const praise = () => named(PRAISE[Math.floor(Math.random() * PRAISE.length)])
export const retry = () => RETRY[Math.floor(Math.random() * RETRY.length)]
/** Every praise/retry line, for preloading. */
export const encouragements = () => [...PRAISE.map(named), ...RETRY]
