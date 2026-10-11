// Play totals (docs/GAME-PLAN.md §8, docs/legal/PRIVACY.md): only when a parent turns them on in the
// Parent Corner. A device sends counts per day, and they are added into that family's own file, next to
// its backups, recordings and songs: so the family's download includes them and deleting the family
// deletes them. Only counts, under names made of fixed words and the game's own island and activity ids:
//
//   <event>:<island>                 start | finish | replay
//   <event>:<island>:v<visit>        start | finish | replay
//   <event>:<island>:v<visit>:<kind> start | finish | replay | wrong (a question's wrong first try)
//
// e.g. "finish:noah:v2:quiz": 3. Nothing else is kept: no names, players, devices, answers or times of day.
// The site owner sees only sums across all families (summarize, summaryPage).
import { mkdir, readdir, readFile, rename, rm, rmdir, unlink, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

/** The game's islands (src/data/islands.ts ISLANDS; a test keeps the two the same). */
export const ISLANDS = [
  'noah', 'creation', 'david', 'jonah', 'loaves', 'christmas', 'abraham', 'joseph', 'red-sea', 'daniel',
  'baby-moses', 'burning-bush', 'manna', 'jericho', 'ruth', 'samuel', 'elijah', 'esther', 'boy-jesus',
  'fishers', 'storm', 'lost-sheep', 'samaritan', 'zacchaeus', 'palm-sunday', 'easter', 'pentecost',
]
/** The activities counted (every step kind but the pause between visits and the reward). Kept with src/lib/stats.ts. */
export const KINDS = [
  'story', 'pairs', 'practice', 'sequence', 'sort', 'quiz', 'count', 'trace', 'maze', 'verse', 'battle',
  'build', 'spot', 'paint', 'steer', 'rhythm', 'share', 'catch', 'song',
]
export const EVENTS = ['start', 'finish', 'replay', 'wrong']
/** How many days of totals are kept (about 13 months); older days are dropped. */
export const KEEP_DAYS = 400

const ISLAND_SET = new Set(ISLANDS)
const KIND_SET = new Set(KINDS)
const DAY = /^\d{4}-\d{2}-\d{2}$/
const DAY_MS = 24 * 3600_000
const MAX_N = 10_000 // (one device can't do anything 10,000 times in a day)
const MAX_KEYS = 2_000
const bad = () => Object.assign(new Error('bad stats'), { status: 400 })

/** Whether a count's name is one of the allowed shapes (above). */
export function validKey(k) {
  if (typeof k !== 'string' || k.length > 60) return false
  const [event, island, visit, kind, ...rest] = k.split(':')
  if (rest.length || !EVENTS.includes(event) || !ISLAND_SET.has(island)) return false
  if (visit === undefined) return event !== 'wrong'
  if (!/^v[1-9]$/.test(visit)) return false
  if (kind === undefined) return event !== 'wrong'
  return KIND_SET.has(kind)
}

export const dayOf = (t) => new Date(t).toISOString().slice(0, 10)
/** Whether `day` is a real date within the days kept (a day ahead is allowed: time zones). */
function validDay(day, now) {
  if (typeof day !== 'string' || !DAY.test(day)) return false
  const t = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(t) || dayOf(t) !== day) return false
  return t <= now + DAY_MS && day >= dayOf(now - (KEEP_DAYS - 1) * DAY_MS)
}

/**
 * One device's report: { day: 'YYYY-MM-DD', counts: { name: n } }. Throws (400) unless all of it is
 * well-formed: a count with any other name, or anything that isn't a whole number from 1 to 10,000, is refused.
 */
export function parseReport(text, now = Date.now()) {
  let data
  try { data = JSON.parse(text) } catch { throw bad() }
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some((k) => k !== 'day' && k !== 'counts')) throw bad()
  if (!validDay(data.day, now)) throw bad()
  const c = data.counts
  if (!c || typeof c !== 'object' || Array.isArray(c)) throw bad()
  const counts = Object.entries(c)
  if (counts.length > MAX_KEYS) throw bad()
  for (const [k, n] of counts) if (!validKey(k) || !Number.isInteger(n) || n < 1 || n > MAX_N) throw bad()
  return { day: data.day, counts: Object.fromEntries(counts) }
}

