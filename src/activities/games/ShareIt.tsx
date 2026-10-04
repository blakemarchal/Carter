// Share it: give everyone the same (the loaves and fishes). See types.ts, ShareKit.
//
// Each round, some of the kit's people stand behind their plates on a picnic cloth, and a pile of things
// waits in a basket under the board: "Share six loaves of bread with three friends, so everyone gets the
// same!" She drags things onto the plates (each plate counts aloud, and shows its count), from plate to
// plate, or back to the basket. A tap shows how to drag (the first time), then hands the thing to the
// plate with the fewest. When the basket is empty: if every plate has the same, one plate is counted
// aloud and everyone hops ("Everyone has two! That's fair!"); if not, the uneven plates wiggle ("Hmm, some
// plates have more. Can you make it fair?") and she evens them out. Eight quiet seconds bring a hand
// carrying a thing to the plate with the fewest. After the last round: a fanfare, the done line, and on.
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { Thing } from '../../data/islands'
import type { ShareKit } from './types'
import { Board, BoardLayer } from './Board'
import { Scene } from '../../art/scenes/kit'
import Pic from '../../components/Pic'
import { Confetti } from '../../components/ui'
import { preload, speak } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import { fly, showDrag, useDrag, useDropTarget } from '../../lib/drag'
import { numberWords } from '../../lib/spoken'
import { wait } from '../../lib/util'
import { useAlive } from '../../lib/useAlive'
import './ShareIt.css'

/** How long without progress before a hand shows what to do next. */
const IDLE_MS = 8000
/** Board units: where the people stand (their middles), where the plates are, and a thing's size on a plate. */
const PERSON_Y = 228
const PLATE_Y = 376
const ITEM = 74

type Spot = 'pile' | number
/** What's being dragged: which thing, and where from. */
interface Grab { id: number; from: Spot }
interface Deal { pile: number[]; plates: number[][] }

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const counted = (n: number) => `${cap(numberWords(n))}!`
/** `k` board units, in pixels (--k is pixels per board unit). */
const u = (k: number) => `calc(var(--k, 1px) * ${k})`

/** Where each of n people stands across the board, and how wide their plates are. */
function lineUp(n: number) {
  const gap = Math.min(300, 720 / n)
  return { xs: Array.from({ length: n }, (_, i) => 400 + (i - (n - 1) / 2) * gap), plate: Math.min(224, gap - 24) }
}

/** Where the j-th thing on a plate sits, from the plate's middle, and its row: a row, a shorter row on top, and so on. */
function heap(j: number, perRow: number): [number, number, number] {
  const step = ITEM * 0.8
  for (let row = 0, left = j; ; row++) {
    const n = row % 2 ? perRow - 1 : perRow
    if (left < n) return [(left - (n - 1) / 2) * step, -16 - row * ITEM * 0.42, row]
    left -= n
  }
}

/** The fewest (or most) on any plate: the first such plate. */
const fewest = (d: Deal) => d.plates.reduce((best, p, i) => (p.length < d.plates[best].length ? i : best), 0)
const fullest = (d: Deal) => d.plates.reduce((best, p, i) => (p.length > d.plates[best].length ? i : best), 0)

