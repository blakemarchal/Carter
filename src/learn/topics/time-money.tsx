// Clocks, coins and measuring (docs/GAME-PLAN.md §4): time to the hour and half hour, the market
// (paying with coins), and longer or shorter.
// STUB: each generator falls back to an earlier question until it's built.
import type { Question } from '../../lib/questions'
import { numbersQ } from '../../lib/questions'
import type { Exercise, ExerciseView, LearnView } from '../types'

/** Level 8. Read a clock to the hour: "What time is it?" (choices like "three o'clock"). */
export function clockHourQ(theme?: string): Question { return numbersQ(5, theme) }

/** Level 8. Set a clock: drag the hour hand to show a time said aloud. */
export function clockHourEx(): Exercise | null { return null }

/** Level 9. Coins: "How much money?" with pennies, nickels and dimes (US coins), up to twenty cents. */
export function coinsQ(theme?: string): Question { return numbersQ(5, theme) }

/** Level 9. The market: pay for something by dragging coins into a hand until it's the price. */
export function coinsEx(): Exercise | null { return null }

/** Level 10. Read a clock to the half hour ("half past four"). */
export function halfHourQ(theme?: string): Question { return numbersQ(5, theme) }

/** Level 10. Longer or shorter (taller, shorter): compare two or three things, or line them up. */
export function measureQ(theme?: string): Question { return numbersQ(5, theme) }

/** Level 10. Measuring: put things in order from shortest to longest, or measure with blocks. */
export function measureEx(): Exercise | null { return null }

/** Pictures for these questions' `learn` visuals. */
export const VIEWS: Record<string, LearnView> = {}
/** The components that play these exercises, by `kind`. */
export const EXERCISES: Record<string, ExerciseView> = {}
