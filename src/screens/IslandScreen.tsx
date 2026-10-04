// Plays one story island: its steps in order (see data/islands.ts), with a "leave?" check,
// resume-where-you-left-off, and the right music for each step. An island can have up to three
// visits, split by "pause" steps: each finished visit counts toward the daily voyage, and the next
// visit starts after the pause. First-try answers earn the island's stars (lib/score.ts).
import { useCallback, useEffect, useState } from 'react'
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
import SongSpot from '../activities/SongSpot'
import BuildIt from '../activities/games/BuildIt'
import SpotIt from '../activities/games/SpotIt'
import PaintIt from '../activities/games/PaintIt'
import SteerIt from '../activities/games/SteerIt'
import Rhythm from '../activities/games/Rhythm'
import ShareIt from '../activities/games/ShareIt'
import CatchIt from '../activities/games/CatchIt'
import type { Island, Step } from '../data/islands'
import { STORY_ART } from '../art/scenes'
import { completeIsland, getProgress, savedStep, today, update } from '../lib/progress'
import { countVisit } from '../lib/voyage'
import { ScoreContext, starsFor } from '../lib/score'
import { count } from '../lib/stats'
import { VisitPause } from '../components/VisitPause'
import BuddyCheer from '../components/BuddyCheer'
import { pauseNarration, preload, speak, stopSpeaking } from '../lib/speech'
import { setMood, type Mood } from '../lib/music'
import { backupNow } from '../lib/backup'

// (null: the step brings its own music, like a song or a rhythm game.)
const MOOD: Record<Step['kind'], Mood | null> = {
  story: 'story', pairs: 'play', practice: 'play', sequence: 'play', sort: 'play', quiz: 'story', count: 'play',
  trace: 'play', maze: 'play', verse: 'story', battle: 'battle', reward: 'home', pause: 'home',
  build: 'play', spot: 'play', paint: 'play', steer: 'play', share: 'play', catch: 'play', rhythm: null, song: null,
}

/** The steps of the visit that `step` is in: from just after the last pause before it, to its own pause. */
function visitOf(steps: Step[], step: number) {
  let from = step
  while (from > 0 && steps[from - 1].kind !== 'pause') from--
  let to = step
  while (to < steps.length - 1 && steps[to].kind !== 'pause') to++
  return { from, to }
}

