import { useEffect } from 'react'
import PalArt from '../components/PalArt'
import { Confetti, BigButton } from '../components/ui'
import { palById } from '../data/pals'
import { addPalXp, addSticker } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

export default function Reward({ palId, sticker, onDone }: { palId: string; sticker: string; onDone: () => void }) {
  const pal = palById(palId)
  useEffect(() => {
    addPalXp(palId, 0)
    addSticker(sticker)
    sfx.fanfare()
    speak(`Hooray, Carter! A new friend! ${pal.stages[0].name} ${pal.intro} You also earned a ${sticker} sticker!`)
  }, [])
  return (
    <div className="activity reward">
      <Confetti count={60} />
      <h2>New Ark Pal!</h2>
      <PalArt pal={pal} size={220} className="bounce-in" />
      <div className="pal-name">{pal.stages[0].name} <small>{pal.fruit} Pal</small></div>
      <div className="sticker">{sticker}</div>
      <BigButton color="pink" onClick={onDone}>🚢 Back to the Ark</BigButton>
    </div>
  )
}
