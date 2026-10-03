// Spot it: find things in a big picture by tapping them: the animals God made, hiding in the garden;
// Abraham's stars, lighting up one by one; Daniel's lions, lying down gently. See types.ts, SpotKit.
//
// The board stacks the kit's Picture, the things to find (each drawn at its spot, found or not), the
// kit's Front (a bush, a cloud) and, on top, a clear layer that takes every tap. A tap within a thing's
// reach (`r`) finds it: it changes, sparkles, and says its line or the count so far ("One!", "Two!").
// A tap anywhere else only ripples. Each find fills a spot on the shelf above the picture. After about
// eight seconds without a find, a soft glow pulses near one still hidden (roughly at first, closer each
// time she still can't find it) with a short line. When all are found: fanfare, confetti, everything
// found hops for joy, the `done` line, then onDone.
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties, type PointerEvent as RPointerEvent } from 'react'
import type { At, SpotKit, SpotTarget } from './types'
import { Board, BoardLayer, toBoard } from './Board'
import { Confetti } from '../../components/ui'
import { sparkle } from '../../art/scenes/kit'
import { isSpeaking, preload, speak } from '../../lib/speech'
import { numberWords } from '../../lib/spoken'
import { sfx } from '../../lib/sfx'
import { wait } from '../../lib/util'
import { useAlive } from '../../lib/useAlive'
import './SpotIt.css'

/** How long without a find before a hint, and between hints. */
const HINT_MS = 8000
/** A hint glows this long. */
const HINT_SHOWS = 5200
/** A tap reaches a thing at least this far from its middle, whatever the kit says (board units). */
const MIN_REACH = 40

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
/** "One!", "Two!"… */
const countLine = (n: number) => `${cap(numberWords(n))}!`
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const reach = (t: SpotTarget) => Math.max(t.r, MIN_REACH)

/** A hint: the first time roughly near the thing, then closer, then right on it. */
function hintLine(level: number, left: number, plural: string) {
  if (level >= 2) return 'Tap where it glows!'
  if (level === 1) return 'Look where it glows!'
  return left === 1 ? 'Just one more! Can you find it?' : `There are more ${plural} to find!`
}

/** A sparkle burst (with the count, when finds are counted) or a ripple, at a spot on the board. */
type Fx = { key: number; kind: 'burst' | 'ripple'; at: At; n?: number }
type Hint = { key: number; at: At; r: number }

