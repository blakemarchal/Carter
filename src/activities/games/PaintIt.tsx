// Paint it: color by number (Joseph's coat of many colors). See types.ts, PaintKit.
//
// The kit's Picture has its paintable regions, white until they're painted, and each unpainted region
// shows its number. Beside the picture (below it when the screen stands up) are the paint pots, one per
// number, each in its color with its number on it. Tap a pot to pick it ("Number one, red!"): it lifts,
// with a brush in it. Then tap a region with the same number (or brush a finger across the picture, or
// drag a blob of paint from the pot onto it) and the paint spreads through it from the finger. A
// region with another number wiggles its number and the right pot glows ("That one has a three. Find
// the paint with a three!"); with no pot picked yet, it says which pot to pick. After about eight
// seconds without painting, the pot for an unpainted region glows, then that region pulses. When every
// region is painted, the picture shimmers: fanfare, confetti, the `done` line, then onDone.
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type RefObject } from 'react'
import type { At, PaintKit } from './types'
import { Board, BoardLayer, toBoard } from './Board'
import { Confetti } from '../../components/ui'
import { darken, ink, lighten } from '../../art/kit'
import { sparkle } from '../../art/scenes/kit'
import { isSpeaking, preload, speak } from '../../lib/speech'
import { numberWords } from '../../lib/spoken'
import { sfx } from '../../lib/sfx'
import { wait } from '../../lib/util'
import { useAlive } from '../../lib/useAlive'
import './PaintIt.css'

/** How long without painting before a hint, and between hints. */
const HINT_MS = 8000
/** How long the paint takes to spread through a region: quick in a small one, a little longer in a big one. */
const spreadMs = (r: number) => clamp(320 + r * 0.6, 380, 820)

type Pot = PaintKit['palette'][number]
type Region = PaintKit['regions'][number]
type Spread = { id: string; key: number; gid: string; color: string; cx: number; cy: number; r: number }
type Drop = { key: number; at: At; color: string }

/** "a two", "an eight" */
const aNum = (n: number) => `${/^(eight|eleven|eighteen)/.test(numberWords(n)) ? 'an' : 'a'} ${numberWords(n)}`
/** "ones", "twos", "sixes" */
const nums = (n: number) => { const w = numberWords(n); return /[xs]$/.test(w) ? `${w}es` : `${w}s` }
const potLine = (p: Pot) => `Number ${numberWords(p.n)}, ${p.name}!`
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const HEX = /^#[0-9a-f]{6}$/i
/** A shade of a paint's color (only for #rrggbb colors; anything else gets `or`). */
const tint = (c: string, f: (hex: string) => string, or: string) => (HEX.test(c) ? f(c) : or)
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Every shape in the picture that belongs to region `id`. */
function shapesOf(root: Element | null, id: string): SVGGraphicsElement[] {
  return root ? ([...root.querySelectorAll(`[data-region="${CSS.escape(id)}"]`)] as SVGGraphicsElement[]) : []
}

/** Copies of region `id`'s shapes, placed to draw in `svg` (another layer of the board) right over the originals. */
function copiesOf(root: Element | null, id: string, svg: SVGSVGElement | null): SVGElement[] {
  const back = svg?.getScreenCTM()?.inverse()
  if (!back) return []
  return shapesOf(root, id).flatMap((el) => {
    const m = el.getScreenCTM()
    if (!m) return []
    const c = el.cloneNode(true) as SVGElement
    for (const a of ['data-region', 'id', 'class', 'style', 'filter', 'mask', 'clip-path', 'opacity']) c.removeAttribute(a)
    const t = back.multiply(m)
    c.setAttribute('transform', `matrix(${t.a} ${t.b} ${t.c} ${t.d} ${t.e} ${t.f})`)
    return [c]
  })
}

