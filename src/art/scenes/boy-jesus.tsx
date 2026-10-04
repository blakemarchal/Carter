// Boy Jesus at the Temple: one picture per story page, both parts in order (see data/boy-jesus.ts for the words).
// Part one, pages 1 to 6: getting ready in Nazareth, the long walk with family and friends, Jerusalem and God's house
// shining on its hill, praising God in the busy courts, the Passover dinner, and the walk home (Jesus stays behind).
// Part two, pages 7 to 12: looking for Jesus at the camp that evening, then all over the city; finding Him on the third
// day with the teachers; everyone amazed; "My Father's house"; and home again in Nazareth, helping Joseph.
// God is never drawn as a person: His presence is light (Glow, Rays, Sparkles). Jesus is a boy of twelve (BOY_JESUS: the
// grown-up Jesus' look, as a boy). Mary and Joseph are PEOPLE.mary and PEOPLE.joseph, twelve years after Christmas.
// Shared with the mini-game (art/games/boy-jesus.tsx), and for other islands (they can move to kit.tsx and people.tsx):
// the looks (BOY_JESUS, the family, TEACHERS, pilgrim), the faces (Amazed, Talking, JosephSilver), God's golden
// Lampstand, OpenScroll, RolledScroll, SittingDove and Sparrow. God's house in Jerusalem (Temple, Colonnade, Paving,
// Flame), Jerusalem with its FarHouses, the CityWall and the Donkey are the kit's (scenes/kit.tsx), for every island.
import type { ComponentProps, ComponentType, CSSProperties, ReactNode } from 'react'
import { ink } from '../kit'
import { Figure, Kneel, Person, PEOPLE, SilverHair, Sitting, SittingOnRock, SKIN, type Look } from '../people'
import {
  Birds, CampTent, CityWall, Cloud, Colonnade, Donkey, Emoji, FarHouses, Flame, Glow, Jerusalem, MudHouse, MusicNote, Paving, Rays, Scene,
  Sparkles, Sun, Tap, Temple, TEMPLE_COLORS, Tree, TENT_CLOTHS, FAMILY_TENT, sparkle,
} from './kit'
import './boy-jesus.css'

type PersonProps = ComponentProps<typeof Person>

// ---------- People ----------

/**
 * Jesus at twelve: the grown-up Jesus (PEOPLE.jesus) as a boy, with the same skin, long dark-brown hair, cream robe and
 * red sash, and no beard yet. A child's build, drawn a little bigger than the little ones (at s × JESUS_K: BoyJesus).
 */
export const BOY_JESUS: Look = PEOPLE.boyJesus
/** How much bigger than a little child Jesus at twelve is drawn (Person's s, times this). */
export const JESUS_K = 1.14

/** Jesus at twelve, standing: Person at s × JESUS_K. `children` are drawn on Him, in His own units. */
export function BoyJesus({ s = 1, ...p }: Omit<PersonProps, 'look'>) {
  return <Person {...p} s={s * JESUS_K} look={BOY_JESUS} />
}

/** In a Person's own units, over PEOPLE.joseph: a little silver at his temples and in his beard (twelve years after Christmas). */
export const JosephSilver = () => (
  <g fill="none" stroke="#c4bcb1" strokeWidth={1.5} strokeLinecap="round">
    <path d="M-23.4 -124 Q-24.4 -118.5 -22.6 -113.5 M-21.4 -126 Q-22.2 -121 -21 -116.5" />
    <path d="M23.4 -124 Q24.4 -118.5 22.6 -113.5 M21.4 -126 Q22.2 -121 21 -116.5" />
    <path d="M-2.5 -94 Q-2 -91.5 -0.5 -90 M3 -95 Q3.4 -92.4 4.6 -91" stroke="#b3aa9e" strokeWidth={1.2} />
  </g>
)

/**
 * Joseph's tall walking stick, for a Figure (give it as its `item`, so the hand goes over it): from above his head down to
 * the ground at the hand's x, just as Person draws holding="stick" (Figure's own stick only reaches from the hand down).
 */
export const TallStick = ({ x }: { x: number }) => <path d={`M${x + 1} -150 L${x} -2`} stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />

/** Joseph, twelve years after Christmas: PEOPLE.joseph, with a little silver in his hair and beard. */
export function Joseph({ children, ...p }: Omit<PersonProps, 'look'>) {
  return <Person {...p} look={PEOPLE.joseph}><JosephSilver />{children}</Person>
}

/** Mary, twelve years after Christmas: PEOPLE.mary, the same as on the Baby Jesus island. */
export const Mary = (p: Omit<PersonProps, 'look'>) => <Person {...p} look={PEOPLE.mary} />

