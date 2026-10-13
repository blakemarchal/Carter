// Drawn player icons (the Parent Corner and the title screen), for the two choices no other drawing covers:
// a unicorn and a little science flask. Each draws in a 100 x 100 box (see ./types.ts).
import type { Item } from './types'
import { CuteFace, ink, lighten, Shine, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** A unicorn's head, side on: white with a rainbow mane and a golden horn. */
function Unicorn() {
  const body = useShade('#ffffff', 0.25, 0.12)
  const line = ink('#e8d6f0')
  const mane = ['#ff8fc7', '#ffc35a', '#8fd6ff', '#b99bff']
  return (
    <g {...ROUND}>
      <defs>{body.def}</defs>
      {/* the mane, in curls down the back of the neck */}
      {mane.map((c, i) => (
        <circle key={c} cx={64 - i * 2} cy={28 + i * 14} r={13} fill={c} stroke={ink(c)} strokeWidth={2.2} />
      ))}
      {/* the head and neck */}
      <path d="M58 92 C52 76 52 62 50 54 C40 58 22 62 18 52 C14 42 26 34 36 30 C42 22 52 18 60 22 C70 26 72 44 74 60 C76 72 76 84 74 92 Z"
        fill={body.fill} stroke={line} strokeWidth={3} />
      {/* the horn, golden, with its spiral */}
      <path d="M47 23 L40 2 L55 20 Z" fill="#ffd34d" stroke="#d9a31a" strokeWidth={2.2} />
      <path d="M43 12 L50 15 M45 18 L52 20" stroke="#d9a31a" strokeWidth={1.6} fill="none" />
      {/* an ear */}
      <path d="M58 22 L64 8 L66 24 Z" fill={lighten('#ffd6ea', 0.2)} stroke={line} strokeWidth={2.2} />
      {/* a nostril, and the face */}
      <circle cx={22} cy={50} r={1.6} fill="#c9a4c9" />
      <g transform="translate(40 40) scale(0.55)"><CuteFace x={0} y={0} gap={10} /></g>
      <circle cx={30} cy={48} r={4} fill="#ffb3c8" opacity={0.7} />
      <Shine x={40} y={30} rx={5} ry={2.5} />
    </g>
  )
}

/** A round science flask with pink bubbling water. */
function Flask() {
  const glass = useShade('#eef8ff', 0.25, 0.1)
  const water = '#ff8fc7'
  return (
    <g {...ROUND}>
      <defs>{glass.def}</defs>
      <path d="M40 10 L60 10 L58 16 L58 38 C76 46 82 62 76 76 C70 90 30 90 24 76 C18 62 24 46 42 38 L42 16 Z" fill={glass.fill} stroke="#7aa0c0" strokeWidth={3} />
      <path d="M27 66 C36 60 64 72 74 64 C76 76 68 86 50 86 C32 86 25 78 27 66 Z" fill={water} stroke={ink(water)} strokeWidth={2.2} />
      <rect x={37} y={6} width={26} height={8} rx={3} fill="#c9a4ff" stroke={ink('#c9a4ff')} strokeWidth={2.2} />
      {[[44, 54, 4], [56, 46, 3], [50, 34, 2.5]].map(([x, y, r]) => <circle key={y} cx={x} cy={y} r={r} fill="#fff" stroke="#9ecbe8" strokeWidth={1.5} />)}
      <Shine x={34} y={58} rx={4} ry={8} />
    </g>
  )
}

export const AVATARS: Item[] = [
  { id: 'unicorn', name: 'unicorn', emoji: ['🦄'], Draw: Unicorn },
  { id: 'flask', name: 'science flask', emoji: ['🧪'], Draw: Flask },
]
