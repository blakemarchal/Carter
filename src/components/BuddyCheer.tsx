// Their own Pal in the corner of an island activity, cheering them on: a hop and a heart for a right
// answer, a big jump and a star when a game is finished, a little head-tilt for a try-again. It
// hears about these from the sound effects (lib/sfx.ts sends an 'ark:react' event).
import { useEffect, useState } from 'react'
import DressedPal from './DressedPal'
import { palById, stageFor } from '../data/pals'
import { useProgress } from '../lib/progress'

type Reaction = { kind: 'good' | 'yay' | 'oops' | ''; n: number }

export default function BuddyCheer() {
  const p = useProgress()
  const pal = palById(p.battler ?? p.starter ?? 'zippy')
  const [r, setR] = useState<Reaction>({ kind: '', n: 0 })
  useEffect(() => {
    const on = (e: Event) => setR((x) => ({ kind: (e as CustomEvent<Reaction['kind']>).detail, n: x.n + 1 }))
    window.addEventListener('ark:react', on)
    return () => window.removeEventListener('ark:react', on)
  }, [])
  return (
    <span className="buddy-cheer" aria-hidden>
      {/* (a new key each time, so the hop starts again) */}
      <span key={r.n} className={`buddy-move ${r.kind}`}>
        <DressedPal pal={pal} stage={stageFor(pal, p.pals[pal.id] ?? 0)} size={68} outfit={p.outfits[pal.id]} />
        {r.kind === 'good' && <span className="buddy-pop">❤️</span>}
        {r.kind === 'yay' && <span className="buddy-pop">⭐</span>}
      </span>
    </span>
  )
}
