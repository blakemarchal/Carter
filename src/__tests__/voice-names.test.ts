// The name library: SSA's most common children's names (2014 on), with sound-alike spellings recorded once.
import { describe, expect, it } from 'vitest'
import { LIBRARY_NAMES, LIBRARY_SOURCE, libraryName } from '../voice/names'
// @ts-expect-error (plain JavaScript, without types)
import { soundKey } from '../voice/soundKey.mjs'
// @ts-expect-error (plain JavaScript, without types)
import { buildLibrary } from '../../scripts/name-library.mjs'

describe('the name library', () => {
  it('holds the top names, from the SSA data, each once', () => {
    expect(LIBRARY_SOURCE).toMatch(/Social Security Administration.*2014/)
    expect(LIBRARY_NAMES.length).toBeGreaterThan(1000)
    expect(LIBRARY_NAMES.length).toBeLessThanOrEqual(1200)
    expect(new Set(LIBRARY_NAMES.map((n) => n.toLowerCase())).size).toBe(LIBRARY_NAMES.length)
    for (const n of ['Olivia', 'Liam', 'Noah', 'Emma', 'Ava', 'Lucas', 'Sophia']) expect(LIBRARY_NAMES).toContain(n)
  })

  it('finds a name in any case or sound-alike spelling', () => {
    expect(libraryName('olivia')).toBe('Olivia')
    expect(libraryName(' Sofia ')).toBe('Sophia')
    expect(libraryName('Aidan')).toBe('Aiden')
    expect(libraryName('Sarah')).toBe(libraryName('Sara'))
    expect(libraryName('Zxqvbn')).toBeNull()
  })

  it('merges spellings said alike, and keeps apart names said differently', () => {
    const same = [['Aiden', 'Aidan', 'Ayden'], ['Sara', 'Sarah'], ['Caden', 'Kaden'], ['Riley', 'Riley'], ['Rylee', 'Ryleigh'], ['Jordan', 'Jordyn'], ['Lily', 'Lilly']]
    for (const g of same) expect(new Set(g.map(soundKey)).size, g.join('/')).toBe(1)
    const apart = [['Maria', 'Mariah'], ['Eli', 'Ellie'], ['Mia', 'Mya'], ['Mila', 'Myla'], ['John', 'Johan'], ['Hallie', 'Haley'], ['Ali', 'Allie'], ['Anya', 'Aniyah'], ['Emma', 'Emily'], ['Leo', 'Levi']]
    for (const [a, b] of apart) expect(soundKey(a), `${a}/${b}`).not.toBe(soundKey(b))
  })

  it('is built from yob files: births added up from the first year, top names per sex, sound-alikes merged', () => {
    const files = {
      2013: 'Old,F,999999\n',
      2014: 'Ava,F,50\nSarah,F,30\nSara,F,25\nLiam,M,60\nAiden,M,10\nAidan,M,9\nZed,M,1\n',
      2015: 'Ava,F,50\nLiam,M,60\n',
    }
    const lib = buildLibrary(files, { from: 2014, top: 3 })
    expect(lib.map((g: { name: string }) => g.name)).toEqual(['Liam', 'Ava', 'Sarah', 'Aiden'])
    expect(lib.find((g: { name: string }) => g.name === 'Sarah').also).toEqual(['Sara'])
    expect(lib.find((g: { name: string }) => g.name === 'Aiden').also).toEqual(['Aidan'])
  })
})
