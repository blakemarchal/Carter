// Templates and stitching: a line put together from recorded parts and slots (names, Pals, numbers, letters,
// sounds), all in one house voice, or not at all.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { lineId, loadRecordings } from '../lib/recordings'
import { keys } from '../voice/keys'
import { setHouse, type HouseManifest } from '../voice/house'
import { matchTemplate, parseNumber, sentences, stitch, PAL_NAMES } from '../voice/stitch'
import { TEMPLATES, recordedParts } from '../voice/templates'
import { LEVELS } from '../learn/levels'
import { SHADE_SAY } from '../data/shade'
import { placementIntro } from '../screens/Placement'

/** A house set where `voice` has recorded these keys. */
async function house(clips: Record<string, string[]>): Promise<HouseManifest> {
  const m: HouseManifest = { version: 1, voices: {}, clips: {} }
  for (const [voice, ks] of Object.entries(clips)) {
    m.clips[voice] = {}
    for (const k of ks) m.clips[voice][await lineId(k)] = [k.length.toString(36), 0, 0, 1]
  }
  return m
}
const partsOf = (id: string) => recordedParts(TEMPLATES.find((t) => t.id === id)!).map(([i]) => keys.part(id, i))
let familyIds: string[] = []
const fetched: string[] = []

beforeEach(async () => {
  familyIds = []
  fetched.length = 0
  vi.stubGlobal('fetch', vi.fn(async (u: string) => {
    fetched.push(String(u))
    if (u === '/recordings') return new Response(JSON.stringify(familyIds))
    return new Response(new Uint8Array([1]))
  }))
  setHouse(null)
  await loadRecordings()
})

