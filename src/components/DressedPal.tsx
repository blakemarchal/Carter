// A Pal wearing its accessory (bow, hat…) from the Ark. The accessory sits on top of its head.
import PalArt from './PalArt'
import type { PalDef } from '../data/pals'
import { accessoryById } from '../lib/care'

export default function DressedPal({ pal, stage = 0, size = 160, outfit, className, mood }: {
  pal: PalDef; stage?: number; size?: number; outfit?: string; className?: string; mood?: 'happy' | 'grumpy'
}) {
  const acc = accessoryById(outfit)
  return (
    <span className={`dressed ${className ?? ''}`} style={{ width: size, height: size }}>
      <PalArt pal={pal} stage={stage} size={size} mood={mood} />
      {acc && <span className="dressed-acc" style={{ fontSize: size * 0.28 }}>{acc.emoji}</span>}
    </span>
  )
}
