// How the robot plays each kind of island step and learning exercise (the moves come from the film
// scripts in scripts/film/). Each player plays until its step is over; it may make wrong moves on the
// way (there's no failure in the game: a wrong move just wiggles), but it always finishes.
import { App, sleep } from './app'

// ---------- questions and exercises ----------

/** Taps the choices in turn until the right one lights up. */
export async function answerQuestion(app: App) {
  const n = await app.eval<number>(`document.querySelectorAll('.q-card .q-choice').length`)
  for (let i = 0; i < n; i++) {
    if (await app.eval(`!!document.querySelector('.q-choice.right')`)) return
    const c = await app.box('.q-card .q-choice', i)
    if (!c) return
    await app.tap(c.x, c.y)
    if (await app.becomes(`!!document.querySelector('.q-choice.right')`, 450)) return
  }
}

/** Drags tile texts into the open slots of a tile board, in order. */
async function fillTiles(app: App, want: string[]) {
  for (let guard = 0; guard < 12; guard++) {
    const open = await app.eval<number[]>(`[...document.querySelectorAll('.tb-slot.open')].map((s) => +s.dataset.slot)`)
    if (!open.length) return
    const slot = open[0]
    const k = await app.eval<number>(`[...document.querySelectorAll('.tb-tray .tb-tile')].findIndex((t) => !t.disabled && t.textContent === ${JSON.stringify(want[slot])})`)
    const from = k >= 0 ? await app.box('.tb-tray .tb-tile', k) : await app.box('.tb-tile.glow')
    const to = await app.box(`.tb-slot[data-slot="${slot}"]`)
    if (!from || !to) return
    await app.drag(from, to)
    await sleep(250)
  }
}

/** The tiles of a sentence, in order: each tile is the next words of it. */
function sentenceOrder(sentence: string, tiles: string[]) {
  const out: string[] = []
  const left = [...tiles]
  let rest = sentence
  while (left.length) {
    const fits = left.filter((t) => rest.startsWith(t) && (rest.length === t.length || rest[t.length] === ' ')).sort((a, b) => b.length - a.length)
    if (!fits.length) break
    out.push(fits[0])
    left.splice(left.indexOf(fits[0]), 1)
    rest = rest.slice(fits[0].length).trimStart()
  }
  return out
}

/** Plays the interactive exercise on screen (src/learn/topics), until it's solved. */
export async function solveExercise(app: App) {
  const kind = await app.eval<string>(`[...document.querySelector('.ex-card').classList].find((c) => c.startsWith('ex-') && c !== 'ex-card')?.slice(3)`)
  switch (kind) {
    case 'wordbuild': {
      const word = await app.eval<string>(`document.querySelector('.tb-picture')?.getAttribute('aria-label')`)
      await fillTiles(app, [...word])
      break
    }
    case 'sentencebuild': {
      const sentence = await app.eval<string>(`document.querySelector('.tb-scene')?.getAttribute('aria-label')`)
      const tiles = await app.eval<string[]>(`[...document.querySelectorAll('.tb-tray .tb-tile')].map((t) => t.textContent)`)
      await fillTiles(app, sentenceOrder(sentence, tiles))
      break
    }
    case 'numberline': {
      const [start, goal] = await app.eval<[number, number]>(`(() => { const l = document.querySelector('.nm-line'); return [+l.dataset.start, +l.dataset.goal] })()`)
      const btn = goal > start ? 'Hop forward' : 'Hop back'
      for (let i = 0; i < Math.abs(goal - start); i++) {
        await app.tapOn(`.nm-hop-btn[aria-label="${btn}"]`)
        await sleep(430) // (a hop takes 340 ms; a tap during it is ignored)
      }
      break
    }
    case 'clock': {
      const hour = parseInt(await app.eval<string>(`document.querySelector('.tm-time-card').textContent`), 10)
      const c = (await app.box('.tm-clock-big'))!
      const a = (hour * 30 * Math.PI) / 180
      await app.tap(c.x + Math.sin(a) * c.w * 0.32, c.y - Math.cos(a) * c.h * 0.32)
      break
    }
    case 'coins': {
      const price = parseInt(await app.eval<string>(`document.querySelector('.tm-tag').textContent`), 10)
      let left = price
      for (const [coin, cents] of [['dime', 10], ['nickel', 5], ['penny', 1]] as const) {
        while (left >= cents) {
          await app.dragSel(`.tm-purse-coin[data-coin="${coin}"]`, '.tm-counter')
          left -= cents
          await sleep(350)
        }
      }
      break
    }
    case 'measure': {
      // Which is shortest isn't written anywhere: try each in turn for each place (a wrong one wiggles back).
      for (let s = 0; s < 3; s++) {
        const things = await app.eval<number[]>(`[...document.querySelectorAll('.tm-tray .tm-thing-btn[data-thing]')].map((b) => +b.dataset.thing)`)
        for (const i of things) {
          if (await app.eval(`!!document.querySelector('.tm-slot[data-slot="${s}"].filled')`)) break
          const b = await app.box(`.tm-thing-btn[data-thing="${i}"]`)
          if (!b) continue
          await app.tap(b.x, b.y)
          if (await app.becomes(`!!document.querySelector('.tm-slot[data-slot="${s}"].filled')`, 900)) break
          await sleep(300)
        }
      }
      break
    }
    default:
      throw new Error(`no player for the exercise kind "${kind}"`)
  }
  return kind
}

