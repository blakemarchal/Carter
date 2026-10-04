// Swish → Frondwave → Royalpalm: a little palm tree facing you, with a cute face on its trunk. Two palm fronds growing
// from its sides are its arms, waving for Jesus, the gentle King of peace; more fronds arch up and out from the top of
// its trunk like hair, drooping at their tips. It stands on two little root feet, their roots reaching into a small
// mound of earth.
// Frondwave's fronds are fuller, and two bunches of dates hang under them; Royalpalm glows softly and wears a tiny
// golden crown with points like palm leaves.
// Grumpy: dull and dry, its fronds drooping with brown edges, cross brows and a frown.
import { useId } from 'react'
import { type BodyProps, Anim, CuteFace, darken, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

const MIRROR = 'translate(200 0) scale(-1 1)'

/** A smooth closed outline through the points (Catmull-Rom). */
function smooth(ps: Pt[]) {
  const n = ps.length
  const at = (i: number) => ps[(i + n) % n]
  return `M${pt(...ps[0])}` + ps.map((_, i) => {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    return ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }).join('') + 'Z'
}

/** An ellipse's outline as polygon points. The glow is drawn as a polygon, so the coloring page (which turns every
 *  path, circle, ellipse and rect into a white shape to fill in) leaves it as it is. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A line through the points and back along itself: it has no inside, so the coloring page inks it as a line. */
const line = (ps: Pt[]) => `M${ps.map((p) => pt(...p)).join(' L')} L${ps.slice(0, -1).reverse().map((p) => pt(...p)).join(' L')}`

type Curve = [Pt, Pt, Pt]
const bez = (t: number, [a, b, c]: Curve): Pt => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}
/** The point d to one side of the curve at t (to the other side if d < 0). */
function off(cv: Curve, t: number, d: number): Pt {
  const [a, b, c] = cv, u = 1 - t
  const dx = u * (b[0] - a[0]) + t * (c[0] - b[0]), dy = u * (b[1] - a[1]) + t * (c[1] - b[1])
  const len = Math.hypot(dx, dy) || 1
  const [x, y] = bez(t, cv)
  return [x + (dy / len) * d, y - (dx / len) * d]
}

/** A smooth tapering root along the curve a → (b) → c, w0 wide at a down to w1 at c, with round ends. */
function tube(cv: Curve, w0: number, w1: number, n = 8) {
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, h = (w0 + (w1 - w0) * t) / 2
    L.push(off(cv, t, h))
    R.unshift(off(cv, t, -h))
  }
  return `M${L.map((p) => pt(...p)).join(' L')} A${w1 / 2} ${w1 / 2} 0 0 1 ${R.map((p) => pt(...p)).join(' L')} A${w0 / 2} ${w0 / 2} 0 0 1 ${pt(...L[0])}Z`
}

const STEM = 0.12 // how far along a frond its leaf starts (a bare stalk before that)
/**
 * A palm frond along the curve a → (b) → c, as one shape: a short stalk, then a long leaf about w wide, smooth along
 * one edge and cut deep into n pointed leaflets along the other (the side that hangs down as it arches), each leaflet
 * sweeping on towards the frond's tip.
 */
function frond(cv: Curve, w: number, n: number) {
  const u = (t: number) => Math.max(0, Math.min(1, (t - STEM) / (1 - STEM)))
  const half = (t: number) => (w / 2) * Math.sin(Math.PI * (0.2 + 0.8 * u(t))) ** 0.6
  const tAt = (k: number) => STEM + ((1 - STEM) * k) / n
  const tipAt = (k: number) => Math.min(1, tAt(k + 1) + (tAt(k + 1) - tAt(k)) * 0.6)
  const P = (t: number, d: number) => pt(...off(cv, t, d))
  const d = [`M${P(0, -2)} L${P(STEM, -2)}`]
  // Out along the smooth edge to the tip
  for (let i = 1; i <= 16; i++) {
    const t = STEM + ((1 - STEM) * i) / 16
    d.push(`L${P(t, -half(t))}`)
  }
  // and back along the cut edge: in from each leaflet's tip to the notch at its root
  for (let k = n - 1; k >= 0; k--) {
    const tip = tipAt(k), mid = tAt(k) + (tip - tAt(k)) * 0.45
    if (k < n - 1) d.push(`L${P(tip, half(tip) * 1.05)}`)
    d.push(`Q${P(mid, half(mid) * 1.1)} ${P(tAt(k), k ? half(tAt(k)) * 0.22 : 2)}`)
  }
  return d.join(' ') + ` L${P(0, 2)}Z`
}
/** A frond's midrib, from its stalk to near its tip. */
const midrib = (cv: Curve) => line(Array.from({ length: 13 }, (_, i) => bez(0.06 + (i / 12) * 0.84, cv)))