/** A family's play totals, kept in one small file: { days: { 'YYYY-MM-DD': { name: n } } }. */
export function createStats(file, { clock = () => Date.now() } = {}) {
  let writing = Promise.resolve() // (one change at a time)

  async function load() {
    let days = {}
    try { days = JSON.parse(await readFile(file, 'utf8')).days ?? {} } catch { /* none yet */ }
    // (only what's still well-formed, and no older than the days kept)
    const from = dayOf(clock() - (KEEP_DAYS - 1) * DAY_MS)
    const out = {}
    for (const [day, counts] of Object.entries(days)) {
      if (!DAY.test(day) || day < from || !counts || typeof counts !== 'object') continue
      const ok = Object.entries(counts).filter(([k, n]) => validKey(k) && Number.isInteger(n) && n > 0)
      if (ok.length) out[day] = Object.fromEntries(ok)
    }
    return out
  }
  const queue = (fn) => (writing = writing.catch(() => {}).then(fn))

  return {
    /** Adds one device's report (JSON text, see parseReport) into the family's totals. */
    add(text) {
      const { day, counts } = parseReport(text, clock())
      return queue(async () => {
        const days = await load()
        const total = (days[day] ??= {})
        for (const [k, n] of Object.entries(counts)) total[k] = (total[k] ?? 0) + n
        await mkdir(dirname(file), { recursive: true })
        await writeFile(`${file}.tmp`, JSON.stringify({ days }))
        await rename(`${file}.tmp`, file)
      })
    },
    /** The family's totals per day, oldest first: { 'YYYY-MM-DD': { name: n } }. */
    async get() {
      await writing.catch(() => {})
      const days = await load()
      return Object.fromEntries(Object.keys(days).sort().map((d) => [d, days[d]]))
    },
    /** Deletes all the family's totals. */
    clear() {
      return queue(() => unlink(file).catch((e) => { if (e.code !== 'ENOENT') throw e }))
    },
  }
}

/**
 * Sums of many families' totals (each as from get()), for the days from `from` on: per island, per visit
 * and per activity, plus how many families sent any. Only sums: nothing tells one family from another.
 * With fewer than `min` families sharing in the range, no sums are given at all (`hidden`), since with
 * one or two families the "sums" would show one family's play.
 */
export const MIN_FAMILIES = 5
export function summarize(all, { from = '0000-00-00', min = MIN_FAMILIES } = {}) {
  const sums = new Map()
  let families = 0
  for (const days of all) {
    let any = false
    for (const [day, counts] of Object.entries(days)) {
      if (day < from) continue
      for (const [k, n] of Object.entries(counts)) {
        if (!validKey(k)) continue
        sums.set(k, (sums.get(k) ?? 0) + n)
        any = true
      }
    }
    if (any) families++
  }
  const row = () => ({ start: 0, finish: 0, replay: 0, wrong: 0 })
  const islands = {}, visits = {}, activities = {}, kinds = {}
  for (const [k, n] of sums) {
    const [event, island, visit, kind] = k.split(':')
    if (!visit) (islands[island] ??= row())[event] += n
    else if (!kind) (visits[`${island}:${visit}`] ??= row())[event] += n
    else {
      (activities[`${island}:${visit}:${kind}`] ??= row())[event] += n
      ;(kinds[kind] ??= row())[event] += n
      // (an island's wrong first tries are those of its activities)
      if (event === 'wrong') (islands[island] ??= row()).wrong += n
    }
  }
  if (families < min) return { hidden: true, families: 0, islands: {}, visits: {}, activities: {}, kinds: {} }
  return { families, islands, visits, activities, kinds }
}

