// Drawn things first needed by the manna island (its activities and pictures). Same style and rules as
// the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//
// The island's story pictures (art/scenes/manna.tsx) draw with the same pieces, so they're exported:
// MannaHeap (manna piled up), MannaJar (Aaron's golden jar of manna), Quail (standing or flying) and
// RockSpring (the rock with water pouring out). (Items can't import from the scenes: the scenes import
// the items, so the pieces live here.)
import { useId, type CSSProperties } from 'react'
import type { Item } from './types'
import { darken, EYE, groundShadow, ink, lighten, Shine, useShade } from './draw'

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

/** Seeded random numbers between 0 and 1 (the same ones every time), for things scattered by hand. */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------- Manna: little white round flakes, "like frost" (Exodus 16:14) ----------

export const MANNA = '#fffdf6'
export const MANNA_LINE = '#d6cbb6'

/**
 * A heap of manna: little white round flakes piled into a dome, `w` wide and `h` tall, its base's middle
 * at (x, y). `k` (0 to 1) is how much there is: the heap grows from a thin layer to the full dome (a
 * basket filling up). `r` is the size of one flake.
 */
export function MannaHeap({ x, y, w, h, k = 1, r = Math.max(2, Math.min(6.5, w / 12)), seed = 1 }: {
  x: number; y: number; w: number; h: number; k?: number; r?: number; seed?: number
}) {
  const hh = Math.max(r * 0.8, h * Math.max(0, Math.min(1, k)))
  const rnd = seeded(seed)
  const flakes: [number, number][] = []
  for (let j = 0; ; j++) {
    const up = j * r * 1.2
    if (up > hh - r * 0.4) break
    const half = (w / 2) * Math.sqrt(Math.max(0, 1 - (up / hh) ** 2)) - r * 0.55
    const n = Math.max(1, Math.round((half * 2) / (r * 1.55)) + 1)
    for (let i = 0; i < n; i++) {
      const fx = n === 1 ? 0 : -half + (2 * half * i) / (n - 1)
      flakes.push([x + fx + (rnd() - 0.5) * r * 0.5, y - up - r * 0.25 + (rnd() - 0.5) * r * 0.35])
    }
  }
  return (
    <g>
      {/* the heap's shape underneath, so no gaps show between the flakes */}
      <path d={`M${x - w / 2} ${y} A${w / 2} ${hh} 0 0 1 ${x + w / 2} ${y} Z`} fill="#f4efe4" stroke={MANNA_LINE} strokeWidth={1.2} />
      {flakes.map(([fx, fy], i) => <circle key={`o${i}`} cx={fx} cy={fy} r={r} fill={MANNA} stroke={MANNA_LINE} strokeWidth={Math.max(0.7, r * 0.2)} />)}
      {flakes.filter((_, i) => i % 3 === 0).map(([fx, fy], i) => <circle key={`h${i}`} cx={fx - r * 0.3} cy={fy - r * 0.35} r={r * 0.3} fill="#ffffff" />)}
    </g>
  )
}

