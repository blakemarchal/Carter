// Big words (data/bigwords.ts): one for each story part of every island, found in that part's pages, well-formed;
// what the card and the round say, for the voice script.
import { describe, expect, it } from 'vitest'
import { ISLANDS, loadAllIslands } from '../data/islands'
import { BIG_WORDS, bigWordByName, bigWordLines, cardLine, meaningSay, wordPattern } from '../data/bigwords'

describe('big words', () => {
  it('has one for each story part of every island, and each is in that part’s pages', async () => {
    for (const isl of await loadAllIslands()) {
      const stories = isl.steps.filter((s) => s.kind === 'story')
      expect(BIG_WORDS[isl.id]?.length, `${isl.id}: ${stories.length} story parts`).toBe(stories.length)
      stories.forEach((s, k) => {
        const text = s.pages.map((p) => p.text).join(' ')
        expect(text, `${isl.id} part ${k + 1}: "${BIG_WORDS[isl.id][k].word}" is not in the pages`).toMatch(wordPattern(BIG_WORDS[isl.id][k]))
      })
    }
    const ids = new Set(ISLANDS.map((i) => i.id))
    for (const id of Object.keys(BIG_WORDS)) expect(ids.has(id), id).toBe(true)
  })

  it('each word is its own, with a meaning, three answers (one right) and a picture each', () => {
    const seen = new Set<string>()
    for (const [id, words] of Object.entries(BIG_WORDS)) {
      for (const b of words) {
        expect(seen.has(b.word), `${b.word} twice`).toBe(false)
        seen.add(b.word)
        expect(b.means, b.word).toMatch(/[.!]$/)
        expect(b.means.toLowerCase(), `${id}: the meaning of ${b.word} should name it`).toContain(b.word.toLowerCase().slice(0, 4))
        expect(b.choices, b.word).toHaveLength(3)
        expect(b.answer, b.word).toBeGreaterThanOrEqual(0)
        expect(b.answer, b.word).toBeLessThan(3)
        expect(new Set(b.choices.map((c) => c.say)).size, b.word).toBe(3)
        expect(new Set(b.choices.map((c) => c.emoji)).size, b.word).toBe(3)
        expect(b.choices[b.answer].emoji, `${b.word}: the right answer's picture is the word's`).toBe(b.emoji)
        for (const s of [b.means, ...b.choices.map((c) => c.say)]) expect(s).not.toMatch(/[{}]/)
      }
    }
    const answers = Object.values(BIG_WORDS).flat().map((b) => b.answer)
    for (const k of [0, 1, 2]) expect(answers.filter((a) => a === k).length).toBeGreaterThan(10)
    expect(bigWordByName('jealous')?.emoji).toBe('😠')
    expect(bigWordByName('zebra')).toBeUndefined()
  })

  it('says the card, the question with its answers in order, and lists every line', () => {
    const jealous = bigWordByName('jealous')!
    expect(cardLine(jealous)).toBe('Big word! Jealous. Jealous means wanting what someone else has. Listen for it in the story!')
    expect(meaningSay(jealous)).toBe('What does jealous mean? Wanting what someone else has, feeling very sleepy, or having a party?')
    expect(cardLine(bigWordByName('Savior')!)).toMatch(/^Big word! Savior\./)
    expect('Jonah forgave them, and God forgives'.match(wordPattern(bigWordByName('forgive')!))).toEqual(['forgave', 'forgives'])
    const lines = bigWordLines()
    expect(new Set(lines).size).toBe(lines.length)
    expect(lines).toContain(cardLine(jealous))
    expect(lines).toContain('wanting what someone else has!')
    for (const l of lines) expect(l.trim()).toBe(l)
  })
})
