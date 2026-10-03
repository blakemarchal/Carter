// Checks the sing-along songs: every built-in song has its recordings, and its words are timed
// in order (so the highlighted word only ever moves forward).
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SONGS, SONG_IDS, timedLines } from '../data/songs'
import { islandById } from '../data/islands'

describe('built-in songs', () => {
  it('every song is made, in the order listed', () => {
    expect(SONGS.map((s) => s.id)).toEqual(SONG_IDS)
  })

  it("an island's song belongs to an island that's built", () => {
    for (const s of SONGS) if (s.island) expect(islandById(s.island)?.steps, s.id).toBeTruthy()
  })

  it.each(SONGS.map((s) => [s.id, s] as const))('%s has both recordings and words in time order', (_, s) => {
    for (const url of [s.audio.ara, s.audio.sing!]) {
      expect(url).toMatch(/^\/music\/[a-z-]+\.[0-9a-f]{8}\.mp3$/)
      expect(existsSync(join('public', url))).toBe(true)
    }
    let last = -1
    for (const line of s.lines) {
      expect(line.words.length).toBeGreaterThan(0)
      expect(line.start).toBe(line.words[0][1])
      for (const [w, t] of line.words) {
        expect(w.trim()).not.toBe('')
        expect(t).toBeGreaterThan(last)
        last = t
      }
      expect(line.end).toBeGreaterThan(line.start)
    }
    expect(s.beats!.length).toBeGreaterThan(10)
  })
})

describe('timedLines (family songs)', () => {
  it('spreads each line’s words between its start and the next line', () => {
    const lines = timedLines(['Jesus loves me', 'this I know'], [2, 6], 10)
    expect(lines.map((l) => l.start)).toEqual([2, 6])
    expect(lines[0].words.map((w) => w[0])).toEqual(['Jesus', 'loves', 'me'])
    expect(lines[0].words[2][1]).toBeLessThan(6)
    expect(lines[1].words[0][1]).toBe(6)
  })

  it('spreads untimed lines evenly over the recording', () => {
    const lines = timedLines(['a b', 'c d', 'e f'], [], 30)
    expect(lines.map((l) => l.start)).toEqual([0, 10, 20])
  })
})
