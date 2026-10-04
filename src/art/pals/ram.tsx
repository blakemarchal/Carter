// Stomper → Woolhorn → Jubileeram: a woolly little ram facing you: a round cloud of cream wool full of little
// curls, four short legs with dark split hooves (the back pair peeping out behind the front pair), a soft caramel
// face with a pale muzzle and a curly woolly topknot, little ears, and curly horns that grow from the top of his
// head and curl round and down beside his face, with ridges round them.
// Woolhorn's wool is fluffier and his horns curl all the way round; he wears a sky-blue collar (for Peace) with a
// little golden bell, ready to march. Jubileeram is the fluffiest of all, his big horns curl round and round, and
// he's dressed for a festival: a garland of flowers round his neck, ribbons tied in bows on his horns, and a crown.
// Grumpy (in battle, before he's befriended): dusty grey, his head down ready to bump, stomping so the dust puffs up.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

const MIRROR = 'translate(200 0) scale(-1 1)'

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

/** A woolly cloud: n round puffs round an ellipse, as one scalloped outline. */
function fluff(cx: number, cy: number, rx: number, ry: number, n: number) {
  const p = Array.from({ length: n }, (_, i): Pt => {
    const a = -Math.PI / 2 + (Math.PI * 2 * (i + 0.5)) / n
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  })
  return `M${pt(...p[0])}` + p.map(([x, y], i) => {
    const [nx, ny] = p[(i + 1) % n]
    const r = (Math.hypot(nx - x, ny - y) * 0.58).toFixed(1)
    return ` A${r} ${r} 0 0 1 ${pt(nx, ny)}`
  }).join('') + 'Z'
}

/** The point on one edge of a tube along ps (side 1 or -1), w wide there. */
function edge(ps: Pt[], i: number, w: number, side: number): Pt {
  const n = ps.length - 1
  const [x1, y1] = ps[Math.max(0, i - 1)], [x2, y2] = ps[Math.min(n, i + 1)]
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  return [ps[i][0] - ((y2 - y1) / len) * (w / 2) * side, ps[i][1] + ((x2 - x1) / len) * (w / 2) * side]
}

/** A smooth tube along the points ps, its width w(t) for t = 0…1 along it, with round ends. */
function tubeAlong(ps: Pt[], w: (t: number) => number) {
  const n = ps.length - 1
  const L = ps.map((_, i) => edge(ps, i, w(i / n), 1))
  const R = ps.map((_, i) => edge(ps, i, w(i / n), -1)).reverse()
  const sm = (qs: Pt[]) => qs.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + qs[i + 2][0]) / 2, (p[1] + qs[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...qs[qs.length - 1])}`
  const r0 = w(0) / 2, r1 = w(1) / 2
  return `M${pt(...L[0])} ${sm(L)} A${r1} ${r1} 0 0 0 ${pt(...R[0])} ${sm(R)} A${r0} ${r0} 0 0 0 ${pt(...L[0])}Z`
}

/**
 * The left horn's middle line: a spiral round c, from its root in the side of his head (up and to the right of c,
 * hidden behind it), up and out over the top, down the outside and round underneath, curling in to its tip in the
 * middle. A little narrower than it is tall, like a real ram's curl seen from the front.
 */
function spiral([cx, cy]: Pt, a0: number, r0: number, r1: number, turn: number, n = 64): Pt[] {
  return Array.from({ length: n + 1 }, (_, i): Pt => {
    const t = i / n
    const a = ((a0 - turn * t) * Math.PI) / 180
    const r = r0 + (r1 - r0) * t
    return [cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r]
  })
}

// The horns at each stage, bigger curls as he grows: [centre, angle of the root (degrees), radius at the root,
// radius at the tip, how far round (degrees), width at the root, width at the tip]
const HORNS: [Pt, number, number, number, number, number, number][] = [
  [[67, 81], -24, 21, 4, 330, 13, 6],
  [[61, 83], -22, 27, 4, 430, 16.5, 6],
  [[56, 85], -20, 33, 4, 520, 19.5, 6.5],
]
// His head: a soft rounded face, a little narrower at the muzzle.
const HEAD: Pt[] = [[100, 63], [116, 66], [126, 78], [127, 94], [121, 108], [111, 119], [100, 122], [89, 119], [79, 108], [73, 94], [74, 78], [84, 66]]
// The woolly body and topknot at each stage: [rx, ry, puffs]
const BODY: [number, number, number][] = [[41, 27, 11], [48, 31, 13], [54, 33, 15]]
const TOP: [number, number, number][] = [[15, 8, 6], [20, 9.5, 7], [24, 11, 8]]
const BODY_Y = 132
// Little curls in his wool, as [x offset, y] from the middle (mirrored on each side); more as he grows.
const CURLS: Pt[][] = [
  [[26, 128], [30, 148], [14, 156]],
  [[30, 124], [38, 142], [20, 154], [12, 138]],
  [[33, 122], [43, 138], [27, 154], [12, 160], [16, 140]],
]
// Where his front (x 100 ± 13) and back (x 100 ± 31) hooves stand.
const FRONT = 13, BACK = 31

/** A short leg with a dark split hoof standing on the ground at y = foot. */
function Leg({ x, top, foot, w, fill, line, hoof }: { x: number; top: number; foot: number; w: number; fill: string; line: string; hoof: string }) {
  const h = w / 2
  return (
    <g>
      <rect x={x - h} y={top} width={w} height={foot - top - 2} rx={h} fill={fill} stroke={line} strokeWidth={2.8} />
      <path d={`M${x - h} ${foot - 8} H${x + h} V${foot - 3} Q${x + h} ${foot} ${x + h - 3} ${foot} H${x - h + 3} Q${x - h} ${foot} ${x - h} ${foot - 3} Z`}
        fill={hoof} stroke={hoof} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${x} ${foot - 6} V${foot}`} stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.35} />
    </g>
  )
}

