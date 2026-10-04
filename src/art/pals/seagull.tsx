// Squawk → Seaglider → Calmwing: a round, friendly seagull, turned a little toward our left with its face toward you:
// snowy white all over (head and plump body in one smooth shape), with soft grey wings, a rounded yellow beak, and
// yellow-orange legs with webbed feet on the ground. Its wings are folded at its sides, and its white tail sticks out
// at its back (our right), with the long black tips of its folded wings (little white spots on them) crossed over it,
// as a seagull's are.
// Seaglider holds its wings out wide at its sides, as if gliding on the breeze (their black tips out at the ends), with
// a calm, happy face; Calmwing stands in gentle ripples of calm water with its wings out wide, glows softly and wears a
// crown.
// Grumpy: a stormy grey, the feathers on its head blown every which way and its edge ruffled, its beak open
// mid-squawk (with a little pink tongue), its wings folded, with cross brows.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

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

/** A soft feather from its root at (0, 0) out to its rounded tip at (l, 0), w wide. */
const feather = (l: number, w: number) =>
  `M0 ${-w * 0.3} C${l * 0.4} ${-w * 0.55} ${l * 0.8} ${-w * 0.55} ${l} ${-w * 0.2} Q${l + 2.5} 0 ${l} ${w * 0.2} C${l * 0.8} ${w * 0.55} ${l * 0.4} ${w * 0.55} 0 ${w * 0.3} Z`

const FACE_Y = 68
const FACE_S = 0.82
const BX = 104 // the middle of its body, across
const MIRROR = `translate(${2 * BX} 0) scale(-1 1)`

// Its round head and plump body, all in one smooth shape (a little neck between them); ruffled up, its edge is bumpy
const SHAPE: Pt[] = [
  [100, 41], [119, 47], [128.5, 63], [126, 82], [138, 98], [149, 117], [150, 137], [139, 152.5], [118, 160.5], [96, 161.5],
  [76, 156.5], [62.5, 142.5], [60, 122], [68, 101], [74, 83], [71.5, 63], [81, 47],
]
function outline(ruffled: boolean) {
  if (!ruffled) return smooth(SHAPE)
  const c: Pt = [104, 112]
  const ps: Pt[] = []
  SHAPE.forEach((p, i) => {
    const q = SHAPE[(i + 1) % SHAPE.length]
    const m: Pt = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    const out = Math.hypot(m[0] - c[0], m[1] - c[1])
    ps.push(p, [m[0] + ((m[0] - c[0]) / out) * 3.2, m[1] + ((m[1] - c[1]) / out) * 3.2])
  })
  return smooth(ps)
}

// The yellow beak, from the bottom of its face out to a rounded tip that dips a little; and, mid-squawk, open
// wide: the top of it raised, the bottom dropped, and the inside of its mouth with a little pink tongue
const BEAK = 'M107 78.5 C98 77.5 87 80 78 83.5 Q69 87 66.5 91.5 Q65.5 96 71 95 C81 93.5 94 92 107 91.5 A6.5 6.5 0 0 0 107 78.5 Z'
const BEAK_LINE = '104.5 86.3 89 88 73 91.8'
const SQUAWK_TOP = 'M107 76.5 C98 74.5 87 75 78 77 Q69 79 67 83.5 Q66.5 87.5 72 87 C82 86 94 86 107 88 A5.75 5.75 0 0 0 107 76.5 Z'
const SQUAWK_MOUTH = 'M107 85 C94 85 82 86 73 88 Q67.5 95 74 103 C85 99 96 94.5 107 93 Z'
const SQUAWK_JAW = 'M107 90 C98 92 88 96 80 100 Q72 103.5 73 106.5 Q75 109 81 106.5 C90 102 99 98.5 107 97 A3.5 3.5 0 0 0 107 90 Z'

