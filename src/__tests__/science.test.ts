// Science moments (data/science.ts): one for every island, well-formed, a fact per reading level; what the card and
// the round say, for the voice script.
import { describe, expect, it } from 'vitest'
import { ISLANDS } from '../data/islands'
import { DID_YOU_KNOW, SCIENCE, factFor, scienceAsk, scienceLines, scienceSay } from '../data/science'

describe('science moments', () => {
  it('has one for every island, and none for an island that does not exist', () => {
    for (const i of ISLANDS) expect(SCIENCE[i.id], i.id).toBeTruthy()
    const ids = new Set(ISLANDS.map((i) => i.id))
    for (const id of Object.keys(SCIENCE)) expect(ids.has(id), id).toBe(true)
  })

  it('each has three facts that grow with the reader, a thing to try, and a question with three answers (one right)', () => {
    const titles = new Set<string>()
    for (const [id, sc] of Object.entries(SCIENCE)) {
      expect(titles.has(sc.title), `${sc.title} twice`).toBe(false)
      titles.add(sc.title)
      expect(sc.facts).toHaveLength(3)
      for (const f of sc.facts) {
        expect(f, id).toMatch(/[.!]$/)
        expect(f.length, id).toBeGreaterThan(30)
      }
      expect(sc.facts[2].length, `${id}: the facts should grow`).toBeGreaterThan(sc.facts[0].length)
      expect(sc.tryIt, id).toMatch(/[.!?]$/)
      expect(sc.ask, id).toMatch(/\?$/)
      expect(sc.choices, id).toHaveLength(3)
      expect(sc.answer, id).toBeGreaterThanOrEqual(0)
      expect(sc.answer, id).toBeLessThan(3)
      expect(new Set(sc.choices.map((c) => c.say)).size, id).toBe(3)
      expect(new Set(sc.choices.map((c) => c.emoji)).size, id).toBe(3)
      for (const t of [...sc.facts, sc.tryIt, sc.ask, ...sc.choices.map((c) => c.say)]) expect(t).not.toMatch(/[{}]/)
    }
    const answers = Object.values(SCIENCE).map((sc) => sc.answer)
    for (const k of [0, 1, 2]) expect(answers.filter((a) => a === k).length).toBeGreaterThan(5)
  })

  it('picks the fact by reading level, says the card and the question, and lists every line', () => {
    const noah = SCIENCE.noah
    expect(factFor(noah, 1)).toBe(noah.facts[0])
    expect(factFor(noah, 3)).toBe(noah.facts[0])
    expect(factFor(noah, 4)).toBe(noah.facts[1])
    expect(factFor(noah, 7)).toBe(noah.facts[2])
    expect(scienceSay(noah, 1)).toBe(`${DID_YOU_KNOW} ${noah.facts[0]} Try it at home: ${noah.tryIt}`)
    expect(scienceAsk(noah)).toBe('What makes a rainbow? Paint in the clouds, sunlight shining through raindrops, or birds carrying colors?')
    const lines = scienceLines()
    expect(new Set(lines).size).toBe(lines.length)
    expect(lines).toContain(scienceSay(noah, 7))
    expect(lines).toContain('sunlight shining through raindrops!')
    for (const l of lines) expect(l.trim()).toBe(l)
  })
})
