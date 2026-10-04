// Drawn things first needed by The Walls of Jericho island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//   rams-horn:  a trumpet made from a ram's horn (the island's sticker, and the priests' trumpets). No emoji
//               means it: 🎺 is a brass trumpet and 📯 a post horn.
//   red-cord:   the red cord Rahab tied in her window (🧶 is a ball of yarn).
//   golden-box: God's special golden box (the ark of the covenant), with its carrying poles.
//   mud-brick:  one sandy mud brick, like the bricks of Jericho's walls: it's what 🧱 means (a brick), and the
//               "Tumbling Bricks" number games count it (a practice counts its theme emoji's drawing).
// RamsHorn and GoldenBoxShape draw the same things at any size, for the story pictures and the game.
import { useId } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, lighten, Shine, useShade } from './draw'

/** Round line ends and corners, for everything in an item. */
const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const
const f = (n: number) => n.toFixed(1)

/** A point on the cubic curve c = [x0, y0, x1, y1, x2, y2, x3, y3] at t, with the unit tangent and normal there. */
function onCurve(c: number[], t: number) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = c
  const u = 1 - t
  const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3
  const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
  const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2)
  const dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2)
  const l = Math.hypot(dx, dy) || 1
  return { x, y, tx: dx / l, ty: dy / l, nx: -dy / l, ny: dx / l }
}

/**
 * A ram's-horn trumpet along the curve c (see onCurve), from its mouthpiece at the start to its bell at the
 * end: narrow and dark amber at the mouthpiece, wide and creamy at the bell, with rings along it. `w0` and
 * `w1`: how wide it is at each end; `line`: how thick its outline is.
 */
