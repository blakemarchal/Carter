// Drawn things first needed by the Palm Sunday island (its activities and pictures). Same style and rules as the
// other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the drawing is what that
// emoji means. Every item can be used anywhere once it's here.
//   palm-branch: one long palm branch (a date palm's frond), like the ones the crowd waved for Jesus. No emoji: 🌿 is
//                a herb. (The island's sticker, the count game's branches, a quiz answer.)
//   palm-tree:   a date palm with a cluster of dates: what 🌴 means (a palm tree).
//   stones:      a little heap of three smooth stones by the road ("even the stones would shout!"). 🪨 is one stone.
//   big-horse:   a big, strong horse in a king's red blanket (kings rode horses; Jesus rode a little donkey).
// PalmFrond and frondShape draw a palm branch at any size and angle, for the story pictures and the game; BigHorse
// draws the horse in a picture's own units, with a rider if there is one (art/scenes/palm-sunday.tsx, page ten).
import { useId, type CSSProperties, type ReactNode } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, lighten, Shine, useShade } from './draw'
import { Person, type Look } from '../people'

type Pt = [number, number]
const f = (n: number) => n.toFixed(1)

// ---------- Palm branches ----------

/** Palm green, its outline, and the pale midrib. */
export const FROND = { fill: '#5fae4a', line: '#2f7a36', rib: '#d8e8a0', dark: '#4a9440' }

/**
 * The shape of one palm frond: a stalk at (0, 0) and a midrib running up to the tip at (bend, -len), bending over that
 * way, with narrow leaflets all along both sides, angled up toward the tip (longest in the middle). `w` is how far
 * the longest leaflets reach out; `n` how many on each side. Returns the outline (one closed path) and the midrib.
 * Drawn upright and with `bend` 0 it is the same on both sides, so a frond turned from its foot (CSS fill-box, origin
 * 50% 100%) turns about the hand that holds it.
 */
export function frondShape(len: number, w: number, n = 9, bend = 0) {
  const P1: Pt = [0, -len * 0.55], P2: Pt = [bend, -len]
  const at = (t: number): Pt => [2 * (1 - t) * t * P1[0] + t * t * P2[0], 2 * (1 - t) * t * P1[1] + t * t * P2[1]]
  const tan = (t: number): Pt => {
    const dx = 2 * (1 - t) * P1[0] + 2 * t * (P2[0] - P1[0]), dy = 2 * (1 - t) * P1[1] + 2 * t * (P2[1] - P1[1])
    const l = Math.hypot(dx, dy) || 1
    return [dx / l, dy / l]
  }
  const stalk = 0.14 // (the bare stalk at the foot)
  const rib = Math.max(0.9, len * 0.016)
  const gap = (1 - stalk) / n
  const side = (k: 1 | -1) => {
    const pts: Pt[] = [[k * rib, 0]]
    for (let i = 0; i < n; i++) {
      const t = stalk + gap * i, t2 = t + gap * 0.42
      const [x, y] = at(t), [tx, ty] = tan(t), [x2, y2] = at(t2)
      const nx = -ty * k, ny = tx * k // (out to this side)
      const prof = Math.sin(Math.PI * (0.16 + 0.8 * ((t - stalk) / (1 - stalk)))) // short at the foot and the tip
      const lf = w * (0.35 + 0.65 * prof)
      const a = 0.62 // (tilted up toward the tip)
      const dx = nx * Math.cos(a) + tx * Math.sin(a), dy = ny * Math.cos(a) + ty * Math.sin(a)
      pts.push([x + nx * rib, y + ny * rib], [x + nx * rib + dx * lf, y + ny * rib + dy * lf], [x2 + nx * rib, y2 + ny * rib])
    }
    return pts
  }
  const right = side(1), left = side(-1).reverse()
  const outline = `M${[...right, P2, ...left].map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`
  const ribPath = `M0 0 Q${f(P1[0])} ${f(P1[1])} ${f(P2[0])} ${f(P2[1])}`
  return { outline, rib: ribPath }
}

/**
 * One palm frond, its foot at (x, y), standing up and turned `angle` degrees (clockwise) from there; `len` long,
 * `w` wide each side. `flat`: plain green (small, far away); otherwise softly shaded, with a pale midrib.
 */
