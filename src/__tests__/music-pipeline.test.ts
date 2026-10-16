// The music pipeline (scripts/music): the song list and lyrics, a song's plan for the music model, matching the
// heard words to the lyrics for the word timings, and putting files into the game.
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
// @ts-expect-error (plain scripts, without types)
import { songs, styles, hashedName } from '../../scripts/music/lib.mjs'
// @ts-expect-error
import { buildPlan, planMs } from '../../scripts/music/plan.mjs'
// @ts-expect-error
import { alignWords, fillGaps, norm, timingFor } from '../../scripts/music/align.mjs'
// @ts-expect-error
import { mergeGen, place } from '../../scripts/music/install.mjs'
import { SONG_IDS } from '../data/songs'

describe('the songs and their lyrics', () => {
  it('lists every built-in song with its lines, the birthday song with its name slot', () => {
    const all = songs()
    expect(all.map((s: { id: string }) => s.id)).toEqual(SONG_IDS)
    for (const s of all) expect(s.lines.length, s.id).toBeGreaterThan(3)
    expect(all.find((s: { id: string }) => s.id === 'happy-birthday').name).toBeTruthy()
    expect(all.find((s: { id: string }) => s.id === 'song-joseph').title).toBe("Joseph's Coat")
    expect(all.find((s: { id: string }) => s.id === 'song-jonah').island).toBe('jonah')
  })

  it('every song has a style, and no style names a song that does not exist', () => {
    const st = styles()
    const ids = new Set(songs().map((s: { id: string }) => s.id))
    for (const k of Object.keys(st)) if (!['_', 'default', 'loops'].includes(k)) expect(ids.has(k), k).toBe(true)
    expect(Object.keys(st.loops).filter((k) => k !== '_').sort()).toEqual(['battle', 'home', 'lullaby', 'play', 'story'])
  })
})

describe('a song’s plan for the music model', () => {
  it('puts the lyrics in sections of four lines, within the API’s limits, the first section setting the style', () => {
    const song = songs().find((s: { id: string }) => s.id === 'song-creation')
    const plan = buildPlan(song, styles())
    expect(plan.chunks.length).toBe(Math.ceil(song.lines.length / 4))
    expect(plan.chunks[0].text.startsWith('[Verse 1]\n')).toBe(true)
    expect(plan.chunks[0].positive_styles).toContain("children's song")
    expect(plan.chunks[0].positive_styles).toContain('joyful')
    expect(plan.chunks[1].positive_styles).toContain('same singer')
    for (const c of plan.chunks) {
      expect(c.duration_ms).toBeGreaterThanOrEqual(3000)
      expect(c.duration_ms).toBeLessThanOrEqual(120000)
      expect(c.negative_styles).toContain('rap')
    }
    expect(planMs(plan)).toBeLessThan(5 * 60_000)
    expect(plan.chunks.flatMap((c: { text: string }) => c.text.split('\n').slice(1))).toEqual(song.lines)
  })

  it('leaves out a line with the birthday name slot', () => {
    const plan = buildPlan({ id: 'x', lines: ['Happy birthday to you,', 'Happy birthday, dear {name},', 'Happy birthday to you!'] }, styles())
    expect(plan.chunks[0].text).not.toContain('{name}')
    expect(plan.chunks[0].text.split('\n')).toHaveLength(3)
  })
})

describe('matching the heard words to the lyrics', () => {
  const heard = (text: string, from = 1, step = 0.5) => text.split(' ').map((t, i) => ({ text: t, start: from + i * step, end: from + i * step + 0.4 }))

  it('gives each lyric word the time it was heard, and forgives a mis-heard word', () => {
    const lyrics = ['God', 'made', 'the', 'light', 'so', 'bright,', 'Hooray!']
    const { times, matched } = alignWords(lyrics, heard('god made the lyte so brite hooray'))
    expect(matched).toBe(7)
    expect(times).toEqual([1, 1.5, 2, 2.5, 3, 3.5, 4])
  })

  it('skips extra heard words and fills a word that wasn’t heard from its neighbours', () => {
    const lyrics = ['Jesus', 'loves', 'me', 'this', 'I', 'know']
    const { times, matched } = alignWords(lyrics, heard('oh jesus loves this i know yeah'))
    expect(matched).toBe(5)
    expect(times[2]).toBeNull()
    const filled = fillGaps(times, 30)
    expect(filled[2]).toBeGreaterThan(filled[1])
    expect(filled[2]).toBeLessThan(filled[3])
  })

  it('never goes backwards, and spreads words with no times evenly', () => {
    expect(fillGaps([null, null, null, null], 8)).toEqual([0, 2, 4, 6])
    const f = fillGaps([5, null, 4.9], 10)
    expect(f[1]).toBeGreaterThanOrEqual(5)
    expect(f[2]).toBeGreaterThan(f[1])
  })

  it('builds lines in the game’s shape: each line’s start, its words with times, and its end at the next line', () => {
    const lines = ['Twinkle twinkle', 'little star']
    const t = timingFor(lines, [1, 1.5, 2.5, 3], 20)
    expect(t).toEqual([
      { start: 1, end: 2.5, words: [['Twinkle', 1], ['twinkle', 1.5]] },
      { start: 2.5, end: 5.5, words: [['little', 2.5], ['star', 3]] },
    ])
    expect(norm("Hooray!'")).toBe('hooray')
  })
})

describe('putting songs into the game', () => {
  it('names a file by its content and removes older versions of the same song', () => {
    const dir = mkdtempSync(join(tmpdir(), 'arkpals-music-'))
    try {
      const a = place(dir, 'song-x', Buffer.from('one'), '/music')
      const b = place(dir, 'song-x', Buffer.from('two'), '/music')
      const sing = place(dir, 'song-x-sing', Buffer.from('two'), '/music')
      expect(a).not.toBe(b)
      expect(b).toBe(`/music/${hashedName('song-x', Buffer.from('two'))}`)
      expect(readdirSync(dir).sort()).toEqual([b, sing].map((u) => u.split('/').pop()).sort())
      expect(readFileSync(join(dir, b.split('/').pop()!), 'utf8')).toBe('two')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('merges new songs into the gen file in the game’s order, keeping the rest', () => {
    const merged = mergeGen({ b: { old: true }, a: { old: true }, zz: { extra: true } }, { a: { fresh: true }, c: { fresh: true } }, ['a', 'b', 'c'])
    expect(Object.keys(merged)).toEqual(['a', 'b', 'c', 'zz'])
    expect(merged.a).toEqual({ fresh: true })
    expect(merged.b).toEqual({ old: true })
  })
})
