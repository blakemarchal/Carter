// Glimmer → Silkwing → Royalwing: a little butterfly facing you, hovering in the air (it bobs, with a soft shadow
// on the ground below it). A round lavender head with big eyes and a smile, two antennae with round golden tips
// growing from the top of its head, and a small round body with golden stripes. Its wings spread out from the
// sides of its body, two on each side: a big royal-purple wing at the top and a smaller orchid one below it, each
// edged in gold, with a golden spot. (Like most picture-book butterflies, its little legs are tucked up as it flies.)
// Silkwing's wings are bigger and patterned: fine veins, little pearls along their golden edges, a golden eye spot on
// each top wing and a golden heart on each lower one. Royalwing's wings are bigger again and glow softly gold, with a
// pink jewel in each eye spot and heart; it wears a tiny crown, with sparkles all round.
// Grumpy: dull and grey, its wings drooping, its antennae flopped over to the sides, and a cross face.
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

/** A smooth tapering tube along the curve a → (b) → c, width w0 at a down to w1 at c, with round ends. */
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

/** An ellipse's outline as polygon points. The glow and the shadow are drawn as polygons, so the coloring page
 *  (which turns every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A little heart centred on (0, 0), about 3r across. */
const heart = (r: number) =>
  `M${pt(0, r * 1.5)} C${pt(-r * 2.2, r * 0.2)} ${pt(-r * 1.4, -r * 1.6)} ${pt(0, -r * 0.5)} C${pt(r * 1.4, -r * 1.6)} ${pt(r * 2.2, r * 0.2)} ${pt(0, r * 1.5)}Z`

// The left wings (the right ones are their mirror image) grow from the root S at the side of its body, hidden
// behind it, below its head: the big top wing spreads up and out beside its head (never touching it or rising
// above it), the smaller one out and down beside its body. Offsets from S, scaled by the wings' size.
const S: Pt = [93, 124]
/** Mirrored top to bottom about the wings' root. */
const FLIP = `translate(0 ${2 * S[1]}) scale(1 -1)`
const FORE: Pt[] = [[-2, -7], [-20, -14], [-38, -30], [-52, -50], [-62, -66], [-74, -68], [-83, -56], [-86, -36], [-80, -16], [-66, -3], [-44, 4], [-14, 7]]
const HIND: Pt[] = [[-4, 4], [-26, 8], [-46, 15], [-58, 28], [-60, 43], [-52, 53], [-37, 55], [-22, 46], [-11, 31], [-1, 17]]
// Where each wing's golden edge is measured from (its inside is the wing shrunk towards this point)
const FORE_C: Pt = [-18, -10]
const HIND_C: Pt = [-12, 12]
// The veins on the top wing, from near its root out towards its edge
const VEINS: Pt[] = [[-60, -62], [-80, -44], [-76, -14]]

