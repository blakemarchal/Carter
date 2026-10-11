// Play totals, to make the game better: only when a parent turns them on in the Parent Corner (per
// device, off until then). Counts collect on the device and go to our own server, never anyone else's,
// where they're added into the family's own data (server/stats.mjs; the family's download and delete
// cover them). Only these counts, per day, under names made of fixed words and the game's own ids:
//
//   <event>:<island>                 start | finish | replay   (a whole island)
//   <event>:<island>:v<visit>        start | finish | replay   (one visit of it)
//   <event>:<island>:v<visit>:<kind> start | finish | replay | wrong   (one activity, by its kind)
//
// "replay": a start by a player who had already finished the island (also counted as a start).
// "wrong": a question answered wrong the first time. No names, players, devices, answers or times of day.
// See docs/GAME-PLAN.md §8 and docs/legal/PRIVACY.md.
import { ISLANDS } from '../data/islands'
import type { Step } from '../data/islands'
import { NS, TOTALS_PREFIX } from './storageKeys'
import { today } from './progress'

/** Not part of a backup (lib/backup.ts): whether this device shares, and what's waiting to be sent. */
const ON = `${TOTALS_PREFIX}on`
const PENDING = `${TOTALS_PREFIX}pending`
/** (the first version's keys: it counted other things, so its "on" doesn't carry over) */
const OLD = [`${NS}:stats-on`, `${NS}:stats`]

type Kind = Exclude<Step['kind'], 'pause' | 'reward'>
// (every activity kind: TypeScript insists a new kind is added here, and a test keeps the server's list the same)
const KIND_SET: Record<Kind, true> = {
  story: true, pairs: true, practice: true, sequence: true, sort: true, quiz: true, count: true, trace: true, maze: true,
  verse: true, battle: true, build: true, spot: true, paint: true, steer: true, rhythm: true, share: true, catch: true, song: true,
}
export const COUNTED_KINDS = Object.keys(KIND_SET) as Kind[]
const EVENTS = ['start', 'finish', 'replay', 'wrong']
const ISLAND_IDS = new Set(ISLANDS.map((i) => i.id))
/** How many days of counts wait on the device while it can't reach the server. */
const PENDING_DAYS = 60

/** Whether a count's name is one of the allowed shapes (above): anything else is never counted or sent. */
export function validKey(k: string) {
  if (k.length > 60) return false
  const [event, island, visit, kind, ...rest] = k.split(':')
  if (rest.length || !EVENTS.includes(event) || !ISLAND_IDS.has(island)) return false
  if (visit === undefined) return event !== 'wrong'
  if (!/^v[1-9]$/.test(visit)) return false
  if (kind === undefined) return event !== 'wrong'
  return Object.hasOwn(KIND_SET, kind)
}

type Pending = Record<string, Record<string, number>> // day -> name -> count

function read(): Pending {
  try {
    const raw = JSON.parse(localStorage.getItem(PENDING) ?? '{}') as Pending
    const out: Pending = {}
    for (const [day, counts] of Object.entries(raw ?? {})) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !counts || typeof counts !== 'object') continue
      const ok = Object.entries(counts).filter(([k, n]) => validKey(k) && Number.isInteger(n) && n > 0)
      if (ok.length) out[day] = Object.fromEntries(ok)
    }
    return out
  } catch { return {} }
}
function write(p: Pending) {
  for (const d of Object.keys(p).sort().slice(0, -PENDING_DAYS)) delete p[d]
  try { localStorage.setItem(PENDING, JSON.stringify(p)) } catch { /* storage full: drop them */ }
}

function forgetOld() {
  try { for (const k of OLD) localStorage.removeItem(k) } catch { /* ignore */ }
}

/** Whether this device shares play totals (off unless a parent turns it on). */
export function statsOn() {
  try { return localStorage.getItem(ON) === '1' } catch { return false }
}

/** Turns sharing on or off for this device; off also drops anything not sent yet. */
export function setStatsOn(on: boolean) {
  forgetOld()
  try {
    if (on) localStorage.setItem(ON, '1')
    else { localStorage.removeItem(ON); localStorage.removeItem(PENDING) }
  } catch { /* ignore */ }
}

let timer: ReturnType<typeof setTimeout> | null = null

/** Counts one thing that happened (only when sharing is on, and only an allowed name). */
export function count(name: string) {
  if (!statsOn() || !validKey(name)) return
  const p = read()
  const day = (p[today()] ??= {})
  day[name] = Math.min((day[name] ?? 0) + 1, 10_000)
  write(p)
  if (!timer) timer = setTimeout(() => { timer = null; flushStats() }, 60_000)
}

/** What's counted and not sent yet (for tests and the curious). */
export const pendingStats = () => read()

// ---- what an island counts (IslandScreen) ----

const isActivity = (s: Step | undefined): s is Step & { kind: Kind } => !!s && Object.hasOwn(KIND_SET, s.kind)
/** Which visit (1, 2, 3…) a step is in: one more than the pauses before it. */
export function visitOf(steps: Step[], step: number) {
  let v = 1
  for (let i = 0; i < step && i < steps.length; i++) if (steps[i].kind === 'pause') v++
  return Math.min(v, 9)
}

/** A step begins: its activity; the visit, if it's the visit's first step; the island, if it's the first step. */
export function stepStarted(island: string, steps: Step[], step: number, replay: boolean) {
  const s = steps[step]
  if (!isActivity(s)) return
  const v = `v${visitOf(steps, step)}`
  const names = [`${island}:${v}:${s.kind}`]
  if (step === 0 || steps[step - 1]?.kind === 'pause') names.push(`${island}:${v}`)
  if (step === 0) names.push(island)
  for (const n of names) {
    count(`start:${n}`)
    if (replay) count(`replay:${n}`)
  }
}

/** A step is done: its activity, and the visit if a pause or the reward comes next. */
export function stepFinished(island: string, steps: Step[], step: number) {
  const s = steps[step]
  if (!isActivity(s)) return
  const v = `v${visitOf(steps, step)}`
  count(`finish:${island}:${v}:${s.kind}`)
  const next = steps[step + 1]?.kind
  if (next === 'pause' || next === 'reward') count(`finish:${island}:${v}`)
}

/** The island is finished (its reward reached). */
export const islandFinished = (island: string) => count(`finish:${island}`)

/** A question in this step was answered wrong the first time. */
export function wrongFirstTry(island: string, steps: Step[], step: number) {
  const s = steps[step]
  if (isActivity(s)) count(`wrong:${island}:v${visitOf(steps, step)}:${s.kind}`)
}

/** Sends what's collected to our server; whatever doesn't go through waits for next time. */
export async function flushStats() {
  forgetOld()
  if (!statsOn()) return
  const p = read()
  for (const [day, counts] of Object.entries(p)) {
    let r: Response
    try {
      r = await fetch('/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ day, counts }) })
    } catch {
      return // offline: try again later
    }
    // (400: the server will never take it, e.g. too old; any other failure: try again later)
    if (!r.ok && r.status !== 400) return
    // Take off what was sent (anything counted meanwhile stays for next time).
    const now = read()
    for (const [k, n] of Object.entries(counts)) {
      const left = (now[day]?.[k] ?? 0) - n
      if (now[day]) { if (left > 0) now[day][k] = left; else delete now[day][k] }
    }
    if (now[day] && !Object.keys(now[day]).length) delete now[day]
    write(now)
  }
}

/** Deletes the family's play totals on the server (parents). */
export async function deleteFamilyStats() {
  const r = await fetch('/stats', { method: 'DELETE' })
  if (!r.ok) throw new Error(`DELETE /stats: ${r.status}`)
}