/** Family and friends on the road with them (Luke 2:44): an aunt and an uncle, their two children, a grandma and a grandpa. */
export const AUNT: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e07a8f', robe: '#8fbf7a', sash: '#f5e6c8' }
export const UNCLE: Look = { skin: SKIN.tan, hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#7a6bb0', sash: '#f0c24a' }
export const COUSIN_GIRL: Look = { skin: SKIN.tan, hair: 'pigtails', hairColor: '#3b2a20', robe: '#ffb347', sash: '#ffffff', bow: '#ff6f9a', build: 'child' }
export const COUSIN_BOY: Look = { skin: SKIN.tan, hair: 'curly', hairColor: '#2b1f18', robe: '#4fb8a8', sash: '#f0c24a', build: 'child' }
/** Grandma: draw her with <SilverHair /> as a child of her Person. */
export const GRANDMA: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#e9e5de', wrap: '#f5efe2', robe: '#b07a9a', sash: '#e8dcc0' }
export const GRANDPA: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#e8dcc0', beard: 'long', beardColor: '#f2efe8', robe: '#6f9f8a', sash: '#d9b56a' }

/** The teachers in God's house, who knew God's word well: head cloths and long beards (two of them gray), in rich robes. */
export const TEACHERS: Look[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#ece8e0', wrap: '#fbf8f1', beard: 'long', beardColor: '#f4f1ea', robe: '#3f5f9f', sash: '#e8c25a' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#8a8078', wrap: '#e2d3b0', beard: 'long', beardColor: '#a39a90', robe: '#7b4f8f', sash: '#f0d38a' },
  { skin: '#a8714a', hair: 'covered', hairColor: '#2b1f18', wrap: '#d9b56a', beard: 'short', beardColor: '#2b1f18', robe: '#2f7f86', sash: '#f5f0e6' },
  { skin: '#e3b48c', hair: 'covered', hairColor: '#4a3020', wrap: '#f0e4c4', beard: 'long', beardColor: '#5a3a24', robe: '#5a7f3f', sash: '#e8c25a' },
]

const P_SKINS = [SKIN.medium, SKIN.tan, '#a8714a', SKIN.deep, '#e3b48c']
const P_ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const P_WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff', '#86cdb2']
const P_HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24']

/**
 * Someone at the feast (`i` picks how they look): men in head cloths or with short hair and beards, women in head scarves;
 * or a `child`. (No woman wears a blue head scarf like Mary's, so nobody in a crowd looks like a second Mary.)
 */
export function pilgrim(i: number, child = false): Look {
  const skin = P_SKINS[(i * 3 + 1) % P_SKINS.length]
  const robe = P_ROBES[(i * 7 + 3) % P_ROBES.length]
  const wrap = P_WRAPS[(i * 5 + 2) % P_WRAPS.length]
  const scarf = wrap === '#7cb0e0' ? '#e8875a' : wrap
  const hairColor = P_HAIRS[(i * 3) % P_HAIRS.length]
  const sash = ['#f5f0e6', '#e6b85a', '#c0504d', '#5f8fc0'][(i * 5) % 4]
  if (child) return { skin, hair: i % 2 ? 'curly' : 'short', hairColor, robe, sash, build: 'child' }
  switch (i % 4) {
    case 0: return { skin, hair: 'covered', hairColor, wrap, beard: 'short', beardColor: hairColor, robe, sash }
    case 1: return { skin, hair: 'covered', hairColor, wrap: scarf, robe, sash }
    case 2: return { skin, hair: 'short', hairColor, beard: 'short', beardColor: hairColor, robe, sash }
    default: return { skin, hair: 'covered', hairColor, wrap: scarf, robe, sash: '#f5f0e6' }
  }
}

// ---------- Faces (in a Person's own units, drawn over their face) ----------

/** Amazed: eyebrows up and an "oh!" mouth over the smile (in the beard, colored `beard`). `skin` hides the smile. */
export const Amazed = ({ skin, beard }: { skin: string; beard?: string }) => (
  <g>
    <path d="M-12.5 -121 Q-8.5 -125 -4.5 -122 M12.5 -121 Q8.5 -125 4.5 -122" stroke="#2b2140" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    {beard ? (
      <g>
        <ellipse cx={0} cy={-98.4} rx={5.6} ry={2.6} fill={beard} />
        <ellipse cx={0} cy={-98} rx={2.7} ry={3.3} fill="#6b2a3a" stroke="#d0707e" strokeWidth={1.1} />
      </g>
    ) : (
      <g>
        <ellipse cx={0} cy={-104.2} rx={6.8} ry={3.4} fill={skin} />
        <ellipse cx={0} cy={-103.6} rx={2.9} ry={3.6} fill="#6b2a3a" stroke="#4a1a2a" strokeWidth={1.1} />
      </g>
    )}
  </g>
)

/** For someone without a beard: a big open smile (talking happily, or asking a question). */
export const Talking = () => (
  <path d="M-6 -106 Q0 -98 6 -106 Q0 -104 -6 -106 Z" fill="#6b2a3a" stroke="#4a1a2a" strokeWidth={1.3} strokeLinejoin="round" />
)

/** A happy word that pops up (in board units, its middle at x, y): for a tap's line in a picture, or a find in the game. */
export const Word = ({ x, y, text, size = 22, color = '#8a4fc4' }: { x: number; y: number; text: string; size?: number; color?: string }) => (
  <text x={x} y={y} fontSize={size} fontWeight={800} textAnchor="middle" fill={color} stroke="#ffffff" strokeWidth={5} strokeLinejoin="round"
    paintOrder="stroke" fontFamily="'Baloo 2', 'Chalkboard SE', system-ui, sans-serif">{text}</text>
)

// ---------- God's house in Jerusalem (the temple, its porches and its floor are the kit's) ----------

const { gold: GOLD, goldInk: GOLD_INK, stone: STONE, stoneInk: STONE_INK } = TEMPLE_COLORS
const GOLD_HI = '#fff1a8'
const WOOD = '#a0703f', WOOD_INK = '#6b4422', WOOD_LIGHT = '#d29a62'

/**
 * God's golden lamp in His house: a lampstand with seven little lamps, one on top of its stem and three on the branches
 * either side, curving up from it (drawn as on the Samuel island). `lit`: their flames burn, in a warm glow; unlit, its gold
 * is dim in the shade. (x, y) = its foot; about 124 wide and 150 tall at s = 1 (with its flames).
 */
export function Lampstand({ x, y, s = 1, lit = true, glow = 96 }: { x: number; y: number; s?: number; lit?: boolean; glow?: number }) {
  const gold = lit ? GOLD : '#c9a54e', line = lit ? GOLD_INK : '#86672a', hi = lit ? GOLD_HI : '#e6d39a'
  const tops = [-54, -36, -18, 0, 18, 36, 54]
  const arms: [number, number][] = [[54, -50], [36, -72], [18, -94]]
  const arm = (w: number, yb: number) => `M${-w} -126 Q${-w} ${yb} 0 ${yb} Q${w} ${yb} ${w} -126`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round" strokeLinejoin="round">
      {lit && (
        <g className="pa-twinkle" style={{ animationDuration: '3.2s' } as CSSProperties}>
          <ellipse cx={0} cy={-120} rx={glow} ry={glow * 0.8} fill="#ffd56e" opacity={0.22} />
          <ellipse cx={0} cy={-128} rx={glow * 0.72} ry={glow * 0.46} fill="#ffeaa0" opacity={0.32} />
        </g>
      )}
      {arms.map(([w, yb]) => <path key={w} d={arm(w, yb)} stroke={line} strokeWidth={8} fill="none" />)}
      <path d="M0 -10 L0 -128" stroke={line} strokeWidth={10} />
      {arms.map(([w, yb]) => <path key={`g${w}`} d={arm(w, yb)} stroke={gold} strokeWidth={5} fill="none" />)}
      <path d="M0 -10 L0 -128" stroke={gold} strokeWidth={6.5} />
      {arms.map(([w, yb]) => <path key={`s${w}`} d={`M${-w + 1.2} -122 Q${-w + 1.2} ${yb + 2} 0 ${yb + 1.4}`} stroke={hi} strokeWidth={1.4} fill="none" opacity={0.85} />)}
      <path d="M-1.4 -14 L-1.4 -124" stroke={hi} strokeWidth={1.6} opacity={0.85} />
      {[-30, -50, -72, -94].map((ky) => <ellipse key={ky} cx={0} cy={ky} rx={6} ry={4.2} fill={gold} stroke={line} strokeWidth={1.8} />)}
      <path d="M-28 0 Q-26 -9 -10 -12 L-5 -18 L5 -18 L10 -12 Q26 -9 28 0 Z" fill={gold} stroke={line} strokeWidth={2.2} />
      <path d="M-20 -4 Q-16 -9 -8 -10" stroke={hi} strokeWidth={1.6} fill="none" />
      {tops.map((tx, i) => (
        <g key={tx}>
          <path d={`M${tx - 8} -130 Q${tx} -119 ${tx + 8} -130 Z`} fill={gold} stroke={line} strokeWidth={1.8} />
          <ellipse cx={tx} cy={-130} rx={8} ry={2.2} fill={lit ? '#c98f2a' : '#8a6a2a'} stroke={line} strokeWidth={1.2} />
          {lit ? <Flame x={tx} y={-131} h={15} d={-i * 0.23} /> : <path d={`M${tx} -131 L${tx} -135`} stroke="#4a3a3a" strokeWidth={1.6} />}
        </g>
      ))}
    </g>
  )
}

/** A long stone bench in the courts: its seat 30·s above the ground y (as SittingOnRock wants for a grown-up at s), from x0 to x1. */
export function Bench({ x0, x1, y, s = 1 }: { x0: number; x1: number; y: number; s?: number }) {
  const top = y - 30 * s
  return (
    <g>
      <ellipse cx={(x0 + x1) / 2} cy={y} rx={(x1 - x0) / 2 + 8} ry={5 * s} fill="#000" opacity={0.1} />
      {[x0 + 8 * s, x1 - 30 * s].map((lx) => <rect key={lx} x={lx} y={top + 6 * s} width={22 * s} height={24 * s} fill="#dccaa0" stroke={STONE_INK} strokeWidth={2} />)}
      <rect x={x0} y={top - 2 * s} width={x1 - x0} height={11 * s} rx={3} fill={STONE} stroke={STONE_INK} strokeWidth={2} />
      <path d={`M${x0 + 4} ${top} H${x1 - 4}`} stroke="#fbf3de" strokeWidth={1.6} />
    </g>
  )
}

