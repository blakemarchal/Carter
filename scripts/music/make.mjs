// Makes the sung songs with ElevenLabs Music, from their lyrics (lyrics.json) and styles (styles.json), into
// scripts/music/work/<id>/vocal.mp3, with the plan and the song's id beside it. Or takes a song made elsewhere
// from the drop folder. Then separate.mjs, align.mjs and install.mjs (or run.mjs for all three).
//   node scripts/music/make.mjs --only song-creation song-jonah     these songs
//   node scripts/music/make.mjs --all                               every song without a vocal.mp3 yet
//   node scripts/music/make.mjs --again song-jonah                  make it again (a new take)
//   node scripts/music/make.mjs --from-drop                         copy drop/<id>.mp3 (and <id>-sing.mp3) into work
//   node scripts/music/make.mjs --loops [home story …]              the background loops (instrumental)
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { DROP, WORK, eleven, ensureDir, songs, styles } from './lib.mjs'
import { buildPlan, planMs } from './plan.mjs'

const MODEL = 'music_v2_5'
const args = process.argv.slice(2)
const flag = (f) => args.includes(f)
const after = (f) => { const i = args.indexOf(f); return i < 0 ? [] : args.slice(i + 1).filter((a) => !a.startsWith('--')) }

/** A song's audio, with retries for the API's busy moments. */
async function compose(body, label) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await eleven('/v1/music', { method: 'POST', json: body, query: { output_format: 'mp3_44100_128' } })
      const songId = [...r.headers.entries()].find(([k]) => /song/i.test(k))?.[1] ?? null
      return { audio: Buffer.from(await r.arrayBuffer()), songId }
    } catch (e) {
      if (attempt < 4 && (e.status === 429 || e.status >= 500)) {
        console.log(`  ${label}: HTTP ${e.status}, trying again in ${attempt * 20}s…`)
        await new Promise((res) => setTimeout(res, attempt * 20_000))
        continue
      }
      throw e
    }
  }
}

async function makeSong(song, style) {
  const dir = join(WORK, song.id)
  ensureDir(dir)
  const plan = buildPlan(song, style)
  console.log(`${song.id}: ${plan.chunks.length} sections, about ${Math.round(planMs(plan) / 1000)}s…`)
  const { audio, songId } = await compose({ composition_plan: plan, model_id: MODEL }, song.id)
  writeFileSync(join(dir, 'vocal.mp3'), audio)
  writeFileSync(join(dir, 'meta.json'), JSON.stringify({ made: new Date().toISOString(), source: 'elevenlabs', model: MODEL, songId, plan }, null, 1))
  console.log(`  -> work/${song.id}/vocal.mp3 (${(audio.length / 1e6).toFixed(1)} MB)`)
}

async function makeLoop(mood, spec) {
  const dir = join(WORK, 'loops')
  ensureDir(dir)
  console.log(`loop ${mood}: ${Math.round(spec.ms / 1000)}s…`)
  const { audio, songId } = await compose({ prompt: spec.prompt, music_length_ms: spec.ms, force_instrumental: true, model_id: MODEL }, mood)
  writeFileSync(join(dir, `${mood}.mp3`), audio)
  writeFileSync(join(dir, `${mood}.json`), JSON.stringify({ made: new Date().toISOString(), source: 'elevenlabs', model: MODEL, songId, prompt: spec.prompt }, null, 1))
}

try {
  const style = styles()
  if (flag('--from-drop')) {
    ensureDir(DROP)
    let n = 0
    for (const f of readdirSync(DROP)) {
      const m = /^([a-z0-9-]+?)(-sing)?\.(mp3|wav|m4a)$/i.exec(f)
      if (!m) continue
      const dir = join(WORK, m[1])
      mkdirSync(dir, { recursive: true })
      copyFileSync(join(DROP, f), join(dir, (m[2] ? 'sing-raw' : 'vocal') + '.' + m[3].toLowerCase()))
      if (!m[2]) writeFileSync(join(dir, 'meta.json'), JSON.stringify({ made: new Date().toISOString(), source: 'drop', file: f }, null, 1))
      console.log(`${f} -> work/${m[1]}/`)
      n++
    }
    if (!n) console.log(`Nothing in ${DROP}. Put songs there as <id>.mp3 (and <id>-sing.mp3 for a version without the voice).`)
  } else if (flag('--loops')) {
    const which = after('--loops')
    for (const [mood, spec] of Object.entries(style.loops)) {
      if (mood === '_' || (which.length && !which.includes(mood))) continue
      if (!flag('--again') && existsSync(join(WORK, 'loops', `${mood}.mp3`))) { console.log(`loop ${mood}: already made (--again to redo)`); continue }
      await makeLoop(mood, spec)
    }
  } else {
    const only = [...after('--only'), ...after('--again')]
    const all = songs().filter((s) => !s.name) // (songs with the birthday name slot stay on the old pipeline)
    const todo = flag('--all') ? all : all.filter((s) => only.includes(s.id))
    if (!todo.length) throw new Error('Say which: --only <id…>, --again <id…>, --all, --from-drop or --loops')
    for (const s of todo) {
      if (!flag('--again') && existsSync(join(WORK, s.id, 'vocal.mp3'))) { console.log(`${s.id}: already made (--again to redo)`); continue }
      await makeSong(s, style)
    }
  }
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
