// Glint → Divedash → Sparklewing: a tiny, round kingfisher (head and body all one little ball) perched on a smooth
// river stone that sits on the ground, turned a little toward our right with its face toward you: a bright blue head
// and back with little sky-blue speckles, a little white throat under its beak and an orange tummy, a longish dark
// beak with a rounded tip, blue wings folded at its sides (dotted with sky blue), a short blue tail sticking out low
// at its back (our left), and little orange feet holding on to the top of the stone.
// Divedash is a brighter blue, with sparkles twinkling round it and on its wings; Sparklewing opens its wings wide
// at its sides to show long feathers that shimmer in all the colors of the rainbow, glows gently and wears a crown.
// Grumpy: a dull grey-blue, all fluffed up (its edge bumpy), with a cross frown (cross brows), its wings folded.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** The smooth curve (Catmull-Rom) through a closed ring of points, from point i on to point j (path commands). */
function curve(ps: Pt[], i: number, j: number) {
  const n = ps.length
  const at = (k: number) => ps[((k % n) + n) % n]
  let d = ''
  for (let k = i; k < j; k++) {
    const [a, b, c, e] = [at(k - 1), at(k), at(k + 1), at(k + 2)]
    d += ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }
  return d
}
/** A smooth closed outline through the points. */
const smooth = (ps: Pt[]) => `M${pt(...ps[0])}${curve(ps, 0, ps.length)}Z`

/** An ellipse's outline as polygon points. The glow is drawn as a polygon, so the coloring page (which turns every
 *  path, circle, ellipse and rect into a white shape to fill in) leaves it as it is. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A long feather from its root at (0, 0) out to its rounded tip at (l, 0), w wide. */
const feather = (l: number, w: number) =>
  `M0 ${-w * 0.3} C${l * 0.4} ${-w * 0.55} ${l * 0.8} ${-w * 0.55} ${l} ${-w * 0.2} Q${l + 2.5} 0 ${l} ${w * 0.2} C${l * 0.8} ${w * 0.55} ${l * 0.4} ${w * 0.55} 0 ${w * 0.3} Z`

const FACE_Y = 94
const FACE_S = 0.85
const BX = 94, BY = 110 // the middle of its round body (its face is a little to our right of it, the way it's turned)
const MIRROR = `translate(${2 * BX} 0) scale(-1 1)`
// The whole picture is drawn a little bigger than its numbers, about the bottom of the stone, so the tiny bird isn't
// lost in its box (faces.ts gives its face, hat and yawn where they end up)
const GROW = 'translate(100 183) scale(1.08) translate(-100 -183)'

/** The points round its little body, head and all: a ball, a little wider at the bottom, starting at the top and
 *  going round every 15 degrees; fluffed up (bigger, with a bumpy edge) when grumpy. */
const ballPts = (fluffy: boolean): Pt[] => Array.from({ length: 24 }, (_, i) => {
  const a = ((i * 15 - 90) * Math.PI) / 180
  const k = fluffy ? (i % 2 ? 1.1 : 1.03) : 1
  return [BX + 43 * k * Math.cos(a) * (1 + 0.05 * Math.sin(a)), BY + 40 * k * Math.sin(a)]
})
/** Its orange tummy, on the front of it: along the bottom of its body, just inside its outline (from point 7, a
 *  little below its middle on our right, round to point 16 on our left, lower down at its back), and back across
 *  under its white throat. Its own shape, so the coloring page has it to fill in too. */
function tummyPath(ball: Pt[]) {
  const ps = ball.map(([x, y]) => [BX + (x - BX) * 0.965, BY + (y - BY) * 0.965] as Pt)
  const [l, r] = [ps[16], ps[7]]
  return `M${pt(...r)}${curve(ps, 7, 16)} C${pt(l[0] + 10, l[1] - 5)} 80 121 90 121 C98 128 112 129 120 122 C126 120 ${pt(r[0] - 5, r[1] - 0.5)} ${pt(...r)}Z`
}
// Its little white throat, under the base of its beak
const THROAT = 'M89 117 C93 112.5 101 111 109 112.5 C117 114 120 119 117 123.5 C113 128.5 101 129.5 93 126.5 C88 124.5 87 120 89 117 Z'
// Little sky-blue speckles on the top of its head
const SPECKS: Pt[] = [[82, 79], [92, 75], [102, 75], [112, 79], [87, 85.5], [97, 82], [107, 84], [76, 87]]
// The longish dark beak, from the bottom of its face out to a rounded tip
const BEAK = 'M100 104 C114 103 132 106 146 112 Q153 115.5 151 120 Q148.5 123 143 121.5 C130 118.5 114 117 100 116.5 A6.25 6.25 0 0 1 100 104 Z'
const BEAK_LINE = '103 110.5 124 112.5 142 116.5'

