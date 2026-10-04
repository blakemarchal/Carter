// Plays Rhythm with real finger taps, in time with the music, taking a picture at each moment that matters:
//   node scripts/film/games/rhythm.mjs <out dir> [island | harp | tambourine | drum | trumpet] [--portrait] [--no-audio] [--plain-clock]
// Without an island it plays the demo kit (#gallery/game/rhythm), on the harp or the instrument named;
// with an island, that island's kit. The first time through it taps most notes in time (a little
// early, a little late), lets two go by, and taps once off the beat; then it plays again without
// tapping at all (the hand and the hint should come), plays a few notes on the circle afterwards,
// and goes on.
//
// --no-audio freezes the audio clock (as a locked iPad might), to check the game offers its play
// button and then plays silently on the plain clock. --plain-clock takes away the audio output
// timestamps, as some browsers have none, so the game keeps time by currentTime alone.
import { mkdirSync } from 'node:fs'
import { launch, sleep } from '../cdp.mjs'

const args = process.argv.slice(2)
const portrait = args.includes('--portrait')
const noAudio = args.includes('--no-audio')
const [OUT, WHICH] = args.filter((a) => !a.startsWith('--'))
if (!OUT) {
  console.log('usage: node scripts/film/games/rhythm.mjs <out dir> [island | harp | tambourine | drum | trumpet] [--portrait] [--no-audio]')
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })
const page = await launch(portrait ? { width: 820, height: 1180 } : {})
if (noAudio) {
  await page.s('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(BaseAudioContext.prototype, 'currentTime', { get: () => 0 });
    AudioContext.prototype.getOutputTimestamp = () => ({ contextTime: 0, performanceTime: 0 })` })
}
if (args.includes('--plain-clock')) {
  // Like a browser without output timestamps: the game keeps time by currentTime alone.
  await page.s('Page.addScriptToEvaluateOnNewDocument', { source: `delete AudioContext.prototype.getOutputTimestamp; Object.defineProperty(AudioContext.prototype, 'outputLatency', { get: () => undefined })` })
}
const route = WHICH ? `/${WHICH}` : ''
await page.goto(`http://localhost:5179/?rhythm=${Date.now()}#gallery/game/rhythm${route}`)
await page.waitFor(`!!document.querySelector('.rhythm-layer') || /No rhythm game/.test(document.body.textContent)`, 20000)
if (!(await page.eval(`!!document.querySelector('.rhythm-layer')`))) {
  console.log(await page.eval(`document.body.textContent`))
  await page.close()
  process.exit(1)
}

let n = 0
const snap = async (name) => { await page.shot(`${OUT}/${String(n++).padStart(2, '0')}-${name}.jpg`) }
const phase = () => page.eval(`document.querySelector('.rhythm-layer')?.dataset.phase ?? 'gone'`)
const said = () => page.eval(`window.__said || []`)
const check = (ok, what) => console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`)
const circle = await page.eval(`(() => { const l = document.querySelector('.rhythm-layer'); const p = new DOMPoint(610, 245).matrixTransform(l.getScreenCTM()); return [Math.round(p.x), Math.round(p.y)] })()`)
/** Somewhere else on the board (any tap on the board counts). */
const elsewhere = await page.eval(`(() => { const l = document.querySelector('.rhythm-layer'); const p = new DOMPoint(300, 150).matrixTransform(l.getScreenCTM()); return [Math.round(p.x), Math.round(p.y)] })()`)

/** Waits until the song's clock reaches `t` (seconds), then taps (re-reading the clock as it goes). */
async function tapAt(t, [x, y] = circle) {
  for (;;) {
    const t0 = Date.now()
    const now = await page.eval(`window.__rhythm.now()`)
    const rtt = Date.now() - t0
    const left = (t - now) * 1000 - rtt / 2 - 4 // (a few ms for the touch to arrive)
    if (left <= 2) break
    await sleep(Math.min(left, left > 300 ? left - 150 : left))
    if (left <= 300) break
  }
  await page.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
  setTimeout(() => page.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }).catch(() => {}), 70)
}

// 1. The intro, then the count-in (or, with no sound, the play button first).
await page.waitFor(`['count', 'start'].includes(document.querySelector('.rhythm-layer')?.dataset.phase)`, 30000)
if ((await phase()) === 'start') {
  await snap('play-button')
  const b = await page.eval(`(() => { const r = document.querySelector('.rhythm-play').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })()`)
  await page.tap(Math.round(b[0]), Math.round(b[1]))
  await page.waitFor(`document.querySelector('.rhythm-layer')?.dataset.phase === 'count'`, 5000)
}
const info = await page.eval(`({ start: window.__rhythm.start, beat: window.__rhythm.beat, notes: window.__rhythm.notes, sound: window.__rhythm.sound, early: window.__rhythm.early, late: window.__rhythm.late })`)
console.log(`sound: ${info.sound}, ${info.notes.length} notes, a beat is ${info.beat.toFixed(3)} s`)
const at = (b) => info.start + b * info.beat
// Where on the song's clock each touch really landed (a busy machine can send a tap late), to check the
// game against: every touch in time plays a note, and nothing else does.
await page.eval(`(() => { window.__touches = []; document.querySelector('.rhythm-layer').addEventListener('pointerdown', (e) => {
  window.__touches.push(window.__rhythm.now() - Math.max(0, performance.now() - e.timeStamp) / 1000) }, true) })()`)
/** How many notes these touches play by the game's rule (the nearest note not yet played, from `early` before it to `late` after), with the window widened by `slack` beats. */
const playedBy = (touches, slack) => {
  const played = info.notes.map(() => false)
  let n = 0
  for (const t of touches) {
    let best = -1, bestD = Infinity
    info.notes.forEach(([nb], i) => {
      const d = (t - at(nb)) / info.beat
      if (!played[i] && d >= -info.early - slack && d <= info.late + slack && Math.abs(d) < bestD) (bestD = Math.abs(d)), (best = i)
    })
    if (best >= 0) (played[best] = true), n++
  }
  return n
}
const wait = async (b) => { const now = await page.eval(`window.__rhythm.now()`); const ms = (at(b) - now) * 1000; if (ms > 0) await sleep(ms) }
await wait(-3.4)
await snap('count-in-one')
await wait(-1.3)
await snap('count-in-three')

// 2. Play: most notes in time (some a little early, some late), let two go by, one tap off the beat.
const skip = new Set([5, 6])
const offset = (i) => (i % 3 === 0 ? -0.12 : i % 3 === 1 ? 0.05 : 0.2) * info.beat
let expected = 0
for (let i = 0; i < info.notes.length; i++) {
  const [nb] = info.notes[i]
  if (skip.has(i)) {
    if (i === 5) { await wait(nb - 0.6); await snap('a-note-coming-untapped') }
    if (i === 6) { await wait(nb + 0.05); await snap('untapped-note-plays-itself') }
    continue
  }
  // One tap off the beat, halfway between two notes that are far enough apart.
  const prev = info.notes[i - 1]?.[0]
  if (prev !== undefined && nb - prev >= 2 && !skip.has(i - 1)) {
    await tapAt(at((prev + nb) / 2), elsewhere)
    await sleep(60)
    await snap('tap-off-the-beat')
  }
  await tapAt(at(nb) + offset(i), i % 4 === 2 ? elsewhere : circle)
  expected++
  if (i === 1 || i === 9) { await sleep(70); await snap(`hit-${i}`) }
  if (i === 3) { await sleep(300); await snap('between-notes') }
}
await page.waitFor(`['end', 'ask'].includes(document.querySelector('.rhythm-layer')?.dataset.phase)`, 20000)
const hits = await page.eval(`+document.querySelector('.rhythm-layer').dataset.hits`)
{
  // (A touch within a few hundredths of a beat of the window's edge may go either way.)
  const touches = await page.eval(`window.__touches`)
  const lo = playedBy(touches, -0.03), hi = playedBy(touches, 0.03)
  check(hits >= lo && hits <= hi, `hits: ${hits} of ${info.notes.length} (${expected} tapped, ${lo === hi ? lo : `${lo} to ${hi}`} landed in time)`)
}
await sleep(500)
await snap('the-end-fanfare')
await page.waitFor(`document.querySelector('.rhythm-layer')?.dataset.phase === 'ask'`, 30000)
await sleep(300)
await snap('again-or-go-on')
const s1 = await said()
check(s1.some((l) => /on the beat|every single note/.test(l)), `a kind word: ${JSON.stringify(s1.filter((l) => /beat|note|song/.test(l)))}`)

// 3. Again, without tapping: the hand and the hint come, and the tune still plays through.
const again = await page.eval(`(() => { const r = document.querySelector('.rhythm-again').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })()`)
await page.tap(Math.round(again[0]), Math.round(again[1]))
await page.waitFor(`document.querySelector('.rhythm-layer')?.dataset.phase === 'count'`, 5000)
const info2 = await page.eval(`({ start: window.__rhythm.start })`)
info.start = info2.start
await wait(-1.5)
await snap('again-count-in-hand')
const before = (await said()).length
await wait(9.5)
await snap('no-taps-hand-again')
check((await said()).slice(before).some((l) => /reaches the circle/.test(l)), 'no taps for a while: "Tap when a note reaches the circle!"')
await page.waitFor(`document.querySelector('.rhythm-layer')?.dataset.phase === 'ask'`, 40000)
check((await page.eval(`+document.querySelector('.rhythm-layer').dataset.hits`)) === 0, 'no taps, no hits, and it still finished')
// After the song the circle plays the tune, a note a tap.
for (let k = 0; k < 3; k++) { await page.tap(circle[0], circle[1]); await sleep(250) }
await snap('free-play')
const next = await page.eval(`(() => { const r = document.querySelector('.rhythm-next').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })()`)
await page.tap(Math.round(next[0]), Math.round(next[1]))
await page.waitFor(`document.querySelector('[data-game-done]')?.dataset.gameDone === 'yes'`, 10000).then(
  () => check(true, 'onDone was called'), () => check(false, 'onDone was called'))
console.log('said:', JSON.stringify(await said()))
console.log('errors:', page.errors)
await page.close()
