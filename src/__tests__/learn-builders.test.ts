import { describe, expect, it } from 'vitest'
import { FAMILIES, SCENE_NAMES, SENTENCES, SPELL_WORDS, blend, sentenceBuildEx, wordBuildEx, type SentenceBuildEx, type WordBuildEx } from '../learn/topics/builders'
import { itemById } from '../art/items'

const EMOJI = /\p{Extended_Pictographic}/u

describe('word builder', () => {
  it('every word is three letters with a drawn picture', () => {
    expect(SPELL_WORDS.length).toBeGreaterThan(15)
    for (const w of SPELL_WORDS) {
      expect(w.word).toMatch(/^[a-z]{3}$/)
      expect(itemById(w.art), w.word).toBeTruthy()
    }
  })

  it('every family word can be spelled and shares its ending', () => {
    for (const f of FAMILIES) {
      expect(f.length).toBeGreaterThan(1)
      for (const w of f) {
        expect(SPELL_WORDS.some((s) => s.word === w), w).toBe(true)
        expect(w.slice(1)).toBe(f[0].slice(1))
      }
    }
  })

  for (const [level, n] of [[3, 4], [4, 5]] as const) {
    it(`level ${level}: the word's letters plus ${n - 3} spare(s), never another of its letters`, () => {
      for (let i = 0; i < 200; i++) {
        const ex = wordBuildEx(level) as WordBuildEx
        expect(ex.kind).toBe('wordbuild')
        expect(ex.say).toBe(`Spell ${ex.word}!`)
        expect(ex.tiles.length).toBe(n)
        const left = [...ex.tiles]
        for (const l of ex.word) left.splice(left.indexOf(l), 1)
        expect(left.length).toBe(n - 3)
        for (const l of left) expect(ex.word.includes(l)).toBe(false)
      }
    })
  }

  it('level 6: a word family, with the new first letter among a few', () => {
    for (let i = 0; i < 200; i++) {
      const ex = wordBuildEx(6) as WordBuildEx
      expect(ex.from).toBeTruthy()
      expect(ex.from).not.toBe(ex.word)
      expect(ex.from!.slice(1)).toBe(ex.word.slice(1))
      expect(ex.tiles.length).toBe(3)
      expect(new Set(ex.tiles).size).toBe(3)
      expect(ex.tiles).toContain(ex.word[0])
      for (const t of ex.tiles.filter((t) => t !== ex.word[0])) expect(ex.from! + ex.word).not.toContain(t)
      expect(EMOJI.test(ex.say)).toBe(false)
    }
  })

  it('blends the sounds, then says the word', () => {
    expect(blend('fox')).toBe('⟦f⟧, ⟦o⟧, ⟦x⟧: fox!')
  })
})

describe('sentence builder', () => {
  it('has ten to twenty sentences of three to five tiles, each with its scene', () => {
    expect(SENTENCES.length).toBeGreaterThanOrEqual(10)
    expect(SENTENCES.length).toBeLessThanOrEqual(20)
    for (const s of SENTENCES) {
      expect(s.tiles.length).toBeGreaterThanOrEqual(3)
      expect(s.tiles.length).toBeLessThanOrEqual(5)
      expect(s.tiles[0][0]).toMatch(/[A-Z]/)
      expect(s.tiles[s.tiles.length - 1].endsWith('.')).toBe(true)
      for (const t of s.tiles.slice(1)) expect(t === 'I' || t === 'God' || /^[a-z]/.test(t), t).toBe(true)
      expect(SCENE_NAMES).toContain(s.scene)
    }
    expect(new Set(SENTENCES.map((s) => s.tiles.join(' '))).size).toBe(SENTENCES.length)
  })

  it('makes exercises from the list', () => {
    for (let i = 0; i < 50; i++) {
      const ex = sentenceBuildEx() as SentenceBuildEx
      expect(ex.kind).toBe('sentencebuild')
      expect(SENTENCES.some((s) => s.tiles === ex.tiles)).toBe(true)
    }
  })
})