// The left wing folded at its side (the right one is its mirror image), with three round feather tips at the bottom
const WING = 'M65 103 C56 106 50 115 49.5 126 C49 134 50.5 140 53 145 A3.6 3.6 0 0 0 58.8 148 A3.6 3.6 0 0 0 64.5 145.5 A3.6 3.6 0 0 0 68 140 C70 133 71.5 125 71 117 C70.5 110 68.5 105 65 103 Z'
const WING_DOTS: Pt[] = [[58, 112], [64, 109], [55, 120], [61, 118], [67, 115], [58, 127], [64.5, 125]]
const WING_LINES = ['57.5 132 56.5 146', '63.5 133.5 62.5 146.5']
// Sparklewing's left wing opened wide at its side: long rainbow feathers fanned out from under the blue feathers at
// the top of the wing. [root x, root y, angle (180 points straight out), length, width]
const FEATHERS = [[44, 98, 200, 25, 12], [42, 105, 188, 28, 13], [44, 112, 176, 28, 13], [47, 118, 164, 26, 13], [52, 124, 152, 23, 12], [58, 128, 140, 19, 11]]
const RAINBOW = ['#ff6b6b', '#ff9f43', '#ffd84a', '#5fd39a', '#4fb4ff', '#a98bff']
const COVERTS = 'M66 98 C56 91 44 90 36 94 C30 98 31 106 37 108 C34 114 38 120 45 120 C46 126 52 130 60 129 C64 124 66 116 66 108 Z'
// Its short dark blue tail at its back, sticking out low behind it: [angle, length, width]
const TAIL: [number, number, number][] = [[140, 24, 12], [156, 26, 13], [172, 22, 12]]
// The smooth river stone it perches on, sitting on the ground
const STONE = 'M50 174 C48 162 58 152 78 150 C94 148.5 110 148.5 126 150 C144 152 152 162 150 174 C149 180 143 183 132 183 L68 183 C57 183 51 180 50 174 Z'

