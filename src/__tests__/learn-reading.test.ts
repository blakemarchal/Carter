import { describe, expect, it } from 'vitest'
import { itemById } from '../art/items'
import {
  FAMILIES, READ_AND_ANSWER, RHYMES, SENTENCES, TINY_STORIES,
  rhymeQ, wordFamilyQ, sentencePictureQ, readAndAnswerQ, tinyStoryQ, wordSay,
} from '../learn/topics/reading'

const words = (s: string) => s.split(' ').length

describe('reading topic content', () => {
  it('every picture it names is drawn', () => {
    const arts = [
      ...Object.values(RHYMES).flat().map(([, art]) => art),
      ...SENTENCES.flatMap((s) => [s.right, ...s.wrong]),
      ...[...READ_AND_ANSWER, ...TINY_STORIES].flatMap((r) => r.answers.flatMap((a) => ('art' in a ? [a.art] : []))),
    ]
    for (const a of arts) expect(itemById(a), a).toBeTruthy()
  })

  it('sentences are short, and each has three different pictures', () => {
    expect(SENTENCES.length).toBeGreaterThanOrEqual(10)
    for (const s of SENTENCES) {
      expect(words(s.text), s.text).toBeGreaterThanOrEqual(3)
      expect(words(s.text), s.text).toBeLessThanOrEqual(6)
      expect(new Set([s.right, ...s.wrong]).size).toBe(3)
    }
  })

  it('tiny stories are two or three short sentences', () => {
    expect(TINY_STORIES.length).toBeGreaterThanOrEqual(10)
    for (const r of TINY_STORIES) {
      expect(r.lines.length).toBeGreaterThanOrEqual(2)
      expect(r.lines.length).toBeLessThanOrEqual(3)
      for (const l of r.lines) expect(words(l), l).toBeLessThanOrEqual(7)
    }
  })

  it('every family word ends with its family', () => {
    for (const [rime, list] of Object.entries(FAMILIES)) for (const w of list) expect(w.endsWith(rime), w).toBe(true)
  })

  it('a tapped word is said without its punctuation', () => {
    expect(wordSay('bed.')).toBe('bed')
    expect(wordSay('yum!')).toBe('yum')
    expect(wordSay('A')).toBe('a, like a cat')
  })
})

describe('reading questions', () => {
  it('rhyme: exactly one choice rhymes with the word', () => {
    const famOf = (w: string) => Object.keys(RHYMES).find((f) => RHYMES[f].some(([x]) => x === w))
    for (let i = 0; i < 100; i++) {
      const q = rhymeQ()
      const target = (q.visual as { data: { word: string } }).data.word
      const rhyming = q.choices.filter((c) => famOf(c.say) === famOf(target))
      expect(rhyming.length).toBe(1)
      expect(q.choices[q.answer]).toBe(rhyming[0])
      expect(q.choices.some((c) => c.say === target)).toBe(false)
    }
  })

  it('word family: only the answer is in the family, and it is not an example', () => {
    for (let i = 0; i < 100; i++) {
      const q = wordFamilyQ()
      const { rime, examples } = (q.visual as { data: { rime: string; examples: string[] } }).data
      q.choices.forEach((c, k) => expect(FAMILIES[rime].includes(c.label), c.label).toBe(k === q.answer))
      expect(examples).not.toContain(q.choices[q.answer].label)
    }
  })

  it('sentence, read-and-answer and story questions are well-formed', () => {
    for (const make of [sentencePictureQ, readAndAnswerQ, tinyStoryQ]) {
      for (let i = 0; i < 50; i++) {
        const q = make()
        expect(q.choices.length).toBe(3)
        // all words or all pictures
        expect(new Set(q.choices.map((c) => !!c.art)).size).toBe(1)
      }
    }
  })
})
