import { expect, it } from 'vitest'
import { movesFor } from '../lib/moves'
import { palById } from '../data/pals'
import type { Progress } from '../lib/progress'

const base = { pals: {}, islandsDone: [], battlesWon: 0 } as unknown as Progress

it('a new Pal knows only its basic move', () => {
  expect(movesFor(palById('zippy'), { ...base, pals: { zippy: 0 } }).map((s) => s.known)).toEqual([true, false, false])
})
it('winning a battle (or having finished an island) teaches the brave move', () => {
  expect(movesFor(palById('zippy'), { ...base, pals: { zippy: 0 }, battlesWon: 1 })[1].known).toBe(true)
  expect(movesFor(palById('zippy'), { ...base, pals: { zippy: 0 }, islandsDone: ['noah'] })[1].known).toBe(true)
})
it('growing up teaches the super move', () => {
  expect(movesFor(palById('zippy'), { ...base, pals: { zippy: 100 } })[2].known).toBe(true)
})