export default function Kingfisher({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '')
  const glowId = `kg${ids}`
  // Bright blue, brighter still once it grows; a dull grey-blue when grumpy
  const BLUE = g ? '#7d8ea3' : st >= 1 ? '#1e9bff' : '#2186e8'
  const WINGC = g ? '#6f8197' : st >= 1 ? '#178cf0' : '#1a74d0'
  const SKY = g ? '#b8c6d4' : '#8fe3ff'
  const ORANGE = g ? '#c9a690' : '#ff8a3d'
  const WHITE = g ? '#e4e2df' : '#ffffff'
  const BEAKC = g ? '#55565e' : '#2c2f3d'
  const FEET = g ? '#c79a86' : '#ff6f45'
  const STONEC = '#b7aea2'
  const GLOW = '#fff1b8'
  const body = useShade(BLUE, 0.35, 0.15)
  const wing = useShade(WINGC, 0.35, 0.15)
  const tummy = useShade(ORANGE, 0.35, 0.12)
  const throat = useShade(WHITE, 0.5, 0.06)
  const beak = useShade(BEAKC, 0.35, 0.15)
  const stone = useShade(STONEC, 0.35, 0.15)
  const ball = ballPts(g)
  const line = ink(BLUE)
  const open = st >= 2 && !g // Sparklewing shows off its rainbow wings; grumpy, it keeps them folded
  const sparkly = st >= 1 && !g

  return (
    <g transform={GROW}>
      <defs>
        {body.def}{wing.def}{tummy.def}{throat.def}{beak.def}{stone.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Sparklewing's gentle glow all round it */}
      {open && <polygon points={ring(98, 116, 92, 82)} fill={`url(#${glowId})`} />}

      {/* Sparklewing's wings, opened wide at its sides: rainbow feathers under the blue ones, flapping slowly */}
      {open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="95% 50%" delay={side > 0 ? 0.1 : 0}>
            {FEATHERS.map(([x, y, a, l, w], i) => (
              <g key={y} transform={`translate(${x} ${y}) rotate(${a})`}>
                <path d={feather(l, w)} fill={RAINBOW[i]} stroke={ink(RAINBOW[i])} strokeWidth={2} strokeLinejoin="round" />
                <polyline points={`4 0 ${l - 5} 0`} fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
              </g>
            ))}
            <path d={COVERTS} fill={wing.fill} stroke={ink(WINGC)} strokeWidth={2.4} strokeLinejoin="round" />
            {[[44, 98], [52, 104], [42, 109], [50, 114], [58, 110]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={1.8} fill={SKY} />)}
          </Anim>
        </g>
      ))}

      {/* Its short tail sticking out low at its back, wagging a little */}
      <Anim cls="pa-tail" origin="100% 0%" delay={0.5}>
        {TAIL.map(([a, l, w]) => (
          <path key={a} d={feather(l, w)} transform={`translate(62 140) rotate(${a + (g ? (a - 156) / 3 : 0)})`} fill={wing.fill} stroke={ink(WINGC)} strokeWidth={2.2} strokeLinejoin="round" />
        ))}
      </Anim>

      {/* The smooth river stone it perches on */}
      <path d={STONE} fill={stone.fill} stroke={ink(STONEC)} strokeWidth={2.6} strokeLinejoin="round" />
      <Shine x={72} y={160} rx={9} ry={3.5} rot={-12} />
      {[[118, 168], [130, 162], [92, 174]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={1.7} fill={ink(STONEC)} opacity={0.35} />)}

      {/* Little orange feet, holding on to the top of the stone */}
      {[84, 104].map((x) => (
        <g key={x} fill={FEET} stroke={ink(FEET)} strokeWidth={1.6}>
          <rect x={x - 2.5} y={141} width={5} height={10} rx={2.5} />
          <ellipse cx={x - 4.5} cy={152} rx={2.3} ry={4.2} transform={`rotate(58 ${x - 4.5} 152)`} />
          <ellipse cx={x + 4.5} cy={152} rx={2.3} ry={4.2} transform={`rotate(-58 ${x + 4.5} 152)`} />
          <ellipse cx={x} cy={153} rx={2.4} ry={3.8} />
        </g>
      ))}

      {/* Its round little body: bright blue, with its white throat and orange tummy on the front of it */}
      <g className="pa-breathe">
        <path d={smooth(ball)} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={tummyPath(ball)} fill={tummy.fill} />
        <path d={THROAT} fill={throat.fill} />
        {SPECKS.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={1.9} fill={SKY} opacity={0.9} />)}
        <Shine x={76} y={84} rx={8} ry={4.5} />
      </g>

      {/* Wings folded at its sides (when they aren't open), dotted with sky blue, flapping a little */}
      {!open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="80% 10%" delay={side > 0 ? 0.2 : 0}>
            <path d={WING} fill={wing.fill} stroke={ink(WINGC)} strokeWidth={2.8} strokeLinejoin="round" />
            {WING_DOTS.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={1.8} fill={sparkly ? '#ffffff' : SKY} opacity={0.95} />)}
            {WING_LINES.map((p) => <polyline key={p} points={p} fill="none" stroke={ink(WINGC)} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />)}
          </Anim>
        </g>
      ))}

      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={15} mood={mood} mouth={false} blinkDelay={1.4} />
      {/* (a little more pink in its cheeks, which look purple on blue otherwise: the same ellipses as CuteFace's, so
          the coloring page doesn't change) */}
      <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
        {[-1, 1].map((side) => <ellipse key={side} cx={side * 25} cy={11} rx={6.5} ry={4.2} fill="#ff9ac4" opacity={0.5} />)}
      </g>

      {/* Its longish dark beak, with a rounded tip */}
      <path d={BEAK} fill={beak.fill} stroke={ink(BEAKC)} strokeWidth={2} strokeLinejoin="round" />
      <polyline points={BEAK_LINE} fill="none" stroke="#11131a" strokeWidth={1.3} strokeLinecap="round" opacity={0.6} />
      <polyline points="106 106.5 124 107.5 138 111" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.35} />

      {/* Divedash's and Sparklewing's sparkles */}
      {sparkly && [[32, 76, 7], [164, 70, 6], [166, 148, 5], ...(st >= 2 ? [[24, 150, 6], [100, 30, 5]] : [])].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
          <path d={twinklePath(x, y, r)} fill={st >= 2 ? '#ffe680' : '#bff0ff'} stroke={st >= 2 ? undefined : '#5cc8ff'} strokeWidth={1} />
        </Anim>
      ))}

      {st >= 2 && <Crown x={98} y={76} />}
    </g>
  )
}
