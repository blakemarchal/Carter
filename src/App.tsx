import { useEffect, useRef, useState } from 'react'
import Title from './screens/Title'
import StarterPick from './screens/StarterPick'
import MapScreen from './screens/MapScreen'
import ArkScreen from './screens/ArkScreen'
import ParentScreen from './screens/ParentScreen'
import NoahIsland from './screens/NoahIsland'
import PalArt from './components/PalArt'
import { BigButton, Confetti } from './components/ui'
import { PALS, stageFor } from './data/pals'
import { getProgress, tickPlayTime, useProgress } from './lib/progress'
import { setRate, speak } from './lib/speech'
import { sfx } from './lib/sfx'

type Screen = 'title' | 'starter' | 'map' | 'ark' | 'parent' | 'island:noah'

const DAILY_MINUTES = 60

export default function App() {
  const [screen, setScreen] = useState<Screen>('title')
  const p = useProgress()
  const [evolved, setEvolved] = useState<{ id: string; stage: number } | null>(null)
  const [sleepy, setSleepy] = useState(false)
  const stages = useRef<Record<string, number>>({})

  useEffect(() => setRate(getProgress().speechRate), [])

  // Count play time once a minute; gentle reminder at the daily limit.
  useEffect(() => {
    if (screen === 'title') return
    const t = setInterval(() => {
      tickPlayTime(60)
      if (getProgress().playSeconds >= DAILY_MINUTES * 60) setSleepy(true)
    }, 60_000)
    return () => clearInterval(t)
  }, [screen])

  // Celebrate when a Pal grows to its next stage.
  useEffect(() => {
    for (const pal of PALS) {
      if (!(pal.id in p.pals)) continue
      const st = stageFor(pal, p.pals[pal.id])
      const prev = stages.current[pal.id]
      if (prev !== undefined && st > prev) {
        setEvolved({ id: pal.id, stage: st })
        sfx.fanfare()
        speak(`Whoa! ${pal.stages[prev].name} is growing! ${pal.stages[prev].name} became ${pal.stages[st].name}!`, { interrupt: false })
      }
      stages.current[pal.id] = st
    }
  }, [p.pals])

  const go = (s: Screen) => setScreen(s)
  let view
  switch (screen) {
    case 'title': view = <Title onStart={() => go(p.starter ? 'map' : 'starter')} />; break
    case 'starter': view = <StarterPick onDone={() => go('map')} />; break
    case 'map': view = <MapScreen onIsland={(id) => go(`island:${id}` as Screen)} onArk={() => go('ark')} onParent={() => go('parent')} />; break
    case 'ark': view = <ArkScreen onBack={() => go('map')} />; break
    case 'parent': view = <ParentScreen onBack={() => go('map')} />; break
    case 'island:noah': view = <NoahIsland onExit={() => go('map')} />; break
  }

  const evolvedPal = evolved && PALS.find((x) => x.id === evolved.id)!
  return (
    <div className="app">
      {view}
      {evolvedPal && evolved && (
        <div className="overlay" onClick={() => setEvolved(null)}>
          <Confetti />
          <PalArt pal={evolvedPal} stage={evolved.stage} size={240} className="evolve" />
          <h2>{evolvedPal.stages[evolved.stage].name}!</h2>
          <BigButton color="pink" onClick={() => setEvolved(null)}>Yay! 💖</BigButton>
        </div>
      )}
      {sleepy && (
        <div className="overlay sleepy">
          <div className="zzz">💤</div>
          <h2>The Pals are getting sleepy!</h2>
          <p>Great playing today, Carter. Time for a rest!</p>
          <BigButton color="white" onClick={() => setSleepy(false)}>OK</BigButton>
        </div>
      )}
    </div>
  )
}
