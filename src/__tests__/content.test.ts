// Checks every island and Pal, so a typo in new content can't ship.
import { describe, expect, it } from 'vitest'
import { ISLANDS, loadAllIslands, type Step, type Thing } from '../data/islands'
import { STORY_ART } from '../art/scenes'
import { SONG_IDS } from '../data/songs'
import { SEAS } from '../data/seas'
import { PARTY_FOE, PARTY_PAL } from '../data/birthday'
import { PALS } from '../data/pals'
import { RECIPES, recipeFor } from '../data/recipes'

const EMOJI = /\p{Extended_Pictographic}/u
// Every island's content (it loads on demand in the game).
const LOADED = await loadAllIslands()
const artOf = (id: string) => LOADED.find((i) => i.id === id)?.art ?? STORY_ART[id]
const palIds = new Set(PALS.map((p) => p.id))
const FX = ['spark', 'flame', 'rock', 'leaf', 'hearts', 'stars', 'wind', 'roll', 'bubbles']

/** Every picture a step shows, as { emoji, say, art }. */
function things(s: Step): Thing[] {
  switch (s.kind) {
    case 'sequence': return s.items
    case 'sort': return [...s.groups, ...s.items]
    case 'quiz': return s.questions.flatMap((q) => q.choices)
    case 'count': return [s.item]
    case 'maze': return [s.hero, s.goal]
    case 'share': return [s.kit.item]
    default: return []
  }
}

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

describe.each(LOADED.map((i) => [i.id, i] as const))('island %s', (_, isl) => {
  const steps = isl.steps
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
          if (s.hint) spoken.push(s.hint)
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
          if (s.done) spoken.push(s.done)
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
        case 'pause':
          spoken.push(s.line)
          break
        case 'build': {
          const ids = s.kit.parts.map((p) => p.id)
          expect(new Set(ids).size, 'part ids').toBe(ids.length)
          // (a part can only wait for parts listed before it, so the build can always be finished)
          for (const p of s.kit.parts) for (const a of p.after ?? []) expect(ids.slice(0, ids.indexOf(p.id)), `${p.id} after ${a}`).toContain(a)
          spoken.push(s.intro, s.done, ...s.kit.parts.map((p) => p.say))
          break
        }
        case 'spot':
          expect(s.kit.targets.length).toBeGreaterThanOrEqual(3)
          for (const t of s.kit.targets) {
            expect(t.r, t.id).toBeGreaterThanOrEqual(40)
            if (t.say) spoken.push(t.say)
          }
          spoken.push(s.intro, s.done, s.plural)
          break
        case 'paint': {
          const nums = new Set(s.kit.palette.map((c) => c.n))
          expect(nums.size, 'paint numbers').toBe(s.kit.palette.length)
          for (const r of s.kit.regions) expect(nums.has(r.n), r.id).toBe(true)
          spoken.push(s.intro, s.done, ...s.kit.palette.map((c) => c.name))
          break
        }
        case 'steer':
          expect(s.kit.path.length).toBeGreaterThanOrEqual(2)
          for (const [x, y] of s.kit.path) expect(x >= 0 && x <= 800 && y >= 0 && y <= 450, `${x}, ${y}`).toBe(true)
          spoken.push(s.intro, s.done)
          break
        case 'rhythm': {
          const beats = s.kit.notes.map(([b]) => b)
          expect(beats).toEqual([...beats].sort((a, b) => a - b))
          expect(s.kit.notes.length).toBeGreaterThanOrEqual(8)
          expect(s.kit.bpm >= 50 && s.kit.bpm <= 140).toBe(true)
          spoken.push(s.intro, s.done)
          break
        }
        case 'share':
          for (const r of s.kit.rounds) {
            expect(r.items % r.people, `${r.items} for ${r.people} comes out even`).toBe(0)
            expect(r.people).toBeLessThanOrEqual(s.kit.people.length)
          }
          spoken.push(s.intro, s.done, s.kit.item.say, s.kit.plural, ...s.kit.people.map((p) => p.say))
          break
        case 'catch':
          expect(s.kit.goal >= 3 && s.kit.goal <= 30, 'goal').toBe(true)
          expect(s.kit.width, 'catcher width').toBeGreaterThanOrEqual(60)
          expect(s.kit.lane.from >= 0 && s.kit.lane.to <= 800 && s.kit.lane.from < s.kit.lane.to, 'lane').toBe(true)
          expect(s.kit.falling.length).toBeGreaterThanOrEqual(1)
          spoken.push(s.intro, s.done, s.plural)
          break
        case 'song':
          expect(SONG_IDS, s.song).toContain(s.song)
          spoken.push(s.intro)
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
  it('its story parts follow on from each other, and every page has its picture', () => {
    let next = 0
    for (const s of steps) {
      if (s.kind !== 'story') continue
      expect(s.first ?? 0, s.title).toBe(next)
      expect(s.title, 'a title is read before page one, so no "!"').not.toMatch(/!/)
      next += s.pages.length
    }
    expect(isl.art.length, 'one picture per page').toBe(next)
  })
  it('story cards show pages that exist', () => {
    for (const s of steps) for (const t of things(s)) {
      if (!t.art?.startsWith('story:')) continue
      const [, island, page] = t.art.split(':')
      expect(artOf(island)?.[Number(page) - 1], t.art).toBeTruthy()
    }
  })
  it('has at most three visits, none of them empty', () => {
    const pauses = steps.flatMap((s, i) => (s.kind === 'pause' ? [i] : []))
    expect(pauses.length).toBeLessThanOrEqual(2)
    for (const i of pauses) {
      expect(steps[i - 1].kind, 'two pauses in a row').not.toBe('pause')
      expect(steps[i + 1].kind, 'a pause right before the reward').not.toBe('reward')
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
  for (const isl of LOADED) for (const s of isl.steps) {
    const id = s.kind === 'battle' ? s.foe : s.kind === 'reward' ? s.pal : null
    if (!id) continue
    expect(seen.get(id), `${id} is used by ${seen.get(id)} and ${isl.id}`).toBeUndefined()
    seen.set(id, isl.id)
  }
})

it('every built island has its place on the voyage', () => {
  const placed = new Set(SEAS.flatMap((s) => s.islands.map((i) => i.id)))
  for (const isl of ISLANDS) expect(placed.has(isl.id), isl.id).toBe(true)
})

it("Easter Morning's first visit never ends the day: it ends at the cross", () => {
  const steps = LOADED.find((i) => i.id === 'easter')!.steps
  const first = steps.find((s) => s.kind === 'pause')
  expect(first?.kind === 'pause' && first.free).toBe(true)
})
