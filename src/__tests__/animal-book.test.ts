// Noah's Animal Book (data/animals.ts): every card has a drawing and sound facts; the islands it names exist;
// the animals a finished island brings; facts by reading level; and what the book says, for the voice script.
import { describe, expect, it } from 'vitest'
import { ANIMALS, EATS_NAMES, HOME_NAMES, SORTS, STORY_ANIMALS, animalsIn, animalsMet, bookLines, factsFor } from '../data/animals'
import { ISLANDS, loadIsland } from '../data/islands'
import { itemById } from '../art/items'
import { fresh } from '../lib/progress'

describe('the animal cards', () => {
  it('each has a drawing, a kind, a home, a food, a baby, a sound and three facts', () => {
    const ids = new Set<string>()
    for (const x of ANIMALS) {
      expect(ids.has(x.id), `${x.id} twice`).toBe(false)
      ids.add(x.id)
      expect(itemById(x.id), `${x.id} has no drawing`).toBeTruthy()
      expect(Object.keys(HOME_NAMES)).toContain(x.home)
      expect(Object.keys(EATS_NAMES)).toContain(x.eats)
      expect(x.baby.length).toBeGreaterThan(1)
      expect(x.sound.length).toBeGreaterThan(1)
      expect(x.facts).toHaveLength(3)
      for (const f of x.facts) {
        expect(f.length, `${x.id}: a fact is too short`).toBeGreaterThan(15)
        expect(f, `${x.id}: a fact doesn't end with a full stop`).toMatch(/[.!]$/)
        expect(f).not.toMatch(/[{}]/)
      }
      // (the first fact is the simplest: short, for a beginning reader)
      expect(x.facts[0].length, `${x.id}: the first fact is long`).toBeLessThan(60)
    }
    expect(ANIMALS.length).toBeGreaterThan(40)
  })

  it('names only islands that exist, and only animals that have cards', () => {
    const islands = new Set(ISLANDS.map((i) => i.id))
    const cards = new Set(ANIMALS.map((x) => x.id))
    for (const [isl, ids] of Object.entries(STORY_ANIMALS)) {
      expect(islands.has(isl), isl).toBe(true)
      for (const id of ids) expect(cards.has(id), `${isl}: ${id}`).toBe(true)
    }
    // (every island has an entry, so a new island is thought about)
    for (const i of ISLANDS) expect(STORY_ANIMALS, i.id).toHaveProperty(i.id)
  })

  it('a sort game puts every animal in one of its groups', () => {
    for (const s of Object.values(SORTS)) {
      const groups = new Set(s.groups.map((g) => g.id))
      for (const x of ANIMALS) expect(groups.has(s.group(x)), `${s.title}: ${x.id}`).toBe(true)
      for (const g of s.groups) expect(itemById(g.art), g.art).toBeTruthy()
    }
  })
})

describe('meeting animals', () => {
  it('a finished island brings its activities’ animals and its story’s', async () => {
    const noah = await loadIsland('noah')
    const got = animalsIn(noah)
    expect(got).toContain('dove')
    expect(got).toContain('lion')
    expect(got.length).toBeGreaterThan(8)
    const creation = await loadIsland('creation')
    expect(animalsIn(creation)).toContain('frog')
    const jonah = await loadIsland('jonah')
    expect(animalsIn(jonah)).toContain('big-fish')
  })

  it('a new player has met none; finishing Noah opens Noah’s animals and no others', async () => {
    const noah = await loadIsland('noah')
    const daniel = await loadIsland('daniel')
    expect(animalsMet(fresh(), [noah, daniel]).size).toBe(0)
    const met = animalsMet({ ...fresh(), islandsDone: ['noah'] }, [noah, daniel])
    expect(met.has('dove')).toBe(true)
    expect(met.size).toBe(animalsIn(noah).length)
    const both = animalsMet({ ...fresh(), islandsDone: ['noah', 'daniel'] }, [noah, daniel])
    expect(both.size).toBeGreaterThanOrEqual(met.size)
  })

  it('a reader sees one fact at level 1, two at level 4, all three at level 7', () => {
    const lion = ANIMALS.find((x) => x.id === 'lion')!
    expect(factsFor(lion, 1)).toHaveLength(1)
    expect(factsFor(lion, 3)).toHaveLength(1)
    expect(factsFor(lion, 4)).toHaveLength(2)
    expect(factsFor(lion, 7)).toHaveLength(3)
    expect(factsFor(lion, 10)).toHaveLength(3)
  })
})

describe('what the book says', () => {
  it('has every name, fact, home-and-food line and sound, with nothing to fill in', () => {
    const lines = bookLines()
    expect(lines).toContain('Lion!')
    expect(lines).toContain('A lion is a big cat. It roars!')
    expect(lines).toContain('A lion lives on land. It eats other animals. A baby lion is called a cub.')
    expect(lines).toContain('A lion says roar!')
    expect(lines).toContain('A fish makes no sound at all.')
    expect(lines.some((l) => /[{}]/.test(l))).toBe(false)
    expect(lines.length).toBeGreaterThan(ANIMALS.length * 5)
  })
})
