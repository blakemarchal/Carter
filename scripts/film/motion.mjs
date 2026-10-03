// Motion audit: pause every running animation, scrub each through its cycle, and measure how far
// its element travels from where it rests. Things that fly far (or blow up / vanish) get listed.
//   node motion.mjs <url> [minMove px] [--setup js]
import { launch, sleep } from './cdp.mjs'

export const AUDIT = `async ({ steps = 16, minMove = 50 } = {}) => {
  const anims = document.getAnimations().filter((a) => a.effect && a.effect.target)
  for (const a of anims) { try { a.pause(); a.currentTime = 0 } catch {} }
  const rest = new Map()
  for (const a of anims) { const el = a.effect.target; if (!rest.has(el)) rest.set(el, el.getBoundingClientRect()) }
  const describe = (el) => {
    const cls = (el.getAttribute('class') || '').trim().split(/\\s+/).slice(0, 3).join('.')
    const where = el.closest('[data-name]')?.getAttribute('data-name') || ''
    const txt = (el.textContent || '').trim().slice(0, 12)
    return { tag: el.tagName.toLowerCase(), cls, where, txt }
  }
  const out = []
  for (const a of anims) {
    const el = a.effect.target
    const t = a.effect.getComputedTiming()
    const dur = typeof t.duration === 'number' ? t.duration : 0
    if (!dur || !rest.has(el)) continue
    const r0 = rest.get(el)
    if (r0.width === 0 && r0.height === 0) continue
    let maxD = 0, worst = null, maxScale = 1, minScale = 1
    for (let k = 1; k <= steps; k++) {
      a.currentTime = (t.delay || 0) + (dur * k) / steps - 0.5
      const r = el.getBoundingClientRect()
      const dx = r.x + r.width / 2 - (r0.x + r0.width / 2), dy = r.y + r.height / 2 - (r0.y + r0.height / 2)
      const d = Math.hypot(dx, dy)
      if (d > maxD) { maxD = d; worst = [Math.round(dx), Math.round(dy)] }
      const sc = Math.sqrt((r.width * r.height) / Math.max(1, r0.width * r0.height))
      maxScale = Math.max(maxScale, sc); minScale = Math.min(minScale, sc)
    }
    a.currentTime = 0
    out.push({ anim: a.animationName || a.constructor.name, ...describe(el), size: Math.round(Math.max(r0.width, r0.height)), maxD: Math.round(maxD), worst, maxScale: +maxScale.toFixed(2), minScale: +minScale.toFixed(2) })
  }
  for (const a of anims) { try { a.play() } catch {} }
  return out.filter((o) => o.maxD >= minMove || o.maxScale > 2.5)
}`

if (process.argv[1].endsWith('motion.mjs')) {
  const url = process.argv[2]
  const minMove = Number(process.argv[3] ?? 50)
  const page = await launch({ width: 1200, height: 900 })
  await page.goto(url)
  await sleep(2500)
  const res = await page.eval(`(${AUDIT})({ minMove: ${minMove} })`)
  res.sort((a, b) => b.maxD - a.maxD)
  for (const r of res) console.log(`${String(r.maxD).padStart(4)}px  ${r.anim.padEnd(12)} ${r.tag}.${r.cls}  "${r.txt}"  [${r.where}] size ${r.size} worst ${r.worst} scale ${r.minScale}-${r.maxScale}`)
  console.log(res.length, 'flagged; errors:', page.errors.slice(0, 5))
  await page.close()
}
