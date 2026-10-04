// Plays Steer it with real finger drags, taking a picture at each moment that matters:
//   node scripts/film/games/steer.mjs <out dir> [island] [--portrait]
// Without an island it plays the demo kit (#gallery/game/steer); with one, that island's kit
// (#gallery/game/steer/<island>). It tries the rules on the way: a touch away from the hero, a finger
// that races far ahead (the hero mustn't jump), a slide backwards (nothing undone), standing still
// (the hand comes back), and then leads the hero all the way to the goal.
import { mkdirSync } from 'node:fs'
import { launch, sleep } from '../cdp.mjs'

const args = process.argv.slice(2)
const portrait = args.includes('--portrait')
const [OUT, ISLAND] = args.filter((a) => !a.startsWith('--'))
if (!OUT) {
  console.log('usage: node scripts/film/games/steer.mjs <out dir> [island] [--portrait]')
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })
const page = await launch(portrait ? { width: 820, height: 1180 } : {})
await page.goto(`http://localhost:5179/?steer=${Date.now()}#gallery/game/steer${ISLAND ? `/${ISLAND}` : ''}`)
await page.waitFor(`!!document.querySelector('.steer-layer') || /No steer game/.test(document.body.textContent)`, 20000)
if (!(await page.eval(`!!document.querySelector('.steer-layer')`))) {
  console.log(await page.eval(`document.body.textContent`))
  await page.close()
  process.exit(1)
}