// The left wing folded at its side (the right one is its mirror image): soft grey, with three round feather tips at
// the bottom and lines between its feathers. Folded, the long black tips of its wings (with little white spots) lie
// crossed over its tail at its back, as a seagull's do.
const WING = 'M73 99 C61 102 53 112 51 125 C49 135 50 144 53 151 A4.2 4.2 0 0 0 59.5 155.5 A4.2 4.2 0 0 0 66.5 154 A4.2 4.2 0 0 0 71.5 148 C74.5 139 77 129 77 118 C77 109 76 103 73 99 Z'
const WING_LINES = ['59 132 57.5 152', '65.5 134 64 152.5']
const CROSSED: [number, number, number][] = [[-6, 47, 11], [8, 45, 11]] // [angle, length, width], from behind its back
// The left wing held out wide, gliding: up from its side to the bend of the wing, then gently out and down to its
// black tip, its long feathers ending in round tips along the back of it (drawn behind the body, so it grows out of
// its side); the little feathers at the top of the wing over them
const OPEN = 'M84 99 C72 91 60 85 49 85 C38 85 26 90.5 16.5 98.5 Q11.5 102.5 16.5 105 A5 5 0 0 0 26.5 110.5 A5.5 5.5 0 0 0 37.5 115.5 A6 6 0 0 0 49.5 119.5 A6 6 0 0 0 61.5 123.5 A6 6 0 0 0 73.5 127 L84 129 Z'
const OPEN_TIPS = 'M0 70 H35 Q30.5 95 33.5 125 H0 Z' // (black where it overlaps the wing)
const OPEN_LINES = ['66 110 61.5 122.5', '55 106 49.5 118.5', '44 102 38 114.5', '34 99 27 109.5']
const OPEN_SPOTS: Pt[] = [[22.5, 102]]
const OPEN_COVERT = 'M84 100 C73 93 62 88.5 52 89 C45 92 45 100 51.5 103.5 C62 107.5 73 112 84 117 Z'
// Its white tail at its back, peeping out behind it: three feathers [angle, length, width] with grey tips
const TAIL: [number, number, number][] = [[4, 28, 13], [20, 30, 14], [36, 26, 13]]
// Grumpy: feathers on its head blown every which way. [x, y, angle, length]
const BLOWN: [number, number, number, number][] = [
  [88, 47, -142, 12], [97, 43, -104, 15], [107, 43, -72, 14], [117, 47, -40, 13], [126, 61, -8, 11], [73, 70, 188, 9],
]
// Calmwing's gentle ripples of calm water round its feet, biggest first: [rx, ry]
const RIPPLES: [number, number][] = [[70, 13], [52, 9.5], [34, 6.2]]

