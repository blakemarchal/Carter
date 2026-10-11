// The robot's hands and eyes for the playthroughs: a test fixture that opens the game at iPad size with
// fake speech (each line "finishes" after a short while, so narration doesn't hold the run up), notes
// every console error and page error (the test fails on any), and helpers to tap, drag and take pictures.
// The way it sets up a player and plays each activity follows the film scripts in scripts/film/.
import { test as base, expect, type Page, type TestInfo } from '@playwright/test'
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

export { expect }
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** How long a spoken line takes, in ms: a little per letter (real speech is about 42 ms a letter). */
const MS_PER_CHAR = Number(process.env.E2E_SPEECH_MS ?? 6)

// Fake speech: the game hears that each line starts and ends, and the robot can read what was said.
const SPEECH_STUB = `(() => {
  const fake = {
    speaking: false, pending: false, paused: false, onvoiceschanged: null,
    getVoices: () => [],
    speak(u) { this.speaking = true; const ms = 60 + (u.text || '').length * ${MS_PER_CHAR};
      window.__said = (window.__said || []).concat(u.text);
      clearTimeout(this._t); this._t = setTimeout(() => { this.speaking = false; u.onend && u.onend(new Event('end')) }, ms) },
    cancel() { clearTimeout(this._t); this.speaking = false },
    pause() {}, resume() {}, addEventListener() {}, removeEventListener() {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  window.SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || function (t) { this.text = t };
})();`

/** The family server's endpoints the game calls (not there on the Vite dev server): stand-in answers. */
const SERVER: Record<string, { status?: number; json: unknown }> = {
  '/backup': { json: { ok: true } },
  '/backups': { json: [] },
  '/stats': { json: { ok: true } },
  '/recordings': { json: [] },
  '/songs': { json: [] },
}

export type Box = { x: number; y: number; w: number; h: number }
export type Pt = { x: number; y: number }

export class App {
  /** Console errors and page errors, in order. */
  errors: string[] = []
  private n = 0
  private shotDir: string
  constructor(readonly page: Page, info: TestInfo) {
    const slug = info.titlePath.slice(1).join(' ').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    this.shotDir = join('e2e-results', 'shots', info.project.name, slug)
    rmSync(this.shotDir, { recursive: true, force: true }) // (this run's pictures only)
    mkdirSync(this.shotDir, { recursive: true })
  }

  /** Evaluates a JavaScript expression in the page. */
  eval<T = any>(expr: string): Promise<T> {
    return this.page.evaluate(expr) as Promise<T>
  }
  /** Waits for an expression to be truthy. */
  async waitFor(expr: string, timeout = 15_000, what = expr) {
    try {
      await this.page.waitForFunction(expr, undefined, { timeout, polling: 100 })
    } catch {
      throw new Error(`timed out (${timeout} ms) waiting for ${what}`)
    }
  }
  /** Whether an expression becomes truthy within the time (no error if not). */
  async becomes(expr: string, timeout: number) {
    return this.waitFor(expr, timeout).then(() => true, () => false)
  }
  /** A picture of the screen, numbered in order. */
  async shot(name: string) {
    const file = join(this.shotDir, `${String(this.n++).padStart(2, '0')}-${name.replace(/[^a-z0-9-]+/gi, '-')}.jpg`)
    await this.page.screenshot({ path: file, type: 'jpeg', quality: 70, animations: 'allow' }).catch(() => {})
  }
  /** What the narrator has said so far. */
  said(): Promise<string[]> {
    return this.eval(`(window.__said || []).slice()`)
  }