export default function SpotIt({ title, intro, done, plural, kit, onDone }: {
  title: string; intro: string; done: string; plural: string; kit: SpotKit; onDone: () => void
}) {
  const { Picture, Front, targets } = kit
  // (ids, in the order she found them)
  const [found, setFound] = useState<string[]>([])
  const foundRef = useRef<string[]>([])
  const [fx, setFx] = useState<Fx[]>([])
  const [hint, setHint] = useState<Hint | null>(null)
  const [ready, setReady] = useState(false)
  const [cheer, setCheer] = useState(false)
  // Taps wait while the intro is said, and stop at the end.
  const busy = useRef(true)
  const alive = useAlive()
  const things = useRef(new Map<string, SVGGElement>())
  const fxKey = useRef(0)
  const lastFind = useRef(0)
  const lastHint = useRef(0)
  const misses = useRef(0)
  // The thing the hints are about, and how many times she's been shown it.
  const hinted = useRef<{ id: string; level: number } | null>(null)
  const glowId = `spotglow${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  useEffect(() => {
    ;(async () => {
      await speak(intro)
      if (!alive.current) return
      busy.current = false
      lastFind.current = Date.now()
      setReady(true)
      if (!targets.length) finish()
    })()
    // Fetch the lines now, so each find answers right away.
    const counted = targets.some((t) => !t.say)
    preload([
      ...targets.flatMap((t) => (t.say ? [t.say] : [])),
      ...(counted ? targets.map((_, i) => countLine(i + 1)) : []),
      hintLine(0, 2, plural), hintLine(0, 1, plural), hintLine(1, 2, plural), hintLine(2, 2, plural), done,
    ])
  }, [])

  const addFx = (kind: Fx['kind'], at: At, ms: number, n?: number) => {
    const key = ++fxKey.current
    setFx((f) => [...f, { key, kind, at, n }])
    setTimeout(() => { if (alive.current) setFx((f) => f.filter((x) => x.key !== key)) }, ms)
  }
  const animate = (id: string, frames: Keyframe[], ms: number) =>
    things.current.get(id)?.animate(frames, { duration: ms, easing: 'ease-out' })

  const finish = async () => {
    busy.current = true
    setHint(null)
    setCheer(true)
    sfx.fanfare()
    // (Long enough to see everything hop, even if the line is quick.)
    await Promise.all([speak(done), wait(2400)])
    if (!alive.current) return
    await wait(600)
    if (alive.current) onDone()
  }

  const find = async (t: SpotTarget) => {
    const all = [...foundRef.current, t.id]
    foundRef.current = all
    setFound(all)
    lastFind.current = Date.now()
    misses.current = 0
    hinted.current = null
    setHint(null)
    addFx('burst', t.at, 1300, t.say ? undefined : all.length)
    if (t.say) sfx.sparkle()
    else { sfx.ding(); sfx.count(all.length) }
    const line = t.say ?? countLine(all.length)
    if (all.length < targets.length) return void speak(line)
    busy.current = true
    await speak(line)
    if (alive.current) finish()
  }

  const showHint = () => {
    const left = targets.filter((t) => !foundRef.current.includes(t.id))
    if (!left.length || busy.current) return
    const was = hinted.current
    const same = was ? left.find((t) => t.id === was.id) : undefined
    const t = same ?? left[Math.floor(Math.random() * left.length)]
    const level = same && was ? was.level + 1 : 0
    hinted.current = { id: t.id, level }
    const key = Date.now()
    lastHint.current = key
    misses.current = 0
    // Roughly near it at first (somewhere in a big soft glow), then closer, then right on it.
    const k = Math.min(level, 2)
    const off = reach(t) * [0.7, 0.35, 0][k]
    const a = Math.random() * Math.PI * 2
    const at: At = [clamp(t.at[0] + Math.cos(a) * off, 24, 776), clamp(t.at[1] + Math.sin(a) * off, 24, 426)]
    setHint({ key, at, r: reach(t) * [2.2, 1.7, 1.35][k] })
    setTimeout(() => { if (alive.current) setHint((h) => (h?.key === key ? null : h)) }, HINT_SHOWS)
    // From the second time, the thing itself stirs a little (a bush rustles, a star flickers).
    if (level >= 1) animate(t.id, [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(0)' }], 700)
    // (The first three hints are said; after that only now and then, and then the glow alone, in case
    // she has gone off to do something else.)
    if (level <= 2 || (level < 7 && level % 2 === 0)) speak(hintLine(level, left.length, plural))
  }

  // Every half second: has it been a while since she found one (or since the last hint)?
  const tick = useRef(() => {})
  tick.current = () => {
    if (busy.current || isSpeaking()) return
    if (Date.now() - Math.max(lastFind.current, lastHint.current) >= HINT_MS) showHint()
  }
  useEffect(() => {
    const t = setInterval(() => tick.current(), 500)
    return () => clearInterval(t)
  }, [])

  const tap = (e: RPointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const p = toBoard(e.currentTarget, e.clientX, e.clientY)
    if (busy.current) return addFx('ripple', p, 600)
    const near = (t: SpotTarget) => Math.hypot(p[0] - t.at[0], p[1] - t.at[1]) / reach(t)
    // The nearest thing still hidden, if the tap reaches it.
    let best: SpotTarget | undefined
    for (const t of targets) {
      if (foundRef.current.includes(t.id) || near(t) > 1) continue
      if (!best || near(t) < near(best)) best = t
    }
    if (best) return void find(best)
    // One she's found already: it hops (and says its line again, if it has one).
    const again = targets.find((t) => foundRef.current.includes(t.id) && near(t) <= 1)
    if (again) {
      sfx.pop()
      animate(again.id, [{ transform: 'translateY(0)' }, { transform: 'translateY(-14px) scale(1.06)' }, { transform: 'translateY(0)' }], 420)
      if (again.say && !isSpeaking()) speak(again.say)
      return
    }
    addFx('ripple', p, 600)
    // Lots of looking without finding: the hint comes sooner.
    if (++misses.current >= 5 && Date.now() - lastFind.current > 3000 && Date.now() - lastHint.current > 4000 && !isSpeaking()) showHint()
  }

  // The picture and the things change only with a find, not with every sparkle and ripple: keep them.
  const picture = useMemo(() => <Picture />, [Picture])
  const front = useMemo(() => (Front ? <BoardLayer className="spot-front" aria-hidden><Front /></BoardLayer> : null), [Front])
  const shelf = useMemo(() => <Shelf targets={targets} found={found} />, [targets, found])
  const thingsLayer = useMemo(() => (
    <BoardLayer className="spot-things" aria-hidden>
      {targets.map((t, i) => {
        const f = found.includes(t.id)
        return (
          <g key={t.id} transform={`translate(${t.at[0]} ${t.at[1]})`} data-target={t.id} data-at={t.at.join(',')} data-r={reach(t)} data-found={f ? 'yes' : 'no'}>
            <g className={`spot-thing ${f ? 'found' : ''}`} style={{ '--d': `${(i % 8) * 0.09}s` } as CSSProperties}
              ref={(el) => { if (el) things.current.set(t.id, el); else things.current.delete(t.id) }}>
              <t.Draw found={f} />
            </g>
          </g>
        )
      })}
    </BoardLayer>
  ), [targets, found])

  return (
    <div className={`activity game spot-it ${cheer ? 'cheering' : ''}`} data-ready={ready && !cheer ? 'yes' : 'no'}
      data-found={found.length} data-total={targets.length}>
      <div className="practice-head spot-head">
        <h2>{title}</h2>
        {shelf}
        <button className="icon-btn spot-again" aria-label="Hear it again" disabled={!ready || cheer} onClick={() => speak(intro)}>🔊</button>
      </div>
      <Board className={cheer ? 'spot-cheer' : ''}>
        {picture}
        {thingsLayer}
        {front}
        {/* On top: takes every tap, and shows the sparkles, ripples and hints. */}
        <BoardLayer className="spot-tap" onPointerDown={tap}>
          <defs>
            <radialGradient id={glowId}>
              <stop offset="0" stopColor="#fffbe0" stopOpacity={0.85} />
              <stop offset="0.45" stopColor="#ffe680" stopOpacity={0.5} />
              <stop offset="1" stopColor="#ffd34d" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width={800} height={450} fill="transparent" />
          {hint && (
            <g key={hint.key} transform={`translate(${hint.at[0]} ${hint.at[1]})`} pointerEvents="none">
              <g className="spot-hint"><g className="spot-hint-pulse"><circle r={hint.r} fill={`url(#${glowId})`} /></g></g>
            </g>
          )}
          {fx.map((f) => (
            <g key={f.key} transform={`translate(${f.at[0]} ${f.at[1]})`} pointerEvents="none">
              {f.kind === 'ripple' ? <Ripple /> : <Burst glow={glowId} n={f.n} below={f.at[1] < 80} />}
            </g>
          ))}
        </BoardLayer>
      </Board>
      {cheer && <Confetti count={36} />}
    </div>
  )
}

