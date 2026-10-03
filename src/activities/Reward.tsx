import { useEffect, useState } from 'react'
import PalArt from '../components/PalArt'
import { Confetti, BigButton } from '../components/ui'
import { palById, palIntro, stageFor } from '../data/pals'
import { addPalXp, addSticker, getProgress, playerName } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

export default function Reward({ palId, sticker, stickerName, onDone }: { palId: string; sticker: string; stickerName: string; onDone: () => void }) {
  const pal = palById(palId)
  // Whether this Pal is new (a replayed island greets an old friend, at the stage it has grown to).
  const [xp] = useState(() => getProgress().pals[palId])
  const isNew = xp === undefined
  const stage = isNew ? 0 : stageFor(pal, xp)
  useEffect(() => {
    addPalXp(palId, 0)
    addSticker(sticker)
    sfx.fanfare()
    speak(isNew
      ? `Hooray, ${playerName()}! A new friend! ${palIntro(pal)} You also earned a ${stickerName} sticker!`
      : `Hooray, ${playerName()}! ${pal.stages[stage].name} is so happy to see you again! You did the whole island!`)
  }, [])
  return (
    <div className="activity reward">
      <Confetti count={60} />
      <h2>{isNew ? 'New Ark Pal!' : 'You did the whole island!'}</h2>
      <PalArt pal={pal} stage={stage} size={220} className="bounce-in" />
      <div className="pal-name">{pal.stages[stage].name} <small>{pal.fruit} Pal</small></div>
      <div className="sticker">{sticker}</div>
      <BigButton color="pink" onClick={onDone}>🗺️ Back to the map</BigButton>
    </div>
  )
}
