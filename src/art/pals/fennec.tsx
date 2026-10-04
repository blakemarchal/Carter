// Echo → Bigears → Dawnlistener: a little sandy fennec fox standing side-on with its head turned to face you, and
// very big ears (pink inside, with white fluff) made for listening. A cream chest and muzzle with fluffy white
// cheeks, a black button nose, four slender legs with little round paws on the ground, and a big bushy tail
// with a dark tip, held up at its back.
// Bigears' ears are bigger still and it wears a dawn-coloured scarf (pink, orange and gold, like the sky in the
// morning); Dawnlistener keeps the scarf, glows softly and warmly all round, like the lamp in God's house, with
// a little clay lamp burning on the ground beside it, and it wears a crown.
// Grumpy: dusty and grey, its big ears flat out to the sides, a frown, and its tail drooping to the ground.
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

/** A big ear from its root at (0, 0) up to its rounded tip at (0, -l), w wide at the bottom. */
const earPath = (l: number, w: number) =>
  `M${-w / 2} 4 C${-w * 0.56} ${-l * 0.45} ${-w * 0.24} ${-l * 0.92} 0 ${-l} C${w * 0.24} ${-l * 0.92} ${w * 0.56} ${-l * 0.45} ${w / 2} 4 Z`

const HEAD = smooth([[100, 56], [118, 58], [130, 68], [134, 83], [141, 95], [129, 101], [115, 110], [100, 112], [85, 110], [71, 101], [59, 95], [66, 83], [70, 68], [82, 58]])
// The body side-on, facing left (chest on the left, under the head), with the rump on the right
const BODY = smooth([[84, 121], [95, 111], [118, 112], [144, 110], [160, 116], [168, 130], [164, 145], [149, 152], [125, 151], [104, 155], [88, 147]])
const GROUND = 178.5
// The bushy tail from its root in the rump (hidden behind the body): a plume, widest in the middle, held up at its
// back and tapering to a soft tip, or (grumpy) drooping down to the ground. Its dark tip is the fur beyond a
// zigzag line across it, and two soft strokes of fur run along it.
const TAIL = {
  up: {
    d: smooth([[158, 124], [166, 116], [170, 104], [172, 92], [176, 82], [183, 77], [190, 84], [193, 98], [191, 114], [184, 128], [173, 138], [160, 141]]),
    tip: 'M150 60 H200 V93 L196 96 L192 91.5 L188 96.5 L184 91.5 L180 96.5 L176 91.5 L172 96.5 L168 92 L150 95 Z',
    fur: 'M168 130 Q178 124 181 110 M176 134 Q187 126 188 112',
  },
  down: {
    d: smooth([[158, 128], [170, 128], [181, 134], [189, 145], [193, 158], [193, 169], [189, 177], [182, 171], [178, 161], [172, 151], [163, 145], [157, 141]]),
    tip: 'M165 200 H200 V163 L196 166.5 L192 162 L188 166.5 L184 162 L180 166.5 L176 162.5 L165 165 Z',
    fur: 'M166 136 Q178 140 182 152 M172 132 Q185 137 188 150',
  },
}
/** A slender leg from inside the body down to its round little paw on the ground, centred on x. */
const legPath = (x: number) => `M${x - 6.5} 140 L${x - 5.5} 168 Q${x} 171.5 ${x + 5.5} 168 L${x + 6.5} 140 Z`

