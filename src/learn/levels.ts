// The learning backbone's levels (docs/GAME-PLAN.md §4). Each skill has ten levels; the adaptive rule
// (lib/progress.ts recordAnswer) moves a child up after three right in a row and down after two misses.
// A level asks mostly its own new thing, mixed with a little of what came before, so skills stay fresh.
// Levels 1 to 6 hold the game's first questions (lib/questions.ts readingQ and numbersQ, by their old
// level), so a child's saved level carries over (see SKILLS_MIGRATION).
import type { Question } from '../lib/questions'
import { numbersQ, readingQ } from '../lib/questions'
import type { Skill } from '../lib/progress'
import type { Exercise, Level } from './types'
import * as reading from './topics/reading'
import * as builders from './topics/builders'
import * as numbers from './topics/numbers'
import * as timeMoney from './topics/time-money'

type Make<T> = (theme?: string) => T

/** Picks one maker by weight each time. */
function mix<T>(...options: [number, Make<T>][]): Make<T> {
  const total = options.reduce((s, [w]) => s + w, 0)
  return (theme) => {
    let r = Math.random() * total
    for (const [w, make] of options) if ((r -= w) < 0) return make(theme)
    return options[options.length - 1][1](theme)
  }
}

const q = (make: Make<Question>) => make

export const LEVELS: Record<Skill, Level[]> = {
  reading: [
    { label: 'Beginning sounds', question: () => readingQ(1) },
    { label: 'Rhyming words', question: mix([3, reading.rhymeQ], [1, () => readingQ(1)]) },
    { label: 'Read 3-letter words', question: () => readingQ(2), exercise: () => builders.wordBuildEx(3) },
    { label: 'Read and spell 3-letter words', question: () => readingQ(3), exercise: () => builders.wordBuildEx(4) },
    { label: 'Sight words', question: () => readingQ(4) },
    { label: 'Word families', question: mix([3, reading.wordFamilyQ], [2, () => readingQ(5)]), exercise: () => builders.wordBuildEx(6) },
    { label: 'Short sentences: match the picture', question: q(reading.sentencePictureQ) },
    { label: 'Build a sentence', question: q(reading.sentencePictureQ), exercise: builders.sentenceBuildEx },
    { label: 'Read a sentence and answer', question: q(reading.readAndAnswerQ) },
    { label: 'Tiny stories', question: mix([3, reading.tinyStoryQ], [1, reading.readAndAnswerQ]) },
  ],
  numbers: [
    { label: 'Count to 10, shapes', question: mix([3, (t) => numbersQ(1, t)], [1, numbers.shapesQ]) },
    { label: 'Count to 20, what comes next (to 40)', question: mix([2, numbers.countTo20Q], [3, (t) => numbersQ(2, t)]) },
    { label: 'More or fewer, what comes next (to 100)', question: mix([1, numbers.moreFewerQ], [1, (t) => numbersQ(3, t)]) },
    { label: 'Adding within 10', question: (t) => numbersQ(4, t) },
    { label: 'Taking away within 10, patterns', question: mix([3, (t) => numbersQ(5, t)], [2, numbers.patternQ]) },
    { label: 'Adding and taking away within 20', question: q(numbers.within20Q), exercise: numbers.numberLineEx },
    { label: 'Tens and ones', question: q(numbers.tensOnesQ) },
    { label: 'Time to the hour', question: q(timeMoney.clockHourQ), exercise: timeMoney.clockHourEx },
    { label: 'Coins', question: q(timeMoney.coinsQ), exercise: timeMoney.coinsEx },
    { label: 'Half hours and measuring', question: mix([1, timeMoney.halfHourQ], [1, timeMoney.measureQ]), exercise: timeMoney.measureEx },
  ],
}

/** The level's definition (levels count from 1; out-of-range levels are clamped). */
export function levelFor(skill: Skill, level: number): Level {
  const all = LEVELS[skill]
  return all[Math.min(all.length, Math.max(1, Math.round(level))) - 1]
}

/**
 * Saves from before the backbone had five levels per skill. Their old level maps to the level that
 * now holds the same questions (reading's old 2 to 5 moved up one, to make room for rhyming).
 */
export const SKILLS_MIGRATION: Record<Skill, Record<number, number>> = {
  reading: { 1: 1, 2: 3, 3: 4, 4: 5, 5: 6 },
  numbers: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
}

/** How often a practice turn is an exercise, when the level has one. */
export const EXERCISE_SHARE = 0.4

/** An exercise for this level, if it has one ready (null when its topic isn't built yet). */
export function exerciseFor(skill: Skill, level: number, theme?: string): Exercise | null {
  return levelFor(skill, level).exercise?.(theme) ?? null
}
