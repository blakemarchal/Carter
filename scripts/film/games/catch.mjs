// Plays Catch it with real finger touches, taking a picture at each moment that matters:
//   node scripts/film/games/catch.mjs <out dir> [island] [--portrait]
// Without an island it plays the demo kit (#gallery/game/catch); with one, that island's kit
// (#gallery/game/catch/<island>). It tries the rules on the way: a touch while the intro is said (nothing
// moves), the hand at the start, a catch by dragging the catcher and one by touching the board (it
// glides over), two misses on purpose (they land softly; the next one comes slower and nearer), standing
// still (the hand comes back), a finger dragged far past the end of the lane (the catcher stops at its
// end), and then catches the rest and films the celebration. It checks that never more than two fall at
// once, and prints what the narrator said and any page errors.
import { mkdirSync } from 'node:fs'
import { launch, sleep } from '../cdp.mjs'

const args = process.argv.slice(2)
const portrait = args.includes('--portrait')
const [OUT, ISLAND] = args.filter((a) => !a.startsWith('--'))
if (!OUT) {
  console.log('usage: node scripts/film/games/catch.mjs <out dir> [island] [--portrait]')
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })
const page = await launch(portrait ? { width: 820, height: 1180 } : {})
await page.goto(`http://localhost:5179/?catch=${Date.now()}#gallery/game/catch${ISLAND ? `/${ISLAND}` : ''}`)
await page.waitFor(`!!document.querySelector('.catch-layer') || /No catch game/.test(document.body.textContent)`, 20000)
if (!(await page.eval(`!!document.querySelector('.catch-layer')`))) {
  console.log(await page.eval(`document.body.textContent`))
  await page.close()
  process.exit(1)
}
const title = await page.eval(`document.querySelector('.catch-it h2')?.textContent`)
// (The gallery plays the demo kit when the island has no catch game yet.)
console.log(`playing "${title}"${ISLAND && title === 'Catch the Rain' ? ` -- the demo kit: ${ISLAND} has no catch game yet` : ''}`)
// (Touches on the board must never press a button: note every button pressed, and where.)
await page.eval(`document.addEventListener('click', (e) => { const b = e.target.closest?.('button'); if (b) (window.__pressed = window.__pressed || []).push(b.getAttribute('aria-label') + ' at ' + Math.round(e.clientX) + ',' + Math.round(e.clientY)) }, true)`)

