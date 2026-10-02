// Draws a Pal: picks the species drawing (src/art/pals/<species>.tsx) and wraps it in a 200x200 svg.
// Props stay the same for every caller. Idle animations (blinking, wagging…) run unless `still`.
import type { PalDef } from '../data/pals'
import { SPECIES } from '../art/pals'
import type { Mood } from '../art/kit'

interface Props {
  pal: Pick<PalDef, 'species'>
  stage?: number
  mood?: Mood
  size?: number
  silhouette?: boolean
  /** No idle animation (silhouettes, coloring pages). */
  still?: boolean
  className?: string
}

export default function PalArt({ pal, stage = 0, mood = 'happy', size = 160, silhouette, still, className }: Props) {
  const Body = SPECIES[pal.species]
  const anim = !still && !silhouette
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={`${anim ? 'pa-anim' : ''} ${className ?? ''}`}
      style={silhouette ? { filter: 'brightness(0) opacity(0.25)' } : undefined} aria-hidden>
      <g transform={`translate(100 110) scale(${0.85 + stage * 0.08}) translate(-100 -110)`}>
        <Body stage={stage} mood={mood} />
      </g>
    </svg>
  )
}
