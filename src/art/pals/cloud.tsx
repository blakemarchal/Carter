// Rumble → Drizzle → Rainbowl: a puffy cloud that floats along on a rainbow.
// Grumpy, it turns into a grey storm cloud with raindrops and a little zap. Each stage puffs it bigger;
// stage 1 grows little puff arms and a wider rainbow, stage 2 has a double rainbow and a crown.
import { type BodyProps, Anim, Crown, CuteFace, Shine, pt, twinklePath, useShade } from '../kit'

type Circle = [number, number, number]

/** One smooth outline around a ring of overlapping circles (listed clockwise, starting on the left). */
function puffPath(cs: Circle[]) {
  const mx = cs.reduce((s, c) => s + c[0], 0) / cs.length
  const my = cs.reduce((s, c) => s + c[1], 0) / cs.length
  const meet = cs.map((a, i) => {
    const b = cs[(i + 1) % cs.length]
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy)
    const l = (a[2] ** 2 - b[2] ** 2 + d * d) / (2 * d)
    const h = Math.sqrt(Math.max(0, a[2] ** 2 - l * l))
    const x = a[0] + (dx * l) / d, y = a[1] + (dy * l) / d
    const p: [number, number] = [x + (h * dy) / d, y - (h * dx) / d]
    const q: [number, number] = [x - (h * dy) / d, y + (h * dx) / d]
    return Math.hypot(p[0] - mx, p[1] - my) > Math.hypot(q[0] - mx, q[1] - my) ? p : q
  })
  let d = `M${pt(...meet[cs.length - 1])}`
  cs.forEach(([cx, cy, r], i) => {
    const from = meet[(i + cs.length - 1) % cs.length], to = meet[i]
    let sweep = Math.atan2(to[1] - cy, to[0] - cx) - Math.atan2(from[1] - cy, from[0] - cx)
    while (sweep < 0) sweep += Math.PI * 2
    d += ` A${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${pt(...to)}`
  })
  return `${d}Z`
}

// The cloud's puffs for each stage: left, over the top, right, then one wide circle for the round bottom.
const PUFFS: Circle[][] = [
  [[64, 118, 20], [76, 95, 21], [102, 80, 27], [131, 92, 22], [143, 117, 19], [103, 76, 70]],
  [[54, 120, 20], [64, 96, 21], [88, 78, 25], [118, 72, 27], [145, 90, 22], [154, 117, 19], [103, 60, 86]],
  [[48, 120, 20], [56, 95, 21], [77, 74, 24], [106, 62, 28], [137, 70, 25], [158, 93, 21], [160, 120, 18], [103, 46, 100]],
]

const RAINBOW = ['#ff6b6b', '#ffa94d', '#ffe14d', '#5fd39a', '#5fb7ff', '#a98cff']

/** A rainbow arch centred at (100, cy), outer radius r, made of six bands of width w. */
function Rainbow({ cy, r, w, opacity = 1 }: { cy: number; r: number; w: number; opacity?: number }) {
  const band = (ro: number, ri: number) => `M${100 - ro} ${cy} A${ro} ${ro} 0 0 1 ${100 + ro} ${cy} L${100 + ri} ${cy} A${ri} ${ri} 0 0 0 ${100 - ri} ${cy} Z`
  return (
    <g opacity={opacity}>
      {RAINBOW.map((c, i) => <path key={c} d={band(r - i * w, r - (i + 1) * w)} fill={c} />)}
      <path d={band(r, r - 6 * w)} fill="none" stroke="#c9a3c9" strokeWidth={2} />
    </g>
  )
}

export default function Cloud({ stage, mood }: BodyProps) {
  const grumpy = mood === 'grumpy'
  const color = grumpy ? '#a3abbd' : '#eef7ff'
  const line = grumpy ? '#6f7891' : '#9fc3e6'
  const puff = useShade(color, grumpy ? 0.3 : 0.6, grumpy ? 0.2 : 0.12)
  const s = Math.min(stage, 2)
  const cloud = puffPath(PUFFS[s])
  // The rainbow's feet rest on two little puffs.
  const r = [62, 70, 72][s], w = [4.5, 5, 5][s]
  const footX = s >= 2 ? 64 : r - 3 * w
  const foot = (x: number) => puffPath([[x - 12, 176, 8], [x - 3, 167, 11], [x + 9, 169, 10], [x + 15, 177, 7], [x + 1, 174, 12]])
  // Little puff arms poke out below the side puffs (grown forms) and wave.
  const [lx, ly] = PUFFS[s][0], [rx, ry] = PUFFS[s][PUFFS[s].length - 2]
  const arm = { x: lx - 9, y: Math.max(ly, ry) + 15 }
  const mirror = lx - 9 + rx + 9
  return (
    <g className="pa-float">
      <defs>{puff.def}</defs>

      {!grumpy && (
        <>
          {s >= 2 && <Rainbow cy={174} r={86} w={2} opacity={0.8} />}
          <Rainbow cy={174} r={r} w={w} />
          {[100 - footX, 100 + footX].map((x) => (
            <path key={x} d={foot(x)} fill={puff.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          ))}
        </>
      )}

      {s >= 1 && [1, -1].map((side) => (
        <g key={side} transform={side < 0 ? `translate(${mirror} 0) scale(-1 1)` : undefined}>
          <Anim cls="pa-wing" origin="100% 30%" delay={side < 0 ? 0.3 : 0}>
            <ellipse cx={arm.x} cy={arm.y} rx={11} ry={8} transform={`rotate(-30 ${arm.x} ${arm.y})`} fill={puff.fill} stroke={line} strokeWidth={3} />
          </Anim>
        </g>
      ))}

      {/* Raindrops and a little zap under the storm cloud */}
      {grumpy && (
        <>
          {[[72, 160], [100, 168], [128, 160]].map(([x, y], i) => (
            <path key={x} className="pa-twinkle" style={{ animationDelay: `${i * 0.6}s` }}
              d={`M${x} ${y - 11} Q${x + 7} ${y - 1} ${x + 6} ${y + 3} A6 6 0 0 1 ${x - 6} ${y + 3} Q${x - 7} ${y - 1} ${x} ${y - 11} Z`}
              fill="#7cc6ff" stroke="#4a92d0" strokeWidth={2} strokeLinejoin="round" />
          ))}
          <path d="M150 140 L140 158 L148 158 L142 174 L158 152 L150 152 L156 140 Z" fill="#ffe14d" stroke="#d9a400" strokeWidth={2} strokeLinejoin="round" />
        </>
      )}

      {/* The cloud itself */}
      <path d={cloud} fill={puff.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Shine x={s >= 2 ? 82 : 86} y={s >= 2 ? 72 : 84} rx={12} ry={6} />

      <CuteFace x={100} y={112} s={0.9} gap={15} mood={mood} />

      {s >= 2 && (
        <>
          <Crown x={104} y={40} />
          {!grumpy && [[30, 70, 8], [172, 46, 9]].map(([x, y, rr], i) => (
            <path key={x} className="pa-twinkle" style={{ animationDelay: `${i * 0.7}s` }} d={twinklePath(x, y, rr)} fill="#fff3a0" stroke="#e8b830" strokeWidth={1.5} strokeLinejoin="round" />
          ))}
        </>
      )}
    </g>
  )
}
