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
import { getProgress, playerName, switchProfile, tickPlayTime, useProfiles, useProgress } from './lib/progress'
import { encouragements, preload, setNarrator, setRate, speak, unlockSpeech } from './lib/speech'
import { setSfxEnabled, sfx } from './lib/sfx'
import { musicReady, setMood, setMusicEnabled } from './lib/music'
import { unlockAudio } from './lib/audio'

type Screen = 'title' | 'starter' | 'map' | 'ark' | 'parent' | 'island:noah'

const DAILY_MINUTES = 60

export default function App() {
  const [screen, setScreen] = useState<Screen>('title')
  const p = useProgress()
  const { active } = useProfiles()
  const [evolved, setEvolved] = useState<{ id: string; stage: number } | null>(null)
  const [sleepy, setSleepy] = useState(false)
  const stages = useRef<{ profile: string; byPal: Record<string, number> }>({ profile: active, byPal: {} })

  // Each player has their own voice and sound settings.
  useEffect(() => setRate(p.speechRate), [p.speechRate])
  useEffect(() => setNarrator(p.narrator), [p.narrator])
  useEffect(() => setMusicEnabled(p.music), [p.music])
  useEffect(() => setSfxEnabled(p.sfx), [p.sfx])

  // Islands pick their own music for each activity; everywhere else plays the home tune.
  useEffect(() => { if (!screen.startsWith('island')) setMood('home') }, [screen])

  // Count play time once a minute; gentle reminder at the daily limit.
  useEffect(() => {
    if (screen === 'title') return
    const t = setInterval(() => {
      tickPlayTime(60)
      if (getProgress().playSeconds >= DAILY_MINUTES * 60) setSleepy(true)
    }, 60_000)
    return () => clearInterval(t)
  }, [screen])

  // Celebrate when a Pal grows to its next stage (but not when switching to another player).
  useEffect(() => {
    if (stages.current.profile !== active) stages.current = { profile: active, byPal: {} }
    const seen = stages.current.byPal
    for (const pal of PALS) {
      if (!(pal.id in p.pals)) continue
      const st = stageFor(pal, p.pals[pal.id])
      const prev = seen[pal.id]
      if (prev !== undefined && st > prev) {
        setEvolved({ id: pal.id, stage: st })
        sfx.sparkle()
        sfx.fanfare()
        speak(`Whoa! ${pal.stages[prev].name} is growing! ${pal.stages[prev].name} became ${pal.stages[st].name}!`, { interrupt: false })
      }
      seen[pal.id] = st
    }
  }, [p.pals, active])

  const start = (profileId: string) => {
    // First tap: unlock sound on iOS, then start the music.
    unlockAudio()
    unlockSpeech()
    musicReady()
    switchProfile(profileId)
    setEvolved(null)
    setSleepy(false)
    const me = getProgress()
    setScreen(me.starter ? 'map' : 'starter')
    preload([
      'Where should we go? Tap an island!',
      'Welcome to your Ark! Tap a Pal to say hi.',
      ...encouragements(),
    ])
  }

  const go = (s: Screen) => setScreen(s)
  let view
  switch (screen) {
    case 'title': view = <Title onStart={start} />; break
    case 'starter': view = <StarterPick onDone={() => go('map')} />; break
    case 'map': view = <MapScreen onIsland={(id) => go(`island:${id}` as Screen)} onArk={() => go('ark')} onParent={() => go('parent')} onPlayers={() => go('title')} />; break
    case 'ark': view = <ArkScreen onBack={() => go('map')} />; break
    case 'parent': view = <ParentScreen onBack={() => go('map')} />; break
    case 'island:noah': view = <NoahIsland onExit={() => go('map')} />; break
  }

  const evolvedPal = evolved && PALS.find((x) => x.id === evolved.id)!
  return (
    <div className="app">
      <div className="app-view" key={active}>{view}</div>
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
          <p>Great playing today, {playerName()}. Time for a rest!</p>
          <BigButton color="white" onClick={() => setSleepy(false)}>OK</BigButton>
        </div>
      )}
    </div>
  )
}
