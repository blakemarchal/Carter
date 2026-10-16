// The weekly parent email (server/weekly.mjs): the week's summary from a family's backups, the email itself, when
// it goes, and that it goes once per grown-up per week, only for a week with play.
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { childLines, createMarks, createWeekly, dayOf, isSendTime, playersIn, stopToken, weekOf, weekSummary, weeklyEmail } from './weekly.mjs'

const NOW = Date.UTC(2026, 9, 18, 22, 30) // Sunday, Oct 18, 2026, 22:30 UTC
const DAY = 86400_000
const content = {
  islands: [
    { id: 'noah', name: "Noah's Ark", verse: { text: 'I set my rainbow in the cloud.', ref: 'Genesis 9:13' }, think: [{ ask: 'Why did Noah build the big boat?', why: 'Noah trusted God.' }], bigWords: [{ word: 'obey', means: 'Obey means doing what you are told.' }], science: { title: 'Rainbows', fact: 'Sunlight is made of many colors.', tryIt: 'Spray water in the sun.' } },
    { id: 'creation', name: 'Creation', think: [], bigWords: [] },
  ],
}
const keys = (players) => {
  const out = { 'ark-pals:profiles': JSON.stringify({ active: players[0]?.id, list: players.map(({ id, name, emoji }) => ({ id, name, emoji })) }) }
  for (const p of players) out[`ark-pals:v1:${p.id}`] = JSON.stringify(p.progress)
  return out
}
const backup = (daysAgo, device, players) => ({ savedAt: new Date(NOW - daysAgo * DAY).toISOString(), device, keys: keys(players) })
const log = (entries) => Object.fromEntries(entries.map(([daysAgo, secs, right, tries]) => [dayOf(NOW - daysAgo * DAY), { secs, right, tries }]))

const carterNow = { id: 'c1', name: 'Carter', emoji: '🦄', progress: {
  islandsDone: ['noah', 'creation'], mapAt: 'creation', skills: { reading: 5, numbers: 3 }, pals: { zippy: 20, pip: 0 },
  log: log([[0, 600, 10, 12], [2, 1200, 15, 15], [9, 3000, 1, 9]]), remember: { 'verse:noah': { box: 2, due: '2026-10-20' }, 'word:the': { box: 0, due: '2026-10-19' } },
  rememberDay: dayOf(NOW - DAY), bookSeen: ['sheep', 'dove'],
} }
const carterThen = { ...carterNow, progress: { ...carterNow.progress, islandsDone: ['noah'], skills: { reading: 4, numbers: 3 }, log: log([[9, 3000, 1, 9]]) } }
const sam = { id: 's1', name: 'Sam', emoji: '🐸', progress: { islandsDone: [], skills: { reading: 1, numbers: 1 }, pals: { zippy: 0 }, log: {} } }

describe('the week’s summary', () => {
  it('reads the players out of a backup', () => {
    const ps = playersIn(backup(0, 'ipad', [carterNow, sam]))
    expect(ps.map((p) => p.name)).toEqual(['Carter', 'Sam'])
    expect(ps[0].progress.islandsDone).toEqual(['noah', 'creation'])
    expect(playersIn({ keys: {} })).toEqual([])
  })

  it('sums the week’s play, finds what was finished and the levels that went up since the week before', () => {
    const s = weekSummary([backup(0, 'ipad', [carterNow, sam]), backup(8, 'ipad', [carterThen, sam])], { now: NOW, content })
    expect(s.played).toBe(true)
    const c = s.children.find((x) => x.name === 'Carter')
    expect(c).toMatchObject({ minutes: 30, daysPlayed: 2, right: 25, tries: 27, islandsDone: 2, finished: ['creation'], current: 'creation', remembered: 1, remembering: 2, playedRemember: true, animals: 2, pals: 2 })
    expect(c.levelUps).toEqual([{ skill: 'reading', from: 4, to: 5 }])
    const sam2 = s.children.find((x) => x.name === 'Sam')
    expect(sam2).toMatchObject({ minutes: 0, daysPlayed: 0, finished: [] })
    expect(s.talk?.id).toBe('creation')
  })

  it('with no backup from before the week, nothing counts as finished this week; the talk is where the boat is', () => {
    const s = weekSummary([backup(1, 'ipad', [carterNow])], { now: NOW, content })
    expect(s.children[0].finished).toEqual([])
    expect(s.children[0].levelUps).toEqual([])
    expect(s.talk?.id).toBe('creation')
  })

  it('counts a child on two devices once (the device with more play), and a quiet week as no play', () => {
    const laptop = { ...carterNow, id: 'c9', progress: { ...carterNow.progress, log: log([[1, 60, 1, 1]]) } }
    const s = weekSummary([backup(0, 'ipad', [carterNow]), backup(0, 'laptop', [laptop])], { now: NOW, content })
    expect(s.children).toHaveLength(1)
    expect(s.children[0].minutes).toBe(30)
    const quiet = weekSummary([backup(0, 'ipad', [sam])], { now: NOW, content })
    expect(quiet.played).toBe(false)
    expect(weekSummary([], { now: NOW, content })).toMatchObject({ children: [], played: false, talk: null })
  })
})

