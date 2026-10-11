// The learning backbone (docs/GAME-PLAN.md §4): what a practice round can hold besides a multiple-choice
// question, and the shapes the topic modules (./topics/*) fill in.
import type { ComponentType } from 'react'
import type { Question } from '../lib/questions'
import type { Skill } from '../lib/progress'

/**
 * An interactive exercise: the child builds or moves something instead of picking an answer
 * (spell a word with letter tiles, hop along a number line, set a clock's hands…).
 * Every exercise has a `kind` (which component plays it), the skill it practices, and what's said to ask it.
 * The rest of its fields are the kind's own (see the topic module that makes it).
 */
export interface Exercise {
  kind: string
  skill: Skill
  /** Said when it starts, and again from the 🔊 button. Spoken-text rules apply (docs/ISLAND-GUIDE.md). */
  say: string
  /** Two exercises with the same key count as the same one (so a round doesn't repeat itself). */
  key: string
  [field: string]: unknown
}

/**
 * Plays one exercise. Calls `onResult(firstTry)` exactly once, when the child has got it right
 * (whether first time or after help). `firstTry` is false if she needed any retries or hints.
 * No failure: a wrong move wiggles and is undone, and after two misses the next right move is shown.
 * The card around it (./ExerciseCard) says the prompt, scores it, praises, and moves on.
 */
export type ExerciseView<E extends Exercise = Exercise> = ComponentType<{ ex: E; onResult: (firstTry: boolean) => void }>

/** One thing in a practice round. */
export type Task = { type: 'choice'; q: Question } | { type: 'exercise'; ex: Exercise }

/**
 * A level of a skill: what a parent sees in the Parent Corner, the multiple-choice questions it asks
 * (also used in battles, which only ask questions), and optionally an interactive exercise that a
 * practice round mixes in about every other turn.
 */
export interface Level {
  label: string
  question: (theme?: string) => Question
  exercise?: (theme?: string) => Exercise | null
}

/**
 * A picture inside a question (a clock, coins, a sentence to read…): the `learn` visual names a view
 * from a topic module's VIEWS and carries its data.
 */
export type LearnViewProps = { data: unknown; onSay: (text: string) => void }
export type LearnView = ComponentType<LearnViewProps>
