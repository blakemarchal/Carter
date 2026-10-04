// Opens an island at one step and takes a picture every second, to see a step as a child does:
//   node scripts/film/step.mjs <out dir> <island> <step> [seconds = 6] [--portrait]
// (Steps count from 0, in the island's data. Pauses and visits are just steps here.)
import { mkdirSync } from 'node:fs'
import { fixture, launch, sleep, islandVersion } from './cdp.mjs'

const args = process.argv.slice(2)
const portrait = args.includes('--portrait')
const [OUT, ISLAND, STEP, SECONDS = '6'] = args.filter((a) => a !== '--portrait')
mkdirSync(OUT, { recursive: true })
const page = await launch(portrait ? { width: 820, height: 1180 } : {})
const today = new Date().toISOString().slice(0, 10)
const fx = fixture({ today })
fx.islandStep = { [ISLAND]: Number(STEP) }
fx.islandStepVersion = { [ISLAND]: islandVersion(ISLAND) }
fx.mapAt = ISLAND
fx.dailyVisits = 0 // no daily limit
await page.goto('http://localhost:5179/')
await page.eval(`localStorage.clear(); localStorage.setItem('ark-pals:profiles', JSON.stringify({ active: 'tester', list: [{ id: 'tester', name: 'Tester', emoji: '🧪' }] }));
  localStorage.setItem('ark-pals:v1:tester', ${JSON.stringify(JSON.stringify(fx))}); true`)
await page.goto('http://localhost:5179/?s=' + Math.random())
await sleep(700)
await page.tapOn('button.player')
await sleep(1000)
const isl = await page.eval(`(() => { const g = document.querySelector('[data-island="${ISLAND}"] .map-hit'); if (!g) return null; const r = g.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })()`)
if (!isl) { console.log(`island ${ISLAND} is not on the map`); process.exit(1) }
await page.tap(isl[0], isl[1])
await sleep(1200)
console.log('step:', await page.eval(`document.querySelector('.island-body > *')?.className`))
for (let k = 0; k < Number(SECONDS); k++) {
  await page.shot(`${OUT}/${ISLAND}-${STEP}-${String(k).padStart(2, '0')}.jpg`)
  await sleep(1000)
}
console.log('said:', await page.eval(`(window.__said || []).slice(-3).join(' | ')`))
console.log('errors:', page.errors)
await page.close()
