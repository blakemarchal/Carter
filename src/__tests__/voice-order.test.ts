// Who speaks a line: the family's own recording, then the house voice for the line's role (with the next
// voice in the role's list standing in), then a narration clip made ahead of time, then the device voice.
// And a line with a family's name in it never reaches /tts.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const played = vi.hoisted(() => ({ parts: [] as unknown[][], ok: true }))
vi.mock('../voice/player', () => ({
  PART_GAP: 40, SENTENCE_GAP: 220,
  playParts: vi.fn(async (parts: unknown[]) => { played.parts.push(parts); return played.ok }),
  stopParts: vi.fn(),
  soundBounds: vi.fn(),
}))

import { lineId, loadRecordings } from '../lib/recordings'
import { setHouse, type HouseManifest } from '../voice/house'
import { planLine } from '../voice/resolve'
import { mentions, privateNames } from '../voice/privacy'
import { ROLE_VOICES } from '../voice/roles'
import { addProfile, deleteProfile, setFamily, getFamily } from '../lib/progress'
import { preload, speak } from '../lib/speech'

let asked: string[] = []
/** The lines asked of /tts. */
const ttsAsked = () => asked.filter((u) => u.startsWith('/tts')).map((u) => new URL(u, 'http://x').searchParams.get('text') ?? '')
let familyIds: string[] = []
const said: string[] = []

function serve(url: string) {
  asked.push(url)
  if (url === '/recordings') return new Response(JSON.stringify(familyIds))
  if (url.startsWith('/recording/') || url.startsWith('/voice/house/')) return new Response(new Uint8Array([1, 2, 3]))
  if (url.startsWith('/tts')) return new Response('', { status: 404 })
  return new Response('', { status: 404 })
}

async function house(clips: Record<string, string[]>): Promise<HouseManifest> {
  const m: HouseManifest = { version: 1, voices: {}, clips: {} }
  for (const [voice, lines] of Object.entries(clips)) {
    m.clips[voice] = {}
    for (const l of lines) m.clips[voice][await lineId(l)] = ['v1', 10, 900, 1.2]
  }
  return m
}

beforeEach(async () => {
  asked = []
  familyIds = []
  played.parts = []
  played.ok = true
  said.length = 0
  vi.stubGlobal('fetch', vi.fn(async (u: string) => serve(String(u))))
  vi.stubGlobal('window', { speechSynthesis: { speak: (u: { text: string; onend?: () => void }) => { said.push(u.text); u.onend?.() }, cancel() {}, getVoices: () => [] } })
  vi.stubGlobal('SpeechSynthesisUtterance', function (this: { text: string }, t: string) { this.text = t })
  setHouse(null)
  await loadRecordings()
})
afterEach(() => { vi.unstubAllGlobals() })

describe('the order a line is spoken in', () => {
  it('the family’s own recording comes first, then the house voice, then nothing (and the caller goes on)', async () => {
    const line = 'Noah built a big boat.'
    setHouse(await house({ mom: [line] }))
    familyIds = [await lineId(line)]
    await loadRecordings()
    expect((await planLine(line))?.from).toBe('family')
    expect((await planLine(line, 'narrator', { family: false }))?.from).toBe('house') // (Family voices turned off)
    familyIds = []
    await loadRecordings()
    const p = await planLine(line)
    expect(p?.from).toBe('house')
    expect(p?.parts[0]).toMatchObject({ start: 10, end: 900, gain: 1.2 })
    expect(await planLine('A line nobody recorded.')).toBeNull()
  })

  it('the role picks the voice, and the next voice in its list stands in', async () => {
    expect(ROLE_VOICES).toEqual({ narrator: ['mom', 'grok'], shade: ['dad', 'mom', 'grok'], pals: ['child', 'mom', 'grok'] })
    const grr = 'Grumbleshade is making Hoppy grumpy.'
    setHouse(await house({ mom: [grr, 'Yes, please!'], dad: [grr] }))
    await planLine(grr, 'shade')
    expect(asked.at(-1)).toMatch(/^\/voice\/house\/dad\//)
    await planLine('Yes, please!', 'pals') // (the child hasn't recorded it: Mom reads it)
    expect(asked.at(-1)).toMatch(/^\/voice\/house\/mom\//)
    setHouse(await house({ dad: ['Only Dad has this.'] }))
    expect(await planLine('Only Dad has this.', 'narrator')).toBeNull() // (the narrator is Mom's part)
  })

  it('speak(): a recording plays; without one, a clip made ahead of time, then the device voice', async () => {
    setHouse(await house({ mom: ['Great job!'] }))
    await speak('Great job!')
    expect(played.parts).toHaveLength(1)
    expect(asked.some((u) => u.startsWith('/tts'))).toBe(false)
    await speak('Tap the boat!')
    expect(ttsAsked()).toContain('Tap the boat!')
    expect(said).toContain('Tap the boat!')
  })
})

describe('no child’s name reaches /tts', () => {
  it('a line with a player’s or family member’s name is never asked for, spoken or preloaded', async () => {
    const id = addProfile('Olivia', '🌈')
    const cast = getFamily()
    setFamily({ ...cast, mom: 'Mama Jo', siblings: [{ name: 'Benji' }], pets: [{ name: 'Biscuit', emoji: '🐶' }] })
    try {
      expect(privateNames()).toEqual(expect.arrayContaining(['Olivia', 'Mama Jo', 'Benji', 'Biscuit']))
      for (const line of ['Way to go, Olivia!', 'OLIVIA, tap the boat!', 'Benji is a baby.', 'Biscuit wants a hug!', 'Ask Mama Jo!']) await speak(line)
      await preload(['Way to go, Olivia!', 'Thank you, chef Olivia!', 'Pick a move!'])
      const tts = ttsAsked()
      expect(tts.some((u) => /olivia|benji|biscuit|mama jo/i.test(u))).toBe(false)
      expect(tts).toContain('Pick a move!')
      expect(said).toContain('Way to go, Olivia!') // (the device's own voice reads it, on the device)
    } finally {
      deleteProfile(id)
      setFamily(cast)
    }
  })

  it('a name counts as a whole word, in any case; "Mom" and "Dad" aren’t private', () => {
    expect(mentions('Ava, look!', ['Ava'])).toBe(true)
    expect(mentions('An avalanche of snow', ['Ava'])).toBe(false)
    expect(mentions('Thank you, chef ava!', ['Ava'])).toBe(true)
    expect(mentions('José!', ['José'])).toBe(true)
    expect(privateNames()).not.toContain('Mom')
  })
})
