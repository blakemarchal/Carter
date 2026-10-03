// The end of a visit to an island: a little cliffhanger ("Will the dove find dry land?"), their Pal
// waving, and back to the map. The next visit starts after this, another day or right away.
import { useEffect } from 'react'
import DressedPal from './DressedPal'
import { BigButton } from './ui'
import { palById, stageFor } from '../data/pals'
import { useProgress } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

/** Their own Pal, waving goodbye. */
export function BuddyWave() {
  const p = useProgress()
  const pal = palById(p.battler ?? p.starter ?? 'zippy')
  return <DressedPal pal={pal} stage={stageFor(pal, p.pals[pal.id] ?? 0)} size={170} outfit={p.outfits[pal.id]} className="bob" />
}

export function VisitPause({ line, onDone }: { line: string; onDone: () => void }) {
  useEffect(() => {
    sfx.sparkle()
    speak(line)
    speak("Let's find out next time!", { interrupt: false })
  }, [])
  return (
    <div className="visit-pause">
      <h2>To be continued…</h2>
      <BuddyWave />
      <p>{line}</p>
      <BigButton color="pink" onClick={onDone}>🗺️ See you next time!</BigButton>
    </div>
  )
}
