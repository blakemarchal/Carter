// The robot's hands and eyes for the playthroughs: a test fixture that opens the game at iPad size with
// fake speech (each line "finishes" after a short while, so narration doesn't hold the run up), notes
// every console error and page error (the test fails on any), and helpers to tap, drag and take pictures.
// The way it sets up a player and plays each activity follows the film scripts in scripts/film/.
import { test as base, expect, type Page, type TestInfo } from '@playwright/test'
import { createHash } from 'node:crypto'
import { appendFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
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

// The voice audit (E2E_VOICE_AUDIT=1): the house Grok voice is "recorded" in full, every clip in
// public/voice/grok-list.json, as the server has it after the warm-up (each one plays the same short real clip),
// so whatever the game still hands to the device's own voice is a line nothing covers. Those are written to
// e2e-results/voice-audit.txt, one per line, with the test that heard it.
// The emoji audit (E2E_EMOJI_AUDIT=1): every emoji the game draws as text (not as a drawn picture) while it's
// played, with where it was (the nearest element's class), written to e2e-results/emoji-audit.txt.
const EMOJI_AUDIT = !!process.env.E2E_EMOJI_AUDIT
const EMOJI_WATCH = `(() => {
  const re = /\\p{Extended_Pictographic}(?:\\uFE0F|\\u200D\\p{Extended_Pictographic}|\\p{Emoji_Modifier})*/gu;
  window.__emoji = new Map();
  const note = (node) => {
    const t = node.nodeType === 3 ? node.textContent : '';
    if (!t || !re.test(t)) return;
    re.lastIndex = 0;
    const el = node.parentElement;
    if (!el || el.closest('svg')) return;
    const where = (el.closest('[class]')?.className || el.tagName).toString().split(' ').slice(0, 2).join('.');
    for (const m of t.matchAll(re)) window.__emoji.set(m[0] + '\\t' + where, (window.__emoji.get(m[0] + '\\t' + where) || 0) + 1);
  };
  const walk = (n) => { if (n.nodeType === 3) note(n); else n.childNodes && n.childNodes.forEach(walk); };
  new MutationObserver((ms) => ms.forEach((m) => { m.addedNodes.forEach(walk); if (m.type === 'characterData') note(m.target); }))
    .observe(document, { childList: true, subtree: true, characterData: true });
})();`

const AUDIT = !!process.env.E2E_VOICE_AUDIT
const auditManifest = () => {
  const clips: Record<string, [string, number, number, number]> = {}
  for (const c of JSON.parse(readFileSync(new URL('../public/voice/grok-list.json', import.meta.url), 'utf8')) as { key: string }[]) {
    clips[createHash('sha256').update(c.key.trim()).digest('hex').slice(0, 16)] = ['a', 0, 0, 1]
  }
  return { version: 1, voices: {}, clips: { grok: clips } }
}
const AUDIT_CLIP = AUDIT ? readFileSync(new URL('./voice-audit-clip.mp3', import.meta.url)) : null

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
    stickers: ['🌈', '⭐', '🐑'], playDate: today(), playSeconds: 0, speechRate: 1, narrator: AUDIT ? 'ara' : 'device', music: false, sfx: true,
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
    if (EMOJI_AUDIT) await page.addInitScript(EMOJI_WATCH)
    await page.route((url) => url.origin === new URL(info.project.use.baseURL ?? 'http://localhost').origin && url.pathname in SERVER, (route) => {
      const r = SERVER[new URL(route.request().url()).pathname]
      return route.fulfill({ status: r.status ?? 200, contentType: 'application/json', body: JSON.stringify(r.json) })
    })
    if (AUDIT) {
      const manifest = auditManifest()
      await page.route((url) => url.pathname === '/voice/house', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(manifest) }))
      await page.route((url) => url.pathname.startsWith('/voice/house/grok/'), (route) => route.fulfill({ contentType: 'audio/mpeg', body: AUDIT_CLIP! }))
    }
    await use(app)
    if (AUDIT) {
      const said = await app.eval<string[]>('window.__said || []').catch(() => [] as string[])
      mkdirSync('e2e-results', { recursive: true })
      const who = info.titlePath.slice(1).join(' › ')
      for (const line of new Set(said)) if (line.trim()) appendFileSync('e2e-results/voice-audit.txt', `${line.replace(/\s+/g, ' ')}	${who}
`)
    }
    if (EMOJI_AUDIT) {
      const seen = await app.eval<[string, number][]>('[...(window.__emoji || new Map())]').catch(() => [] as [string, number][])
      mkdirSync('e2e-results', { recursive: true })
      const who = info.titlePath.slice(1).join(' › ')
      for (const [k] of seen) appendFileSync('e2e-results/emoji-audit.txt', `${k}	${who}
`)
    }
    await app.shot('end')
    expect(app.errors, 'console errors and page errors').toEqual([])
  },
})
