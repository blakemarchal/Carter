// Match the animals two by two, then count them into the ark by 2s.
import { useEffect, useMemo, useState } from 'react'
import { praise, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { shuffle, wait } from '../lib/util'
import { recordAnswer } from '../lib/progress'

const NAMES: Record<string, string> = { '🦁': 'lions', '🐘': 'elephants', '🦒': 'giraffes', '🐧': 'penguins', '🦓': 'zebras', '🐒': 'monkeys' }
const INTRO = 'Help Noah! Find the animals that match, two by two. Tap two that are the same.'

export default function TwoByTwo({ animals, onDone }: { animals: string[]; onDone: () => void }) {
  const cards = useMemo(() => shuffle([...animals, ...animals]).map((a, id) => ({ a, id })), [animals])
  const [picked, setPicked] = useState<number[]>([])
  const [boarded, setBoarded] = useState<string[]>([])
  const [counting, setCounting] = useState<number | null>(null)

  useEffect(() => { speak(INTRO) }, [])

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
        await speak(`${praise()} Now let's count them into the ark by twos!`)
        for (let n = 1; n <= animals.length; n++) {
          setCounting(n * 2)
          sfx.count(n + 1)
          await speak(String(n * 2))
        }
        recordAnswer('numbers', true)
        await speak('All the animals are safe in the ark!')
        onDone()
      } else {
        speak(`Two ${NAMES[x] ?? 'animals'}!`)
      }
    } else {
      sfx.oops()
      await wait(700)
      setPicked([])
    }
  }

  return (
    <div className="activity two-by-two">
      <button className="instruction" onClick={() => speak(INTRO)}>🔊 Find the pairs!</button>
      <div className="pair-grid">
        {cards.map((c) => (
          <button key={c.id}
            className={`pair-card ${picked.includes(c.id) ? 'picked' : ''} ${boarded.includes(c.a) ? 'boarded' : ''}`}
            onClick={() => tap(c.id)}>{c.a}</button>
        ))}
      </div>
      <div className="ark-dock">
        <span className="ark-emoji">🚢</span>
        <div className="ark-riders">{boarded.map((a) => <span key={a}>{a}{a}</span>)}</div>
        {counting !== null && <div className="count-bubble" key={counting}>{counting}</div>}
      </div>
    </div>
  )
}
