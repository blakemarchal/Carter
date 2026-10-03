// Plays Share it with real finger drags and taps, taking a picture at each moment that matters:
//   node scripts/film/games/share.mjs <out dir> [island] [--portrait]
// Without an island it plays the demo kit (#gallery/game/share); with one, that island's kit. Round one:
// a first tap (the narrator says to drag it, and a hand shows where), then everything onto the plates
// unevenly (the uneven plates wiggle: "Hmm, some plates have more"), then one moved from the fullest plate
// to the emptiest (fair: one plate is counted aloud). Round two: eight quiet seconds (a hand carries one to
// the plate with the fewest), a tap (it hops onto the plate with the fewest), one taken back to the basket
// and handed out again, and the rest dealt round. Later rounds are dealt round. Then it films the
// celebration and checks the game finished. It prints what the narrator said, and page errors.
import { mkdirSync } from 'node:fs'
import { launch, sleep } from '../cdp.mjs'

const args = process.argv.slice(2)
const portrait = args.includes('--portrait')
const [OUT, ISLAND] = args.filter((a) => !a.startsWith('--'))
if (!OUT) { console.log('usage: node scripts/film/games/share.mjs <out dir> [island] [--portrait]'); process.exit(1) }
mkdirSync(OUT, { recursive: true })
const page = await launch(portrait ? { width: 820, height: 1180 } : {})
await page.goto(`http://localhost:5179/?s=${Math.random()}#gallery/game/share${ISLAND ? `/${ISLAND}` : ''}`)
await sleep(900)

let n = 0
const snap = async (name) => page.shot(`${OUT}/${String(n++).padStart(2, '0')}-${name}.jpg`)
const t0 = Date.now()
const said = () => page.eval(`(window.__said || []).length`)
const saidSince = (k) => page.eval(`(window.__said || []).slice(${k}).join(' | ')`)
/** The middle of an element on screen (the i-th match of a selector). */
const box = (sel, i = 0) => page.eval(`(() => { const e = document.querySelectorAll(${JSON.stringify(sel)})[${i}]; if (!e) return null
  const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } })()`)
/** A finger's way from a to b, lifting a little in the middle. */
const path = (a, b, k = 16, lift = 40) => Array.from({ length: k + 1 }, (_, i) => [a.x + (b.x - a.x) * (i / k), a.y + (b.y - a.y) * (i / k) - Math.sin((i / k) * Math.PI) * lift])
const state = () => page.eval(`(() => ({
  round: Number(document.querySelector('.share-it')?.dataset.round),
  busy: document.querySelector('.share-it')?.dataset.busy === 'yes',
  pile: document.querySelectorAll('.share-pile .share-thing').length,
  plates: [...document.querySelectorAll('.share-zone')].map((z) => z.querySelectorAll('.share-thing').length),
}))()`)
const idle = () => page.waitFor(`document.querySelector('.share-it')?.dataset.busy === 'no'`, 40000)
const plate = (i) => box(`.share-zone[data-plate="${i}"] .share-plate`)
/** Drags the first thing in the basket onto plate i. */
const give = async (i, onStep) => {
  const a = await box('.share-pile .share-thing')
  const b = await plate(i)
  if (!a || !b) return false
  await page.drag(path(a, b), 16, { onStep })
  await sleep(380)
  return true
}
/** Drags the top thing on plate `from` to plate `to` (or 'pile'). */
const shift = async (from, to, onStep) => {
  const on = await page.eval(`document.querySelectorAll('.share-zone[data-plate="${from}"] .share-thing').length`)
  const a = await box(`.share-zone[data-plate="${from}"] .share-thing`, on - 1)
  const b = to === 'pile' ? await box('.share-pile') : await plate(to)
  if (!a || !b) return false
  await page.drag(path(a, b), 16, { onStep })
  await sleep(380)
  return true
}

if (!(await page.eval(`!!document.querySelector('.share-it')`))) {
  console.log('no share game here:', await page.eval(`document.body.innerText.slice(0, 200)`))
  await page.close()
  process.exit(1)
}
await snap('intro')
await idle()
console.log(`ready after ${Date.now() - t0} ms`)
await sleep(500)
await snap('ready')

