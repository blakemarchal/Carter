// Drawings for the number lessons (src/learn/topics/numbers.tsx): flat shapes in friendly colors
// (circle, square, triangle…, for "Which one is a triangle?" and patterns), and tens and ones
// (rods of ten cubes and loose cubes, for "Which shows 34?"). Each draws in a 100 x 100 box.
// None of them stands in for an emoji: they're only used by id (`art: 'shape-star-red'`).
import type { ReactElement } from 'react'
import type { Item } from './types'
import { ink, lighten, Shine, useShade } from './draw'

export type ShapeName = 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'heart' | 'oval' | 'diamond'
export const SHAPES: ShapeName[] = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'oval', 'diamond']

export type ColorName = 'red' | 'blue' | 'yellow' | 'green' | 'orange' | 'purple'
export const COLORS: Record<ColorName, string> = {
  red: '#ff5a5f', blue: '#4a9dff', yellow: '#ffd23f', green: '#4fcf72', orange: '#ff9a3c', purple: '#a77bff',
}

const f = (n: number) => n.toFixed(1)
const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

function starPath(cx: number, cy: number, r: number, inner = 0.47) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = ((36 * i - 90) * Math.PI) / 180
    const d = i % 2 ? r * inner : r
    return `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * d)} ${f(cy + Math.sin(a) * d)}`
  }).join(' ') + 'Z'
}

const HEART = 'M50 88 C30 74 8 58 8 36 C8 20 20 12 31 12 C40 12 46 17 50 25 C54 17 60 12 69 12 C80 12 92 20 92 36 C92 58 70 74 50 88Z'

/** The outline of each shape, and where its shine sits. */
const OUTLINE: Record<ShapeName, { el: (p: Record<string, unknown>) => ReactElement; shine: [number, number, number, number] }> = {
  circle: { el: (p) => <circle cx={50} cy={50} r={40} {...p} />, shine: [34, 32, 11, 6] },
  square: { el: (p) => <rect x={14} y={14} width={72} height={72} rx={7} {...p} />, shine: [30, 28, 10, 5] },
  triangle: { el: (p) => <path d="M50 10 L92 86 L8 86 Z" {...p} />, shine: [42, 40, 8, 4.5] },
  rectangle: { el: (p) => <rect x={6} y={27} width={88} height={46} rx={6} {...p} />, shine: [22, 38, 10, 4.5] },
  star: { el: (p) => <path d={starPath(50, 54, 46)} {...p} />, shine: [42, 40, 7, 4] },
  heart: { el: (p) => <path d={HEART} {...p} />, shine: [26, 30, 9, 5] },
  oval: { el: (p) => <ellipse cx={50} cy={50} rx={45} ry={28} {...p} />, shine: [30, 37, 11, 5] },
  diamond: { el: (p) => <path d="M50 6 L84 50 L50 94 L16 50 Z" {...p} />, shine: [40, 32, 7, 4] },
}

/** One shape, filling the 100 x 100 box. */
export function ShapeArt({ shape, color }: { shape: ShapeName; color: string }) {
  const shade = useShade(color, 0.4, 0.12)
  const o = OUTLINE[shape]
  const [x, y, rx, ry] = o.shine
  return (
    <g>
      <defs>{shade.def}</defs>
      {o.el({ fill: shade.fill, stroke: ink(color), strokeWidth: 4, ...ROUND })}
      <Shine x={x} y={y} rx={rx} ry={ry} />
    </g>
  )
}

// ---------- Tens and ones ----------

export const CUBE = '#4a9dff'

/** One little cube (s across) with its top-left corner at (x, y). */
export function Cube({ x, y, s, color = CUBE }: { x: number; y: number; s: number; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={s * 0.18} fill={color} stroke={ink(color)} strokeWidth={s * 0.12} {...ROUND} />
      <rect x={x + s * 0.18} y={y + s * 0.16} width={s * 0.34} height={s * 0.2} rx={s * 0.1} fill={lighten(color, 0.6)} opacity={0.8} />
    </g>
  )
}

/** A rod of ten cubes, s across and 10 s tall, top-left corner at (x, y). */
export function Rod({ x, y, s, color = CUBE }: { x: number; y: number; s: number; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s * 10} rx={s * 0.2} fill={color} stroke={ink(color)} strokeWidth={s * 0.13} {...ROUND} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={x + s * 0.06} x2={x + s * 0.94} y1={y + s * (i + 1)} y2={y + s * (i + 1)} stroke={ink(color)} strokeWidth={s * 0.08} />
      ))}
      <rect x={x + s * 0.18} y={y + s * 0.3} width={s * 0.26} height={s * 9.3} rx={s * 0.12} fill={lighten(color, 0.6)} opacity={0.55} />
    </g>
  )
}

/**
 * `tens` rods and `ones` cubes side by side, the ones in columns of five, standing on y = top + 10 s.
 * Returns its width (in units of s) via `baseTenWidth` so callers can centre it.
 */
export const baseTenWidth = (tens: number, ones: number) => tens * 1.45 + (ones ? (tens ? 0.5 : 0) + Math.ceil(ones / 5) * 1.3 - 0.3 : -0.45)
export function BaseTen({ tens, ones, x, y, s }: { tens: number; ones: number; x: number; y: number; s: number }) {
  const onesX = x + (tens * 1.45 + (tens ? 0.5 : 0)) * s
  return (
    <g>
      {Array.from({ length: tens }, (_, i) => <Rod key={`t${i}`} x={x + i * 1.45 * s} y={y} s={s} />)}
      {Array.from({ length: ones }, (_, i) => (
        <Cube key={`o${i}`} x={onesX + Math.floor(i / 5) * 1.3 * s} y={y + (9 - (i % 5)) * s * 1.08 - s * 0.72} s={s} />
      ))}
    </g>
  )
}

function TensOnes({ tens, ones }: { tens: number; ones: number }) {
  const s = Math.min(8.4, 92 / baseTenWidth(tens, ones))
  const w = baseTenWidth(tens, ones) * s
  return <BaseTen tens={tens} ones={ones} x={50 - w / 2} y={50 - 5 * s} s={s} />
}

// ---------- The items ----------

const shapeItems: Item[] = SHAPES.flatMap((shape) => (Object.keys(COLORS) as ColorName[]).map((c) => ({
  id: `shape-${shape}-${c}`, name: `${c} ${shape}`, Draw: () => <ShapeArt shape={shape} color={COLORS[c]} />,
})))

/** Tens and ones from 10 to 59 (the numbers "Which shows 34?" asks about). */
export const TENS_RANGE = { tens: [1, 5], ones: [0, 9] } as const
const tensItems: Item[] = []
for (let t = TENS_RANGE.tens[0]; t <= TENS_RANGE.tens[1]; t++) {
  for (let o = TENS_RANGE.ones[0]; o <= TENS_RANGE.ones[1]; o++) {
    tensItems.push({ id: `tens-${t}-${o}`, name: `${t} tens and ${o} ones`, Draw: () => <TensOnes tens={t} ones={o} /> })
  }
}

export const LEARN_NUMBERS: Item[] = [...shapeItems, ...tensItems]
