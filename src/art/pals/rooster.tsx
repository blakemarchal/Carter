// Strut → Plumecrest → Gentlecomb: a proud little rooster facing you, golden-brown, with a red comb on top of his
// head, a red wattle under his little yellow beak, a cape of shiny golden feathers round his neck, russet wings
// folded at his sides, and two yellow legs with three round toes on each foot. His fancy tail sweeps up from
// behind him at his back (on his left, our right) and arches over, in long curved feathers of teal and green.
// Plumecrest is softer and kinder-looking, with a bigger, rounder comb and a fuller, prettier tail with golden
// tips. Gentlecomb's tail is fuller again, in all the soft colours of the sunrise, and he wears a crown, with a
// warm morning glow all round him.
// Grumpy (in battle, before he's befriended): dusty and dull, his chest puffed right out and his nose in the air,
// with a cross little frown.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

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

// ---------- His tail ----------

// A tail feather is a long curved plume along the curve root → (bend) → tip, widest a little before its middle and
// narrowing to a soft round tip: [root, bend, tip, width].
type Plume = [Pt, Pt, Pt, number]
const along = ([a, b, c]: Plume, t: number): Pt => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}
const halfWidth = (w: number, t: number) => (w / 2) * Math.sin(Math.PI * (0.16 + 0.8 * t)) ** 0.8

