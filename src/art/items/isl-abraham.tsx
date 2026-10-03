// Drawn things first needed by the abraham island (its activities and pictures). Same style and rules as
// the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
import type { Item } from './types'
import { CuteFace, ink, Shine, useShade } from './draw'
import { starPath, twinklePath } from '../kit'

const GOLD = '#ffd23f'

/** A shining star (🌟): a golden star with a happy face, glowing, with rays between its points and little sparkles. */
function ShiningStar() {
  const body = useShade(GOLD, 0.45, 0.15)
  const line = ink(GOLD)
  return (
    <g>
      <defs>{body.def}</defs>
      {[47, 39, 31].map((r) => <circle key={r} cx={50} cy={53} r={r} fill="#ffe680" opacity={0.2} />)}
      {/* rays shining out between the star's points */}
      {[-54, 18, 90, 162, 234].map((a) => (
        <path key={a} d="M47.5 53 L49 12 Q50 10 51 12 L52.5 53 Z" fill="#ffc43a" opacity={0.9} transform={`rotate(${a + 90} 50 53)`} />
      ))}
      <path d={starPath(50, 55, 37)} fill={body.fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
      <CuteFace x={50} y={57} s={0.3} gap={12} />
      <Shine x={40} y={44} rx={4.5} ry={2.6} />
      {[[13, 16, 7], [87, 14, 6], [88, 84, 5.5], [12, 86, 5]].map(([x, y, r]) => (
        <path key={x * 100 + y} d={twinklePath(x, y, r)} fill="#fff4b3" stroke={line} strokeWidth={1.4} strokeLinejoin="round" />
      ))}
    </g>
  )
}

export const ISL_ABRAHAM: Item[] = [
  { id: 'shining-star', name: 'shining star', emoji: ['🌟'], Draw: ShiningStar },
]
