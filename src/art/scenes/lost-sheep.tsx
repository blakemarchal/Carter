// The Lost Sheep (Luke 15:3–7): one picture per story page, both parts in order (see data/lost-sheep.ts for the
// words). Part one (pages 1 to 5): Jesus tells a story; the shepherd and his flock, the littlest lamb, the evening
// count with one missing, and off he goes to look. Part two (pages 6 to 10): the search by moonlight, the lamb in
// the bush, home at sunrise on his shoulders, the party, and what Jesus said it means.
// The day goes by from page to page: midday (1 to 3), sunset (4), twilight (5), moonlight (6, 7), sunrise (8),
// morning (9), and back to Jesus on the hillside (10).
// The shepherd is PEOPLE.shepherd on every page. The little lamb, the shepherd carrying it, and the stone fold are
// drawn in art/items/isl-lost-sheep.tsx (the activities show them too). A hundred sheep is a crowd, not a count:
// a big flock spreads over the hills and back out of sight, and the full fold is packed with woolly backs.
// God is never drawn as a person: His presence is light (page 10).
import type { ComponentType, ReactNode } from 'react'
import { ink, useShade } from '../kit'
import { fluff } from '../items/draw'
import { Figure, Person, PEOPLE, Sitting, SittingOnRock, SKIN, type Look } from '../people'
import { LambFace, LittleLamb, SHEPHERD, ShepherdCarrying, StoneFold } from '../items/isl-lost-sheep'
import { Birds, Dream, Glow, Moon, MudHouse, MusicNote, Rays, Rock, Scene, Sparkles, Sun, Tap, ThoughtBubble, Tree, WoolSheep } from './kit'
import './lost-sheep.css'

// ---------- The shepherd's things ----------

/**
 * A little hand lantern, hanging from the hand that holds its ring at (x, y): a metal cap, glass sides with a
 * flame inside, and a base. `lit`: the flame glows. About 16 wide and 34 tall at s = 1.
 */
export function Lantern({ x, y, s = 1, lit = true }: { x: number; y: number; s?: number; lit?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      {lit && <Glow x={0} y={20} r={46} color="#ffe39a" />}
      <path d="M-4.5 7 Q-5 -1 0 -1 Q5 -1 4.5 7" stroke="#5a4a3a" strokeWidth={2} fill="none" />
      <path d="M-6 7 L6 7 L8 11 L-8 11 Z" fill="#7a6a58" stroke="#4a3a2a" strokeWidth={1.4} />
      <rect x={-7.5} y={11} width={15} height={16} rx={2.5} fill={lit ? '#ffe9a0' : '#d9d3c4'} stroke="#4a3a2a" strokeWidth={1.6} />
      {lit && <g className="pa-twinkle"><path d="M0 14.5 Q4 19.5 0 24 Q-4 19.5 0 14.5 Z" fill="#ff9a3c" /></g>}
      <path d="M-2.6 11 L-2.6 27 M2.6 11 L2.6 27" stroke="#4a3a2a" strokeWidth={1} opacity={0.7} />
      <rect x={-8.5} y={27} width={17} height={4.5} rx={1.6} fill="#7a6a58" stroke="#4a3a2a" strokeWidth={1.4} />
    </g>
  )
}

/**
 * The shepherd holding up his lantern to look for his lamb (Figure, his right hand raised with the lantern in it and
 * his staff in his left hand). `calling`: his mouth open, calling for it. Origin at his feet, as Person.
 */
export function ShepherdLooking({ x, y, s = 1, facing = 'right', calling, blinkDelay = 0 }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; calling?: boolean; blinkDelay?: number
}) {
  return (
    <Figure x={x} y={y} s={s} look={SHEPHERD} pose="wave" mood={calling ? 'wow' : 'happy'} holding="staff" heldHand={0} facing={facing}
      reach={[null, [56, -120]]} item={<Lantern x={56} y={-124} s={0.95} />} blinkDelay={blinkDelay} />
  )
}

