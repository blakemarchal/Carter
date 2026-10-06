// Building with tiles (docs/GAME-PLAN.md §4): the word builder (spell a word from its picture with
// letter tiles) and the sentence builder (put word tiles in order to tell a picture).
// STUB: no exercises yet; the round asks questions instead.
import type { Exercise, ExerciseView } from '../types'

/**
 * Word builder. Levels 3–4: spell a three-letter word (its picture shown and said) from its letters
 * plus a spare. Level 6: word families, change the first letter to make a new word in the family.
 */
export function wordBuildEx(level: number): Exercise | null { void level; return null }

/** Sentence builder, level 8: drag three to five word tiles into order to tell the picture. */
export function sentenceBuildEx(): Exercise | null { return null }

/** The components that play these exercises, by `kind`. */
export const EXERCISES: Record<string, ExerciseView> = {}
