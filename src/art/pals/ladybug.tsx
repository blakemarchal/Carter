// Dottie → Spotwing → Lovebug: a little round ladybug facing you, standing on the ground (with a soft shadow under
// it). A big, round, shiny red shell (a dome, its two wing cases meeting down the middle) with black spots, and in
// front of its front edge a smaller round black head with big friendly eyes in bright white rims, rosy cheeks and a
// pink smile. Two little antennae with round tips grow from the top of its head, and six short, stubby black legs
// are tucked under its shell, three on each side, only their bottom halves showing, with round little feet on the
// ground close in under it (like a real ladybug's, so it never looks like a spider).
// Spotwing's spots are little hearts, and its wing cases open a little at the top: its delicate, see-through wings
// peek out from under them at its sides, fluttering. Lovebug stands on a big green leaf; it glows softly pink and
// wears a crown, with sparkles round it.
// Grumpy: a dull brick color, its spots faded, its antennae drooping, its wing cases shut tight (no wings), and
// cross brows.
import { useId, type CSSProperties } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, pt, Shine, twinklePath, useShade } from '../kit'

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
  const sm = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return `M${pt(...L[0])} ${sm(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${sm(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}

/** An ellipse's outline as polygon points. The glow and the shadow are drawn as polygons, so the coloring page
 *  (which turns every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A little heart centred on (0, 0), about 3r across. */
const heart = (r: number) =>
  `M${pt(0, r * 1.5)} C${pt(-r * 2.2, r * 0.2)} ${pt(-r * 1.4, -r * 1.6)} ${pt(0, -r * 0.5)} C${pt(r * 1.4, -r * 1.6)} ${pt(r * 2.2, r * 0.2)} ${pt(0, r * 1.5)}Z`

// The big round shell (its two wing cases) is a dome, seen a little from above: round on top, with a gently curved
// rim at the bottom. Its widest points are (100 ± rx, y); its top is `top` above them and its rim `rim` below.
const SHELL = { x: 100, y: 134, rx: 66, top: 74, rim: 23 }
// The smaller round head, in front of the shell's front edge (the bottom of its rim)
const HEAD = { x: 100, y: 145, rx: 30, ry: 25 }
const FACE_Y = 146
const FACE_S = 0.78
const GAP = 14
const BLINK = 1.2
// The wing cases open a little (Spotwing, Lovebug) by turning out from the front of the shell, behind its head
const HINGE: Pt = [100, 141]
/** The left wing case (the right one is its mirror image): the dome's left half. */
const CASE = `M${SHELL.x} ${SHELL.y - SHELL.top} A${SHELL.rx} ${SHELL.top} 0 0 0 ${SHELL.x - SHELL.rx} ${SHELL.y} A${SHELL.rx} ${SHELL.rim} 0 0 0 ${SHELL.x} ${SHELL.y + SHELL.rim} Z`
// Its spots, on the left wing case (mirrored on the right one): [x, y, size]
const SPOTS: [number, number, number][] = [[74, 86, 8.5], [51, 114, 9.5], [82, 112, 7.5], [56, 141, 6.5]]
// The left delicate wing, peeking out from under the left wing case at its side, from its root R
const R: Pt = [62, 118]
const WING: Pt[] = [[4, -6], [-12, -15], [-31, -21], [-46, -19], [-54, -10], [-51, 2], [-38, 9], [-19, 10], [-3, 7]]
const VEINS = ['58 115 24 103', '58 118 14 114', '58 120 30 125']
// Its three left legs (the right ones are their mirror image): short and stubby, tucked under its shell so only their
// bottom halves show, with their feet close in under it: [root, bend, foot] (the back ones a little higher up, as
// they're further back)
const LEGS: [Pt, Pt, Pt][] = [
  [[53, 140], [45, 152], [46, 162]],
  [[62, 145], [56, 158], [57, 167]],
  [[71, 149], [67, 162], [68, 171]],
]
// Lovebug's leaf, under its feet: pointed at our left, its stem at our right
const LEAF = 'M8 174 C28 148 142 140 190 164 C158 192 42 196 8 174 Z'
const LEAF_VEINS = ['14 174 186 164', '50 172 40 160', '50 172 42 182', '96 169.2 86 154', '96 169.2 88 186', '140 166.7 132 154', '140 166.7 134 183']

export default function Ladybug({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [glowId, shellId] = [`lg${ids}`, `ls${ids}`]
  const RED = g ? '#a8604e' : '#ee4a3f'
  const SPOT = g ? '#6e5148' : '#2b2433'
  const BLACK = g ? '#4a4448' : '#2e2a36'
  const RIM = g ? '#ece8ea' : '#ffffff'
  const LEAFC = g ? '#a3ad8f' : '#7ccc5c'
  const WINGC = '#fff4f7'
  const GLOW = '#ffc4da'
  const head = useShade(BLACK, 0.28, 0.2)
  const leg = useShade(BLACK, 0.25, 0.15)
  const tip = useShade(BLACK, 0.4, 0.1)
  const leaf = useShade(LEAFC, 0.35, 0.15)
  const hearts = st >= 1
  const open = st >= 1 && !g
  const onLeaf = st >= 2
  const line = '#1d1a22'
  // Antennae from the top of its head, curling out over its shell (drooping to the sides when grumpy)
  const antenna: [Pt, Pt, Pt] = g ? [[92, 122], [76, 104], [63, 119]] : [[92, 122], [85, 96], [71, 88]]

  return (
    <g>
      <defs>
        {head.def}{leg.def}{tip.def}{leaf.def}
        {/* (one shine across the whole shell, light from the top left) */}
        <radialGradient id={shellId} gradientUnits="userSpaceOnUse" cx={78} cy={82} r={98}>
          <stop offset="0" stopColor={g ? '#c99484' : '#ff8a78'} />
          <stop offset="0.55" stopColor={RED} />
          <stop offset="1" stopColor={g ? '#8a4c3e' : '#c8322c'} />
        </radialGradient>
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Lovebug's soft pink glow all round it */}
      {onLeaf && !g && <polygon points={ring(100, 118, 96, 82)} fill={`url(#${glowId})`} />}

      {/* Lovebug's big green leaf, to stand on (or, before then, a soft shadow on the ground) */}
      {onLeaf ? (
        <g>
          <path d={tube([184, 165], [190, 161.5], [194, 155], 3.6, 3)} fill={g ? '#8b947a' : '#5aa845'} stroke={g ? '#7d866c' : '#4f9a3a'} strokeWidth={1.4} strokeLinejoin="round" />
          <path d={LEAF} fill={leaf.fill} stroke={g ? '#7d866c' : '#4f9a3a'} strokeWidth={2.4} strokeLinejoin="round" />
          {LEAF_VEINS.map((p) => <polyline key={p} points={p} fill="none" stroke={g ? '#8b947a' : '#5aa845'} strokeWidth={1.8} strokeLinecap="round" />)}
          <polygon points={ring(100, 168, 56, 7)} fill="#2b4a20" opacity={0.14} />
        </g>
      ) : (
        <polygon points={ring(100, 167, 66, 10)} fill="#2b2140" opacity={0.12} />
      )}

      {/* Six short, stubby legs tucked under its shell, three on each side, with round feet on the ground */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          {LEGS.map(([a, b, c]) => (
            <g key={a[1]}>
              <path d={tube(a, b, c, 8.6, 7.6)} fill={leg.fill} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
              <ellipse cx={c[0] - 1.6} cy={c[1] + 0.8} rx={5.6} ry={3.5} fill={leg.fill} stroke={line} strokeWidth={1.6} />
            </g>
          ))}
        </g>
      ))}

      {/* Spotwing's delicate, see-through wings, peeking out from under its wing cases at its sides, fluttering */}
      {open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="100% 50%" delay={side > 0 ? 0.1 : 0}>
            <path d={smooth(WING.map(([x, y]) => [R[0] + x, R[1] + y] as Pt))} fill={WINGC} fillOpacity={0.85} stroke="#cf93aa" strokeWidth={2} strokeLinejoin="round" />
            {VEINS.map((p) => <polyline key={p} points={p} fill="none" stroke="#dfa9bd" strokeWidth={1.4} strokeLinecap="round" />)}
          </Anim>
        </g>
      ))}

      {/* (its dark back, under its wing cases: it shows between them when they open) */}
      {open && <ellipse cx={100} cy={112} rx={30} ry={52} fill={BLACK} />}

      {/* The round, shiny red shell: two wing cases with spots (little hearts once it's grown), opening a little at
          the top when its wings are out */}
      <g className="pa-breathe">
        {[-1, 1].map((side) => (
          <g key={side} transform={side > 0 ? MIRROR : undefined}>
            <g transform={open ? `rotate(-3.5 ${pt(...HINGE)})` : undefined}>
              <path d={CASE} fill={`url(#${shellId})`} stroke="#8e2420" strokeWidth={2.8} strokeLinejoin="round" />
              {SPOTS.map(([x, y, r]) => hearts
                ? <path key={x} d={heart(r * 0.62)} transform={`translate(${x} ${y + 1})`} fill={SPOT} opacity={g ? 0.55 : 1} />
                : <circle key={x} cx={x} cy={y} r={r} fill={SPOT} opacity={g ? 0.55 : 1} />)}
            </g>
          </g>
        ))}
        <Shine x={70} y={80} rx={12} ry={5.5} rot={-34} />
      </g>

      {/* Antennae with round tips, from the top of its head (behind it, so they grow out of it); they twitch */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-ear" origin="100% 100%" delay={side > 0 ? 0.5 : 0}>
            <path d={tube(...antenna, 3.6, 2.8)} fill={BLACK} stroke={line} strokeWidth={1.2} strokeLinejoin="round" />
            <circle cx={antenna[2][0]} cy={antenna[2][1]} r={5} fill={tip.fill} stroke={line} strokeWidth={1.4} />
          </Anim>
        </g>
      ))}

      {/* Its round black head */}
      <ellipse cx={HEAD.x} cy={HEAD.y} rx={HEAD.rx} ry={HEAD.ry} fill={head.fill} stroke={line} strokeWidth={2.6} />
      <Shine x={88} y={129} rx={6} ry={3.2} rot={-24} />

      {/* Its face: big eyes in bright white rims (blinking with the eyes), so they show on its black head */}
      {[-1, 1].map((side) => (
        <g key={side} className="pa-blink" style={{ '--d': `${BLINK}s` } as CSSProperties}>
          <ellipse cx={100 + side * GAP * FACE_S} cy={FACE_Y} rx={(7.5 + 2.8) * FACE_S} ry={((g ? 5.5 : 9.5) + 2.8) * FACE_S} fill={RIM} />
        </g>
      ))}
      {/* (grumpy: a pale edge round its cross brows, so they show on its dark face) */}
      {g && (
        <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
          <path d={`M${-GAP - 9} -13 L${-GAP + 7} -7 M${GAP + 9} -13 L${GAP - 7} -7`} stroke="#d9cfd3" strokeWidth={7} strokeLinecap="round" fill="none" />
        </g>
      )}
      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={GAP} mood={mood} mouth={false} blinkDelay={BLINK} />
      <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
        {/* rosier cheeks, which would look muddy on black otherwise (the same ellipses as CuteFace's) */}
        {[-1, 1].map((side) => <ellipse key={side} cx={side * (GAP + 10)} cy={11} rx={6.5} ry={4.2} fill="#ff8fbf" opacity={0.55} />)}
        {/* a pink smile (a light frown when grumpy) */}
        {g
          ? <path d="M-7 18 Q0 12 7 18" stroke="#d9cfd3" strokeWidth={3} fill="none" strokeLinecap="round" />
          : <path d="M-7 11 Q0 19 7 11 Q0 14.5 -7 11 Z" fill="#ff6f96" stroke="#ffc3d4" strokeWidth={1.8} strokeLinejoin="round" />}
      </g>

      {st >= 2 && (
        <>
          <g transform="translate(100 123) scale(0.72)"><Crown x={0} y={0} /></g>
          {!g && [[22, 52, 7], [178, 48, 6], [184, 140, 5], [16, 138, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
