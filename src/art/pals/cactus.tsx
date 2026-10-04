// Spike → Bloomspike → Desertbloom: a little round barrel cactus facing you, fresh green, with soft ribs running
// down it and little tufts of short, soft spines (just ticks, never sharp), two stubby cactus arms that bend up
// at the elbow to wave, and tiny feet to stand and hop on. Spike has one little pink bud on top of its head,
// waiting patiently for the rain.
// Bloomspike's bud has opened into a big pink flower on top of its head; Desertbloom wears a ring of flowers round
// the top of its head with a crown in the middle, and glows softly in a gentle shower of rain from two little
// clouds.
// Grumpy (in battle, prickly and cross in the long drought): dusty grey-green, its arms drooping, cross brows and
// a frown, its bud (or flowers) pale and dry, and little puffs of dust at its feet.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, darken, ink, pt, Shine, twinklePath, useShade } from '../kit'

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

/** An ellipse's outline as polygon points. Soft glows are drawn as polygons, so the coloring page (which turns
 *  every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

// The round body: a barrel, a little squarer than a ball. `onBody(deg)` is the point on its outline at deg
// degrees (0 = right, 90 = bottom, -90 = the top of its head), or k times as far out.
const CX = 100, CY = 120, RX = 50, RY = 48
const sq = (v: number) => Math.sign(v) * Math.abs(v) ** 0.84
function onBody(deg: number, k = 1): Pt {
  const a = (deg * Math.PI) / 180
  return [CX + sq(Math.cos(a)) * RX * k, CY + sq(Math.sin(a)) * RY * k]
}
const BODY = smooth(Array.from({ length: 24 }, (_, i) => onBody(i * 15)))
const FACE_Y = 116

/** A rib down the body, `f` of the way out to the side at its middle (-1 left … 1 right). It runs there and back
 *  along the same line, so it has no inside: the coloring page inks it as a line instead of making a shape of it. */
function rib(f: number) {
  const ps = Array.from({ length: 21 }, (_, i) => {
    const a = 0.1 * Math.PI + (i / 20) * 0.82 * Math.PI // from near the top of its head round to near the bottom
    return pt(CX + RX * f * Math.sin(a) * 0.98, CY - RY * Math.cos(a) * 0.98)
  })
  return `M${ps.join(' L')} L${ps.slice(0, -1).reverse().join(' L')}`
}
const RIBS = [-0.66, -0.94, 0.66, 0.94]

// The left arm (the right one is its mirror image): a stubby cactus arm from its root inside the body, out to
// the elbow and up to its round top; drooping out and down when grumpy.
const ARM_UP = 'M64 133 H45 Q28 133 28 116 V103 A8 8 0 0 1 44 103 V113 Q44 117 48 117 H64 Z'
const ARM_DROOP = 'M64 117 L50 121 Q38 125 33 136 L30 143 A8 8 0 0 0 44.5 149 L47 143 Q50 137 55 135 L64 133 Z'

/** A tuft of two short, soft spines at (x, y), pointing out a little apart round `deg`, with round ends. Each is a
 *  straight path with no inside, so the coloring page inks it, like the hedgehog's spines. */
function Tuft({ x, y, deg, color, line, s = 1 }: { x: number; y: number; deg: number; color: string; line: string; s?: number }) {
  return (
    <g transform={`translate(${pt(x, y)}) rotate(${deg}) scale(${s})`}>
      {[-24, 24].map((a) => {
        const r = (a * Math.PI) / 180
        const d = `M${pt(Math.cos(r) * 0.8, Math.sin(r) * 0.8)} L${pt(Math.cos(r) * 5, Math.sin(r) * 5)}`
        return (
          <g key={a}>
            <path d={d} fill="none" stroke={line} strokeWidth={3.4} strokeLinecap="round" />
            <path d={d} fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
          </g>
        )
      })}
    </g>
  )
}

/** A cactus flower seen from the front, centred on (0, 0), about r across: two rings of petals round a golden middle. */
function Flower({ r, color, deep, gold, goldLine }: { r: number; color: string; deep: string; gold: string; goldLine: string }) {
  const k = r / 18
  return (
    <g transform={`scale(${k})`}>
      {[0, 1].map((layer) => [0, 1, 2, 3, 4].map((i) => (
        <ellipse key={`${layer}${i}`} cx={0} cy={-9.5} rx={layer ? 5.6 : 6.4} ry={layer ? 8.6 : 10}
          fill={layer ? color : deep} stroke={ink(deep)} strokeWidth={1.6 / k}
          transform={`rotate(${i * 72 + (layer ? 36 : 0)})`} />
      )))}
      <circle r={5.6} fill={gold} stroke={goldLine} strokeWidth={1.4 / k} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 3} cy={Math.sin((a * Math.PI) / 180) * 3} r={0.85} fill={goldLine} />
      ))}
    </g>
  )
}

/** A small five-petal blossom round (0, 0), r across, as one shape (so the garland isn't too fiddly to colour in):
 *  a round petal bulging out between each pair of notches. */
