// Drawn things first needed by the Fishers of People island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//
// The island's story pictures (art/scenes/fishers.tsx) and its game (art/games/fishers.tsx) draw with the
// same pieces, so they're exported: Fishy (a cheerful little fish), NetBag (a fishing net, empty or full of
// fish) and FishHeap (a pile of fish in a boat). (Items can't import from the scenes: the scenes import the
// items, so the pieces live here.)
import type { CSSProperties } from 'react'
import { useId } from 'react'
import type { Item } from './types'
import { CuteFace, darken, ink, lighten, Shine, useShade } from './draw'

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

/** Seeded random numbers between 0 and 1 (the same ones every time), for things scattered by hand. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------- Fish ----------

/** The lake's fish, bright and cheerful: golden, sky blue and coral. */
export const FISH_COLORS = ['#ffbf47', '#62bdf5', '#ff8a6e'] as const

/**
 * A cheerful little fish, side-on, facing right (`flip`: left): a round body with a pale belly, a forked
 * tail, a fin on top and one on its side, and a happy face. (x, y) is its middle; it's about 70 long and 34
 * tall at s = 1. `rot` turns it (degrees). `wag`: its tail swishes, as it swims. `flat`: plain colors and
 * no shine, for a heap of many.
 */
export function Fishy({ x = 0, y = 0, s = 1, color = FISH_COLORS[0], flip, rot = 0, wag, flat, delay = 0 }: {
  x?: number; y?: number; s?: number; color?: string; flip?: boolean; rot?: number; wag?: boolean; flat?: boolean; delay?: number
}) {
  const body = useShade(color, 0.42, 0.16)
  const line = ink(color)
  const fin = darken(color, 0.14)
  const tail = (
    <path d="M-21 0 Q-29 -13 -40 -16 Q-34 -1 -40 15 Q-29 13 -21 0 Z" fill={fin} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
  )
  return (
    <g transform={`translate(${x} ${y})${rot ? ` rotate(${rot})` : ''} scale(${flip ? -s : s} ${s})`}>
      {!flat && <defs>{body.def}</defs>}
      {wag ? <g className="fs-wag" style={{ animationDelay: `${delay}s` } as CSSProperties}>{tail}</g> : tail}
      <path d="M-11 -12 Q-5 -25 12 -15 Q1 -14 -11 -12 Z" fill={fin} stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <path d="M31 1 C31 -10 19 -16 4 -16 C-11 -16 -23 -8 -25 0 C-23 8 -11 16 4 16 C19 16 31 11 31 1 Z" fill={flat ? color : body.fill} stroke={line} strokeWidth={2.4} />
      <path d="M-21 5 C-13 12 -2 14.5 6 14.5 C17 14.5 25 11 28.5 5.5 C17 9.5 -5 10.5 -21 5 Z" fill={lighten(color, 0.62)} opacity={0.9} />
      <path d="M12 -11 Q7 0 12 11" stroke={line} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.5} />
      {!flat && <path d="M-6 -6 q3 3 6 0 M2 -9 q3 3 6 0 M-4 1 q3 3 6 0" stroke={lighten(color, 0.45)} strokeWidth={1.5} fill="none" strokeLinecap="round" />}
      <path d="M1 3 Q11 5 9 13 Q2 11 1 3 Z" fill={fin} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
      <CuteFace x={20} y={-3} s={0.3} gap={10} />
      {!flat && <Shine x={6} y={-10} rx={5.5} ry={2.4} rot={-10} />}
    </g>
  )
}

// ---------- Nets ----------

/** The net's cord, and its darker edge. */
export const NET = '#f4e9cc'
export const NET_LINE = '#9c8456'
/** The rope round the mouth of a net. */
export const ROPE = '#c9a46a'
export const ROPE_LINE = '#6e5634'