let roundsPlayed = 0
for (let guard = 0; guard < 8; guard++) {
  await idle().catch(() => {})
  let s = await state()
  if (await page.eval(`document.querySelector('[data-game-done]')?.dataset.gameDone === 'yes'`)) break
  const r = s.round
  const people = s.plates.length
  const each = s.pile / people
  console.log(`round ${r + 1}: ${s.pile} to share among ${people}, ${each} each`)
  let k = await said()
  if (roundsPlayed === 0) {
    // A first tap: how to drag.
    const a = await box('.share-pile .share-thing')
    await page.tap(a.x, a.y)
    await sleep(700)
    await snap('tap-hint')
    await sleep(2200)
    console.log('first tap:', await saidSince(k))
    // Everything onto the plates, unevenly: one too many on the first, one too few on the last.
    const plan = Array.from({ length: people }, (_, i) => each + (i === 0 ? 1 : i === people - 1 ? -1 : 0))
    let first = true
    for (let i = 0; i < people; i++) {
      for (let j = 0; j < plan[i]; j++) {
        await give(i, first ? async (step) => { if (step === 9) await snap('drag') } : undefined)
        if (first) await snap('given')
        first = false
      }
    }
    await sleep(250)
    await snap('unfair')
    await sleep(500)
    await snap('unfair-wiggle')
    await sleep(2500)
    console.log('uneven:', await saidSince(k))
    // Even it out: one from the fullest plate to the emptiest.
    k = await said()
    await shift(0, people - 1, async (step) => { if (step === 9) await snap('evening-out') })
    for (let i = 0; i < 4; i++) { await sleep(500); await snap(`fair-${i}`) }
  } else if (roundsPlayed === 1) {
    // Eight quiet seconds: a hand carries one to the plate with the fewest.
    const quiet = Date.now()
    const shown = await page.waitFor(`!!document.querySelector('.drag-hand')`, 20000).then(() => true, () => false)
    console.log(shown ? `idle hint after ${((Date.now() - quiet) / 1000).toFixed(1)} s` : 'NO idle hint')
    await sleep(500)
    await snap('idle-hint')
    await sleep(2400)
    console.log('idle hint:', await saidSince(k))
    // A tap: it hops onto the plate with the fewest.
    k = await said()
    const a = await box('.share-pile .share-thing')
    await page.tap(a.x, a.y)
    await sleep(260)
    await snap('tap-fly')
    await sleep(900)
    await snap('tap-flown')
    // One back to the basket, then handed out again.
    s = await state()
    const from = s.plates.findIndex((c) => c > 0)
    await shift(from, 'pile', async (step) => { if (step === 9) await snap('back-to-basket') })
    await snap('in-basket')
    // The rest, dealt round the plates.
    for (let g = 0; g < 40; g++) {
      s = await state()
      if (!s.pile || s.busy) break
      const to = s.plates.indexOf(Math.min(...s.plates))
      await give(to)
    }
    for (let i = 0; i < 3; i++) { await sleep(600); await snap(`fair-r2-${i}`) }
  } else {
    for (let g = 0; g < 40; g++) {
      s = await state()
      if (!s.pile || s.busy) break
      const to = s.plates.indexOf(Math.min(...s.plates))
      await give(to)
    }
    await sleep(500)
    await snap(`dealt-r${r + 1}`)
  }
  s = await state()
  console.log(`  plates: ${s.plates.join(', ')}`)
  roundsPlayed++
  // On to the next round (or the end, filming the celebration).
  const last = r + 1 >= (await page.eval(`document.querySelectorAll('.share-rounds span').length`))
  const over = `(() => { const g = document.querySelector('.share-it'); return !g || Number(g.dataset.round) !== ${r} })()`
  for (let i = 0; last && i < 14 && !(await page.eval(over)); i++) { await snap(`finish-${i}`); await sleep(600) }
  await page.waitFor(over, 40000).catch(() => console.log('  (the round did not end)'))
  console.log(`  said: ${await saidSince(k)}`)
}
console.log(`played ${roundsPlayed} rounds`)
const finished = await page.waitFor(`document.querySelector('[data-game-done]')?.dataset.gameDone === 'yes'`, 40000).then(() => true, () => false)
await snap('end')
console.log(`finished: ${finished ? 'yes' : 'NO'} after ${Math.round((Date.now() - t0) / 1000)} s`)
console.log('said:', await saidSince(0))
console.log('errors:', page.errors)
await page.close()
