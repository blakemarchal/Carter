// Catch it: catch what falls (types.ts, CatchKit): God's people gathering manna each morning; later, rain
// in jars and fish in Peter's net. Things fall gently from the top of the board, one or two at a time,
// drifting and turning a little on the way down, and she moves the catcher along its lane to catch them:
// she can drag it, or touch anywhere on the board to make it glide there. A thing that reaches the
// opening drops in with a little bounce and a sparkle, the catcher fills up, and it's counted aloud
// ("One!", "Two!"). A miss lands softly and fades: nothing is lost, and another one comes. Kind to small
// hands: slow at first, never more than two at once, and after two misses in a row the next one falls
// slower and nearer the catcher. A hand slides a shadow of the catcher under a falling thing at the start,
// and again after eight seconds without a catch. At the goal: fanfare, confetti, a happy hop, the `done`
// line, then onDone.
//
// The lane is where the opening runs: its edges stay between lane.from and lane.to, so its middle goes
// from lane.from + width / 2 to lane.to - width / 2 (as the kit preview shows it). Everything moves by
// requestAnimationFrame and the real time between frames, so the game runs at the same speed everywhere.
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type PointerEvent as RPointerEvent } from 'react'
import type { CatchKit } from './types'
import { Board, BoardLayer, toBoard } from './Board'
import { Confetti } from '../../components/ui'
import { sparkle } from '../../art/scenes/kit'
import { preload, speak } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import { numberWords } from '../../lib/spoken'
import { useAlive } from '../../lib/useAlive'
import { wait } from '../../lib/util'
import './CatchIt.css'

const FALL_FIRST = 4.6 // seconds from the top of the board down to the opening, at first
const FALL_LAST = 3.2 // and near the end
const HELP_SLOWER = 1.45 // after two misses in a row, the next one takes this much longer to fall
const SWAY = 13 // how far a falling thing drifts to each side (board units)
const SPIN = 14 // and how far it turns each way (degrees)
const FORGIVE = 18 // a thing this far past the edge of the opening still drops in
const SCOOP = 28 // a catcher slid under a thing up to this far below the opening still scoops it up
const GLIDE = 950 // the catcher's top speed gliding over to a touch (board units a second)
const FOLLOW = 2400 // and following a finger that holds it
const IDLE = 8000 // ms without a catch before the hand shows how again
const IN_MS = 720 // a caught thing drops in, bounces and settles in this long
const HINT_REP = 2300 // one slide of the hand (it slides twice)

type Box = { x: number; y: number; w: number; h: number }
type Boxes = { catcher: Box; pieces: Box[] }
const PIECE_BOX: Box = { x: -16, y: -16, w: 32, h: 32 }

/** One falling thing, as the game loop moves it. */
interface Faller {
  id: number
  /** Which of the kit's pieces it is. */
  k: number
  /** Where it set off (x0 is the middle of its sway), how fast it falls, and how it sways and turns. */
  x0: number; y0: number; vy: number; phase: number; omega: number; sway: number; spin: number
  /** Where it is now, how it's turned and squashed, and how see-through. */
  x: number; y: number; r: number; sx: number; sy: number; o: number
  state: 'falling' | 'in' | 'missed'
  born: number
  /** When it was caught or missed. */
  t: number
  /** Caught: how far from the middle of the opening it went in, how high it was then, and its count. */
  dx: number; cy: number; n: number
  /** Missed: where it comes to rest, and when it got there. */
  landY: number; landed: number
  /** One of the slower, nearer ones that come after misses; and where the catcher was when it set off. */
  help: boolean; cx0: number
  gone?: boolean
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2)
const easeOut = (k: number) => 1 - (1 - k) ** 3
const cap = (w: string) => w[0].toUpperCase() + w.slice(1)
/** "One!", "Two!"… */
const countLine = (n: number) => `${cap(numberWords(n))}!`

/**
 * How far a caught thing has gone into the catcher as `k` runs 0 to 1 (0 at the opening, 1 down in the
 * pile; the catcher is drawn in front of it): in, a little bounce that peeks back up over the rim, and
 * down into the pile.
 */