/** The plume's outline from t0 to t1 along it (0 = root, 1 = tip), with round ends. */
function plume(p: Plume, t0 = 0, t1 = 1, n = 22) {
  const [a, b, c, w] = p
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n, u = 1 - t
    const [x, y] = along(p, t)
    const dx = u * (b[0] - a[0]) + t * (c[0] - b[0]), dy = u * (b[1] - a[1]) + t * (c[1] - b[1])
    const len = Math.hypot(dx, dy) || 1, h = halfWidth(w, t)
    L.push([x - (dy / len) * h, y + (dx / len) * h])
    R.unshift([x + (dy / len) * h, y - (dx / len) * h])
  }
  const r1 = halfWidth(w, t1), r0 = halfWidth(w, t0)
  const sm = (ps: Pt[]) => ps.slice(1, -1).map((q, i) => `Q${pt(...q)} ${pt((q[0] + ps[i + 2][0]) / 2, (q[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return `M${pt(...L[0])} ${sm(L)} A${r1.toFixed(1)} ${r1.toFixed(1)} 0 0 0 ${pt(...R[0])} ${sm(R)} A${r0.toFixed(1)} ${r0.toFixed(1)} 0 0 0 ${pt(...L[0])}Z`
}

// His tail at each stage, fanned out from behind his back, the long outside feathers first and the shorter
// inside ones over them. Fuller as he grows.
const TAILS: Plume[][] = [
  [[[126, 138], [152, 40], [184, 70], 17], [[128, 142], [174, 66], [190, 108], 17], [[128, 147], [172, 108], [182, 146], 16]],
  [[[124, 136], [150, 40], [178, 48], 15], [[126, 138], [158, 36], [188, 70], 18], [[128, 142], [176, 66], [193, 108], 18],
    [[128, 147], [174, 108], [185, 148], 17], [[126, 140], [152, 74], [172, 92], 13]],
  [[[124, 136], [150, 40], [178, 48], 15], [[126, 138], [158, 36], [189, 70], 18], [[128, 142], [177, 66], [194, 108], 18],
    [[128, 147], [175, 108], [186, 149], 17], [[127, 144], [170, 88], [190, 128], 15], [[126, 140], [150, 70], [170, 84], 13],
    [[127, 143], [160, 96], [177, 112], 13]],
]

// ---------- His body ----------

const FACE_Y = 80
const FACE_S = 0.82
// The plump body, a little wider at the bottom; `puff` puffs his chest out.
const bodyPts = (puff: number): Pt[] => Array.from({ length: 12 }, (_, i) => {
  const a = ((i * 30 - 90) * Math.PI) / 180
  const chest = 1 + (puff - 1) * Math.max(0, 0.5 - Math.sin(a)) // (the top of him puffs out most)
  return [100 + 41 * chest * Math.cos(a) * (1 + 0.08 * Math.sin(a)), 135 + 35 * Math.sin(a) * (a < 0 ? chest : 1)]
})
// The cape of golden feathers round his neck: smooth on top (behind his head), with soft points round the bottom.
const capePts = (k: number): Pt[] => Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2
  const r = Math.sin(a) > 0.15 ? (i % 2 ? 0.8 : 1.06) : 0.96
  return [100 + Math.cos(a) * 33 * r, 101 + Math.sin(a) * 21 * k * r]
})
// The left wing folded at his side (the right one is its mirror image), with three round feather tips at the bottom.
const WING = 'M69 111 C57 114 49 124 47 137 C45 147 46 156 49 163 A4.4 4.4 0 0 0 56 167.5 A4.4 4.4 0 0 0 63.2 166 A4.4 4.4 0 0 0 68.4 160 C71.4 151 74 141 74 130 C74 121 72.5 115 69 111 Z'
const WING_LINES = ['55.5 144 54 164', '62.5 146 61 164.5']

export default function Rooster({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `og${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const GOLDEN = g ? '#c9b597' : st >= 1 ? '#f4bb66' : '#eaa244' // (softer and lighter once he's gentle)
  const CAPE = g ? '#dccdb2' : st >= 1 ? '#ffd47c' : '#ffcb61'
  const BREAST = g ? '#e3d7c3' : '#ffe2a8'
  const WINGC = g ? '#a99682' : st >= 1 ? '#d58a4f' : '#c8763c'
  const RED = g ? '#c99a9a' : '#ff5462'
  const BEAK = g ? '#d8c08e' : '#ffbe3b'
  const LEGS = g ? '#cdb58a' : '#f5ac3c'
  const GOLD = '#ffd34d'
  // The tail's colours: teal and green (Strut and Plumecrest, his with golden tips), or all the soft colours of the
  // sunrise (Gentlecomb)
  const TAILC = g ? ['#8fa09b', '#9ba796', '#a2aaa4'] : st >= 2
    ? ['#ff8fb3', '#ffa66e', '#ffd45e', '#7fd6a0', '#5fc3d8', '#b39cff', '#ff9ec4']
    : ['#2e9488', '#43ad6a', '#2e9488', '#43ad6a', '#5fc0a0']
  const body = useShade(GOLDEN, 0.4, 0.16)
  const cape = useShade(CAPE, 0.45, 0.12)
  const breast = useShade(BREAST, 0.45, 0.06)
  const wing = useShade(WINGC, 0.35, 0.16)
  const red = useShade(RED, 0.35, 0.15)
  const beak = useShade(BEAK, 0.45, 0.12)
  const legs = useShade(LEGS, 0.35, 0.12)
  const tailFills = [useShade(TAILC[0], 0.35, 0.15), useShade(TAILC[1], 0.35, 0.15), useShade(TAILC[2], 0.35, 0.15),
    useShade(TAILC[3 % TAILC.length], 0.35, 0.15), useShade(TAILC[4 % TAILC.length], 0.35, 0.15),
    useShade(TAILC[5 % TAILC.length], 0.35, 0.15), useShade(TAILC[6 % TAILC.length], 0.35, 0.15)]
  const line = ink(GOLDEN)
  const tail = TAILS[st]
  // His head: nose in the air when he's cross; tipped gently to one side once he's kind
  const tilt = g ? 'rotate(-13 100 104) translate(0 -4)' : st >= 1 ? 'rotate(6 100 104)' : undefined
  // The comb: three little points on Strut; bigger and rounder once he's gentle
  const comb = st >= 1
    ? 'M83 63 C78 53 84 45 91 49 C90 39 100 35 104 44 C107 36 118 38 117 49 C123 46 128 55 122 63 Z'
    : 'M86 62 C82 54 86 48 91 51 C90 42 98 39 101 47 C104 40 113 41 111 52 C116 50 120 57 116 62 Z'

  return (
    <g>
      <defs>
        {body.def}{cape.def}{breast.def}{wing.def}{red.def}{beak.def}{legs.def}{tailFills.map((f) => f.def)}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#ffe6c4" stopOpacity={0.95} />
          <stop offset="0.6" stopColor="#ffd2b0" stopOpacity={0.45} />
          <stop offset="1" stopColor="#ffd2b0" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Gentlecomb's warm morning glow */}
      {st >= 2 && !g && <polygon points={ring(110, 106, 92, 88)} fill={`url(#${glowId})`} />}

      {/* His fancy tail, sweeping up from behind his back and arching over, swaying a little (mirrored twice, so the
          sway lifts it up rather than pushing it out of the picture) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="100% 100%" delay={0.3}>
          <g transform={MIRROR}>
            {tail.map((p, i) => {
              const c = TAILC[i % TAILC.length]
              const mid = [0.2, 0.4, 0.6, 0.8].map((t) => pt(...along(p, t))).join(' ')
              return (
                <g key={i}>
                  <path d={plume(p)} fill={tailFills[i % tailFills.length].fill} stroke={ink(c)} strokeWidth={2.4} strokeLinejoin="round" />
                  {st === 1 && !g && <path d={plume(p, 0.84, 1)} fill={GOLD} stroke={ink(c)} strokeWidth={1.6} strokeLinejoin="round" />}
                  <polyline points={mid} fill="none" stroke={ink(c)} strokeWidth={1.4} strokeLinecap="round" opacity={0.4} />
                </g>
              )
            })}
          </g>
        </Anim>
      </g>

      {/* Two yellow legs with three round toes on each foot */}
      {[88, 112].map((x) => (
        <g key={x} fill={legs.fill} stroke={ink(LEGS)} strokeWidth={2}>
          <rect x={x - 3.5} y={156} width={7} height={19} rx={3.5} />
          <ellipse cx={x - 6.5} cy={176.5} rx={3} ry={6} transform={`rotate(58 ${x - 6.5} 176.5)`} />
          <ellipse cx={x + 6.5} cy={176.5} rx={3} ry={6} transform={`rotate(-58 ${x + 6.5} 176.5)`} />
          <ellipse cx={x} cy={177.5} rx={3.2} ry={5.5} />
        </g>
      ))}

      {/* The plump body with a pale golden breast (puffed right out when he's cross) */}
      <g className="pa-breathe">
        <path d={smooth(bodyPts(g ? 1.15 : 1))} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={100} cy={g ? 134 : 140} rx={g ? 30 : 24} ry={g ? 27 : 22} fill={breast.fill} />
        {[[92, 136], [108, 136], [100, 145], [87, 150], [113, 150], [100, 156]].map(([x, y]) => (
          <polyline key={`${x}${y}`} points={`${x - 3.5} ${y - 1.5} ${x} ${y + 2} ${x + 3.5} ${y - 1.5}`} fill="none" stroke={g ? '#bba98f' : '#e5a95a'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </g>

      {/* Russet wings folded at his sides (held out from his puffed-up chest when he's cross), flapping a little */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="80% 10%" delay={side > 0 ? 0.2 : 0}>
            <g transform={g ? 'translate(-5 0) rotate(8 69 112)' : undefined}>
              <path d={WING} fill={wing.fill} stroke={ink(WINGC)} strokeWidth={3} strokeLinejoin="round" />
              {WING_LINES.map((p) => <polyline key={p} points={p} fill="none" stroke={ink(WINGC)} strokeWidth={1.8} strokeLinecap="round" opacity={0.6} />)}
            </g>
          </Anim>
        </g>
      ))}

      {/* His head, with its comb, cape of golden neck feathers, beak and wattle (tipped back when he's cross) */}
      <g transform={tilt}>
        <Anim cls="pa-ear" origin="50% 100%" delay={0.8}>
          <path d={comb} fill={red.fill} stroke={ink(RED)} strokeWidth={2.4} strokeLinejoin="round" />
        </Anim>
        <path d={smooth(capePts(st >= 1 ? 1.12 : 1))} fill={cape.fill} stroke={ink(CAPE)} strokeWidth={2.4} strokeLinejoin="round" />
        <circle cx={100} cy={80} r={26} fill={body.fill} stroke={line} strokeWidth={3} />
        <Shine x={88} y={66} rx={7} ry={4} />
        <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={14} mood={mood} mouth={false} blinkDelay={0.5} />
        {/* The red wattle under his beak, and the little beak */}
        <path d="M100 95 C94 96 92 104 95 108 C97 111 100 109 100 106 C100 109 103 111 105 108 C108 104 106 96 100 95 Z" fill={red.fill} stroke={ink(RED)} strokeWidth={2} strokeLinejoin="round" />
        <path d="M93.5 88.5 Q100 85 106.5 88.5 Q104.5 94 100 98 Q95.5 94 93.5 88.5 Z" fill={beak.fill} stroke={ink(BEAK)} strokeWidth={2} strokeLinejoin="round" />
        {st >= 2 && <Crown x={100} y={60} />}
      </g>

      {st >= 2 && !g && [[24, 60, 7], [26, 134, 6], [100, 16, 5]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
