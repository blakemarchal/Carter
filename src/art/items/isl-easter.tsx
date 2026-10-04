// Drawn things first needed by the Easter Morning island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
// The round flat bread is drawn here once, for the item and for the story pictures (scenes/easter.tsx sets it
// on the table at Jesus' special supper, and puts the two halves of a broken one in His hands).
import { useId } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, Shine, useShade } from './draw'

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')
const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** The flat bread's colors: the golden crust, its outline, and the toasty spots. */
export const BREAD = { crust: '#e6b46a', line: '#a8702c', spot: '#c98a3e', top: '#f2cf8e' }

/**
 * A round flat bread, as at Jesus' special supper (Luke 22:19), seen a little from above: its golden top with
 * toasty spots and little pricked holes, and its edge underneath. (x, y): its middle; it's `r` wide on each side.
 */
export function FlatBread({ x, y, r = 40 }: { x: number; y: number; r?: number }) {
  const k = r / 40
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} {...ROUND}>
      <ellipse cx={0} cy={6} rx={40} ry={22} fill={BREAD.spot} stroke={BREAD.line} strokeWidth={2.6} />
      <ellipse cx={0} cy={0} rx={40} ry={22} fill={BREAD.crust} stroke={BREAD.line} strokeWidth={2.6} />
      <ellipse cx={-4} cy={-3} rx={30} ry={14} fill={BREAD.top} opacity={0.75} />
      {[[-22, -4, 5, 3], [10, -9, 6, 3.2], [20, 6, 5, 2.6], [-8, 9, 6, 2.8], [-28, 7, 3.5, 2]].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={BREAD.spot} opacity={0.75} />
      ))}
      {[[-12, -8], [0, -2], [12, 2], [-16, 4], [4, 10], [24, -4], [-4, -12]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.4} fill={BREAD.line} opacity={0.7} />
      ))}
    </g>
  )
}

/** Half of a round flat bread, broken across the middle (the broken edge on the right; `flip` puts it on the left). */
export function HalfBread({ x, y, r = 24, flip }: { x: number; y: number; r?: number; flip?: boolean }) {
  const k = r / 40
  // (the half's outline: the round edge, then the jagged break down its middle)
  const d = 'M4 -22 Q-36 -22 -40 0 Q-36 22 4 22 L0 15 L6 8 L1 1 L7 -6 L1 -13 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -k : k} ${k})`} {...ROUND}>
      <path d={d} transform="translate(0 6)" fill={BREAD.spot} stroke={BREAD.line} strokeWidth={2.6} />
      <path d={d} fill={BREAD.crust} stroke={BREAD.line} strokeWidth={2.6} />
      <path d="M0 15 L6 8 L1 1 L7 -6 L1 -13 L4 -22 L10 -16 L5 -6 L11 1 L6 9 L10 16 L4 22 Z" fill="#f6e2b8" stroke={BREAD.line} strokeWidth={2} />
      <ellipse cx={-18} cy={-4} rx={13} ry={9} fill={BREAD.top} opacity={0.75} />
      {[[-24, 6, 5, 2.6], [-10, -10, 5, 2.6], [-6, 10, 4, 2.2]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={BREAD.spot} opacity={0.75} />)}
    </g>
  )
}

/** The flat bread as an item: one round loaf. (🫓 is a flatbread.) */
function FlatBreadItem() {
  return (
    <g>
      <ellipse {...groundShadow(50, 80, 40)} />
      <FlatBread x={50} y={58} r={44} />
      <Shine x={34} y={50} rx={8} ry={3} rot={-8} />
    </g>
  )
}

