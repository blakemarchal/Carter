// The house Grok voice: every line the game says has a Grok clip, whole or stitched (names excepted: a child's
// name not in the library is read by the device voice, by design), and the list for the server is up to date.
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { ISLANDS, loadIsland, type Island } from '../data/islands'
import { LEVELS } from '../learn/levels'
import { PRAISE, RETRY } from '../lib/speech'
import { lineId } from '../lib/recordings'
import { setHouse, type HouseManifest } from '../voice/house'
import { planLine } from '../voice/resolve'
import { setStitcher } from '../voice/resolve'
import { stitch } from '../voice/stitch'
import { buildGrokList, grokCharacters, type GrokClip } from '../voice/grok-list'
import { seeded } from '../voice/lines-source'
import { SHADE_SAY } from '../data/shade'
import { PALS } from '../data/pals'
// @ts-expect-error (plain JavaScript, without types)
import { fingerprint, plan } from '../../scripts/warm-house-grok.mjs'

let islands: Island[]
let list: GrokClip[]
beforeAll(async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(new Uint8Array([1]))))
  islands = await Promise.all(ISLANDS.map((i) => loadIsland(i.id)))
  list = buildGrokList(islands)
  const m: HouseManifest = { version: 1, voices: {}, clips: { grok: {} } }
  for (const c of list) m.clips.grok[await lineId(c.key)] = ['v', 0, 0, 1]
  setHouse(m)
  setStitcher(stitch)
}, 120_000)

/** Lines no Grok clip says, whole or stitched. */
async function uncovered(lines: string[]): Promise<string[]> {
  const out: string[] = []
  for (const l of new Set(lines)) if (l.trim() && !(await planLine(l, 'narrator', { family: false }))) out.push(l)
  return out
}

describe('the house Grok voice', () => {
  it('public/voice/grok-list.json is up to date (if not: npm run voice-script)', () => {
    const file = JSON.parse(readFileSync('public/voice/grok-list.json', 'utf8'))
    expect(file).toEqual(list)
    expect(list.length).toBeGreaterThan(5000)
    expect(grokCharacters(list)).toBeLessThan(400_000) // (the warm script's default limit)
  })

  it('the server makes clips under the same fingerprints the game looks for, and remakes a flagged one with its next prompt', async () => {
    expect(fingerprint('Great job!')).toBe(await lineId('Great job!'))
    const t = list.find((c) => c.ref === 'sound:t')!
    expect(t.say[0]).toBe('tuh')
    expect(plan([t], {})).toEqual([{ clip: t, id: fingerprint(t.key), prompt: 'tuh', attempt: 0 }])
    expect(plan([t], { [fingerprint(t.key)]: {} })).toEqual([])
    expect(plan([t], { [fingerprint(t.key)]: { flagged: true } })[0]).toMatchObject({ prompt: t.say[1], attempt: 1 })
  })

  it('every island step’s lines have a Grok clip: stories, activities, quizzes, verses, and their things by name', async () => {
    const lines: string[] = []
    for (const isl of islands) {
      for (const s of isl.steps) {
        const o = s as Record<string, unknown>
        for (const f of ['intro', 'done', 'hint', 'line']) if (typeof o[f] === 'string') lines.push(o[f] as string)
        if (s.kind === 'story') s.pages.forEach((p, i) => lines.push(i === 0 ? `${s.title}. ${p.text}` : p.text))
        if (s.kind === 'quiz') lines.push(...s.questions.map((q) => q.say))
        if (s.kind === 'verse') lines.push(...s.chunks, `${s.chunks.join(' ')} ${s.ref}.`)
        if (s.kind === 'sort') {
          lines.push(...s.items.map((it) => `Where does ${it.say} go?`), ...s.groups.map((g) => `That's right, ${g.say}! ${PRAISE[0]}`))
        }
        if (s.kind === 'maze') lines.push(`${PRAISE[1]} You found ${s.goal.say}!`, `Tap a glowing square next to ${s.hero.say}, or drag ${s.hero.say} along!`)
        if (s.kind === 'sequence') lines.push(...s.items.map((it) => `That's ${it.say.replace(/[.!?]+$/, '')}. Which one comes next?`))
      }
    }
    expect(await uncovered(lines)).toEqual([])
  }, 120_000)

  it('every learning level’s lines have a Grok clip', async () => {
    const random = Math.random
    Math.random = seeded(7)
    const lines: string[] = []
    try {
      for (const level of [...LEVELS.reading, ...LEVELS.numbers]) {
        for (let i = 0; i < 150; i++) {
          const q = level.question()
          lines.push(q.say, ...q.choices.map((c) => `${c.say}! ${PRAISE[2]}`))
          const ex = level.exercise?.()
          if (ex) lines.push(ex.say)
        }
      }
    } finally {
      Math.random = random
    }
    expect(await uncovered(lines)).toEqual([])
  }, 120_000)

  it('praise, a child’s name from the library, battles and Pals: all Grok', async () => {
    const zippy = PALS.find((p) => p.id === 'zippy')!
    expect(await uncovered([
      ...PRAISE.map((p) => p.replace('{name}', 'Olivia')), ...RETRY,
      'Way to go, Liam!', 'Thank you, chef Sophia!',
      SHADE_SAY.intro('Zippy'), `Zippy used ${zippy.moves.basic.name}!`, `Ember learned a super move: ${PALS.find((p) => p.id === 'ember')!.moves.super.name}!`,
      'Which picture starts with the ⟦t⟧ sound, like the letter T?', 'T says ⟦t⟧!',
    ])).toEqual([])
    // (a name that isn't in the library has no clip: that line goes to the device voice, never to xAI)
    expect(await uncovered(['Way to go, Zxqvbn!'])).toEqual(['Way to go, Zxqvbn!'])
  }, 60_000)
})
