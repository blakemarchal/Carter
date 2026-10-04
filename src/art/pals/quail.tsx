// Quilly → Quailbell → Morningwing: a plump round quail facing you, with a curly topknot feather bobbing on its
// head, speckled brown wings tucked at its sides, a cream tummy with little scallops and little orange feet.
// Quailbell's topknot is fuller and it wears a pink ribbon with a little golden bell; Morningwing opens its wings
// wide, as if for a hug, and they shine gold like the morning light; it wears a crown.
// Grumpy: dull and grey, all puffed up, its topknot flopped over and its wings hanging down.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** A smooth closed outline through the points (Catmull-Rom). */
function smooth(ps: Pt[]) {
  const n = ps.length
  const at = (i: number) => ps[(i + n) % n]
  let d = `M${pt(...ps[0])}`
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    d += ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }
  return `${d}Z`
}

/** A smooth tapering tube along the curve a → (b) → c, width w0 at a up to w1 at c, with round ends. */
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

const MIRROR = 'translate(200 0) scale(-1 1)'
/** The round body, egg-shaped (a little wider at the bottom); `puff` widens it. */
const bodyPts = (puff: number): Pt[] => Array.from({ length: 12 }, (_, i) => {
  const a = ((i * 30 - 90) * Math.PI) / 180
  return [100 + 49 * puff * Math.cos(a) * (1 + 0.06 * Math.sin(a)), 122 + 50 * Math.sin(a)]
})
// The left wing tucked at its side, with its speckles; the right one is its mirror image
const WING = 'M62 104 C49 109 43 124 44 140 C45 152 50 161 58 165 C62 156 67 144 69 130 C70 118 68 109 62 104 Z'
const SPECKS = [[55, 120], [61, 114], [51, 132], [58, 127], [64, 121], [53, 145], [60, 140], [58, 153]]
// Morningwing's left wing, opened wide at its side: long feathers fanned out from under the little feathers at
// the top of the wing. [root x, root y, angle (180 points straight out), length, width]
const FEATHERS = [[40, 100, 196, 26, 11], [42, 108, 184, 28, 12], [46, 116, 172, 27, 12], [51, 123, 160, 24, 11], [57, 129, 148, 20, 10]]
/** A long feather from its root at (0, 0) out to its rounded tip at (l, 0), w wide. */
const feather = (l: number, w: number) =>
  `M0 ${-w * 0.3} C${l * 0.4} ${-w * 0.55} ${l * 0.8} ${-w * 0.55} ${l} ${-w * 0.2} Q${l + 2.5} 0 ${l} ${w * 0.2} C${l * 0.8} ${w * 0.55} ${l * 0.4} ${w * 0.55} 0 ${w * 0.3} Z`
const COVERTS = 'M70 100 C60 93 46 92 37 96 C31 100 33 108 39 110 C36 116 40 122 47 123 C47 129 54 133 62 132 C66 128 69 120 70 112 Z'