/** The courts of God's house, for a background: the temple in the middle at the back, a porch of columns either side, and the stone floor. */
function Courts({ temple = { x: 400, y: 252, s: 0.92 }, porch = 262, shine, inside, left = true, right = true }: {
  temple?: { x: number; y: number; s: number }; porch?: number; shine?: boolean; inside?: ReactNode; left?: boolean; right?: boolean
}) {
  return (
    <g>
      <Paving y={porch - 6} />
      {left && <Colonnade x0={-10} x1={250} y={porch} h={150} cols={[20, 98, 176, 236]} />}
      {right && <Colonnade x0={550} x1={810} y={porch} h={150} cols={[564, 624, 702, 780]} />}
      <Temple x={temple.x} y={temple.y} s={temple.s} shine={shine} inside={inside} />
    </g>
  )
}

/** A scroll of God's word, open: its page between two wooden rollers with round knobs, lines of writing across it. (x, y) = its middle; about 70 wide and 60 tall at s = 1. */
export function OpenScroll({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-28} y={-19} width={56} height={38} fill="#fff3d6" stroke="#c9a46a" strokeWidth={2} />
      <g stroke="#8a6a4a" strokeWidth={1.7} strokeLinecap="round" strokeDasharray="5 2.4 3 2.4">
        {[-11, -5, 1, 7, 13].map((ly) => <path key={ly} d={`M-22 ${ly} H-3 M4 ${ly} H22`} />)}
      </g>
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={d * 31 - 2} y={-30} width={4} height={60} rx={2} fill="#7a4a24" />
          <rect x={d * 31 - 5.5} y={-22} width={11} height={44} rx={4.5} fill="#ead6aa" stroke="#a8803e" strokeWidth={2} />
          <circle cx={d * 31} cy={-30} r={4} fill={WOOD} stroke={WOOD_INK} strokeWidth={1.5} />
          <circle cx={d * 31} cy={30} r={4} fill={WOOD} stroke={WOOD_INK} strokeWidth={1.5} />
        </g>
      ))}
    </g>
  )
}

/** A scroll rolled up, lying on its side, tied with a red band: (x, y) = its middle; about 60 long at s = 1. */
export function RolledScroll({ x, y, s = 1, angle = 0 }: { x: number; y: number; s?: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <rect x={-30} y={-2} width={60} height={4} rx={2} fill="#7a4a24" />
      <rect x={-24} y={-8} width={48} height={16} rx={7} fill="#f1e2bc" stroke="#a8803e" strokeWidth={2} />
      <path d="M-14 -6 Q-15 0 -14 6 M14 -6 Q15 0 14 6" stroke="#d8c08a" strokeWidth={1.4} fill="none" />
      <rect x={-3} y={-8.5} width={6} height={17} rx={1.5} fill="#c0504d" stroke="#8a2f2c" strokeWidth={1.2} />
      <circle cx={-30} cy={0} r={4} fill={WOOD} stroke={WOOD_INK} strokeWidth={1.5} />
      <circle cx={30} cy={0} r={4} fill={WOOD} stroke={WOOD_INK} strokeWidth={1.5} />
    </g>
  )
}

/** An open scroll held up in front by a sitting or standing Person (in their units: give it as a child), with their two hands on its rollers. */
export const HeldScroll = ({ skin }: { skin: string }) => (
  <g>
    <OpenScroll x={0} y={-66} s={0.78} />
    <circle cx={-24} cy={-62} r={6.5} fill={skin} stroke={ink(skin)} strokeWidth={2} />
    <circle cx={24} cy={-62} r={6.5} fill={skin} stroke={ink(skin)} strokeWidth={2} />
  </g>
)

/**
 * A dove sitting side-on (facing right, or `facing="left"`), its wing folded along its side and its tail at the back: white,
 * with an orange beak and pink feet. (x, y) = its feet; about 56 long at s = 1.
 */
export function SittingDove({ x, y, s = 1, facing = 'right', blinkDelay = 0 }: { x: number; y: number; s?: number; facing?: 'left' | 'right'; blinkDelay?: number }) {
  const line = '#b0c4e0'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`} strokeLinejoin="round">
      <path d="M-3 -7 L-4.5 0 M4 -7 L4 0" stroke="#e8857a" strokeWidth={2.4} strokeLinecap="round" />
      <path d="M-16 -15 L-33 -18 Q-34 -12.5 -31.5 -8 L-14 -9 Z" fill="#ffffff" stroke={line} strokeWidth={2} />
      <path d="M-21 -13 C-19 -23 -4 -28 8 -25 C17 -23 19 -12 12 -7.5 C3 -3.5 -11 -4 -21 -13 Z" fill="#ffffff" stroke={line} strokeWidth={2.2} />
      <path d="M9 -21 C1 -24 -12 -22 -24 -14 C-15 -10.5 -4 -9.5 6 -11.5 C11 -13.5 12 -18 9 -21 Z" fill="#eef3fb" stroke={line} strokeWidth={1.8} />
      <path d="M-8 -16.5 Q-13 -14.5 -17.5 -12.5 M-1 -15.8 Q-6 -13.5 -10.5 -11.6" stroke="#d3def0" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <circle cx={14} cy={-28} r={7.6} fill="#ffffff" stroke={line} strokeWidth={2.2} />
      <path d="M21 -29.4 l6.4 1.8 l-6.4 2.4 Z" fill="#ffb347" stroke="#e08a2a" strokeWidth={0.9} />
      <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
        <circle cx={16.4} cy={-29.6} r={1.8} fill="#2b2140" />
      </g>
      <ellipse cx={13.5} cy={-24.2} rx={2.6} ry={1.5} fill="#ff9ec0" opacity={0.55} />
    </g>
  )
}

/**
 * A little sparrow sitting side-on (facing right, or `facing="left"`): brown with a cream tummy, a striped wing folded at its
 * side, a short tail at the back and a little dark beak. (x, y) = its feet; about 34 long at s = 1.
 */
export function Sparrow({ x, y, s = 1, facing = 'right', blinkDelay = 0 }: { x: number; y: number; s?: number; facing?: 'left' | 'right'; blinkDelay?: number }) {
  const line = '#7a5233'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`} strokeLinejoin="round">
      <path d="M-2 -5 L-3 0 M3 -5 L3 0" stroke="#c98a6a" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M-10 -11 L-21 -16 L-19 -9 L-9 -7 Z" fill="#8a5a36" stroke={line} strokeWidth={1.4} />
      <path d="M-13 -9 C-11 -17 -2 -20 6 -18 C12 -16 13 -8 8 -5 C2 -2 -8 -3 -13 -9 Z" fill="#b98352" stroke={line} strokeWidth={1.6} />
      <path d="M-6 -6 C-2 -3 5 -3 9 -6 C10 -9 9 -11 7 -12 C3 -9 -2 -8 -6 -6 Z" fill="#f2e2c4" />
      <path d="M5 -15 C-1 -17 -9 -15 -15 -10 C-9 -7 -2 -7 4 -9 C7 -10 7 -13 5 -15 Z" fill="#8a5a36" stroke={line} strokeWidth={1.3} />
      <path d="M-3 -12.5 l-4 3 M2 -12.5 l-4 3" stroke="#f2e2c4" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={8} cy={-19} r={5.6} fill="#a8774a" stroke={line} strokeWidth={1.5} />
      <path d="M7.5 -24 Q4 -24 3.5 -20 L9 -19 Z" fill="#8a8078" opacity={0.7} />
      <path d="M13 -20 l4.4 1.2 l-4.4 1.6 Z" fill="#5a4636" />
      <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
        <circle cx={9.6} cy={-20} r={1.3} fill="#2b2140" />
      </g>
      <ellipse cx={9.4} cy={-16.6} rx={1.6} ry={1} fill="#ff9ec0" opacity={0.55} />
    </g>
  )
}

