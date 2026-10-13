// A name the narrator can't say: the line is said without it, in the narrator's voice, instead of the device's
// own voice reading all of it (voice/nameless.ts, the twins in voice/templates.ts, lib/speech.ts).
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { lineId, loadRecordings } from '../lib/recordings'
import { keys } from '../voice/keys'
import { setHouse, type HouseManifest } from '../voice/house'
import { withoutNames } from '../voice/nameless'
import { grokOnly, matchTemplate, stitch } from '../voice/stitch'
import { TEMPLATES, recordedParts } from '../voice/templates'

const N = ['Dad', 'Ella', 'Rex']

describe('a line without the family’s names', () => {
  it('drops a name said to someone, with its comma or title', () => {
    expect(withoutNames('Way to go, Ella!', N)).toBe('Way to go!')
    expect(withoutNames('Thank you, chef Ella!', N)).toBe('Thank you!')
    expect(withoutNames('Happy birthday, dear Ella!', N)).toBe('Happy birthday!')
    expect(withoutNames('Hello, baby Rex!', N)).toBe('Hello!')
    expect(withoutNames('Zippy wants to go on a treasure hunt with you, Ella!', N)).toBe('Zippy wants to go on a treasure hunt with you!')
  })

  it('keeps a greeting, and the rest of the line', () => {
    expect(withoutNames('Hi Dad! Welcome to the Ark! Choose your very first Ark Pal. Tap one to meet them!', N))
      .toBe('Hi! Welcome to the Ark! Choose your very first Ark Pal. Tap one to meet them!')
    expect(withoutNames('Goodnight, Ella. Sleep tight!', N)).toBe('Goodnight. Sleep tight!')
    expect(withoutNames('Hooray, Ella!', N)).toBe('Hooray!')
  })

  it('says "you" for a name that’s the object of a verb', () => {
    expect(withoutNames('Thank you, God, for making Ella!', N)).toBe('Thank you, God, for making you!')
    expect(withoutNames("Let's sing Happy Birthday to Ella! Everybody sing!", N)).toBe("Let's sing Happy Birthday to you! Everybody sing!")
  })

  it('leaves out a sentence about the name, and gives "" when nothing is left', () => {
    expect(withoutNames('Ella has the baby!', N)).toBe('')
    expect(withoutNames('Ella!', N)).toBe('')
    expect(withoutNames("Surprise! It's Ella's birthday today!", N)).toBe('Surprise!')
  })

  it('only whole names: not inside another word, and not a Pal’s name', () => {
    expect(withoutNames('Ellabelle is here!', N)).toBe('Ellabelle is here!')
    expect(withoutNames('Zippy loves pancakes!', N)).toBe('Zippy loves pancakes!')
  })
})

describe('each line with a name has a twin without it', () => {
  it('made for every template with {name} that has something left, recorded by Grok only', () => {
    const named = TEMPLATES.filter((t) => t.text.includes('{name}') && !t.nameless)
    const twins = TEMPLATES.filter((t) => t.nameless)
    expect(twins.length).toBeGreaterThan(10)
    for (const t of twins) {
      expect(t.text).not.toContain('{name}')
      expect(grokOnly(t)).toBe(true)
      expect(named.some((n) => t.id === `${n.id}~noname`)).toBe(true)
    }
    expect(TEMPLATES.find((t) => t.id === 'hi-name~noname')?.text).toBe('Hi!')
    expect(TEMPLATES.find((t) => t.id === 'treasure-intro~noname')?.text).toBe('{pal} wants to go on a treasure hunt with you!')
    expect(TEMPLATES.some((t) => t.id === 'has-baby~noname')).toBe(false)
  })

  it('the twin is what a line without the name matches', () => {
    expect(matchTemplate('Way to go!')?.tpl.id).toBe('way-to-go~noname')
    expect(matchTemplate('Zippy wants to go on a treasure hunt with you!')?.tpl.id).toBe('treasure-intro~noname')
  })
})

describe('stitched in Grok', () => {
  async function house(clips: Record<string, string[]>): Promise<HouseManifest> {
    const m: HouseManifest = { version: 1, voices: {}, clips: {} }
    for (const [voice, ks] of Object.entries(clips)) {
      m.clips[voice] = {}
      for (const k of ks) m.clips[voice][await lineId(k)] = [k.length.toString(36), 0, 0, 1]
    }
    return m
  }
  const partsOf = (id: string) => recordedParts(TEMPLATES.find((t) => t.id === id)!).map(([i]) => keys.part(id, i))

  beforeEach(async () => {
    vi.stubGlobal('fetch', vi.fn(async (u: string) => new Response(u === '/recordings' ? '[]' : new Uint8Array([1]))))
    setHouse(null)
    await loadRecordings()
  })

  it('choosing the first Pal, for a player whose name isn’t in the library', async () => {
    const rest = ['Welcome to the Ark!', 'Choose your very first Ark Pal.', 'Tap one to meet them!']
    setHouse(await house({ grok: [...partsOf('hi-name'), ...partsOf('hi-name~noname'), ...rest] }))
    const line = 'Hi Dad! Welcome to the Ark! Choose your very first Ark Pal. Tap one to meet them!'
    // (with the name: not stitched, "Dad" isn't recorded)
    expect(await stitch(line)).toBeNull()
    // (without it: all Grok)
    expect(await stitch(withoutNames(line, ['Dad']))).toHaveLength(4)
  })

  it('the word builder: a sound on its own, and a word put together from its sounds', async () => {
    setHouse(await house({ grok: [keys.sound('p'), keys.sound('a'), keys.sound('n'), keys.item('pan')] }))
    expect(await stitch('⟦p⟧')).toHaveLength(1)
    expect(await stitch('⟦p⟧, ⟦a⟧, ⟦n⟧: pan!')).toHaveLength(4)
  })
})
