// Drawn things first needed by the daniel island (its activities and pictures). Same style and rules as
// the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the drawing is what
// that emoji means. Every item can be used anywhere once it's here.
import { useId } from 'react'
import type { Item } from './types'
import { Person, PEOPLE } from '../people'

/** One of God's angels: in a shining white robe with a gold sash, white wings at the sides, waving hello, in a soft glow.
 *  (No emoji: 👼 is a baby angel.) */
function Angel() {
  const id = `ag${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        <radialGradient id={id}><stop offset="0" stopColor="#fff6b0" stopOpacity={0.9} /><stop offset="0.6" stopColor="#fff6b0" stopOpacity={0.45} /><stop offset="1" stopColor="#fff6b0" stopOpacity={0} /></radialGradient>
      </defs>
      <circle cx={50} cy={50} r={49} fill={`url(#${id})`} />
      <Person x={50} y={95} s={0.56} look={{ ...PEOPLE.angel, glow: false }} pose="wave" />
    </g>
  )
}

export const ISL_DANIEL: Item[] = [
  { id: 'daniel-angel', name: 'angel', Draw: Angel },
]
