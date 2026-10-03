// A Pal wearing its accessory (bow, hat…) from the Ark. The accessory sits on top of its head.
import PalArt from './PalArt'
import type { PalDef } from '../data/pals'
import { PartyHat } from '../art/partyHat'
import { accessoryById, type Accessory } from '../lib/care'

/** An accessory's picture: its emoji, or the drawn party hat. */
export function AccessoryIcon({ a, size = 34 }: { a: Accessory; size?: number }) {
  return a.id === 'partyhat' ? <PartyHat size={size * 0.8} /> : <>{a.emoji}</>
}

export default function DressedPal({ pal, stage = 0, size = 160, outfit, className, mood }: {
  pal: PalDef; stage?: number; size?: number; outfit?: string; className?: string; mood?: 'happy' | 'grumpy'
}) {
  const acc = accessoryById(outfit)
  return (
    <span className={`dressed ${className ?? ''}`} style={{ width: size, height: size }}>
      <PalArt pal={pal} stage={stage} size={size} mood={mood} />
      {acc && (acc.id === 'partyhat'
        ? <PartyHat className="dressed-hat" size={size * 0.3} />
        : <span className="dressed-acc" style={{ fontSize: size * 0.28 }}>{acc.emoji}</span>)}
    </span>
  )
}
