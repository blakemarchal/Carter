// Fishers of People: "Let Down the Nets", a Catch it game (activities/games/types.ts, CatchKit).
// Right after Peter says "Because You say so, I will", he lets his net down into the deep water, and the child
// slides it along to catch the fish. The picture is under the lake, its surface high on the board: above it, a strip
// of sky, the hills and the far water, where little fish leap out and splash back in. The fish we catch come diving
// in from above the surface: the strip is drawn in front of them (Front), so each one first shows at the surface,
// nose first, with a splash of bubbles, and dives down into the net. The net hangs on two ropes from cork floats
// bobbing at the surface. Ten fish, each counted into the net, which bulges as it fills; as it fills, more and more
// fish come swimming (far off: "so many fish!", as part two begins), and at the end the water sparkles. The near
// lake bed runs along the front.
// (Why floats, not Peter's boat above the net: the game squashes the whole net from its foot as each fish drops in,
// and a boat hung that far above it would jolt down and up with every catch. A float bobbing is just what floats do.)
import { useId, type CSSProperties } from 'react'
import type { CatchKit } from '../../activities/games/types'
import { Scene, Sparkles } from '../scenes/kit'
import { FISH_COLORS, Fishy, NetBag, Rope } from '../items/isl-fishers'
import { EelGrass, LakeBed, Pebbles, Splash } from '../scenes/fishers'
import '../scenes/fishers.css'

const GOAL = 10
/** Where the water's surface is, high on the board: the fish come diving in from above it. */
const SURFACE = 58
/** The net's mouth: how wide, and where it runs (its ropes go up from its two ends to the floats). */
const W = 128
const LANE_Y = 292

/** The surface's little waves, from x = -80 to 880 (it rolls to and fro with sc-wave). */
const WAVES = Array.from({ length: 12 }, () => 'q20 -5 40 0 t40 0').join(' ')

// ---------- The backdrop: under the lake ----------

/** Far fish (pale, small), who come swimming as the net fills: [x, y, size, facing left]. */
const FAR_FISH: [number, number, number, boolean][] = [
  [92, 214, 0.36, false], [690, 196, 0.36, true], [150, 168, 0.3, false], [738, 246, 0.32, true],
  [52, 262, 0.32, false], [636, 150, 0.3, true], [196, 236, 0.34, false], [760, 166, 0.3, true],
  [118, 132, 0.28, false], [604, 232, 0.34, true], [40, 186, 0.3, false], [716, 120, 0.28, true],
  [230, 176, 0.28, false], [572, 182, 0.3, true], [176, 290, 0.3, false], [664, 284, 0.3, true],
]

