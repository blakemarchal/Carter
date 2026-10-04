// The end of the voyage: every island on the map is done. The map shows this once (progress
// voyageCelebrated): confetti, Gladshade with a few of her Pals, the narrator, and a big "Keep sailing!".
// Styles: VoyageComplete.css.
import { useEffect, useState } from 'react'
import DressedPal from './DressedPal'
import { BigButton, Confetti } from './ui'
import { palById, stageFor } from '../data/pals'
import { GLADSHADE, VOYAGE_DONE } from '../data/shade'
import type { Progress } from '../lib/progress'
import { preload, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { useAlive } from '../lib/useAlive'
import './VoyageComplete.css'

/** A few of her Pals to stand with Gladshade: her buddy first, then the Pals she's played with most. */
function crew(p: Progress, max: number) {
  const buddy = p.battler ?? p.starter
  const ids = Object.keys(p.pals).filter((id) => id !== GLADSHADE && id !== buddy).sort((a, b) => p.pals[b] - p.pals[a])
  return (buddy && buddy in p.pals ? [buddy, ...ids] : ids).slice(0, max).map((id) => {
    const pal = palById(id)
    return { pal, stage: stageFor(pal, p.pals[id] ?? 0), outfit: p.outfits[id] }
  })
}

export default function VoyageComplete({ p, onDone }: { p: Progress; onDone: () => void }) {
  const alive = useAlive()
  const [ready, setReady] = useState(false)
  const [pals] = useState(() => crew(p, 4))
  const glad = palById(GLADSHADE)
  const gladStage = stageFor(glad, p.pals[GLADSHADE] ?? 0)
  useEffect(() => {
    sfx.fanfare()
    // (the button comes once it's been said; never later than this, in case the voice is stuck)
    const t = setTimeout(() => setReady(true), 25_000)
    preload(VOYAGE_DONE)
    ;(async () => {
      for (const line of VOYAGE_DONE) {
        await speak(line)
        if (!alive.current) return
      }
      setReady(true)
    })()
    return () => clearTimeout(t)
  }, [])
  const left = pals.slice(0, Math.ceil(pals.length / 2))
  const right = pals.slice(left.length)
  const side = (list: typeof pals, from: number) => list.map(({ pal, stage, outfit }, i) => (
    <span key={pal.id} className="vd-pal" style={{ animationDelay: `${0.5 + (from + i) * 0.15}s` }}>
      <DressedPal pal={pal} stage={stage} size={130} outfit={outfit} className={`bob d${(from + i) % 3}`} />
    </span>
  ))
  return (
    <div className="voyage-done" role="dialog" aria-label="You sailed all seven seas!">
      <Confetti count={60} />
      {ready && <Confetti count={40} />}
      <div className="vd-rays" aria-hidden />
      <h1 className="vd-title">You did it!</h1>
      <p className="vd-sub">You sailed all seven seas!</p>
      <div className="vd-seas" aria-hidden>{Array.from({ length: 7 }, (_, i) => <span key={i} style={{ animationDelay: `${0.3 + i * 0.12}s` }}>⭐</span>)}</div>
      <div className="vd-crew">
        {side(left, 0)}
        <span className="vd-glad"><DressedPal pal={glad} stage={gladStage} size={210} outfit={p.outfits[GLADSHADE]} className="bob" /><b>{glad.stages[gladStage].name}</b></span>
        {side(right, left.length)}
      </div>
      <div className="vd-go">
        {ready && <BigButton color="pink" className="vd-btn" onClick={onDone}>⛵ Keep sailing!</BigButton>}
      </div>
    </div>
  )
}
