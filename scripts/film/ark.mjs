// The Ark: feed and dress a Pal by dragging, the sticker book, hatching the egg, and a Pal growing up.
import { mkdirSync } from 'node:fs'
import { fixture, launch, sleep } from './cdp.mjs'
const OUT = process.argv[2]
mkdirSync(OUT, { recursive: true })
const page = await launch()
const today = new Date().toISOString().slice(0, 10)
const fx = fixture({ today })
fx.egg = { warmth: 3, day: '' } // ready to hatch
fx.pals.ember = 10
await page.goto('http://localhost:5179/')
await page.eval(`localStorage.clear(); localStorage.setItem('carters-ark:profiles', JSON.stringify({ active: 'tester', list: [{ id: 'tester', name: 'Tester', emoji: '🧪' }] }));
  localStorage.setItem('carters-ark:v1:tester', ${JSON.stringify(JSON.stringify(fx))}); true`)
await page.goto('http://localhost:5179/')
await sleep(700)
await page.tapOn('button.player')
await sleep(900)
await page.tapOn('.ark-btn')
await sleep(1200)
let n = 0
const snap = async (name) => { await page.shot(`${OUT}/${String(n++).padStart(3, '0')}-${name}.jpg`) }
const boxOf = (expr) => page.eval(`(() => { const e = ${expr}; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })()`)
const path = (a, b, k = 16, lift = 50) => Array.from({ length: k + 1 }, (_, i) => [a.x + (b.x - a.x) * (i / k), a.y + (b.y - a.y) * (i / k) - Math.sin((i / k) * Math.PI) * lift])
await snap('ark')

// Ember's home (second card): feed by dragging a berry, then dress up by dragging a bow
const card = await boxOf(`document.querySelectorAll('.pal-card')[1]`)
await page.tap(card.x, card.y)
await sleep(1500)
await snap('home')
const berry = await boxOf(`document.querySelector('.home-box .home-btn')`)
const pal = await boxOf(`document.querySelector('.home-pal')`)
await page.drag(path(berry, pal), 20, { onStep: async (i) => { if (i === 10 || i === 16) await snap(`feed-drag-${i}`) } })
for (let k = 0; k < 4; k++) { await sleep(160); await snap(`feed-${k}`) }
await sleep(1500)
const bow = await boxOf(`document.querySelectorAll('.home-box')[1].querySelector('.home-btn')`)
await page.drag(path(bow, pal), 20, { onStep: async (i) => { if (i === 12) await snap('dress-drag') } })
for (let k = 0; k < 3; k++) { await sleep(200); await snap(`dress-${k}`) }
await sleep(1500)
// back to the Ark; the sticker book
await page.tapOn('.pal-home .back')
await sleep(900)
await page.tapOn('.ark-btn', 'Stickers')
await sleep(1500)
await snap('stickers')
const st = await boxOf(`document.querySelector('.tray-sticker')`)
const scene = await boxOf(`document.querySelector('.sticker-scene')`)
if (st && scene) {
  await page.drag(path(st, { x: scene.x + 120, y: scene.y - 40 }, 20, 30), 20, { onStep: async (i) => { if (i === 5 || i === 14) await snap(`sticker-drag-${i}`) } })
  await sleep(300); await snap('sticker-placed')
}
await page.tapOn('.sticker-book .back')
await sleep(900)
// hatch the egg
await page.tapOn('.egg-card')
for (let k = 0; k < 14; k++) { await sleep(350); await snap(`hatch-${k}`) }
await sleep(1500)
console.log('errors:', page.errors)
await page.close()
