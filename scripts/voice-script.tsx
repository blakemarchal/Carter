// Makes the parts of the voice script that can't be read straight from the game's data:
//   src/voice/lines.gen.json   for the recording studio (src/voice/script.ts):
//     learning  every line the learning levels say, sampled until no new one turns up, with how often each came
//               up (the studio records the most heard first). The questions are random, so the sampling uses a
//               fixed seed: the same game makes the same file.
//     code      the fixed strings the code speaks: speak('…') with no ${…} in it.
//     taps      what the story pictures say when tapped (say="…" in src/art).
//   public/voice/grok-list.json   every clip the house Grok voice needs (src/voice/grok-list.ts), for
//               scripts/warm-house-grok.mjs to make on the server. It ships with the app (dist/voice/).
//   npm run voice-script
// Tests check both are up to date (src/__tests__/voice-script.test.ts, voice-grok.test.ts).
import { mkdirSync, writeFileSync } from 'node:fs'
import { voiceLines } from '../src/voice/lines-source'
import { ISLANDS, loadIsland } from '../src/data/islands'
import { buildGrokList, grokCharacters } from '../src/voice/grok-list'
import { contentForServer } from '../src/data/content-summary'

const lines = voiceLines()
writeFileSync('src/voice/lines.gen.json', JSON.stringify(lines, null, 0).replace(/\],\[/g, '],\n[').replace(/","/g, '",\n"'))
console.log(`learning ${lines.learning.length}, code ${lines.code.length}, taps ${lines.taps.length} -> src/voice/lines.gen.json`)

const islands = await Promise.all(ISLANDS.map((i) => loadIsland(i.id)))
const grok = buildGrokList(islands, lines) // (the lines just made, not the file as it was when this was built)
mkdirSync('public/voice', { recursive: true })
writeFileSync('public/voice/grok-list.json', `[\n${grok.map((c) => JSON.stringify(c)).join(',\n')}\n]\n`)
console.log(`${grok.length} Grok clips, about ${grokCharacters(grok).toLocaleString()} characters -> public/voice/grok-list.json`)

// (what the server's weekly parent email says about each island: src/data/content-summary.ts)
const summary = contentForServer(islands)
writeFileSync('server/content.gen.json', JSON.stringify(summary, null, 1) + '\n')
console.log(`${summary.islands.length} islands -> server/content.gen.json`)
