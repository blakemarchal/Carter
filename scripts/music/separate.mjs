// The song without its voice, for "I sing!" and the studio's sing-along: Demucs (Meta's open-source separator)
// takes the voice out of work/<id>/vocal.mp3 and leaves work/<id>/sing.mp3, the same arrangement and timing.
// A version that came with the drop (sing-raw.*) is used instead of separating.
//   node scripts/music/separate.mjs <id> [id…]
import { existsSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { PY, WORK, transcode } from './lib.mjs'
import { spawnSync } from 'node:child_process'

export function separate(id) {
  const dir = join(WORK, id)
  const out = join(dir, 'sing.mp3')
  const raw = readdirSync(dir).find((f) => /^sing-raw\.(mp3|wav|m4a)$/.test(f))
  if (raw) {
    transcode(join(dir, raw), out, { loudnorm: false })
    return 'from the drop folder'
  }
  const vocal = ['vocal.mp3', 'vocal.wav', 'vocal.m4a'].map((f) => join(dir, f)).find(existsSync)
  if (!vocal) throw new Error(`${id}: no vocal.mp3 in work/${id} (make.mjs first)`)
  const tmp = join(dir, 'demucs')
  // (twice: the first run on a machine downloads the model, which can fail once on a slow connection)
  let r
  for (let attempt = 1; attempt <= 2; attempt++) {
    rmSync(tmp, { recursive: true, force: true })
    r = spawnSync(PY, ['-m', 'demucs', '--two-stems=vocals', '-n', 'htdemucs', '-o', tmp, vocal], { stdio: ['ignore', 'inherit', 'pipe'], encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    if (r.status === 0) break
    const lines = (r.stderr ?? '').split(/\r?\n/).filter((l) => l.trim() && !/%\|/.test(l))
    const why = r.error ? r.error.message : lines.slice(-6).join('\n')
    console.log(`  ${id}: Demucs didn't finish (${r.status ?? 'no exit code'})${why ? ':\n' + why : ''}${attempt === 1 ? '\n  trying once more…' : ''}`)
  }
  if (r.status !== 0) throw new Error(`${id}: Demucs failed. Is the music Python environment set up? Run: node scripts/music/setup.mjs`)
  const stem = join(tmp, 'htdemucs', vocal.split(/[\\/]/).pop().replace(/\.[^.]+$/, ''), 'no_vocals.wav')
  if (!existsSync(stem)) throw new Error(`${id}: Demucs made no no_vocals.wav`)
  transcode(stem, out, { loudnorm: false })
  renameSync(stem, join(dir, 'sing.wav'))
  rmSync(tmp, { recursive: true, force: true })
  return 'separated'
}

if (process.argv[1]?.endsWith('separate.mjs')) {
  try {
    const ids = process.argv.slice(2)
    if (!ids.length) throw new Error('Say which: node scripts/music/separate.mjs <id…>')
    for (const id of ids) console.log(`${id}: sing.mp3 ${separate(id)}`)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
