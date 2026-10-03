// Match the animals two by two (drag one onto its twin, or tap the two), and the pair hops onto
// the ark. Then count them into the ark by 2s.
import { useEffect, useMemo, useRef, useState } from 'react'
import { praise, preload, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { fly, useDrag, useDropTarget } from '../lib/drag'
import { shuffle, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'
import Pic from '../components/Pic'
import { Ark } from '../art/scenes/kit'

const INTRO = 'Help Noah! The animals go into the ark two by two. Find the two that look the same!'

function Animal({ id, a, picked, boarded, onMatch, onTap }: {
  id: number; a: string; picked: boolean; boarded: boolean; onMatch: (from: number, to: number) => boolean; onTap: (id: number) => void
}) {
  // Each animal can be picked up and dropped on its twin, and is a place a twin can be dropped.
  const target = useDropTarget(`animal-${id}`, (d: { id: number; a: string }) => d.id !== id && !boarded, 6)
  const drag = useDrag({ data: { id, a }, disabled: boarded, onStart: sfx.lift, onDrop: (t) => t.startsWith('animal-') && onMatch(id, Number(t.slice(7))), onTap: () => onTap(id) })
  return <button ref={target} data-card={id} className={`pair-card ${picked ? 'picked' : ''} ${boarded ? 'boarded' : ''}`} {...drag}><Pic e={a} /></button>
}

export default function TwoByTwo({ animals, names, onDone }: { animals: string[]; names: Record<string, string>; onDone: () => void }) {
  const cards = useMemo(() => shuffle([...animals, ...animals]).map((a, id) => ({ a, id })), [animals])
  const [picked, setPicked] = useState<number[]>([])
  const [boarded, setBoarded] = useState<string[]>([])
  const boardedRef = useRef<string[]>([])
  const [counting, setCounting] = useState<number | null>(null)
  const alive = useAlive()
  const busy = useRef(false)

  useEffect(() => {
    speak(INTRO)
    // Fetch the counting words now so the count keeps a steady beat later.
    preload(animals.map((_, i) => String((i + 1) * 2)))
  }, [])

  /** The pair hops off its cards and onto the ark; then count them in once all are aboard. */
  const board = async (x: number, y: number) => {
    const a = cards[x].a
    sfx.good()
    const all = [...boardedRef.current, a]
    boardedRef.current = all
    setPicked([])
    const ark = document.querySelector('.ark-dock .ark-emoji')
    const els = [x, y].map((n) => document.querySelector(`[data-card="${n}"]`)).filter(Boolean) as HTMLElement[]
    if (ark) {
      // (The cards stay hidden: they're on the ark now.)
      els.forEach((el) => (el.style.visibility = 'hidden'))
      await Promise.all(els.map((el, i) => wait(i * 90).then(() => fly(el, ark, { arc: 120, endScale: 0.5 }))))
    }
    setBoarded(all)
    sfx.plop()
    // Every pair is named as it boards, the last one too.
    const pair = `Two ${names[a] ?? 'animals'}!`
    if (all.length < animals.length) return void speak(pair)
    busy.current = true
    await speak(pair)
    if (!alive.current) return
    await speak(praise())
    if (!alive.current) return
    await speak("Let's count the animals, two at a time!")
    for (let n = 1; n <= animals.length; n++) {
      if (!alive.current) return
      setCounting(n * 2)
      sfx.count(n + 1)
      await speak(String(n * 2))
      await wait(250)
    }
    if (!alive.current) return
    await speak('All the animals are safe in the ark!')
    if (alive.current) onDone()
  }

  const match = (x: number, y: number) => {
    if (busy.current || x === y) return false
    if (cards[x].a !== cards[y].a) {
      sfx.oops()
      setPicked([y])
      setTimeout(() => alive.current && setPicked([]), 600)
      return false
    }
    board(x, y)
    return true
  }

  const tap = async (id: number) => {
    const card = cards[id]
    if (busy.current || boardedRef.current.includes(card.a) || picked.includes(id) || picked.length === 2) return
    sfx.pop()
    const next = [...picked, id]
    setPicked(next)
    if (next.length < 2) return
    if (cards[next[0]].a === cards[next[1]].a) return void board(next[0], next[1])
    sfx.oops()
    await wait(700)
    if (alive.current) setPicked([])
  }

  return (
    <div className="activity two-by-two">
      <button className="instruction" disabled={counting !== null} onClick={() => speak(INTRO)}>🔊 Find the pairs!</button>
      <div className="pair-grid">
        {cards.map((c) => (
          <Animal key={c.id} id={c.id} a={c.a} picked={picked.includes(c.id)} boarded={boarded.includes(c.a)} onMatch={match} onTap={tap} />
        ))}
      </div>
      <div className="ark-dock">
        {/* Noah's ark (the story's own drawing), where the pairs fly. Sized in em from .ark-emoji, like the emoji it replaced. */}
        <svg className="ark-emoji" viewBox="-180 -160 360 200" width="1.6em" height="0.9em" role="img" aria-label="the ark">
          <Ark x={0} y={0} s={1} door />
        </svg>
        <div className="ark-riders">
          {boarded.map((a, i) => {
            // While counting by twos, the pair being counted bounces and glows; counted pairs stay lit.
            const n = counting === null ? 0 : counting / 2
            const cls = i + 1 === n ? 'counting' : i + 1 < n ? 'counted' : ''
            return <span key={a} className={cls}><Pic e={a} /><Pic e={a} /></span>
          })}
        </div>
        {counting !== null && <div className="count-bubble" key={counting}>{counting}</div>}
      </div>
    </div>
  )
}