/** One flake of manna, close up: a little round white flake with a soft shine. (x, y) = its middle. */
export const Flake = ({ x, y, r = 5 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={MANNA} stroke={MANNA_LINE} strokeWidth={Math.max(0.8, r * 0.18)} />
    <circle cx={x - r * 0.32} cy={y - r * 0.34} r={r * 0.32} fill="#ffffff" />
  </g>
)

// ---------- Aaron's jar of manna (Exodus 16:33; a golden jar, Hebrews 9:4) ----------

const GOLD = '#f2c94c'

/**
 * Aaron's jar of manna: a round golden jar with two little handles and a patterned band, heaped with
 * manna at its mouth. (x, y) = the middle of its foot; it's about 64 wide and 74 tall at s = 1.
 */
export function MannaJar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const gold = useShade(GOLD, 0.45, 0.22)
  const line = darken(GOLD, 0.4)
  const body = 'M-13 -2 Q-29 -9 -29.5 -29 Q-30 -45 -18 -52 L-14.5 -57 L14.5 -57 L18 -52 Q30 -45 29.5 -29 Q29 -9 13 -2 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{gold.def}</defs>
      {/* the handles, at its shoulders */}
      {[-1, 1].map((d) => <path key={d} d={`M${d * 19} -50 Q${d * 35} -52 ${d * 31} -36`} stroke={line} strokeWidth={6.5} fill="none" strokeLinecap="round" />)}
      {[-1, 1].map((d) => <path key={`i${d}`} d={`M${d * 19} -50 Q${d * 35} -52 ${d * 31} -36`} stroke={lighten(GOLD, 0.15)} strokeWidth={3.2} fill="none" strokeLinecap="round" />)}
      <ellipse cx={0} cy={-2} rx={15} ry={3.6} fill={darken(GOLD, 0.15)} stroke={line} strokeWidth={2} />
      <path d={body} fill={gold.fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
      {/* a band round its middle, with little round studs */}
      <path d="M-29.3 -27 Q0 -19 29.3 -27" stroke={darken(GOLD, 0.2)} strokeWidth={5} fill="none" />
      {[-21, -11, 0, 11, 21].map((bx) => <circle key={bx} cx={bx} cy={-23.2 + Math.abs(bx) * -0.12} r={1.7} fill="#fff6c8" stroke={line} strokeWidth={0.8} />)}
      {/* the neck and its rim, with the manna heaped in its mouth */}
      <rect x={-15} y={-60} width={30} height={5} rx={2} fill={darken(GOLD, 0.08)} stroke={line} strokeWidth={2} />
      <ellipse cx={0} cy={-60} rx={18} ry={4.6} fill={lighten(GOLD, 0.2)} stroke={line} strokeWidth={2.2} />
      <ellipse cx={0} cy={-60} rx={14} ry={3} fill={darken(GOLD, 0.45)} />
      <MannaHeap x={0} y={-60.5} w={30} h={15} r={3.6} seed={7} />
      <Shine x={-17} y={-36} rx={3.2} ry={8} rot={14} />
    </g>
  )
}

// ---------- The quail (Exodus 16:13) ----------

const QUAIL = '#ad7a4e'
const QUAIL_WING = '#8c5d3a'
const QUAIL_BELLY = '#f0dcb6'
const PLUME = '#3e2a1c'

/**
 * A quail standing on the ground: a round little brown bird with a speckled cream tummy, a little curly
 * plume on its head, a short tail at the back and two thin legs. Seen from the side, facing right (or
 * left). (x, y) = its feet on the ground; it's about 50 wide and 47 tall at s = 1. `peck`: its head down,
 * pecking at the ground. `flying`: in the air instead (a FlyingQuail; then (x, y) is its middle).
 */
export function Quail({ x, y, s = 1, facing = 'right', flying, peck, blinkDelay = 0 }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; flying?: boolean; peck?: boolean; blinkDelay?: number
}) {
  if (flying) return <FlyingQuail x={x} y={y} s={s} tilt={facing === 'left' ? -8 : 8} blinkDelay={blinkDelay} />
  return <StandingQuail x={x} y={y} s={s} facing={facing} peck={peck} blinkDelay={blinkDelay} />
}

