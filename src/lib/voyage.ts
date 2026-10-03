// The voyage rules (docs/GAME-PLAN.md §3): which seas and islands are open, and the daily voyage.
// Seas are sailed in order; a sea opens once every built island in the seas before it is done.
// Inside a sea, islands open one after another. Islands that aren't built yet are "coming soon" and
// never block the way. The daily voyage: a few new visits a day (parents choose how many); finished
// islands can always be played again, and nothing in the Ark ever runs out.
import { SEAS } from '../data/seas'

/** Whether an island has content yet (passed in, so these rules stay pure and testable). */
export type IsBuilt = (id: string) => boolean

export type IslandState = 'soon' | 'locked' | 'next' | 'done'

const seaIndexOf = (id: string) => SEAS.findIndex((s) => s.islands.some((i) => i.id === id))

/**
 * Whether a sea is open. Every sea up to the furthest one a player has finished an island in stays
 * open, so progress never locks again (a new island added to an earlier sea is just there to play).
 * The seas after that open in turn, once every built island from the furthest sea on is done.
 */
export function seaOpen(sea: number, done: string[], built: IsBuilt, openAll = false): boolean {
  if (openAll || sea <= 0) return true
  const reached = Math.max(0, ...done.map(seaIndexOf))
  if (sea <= reached) return true
  return SEAS.slice(reached, sea).every((s) => s.islands.every((i) => !built(i.id) || done.includes(i.id)))
}

/** One island on its sea's map. */
export function islandState(sea: number, index: number, done: string[], built: IsBuilt, openAll = false): IslandState {
  const isl = SEAS[sea].islands[index]
  if (!built(isl.id)) return 'soon'
  if (done.includes(isl.id)) return 'done'
  if (openAll) return 'next'
  if (!seaOpen(sea, done, built)) return 'locked'
  const before = SEAS[sea].islands.slice(0, index).filter((i) => built(i.id))
  return before.every((i) => done.includes(i.id)) ? 'next' : 'locked'
}

/** The sea a player is up to: the first open sea with a built island still to do (else the last open sea). */
export function currentSea(done: string[], built: IsBuilt, openAll = false): number {
  let last = 0
  for (let s = 0; s < SEAS.length; s++) {
    if (!seaOpen(s, done, built, openAll)) break
    last = s
    if (SEAS[s].islands.some((i) => built(i.id) && !done.includes(i.id))) return s
  }
  return last
}

// ---------- The daily voyage ----------

/** New visits finished today. */
export interface Voyage { day: string; visits: number }

/** How many new visits are left today; `limit` 0 means no limit. */
export function visitsLeft(v: Voyage | undefined, today: string, limit: number): number {
  if (!limit) return Infinity
  return Math.max(0, limit - (v?.day === today ? v.visits : 0))
}

/** Count one more new visit finished today. */
export const countVisit = (v: Voyage | undefined, today: string): Voyage =>
  v?.day === today ? { day: today, visits: v.visits + 1 } : { day: today, visits: 1 }

/** The daily-visit choices in the Parent Corner (0 = no limit). */
export const DAILY_VISIT_CHOICES = [1, 2, 3, 4, 0]
export const DEFAULT_DAILY_VISITS = 2
