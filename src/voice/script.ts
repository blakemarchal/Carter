// The recording script (docs/CLOUD-BRIEF.md, wave 10): every clip each house voice has to record, in queues,
// most-heard first. The studio (screens/Studio.tsx) walks it line by line, and prints it; the hand-back counts it.
// It's made from the game itself: the islands' stories and activity lines, praise, the learning levels (sampled:
// ./lines.gen.json, from scripts/voice-script.tsx, with the fixed strings the code speaks), the templates' parts,
// and the names, Pals, numbers, letters and sounds that fill their slots.
//
// A line with a slot in some sentences ("3 plus 4. How many in all?") is recorded a sentence at a time: the slot
// sentences are templates, the rest are recorded on their own. A line without slots is recorded whole.
import { PRAISE, RETRY } from '../lib/speech'
import { PHONICS } from '../lib/spoken'
import { SHADE_SAY, VOYAGE_DONE } from '../data/shade'
import { BIRTHDAY_VERSE, partyStory, storyTitle } from '../data/birthday'
import { SONGS } from '../data/songs'
import type { Step } from '../data/islands'
import { BEDTIME_LINES } from '../screens/Bedtime'
import { PLACEMENT_PRAISE } from '../screens/Placement'
import gen from './lines.gen.json'
import { keys, type Take } from './keys'
import { LIBRARY_NAMES, libraryName } from './names'
import { MAX_NUMBER, PAL_NAMES, matchTemplate, sentences } from './stitch'
import { pieces, recordedParts, TEMPLATES, type SlotKind } from './templates'
import { voicesFor, type Role, type Voice } from './roles'

/** The studio's queues, in the order to record them: what a child hears most comes first. */
export const QUEUES = ['praise', 'prompts', 'story', 'learning', 'templates', 'names', 'numbers', 'letters', 'songs'] as const
export type Queue = (typeof QUEUES)[number]
export const QUEUE_NAMES: Record<Queue, string> = {
  praise: 'Praise', prompts: 'Prompts', story: 'Story pages', learning: 'Learning', templates: 'Templates',
  names: 'Names', numbers: 'Numbers', letters: 'Letters', songs: 'Songs',
}

export interface ScriptItem {
  /** Where it is in the game, stable while its words change (so a change can be flagged). */
  ref: string
  queue: Queue
  voice: Voice
  /** What the recording is of (its fingerprint is made from this): the line itself, or a piece's key. */
  key: string
  /** The words to say. */
  say: string
  /** How to say it, when the words alone don't tell: the whole sentence a part or a slot sits in. */
  context?: string
  where?: string
  /** A song's id (a sung recording, placed on the song's word timings). */
  song?: string
}

export interface IslandSource { id: string; name: string; steps: Step[] }
type Gen = { learning: [string, number][]; code: string[]; taps: string[] }
const GEN = gen as Gen

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
/** About how long it takes to record (seconds): reading it, a listen back, the odd retake, and moving on. */
export function recordSeconds(item: ScriptItem): number {
  if (item.song) {
    const song = SONGS.find((s) => s.id === item.song)
    const length = song?.lines.at(-1)?.end ?? 90
    return Math.round(length * 2.5 + 30) // (a practice listen, a take or two)
  }
  return Math.round((item.queue === 'names' || item.queue === 'numbers' || item.queue === 'letters' ? 3 : 5) + words(item.say) * 0.6)
}

/** The fixed sentences of a line to record: the whole line, or (when some sentences are templates) the others. */
export function fixedPieces(line: string): string[] {
  const ss = sentences(line)
  if (!ss.some((s) => matchTemplate(s))) return line.trim() ? [line.replace(/\s+/g, ' ').trim()] : []
  return ss.filter((s) => !matchTemplate(s))
}

/** Each step's fixed lines (what the island says besides its story pages). */
function stepLines(step: Step): string[] {
  const out: string[] = []
  const s = step as Record<string, unknown>
  for (const f of ['intro', 'done', 'hint', 'line'] as const) if (typeof s[f] === 'string') out.push(s[f] as string)
  if (step.kind === 'quiz') out.push(...step.questions.map((q) => q.say))
  return out
}

const takeText = (word: string, take: Take) => (take === 'exclaim' ? `${word}!` : `…, ${word}.`)
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const numberSay = (n: number, take: Take) => (take === 'exclaim' ? `${n}!` : `${n}`)

