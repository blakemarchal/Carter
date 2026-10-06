// Clocks, coins and measuring (docs/GAME-PLAN.md §4): time to the hour and half hour, the market
// (paying with coins), and longer or shorter.
//
// Questions: read a clock ("What time is it?"), or find the clock that shows a time; count coins
// ("How much money?"), find a coin by name, or say what it's worth; and compare two or three things on a
// common start line ("Which pencil is the longest?").
// Exercises:
//   clock    the narrator says a time (sometimes a moment of the day: "Lunch is at 12 o'clock"); she
//            turns the short hand round the clock (it snaps to the hours) and lets go on the time.
//   coins    the market: a Pal sells something for up to twenty cents; she drags coins from the purse onto
//            the counter, the total is counted aloud, and a coin that makes too much is handed back.
//   measure  three pencils or flowers to stand on a shelf in order, from shortest to longest (tallest).
// The clocks, coins and measured things are drawn in src/art/items/learn-time-money.tsx.
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import type { Choice, Question } from '../../lib/questions'
import { build } from '../../lib/questions'
import type { Exercise, ExerciseView, LearnView } from '../types'
import { pick, randInt, shuffle, wait } from '../../lib/util'
import { retry, speak } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import { fly, showDrag, useDrag, useDropTarget } from '../../lib/drag'
import { useAlive } from '../../lib/useAlive'
import Pic from '../../components/Pic'
import PalArt from '../../components/PalArt'
import { PALS } from '../../data/pals'
import {
  ClockFace, Coin, COINS, clockEmoji, clockId, coinId, Flower, hourAngle, measureId, MEASURE_COLORS, MEASURE_LENGTHS,
  Pencil, Worm, type CoinKind, type MeasureColor, type MeasureKind,
} from '../../art/items/learn-time-money'
import './time-money.css'

/** How long without a move before a hand (or a glow) shows what to do next. */
const IDLE_MS = 10000

const next = (h: number) => (h % 12) + 1
const prev = (h: number) => ((h + 10) % 12) + 1
const oclock = (h: number) => `${h} o'clock`
const halfPast = (h: number) => `half past ${h}`
const timeText = (h: number, half: boolean) => (half ? halfPast(h) : oclock(h))
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// ---------- Clocks ----------

const textChoice = (s: string): Choice => ({ label: s, say: s })
const clockChoice = (h: number, half: boolean): Choice => ({ label: clockEmoji(h, half), art: clockId(h, half), say: timeText(h, half) })

/** Two other hours a child might say for h: the one before, the one after, or 12 (reading the long hand). */
function otherHours(h: number): number[] {
  const near = shuffle([prev(h), next(h)])
  return h === 12 || h === 1 || h === 11 ? near : shuffle([near[0], 12])
}

/** Level 8. Read a clock to the hour: "What time is it?" (choices like "three o'clock"). */
export function clockHourQ(theme?: string): Question {
  void theme
  const h = randInt(1, 12)
  const wrong = otherHours(h)
  if (Math.random() < 0.6) {
    return build('numbers', 'What time is it?', { kind: 'learn', view: 'clock', data: { h, m: 0 } },
      textChoice(oclock(h)), wrong.map((w) => textChoice(oclock(w))))
  }
  return build('numbers', `Which clock shows ${oclock(h)}?`, { kind: 'learn', view: 'clock-ask', data: { text: oclock(h) } },
    clockChoice(h, false), wrong.map((w) => clockChoice(w, false)))
}

/** Level 10. Read a clock to the half hour ("half past four"). */
export function halfHourQ(theme?: string): Question {
  void theme
  const h = randInt(1, 12)
  // The short hand is between h and the next hour: she might read the next one, or think it's h o'clock.
  const wrong: [number, boolean][] = [[next(h), true], Math.random() < 0.5 ? [h, false] : [next(h), false]]
  if (Math.random() < 0.65) {
    return build('numbers', 'What time is it?', { kind: 'learn', view: 'clock', data: { h, m: 30 } },
      textChoice(halfPast(h)), wrong.map(([w, half]) => textChoice(timeText(w, half))))
  }
  return build('numbers', `Which clock shows ${halfPast(h)}?`, { kind: 'learn', view: 'clock-ask', data: { text: halfPast(h) } },
    clockChoice(h, true), wrong.map(([w, half]) => clockChoice(w, half)))
}

