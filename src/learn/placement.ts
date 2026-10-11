// The placement game (docs/GAME-PLAN.md §4): a short treasure hunt with the player's Pal, the first time
// they play, that finds where to start each skill's ten levels. Here: who gets it, and how it picks
// the next question's level. The game itself is screens/Placement.tsx.
import type { Progress, Skill } from '../lib/progress'
import { LEVELS } from './levels'

/** The first question's level: a little below the middle, so most children start with a win. */
export const PLACEMENT_START = 3
/** At most this many questions per skill (about two minutes for both skills). */
export const PLACEMENT_MAX = 5

/**
 * A search for one skill's level. `lo` is the highest level answered (0 = none yet), `hi` the lowest
 * level missed (top + 1 = none yet); the level is somewhere from `lo` up to just below `hi`.
 */
export interface LevelSearch {
  lo: number
  hi: number
  /** The level to ask next. */
  level: number
  asked: number
  /** The skill's top level. */
  top: number
}

export function startSearch(skill: Skill): LevelSearch {
  const top = LEVELS[skill].length
  return { lo: 0, hi: top + 1, level: Math.min(PLACEMENT_START, top), asked: 0, top }
}

/** Done once the level is pinned between an answered level and the one above it (or after PLACEMENT_MAX). */
export const searchDone = (s: LevelSearch) => s.hi - s.lo <= 1 || s.asked >= PLACEMENT_MAX

/**
 * After an answer: right moves the search up (two levels at a time until the first miss), a miss or
 * "not sure" moves it down; after the first miss it halves the gap between `lo` and `hi`.
 */
export function afterAnswer(s: LevelSearch, right: boolean): LevelSearch {
  const lo = right ? Math.max(s.lo, s.level) : s.lo
  const hi = right ? s.hi : Math.min(s.hi, s.level)
  const missedOne = hi <= s.top
  const level = right && !missedOne ? Math.min(s.level + 2, s.top) : Math.max(1, Math.floor((lo + hi) / 2))
  return { ...s, lo, hi, level, asked: s.asked + 1 }
}

/** The level to start at: the highest one answered (level 1 if none). */
export const placedLevel = (s: LevelSearch) => Math.max(1, s.lo)

/** Has this player played already? Then they keep their levels and never get the placement game. */
export function hasProgress(p: Progress) {
  return p.islandsDone.length > 0
    || Object.values(p.islandStep).some((n) => n > 0)
    || p.skills.reading > 1 || p.skills.numbers > 1
    || p.battlesWon > 0
}

/**
 * Offered once, to a brand-new player: a save from before the placement game has no `placement`
 * (so it's never offered), and once it's played or skipped it's 'done'. A parent can rerun it.
 */
export const placementDue = (p: Progress) => p.placement === 'due' && !hasProgress(p)
