// Play totals, to make the game better: only when a grown-up turns them on in the Parent Corner.
// Counts collect on the device ("done:noah", "quit:noah:3", "stars:noah:3", play seconds) and go to
// our own server, never anyone else's, which only adds them up per day. Nothing personal is ever
// counted: no names, players, devices, answers or times of day. See docs/GAME-PLAN.md §8.
import { NS } from './storageKeys'
import { today } from './progress'

const ON = `${NS}:stats-on`
const KEY = `${NS}:stats`
type Pending = Record<string, Record<string, number>> // day -> name -> count

function read(): Pending {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Pending } catch { return {} }
}
function write(p: Pending) {
  try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* storage full: drop them */ }
}

/** Whether this device shares play totals (off unless a grown-up turns it on). */
export function statsOn() {
  try { return localStorage.getItem(ON) === '1' } catch { return false }
}

export function setStatsOn(on: boolean) {
  try {
    if (on) localStorage.setItem(ON, '1')
    else { localStorage.removeItem(ON); localStorage.removeItem(KEY) }
  } catch { /* ignore */ }
}

let timer: ReturnType<typeof setTimeout> | null = null

/** Counts something that happened (names are lowercase words and ids joined by ":"). */
export function count(name: string, n = 1) {
  if (!statsOn() || !/^[a-z0-9:-]{1,80}$/.test(name) || n <= 0) return
  const p = read()
  const day = (p[today()] ??= {})
  day[name] = (day[name] ?? 0) + Math.round(n)
  write(p)
  if (!timer) timer = setTimeout(() => { timer = null; flushStats() }, 60_000)
}

/** Sends what's collected to our server; whatever doesn't go through waits for next time. */
export async function flushStats() {
  if (!statsOn()) return
  const p = read()
  for (const [day, counts] of Object.entries(p)) {
    try {
      const r = await fetch('/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ day, counts }) })
      if (!r.ok) return
      // Take off what was sent (anything counted meanwhile stays for next time).
      const now = read()
      for (const [k, n] of Object.entries(counts)) {
        const left = (now[day]?.[k] ?? 0) - n
        if (now[day]) { if (left > 0) now[day][k] = left; else delete now[day][k] }
      }
      if (now[day] && !Object.keys(now[day]).length) delete now[day]
      write(now)
    } catch {
      return // offline: try again later
    }
  }
}
