// The end of a visit to an island: a little cliffhanger ("Will the dove find dry land?"), their Pal
// waving, and back to the map. The next visit starts after this, another day or right away.
import { useEffect, useState } from 'react'
import DressedPal from './DressedPal'
import { BigButton } from './ui'
import { palById, stageFor } from '../data/pals'
import { getProgress, today, useProgress } from '../lib/progress'
import { visitsLeft } from '../lib/voyage'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

/** Their own Pal, waving goodbye. */
export function BuddyWave() {
  const p = useProgress()
  const pal = palById(p.battler ?? p.starter ?? 'zippy')
  return <DressedPal pal={pal} stage={stageFor(pal, p.pals[pal.id] ?? 0)} size={170} outfit={p.outfits[pal.id]} className="bob" />
}

/**
 * `onContinue`: go straight on to the next visit, offered on a replay (`replay`) or when today's
 * voyage has a visit left after this one. (This screen opens just before the visit is counted.)
 */
export function VisitPause({ line, onDone, onContinue, replay }: { line: string; onDone: () => void; onContinue: () => void; replay: boolean }) {
  const [more] = useState(() => {
    const p = getProgress()
    return replay || visitsLeft(p.voyage, today(), p.dailyVisits) > 1
  })
  useEffect(() => {
    sfx.sparkle()
    speak(line)
    if (!/find out next time/i.test(line)) speak("Let's find out next time!", { interrupt: false })
  }, [])
  return (
    <div className="visit-pause">
      <h2>To be continued…</h2>
      <BuddyWave />
      <p>{line}</p>
      {more ? (
        <div className="leave-row">
          <BigButton color="white" onClick={onDone}>🗺️ Map</BigButton>
          <BigButton color="pink" onClick={onContinue}>▶️ Keep going!</BigButton>
        </div>
      ) : (
        <BigButton color="pink" onClick={onDone}>🗺️ See you next time!</BigButton>
      )}
    </div>
  )
}
