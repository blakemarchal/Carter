// Barley → Sheafhop → Harvestglow: a soft brown hare sitting up, turned a little to your left with its head
// facing you: two long ears (pink inside, with dark tips) standing up from the top of its head, a cream tummy
// and muzzle, a pink nose, front paws held up at its chest, long back feet flat on the ground (the near one
// long in front of it, the far one peeking out behind) and a little round white tail at its back.
// Sheafhop hugs a little sheaf of golden barley, tied with a red ribbon, its ears of barley glowing softly;
// Harvestglow's sheaf is bigger, the hare itself glows a warm gold all round, and it wears a crown.
// Grumpy: dusty and grey, its ears drooping down at the sides and a frown on its face.
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

/** A long ear from its root at (0, 0) up to its rounded tip at (0, -l), w wide. */
const earPath = (l: number, w: number) =>
  `M${-w * 0.42} 2 C${-w * 0.62} ${-l * 0.35} ${-w * 0.55} ${-l * 0.82} 0 ${-l} C${w * 0.55} ${-l * 0.82} ${w * 0.62} ${-l * 0.35} ${w * 0.42} 2 Z`

const HEAD = smooth([[100, 53], [121, 56], [133, 70], [136, 87], [130, 103], [114, 113], [100, 114], [86, 113], [70, 103], [64, 87], [67, 70], [79, 56]])
// The body sitting up, turned a little to the left: chest on the left under the head, back and rump on the right
const BODY = smooth([[84, 106], [73, 122], [71, 146], [79, 165], [98, 175], [124, 176], [143, 168], [149, 148], [143, 124], [128, 108], [108, 102]])
// The near haunch (the big round thigh), and the long back foot lying flat in front of it
const THIGH = 'M103 172 C96 156 103 136 121 132 C139 128 151 143 149 158 C148 168 140 176 128 177 Z'
const FOOT = 'M83 178 C80 172 85 167 93 167 L138 168 C145 168 148 173 145 178 Z'
const GROUND = 178

/** A barley ear: a slim golden head of grains on the end of its stalk, with long whiskers (awns), pointing up from
 *  (x, y) at angle a (degrees, 0 = straight up). */