/** "Little lamb!" or "Baa!": little lines of a call going out from (x, y) to the right (or, with `dir` -1, the left). */
const Calling = ({ x, y, s = 1, dir = 1 }: { x: number; y: number; s?: number; dir?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
    <g className="ls-call" fill="none" stroke="#fff6c8" strokeWidth={3.2} strokeLinecap="round">
      <path d="M0 -8 Q6 0 0 8" /><path d="M9 -14 Q19 0 9 14" /><path d="M19 -20 Q32 0 19 20" />
    </g>
  </g>
)

/**
 * The shepherd seen from behind, walking away from us: his head cloth over the back of his head and down to his
 * shoulders, his robe and sash, his staff in his right hand and (with `lantern`) the lantern in his left. Origin at
 * his feet, as Person; the same size as Person at the same s.
 */
export function ShepherdFromBehind({ x, y, s = 1, lantern }: { x: number; y: number; s?: number; lantern?: boolean }) {
  const look = SHEPHERD
  const robe = useShade(look.robe, 0.3, 0.2)
  const wrap = look.wrap ?? '#e8dcc0'
  const cloth = useShade(wrap, 0.25, 0.15)
  const arm = (x1: number, y1: number, x2: number, y2: number) => (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={ink(look.robe)} strokeWidth={17} strokeLinecap="round" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={look.robe} strokeWidth={14} strokeLinecap="round" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#a3906f" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    </g>
  )
  const hand = (hx: number, hy: number) => <circle cx={hx} cy={hy} r={7} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{robe.def}{cloth.def}</defs>
      <g className="pa-breathe">
        {/* his heels, as he walks away */}
        <ellipse cx={-11} cy={-4} rx={8} ry={4.5} fill="#7a5233" />
        <ellipse cx={11} cy={-6} rx={8} ry={4.5} fill="#7a5233" />
        <path d="M-21 -92 Q0 -100 21 -92 L35 -10 Q0 -1 -35 -10 Z" fill={robe.fill} stroke={ink(look.robe)} strokeWidth={3} strokeLinejoin="round" />
        <path d="M0 -60 L0 -12" stroke={ink(look.robe)} strokeWidth={1.6} opacity={0.35} />
        {look.sash && <path d="M-27 -54 Q0 -47 27 -54 L28 -45 Q0 -38 -28 -45 Z" fill={look.sash} stroke={ink(look.sash)} strokeWidth={2} />}
        {/* arms at his sides: the staff in his right hand (our right), the lantern in his left */}
        {arm(-20, -86, -29, -48)}
        {arm(20, -86, 31, -48)}
        <path d="M33 -150 Q42 -164 33 -170 Q25 -166 29 -158 M33 -150 L31 -2" stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
        {hand(31, -48)}
        {lantern && <Lantern x={-29} y={-50} s={0.95} />}
        {hand(-29, -48)}
        {/* his head, covered by his head cloth, which hangs down to his shoulders */}
        <circle cx={-21} cy={-112} r={4.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />
        <circle cx={21} cy={-112} r={4.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />
        <path d="M-24 -110 Q-27 -142 0 -142 Q27 -142 24 -110 Q31 -84 22 -86 Q0 -80 -22 -86 Q-31 -84 -24 -110 Z" fill={cloth.fill} stroke={ink(wrap)} strokeWidth={2.5} />
        <path d="M-12 -126 Q-14 -104 -12 -88 M10 -128 Q13 -106 12 -88" stroke={ink(wrap)} strokeWidth={1.4} fill="none" opacity={0.45} strokeLinecap="round" />
      </g>
    </g>
  )
}

/** The shepherd's staff lying on the grass, its crook at the left end. (x, y): its middle. */
const StaffOnGround = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-70 -4 Q-84 -12 -88 -2 Q-88 6 -80 4 M-70 -4 L72 2" stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
)

// ---------- Bushes, rocks and hills ----------

/**
 * A round, tangly bush with little leaves, twigs and red berries (the little lamb gets stuck in one). (x, y) = the
 * ground under its middle; about 120 wide and 80 tall at s = 1. `night`: darker, in the moonlight.
 */
export function Bramble({ x, y, s = 1, night, dusk }: { x: number; y: number; s?: number; night?: boolean; dusk?: boolean }) {
  const green = night ? '#4f7f5a' : dusk ? '#5a9258' : '#5fa65a'
  const leaf = useShade(green, 0.3, 0.2)
  const dark = ink(green)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <defs>{leaf.def}</defs>
      <ellipse cx={0} cy={-2} rx={58} ry={6} fill="#000" opacity={0.12} />
      <path d={fluff(0, -38, 54, 34, 11, 0.62)} fill={leaf.fill} stroke={dark} strokeWidth={2.6} />
      <BrambleMarks dark={dark} />
    </g>
  )
}

/** A bramble's twigs, leaf marks and berries, in its own units (drawn again over anything caught in it). */
function BrambleMarks({ dark }: { dark: string }) {
  return (
    <g>
      <g stroke="#6b4a2e" strokeWidth={2.4} strokeLinecap="round" fill="none">
        <path d="M-50 -48 l-12 -8 M-44 -66 l-6 -12 M40 -66 l8 -11 M54 -44 l12 -6 M-6 -76 l-2 -12 M18 -74 l6 -11" />
      </g>
      <g stroke={dark} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.55}>
        <path d="M-30 -40 q6 -5 12 -2 M10 -50 q6 -6 12 -2 M-14 -20 q6 -5 12 -2 M24 -24 q5 -5 11 -2 M-36 -58 q5 -4 10 -1" />
      </g>
      {[[-24, -56], [30, -40], [6, -24], [-40, -30]].map(([bx, by]) => <circle key={`${bx}`} cx={bx} cy={by} r={3} fill="#c0504d" stroke="#8a2a2a" strokeWidth={1} />)}
    </g>
  )
}

/**
 * The little lamb stuck in a bramble (page 7, and the mini-game): its head and chest poke out of the front of the bush,
 * with twigs and leaves over its wool, and its front legs stand in the grass. Bramble units: draw it at the
 * Bramble's (x, y, s). `mood` is the lamb's.
 */
export function LambInBramble({ x, y, s = 1, night, dusk, mood = 'scared' }: { x: number; y: number; s?: number; night?: boolean; dusk?: boolean; mood?: 'scared' | 'happy' }) {
  const green = night ? '#4f7f5a' : dusk ? '#5a9258' : '#5fa65a'
  const leaf = useShade(green, 0.3, 0.2)
  const wool = useShade('#fffaf2', 0.5, 0.12)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <defs>{leaf.def}{wool.def}</defs>
      {/* the front legs, standing in the grass in front of the bush */}
      {[-30, -18].map((lx) => (
        <g key={lx} strokeLinecap="round">
          <path d={`M${lx} -26 L${lx - 1} -3`} stroke={ink('#7a6670')} strokeWidth={7.6} />
          <path d={`M${lx} -26 L${lx - 1} -3`} stroke="#7a6670" strokeWidth={5.4} />
        </g>
      ))}
      {/* its woolly chest, poking out of the bush */}
      <path d={fluff(-22, -36, 19, 14, 9)} fill={wool.fill} stroke="#cbbfb4" strokeWidth={2} />
      {/* leaves and twigs over the back of its wool: it's caught in the bush */}
      <path d={fluff(2, -44, 15, 16, 6, 0.6)} fill={leaf.fill} stroke={ink(green)} strokeWidth={2.2} />
      <path d={fluff(-8, -16, 13, 9, 5, 0.6)} fill={leaf.fill} stroke={ink(green)} strokeWidth={2.2} />
      <path d="M-8 -58 Q-18 -50 -30 -52 M-2 -28 Q-12 -30 -20 -24" stroke="#6b4a2e" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <circle cx={-4} cy={-46} r={3} fill="#c0504d" stroke="#8a2a2a" strokeWidth={1} />
      <LambFace x={-34} y={-58} s={1.15} mood={mood} />
    </g>
  )
}

