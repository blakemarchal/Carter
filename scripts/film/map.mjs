// The voyage map with progress like Carter's: the seas, the arrows between them, a locked sea, "New!"
// on finished islands that have grown, the Ark resting after the day's visits, and a started island
// that stays open. Pictures at iPad landscape, plus iPad portrait and a phone on its side.
//   node map.mjs <out dir>
import { mkdirSync } from 'node:fs'
import { fixture, launch, sleep } from './cdp.mjs'
const OUT = process.argv[2]
mkdirSync(OUT, { recursive: true })
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const fx = { ...fixture({ today }), islandsDone: ['noah', 'creation', 'david', 'jonah'], openAll: false, mapAt: 'jonah', stars: { noah: 3, creation: 2, david: 3, jonah: 1 } }
const said = (page, n = 1) => page.eval(`(window.__said || []).slice(-${n}).join(' | ')`)
const tapIsland = async (page, id) => {
  const c = await page.eval(`(() => { const r = document.querySelector('[data-island="${id}"] .map-hit').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })()`)
  await page.tap(c[0], c[1])
  await sleep(800)
}

async function open(page, progress) {
  await page.goto('http://localhost:5179/')
  await page.eval(`localStorage.clear(); localStorage.setItem('ark-pals:profiles', JSON.stringify({ active: 'tester', list: [{ id: 'tester', name: 'Tester', emoji: '🧪' }] }));
    localStorage.setItem('ark-pals:v1:tester', ${JSON.stringify(JSON.stringify(progress))}); true`)
  await page.goto('http://localhost:5179/?m=' + Math.random())
  await sleep(700)
  await page.tapOn('button.player')
  await sleep(1500)
}

const page = await launch()
await open(page, fx)
await page.shot(`${OUT}/0-kings.jpg`)
console.log('said:', await said(page, 2))
await page.tapOn('.sea-arrow.next')
await sleep(1000)
console.log('locked next:', await said(page))
for (let k = 0; k < 3; k++) { await page.tapOn('.sea-arrow.prev'); await sleep(500) }
await sleep(500)
await page.shot(`${OUT}/1-beginning.jpg`)
// The daily voyage: two visits already today, so a new island rests (finished ones don't).
await open(page, { ...fx, voyage: { day: today, visits: 2 }, mapAt: 'abraham' })
await page.shot(`${OUT}/2-resting.jpg`)
await tapIsland(page, 'abraham')
console.log('resting tap:', await said(page))
// An island they'd started stays open, even with a new island before it.
await open(page, { ...fx, islandStep: { christmas: 3 }, mapAt: 'christmas' })
await page.shot(`${OUT}/3-started.jpg`)
console.log('errors:', page.errors)
await page.close()

// iPad portrait, and a phone on its side
for (const [name, width, height] of [['4-portrait', 820, 1180], ['5-phone', 844, 390]]) {
  const p = await launch({ width, height })
  await open(p, fx)
  await p.shot(`${OUT}/${name}.jpg`)
  console.log(`${name} errors:`, p.errors)
  await p.close()
}
