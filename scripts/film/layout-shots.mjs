// Pictures of the screens wave 11 polished (docs/CLOUD-BRIEF.md): the Parent Corner and the treasure hunt
// (placement game), at iPad landscape, iPad portrait and phone sizes, for before-and-after comparisons.
//   ARK_URL=http://localhost:5199 CHROME=/opt/pw-browsers/chromium node scripts/film/layout-shots.mjs <out folder>
// The family server isn't there (the Vite dev server), so its answers are stood in: an owner in a family of two
// grown-ups and two devices, on no plan yet.
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const out = process.argv[2] ?? 'preview/layout'
mkdirSync(out, { recursive: true })
const URL0 = process.env.ARK_URL ?? 'http://localhost:5199'
const SIZES = { landscape: [1180, 820], portrait: [820, 1180], phone: [390, 844] }
const now = Date.now()
const FAMILY = {
  me: { member: 'm1', device: 'd1', role: 'parent', email: null }, emailOn: true, deletable: false, owner: true,
  family: { id: 'f1', name: 'The Rivers' },
  members: [{ id: 'm1', name: 'Grown-ups', role: 'parent', look: null }, { id: 'm2', name: 'Grandma', role: 'grownup', look: null }],
  devices: [{ id: 'd1', label: 'iPad', seen: now, member: 'm1', mine: true }, { id: 'd2', label: 'Mac', seen: now - 86400000, member: 'm2', mine: false }],
  invites: [],
}
const PLANS = [['family-yearly', 7900, 'year'], ['family-monthly', 999, 'month'], ['grace-monthly', 499, 'month'], ['sponsor-monthly', 999, 'month']].map(([id, amount, interval]) => ({ id, amount, interval, label: id }))
const BILLING = { allowed: true, enforced: false, checkedAt: now, billing: { stripeOn: true, enforced: false, free: false, comped: false, plan: null, status: null, paidThrough: null, grace: false, cancelAtPeriodEnd: false, trialUsed: false, paymentFailed: null, sponsoring: false, billingPage: false, plans: PLANS } }
const SERVER = {
  '/family': FAMILY, '/billing': BILLING, '/backups': [], '/recordings': [], '/songs': [], '/stats': { ok: true },
  '/family/usage': { recordings: { count: 3, bytes: 2e6, maxCount: 3000, maxBytes: 3e8 }, songs: { count: 0, bytes: 0, maxCount: 40, maxBytes: 2e8 }, backups: { count: 4, maxFiles: 60 } },
  '/voice/house': { version: 1, voices: {}, clips: {} },
}
const today = new Date().toISOString().slice(0, 10)
const save = (extra) => JSON.stringify({ version: 1, starter: 'zippy', pals: { zippy: 40 }, islandsDone: [], islandStep: {}, mapAt: 'creation', battlesWon: 0, movesSeen: [], openAll: false, outfits: {}, fed: { day: '', counts: {} }, egg: { warmth: 0, day: '' }, colors: {}, stickerSpots: [], cooked: {}, familyVoices: true, log: {}, skills: { reading: 1, numbers: 1 }, skillsVersion: 2, streak: { reading: 0, numbers: 0 }, stickers: [], playDate: today, playSeconds: 0, speechRate: 1, narrator: 'device', music: false, sfx: false, dailyVisits: 2, stars: {}, ...extra })

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium' })
for (const [size, [w, h]] of Object.entries(SIZES)) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  await page.route((u) => new globalThis.URL(u).pathname in SERVER, (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify(SERVER[new globalThis.URL(r.request().url()).pathname]) }))
  await page.addInitScript(() => { Object.defineProperty(window, 'speechSynthesis', { value: { speak(u) { setTimeout(() => u.onend?.(), 50) }, cancel() {}, getVoices: () => [], pause() {}, resume() {} }, configurable: true }); window.SpeechSynthesisUtterance = function (t) { this.text = t } })
  const setUp = async (game) => {
    await page.goto(URL0)
    await page.evaluate(([p, g]) => { localStorage.clear(); localStorage.setItem('ark-pals:profiles', p); localStorage.setItem('ark-pals:v1:olivia', g) },
      [JSON.stringify({ active: 'olivia', list: [{ id: 'olivia', name: 'Olivia', emoji: '🦄' }, { id: 'dad', name: 'Dad', emoji: '🧔', grownup: true }] }), game])
    await page.goto(URL0)
    await page.waitForSelector('button.player', { timeout: 20000 })
    // (the player buttons bob gently, so they're tapped from inside the page)
    await page.evaluate(() => [...document.querySelectorAll('button.player')].find((b) => b.textContent.includes('Olivia'))?.click())
  }
  // The treasure hunt (a new player's placement game), at its start and on a puzzle.
  await setUp(save({ placement: 'due', starter: 'zippy' }))
  await page.waitForSelector('.placement', { timeout: 20000 })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${out}/treasure-${size}.png` })
  await page.evaluate(() => document.querySelector('.placement .big-btn')?.click())
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${out}/treasure-puzzle-${size}.png` })
  // The Parent Corner, from the map (hold the gear).
  await setUp(save({ placement: 'done', islandsDone: ['creation'] }))
  await page.waitForSelector('.parent-gear', { timeout: 20000 })
  const g = await page.locator('.parent-gear').boundingBox()
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(3300)
  await page.mouse.up()
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${out}/parent-${size}.png` })
  await page.screenshot({ path: `${out}/parent-full-${size}.png`, fullPage: true })
  // (on a wide screen, the Voices group too; on a narrow one, its fold opened)
  await page.evaluate(() => [...document.querySelectorAll('.pc-nav button, .pc-fold-head')].find((b) => b.textContent.includes('Voices'))?.click())
  await page.waitForTimeout(500)
  await page.evaluate(() => [...document.querySelectorAll('.pc-fold-head')].find((b) => b.textContent.includes('Voices'))?.scrollIntoView())
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${out}/parent-voices-${size}.png` })
  // (the Parent Corner scrolls inside its own box: a picture of every part of it, a screen at a time)
  const parts = await page.evaluate(() => {
    const el = [...document.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== 'visible')
    if (!el) return 0
    el.setAttribute('data-shot-scroll', '1')
    return Math.ceil(el.scrollHeight / el.clientHeight)
  })
  for (let i = 1; i < Math.min(parts, 12); i++) {
    await page.evaluate((k) => { const el = document.querySelector('[data-shot-scroll]'); el.scrollTop = k * el.clientHeight * 0.92 }, i)
    await page.waitForTimeout(250)
    await page.screenshot({ path: `${out}/parent-${size}-${String(i).padStart(2, '0')}.png` })
  }
  await page.close()
}
await browser.close()
console.log(`pictures in ${out}`)