/**
 * A find: a flash of light, a ring, and sparkles flying out; when finds are counted, its number (`n`)
 * floats up from it. Centred on (0, 0); `glow` is the glow gradient's id.
 */
function Burst({ glow, n, below }: { glow: string; n?: number; below?: boolean }) {
  return (
    <g>
      <circle className="spot-flash" r={46} fill={`url(#${glow})`} />
      <circle className="spot-ring" r={32} />
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} className="spot-ray" style={{ '--a': `${i * 36 + 14}deg` } as CSSProperties} d={sparkle(0, -18, i % 2 ? 8 : 13)} />
      ))}
      {/* (Under the thing when it's near the top of the picture, where above would be cut off.) */}
      {n !== undefined && <g className="spot-count"><text y={below ? 72 : -34} fontSize={44}>{n}</text></g>}
    </g>
  )
}

/** A tap that finds nothing: a little ripple, a white ring round a pink one (to show on night sky and white cloud alike). */
function Ripple() {
  return (
    <g className="spot-ripple">
      <circle r={19} fill="none" stroke="#fff" strokeWidth={4} />
      <circle r={13.5} fill="none" stroke="#ff8cc0" strokeWidth={2.5} />
    </g>
  )
}

/** How many she's found: the number, and a row of spots that fill with each find's picture. */
function Shelf({ targets, found }: { targets: SpotTarget[]; found: string[] }) {
  const byId = new Map(targets.map((t) => [t.id, t]))
  return (
    <div className="spot-shelf" style={{ '--n': targets.length } as CSSProperties} role="img" aria-label={`${found.length} of ${targets.length}`}>
      <b className="spot-n" key={found.length}>{found.length}</b>
      <span className="spot-slots">
        {targets.map((_, i) => {
          const t = i < found.length ? byId.get(found[i]) : undefined
          return <span key={i} className={`spot-slot ${t ? 'on' : ''}`}>{t && <Thumb Draw={t.Draw} />}</span>
        })}
      </span>
    </div>
  )
}

/** A found thing, small: its drawing, fitted to its own size. (A star if it draws nothing once found.) */
function Thumb({ Draw }: { Draw: ComponentType<{ found: boolean }> }) {
  const g = useRef<SVGGElement>(null)
  const [box, setBox] = useState<string | null>(null)
  const [empty, setEmpty] = useState(false)
  useLayoutEffect(() => {
    try {
      const b = g.current!.getBBox()
      if (b.width < 1 || b.height < 1) return setEmpty(true)
      const s = Math.max(b.width, b.height) * 1.06
      setBox(`${b.x + b.width / 2 - s / 2} ${b.y + b.height / 2 - s / 2} ${s} ${s}`)
    } catch {
      setBox('-50 -50 100 100')
    }
  }, [])
  if (empty) return <svg viewBox="-20 -20 40 40" className="spot-thumb"><path d={sparkle(0, 0, 17)} fill="#ffd34d" stroke="#e0a800" strokeWidth={2} /></svg>
  return (
    <svg viewBox={box ?? '-50 -50 100 100'} className="spot-thumb pa-anim" style={{ visibility: box ? 'visible' : 'hidden' }} aria-hidden>
      <g ref={g}><Draw found /></g>
    </svg>
  )
}