let marks = 0
/** Marks the element an expression gives, and returns an expression true once it's gone (replaced or removed). */
export async function mark(app: App, expr: string) {
  const id = ++marks
  await app.eval(`(() => { const e = ${expr}; if (e) e.__e2e = ${id} })()`)
  return `(${expr})?.__e2e !== ${id}`
}

/** A practice run (or quiz): every question and exercise until the step is over. Returns the exercise kinds met. */
async function practice(app: App, gone: () => Promise<boolean>) {
  const kinds: string[] = []
  await app.waitFor(`!!document.querySelector('.start-tap, .q-card')`, 20_000, 'a practice card')
  await app.tapIf('.start-tap')
  for (let guard = 0; guard < 20 && !(await gone()); guard++) {
    if (!(await app.becomes(`!!document.querySelector('.q-card')`, 5000))) continue
    const next = await mark(app, `document.querySelector('.q-card')`)
    if (await app.eval(`!!document.querySelector('.ex-card')`)) kinds.push(await solveExercise(app))
    else await answerQuestion(app)
    await app.waitFor(next, 20_000, 'the next card')
  }
  return kinds
}

// ---------- island steps ----------

type Player = (app: App, gone: () => Promise<boolean>) => Promise<unknown>

/** Where a point on a game board (in its own units) is on the screen. */
const onScreen = (layer: string, x: number, y: number) =>
  `(() => { const m = document.querySelector(${JSON.stringify(layer)}).getScreenCTM(); const p = new DOMPoint(${x}, ${y}).matrixTransform(m); return [p.x, p.y] })()`