function blossom(r: number) {
  const notch = (k: number) => {
    const a = ((k * 72 - 54) * Math.PI) / 180
    return pt(Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42)
  }
  const pr = (r * 0.36).toFixed(2)
  return `M${notch(0)}` + [1, 2, 3, 4, 5].map((k) => ` A${pr} ${pr} 0 1 1 ${notch(k)}`).join('') + 'Z'
}
/** A little puffy rain cloud centred on (0, 0), flat underneath. */
const CLOUD = 'M-18 6 A6.5 6.5 0 0 1 -13 -4 A9 9 0 0 1 3 -9 A7.5 7.5 0 0 1 15 -2 A5.5 5.5 0 0 1 18 6 Z'
/** A raindrop centred on (0, 0), its point at the top. */
const DROP = 'M0 -8 C3 -3.5 5.5 -0.5 5.5 2.5 A5.5 5.5 0 0 1 -5.5 2.5 C-5.5 -0.5 -3 -3.5 0 -8 Z'

export default function Cactus({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `cg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const GREEN = g ? '#a7ab99' : '#6cc46e'
  const FEET = g ? '#959986' : '#58ae5d'
  const SPINE = g ? '#ece6d4' : '#fff6d2'
  const PINK = g ? '#d8c3cb' : '#ff7eb6'
  const DEEP = g ? '#c3aab4' : '#ff4f98'
  const YELLOW = g ? '#e2dbbf' : '#ffd94a'
  const CORAL = g ? '#d9c4b6' : '#ff9a62'
  const GOLD_LINE = g ? '#9c9278' : '#d29a00'
  const LEAF = g ? '#9ea38f' : '#4fa65a'
  const RAIN = '#8fd3ff'
  const body = useShade(GREEN, 0.4, 0.16)
  const feet = useShade(FEET, 0.3, 0.15)
  const cloud = useShade('#eef6ff', 0.6, 0.06)
  const line = ink(GREEN)
  const ribLine = darken(GREEN, 0.13)
  const spineLine = g ? '#8f927f' : '#3f8a46'

  // Soft spine tufts along the ribs (clear of the face) and round the edge, pointing outwards
  const tufts: [number, number, number][] = []
  for (const f of RIBS) {
    for (const a of [0.3, 0.45, 0.6, 0.75]) {
      const t = a * Math.PI
      const x = CX + RX * f * Math.sin(t) * 0.98, y = CY - RY * Math.cos(t) * 0.98
      if (Math.hypot((x - 100) / 34, (y - FACE_Y - 4) / 22) < 1) continue
      tufts.push([x, y, (Math.atan2(y - CY, x - CX) * 180) / Math.PI])
    }
  }
  const edge = [-150, -128, -52, -30, 28, 52, 128, 152].map((d) => [...onBody(d, 0.97), d] as [number, number, number])

  // Desertbloom's ring of flowers round the top of its head, like a garland: [angle round the ring (90 = at the
  // front), petals, middle, outline]. The back ones peep out behind its crown.
  const COLORS: [string, string, string][] = [[PINK, YELLOW, ink(DEEP)], [YELLOW, CORAL, ink(GOLD_LINE)], [CORAL, YELLOW, ink(CORAL)]]
  const garland = [-140, -40, 165, 15, 125, 55, 90].map((a, i) => {
    const r = (a * Math.PI) / 180
    return { a, x: 100 + Math.cos(r) * 44, y: 81 + Math.sin(r) * 10, c: COLORS[i % 3], back: a < 0 || a > 180 }
  })

  return (
    <g>
      <defs>
        {body.def}{feet.def}{cloud.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#d6f0ff" stopOpacity={0.95} />
          <stop offset="0.6" stopColor="#bfe6ff" stopOpacity={0.5} />
          <stop offset="1" stopColor="#bfe6ff" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Desertbloom's soft glow of rain all round it */}
      {st >= 2 && !g && <polygon points={ring(100, 112, 94, 90)} fill={`url(#${glowId})`} />}

      {/* Tiny feet to stand and hop on, peeping out under it */}
      {[86, 114].map((x) => <ellipse key={x} cx={x} cy={171} rx={11.5} ry={7.5} fill={feet.fill} stroke={ink(FEET)} strokeWidth={3} />)}

      {/* Little puffs of dust where it stamps (grumpy, in the long dry days) */}
      {g && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-twinkle" delay={side > 0 ? 0.9 : 0}>
            {/* (polygons, so the coloring page leaves them as soft dust instead of making them shapes to colour in) */}
            <g fill="#efe6d6" stroke="#c9b9a2" strokeWidth={1.8}>
              <polygon points={ring(58, 174, 5, 5, 20)} /><polygon points={ring(67, 171.5, 6.5, 6.5, 24)} /><polygon points={ring(74, 175.5, 4, 4, 18)} />
            </g>
          </Anim>
        </g>
      ))}

      {/* Stubby cactus arms: waving up (drooping when grumpy), behind the body so they grow out of its sides */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin={g ? '100% 0%' : '100% 85%'} delay={side > 0 ? 0.5 : 0}>
            <path d={g ? ARM_DROOP : ARM_UP} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
            {g
              ? <Tuft x={34} y={147} deg={125} color={SPINE} line={spineLine} s={0.9} />
              : <><Tuft x={28.5} y={110} deg={180} color={SPINE} line={spineLine} s={0.9} /><Tuft x={36} y={97} deg={-90} color={SPINE} line={spineLine} s={0.9} /></>}
          </Anim>
        </g>
      ))}

      {/* The round body with its ribs and soft spines */}
      <g className="pa-breathe">
        <path d={BODY} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        {RIBS.map((f) => <path key={f} d={rib(f)} fill="none" stroke={ribLine} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />)}
        <Shine x={72} y={88} rx={9} ry={5} />
        {[...tufts, ...edge].map(([x, y, d], i) => <Tuft key={i} x={x} y={y} deg={d} color={SPINE} line={spineLine} />)}
      </g>

      {/* Spike's little bud on top of its head, waiting for the rain (drooping when grumpy) */}
      {st === 0 && (
        <g transform={`translate(100 ${CY - RY + 5}) rotate(${g ? 28 : 0})`}>
          <path d="M0 -19 C6 -13 8 -7 6 -2 Q0 2 -6 -2 C-8 -7 -6 -13 0 -19 Z" fill={PINK} stroke={ink(DEEP)} strokeWidth={2} strokeLinejoin="round" />
          <polyline points="0 -16 1.6 -11 1.6 -7 0 -3" stroke={DEEP} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
          <path d="M0 0 C-4 -1 -9 -3 -10 -9 C-5 -8 -2 -6 0 -3 Z M0 0 C4 -1 9 -3 10 -9 C5 -8 2 -6 0 -3 Z" fill={LEAF} stroke={ink(LEAF)} strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      )}

      {/* Bloomspike's big flower on top of its head */}
      {st === 1 && (
        <g transform={`translate(100 ${CY - RY - 4}) rotate(-8) scale(1 0.88)`}>
          <Flower r={g ? 16.5 : 19} color={PINK} deep={DEEP} gold={YELLOW} goldLine={GOLD_LINE} />
        </g>
      )}

      {/* Desertbloom's crown, with its ring of flowers round the top of its head */}
      {st >= 2 && [true, false].map((back) => (
        <g key={`${back}`}>
          {!back && <Crown x={100} y={CY - RY + 6} />}
          {garland.filter((f) => f.back === back).map(({ a, x, y, c }) => (
            <g key={a} transform={`translate(${pt(x, y)}) scale(1 0.9)`}>
              <path d={blossom(10.5)} fill={c[0]} stroke={c[2]} strokeWidth={1.8} strokeLinejoin="round" />
              <circle r={3.6} fill={c[1]} stroke={GOLD_LINE} strokeWidth={1.2} />
            </g>
          ))}
        </g>
      ))}

      <CuteFace x={100} y={FACE_Y} s={0.92} gap={15} mood={mood} blinkDelay={1.4} />
      {/* (a little more pink in its cheeks, which would look muddy on the green otherwise: the same ellipses as
          CuteFace's, so the coloring page doesn't change) */}
      {!g && (
        <g transform={`translate(100 ${FACE_Y}) scale(0.92)`}>
          {[-1, 1].map((side) => <ellipse key={side} cx={side * 25} cy={11} rx={6.5} ry={4.2} fill="#ff8fc4" opacity={0.45} />)}
        </g>
      )}

      {/* Desertbloom's gentle shower of rain, falling from two little clouds (bobbing), and sparkles */}
      {st >= 2 && !g && (
        <>
          {[[38, 34, 1], [162, 30, -1]].map(([x, y, f], k) => (
            <g key={x}>
              {[[-7, 20, 0.8], [6, 27, 0.85], [-2, 42, 0.7]].map(([dx, dy, s], i) => (
                <Anim key={dy} cls="pa-twinkle" delay={k * 0.7 + i * 0.5}>
                  <g transform={`translate(${pt(x + dx * f, y + dy)}) scale(${s})`}>
                    <path d={DROP} fill={RAIN} stroke="#4fa8e8" strokeWidth={1.6} strokeLinejoin="round" />
                    <circle cx={-2} cy={1.5} r={1.6} fill="#fff" opacity={0.9} />
                  </g>
                </Anim>
              ))}
              <Anim cls="pa-float" delay={k * 1.2}>
                <g transform={`translate(${x} ${y}) scale(${f} 1)`}>
                  <path d={CLOUD} fill={cloud.fill} stroke="#9cc3e6" strokeWidth={2.2} strokeLinejoin="round" />
                </g>
              </Anim>
            </g>
          ))}
          {[[100, 24, 6], [22, 172, 5], [178, 170, 6]].map(([x, y, r], i) => (
            <Anim key={`t${x}`} cls="pa-twinkle" delay={0.3 + i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
