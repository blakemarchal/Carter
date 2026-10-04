// Grumbleshade's arc (data/shade.ts): a line on every island he floats away from, Easter Morning's
// finale, the little grumpy cloud after it, and nothing the narrator would trip over.
import { describe, expect, it } from 'vitest'
import { ISLANDS } from '../data/islands'
import { SEAS } from '../data/seas'
import { PALS } from '../data/pals'
import { FINALE_ISLAND, GLADSHADE, SHADE_LINES, SHADE_SAY, VOYAGE_DONE, shadeFor } from '../data/shade'

const EMOJI = /\p{Extended_Pictographic}/u
/** Words and everyday punctuation (quotes are fine): no emoji, and no symbol for the voice to read out. */
const PLAIN = /^[A-Za-z .,!?:'"’“”…-]+$/
const voyage = SEAS.flatMap((s) => s.islands.map((i) => i.id))
const finaleAt = voyage.indexOf(FINALE_ISLAND)
/** Every name a creature in a battle can have. */
const foes = PALS.map((p) => p.stages[0].name)

describe("Grumbleshade's arc", () => {
  it('ends on an island of the voyage, where he becomes Gladshade', () => {
    expect(ISLANDS.some((i) => i.id === FINALE_ISLAND)).toBe(true)
    expect(finaleAt).toBeGreaterThan(0)
    expect(PALS.find((p) => p.id === GLADSHADE)?.species).toBe('shade')
  })

  it('every island except the finale has his line (after it, a little grumpy cloud instead)', () => {
    for (const { id } of ISLANDS) {
      if (id === FINALE_ISLAND) expect(shadeFor(id, false).kind).toBe('finale')
      else if (voyage.indexOf(id) < finaleAt) expect(SHADE_LINES[id], id).toBeTruthy()
      else expect(shadeFor(id, true).kind, id).toBe('cloud')
    }
  })

  it('has lines only for islands before the finale', () => {
    for (const id of Object.keys(SHADE_LINES)) {
      expect(ISLANDS.some((i) => i.id === id), id).toBe(true)
      expect(voyage.indexOf(id), id).toBeLessThan(finaleAt)
    }
  })

  it('his lines are short, name him, and have no emoji or symbols', () => {
    for (const [id, line] of Object.entries(SHADE_LINES)) {
      expect(line, id).not.toMatch(EMOJI)
      expect(line, id).toMatch(PLAIN)
      expect(line, id).toContain('Grumbleshade')
      expect(line.length, id).toBeLessThanOrEqual(140)
      // (every quote that opens, closes)
      expect((line.match(/"/g) ?? []).length % 2, id).toBe(0)
    }
  })

  it('everything else the narrator says about him has no emoji or symbols either', () => {
    const said = [
      ...foes.flatMap((f) => [SHADE_SAY.intro(f), SHADE_SAY.cloudIntro(f), SHADE_SAY.chased(f), SHADE_SAY.chasedPlain(f), SHADE_SAY.cloudChased(f)]),
      ...Object.values(SHADE_SAY.finale),
      ...VOYAGE_DONE,
    ]
    for (const t of said) {
      expect(t, t).not.toMatch(EMOJI)
      expect(t, t).toMatch(PLAIN)
    }
  })

  it('who hides in the creature: his line, the finale, or (once he is Gladshade) the cloud', () => {
    expect(shadeFor('noah', false)).toEqual({ kind: 'grumble', line: SHADE_LINES.noah })
    expect(shadeFor(FINALE_ISLAND, false)).toEqual({ kind: 'finale' })
    // a birthday party, or an island without a line, keeps the usual words
    expect(shadeFor(undefined, false)).toEqual({ kind: 'grumble', line: undefined })
    expect(shadeFor('pentecost', false)).toEqual({ kind: 'grumble', line: undefined })
    // after the finale: every battle, replays and birthdays too
    for (const id of [undefined, 'noah', FINALE_ISLAND, 'pentecost']) expect(shadeFor(id, true)).toEqual({ kind: 'cloud' })
  })
})