  /** The middle and size of the i-th element matching a selector (optionally only those containing text). */
  box(sel: string, i = 0, text?: string): Promise<Box | null> {
    return this.page.evaluate(([sel, i, text]) => {
      const els = [...document.querySelectorAll(sel as string)].filter((e) => !text || (e.textContent ?? '').includes(text as string))
      const e = els[i as number]
      if (!e) return null
      const r = e.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }
    }, [sel, i, text] as const)
  }
  /** The middle and size of the element an expression gives. */
  boxOf(expr: string): Promise<Box | null> {
    return this.eval(`(() => { const e = ${expr}; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } })()`)
  }

  /** A finger tap. */
  async tap(x: number, y: number) {
    await this.page.touchscreen.tap(Math.round(x), Math.round(y))
  }
  /** Taps the middle of the first element matching (it must be there). */
  async tapOn(sel: string, text?: string) {
    const b = await this.box(sel, 0, text)
    if (!b) throw new Error(`nothing to tap: ${sel}${text ? ` "${text}"` : ''}`)
    await this.tap(b.x, b.y)
    return b
  }
  /** Taps it if it's there. */
  async tapIf(sel: string, text?: string) {
    const b = await this.box(sel, 0, text)
    if (b) await this.tap(b.x, b.y)
    return !!b
  }

  /**
   * A drag through points, `ms` between moves. (Playwright has no touch drags that work in every engine,
   * so drags are made with the mouse: the game's drags work on pointer events, mouse and touch alike.)
   * `hold`: ms to keep the button down at the end before letting go.
   */
  async dragPath(points: [number, number][], ms = 14, hold = 0) {
    const m = this.page.mouse
    await m.move(points[0][0], points[0][1])
    await m.down()
    for (let i = 1; i < points.length; i++) {
      await m.move(points[i][0], points[i][1])
      if (ms) await sleep(ms)
    }
    if (hold) await sleep(hold)
    await m.up()
  }
  /** A drag from a to b, lifting a little in the middle (like a finger carrying something). */
  async drag(a: Pt, b: Pt, { steps = 14, lift = 40, ms = 14 } = {}) {
    const pts: [number, number][] = Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps
      return [a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t - Math.sin(t * Math.PI) * lift]
    })
    await this.dragPath(pts, ms)
  }
  /** Drags the element matching `from` to the element matching `to`; false if either isn't there. */
  async dragSel(from: string, to: string) {
    const a = await this.box(from)
    const b = await this.box(to)
    if (!a || !b) return false
    await this.drag(a, b)
    return true
  }
}

// ---------- players ----------

/** Today, as the game writes it (the device's own date). */
export function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** A saved game (scripts/film/cdp.mjs): every island open, several Pals, no daily limit on visits. */
export function fixture(extra: Record<string, unknown> = {}) {
  return {
    version: 1, starter: 'zippy', battler: 'pip',
    pals: { pip: 60, zippy: 140, ember: 10, pebble: 0, starling: 30, bubbles: 20 },
    islandsDone: ['noah', 'creation', 'david'], islandStep: {}, mapAt: 'creation', battlesWon: 2,
    movesSeen: [], openAll: true, outfits: { pip: 'bow' }, fed: { day: '', counts: {} },
    egg: { warmth: 2, day: '' }, colors: {}, stickerSpots: [{ s: '🌈', x: 30, y: 40 }], cooked: {},
    familyVoices: false, log: {}, skills: { reading: 2, numbers: 2 }, skillsVersion: 2, streak: { reading: 0, numbers: 0 },
    stickers: ['🌈', '⭐', '🐑'], playDate: today(), playSeconds: 0, speechRate: 1, narrator: 'device', music: false, sfx: true,
    dailyVisits: 0,
    ...extra,
  }
}

/** Saves a player, opens the game and taps their name: the map. */
export async function startPlayer(app: App, save: Record<string, unknown>) {
  const { page } = app
  await page.goto('/')
  await page.evaluate(([profiles, game]) => {
    localStorage.clear()
    localStorage.setItem('ark-pals:profiles', profiles)
    localStorage.setItem('ark-pals:v1:tester', game)
  }, [JSON.stringify({ active: 'tester', list: [{ id: 'tester', name: 'Tester', emoji: '🧪' }] }), JSON.stringify(save)] as const)
  await page.goto('/')
  await app.waitFor(`!!document.querySelector('button.player')`, 20_000, 'the title screen')
  await app.tapOn('button.player')
  await app.waitFor(`!!document.querySelector('.sea-map')`, 20_000, 'the map')
}

// ---------- islands ----------

const ISLANDS_SRC = readFileSync(new URL('../src/data/islands.ts', import.meta.url), 'utf8')

/** Every island on the map, in order: its id and content version (src/data/islands.ts). */
export const ISLANDS: { id: string; version: number }[] = [...ISLANDS_SRC.matchAll(/\{ id: '([^']+)', name: .*$/gm)].map((m) => ({
  id: m[1], version: Number(/version: (\d+)/.exec(m[0])?.[1] ?? 1),
}))

// ---------- the fixture ----------

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use, info) => {
    const app = new App(page, info)
    page.on('console', (m) => { if (m.type() === 'error') app.errors.push(`console: ${m.text()}${m.location()?.url ? ` (${m.location().url}:${m.location().lineNumber})` : ''}`) })
    page.on('pageerror', (e) => app.errors.push(`page error: ${e.message}\n${e.stack ?? ''}`))
    await page.addInitScript(SPEECH_STUB)
    await page.route((url) => url.origin === new URL(info.project.use.baseURL ?? 'http://localhost').origin && url.pathname in SERVER, (route) => {
      const r = SERVER[new URL(route.request().url()).pathname]
      return route.fulfill({ status: r.status ?? 200, contentType: 'application/json', body: JSON.stringify(r.json) })
    })
    await use(app)
    await app.shot('end')
    expect(app.errors, 'console errors and page errors').toEqual([])
  },
})
