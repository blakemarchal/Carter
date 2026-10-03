// Gusty → Breezy → Windsong: a round little puff of swirling air with chubby cheeks, two curly wisps of wind
// streaming off it in a swirl (one from the top left, one from the bottom right), floating along.
// (Not a cloud like Rumble: a smooth ball of pale air with swirls, no fluffy puffs.)
// Breezy carries leaves along on its swirls; Windsong wears a ribbon of wind circling round it and a crown.
// Grumpy Gusty goes a stormy grey and puffs himself up, cheeks and all, huffing out little puffs of air; his
// wisps droop and curl under, and any leaves he carries are dry.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** A smooth tube along the points ps, its width w(t) for t = 0…1 along it, with round ends. */
function tubeAlong(ps: Pt[], w: (t: number) => number) {
  const n = ps.length - 1
  const L: Pt[] = [], R: Pt[] = []
  ps.forEach(([x, y], i) => {
    const [x1, y1] = ps[Math.max(0, i - 1)], [x2, y2] = ps[Math.min(n, i + 1)]
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, h = w(i / n) / 2
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len
    L.push([x + nx * h, y + ny * h])
    R.unshift([x - nx * h, y - ny * h])
  })
  const smooth = (qs: Pt[]) => qs.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + qs[i + 2][0]) / 2, (p[1] + qs[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...qs[qs.length - 1])}`
  const r0 = w(0) / 2, r1 = w(1) / 2
  return `M${pt(...L[0])} ${smooth(L)} A${r1} ${r1} 0 0 0 ${pt(...R[0])} ${smooth(R)} A${r0} ${r0} 0 0 0 ${pt(...L[0])}Z`
}

/**
 * The centreline of a wisp of air: from (x, y), setting off at angle a (radians; 0 is right, π/2 is down)
 * and running `len`, turning as it goes by bend(u) radians per unit length (u = 0…1 along it; positive
 * bends clockwise).
 */
function wispLine(x: number, y: number, a: number, len: number, bend: (u: number) => number, n = 60): Pt[] {
  const ps: Pt[] = [[x, y]]
  const ds = len / n
  for (let i = 0; i < n; i++) {
    a += bend((i + 0.5) / n) * ds
    x += Math.cos(a) * ds
    y += Math.sin(a) * ds
    ps.push([x, y])
  }
  return ps
}

/** A little leaf with a stem and a middle vein, pointing along angle `rot` (degrees); dry and dull if `dry`. */
const Leaf = ({ x, y, rot, s = 1, dry }: { x: number; y: number; rot: number; s?: number; dry?: boolean }) => {
  const [fill, line] = dry ? ['#bfae82', '#8c7c56'] : ['#7cc46a', '#4f8a3a']
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-12 0 L-8 0" stroke={line} strokeWidth={2} strokeLinecap="round" />
      <path d="M-8 0 Q0 -7.5 10 0 Q0 7.5 -8 0 Z" fill={fill} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-5 0 Q2 -0.8 7 0" stroke={line} strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  )
}

const CX = 100, CY = 104, R = 47

/**
 * A flat ring round the ellipse (rx, ry) about the origin, w(a) wide at angle a (radians, clockwise from the
 * right): its outside and inside edges as two closed loops, to fill with the even-odd rule.
 */
function ringLoops(rx: number, ry: number, w: (a: number) => number, n = 64) {
  const loop = (side: number) => Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n, k = (side * w(a)) / 2
    return pt(Math.cos(a) * (rx + k), Math.sin(a) * (ry + k))
  })
  return `M${loop(1).join(' L')}Z M${loop(-1).join(' L')}Z`
}

export default function Wind({ stage, mood }: BodyProps) {
  // (the front half of Windsong's ribbon is the whole ribbon again, clipped to the half in front of the ball)
  const front = `wf${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const g = mood === 'grumpy'
  const AIR = g ? '#c3cbd8' : '#e0f2ff'
  const LINE = g ? '#7d889d' : '#7fbae4'
  const SWIRL = g ? '#9aa6b8' : '#acd7f5'
  const RIBBON = g ? '#e3e8ef' : '#f4fbff'
  const air = useShade(AIR, g ? 0.35 : 0.6, g ? 0.16 : 0.1)
  const wispFill = useShade(AIR, 0.5, 0.08)
  // The ball (puffed up a little wider when he's huffy)
  const [rx, ry] = g ? [R + 3, R - 1] : [R, R]
  const body = `M${CX - rx} ${CY} A${rx} ${ry} 0 1 1 ${CX + rx} ${CY} A${rx} ${ry} 0 1 1 ${CX - rx} ${CY}Z`
  const width = (t: number) => t < 0.4 ? 3 + 14 * (t / 0.4) : 17 - 13 * ((t - 0.4) / 0.6)
  // A wisp peels off the top of the ball, hugs round its top-left edge, streams off to the left and curls up;
  // the other is the same, turned half way round. Grumpy, their ends droop and curl under instead.
  const wisps = g
    ? [
        tubeAlong(wispLine(CX + 8, CY - R - 3, Math.PI + 0.16, 94, (u) => u < 0.3 ? -1 / (R + 3) : u < 0.45 ? -0.012 : -0.46 * ((u - 0.45) / 0.55) ** 1.3), width),
        tubeAlong(wispLine(CX - 8, CY + R + 3, 0.16, 94, (u) => u < 0.18 ? -1 / (R + 3) : u < 0.4 ? 0.006 : 0.46 * ((u - 0.4) / 0.6) ** 1.3), width),
      ]
    : [tubeAlong(wispLine(CX + 8, CY - R - 3, Math.PI + 0.16, 106, (u) => u < 0.28 ? -1 / (R + 3) : u < 0.44 ? 0 : 0.3 * ((u - 0.44) / 0.56) ** 0.9), width)]
  // Windsong's ribbon of wind: round behind the ball, then across in front of it (wider in front, as it's nearer)
  const ring = ringLoops(73, 17, (a) => 8 + 4 * Math.sin(a))
  const RING = `translate(100 ${CY + 22}) rotate(-12)`
  return (
    <g className="pa-float">
      <defs>{air.def}{wispFill.def}</defs>

      {stage >= 2 && (
        <g transform={RING}>
          <clipPath id={front}><rect x={-100} y={0} width={200} height={50} /></clipPath>
          <path d={ring} fill={RIBBON} fillRule="evenodd" stroke={LINE} strokeWidth={2.5} />
        </g>
      )}

      {/* The two swirly wisps (behind the ball), swaying */}
      {[0, 1].map((i) => (
        <g key={i} transform={i && !g ? `rotate(180 ${CX} ${CY})` : undefined}>
          <Anim cls="pa-tail" origin={g && i ? '0% 0%' : '100% 0%'} delay={i ? 0.5 : 0}>
            <path d={wisps[g ? i : 0]} fill={wispFill.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
            {stage >= 1 && (g
              ? <Leaf x={i ? 154 : 50} y={i ? 162 : 66} rot={i ? 40 : 120} dry />
              : <Leaf x={i ? 36 : 40} y={i ? 70 : 72} rot={i ? 200 : 160} />)}
          </Anim>
        </g>
      ))}

      {/* The ball of air, with swirls on it */}
      <g className="pa-breathe">
        <path d={body} fill={air.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <path d="M121 71 Q136 76 138 90 Q138 98 131 98 Q125 97 127 91 Q129 87 133 90" stroke={SWIRL} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M63 127 Q65 139 77 143 Q85 144 85 138 Q84 133 79 135" stroke={SWIRL} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Shine x={79} y={75} rx={11} ry={6} />
      </g>

      {/* Chubby cheeks (puffed right out when he's huffy) */}
      {[-1, 1].map((side) => <ellipse key={side} cx={100 + side * (g ? 27 : 25)} cy={g ? 117 : 116} rx={g ? 12 : 9} ry={g ? 9 : 6.5} fill="#ff7fb0" opacity={g ? 0.4 : 0.3} />)}
      <CuteFace x={100} y={106} s={0.95} gap={15} mood={mood} blinkDelay={0.9} />
      {[-1, 1].map((side) => <circle key={side} cx={100 + side * (g ? 30 : 27)} cy={112} r={g ? 2.2 : 1.8} fill="#fff" opacity={0.85} />)}

      {/* Huffy little puffs of wind */}
      {g && [-1, 1].map((side) => (
        <Anim key={side} cls="pa-twinkle" delay={side > 0 ? 0.6 : 0}>
          <g transform={side > 0 ? 'translate(200 0) scale(-1 1)' : undefined} fill={wispFill.fill} stroke={LINE} strokeWidth={2}>
            <circle cx={55} cy={133} r={6} /><circle cx={44} cy={127} r={7} /><circle cx={34} cy={135} r={5.5} />
          </g>
        </Anim>
      ))}

      {stage >= 2 && (
        <>
          <g transform={RING}>
            <path d={ring} fill={RIBBON} fillRule="evenodd" stroke={LINE} strokeWidth={2.5} clipPath={`url(#${front})`} />
            {/* little streaks of wind along it */}
            <path d="M-46 12 Q-36 16 -26 17 M-6 18.5 Q6 18.5 16 17.5 M36 15 Q44 13 50 11" stroke={SWIRL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            <Leaf x={-58} y={8} rot={30} s={0.85} dry={g} />
          </g>
          <Crown x={100} y={62} />
          {!g && [[30, 50, 8], [170, 40, 7], [176, 150, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
