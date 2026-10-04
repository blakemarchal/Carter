// Drawn things first needed by the Jesus Calms the Storm island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
import type { Item } from './types'
import { ink, Shine, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** A little four-pointed star at (x, y), r big. */
const star = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`

/**
 * The disciples' fishing boat on the calm lake after the storm (the island's sticker): the wooden boat from the story,
 * with its blue band, its square sail and its little red flag, floating on still water under the new moon and a star.
 * (No emoji: ⛵ is any sailboat.)
 */
function CalmBoat() {
  const wood = useShade('#b5794a', 0.25, 0.22)
  const sail = useShade('#ffe3a1', 0.45, 0.1)
  const sea = useShade('#6f8fe0', 0.4, 0.15)
  return (
    <g {...ROUND}>
      <defs>{wood.def}{sail.def}{sea.def}</defs>
      {/* the new moon and a twinkling star */}
      <path d="M14 6 A11.5 11.5 0 1 0 28 20 A9 9 0 0 1 14 6 Z" fill="#fff3b0" stroke="#d9bf5a" strokeWidth={2} />
      <path d={star(88, 14, 6)} fill="#ffe680" stroke="#d9b440" strokeWidth={1.2} />
      {/* the mast, its flag, the yard, and the sail full of a gentle wind */}
      <path d="M55 70 L55 13" stroke="#7a5233" strokeWidth={3.5} />
      <path d="M55 13 Q61 13 66 17 Q60 18 55 20 Z" fill="#e0604d" stroke="#9a3a2a" strokeWidth={1.2} />
      <path d="M33 22 L79 19" stroke="#7a5233" strokeWidth={3} />
      <path d="M34 23 L78 20 Q84 33 78 47 Q57 51 36 49 Q30 36 34 23 Z" fill={sail.fill} stroke="#b39a62" strokeWidth={2} />
      <path d="M55.5 21 Q57 34 56 49" stroke="#d6bd84" strokeWidth={1.4} fill="none" />
      {/* the hull, with its blue band, and the stem curling up at the prow */}
      <path d="M90 59 Q96 52 94 45 Q92 41 88 44" stroke="#6f4322" strokeWidth={4.5} fill="none" />
      <path d="M90 59 Q96 52 94 45 Q92 41 88 44" stroke="#d9a066" strokeWidth={2} fill="none" />
      <path d="M7 62 Q47 74 90 58 Q92 71 84 80 Q50 89 17 81 Q8 74 7 62 Z" fill={wood.fill} stroke="#6f4322" strokeWidth={2.6} />
      <path d="M8.5 66 Q47 78 90.5 62 L90 68.5 Q47 84 10.5 72 Z" fill="#3f8fb8" />
      <path d="M7 62 Q47 74 90 58" stroke="#d9a066" strokeWidth={3.2} fill="none" />
      <path d="M7 62 Q4 56 6 51" stroke="#6f4322" strokeWidth={4.5} fill="none" />
      <path d="M7 62 Q4 56 6 51" stroke="#d9a066" strokeWidth={2} fill="none" />
      <Shine x={28} y={77} rx={6} ry={2.4} rot={8} />
      {/* the still water, with lines of light */}
      <path d="M4 83 Q50 78 96 83 L96 90 Q96 95 91 95 L9 95 Q4 95 4 90 Z" fill={sea.fill} stroke={ink('#6f8fe0')} strokeWidth={2.5} />
      <path d="M14 89 l14 0 M41 91 l18 0 M71 89 l13 0" stroke="#ffffff" strokeWidth={2} opacity={0.75} />
    </g>
  )
}

export const ISL_STORM: Item[] = [
  { id: 'calm-boat', name: 'the fishing boat on the calm lake', Draw: CalmBoat },
]
