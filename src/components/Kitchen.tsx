// Pal Kitchen: cook a Pal's favorite food, one step at a time (see data/recipes.ts), then serve it.
// Hands-on: drag ingredients into the bowl (and back out), drag the right fruit into a pattern, stir
// with a wooden spoon that follows her finger, slide the tray into the oven, and carry the food over
// to her Pal. A tap still works for every one of them, so nothing ever gets stuck.
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import DressedPal from './DressedPal'
import { CandlesOnCake } from './PartyCake'
import { MixingBowl, StirBowl, bowlSlot, type Batter } from './Bowl'
import { BackButton, BigButton, Confetti } from './ui'
import { FRUIT_COLOR, stageFor, type PalDef } from '../data/pals'
import { recipeFor, type CookStep, type Recipe } from '../data/recipes'
import { playerName, useProgress } from '../lib/progress'
import { serve } from '../lib/kitchen'
import { praise, retry, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { fly, showDrag, useDrag, useDropTarget } from '../lib/drag'
import { shuffle, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

type Done = () => void

/** Whether this kitchen visit has shown how to drag yet (once is enough; after that a tap just hops it in). */
let showedHow = false

/** What the batter looks like for each recipe that gets stirred (`keep`: the pieces stay chunky). */
const BATTER: Record<string, Batter> = {
  pancakes: { base: '#f4e4b0', done: '#f6d47a' },
  cookies: { base: '#ecd2a2', done: '#d9a866', keep: true },
  smoothie: { base: '#f8e8f0', done: '#c77fcd' },
  salad: { base: '#fff4dc', done: '#ffe7b5', keep: true },
  soup: { base: '#f9c27e', done: '#e8653d', keep: true },
  cake: { base: '#fff1d6', done: '#ffd2e4' },
}

// ---------- add: drag ingredients into the bowl ----------

function PileItem({ emoji, onIn, onTap }: { emoji: string; onIn: () => boolean; onTap: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag({ data: 'in', onStart: sfx.lift, onDrop: (t) => t === 'bowl' && onIn(), onTap: () => ref.current && onTap(ref.current) })
  return <button ref={ref} className="k-thing" aria-label={`Drag ${emoji} into the bowl`} {...drag}>{emoji}</button>
}

function BowlItem({ emoji, i, onOut, onTap }: { emoji: string; i: number; onOut: () => boolean; onTap: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLSpanElement>(null)
  const slot = bowlSlot(i)
  const drag = useDrag({ data: 'out', onStart: sfx.lift, onDrop: (t) => t === 'pile' && onOut(), onTap: () => ref.current && onTap(ref.current) })
  return <span ref={ref} className="bowl-item" style={{ left: slot.left, top: slot.top, zIndex: slot.z }} {...drag}>{emoji}</span>
}

/** Count ingredients into the bowl: drag them in (or out again), then Done. */
function AddStep({ step, onDone }: { step: Extract<CookStep, { kind: 'add' }>; onDone: Done }) {
  const { item, n } = step
  const [st, setSt] = useState(() => ({ pile: Array.from({ length: n + 3 }, (_, i) => i), bowl: [] as number[] }))
  const cur = useRef(st)
  const commit = (s: typeof st) => { cur.current = s; setSt(s) }
  const busy = useRef(false)
  const bowl = useRef<HTMLDivElement>(null)
  const pileBox = useRef<HTMLDivElement | null>(null)
  const bowlTarget = useDropTarget('bowl', (d) => d === 'in')
  const pileTarget = useDropTarget('pile', (d) => d === 'out', 90)
  const pileRef = useCallback((el: HTMLDivElement | null) => { pileBox.current = el; pileTarget(el) }, [pileTarget])
  const say = (k: number) => (k === 1 ? item.say : item.plural)
  const ask = () => speak(`Put ${n} ${say(n)} in the bowl!`)
  useEffect(() => { ask() }, [])

  const jiggle = () => bowl.current?.animate([{ scale: '1' }, { scale: '1.04 .95' }, { scale: '.98 1.03' }, { scale: '1' }], { duration: 380, easing: 'ease-out' })
  const putIn = (id: number) => {
    if (busy.current || !cur.current.pile.includes(id)) return false
    const s = { pile: cur.current.pile.filter((x) => x !== id), bowl: [...cur.current.bowl, id] }
    commit(s)
    sfx.plop()
    sfx.count(s.bowl.length)
    speak(String(s.bowl.length))
    jiggle()
    return true
  }
  const takeOut = (id: number) => {
    if (busy.current || !cur.current.bowl.includes(id)) return false
    const s = { pile: [...cur.current.pile, id], bowl: cur.current.bowl.filter((x) => x !== id) }
    commit(s)
    sfx.pop()
    speak(`Take one out. ${s.bowl.length}.`)
    return true
  }
  // Tapping instead of dragging: the first time, show how to drag; after that, it hops in anyway.
  const tapIn = async (id: number, el: HTMLElement) => {
    if (busy.current || !bowl.current) return
    if (!showedHow) {
      showedHow = true
      speak(`Drag the ${item.say} into the bowl!`)
      return void showDrag(el, bowl.current)
    }
    el.style.visibility = 'hidden'
    await fly(el, bowl.current, { endScale: 0.75, fade: false })
    el.style.visibility = ''
    putIn(id)
  }
  const tapOut = async (id: number, el: HTMLElement) => {
    if (busy.current || !pileBox.current) return
    el.style.visibility = 'hidden'
    await fly(el, pileBox.current, { arc: 70, endScale: 1, fade: false })
    el.style.visibility = ''
    takeOut(id)
  }
  const done = async () => {
    if (busy.current) return
    const c = cur.current.bowl.length
    if (c < n) { sfx.oops(); return void speak(`That's ${c}. We need ${n}. Add some more!`) }
    if (c > n) { sfx.oops(); return void speak(`Oops, that's ${c}. Too many! Take some out of the bowl.`) }
    busy.current = true
    sfx.good()
    await speak(`${n} ${say(n)}! ${praise()}`)
    onDone()
  }
  const count = st.bowl.length
  return (
    <div className="k-station">
      <div className="k-ask" onClick={ask}>Put <b>{n}</b> {item.emoji} in!</div>
      <div className="k-row">
        <div className="k-pile" ref={pileRef}>
          {st.pile.map((id) => <PileItem key={id} emoji={item.emoji} onIn={() => putIn(id)} onTap={(el) => tapIn(id, el)} />)}
        </div>
        <div className="k-bowl-wrap" ref={bowlTarget}>
          <MixingBowl ref={bowl} label="Mixing bowl">
            {st.bowl.map((id, i) => <BowlItem key={id} i={i} emoji={item.emoji} onOut={() => takeOut(id)} onTap={(el) => tapOut(id, el)} />)}
          </MixingBowl>
          <span className="k-n" key={count}>{count}</span>
        </div>
      </div>
      <BigButton color="green" onClick={done}>✅ Done!</BigButton>
    </div>
  )
}

// ---------- find: read the jar labels ----------

/** Read the jar labels: "Find the jam!" Tapping a wrong jar says what it says. */
function FindStep({ step, onDone }: { step: Extract<CookStep, { kind: 'find' }>; onDone: Done }) {
  const jars = useMemo(() => shuffle([step.word, ...step.others]), [step])
  const [opened, setOpened] = useState<string | null>(null)
  const [wrong, setWrong] = useState<string | null>(null)
  const busy = useRef(false)
  const ask = () => speak(`Find the jar that says ${step.word}!`)
  useEffect(() => { ask() }, [])
  const tap = async (w: string) => {
    if (busy.current) return
    if (w !== step.word) {
      sfx.oops()
      setWrong(w)
      setTimeout(() => setWrong(null), 600)
      return void speak(`That one says ${w}. ${retry()}`)
    }
    busy.current = true
    setOpened(w)
    sfx.good()
    await speak(`${w}! ${praise()}`)
    onDone()
  }
  return (
    <div className="k-station">
      <div className="k-ask" onClick={ask}>Find: 🔊</div>
      <div className="k-jars">
        {jars.map((w) => (
          <button key={w} className={`k-jar ${wrong === w ? 'wiggle' : ''} ${opened === w ? 'open' : ''}`} onClick={() => tap(w)}>
            {opened === w && <span className="k-lid" aria-hidden />}
            <span className="k-jar-pic" key={opened === w ? 'open' : 'shut'}>{opened === w ? step.emoji : '🫙'}</span>
            <span className="k-label">{w}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- pattern: drag the next fruit into place ----------

function PatternChoice({ c, wrong, onDrop, onTap }: { c: string; wrong: boolean; onDrop: (c: string) => boolean; onTap: (c: string, el: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag({ data: c, onStart: sfx.lift, onDrop: (t) => t === 'slot' && onDrop(c), onTap: () => ref.current && onTap(c, ref.current) })
  return <button ref={ref} className={`k-choice ${wrong ? 'wiggle' : ''}`} {...drag}>{c}</button>
}

/** Finish the pattern: 🍓🫐🍓🫐🍓 _ — drag (or tap) what comes next. */
function PatternStep({ step, onDone }: { step: Extract<CookStep, { kind: 'pattern' }>; onDone: Done }) {
  const { items, names, shown } = step
  const nextIdx = shown % items.length
  const choices = useMemo(() => shuffle([...new Set([...items, '🍇'])]), [step])
  const [filled, setFilled] = useState(false)
  const [wrong, setWrong] = useState<string | null>(null)
  const busy = useRef(false)
  const slot = useRef<HTMLSpanElement | null>(null)
  const slotTarget = useDropTarget('slot')
  const slotRef = useCallback((el: HTMLSpanElement | null) => { slot.current = el; slotTarget(el) }, [slotTarget])
  const ask = () => speak(`${Array.from({ length: shown }, (_, i) => names[i % names.length]).join(', ')}. What comes next?`)
  useEffect(() => { ask() }, [])
  const right = async () => {
    busy.current = true
    setFilled(true)
    sfx.good()
    await speak(`${names[nextIdx]}! ${praise()} You made a pattern!`)
    onDone()
  }
  const miss = (c: string) => {
    sfx.oops()
    setWrong(c)
    setTimeout(() => setWrong(null), 600)
    speak(retry())
  }
  const drop = (c: string) => {
    if (busy.current) return false
    if (c !== items[nextIdx]) { miss(c); return false }
    right()
    return true
  }
  const tap = async (c: string, el: HTMLElement) => {
    if (busy.current) return
    if (c !== items[nextIdx]) return miss(c)
    busy.current = true
    if (slot.current) await fly(el, slot.current, { endScale: 0.9, fade: false })
    right()
  }
  return (
    <div className="k-station">
      <div className="k-ask" onClick={ask}>What comes next? 🔊</div>
      <div className="k-pattern">
        {Array.from({ length: shown }, (_, i) => <span key={i}>{items[i % items.length]}</span>)}
        <span ref={slotRef} className={`k-slot ${filled ? 'filled' : ''}`}>{filled ? items[nextIdx] : '?'}</span>
      </div>
      <div className="k-choices">
        {choices.map((c) => <PatternChoice key={c} c={c} wrong={wrong === c} onDrop={drop} onTap={tap} />)}
      </div>
    </div>
  )
}

// ---------- cut: pick the cut, then the knife slices ----------

const CUT_SAY = { halves: 'two halves', triangles: 'two triangles', quarters: 'four pieces' }

/** Pick the right way to cut: halves, triangles or quarters. A knife slices it, and it comes apart. */
function CutStep({ step, onDone }: { step: Extract<CookStep, { kind: 'cut' }>; onDone: Done }) {
  const options = useMemo(() => shuffle(['halves', 'triangles', 'quarters'] as const), [])
  const [cut, setCut] = useState<'whole' | 'slicing' | 'split'>('whole')
  const [wrong, setWrong] = useState<string | null>(null)
  const busy = useRef(false)
  const alive = useAlive()
  const ask = () => speak(`Cut the ${step.foodName} into ${CUT_SAY[step.cut]}! Which one?`)
  useEffect(() => { ask() }, [])
  const tap = async (o: (typeof options)[number]) => {
    if (busy.current) return
    if (o !== step.cut) {
      sfx.oops()
      setWrong(o)
      setTimeout(() => setWrong(null), 600)
      return void speak(`That makes ${CUT_SAY[o]}. ${retry()}`)
    }
    busy.current = true
    setCut('slicing')
    sfx.whoosh()
    await wait(step.cut === 'quarters' ? 1000 : 560)
    if (!alive.current) return
    if (step.cut === 'quarters') sfx.whoosh()
    setCut('split')
    await wait(500)
    sfx.good()
    await speak(`${CUT_SAY[o]}! ${praise()}`)
    onDone()
  }
  const parts = step.cut === 'quarters' ? 4 : 2
  return (
    <div className="k-station">
      <div className={`k-food ${cut === 'split' ? `cut-${step.cut}` : ''}`}>
        {cut === 'split' ? Array.from({ length: parts }, (_, i) => <span key={i} className={`k-piece p${i}`}>{step.food}</span>) : <span>{step.food}</span>}
        {cut === 'slicing' && (
          <svg className={`k-slice ${step.cut}`} viewBox="0 0 100 100" aria-hidden>
            {/* where the knife has been: the cut line draws on behind it */}
            {step.cut !== 'triangles' && <line className="k-cutline v" x1={50} y1={6} x2={50} y2={94} />}
            {step.cut === 'triangles' && <line className="k-cutline d" x1={8} y1={8} x2={92} y2={92} />}
            {step.cut === 'quarters' && <line className="k-cutline h" x1={6} y1={50} x2={94} y2={50} />}
          </svg>
        )}
        {cut === 'slicing' && <span className={`k-knife ${step.cut}`} aria-hidden><Knife /></span>}
      </div>
      <div className="k-choices">
        {options.map((o) => (
          <button key={o} className={`k-cut ${wrong === o ? 'wiggle' : ''}`} onClick={() => tap(o)} aria-label={CUT_SAY[o]}>
            <svg viewBox="0 0 100 100" width={96} height={96}>
              <rect x={8} y={8} width={84} height={84} rx={14} fill="#ffe2b0" stroke="#c98448" strokeWidth={5} />
              {o === 'halves' && <line x1={50} y1={4} x2={50} y2={96} />}
              {o === 'triangles' && <line x1={4} y1={4} x2={96} y2={96} />}
              {o === 'quarters' && <><line x1={50} y1={4} x2={50} y2={96} /><line x1={4} y1={50} x2={96} y2={50} /></>}
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

/** A friendly kitchen knife, blade pointing down. */
const Knife = () => (
  <svg viewBox="0 0 40 120" width={40} height={120}>
    <rect x={13} y={4} width={14} height={40} rx={6} fill="#c98448" stroke="#8a5428" strokeWidth={3} />
    <circle cx={20} cy={16} r={2.5} fill="#f0c98f" /><circle cx={20} cy={32} r={2.5} fill="#f0c98f" />
    <path d="M12 46 L28 46 L28 104 Q28 116 18 117 Q12 110 12 100 Z" fill="#e4ebf2" stroke="#8d9aa8" strokeWidth={3} strokeLinejoin="round" />
    <path d="M16 52 L16 100" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
  </svg>
)

// ---------- stir: a spoon that follows her finger ----------

/** Stir round and round: the spoon follows her finger round the bowl (a tap stirs once by itself). */
function StirStep({ step, contents, batter, onDone }: { step: Extract<CookStep, { kind: 'stir' }>; contents: string[]; batter: Batter; onDone: Done }) {
  const box = useRef<HTMLDivElement>(null)
  const start = -Math.PI / 2 + 0.9
  const m = useRef({ spoon: start, swirl: start, total: 0, stirs: 0, halves: 0, last: null as number | null, down: false, auto: 0, moved: 0, t0: 0 })
  const [view, setView] = useState({ spoon: start, swirl: start, progress: 0, down: false, stirs: 0 })
  const busy = useRef(false)
  const alive = useAlive()
  const goal = step.times * 2 * Math.PI
  useEffect(() => { speak(`Stir it round and round, ${step.times} times!`) }, [])

  const stirred = async (k: number) => {
    sfx.count(k + 2)
    if (k < step.times) return void speak(String(k))
    busy.current = true
    sfx.good()
    await speak(`${k}! ${praise()} All mixed up!`)
    if (alive.current) onDone()
  }
  /** Turns the spoon by `d` radians: the stirring counts, and the batter follows. */
  const turn = (d: number, counts = true) => {
    const s = m.current
    s.spoon += d
    if (!counts || busy.current) return
    s.total = Math.min(goal + 0.01, s.total + Math.abs(d))
    const halves = Math.floor(s.total / Math.PI)
    if (halves > s.halves) { s.halves = halves; sfx.swish() }
    const stirs = Math.floor(s.total / (2 * Math.PI) + 1e-6)
    if (stirs > s.stirs) { s.stirs = stirs; stirred(stirs) }
  }
  // Every frame: the batter swirls after the spoon (a little behind, like real batter), and keeps
  // turning a moment after she stops; a tap's stir moves the spoon round by itself.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const s = m.current
      if (s.auto > 0) {
        const d = Math.min(s.auto, 0.13)
        s.auto -= d
        turn(d)
      }
      s.swirl += (s.spoon - s.swirl) * 0.07
      setView((v) => {
        const progress = Math.min(1, s.total / goal)
        const down = s.down || s.auto > 0
        if (Math.abs(v.spoon - s.spoon) < 1e-3 && Math.abs(v.swirl - s.swirl) < 1e-3 && v.progress === progress && v.down === down && v.stirs === s.stirs) return v
        return { spoon: s.spoon, swirl: s.swirl, progress, down, stirs: s.stirs }
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  /** The finger's angle around the batter's middle (a squashed circle, as the bowl is seen from above at a slant). */
  const angleOf = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect()
    const cx = r.left + r.width * 0.5, cy = r.top + r.height * (92 / 230)
    return Math.atan2((e.clientY - cy) / 0.6, e.clientX - cx)
  }
  const wrap = (d: number) => (d > Math.PI ? d - 2 * Math.PI : d < -Math.PI ? d + 2 * Math.PI : d)
  const down = (e: React.PointerEvent) => {
    try { box.current!.setPointerCapture(e.pointerId) } catch { /* fine */ }
    const s = m.current
    const a = angleOf(e)
    // The spoon moves to her finger (that jump isn't stirring).
    turn(wrap(a - ((s.spoon % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)), false)
    s.last = a
    s.down = true
    s.moved = 0
    s.t0 = performance.now()
  }
  const move = (e: React.PointerEvent) => {
    const s = m.current
    if (!s.down || s.last === null) return
    const a = angleOf(e)
    const d = wrap(a - s.last)
    s.last = a
    s.moved += Math.abs(d)
    turn(d)
  }
  const up = () => {
    const s = m.current
    if (!s.down) return
    s.down = false
    s.last = null
    // A tap (barely moved): the spoon stirs once round by itself.
    if (s.moved < 0.3 && performance.now() - s.t0 < 600 && !busy.current) s.auto += 2 * Math.PI
  }
  return (
    <div className="k-station">
      <div className="k-ask">Stir {step.times} times! <b>{view.stirs}</b></div>
      <div ref={box} className={`k-stir ${view.stirs === 0 && !view.down ? 'hint' : ''}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <StirBowl contents={contents} batter={batter} spoon={view.spoon} swirl={view.swirl} progress={view.progress} spoonDown={view.down} />
        {/* "go round": a circling arrow until she starts stirring */}
        <svg className="k-stir-arrow" viewBox="0 0 100 100" aria-hidden>
          <g className="k-stir-spin">
            <path d="M50 14 A36 36 0 1 1 18 32" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeDasharray="2 12" />
            <path d="M8 26 L20 36 L26 22 Z" fill="#fff" />
          </g>
        </svg>
      </div>
      <div className="k-stir-dots">{Array.from({ length: step.times }, (_, i) => <span key={i} className={i < view.stirs ? 'on' : ''}>🥄</span>)}</div>
    </div>
  )
}

// ---------- bake: slide the tray into the oven ----------

/** Slide the tray into the oven (or tap), count down 3, 2, 1… ding! */
function BakeStep({ step, dish, onDone }: { step: Extract<CookStep, { kind: 'bake' }>; dish: string; onDone: Done }) {
  const [phase, setPhase] = useState<'ready' | 'baking' | 'done'>('ready')
  const [n, setN] = useState(3)
  const started = useRef(false)
  const oven = useRef<HTMLDivElement | null>(null)
  const tray = useRef<HTMLDivElement>(null)
  const alive = useAlive()
  const ovenTarget = useDropTarget('oven', (d) => d === 'tray', 30)
  const ovenRef = useCallback((el: HTMLDivElement | null) => { oven.current = el; ovenTarget(el) }, [ovenTarget])
  useEffect(() => { speak(`Slide the ${step.what} into the oven!`) }, [])
  const bake = async () => {
    if (started.current) return
    started.current = true
    setPhase('baking')
    sfx.plop()
    sfx.sizzle()
    for (const k of [3, 2, 1]) {
      setN(k)
      sfx.count(6 - k)
      await speak(String(k))
      if (!alive.current) return
      await wait(250)
    }
    setPhase('done')
    sfx.ding()
    await speak(`Ding! The ${step.what} ${step.many ? 'are' : 'is'} ready!`)
    if (alive.current) onDone()
  }
  const toOven = async () => {
    if (started.current || !tray.current || !oven.current) return
    tray.current.style.visibility = 'hidden'
    await fly(tray.current, oven.current.querySelector('.k-oven-window') ?? oven.current, { arc: 50, endScale: 0.6, fade: false })
    bake()
  }
  const drag = useDrag({ data: 'tray', onStart: sfx.lift, onDrop: (t) => { if (t !== 'oven') return false; bake(); return true }, onTap: toOven, disabled: phase !== 'ready' })
  return (
    <div className="k-station">
      <div className="k-bake">
        {phase === 'ready' && (
          <div ref={tray} className="k-tray" aria-label={`Tray of ${step.what}: drag it into the oven`} {...drag}>
            <span className="k-raw">{dish}</span><span className="k-raw two">{dish}</span>
          </div>
        )}
        <div ref={ovenRef} className={`k-oven ${phase}`} onClick={toOven}>
          <div className="k-oven-top">
            <span className="k-knob" /><span className="k-timer">{phase === 'baking' ? n : phase === 'done' ? '🔔' : '–'}</span><span className="k-knob" />
          </div>
          <div className="k-oven-door">
            <div className="k-oven-window">
              {phase !== 'ready' && <span className="k-oven-food">{dish}</span>}
            </div>
            <div className="k-oven-handle" />
          </div>
          {phase === 'baking' && <div className="k-heat" aria-hidden><i /><i /><i /></div>}
          {phase === 'baking' && <span className="k-count" key={n}>{n}</span>}
        </div>
      </div>
      <p className="muted">{phase === 'ready' ? 'Drag the tray into the oven!' : phase === 'baking' ? 'Baking…' : 'Ding!'}</p>
    </div>
  )
}

// ---------- serving ----------

function Plate({ emoji, onGive, onTap }: { emoji: string; onGive: () => boolean; onTap: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useDrag({ data: 'dish', onStart: sfx.lift, onDrop: (t) => t === 'k-pal' && onGive(), onTap: () => ref.current && onTap(ref.current) })
  return (
    <div ref={ref} className="k-plate" {...drag}>
      <span className="k-dish">{emoji}</span>
      <span className="k-steam" aria-hidden><i /><i /><i /></span>
    </div>
  )
}

/** `special`: something other than the Pal's favorite (the birthday cake), with what to say first. */
export default function Kitchen({ pal, hungry, special, onClose }: {
  pal: PalDef; hungry: boolean; special?: { recipe: Recipe; intro: string }; onClose: () => void
}) {
  const p = useProgress()
  const recipe: Recipe = special?.recipe ?? recipeFor(pal.fruit)
  const stage = stageFor(pal, p.pals[pal.id] ?? 0)
  const name = pal.stages[stage].name
  const [i, setI] = useState(0)
  const [served, setServed] = useState<number | null>(null)
  const [eating, setEating] = useState(false)
  const alive = useAlive()
  const palBox = useRef<HTMLDivElement | null>(null)
  const palTarget = useDropTarget('k-pal', (d) => d === 'dish', 40)
  const palRef = useCallback((el: HTMLDivElement | null) => { palBox.current = el; palTarget(el) }, [palTarget])
  const contents = recipe.steps.flatMap((s) => (s.kind === 'add' ? Array(s.n).fill(s.item.emoji) : []))
  const step = recipe.steps[i]
  const finished = i >= recipe.steps.length

  useEffect(() => {
    showedHow = false
    speak(special?.intro ?? `${name} is ${hungry ? 'hungry' : 'ready for a snack'}! Let's cook ${recipe.name}, ${name}'s favorite!`)
  }, [])
  useEffect(() => {
    if (finished) speak(`The ${recipe.name} ${recipe.many ? 'are' : 'is'} ready! Give ${recipe.many ? 'them' : 'it'} to ${name}!`)
  }, [finished])

  const next = () => { if (alive.current) setI((k) => k + 1) }
  const give = () => {
    if (eating || served !== null) return false
    setEating(true)
    sfx.chomp()
    setTimeout(() => {
      if (!alive.current) return
      sfx.fanfare()
      const xp = serve(pal.id, hungry)
      setServed(xp)
      speak(`Yum, yum! ${name} loves ${recipe.name}! Thank you, chef ${playerName()}!`)
    }, 900)
    return true
  }
  const tapPlate = async (el: HTMLElement) => {
    if (eating || served !== null || !palBox.current) return
    el.style.visibility = 'hidden'
    await fly(el, palBox.current, { arc: 110, endScale: 0.4 })
    give()
  }

  let station
  if (!finished) {
    switch (step.kind) {
      case 'add': station = <AddStep key={i} step={step} onDone={next} />; break
      case 'find': station = <FindStep key={i} step={step} onDone={next} />; break
      case 'pattern': station = <PatternStep key={i} step={step} onDone={next} />; break
      case 'cut': station = <CutStep key={i} step={step} onDone={next} />; break
      case 'stir': station = <StirStep key={i} step={step} contents={contents} batter={BATTER[recipe.id] ?? BATTER.pancakes} onDone={next} />; break
      case 'bake': station = <BakeStep key={i} step={step} dish={recipe.emoji} onDone={next} />; break
      case 'candles': station = <div key={i} className="k-station"><CandlesOnCake n={step.n} onDone={next} /></div>; break
    }
  }

  const ICON: Record<CookStep['kind'], string> = { add: '🥣', find: '🫙', pattern: '🔁', cut: '🔪', stir: '🥄', bake: '🔥', candles: '🕯️' }
  return (
    <div className="overlay kitchen" style={{ '--c': FRUIT_COLOR[pal.fruit] } as CSSProperties}>
      <header className="home-head">
        <BackButton onClick={onClose} />
        <h2>🍳 {recipe.name} for {name}</h2>
        <div className="k-card">
          {recipe.steps.map((s, k) => <span key={k} className={k < i ? 'done' : k === i ? 'now' : ''}>{k < i ? '✅' : ICON[s.kind]}</span>)}
          <span className={finished ? 'now' : ''}>{recipe.emoji}</span>
        </div>
      </header>
      <div className="k-main">
        <div ref={palRef} className="k-pal">
          <div className="k-think">{recipe.emoji}</div>
          <DressedPal pal={pal} stage={stage} size={190} outfit={p.outfits[pal.id]} className={served !== null ? 'k-happy' : eating ? 'k-chomp' : 'bob'} />
          <div className="name">{name}</div>
          {eating && served === null && <span className="k-crumbs" aria-hidden><i /><i /><i /><i /></span>}
        </div>
        <div className="k-work">
          {!finished && station}
          {finished && served === null && !eating && (
            <div className="k-station">
              <Plate emoji={recipe.emoji} onGive={give} onTap={tapPlate} />
              <p className="muted">Give it to {name}! Drag it over.</p>
            </div>
          )}
          {served !== null && (
            <div className="k-station">
              <div className="k-yum">Yum! 😋</div>
              <p>{name} got <b>+{served}</b> ⭐</p>
              <BigButton color="pink" onClick={onClose}>💖 Yay!</BigButton>
            </div>
          )}
        </div>
      </div>
      {served !== null && <Confetti count={40} />}
    </div>
  )
}
