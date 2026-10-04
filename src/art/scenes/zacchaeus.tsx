// Zacchaeus (Luke 19:1–10): one picture per story page, both parts in order (see data/zacchaeus.ts for the words).
// Part one (pages 1 to 6): rich Zacchaeus in Jericho, taking more money than he should, the news that Jesus is
// coming, too short to see over the crowd, up the sycamore tree, and Jesus stopping right under it. Part two
// (pages 7 to 11): "Zacchaeus, hurry and come down!", down he hurries (and some people grumble), dinner at his
// house and his promise, God's rescue comes to his house, and Zacchaeus gives back what he took, and more.
// The day goes by: morning (1 to 8), evening at his house (9, 10), and the next morning (11).
//
// Zacchaeus, his sycamore tree and his coins are drawn in art/items/isl-zacchaeus.tsx (the items draw them too);
// his look is exported here as well. The townsfolk of Jericho are here (exported for the island's game, and for
// PEOPLE in people.tsx later): FARMER and NEIGHBOR; and the poor he shares with, GRANDMA (a poor widow), GIRL and BOY,
// her grandchildren, and GRANDPA (a poor old man).
// Zacchaeus is short, and the pictures are cheerful about it: never a joke. Jesus is PEOPLE.jesus, with Peter,
// Andrew, James and John. God is never drawn as a person: His presence is light (page 10).
// Crowd and Dust are copied from scenes/loaves.tsx (an island never imports another island's scene file); Folk and Heart are the kit's.
import type { ComponentType, ReactNode } from 'react'
import { darken, ink } from '../kit'
import { EyesUp, Figure, LookingUp, PEOPLE, Sitting, SilverHair, type JLook, type JPose, type Mood } from '../people'
import { Coin, CoinChest, CoinStack, PERCH_LEFT, SEAT, Sycamore, Zacchaeus, ZacchaeusPerched, ZACCHAEUS } from '../items/isl-zacchaeus'
import { Bread, Folk, Glow, Heart, Palm, Rays, Scene, Sparkles, Tap } from './kit'

export { ZACCHAEUS } from '../items/isl-zacchaeus'

type Pt = [number, number]

// ---------- The people of Jericho ----------

