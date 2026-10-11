// Play totals: only well-formed counts are kept, in the family's own file; the family's download has them,
// deleting the family deletes them; and only the site owner sees the sums across families.
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { EventEmitter } from 'node:events'
import { describe, expect, it } from 'vitest'
import { createStats, fromDay, isOwner, parseReport, retireOldStats, summarize, summaryPage, validKey, KEEP_DAYS } from './stats.mjs'
import { openFamilies } from './families.mjs'
import { createBackups } from './backup.mjs'
import { createRecordings } from './recordings.mjs'
import { createSongs } from './songs.mjs'
import { deleteFamilyData, writeFamilyExport } from './family-data.mjs'

const NOW = Date.UTC(2026, 9, 11, 15)
const folder = () => mkdtempSync(join(tmpdir(), 'ark-stats-'))
const report = (day, counts) => JSON.stringify({ day, counts })

describe('the names of counts', () => {
  it('allows only events, the game’s islands, visits and activities', () => {
    for (const k of ['start:noah', 'finish:noah', 'replay:red-sea', 'start:noah:v1', 'finish:jonah:v3', 'replay:noah:v2:quiz', 'wrong:noah:v1:quiz', 'finish:pentecost:v1:story'])
      expect(validKey(k), k).toBe(true)
    for (const k of ['wrong:noah', 'wrong:noah:v1', 'start:robin', 'start:Noah', 'quit:noah', 'done:noah', 'start:noah:v0', 'start:noah:v10', 'start:noah:2',
      'start:noah:v1:pause', 'start:noah:v1:reward', 'start:noah:v1:quiz:extra', 'start:noah:v1:Robin', 'play-seconds', '', 'start:noah ', 'start::v1'])
      expect(validKey(k), k).toBe(false)
  })

  it('refuses a whole report with anything else in it', () => {
    const bad = [
      report('2026-10-11', { 'start:noah': 1, 'Name: Robin': 1 }),
      report('2026-10-11', { 'start:noah': 2.5 }),
      report('2026-10-11', { 'start:noah': 0 }),
      report('2026-10-11', { 'start:noah': 1e6 }),
      report('2026-10-11', { 'start:noah': '1' }),
      report('today', { 'start:noah': 1 }),
      report('2026-02-30', { 'start:noah': 1 }),
      report('2026-10-14', { 'start:noah': 1 }), // (the future)
      report('2024-01-01', { 'start:noah': 1 }), // (older than the days kept)
      JSON.stringify({ day: '2026-10-11', counts: { 'start:noah': 1 }, player: 'robin' }),
      JSON.stringify({ day: '2026-10-11', counts: [1] }),
      'not json',
    ]
    for (const text of bad) expect(() => parseReport(text, NOW), text).toThrow(expect.objectContaining({ status: 400 }))
    expect(parseReport(report('2026-10-12', { 'start:noah': 1 }), NOW)).toEqual({ day: '2026-10-12', counts: { 'start:noah': 1 } })
  })
})

describe('a family’s play totals', () => {
  it('add up per day in the family’s own file', async () => {
    const dir = folder()
    const stats = createStats(join(dir, 'fam', 'play-totals.json'), { clock: () => NOW })
    await stats.add(report('2026-10-10', { 'start:noah': 1, 'start:noah:v1': 1, 'wrong:noah:v1:quiz': 2 }))
    await Promise.all([
      stats.add(report('2026-10-10', { 'start:noah': 1 })),
      stats.add(report('2026-10-11', { 'finish:noah:v1:quiz': 1 })),
    ])
    expect(await stats.get()).toEqual({
      '2026-10-10': { 'start:noah': 2, 'start:noah:v1': 1, 'wrong:noah:v1:quiz': 2 },
      '2026-10-11': { 'finish:noah:v1:quiz': 1 },
    })
    expect(() => stats.add(report('2026-10-11', { 'start:robin': 1 }))).toThrow(expect.objectContaining({ status: 400 }))
    expect(Object.keys(await stats.get())).toHaveLength(2)
  })

  it('keeps about 13 months: older days drop off', async () => {
    let t = NOW
    const stats = createStats(join(folder(), 'play-totals.json'), { clock: () => t })
    await stats.add(report('2026-10-11', { 'start:noah': 1 }))
    t += (KEEP_DAYS - 1) * 24 * 3600_000
    expect(Object.keys(await stats.get())).toEqual(['2026-10-11'])
    t += 24 * 3600_000
    expect(await stats.get()).toEqual({})
  })

  it('can be cleared', async () => {
    const file = join(folder(), 'play-totals.json')
    const stats = createStats(file, { clock: () => NOW })
    await stats.clear() // (nothing yet: fine)
    await stats.add(report('2026-10-11', { 'start:noah': 1 }))
    expect(existsSync(file)).toBe(true)
    await stats.clear()
    expect(existsSync(file)).toBe(false)
    expect(await stats.get()).toEqual({})
  })
})

/** A family's stores, as server/index.mjs makes them. */
function storesIn(dir, first = false) {
  return {
    dir: first ? null : dir,
    backups: createBackups(join(dir, 'backups')),
    recordings: createRecordings(join(dir, 'recordings')),
    songs: createSongs(join(dir, 'songs')),
    stats: createStats(join(dir, 'play-totals.json'), { clock: () => NOW }),
  }
}
/** Enough of a response to collect what's written. */
function fakeRes() {
  const res = new EventEmitter()
  res.body = ''
  res.writeHead = (status, headers) => { res.status = status; res.headers = headers }
  res.write = (c) => { res.body += c; return true }
  res.end = () => { res.ended = true }
  return res
}

