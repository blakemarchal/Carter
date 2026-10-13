// A picture of each main screen at iPad landscape, iPad portrait and phone sizes (docs/CLOUD-BRIEF.md, wave 11
// polish), for checking centring, spacing and overflow by eye. Notes anything wider than the screen.
//   ARK_URL=http://localhost:5199 CHROME=/opt/pw-browsers/chromium node scripts/film/screens-sweep.mjs <out folder>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const out = process.argv[2] ?? 'preview/sweep'
mkdirSync(out, { recursive: true })
const URL0 = process.env.ARK_URL ?? 'http://localhost:5199'
const SIZES = { landscape: [1180, 820], portrait: [820, 1180], phone: [390, 844] }
const today = new Date().toISOString().slice(0, 10)
const save = JSON.stringify({
  version: 1, starter: 'zippy', battler: 'pip', pals: { pip: 60, zippy: 140, ember: 10, pebble: 0, starling: 30, bubbles: 20 },
  islandsDone: ['creation', 'noah'], islandStep: {}, mapAt: 'noah', battlesWon: 2, movesSeen: [], openAll: true, outfits: { pip: 'bow' },
  fed: { day: '', counts: {} }, egg: { warmth: 2, day: '' }, colors: {}, stickerSpots: [], cooked: {}, familyVoices: false, log: {},
  skills: { reading: 2, numbers: 2 }, skillsVersion: 2, streak: { reading: 0, numbers: 0 }, stickers: ['🌈', '⭐'], playDate: today,
  playSeconds: 0, speechRate: 1, narrator: 'device', music: false, sfx: false, dailyVisits: 0, stars: {}, placement: 'done',
})
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium' })
const overflow = []
for (const [size, [w, h]] of Object.entries(SIZES)) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.addInitScript(() => { Object.defineProperty(window, 'speechSynthesis', { value: { speak(u) { setTimeout(() => u.onend?.(), 30) }, cancel() {}, getVoices: () => [], pause() {}, resume() {} }, configurable: true }); window.SpeechSynthesisUtterance = function (t) { this.text = t } })
  const shot = async (name) => {
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${out}/${name}-${size}.png` })
    const wide = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 2 && getComputedStyle(e).position !== 'fixed' && !e.closest('svg') }).slice(0, 4).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} (right ${Math.round(e.getBoundingClientRect().right)})`))
    if (wide.length) overflow.push(`${name} ${size}: ${wide.join(', ')}`)
  }
  const tap = (sel) => page.evaluate((s) => document.querySelector(s)?.click(), sel)
  await page.goto(URL0)
  await page.evaluate((g) => { localStorage.clear(); localStorage.setItem('ark-pals:profiles', JSON.stringify({ active: 't', list: [{ id: 't', name: 'Olivia', emoji: '🦄' }, { id: 'u', name: 'Benji', emoji: '🐳' }] })); localStorage.setItem('ark-pals:v1:t', g) }, save)
  await page.goto(URL0)
  await page.waitForSelector('button.player', { timeout: 20000 })
  await shot('title')
  await tap('button.player'); await page.waitForSelector('.sea-map'); await shot('map')
  await tap('.ark-btn'); await page.waitForTimeout(500); await shot('ark')
  await tap('.pal-card'); await page.waitForTimeout(500); await shot('pal-home')
  await page.goto(URL0); await page.waitForSelector('button.player'); await tap('button.player'); await page.waitForSelector('.sea-map')
  await tap('.icon-btn[aria-label="Sing-along"]'); await page.waitForTimeout(500); await shot('sing')
  await page.goto(URL0); await page.waitForSelector('button.player'); await tap('button.player'); await page.waitForSelector('.sea-map')
  await tap('.icon-btn[aria-label="Bedtime story"]'); await page.waitForTimeout(500); await shot('bedtime')
  await page.close()
}
await browser.close()
console.log(overflow.length ? `wider than the screen:\n  ${overflow.join('\n  ')}` : 'nothing wider than the screen')
console.log(`pictures in ${out}`)
