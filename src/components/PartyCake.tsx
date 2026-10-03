// The birthday cake: candles are dragged on (one for each year, counted out loud), light up, and get
// blown out with a tap or a swipe across the flames. Used by the birthday party and the Pal Kitchen.
import { useCallback, useEffect, useRef, useState } from 'react'
import { fly, useDrag, useDropTarget } from '../lib/drag'
import { numberWords } from '../lib/spoken'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { useAlive } from '../lib/useAlive'
import { wait } from '../lib/util'

const CANDLE_COLORS = ['#5fb7ff', '#ffd34d', '#5fd39a', '#c9a8ff', '#ff8cc0', '#ffa64d']
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Where each candle stands on the top tier (cake units). */
export function candleXs(n: number) {
  if (n <= 1) return [0]
  const gap = Math.min(22, 120 / (n - 1))
  return Array.from({ length: n }, (_, i) => i * gap - ((n - 1) * gap) / 2)
}

function Candle({ x, i, lit, out }: { x: number; i: number; lit: boolean; out: boolean }) {
  const c = CANDLE_COLORS[i % CANDLE_COLORS.length]
  return (
    <g>
      <rect x={x - 5} y={-146} width={10} height={44} rx={3} fill={c} stroke="#00000022" strokeWidth={1.5} />
      {[0, 1, 2].map((k) => <path key={k} d={`M${x - 5} ${-134 + k * 12} l10 -6`} stroke="#fff" strokeWidth={2.5} opacity={0.75} />)}
      <path d={`M${x} -146 l0 -6`} stroke="#5a4636" strokeWidth={2} strokeLinecap="round" />
      {lit && !out && (
        <g className="cake-flame">
          <circle cx={x} cy={-160} r={13} fill="#ffe08a" opacity={0.35} />
          <path d={`M${x} -174 q9 11 0 20 q-9 -9 0 -20 Z`} fill="#ffb347" />
          <path d={`M${x} -166 q4 6 0 10 q-4 -4 0 -10 Z`} fill="#fff3b0" />
        </g>
      )}
      {out && (
        <g className="cake-smoke">
          <circle cx={x} cy={-158} r={4} fill="#cfcad6" /><circle cx={x + 3} cy={-166} r={5} fill="#dcd8e2" /><circle cx={x - 2} cy={-175} r={6} fill="#e8e5ee" />
        </g>
      )}
    </g>
  )
}