export default function PaintIt({ title, intro, done, kit, onDone }: {
  title: string; intro: string; done: string; kit: PaintKit; onDone: () => void
}) {
  const { Picture, regions, palette } = kit
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const potFor = (n: number) => palette.find((p) => p.n === n)
  const numOf = (id: string) => regions.find((r) => r.id === id)?.n ?? 0
  const root = useRef<HTMLDivElement>(null)
  const layer = useRef<SVGSVGElement>(null)
  const [fills, setFills] = useState<Record<string, string>>({})
  const [spreads, setSpreads] = useState<Spread[]>([])
  // Painted, or being painted now.
  const painted = useRef(new Set<string>())
  // The regions to paint: the ones drawn in the picture, with a paint for their number.
  const [todo, setTodo] = useState<string[]>(() => [...new Set(regions.filter((r) => potFor(r.n)).map((r) => r.id))])
  const todoRef = useRef(todo)
  // Each number's size, to fit inside its region (board units).
  const [sizes, setSizes] = useState<Record<string, number>>({})
  const [picked, setPicked] = useState<number | null>(null)
  const pickedRef = useRef<number | null>(null)
  const [glow, setGlow] = useState<{ n: number; key: number } | null>(null)
  const [pulse, setPulse] = useState<{ id: string; key: number } | null>(null)
  const [wiggle, setWiggle] = useState<{ id: string; key: number } | null>(null)
  const [drops, setDrops] = useState<Drop[]>([])
  const [ready, setReady] = useState(false)
  const [cheer, setCheer] = useState(false)
  // Paint waits while the intro is said, and stops at the end.
  const busy = useRef(true)
  const finishing = useRef(false)
  const alive = useAlive()
  const keys = useRef(0)
  const lastGo = useRef(0) // the last paint, pot pick or hint
  const hints = useRef(0) // hints in a row, without painting
  // A finger (or the mouse) painting: the region it's over, the regions it painted, and, when it
  // started on a pot, that pot's color (carried as a blob) and where it started.
  const stroke = useRef<{ id: number; last: Element | null; done: Set<Element>; pot?: string; from?: [number, number] } | null>(null)
  const blob = useRef<HTMLDivElement>(null)

  // Which regions are really in the picture, and how big each number can be.
  useLayoutEffect(() => {
    const k = (layer.current?.getBoundingClientRect().width ?? 0) / 800
    const ok: string[] = []
    const sz: Record<string, number> = {}
    for (const r of regions) {
      const shapes = shapesOf(root.current, r.id)
      if (!shapes.length || !potFor(r.n)) {
        console.warn(`Paint it: region ${r.id} (${r.n}) ${shapes.length ? 'has no paint with its number' : 'is not in the picture'}`)
        continue
      }
      if (!ok.includes(r.id)) ok.push(r.id)
      if (k > 0) {
        const b = shapes[0].getBoundingClientRect()
        sz[r.id] = clamp(Math.min((b.width / k) * 0.62, (b.height / k) * 0.62), 17, 34)
      }
    }
    todoRef.current = ok
    setTodo(ok)
    setSizes(sz)
  }, [])

  useEffect(() => {
    ;(async () => {
      await speak(intro)
      if (!alive.current) return
      busy.current = false
      lastGo.current = Date.now()
      setReady(true)
      if (!todoRef.current.length) finish()
    })()
    // Fetch the lines now, so each one answers right away.
    const ns = [...new Set(regions.map((r) => r.n))]
    preload([
      ...palette.map(potLine),
      ...ns.flatMap((n) => [
      `That one has ${aNum(n)}. Find the paint with ${aNum(n)}!`, `That one has ${aNum(n)}. Tap the paint with ${aNum(n)}!`,
      `Find the paint with ${aNum(n)}!`, `Find ${aNum(n)}, and paint it ${potFor(n)?.name}!`,
    ]),
      ...palette.flatMap((p) => [`All the ${nums(p.n)} are ${p.name}!`, `${cap(p.name)}!`]),
      done,
    ])
  }, [])

  const finish = async () => {
    if (finishing.current) return
    finishing.current = true
    busy.current = true
    setGlow(null)
    setPulse(null)
    setCheer(true)
    sfx.fanfare()
    await Promise.all([speak(done), wait(2400)])
    if (!alive.current) return
    await wait(600)
    if (alive.current) onDone()
  }

  /** A pot glows for a while, to show which paint. */
  const showPot = (n: number, ms: number) => {
    const key = ++keys.current
    setGlow({ n, key })
    setTimeout(() => { if (alive.current) setGlow((g) => (g?.key === key ? null : g)) }, ms)
  }

  const pick = (n: number) => {
    const pot = potFor(n)
    if (busy.current || !pot) return
    sfx.pop()
    pickedRef.current = n
    setPicked(n)
    setGlow((g) => (g?.n === n ? null : g))
    lastGo.current = Date.now()
    speak(potLine(pot))
  }

  /** Not this one (yet): its number wiggles, the right pot glows, and she hears which paint it needs. */
  const nudge = (r: Region, nothingPicked: boolean) => {
    if (nothingPicked) sfx.pop()
    else sfx.oops()
    lastGo.current = Date.now() // (this is a hint too: the next one waits)
    setWiggle({ id: r.id, key: ++keys.current })
    showPot(r.n, 2800)
    speak(`That one has ${aNum(r.n)}. ${nothingPicked ? 'Tap' : 'Find'} the paint with ${aNum(r.n)}!`)
  }

  /** The region is painted for good: its color goes on, and once every region has one, the celebration. */
  const settle = (id: string, color: string) => {
    if (!alive.current) return
    setFills((f) => ({ ...f, [id]: color }))
    setSpreads((list) => list.filter((s) => s.id !== id))
    if (todoRef.current.every((r) => painted.current.has(r))) finish()
  }

  /** Paint spreads through region `id` from the finger (x, y on screen): a growing circle of color, in the region's own units. */
  const spread = (id: string, color: string, x: number, y: number) => {
    const shapes = shapesOf(root.current, id)
    const m = shapes[0]?.getScreenCTM()
    if (!m || reducedMotion()) return settle(id, color)
    const back = m.inverse()
    const c = new DOMPoint(x, y).matrixTransform(back)
    let far = 0
    for (const s of shapes) {
      const sm = s.getScreenCTM()
      if (!sm) continue
      let b: DOMRect
      try { b = s.getBBox() } catch { continue }
      for (const [bx, by] of [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]) {
        const q = new DOMPoint(bx, by).matrixTransform(sm).matrixTransform(back)
        far = Math.max(far, Math.hypot(q.x - c.x, q.y - c.y))
      }
    }
    const key = ++keys.current
    setSpreads((list) => [...list.filter((s) => s.id !== id), { id, key, gid: `${uid}paint${key}`, color, cx: c.x, cy: c.y, r: far * 1.18 + 4 }])
  }

  /**
   * The brush touches region `el` at (x, y) on screen: it paints if the picked paint has its number.
   * A tap (not a brush passing over) also answers when it can't: which paint it needs. True if it painted.
   */
  const paint = (el: Element, x: number, y: number, tapped: boolean): boolean => {
    const id = el.getAttribute('data-region')
    const r = regions.find((q) => q.id === id)
    if (!r || !todoRef.current.includes(r.id)) return false
    const at = layer.current ? toBoard(layer.current, x, y) : r.at
    if (painted.current.has(r.id)) {
      // Painted already: a little sparkle of its own color.
      if (tapped) { sfx.pop(); splash(at, fills[r.id] ?? '#fff6b0') }
      return false
    }
    if (pickedRef.current !== r.n) {
      if (tapped) nudge(r, pickedRef.current === null)
      return false
    }
    const pot = potFor(r.n)!
    painted.current.add(r.id)
    lastGo.current = Date.now()
    hints.current = 0
    setPulse((p) => (p?.id === r.id ? null : p))
    spread(r.id, pot.color, x, y)
    splash(at, pot.color)
    sfx.plop()
    sfx.count(painted.current.size)
    const left = todoRef.current.filter((q) => !painted.current.has(q))
    // (The last one: the celebration starts once its paint has spread.)
    if (!left.length) { busy.current = true; return true }
    // That was the last one with this number: "All the ones are red!" (or just "Red!" if it was the only one).
    if (!left.some((q) => numOf(q) === r.n)) speak(todoRef.current.filter((q) => numOf(q) === r.n).length > 1 ? `All the ${nums(r.n)} are ${pot.name}!` : `${cap(pot.name)}!`)
    return true
  }

  const splash = (at: At, color: string) => {
    const key = ++keys.current
    setDrops((d) => [...d, { key, at, color }])
    setTimeout(() => { if (alive.current) setDrops((d) => d.filter((x) => x.key !== key)) }, 700)
  }

  // After a while without painting: the pot for an unpainted region glows, then that region pulses.
  const showHint = () => {
    const left = todoRef.current.filter((q) => !painted.current.has(q))
    if (!left.length) return
    const p = pickedRef.current
    const mine = left.filter((q) => numOf(q) === p)
    const pool = mine.length ? mine : left
    const id = pool[Math.floor(Math.random() * pool.length)]
    const n = numOf(id)
    const pot = potFor(n)!
    lastGo.current = Date.now()
    showPot(n, 3400)
    // (The first three hints in a row are said; after that only now and then, and then the glow
    // alone, in case she has gone off to do something else.)
    const k = hints.current++
    if (k <= 2 || (k < 7 && k % 2 === 0)) speak(p === n ? `Find ${aNum(n)}, and paint it ${pot.name}!` : `Find the paint with ${aNum(n)}!`)
    const key = ++keys.current
    setTimeout(() => {
      if (!alive.current || busy.current || painted.current.has(id)) return
      setPulse({ id, key })
      setTimeout(() => { if (alive.current) setPulse((q) => (q?.key === key ? null : q)) }, 3800)
    }, p === n ? 500 : 1500)
  }
  const tick = useRef(() => {})
  tick.current = () => {
    if (busy.current || stroke.current || isSpeaking()) return
    if (Date.now() - lastGo.current >= HINT_MS) showHint()
  }
  useEffect(() => {
    const t = setInterval(() => tick.current(), 500)
    return () => clearInterval(t)
  }, [])

  // Taps and strokes on the picture. A tap goes through anything drawn over a region (a belt, a
  // seam) to the region underneath, and a near miss just outside the lines still counts.
  const regionAt = (x: number, y: number) => {
    for (const el of document.elementsFromPoint(x, y)) {
      const r = el.closest('[data-region]')
      if (r && root.current?.contains(r)) return r
    }
    return null
  }
  const regionNear = (x: number, y: number) => {
    for (const d of [10, 20, 30]) for (let i = 0; i < 8; i++) {
      const r = regionAt(x + d * Math.cos((i * Math.PI) / 4), y + d * Math.sin((i * Math.PI) / 4))
      if (r) return r
    }
    return null
  }
  // A finger down on a pot picks it at once, and can carry a blob of its paint onto the picture:
  // every region with its number that the finger passes over gets painted.
  const showBlob = (x: number, y: number, color?: string) => {
    const b = blob.current
    if (!b) return
    if (color) b.style.setProperty('--blob', color)
    b.style.transform = `translate(${x}px, ${y}px)`
    b.style.display = 'block'
  }
  const hideBlob = () => { if (blob.current) blob.current.style.display = 'none' }
  const down = (e: RPointerEvent<HTMLDivElement>) => {
    if ((e.pointerType === 'mouse' && e.button !== 0) || busy.current) return
    const t = e.target as Element
    const pot = t.closest?.('.paint-pot') as HTMLElement | null
    if (pot) {
      const n = Number(pot.dataset.n)
      pick(n)
      stroke.current = { id: e.pointerId, last: null, done: new Set(), pot: potFor(n)?.color, from: [e.clientX, e.clientY] }
      return
    }
    if (!t.closest?.('.game-board')) return
    const el = regionAt(e.clientX, e.clientY) ?? regionNear(e.clientX, e.clientY)
    stroke.current = { id: e.pointerId, last: el, done: new Set() }
    if (el && paint(el, e.clientX, e.clientY, true)) stroke.current.done.add(el)
  }
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const s = stroke.current
    if (!s || s.id !== e.pointerId || busy.current) return
    // (A mouse let go outside the game: the stroke is over.)
    if (e.buttons === 0) { stroke.current = null; hideBlob(); return }
    if (s.pot && s.from && Math.hypot(e.clientX - s.from[0], e.clientY - s.from[1]) > 12) showBlob(e.clientX, e.clientY, s.pot)
    const el = regionAt(e.clientX, e.clientY)
    if (el && el !== s.last) {
      s.last = el
      if (paint(el, e.clientX, e.clientY, false)) s.done.add(el)
    }
  }
  const up = (e: RPointerEvent<HTMLDivElement>) => {
    const s = stroke.current
    if (!s || s.id !== e.pointerId) return
    stroke.current = null
    hideBlob()
    // Paint carried from a pot and let go on a region it didn't paint on the way: that's a tap there
    // (it paints, or says which paint that region needs).
    if (s.pot && e.type === 'pointerup' && !busy.current) {
      const el = regionAt(e.clientX, e.clientY)
      if (el && !s.done.has(el)) paint(el, e.clientX, e.clientY, true)
    }
  }

  // The picture changes only when paint goes on, not with every drop and glow: keep it.
  const shown = useMemo(() => {
    const s = { ...fills }
    for (const x of spreads) s[x.id] = `url(#${x.gid})`
    return s
  }, [fills, spreads])
  const picture = useMemo(() => <Picture fills={shown} />, [Picture, shown])
  const isPainted = (id: string) => !!fills[id] || spreads.some((s) => s.id === id)
  const allDone = (n: number) => {
    const mine = todo.filter((id) => numOf(id) === n)
    return mine.length > 0 && mine.every(isPainted)
  }
  return (
    <div ref={root} className={`activity game paint-it ${ready ? 'ready' : ''} ${cheer ? 'cheering' : ''}`} data-ready={ready && !cheer ? 'yes' : 'no'}
      data-left={todo.filter((id) => !isPainted(id)).length} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className="practice-head paint-head">
        <h2>{title}</h2>
        <button className="icon-btn paint-again" aria-label="Hear it again" disabled={!ready || cheer} onClick={() => speak(intro)}>🔊</button>
      </div>
      <div className="paint-play">
        <Board className={cheer ? 'paint-cheer' : ''}>
          {picture}
          <BoardLayer ref={layer} className="paint-nums" aria-hidden>
            <defs>{spreads.map((s) => <SpreadPaint key={s.key} s={s} root={root} onEnd={() => settle(s.id, s.color)} />)}</defs>
            {regions.map((r, i) => {
              if (!todo.includes(r.id)) return null
              const fs = sizes[r.id] ?? 30
              const w = wiggle?.id === r.id
              return (
                <g key={i} transform={`translate(${r.at[0]} ${r.at[1]})`} data-num-for={r.id} data-n={r.n}>
                  <g className={`paint-num ${isPainted(r.id) ? 'gone' : ''} ${pulse?.id === r.id ? 'pulse' : ''}`}>
                    <g key={w ? wiggle.key : 'still'} className={w ? 'paint-wiggle' : undefined}>
                      <text className="paint-digit" y={fs * 0.36} fontSize={fs}>{r.n}</text>
                    </g>
                  </g>
                </g>
              )
            })}
          </BoardLayer>
          <BoardLayer className="paint-fx" aria-hidden>
            {pulse && <Copies key={pulse.key} root={root} id={pulse.id} className="paint-pulse" />}
            {drops.map((d) => (
              <g key={d.key} transform={`translate(${d.at[0]} ${d.at[1]})`}>
                {Array.from({ length: 7 }, (_, i) => (
                  <circle key={i} className="paint-drop" r={i % 2 ? 4.5 : 6.5} fill={d.color} style={{ '--a': `${i * 51 + 10}deg` } as CSSProperties} />
                ))}
              </g>
            ))}
            {cheer && <Shimmer root={root} ids={todo} regions={regions.filter((r) => todo.includes(r.id))} />}
          </BoardLayer>
        </Board>
        <div className="paint-pots" style={{ '--pots': palette.length, '--rows': palette.length > 6 ? Math.ceil(palette.length / 2) : palette.length } as CSSProperties}>
          {palette.map((p) => (
            <button key={p.n} data-n={p.n} style={{ '--pot': p.color } as CSSProperties}
              className={`paint-pot ${picked === p.n ? 'on' : ''} ${glow?.n === p.n ? 'glow' : ''}`}
              aria-label={`Number ${p.n}, ${p.name}`} aria-pressed={picked === p.n}
              onClick={(e) => { if (e.detail === 0) pick(p.n) /* (a finger or the mouse picked it already, on the way down) */ }}>
              <PotArt pot={p} picked={picked === p.n} />
              {allDone(p.n) && <DoneMark />}
            </button>
          ))}
        </div>
      </div>
      <div ref={blob} className="paint-blob" aria-hidden />
      {cheer && <Confetti count={36} />}
    </div>
  )
}