// ---------- On the road ----------
// (The donkey, Jerusalem on its hill, the FarHouses and the CityWall are the kit's.)

/** Rolling hills for the road to Jerusalem: a far blue-green ridge, then two nearer hills (`warm` for the evening). */
function RoadHills({ warm }: { warm?: boolean }) {
  return (
    <g>
      <path d="M0 250 Q120 205 250 236 Q400 196 540 232 Q680 200 800 228 L800 450 L0 450 Z" fill={warm ? '#b9a6b8' : '#b8d6b0'} />
      <path d="M0 292 Q160 250 330 284 Q520 246 800 280 L800 450 L0 450 Z" fill={warm ? '#c9b07e' : '#a8cf8e'} />
      <path d="M0 352 Q220 316 450 346 T800 338 L800 450 L0 450 Z" fill={warm ? '#b99a62' : '#8fc47a'} />
    </g>
  )
}

// ---------- Home, dinner and camp ----------

/** Joseph's workbench (he was a carpenter): a wooden table with a board on it, a saw and a mallet, and curly shavings. (x, y) = the middle of its foot; about 150 wide. */
function Workbench({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={82} ry={6} fill="#000" opacity={0.1} />
      {[-62, 50].map((lx) => <rect key={lx} x={lx} y={-56} width={12} height={56} fill={WOOD} stroke={WOOD_INK} strokeWidth={2.2} />)}
      <rect x={-60} y={-24} width={120} height={7} fill={WOOD} stroke={WOOD_INK} strokeWidth={2} />
      <rect x={-76} y={-64} width={152} height={12} rx={2} fill={WOOD_LIGHT} stroke={WOOD_INK} strokeWidth={2.4} />
      <rect x={-56} y={-73} width={84} height={9} rx={1.5} fill="#e8c08a" stroke="#a8763e" strokeWidth={2} />
      <path d="M-50 -69 H22" stroke="#cf9f62" strokeWidth={1.2} />
      {/* the saw, leaning on the bench; the mallet on top */}
      <path d="M48 -66 L74 -20 L82 -24 L58 -70 Z" fill="#c9ced8" stroke="#7d8496" strokeWidth={1.8} />
      <path d="M74 -20 l3 -2 l2 3 l3 -2 l2 3" stroke="#7d8496" strokeWidth={1.2} fill="none" />
      <rect x={42} y={-78} width={16} height={12} rx={3} fill={WOOD} stroke={WOOD_INK} strokeWidth={1.8} />
      <rect x={34} y={-70} width={12} height={6} rx={2} fill="#8a5a2e" stroke={WOOD_INK} strokeWidth={1.4} />
      {[[-30, -2], [-12, -4], [8, -1], [26, -3]].map(([cx, cy], i) => (
        <path key={i} d={`M${cx} ${cy} q4 -6 8 -1 q-3 4 -6 1`} stroke="#e0b47a" strokeWidth={2} fill="none" strokeLinecap="round" />
      ))}
    </g>
  )
}

/** A long wooden board, held in front with both hands by a Person (in their units: give it as a child), its middle at (0, -62). */
const HeldBoard = ({ skin }: { skin: string }) => (
  <g>
    <rect x={-78} y={-71} width={156} height={18} rx={2.5} fill="#e8c08a" stroke="#a8763e" strokeWidth={2.4} />
    <path d="M-74 -64 H40 M-30 -59 H74" stroke="#cf9f62" strokeWidth={1.4} />
    <circle cx={-20} cy={-62} r={7} fill={skin} stroke={ink(skin)} strokeWidth={2} />
    <circle cx={20} cy={-62} r={7} fill={skin} stroke={ink(skin)} strokeWidth={2} />
  </g>
)

/** A big round full moon with a soft glow (Passover comes at the full moon). */
function FullMoon({ x, y, r = 26 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.2} fill="#fff6c8" opacity={0.12} />
      <circle cx={x} cy={y} r={r * 1.5} fill="#fff6c8" opacity={0.18} />
      <circle cx={x} cy={y} r={r} fill="#fff4c2" stroke="#e8d27a" strokeWidth={2.5} />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="#efe2a6" />
      <circle cx={x + r * 0.28} cy={y + r * 0.3} r={r * 0.13} fill="#efe2a6" />
    </g>
  )
}

/** A round flat bread (the Passover's bread, with no yeast): a pale golden disk with little brown dots. (x, y) = its middle. */
function FlatBread({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.42} fill="#f3d9a0" stroke="#c9944a" strokeWidth={2} />
      {[[-0.5, -0.05], [-0.1, 0.12], [0.3, -0.1], [0.55, 0.12], [-0.3, 0.2]].map(([dx, dy], i) => (
        <circle key={i} cx={x + dx * r} cy={y + dy * r} r={1.4} fill="#b97a3a" />
      ))}
    </g>
  )
}

/** A campfire: logs crossed in a ring of stones, little flames dancing, and a warm glow. (x, y) = its middle on the ground. */
function Campfire({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={0} y={-24} r={110} color="#ffc76a" />
      {[-30, -16, 0, 16, 30].map((sx, i) => <ellipse key={sx} cx={sx} cy={i % 2 ? 2 : 0} rx={9} ry={6} fill="#a39d94" stroke="#6d6760" strokeWidth={2} />)}
      <path d="M-26 -2 L22 -14 M-22 -14 L26 -2" stroke="#6b4422" strokeWidth={8} strokeLinecap="round" />
      <Flame x={-9} y={-8} h={30} d={0} />
      <Flame x={9} y={-8} h={26} d={-0.4} />
      <Flame x={0} y={-8} h={40} d={-0.2} />
    </g>
  )
}

/**
 * A market stall: a striped cloth roof on two poles, and a table with baskets of red pomegranates, purple figs and bread.
 * (x, y) = the middle of its foot. `keeper` stands behind the table (drawn after the poles, before the table), in the gap
 * between the figs and the bread (at about x + 22).
 */
function Stall({ x, y, keeper }: { x: number; y: number; keeper?: ReactNode }) {
  const basket = (bx: number, fruit: string, line: string) => (
    <g key={bx}>
      {[[-9, -12], [0, -15], [9, -12], [-4.5, -19], [4.5, -19]].map(([fx, fy], i) => <circle key={i} cx={bx + fx} cy={y - 62 + fy} r={6} fill={fruit} stroke={line} strokeWidth={1.4} />)}
      <path d={`M${bx - 18} ${y - 70} L${bx + 18} ${y - 70} L${bx + 13} ${y - 52} L${bx - 13} ${y - 52} Z`} fill="#c98448" stroke="#8a5428" strokeWidth={2} strokeLinejoin="round" />
    </g>
  )
  const top = y - 196
  return (
    <g>
      <path d={`M${x - 92} ${y} V${top + 8} M${x + 92} ${y} V${top + 8}`} stroke="#8a5a2e" strokeWidth={6} strokeLinecap="round" />
      {keeper}
      <rect x={x - 84} y={y - 52} width={168} height={52} fill="#c98a52" stroke="#7a4f2a" strokeWidth={2.5} />
      <path d={`M${x - 84} ${y - 36} H${x + 84} M${x - 84} ${y - 18} H${x + 84}`} stroke="#a8703e" strokeWidth={1.6} />
      {basket(x - 60, '#d84a4a', '#9a2a2a')}
      {basket(x - 20, '#8a5aa8', '#5a3a72')}
      {[[-12, -60], [10, -60], [-1, -67]].map(([fx, fy], i) => <ellipse key={i} cx={x + 60 + fx} cy={y + fy} rx={11} ry={6.5} fill="#e0a75e" stroke="#a8702c" strokeWidth={1.8} />)}
      <path d={`M${x - 104} ${top} L${x + 104} ${top} L${x + 104} ${top + 24} ${Array.from({ length: 8 }, (_, i) => `Q${x + 104 - i * 26 - 13} ${top + 36} ${x + 104 - (i + 1) * 26} ${top + 24}`).join(' ')} Z`}
        fill="#f5ead2" stroke="#b9945a" strokeWidth={2.5} strokeLinejoin="round" />
      {[-78, -26, 26, 78].map((sx) => <rect key={sx} x={x + sx - 13} y={top} width={26} height={24} fill="#d9604f" opacity={0.85} />)}
      <path d={`M${x - 108} ${top - 1} H${x + 108}`} stroke="#8a5a2e" strokeWidth={5} strokeLinecap="round" />
    </g>
  )
}

