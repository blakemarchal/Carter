// The family's plan on the device: never blocks while plans aren't enforced; when they are, the game asks
// the server when online and keeps playing for 7 days offline after its last good answer. The days match
// the server's (server/billing.mjs).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkAccess, decideAccess, dollars, OFFLINE_DAYS, savedCheck } from '../lib/billing'
// @ts-expect-error (the server is plain JavaScript, without types)
import * as server from '../../server/billing.mjs'

const DAY = 24 * 3600_000
const NOW = new Date(2026, 9, 11, 10).getTime()

let store: Map<string, string>
beforeEach(() => {
  store = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k), key: (i: number) => [...store.keys()][i] ?? null,
    get length() { return store.size },
  })
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
})
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

const answer = (body: unknown, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), { status }))

describe('who may play, on the device', () => {
  it('never blocks while plans aren’t enforced, however long it has been offline', () => {
    expect(decideAccess({ allowed: true, enforced: false, checkedAt: NOW - 400 * DAY }, NOW)).toEqual({ allowed: true })
    expect(decideAccess({ allowed: false, enforced: false, checkedAt: NOW - DAY }, NOW)).toEqual({ allowed: true })
  })

  it('never blocks a device that has never been able to ask', () => {
    expect(decideAccess(null, NOW)).toEqual({ allowed: true })
  })

  it('enforced: a family with a plan plays, one without rests', () => {
    expect(decideAccess({ allowed: true, enforced: true, checkedAt: NOW }, NOW)).toEqual({ allowed: true })
    expect(decideAccess({ allowed: false, enforced: true, checkedAt: NOW }, NOW)).toEqual({ allowed: false, why: 'no-plan' })
  })

  it('keeps playing for 7 days offline after the last good answer, then asks to go online', () => {
    const last = { allowed: true, enforced: true, checkedAt: NOW }
    expect(OFFLINE_DAYS).toBe(7)
    expect(OFFLINE_DAYS).toBe(server.OFFLINE_DAYS)
    expect(decideAccess(last, NOW + 6 * DAY)).toEqual({ allowed: true })
    expect(decideAccess(last, NOW + 7 * DAY)).toEqual({ allowed: true })
    expect(decideAccess(last, NOW + 7 * DAY + 60_000)).toEqual({ allowed: false, why: 'offline-too-long' })
    expect(decideAccess(last, NOW - DAY)).toEqual({ allowed: true }) // (the clock went back)
  })

  it('an answer from the server is kept on the device; no answer leaves the last one', async () => {
    vi.stubGlobal('fetch', answer({ allowed: true, enforced: true, checkedAt: 1 }))
    expect(await checkAccess()).toEqual({ allowed: true, enforced: true, checkedAt: NOW })
    expect(savedCheck()).toEqual({ allowed: true, enforced: true, checkedAt: NOW })

    vi.setSystemTime(NOW + 3 * DAY)
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('offline') }))
    expect(await checkAccess()).toBeNull()
    vi.stubGlobal('fetch', answer({}, 401)) // (signed out: as if offline)
    expect(await checkAccess()).toBeNull()
    vi.stubGlobal('fetch', answer({}, 502))
    expect(await checkAccess()).toBeNull()
    expect(savedCheck()?.checkedAt).toBe(NOW)
    expect(decideAccess(savedCheck(), Date.now())).toEqual({ allowed: true })
    vi.setSystemTime(NOW + 8 * DAY)
    expect(decideAccess(savedCheck(), Date.now())).toEqual({ allowed: false, why: 'offline-too-long' })

    // (back online: open again)
    vi.stubGlobal('fetch', answer({ allowed: true, enforced: true }))
    await checkAccess()
    expect(decideAccess(savedCheck(), Date.now())).toEqual({ allowed: true })
  })

  it('a plan that ends closes the game at the next check, and choosing one opens it', async () => {
    vi.stubGlobal('fetch', answer({ allowed: false, enforced: true }))
    await checkAccess()
    expect(decideAccess(savedCheck(), Date.now())).toEqual({ allowed: false, why: 'no-plan' })
    vi.stubGlobal('fetch', answer({ allowed: true, enforced: true }))
    await checkAccess()
    expect(decideAccess(savedCheck(), Date.now())).toEqual({ allowed: true })
  })

  it('ignores a saved answer that isn’t one', () => {
    store.set('ark-pals-billing:access', '{"allowed":"yes"}')
    expect(savedCheck()).toBeNull()
    store.set('ark-pals-billing:access', 'not json')
    expect(savedCheck()).toBeNull()
  })
})

it('shows prices the way people say them', () => {
  expect(dollars(999)).toBe('$9.99')
  expect(dollars(7900)).toBe('$79')
  expect(dollars(658)).toBe('$6.58')
  expect(server.PLANS['family-yearly'].amount).toBe(7900)
})