/** A rope along `d`: a dark edge, the rope, and little twists. */
export const Rope = ({ d, w = 4 }: { d: string; w?: number }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={ROPE_LINE} strokeWidth={w + 2.4} />
    <path d={d} stroke={ROPE} strokeWidth={w} />
    <path d={d} stroke="#ead2a0" strokeWidth={w * 0.4} strokeDasharray={`${w * 0.8} ${w * 1.1}`} />
  </g>
)

/** Where ten fish lie in a net, bottom first: across (a part of its half-width), down (a part of its depth), a turn, a color and which way it faces. */
const PILE: [number, number, number, number, boolean][] = [
  [-0.25, 0.83, 6, 0, false], [0.26, 0.84, -8, 1, true],
  [-0.55, 0.62, 18, 2, false], [0.01, 0.61, -4, 0, true], [0.56, 0.63, -16, 1, true],
  [-0.33, 0.42, -10, 1, false], [0.35, 0.42, 12, 2, true],
  [-0.6, 0.22, 22, 0, false], [0.0, 0.2, 6, 2, false], [0.6, 0.23, -20, 0, true],
]

/** Lots of fish filling a net or a heap: rows from the bottom up, each as wide as the shape is there (`half`), jostled a little. */
function crowd(half: (up: number) => number, top: number, len: number, seed: number): [number, number, number, number, boolean][] {
  const rnd = seeded(seed)
  const out: [number, number, number, number, boolean][] = []
  for (let up = len * 0.22; up < top - len * 0.05; up += len * 0.34) {
    const h = half(up) - len * 0.32
    if (h <= 0) continue
    const n = Math.max(1, Math.round((h * 2) / (len * 0.62)) + 1)
    for (let i = 0; i < n; i++) {
      const fx = n === 1 ? 0 : -h + (2 * h * i) / (n - 1)
      out.push([fx + (rnd() - 0.5) * len * 0.2, up + (rnd() - 0.5) * len * 0.12, (rnd() - 0.5) * 50, Math.floor(rnd() * 3), rnd() < 0.5])
    }
  }
  return out
}

/**
 * A fishing net hanging open: a round mouth with a rope round it (its middle at (x, y), `w` across, seen a
 * little from above, so its dark inside shows) and a bag of net below it, `depth` deep. `fill` (0 to 1) is
 * how full of fish it is: its first ten are counted out one by one into the net, filling it from the
 * bottom (`n` = 10), and it bulges as it fills. `many`: a bulging net packed with lots of fish (a crowd, not
 * a count). `torn`: so full, a few cords have broken, and a fish is wriggling out.
 */