export function PalmFrond({ x = 0, y = 0, len, w, n = 9, bend = 0, angle = 0, color = FROND.fill, flat, line }: {
  x?: number; y?: number; len: number; w: number; n?: number; bend?: number; angle?: number; color?: string; flat?: boolean; line?: number
}) {
  const shade = useShade(color, 0.3, 0.18)
  const { outline, rib } = frondShape(len, w, n, bend)
  const sw = line ?? Math.max(1, len * 0.022)
  return (
    <g transform={x || y || angle ? `translate(${f(x)} ${f(y)})${angle ? ` rotate(${f(angle)})` : ''}` : undefined}>
      {!flat && <defs>{shade.def}</defs>}
      <path d={outline} fill={flat ? color : shade.fill} stroke={ink(color)} strokeWidth={sw} strokeLinejoin="round" />
      <path d={rib} stroke={flat ? darken(color, 0.12) : FROND.rib} strokeWidth={Math.max(1, sw * 0.9)} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** One palm branch, lying across the box from its stalk at the bottom left. */
function PalmBranchItem() {
  return (
    <g>
      <ellipse {...groundShadow(52, 92, 34)} />
      <PalmFrond x={24} y={90} len={98} w={19} n={12} bend={12} angle={36} />
    </g>
  )
}

// ---------- A palm tree ----------

/** A date palm: a tall, gently curving trunk with rings, a crown of drooping fronds, and a cluster of dates. */
export function PalmTreeShape() {
  const bark = useShade('#b98552', 0.3, 0.2)
  const trunk = 'M44 92 Q47 62 42 38 L51 37 Q57 62 58 92 Z'
  const top: Pt = [46, 36]
  // [angle (0 = straight up, + clockwise), length, how far it droops at the tip]
  const fronds: [number, number, number][] = [[-116, 40, -20], [-72, 44, -18], [-30, 34, -10], [30, 34, 10], [72, 44, 18], [116, 40, 20]]
  return (
    <g>
      <defs>{bark.def}</defs>
      <ellipse {...groundShadow(51, 92, 26)} />
      <path d="M30 92 Q51 82 72 92 Z" fill="#e8cf94" stroke="#c9a668" strokeWidth={1.8} strokeLinejoin="round" />
      <path d={trunk} fill={bark.fill} stroke="#7a5230" strokeWidth={2.2} strokeLinejoin="round" />
      {[84, 76, 68, 60, 52, 45].map((ry, i) => (
        <path key={ry} d={`M${f(44.6 - i * 0.5)} ${ry} q${f(6 - i * 0.2)} 3 ${f(12 - i * 0.5)} -1`} stroke="#8a5f38" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      ))}
      {fronds.map(([a, len, droop]) => <PalmFrond key={a} x={top[0]} y={top[1]} len={len} w={12} n={7} bend={droop} angle={a} line={1.6} />)}
      {/* the dates, hanging in a cluster under the crown */}
      {[[50, 42], [54, 44], [47, 45], [51, 47.5], [55, 48.5], [48, 50]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={2.9} ry={3.5} fill="#d9822e" stroke="#9a521c" strokeWidth={1.1} />
      ))}
      <path d="M41 36 Q46 24 51 36 Z" fill="#6f9a3a" stroke="#3f6a2a" strokeWidth={1.4} strokeLinejoin="round" />
    </g>
  )
}

// ---------- The stones by the road ----------

/** A little heap of three smooth stones: two on the ground and one on top. */
function StonesItem() {
  const big = useShade('#a9b1ba', 0.4, 0.2)
  const warm = useShade('#b9b0a2', 0.4, 0.2)
  const blue = useShade('#9aa7b8', 0.4, 0.2)
  const stone = (d: string, fill: string, color: string, dots: [number, number, number][], shine: [number, number]) => (
    <g>
      <path d={d} fill={fill} stroke={ink(color)} strokeWidth={2.6} strokeLinejoin="round" />
      {dots.map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill={darken(color, 0.18)} />)}
      <Shine x={shine[0]} y={shine[1]} rx={6} ry={3.2} />
    </g>
  )
  return (
    <g>
      <defs>{big.def}{warm.def}{blue.def}</defs>
      <ellipse {...groundShadow(50, 91, 42)} />
      {stone('M8 76 C8 61 20 53 34 53 C49 53 58 62 57 76 C56 87 46 91 32 91 C18 91 8 87 8 76 Z', big.fill, '#a9b1ba', [[24, 70, 1.4], [42, 80, 1.6], [30, 84, 1.1]], [22, 61])}
      {stone('M48 79 C48 66 58 58 71 58 C84 58 93 67 92 79 C91 88 82 91 70 91 C57 91 48 88 48 79 Z', warm.fill, '#b9b0a2', [[64, 72, 1.3], [80, 82, 1.5], [74, 66, 1]], [62, 65])}
      {stone('M28 49 C28 36 38 28 51 28 C64 28 73 36 72 48 C71 58 62 62 50 62 C37 62 28 58 28 49 Z', blue.fill, '#9aa7b8', [[44, 46, 1.3], [60, 52, 1.5], [54, 38, 1]], [41, 36])}
    </g>
  )
}

