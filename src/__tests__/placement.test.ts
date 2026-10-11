import { describe, expect, it, vi } from 'vitest'
import { afterAnswer, hasProgress, PLACEMENT_MAX, PLACEMENT_START, placedLevel, placementDue, searchDone, startSearch } from '../learn/placement'
import type { Progress, Skill } from '../lib/progress'
import { LEVELS } from '../learn/levels'
import { NOT_SURE, PLACEMENT_PRAISE, placementEnd, placementIntro, SKILL_START } from '../screens/Placement'
import { toSpoken } from '../lib/spoken'

const SKILLS: Skill[] = ['reading', 'numbers']

/** Plays a search through for a child who can do every level up to `can` (and none above). */
function play(skill: Skill, can: number | ((level: number) => boolean)) {
  const knows = typeof can === 'number' ? (l: number) => l <= can : can
  let s = startSearch(skill)
  const asked: number[] = []
  while (!searchDone(s)) {
    asked.push(s.level)
    s = afterAnswer(s, knows(s.level))
  }
  return { level: placedLevel(s), asked }
}

describe('finding a level', () => {
  it('starts a little below the middle', () => {
    for (const s of SKILLS) expect(startSearch(s).level).toBe(PLACEMENT_START)
  })

  it.each(SKILLS)('finds every level exactly, for a child who knows everything up to it (%s)', (skill) => {
    for (let can = 0; can <= LEVELS[skill].length; can++) {
      const { level, asked } = play(skill, can)
      expect(level).toBe(Math.max(1, can))
      expect(asked.length).toBeLessThanOrEqual(PLACEMENT_MAX)
      expect(asked.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('steps up on right answers and down on misses', () => {
    expect(play('reading', 10).asked).toEqual([3, 5, 7, 9, 10])
    expect(play('reading', 6).asked).toEqual([3, 5, 7, 6])
    expect(play('reading', 0).asked).toEqual([3, 1])
    expect(play('numbers', 2).asked).toEqual([3, 1, 2])
  })

  it('only asks levels that exist, never one it has already pinned down', () => {
    // Every pattern of answers (right/miss for up to five questions).
    for (let bits = 0; bits < 2 ** PLACEMENT_MAX; bits++) {
      let s = startSearch('numbers')
      for (let i = 0; !searchDone(s); i++) {
        expect(s.level).toBeGreaterThanOrEqual(1)
        expect(s.level).toBeLessThanOrEqual(10)
        expect(s.level).toBeGreaterThan(s.lo)
        expect(s.level).toBeLessThan(s.hi)
        s = afterAnswer(s, ((bits >> i) & 1) === 1)
      }
      expect(placedLevel(s)).toBeGreaterThanOrEqual(1)
      expect(placedLevel(s)).toBeLessThanOrEqual(10)
      expect(s.asked).toBeLessThanOrEqual(PLACEMENT_MAX)
    }
  })

  it('a lucky guess up high is kept in check by a miss below it', () => {
    // Knows 1 to 3, guesses 5 right, misses 7, misses 6: starts at 5 (the adaptive levels sort out the rest).
    expect(play('reading', (l) => l <= 3 || l === 5).level).toBe(5)
  })
})

describe('who gets the placement game', () => {
  const base = { islandsDone: [], islandStep: {}, skills: { reading: 1, numbers: 1 }, battlesWon: 0, placement: 'due' } as unknown as Progress
  const p = (more: Partial<Progress>) => ({ ...base, ...more }) as Progress

  it('a brand-new player', () => {
    expect(hasProgress(base)).toBe(false)
    expect(placementDue(base)).toBe(true)
  })

  it('not a player who has already played', () => {
    expect(placementDue(p({ islandsDone: ['noah'] }))).toBe(false)
    expect(placementDue(p({ islandStep: { noah: 2 } }))).toBe(false)
    expect(placementDue(p({ islandStep: { noah: 0 } }))).toBe(true)
    expect(placementDue(p({ skills: { reading: 3, numbers: 1 } }))).toBe(false)
    expect(placementDue(p({ skills: { reading: 1, numbers: 2 } }))).toBe(false)
    expect(placementDue(p({ battlesWon: 1 }))).toBe(false)
  })

  it('not once it has been played (or skipped), nor for a save from before it', () => {
    expect(placementDue(p({ placement: 'done' }))).toBe(false)
    expect(placementDue(p({ placement: undefined }))).toBe(false)
  })

  it('on the device: offered to a new player, not to an older save', async () => {
    const store = new Map<string, string>([
      ['ark-pals:profiles', JSON.stringify({ active: 'old', list: [{ id: 'old', name: 'Old', emoji: '🌈' }, { id: 'new', name: 'New', emoji: '⭐' }] })],
      // An older save that has barely started (no islands yet): it predates the placement game.
      ['ark-pals:v1:old', JSON.stringify({ version: 1, starter: 'pip', skills: { reading: 1, numbers: 1 }, skillsVersion: 2, streak: { reading: 0, numbers: 0 } })],
    ])
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k), key: (i: number) => [...store.keys()][i] ?? null,
      get length() { return store.size },
    })
    vi.resetModules()
    try {
      const progress = await import('../lib/progress')
      expect(placementDue(progress.getProgress())).toBe(false)
      progress.switchProfile('new')
      expect(placementDue(progress.getProgress())).toBe(true)
      // Once played, it stays played (saved, and loaded again).
      progress.update((x) => ({ ...x, placement: 'done' }))
      progress.switchProfile('old')
      progress.switchProfile('new')
      expect(progress.getProgress().placement).toBe('done')
      // A parent erasing a player's progress starts them fresh, placement game and all.
      progress.resetProgress()
      expect(placementDue(progress.getProgress())).toBe(true)
    } finally {
      vi.unstubAllGlobals()
      vi.resetModules()
    }
  })
})

describe('what the placement game says', () => {
  it('follows the narration rules: no emoji or symbols, nothing lost when spoken', () => {
    const lines = [...Object.values(SKILL_START), ...PLACEMENT_PRAISE, NOT_SURE, placementIntro('Pip', 'Sam'), placementEnd('Pip', 'Sam')]
    for (const line of lines) {
      expect(line).not.toMatch(/\p{Extended_Pictographic}/u)
      expect(toSpoken(line, 'grok')).toBe(line)
    }
  })
})
