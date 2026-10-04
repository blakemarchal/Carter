// Squeaky → Hushwing → Moonglider: a little round fruit bat facing you, flying (it bobs in the air, with a soft
// shadow on the ground below it). A soft cinnamon-brown body and head, a fluffy golden ruff round its neck, a
// fox-like little muzzle with a button nose, big friendly eyes, round upright ears, and two tiny feet dangling
// at the bottom. Its wings are its arms: each one comes from the side of its body, up to a little wrist with a
// thumb, and the warm plum wing skin stretches out on long fingers to a scalloped edge, back to its side.
// Hushwing's wings are bigger and it wears a little golden crescent moon on a blue ribbon; Moonglider's wings
// are bigger again and full of golden stars, its moon glows, and it wears a crown.
// Grumpy (in battle, squeaking all night so nobody can hear): dusty and grey, ears flat out to the sides, wings
// drooping, with a cross little frown and squeak lines coming from its mouth.
import { type BodyProps, Anim, Crown, CuteFace, ink, MOON, pt, Shine, starPath, twinklePath, useShade } from '../kit'

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

/** An ellipse's outline as polygon points. Soft glows and the shadow are drawn as polygons, so the coloring page
 *  (which turns every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 40) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

// The left wing (the right one is its mirror image), spread from the shoulder S at the side of the body: the arm
// runs up to the wrist, then three long fingers fan out to the wing's tips. Offsets from S, scaled by the wing's
// size; the wing skin comes back to the body at the hip H.
const S: Pt = [80, 116]
const H: Pt = [83, 146]
const WRIST: Pt = [-36, -30]
const TIPS: Pt[] = [[-76, -20], [-70, 12], [-46, 34]]

function wing(k: number) {
  const at = ([x, y]: Pt): Pt => [S[0] + x * k, S[1] + y * k]
  const w = at(WRIST)
  const tips = TIPS.map(at)
  // The skin between two tips sags in towards the wrist (the scallops)
  const sag = (a: Pt, b: Pt, f = 0.3): Pt => [(a[0] + b[0]) / 2 + (w[0] - (a[0] + b[0]) / 2) * f, (a[1] + b[1]) / 2 + (w[1] - (a[1] + b[1]) / 2) * f]
  const edge = [tips[0], tips[1], tips[2], H]
  let d = `M${pt(...S)} Q${pt(S[0] - 14 * k, w[1] + 2 * k)} ${pt(...w)} Q${pt(w[0] - 20 * k, w[1] - 6 * k)} ${pt(...tips[0])}`
  for (let i = 1; i < edge.length; i++) d += ` Q${pt(...sag(edge[i - 1], edge[i], i === 3 ? 0.22 : 0.3))} ${pt(...edge[i])}`
  return { d: `${d} Z`, w, tips }
}

export default function Bat({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const starry = stage >= 2
  const FUR = g ? '#a69a92' : '#c27f55'
  const RUFF = g ? '#cdc3b6' : '#f5b863'
  const BELLY = g ? '#d8cfc5' : '#f6d2a4'
  const MUZZLE = g ? '#e7e0d7' : '#fbe3c4'
  const WING = g ? '#8a7f87' : starry ? '#7d4f78' : '#93596a'
  const BONE = g ? '#b4aaae' : starry ? '#c995b0' : '#d39a8f'
  const EAR_IN = g ? '#d8bfc0' : '#ffb2c0'
  const FEET = g ? '#76696a' : '#7a4c3f'
  const NOSE = '#4a2f35'
  const RIBBON = g ? '#9aa3b8' : '#5f7fe0'
  const GOLD = g ? '#d3c9a4' : '#ffd95e'
  const GLOW = '#ffe27a'
  const fur = useShade(FUR, 0.4, 0.16)
  const ruff = useShade(RUFF, 0.45, 0.12)
  const belly = useShade(BELLY, 0.45, 0.06)
  const muzzle = useShade(MUZZLE, 0.5, 0.06)
  const skin = useShade(WING, 0.3, 0.18)
  const gold = useShade(GOLD, 0.5, 0.14)
  const line = ink(FUR)
  const k = [0.86, 0.95, 1.04][Math.min(stage, 2)] // the wings grow at each stage
  const wg = wing(k)
  const droop = g ? -22 : 0 // grumpy, the wings hang down
  const moon = starry ? 0.72 : 0.6 // the pendant's size
  // The fluffy golden ruff round its neck: soft tufts of fur all round, each swept a little to the side
  const ruffPath = smooth(Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2
    const r = i % 2 ? 0.88 : 1.06
    return [100 + Math.cos(a + (i % 2 ? 0 : 0.05)) * 31 * r, 113 + Math.sin(a + (i % 2 ? 0 : 0.05)) * 14 * r] as Pt
  }))
  // Its round body, soft and fuzzy all round the edge
  const bodyPath = smooth(Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2
    const r = i % 2 ? 22.6 : 24.8
    return [100 + Math.cos(a) * r, 133 + Math.sin(a) * r] as Pt
  }))
  return (
    <g>
      <defs>{fur.def}{ruff.def}{belly.def}{muzzle.def}{skin.def}{gold.def}</defs>

      {/* Its soft shadow on the ground, under it as it flies */}
      <polygon points={ring(100, 183, 30, 5)} fill="#2b2140" opacity={0.1} />

      <Anim cls="pa-float">
        {/* Wings: spread from the sides of its body, behind it, flapping at the shoulder (drooping when grumpy).
            Each is the left wing, mirrored for the right, with the flap inside the mirror so both beat together. */}
        {[-1, 1].map((side) => (
          <g key={side} transform={side > 0 ? MIRROR : undefined}>
            <Anim cls="pa-wing" origin="96% 45%" delay={side > 0 ? 0.08 : 0}>
              <g transform={droop ? `rotate(${droop} ${S[0]} ${S[1]})` : undefined}>
                {starry && !g && <path d={wg.d} fill={GLOW} opacity={0.35} stroke={GLOW} strokeWidth={9} strokeLinejoin="round" />}
                <path d={wg.d} fill={skin.fill} stroke={ink(WING)} strokeWidth={3} strokeLinejoin="round" />
                {/* The long fingers, from the wrist out to each tip */}
                {wg.tips.map(([x, y]) => (
                  <path key={x} d={`M${pt(...wg.w)} L${pt(x, y)}`} stroke={BONE} strokeWidth={2.6} strokeLinecap="round" />
                ))}
                {/* Moonglider's wings are full of golden stars */}
                {starry && [[30, 104, 4.2], [44, 122, 3.6], [24, 128, 3], [56, 104, 3], [52, 138, 2.8]].map(([x, y, r]) => (
                  <path key={x * y} d={starPath(x, y, r)} fill={GOLD} opacity={g ? 0.6 : 1} />
                ))}
                {/* The arm along the top of the wing, and the little thumb at the wrist */}
                <path d={`M${pt(S[0] - 2, S[1] + 2)} Q${pt(S[0] - 14 * k, wg.w[1] + 2 * k)} ${pt(...wg.w)}`} stroke={line} strokeWidth={7.5} fill="none" strokeLinecap="round" />
                <path d={`M${pt(S[0] - 2, S[1] + 2)} Q${pt(S[0] - 14 * k, wg.w[1] + 2 * k)} ${pt(...wg.w)}`} stroke={FUR} strokeWidth={4} fill="none" strokeLinecap="round" />
                <ellipse cx={wg.w[0] + 1} cy={wg.w[1] - 4.5} rx={3.6} ry={4.6} fill={fur.fill} stroke={line} strokeWidth={2} transform={`rotate(-20 ${wg.w[0] + 1} ${wg.w[1] - 4.5})`} />
              </g>
            </Anim>
          </g>
        ))}

        {/* Two tiny feet dangling at the bottom, with three little toes each */}
        {[-1, 1].map((side) => {
          const x = 100 + side * 10
          return (
            <g key={side}>
              <path d={`M${x} 150 V161`} stroke={ink(FEET)} strokeWidth={6.5} strokeLinecap="round" />
              <path d={`M${x} 150 V161`} stroke={FEET} strokeWidth={3.5} strokeLinecap="round" />
              {[-3.6, 0, 3.6].map((dx) => (
                <ellipse key={dx} cx={x + dx} cy={165} rx={2.3} ry={3.4} fill={FEET} stroke={ink(FEET)} strokeWidth={1.4} />
              ))}
            </g>
          )
        })}

        {/* Round fuzzy body with a pale tummy */}
        <g className="pa-breathe">
          <path d={bodyPath} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          <ellipse cx={100} cy={139} rx={14.5} ry={15} fill={belly.fill} />
          {[[95, 133], [105, 140], [96, 147]].map(([x, y]) => (
            <path key={y} d={`M${x - 2.5} ${y} q2.5 2.5 5 0`} stroke={ink(BELLY)} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.6} />
          ))}
        </g>

        {/* Round upright ears (flat out to the sides when grumpy); they twitch */}
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${100 + side * 22} 64) rotate(${side * (g ? 58 : 20)})`}>
            <Anim cls="pa-ear" origin="50% 100%" delay={side > 0 ? 0.6 : 0}>
              <path d="M-12 4 C-14 -10 -8 -24 0 -30 C8 -24 14 -10 12 4 Z" fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
              <path d="M-6.5 1 C-7.5 -9 -4 -18 0 -22 C4 -18 7.5 -9 6.5 1 Z" fill={EAR_IN} />
            </Anim>
          </g>
        ))}

        {/* The fluffy golden ruff round its neck */}
        <path d={ruffPath} fill={ruff.fill} stroke={ink(RUFF)} strokeWidth={2.5} strokeLinejoin="round" />

        {/* Hushwing's little crescent moon on a blue ribbon round its neck (glowing on Moonglider) */}
        {stage >= 1 && (
          <g>
            <path d="M72 110 Q100 132 128 110" stroke={ink(RIBBON)} strokeWidth={5.5} fill="none" strokeLinecap="round" />
            <path d="M72 110 Q100 132 128 110" stroke={RIBBON} strokeWidth={3} fill="none" strokeLinecap="round" />
            {starry && !g && (
              <Anim cls="pa-twinkle">
                <polygon points={ring(101, 134, 14)} fill={GLOW} opacity={0.5} />
              </Anim>
            )}
            <g transform={`translate(${100 + 4 * moon} ${123 + 15 * moon}) scale(${moon})`}>
              <path d={MOON} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={2.4 / moon} strokeLinejoin="round" />
            </g>
            <circle cx={100} cy={121.5} r={2.4} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={1.4} />
          </g>
        )}

        {/* Its round head, with a little tuft of fuzz on top (behind it, so it grows out of it) */}
        <path d="M92 56 C93 50 96 48 98 46 C98 50 100 51 101 50 C102 47 105 45 108 45 C106 49 107 53 108 56 Z" fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
        <ellipse cx={100} cy={85} rx={33} ry={30} fill={fur.fill} stroke={line} strokeWidth={3} />
        <Shine x={84} y={67} rx={9} ry={5} />

        <CuteFace x={100} y={83} s={0.86} gap={15} mood={mood} mouth={false} blinkDelay={0.9} />
        {/* A fox-like little muzzle with a button nose and a smile (a frown when grumpy) */}
        <ellipse cx={100} cy={101} rx={12.5} ry={9} fill={muzzle.fill} stroke={ink(MUZZLE)} strokeWidth={2} />
        <path d="M95.5 96 Q100 94 104.5 96 Q103.5 100 100 101.5 Q96.5 100 95.5 96 Z" fill={NOSE} />
        <circle cx={98.3} cy={96.2} r={1.1} fill="#fff" opacity={0.8} />
        <path d={g ? 'M95 107.5 Q100 103.5 105 107.5' : 'M100 101.5 V103 M95.5 104 Q97.8 106.5 100 103 Q102.2 106.5 104.5 104'}
          stroke="#7a4a3a" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Squeak! squeak! (grumpy): little lines either side of its head */}
        {g && [-1, 1].map((side) => (
          <path key={side} transform={side > 0 ? MIRROR : undefined} d="M60 94 L51 93 M62.5 84 L54.5 80.5 M68 74.5 L61 69"
            stroke="#6f6878" strokeWidth={2.8} strokeLinecap="round" />
        ))}

        {starry && <Crown x={100} y={57} />}
      </Anim>

      {starry && !g && [[26, 56, 8], [174, 52, 7], [168, 162, 6]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