/** The paint spreading through one region: a radial gradient whose solid middle grows from the finger. */
function SpreadPaint({ s, root, onEnd }: { s: Spread; root: RefObject<HTMLDivElement | null>; onEnd: () => void }) {
  const ref = useRef<SVGRadialGradientElement>(null)
  useLayoutEffect(() => {
    const g = ref.current
    if (!g) return
    // The kit should fill the region with exactly what it's given (types.ts, PaintKit). If it made
    // something else of it, there's no spreading: the paint just goes on (before anything is seen).
    const url = `url(#${s.gid})`
    const used = shapesOf(root.current, s.id).some((el) => el.getAttribute('fill') === url || (el as SVGElement).style.fill.includes(s.gid))
    if (!used) return void onEnd()
    let raf = 0
    let over = false
    const t0 = performance.now()
    const ms = spreadMs(s.r)
    const end = () => {
      if (over) return
      over = true
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      onEnd()
    }
    const frame = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      g.setAttribute('r', String(Math.max(1, s.r * (1 - (1 - k) ** 2))))
      if (k >= 1) end()
      else raf = requestAnimationFrame(frame)
    }
    g.setAttribute('r', '1')
    raf = requestAnimationFrame(frame)
    // (If frames stop, say the app is in the background, the paint still goes on.)
    const safety = setTimeout(end, ms + 500)
    return () => { over = true; cancelAnimationFrame(raf); clearTimeout(safety) }
  }, [])
  return (
    <radialGradient ref={ref} id={s.gid} gradientUnits="userSpaceOnUse" cx={s.cx} cy={s.cy}>
      <stop offset="0" stopColor={s.color} />
      <stop offset="0.86" stopColor={s.color} />
      <stop offset="1" stopColor="#ffffff" />
    </radialGradient>
  )
}