// The trunk: a chubby column, a little fuller in the middle, its top hidden in the fronds
const TRUNK = smooth([
  [100, 76], [113, 77], [123, 82], [127, 94], [130, 110], [131, 128], [131, 146], [130, 158], [125, 166],
  [100, 168], [75, 166], [70, 158], [69, 146], [69, 128], [70, 110], [73, 94], [77, 82], [87, 77],
])
// Rings round the trunk where old fronds grew (clear of its face): [y, half-width there]
const RINGS: [number, number][] = [[91, 27.5], [143, 31], [156, 30.5]]
const FACE_Y = 114

// The left half of the fronds on top, like hair, arching up and out from the top of its trunk and drooping at their
// tips: [curve, width, leaflets]. Frondwave and Royalpalm have more, and longer; grumpy, they droop.
type Frond = [Curve, number, number]
const HAIR: Frond[][] = [
  [
    [[[96, 81], [44, 46], [10, 100]], 26, 5],
    [[[98, 79], [64, 22], [20, 40]], 26, 5],
  ],
  [
    [[[95, 82], [40, 52], [6, 112]], 27, 5],
    [[[96, 80], [48, 28], [8, 62]], 27, 5],
    [[[98, 79], [78, 16], [38, 16]], 26, 5],
  ],
]
const DROOP: Frond[][] = [
  [
    [[[96, 81], [58, 66], [38, 124]], 24, 5],
    [[[98, 79], [62, 48], [30, 92]], 24, 5],
  ],
  [
    [[[95, 82], [54, 68], [32, 130]], 25, 5],
    [[[96, 80], [52, 52], [18, 102]], 25, 5],
    [[[98, 79], [70, 40], [40, 62]], 24, 5],
  ],
]
// The frond in the middle (just one, arching over to its left)
const MIDDLE: Frond = [[[100, 79], [100, 30], [70, 18]], 25, 5]
const MIDDLE_DROOP: Frond = [[[100, 79], [98, 46], [72, 52]], 23, 5]
// Its arms, fronds from its sides: waving up (hanging down when grumpy)
const ARM: Curve = [[74, 124], [46, 126], [26, 94]]
const ARM_DOWN: Curve = [[74, 122], [52, 132], [42, 162]]
// The roots reaching from its left foot into the earth (the right foot's are their mirror image)
const ROOTS: Curve[] = [[[72, 173], [62, 177], [56, 185]], [[80, 177], [77, 183], [75, 189]]]

/** A little golden crown, its three points shaped like palm leaves, centred on the middle of its band. */
function LeafCrown({ gold, edge }: { gold: string; edge: string }) {
  const leaf = (tall: number) => `M0 ${-tall} C5 ${-tall * 0.62} 5.5 -4 0 1 C-5.5 -4 -5 ${-tall * 0.62} 0 ${-tall} Z`
  return (
    <g stroke={edge} strokeWidth={2} strokeLinejoin="round">
      {[[-11, -26, 15], [11, 26, 15], [0, 0, 21]].map(([x, a, tall]) => (
        <g key={x} transform={`translate(${x} -2) rotate(${a})`}>
          <path d={leaf(tall)} fill={gold} />
          <path d={line([[0, -tall * 0.78], [0, -2]])} fill="none" strokeWidth={1.4} strokeLinecap="round" />
        </g>
      ))}
      <path d="M-16 -4 Q0 0 16 -4 L16 3 Q0 7 -16 3 Z" fill={gold} />
      <circle cx={0} cy={1.5} r={2.2} fill="#ff6fae" stroke="#c2407e" strokeWidth={1.2} />
    </g>
  )
}