describe('the email', () => {
  it('says each child’s week in a few lines, and gives something to talk about', () => {
    const s = weekSummary([backup(0, 'ipad', [carterNow, sam]), backup(8, 'ipad', [carterThen, sam])], { now: NOW, content })
    const lines = childLines(s.children[0], content)
    expect(lines[0]).toBe('Played 2 days this week, about 30 minutes, and got 25 of 27 answers right the first time.')
    expect(lines[1]).toBe('Finished Creation. That makes 2 islands in all.')
    expect(lines[2]).toBe('Reading level 5, Numbers level 3. Reading went up from 4 to 5!')
    expect(lines[3]).toBe('Remember? round: played this week, 1 of 2 things remembered well.')
    expect(lines[4]).toBe('Animal Book: 2 cards opened.')
    expect(childLines(s.children[1], content)[0]).toBe('Didn’t play this week.')
    const e = weeklyEmail({ summary: s, family: 'The Marchals', content, site: 'https://arkpals.world', stopLink: 'https://arkpals.world/weekly/stop?m=m1&t=abc' })
    expect(e.subject).toBe('This week on Ark Pals: The Marchals')
    expect(e.text).toContain('🦄 Carter')
    expect(e.text).toContain('Talk about Creation this week')
    expect(e.html).toContain('Stop these emails')
    expect(e.html).toContain('https://arkpals.world/weekly/stop?m=m1&amp;t=abc')
    // (the island to talk about has its verse, a question with its answer, big words and the thing to try)
    const noah = weekSummary([backup(0, 'ipad', [{ ...carterNow, progress: { ...carterNow.progress, islandsDone: ['noah'], mapAt: 'noah' } }])], { now: NOW, content })
    const t = weeklyEmail({ summary: noah, family: 'F', content, site: 'https://x', stopLink: 'https://x/stop' }).text
    expect(t).toContain('Memory verse: “I set my rainbow in the cloud.” (Genesis 9:13)')
    expect(t).toContain('Ask at dinner: Why did Noah build the big boat? (Noah trusted God.)')
    expect(t).toContain('Big words: obey (Obey means doing what you are told).')
    expect(t).toContain('Try it at home (Rainbows): Spray water in the sun.')
  })
})

describe('when it goes', () => {
  it('on Sunday at or after the hour (UTC), and each week has one date', () => {
    expect(isSendTime(NOW)).toBe(true)
    expect(isSendTime(Date.UTC(2026, 9, 18, 21, 59))).toBe(false)
    expect(isSendTime(Date.UTC(2026, 9, 19, 23))).toBe(false)
    expect(isSendTime(Date.UTC(2026, 9, 18, 9), { hour: 8 })).toBe(true)
    expect(weekOf(NOW)).toBe('2026-10-18')
    expect(weekOf(Date.UTC(2026, 9, 24, 12))).toBe('2026-10-18')
    expect(weekOf(Date.UTC(2026, 9, 25, 12))).toBe('2026-10-25')
    expect(stopToken('s', 'm1')).toBe(stopToken('s', 'm1'))
    expect(stopToken('s', 'm1')).not.toBe(stopToken('t', 'm1'))
    expect(stopToken('s', 'm1')).toHaveLength(24)
  })

  it('sends once per grown-up per week, to those who want it, and skips a family with no play', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'arkpals-weekly-'))
    const sent = []
    const mailer = { send: async (m) => { sent.push(m) } }
    const backupsOf = (list) => ({ list: async () => list.map((b, i) => ({ id: `b${i}`, savedAt: b.savedAt, device: b.device })), get: async (id) => JSON.stringify(list[Number(id.slice(1))]) })
    const stores = {
      f1: { backups: backupsOf([backup(0, 'ipad', [carterNow]), backup(8, 'ipad', [carterThen])]), weekly: createMarks(join(dir, 'f1', 'weekly-sent.json')) },
      f2: { backups: backupsOf([backup(0, 'ipad', [sam])]), weekly: createMarks(join(dir, 'f2', 'weekly-sent.json')) },
    }
    const families = { weeklyRecipients: () => [
      { familyId: 'f1', familyName: 'The Marchals', memberId: 'm1', name: 'Dad', email: 'dad@example.com' },
      { familyId: 'f1', familyName: 'The Marchals', memberId: 'm2', name: 'Mom', email: 'mom@example.com' },
      { familyId: 'f2', familyName: 'Quiet', memberId: 'm3', name: 'Gran', email: 'gran@example.com' },
    ] }
    const w = createWeekly({ families, storesFor: (id) => stores[id], mailer, content, site: 'https://arkpals.world', secret: 'sec', log: () => {} })
    expect(await w.tick(Date.UTC(2026, 9, 18, 12))).toBe(0) // (too early on Sunday)
    expect(await w.tick(NOW)).toBe(2)
    expect(sent.map((m) => m.to).sort()).toEqual(['dad@example.com', 'mom@example.com'])
    expect(sent[0].subject).toBe('This week on Ark Pals: The Marchals')
    expect(sent[0].html).toContain(`/weekly/stop?m=m1&amp;t=${stopToken('sec', 'm1')}`)
    expect(await w.tick(NOW + 3600_000)).toBe(0) // (the same week again: nothing more)
    expect(await stores.f2.weekly.get('m3')).toBe('2026-10-18') // (the quiet family was marked too, not emailed)
    const p = await w.preview('f1', 'The Marchals', 'm1')
    expect(p.summary.children[0].name).toBe('Carter')
    expect(p.email.text).toContain('Carter')
    // (no mailer: nothing goes, nothing is marked)
    const w2 = createWeekly({ families, storesFor: (id) => stores[id], mailer: null, content, site: () => 'https://later', secret: 's' })
    expect(await w2.tick(NOW + 7 * DAY)).toBe(0)
    expect(await stores.f1.weekly.get('m1')).toBe('2026-10-18')
    // (the site can be learned later: it's asked for when the email is made)
    expect((await w2.preview('f1', 'F', 'm1')).email.text).toContain('https://later/weekly/stop?m=m1&t=')
  })
})
