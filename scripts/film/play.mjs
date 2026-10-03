// Plays one activity on an island with real finger drags, taking pictures along the way.
//   node play.mjs <out dir> <island> <step>
import { mkdirSync } from 'node:fs'
import { fixture, launch, sleep } from './cdp.mjs'
const [OUT, ISLAND, STEP] = process.argv.slice(2)
mkdirSync(OUT, { recursive: true })
const page = await launch()
const today = new Date().toISOString().slice(0, 10)
const fx = fixture({ today })
fx.islandStep = { [ISLAND]: Number(STEP) }
fx.mapAt = ISLAND
await page.goto('http://localhost:5179/')
await page.eval(`localStorage.clear(); localStorage.setItem('ark-pals:profiles', JSON.stringify({ active: 'tester', list: [{ id: 'tester', name: 'Tester', emoji: '🧪' }] }));
  localStorage.setItem('ark-pals:v1:tester', ${JSON.stringify(JSON.stringify(fx))}); true`)
await page.goto('http://localhost:5179/')
await sleep(700)
await page.tapOn('button.player')
await sleep(1000)
// the boat is already at this island: tapping it opens it straight away
const isl = await page.eval(`(() => { const ids = ['noah','creation','david','jonah','loaves','christmas','birthday']; const g = document.querySelectorAll('.map-island')[ids.indexOf('${ISLAND}')]; const r = g.getBoundingClientRect(); return [r.left + r.width/2, r.top + r.height/2] })()`)
await page.tap(isl[0], isl[1])
await sleep(1500)

let n = 0
const snap = async (name) => { await page.shot(`${OUT}/${String(n++).padStart(3, '0')}-${name}.jpg`) }
const boxOf = (expr) => page.eval(`(() => { const e = ${expr}; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } })()`)
const path = (a, b, k = 16, lift = 40) => Array.from({ length: k + 1 }, (_, i) => [a.x + (b.x - a.x) * (i / k), a.y + (b.y - a.y) * (i / k) - Math.sin((i / k) * Math.PI) * lift])
const kind = await page.eval(`document.querySelector('.island-body .activity, .island-body .story')?.className`)
console.log('activity:', kind)
const waitIdle = (ms = 400) => sleep(ms)

