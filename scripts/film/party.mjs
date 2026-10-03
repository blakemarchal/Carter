// Plays a whole birthday party (a made-up family whose child's birthday is today), taking pictures:
//   node scripts/film/party.mjs <out dir>
import { mkdirSync } from 'node:fs'
import { fixture, launch, sleep } from './cdp.mjs'
const [OUT] = process.argv.slice(2)
mkdirSync(OUT, { recursive: true })
const page = await launch()
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const fx = fixture({ today })
const profiles = {
  active: 'robin',
  list: [
    { id: 'robin', name: 'Robin', emoji: '🦁', birthday: { month: now.getMonth() + 1, day: now.getDate() }, look: { skin: 'tan', hair: 'pigtails', hairColor: '#2b1d14', color: '#8d7cff' } },
    { id: 'jo', name: 'Jo', emoji: '🐳' },
    { id: 'dad', name: 'Dad', emoji: '🧪' },
  ],
}
const family = { mom: 'Mama', dad: 'Papa', siblings: [{ name: 'Bean', baby: true }], pets: [{ name: 'Biscuit', emoji: '🐶' }] }
await page.goto('http://localhost:5179/')
await page.eval(`localStorage.clear();
  localStorage.setItem('ark-pals:profiles', ${JSON.stringify(JSON.stringify(profiles))});
  localStorage.setItem('ark-pals:family', ${JSON.stringify(JSON.stringify(family))});
  localStorage.setItem('ark-pals:v1:robin', ${JSON.stringify(JSON.stringify(fx))}); true`)
await page.goto('http://localhost:5179/')
await sleep(800)

let n = 0
const snap = async (name) => { await page.shot(`${OUT}/${String(n++).padStart(3, '0')}-${name}.jpg`) }
const boxOf = (expr) => page.eval(`(() => { const e = ${expr}; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } })()`)
const path = (a, b, k = 16, lift = 40) => Array.from({ length: k + 1 }, (_, i) => [a.x + (b.x - a.x) * (i / k), a.y + (b.y - a.y) * (i / k) - Math.sin((i / k) * Math.PI) * lift])
const said = () => page.eval(`(window.__said || []).slice(-3).join(' | ')`)

