// Put the pictures in order: drag them into the numbered slots, first, second, third… (or tap them in
// order). A wrong one wiggles and goes back; after two misses the right picture glows.
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Thing } from '../data/islands'
import { praise, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { fly, useDrag, useDropTarget } from '../lib/drag'
import { shuffle, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'
import Pic from '../components/Pic'

function Slot({ k, filled, t, next }: { k: number; filled: boolean; t: Thing; next: boolean }) {
  // Only the next empty slot takes a picture.
  const target = useDropTarget(`seq-${k}`, () => next, 16)
  return (
    <div ref={target} className={`seq-slot ${filled ? 'filled' : ''} ${next ? 'next' : ''}`} data-slot={k}>
      <span className="seq-num">{k + 1}</span>
      {filled && <span className="seq-emoji"><Pic e={t.emoji} art={t.art} /></span>}
    </div>
  )
}

function Card({ t, used, wrong, glow, onDrop, onTap }: { t: Thing & { i: number }; used: boolean; wrong: boolean; glow: boolean; onDrop: () => boolean; onTap: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag({ data: t.i, disabled: used, onStart: sfx.lift, onDrop: (id) => id.startsWith('seq-') && onDrop(), onTap: () => ref.current && onTap(ref.current) })
  return <button ref={ref} className={`seq-card ${used ? 'used' : ''} ${wrong ? 'wiggle' : ''} ${glow ? 'glow' : ''}`} disabled={used} {...drag}><Pic e={t.emoji} art={t.art} /></button>
}

export default function Sequence({ title, intro, items, onDone }: { title: string; intro: string; items: Thing[]; onDone: () => void }) {
  // Shuffle until the cards are out of order, so there's something to do.
  const pool = useMemo(() => {
    let p = shuffle(items.map((t, i) => ({ ...t, i })))
    while (items.length > 1 && p.every((x, k) => x.i === k)) p = shuffle(p)
    return p
  }, [items])
  const [placed, setPlaced] = useState(0)
  const [wrong, setWrong] = useState<number | null>(null)
  const [misses, setMisses] = useState(0)
  const placedRef = useRef(0)
  const alive = useAlive()

  useEffect(() => { speak(intro) }, [])

  /** A card out of order: say what she picked, so the order gets taught, not just tested. */
  const miss = (i: number) => {
    sfx.oops()
    setWrong(i)
    setMisses((m) => m + 1)
    speak(`That's ${items[i].say.replace(/[.!?]+$/, '')}. Which one comes next?`)
    setTimeout(() => setWrong(null), 600)
  }
  const place = async (i: number) => {
    sfx.plop()
    setMisses(0)
    const n = placedRef.current + 1
    placedRef.current = n
    setPlaced(n)
    if (n < items.length) return void speak(items[i].say)
    sfx.fanfare()
    await speak(`${items[i].say}! ${praise()} You put them all in order!`)
    if (!alive.current) return
    await wait(300)
    if (alive.current) onDone()
  }
  const drop = (i: number) => {
    if (placedRef.current >= items.length) return false
    if (i !== placedRef.current) { miss(i); return false }
    place(i)
    return true
  }
  const flying = useRef(false) // a tapped card is on its way: a second tap waits for it
  const tap = async (i: number, el: HTMLElement) => {
    if (placedRef.current >= items.length || flying.current) return
    if (i !== placedRef.current) return miss(i)
    const slot = document.querySelector(`.seq-slot[data-slot="${placedRef.current}"]`)
    flying.current = true
    if (slot) {
      el.style.visibility = 'hidden'
      await fly(el, slot, { endScale: 0.85, fade: false })
      el.style.visibility = ''
    }
    flying.current = false
    place(i)
  }

  return (
    <div className={`activity sequence ${items.some((t) => t.art?.startsWith('story:')) ? 'cards' : ''}`}>
      <h2>{title}</h2>
      <div className="seq-slots">
        {items.map((t, k) => <Slot key={k} k={k} filled={k < placed} t={t} next={k === placed} />)}
      </div>
      <div className="seq-pool">
        {pool.map((t) => (
          <Card key={t.i} t={t} used={t.i < placed} wrong={wrong === t.i} glow={misses >= 2 && t.i === placed} onDrop={() => drop(t.i)} onTap={(el) => tap(t.i, el)} />
        ))}
      </div>
      <button className="instruction" onClick={() => speak(intro)}>🔊 Hear it again</button>
    </div>
  )
}