/** A little four-pointed star at (x, y), r big. */
const star = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`

/**
 * Sweet spices, as Mary Magdalene and her friends carried them to the garden (Mark 16:1): a tall alabaster jar and a
 * round clay pot, with their sweet smell curling up out of them. (No emoji: 🫙 is any jar.)
 */
function SweetSpices() {
  const alabaster = useShade('#f3ecdf', 0.4, 0.15)
  const clay = useShade('#d9905e', 0.35, 0.2)
  return (
    <g {...ROUND}>
      <defs>{alabaster.def}{clay.def}</defs>
      <ellipse {...groundShadow(50, 92, 38)} />
      {/* the sweet smell, curling up */}
      <path d="M36 26 C28 20 40 14 34 6 M66 40 C58 34 72 28 64 20 C60 16 66 12 64 8" stroke="#c99ae0" strokeWidth={2.6} fill="none" opacity={0.85} />
      <path d={star(46, 12, 4)} fill="#f6d36a" />
      <path d={star(76, 26, 3.4)} fill="#f6d36a" />
      {/* the tall alabaster jar */}
      <path d="M27 34 L43 34 L41 41 Q52 48 51 66 Q50 86 35 90 Q20 86 19 66 Q18 48 29 41 Z" fill={alabaster.fill} stroke="#a8977a" strokeWidth={2.4} />
      <path d="M20 62 Q35 68 50 62" stroke="#d8c8a8" strokeWidth={3} fill="none" />
      <ellipse cx={35} cy={33} rx={10} ry={3.6} fill="#c9b48a" stroke="#a8977a" strokeWidth={2} />
      <path d="M31 30 Q35 22 39 30" fill="#e8dcc0" stroke="#a8977a" strokeWidth={1.8} />
      <Shine x={27} y={56} rx={3} ry={7} rot={10} />
      {/* the round clay pot */}
      <path d="M58 52 L76 52 L74 57 Q86 62 85 74 Q84 89 67 91 Q50 89 49 74 Q48 62 60 57 Z" fill={clay.fill} stroke={ink('#d9905e')} strokeWidth={2.4} />
      <path d="M50 72 Q67 78 84 72" stroke="#f2c08a" strokeWidth={2.6} fill="none" />
      <ellipse cx={67} cy={51} rx={11} ry={3.6} fill="#8a4a2a" stroke={ink('#d9905e')} strokeWidth={2} />
      <Shine x={59} y={66} rx={3} ry={5} rot={20} />
    </g>
  )
}

/**
 * The garden tomb on Easter morning (the island's sticker): the rock with its doorway open and warm light inside,
 * the big round stone rolled away beside it, and the sun coming up behind, with spring flowers in the grass.
 * (No emoji: 🌅 is any sunrise.)
 */
function EmptyTomb() {
  const id = uid(useId())
  const rock = useShade('#cfc4b2', 0.35, 0.2)
  const stone = useShade('#b9b0a2', 0.4, 0.22)
  return (
    <g {...ROUND}>
      <defs>
        {rock.def}{stone.def}
        <radialGradient id={`sun${id}`}><stop offset="0.5" stopColor="#ffe48a" /><stop offset="1" stopColor="#ffe48a" stopOpacity={0} /></radialGradient>
        <linearGradient id={`in${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6d6" /><stop offset="1" stopColor="#f6d58e" /></linearGradient>
      </defs>
      {/* the sun coming up behind the rock, with its rays */}
      <circle cx={70} cy={30} r={30} fill={`url(#sun${id})`} />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (-170 + i * 22) * (Math.PI / 180)
        return <path key={i} d={`M${70 + Math.cos(a) * 19} ${30 + Math.sin(a) * 19} L${70 + Math.cos(a) * 28} ${30 + Math.sin(a) * 28}`} stroke="#ffc94a" strokeWidth={3} />
      })}
      <circle cx={70} cy={30} r={14} fill="#ffd84d" stroke="#e8a92a" strokeWidth={2} />
      <path d={star(16, 14, 5)} fill="#fff1a8" stroke="#e0b440" strokeWidth={1} />
      {/* the rock, with grass on top */}
      <path d="M6 84 C4 56 14 34 36 26 C52 20 66 26 74 40 C80 50 80 66 78 84 Z" fill={rock.fill} stroke={ink('#cfc4b2')} strokeWidth={2.4} />
      <path d="M22 34 Q34 24 48 24" stroke="#fff" strokeWidth={2.4} opacity={0.45} fill="none" />
      <path d="M27 31 l2 -7 l2 7 l2 -9 l2 9 l2 -6 l2 6 M48 25 l2 -6 l2 6 l2 -8 l2 8 l2 -5 l2 5" stroke="#5fae55" strokeWidth={2.2} fill="none" />
      {/* the open doorway, full of light */}
      <path d="M26 84 L26 62 A13 13 0 0 1 52 62 L52 84 Z" fill={`url(#in${id})`} stroke={ink('#cfc4b2')} strokeWidth={2.4} />
      <path d="M28 84 L50 84 L46 79 L32 79 Z" fill="#fff" opacity={0.5} />
      {/* the round stone, rolled away to the side */}
      <circle cx={72} cy={66} r={18} fill={darken('#b9b0a2')} stroke={ink('#b9b0a2')} strokeWidth={2.2} />
      <circle cx={69} cy={66} r={18} fill={stone.fill} stroke={ink('#b9b0a2')} strokeWidth={2.4} />
      <circle cx={69} cy={66} r={11} fill="none" stroke={ink('#b9b0a2')} strokeWidth={1.4} opacity={0.4} />
      <path d="M58 58 Q62 51 70 50" stroke="#fff" strokeWidth={2.2} opacity={0.55} fill="none" />
      {/* the grass, and spring flowers */}
      <path d="M2 84 Q50 78 98 84 L98 92 Q98 96 94 96 L6 96 Q2 96 2 92 Z" fill="#7cc46a" stroke="#4f9a4a" strokeWidth={2.2} />
      {[[12, 86, '#ff8cc0'], [88, 84, '#ffd34d'], [94, 90, '#b48cff']].map(([fx, fy, c], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={fx as number} cy={(fy as number) - 4} rx={2.4} ry={3.6} fill={c as string} transform={`rotate(${a} ${fx} ${fy})`} />)}
          <circle cx={fx as number} cy={fy as number} r={1.8} fill="#fff3b0" />
        </g>
      ))}
    </g>
  )
}

export const ISL_EASTER: Item[] = [
  { id: 'flat-bread', name: 'round flat bread', emoji: ['🫓'], Draw: FlatBreadItem },
  { id: 'empty-tomb', name: 'the empty tomb on Easter morning', Draw: EmptyTomb },
  { id: 'sweet-spices', name: 'sweet spices', Draw: SweetSpices },
]
