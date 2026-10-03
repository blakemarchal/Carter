// Five Loaves and Two Fish: one illustration per story page (see data/loaves.ts for the words). The
// story has two parts, and its pictures run on through both: part 1 is pages 1–6, part 2 is pages 7–11.
// God is never drawn as a person: His presence is light (Glow, Rays, Sparkles).
// The day goes by from page to page: a bright morning (1), midday (2), a golden late afternoon (3–8),
// dusk (9), evening at the boy's home (10), then the next morning by the lake (11).
// Props other stories could use are exported (Crutch, SickMat, BrokenBread, Home), and so are the people's
// looks; they can move to kit.tsx and people.tsx.
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import { ink } from '../kit'
import { Person, PEOPLE, type Look } from '../people'
import { Basket, Boat, Bread, Fish, Flower, Glow, Rays, Scene, Sheep, Sparkles, Sun, Tap, Tree } from './kit'

// ---------- Local props ----------

const SKINS = ['#d9a47a', '#c68b5e', '#f6d2b8', '#8d5a3b', '#e3b48c']
const ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
const HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24', '#e8e4dc']

/**
 * One small person in the crowd, front view, standing or sitting on the grass. `i` picks the colors.
 * Standing, both arms hang at the sides (with `wave`, the right one waves). Sitting, the hands rest in
 * the lap, hold the tummy (`hungry`), or hold up some food (`hold`).
 */
