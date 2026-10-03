// Birthdays: only a month and a day are ever stored, never a year. Used for the countdown in the
// week before, the surprise party on the day, and telling the other players "Today is ___'s birthday!"
import { numberWords } from './spoken'

export interface Birthday { month: number; day: number } // 1-12, 1-31

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const ORDINAL: Record<string, string> = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' }

/** Day number in words, as said in a date: 8 -> "eighth", 21 -> "twenty-first". */
export function ordinalWords(n: number) {
  const w = numberWords(n)
  const parts = w.split('-')
  const last = parts.pop()!
  const ord = ORDINAL[last] ?? (last.endsWith('y') ? `${last.slice(0, -1)}ieth` : `${last}th`)
  return [...parts, ord].join('-')
}

export const isValidBirthday = (b: unknown): b is Birthday =>
  !!b && typeof b === 'object' && Number.isInteger((b as Birthday).month) && Number.isInteger((b as Birthday).day) &&
  (b as Birthday).month >= 1 && (b as Birthday).month <= 12 && (b as Birthday).day >= 1 && (b as Birthday).day <= daysIn((b as Birthday).month, 2024)

/** Days in a month (2024 is a leap year, so Feb 29 is allowed when checking). */
function daysIn(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

/** "January 8" */
export const birthdayLabel = (b: Birthday) => `${MONTHS[b.month - 1]} ${b.day}`
/** "January eighth", for the narrator. */
export const birthdaySpoken = (b: Birthday) => `${MONTHS[b.month - 1]} ${ordinalWords(b.day)}`

/** The day of the birthday in a given year (Feb 29 is celebrated on Feb 28 when there's no 29th). */
function onYear(b: Birthday, year: number) {
  const day = Math.min(b.day, daysIn(b.month, year))
  return new Date(year, b.month - 1, day)
}

const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/** Whole days until the next birthday: 0 on the day itself. */
export function daysUntil(b: Birthday, now = new Date()) {
  const today = midnight(now)
  let next = onYear(b, today.getFullYear())
  if (next < today) next = onYear(b, today.getFullYear() + 1)
  return Math.round((next.getTime() - today.getTime()) / 86_400_000)
}

export const isBirthday = (b: Birthday | undefined, now = new Date()) => !!b && daysUntil(b, now) === 0

/** In the week before (1 to 7 sleeps to go)? Returns the number of sleeps, or 0. */
export function sleepsToGo(b: Birthday | undefined, now = new Date()) {
  if (!b) return 0
  const d = daysUntil(b, now)
  return d >= 1 && d <= 7 ? d : 0
}