/**
 * The whole script, every voice. Islands are passed in (they load on demand in the game). `extraNames`: names
 * families use that aren't in the name library (the owner's studio asks the server: GET /voice/names); they're
 * recorded first in the Names queue.
 */
export function buildScript(islands: IslandSource[], { extraNames = [] }: { extraNames?: string[] } = {}): ScriptItem[] {
  const out: ScriptItem[] = []
  const seen = new Set<string>()
  const add = (item: ScriptItem) => {
    const id = `${item.voice}|${item.key}`
    if (seen.has(id) || !item.say.trim()) return
    seen.add(id)
    out.push(item)
  }
  const voiceOf = (role: Role = 'narrator') => voicesFor(role)[0]
  /** A line, as the fixed pieces to record (the slots are recorded on their own). */
  const line = (queue: Queue, ref: string, text: string, where: string, role?: Role) => {
    const ps = fixedPieces(text)
    ps.forEach((p, i) => add({ ref: ps.length > 1 ? `${ref}~${i}` : ref, queue, voice: voiceOf(role), key: p, say: p, where }))
  }

  // ---- praise ----
  PRAISE.forEach((p, i) => { if (!p.includes('{')) line('praise', `praise:${i}`, p, 'after a right answer') })
  RETRY.forEach((p, i) => line('praise', `retry:${i}`, p, 'after a miss'))
  PLACEMENT_PRAISE.forEach((p, i) => line('praise', `placement-praise:${i}`, p, 'the placement game'))

  // ---- prompts: each island's activity lines, Grumbleshade, the Pals' own lines, then the code's fixed lines ----
  for (const isl of islands) {
    isl.steps.forEach((step, si) => stepLines(step).forEach((l, li) => line('prompts', `step:${isl.id}:${si}:${li}`, l, isl.name)))
  }
  line('prompts', 'shade:intro', SHADE_SAY.intro('Zippy'), 'friendly battle', 'shade')
  line('prompts', 'shade:cloud', SHADE_SAY.cloudIntro('Zippy'), 'friendly battle', 'shade')
  line('prompts', 'pals:yes', 'Yes, please!', 'friendly battle: the new friend answers', 'pals')
  line('prompts', 'pals:tickles', 'Hee hee! That tickles!', 'Pal home: petting', 'pals')
  GEN.code.forEach((l) => line('prompts', `code:${l}`, l, 'the game'))

  // ---- story pages ----
  for (const isl of islands) {
    isl.steps.forEach((s, si) => {
      if (s.kind === 'story') s.pages.forEach((pg, pi) => line('story', `story:${isl.id}:${si}:${pi}`, pi === 0 ? `${s.title}. ${pg.text}` : pg.text, isl.name))
      if (s.kind === 'verse') {
        s.chunks.forEach((c, ci) => line('story', `verse:${isl.id}:${si}:${ci}`, c, `${isl.name}: memory verse`))
        line('story', `verse:${isl.id}:${si}:full`, `${s.chunks.join(' ')} ${s.ref}.`, `${isl.name}: memory verse`)
      }
    })
  }
  BEDTIME_LINES.forEach((l, i) => line('story', `bedtime:${i}`, l, 'bedtime'))
  const finale = SHADE_SAY.finale
  ;(['listen', 'whisper', 'smile', 'glad'] as const).forEach((k) => line('story', `shade:finale:${k}`, finale[k], 'Easter: Grumbleshade becomes Gladshade', 'shade'))
  VOYAGE_DONE.forEach((l, i) => line('story', `voyage:${i}`, l, 'every island done'))
  // (as most families hear it: Mom and Dad in the cast; the name lines are templates)
  const party = partyStory({ name: 'Olivia', grownups: ['Mom', 'Dad'], siblings: [], pets: [] })
  party.forEach((pg, i) => line('story', `birthday:${i}`, i === 0 ? `${storyTitle('Olivia')}. ${pg.text}` : pg.text, 'the birthday story'))
  BIRTHDAY_VERSE.chunks.forEach((c, i) => line('story', `birthday-verse:${i}`, c, 'the birthday verse'))
  GEN.taps.forEach((l) => line('story', `tap:${l}`, l, 'tapping a story picture'))

  // ---- learning: the levels' lines, most heard first ----
  GEN.learning.forEach(([l]) => line('learning', `learn:${l}`, l, 'practice and battles'))

  // ---- templates: each one's parts, in the voice of its role ----
  const needs = new Map<Voice, Map<SlotKind, Set<Take>>>()
  for (const tpl of TEMPLATES) {
    const voice = voiceOf(tpl.role)
    const blank = tpl.text.replace(/\{(name|pal|n|letter|sound)\}/g, '___')
    for (const [i, said] of recordedParts(tpl)) {
      add({ ref: `tpl:${tpl.id}:${i}`, queue: 'templates', voice, key: keys.part(tpl.id, i), say: said, context: blank, where: tpl.where })
    }
    const ps = pieces(tpl.text)
    ps.forEach((p, i) => {
      if (!('slot' in p)) return
      const next = ps[i + 1]
      const take: Take = next && 'said' in next && next.said.startsWith('!') ? 'exclaim' : 'mid'
      const v = needs.get(voice) ?? new Map<SlotKind, Set<Take>>()
      needs.set(voice, v)
      const k = v.get(p.slot) ?? new Set<Take>()
      v.set(p.slot, k)
      k.add(take)
    })
  }

  // ---- what fills the slots: Pals and children's names, numbers, letters and their sounds ----
  for (const [voice, kinds] of needs) {
    const takes = (k: SlotKind) => [...(kinds.get(k) ?? [])].sort()
    for (const take of takes('name')) for (const n of extraNames.filter((x) => !libraryName(x))) add({ ref: `name:${n}:${take}`, queue: 'names', voice, key: keys.name(n, take), say: takeText(n, take), context: take === 'exclaim' ? 'on its own, excited' : 'in the middle of a sentence', where: 'names families use (not in the library)' })
    for (const take of takes('pal')) for (const p of PAL_NAMES) add({ ref: `pal:${p}:${take}`, queue: 'names', voice, key: keys.pal(p, take), say: takeText(p, take), context: take === 'exclaim' ? 'on its own, excited' : 'in the middle of a sentence', where: 'Pal names' })
    for (const take of takes('name')) for (const n of LIBRARY_NAMES) add({ ref: `name:${n}:${take}`, queue: 'names', voice, key: keys.name(n, take), say: takeText(n, take), context: take === 'exclaim' ? 'on its own, excited' : 'in the middle of a sentence', where: 'children’s names' })
    for (const take of takes('n')) for (let n = 0; n <= MAX_NUMBER; n++) add({ ref: `num:${n}:${take}`, queue: 'numbers', voice, key: keys.number(n, take), say: numberSay(n, take), context: take === 'exclaim' ? 'an answer, cheerful' : 'in the middle of a sentence', where: 'numbers' })
    if (kinds.has('letter')) for (const l of 'abcdefghijklmnopqrstuvwxyz') add({ ref: `letter:${l}`, queue: 'letters', voice, key: keys.letter(l), say: cap(l).toUpperCase(), context: 'the letter’s name', where: 'letters' })
    if (kinds.has('sound')) for (const l of 'abcdefghijklmnopqrstuvwxyz') add({ ref: `sound:${l}`, queue: 'letters', voice, key: keys.sound(l), say: PHONICS[l].say, context: `the sound ${l.toUpperCase()} makes, short and clear`, where: 'letter sounds' })
  }

  // ---- songs: sung along with the flute, by the child's voice ----
  for (const s of SONGS) if (s.audio.sing) add({ ref: `song:${s.id}`, queue: 'songs', voice: 'child', key: keys.song(s.id), say: s.title, context: 'sing along with the flute, through headphones', where: 'the sing-along', song: s.id })

  return out
}

/** Lines and minutes per voice and queue. */
export function scriptCounts(items: ScriptItem[]): Record<string, Partial<Record<Queue, { lines: number; minutes: number }>>> {
  const out: Record<string, Partial<Record<Queue, { lines: number; minutes: number }>>> = {}
  for (const it of items) {
    const v = (out[it.voice] ??= {})
    const q = (v[it.queue] ??= { lines: 0, minutes: 0 })
    q.lines++
    q.minutes += recordSeconds(it) / 60
  }
  for (const v of Object.values(out)) for (const q of Object.values(v)) q!.minutes = Math.round(q!.minutes)
  return out
}