/** Copies of a region's shapes, drawn over the picture (styled by `className`): for the hint's pulse. */
function Copies({ root, id, className }: { root: RefObject<HTMLDivElement | null>; id: string; className: string }) {
  const host = useRef<SVGGElement>(null)
  useLayoutEffect(() => {
    const g = host.current
    if (!g) return
    for (const c of copiesOf(root.current, id, g.ownerSVGElement)) g.appendChild(c)
    return () => g.replaceChildren()
  }, [id])
  return <g ref={host} className={className} />
}

/** All painted: a band of light sweeps across the painted regions (only them), and sparkles twinkle. */
function Shimmer({ root, ids, regions }: { root: RefObject<HTMLDivElement | null>; ids: string[]; regions: { at: At }[] }) {
  const clip = useRef<SVGClipPathElement>(null)
  const [clipped, setClipped] = useState(false)
  const id = `shine${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  useLayoutEffect(() => {
    const c = clip.current
    if (!c) return
    const copies = ids.flatMap((r) => copiesOf(root.current, r, c.ownerSVGElement))
    for (const x of copies) c.appendChild(x)
    setClipped(copies.length > 0)
    return () => c.replaceChildren()
  }, [])
  return (
    <g>
      <defs>
        <clipPath id={`${id}c`} ref={clip} />
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.85} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g clipPath={clipped ? `url(#${id}c)` : undefined}>
        <g className="paint-shine"><rect x={-320} y={-60} width={230} height={570} fill={`url(#${id}g)`} transform="skewX(-16)" /></g>
      </g>
      {regions.map((r, i) => (
        <path key={i} className="paint-twinkle" style={{ animationDelay: `${0.2 + (i % 7) * 0.16}s` }} d={sparkle(r.at[0] + 16, r.at[1] - 14, 10)} />
      ))}
    </g>
  )
}

