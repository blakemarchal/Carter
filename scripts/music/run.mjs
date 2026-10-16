// The whole pipeline for some songs: make (unless made, or from the drop folder), separate, align, install.
//   node scripts/music/run.mjs --only song-creation song-jonah
//   node scripts/music/run.mjs --all            every song (the birthday song stays as it is)
//   node scripts/music/run.mjs --from-drop      what's in scripts/music/drop
//   node scripts/music/run.mjs --loops          the background loops
// Then: npm test, and listen (npm run dev → the sing-along), before deploying.
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { HERE, WORK, songs } from './lib.mjs'
import { align } from './align.mjs'
import { installSong, mergeGen } from './install.mjs'
import { separate } from './separate.mjs'

const args = process.argv.slice(2)
const node = (script, extra) => execFileSync(process.execPath, [join(HERE, script), ...extra], { stdio: 'inherit' })

try {
  if (args.includes('--loops')) {
    node('make.mjs', ['--loops'])
    node('install.mjs', ['--loops'])
    process.exit(0)
  }
  const all = songs().filter((s) => !s.name)
  let ids
  if (args.includes('--from-drop')) {
    node('make.mjs', ['--from-drop'])
    ids = existsSync(WORK) ? readdirSync(WORK).filter((d) => all.some((s) => s.id === d) && JSON.parse(readFileSync(join(WORK, d, 'meta.json'), 'utf8')).source === 'drop') : []
  } else if (args.includes('--all')) {
    node('make.mjs', ['--all'])
    ids = all.map((s) => s.id)
  } else {
    ids = args.filter((a) => !a.startsWith('--'))
    if (!ids.length) throw new Error('Say which: --only <id…>, --all, --from-drop or --loops')
    node('make.mjs', ['--only', ...ids])
  }
  const entries = {}
  const results = []
  const gen = join(HERE, '..', '..', 'src', 'data', 'songs.gen.json')
  // (the game's list is written after each song, so a run that stops part-way leaves the game whole)
  const save = () => writeFileSync(gen, JSON.stringify(mergeGen(JSON.parse(readFileSync(gen, 'utf8')), entries, songs().map((s) => s.id))))
  for (const id of ids) {
    const s = all.find((x) => x.id === id)
    if (!s) throw new Error(`${id}: not a song`)
    console.log(`${id}: sing.mp3 ${separate(id)}`)
    const { check } = await align(s)
    entries[id] = installSong(s)
    save()
    results.push({ id, pct: Math.round((100 * check.matched) / check.lyricWords), missed: check.missed })
  }
  console.log('\nInstalled. The words check:')
  for (const r of results) console.log(`  ${r.pct >= 85 ? 'ok    ' : r.pct >= 70 ? 'LISTEN' : 'REDO? '} ${r.id} ${r.pct}%${r.missed.length ? ' (not heard: ' + r.missed.slice(0, 8).join(' ') + ')' : ''}`)
  console.log('Next: npm test, then npm run dev and listen in the sing-along.')
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
