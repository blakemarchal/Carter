import { useState } from 'react'
import { BackButton, StepDots } from '../components/ui'
import StoryBook from '../activities/StoryBook'
import TwoByTwo from '../activities/TwoByTwo'
import Practice from '../activities/Practice'
import VerseBuilder from '../activities/VerseBuilder'
import FriendlyBattle from '../activities/FriendlyBattle'
import Reward from '../activities/Reward'
import { NOAH_PAIRS, NOAH_STORY, NOAH_VERSE } from '../data/noah'
import { completeIsland } from '../lib/progress'
import { stopSpeaking } from '../lib/speech'

const STEPS = ['story', 'pairs', 'words', 'numbers', 'verse', 'battle', 'reward'] as const

export default function NoahIsland({ onExit }: { onExit: () => void }) {
  const [step, setStep] = useState(0)
  const next = () => setStep((s) => s + 1)
  const exit = () => { stopSpeaking(); onExit() }

  let body
  switch (STEPS[step]) {
    case 'story':
      body = <StoryBook title="Noah and the Big Boat" pages={NOAH_STORY} onDone={next} />
      break
    case 'pairs':
      body = <TwoByTwo animals={NOAH_PAIRS} onDone={next} />
      break
    case 'words':
      body = <Practice skill="reading" title="Word Boat" decor="⛵" intro="Let's help the animals with their words! Read the word, then tap the picture." onDone={next} />
      break
    case 'numbers':
      body = <Practice skill="numbers" title="Raindrop Numbers" decor="🌧️" intro="Drip, drop! Let's count the raindrops!" onDone={next} />
      break
    case 'verse':
      body = <VerseBuilder chunks={NOAH_VERSE.chunks} reference={NOAH_VERSE.ref} onDone={next} />
      break
    case 'battle':
      body = <FriendlyBattle foeId="rumble"
        foeIntro="Oh no! A grumpy storm cloud named Rumble is blocking the rainbow! Rumble just needs a friend."
        onDone={next} />
      break
    case 'reward':
      body = <Reward palId="pip" sticker="🌈" onDone={() => { completeIsland('noah'); exit() }} />
      break
  }

  return (
    <div className="screen island-screen">
      <header className="island-head">
        <BackButton onClick={exit} />
        <StepDots total={STEPS.length} current={step} />
        <span />
      </header>
      <div className="island-body" key={step}>{body}</div>
    </div>
  )
}
