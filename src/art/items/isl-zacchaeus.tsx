// Drawn things first needed by the Zacchaeus island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//
// Zacchaeus himself, his sycamore tree and his coins live here too (not in scenes/zacchaeus.tsx), because the
// items draw them and an item file must never pull in an island's scene file: the story pictures, the
// mini-game and the items all draw him the same way from these.
//   ZACCHAEUS: his look (a grown man with a short dark beard, a gold head cloth, a rich purple robe and a gold
//              sash); for PEOPLE in people.tsx later.
//   Zacchaeus: him standing (a Figure, a little shorter than other grown-ups, with his coin purse at his sash);
//              ZacchaeusPerched: him sitting on a branch, his legs hanging down.
//   Sycamore:  the big sycamore fig tree he climbs, with a low branch to sit on (SEAT); Clumps, its front leaves.
//   Coin, CoinStack, CoinChest: Bible-time gold coins, a stack of them, and his open chest full of them.
import { useId, type ReactNode } from 'react'
import type { Item } from './types'
import { Figure, SKIN, type JLook, type JPose, type Mood } from '../people'
import { darken, fluff, groundShadow, ink, lighten, useShade } from './draw'

type Pt = [number, number]
const f1 = (n: number) => n.toFixed(1)

// ---------- Zacchaeus ----------

/** Zacchaeus, the rich tax collector of Jericho: a short dark beard, a gold head cloth, a rich purple robe and a gold sash. */
export const ZACCHAEUS: JLook = {
  skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#f2c24a',
  beard: 'short', beardColor: '#4a3020', robe: '#7a4ab4', sash: '#f2c24a',
}
/** He was short (Luke 19:3): drawn this much smaller than the grown-ups around him. Never smaller than that. */
export const SHORT = 0.8

/** His coin purse: a round leather pouch, its frilly top tied with a gold cord, hanging from his sash on his right side (figure units). */
export const Purse = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <path d="M10.5 -47 L12.5 -40 M16.5 -47 L14.5 -40" stroke="#6b4422" strokeWidth={1.5} fill="none" />
    <path d="M11 -37 Q3.5 -34 4 -28.5 Q5 -22.5 13.5 -22.5 Q22 -22.5 23 -28.5 Q23.5 -34 16 -37 Z" fill="#b5803e" stroke="#6b4422" strokeWidth={1.8} />
    <path d="M11 -37.5 L6.5 -43.5 L9.5 -42 L11 -45.5 L13.5 -42.5 L16 -45.5 L17.5 -42 L20.5 -43.5 L16 -37.5 Z" fill="#c99350" stroke="#6b4422" strokeWidth={1.4} />
    <path d="M10 -37.5 L17 -37.5" stroke="#ffd34d" strokeWidth={2.6} />
    <ellipse cx={9.5} cy={-30} rx={2} ry={3.2} fill="#fff" opacity={0.25} />
  </g>
)

/**
 * Zacchaeus standing (Figure's poses and moods). `s` is the size a grown-up standing there would be; he's
 * drawn SHORT of it, so he's always a little shorter than everyone around him. (x, y) = his feet.
 * `item` is drawn between his arms and his hands (something held); `purse`: his coin purse (on by default).
 */
export function Zacchaeus({ x, y, s = 1, pose = 'stand', mood = 'happy', facing = 'right', blinkDelay = 0, reach, purse = true, item, children }: {
  x: number; y: number; s?: number; pose?: JPose; mood?: Mood; facing?: 'left' | 'right'; blinkDelay?: number
  reach?: [Pt | null, Pt | null]; purse?: boolean; item?: ReactNode; children?: ReactNode
}) {
  return (
    <Figure x={x} y={y} s={s * SHORT} look={ZACCHAEUS} pose={pose} mood={mood} facing={facing} blinkDelay={blinkDelay} reach={reach}
      item={<>{purse && <Purse />}{item}</>}>
      {children}
    </Figure>
  )
}

/** How far a sitting figure's hips come down onto the seat (as SittingOnRock does in people.tsx). */
const SIT_DROP = 14

