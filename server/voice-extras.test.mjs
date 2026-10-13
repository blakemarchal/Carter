// "Let the narrator say <name>" (only with a parent's OK: one name, sent once, kept with the family's own
// recordings), and the voice coverage log (lines that fell to the device voice, for the next warm-up).
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cleanChildName, createMissed, createNameConsent, makeNameClips, nameClipId, removeNameClips } from './voice-extras.mjs'
import { createRecordings } from './recordings.mjs'
import { lineId } from '../src/lib/recordings'
import { keys } from '../src/voice/keys'
import { nameKey } from '../src/voice/names'

const folder = () => mkdtempSync(join(tmpdir(), 'arkpals-voice-'))

describe('the narrator says a name only with a parent’s OK', () => {
  it('makes the two clips the game looks for, under the family’s own recordings', async () => {
    const dir = folder()
    const recordings = createRecordings(join(dir, 'recordings'))
    const consent = createNameConsent(join(dir, 'voice-names.json'))
    const sent = []
    const ids = await makeNameClips(' Zxqvbn ', { synth: async (t) => { sent.push(t); return Buffer.from(`mp3:${t}`) }, recordings, consent })
    expect(sent).toEqual(['Zxqvbn', 'Zxqvbn!']) // (that one name, nothing else)
    for (const take of ['mid', 'exclaim']) expect(ids[take]).toBe(await lineId(keys.name(nameKey('Zxqvbn'), take)))
    expect(await recordings.list()).toEqual(expect.arrayContaining([ids.mid, ids.exclaim]))
    expect(await consent.list()).toEqual(['Zxqvbn'])
    await removeNameClips('zxqvbn', { recordings, consent })
    expect(await recordings.list()).toEqual([])
    expect(await consent.list()).toEqual([])
  })

  it('takes only a name', async () => {
    expect(cleanChildName('  Mary   Kate ')).toBe('Mary Kate')
    expect(cleanChildName("D'Andre")).toBe("D'Andre")
    expect(cleanChildName('José')).toBe('José')
    for (const bad of ['', '1234', 'Say something rude, then', 'x'.repeat(31), '<script>']) expect(cleanChildName(bad)).toBeNull()
    expect(nameClipId('Zuri', 'mid')).toBe(await lineId(keys.name(nameKey('Zuri'), 'mid')))
  })
})

describe('the voice coverage log', () => {
  it('keeps each line once, with how often and when, newest first, up to its limit', async () => {
    let t = 1
    const log = createMissed(join(folder(), 'missed.json'), { clock: () => t++, max: 2 })
    await log.add('Where does the yak go?', 'Where does the yak go?')
    await log.add('Where does the yak go?')
    await log.add('A new line.')
    await log.add('...')
    expect(await log.list()).toEqual([
      { line: 'A new line.', spoken: 'A new line.', count: 1, last: 3 },
      { line: 'Where does the yak go?', spoken: 'Where does the yak go?', count: 2, last: 2 },
    ])
    await log.add('A third line.')
    expect((await log.list()).map((x) => x.line)).toEqual(['A third line.', 'A new line.'])
    await log.clear()
    expect(await log.list()).toEqual([])
  })
})