let n = 0
const t0 = Date.now()
const snap = async (name) => { await page.shot(`${OUT}/${String(n++).padStart(2, '0')}-${name}.jpg`) }
const said = () => page.eval(`(window.__said || []).slice()`)
const check = (ok, what) => console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`)

/** The game as it is now: the catcher, everything falling or caught or resting, in board units and on screen. */
const state = () => page.eval(`(() => {
  const l = document.querySelector('.catch-layer'); if (!l) return { gone: true }
  const m = l.getScreenCTM()
  const scr = (x, y) => { const p = new DOMPoint(x, y).matrixTransform(m); return [Math.round(p.x), Math.round(p.y)] }
  const at = (el) => { const t = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(el?.getAttribute('transform') || ''); return t ? [+t[1], +t[2]] : [NaN, NaN] }
  const [cx] = at(l.querySelector('.catch-catcher'))
  const laneY = +l.dataset.laneY
  return {
    ready: l.dataset.ready === 'yes', finished: l.dataset.finished === 'yes', caught: +l.dataset.caught, goal: +l.dataset.goal,
    missed: +(l.dataset.missed || 0), range: l.dataset.range.split(',').map(Number), laneY, width: +l.dataset.width, scale: m.a,
    cx, catcherScreen: scr(cx, laneY),
    things: [...l.querySelectorAll('.catch-thing')].map((el) => { const [x, y] = at(el); const d = el.dataset
      return { id: +d.id, k: +d.k, state: d.state, help: d.help === 'yes', x, y, x0: +d.x0, cxAtStart: +d.cx, vy: +d.vy, screen: scr(x, y) } }),
    hand: +(document.querySelector('.catch-hand')?.style.opacity || 0),
  }
})()`)
/** A board point on the screen. */
const toScreen = (x, y) => page.eval(`(() => { const m = document.querySelector('.catch-layer').getScreenCTM(); const p = new DOMPoint(${x}, ${y}).matrixTransform(m); return [Math.round(p.x), Math.round(p.y)] })()`)
const falling = (s) => s.things.filter((t) => t.state === 'falling')
/** The falling thing nearest the opening (optionally only one not yet seen). */
const lowest = (s, not = new Set()) => falling(s).filter((t) => !not.has(t.id)).sort((a, b) => b.y - a.y)[0]

// Everything that ever fell, by id: its piece, where it set off, the catcher then, how fast it fell, and
// (from what was seen of its fall) how fast it really went.
const seen = new Map()
let maxFalling = 0
const outOfLane = []
const watch = (s) => {
  if (s.gone) return
  maxFalling = Math.max(maxFalling, falling(s).length)
  if (s.cx < s.range[0] - 0.5 || s.cx > s.range[1] + 0.5) outOfLane.push(Math.round(s.cx))
  for (const t of s.things) {
    let w = seen.get(t.id)
    if (!w) seen.set(t.id, w = { id: t.id, k: t.k, help: t.help, x0: t.x0, cxAtStart: t.cxAtStart, vy: t.vy, ys: [] })
    if (t.state === 'falling') w.ys.push([Date.now(), t.y])
    w.state = t.state
  }
}
/** Board units a second, from what was seen of its fall. */
const seenSpeed = (w) => {
  const ys = w.ys
  if (ys.length < 2) return NaN
  const [a, b] = [ys[0], ys[ys.length - 1]]
  return ((b[1] - a[1]) / (b[0] - a[0])) * 1000
}
/** Watch the game for `ms`, every 120 ms or so. */
const watchFor = async (ms, until) => {
  const end = Date.now() + ms
  while (Date.now() < end) {
    const s = await state()
    watch(s)
    if (until && until(s)) return s
    await sleep(110)
  }
  return state()
}

/** Drag the catcher from where it is to board x `x`, a finger on its body, a step at a time. */
const dragTo = async (x, { onStep, steps } = {}) => {
  const s = await state()
  const from = await toScreen(s.cx, s.laneY + 18)
  const to = await toScreen(x, s.laneY + 18)
  const k = steps ?? Math.max(6, Math.round(Math.abs(to[0] - from[0]) / 14))
  const pts = Array.from({ length: k + 1 }, (_, i) => [Math.round(from[0] + ((to[0] - from[0]) * i) / k), from[1] + Math.round(Math.sin((i / k) * Math.PI) * -6)])
  await page.drag(pts, 16, { onStep })
}
/** Touch the board at board x `x` (at height `y`): the catcher glides over. */
const touchAt = async (x, y) => {
  const p = await toScreen(x, y)
  await page.tap(p[0], p[1], 90)
}

// 1. The intro: a touch now moves nothing.
await snap('intro')
{
  const s = await state()
  await touchAt(s.range[0] + 10, s.laneY - 60)
  await sleep(500)
  const s2 = await state()
  check(Math.abs(s2.cx - s.cx) < 0.5 && !s2.ready, `a touch while the intro is said moves nothing (${s.cx.toFixed(1)} -> ${s2.cx.toFixed(1)})`)
}
await page.waitFor(`document.querySelector('.catch-layer')?.dataset.ready === 'yes'`, 30000)
console.log(`ready after ${Date.now() - t0} ms`)
await snap('ready')

// 2. The hand shows the catcher sliding under the first one.
let s = await watchFor(4000, (x) => x.hand > 0.5)
check(s.hand > 0.5, 'the hand shows how at the start')
await sleep(500)
await snap('start-hand')
await sleep(700)
await snap('start-hand-slid')
check((await said()).some((l) => /^Catch the falling/.test(l)), 'with a line: "Catch the falling…"')

// 3. Catch the first one by dragging the catcher under it.
s = await state()
const first = lowest(s)
await dragTo(first.x0, { onStep: async (i) => { if (i === 4) await snap('dragging') } })
// (Film the catch itself: it drops in, bounces, and the catcher fills a little.)
await watchFor(8000, (x) => x.caught >= 1 || falling(x).some((t) => t.y > x.laneY - 28))
await page.film(OUT, `${String(n++).padStart(2, '0')}-drop-in`, 10, 70)
s = await watchFor(3000, (x) => x.caught >= 1)
check(s.caught === 1, `caught one by dragging (${s.caught} caught)`)
check((await said()).includes('One!'), 'counted "One!"')

// 4. The next by touching the board above it: the catcher glides over.
s = await watchFor(8000, (x) => falling(x).some((t) => t.y > 40))
let next = lowest(s)
const before = s.cx
await touchAt(next.x, Math.max(30, next.y))
await sleep(160)
s = await state()
await snap('glide')
check(Math.abs(s.cx - before) > 2 && Math.abs(s.cx - next.x) > 2, `a touch makes it glide (not jump): ${before.toFixed(0)} -> ${s.cx.toFixed(0)} on the way to ${next.x.toFixed(0)}`)
s = await watchFor(8000, (x) => x.caught >= 2)
check(s.caught === 2, `caught a second by touching the board (${s.caught} caught)`)

// 5. Two misses on purpose: keep the catcher away from everything falling (the place along the lane
// farthest from all of them), until a helping one comes.
const dodgeX = (x) => {
  let best = x.range[0], bestD = -1
  for (let i = 0; i <= 20; i++) {
    const c = x.range[0] + ((x.range[1] - x.range[0]) * i) / 20
    const d = Math.min(...falling(x).filter((t) => !t.help).map((t) => Math.abs(t.x - c)), 1e9)
    if (d > bestD) (bestD = d), (best = c)
  }
  return best
}
const missedBefore = s.missed
const caughtBefore = s.caught
let filmedMiss = 0
{
  const end = Date.now() + 40000
  while (Date.now() < end) {
    s = await state()
    watch(s)
    if (falling(s).some((t) => t.help) || s.caught !== caughtBefore) break
    const near = falling(s).filter((t) => !t.help && Math.abs(t.x - s.cx) < s.width * 1.2 && t.y > s.laneY - 260)
    if (near.length) await touchAt(dodgeX(s), s.laneY + 10)
    const landed = s.things.filter((t) => t.state === 'missed').length
    if (landed && filmedMiss === 0) { filmedMiss++; await sleep(200); await snap('miss-lands') }
    else if (s.missed - missedBefore >= 2 && filmedMiss === 1) { filmedMiss++; await sleep(700); await snap('miss-fades') }
    await sleep(150)
  }
}
s = await state()
check(s.missed - missedBefore >= 2 && s.caught === caughtBefore, `missed on purpose (${s.missed - missedBefore} missed, still ${s.caught} caught)`)
check(!(await said()).some((l) => /oops|try again|missed/i.test(l)), 'no "oops" for a miss')

// 6. The next one comes slower and nearer the catcher.
const helped = falling(s).find((t) => t.help)
check(!!helped, 'after two misses in a row, the next one is a helping one')
if (helped) {
  const normal = [...seen.values()].filter((q) => !q.help)
  const vMin = Math.min(...normal.map((q) => q.vy))
  check(helped.vy < vMin * 0.9, `and falls slower (${helped.vy.toFixed(0)} board units a second; the slowest before was ${vMin.toFixed(0)})`)
  const off = Math.abs(helped.x0 - helped.cxAtStart)
  check(off < s.width / 2 + 60, `and nearer the catcher (${off.toFixed(0)} from it; the catcher is ${s.width} wide)`)
  check(off > s.width / 2 + 18, '(but not right over it: a little move still catches it)')
  await watchFor(1200)
  await snap('helping-one')
}

// 7. Standing still: after about eight seconds without a catch, the hand comes back with a line.
{
  const n0 = (await said()).length
  s = await watchFor(12000, (x) => x.hand > 0.5)
  const late = (await said()).slice(n0)
  check(s.hand > 0.5, 'idle: the hand comes back')
  await sleep(600)
  await snap('idle-hand')
  check(late.some((l) => /Slide under|Catch the falling/.test(l)), `idle: a hint line (${JSON.stringify(late)})`)
}

// 8. A finger dragged far past the end of the lane: the catcher stops at the end.
{
  s = await state()
  const from = await toScreen(s.cx, s.laneY + 18)
  const edge = await toScreen(-200, s.laneY + 18)
  const k = 14
  await page.drag(Array.from({ length: k + 1 }, (_, i) => [Math.round(from[0] + ((Math.max(2, edge[0]) - from[0]) * i) / k), from[1]]), 16)
  await watchFor(900)
  s = await state()
  check(Math.abs(s.cx - s.range[0]) < 0.6, `dragged past the end of the lane, it stops there (${s.cx.toFixed(1)}; the lane's end is ${s.range[0]})`)
  await snap('lane-end')
}

