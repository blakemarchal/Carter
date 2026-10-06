// Plays one exercise in a practice round: says what to do (🔊 says it again), then hands over to the
// exercise's own player (./registry EXERCISES). When it's done, it scores, praises and moves on, the
// same way a question card does.
import { useContext, useEffect } from 'react'
import { praise, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { recordAnswer } from '../lib/progress'
import { useAlive } from '../lib/useAlive'
import { ScoreContext } from '../lib/score'
import { EXERCISES } from './registry'
import type { Exercise } from './types'

export default function ExerciseCard({ ex, onSolved }: { ex: Exercise; onSolved: (firstTry: boolean) => void }) {
  const alive = useAlive()
  const score = useContext(ScoreContext)
  const Player = EXERCISES[ex.kind]

  useEffect(() => {
    if (!Player) onSolved(true) // (a kind with no player can't be played: skip it)
    else speak(ex.say)
  }, [ex])

  const onResult = async (firstTry: boolean) => {
    score?.(firstTry)
    sfx.good()
    recordAnswer(ex.skill, firstTry)
    await speak(praise())
    if (alive.current) onSolved(firstTry)
  }

  if (!Player) return null
  return (
    <div className={`q-card ex-card ex-${ex.kind}`}>
      <button className="q-prompt" aria-label="Hear it again" onClick={() => speak(ex.say)}>🔊</button>
      <Player ex={ex} onResult={onResult} />
    </div>
  )
}