function StandingQuail({ x, y, s = 1, facing = 'right', peck, blinkDelay = 0 }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; peck?: boolean; blinkDelay?: number
}) {
  const id = uid(useId())
  const body = useShade(QUAIL, 0.32, 0.18)
  const line = ink(QUAIL)
  const head = peck ? { x: 15, y: -14 } : { x: 11.5, y: -28.5 }
  const bodyEl = { cx: 0, cy: -17, rx: 15.5, ry: 12 }
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>
        {body.def}
        <clipPath id={`${id}b`}><ellipse {...bodyEl} /></clipPath>
      </defs>
      <ellipse cx={1} cy={0.5} rx={15} ry={2.6} fill="#000" opacity={0.13} />
      {/* legs and toes */}
      <g stroke="#c4834a" strokeWidth={2.1} strokeLinecap="round" fill="none">
        <path d="M-3.5 -7 L-4.5 -0.5 M-4.5 -0.5 L-9 0 M-4.5 -0.5 L0 0.3" opacity={0.85} />
        <path d="M4 -6.5 L4.5 -0.5 M4.5 -0.5 L0 0 M4.5 -0.5 L9.5 0.3" />
      </g>
      {/* a short tail, tipped up at the back */}
      <path d="M-12.5 -19 L-23 -28 Q-25 -22 -21 -16 L-14 -13 Z" fill={darken(QUAIL, 0.08)} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
      {/* the round body, its speckled tummy and its folded wing */}
      <ellipse {...bodyEl} fill={body.fill} stroke={line} strokeWidth={2.2} />
      <g clipPath={`url(#${id}b)`}>
        <path d="M-9 -2 Q8 0 17 -12 Q15 -22 9 -27 Q2 -15 -9 -2 Z" fill={QUAIL_BELLY} />
        <g fill="none" stroke="#9a6a42" strokeWidth={1.1} strokeLinecap="round" opacity={0.8}>
          {[[4, -19], [9, -16], [1, -13], [6, -11], [11, -9], [-2, -8], [3, -6]].map(([sx, sy]) => <path key={`${sx}${sy}`} d={`M${sx - 1.6} ${sy - 0.8} Q${sx} ${sy + 1} ${sx + 1.6} ${sy - 0.8}`} />)}
        </g>
      </g>
      <path d="M-14 -21 Q-4 -28 8 -21.5 Q5 -12.5 -6.5 -10 Q-14.5 -12 -14 -21 Z" fill={QUAIL_WING} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-10 -19 Q-3 -22 4 -19 M-9.5 -15 Q-4 -17 1.5 -15" stroke="#f0dcb0" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {/* the head: a pale cheek, one eye (we see it from the side), a little dark beak, and the plume curling forward */}
      <circle cx={head.x} cy={head.y} r={8.4} fill={body.fill} stroke={line} strokeWidth={2.1} />
      <ellipse cx={head.x + 2.3} cy={head.y + 2.6} rx={4.6} ry={3.1} fill={QUAIL_BELLY} />
      <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
        <circle cx={head.x + 2.8} cy={head.y - 1} r={2.4} fill={EYE} />
        <circle cx={head.x + 2.1} cy={head.y - 1.8} r={0.85} fill="#fff" />
      </g>
      <ellipse cx={head.x + 4.4} cy={head.y + 3.8} rx={1.9} ry={1.1} fill="#ff8fb0" opacity={0.45} />
      <path d={`M${head.x + 7.6} ${head.y - 1.2} L${head.x + 12.6} ${head.y + 0.9} L${head.x + 7.8} ${head.y + 2.9} Z`} fill="#5a3a24" stroke="#3b2414" strokeWidth={0.9} strokeLinejoin="round" />
      <path d={`M${head.x} ${head.y - 7.3} C${head.x - 1.2} ${head.y - 12.8} ${head.x + 0.8} ${head.y - 18.2} ${head.x + 6.4} ${head.y - 17.7} C${head.x + 9.4} ${head.y - 17.2} ${head.x + 9.4} ${head.y - 13} ${head.x + 6.2} ${head.y - 12.6} C${head.x + 3.8} ${head.y - 12.2} ${head.x + 2.7} ${head.y - 10.3} ${head.x + 2.8} ${head.y - 7.5} Z`} fill={PLUME} stroke={PLUME} strokeWidth={0.8} strokeLinejoin="round" />
    </g>
  )
}

/** A quail's wing spread out to the left from its shoulder (about (-8, -2)), feather tips along its lower edge. */
const SPREAD_WING = 'M-7 -9 C-17 -19 -31 -22 -41 -17 Q-45 -11.5 -38.5 -9.5 Q-40 -3.5 -32.5 -3 Q-32 2.5 -25 1 Q-21 6 -15 3.5 L-7 5 Z'

/**
 * A quail flying toward us: a round little body with its speckled tummy, its head with two eyes, a little
 * beak and the curly plume on top, and a wing spread out at each side, beating from the shoulders.
 * (x, y) = the middle of its body; about 80 wide (wingtip to wingtip) and 50 tall at s = 1. `tilt`: a
 * little lean (degrees), so a flock isn't all the same.
 */