// ---------- Pages ----------

// 1. "Jesus grew up in a little town called Nazareth, with Mary and Joseph. Every year, they went to Jerusalem for a big,
//    happy feast called the Passover."
// Morning in Nazareth: their little house, Nazareth's houses on the hills, and the family getting ready for the trip: the
// donkey loaded up, Joseph with his walking stick, Mary with a basket of food, and Jesus.
function Page1() {
  return (
    <Scene sky="day" ground="hills" sun>
      <FarHouses spots={[[96, 274, 34], [140, 268, 28], [470, 252, 30], [512, 258, 36], [552, 262, 26]]} />
      <Tree x={752} y={352} s={0.95} />
      <MudHouse x={640} y={354} w={176} h={112} door={-0.18} win={0.26} />
      <Tap say="Hee-haw! I'm ready for the trip!" sfx="wobble"><Donkey x={130} y={420} s={0.95} load blinkDelay={0.4} /></Tap>
      <Tap say="This year, Jesus is coming with us!"><Joseph x={292} y={424} s={1.08} holding="stick" blinkDelay={1.1} /></Tap>
      <Tap say="Hi! I'm Jesus. We're going to Jerusalem!"><g className="bj-still"><BoyJesus x={398} y={428} s={1.08} pose="wave" blinkDelay={0.2} /></g></Tap>
      <Tap say="I packed some yummy food for the trip."><Mary x={500} y={424} s={1.08} pose="hold" holding="basket" blinkDelay={1.7} /></Tap>
    </Scene>
  )
}

// 2. "When Jesus was twelve years old, He went too! Lots of family and friends walked together. It was a long way, so they
//    sang happy songs on the road."
// The road through the hills: family and friends walking along together (Grandpa and Grandma, the aunt and uncle, two
// cousins), Mary, Jesus with a cousin, and Joseph leading the donkey, with music notes in the air as they sing.
function Page2() {
  return (
    <Scene sky="day" ground="none" sun>
      <RoadHills />
      <path d="M-40 452 Q260 346 820 300 L820 342 Q470 372 420 452 Z" fill="#ecd4a4" stroke="#d8b97e" strokeWidth={2} />
      <Birds spots={[[330, 110, 1], [360, 96, 0.8]]} />
      {/* further along the road */}
      <Person x={572} y={372} s={0.68} look={GRANDPA} holding="staff" blinkDelay={0.3} />
      <Person x={620} y={368} s={0.68} look={GRANDMA} blinkDelay={1.2}><SilverHair /></Person>
      <Person x={668} y={364} s={0.68} look={UNCLE} blinkDelay={0.8} />
      <Person x={716} y={360} s={0.68} look={AUNT} blinkDelay={1.6} />
      <Person x={762} y={358} s={0.68} look={COUSIN_BOY} pose="wave" blinkDelay={0.5} />
      {/* the front */}
      <Mary x={76} y={438} s={0.98} blinkDelay={0.9} />
      <Tap say="Hooray! I'm going to God's house!"><BoyJesus x={176} y={442} s={0.98} blinkDelay={0.1} /></Tap>
      <Tap say="Are we there yet?" sfx="pop"><Person x={262} y={442} s={0.98} look={COUSIN_GIRL} pose="wave" blinkDelay={1.4} /></Tap>
      <Joseph x={352} y={432} s={0.94} holding="stick" blinkDelay={0.6} />
      <Tap say="Hee-haw! Clip, clop, clip, clop!" sfx="wobble"><Donkey x={452} y={424} s={0.8} load blinkDelay={1.9} /></Tap>
      <Tap say="La, la, la! We sing as we walk." sfx="ding">
        <g className="sc-float">
          <MusicNote x={130} y={262} s={1.1} color="#ffd34d" />
          <MusicNote x={232} y={236} s={1.2} color="#ff8cc0" double />
          <MusicNote x={330} y={262} s={1} color="#8fd0ff" />
          <MusicNote x={600} y={226} s={0.9} color="#c9a8ff" double />
          <MusicNote x={690} y={240} s={0.8} color="#ffd34d" />
        </g>
      </Tap>
    </Scene>
  )
}

// 3. "At last they saw Jerusalem, up on its hill. And there was God's house, the temple, shining in the sun!"
// Jerusalem on its hill (the wall, the houses, God's house shining on top), and the family on the road below, looking up
// at it: Jesus points.
function Page3() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sun x={110} y={82} />
      <Cloud x={330} y={70} s={0.7} />
      <Cloud x={720} y={48} s={0.55} slow />
      <Rays x={633} y={170} r={240} n={14} opacity={0.32} />
      <path d="M0 300 Q200 268 420 296 T800 286 L800 450 L0 450 Z" fill="#b9cf8e" />
      <Tap say="God's house is shining in the sun!" sfx="sparkle"><Jerusalem x={540} y={396} s={0.86} /></Tap>
      <path d="M0 380 Q240 350 470 384 T800 376 L800 450 L0 450 Z" fill="#a3c67e" />
      <path d="M-20 452 Q120 404 270 390 Q350 380 384 348 L394 348 Q392 384 330 412 Q220 436 180 452 Z" fill="#ecd4a4" stroke="#d8b97e" strokeWidth={2} />
      <Tap say="Jerusalem, at last!"><Joseph x={82} y={438} s={1.02} holding="stick" blinkDelay={0.7} /></Tap>
      <Tap say="Look! There it is! God's house!"><BoyJesus x={186} y={440} s={1.02} pose="point" blinkDelay={0.2} /></Tap>
      <Tap say="It is so beautiful!"><Mary x={300} y={430} s={0.94} blinkDelay={1.4} /></Tap>
    </Scene>
  )
}

/** A Levite (a helper in God's house) blowing a long silver trumpet, in a Person's own units. */
export const Trumpet = () => (
  <g strokeLinecap="round">
    <path d="M3 -100 L41 -126" stroke="#8d95a8" strokeWidth={5} />
    <path d="M3 -100 L41 -126" stroke="#e4e8f0" strokeWidth={2.6} />
    <path d="M41.8 -124.8 L51 -125.5 L44.2 -135.4 L40.2 -127.2 Z" fill="#dfe4ee" stroke="#8d95a8" strokeWidth={1.8} strokeLinejoin="round" />
  </g>
)
export const LEVITE: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1f18', wrap: '#fbf8f1', beard: 'short', beardColor: '#2b1f18', robe: '#f7f3ea', sash: '#3f5f9f' }