export default function Butterfly({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [glowId, veinClip] = [`bg${uid}`, `bv${uid}`]
  const HEAD = g ? '#c4bfcb' : '#b99af0'
  const BODY = g ? '#9f99a8' : '#8f63d8'
  const FORE_COL = g ? '#9b95a5' : '#7f4fd0'
  const HIND_COL = g ? '#b1abba' : '#b57be6'
  const VEIN = g ? '#c9c4d0' : '#c9a6f5'
  const GOLD = g ? '#d3c9a4' : '#ffcc3d'
  const PEARL = g ? '#e9e6df' : '#fff8e6'
  const JEWEL = g ? '#c7b3bd' : '#ff6fae'
  const STALK = g ? '#6e6878' : '#5b3a92'
  const GLOW = '#ffe27a'
  const head = useShade(HEAD, 0.45, 0.14)
  const body = useShade(BODY, 0.4, 0.16)
  const fore = useShade(FORE_COL, 0.42, 0.2)
  const hind = useShade(HIND_COL, 0.42, 0.16)
  const gold = useShade(GOLD, 0.5, 0.14)
  const jewel = useShade(JEWEL, 0.5, 0.15)
  const line = ink(HEAD)
  // The wings grow at each stage; grumpy, they droop (the top ones most) and hang a little smaller
  const k = [0.84, 0.91, 0.96][st] * (g ? 0.88 : 1)
  const at = ([x, y]: Pt): Pt => [S[0] + x * k, S[1] + y * k]
  /** A wing's outline, or (f < 1) its inside, within the golden edge. */
  const wing = (ps: Pt[], c: Pt, f = 1) => smooth(ps.map(([x, y]) => at([c[0] + (x - c[0]) * f, c[1] + (y - c[1]) * f])))
  const edge = st >= 1 ? 0.84 : 0.88 // the golden edge is wider once it has pearls on it
  /** Pearls along a wing's golden edge, halfway across it, at its outer points. */
  const pearls = (ps: Pt[], c: Pt, from: number, to: number) => ps.slice(from, to + 1).map(([x, y]) => {
    const f = (1 + edge) / 2
    return at([c[0] + (x - c[0]) * f, c[1] + (y - c[1]) * f])
  })
  const droop = (deg: number) => (g ? `rotate(${deg} ${S[0]} ${S[1]})` : undefined)
  // Antennae from the top of its head, curling out (flopped over to the sides when grumpy), longer as it grows
  const reach = [0, 3, 6][st]
  const antenna: [Pt, Pt, Pt] = g ? [[87, 62], [69, 45], [57, 65]] : [[87, 62], [80, 40 - reach], [68 - reach, 32 - reach]]
  return (
    <g>
      <defs>
        {head.def}{body.def}{fore.def}{hind.def}{gold.def}{jewel.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.75} />
          <stop offset="0.6" stopColor={GLOW} stopOpacity={0.35} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
        {/* (the veins stay inside the top wing's golden edge) */}
        <clipPath id={veinClip}><path d={wing(FORE, FORE_C, edge)} /></clipPath>
      </defs>

      {/* Its soft shadow on the ground, under it as it hovers */}
      <polygon points={ring(100, 185, 32, 5)} fill="#2b2140" opacity={0.1} />

      <Anim cls="pa-float">
        {/* Royalwing's soft golden glow, behind its wings */}
        {st >= 2 && !g && <polygon points={ring(100, 112, 98, 86)} fill={`url(#${glowId})`} />}

        {/* Wings: spread from the sides of its body, behind it, beating together at the root (drooping when grumpy).
            Each is the left pair, mirrored for the right, with the beat inside the mirror. Grumpy, the beat is
            mirrored top to bottom too, so its drooping wings lift a little rather than sag even lower. */}
        {[-1, 1].map((side) => (
          <g key={side} transform={side > 0 ? MIRROR : undefined}>
            <g transform={g ? FLIP : undefined}>
              <Anim cls="pa-wing" origin="100% 50%" delay={side > 0 ? 0.08 : 0}>
                <g transform={g ? FLIP : undefined}>
                  {/* The smaller lower wing, with a golden spot (a golden heart once it's patterned) */}
                  <g transform={droop(-14)}>
                    <path d={wing(HIND, HIND_C)} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={2.6} strokeLinejoin="round" />
                    <path d={wing(HIND, HIND_C, edge)} fill={hind.fill} stroke={ink(HIND_COL)} strokeWidth={1.4} strokeOpacity={0.5} strokeLinejoin="round" />
                    {st >= 1 && pearls(HIND, HIND_C, 2, 7).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.9} fill={PEARL} />)}
                    {st === 0
                      ? <circle cx={at([-38, 30])[0]} cy={at([-38, 30])[1]} r={5} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={1.6} />
                      : (
                        <g transform={`translate(${pt(...at([-37, 31]))}) scale(${k})`}>
                          <path d={heart(5.2)} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={1.8} strokeLinejoin="round" />
                          {st >= 2 && <path d={heart(2.8)} transform="translate(0 0.6)" fill={jewel.fill} />}
                        </g>
                      )}
                  </g>
                  {/* The big top wing, with a golden spot (an eye spot once it's patterned, with a jewel in it) */}
                  <g transform={droop(-42)}>
                    <path d={wing(FORE, FORE_C)} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={2.8} strokeLinejoin="round" />
                    <path d={wing(FORE, FORE_C, edge)} fill={fore.fill} stroke={ink(FORE_COL)} strokeWidth={1.4} strokeOpacity={0.5} strokeLinejoin="round" />
                    {st >= 1 && (
                      <path d={VEINS.map((p) => `M${pt(...at([-8, 0]))} Q${pt(...at([p[0] * 0.55, p[1] * 0.4]))} ${pt(...at(p))}`).join(' ')} clipPath={`url(#${veinClip})`}
                        stroke={VEIN} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.6} />
                    )}
                    {st >= 1 && pearls(FORE, FORE_C, 3, 9).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill={PEARL} />)}
                    {st === 0
                      ? <circle cx={at([-54, -34])[0]} cy={at([-54, -34])[1]} r={6.5} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={1.6} />
                      : (
                        <g transform={`translate(${pt(...at([-54, -34]))}) scale(${k})`}>
                          <circle r={9} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={1.8} />
                          <circle r={5.2} fill={st >= 2 ? jewel.fill : FORE_COL} />
                          <circle cx={-1.8} cy={-1.9} r={1.6} fill="#fff" opacity={0.9} />
                        </g>
                      )}
                  </g>
                </g>
              </Anim>
            </g>
          </g>
        ))}

        {/* The small round body, with golden stripes */}
        <g className="pa-breathe">
          <ellipse cx={100} cy={129} rx={17} ry={23} fill={body.fill} stroke={ink(BODY)} strokeWidth={3} />
          {[131, 142].map((y) => {
            const half = (yy: number) => Math.sqrt(Math.max(0, 1 - ((yy - 129) / 23) ** 2)) * 15.5
            return (
              <path key={y} d={`M${pt(100 - half(y), y)} Q100 ${y + 5} ${pt(100 + half(y), y)} L${pt(100 + half(y + 4.5), y + 4.5)} Q100 ${y + 9.5} ${pt(100 - half(y + 4.5), y + 4.5)} Z`}
                fill={gold.fill} />
            )
          })}
          <Shine x={92} y={118} rx={4} ry={2.6} rot={-40} />
        </g>

        {/* Antennae with round golden tips, from the top of its head (behind it, so they grow out of it); they twitch */}
        {[-1, 1].map((side) => (
          <g key={side} transform={side > 0 ? MIRROR : undefined}>
            <Anim cls="pa-ear" origin="100% 100%" delay={side > 0 ? 0.5 : 0}>
              <path d={tube(...antenna, 3.6, 2.6)} fill={STALK} stroke={ink(STALK)} strokeWidth={1.2} strokeLinejoin="round" />
              <circle cx={antenna[2][0]} cy={antenna[2][1]} r={4.6} fill={gold.fill} stroke={ink(GOLD)} strokeWidth={1.8} />
            </Anim>
          </g>
        ))}

        {/* Its round head */}
        <circle cx={100} cy={81} r={27} fill={head.fill} stroke={line} strokeWidth={3} />
        <Shine x={88} y={65} rx={7.5} ry={4.2} />
        <CuteFace x={100} y={83} s={0.82} gap={14} mood={mood} blinkDelay={1.4} />

        {/* Royalwing's tiny crown */}
        {st >= 2 && <g transform="translate(100 57) scale(0.72)"><Crown x={0} y={0} /></g>}
      </Anim>

      {st >= 2 && !g && [[24, 36, 7], [178, 30, 6], [174, 168, 6], [26, 170, 5]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