/** A big boulder (behind it, the shepherd looks; the bunny hides). (x, y) = the ground under its middle; w wide, h tall. */
export function Boulder({ x, y, w, h, night, flip }: { x: number; y: number; w: number; h: number; night?: boolean; flip?: boolean }) {
  const color = night ? '#8d93ab' : '#b9ad9a'
  const shade = useShade(color, 0.3, 0.2)
  const line = ink(color)
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} strokeLinejoin="round">
      <defs>{shade.def}</defs>
      <ellipse cx={0} cy={-1} rx={w * 0.54} ry={5} fill="#000" opacity={0.13} />
      <path d={`M${-w / 2} 0 Q${-w * 0.55} ${-h * 0.62} ${-w * 0.2} ${-h * 0.94} Q${w * 0.06} ${-h * 1.06} ${w * 0.3} ${-h * 0.84} Q${w * 0.56} ${-h * 0.6} ${w / 2} 0 Z`}
        fill={shade.fill} stroke={line} strokeWidth={3} />
      <path d={`M${-w * 0.3} ${-h * 0.72} Q${-w * 0.16} ${-h * 0.9} ${w * 0.02} ${-h * 0.92}`} stroke="#fff" strokeWidth={3.5} opacity={0.3} fill="none" strokeLinecap="round" />
      <path d={`M${w * 0.18} ${-h * 0.42} l${w * 0.07} ${h * 0.1} l${-w * 0.02} ${h * 0.14}`} stroke={line} strokeWidth={1.8} fill="none" opacity={0.5} strokeLinecap="round" />
    </g>
  )
}

/** A little house far away (x, y: the middle of its foot): flat-roofed, with a door and a window (`lit` at dawn). */
const FarHouse = ({ x, y, w = 34, lit }: { x: number; y: number; w?: number; lit?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y - w * 0.72} width={w} height={w * 0.72} fill="#d9bd94" stroke="#a8875a" strokeWidth={2} />
    <rect x={x - w / 2 - 2} y={y - w * 0.72 - 4} width={w + 4} height={5} rx={1.5} fill="#bf9e6e" stroke="#a8875a" strokeWidth={1.2} />
    <path d={`M${x - w * 0.3} ${y} L${x - w * 0.3} ${y - w * 0.32} Q${x - w * 0.19} ${y - w * 0.44} ${x - w * 0.08} ${y - w * 0.32} L${x - w * 0.08} ${y} Z`} fill="#7a5a3a" />
    <rect x={x + w * 0.1} y={y - w * 0.5} width={w * 0.2} height={w * 0.18} rx={1.5} fill={lit ? '#ffd76a' : '#7a5a3a'} />
  </g>
)

/** A round leafy tree (the kit's Tree, in any light): `leaf` and `trunk` colors. (x, y): the foot of its trunk. */
function ShadeTree({ x, y, s = 1, leaf = '#5fc46a', trunk = '#9a6a3a', children }: { x: number; y: number; s?: number; leaf?: string; trunk?: string; children?: ReactNode }) {
  const shade = useShade(leaf, 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{shade.def}</defs>
      <path d="M-10 0 L-7 -70 L7 -70 L10 0 Z" fill={trunk} stroke={ink(trunk)} strokeWidth={3} />
      <g className="sc-sway">
        <circle cx={0} cy={-100} r={46} fill={shade.fill} stroke={ink(leaf)} strokeWidth={3} />
        <circle cx={-34} cy={-76} r={28} fill={shade.fill} stroke={ink(leaf)} strokeWidth={3} />
        <circle cx={34} cy={-76} r={28} fill={shade.fill} stroke={ink(leaf)} strokeWidth={3} />
        {children}
      </g>
    </g>
  )
}

/** Grass tufts: [x, y] each (the ground at y). */
const Tufts = ({ spots, color = '#4f9a4a' }: { spots: [number, number][]; color?: string }) => (
  <g stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round">
    {spots.map(([tx, ty]) => <path key={`${tx},${ty}`} d={`M${tx} ${ty} l-4 -10 M${tx + 5} ${ty} l1 -13 M${tx + 10} ${ty} l5 -9`} />)}
  </g>
)

/** Hills, far to near, in the colors of the time of day. */
const HILL_COLORS = {
  day: ['#b8e0b0', '#9fd08a', '#7cc46a'],
  warm: ['#c4dca0', '#a6d084', '#82c068'],
  dusk: ['#a99ac4', '#86a888', '#6f9c74'],
  night: ['#4a5c96', '#3e5e86', '#35577a'],
  dawn: ['#e0c4c0', '#a8cc8e', '#86bf72'],
} as const
type Time = keyof typeof HILL_COLORS

function Hills({ time, far = 'M0 258 Q130 222 280 246 Q420 220 560 242 Q690 218 800 238 L800 450 L0 450 Z', mid = 'M0 312 Q200 278 420 302 Q620 276 800 296 L800 450 L0 450 Z', near = 'M0 368 Q240 340 470 364 T800 356 L800 450 L0 450 Z', children }: {
  time: Time; far?: string; mid?: string; near?: string; children?: ReactNode
}) {
  const [a, b, c] = HILL_COLORS[time]
  return (
    <g>
      <path d={far} fill={a} />
      <path d={mid} fill={b} />
      {children}
      <path d={near} fill={c} />
    </g>
  )
}

// ---------- The flock ----------