// 4. "The city was busy, busy, busy! People came from near and far for the feast. Jesus and His family went to God's house,
//    to pray and to praise God."
// The courts of God's house, full of people at the feast: Levites blow silver trumpets on the temple steps, doves sit on
// the porch roof, and in front, Joseph and Mary pray and Jesus lifts His arms to praise God.
function Page4() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={120} y={50} s={0.6} />
      <Courts />
      <Tap say="Coo, coo! We live up here." sfx="pop">
        <SittingDove x={606} y={74} s={0.62} blinkDelay={0.4} />
        <SittingDove x={652} y={74} s={0.62} facing="left" blinkDelay={1.3} />
      </Tap>
      <Tap say="Toot, toot! Happy Passover!" sfx="ding">
        <g className="bj-still">
          <Person x={300} y={236} s={0.5} look={LEVITE} pose="wave" blinkDelay={0.6}><Trumpet /></Person>
          <Person x={500} y={236} s={0.5} look={LEVITE} pose="wave" facing="left" blinkDelay={1.6}><Trumpet /></Person>
        </g>
      </Tap>
      {/* people at the feast */}
      {[[50, 330, 0.58, 3], [104, 326, 0.56, 6], [194, 318, 0.54, 9], [318, 322, 0.56, 1], [466, 322, 0.56, 4], [604, 318, 0.54, 7], [692, 330, 0.58, 2], [748, 326, 0.56, 5]].map(([px, py, ps, i], k) => (
        <Person key={k} x={px} y={py} s={ps} look={pilgrim(i)} facing={px > 400 ? 'left' : 'right'} pose={i % 5 === 1 ? 'arms-up' : i % 3 === 0 ? 'pray' : 'stand'} blinkDelay={(k * 0.37) % 2} />
      ))}
      <Person x={150} y={340} s={0.56} look={pilgrim(8, true)} blinkDelay={0.9} />
      <Person x={648} y={338} s={0.56} look={pilgrim(5, true)} pose="wave" blinkDelay={1.4} />
      {/* Jesus and His family */}
      <Joseph x={250} y={430} s={1.06} pose="pray" blinkDelay={0.5} />
      <Tap say="Thank You, God! You are so good!"><BoyJesus x={392} y={434} s={1.06} pose="arms-up" blinkDelay={0.1} /></Tap>
      <Tap say="I love to praise God."><Mary x={530} y={430} s={1.06} pose="pray" blinkDelay={1.3} /></Tap>
    </Scene>
  )
}

/** The room where they ate the Passover dinner, at night: warm plaster walls, a window with the full moon, and lamps. */
function DinnerRoom({ moon, children }: { moon?: string; children?: ReactNode }) {
  return (
    <Scene sky="night" ground="none" clouds={false} stars={false}>
      <rect x={0} y={0} width={800} height={450} fill="#e3c08c" />
      {[[150, 120, 90], [420, 90, 120], [700, 230, 80]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.6} fill="#d6b07c" opacity={0.35} />)}
      <rect x={0} y={0} width={800} height={26} fill="#6e4a2c" />
      {[40, 230, 450, 660].map((bx) => <rect key={bx} x={bx} y={0} width={16} height={26} fill="#5a3a20" />)}
      {/* the window: the night sky, the full moon, and God's house far away */}
      <rect x={470} y={56} width={190} height={136} rx={8} fill="#2a2766" stroke="#9a6a3a" strokeWidth={8} />
      {[[494, 80], [536, 118], [626, 84], [600, 150], [514, 150]].map(([sx, sy], i) => <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={sparkle(sx, sy, 3.5)} fill="#fff8d0" />)}
      {moon ? <Tap say={moon} sfx="sparkle"><FullMoon x={606} y={110} r={22} /></Tap> : <FullMoon x={606} y={110} r={22} />}
      <path d="M474 188 L474 164 L496 164 L496 152 L522 152 L522 168 L560 168 L560 160 L598 160 L598 172 L656 172 L656 188 Z" fill="#3a3478" />
      <Temple x={540} y={188} s={0.13} />
      <path d="M466 196 H664" stroke="#8a5a30" strokeWidth={8} strokeLinecap="round" />
      {/* a woven hanging, and a shelf with jars */}
      <rect x={236} y={60} width={92} height={120} rx={3} fill="#efe2c4" stroke="#b8925a" strokeWidth={2} />
      {['#3b56a8', '#c8433f', '#e8b84a', '#3b56a8', '#c8433f'].map((c, i) => <rect key={i} x={236} y={72 + i * 21} width={92} height={10} fill={c} opacity={0.88} />)}
      <rect x={228} y={54} width={108} height={8} rx={4} fill="#9a6a3a" />
      <path d="M40 150 H170" stroke="#8a5a30" strokeWidth={8} strokeLinecap="round" />
      <path d="M58 146 Q54 120 66 112 L84 112 Q96 120 92 146 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M112 146 Q108 128 118 122 L132 122 Q142 128 138 146 Z" fill="#c9a06a" stroke="#8a6a3a" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={0} y={292} width={800} height={158} fill="#c9a06a" />
      <path d="M0 292 H800" stroke="#a8804a" strokeWidth={3} />
      <Glow x={400} y={330} r={360} color="#ffd98a" />
      {children}
    </Scene>
  )
}

// 5. "Then they ate the Passover dinner together. They ate flat bread, and they remembered how God set His people free
//    from Egypt, long ago."
// Night, inside: Grandpa, Joseph, Jesus (praying), Mary and a cousin round the low table with flat bread, a bowl of greens,
// cups and a lamp; God's house and the full moon (Passover comes at the full moon) in the window.
function Page5() {
  return (
    <DinnerRoom moon="The moon is big and round tonight!">
      <Tap say="A cozy little lamp." sfx="ding"><Emoji e="🪔" x={150} y={128} size={56} /></Tap>
      <Sitting x={92} y={364} s={1.32} look={GRANDPA} blinkDelay={1.6} />
      <Sitting x={244} y={364} s={1.36} look={PEOPLE.joseph} blinkDelay={0.6}><JosephSilver /></Sitting>
      <Tap say="Thank You, God, for setting Your people free!"><Kneel x={400} y={358} s={1.36 * JESUS_K} look={BOY_JESUS} pose="pray" blinkDelay={0.2} /></Tap>
      <Sitting x={556} y={364} s={1.36} look={PEOPLE.mary} blinkDelay={1.2} />
      <Kneel x={710} y={364} s={1.3} look={COUSIN_GIRL} pose="stand" blinkDelay={0.9} />
      {/* the low table, seen a little from above, with flat bread, a bowl of greens, cups and a lamp on it */}
      <path d="M150 330 L650 330 L690 368 L110 368 Z" fill="#b97f48" stroke="#6b4422" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M160 338 L640 338" stroke="#c99560" strokeWidth={2} />
      <rect x={110} y={368} width={580} height={18} fill="#9a6436" stroke="#6b4422" strokeWidth={2.5} />
      <rect x={128} y={386} width={22} height={46} fill="#8a5a2e" stroke="#6b4422" strokeWidth={2} />
      <rect x={650} y={386} width={22} height={46} fill="#8a5a2e" stroke="#6b4422" strokeWidth={2} />
      <Tap say="Crunch, crunch! Flat bread." sfx="chomp">
        <FlatBread x={286} y={352} r={30} />
        <FlatBread x={318} y={344} r={26} />
        <FlatBread x={500} y={352} r={30} />
      </Tap>
      <ellipse cx={404} cy={356} rx={34} ry={10} fill="#7cb06a" stroke="#4f7a40" strokeWidth={2} />
      <path d="M382 352 q6 -12 12 0 M396 350 q6 -14 12 -1 M410 352 q6 -12 12 0" stroke="#5f9a4a" strokeWidth={3} fill="none" strokeLinecap="round" />
      {[[196, 330], [606, 330]].map(([cx, cy]) => <path key={cx} d={`M${cx - 12} ${cy} L${cx + 12} ${cy} L${cx + 9} ${cy + 26} L${cx - 9} ${cy + 26} Z`} fill="#c9a04a" stroke="#8a6a2a" strokeWidth={2} strokeLinejoin="round" />)}
      <Emoji e="🪔" x={560} y={346} size={46} />
    </DinnerRoom>
  )
}

