// Makes the house Grok voice (docs/CLOUD-BRIEF.md, wave 11): every clip in the list (public/voice/grok-list.json,
// made by npm run voice-script; it ships as dist/voice/grok-list.json), in Grok's "Ara" voice, into the house set
// (STATE_DIRECTORY/house/grok, and its index.json), which the game plays for every family. Run it on the server,
// where the voice key lives (read from .env, never printed), as root, from /opt/Carter:
//   node scripts/warm-house-grok.mjs [list = dist/voice/grok-list.json] [--dry-run] [--max-chars=400000]
// It's safe to run again after each wave: clips already made are skipped. A clip flagged on the sound check page
// (the owner's, in the Parent Corner) is made again with its next prompt, and unflagged. A line already made for
// /tts (the old narration cache) is copied, not paid for again. Files are handed to the state folder's owner (the
// service's user), and the running server picks the new index up by itself: no restart needed.
import { createHash } from 'node:crypto'
import { chownSync, existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { readEnv } from '../server/env.mjs'
import { createHouse } from '../server/house.mjs'
import { synthesize } from '../server/tts.mjs'

const args = process.argv.slice(2)
const listFile = args.find((a) => !a.startsWith('--')) ?? 'dist/voice/grok-list.json'
const dry = args.includes('--dry-run')
const maxChars = Number(args.find((a) => a.startsWith('--max-chars='))?.split('=')[1] ?? 400_000)
const state = process.env.STATE_DIRECTORY ?? '/var/lib/carter'
const cacheDir = process.env.CACHE_DIRECTORY ?? '/var/cache/carter'
const VOICE = 'grok'
const SPEED = '1'

/** A clip's fingerprint: the first 16 hex characters of SHA-256 of its key (src/lib/recordings.ts lineId). */
export const fingerprint = (key) => createHash('sha256').update(key.trim()).digest('hex').slice(0, 16)

/** What to make: [{ clip, id, prompt, attempt }] for the clips missing or flagged. */
export function plan(list, clips = {}) {
  const todo = []
  for (const clip of list) {
    const id = fingerprint(clip.key)
    const had = clips[id]
    if (had && !had.flagged) continue
    const attempt = had?.flagged ? Math.min((had.attempt ?? 0) + 1, clip.say.length - 1) : 0
    todo.push({ clip, id, prompt: clip.say[attempt], attempt })
  }
  return todo
}

async function main() {
  const list = JSON.parse(readFileSync(listFile, 'utf8'))
  const houseDir = join(state, 'house')
  const house = createHouse(houseDir)
  const todo = plan(list, (await house.index()).clips[VOICE])
  const chars = todo.reduce((n, t) => n + t.prompt.length, 0)
  console.log(`${list.length} clips in the list; ${todo.length} to make (${todo.filter((t) => t.attempt).length} flagged, made again), about ${chars.toLocaleString()} characters.`)
  if (dry) return
  if (chars > maxChars) throw new Error(`That's more than --max-chars=${maxChars}. Run again with a higher limit if it's right.`)
  const apiKey = readEnv().XAI_API_KEY
  if (!apiKey && todo.length) throw new Error('No XAI_API_KEY in .env (run from /opt/Carter: npm run set-voice-key)')
  const { uid, gid } = statSync(state) // (the service's user owns the state folder: the files go to it)
  const ttsFile = (text) => join(cacheDir, `${createHash('sha256').update(`ara|${SPEED}|${text}`).digest('hex')}.mp3`)
  let made = 0, copied = 0, failed = 0
  for (let i = 0; i < todo.length; i += 3) {
    await Promise.all(todo.slice(i, i + 3).map(async (t) => {
      try {
        const cached = t.attempt === 0 && existsSync(ttsFile(t.prompt)) ? readFileSync(ttsFile(t.prompt)) : null
        const mp3 = cached ?? (await synthesize(t.prompt, 'ara', SPEED, apiKey))
        await house.put(VOICE, t.id, 'audio/mpeg', mp3, { key: t.clip.key, said: t.prompt, ref: t.clip.ref, attempt: t.attempt }, { save: false })
        cached ? copied++ : made++
      } catch (e) {
        failed++
        console.log(`failed: ${t.clip.ref} ${String(e.message).replace(/\b(xai|sk)-\w+/gi, '[key]').slice(0, 160)}`)
      }
    }))
    // (the index is saved every 50 or so clips, so a stopped run keeps what it made)
    if ((i / 3) % 17 === 16) await house.flush()
    if ((i / 3) % 100 === 0) console.log(`  ${Math.min(i + 3, todo.length)} of ${todo.length}…`)
  }
  await house.flush()
  await house.setVoice(VOICE, { label: 'Grok (Ara)' }).catch(() => {})
  for (const f of [houseDir, join(houseDir, 'index.json'), join(houseDir, VOICE), ...readdirSync(join(houseDir, VOICE)).map((f) => join(houseDir, VOICE, f))]) {
    try { chownSync(f, uid, gid) } catch { /* not ours to change: run as root */ }
  }
  console.log(`${made} made, ${copied} copied from the narration cache, ${failed} failed. ${failed ? 'Run it again to retry the failed ones.' : 'Done.'}`)
}

if (process.argv[1]?.endsWith('warm-house-grok.mjs')) {
  main().catch((e) => {
    console.error(String(e.message).replace(/\b(xai|sk)-\w+/gi, '[key]'))
    process.exit(1)
  })
}
