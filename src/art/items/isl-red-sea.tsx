// Drawn things first needed by the red-sea island (its activities and pictures). Same style and rules as
// the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
import { useId } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, Shine, useShade } from './draw'

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

/**
 * A seashell, the spiral kind (🐚): a plump body whorl with the spire's smaller and smaller turns up to
 * its tip at the top right, stripes following the spiral, and its pink opening at the front.
 */
function Shell() {
  const id = uid(useId())
  const shellC = '#fbe0c8'
  const body = useShade(shellC, 0.5, 0.18)
  const line = '#c98a6a'
  // the spire: three turns, each smaller, stepping up to the tip
  const turns: [number, number, number][] = [[67, 37, 15], [77, 25, 10], [84, 16.5, 6]]
  const whorl = 'M14 64 C14 44 34 32 56 34 C74 36 84 52 80 66 C76 82 56 92 38 90 C22 88 14 78 14 64 Z'
  return (
    <g strokeLinejoin="round">
      <defs>
        {body.def}
        <clipPath id={`${id}c`}><path d={whorl} /></clipPath>
      </defs>
      <ellipse {...groundShadow(48, 93, 32)} />
      {/* the spire's turns, the smallest on top */}
      {turns.slice().reverse().map(([x, y, r], i) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.82} transform={`rotate(-40 ${x} ${y})`} fill={body.fill} stroke={line} strokeWidth={2.4} />
          <path d={`M${x - r * 0.7} ${y + r * 0.1} Q${x} ${y + r * 0.75} ${x + r * 0.75} ${y - r * 0.2}`} stroke={i === 2 ? '#e88a6a' : '#f0a67e'} strokeWidth={r * 0.32} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <path d={whorl} fill={body.fill} stroke={line} strokeWidth={2.6} />
      {/* stripes following the spiral round the body */}
      <g clipPath={`url(#${id}c)`} fill="none" strokeLinecap="round">
        {['M40 30 Q70 42 76 84', 'M28 36 Q60 52 60 94', 'M18 46 Q46 62 42 98'].map((d, i) => (
          <path key={d} d={d} stroke={i % 2 ? '#f0a67e' : '#e88a6a'} strokeWidth={6.5} opacity={0.85} />
        ))}
        {['M34 32 Q66 47 69 90', 'M23 41 Q53 57 51 96'].map((d) => <path key={d} d={d} stroke="#fff5ec" strokeWidth={2} opacity={0.8} />)}
      </g>
      <path d={whorl} fill="none" stroke={line} strokeWidth={2.6} />
      {/* the opening: pink inside, with a pale curling lip */}
      <path d="M17 68 C15 56 24 48 34 52 C42 56 44 70 38 80 C32 88 20 84 17 68 Z" fill="#fff0e4" stroke={line} strokeWidth={2.2} />
      <path d="M22 68 C21 60 27 55 33 58 C38 61 39 70 35 77 C31 82 23 79 22 68 Z" fill="#ff9fb6" />
      <path d="M26 68 C26 63 29 61 32 63 C34 65 34 71 32 74 C30 76 27 74 26 68 Z" fill="#f27b9a" />
      <Shine x={56} y={44} rx={7} ry={3.5} rot={-25} />
    </g>
  )
}

/** A tambourine: a round wooden frame with a drum skin, shiny gold jingles round its rim and bright ribbons. */
function Tambourine() {
  const wood = useShade('#d99a52', 0.35, 0.2)
  const skin = useShade('#fff2d8', 0.4, 0.1)
  const gold = useShade('#ffd84a', 0.55, 0.2)
  const cx = 50, cy = 44, R = 33
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>{wood.def}{skin.def}{gold.def}</defs>
      {/* ribbons hanging from the bottom of the frame */}
      <path d="M44 74 Q36 84 42 96" stroke={ink('#ff6fae')} strokeWidth={7.4} fill="none" />
      <path d="M44 74 Q36 84 42 96" stroke="#ff6fae" strokeWidth={4.6} fill="none" />
      <path d="M52 76 Q58 86 52 97" stroke={ink('#2fb5a8')} strokeWidth={7.4} fill="none" />
      <path d="M52 76 Q58 86 52 97" stroke="#2fb5a8" strokeWidth={4.6} fill="none" />
      <path d="M59 73 Q68 80 66 92" stroke={ink('#ffc94a')} strokeWidth={7.4} fill="none" />
      <path d="M59 73 Q68 80 66 92" stroke="#ffc94a" strokeWidth={4.6} fill="none" />
      {/* the frame's side, then its front, then the skin */}
      <ellipse cx={cx} cy={cy + 6} rx={R} ry={R * 0.92} fill={darken('#d99a52', 0.15)} stroke={ink('#d99a52')} strokeWidth={2.6} />
      <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.92} fill={wood.fill} stroke={ink('#d99a52')} strokeWidth={2.6} />
      <ellipse cx={cx} cy={cy} rx={R - 7} ry={(R - 7) * 0.92} fill={skin.fill} stroke={darken('#e8c99a', 0.1)} strokeWidth={2} />
      {/* a painted flower on the skin */}
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={cx} cy={cy - 8} rx={3.6} ry={6} fill="#ffb3c8" transform={`rotate(${a} ${cx} ${cy})`} />)}
      <circle cx={cx} cy={cy} r={3.6} fill="#ffd34d" stroke="#e0a23a" strokeWidth={1.2} />
      {/* gold jingles in slots round the rim */}
      {[-90, -30, 30, 90, 150, 210].map((a) => {
        const r = (a * Math.PI) / 180
        const x = cx + Math.cos(r) * (R - 3.5), y = cy + Math.sin(r) * (R - 3.5) * 0.92
        return (
          <g key={a} transform={`rotate(${a + 90} ${x} ${y})`}>
            <rect x={x - 7} y={y - 3.4} width={14} height={6.8} rx={2} fill={darken('#d99a52', 0.45)} />
            <ellipse cx={x - 3} cy={y} rx={4} ry={3} fill={gold.fill} stroke="#b88a14" strokeWidth={1.2} />
            <ellipse cx={x + 3} cy={y} rx={4} ry={3} fill={gold.fill} stroke="#b88a14" strokeWidth={1.2} />
          </g>
        )
      })}
      <Shine x={33} y={24} rx={7} ry={3.5} rot={-35} />
    </g>
  )
}

