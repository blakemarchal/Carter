// Scout → Trailpaw → Homefinder: a fluffy little sheepdog puppy, like a border collie, standing side-on with its
// head turned to face you. Caramel-tan fur with cream: a cream stripe down its face, a cream muzzle with a black
// button nose and a pink tongue out, a fluffy cream chest, four sturdy legs with cream paws on the ground, and a
// fluffy tail with a cream tip, held up at its back and wagging. Its soft ears flop down beside its face.
// Trailpaw wears a red neckerchief; Homefinder has a little gold bell on it too, glows gently, and wears a crown.
// Grumpy: dusty and grey, its ears flat out to the sides, a cross frown and a little pout, and its tail drooping.
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

/** An ellipse's outline as polygon points. Soft glows are drawn as polygons, so the coloring page (which turns
 *  every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

type Circle = [number, number, number]
/** Outline of a puffy shape: the union of circles listed clockwise around its middle (as in wave.tsx). A chain of
 *  circles listed up one side and back down the other ([a, b, c, d, c, b]) makes a fluffy tail. */
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
const chain = (cs: Circle[]) => puff([...cs, ...cs.slice(1, -1).reverse()])

const GROUND = 179
// The round head, with fluffy tufts on its cheeks
const HEAD = smooth([[100, 50], [121, 53], [135, 64], [140, 82], [138, 96], [143, 103], [134, 106], [129, 112], [118, 114], [100, 116], [82, 114], [71, 112], [66, 106], [57, 103], [62, 96], [60, 82], [65, 64], [79, 53]])
// The body side-on, facing left (chest on the left, under the head), with the rump on the right and fluffy fur
// along its tummy
const BODY = smooth([[82, 120], [94, 110], [118, 110], [142, 108], [158, 114], [166, 128], [163, 142], [152, 150], [143, 152], [137, 150], [130, 155], [123, 151], [116, 155], [109, 151], [102, 153], [88, 146]])
// The fluffy cream chest, under its chin
const CHEST = 'M72 106 C68 120 72 134 82 142 Q87 149 92 142 Q97 150 102 142 Q108 146 110 137 Q116 122 112 106 Z'
// A floppy ear from its root (0, 0), hanging down
const EAR = 'M-9 -4 C-14 6 -17 24 -13 36 C-10 45 1 46 5 38 C9 28 10 10 9 -4 Q0 -8 -9 -4 Z'
// The fluffy tail, a chain of puffs from its root in the rump (hidden behind the body), held up and curling over a
// little at its tip, or (grumpy) drooping to the ground; its cream tip is the fur beyond a soft wavy line across it.
const TAIL = {
  up: {
    d: chain([[154, 130, 9], [162, 123, 10.5], [169, 115, 11], [175, 106, 11], [178, 96, 10.5], [179, 87, 9.5], [177, 78, 8], [173, 71, 6]]),
    tip: 'M150 40 H200 V93 Q196 97 192 93 Q188 97 184 93 Q180 97 176 93 Q172 97 168 93 L150 95 Z',
  },
  down: {
    d: chain([[154, 132, 9], [162, 137, 10], [169, 145, 10], [173, 154, 9.5], [175, 163, 8.5], [175, 171, 7], [174, 177, 5]]),
    tip: 'M160 200 H200 V164 Q196 168 192 164 Q188 168 184 164 Q180 168 176 164 Q172 168 168 164 L160 166 Z',
  },
}
/** A sturdy puppy leg from inside the body down to the ground, centred on x. */
const legPath = (x: number) => `M${x - 7.5} 136 L${x - 7} 168 Q${x} 172 ${x + 7} 168 L${x + 7.5} 136 Z`

