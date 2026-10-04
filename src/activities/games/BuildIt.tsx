// Build it: drag the parts onto their places (Noah's ark, the stable for baby Jesus). See types.ts, BuildKit.
//
// The board shows the kit's backdrop with a faint picture of every part where it goes, and the loose
// parts wait in a tray under the board. A part she picks up grows to its real size and follows her
// finger. Let go near its place (within about half its size) and it snaps in: a thunk, a bounce and its
// name ("The roof!"). Anywhere else, it floats back to the tray. A part that needs others first (`after`)
// looks dimmer in the tray, and tried too early it goes back with a hint ("First the walls!"). Tapping a
// part shows how to drag it (the first time), then flies it in. After eight quiet seconds a hand carries
// the next part to its place. With the last part in, the build does a happy wiggle, the kit's Finished
// picture plays over it, a fanfare, the done line, and on.
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import type { At, BuildKit, BuildPart } from './types'
import { Board, BoardLayer, toBoard } from './Board'
import { sparkle } from '../../art/scenes/kit'
import { Confetti } from '../../components/ui'
import { preload, speak } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import { showDrag } from '../../lib/drag'
import { shuffle, wait } from '../../lib/util'
import { useAlive } from '../../lib/useAlive'
import './BuildIt.css'

/** How long without progress before a hand shows what to do next. */
const IDLE_MS = 8000

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Close enough to snap in: the part's middle within about half its size of its place (never under 60). */
function fits(p: BuildPart, [x, y]: At) {
  const rx = Math.max(60, p.size[0] * 0.55)
  const ry = Math.max(60, p.size[1] * 0.55)
  const dx = (x - p.at[0]) / rx
  const dy = (y - p.at[1]) / ry
  return dx * dx + dy * dy <= 1
}

/**
 * What has to be in place before each part. Ids that aren't parts are left out, and so is any loop of
 * parts waiting for each other: a slip in a kit never leaves a part that can't go in.
 */
function prerequisites(parts: BuildPart[]) {
  const ids = new Set(parts.map((p) => p.id))
  const deps = new Map(parts.map((p) => [p.id, (p.after ?? []).filter((a) => ids.has(a) && a !== p.id)]))
  const can = new Set<string>()
  for (let more = true; more; ) {
    more = false
    for (const p of parts) {
      if (!can.has(p.id) && deps.get(p.id)!.every((a) => can.has(a))) {
        can.add(p.id)
        more = true
      }
    }
  }
  for (const p of parts) if (!can.has(p.id)) deps.set(p.id, [])
  return deps
}

/** In the tray, a part is drawn to fit its slot, but never more than this many times its size on the board. */
const TRAY_ZOOM = 1.5

/** The part in the air (being carried, flying in, or floating home), drawn above everything at the board's scale. */
interface Carry {
  id: string
  /** Screen pixels per board unit. */
  k: number
  /** Where its middle starts, on screen. */
  x: number
  y: number
  /** Its size in the tray, as a share of its real size: it grows from that. */
  s0: number
}

/** A finger (or mouse button) down on a part in the tray. */
interface Hold {
  p: BuildPart
  slot: HTMLElement
  pointer: number
  sx: number
  sy: number
  t0: number
  /** The slot's middle when it was pressed: the part keeps the same offset from the finger. */
  cx: number
  cy: number
  moved: boolean
  /** The part's middle now, on screen. */
  x: number
  y: number
}