export function FlyingQuail({ x, y, s = 1, tilt = 0, blinkDelay = 0 }: { x: number; y: number; s?: number; tilt?: number; blinkDelay?: number }) {
  const id = uid(useId())
  const body = useShade(QUAIL, 0.32, 0.18)
  const line = ink(QUAIL)
  const wing = (
    <g className="sc-wing" style={{ '--o': '100% 50%' } as CSSProperties}>
      <path d={SPREAD_WING} fill={QUAIL_WING} stroke={line} strokeWidth={1.9} strokeLinejoin="round" />
      <path d="M-9 -6 Q-20 -12 -33 -12 Q-24 -6 -12 -2 Z" fill="#c99a6a" opacity={0.85} />
      <path d="M-13 -9 Q-24 -15 -36 -14 M-12 -3 Q-21 -5 -30 -5" stroke="#f0dcb0" strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
      <defs>
        {body.def}
        <clipPath id={`${id}b`}><ellipse cx={0} cy={0} rx={12.5} ry={13} /></clipPath>
      </defs>
      {/* the wings, out at the sides (the right one is the left one mirrored) */}
      {wing}
      <g transform="scale(-1 1)">{wing}</g>
      {/* a little fanned tail peeking out below */}
      <path d="M-6 9 L-3 17 L0 13.5 L3 17 L6 9 Z" fill={darken(QUAIL, 0.1)} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
      {/* the round body and its speckled tummy */}
      <ellipse cx={0} cy={0} rx={12.5} ry={13} fill={body.fill} stroke={line} strokeWidth={2.1} />
      <g clipPath={`url(#${id}b)`}>
        <ellipse cx={0} cy={6} rx={9} ry={9} fill={QUAIL_BELLY} />
        <g fill="none" stroke="#9a6a42" strokeWidth={1.1} strokeLinecap="round" opacity={0.8}>
          {[[-4, 2], [3, 2], [-1, 6], [5, 7], [-5, 8], [1, 10]].map(([sx, sy]) => <path key={`${sx}${sy}`} d={`M${sx - 1.6} ${sy - 0.8} Q${sx} ${sy + 1} ${sx + 1.6} ${sy - 0.8}`} />)}
        </g>
      </g>
      {/* the head, with two eyes, rosy cheeks, a little beak and the plume curling forward on top */}
      <circle cx={0} cy={-14} r={8.6} fill={body.fill} stroke={line} strokeWidth={2} />
      <ellipse cx={0} cy={-11} rx={5} ry={3.2} fill={QUAIL_BELLY} />
      <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
        {[-3.4, 3.4].map((ex) => (
          <g key={ex}>
            <circle cx={ex} cy={-15.5} r={1.9} fill={EYE} />
            <circle cx={ex - 0.5} cy={-16.2} r={0.65} fill="#fff" />
          </g>
        ))}
      </g>
      {[-6, 6].map((cx) => <ellipse key={cx} cx={cx} cy={-12} rx={1.6} ry={1} fill="#ff8fb0" opacity={0.45} />)}
      <path d="M-2 -12.6 L2 -12.6 L0 -9.6 Z" fill="#5a3a24" stroke="#3b2414" strokeWidth={0.8} strokeLinejoin="round" />
      <path d="M-1.2 -22.4 C-2.6 -27 -1 -32 3.2 -32 C6.2 -32 6.2 -28 3.6 -27.6 C1.8 -27.4 1 -25.4 1.2 -22.6 Z" fill={PLUME} stroke={PLUME} strokeWidth={0.8} strokeLinejoin="round" />
    </g>
  )
}

// ---------- The rock with water pouring out (Exodus 17:6) ----------

const ROCK = '#c9a585'
export const WATER = { light: '#bfe9fb', mid: '#6cc4f0', deep: '#3a98d8' }

/**
 * The big rock Moses hit with his staff, with fresh water pouring out of a crack in its side, down into a
 * pool. (x, y) = the middle of the rock's foot; at s = 1 the rock is about 260 wide and 210 tall, the
 * water gushes out on its left at about (-92, -118) and lands in the pool around (-178, -6).
 * `dry`: no water yet (just the crack). `pool`: how far the pool spreads each way from its middle (-156, 0).
 */