/** A paint pot in its color, with its number on the front; while picked, a brush stands in it. */
function PotArt({ pot, picked }: { pot: Pot; picked: boolean }) {
  const gid = `pot${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const line = tint(pot.color, ink, '#5a4658')
  const light = tint(pot.color, (c) => lighten(c, 0.45), '#ffffff')
  const deep = tint(pot.color, (c) => darken(c, 0.14), pot.color)
  return (
    <svg viewBox="0 -16 100 132" className="paint-pot-art" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={light} />
          <stop offset="0.38" stopColor={pot.color} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
      </defs>
      {picked && (
        <g className="paint-brush">
          <g transform="rotate(18 62 40)">
            <rect x={57} y={-14} width={10} height={46} rx={5} fill="#e0a468" stroke="#8a5428" strokeWidth={2.5} />
            <rect x={55.5} y={26} width={13} height={10} rx={2} fill="#dfe2ea" stroke="#8d92a3" strokeWidth={2} />
            <path d="M56 36 Q56 50 62 54 Q68 50 68 36 Z" fill={pot.color} stroke={line} strokeWidth={2} />
          </g>
        </g>
      )}
      <path d="M12 40 L88 40 L82 104 Q81 113 72 113 L28 113 Q19 113 18 104 Z" fill={`url(#${gid})`} stroke={line} strokeWidth={3.5} strokeLinejoin="round" />
      <ellipse cx={50} cy={40} rx={39} ry={10} fill={light} stroke={line} strokeWidth={3.5} />
      <ellipse cx={50} cy={41} rx={31} ry={6} fill={pot.color} />
      <path d="M22 50 Q20 74 25 98" stroke="#fff" strokeOpacity={0.45} strokeWidth={5} strokeLinecap="round" fill="none" />
      <circle cx={52} cy={77} r={23} fill="#fff" stroke={line} strokeWidth={2.5} />
      <text x={52} y={77 + 12.5} textAnchor="middle" className="paint-pot-n">{pot.n}</text>
    </svg>
  )
}

/** Every region with this pot's number is painted. */
function DoneMark() {
  return (
    <svg viewBox="0 0 40 40" className="paint-done-mark" aria-hidden>
      <circle cx={20} cy={20} r={17} fill="#4cc98a" stroke="#fff" strokeWidth={4} />
      <path d="M12 20 L18 26 L29 14" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
