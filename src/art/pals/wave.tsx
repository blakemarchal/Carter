// Wavey → Ripple → Tidekeeper: a round little wave with a curling crest, sitting on its own foam.
// Ripple's crest grows and a second little curl splashes up beside it; Tidekeeper gets a third curl,
// sea spray and a crown. Grumpy turns it a stormy grey-blue.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, useShade } from '../kit'

type Pt = [number, number]
type Circle = [number, number, number]

/** A smooth tapering tube along the centerline f(t), t = 0…1, with width w(t) and round ends. */
function tube(f: (t: number) => Pt, w: (t: number) => number, n = 36) {
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = f(t)
    const [x1, y1] = f(Math.max(0, t - 0.005)), [x2, y2] = f(Math.min(1, t + 0.005))
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, h = w(t) / 2
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len
    L.push([x + nx * h, y + ny * h])
    R.unshift([x - nx * h, y - ny * h])
  }
  const smooth = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  const r0 = w(0) / 2, r1 = w(1) / 2
  return `M${pt(...L[0])} ${smooth(L)} A${r1} ${r1} 0 0 0 ${pt(...R[0])} ${smooth(R)} A${r0} ${r0} 0 0 0 ${pt(...L[0])}Z`
}

/**
 * A curl of water spiralling round (cx, cy), starting at angle a0 and going `turns` times round
 * (negative = anticlockwise) while its radius shrinks r0 → r1 and its width w0 → w1.
 */
interface Curl { cx: number; cy: number; a0: number; turns: number; r0: number; r1: number; w0: number; w1: number }
const width = (c: Curl, t: number) => c.w0 + (c.w1 - c.w0) * t
const along = (c: Curl, t: number, out = 0): Pt => {
  const a = c.a0 + t * c.turns * Math.PI * 2, r = c.r0 + (c.r1 - c.r0) * t + out
  return [c.cx + Math.cos(a) * r, c.cy + Math.sin(a) * r]
}
const curlPath = (c: Curl) => tube((t) => along(c, t), (t) => width(c, t))
/** White foam riding along the outer edge of a curl, from t0 to t1. */
const foamPath = (c: Curl, t0: number, t1: number) => tube((t) => {
  const u = t0 + (t1 - t0) * t
  return along(c, u, width(c, u) * 0.2)
}, (t) => Math.max(1, width(c, t0 + (t1 - t0) * t) * 0.45 * Math.sin(Math.PI * (0.12 + 0.76 * t))))

/** Outline of a puffy shape: the union of circles listed clockwise around its middle. */
function puff(cs: Circle[]) {
  const n = cs.length
  // Where each circle meets the next, on the outside (to the left of the way round).
  const meet = cs.map(([x1, y1, r1], i): Pt => {
    const [x2, y2, r2] = cs[(i + 1) % n]
    const d = Math.hypot(x2 - x1, y2 - y1)
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    const h = Math.sqrt(Math.max(0, r1 * r1 - a * a))
    const bx = x1 + (a * (x2 - x1)) / d, by = y1 + (a * (y2 - y1)) / d
    return [bx + (h * (y2 - y1)) / d, by - (h * (x2 - x1)) / d]
  })
  let d = `M${pt(...meet[n - 1])}`
  cs.forEach(([x, y, r], i) => {
    const s = meet[(i + n - 1) % n], e = meet[i]
    let turn = Math.atan2(e[1] - y, e[0] - x) - Math.atan2(s[1] - y, s[0] - x)
    if (turn < 0) turn += Math.PI * 2
    d += ` A${r} ${r} 0 ${turn > Math.PI ? 1 : 0} 1 ${pt(...e)}`
  })
  return `${d}Z`
}

/** A water drop pointing up, centered on (x, y). */
const drop = (x: number, y: number, s: number) =>
  `M${x} ${y - 9 * s} C${x + 5 * s} ${y - 3 * s} ${x + 7 * s} ${y + 2 * s} ${x + 7 * s} ${y + 4 * s} A${7 * s} ${7 * s} 0 0 1 ${x - 7 * s} ${y + 4 * s} C${x - 7 * s} ${y + 2 * s} ${x - 5 * s} ${y - 3 * s} ${x} ${y - 9 * s}Z`