export function RockSpring({ x, y, s = 1, dry, pool = 124 }: { x: number; y: number; s?: number; dry?: boolean; pool?: number }) {
  const id = uid(useId())
  const rock = useShade(ROCK, 0.3, 0.25)
  const line = darken(ROCK, 0.42)
  const shape = 'M-134 0 C-148 -40 -136 -96 -106 -138 C-86 -168 -54 -200 -8 -208 C38 -214 86 -196 112 -160 C138 -124 150 -64 138 0 Z'
  // The gush of water: a sheet that leaves the crack and widens as it curves down into the pool.
  const gush = 'M-98 -134 C-120 -140 -150 -128 -168 -110 Q-178 -100 -184 -88 C-198 -62 -208 -36 -214 -8 L-146 -8 C-146 -40 -140 -70 -128 -88 Q-118 -102 -98 -110 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        {rock.def}
        <clipPath id={`${id}r`}><path d={shape} /></clipPath>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4f7ff" /><stop offset="0.5" stopColor={WATER.light} /><stop offset="1" stopColor={WATER.mid} />
        </linearGradient>
      </defs>
      {/* the pool at its foot */}
      {!dry && (
        <g>
          <ellipse cx={-156} cy={2} rx={pool + 6} ry={22} fill={WATER.deep} opacity={0.3} />
          <ellipse cx={-156} cy={0} rx={pool} ry={19} fill={WATER.mid} stroke="#3a98d8" strokeWidth={2.5} />
          <ellipse cx={-160} cy={-3} rx={pool * 0.79} ry={12} fill={WATER.light} opacity={0.6} />
          {[[-156 - pool * 0.65, 5, 14], [-112, 6, 18], [-156 - pool * 0.76, -4, 9]].map(([wx, wy, ww]) => <path key={wx} d={`M${wx - ww} ${wy} q${ww / 2} -4 ${ww} 0 t${ww} 0`} stroke="#ffffff" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.85} />)}
        </g>
      )}
      {/* the rock: big and lumpy, with sunny and shady sides, layers, a few cracks and pebbles at its foot */}
      <path d={shape} fill={rock.fill} stroke={line} strokeWidth={3.5} strokeLinejoin="round" />
      <g clipPath={`url(#${id}r)`}>
        <path d="M40 -214 C70 -150 76 -70 60 10 L160 10 L160 -220 Z" fill={darken(ROCK, 0.14)} opacity={0.75} />
        <path d="M-150 -40 C-100 -30 -40 -36 20 -24 C70 -14 110 -18 160 -30 L160 10 L-150 10 Z" fill={darken(ROCK, 0.12)} opacity={0.6} />
        <path d="M-150 -86 C-90 -78 -20 -92 40 -80 C80 -72 120 -80 160 -90" stroke={darken(ROCK, 0.18)} strokeWidth={3} fill="none" opacity={0.55} />
        <path d="M-60 -196 C-30 -186 0 -190 26 -200" stroke={lighten(ROCK, 0.4)} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.6} />
        <path d="M-118 -110 C-112 -132 -96 -154 -78 -170" stroke={lighten(ROCK, 0.35)} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.5} />
      </g>
      <g stroke={line} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-78 -132 L-62 -124 L-46 -134" />
        <path d="M20 -170 L34 -146 L28 -126" />
        <path d="M84 -88 L100 -70 L96 -48" />
        <path d="M-40 -56 L-22 -62 L-10 -54" />
      </g>
      {[[-2, -3, 13, 8], [26, -2, 9, 6], [118, -2, 11, 7]].map(([px, py, rx, ry]) => <ellipse key={px} cx={px} cy={py} rx={rx} ry={ry} fill={darken(ROCK, 0.05)} stroke={line} strokeWidth={2} />)}
      {/* the crack the water comes out of */}
      <path d="M-102 -138 Q-90 -142 -86 -126 Q-88 -108 -100 -104 Q-110 -112 -108 -126 Q-108 -134 -102 -138 Z" fill="#4a3c32" stroke={line} strokeWidth={2.2} />
      {/* the water: bursting out of the crack in a froth, curving down into the pool, and splashing */}
      {!dry && (
        <g>
          <path d={gush} fill={`url(#${id}w)`} stroke="#5ab2e6" strokeWidth={2.5} strokeLinejoin="round" />
          <g stroke="#ffffff" fill="none" strokeLinecap="round">
            <path d="M-104 -126 C-140 -128 -184 -94 -198 -20" strokeWidth={4.5} strokeDasharray="26 14" opacity={0.9} />
            <path d="M-104 -116 C-130 -112 -158 -84 -168 -22" strokeWidth={3.5} strokeDasharray="18 16" opacity={0.75} />
          </g>
          <path d="M-104 -112 C-122 -104 -138 -84 -146 -46" stroke={WATER.mid} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.55} />
          {/* froth where it bursts out */}
          {[[-101, -126, 10], [-110, -114, 8.5], [-114, -131, 7.5], [-97, -112, 6.5], [-122, -123, 6], [-106, -140, 5]].map(([fx, fy, r], i) => <circle key={`f${i}`} cx={fx} cy={fy} r={r + 1.8} fill="#a9dcf5" />)}
          {[[-101, -126, 10], [-110, -114, 8.5], [-114, -131, 7.5], [-97, -112, 6.5], [-122, -123, 6], [-106, -140, 5]].map(([fx, fy, r], i) => <circle key={`w${i}`} cx={fx} cy={fy} r={r} fill="#ffffff" />)}
          {/* drops flying off */}
          {[[-132, -140, 4], [-150, -126, 3], [-122, -150, 3.5], [-212, -64, 4], [-226, -40, 3], [-134, -66, 3]].map(([dx, dy, r], i) => <circle key={`d${i}`} cx={dx} cy={dy} r={r} fill="#ffffff" stroke="#8fcff0" strokeWidth={1.2} />)}
          {/* where it lands: a ring of foam, and spray leaping out on both sides */}
          <g className="rs-splash">
            {[[-222, -14, -1], [-138, -14, 1]].map(([sx, sy, d]) => (
              <g key={sx} transform={`translate(${sx} ${sy}) scale(${d} 1)`}>
                {[[16, 26, 8], [40, 32, 8], [64, 24, 7]].map(([a, len, w], i) => {
                  const r = (a * Math.PI) / 180, ux = Math.sin(r), uy = -Math.cos(r)
                  const tx = ux * len, ty = uy * len
                  return <path key={i} d={`M${-uy * w * 0.5} ${ux * w * 0.5} Q${tx * 0.6 - uy * w} ${ty * 0.6 + ux * w} ${tx} ${ty} Q${tx * 0.6 + uy * w} ${ty * 0.6 - ux * w} ${uy * w * 0.5} ${-ux * w * 0.5} Z`} fill="#ffffff" stroke="#9fd6f2" strokeWidth={1.5} />
                })}
                <circle cx={30} cy={-38} r={3.5} fill="#ffffff" stroke="#9fd6f2" strokeWidth={1.2} />
              </g>
            ))}
          </g>
          {[[-226, -6, 8], [-208, -9, 10], [-190, -7, 11], [-171, -9, 10], [-153, -7, 9], [-138, -5, 7]].map(([fx, fy, r], i) => <circle key={`r${i}`} cx={fx} cy={fy} r={r + 1.8} fill="#a9dcf5" />)}
          {[[-226, -6, 8], [-208, -9, 10], [-190, -7, 11], [-171, -9, 10], [-153, -7, 9], [-138, -5, 7]].map(([fx, fy, r], i) => <circle key={`s${i}`} cx={fx} cy={fy} r={r} fill="#ffffff" />)}
        </g>
      )}
    </g>
  )
}

