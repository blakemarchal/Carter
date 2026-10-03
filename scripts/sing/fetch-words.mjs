// Asks Ara (the narration voice) to say each word the songs need, one clip per word.
// Run on the server, where the voice key lives (it is read from .env and never printed):
//   cd /opt/Carter && node scripts/sing/fetch-words.mjs words.json /root/carter-sing-words
// Clips already fetched are kept, so running it again only fetches new words.
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { readEnv } from '../../server/env.mjs'
import { synthesize } from '../../server/tts.mjs'

const [list, out] = process.argv.slice(2)
const key = readEnv().XAI_API_KEY
if (!key) throw new Error('No XAI_API_KEY in .env')
mkdirSync(out, { recursive: true })
const words = JSON.parse(readFileSync(list, 'utf8'))
const index = {}
let fetched = 0
for (const text of words) {
  const file = `${createHash('sha1').update(text).digest('hex').slice(0, 16)}.mp3`
  index[text] = file
  if (existsSync(join(out, file))) continue
  writeFileSync(join(out, file), await synthesize(text, 'ara', '1', key))
  fetched++
}
writeFileSync(join(out, 'index.json'), JSON.stringify(index, null, 1))
console.log(`${words.length} words, ${fetched} fetched now`)
