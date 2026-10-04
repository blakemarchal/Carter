// Lily → Lotusbloom → Nilegrace: a pink water lily on the Nile, with her little face in the golden middle of the
// blossom: pointed petals rise behind it like a bonnet and cup round it like a skirt. She sits on a round lily pad
// (with its notch) floating on the water, bobbing gently, with a little splash beside her.
// Lotusbloom opens a second ring of petals and has a dewdrop on one; Nilegrace is in full bloom, glowing softly,
// with a crown. Grumpy, she goes pale and dull and her petals droop.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

/** A pointed lotus petal standing up from (0, 0), l long and w wide. */
const petal = (l: number, w: number) =>
  `M0 0 C${pt(-w * 0.62, -l * 0.22)} ${pt(-w * 0.58, -l * 0.72)} 0 ${-l} C${pt(w * 0.58, -l * 0.72)} ${pt(w * 0.62, -l * 0.22)} 0 0 Z`

type Petal = [angle: number, length: number]

// The petals behind her face (a bonnet), from (100, 134), and the ones cupped round in front (a skirt), from
// (100, 160): [degrees from straight up, length], outside ones first. More of them open at each stage.
const BACK: Petal[][] = [
  [[-46, 58], [46, 58], [-23, 66], [23, 66], [0, 72]],
  [[-56, 56], [56, 56], [-37, 64], [37, 64], [-18, 70], [18, 70], [0, 74]],
  [[-66, 54], [66, 54], [-49, 62], [49, 62], [-32, 68], [32, 68], [-16, 73], [16, 73], [0, 77]],
]
const BACK_IN: Petal[][] = [[], [[-28, 52], [28, 52], [0, 58]], [[-40, 52], [40, 52], [-20, 58], [20, 58], [0, 62]]]
const SKIRT: Petal[][] = [
  [[-92, 46], [92, 46], [-62, 48], [62, 48], [-36, 44], [36, 44]],
  [[-100, 46], [100, 46], [-76, 48], [76, 48], [-54, 48], [54, 48], [-34, 44], [34, 44]],
  [[-106, 48], [106, 48], [-86, 50], [86, 50], [-66, 50], [66, 50], [-48, 48], [48, 48], [-31, 44], [31, 44]],
]

