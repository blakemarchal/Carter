// Ribbit → Leafleap → Treetop: a little bright green tree frog sitting on a big leaf on the ground and facing you: a
// round body with a pale tummy, two big round eyes up on top of its head, a wide gentle smile, and four legs from
// its body, every toe ending in a round sticky pad: its front legs straight down to the leaf, its back legs folded
// up at its sides with their long toes spread out on the leaf. (Tree frogs have no tail.)
// Leafleap is brighter, with soft spots; Treetop is the brightest of all, with golden spots and golden toe pads, a
// raindrop sits on its leaf beside it, it glows gently, and it wears a crown.
// Grumpy: dull olive, its throat puffed up big and round, cross brows and a frown.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, lighten, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

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

const bez = (t: number, [a, b, c]: [Pt, Pt, Pt]): Pt => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}

/** A smooth tapering tube along the curve a → (b) → c, width w0 at a down to w1 at c, with round ends. */
function tube(a: Pt, b: Pt, c: Pt, w0: number, w1: number, n = 14) {
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t
    const [x, y] = bez(t, [a, b, c])
    const dx = u * (b[0] - a[0]) + t * (c[0] - b[0]), dy = u * (b[1] - a[1]) + t * (c[1] - b[1])
    const len = Math.hypot(dx, dy) || 1, h = (w0 + (w1 - w0) * t) / 2
    L.push([x - (dy / len) * h, y + (dx / len) * h])
    R.unshift([x + (dy / len) * h, y - (dx / len) * h])
  }
  const sm = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return `M${pt(...L[0])} ${sm(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${sm(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}

const mirror = 'translate(200 0) scale(-1 1)'

// Its round body and wide head in one (frogs have no neck), with a big round bump on top for each eye
const BODY = smooth([
  [100, 86], [110, 80], [113, 68], [121, 58], [133, 55], [144, 61], [149, 73], [148, 86],
  [154, 96], [159, 114], [159, 134], [152, 152], [138, 165], [120, 171], [100, 172], [80, 171], [62, 165], [48, 152], [41, 134], [41, 114], [46, 96],
  [52, 86], [51, 73], [56, 61], [67, 55], [79, 58], [87, 68], [90, 80],
])
const EYE_Y = 74
// The big leaf it sits on, lying on the ground: its stem on the left, its tip on the right
const LEAF = 'M16 178 C26 163 72 157 112 157 C146 157 173 162 189 171 C171 184 140 191 104 191 C66 191 30 188 16 178 Z'
// (its middle vein and the veins off it run there and back along themselves, so they have no inside: the coloring
//  page draws them as lines)
const VEINS = [
  'M19 178 Q100 176 185 171 Q100 176 19 178',
  'M34 177.5 L45 165 L34 177.5 M34 177.5 L46 187 L34 177.5',
  'M162 173 L173 164 L162 173 M162 173 L172 182 L162 173',
]

// The left legs (the right ones are their mirror image). Its front leg: from its shoulder (inside the body) down
// to its hand on the leaf, and three fingers, from its palm out to the sticky pad on each tip
const ARM: [Pt, Pt, Pt] = [[76, 127], [72, 149], [78, 166]]
const HAND: Pt = [78, 168]
const FINGERS: Pt[] = [[-10, 6], [0, 9.5], [10, 6]]
// Its back leg: the folded-up thigh at its side, and its foot with three long toes spread out on the leaf
const THIGH = { x: 51, y: 149, rx: 16, ry: 20, rot: 24 }
const FOOT: Pt = [44, 170]
const TOES: Pt[] = [[-17, -2], [-15, 6.5], [-6.5, 11]]
// Soft spots on its sides and its thighs (Leafleap and Treetop)
const SPOTS: [number, number, number][] = [[49, 110, 3.6], [151, 110, 3.6], [56, 126, 2.6], [144, 126, 2.8], [43, 145, 3], [157, 145, 3], [53, 158, 2.2], [147, 158, 2.2]]

/** A hand or foot: toes from the palm at (0, 0) out to `tips`, each with a round sticky pad, and the palm over their roots. */
function Toes({ tips, w, r, fill, line, pad }: { tips: Pt[]; w: number; r: number; fill: string; line: string; pad: string }) {
  return (
    <g>
      {tips.map(([x, y], i) => (
        <g key={i}>
          <path d={tube([0, 0], [x / 2, y / 2], [x, y], w, w * 0.85, 6)} fill={fill} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
          <circle cx={x} cy={y} r={r} fill={pad} stroke={line} strokeWidth={1.8} />
        </g>
      ))}
      <ellipse cx={0} cy={0} rx={w * 1.3} ry={w} fill={fill} />
    </g>
  )
}

/** A raindrop sitting on the leaf, its bottom at (0, 0). */
function Raindrop() {
  return (
    <g>
      <path d="M0 -19 C3 -13 8.5 -8.5 8.5 -4 A8.5 8.5 0 0 1 -8.5 -4 C-8.5 -8.5 -3 -13 0 -19 Z" fill="#8fd6ff" stroke="#3f97d6" strokeWidth={2.2} strokeLinejoin="round" />
      <ellipse cx={-3.2} cy={-6.5} rx={2} ry={3.4} fill="#fff" opacity={0.85} transform="rotate(20 -3.2 -6.5)" />
    </g>
  )
}

export default function Frog({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `fg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  // Brighter at each stage; dull olive when grumpy
  const SKIN = g ? '#9ba25c' : ['#63c94b', '#4fd551', '#36dc66'][st]
  const BELLY = g ? '#dfdfb6' : ['#eef7c6', '#f3fbc8', '#fbf9c6'][st]
  const PAD = g ? '#c6c992' : ['#b6ed90', '#dff78a', '#ffc35e'][st]
  const SPOT = g ? '#888e4c' : ['#4fae3c', '#cdf56e', '#ffd84d'][st]
  const LEAFC = g ? '#a2ad96' : '#2f9a5c'
  const THROAT = g ? '#e5e3b6' : BELLY
  const GLOW = '#ffc4e6'
  const skin = useShade(SKIN, 0.42, 0.16)
  const belly = useShade(BELLY, 0.45, 0.06)
  const leaf = useShade(LEAFC, 0.3, 0.18)
  const throat = useShade(THROAT, 0.5, 0.08)
  const line = ink(SKIN)
  const leafLine = ink(LEAFC)
  const spotted = st >= 1
  return (
    <g>
      <defs>
        {skin.def}{belly.def}{leaf.def}{throat.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.9} />
          <stop offset="0.55" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Treetop's gentle glow */}
      {st >= 2 && !g && <polygon points={ring(100, 112, 92, 84)} fill={`url(#${glowId})`} />}

      {/* The big leaf it sits on, on the ground, with its stem */}
      <path d={tube([18, 178], [13, 180], [9, 184], 4.5, 3.5, 6)} fill={leaf.fill} stroke={leafLine} strokeWidth={1.8} />
      <path d={LEAF} fill={leaf.fill} stroke={leafLine} strokeWidth={3} strokeLinejoin="round" />
      {VEINS.map((d) => <path key={d} d={d} stroke={lighten(LEAFC, 0.35)} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}

      {/* Its back feet, toes spread out on the leaf */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? mirror : undefined}>
          <g transform={`translate(${FOOT[0]} ${FOOT[1]})`}>
            <Toes tips={TOES} w={5.4} r={4} fill={skin.fill} line={line} pad={PAD} />
          </g>
        </g>
      ))}

      {/* Its round body and head */}
      <path d={BODY} fill={skin.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Shine x={60} y={63} rx={6} ry={3.5} />

      {/* Its back legs, folded up at its sides */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? mirror : undefined}>
          <ellipse cx={THIGH.x} cy={THIGH.y} rx={THIGH.rx} ry={THIGH.ry} fill={skin.fill} stroke={line} strokeWidth={3} transform={`rotate(${THIGH.rot} ${THIGH.x} ${THIGH.y})`} />
        </g>
      ))}

      {/* Soft spots */}
      {spotted && SPOTS.map(([x, y, r]) => <circle key={`${x} ${y}`} cx={x} cy={y} r={r} fill={SPOT} opacity={0.85} />)}

      {/* Its pale tummy, breathing gently */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={146} rx={30} ry={23} fill={belly.fill} stroke={ink(BELLY)} strokeWidth={2} />
      </g>

      {/* Its front legs, straight down to its hands on the leaf */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? mirror : undefined}>
          <path d={tube(...ARM, 14, 11)} fill={skin.fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
          <g transform={`translate(${HAND[0]} ${HAND[1]})`}>
            <Toes tips={FINGERS} w={4.6} r={3.6} fill={skin.fill} line={line} pad={PAD} />
          </g>
        </g>
      ))}

      {/* Big round eyes on top of its head, two little nostrils, and a wide gentle smile (a frown when grumpy) */}
      <CuteFace x={100} y={EYE_Y} s={1.15} gap={26.1} mood={mood} mouth={false} blinkDelay={1.1} />
      <circle cx={94} cy={93} r={1.5} fill={line} />
      <circle cx={106} cy={93} r={1.5} fill={line} />
      {g ? (
        <>
          {/* (its throat puffed up big and round under its chin) */}
          <g className="pa-breathe">
            <ellipse cx={100} cy={124} rx={25} ry={20} fill={throat.fill} stroke={ink(THROAT)} strokeWidth={2.4} />
            <Shine x={89} y={114} rx={7} ry={3.6} rot={-25} />
          </g>
          <path d="M84 104 Q100 95 116 104" stroke="#2b2140" strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <path d="M70 101 Q100 120 130 101" stroke="#2b2140" strokeWidth={3} fill="none" strokeLinecap="round" />
      )}

      {st >= 2 && (
        <>
          {/* A raindrop on Treetop's leaf */}
          {!g && <g transform="translate(174 178)"><Raindrop /></g>}
          <g transform="translate(100 85) scale(0.85) translate(-100 -85)"><Crown x={100} y={85} /></g>
          {!g && [[26, 64, 8], [176, 40, 7], [22, 128, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