/**
 * Zacchaeus sitting on a branch, facing us (SittingOnRock's way of sitting, with Figure's moods): his legs
 * hang down in front of the branch, his hands rest on it at his sides (pose "stand"). (x, y) = the middle of
 * his seat, on top of the branch; `s` as for Zacchaeus. `children` are drawn on him, in figure units.
 */
export function ZacchaeusPerched({ x, y, s = 1, mood = 'happy', pose = 'stand', reach, blinkDelay = 0, children }: {
  x: number; y: number; s?: number; mood?: Mood; pose?: JPose; reach?: [Pt | null, Pt | null]; blinkDelay?: number; children?: ReactNode
}) {
  const look = ZACCHAEUS
  const robe = useShade(look.robe, 0.3, 0.2)
  const clip = `zp${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    // (in SittingOnRock's units: the feet at 0 and the seat 30 up)
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s * SHORT}) translate(0 30)`}>
      <defs>{robe.def}<clipPath id={clip}><rect x={-120} y={-260} width={240} height={234} /></clipPath></defs>
      {/* shins and sandals, hanging down a little apart */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M${d * 13} -18 L${d * 14} -7`} stroke={ink(look.skin)} strokeWidth={12} strokeLinecap="round" />
          <path d={`M${d * 13} -18 L${d * 14} -7`} stroke={look.skin} strokeWidth={9} strokeLinecap="round" />
          <ellipse cx={d * 15} cy={-4} rx={10} ry={5} fill="#7a5233" />
        </g>
      ))}
      <g clipPath={`url(#${clip})`}>
        <Figure x={0} y={SIT_DROP} look={look} pose={pose} mood={mood} reach={reach} blinkDelay={blinkDelay}>{children}</Figure>
      </g>
      {/* the lap: the robe over his knees, hanging over the branch */}
      <path d="M-28 -31 Q0 -24 28 -31 Q34 -28 34 -22 Q34 -17 31 -15 Q23 -12 15 -14 Q7 -16 0 -13 Q-7 -16 -15 -14 Q-23 -12 -31 -15 Q-34 -17 -34 -22 Q-34 -28 -28 -31 Z"
        fill={robe.fill} stroke={ink(look.robe)} strokeWidth={3} strokeLinejoin="round" />
      {[-1, 1].map((d) => <ellipse key={d} cx={d * 17} cy={-24} rx={9} ry={4.5} fill="#fff" opacity={0.16} />)}
      <path d="M0 -26 Q-1 -20 0 -14" stroke={ink(look.robe)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.55} />
    </g>
  )
}

// ---------- The sycamore fig tree ----------
// A big sycamore fig: a short, thick trunk that splits into strong spreading branches (easy to climb), a wide
// round crown of leaves, and little figs growing in bunches on the branches. Its own units: (0, 0) is the foot
// of the trunk on the ground; at s = 1 it's about 420 tall and 500 wide, and a grown-up at s = 1 (150 tall)
// standing under it reaches about two thirds of the way up to its low branch.

/** Where Zacchaeus sits: the top of the low branch on the right, in the tree's own units. */
export const SEAT: Pt = [122, -206]

const BARK = '#a07a52'
const LEAF = { back: '#3f8a46', mid: '#4ea653', front: '#63bd5f', line: '#2f6a36' }

/** A smooth branch: the line a → (b) → c, w0 wide at a and w1 at c, with round ends. */
function branch(a: Pt, b: Pt, c: Pt, w0: number, w1: number, n = 18) {
  const at = (t: number): Pt => {
    const u = 1 - t
    return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
  }
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = at(t)
    const [x1, y1] = at(Math.max(0, t - 0.01)), [x2, y2] = at(Math.min(1, t + 0.01))
    const d = Math.hypot(x2 - x1, y2 - y1) || 1
    const h = (w0 + (w1 - w0) * t) / 2
    L.push([x - ((y2 - y1) / d) * h, y + ((x2 - x1) / d) * h])
    R.unshift([x + ((y2 - y1) / d) * h, y - ((x2 - x1) / d) * h])
  }
  const r1 = w1 / 2, r0 = w0 / 2
  return `M${L.map((p) => p.map(f1).join(' ')).join(' L')} A${f1(r1)} ${f1(r1)} 0 0 0 ${R[0].map(f1).join(' ')} L${R.map((p) => p.map(f1).join(' ')).join(' L')} A${f1(r0)} ${f1(r0)} 0 0 0 ${L[0].map(f1).join(' ')} Z`
}