describe('templates', () => {
  it('each has its own id, and only the slots there are', () => {
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(TEMPLATES.length)
    for (const t of TEMPLATES) expect(t.text.replace(/\{(name|pal|n|letter|sound)\}/g, '')).not.toMatch(/[{}]/)
    expect(recordedParts(TEMPLATES.find((t) => t.id === 'way-to-go')!)).toEqual([[0, 'Way to go,']])
    expect(recordedParts(TEMPLATES.find((t) => t.id === 'seq')!)).toEqual([]) // ("3, 4, 5." is just numbers)
    expect(recordedParts(TEMPLATES.find((t) => t.id === 'starts-with')!)).toEqual([[0, 'Which picture starts with the'], [1, 'sound, like the letter']])
  })

  it('a sentence finds its template and what fills each slot, with the right take', () => {
    expect(matchTemplate('Way to go, Olivia!')).toMatchObject({ tpl: { id: 'way-to-go' }, values: [{ kind: 'name', value: 'Olivia', take: 'exclaim' }] })
    expect(matchTemplate('Thank you, chef Mary Kate!')?.values[0].value).toBe('Mary Kate')
    expect(matchTemplate('47!')).toMatchObject({ tpl: { id: 'n-bang' }, values: [{ value: '47', take: 'exclaim' }] })
    expect(matchTemplate('Seven candles!')).toMatchObject({ tpl: { id: 'candles-bang' }, values: [{ value: 'Seven' }] })
    expect(matchTemplate('Put three candles on the cake!')?.values[0].value).toBe('three')
    expect(matchTemplate('3, 4, 5.')?.values.map((v) => v.value)).toEqual(['3', '4', '5'])
    expect(matchTemplate('Which picture starts with the ⟦b⟧ sound, like the letter B?')?.values.map((v) => v.value)).toEqual(['b', 'B'])
    expect(matchTemplate("It's Zippy!")).toMatchObject({ tpl: { id: 'its-pal' }, values: [{ kind: 'pal', value: 'Zippy' }] }) // (a straight apostrophe too)
    expect(matchTemplate('Zippy became Sparkle!')?.values.map((v) => v.value)).toEqual(['Zippy', 'Sparkle'])
    expect(matchTemplate('Hop forward 5 times!')?.values[0]).toMatchObject({ value: '5', take: 'mid' })
    expect(matchTemplate('200!')).toBeNull() // (numbers are recorded up to 140)
    expect(matchTemplate('Nobody wrote this one.')).toBeNull()
    expect(parseNumber('forty-seven')).toBe(47)
    expect(parseNumber('one hundred forty')).toBe(140)
    expect(parseNumber('141')).toBeNull()
    expect(PAL_NAMES).toEqual(expect.arrayContaining(['Zippy', 'Ember', 'Grumbleshade']))
  })

  it('lines are split into sentences', () => {
    expect(sentences('Great job!  3 plus 4. How many in all?')).toEqual(['Great job!', '3 plus 4.', 'How many in all?'])
    expect(sentences('"Even… me?" he whispered.')).toEqual(['"Even… me?" he whispered.'])
  })

  it('the game’s lines with numbers, sounds, names and Pals still fit their templates (if a line changes, add or fix its template)', () => {
    const misfits = new Set<string>()
    for (const skill of ['numbers', 'reading'] as const) {
      for (const level of LEVELS[skill]) {
        for (let i = 0; i < 400; i++) {
          const q = level.question()
          const ex = level.exercise?.()
          for (const line of [q.say, ...q.choices.map((c) => `${c.say}!`), ex?.say ?? '']) {
            for (const s of sentences(line)) if (/\d|⟦/.test(s) && !matchTemplate(s) && !/^\D*(is at|for) \d+ (o'clock|cents)\b/.test(s)) misfits.add(s.replace(/\d+/g, '#'))
          }
        }
      }
    }
    expect([...misfits]).toEqual([])
    expect(matchTemplate(sentences(SHADE_SAY.intro('Zippy'))[1])?.tpl.id).toBe('shade-making')
    expect(matchTemplate(sentences(placementIntro('Ember', 'Olivia'))[0])?.tpl.id).toBe('treasure-intro')
  })
})

describe('stitching', () => {
  it('puts a line together from a template’s part and a name from the library, in one voice', async () => {
    setHouse(await house({ mom: [...partsOf('way-to-go'), keys.name('Olivia', 'exclaim'), 'Great job!'] }))
    const parts = await stitch('Great job! Way to go, Olivia!')
    expect(parts).toHaveLength(3)
    expect(parts![0].gap).toBe(220) // (between sentences)
    expect(parts![1].gap).toBe(40) // (between a part and its slot)
    expect(fetched.filter((u) => u.startsWith('/voice/house/mom/'))).toHaveLength(3)
    // (a sound-alike spelling uses the same recording)
    setHouse(await house({ mom: [...partsOf('way-to-go'), keys.name('Aiden', 'exclaim')] }))
    expect(await stitch('Way to go, Aidan!')).toHaveLength(2)
  })

  it('a name that isn’t recorded: nothing is stitched (and the line goes to the device voice)', async () => {
    setHouse(await house({ mom: [...partsOf('way-to-go'), keys.name('Olivia', 'exclaim')] }))
    expect(await stitch('Way to go, Zxqvbn!')).toBeNull()
    expect(await stitch('Way to go, Olivia! Something nobody recorded.')).toBeNull()
  })

  it('the family’s own recording of their child’s name comes first', async () => {
    familyIds = [await lineId(keys.name('Zxqvbn', 'exclaim'))]
    await loadRecordings()
    setHouse(await house({ mom: partsOf('way-to-go') }))
    const parts = await stitch('Way to go, Zxqvbn!')
    expect(parts).toHaveLength(2)
    expect(fetched.some((u) => u.startsWith('/recording/'))).toBe(true)
    expect(await stitch('Way to go, Zxqvbn!', 'narrator', { family: false })).toBeNull() // (Family voices off)
  })

  it('numbers, letters and sounds; commas leave a pause', async () => {
    setHouse(await house({ mom: [3, 4, 5].map((n) => keys.number(n, 'mid')).concat(['What number comes next?', ...partsOf('starts-with'), keys.sound('b'), keys.letter('b')]) }))
    const seq = await stitch('3, 4, 5. What number comes next?')
    expect(seq?.map((p) => p.gap)).toEqual([160, 160, 220, undefined])
    expect(await stitch('Which picture starts with the ⟦b⟧ sound, like the letter B?')).toHaveLength(4)
    expect(await stitch('3, 4, 6. What number comes next?')).toBeNull()
  })

  it('stays in one voice: Dad’s whole line, or Mom’s, never a mix', async () => {
    const line = 'Grumbleshade is making Zippy grumpy.'
    setHouse(await house({ dad: partsOf('shade-making'), mom: [...partsOf('shade-making'), keys.pal('Zippy', 'mid')] }))
    await stitch(line, 'shade')
    expect(fetched.filter((u) => u.startsWith('/voice/house/')).every((u) => u.startsWith('/voice/house/mom/'))).toBe(true)
    expect(await stitch(line, 'shade')).toHaveLength(3) // ("Grumbleshade is making", "Zippy", "grumpy.")
  })
})

describe('trimming silence', () => {
  it('finds where the sound is, with a little room either side', async () => {
    const { soundBounds } = await import('../voice/player')
    const rate = 1000
    const ch = new Float32Array(2000) // (two seconds: quiet, then a word from 0.5 s to 1.2 s, then quiet)
    for (let i = 0; i < ch.length; i++) ch[i] = i >= 500 && i < 1200 ? Math.sin(i) * 0.5 : (i % 7) * 0.001
    const [a, b] = soundBounds(ch, rate)
    expect(a).toBeCloseTo(0.47, 1)
    expect(b).toBeCloseTo(1.23, 1)
    expect(soundBounds(new Float32Array(100), rate)).toEqual([0, 0.1]) // (silence: left as it is)
  })
})