export default function BuildIt({ title, intro, done, kit, onDone }: {
  title: string; intro: string; done: string; kit: BuildKit; onDone: () => void
}) {
  const { parts } = kit
  const deps = useMemo(() => prerequisites(parts), [parts])
  // The tray's order, shuffled once (by id, so a kit redrawn while the game is open keeps its order).
  const ids = parts.map((p) => p.id).join(' ')
  const order = useMemo(() => shuffle(parts.map((p) => p.id)), [ids])
  const tray = order.map((id) => parts.find((p) => p.id === id)).filter((p): p is BuildPart => !!p)
  // (The same element every render, so the backdrop isn't redrawn while a part moves.)
  const backdrop = useMemo(() => <kit.Backdrop />, [kit])
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const alive = useAlive()

  const [placed, setPlaced] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  const [carry, setCarryState] = useState<Carry | null>(null)
  const [over, setOver] = useState(false) // the carried part is over its place
  const [glow, setGlow] = useState<string | null>(null) // a place lit up, as a hint
  const [nudge, setNudge] = useState<string | null>(null) // a part in the tray lit up: this one first
  const [landed, setLanded] = useState<Record<string, At>>({}) // where each part was let go, from its place
  const [finished, setFinished] = useState(false)
  const [poke, setPoke] = useState(0) // bumped by every move: the wait for a hint starts again

  const placedRef = useRef<string[]>([])
  const busy = useRef(true) // the intro, or the finish: hands off
  const carryRef = useRef<Carry | null>(null)
  const hold = useRef<Hold | null>(null)
  const overRef = useRef(false)
  const tapHinted = useRef(false)
  const hints = useRef(0) // hints in a row, without a part going in
  const misses = useRef({ id: '', n: 0 })
  const tokens = useRef({ glow: 0, nudge: 0 })
  const timers = useRef<number[]>([])
  const layer = useRef<SVGSVGElement>(null)
  const floatEl = useRef<HTMLDivElement>(null)
  const floatPart = useRef<HTMLDivElement>(null)
  const onShown = useRef<(() => void) | null>(null) // a flight waits for its part to be on screen
  const slots = useRef(new Map<string, HTMLElement>())
  const places = useRef(new Map<string, SVGRectElement>())

  const setCarry = (c: Carry | null) => {
    carryRef.current = c
    setCarryState(c)
  }
  const byId = (id: string) => parts.find((p) => p.id === id)!
  const isIn = (id: string) => placedRef.current.includes(id)
  const missing = (p: BuildPart) => deps.get(p.id)!.filter((a) => !isIn(a))
  /** The next part that can go in, in building order. */
  const nextPart = () => parts.find((p) => !isIn(p.id) && !missing(p).length)
  /** The first of what `p` is waiting for that can go in now. */
  const firstOf = (p: BuildPart): BuildPart => {
    const m = missing(p)
    return m.length ? firstOf(byId(m[0])) : p
  }
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(() => alive.current && fn(), ms)) }
  const bump = () => setPoke((n) => n + 1)
  /** Lights up a part's place for a while. */
  const flash = (id: string, ms = 2600) => {
    const t = ++tokens.current.glow
    setGlow(id)
    later(() => tokens.current.glow === t && setGlow(null), ms)
  }
  /** Lights up a part in the tray for a while. */
  const point = (id: string, ms = 2600) => {
    const t = ++tokens.current.nudge
    setNudge(id)
    later(() => tokens.current.nudge === t && setNudge(null), ms)
  }
  /** Where a board point is on screen, and how many pixels a board unit is there. */
  const onScreen = ([x, y]: At) => {
    const m = layer.current?.getScreenCTM()
    return m ? { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f, k: m.a } : null
  }
  /** A part's size in the tray, as a share of its size on the board. */
  const trayScale = (p: BuildPart, slot: HTMLElement, k: number) => {
    const r = slot.querySelector('svg')?.getBoundingClientRect()
    return r && r.width > 0 && k > 0 ? Math.min(r.width / p.size[0], r.height / p.size[1]) / k : 0.5
  }

  // The tray needs the board's scale (--k: pixels per board unit), so a small part isn't blown up.
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const board = root.current?.querySelector<HTMLElement>('.game-board')
    if (!board) return
    const fit = () => {
      const k = Math.min(board.clientWidth / 800, board.clientHeight / 450)
      if (k > 0) root.current?.style.setProperty('--k', `${k}px`)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(board)
    return () => ro.disconnect()
  }, [])

  const started = useRef(false)
  useEffect(() => {
    // (Once: a hot reload while developing re-runs effects, and the game mustn't start over.)
    if (started.current) return
    started.current = true
    ;(async () => {
      await speak(intro)
      if (!alive.current) return
      if (!parts.length) return void finish(null) // (a kit with nothing to build: straight to the end)
      busy.current = false
      setReady(true)
      const firsts = parts.filter((p) => parts.some((q) => deps.get(q.id)!.includes(p.id))) // (what "First the boat!" can name)
      preload([...parts.map((p) => `${cap(p.say)}!`), ...parts.map((p) => `Drag ${p.say} here!`), ...firsts.map((p) => `First ${p.say}!`), done])
    })()
  }, [])
  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    stopListening()
  }, [])

  // After a quiet while, show what to do next (or, holding a part, where it goes).
  useEffect(() => {
    if (!ready || finished) return
    const t = window.setTimeout(() => {
      if (!busy.current) {
        const h = hold.current
        if (h?.moved) {
          if (!missing(h.p).length) flash(h.p.id)
        } else if (!h && !carryRef.current) showNext()
      }
      bump()
    }, IDLE_MS)
    return () => clearTimeout(t)
  }, [poke, ready, finished])

  const showNext = () => {
    const p = nextPart()
    if (!p) return
    flash(p.id, 3000)
    // (The first three hints in a row are said; after that only now and then, and then the hand alone,
    // in case she has gone off to do something else.)
    const k = hints.current++
    if (k <= 2 || (k < 7 && k % 2 === 0)) speak(`Drag ${p.say} here!`)
    const from = slots.current.get(p.id)
    const to = places.current.get(p.id)
    if (from && to) showDrag(from, to)
  }

  // ---------- picking up, carrying, letting go ----------

  const handlers = useRef({ move: (_e: PointerEvent) => {}, up: (_e: PointerEvent) => {} })
  const listen = useMemo(() => ({
    move: (e: PointerEvent) => handlers.current.move(e),
    up: (e: PointerEvent) => handlers.current.up(e),
  }), [])
  function stopListening() {
    window.removeEventListener('pointermove', listen.move)
    window.removeEventListener('pointerup', listen.up)
    window.removeEventListener('pointercancel', listen.up)
  }

  const down = (p: BuildPart, e: ReactPointerEvent<HTMLElement>) => {
    if (busy.current || carryRef.current || hold.current) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    bump()
    const slot = e.currentTarget
    const r = slot.getBoundingClientRect()
    hold.current = {
      p, slot, pointer: e.pointerId, sx: e.clientX, sy: e.clientY, t0: performance.now(),
      cx: r.left + r.width / 2, cy: r.top + r.height / 2, moved: false, x: 0, y: 0,
    }
    window.addEventListener('pointermove', listen.move, { passive: false })
    window.addEventListener('pointerup', listen.up)
    window.addEventListener('pointercancel', listen.up)
  }

  const onMove = (ev: PointerEvent) => {
    const h = hold.current
    if (!h || ev.pointerId !== h.pointer) return
    const dx = ev.clientX - h.sx
    const dy = ev.clientY - h.sy
    if (!h.moved) {
      if (Math.hypot(dx, dy) < 8) return
      h.moved = true
      const k = onScreen(h.p.at)?.k ?? 1
      setCarry({ id: h.p.id, k, x: h.cx, y: h.cy, s0: trayScale(h.p, h.slot, k) })
      sfx.lift()
    }
    h.x = h.cx + dx
    h.y = h.cy + dy
    if (floatEl.current) floatEl.current.style.transform = `translate(${h.x}px, ${h.y}px)`
    const b = layer.current ? toBoard(layer.current, h.x, h.y) : null
    // (A part that has to wait for another doesn't light up its place: it won't go in yet.)
    const on = !!b && fits(h.p, b) && !missing(h.p).length
    if (on !== overRef.current) {
      overRef.current = on
      setOver(on)
    }
    ev.preventDefault()
  }

  const onUp = (ev: PointerEvent) => {
    const h = hold.current
    if (!h || ev.pointerId !== h.pointer) return
    hold.current = null
    stopListening()
    if (!h.moved) {
      if (ev.type === 'pointerup' && performance.now() - h.t0 < 700) tap(h.p, h.slot)
      return
    }
    overRef.current = false
    setOver(false)
    const b = layer.current ? toBoard(layer.current, h.x, h.y) : null
    if (ev.type === 'pointerup' && b && fits(h.p, b)) {
      if (!missing(h.p).length) return put(h.p, b)
      goHome(h)
      return tooSoon(h.p)
    }
    goHome(h)
    if (ev.type === 'pointerup') missed(h.p)
  }
  handlers.current = { move: onMove, up: onUp }

  // The part in the air is placed by hand (not by React), so re-renders never move it.
  useLayoutEffect(() => {
    const f = floatEl.current
    const part = floatPart.current
    if (!carry || !f || !part) return
    const h = hold.current
    const [x, y] = h?.moved && h.p.id === carry.id ? [h.x, h.y] : [carry.x, carry.y]
    f.style.transform = `translate(${x}px, ${y}px)`
    part.style.transform = `scale(${carry.s0})`
    if (onShown.current) {
      onShown.current() // a flight takes it from here
      onShown.current = null
    } else {
      part.animate([{ transform: `scale(${carry.s0})` }, { transform: 'scale(1.05)' }], { duration: 180, easing: 'ease-out', fill: 'forwards' })
    }
  }, [carry])

  /** Back to the tray, shrinking as it goes. */
  const goHome = async (h: Hold) => {
    const f = floatEl.current
    const part = floatPart.current
    const c = carryRef.current
    const r = h.slot.getBoundingClientRect()
    if (f && part && c && r.width) {
      const home = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      const a = f.animate([{ transform: `translate(${h.x}px, ${h.y}px)` }, { transform: `translate(${home.x}px, ${home.y}px)` }], { duration: 380, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' })
      part.animate([{ transform: 'scale(1.05)' }, { transform: `scale(${c.s0})` }], { duration: 380, easing: 'ease-in-out', fill: 'forwards' })
      await a.finished.catch(() => {})
    }
    if (alive.current) setCarry(null)
  }

  /** A tap: the first time, how to drag it; after that, it flies in by itself. */
  const tap = (p: BuildPart, slot: HTMLElement) => {
    if (busy.current) return
    if (missing(p).length) return tooSoon(p)
    if (!tapHinted.current) {
      tapHinted.current = true
      flash(p.id, 3000)
      speak(`Drag ${p.say} here!`)
      const to = places.current.get(p.id)
      if (to) showDrag(slot, to)
      return
    }
    flyIn(p, slot)
  }

  const flyIn = async (p: BuildPart, slot: HTMLElement) => {
    const to = onScreen(p.at)
    const r = slot.getBoundingClientRect()
    if (!to || !r.width) return
    const from = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    const s0 = trayScale(p, slot, to.k)
    const shown = new Promise<void>((res) => (onShown.current = res))
    setCarry({ id: p.id, k: to.k, x: from.x, y: from.y, s0 })
    await shown
    const f = floatEl.current
    const part = floatPart.current
    if (!alive.current || !f || !part) return
    sfx.lift()
    // Up and over in an arc, growing to its real size on the way.
    const frames: Keyframe[] = []
    for (let i = 0; i <= 16; i++) {
      const t = i / 16
      frames.push({ transform: `translate(${from.x + (to.x - from.x) * t}px, ${from.y + (to.y - from.y) * t - 120 * 4 * t * (1 - t)}px)` })
    }
    const a = f.animate(frames, { duration: 700, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' })
    part.animate([{ transform: `scale(${s0})` }, { transform: 'scale(1.1)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 700, easing: 'ease-in-out', fill: 'forwards' })
    await a.finished.catch(() => {})
    if (alive.current) put(p, p.at)
  }

  /** In it goes, with a thunk and its name. */
  const put = (p: BuildPart, b: At) => {
    setCarry(null)
    if (isIn(p.id) || busy.current) return // (never twice, and never after the end: nothing counts again)
    placedRef.current = [...placedRef.current, p.id]
    setPlaced(placedRef.current)
    setLanded((l) => ({ ...l, [p.id]: [b[0] - p.at[0], b[1] - p.at[1]] }))
    tokens.current.glow++
    setGlow(null)
    misses.current = { id: '', n: 0 }
    hints.current = 0
    sfx.plop()
    sfx.count(placedRef.current.length)
    bump()
    if (placedRef.current.length >= parts.length) return void finish(p)
    speak(`${cap(p.say)}!`)
  }

  /**
   * Dropped on its place before what it goes on: name the part that can go in now, and light that same
   * part up. (With a chain, the roof on the house on the boat, that's the boat; then the house, one at a time.)
   */
  const tooSoon = (p: BuildPart) => {
    const first = firstOf(p)
    speak(`First ${first.say}!`)
    point(first.id)
  }

  /** Dropped somewhere else: its place lights up; dropped wrong twice running, the narrator helps too. */
  const missed = (p: BuildPart) => {
    const m = misses.current
    m.n = m.id === p.id ? m.n + 1 : 1
    m.id = p.id
    if (missing(p).length) {
      if (m.n >= 2) tooSoon(p)
      return
    }
    flash(p.id, 2200)
    if (m.n >= 2) speak(`Here is the spot for ${p.say}!`)
  }

  const finish = async (p: BuildPart | null) => {
    busy.current = true
    if (p) await speak(`${cap(p.say)}!`)
    if (!alive.current) return
    setFinished(true)
    sfx.fanfare()
    await wait(1300)
    if (!alive.current) return
    await speak(done)
    if (!alive.current) return
    await wait(700)
    if (alive.current) onDone()
  }

  // ---------- drawing ----------

  const placedSet = new Set(placed)
  const waiting = (p: BuildPart) => deps.get(p.id)!.some((a) => !placedSet.has(a))
  const lastIn = placed.length ? byId(placed[placed.length - 1]) : null
  const carried = carry ? byId(carry.id) : null
  const cols = parts.length <= 4 ? parts.length : Math.ceil(parts.length / 2)

  return (
    <div ref={root} className={`activity game build-it ${finished ? 'finished' : ''}`} data-ready={ready && !finished ? 'yes' : 'no'}>
      <div className="practice-head">
        <h2>{title}</h2>
        <button type="button" className="build-again" aria-label="Hear it again" disabled={!ready || finished} onClick={() => speak(intro)}>🔊</button>
      </div>
      <Board className="build-board">
        {backdrop}
        <BoardLayer ref={layer}>
          <defs>
            {/* A lit-up place: a soft golden halo around the part's ghost. */}
            <filter id={`${uid}-hot`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
              <feMorphology in="SourceAlpha" operator="dilate" radius={5} result="fat" />
              <feGaussianBlur in="fat" stdDeviation={7} result="soft" />
              <feFlood floodColor="#ffe14d" />
              <feComposite in2="soft" operator="in" result="halo" />
              <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .62 0" result="faint" />
              <feMerge><feMergeNode in="halo" /><feMergeNode in="halo" /><feMergeNode in="faint" /></feMerge>
            </filter>
          </defs>
          {/* The parts that are in, in building order (so they always stack the same way). */}
          <g className="build-made">
            {parts.filter((p) => placedSet.has(p.id)).map((p) => {
              const [dx, dy] = landed[p.id] ?? [0, 0]
              return (
                <g key={p.id} transform={`translate(${p.at[0]} ${p.at[1]})`}>
                  <g className="build-snap" style={{ '--dx': `${dx}px`, '--dy': `${dy}px` } as CSSProperties}><p.Draw /></g>
                </g>
              )
            })}
          </g>
          {/* Every place still waiting for its part: the part's own drawing, ghosted. */}
          {parts.filter((p) => !placedSet.has(p.id)).map((p) => {
            const hot = glow === p.id || (over && carry?.id === p.id)
            return (
              <g key={p.id} transform={`translate(${p.at[0]} ${p.at[1]})`}>
                <g className={`build-ghost ${hot ? 'hot' : ''}`} filter={hot ? `url(#${uid}-hot)` : undefined}><p.Draw /></g>
                <rect ref={(el) => { if (el) places.current.set(p.id, el); else places.current.delete(p.id) }} data-place={p.id}
                  x={-p.size[0] / 2} y={-p.size[1] / 2} width={p.size[0]} height={p.size[1]} fill="none" pointerEvents="none" />
              </g>
            )
          })}
          {lastIn && (
            <g key={`sparks-${lastIn.id}`} transform={`translate(${lastIn.at[0]} ${lastIn.at[1]})`} pointerEvents="none">
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2 + 0.3
                const r = Math.max(lastIn.size[0], lastIn.size[1]) / 2 + 26
                return (
                  <g key={i} className="build-spark" style={{ '--tx': `${Math.cos(a) * r}px`, '--ty': `${Math.sin(a) * r * 0.8}px`, animationDelay: `${(i % 3) * 50}ms` } as CSSProperties}>
                    <path d={sparkle(0, 0, i % 2 ? 9 : 13)} fill="#fff6a8" stroke="#ffc928" strokeWidth={1.5} strokeLinejoin="round" />
                  </g>
                )
              })}
            </g>
          )}
          {finished && kit.Finished && <g className="build-finished"><kit.Finished /></g>}
        </BoardLayer>
      </Board>
      <div className={`build-tray ${ready ? 'ready' : ''}`} style={{ '--cols': cols } as CSSProperties}>
        {tray.map((p, i) => {
          const isPlaced = placedSet.has(p.id)
          const [w, h] = p.size
          return (
            <button key={p.id} type="button" aria-label={p.say} data-part={p.id} data-free={!isPlaced && !waiting(p) ? 'yes' : 'no'}
              ref={(el) => { if (el) slots.current.set(p.id, el); else slots.current.delete(p.id) }}
              className={`build-slot ${isPlaced ? 'in' : ''} ${carry?.id === p.id ? 'out' : ''} ${waiting(p) ? 'later' : ''} ${nudge === p.id ? 'nudge' : ''}`}
              style={{ '--i': i } as CSSProperties} onPointerDown={(e) => down(p, e)}>
              <svg viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`} className="pa-anim" aria-hidden
                style={{ maxWidth: `calc(var(--k, 1px) * ${w * TRAY_ZOOM})`, maxHeight: `calc(var(--k, 1px) * ${h * TRAY_ZOOM})` }}>
                <p.Draw />
              </svg>
            </button>
          )
        })}
      </div>
      {carry && carried && createPortal(
        <div className={`build-float ${over ? 'over' : ''}`} ref={floatEl}>
          <div className="build-float-part" ref={floatPart} style={{
            width: carried.size[0] * carry.k, height: carried.size[1] * carry.k,
            marginLeft: (-carried.size[0] * carry.k) / 2, marginTop: (-carried.size[1] * carry.k) / 2,
          }}>
            <svg viewBox={`${-carried.size[0] / 2} ${-carried.size[1] / 2} ${carried.size[0]} ${carried.size[1]}`} className="pa-anim" aria-hidden><carried.Draw /></svg>
          </div>
        </div>,
        document.body,
      )}
      {finished && <Confetti />}
    </div>
  )
}
