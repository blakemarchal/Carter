// The voyage: seas in Bible order, islands opening one after another, and the daily voyage.
import { describe, expect, it } from 'vitest'
import { SEAS, islandSpots } from '../data/seas'
import { countVisit, currentSea, islandState, seaOpen, visitsLeft } from '../lib/voyage'
import { savedStep, type Progress } from '../lib/progress'

// Today's built islands (the rest are "coming soon").
const BUILT = new Set(['creation', 'noah', 'david', 'jonah', 'christmas', 'loaves'])
const built = (id: string) => BUILT.has(id)
const at = (id: string): [number, number] => {
  const s = SEAS.findIndex((x) => x.islands.some((i) => i.id === id))
  return [s, SEAS[s].islands.findIndex((i) => i.id === id)]
}
const state = (id: string, done: string[], openAll = false) => islandState(...at(id), done, built, openAll)

describe('the seas', () => {
  it('every island appears once, and every sea fits on its map', () => {
    const ids = SEAS.flatMap((s) => s.islands.map((i) => i.id))
    expect(new Set(ids).size).toBe(ids.length)
    for (const s of SEAS) {
      expect(s.islands.length).toBeGreaterThanOrEqual(3)
      expect(islandSpots(s.islands.length)).toHaveLength(s.islands.length)
    }
  })

  it('a new player starts at Creation, and Noah opens after it', () => {
    expect(state('creation', [])).toBe('next')
    expect(state('noah', [])).toBe('locked')
    expect(state('noah', ['creation'])).toBe('next')
    expect(state('abraham', ['creation'])).toBe('soon')
  })

  it('islands that are coming soon never block the way', () => {
    // After Creation and Noah, the first sea has nothing else built, so the voyage goes on.
    const done = ['creation', 'noah']
    expect(seaOpen(1, done, built)).toBe(true) // Out of Egypt: nothing built yet
    expect(state('david', done)).toBe('next')
    expect(state('jonah', done)).toBe('locked')
  })

  it("keeps a player's finished islands when the map is reordered", () => {
    // Carter had finished Noah, Creation, David and Jonah on the old map.
    const done = ['noah', 'creation', 'david', 'jonah']
    for (const id of done) expect(state(id, done)).toBe('done')
    expect(state('christmas', done)).toBe('next')
    expect(state('loaves', done)).toBe('locked')
    expect(currentSea(done, built)).toBe(4) // Jesus Comes
  })

  it('never locks progress again when a new island is added to an earlier sea', () => {
    const done = ['noah', 'creation', 'david', 'jonah']
    const more = (id: string) => built(id) || id === 'abraham'
    const s = (id: string) => islandState(...at(id), done, more)
    expect(s('abraham')).toBe('next') // the new island is ready to play...
    expect(s('christmas')).toBe('next') // ...and the voyage ahead stays open
  })

  it('a new island in the sea a player is in comes first, but never closes an island they started', () => {
    const done = ['noah', 'creation', 'david', 'jonah']
    const more = (id: string) => built(id) || id === 'daniel' // Daniel arrives, before Jonah, in Kings & Prophets
    const s = (id: string, started: string[] = []) => islandState(...at(id), done, more, false, started)
    expect(s('daniel')).toBe('next')
    expect(s('christmas')).toBe('locked') // the next sea waits for Daniel…
    expect(s('christmas', ['christmas'])).toBe('next') // …unless they'd already begun Christmas
    expect(seaOpen(at('christmas')[0], done, more, false, ['christmas'])).toBe(true)
    expect(currentSea(done, more, false, ['christmas'])).toBe(at('daniel')[0])
  })

  it('a place saved in an older version of an island starts that island again', () => {
    const p = { islandStep: { christmas: 3, noah: 4 }, islandStepVersion: { noah: 2 } } as unknown as Progress
    expect(savedStep(p, 'christmas', 2)).toBe(0) // saved in the one-visit island: step 3 means something else now
    expect(savedStep(p, 'christmas')).toBe(3) // (an island that hasn't changed keeps its place)
    expect(savedStep(p, 'noah', 2)).toBe(4)
  })

  it('"all islands open" opens every built island', () => {
    expect(state('loaves', [], true)).toBe('next')
    expect(state('abraham', [], true)).toBe('soon')
  })
})

describe('the daily voyage', () => {
  it('counts new visits per day', () => {
    expect(visitsLeft(undefined, '2026-10-03', 2)).toBe(2)
    const one = countVisit(undefined, '2026-10-03')
    expect(visitsLeft(one, '2026-10-03', 2)).toBe(1)
    const two = countVisit(one, '2026-10-03')
    expect(visitsLeft(two, '2026-10-03', 2)).toBe(0)
    // A new day starts fresh.
    expect(visitsLeft(two, '2026-10-04', 2)).toBe(2)
    expect(countVisit(two, '2026-10-04')).toEqual({ day: '2026-10-04', visits: 1 })
  })

  it('0 means no limit', () => {
    expect(visitsLeft({ day: '2026-10-03', visits: 9 }, '2026-10-03', 0)).toBe(Infinity)
  })
})