function Folk({ x, y, s = 1, i = 0, sit, hold, hungry, wave }: {
  x: number; y: number; s?: number; i?: number; sit?: boolean; hold?: 'bread' | 'fish'; hungry?: boolean; wave?: boolean
}) {
  const robe = ROBES[i % ROBES.length]
  const skin = SKINS[(i * 7 + 2) % SKINS.length]
  const kind = (i * 5) % 4 // 0, 3: head covering · 1: short hair · 2: long hair
  const hair = HAIRS[(i * 3) % HAIRS.length]
  const wrap = WRAPS[(i * 11) % WRAPS.length]
  const covered = kind === 0 || kind === 3
  const hy = sit ? -38 : -54
  const cap = `M-12 ${hy} Q-13 ${hy - 15} 0 ${hy - 15} Q13 ${hy - 15} 12 ${hy} Q6 ${hy - 8} 0 ${hy - 7} Q-6 ${hy - 8} -12 ${hy} Z`
  const back = `M-13 ${hy - 3} Q-16 ${hy + 15} -11 ${hy + 13} L11 ${hy + 13} Q16 ${hy + 15} 13 ${hy - 3} Z`
  // The left arm: from the shoulder to the hand (the right arm mirrors it, unless it's waving).
  const [sx, sy] = sit ? [-13, -21] : [-10.5, -39]
  const [hx, hy2] = sit ? (hold ? [-8, -16] : hungry ? [-6, -12] : [-8, -8]) : [-17.5, -19]
  const arm = (ax: number, ay: number, bx: number, by: number) => (
    <>
      <path d={`M${ax} ${ay} L${bx} ${by}`} stroke={ink(robe)} strokeWidth={6.5} strokeLinecap="round" />
      <path d={`M${ax} ${ay} L${bx} ${by}`} stroke={robe} strokeWidth={4.5} strokeLinecap="round" />
    </>
  )
  const hand = (cx: number, cy: number, r = 3.4) => <circle cx={cx} cy={cy} r={r} fill={skin} stroke={ink(skin)} strokeWidth={1.5} />
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {(covered || kind === 2) && <path d={back} fill={covered ? wrap : hair} stroke={ink(covered ? wrap : hair)} strokeWidth={2} />}
      {sit ? (
        <path d="M-22 0 Q-24 -22 -12 -26 Q0 -30 12 -26 Q24 -22 22 0 Q0 4 -22 0 Z" fill={robe} stroke={ink(robe)} strokeWidth={2.5} strokeLinejoin="round" />
      ) : (
        <>
          <ellipse cx={-7} cy={-2} rx={6} ry={3} fill="#7a5233" />
          <ellipse cx={7} cy={-2} rx={6} ry={3} fill="#7a5233" />
          <path d="M-12 -42 Q0 -46 12 -42 L17 -4 Q0 0 -17 -4 Z" fill={robe} stroke={ink(robe)} strokeWidth={2.5} strokeLinejoin="round" />
        </>
      )}
      {arm(sx, sy, hx, hy2)}
      {!wave && arm(-sx, sy, -hx, hy2)}
      {wave && (
        <g className="pa-wing" style={{ '--o': '0% 100%' } as CSSProperties}>
          {arm(9, hy + 18, 20, hy - 2)}
          {hand(20, hy - 3, 3.6)}
        </g>
      )}
      {hold === 'bread' && <ellipse cx={0} cy={hy + 20} rx={8} ry={5} fill="#e0a75e" stroke="#a8702c" strokeWidth={2} />}
      {hold === 'fish' && <Fish x={0} y={hy + 20} s={0.36} color="#ffa64d" />}
      {hand(hx, hy2)}
      {!wave && hand(-hx, hy2)}
      <circle cx={0} cy={hy} r={11} fill={skin} stroke={ink(skin)} strokeWidth={2} />
      <circle cx={-4} cy={hy} r={1.9} fill="#2b2140" />
      <circle cx={4} cy={hy} r={1.9} fill="#2b2140" />
      <ellipse cx={-7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <ellipse cx={7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      {hungry
        ? <ellipse cx={0} cy={hy + 6} rx={1.8} ry={2.3} fill="#6b2a3a" />
        : <path d={`M-3 ${hy + 5} Q0 ${hy + 8.5} 3 ${hy + 5}`} stroke="#6b2a3a" strokeWidth={1.6} fill="none" strokeLinecap="round" />}
      <path d={cap} fill={covered ? wrap : hair} stroke={ink(covered ? wrap : hair)} strokeWidth={2} />
    </g>
  )
}

type Row = [y: number, x0: number, x1: number, n: number, s: number]

/**
 * Rows of Folk, back row first. Spacing wobbles a little so it looks like a real crowd. `skip`: x ranges
 * left empty, so nobody's head peeks out right beside a main character's head.
 */
function Crowd({ rows, sit, hold, hungry, seed = 0, skip = [] }: {
  rows: Row[]; sit?: boolean; hold?: boolean; hungry?: boolean; seed?: number; skip?: [number, number][]
}) {
  let k = seed
  return (
    <g>
      {rows.map(([y, x0, x1, n, s], r) => Array.from({ length: n }, (_, j) => {
        const i = k++
        const step = n > 1 ? (x1 - x0) / (n - 1) : 0
        const x = x0 + j * step + Math.sin(i * 12.9898) * step * 0.2
        if (skip.some(([a, b]) => x > a && x < b)) return null
        const jy = Math.cos(i * 4.1) * 3 * s
        return (
          <Folk key={`${r}-${j}`} x={x} y={y + jy} s={s} i={i} sit={sit} hungry={hungry}
            hold={hold ? (i % 3 === 2 ? 'fish' : 'bread') : undefined} wave={!sit && !hold && i % 5 === 1} />
        )
      }))}
    </g>
  )
}

/** Rolling grassy hills; `warm` tints them for the late afternoon. `lake`: the big lake behind. */
function Hills({ warm, lake }: { warm?: boolean; lake?: boolean }) {
  const [far, back, front] = warm ? ['#9cc29a', '#8fbf7e', '#74b064'] : ['#b8e0b0', '#a8d8a0', '#7cc46a']
  return (
    <g>
      {/* (no white wave marks: they sat right over the heads of the people standing in front) */}
      {lake && <rect x={0} y={258} width={800} height={50} fill={warm ? '#8fb0d8' : '#7cc6f0'} />}
      <path d="M380 290 Q560 230 800 262 L800 330 L380 330 Z" fill={far} />
      <path d="M0 300 Q180 266 400 292 Q600 268 800 290 L800 450 L0 450 Z" fill={back} />
      <path d="M0 372 Q240 338 460 368 T800 356 L800 450 L0 450 Z" fill={front} />
    </g>
  )
}

/**
 * The boy's lunch: a little basket with five loaves heaped up and two whole fish laid along the front,
 * tails together, so all seven are easy to count. The rim is at y ≈ -14.5.
 */
function Lunch({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Bread x={-17} y={-40} s={0.68} />
      <Bread x={17} y={-40} s={0.68} />
      <Bread x={-34} y={-24} s={0.68} />
      <Bread x={0} y={-26} s={0.68} />
      <Bread x={34} y={-24} s={0.68} />
      <path d="M-54 -14 L54 -14 L43 26 L-43 26 Z" fill="#c98448" stroke="#8a5428" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-50 -1 L50 -1 M-46 12 L46 12" stroke="#8a5428" strokeWidth={2.5} />
      <rect x={-58} y={-19} width={116} height={9} rx={4.5} fill="#b5723c" stroke="#8a5428" strokeWidth={2.5} />
      <Fish x={-27} y={-9} s={0.7} color="#5fb7ff" facing="left" />
      <Fish x={27} y={-9} s={0.7} />
    </g>
  )
}

/** A hand drawn over something held (a basket rim, a loaf), so it shows gripping it. Figure units, inside a <Person>. */
const Hand = ({ x, y, skin }: { x: number; y: number; skin: string }) => (
  <circle cx={x} cy={y} r={7} fill={skin} stroke={ink(skin)} strokeWidth={2} />
)

/** A drawn heart that bobs gently: love, sharing, being thankful. */
function Heart({ x, y, s = 1, color = '#ffcf3f' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 16 C-24 2 -26 -14 -14 -19 C-7 -22 -2 -17 0 -11 C2 -17 7 -22 14 -19 C26 -14 24 2 0 16 Z" fill={color} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={-10} cy={-10} rx={4} ry={2.4} fill="#fff" opacity={0.65} transform="rotate(-35 -10 -10)" />
      </g>
    </g>
  )
}

/** A fluffy thought bubble whose little puffs trail down toward (tx, ty). */
function Thought({ x, y, tx, ty, children }: { x: number; y: number; tx: number; ty: number; children?: ReactNode }) {
  const p = (t: number) => [tx + (x - tx) * t, ty + (y - ty) * t]
  return (
    <g className="sc-float">
      {[[0.12, 6], [0.3, 9]].map(([t, r]) => <circle key={t} cx={p(t)[0]} cy={p(t)[1]} r={r} fill="#fff" stroke="#d9cfe8" strokeWidth={2.5} />)}
      <g fill="#fff" stroke="#d9cfe8" strokeWidth={3}>
        {[[-40, 6, 30], [-14, -18, 34], [22, -16, 32], [44, 8, 28], [0, 20, 32]].map(([cx, cy, r], i) => <circle key={i} cx={x + cx} cy={y + cy} r={r} />)}
      </g>
      <g fill="#fff">
        {[[-40, 6, 27], [-14, -18, 31], [22, -16, 29], [44, 8, 25], [0, 20, 29], [0, 0, 36]].map(([cx, cy, r], i) => <circle key={i} cx={x + cx} cy={y + cy} r={r} />)}
      </g>
      {children}
    </g>
  )
}

/** "Grumble, grumble": a little wiggle by a hungry tummy. */
const Rumble = ({ x, y, flip }: { x: number; y: number; flip?: boolean }) => (
  // The pulse goes on an inner group: a CSS animation on the positioned group would replace its position.
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <g className="pa-twinkle" stroke="#e07a5f" strokeWidth={2.6} fill="none" strokeLinecap="round">
      <path d="M0 -6 q4 -5 8 0 t8 0" />
      <path d="M2 4 q4 -5 8 0 t8 0" />
    </g>
  </g>
)

/**
 * A wooden crutch, held up high by its foot: the hand at (0, 0) grips the single leg, and the two rails
 * spread up to the padded top, with the hand-grip between them. Figure units, inside a <Person>.
 */
export const Crutch = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 16 L0 -34 M0 -34 L-9 -94 M0 -34 L9 -94" stroke="#6b4422" strokeWidth={7.5} fill="none" />
    <path d="M0 16 L0 -34 M0 -34 L-9 -94 M0 -34 L9 -94" stroke="#b5794a" strokeWidth={4.5} fill="none" />
    <path d="M-5.5 -62 L5.5 -62" stroke="#6b4422" strokeWidth={5} />
    <rect x={-15} y={-102} width={30} height={10} rx={5} fill="#8a5a2e" stroke="#5a3a20" strokeWidth={2} />
    <rect x={-4} y={14} width={8} height={7} rx={2.5} fill="#5a4a44" />
  </g>
)

