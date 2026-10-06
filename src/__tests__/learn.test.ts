import { describe, expect, it } from 'vitest'
import { LEVELS, SKILLS_MIGRATION, levelFor } from '../learn/levels'
import { EXERCISES, VIEWS } from '../learn/registry'
import { makeTask } from '../learn/tasks'
import { MAX_LEVEL, upgradeSkills, type Progress, type Skill } from '../lib/progress'
import { makeQuestion } from '../lib/questions'

const SKILLS: Skill[] = ['reading', 'numbers']
const EMOJI = /\p{Extended_Pictographic}/u
const THEMES = [undefined, '💧', '🐟', '⭐']

describe('learning backbone levels', () => {
  it('has a level for every step of the adaptive scale', () => {
    for (const s of SKILLS) expect(LEVELS[s].length, s).toBe(MAX_LEVEL[s])
  })

  it('every level labels itself for the Parent Corner', () => {
    for (const s of SKILLS) for (const l of LEVELS[s]) expect(l.label.length).toBeGreaterThan(3)
  })

  for (const s of SKILLS) {
    for (let level = 1; level <= MAX_LEVEL[s]; level++) {
      it(`${s} level ${level} asks well-formed questions`, () => {
        for (let i = 0; i < 60; i++) {
          const q = levelFor(s, level).question(THEMES[i % THEMES.length])
          expect(q.skill).toBe(s)
          expect(q.say.trim().length).toBeGreaterThan(0)
          expect(EMOJI.test(q.say), `emoji spoken: ${q.say}`).toBe(false)
          expect(q.choices.length).toBeGreaterThanOrEqual(2)
          expect(q.answer).toBeGreaterThanOrEqual(0)
          expect(q.answer).toBeLessThan(q.choices.length)
          const labels = q.choices.map((c) => `${c.label}|${c.art ?? ''}`)
          expect(new Set(labels).size, `repeated choice in: ${q.say}`).toBe(labels.length)
          for (const c of q.choices) expect(EMOJI.test(c.say), `emoji spoken: ${c.say}`).toBe(false)
          if (q.visual.kind === 'learn') expect(VIEWS[q.visual.view], `no view "${q.visual.view}"`).toBeTruthy()
        }
      })

      it(`${s} level ${level} exercises are playable`, () => {
        for (let i = 0; i < 40; i++) {
          const ex = levelFor(s, level).exercise?.(THEMES[i % THEMES.length])
          if (!ex) continue
          expect(ex.skill).toBe(s)
          expect(EXERCISES[ex.kind], `no player for "${ex.kind}"`).toBeTruthy()
          expect(ex.say.trim().length).toBeGreaterThan(0)
          expect(EMOJI.test(ex.say), `emoji spoken: ${ex.say}`).toBe(false)
          expect(typeof ex.key).toBe('string')
        }
      })
    }
  }

  it('battles still get questions at every level', () => {
    for (const s of SKILLS) for (let level = 1; level <= MAX_LEVEL[s]; level++) expect(makeQuestion(s, level).choices.length).toBeGreaterThan(1)
  })

  it('a practice round never has two exercises in a row', () => {
    for (const s of SKILLS) for (let level = 1; level <= MAX_LEVEL[s]; level++) {
      const asked = []
      for (let i = 0; i < 12; i++) {
        const t = makeTask(s, level, undefined, asked)
        if (t.type === 'exercise') expect(asked[asked.length - 1]?.type).not.toBe('exercise')
        asked.push(t)
      }
    }
  })
})

describe('saved levels from before the backbone', () => {
  const old = (reading: number, numbers: number) => ({ skills: { reading, numbers } }) as unknown as Progress

  it('move to the level that holds the same questions now', () => {
    expect(upgradeSkills(old(1, 1)).skills).toEqual({ reading: 1, numbers: 1 })
    expect(upgradeSkills(old(3, 4)).skills).toEqual({ reading: 4, numbers: 4 })
    expect(upgradeSkills(old(5, 5)).skills).toEqual({ reading: 6, numbers: 5 })
  })

  it('upgrade once only', () => {
    const p = upgradeSkills(old(3, 2))
    expect(p.skillsVersion).toBe(2)
    expect(upgradeSkills(p).skills).toEqual(p.skills)
  })

  it('every old level has somewhere to go', () => {
    for (const s of SKILLS) for (let l = 1; l <= 5; l++) expect(SKILLS_MIGRATION[s][l]).toBeGreaterThan(0)
  })
})