describe('a family’s download and deleting the family', () => {
  it('the download includes the play totals', async () => {
    const fams = openFamilies(':memory:')
    const fam = fams.firstFamily()
    const st = storesIn(folder(), true)
    await st.stats.add(report('2026-10-11', { 'start:noah': 2, 'wrong:noah:v1:quiz': 1 }))
    await st.backups.save(JSON.stringify({ device: 'ipad1', label: 'iPad', keys: {} }))
    const res = fakeRes()
    await writeFamilyExport(res, fams, fam, st)
    expect(res.status).toBe(200)
    const out = JSON.parse(res.body)
    expect(out.playTotals).toEqual({ '2026-10-11': { 'start:noah': 2, 'wrong:noah:v1:quiz': 1 } })
    expect(out.backups).toHaveLength(1)
    expect(out.family.id).toBe(fam)
  })

  it('deleting a family deletes its play totals with the rest of its folder', async () => {
    const fams = openFamilies(':memory:')
    const start = fams.makeLink({ kind: 'family' })
    const dev = fams.useLink(start.token, { label: 'iPad', familyName: 'The Rivers', yourName: 'Sam' })
    const fam = fams.session(dev).family.id
    const dir = join(folder(), 'families', fam)
    const st = storesIn(dir)
    await st.stats.add(report('2026-10-11', { 'start:noah': 1 }))
    expect(existsSync(join(dir, 'play-totals.json'))).toBe(true)
    await deleteFamilyData(fams, fam, st)
    expect(existsSync(dir)).toBe(false)
    expect(fams.familyIds()).not.toContain(fam)
  })

  it('the first family can’t be deleted, so its totals stay (a parent can clear them)', async () => {
    const fams = openFamilies(':memory:')
    const st = storesIn(folder(), true)
    await st.stats.add(report('2026-10-11', { 'start:noah': 1 }))
    await expect(deleteFamilyData(fams, fams.firstFamily(), st)).rejects.toMatchObject({ status: 409 })
    expect(await st.stats.get()).toEqual({ '2026-10-11': { 'start:noah': 1 } })
  })
})

describe('the owner’s summary', () => {
  it('only the first family’s parents are the owner', () => {
    const fams = openFamilies(':memory:')
    const owner = fams.session(fams.passwordDevice('iPad'))
    expect(isOwner(fams, owner)).toBe(true)
    // (a grandparent in the first family)
    const inv = fams.makeLink({ kind: 'member', familyId: fams.firstFamily(), name: 'Nana', role: 'grownup' })
    expect(isOwner(fams, fams.session(fams.useLink(inv.token, { label: 'Phone' })))).toBe(false)
    // (a parent in another family)
    const start = fams.makeLink({ kind: 'family' })
    expect(isOwner(fams, fams.session(fams.useLink(start.token, { label: 'iPad', familyName: 'Rivers', yourName: 'Sam' })))).toBe(false)
    expect(isOwner(fams, null)).toBe(false)
    expect(fams.familyIds()).toHaveLength(2)
  })

  it('sums across families, per island, visit and activity, for the days asked', () => {
    const a = { '2026-10-01': { 'start:noah': 5 }, '2026-10-10': { 'start:noah': 2, 'finish:noah': 1, 'start:noah:v1': 2, 'wrong:noah:v1:quiz': 3, 'start:noah:v1:quiz': 2 } }
    const b = { '2026-10-11': { 'start:noah': 1, 'replay:noah': 1, 'finish:noah:v1': 1, 'wrong:noah:v1:quiz': 1, 'finish:jonah:v1:story': 4 } }
    const c = { '2026-09-01': { 'start:noah': 9 } } // (outside the days asked)
    const s = summarize([a, b, c, {}], { from: fromDay(7, NOW) })
    expect(s.families).toBe(2)
    expect(s.islands.noah).toEqual({ start: 3, finish: 1, replay: 1, wrong: 4 })
    expect(s.visits['noah:v1']).toEqual({ start: 2, finish: 1, replay: 0, wrong: 0 })
    expect(s.activities['noah:v1:quiz']).toEqual({ start: 2, finish: 0, replay: 0, wrong: 4 })
    expect(s.kinds.story).toEqual({ start: 0, finish: 4, replay: 0, wrong: 0 })
    const page = summaryPage(s, { days: 7 })
    expect(page).toContain('<h1>Play totals</h1>')
    expect(page).toContain('2 families')
    expect(page).toMatch(/noah · v1 · quiz/)
  })
})

it('retires the old pooled totals (one file per day, for all families together)', async () => {
  const dir = join(folder(), 'stats')
  mkdirSync(dir)
  writeFileSync(join(dir, '2026-10-03.json'), '{"done:noah":1}')
  writeFileSync(join(dir, '2026-10-04.json'), '{"play-seconds":60}')
  expect(await retireOldStats(dir)).toBe(2)
  expect(existsSync(dir)).toBe(false)
  expect(await retireOldStats(dir)).toBe(0) // (already gone)
  // (anything else in the folder is left alone)
  mkdirSync(dir)
  writeFileSync(join(dir, 'notes.txt'), 'keep')
  await retireOldStats(dir)
  expect(readdirSync(dir)).toEqual(['notes.txt'])
})