export default function Puppy({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.min(stage, 2)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [tailClip, glowGrad] = [`pt${uid}`, `pg${uid}`]
  const FUR = g ? '#c2b6a8' : '#e39f58' // caramel tan
  const FAR = g ? '#b0a496' : '#cf8b45' // the legs on the far side, a shade darker
  const EAR_C = g ? '#a8998b' : '#c47d3c'
  const CREAM = g ? '#ebe6de' : '#fff4e2'
  const NOSE = '#3b2a2f'
  const RED = g ? '#b9918f' : '#e8453c'
  const GLOW = '#ffe9a0'
  const fur = useShade(FUR, 0.4, 0.14)
  const far = useShade(FAR, 0.35, 0.15)
  const ear = useShade(EAR_C, 0.35, 0.15)
  const cream = useShade(CREAM, 0.5, 0.06)
  const red = useShade(RED, 0.3, 0.15)
  const gold = useShade('#ffd34d', 0.45, 0.2)
  const line = ink(FUR)
  const creamLine = ink(CREAM)
  const tail = g ? TAIL.down : TAIL.up
  return (
    <g>
      <defs>
        {fur.def}{far.def}{ear.def}{cream.def}{red.def}{gold.def}
        <clipPath id={tailClip}><path d={tail.d} /></clipPath>
        <radialGradient id={glowGrad}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.9} />
          <stop offset="0.55" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Homefinder's gentle glow */}
      {st >= 2 && !g && <polygon points={ring(112, 112, 90, 80)} fill={`url(#${glowGrad})`} />}

      {/* The fluffy tail with its cream tip, at its back; it wags (pivoting at its root) */}
      <Anim cls="pa-tail" origin={g ? '15% 10%' : '0% 80%'}>
        <path d={tail.d} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={tail.tip} fill={CREAM} clipPath={`url(#${tailClip})`} />
        <path d={tail.d} fill="none" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      </Anim>

      {/* Four sturdy legs with cream paws: the far pair a shade darker, just behind the near pair */}
      {([[106, far, FAR], [158, far, FAR], [92, fur, FUR], [144, fur, FUR]] as const).map(([x, f, c]) => (
        <g key={x}>
          <path d={legPath(x)} fill={f.fill} stroke={ink(c)} strokeWidth={2.8} strokeLinejoin="round" />
          <ellipse cx={x - 1} cy={GROUND - 5.5} rx={9.5} ry={6} fill={cream.fill} stroke={creamLine} strokeWidth={2.5} />
          <path d={`M${x - 4.5} ${GROUND - 7} v3.5 M${x + 2.5} ${GROUND - 7} v3.5`} stroke={creamLine} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ))}

      {/* Body, with a fluffy cream chest */}
      <g className="pa-breathe">
        <path d={BODY} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <Shine x={136} y={116} rx={8} ry={3.5} rot={-8} />
        <path d={CHEST} fill={cream.fill} stroke={creamLine} strokeWidth={2.5} strokeLinejoin="round" />
      </g>

      {/* Trailpaw's red neckerchief (with a little gold bell for Homefinder) */}
      {st >= 1 && (
        <g>
          <path d="M70 104 Q100 126 130 104 L131 113 Q100 136 69 113 Z" fill={red.fill} stroke={ink(RED)} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M82 117 Q100 128 118 117 L102 145 Q100 147.5 98 145 Z" fill={red.fill} stroke={ink(RED)} strokeWidth={2.4} strokeLinejoin="round" />
          {[[94, 126], [106, 126], [100, 136]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r={1.8} fill="#fff" opacity={0.9} />)}
          {st >= 2 && (
            <g>
              <path d="M93.5 131 Q93.5 121.5 100 121.5 Q106.5 121.5 106.5 131 Z" fill={gold.fill} stroke="#c99a1a" strokeWidth={2} strokeLinejoin="round" />
              <rect x={92} y={129.5} width={16} height={3.5} rx={1.75} fill={gold.fill} stroke="#c99a1a" strokeWidth={1.6} />
              <circle cx={100} cy={134.5} r={2} fill="#c99a1a" />
            </g>
          )}
        </g>
      )}

      {/* Round head with a cream stripe down its face and a cream muzzle */}
      <path d={HEAD} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M96 52 Q100 50 104 52 Q105 66 106 80 Q100 83 94 80 Q95 66 96 52 Z" fill={cream.fill} />
      <ellipse cx={100} cy={99} rx={18} ry={12.5} fill={cream.fill} stroke={creamLine} strokeWidth={1.8} strokeOpacity={0.5} />
      <Shine x={82} y={64} rx={8.5} ry={4.5} />

      {/* Soft floppy ears hanging beside its face (flat out to the sides when grumpy); they twitch */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${100 + side * 31} 61) scale(${-side} 1) rotate(${g ? 50 : 20})`}>
          <Anim cls="pa-ear" origin="50% 0%" delay={side > 0 ? 0.6 : 0}>
            <path d={EAR} fill={ear.fill} stroke={ink(EAR_C)} strokeWidth={2.8} strokeLinejoin="round" />
          </Anim>
        </g>
      ))}

      <CuteFace x={100} y={80} s={0.86} gap={16} mood={mood} mouth={false} blinkDelay={0.4} />
      {/* A black button nose, and a smile with its pink tongue out (a frown and a little pout when grumpy) */}
      <path d="M93 91 Q100 88 107 91 Q106 97 100 99 Q94 97 93 91 Z" fill={NOSE} />
      <ellipse cx={97.5} cy={91.5} rx={2.2} ry={1.3} fill="#fff" opacity={0.75} />
      {g ? (
        <g stroke="#5a3a3a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M94.5 106 Q100 101.5 105.5 106" fill="none" />
          <path d="M96.5 107 Q100 111 103.5 107 Q100 108.2 96.5 107 Z" fill="#e8a0a8" />
        </g>
      ) : (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M96 103.5 Q95.5 112 100 112.5 Q104.5 112 104 103.5 Z" fill="#ff8fa6" stroke="#c9566e" strokeWidth={1.8} />
          <path d="M100 104.5 V109" stroke="#c9566e" strokeWidth={1.4} />
          <path d="M100 99 V102 M93 101.5 Q96.5 105.5 100 102 Q103.5 105.5 107 101.5" stroke="#5a3a3a" strokeWidth={2} fill="none" />
        </g>
      )}

      {st >= 2 && (
        <>
          <Crown x={100} y={52} />
          {!g && [[24, 62, 7], [176, 44, 6.5], [30, 150, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