/** The farmer: a cream head cloth, a short dark beard and an olive robe. He pays Zacchaeus (page 2), grumbles (page 8) and gets paid back four times as much (page 11). */
export const FARMER: JLook = { skin: '#c68b5e', hair: 'covered', hairColor: '#3b2a20', wrap: '#ece0bc', beard: 'short', beardColor: '#3b2a20', robe: '#7f9a4a', sash: '#b5553f' }
/** A neighbor in the street: black curls, a short beard and a teal robe. He grumbles too (pages 2 and 8). */
export const NEIGHBOR: JLook = { skin: '#e3b48c', hair: 'curly', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#3a9a8f', sash: '#f0a050' }
/** The grandma, a poor widow: silver hair under a lavender head scarf, and an old brown robe with a patch on it. */
export const GRANDMA: JLook = { skin: '#c68b5e', hair: 'covered', hairColor: '#e9e5de', wrap: '#9a90b8', robe: '#a08a70', sash: '#6f6658' }
/** Her granddaughter: pigtails and a coral robe. */
export const GIRL: JLook = { skin: '#c68b5e', hair: 'pigtails', hairColor: '#2b1f18', robe: '#ff8f6a', sash: '#ffffff', build: 'child' }
/** Her grandson: black curls and a sky-blue robe. */
export const BOY: JLook = { skin: '#c68b5e', hair: 'curly', hairColor: '#2b1f18', robe: '#5fb7e8', sash: '#f2c24a', build: 'child' }
/** The grandpa, a poor old man: a long white beard, a cream head cloth, and an old mauve robe with a patch on it. */
export const GRANDPA: JLook = { skin: '#c68b5e', hair: 'covered', hairColor: '#e8e4dc', wrap: '#e8dcc0', beard: 'long', beardColor: '#f2efe8', robe: '#b07a9a', sash: '#e8dcc0' }

/** More people of Jericho, for the crowd up close (page 4): a woman in a rose head scarf, a man in orange, and a woman in a mint head scarf. */
const JERICHO: JLook[] = [
  { skin: '#e3b48c', hair: 'covered', hairColor: '#4a3020', wrap: '#e8668a', robe: '#6f9fc0', sash: '#f5f0e6' },
  { skin: '#8d5a3b', hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#d98b4a', sash: '#5f8fc0' },
  { skin: '#d9a47a', hair: 'covered', hairColor: '#3b2a20', wrap: '#9fd6b0', robe: '#9a8fd0', sash: '#f5f0e6' },
]

/** A patch on an old robe, with its stitches (figure units), moved over by (dx, dy). */
const Patch = ({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) => (
  <g transform={dx || dy ? `translate(${dx} ${dy})` : undefined}>
    <path d="M-19 -33 L-6 -34 L-5 -21 L-18 -20 Z" fill="#c9a46a" stroke="#7a5a3a" strokeWidth={1.4} strokeLinejoin="round" />
    <path d="M-17 -31 l2 0 M-12 -31.5 l2 0 M-8 -29 l0 2 M-7.5 -24 l0 2 M-12 -22 l2 0 M-17 -22 l0 -2" stroke="#7a5a3a" strokeWidth={1.2} strokeLinecap="round" />
  </g>
)

type Who = { x: number; y: number; s?: number; pose?: JPose; mood?: Mood; facing?: 'left' | 'right'; blinkDelay?: number; reach?: [Pt | null, Pt | null]; item?: ReactNode; children?: ReactNode }

/** The grandma: silver hair, the patch on her robe and, standing still, her walking stick. */
export function Grandma({ pose = 'stand', children, ...p }: Who) {
  return (
    <Figure {...p} look={GRANDMA} pose={pose} holding={pose === 'stand' ? 'stick' : undefined}>
      <SilverHair />
      <Patch />
      {children}
    </Figure>
  )
}

/** The grandpa: the patch on his robe and, standing still, his walking stick. */
export function Grandpa({ pose = 'stand', children, ...p }: Who) {
  return (
    <Figure {...p} look={GRANDPA} pose={pose} holding={pose === 'stand' ? 'stick' : undefined}>
      <Patch dx={24} dy={8} />
      {children}
    </Figure>
  )
}

/** Anyone else, by their look. */
export const Townsperson = ({ look, ...p }: Who & { look: JLook }) => <Figure {...p} look={look} />

/** Jesus (PEOPLE.jesus), drawn as Figure, for its moods and poses. */
const Jesus = (p: Who) => <Figure {...p} look={PEOPLE.jesus} />

// ---------- The crowd (Crowd is copied from scenes/loaves.tsx; Folk is the kit's) ----------

type Row = [y: number, x0: number, x1: number, n: number, s: number]

/** Rows of Folk, back row first, spaced a little unevenly like a real crowd. `skip`: x ranges left empty (round a main character). */
function Crowd({ rows, seed = 0, skip = [], waving = 5 }: { rows: Row[]; seed?: number; skip?: [number, number][]; waving?: number }) {
  let k = seed
  return (
    <g>
      {rows.map(([y, x0, x1, n, s], r) => Array.from({ length: n }, (_, j) => {
        const i = k++
        const step = n > 1 ? (x1 - x0) / (n - 1) : 0
        const x = x0 + j * step + Math.sin(i * 12.9898) * step * 0.2
        if (skip.some(([a, b]) => x > a && x < b)) return null
        return <Folk key={`${r}-${j}`} x={x} y={y + Math.cos(i * 4.1) * 3 * s} s={s} i={i} wave={i % waving === 1} />
      }))}
    </g>
  )
}

// ---------- Jericho ----------

/** The dry hills round Jericho, far away (Jericho itself is green, a city of palm trees). `dusk`: in the evening light. */
function FarHills({ dusk }: { dusk?: boolean }) {
  return (
    <g>
      <path d="M0 250 Q90 222 190 240 Q300 206 420 236 Q540 212 640 232 Q730 214 800 228 L800 330 L0 330 Z" fill={dusk ? '#c9a08a' : '#dcc89a'} />
      <path d="M0 282 Q160 258 330 276 Q520 254 800 272 L800 340 L0 340 Z" fill={dusk ? '#b39a7e' : '#c8c08a'} />
    </g>
  )
}

/** The ground: warm sand with a little grass, from `y` down. */
const Sand = ({ y = 300, color = '#e8d3a0' }: { y?: number; color?: string }) => (
  <path d={`M0 ${y} Q200 ${y - 12} 400 ${y - 4} T800 ${y - 6} L800 450 L0 450 Z`} fill={color} />
)

/** Grass tufts on the sand: [x, y] each. */
const Tufts = ({ spots }: { spots: Pt[] }) => (
  <g stroke="#6aa84f" strokeWidth={3} strokeLinecap="round" fill="none">
    {spots.map(([x, y], i) => <path key={i} d={`M${x - 6} ${y} q2 -9 -1 -14 M${x} ${y} q0 -10 2 -16 M${x + 6} ${y} q-1 -8 3 -12`} />)}
  </g>
)

/**
 * A house in Jericho: plastered mud brick with a flat roof (its beam ends show under the parapet), a dark arched
 * door and a little window; sometimes a striped awning over the door, a plant on the roof, or steps up its side.
 * (x, y): the middle of its foot. `door`, `win`: where they are, as a part of its width from the middle (null: none).
 */
export function House({ x, y, w = 110, h = 80, s = 1, wall = '#efdcb4', door = -0.15, win = 0.25, awning, plant, steps }: {
  x: number; y: number; w?: number; h?: number; s?: number; wall?: string; door?: number | null; win?: number | null
  awning?: string; plant?: boolean; steps?: boolean
}) {
  const line = darken(wall, 0.3)
  const dx = (door ?? 0) * w, wx = (win ?? 0) * w
  const st = [0, 0.25, 0.5, 0.75].map((k, i) => `L${w / 2 + 40 - i * 10} ${-h * k} L${w / 2 + 40 - i * 10} ${-h * (k + 0.25)}`).join(' ')
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {steps && <path d={`M${w / 2 - 2} 0 L${w / 2 + 40} 0 ${st} L${w / 2 - 2} ${-h} Z`} fill={darken(wall, 0.08)} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />}
      <rect x={-w / 2} y={-h} width={w} height={h} fill={wall} stroke={line} strokeWidth={2.5} />
      <rect x={-w / 2 - 4} y={-h - 9} width={w + 8} height={11} rx={2} fill={darken(wall, 0.08)} stroke={line} strokeWidth={2.2} />
      {Array.from({ length: Math.max(1, Math.floor((w - 8) / 18)) }, (_, i) => <circle key={i} cx={-w / 2 + 10 + i * 18} cy={-h + 7} r={2.6} fill="#8a6040" />)}
      <path d={`M${-w * 0.32} ${-h * 0.42} l14 0 M${-w * 0.27} ${-h * 0.42 + 6} l12 0 M${w * 0.12} ${-h * 0.72} l14 0`} stroke={darken(wall, 0.13)} strokeWidth={1.6} strokeLinecap="round" />
      {door !== null && <path d={`M${dx - 13} 0 L${dx - 13} -32 Q${dx} -45 ${dx + 13} -32 L${dx + 13} 0 Z`} fill="#5a3a24" stroke={line} strokeWidth={2} />}
      {win !== null && <rect x={wx - 9} y={-h + 20} width={18} height={14} rx={3} fill="#5a3a24" stroke={line} strokeWidth={2} />}
      {awning && door !== null && (
        <g strokeLinejoin="round">
          <path d={`M${dx - 22} -50 L${dx + 22} -50 L${dx + 28} -39 L${dx - 28} -39 Z`} fill={awning} stroke={ink(awning)} strokeWidth={2} />
          <path d={`M${dx - 9} -50 L${dx - 11.5} -39 M${dx + 9} -50 L${dx + 11.5} -39`} stroke="#fff" strokeWidth={4.5} opacity={0.65} />
        </g>
      )}
      {plant && (
        <g transform={`translate(${-w * 0.28} ${-h - 9})`}>
          <path d="M-8 0 L-6 -12 L6 -12 L8 0 Z" fill="#c9784a" stroke="#8a4a2a" strokeWidth={1.8} strokeLinejoin="round" />
          {[[0, -21, 10], [-8, -16, 7], [8, -16, 7]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#5fae55" stroke="#3f7a3a" strokeWidth={2} />)}
        </g>
      )}
    </g>
  )
}

/** A row of Jericho's houses along the back of the street, with palm trees between: [x, w, h, door, wall] each, on the ground at y. */
function Houses({ y, s = 1, houses }: { y: number; s?: number; houses: [number, number, number, number | null, string?][] }) {
  return (
    <g>
      {houses.map(([x, w, h, door, wall], i) => (
        <House key={x} x={x} y={y + (i % 2) * 3} s={s} w={w} h={h} door={door} win={door === null ? 0 : door > 0 ? -0.25 : 0.25} wall={wall}
          awning={i % 3 === 1 ? ['#c0504d', '#5f8fc0', '#6fb7b0'][i % 3] : undefined} plant={i % 4 === 2} />
      ))}
    </g>
  )
}

/** A pot of flowers or a little bush in a clay pot (by a door). (x, y): the foot of the pot. */
const PotPlant = ({ x, y, s = 1, flower = '#ff8cc0' }: { x: number; y: number; s?: number; flower?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[[0, -34, 15], [-11, -27, 10], [11, -27, 10]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#5fae55" stroke="#3f7a3a" strokeWidth={2} />)}
    {[[-6, -40], [6, -36], [-12, -28], [12, -29], [0, -28]].map(([cx, cy], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={3.2} fill={flower} stroke={ink(flower)} strokeWidth={1} />)}
    <path d="M-13 -18 L13 -18 L10 0 L-10 0 Z" fill="#c9784a" stroke="#8a4a2a" strokeWidth={2} strokeLinejoin="round" />
    <path d="M-14 -18 L14 -18" stroke="#8a4a2a" strokeWidth={4} strokeLinecap="round" />
  </g>
)

/**
 * Zacchaeus' big, fancy house: two floors of white plaster with a painted band between them, arched windows
 * with purple shutters (his color), a striped awning, plants on the roof, steps up to a carved double door
 * under a gold arch, and flowers by the door. (x, y): the middle of its foot; about 320 wide and 260 tall at
 * s = 1. `lit`: evening, the windows glow and the door stands open with warm light inside.
 */
export function BigHouse({ x, y, s = 1, lit }: { x: number; y: number; s?: number; lit?: boolean }) {
  const wall = '#f8eed6', line = '#b89a68'
  const purple = ZACCHAEUS.robe, gold = '#f2c24a'
  const glass = lit ? '#ffd76a' : '#5a3a24'
  const arch = (cx: number, top: number, w: number, h: number) =>
    `M${cx - w / 2} ${top + h} L${cx - w / 2} ${top + w / 2} Q${cx - w / 2} ${top} ${cx} ${top} Q${cx + w / 2} ${top} ${cx + w / 2} ${top + w / 2} L${cx + w / 2} ${top + h} Z`
  const window = (cx: number, top: number, w: number, h: number) => (
    <g key={`${cx}${top}`}>
      {[-1, 1].map((d) => <rect key={d} x={cx + d * (w / 2 + 2) - (d < 0 ? 13 : 0)} y={top + 6} width={13} height={h - 6} rx={2} fill={purple} stroke={ink(purple)} strokeWidth={2} />)}
      <path d={arch(cx, top, w, h)} fill={glass} stroke={line} strokeWidth={2.5} />
      <path d={`M${cx} ${top + 2} L${cx} ${top + h} M${cx - w / 2} ${top + h * 0.55} L${cx + w / 2} ${top + h * 0.55}`} stroke={lit ? '#e0a83a' : '#3a2414'} strokeWidth={2} />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={176} ry={9} fill="#000" opacity={0.1} />
      {/* the upper floor and its roof terrace, with plants in pots */}
      <rect x={-128} y={-236} width={256} height={116} fill={wall} stroke={line} strokeWidth={3} />
      <rect x={-136} y={-250} width={272} height={16} rx={3} fill="#ecdcb8" stroke={line} strokeWidth={2.5} />
      {Array.from({ length: 13 }, (_, i) => <circle key={i} cx={-120 + i * 20} cy={-226} r={3} fill="#a8805a" />)}
      <PotPlant x={-104} y={-250} s={0.8} />
      <PotPlant x={104} y={-250} s={0.8} flower="#ffd34d" />
      {window(-80, -214, 32, 58)}
      {window(80, -214, 32, 58)}
      {window(0, -218, 38, 64)}
      {/* a striped awning over the middle window, in purple and gold */}
      <path d="M-34 -228 L34 -228 L44 -204 L-44 -204 Z" fill={gold} stroke={ink(gold)} strokeWidth={2.2} strokeLinejoin="round" />
      {[-21, -4, 13, 30].map((sx) => <path key={sx} d={`M${sx - 4} -228 L${sx + 4} -228 L${sx * 1.29 + 5} -204 L${sx * 1.29 - 5} -204 Z`} fill={purple} />)}
      <path d="M-44 -204 q5.5 7 11 0 q5.5 7 11 0 q5.5 7 11 0 q5.5 7 11 0 q5.5 7 11 0 q5.5 7 11 0 q5.5 7 11 0 q5.5 7 11 0" fill={gold} stroke={ink(gold)} strokeWidth={2} />
      {/* the ground floor, and the painted band between the floors */}
      <rect x={-158} y={-128} width={316} height={128} fill={wall} stroke={line} strokeWidth={3} />
      <rect x={-162} y={-136} width={324} height={13} fill="#4f8fc0" stroke="#2f5f8a" strokeWidth={2} />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-150 + i * 20} cy={-129.5} r={2.4} fill={gold} />)}
      {window(-106, -104, 30, 50)}
      {window(106, -104, 30, 50)}
      {/* the doorway: steps, a gold arch, and a carved double door with gold studs (open, with lamplight inside, at evening) */}
      <rect x={-56} y={-7} width={112} height={7} fill="#e6d2a8" stroke={line} strokeWidth={2} />
      <rect x={-48} y={-14} width={96} height={7} fill="#eedcb6" stroke={line} strokeWidth={2} />
      <path d="M-36 -14 L-36 -80 Q-36 -116 0 -116 Q36 -116 36 -80 L36 -14 Z" fill={lit ? '#ffe6a0' : '#7a4a28'} stroke={ink(gold)} strokeWidth={3} />
      <path d="M-36 -80 Q-36 -116 0 -116 Q36 -116 36 -80" fill="none" stroke={gold} strokeWidth={6} />
      {lit ? (
        <g>
          <Glow x={0} y={-50} r={70} color="#fff1c0" />
          <path d="M-36 -14 L-36 -78 L-52 -70 L-52 -8 Z M36 -14 L36 -78 L52 -70 L52 -8 Z" fill="#8a5430" stroke="#4a2a14" strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <path d="M0 -112 L0 -14" stroke="#4a2a14" strokeWidth={2.5} />
          {[-18, 18].map((dx) => <rect key={dx} x={dx - 10} y={-74} width={20} height={44} rx={3} fill="none" stroke="#5a3418" strokeWidth={2} />)}
          {[-24, -12, 12, 24].map((dx) => [-82, -24].map((dy) => <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={2.4} fill={gold} />))}
          <circle cx={-6} cy={-54} r={3} fill={gold} stroke="#8a6a1a" strokeWidth={1} />
          <circle cx={6} cy={-54} r={3} fill={gold} stroke="#8a6a1a" strokeWidth={1} />
        </g>
      )}
      <PotPlant x={-72} y={0} s={1.05} />
      <PotPlant x={72} y={0} s={1.05} flower="#ffd34d" />
    </g>
  )
}

// ---------- Money ----------

/**
 * A fat sack of coins held up by its neck (figure units, inside a Figure: the hand at (x, y) holds the neck and is
 * drawn over it), its top tied with a gold cord and coins peeking out.
 */
export const MoneyBag = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <circle cx={-5} cy={-6} r={4.5} fill="#ffd34d" stroke="#b5862a" strokeWidth={1.4} />
    <circle cx={5} cy={-7} r={4.5} fill="#ffe27a" stroke="#b5862a" strokeWidth={1.4} />
    <path d="M-8 -2 L-6 4 L6 4 L8 -2 Q0 1 -8 -2 Z" fill="#c99350" stroke="#6b4422" strokeWidth={1.6} />
    <path d="M-6 4 Q-24 10 -22 28 Q-20 44 0 44 Q20 44 22 28 Q24 10 6 4 Z" fill="#b5803e" stroke="#6b4422" strokeWidth={2} />
    <path d="M-7 4 L7 4" stroke="#ffd34d" strokeWidth={3} strokeLinecap="round" />
    {/* a coin sign stitched on the front */}
    <circle cx={0} cy={26} r={7} fill="none" stroke="#ffd34d" strokeWidth={2.2} />
    <ellipse cx={-12} cy={22} rx={3} ry={6} fill="#fff" opacity={0.25} />
  </g>
)

/**
 * Zacchaeus' money table by the road: a striped cloth in his purple and gold. On it, at his end (the left), his own
 * tall stacks of coins on a cloth in his purple draped over the table: the extra he kept; then a heap of coins and his scroll for
 * writing down who paid; and at the far end, the king's money box (a crown on its front, a slot in its lid).
 * (x, y): the middle of its front, on the ground; about 210 wide.
 */
function MoneyTable({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const purple = ZACCHAEUS.robe
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={112} ry={7} fill="#000" opacity={0.12} />
      {[-86, 86].map((lx) => <rect key={lx} x={lx - 5} y={-22} width={10} height={22} rx={2} fill="#7a4a28" stroke="#4a2a14" strokeWidth={2} />)}
      <rect x={-104} y={-66} width={208} height={10} rx={3} fill="#a0612f" stroke="#5a3418" strokeWidth={2.5} />
      {/* the cloth over the front, in his purple and gold */}
      <path d="M-100 -57 L100 -57 L96 -20 Q0 -14 -96 -20 Z" fill="#f6e6c0" stroke="#b89a68" strokeWidth={2.5} />
      {[-62, -2, 58].map((sx) => <path key={sx} d={`M${sx - 12} -57 L${sx + 12} -57 L${sx + 12} -18 Q${sx} -17 ${sx - 12} -18 Z`} fill={purple} opacity={0.9} />)}
      <path d="M-98 -32 Q0 -27 98 -32" stroke="#f2c24a" strokeWidth={4} fill="none" />
      {/* his own tall stacks, on a cloth in his purple draped over his end of the table, with a gold fringe */}
      <path d="M-105 -72 L-30 -72 L-30 -44 Q-67 -39 -105 -44 Z" fill={purple} stroke={ink(purple)} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-102 -42.5 Q-67 -38 -33 -42.5" stroke="#f2c24a" strokeWidth={3.2} strokeDasharray="2.5 3" fill="none" />
      <CoinStack x={-86} y={-70} n={8} />
      <CoinStack x={-58} y={-70} n={7} />
      <CoinStack x={-72} y={-66} n={5} />
      {/* a heap of coins, and the scroll */}
      {[[-14, -70], [0, -72], [14, -69], [-6, -76], [8, -77], [1, -82]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={9} ry={4} fill={i % 2 ? '#ffe27a' : '#ffcc33'} stroke="#8a6a1a" strokeWidth={1.4} />
      ))}
      <g transform="translate(34 -72) rotate(-8)">
        <rect x={-12} y={-6} width={24} height={12} rx={3} fill="#fff3d6" stroke="#c9a46a" strokeWidth={1.8} />
        <circle cx={-12} cy={0} r={5} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={1.2} />
        <circle cx={12} cy={0} r={5} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={1.2} />
      </g>
      {/* the king's money box, at the far end */}
      <rect x={50} y={-100} width={50} height={36} rx={4} fill="#8a3a3a" stroke="#4a1a1a" strokeWidth={2.5} />
      <rect x={47} y={-106} width={56} height={10} rx={3} fill="#a04a46" stroke="#4a1a1a" strokeWidth={2.5} />
      <path d="M68 -101 L82 -101" stroke="#2a0a0a" strokeWidth={3} strokeLinecap="round" />
      <path d="M63 -72 L63 -86 L69 -80 L75 -90 L81 -80 L87 -86 L87 -72 Z" fill="#ffd34d" stroke="#b5862a" strokeWidth={1.6} />
    </g>
  )
}

/** A striped awning on two poles, over the money table. (x, y): as for the table. */
function Awning({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const purple = ZACCHAEUS.robe, gold = '#f2c24a'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      {[-108, 108].map((px) => <rect key={px} x={px - 4} y={-236} width={8} height={236} rx={3} fill="#8a5a2e" stroke="#4a2a14" strokeWidth={2} />)}
      <path d="M-122 -250 L122 -250 L128 -222 L-128 -222 Z" fill={gold} stroke={ink(gold)} strokeWidth={2.5} />
      {[-100, -60, -20, 20, 60, 100].map((sx) => <path key={sx} d={`M${sx - 10} -250 L${sx + 10} -250 L${sx * 1.05 + 10} -222 L${sx * 1.05 - 10} -222 Z`} fill={purple} />)}
      <path d={`M-128 -222 ${Array.from({ length: 16 }, () => 'q8 10 16 0').join(' ')}`} fill={gold} stroke={ink(gold)} strokeWidth={2.2} />
    </g>
  )
}

// ---------- Little things ----------

/** The pink of the hearts. */
const PINK = '#ff6f91'

/** "Grumble, grumble": a little wavy scribble over someone's head (mild, never angry). */
export const Grumble = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className="pa-twinkle" stroke="#8a7aa8" strokeWidth={2.8} fill="none" strokeLinecap="round">
      <path d="M-14 0 q3.5 -6 7 0 t7 0 t7 0 t7 0" />
      <path d="M-9 -11 q3.5 -6 7 0 t7 0 t7 0" />
    </g>
  </g>
)

/** Little puffs of dust kicked up behind someone running (to the right), at their heels. `flip`: running to the left. */
const Dust = ({ x, y, flip }: { x: number; y: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <g className="pa-twinkle" fill="#f3e6c6" stroke="#dcc79a" strokeWidth={1.5} opacity={0.95}>
      <circle cx={0} cy={0} r={9} /><circle cx={-16} cy={-6} r={7} /><circle cx={-29} cy={1} r={5} />
    </g>
  </g>
)

/** Lines that show something moving fast, trailing to the left of (x, y) (or the right, `flip`). */
const Speed = ({ x, y, flip, n = 3, color = '#c9a86a' }: { x: number; y: number; flip?: boolean; n?: number; color?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.9}>
    {Array.from({ length: n }, (_, i) => <path key={i} d={`M${-8 - (i % 2) * 8} ${i * 16} l-26 0`} />)}
  </g>
)

/** A leaf drifting down from the tree. */
const FallingLeaf = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => (
  <g className="sc-float">
    <path d="M0 -10 Q10 -3 0 10 Q-10 -3 0 -10 Z" fill="#63bd5f" stroke="#2f6a36" strokeWidth={2} transform={`translate(${x} ${y}) rotate(${r})`} />
  </g>
)

/** A white speech bubble: a rounded box (top left at x, y) with a little tail down to `tail`. What's said is drawn inside. */
export function Speech({ x, y, w, h, tail, children }: { x: number; y: number; w: number; h: number; tail: Pt; children?: ReactNode }) {
  const [tx, ty] = tail
  const bx = Math.min(Math.max(tx, x + 30), x + w - 30)
  const line = '#c9b8d8'
  return (
    <g>
      <path d={`M${bx - 14} ${y + h - 4} L${tx} ${ty} L${bx + 14} ${y + h - 4} Z`} fill="#fff" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <rect x={x} y={y} width={w} height={h} rx={24} fill="#fff" stroke={line} strokeWidth={3} />
      <path d={`M${bx - 12} ${y + h - 1.5} L${bx + 12} ${y + h - 1.5}`} stroke="#fff" strokeWidth={5} />
      {children}
    </g>
  )
}

/** A fat arrow pointing right, from (x, y), w long. */
const Arrow = ({ x, y, w = 40, color = '#9a7ad0' }: { x: number; y: number; w?: number; color?: string }) => (
  <path d={`M${x} ${y - 6} L${x + w - 16} ${y - 6} L${x + w - 16} ${y - 15} L${x + w} ${y} L${x + w - 16} ${y + 15} L${x + w - 16} ${y + 6} L${x} ${y + 6} Z`}
    fill={color} stroke={darken(color, 0.3)} strokeWidth={2} strokeLinejoin="round" />
)

/** A little bird perched on a branch, its feet at (x, y), facing left (or right, `flip`). */
export const PerchedBird = ({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M10 -9 L24 -16 L21 -6 Z" fill="#5f8fc0" stroke="#3b5f8a" strokeWidth={1.6} strokeLinejoin="round" />
    <ellipse cx={2} cy={-10} rx={12} ry={9} fill="#7cb0e0" stroke="#3b5f8a" strokeWidth={2} />
    <ellipse cx={4} cy={-7} rx={7} ry={5} fill="#d8ecff" />
    <circle cx={-8} cy={-19} r={7.5} fill="#7cb0e0" stroke="#3b5f8a" strokeWidth={2} />
    <path d="M-15 -20 L-21 -18 L-15 -16 Z" fill="#ffb347" stroke="#e08a2a" strokeWidth={1} strokeLinejoin="round" />
    <circle cx={-10} cy={-20.5} r={1.8} fill="#2b2140" />
    <path d="M6 -10 Q10 -16 14 -10" stroke="#3b5f8a" strokeWidth={1.6} fill="none" strokeLinecap="round" />
    <path d="M-1 -1.5 l-1 2.5 M4 -1.5 l1 2.5" stroke="#e08a2a" strokeWidth={1.6} strokeLinecap="round" />
  </g>
)

// ---------- Pages ----------

// 1. "In the city of Jericho, there lived a man named Zacchaeus. Zacchaeus was very rich. He had a big, fancy house, and lots and lots of money!"
// Morning in Jericho, the city of palm trees: Zacchaeus in front of his big house, holding up a fat sack of
// coins, beside his chest heaped with gold.
function Page1() {
  return (
    <Scene sky="day" ground="none" sun>
      <FarHills />
      <Sand y={302} />
      <Houses y={300} s={0.62} houses={[[30, 110, 80, -0.2], [118, 90, 96, 0.2, '#f2e2c0'], [790, 100, 84, -0.2]]} />
      <Palm x={200} y={318} s={0.9} />
      <Tap say="Jericho has lots and lots of palm trees!" sfx="swish">
        <g><Palm x={60} y={392} s={1.25} /><Palm x={760} y={400} s={1.3} /></g>
      </Tap>
      <Tap say="What a big, fancy house!" sfx="ding">
        <BigHouse x={510} y={400} s={0.98} />
      </Tap>
      <Tufts spots={[[110, 430], [340, 446], [700, 438]]} />
      <Tap say="Clink, clink! Look at all my coins!" sfx="ding">
        <CoinChest x={168} y={436} s={0.92} />
      </Tap>
      <Tap say="I am Zacchaeus, and I am very rich!" sfx="good">
        <Zacchaeus x={292} y={438} s={1.2} pose="point" item={<MoneyBag x={56} y={-92} />} blinkDelay={0.6} />
      </Tap>
      <g pointerEvents="none"><Sparkles spots={[[132, 330, 7], [204, 338, 6], [344, 300, 8]]} color="#fff3a0" /></g>
    </Scene>
  )
}

// 2. "Zacchaeus collected money from the people, for the king. But he took more than he should, and kept the extra for himself. So the people of Jericho did not like Zacchaeus."
// His money table by the road, under his striped awning: the king's money box, and his own tall stacks of coins.
// The farmer hands over his very last coin, and Zacchaeus holds out his hand for more; the next man in line folds
// his arms, and the grandma is sad. Nobody likes this.
function Page2() {
  return (
    <Scene sky="day" ground="none">
      <FarHills />
      <Sand y={300} />
      <Houses y={312} s={0.9} houses={[[60, 120, 96, 0.15], [210, 110, 80, -0.2, '#f2e2c0'], [622, 120, 90, 0.2], [760, 110, 100, -0.15, '#f2e2c0']]} />
      <Palm x={350} y={320} s={0.8} />
      <path d="M0 382 Q400 366 800 380 L800 450 L0 450 Z" fill="#f0dfb2" />
      <Awning x={572} y={426} s={0.95} />
      <Tap say="Clink, clink! Some coins for the king, and lots more for Zacchaeus." sfx="ding">
        <MoneyTable x={572} y={430} s={0.95} />
      </Tap>
      <Tap say="More coins, please! That is not enough." sfx="ding">
        <Zacchaeus x={440} y={436} s={1.12} pose="point" facing="left" blinkDelay={0.4} />
      </Tap>
      <Tap say="Oh no! That was my very last coin." sfx="wobble">
        <Townsperson look={FARMER} x={300} y={438} s={1.06} pose="point" mood="sad" blinkDelay={1.1} item={<Coin x={60} y={-93} s={0.2} />} />
      </Tap>
      <Tap say="Hmph! Zacchaeus always takes too much." sfx="wobble">
        <Townsperson look={NEIGHBOR} x={168} y={432} s={1.02} pose="cross" mood="grumpy" blinkDelay={2} />
      </Tap>
      <Folk x={74} y={406} s={0.9} i={7} />
      <Grandma x={724} y={440} s={1.0} mood="sad" facing="left" blinkDelay={0.9} />
    </Scene>
  )
}

// 3. "One day, big news came to Jericho: "Jesus is coming!" Everyone hurried to see Him. Soon the street was full of people!"
// The boy runs down the street with the news; people pour out of their houses and fill the street, and some
// climb up on their flat roofs to see. The farmer points down the road, and the grandma and the girl hurry along.
function Page3() {
  return (
    <Scene sky="day" ground="none">
      <FarHills />
      <Sand y={300} />
      <Houses y={318} s={0.95} houses={[[40, 110, 96, 0.2], [180, 120, 84, -0.2, '#f2e2c0'], [330, 100, 100, 0.15], [470, 120, 88, -0.2, '#f2e2c0'], [620, 110, 98, 0.2], [760, 120, 86, -0.2]]} />
      {/* people up on the flat roofs */}
      <Crowd rows={[[226, 300, 360, 3, 0.4], [234, 590, 650, 3, 0.4], [222, 16, 64, 2, 0.4], [240, 440, 500, 3, 0.4]]} seed={30} waving={2} />
      <Palm x={258} y={330} s={0.85} />
      <Palm x={548} y={330} s={0.8} />
      <path d="M0 376 Q400 362 800 378 L800 450 L0 450 Z" fill="#f0dfb2" />
      <Tap say="Hooray! Jesus is coming to Jericho!" sfx="good">
        <g>
          <Crowd rows={[[334, 14, 786, 22, 0.44], [348, 6, 794, 20, 0.52]]} seed={3} waving={3} />
          <Crowd rows={[[366, 10, 790, 16, 0.62]]} seed={60} waving={3} skip={[[338, 462]]} />
        </g>
      </Tap>
      <Tap say="Jesus is coming! Jesus is coming!" sfx="whoosh">
        <g>
          <Dust x={360} y={432} />
          <Speed x={358} y={388} />
          <g transform="rotate(9 404 432)"><Townsperson look={BOY} x={404} y={432} s={1.28} pose="arms-up" mood="joy" blinkDelay={0.8} /></g>
        </g>
      </Tap>
      <Tap say="Jesus is coming? I want to see Him!" sfx="pop">
        <Townsperson look={FARMER} x={112} y={444} s={1.12} pose="point" facing="left" mood="wow" blinkDelay={1.4} />
      </Tap>
      <Tap say="Come on, Grandma! Let's go and see Jesus!" sfx="good">
        <g>
          <Grandma x={616} y={442} s={1.08} pose="wave" facing="left" blinkDelay={0.5} />
          <Townsperson look={GIRL} x={724} y={446} s={1.25} pose="arms-up" mood="joy" blinkDelay={1.7} />
        </g>
      </Tap>
    </Scene>
  )
}

// 4. "Zacchaeus wanted to see Jesus, too. But he was short, and the crowd was tall. He hopped and jumped, but he could not see a thing!"
// Close up, from the street: the front of the crowd, shoulder to shoulder (too close to see their feet), all looking
// down the street for Jesus. Just behind them, Zacchaeus jumps as high as he can, his hands up and his feet off the
// ground (little lines under them), but even then his eyes only come up to their chins.
// (The grown-ups' eyes are at the height of the picture's eye level, y = 318; his, though he's a little further back,
// stay well below it.)
function Page4() {
  const HOP = 12
  return (
    <Scene sky="day" ground="none">
      <FarHills />
      <Sand y={300} />
      <Houses y={296} s={0.8} houses={[[70, 120, 90, 0.2], [250, 110, 100, -0.2, '#f2e2c0'], [560, 120, 92, 0.2], [740, 110, 86, -0.2, '#f2e2c0']]} />
      <Crowd rows={[[330, 10, 790, 20, 0.46], [344, 0, 800, 18, 0.54]]} seed={50} />
      <Tap say="I can't see! Everyone is so tall." sfx="wobble">
        <g>
          {/* his shadow on the ground, and little lines under his feet: he's up in the air */}
          <ellipse cx={400} cy={444} rx={15} ry={3} fill="#000" opacity={0.14} />
          <g stroke="#9a7a4a" strokeWidth={2.6} strokeLinecap="round">
            <path d="M388 436 l-2 5 M400 435 l0 6 M412 436 l2 5" />
          </g>
          <Zacchaeus x={400} y={444 - HOP} s={1.0} pose="arms-up" mood="wow" reach={[[-24, -150], [24, -150]]} blinkDelay={0.3} />
        </g>
      </Tap>
      <Tap say="Here He comes! I can see Jesus!" sfx="good">
        <g>
          <Townsperson look={JERICHO[1]} x={70} y={466} s={1.3} pose="wave" facing="left" blinkDelay={2.6} />
          <Townsperson look={JERICHO[0]} x={200} y={466} s={1.3} pose="point" facing="left" mood="wow" blinkDelay={1.9} />
          <Townsperson look={NEIGHBOR} x={330} y={466} s={1.3} pose="point" facing="left" mood="wow" blinkDelay={1.3} />
        </g>
      </Tap>
      <Tap say="Jesus is coming down the road!" sfx="pop">
        <g>
          <Townsperson look={FARMER} x={470} y={466} s={1.3} facing="left" blinkDelay={0.7} />
          <Townsperson look={JERICHO[2]} x={600} y={466} s={1.3} pose="wave" facing="left" blinkDelay={2.2} />
          <Grandpa x={730} y={466} s={1.3} facing="left" blinkDelay={1.1} />
        </g>
      </Tap>
    </Scene>
  )
}

// The sycamore tree, by the road outside the town, on pages 5, 6 and 8: (x, y) its foot, s its size.
const TREE = { x: 228, y: 434, s: 0.95 }
/** A point in the tree's own units, on the page. */
const inTree = ([tx, ty]: Pt): Pt => [TREE.x + tx * TREE.s, TREE.y + ty * TREE.s]
/** Where Zacchaeus sits up in it, on the page. */
const PERCH = inTree(SEAT)

/** The road out of town past the sycamore tree, and Jericho's houses and palms behind (pages 5, 6 and 8). */
function TreeRoad({ town = true }: { town?: boolean }) {
  return (
    <g>
      <FarHills />
      <Sand y={302} color="#e2d29a" />
      {town && <Houses y={300} s={0.55} houses={[[560, 110, 90, 0.2], [640, 100, 100, -0.2, '#f2e2c0'], [720, 120, 84, 0.2], [790, 100, 96, -0.2]]} />}
      <Palm x={610} y={306} s={0.6} />
      <Palm x={700} y={302} s={0.55} />
      {/* the road, from the town (on the right, far away) down past the tree */}
      <path d="M800 318 Q640 318 560 340 Q440 372 300 392 Q160 410 0 412 L0 446 Q200 446 360 428 Q520 404 620 364 Q700 334 800 330 Z" fill="#f2e2b6" />
      <Tufts spots={[[40, 438], [520, 440], [760, 420], [470, 360]]} />
    </g>
  )
}

// 5. "So Zacchaeus ran ahead, down the road, to a big sycamore tree. Then up, up, up he climbed! Now he could see everything."
// He sits up on the tree's low branch, pointing: far down the road, the crowd is coming, and Jesus is in front.
// A bird on the big branch says hello.
function Page5() {
  const [bx, by] = inTree(PERCH_LEFT)
  return (
    <Scene sky="day" ground="none">
      <TreeRoad />
      {/* the crowd far down the road, with Jesus in front */}
      <Tap say="Here comes Jesus, with a great big crowd!" sfx="good">
        <g>
          <Crowd rows={[[326, 640, 760, 7, 0.3], [334, 616, 770, 7, 0.34]]} seed={70} waving={2} />
          <Jesus x={604} y={344} s={0.36} pose="wave" />
        </g>
      </Tap>
      <Dust x={360} y={418} flip />
      {/* (a tap on Zacchaeus is his own: the innermost Tap answers) */}
      <Tap say="This big sycamore tree is just right for climbing!" sfx="swish">
        <Sycamore x={TREE.x} y={TREE.y} s={TREE.s}>
          <Tap say="Up here, I can see everything!" sfx="good">
            <ZacchaeusPerched x={SEAT[0]} y={SEAT[1]} pose="point" mood="joy" blinkDelay={0.4} />
          </Tap>
        </Sycamore>
      </Tap>
      <Tap say="Tweet, tweet! Hello, Zacchaeus!" sfx="pop">
        <PerchedBird x={bx} y={by} s={1.05} flip />
      </Tap>
    </Scene>
  )
}

// 6. "Here came Jesus, walking down the road with His friends. Then Jesus stopped, right under the sycamore tree!"
// Jesus stands right under Zacchaeus' branch, looking up; Peter, Andrew, James and John are a step behind Him (Peter
// points up), and the crowd follows along the road. Up in the tree, Zacchaeus stares down: Jesus stopped right here!
function Page6() {
  return (
    <Scene sky="day" ground="none">
      <TreeRoad />
      <Tap say="Look! Jesus stopped!" sfx="pop">
        <Crowd rows={[[330, 540, 790, 10, 0.4], [346, 580, 800, 9, 0.48]]} seed={90} />
      </Tap>
      <Sycamore x={TREE.x} y={TREE.y} s={TREE.s}>
        <Tap say="Jesus stopped right under my tree!" sfx="ding">
          <ZacchaeusPerched x={SEAT[0]} y={SEAT[1]} mood="wow" blinkDelay={0.4} />
        </Tap>
      </Sycamore>
      <Tap say="Who is that up in the tree?" sfx="pop">
        <g>
          <Figure x={668} y={404} s={0.84} look={PEOPLE.james} facing="left" blinkDelay={1.6} />
          <Figure x={600} y={408} s={0.86} look={PEOPLE.john} facing="left" blinkDelay={2.3} />
          <Figure x={532} y={414} s={0.9} look={PEOPLE.andrew} facing="left" blinkDelay={0.9} />
          <Figure x={460} y={424} s={0.95} look={PEOPLE.peter} pose="point" facing="left" mood="wow" reach={[null, [40, -124]]} blinkDelay={1.2} />
        </g>
      </Tap>
      <Tap say="Hello up there!" sfx="sparkle">
        <LookingUp><Jesus x={358} y={438} s={1.02}><EyesUp /></Jesus></LookingUp>
      </Tap>
    </Scene>
  )
}

// ----- Part 2 -----

// 7. "Remember Zacchaeus, up in the sycamore tree? Jesus looked up and said, "Zacchaeus, hurry and come down! I must stay at your house today.""
// Closer: Jesus looks up and calls him, His hand raised to him. Zacchaeus puts his hand on his chest: "Me?" Peter and
// John are amazed too.
function Page7() {
  const T = { x: 168, y: 470, s: 1.12 }
  return (
    <Scene sky="day" ground="none">
      <FarHills />
      <Sand y={302} color="#e2d29a" />
      <Houses y={300} s={0.55} houses={[[600, 110, 90, 0.2], [690, 100, 100, -0.2, '#f2e2c0'], [780, 120, 84, 0.2]]} />
      <path d="M800 330 Q600 340 420 392 Q300 424 160 450 L800 450 Z" fill="#f2e2b6" />
      <Crowd rows={[[338, 560, 790, 8, 0.44], [356, 600, 800, 7, 0.52]]} seed={110} />
      <Sycamore x={T.x} y={T.y} s={T.s}>
        <Tap say="Me? Jesus knows my name!" sfx="ding">
          <ZacchaeusPerched x={SEAT[0]} y={SEAT[1]} mood="wow" reach={[null, [5, -66]]} blinkDelay={0.4} />
        </Tap>
      </Sycamore>
      <Tap say="Jesus wants to go to his house!" sfx="pop">
        <g>
          <Figure x={668} y={436} s={1.0} look={PEOPLE.john} mood="wow" blinkDelay={2.1} />
          <Figure x={582} y={444} s={1.06} look={PEOPLE.peter} mood="wow" facing="left" blinkDelay={1.2} />
        </g>
      </Tap>
      <Tap say="Zacchaeus, hurry and come down!" sfx="sparkle">
        <LookingUp><Jesus x={446} y={448} s={1.2} pose="wave" facing="left"><EyesUp /></Jesus></LookingUp>
      </Tap>
    </Scene>
  )
}

// 8. "Zacchaeus hurried down, as fast as he could. He was so happy! But some people grumbled, "Why is Jesus going to his house?""
// He's just jumped down from his branch (leaves still falling after him), his arms up for joy, and Jesus welcomes
// him with open arms. Over on the right, the farmer and the neighbor fold their arms and grumble, just a little.
function Page8() {
  const [px, py] = PERCH
  return (
    <Scene sky="day" ground="none">
      <TreeRoad town={false} />
      <Crowd rows={[[326, 470, 790, 10, 0.38], [342, 540, 800, 9, 0.46]]} seed={130} />
      <Sycamore x={TREE.x} y={TREE.y} s={TREE.s} />
      {/* puffs of dust where he landed */}
      <Dust x={px - 30} y={432} flip />
      <Dust x={px + 40} y={432} />
      <FallingLeaf x={px - 40} y={py + 58} r={30} />
      <FallingLeaf x={px + 56} y={py + 40} r={-40} />
      <FallingLeaf x={px + 62} y={py + 118} r={70} />
      <FallingLeaf x={px - 46} y={py + 128} r={-60} />
      <Tap say="Hooray! Jesus is coming to my house!" sfx="good">
        <Zacchaeus x={px + 4} y={438} s={1.08} pose="arms-up" mood="joy" blinkDelay={0.4} />
      </Tap>
      <Tap say="Let's go to your house, Zacchaeus!" sfx="sparkle">
        <g>
          <Figure x={548} y={424} s={0.94} look={PEOPLE.peter} facing="left" blinkDelay={1.4} />
          <Jesus x={452} y={436} s={1.02} pose="open" facing="left" />
        </g>
      </Tap>
      <Tap say="Hmph! Why is Jesus going to his house?" sfx="wobble">
        <g>
          <Townsperson look={FARMER} x={640} y={440} s={1.04} pose="cross" mood="grumpy" facing="left" blinkDelay={0.8} />
          <Townsperson look={NEIGHBOR} x={728} y={436} s={1.0} pose="cross" mood="grumpy" facing="left" blinkDelay={1.9} />
          <Grumble x={642} y={284} />
          <Grumble x={730} y={288} />
        </g>
      </Tap>
    </Scene>
  )
}

/** Inside Zacchaeus' house in the evening: plastered walls with his blue and gold band, a lamp lit in a niche, an arched window (the dusky sky and a palm) with purple curtains, and a woven rug. */
function Room() {
  const purple = ZACCHAEUS.robe
  return (
    <g>
      <rect width={800} height={450} fill="#f3e3c3" />
      <rect y={296} width={800} height={154} fill="#d8b98a" />
      <path d="M0 296 L800 296" stroke="#b8956a" strokeWidth={4} />
      <rect y={238} width={800} height={14} fill="#4f8fc0" stroke="#2f5f8a" strokeWidth={2} />
      {Array.from({ length: 27 }, (_, i) => <circle key={i} cx={10 + i * 30} cy={245} r={2.6} fill="#f2c24a" />)}
      {/* a lamp lit in a little niche */}
      <path d="M44 214 L44 154 Q44 124 74 124 Q104 124 104 154 L104 214 Z" fill="#e6cfa0" stroke="#b89a68" strokeWidth={3} />
      <Glow x={74} y={180} r={70} color="#ffe9a0" />
      <path d="M58 200 Q74 214 90 200 L94 190 L54 190 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2} strokeLinejoin="round" />
      <path d="M90 192 L100 186" stroke="#8a5428" strokeWidth={3} strokeLinecap="round" />
      <path d="M100 186 Q95 174 100 166 Q105 174 100 186 Z" fill="#ffd34d" stroke="#f0a020" strokeWidth={1.4} />
      {/* the arched window, with the evening outside, and purple curtains */}
      <defs>
        <linearGradient id="zcdusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b5bb5" /><stop offset="1" stopColor="#ffa8b8" /></linearGradient>
      </defs>
      <path d="M232 222 L232 120 Q232 60 292 60 Q352 60 352 120 L352 222 Z" fill="url(#zcdusk)" stroke="#b89a68" strokeWidth={5} />
      <path d="M244 222 Q272 196 308 206 Q332 196 352 210 L352 222 Z" fill="#7a6aa0" />
      <path d="M284 222 Q288 170 278 140" stroke="#5a4a6a" strokeWidth={6} fill="none" strokeLinecap="round" />
      {[-60, -20, 20, 60].map((a) => <path key={a} d="M278 140 q22 -8 34 10" stroke="#5a4a6a" strokeWidth={5} fill="none" strokeLinecap="round" transform={`rotate(${a} 278 140)`} />)}
      <circle cx={324} cy={98} r={3} fill="#fff8d0" /><circle cx={262} cy={86} r={2.2} fill="#fff8d0" />
      <path d="M220 64 Q238 140 224 226 L208 226 Q218 140 208 60 Z" fill={purple} stroke={ink(purple)} strokeWidth={2} />
      <path d="M364 64 Q346 140 360 226 L376 226 Q366 140 376 60 Z" fill={purple} stroke={ink(purple)} strokeWidth={2} />
      <path d="M202 58 L382 58" stroke="#8a5a2e" strokeWidth={6} strokeLinecap="round" />
      {/* the rug */}
      <path d="M60 420 L130 330 L700 330 L760 420 Z" fill="#c0504d" stroke="#8a3434" strokeWidth={3} strokeLinejoin="round" />
      <path d="M92 410 L150 340 L680 340 L728 410 Z" fill="none" stroke="#f2c24a" strokeWidth={3} strokeDasharray="10 8" />
    </g>
  )
}

/** The low dinner table, set: bread, a bowl of grapes and figs, a jug and cups. (x, y): the middle of its front, on the floor. */
function DinnerTable({ x, y, w = 360 }: { x: number; y: number; w?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={w / 2 + 10} ry={7} fill="#000" opacity={0.14} />
      {[-w / 2 + 18, w / 2 - 18].map((lx) => <rect key={lx} x={lx - 7} y={-26} width={14} height={26} rx={3} fill="#7a4a28" stroke="#4a2a14" strokeWidth={2} />)}
      <rect x={-w / 2} y={-38} width={w} height={14} rx={4} fill="#a0612f" stroke="#5a3418" strokeWidth={2.5} />
      {/* bowls of figs and grapes, bread, a jug and two cups */}
      <ellipse cx={-110} cy={-44} rx={30} ry={9} fill="#e8d4b0" stroke="#a8875a" strokeWidth={2} />
      {[[-124, -50], [-112, -54], [-100, -50], [-118, -58], [-106, -60]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={6} fill="#9a5a8a" stroke="#5a2a4a" strokeWidth={1.6} />)}
      <Bread x={-40} y={-50} s={0.8} />
      <Bread x={-6} y={-52} s={0.72} />
      <ellipse cx={70} cy={-44} rx={28} ry={8} fill="#e8d4b0" stroke="#a8875a" strokeWidth={2} />
      {[[58, -50], [70, -54], [82, -50], [64, -58], [77, -59]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={6} fill={i % 2 ? '#e9a04a' : '#d9785a'} stroke="#9a4a32" strokeWidth={1.6} />)}
      <path d="M126 -38 L122 -60 Q120 -70 128 -74 L128 -80 L140 -80 L140 -74 Q148 -70 146 -60 L142 -38 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={2.2} />
      <path d="M146 -66 Q156 -64 152 -52 L145 -50" stroke="#8a4a2a" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {[24, 160].map((cx) => <path key={cx} d={`M${cx - 7} -50 L${cx + 7} -50 L${cx + 5} -38 L${cx - 5} -38 Z`} fill="#e8c25a" stroke="#a8802a" strokeWidth={1.8} />)}
    </g>
  )
}

// 9. "At dinner, Zacchaeus stood up and said, "Half of what I have, I'll give to the poor. And if I took too much from anyone, I'll pay them back four times as much!""
// Dinner at his house: Jesus, Peter and John sit at the low table, and Zacchaeus stands up beside his chest of
// coins. What he says is in his bubble: his coins in two even heaps, one of them going to the poor grandma (half);
// and for every coin he took, four coins back.
function Page9() {
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <Room />
      <Tap say="Jesus is so glad to be here." sfx="sparkle">
        <Sitting x={288} y={402} s={1.02} look={PEOPLE.jesus} />
      </Tap>
      <Tap say="Yum! Bread and grapes and figs. Thank you for dinner, Zacchaeus!" sfx="chomp">
        <g>
          <Sitting x={180} y={398} s={0.98} look={PEOPLE.peter} blinkDelay={1.4} />
          <Sitting x={394} y={400} s={0.96} look={PEOPLE.john} blinkDelay={2.2} />
          <DinnerTable x={288} y={410} />
        </g>
      </Tap>
      <Tap say="Half of my coins are for the poor!" sfx="ding">
        <CoinChest x={700} y={432} s={0.86} />
      </Tap>
      <Tap say="I took too much, so I will give back four times as much!" sfx="good">
        <Zacchaeus x={584} y={436} s={1.18} pose="open" mood="joy" blinkDelay={0.4} />
      </Tap>
      {/* what he says: his coins in two even heaps, and one of them (half) for the poor grandma; and one coin he took, four coins he'll give back */}
      <Speech x={446} y={34} w={326} h={196} tail={[578, 292]}>
        {[478, 542].map((hx) => (
          <g key={hx}>
            <Coin x={hx - 12} y={108} s={0.3} />
            <Coin x={hx + 12} y={108} s={0.3} />
            <Coin x={hx} y={88} s={0.3} />
          </g>
        ))}
        <path d="M510 70 L510 124" stroke="#c9b8d8" strokeWidth={3} strokeLinecap="round" strokeDasharray="5 6" />
        <Arrow x={572} y={98} w={48} />
        <Grandma x={680} y={130} s={0.42} pose="arms-up" mood="joy" />
        <path d="M466 146 L752 146" stroke="#e6dcef" strokeWidth={3} strokeLinecap="round" strokeDasharray="2 9" />
        <Coin x={496} y={188} s={0.4} />
        <Arrow x={540} y={188} w={52} />
        {[612, 646, 680, 714].map((cx) => <Coin key={cx} x={cx} y={188} s={0.36} />)}
      </Speech>
    </Scene>
  )
}

// 10. "Jesus said, "Today God's rescue has come to this house! The Son of Man came to look for the lost ones and save them." The Son of Man is Jesus! Zacchaeus was lost, but Jesus found him."
// Evening at Zacchaeus' door: God's light shines down on his house. Jesus has His hand on Zacchaeus' shoulder,
// and Zacchaeus folds his hands, so thankful he has happy tears. Jesus' friends are glad, and the girl and her
// grandma come to see.
function Page10() {
  return (
    <Scene sky="dusk" ground="none" stars clouds={false}>
      <FarHills dusk />
      <Rays x={520} y={-40} r={620} n={16} color="#fff3b0" opacity={0.42} />
      <Glow x={520} y={90} r={200} color="#fff3c0" />
      <Sand y={318} color="#d9bf8e" />
      <Palm x={60} y={360} s={1.1} />
      <Tap say="God's rescue has come to this house!" sfx="sparkle">
        <BigHouse x={540} y={394} s={0.92} lit />
      </Tap>
      <Figure x={136} y={430} s={0.96} look={PEOPLE.andrew} blinkDelay={1.1} />
      <Figure x={212} y={436} s={1.0} look={PEOPLE.peter} pose="pray" blinkDelay={2.0} />
      <Tap say="Thank you, Jesus! You found me." sfx="good">
        <Zacchaeus x={398} y={440} s={1.15} pose="pray" mood="teary" facing="left" blinkDelay={0.4} />
      </Tap>
      <Tap say="I came to look for the lost ones, and save them." sfx="sparkle">
        <Jesus x={318} y={440} s={1.1} pose="hug-right" reach={[null, [57, -63]]} />
      </Tap>
      <Tap say="Jesus loves Zacchaeus!" sfx="ding">
        <g>
          <Grandma x={686} y={440} s={1.0} pose="pray" facing="left" mood="joy" blinkDelay={1.5} />
          <Townsperson look={GIRL} x={752} y={444} s={1.1} pose="wave" facing="left" blinkDelay={0.6} />
        </g>
      </Tap>
      <Heart x={358} y={232} s={0.8} color={PINK} />
      <g pointerEvents="none"><Sparkles spots={[[420, 160, 9], [620, 140, 8], [300, 190, 6], [700, 210, 7]]} /></g>
    </Scene>
  )
}

// 11. "Zacchaeus gave back what he took, and more! He shared with the poor, too. Jesus loves everyone, and His love changes hearts!"
// The next morning in front of his house: the farmer holds up the four coins he got back, and Zacchaeus, his money bag
// open, has shared with the poor: the grandpa, the grandma, the boy and the girl have two coins each (as everyone gets
// the same in the game that follows). Everyone is smiling now, and Jesus is glad.
function Page11() {
  /** Two coins held side by side in the hands, in figure units. */
  const two = (y: number, s: number) => <g><Coin x={-9} y={y} s={s} /><Coin x={9} y={y} s={s} /></g>
  return (
    <Scene sky="day" ground="none" sun>
      <FarHills />
      <Sand y={304} />
      <BigHouse x={118} y={350} s={0.6} />
      <Houses y={320} s={0.7} houses={[[420, 120, 90, 0.2, '#f2e2c0'], [560, 110, 100, -0.2]]} />
      <Palm x={330} y={332} s={0.8} />
      <Palm x={700} y={330} s={0.85} />
      <path d="M0 380 Q400 364 800 378 L800 450 L0 450 Z" fill="#f0dfb2" />
      <Tap say="Four coins! Thank you, Zacchaeus!" sfx="ding">
        <Townsperson look={FARMER} x={84} y={440} s={1.06} pose="arms-up" mood="joy" blinkDelay={0.9}
          item={<g>{[-50, -34, 34, 50].map((cx) => <Coin key={cx} x={cx} y={-145} s={0.2} />)}</g>} />
      </Tap>
      <Tap say="Here you go! These coins are for you." sfx="good">
        <Zacchaeus x={210} y={442} s={1.14} pose="hold" mood="joy" blinkDelay={0.4} item={<MoneyBag x={0} y={-62} s={0.92} />} />
      </Tap>
      <Tap say="Thank you, Zacchaeus! God bless you." sfx="ding">
        <g>
          {/* (the grandpa holds his two coins out, one in each hand, clear of his long beard) */}
          <Grandpa x={326} y={440} s={1.06} pose="open" facing="left" mood="joy" blinkDelay={2.0} reach={[[-44, -62], [44, -62]]}
            item={<g><Coin x={-44} y={-75} s={0.22} /><Coin x={44} y={-75} s={0.22} /></g>} />
          <Grandma x={430} y={442} s={1.06} pose="hold" facing="left" mood="joy" blinkDelay={1.2} item={two(-70, 0.22)} />
          <Townsperson look={BOY} x={506} y={446} s={1.08} pose="arms-up" mood="joy" blinkDelay={2.4}
            item={<g><Coin x={-42} y={-143} s={0.3} /><Coin x={42} y={-143} s={0.3} /></g>} />
          <Townsperson look={GIRL} x={566} y={446} s={1.08} pose="hold" blinkDelay={0.7} item={two(-72, 0.3)} />
        </g>
      </Tap>
      <Tap say="Jesus loves everyone, and His love changes hearts!" sfx="sparkle">
        <Jesus x={706} y={436} s={1.04} pose="open" facing="left" />
      </Tap>
      <Heart x={380} y={196} s={0.8} color={PINK} />
      <Heart x={500} y={236} s={0.6} color="#ffcf3f" />
      <Heart x={220} y={240} s={0.6} color={PINK} />
      <g pointerEvents="none"><Sparkles spots={[[268, 300, 7], [420, 286, 6], [640, 270, 8]]} /></g>
    </Scene>
  )
}

/** Part 1 is pages 1–6; part 2 (data/zacchaeus.ts, `first: 6`) is pages 7–11. */
export const ZACCHAEUS_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]
