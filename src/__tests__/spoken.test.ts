import { describe, expect, it } from 'vitest'
import { letterSound, numberWords, toSpoken } from '../lib/spoken'

describe('numberWords', () => {
  it.each([[0, 'zero'], [7, 'seven'], [10, 'ten'], [12, 'twelve'], [20, 'twenty'], [47, 'forty-seven'], [100, 'one hundred'], [130, 'one hundred thirty'], [2027, 'two thousand twenty-seven']])('%i -> %s', (n, w) => {
    expect(numberWords(n)).toBe(w)
  })
})

describe('toSpoken', () => {
  it('turns digits into words, so "4!" is not read as a factorial', () => {
    expect(toSpoken('4! Great job!', 'grok')).toBe('four! Great job!')
    expect(toSpoken('67, 68, 69. What comes next?', 'device')).toBe('sixty-seven, sixty-eight, sixty-nine. What comes next?')
  })
  it('reads Bible references as numbers', () => {
    expect(toSpoken('Genesis 9:13.', 'grok')).toBe('Genesis nine, thirteen.')
  })
  it('drops emoji (including skin tones and joiners) and spells out &', () => {
    expect(toSpoken('You got a 🌈 sticker! 👍🏽', 'grok')).toBe('You got a sticker!')
    expect(toSpoken('David & Goliath', 'grok')).toBe('David and Goliath')
  })
  it('says the dress-up bow like "go", not "bow down"', () => {
    expect(toSpoken('Pip looks great in the bow!', 'grok')).toBe('Pip looks great in the /boʊ/!')
    expect(toSpoken('Pip looks great in the bow!', 'device')).toBe('Pip looks great in the beau!')
    expect(toSpoken('The wise men bow down.', 'grok')).toBe('The wise men bow down.')
    expect(toSpoken('A rainbow and an elbow', 'grok')).toBe('A rainbow and an elbow')
  })
  it('uses IPA for the Grok voice and a spelling for the device voice', () => {
    expect(toSpoken(`the ${letterSound('n')} sound`, 'grok')).toBe('the /nː/ sound')
    expect(toSpoken(`the ${letterSound('n')} sound`, 'device')).toBe('the nnn sound')
  })
})