// 6. "When the feast was over, everyone set off for home, walking and talking together. But Jesus stayed behind in
//    Jerusalem, and Mary and Joseph didn't know!"
// The city wall and its gate: everyone walks off down the road for home (the aunt, Mary, a cousin, Joseph and the donkey),
// but Jesus is still inside the city, up at God's house, standing in front of its steps.
function Page6() {
  return (
    <Scene sky="day" ground="none" sun>
      <path d="M0 270 Q200 236 420 262 T800 250 L800 450 L0 450 Z" fill="#c8c27e" />
      {/* the hill inside the city, God's house on top of it */}
      <path d="M-10 300 Q30 250 176 244 Q330 248 420 300 Z" fill="#d2c48a" />
      <FarHouses spots={[[52, 282, 26], [92, 274, 22], [286, 272, 24], [326, 282, 26], [364, 290, 22]]} />
      <Tap say="I want to stay in God's house a little longer." sfx="sparkle">
        <Temple x={176} y={250} s={0.66} shine />
        <BoyJesus x={200} y={258} s={0.6} blinkDelay={0.3} />
      </Tap>
      <CityWall x0={-10} x1={420} y={392} h={96} gx={336} through={<rect x={296} y={250} width={80} height={150} fill="#f0dcb2" />} />
      <path d="M420 330 Q600 300 800 312 L800 450 L420 450 Z" fill="#b9cf8e" />
      <path d="M0 392 L800 384 L800 450 L0 450 Z" fill="#a3c67e" />
      <path d="M296 392 L376 392 Q520 404 640 424 Q740 440 820 438 L820 452 L250 452 Z" fill="#ecd4a4" stroke="#d8b97e" strokeWidth={2} />
      <Person x={420} y={428} s={0.9} look={AUNT} blinkDelay={1.4} />
      <Tap say="Jesus must be with the cousins."><Mary x={496} y={432} s={0.9} blinkDelay={0.8} /></Tap>
      <Person x={562} y={436} s={0.86} look={COUSIN_BOY} blinkDelay={0.5} />
      <Tap say="Home we go!"><Joseph x={630} y={438} s={0.9} holding="stick" blinkDelay={1.1} /></Tap>
      <Tap say="Hee-haw!" sfx="wobble"><Donkey x={718} y={444} s={0.72} load blinkDelay={0.2} /></Tap>
    </Scene>
  )
}

// 7. "Everyone was walking home from the feast. That evening, Mary and Joseph looked for Jesus. Was He with their family?
//    Was He with their friends? No, Jesus wasn't there!"
// Evening at the camp by the road, the moon coming up: tents, Grandma and a cousin by the campfire, and Mary and Joseph
// asking the uncle, who opens his arms: He isn't with them. (Surprised faces, never scared ones.)
function Page7() {
  const [cloth, stripe] = TENT_CLOTHS[1]
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <Sparkles spots={[[90, 60, 5], [210, 110, 4], [330, 50, 6], [470, 96, 4], [740, 70, 5]]} color="#fff8d0" />
      <FullMoon x={600} y={118} r={24} />
      <RoadHills warm />
      <CampTent x={140} y={330} s={0.7} cloth={cloth} stripe={stripe} />
      <CampTent x={652} y={326} s={0.66} cloth={FAMILY_TENT[0]} stripe={FAMILY_TENT[1]} />
      <Tap say="Crackle, crackle!" sfx="pop"><Campfire x={268} y={414} s={0.9} /></Tap>
      <Sitting x={150} y={420} s={0.86} look={GRANDMA}><SilverHair /></Sitting>
      <Tap say="I didn't see Jesus today."><Person x={370} y={428} s={0.9} look={COUSIN_GIRL} blinkDelay={0.7} /></Tap>
      <Tap say="Jesus isn't with us!"><Figure x={470} y={430} s={1} look={UNCLE} pose="open" mood="wow" blinkDelay={1.2} /></Tap>
      <Tap say="Where is Jesus?"><Figure x={580} y={432} s={1.04} look={PEOPLE.mary} mood="wow" blinkDelay={0.4} /></Tap>
      <Figure x={690} y={432} s={1.04} look={PEOPLE.joseph} mood="wow" item={<TallStick x={30} />} blinkDelay={0.9}><JosephSilver /></Figure>
    </Scene>
  )
}

// 8. "So Mary and Joseph hurried back to Jerusalem. They looked and looked for Jesus, all over the big, busy city."
// A street in Jerusalem: houses, a market stall, people, a cat on a wall, and Mary and Joseph looking everywhere. A kind
// lady at the stall points up the street, to God's house on the hill.
function Page8() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={560} y={56} s={0.6} />
      <Temple x={400} y={196} s={0.4} shine />
      <path d="M250 200 L550 200 L800 330 L800 450 L0 450 L0 330 Z" fill="#e8d0a0" />
      <path d="M330 200 L470 200 L640 450 L160 450 Z" fill="#efdcb2" />
      <MudHouse x={110} y={330} w={230} h={200} door={0.22} win={-0.2} />
      <MudHouse x={286} y={250} w={90} h={84} door={0.1} win={null} />
      <MudHouse x={520} y={248} w={90} h={80} door={-0.1} win={null} />
      <MudHouse x={706} y={336} w={200} h={190} door={-0.3} win={0.24} />
      <rect x={0} y={318} width={200} height={20} fill="#d9b67a" stroke="#a8804a" strokeWidth={2} />
      <Tap say="Meow! Have you seen Jesus?" sfx="pop"><Emoji e="🐱" x={60} y={292} size={58} /></Tap>
      <Stall x={640} y={420} keeper={
        <Tap say="Have you looked in God's house?"><Figure x={662} y={410} s={0.86} look={pilgrim(5)} pose="point" reach={[null, [56, -114]]} facing="left" blinkDelay={0.6} /></Tap>
      } />
      <Person x={230} y={300} s={0.56} look={pilgrim(3)} blinkDelay={0.4} />
      <Person x={470} y={296} s={0.54} look={pilgrim(6)} facing="left" blinkDelay={1.2} />
      <Person x={360} y={318} s={0.56} look={pilgrim(9)} blinkDelay={0.8} />
      <Tap say="Jesus! Where are You?"><Figure x={300} y={436} s={1.06} look={PEOPLE.mary} mood="wow" blinkDelay={1.1} /></Tap>
      <Tap say="Have you seen a boy named Jesus?"><Figure x={420} y={438} s={1.06} look={PEOPLE.joseph} pose="point" item={<TallStick x={-30} />} blinkDelay={0.3}><JosephSilver /></Figure></Tap>
    </Scene>
  )
}

/** One teacher, sitting on the bench (feet on the ground at x, y); `scroll`: holding up an open scroll; `amazed`. */
function Teacher({ x, y, s = 1, i, scroll, amazed, rolled, blinkDelay = 0 }: {
  x: number; y: number; s?: number; i: number; scroll?: boolean; amazed?: boolean; rolled?: boolean; blinkDelay?: number
}) {
  const look = TEACHERS[i]
  return (
    <SittingOnRock x={x} y={y} s={s} look={look} pose={scroll ? 'hold' : 'stand'} holding={rolled ? 'scroll' : undefined} blinkDelay={blinkDelay}
      front={scroll ? <HeldScroll skin={look.skin} /> : undefined}>
      {amazed && <Amazed skin={look.skin} beard={look.beardColor} />}
    </SittingOnRock>
  )
}

