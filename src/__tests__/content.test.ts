// Checks every island and Pal, so a typo in new content can't ship.
import { describe, expect, it } from 'vitest'
import { ISLANDS, islandOpen } from '../data/islands'
import { PARTY_FOE, PARTY_PAL } from '../data/birthday'
import { PALS } from '../data/pals'
import { RECIPES, recipeFor } from '../data/recipes'

const EMOJI = /\p{Extended_Pictographic}/u
const palIds = new Set(PALS.map((p) => p.id))
const FX = ['spark', 'flame', 'rock', 'leaf', 'hearts', 'stars', 'wind', 'roll', 'bubbles']

describe('Pals', () => {
  it.each(PALS.map((p) => [p.id, p] as const))('%s is complete', (_, p) => {
    expect(p.stages).toHaveLength(3)
    expect(p.stages.map((s) => s.xp)).toEqual([0, 100, 300])
    for (const k of ['basic', 'brave', 'super'] as const) {
      expect(p.moves[k].name.length).toBeGreaterThan(2)
      expect(FX).toContain(p.moves[k].fx)
      expect(p.moves[k].icon).toMatch(EMOJI)
    }
    expect(p.intro.startsWith('is a')).toBe(true)
    expect(p.intro).not.toMatch(EMOJI)
  })
  it('ids are unique', () => expect(palIds.size).toBe(PALS.length))
})

describe.each(ISLANDS.filter((i) => i.steps).map((i) => [i.id, i] as const))('island %s', (_, isl) => {
  const steps = isl.steps!
  const spoken: string[] = []
  it('starts with a story and ends with a reward', () => {
    expect(steps[0].kind).toBe('story')
    expect(steps[steps.length - 1].kind).toBe('reward')
  })
  it('every step is well formed', () => {
    for (const s of steps) {
      switch (s.kind) {
        case 'story':
          expect(s.pages.length).toBeGreaterThanOrEqual(3)
          for (const pg of s.pages) spoken.push(pg.text)
          break
        case 'pairs':
          for (const a of s.animals) expect(s.names[a]).toBeTruthy()
          break
        case 'practice':
          spoken.push(s.intro)
          break
        case 'sequence':
          expect(s.items.length).toBeGreaterThanOrEqual(2)
          spoken.push(s.intro, ...s.items.map((t) => t.say))
          break
        case 'sort': {
          const groups = new Set(s.groups.map((g) => g.id))
          for (const item of s.items) expect(groups.has(item.group), item.say).toBe(true)
          spoken.push(s.intro, ...s.groups.map((g) => g.say), ...s.items.map((t) => t.say))
          break
        }
        case 'quiz':
          for (const q of s.questions) {
            expect(q.answer).toBeGreaterThanOrEqual(0)
            expect(q.answer).toBeLessThan(q.choices.length)
            spoken.push(q.say, ...q.choices.map((c) => c.say))
          }
          break
        case 'count':
          for (const n of s.rounds) expect(n >= 1 && n <= 10).toBe(true)
          spoken.push(s.intro, s.item.say, s.plural)
          break
        case 'trace':
          for (const l of s.letters) expect(l).toMatch(/^[A-Za-z]$/)
          spoken.push(s.intro)
          break
        case 'maze':
          spoken.push(s.intro, s.hero.say, s.goal.say)
          break
        case 'verse':
          expect(s.chunks.length).toBeGreaterThanOrEqual(2)
          expect(s.ref).toMatch(/\d+:\d+/)
          break
        case 'battle':
          expect(palIds.has(s.foe), s.foe).toBe(true)
          spoken.push(s.intro)
          break
        case 'reward':
          expect(palIds.has(s.pal), s.pal).toBe(true)
          expect(s.stickerName.length).toBeGreaterThan(1)
          break
      }
    }
  })
  it('nothing spoken has emoji or symbols in it', () => {
    for (const t of spoken) {
      expect(t, t).not.toMatch(EMOJI)
      expect(t, t).not.toMatch(/[&/]/)
    }
  })
})

describe('Pal Kitchen recipes', () => {
  it('every Pal has a favorite dish', () => {
    for (const p of PALS) expect(recipeFor(p.fruit), p.id).toBeTruthy()
  })
  it.each(RECIPES.map((r) => [r.id, r] as const))('%s has valid steps', (_, r) => {
    expect(r.steps.length).toBeGreaterThanOrEqual(2)
    for (const s of r.steps) {
      if (s.kind === 'add') expect(s.n >= 1 && s.n <= 8).toBe(true)
      if (s.kind === 'find') {
        expect(s.word).toMatch(/^[a-z]{2,4}$/) // short words she can read
        expect(new Set([s.word, ...s.others]).size).toBe(s.others.length + 1)
      }
      if (s.kind === 'pattern') expect(s.names).toHaveLength(s.items.length)
      if (s.kind === 'stir') expect(s.times >= 1 && s.times <= 5).toBe(true)
    }
  })
})

it('each grumpy creature and reward Pal belongs to one island (or the birthday party) only', () => {
  const seen = new Map<string, string>([[PARTY_FOE, 'the birthday party'], [PARTY_PAL, 'the birthday party']])
  for (const isl of ISLANDS) for (const s of isl.steps ?? []) {
    const id = s.kind === 'battle' ? s.foe : s.kind === 'reward' ? s.pal : null
    if (!id) continue
    expect(seen.get(id), `${id} is used by ${seen.get(id)} and ${isl.id}`).toBeUndefined()
    seen.set(id, isl.id)
  }
})

it('islands open in order', () => {
  expect(islandOpen(0, [])).toBe(true)
  expect(islandOpen(1, [])).toBe(false)
  expect(islandOpen(1, [ISLANDS[0].id])).toBe(true)
  expect(islandOpen(ISLANDS.length - 1, [], true)).toBe(true)
})