export default function Lily({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [outer, inner, glow] = [`lo${uid}`, `li${uid}`, `lg${uid}`]
  const PINK = g ? '#c4abb7' : '#ff8fc2'
  const PALE = g ? '#ece5e8' : '#fff5f9'
  const INNER = g ? '#d6c6ce' : '#ffb8d8' // the inner ring of petals, softer
  const HEART = g ? '#ebe3c6' : '#ffeea0' // the golden middle, where her face is
  const STAMEN = g ? '#c7b98c' : '#ffb92e'
  const PAD = g ? '#9db09a' : '#5dbb63'
  const WATER = g ? '#cdd8df' : '#c4e8ff'
  const WATER_LINE = g ? '#97a8b4' : '#6cb8e8'
  const heart = useShade(HEART, 0.5, 0.1)
  const pad = useShade(PAD, 0.35, 0.15)
  const water = useShade(WATER, 0.5, 0.06)
  const st = Math.min(stage, 2)
  // Grumpy, her petals droop: they open out further and hang down (but no further than `most` degrees).
  const droop = ([a, l]: Petal, k: number, add: number, most: number): Petal =>
    (g ? [Math.sign(a) * Math.min(most, Math.abs(a) * k + add), l * 0.9] : [a, l])
  const petals = (list: Petal[], x: number, y: number, fill: string, w: number, k: number, add: number, most = 112) =>
    list.map((p, i) => {
      const [a, l] = droop(p, k, add, most)
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
          <path d={petal(l, w)} fill={fill} stroke={ink(PINK)} strokeWidth={2.4} strokeLinejoin="round" />
          <path d={`M0 ${-l * 0.2} L0 ${-l * 0.7}`} stroke={ink(PINK)} strokeWidth={1.5} strokeLinecap="round" opacity={0.35} />
        </g>
      )
    })

  return (
    <g>
      <defs>
        {heart.def}{pad.def}{water.def}
        {/* (each petal is drawn standing up and turned into place, so these run from its base to its tip) */}
        <linearGradient id={outer} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0.1" stopColor={PALE} />
          <stop offset="1" stopColor={PINK} />
        </linearGradient>
        <linearGradient id={inner} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0.2" stopColor="#fff" />
          <stop offset="1" stopColor={INNER} />
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0.3" stopColor="#fff2b0" stopOpacity={0.9} />
          <stop offset="1" stopColor="#ffd6ea" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Nilegrace's soft glow */}
      {st >= 2 && !g && <circle cx={100} cy={106} r={86} fill={`url(#${glow})`} />}

      {/* The river: still water round the lily pad, and a little splash beside it */}
      <ellipse cx={100} cy={169} rx={84} ry={15} fill={water.fill} />
      <path d="M30 172 Q100 190 170 172" stroke={WATER_LINE} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
      <Anim cls="pa-twinkle" delay={0.5}>
        <g fill={g ? '#e4ebef' : '#e3f5ff'} stroke={WATER_LINE} strokeWidth={2} strokeLinejoin="round">
          <path d="M22 171 Q22 160 27 164 Q29 148 35 161 Q39 151 42 163 Q46 159 46 171 Z" />
          <path d="M23 147 Q26.5 140 29 147 A3 3 0 0 1 23 147 Z" />
          <path d="M37 143 Q40.5 136 43 143 A3 3 0 0 1 37 143 Z" />
          <path d="M48 151 Q50.5 146 52 151 A2.2 2.2 0 0 1 48 151 Z" />
        </g>
      </Anim>

      <g className="pa-float">
        {/* The lily pad, with its notch at the front */}
        <path d="M100 165 L148.9 173.6 A62 14 0 1 0 134.7 176.6 Z" fill={pad.fill} stroke={ink(PAD)} strokeWidth={3} strokeLinejoin="round" />
        <path d="M100 165 L46 160 M100 165 L152 158 M100 165 L58 175 M100 165 L114 179" stroke={ink(PAD)} strokeWidth={1.8} strokeLinecap="round" opacity={0.45} />

        <g className="pa-breathe">
          {/* Petals behind her face, then the golden middle with a fringe of stamens peeping over it */}
          {petals(BACK[st], 100, 134, `url(#${outer})`, 26, 1.5, 14)}
          {petals(BACK_IN[st], 100, 134, `url(#${inner})`, 24, 1.5, 12)}
          {Array.from({ length: 13 }, (_, i) => {
            const a = (-162 + i * 12) * (Math.PI / 180)
            const r = i % 2 ? 29.5 : 31.5
            const [x0, y0, x1, y1] = [100 + Math.cos(a) * 22, 106 + Math.sin(a) * 22, 100 + Math.cos(a) * r, 106 + Math.sin(a) * r]
            return (
              <g key={i}>
                <path d={`M${pt(x0, y0)} L${pt(x1, y1)}`} stroke={STAMEN} strokeWidth={1.4} strokeLinecap="round" />
                <circle cx={x1} cy={y1} r={1.5} fill={STAMEN} />
              </g>
            )
          })}
          <circle cx={100} cy={106} r={27} fill={heart.fill} stroke={ink(HEART)} strokeWidth={2.5} />
          <Shine x={88} y={90} rx={7} ry={4} />

          {/* The skirt of petals cupped round in front */}
          {petals(SKIRT[st], 100, 160, `url(#${outer})`, 27, 1.18, 16)}
        </g>

        <CuteFace x={100} y={106} s={0.88} gap={14} mood={mood} blinkDelay={1.6} />

        {/* Lotusbloom's dewdrop, on a petal */}
        {st >= 1 && (
          <g transform="translate(131 143)">
            <path d="M0 -6 Q5 0 4 3 A4.2 4.2 0 0 1 -4 3 Q-5 0 0 -6 Z" fill={g ? '#e5ecf0' : '#dff4ff'} stroke={WATER_LINE} strokeWidth={1.5} />
            <circle cx={-1.3} cy={1.3} r={1.2} fill="#fff" />
          </g>
        )}

        {st >= 2 && <Crown x={100} y={81} />}
      </g>

      {st >= 2 && !g && [[28, 52, 8], [172, 46, 7], [178, 126, 6]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