export default function IslandScreen({ island, onExit }: { island: Island; onExit: () => void }) {
  const steps = island.steps!
  const reward = steps.length - 1 // the last step is always the reward
  // Pick up where this player left off (the start of the activity they were on).
  const [step, setStep] = useState(() => Math.min(savedStep(getProgress(), island.id, island.version), reward))
  const [leaving, setLeaving] = useState(false)
  // Whether this player had already finished the island (a replay doesn't count toward the daily voyage).
  const [wasDone] = useState(() => getProgress().islandsDone.includes(island.id))
  const [stars, setStars] = useState(0)
  const next = () => setStep((s) => s + 1)
  const exit = () => {
    if (step < reward && steps[step].kind !== 'pause') count(`quit:${island.id}:${step}`)
    stopSpeaking()
    pauseNarration(false)
    onExit()
  }
  // Each question card reports whether it was answered right the first time.
  const scored = useCallback((firstTry: boolean) => {
    update((p) => {
      const [r, t] = p.islandScore?.[island.id] ?? [0, 0]
      return { ...p, islandScore: { ...p.islandScore, [island.id]: [r + (firstTry ? 1 : 0), t + 1] } }
    })
  }, [island.id])
  useEffect(() => { if (step === 0) count(`start:${island.id}`) }, [])
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
      const [r, t] = getProgress().islandScore?.[island.id] ?? [0, 0]
      const n = starsFor(r, t)
      setStars(n)
      count(`done:${island.id}`)
      count(`stars:${island.id}:${n}`)
      update((p) => {
        const { [island.id]: _, ...islandScore } = p.islandScore ?? {}
        return {
          ...p, islandScore,
          stars: { ...p.stars, [island.id]: Math.max(p.stars[island.id] ?? 0, n) },
          islandVersion: { ...p.islandVersion, [island.id]: island.version ?? 1 },
          voyage: wasDone ? p.voyage : countVisit(p.voyage, today()),
        }
      })
      completeIsland(island.id)
      backupNow()
    }
    // A pause ends a visit: it counts toward today's voyage, and next time starts after it.
    if (current.kind === 'pause') {
      count(`visit:${island.id}`)
      if (!wasDone) update((p) => ({ ...p, voyage: countVisit(p.voyage, today()) }))
    }
    const saved = step === reward ? 0 : current.kind === 'pause' ? step + 1 : step
    update((p) => ({
      ...p, islandStep: { ...p.islandStep, [island.id]: saved },
      islandStepVersion: { ...p.islandStepVersion, [island.id]: island.version ?? 1 },
    }))
  }, [step])
  // Fetch this visit's story narration in the background so each page starts right away.
  const visit = visitOf(steps, step)
  useEffect(() => {
    const story = steps.slice(visit.from, visit.to + 1).find((s) => s.kind === 'story')
    if (story?.kind === 'story') preload(story.pages.map((pg, i) => (i === 0 ? `${story.title}. ${pg.text}` : pg.text)))
  }, [visit.from])

  let body
  switch (current.kind) {
    case 'story': {
      const first = current.first ?? 0
      body = <StoryBook title={current.title} pages={current.pages} art={STORY_ART[island.id]?.slice(first, first + current.pages.length)} onDone={next} />
      break
    }
    case 'pairs':
      body = <TwoByTwo animals={current.animals} names={current.names} done={current.done} onDone={next} />
      break
    case 'practice':
      body = <Practice skill={current.skill} title={current.title} decor={current.decor} theme={current.theme} intro={current.intro} onDone={next} />
      break
    case 'sequence':
      body = <Sequence title={current.title} intro={current.intro} items={current.items} onDone={next} />
      break
    case 'sort':
      body = <SortGame title={current.title} intro={current.intro} hint={current.hint} groups={current.groups} items={current.items} onDone={next} />
      break
    case 'quiz':
      body = <Quiz title={current.title} questions={current.questions} onDone={next} />
      break
    case 'count':
      body = <CountBasket title={current.title} intro={current.intro} item={current.item} plural={current.plural} basket={current.basket} basketArt={current.basketArt} into={current.into} rounds={current.rounds} done={current.done} onDone={next} />
      break
    case 'trace':
      body = <TraceLetter title={current.title} intro={current.intro} letters={current.letters} onDone={next} />
      break
    case 'maze':
      body = <Maze title={current.title} intro={current.intro} hero={current.hero} goal={current.goal} trail={current.trail} theme={current.theme} onDone={next} />
      break
    case 'build':
      body = <BuildIt title={current.title} intro={current.intro} done={current.done} kit={current.kit} onDone={next} />
      break
    case 'spot':
      body = <SpotIt title={current.title} intro={current.intro} done={current.done} plural={current.plural} kit={current.kit} onDone={next} />
      break
    case 'paint':
      body = <PaintIt title={current.title} intro={current.intro} done={current.done} kit={current.kit} onDone={next} />
      break
    case 'steer':
      body = <SteerIt title={current.title} intro={current.intro} done={current.done} kit={current.kit} onDone={next} />
      break
    case 'rhythm':
      body = <Rhythm title={current.title} intro={current.intro} done={current.done} kit={current.kit} onDone={next} />
      break
    case 'share':
      body = <ShareIt title={current.title} intro={current.intro} done={current.done} kit={current.kit} onDone={next} />
      break
    case 'catch':
      body = <CatchIt title={current.title} intro={current.intro} done={current.done} plural={current.plural} kit={current.kit} onDone={next} />
      break
    case 'song':
      body = <SongSpot song={current.song} intro={current.intro} onDone={next} />
      break
    case 'verse':
      body = <VerseBuilder chunks={current.chunks} reference={current.ref} onDone={next} />
      break
    case 'battle':
      body = <FriendlyBattle foeId={current.foe} foeIntro={current.intro} onDone={next} />
      break
    case 'pause':
      body = <VisitPause line={current.line} onDone={exit} onContinue={next} replay={wasDone} />
      break
    case 'reward':
      body = <Reward palId={current.pal} sticker={current.sticker} stickerName={current.stickerName} stars={stars} onDone={exit} />
      break
  }

  return (
    <div className="screen island-screen">
      <header className="island-head">
        <BackButton onClick={step === reward || current.kind === 'pause' ? exit : askToLeave} />
        {/* (the dots are this visit's steps) */}
        <StepDots total={visit.to - visit.from + 1} current={step - visit.from} />
        {/* (their Pal cheers them on in activities; stories, battles and songs have it on screen already) */}
        {['story', 'battle', 'reward', 'pause', 'song'].includes(current.kind) ? <span /> : <BuddyCheer />}
      </header>
      <ScoreContext.Provider value={scored}>
        <div className="island-body" key={step}>{body}</div>
      </ScoreContext.Provider>
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