/** A little flower for Jubileeram's garland. */
const Flower = ({ x, y, color, line, r = 4.6 }: { x: number; y: number; color: string; line: string; r?: number }) => (
  <g transform={`translate(${pt(x, y)})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={0} cy={-r * 0.95} rx={r * 0.72} ry={r} fill={color} stroke={line} strokeWidth={1.2} transform={`rotate(${a})`} />
    ))}
    <circle r={r * 0.55} fill="#ffd34d" stroke="#d29a00" strokeWidth={1} />
  </g>
)

export default function Ram({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const WOOL = g ? '#e3ddd3' : '#fef7ea'
  const LINE = g ? '#a89e91' : '#cfae86' // a soft tan outline for the cream wool
  const CURL = g ? '#c6bcaf' : '#e9d2b1'
  const FACE = g ? '#cdc0b2' : '#ecc79f'
  const FACE_FAR = g ? '#bcae9f' : '#dcb085' // the back legs, a shade darker
  const MUZZLE = g ? '#e9e2d8' : '#fdeedb'
  const NOSE = g ? '#a99a90' : '#c98a7a'
  const HORN = g ? '#cbc3b4' : '#ecc98c'
  const HOOF = g ? '#7f7672' : '#76584a'
  const EAR_IN = g ? '#dcc6c6' : '#ffbccb'
  const PEACE = g ? '#adbfcc' : '#7cc6ff'
  const GOLD = g ? '#d6cca8' : '#ffd34d'
  const GOLD_LINE = g ? '#9c9278' : '#d29a00'
  const FLOWERS = g ? ['#d9c6cf', '#e2dcc0', '#c9d3dc'] : ['#ff8fc0', '#fff2a8', '#9fd8ff']
  const RIBBON = g ? '#c4b0bb' : '#ff6fae'
  const wool = useShade(WOOL, 0.5, 0.1)
  const face = useShade(FACE, 0.4, 0.12)
  const far = useShade(FACE_FAR, 0.35, 0.12)
  const muzzle = useShade(MUZZLE, 0.5, 0.06)
  const horn = useShade(HORN, 0.45, 0.2)
  const gold = useShade(GOLD, 0.5, 0.14)
  const peace = useShade(PEACE, 0.35, 0.12)
  const faceLine = ink(FACE)

  const [c, a0, r0, r1, turn, w0, w1] = HORNS[st]
  const hornLine = spiral(c, a0, r0, r1, turn)
  const hw = (t: number) => w0 + (w1 - w0) * t ** 0.85
  const hornPath = tubeAlong(hornLine, hw)
  // Ridges round the horn, square across it, closer together as it curls in
  const ridges = Array.from({ length: 5 + st * 3 }, (_, k) => {
    const t = 0.12 + 0.76 * (k / (4 + st * 3)) ** 0.9
    const i = Math.round(t * (hornLine.length - 1))
    return `M${pt(...edge(hornLine, i, hw(t) - 3, 1))} L${pt(...edge(hornLine, i, hw(t) - 3, -1))}`
  }).join(' ')
  // A ribbon bow tied round each of Jubileeram's horns, on the outside of the curl, with its ends hanging down
  const bowAt = hornLine[Math.round(hornLine.length * 0.25)]

  const [brx, bry, bn] = BODY[st]
  const [topRx, topRy, topN] = TOP[st]
  const drop = g ? 5 : 0 // a cross ram puts his head down, ready to bump

  return (
    <g>
      <defs>{wool.def}{face.def}{far.def}{muzzle.def}{horn.def}{gold.def}{peace.def}</defs>

      {/* Four short legs with split hooves: the back pair a shade darker, peeping out behind the front pair */}
      {[-1, 1].map((side) => <Leg key={side} x={100 + side * BACK} top={140} foot={176} w={12} fill={far.fill} line={faceLine} hoof={HOOF} />)}
      {[-1, 1].map((side) => <Leg key={side} x={100 + side * FRONT} top={142} foot={179} w={13.5} fill={face.fill} line={faceLine} hoof={HOOF} />)}

      {/* Stomping: puffs of dust where his hooves hit the ground, and little stomp lines */}
      {g && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-twinkle" delay={side > 0 ? 0.9 : 0}>
            <g fill="#efe6d6" stroke="#c9b9a2" strokeWidth={1.8}>
              <circle cx={45} cy={173} r={5} /><circle cx={54} cy={170.5} r={7} /><circle cx={62} cy={174.5} r={4.5} />
            </g>
          </Anim>
          <path d="M51 158 L47 152 M60 157 L60 150 M41 163 L35 160" stroke="#b5a48d" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      ))}

      {/* The woolly body, full of little curls */}
      <g className="pa-breathe">
        <path d={fluff(100, BODY_Y, brx, bry, bn)} fill={wool.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        {CURLS[st].flatMap(([dx, y]) => [-1, 1].map((side) => (
          <path key={`${side}${dx}${y}`} d={`M${pt(100 + side * dx - 4, y + 2)} a4.4 4.4 0 1 1 5 4`} stroke={CURL} strokeWidth={2.3} fill="none" strokeLinecap="round" />
        )))}
        <Shine x={100 - brx * 0.55} y={BODY_Y - bry * 0.55} rx={8} ry={4.5} />
      </g>

      {/* Woolhorn's sky-blue collar, round his neck under his chin */}
      {st === 1 && (
        <path d="M66 112 Q100 136 134 112 L136 120 Q100 145 64 120 Z" fill={peace.fill} stroke={ink(PEACE)} strokeWidth={2.2} strokeLinejoin="round" />
      )}

      {/* Head (lowered when he's cross) */}
      <g transform={drop ? `translate(0 ${drop})` : undefined}>
        {/* Little ears sticking out under his horns, twitching */}
        {[-1, 1].map((side) => (
          <g key={side} transform={side > 0 ? MIRROR : undefined}>
            <Anim cls="pa-ear" origin="100% 40%" delay={side > 0 ? 0.4 : 0}>
              <g transform={`rotate(${g ? -34 : -18} 78 ${104 + st * 3})`}>
                <ellipse cx={66} cy={104 + st * 3} rx={13} ry={6.5} fill={face.fill} stroke={faceLine} strokeWidth={2.5} />
                <ellipse cx={65} cy={104 + st * 3} rx={7.5} ry={3.2} fill={EAR_IN} />
              </g>
            </Anim>
          </g>
        ))}

        {/* Curly horns, growing from the top of his head and curling round beside his face (behind it) */}
        {[-1, 1].map((side) => (
          <g key={side} transform={side > 0 ? MIRROR : undefined}>
            <path d={hornPath} fill={horn.fill} stroke={ink(HORN)} strokeWidth={2.8} strokeLinejoin="round" />
            <path d={ridges} stroke={ink(HORN)} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
          </g>
        ))}

        <path d={smooth(HEAD)} fill={face.fill} stroke={faceLine} strokeWidth={3} strokeLinejoin="round" />
        <Shine x={86} y={80} rx={7} ry={4} />

        {/* A pale muzzle with a soft nose and a little mouth (a frown when he's cross) */}
        <ellipse cx={100} cy={109} rx={16} ry={11} fill={muzzle.fill} stroke={ink(MUZZLE)} strokeWidth={2} />
        <path d="M95 102.5 Q100 100.5 105 102.5 Q103.5 107 100 107.5 Q96.5 107 95 102.5 Z" fill={NOSE} />
        <path d={g ? 'M100 107.5 V110.5 M94 115.5 Q100 110 106 115.5' : 'M100 107.5 V110 M93.5 110.5 Q97 114.5 100 110 Q103 114.5 106.5 110.5'}
          stroke="#7a4f45" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Curly woolly topknot (it covers where his horns grow from) */}
        <path d={fluff(100, 66, topRx, topRy, topN)} fill={wool.fill} stroke={LINE} strokeWidth={2.8} strokeLinejoin="round" />
        {st >= 1 && [-1, 1].map((side) => (
          <path key={side} d={`M${pt(100 + side * topRx * 0.45 - 3, 67)} a3.4 3.4 0 1 1 4 3`} stroke={CURL} strokeWidth={2} fill="none" strokeLinecap="round" />
        ))}

        <CuteFace x={100} y={88} s={0.8} gap={15} mood={mood} mouth={false} blinkDelay={1.1} />

        {/* Jubileeram's ribbons, tied in bows on his horns */}
        {st >= 2 && [-1, 1].map((side) => (
          <g key={side} transform={side > 0 ? MIRROR : undefined}>
            <Anim cls="pa-tail" origin="50% 0%" delay={side > 0 ? 0.5 : 0}>
              <path d={`M${pt(bowAt[0], bowAt[1] + 2)} q-3 10 -9 18 l4 -1 l1 4 q5 -9 7 -19 Z`} fill={RIBBON} stroke={ink(RIBBON)} strokeWidth={1.6} strokeLinejoin="round" />
              <path d={`M${pt(bowAt[0], bowAt[1] + 2)} q3 9 1 19 l3 -2 l3 3 q1 -11 -4 -19 Z`} fill={RIBBON} stroke={ink(RIBBON)} strokeWidth={1.6} strokeLinejoin="round" />
            </Anim>
            <g transform={`translate(${pt(...bowAt)}) rotate(-30)`} fill={RIBBON} stroke={ink(RIBBON)} strokeWidth={1.6} strokeLinejoin="round">
              <path d="M0 0 Q-8 -9 -10.5 -2 Q-9 5 0 0 Z M0 0 Q8 -9 10.5 -2 Q9 5 0 0 Z" />
              <circle r={2.8} />
            </g>
          </g>
        ))}

        {st >= 2 && <Crown x={100} y={57} />}
      </g>

      {/* Woolhorn's little golden bell, hanging from his collar */}
      {st === 1 && (
        <g>
          <path d="M93 136 Q93 127 100 127 Q107 127 107 136 Z" fill={gold.fill} stroke={GOLD_LINE} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M91.5 136 H108.5" stroke={GOLD_LINE} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={100} cy={138.6} r={2} fill={GOLD_LINE} />
          <circle cx={97.6} cy={130.5} r={1.4} fill="#fff" opacity={0.85} />
        </g>
      )}

      {/* Jubileeram's garland of flowers round his neck */}
      {st >= 2 && (
        <g>
          <path d="M64 114 Q100 142 136 114" stroke={g ? '#a3ad9c' : '#5fbf6a'} strokeWidth={3} fill="none" strokeLinecap="round" />
          {Array.from({ length: 7 }, (_, k) => {
            const t = (k + 0.5) / 7, u = 1 - t
            const x = u * u * 64 + 2 * u * t * 100 + t * t * 136, y = u * u * 114 + 2 * u * t * 142 + t * t * 114
            const col = FLOWERS[k % 3]
            return (
              <g key={k}>
                <ellipse cx={x + 6} cy={y + 3} rx={4.5} ry={2.2} fill={g ? '#a3ad9c' : '#5fbf6a'} transform={`rotate(25 ${pt(x + 6, y + 3)})`} />
                <Flower x={x} y={y} color={col} line={ink(col)} r={k === 3 ? 6.4 : 5.4} />
              </g>
            )
          })}
        </g>
      )}

      {st >= 2 && !g && [[28, 46, 8], [174, 40, 7], [180, 128, 6]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