export default function Quail({ stage, mood }: BodyProps) {
  const clip = `qc${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const g = mood === 'grumpy'
  const BLUE = g ? '#a6a9b3' : '#93a8d2'
  const CREAM = g ? '#e6e1d8' : '#fff1de'
  const WINGC = g ? '#a8998a' : '#b38865'
  const TOPKNOT = g ? '#5f5a66' : '#3d3450'
  const BEAK = g ? '#d9bd92' : '#ffb347'
  const FEET = g ? '#c4a98c' : '#f0a35a'
  const RIBBON = g ? '#c9aebb' : '#ff6fae'
  const GOLD = g ? '#d3c9a4' : '#ffd95e'
  const DAWN = g ? '#d2c3a8' : '#ffc04d' // the long feathers of the morning wings, a deeper sunrise gold
  const body = useShade(BLUE, 0.4, 0.16)
  const cream = useShade(CREAM, 0.5, 0.06)
  const wing = useShade(WINGC, 0.35, 0.15)
  const knot = useShade(TOPKNOT, 0.35, 0.15)
  const gold = useShade(GOLD, 0.5, 0.14)
  const dawn = useShade(DAWN, 0.4, 0.14)
  const line = ink(BLUE)
  const open = stage >= 2
  const outline = smooth(bodyPts(g ? 1.05 : 1)) // (puffed up a little when grumpy)
  // The topknot: one curl, two once it's fuller; flopped over to the side when grumpy. [a, b, c, w0, w1]
  type Curl = [Pt, Pt, Pt, number, number]
  const curls: Curl[] = g
    ? ([[[97, 74], [110, 60], [120, 72], 3, 8.5], [[100, 74], [122, 54], [133, 80], 3.5, 11]] as Curl[]).slice(stage >= 1 ? 0 : 1)
    : stage >= 1
      ? [[[97, 74], [89, 52], [100, 50], 3, 9], [[100, 74], [95, 36], [116, 43], 4, 13]]
      : [[[100, 74], [96, 46], [112, 46], 3.5, 11]]
  return (
    <g>
      <defs>
        {body.def}{cream.def}{wing.def}{knot.def}{gold.def}{dawn.def}
        <clipPath id={clip}><path d={outline} /></clipPath>
      </defs>

      {/* Morningwing's golden wings, opened wide at its sides with a soft morning glow, flapping slowly (hanging
          down when grumpy) */}
      {open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="95% 50%" delay={side > 0 ? 0.1 : 0}>
            <g transform={g ? 'rotate(-20 66 116)' : undefined}>
              {!g && (
                <g opacity={0.35} fill={GOLD} stroke={GOLD} strokeWidth={10} strokeLinejoin="round">
                  {FEATHERS.map(([x, y, a, l, w]) => <path key={y} d={feather(l, w)} transform={`translate(${x} ${y}) rotate(${a})`} />)}
                  <path d={COVERTS} />
                </g>
              )}
              {FEATHERS.map(([x, y, a, l, w]) => (
                <g key={y} transform={`translate(${x} ${y}) rotate(${a})`}>
                  <path d={feather(l, w)} fill={dawn.fill} stroke={ink(DAWN)} strokeWidth={2.2} strokeLinejoin="round" />
                  <path d={`M4 0 H${l - 4}`} stroke={ink(DAWN)} strokeWidth={1.3} strokeLinecap="round" opacity={0.45} />
                </g>
              ))}
              <path d={COVERTS} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={2.5} strokeLinejoin="round" />
              <path d="M44 103 Q52 106 58 112 M46 116 Q53 118 59 123" stroke={ink(GOLD)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.5} />
              {!g && [[48, 100], [55, 126], [62, 108]].map(([x, y]) => <circle key={y} cx={x} cy={y} r={1.8} fill="#fff" opacity={0.9} />)}
            </g>
          </Anim>
        </g>
      ))}

      {/* The curly topknot, bobbing (behind the head, so it grows out of it) */}
      <Anim cls="pa-ear" origin="25% 100%" delay={0.3}>
        {curls.map(([a, b, c, w0, w1], i) => (
          <path key={i} d={tube(a, b, c, w0, w1)} fill={knot.fill} stroke={ink(TOPKNOT)} strokeWidth={2.2} strokeLinejoin="round" />
        ))}
      </Anim>

      {/* Little orange feet */}
      {[88, 112].map((x) => (
        <path key={x} d={`M${x} 166 V171 M${x - 7} 179 L${x} 171 L${x + 7} 179 M${x} 171 V180`} stroke={FEET} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {/* Plump round body with a cream tummy and little scallops on it (and Quailbell's ribbon round it) */}
      <g className="pa-breathe">
        <path d={outline} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={100} cy={142} rx={31} ry={29} fill={cream.fill} />
        {[[90, 152], [110, 152], [100, 159], [84, 161], [116, 161], [92, 166], [108, 166]].map(([x, y]) => (
          <path key={`${x}${y}`} d={`M${x - 3.5} ${y - 1.5} Q${x} ${y + 3} ${x + 3.5} ${y - 1.5}`} stroke={g ? '#b8b0a6' : '#dcb895'} strokeWidth={2} fill="none" strokeLinecap="round" />
        ))}
        <Shine x={80} y={84} rx={9} ry={5} />
        {stage >= 1 && (
          <path d="M40 108 Q100 140 160 108 L160 115 Q100 147 40 115 Z" clipPath={`url(#${clip})`} fill={RIBBON} stroke={ink(RIBBON)} strokeWidth={2} strokeLinejoin="round" />
        )}
      </g>

      {/* Speckled wings tucked at its sides (hanging lower when grumpy), flapping a little */}
      {!open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="80% 10%" delay={side > 0 ? 0.2 : 0}>
            <g transform={g ? 'translate(0 6)' : undefined}>
              <path d={WING} fill={wing.fill} stroke={ink(WINGC)} strokeWidth={3} strokeLinejoin="round" />
              {SPECKS.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={1.8} fill={CREAM} opacity={0.9} />)}
              <path d="M58 146 Q58 152 55 157" stroke={ink(WINGC)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
            </g>
          </Anim>
        </g>
      ))}

      {/* Quailbell's bow and little golden bell, at the front of its ribbon */}
      {stage >= 1 && (
        <>
          <g transform="translate(100 127)" fill={RIBBON} stroke={ink(RIBBON)} strokeWidth={1.8} strokeLinejoin="round">
            <path d="M0 0 Q-9 -9 -12 -2 Q-10 5 0 0 Z M0 0 Q9 -9 12 -2 Q10 5 0 0 Z" />
            <circle r={3} />
          </g>
          <circle cx={100} cy={137.5} r={6.5} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={1.8} />
          <path d="M94.5 136 H105.5" stroke={ink(GOLD)} strokeWidth={1.4} />
          <circle cx={100} cy={140.5} r={1.5} fill={ink(GOLD)} />
          <circle cx={97.6} cy={134.6} r={1.4} fill="#fff" opacity={0.85} />
        </>
      )}

      {/* Face and a little beak */}
      <CuteFace x={100} y={99} s={0.85} gap={15} mood={mood} mouth={false} blinkDelay={0.7} />
      <path d="M93.5 108 Q100 104.5 106.5 108 Q104.5 113 100 117 Q95.5 113 93.5 108 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={2} strokeLinejoin="round" />

      {open && (
        <>
          <Crown x={100} y={72} />
          {!g && [[32, 62, 8], [168, 58, 7], [100, 22, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
