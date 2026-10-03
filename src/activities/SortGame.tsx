// Sort the pictures: one at a time, "Where does the fish go?", then drag it into its group
// (sea / land / sky), or tap the group. A wrong group wiggles and the picture comes back.
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Thing } from '../data/islands'
import { praise, retry, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { fly, useDrag, useDropTarget } from '../lib/drag'
import { shuffle, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

type Group = Thing & { id: string }
type Item = Thing & { group: string }

function Bin({ g, wrong, glow, items, onTap }: { g: Group; wrong: boolean; glow: boolean; items: string[]; onTap: (g: Group) => void }) {
  const target = useDropTarget(`bin-${g.id}`)
  return (
    <button ref={target} className={`sort-bin ${wrong ? 'wiggle' : ''} ${glow ? 'glow' : ''}`} onClick={() => onTap(g)}>
      <span className="bin-emoji">{g.emoji}</span>
      <span className="bin-items">{items.map((e, i) => <span key={i}>{e}</span>)}</span>
    </button>
  )
}

function Card({ item, onDrop, onTap }: { item: Item; onDrop: (bin: string) => boolean; onTap: () => void }) {
  const drag = useDrag({ data: item, onStart: sfx.lift, onDrop: (t) => t.startsWith('bin-') && onDrop(t.slice(4)), onTap })
  return <button className="sort-card" {...drag}>{item.emoji}</button>
}

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
  const card = useRef<HTMLDivElement>(null)
  const item = order[n]

  const ask = (it: Item) => speak(`Where does ${it.say} go?`)

  useEffect(() => {
    ;(async () => {
      await speak(intro)
      if (alive.current && order[0]) ask(order[0])
    })()
  }, [])

  const miss = (id: string) => {
    sfx.oops()
    setWrong(id)
    setMisses((m) => m + 1)
    speak(retry())
    setTimeout(() => setWrong(null), 600)
  }
  /** Sorted into group `g`. */
  const right = async (g: Group) => {
    sfx.plop()
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
  const drop = (id: string) => {
    if (!item || busy.current) return false
    const g = groups.find((x) => x.id === id)!
    if (g.id !== item.group) { miss(g.id); return false }
    right(g)
    return true
  }
  // Tapping a group: if it's the right one, the picture flies into it.
  const tapBin = async (g: Group) => {
    if (!item || busy.current) return
    if (g.id !== item.group) return miss(g.id)
    busy.current = true
    const el = card.current?.querySelector('.sort-card')
    const to = document.querySelector(`.sort-bin:nth-child(${groups.indexOf(g) + 1})`)
    if (el && to) {
      ;(el as HTMLElement).style.visibility = 'hidden'
      await fly(el, to, { endScale: 0.4 })
    }
    right(g)
  }

  return (
    <div className="activity sort">
      <h2>{title}</h2>
      <div className="sort-item" ref={card}>
        {item && !flying && <Card key={n} item={item} onDrop={drop} onTap={() => ask(item)} />}
      </div>
      <div className="sort-groups">
        {groups.map((g) => (
          <Bin key={g.id} g={g} wrong={wrong === g.id} glow={misses >= 2 && item?.group === g.id} items={sorted[g.id] ?? []} onTap={tapBin} />
        ))}
      </div>
      <p className="muted">Drag it to where it lives!</p>
    </div>
  )
}