function Backdrop({ caught }: { caught: number }) {
  const id = `fg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const p = Math.max(0, Math.min(1, caught / GOAL))
  const done = caught >= GOAL
  const far = done ? FAR_FISH.length : Math.round(p * (FAR_FISH.length - 2))
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`${id}w`} gradientUnits="userSpaceOnUse" x1={0} y1={SURFACE} x2={0} y2={450}>
          <stop offset="0" stopColor="#a8e8ee" />
          <stop offset="0.3" stopColor="#62c0dc" />
          <stop offset="0.78" stopColor="#3690c4" />
          <stop offset="1" stopColor="#2d78b0" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.36} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* the water (its top is behind the strip of sky in front) */}
      <rect x={-10} y={SURFACE - 12} width={820} height={470 - SURFACE} fill={`url(#${id}w)`} />
      <rect x={-10} y={SURFACE + 4} width={820} height={10} fill="#d8f6f8" opacity={0.35} />
      {/* sunlight shining down through it */}
      <g className="fs-shimmer">
        {[[120, 56], [300, 44], [470, 60], [640, 46], [790, 52]].map(([x, w], i) => (
          <path key={i} d={`M${x} ${SURFACE + 2} L${x + w} ${SURFACE + 2} L${x + w - 96} 430 L${x - 130} 430 Z`} fill={`url(#${id}r)`} opacity={done ? 1 : 0.55 + 0.35 * p} />
        ))}
      </g>
      {/* more and more fish come swimming as the net fills */}
      <g className="fs-swim" opacity={0.5}>
        {FAR_FISH.slice(0, far).map(([x, y, s, left], i) => <Fishy key={i} x={x} y={y} s={s} flip={left} color="#d9f2fb" flat />)}
      </g>
      {/* the lake bed, far side */}
      <LakeBed y={412} />
      {[[60, 420, 0.9], [230, 414, 1.1], [520, 418, 1], [700, 412, 0.85]].map(([x, y, s], i) => <EelGrass key={i} x={x} y={y} s={s} delay={i * 0.7} />)}
      <Pebbles y={424} xs={[110, 168, 380, 432, 610, 770]} />
      {/* bubbles rising */}
      {[[150, 400, 0], [470, 392, 1.6], [762, 404, 2.8], [330, 410, 3.5]].map(([x, y, d], i) => (
        <g key={i} className="fs-rise" style={{ animationDelay: `${d}s` } as CSSProperties}>
          {[[0, 0, 4], [5, -16, 3], [-2, -30, 5]].map(([dx, dy, r], j) => <circle key={j} cx={x + dx} cy={y + dy} r={r} fill="#ffffff" fillOpacity={0.3} stroke="#e8fbff" strokeWidth={1.5} />)}
        </g>
      ))}
      {done && <Sparkles spots={[[110, 120, 10], [260, 200, 8], [400, 110, 11], [540, 190, 9], [690, 110, 10], [340, 300, 7], [600, 320, 7]]} color="#fff6c0" />}
    </Scene>
  )
}

// ---------- The net ----------

/** A cork float bobbing at the surface, a rope tied under it. (0, 0) is its middle. */
const Float = () => (
  <g>
    <ellipse cx={0} cy={0} rx={11} ry={7.5} fill="#d98a3c" stroke="#8a4f1f" strokeWidth={2.4} />
    <path d="M-11 0 Q0 4 11 0" stroke="#b56a2a" strokeWidth={2} fill="none" />
    <ellipse cx={-4} cy={-3} rx={4} ry={2} fill="#fff" opacity={0.5} />
  </g>
)

/**
 * Peter's net, its mouth's middle at (0, 0), W across: a rope round the mouth, and the net below, filling with fish
 * (`fill`). It hangs on two ropes from cork floats at the surface. (The ropes and floats are drawn as markers, so the
 * game measures the net alone: getBBox leaves markers out. The game puts its glow, its numbers and its pointing hand
 * by what it measures.)
 */
function Catcher({ fill }: { fill: number }) {
  const id = `fc${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  // (the floats sit just under the surface line, from the middle of the net's mouth)
  const top = SURFACE - LANE_Y + 8
  const rope = (dir: 1 | -1) => (
    <marker id={`${id}${dir > 0 ? 'l' : 'r'}`} markerUnits="userSpaceOnUse" markerWidth={1} markerHeight={1} orient="0" style={{ overflow: 'visible' }}>
      <Rope d={`M0 0 L${dir * 12} ${top + 6}`} w={3.4} />
      <g transform={`translate(${dir * 12} ${top})`}><Float /></g>
    </marker>
  )
  return (
    <g>
      <defs>{rope(1)}{rope(-1)}</defs>
      <path d={`M${-W / 2 + 3} -1 l0.2 -0.2`} fill="none" markerStart={`url(#${id}l)`} />
      <path d={`M${W / 2 - 3} -1 l-0.2 -0.2`} fill="none" markerStart={`url(#${id}r)`} />
      <NetBag w={W} depth={88} fill={fill} />
    </g>
  )
}

// ---------- What falls: fish, diving in from above the surface ----------

/** Bubbles round a fish diving in, as [x, y, r] (the fish dives down to the right). */
const BURST: [number, number, number][] = [[-15, 9, 3.2], [-7, 23, 2.4], [17, 15, 2.8], [21, 1, 2.2], [-21, -6, 2.6], [11, -13, 2.2], [3, 24, 1.8], [-24, 16, 1.8]]

