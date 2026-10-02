// Lionel → Roary → Braveheart: a chubby lion cub facing you, with a soft muzzle under its eyes.
// The fluffy mane grows each stage (two-tone at stage 2) and the tail tuft wags; Braveheart's tuft
// is a heart, and he wears a crown.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, useShade } from '../kit'

type Pt = [number, number]
type Circle = [number, number, number]

/** Outline of a fluffy shape: the union of circles listed clockwise around its middle. */
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

/** A ring of n fluffy bumps of radius r, centered R away from (cx, cy). */
const ring = (cx: number, cy: number, n: number, R: number, r: number): Circle[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R, r]
  })

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
  const smooth = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return `M${pt(...L[0])} ${smooth(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${smooth(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}

const MIRROR = 'translate(200 0) scale(-1 1)'
const FUR = '#ffc456'
const MANE = '#f08a36'
const MANE_RED = '#e8622f' // Braveheart's deeper outer mane
const MUZZLE = '#fff3dd'
const EAR = '#ffa3b6'
const NOSE = '#8e4a45'

export default function Lion({ stage, mood }: BodyProps) {
  const fur = useShade(FUR, 0.4, 0.14)
  const mane = useShade(stage >= 2 ? MANE_RED : MANE, 0.3, 0.16)
  const inner = useShade(MANE, 0.35, 0.12)
  const muzzle = useShade(MUZZLE, 0.5, 0.06)
  const furLine = ink(FUR)
  const maneLine = ink(stage >= 2 ? MANE_RED : MANE)
  const [n, R, r] = stage >= 2 ? [13, 49, 16] : stage >= 1 ? [12, 44, 15] : [11, 38, 12]
  const tip: Pt = stage >= 1 ? [172, 112] : [164, 124]
  return (
    <g>
      <defs>{fur.def}{mane.def}{inner.def}{muzzle.def}</defs>

      {/* Tail with a fluffy tuft (a heart for Braveheart) that wags (mirrored twice so the wag swings it in towards the body, not out of the picture) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="100% 100%">
          <g transform={MIRROR}>
            <path d={tube([128, 160], stage >= 1 ? [184, 166] : [170, 166], tip, 10, 8)} fill={fur.fill} stroke={furLine} strokeWidth={3} strokeLinejoin="round" />
            {stage >= 2 ? (
              <path d={`M${tip[0]} ${tip[1] + 6} C${tip[0] - 16} ${tip[1] - 4} ${tip[0] - 12} ${tip[1] - 20} ${tip[0]} ${tip[1] - 12} C${tip[0] + 12} ${tip[1] - 20} ${tip[0] + 16} ${tip[1] - 4} ${tip[0]} ${tip[1] + 6} Z`}
                fill={mane.fill} stroke={maneLine} strokeWidth={2.5} strokeLinejoin="round" />
            ) : (
              <path d={puff([[tip[0] - 6, tip[1] - 2, 7], [tip[0], tip[1] - 9, 7], [tip[0] + 6, tip[1] - 2, 7], [tip[0], tip[1] + 3, 6]])}
                fill={mane.fill} stroke={maneLine} strokeWidth={2.5} strokeLinejoin="round" />
            )}
          </g>
        </Anim>
      </g>

      {/* Sitting body, tummy and front paws */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={144} rx={38} ry={30} fill={fur.fill} stroke={furLine} strokeWidth={3} />
        <ellipse cx={100} cy={152} rx={21} ry={17} fill={MUZZLE} opacity={0.9} />
      </g>
      {[85, 115].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={172} rx={13} ry={9} fill={fur.fill} stroke={furLine} strokeWidth={3} />
          <path d={`M${x - 4} 168 V175 M${x + 4} 168 V175`} stroke={furLine} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}

      {/* The mane: a fluffy ring behind the head (two layers at stage 2) */}
      <path d={puff(ring(100, 90, n, R, r))} fill={mane.fill} stroke={maneLine} strokeWidth={3} strokeLinejoin="round" />
      {stage >= 2 && <path d={puff(ring(100, 90, 11, 40, 11))} fill={inner.fill} stroke={ink(MANE)} strokeWidth={2.5} strokeLinejoin="round" />}

      {/* Round ears that twitch */}
      {[[71, 61], [129, 61]].map(([x, y], i) => (
        <Anim key={x} cls="pa-ear" delay={i * 0.35}>
          <circle cx={x} cy={y} r={12} fill={fur.fill} stroke={furLine} strokeWidth={3} />
          <circle cx={x} cy={y + 1} r={6} fill={EAR} />
        </Anim>
      ))}

      {/* Head */}
      <ellipse cx={100} cy={88} rx={37} ry={34} fill={fur.fill} stroke={furLine} strokeWidth={3} />
      <Shine x={82} y={68} rx={10} ry={5.5} />
      {stage >= 1 && (
        <path d={puff([[92, 58, 6.5], [100, 52, 7.5], [108, 58, 6.5], [100, 61, 6]])} fill={mane.fill} stroke={maneLine} strokeWidth={2.5} strokeLinejoin="round" />
      )}

      {/* Muzzle under the eyes, with a little nose and whisker dots */}
      <path d={puff([[90, 107, 10.5], [100, 100, 8.5], [110, 107, 10.5], [100, 112, 8.5]])} fill={muzzle.fill} stroke={ink(MUZZLE)} strokeWidth={2.5} strokeLinejoin="round" />
      {[[86, 106], [84, 111], [114, 106], [116, 111]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={1.3} fill="#c99a6a" />)}
      <CuteFace x={100} y={82} s={0.86} gap={16} mood={mood} mouth={false} blinkDelay={1.1} />
      <path d="M94 97 Q100 94 106 97 Q105 102 100 104 Q95 102 94 97 Z" fill={NOSE} stroke={NOSE} strokeWidth={1.5} strokeLinejoin="round" />
      <path d={mood === 'grumpy' ? 'M100 104 V107 M94 112 Q100 107 106 112' : 'M100 104 V107 M94 108 Q97 111 100 107 Q103 111 106 108'}
        stroke={NOSE} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {stage >= 2 && <Crown x={100} y={57} />}
    </g>
  )
}