// Main crest (curls over to the left), per stage, and the little side curl (curls to the right).
const CREST: Curl[] = [
  { cx: 94, cy: 66, a0: 0.75, turns: -1.1, r0: 30, r1: 6, w0: 18, w1: 5 },
  { cx: 92, cy: 62, a0: 0.72, turns: -1.15, r0: 38, r1: 7, w0: 22, w1: 5 },
  { cx: 92, cy: 64, a0: 0.72, turns: -1.15, r0: 36, r1: 7, w0: 21, w1: 5 },
]
const SIDE: Curl = { cx: 156, cy: 94, a0: 2.36, turns: 1, r0: 22, r1: 5, w0: 13, w1: 4 }
// Foam: a row of little bubbles along the top, a row of bigger ones underneath.
const FOAM = puff([
  ...Array.from({ length: 9 }, (_, i): Circle => [50 + i * 12.5, 163 - (i % 2) * 2, i % 2 ? 9.5 : 8.5]),
  ...[140, 120, 100, 80, 60].map((x): Circle => [x, 174, 10]),
])
// The paler water low on its tummy, with a wavy top edge.
const SHALLOWS = 'M47.9 138 Q56.6 131 65.3 138 T82.7 138 T100 138 T117.4 138 T134.8 138 T152.1 138 A54 46 0 0 1 47.9 138 Z'

export default function Wave({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const SEA = g ? '#5d7c9e' : '#5fb7ff'
  const LIGHT = g ? '#93a8bf' : '#c4e9ff'
  const FOAMC = g ? '#dde3ea' : '#ffffff'
  const sea = useShade(SEA, 0.35, 0.18)
  const foam = useShade(FOAMC, 0.5, 0.08)
  const line = ink(SEA)
  const foamLine = g ? '#9fb0c2' : '#9cd2f7'
  const spray: [number, number, number][] = stage >= 2 ? [[40, 50, 0.8], [56, 30, 0.6], [164, 46, 0.75], [176, 70, 0.55]] : stage >= 1 ? [[44, 52, 0.7], [150, 50, 0.6]] : []
  return (
    <g>
      <defs>{sea.def}{foam.def}</defs>

      {/* Sea spray */}
      {spray.map(([x, y, k], i) => (
        <Anim key={i} cls="pa-twinkle" delay={i * 0.4}>
          <path d={drop(x, y, k)} fill={LIGHT} stroke={line} strokeWidth={2} />
        </Anim>
      ))}

      {/* Little side curls (Ripple: one, Tidekeeper: two) */}
      {stage >= 1 && [1, -1].filter((side) => side > 0 || stage >= 2).map((side) => (
        <Anim key={side} cls="pa-wing" origin={side > 0 ? '0% 100%' : '100% 100%'} delay={side < 0 ? 0.3 : 0}>
          <g transform={side < 0 ? 'translate(200 0) scale(-1 1)' : undefined}>
            <path d={curlPath(SIDE)} fill={sea.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
            <path d={foamPath(SIDE, 0.12, 0.5)} fill={FOAMC} />
          </g>
        </Anim>
      ))}

      {/* The curling crest (Tidekeeper's crown rides on top) */}
      <Anim cls="pa-tail" origin="85% 100%">
        <path d={curlPath(CREST[Math.min(stage, 2)])} fill={sea.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={foamPath(CREST[Math.min(stage, 2)], 0.06, 0.5)} fill={FOAMC} />
        {stage >= 2 && <Crown x={92} y={30} />}
      </Anim>

      {/* Round body */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={126} rx={54} ry={46} fill={sea.fill} stroke={line} strokeWidth={3} />
        <path d={SHALLOWS} fill={LIGHT} opacity={0.8} />
        <Shine x={78} y={96} rx={11} ry={6} />
      </g>

      <CuteFace x={100} y={120} s={0.95} gap={15} mood={mood} blinkDelay={0.5} />

      {/* Foam it sits on */}
      <g className="pa-breathe">
        <path d={FOAM} fill={foam.fill} stroke={foamLine} strokeWidth={3} strokeLinejoin="round" />
      </g>
    </g>
  )
}
