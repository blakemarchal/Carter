// Drawn things first needed by the Ruth and Naomi island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//
// The island's story pictures (art/scenes/ruth.tsx) and its catch game (art/games/ruth.tsx) draw with the
// same pieces, so they're exported: BarleyEar, BarleyStalk, BarleyBunch and BarleyHeap (ripe barley, with
// its long whiskers), Bethlehem (the little town on its hill) and OliveTree. (Items can't import from the
// scenes: the scenes import the items, so the pieces live here.)
import type { ReactNode } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, lighten } from './draw'
import { Baby } from '../people'

const f = (n: number) => n.toFixed(1)
const rad = (a: number) => (a * Math.PI) / 180

// ---------- Barley ----------

/** Ripe barley: golden grains, their outline, the long whiskers (awns), and the straw of the stalks. */
export const BARLEY = '#efc24f'
export const BARLEY_LINE = '#a8772a'
export const AWN = '#d6a240'
export const STRAW = '#ddb04c'
export const STRAW_LINE = '#9c7028'

/**
 * One ear of ripe barley, pointing up from its foot (x, y), turned `a` degrees: two rows of plump grains, each
 * with a long whisker, the whiskers rising together in a brush well past the tip (that's how barley looks).
 * About 26 tall, and 52 with the whiskers, at s = 1.
 */
export function BarleyEar({ x = 0, y = 0, a = 0, s = 1 }: { x?: number; y?: number; a?: number; s?: number }) {
  const grains = Array.from({ length: 8 }, (_, i) => ({ side: i % 2 ? 1 : -1, gy: -3 - i * 2.75 }))
  const awns = grains.map(({ side, gy }, i) => {
    const ex = side * (2.2 + (7 - i) * 0.55)
    return `M${f(side * 2.2)} ${f(gy - 2.8)} Q${f(side * 2.6 + ex * 0.3)} ${f(gy - 16)} ${f(ex)} ${f(-48 - (7 - i) * 0.5)}`
  }).join(' ')
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${s})`}>
      <path d={`${awns} M0 -26 L0 -53`} stroke={AWN} strokeWidth={1.05} fill="none" strokeLinecap="round" />
      <path d="M0 1 L0 -24" stroke={STRAW_LINE} strokeWidth={1.4} />
      {grains.map(({ side, gy }, i) => (
        <ellipse key={i} cx={side * 2} cy={gy} rx={2.5} ry={3.8} transform={`rotate(${side * 18} ${side * 2} ${f(gy)})`}
          fill={BARLEY} stroke={BARLEY_LINE} strokeWidth={0.95} />
      ))}
      <ellipse cx={0} cy={-25.5} rx={2.1} ry={3.3} fill={BARLEY} stroke={BARLEY_LINE} strokeWidth={0.95} />
      <path d="M-1.6 -6 L-1.6 -18" stroke="#fff3c4" strokeWidth={0.9} strokeLinecap="round" opacity={0.7} />
    </g>
  )
}

/**
 * A stalk of ripe barley: the straw rising from its foot (x, y), `h` tall, with a leaf, and the ear nodding over
 * at the top (`nod` degrees: plus nods to the right).
 */
export function BarleyStalk({ x, y, h = 60, nod = 14, s = 1 }: { x: number; y: number; h?: number; nod?: number; s?: number }) {
  const tx = Math.sin(rad(nod)) * 5
  const stem = `M0 0 Q${f(-tx * 0.6)} ${f(-h * 0.55)} ${f(tx)} ${f(-h)}`
  const leaf = `M${f(-tx * 0.3)} ${f(-h * 0.4)} Q${f(9 - tx)} ${f(-h * 0.56)} ${f(17 - tx)} ${f(-h * 0.5)} Q${f(8 - tx)} ${f(-h * 0.47)} ${f(-tx * 0.3)} ${f(-h * 0.34)} Z`
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${s})`}>
      <path d={stem} stroke={STRAW_LINE} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d={stem} stroke={STRAW} strokeWidth={1.9} fill="none" strokeLinecap="round" />
      <path d={leaf} fill="#e6c25e" stroke={STRAW_LINE} strokeWidth={1.1} strokeLinejoin="round" />
      <BarleyEar x={tx} y={-h} a={nod} />
    </g>
  )
}