function Loose({ thing, grab, disabled, className = '', style, onDrop, onTap }: {
  thing: Thing; grab: Grab; disabled: boolean; className?: string; style?: CSSProperties
  onDrop: (target: string) => boolean; onTap: (el: HTMLElement) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag<Grab>({ data: grab, disabled, landing: 'here', onStart: sfx.lift, onDrop: (t) => onDrop(t), onTap: () => ref.current && onTap(ref.current) })
  return (
    <button ref={ref} type="button" className={`share-thing ${className}`} style={style} aria-label={thing.say} data-thing={grab.id} {...drag}>
      <Pic e={thing.emoji} art={thing.art} />
    </button>
  )
}

/** One person's plate: the column of the board in front of them takes drops; the things heap up on the plate. */
function Plate({ i, x0, x1, x, w, things, thing, lit, disabled, plateRef, onDrop, onTap }: {
  i: number; x0: number; x1: number; x: number; w: number; things: number[]; thing: Thing; lit: number; disabled: boolean
  plateRef: (el: SVGSVGElement | null) => void; onDrop: (id: number) => (target: string) => boolean; onTap: () => void
}) {
  const target = useDropTarget(`share-plate-${i}`, (d: Grab) => d?.from !== i, 0)
  const perRow = w >= 180 ? 3 : 2
  const h = w * 0.36
  return (
    <div ref={target} className="share-zone" data-plate={i} style={{ left: u(x0), width: u(x1 - x0) }}>
      <svg ref={plateRef} className="share-plate" viewBox={`${-w / 2 - 4} ${-h / 2} ${w + 8} ${h + 6}`}
        style={{ left: u(x - x0 - w / 2 - 4), top: u(PLATE_Y + 8 - h / 2), width: u(w + 8), height: u(h + 6) }} aria-hidden>
        <ellipse cx={0} cy={5} rx={w / 2} ry={h * 0.42} fill="#7a4a2a" opacity={0.18} />
        <ellipse cx={0} cy={0} rx={w / 2 - 1} ry={h * 0.42} fill="#ffffff" stroke="#c9b3a0" strokeWidth={3} />
        <ellipse cx={0} cy={1} rx={w * 0.32} ry={h * 0.24} fill="#f5efe7" stroke="#e6d8c8" strokeWidth={2} />
      </svg>
      {things.map((id, j) => {
        const [hx, hy, row] = heap(j, perRow)
        return (
          <Loose key={id} thing={thing} grab={{ id, from: i }} disabled={disabled} className={j < lit ? 'lit' : ''} onDrop={onDrop(id)} onTap={onTap}
            style={{ left: u(x - x0 + hx - ITEM / 2), top: u(PLATE_Y + hy - ITEM / 2), zIndex: 40 - row }} />
        )
      })}
      <span key={things.length} className={`share-count ${things.length ? '' : 'zero'}`} style={{ left: u(x - x0 + w / 2 - 4), top: u(PLATE_Y + 30) }}>{things.length}</span>
    </div>
  )
}

export default function ShareIt({ title, intro, done, kit, onDone }: {
  title: string; intro: string; done: string; kit: ShareKit; onDone: () => void
}) {
  // The rounds as the island set them (one that couldn't come out even is trimmed so that it does).
  const rounds = useMemo(() => (kit.rounds.length ? kit.rounds : [{ items: 4, people: 2 }]).map(({ items, people }) => {
    const n = Math.max(1, Math.min(people, kit.people.length))
    return { items: Math.max(n, items - (items % n)), people: n }
  }), [kit])
  const backdrop = useMemo(() => <Scene sky="day" ground="meadow" />, [])
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const alive = useAlive()

  const fresh = (r: number): Deal => ({
    pile: Array.from({ length: rounds[r].items }, (_, i) => r * 1000 + i),
    plates: Array.from({ length: rounds[r].people }, () => []),
  })
  const [round, setRound] = useState(0)
  const roundRef = useRef(0)
  const [deal, setDeal] = useState(() => fresh(0))
  const cur = useRef(deal)
  const commit = (d: Deal) => { cur.current = d; setDeal(d) }
  const [busy, setBusyState] = useState(true)
  const busyRef = useRef(true) // a ref as well, so two quick drops can't both count
  const setBusy = (b: boolean) => { busyRef.current = b; setBusyState(b) }
  const [lit, setLit] = useState(0) // while one plate is counted aloud: how many of its things are lit
  const [cheer, setCheer] = useState(false)
  const [leaving, setLeaving] = useState(false) // a round's people and plates fading out before the next round
  const [poke, setPoke] = useState(0) // bumped by every move: the wait for a hint starts again
  const bump = () => setPoke((n) => n + 1)
  const tapHinted = useRef(false)
  const hints = useRef(0) // hints in a row, without a move
  const flying = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(() => alive.current && fn(), ms)) }

  const root = useRef<HTMLDivElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const pileEl = useRef<HTMLDivElement | null>(null)
  const plates = useRef(new Map<number, SVGSVGElement>())
  const persons = useRef(new Map<number, SVGGElement>())
  const pileTarget = useDropTarget('share-pile', (d: Grab) => d?.from !== 'pile', 30)
  const pileRef = useCallback((el: HTMLDivElement | null) => { pileEl.current = el; pileTarget(el) }, [pileTarget])

  const { items, people: n } = rounds[round]
  const people = kit.people.slice(0, n)
  const { xs, plate: plateW } = lineUp(n)

  // The things on the plates are laid over the board, lined up with its pictures (which keep their
  // 16:9 shape inside the board, letterboxed if the board isn't quite 16:9).
  useLayoutEffect(() => {
    const ov = overlay.current
    const board = ov?.parentElement
    const rt = root.current
    if (!ov || !board || !rt) return
    const fit = () => {
      const W = board.clientWidth, H = board.clientHeight
      const k = Math.min(W / 800, H / 450)
      if (!k) return
      Object.assign(ov.style, { left: `${(W - 800 * k) / 2}px`, top: `${(H - 450 * k) / 2}px`, width: `${800 * k}px`, height: `${450 * k}px` })
      rt.style.setProperty('--k', `${k}px`)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(board)
    return () => ro.disconnect()
  }, [])

  const askLine = (r: number) => {
    const { items: m, people: p } = rounds[r]
    return `${r ? 'Now share' : 'Share'} ${numberWords(m)} ${m === 1 ? kit.item.say : kit.plural} with ${p === 1 ? 'one friend' : `${numberWords(p)} friends`}, so everyone gets the same!`
  }
  const ask = (r: number) => speak(askLine(r))

  const started = useRef(false)
  useEffect(() => {
    // (Once: a hot reload while developing re-runs effects, and the game mustn't start over.)
    if (started.current) return
    started.current = true
    ;(async () => {
      await speak(intro)
      if (!alive.current) return
      setBusy(false)
      ask(0)
      // (so the counting keeps a steady beat later)
      preload([
        ...Array.from({ length: Math.max(...rounds.map((r) => r.items)) }, (_, i) => counted(i + 1)),
        ...rounds.map((r) => `Everyone has ${numberWords(r.items / r.people)}! That's fair!`),
        ...rounds.slice(1).map((_, r) => askLine(r + 1)),
        'Hmm, some plates have more. Can you make it fair?',
        done,
      ])
    })()
  }, [])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // After a quiet while, a hand carries a thing to the plate with the fewest.
  useEffect(() => {
    if (busy || cheer) return
    const t = window.setTimeout(() => {
      if (!busyRef.current && !flying.current) hint()
      bump()
    }, IDLE_MS)
    return () => clearTimeout(t)
  }, [poke, busy, cheer])

  const hint = () => {
    const d = cur.current
    const to = fewest(d)
    const spot = plates.current.get(to)
    if (!spot) return
    let from: Element | null | undefined
    if (d.pile.length) from = pileEl.current?.querySelector('.share-thing')
    else {
      const on = overlay.current?.querySelectorAll(`[data-plate="${fullest(d)}"] .share-thing`)
      from = on?.[on.length - 1]
    }
    // (The first three hints in a row are said; after that only now and then, and then the hand alone,
    // in case she has gone off to do something else.)
    const k = hints.current++
    if (k <= 2 || (k < 7 && k % 2 === 0)) speak(`Give one to ${kit.people[to]?.say ?? 'a friend'}!`)
    if (from) showDrag(from, spot)
  }

  const hop = (i: number, big = false) => {
    persons.current.get(i)?.animate(
      [{ transform: 'translateY(0)' }, { transform: `translateY(${big ? -26 : -14}px)`, offset: 0.4 }, { transform: 'translateY(0)' }],
      { duration: big ? 520 : 380, easing: 'ease-out', iterations: big ? 2 : 1 },
    )
  }
  const wiggle = (i: number) => {
    overlay.current?.querySelector(`[data-plate="${i}"]`)?.animate(
      [{ transform: 'none' }, { transform: 'translateX(-9px) rotate(-3deg)' }, { transform: 'translateX(9px) rotate(3deg)' },
        { transform: 'translateX(-7px) rotate(-2deg)' }, { transform: 'translateX(6px) rotate(2deg)' }, { transform: 'none' }],
      { duration: 800, easing: 'ease-in-out' },
    )
  }

  /** Moves a thing to a plate or back to the basket. False if it can't go there (it floats back). */
  const move = (id: number, to: Spot): boolean => {
    if (busyRef.current) return false
    const d = cur.current
    const from: Spot | -1 = d.pile.includes(id) ? 'pile' : d.plates.findIndex((p) => p.includes(id))
    if (from === -1 || from === to) return false
    const next: Deal = { pile: d.pile.filter((x) => x !== id), plates: d.plates.map((p) => p.filter((x) => x !== id)) }
    if (to === 'pile') next.pile.push(id)
    else next.plates[to].push(id)
    commit(next)
    bump()
    hints.current = 0
    if (to === 'pile') sfx.pop()
    else {
      sfx.plop()
      sfx.count(next.plates[to].length)
      hop(to)
    }
    if (!next.pile.length) {
      if (next.plates.every((p) => p.length === next.plates[0].length)) {
        fair(next)
        return true
      }
      if (d.pile.length) {
        unfair(next) // the basket just ran out
        return true
      }
    }
    if (to !== 'pile') speak(counted(next.plates[to].length))
    return true
  }

  /** Not fair yet: the plates that don't have their share wiggle, and she evens them out. */
  const unfair = (d: Deal) => {
    const each = d.plates.reduce((s, p) => s + p.length, 0) / d.plates.length
    sfx.oops()
    later(() => d.plates.forEach((p, i) => p.length !== each && wiggle(i)), 120)
    speak('Hmm, some plates have more. Can you make it fair?')
  }

  /** Fair! Count one plate aloud, everyone hops, and on to the next round (or the end). */
  const fair = async (d: Deal) => {
    setBusy(true)
    const each = d.plates[0].length
    const r = roundRef.current
    const last = r + 1 >= rounds.length
    await wait(450)
    for (let j = 1; j <= each; j++) {
      if (!alive.current) return
      setLit(j)
      sfx.count(j)
      await speak(counted(j))
    }
    if (!alive.current) return
    d.plates.forEach((_, i) => later(() => hop(i, true), i * 110))
    if (last) {
      sfx.fanfare()
      setCheer(true)
    } else sfx.good()
    await speak(`Everyone has ${numberWords(each)}! That's fair!`)
    if (!alive.current) return
    if (last) {
      await speak(done)
      if (!alive.current) return
      await wait(700)
      if (alive.current) onDone()
      return
    }
    await wait(500)
    if (!alive.current) return
    // This round's people and plates fade away, and the next round's come.
    setLeaving(true)
    await wait(350)
    if (!alive.current) return
    roundRef.current = r + 1
    setLit(0)
    setLeaving(false)
    setRound(r + 1)
    commit(fresh(r + 1))
    setBusy(false)
    ask(r + 1)
  }

  const dropOn = (id: number) => (t: string) => {
    if (t === 'share-pile') return move(id, 'pile')
    const m = /^share-plate-(\d+)$/.exec(t)
    return m ? move(id, Number(m[1])) : false
  }

  /** A tap on a thing in the basket: the first time, how to drag it; then it hops to the plate with the fewest. */
  const tapPile = async (id: number, el: HTMLElement) => {
    if (busyRef.current || flying.current) return
    bump()
    const to = fewest(cur.current)
    const spot = plates.current.get(to)
    if (!spot) return
    if (!tapHinted.current) {
      tapHinted.current = true
      speak('Drag it onto a plate!')
      return void showDrag(el, spot)
    }
    flying.current = true
    const k = parseFloat(root.current?.style.getPropertyValue('--k') || '1')
    // (Hidden only once the flying copy is made: a copy of a hidden thing would fly unseen.)
    const flight = fly(el, spot, { endScale: (ITEM * k) / Math.max(1, el.getBoundingClientRect().width), fade: false })
    el.style.visibility = 'hidden'
    await flight
    flying.current = false
    if (!alive.current) return
    if (!move(id, to)) el.style.visibility = ''
  }

  /** A tap on a thing on a plate: how many that plate has. */
  const tapPlate = (i: number) => {
    if (busyRef.current) return
    bump()
    speak(counted(cur.current.plates[i].length))
  }

  return (
    <div ref={root} className={`activity game share-it ${leaving ? 'leaving' : ''}`} data-busy={busy ? 'yes' : 'no'} data-round={round}>
      <div className="practice-head">
        <h2>{title}</h2>
        <div className="share-rounds" aria-hidden>{rounds.map((_, r) => <span key={r} className={r < round ? 'done' : r === round ? 'now' : ''} />)}</div>
        {/* (not while the narrator is busy: counting, cheering, the done line) */}
        <button type="button" className="share-again" aria-label="Hear it again" disabled={busy} onClick={() => ask(roundRef.current)}>🔊</button>
      </div>
      <Board className="share-board">
        {backdrop}
        <BoardLayer>
          <defs>
            <pattern id={`${uid}-cloth`} width={36} height={36} patternUnits="userSpaceOnUse">
              <rect width={36} height={36} fill="#fffaf2" />
              <rect width={18} height={36} fill="#f08c8c" opacity={0.5} />
              <rect width={36} height={18} fill="#f08c8c" opacity={0.5} />
            </pattern>
          </defs>
          <g className="share-people">
            {people.map((p, i) => (
              <g key={`${round}-${p.id}`} transform={`translate(${xs[i]} ${PERSON_Y})`}>
                <g className="share-person" style={{ animationDelay: `${i * 120}ms` }}
                  ref={(el) => { if (el) persons.current.set(i, el); else persons.current.delete(i) }}>
                  <p.Draw />
                </g>
              </g>
            ))}
          </g>
          {/* the picnic cloth the plates sit on */}
          <path d="M46 336 Q400 326 754 336 L806 456 L-6 456 Z" fill={`url(#${uid}-cloth)`} stroke="#e07f7f" strokeWidth={4} strokeLinejoin="round" />
        </BoardLayer>
        <div className="share-zones" ref={overlay}>
          {xs.map((x, i) => (
            <Plate key={`${round}-${i}`} i={i} x={x} w={plateW} x0={i ? (xs[i - 1] + x) / 2 : 0} x1={i < n - 1 ? (x + xs[i + 1]) / 2 : 800}
              things={deal.plates[i] ?? []} thing={kit.item} lit={i === 0 ? lit : 0} disabled={busy}
              plateRef={(el) => { if (el) plates.current.set(i, el); else plates.current.delete(i) }}
              onDrop={dropOn} onTap={() => tapPlate(i)} />
          ))}
        </div>
      </Board>
      <div className="share-pile" ref={pileRef} aria-label={`${items} ${kit.plural} to share`}>
        {deal.pile.map((id, j) => (
          <Loose key={id} thing={kit.item} grab={{ id, from: 'pile' }} disabled={busy} onDrop={dropOn(id)} onTap={(el) => tapPile(id, el)}
            style={{ '--r': `${((id * 37) % 13) - 6}deg`, '--d': `${j * 45}ms` } as CSSProperties} />
        ))}
      </div>
      {cheer && <Confetti />}
    </div>
  )
}