// 9. "On the third day, they found Jesus in God's house! He was sitting with the teachers, listening to them and asking them
//    questions."
// Under the porch of God's house: the teachers sit on the stone bench with their scrolls, Jesus sits with them, His hand up
// to ask a question, and Mary and Joseph come in, so happy to see Him.
function Page9() {
  const by = 424, k = 1.14
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Paving y={296} />
      <Colonnade x0={-10} x1={810} y={310} h={290} cols={[50, 230, 410, 590, 770]} w={38} parapet={false} frieze lamps={[140, 320, 500, 680]} />
      <Person x={160} y={330} s={0.92} look={TEACHERS[3]} holding="scroll" blinkDelay={1.8} />
      <Person x={424} y={326} s={0.88} look={pilgrim(6)} blinkDelay={0.9} />
      <Bench x0={36} x1={540} y={by} s={k} />
      <Tap say="This scroll has God's word in it."><Teacher x={96} y={by} s={k} i={0} scroll blinkDelay={0.4} /></Tap>
      <Tap say="What a good question!"><Teacher x={222} y={by} s={k} i={1} rolled blinkDelay={1.3} /></Tap>
      <Tap say="Please tell Me more about God!">
        <g className="bj-still"><SittingOnRock x={354} y={by - 30 * k + 30 * 0.74 * k * JESUS_K} s={k * JESUS_K} look={BOY_JESUS} pose="wave" blinkDelay={0.1}><Talking /></SittingOnRock></g>
      </Tap>
      <Teacher x={480} y={by} s={k} i={2} blinkDelay={0.8} />
      <Tap say="There He is!"><Figure x={626} y={440} s={1.14} look={PEOPLE.mary} pose="open" mood="joy" blinkDelay={0.6} /></Tap>
      <Joseph x={736} y={440} s={1.14} holding="stick" blinkDelay={1.5} />
    </Scene>
  )
}

// 10. "Everyone who heard Jesus was amazed. He understood so much about God!"
// Closer: Jesus stands up to answer, in a soft glow, and the teachers on the benches either side are amazed, and so are
// the people standing round to listen.
function Page10() {
  const sy = 430, k = 1.2
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Paving y={262} />
      <Colonnade x0={-10} x1={810} y={276} h={270} cols={[60, 290, 510, 740]} w={40} parapet={false} frieze lamps={[175, 400, 625]} />
      <Person x={44} y={330} s={0.84} look={pilgrim(2)} blinkDelay={0.7}><Amazed skin={pilgrim(2).skin} beard={pilgrim(2).beardColor} /></Person>
      <Tap say="Amazing!"><Person x={641} y={326} s={0.84} look={pilgrim(5)} facing="left" blinkDelay={1.5}><Amazed skin={pilgrim(5).skin} /></Person></Tap>
      <Person x={762} y={330} s={0.84} look={pilgrim(8)} facing="left" blinkDelay={0.3}><Amazed skin={pilgrim(8).skin} beard={pilgrim(8).beardColor} /></Person>
      <Bench x0={20} x1={300} y={sy} s={k} />
      <Bench x0={500} x1={780} y={sy} s={k} />
      <Tap say="Wow! He knows so much about God!"><Teacher x={96} y={sy} s={k} i={0} scroll amazed blinkDelay={0.4} /></Tap>
      <Teacher x={222} y={sy} s={k} i={1} amazed rolled blinkDelay={1.1} />
      <Tap say="What wise words!"><Teacher x={578} y={sy} s={k} i={2} amazed blinkDelay={0.9} /></Tap>
      <Teacher x={704} y={sy} s={k} i={3} amazed rolled blinkDelay={1.7} />
      <Glow x={400} y={300} r={130} color="#fff6c8" />
      <Sparkles spots={[[320, 216, 9], [482, 206, 8], [302, 286, 6], [500, 270, 7]]} color="#fff3a0" />
      <Tap say="God loves His people so much!">
        <Figure x={400} y={436} s={k * JESUS_K} look={BOY_JESUS} pose="open" blinkDelay={0.2}><Talking /></Figure>
      </Tap>
    </Scene>
  )
}

// 11. "Mary said, "Son, we were looking everywhere for You!" Jesus said, "Didn't you know I must be in My Father's house?"
//     Jesus is God's Son, so God's house is His Father's house!"
// In the courts, with God's house shining behind: Mary hugs Jesus, Joseph smiles, and Jesus points to His Father's house.
function Page11() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={130} y={60} s={0.6} />
      <Rays x={566} y={150} r={420} n={16} opacity={0.4} />
      <Paving y={300} />
      <Colonnade x0={-10} x1={230} y={304} h={180} cols={[16, 110, 204]} w={26} />
      <Tap say="God's house is shining so bright!" sfx="sparkle"><Temple x={566} y={306} s={1} shine /></Tap>
      <Person x={430} y={336} s={0.52} look={pilgrim(3)} blinkDelay={0.4} />
      <Person x={740} y={340} s={0.52} look={pilgrim(10)} facing="left" blinkDelay={1.3} />
      <Person x={772} y={346} s={0.48} look={pilgrim(7, true)} facing="left" blinkDelay={0.9} />
      <Tap say="Let's go home together."><Joseph x={96} y={438} s={1.16} holding="stick" blinkDelay={0.9} /></Tap>
      <Tap say="We were looking everywhere for You!">
        <Figure x={214} y={438} s={1.16} look={PEOPLE.mary} pose="hug-right" reach={[null, [66, -66]]} mood="joy" blinkDelay={0.4} />
      </Tap>
      <Tap say="God is My Father!" sfx="sparkle"><BoyJesus x={310} y={442} s={1.16} pose="point" blinkDelay={0.2} /></Tap>
    </Scene>
  )
}

// 12. "Then Jesus went home to Nazareth with Mary and Joseph, and He obeyed them. Jesus grew bigger and wiser, and God and
//     people loved Him. And God loves you, too!"
// Home in Nazareth: Jesus carries a board for Joseph at his workbench, Mary smiles from the door with a water jar, a
// little sparrow sits on the roof, and the sun shines warm on them all.
function Page12() {
  return (
    <Scene sky="day" ground="hills" sun>
      <Glow x={660} y={90} r={180} color="#fff3b0" />
      <FarHouses spots={[[470, 252, 30], [512, 258, 36], [556, 262, 26], [700, 270, 30]]} />
      <Tree x={420} y={330} s={0.8} />
      <MudHouse x={150} y={354} w={200} h={124} door={-0.22} win={0.24} />
      <Tap say="Cheep, cheep!" sfx="pop"><Sparrow x={200} y={222} s={1.3} facing="left" blinkDelay={0.5} /></Tap>
      <Tap say="You are getting so big and strong!"><Figure x={236} y={404} s={1.06} look={PEOPLE.mary} holding="jar" blinkDelay={0.5} /></Tap>
      <Tap say="Thank you, Jesus. You are a big help!"><Joseph x={604} y={398} s={1.04} pose="hammer" holding="hammer" blinkDelay={0.7} /></Tap>
      <Workbench x={600} y={430} s={1.1} />
      <Tap say="I'm happy to help!"><BoyJesus x={380} y={434} s={1.1} pose="hold" blinkDelay={0.2}><HeldBoard skin={BOY_JESUS.skin} /></BoyJesus></Tap>
    </Scene>
  )
}

export const BOY_JESUS_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