/**
 * A little bunch of barley, tied round the middle: `n` stalks (3 to 5), their ears fanned out on top and the
 * straw splayed out a little below the tie. (0, 0) is the tie (x, y); the ears reach about 70 above it and the
 * straw 26 below, at s = 1. `tie`: the color of what it's tied with (a twist of straw, or a bit of red string).
 */
export function BarleyBunch({ x = 0, y = 0, s = 1, n = 3, tie = STRAW_LINE }: { x?: number; y?: number; s?: number; n?: number; tie?: string }) {
  const spread = n <= 3 ? [-20, 0, 20] : n === 4 ? [-27, -9, 9, 27] : [-32, -16, 0, 16, 32]
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${s})`}>
      {/* the straw: from below the tie, through it, out to each ear */}
      {spread.map((a, i) => {
        const ex = Math.sin(rad(a)) * 20, ey = -Math.cos(rad(a)) * 20
        const d = `M${f(a * 0.32)} 26 Q${f(a * 0.05)} 2 ${f(ex * 0.3)} ${f(ey * 0.3)} Q${f(ex * 0.75)} ${f(ey * 0.75)} ${f(ex)} ${f(ey)}`
        return (
          <g key={i}>
            <path d={d} stroke={STRAW_LINE} strokeWidth={3.6} fill="none" strokeLinecap="round" />
            <path d={d} stroke={STRAW} strokeWidth={2.1} fill="none" strokeLinecap="round" />
          </g>
        )
      })}
      {spread.map((a, i) => <BarleyEar key={i} x={Math.sin(rad(a)) * 20} y={-Math.cos(rad(a)) * 20} a={a * 1.15} s={0.95} />)}
      {/* the tie */}
      <path d="M-6 -2.5 Q0 -0.5 6 -2.5 L6.5 3 Q0 5 -6.5 3 Z" fill={tie} stroke={darken(tie, 0.3)} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M-4 0.8 L4 0.8" stroke={lighten(tie, 0.35)} strokeWidth={1} strokeLinecap="round" />
    </g>
  )
}

/** Where each stalk stands in a basket of barley, as [across (-1 to 1), lean in degrees, how tall], fullest last. */
const HEAP: [number, number, number][] = [
  [0, 2, 1], [-0.34, -12, 0.92], [0.36, 13, 0.94], [-0.14, -5, 1.05], [0.16, 6, 1.02], [-0.58, -22, 0.8],
  [0.6, 21, 0.82], [-0.46, -16, 0.98], [0.48, 17, 0.97], [-0.02, -2, 1.12], [-0.74, -28, 0.7], [0.76, 27, 0.72],
]

/**
 * Barley gathered in a basket: stalks standing up out of it, their ears nodding out over the rim in a fan.
 * (x, y) is the middle of the rim and `w` its width; draw it between the basket's dark inside and its front.
 * `k` (0 to 1) is how full: a few stalks peek over the rim at first, and a big fan stands up when it's full.
 */
export function BarleyHeap({ x, y, w, k = 1 }: { x: number; y: number; w: number; k?: number }) {
  const kk = Math.max(0, Math.min(1, k))
  const n = kk <= 0 ? 0 : Math.max(1, Math.round(kk * HEAP.length))
  const u = w / 120 // (sized for a basket 120 wide)
  const e = 0.86 * Math.max(u, 0.78) // (the ears stay big enough to see in a small basket)
  const rise = (12 + 30 * kk) * u
  // the grain heaped up in the middle, a golden mound of ears packed close
  const mound = kk > 0.15 ? Math.min(1, (kk - 0.15) / 0.6) : 0
  const mh = (6 + 16 * mound) * u, mw = w * (0.3 + 0.18 * mound)
  const stalks = HEAP.slice(0, n).map(([across, lean, tall], i) => {
    const fx = x + across * w * 0.36
    const top = y - rise * tall
    const d = `M${f(fx - Math.sin(rad(lean)) * 22 * u)} ${f(y + 18 * u)} L${f(fx)} ${f(top)}`
    return (
      <g key={i}>
        <path d={d} stroke={STRAW_LINE} strokeWidth={3.4 * u} strokeLinecap="round" />
        <path d={d} stroke={STRAW} strokeWidth={2 * u} strokeLinecap="round" />
        <BarleyEar x={fx} y={top} a={lean * 1.3} s={e} />
      </g>
    )
  })
  return (
    <g>
      {kk > 0 && <ellipse cx={x} cy={y + 2 * u} rx={w * (0.3 + 0.16 * kk)} ry={(4 + 4 * kk) * u} fill={STRAW} stroke={STRAW_LINE} strokeWidth={1.2} />}
      {/* (the stalks at the back, then the mound of grain, then the ones in front) */}
      {stalks.filter((_, i) => i % 2 === 1)}
      {mound > 0 && (
        <g>
          <path d={`M${f(x - mw)} ${f(y + 3 * u)} Q${f(x - mw * 0.8)} ${f(y - mh)} ${f(x)} ${f(y - mh * 1.08)} Q${f(x + mw * 0.8)} ${f(y - mh)} ${f(x + mw)} ${f(y + 3 * u)} Z`}
            fill={BARLEY} stroke={BARLEY_LINE} strokeWidth={1.3} strokeLinejoin="round" />
          {/* grains all over it */}
          <path d={Array.from({ length: Math.round(6 + 10 * mound) }, (_, i) => {
            const t = (i * 0.618) % 1, r = ((i * 0.382) % 1) * 0.85
            const gx = x + (t - 0.5) * 2 * mw * 0.8, gy = y - mh * (0.15 + 0.75 * r) * (1 - Math.abs(t - 0.5) * 1.1)
            return `M${f(gx - 1.6 * u)} ${f(gy)} Q${f(gx)} ${f(gy - 3 * u)} ${f(gx + 1.6 * u)} ${f(gy)}`
          }).join(' ')} stroke={BARLEY_LINE} strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.75} />
          <ellipse cx={x - mw * 0.35} cy={y - mh * 0.6} rx={mw * 0.18} ry={mh * 0.16} fill="#fff6d0" opacity={0.6} />
        </g>
      )}
      {stalks.filter((_, i) => i % 2 === 0)}
    </g>
  )
}

// ---------- Bethlehem ----------

const STONE = '#f3e7cc'
const STONE_LINE = '#bfa57a'

/** A little stone house in Bethlehem, flat-roofed: (x, y) the middle of its foot, `w` wide and `h` tall. `door`/`win`: where they are across it (-0.5 to 0.5), or null. */
function TownHouse({ x, y, w, h, door = -0.18, win = 0.22, shade = 0 }: { x: number; y: number; w: number; h: number; door?: number | null; win?: number | null; shade?: number }) {
  const wall = darken(STONE, shade)
  const sw = Math.max(1, w * 0.04)
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={wall} stroke={STONE_LINE} strokeWidth={sw} />
      <rect x={x - w / 2 - w * 0.04} y={y - h - h * 0.1} width={w * 1.08} height={h * 0.12} fill={darken(STONE, shade + 0.08)} stroke={STONE_LINE} strokeWidth={sw} />
      {door !== null && <path d={`M${f(x + door * w - w * 0.11)} ${f(y)} L${f(x + door * w - w * 0.11)} ${f(y - h * 0.42)} Q${f(x + door * w)} ${f(y - h * 0.56)} ${f(x + door * w + w * 0.11)} ${f(y - h * 0.42)} L${f(x + door * w + w * 0.11)} ${f(y)} Z`} fill="#6b4a32" />}
      {win !== null && <rect x={x + win * w - w * 0.08} y={y - h * 0.72} width={w * 0.16} height={h * 0.18} rx={w * 0.03} fill="#6b4a32" />}
    </g>
  )
}

/** A silvery-green olive tree with a twisty trunk: (x, y) its foot, about 70 tall at s = 1. */
export function OliveTree({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const leaf = '#9db47a'
  const clumps: [number, number, number][] = [[-16, -44, 15], [2, -52, 17], [19, -42, 14], [-6, -34, 13], [12, -32, 12]]
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-4 0 Q-2 -12 -7 -20 Q-3 -26 1 -34 L5 -34 Q3 -24 8 -18 Q4 -10 5 0 Z" fill="#8f7d64" stroke="#665844" strokeWidth={2} strokeLinejoin="round" />
      {clumps.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 1.6} fill={darken(leaf, 0.3)} />)}
      {clumps.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={leaf} />)}
      {clumps.map(([cx, cy, r], i) => <ellipse key={`h${i}`} cx={cx - r * 0.25} cy={cy - r * 0.35} rx={r * 0.5} ry={r * 0.3} fill={lighten(leaf, 0.3)} opacity={0.7} />)}
    </g>
  )
}

/**
 * The little town of Bethlehem on its hill: pale stone houses with flat roofs crowded on the hilltop, olive
 * trees, and fields on the terraces below. (x, y) is the middle of the hill's foot; it's about 300 wide and 150
 * tall at s = 1. `fields`: 'gold' (ripe barley, ready to harvest), 'dry' (bare and cracked: no food will grow),
 * or 'green'. `children` are drawn on the terraces, in the hill's own units (tiny harvesters).
 */
export function Bethlehem({ x, y, s = 1, fields = 'gold', children }: { x: number; y: number; s?: number; fields?: 'gold' | 'dry' | 'green'; children?: ReactNode }) {
  const hill = fields === 'dry' ? '#cdb88c' : '#b7c98a'
  const field = fields === 'gold' ? '#eccb62' : fields === 'dry' ? '#d3b07c' : '#a6d27e'
  const fieldLine = fields === 'gold' ? '#c9a03e' : fields === 'dry' ? '#a88a5e' : '#7fb35e'
  /** How wide the hill is (half of it) `h` above its foot. */
  const hw = (h: number) => 160 * Math.sqrt(Math.max(0, 1 - (h / 108) ** 2))
  // the terraces round the hill's front: [from, to] heights above its foot
  const bands: [number, number][] = [[6, 30], [36, 56], [62, 78]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-162 2 C-150 -36 -104 -102 0 -108 C104 -102 150 -36 162 2 Z" fill={hill} stroke={darken(hill, 0.2)} strokeWidth={2.5} strokeLinejoin="round" />
      {bands.map(([h0, h1], i) => {
        const a0 = hw(h0) - 14, a1 = hw(h1) - 14
        return (
          <g key={i}>
            <path d={`M${f(-a0)} ${-h0} Q0 ${-h0 + 8} ${f(a0)} ${-h0} L${f(a1)} ${-h1} Q0 ${-h1 + 8} ${f(-a1)} ${-h1} Z`} fill={field} stroke={fieldLine} strokeWidth={1.6} strokeLinejoin="round" />
            {fields !== 'green' && Array.from({ length: 8 - i * 2 }, (_, j) => {
              const t = (j + 0.5) / (8 - i * 2)
              const am = (a0 + a1) / 2 - 12
              const tx = -am + 2 * am * t
              const ty = -(h0 + h1) / 2 + 6 - 4 * (1 - (2 * t - 1) ** 2)
              return fields === 'gold'
                ? <path key={j} d={`M${f(tx - 3)} ${f(ty + 4)} l3 -8 l3 8`} stroke={fieldLine} strokeWidth={1.4} fill="none" strokeLinecap="round" />
                : <path key={j} d={`M${f(tx - 5)} ${f(ty)} l4 2 l3 -3 l4 2`} stroke={fieldLine} strokeWidth={1.2} fill="none" strokeLinecap="round" />
            })}
            {/* the low stone wall along each terrace's foot */}
            <path d={`M${f(-a0)} ${-h0} Q0 ${-h0 + 8} ${f(a0)} ${-h0}`} stroke="#a89474" strokeWidth={3} fill="none" opacity={0.6} />
          </g>
        )
      })}
      {children}
      <OliveTree x={-112} y={-50} s={0.55} />
      <OliveTree x={118} y={-48} s={0.5} flip />
      {/* the houses: a back row up high, then a front row a little lower */}
      {([[-44, -100, 34, 34], [-10, -106, 34, 40], [24, -102, 38, 34], [56, -98, 30, 32]] as const).map(([hx, hy, w, h]) => (
        <TownHouse key={`b${hx}`} x={hx} y={hy + 12} w={w} h={h} door={null} win={hx % 3 ? 0.18 : -0.2} shade={0.08} />
      ))}
      {([[-72, -82, 34, 28, -0.2], [-38, -86, 32, 30, 0.15], [-2, -84, 40, 30, -0.22], [36, -86, 32, 28, 0.2], [70, -82, 34, 26, -0.15]] as const).map(([hx, hy, w, h, d]) => (
        <TownHouse key={`f${hx}`} x={hx} y={hy + 12} w={w} h={h} door={d} win={-d} />
      ))}
    </g>
  )
}

// ---------- The items ----------

/** Bethlehem, the little town on the hill, with golden barley fields in front and the road winding up to it. */
function BethlehemTown() {
  const ears = Array.from({ length: 13 }, (_, i) => 6 + i * 7.3)
  return (
    <g>
      <ellipse {...groundShadow(50, 94, 46)} />
      <Bethlehem x={50} y={72} s={0.3} />
      {/* the barley fields at the foot of the hill, and the road winding up through them */}
      <path d="M3 76 Q50 66 97 76 Q101 84 95 90 Q50 98 5 90 Q-1 84 3 76 Z" fill="#eccb62" stroke="#c9a03e" strokeWidth={1.6} strokeLinejoin="round" />
      <path d={ears.map((x, i) => `M${f(x - 1.6)} ${f(82 + (i % 2) * 4)} l1.6 -5 l1.6 5`).join(' ')} stroke="#c9a03e" strokeWidth={1.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 95 Q47 86 48.5 72 L52 72 Q53 86 60 95 Q50 97 40 95 Z" fill="#efdcb0" stroke="#d2b783" strokeWidth={1.4} strokeLinejoin="round" />
    </g>
  )
}

/** Baby Obed, Ruth and Boaz's baby boy, fast asleep and snug in his golden blanket. */
export const OBED_BLANKET = '#ffe2a0'
function BabyObed() {
  return (
    <g>
      <ellipse {...groundShadow(50, 82, 36)} />
      <Baby x={54} y={58} s={1.45} blanket={OBED_BLANKET} />
      <path d="M78 22 C78 17 85 17 85 22 C85 17 92 17 92 22 C92 28 85 32 85 34 C85 32 78 28 78 22 Z" fill="#ff8fb8" stroke={ink('#ff8fb8')} strokeWidth={1.4} />
    </g>
  )
}

export const ISL_RUTH: Item[] = [
  { id: 'bethlehem', name: 'Bethlehem', emoji: [], Draw: BethlehemTown },
  // (no emoji: 👶 is every baby, like baby Jesus)
  { id: 'baby-obed', name: 'baby Obed', emoji: [], Draw: BabyObed },
]
