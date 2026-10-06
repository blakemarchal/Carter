// Number questions beyond the first five levels (docs/GAME-PLAN.md §4): shapes, counting to twenty,
// more or fewer, patterns, adding and taking away within twenty, tens and ones, and the number line hop.
// Shapes and tens-and-ones choices are drawn items (src/art/items/learn-numbers.tsx); the pictures
// inside questions are this module's VIEWS, and the number line hop is its one exercise.
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import type { Choice, Question } from '../../lib/questions'
import { build, nearby, numChoice } from '../../lib/questions'
import { pick, randInt, shuffle, wait } from '../../lib/util'
import { speak } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import { useAlive } from '../../lib/useAlive'
import { useProgress } from '../../lib/progress'
import { palById, stageFor } from '../../data/pals'
import Pic from '../../components/Pic'
import PalArt from '../../components/PalArt'
import { BaseTen, baseTenWidth, COLORS, SHAPES, ShapeArt, TENS_RANGE, type ColorName, type ShapeName } from '../../art/items/learn-numbers'
import type { Exercise, ExerciseView, LearnView } from '../types'
import './numbers.css'

/** Things to count when the round has no theme (the same ones the first number questions use). */
const ANIMALS = ['🐑', '🐟', '🦆', '🐞', '⭐', '🍎', '🐸', '🐣']
const COLOR_NAMES = Object.keys(COLORS) as ColorName[]
const shapeArt = (shape: ShapeName, color: ColorName) => `shape-${shape}-${color}`
const a = (shape: ShapeName) => (shape === 'oval' ? 'an oval' : `a ${shape}`)

// ---------- Level 1: shapes ----------

/** The six first shapes; oval and diamond come in now and then. */
const FIRST_SHAPES: ShapeName[] = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart']
/** Shapes that would also be right (a square is a rectangle, and a diamond too), so never wrong choices. */
const ALSO: Partial<Record<ShapeName, ShapeName[]>> = { rectangle: ['square'], diamond: ['square'], oval: ['circle'] }

/** Level 1. Shapes: "Which one is a triangle?" (circle, square, triangle, rectangle, star, heart…). */
export function shapesQ(_theme?: string): Question {
  const late = Math.random() < 0.25
  const shape = late ? pick<ShapeName>(['oval', 'diamond']) : pick(FIRST_SHAPES)
  const pool = (late ? SHAPES : FIRST_SHAPES).filter((s) => s !== shape && !ALSO[shape]?.includes(s))
  const others = shuffle(pool).slice(0, 2)
  const colors = shuffle(COLOR_NAMES)
  const choice = (s: ShapeName, i: number): Choice => ({ label: s, art: shapeArt(s, colors[i]), say: s })
  const say = `Which one is ${a(shape)}?`
  return build('numbers', say, { kind: 'learn', view: 'num-word', data: { word: shape, say } },
    choice(shape, 0), others.map((s, i) => choice(s, i + 1)))
}

// ---------- Level 2: counting to twenty ----------

/**
 * Level 2. Count up to twenty things (in rows of five or ten, so they can be counted).
 * (The `emoji` visual lays eleven or more things out in rows of ten, a gap after each five: numbers.css.)
 */
export function countTo20Q(theme?: string): Question {
  const n = randInt(11, 20)
  const thing = theme ?? pick(ANIMALS)
  return build('numbers', 'How many? Count them!', { kind: 'emoji', items: Array(n).fill(thing) },
    numChoice(n), nearby(n, 2, [1, -1, 2, -2]).map(numChoice))
}

// ---------- Level 3: more or fewer ----------

/** Level 3. More or fewer: two groups, "Which has more?" / "Which has fewer?". She taps a group. */
export function moreFewerQ(theme?: string): Question {
  const thing = theme ?? pick(ANIMALS)
  const x = randInt(2, 10)
  let y = randInt(2, 10)
  while (y === x) y = randInt(2, 10)
  const more = Math.random() < 0.5
  const [right, wrong] = (more ? x > y : x < y) ? [x, y] : [y, x]
  const word = more ? 'more' : 'fewer'
  const say = `Which has ${word}?`
  const group = (n: number, has: string): Choice => ({ label: thing.repeat(n), say: `This one has ${has}` })
  return build('numbers', say, { kind: 'learn', view: 'num-word', data: { word, say, mark: 'mf' } },
    group(right, word), [group(wrong, more ? 'fewer' : 'more')])
}

