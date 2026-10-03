// Plays Spot it with real finger taps, taking a picture at each moment that matters:
//   node scripts/film/games/spot.mjs <out dir> [island] [--portrait]
// Without an island it plays the demo kit (#gallery/game/spot); with one, that island's kit. It taps
// an empty spot (a ripple), finds one thing near the edge of its reach, taps it again (it hops), waits
// for two hints, then finds the rest and films the celebration. It prints what the narrator said.
import { mkdirSync } from 'node:fs'
import { launch, sleep } from '../cdp.mjs'

const args = process.argv.slice(2)
const portrait = args.includes('--portrait')
const [OUT, ISLAND] = args.filter((a) => !a.startsWith('--'))
if (!OUT) { console.log('usage: node scripts/film/games/spot.mjs <out dir> [island] [--portrait]'); process.exit(1) }
mkdirSync(OUT, { recursive: true })
const page = await launch(portrait ? { width: 820, height: 1180 } : {})
await page.goto(`http://localhost:5179/?s=${Math.random()}#gallery/game/spot${ISLAND ? `/${ISLAND}` : ''}`)
await sleep(900)

let n = 0
const snap = async (name) => page.shot(`${OUT}/${String(n++).padStart(2, '0')}-${name}.jpg`)
const t0 = Date.now()
const said = () => page.eval(`(window.__said || []).slice()`)
/** Every thing to find, in screen pixels: its middle, its reach, and whether it's found. */
const things = () => page.eval(`(() => {
  const svg = document.querySelector('.spot-tap'); if (!svg) return []
  const m = svg.getScreenCTM()
  return [...document.querySelectorAll('[data-target]')].map((g) => {
    const [x, y] = g.dataset.at.split(',').map(Number)
    const p = new DOMPoint(x, y).matrixTransform(m)
    return { id: g.dataset.target, x: p.x, y: p.y, r: Number(g.dataset.r) * m.a, found: g.dataset.found === 'yes' }
  })
})()`)
const board = () => page.eval(`(() => { const r = document.querySelector('.spot-tap').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } })()`)

if (!(await page.eval(`!!document.querySelector('.spot-it')`))) {
  console.log('no spot game here:', await page.eval(`document.body.innerText.slice(0, 200)`))
  await page.close()
  process.exit(1)
}
// (The gallery plays the demo kit when the island has no spot game yet.)
const title = await page.eval(`document.querySelector('.spot-it h2')?.textContent`)
console.log(`playing "${title}"${ISLAND && title === 'Find the Sheep' ? ` -- the demo kit: ${ISLAND} has no spot game yet` : ''}`)
await snap('intro')
// A tap while the intro is said only ripples.
const b = await board()
await page.tap(b.x + b.w * 0.5, b.y + b.h * 0.2)
await sleep(100)
await snap('intro-tap')
await page.waitFor(`document.querySelector('.spot-it')?.dataset.ready === 'yes'`, 30000)
console.log(`ready after ${Date.now() - t0} ms`)
await snap('ready')

// An empty spot: the point on the board farthest from every thing.
let list = await things()
console.log(`${list.length} things:`, list.map((t) => `${t.id} (reach ${Math.round(t.r)} px)`).join(', '))
let empty = null, best = -1
for (let i = 1; i < 12; i++) for (let j = 1; j < 7; j++) {
  const x = b.x + (b.w * i) / 12, y = b.y + (b.h * j) / 7
  const d = Math.min(...list.map((t) => Math.hypot(t.x - x, t.y - y) - t.r))
  if (d > best) { best = d; empty = [x, y] }
}
if (best > 4) {
  await page.tap(empty[0], empty[1])
  await sleep(140)
  await snap('miss-ripple')
  const after = Number(await page.eval(`document.querySelector('.spot-it').dataset.found`))
  if (after !== 0) console.log(`!! a tap ${Math.round(best)} px clear of everything found something`)
} else console.log('(no empty spot to tap: the things to find fill the picture)')

// Find the first one with a tap near the edge of its reach (80% of the way out, toward the middle of the board).
const first = list[0]
await page.tap(first.x + Math.sign(b.x + b.w / 2 - first.x || 1) * first.r * 0.8, first.y)
await sleep(160)
await snap('found-burst')
await sleep(450)
await snap('found-after')
await sleep(900)
// Tap it again: it hops (and isn't counted twice).
await page.tap(first.x, first.y)
await sleep(140)
await snap('found-again-hop')
console.log('found after a second tap on the same one:', await page.eval(`document.querySelector('.spot-it').dataset.found`))

// Wait without tapping: a hint glows near one still hidden, then closer the next time.
for (let h = 1; h <= 2; h++) {
  const before = (await said()).length
  await page.waitFor(`!!document.querySelector('.spot-hint')`, 20000)
  await sleep(700)
  await snap(`hint-${h}`)
  console.log(`hint ${h}:`, (await said()).slice(before).join(' | '))
  await page.waitFor(`!document.querySelector('.spot-hint')`, 20000)
}

// Find the rest, one by one.
list = await things()
for (const t of list.filter((x) => !x.found)) {
  await page.tap(t.x, t.y)
  await sleep(180)
  await snap(`found-${t.id}`)
  await sleep(1100)
}
for (let k = 0; k < 5; k++) { await sleep(450); await snap(`cheer-${k}`) }
await page.waitFor(`document.querySelector('[data-game-done]')?.dataset.gameDone === 'yes'`, 30000)
await snap('done')
console.log(`finished after ${Date.now() - t0} ms`)
console.log('said:', (await said()).join(' | '))
console.log('errors:', page.errors)
await page.close()
