// Bubbles → Splashy → Oceana: a round, chubby whale facing you, tail flipping up behind it.
// Its spout grows each stage (a big fountain for Oceana, who also wears a crown) and bubbles drift up.
import { type BodyProps, Anim, Crown, CuteFace, darken, ink, pt, Shine, useShade } from '../kit'

type Pt = [number, number]
/** A smooth tapering tube along the curve a → (b) → c, width w0 at a to w1 at c, with round ends. */
function tube(a: Pt, b: Pt, c: Pt, w0: number, w1: number, n = 12) {
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t
    const x = u * u * a[0] + 2 * u * t * b[0] + t * t * c[0]
    const y = u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]
    const dx = u * (b[0] - a[0]) + t * (c[0] - b[0]), dy = u * (b[1] - a[1]) + t * (c[1] - b[1])
    const len = Math.hypot(dx, dy) || 1, h = (w0 + (w1 - w0) * t) / 2
    L.push([x - (dy / len) * h, y + (dx / len) * h])
    R.unshift([x + (dy / len) * h, y - (dx / len) * h])
  }
  const smooth = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return `M${pt(...L[0])} ${smooth(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${smooth(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}

const MIRROR = 'translate(200 0) scale(-1 1)'
const BLUE = '#7f9cff'
const BELLY = '#e7ecff'
const WATER = '#a6ddff'
const WATER_LINE = '#5aa9e6'

/** A water drop pointing up, centered on (x, y). */
const drop = (x: number, y: number, s: number) =>
  `M${x} ${y - 9 * s} C${x + 5 * s} ${y - 3 * s} ${x + 7 * s} ${y + 2 * s} ${x + 7 * s} ${y + 4 * s} A${7 * s} ${7 * s} 0 0 1 ${x - 7 * s} ${y + 4 * s} C${x - 7 * s} ${y + 2 * s} ${x - 5 * s} ${y - 3 * s} ${x} ${y - 9 * s}Z`

// The spout: three jets fanning up out of the blowhole (taller and wider each stage), plus drops.
const JET_H = [18, 30, 40]
const JET_W = [12, 18, 24]
const DROPS: [number, number, number][][] = [
  [],
  [[72, 66, 0.55], [128, 66, 0.55]],
  [[80, 36, 0.55], [120, 36, 0.55], [66, 60, 0.65], [134, 60, 0.65]],
]
const BUBBLES: [number, number, number][][] = [
  [[40, 74, 6]],
  [[38, 70, 7], [26, 96, 4.5]],
  [[36, 70, 8], [22, 98, 5], [174, 112, 5], [44, 44, 4.5]],
]

export default function Whale({ stage, mood }: BodyProps) {
  const body = useShade(BLUE, 0.35, 0.18)
  const fin = useShade(darken(BLUE, 0.1), 0.3, 0.15)
  const belly = useShade(BELLY, 0.4, 0.06)
  const water = useShade(WATER, 0.5, 0.1)
  const line = ink(BLUE)
  const s = stage >= 2 ? 1.15 : stage >= 1 ? 1 : 0.8 // tail and fin size
  const st = Math.min(stage, 2)
  const h = JET_H[st], jw = JET_W[st]
  return (
    <g>
      <defs>{body.def}{fin.def}{belly.def}{water.def}</defs>

      {/* Bubbles drifting up */}
      {BUBBLES[st].map(([x, y, r], i) => (
        <Anim key={i} cls="pa-float" delay={i * 0.6}>
          <circle cx={x} cy={y} r={r} fill="#eef9ff" stroke="#7cc6ff" strokeWidth={2.2} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill="#fff" />
        </Anim>
      ))}

      {/* Spout of water from the blowhole */}
      <Anim cls="pa-breathe">
        {[-1, 1, 0].map((side) => (
          <path key={side} fill={water.fill} stroke={WATER_LINE} strokeWidth={2.5} strokeLinejoin="round"
            d={side ? tube([100 + side * 2, 79], [100 + side * 3, 79 - h], [100 + side * jw, 79 - h * 0.55], 5, 8) : tube([100, 79], [100, 79 - h / 2], [100, 79 - h - 2], 5.5, 9)} />
        ))}
        {DROPS[st].map(([x, y, k], i) => <path key={i} d={drop(x, y, k)} fill={water.fill} stroke={WATER_LINE} strokeWidth={2} />)}
      </Anim>

      {/* Tail flipping up behind (mirrored twice so the wag swings it in towards the body, not out of the picture) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="80% 100%">
          <g transform={MIRROR}>
            <g transform={`translate(140 104) rotate(18) scale(${s})`}>
              <path d="M-10 0 C-9 -14 -7 -24 -5 -32 C-15 -34 -25 -40 -29 -52 C-17 -53 -7 -49 0 -41 C7 -49 17 -53 29 -52 C25 -40 15 -34 5 -32 C7 -24 9 -14 10 0 Z"
                fill={fin.fill} stroke={line} strokeWidth={3 / s} strokeLinejoin="round" />
            </g>
          </g>
        </Anim>
      </g>

      {/* Flippers that paddle */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="100% 0%">
            <path d={`M50 136 C${44 - 12 * s} ${138 + 2 * s} ${40 - 18 * s} ${146 + 8 * s} ${38 - 20 * s} ${152 + 14 * s} C${44 - 8 * s} ${156 + 10 * s} ${50} ${154} 58 148 Z`}
              fill={fin.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          </Anim>
        </g>
      ))}

      {/* Round body with a pale, grooved tummy */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={124} rx={60} ry={50} fill={body.fill} stroke={line} strokeWidth={3} />
        <path d="M58 150 C70 140 130 140 142 150 C134 166 118 173 100 173 C82 173 66 166 58 150 Z" fill={belly.fill} stroke={ink(BELLY)} strokeWidth={2} strokeLinejoin="round" />
        <path d="M72 154 Q100 147 128 154 M80 163 Q100 158 120 163" stroke="#c4cdf2" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <Shine x={74} y={90} rx={13} ry={7} />
      </g>
      <ellipse cx={100} cy={77} rx={6} ry={2.5} fill={line} opacity={0.6} />

      <CuteFace x={100} y={116} s={0.92} gap={16} mood={mood} blinkDelay={0.9} />

      {stage >= 2 && (
        <g transform="rotate(-20 72 82)">
          <Crown x={72} y={82} />
        </g>
      )}
    </g>
  )
}

