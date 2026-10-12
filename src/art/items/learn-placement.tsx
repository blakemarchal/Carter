// Things drawn for the placement game (src/screens/Placement.tsx): a treasure gem, and small signs for its
// word and number puzzles and its "Not sure" button. Each draws in a 100 x 100 box (see ./types.ts).
import type { Item } from './types'
import { ink, lighten, darken, Shine, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** A sparkling treasure gem: a faceted pink-purple jewel, wide at the top and pointed at the bottom. */
function Gem() {
  const c = '#c86bf0'
  const body = useShade(c, 0.45, 0.2)
  const line = ink(c)
  return (
    <g {...ROUND}>
      <defs>{body.def}</defs>
      {/* the outline: a flat top, sloping shoulders, then down to a point */}
      <path d="M30 22 L70 22 L88 42 L50 88 L12 42 Z" fill={body.fill} stroke={line} strokeWidth={3} />
      {/* facets */}
      <path d="M12 42 L88 42 M30 22 L38 42 L50 88 L62 42 L70 22 M38 42 L50 22 L62 42" fill="none" stroke={line} strokeWidth={1.8} opacity={0.75} />
      <path d="M30 22 L50 22 L38 42 L12 42 Z" fill={lighten(c, 0.35)} opacity={0.7} />
      <path d="M62 42 L88 42 L50 88 Z" fill={darken(c, 0.15)} opacity={0.5} />
      <Shine x={34} y={30} rx={6} ry={3} />
      {/* a twinkle */}
      <path d="M82 12 L84 18 L90 20 L84 22 L82 28 L80 22 L74 20 L80 18 Z" fill="#fff6b0" stroke="#e6c34d" strokeWidth={1.2} />
    </g>
  )
}

/** An open picture book: two pages with lines of words, a red cover peeking out underneath. */
function Book() {
  const cover = '#e8554e'
  const page = useShade('#fffaf0', 0.3, 0.1)
  const line = ink('#e8dcc4')
  return (
    <g {...ROUND}>
      <defs>{page.def}</defs>
      <path d="M8 32 Q30 24 50 32 Q70 24 92 32 L92 80 Q70 72 50 80 Q30 72 8 80 Z" fill={cover} stroke={ink(cover)} strokeWidth={3} />
      <path d="M12 28 Q31 20 50 28 L50 74 Q31 66 12 74 Z" fill={page.fill} stroke={line} strokeWidth={2.2} />
      <path d="M88 28 Q69 20 50 28 L50 74 Q69 66 88 74 Z" fill={page.fill} stroke={line} strokeWidth={2.2} />
      {[38, 47, 56].map((y) => (
        <g key={y} stroke="#8fa6c8" strokeWidth={2.6}>
          <path d={`M19 ${y} Q30 ${y - 4} 43 ${y - 1}`} fill="none" />
          <path d={`M57 ${y - 1} Q70 ${y - 4} 81 ${y}`} fill="none" />
        </g>
      ))}
      <Shine x={24} y={33} rx={5} ry={2.5} />
    </g>
  )
}

/** Three counting blocks in a row, each with a number on it: 1, 2, 3. */
function NumberBlocks() {
  const colors = ['#ff7b7b', '#ffc94d', '#5fc7ff']
  return (
    <g {...ROUND}>
      {colors.map((c, i) => {
        const x = 6 + i * 31
        const y = 34 - (i === 1 ? 8 : 0)
        return (
          <g key={c}>
            <rect x={x} y={y} width={27} height={32} rx={6} fill={c} stroke={ink(c)} strokeWidth={2.6} />
            <rect x={x + 3} y={y + 3} width={21} height={8} rx={3} fill={lighten(c, 0.4)} opacity={0.7} />
            <text x={x + 13.5} y={y + 26} textAnchor="middle" fontSize={20} fontWeight={800} fontFamily="Baloo 2, system-ui, sans-serif" fill="#fff" stroke={ink(c)} strokeWidth={1} paintOrder="stroke">{i + 1}</text>
          </g>
        )
      })}
    </g>
  )
}

/** A thought bubble with a question mark: "I'm not sure". */
function NotSure() {
  const c = '#c8b8ff'
  const fill = useShade('#f4efff', 0.3, 0.12)
  const line = ink(c)
  return (
    <g {...ROUND}>
      <defs>{fill.def}</defs>
      <circle cx={18} cy={86} r={5} fill={fill.fill} stroke={line} strokeWidth={2.2} />
      <circle cx={28} cy={74} r={7.5} fill={fill.fill} stroke={line} strokeWidth={2.2} />
      <path d="M30 56 C14 54 14 30 32 28 C34 12 58 8 66 20 C84 16 94 34 84 46 C92 60 74 72 60 64 C50 74 32 70 30 56 Z" fill={fill.fill} stroke={line} strokeWidth={2.6} />
      <text x={56} y={56} textAnchor="middle" fontSize={34} fontWeight={800} fontFamily="Baloo 2, system-ui, sans-serif" fill="#8d6cf0">?</text>
    </g>
  )
}

export const LEARN_PLACEMENT: Item[] = [
  { id: 'gem', name: 'gem', emoji: ['💎'], Draw: Gem },
  { id: 'book', name: 'book', emoji: ['📖'], Draw: Book },
  { id: 'number-blocks', name: 'number blocks', emoji: ['🔢'], Draw: NumberBlocks },
  { id: 'not-sure', name: 'not sure', emoji: ['🤔'], Draw: NotSure },
]
