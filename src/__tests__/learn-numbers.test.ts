import { describe, expect, it } from 'vitest'
import { countTo20Q, moreFewerQ, numberLineEx, patternQ, shapesQ, tensOnesQ, within20Q, VIEWS, EXERCISES } from '../learn/topics/numbers'
import { itemById } from '../art/items'
import type { Question } from '../lib/questions'

const THEMES = [undefined, '💧', '🐟', '⭐', '🕊️']
const N = 300
const each = (make: (theme?: string) => Question, check: (q: Question, theme?: string) => void) => {
  for (let i = 0; i < N; i++) {
    const theme = THEMES[i % THEMES.length]
    check(make(theme), theme)
  }
}
const right = (q: Question) => q.choices[q.answer]
const graphemes = (s: string) => [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s)].map((g) => g.segment)

describe('numbers topic', () => {
  it('every drawn choice has its drawing, and every learn view exists', () => {
    for (const make of [shapesQ, countTo20Q, moreFewerQ, patternQ, within20Q, tensOnesQ]) each(make, (q) => {
      for (const c of q.choices) if (c.art) expect(itemById(c.art), c.art).toBeTruthy()
      if (q.visual.kind === 'learn') expect(VIEWS[q.visual.view]).toBeTruthy()
    })
  })

  it('shapes: the right choice is the shape asked for, and no other choice is also right', () => {
    each(shapesQ, (q) => {
      const shape = right(q).say
      expect(q.say).toContain(` ${shape}?`)
      expect(right(q).art).toMatch(new RegExp(`^shape-${shape}-`))
      const others = q.choices.filter((c) => c !== right(q)).map((c) => c.say)
      if (shape === 'rectangle' || shape === 'diamond') expect(others).not.toContain('square')
      if (shape === 'oval') expect(others).not.toContain('circle')
      expect(new Set(q.choices.map((c) => c.art?.split('-')[2])).size).toBe(q.choices.length) // each its own color
    })
  })

  it('counting to twenty counts the theme, 11 to 20 of them', () => {
    each(countTo20Q, (q, theme) => {
      if (q.visual.kind !== 'emoji') throw new Error('emoji visual')
      expect(q.visual.items.length).toBeGreaterThanOrEqual(11)
      expect(q.visual.items.length).toBeLessThanOrEqual(20)
      if (theme) expect(q.visual.items.every((e) => e === theme)).toBe(true)
      expect(Number(right(q).label)).toBe(q.visual.items.length)
    })
  })

  it('more or fewer: the answer is the bigger or smaller group, never equal', () => {
    each(moreFewerQ, (q, theme) => {
      expect(q.choices.length).toBe(2)
      const [r, w] = [right(q), q.choices[1 - q.answer]].map((c) => graphemes(c.label))
      if (theme) expect([...r, ...w].every((e) => e === theme)).toBe(true)
      expect(Math.abs(r.length - w.length), 'groups at least two apart').toBeGreaterThanOrEqual(2)
      if (q.say.includes('more')) expect(r.length).toBeGreaterThan(w.length)
      else expect(r.length).toBeLessThan(w.length)
    })
  })

  it('patterns: the answer continues the pattern', () => {
    each(patternQ, (q) => {
      if (q.visual.kind !== 'learn') throw new Error('learn visual')
      const cells = (q.visual.data as { cells: { say: string }[] }).cells.map((c) => c.say)
      const unit = [2, 3].find((p) => cells.every((c, i) => i < p || c === cells[i - p]))!
      expect(unit).toBeTruthy()
      expect(right(q).say).toBe(cells[cells.length - unit])
      expect(cells.length + 1).toBeLessThanOrEqual(9)
    })
  })

  it('within twenty: the sum or difference is right and stays in 0 to 20', () => {
    each(within20Q, (q) => {
      if (q.visual.kind !== 'learn') throw new Error('learn visual')
      const { a, b, op } = q.visual.data as { a: number; b: number; op: '+' | '-' }
      const ans = op === '+' ? a + b : a - b
      expect(Number(right(q).label)).toBe(ans)
      expect(ans).toBeGreaterThan(0)
      expect(op === '+' ? ans : a).toBeLessThanOrEqual(20)
    })
  })

  it('tens and ones, both ways round', () => {
    each(tensOnesQ, (q) => {
      if (q.visual.kind !== 'learn') throw new Error('learn visual')
      if (q.visual.view === 'num-tens') {
        const { tens, ones } = q.visual.data as { tens: number; ones: number }
        expect(Number(right(q).label)).toBe(tens * 10 + ones)
      } else {
        const { n } = q.visual.data as { n: number }
        expect(right(q).art).toBe(`tens-${Math.floor(n / 10)}-${n % 10}`)
      }
    })
  })

  it('number line hops stay on the line', () => {
    for (let i = 0; i < N; i++) {
      const ex = numberLineEx()!
      expect(EXERCISES[ex.kind]).toBeTruthy()
      const { start, hops, dir } = ex as unknown as { start: number; hops: number; dir: number }
      const goal = start + dir * hops
      expect(hops).toBeGreaterThanOrEqual(2)
      expect(goal).toBeGreaterThanOrEqual(0)
      expect(goal).toBeLessThanOrEqual(20)
      expect(ex.say).toContain(String(hops))
    }
  })
})
