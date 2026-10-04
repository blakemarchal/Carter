// Drawn things first needed by the Samuel Listens island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//
// Samuel's little coat, God's golden lamp and the little clay lamps are drawn here (and exported), so the
// story pictures (scenes/samuel.tsx) and the mini-game (games/samuel.tsx) draw them just the same.
import type { CSSProperties } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, lighten, Shine, useShade } from './draw'
import { Baby } from '../people'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

// ---------- Samuel's little coat ----------

/** The teal of the little coats Hannah made for Samuel (and of the robe he wears grown up). */
export const COAT_TEAL = '#2e8f86'
const COAT_GOLD = '#f2c94c'
/** Baby Samuel's blanket: soft mint. */
export const SAMUEL_BLANKET = '#d3ece4'

const COAT = 'M-11 -38 Q0 -30 11 -38 L25 -35 Q36 -28 43 -17 L35 -6 Q29 -10 24 -14 L31 38 Q0 45 -31 38 L-24 -14 Q-29 -10 -35 -6 L-43 -17 Q-36 -28 -25 -35 Z'

/**
 * Samuel's little coat, laid out flat: a teal robe with short sleeves, open down the front, with gold trim at
 * the neck, the cuffs, the hem and the front edges, and a little red heart sewn on (his mom made it). (x, y):
 * its middle; about 86 wide and 82 tall at s = 1.
 */
export function LittleCoat({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  const c = useShade(COAT_TEAL, 0.32, 0.22)
  const line = ink(COAT_TEAL)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} {...ROUND}>
      <defs>{c.def}</defs>
      <path d={COAT} fill={c.fill} stroke={line} strokeWidth={2.6} />
      {/* the folds of the sleeves, and the front edges meeting down the middle */}
      <path d="M24 -14 Q27 -24 25 -33 M-24 -14 Q-27 -24 -25 -33" stroke={darken(COAT_TEAL, 0.18)} strokeWidth={1.8} fill="none" />
      <path d="M-2.2 -30.5 L-1.7 40.6" stroke={COAT_GOLD} strokeWidth={3.4} fill="none" />
      <path d="M2.2 -30.5 L2.7 40.6" stroke={COAT_GOLD} strokeWidth={3.4} fill="none" />
      <path d="M0.3 -30 L0.5 40.8" stroke={darken(COAT_TEAL, 0.3)} strokeWidth={1.2} fill="none" />
      {/* gold trim: the neck, the cuffs and the hem */}
      <path d="M-11 -38 Q0 -30 11 -38" stroke={COAT_GOLD} strokeWidth={4} fill="none" />
      <path d="M42 -15.5 L35.5 -7.5 M-42 -15.5 L-35.5 -7.5" stroke={COAT_GOLD} strokeWidth={4.4} fill="none" />
      <path d="M-29.6 33.4 Q0 40.2 29.6 33.4" stroke={COAT_GOLD} strokeWidth={4.6} fill="none" />
      {[-22, -13, -4.5, 5.5, 14, 23].map((dx) => <circle key={dx} cx={dx} cy={34.6 + (1 - (dx / 30) ** 2) * 3.2} r={1.2} fill="#c0504d" />)}
      {/* the little heart */}
      <path d="M13 -9 C6 -13 7.5 -20 11 -20 C12.3 -20 13 -19 13 -17.8 C13 -19 13.7 -20 15 -20 C18.5 -20 20 -13 13 -9 Z" fill="#ff6f91" stroke="#c94a6a" strokeWidth={1.4} />
      <path d={COAT} fill="none" stroke={line} strokeWidth={2.6} />
      <Shine x={-14} y={-20} rx={5} ry={3} />
    </g>
  )
}

/** A coat on its own in the box, its hem resting near the bottom: `k` is how big it is (1 = full size). */
const coatItem = (k: number) => function CoatOfSize() {
  return (
    <g>
      <ellipse {...groundShadow(50, 92, 30 * k + 6)} />
      <LittleCoat x={50} y={90 - 43 * k} s={k} />
    </g>
  )
}

// ---------- God's golden lamp ----------

const GOLD = '#f2c440'
const GOLD_INK = '#a8761c'