export default function Palm({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `pg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const BARK = g ? '#b3a594' : '#c99c6c'
  const ROOT = g ? '#a29585' : '#b48455'
  const LEAF = g ? '#a7ab72' : '#52c05a'
  const LEAF_EDGE = g ? '#93643a' : ink('#52c05a')
  const RIB = g ? '#d0c898' : '#a5e88f'
  const EARTH = g ? '#93806f' : '#8f6343'
  const DATE = g ? '#bba17f' : '#d9772b'
  const bark = useShade(BARK, 0.35, 0.16)
  const root = useShade(ROOT, 0.3, 0.15)
  const leaf = useShade(LEAF, 0.3, 0.15)
  const earth = useShade(EARTH, 0.3, 0.2)
  const date = useShade(DATE, 0.45, 0.15)
  const barkLine = ink(BARK)
  const fronds = (g ? DROOP : HAIR)[st >= 1 ? 1 : 0]
  const drawFrond = (cv: Curve, w: number, n: number, key: number | string) => (
    <g key={key}>
      <path d={frond(cv, w, n)} fill={leaf.fill} stroke={LEAF_EDGE} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={midrib(cv)} fill="none" stroke={RIB} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
  return (
    <g>
      <defs>
        {bark.def}{root.def}{leaf.def}{earth.def}{date.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#e6f5ff" stopOpacity={0.95} />
          <stop offset="0.6" stopColor="#c4e6ff" stopOpacity={0.5} />
          <stop offset="1" stopColor="#c4e6ff" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Royalpalm's soft glow */}
      {st >= 2 && !g && <polygon points={ring(100, 108, 96, 92)} fill={`url(#${glowId})`} />}

      {/* The small mound of earth it stands on, with a few crumbs */}
      <path d="M34 189 C42 175 70 168 100 168 C130 168 158 175 166 189 Q100 195 34 189 Z" fill={earth.fill} stroke={ink(EARTH)} strokeWidth={3} strokeLinejoin="round" />
      {[[52, 184, 2.2], [146, 183, 2.4], [100, 189, 1.8], [130, 188, 1.6]].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={ink(EARTH)} opacity={0.5} />
      ))}

      {/* Its little root feet, their roots reaching into the earth */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          {ROOTS.map((cv, i) => <path key={i} d={tube(cv, 6, 3)} fill={root.fill} stroke={ink(ROOT)} strokeWidth={2} strokeLinejoin="round" />)}
          <ellipse cx={81} cy={170} rx={14} ry={8.5} fill={root.fill} stroke={ink(ROOT)} strokeWidth={3} />
        </g>
      ))}

      {/* Its arms: fronds from its sides, waving (hanging down when grumpy), behind the trunk */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          {g
            ? drawFrond(ARM_DOWN, 22, 4, 'arm')
            : <Anim cls="pa-wing" origin="100% 100%" delay={side > 0 ? 0.5 : 0}>{drawFrond(ARM, 23, 4, 'arm')}</Anim>}
        </g>
      ))}

      {/* The fronds on top, like hair, swaying a little */}
      <Anim cls="pa-tail" origin="50% 100%" delay={0.5}>{drawFrond(...(g ? MIDDLE_DROOP : MIDDLE), 'mid')}</Anim>
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-tail" origin="100% 100%" delay={side > 0 ? 1.1 : 0}>
            {fronds.map(([cv, w, n], i) => drawFrond(cv, w, n, i))}
          </Anim>
        </g>
      ))}

      {/* The trunk, with its rings */}
      <g className="pa-breathe">
        <path d={TRUNK} fill={bark.fill} stroke={barkLine} strokeWidth={3} strokeLinejoin="round" />
        {RINGS.map(([y, w]) => (
          <path key={y} d={line([[101.5 - w, y], [86, y + 4], [100, y + 5], [114, y + 4], [98.5 + w, y]])}
            fill="none" stroke={darken(BARK, 0.22)} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <Shine x={80} y={101} rx={6.5} ry={3.8} />
      </g>

      {/* Frondwave's dates, hanging in two bunches under its fronds */}
      {st >= 1 && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <path d={line([[84, 82], [74, 84], [68, 90]])} stroke={g ? '#a08a5c' : '#b07a2a'} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {[[64, 92], [71, 93], [60, 99], [67, 100]].map(([x, y]) => (
            <ellipse key={x * 1000 + y} cx={x} cy={y} rx={3.8} ry={5} fill={date.fill} stroke={ink(DATE)} strokeWidth={1.8} />
          ))}
        </g>
      ))}

      {/* Royalpalm's little crown */}
      {st >= 2 && <g transform="translate(100 75)"><LeafCrown gold={g ? '#ddd0a0' : '#ffd34d'} edge={g ? '#a89c70' : '#d29a00'} /></g>}

      <CuteFace x={100} y={FACE_Y} s={0.8} gap={15} mood={mood} blinkDelay={0.4} />

      {st >= 2 && !g && [[22, 142, 6], [178, 138, 7], [168, 22, 5.5]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