/** A clump of leaves: [x, y, rx, ry] (a soft scalloped oval). */
export type Clump = [cx: number, cy: number, rx: number, ry: number]

/** A few little leaves on a clump (light from the top left). */
const LeafMarks = ({ cx, cy, rx, ry, color }: { cx: number; cy: number; rx: number; ry: number; color: string }) => (
  <g fill={color} opacity={0.75}>
    {[[-0.45, -0.1, -30], [0.1, -0.42, 20], [0.4, 0.15, 60], [-0.1, 0.38, -10]].map(([kx, ky, r], i) => (
      <path key={i} d="M0 -6 Q4.5 0 0 6 Q-4.5 0 0 -6 Z" transform={`translate(${f1(cx + kx * rx)} ${f1(cy + ky * ry)}) rotate(${r})`} />
    ))}
  </g>
)

/** Clumps of leaves in front (outlined, with a soft shine and a few leaves drawn on), as the tree's front leaves. */
export function Clumps({ clumps, color = LEAF.front }: { clumps: Clump[]; color?: string }) {
  return (
    <g>
      {clumps.map(([cx, cy, rx, ry], i) => (
        <g key={i}>
          <path d={fluff(cx, cy, rx, ry, Math.max(7, Math.round((rx + ry) / 9)), 0.62)} fill={color} stroke={LEAF.line} strokeWidth={4} strokeLinejoin="round" />
          <ellipse cx={cx - rx * 0.22} cy={cy - ry * 0.32} rx={rx * 0.45} ry={ry * 0.3} fill="#fff" opacity={0.14} />
          <LeafMarks cx={cx} cy={cy} rx={rx} ry={ry} color={lighten(color, 0.38)} />
        </g>
      ))}
    </g>
  )
}

/** A little bunch of sycamore figs, growing on a branch: [x, y] for each fig. */
const Figs = ({ spots }: { spots: Pt[] }) => (
  <g>
    {spots.map(([fx, fy], i) => (
      <g key={i}>
        <circle cx={fx} cy={fy} r={6.2} fill={i % 3 === 1 ? '#e9a04a' : '#d9785a'} stroke="#9a4a32" strokeWidth={1.8} />
        <circle cx={fx - 1.8} cy={fy - 2} r={1.6} fill="#fff" opacity={0.45} />
      </g>
    ))}
  </g>
)

/** Leaves drawn on the crown, spread over it like the seeds of a sunflower: [x, y, turn]. */
const CROWN_LEAVES: [number, number, number][] = Array.from({ length: 40 }, (_, i) => {
  const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 40)
  return [Math.cos(a) * r * 218, -292 + Math.sin(a) * r * 104, (i * 47) % 180]
})
// (none of the front clumps reach the space where Zacchaeus sits, round SEAT)
const FRONT: Clump[] = [[-186, -214, 58, 34], [-48, -326, 46, 30], [60, -334, 44, 28], [-128, -332, 50, 30], [152, -334, 46, 26], [212, -222, 40, 28], [-4, -392, 56, 28]]

/** Where a bird can stand on the big branch on the left (on top of it, clear of the leaves), in the tree's own units. */
export const PERCH_LEFT: Pt = [-90, -191]

/**
 * The sycamore fig tree. (x, y) = the foot of its trunk; `s` its size (see above). `children` are drawn in
 * the tree's own units, in front of its branches and behind its front leaves: Zacchaeus up on the low
 * branch at SEAT. `front={false}` leaves out the front leaves (to draw your own).
 */
