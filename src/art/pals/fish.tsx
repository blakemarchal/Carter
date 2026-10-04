// Splash → Flipfin → Gleamfin: a bright orange, round and chubby little fish leaping for joy out of a little pool,
// turned to face you, with the water splashing up round the bottom of it and drops flying. Big friendly eyes, rosy
// cheeks and a smile, a pale yellow tummy, a little fin at each side, a fin on its back and a forked tail fin at
// the back; a few bubbles float up round it.
// Flipfin's scales shimmer and its fins grow bigger, with pink-tipped edges that sparkle; Gleamfin gleams gold
// all over and glows softly, with little stars twinkling round it, and it wears a crown.
// Grumpy: dull grey-green, its fins drooping, pouty lips and cross brows (and its water a duller blue).
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, starPath, twinklePath, useShade } from '../kit'

/** An ellipse's outline as polygon points. Soft glows are drawn as polygons, so the coloring page (which turns
 *  every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A water drop pointing up, centred on (x, y). */
const drop = (x: number, y: number, s: number) =>
  `M${x} ${y - 9 * s} C${x + 5 * s} ${y - 3 * s} ${x + 7 * s} ${y + 2 * s} ${x + 7 * s} ${y + 4 * s} A${7 * s} ${7 * s} 0 0 1 ${x - 7 * s} ${y + 4 * s} C${x - 7 * s} ${y + 2 * s} ${x - 5 * s} ${y - 3 * s} ${x} ${y - 9 * s}Z`

/** A finger of splashing water rising from its base at (x, y), h tall and w wide, its round tip leaning by `lean`. */
function tongue(x: number, y: number, h: number, w: number, lean = 0) {
  const r = w * 0.26, tx = x + lean, ty = y - h + r
  return `M${pt(x - w / 2, y)} C${pt(x - w / 2, y - h * 0.4)} ${pt(tx - r, ty + h * 0.35)} ${pt(tx - r, ty)} A${r} ${r} 0 0 1 ${pt(tx + r, ty)} C${pt(tx + r, ty + h * 0.35)} ${pt(x + w / 2, y - h * 0.4)} ${pt(x + w / 2, y)} Z`
}

// The round, chubby body, tipped up at the front (on the left) as it leaps
const BX = 108, BY = 104, BRX = 50, BRY = 45, TILT = 8
// Fins, each drawn from its root at (0, 0) pointing right, with soft scallops round its edge and faint rays
const SIDE_FIN = 'M0 -6 C8 -12 18 -17 27 -15 C31 -14 32 -10 30 -7 C33 -4 33 1 30 3 C32 6 31 10 27 11 C18 12 8 9 0 6 C-3 3 -3 -3 0 -6 Z'
const SIDE_RAYS = 'M4 -3 L26 -11 M5 0 L29 -2 M4 3 L26 7'
const TAIL_FIN = 'M-8 -10 C4 -11 10 -13 16 -20 C24 -30 34 -36 44 -36 C47 -28 44 -18 38 -10 C35 -5 33 -2 32 0 C33 2 35 5 38 10 C44 18 47 28 44 36 C34 36 24 30 16 20 C10 13 4 11 -8 10 Z'
const TAIL_RAYS = 'M8 -4 Q22 -14 37 -28 M8 4 Q22 14 37 28 M12 -1 Q24 -6 33 -12 M12 1 Q24 6 33 12'
// The fin on its back, from its root along the top of the body (0, 0) → (48, 0), a sail with a scalloped back edge
const BACK_FIN = 'M-2 3 C0 -12 8 -26 20 -33 C24 -27 27 -24 32 -22 C32 -16 36 -12 41 -11 C41 -5 44 -1 50 3 Z'
const BACK_RAYS = 'M8 0 L19 -26 M18 0 L29 -18 M29 0 L38 -9'
// The splash it leaps out of: a little pool, and a crown of water splashing up round the bottom of it, its back
// behind the fish and its front in front. Each is drawn as one shape (outlines first, then the water over the
// lines inside).
const POOL = 'M44 174 Q55 168 66 174 T88 174 T110 174 T132 174 T154 174 Q162 177 168 174 A62 12 0 0 1 44 174 Z'
const SPLASH_BACK = [tongue(64, 168, 38, 13, -15), tongue(50, 172, 21, 11, -10), tongue(146, 168, 38, 13, 15), tongue(160, 172, 21, 11, 10),
  tongue(80, 162, 30, 14, -7), tongue(130, 162, 30, 14, 7)]
