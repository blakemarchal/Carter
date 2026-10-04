// Makes the narrator's voice for every fixed line ahead of time, so a child never hears the device voice
// stand in while a brand-new line is being made (the game waits four seconds for a new line, then uses
// the device voice). Run it on the server, where the voice key lives (read from .env, never printed),
// after new content ships:
//   node scripts/warm-narration.mjs <lines.json> [speed = 1] [cache folder = $CACHE_DIRECTORY or /var/cache/carter]
// lines.json: the game's fixed lines exactly as it sends them to the voice (after lib/spoken.ts toSpoken).
// Speed is the Parent Corner's voice speed: 0.85 Slow, 1 Normal, 1.1 Quick. Lines already made are skipped.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { readEnv } from '../server/env.mjs'
import { createTtsCache } from '../server/tts.mjs'

const [list, speed = '1', dir = process.env.CACHE_DIRECTORY ?? '/var/cache/carter'] = process.argv.slice(2)
const apiKey = readEnv().XAI_API_KEY
if (!apiKey) throw new Error('No XAI_API_KEY in .env')
const tts = createTtsCache({ apiKey, dir, dailyChars: 400_000 })
const lines = JSON.parse(readFileSync(list, 'utf8'))
// (the same file name the server gives a line: server/tts.mjs)
const cached = (text) => existsSync(join(dir, `${createHash('sha256').update(`ara|${speed}|${text}`).digest('hex')}.mp3`))

let made = 0, had = 0, failed = 0
const todo = lines.filter((t) => (cached(t) ? (had++, false) : true))
for (let i = 0; i < todo.length; i += 3) {
  await Promise.all(todo.slice(i, i + 3).map(async (text) => {
    try {
      await tts(text, 'ara', speed)
      made++
    } catch (e) {
      failed++
      console.log(`failed: "${text.slice(0, 60)}…" ${String(e.message).slice(0, 160)}`)
    }
  }))
}
console.log(`${lines.length} lines: ${had} already made, ${made} made now, ${failed} failed`)