export function Sycamore({ x, y, s = 1, front = true, children }: { x: number; y: number; s?: number; front?: boolean; children?: ReactNode }) {
  const bark = useShade(BARK, 0.22, 0.2)
  const line = darken(BARK, 0.4)
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <defs>{bark.def}</defs>
      <ellipse cx={4} cy={0} rx={150} ry={12} fill="#000" opacity={0.12} />
      {/* the crown: one big scalloped mass of leaves, lighter toward the top left where the sun is */}
      <path d={fluff(0, -292, 250, 128, 22, 0.62)} fill={LEAF.back} stroke={LEAF.line} strokeWidth={4} strokeLinejoin="round" />
      <path d={fluff(-26, -314, 204, 98, 18, 0.62)} fill={LEAF.mid} />
      <path d={fluff(-70, -344, 132, 58, 13, 0.62)} fill={LEAF.front} />
      {CROWN_LEAVES.map(([lx, ly, r], i) => (
        <path key={i} d="M0 -6 Q4.5 0 0 6 Q-4.5 0 0 -6 Z" transform={`translate(${f1(lx)} ${f1(ly)}) rotate(${r})`} fill={lighten(LEAF.mid, 0.36)} opacity={0.6} />
      ))}
      {/* the branches up into the crown (behind), then the trunk with its roots, and the two low branches */}
      <g fill={bark.fill} stroke={line} strokeWidth={4} strokeLinejoin="round">
        <path d={branch([-6, -150], [-18, -250], [-44, -318], 30, 12)} />
        <path d={branch([8, -150], [40, -250], [56, -326], 28, 12)} />
        <path d={branch([-14, -140], [-80, -170], [-176, -236], 32, 13)} />
        <path d="M-58 0 Q-36 -8 -32 -40 Q-28 -100 -24 -150 L24 -150 Q26 -96 32 -40 Q36 -8 60 0 Z" />
        <path d={branch([10, -150], [60, -190], [196, -214], 34, 16)} />
      </g>
      {/* bark lines and a knot */}
      <g stroke={line} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.55}>
        <path d="M-12 -20 Q-8 -70 -10 -120" />
        <path d="M10 -30 Q14 -80 8 -132" />
        <path d="M60 -186 Q100 -200 150 -206" />
      </g>
      <ellipse cx={-2} cy={-86} rx={6} ry={8} fill={darken(BARK, 0.25)} stroke={line} strokeWidth={2} />
      {/* figs grow in bunches right on the trunk and branches */}
      <Figs spots={[[-22, -118], [-30, -110], [-18, -106], [174, -200], [182, -210], [-128, -196], [-118, -190], [34, -166], [44, -172], [-8, -238], [2, -244]]} />
      {children}
      {front && <Clumps clumps={FRONT} />}
    </g>
  )
}

// ---------- Coins ----------

const GOLD = '#ffcc33'