/** A big clock (the question's picture). */
const ClockView: LearnView = ({ data }) => {
  const { h, m } = data as { h: number; m: number }
  return <svg className="tm-clock-view" viewBox="0 0 100 100" role="img" aria-label="a clock"><ClockFace h={h} m={m} /></svg>
}

/** The time asked for, written big (tap to hear it). */
const ClockAsk: LearnView = ({ data, onSay }) => {
  const { text } = data as { text: string }
  return <button className="tm-ask tm-clock-ask" onClick={() => onSay(text)}>{text}</button>
}

// ---------- Clock exercise ----------

/** Moments of the day, for setting the clock: what's said, and a picture of it. */
const MOMENTS: { id: string; h: number; line: string; pic: string }[] = [
  { id: 'wake', h: 7, line: 'The sun is up! Wake up time is at 7 o\'clock.', pic: '☀️' },
  { id: 'breakfast', h: 8, line: 'Breakfast is at 8 o\'clock. Pancakes!', pic: '🥞' },
  { id: 'singing', h: 10, line: 'Singing time is at 10 o\'clock.', pic: '🎵' },
  { id: 'lunch', h: 12, line: 'Lunch is at 12 o\'clock.', pic: '🥪' },
  { id: 'play', h: 3, line: 'Playtime is at 3 o\'clock.', pic: '⚽' },
  { id: 'snack', h: 4, line: 'Snack time is at 4 o\'clock.', pic: '🍎' },
  { id: 'dinner', h: 6, line: 'Dinner is at 6 o\'clock.', pic: '🍲' },
  { id: 'bed', h: 8, line: 'Bedtime is at 8 o\'clock.', pic: '🛏️' },
]

interface ClockEx extends Exercise { kind: 'clock'; hour: number; start: number; pic?: string }

/** Level 8. Set a clock: drag the hour hand to show a time said aloud. */
export function clockHourEx(): Exercise | null {
  const moment = Math.random() < 0.5 ? pick(MOMENTS) : null
  const hour = moment?.h ?? randInt(1, 12)
  let start = randInt(1, 12)
  while (start === hour) start = randInt(1, 12)
  const say = moment
    ? `${moment.line} Turn the short hand to ${oclock(hour)}!`
    : `Make the clock say ${oclock(hour)}! Turn the short hand.`
  const ex: ClockEx = { kind: 'clock', skill: 'numbers', say, key: `clock:${hour}:${moment?.id ?? ''}`, hour, start, pic: moment?.pic }
  return ex
}

/** The hour a hand at `deg` points to. */
const hourAt = (deg: number) => {
  const n = Math.round((((deg % 360) + 360) % 360) / 30) % 12
  return n === 0 ? 12 : n
}

