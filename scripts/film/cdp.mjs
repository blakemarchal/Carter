// A tiny Chrome DevTools Protocol driver for filming the game: headless Chrome at iPad size with
// touch, fake speech (lines "finish" after a realistic time), screenshots in quick succession.
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const SPEECH_STUB = `(() => {
  const fake = {
    speaking: false, pending: false, paused: false, onvoiceschanged: null,
    getVoices: () => [],
    speak(u) { this.speaking = true; const ms = 250 + (u.text || '').length * 42;
      window.__said = (window.__said || []).concat(u.text);
      clearTimeout(this._t); this._t = setTimeout(() => { this.speaking = false; u.onend && u.onend(new Event('end')) }, ms) },
    cancel() { clearTimeout(this._t); this.speaking = false },
    pause() {}, resume() {}, addEventListener() {}, removeEventListener() {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  window.SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || function (t) { this.text = t };
})();`

/** A free local port, so several films can run at once without closing each other's browser. */
const freePort = () => new Promise((resolve, reject) => {
  const srv = createServer()
  srv.on('error', reject)
  srv.listen(0, '127.0.0.1', () => { const { port } = srv.address(); srv.close(() => resolve(port)) })
})

export async function launch({ port, width = 1180, height = 820, touch = true } = {}) {
  port ??= await freePort()
  const dir = mkdtempSync(join(tmpdir(), 'ark-film-'))
  const proc = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, '--no-first-run',
    '--no-default-browser-check', '--autoplay-policy=no-user-gesture-required', '--mute-audio',
    '--hide-scrollbars', `--window-size=${width},${height}`, 'about:blank',
  ], { stdio: 'ignore' })
  let info
  for (let i = 0; i < 80 && !info; i++) {
    try { info = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json() } catch { await sleep(150) }
  }
  if (!info) throw new Error('Chrome did not start')
  const ws = new WebSocket(info.webSocketDebuggerUrl)
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j })
  let id = 0
  const pending = new Map()
  const listeners = new Set()
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) {
      const { res, rej } = pending.get(d.id)
      pending.delete(d.id)
      d.error ? rej(new Error(`${d.error.message}`)) : res(d.result)
    } else listeners.forEach((f) => f(d))
  }
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
    const i = ++id
    pending.set(i, { res, rej })
    ws.send(JSON.stringify({ id: i, method, params, sessionId }))
  })
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  const s = (m, p) => send(m, p, sessionId)
  await s('Page.enable')
  await s('Runtime.enable')
  await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  if (touch) await s('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
  await s('Page.addScriptToEvaluateOnNewDocument', { source: SPEECH_STUB })
  const errors = []
  listeners.add((d) => {
    if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text)
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map((a) => a.value ?? a.description).join(' '))
  })

  const page = {
    s, errors,
    async goto(url) {
      const loaded = new Promise((r) => { const f = (d) => { if (d.method === 'Page.loadEventFired') { listeners.delete(f); r() } }; listeners.add(f) })
      await s('Page.navigate', { url })
      await loaded
    },
    async eval(expression) {
      const r = await s('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)
      return r.result.value
    },
    async shot(file) {
      const { data } = await s('Page.captureScreenshot', { format: 'jpeg', quality: 70 })
      writeFileSync(file, Buffer.from(data, 'base64'))
    },
    /** n frames, `every` ms apart (as close as screenshots allow); returns [file, ms] pairs. */
    async film(dir, name, n, every) {
      mkdirSync(dir, { recursive: true })
      const out = []
      const t0 = Date.now()
      for (let i = 0; i < n; i++) {
        const due = t0 + i * every
        if (Date.now() < due) await sleep(due - Date.now())
        const f = join(dir, `${name}-${String(i).padStart(3, '0')}.jpg`)
        await page.shot(f)
        out.push([f, Date.now() - t0])
      }
      writeFileSync(join(dir, `${name}.json`), JSON.stringify(out))
      return out
    },
    /** A finger tap (touch start/end), like an iPad. */
    async tap(x, y, holdMs = 80) {
      await s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
      await sleep(holdMs)
      await s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    },
    async click(x, y) {
      await s('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
      await s('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 })
      await s('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 })
    },
    /** A finger drag through points, `ms` per step. */
    async drag(points, ms = 16, { onStep } = {}) {
      await s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: points[0][0], y: points[0][1] }] })
      for (let i = 1; i < points.length; i++) {
        await sleep(ms)
        await s('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: points[i][0], y: points[i][1] }] })
        if (onStep) await onStep(i)
      }
      await sleep(ms)
      await s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    },
    /** Center of the first element matching a selector (optionally containing text). */
    async center(selector, text) {
      return page.eval(`(() => { const els = [...document.querySelectorAll(${JSON.stringify(selector)})]
        .filter((e) => ${text ? `e.textContent.includes(${JSON.stringify(text)})` : 'true'}); const e = els[0]; if (!e) return null;
        const r = e.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)] })()`)
    },
    async tapOn(selector, text) {
      const c = await page.center(selector, text)
      if (!c) throw new Error(`nothing matches ${selector} ${text ?? ''}`)
      await page.tap(c[0], c[1])
      return c
    },
    async waitFor(expr, timeout = 15000) {
      const t0 = Date.now()
      while (Date.now() - t0 < timeout) { if (await page.eval(expr)) return true; await sleep(120) }
      throw new Error(`timed out waiting for ${expr}`)
    },
  }
  page.close = async () => { try { await send('Browser.close') } catch {} ; proc.kill() }
  return page
}

/** A saved game: all islands done, several Pals, hungry Pals, an egg, stickers. */
export function fixture({ starter = 'zippy', battler = 'pip', today }) {
  return {
    version: 1, starter, battler,
    pals: { pip: 60, zippy: 140, ember: 10, pebble: 0, starling: 30, bubbles: 20 },
    islandsDone: ['noah', 'creation', 'david'], islandStep: {}, mapAt: 'creation', battlesWon: 2,
    movesSeen: [], openAll: true, outfits: { pip: 'bow' }, fed: { day: '', counts: {} },
    egg: { warmth: 2, day: '' }, colors: {}, stickerSpots: [{ s: '🌈', x: 30, y: 40 }], cooked: {},
    familyVoices: false, log: {}, skills: { reading: 2, numbers: 2 }, streak: { reading: 0, numbers: 0 },
    stickers: ['🌈', '⭐', '🐑'], playDate: today, playSeconds: 0, speechRate: 1, narrator: 'device', music: false, sfx: true,
  }
}