export function NetBag({ x = 0, y = 0, w = 128, depth = 92, fill = 0, many, torn, seed = 3, rim = true, mesh = w / 5.5, inside = '#2f6585' }: {
  x?: number; y?: number; w?: number; depth?: number; fill?: number; many?: boolean; torn?: boolean; seed?: number; rim?: boolean
  /** How big the net's diamonds are. */
  mesh?: number
  /** The shade inside the net (deep water in the lake). */
  inside?: string
}) {
  const id = uid(useId())
  const W = w / 2
  const ry = Math.max(4, w * 0.085)
  const b = many ? 1.25 : Math.max(0, Math.min(1, fill))
  const d = depth * (1 + 0.1 * b)
  const out = W * (1 + 0.12 * b)
  const lowW = W * (0.42 + 0.42 * b)
  // The bag: down the left side to the bottom, up the right, and back along the front of the mouth.
  const body = `M${-W} 0 C${-out} ${d * 0.5} ${-lowW} ${d} 0 ${d} C${lowW} ${d} ${out} ${d * 0.5} ${W} 0 A${W} ${ry} 0 0 1 ${-W} 0 Z`
  const len = w * (many ? 0.24 : 0.3)
  const fs = len / 70
  // How wide the bag is (its half-width) at a depth below the mouth, from points along its side.
  const side = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24, u = 1 - t
    return [u * u * u * W + 3 * u * u * t * out + 3 * u * t * t * lowW, 3 * u * u * t * d * 0.5 + 3 * u * t * t * d + t * t * t * d]
  })
  const halfAt = (depthBelow: number) => {
    if (depthBelow <= 0) return W * Math.sqrt(Math.max(0, 1 - (depthBelow / ry) ** 2))
    const j = side.findIndex(([, sy]) => sy >= depthBelow)
    if (j <= 0) return j === 0 ? W : 0
    const [x0, y0] = side[j - 1], [x1, y1] = side[j]
    return x0 + ((x1 - x0) * (depthBelow - y0)) / Math.max(0.001, y1 - y0)
  }
  const fish = many
    ? crowd((up) => halfAt(d - up), d + ry * 0.6, len, seed).map(([fx, up, r, c, f]) => [fx, d - up, r, c, f] as const)
    : PILE.slice(0, Math.min(PILE.length, Math.floor(b * PILE.length + 0.35))).map(([fx, fy, r, c, f]) => [fx * W, fy * d, r, c, f] as const)
  // The cords of the net: two sets of lines crossing in diamonds, bowed a little to follow the bag round.
  // The back of the net shows through the front (its cords bowed the other way).
  const cords = (bow: number) => {
    const lines: string[] = []
    const n = Math.ceil((out + d * 1.2) / mesh)
    for (let k = -n; k <= n; k++) {
      const x0 = k * mesh
      lines.push(`M${(x0 - d * 1.1).toFixed(1)} ${-ry} Q${x0.toFixed(1)} ${(d * bow).toFixed(1)} ${(x0 + d * 1.1).toFixed(1)} ${d + 12}`)
      lines.push(`M${(x0 + d * 1.1).toFixed(1)} ${-ry} Q${x0.toFixed(1)} ${(d * bow).toFixed(1)} ${(x0 - d * 1.1).toFixed(1)} ${d + 12}`)
    }
    return lines.join(' ')
  }
  const cord = Math.max(0.9, w * 0.013)
  const hole = { x: W * 0.68, y: d * 0.6 }
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`nb${id}`}><path d={body} /></clipPath>
        <clipPath id={`np${id}`}><path d={body} /><ellipse cx={0} cy={0} rx={W} ry={ry} /></clipPath>
        {torn && (
          <mask id={`nh${id}`}>
            <rect x={-out - 20} y={-ry - 20} width={out * 2 + 40} height={d + 60} fill="#fff" />
            <ellipse cx={hole.x} cy={hole.y} rx={w * 0.09} ry={w * 0.07} fill="#000" transform={`rotate(-30 ${hole.x} ${hole.y})`} />
          </mask>
        )}
      </defs>
      {/* the back of the mouth; inside, the back of the net */}
      {rim && <Rope d={`M${-W} 0 A${W} ${ry} 0 0 1 ${W} 0`} w={Math.max(2.4, w * 0.03)} />}
      <ellipse cx={0} cy={0} rx={W} ry={ry} fill={inside} opacity={0.4} />
      <path d={body} fill={inside} opacity={0.16} />
      <g clipPath={`url(#np${id})`}>
        <path d={cords(0.3)} stroke={NET} strokeWidth={cord * 0.8} fill="none" opacity={0.5} />
        {fish.map(([fx, fy, r, c, f], i) => <Fishy key={i} x={fx} y={fy} s={fs} rot={r} color={FISH_COLORS[c]} flip={f} flat={many} />)}
      </g>
      {/* the front of the net, in front of the fish */}
      <g clipPath={`url(#nb${id})`} mask={torn ? `url(#nh${id})` : undefined}>
        <path d={cords(0.62)} stroke={NET_LINE} strokeWidth={cord * 1.9} fill="none" opacity={0.55} />
        <path d={cords(0.62)} stroke={NET} strokeWidth={cord} fill="none" />
      </g>
      <path d={body} fill="none" stroke={NET_LINE} strokeWidth={cord * 1.9} opacity={0.55} />
      <path d={body} fill="none" stroke={NET} strokeWidth={cord * 1.2} />
      {torn && (
        <g>
          {/* broken cords round the hole, and a fish wriggling out of it */}
          <path d={`M${hole.x - w * 0.11} ${hole.y - w * 0.02} l${w * 0.035} ${w * 0.02} M${hole.x + w * 0.05} ${hole.y - w * 0.08} l${-w * 0.01} ${w * 0.04} M${hole.x + w * 0.1} ${hole.y + w * 0.02} l${-w * 0.035} ${w * 0.005} M${hole.x - w * 0.03} ${hole.y + w * 0.08} l${w * 0.012} ${-w * 0.035}`}
            stroke={NET} strokeWidth={Math.max(1.2, w * 0.014)} strokeLinecap="round" />
          <Fishy x={hole.x + w * 0.14} y={hole.y - w * 0.05} s={fs * 1.05} rot={-20} color={FISH_COLORS[1]} wag />
        </g>
      )}
      {rim && <Rope d={`M${W} 0 A${W} ${ry} 0 0 1 ${-W} 0`} w={Math.max(2.4, w * 0.03)} />}
    </g>
  )
}