// ---------- A king's big horse ----------

const HORSE = '#b8743e', MANE = '#5a3320', HOOF = '#4a3a34', MUZZLE = '#d9a684'
/** The king's horse blanket: red, with gold trim and a gold fringe. */
const ROYAL = '#c0392b', GOLD = '#f2c440'

/**
 * A big, strong horse standing side-on, facing right (or `flip`): chestnut, with a dark mane and tail, a white blaze
 * and white socks on its near legs, in a king's red blanket trimmed with gold. (x, y) = its hooves on the ground; at
 * s = 1 it is about 270 long and 260 tall (to its ears): a grown-up's head comes about level with its back. `rider` sits
 * on the blanket facing us, from the saddle up, his feet hanging down its side and his hands in his lap, holding the
 * reins; `riderKids` are drawn on him (in a Person's units).
 */
export function BigHorse({ x, y, s = 1, flip, rider, riderKids, blinkDelay = 0 }: {
  x: number; y: number; s?: number; flip?: boolean; rider?: Look; riderKids?: ReactNode; blinkDelay?: number
}) {
  const coat = useShade(HORSE, 0.3, 0.2)
  const mane = useShade(MANE, 0.25, 0.15)
  const line = ink(HORSE)
  const clip = `hs${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  // (the legs come out from under the body: drawn first, far ones darker)
  const leg = (lx: number, far: boolean, sock: boolean) => (
    <g key={lx}>
      <path d={`M${lx} -118 Q${lx - 3} -80 ${lx + 1} -56 Q${lx + 2} -34 ${lx + 1} -10 L${lx + 17} -10 Q${lx + 18} -34 ${lx + 18} -56 Q${lx + 21} -80 ${lx + 19} -118 Z`}
        fill={far ? darken(HORSE, 0.14) : coat.fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
      {sock && <path d={`M${lx + 1.2} -32 Q${lx + 9.5} -36 ${lx + 17.8} -32 L${lx + 17.6} -10 L${lx + 1.2} -10 Z`} fill="#fbf6ee" stroke={line} strokeWidth={2} strokeLinejoin="round" />}
      <rect x={lx - 0.5} y={-12} width={19} height={12} rx={3} fill={HOOF} />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        {coat.def}{mane.def}
        <clipPath id={clip}><rect x={-120} y={-300} width={240} height={300} /></clipPath>
      </defs>
      <ellipse cx={-6} cy={-1} rx={104} ry={7} fill="#000" opacity={0.12} />
      {/* the tail, flowing down from the rump */}
      <g className="pa-tail" style={{ '--o': '100% 0%' } as CSSProperties}>
        <path d="M-80 -150 C-104 -142 -112 -112 -108 -82 C-106 -66 -114 -52 -120 -42 C-102 -44 -92 -58 -90 -76 C-88 -100 -82 -126 -66 -138 Z"
          fill={mane.fill} stroke={ink(MANE)} strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M-96 -128 Q-104 -104 -100 -80" stroke={lighten(MANE, 0.25)} strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>
      {leg(-62, true, false)}
      {leg(30, true, false)}
      {leg(-80, false, true)}
      {leg(46, false, true)}
      {/* the body, with a hint of its strong shoulder and haunch */}
      <ellipse cx={-6} cy={-126} rx={82} ry={42} fill={coat.fill} stroke={line} strokeWidth={3} />
      <path d="M-58 -102 Q-6 -88 46 -102" stroke={lighten(HORSE, 0.18)} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5} />
      <path d="M-64 -158 Q-44 -136 -52 -100 M44 -150 Q58 -128 54 -100" stroke={darken(HORSE, 0.12)} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* the neck, and the mane along it */}
      <path d="M20 -150 Q52 -200 78 -234 L124 -210 Q102 -166 72 -98 Z" fill={coat.fill} />
      <path d="M124 -210 Q102 -166 72 -98" stroke={line} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M16 -150 Q30 -166 34 -182 Q42 -188 46 -202 Q54 -206 58 -220 Q66 -224 72 -238 Q80 -242 88 -248 L84 -232 Q66 -206 48 -176 Q36 -160 28 -144 Z"
        fill={mane.fill} stroke={ink(MANE)} strokeWidth={2.2} strokeLinejoin="round" />
      {/* the ears (the far one darker, behind), the head with its white blaze and pale muzzle, and the forelock */}
      <path d="M100 -232 Q94 -252 100 -264 Q110 -254 111 -236 Z" fill={darken(HORSE, 0.12)} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      <g className="pa-ear" style={{ '--o': '50% 100%' } as CSSProperties}>
        <path d="M108 -234 Q108 -256 117 -266 Q124 -252 120 -232 Z" fill={coat.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M112 -238 Q113 -250 116 -257" stroke="#e8a090" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      </g>
      <ellipse cx={118} cy={-212} rx={38} ry={21} transform="rotate(42 118 -212)" fill={coat.fill} stroke={line} strokeWidth={3} />
      <path d="M110 -233 Q128 -218 146 -196" stroke="#fbf6ee" strokeWidth={7} fill="none" strokeLinecap="round" />
      <ellipse cx={142} cy={-190} rx={18} ry={14} transform="rotate(42 142 -190)" fill={MUZZLE} stroke={line} strokeWidth={2.4} />
      <ellipse cx={150} cy={-188} rx={2.6} ry={3.6} transform="rotate(42 150 -188)" fill="#6a4030" />
      <path d="M134 -177 Q142 -173 148 -177" stroke="#6a4030" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M104 -242 Q116 -236 112 -224 Q106 -230 101 -238 Z" fill={mane.fill} stroke={ink(MANE)} strokeWidth={1.6} strokeLinejoin="round" />
      <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
        <ellipse cx={106} cy={-213} rx={4.6} ry={5.6} fill="#2b2140" />
        <circle cx={104.5} cy={-215.4} r={1.8} fill="#fff" />
      </g>
      <ellipse cx={114} cy={-199} rx={4.6} ry={2.8} fill="#ff7fb0" opacity={0.45} />
      {/* the bridle: a band round the nose and a strap up behind the cheek */}
      <g fill="none" stroke="#7a3a22" strokeWidth={3} strokeLinecap="round">
        <path d="M128 -205 Q140 -204 151 -197" />
        <path d="M128 -204 L112 -236" />
      </g>
      {/* the king's red blanket, with its gold trim and fringe */}
      <path d="M-52 -166 Q-8 -176 36 -166 L40 -116 Q-6 -106 -50 -116 Z" fill={ROYAL} stroke={ink(ROYAL)} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M-49 -122 Q-6 -112 39 -122" stroke={GOLD} strokeWidth={4} fill="none" />
      <path d="M-6 -158 l5 9 l-5 9 l-5 -9 Z" fill={GOLD} stroke="#a8761c" strokeWidth={1.2} strokeLinejoin="round" />
      {[-46, -34, -22, -10, 2, 14, 26].map((fx) => <circle key={fx} cx={fx} cy={-113 + Math.abs(fx + 6) * 0.05} r={2.8} fill="#ffd34d" stroke="#c99a10" strokeWidth={0.8} />)}
      {rider && (
        // (the rider, a little bigger than on the donkey, so a grown-up looks grown-up on so big a horse: drawn with the
        // top of the horse's back at y = 0)
        <g transform="translate(0 -168) scale(1.2)">
          <g clipPath={`url(#${clip})`}>
            <Person x={-6} y={59} s={0.95} look={rider} pose="hold" blinkDelay={blinkDelay + 0.7}>{riderKids}</Person>
          </g>
          {/* his feet, his legs hanging down the horse's side, and his lap with his hands, holding the reins */}
          <ellipse cx={-16} cy={39} rx={7} ry={4} fill="#7a5233" />
          <ellipse cx={4} cy={39} rx={7} ry={4} fill="#7a5233" />
          <path d="M-26 -2 L14 -2 L13 32 Q-4 38 -24 33 Z" fill={rider.robe} stroke={ink(rider.robe)} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M-6 6 L-6 34" stroke={ink(rider.robe)} strokeWidth={1.8} opacity={0.6} strokeLinecap="round" />
          <path d="M-30 -8 Q-6 -15 18 -8 Q22 -2 18 4 Q-6 9 -30 4 Q-34 -2 -30 -8 Z" fill={rider.robe} stroke={ink(rider.robe)} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M2 -5 Q56 -16 107 -31" stroke="#7a3a22" strokeWidth={2} fill="none" strokeLinecap="round" />
          {[-13.6, 1.6].map((hx) => <circle key={hx} cx={hx} cy={-5} r={6.6} fill={rider.skin} stroke={ink(rider.skin)} strokeWidth={1.8} />)}
        </g>
      )}
    </g>
  )
}

/** A big horse, standing in the box. */
const BigHorseItem = () => <BigHorse x={42} y={92} s={0.32} />


export const ISL_PALM_SUNDAY: Item[] = [
  { id: 'palm-branch', name: 'palm branch', emoji: [], Draw: PalmBranchItem },
  { id: 'palm-tree', name: 'palm tree', emoji: ['🌴'], Draw: PalmTreeShape },
  { id: 'stones', name: 'stones', emoji: [], Draw: StonesItem },
  { id: 'big-horse', name: 'big horse', emoji: [], Draw: BigHorseItem },
]