export function RamsHorn({ c, w0 = 3, w1 = 13, line = 1.6 }: { c: number[]; w0?: number; w1?: number; line?: number }) {
  const id = `rh${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const N = 24
  const half = (t: number) => (w0 + (w1 - w0) * t ** 1.5) / 2
  const side = (k: number) => Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N, p = onCurve(c, t), w = half(t)
    return `${f(p.x + k * p.nx * w)} ${f(p.y + k * p.ny * w)}`
  })
  const a = side(1), b = side(-1).reverse()
  const start = onCurve(c, 0), end = onCurve(c, 1)
  // down one side, across the bell, back up the other side, and round the mouthpiece
  const d = `M${a.join(' L')} L${b.join(' L')} Q${f(start.x - start.tx * w0)} ${f(start.y - start.ty * w0)} ${a[0]} Z`
  // rings round it, each bowing a little toward the bell
  const rings = [0.2, 0.31, 0.42, 0.53, 0.64, 0.75, 0.85].map((t) => {
    const p = onCurve(c, t), w = half(t) * 0.9
    return `M${f(p.x + p.nx * w)} ${f(p.y + p.ny * w)} Q${f(p.x + p.tx * w * 0.6)} ${f(p.y + p.ty * w * 0.6)} ${f(p.x - p.nx * w)} ${f(p.y - p.ny * w)}`
  }).join(' ')
  const turn = `rotate(${f((Math.atan2(end.ny, end.nx) * 180) / Math.PI)} ${f(end.x)} ${f(end.y)})`
  return (
    <g {...ROUND}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={c[0]} y1={c[1]} x2={c[6]} y2={c[7]}>
          <stop offset="0" stopColor="#7a4a22" />
          <stop offset="0.3" stopColor="#c08a4e" />
          <stop offset="0.68" stopColor="#ecd3a2" />
          <stop offset="1" stopColor="#fbefd6" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} stroke="#6e4620" strokeWidth={line} />
      <path d={rings} fill="none" stroke="#a87a44" strokeWidth={line * 0.75} opacity={0.7} />
      {/* the bell's open end */}
      <ellipse cx={end.x} cy={end.y} rx={half(1) + line * 0.4} ry={w1 * 0.2} transform={turn} fill="#fcf3e0" stroke="#6e4620" strokeWidth={line} />
      <ellipse cx={end.x} cy={end.y} rx={half(1) * 0.62} ry={w1 * 0.1} transform={turn} fill="#5a3a1c" />
    </g>
  )
}

/**
 * God's special golden box (the ark of the covenant), side on: a gold chest with a lid on top, a golden angel
 * kneeling at each end of the lid with its wings reaching up and over to meet in the middle, and gold rings
 * low on its sides for the carrying poles (at y = -9). (0, 0) = the middle of its foot; it is 66 wide and
 * about 76 tall. The poles and any glow are drawn by whoever carries it.
 */
export function GoldenBoxShape({ line = 2 }: { line?: number }) {
  const gold = useShade('#f4c94a', 0.5, 0.22)
  const g = '#f4c94a', edge = '#a87a12'
  // the left angel, facing the middle (the right one is its mirror): its wing behind, then its kneeling
  // body, then its head, bowed a little
  const angel = (
    <g>
      <path d="M-24 -50 C-35 -59 -33 -76 -17 -76 C-9 -75.5 -3 -70 -0.5 -63 Q-3.5 -63 -5.5 -60.5 Q-8 -63.5 -11 -59.5 Q-13.5 -62.5 -16.5 -57.5 Q-19 -60 -21.5 -53 Z" fill={gold.fill} stroke={edge} strokeWidth={line} />
      <path d="M-26 -66 Q-18 -71 -9 -67 M-24 -60 Q-19 -64 -13 -62" stroke={edge} strokeWidth={line * 0.6} fill="none" opacity={0.65} />
      <path d="M-31 -40 Q-33 -50 -26 -53 Q-19 -54 -17 -48 L-15 -40 Z" fill={gold.fill} stroke={edge} strokeWidth={line} />
      <circle cx={-21} cy={-56.5} r={4.6} fill={gold.fill} stroke={edge} strokeWidth={line} />
    </g>
  )
  return (
    <g {...ROUND}>
      <defs>{gold.def}</defs>
      {angel}
      <g transform="scale(-1 1)">{angel}</g>
      {/* the lid, and the chest under it with a panel and little gold flowers */}
      <rect x={-33} y={-41} width={66} height={6} rx={2} fill={gold.fill} stroke={edge} strokeWidth={line} />
      <rect x={-31} y={-35} width={62} height={30} rx={2.5} fill={gold.fill} stroke={edge} strokeWidth={line} />
      <path d="M-28 -32 L28 -32" stroke={lighten(g, 0.55)} strokeWidth={line * 1.2} opacity={0.9} />
      <rect x={-24} y={-27} width={48} height={15} rx={2} fill="none" stroke={darken(g, 0.16)} strokeWidth={line * 0.8} />
      {[-14, 0, 14].map((x) => <circle key={x} cx={x} cy={-19.5} r={2.6} fill={lighten(g, 0.35)} stroke={darken(g, 0.2)} strokeWidth={line * 0.6} />)}
      {/* its feet, and the rings for the poles */}
      {[-25.5, 25.5].map((x) => (
        <g key={x}>
          <rect x={x - 4.5} y={-6} width={9} height={6} rx={1.5} fill={gold.fill} stroke={edge} strokeWidth={line} />
          <circle cx={x} cy={-9} r={3.6} fill="none" stroke={edge} strokeWidth={line * 1.1} />
        </g>
      ))}
    </g>
  )
}

// ---------- The items ----------

export function RamsHornItem() {
  return (
    <g {...ROUND}>
      <ellipse {...groundShadow(54, 92, 30)} />
      <RamsHorn c={[12, 60, 28, 96, 76, 94, 84, 26]} w0={7} w1={30} line={2.6} />
      <Shine x={46} y={80} rx={9} ry={3} rot={-6} />
    </g>
  )
}

/** A cord, coiled round twice, with its end hanging down and a tassel. */
function RedCord() {
  const red = '#e0352c'
  const loops = 'M24 56 C10 40 32 22 54 24 C78 26 88 44 74 58 C62 70 34 70 26 58 C18 46 34 32 54 34 C72 36 80 48 70 60'
  const end = 'M70 60 C80 66 84 74 80 84'
  const tube = (d: string) => (
    <g>
      <path d={d} fill="none" stroke={ink(red)} strokeWidth={9.5} />
      <path d={d} fill="none" stroke={red} strokeWidth={5.6} />
      {/* the twist of the cord */}
      <path d={d} fill="none" stroke={lighten(red, 0.45)} strokeWidth={2.2} strokeDasharray="2.5 4.5" opacity={0.85} />
    </g>
  )
  return (
    <g {...ROUND}>
      <ellipse {...groundShadow(52, 92, 28)} />
      {tube(loops)}
      {tube(end)}
      {/* a knot where the end comes off, and the tassel */}
      <circle cx={71} cy={61} r={5} fill={red} stroke={ink(red)} strokeWidth={2.2} />
      <path d="M80 84 L74 94 M80 84 L78 95 M80 84 L82 95 M80 84 L86 93" stroke={ink(red)} strokeWidth={4} fill="none" />
      <path d="M80 84 L74 94 M80 84 L78 95 M80 84 L82 95 M80 84 L86 93" stroke={red} strokeWidth={2} fill="none" />
      <ellipse cx={80} cy={84} rx={4} ry={3} fill={darken(red, 0.1)} stroke={ink(red)} strokeWidth={1.8} />
    </g>
  )
}

function GoldenBoxItem() {
  const id = `gb${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const pole = '#d39a2e'
  return (
    <g {...ROUND}>
      <defs>
        <radialGradient id={id}><stop offset="0" stopColor="#fff3b0" stopOpacity={0.95} /><stop offset="1" stopColor="#fff3b0" stopOpacity={0} /></radialGradient>
      </defs>
      {/* God's light round it */}
      <circle cx={50} cy={52} r={50} fill={`url(#${id})`} />
      <ellipse {...groundShadow(50, 91, 34)} />
      <g transform="translate(50 88) scale(1.05)">
        <GoldenBoxShape line={2.2} />
        {/* the near carrying pole, through the rings */}
        <rect x={-45} y={-12} width={90} height={6} rx={3} fill={pole} stroke={ink(pole)} strokeWidth={2} />
        <path d="M-42 -10.5 L42 -10.5" stroke={lighten(pole, 0.45)} strokeWidth={1.4} />
      </g>
    </g>
  )
}

/** One sandy mud brick, seen from a little above: its long front, its top and its end, with bits of straw in it. */
function MudBrick() {
  const front = '#e2ae6c', top = '#f3d29a', end = '#c48d50', line = ink(front)
  return (
    <g {...ROUND}>
      <ellipse {...groundShadow(53, 89, 42)} />
      <path d="M78 52 L94 38 L94 70 L78 84 Z" fill={end} stroke={line} strokeWidth={2.6} />
      <path d="M12 52 L28 38 L94 38 L78 52 Z" fill={top} stroke={line} strokeWidth={2.6} />
      <path d="M12 52 L78 52 L78 84 L12 84 Z" fill={front} stroke={line} strokeWidth={2.6} />
      {/* bits of straw, and little holes, in the mud */}
      <path d="M22 62 l7 -2 M40 72 l6 2 M58 60 l7 1 M30 78 l5 -2 M66 74 l6 -2 M38 45 l7 -1 M62 43 l6 1 M82 52 l3 4"
        stroke={lighten(front, 0.45)} strokeWidth={2} fill="none" />
      {[[34, 63], [52, 76], [70, 64], [24, 72], [50, 46], [86, 62]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={1.4} fill={darken(front, 0.28)} />)}
      <Shine x={26} y={58} rx={8} ry={3} rot={0} />
    </g>
  )
}

export const ISL_JERICHO: Item[] = [
  { id: 'rams-horn', name: "ram's horn trumpet", Draw: RamsHornItem },
  { id: 'red-cord', name: 'red cord', Draw: RedCord },
  { id: 'golden-box', name: "God's special golden box", Draw: GoldenBoxItem },
  { id: 'mud-brick', name: 'brick', emoji: ['🧱'], Draw: MudBrick },
]