/** Tiny sheep far away on the hills: [x, y (feet), size, facing (1 right, -1 left)] each. */
function FarSheep({ spots, night }: { spots: [number, number, number, number][]; night?: boolean }) {
  const wool = night ? '#dfe3f0' : '#fffaf2', line = night ? '#9aa3c0' : '#d8cfc2', face = '#4a3a3a'
  return (
    <g>
      {spots.map(([x, y, k, d], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${d * k} ${k})`}>
          <path d="M-5 -1 L-5 -6 M4 -1 L4 -6" stroke={face} strokeWidth={2.2} strokeLinecap="round" />
          <ellipse cx={0} cy={-10} rx={10} ry={6.5} fill={wool} stroke={line} strokeWidth={1.5} />
          <ellipse cx={10} cy={-12} rx={4} ry={3.4} fill={face} />
        </g>
      ))}
    </g>
  )
}

/** A steady, made-up shuffle (the same picture every time). */
function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

/** Far sheep scattered along rows: [y, from x, to x, how many, size] each, a little out of line. */
function scatter(rows: [number, number, number, number, number][], seed: number): [number, number, number, number][] {
  const r = rng(seed)
  return rows.flatMap(([y, x0, x1, n, k]) => Array.from({ length: n }, (_, i): [number, number, number, number] => {
    const step = (x1 - x0) / n
    return [x0 + step * (i + 0.2 + r() * 0.6), y + (r() - 0.5) * 7 * k, k * (0.88 + r() * 0.24), r() < 0.5 ? -1 : 1]
  }))
}

/** Sheep in the kit's wool, side-on: [x, y (feet), size, facing, head] each, drawn back to front. */
type SheepSpot = [number, number, number, 'left' | 'right', 'up' | 'down' | 'rest']
const Flock = ({ sheep }: { sheep: SheepSpot[] }) => (
  <g>{[...sheep].sort((p, q) => p[1] - q[1]).map(([x, y, s, f, h], i) => <WoolSheep key={i} x={x} y={y} s={s} facing={f} head={h} />)}</g>
)

/**
 * The fold's flock, packed in together: rows of sheep inside the floor ellipse (cx, cy, rx, ry), from the back to the
 * front, smaller at the back. `sleepy`: half of them are lying down to sleep.
 */
function FoldFlock({ cx, cy, rx, ry, s, seed, sleepy, skip }: { cx: number; cy: number; rx: number; ry: number; s: number; seed: number; sleepy?: boolean; skip?: [number, number] }) {
  const r = rng(seed)
  const out: SheepSpot[] = []
  for (let k = 0; k < 5; k++) {
    const t = -0.72 + k * 0.33 // (from the back of the floor toward the front)
    const y = cy + ry * t
    const half = rx * Math.sqrt(1 - t * t) * 0.84
    const size = s * (0.86 + k * 0.07)
    const step = 52 * size
    for (let x = cx - half + step * (k % 2 ? 0.5 : 0.15); x < cx + half - 30 * size; x += step) {
      const sx = x + (r() - 0.5) * step * 0.3
      if (skip && sx > skip[0] && sx < skip[1]) continue
      const head = sleepy ? (r() < 0.5 ? 'rest' : 'up') : r() < 0.7 ? 'up' : 'down'
      out.push([sx, y + (r() - 0.5) * 4, size, r() < 0.5 ? 'left' : 'right', head])
    }
  }
  return <Flock sheep={out} />
}

// ---------- People ----------

/** The people listening to Jesus (pages 1 and 10): all kinds of people. (For PEOPLE in people.tsx.) */
export const LISTENERS = {
  /** A mom with her baby. */
  mom: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8875a', robe: '#6fb7b0', sash: '#f5f0e6' },
  /** A grandpa with a long white beard and his walking stick. */
  grandpa: { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#f5f0e6', beard: 'long', beardColor: '#f2efe8', robe: '#7d8fb0', sash: '#e6c27a' },
  /** A man in fine clothes: a plum robe, a gold sash and a gold head cloth (a tax collector, Luke 15:1). */
  rich: { skin: SKIN.light, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8c25a', beard: 'short', beardColor: '#4a3020', robe: '#a0508a', sash: '#ffd34d' },
  /** A fisherman in a sea-green robe. */
  fisher: { skin: SKIN.deep, hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#4f9a8a', sash: '#e8dcc0' },
  /** A grandma in a soft rose robe. */
  grandma: { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#f5f0e6', robe: '#c98aa8', sash: '#f0d38a' },
  /** Children sitting on the grass in front. */
  girl: { skin: SKIN.medium, hair: 'pigtails', hairColor: '#3b2a20', robe: '#ffb347', sash: '#ffffff', bow: '#ff6f91', build: 'child' },
  boy: { skin: SKIN.deep, hair: 'curly', hairColor: '#2b1f18', robe: '#7cb06a', sash: '#e6b85a', build: 'child' },
  little: { skin: SKIN.tan, hair: 'short', hairColor: '#5a3a24', robe: '#5fb7ff', sash: '#ffffff', build: 'child' },
} satisfies Record<string, Look>

/** The shepherd's friends and neighbors, who come to celebrate (page 9). (For PEOPLE in people.tsx.) */
export const NEIGHBORS = {
  /** A neighbor with her tambourine. */
  tambourine: { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#8fb0d8', robe: '#e07a5f', sash: '#f5f0e6' },
  /** A friend who is a shepherd too, in a red head cloth. */
  friend: { skin: SKIN.deep, hair: 'covered', hairColor: '#2b1f18', wrap: '#c0504d', beard: 'short', beardColor: '#2b1f18', robe: '#a88a5a', sash: '#e8dcc0' },
  /** A neighbor in a lavender robe. */
  neighbor: { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', beard: 'short', beardColor: '#3b2a20', robe: '#9a8fd0', sash: '#f0d38a' },
  /** An old neighbor with a white head cloth. */
  granny: { skin: SKIN.light, hair: 'covered', hairColor: '#e8e4dc', wrap: '#fdfaf2', robe: '#7cb06a', sash: '#f5d36a' },
  /** Two children, dancing. */
  kid1: { skin: SKIN.tan, hair: 'ponytail', hairColor: '#3b2a20', robe: '#ff8cc0', sash: '#ffffff', bow: '#c0504d', build: 'child' },
  kid2: { skin: SKIN.medium, hair: 'curly', hairColor: '#4a3020', robe: '#ffd34d', sash: '#5f8fc0', build: 'child' },
} satisfies Record<string, Look>

/** A child sitting cross-legged on the grass (Sitting draws a grown-up's lap, so a child is a grown-up, smaller). */
const SitKid = ({ x, y, s = 1, look, blinkDelay }: { x: number; y: number; s?: number; look: Look; blinkDelay?: number }) => (
  <Sitting x={x} y={y} s={s * 0.74} look={{ ...look, build: undefined }} blinkDelay={blinkDelay} />
)

/** A drawn heart that bobs gently. */
function Heart({ x, y, s = 1, color = '#ff8fb1' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 16 C-24 2 -26 -14 -14 -19 C-7 -22 -2 -17 0 -11 C2 -17 7 -22 14 -19 C26 -14 24 2 0 16 Z" fill={color} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={-10} cy={-10} rx={4} ry={2.4} fill="#fff" opacity={0.65} transform="rotate(-35 -10 -10)" />
      </g>
    </g>
  )
}

/** A tambourine held up in a hand at (x, y), in figure units. */
const Tambourine = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y - 8})`}>
    <g className="ls-shake">
      <circle r={15} fill="#f2dcae" stroke="#a0703f" strokeWidth={4} />
      {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={13.5 * Math.cos((a * Math.PI) / 180)} cy={13.5 * Math.sin((a * Math.PI) / 180)} r={3.2} fill="#ffd34d" stroke="#c99a10" strokeWidth={1.2} />)}
    </g>
  </g>
)

// ---------- Part one ----------

/** The hillside where Jesus tells His story (pages 1 and 10): green hills, a far hill of sheep, a village far off. */
function TellingHill() {
  return (
    <g>
      <Hills time="day">
        {[[700, 238, 26], [734, 234, 30], [768, 239, 24]].map(([hx, hy, w]) => <FarHouse key={hx} x={hx} y={hy} w={w} />)}
      </Hills>
      <FarSheep spots={scatter([[262, 420, 600, 6, 0.6], [276, 440, 620, 5, 0.66]], 7)} />
      <Tree x={70} y={344} s={1.05} />
      <Tufts spots={[[30, 446], [470, 430], [520, 444], [760, 440], [700, 448]]} />
    </g>
  )
}

// 1. "Jesus loved to tell stories, and all kinds of people came to listen. One day, Jesus told them this story."
// Jesus sits on a rock on the hillside to tell His story. All kinds of people stand to listen (a mom with her baby,
// a grandpa with his stick, a man in fine clothes, a fisherman, a grandma), and children sit on the grass in front.
// Far off on the hill, sheep are grazing: the story is about sheep.
function Page1() {
  const L = LISTENERS
  return (
    <Scene sky="day" ground="none">
      <TellingHill />
      <Tap say="We came to hear Jesus!" sfx="good">
        <Person x={160} y={372} s={0.84} look={L.mom} pose="hold" holding="baby" blinkDelay={0.6} />
        <Person x={252} y={366} s={0.84} look={L.grandpa} holding="stick" blinkDelay={1.8} />
        <Person x={344} y={364} s={0.84} look={L.rich} blinkDelay={1.1} />
        <Person x={436} y={368} s={0.84} look={L.fisher} blinkDelay={2.4} />
        <Person x={744} y={374} s={0.84} look={L.grandma} facing="left" blinkDelay={0.3} />
      </Tap>
      <Rock x={610} y={424} s={1.05} />
      <Tap say="Come and listen, everyone! I have a story for you." sfx="sparkle">
        <SittingOnRock x={610} y={424} s={1.05} look={PEOPLE.jesus} pose="wave" />
      </Tap>
      <Tap say="We love Jesus' stories!" sfx="pop">
        <SitKid x={214} y={438} s={1.1} look={L.girl} blinkDelay={0.9} />
        <SitKid x={324} y={442} s={1.1} look={L.boy} blinkDelay={2.1} />
        <SitKid x={440} y={440} s={1.06} look={L.little} blinkDelay={1.4} />
      </Tap>
      <Tap say="Baa!" sfx="wobble">
        <FarSheep spots={[[540, 300, 0.95, -1], [572, 304, 0.85, 1]]} />
      </Tap>
    </Scene>
  )
}

// 2. "There once was a shepherd who had one hundred sheep! Every day, he led them to green grass and cool water."
// A big flock (a crowd, not a count) spreads over the hills and back out of sight: grazing on the green grass and
// drinking at the stream. The shepherd stands with his staff, the little lamb close by him.
const STREAM = 'M508 246 Q530 262 518 284 Q500 312 562 336 Q660 366 618 408 Q596 432 650 452 L744 452 Q676 430 702 402 Q744 352 618 322 Q550 304 562 282 Q574 262 524 244 Z'

function Page2() {
  return (
    <Scene sky="day" ground="none" sun>
      <Hills time="day">
        <FarSheep spots={scatter([[250, 20, 490, 9, 0.5], [262, 600, 790, 5, 0.52], [282, 30, 470, 8, 0.6], [292, 640, 780, 4, 0.62]], 3)} />
      </Hills>
      <path d={STREAM} fill="#7cc8f2" stroke="#56aee6" strokeWidth={3} strokeLinejoin="round" />
      {[[548, 324], [640, 372], [668, 430]].map(([wx, wy], i) => <path key={i} className="sc-wave" d={`M${wx} ${wy} q10 -6 20 0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.75} />)}
      <Flock sheep={[[300, 330, 0.42, 'left', 'down'], [372, 322, 0.4, 'right', 'down'], [440, 334, 0.44, 'left', 'up'], [250, 344, 0.46, 'right', 'down'], [700, 318, 0.4, 'left', 'down'], [760, 330, 0.44, 'left', 'up']]} />
      <Tap say="Slurp, slurp! Cool water." sfx="plop">
        <WoolSheep x={512} y={352} s={0.52} head="down" />
        <WoolSheep x={736} y={392} s={0.6} facing="left" head="down" />
      </Tap>
      <Tufts spots={[[40, 440], [120, 404], [280, 448], [460, 444], [770, 440], [410, 396]]} />
      <Tap say="Munch, munch! Yummy green grass." sfx="chomp">
        <Flock sheep={[[330, 412, 0.78, 'left', 'down'], [440, 436, 0.86, 'right', 'down'], [380, 378, 0.6, 'right', 'down'], [560, 432, 0.82, 'left', 'up']]} />
      </Tap>
      <Tap say="Come along, my sheep! Here is green grass and cool water." sfx="good">
        <Figure x={148} y={428} s={1.06} look={SHEPHERD} holding="staff" blinkDelay={0.7} />
      </Tap>
      <Tap say="Baa! I'm the littlest lamb!" sfx="pop">
        <LittleLamb x={226} y={440} s={0.7} facing="left" />
      </Tap>
    </Scene>
  )
}

// 3. "The shepherd took good care of his sheep. He loved every one of them, even the littlest lamb."
// In the warm afternoon he sits on a rock in the meadow, the littlest lamb snuggled in his arms; his sheep graze and
// rest round about. His staff stands in the grass beside him.
function Page3() {
  const k = 1.45
  return (
    <Scene sky="day" ground="none">
      <Hills time="warm">
        <FarSheep spots={scatter([[262, 440, 780, 7, 0.55], [290, 470, 760, 4, 0.62]], 11)} />
      </Hills>
      <Tree x={92} y={360} s={1.3} />
      <Tufts spots={[[30, 440], [560, 446], [740, 438], [500, 404]]} />
      <Flock sheep={[[560, 364, 0.56, 'left', 'down'], [664, 350, 0.5, 'right', 'down'], [748, 374, 0.58, 'left', 'up']]} />
      <Tap say="Baa! Snuggle time." sfx="pop">
        <WoolSheep x={600} y={432} s={0.9} facing="left" head="rest" />
        <WoolSheep x={724} y={440} s={0.94} head="down" />
      </Tap>
      {/* his staff, stuck in the grass beside him */}
      <path d="M474 440 L452 250 Q450 236 463 234 Q476 234 474 248" stroke="#8a5a2e" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Rock x={350} y={436} s={k} />
      <Tap say="You are my littlest lamb. I love you!" sfx="good">
        <SittingOnRock x={350} y={436} s={k} look={SHEPHERD} pose="hold" blinkDelay={0.4}
          front={(
            <g>
              <Tap say="Baa! I love you too!" sfx="pop">
                <LittleLamb x={0} y={-38} s={0.72} mood="joy" />
              </Tap>
              {[-17, 15].map((hx) => <circle key={hx} cx={hx} cy={-50} r={7} fill={SHEPHERD.skin} stroke={ink(SHEPHERD.skin)} strokeWidth={2} />)}
            </g>
          )} />
      </Tap>
      <Tap sfx="sparkle">
        <Heart x={444} y={200} s={0.7} />
      </Tap>
    </Scene>
  )
}

// 4. "Every evening, he counted his sheep into the sheepfold. One evening he counted: ninety-seven, ninety-eight,
// ninety-nine. Oh no! One little lamb was missing!" At sunset the sheep crowd into the round stone fold, and the
// last one goes in at the gateway as the shepherd counts it. Where is his littlest lamb? (He thinks of it, worried.)
const FOLD4 = { cx: 300, cy: 372, rx: 236, ry: 50, h: 40, gate: [446, 508] as [number, number] }

function Page4() {
  const f = FOLD4
  const gx = 470, gy = f.cy + f.ry * Math.sqrt(1 - ((gx - f.cx) / f.rx) ** 2)
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <Glow x={120} y={240} r={130} color="#ffd9a0" />
      <Sun x={120} y={244} s={0.9} />
      <Hills time="dusk" />
      <Tap say="Baa, baa! Here we are, safe in the sheepfold." sfx="wobble">
        <StoneFold {...f} w={3} grass="#86b07c" inside={<FoldFlock cx={f.cx} cy={f.cy - 6} rx={f.rx} ry={f.ry} s={0.62} seed={21} />} />
      </Tap>
      <Tap say="Baa! Ninety-nine!" sfx="pop">
        <WoolSheep x={gx + 6} y={gy - 4} s={0.6} facing="left" />
      </Tap>
      <Tap say="Ninety-nine? Where is my littlest lamb?" sfx="wobble">
        <Figure x={600} y={428} s={1.06} look={SHEPHERD} pose="point" mood="wow" holding="staff" heldHand={0} facing="left" blinkDelay={0.5} />
      </Tap>
      <Tap say="Oh no! The littlest lamb is missing!" sfx="ding">
        <ThoughtBubble x={690} y={128} w={150} h={112} tail={[[628, 268, 7], [648, 236, 10]]}>
          <LambFace x={672} y={134} s={1.55} mood="happy" />
          <text x={728} y={146} fontSize={46} fontWeight={800} textAnchor="middle" fill="#8a4fc4" stroke="#fff" strokeWidth={4} paintOrder="stroke"
            fontFamily="'Baloo 2', 'Chalkboard SE', system-ui, sans-serif">?</text>
        </ThoughtBubble>
      </Tap>
    </Scene>
  )
}

// 5. "The shepherd made sure his ninety-nine sheep were safe together. Then off he went, to look for his little lost
// lamb." Twilight, and the moon is up. The sheep are settling down in the fold, with the gate shut. The shepherd walks
// away up the path toward the dark hills, his lantern glowing.
const FOLD5 = { cx: 236, cy: 368, rx: 206, ry: 46, h: 38, gate: [344, 398] as [number, number] }
const PATH5 = 'M372 452 Q396 418 470 400 Q560 380 560 340 Q560 306 640 290 Q700 280 720 262 L740 264 Q720 288 664 300 Q590 314 594 344 Q598 392 500 414 Q440 428 430 452 Z'

function Page5() {
  const f = FOLD5
  return (
    <Scene sky="dusk" ground="none" clouds={false} stars>
      <Tap say="Good night, sheep!" sfx="sparkle"><Moon x={640} y={84} s={0.85} /></Tap>
      <Hills time="dusk" />
      <path d={PATH5} fill="#c9b48a" opacity={0.85} />
      <Tap say="Baa! We are safe and cozy." sfx="wobble">
        <StoneFold {...f} w={3} closed grass="#86b07c" inside={<FoldFlock cx={f.cx} cy={f.cy - 4} rx={f.rx} ry={f.ry} s={0.6} seed={5} sleepy />} />
      </Tap>
      <Tap say="Don't worry, little lamb. I'm coming to find you!" sfx="whoosh">
        <ShepherdFromBehind x={570} y={368} s={0.8} lantern />
      </Tap>
      <Tufts spots={[[60, 440], [300, 446], [700, 430], [760, 446]]} color="#4f7f5a" />
    </Scene>
  )
}

// ---------- Part two ----------

// 6. 'Remember the little lost lamb? The shepherd looked for it over the hills, behind the rocks, and through the
// bushes. "Little lamb! Where are you?" he called.' By moonlight, among the rocks and bushes on the hill, he holds up
// his lantern and calls. A bunny peeks out from behind a rock, and an owl watches from a tree: no lamb here yet.
function Page6() {
  return (
    <Scene sky="night" ground="none">
      <Moon x={668} y={80} s={0.9} />
      <Hills time="night" />
      <Boulder x={612} y={336} w={74} h={40} night flip />
      <ShadeTree x={730} y={330} s={0.95} leaf="#3f7458" trunk="#6a5040" />
      <Tap say="Hoo, hoo! Not up here!" sfx="pop">
        <g transform="translate(732 238)">
          <ellipse cx={0} cy={0} rx={13} ry={15} fill="#9a7a5a" stroke="#5a4a3a" strokeWidth={2} />
          <ellipse cx={0} cy={5} rx={8} ry={9} fill="#d9c4a0" />
          <path d="M-11 -12 L-7 -20 L-4 -12 Z M11 -12 L7 -20 L4 -12 Z" fill="#9a7a5a" stroke="#5a4a3a" strokeWidth={1.6} strokeLinejoin="round" />
          {[-5, 5].map((ex) => <g key={ex}><circle cx={ex} cy={-4} r={4.6} fill="#fff8d0" stroke="#5a4a3a" strokeWidth={1.2} /><circle cx={ex} cy={-4} r={2.2} fill="#2b2140" /></g>)}
          <path d="M-2 0 L2 0 L0 4 Z" fill="#e8a83a" />
        </g>
      </Tap>
      <Tap say="Not behind this rock! I'm a bunny." sfx="pop">
        <g transform="translate(130 330)">
          {[-9, 9].map((ex) => (
            <g key={ex} transform={`rotate(${ex} ${ex} 0)`}>
              <ellipse cx={ex} cy={-18} rx={6} ry={17} fill="#f2ecf4" stroke="#a89ab8" strokeWidth={2} />
              <ellipse cx={ex} cy={-17} rx={2.8} ry={11} fill="#ffc6d6" />
            </g>
          ))}
        </g>
        <Boulder x={140} y={402} w={190} h={92} night />
      </Tap>
      <Tap say="Rustle, rustle. Not in this bush!" sfx="pop">
        <Bramble x={580} y={436} s={1.05} night />
      </Tap>
      <Bramble x={470} y={318} s={0.6} night />
      <Tap say="Little lamb! Where are you?" sfx="whoosh">
        <ShepherdLooking x={340} y={432} s={1.12} calling blinkDelay={0.4} />
        <Calling x={300} y={322} s={1.1} dir={-1} />
      </Tap>
    </Scene>
  )
}

// 7. 'Then he heard a little voice: "Baa! Baa!" There was the little lamb, stuck in a bush! It was a little bit
// scared, but it was not hurt.' In the light of his lantern, the little lamb's head and front poke out of a tangly
// bush, twigs caught in its wool. The shepherd has laid down his staff to reach out to it, smiling.
function Page7() {
  return (
    <Scene sky="night" ground="none">
      <Moon x={110} y={80} s={0.8} />
      <Hills time="night" />
      <Glow x={480} y={330} r={210} color="#ffe9a8" />
      <Bramble x={560} y={436} s={1.75} night />
      <Tap say="Baa! Baa! I'm stuck!" sfx="wobble">
        <LambInBramble x={560} y={436} s={1.75} night />
      </Tap>
      <Tap say="Baa!" sfx="pop">
        <Calling x={436} y={318} s={1.1} dir={-1} />
      </Tap>
      <StaffOnGround x={196} y={440} s={0.95} />
      <Tap say="There you are, little lamb! Don't be scared. I'm here." sfx="good">
        <Figure x={290} y={430} s={1.14} look={SHEPHERD} pose="open" blinkDelay={0.6}
          item={<Lantern x={50} y={-64} s={0.95} />} />
      </Tap>
    </Scene>
  )
}

// 8. "The shepherd gently lifted the lamb out of the bush and put it on his shoulders. He was so happy! Then he
// carried it all the way home." Sunrise. He walks home along the path with the little lamb across his shoulders, both
// of them happy. Behind him is the bush; far ahead, his village and the fold.
const PATH8 = 'M0 452 Q160 430 300 440 Q470 452 560 410 Q620 380 690 362 Q730 352 760 340 L768 344 Q740 360 700 372 Q640 392 600 420 Q520 470 300 456 Q160 448 0 470 Z'

function Page8() {
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      <Glow x={700} y={236} r={200} color="#fff3c0" />
      <Tap say="The sun is coming up. Good morning!" sfx="sparkle"><g><Sun x={700} y={244} s={1.05} /></g></Tap>
      <Hills time="dawn" mid="M0 316 Q200 290 420 310 Q620 300 800 318 L800 450 L0 450 Z">
        {[[664, 306, 30], [704, 302, 36], [748, 306, 28]].map(([hx, hy, w]) => <FarHouse key={hx} x={hx} y={hy} w={w} lit />)}
        <StoneFold cx={590} cy={308} rx={40} ry={9} h={9} gate={[600, 612]} w={1.2} grass="#9cc888" shadow={false}
          inside={<FarSheep spots={scatter([[302, 560, 620, 4, 0.42], [308, 556, 616, 4, 0.46]], 4)} />} />
      </Hills>
      <Birds spots={[[300, 92, 1], [330, 76, 0.8], [520, 116, 0.9]]} />
      <path d={PATH8} fill="#e6cf9e" opacity={0.85} />
      <Bramble x={110} y={380} s={0.78} />
      <Tufts spots={[[40, 420], [250, 420], [560, 446], [760, 436], [690, 410]]} />
      <Tap say="Hooray! I found you! Let's go home." sfx="good">
        <ShepherdCarrying x={420} y={436} s={1.2} blinkDelay={0.3} wrapLamb={(lamb) => <Tap say="Baa! Thank you for finding me!" sfx="pop">{lamb}</Tap>} />
      </Tap>
      <Sparkles spots={[[330, 250, 7], [520, 230, 8], [560, 300, 6]]} />
    </Scene>
  )
}

// 9. 'He called his friends and neighbors: "Celebrate with me! I found my lost sheep!" And everyone was so happy.'
// Morning in the village: the shepherd, the little lamb still on his shoulders, calls out with joy; his friends and
// neighbors come to celebrate, cheering, one with her tambourine, and two children dance. The flock is safe in the fold.
const FOLD9 = { cx: 400, cy: 300, rx: 150, ry: 26, h: 26, gate: [470, 512] as [number, number] }

function Page9() {
  const N = NEIGHBORS
  const f = FOLD9
  return (
    <Scene sky="day" ground="none">
      <Hills time="day" far="M0 246 Q160 214 330 236 Q520 210 800 232 L800 450 L0 450 Z" mid="M0 300 Q200 278 400 290 Q600 276 800 296 L800 450 L0 450 Z">
        <MudHouse x={110} y={300} w={150} h={96} door={0.15} win={-0.25} />
        <MudHouse x={690} y={300} w={140} h={90} door={-0.2} />
      </Hills>
      <StoneFold {...f} w={2.4} grass="#8cc47a" inside={<FoldFlock cx={f.cx} cy={f.cy - 3} rx={f.rx} ry={f.ry} s={0.36} seed={9} />} />
      <Tap say="Hooray! Let's celebrate!" sfx="fanfare">
        <Figure x={240} y={426} s={0.96} look={N.tambourine} pose="arms-up" mood="joy" blinkDelay={0.5}>
          <Tambourine x={42} y={-130} />
        </Figure>
        <Figure x={566} y={424} s={0.98} look={N.friend} pose="arms-up" mood="joy" facing="left" blinkDelay={1.4} />
        <Figure x={660} y={414} s={0.92} look={N.neighbor} pose="open" mood="happy" facing="left" blinkDelay={2} />
        <Figure x={150} y={412} s={0.9} look={N.granny} pose="open" mood="joy" blinkDelay={0.9} />
      </Tap>
      <Tap say="We're so happy you found your lamb!" sfx="pop">
        <Figure x={92} y={442} s={1} look={N.kid1} pose="arms-up" mood="joy" blinkDelay={1.1} />
        <Figure x={732} y={444} s={1} look={N.kid2} pose="arms-up" mood="joy" facing="left" blinkDelay={0.2} />
      </Tap>
      <Tap say="Celebrate with me! I found my lost sheep!" sfx="good">
        <ShepherdCarrying x={404} y={436} s={1.12} blinkDelay={0.8} wrapLamb={(lamb) => <Tap say="Baa! I'm home!" sfx="pop">{lamb}</Tap>} />
      </Tap>
      <MusicNote x={300} y={150} color="#ffe680" />
      <MusicNote x={510} y={128} s={1.15} color="#ffd6ee" double />
      <Heart x={404} y={118} s={0.8} />
      <Sparkles spots={[[250, 200, 7], [560, 196, 7], [330, 100, 6], [470, 90, 6]]} />
    </Scene>
  )
}

// 10. "Jesus said God is like that shepherd. God loves every one of us so much, and He always comes looking for us.
// When one of us comes home to God, heaven is full of joy!" Back on the hillside: Jesus, standing now, opens His
// arms to everyone; the story He told is in a bubble above (the shepherd carrying his lamb home). God's light shines
// down from heaven, with sparkles and hearts of joy.
function Page10() {
  const L = LISTENERS
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Rays x={620} y={-60} r={560} n={16} color="#fff3b0" opacity={0.42} />
      <Glow x={620} y={0} r={240} color="#fff6c8" />
      <TellingHill />
      <Tap say="The shepherd found his little lamb, and carried it home!" sfx="sparkle">
        <Dream x={92} y={40} w={300} h={170} from={[590, 276]} to={[386, 196]} sky="#ffe3ec">
          <path d="M60 170 Q220 120 420 160 L420 260 L60 260 Z" fill="#a8cc8e" />
          <path d="M60 196 Q240 168 420 192 L420 260 L60 260 Z" fill="#86bf72" />
          <ShepherdCarrying x={246} y={206} s={0.82} />
        </Dream>
      </Tap>
      <Person x={160} y={372} s={0.84} look={L.mom} pose="hold" holding="baby" blinkDelay={0.6} />
      <Person x={252} y={366} s={0.84} look={L.grandpa} holding="stick" blinkDelay={1.8} />
      <Person x={344} y={364} s={0.84} look={L.rich} pose="pray" blinkDelay={1.1} />
      <Person x={436} y={368} s={0.84} look={L.fisher} blinkDelay={2.4} />
      <Person x={744} y={374} s={0.84} look={L.grandma} facing="left" pose="pray" blinkDelay={0.3} />
      <Tap say="God loves every one of us so much!" sfx="sparkle">
        <Figure x={612} y={424} s={1.05} look={PEOPLE.jesus} pose="open" />
      </Tap>
      <Tap say="God loves me!" sfx="pop">
        <SitKid x={214} y={438} s={1.1} look={L.girl} blinkDelay={0.9} />
        <SitKid x={324} y={442} s={1.1} look={L.boy} blinkDelay={2.1} />
        <SitKid x={440} y={440} s={1.06} look={L.little} blinkDelay={1.4} />
      </Tap>
      <Tap say="Heaven is full of joy!" sfx="sparkle">
        <Heart x={470} y={262} s={0.55} />
        <Heart x={738} y={190} s={0.5} color="#ffcf3f" />
        <Heart x={700} y={110} s={0.45} />
      </Tap>
      <Sparkles spots={[[540, 80, 9], [690, 54, 7], [760, 120, 8], [470, 150, 6], [640, 160, 6]]} />
    </Scene>
  )
}

/** Part one is pages 1 to 5 (data/lost-sheep.ts LOST_SHEEP_STORY_1), part two pages 6 to 10. */
export const LOST_SHEEP_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10]

// (the mini-game, art/games/lost-sheep.tsx, draws its evening hillside with these too)
export { FarSheep, Heart, HILL_COLORS, Hills, scatter, Tufts }
