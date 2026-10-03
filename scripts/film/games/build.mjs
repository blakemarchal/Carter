// Plays Build it with real finger drags and taps, taking a picture at each moment that matters:
//   node scripts/film/games/build.mjs <out dir> [island] [--portrait]
// Without an island it plays the demo kit (#gallery/game/build); with one, that island's kit. It tries
// every rule on the way: a first tap (the narrator says to drag it, and a hand shows where), a part
// dropped on its place too early (back to the tray, "First ..."), a part dropped in the wrong spot (back
// to the tray, its place lights up), eight quiet seconds (a hand carries the next part to its place), a
// second tap (the part flies in), and the rest dragged in a little off-centre (they still snap). Then it
// films the celebration and checks the game finished. It prints what the narrator said, and page errors.
import { mkdirSync } from 'node:fs'
import { launch, sleep } from '../cdp.mjs'

const args = process.argv.slice(2)
const portrait = args.includes('--portrait')
const [OUT, ISLAND] = args.filter((a) => !a.startsWith('--'))
if (!OUT) { console.log('usage: node scripts/film/games/build.mjs <out dir> [island] [--portrait]'); process.exit(1) }
mkdirSync(OUT, { recursive: true })
const page = await launch(portrait ? { width: 820, height: 1180 } : {})
await page.goto(`http://localhost:5179/?s=${Math.random()}#gallery/game/build${ISLAND ? `/${ISLAND}` : ''}`)
await sleep(900)

let n = 0
const snap = async (name) => page.shot(`${OUT}/${String(n++).padStart(2, '0')}-${name}.jpg`)
const t0 = Date.now()
const said = () => page.eval(`(window.__said || []).length`)
const saidSince = (k) => page.eval(`(window.__said || []).slice(${k}).join(' | ')`)
/** The middle and size of the first element matching a selector, on screen. */
const box = (sel) => page.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null
  const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } })()`)
/** A finger's way from a to b, lifting a little in the middle. */
const path = (a, b, k = 20, lift = 50) => Array.from({ length: k + 1 }, (_, i) => [a.x + (b.x - a.x) * (i / k), a.y + (b.y - a.y) * (i / k) - Math.sin((i / k) * Math.PI) * lift])
/** Nothing in the air (a part floating home or flying in). */
const settled = () => page.waitFor(`!document.querySelector('.build-float')`, 10000)
const slots = () => page.eval(`[...document.querySelectorAll('.build-slot:not(.in)')].map((s) => ({ id: s.dataset.part, free: s.dataset.free === 'yes' }))`)

if (!(await page.eval(`!!document.querySelector('.build-it')`))) {
  console.log('no build game here:', await page.eval(`document.body.innerText.slice(0, 200)`))
  await page.close()
  process.exit(1)
}
await snap('intro')
await page.waitFor(`document.querySelector('.build-it')?.dataset.ready === 'yes'`, 30000)
console.log(`ready after ${Date.now() - t0} ms`)
await sleep(600)
await snap('ready')
const parts = await slots()
console.log(`${parts.length} parts:`, parts.map((p) => `${p.id}${p.free ? '' : ' (waits)'}`).join(', '))

// A first tap: the narrator says to drag it, and a hand carries it to its place.
const first = parts.find((p) => p.free)
let k = await said()
let a = await box(`.build-slot[data-part="${first.id}"]`)
await page.tap(a.x, a.y)
await sleep(800)
await snap('tap-hint')
await sleep(2300)
console.log('first tap:', await saidSince(k))

// A part that waits for another, dropped right on its place: back it goes, and the narrator says what's first.
const waiter = parts.find((p) => !p.free)
if (waiter) {
  k = await said()
  a = await box(`.build-slot[data-part="${waiter.id}"]`)
  const b = await box(`[data-place="${waiter.id}"]`)
  await page.drag(path(a, b), 18, { onStep: async (i) => { if (i === 18) await snap('too-soon-over') } })
  await sleep(160)
  await snap('too-soon-back')
  await settled()
  await sleep(1600)
  console.log('too soon:', await saidSince(k))
}

// A free part dropped in the wrong spot (the board's far corner): back to the tray, its place lights up.
{
  k = await said()
  a = await box(`.build-slot[data-part="${first.id}"]`)
  const board = await box('.build-board')
  const corner = { x: board.x - board.w * 0.4, y: board.y - board.h * 0.36 }
  await page.drag(path(a, corner), 18, { onStep: async (i) => { if (i === 14) await snap('carry') } })
  await sleep(200)
  await snap('missed')
  await settled()
  await sleep(600)
  console.log('missed:', await saidSince(k))
}

// Eight quiet seconds: a hand carries the next part to its place.
k = await said()
const quiet = Date.now()
const shown = await page.waitFor(`!!document.querySelector('.drag-hand')`, 20000).then(() => true, () => false)
console.log(shown ? `idle hint after ${((Date.now() - quiet) / 1000).toFixed(1)} s` : 'NO idle hint')
await sleep(500)
await snap('idle-hint')
await sleep(800)
await snap('idle-hint-2')
await sleep(2200)
console.log('idle hint:', await saidSince(k))

// Everything in: the second part by a tap (it flies in), the rest dragged, a little off-centre.
let placed = 0
for (let guard = 0; guard < 40; guard++) {
  await settled()
  const free = (await slots()).filter((p) => p.free)
  if (!free.length) break
  const id = free[0].id
  a = await box(`.build-slot[data-part="${id}"]`)
  const b = await box(`[data-place="${id}"]`)
  k = await said()
  if (placed === 1) {
    await page.tap(a.x, a.y)
    await sleep(380)
    await snap(`fly-${id}`)
    await settled()
    await sleep(150)
    await snap(`flown-${id}`)
  } else {
    const off = { x: b.x + Math.min(34, b.w * 0.22), y: b.y - Math.min(24, b.h * 0.18) }
    await page.drag(path(a, off), 18, { onStep: async (i) => { if (placed === 0 && (i === 7 || i === 18)) await snap(`drag-${id}-${i}`) } })
    if (placed === 0) { await sleep(110); await snap(`snap-${id}`) }
    await sleep(600)
    if (placed < 3) await snap(`in-${id}`)
  }
  const ok = await page.eval(`!!document.querySelector('.build-slot.in[data-part="${id}"]')`)
  console.log(`${id}: ${ok ? 'in' : 'NOT IN'} (${await saidSince(k)})`)
  placed++
  await sleep(500)
}
console.log(`placed ${placed} of ${parts.length}`)

// The celebration.
for (let i = 0; i < 6; i++) { await sleep(450); await snap(`finish-${i}`) }
const finished = await page.waitFor(`document.querySelector('[data-game-done]')?.dataset.gameDone === 'yes'`, 30000).then(() => true, () => false)
await snap('end')
console.log(`finished: ${finished ? 'yes' : 'NO'} after ${Math.round((Date.now() - t0) / 1000)} s`)
console.log('said:', await saidSince(0))
console.log('errors:', page.errors)
await page.close()
