// Steer it: lead the hero along the way to the goal (types.ts, SteerKit). She puts a finger on the
// hero and slides along the glowing way. The hero goes to the nearest point of the way under her
// finger, but only forward and never faster than a brisk walk: it can't jump ahead, and sliding back
// doesn't undo anything. The followers walk behind it, things on the way are picked up and counted
// as it passes, and reaching the goal ends with a cheer. A pointing hand shows the way at the start,
// whenever she touches somewhere else, and after eight seconds without getting any further.
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import type { At, SteerKit } from './types'
import { Board, BoardLayer, toBoard } from './Board'
import { Confetti } from '../../components/ui'
import { sparkle } from '../../art/scenes/kit'
import { speak } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import { numberWords } from '../../lib/spoken'
import { useAlive } from '../../lib/useAlive'
import { wait } from '../../lib/util'
import './SteerIt.css'

const GRAB = 85 // a touch this near the hero (board units) picks it up, besides anywhere on the hero itself
const AHEAD = 170 // how far ahead of the hero her finger can pull it
const BEHIND = 320 // how far back along the way her finger is still followed (to tell "behind" from "ahead")
const SPEED = 300 // the hero's top speed, board units a second
const IDLE = 8000 // ms without getting any further before the hand shows the way again
const HINTS = ['Slide along the glowing path!', 'Keep going! Follow the glowing path all the way.']

// ---------- The way: a smooth curve through the kit's points, measured along its length ----------

type Pt = [number, number]
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1])
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * A smooth curve through the points (centripetal Catmull-Rom, which never loops or overshoots), as a
 * polyline with a point every 12 board units or so (a way that's already dense gets few new points).
 */
function smooth(path: readonly At[]): Pt[] {
  const pts: Pt[] = []
  for (const p of path) if (!pts.length || dist(pts[pts.length - 1], [p[0], p[1]]) > 0.5) pts.push([p[0], p[1]])
  const n = pts.length
  if (n < 3) return pts
  const ext: Pt[] = [
    [2 * pts[0][0] - pts[1][0], 2 * pts[0][1] - pts[1][1]],
    ...pts,
    [2 * pts[n - 1][0] - pts[n - 2][0], 2 * pts[n - 1][1] - pts[n - 2][1]],
  ]
  const mix = (a: Pt, b: Pt, ta: number, tb: number, t: number): Pt => {
    const k = (t - ta) / (tb - ta)
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
  }
  const out: Pt[] = []
  for (let i = 1; i < ext.length - 2; i++) {
    const [p0, p1, p2, p3] = [ext[i - 1], ext[i], ext[i + 1], ext[i + 2]]
    const t1 = Math.max(1e-3, Math.sqrt(dist(p0, p1)))
    const t2 = t1 + Math.max(1e-3, Math.sqrt(dist(p1, p2)))
    const t3 = t2 + Math.max(1e-3, Math.sqrt(dist(p2, p3)))
    const per = clamp(Math.ceil(dist(p1, p2) / 12), 1, 24)
    for (let k = 0; k < per; k++) {
      const t = t1 + ((t2 - t1) * k) / per
      const b1 = mix(mix(p0, p1, 0, t1, t), mix(p1, p2, t1, t2, t), 0, t2, t)
      const b2 = mix(mix(p1, p2, t1, t2, t), mix(p2, p3, t2, t3, t), t1, t3, t)
      out.push(mix(b1, b2, t1, t2, t))
    }
  }
  out.push(pts[n - 1])
  return out
}

interface Way { pts: Pt[]; cum: number[]; total: number }

function measure(pts: Pt[]): Way {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + dist(pts[i - 1], pts[i]))
  return { pts, cum, total: cum[cum.length - 1] }
}