// ---------- The items ----------

/** Aaron's golden jar, heaped with manna, shining: kept so everyone would remember how God fed them. (No emoji: 🍯 is honey, 🫙 an empty jar.) */
function MannaJarItem() {
  const id = `mj${uid(useId())}`
  return (
    <g>
      <defs><radialGradient id={id}><stop offset="0" stopColor="#fff6c0" stopOpacity={0.95} /><stop offset="0.65" stopColor="#fff6c0" stopOpacity={0.4} /><stop offset="1" stopColor="#fff6c0" stopOpacity={0} /></radialGradient></defs>
      <circle cx={50} cy={52} r={46} fill={`url(#${id})`} />
      <ellipse {...groundShadow(50, 93, 26)} />
      <MannaJar x={50} y={93} s={1.17} />
      {[[16, 30, 5], [84, 26, 6], [88, 62, 4], [12, 66, 4]].map(([sx, sy, r], i) => (
        <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={`M${sx} ${sy - r} L${sx + r * 0.25} ${sy - r * 0.25} L${sx + r} ${sy} L${sx + r * 0.25} ${sy + r * 0.25} L${sx} ${sy + r} L${sx - r * 0.25} ${sy + r * 0.25} L${sx - r} ${sy} L${sx - r * 0.25} ${sy - r * 0.25} Z`} fill="#ffe27a" stroke="#d9a400" strokeWidth={0.8} />
      ))}
    </g>
  )
}

