// The name library (docs/CLOUD-BRIEF.md, wave 10): the US children's first names the house narrator records,
// so a child hears their own name in a real voice without it ever being sent anywhere.
//   node scripts/name-library.mjs <folder of SSA yobYYYY.txt files> [from year = 2014]  -> src/voice/names.json
// The files are the Social Security Administration's national baby-name data (public domain): unzip
// https://www.ssa.gov/oact/babynames/names.zip. Each line is "Name,F|M,births". Births from `from` to the
// latest year are added up, the 600 most common girls' and 600 most common boys' names are kept, and
// spellings that sound alike ("Aiden", "Aidan", "Ayden") are merged, to be recorded once.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { soundKey } from '../src/voice/soundKey.mjs'

export const TOP = 600

/** The library from yob files' contents ({ year: text }): [{ name, also, births }], most common first. */
export function buildLibrary(files, { from = 2014, top = TOP } = {}) {
  const births = { F: new Map(), M: new Map() }
  for (const [year, text] of Object.entries(files)) {
    if (Number(year) < from) continue
    for (const line of text.split(/\r?\n/)) {
      const [name, sex, n] = line.split(',')
      if (!name || !births[sex]) continue
      births[sex].set(name, (births[sex].get(name) ?? 0) + Number(n))
    }
  }
  const total = new Map()
  for (const sex of ['F', 'M']) {
    const ranked = [...births[sex]].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, top)
    for (const [name] of ranked) total.set(name, (births.F.get(name) ?? 0) + (births.M.get(name) ?? 0))
  }
  // (one group per sound: its most common spelling is the name recorded, the rest are its other spellings)
  const groups = new Map()
  for (const [name, n] of [...total].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    const key = soundKey(name)
    const g = groups.get(key)
    if (g) { g.also.push(name); g.births += n } else groups.set(key, { name, also: [], births: n })
  }
  return [...groups.values()].sort((a, b) => b.births - a.births || a.name.localeCompare(b.name))
}

if (process.argv[1]?.endsWith('name-library.mjs')) {
  const [dir, from = '2014'] = process.argv.slice(2)
  if (!dir) throw new Error('Usage: node scripts/name-library.mjs <folder of yobYYYY.txt files> [from year]')
  const files = {}
  for (const f of readdirSync(dir)) {
    const m = /^yob(\d{4})\.txt$/.exec(f)
    if (m) files[m[1]] = readFileSync(join(dir, f), 'utf8')
  }
  const years = Object.keys(files).map(Number).filter((y) => y >= Number(from)).sort()
  const lib = buildLibrary(files, { from: Number(from) })
  const out = { source: `US Social Security Administration, national baby names, births ${years[0]}–${years.at(-1)}`, top: TOP, names: lib.map(({ name, also }) => (also.length ? [name, ...also] : [name])) }
  writeFileSync('src/voice/names.json', JSON.stringify(out, null, 0).replace(/\],\[/g, '],\n['))
  console.log(`${lib.length} names to record (${lib.reduce((s, g) => s + 1 + g.also.length, 0)} spellings), ${out.source} -> src/voice/names.json`)
}