/** A Bible-time gold coin, seen a little from above, with a palm branch stamped on it. (x, y): its middle; about 80 across at s = 1. */
export function Coin({ x = 0, y = 0, s = 1, tilt = 0 }: { x?: number; y?: number; s?: number; tilt?: number }) {
  const face = useShade(GOLD, 0.45, 0.16)
  const line = darken(GOLD, 0.45)
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${tilt}) scale(${s})`}>
      <defs>{face.def}</defs>
      <ellipse cx={0} cy={5} rx={40} ry={35} fill={darken(GOLD, 0.25)} stroke={line} strokeWidth={3} />
      <ellipse cx={0} cy={0} rx={40} ry={35} fill={face.fill} stroke={line} strokeWidth={3} />
      <ellipse cx={0} cy={0} rx={31} ry={27} fill="none" stroke={darken(GOLD, 0.16)} strokeWidth={3} />
      {/* a palm branch: a stem with leaves out to both sides */}
      <g stroke={darken(GOLD, 0.3)} strokeWidth={3.2} strokeLinecap="round" fill="none">
        <path d="M0 18 Q1 0 0 -18" />
        {[-12, -5, 2, 9].map((ly, i) => (
          <g key={ly}>
            <path d={`M0 ${ly} q-7 -2 -${11 - i} -${8 - i}`} />
            <path d={`M0 ${ly} q7 -2 ${11 - i} -${8 - i}`} />
          </g>
        ))}
      </g>
      <path d="M-26 -14 Q-20 -26 -6 -30" stroke="#fff" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.75} />
    </g>
  )
}

/** A stack of n coins seen from the side (x, y: the bottom of the stack); each coin is 24 wide at s = 1. */
export function CoinStack({ x, y, n, s = 1 }: { x: number; y: number; n: number; s?: number }) {
  const line = darken(GOLD, 0.45)
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(${i % 2 ? 1 : -1} ${-i * 5})`}>
          <path d="M-12 -2 L-12 2 Q0 7 12 2 L12 -2 Z" fill={darken(GOLD, 0.2)} stroke={line} strokeWidth={1.4} />
          <ellipse cx={0} cy={-2} rx={12} ry={4.2} fill={i === n - 1 ? lighten(GOLD, 0.25) : GOLD} stroke={line} strokeWidth={1.4} />
        </g>
      ))}
    </g>
  )
}