// ---------- Level 5: patterns ----------

interface Cell { shape: ShapeName; color: ColorName; say: string }

/** Level 5. Patterns: "red, blue, red, blue, …what comes next?" (colors, shapes, then ABB/AAB). */
export function patternQ(_theme?: string): Question {
  const r = Math.random()
  const kind = r < 0.4 ? 'colors' : r < 0.7 ? 'shapes' : 'triple'
  const unit = kind === 'triple' ? pick(['AAB', 'ABB']) : 'AB'
  const byColor = kind === 'colors' || (kind === 'triple' && Math.random() < 0.5)
  let options: Cell[]
  if (byColor) {
    const shape = pick<ShapeName>(['circle', 'square', 'heart', 'star'])
    options = shuffle(COLOR_NAMES).slice(0, 3).map((color) => ({ shape, color, say: color }))
  } else {
    const color = pick(COLOR_NAMES)
    options = shuffle<ShapeName>(['circle', 'square', 'triangle', 'star', 'heart']).slice(0, 3).map((shape) => ({ shape, color, say: shape }))
  }
  const [A, B] = options
  const seq = unit.split('').map((ch) => (ch === 'A' ? A : B))
  // Two whole repeats at least, then a few more, then the gap.
  const shown = seq.length * 2 + randInt(0, seq.length === 2 ? 2 : 1)
  const cells = Array.from({ length: shown }, (_, i) => seq[i % seq.length])
  const next = seq[shown % seq.length]
  const choice = (c: Cell): Choice => ({ label: c.say, art: shapeArt(c.shape, c.color), say: c.say })
  return build('numbers', 'Look at the pattern. What comes next?', { kind: 'learn', view: 'num-pattern', data: { cells } },
    choice(next), options.filter((o) => o !== next).map(choice))
}

// ---------- Level 6: adding and taking away within twenty ----------

interface Frames { a: number; b: number; op: '+' | '-'; thing?: string }

/** Level 6. Adding and taking away within twenty, shown on ten-frames. */
export function within20Q(theme?: string): Question {
  const plus = Math.random() < 0.5
  let x: number, y: number
  if (plus) {
    x = randInt(3, 12)
    y = randInt(2, Math.min(9, 20 - x))
  } else {
    x = randInt(8, 20)
    y = randInt(2, Math.min(9, x - 1))
  }
  const ans = plus ? x + y : x - y
  const say = plus ? `${x} plus ${y}. How many in all?` : `${x} take away ${y}. How many are left?`
  const data: Frames = { a: x, b: y, op: plus ? '+' : '-', thing: theme }
  return build('numbers', say, { kind: 'learn', view: 'num-frames', data },
    numChoice(ans), nearby(ans, 2, [1, -1, 2, -2]).map(numChoice))
}

