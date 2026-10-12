// Makes src/voice/lines.gen.json, the part of the recording script (src/voice/script.ts) that can't be read
// straight from the game's data:
//   learning  every line the learning levels say, sampled until no new one turns up, with how often each came
//             up (the studio records the most heard first). The questions are random, so the sampling uses a
//             fixed seed: the same game makes the same file.
//   code      the fixed strings the code speaks: speak('…') with no ${…} in it.
//   taps      what the story pictures say when tapped (say="…" in src/art).
//   npm run voice-script
// A test (src/__tests__/voice-script.test.ts) checks the file is up to date.
import { writeFileSync } from 'node:fs'
import { voiceLines } from '../src/voice/lines-source'

const lines = voiceLines()
writeFileSync('src/voice/lines.gen.json', JSON.stringify(lines, null, 0).replace(/\],\[/g, '],\n[').replace(/","/g, '",\n"'))
console.log(`learning ${lines.learning.length}, code ${lines.code.length}, taps ${lines.taps.length} -> src/voice/lines.gen.json`)
