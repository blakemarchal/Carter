// Memory verse: listen, then build it: drag the word pieces into the verse in order (or tap them).
import { useEffect, useMemo, useRef, useState } from 'react'
import { praise, retry, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { fly, useDrag, useDropTarget } from '../lib/drag'
import { shuffle } from '../lib/util'
import { useAlive } from '../lib/useAlive'

function Slot({ i, text, filled, lit, next }: { i: number; text: string; filled: boolean; lit: boolean; next: boolean }) {
  const target = useDropTarget(`verse-${i}`, () => next, 18)
  return <span ref={target} data-slot={i} className={`verse-slot ${filled ? 'filled' : ''} ${lit ? 'lit' : ''} ${next ? 'next' : ''}`}>{text}</span>
}

function Chip({ c, used, wrong, glow, disabled, onDrop, onTap }: {
  c: string; used: boolean; wrong: boolean; glow: boolean; disabled: boolean; onDrop: () => boolean; onTap: (el: HTMLElement) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag({ data: c, disabled: used || disabled, onStart: sfx.lift, onDrop: (t) => t.startsWith('verse-') && onDrop(), onTap: () => ref.current && onTap(ref.current) })
  return <button ref={ref} className={`verse-chip ${used ? 'used' : ''} ${wrong ? 'wiggle' : ''} ${glow ? 'glow' : ''}`} disabled={used} {...drag}>{c}</button>
}

export default function VerseBuilder({ chunks, reference, onDone }: { chunks: string[]; reference: string; onDone: () => void }) {
  const full = chunks.join(' ')
  // Shuffle until the pieces are out of order, so there's always something to build.
  const pool = useMemo(() => {
    let p = shuffle(chunks.map((c, i) => ({ c, i })))
    while (chunks.length > 1 && p.every((x, i) => x.i === i)) p = shuffle(p)
    return p
  }, [chunks])
  const alive = useAlive()
  const [placed, setPlaced] = useState(0)
  const placedRef = useRef(0)
  const flying = useRef(false)
  const [lit, setLit] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const [wrong, setWrong] = useState<number | null>(null)

  const listen = async () => {
    setReady(false)
    await speak(`Our memory verse! Listen.`)
    for (let i = 0; i < chunks.length; i++) {
      if (!alive.current) return
      setLit(i)
      await speak(chunks[i])
    }
    if (!alive.current) return
    setLit(null)
    await speak(`${reference}. Now you build it! Drag the words in order.`)
    if (alive.current) setReady(true)
  }

  useEffect(() => { listen() }, [])

  const place = async (i: number) => {
    sfx.plop()
    speak(chunks[i])
    const n = placedRef.current + 1
    placedRef.current = n
    setPlaced(n)
    if (n === chunks.length) {
      sfx.fanfare()
      await speak(`${full} ${reference}.`)
      if (!alive.current) return
      await speak(praise())
      if (!alive.current) return
      await speak("Let's say it together one more time!")
      if (!alive.current) return
      await speak(full)
      if (alive.current) onDone()
    }
  }
  const miss = (i: number) => {
    sfx.oops()
    setWrong(i)
    speak(`${retry()} What comes next? ${chunks[placedRef.current]}`)
    setTimeout(() => setWrong(null), 600)
  }
  const drop = (i: number) => {
    if (!ready) return false
    if (i !== placedRef.current) { miss(i); return false }
    place(i)
    return true
  }
  const tap = async (i: number, el: HTMLElement) => {
    if (!ready || flying.current) return
    if (i !== placedRef.current) return miss(i)
    const slot = document.querySelector(`.verse-slot[data-slot="${i}"]`)
    flying.current = true
    if (slot) {
      el.style.visibility = 'hidden'
      await fly(el, slot, { endScale: 0.9, fade: false, arc: 60 })
      el.style.visibility = ''
    }
    flying.current = false
    place(i)
  }

  return (
    <div className="activity verse">
      <h2>🌈 Memory Verse</h2>
      <div className="verse-line">
        {chunks.map((c, i) => (
          <Slot key={i} i={i} text={i < placed || lit !== null ? c : '…'} filled={i < placed} lit={lit === i} next={ready && i === placed} />
        ))}
      </div>
      <div className="verse-ref">{reference}</div>
      <div className="verse-pool">
        {pool.map(({ c, i }) => (
          <Chip key={i} c={c} used={i < placed} wrong={wrong === i} glow={ready && i === placed && wrong !== null} disabled={!ready} onDrop={() => drop(i)} onTap={(el) => tap(i, el)} />
        ))}
      </div>
      {/* Only while building: replaying mid-read or mid-celebration would start a second read-aloud. */}
      <button className="instruction" disabled={!ready || placed === chunks.length} onClick={listen}>🔊 Hear it again</button>
    </div>
  )
}