await snap('title')
await page.tapOn('button.player', 'Robin')
await page.waitFor(`!!document.querySelector('.party-surprise')`, 8000)
for (const t of [300, 900, 1800]) { await sleep(t === 300 ? 300 : 600); await snap(`surprise-${t}`) }
await page.waitFor(`!!document.querySelector('.party-surprise .big-btn.pulse')`, 15000)
console.log('said:', await said())
await page.tapOn('.party-surprise .big-btn')
await page.waitFor(`!!document.querySelector('.party-age')`)
await sleep(500); await snap('age')
await page.tapOn('.age-btn', '5')
await page.waitFor(`!!document.querySelector('.candle-step')`)
await sleep(2500); await snap('candles')
for (let i = 0; i < 5; i++) {
  const c = await boxOf(`document.querySelector('.tray-candle')`)
  const cake = await boxOf(`document.querySelector('.party-cake')`)
  await page.drag(path(c, cake, 16, 60), 18, { onStep: async (k) => { if (i === 0 && k === 12) await snap('candle-drag') } })
  await sleep(700)
  if (i === 1) await snap('candles-2')
}
await sleep(400); await snap('candles-5')
await page.waitFor(`!!document.querySelector('.party-song')`, 15000)
await sleep(1500); await snap('song-start')
await page.waitFor(`!!document.querySelector('.sing-now .w.now')`, 30000)
await sleep(600); await snap('song-line1')
await page.waitFor(`!!document.querySelector('.their-name.sung')`, 30000)
await sleep(300); await snap('song-name')
console.log('said at the name:', await said())
await page.waitFor(`!!document.querySelector('.party-cake.blowable')`, 30000)
await sleep(1500); await snap('blow')
for (let i = 0; i < 4; i++) {
  if (!(await page.eval(`!!document.querySelector('.party-cake.blowable')`))) break
  const cake = await boxOf(`document.querySelector('.party-cake.blowable')`)
  await page.tap(cake.x - cake.w * 0.2 + i * cake.w * 0.15, cake.y - cake.h * 0.3)
  await sleep(350); await snap(`blow-${i}`)
}
await page.waitFor(`!!document.querySelector('.story')`, 15000)
for (let i = 0; i < 7; i++) {
  await sleep(1500); await snap(`story-${i + 1}`)
  if (i === 0 || i === 3) console.log(`page ${i + 1}:`, await page.eval(`document.querySelector('.story-text').textContent`))
  await page.tapOn('.story-nav .big-btn.pink')
}
await page.waitFor(`!!document.querySelector('.party-thanks')`, 8000)
await sleep(1200); await snap('thanks')
await page.tapOn('.thanks-heart')
await sleep(500); await snap('thanks-tapped')
await page.waitFor(`!!document.querySelector('.verse')`, 15000)
await page.waitFor(`[...document.querySelectorAll('.verse-slot')].every((s) => s.textContent !== '…')`, 20000)
const order = await page.eval(`[...document.querySelectorAll('.verse-slot')].map((s) => s.textContent)`)
await page.waitFor(`!!document.querySelector('.verse-slot.next')`, 40000)
await snap('verse')
for (let i = 0; i < order.length; i++) {
  const chip = await boxOf(`[...document.querySelectorAll('.verse-chip:not(.used)')].find((c) => c.textContent === ${JSON.stringify(order[i])})`)
  const slot = await boxOf(`document.querySelector('.verse-slot.next')`)
  if (!chip || !slot) break
  await page.drag(path(chip, slot), 18)
  await sleep(1800)
}
await page.waitFor(`!!document.querySelector('.battle')`, 30000)
await sleep(800); await snap('battle')
for (let guard = 0; guard < 150; guard++) {
  if (await page.eval(`!!document.querySelector('.party-gift')`)) break
  const phase = await page.eval(`document.querySelector('.battle')?.className ?? ''`)
  if (phase.includes('phase-team')) { await page.tapOn('.team-card'); await sleep(2500); continue }
  if (phase.includes('phase-pick')) { const b = await page.eval(`[...document.querySelectorAll('.move-btn')].findIndex((b) => !b.className.includes('locked') && !b.className.includes('charging'))`); const c = await boxOf(`document.querySelectorAll('.move-btn')[${b}]`); await page.tap(c.x, c.y); await sleep(1500); continue }
  if (phase.includes('phase-question')) {
    const nChoices = await page.eval(`document.querySelectorAll('.q-choice').length`)
    for (let i = 0; i < nChoices; i++) {
      const c = await boxOf(`document.querySelectorAll('.q-choice')[${i}]`)
      if (!c) break
      await page.tap(c.x, c.y)
      await sleep(400)
      if (!(await page.eval(`document.querySelector('.battle')?.className.includes('phase-question')`)) || (await page.eval(`!!document.querySelector('.q-choice.right')`))) break
    }
    await sleep(1800)
    continue
  }
  if (await page.eval(`!!document.querySelector('.evo .big-btn')`)) { await page.tapOn('.evo .big-btn'); await sleep(800); continue }
  if (phase.includes('phase-freed') || (await page.eval(`!!document.querySelector('.foe-present')`))) {
    await snap(`battle-present-${guard}`)

  }
  if (phase.includes('phase-ask')) {
    await sleep(1200); await snap('battle-ask')
    const ball = await boxOf(`document.querySelector('.throw-grab')`)
    const foe = await boxOf(`document.querySelector('.foe-body')`)
    await page.drag(path(ball, foe, 20, 120), 22)
    await sleep(4000)
    continue
  }
  if (phase.includes('phase-caught') || phase.includes('phase-learned')) { await sleep(1500); await page.tapOn('.learned .big-btn'); await sleep(800); continue }
  await sleep(700)
}
await page.waitFor(`!!document.querySelector('.party-gift')`, 20000)
await sleep(800); await snap('gift')
await page.tapOn('.gift-box')
await sleep(1200); await snap('gift-open')
await sleep(6000)
console.log('said at the gift:', await said())
await page.tapOn('.party-gift .big-btn')
await sleep(1500); await snap('map-after')
const p = await page.eval(`JSON.parse(localStorage.getItem('ark-pals:v1:robin'))`)
console.log('saved:', { partyShown: p.partyShown, partyAge: p.partyAge, stickers: p.stickers, sprinkles: p.pals.sprinkles, pouty: p.pals.pouty })
console.log('errors:', page.errors)
await page.close()