function ClockPlayer({ ex, onResult }: { ex: ClockEx; onResult: (firstTry: boolean) => void }) {
  const alive = useAlive()
  const svg = useRef<SVGSVGElement>(null)
  const rot = useRef(hourAngle(ex.start))
  const [, redraw] = useState(0)
  const [misses, setMisses] = useState(0)
  const [wiggle, setWiggle] = useState(false)
  const [solved, setSolved] = useState(false)
  const [idle, setIdle] = useState(false)
  const [touched, setTouched] = useState(0)
  const done = useRef(false)
  const busy = useRef(false)
  const missCount = useRef(0)
  const hinted = useRef(false)
  const grab = useRef<{ id: number; from: number } | null>(null)

  // Quiet for a while: the number to turn to lights up.
  useEffect(() => {
    setIdle(false)
    const t = setTimeout(() => { if (!done.current) { hinted.current = true; setIdle(true) } }, IDLE_MS)
    return () => clearTimeout(t)
  }, [touched])

  /** Turns the hand to hour h, the short way round. */
  const turnTo = (h: number) => {
    const cur = rot.current
    const d = ((((hourAngle(h) - cur) % 360) + 540) % 360) - 180
    if (Math.abs(d) < 0.01) return
    rot.current = cur + d
    redraw((n) => n + 1)
  }
  /** The hour under a finger, or null near the middle (where it's unclear). */
  const hourUnder = (e: { clientX: number; clientY: number }) => {
    const el = svg.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
    if (Math.hypot(dx, dy) < r.width * 0.07) return null
    return hourAt((Math.atan2(dx, -dy) * 180) / Math.PI)
  }
  const follow = (e: { clientX: number; clientY: number }) => {
    const h = hourUnder(e)
    if (h !== null && h !== hourAt(rot.current)) {
      turnTo(h)
      sfx.pop()
    }
  }

  const check = async (h: number, from: number) => {
    if (h === ex.hour) {
      done.current = true
      setSolved(true)
      await speak(`${cap(oclock(h))}!`)
      if (alive.current) onResult(missCount.current === 0 && !hinted.current)
      return
    }
    busy.current = true
    missCount.current++
    setMisses(missCount.current)
    sfx.oops()
    setWiggle(true)
    speak(`That says ${oclock(h)}. Try again!`)
    await wait(1100)
    if (!alive.current) return
    setWiggle(false)
    turnTo(from)
    busy.current = false
  }

  const down = (e: RPointerEvent<SVGSVGElement>) => {
    if (done.current || busy.current || grab.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    e.preventDefault()
    try { svg.current?.setPointerCapture(e.pointerId) } catch { /* (not capturable) */ }
    grab.current = { id: e.pointerId, from: hourAt(rot.current) }
    setTouched((n) => n + 1)
    follow(e)
  }
  const move = (e: RPointerEvent<SVGSVGElement>) => {
    if (grab.current?.id !== e.pointerId || done.current || busy.current) return
    follow(e)
  }
  const up = (e: RPointerEvent<SVGSVGElement>) => {
    const g = grab.current
    if (g?.id !== e.pointerId) return
    grab.current = null
    if (done.current || busy.current) return
    const h = hourAt(rot.current)
    if (h !== g.from) check(h, g.from)
  }
  const cancel = (e: RPointerEvent<SVGSVGElement>) => {
    const g = grab.current
    if (g?.id !== e.pointerId) return
    grab.current = null
    if (!done.current && !busy.current) turnTo(g.from) // (the finger was taken away: put it back)
  }

  const show = misses >= 2 || idle
  return (
    <div className="tm-clock-ex">
      <svg ref={svg} viewBox="0 0 100 100" className={`tm-clock-big ${wiggle ? 'tm-wiggle' : ''} ${solved ? 'tm-solved' : ''} ${touched ? '' : 'tm-fresh'}`}
        role="img" aria-label="a clock to set"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onLostPointerCapture={cancel}>
        <ClockFace hourRot={rot.current} minuteRot={0} knob glow={show && !solved ? ex.hour : undefined}
          handStyle={{ transition: 'transform .16s ease-out' }} handClass="tm-hand" />
      </svg>
      <div className="tm-clock-side">
        {ex.pic && <span className="tm-moment"><Pic e={ex.pic} /></span>}
        <div className={`tm-time-card ${solved ? 'tm-right' : ''}`}>{oclock(ex.hour)}</div>
      </div>
    </div>
  )
}

// ---------- Coins ----------

const cents = (n: number) => `${n} ${n === 1 ? 'cent' : 'cents'}`
const centsChoice = (n: number): Choice => ({ label: `${n}¢`, say: cents(n) })
// (A picture choice's label only has to be its own; the drawing comes from `art`.)
const COIN_LABEL: Record<CoinKind, string> = { penny: '🟤', nickel: '⚪', dime: '🔘', quarter: '💿' }
const coinChoice = (k: CoinKind): Choice => ({ label: COIN_LABEL[k], art: coinId(k), say: `a ${k}` })
const BY_VALUE: CoinKind[] = ['quarter', 'dime', 'nickel', 'penny']
const total = (cs: CoinKind[]) => cs.reduce((s, c) => s + COINS[c].cents, 0)
const many = (k: CoinKind, n: number): CoinKind[] => Array(n).fill(k)

/** A handful of pennies, nickels and dimes worth up to twenty cents. */
function handful(): CoinKind[] {
  switch (randInt(0, 5)) {
    case 0: return many('penny', randInt(2, 9))
    case 1: return [...many('nickel', randInt(1, 2)), ...many('penny', randInt(1, 4))]
    case 2: return ['dime', ...many('penny', randInt(1, 6))]
    case 3: return ['dime', 'nickel', ...many('penny', randInt(0, 4))]
    case 4: return many('nickel', randInt(2, 4))
    default: return Math.random() < 0.5 ? ['dime', 'dime'] : ['dime', 'nickel', 'nickel']
  }
}

/** Level 9. Coins: "How much money?" with pennies, nickels and dimes (US coins), up to twenty cents. */
export function coinsQ(theme?: string): Question {
  void theme
  const r = Math.random()
  if (r < 0.55) {
    const coins = handful()
    const n = total(coins)
    // Wrong answers she might give: one off, five off, or counting coins instead of cents.
    const wrong = new Set<number>()
    for (const w of shuffle([coins.length, n + 1, n - 1, n + 5, n - 5])) {
      if (wrong.size < 2 && w > 0 && w !== n && w <= 25) wrong.add(w)
    }
    return build('numbers', 'How much money?', { kind: 'learn', view: 'coins', data: { coins } },
      centsChoice(n), [...wrong].map(centsChoice))
  }
  if (r < 0.82) {
    // (The quarter is a bigger coin she may know by sight; it's in sometimes, never the money to count.)
    const k = pick(BY_VALUE)
    const others = shuffle(BY_VALUE.filter((o) => o !== k && (k === 'quarter' || o !== 'quarter' || Math.random() < 0.3))).slice(0, 2)
    return build('numbers', `Which coin is a ${k}?`, { kind: 'learn', view: 'coin-ask', data: { coin: k } },
      coinChoice(k), others.map(coinChoice))
  }
  const k = pick<CoinKind>(['penny', 'nickel', 'dime'])
  return build('numbers', `How much is a ${k} worth?`, { kind: 'learn', view: 'coins', data: { coins: [k], one: true } },
    centsChoice(COINS[k].cents), [1, 5, 10].filter((v) => v !== COINS[k].cents).map(centsChoice))
}

/** A coin at its real size: `px` is the size of a 100 box (a quarter nearly fills it). */
function CoinPic({ kind, px }: { kind: CoinKind; px: number }) {
  const d = (COINS[kind].r * 2 + 4) / 100
  return (
    <svg className="tm-coin" width={px * d} height={px * d} viewBox={`${50 - 50 * d} ${50 - 50 * d} ${100 * d} ${100 * d}`} role="img" aria-label={kind}>
      <Coin kind={kind} />
    </svg>
  )
}

/** Some coins, biggest value first (the way to count them). Tap a coin to hear its name. */
const CoinsView: LearnView = ({ data, onSay }) => {
  const { coins, one } = data as { coins: CoinKind[]; one?: boolean }
  const sorted = [...coins].sort((a, b) => BY_VALUE.indexOf(a) - BY_VALUE.indexOf(b))
  return (
    <div className={`tm-coins ${one ? 'one' : ''}`}>
      {sorted.map((c, i) => (
        <button key={i} className="tm-coin-btn" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => onSay(`a ${c}`)}>
          <CoinPic kind={c} px={one ? 280 : coins.length > 6 ? 118 : 148} />
        </button>
      ))}
    </div>
  )
}

