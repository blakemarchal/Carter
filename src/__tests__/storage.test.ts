// Moving saves from the game's first name to "ark-pals", and the birthday calendar.
import { describe, expect, it } from 'vitest'
import { migrateStorage, progressKey } from '../lib/storageKeys'
import { birthdaySpoken, daysUntil, isBirthday, ordinalWords, sleepsToGo } from '../lib/birthday'

class Fake {
  m = new Map<string, string>()
  constructor(init: Record<string, string> = {}) { for (const [k, v] of Object.entries(init)) this.m.set(k, v) }
  get length() { return this.m.size }
  key(i: number) { return [...this.m.keys()][i] ?? null }
  getItem(k: string) { return this.m.get(k) ?? null }
  setItem(k: string, v: string) { this.m.set(k, v) }
  removeItem(k: string) { this.m.delete(k) }
}

describe('migrateStorage', () => {
  it('moves every old key, and gives the bare old progress to the first player', () => {
    const index = JSON.stringify({ active: 'kid', list: [{ id: 'kid', name: 'K', emoji: '🌈' }, { id: 'grownup', name: 'G', emoji: '🧪' }] })
    const s = new Fake({
      'carters-ark:profiles': index,
      'carters-ark:v1': '{"islandsDone":["noah","creation"]}',
      'carters-ark:v1:grownup': '{"islandsDone":[]}',
      'carters-ark-backup:device': 'abc123',
      'carters-ark-backup:last': '2026-10-03T00:00:00Z',
      'something-else': 'untouched',
    })
    expect(migrateStorage(s)).toBe(5)
    // The first player keeps the look the game drew them with; the others pick theirs later.
    const moved = JSON.parse(index)
    moved.list[0].look = { skin: 'light', hair: 'ponytail', hairColor: '#7a4a24', color: '#ff8cc0' }
    expect(Object.fromEntries(s.m)).toEqual({
      'ark-pals:profiles': JSON.stringify(moved),
      [progressKey('kid')]: '{"islandsDone":["noah","creation"]}',
      [progressKey('grownup')]: '{"islandsDone":[]}',
      'ark-pals-backup:device': 'abc123',
      'ark-pals-backup:last': '2026-10-03T00:00:00Z',
      'something-else': 'untouched',
    })
    expect(migrateStorage(s)).toBe(0) // nothing left to do
  })

  it('never overwrites something already saved under the new name', () => {
    const s = new Fake({ 'carters-ark:v1:a': 'old', 'ark-pals:v1:a': 'newer' })
    migrateStorage(s)
    expect(s.getItem('ark-pals:v1:a')).toBe('newer')
    expect(s.getItem('carters-ark:v1:a')).toBeNull()
  })

  it('progress from before there were players goes to a new "player"', () => {
    const s = new Fake({ 'carters-ark:v1': '{"pals":{}}' })
    migrateStorage(s)
    expect(s.getItem(progressKey('player'))).toBe('{"pals":{}}')
  })

  it('keeps the old copy if the new one can’t be saved', () => {
    const s = new Fake({ 'carters-ark:v1:a': 'x' })
    s.setItem = () => { throw new Error('full') }
    migrateStorage(s)
    expect(s.getItem('carters-ark:v1:a')).toBe('x')
  })
})

describe('birthdays', () => {
  const at = (y: number, m: number, d: number) => new Date(y, m - 1, d, 15, 30)
  it('counts the sleeps to go, and the day itself is 0', () => {
    const b = { month: 1, day: 8 }
    expect(daysUntil(b, at(2027, 1, 8))).toBe(0)
    expect(isBirthday(b, at(2027, 1, 8))).toBe(true)
    expect(daysUntil(b, at(2027, 1, 5))).toBe(3)
    expect(sleepsToGo(b, at(2027, 1, 5))).toBe(3)
    expect(sleepsToGo(b, at(2026, 12, 31))).toBe(0) // more than a week away
    expect(daysUntil(b, at(2027, 1, 9))).toBe(364) // just missed it: next year
  })
  it('a leap-day birthday is celebrated on Feb 28 in other years', () => {
    const b = { month: 2, day: 29 }
    expect(isBirthday(b, at(2027, 2, 28))).toBe(true)
    expect(isBirthday(b, at(2028, 2, 29))).toBe(true)
    expect(isBirthday(b, at(2028, 2, 28))).toBe(false)
  })
  it('says dates the way people do', () => {
    expect(birthdaySpoken({ month: 1, day: 8 })).toBe('January eighth')
    expect(ordinalWords(21)).toBe('twenty-first')
    expect(ordinalWords(30)).toBe('thirtieth')
    expect(ordinalWords(12)).toBe('twelfth')
  })
})
