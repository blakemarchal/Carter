// Sort the pictures: one at a time, "Where does the fish go?", then tap its group (sea / land / sky).
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Thing } from '../data/islands'
import { praise, retry, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { shuffle, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

type Group = Thing & { id: string }
type Item = Thing & { group: string }

export default function SortGame({ title, intro, groups, items, onDone }: {
  title: string; intro: string; groups: Group[]; items: Item[]; onDone: () => void
}) {
  const order = useMemo(() => shuffle(items), [items])
  const [n, setN] = useState(0)
  const [sorted, setSorted] = useState<Record<string, string[]>>({})
  const [wrong, setWrong] = useState<string | null>(null)
  const [misses, setMisses] = useState(0)
  const [flying, setFlying] = useState(false)
  const alive = useAlive()
  const busy = useRef(false) // a ref, so two quick taps can't both count
  const item = order[n]

  const ask = (it: Item) => speak(`Where does ${it.say} go?`)

  useEffect(() => {
    ;(async () => {
      await speak(intro)
      if (alive.current && order[0]) ask(order[0])
    })()
  }, [])

  const tap = async (g: Group) => {
    if (!item || busy.current) return
    if (g.id !== item.group) {
      sfx.oops()
      setWrong(g.id)
      setMisses((m) => m + 1)
      speak(retry())
      setTimeout(() => setWrong(null), 600)
      return
    }
    sfx.good()
    busy.current = true
    setFlying(true)
    setMisses(0)
    setSorted((s) => ({ ...s, [g.id]: [...(s[g.id] ?? []), item.emoji] }))
    const last = n + 1 >= order.length
    await speak(`That's right, ${g.say}!${last ? ` ${praise()}` : ''}`)
    if (!alive.current) return
    if (last) {
      // Stay "busy": the last card doesn't come back.
      sfx.fanfare()
      await wait(600)
      if (alive.current) onDone()
      return
    }
    busy.current = false
    setFlying(false)
    setN(n + 1)
    ask(order[n + 1])
  }

  return (
    <div className="activity sort">
      <h2>{title}</h2>
      <div className="sort-item">
        {item && !flying && <button key={n} className="sort-card" onClick={() => ask(item)}>{item.emoji}</button>}
      </div>
      <div className="sort-groups">
        {groups.map((g) => (
          <button key={g.id} className={`sort-bin ${wrong === g.id ? 'wiggle' : ''} ${misses >= 2 && item?.group === g.id ? 'glow' : ''}`} onClick={() => tap(g)}>
            <span className="bin-emoji">{g.emoji}</span>
            <span className="bin-items">{(sorted[g.id] ?? []).join('')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
