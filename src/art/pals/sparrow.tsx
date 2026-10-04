// Chirp → Songsparrow → Skysinger: a little round brown sparrow standing side-on (facing left) with its head turned
// to face you: a warm brown cap, a pale cream face and chest, a small golden beak, a wing folded at its side (dark
// flight feathers under brown front feathers with two white bars), the tip of its other wing peeping over its back,
// a perky tail at its back, and two thin legs with little feet on the ground.
// Songsparrow sings (its beak open, music notes bobbing up beside it) and has a little pink heart on its chest;
// Skysinger sings more notes and glows softly all round, and it wears a crown.
// Grumpy: all fluffed up and grey, with a cross frown.
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

/** The round body, puffed out (`puff` > 1) when grumpy, with a fluffy edge of little bumps. */
function bodyPath(puff: number) {
  const base: Pt[] = [[84, 112], [106, 106], [128, 108], [146, 117], [156, 132], [153, 149], [140, 161], [118, 167], [96, 166], [80, 157], [72, 141], [74, 124]]
  const c: Pt = [114, 137]
  const ps = base.map(([x, y]) => [c[0] + (x - c[0]) * puff, c[1] + (y - c[1]) * puff] as Pt)
  if (puff === 1) return smooth(ps)
  // Fluffed up: a little bump between each pair of points
  const fluffy: Pt[] = []
  ps.forEach((p, i) => {
    const q = ps[(i + 1) % ps.length]
    const m: Pt = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    const out = Math.hypot(m[0] - c[0], m[1] - c[1])
    fluffy.push(p, [m[0] + ((m[0] - c[0]) / out) * 3.5, m[1] + ((m[1] - c[1]) / out) * 3.5])
  })
  return smooth(fluffy)
}

// Its wing, folded at its side: the long dark flight feathers out to the wingtip, under the rounded feathers at the
// front of the wing, which have two white bars across them (the bars a sparrow has on its wings)
const FLIGHT = smooth([[116, 117], [141, 116], [158, 128], [171, 146], [158, 151], [137, 151], [121, 148], [113, 133]])
const FLIGHT_LINES = 'M146 129 Q153 139 151 148 M157 136 Q163 142 161 148'
const COVERTS = smooth([[103, 119], [121, 113], [134, 117], [139, 131], [135, 147], [118, 147], [104, 139], [99, 129]])
const BARS = 'M131.5 120 Q136 132 131.5 144 M119 117 Q123.5 129 119.5 142'
// The tip of its far wing, peeping over its back by its tail
const FAR_WING = smooth([[138, 114], [152, 116], [166, 126], [176, 140], [166, 141], [152, 132], [140, 124]])
// Its tail: three feathers fanned out at its back, tipped up
const TAIL: [number, number, number][] = [[-34, 42, 11], [-22, 47, 12], [-10, 42, 11]] // [angle, length, width]
/** A tail feather from its root at (0, 0), pointing right, l long and w wide, with a squared-off tip. */
const feather = (l: number, w: number) =>
  `M0 ${-w * 0.4} C${l * 0.4} ${-w * 0.6} ${l * 0.75} ${-w * 0.55} ${l} ${-w * 0.5} Q${l + 2.5} 0 ${l} ${w * 0.5} C${l * 0.75} ${w * 0.55} ${l * 0.4} ${w * 0.6} 0 ${w * 0.4} Z`

/** A music note (♪) with its head at (0, 0). */
const NOTE = 'M2.6 0.5 V-21 Q6 -14 13 -12.5 Q15.5 -8.5 12.5 -4.5 Q12.5 -9.5 5.4 -12.5 V0.5 Z'
/** Two notes joined at the top (♫), their heads at (0, 0) and (14, -3). */
const NOTES2 = 'M2.6 0.5 V-21 L16.6 -24 V-2.5 H13.8 V-17.6 L5.4 -15.8 V0.5 Z'

