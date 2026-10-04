// Fishers of People: "Let Down the Nets", a Catch it game (activities/games/types.ts, CatchKit).
// Right after Peter says "Because You say so, I will", he lets his net down into the deep water, and the child
// slides it along under his boat to catch the fish. The picture is under the lake: its surface runs along near
// the top, splashing where fish leap out and dive back in, and the fish come leaping down into the water and
// diving into the net. The net hangs on two ropes from Peter's boat, up out of sight. Ten fish, each counted
// into the net, which bulges as it fills; as it fills, more and more fish come swimming (far off: "so many
// fish!", as part two begins), and at the end the water sparkles. The near lake bed runs along the front.
import { useId, type CSSProperties } from 'react'
import type { CatchKit } from '../../activities/games/types'
import { Scene, Sparkles } from '../scenes/kit'
import { FISH_COLORS, Fishy, NetBag, Rope } from '../items/isl-fishers'
import { EelGrass, LakeBed, Pebbles, Splash } from '../scenes/fishers'
import '../scenes/fishers.css'

const GOAL = 10
/** Where the water's surface is, near the top: the fish come leaping in from above it. */
const SURFACE = 58
/** The net's mouth: how wide, and where it runs (its ropes go up from its two ends). */
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

/** Where fish leap out of the water and dive back in, far off: [x, seconds into the loop it starts, size]. */
const LEAPS: [number, number, number][] = [[136, 0, 0.3], [418, 1.3, 0.34], [662, 2.5, 0.3]]
/** Splashes on their own (where the fish we catch came leaping in): [x, delay]. */
const SPLASHES: [number, number][] = [[268, 0.6], [548, 1.9], [760, 3.0], [40, 2.2]]

function Backdrop({ caught }: { caught: number }) {
  const id = `fg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const p = Math.max(0, Math.min(1, caught / GOAL))
  const done = caught >= GOAL
  const far = done ? FAR_FISH.length : Math.round(p * (FAR_FISH.length - 2))
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
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
      {/* the hills round the lake, far away over the water */}
      <path d="M-10 60 L-10 40 Q60 26 140 36 Q220 22 310 34 Q400 24 480 36 Q570 20 660 34 Q740 26 810 36 L810 60 Z" fill="#cfe5bf" />
      <path d="M-10 60 L-10 48 Q90 38 190 46 Q300 36 400 46 Q520 38 620 46 Q720 38 810 46 L810 60 Z" fill="#a9d290" />
      {/* the water, its little waves rolling */}
      <path className="sc-wave" d={`M-80 ${SURFACE} ${WAVES} L880 470 L-80 470 Z`} fill={`url(#${id}w)`} />
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
      {/* fish leaping far off, and splashes where they leap out and dive back in */}
      {LEAPS.map(([x, t, s], i) => (
        <g key={i}>
          <g className="fs-leap" style={{ animationDelay: `${t}s` } as CSSProperties}>
            <Fishy x={x} y={SURFACE - 6} s={s} color={FISH_COLORS[i % 3]} flat />
          </g>
          <Splash x={x - 14} y={SURFACE + 1} s={0.42} delay={t} />
          <Splash x={x + 16} y={SURFACE + 1} s={0.36} delay={t + 3.6 * 0.38} />
        </g>
      ))}
      {SPLASHES.map(([x, t], i) => <Splash key={i} x={x} y={SURFACE + 1} s={0.5} delay={t} />)}
      {done && <Sparkles spots={[[110, 120, 10], [260, 200, 8], [400, 110, 11], [540, 190, 9], [690, 110, 10], [340, 300, 7], [600, 320, 7]]} color="#fff6c0" />}
    </Scene>
  )
}

// ---------- The net ----------

/**
 * Peter's net, its mouth's middle at (0, 0), W across: a rope round the mouth, and the net below, filling with
 * fish (`fill`). It hangs on two ropes from his boat, up out of sight above the water. (The ropes are drawn as
 * markers, so the game measures the net alone, not the long ropes: getBBox leaves markers out. The game puts
 * its glow, its numbers and its pointing hand by what it measures.)
 */
function Catcher({ fill }: { fill: number }) {
  const id = `fc${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const rope = (dir: 1 | -1) => (
    <marker id={`${id}${dir > 0 ? 'l' : 'r'}`} markerUnits="userSpaceOnUse" markerWidth={1} markerHeight={1} orient="0" style={{ overflow: 'visible' }}>
      <Rope d={`M0 0 L${dir * 26} -480`} w={3.4} />
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

// ---------- What falls: fish, leaping in and diving down ----------

/** A fish diving down through the water, its tail swishing, a trail of bubbles behind it. */
function Diving({ color, left, delay }: { color: string; left?: boolean; delay: number }) {
  const d = left ? -1 : 1
  return (
    <g>
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

// ---------- In front: the water's surface, and the near lake bed ----------

function Front() {
  return (
    <g>
      <path className="sc-wave" d={`M-80 ${SURFACE} ${WAVES}`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.85} />
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