/**
 * A sleeping mat on the grass, with its pillow, and the blanket pushed down to the far end: whoever was
 * lying on it has just got up. (x, y): the middle of the mat, where someone standing on it puts their feet.
 */
export function SickMat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-66 -9 Q-67 -15 -59 -15 L59 -15 Q67 -15 66 -9 L62 6 Q60 11 53 11 L-53 11 Q-60 11 -62 6 Z" fill="#dcbf86" stroke="#a8803e" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-58 -6 L58 -6 M-60 3 L60 3" stroke="#c49a52" strokeWidth={2} />
      <path d="M-66 -9 l-6 3 M-64 0 l-7 2 M-62 7 l-6 3 M66 -9 l6 3 M64 0 l7 2 M62 7 l6 3" stroke="#a8803e" strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={-47} cy={-12} rx={15} ry={7.5} fill="#fffaf2" stroke="#d8cfc2" strokeWidth={2} />
      <path d="M24 -10 Q30 -22 44 -19 Q60 -16 60 -6 Q60 4 46 4 Q30 5 24 -2 Q20 -6 24 -10 Z" fill="#8fc0e8" stroke="#5f8fc0" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M32 -12 Q42 -8 52 -12 M30 -3 Q42 0 54 -4" stroke="#5f8fc0" strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * A round loaf broken in two: the halves open like a book, touching at the bottom and apart at the top,
 * the soft white inside showing along each break. (x, y): the bottom of the break.
 */
export function BrokenBread({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  // The right half, its break along x = 0 from (0, -26) down to (0, 0); the left half is its mirror.
  const half = (side: 1 | -1) => (
    <g transform={`scale(${side} 1) rotate(20 0 0)`}>
      <path d="M0 -26 Q22 -28 23 -13 Q22 1 0 0 Z" fill="#e0a75e" stroke="#a8702c" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M0 -26 L6 -21 L3 -16 L7.5 -11 L3 -6 L6 -2.5 L0 0 Z" fill="#f8e2b8" stroke="#a8702c" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M9 -19 q3.5 -4 7 0" stroke="#a8702c" strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {half(-1)}
      {half(1)}
    </g>
  )
}

/**
 * The boy's home in the village: a mud-brick house with a flat roof (the beam ends poke out under it),
 * steps up the side to the roof, and the lamp lit inside, so the open door and the window glow warm.
 * (x, y): the middle of its front wall at the ground.
 */
export function Home({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* steps up the right side to the roof */}
      <path d="M96 0 L96 -150 L112 -150 L112 -126 L126 -126 L126 -96 L140 -96 L140 -66 L154 -66 L154 -36 L168 -36 L168 0 Z" fill="#d9bd88" stroke="#a8875a" strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={-110} y={-160} width={210} height={160} fill="#ecd3a0" stroke="#a8875a" strokeWidth={3} />
      <path d="M-100 -118 L-80 -118 M-60 -40 L-38 -40 M40 -96 L64 -96 M-30 -132 L-10 -132 M70 -30 L90 -30" stroke="#d7b980" strokeWidth={3} strokeLinecap="round" />
      <rect x={-116} y={-170} width={222} height={14} rx={3} fill="#c9a86e" stroke="#a8875a" strokeWidth={2.5} />
      {[-98, -70, -42, -14, 14, 42, 70].map((bx) => <circle key={bx} cx={bx} cy={-150} r={4.5} fill="#8a5a2e" stroke="#5a3a20" strokeWidth={1.5} />)}
      {/* the window and the open door, lit from inside */}
      <rect x={34} y={-122} width={40} height={30} rx={6} fill="#ffd76a" stroke="#8a5a2e" strokeWidth={3} />
      <path d="M54 -122 L54 -92" stroke="#8a5a2e" strokeWidth={2.5} />
      <path d="M-50 0 L-50 -66 Q-50 -92 -22 -92 Q6 -92 6 -66 L6 0 Z" fill="#ffd76a" stroke="#8a5a2e" strokeWidth={3} />
      <path d="M-46 -2 L-46 -64 Q-46 -84 -30 -88 L-30 -2 Z" fill="#a0703f" stroke="#6b4422" strokeWidth={2} />
    </g>
  )
}

