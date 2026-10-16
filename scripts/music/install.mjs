// Puts finished songs into the game: work/<id>/{vocal,sing}.mp3 (re-encoded small, at one loudness) into
// public/music with their content hash in the name, and the timing into src/data/songs.gen.json, in the game's
// order, leaving songs that weren't made (the birthday song, with its name gap) as they are. Loops go to
// public/music/loops and src/data/loops.gen.json.
//   node scripts/music/install.mjs <id> [id…]      node scripts/music/install.mjs --loops
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, WORK, hashedName, songs, transcode } from './lib.mjs'

const MUSIC = join(ROOT, 'public', 'music')
const GEN = join(ROOT, 'src', 'data', 'songs.gen.json')
const LOOPS_GEN = join(ROOT, 'src', 'data', 'loops.gen.json')

/** Writes `data` as /music/<stem>.<hash>.mp3, removing older versions of the same stem; returns the URL. */
export function place(dir, stem, data, urlBase) {
  mkdirSync(dir, { recursive: true })
  const name = hashedName(stem, data)
  for (const old of readdirSync(dir)) if (old.startsWith(stem + '.') && old.endsWith('.mp3') && old !== name) rmSync(join(dir, old))
  writeFileSync(join(dir, name), data)
  return `${urlBase}/${name}`
}

/** The gen file with `entries` merged in, in the songs' order. */
export function mergeGen(existing, entries, order) {
  const all = { ...existing, ...entries }
  const out = {}
  for (const id of order) if (all[id]) out[id] = all[id]
  for (const id of Object.keys(all)) if (!out[id]) out[id] = all[id]
  return out
}

export function installSong(song) {
  const dir = join(WORK, song.id)
  for (const f of ['vocal.mp3', 'sing.mp3', 'timing.json']) if (!existsSync(join(dir, f))) throw new Error(`${song.id}: work/${song.id}/${f} is missing`)
  const tmp = join(dir, 'tmp')
  mkdirSync(tmp, { recursive: true })
  transcode(join(dir, 'vocal.mp3'), join(tmp, 'vocal.mp3'), { kbps: 96 })
  transcode(join(dir, 'sing.mp3'), join(tmp, 'sing.mp3'), { kbps: 80, loudnorm: true })
  const timing = JSON.parse(readFileSync(join(dir, 'timing.json'), 'utf8'))
  const entry = {
    audio: {
      ara: place(MUSIC, song.id, readFileSync(join(tmp, 'vocal.mp3')), '/music'),
      sing: place(MUSIC, `${song.id}-sing`, readFileSync(join(tmp, 'sing.mp3')), '/music'),
    },
    duration: timing.duration,
    beats: timing.beats,
    lines: timing.lines,
  }
  rmSync(tmp, { recursive: true, force: true })
  return entry
}

export function installLoops() {
  const dir = join(WORK, 'loops')
  const existing = existsSync(LOOPS_GEN) ? JSON.parse(readFileSync(LOOPS_GEN, 'utf8')) : {}
  const out = { ...existing }
  for (const f of existsSync(dir) ? readdirSync(dir) : []) {
    if (!f.endsWith('.mp3')) continue
    const mood = f.replace(/\.mp3$/, '')
    const tmp = join(dir, `${mood}.tmp.mp3`)
    transcode(join(dir, f), tmp, { kbps: 80 })
    out[mood] = place(join(MUSIC, 'loops'), mood, readFileSync(tmp), '/music/loops')
    rmSync(tmp)
    console.log(`loop ${mood} -> ${out[mood]}`)
  }
  writeFileSync(LOOPS_GEN, JSON.stringify(out, null, 1) + '\n')
  return out
}

if (process.argv[1]?.endsWith('install.mjs')) {
  try {
    const args = process.argv.slice(2)
    if (args.includes('--loops')) {
      installLoops()
    } else {
      if (!args.length) throw new Error('Say which: node scripts/music/install.mjs <id…> | --loops')
      const all = songs()
      const entries = {}
      for (const id of args) {
        const s = all.find((x) => x.id === id)
        if (!s) throw new Error(`${id}: not a song`)
        entries[id] = installSong(s)
        console.log(`${id} -> ${entries[id].audio.ara}`)
      }
      const existing = existsSync(GEN) ? JSON.parse(readFileSync(GEN, 'utf8')) : {}
      writeFileSync(GEN, JSON.stringify(mergeGen(existing, entries, all.map((s) => s.id))))
    }
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