/** A fish diving down through the water, its tail swishing, a trail of bubbles behind it, and a splash of bubbles round it as it dives in. */
function Diving({ color, left, delay }: { color: string; left?: boolean; delay: number }) {
  const d = left ? -1 : 1
  return (
    <g>
      <g className="fs-burst">
        <g fill="#ffffff" fillOpacity={0.45} stroke="#ffffff" strokeWidth={1.6}>
          {BURST.map(([x, y, r], i) => <circle key={i} cx={d * x} cy={y} r={r} />)}
        </g>
      </g>
      <g fill="#ffffff" fillOpacity={0.35} stroke="#effcff" strokeWidth={1.6}>
        {[[-25, -43, 3.4], [-30, -55, 2.6], [-27, -66, 3.8]].map(([x, y, r], i) => <circle key={i} cx={d * x} cy={y} r={r} />)}
      </g>
      <Fishy rot={d * 62} flip={left} color={color} wag delay={delay} />
    </g>
  )
}

const DivingGold = () => <Diving color={FISH_COLORS[0]} delay={0} />
const DivingBlue = () => <Diving color={FISH_COLORS[1]} left delay={0.2} />
const DivingCoral = () => <Diving color={FISH_COLORS[2]} delay={0.35} />

// ---------- In front: the sky over the lake, and the near lake bed ----------

/** Where little fish leap out of the far water and dive back in: [x, seconds into the loop it starts, size]. */
const LEAPS: [number, number, number][] = [[136, 0, 0.3], [418, 1.3, 0.34], [662, 2.5, 0.3]]

/**
 * Drawn over everything: a strip of sky, the hills round the lake and the far water, down to the surface (so the
 * fish diving in first show at the surface, and the net's ropes go up out of the water), with little fish leaping
 * out of the far water and splashing back in; and the near lake bed along the bottom.
 */
function Front() {
  const id = `ff${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        {/* (the sky, then the far water from behind the hills down to the surface) */}
        <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={SURFACE}>
          <stop offset="0" stopColor="#8ccff8" /><stop offset="0.78" stopColor="#d4effc" />
          <stop offset="0.79" stopColor="#a6dcf3" /><stop offset="1" stopColor="#a6dcf3" />
        </linearGradient>
      </defs>
      <path className="sc-wave" d={`M-80 ${SURFACE} ${WAVES} L880 -20 L-80 -20 Z`} fill={`url(#${id}s)`} />
      <path d="M-10 52 L-10 34 Q60 22 140 30 Q220 18 310 28 Q400 20 480 30 Q570 16 660 28 Q740 22 810 30 L810 52 Z" fill="#cfe5bf" />
      <path d="M-10 52 L-10 42 Q90 34 190 40 Q300 32 400 40 Q520 34 620 40 Q720 34 810 40 L810 52 Z" fill="#a9d290" />
      {/* little fish leaping out of the far water, and splashing as they leap out and dive back in */}
      {LEAPS.map(([x, t, s], i) => (
        <g key={i}>
          <g className="fs-leap" style={{ animationDelay: `${t}s` } as CSSProperties}>
            <Fishy x={x} y={46} s={s} color={FISH_COLORS[i % 3]} flat />
          </g>
          <Splash x={x - 14} y={52} s={0.36} delay={t} />
          <Splash x={x + 16} y={52} s={0.32} delay={t + 3.6 * 0.38} />
        </g>
      ))}
      <path className="sc-wave" d={`M-80 ${SURFACE} ${WAVES}`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.9} />
      {/* the near lake bed */}
      <LakeBed y={436} near />
      <EelGrass x={8} y={448} s={0.95} delay={0.4} />
      <EelGrass x={794} y={450} s={0.9} delay={1.3} />
      <Pebbles y={444} xs={[70, 250, 330, 560, 640, 730]} near />
    </g>
  )
}

export const FISHERS_GAME: CatchKit = {
  Backdrop,
  Catcher,
  width: W,
  falling: [DivingGold, DivingBlue, DivingCoral],
  goal: GOAL,
  lane: { y: LANE_Y, from: 16, to: 784 },
  Front,
}