/** A flame (its foot at (x, y), h tall), flickering. `d`: when it flickers. */
export function Flame({ x, y, h = 16, d = 0 }: { x: number; y: number; h?: number; d?: number }) {
  const w = h * 0.36
  return (
    <g className="sm-flicker" style={{ animationDelay: `${d}s` } as CSSProperties}>
      <path d={`M${x} ${y} C${x - w * 1.2} ${y - h * 0.35} ${x - w * 0.55} ${y - h * 0.75} ${x} ${y - h} C${x + w * 0.55} ${y - h * 0.75} ${x + w * 1.2} ${y - h * 0.35} ${x} ${y} Z`}
        fill="#ffb347" stroke="#f08a2a" strokeWidth={1.2} />
      <path d={`M${x} ${y - h * 0.08} C${x - w * 0.6} ${y - h * 0.32} ${x - w * 0.3} ${y - h * 0.58} ${x} ${y - h * 0.72} C${x + w * 0.3} ${y - h * 0.58} ${x + w * 0.6} ${y - h * 0.32} ${x} ${y - h * 0.08} Z`}
        fill="#fff3b0" />
    </g>
  )
}

/**
 * God's lamp in His house (1 Samuel 3:3): a golden lampstand with seven little lamps, one on top of its stem
 * and three on the branches either side, curving up from it. `lit`: their flames burn, in a warm glow. (x, y)
 * = its foot; about 124 wide and 150 tall at s = 1 (with its flames).
 */
export function GoldenLampstand({ x, y, s = 1, lit = true, glow = 96 }: { x: number; y: number; s?: number; lit?: boolean; glow?: number }) {
  const tops = [-54, -36, -18, 0, 18, 36, 54]
  const arms: [number, number][] = [[54, -50], [36, -72], [18, -94]]
  const arm = (w: number, yb: number) => `M${-w} -126 Q${-w} ${yb} 0 ${yb} Q${w} ${yb} ${w} -126`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} {...ROUND}>
      {/* the branches and the stem: a dark edge, the gold, and a shine along them */}
      {arms.map(([w, yb]) => <path key={w} d={arm(w, yb)} stroke={GOLD_INK} strokeWidth={8} fill="none" />)}
      <path d="M0 -10 L0 -128" stroke={GOLD_INK} strokeWidth={10} />
      {arms.map(([w, yb]) => <path key={`g${w}`} d={arm(w, yb)} stroke={GOLD} strokeWidth={5} fill="none" />)}
      <path d="M0 -10 L0 -128" stroke={GOLD} strokeWidth={6.5} />
      {arms.map(([w, yb]) => <path key={`s${w}`} d={`M${-w + 1.2} -122 Q${-w + 1.2} ${yb + 2} 0 ${yb + 1.4}`} stroke="#fff1a8" strokeWidth={1.4} fill="none" opacity={0.85} />)}
      <path d="M-1.4 -14 L-1.4 -124" stroke="#fff1a8" strokeWidth={1.6} opacity={0.85} />
      {/* little round knobs on the stem */}
      {[-30, -50, -72, -94].map((ky) => <ellipse key={ky} cx={0} cy={ky} rx={6} ry={4.2} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.8} />)}
      {/* the foot */}
      <path d="M-28 0 Q-26 -9 -10 -12 L-5 -18 L5 -18 L10 -12 Q26 -9 28 0 Z" fill={GOLD} stroke={GOLD_INK} strokeWidth={2.2} />
      <path d="M-20 -4 Q-16 -9 -8 -10" stroke="#fff1a8" strokeWidth={1.6} fill="none" />
      {/* the seven lamps, each in a little gold cup, and their flames */}
      {lit && <Glow3 r={glow} y={-138} />}
      {tops.map((tx, i) => (
        <g key={tx}>
          <path d={`M${tx - 8} -130 Q${tx} -119 ${tx + 8} -130 Z`} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.8} />
          <ellipse cx={tx} cy={-130} rx={8} ry={2.2} fill="#c98f2a" stroke={GOLD_INK} strokeWidth={1.2} />
          {lit ? <Flame x={tx} y={-131} h={15} d={-i * 0.23} /> : <path d={`M${tx} -131 L${tx} -135`} stroke="#4a3a3a" strokeWidth={1.6} />}
        </g>
      ))}
    </g>
  )
}

/** A soft round glow at (0, y), r across (drawn behind the flames, in the lamp's own units). */
function Glow3({ r, y }: { r: number; y: number }) {
  return (
    <g className="pa-twinkle" style={{ animationDuration: '3.2s' } as CSSProperties}>
      <ellipse cx={0} cy={y} rx={r} ry={r * 0.72} fill="#ffd56e" opacity={0.2} />
      <ellipse cx={0} cy={y} rx={r * 0.72} ry={r * 0.46} fill="#ffeaa0" opacity={0.3} />
    </g>
  )
}