if (kind.includes('two-by-two')) {
  await sleep(2500)
  for (let round = 0; round < 6; round++) {
    const pair = await page.eval(`(() => { const cs = [...document.querySelectorAll('.pair-card:not(.boarded)')].filter((c) => c.style.visibility !== 'hidden'); for (const a of cs) for (const b of cs) if (a !== b && a.textContent === b.textContent) return [a.dataset.card, b.dataset.card]; return null })()`)
    if (!pair) break
    const a = await boxOf(`document.querySelector('[data-card="${pair[0]}"]')`)
    const b = await boxOf(`document.querySelector('[data-card="${pair[1]}"]')`)
    await page.drag(path(a, b), 20, { onStep: async (i) => { if (round === 0 && (i === 8 || i === 15)) await snap(`pairs-drag-${i}`) } })
    if (round === 0) for (let k = 0; k < 6; k++) { await sleep(110); await snap(`pairs-board-${k}`) }
    await sleep(1800)
  }
  for (let k = 0; k < 8; k++) { await sleep(700); await snap(`pairs-count-${k}`) }
} else if (kind.includes('sequence')) {
  await sleep(3000)
  for (let guard = 0; guard < 30; guard++) {
    const next = await boxOf(`document.querySelector('.seq-slot.next')`)
    if (!next) break
    const cards = await page.eval(`[...document.querySelectorAll('.seq-card:not(.used)')].map((c, i) => i)`)
    let placed = false
    for (const i of cards) {
      const before = await page.eval(`document.querySelectorAll('.seq-slot.filled').length`)
      const c = await boxOf(`document.querySelectorAll('.seq-card:not(.used)')[${i}]`)
      if (!c) continue
      await page.drag(path(c, next), 18, { onStep: async (k) => { if (guard === 0 && k === 12) await snap(`seq-drag-${i}`) } })
      await sleep(guard === 0 ? 150 : 600); if (guard === 0) await snap(`seq-after-${i}`)
      await sleep(900)
      if ((await page.eval(`document.querySelectorAll('.seq-slot.filled').length`)) > before) { placed = true; break }
    }
    if (!placed) break
  }
  await snap('seq-done')
} else if (kind.includes('sort')) {
  await sleep(4500)
  for (let guard = 0; guard < 12; guard++) {
    const card = await boxOf(`document.querySelector('.sort-card')`)
    if (!card) break
    const bins = await page.eval(`document.querySelectorAll('.sort-bin').length`)
    for (let b = 0; b < bins; b++) {
      const bin = await boxOf(`document.querySelectorAll('.sort-bin')[${b}]`)
      const c2 = await boxOf(`document.querySelector('.sort-card')`)
      if (!c2) break
      await page.drag(path(c2, bin), 18, { onStep: async (k) => { if (guard === 0 && k === 12) await snap(`sort-drag-${b}`) } })
      await sleep(150); if (guard === 0) await snap(`sort-after-${b}`)
      await sleep(1600)
      if (!(await page.eval(`!!document.querySelector('.sort-card')`))) { await sleep(1500); break }
    }
  }
  await snap('sort-done')
} else if (kind.includes('count-basket')) {
  await sleep(4000)
  for (let round = 0; round < 4; round++) {
    const need = await page.eval(`+document.querySelector('.count-goal b')?.textContent`)
    if (!need) break
    for (let k = 0; k < need; k++) {
      const a = await boxOf(`document.querySelector('.count-pile .count-thing')`)
      const b = await boxOf(`document.querySelector('.count-bin')`)
      await page.drag(path(a, b), 18, { onStep: async (i) => { if (round === 0 && k === 0 && i === 10) await snap('count-drag') } })
      if (round === 0 && k === 0) { await sleep(120); await snap('count-plop') }
      await sleep(650)
    }
    if (round === 0) {
      // take one out again by dragging it back to the pile, then put it back
      const inside = await boxOf(`document.querySelector('.count-in span')`)
      const pile = await boxOf(`document.querySelector('.count-pile')`)
      await page.drag(path(inside, pile), 18, { onStep: async (i) => { if (i === 10) await snap('count-out-drag') } })
      await sleep(700); await snap('count-out')
      const a = await boxOf(`document.querySelector('.count-pile .count-thing')`)
      const b = await boxOf(`document.querySelector('.count-bin')`)
      await page.drag(path(a, b), 18)
      await sleep(700)
    }
    await snap(`count-full-${round}`)
    await page.tapOn('.big-btn', 'Done')
    await sleep(3500)
  }
} else if (kind.includes('maze')) {
  await sleep(3000)
  // Work out the maze from its walls, then drag the hero along the path.
  const route = await page.eval(`(() => {
    const W = 6, H = 4; const cells = [...document.querySelectorAll('.maze-cell')];
    const open = (c, side) => cells[c].style['border' + side + 'Color'] === 'transparent';
    const nb = (c) => { const r = []; if (c >= W && open(c, 'Top')) r.push(c - W); if (c < W * (H - 1) && open(c, 'Bottom')) r.push(c + W); if (c % W && open(c, 'Left')) r.push(c - 1); if (c % W < W - 1 && open(c, 'Right')) r.push(c + 1); return r };
    const prev = { 0: -1 }; const q = [0];
    while (q.length) { const c = q.shift(); for (const n of nb(c)) if (!(n in prev)) { prev[n] = c; q.push(n) } }
    const p = []; for (let c = W * H - 1; c !== -1; c = prev[c]) p.unshift(c);
    return p.map((c) => { const r = cells[c].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })
  })()`)
  const pts = []
  for (let i = 0; i < route.length - 1; i++) for (let k = 0; k < 6; k++) pts.push([route[i][0] + (route[i + 1][0] - route[i][0]) * (k / 6), route[i][1] + (route[i + 1][1] - route[i][1]) * (k / 6)])
  pts.push(route[route.length - 1])
  await page.drag(pts, 45, { onStep: async (i) => { if (i % 12 === 3) await snap(`maze-${i}`) } })
  for (let k = 0; k < 3; k++) { await sleep(250); await snap(`maze-end-${k}`) }
} else if (kind.includes('verse')) {
  // While it's read aloud every slot shows its words: note the order.
  await page.waitFor(`[...document.querySelectorAll('.verse-slot')].every((s) => s.textContent !== '…')`, 20000)
  const order = await page.eval(`[...document.querySelectorAll('.verse-slot')].map((s) => s.textContent)`)
  console.log('verse:', order)
  await page.waitFor(`!!document.querySelector('.verse-slot.next')`, 40000)
  for (let i = 0; i < order.length; i++) {
    const chip = await boxOf(`[...document.querySelectorAll('.verse-chip:not(.used)')].find((c) => c.textContent === ${JSON.stringify(order[i])})`)
    const slot = await boxOf(`document.querySelector('.verse-slot.next')`)
    if (!chip || !slot) break
    await page.drag(path(chip, slot), 18, { onStep: async (k) => { if (i < 2 && k === 12) await snap(`verse-drag-${i}`) } })
    await sleep(120); if (i < 2) await snap(`verse-after-${i}`)
    await sleep(1800)
  }
  await snap('verse-done')
} else if (kind.includes('battle')) {
  await sleep(1000)
  for (let k = 0; k < 6; k++) { await sleep(400); await snap(`battle-intro-${k}`) }
  for (let guard = 0; guard < 40; guard++) {
    const phase = await page.eval(`document.querySelector('.battle').className`)
    if (phase.includes('phase-team')) { await page.tapOn('.team-card'); await sleep(2500); continue }
    if (phase.includes('phase-pick')) { const b = await page.eval(`[...document.querySelectorAll('.move-btn')].findIndex((b) => !b.className.includes('locked') && !b.className.includes('charging'))`); const c = await boxOf(`document.querySelectorAll('.move-btn')[${b}]`); await page.tap(c.x, c.y); await sleep(1500); continue }
    if (phase.includes('phase-question')) {
      const nChoices = await page.eval(`document.querySelectorAll('.q-choice').length`)
      for (let i = 0; i < nChoices; i++) {
        const c = await boxOf(`document.querySelectorAll('.q-choice')[${i}]`)
        if (!c) break
        await page.tap(c.x, c.y)
        await sleep(400)
        if (!(await page.eval(`document.querySelector('.battle').className.includes('phase-question')`)) || (await page.eval(`!!document.querySelector('.q-choice.right')`))) break
      }
      // the move: film it
      const film = guard < 12
      for (let k = 0; k < 9; k++) { await sleep(200); if (film) await snap(`battle-move-${guard}-${k}`) }
      continue
    }
    if (phase.includes('phase-ask')) {
      await sleep(2500)
      const ball = await boxOf(`document.querySelector('.throw-grab')`)
      const foe = await boxOf(`document.querySelector('.foe-body')`)
      await page.drag(path(ball, foe, 20, 120), 22, { onStep: async (i) => { if (i % 5 === 0) await snap(`battle-throw-drag-${i}`) } })
      for (let k = 0; k < 12; k++) { await sleep(250); await snap(`battle-catch-${k}`) }
      break
    }
    await sleep(700)
  }
}
console.log('errors:', page.errors)
await page.close()