let n = 0
const snap = async (name) => { await page.shot(`${OUT}/${String(n++).padStart(2, '0')}-${name}.jpg`) }
const state = () => page.eval(`(() => { const l = document.querySelector('.steer-layer'); return l ? { p: +l.dataset.progress, taken: +l.dataset.taken, finished: l.dataset.finished } : { gone: true } })()`)
const said = () => page.eval(`window.__said || []`)
const check = (ok, what) => console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`)

// The way on screen (the game publishes it in board units).
const way = await page.eval(`(() => { const l = document.querySelector('.steer-layer'); const m = l.getScreenCTM();
  return l.dataset.way.split(' ').map((xy) => { const [x, y] = xy.split(',').map(Number); const p = new DOMPoint(x, y).matrixTransform(m); return [p.x, p.y] }) })()`)
const cum = [0]
for (let i = 1; i < way.length; i++) cum.push(cum[i - 1] + Math.hypot(way[i][0] - way[i - 1][0], way[i][1] - way[i - 1][1]))
const total = cum[cum.length - 1]
/** The screen point `d` px along the way. */
const along = (d) => {
  d = Math.max(0, Math.min(total, d))
  let i = 0
  while (i < way.length - 2 && cum[i + 1] < d) i++
  const k = (d - cum[i]) / (cum[i + 1] - cum[i] || 1)
  return [Math.round(way[i][0] + (way[i + 1][0] - way[i][0]) * k), Math.round(way[i][1] + (way[i + 1][1] - way[i][1]) * k)]
}
const heroD = async () => (await state()).p * total
/** A finger drag along the way from `from` to `to` (px along it), `step` px at a time. */
const dragAlong = (from, to, { step = 5, ms = 16, onStep } = {}) => {
  const pts = []
  const dir = to >= from ? 1 : -1
  for (let d = from; dir * (to - d) > 0; d += dir * step) pts.push(along(d))
  pts.push(along(to))
  return page.drag(pts, ms, { onStep })
}
console.log(`the way: ${way.length} points, ${Math.round(total)} px on screen`)

// 1. The intro, then the hand shows the way.
await page.waitFor(`!!document.querySelector('.steer-halo')`, 25000)
await snap('intro-said')
await sleep(900)
await snap('hand-shows-the-way')
await sleep(3800)

// 2. A touch away from the hero (on the goal): the hero hops and the hand shows where to start.
const goal = way[way.length - 1]
await page.tap(Math.round(goal[0]), Math.round(goal[1]))
await sleep(350)
await snap('touch-elsewhere')
await sleep(700)
await snap('touch-elsewhere-hand')
check((await said()).some((l) => /Start here/.test(l)), 'a touch away from the hero gets "Start here"')
check((await state()).p === 0, 'and moves nothing')
await sleep(4200)

// 3. Lead the hero a third of the way, filming as it goes.
let d0 = await heroD()
await dragAlong(d0, total * 0.33, { onStep: async (i) => { if (i % 22 === 11) await snap(`leading-${i}`) } })
await sleep(600)
const p1 = (await state()).p
check(p1 > 0.28 && p1 < 0.4, `led a third of the way (progress ${p1})`)
await snap('a-third')

// 4. A finger that races far ahead in one jump: the hero walks, it doesn't jump. (The finger lands well
// short of the goal, so on a short way the hero can't arrive and end the game before the rest is tried.)
d0 = await heroD()
const farD = Math.min(total * 0.8, d0 + total * 0.6)
const far = along(farD)
const start = along(d0)
await page.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start[0], y: start[1] }] })
await sleep(40)
await page.s('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: far[0], y: far[1] }] })
await sleep(120)
const pJump = (await state()).p
// (Let go before the picture: a slow screenshot mustn't keep the finger down.)
await page.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
await snap('finger-raced-ahead')
await sleep(1500)
const pAfterJump = (await state()).p
const pFinger = farD / total
// (At most a top-speed walk for the 0.12 s: never most of the way at once.)
check(pJump - p1 < 0.15, `no jump: 0.12 s after the finger leapt ahead, progress went ${p1} -> ${pJump}`)
check(pAfterJump > pJump + 0.01 && pAfterJump <= pFinger + 0.005, `and it walked on (to ${pAfterJump}), never past the finger (at ${pFinger.toFixed(3)})`)

// 5. Sliding backwards undoes nothing (and, held there, gets a "This way!").
d0 = await heroD()
await dragAlong(d0, Math.max(0, d0 - 150), { step: 6, ms: 18 })
const pBack = (await state()).p
check(Math.abs(pBack - pAfterJump) < 0.005, `sliding back undoes nothing (${pAfterJump} -> ${pBack})`)
{
  const from = along(d0), back = along(Math.max(0, d0 - 150))
  await page.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from[0], y: from[1] }] })
  for (let k = 1; k <= 8; k++) {
    await sleep(20)
    await page.s('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from[0] + ((back[0] - from[0]) * k) / 8, y: from[1] + ((back[1] - from[1]) * k) / 8 }] })
  }
  await sleep(1300)
  await snap('held-backwards')
  await page.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}
check((await said()).some((l) => /This way/.test(l)), 'held backwards: "This way!"')

// 6. Standing still: after about eight seconds the hand shows the way again, with a line.
const before = (await said()).length
await sleep(8600)
await snap('idle-hand')
await sleep(900)
await snap('idle-hand-2')
const late = (await said()).slice(before)
check(late.some((l) => /glowing path/.test(l)), `idle: a hint line (${JSON.stringify(late)})`)

// 7. All the way to the goal.
d0 = await heroD()
await dragAlong(d0, total, { onStep: async (i) => { if (i % 30 === 15) await snap(`on-to-the-goal-${i}`) } })
await page.waitFor(`document.querySelector('.steer-layer')?.dataset.finished === 'yes'`, 5000).catch(() => {})
const end = await state()
check(end.finished === 'yes', `finished (progress ${end.p}, picked up ${end.taken})`)
await snap('at-the-goal')
for (let k = 0; k < 4; k++) { await sleep(300); await snap(`cheer-${k}`) }
await page.waitFor(`document.querySelector('[data-game-done]')?.dataset.gameDone === 'yes'`, 30000).then(
  () => check(true, 'onDone was called'), () => check(false, 'onDone was called'))
await snap('done')
console.log('said:', JSON.stringify(await said()))
console.log('errors:', page.errors)
await page.close()
