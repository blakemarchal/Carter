// Joseph's Coat: the island's mini-game, "Paint it" (color by number; activities/games/types.ts,
// PaintKit). Joseph stands with his arms out wide to show off his coat, filling the board, and every
// stripe of it is a region to paint: six bands down the coat and three across each sleeve. The numbers
// go from 1 to 6, each twice, so the finished coat is red, orange, yellow, green, blue and purple from
// top to bottom (the colors the story names), with each sleeve going from cool at the shoulder to warm
// at the cuff. When every stripe is painted, Joseph beams and the coat sparkles.
import { useId } from 'react'
import type { At, PaintKit } from '../../activities/games/types'
import { Glow, Scene, Sheep, Sparkles } from '../scenes/kit'
import { COAT_COLORS, Head, JOSEPH_PEOPLE, Tent } from '../scenes/joseph'

const INK = '#5a3a24'
const SKIN = JOSEPH_PEOPLE.josephCoat.skin

// ---------- The coat's shape, in board units (the left half; the right is its mirror) ----------

const SHOULDER: At = [336, 130]
const ARMPIT: At = [318, 240]
const HEM: At = [262, 418]
const CUFF_TOP: At = [126, 190]
const CUFF_BOTTOM: At = [140, 288]
const TOP = 130, BOTTOM = 418, BANDS = 6
const BAND = (BOTTOM - TOP) / BANDS

const mirror = ([x, y]: At): At => [800 - x, y]
const lerp = (a: At, b: At, t: number): At => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const p = ([x, y]: At) => `${x.toFixed(1)} ${y.toFixed(1)}`

/** The coat's left side at height y: down from the shoulder to the armpit, then out to the hem. */
const sideAt = (y: number): At => y <= ARMPIT[1] ? lerp(SHOULDER, ARMPIT, (y - TOP) / (ARMPIT[1] - TOP)) : lerp(ARMPIT, HEM, (y - ARMPIT[1]) / (BOTTOM - ARMPIT[1]))

/** Band k of the body (0 at the top): its two sides follow the coat's sides, and its top and bottom edges dip a little in the middle, like cloth. The top band's top is the neckline. */
function bandPath(k: number) {
  const y0 = TOP + k * BAND, y1 = y0 + BAND
  const l0 = sideAt(y0), l1 = sideAt(y1)
  const r0 = mirror(l0), r1 = mirror(l1)
  // (the armpit is a corner on the sides, so a band that spans it goes round it)
  const corner = y0 < ARMPIT[1] && y1 > ARMPIT[1]
  const down = corner ? `L${p(r1 === r0 ? r1 : mirror(ARMPIT))} L${p(r1)}` : `L${p(r1)}`
  const up = corner ? `L${p(ARMPIT)} L${p(l0)}` : `L${p(l0)}`
  const top = k === 0 ? `Q400 ${TOP - 14} ${p(r0)}` : `Q400 ${(y0 + 8).toFixed(1)} ${p(r0)}`
  const bottom = k === BANDS - 1 ? `Q400 ${BOTTOM + 18} ${p(l1)}` : `Q400 ${(y1 + 8).toFixed(1)} ${p(l1)}`
  return `M${p(l0)} ${top} ${down} ${bottom} ${up} Z`
}

/** Stripe i of the left sleeve (0 at the shoulder, 2 at the cuff), between lines across the sleeve that bow out toward the cuff. */
function sleevePath(i: number) {
  const t0 = i / 3, t1 = (i + 1) / 3
  const a = lerp(SHOULDER, CUFF_TOP, t0), b = lerp(SHOULDER, CUFF_TOP, t1)
  const c = lerp(ARMPIT, CUFF_BOTTOM, t1), d = lerp(ARMPIT, CUFF_BOTTOM, t0)
  // A line across the sleeve from top point q to bottom point r, bowing out toward the cuff by `bow`.
  const across = (q: At, r: At, bow: number) => `Q${p([(q[0] + r[0]) / 2 - bow, (q[1] + r[1]) / 2])} ${p(r)}`
  const back = (r: At, q: At, bow: number) => `Q${p([(q[0] + r[0]) / 2 - bow, (q[1] + r[1]) / 2])} ${p(q)}`
  const inner = i === 0 ? `L${p(SHOULDER)}` : back(d, a, 8) // (the shoulder stripe's inner edge is the coat's side)
  const outer = i === 2 ? `Q${p([CUFF_TOP[0] - 6, (CUFF_TOP[1] + CUFF_BOTTOM[1]) / 2])} ${p(c)}` : across(b, c, 8)
  return `M${p(a)} L${p(b)} ${outer} L${p(d)} ${inner} Z`
}

