// Stars on an island: how many questions were answered right the first time while playing it.
// The island screen provides the score keeper; question cards report each answer to it.
import { createContext } from 'react'

/** Called with whether a question was answered right the first time. */
export const ScoreContext = createContext<((firstTry: boolean) => void) | null>(null)

/** 1 to 3 stars: nearly all first-try answers is 3, most is 2, anything else (still finishing!) is 1. */
export function starsFor(right: number, total: number) {
  if (!total) return 3
  const k = right / total
  return k >= 0.85 ? 3 : k >= 0.6 ? 2 : 1
}
