// Counting into a basket: "Put 5 stones in David's bag!" Drag things in (the narrator counts out
// loud), drag one back out (or tap it) to take it away, then tap Done. Real counting: she has to
// stop at the right number. Tapping a thing works too: the first tap shows how to drag, then it hops in.
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Thing } from '../data/islands'
import { BigButton } from '../components/ui'
import { praise, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { fly, showDrag, useDrag, useDropTarget } from '../lib/drag'
import { wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'
import Pic from '../components/Pic'

function Loose({ emoji, onIn, onTap }: { emoji: string; onIn: () => boolean; onTap: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag({ data: 'in', onStart: sfx.lift, onDrop: (t) => t === 'basket' && onIn(), onTap: () => ref.current && onTap(ref.current) })
  return <button ref={ref} className="count-thing" {...drag}><Pic e={emoji} /></button>
}

/** Where the i-th thing sits in the basket (% of the basket box): the bottom row first, piling up. */
const SLOTS: [number, number][] = [
  [50, 40], [37, 41], [63, 41], [44, 33], [56, 33], [31, 35], [69, 35], [50, 26], [38, 27], [62, 27], [44, 19], [56, 19], [50, 12],
]

function Inside({ emoji, i, onOut, onTap }: { emoji: string; i: number; onOut: () => boolean; onTap: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLSpanElement>(null)
  const drag = useDrag({ data: 'out', onStart: sfx.lift, onDrop: (t) => t === 'loose' && onOut(), onTap: () => ref.current && onTap(ref.current) })
  const [x, y] = SLOTS[Math.min(i, SLOTS.length - 1)]
  // (The basket is drawn over them, so they sit in it with their tops peeking out.)
  return <span ref={ref} style={{ left: `${x}%`, top: `${y}%` }} {...drag}><Pic e={emoji} /></span>
}

/** `basket`: the container's emoji (drawn with Pic); `done`: a line from the story, said after the last round. */
export default function CountBasket({ title, intro, item, plural, basket, basketArt, into = 'the basket', rounds, done: outro, onDone }: {
  title: string; intro: string; item: Thing; plural: string; basket: string; basketArt?: string; into?: string; rounds: number[]; done?: string; onDone: () => void
}) {
  const [round, setRound] = useState(0)
  const target = rounds[round]
  const fresh = (r: number) => ({ pile: Array.from({ length: Math.min(12, rounds[r] + 3) }, (_, i) => i), inside: [] as number[] })
  const [st, setSt] = useState(() => fresh(0))
  const cur = useRef(st)
  const commit = (s: typeof st) => { cur.current = s; setSt(s) }
  const [busy, setBusyState] = useState(true)
  // A ref as well as state, so two quick taps on Done can't both count.
  const busyRef = useRef(true)
  const setBusy = (b: boolean) => { busyRef.current = b; setBusyState(b) }
  const hinted = useRef(false)
  const alive = useAlive()
  const bin = useRef<HTMLButtonElement | null>(null)
  const pileBox = useRef<HTMLDivElement | null>(null)
  const binTarget = useDropTarget('basket', (d) => d === 'in')
  const pileTarget = useDropTarget('loose', (d) => d === 'out', 90)
  const binRef = useCallback((el: HTMLButtonElement | null) => { bin.current = el; binTarget(el) }, [binTarget])
  const pileRef = useCallback((el: HTMLDivElement | null) => { pileBox.current = el; pileTarget(el) }, [pileTarget])

  const ask = (r: number) => speak(`Put ${rounds[r]} ${rounds[r] === 1 ? item.say : plural} in ${into}!`)

  useEffect(() => {
    ;(async () => {
      await speak(intro)
      if (!alive.current) return
      setBusy(false)
      ask(0)
    })()
  }, [])

  const jiggle = () => bin.current?.animate([{ scale: '1' }, { scale: '1.05 .94' }, { scale: '.98 1.03' }, { scale: '1' }], { duration: 380, easing: 'ease-out' })
  const putIn = (id: number) => {
    if (busyRef.current || !cur.current.pile.includes(id)) return false
    const s = { pile: cur.current.pile.filter((x) => x !== id), inside: [...cur.current.inside, id] }
    commit(s)
    sfx.plop()
    sfx.count(s.inside.length)
    speak(String(s.inside.length))
    jiggle()
    return true
  }
  const takeOut = (id: number) => {
    if (busyRef.current || !cur.current.inside.includes(id)) return false
    const s = { pile: [...cur.current.pile, id], inside: cur.current.inside.filter((x) => x !== id) }
    commit(s)
    sfx.pop()
    speak(`Take one out. ${s.inside.length}.`)
    return true
  }
  const tapIn = async (id: number, el: HTMLElement) => {
    if (busyRef.current || !bin.current) return
    if (!hinted.current) {
      hinted.current = true
      speak(`Drag it into ${into}!`)
      return void showDrag(el, bin.current)
    }
    el.style.visibility = 'hidden'
    await fly(el, bin.current, { endScale: 0.6, fade: false })
    el.style.visibility = ''
    putIn(id)
  }
  const tapOut = async (id: number, el: HTMLElement) => {
    if (busyRef.current || !pileBox.current) return
    el.style.visibility = 'hidden'
    await fly(el, pileBox.current, { arc: 70, endScale: 1.4, fade: false })
    el.style.visibility = ''
    takeOut(id)
  }

  const done = async () => {
    if (busyRef.current) return
    const n = cur.current.inside.length
    if (n < target) {
      sfx.oops()
      return void speak(`That's ${n}. We need ${target}. Put in some more!`)
    }
    if (n > target) {
      sfx.oops()
      return void speak(`Oops, that's ${n}. Too many! Take some out of ${into}.`)
    }
    setBusy(true)
    sfx.good()
    await speak(`${target} ${target === 1 ? item.say : plural}! ${praise()}`)
    if (!alive.current) return
    if (round + 1 >= rounds.length) {
      sfx.fanfare()
      if (outro) {
        await speak(outro)
        if (!alive.current) return
      }
      await wait(500)
      if (alive.current) onDone()
      return
    }
    setRound(round + 1)
    commit(fresh(round + 1))
    setBusy(false)
    ask(round + 1)
  }

  const n = st.inside.length
  return (
    <div className="activity count-basket">
      <div className="practice-head">
        <span className="decor"><Pic e={basket} art={basketArt} /></span>
        <h2>{title}</h2>
        <div className="count-goal" onClick={() => ask(round)}>Put <b>{target}</b> in!</div>
      </div>
      <div className="count-play">
        <div className="count-pile" ref={pileRef}>
          {st.pile.map((id) => <Loose key={`${round}-${id}`} emoji={item.emoji} onIn={() => putIn(id)} onTap={(el) => tapIn(id, el)} />)}
        </div>
        <button ref={binRef} className="count-bin" aria-label={`${into}: drag things in`}>
          <span className="count-in">{st.inside.map((id, i) => <Inside key={`${round}-${id}`} i={i} emoji={item.emoji} onOut={() => takeOut(id)} onTap={(el) => tapOut(id, el)} />)}</span>
          <span className="count-bowl"><Pic e={basket} art={basketArt} /></span>
          <span className="count-n" key={n}>{n}</span>
        </button>
      </div>
      <BigButton color="green" disabled={busy} onClick={done}>✅ Done!</BigButton>
    </div>
  )
}