export const STEPS: Record<string, Player> = {
  async story(app, gone) {
    for (let page = 0; page < 40 && !(await gone()); page++) {
      // ("Think about it" after the last page: answer it, then on to the next activity)
      if (await app.eval(`!!document.querySelector('.story-think .q-card')`)) {
        await answerQuestion(app)
        await app.waitFor(`!!document.querySelector('.story-think .story-nav')`, 20_000, 'the think question answered')
      }
      await app.tapOn('.story-nav .big-btn:last-child')
      await sleep(150)
    }
  },

  async pairs(app, gone) {
    await app.waitFor(`document.querySelectorAll('.pair-card').length > 0`)
    for (let round = 0; round < 12 && !(await gone()); round++) {
      const pair = await app.eval<[string, string] | null>(`(() => { const cs = [...document.querySelectorAll('.pair-card:not(.boarded)')].filter((c) => c.style.visibility !== 'hidden');
        const what = (c) => c.querySelector('[aria-label]')?.getAttribute('aria-label') ?? c.textContent;
        for (const a of cs) for (const b of cs) if (a !== b && what(a) === what(b)) return [a.dataset.card, b.dataset.card]; return null })()`)
      if (!pair) break
      const a = await app.box(`[data-card="${pair[0]}"]`)
      const b = await app.box(`[data-card="${pair[1]}"]`)
      if (a && b) await app.drag(a, b)
      await sleep(900)
    }
  },

  practice,
  quiz: practice,

  async sequence(app, gone) {
    await app.waitFor(`!!document.querySelector('.seq-slot')`)
    for (let guard = 0; guard < 30 && !(await gone()); guard++) {
      const next = await app.box('.seq-slot.next')
      if (!next) { await sleep(300); continue }
      const cards = await app.eval<number>(`document.querySelectorAll('.seq-card:not(.used)').length`)
      let placed = false
      for (let i = 0; i < cards && !placed; i++) {
        const before = await app.eval<number>(`document.querySelectorAll('.seq-slot.filled').length`)
        const c = await app.box('.seq-card:not(.used)', i)
        if (!c) continue
        await app.drag(c, next)
        placed = await app.becomes(`document.querySelectorAll('.seq-slot.filled').length > ${before}`, 900)
      }
      if (!placed) await sleep(800) // (still being read out: try again)
    }
  },

  async sort(app, gone) {
    for (let guard = 0; guard < 40 && !(await gone()); guard++) {
      if (!(await app.becomes(`!!document.querySelector('.sort-card') && !document.querySelector('.sort-card').style.visibility`, 6000))) continue
      const bins = await app.eval<number>(`document.querySelectorAll('.sort-bin').length`)
      for (let b = 0; b < bins; b++) {
        const before = await app.eval<number>(`document.querySelectorAll('.bin-items > span').length`)
        const bin = await app.box('.sort-bin', b)
        if (bin) await app.tap(bin.x, bin.y)
        if (await app.becomes(`document.querySelectorAll('.bin-items > span').length > ${before}`, 800)) break
        await sleep(400)
      }
    }
  },

  async count(app, gone) {
    for (let round = 0; round < 8 && !(await gone()); round++) {
      // (Done stays greyed out while the narrator is talking.)
      if (!(await app.becomes(`!!document.querySelector('.count-basket .big-btn:not(:disabled)')`, 15_000))) continue
      const need = await app.eval<number>(`+document.querySelector('.count-goal b')?.textContent`)
      const have = await app.eval<number>(`document.querySelectorAll('.count-in > *').length`)
      for (let k = have; k < need; k++) {
        await app.dragSel('.count-pile .count-thing', '.count-bin')
        await sleep(450)
      }
      const next = await mark(app, `document.querySelector('.count-goal b')`)
      await app.tapOn('.count-basket .big-btn')
      await Promise.race([app.becomes(next, 8000), (async () => { while (!(await gone())) await sleep(200) })()])
    }
  },

  async trace(app, gone) {
    for (let letter = 0; letter < 8 && !(await gone()); letter++) {
      await app.waitFor(`!!document.querySelector('.trace-canvas:not(.done)') || !document.querySelector('.trace')`)
      if (await gone()) break
      await sleep(300) // (the letter is drawn once its font has loaded)
      // Where the letter is, the way the game works it out (TraceLetter.tsx): rows of runs inside it.
      const runs = await app.eval<[number, number, number][]>(`(async () => {
        const FONT = '800 380px "Baloo 2", system-ui, sans-serif', SIZE = 420
        await document.fonts.load(FONT).catch(() => {})
        const c = document.querySelector('.trace-canvas'); const r = c.getBoundingClientRect()
        const letter = document.querySelector('.trace-tools .instruction').textContent.replace(/^\\S+\\s*/, '').trim()
        const m = document.createElement('canvas'); m.width = m.height = SIZE
        const g = m.getContext('2d'); g.font = FONT; g.textAlign = 'center'; g.textBaseline = 'middle'
        g.fillText(letter, SIZE / 2, SIZE / 2 + 24)
        const px = g.getImageData(0, 0, SIZE, SIZE).data
        const k = r.width / SIZE, out = []
        for (let y = 10; y < SIZE; y += 18) {
          let from = -1
          for (let x = 0; x <= SIZE; x++) {
            const ink = x < SIZE && px[(y * SIZE + x) * 4 + 3] > 128
            if (ink && from < 0) from = x
            if (!ink && from >= 0) { if (x - from > 6) out.push([r.left + (from + 8) * k, r.left + (x - 8) * k, r.top + y * k]); from = -1 }
          }
        }
        return out
      })()`)
      for (const [x1, x2, y] of runs) {
        if (await app.eval(`!!document.querySelector('.trace-canvas.done')`)) break
        const n = Math.max(2, Math.ceil((x2 - x1) / 16))
        await app.dragPath(Array.from({ length: n + 1 }, (_, i) => [x1 + ((x2 - x1) * i) / n, y] as [number, number]), 0)
      }
      await app.becomes(`!!document.querySelector('.trace-canvas.done') || !document.querySelector('.trace')`, 3000)
      await app.becomes(`!document.querySelector('.trace-canvas.done')`, 15_000)
    }
  },

  async maze(app, gone) {
    await app.waitFor(`!!document.querySelector('.maze-cell.can')`, 20_000, 'the maze to start')
    // Work out the way from the walls, then tap each square along it.
    const route = await app.eval<number[]>(`(() => {
      const cells = [...document.querySelectorAll('.maze-cell')];
      const W = +/repeat\\((\\d+)/.exec(document.querySelector('.maze-grid').style.gridTemplateColumns)[1], H = cells.length / W;
      const open = (c, side) => cells[c].style['border' + side + 'Color'] === 'transparent';
      const nb = (c) => { const r = []; if (c >= W && open(c, 'Top')) r.push(c - W); if (c < W * (H - 1) && open(c, 'Bottom')) r.push(c + W); if (c % W && open(c, 'Left')) r.push(c - 1); if (c % W < W - 1 && open(c, 'Right')) r.push(c + 1); return r };
      const prev = { 0: -1 }; const q = [0];
      while (q.length) { const c = q.shift(); for (const n of nb(c)) if (!(n in prev)) { prev[n] = c; q.push(n) } }
      const p = []; for (let c = W * H - 1; c !== -1 && c !== undefined; c = prev[c]) p.unshift(c);
      return p
    })()`)
    for (const c of route.slice(1)) {
      if (await gone()) break
      const b = await app.box(`.maze-cell[data-cell="${c}"]`)
      if (b) await app.tap(b.x, b.y)
      await sleep(260)
    }
  },

  async verse(app, gone) {
    // While it's read aloud every slot shows its words: note the order.
    await app.waitFor(`[...document.querySelectorAll('.verse-slot')].length > 0 && [...document.querySelectorAll('.verse-slot')].every((s) => s.textContent !== '…')`, 30_000, 'the verse read aloud')
    const order = await app.eval<string[]>(`[...document.querySelectorAll('.verse-slot')].map((s) => s.textContent)`)
    await app.waitFor(`!!document.querySelector('.verse-slot.next')`, 40_000, 'the verse to build')
    for (let i = 0; i < order.length && !(await gone()); i++) {
      const chip = await app.boxOf(`[...document.querySelectorAll('.verse-chip:not(.used)')].find((c) => c.textContent === ${JSON.stringify(order[i])})`)
      const slot = await app.box('.verse-slot.next')
      if (!chip || !slot) break
      await app.drag(chip, slot)
      await app.becomes(`document.querySelectorAll('.verse-slot.filled').length > ${i}`, 3000)
    }
  },

  async build(app, gone) {
    await app.waitFor(`document.querySelector('.build-it')?.dataset.ready === 'yes'`, 30_000, 'Build it to be ready')
    for (let guard = 0; guard < 40 && !(await gone()); guard++) {
      await app.becomes(`!document.querySelector('.build-float')`, 10_000)
      const free = await app.eval<string[]>(`[...document.querySelectorAll('.build-slot:not(.in)')].filter((s) => s.dataset.free === 'yes').map((s) => s.dataset.part)`)
      if (!free.length) { await sleep(300); continue }
      const a = await app.box(`.build-slot[data-part="${free[0]}"]`)
      const b = await app.box(`[data-place="${free[0]}"]`)
      if (a && b) await app.drag(a, b, { steps: 18, lift: 50 })
      await sleep(500)
    }
  },

  async spot(app, gone) {
    await app.waitFor(`document.querySelector('.spot-it')?.dataset.ready === 'yes'`, 30_000, 'Spot it to be ready')
    for (let guard = 0; guard < 4 && !(await gone()); guard++) {
      const things = await app.eval<{ x: number; y: number; found: boolean }[]>(`(() => {
        const svg = document.querySelector('.spot-tap'); if (!svg) return []
        const m = svg.getScreenCTM()
        return [...document.querySelectorAll('[data-target]')].map((g) => {
          const [x, y] = g.dataset.at.split(',').map(Number); const p = new DOMPoint(x, y).matrixTransform(m)
          return { x: p.x, y: p.y, found: g.dataset.found === 'yes' } })
      })()`)
      for (const t of things.filter((t) => !t.found)) {
        await app.tap(t.x, t.y)
        await sleep(700)
      }
      await sleep(1000)
    }
  },

  async paint(app, gone) {
    await app.waitFor(`document.querySelector('.paint-it')?.dataset.ready === 'yes'`, 30_000, 'Paint it to be ready')
    for (let guard = 0; guard < 3 && !(await gone()); guard++) {
      const regions = await app.eval<{ n: number; x: number; y: number; painted: boolean }[]>(`[...document.querySelectorAll('[data-num-for]')].map((g) => {
        const r = g.querySelector('text').getBoundingClientRect()
        return { n: Number(g.dataset.n), x: r.left + r.width / 2, y: r.top + r.height / 2, painted: !!g.querySelector('.gone') } })`)
      const numbers = [...new Set(regions.filter((r) => !r.painted).map((r) => r.n))]
      for (const num of numbers) {
        await app.tapIf(`.paint-pot[data-n="${num}"]`)
        await sleep(400)
        for (const r of regions.filter((q) => q.n === num && !q.painted)) {
          await app.tap(r.x, r.y)
          await sleep(550)
        }
      }
      await sleep(800)
    }
  },

  async steer(app) {
    await app.waitFor(`!!document.querySelector('.steer-halo')`, 30_000, 'Steer it to be ready')
    await sleep(500)
    const way = await app.eval<[number, number][]>(`(() => { const l = document.querySelector('.steer-layer'); const m = l.getScreenCTM();
      return l.dataset.way.split(' ').map((xy) => { const [x, y] = xy.split(',').map(Number); const p = new DOMPoint(x, y).matrixTransform(m); return [p.x, p.y] }) })()`)
    // Lead the hero along the whole way, a few px at a time, then hold the finger at the goal until it arrives.
    const pts: [number, number][] = []
    for (let i = 0; i < way.length - 1; i++) {
      const [a, b] = [way[i], way[i + 1]]
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6))
      for (let k = 0; k < n; k++) pts.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
    }
    pts.push(way[way.length - 1])
    const m = app.page.mouse
    await m.move(pts[0][0], pts[0][1])
    await m.down()
    for (const [x, y] of pts) { await m.move(x, y); await sleep(12) }
    await app.becomes(`document.querySelector('.steer-layer')?.dataset.finished === 'yes' || !document.querySelector('.steer-layer')`, 20_000)
    await m.up()
  },

  async rhythm(app) {
    await app.waitFor(`['count', 'start'].includes(document.querySelector('.rhythm-layer')?.dataset.phase)`, 30_000, 'the rhythm game to start')
    if (await app.eval(`document.querySelector('.rhythm-layer').dataset.phase === 'start'`)) await app.tapOn('.rhythm-play')
    // (The tune plays through whether she taps or not: a few taps on the circle, then let it finish.)
    const circle = await app.eval<[number, number]>(onScreen('.rhythm-layer', 610, 245))
    for (let k = 0; k < 4; k++) { await sleep(700); await app.tap(circle[0], circle[1]) }
    await app.waitFor(`document.querySelector('.rhythm-layer')?.dataset.phase === 'ask'`, 150_000, 'the tune to end')
    await app.tapOn('.rhythm-next')
  },

  async share(app, gone) {
    await app.waitFor(`!!document.querySelector('.share-it')`)
    for (let guard = 0; guard < 10 && !(await gone()); guard++) {
      if (!(await app.becomes(`document.querySelector('.share-it')?.dataset.busy === 'no'`, 40_000))) continue
      const round = await app.eval<number>(`Number(document.querySelector('.share-it')?.dataset.round)`)
      for (let g = 0; g < 40; g++) {
        const s = await app.eval<{ pile: number; busy: boolean; plates: number[] } | null>(`(() => { const g = document.querySelector('.share-it'); if (!g) return null; return {
          busy: g.dataset.busy === 'yes', pile: document.querySelectorAll('.share-pile .share-thing').length,
          plates: [...document.querySelectorAll('.share-zone')].map((z) => z.querySelectorAll('.share-thing').length) } })()`)
        if (!s || !s.pile || s.busy) break
        const to = s.plates.indexOf(Math.min(...s.plates))
        const a = await app.box('.share-pile .share-thing')
        const b = await app.box(`.share-zone[data-plate="${to}"] .share-plate`)
        if (!a || !b) break
        await app.drag(a, b)
        await sleep(380)
      }
      await app.becomes(`(() => { const g = document.querySelector('.share-it'); return !g || Number(g.dataset.round) !== ${round} })()`, 40_000)
    }
  },

  async catch(app, gone) {
    await app.waitFor(`document.querySelector('.catch-layer')?.dataset.ready === 'yes'`, 30_000, 'Catch it to be ready')
    const t0 = Date.now()
    while (!(await gone()) && Date.now() - t0 < 180_000) {
      const s = await app.eval<{ done: boolean; cx: number; laneY: number; width: number; next: { x: number; y: number } | null } | null>(`(() => {
        const l = document.querySelector('.catch-layer'); if (!l) return null
        const at = (el) => { const t = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(el?.getAttribute('transform') || ''); return t ? [+t[1], +t[2]] : [NaN, NaN] }
        const falling = [...l.querySelectorAll('.catch-thing')].filter((e) => e.dataset.state === 'falling').map((e) => { const [x, y] = at(e); return { x, y } }).sort((a, b) => b.y - a.y)
        return { done: l.dataset.finished === 'yes', cx: at(l.querySelector('.catch-catcher'))[0], laneY: +l.dataset.laneY, width: +l.dataset.width, next: falling[0] ?? null }
      })()`)
      if (!s || s.done) break
      if (s.next && Math.abs(s.next.x - s.cx) > s.width * 0.25) {
        // A touch on the board: the catcher glides over under it.
        const p = await app.eval<[number, number]>(onScreen('.catch-layer', s.next.x, Math.max(30, s.next.y)))
        await app.tap(p[0], p[1])
      }
      await sleep(120)
    }
  },

  async battle(app, gone) {
    await app.waitFor(`!!document.querySelector('.battle')`)
    for (let guard = 0; guard < 80 && !(await gone()); guard++) {
      const phase = await app.eval<string>(`document.querySelector('.battle')?.className ?? ''`)
      if (phase.includes('phase-team')) { await app.tapOn('.team-card'); await sleep(1200); continue }
      if (phase.includes('phase-pick')) {
        const i = await app.eval<number>(`[...document.querySelectorAll('.move-btn')].findIndex((b) => !b.className.includes('locked') && !b.className.includes('charging'))`)
        const b = i >= 0 ? await app.box('.move-btn', i) : null
        if (b) await app.tap(b.x, b.y)
        await sleep(800)
        continue
      }
      if (phase.includes('phase-question')) {
        const n = await app.eval<number>(`document.querySelectorAll('.battle .q-choice').length`)
        for (let i = 0; i < n; i++) {
          const c = await app.box('.battle .q-choice', i)
          if (!c) break
          await app.tap(c.x, c.y)
          await sleep(400)
          if (!(await app.eval(`document.querySelector('.battle')?.className.includes('phase-question')`)) || (await app.eval(`!!document.querySelector('.q-choice.right')`))) break
        }
        await sleep(1200)
        continue
      }
      if (phase.includes('phase-ask')) {
        await sleep(1500)
        const ball = await app.box('.throw-grab')
        const foe = await app.box('.foe-body')
        if (ball && foe) await app.drag(ball, foe, { steps: 20, lift: 120, ms: 18 })
        await sleep(2500)
        continue
      }
      // Caught: "… joined your Ark!", and a button to go on.
      if (await app.tapIf('.battle .big-btn')) { await sleep(800); continue }
      await sleep(500)
    }
  },

  // The end of the visit: nothing to play (the test taps the map button).
  async pause() {},
}

