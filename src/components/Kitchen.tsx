// Pal Kitchen: cook a Pal's favorite food, one step at a time (see data/recipes.ts), then serve it.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import DressedPal from './DressedPal'
import { BackButton, BigButton, Confetti } from './ui'
import { FRUIT_COLOR, stageFor, type PalDef } from '../data/pals'
import { recipeFor, type CookStep, type Recipe } from '../data/recipes'
import { playerName, useProgress } from '../lib/progress'
import { serve } from '../lib/kitchen'
import { praise, retry, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { shuffle, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

type Done = () => void

/** Count ingredients into the bowl: tap to add, tap the bowl to take one out, then Done. */
function AddStep({ step, onDone }: { step: Extract<CookStep, { kind: 'add' }>; onDone: Done }) {
  const { item, n } = step
  const [count, setCount] = useState(0)
  const busy = useRef(false)
  const pile = n + 3
  const say = (k: number) => (k === 1 ? item.say : item.plural)
  useEffect(() => { speak(`Put ${n} ${say(n)} in the bowl!`) }, [])
  const add = () => { if (count >= pile || busy.current) return; const c = count + 1; setCount(c); sfx.count(c); speak(String(c)) }
  const remove = () => { if (!count || busy.current) return; const c = count - 1; setCount(c); sfx.pop(); speak(`Take one out. ${c}.`) }
  const done = async () => {
    if (busy.current) return
    if (count < n) { sfx.oops(); return void speak(`That's ${count}. We need ${n}. Add some more!`) }
    if (count > n) { sfx.oops(); return void speak(`Oops, that's ${count}. Too many! Tap the bowl to take some out.`) }
    busy.current = true
    sfx.good()
    await speak(`${n} ${say(n)}! ${praise()}`)
    onDone()
  }
  return (
    <div className="k-station">
      <div className="k-ask" onClick={() => speak(`Put ${n} ${say(n)} in the bowl!`)}>Put <b>{n}</b> {item.emoji} in!</div>
      <div className="k-row">
        <div className="k-pile">{Array.from({ length: pile - count }, (_, i) => <button key={i} className="k-thing" onClick={add}>{item.emoji}</button>)}</div>
        <button className="k-bowl" onClick={remove} aria-label="Bowl: tap to take one out">
          <span className="k-in">{Array.from({ length: count }, (_, i) => <span key={i}>{item.emoji}</span>)}</span>
          <span className="k-bowl-icon">🥣</span>
          <span className="k-n" key={count}>{count}</span>
        </button>
      </div>
      <BigButton color="green" onClick={done}>✅ Done!</BigButton>
    </div>
  )
}

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
            <span className="k-jar-pic">{opened === w ? step.emoji : '🫙'}</span>
            <span className="k-label">{w}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Finish the pattern: 🍓🍌🍓🍌🍓 _ */
function PatternStep({ step, onDone }: { step: Extract<CookStep, { kind: 'pattern' }>; onDone: Done }) {
  const { items, names, shown } = step
  const nextIdx = shown % items.length
  const choices = useMemo(() => shuffle([...new Set([...items, '🍇'])]), [step])
  const [filled, setFilled] = useState(false)
  const [wrong, setWrong] = useState<string | null>(null)
  const busy = useRef(false)
  const ask = () => speak(`${Array.from({ length: shown }, (_, i) => names[i % names.length]).join(', ')}. What comes next?`)
  useEffect(() => { ask() }, [])
  const tap = async (c: string) => {
    if (busy.current) return
    if (c !== items[nextIdx]) {
      sfx.oops()
      setWrong(c)
      setTimeout(() => setWrong(null), 600)
      return void speak(retry())
    }
    busy.current = true
    setFilled(true)
    sfx.good()
    await speak(`${names[nextIdx]}! ${praise()} You made a pattern!`)
    onDone()
  }
  return (
    <div className="k-station">
      <div className="k-ask" onClick={ask}>What comes next? 🔊</div>
      <div className="k-pattern">
        {Array.from({ length: shown }, (_, i) => <span key={i}>{items[i % items.length]}</span>)}
        <span className={`k-slot ${filled ? 'filled' : ''}`}>{filled ? items[nextIdx] : '?'}</span>
      </div>
      <div className="k-choices">
        {choices.map((c) => <button key={c} className={`k-choice ${wrong === c ? 'wiggle' : ''}`} onClick={() => tap(c)}>{c}</button>)}
      </div>
    </div>
  )
}

const CUT_SAY = { halves: 'two halves', triangles: 'two triangles', quarters: 'four pieces' }

/** Pick the right way to cut: halves, triangles or quarters. Then it splits apart. */
function CutStep({ step, onDone }: { step: Extract<CookStep, { kind: 'cut' }>; onDone: Done }) {
  const options = useMemo(() => shuffle(['halves', 'triangles', 'quarters'] as const), [])
  const [cut, setCut] = useState(false)
  const [wrong, setWrong] = useState<string | null>(null)
  const busy = useRef(false)
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
    sfx.whoosh()
    setCut(true)
    await wait(500)
    sfx.good()
    await speak(`${CUT_SAY[o]}! ${praise()}`)
    onDone()
  }
  const parts = step.cut === 'quarters' ? 4 : 2
  return (
    <div className="k-station">
      <div className={`k-food ${cut ? `cut-${step.cut}` : ''}`}>
        {cut ? Array.from({ length: parts }, (_, i) => <span key={i} className={`k-piece p${i}`}>{step.food}</span>) : <span>{step.food}</span>}
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

/** Stir round and round: drag a finger around the bowl (or tap it, a quarter stir per tap). */
function StirStep({ step, contents, onDone }: { step: Extract<CookStep, { kind: 'stir' }>; contents: string[]; onDone: Done }) {
  const bowl = useRef<HTMLDivElement>(null)
  const [turns, setTurns] = useState(0) // in quarter turns
  const [spoon, setSpoon] = useState<{ x: number; y: number } | null>(null)
  const last = useRef<number | null>(null)
  const angle = useRef(0)
  const dragged = useRef(0) // how far the finger moved since it went down; a short one is a tap
  const busy = useRef(false)
  const stirs = Math.floor(turns / 4)
  useEffect(() => { speak(`Stir it round and round, ${step.times} times!`) }, [])

  const addQuarter = async () => {
    if (busy.current) return
    const t = turns + 1
    setTurns(t)
    if (t % 4) return
    const s = t / 4
    sfx.count(s + 2)
    if (s < step.times) return void speak(String(s))
    busy.current = true
    await speak(`${s}! ${praise()} All mixed up!`)
    onDone()
  }

  const move = (e: React.PointerEvent) => {
    const r = bowl.current!.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2)
    setSpoon({ x, y })
    const a = Math.atan2(y, x)
    dragged.current += 1
    if (last.current !== null) {
      let d = a - last.current
      if (d > Math.PI) d -= 2 * Math.PI
      if (d < -Math.PI) d += 2 * Math.PI
      angle.current += Math.abs(d)
      if (angle.current >= Math.PI / 2) { angle.current -= Math.PI / 2; addQuarter() }
    }
    last.current = a
  }
  return (
    <div className="k-station">
      <div className="k-ask">Stir {step.times} times! <b>{stirs}</b></div>
      <div ref={bowl} className="k-stir" onPointerDown={(e) => { last.current = null; dragged.current = 0; move(e) }} onPointerMove={(e) => e.buttons && move(e)}
        onPointerUp={() => { last.current = null; setSpoon(null); if (dragged.current < 4) addQuarter() }}>
        <span className="k-bowl-big">🥣</span>
        <span className="k-swirl" style={{ transform: `rotate(${turns * 90}deg)` }}>{contents.slice(0, 6).join('')}</span>
        {spoon && <span className="k-spoon" style={{ transform: `translate(${spoon.x}px, ${spoon.y}px)` }}>🥄</span>}
      </div>
      <p className="muted">Draw circles in the bowl with your finger!</p>
    </div>
  )
}

/** Into the oven: tap it, count down 3, 2, 1… ding! */
function BakeStep({ step, dish, onDone }: { step: Extract<CookStep, { kind: 'bake' }>; dish: string; onDone: Done }) {
  const [phase, setPhase] = useState<'ready' | 'baking' | 'done'>('ready')
  const [n, setN] = useState(3)
  const alive = useAlive()
  useEffect(() => { speak(`Tap the oven to bake the ${step.what}!`) }, [])
  const bake = async () => {
    if (phase !== 'ready') return
    setPhase('baking')
    sfx.whoosh()
    for (const k of [3, 2, 1]) {
      setN(k)
      sfx.count(6 - k)
      await speak(String(k))
      if (!alive.current) return
      await wait(250)
    }
    setPhase('done')
    sfx.good()
    await speak(`Ding! The ${step.what} ${step.many ? 'are' : 'is'} ready!`)
    if (alive.current) onDone()
  }
  return (
    <div className="k-station">
      <button className={`k-oven ${phase}`} onClick={bake}>
        <span className="k-oven-door">{phase === 'done' ? dish : phase === 'baking' ? '🔥' : '🚪'}</span>
        {phase === 'baking' && <span className="k-count" key={n}>{n}</span>}
      </button>
      <p className="muted">{phase === 'ready' ? 'Tap the oven!' : phase === 'baking' ? 'Baking…' : 'Ding!'}</p>
    </div>
  )
}

export default function Kitchen({ pal, hungry, onClose }: { pal: PalDef; hungry: boolean; onClose: () => void }) {
  const p = useProgress()
  const recipe: Recipe = recipeFor(pal.fruit)
  const stage = stageFor(pal, p.pals[pal.id] ?? 0)
  const name = pal.stages[stage].name
  const [i, setI] = useState(0)
  const [served, setServed] = useState<number | null>(null)
  const [eating, setEating] = useState(false)
  const alive = useAlive()
  const contents = recipe.steps.flatMap((s) => (s.kind === 'add' ? Array(s.n).fill(s.item.emoji) : []))
  const step = recipe.steps[i]
  const finished = i >= recipe.steps.length

  useEffect(() => { speak(`${name} is ${hungry ? 'hungry' : 'ready for a snack'}! Let's cook ${recipe.name}, ${name}'s favorite!`) }, [])
  useEffect(() => {
    if (finished) speak(`The ${recipe.name} ${recipe.many ? 'are' : 'is'} ready! Tap to give ${recipe.many ? 'them' : 'it'} to ${name}!`)
  }, [finished])

  const next = () => { if (alive.current) setI((k) => k + 1) }
  const give = async () => {
    if (eating || served !== null) return
    setEating(true)
    sfx.whoosh()
    await wait(600)
    if (!alive.current) return
    sfx.fanfare()
    const xp = serve(pal.id, hungry)
    setServed(xp)
    speak(`Yum, yum! ${name} loves ${recipe.name}! Thank you, chef ${playerName()}!`)
  }

  let station
  if (!finished) {
    switch (step.kind) {
      case 'add': station = <AddStep key={i} step={step} onDone={next} />; break
      case 'find': station = <FindStep key={i} step={step} onDone={next} />; break
      case 'pattern': station = <PatternStep key={i} step={step} onDone={next} />; break
      case 'cut': station = <CutStep key={i} step={step} onDone={next} />; break
      case 'stir': station = <StirStep key={i} step={step} contents={contents} onDone={next} />; break
      case 'bake': station = <BakeStep key={i} step={step} dish={recipe.emoji} onDone={next} />; break
    }
  }

  const ICON: Record<CookStep['kind'], string> = { add: '🥣', find: '🫙', pattern: '🔁', cut: '🔪', stir: '🥄', bake: '🔥' }
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
        <div className="k-pal">
          <div className="k-think">{recipe.emoji}</div>
          <DressedPal pal={pal} stage={stage} size={190} outfit={p.outfits[pal.id]} className={served !== null ? 'k-happy' : eating ? 'k-chomp' : 'bob'} />
          <div className="name">{name}</div>
        </div>
        <div className="k-work">
          {!finished && station}
          {finished && served === null && (
            <div className="k-station">
              <button className={`k-dish ${eating ? 'flying' : ''}`} onClick={give}>{recipe.emoji}</button>
              <p className="muted">Tap the {recipe.name.toLowerCase()} to give it to {name}!</p>
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