export default function Fennec({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [tailClip, scarfGrad, glowGrad] = [`ft${uid}`, `fs${uid}`, `fg${uid}`]
  const FUR = g ? '#c7bba9' : '#f3c283'
  const FAR = g ? '#b5a997' : '#e2ac6c' // the legs on the far side, a shade darker
  const CREAM = g ? '#ebe5dc' : '#fff4e4'
  const EAR_IN = g ? '#d9c3c0' : '#ffc0bd'
  const TIP = g ? '#857a70' : '#8a5a3a' // the dark tip of its tail
  const NOSE = '#3b2a2f'
  const DAWN = g ? ['#c9b3b9', '#d2bfae', '#d6cdb0'] : ['#ff86b0', '#ffa66b', '#ffd36b'] // pink, orange, gold
  const GLOW = '#ffe9a0'
  const fur = useShade(FUR, 0.4, 0.14)
  const far = useShade(FAR, 0.35, 0.15)
  const cream = useShade(CREAM, 0.5, 0.06)
  const earIn = useShade(EAR_IN, 0.4, 0.1)
  const clay = useShade(g ? '#b8a597' : '#d98b5f', 0.35, 0.18)
  const line = ink(FUR)
  const L = [44, 50, 53][Math.min(stage, 2)] // the ears grow
  const W = [30, 33, 34][Math.min(stage, 2)]
  // Big ears up from the top of its head, leaning out; grumpy, flat out to the sides
  const ears: [number, number, number][] = [[80, 66, g ? -74 : -28], [120, 66, g ? 74 : 28]]
  const tail = g ? TAIL.down : TAIL.up
  const scarf = stage >= 1
  const lamp = stage >= 2
  return (
    <g>
      <defs>
        {fur.def}{far.def}{cream.def}{earIn.def}{clay.def}
        <clipPath id={tailClip}><path d={tail.d} /></clipPath>
        <linearGradient id={scarfGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={DAWN[0]} />
          <stop offset="0.55" stopColor={DAWN[1]} />
          <stop offset="1" stopColor={DAWN[2]} />
        </linearGradient>
        <radialGradient id={glowGrad}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.9} />
          <stop offset="0.55" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* A soft warm glow all round it, like lamplight: faint for Bigears, brighter for Dawnlistener */}
      {scarf && !g && <polygon points={ring(112, 106, lamp ? 92 : 78, lamp ? 82 : 70)} fill={`url(#${glowGrad})`} opacity={lamp ? 1 : 0.45} />}

      {/* The bushy tail with its dark tip, at its back; it wags (pivoting at its root) */}
      <Anim cls="pa-tail" origin={g ? '15% 10%' : '0% 80%'}>
        <path d={tail.d} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={tail.tip} fill={TIP} clipPath={`url(#${tailClip})`} />
        <path d={tail.d} fill="none" stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={tail.fur} stroke={g ? '#ddd5ca' : CREAM} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.75} />
      </Anim>

      {/* Four slender legs with round little paws: the far pair a shade darker, just behind the near pair */}
      {([[110, far, FAR], [160, far, FAR], [95, fur, FUR], [145, fur, FUR]] as const).map(([x, f, c]) => (
        <g key={x}>
          <path d={legPath(x)} fill={f.fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
          <ellipse cx={x - 1.5} cy={GROUND - 4.5} rx={7.5} ry={4.5} fill={f.fill} stroke={ink(c)} strokeWidth={2.5} />
        </g>
      ))}

      {/* Body, with a cream chest */}
      <g className="pa-breathe">
        <path d={BODY} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d="M86 122 C84 134 88 146 98 150 C104 140 106 126 100 114 Z" fill={cream.fill} />
        <ellipse cx={130} cy={147} rx={22} ry={4.5} fill={CREAM} opacity={0.5} />
        <Shine x={138} y={118} rx={8} ry={3.5} rot={-8} />
      </g>

      {/* The dawn-coloured scarf round its neck, its ends blowing back over its shoulder */}
      {scarf && (
        <g stroke={g ? '#9c8d8f' : '#d9607a'} strokeWidth={2.2} strokeLinejoin="round">
          <path d="M124 110 Q138 112 147 124 L140 129 Q134 119 122 117 Z" fill={`url(#${scarfGrad})`} />
          <path d="M124 112 Q134 120 136 133 L128 134 Q127 123 120 117 Z" fill={`url(#${scarfGrad})`} />
          <path d="M76 104 Q100 124 126 104 L127 113 Q100 134 74 113 Z" fill={`url(#${scarfGrad})`} />
          <circle cx={124} cy={112} r={5} fill={DAWN[1]} />
        </g>
      )}

      {/* Very big ears (behind the head, so they grow out of it); they twitch, listening */}
      {ears.map(([x, y, a], i) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${a})`}>
          <Anim cls="pa-ear" origin="50% 100%" delay={i ? 0.7 : 0}>
            <path d={earPath(L, W)} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
            <path d={earPath(L - 12, W - 13)} transform="translate(0 -3)" fill={earIn.fill} />
            <path d={`M-6 -6 Q-4 ${-L * 0.35} -1 ${-L * 0.55} M6 -6 Q4 ${-L * 0.32} 1 ${-L * 0.5} M0 -4 V${-L * 0.4}`} stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.85} />
          </Anim>
        </g>
      ))}

      {/* Round head with fluffy white cheeks */}
      <path d={HEAD} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M100 88 C90 88 76 90 66 95 C74 100 82 106 90 108 C95 110 105 110 110 108 C118 106 126 100 134 95 C124 90 110 88 100 88 Z" fill={cream.fill} />
      <Shine x={84} y={66} rx={8.5} ry={4.5} />
      <CuteFace x={100} y={81} s={0.84} gap={15} mood={mood} mouth={false} blinkDelay={1.6} />
      {/* A little pointed muzzle with a black button nose and a smile (a frown when grumpy) */}
      <path d="M92 92 Q100 89 108 92 Q107 100 100 104 Q93 100 92 92 Z" fill={cream.fill} stroke={ink(CREAM)} strokeWidth={1.6} strokeOpacity={0.45} strokeLinejoin="round" />
      <ellipse cx={100} cy={100.5} rx={4.2} ry={3.3} fill={NOSE} />
      <circle cx={98.6} cy={99.4} r={1.1} fill="#fff" opacity={0.8} />
      <path d={g ? 'M95.5 109 Q100 105 104.5 109' : 'M100 104 V105.5 M96 106 Q98 108.5 100 105.5 Q102 108.5 104 106'}
        stroke="#7a4a3a" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dawnlistener's little clay lamp, burning on the ground beside it */}
      {lamp && (
        <g>
          {!g && (
            <Anim cls="pa-twinkle">
              <polygon points={ring(33, 156, 14)} fill={GLOW} opacity={0.6} />
            </Anim>
          )}
          <path d="M33 150 Q39 157 35.5 162 Q33 164 30.5 162 Q27 157 33 150 Z" fill={g ? '#c9bfa6' : '#ff9b4a'} />
          <path d="M33 154.5 Q35.5 158.5 34 161 Q33 162 32 161 Q30.5 158.5 33 154.5 Z" fill={g ? '#e6dfcc' : '#ffe680'} />
          <path d={`M34 162 L44 166 L44 172 L33 167 Q30 165 34 162 Z M42 165 Q50 160 60 161 Q72 162 72 169 Q71 ${GROUND - 1} 57 ${GROUND - 1} Q45 ${GROUND - 1} 42 172 Z`}
            fill={clay.fill} stroke={ink(g ? '#b8a597' : '#d98b5f')} strokeWidth={2.2} strokeLinejoin="round" />
          <ellipse cx={58} cy={164.5} rx={5} ry={1.8} fill={ink(g ? '#b8a597' : '#d98b5f')} opacity={0.8} />
          <path d="M71 165 Q78 165 77 170 Q76 174 71 173" stroke={ink(g ? '#b8a597' : '#d98b5f')} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>
      )}

      {lamp && (
        <>
          <Crown x={100} y={57} />
          {!g && [[24, 60, 7], [176, 58, 7], [182, 158, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
