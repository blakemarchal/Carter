// Drawn things first needed by the burning-bush island (its activities and pictures). Same style and rules as
// the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
import { useId } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, lighten, Shine, useShade } from './draw'

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

/** One leather sandal seen from above, toe up: a foot-shaped sole, a loop for the big toe, and straps over the foot. */
function Sandal({ flip }: { flip?: boolean }) {
  const LEATHER = '#b9824a'
  const sole = useShade(LEATHER, 0.35, 0.2)
  const strap = '#7a4524'
  // (a left sandal: the big toe on the right, nearer the middle of the pair; `flip` makes the right one)
  const outline = 'M33 12 C42 12 46 20 46 32 C46 46 42 54 42 66 C42 80 40 90 32 90 C24 90 21 80 21 66 C21 56 17 46 17 32 C17 20 23 12 33 12 Z'
  return (
    <g transform={flip ? 'translate(100 0) scale(-1 1)' : undefined} strokeLinejoin="round" strokeLinecap="round">
      <path d={outline} fill={sole.fill} stroke={ink(LEATHER)} strokeWidth={2.6} />
      {/* the worn, paler middle of the sole, where the foot goes */}
      <path d="M33 18 C40 18 41 26 41 34 C41 46 37 54 37 66 C37 78 36 84 32 84 C27 84 26 78 26 66 C26 56 22 46 22 34 C22 24 27 18 33 18 Z" fill={lighten(LEATHER, 0.25)} opacity={0.75} />
      {/* the toe loop, the straps across the foot, and the strap round the heel */}
      <path d="M38 26 L35 38" stroke={darken(strap, 0.2)} strokeWidth={6} />
      <path d="M38 26 L35 38" stroke={strap} strokeWidth={3.6} />
      <path d="M20 48 Q34 34 44 46" stroke={darken(strap, 0.2)} strokeWidth={7.5} fill="none" />
      <path d="M20 48 Q34 34 44 46" stroke={strap} strokeWidth={5} fill="none" />
      <path d="M22 70 Q32 62 42 70" stroke={darken(strap, 0.2)} strokeWidth={6.5} fill="none" />
      <path d="M22 70 Q32 62 42 70" stroke={strap} strokeWidth={4} fill="none" />
      <path d="M34 38 L32 66" stroke={strap} strokeWidth={3} />
      <circle cx={33} cy={41} r={3} fill="#e0b45a" stroke={darken('#e0b45a', 0.35)} strokeWidth={1.2} />
      <Shine x={27} y={22} rx={5} ry={2.6} rot={-60} />
    </g>
  )
}

/** Moses' sandals (🩴), a pair of leather sandals side by side, as he took them off on holy ground. */
function Sandals() {
  return (
    <g>
      <ellipse {...groundShadow(50, 93, 40)} />
      <g transform="translate(-3 0)"><Sandal /></g>
      <g transform="translate(3 0)"><Sandal flip /></g>
    </g>
  )
}

/** A flame shape: its round foot at (cx, by) and its tip h above, w wide on each side. */
const flamePath = (cx: number, by: number, w: number, h: number) =>
  `M${cx} ${by - h} C${cx + w * 0.35} ${by - h * 0.62} ${cx + w} ${by - h * 0.42} ${cx + w} ${by - h * 0.18} C${cx + w} ${by - h * 0.02} ${cx + w * 0.55} ${by} ${cx} ${by} C${cx - w * 0.55} ${by} ${cx - w} ${by - h * 0.02} ${cx - w} ${by - h * 0.18} C${cx - w} ${by - h * 0.42} ${cx - w * 0.35} ${by - h * 0.62} ${cx} ${by - h} Z`

/** One tongue of flame: orange outside, then yellow, then white-hot in the middle. */
const Flame = ({ cx, by, w, h, rot = 0 }: { cx: number; by: number; w: number; h: number; rot?: number }) => (
  <g transform={`rotate(${rot} ${cx} ${by})`}>
    <path d={flamePath(cx, by, w, h)} fill="#ffa63a" stroke="#f0782a" strokeWidth={1.6} strokeLinejoin="round" />
    <path d={flamePath(cx, by, w * 0.68, h * 0.8)} fill="#ffd451" />
    <path d={flamePath(cx, by, w * 0.36, h * 0.56)} fill="#fff6c8" />
  </g>
)

/**
 * The bush that was on fire but did not burn up: a round green bush with bright flames dancing up through its
 * leaves and over its top, in a warm glow. Its leaves stay green.
 */
function BurningBush() {
  const glow = uid(useId())
  const LEAF = '#58b858'
  const leaves: [number, number, number][] = [[30, 76, 12], [40, 64, 13], [52, 59, 14], [64, 66, 13], [71, 78, 11], [41, 80, 12], [59, 80, 12], [50, 70, 13]]
  const line = ink(LEAF)
  return (
    <g>
      <defs>
        <radialGradient id={glow}><stop offset="0" stopColor="#fff1b0" stopOpacity={0.95} /><stop offset="1" stopColor="#ffe9a0" stopOpacity={0} /></radialGradient>
        <linearGradient id={`${glow}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(LEAF, 0.24)} /><stop offset="0.6" stopColor={LEAF} /><stop offset="1" stopColor={darken(LEAF, 0.14)} />
        </linearGradient>
      </defs>
      <circle cx={50} cy={50} r={48} fill={`url(#${glow})`} />
      <ellipse {...groundShadow(50, 93, 34)} />
      {/* the big flames behind the leaves */}
      <Flame cx={27} by={76} w={7} h={26} rot={-16} />
      <Flame cx={73} by={76} w={7} h={26} rot={16} />
      <Flame cx={37} by={64} w={10} h={42} rot={-9} />
      <Flame cx={63} by={64} w={10} h={40} rot={9} />
      <Flame cx={50} by={60} w={13} h={54} />
      {/* the stems, and the leaves: green and fresh */}
      <path d="M49 93 Q46 86 38 80 M50 93 L50 70 M51 93 Q55 86 62 80" stroke="#7a5233" strokeWidth={3} fill="none" strokeLinecap="round" />
      {leaves.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r} fill={line} stroke={line} strokeWidth={4.4} />)}
      {leaves.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={`url(#${glow}l)`} />)}
      <path d="M34 58 q4 -4 8 0 M48 51 q4 -4 8 0 M62 58 q4 -4 8 0" stroke="#b6e8a0" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* little flames in front of the leaves */}
      <Flame cx={40} by={74} w={4.2} h={15} />
      <Flame cx={60} by={72} w={4.6} h={17} />
      <Flame cx={50} by={84} w={3.8} h={12} />
      {[[14, 22, 5], [86, 26, 4.5], [12, 58, 3.5], [88, 60, 3.5]].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r} L${x + r * 0.25} ${y - r * 0.25} L${x + r} ${y} L${x + r * 0.25} ${y + r * 0.25} L${x} ${y + r} L${x - r * 0.25} ${y + r * 0.25} L${x - r} ${y} L${x - r * 0.25} ${y - r * 0.25} Z`} fill="#ffe680" />
      ))}
    </g>
  )
}

export const ISL_BURNING_BUSH: Item[] = [
  // (🩴 is a thong sandal: these are leather sandals with a loop for the big toe.)
  { id: 'moses-sandals', name: 'sandals', emoji: ['🩴'], Draw: Sandals },
  { id: 'burning-bush', name: 'the bush that did not burn up', emoji: [], Draw: BurningBush },
]