// ---------- islands ----------

/** Each step's kind, from the island's own data (loaded in the page, as the game loads it). */
export const stepKinds = (app: App, id: string) =>
  app.eval<string[]>(`import('/src/data/islands.ts').then((m) => m.loadIsland(${JSON.stringify(id)})).then((i) => i.steps.map((s) => s.kind))`)

/** Opens an island from the map (the boat is already there, so a tap goes straight in). */
export async function openIsland(app: App, id: string) {
  await app.waitFor(`!!document.querySelector('[data-island="${id}"] .map-hit')`, 15_000, `${id} on the map`)
  await app.tapOn(`[data-island="${id}"] .map-hit`)
  await app.waitFor(`!!document.querySelector('.island-body')`, 20_000, `${id} to open`)
}

/** Plays steps from `from` until a step of kind `until` (or the end of the visit); returns the kinds played. */
export async function playSteps(app: App, kinds: string[], from: number, until = 'pause') {
  const played: string[] = []
  for (let step = from; step < kinds.length; step++) {
    const kind = kinds[step]
    await app.waitFor(`!!document.querySelector('.island-body > *')`, 20_000, `step ${step} (${kind})`)
    await app.page.waitForTimeout(300)
    await app.shot(`step-${step}-${kind}`)
    if (kind === until) break
    const t0 = Date.now()
    const play = STEPS[kind]
    if (!play) throw new Error(`no player for the step kind "${kind}"`)
    const over = await mark(app, `document.querySelector('.island-body')`)
    const gone = () => app.eval<boolean>(over)
    await play(app, gone)
    await app.waitFor(over, 90_000, `the ${kind} step (${step}) to finish`)
    played.push(kind)
    if (process.env.E2E_TIMES) console.log(`  ${kind}: ${((Date.now() - t0) / 1000).toFixed(1)} s`)
  }
  return played
}