// 9. Catch the rest, by dragging and by touching in turn.
let turn = 0
const filmed = new Set()
while (true) {
  s = await state()
  watch(s)
  if (s.gone || s.finished || s.caught >= s.goal) break
  if (Date.now() - t0 > 240000) { check(false, 'finished in four minutes'); break }
  const t = lowest(s)
  if (!t || t.y < 0) { await sleep(100); continue }
  if (falling(s).length === 2 && !filmed.has('two')) { filmed.add('two'); await snap('two-falling') }
  if (Math.abs(t.x - s.cx) > s.width * 0.25) {
    if (turn++ % 2) await dragTo(t.x)
    else await touchAt(t.x, Math.max(30, t.y))
  }
  await sleep(120)
  const c = (await state()).caught
  if (c === s.goal - 1 && !filmed.has('last')) { filmed.add('last'); await snap('one-to-go') }
}
s = await watchFor(3000, (x) => x.finished)
check(s.finished, `finished (${s.caught} of ${s.goal}, ${s.missed} missed)`)
await sleep(300)
await snap('finish')
for (let k = 0; k < 4; k++) { await sleep(330); await snap(`hop-${k}`) }
await page.waitFor(`document.querySelector('[data-game-done]')?.dataset.gameDone === 'yes'`, 30000).then(
  () => check(true, 'onDone was called'), () => check(false, 'onDone was called'))
