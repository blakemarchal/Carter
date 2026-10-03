// Twinkle → Starbright → Promisestar: a chubby little five-pointed star with a face, standing on its two
// lower points (God promised Abraham a family as many as the stars). Starbright glows, with sparkles all
// around; Promisestar wears a crown, and four tiny buddy stars circle round it.
// Grumpy: a dull, dim gold, with its arms drooping.
import { useId } from 'react'
import { type BodyProps, Anim, CuteFace, pt, Shine, starPath, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** A closed outline through the corners with each corner rounded off by its radius (an arc that fits the corner). */
function rounded(ps: Pt[], radius: (i: number) => number) {
  const n = ps.length
  const corners = ps.map((v, i) => {
    const p = ps[(i + n - 1) % n], q = ps[(i + 1) % n]
    const u: Pt = [p[0] - v[0], p[1] - v[1]], w: Pt = [q[0] - v[0], q[1] - v[1]]
    const lu = Math.hypot(...u), lw = Math.hypot(...w)
    const half = Math.acos((u[0] * w[0] + u[1] * w[1]) / (lu * lw)) / 2
    const r = radius(i), d = r / Math.tan(half)
    const turn = (v[0] - p[0]) * (q[1] - v[1]) - (v[1] - p[1]) * (q[0] - v[0])
    return { a: [v[0] + (u[0] / lu) * d, v[1] + (u[1] / lu) * d] as Pt, b: [v[0] + (w[0] / lw) * d, v[1] + (w[1] / lw) * d] as Pt, r, sweep: turn > 0 ? 1 : 0 }
  })
  return corners.map((c, i) => `${i ? 'L' : 'M'}${pt(...c.a)} A${c.r} ${c.r} 0 0 ${c.sweep} ${pt(...c.b)}`).join(' ') + 'Z'
}

/** A chubby star centred on (cx, cy): points R out, inner corners r out; `droop` tips the two arms down (degrees). */
function chubbyStar(cx: number, cy: number, R: number, r: number, droop = 0) {
  const ps = Array.from({ length: 10 }, (_, i): Pt => {
    const a = ((-90 + 36 * i + (i === 2 ? droop : i === 8 ? -droop : 0)) * Math.PI) / 180
    const d = i % 2 ? r : R
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]
  })
  return rounded(ps, (i) => (i % 2 ? 7 : 10))
}

const CY = 124 // the star's middle
const R = 72
const MIRROR = 'scale(-1 1)'
// A crown with a deeper outline and gems, so it stands out on a yellow star (like the Sun's).
const CROWN = 'M-16 0 L-16 -14 L-8 -6 L0 -18 L8 -6 L16 -14 L16 0 Z'

/** A tiny buddy star with a face, drawn so its box is centred on (0, 0) (so it can spin about its middle). */
const Buddy = ({ fill, line, frown }: { fill: string; line: string; frown: boolean }) => (
  <g>
    <path d={starPath(0, 0.95, 10)} fill={fill} stroke={line} strokeWidth={2} strokeLinejoin="round" />
    <circle cx={-2.6} cy={0.6} r={1.2} fill="#2b2140" />
    <circle cx={2.6} cy={0.6} r={1.2} fill="#2b2140" />
    <path d={frown ? 'M-1.6 4.2 Q0 2.9 1.6 4.2' : 'M-1.6 3 Q0 4.4 1.6 3'} stroke="#2b2140" strokeWidth={1} fill="none" strokeLinecap="round" />
  </g>
)

export default function Star({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const GOLD = g ? '#d9c98f' : '#ffd23f'
  const LINE = g ? '#a8956a' : '#e8952a'
  const GLOW = g ? '#e9e4d0' : '#fff3a6'
  const body = useShade(GOLD, g ? 0.3 : 0.5, 0.14)
  const buddy = useShade(g ? '#d2c79c' : '#ffe680', 0.4, 0.12)
  const gold = useShade('#ffe066', 0.5, 0.15)
  const glowId = `glow${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        {body.def}{buddy.def}{gold.def}
        <radialGradient id={glowId}>
          <stop offset="0.45" stopColor={GLOW} stopOpacity={g ? 0.35 : 0.9} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* A soft glow behind it once grown */}
      {stage >= 1 && <circle cx={100} cy={CY - 8} r={80} fill={`url(#${glowId})`} />}

      {/* Promisestar's buddies, circling round it (behind it as they pass its lower half). Each spins back the other
          way inside a mirror, so it stays upright as the ring turns. */}
      {stage >= 2 && (
        <g transform="translate(100 96)">
          <g className="pa-spin">
            {[[0, -72], [72, 0], [0, 72], [-72, 0]].map(([x, y]) => (
              <g key={`${x}${y}`} transform={`translate(${x} ${y}) ${MIRROR}`}>
                <g className="pa-spin"><g transform={MIRROR}><Buddy fill={buddy.fill} line={LINE} frown={g} /></g></g>
              </g>
            ))}
          </g>
        </g>
      )}

      {/* The star itself, gently breathing, with its face (and crown) on it */}
      <g className="pa-breathe">
        <path d={chubbyStar(100, CY, R, 38, g ? 14 : 0)} fill={body.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <Shine x={g ? 66 : 64} y={g ? 112 : 104} rx={8} ry={4.5} rot={-20} />
        <Shine x={96} y={68} rx={3.5} ry={7} rot={10} />
        <CuteFace x={100} y={CY - 4} s={0.9} gap={14} mood={mood} blinkDelay={0.5} />
        {stage >= 2 && (
          <g transform="translate(100 68)">
            <path d={CROWN} fill={gold.fill} stroke="#c07a00" strokeWidth={2.5} strokeLinejoin="round" />
            <circle cx={0} cy={-6} r={3} fill="#ff6fa8" stroke="#c94a80" strokeWidth={1} />
            <circle cx={-9.5} cy={-4} r={2} fill="#5fb7ff" />
            <circle cx={9.5} cy={-4} r={2} fill="#5fb7ff" />
          </g>
        )}
      </g>

      {/* Sparkles all around once grown (Promisestar's sit in the corners, clear of its buddies) */}
      {stage >= 1 && (stage >= 2 ? [[22, 176, 7], [178, 170, 6]] : [[30, 54, 9], [170, 40, 8], [178, 132, 6], [22, 150, 7], [150, 172, 5]]).map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
          <path d={twinklePath(x, y, r)} fill={g ? '#e6e0c8' : '#fff3a0'} stroke={LINE} strokeWidth={1.5} strokeLinejoin="round" />
        </Anim>
      ))}
    </g>
  )
}
