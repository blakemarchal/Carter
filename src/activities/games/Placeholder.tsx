// Stands in for a mini-game that isn't built yet: the kit's backdrop and a button to go on, so an
// island can be played through while its game is being made.
import { useEffect, type ReactNode } from 'react'
import { BigButton } from '../../components/ui'
import { speak } from '../../lib/speech'
import { useAlive } from '../../lib/useAlive'
import { Board } from './Board'

export function GamePlaceholder({ title, intro, done, backdrop, onDone }: {
  title: string; intro: string; done: string; backdrop: ReactNode; onDone: () => void
}) {
  const alive = useAlive()
  useEffect(() => { speak(intro) }, [])
  return (
    <div className="activity game">
      <div className="practice-head"><h2>{title}</h2></div>
      <Board>{backdrop}</Board>
      <BigButton color="pink" onClick={async () => { await speak(done); if (alive.current) onDone() }}>➡️</BigButton>
    </div>
  )
}
