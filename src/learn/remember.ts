// The "Remember?" round (docs/GAME-PLAN.md, the learning wave of Oct 2026): a short daily round of what the
// player already knows, asked again on a growing schedule so it stays known: the memory verse of each island
// they've finished (one piece is missing: which?), the sight words once they read them, and the animals they've
// met (where it lives, what its baby is called). Each thing sits in a box (Leitner): a right answer moves it up
// a box and it comes back after INTERVALS[box] days; a miss puts it back in the first box, for tomorrow.
// Progress keeps the boxes (`remember`) and the day the round was last played (`rememberDay`); the screen is
// screens/Remember.tsx, the verse's picture learn/topics/remember.tsx.
import { ANIMALS, SORTS, animalById, animalsMet, type Animal } from '../data/animals'
import { BIG_WORDS, bigWordByName, meaningSay, type BigWord } from '../data/bigwords'
import { SCIENCE, scienceAsk, type Science } from '../data/science'
import { ISLANDS, islandById, type Island } from '../data/islands'
import { SIGHT } from '../data/words'
import { build, sayWord, type Choice, type Question } from '../lib/questions'
import type { Progress } from '../lib/progress'
import { shuffle } from '../lib/util'

/** Days until something in each box is asked again (box 0: new, or just missed). */
export const INTERVALS = [1, 2, 4, 8, 16]
export const TOP_BOX = INTERVALS.length - 1
/** How many things a round asks, and at most how many of them for the first time. */
export const ROUND_SIZE = 5
export const NEW_PER_ROUND = 3
/** Sight words join the round once the reader is at this level (learn/levels.ts: "Sight words"). */
export const WORDS_LEVEL = 5

export type Kind = 'verse' | 'word' | 'animal' | 'bigword' | 'science'
export const KINDS: Kind[] = ['verse', 'word', 'animal', 'bigword', 'science']
/** Where a thing stands: its box, and the day it's next asked (YYYY-MM-DD). */
export interface Memory { box: number; due: string }

/** What a thing is: `verse:<island>`, `word:<sight word>`, `animal:<animal id>`, `bigword:<word>` or `science:<island>`. */
export const kindOf = (id: string): Kind => id.split(':')[0] as Kind
const nameOf = (id: string) => id.slice(id.indexOf(':') + 1)

/** `day` plus `n` days, written as the game writes days (local time). */
export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number)
  const t = new Date(y, m - 1, d + n)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

/**
 * Everything the player has learned so far that the round can ask. `islands` are their finished islands'
 * content, for the animals they've met there (none given: the verses and words alone, which the map can tell).
 */
export function known(p: Progress, islands: Island[] = []): string[] {
  const out: string[] = []
  for (const id of p.islandsDone) if (islandById(id)) out.push(`verse:${id}`)
  if (p.skills.reading >= WORDS_LEVEL) for (const w of SIGHT) out.push(`word:${w}`)
  for (const id of animalsMet(p, islands)) out.push(`animal:${id}`)
  for (const id of p.islandsDone) for (const b of BIG_WORDS[id] ?? []) out.push(`bigword:${b.word}`)
  for (const id of p.islandsDone) if (SCIENCE[id]) out.push(`science:${id}`)
  return out
}

/**
 * Today's round: the things that are due (the longest-waiting first, then the shakiest), then up to NEW_PER_ROUND
 * things not asked yet (verses before animals before words: the verse is the heart of an island), ROUND_SIZE in all.
 */
export function planRound(p: Progress, day: string, islands: Island[] = []): string[] {
  const boxes = p.remember ?? {}
  const due = Object.entries(boxes).filter(([, m]) => m.due <= day)
    .sort(([, a], [, b]) => a.due.localeCompare(b.due) || a.box - b.box).map(([id]) => id)
  const fresh = known(p, islands).filter((id) => !boxes[id])
  const ofKind = (k: Kind) => shuffle(fresh.filter((id) => kindOf(id) === k))
  const news = [...ofKind('verse'), ...ofKind('bigword'), ...ofKind('science'), ...ofKind('animal'), ...ofKind('word')]
  const room = Math.min(NEW_PER_ROUND, Math.max(0, ROUND_SIZE - due.length))
  return [...due.slice(0, ROUND_SIZE), ...news.slice(0, room)]
}

/** Whether there's a round to play today: something due or new, and it hasn't been played yet. */
export const roundDue = (p: Progress, day: string, islands: Island[] = []) => p.rememberDay !== day && planRound(p, day, islands).length > 0

/** The player answered `id`, right the first time or not: it moves up a box, or back to the first. */
export function remembered(p: Progress, id: string, right: boolean, day: string): Progress {
  const was = p.remember?.[id]?.box ?? 0
  const box = right ? Math.min(TOP_BOX, was + 1) : 0
  return { ...p, remember: { ...p.remember, [id]: { box, due: addDays(day, INTERVALS[box]) } } }
}

// ---------- The questions ----------

/** An island's memory verse, as the round asks it. */
export interface Verse { island: string; name: string; chunks: string[]; ref: string }
export function verseOf(isl: Island): Verse | undefined {
  for (const s of isl.steps) if (s.kind === 'verse') return { island: isl.id, name: isl.name, chunks: s.chunks, ref: s.ref }
}