/** A far-off village house on the hill, its window lit. (x, y): the middle of its bottom edge. */
const FarHouse = ({ x, y, w = 34 }: { x: number; y: number; w?: number }) => (
  <g>
    <rect x={x - w / 2} y={y - w * 0.72} width={w} height={w * 0.72} fill="#d9bd94" stroke="#a8875a" strokeWidth={2} />
    <rect x={x - w / 2 - 2} y={y - w * 0.72 - 4} width={w + 4} height={5} rx={1.5} fill="#bf9e6e" />
    <rect x={x + w * 0.12} y={y - w * 0.5} width={w * 0.22} height={w * 0.22} rx={1.5} fill="#ffd76a" />
  </g>
)

/** Little puffs of dust kicked up behind someone running (to the right), at their heels. */
const Dust = ({ x, y }: { x: number; y: number }) => (
  <g className="pa-twinkle" fill="#efe0c0" opacity={0.85}>
    <circle cx={x} cy={y} r={9} /><circle cx={x - 16} cy={y - 6} r={7} /><circle cx={x - 29} cy={y + 1} r={5} />
  </g>
)

// ---------- The people ----------
// (Exported so other parts of the island can draw the same people; they can move to people.tsx later.)

/** Andrew, the disciple who found the boy (John 6:8–9): a blue robe and a gold sash. */
export const ANDREW: Look = { ...PEOPLE.disciple, robe: '#6f9fc0', sash: '#e0b45a', hairColor: '#7a4a24', beardColor: '#7a4a24' }
/** A girl in the crowd: pink, with pigtails. She eats with her mother on page 8, and shares the bread in the game. */
export const GIRL: Look = { ...PEOPLE.boy, hair: 'pigtails', hairColor: '#4a3020', robe: '#ff9fb8', sash: '#ffffff', skin: '#d9a47a' }
/** A mother in the crowd (page 8): a teal robe and a plum head covering. */
export const MOTHER: Look = { ...PEOPLE.mary, wrap: '#a8507a', robe: '#6fb7b0', sash: '#f5f0e6' }
/** A man who couldn't walk, until Jesus made him well (page 2). */
export const WALKER: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#5a3a24', beard: 'short', beardColor: '#5a3a24', robe: '#9a8fd0', sash: '#f0d38a' }
/** A little girl who was sick in bed, until Jesus made her well, and her mother (page 2). */
export const WELL_GIRL: Look = { skin: '#e3b48c', hair: 'long', hairColor: '#5a3a24', robe: '#8fd18a', sash: '#ffffff', bow: '#ff8cc0', build: 'child' }
export const WELL_GIRLS_MOM: Look = { skin: '#e3b48c', hair: 'covered', hairColor: '#5a3a24', wrap: '#6cae6a', robe: '#c9784a', sash: '#f5f0e6' }
/** The boy's mom and dad, at home (page 10) and listening to Jesus the next day (page 11). */
export const BOYS_MOM: Look = { skin: PEOPLE.boy.skin, hair: 'covered', hairColor: '#3b2a20', wrap: '#a98cff', robe: '#e07a5f', sash: '#f5f0e6' }
export const BOYS_DAD: Look = { skin: PEOPLE.boy.skin, hair: 'short', hairColor: '#3b2a20', beard: 'short', beardColor: '#3b2a20', robe: '#5f8f6a', sash: '#e6b85a' }
/** People in the crowd who get their bread in the island's game (art/games/loaves.tsx), with GIRL and the boy. */
export const BABY_MOM: Look = { skin: '#d9a47a', hair: 'covered', hairColor: '#4a3020', wrap: '#e8875a', robe: '#8fb0d8', sash: '#f5f0e6' }
export const GRANDPA: Look = { skin: '#e3b48c', hair: 'covered', hairColor: '#e8e4dc', wrap: '#f5f0e6', beard: 'long', beardColor: '#f2efe8', robe: '#b07a9a', sash: '#e8dcc0' }
export const DAD: Look = { skin: '#8d5a3b', hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#d98b4a', sash: '#5f8fc0' }
const BOY_SKIN = PEOPLE.boy.skin

// ---------- Pages ----------

// 1. "One day, a great big crowd came to see Jesus on a grassy hill. There were thousands and thousands of people!"
// Jesus stands near us on His hill, about as tall as the nearest people; the crowd goes back and back.
const PageCrowd = () => (
  <Scene sky="day" ground="none" sun>
    <Hills lake />
    <path d="M430 450 Q470 352 610 338 Q720 330 800 342 L800 450 Z" fill="#9fd696" />
    <Glow x={640} y={300} r={130} color="#fff6c8" />
    <Tap say="We came to see Jesus!" sfx="good">
      <Crowd rows={[[296, 60, 380, 14, 0.3], [313, 50, 420, 12, 0.42], [338, 40, 440, 10, 0.6], [372, 40, 430, 8, 0.86], [424, 60, 400, 5, 1.25]]} />
    </Tap>
    <Tap say="Welcome, everyone! God loves you." sfx="sparkle">
      <Person x={640} y={420} s={0.92} look={PEOPLE.jesus} pose="wave" facing="left" />
    </Tap>
    <Tap sfx="pop">
      <Flower x={725} y={432} color="#ffd34d" />
      <Flower x={560} y={440} color="#ff8cc0" />
    </Tap>
  </Scene>
)

// 2. "Jesus told everyone how much God loves them. He made sick people well, too! All day long, He took care of them."
// Midday: the sun is high. The people sit and listen while Jesus reaches out to a little girl who has
// just got up from the mat she was carried on (people brought the sick to Him on mats: Mark 6:55); her
// mother thanks God. A man who needed a crutch holds it up high: he can walk now!
const PageTeach = () => (
  <Scene sky="day" ground="none">
    <Sun x={400} y={66} s={0.8} />
    <Hills lake />
    <path d="M430 450 Q470 352 610 338 Q720 330 800 342 L800 450 Z" fill="#9fd696" />
    <Glow x={640} y={300} r={130} color="#fff6c8" />
    <Tap say="We love to hear Jesus talk about God!" sfx="good">
      <Crowd sit seed={140} rows={[[306, 40, 420, 13, 0.32], [326, 30, 450, 11, 0.42], [354, 30, 330, 6, 0.55]]} skip={[[140, 214], [266, 336]]} />
    </Tap>
    <Tap say="God loves you so much!" sfx="sparkle">
      <Person x={660} y={420} s={1} look={PEOPLE.jesus} pose="point" facing="left" />
    </Tap>
    <Tap say="Look! I can walk!" sfx="fanfare">
      <Person x={176} y={436} s={1.02} look={WALKER} pose="arms-up" blinkDelay={0.7}>
        <g transform="translate(42 -126) rotate(12)"><Crutch /></g>
        <Hand x={42} y={-130} skin={WALKER.skin} />
      </Person>
    </Tap>
    <SickMat x={408} y={433} s={0.9} />
    <Person x={300} y={430} s={0.98} look={WELL_GIRLS_MOM} pose="pray" facing="right" blinkDelay={1.6} />
    <Tap say="I feel all better! Thank you, Jesus!" sfx="good">
      <Person x={524} y={432} s={1.12} look={WELL_GIRL} pose="arms-up" blinkDelay={0.3} />
    </Tap>
    <Heart x={300} y={250} s={0.6} />
    <Heart x={540} y={226} s={0.75} />
    <g pointerEvents="none"><Sparkles spots={[[476, 296, 7], [584, 300, 6], [404, 398, 5], [118, 250, 7], [250, 262, 5]]} /></g>
  </Scene>
)

// 3. "It got late, and everyone was hungry. Grumble, grumble went their tummies! But where could they find food for so many people?"
// The sun is going down. Andrew wonders where food could come from (Jesus already knew what He would do: John 6:6).
const PageHungry = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <Tap say="The sun is going down." sfx="ding"><g><Sun x={150} y={290} s={1.2} /></g></Tap>
    <Hills warm />
    <Crowd sit hungry seed={3} rows={[[318, 70, 420, 10, 0.4], [350, 60, 440, 9, 0.55], [392, 70, 430, 6, 0.75]]} />
    <Rumble x={158} y={384} />
    <Rumble x={300} y={382} />
    <Rumble x={200} y={340} flip />
    <Tap say="Grumble, grumble! I am so hungry." sfx="wobble">
      <Folk x={120} y={432} s={1} i={6} sit hungry />
      <Rumble x={146} y={424} />
    </Tap>
    <Folk x={250} y={436} s={1} i={9} sit hungry />
    <Rumble x={276} y={428} />
    <Tap say="My tummy is rumbling!" sfx="wobble">
      <Folk x={380} y={432} s={1} i={2} sit hungry />
      <Rumble x={354} y={424} flip />
    </Tap>
    <Person x={540} y={405} s={1.05} look={PEOPLE.jesus} facing="left" />
    <Tap say="Where can we find food for so many people?" sfx="pop">
      <Person x={640} y={410} s={1} look={ANDREW} pose="point" facing="left" blinkDelay={1.2} />
    </Tap>
    <Thought x={680} y={120} tx={645} ty={262}>
      <path d="M652 112 Q680 150 708 112 Z" fill="#e8e0f0" stroke="#a89cc0" strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={680} cy={112} rx={30} ry={7} fill="#f5f0fa" stroke="#a89cc0" strokeWidth={3} />
      <text x={720} y={110} fontSize={44} fontWeight={900} fill="#9a7ad0" textAnchor="middle" dominantBaseline="middle">?</text>
    </Thought>
    <rect width={800} height={450} fill="#ff9a6a" opacity={0.08} pointerEvents="none" />
  </Scene>
)