// ---------- Level 7: tens and ones ----------

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** Level 7. Tens and ones: bundles of ten and loose ones, "How many in all?" (and the reverse). */
export function tensOnesQ(_theme?: string): Question {
  if (Math.random() < 0.6) {
    const t = randInt(1, 9), o = randInt(0, 9)
    const n = t * 10 + o
    const near = [o >= 1 && o !== t ? o * 10 + t : 0, n + 10, n - 10, n + 1, n - 1, n + 2]
      .filter((v, i, all) => v >= 10 && v <= 99 && v !== n && all.indexOf(v) === i)
    const wrong = [near[0], ...shuffle(near.slice(1))].slice(0, 2)
    return build('numbers', `${plural(t, 'ten', 'tens')} and ${plural(o, 'one', 'ones')}. How many in all?`,
      { kind: 'learn', view: 'num-tens', data: { tens: t, ones: o } }, numChoice(n), wrong.map(numChoice))
  }
  // The reverse: "Which one shows 34?", with pictures of tens and ones to choose from.
  const [t0, t1] = TENS_RANGE.tens, [o0, o1] = TENS_RANGE.ones
  const t = randInt(t0, t1), o = randInt(o0, o1)
  const ok = ([tt, oo]: number[]) => tt >= t0 && tt <= t1 && oo >= o0 && oo <= o1
  const swap = o !== t && ok([o, t]) ? [[o, t]] : []
  const rest = shuffle([[t + 1, o], [t - 1, o], [t, o + 1], [t, o - 1]].filter(ok))
  const wrong = [...swap, ...rest].slice(0, 2)
  const choice = ([tt, oo]: number[]): Choice => ({ label: String(tt * 10 + oo), art: `tens-${tt}-${oo}`, say: String(tt * 10 + oo) })
  const n = t * 10 + o
  return build('numbers', `Which one shows ${n}?`, { kind: 'learn', view: 'num-big', data: { n, say: `Which one shows ${n}?` } },
    choice([t, o]), wrong.map(choice))
}

// ---------- Views ----------

/** A word to go with the question ("triangle", "more"): tap it to hear the question again. */
const WordView: LearnView = ({ data, onSay }) => {
  const { word, say, mark } = data as { word: string; say: string; mark?: string }
  return <button className={`nm-word ${mark ? `nm-${mark}` : ''}`} onClick={() => onSay(say)}>{word}</button>
}

/** A big number ("Which one shows 34?"). */
const BigView: LearnView = ({ data, onSay }) => {
  const { n, say } = data as { n: number; say: string }
  return <button className="nm-big" onClick={() => onSay(say)}>{n}</button>
}

/** A row of shapes with the next one missing; tap one to hear it. */
const PatternView: LearnView = ({ data, onSay }) => {
  const { cells } = data as { cells: Cell[] }
  const W = 104
  return (
    <svg className="nm-pattern" viewBox={`0 0 ${(cells.length + 1) * W} ${W}`} role="img" aria-label="pattern">
      {cells.map((c, i) => (
        <g key={i} className="nm-pat-cell" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => onSay(c.say)}>
          <rect x={i * W + 2} y={2} width={W - 4} height={W - 4} rx={18} fill="#fff" />
          <svg x={i * W + 12} y={12} width={W - 24} height={W - 24} viewBox="0 0 100 100"><ShapeArt shape={c.shape} color={COLORS[c.color]} /></svg>
        </g>
      ))}
      <g className="nm-pat-gap" onClick={() => onSay('What comes next?')}>
        <rect x={cells.length * W + 4} y={4} width={W - 8} height={W - 8} rx={18} fill="#fff8d6" stroke="#f0b400" strokeWidth={4} strokeDasharray="10 8" />
        <text x={cells.length * W + W / 2} y={W / 2 + 22} textAnchor="middle" fontSize={62} fontWeight={800} fill="#e09a00">?</text>
      </g>
    </svg>
  )
}

/** A counter for a ten-frame: a shiny dot, or the round's theme. */
function Counter({ thing, second }: { thing?: string; second: boolean }) {
  if (thing) return <Pic e={thing} />
  const c = second ? '#ffcf3a' : '#ff5a5f'
  return (
    <svg className="pic" viewBox="0 0 100 100" aria-hidden>
      <circle cx={50} cy={50} r={42} fill={c} stroke={second ? '#c99400' : '#c23a3f'} strokeWidth={6} />
      <ellipse cx={36} cy={34} rx={13} ry={8} fill="#fff" opacity={0.5} transform="rotate(-30 36 34)" />
    </svg>
  )
}

