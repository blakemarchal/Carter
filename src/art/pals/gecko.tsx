// Sticky → Wallwalker → Sunbasker: a little gecko standing side-on (facing left) with its wide round head turned to
// face you: big round eyes, a wide smile, soft green skin with gentle spots and a pale yellow throat and tummy.
// Four short legs from its body, each ending in a little foot with three toes spread out and a round sticky pad on
// each toe, and a long tail at its back, curling up at the tip.
// Wallwalker's colours are brighter, with sunny yellow spots, and it glows softly in the sun; Sunbasker is the
// brightest of all, with golden spots and a warm sunny glow, resting on a warm stone, and it wears a crown.
// Grumpy (in battle, scurrying and fussing all over the temple walls): dull and grey, cross brows and a frown,
// its tail up and lashing.
import { useId, type CSSProperties } from 'react'
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

const bez = (t: number, [a, b, c]: [Pt, Pt, Pt]): Pt => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}

/** A smooth tapering tube along the curve a → (b) → c, width w0 at a down to w1 at c, with round ends. */
function tube(a: Pt, b: Pt, c: Pt, w0: number, w1: number, n = 18) {
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

/** A smooth tapering tube along the cubic curve p0 → (p1, p2) → p3, width w0 down to w1, with round ends. */
function tail3(p: [Pt, Pt, Pt, Pt], w0: number, w1: number, n = 28) {
  const at = (t: number): Pt => {
    const u = 1 - t
    return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]) as Pt
  }
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = at(t)
    const [x1, y1] = at(Math.max(0, t - 0.01)), [x2, y2] = at(Math.min(1, t + 0.01))
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, h = (w0 + (w1 - w0) * t) / 2
    L.push([x - ((y2 - y1) / len) * h, y + ((x2 - x1) / len) * h])
    R.unshift([x + ((y2 - y1) / len) * h, y - ((x2 - x1) / len) * h])
  }
  const sm = (ps: Pt[]) => ps.slice(1, -1).map((q, i) => `Q${pt(...q)} ${pt((q[0] + ps[i + 2][0]) / 2, (q[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return { d: `M${pt(...L[0])} ${sm(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${sm(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`, at }
}

/** An ellipse's outline as polygon points. The glow is drawn as a polygon, so the coloring page (which turns every
 *  path, circle, ellipse and rect into a white shape to fill in) leaves it as it is. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

const GROUND = 178
const STONE_TOP = 161 // Sunbasker's stone, where it rests
const HEAD = smooth([[100, 65], [117, 66], [131, 72], [139, 84], [140, 97], [133, 108], [118, 116], [100, 119], [82, 116], [67, 108], [60, 97], [61, 84], [69, 72], [83, 66]])
// The body side-on, facing left: its neck and chest behind its head, its hips on the right
const BODY = smooth([[96, 112], [118, 108], [140, 112], [158, 121], [169, 133], [168, 147], [155, 156], [130, 160], [106, 160], [89, 155], [81, 141], [84, 124]])
const STONE = smooth([[47, 169], [55, 162.5], [78, 159.5], [120, 158.5], [160, 159.5], [178, 162], [187, 168.5], [185, 178], [166, 183.5], [118, 185], [72, 184.5], [50, 179]])
const STONE_TOP_FACE = 'M53 166 C62 161 90 160 120 160 C150 160 172 161 181 166 C164 171 134 172 104 172 C82 172 64 170.5 53 166 Z'
// A few cracks and specks on the front of the stone
const CRACKS = 'M70 174 L77 177.5 L76 182.5 M150 173.5 L144 177.5 L147 182.5 M118 176 L123 180.5'
const SPECKS: Pt[] = [[62, 176], [96, 179], [108, 175], [134, 181], [168, 176], [88, 182]]

// Its legs, standing and (Sunbasker) resting on its stone: [shoulder or hip (inside the body), bend, the foot's x, which
// way its toes point (-1 forward, 1 back)]. The near ones bow out at its side, forwards and backwards; the far front
// one peeks out under its chin and the far back one under its tail.
type LegAt = [Pt, Pt, number, number]
const LEGS: Record<'stand' | 'rest', { farFront: LegAt; farBack: LegAt; nearFront: LegAt; nearBack: LegAt }> = {
  stand: { farFront: [[108, 148], [100, 150], 100, -1], farBack: [[154, 150], [182, 152], 180, 1], nearFront: [[92, 144], [64, 146], 72, -1], nearBack: [[142, 150], [170, 148], 158, -1] },
  rest: { farFront: [[104, 146], [92, 146], 88, -1], farBack: [[152, 150], [178, 140], 178, 1], nearFront: [[92, 144], [62, 134], 66, -1], nearBack: [[136, 148], [170, 144], 157, -1] },
}

// A foot's three toes, from its palm to the round sticky pad at each tip (for a foot whose toes point left)
const TOES: Pt[] = [[-13, 6.4], [-3.5, 9.4], [6.5, 8]]

/**
 * A short leg from its shoulder (or hip), inside the body, bowed out to a little foot: three toes spread out
 * with a round sticky pad on each, resting on the floor at y `floor`. `dir` -1 points the toes forward (left).
 */
function Leg({ top, bend, foot, dir, floor, fill, line, pad, r = 4 }: { top: Pt; bend: Pt; foot: number; dir: number; floor: number; fill: string; line: string; pad: string; r?: number }) {
  const palm: Pt = [foot, floor - 13.4]
  return (
    <g>
      {TOES.map(([dx, dy], i) => {
        const tip: Pt = [palm[0] - dir * dx, palm[1] + dy]
        return (
          <g key={i}>
            <path d={tube(palm, [(palm[0] + tip[0]) / 2, (palm[1] + tip[1]) / 2], tip, 4.8, 4, 6)} fill={fill} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
            <circle cx={tip[0]} cy={tip[1] + 4 - r} r={r} fill={pad} stroke={line} strokeWidth={1.8} />
          </g>
        )
      })}
      <path d={tube(top, bend, palm, 12.5, 9)} fill={fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
    </g>
  )
}

export default function Gecko({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `gg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  // Brighter at each stage
  const SKIN = g ? '#aab3a2' : ['#9fd47e', '#7fd65a', '#66d24a'][st]
  const FAR = g ? '#98a190' : ['#8bc26a', '#6cc449', '#55bf3b'][st] // the legs on the far side, a shade darker
  const SPOT = g ? '#949d8b' : ['#7fbd62', '#ffd84d', '#ffb631'][st]
  const BELLY = g ? '#e3e5d6' : ['#f2f6cf', '#fbf7c2', '#fff2b0'][st]
  const PAD = g ? '#c9cfbf' : lighten(SKIN, 0.45)
  const FAR_PAD = g ? '#b9bfae' : lighten(FAR, 0.3)
  const STONEC = g ? '#b9aea3' : '#eaa468'
  const GLOW = '#ffd970'
  const skin = useShade(SKIN, 0.4, 0.15)
  const far = useShade(FAR, 0.35, 0.15)
  const belly = useShade(BELLY, 0.45, 0.06)
  const stone = useShade(STONEC, 0.35, 0.16)
  const line = ink(SKIN)
  const farLine = ink(FAR)
  const rest = st >= 2 // Sunbasker rests on a warm stone
  const floor = rest ? STONE_TOP : GROUND
  const legs = LEGS[rest ? 'rest' : 'stand']
  // Its tail, from inside its hips, out behind it and curling up at the tip (a little longer as it grows, and lying
  // a little higher on Sunbasker's stone); grumpy, raised high and lashing from side to side
  const tl = [0, 3, 6][st]
  const up = rest ? 7 : 0
  const tail = tail3(g
    ? [[152, 144], [194, 150], [160, 104], [186, 80]]
    : [[152, 146], [184, 164 - up], [196, 132 - up], [180, 112 - tl - up]], 19, 5.5)
  // Gentle spots on its back, its head and its tail
  const spots: [number, number, number][] = [[128, 115, 3.6], [143, 117, 4], [157, 126, 3.4], [134, 128, 2.6], [150, 137, 3], [163, 139, 2.4], [119, 124, 2.4]]
  const headSpots: [number, number, number][] = [[90, 70, 2.6], [110, 70, 2.6], [100, 68, 1.8], [128, 79, 2.2], [72, 79, 2.2]]
  return (
    <g>
      <defs>
        {skin.def}{far.def}{belly.def}{stone.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.8} />
          <stop offset="0.55" stopColor={GLOW} stopOpacity={0.4} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* A warm sunny glow all round it: soft for Wallwalker, brighter for Sunbasker */}
      {st >= 1 && !g && <polygon points={ring(118, 120, rest ? 94 : 84, rest ? 80 : 72)} fill={`url(#${glowId})`} opacity={rest ? 1 : 0.55} />}

      {/* Sunbasker's warm stone, with its flat top in the sun */}
      {rest && (
        <g>
          <path d={STONE} fill={stone.fill} stroke={ink(STONEC)} strokeWidth={3} strokeLinejoin="round" />
          <path d={STONE_TOP_FACE} fill={lighten(STONEC, 0.32)} />
          <path d={CRACKS} stroke={ink(STONEC)} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
          {SPECKS.map(([x, y]) => <circle key={x} cx={x} cy={y} r={1.6} fill={ink(STONEC)} opacity={0.4} />)}
        </g>
      )}

      {/* Four short legs with sticky toes: the far pair a shade darker and a touch smaller, behind it (their feet a
          little further back on the ground, so a little higher up) */}
      {[legs.farFront, legs.farBack].map(([top, bend, foot, dir]) => (
        <Leg key={foot} top={top} bend={bend} foot={foot} dir={dir} floor={floor - 2} fill={far.fill} line={farLine} pad={FAR_PAD} r={3.6} />
      ))}

      {/* Its long tail, at its back, swishing (lashing fast when grumpy) */}
      <g className="pa-tail" style={{ '--o': '0% 60%', ...(g ? { animationDuration: '0.8s' } : {}) } as CSSProperties}>
        <path d={tail.d} fill={skin.fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
        {[0.36, 0.52, 0.67, 0.8].map((t) => {
          const [x, y] = tail.at(t)
          return <circle key={t} cx={x} cy={y} r={3.6 - t * 2} fill={SPOT} opacity={0.9} />
        })}
      </g>
      {/* (grumpy: swish lines by its lashing tail) */}
      {g && <path d="M172 68 Q166 74 165 84 M192 64 Q197 71 197 81" stroke="#9aa392" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.85} />}

      {/* Its body, with a pale tummy and gentle spots */}
      <g className="pa-breathe">
        <path d={BODY} fill={skin.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d="M84 146 C100 157 132 160 160 152 C150 158 130 160.5 106 160.5 C95 159 88 154 84 146 Z" fill={belly.fill} />
        {spots.map(([x, y, r]) => <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.82} fill={SPOT} opacity={0.9} />)}
        <Shine x={146} y={121} rx={7} ry={3} rot={-14} />
      </g>

      {/* ... and the near pair */}
      {[legs.nearFront, legs.nearBack].map(([top, bend, foot, dir]) => (
        <Leg key={foot} top={top} bend={bend} foot={foot} dir={dir} floor={floor} fill={skin.fill} line={line} pad={PAD} />
      ))}

      {/* Its wide round head, with a pale throat and gentle spots */}
      <path d={HEAD} fill={skin.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M69 107 C84 117 116 117 131 107 C124 114 112 118.5 100 119 C88 118.5 76 114 69 107 Z" fill={belly.fill} />
      {headSpots.map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill={SPOT} opacity={0.9} />)}
      <Shine x={80} y={75} rx={8.5} ry={4.5} />
      <CuteFace x={100} y={90} s={0.95} gap={17} mood={mood} mouth={false} blinkDelay={0.8} />
      {/* A wide smile (a frown when grumpy), and two little nostrils */}
      <path d={g ? 'M86 111 Q100 103 114 111' : 'M80 103 Q100 117 120 103'} stroke="#2b2140" strokeWidth={2.8} fill="none" strokeLinecap="round" />
      <circle cx={95.5} cy={99.5} r={1.2} fill={line} />
      <circle cx={104.5} cy={99.5} r={1.2} fill={line} />

      {rest && (
        <>
          <Crown x={100} y={67} />
          {!g && [[30, 66, 8], [176, 54, 7], [28, 138, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