const mirrorPath = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${(800 - Number(x)).toFixed(1)} ${y}`)

/** The middle of a quadrilateral stripe, for its number. */
const sleeveMid = (i: number): At => {
  const pts = [lerp(SHOULDER, CUFF_TOP, i / 3), lerp(SHOULDER, CUFF_TOP, (i + 1) / 3), lerp(ARMPIT, CUFF_BOTTOM, (i + 1) / 3), lerp(ARMPIT, CUFF_BOTTOM, i / 3)]
  return [pts.reduce((s, q) => s + q[0], 0) / 4 - 2, pts.reduce((s, q) => s + q[1], 0) / 4]
}

// Each region: its number, where its number goes, and its shape. Body bands are 1 to 6 top to
// bottom; the left sleeve is 6, 4, 2 and the right 5, 3, 1, from the shoulder out.
const REGIONS: { id: string; n: number; at: At; d: string }[] = [
  ...Array.from({ length: BANDS }, (_, k) => ({ id: `band-${k + 1}`, n: k + 1, at: [400, k === 0 ? 158 : TOP + k * BAND + 30] as At, d: bandPath(k) })),
  ...[6, 4, 2].map((n, i) => ({ id: `left-${['shoulder', 'middle', 'cuff'][i]}`, n, at: sleeveMid(i), d: sleevePath(i) })),
  ...[5, 3, 1].map((n, i) => ({ id: `right-${['shoulder', 'middle', 'cuff'][i]}`, n, at: mirror(sleeveMid(i)), d: mirrorPath(sleevePath(i)) })),
]

/** The whole coat's outline, for its shading. */
const COAT_OUTLINE = [bandPath(0), ...Array.from({ length: BANDS - 1 }, (_, k) => bandPath(k + 1)), sleevePath(0), sleevePath(1), sleevePath(2), mirrorPath(sleevePath(0)), mirrorPath(sleevePath(1)), mirrorPath(sleevePath(2))]

/**
 * The picture: Joseph in his coat, arms out wide, on the grass by his family's tent. Each stripe is a
 * region (white until it's painted). Anything drawn over the stripes lets taps through to them.
 */
function CoatPicture({ fills }: { fills: Record<string, string> }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const done = REGIONS.every((r) => fills[r.id])
  return (
    <Scene sky="day" ground="meadow">
      <Tent x={104} y={404} s={0.5} />
      <Sheep x={706} y={428} s={0.8} facing="left" />
      {done && <Glow x={400} y={250} r={260} color="#fff3c0" />}
      {/* hands out of the cuffs, and feet under the hem */}
      {[CUFF_TOP, mirror(CUFF_TOP)].map((c, i) => {
        const hx = i ? c[0] + 22 : c[0] - 22
        return <circle key={i} cx={hx} cy={242} r={19} fill={SKIN} stroke="#a8724a" strokeWidth={3} />
      })}
      {[372, 428].map((fx) => <ellipse key={fx} cx={fx} cy={436} rx={24} ry={10} fill="#7a5233" />)}
      {/* the stripes to paint */}
      {REGIONS.map((r) => (
        <path key={r.id} data-region={r.id} d={r.d} fill={fills[r.id] ?? '#ffffff'} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ))}
      {/* soft shading over the cloth (taps go through it) */}
      <g pointerEvents="none">
        <defs>
          <clipPath id={`co${uid}`}>{COAT_OUTLINE.map((d, i) => <path key={i} d={d} />)}</clipPath>
          <radialGradient id={`cg${uid}`} cx="40%" cy="30%" r="75%">
            <stop offset="0" stopColor="#fff" stopOpacity={0.32} />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0} />
            <stop offset="1" stopColor="#3b2414" stopOpacity={0.2} />
          </radialGradient>
        </defs>
        <rect x={100} y={110} width={600} height={330} fill={`url(#cg${uid})`} clipPath={`url(#co${uid})`} />
        {/* the neck of the coat */}
        <path d="M368 128 Q400 146 432 128 Q400 118 368 128 Z" fill="#7a5233" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        {/* Joseph */}
        <g transform="translate(400 304) scale(2)">
          <rect x={-6} y={-100} width={12} height={12} fill={SKIN} />
          <Head look={JOSEPH_PEOPLE.josephCoat} mood={done ? 'joy' : 'happy'} />
        </g>
        {done && <Sparkles spots={[[230, 120, 12], [570, 116, 12], [150, 330, 9], [650, 330, 9], [400, 30, 10], [300, 410, 8], [500, 410, 8]]} color="#ffe680" />}
      </g>
    </Scene>
  )
}

export const JOSEPH_PAINT: PaintKit = {
  Picture: CoatPicture,
  regions: REGIONS.map(({ id, n, at }) => ({ id, n, at })),
  palette: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'].map((name, i) => ({ n: i + 1, color: COAT_COLORS[i], name })),
}
