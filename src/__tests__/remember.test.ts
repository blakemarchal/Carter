// The "Remember?" round (learn/remember.ts): what a player knows, which of it a day's round asks, how a right or
// wrong answer moves a thing between the boxes, the questions themselves, and what the round says (voice script).
import { describe, expect, it } from 'vitest'
import { ISLANDS, loadAllIslands } from '../data/islands'
import { ANIMALS, SORTS, animalById } from '../data/animals'
import { SIGHT } from '../data/words'
import { fresh, type Progress } from '../lib/progress'
import { VIEWS } from '../learn/registry'
import {
  INTERVALS, KINDS, NEW_PER_ROUND, ROUND_SIZE, TOP_BOX, WORDS_LEVEL, addDays, animalQ, kindOf, known, planRound, questionFor,
  remembered, rememberLines, roundDue, verseOf, verseQ, wordQ, type Verse,
} from '../learn/remember'

const DAY = '2026-10-16'
const player = (over: Partial<Progress> = {}): Progress => ({ ...fresh(), ...over })

describe('days', () => {
  it('adds days across the end of a month and a year', () => {
    expect(addDays('2026-10-30', 2)).toBe('2026-11-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays(DAY, 0)).toBe(DAY)
  })
})

describe('what the player knows', () => {
  it('nothing for a brand-new player; the verse of each island finished; sight words once they read them', () => {
    expect(known(player())).toEqual([])
    expect(known(player({ islandsDone: ['noah', 'creation'] }))).toEqual(['verse:noah', 'verse:creation', 'bigword:obey', 'bigword:promise', 'bigword:beginning', 'bigword:wonderfully'])
    const reader = player({ skills: { reading: WORDS_LEVEL, numbers: 1 } })
    expect(known(reader)).toEqual(SIGHT.map((w) => `word:${w}`))
    expect(known(player({ skills: { reading: WORDS_LEVEL - 1, numbers: 1 } }))).toEqual([])
    expect(known(player({ islandsDone: ['nowhere'] }))).toEqual([])
  })

  it('the animals met on finished islands, once their content is here', async () => {
    const all = await loadAllIslands()
    const ids = known(player({ islandsDone: ['noah'] }), all)
    const animals = ids.filter((id) => kindOf(id) === 'animal')
    expect(animals.length).toBeGreaterThan(3)
    for (const id of animals) expect(animalById(id.slice('animal:'.length))).toBeTruthy()
  })

  it('every island has a memory verse to ask about, in pieces', async () => {
    for (const isl of await loadAllIslands()) {
      const v = verseOf(isl)
      expect(v, `${isl.id} has no verse`).toBeTruthy()
      expect(v!.chunks.length, isl.id).toBeGreaterThanOrEqual(2)
      expect(v!.name).toBe(ISLANDS.find((i) => i.id === isl.id)!.name)
    }
  })
})

describe('a day’s round', () => {
  it('asks a few new things on the first day (verses first), and nothing it was not told about', () => {
    const p = player({ islandsDone: ['noah', 'creation', 'david', 'jonah'], skills: { reading: WORDS_LEVEL, numbers: 1 } })
    const round = planRound(p, DAY)
    expect(round.length).toBe(NEW_PER_ROUND)
    for (const id of round) expect(kindOf(id)).toBe('verse')
    expect(roundDue(p, DAY)).toBe(true)
    expect(roundDue({ ...p, rememberDay: DAY }, DAY)).toBe(false)
    expect(roundDue(player(), DAY)).toBe(false)
  })

  it('asks what is due first (the longest-waiting, then the shakiest), filling with new things up to the round’s size', () => {
    const p = player({
      islandsDone: ['noah', 'creation', 'david'],
      remember: {
        'verse:noah': { box: 2, due: '2026-10-10' },
        'verse:creation': { box: 1, due: '2026-10-10' },
        'word:the': { box: 0, due: DAY },
        'word:is': { box: 3, due: '2026-10-20' },
      },
    })
    const round = planRound(p, DAY)
    expect(round.slice(0, 3)).toEqual(['verse:creation', 'verse:noah', 'word:the'])
    expect(round[3]).toBe('verse:david')
    expect(kindOf(round[4])).toBe('bigword')
    expect(round).not.toContain('word:is')
    expect(round.length).toBe(ROUND_SIZE)
  })

  it('never asks more than the round’s size, due things before new ones', () => {
    const remember: Progress['remember'] = {}
    for (let i = 0; i < 8; i++) remember[`word:${SIGHT[i]}`] = { box: 0, due: '2026-10-01' }
    const p = player({ islandsDone: ['noah'], remember })
    const round = planRound(p, DAY)
    expect(round.length).toBe(ROUND_SIZE)
    for (const id of round) expect(kindOf(id)).toBe('word')
  })
})

describe('the boxes', () => {
  it('a right answer moves a thing up a box and asks it again after longer; a miss sends it back for tomorrow', () => {
    let p = player({ islandsDone: ['noah'] })
    p = remembered(p, 'verse:noah', true, DAY)
    expect(p.remember!['verse:noah']).toEqual({ box: 1, due: addDays(DAY, INTERVALS[1]) })
    p = remembered(p, 'verse:noah', true, '2026-10-18')
    expect(p.remember!['verse:noah']).toEqual({ box: 2, due: addDays('2026-10-18', INTERVALS[2]) })
    p = remembered(p, 'verse:noah', false, '2026-10-22')
    expect(p.remember!['verse:noah']).toEqual({ box: 0, due: '2026-10-23' })
    for (let i = 0; i < 10; i++) p = remembered(p, 'verse:noah', true, DAY)
    expect(p.remember!['verse:noah'].box).toBe(TOP_BOX)
    expect(p.remember!['verse:noah'].due).toBe(addDays(DAY, INTERVALS[TOP_BOX]))
    expect(INTERVALS[0]).toBe(1)
  })
})

describe('the questions', () => {
  const noah: Verse = { island: 'noah', name: "Noah's Ark", chunks: ['I set my rainbow', 'in the cloud,', 'a sign of my promise.'], ref: 'Genesis 9:13' }
  const creation: Verse = { island: 'creation', name: 'Creation', chunks: ['In the beginning', 'God created', 'the heavens and the earth.'], ref: 'Genesis 1:1' }

  it('a verse with one piece missing: the right piece among the choices, the others from other verses', () => {
    for (let i = 0; i < 20; i++) {
      const q = verseQ(noah, [noah, creation])
      const data = q.visual.kind === 'learn' ? (q.visual.data as { chunks: string[]; missing: number; ref: string }) : undefined
      expect(q.visual.kind === 'learn' && q.visual.view).toBe('rm-verse')
      expect(VIEWS['rm-verse']).toBeTruthy()
      expect(data!.chunks).toEqual(noah.chunks)
      expect(q.choices[q.answer].label).toBe(noah.chunks[data!.missing])
      expect(q.choices).toHaveLength(3)
      const wrong = q.choices.filter((_, k) => k !== q.answer).map((c) => c.label)
      for (const w of wrong) expect(creation.chunks).toContain(w)
      expect(q.say).toContain("Noah's Ark")
    }
    // (with only one verse known, the verse's own other pieces stand in)
    const q = verseQ(noah, [noah])
    const wrong = q.choices.filter((_, k) => k !== q.answer).map((c) => c.label)
    for (const w of wrong) expect(noah.chunks).toContain(w)
    expect(new Set(q.choices.map((c) => c.label)).size).toBe(3)
  })

  it('a sight word to find, and an animal’s home or baby', () => {
    const w = wordQ('love')
    expect(w.visual).toEqual({ kind: 'listen' })
    expect(w.choices[w.answer].label).toBe('love')
    expect(w.choices).toHaveLength(3)
    const sheep = animalById('sheep')!
    const home = animalQ(sheep, 'home')
    expect(home.choices).toHaveLength(SORTS.home.groups.length)
    expect(home.choices[home.answer].say).toBe('the land')
    expect(home.choices[home.answer].art).toBe('tree')
    const baby = animalQ(sheep, 'baby')
    expect(baby.choices[baby.answer].label).toBe('lamb')
    expect(new Set(baby.choices.map((c) => c.label)).size).toBe(3)
    expect(baby.visual).toEqual({ kind: 'learn', view: 'rd-word-pic', data: { word: 'sheep', art: 'sheep' } })
  })

  it('finds the question for each thing in a round, and none for a verse that is not here', () => {
    expect(questionFor('verse:noah', [noah])?.say).toContain("Noah's Ark")
    expect(questionFor('verse:creation', [noah])).toBeUndefined()
    expect(questionFor('word:the', [])?.choices.map((c) => c.label)).toContain('the')
    expect(questionFor('word:zebra', [])).toBeUndefined()
    expect(questionFor('animal:sheep', [])?.say).toMatch(/sheep/)
    expect(questionFor('animal:dragon', [])).toBeUndefined()
    const big = questionFor('bigword:jealous', [])!
    expect(big.say).toBe('What does jealous mean? Wanting what someone else has, feeling very sleepy, or having a party?')
    expect(big.choices[big.answer].say).toBe('wanting what someone else has')
    expect(big.choices.map((c) => c.label)).toEqual(['😠', '😴', '🎉'])
    expect(questionFor('bigword:zebra', [])).toBeUndefined()
    expect(KINDS).toEqual(['verse', 'word', 'animal', 'bigword'])
  })
})

describe('what the round says', () => {
  it('every fixed line: the prompts for each island and animal, the answers, no templates', () => {
    const lines = rememberLines()
    expect(lines.length).toBeGreaterThan(ISLANDS.length + ANIMALS.length * 2)
    expect(new Set(lines).size).toBe(lines.length)
    for (const l of lines) {
      expect(l).not.toMatch(/[{}]/)
      expect(l.trim()).toBe(l)
    }
    expect(lines).toContain('Where does the sheep live?')
    expect(lines).toContain('What is a baby sheep called?')
    expect(lines).toContain('lamb!')
    expect(lines).toContain('the sky!')
    expect(lines).toContain('Find the word: love.')
  })
})
