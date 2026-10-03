// Bedtime: a calm, slow story to end playtime warmly, with a thank-you prayer and a verse,
// then "Goodnight". Starts from the "Pals are sleepy" reminder or the moon on the map.
import { useEffect, useState } from 'react'
import DressedPal from '../components/DressedPal'
import { BigButton } from '../components/ui'
import { palById, stageFor } from '../data/pals'
import { getProgress, playerName } from '../lib/progress'
import { setMood } from '../lib/music'
import { speak, stopSpeaking } from '../lib/speech'
import { STORY_ART } from '../art/scenes'
import { BuddyContext } from '../art/scenes/buddy'
import { useTapPictures } from '../lib/useTapPictures'

interface Page { scene: string; text: (name: string, pal: string) => string }

const PAGES: Page[] = [
  { scene: '🌅🌙', text: () => 'The sun went down, and the moon came up. God made the day, and God made the night.' },
  { scene: '✨⭐✨', text: () => 'One by one, the stars came out. God knows every star by name. And He knows you, too.' },
  { scene: '💤', text: (_, pal) => `All the Ark Pals are getting sleepy. ${pal} gives a great big yawn.` },
  { scene: '🙏', text: () => "Let's tell God thank you. Thank you, God, for today. Thank you for my family, and for my friends. Thank you for loving me." },
  { scene: '📖💛', text: () => 'The Bible says to give all your worries to God, because He cares for you. You can tell God about anything that makes you sad or scared. He cares for you, all night long.' },
  { scene: '🌙😴', text: (name) => `Goodnight, ${name}. God loves you so much. Sweet dreams!` },
]

/** The bedtime lines that don't depend on who's playing, for recording in Family voices. */
export const BEDTIME_LINES = [0, 1, 3, 4].map((i) => PAGES[i].text('', ''))

export default function Bedtime({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0)
  const p = getProgress()
  const buddy = palById(p.battler ?? p.starter ?? 'zippy')
  const stage = stageFor(buddy, p.pals[buddy.id] ?? 0)
  const page = PAGES[i]
  const text = page.text(playerName(), buddy.stages[stage].name)
  const Art = STORY_ART.bedtime?.[i]

  useEffect(() => {
    setMood('lullaby')
    return () => { stopSpeaking(); setMood('home') }
  }, [])
  useEffect(() => { speak(text) }, [i])
  // Living pictures: things to tap in the picture (lib/useTapPictures.ts).
  const tap = useTapPictures(i)

  const last = i === PAGES.length - 1
  return (
    <div className={`screen bedtime ${last ? 'asleep' : ''}`}>
      <div className="bed-stars" aria-hidden />
      {Art ? (
        <div className="bed-art" key={i} onClick={tap}><BuddyContext.Provider value={{ id: buddy.id, stage }}><Art /></BuddyContext.Provider></div>
      ) : (
        <>
          <div className="bed-scene" key={i}>{page.scene}</div>
          <div className="bed-pal"><DressedPal pal={buddy} stage={stage} size={150} outfit={p.outfits[buddy.id]} className={i >= 2 ? 'sleepy-pal' : 'bob'} /></div>
        </>
      )}
      <p className="bed-text" onClick={() => speak(text)}>{text}</p>
      <div className="bed-nav">
        {last
          ? <BigButton color="white" onClick={onDone}>🌙 Goodnight</BigButton>
          : <BigButton color="white" onClick={() => setI(i + 1)}>➡️</BigButton>}
      </div>
    </div>
  )
}
