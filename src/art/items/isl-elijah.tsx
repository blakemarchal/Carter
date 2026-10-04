// Drawn things first needed by the Elijah island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
import { useId } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, useShade } from './draw'

const gid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

/** A tongue of flame: a teardrop, round at (0, 0) and pointed at (0, -h). */
const flame = (w: number, h: number) =>
  `M0 ${-h} C${w * 0.35} ${-h * 0.62} ${w} ${-h * 0.42} ${w} ${-h * 0.18} C${w} ${-h * 0.02} ${w * 0.55} 0 0 0 C${-w * 0.55} 0 ${-w} ${-h * 0.02} ${-w} ${-h * 0.18} C${-w} ${-h * 0.42} ${-w * 0.35} ${-h * 0.62} 0 ${-h} Z`

const STONE_COLORS = ['#c9bfac', '#b9ae9b', '#d2c9b8', '#bfb4a0', '#cbbfa6']

/** One flame of the blaze, three colors deep: (x, y) its foot. */
const Tongue = ({ x, y, w, h, rot = 0 }: { x: number; y: number; w: number; h: number; rot?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={flame(w, h)} fill="#ff9a3c" stroke="#ef7a2a" strokeWidth={1.4} strokeLinejoin="round" />
    <path d={flame(w * 0.66, h * 0.8)} fill="#ffcf4a" />
    <path d={flame(w * 0.34, h * 0.55)} fill="#fff6c8" />
  </g>
)

/**
 * Fire from heaven (1 Kings 18:38): Elijah's altar of twelve stones (five, four and three) with the wood on top, and
 * God's fire coming down on it in a beam of warm, golden light, a bright blaze standing on the wood. God is only light.
 */
function FireFromHeaven() {
  const id = gid(useId())
  const rows = [{ n: 5, y: 86.5, h: 11 }, { n: 4, y: 77, h: 10.4 }, { n: 3, y: 68, h: 9.8 }]
  const W = 13.4
  return (
    <g>
      <defs>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor="#fff6c8" stopOpacity={0.95} /><stop offset="1" stopColor="#fff6c8" stopOpacity={0} /></radialGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf2" stopOpacity={1} /><stop offset="1" stopColor="#ffd77a" stopOpacity={0.8} />
        </linearGradient>
      </defs>
      <circle cx={50} cy={40} r={46} fill={`url(#${id}g)`} />
      {/* the beam of light coming down from heaven, with tongues of fire falling in it */}
      <path d="M34 0 L66 0 L80 62 L20 62 Z" fill="#fff1b8" opacity={0.55} />
      <path d="M41 0 L59 0 L71 62 L29 62 Z" fill={`url(#${id}b)`} />
      <ellipse cx={50} cy={1} rx={22} ry={6} fill="#fffdf0" />
      <Tongue x={44} y={20} w={3.6} h={13} />
      <Tongue x={56} y={14} w={3.2} h={11} />
      <ellipse {...groundShadow(50, 93, 38)} />
      {/* the twelve stones */}
      {rows.map(({ n, y, h }, r) => Array.from({ length: n }, (_, i) => {
        const x = 50 + (i - (n - 1) / 2) * W
        const c = STONE_COLORS[(r * 5 + i) % STONE_COLORS.length]
        return (
          <g key={`${r}${i}`}>
            <rect x={x - W / 2 - 0.5} y={y - h / 2} width={W + 1} height={h} rx={3.6} fill={c} stroke={ink(c)} strokeWidth={1.5} />
            <path d={`M${x - 4} ${y - h / 2 + 2.4} L${x + 2} ${y - h / 2 + 2}`} stroke="#fff" strokeOpacity={0.55} strokeWidth={1.4} strokeLinecap="round" />
          </g>
        )
      }))}
      {/* the wood, log ends stacked */}
      {[[38, 59.5, 4], [46, 59.5, 4], [54, 59.5, 4], [62, 59.5, 4], [42, 52.5, 3.8], [50, 52.5, 3.8], [58, 52.5, 3.8]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#8a5a33" stroke="#4a2f1c" strokeWidth={1.2} />
          <circle cx={x} cy={y} r={r * 0.6} fill="#e6bb80" />
        </g>
      ))}
      {/* the blaze on the wood */}
      <Tongue x={34} y={58} w={5} h={17} rot={-24} />
      <Tongue x={66} y={58} w={5} h={17} rot={24} />
      <Tongue x={41} y={56} w={7} h={27} rot={-11} />
      <Tongue x={59} y={56} w={7} h={27} rot={11} />
      <Tongue x={50} y={55} w={9.5} h={38} />
      {[[16, 30, 5], [84, 22, 5.5], [20, 62, 3.5], [82, 58, 4]].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r} L${x + r * 0.25} ${y - r * 0.25} L${x + r} ${y} L${x + r * 0.25} ${y + r * 0.25} L${x} ${y + r} L${x - r * 0.25} ${y + r * 0.25} L${x - r} ${y} L${x - r * 0.25} ${y - r * 0.25} Z`}
          fill="#ffe680" stroke={darken('#ffe680', 0.25)} strokeWidth={0.8} />
      ))}
    </g>
  )
}

/**
 * The widow's flour and oil, which God made last and last (1 Kings 17:16): a big clay jar with soft white flour
 * heaped in its mouth, and a little jug of golden oil beside it, a drop at its spout, both softly glowing.
 */
function FlourAndOil() {
  const id = gid(useId())
  const clay = useShade('#c97a4c', 0.3, 0.22)
  const jug = useShade('#e0b45e', 0.32, 0.22)
  return (
    <g>
      <defs>
        {clay.def}{jug.def}
        <radialGradient id={`${id}g`}><stop offset="0" stopColor="#fff2b8" stopOpacity={0.9} /><stop offset="1" stopColor="#fff2b8" stopOpacity={0} /></radialGradient>
      </defs>
      <circle cx={50} cy={56} r={46} fill={`url(#${id}g)`} />
      <ellipse {...groundShadow(48, 93, 40)} />
      {/* the flour jar */}
      <path d="M28 45 L50 45 L48.5 51 Q63 57 62 74 Q61 90 39 92 Q17 90 16 74 Q15 57 29.5 51 Z" fill={clay.fill} stroke="#7a3f22" strokeWidth={2} strokeLinejoin="round" />
      <path d="M18 66 Q39 72 60 66" stroke="#f0c08a" strokeWidth={2.6} fill="none" />
      <ellipse cx={39} cy={45} rx={11} ry={3.4} fill="#e8d6b8" stroke="#7a3f22" strokeWidth={1.7} />
      <path d="M28.5 44.5 Q31 36 39 34.5 Q47 36 49.5 44.5 Q39 47.5 28.5 44.5 Z" fill="#fffdf6" stroke="#d8ccb8" strokeWidth={1.3} strokeLinejoin="round" />
      <ellipse cx={24} cy={62} rx={2.6} ry={6} fill="#fff" opacity={0.25} />
      {/* the oil jug, with its handle, spout and a golden drop */}
      <g transform="translate(8 0)">
      <path d="M70 66 Q60 66 61 75 Q62 81 68 81" stroke="#8a5a22" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M72 60 L80 60 L79.5 64 Q89 68 88.5 79 Q88 91 76 92 Q64 91 63.5 79 Q63 68 72.5 64 Z" fill={jug.fill} stroke="#8a5a22" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M79 61.5 Q85 58 89 55 Q88 60 82 64.5 Z" fill="#e0b45e" stroke="#8a5a22" strokeWidth={1.5} strokeLinejoin="round" />
      <ellipse cx={76} cy={60} rx={4.4} ry={1.5} fill="#7a4a12" />
      <path d="M89.5 56.5 Q87.6 60 89.5 61.4 Q91.4 60 89.5 56.5 Z" fill="#ffcf3f" stroke="#c8961a" strokeWidth={0.8} />
      </g>
      {[[14, 28, 4.5], [86, 36, 4], [62, 30, 3.2]].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r} L${x + r * 0.25} ${y - r * 0.25} L${x + r} ${y} L${x + r * 0.25} ${y + r * 0.25} L${x} ${y + r} L${x - r * 0.25} ${y + r * 0.25} L${x - r} ${y} L${x - r * 0.25} ${y - r * 0.25} Z`}
          fill="#ffe680" stroke={darken('#ffe680', 0.25)} strokeWidth={0.8} />
      ))}
    </g>
  )
}

export const ISL_ELIJAH: Item[] = [
  { id: 'fire-from-heaven', name: 'fire from heaven', Draw: FireFromHeaven },
  { id: 'flour-and-oil', name: 'flour and oil', Draw: FlourAndOil },
]
