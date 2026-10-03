// Play totals, to make the game better (a grown-up turns them on in the Parent Corner). Only counts
// arrive: how often each island is started, finished or left part-way, the stars earned, minutes
// played. No names, players, devices, answers or times of day. Kept in STATE_DIRECTORY/stats as one
// file of totals per day.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DAY = /^\d{4}-\d{2}-\d{2}$/
const KEY = /^[a-z0-9:-]{1,80}$/
const bad = (status) => Object.assign(new Error('bad stats'), { status })

export function createStats(dir) {
  const ready = mkdir(dir, { recursive: true })
  ready.catch((e) => console.error(`Stats folder ${dir} unavailable: ${e.message}`))
  let writing = Promise.resolve() // one day file is written at a time

  return {
    /** Adds one device's counts for a day: { day: 'YYYY-MM-DD', counts: { 'done:noah': 1, … } }. */
    add(text) {
      let data
      try { data = JSON.parse(text) } catch { throw bad(400) }
      if (!DAY.test(data?.day ?? '')) throw bad(400)
      const counts = Object.entries(data.counts ?? {})
        .filter(([k, n]) => KEY.test(k) && Number.isInteger(n) && n > 0 && n <= 100000)
        .slice(0, 500)
      writing = writing.catch(() => {}).then(async () => {
        await ready
        const file = join(dir, `${data.day}.json`)
        let total = {}
        try { total = JSON.parse(await readFile(file, 'utf8')) } catch { /* a new day */ }
        for (const [k, n] of counts) total[k] = (total[k] ?? 0) + n
        await writeFile(file, JSON.stringify(total))
      })
      return writing
    },

    /** The totals for the last `days` days, newest first: [{ day, counts }]. */
    async recent(days = 30) {
      await ready
      const files = (await readdir(dir)).filter((f) => DAY.test(f.replace(/\.json$/, ''))).sort().reverse().slice(0, days)
      return Promise.all(files.map(async (f) => ({ day: f.replace(/\.json$/, ''), counts: JSON.parse(await readFile(join(dir, f), 'utf8')) })))
    },
  }
}
