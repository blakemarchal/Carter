// Every topic's views and exercise players in one place, by name (see ./types).
import type { ExerciseView, LearnView } from './types'
import * as reading from './topics/reading'
import * as builders from './topics/builders'
import * as numbers from './topics/numbers'
import * as timeMoney from './topics/time-money'

export const VIEWS: Record<string, LearnView> = { ...reading.VIEWS, ...numbers.VIEWS, ...timeMoney.VIEWS }
export const EXERCISES: Record<string, ExerciseView> = { ...builders.EXERCISES, ...numbers.EXERCISES, ...timeMoney.EXERCISES }