// 4. "Then a boy came with his lunch. He had five little loaves of bread and two little fish."
// The boy is near us, so he's big; Andrew stands back on the hill, pointing him out (John 6:8-9).
const PageBoy = () => (
  <Scene sky="dawn" ground="none">
    <Hills warm />
    <Crowd sit seed={20} rows={[[304, 470, 760, 8, 0.3], [322, 500, 770, 7, 0.38]]} />
    <Tree x={110} y={374} s={0.9} />
    <Flower x={60} y={432} color="#ff8cc0" />
    <Flower x={205} y={440} color="#ffd34d" />
    <Flower x={705} y={424} color="#ffffff" />
    <Tap say="Look! This boy has five loaves and two fish." sfx="pop">
      <Person x={560} y={352} s={0.8} look={ANDREW} pose="point" facing="left" blinkDelay={0.8} />
    </Tap>
    <Tap say="Here is my lunch. Five little loaves, and two little fish!" sfx="good">
      <Person x={330} y={436} s={1.7} look={PEOPLE.boy}>
        <Lunch x={0} y={-35} s={0.75} />
        <Hand x={-40} y={-46} skin={BOY_SKIN} />
        <Hand x={40} y={-46} skin={BOY_SKIN} />
      </Person>
    </Tap>
    <g pointerEvents="none"><Sparkles spots={[[225, 255, 9], [440, 240, 11], [450, 330, 6], [215, 335, 6]]} /></g>
  </Scene>
)

