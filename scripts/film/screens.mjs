// Run the motion audit on the main screens: title, map, Ark, a Pal's home, sticker book.
import { fixture, launch, sleep } from './cdp.mjs'
import { AUDIT } from './motion.mjs'
const page = await launch()
const today = new Date().toISOString().slice(0, 10)
await page.goto('http://localhost:5179/')
await page.eval(`localStorage.clear(); localStorage.setItem('ark-pals:profiles', JSON.stringify({ active: 'tester', list: [{ id: 'tester', name: 'Tester', emoji: '🧪' }] }));
  localStorage.setItem('ark-pals:v1:tester', ${JSON.stringify(JSON.stringify(fixture({ today })))}); true`)
await page.goto('http://localhost:5179/')
const audit = async (label, min = 40) => {
  await sleep(1500)
  const res = await page.eval(`(${AUDIT})({ minMove: ${min} })`)
  console.log(`== ${label}: ${res.length} flagged`)
  for (const r of res.sort((a, b) => b.maxD - a.maxD).slice(0, 12)) console.log(`  ${String(r.maxD).padStart(4)}px ${r.anim.padEnd(12)} ${r.tag}.${r.cls} "${r.txt}" size ${r.size} worst ${r.worst} scale ${r.minScale}-${r.maxScale}`)
}
await audit('title')
await page.tapOn('button.player'); await audit('map')
await page.tapOn('.ark-btn'); await audit('ark')
await page.tapOn('.pal-card'); await audit('pal home', 30)
console.log('errors:', page.errors)
await page.close()
