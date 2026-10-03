// Screenshots of the dev gallery (one picture per page), for checking illustrations:
//   node scripts/film/gallery.mjs <out dir> scenes/birthday [scenes/birthday/family …] [--scale 2]
import { launch, sleep } from './cdp.mjs'
import { join } from 'node:path'
import { mkdirSync } from 'node:fs'

const args = process.argv.slice(2)
const at = args.indexOf('--scale')
const scale = at >= 0 ? Number(args.splice(at, 2)[1]) : 1
const [out, ...routes] = args
mkdirSync(out, { recursive: true })
const page = await launch({ width: 1180, height: 820, touch: false })
for (const [k, route] of routes.entries()) {
  // (a new query each time, so it's a real page load rather than a hash change)
  await page.goto(`http://localhost:5179/?g=${k}#gallery/${route}`)
  await sleep(1200)
  const n = await page.eval(`document.querySelectorAll('.gallery > div').length`)
  for (let i = 0; i < n; i++) {
    const r = await page.eval(`(() => { const e = document.querySelectorAll('.gallery > div')[${i}]; e.scrollIntoView(); const b = e.getBoundingClientRect(); return [b.left, b.top, b.width, b.height] })()`)
    await sleep(150)
    const { data } = await page.s('Page.captureScreenshot', { format: 'png', clip: { x: r[0], y: r[1], width: r[2], height: r[3], scale } })
    const { writeFileSync } = await import('node:fs')
    writeFileSync(join(out, `${route.replaceAll('/', '-')}-${i + 1}.png`), Buffer.from(data, 'base64'))
  }
  console.log(route, n, 'pictures')
}
console.log('errors:', page.errors)
await page.close()