/** Ten-frames for a sum or a take-away: the second group in its own color, the taken-away ones crossed out. */
const FramesView: LearnView = ({ data, onSay }) => {
  const { a: x, b: y, op, thing } = data as Frames
  const filled = op === '+' ? x + y : x
  const frames = filled > 10 ? 2 : 1
  const cell = (i: number) => {
    if (i >= filled) return <span key={i} className="nm-cell" />
    const second = op === '+' && i >= x
    const gone = op === '-' && i >= x - y
    return (
      <span key={i} className={`nm-cell full ${second ? 'second' : ''} ${gone ? 'gone' : ''}`} style={{ animationDelay: `${i * 0.04}s` }}>
        <Counter thing={thing} second={second} />
      </span>
    )
  }
  return (
    <div className="nm-frames-wrap">
      <div className="nm-frames">
        {Array.from({ length: frames }, (_, f) => (
          <div key={f} className="nm-frame" onClick={() => onSay(String(Math.min(10, filled - f * 10)))}>
            {Array.from({ length: 10 }, (_, i) => cell(f * 10 + i))}
          </div>
        ))}
      </div>
      <div className="nm-eq">{x} {op === '+' ? '+' : '−'} {y} = <b>?</b></div>
    </div>
  )
}

/** Rods of ten and loose ones. */
const TensView: LearnView = ({ data, onSay }) => {
  const { tens, ones } = data as { tens: number; ones: number }
  const s = 30
  const w = baseTenWidth(tens, ones) * s
  return (
    <svg className="nm-tens" viewBox={`-6 -6 ${w + 12} ${10 * s + 12}`} role="img" aria-label={`${tens} tens and ${ones} ones`}
      onClick={() => onSay(`${plural(tens, 'ten', 'tens')} and ${plural(ones, 'one', 'ones')}`)}>
      <BaseTen tens={tens} ones={ones} x={0} y={0} s={s} />
    </svg>
  )
}

/** Pictures for these questions' `learn` visuals. */
export const VIEWS: Record<string, LearnView> = {
  'num-word': WordView,
  'num-big': BigView,
  'num-pattern': PatternView,
  'num-frames': FramesView,
  'num-tens': TensView,
}

// ---------- Level 6 exercise: the number line hop ----------

export interface NumberLineExercise extends Exercise {
  kind: 'numberline'
  /** Where the Pal stands to begin with. */
  start: number
  /** How many hops, and which way (+1 adds, -1 takes away). */
  hops: number
  dir: 1 | -1
}

/** Level 6. Number line hop: hop a Pal along a line from 0 to 20 to show a sum or a take-away. */
export function numberLineEx(): Exercise | null {
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
  const start = dir > 0 ? randInt(1, 14) : randInt(6, 20)
  const hops = dir > 0 ? randInt(2, Math.min(8, 20 - start)) : randInt(2, Math.min(8, start - 1))
  const say = dir > 0 ? `${start} plus ${hops}. Hop forward ${hops} times!` : `${start} take away ${hops}. Hop back ${hops} times!`
  const ex: NumberLineExercise = { kind: 'numberline', skill: 'numbers', say, key: `nl:${start}:${dir}:${hops}`, start, hops, dir }
  return ex
}

// The line, in the svg's own units.
const VBW = 1060, VBH = 300, X0 = 40, STEP = 49, LINE_Y = 226
const X = (n: number) => X0 + n * STEP
const PAL = 172
const HOP_MS = 340
const clamp = (n: number) => Math.max(0, Math.min(20, n))
const range = (from: number, to: number) => {
  const d = to >= from ? 1 : -1
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * d)
}

/** A big arrow that hops one way. */
function HopArrow({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 120 80" aria-hidden className="nm-arrow">
      <g transform={dir < 0 ? 'translate(120 0) scale(-1 1)' : undefined}>
        <path d="M14 66 Q52 0 96 50" fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" />
        <path d="M80 50 L104 64 L106 36 Z" fill="#fff" stroke="#fff" strokeWidth={6} strokeLinejoin="round" />
        <circle cx={14} cy={66} r={8} fill="#fff" />
      </g>
    </svg>
  )
}