// 5. "The boy shared his lunch with Jesus. It was only a little bit of food. But Jesus knew just what to do!"
// The boy holds his basket up on his hand; Jesus reaches out to take it.
const PageShare = () => (
  <Scene sky="dawn" ground="none">
    <Hills warm />
    <Crowd sit seed={40} rows={[[306, 40, 340, 9, 0.32], [320, 560, 770, 6, 0.34]]} skip={[[250, 400], [588, 652]]} />
    <Tap say="It is only a little bit of food." sfx="pop">
      <Person x={620} y={398} s={0.95} look={PEOPLE.disciple} facing="left" blinkDelay={2.1} />
    </Tap>
    <Tap say="You can have my lunch, Jesus!" sfx="good">
      <Person x={300} y={420} s={1.15} look={PEOPLE.boy} pose="point">
        <Lunch x={62} y={-111} s={0.55} />
      </Person>
    </Tap>
    <Tap say="Have the people sit down." sfx="sparkle">
      <Person x={442} y={405} s={1.15} look={PEOPLE.jesus} pose="point" facing="left" />
    </Tap>
    <Tap sfx="ding"><Heart x={372} y={250} /></Tap>
    <g pointerEvents="none"><Sparkles spots={[[325, 262, 6], [420, 230, 7], [478, 312, 5]]} /></g>
  </Scene>
)

// 6. "Jesus held up the bread and fish and thanked God for the food. Then He passed it out to everyone."
// Light from above (God is never drawn as a person). A loaf in one hand, the two fish in the other;
// the boy who shared says thank you too, and the bread is already going round.
const PageThanks = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <Rays x={400} y={-30} r={640} n={16} color="#fff6c0" opacity={0.4} />
    <Glow x={400} y={60} r={190} />
    <Hills warm />
    <Crowd sit seed={60} rows={[[306, 60, 740, 18, 0.3], [326, 70, 250, 4, 0.4], [326, 560, 740, 4, 0.4]]} skip={[[176, 224], [576, 624]]} />
    <Folk x={110} y={378} s={0.62} i={3} sit hold="bread" />
    <Folk x={690} y={380} s={0.62} i={8} sit hold="fish" />
    <Tap say="Here is some bread for you!" sfx="pop">
      <Person x={200} y={392} s={0.92} look={PEOPLE.disciple} pose="hold" holding="basket" facing="left" blinkDelay={1.5} />
    </Tap>
    <Person x={600} y={392} s={0.92} look={ANDREW} pose="hold" holding="basket" blinkDelay={0.6} />
    <Tap say="Thank you, God, for this food!" sfx="sparkle">
      <Person x={400} y={415} s={1.3} look={PEOPLE.jesus} pose="arms-up">
        <Bread x={44} y={-142} s={0.62} />
        {/* the two fish, one on top of the other, held up in His hand */}
        <Fish x={-48} y={-151} s={0.55} facing="left" />
        <Fish x={-48} y={-136} s={0.55} color="#5fb7ff" facing="left" />
        <Hand x={-42} y={-131} skin={PEOPLE.jesus.skin} />
      </Person>
    </Tap>
    <Tap say="Thank you, God!" sfx="ding">
      <Person x={292} y={434} s={1} look={PEOPLE.boy} pose="pray" blinkDelay={0.4} />
    </Tap>
    <g pointerEvents="none"><Sparkles spots={[[300, 120, 10], [500, 110, 12], [400, 70, 8], [250, 200, 6], [560, 200, 7]]} /></g>
  </Scene>
)

// ----- Part 2 -----