await snap('done')

// What was seen along the way.
const all = [...seen.values()].sort((a, b) => a.id - b.id)
const pieces = Math.max(...all.map((w) => w.k)) + 1
check(all.every((w) => w.k === (w.id - 1) % pieces), `the pieces take turns (${all.map((w) => w.k).join(' ')})`)
check(maxFalling <= 2, `never more than two falling at once (at most ${maxFalling})`)
check(!outOfLane.length, `the catcher never left its lane${outOfLane.length ? ` (seen at ${outOfLane.slice(0, 5).join(', ')})` : ''}`)
console.log(`fall speeds, board units a second, in order (h = a helping one): ${all.map((w) => `${Math.round(w.vy)}${w.help ? 'h' : ''}`).join(' ')}`)
const off = all.map((w) => Math.round(seenSpeed(w) - w.vy)).filter((d) => Number.isFinite(d))
console.log(`(as seen on screen, each within ${Math.max(...off.map(Math.abs))} of that)`)
const pressed = await page.eval(`window.__pressed || []`)
check(!pressed.length, `no button was pressed by a touch on the board${pressed.length ? `: ${pressed.join('; ')}` : ''}`)
console.log(`finished after ${Math.round((Date.now() - t0) / 1000)} s`)
console.log('said:', JSON.stringify(await said()))
console.log('errors:', page.errors)
await page.close()
