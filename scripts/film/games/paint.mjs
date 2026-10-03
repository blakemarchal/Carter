// Plays Paint it with real finger taps and strokes, taking a picture at each moment that matters:
//   node scripts/film/games/paint.mjs <out dir> [island] [--portrait]
// Without an island it plays the demo kit (#gallery/game/paint); with one, that island's kit. It taps a
// region with no paint picked, picks a pot, taps a region with another number, paints one (filming
// the paint spreading), waits for a hint, then paints the rest (with one finger stroke across two
// regions when a number has two, and the last paint carried from its pot) and films the celebration.
// It prints what the narrator said.
import { mkdirSync } from 'node:fs'
import { launch, sleep } from '../cdp.mjs'

const args = process.argv.slice(2)
const portrait = args.includes('--portrait')
const [OUT, ISLAND] = args.filter((a) => !a.startsWith('--'))
if (!OUT) { console.log('usage: node scripts/film/games/paint.mjs <out dir> [island] [--portrait]'); process.exit(1) }
mkdirSync(OUT, { recursive: true })
const page = await launch(portrait ? { width: 820, height: 1180 } : {})
await page.goto(`http://localhost:5179/?s=${Math.random()}#gallery/game/paint${ISLAND ? `/${ISLAND}` : ''}`)
await sleep(900)

let n = 0
const snap = async (name) => page.shot(`${OUT}/${String(n++).padStart(2, '0')}-${name}.jpg`)
const t0 = Date.now()
const said = () => page.eval(`(window.__said || []).slice()`)
const saidSince = async (k) => (await said()).slice(k).join(' | ')
/** Every region's number, on screen: where it's written, and whether it's painted (its number is gone). */
const regions = () => page.eval(`(() => [...document.querySelectorAll('[data-num-for]')].map((g) => {
  const r = g.querySelector('text').getBoundingClientRect()
  return { id: g.dataset.numFor, n: Number(g.dataset.n), x: r.left + r.width / 2, y: r.top + r.height / 2, painted: !!g.querySelector('.gone') }
}))()`)
const pot = (k) => page.eval(`(() => { const b = document.querySelector('.paint-pot[data-n="${k}"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })()`)
// (Once the game is over it's gone from the page: nothing left to paint.)
const left = () => page.eval(`(() => { const g = document.querySelector('.paint-it'); return g ? Number(g.dataset.left) : 0 })()`)

if (!(await page.eval(`!!document.querySelector('.paint-it')`))) {
  console.log('no paint game here:', await page.eval(`document.body.innerText.slice(0, 200)`))
  await page.close()
  process.exit(1)
}
// (The gallery plays the demo kit when the island has no paint game yet.)
const title = await page.eval(`document.querySelector('.paint-it h2')?.textContent`)
console.log(`playing "${title}"${ISLAND && title === 'Paint by Number' ? ` -- the demo kit: ${ISLAND} has no paint game yet` : ''}`)
await snap('intro')
await page.waitFor(`document.querySelector('.paint-it')?.dataset.ready === 'yes'`, 30000)
console.log(`ready after ${Date.now() - t0} ms`)
let list = await regions()
const numbers = [...new Set(list.map((r) => r.n))].sort((a, b) => a - b)
console.log(`${list.length} regions, numbers ${numbers.join(' ')}:`, list.map((r) => `${r.id}=${r.n}`).join(', '))
await snap('ready')

// A region with no paint picked: it says which pot to pick (and that pot glows).
let k = (await said()).length
const a = list[0]
await page.tap(a.x, a.y)
await sleep(300)
await snap('no-pot')
console.log('no pot:', await saidSince(k))
await sleep(1500)

// Pick the pot for another number, then tap region a: a wiggle and a hint.
const other = numbers.find((x) => x !== a.n)
if (other !== undefined) {
  const p = await pot(other)
  k = (await said()).length
  await page.tap(p.x, p.y)
  await sleep(350)
  await snap(`picked-${other}`)
  await sleep(900)
  await page.tap(a.x, a.y)
  await sleep(250)
  await snap('wrong-number')
  console.log('wrong:', await saidSince(k))
  await sleep(1500)
}

// The right pot: region a fills, the paint spreading from the finger.
{
  const p = await pot(a.n)
  await page.tap(p.x, p.y)
  await sleep(900)
  await page.tap(a.x - 6, a.y + 4)
  await sleep(120)
  await snap('spread-early')
  await sleep(200)
  await snap('spread-mid')
  await sleep(700)
  await snap('painted-one')
}

// Wait without painting: the pot for an unpainted region glows, then that region pulses.
k = (await said()).length
await page.waitFor(`!!document.querySelector('.paint-pot.glow')`, 20000)
await sleep(500)
await snap('hint-pot')
await page.waitFor(`!!document.querySelector('.paint-pulse')`, 8000)
await sleep(450)
await snap('hint-region')
console.log('hint:', await saidSince(k))

// Paint the rest, a number at a time. Where a number has two regions or more, one finger stroke
// paints the first two. The last number's paint is carried from its pot: a drag from the pot onto
// one of its regions.
let firstStroke = true
for (const num of numbers) {
  list = (await regions()).filter((r) => r.n === num && !r.painted)
  if (!list.length) continue
  const p = await pot(num)
  if (num === numbers[numbers.length - 1]) {
    const r = list[0]
    const steps = 20
    const pts = Array.from({ length: steps + 1 }, (_, i) => [p.x + ((r.x - p.x) * i) / steps, p.y + ((r.y - p.y) * i) / steps - Math.sin((i / steps) * Math.PI) * 60])
    await page.drag(pts, 26, { onStep: async (i) => { if (i === 12) await snap(`carry-${num}`) } })
    await sleep(800)
    console.log(`carried paint ${num} to ${r.id}:`, (await regions()).find((q) => q.id === r.id)?.painted ? 'painted' : 'NOT painted')
    list = (await regions()).filter((q) => q.n === num && !q.painted)
  } else {
    await page.tap(p.x, p.y)
    await sleep(700)
  }
  if (list.length >= 2) {
    const [r1, r2] = list
    const steps = 18
    const pts = Array.from({ length: steps + 1 }, (_, i) => [r1.x + ((r2.x - r1.x) * i) / steps, r1.y + ((r2.y - r1.y) * i) / steps])
    await page.drag(pts, 22, { onStep: async (i) => { if (firstStroke && i === 14) await snap(`stroke-${num}`) } })
    firstStroke = false
    await sleep(800)
    list = (await regions()).filter((r) => r.n === num && !r.painted)
  }
  for (const r of list) {
    await page.tap(r.x, r.y)
    await sleep(750)
  }
  await snap(`painted-${num}s`)
}
console.log('left to paint:', await left())
for (let i = 0; i < 6; i++) { await sleep(400); await snap(`cheer-${i}`) }
await page.waitFor(`document.querySelector('[data-game-done]')?.dataset.gameDone === 'yes'`, 30000)
await snap('done')
console.log(`finished after ${Date.now() - t0} ms`)
console.log('said:', (await said()).join(' | '))
console.log('errors:', page.errors)
await page.close()
