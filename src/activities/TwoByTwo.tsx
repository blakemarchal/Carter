// Match the animals two by two, then count them into the ark by 2s.
import { useEffect, useMemo, useState } from 'react'
import { praise, preload, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { shuffle, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

const INTRO = 'Help Noah! Find the animals that match, two by two. Tap two that are the same.'

export default function TwoByTwo({ animals, names, onDone }: { animals: string[]; names: Record<string, string>; onDone: () => void }) {
  const cards = useMemo(() => shuffle([...animals, ...animals]).map((a, id) => ({ a, id })), [animals])
  const [picked, setPicked] = useState<number[]>([])
  const [boarded, setBoarded] = useState<string[]>([])
  const [counting, setCounting] = useState<number | null>(null)
  const alive = useAlive()

  useEffect(() => {
    speak(INTRO)
    // Fetch the counting words now so the count keeps a steady beat later.
    preload(animals.map((_, i) => String((i + 1) * 2)))
  }, [])

  const tap = async (id: number) => {
    const card = cards[id]
    if (boarded.includes(card.a) || picked.includes(id) || picked.length === 2) return
    sfx.pop()
    const next = [...picked, id]
    setPicked(next)
    if (next.length < 2) return
    const [x, y] = next.map((n) => cards[n].a)
    if (x === y) {
      sfx.good()
      const all = [...boarded, x]
      setBoarded(all)
      setPicked([])
      if (all.length === animals.length) {
        await speak(praise())
        if (!alive.current) return
        await speak("Now let's count them into the ark by twos!")
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
      } else {
        speak(`Two ${names[x] ?? 'animals'}!`)
      }
    } else {
      sfx.oops()
      await wait(700)
      if (alive.current) setPicked([])
    }
  }

  return (
    <div className="activity two-by-two">
      <button className="instruction" disabled={counting !== null} onClick={() => speak(INTRO)}>🔊 Find the pairs!</button>
      <div className="pair-grid">
        {cards.map((c) => (
          <button key={c.id}
            className={`pair-card ${picked.includes(c.id) ? 'picked' : ''} ${boarded.includes(c.a) ? 'boarded' : ''}`}
            onClick={() => tap(c.id)}>{c.a}</button>
        ))}
      </div>
      <div className="ark-dock">
        <span className="ark-emoji">🚢</span>
        <div className="ark-riders">
          {boarded.map((a, i) => {
            // While counting by twos, the pair being counted bounces and glows; counted pairs stay lit.
            const n = counting === null ? 0 : counting / 2
            const cls = i + 1 === n ? 'counting' : i + 1 < n ? 'counted' : ''
            return <span key={a} className={cls}>{a}{a}</span>
          })}
        </div>
        {counting !== null && <div className="count-bubble" key={counting}>{counting}</div>}
      </div>
    </div>
  )
}