export default function Sparrow({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `sg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const BROWN = g ? '#a9a19b' : '#bd8656'
  const CAP = g ? '#988f89' : '#a96a3b'
  const DARK = g ? '#8a837e' : '#7d4f2c'
  const CREAM = g ? '#e4e0da' : '#fbecd6'
  const TAILC = g ? '#958d87' : '#9a6538'
  const BEAK = g ? '#d6c3a2' : '#f2b54e'
  const LEGS = g ? '#a89c94' : '#c98d6a'
  const HEART = g ? '#c9a9b6' : '#ff6f9f'
  const NOTEC = '#ff5d9e' // Love pink
  const GLOW = '#ffd3e6'
  const brown = useShade(BROWN, 0.4, 0.15)
  const cap = useShade(CAP, 0.4, 0.15)
  const cream = useShade(CREAM, 0.5, 0.06)
  const wing = useShade(BROWN, 0.3, 0.18)
  const dark = useShade(DARK, 0.35, 0.15)
  const tail = useShade(TAILC, 0.35, 0.15)
  const line = ink(BROWN)
  const sing = st >= 1 && !g
  return (
    <g>
      <defs>
        {brown.def}{cap.def}{cream.def}{wing.def}{dark.def}{tail.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.9} />
          <stop offset="0.55" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Skysinger's soft glow all round it */}
      {st >= 2 && !g && <polygon points={ring(112, 118, 90, 78)} fill={`url(#${glowId})`} />}

      {/* Its perky tail at its back, wagging (fanned out wider when it's fluffed up) */}
      <Anim cls="pa-tail" origin="0% 50%">
        {TAIL.map(([a, l, w], i) => (
          <path key={i} d={feather(l, w)} transform={`translate(146 136) rotate(${a + (g ? (i - 1) * 8 : 0)})`} fill={tail.fill} stroke={ink(TAILC)} strokeWidth={2.4} strokeLinejoin="round" />
        ))}
      </Anim>

      {/* Two thin legs, with three toes in front and one behind */}
      {[[103, 0], [116, -1]].map(([x, d]) => (
        <path key={x} d={`M${x} 160 V${172 + d} M${x - 10} ${177.5 + d} L${x} ${172 + d} L${x - 3} ${179 + d} M${x} ${172 + d} L${x + 7} ${177 + d}`}
          stroke={LEGS} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {/* The tip of its far wing, peeping over its back */}
      <path d={FAR_WING} fill={dark.fill} stroke={ink(DARK)} strokeWidth={2.4} strokeLinejoin="round" />

      {/* Its round body, with a pale chest (Songsparrow's little heart on it) */}
      <g className="pa-breathe">
        <path d={bodyPath(g ? 1.08 : 1)} fill={brown.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d="M78 122 C88 116 102 120 108 132 C114 146 110 160 98 165 C86 163 77 154 74 142 C73 134 74 127 78 122 Z" fill={cream.fill} />
        {st >= 1 && <path d="M93 150 C83 143 86 134 92 136 C94 136.5 95 138 95.5 139.5 C96 138 97.5 136.5 99.5 136.5 C105 137 104 146 93 150 Z" fill={HEART} stroke={ink(HEART)} strokeWidth={1.6} strokeLinejoin="round" />}
      </g>

      {/* Its wing folded at its side: dark flight feathers out to the tip, under the front feathers with their white bars */}
      <path d={FLIGHT} fill={dark.fill} stroke={ink(DARK)} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={FLIGHT_LINES} stroke={ink(DARK)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d={COVERTS} fill={wing.fill} stroke={ink(BROWN)} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={BARS} stroke={g ? '#f2f0ec' : '#fffaf0'} strokeWidth={3} fill="none" strokeLinecap="round" />

      {/* Its round head: a warm brown cap and a pale face (grumpy, a few ruffled feathers stick up behind it) */}
      {g && (
        <path d="M84 64 L80 52 L89 59 L93 47 L99 58 L104 49 L106 59 L115 54 L113 64 Z" fill={cap.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      )}
      <circle cx={100} cy={85} r={28} fill={cap.fill} stroke={line} strokeWidth={3} />
      <path d="M73.5 89 C75 79 86 76 100 81 C114 76 125 79 126.5 89 C127 102 116 112.5 100 113 C84 112.5 73 102 73.5 89 Z" fill={cream.fill} />
      <Shine x={88} y={68} rx={8} ry={4.4} />
      <CuteFace x={100} y={89} s={0.84} gap={15} mood={mood} mouth={false} blinkDelay={0.5} />

      {/* A small golden beak: open when it sings */}
      {sing ? (
        <g stroke={ink(BEAK)} strokeWidth={1.8} strokeLinejoin="round">
          <path d="M95.5 102.5 Q100 101 104.5 102.5 Q103 107 100 108.5 Q97 107 95.5 102.5 Z" fill="#c0455f" />
          <path d="M93.5 98 Q100 95 106.5 98 Q104.5 101.5 100 103 Q95.5 101.5 93.5 98 Z" fill={BEAK} />
        </g>
      ) : (
        <path d="M94 98 Q100 95 106 98 Q104 103 100 106.5 Q96 103 94 98 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={1.8} strokeLinejoin="round" />
      )}
      {g && <path d="M93 112 Q100 108 107 112" stroke="#2b2140" strokeWidth={2.4} fill="none" strokeLinecap="round" />}

      {/* It sings: music notes bobbing up beside it (more of them for Skysinger) */}
      {sing && (
        <>
          <Anim cls="pa-float" delay={0.2}>
            <g transform="translate(52 76) rotate(-10)">
              <path d={NOTE} fill={NOTEC} stroke={ink(NOTEC)} strokeWidth={1.4} strokeLinejoin="round" />
              <ellipse cx={0} cy={0.5} rx={5.4} ry={4} transform="rotate(-20 0 0.5)" fill={NOTEC} stroke={ink(NOTEC)} strokeWidth={1.4} />
            </g>
          </Anim>
          {st >= 2 && (
            <Anim cls="pa-float" delay={1.1}>
              <g transform="translate(30 112) rotate(-8)">
                <path d={NOTES2} fill={NOTEC} stroke={ink(NOTEC)} strokeWidth={1.4} strokeLinejoin="round" />
                <ellipse cx={0} cy={0.5} rx={5.4} ry={4} transform="rotate(-20 0 0.5)" fill={NOTEC} stroke={ink(NOTEC)} strokeWidth={1.4} />
                <ellipse cx={14} cy={-2.5} rx={5.4} ry={4} transform="rotate(-20 14 -2.5)" fill={NOTEC} stroke={ink(NOTEC)} strokeWidth={1.4} />
              </g>
            </Anim>
          )}
        </>
      )}

      {st >= 2 && (
        <>
          <Crown x={100} y={60} />
          {!g && [[166, 52, 7], [178, 92, 5], [36, 160, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
