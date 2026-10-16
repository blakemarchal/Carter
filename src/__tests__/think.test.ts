// "Think about it" (data/think.ts): one question for each story part of every island, well-formed, with a reason
// after the answer; what the narrator says, for the voice script.
import { describe, expect, it } from 'vitest'
import { ISLANDS, loadAllIslands } from '../data/islands'
import { INTRO, THINK, thinkLines, thinkSay } from '../data/think'

describe('think about it', () => {
  it('has one question for each story part of every island, and none for an island that does not exist', async () => {
    const all = await loadAllIslands()
    for (const isl of all) {
      const stories = isl.steps.filter((s) => s.kind === 'story').length
      expect(THINK[isl.id]?.length, `${isl.id}: ${stories} story parts`).toBe(stories)
    }
    const ids = new Set(ISLANDS.map((i) => i.id))
    for (const id of Object.keys(THINK)) expect(ids.has(id), id).toBe(true)
  })

  it('each question asks, offers three answers (one right), and says why', () => {
    for (const [id, qs] of Object.entries(THINK)) {
      for (const q of qs) {
        expect(q.ask, id).toMatch(/\?$/)
        expect(q.choices, id).toHaveLength(3)
        expect(q.answer, id).toBeGreaterThanOrEqual(0)
        expect(q.answer, id).toBeLessThan(3)
        expect(new Set(q.choices.map((c) => c.say)).size, id).toBe(3)
        expect(new Set(q.choices.map((c) => c.emoji)).size, id).toBe(3)
        expect(q.why, id).toMatch(/[.!]$/)
        expect(q.why.length, id).toBeGreaterThan(30)
        for (const s of [q.ask, q.why, ...q.choices.map((c) => c.say)]) expect(s, id).not.toMatch(/[{}]/)
      }
    }
    // (the right answer moves around)
    const answers = Object.values(THINK).flat().map((q) => q.answer)
    for (const k of [0, 1, 2]) expect(answers.filter((a) => a === k).length).toBeGreaterThan(10)
  })

  it('asks the question and then the three answers, in their written order, and lists every line it says', () => {
    const q = THINK.noah[0]
    expect(thinkSay(q)).toBe(`${INTRO} Why did Noah build the big boat? Because God told him to, to go fishing, or to win a race?`)
    expect(thinkSay(THINK.david[0])).toContain('He was the tallest, God looks at the heart, or he had a crown?')
    const lines = thinkLines()
    expect(new Set(lines).size).toBe(lines.length)
    expect(lines).toContain(thinkSay(q))
    expect(lines).toContain('Because God told him to!')
    expect(lines).toContain(q.why)
    for (const l of lines) expect(l.trim()).toBe(l)
  })
})
