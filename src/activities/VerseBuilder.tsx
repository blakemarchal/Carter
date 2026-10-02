// Memory verse: listen, then tap the pieces in order.
import { useEffect, useMemo, useState } from 'react'
import { praise, retry, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { shuffle } from '../lib/util'

export default function VerseBuilder({ chunks, reference, onDone }: { chunks: string[]; reference: string; onDone: () => void }) {
  const full = chunks.join(' ')
  const pool = useMemo(() => shuffle(chunks.map((c, i) => ({ c, i }))), [chunks])
  const [placed, setPlaced] = useState(0)
  const [lit, setLit] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const [wrong, setWrong] = useState<number | null>(null)

  const listen = async () => {
    setReady(false)
    await speak(`Our memory verse! Listen.`)
    for (let i = 0; i < chunks.length; i++) {
      setLit(i)
      await speak(chunks[i])
    }
    setLit(null)
    await speak(`${reference}. Now you build it! Tap the words in order.`)
    setReady(true)
  }

  useEffect(() => { listen() }, [])

  const tap = async (i: number) => {
    if (!ready) return
    if (i === placed) {
      sfx.pop()
      speak(chunks[i])
      const n = placed + 1
      setPlaced(n)
      if (n === chunks.length) {
        sfx.fanfare()
        await speak(`${full} ${reference}. ${praise()} Let's say it together one more time!`)
        await speak(full)
        onDone()
      }
    } else {
      sfx.oops()
      setWrong(i)
      speak(`${retry()} What comes next? ${chunks[placed]}`)
      setTimeout(() => setWrong(null), 600)
    }
  }

  return (
    <div className="activity verse">
      <h2>🌈 Memory Verse</h2>
      <div className="verse-line">
        {chunks.map((c, i) => (
          <span key={i} className={`verse-slot ${i < placed ? 'filled' : ''} ${lit === i ? 'lit' : ''}`}>{i < placed || lit !== null ? c : '…'}</span>
        ))}
      </div>
      <div className="verse-ref">{reference}</div>
      <div className="verse-pool">
        {pool.map(({ c, i }) => (
          <button key={i} className={`verse-chip ${i < placed ? 'used' : ''} ${wrong === i ? 'wiggle' : ''} ${ready && i === placed && wrong !== null ? 'glow' : ''}`}
            disabled={i < placed} onClick={() => tap(i)}>{c}</button>
        ))}
      </div>
      <button className="instruction" onClick={listen}>🔊 Hear it again</button>
    </div>
  )
}