/** A quail standing on the ground: a round little brown bird with a speckled tummy and a curly plume. (No emoji: 🐦 is another bird.) */
const QuailItem = () => <Quail x={47} y={88} s={1.82} />

/**
 * Manna, which tasted like crackers made with honey (Exodus 16:31): a little stack of thin, round, white
 * wafers with tiny holes, like crackers, beside a pot of honey with its dipper dripping onto them.
 */
function MannaWafers() {
  const honey = '#f5b335'
  const pot = '#d9875a'
  // [x, y, r] of each wafer, back to front: a stack of three, and one leaning on it
  const wafers: [number, number, number][] = [[36, 74, 22], [36, 66, 22], [36, 58, 22]]
  const holes = [[-0.5, -0.05], [-0.15, -0.3], [0.2, -0.05], [0.5, -0.25], [-0.25, 0.25], [0.15, 0.3], [0.55, 0.15]]
  return (
    <g strokeLinejoin="round">
      <ellipse {...groundShadow(52, 91, 42)} />
      {/* the honey pot, with its dipper */}
      <path d="M68 90 Q60 88 60 76 Q60 64 68 61 L68 57 L88 57 L88 61 Q96 64 96 76 Q96 88 88 90 Z" fill={pot} stroke={ink(pot)} strokeWidth={2.2} />
      <path d="M61 72 Q78 77 95 72" stroke={honey} strokeWidth={4} fill="none" />
      <ellipse cx={78} cy={57} rx={11} ry={3.2} fill={honey} stroke={ink(pot)} strokeWidth={1.8} />
      <path d="M82 56 L70 28" stroke="#a0703f" strokeWidth={3.4} strokeLinecap="round" />
      <ellipse cx={70} cy={26} rx={4.2} ry={6.2} fill={honey} stroke={darken(honey, 0.3)} strokeWidth={1.4} transform="rotate(-24 70 26)" />
      {/* the wafers: thin and round, with tiny holes like crackers */}
      {wafers.map(([wx, wy, r], k) => (
        <g key={k}>
          <ellipse cx={wx} cy={wy + 3.5} rx={r} ry={r * 0.42} fill="#ece2cc" stroke={MANNA_LINE} strokeWidth={2} />
          <ellipse cx={wx} cy={wy} rx={r} ry={r * 0.42} fill={MANNA} stroke={MANNA_LINE} strokeWidth={2} />
          {k === wafers.length - 1 && holes.map(([dx, dy], i) => <circle key={i} cx={wx + dx * r} cy={wy + dy * r * 0.42} r={1.2} fill="#d9ccb2" />)}
        </g>
      ))}
      {/* honey dripping from the dipper onto the top wafer, and a little puddle of it */}
      <path d="M66 30 Q60 40 52 50" stroke={honey} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <path d="M34 57 Q42 52 52 55 Q58 58 52 60 Q44 62 36 60 Q31 59 34 57 Z" fill={honey} stroke={darken(honey, 0.25)} strokeWidth={1.2} />
      <Shine x={26} y={55} rx={5} ry={1.8} rot={-6} />
    </g>
  )
}

/** The big rock with fresh water pouring out of it into a pool (Exodus 17:6). */
const RockWaterItem = () => <RockSpring x={61} y={86} s={0.235} pool={86} />

export const ISL_MANNA: Item[] = [
  { id: 'manna-jar', name: 'jar of manna', Draw: MannaJarItem },
  { id: 'quail', name: 'quail', Draw: QuailItem },
  { id: 'manna-wafers', name: 'manna, like crackers made with honey', Draw: MannaWafers },
  { id: 'rock-water', name: 'water pouring out of a rock', Draw: RockWaterItem },
]
