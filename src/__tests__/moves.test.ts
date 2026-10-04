import { expect, it } from 'vitest'
import { MOVE_KINDS, movesFor } from '../lib/moves'
import { PALS, palById } from '../data/pals'
import type { Progress } from '../lib/progress'

/** "Thunder Joy" and "Thunderjoy" are the same name to a child hearing it. */
const said = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '')

it('no two Pals share a move name', () => {
  const owner = new Map<string, string>()
  for (const p of PALS) for (const k of MOVE_KINDS) {
    const n = said(p.moves[k].name)
    expect(owner.get(n), `${p.id}'s ${p.moves[k].name}`).toBeUndefined()
    owner.set(n, `${p.id} (${k})`)
  }
})
it('no move has the name of one of its own Pal\'s stages', () => {
  for (const p of PALS) for (const k of MOVE_KINDS) for (const s of p.stages) {
    expect(said(p.moves[k].name), `${p.id}: ${p.moves[k].name} / ${s.name}`).not.toBe(said(s.name))
  }
})

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