// 7. "Remember the boy's little lunch? Jesus broke the bread, and His friends passed it out. More, and more, and more! The food never ran out."
// Jesus breaks a loaf in two; His friends carry baskets round to the people sitting on the grass
// (John 6:11), and the baskets by Jesus are still full. The boy who shared watches, amazed.
const PagePassOut = () => (
  <Scene sky="dawn" ground="none">
    <Hills warm />
    <Crowd sit hold seed={160} rows={[[306, 40, 760, 18, 0.3], [328, 40, 760, 13, 0.4]]} skip={[[160, 222], [330, 470], [580, 642]]} />
    <Folk x={104} y={432} s={0.95} i={4} sit hold="bread" />
    <Tap say="Bread for you, and you, and you!" sfx="pop">
      <Person x={180} y={420} s={1} look={PEOPLE.disciple} pose="point" holding="basket" facing="left" blinkDelay={1.4}>
        <Hand x={50} y={-86} skin={PEOPLE.disciple.skin} />
      </Person>
    </Tap>
    <Tap say="Wow! My little lunch is feeding everybody!" sfx="good">
      <Person x={290} y={434} s={1.05} look={PEOPLE.boy} pose="arms-up" blinkDelay={0.5} />
    </Tap>
    <Tap say="Here is more! There is plenty for everyone." sfx="sparkle">
      <Person x={400} y={416} s={1.2} look={PEOPLE.jesus} pose="hold">
        <BrokenBread x={0} y={-52} s={1} />
        <Hand x={-15} y={-56} skin={PEOPLE.jesus.skin} />
        <Hand x={15} y={-56} skin={PEOPLE.jesus.skin} />
      </Person>
    </Tap>
    <Tap say="More, and more, and more!" sfx="plop">
      <g>
        <Basket x={506} y={408} s={0.95} fill="bread" />
        <Basket x={474} y={428} s={0.8} fill="fish" />
      </g>
    </Tap>
    <Person x={616} y={418} s={1} look={ANDREW} pose="point" holding="basket" blinkDelay={0.9}>
      <Hand x={50} y={-86} skin={ANDREW.skin} />
    </Person>
    <Folk x={698} y={432} s={0.95} i={7} sit hold="fish" />
    <g pointerEvents="none"><Sparkles spots={[[452, 372, 8], [540, 372, 6], [330, 240, 9], [470, 236, 7]]} /></g>
  </Scene>
)

// 8. "Everyone ate and ate, until their tummies were full! There was plenty for everybody."
const PageAte = () => (
  <Scene sky="dawn" ground="none">
    <Hills warm />
    <Flower x={90} y={424} color="#ff8cc0" />
    <Flower x={745} y={432} color="#ffd34d" />
    <Crowd sit hold seed={80} rows={[[316, 60, 740, 14, 0.36], [346, 70, 730, 11, 0.5]]} skip={[[186, 244], [545, 605], [636, 694]]} />
    <Tap say="Yum! This fish is so good!" sfx="chomp">
      <Person x={215} y={420} s={1.05} look={PEOPLE.boy} pose="hold">
        <Fish x={0} y={-64} s={0.7} color="#5fb7ff" />
        <Hand x={-12} y={-56} skin={BOY_SKIN} />
        <Hand x={12} y={-56} skin={BOY_SKIN} />
      </Person>
    </Tap>
    <Tap say="Look at all the food! There is plenty for everybody." sfx="plop">
      <g>
        <Basket x={308} y={414} s={0.95} fill="fish" />
        <Basket x={402} y={408} s={1.2} fill="bread" />
      </g>
    </Tap>
    <Tap say="My tummy is full!" sfx="chomp">
      <Person x={575} y={422} s={1} look={GIRL} pose="hold" blinkDelay={0.9}>
        <Bread x={0} y={-64} s={0.62} />
        <Hand x={-13} y={-56} skin={GIRL.skin} />
        <Hand x={13} y={-56} skin={GIRL.skin} />
      </Person>
    </Tap>
    <Person x={665} y={410} s={1.05} look={MOTHER} pose="hold" facing="left" blinkDelay={1.7}>
      <Bread x={0} y={-64} s={0.62} />
      <Hand x={-13} y={-56} skin={MOTHER.skin} />
      <Hand x={13} y={-56} skin={MOTHER.skin} />
    </Person>
    <Heart x={262} y={282} s={0.7} />
    <Heart x={618} y={288} s={0.7} />
  </Scene>
)

// 9. "There were even twelve baskets of leftovers! Jesus took one little lunch and made more than enough. …"
const PageBaskets = () => (
  <Scene sky="dusk" ground="none" stars clouds={false}>
    <Hills warm />
    <Crowd sit seed={100} rows={[[312, 300, 740, 12, 0.3]]} skip={[[280, 320]]} />
    <Tap say="Gather up the leftovers, so nothing is lost." sfx="sparkle">
      <Person x={165} y={408} s={1.15} look={PEOPLE.jesus} pose="arms-up" />
    </Tap>
    <Tap say="Twelve baskets! From my one little lunch!" sfx="fanfare">
      <Person x={252} y={420} s={1.25} look={PEOPLE.boy} pose="arms-up" blinkDelay={1.1} />
    </Tap>
    {/* Tap each basket to count them, one to twelve. */}
    {[0, 1, 2, 3, 4, 5].map((i) => <Tap key={`b${i}`} count="baskets" sfx="plop"><Basket x={362 + i * 60} y={360} s={0.74} fill={i % 2 ? 'fish' : 'bread'} /></Tap>)}
    {[0, 1, 2, 3, 4, 5].map((i) => <Tap key={`f${i}`} count="baskets" sfx="plop"><Basket x={332 + i * 70} y={410} s={0.86} fill={i % 2 ? 'bread' : 'fish'} /></Tap>)}
    <Heart x={205} y={196} />
    <g pointerEvents="none"><Sparkles spots={[[420, 290, 8], [560, 280, 10], [680, 300, 7], [330, 220, 6]]} /></g>
    <rect width={800} height={450} fill="#ff9a6a" opacity={0.06} pointerEvents="none" />
  </Scene>
)