// ---------- A little clay lamp ----------

const CLAY = '#cf7f4c'

/**
 * A little clay oil lamp, its spout to the right and a handle at the back. `lit`: a flame burns at its spout,
 * in a warm glow (`glow`: how big). (x, y): the middle of its bottom; about 50 wide at s = 1.
 */
export function ClayLamp({ x, y, s = 1, lit, glow = 52, d = 0 }: { x: number; y: number; s?: number; lit?: boolean; glow?: number; d?: number }) {
  const c = useShade(CLAY, 0.32, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} {...ROUND}>
      <defs>{c.def}</defs>
      {lit && (
        <g className="pa-twinkle" style={{ animationDuration: '2.6s', animationDelay: `${d}s` } as CSSProperties}>
          <circle cx={22} cy={-20} r={glow} fill="#ffe08a" opacity={0.18} />
          <circle cx={22} cy={-20} r={glow * 0.55} fill="#fff1b0" opacity={0.3} />
        </g>
      )}
      {/* the handle */}
      <path d="M-20 -10 C-30 -12 -30 2 -19 -1" stroke={ink(CLAY)} strokeWidth={6} fill="none" />
      <path d="M-20 -10 C-30 -12 -30 2 -19 -1" stroke={CLAY} strokeWidth={3} fill="none" />
      <path d="M-21 -6 Q-22 -16 -5 -17 L11 -16 Q21 -16 25 -12 Q21 -6 11 -5 Q4 0 -6 0 Q-19 0 -21 -6 Z" fill={c.fill} stroke={ink(CLAY)} strokeWidth={2.2} />
      <ellipse cx={-3} cy={-14.5} rx={7.5} ry={2.4} fill={darken(CLAY, 0.18)} stroke={ink(CLAY)} strokeWidth={1.4} />
      <ellipse cx={-3} cy={-14.3} rx={3.6} ry={1.2} fill="#4a2a1a" />
      {[-14, -8, -2, 4].map((dx) => <circle key={dx} cx={dx} cy={-7} r={1.1} fill={darken(CLAY, 0.28)} />)}
      <ellipse cx={-12} cy={-10} rx={3.6} ry={2} fill={lighten(CLAY, 0.5)} opacity={0.6} transform="rotate(-20 -12 -10)" />
      {/* the wick at the spout, and its flame */}
      <path d="M23.5 -12.5 L25 -15.5" stroke="#4a3a3a" strokeWidth={2} />
      {lit && <Flame x={25} y={-14.5} h={17} d={d} />}
    </g>
  )
}

// ---------- The items ----------

/** God's golden lamp, glowing, in its box. */
const GodsLampItem = () => (
  <g>
    <ellipse {...groundShadow(50, 95, 24)} />
    <GoldenLampstand x={50} y={94} s={0.53} glow={54} />
  </g>
)

/** A baby boy, wrapped up snug in a soft blanket, asleep. */
const SwaddledBaby = () => (
  <g>
    <ellipse {...groundShadow(52, 80, 36)} />
    <Baby x={54} y={56} s={1.42} blanket={SAMUEL_BLANKET} />
  </g>
)

export const ISL_SAMUEL: Item[] = [
  // (🧥 already names Joseph's coat; these are Samuel's, asked for by id. One at full size, and four sizes
  // for putting them in order, smallest to biggest: he grew every year, and so did his coat.)
  { id: 'samuel-coat', name: "Samuel's little coat", emoji: [], Draw: coatItem(1) },
  { id: 'samuel-coat-1', name: 'the tiny coat', emoji: [], Draw: coatItem(0.46) },
  { id: 'samuel-coat-2', name: 'the little coat', emoji: [], Draw: coatItem(0.64) },
  { id: 'samuel-coat-3', name: 'the bigger coat', emoji: [], Draw: coatItem(0.82) },
  { id: 'samuel-coat-4', name: 'the biggest coat', emoji: [], Draw: coatItem(1) },
  // (🕎 is a Hanukkah menorah, with nine lamps: this is the lampstand in God's house, with seven.)
  { id: 'gods-lamp', name: "God's golden lamp", emoji: [], Draw: GodsLampItem },
  // (👶 stays a plain baby emoji everywhere; this one is asked for by id.)
  { id: 'swaddled-baby', name: 'a baby boy', emoji: [], Draw: SwaddledBaby },
]