export default function Seagull({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '')
  const glowId = `gg${ids}`
  const openClip = `go${ids}`
  const WHITE = g ? '#dcdde3' : '#f8fafd'
  const LINE = g ? '#7d808c' : '#8c99aa' // a cool grey outline (the dove's is a paler blue)
  const WINGC = g ? '#9198a4' : '#b3bfcc'
  const TIP = g ? '#4c4f58' : '#363b48'
  const BEAKC = g ? '#d8c58c' : '#ffd23f'
  const LEGS = g ? '#d0a97a' : '#ffad33'
  const WATER = '#7cc6ff' // Peace blue
  const GLOW = '#d4ecff'
  const body = useShade(WHITE, 0.6, 0.1)
  const wing = useShade(WINGC, 0.35, 0.14)
  const beak = useShade(BEAKC, 0.4, 0.12)
  const water = useShade('#cdeaff', 0.4, 0.06)
  const open = st >= 1 && !g // Seaglider and Calmwing glide with their wings out wide; grumpy, they're folded
  const wet = st >= 2

  return (
    <g>
      <defs>
        {body.def}{wing.def}{beak.def}{water.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={GLOW} stopOpacity={0.5} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
        <clipPath id={openClip}><path d={OPEN} /></clipPath>
      </defs>

      {/* Calmwing's soft glow all round it */}
      {wet && !g && <polygon points={ring(100, 112, 94, 86)} fill={`url(#${glowId})`} />}

      {/* Calmwing's gentle ripples of calm water, round its feet */}
      {wet && RIPPLES.map(([rx, ry], i) => (
        <ellipse key={rx} cx={103} cy={177} rx={rx} ry={ry} fill={i === RIPPLES.length - 1 ? water.fill : 'none'} stroke={WATER} strokeWidth={i ? 2.6 : 2.2} opacity={i ? 0.95 : 0.7} />
      ))}

      {/* Seaglider's and Calmwing's wings, held out wide at its sides as if gliding, swaying gently */}
      {open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="95% 60%" delay={side > 0 ? 0.15 : 0}>
            <path d={OPEN} fill={wing.fill} stroke={LINE} strokeWidth={2.8} strokeLinejoin="round" />
            <path d={OPEN_TIPS} clipPath={`url(#${openClip})`} fill={TIP} />
            {OPEN_SPOTS.map(([x, y]) => <circle key={x} cx={x} cy={y} r={2} fill="#fff" />)}
            {OPEN_LINES.map((p) => <polyline key={p} points={p} fill="none" stroke={LINE} strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />)}
            <path d={OPEN_COVERT} fill={wing.fill} stroke={LINE} strokeWidth={2.2} strokeLinejoin="round" />
          </Anim>
        </g>
      ))}

      {/* Its white tail at its back, wagging a little (with the black tips of its folded wings crossed over it) */}
      <Anim cls="pa-tail" origin="0% 50%" delay={0.4}>
        {TAIL.map(([a, l, w]) => (
          <g key={a} transform={`translate(135 148) rotate(${a + (g ? (a - 20) / 2.5 : 0)})`}>
            <path d={feather(l, w)} fill={body.fill} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
            <path d={`M${l - 7} ${-w * 0.33} Q${l + 2.5} 0 ${l - 7} ${w * 0.33} Z`} fill={WINGC} />
          </g>
        ))}
        {!open && CROSSED.map(([a, l, w]) => (
          <g key={a} transform={`translate(128 145) rotate(${a + (g ? 6 : 0)})`}>
            <path d={feather(l, w)} fill={TIP} stroke={ink(TIP)} strokeWidth={2} strokeLinejoin="round" />
            <circle cx={l - 6} cy={0} r={1.9} fill="#fff" />
          </g>
        ))}
      </Anim>

      {/* Grumpy: the feathers on its head blown every which way (behind its head, so they stick out of it) */}
      {g && BLOWN.map(([x, y, a, l]) => (
        <path key={`${x}${y}`} d={feather(l, 8)} transform={`translate(${x} ${y}) rotate(${a})`} fill={body.fill} stroke={LINE} strokeWidth={2.2} strokeLinejoin="round" />
      ))}

      {/* Two yellow-orange legs with webbed feet, pointing the way it faces */}
      {[92, 115].map((x) => (
        <g key={x} fill={LEGS} stroke={ink(LEGS)} strokeWidth={2} strokeLinejoin="round">
          <rect x={x - 3} y={150} width={6} height={24} rx={3} />
          <path d={`M${x + 4} 172 C${x - 2} 170.5 ${x - 11} 172 ${x - 17} 175.5 Q${x - 21} 178.5 ${x - 16.5} 180 Q${x - 13} 182 ${x - 9.5} 179.6 Q${x - 6} 182 ${x - 2.5} 179.6 Q${x + 1.5} 181.5 ${x + 5} 178 Q${x + 7.5} 175 ${x + 4} 172 Z`} />
          <polyline points={`${x - 1} 174 ${x - 13} 178.5`} fill="none" stroke={ink(LEGS)} strokeWidth={1.3} opacity={0.6} />
          <polyline points={`${x} 174.5 ${x - 5.5} 179`} fill="none" stroke={ink(LEGS)} strokeWidth={1.3} opacity={0.6} />
        </g>
      ))}

      {/* Its round white head and body (bumpy with ruffled feathers when grumpy) */}
      <g className="pa-breathe">
        <path d={outline(g)} fill={body.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <Shine x={88} y={52} rx={8} ry={4.5} />
      </g>

      {/* Wings folded at its sides (when it isn't gliding), flapping a little */}
      {!open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="80% 10%" delay={side > 0 ? 0.2 : 0}>
            <g transform={g ? 'rotate(8 73 100) translate(0 2)' : undefined}>
              <path d={WING} fill={wing.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
              {WING_LINES.map((p) => <polyline key={p} points={p} fill="none" stroke={LINE} strokeWidth={1.7} strokeLinecap="round" opacity={0.85} />)}
            </g>
          </Anim>
        </g>
      ))}

      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={15} mood={mood} mouth={false} blinkDelay={0.4} />

      {/* Its rounded yellow beak: shut, or open wide mid-squawk */}
      {g ? (
        <g strokeLinejoin="round">
          <path d={SQUAWK_MOUTH} fill="#c0455f" stroke={ink(BEAKC)} strokeWidth={1.6} />
          <ellipse cx={82} cy={98} rx={5.5} ry={2.8} transform="rotate(-18 82 98)" fill="#ff8fa8" />
          <path d={SQUAWK_JAW} fill={beak.fill} stroke={ink(BEAKC)} strokeWidth={2} />
          <path d={SQUAWK_TOP} fill={beak.fill} stroke={ink(BEAKC)} strokeWidth={2.2} />
        </g>
      ) : (
        <g>
          <path d={BEAK} fill={beak.fill} stroke={ink(BEAKC)} strokeWidth={2.2} strokeLinejoin="round" />
          <polyline points={BEAK_LINE} fill="none" stroke={ink(BEAKC)} strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
          <polyline points="75 86 88 82 100 81" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" opacity={0.6} />
        </g>
      )}

      {st >= 2 && (
        <>
          <Crown x={100} y={49} />
          {!g && [[30, 52, 8], [172, 50, 7], [150, 22, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
