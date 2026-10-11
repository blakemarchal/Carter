// Lists every line the learning backbone and the placement game send to the narrator, so the local
// thread can make the voice ahead of time (scripts/warm-narration.mjs) and add them to Mom's script.
//   npm run learning-lines   -> preview/learning-lines.json (as the voice gets them, after toSpoken)
// The questions are made at random from fixed lists, so each level is sampled many times until no new
// line turns up. Lines spoken inside an exercise as it's played (counting hops, "That says 5 o'clock")
// are fixed strings in src/learn/topics/*.tsx and aren't sampled here; see the hand-back note.
import { writeFileSync, mkdirSync } from 'node:fs'
import { LEVELS } from '../src/learn/levels'
import { toSpoken } from '../src/lib/spoken'
import { PLACEMENT_PRAISE, SKILL_START } from '../src/screens/Placement'
import type { Skill } from '../src/lib/progress'

const lines = new Set<string>()
const add = (t: string) => { const s = toSpoken(t, 'grok'); if (s) lines.add(s) }
const THEMES = [undefined, '💧', '🐟', '⭐', '🐑', '🌾']

for (const skill of Object.keys(LEVELS) as Skill[]) {
  LEVELS[skill].forEach((level) => {
    let quiet = 0
    for (let i = 0; quiet < 3000 && i < 60000; i++) {
      const before = lines.size
      const theme = THEMES[i % THEMES.length]
      const q = level.question(theme)
      add(q.say)
      for (const c of q.choices) add(`${c.say}!`) // (said when it's the right answer)
      const ex = level.exercise?.(theme)
      if (ex) add(ex.say)
      quiet = lines.size === before ? quiet + 1 : 0
    }
  })
}
for (const t of [...Object.values(SKILL_START), ...PLACEMENT_PRAISE]) add(t)

mkdirSync('preview', { recursive: true })
writeFileSync('preview/learning-lines.json', JSON.stringify([...lines].sort(), null, 1))
console.log(`${lines.size} lines -> preview/learning-lines.json`)