/** The first day of the last `days` days (for summarize's `from`). */
export const fromDay = (days, now = Date.now()) => dayOf(now - (days - 1) * DAY_MS)

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** The owner's summary page: plain tables of the sums. */
export function summaryPage(s, { days }) {
  const order = (keys) => keys.sort((a, b) => {
    const [ia, ...ra] = a.split(':'), [ib, ...rb] = b.split(':')
    return ISLANDS.indexOf(ia) - ISLANDS.indexOf(ib) || ra.join(':').localeCompare(rb.join(':'))
  })
  const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '-')
  const table = (title, label, rows, keys, { wrong = true, note = '' } = {}) => `
<h2>${esc(title)}</h2>${note ? `<p class="note">${esc(note)}</p>` : ''}
${keys.length ? `<div class="wrap"><table><thead><tr><th>${esc(label)}</th><th>Starts</th><th>Replays</th><th>Finishes</th><th>Finished</th>${wrong ? '<th>Wrong first tries</th>' : ''}</tr></thead><tbody>
${keys.map((k) => { const r = rows[k]; return `<tr><td>${esc(k.replaceAll(':', ' · '))}</td><td>${r.start}</td><td>${r.replay}</td><td>${r.finish}</td><td>${pct(r.finish, r.start)}</td>${wrong ? `<td>${r.wrong}</td>` : ''}</tr>` }).join('\n')}
</tbody></table></div>` : '<p class="note">Nothing yet.</p>'}`
  const name = (d) => (d === KEEP_DAYS ? 'all kept' : `${d} days`)
  const range = [7, 30, 90, KEEP_DAYS].map((d) => (d === days ? `<b>${name(d)}</b>` : `<a href="?days=${d}">${name(d)}</a>`)).join(' · ')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Play totals</title>
<style>
body{margin:0;padding:24px 16px 48px;font-family:system-ui,sans-serif;background:#fff;color:#2b2233;line-height:1.4}
main{max-width:960px;margin:0 auto}h1{margin:0 0 4px}h2{margin:32px 0 8px;font-size:20px}
.note{color:#6a5a7a;margin:4px 0 12px}.wrap{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;font-size:15px}
th,td{padding:6px 10px;border-bottom:1px solid #eadff0;text-align:right;white-space:nowrap}
th:first-child,td:first-child{text-align:left}th{background:#faf5fc}
a{color:#b0307a}summary{margin-top:32px;cursor:pointer;font-weight:700}
@media (prefers-color-scheme:dark){body{background:#1d1822;color:#eee6f2}.note{color:#b8a8c6}th{background:#2a2330}th,td{border-color:#3a3040}a{color:#ff8cc0}}
</style></head><body><main>
<h1>Play totals</h1>
${s.hidden
    ? `<p class="note">Fewer than ${MIN_FAMILIES} families share play totals in this range, so no sums are shown yet: with so few, they would show one family's play. Days: ${range}.</p>`
    : `<p class="note">Sums across every family that shares play totals (${s.families} families in this range). Days: ${range}.</p>`}
<p class="note">A replay is a start by a player who had already finished the island (it counts as a start too). Finished: finishes per start.</p>
${table('Islands', 'Island', s.islands, order(Object.keys(s.islands)), { note: 'Wrong first tries: all the island’s activities together.' })}
${table('Visits', 'Island · visit', s.visits, order(Object.keys(s.visits)), { wrong: false })}
${table('Activities, all islands', 'Activity', s.kinds, Object.keys(s.kinds).sort())}
<details><summary>Every activity on every island</summary>
${table('Activities', 'Island · visit · activity', s.activities, order(Object.keys(s.activities)))}
</details>
<p class="note"><a href="/">Back to Ark Pals</a></p>
</main></body></html>`
}

/** Whether this signed-in grown-up is the site's owner: a parent in the first family (the site's own). */
export const isOwner = (families, s) => !!s && s.family.id === families.firstFamily() && s.member.role === 'parent'

/**
 * Removes the old pooled play totals (STATE_DIRECTORY/stats, one file per day for all families together,
 * from before totals were kept per family). They can't be told apart by family, so they're retired, not
 * moved. Returns how many day files were removed.
 */
export async function retireOldStats(dir) {
  let files
  try { files = await readdir(dir) } catch { return 0 }
  let n = 0
  for (const f of files) {
    if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(f)) continue
    await rm(join(dir, f), { force: true })
    n++
  }
  await rmdir(dir).catch(() => {}) // (only if nothing else is in it)
  return n
}