/** The cake: `slots` places for candles (faint until a candle is in it), `placed` candles in them. */
export function PartyCake({ slots, placed, lit, out = [] }: { slots: number; placed: number; lit: boolean; out?: boolean[] }) {
  const xs = candleXs(slots)
  return (
    <svg className="party-cake-art" viewBox="-130 -182 260 206" aria-hidden>
      <ellipse cx={0} cy={10} rx={124} ry={15} fill="#ffffff" stroke="#e2d6ee" strokeWidth={3} />
      <rect x={-100} y={-62} width={200} height={68} rx={14} fill="#ffd6e8" stroke="#e58cb4" strokeWidth={4} />
      <path d={`M-100 -44 ${'q12.5 14 25 0 '.repeat(8)}`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" />
      {[[-70, -20, '#5fb7ff'], [-30, -10, '#ffd34d'], [12, -24, '#5fd39a'], [52, -12, '#c9a8ff'], [80, -28, '#ff6fae']].map(([x, y, c], i) => (
        <rect key={i} x={x as number} y={y as number} width={10} height={4} rx={2} fill={c as string} transform={`rotate(${i * 40 - 30} ${x} ${y})`} />
      ))}
      <rect x={-72} y={-104} width={144} height={46} rx={12} fill="#fff4fa" stroke="#e58cb4" strokeWidth={4} />
      <path d={`M-72 -90 ${'q12 12 24 0 '.repeat(6)}`} stroke="#ff9fc6" strokeWidth={7} fill="none" strokeLinecap="round" />
      {[-48, 0, 48].map((x) => <circle key={x} cx={x} cy={-70} r={6} fill="#ff5d5d" stroke="#c03a3a" strokeWidth={1.5} />)}
      {xs.map((x, i) => (i < placed
        ? <Candle key={i} x={x} i={i} lit={lit} out={!!out[i]} />
        : <ellipse key={i} cx={x} cy={-104} rx={6} ry={3} fill="none" stroke="#e58cb4" strokeWidth={2} strokeDasharray="3 3" />))}
    </svg>
  )
}

function TrayCandle({ i, onDrop, onTap }: { i: number; onDrop: () => boolean; onTap: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag({ data: 'candle', onStart: sfx.lift, onDrop: (t) => t === 'cake' && onDrop(), onTap: () => ref.current && onTap(ref.current) })
  const c = CANDLE_COLORS[i % CANDLE_COLORS.length]
  return (
    <button ref={ref} className="tray-candle" aria-label="Drag a candle onto the cake" {...drag}>
      <svg viewBox="-12 -36 24 40" width={34} height={56} aria-hidden>
        <rect x={-6} y={-26} width={12} height={30} rx={3} fill={c} />
        {[0, 1].map((k) => <path key={k} d={`M-6 ${-16 + k * 12} l12 -6`} stroke="#fff" strokeWidth={3} opacity={0.75} />)}
        <path d="M0 -26 l0 -6" stroke="#5a4636" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </button>
  )
}

/** Put `n` candles on the cake (drag them, or tap and they hop on), counting each; then they light up. */
export function CandlesOnCake({ n, intro, onDone }: { n: number; intro?: string; onDone: () => void }) {
  const alive = useAlive()
  const [tray, setTray] = useState(() => Array.from({ length: n }, (_, i) => i))
  const [placed, setPlaced] = useState(0)
  const count = useRef(0)
  const [lit, setLit] = useState(false)
  const cake = useRef<HTMLDivElement | null>(null)
  const cakeTarget = useDropTarget('cake', (d) => d === 'candle', 40)
  const cakeRef = useCallback((el: HTMLDivElement | null) => { cake.current = el; cakeTarget(el) }, [cakeTarget])

  useEffect(() => { speak(intro ?? `Put ${numberWords(n)} ${n === 1 ? 'candle' : 'candles'} on the cake! Drag them on.`) }, [])

  const light = async () => {
    await wait(600)
    if (!alive.current) return
    setLit(true)
    sfx.sparkle()
    await speak(`${cap(numberWords(n))} ${n === 1 ? 'candle' : 'candles'}! Let's light them up!`)
    if (alive.current) onDone()
  }
  const add = (i: number) => {
    if (count.current >= n) return false
    const k = ++count.current
    setTray((t) => t.filter((x) => x !== i))
    setPlaced(k)
    sfx.count(Math.min(k, 10))
    speak(`${cap(numberWords(k))}!`)
    if (k === n) light()
    return true
  }
  const tap = async (i: number, el: HTMLElement) => {
    if (!cake.current) return
    el.style.visibility = 'hidden'
    await fly(el, cake.current, { arc: 80, endScale: 0.7 })
    if (alive.current) add(i)
  }
  return (
    <div className="candle-step">
      <div ref={cakeRef} className={`party-cake ${lit ? 'lit' : ''}`}><PartyCake slots={n} placed={placed} lit={lit} /></div>
      <div className="candle-tray">
        {tray.map((i) => <TrayCandle key={i} i={i} onDrop={() => add(i)} onTap={(el) => tap(i, el)} />)}
        {!tray.length && <span className="candle-count">{placed} 🕯️</span>}
      </div>
    </div>
  )
}

/** Make a wish and blow out the candles: tap the cake (or swipe across the flames). */
export function BlowOut({ n, onDone }: { n: number; onDone: () => void }) {
  const alive = useAlive()
  const [out, setOut] = useState<boolean[]>(() => Array(n).fill(false))
  const outNow = useRef(out)
  const box = useRef<HTMLDivElement>(null)
  const down = useRef(false)
  const xs = candleXs(n)
  const finished = useRef(false)

  useEffect(() => { speak('Make a wish! Then blow out the candles: tap them, or swipe across the flames!') }, [])

  /** Puffs out the lit candles near cake-x `x` (all within `reach`), or the nearest two for a tap. */
  const puff = (x: number, reach: number, most: number) => {
    const cur = outNow.current
    const near = xs.map((cx, i) => ({ i, d: Math.abs(cx - x) })).filter((c) => !cur[c.i] && c.d <= reach).sort((a, b) => a.d - b.d).slice(0, most)
    if (!near.length) return
    const next = cur.slice()
    for (const c of near) next[c.i] = true
    outNow.current = next
    setOut(next)
    sfx.whoosh()
    if (next.every(Boolean) && !finished.current) {
      finished.current = true
      ;(async () => {
        sfx.fanfare()
        await speak('Hooray! You blew them all out!')
        if (alive.current) onDone()
      })()
    }
  }
  const cakeX = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect()
    return -130 + ((e.clientX - r.left) / r.width) * 260
  }
  return (
    <div className="candle-step">
      <div ref={box} className="party-cake lit blowable"
        onPointerDown={(e) => { down.current = true; puff(cakeX(e), 60, 2) }}
        onPointerMove={(e) => { if (down.current) puff(cakeX(e), 12, n) }}
        onPointerUp={() => { down.current = false }} onPointerCancel={() => { down.current = false }} onPointerLeave={() => { down.current = false }}>
        <PartyCake slots={n} placed={n} lit out={out} />
      </div>
      <button className="blow-btn" onClick={() => { const left = xs.findIndex((_, i) => !outNow.current[i]); if (left >= 0) puff(xs[left], 30, 2) }}>💨 Blow!</button>
    </div>
  )
}
