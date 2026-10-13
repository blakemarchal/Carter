// The fresh-eyes sweep (docs/CLOUD-BRIEF.md, wave 11): a new owner and a new customer family, from sign-in to the
// map, then the treasure hunt, the sing-along and bedtime, on the real server (npm run build first), at iPad size.
// Notes every console or page error, and takes a picture of each step.
//   node scripts/film/sweep-flows.mjs <site, e.g. http://127.0.0.1:3997> <family password> <start link> <out folder>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [site, password, startLink, out = 'preview/flows'] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium' })
const notes = []
let n = 0

async function flow(name, fn) {
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => { Object.defineProperty(window, 'speechSynthesis', { value: { speak(u) { setTimeout(() => u.onend?.(), 30) }, cancel() {}, getVoices: () => [], pause() {}, resume() {} }, configurable: true }); window.SpeechSynthesisUtterance = function (t) { this.text = t } })
  page.on('pageerror', (e) => notes.push(`${name}: page error: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) notes.push(`${name}: console: ${m.text()}`) })
  page.on('response', (r) => { if (r.status() >= 500) notes.push(`${name}: ${r.status()} ${r.url()}`) })
  const shot = async (label) => { await page.waitForTimeout(700); await page.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}-${name}-${label}.png` }) }
  const tap = (sel, text) => page.evaluate(([s, t]) => [...document.querySelectorAll(s)].find((e) => !t || e.textContent.includes(t))?.click(), [sel, text])
  try {
    await fn({ page, shot, tap })
  } catch (e) {
    notes.push(`${name}: stopped: ${e.message.split('\n')[0]}`)
    await shot('stopped')
  }
  await ctx.close()
}

/** From the title screen of a family with no players: a new player, their first Pal, the treasure hunt, the map. */
async function firstRun({ page, shot, tap }, who) {
  await page.waitForSelector('.welcome, button.player', { timeout: 20000 })
  await shot('title')
  const input = page.locator('.welcome input').first()
  if (await input.count()) {
    await input.fill(who)
    await tap('.welcome button[type=submit], .welcome .big-btn')
    await page.waitForTimeout(800)
  }
  await shot('after-name')
  if (await page.locator('.starter, .starter-pick, [class*=starter]').count()) {
    await tap('.starter-card, .pal-pick, [class*=starter] button')
    await page.waitForTimeout(500)
    await tap('button', 'Choose')
    await tap('.big-btn')
    await page.waitForTimeout(1500)
    await shot('starter')
  }
  // the treasure hunt: answer "Not sure" until it ends
  if (await page.locator('.placement').count()) {
    await tap('.placement .big-btn')
    for (let i = 0; i < 40 && !(await page.locator('.placement.end').count()); i++) {
      await page.waitForTimeout(400)
      await tap('.pl-unsure')
      await page.waitForTimeout(900)
      if (i === 2) await shot('treasure')
    }
    await shot('treasure-end')
    await tap('.placement .big-btn')
  }
  await page.waitForSelector('.sea-map', { timeout: 20000 })
  await shot('map')
}

await flow('owner', async (h) => {
  const { page, shot } = h
  await page.goto(site)
  await shot('login')
  await page.fill('input[name=password]', password)
  await page.click('button')
  await page.waitForURL(/welcome/)
  await shot('welcome')
  await page.fill('input[name=you]', 'Blake')
  await page.click('button')
  await page.waitForURL((u) => u.pathname === '/')
  await firstRun(h, 'Olivia')
  // the sing-along, then bedtime
  await h.tap('.icon-btn[aria-label="Sing-along"]'); await page.waitForTimeout(800); await shot('sing')
  await h.tap('.song-card'); await page.waitForTimeout(2500); await shot('song')
  await page.goto(site); await page.waitForSelector('button.player'); await h.tap('button.player'); await page.waitForSelector('.sea-map')
  await h.tap('.icon-btn[aria-label="Bedtime story"]'); await page.waitForTimeout(1500); await shot('bedtime')
  // the Parent Corner (hold the gear)
  await page.goto(site); await page.waitForSelector('button.player'); await h.tap('button.player'); await page.waitForSelector('.parent-gear')
  const g = await page.locator('.parent-gear').boundingBox()
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2); await page.mouse.down(); await page.waitForTimeout(3300); await page.mouse.up()
  await page.waitForTimeout(1200); await shot('parent')
  await h.tap('.pc-nav button', 'Grown-ups'); await shot('parent-grownups')
  await h.tap('.pc-nav button', 'Voices'); await shot('parent-voices')
  await h.tap('.pc-nav button', 'App'); await h.tap('button', 'Check for updates'); await page.waitForTimeout(300); await shot('parent-app')
})

await flow('customer', async (h) => {
  const { page, shot } = h
  await page.goto(startLink)
  await shot('start')
  await page.fill('input[name=family]', 'The Rivers')
  await page.fill('input[name=you]', 'Mom')
  await page.click('button')
  await page.waitForURL((u) => u.pathname === '/')
  await firstRun(h, 'Zuri')
})

await browser.close()
console.log(notes.length ? notes.join('\n') : 'no errors')
console.log(`pictures in ${out}`)