// 10. "Then the boy ran all the way home. "Mom! Dad! Jesus fed everybody with my little lunch!" What a happy day!"
// Evening in the village: the moon is up and the lamp is lit. The boy runs up the path, and his mom
// and dad come out of the door to hear all about it.
const PageHome = () => (
  <Scene sky="dusk" ground="none" moon stars clouds={false}>
    <path d="M0 304 Q170 270 380 296 Q560 268 800 292 L800 450 L0 450 Z" fill="#8aa98a" />
    <FarHouse x={196} y={290} />
    <FarHouse x={238} y={288} w={28} />
    <FarHouse x={290} y={292} w={30} />
    <path d="M0 372 Q240 344 470 370 T800 360 L800 450 L0 450 Z" fill="#76a06e" />
    <Tree x={70} y={392} s={0.85} />
    {/* the path up to the door */}
    <path d="M150 450 Q230 404 380 398 Q500 394 560 384 L640 384 Q560 404 480 412 Q340 426 290 450 Z" fill="#e3c998" />
    <Glow x={590} y={330} r={120} color="#ffe2a0" />
    <Home x={610} y={384} />
    <Tap say="Welcome home! Tell us all about it." sfx="sparkle">
      <Person x={548} y={420} s={1} look={BOYS_MOM} pose="arms-up" facing="left" blinkDelay={1.3} />
    </Tap>
    <Tap say="Jesus fed everybody? Wow!" sfx="ding">
      <Person x={690} y={424} s={1.04} look={BOYS_DAD} pose="wave" facing="left" blinkDelay={0.4} />
    </Tap>
    <Tap say="Mom! Dad! Guess what Jesus did!" sfx="good">
      <g>
        <Dust x={300} y={428} />
        <path d="M292 352 L314 352 M284 370 L312 370 M294 388 L314 388" stroke="#fff6dc" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
        <g transform="rotate(7 350 436)"><Person x={350} y={436} s={1.12} look={PEOPLE.boy} pose="arms-up" blinkDelay={0.8} /></g>
      </g>
    </Tap>
    <Tap say="Baa!" sfx="pop">
      <Sheep x={196} y={416} s={0.7} />
    </Tap>
  </Scene>
)

// 11. "The next day, Jesus said, "I am the bread of life." Bread fills our tummies, but Jesus fills our hearts! He takes care of us every single day."
// The next morning by the lake (John 6:22–35): Jesus holds up a loaf, and over it a heart glows: He fills
// our hearts. The boy has come with his mom and dad; the girl and her mother are there too.
const PageBread = () => (
  <Scene sky="day" ground="none" sun>
    <Hills lake />
    <Boat x={52} y={280} s={0.36} />
    <Crowd sit seed={180} rows={[[312, 330, 780, 12, 0.32], [334, 360, 790, 9, 0.4]]} skip={[[350, 452], [600, 740]]} />
    <Glow x={400} y={200} r={150} color="#fff3b0" />
    <Tap say="I am the bread of life!" sfx="sparkle">
      <Person x={400} y={416} s={1.2} look={PEOPLE.jesus} pose="hold">
        <Bread x={0} y={-64} s={0.86} />
        <Hand x={-17} y={-58} skin={PEOPLE.jesus.skin} />
        <Hand x={17} y={-58} skin={PEOPLE.jesus.skin} />
      </Person>
    </Tap>
    <Tap say="Jesus fills our hearts with love!" sfx="ding">
      <Heart x={400} y={180} s={1.5} />
    </Tap>
    <Person x={110} y={420} s={1.02} look={BOYS_DAD} facing="right" blinkDelay={1.8} />
    <Person x={188} y={424} s={0.98} look={BOYS_MOM} pose="pray" facing="right" blinkDelay={0.6} />
    <Tap say="Jesus takes care of us every day!" sfx="good">
      <Person x={268} y={434} s={1.08} look={PEOPLE.boy} pose="wave" blinkDelay={1.2} />
    </Tap>
    <Tap say="Thank you, Jesus!" sfx="pop">
      <Person x={560} y={432} s={1.05} look={GIRL} pose="pray" facing="left" blinkDelay={0.2} />
    </Tap>
    <Person x={652} y={420} s={1.02} look={MOTHER} facing="left" blinkDelay={2.2} />
    <Flower x={738} y={436} color="#ffd34d" />
    <Flower x={40} y={440} color="#ff8cc0" />
    <g pointerEvents="none"><Sparkles spots={[[332, 150, 8], [470, 140, 9], [300, 230, 6], [500, 240, 7]]} /></g>
  </Scene>
)

/** Part 1 is pages 1–6; part 2 (data/loaves.ts, `first: 6`) is pages 7–11. */
export const LOAVES_ART: ComponentType[] = [
  PageCrowd, PageTeach, PageHungry, PageBoy, PageShare, PageThanks,
  PagePassOut, PageAte, PageBaskets, PageHome, PageBread,
]