function dropIn(k: number) {
  if (k < 0.3) return 0.9 * (k / 0.3) ** 2
  if (k < 0.62) return 0.9 - 1.45 * Math.sin((Math.PI * (k - 0.3)) / 0.32)
  return 0.9 + 0.5 * ((k - 0.62) / 0.38)
}

/** What falls when a kit has no pictures for it: a golden drop. */
const Dot: ComponentType = () => <circle r={14} fill="#ffe680" stroke="#d9a400" strokeWidth={3} />

/** A friendly pointing hand, its fingertip at (0, 0) (the same hand as in Steer it). */
function Hand() {
  const shapes = (
    <>
      <rect x={-9} y={-2} width={18} height={48} rx={9} />
      <rect x={-15} y={30} width={52} height={48} rx={17} />
      <circle cx={13} cy={35} r={9} />
      <circle cx={24} cy={38} r={8.5} />
      <circle cx={33} cy={43} r={8} />
      <ellipse cx={-15} cy={54} rx={9} ry={15} transform="rotate(-28 -15 54)" />
    </>
  )
  return (
    <g transform="rotate(-14) scale(.95)">
      <g fill="#6b4a8a" stroke="#6b4a8a" strokeWidth={8} strokeLinejoin="round">{shapes}</g>
      <g fill="#ffffff">{shapes}</g>
      <path d="M-3 6 v14" stroke="#e7dcf2" strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

/** How many so far: a little picture of what's caught, and "4 of 10". */
function Counter({ n, goal, Piece, box }: { n: number; goal: number; Piece: ComponentType; box?: Box }) {
  const s = box ? Math.max(box.w, box.h) * 1.12 : 0
  return (
    <div className="catch-count" role="img" aria-label={`${n} of ${goal}`}>
      {box && (
        <svg className="catch-count-pic pa-anim" viewBox={`${box.x + box.w / 2 - s / 2} ${box.y + box.h / 2 - s / 2} ${s} ${s}`} aria-hidden>
          <Piece />
        </svg>
      )}
      <b key={n}>{n}</b>
      <span>of {goal}</span>
    </div>
  )
}

export default function CatchIt({ title, intro, done, plural, kit, onDone }: {
  title: string; intro: string; done: string; plural: string; kit: CatchKit; onDone: () => void
}) {
  const alive = useAlive()
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const { lane, width } = kit
  const goal = Math.max(0, Math.round(kit.goal))
  const half = width / 2
  // Where the middle of the opening can go (a lane narrower than the opening keeps it in the middle).
  const lo = Math.min(lane.from + half, (lane.from + lane.to) / 2)
  const hi = Math.max(lane.to - half, (lane.from + lane.to) / 2)
  const mid = (lo + hi) / 2
  const pieces = useMemo(() => (kit.falling.length ? kit.falling : [Dot]), [kit])
  const lines = useMemo(() => ({
    start: `Catch the ${plural}!`,
    idle: [`Slide under the ${plural} to catch them!`, `Catch the ${plural}!`],
  }), [plural])

  // Everything the game loop changes lives here; React only hears about what's drawn differently.
  const [g] = useState(() => ({
    started: false, busy: true, done: false, playFrom: 0,
    // The catcher: where it is, where it's headed, its speed, and how far it leans as it goes.
    cx: mid, tx: mid, v: 0, tilt: 0, drawnX: NaN, drawnTilt: NaN,
    // Her finger: which one, whether it has hold of the catcher (not just a touch beside it), and where on it.
    pointer: null as number | null, held: false, offset: 0, touched: false,
    things: [] as Faller[], nextId: 1, spawned: 0, caught: 0, missed: 0, streak: 0, nextAt: Infinity,
    lastCatch: 0, lastCount: -1e9, lastHint: -1e9, idleHints: 0, hintN: 0,
    want: null as null | { line?: string }, hint: null as null | { t0: number; id: number },
    fill: 0, fillTo: 0, fillQ: 0,
    boxes: { catcher: { x: -half, y: -12, w: width, h: 72 }, pieces: [] } as Boxes,
  }))
  // What's drawn: each thing where it set off (the game loop moves it from there), and, for the film
  // scripts, the middle of its sway, where the catcher was when it set off, and how fast it falls.
  const [list, setList] = useState<{ id: number; k: number; at: string; help: boolean; x0: number; cx: number; vy: number }[]>([])
  const [caught, setCaught] = useState(0)
  const [fill, setFill] = useState(0)
  const [fx, setFx] = useState<{ id: number; x: number; n: number }[]>([])
  const [boxes, setBoxes] = useState<Boxes | null>(null)
  const [busy, setBusy] = useState(true)
  const [touched, setTouched] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [finished, setFinished] = useState(false)
  const layerRef = useRef<SVGSVGElement>(null)
  const catcherRef = useRef<SVGGElement>(null)
  const swingRef = useRef<SVGGElement>(null)
  const bumpRef = useRef<SVGGElement>(null)
  const drawRef = useRef<SVGGElement>(null)
  const ghostRef = useRef<SVGGElement>(null)
  const handRef = useRef<SVGGElement>(null)
  const glowRef = useRef<SVGGElement>(null)
  const measureRefs = useRef<(SVGGElement | null)[]>([])
  const thingEls = useRef(new Map<number, SVGGElement>())
  const fxId = useRef(0)

  const pieceBox = (k: number) => g.boxes.pieces[k] ?? PIECE_BOX

  // Measure the catcher and each falling thing once: where things start (just above the board), where a
  // miss comes to rest (about where the catcher stands), how deep a catch drops in, and where to grab.
  useLayoutEffect(() => {
    const box = (el: SVGGraphicsElement | null): Box | null => {
      try {
        const b = el?.getBBox()
        return b && b.width > 0 && b.height > 0 ? { x: b.x, y: b.y, w: b.width, h: b.height } : null
      } catch {
        return null
      }
    }
    // (A hot reload while it's being worked on measures again, when the pieces are no longer drawn to be
    // measured: keep what was measured before.)
    g.boxes = {
      catcher: box(drawRef.current) ?? g.boxes.catcher,
      pieces: pieces.map((_, i) => box(measureRefs.current[i]) ?? g.boxes.pieces[i] ?? PIECE_BOX),
    }
    setBoxes(g.boxes)
  }, [])

  // The intro first; then the first one falls, and the hand shows how to catch it. (Once only: while the
  // game is being worked on, a hot reload re-runs effects, and the intro mustn't start the game again.)
  useEffect(() => {
    if (g.started) return
    g.started = true
    ;(async () => {
      await speak(intro)
      if (!alive.current) return
      g.busy = false
      setBusy(false)
      const now = performance.now()
      g.playFrom = g.lastCatch = now
      if (goal <= 0) return void finish()
      g.nextAt = now
      g.want = { line: lines.start }
    })()
    // Fetch the lines now, so each catch is counted right away.
    preload([...Array.from({ length: goal }, (_, i) => countLine(i + 1)), lines.start, ...lines.idle, done])
  }, [])

  const addFx = (x: number, n: number) => {
    const id = ++fxId.current
    setFx((f) => [...f, { id, x, n }])
    setTimeout(() => { if (alive.current) setFx((f) => f.filter((q) => q.id !== id)) }, 1300)
  }

  /** The catcher gives under it as something drops in, and springs back (squashed from its foot). */
  const bump = () => {
    bumpRef.current?.animate?.([
      { transform: 'translateY(0) scale(1, 1)', offset: 0 },
      { transform: 'translateY(3px) scale(1.09, .87)', offset: 0.28 },
      { transform: 'translateY(-3px) scale(.96, 1.06)', offset: 0.6 },
      { transform: 'translateY(0) scale(1.01, .99)', offset: 0.82 },
      { transform: 'translateY(0) scale(1, 1)', offset: 1 },
    ], { duration: 460, easing: 'ease-out' })
  }

  /** Where the next one falls (the middle of its sway). */
  const whereNext = (help: boolean, other: Faller | undefined) => {
    const span = hi - lo
    if (span < 1) return mid
    const from = g.cx
    if (help) {
      // Just past the edge of the opening, whichever side has room: a little nudge catches it.
      const off = half + FORGIVE + 22 + Math.random() * 14
      const r = from + off <= hi, l = from - off >= lo
      const dir = r && l ? (Math.random() < 0.5 ? 1 : -1) : r ? 1 : l ? -1 : hi - from > from - lo ? 1 : -1
      return clamp(from + dir * off, lo, hi)
    }
    if (g.spawned === 0) {
      // The first: a little way off, for the hand to show.
      const off = Math.min(span / 2, Math.max(width * 1.4, span * 0.3))
      const dir = Math.random() < 0.5 ? 1 : -1
      const x = from + dir * off
      return x < lo || x > hi ? clamp(from - dir * off, lo, hi) : x
    }
    // Then anywhere along the lane (nearer the catcher at first), and never right above it. A second one
    // falls well apart from the first, but not so far that she can't get to it in time.
    const far = Math.max(width * 1.6, span * (0.5 + (0.5 * g.caught) / Math.max(1, goal)))
    for (let i = 0; i < 20; i++) {
      const x = lo + Math.random() * span
      const d = Math.abs(x - from)
      if (d < width * 0.7 || d > far) continue
      if (other && (Math.abs(x - other.x0) < width * 0.9 || Math.abs(x - other.x0) > 360)) continue
      return x
    }
    return lo + Math.random() * span
  }

  const spawn = (now: number, other: Faller | undefined) => {
    const help = g.streak >= 2
    const k = g.spawned % pieces.length
    const pb = pieceBox(k)
    const c = g.boxes.catcher
    const y0 = -(pb.y + pb.h) - 4 // just above the board
    const secs = lerp(FALL_FIRST, FALL_LAST, Math.min(1, (1.15 * g.caught) / Math.max(1, goal))) * (help ? HELP_SLOWER : 1)
    const x0 = whereNext(help, other)
    const phase = Math.random() * Math.PI * 2
    const sway = help ? SWAY * 0.5 : SWAY * (0.7 + Math.random() * 0.3)
    const ground = clamp(lane.y + c.y + c.h - 4, lane.y + 12, 446)
    const t: Faller = {
      id: g.nextId++, k, x0, y0, vy: (lane.y - y0) / secs, phase, omega: (Math.PI * 2) / (2.6 + Math.random() * 0.9), sway,
      spin: SPIN * (0.6 + Math.random() * 0.4) * (Math.random() < 0.5 ? -1 : 1),
      x: x0 + sway * Math.sin(phase), y: y0, r: 0, sx: 1, sy: 1, o: 1, state: 'falling', born: now, t: now, dx: 0, cy: 0, n: 0,
      landY: Math.max(ground - (pb.y + pb.h), lane.y + 10), landed: 0, help, cx0: g.cx,
    }
    g.things.push(t)
    g.spawned++
    g.nextAt = now + 900
  }

  const finish = async () => {
    g.done = true
    g.hint = null
    g.want = null
    g.pointer = null
    setDragging(false)
    setFinished(true)
    sfx.fanfare()
    await wait(700)
    if (!alive.current) return
    // (Long enough to see the hops, even if the line is quick.)
    await Promise.all([speak(done), wait(2200)])
    if (!alive.current) return
    await wait(600)
    if (alive.current) onDone()
  }

  const catchOne = (t: Faller, now: number) => {
    t.state = 'in'
    t.t = now
    t.dx = clamp(t.x - g.cx, -half, half)
    t.cy = t.y
    const n = ++g.caught
    t.n = n
    g.streak = 0
    g.lastCatch = now
    g.want = null
    setCaught(n)
    addFx(t.x, n)
    sfx.plop()
    sfx.count(n)
    bump()
    // (Two caught close together: the second number waits for the first instead of cutting it off.)
    const quick = now - g.lastCount < 800
    g.lastCount = now
    const said = speak(countLine(n), { interrupt: !quick })
    if (n >= goal) {
      g.done = true
      g.hint = null
      g.nextAt = Infinity
      ;(async () => {
        await said
        if (alive.current) finish()
      })()
    } else if (!g.things.some((x) => x.state === 'falling')) g.nextAt = Math.max(g.nextAt, now + 650)
  }

  const miss = (t: Faller, now: number) => {
    t.state = 'missed'
    t.t = now
    g.missed++
    g.streak++
    if (!g.things.some((x) => x.state === 'falling')) g.nextAt = Math.max(g.nextAt, now + 650)
  }

  /** The one for the hand to show: the lowest still falling, with time to get under it, and not already over the catcher. */
  const hintTarget = () => {
    let best: Faller | undefined
    for (const t of g.things) {
      if (t.state !== 'falling' || t.y < 20 || (lane.y - t.y) / t.vy < 1.1 || Math.abs(t.x0 - g.cx) < half * 0.7) continue
      if (!best || t.y > best.y) best = t
    }
    return best
  }

  // The game loop: glide the catcher, drop things, catch them or let them land, and move the hand.
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = clamp((now - last) / 1000, 0, 0.05)
      last = now

      // The catcher heads for where she wants it: smoothly up to speed, and easing in at the end. A finger
      // that holds it is followed closely; a touch beside it is glided to, and then held.
      {
        const d = g.tx - g.cx
        const held = g.pointer !== null && g.held
        const top = held ? FOLLOW : GLIDE
        const want = clamp(d * (held ? 22 : 7.5), -top, top)
        const acc = (held ? 14000 : 5200) * dt
        g.v = clamp(want, g.v - acc, g.v + acc)
        const nx = g.cx + g.v * dt
        if (Math.abs(d) < 0.05 || (d > 0 && nx >= g.tx) || (d < 0 && nx <= g.tx)) {
          g.cx = g.tx
          g.v = 0
        } else g.cx = clamp(nx, lo, hi)
        if (g.pointer !== null && !g.held && Math.abs(g.tx - g.cx) < 12) g.held = true
        const lean = clamp(g.v * 0.0045, -6, 6)
        g.tilt += (lean - g.tilt) * (1 - Math.exp(-dt * 9))
      }

      // The next one sets off: one at a time at first (and while she's being helped), then up to two, the
      // second only once the first is over halfway down. Never more than are still needed.
      let changed = false
      if (!g.busy && !g.done) {
        const fallingNow = g.things.filter((t) => t.state === 'falling')
        const room = Math.min(goal - g.caught, g.streak >= 2 || g.caught < 2 ? 1 : 2)
        const other = fallingNow[fallingNow.length - 1]
        if (fallingNow.length < room && now >= g.nextAt && (!other || (other.y - other.y0) / (lane.y - other.y0) > 0.55)) {
          spawn(now, other)
          changed = true
        }
      }

      // Everything falling, dropping in, and landing.
      const c = g.boxes.catcher
      const depth = clamp((c.y + c.h) * 0.5, 12, 40)
      for (const t of g.things) {
        const age = (now - t.born) / 1000
        if (t.state === 'falling') {
          const was = t.y
          t.y += t.vy * dt
          t.x = t.x0 + t.sway * Math.sin(t.phase + age * t.omega)
          t.r = t.spin * Math.sin(t.phase * 1.3 + age * t.omega * 0.85)
          const dx = Math.abs(t.x - g.cx)
          // (It's in once its lower part reaches the opening: that's when it starts to go out of sight behind the catcher's front.)
          const low = Math.max(0, pieceBox(t.k).y + pieceBox(t.k).h) * 0.6
          if (g.done) {
            // (The goal is reached: anything still falling just fades away.)
            t.o -= dt * 2.5
            if (t.o <= 0) t.gone = true
          } else if ((was + low < lane.y && t.y + low >= lane.y && dx <= half + FORGIVE + (t.help ? 8 : 0)) || (t.y + low > lane.y && t.y <= lane.y + SCOOP && dx <= half + 4)) {
            catchOne(t, now)
          } else if (t.y >= Math.min(lane.y + SCOOP, t.landY)) miss(t, now)
        } else if (t.state === 'in') {
          // Into the catcher (behind its front), toward the middle, with a little bounce; then it settles into the pile.
          const k = (now - t.t) / IN_MS
          if (k >= 1) t.gone = true
          else {
            t.x = g.cx + t.dx * (1 - easeOut(Math.min(1, k * 1.6)))
            t.y = lane.y + depth * dropIn(k) + (t.cy - lane.y) * Math.max(0, 1 - k / 0.3)
            t.r *= 1 - Math.min(1, dt * 8)
            t.sx = t.sy = 1 - 0.18 * k
            t.o = k < 0.62 ? 1 : 1 - (k - 0.62) / 0.38
            if (k > 0.3 && g.fillTo < t.n / goal) g.fillTo = t.n / goal
          }
        } else if (!t.landed) {
          // A miss drifts on down and slows as it comes to the ground…
          const ease = clamp((t.landY - t.y) / 40 + 0.25, 0.25, 1)
          t.y = Math.min(t.landY, t.y + t.vy * ease * dt)
          t.x = t.x0 + t.sway * Math.sin(t.phase + age * t.omega)
          t.r = t.spin * Math.sin(t.phase * 1.3 + age * t.omega * 0.85)
          if (t.y >= t.landY - 0.01) t.landed = now
        } else {
          // …settles with a soft squash, rests a moment, and fades away.
          const k = (now - t.landed) / 1000
          const s = k < 0.3 ? Math.sin((k / 0.3) * Math.PI) : 0
          t.sx = 1 + 0.12 * s
          t.sy = 1 - 0.14 * s
          t.o = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.8
          if (t.o <= 0) t.gone = true
        }
      }
      if (g.things.some((t) => t.gone)) {
        g.things = g.things.filter((t) => !t.gone)
        changed = true
      }
      if (changed) {
        setList((was) => g.things.map((t) => was.find((w) => w.id === t.id) ?? {
          id: t.id, k: t.k, help: t.help, at: `translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`, x0: t.x0, cx: t.cx0, vy: t.vy,
        }))
      }

      // The pile in the catcher grows as each one drops in.
      g.fill += (g.fillTo - g.fill) * (1 - Math.exp(-dt * 6))
      const fq = g.fillTo >= 1 && g.fill > 0.985 ? 1 : Math.round(g.fill * 40) / 40
      if (fq !== g.fillQ) {
        g.fillQ = fq
        setFill(fq)
      }

      // The hand: at the start, and after eight seconds without a catch. (The first three times with a
      // word; after that only now and then, and then the hand alone, in case she has gone off to do
      // something else.) It waits for something falling that it can show, and while her finger is down.
      if (!g.busy && !g.done && !g.hint && !g.want && now - Math.max(g.lastCatch, g.lastHint) > IDLE) {
        const k = g.idleHints++
        g.want = { line: k <= 2 || (k < 7 && k % 2 === 0) ? lines.idle[g.hintN++ % lines.idle.length] : undefined }
        g.lastHint = now
      }
      if (g.want && !g.hint && !g.done && g.pointer === null) {
        const t = hintTarget()
        if (t) {
          g.hint = { t0: now, id: t.id }
          g.lastHint = now
          if (g.want.line) speak(g.want.line)
          g.want = null
        }
      }
      const h = g.hint
      const ht = h ? g.things.find((t) => t.id === h.id) : undefined
      if (h && (!ht || ht.state !== 'falling' || g.pointer !== null || g.done || now - h.t0 > HINT_REP * 2)) g.hint = null
      const hand = handRef.current, ghost = ghostRef.current, glow = glowRef.current
      if (g.hint && ht && hand && ghost && glow) {
        const k = ((now - g.hint.t0) % HINT_REP) / HINT_REP
        const slide = k < 0.16 ? 0 : k < 0.74 ? easeInOut((k - 0.16) / 0.58) : 1
        const x = g.cx + (clamp(ht.x0, lo, hi) - g.cx) * slide
        const o = k < 0.1 ? k / 0.1 : k < 0.86 ? 1 : (1 - k) / 0.14
        const handDy = clamp((c.y + c.h) * 0.4, 10, 34)
        hand.setAttribute('transform', `translate(${x.toFixed(1)} ${(lane.y + handDy).toFixed(1)})`)
        hand.style.opacity = o.toFixed(2)
        hand.classList.toggle('pressing', k < 0.2)
        ghost.setAttribute('transform', `translate(${x.toFixed(1)} ${lane.y})`)
        ghost.style.opacity = (o * 0.45).toFixed(2)
        glow.setAttribute('transform', `translate(${ht.x.toFixed(1)} ${ht.y.toFixed(1)})`)
        glow.style.opacity = o.toFixed(2)
      } else {
        for (const el of [hand, ghost, glow]) if (el && el.style.opacity !== '0') el.style.opacity = '0'
      }

      // Draw: the catcher, and everything that's falling or going in or resting.
      const cat = catcherRef.current
      if (cat && g.cx !== g.drawnX) {
        cat.setAttribute('transform', `translate(${g.cx.toFixed(1)} ${lane.y})`)
        g.drawnX = g.cx
      }
      const tq = Math.round(g.tilt * 20) / 20
      if (swingRef.current && tq !== g.drawnTilt) {
        swingRef.current.setAttribute('transform', `rotate(${tq})`)
        g.drawnTilt = tq
      }
      for (const t of g.things) {
        const el = thingEls.current.get(t.id)
        if (!el) continue
        const b = pieceBox(t.k)
        const foot = b.y + b.h
        // (Squashed from its bottom, so it settles onto the ground rather than shrinking in mid-air.)
        el.setAttribute('transform', `translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) rotate(${t.r.toFixed(1)})` +
          (t.sx !== 1 || t.sy !== 1 ? ` translate(0 ${foot.toFixed(1)}) scale(${t.sx.toFixed(3)} ${t.sy.toFixed(3)}) translate(0 ${(-foot).toFixed(1)})` : ''))
        const o = clamp(t.o, 0, 1).toFixed(2)
        if (el.style.opacity !== o) el.style.opacity = o
        if (el.dataset.state !== t.state) el.dataset.state = t.state
      }
      const layer = layerRef.current
      if (layer && layer.dataset.missed !== String(g.missed)) layer.dataset.missed = String(g.missed)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // ---------- Her finger ----------

  const down = (e: RPointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    // (A new finger takes over from one already down: small hands put down a second finger, and a finger
    // whose lifting was missed must never leave the catcher stuck.)
    if (g.busy || g.done || g.pointer === e.pointerId) return
    const p = toBoard(e.currentTarget, e.clientX, e.clientY)
    const c = g.boxes.catcher
    // On the catcher, she has hold of it where she took it; anywhere else (even just beside it, where she
    // might tap a falling thing), it glides over to her finger, and then she has hold of it.
    const onIt = p[0] > g.cx + c.x - 12 && p[0] < g.cx + c.x + c.w + 12 && p[1] > lane.y + c.y - 30 && p[1] < lane.y + c.y + c.h + 24
    g.pointer = e.pointerId
    g.held = onIt
    g.offset = onIt ? g.cx - p[0] : 0
    g.tx = clamp(p[0] + g.offset, lo, hi)
    g.hint = null
    if (!g.touched) {
      g.touched = true
      setTouched(true)
    }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* fine */ }
    setDragging(true)
    if (onIt) sfx.lift()
  }
  const move = (e: RPointerEvent<SVGSVGElement>) => {
    if (g.pointer !== e.pointerId) return
    const p = toBoard(e.currentTarget, e.clientX, e.clientY)
    g.tx = clamp(p[0] + g.offset, lo, hi)
  }
  const up = (e: RPointerEvent<SVGSVGElement>) => {
    if (g.pointer !== e.pointerId) return
    g.pointer = null
    g.held = false
    setDragging(false)
  }

  // ---------- Drawing ----------

  const backdrop = useMemo(() => <kit.Backdrop caught={caught} />, [kit, caught])
  const front = useMemo(() => (kit.Front ? <kit.Front /> : null), [kit])
  const pieceEls = useMemo(() => pieces.map((P, i) => <P key={i} />), [pieces])
  const catcherEl = useMemo(() => <kit.Catcher fill={fill} />, [kit, fill])
  const counter = useMemo(() => <Counter n={caught} goal={goal} Piece={pieces[0]} box={boxes?.pieces[0]} />, [caught, boxes, pieces])
  // (Each thing is drawn where it set off; the game loop moves it from there.)
  const things = useMemo(() => list.map((t) => (
    <g key={t.id} className="catch-thing" transform={t.at} data-id={t.id} data-k={t.k} data-state="falling" data-help={t.help ? 'yes' : 'no'}
      data-x0={t.x0.toFixed(1)} data-cx={t.cx.toFixed(1)} data-vy={t.vy.toFixed(1)}
      ref={(el) => { if (el) thingEls.current.set(t.id, el); else thingEls.current.delete(t.id) }}>
      {pieceEls[t.k]}
    </g>
  )), [list, pieceEls])
  const c = boxes?.catcher ?? g.boxes.catcher
  const foot = c.y + c.h
  const p0 = boxes?.pieces[0] ?? PIECE_BOX
  const glowR = clamp(Math.max(p0.w, p0.h) / 2 + 18, 30, 90)
  // (The number floats up above the catcher, or below the opening when the catcher stands near the top.)
  const numY = lane.y + c.y < 90 ? foot + 40 : Math.min(-40, c.y - 18)

  return (
    <div className="activity game catch-it">
      <div className="practice-head catch-head">
        <h2>{title}</h2>
        {counter}
        {/* (not while the intro is said, or over the done line at the end) */}
        <button type="button" className="icon-btn catch-again" aria-label="Hear it again" disabled={busy || finished} onClick={() => speak(intro)}>🔊</button>
      </div>
      <Board className={finished ? 'catch-cheer' : ''}>
        {backdrop}
        <BoardLayer ref={layerRef} className={`scene catch-layer ${dragging ? 'dragging' : ''}`} aria-label={title}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up}
          data-ready={busy || finished ? 'no' : 'yes'} data-caught={caught} data-goal={goal} data-finished={finished ? 'yes' : 'no'}
          data-range={`${lo},${hi}`} data-lane-y={lane.y} data-width={width}>
          <defs>
            <radialGradient id={`${uid}glow`}>
              <stop offset="0" stopColor="#fff8c8" stopOpacity={0.95} />
              <stop offset="0.55" stopColor="#fff2a0" stopOpacity={0.45} />
              <stop offset="1" stopColor="#fff2a0" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width={800} height={450} fill="transparent" />
          {!boxes && (
            <g className="catch-measure" aria-hidden>
              {pieceEls.map((p, i) => <g key={i} ref={(el) => { measureRefs.current[i] = el }}>{p}</g>)}
            </g>
          )}
          {/* The one the hand is showing glows softly. */}
          <g ref={glowRef} className="catch-glow" style={{ opacity: 0 }}>
            <g className="catch-glow-pulse"><circle r={glowR} fill={`url(#${uid}glow)`} /></g>
          </g>
          {things}
          {/* The hand slides this shadow of the catcher under the falling thing. */}
          <g ref={ghostRef} className="catch-ghost" style={{ opacity: 0 }} transform={`translate(${mid} ${lane.y})`}>{catcherEl}</g>
          <g ref={catcherRef} className="catch-catcher" transform={`translate(${mid} ${lane.y})`}>
            {!busy && !touched && !finished && (
              <circle cy={c.y + c.h / 2} r={clamp(Math.max(c.w, c.h) / 2 + 16, 40, 150)} fill={`url(#${uid}glow)`} className="catch-halo" />
            )}
            <g ref={swingRef}>
              <g className={finished ? 'catch-hop' : undefined} style={{ transformOrigin: `0px ${foot.toFixed(1)}px` }}>
                <g ref={bumpRef} style={{ transformOrigin: `0px ${foot.toFixed(1)}px` }}>
                  <g ref={drawRef}>{catcherEl}</g>
                </g>
              </g>
            </g>
          </g>
          {front}
          {fx.map((f) => (
            <g key={f.id} transform={`translate(${f.x.toFixed(1)} ${lane.y})`}>
              <g className="catch-pop">
                <circle r={22} className="catch-pop-ring" />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
                  <path key={k} d={sparkle(0, -34, k % 2 ? 6 : 9)} transform={`rotate(${k * 45})`} fill={k % 2 ? '#ffffff' : '#ffe066'} />
                ))}
              </g>
              <g className="catch-num"><text y={numY} fontSize={46}>{f.n}</text></g>
            </g>
          ))}
          <g ref={handRef} className="catch-hand" style={{ opacity: 0 }}>
            <circle r={16} className="catch-hand-press" />
            <Hand />
          </g>
        </BoardLayer>
      </Board>
      {finished && <Confetti count={36} />}
    </div>
  )
}