function BarleyEar({ x, y, a, s = 1, fill, line }: { x: number; y: number; a: number; s?: number; fill: string; line: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      {/* (the whiskers and grain marks are lines, so the coloring page leaves them fine and thin) */}
      {[-5, -1.5, 2, 5.5].map((dx, i) => (
        <line key={i} x1={dx * 0.5} y1={-12} x2={dx * 1.3} y2={-27} stroke={line} strokeWidth={0.9} strokeLinecap="round" opacity={0.75} />
      ))}
      <path d="M0 0 C-4 -3 -4.2 -10 0 -15 C4.2 -10 4 -3 0 0 Z" fill={fill} stroke={line} strokeWidth={1.3} strokeLinejoin="round" />
      {[-4, -8, -11.6].map((y) => (
        <polyline key={y} points={`-2.4 ${y} 0 ${y + 1.6} 2.4 ${y}`} stroke={line} strokeWidth={0.9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      ))}
    </g>
  )
}

/** A sheaf of barley: n stalks bunched at the tie (0, 0), their ears fanned out at the top, cut ends below. */
function Sheaf({ n, fill, stalk, line, ribbon, glow, glowAmt = 0.45 }: { n: number; fill: string; stalk: string; line: string; ribbon: string; glow?: string; glowAmt?: number }) {
  const fan = Array.from({ length: n }, (_, i) => ((i - (n - 1) / 2) * (n > 5 ? 9 : 11) * Math.PI) / 180)
  const top = (r: number): Pt => [Math.sin(r) * 25, -Math.cos(r) * 25]
  const bot = (r: number): Pt => [-Math.sin(r) * 8, 17]
  return (
    <g>
      {/* (a soft glow round the ears of barley: lines, so the coloring page leaves it out) */}
      {glow && (
        <g opacity={glowAmt} stroke={glow} strokeLinecap="round">
          {fan.map((r) => <line key={r} x1={top(r)[0]} y1={top(r)[1]} x2={top(r)[0] * 1.6} y2={top(r)[1] * 1.6} strokeWidth={13} />)}
        </g>
      )}
      {fan.map((r) => (
        <g key={r}>
          <path d={`M${pt(...bot(r))} L${pt(...top(r))}`} stroke={line} strokeWidth={3.6} strokeLinecap="round" />
          <path d={`M${pt(...bot(r))} L${pt(...top(r))}`} stroke={stalk} strokeWidth={1.9} strokeLinecap="round" />
        </g>
      ))}
      {fan.map((r) => <BarleyEar key={r} x={top(r)[0]} y={top(r)[1]} a={(r * 180) / Math.PI} s={1.15} fill={fill} line={line} />)}
      {/* The tie: a red ribbon with a little bow */}
      <path d="M-6 -1 Q0 2 6 -1 L6 3 Q0 6 -6 3 Z" fill={ribbon} stroke={ink(ribbon)} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M0 1 Q-7 -5 -9 1 Q-7 5 0 1 Z M0 1 Q7 -5 9 1 Q7 5 0 1 Z" fill={ribbon} stroke={ink(ribbon)} strokeWidth={1.3} strokeLinejoin="round" />
    </g>
  )
}

/** A little front paw at (x, y), tilted by a. */
const Paw = ({ x, y, a, fill, line }: { x: number; y: number; a: number; fill: string; line: string }) => (
  <g transform={`rotate(${a} ${x} ${y})`}>
    <ellipse cx={x} cy={y} rx={8} ry={10} fill={fill} stroke={line} strokeWidth={2.5} />
    <path d={`M${x - 2.5} ${y + 5} v3.5 M${x + 2.5} ${y + 5} v3.5`} stroke={line} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
  </g>
)

export default function Hare({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const gold = stage >= 2
  const FUR = g ? '#b3a69a' : '#c99566'
  const FAR = g ? '#a3968a' : '#b78256' // the far foot, a shade darker
  const CREAM = g ? '#e7e0d6' : '#fcecd6'
  const EAR_IN = g ? '#d9c0c0' : '#ffb5c3'
  const TIP = g ? '#857a72' : '#7d5638' // a hare's dark ear tips
  const NOSE = g ? '#c5a1a6' : '#f08a9c'
  const TAIL = g ? '#ece8e2' : '#fffaf3'
  const TAIL_LINE = g ? '#9d958c' : '#b39a80' // (a warm outline, like its fur's)
  const GRAIN = g ? '#d6cba6' : '#f4c95a'
  const STALK = g ? '#cdbf98' : '#e7b34a'
  const GRAIN_LINE = g ? '#9e9174' : '#b07f1c'
  const RIBBON = g ? '#bf9a9a' : '#ff6a5c'
  const GLOW = '#ffe27a'
  const fur = useShade(FUR, 0.4, 0.15)
  const far = useShade(FAR, 0.35, 0.15)
  const cream = useShade(CREAM, 0.5, 0.06)
  const tail = useShade(TAIL, 0.4, 0.08)
  const grain = useShade(GRAIN, 0.45, 0.12)
  const line = ink(FUR)
  const L = [46, 50, 52][Math.min(stage, 2)] // the ears grow a little
  // Ears: standing up, splayed a little; grumpy, drooping down at the sides
  const ears: [number, number, number][] = [[g ? 85 : 87, 61, g ? -106 : -12], [g ? 115 : 113, 59, g ? 104 : 13]]
  const sheaf = stage >= 1
  const glowing = gold && !g
  const glowStyle = { fill: GLOW, stroke: GLOW, strokeWidth: 10, strokeLinejoin: 'round', opacity: 0.38 } as const
  return (
    <g>
      <defs>{fur.def}{far.def}{cream.def}{tail.def}{grain.def}</defs>

      {/* Harvestglow's warm golden glow, all round it (its ears and tail have theirs, so it moves with them) */}
      {glowing && <g {...glowStyle}><path d={BODY} /><path d={HEAD} /></g>}

      {/* The little round white tail, at its back (it wiggles) */}
      <Anim cls="pa-tail" origin="0% 50%">
        {glowing && <circle cx={150} cy={162} r={11} {...glowStyle} />}
        <circle cx={150} cy={162} r={11} fill={tail.fill} stroke={TAIL_LINE} strokeWidth={2.5} />
        <path d="M146 157 q3 -2 6 0 M149 164 q3 -2 6 0" stroke={TAIL_LINE} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.6} />
      </Anim>

      {/* The far back foot, peeking out behind */}
      <path d={`M69 ${GROUND} C66 173 70 169 76 169 L100 170 L100 ${GROUND} Z`} fill={far.fill} stroke={ink(FAR)} strokeWidth={2.5} strokeLinejoin="round" />

      {/* Body, sitting up, with a cream tummy, the round thigh and the long back foot */}
      <g className="pa-breathe">
        <path d={BODY} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d="M82 114 C75 128 75 150 86 165 C95 171 106 169 110 160 C112 146 106 122 95 110 Z" fill={cream.fill} />
        <path d={THIGH} fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
        <Shine x={128} y={141} rx={6} ry={3.5} rot={-20} />
      </g>
      <path d={FOOT} fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M84 ${GROUND} C82 174 85 171 89 171 M91 ${GROUND} C89 174 92 171 96 171`} stroke={line} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.6} />

      {/* Front paws, held up at its chest; once it has a sheaf of barley (bigger and glowing for Harvestglow),
          they hug it, just under its ribbon, with the ears of barley leaning out beside its face */}
      {sheaf ? (
        <g transform={`translate(${gold ? 77 : 79} ${gold ? 128 : 130}) rotate(-32) scale(${gold ? 1.12 : 1})`}>
          <Sheaf n={gold ? 7 : 5} fill={grain.fill} stalk={STALK} line={GRAIN_LINE} ribbon={RIBBON} glow={g ? undefined : GLOW} glowAmt={gold ? 0.45 : 0.3} />
          {[[-7, 10, 20], [7, 12, -20]].map(([x, y, a]) => <Paw key={x} x={x} y={y} a={a} fill={fur.fill} line={line} />)}
        </g>
      ) : (
        [[87, 129, -30], [101, 131, 20]].map(([x, y, a]) => <Paw key={x} x={x} y={y} a={a} fill={fur.fill} line={line} />)
      )}

      {/* Long ears from the top of its head (behind it, so they grow out of it); they twitch */}
      {ears.map(([x, y, a], i) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${a})`}>
          <Anim cls="pa-ear" origin="50% 100%" delay={i ? 0.6 : 0}>
            {glowing && <path d={earPath(L, 18)} {...glowStyle} />}
            <path d={earPath(L, 18)} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
            <path d={earPath(L - 13, 9)} transform="translate(0 -4)" fill={EAR_IN} />
            <path d={`M-6.5 ${-L + 9} C-3.5 ${-L + 12} 3.5 ${-L + 12} 6.5 ${-L + 9} C5 ${-L + 4} 2.5 ${-L + 0.6} 0 ${-L + 0.2} C-2.5 ${-L + 0.6} -5 ${-L + 4} -6.5 ${-L + 9} Z`} fill={TIP} />
          </Anim>
        </g>
      ))}

      {/* Round soft head, with fluffy cheeks */}
      <path d={HEAD} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Shine x={84} y={65} rx={9} ry={5} />
      <CuteFace x={100} y={83} s={0.88} gap={15} mood={mood} mouth={false} blinkDelay={0.5} />
      {/* A soft cream muzzle, a pink nose and a little bunny mouth (a frown when grumpy), with whiskers */}
      <path d="M100 96 C93 94 86 97 86 103 C86 109 93 111 100 108.5 C107 111 114 109 114 103 C114 97 107 94 100 96 Z" fill={cream.fill} />
      <path d="M96 96.5 Q100 94.5 104 96.5 Q103 100 100 101 Q97 100 96 96.5 Z" fill={NOSE} stroke={ink(NOSE)} strokeWidth={1.4} strokeLinejoin="round" />
      <path d={g ? 'M95.5 107.5 Q100 103.5 104.5 107.5' : 'M100 101 V103 M95.5 103.5 Q97.8 106.5 100 103 Q102.2 106.5 104.5 103.5'}
        stroke="#7a4a3a" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[-1, 1].map((side) => (
        <path key={side} d={`M${100 + side * 15} 101 l${side * 11} -2 M${100 + side * 15} 104 l${side * 11} 2`} stroke={line} strokeWidth={1.3} strokeLinecap="round" opacity={0.55} />
      ))}

      {gold && (
        <>
          <Crown x={100} y={55} />
          {!g && [[30, 52, 8], [170, 60, 7], [178, 140, 6], [24, 150, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