/**
 * A heap of fish (in a boat, or a net emptied out): a dome `w` wide and `h` tall, its base's middle at
 * (x, y), packed with fish lying every which way. `len`: how long each fish is.
 */
export function FishHeap({ x, y, w, h, len = 34, seed = 5 }: { x: number; y: number; w: number; h: number; len?: number; seed?: number }) {
  const half = (up: number) => (w / 2) * Math.sqrt(Math.max(0, 1 - (up / h) ** 2))
  const fish = crowd(half, h, len, seed)
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2} 0 A${w / 2} ${h} 0 0 1 ${w / 2} 0 Z`} fill="#3f7fa8" />
      {fish.map(([fx, up, r, c, f], i) => <Fishy key={i} x={fx} y={-up} s={len / 70} rot={r} color={FISH_COLORS[c]} flip={f} flat />)}
    </g>
  )
}

// ---------- The items ----------

/** A wooden pole across the top of the box, that a net hangs from to dry. */
const Pole = ({ bend = 0 }: { bend?: number }) => {
  const d = `M9 15 Q50 ${15 + bend} 91 15`
  return (
    <g strokeLinecap="round">
      <path d={d} stroke="#6b4422" strokeWidth={8.5} fill="none" />
      <path d={d} stroke="#a8763f" strokeWidth={5.5} fill="none" />
      <path d={`M14 13.5 Q50 ${13.5 + bend} 86 13.5`} stroke="#c99a5e" strokeWidth={1.6} fill="none" />
    </g>
  )
}

/** An empty fishing net, washed and hung on a pole: limp, with nothing in it, dripping. */
function EmptyNet() {
  return (
    <g>
      <Pole />
      <Rope d="M27 16 L29 33 M73 16 L71 33" w={2.4} />
      <NetBag x={50} y={34} w={44} depth={52} fill={0} />
      {[[50, 93, 0], [40, 84, 1]].map(([dx, dy, i]) => (
        <path key={i} d={`M${dx} ${dy - 6} q-3.6 5 0 7.5 q3.6 -2.5 0 -7.5 Z`} fill="#9fd8ff" stroke="#4a9ad8" strokeWidth={1.2} />
      ))}
    </g>
  )
}

/** A fishing net hung on a pole, bulging with fish: so heavy, the pole bends. */
function NetOfFish() {
  return (
    <g>
      <Pole bend={5} />
      <Rope d="M22 18 L22 31 M78 18 L78 31" w={2.4} />
      <NetBag x={50} y={32} w={58} depth={52} fill={1} />
    </g>
  )
}

export const ISL_FISHERS: Item[] = [
  { id: 'empty-net', name: 'an empty fishing net', Draw: EmptyNet },
  { id: 'net-of-fish', name: 'a net full of fish', Draw: NetOfFish },
]
