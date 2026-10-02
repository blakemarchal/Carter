// Question generators for each skill, tuned by level (see progress.recordAnswer).
import type { Skill } from './progress'
import { CVC, SIGHT, LETTER_PICS, LETTER_SOUND } from '../data/words'
import { pick, randInt, shuffle } from './util'

export type Visual =
  | { kind: 'letter'; text: string }
  | { kind: 'word'; text: string; sounds?: string[] }
  | { kind: 'emoji'; items: string[] }
  | { kind: 'sequence'; nums: (number | null)[] }
  | { kind: 'sum'; a: number; b: number; op: '+' | '-'; emoji: string }
  | { kind: 'listen' }

export interface Choice {
  label: string
  say: string
}

export interface Question {
  skill: Skill
  say: string
  visual: Visual
  choices: Choice[]
  answer: number
}

function build(skill: Skill, say: string, visual: Visual, right: Choice, wrong: Choice[]): Question {
  const choices = shuffle([right, ...wrong])
  return { skill, say, visual, choices, answer: choices.indexOf(right) }
}

const numChoice = (n: number): Choice => ({ label: String(n), say: String(n) })

// ---------- Reading ----------
function readingQ(level: number): Question {
  if (level <= 1) {
    const letters = Object.keys(LETTER_PICS)
    const letter = pick(letters)
    const right = pick(LETTER_PICS[letter])
    const wrong = shuffle(letters.filter((l) => l !== letter)).slice(0, 2).map((l) => pick(LETTER_PICS[l]))
    return build('reading', `Which picture starts with the ${LETTER_SOUND[letter]} sound? ${letter}!`,
      { kind: 'letter', text: letter.toUpperCase() + letter },
      { label: right.emoji, say: right.word }, wrong.map((w) => ({ label: w.emoji, say: w.word })))
  }
  if (level <= 3) {
    const n = level === 2 ? 2 : 3
    const [right, ...wrong] = shuffle(CVC).slice(0, n + 1)
    return build('reading', 'Read the word. Then tap the picture that matches!',
      { kind: 'word', text: right.word, sounds: right.word.split('') },
      { label: right.emoji, say: right.word }, wrong.map((w) => ({ label: w.emoji, say: w.word })))
  }
  // Levels 4–5: hear a word, find it in print.
  const pool = level === 4 ? SIGHT : [...SIGHT, ...CVC.map((c) => c.word)]
  const [right, ...wrong] = shuffle(pool).slice(0, level === 4 ? 3 : 4)
  return build('reading', `Find the word: ${right}.`, { kind: 'listen' },
    { label: right, say: right }, wrong.map((w) => ({ label: w, say: w })))
}

// ---------- Numbers ----------
const ANIMALS = ['🐑', '🐟', '🦆', '🐞', '⭐', '🍎', '🐸', '🐣']

function nearby(n: number, count: number, spread: number[]): number[] {
  const out = new Set<number>()
  for (const d of shuffle(spread)) {
    if (out.size >= count) break
    if (n + d > 0 && n + d !== n) out.add(n + d)
  }
  return [...out]
}

function nextNumberQ(lo: number, hi: number, decadeCrossing: boolean): Question {
  // Carter sometimes forgets which decade comes next (69 → 70), so we practice that a lot.
  const end = decadeCrossing ? randInt(Math.ceil(lo / 10), Math.floor(hi / 10)) * 10 : randInt(lo, hi)
  const nums = [end - 3, end - 2, end - 1]
  return build('numbers', `${nums.join(', ')}. What number comes next?`,
    { kind: 'sequence', nums: [...nums, null] },
    numChoice(end), nearby(end, 2, decadeCrossing ? [-10, 10, 1, -1] : [1, -1, 2, 10]).map(numChoice))
}

function numbersQ(level: number): Question {
  if (level <= 1) {
    const n = randInt(3, 10)
    const e = pick(ANIMALS)
    return build('numbers', 'How many? Count them!', { kind: 'emoji', items: Array(n).fill(e) },
      numChoice(n), nearby(n, 2, [1, -1, 2, -2]).map(numChoice))
  }
  if (level === 2) return nextNumberQ(10, 40, Math.random() < 0.4)
  if (level === 3) return nextNumberQ(30, 100, Math.random() < 0.6)
  if (level === 4) {
    if (Math.random() < 0.5) return nextNumberQ(40, 100, true)
    const a = randInt(1, 5), b = randInt(1, 5)
    return build('numbers', `${a} plus ${b}. How many in all?`, { kind: 'sum', a, b, op: '+', emoji: pick(ANIMALS) },
      numChoice(a + b), nearby(a + b, 2, [1, -1, 2]).map(numChoice))
  }
  if (Math.random() < 0.4) return nextNumberQ(90, 130, true)
  const plus = Math.random() < 0.5
  const a = randInt(plus ? 2 : 5, plus ? 7 : 10)
  const b = randInt(1, plus ? 10 - a : a - 1)
  const ans = plus ? a + b : a - b
  return build('numbers', plus ? `${a} plus ${b}?` : `${a} take away ${b}?`,
    { kind: 'sum', a, b, op: plus ? '+' : '-', emoji: pick(ANIMALS) },
    numChoice(ans), nearby(ans, 2, [1, -1, 2]).map(numChoice))
}

export function makeQuestion(skill: Skill, level: number): Question {
  return skill === 'reading' ? readingQ(level) : numbersQ(level)
}
