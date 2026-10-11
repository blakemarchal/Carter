import { describe, expect, it } from 'vitest'
import { makeQuestion } from '../lib/questions'
import { MAX_LEVEL, type Skill } from '../lib/progress'

const SAMPLES = 400

describe.each(['reading', 'numbers'] as Skill[])('%s questions', (skill) => {
  for (let level = 1; level <= MAX_LEVEL[skill]; level++) {
    it(`level ${level}: valid answer, distinct choices, no negatives`, () => {
      for (let i = 0; i < SAMPLES; i++) {
        const q = makeQuestion(skill, level, skill === 'numbers' ? '💧' : undefined)
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThan(q.choices.length)
        expect(q.choices.length).toBeGreaterThanOrEqual(2)
        expect(new Set(q.choices.map((c) => c.label)).size).toBe(q.choices.length)
        if (skill === 'numbers') {
          // (Number answers are never zero or negative; pictures and words like "three o'clock" aren't numbers.)
          for (const c of q.choices) if (/^\d+$/.test(c.label)) expect(Number(c.label)).toBeGreaterThan(0)
          const right = Number(q.choices[q.answer].label)
          if (q.visual.kind === 'sum') expect(right).toBe(q.visual.op === '+' ? q.visual.a + q.visual.b : q.visual.a - q.visual.b)
          if (q.visual.kind === 'sequence') expect(right).toBe((q.visual.nums[2] as number) + 1)
          if (q.visual.kind === 'emoji') {
            expect(right).toBe(q.visual.items.length)
            expect(q.visual.items.every((e) => e === '💧')).toBe(true) // the theme is what gets counted
          }
        }
      }
    })
  }
})

it('avoids repeating a question that was just asked', () => {
  for (let i = 0; i < 100; i++) {
    const first = makeQuestion('reading', 1)
    const next = makeQuestion('reading', 1, undefined, [first])
    expect(`${next.say}|${JSON.stringify(next.visual)}`).not.toBe(`${first.say}|${JSON.stringify(first.visual)}`)
  }
})