function NumberLinePlayer({ ex, onResult }: { ex: NumberLineExercise; onResult: (firstTry: boolean) => void }) {
  const { start, hops, dir } = ex
  const goal = start + dir * hops
  const p = useProgress()
  const pal = palById(p.battler ?? p.starter ?? 'zippy')
  const stage = stageFor(pal, p.pals[pal.id] ?? 0)

  const [pos, setPos] = useState(start)
  const [dragAt, setDragAt] = useState<number | null>(null) // where the Pal is while she drags it (between numbers)
  const [hopId, setHopId] = useState(0)
  const [misses, setMisses] = useState(0)
  const [wiggle, setWiggle] = useState<number | null>(null)
  const [landed, setLanded] = useState(false)
  const posRef = useRef(start)
  const busy = useRef(false)
  const done = useRef(false)
  const missRef = useRef(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragOff = useRef<(() => void) | null>(null)
  const alive = useAlive()
  useEffect(() => () => dragOff.current?.(), [])

  const moveTo = (n: number) => { posRef.current = n; setPos(n) }
  const miss = () => { missRef.current++; setMisses(missRef.current) }

  const finish = async () => {
    if (done.current) return
    done.current = true
    busy.current = true
    setLanded(true)
    await wait(HOP_MS)
    if (!alive.current) return
    await speak(`You landed on ${goal}!`)
    if (alive.current) onResult(missRef.current === 0)
  }

  /** One hop (a tap on an arrow). */
  const hop = async (d: 1 | -1) => {
    if (busy.current || done.current) return
    if (d !== dir) {
      sfx.oops()
      miss()
      setWiggle(d)
      setTimeout(() => setWiggle(null), 600)
      speak(dir > 0 ? "We're adding, so hop forward!" : "We're taking away, so hop back!")
      return
    }
    busy.current = true
    const next = posRef.current + d
    moveTo(next)
    setHopId((h) => h + 1)
    sfx.count(Math.abs(next - start))
    speak(String(Math.abs(next - start)))
    await wait(HOP_MS)
    if (!alive.current) return
    if (next === goal) finish()
    else busy.current = false
  }

  /** Back to `to`, one gentle hop at a time, counting the numbers on the way. */
  const hopBack = async (from: number, to: number) => {
    busy.current = true
    await speak(dir * (from - goal) > 0 ? "Oops, too far! Let's count back." : dir > 0 ? "Oops! We're adding, so we hop forward." : "Oops! We're taking away, so we hop back.")
    for (const n of range(from, to).slice(1)) {
      if (!alive.current) return
      moveTo(n)
      setHopId((h) => h + 1)
      speak(String(n))
      await wait(HOP_MS + 260)
    }
    if (alive.current) busy.current = false
  }

  // Dragging the Pal along the line: it snaps to each number it passes, counting the hops.
  const onPalDown = (e: RPointerEvent<SVGGElement>) => {
    if (busy.current || done.current || dragOff.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    const svg = svgRef.current
    if (!svg) return
    const id = e.pointerId
    const x0 = e.clientX, y0 = e.clientY
    const from = posRef.current
    let moved = false
    let at = from
    const toNumber = (clientX: number) => {
      const r = svg.getBoundingClientRect()
      return Math.max(-0.3, Math.min(20.3, from + ((clientX - x0) / r.width) * VBW / STEP))
    }
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return
      if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return
      moved = true
      ev.preventDefault()
      const f = toNumber(ev.clientX)
      setDragAt(f)
      const n = clamp(Math.round(f))
      if (n !== at) {
        at = n
        moveTo(n)
        if (n !== start) {
          sfx.count(Math.abs(n - start))
          speak(String(Math.abs(n - start)))
        }
      }
    }
    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return
      off()
      setDragAt(null)
      if (!moved) {
        // A tap on the Pal: a little hop on the spot, and what to do.
        setHopId((h) => h + 1)
        if (ev.type === 'pointerup') speak(ex.say)
        return
      }
      const n = clamp(Math.round(toNumber(ev.clientX)))
      moveTo(n)
      if (ev.type !== 'pointerup') { if (n !== from) hopBack(n, from); return } // (cancelled: just go back)
      if (n === goal) { finish(); return }
      const onTheWay = dir * (n - start) >= 0 && dir * (goal - n) > 0
      if (onTheWay) return // fine so far: keep hopping from here
      sfx.oops()
      miss()
      hopBack(n, from)
    }
    const off = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      dragOff.current = null
    }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    dragOff.current = off
  }

  const count = Math.abs(pos - start)
  const trail = range(start, pos)
  const palX = X(dragAt ?? pos)
  return (
    <div className="nm-line" data-start={start} data-goal={goal}>
      <svg ref={svgRef} className="nm-line-svg" viewBox={`0 0 ${VBW} ${VBH}`} role="img" aria-label="number line">
        {/* the hops so far */}
        {trail.slice(1).map((n, i) => {
          const x1 = X(trail[i]), x2 = X(n), mid = (x1 + x2) / 2
          return <path key={`${i}-${n}`} className="nm-arc" d={`M${x1} ${LINE_Y - 4} Q${mid} ${LINE_Y - 62} ${x2} ${LINE_Y - 4}`}
            fill="none" stroke={dir > 0 ? '#3fbf6a' : '#ff8a3c'} strokeWidth={6} strokeLinecap="round" />
        })}
        <line x1={X(0) - 18} x2={X(20) + 18} y1={LINE_Y} y2={LINE_Y} stroke="#6d3fd1" strokeWidth={7} strokeLinecap="round" />
        {range(0, 20).map((n) => {
          const mark = landed && n === goal ? 'goal' : n === start ? 'start' : ''
          return (
            <g key={n} className={`nm-tick ${mark}`}>
              <line x1={X(n)} x2={X(n)} y1={LINE_Y - 12} y2={LINE_Y + 12} stroke="#6d3fd1" strokeWidth={n % 5 ? 4 : 6} strokeLinecap="round" />
              {mark && <circle cx={X(n)} cy={LINE_Y + 46} r={23} fill={mark === 'goal' ? '#3fbf6a' : '#ffd23f'} />}
              <text x={X(n)} y={LINE_Y + 56} textAnchor="middle" fontSize={n === pos || mark ? 30 : 26} fontWeight={800}
                fill={mark === 'goal' ? '#fff' : n === pos ? '#e0457b' : '#4a3a6a'}>{n}</text>
            </g>
          )
        })}
        {/* the Pal: drag it, or tap the arrows */}
        <g className={`nm-pal ${dragAt !== null ? 'dragging' : ''}`} style={{ transform: `translate(${palX - PAL / 2}px, ${LINE_Y - PAL * 0.89}px)` }}
          onPointerDown={onPalDown}>
          <rect x={0} y={0} width={PAL} height={PAL} fill="transparent" />
          <g key={hopId} className={hopId ? 'nm-hop' : ''}>
            <PalArt pal={pal} stage={stage} size={PAL} />
          </g>
          {count > 0 && (
            <g className="nm-count" key={`c${count}`}>
              <circle cx={PAL / 2} cy={4} r={26} fill="#fff" stroke={dir > 0 ? '#3fbf6a' : '#ff8a3c'} strokeWidth={5} />
              <text x={PAL / 2} y={15} textAnchor="middle" fontSize={30} fontWeight={800} fill="#4a3a6a">{count}</text>
            </g>
          )}
        </g>
      </svg>
      <div className="nm-hops">
        {([-1, 1] as const).map((d) => (
          <button key={d} aria-label={d > 0 ? 'Hop forward' : 'Hop back'}
            className={`nm-hop-btn ${d > 0 ? 'fwd' : 'back'} ${wiggle === d ? 'wiggle' : ''} ${misses >= 2 && d === dir && !landed ? 'glow' : ''}`}
            onClick={() => hop(d)}>
            <HopArrow dir={d} />
          </button>
        ))}
      </div>
    </div>
  )
}

/** The components that play these exercises, by `kind`. */
export const EXERCISES: Record<string, ExerciseView> = {
  numberline: NumberLinePlayer as ExerciseView,
}
