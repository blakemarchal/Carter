// Number questions beyond the first five levels (docs/GAME-PLAN.md §4): shapes, counting to twenty,
// more or fewer, patterns, adding and taking away within twenty, tens and ones, and the number line hop.
// STUB: each generator falls back to an earlier question until it's built.
import type { Question } from '../../lib/questions'
import { numbersQ } from '../../lib/questions'
import type { Exercise, ExerciseView, LearnView } from '../types'

/** Level 1. Shapes: "Which one is a triangle?" (circle, square, triangle, rectangle, star, heart…). */
export function shapesQ(theme?: string): Question { return numbersQ(1, theme) }

/** Level 2. Count up to twenty things (in rows of five or ten, so they can be counted). */
export function countTo20Q(theme?: string): Question { return numbersQ(1, theme) }

/** Level 3. More or fewer: two groups, "Which has more?" / "Which has fewer?". */
export function moreFewerQ(theme?: string): Question { return numbersQ(3, theme) }

/** Level 5. Patterns: "red, blue, red, blue, …what comes next?" (colors, shapes, then ABB/AAB). */
export function patternQ(theme?: string): Question { return numbersQ(5, theme) }

/** Level 6. Adding and taking away within twenty. */
export function within20Q(theme?: string): Question { return numbersQ(5, theme) }

/** Level 7. Tens and ones: bundles of ten and loose ones, "How many in all?" (and the reverse). */
export function tensOnesQ(theme?: string): Question { return numbersQ(5, theme) }

/** Level 6. Number line hop: hop a Pal along a line from 0 to 20 to show a sum or a take-away. */
export function numberLineEx(): Exercise | null { return null }

/** Pictures for these questions' `learn` visuals. */
export const VIEWS: Record<string, LearnView> = {}
/** The components that play these exercises, by `kind`. */
export const EXERCISES: Record<string, ExerciseView> = {}