export const VERSE_ASK = (islandName: string) => `Our verse from ${islandName}! Which piece is missing?`
export const HOME_ASK = (a: Animal) => `Where does the ${a.name} live?`
export const BABY_ASK = (a: Animal) => `What is a baby ${a.name} called?`

/** A verse with one piece missing; the choices are the piece and two pieces of other verses they know. */
export function verseQ(v: Verse, others: Verse[]): Question {
  const missing = Math.floor(Math.random() * v.chunks.length)
  const piece = (c: string): Choice => ({ label: c, say: c })
  const pool = others.filter((o) => o.island !== v.island).flatMap((o) => o.chunks).filter((c) => c !== v.chunks[missing])
  // (the verse's own other pieces will do while few verses are known)
  const spare = v.chunks.filter((_, i) => i !== missing)
  const wrong = [...shuffle(pool), ...shuffle(spare)].slice(0, 2)
  return build('reading', VERSE_ASK(v.name), { kind: 'learn', view: 'rm-verse', data: { chunks: v.chunks, missing, ref: v.ref } },
    piece(v.chunks[missing]), wrong.map(piece))
}

/** Hear a sight word, find it in print (as the Sight words level asks). */
export function wordQ(w: string): Question {
  const wrong = shuffle(SIGHT.filter((x) => x !== w)).slice(0, 2)
  return build('reading', `Find the word: ${sayWord(w)}.`, { kind: 'listen' }, { label: w, say: sayWord(w) }, wrong.map((x) => ({ label: x, say: sayWord(x) })))
}

/** An animal they've met: where it lives (the book's land, sea and sky), or what its baby is called. */
export function animalQ(a: Animal, ask: 'home' | 'baby' = Math.random() < 0.5 ? 'home' : 'baby'): Question {
  const visual = { kind: 'learn', view: 'rd-word-pic', data: { word: a.name, art: a.id } } as const
  if (ask === 'home') {
    const groups = SORTS.home.groups
    const right = groups.find((g) => g.id === a.home)!
    const choice = (g: typeof right): Choice => ({ label: g.emoji, art: g.art, say: g.say })
    return build('reading', HOME_ASK(a), visual, choice(right), groups.filter((g) => g !== right).map(choice))
  }
  const wrong = shuffle([...new Set(ANIMALS.filter((x) => x.baby !== a.baby).map((x) => x.baby))]).slice(0, 2)
  return build('reading', BABY_ASK(a), visual, { label: a.baby, say: a.baby }, wrong.map((b) => ({ label: b, say: b })))
}

/**
 * A big word from a story (data/bigwords.ts): what does it mean? The three meanings are read out in the order
 * they're written (so the line is fixed), with their pictures as reminders.
 */
export function bigWordQ(b: BigWord): Question {
  return {
    skill: 'reading', say: meaningSay(b), visual: { kind: 'learn', view: 'rd-word-pic', data: { word: b.word, art: b.emoji } },
    choices: b.choices.map((c) => ({ label: c.emoji, say: c.say })), answer: b.answer,
  }
}

/** A science moment's question (data/science.ts), its answers read out in order, as the big words' are. */
export function scienceQ(sc: Science): Question {
  return {
    skill: 'reading', say: scienceAsk(sc), visual: { kind: 'learn', view: 'rd-word-pic', data: { word: sc.title, art: sc.emoji } },
    choices: sc.choices.map((c) => ({ label: c.emoji, say: c.say })), answer: sc.answer,
  }
}

/** The question for a thing in the round (none if its island's verse isn't here). */
export function questionFor(id: string, verses: Verse[]): Question | undefined {
  const name = nameOf(id)
  switch (kindOf(id)) {
    case 'verse': { const v = verses.find((x) => x.island === name); return v && verseQ(v, verses) }
    case 'word': return SIGHT.includes(name) ? wordQ(name) : undefined
    case 'animal': { const a = animalById(name); return a && animalQ(a) }
    case 'bigword': { const b = bigWordByName(name); return b && bigWordQ(b) }
    case 'science': { const sc = SCIENCE[name]; return sc && scienceQ(sc) }
  }
}

// ---------- What the round says ----------

export const INTRO = "Remember? Let's see what you remember!"
export const NUDGE = 'Can you remember? Tap the thinking bubble!'
export const CHEER = 'You remembered! Come back tomorrow for more.'
export const DONE_TODAY = 'All remembered for today! Come back tomorrow.'

/** Every fixed line the round says, for the voice script (the verse pieces are in the islands' own lines, the big words' questions in theirs). */
export function rememberLines(): string[] {
  const out = new Set<string>([INTRO, NUDGE, CHEER, DONE_TODAY])
  for (const i of ISLANDS) out.add(VERSE_ASK(i.name))
  for (const a of ANIMALS) { out.add(HOME_ASK(a)); out.add(BABY_ASK(a)); out.add(`${a.baby}!`) }
  for (const g of SORTS.home.groups) out.add(`${g.say}!`)
  for (const w of SIGHT) { out.add(`Find the word: ${sayWord(w)}.`); out.add(`${sayWord(w)}!`) }
  return [...out]
}