/** A wooden chest, open, heaped with gold coins (x, y: the middle of its foot); about 110 wide at s = 1. */
export function CoinChest({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wood = useShade('#a0612f', 0.22, 0.2)
  const line = '#5a3418'
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <defs>{wood.def}</defs>
      <ellipse cx={0} cy={0} rx={62} ry={6} fill="#000" opacity={0.14} />
      {/* the lid, open behind */}
      <path d="M-50 -60 L-46 -96 Q0 -112 46 -96 L50 -60 Z" fill={wood.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-47 -86 Q0 -100 47 -86" stroke="#e8b84a" strokeWidth={4} fill="none" />
      {/* the heap of coins */}
      <path d="M-50 -58 Q-40 -82 -14 -80 Q0 -92 16 -80 Q42 -84 50 -58 Z" fill={GOLD} stroke={darken(GOLD, 0.45)} strokeWidth={2.5} strokeLinejoin="round" />
      {[[-32, -66], [-14, -74], [6, -80], [24, -72], [38, -64], [-4, -64], [16, -62], [-24, -60]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={8} ry={3.6} fill={i % 2 ? lighten(GOLD, 0.3) : GOLD} stroke={darken(GOLD, 0.4)} strokeWidth={1.5} transform={`rotate(${(i % 3) * 12 - 12} ${cx} ${cy})`} />
      ))}
      {/* the box, with gold bands */}
      <path d="M-56 -60 L56 -60 L52 -2 L-52 -2 Z" fill={wood.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-30 -60 L-29 -2 M30 -60 L29 -2" stroke="#e8b84a" strokeWidth={6} />
      <path d="M-30 -60 L-29 -2 M30 -60 L29 -2" stroke="#b5862a" strokeWidth={6} strokeDasharray="1 8" />
      <rect x={-9} y={-50} width={18} height={16} rx={3} fill="#e8b84a" stroke="#8a6a1a" strokeWidth={2} />
      <circle cx={0} cy={-43} r={2.5} fill="#5a3418" />
    </g>
  )
}

// ---------- The items ----------

/** A gold coin from Bible times. */
const GoldCoin = () => <Coin x={50} y={50} s={1.04} />

/** The big sycamore fig tree, standing on the grass. */
const SycamoreTree = () => (
  <g>
    <ellipse {...groundShadow(50, 95, 34)} />
    <Sycamore x={50} y={95} s={0.19} />
  </g>
)

/** Zacchaeus up in the sycamore tree, sitting on its low branch, happy (the sticker). Drawn bigger than he'd be, to show his face. */
const ZacchaeusInTree = () => (
  <g>
    <ellipse {...groundShadow(44, 95, 30)} />
    <g transform="translate(40 95) scale(0.19)">
      <Sycamore x={0} y={0} front={false} />
      {/* he sits on the low branch, at the tree's SEAT, at 0.42 (the tree is at 0.19: he's drawn big, to show his face) */}
      <g transform={`translate(${SEAT[0]} ${SEAT[1]}) scale(${1 / 0.19})`}>
        <ZacchaeusPerched x={0} y={0} s={0.42 / SHORT} mood="joy" pose="wave" />
      </g>
      <Clumps clumps={[[-186, -214, 58, 34], [-128, -332, 50, 30], [-30, -330, 40, 26], [-34, -400, 50, 26], [262, -220, 30, 24]]} />
    </g>
  </g>
)

/** Zacchaeus running as fast as he can (facing left, as animal emoji do: the maze turns him round), dust behind him. */
const ZacchaeusRunning = () => (
  <g>
    <ellipse {...groundShadow(50, 95, 22)} />
    <g fill="#efe0c0" opacity={0.9}>
      <circle cx={78} cy={90} r={5.5} /><circle cx={87} cy={86} r={4} /><circle cx={94} cy={91} r={3} />
    </g>
    <path d="M74 44 L88 44 M76 56 L92 56 M78 68 L90 68" stroke="#c9b48a" strokeWidth={2.6} strokeLinecap="round" />
    {/* (facing left, his right arm swings forward and up, his left arm back and down) */}
    <g transform="rotate(-8 50 95)">
      <Zacchaeus x={50} y={96} s={0.6 / SHORT} facing="left" mood="joy" reach={[[-38, -50], [42, -100]]} />
    </g>
  </g>
)

/** A diamond kite flying up on its string: four bright panels on two crossed sticks, and a tail of little bows. (A quiz's silly answer: "To fly a kite".) */
const Kite = () => {
  const panels: [string, string][] = [
    ['M56 8 L56 46 L22 40 Z', '#ff6f6f'], ['M56 8 L84 38 L56 46 Z', '#ffd34d'],
    ['M22 40 L56 46 L56 76 Z', '#5fb7ff'], ['M56 46 L84 38 L56 76 Z', '#5fd39a'],
  ]
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* the string, down to the hand that holds it (off the bottom of the picture) */}
      <path d="M56 46 Q74 70 96 98" stroke="#8a7a6a" strokeWidth={1.8} fill="none" />
      {/* the tail, with three bows */}
      <path d="M56 76 Q44 84 46 92 Q48 98 40 100" stroke="#8a7a6a" strokeWidth={1.8} fill="none" />
      {[[50, 83, '#ff8cc0'], [46, 92, '#5fb7ff'], [42, 99, '#ffd34d']].map(([bx, by, c]) => (
        <path key={String(bx)} d={`M${bx} ${by} l-6 -4 l0 8 Z M${bx} ${by} l6 -4 l0 8 Z`} fill={String(c)} stroke={ink(String(c))} strokeWidth={1.2} />
      ))}
      {panels.map(([d, c]) => <path key={d} d={d} fill={c} />)}
      <path d="M56 8 L84 38 L56 76 L22 40 Z" fill="none" stroke="#5a4a6a" strokeWidth={2.6} />
      <path d="M56 8 L56 76 M22 40 L84 38" stroke="#8a5a2e" strokeWidth={2.4} />
      <path d="M50 16 Q44 22 40 30" stroke="#fff" strokeWidth={3} fill="none" opacity={0.6} />
    </g>
  )
}

export const ISL_ZACCHAEUS: Item[] = [
  { id: 'gold-coin', name: 'coin', emoji: ['🪙'], Draw: GoldCoin },
  { id: 'sycamore-tree', name: 'sycamore tree', emoji: [], Draw: SycamoreTree },
  { id: 'zacchaeus-in-tree', name: 'Zacchaeus up in the sycamore tree', emoji: [], Draw: ZacchaeusInTree },
  { id: 'zacchaeus-running', name: 'Zacchaeus running', emoji: [], Draw: ZacchaeusRunning },
  { id: 'kite', name: 'kite', emoji: ['🪁'], Draw: Kite },
]