/** The coin to find, as a word (tap to hear it). */
const CoinAsk: LearnView = ({ data, onSay }) => {
  const { coin } = data as { coin: CoinKind }
  return <button className="tm-ask tm-coin-ask" onClick={() => onSay(`a ${coin}`)}>{coin}</button>
}

// ---------- The market ----------

/** What the Pals sell at the market, and for how much. */
const MARKET: { pal: string; pic: string; what: string; price: number }[] = [
  { pal: 'starling', pic: '🥕', what: 'a carrot', price: 2 },
  { pal: 'nova', pic: '🍓', what: 'a strawberry', price: 3 },
  { pal: 'basket', pic: '🍌', what: 'a banana', price: 4 },
  { pal: 'zippy', pic: '🍎', what: 'an apple', price: 6 },
  { pal: 'sprinkles', pic: '🍪', what: 'a cookie', price: 7 },
  { pal: 'crabby', pic: '🍇', what: 'some grapes', price: 8 },
  { pal: 'bubbles', pic: '🎈', what: 'a balloon', price: 10 },
  { pal: 'chilly', pic: '🧀', what: 'some cheese', price: 11 },
  { pal: 'pip', pic: '🍦', what: 'an ice cream', price: 12 },
  { pal: 'ember', pic: '🍞', what: 'a loaf of bread', price: 15 },
  { pal: 'humpy', pic: '⚽', what: 'a ball', price: 16 },
  { pal: 'lionel', pic: '🪁', what: 'a kite', price: 20 },
]

