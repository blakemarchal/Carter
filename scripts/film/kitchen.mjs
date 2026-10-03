// Cook pancakes for Zippy with real finger drags, filming each step.
import { fixture, launch, sleep } from './cdp.mjs'
const OUT = process.argv[2]
const PAL = process.argv[3] ?? 'zippy'
const page = await launch()
const today = new Date().toISOString().slice(0, 10)
await page.goto('http://localhost:5179/')
await page.eval(`localStorage.clear(); localStorage.setItem('carters-ark:profiles', JSON.stringify({ active: 'tester', list: [{ id: 'tester', name: 'Tester', emoji: '🧪' }] }));
  localStorage.setItem('carters-ark:v1:tester', ${JSON.stringify(JSON.stringify(fixture({ today })))}); true`)
await page.goto('http://localhost:5179/')
await sleep(700)
await page.tapOn('button.player')
await sleep(900)
await page.tapOn('.ark-btn')
await sleep(900)
// open this Pal's home, then the kitchen
const cards = await page.eval(`[...document.querySelectorAll('.pal-card')].map((c) => c.textContent)`)
const idx = { zippy: 0, ember: 1, pebble: 2, pip: 3 }[PAL] ?? 0
{ const c = await page.eval(`(() => { const e = document.querySelectorAll('.pal-card')[${idx}]; const r = e.getBoundingClientRect(); return [r.left + r.width/2, r.top + r.height/2] })()`); await page.tap(c[0], c[1]) }
await sleep(900)
await page.tapOn('.big-btn', 'Cook')
await sleep(1500)

const box = (sel, text) => page.eval(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(sel)})].filter((e) => ${text ? `e.textContent.includes(${JSON.stringify(text)})` : 'true'})[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } })()`)
const line = (a, b, n = 18) => Array.from({ length: n + 1 }, (_, i) => [a.x + (b.x - a.x) * (i / n), a.y + (b.y - a.y) * (i / n) - Math.sin((i / n) * Math.PI) * 40])
const step = () => page.eval(`document.querySelector('.k-card .now')?.textContent`)
let frames = 0
const snap = async (name) => { await page.shot(`${OUT}/${String(frames++).padStart(3, '0')}-${name}.jpg`) }
import { mkdirSync } from 'node:fs'
mkdirSync(OUT, { recursive: true })

for (let guard = 0; guard < 8; guard++) {
  const s = await step()
  console.log('step', s)
  if (s === '🥣') {
    // drag ingredients in until the ask is met
    const need = await page.eval(`+document.querySelector('.k-ask b').textContent`)
    // first, a tap: it should show how to drag (a hand carries a see-through copy to the bowl)
    const t = await box('.k-pile .k-thing')
    await page.tap(t.x, t.y)
    for (let k = 0; k < 5; k++) { await sleep(230); await snap(`hint-${k}`) }
    await sleep(1600)
    for (let k = 0; k < need; k++) {
      const from = await box('.k-pile .k-thing')
      const to = await box('.bowl')
      let mid = 0
      await page.drag(line(from, to), 20, { onStep: async (i) => { if (k === 0 && i === 9) await snap('add-dragging') } })
      if (k === 0) { await sleep(90); await snap('add-landing'); await sleep(250); await snap('add-plopped') }
      await sleep(700)
    }
    await snap('add-full')
    await page.tapOn('.big-btn', 'Done')
    await sleep(2500)
  } else if (s === '🥄') {
    await sleep(1200)
    await snap('stir-start')
    const b = await box('.k-stir')
    const cx = b.x, cy = b.y - b.h * 0.1
    const pts = []
    for (let i = 0; i <= 160; i++) { const a = (i / 40) * Math.PI * 2; pts.push([cx + Math.cos(a) * 90, cy + Math.sin(a) * 40]) }
    await page.drag(pts, 22, { onStep: async (i) => { if (i % 20 === 5) await snap(`stir-${i}`) } })
    await sleep(400); await snap('stir-after')
    await sleep(3500)
  } else if (s === '🔥') {
    await sleep(1500)
    await snap('bake-start')
    const from = await box('.k-tray')
    const to = await box('.k-oven')
    await page.drag(line(from, to), 20, { onStep: async (i) => { if (i === 12) await snap('bake-drag') } })
    for (let k = 0; k < 6; k++) { await sleep(500); await snap(`bake-${k}`) }
    await sleep(3500)
  } else if (s === '🔁') {
    await sleep(2500)
    const right = await page.eval(`(() => { const shown = [...document.querySelectorAll('.k-pattern > span:not(.k-slot)')].map((e) => e.textContent); return shown[shown.length - 2] })()`)
    const from = await box('.k-choice', right)
    const to = await box('.k-slot')
    await page.drag(line(from, to), 20, { onStep: async (i) => { if (i === 14) await snap('pattern-drag') } })
    await sleep(200); await snap('pattern-done')
    await sleep(3500)
  } else if (s === '🫙') {
    await sleep(2000)
    const word = await page.eval(`(() => { const t = window.__said || []; const m = t.reverse().find((x) => x.startsWith('Find the jar that says')); return m ? m.replace('Find the jar that says ', '').replace('!', '') : null })()`)
    await page.tapOn('.k-jar', word); await sleep(250); await snap('find-open'); await sleep(3000)
  } else if (s === '🔪') {
    await sleep(2500)
    const said = await page.eval(`(window.__said || []).filter((x) => x.startsWith('Cut the')).pop()`)
    const cut = said.includes('halves') ? 'two halves' : said.includes('triangles') ? 'two triangles' : 'four pieces'
    const c = await page.eval(`(() => { const e = document.querySelector('.k-cut[aria-label="${cut}"]'); const r = e.getBoundingClientRect(); return [r.left + r.width/2, r.top + r.height/2] })()`)
    await page.tap(c[0], c[1])
    for (let k = 0; k < 5; k++) { await sleep(180); await snap(`cut-${k}`) }
    await sleep(3000)
  } else {
    break
  }
}
// serve
await sleep(1500)
await snap('serve-start')
const from = await box('.k-plate')
const to = await box('.k-pal')
if (from && to) {
  await page.drag(line(from, to), 20, { onStep: async (i) => { if (i === 12) await snap('serve-drag') } })
  for (let k = 0; k < 4; k++) { await sleep(300); await snap(`serve-${k}`) }
}
console.log('said:', (await page.eval('window.__said || []')).slice(-6))
console.log('errors:', page.errors)
await page.close()