/** A circle of soft glowing light (God's light), centred on (cx, cy). */
function Light({ cx, cy, rx, ry, color }: { cx: number; cy: number; rx: number; ry: number; color: string }) {
  const id = uid(useId())
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={0.9} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} />
    </>
  )
}

/** The pillar of cloud that led God's people by day: a tall glowing cloud standing on the desert sand. */
function PillarOfCloud() {
  const puffs: [number, number, number][] = [
    [50, 80, 13], [41, 84, 8], [60, 83, 8.5], [51, 68, 12], [41, 72, 8], [60, 70, 8.5], [49, 56, 12], [40, 60, 8], [59, 58, 8.5],
    [51, 44, 12.5], [42, 48, 8], [61, 46, 8.5], [50, 31, 13], [40, 35, 8.5], [61, 33, 9], [50, 18, 12.5], [41, 22, 8.5], [59, 20, 9],
  ]
  return (
    <g>
      <Light cx={50} cy={50} rx={46} ry={48} color="#fff0b0" />
      <ellipse cx={50} cy={91} rx={30} ry={5} fill="#efd49c" />
      {puffs.map(([x, y, r], i) => <circle key={`o${i}`} cx={x} cy={y} r={r + 2.2} fill="#c9c6e6" />)}
      {puffs.map(([x, y, r], i) => <circle key={`s${i}`} cx={x} cy={y} r={r} fill="#e8e6f6" />)}
      {puffs.map(([x, y, r], i) => <circle key={`f${i}`} cx={x - r * 0.12} cy={y - r * 0.15} r={r * 0.82} fill="#ffffff" />)}
      <Light cx={50} cy={50} rx={12} ry={32} color="#ffe9a0" />
      <Shine x={42} y={16} rx={5} ry={2.6} />
    </g>
  )
}

/** A flame shape with a round bottom at (cx, by) and its point h above. */
const flame = (cx: number, by: number, w: number, h: number) =>
  `M${cx} ${by - h} C${cx + w * 0.35} ${by - h * 0.62} ${cx + w} ${by - h * 0.42} ${cx + w} ${by - h * 0.18} C${cx + w} ${by - h * 0.02} ${cx + w * 0.55} ${by} ${cx} ${by} C${cx - w * 0.55} ${by} ${cx - w} ${by - h * 0.02} ${cx - w} ${by - h * 0.18} C${cx - w} ${by - h * 0.42} ${cx - w * 0.35} ${by - h * 0.62} ${cx} ${by - h} Z`

/** The pillar of fire that gave God's people light at night: a tall column of warm flames, glowing, on the sand. */
function PillarOfFire() {
  const outer = useShade('#ff8a3d', 0.35, 0.15)
  return (
    <g strokeLinejoin="round">
      <defs>{outer.def}</defs>
      <Light cx={50} cy={52} rx={48} ry={50} color="#ffd27a" />
      <ellipse cx={50} cy={91} rx={30} ry={5} fill="#f2c27a" />
      {[[34, 62, 9, 26, -22], [66, 56, 9, 28, 22], [37, 40, 7, 22, -16], [63, 34, 7, 22, 16]].map(([x, y, w, h, r]) => (
        <path key={`${x}${y}`} d={flame(x, y, w, h)} transform={`rotate(${r} ${x} ${y})`} fill={outer.fill} stroke={ink('#ff8a3d')} strokeWidth={2} />
      ))}
      <path d={flame(50, 90, 19, 86)} fill={outer.fill} stroke={ink('#ff8a3d')} strokeWidth={2.6} />
      <path d={flame(50, 90, 13, 72)} fill="#ffb93f" />
      <path d={flame(50, 90, 7, 54)} fill="#fff1b0" />
      <Shine x={42} y={50} rx={2.6} ry={8} rot={10} />
    </g>
  )
}

export const ISL_RED_SEA: Item[] = [
  { id: 'shell', name: 'seashell', emoji: ['🐚'], Draw: Shell },
  // (No emoji: 🪘 is a tall long drum, not a tambourine.)
  { id: 'tambourine', name: 'tambourine', emoji: [], Draw: Tambourine },
  { id: 'pillar-of-cloud', name: 'pillar of cloud', emoji: [], Draw: PillarOfCloud },
  { id: 'pillar-of-fire', name: 'pillar of fire', emoji: [], Draw: PillarOfFire },
]

