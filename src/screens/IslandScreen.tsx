// Plays one story island: its steps in order (see data/islands.ts), with a "leave?" check,
// resume-where-you-left-off, and the right music for each step.
import { useEffect, useState } from 'react'
import { BackButton, BigButton, StepDots } from '../components/ui'
import StoryBook from '../activities/StoryBook'
import TwoByTwo from '../activities/TwoByTwo'
import Practice from '../activities/Practice'
import VerseBuilder from '../activities/VerseBuilder'
import FriendlyBattle from '../activities/FriendlyBattle'
import Reward from '../activities/Reward'
import Sequence from '../activities/Sequence'
import SortGame from '../activities/SortGame'
import Quiz from '../activities/Quiz'
import CountBasket from '../activities/CountBasket'
import TraceLetter from '../activities/TraceLetter'
import Maze from '../activities/Maze'
import type { Island, Step } from '../data/islands'
import { completeIsland, getProgress, update } from '../lib/progress'
import { pauseNarration, preload, speak, stopSpeaking } from '../lib/speech'
import { setMood, type Mood } from '../lib/music'
import { backupNow } from '../lib/backup'

const MOOD: Record<Step['kind'], Mood> = {
  story: 'story', pairs: 'play', practice: 'play', sequence: 'play', sort: 'play', quiz: 'story', count: 'play',
  trace: 'play', maze: 'play', verse: 'story', battle: 'battle', reward: 'home',
}

export default function IslandScreen({ island, onExit }: { island: Island; onExit: () => void }) {
  const steps = island.steps!
  const reward = steps.length - 1 // the last step is always the reward
  // Pick up where this player left off (the start of the activity they were on).
  const [step, setStep] = useState(() => Math.min(getProgress().islandStep[island.id] ?? 0, reward))
  const [leaving, setLeaving] = useState(false)
  const next = () => setStep((s) => s + 1)
  const exit = () => { stopSpeaking(); pauseNarration(false); onExit() }
  // The activity pauses its narration while the question is up, and picks up again on "Keep playing".
  const askToLeave = () => {
    setLeaving(true)
    stopSpeaking()
    speak('Go back to the map? Your place is saved!', { important: true })
    pauseNarration(true)
  }
  const stay = () => { setLeaving(false); pauseNarration(false) }

  const current = steps[step]
  useEffect(() => setMood(MOOD[current.kind]), [step])
  useEffect(() => {
    // Reaching the reward finishes the island, even if she leaves without tapping the button.
    if (step === reward) {
      completeIsland(island.id)
      backupNow()
    }
    const saved = step === reward ? 0 : step
    update((p) => ({ ...p, islandStep: { ...p.islandStep, [island.id]: saved } }))
  }, [step])
  // Fetch the story narration in the background so each page starts right away.
  useEffect(() => {
    const story = steps.find((s) => s.kind === 'story')
    if (story?.kind === 'story') preload(story.pages.map((pg, i) => (i === 0 ? `${story.title}. ${pg.text}` : pg.text)))
  }, [])

  let body
  switch (current.kind) {
    case 'story':
      body = <StoryBook title={current.title} pages={current.pages} onDone={next} />
      break
    case 'pairs':
      body = <TwoByTwo animals={current.animals} names={current.names} onDone={next} />
      break
    case 'practice':
      body = <Practice skill={current.skill} title={current.title} decor={current.decor} theme={current.theme} intro={current.intro} onDone={next} />
      break
    case 'sequence':
      body = <Sequence title={current.title} intro={current.intro} items={current.items} onDone={next} />
      break
    case 'sort':
      body = <SortGame title={current.title} intro={current.intro} groups={current.groups} items={current.items} onDone={next} />
      break
    case 'quiz':
      body = <Quiz title={current.title} questions={current.questions} onDone={next} />
      break
    case 'count':
      body = <CountBasket title={current.title} intro={current.intro} item={current.item} plural={current.plural} basket={current.basket} into={current.into} rounds={current.rounds} onDone={next} />
      break
    case 'trace':
      body = <TraceLetter title={current.title} intro={current.intro} letters={current.letters} onDone={next} />
      break
    case 'maze':
      body = <Maze title={current.title} intro={current.intro} hero={current.hero} goal={current.goal} onDone={next} />
      break
    case 'verse':
      body = <VerseBuilder chunks={current.chunks} reference={current.ref} onDone={next} />
      break
    case 'battle':
      body = <FriendlyBattle foeId={current.foe} foeIntro={current.intro} onDone={next} />
      break
    case 'reward':
      body = <Reward palId={current.pal} sticker={current.sticker} stickerName={current.stickerName} onDone={exit} />
      break
  }

  return (
    <div className="screen island-screen">
      <header className="island-head">
        <BackButton onClick={step === reward ? exit : askToLeave} />
        <StepDots total={steps.length} current={step} />
        <span />
      </header>
      <div className="island-body" key={step}>{body}</div>
      {leaving && (
        <div className="overlay">
          <h2>Go back to the map?</h2>
          <p>Your place on the island is saved.</p>
          <div className="leave-row">
            <BigButton color="white" onClick={stay}>▶️ Keep playing</BigButton>
            <BigButton color="pink" onClick={exit}>🗺️ Map</BigButton>
          </div>
        </div>
      )}
    </div>
  )
}