interface CoinsEx extends Exercise { kind: 'coins'; pal: string; pic: string; price: number }

/** Level 9. The market: pay for something by dragging coins onto the counter until it's the price. */
export function coinsEx(): Exercise | null {
  const m = pick(MARKET)
  const pal = PALS.find((p) => p.id === m.pal)
  if (!pal) return null
  const name = pal.stages[0].name
  const ex: CoinsEx = {
    kind: 'coins', skill: 'numbers', key: `coins:${m.pal}`, pal: m.pal, pic: m.pic, price: m.price,
    say: `${name} is selling ${m.what} for ${cents(m.price)}. Put your coins on the counter to pay!`,
  }
  return ex
}

const PURSE: CoinKind[] = ['dime', 'nickel', 'penny']

function PurseCoin({ kind, glow, disabled, onDrop, onTap }: {
  kind: CoinKind; glow: boolean; disabled: boolean; onDrop: (target: string) => boolean; onTap: (el: HTMLElement) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag<CoinKind>({ data: kind, disabled, onStart: sfx.lift, onDrop: (t) => onDrop(t), onTap: () => ref.current && onTap(ref.current) })
  return (
    <button ref={ref} type="button" className={`tm-purse-coin ${glow ? 'tm-glow' : ''}`} data-coin={kind} aria-label={kind} {...drag}>
      <CoinPic kind={kind} px={124} />
    </button>
  )
}

function CoinsPlayer({ ex, onResult }: { ex: CoinsEx; onResult: (firstTry: boolean) => void }) {
  const alive = useAlive()
  const pal = PALS.find((p) => p.id === ex.pal) ?? PALS[0]
  const [coins, setCoins] = useState<{ id: number; kind: CoinKind }[]>([])
  const [misses, setMisses] = useState(0)
  const [solved, setSolved] = useState(false)
  const [touched, setTouched] = useState(0)
  const paid = useRef<{ id: number; kind: CoinKind }[]>([])
  const done = useRef(false)
  const busy = useRef(false)
  const flying = useRef(false)
  const missCount = useRef(0)
  const hinted = useRef(false)
  const nextId = useRef(1)
  const root = useRef<HTMLDivElement>(null)
  const counterEl = useRef<HTMLDivElement | null>(null)
  const dropRef = useDropTarget('tm-counter', () => !done.current && !busy.current, 30)
  const counter = (el: HTMLDivElement | null) => { counterEl.current = el; dropRef(el) }

  const sum = total(coins.map((c) => c.kind))
  const best = PURSE.find((k) => COINS[k].cents <= ex.price - sum) ?? 'penny'

  // Quiet for a while: a hand carries the right next coin to the counter.
  useEffect(() => {
    if (done.current) return
    const t = setTimeout(() => {
      const from = root.current?.querySelector(`[data-coin="${best}"]`)
      if (!done.current && !busy.current && from && counterEl.current) {
        hinted.current = true
        showDrag(from, counterEl.current)
      }
    }, IDLE_MS)
    return () => clearTimeout(t)
  }, [touched, best])

  /** A coin goes down on the counter. Returns false if it isn't taken (finished, or busy handing one back). */
  const pay = (kind: CoinKind): boolean => {
    if (done.current || busy.current) return false
    setTouched((n) => n + 1)
    const coin = { id: nextId.current++, kind }
    paid.current = [...paid.current, coin]
    setCoins(paid.current)
    const now = total(paid.current.map((c) => c.kind))
    sfx.count(Math.min(9, paid.current.length))
    if (now < ex.price) {
      speak(`${cents(now)}.`)
    } else if (now === ex.price) {
      done.current = true
      setSolved(true)
      ;(async () => {
        await speak(`${cents(now)}. That's just right. Thank you!`)
        if (alive.current) onResult(missCount.current === 0 && !hinted.current)
      })()
    } else {
      // Too much: the Pal gently hands that coin back.
      busy.current = true
      missCount.current++
      setMisses(missCount.current)
      ;(async () => {
        await wait(450)
        if (!alive.current) return
        speak(`Oops, that's too much! Here is your ${kind} back.`)
        const el = root.current?.querySelector(`[data-paid="${coin.id}"]`)
        const home = root.current?.querySelector(`[data-coin="${kind}"]`)
        const back = el && home ? fly(el, home, { arc: 70, endScale: 1, fade: true, duration: 650 }) : Promise.resolve()
        paid.current = paid.current.filter((c) => c.id !== coin.id)
        setCoins(paid.current)
        await back
        await wait(400)
        busy.current = false
        if (alive.current) setTouched((n) => n + 1)
      })()
    }
    return true
  }

  const tap = async (kind: CoinKind, el: HTMLElement) => {
    if (done.current || busy.current || flying.current || !counterEl.current) return
    flying.current = true
    setTouched((n) => n + 1)
    await fly(el, counterEl.current, { endScale: 0.6, fade: true, duration: 450 })
    flying.current = false
    if (alive.current) pay(kind)
  }

  return (
    <div className="tm-market" ref={root}>
      <div className="tm-stall">
        <PalArt pal={pal} size={190} className={`tm-pal ${solved ? 'tm-hop' : ''}`} />
        <div className="tm-goods">
          <span className="tm-thing"><Pic e={ex.pic} /></span>
          <span className="tm-tag">{ex.price}¢</span>
        </div>
      </div>
      <div className={`tm-counter ${solved ? 'tm-paid' : ''}`} ref={counter}>
        <div className="tm-counter-coins">
          {coins.map((c) => <span key={c.id} className="tm-paid-coin" data-paid={c.id}><CoinPic kind={c.kind} px={84} /></span>)}
        </div>
        <span className="tm-total">{sum}¢</span>
      </div>
      <div className="tm-purse">
        {PURSE.map((k) => (
          <PurseCoin key={k} kind={k} glow={misses >= 2 && !solved && k === best} disabled={solved}
            onDrop={(t) => t === 'tm-counter' && pay(k)} onTap={(el) => tap(k, el)} />
        ))}
      </div>
    </div>
  )
}

// ---------- Measuring ----------

type Thing = { color: MeasureColor; len: number }
/** Picture choices' labels (each its own; the drawing comes from `art`). */
const COLOR_LABEL: Record<MeasureColor, string> = { red: '🔴', blue: '🔵', yellow: '🟡' }

/** n different lengths, at least two apart, so the difference is easy to see. */
function lengths(n: number): number[] {
  for (;;) {
    const ls = shuffle(MEASURE_LENGTHS).slice(0, n).sort((a, b) => a - b)
    if (ls.every((l, i) => i === 0 || l - ls[i - 1] >= 2)) return shuffle(ls)
  }
}

/** Level 10. Longer or shorter (taller, shorter): compare two or three things, or line them up. */
export function measureQ(theme?: string): Question {
  void theme
  const kind = pick<MeasureKind>(['pencil', 'worm', 'flower'])
  const n = Math.random() < 0.4 ? 2 : 3
  const colors = shuffle(Object.keys(MEASURE_COLORS) as MeasureColor[]).slice(0, n)
  const items: Thing[] = lengths(n).map((len, i) => ({ color: colors[i], len }))
  const most = Math.random() < 0.5
  const tall = kind === 'flower'
  const word = most ? (n === 3 ? (tall ? 'the tallest' : 'the longest') : (tall ? 'taller' : 'longer')) : (n === 3 ? 'the shortest' : 'shorter')
  const sorted = [...items].sort((a, b) => a.len - b.len)
  const right = most ? sorted[n - 1] : sorted[0]
  const choice = (t: Thing): Choice => ({ label: COLOR_LABEL[t.color], art: measureId(kind, t.color, t.len), say: `the ${t.color} ${kind}` })
  return build('numbers', `Which ${kind} is ${word}?`, { kind: 'learn', view: 'measure', data: { kind, items } },
    choice(right), items.filter((t) => t !== right).map(choice))
}

/** Two or three things on a common start line: lying ones in rows from a line, flowers on the ground. */
const MeasureView: LearnView = ({ data, onSay }) => {
  const { kind, items } = data as { kind: MeasureKind; items: Thing[] }
  if (kind === 'flower') {
    const w = items.length * 30 + 10
    return (
      <svg className="tm-measure tm-measure-tall" viewBox={`0 0 ${w} 100`} style={{ '--n': items.length } as CSSProperties} role="img" aria-label="flowers">
        <rect x={0} y={93} width={w} height={6} rx={3} fill="#8fd17a" stroke="#5fae4c" strokeWidth={1} />
        {items.map((t, i) => (
          <g key={i} onClick={() => onSay(`the ${t.color} flower`)}>
            <Flower x={20 + i * 30} base={94} h={t.len * 10} color={MEASURE_COLORS[t.color]} />
          </g>
        ))}
      </svg>
    )
  }
  const row = 24
  const h = items.length * row + 4
  const Draw = kind === 'worm' ? Worm : Pencil
  return (
    <svg className="tm-measure tm-measure-long" viewBox={`0 0 100 ${h}`} style={{ '--n': items.length } as CSSProperties} role="img" aria-label={`${kind}s`}>
      <line x1={4.3} y1={1} x2={4.3} y2={h - 1} stroke="#9a88ab" strokeWidth={1} strokeDasharray="2.5 2" />
      {items.map((t, i) => (
        <g key={i} onClick={() => onSay(`the ${t.color} ${kind}`)}>
          <Draw x={5} y={i * row + 2 + row / 2} len={t.len * 10} color={MEASURE_COLORS[t.color]} />
        </g>
      ))}
    </svg>
  )
}

// ---------- Measuring exercise ----------

type StandKind = 'pencil' | 'flower'
interface MeasureEx extends Exercise { kind: 'measure'; thing: StandKind; items: Thing[] }

/** Level 10. Measuring: put things in order from shortest to longest (or tallest). */
export function measureEx(): Exercise | null {
  const thing = pick<StandKind>(['pencil', 'flower'])
  const colors = shuffle(Object.keys(MEASURE_COLORS) as MeasureColor[])
  const items = lengths(3).map((len, i) => ({ color: colors[i], len }))
  const say = thing === 'pencil'
    ? 'Put the pencils in order, from the shortest to the longest!'
    : 'Put the flowers in order, from the shortest to the tallest!'
  const ex: MeasureEx = { kind: 'measure', skill: 'numbers', say, key: `measure:${thing}:${items.map((t) => t.len).join('')}`, thing, items }
  return ex
}

/** A pencil or flower standing up, drawn to scale (a 100 box is the tallest it can be). */
function Standing({ thing, t }: { thing: StandKind; t: Thing }) {
  return (
    <svg className="tm-stand" viewBox="0 0 32 100" role="img" aria-label={`${t.color} ${thing}`}>
      {thing === 'flower'
        ? <Flower x={14} base={96} h={t.len * 10} color={MEASURE_COLORS[t.color]} />
        : <g transform="translate(16 97) rotate(-90)"><Pencil x={0} y={0} len={t.len * 10} color={MEASURE_COLORS[t.color]} /></g>}
    </svg>
  )
}

function TrayThing({ i, thing, t, glow, wiggle, onDrop, onTap }: {
  i: number; thing: StandKind; t: Thing; glow: boolean; wiggle: boolean; onDrop: (target: string) => boolean; onTap: (el: HTMLElement) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag<number>({ data: i, onStart: sfx.lift, onDrop: (target) => onDrop(target), onTap: () => ref.current && onTap(ref.current) })
  return (
    <button ref={ref} type="button" className={`tm-thing-btn ${glow ? 'tm-glow' : ''} ${wiggle ? 'tm-wiggle' : ''}`} data-thing={i} {...drag}>
      <Standing thing={thing} t={t} />
    </button>
  )
}

function Slot({ i, filled, glow, children }: { i: number; filled: boolean; glow: boolean; children?: ReactNode }) {
  const ref = useDropTarget(`tm-slot-${i}`, () => !filled, 16)
  return <div ref={ref} className={`tm-slot ${filled ? 'filled' : ''} ${glow ? 'tm-glow' : ''}`} data-slot={i}>{children}</div>
}

function MeasurePlayer({ ex, onResult }: { ex: MeasureEx; onResult: (firstTry: boolean) => void }) {
  const alive = useAlive()
  const order = [...ex.items.keys()].sort((a, b) => ex.items[a].len - ex.items[b].len) // the thing for each slot
  const [placed, setPlaced] = useState<(number | null)[]>([null, null, null])
  const [misses, setMisses] = useState(0)
  const [wiggle, setWiggle] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)
  const [touched, setTouched] = useState(0)
  const slots = useRef<(number | null)[]>([null, null, null])
  const done = useRef(false)
  const flying = useRef(false)
  const missCount = useRef(0)
  const hinted = useRef(false)
  const root = useRef<HTMLDivElement>(null)

  const nextSlot = placed.findIndex((s) => s === null)
  const nextThing = nextSlot >= 0 ? order[nextSlot] : -1

  // Quiet for a while: a hand carries the next one to its place.
  useEffect(() => {
    if (done.current || nextSlot < 0) return
    const t = setTimeout(() => {
      const from = root.current?.querySelector(`[data-thing="${nextThing}"]`)
      const to = root.current?.querySelector(`[data-slot="${nextSlot}"]`)
      if (!done.current && !flying.current && from && to) {
        hinted.current = true
        showDrag(from, to)
      }
    }, IDLE_MS)
    return () => clearTimeout(t)
  }, [touched, nextThing, nextSlot])

  /** Thing i goes to slot s: in it goes if that's its place, or it wiggles back. */
  const put = (i: number, s: number): boolean => {
    if (done.current || s < 0 || slots.current[s] !== null || slots.current.includes(i)) return false
    setTouched((n) => n + 1)
    if (order[s] !== i) {
      missCount.current++
      setMisses(missCount.current)
      sfx.oops()
      speak(retry())
      setWiggle(i)
      setTimeout(() => { if (alive.current) setWiggle((w) => (w === i ? null : w)) }, 600)
      return false
    }
    slots.current = slots.current.map((x, k) => (k === s ? i : x))
    setPlaced(slots.current)
    sfx.count(s + 2)
    if (slots.current.every((x) => x !== null)) {
      done.current = true
      setSolved(true)
      ;(async () => {
        await wait(300)
        await speak(ex.thing === 'pencil' ? 'Short, longer, longest!' : 'Short, taller, tallest!')
        if (alive.current) onResult(missCount.current === 0 && !hinted.current)
      })()
    }
    return true
  }

  // A tap puts it in the first empty spot (if it goes there), the same as dragging it there.
  const tap = async (i: number, el: HTMLElement) => {
    if (done.current || flying.current) return
    const s = slots.current.findIndex((x) => x === null)
    const to = root.current?.querySelector(`[data-slot="${s}"]`)
    if (s < 0 || !to) return
    if (order[s] !== i) { put(i, s); return }
    flying.current = true
    const going = fly(el, to, { endScale: 1, fade: false, duration: 420 })
    el.style.opacity = '0'
    await going
    el.style.opacity = ''
    flying.current = false
    if (alive.current) put(i, s)
  }

  const show = misses >= 2 && !solved
  return (
    <div className={`tm-measure-ex ${solved ? 'tm-solved' : ''}`} ref={root}>
      <div className="tm-shelf">
        {placed.map((p, s) => (
          <Slot key={s} i={s} filled={p !== null} glow={show && s === nextSlot}>
            {p !== null && <Standing thing={ex.thing} t={ex.items[p]} />}
          </Slot>
        ))}
      </div>
      <svg className="tm-grow" viewBox="0 0 300 24" aria-hidden><path d="M12 20 L288 4 L288 20 Z" fill="#ffd34d" stroke="#d9a12a" strokeWidth={2} strokeLinejoin="round" /></svg>
      <div className="tm-tray">
        {ex.items.map((t, i) => (placed.includes(i)
          ? <div key={i} className="tm-thing-btn tm-gone" />
          : <TrayThing key={i} i={i} thing={ex.thing} t={t} glow={show && i === nextThing} wiggle={wiggle === i}
              onDrop={(target) => target.startsWith('tm-slot-') && put(i, Number(target.slice(8)))} onTap={(el) => tap(i, el)} />))}
      </div>
    </div>
  )
}

/** Pictures for these questions' `learn` visuals. */
export const VIEWS: Record<string, LearnView> = {
  clock: ClockView, 'clock-ask': ClockAsk, coins: CoinsView, 'coin-ask': CoinAsk, measure: MeasureView,
}
/** The components that play these exercises, by `kind`. */
export const EXERCISES: Record<string, ExerciseView> = {
  clock: ClockPlayer as ExerciseView, coins: CoinsPlayer as ExerciseView, measure: MeasurePlayer as ExerciseView,
}