/** The point `s` along the way, and which way the way runs there. Before the start and past the end it carries straight on. */
function pointAt(w: Way, s: number): { x: number; y: number; dx: number; dy: number } {
  const { pts, cum } = w
  if (pts.length < 2) return { x: pts[0]?.[0] ?? 400, y: pts[0]?.[1] ?? 300, dx: 1, dy: 0 }
  let i = 0
  if (s >= w.total) i = pts.length - 2
  else if (s > 0) {
    let lo = 0, hi = pts.length - 1
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1
      if (cum[m] <= s) lo = m
      else hi = m
    }
    i = lo
  }
  const a = pts[i], b = pts[i + 1]
  const len = cum[i + 1] - cum[i] || 1
  const dx = (b[0] - a[0]) / len, dy = (b[1] - a[1]) / len
  const k = s - cum[i]
  return { x: a[0] + dx * k, y: a[1] + dy * k, dx, dy }
}

/** How far along the way its nearest point to `p` is, looking only between `lo` and `hi`. */
function nearestOn(w: Way, p: Pt, lo: number, hi: number): number {
  let best = clamp(lo, 0, w.total), bestD = Infinity
  for (let i = 0; i < w.pts.length - 1; i++) {
    const c0 = w.cum[i], c1 = w.cum[i + 1]
    if (c1 < lo || c0 > hi || c1 <= c0) continue
    const a = w.pts[i], b = w.pts[i + 1]
    const len = c1 - c0
    const k = clamp(((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / (len * len), 0, 1)
    const s = clamp(c0 + k * len, lo, hi)
    const q = pointAt(w, s)
    const d = Math.hypot(q.x - p[0], q.y - p[1])
    if (d < bestD) (bestD = d), (best = s)
  }
  return best
}

/** The way as two polylines: the part already walked, and the part still ahead of `s`. */
function split(w: Way, s: number): [string, string] {
  const here = pointAt(w, clamp(s, 0, w.total))
  const h = `${here.x.toFixed(1)},${here.y.toFixed(1)}`
  const behind: string[] = [], ahead: string[] = []
  w.pts.forEach((p, i) => {
    const xy = `${p[0].toFixed(1)},${p[1].toFixed(1)}`
    if (w.cum[i] < s) behind.push(xy)
    else ahead.push(xy)
  })
  return [[...behind, h].join(' '), [h, ...ahead].join(' ')]
}

const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2)
const cap = (w: string) => w[0].toUpperCase() + w.slice(1)

/** A friendly pointing hand, its fingertip at (0, 0). */
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

interface Frame {
  s: number
  moving: boolean
  facing: 1 | -1
  /** Each follower: where it is along the way, and which way it faces. */
  fs: number[]
  ff: (1 | -1)[]
  walking: boolean
}

export default function SteerIt({ title, intro, done, kit, onDone }: {
  title: string; intro: string; done: string; kit: SteerKit; onDone: () => void
}) {
  const alive = useAlive()
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const followers = kit.followers ?? []
  const collect = kit.collect ?? []
  const way = useMemo(() => measure(smooth(kit.path)), [kit])
  // Where along the way each thing to pick up is (its nearest point; always a little before the end).
  const collectAt = useMemo(() => collect.map((c) => Math.min(way.total - 2, nearestOn(way, [c.at[0], c.at[1]], 0, way.total))), [way])
  // How much room there is behind the start, on the board, for the followers to wait in.
  const room = useMemo(() => {
    let r = 0
    while (r < 700) {
      const p = pointAt(way, -(r + 5))
      if (p.x < 18 || p.x > 782 || p.y < 18 || p.y > 432) break
      r += 5
    }
    return r
  }, [way])
  const startFacing: 1 | -1 = pointAt(way, 0).dx < -0.2 ? -1 : 1

  // Everything the game loop changes lives here (a drag costs no re-renders until the hero moves).
  const [g] = useState(() => ({
    s: 0, target: 0, finger: null as Pt | null, drag: null as number | null, downAt: 0, downP: [0, 0] as Pt, downS: 0,
    lastMove: -1e9, lastProgress: 0, lastHint: -1e9, lastWrong: -1e9, lastBack: -1e9, backSince: 0, hintN: 0, idleHints: 0,
    lastCount: -1e9, counted: 0, taken: collect.map(() => false), busy: true, done: false, doneAt: 0,
    facing: startFacing, ff: followers.map(() => startFacing), gaps: followers.map(() => 64), tail: 0, heroBox: null as null | { x: number; y: number; w: number; h: number },
    hint: null as null | { t0: number; from: number; len: number },
  }))
  const [frame, setFrame] = useState<Frame>(() => ({ s: 0, moving: false, facing: startFacing, fs: followers.map((_, i) => -64 * (i + 1)), ff: [...g.ff], walking: false }))
  const [taken, setTaken] = useState<boolean[]>(() => [...g.taken])
  const [busy, setBusy] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [finished, setFinished] = useState(false)
  const [hop, setHop] = useState(0)
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([])
  const heroRef = useRef<SVGGElement>(null)
  const followerRefs = useRef<(SVGGElement | null)[]>([])
  const handRef = useRef<SVGGElement>(null)

  /** The pointing hand slides along the way ahead of the hero (twice), with a short line if there is one. */
  const showHint = (now: number, line?: string) => {
    g.lastHint = now
    g.hint = { t0: now, from: g.s, len: Math.min(230, way.total - g.s) }
    if (line) speak(line)
  }

  /** Where the followers are for the hero at `s`: evenly spaced behind it, bunched up while there's no room yet behind the start. */
  const followersAt = (s: number, now: number) => {
    const off: number[] = []
    g.gaps.forEach((gap, i) => off.push((off[i - 1] ?? 0) + gap))
    const D = off[off.length - 1] || 1
    // (Room for the whole of the last one, not just its middle, so nobody starts half off the board: a
    // big crowd squeezes up a little closer, though never so close that their faces hide.)
    const spread = clamp((s + room - g.tail) / D, 0.55, 1)
    // At the goal the crowd gathers in a little closer: the first keeps its place just behind the hero
    // (any closer and it would hide behind the hero), and the rest close up behind it, still to be seen.
    const gather = g.done ? 1 - 0.25 * (1 - (1 - Math.min(1, (now - g.doneAt) / 1100)) ** 2) : 1
    return off.map((o) => s - (off[0] + (o - off[0]) * gather) * spread)
  }

  /** Faces the way the way runs at `s` (with a little dead zone, so it doesn't flicker on the steep bits). */
  const faceAt = (s: number, was: 1 | -1): 1 | -1 => {
    const dx = (pointAt(way, s + 10).x - pointAt(way, s - 10).x) / 20
    return dx > 0.22 ? 1 : dx < -0.22 ? -1 : was
  }

  // Measure the hero and the followers once, to space the followers by their size and know where the hero is.
  useLayoutEffect(() => {
    const box = (el: SVGGElement | null) => {
      try {
        const b = el?.getBBox()
        return b && b.width > 0 && b.height > 0 ? b : null
      } catch {
        return null
      }
    }
    const hb = box(heroRef.current)
    if (hb) g.heroBox = { x: hb.x, y: hb.y, w: hb.width, h: hb.height }
    // Each one's back (left of its middle, as drawn facing right) and front, so the next one walks
    // just behind it, a little closer than touching, like a crowd.
    const extents = [hb, ...followers.map((_, i) => box(followerRefs.current[i]))].map((b) =>
      b ? { back: clamp(-b.x, 8, 200), front: clamp(b.x + b.width, 8, 200) } : { back: 30, front: 30 })
    g.gaps = followers.map((_, i) => clamp((extents[i].back + extents[i + 1].front) * 0.85, 30, 170))
    g.tail = followers.length ? extents[extents.length - 1].back : 0
    setFrame((f) => ({ ...f, fs: followersAt(0, performance.now()) }))
  }, [])

  // The intro first; then the hand shows how to lead the hero.
  useEffect(() => {
    ;(async () => {
      await speak(intro)
      if (!alive.current) return
      g.busy = false
      setBusy(false)
      const now = performance.now()
      g.lastProgress = now
      showHint(now)
    })()
  }, [])

  const take = (i: number) => {
    g.taken[i] = true
    setTaken([...g.taken])
    const n = ++g.counted
    const [x, y] = collect[i].at
    const id = Math.random()
    setPops((p) => [...p, { id, x, y }])
    setTimeout(() => { if (alive.current) setPops((p) => p.filter((q) => q.id !== id)) }, 900)
    sfx.count(n)
    // (Two things close together: the second number waits for the first instead of cutting it off.)
    const now = performance.now()
    const quick = now - g.lastCount < 800
    g.lastCount = now
    speak(`${cap(numberWords(n))}!`, { interrupt: !quick })
  }

  const finish = async (now: number) => {
    g.done = true
    g.doneAt = now
    g.s = g.target = way.total
    g.drag = null
    g.finger = null
    g.hint = null
    setDragging(false)
    setFinished(true)
    sfx.fanfare()
    await wait(700)
    if (!alive.current) return
    await speak(done)
    if (!alive.current) return
    await wait(600)
    if (alive.current) onDone()
  }

  // The game loop: pull the hero along toward her finger, pick things up, and move the followers and the hand.
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = clamp((now - last) / 1000, 0, 0.05)
      last = now
      if (g.drag !== null && g.finger && !g.done) {
        // The nearest point of the way near the hero, behind it as well as ahead: where the way bends
        // back on itself, a finger sliding backwards is still nearest the part it's on, and pulls nothing.
        const near = nearestOn(way, g.finger, Math.max(0, g.s - BEHIND), Math.min(way.total, g.s + AHEAD))
        if (near > g.target) g.target = near
        // Sliding the wrong way: say which way to go (now and then).
        const back = near < g.s - 60
        if (!back) g.backSince = 0
        else if (!g.backSince) g.backSince = now
        else if (now - g.backSince > 700 && now - g.lastBack > 6000) {
          g.lastBack = now
          g.lastHint = now
          g.hint = { t0: now, from: g.s, len: Math.min(230, way.total - g.s) }
          speak('This way!')
        }
      }
      if (g.target > way.total - 30) g.target = way.total // the last little bit glides in
      const rem = g.target - g.s
      if (rem > 0.01 && !g.done) {
        const step = Math.min(rem, Math.min(SPEED, 40 + rem * 8) * dt)
        g.s = rem - step < 0.05 ? g.target : g.s + step
        g.lastMove = now
        g.lastProgress = now
        g.idleHints = 0
      }
      collectAt.forEach((cs, i) => { if (!g.taken[i] && g.s >= cs) take(i) })
      if (!g.done && g.s >= way.total - 0.5) finish(now)
      // Stuck for a while: the hand shows the way again. (The first three times with a word; after that
      // only now and then, and then the hand alone, in case she has gone off to do something else.)
      if (!g.busy && !g.done && g.drag === null && !g.hint && now - g.lastProgress > IDLE && now - g.lastHint > IDLE) {
        const k = g.idleHints++
        showHint(now, k <= 2 || (k < 7 && k % 2 === 0) ? HINTS[g.hintN++ % HINTS.length] : undefined)
      }
      // The hand.
      const hand = handRef.current
      if (hand) {
        const h = g.hint
        const REP = 2100
        if (!h || g.drag !== null || g.done || now - h.t0 > REP * 2) {
          if (h) g.hint = null
          if (hand.style.opacity !== '0') hand.style.opacity = '0'
        } else {
          const k = ((now - h.t0) % REP) / REP
          const slide = k < 0.14 ? 0 : k < 0.74 ? easeInOut((k - 0.14) / 0.6) : 1
          const p = pointAt(way, h.from + slide * h.len)
          hand.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`)
          hand.style.opacity = (k < 0.1 ? k / 0.1 : k < 0.86 ? 1 : (1 - k) / 0.14).toFixed(2)
          hand.classList.toggle('pressing', k < 0.2)
        }
      }
      // Draw: the hero, and the followers behind it.
      const moving = now - g.lastMove < 140
      if (moving) g.facing = faceAt(g.s, g.facing)
      const fs = followersAt(g.s, now)
      const gathering = g.done && now - g.doneAt < 1100
      if (moving || gathering) fs.forEach((f, i) => { g.ff[i] = faceAt(f, g.ff[i]) })
      const walking = moving || gathering
      setFrame((f) =>
        f.s === g.s && f.moving === moving && f.walking === walking && f.facing === g.facing && !gathering && f.fs.length === fs.length && f.fs.every((v, i) => v === fs[i]) && f.ff.every((v, i) => v === g.ff[i])
          ? f
          : { s: g.s, moving, facing: g.facing, fs, ff: [...g.ff], walking })
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // ---------- Her finger ----------

  const down = (e: RPointerEvent<SVGSVGElement>) => {
    if (g.busy || g.done || g.drag !== null) return
    const p = toBoard(e.currentTarget, e.clientX, e.clientY)
    const h = pointAt(way, g.s)
    const b = g.heroBox
    const onHero = Math.hypot(p[0] - h.x, p[1] - h.y) < GRAB ||
      (b && p[0] > h.x + b.x - 24 && p[0] < h.x + b.x + b.w + 24 && p[1] > h.y + b.y - 24 && p[1] < h.y + b.y + b.h + 24)
    const now = performance.now()
    if (!onHero) {
      // Somewhere else: show where to start (not too often).
      if (now - g.lastWrong > 2500) {
        g.lastWrong = now
        setHop((n) => n + 1)
        showHint(now, 'Start here, and slide along!')
      }
      return
    }
    g.drag = e.pointerId
    g.finger = p
    g.downAt = now
    g.downP = p
    g.downS = g.s
    g.hint = null
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* fine */ }
    setDragging(true)
    sfx.lift()
  }
  const move = (e: RPointerEvent<SVGSVGElement>) => {
    if (g.drag !== e.pointerId) return
    g.finger = toBoard(e.currentTarget, e.clientX, e.clientY)
  }
  const up = (e: RPointerEvent<SVGSVGElement>) => {
    if (g.drag !== e.pointerId) return
    const now = performance.now()
    const tapped = now - g.downAt < 400 && g.finger && dist(g.finger, g.downP) < 12 && g.s === g.downS
    g.drag = null
    g.finger = null
    setDragging(false)
    if (way.total - g.s < 45) g.target = way.total
    // A tap on the hero without sliding: show the sliding.
    if (tapped && now - g.lastHint > 2500 && !g.done) showHint(now, 'Now slide along the glowing path!')
  }

  // ---------- Drawing ----------

  const progress = way.total > 0 ? clamp(frame.s / way.total, 0, 1) : 1
  const pq = Math.round(progress * 400) / 400
  const backdrop = useMemo(() => <kit.Backdrop progress={pq} />, [kit, pq])
  const front = useMemo(() => (kit.Front ? <kit.Front progress={pq} /> : null), [kit, pq])
  const goal = useMemo(() => <kit.Goal />, [kit])
  const things = useMemo(() => collect.map((c, i) => (
    <g key={i} transform={`translate(${c.at[0]} ${c.at[1]})`}><c.Draw taken={taken[i]} /></g>
  )), [kit, taken])
  const hero = useMemo(() => <kit.Hero moving={frame.moving} facing={frame.facing} />, [kit, frame.moving, frame.facing])
  const crowd = useMemo(() => followers.map((F, i) => <F key={i} />), [kit])
  const [walked, ahead] = split(way, frame.s)
  const here = pointAt(way, frame.s)
  const end = way.pts[way.pts.length - 1] ?? [400, 300]
  const wayAttr = useMemo(() => way.pts.map((p) => `${Math.round(p[0])},${Math.round(p[1])}`).join(' '), [way])
  const halo = g.heroBox ? clamp(Math.max(g.heroBox.w, g.heroBox.h) / 2 + 12, 46, 120) : 60

  return (
    <div className="activity game steer-it">
      <div className="practice-head">
        <h2>{title}</h2>
        {/* (not while the intro is said, or over the done line at the end) */}
        <button type="button" className="icon-btn speaker" aria-label="Hear it again" disabled={busy || finished} onClick={() => speak(intro)}>🔊</button>
      </div>
      <Board className="steer-board">
        {backdrop}
        <BoardLayer className={`scene steer-layer ${dragging ? 'dragging' : ''}`} aria-label={title}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up}
          data-way={wayAttr} data-progress={progress.toFixed(3)} data-taken={taken.filter(Boolean).length} data-finished={finished ? 'yes' : 'no'}>
          <defs>
            <radialGradient id={`${uid}glow`}>
              <stop offset="0" stopColor="#fff8c8" stopOpacity={0.95} />
              <stop offset="0.55" stopColor="#fff2a0" stopOpacity={0.45} />
              <stop offset="1" stopColor="#fff2a0" stopOpacity={0} />
            </radialGradient>
          </defs>
          {/* The way: faint where the hero has been, glowing ahead of it. */}
          <polyline points={walked} className="steer-walked" />
          <polyline points={ahead} className="steer-ahead-shadow" />
          <polyline points={ahead} className="steer-ahead-glow" />
          <polyline points={ahead} className="steer-ahead" />
          <polyline points={ahead} className="steer-ahead-dots" />
          {things}
          <circle cx={end[0]} cy={end[1]} r={78} fill={`url(#${uid}glow)`} className={`steer-goal-glow ${finished ? 'won' : ''}`} />
          <g transform={`translate(${end[0]} ${end[1]})`}><g className={finished ? 'steer-cheer' : undefined}>{goal}</g></g>
          {followers.map((_, i) => followers.length - 1 - i).map((i) => {
            const p = pointAt(way, frame.fs[i] ?? -64 * (i + 1))
            return (
              <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
                <g className={finished ? 'steer-cheer' : frame.walking ? 'steer-walk' : 'steer-idle'} style={{ animationDelay: finished ? `${0.1 + i * 0.09}s` : `${-i * 0.13}s` }}>
                  <g transform={frame.ff[i] === -1 ? 'scale(-1 1)' : undefined}>
                    <g ref={(el) => { followerRefs.current[i] = el }}>{crowd[i]}</g>
                  </g>
                </g>
              </g>
            )
          })}
          <g transform={`translate(${here.x.toFixed(1)} ${here.y.toFixed(1)})`}>
            {!busy && !finished && !dragging && <circle r={halo} fill={`url(#${uid}glow)`} className="steer-halo" />}
            <g key={hop} className={finished ? 'steer-cheer' : hop ? 'steer-hop' : undefined}>
              <g ref={heroRef}>{hero}</g>
            </g>
          </g>
          {front}
          {pops.map((p) => (
            <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
              <g className="steer-pop">
                <circle r={22} className="steer-pop-ring" />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
                  <path key={k} d={sparkle(0, -34, k % 2 ? 6 : 9)} transform={`rotate(${k * 45})`} fill={k % 2 ? '#ffffff' : '#ffe066'} />
                ))}
              </g>
            </g>
          ))}
          <g ref={handRef} className="steer-hand" style={{ opacity: 0 }}>
            <circle r={16} className="steer-hand-press" />
            <Hand />
          </g>
        </BoardLayer>
      </Board>
      {finished && <Confetti />}
    </div>
  )
}
