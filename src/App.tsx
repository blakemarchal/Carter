import { useEffect, useRef, useState } from 'react'
import Title from './screens/Title'
import StarterPick from './screens/StarterPick'
import MapScreen from './screens/MapScreen'
import ArkScreen from './screens/ArkScreen'
import ParentScreen from './screens/ParentScreen'
import IslandScreen from './screens/IslandScreen'
import Bedtime from './screens/Bedtime'
import SingAlong from './screens/SingAlong'
import { islandById } from './data/islands'
import EvolutionScene from './components/EvolutionScene'
import { BigButton } from './components/ui'
import { PALS, stageFor } from './data/pals'
import { getProgress, playerName, switchProfile, tickPlayTime, today, useProfiles, useProgress } from './lib/progress'
import { encouragements, preload, setFamilyVoices, setNarrator, setRate, unlockSpeech } from './lib/speech'
import { loadRecordings } from './lib/recordings'
import { setSfxEnabled } from './lib/sfx'
import { musicReady, setMood, setMusicEnabled } from './lib/music'
import { unlockAudio } from './lib/audio'
import { backupSoon } from './lib/backup'
import { warmEgg } from './lib/care'

type Screen = 'title' | 'starter' | 'map' | 'ark' | 'parent' | 'bedtime' | 'sing' | `island:${string}`

const DAILY_MINUTES = 60

export default function App() {
  const [screen, setScreen] = useState<Screen>('title')
  const p = useProgress()
  const { active } = useProfiles()
  const [evolved, setEvolved] = useState<{ id: string; from: number; to: number } | null>(null)
  const [sleepy, setSleepy] = useState(false)
  const stages = useRef<{ profile: string; byPal: Record<string, number> }>({ profile: active, byPal: {} })

  // Each player has their own voice and sound settings.
  useEffect(() => setRate(p.speechRate), [p.speechRate])
  useEffect(() => setNarrator(p.narrator), [p.narrator])
  useEffect(() => setFamilyVoices(p.familyVoices), [p.familyVoices])
  useEffect(() => setMusicEnabled(p.music), [p.music])
  useEffect(() => setSfxEnabled(p.sfx), [p.sfx])

  // Islands, bedtime and sing-along pick their own music; everywhere else plays the home tune.
  useEffect(() => { if (!screen.startsWith('island') && screen !== 'bedtime' && screen !== 'sing') setMood('home') }, [screen])

  // Count play time (only while playing and the app is on screen); gentle reminder once a day at the limit.
  const playing = screen !== 'title'
  const reminded = useRef('')
  useEffect(() => {
    if (!playing) return
    let last = Date.now()
    const t = setInterval(() => {
      const now = Date.now()
      const secs = Math.min(30, Math.round((now - last) / 1000)) // a long gap means the iPad was asleep
      last = now
      if (document.hidden) return
      tickPlayTime(secs)
      const key = `${active}|${today()}`
      if (getProgress().playSeconds >= DAILY_MINUTES * 60 && reminded.current !== key) {
        reminded.current = key
        setSleepy(true)
      }
    }, 15_000)
    return () => clearInterval(t)
  }, [playing, active])

  // Celebrate when a Pal grows to its next stage (but not when switching to another player).
  useEffect(() => {
    if (stages.current.profile !== active) stages.current = { profile: active, byPal: {} }
    const seen = stages.current.byPal
    for (const pal of PALS) {
      if (!(pal.id in p.pals)) continue
      const st = stageFor(pal, p.pals[pal.id])
      const prev = seen[pal.id]
      if (prev !== undefined && st > prev) {
        // The scene does its own narration and sounds, and holds other narration until it's done.
        setEvolved({ id: pal.id, from: prev, to: st })
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
    // Apply this player's voice now (the effects above run after this), so preloading uses it.
    setNarrator(me.narrator)
    setRate(me.speechRate)
    setScreen(me.starter ? 'map' : 'starter')
    backupSoon()
    loadRecordings()
    warmEgg()
    preload([
      'Where should we go? Tap an island!',
      'Welcome to your Ark! Tap a Pal to say hi.',
      ...encouragements(),
    ])
  }

  const go = (s: Screen) => setScreen(s)
  // A player without a starter Pal (new, erased, or switched in the Parent Corner) picks one first.
  const shown: Screen = !p.starter && screen !== 'title' && screen !== 'parent' ? 'starter' : screen
  let view
  switch (shown) {
    case 'title': view = <Title onStart={start} />; break
    case 'starter': view = <StarterPick onDone={() => go('map')} />; break
    case 'map': view = <MapScreen onIsland={(id) => go(`island:${id}`)} onArk={() => go('ark')} onParent={() => go('parent')} onPlayers={() => go('title')} onBedtime={() => go('bedtime')} onSing={() => go('sing')} />; break
    case 'sing': view = <SingAlong onBack={() => go('map')} />; break
    case 'bedtime': view = <Bedtime onDone={() => go('title')} />; break
    case 'ark': view = <ArkScreen onBack={() => go('map')} />; break
    case 'parent': view = <ParentScreen onBack={() => go('map')} />; break
    default: {
      const isl = islandById(shown.slice('island:'.length))
      view = isl?.steps ? <IslandScreen key={isl.id} island={isl} onExit={() => go('map')} /> : null
    }
  }

  const evolvedPal = evolved && PALS.find((x) => x.id === evolved.id)!
  return (
    <div className="app">
      <div className="app-view" key={active}>{view}</div>
      {evolvedPal && evolved && (
        <EvolutionScene key={`${evolved.id}-${evolved.to}`} pal={evolvedPal} from={evolved.from} to={evolved.to} onDone={() => setEvolved(null)} />
      )}
      {sleepy && (
        <div className="overlay sleepy">
          <div className="zzz">💤</div>
          <h2>The Pals are getting sleepy!</h2>
          <p>Great playing today, {playerName()}. Time for a rest!</p>
          <div className="leave-row">
            <BigButton color="white" onClick={() => { setSleepy(false); go('bedtime') }}>🌙 Bedtime story</BigButton>
            <BigButton color="white" onClick={() => setSleepy(false)}>OK</BigButton>
          </div>
        </div>
      )}
    </div>
  )
}
