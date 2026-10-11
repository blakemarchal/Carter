// Play totals on the device: nothing counted until a parent turns them on, only allowed names, the
// right counts for an island's steps, and the same names and lists as the server (server/stats.mjs).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Step } from '../data/islands'
import { ISLANDS, loadAllIslands } from '../data/islands'
// @ts-expect-error (the server is plain JavaScript, without types)
import * as server from '../../server/stats.mjs'

// (loaded once up front: every island's content, and the module itself, which reads storage only when asked)
const LOADED = await loadAllIslands()
const mod = await import('../lib/stats')

let store: Map<string, string>
beforeEach(() => {
  store = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k), key: (i: number) => [...store.keys()][i] ?? null,
    get length() { return store.size },
  })
  vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] })
  vi.setSystemTime(new Date(2026, 9, 11, 10))
})
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

const stats = async () => mod
const steps = (...kinds: string[]) => kinds.map((kind) => ({ kind })) as Step[]

describe('play totals on the device', () => {
  it('counts nothing until a parent turns them on, and drops what’s unsent when turned off', async () => {
    const s = await stats()
    s.count('start:noah')
    expect(s.pendingStats()).toEqual({})
    expect(s.statsOn()).toBe(false)
    s.setStatsOn(true)
    s.count('start:noah')
    s.count('start:noah')
    expect(s.pendingStats()).toEqual({ '2026-10-11': { 'start:noah': 2 } })
    s.setStatsOn(false)
    expect(s.pendingStats()).toEqual({})
    expect([...store.keys()]).toEqual([])
  })

  it('the first version’s switch doesn’t carry over (it counted other things)', async () => {
    store.set('ark-pals:stats-on', '1')
    store.set('ark-pals:stats', JSON.stringify({ '2026-10-10': { 'done:noah': 1, 'play-seconds': 30 } }))
    const s = await stats()
    expect(s.statsOn()).toBe(false)
    await s.flushStats()
    expect(store.has('ark-pals:stats-on')).toBe(false)
    expect(store.has('ark-pals:stats')).toBe(false)
  })

  it('only allowed names are ever counted', async () => {
    const s = await stats()
    s.setStatsOn(true)
    for (const k of ['start:robin', 'Name: Robin', 'done:noah', 'quit:noah:3', 'wrong:noah', 'start:noah:v0', 'start:noah:v1:pause', 'start:noah:v1:Robin', 'start:noah:v1:toString'])
      s.count(k)
    expect(s.pendingStats()).toEqual({})
    // (and anything odd that got into storage is never sent)
    store.set('ark-pals-totals:pending', JSON.stringify({ '2026-10-11': { 'start:noah': 1, 'name:robin': 3, 'finish:noah': 1.5 }, 'Robin': { 'start:noah': 1 } }))
    expect(s.pendingStats()).toEqual({ '2026-10-11': { 'start:noah': 1 } })
  })

  it('counts an island’s starts, finishes, replays and wrong first tries per island, visit and activity', async () => {
    const s = await stats()
    s.setStatsOn(true)
    const isl = steps('story', 'quiz', 'pause', 'maze', 'battle', 'reward')
    for (let i = 0; i < isl.length; i++) {
      s.stepStarted('noah', isl, i, false)
      if (i === 1) { s.wrongFirstTry('noah', isl, i); s.wrongFirstTry('noah', isl, i) }
      s.stepFinished('noah', isl, i)
    }
    s.islandFinished('noah')
    // (another player, who had finished it already, replays the second visit's first activity)
    s.stepStarted('noah', isl, 3, true)
    expect(s.pendingStats()['2026-10-11']).toEqual({
      'start:noah': 1, 'finish:noah': 1,
      'start:noah:v1': 1, 'finish:noah:v1': 1, 'start:noah:v2': 2, 'replay:noah:v2': 1, 'finish:noah:v2': 1,
      'start:noah:v1:story': 1, 'finish:noah:v1:story': 1, 'start:noah:v1:quiz': 1, 'finish:noah:v1:quiz': 1, 'wrong:noah:v1:quiz': 2,
      'start:noah:v2:maze': 2, 'replay:noah:v2:maze': 1, 'finish:noah:v2:maze': 1, 'start:noah:v2:battle': 1, 'finish:noah:v2:battle': 1,
    })
    for (const k of Object.keys(s.pendingStats()['2026-10-11'])) expect(server.validKey(k), k).toBe(true)
  })

  it('sends each day, and keeps what didn’t go through for next time', async () => {
    const s = await stats()
    s.setStatsOn(true)
    s.count('start:noah')
    const sent: unknown[] = []
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init: RequestInit) => { sent.push(JSON.parse(String(init.body))); return { ok: false, status: 503 } }))
    await s.flushStats()
    expect(s.pendingStats()).toEqual({ '2026-10-11': { 'start:noah': 1 } })
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init: RequestInit) => { sent.push(JSON.parse(String(init.body))); return { ok: true, status: 204 } }))
    await s.flushStats()
    expect(s.pendingStats()).toEqual({})
    expect(sent[1]).toEqual({ day: '2026-10-11', counts: { 'start:noah': 1 } })
    expect(() => server.parseReport(JSON.stringify(sent[1]), Date.UTC(2026, 9, 11, 12))).not.toThrow()
  })

  it('isn’t part of a backup', async () => {
    const { TOTALS_PREFIX } = await import('../lib/storageKeys')
    const s = await stats()
    s.setStatsOn(true)
    s.count('start:noah')
    expect([...store.keys()].every((k) => k.startsWith(TOTALS_PREFIX))).toBe(true)
  })
})

describe('the same names on the device and the server', () => {
  it('the same islands', () => {
    expect([...server.ISLANDS].sort()).toEqual(ISLANDS.map((i) => i.id).sort())
  })
  it('the same activity kinds, and every kind the islands use', async () => {
    const { COUNTED_KINDS } = await stats()
    expect([...server.KINDS].sort()).toEqual([...COUNTED_KINDS].sort())
    const used = new Set(LOADED.flatMap((i) => i.steps.map((st) => st.kind)))
    for (const k of used) if (k !== 'pause' && k !== 'reward') expect(COUNTED_KINDS).toContain(k)
    // (and no island has more visits than a name can say)
    for (const i of LOADED) expect(i.steps.filter((st) => st.kind === 'pause').length).toBeLessThan(9)
  })
})
