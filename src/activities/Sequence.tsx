// Put the pictures in order: tap them first, second, third… into the numbered slots.
// A wrong tap wiggles; after two misses the right picture glows.
import { useEffect, useMemo, useState } from 'react'
import type { Thing } from '../data/islands'
import { praise, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { shuffle, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

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
  const alive = useAlive()

  useEffect(() => { speak(intro) }, [])

  const tap = async (i: number) => {
    if (placed >= items.length) return
    if (i !== placed) {
      sfx.oops()
      setWrong(i)
      setMisses((m) => m + 1)
      speak('Hmm, what comes next?')
      setTimeout(() => setWrong(null), 600)
      return
    }
    sfx.pop()
    setMisses(0)
    const n = placed + 1
    setPlaced(n)
    if (n < items.length) return void speak(items[i].say)
    sfx.fanfare()
    await speak(`${items[i].say}! ${praise()} You put them all in order!`)
    if (!alive.current) return
    await wait(300)
    if (alive.current) onDone()
  }

  return (
    <div className="activity sequence">
      <h2>{title}</h2>
      <div className="seq-slots">
        {items.map((t, k) => (
          <div key={k} className={`seq-slot ${k < placed ? 'filled' : ''}`}>
            <span className="seq-num">{k + 1}</span>
            {k < placed && <span className="seq-emoji">{t.emoji}</span>}
          </div>
        ))}
      </div>
      <div className="seq-pool">
        {pool.map((t) => (
          <button key={t.i} className={`seq-card ${t.i < placed ? 'used' : ''} ${wrong === t.i ? 'wiggle' : ''} ${misses >= 2 && t.i === placed ? 'glow' : ''}`}
            disabled={t.i < placed} onClick={() => tap(t.i)}>{t.emoji}</button>
        ))}
      </div>
      <button className="instruction" onClick={() => speak(intro)}>🔊 Hear it again</button>
    </div>
  )
}
