// Gloomy → Twilight → Starlight: a sleepy little night-cloud with a crescent-moon clip and star freckles.
// Stage 1 grows a wispy tail with a star on the end; stage 2 rides in a crescent moon and wears a crown.
// Grumpy turns it a stormy grey. It floats, and its stars twinkle.
import { type BodyProps, Anim, Crown, CuteFace, ink, MOON, pt, Shine, starPath, twinklePath, useShade } from '../kit'

type Pt = [number, number]
type Circle = [number, number, number]

/** Outline of a puffy cloud: the union of circles listed clockwise around its middle. */
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

/** A smooth tapering tube along the curve a → (b) → c, width w0 at a down to w1 at c, with round ends. */
function tube(a: Pt, b: Pt, c: Pt, w0: number, w1: number, n = 16) {
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

// The cloud body: seven puffs, clockwise from the left.
const CLOUD: Circle[] = [[60, 136, 22], [70, 106, 22], [100, 90, 30], [130, 106, 22], [140, 136, 22], [118, 154, 20], [82, 154, 20]]

export default function Night({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const SKY = g ? '#62677f' : '#7a6ce6'
  const BELLY = g ? '#8d91a8' : '#ab9fff'
  const GLOW = g ? '#d6d2b4' : '#ffe066'
  const FRECKLE = g ? '#c3c6d4' : '#fff4b8'
  const body = useShade(SKY, 0.32, 0.2)
  const moon = useShade(GLOW, 0.55, 0.12)
  const line = ink(SKY)
  const moonLine = g ? ink(GLOW) : '#d9a400'
  const sparkles: [number, number, number][] =
    stage >= 2 ? [[30, 60, 9], [170, 34, 7], [22, 104, 6], [52, 30, 5]] : stage >= 1 ? [[34, 70, 8], [44, 42, 5]] : [[44, 62, 6]]
  return (
    <g>
      <defs>{body.def}{moon.def}</defs>

      {/* Twinkling stars around it */}
      {sparkles.map(([x, y, r], i) => (
        <Anim key={i} cls="pa-twinkle" delay={i * 0.45}>
          <path d={twinklePath(x, y, r)} fill={moon.fill} stroke={moonLine} strokeWidth={1.5} strokeLinejoin="round" />
        </Anim>
      ))}

      <g className="pa-float">
        {/* Wispy tail with a star on the tip (mirrored twice so the wag swings it in towards the body, not out of the picture) */}
        {stage >= 1 && (
          <g transform={MIRROR}>
            <Anim cls="pa-tail" origin="85% 100%">
              <g transform={MIRROR}>
                <path d={tube([142, 128], [184, 130], [176, 88], 20, 8)} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
                <path d={starPath(176, 80, 12)} fill={moon.fill} stroke={moonLine} strokeWidth={2.5} strokeLinejoin="round" />
              </g>
            </Anim>
          </g>
        )}

        {/* Puffy cloud body with a soft glowing tummy */}
        <g className="pa-breathe">
          <path d={puff(CLOUD)} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          <ellipse cx={100} cy={152} rx={30} ry={13} fill={BELLY} opacity={0.85} />
          <Shine x={86} y={72} rx={11} ry={6} />
        </g>

        {/* Star freckles that twinkle */}
        {[[62, 100, 5], [142, 104, 4.5], [56, 140, 4], [146, 140, 4.5]].map(([x, y, r], i) => (
          <Anim key={i} cls="pa-twinkle" delay={0.3 + i * 0.6}>
            <path d={starPath(x, y, r)} fill={FRECKLE} />
          </Anim>
        ))}

        {/* Crescent-moon hair clip (bigger once grown) */}
        {stage < 2 && (
          <g transform={`translate(136 70) rotate(-12) scale(${stage >= 1 ? 1.3 : 1})`}>
            <path d={MOON} fill={moon.fill} stroke={moonLine} strokeWidth={2.2} strokeLinejoin="round" />
          </g>
        )}

        <CuteFace x={100} y={114} s={1} gap={15} mood={mood} blinkDelay={0.7} />

        {/* Starlight sits snug in a big crescent moon */}
        {stage >= 2 && (
          <>
            <path d="M26 134 A74 50 0 0 0 174 134 A74 26 0 0 1 26 134 Z" fill={moon.fill} stroke={moonLine} strokeWidth={3} strokeLinejoin="round" />
            <circle cx={70} cy={172} r={4} fill={GLOW} stroke={moonLine} strokeWidth={1.5} opacity={0.8} />
            <circle cx={128} cy={174} r={3} fill={GLOW} stroke={moonLine} strokeWidth={1.5} opacity={0.8} />
            <Crown x={100} y={64} />
          </>
        )}
      </g>
    </g>
  )
}