const SPLASH_FRONT = [POOL,
  'M68 174 C69 164 72 157 78 152 Q84.5 145 91 151 Q97.5 143 104.5 150 Q111.5 142.5 118.5 150 Q125 144.5 131.5 151.5 C137 156 141 164 142 174 Z']
const RIPPLES = 'M56 181 Q68 178 80 181 M128 182 Q141 179 154 182 M84 164 Q90 158 97 160 M112 160 Q119 158 125 163'
// Drops flying off: [x, y, size, tilt]
const DROPS: [number, number, number, number][] = [[38, 150, 0.7, -40], [172, 146, 0.7, 40], [188, 128, 0.5, 55]]
const BUBBLES: [number, number, number][][] = [
  [[34, 92, 6], [46, 70, 3.5]],
  [[32, 90, 7], [46, 66, 4], [182, 54, 4.5]],
  [[30, 96, 7], [44, 72, 4.5], [184, 54, 5]],
]

export default function Fish({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.min(stage, 2)
  const gold = st >= 2
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [clipId, finGrad, glowGrad] = [`fc${uid}`, `ff${uid}`, `fg${uid}`]
  const ORANGE = g ? '#97a38e' : gold ? '#ffaa2b' : '#ff9433'
  const BELLY = g ? '#d5dbc9' : gold ? '#fff0b0' : '#ffe1a6'
  const FIN = g ? '#a9b39e' : gold ? '#ffc23d' : '#ffa94a'
  const FIN_TIP = g ? '#c9cfbe' : gold ? '#fff3b0' : st >= 1 ? '#ffc7de' : '#ffd27a'
  const WATER = g ? '#b8d5e8' : '#a6ddff'
  const WATER_LINE = g ? '#729fc0' : '#5aa9e6'
  const SCALE = g ? '#b9c2ad' : gold ? '#fff2a8' : '#ffd08a'
  const GLOW = '#ffe27a'
  const body = useShade(ORANGE, 0.4, 0.16)
  const belly = useShade(BELLY, 0.5, 0.06)
  const water = useShade(WATER, 0.5, 0.1)
  const line = ink(ORANGE)
  const finLine = ink(FIN)
  const fs = [0.9, 1.05, 1.15][st] // fin size
  const ts = [0.62, 0.72, 0.8][st] // tail fin size
  const bodyTf = `rotate(${TILT} ${BX} ${BY})`
  const finProps = { fill: `url(#${finGrad})`, stroke: finLine, strokeWidth: 2.6, strokeLinejoin: 'round' as const }
  const rays = (d: string) => <path d={d} stroke={finLine} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.45} />
  const splash = (parts: string[]) => (
    <>
      <g fill={water.fill} stroke={WATER_LINE} strokeWidth={5} strokeLinejoin="round">{parts.map((d, i) => <path key={i} d={d} />)}</g>
      <g fill={water.fill}>{parts.map((d, i) => <path key={i} d={d} />)}</g>
    </>
  )
  const sparkle = (x: number, y: number, r: number, delay: number) => (
    <Anim key={`${x} ${y}`} cls="pa-twinkle" delay={delay}><path d={twinklePath(x, y, r)} fill="#fff" /></Anim>
  )

  return (
    <g>
      <defs>
        {body.def}{belly.def}{water.def}
        <clipPath id={clipId}><ellipse cx={BX} cy={BY} rx={BRX} ry={BRY} transform={bodyTf} /></clipPath>
        <linearGradient id={finGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={FIN} />
          <stop offset="0.5" stopColor={FIN} />
          <stop offset="1" stopColor={FIN_TIP} />
        </linearGradient>
        <radialGradient id={glowGrad}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.9} />
          <stop offset="0.55" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Gleamfin's soft golden glow */}
      {gold && !g && <polygon points={ring(108, 104, 88, 80)} fill={`url(#${glowGrad})`} />}

      {/* Bubbles floating up */}
      {BUBBLES[st].map(([x, y, r], i) => (
        <Anim key={i} cls="pa-float" delay={i * 0.6}>
          <circle cx={x} cy={y} r={r} fill={g ? '#eef5fa' : '#eef9ff'} stroke={g ? '#93b8d3' : '#7cc6ff'} strokeWidth={2.2} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill="#fff" />
        </Anim>
      ))}

      {/* The back of the splash */}
      {splash(SPLASH_BACK)}

      {/* The fin on its far side, peeking out on the left (held up, or drooping when grumpy) */}
      <g transform={`translate(66 118) scale(-1 1) rotate(${g ? 32 : -24}) scale(${fs})`}>
        <Anim cls="pa-wing" origin="0% 50%">
          <path d={SIDE_FIN} {...finProps} />
          {rays(SIDE_RAYS)}
        </Anim>
      </g>

      {/* The tail fin at its back, flicking (drooping when grumpy) */}
      <g transform={`translate(150 110) rotate(${g ? 22 : -8}) scale(${ts})`}>
        <Anim cls="pa-tail" origin="0% 50%">
          <path d={TAIL_FIN} {...finProps} strokeWidth={2.6 / ts} />
          {rays(TAIL_RAYS)}
        </Anim>
      </g>

      {/* The fin on its back */}
      <g transform={`translate(104 66) rotate(20) scale(${fs})`}>
        <path d={BACK_FIN} {...finProps} strokeWidth={2.6 / fs} />
        {rays(BACK_RAYS)}
      </g>

      {/* The round body, with a pale tummy and (Flipfin, Gleamfin) shimmering scales */}
      <g className="pa-breathe">
        <ellipse cx={BX} cy={BY} rx={BRX} ry={BRY} transform={bodyTf} fill={body.fill} stroke={line} strokeWidth={3} />
        <g clipPath={`url(#${clipId})`}>
          <ellipse cx={100} cy={156} rx={58} ry={32} fill={belly.fill} />
          {/* (rows of scales over its back, fading out towards its face) */}
          {st >= 1 && Array.from({ length: 7 }, (_, r) => Array.from({ length: 6 }, (_, c) => {
            const x = 110 + c * 10 + (r % 2) * 5, y = 62 + r * 11
            const fade = Math.min(1, (x - 112 + Math.abs(y - 100) * 0.25) / 22)
            return fade > 0.1 && <path key={`${r}-${c}`} d={`M${x} ${y - 5.5} A5.5 5.5 0 0 1 ${x} ${y + 5.5}`} stroke={SCALE} strokeWidth={2.3} fill="none" strokeLinecap="round" opacity={0.9 * fade} />
          }))}
        </g>
        <ellipse cx={100} cy={156} rx={58} ry={32} fill="none" stroke={ink(BELLY)} strokeWidth={2} clipPath={`url(#${clipId})`} opacity={0.6} />
        <Shine x={80} y={74} rx={12} ry={6.5} rot={-35} />
      </g>

      {/* A gill line behind its cheek, and the fin on its near side */}
      <path d="M136 84 Q143 100 137 116" stroke={line} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.55} />
      <g transform={`translate(136 128) rotate(${g ? 52 : 22}) scale(${fs * 0.78})`}>
        <Anim cls="pa-wing" origin="0% 50%" delay={0.4}>
          <path d={SIDE_FIN} {...finProps} strokeWidth={2.6 / (fs * 0.78)} />
          {rays(SIDE_RAYS)}
        </Anim>
      </g>

      {/* Big friendly eyes, and a smile (pouty lips when grumpy) */}
      <CuteFace x={100} y={97} s={1} gap={15} mood={mood} mouth={!g} blinkDelay={0.7} />
      {g && (
        <g stroke="#2b2140" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
          <path d="M93.5 113.5 Q96 108.5 100 110 Q104 108.5 106.5 113.5 Q103.5 117.5 100 117 Q96.5 117.5 93.5 113.5 Z" fill="#d98c96" />
          <path d="M95 113 Q100 111 105 113" fill="none" />
        </g>
      )}

      {/* The front of the splash, round the bottom of it, and the pool */}
      {splash(SPLASH_FRONT)}
      <path d={RIPPLES} stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.8} />

      {/* Drops of water flicking off it */}
      {DROPS.map(([x, y, k, a], i) => (
        <path key={i} d={drop(x, y, k)} transform={`rotate(${a} ${x} ${y})`} fill={water.fill} stroke={WATER_LINE} strokeWidth={2} />
      ))}

      {/* Sparkles on Flipfin's and Gleamfin's fins */}
      {st >= 1 && !g && [sparkle(40, 104, 5, 0), sparkle(178, 96, 5.5, 0.5), sparkle(140, 42, 4.5, 1)]}

      {gold && (
        <>
          <g transform="rotate(-12 88 64)"><Crown x={88} y={64} /></g>
          {!g && [[24, 60, 7], [170, 30, 6], [186, 166, 5.5], [20, 140, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
              <path d={starPath(x, y, r)} fill="#ffd84a" stroke="#f0b400" strokeWidth={1.2} strokeLinejoin="round" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
