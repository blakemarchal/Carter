// Development only: one mini-game mechanic, playable with its demo kit (#gallery/game/<kind>), or with
// an island's own kit (#gallery/game/<kind>/<island>), laid out the way the island screen lays it out.
import { useState } from 'react'
import BuildIt from '../activities/games/BuildIt'
import SpotIt from '../activities/games/SpotIt'
import PaintIt from '../activities/games/PaintIt'
import SteerIt from '../activities/games/SteerIt'
import Rhythm from '../activities/games/Rhythm'
import ShareIt from '../activities/games/ShareIt'
import CatchIt from '../activities/games/CatchIt'
import type { Step } from '../data/islands'
import { useIsland } from '../lib/useIsland'
import { DEMO_GAMES } from './demo/games'

type GameStep = Extract<Step, { kind: 'build' | 'spot' | 'paint' | 'steer' | 'rhythm' | 'share' | 'catch' }>

export default function GameDemo({ kind, island }: { kind: string; island?: string }) {
  const [round, setRound] = useState(0)
  const [done, setDone] = useState(false)
  const isl = useIsland(island)
  if (island && !isl) return <p style={{ padding: 20 }}>Loading {island}…</p>
  const fromIsland = isl?.steps.find((s): s is GameStep => s.kind === kind)
  const demo = DEMO_GAMES[kind as keyof typeof DEMO_GAMES]
  const step = (fromIsland ?? (demo ? { kind, ...demo } : undefined)) as GameStep | undefined
  if (!step) return <p style={{ padding: 20 }}>No {kind} game{island ? ` on ${island}` : ''}.</p>
  const onDone = () => setDone(true)
  let body
  switch (step.kind) {
    case 'build': body = <BuildIt title={step.title} intro={step.intro} done={step.done} kit={step.kit} onDone={onDone} />; break
    case 'spot': body = <SpotIt title={step.title} intro={step.intro} done={step.done} plural={step.plural} kit={step.kit} onDone={onDone} />; break
    case 'paint': body = <PaintIt title={step.title} intro={step.intro} done={step.done} kit={step.kit} onDone={onDone} />; break
    case 'steer': body = <SteerIt title={step.title} intro={step.intro} done={step.done} kit={step.kit} onDone={onDone} />; break
    case 'rhythm': body = <Rhythm title={step.title} intro={step.intro} done={step.done} kit={step.kit} onDone={onDone} />; break
    case 'share': body = <ShareIt title={step.title} intro={step.intro} done={step.done} kit={step.kit} onDone={onDone} />; break
    case 'catch': body = <CatchIt title={step.title} intro={step.intro} done={step.done} plural={step.plural} kit={step.kit} onDone={onDone} />; break
  }
  return (
    <div className="screen island-screen" data-game-done={done ? 'yes' : 'no'}>
      <header className="island-head"><span /><button onClick={() => { setDone(false); setRound(round + 1) }}>restart</button><span /></header>
      <div className="island-body" key={round}>{done ? <h2 className="game-demo-done" style={{ margin: 'auto' }}>Done!</h2> : body}</div>
    </div>
  )
}
