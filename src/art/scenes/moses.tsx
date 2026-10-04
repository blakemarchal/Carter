// The Moses islands (Baby Moses, the Burning Bush, the Red Sea, Manna): the cast and props they share,
// so Moses, his family and God's people look the same on every one. Moved here from scenes/red-sea.tsx.
//   people: MOSES, AARON, MIRIAM, PHARAOH (their looks are in PEOPLE, people.tsx; draw Pharaoh with
//           <Pharaoh>, which adds his headdress and collar), HEBREWS (God's people: a family, grandma and
//           grandpa, and more for crowds), Folk (a little person in a crowd far away);
//   props:  WaterWall, SeaPath, PillarOfCloud, PillarOfFire, FarChariots, Tambourine, Goat, Lamb, Pyramid,
//           SeaFish, Staff, and Egypt's bricks, columns and throne; backgrounds: Desert, Beach, CalmSea.
// God is never drawn as a person: His presence is light (the glow, the pillar of cloud, the pillar of fire).
import { useId, type ComponentProps, type ReactNode } from 'react'
import { darken, ink, lighten } from '../kit'
import { Person, PEOPLE, SKIN, type Look } from '../people'
import { Glow } from './kit'
import './red-sea.css'

// ---------- Bible people (the same on every Moses island) ----------

export const MOSES = PEOPLE.moses
export const AARON = PEOPLE.aaron
export const MIRIAM = PEOPLE.miriam
export const PHARAOH = PEOPLE.pharaoh

/** God's people (the Israelites): one family that walks the whole story, and more faces for crowds. */
export const HEBREWS = {
  dad: { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8dcc0', beard: 'short', beardColor: '#3b2a20', robe: '#5f8fc0', sash: '#e0b45a' },
  mom: { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#6fb7b0', robe: '#c98aa8', sash: '#f5f0e6' },
  boy: { skin: SKIN.tan, hair: 'curly', hairColor: '#3b2a20', robe: '#7cb06a', sash: '#c98448', build: 'child' },
  girl: { skin: SKIN.tan, hair: 'pigtails', hairColor: '#4a3020', robe: '#ff9fb8', sash: '#ffffff', build: 'child' },
  grandma: { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#c9c1e4', robe: '#8f7fbf', sash: '#f0d38a' },
  grandpa: { skin: SKIN.tan, hair: 'covered', hairColor: '#e8e4dc', wrap: '#f5f0e6', beard: 'long', beardColor: '#eeeae2', robe: '#6b8f5a', sash: '#d9b56a' },
  man: { skin: SKIN.deep, hair: 'covered', hairColor: '#2b1f18', wrap: '#e07a5f', beard: 'short', beardColor: '#2b1f18', robe: '#d9b56a', sash: '#8a5428' },
  woman: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#a98cff', robe: '#6fb7b0', sash: '#f5f0e6' },
  lad: { skin: SKIN.medium, hair: 'short', hairColor: '#2b1f18', robe: '#e6b85a', sash: '#a0612f', build: 'child' },
  lass: { skin: SKIN.deep, hair: 'ponytail', hairColor: '#1f1712', robe: '#9fd0f0', sash: '#ffffff', build: 'child' },
  auntie: { skin: '#e3b48c', hair: 'covered', hairColor: '#3b2a20', wrap: '#ff9f6a', robe: '#a9d47e', sash: '#ffffff' },
} satisfies Record<string, Look>

export type PersonProps = ComponentProps<typeof Person>

/** Grandma's silver hair peeking out under her head cloth (figure units, inside her Person). */
export const SilverHair = () => (
  <g fill="#ece8e2" stroke="#c9c2b8" strokeWidth={1.4}>
    <path d="M-21 -114 Q-20 -126 -9 -127 Q-14 -122 -15 -112 Z" />
    <path d="M21 -114 Q20 -126 9 -127 Q14 -122 15 -112 Z" />
  </g>
)

/**
 * Pharaoh's regalia, over a Person with PHARAOH's look (figure units): the striped nemes headdress
 * falling beside his face, a gold band with a blue jewel, a little gold crown, and a broad beaded collar.
 */
export function PharaohRegalia() {
  const id = `ph${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const cap = 'M-25 -112 Q-26 -142 0 -142 Q26 -142 25 -112 Q14 -128 0 -127 Q-14 -128 -25 -112 Z'
  // One side of the headdress: from the temple, flaring over the ear and down in front of the shoulder.
  const flap = 'M16.5 -127 C25 -124 31 -112 33 -94 L27 -76 Q21 -72 15 -77 L16.8 -97 Q17.8 -110 16.5 -123 Z'
  const stripes = Array.from({ length: 12 }, (_, i) => -146 + i * 6.5)
  return (
    <g>
      <defs>
        <clipPath id={`${id}c`}><path d={cap} /></clipPath>
        <clipPath id={`${id}f`}><path d={flap} /><path d={flap} transform="scale(-1 1)" /></clipPath>
      </defs>
      {/* collar: rows of beads from shoulder to shoulder */}
      <path d="M-23 -95 Q0 -70 23 -95 L20 -88 Q0 -66 -20 -88 Z" fill="#3a6fc4" stroke="#24508f" strokeWidth={1.5} />
      <path d="M-21 -92 Q0 -72 21 -92" stroke="#f2c94c" strokeWidth={3} fill="none" />
      <path d="M-18 -88.5 Q0 -71 18 -88.5" stroke="#e05a4a" strokeWidth={2} fill="none" strokeDasharray="2 2.4" />
      {/* the headdress flaps, gold with blue stripes */}
      {[1, -1].map((side) => <path key={side} d={flap} transform={`scale(${side} 1)`} fill="#f2c94c" stroke="#b8901c" strokeWidth={2} strokeLinejoin="round" />)}
      <g clipPath={`url(#${id}f)`}>
        {stripes.map((y) => <path key={y} d={`M-40 ${y + 8} L40 ${y + 2}`} stroke="#3a6fc4" strokeWidth={3} />)}
      </g>
      {/* blue stripes over the gold cap */}
      <g clipPath={`url(#${id}c)`}>
        {stripes.map((y) => <rect key={y} x={-30} y={y} width={60} height={3} fill="#3a6fc4" />)}
      </g>
      <path d={cap} fill="none" stroke="#b8901c" strokeWidth={2} />
      {/* the gold band across his forehead, with a jewel, and a little crown on top */}
      <path d="M-24 -114 Q-14 -129.5 0 -128.5 Q14 -129.5 24 -114" stroke="#f7d65a" strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={-129} r={3.4} fill="#3a9fe0" stroke="#1f6aa8" strokeWidth={1.4} />
      <path d="M-13 -139 L-13 -151 L-6.5 -144.5 L0 -155 L6.5 -144.5 L13 -151 L13 -139 Q0 -143 -13 -139 Z" fill="#ffd34d" stroke="#d9a400" strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx={0} cy={-145} r={2} fill="#e05a4a" />
    </g>
  )
}

/** Pharaoh, king of Egypt: PHARAOH's look, his headdress and his collar. */
export function Pharaoh({ children, ...p }: Omit<PersonProps, 'look'>) {
  return <Person {...p} look={PHARAOH}><PharaohRegalia />{children}</Person>
}

/** A shepherd's staff with its crook, from (x1, y1) at the bottom to (x2, y2) at the top (figure units). */
export function Staff({ x1, y1, x2, y2, w = 5 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len
  // the crook curls forward (to the right of the staff's direction) and back down
  const px = -uy, py = ux
  const c1 = [x2 + ux * 10 - px * 9, y2 + uy * 10 - py * 9]
  const c2 = [x2 + ux * 2 - px * 15, y2 + uy * 2 - py * 15]
  const tip = [x2 - ux * 7 - px * 11, y2 - uy * 7 - py * 11]
  const f = (n: number) => n.toFixed(1)
  return (
    <path d={`M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} Q${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} Q${f(tip[0] - ux * 2)} ${f(tip[1] - uy * 2)} ${f(tip[0])} ${f(tip[1])}`}
      stroke="#8a5a2e" strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  )
}

/** A hand over something held, so it shows gripping it (figure units). */
export const Grip = ({ x, y, skin }: { x: number; y: number; skin: string }) => (
  <circle cx={x} cy={y} r={7} fill={skin} stroke={ink(skin)} strokeWidth={2} />
)

/** Moses holding his staff up and out over the sea (pose "point": his hand is at (54, -90)). */
export const RaisedStaff = () => (
  <g>
    <Staff x1={30} y1={-28} x2={84} y2={-168} />
    <Grip x={54} y={-90} skin={MOSES.skin} />
  </g>
)

/** Moses' staff in his other hand (the left one, at (-30, -46)), while his right hand is busy. */
export const StaffInLeftHand = () => (
  <g>
    <Staff x1={-30} y1={-2} x2={-28} y2={-150} />
    <Grip x={-30} y={-46} skin={MOSES.skin} />
  </g>
)

// ---------- God's people in a crowd far away ----------

export const SKINS = ['#d9a47a', '#c68b5e', '#f0c9a8', '#8d5a3b', '#e3b48c']
export const ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
export const WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
export const HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24']

/**
 * One little person far away in a crowd, front view (about 66 units tall at s = 1, feet at (x, y)).
 * `i` picks the colors; `child` is smaller; `up`: both arms raised (cheering); `wave`: one arm waving;
 * `load`: with `up`, carrying two mud bricks on the head.
 */
export function Folk({ x, y, s = 1, i = 0, child, up, wave, load }: { x: number; y: number; s?: number; i?: number; child?: boolean; up?: boolean; wave?: boolean; load?: boolean }) {
  const robe = ROBES[i % ROBES.length]
  const skin = SKINS[(i * 7 + 2) % SKINS.length]
  const covered = (i * 5) % 3 !== 1
  const hair = HAIRS[(i * 3) % HAIRS.length]
  const wrap = WRAPS[(i * 11) % WRAPS.length]
  const k = s * (child ? 0.72 : 1)
  const hy = -54
  const cap = `M-12 ${hy} Q-13 ${hy - 15} 0 ${hy - 15} Q13 ${hy - 15} 12 ${hy} Q6 ${hy - 8} 0 ${hy - 7} Q-6 ${hy - 8} -12 ${hy} Z`
  const arm = (ax: number, ay: number, bx: number, by: number, key: string) => (
    <g key={key}>
      <path d={`M${ax} ${ay} L${bx} ${by}`} stroke={ink(robe)} strokeWidth={6.5} strokeLinecap="round" />
      <path d={`M${ax} ${ay} L${bx} ${by}`} stroke={robe} strokeWidth={4.5} strokeLinecap="round" />
      <circle cx={bx} cy={by} r={3.4} fill={skin} stroke={ink(skin)} strokeWidth={1.5} />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {covered && <path d={`M-13 ${hy - 3} Q-16 ${hy + 15} -11 ${hy + 13} L11 ${hy + 13} Q16 ${hy + 15} 13 ${hy - 3} Z`} fill={wrap} stroke={ink(wrap)} strokeWidth={2} />}
      <ellipse cx={-7} cy={-2} rx={6} ry={3} fill="#7a5233" />
      <ellipse cx={7} cy={-2} rx={6} ry={3} fill="#7a5233" />
      <path d="M-12 -42 Q0 -46 12 -42 L17 -4 Q0 0 -17 -4 Z" fill={robe} stroke={ink(robe)} strokeWidth={2.5} strokeLinejoin="round" />
      {up ? arm(-10.5, -39, -19, -64, 'l') : arm(-10.5, -39, -17.5, -19, 'l')}
      {up || wave ? arm(10.5, -39, 19, -64, 'r') : arm(10.5, -39, 17.5, -19, 'r')}
      <circle cx={0} cy={hy} r={11} fill={skin} stroke={ink(skin)} strokeWidth={2} />
      <circle cx={-4} cy={hy} r={1.9} fill="#2b2140" />
      <circle cx={4} cy={hy} r={1.9} fill="#2b2140" />
      <ellipse cx={-7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <ellipse cx={7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <path d={`M-3 ${hy + 5} Q0 ${hy + 8.5} 3 ${hy + 5}`} stroke="#6b2a3a" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d={cap} fill={covered ? wrap : hair} stroke={ink(covered ? wrap : hair)} strokeWidth={2} />
      {up && load && [-21, 0].map((bx) => <rect key={bx} x={bx} y={-79} width={21} height={10} rx={1.5} fill="#c98a55" stroke="#8f5a32" strokeWidth={1.8} />)}
    </g>
  )
}

// ---------- Animals ----------

/** A goat standing side-on (facing right): four thin legs, little horns, a beard and a perky tail. (x, y) = its hooves. */
export function Goat({ x, y, s = 1, facing = 'right', coat = '#d9b48a', patch = '#8a5a3a' }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; coat?: string; patch?: string
}) {
  const line = darken(coat, 0.35)
  const horn = '#d8c49a'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      {/* far legs (in shadow), each with a dark hoof */}
      {[-17, 15].map((lx) => <g key={lx}><rect x={lx} y={-31} width={6} height={30} rx={3} fill={darken(coat, 0.18)} stroke={line} strokeWidth={1.6} /><rect x={lx - 0.3} y={-6} width={6.6} height={6} rx={2} fill="#4a3a33" /></g>)}
      {/* tail, flicked up at the back */}
      <path d="M-31 -46 Q-41 -58 -36 -64 Q-30 -56 -27 -48 Z" fill={coat} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
      {/* the neck goes behind the body, so the body's edge makes the shoulder */}
      <path d="M12 -50 Q20 -64 29 -76 L42 -68 Q33 -54 25 -36 Z" fill={coat} stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={-3} cy={-41} rx={31} ry={15} fill={coat} stroke={line} strokeWidth={2.2} />
      <path d="M-20 -54 Q-8 -46 -18 -30 Q-30 -34 -31 -44 Q-28 -52 -20 -54 Z" fill={patch} opacity={0.85} />
      <ellipse cx={-6} cy={-31} rx={17} ry={4.5} fill={lighten(coat, 0.35)} opacity={0.8} />
      {/* the neck again over the body's edge at the top, so it joins smoothly */}
      <path d="M15 -52 Q21 -62 29 -74 L36 -70 Q28 -58 22 -46 Z" fill={coat} />
      {/* near legs */}
      {[-24, 7].map((lx) => <g key={lx}><rect x={lx} y={-31} width={6.5} height={31} rx={3} fill={coat} stroke={line} strokeWidth={1.6} /><rect x={lx - 0.3} y={-6} width={7.1} height={6} rx={2} fill="#4a3a33" /></g>)}
      {/* horns curving back, an ear, the head (snout down a little) and a little beard */}
      <path d="M31 -82 Q27 -96 16 -99 Q24 -93 26 -80 Z" fill={horn} stroke={darken(horn, 0.35)} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M37 -83 Q35 -97 24 -101 Q31 -94 32 -81 Z" fill={lighten(horn, 0.15)} stroke={darken(horn, 0.35)} strokeWidth={1.6} strokeLinejoin="round" />
      <ellipse cx={25} cy={-76} rx={10} ry={4} fill={coat} stroke={line} strokeWidth={1.6} transform="rotate(25 25 -76)" />
      <ellipse cx={39} cy={-74} rx={12} ry={9.5} fill={coat} stroke={line} strokeWidth={2} transform="rotate(32 39 -74)" />
      <ellipse cx={47} cy={-66} rx={7} ry={5.5} fill={lighten(coat, 0.3)} stroke={line} strokeWidth={1.6} transform="rotate(32 47 -66)" />
      <path d="M42 -61 Q44 -51 39 -47 Q37 -53 38 -61 Z" fill={darken(coat, 0.3)} />
      <circle cx={41.5} cy={-77} r={2.5} fill="#2b2140" />
      <circle cx={40.8} cy={-77.8} r={0.85} fill="#fff" />
      <circle cx={50} cy={-67} r={1.1} fill={line} />
    </g>
  )
}

/** A little lamb held in someone's arms, front view (figure units: its middle at (x, y)). */
export function Lamb({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill="#fffaf2" stroke="#d8cfc2" strokeWidth={2}>
        {[[-14, 2], [-4, -4], [8, -2], [-8, 8], [6, 8]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={9} />)}
      </g>
      <g fill="#fffaf2">{[[-14, 2], [-4, -4], [8, -2], [-8, 8], [6, 8]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={7.6} />)}</g>
      <ellipse cx={20} cy={-8} rx={6} ry={3} fill="#4a3a3a" transform="rotate(30 20 -8)" />
      <ellipse cx={10} cy={-12} rx={6} ry={3} fill="#4a3a3a" transform="rotate(-30 10 -12)" />
      <ellipse cx={15} cy={-5} rx={8} ry={9} fill="#4a3a3a" />
      <circle cx={12} cy={-7} r={1.8} fill="#fff" />
      <circle cx={18} cy={-7} r={1.8} fill="#fff" />
      <circle cx={12.3} cy={-7} r={0.9} fill="#2b2140" />
      <circle cx={18.3} cy={-7} r={0.9} fill="#2b2140" />
    </g>
  )
}

/** A friendly fish swimming in the sea walls (facing right, or left): a round body, a fin, a tail and a big eye. */
export function SeaFish({ x, y, s = 1, color = '#ffa64d', facing = 'right', stripes }: {
  x: number; y: number; s?: number; color?: string; facing?: 'left' | 'right'; stripes?: string
}) {
  const line = ink(color)
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <path d="M-17 0 L-31 -11 Q-27 0 -31 11 Z" fill={color} stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-6 -11 Q0 -21 10 -12 Z" fill={darken(color, 0.08)} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={19} ry={12.5} fill={color} stroke={line} strokeWidth={2.2} />
      {stripes && <path d="M-5 -11.5 Q-9 0 -5 11.5 L-1 11.9 Q-5 0 -1 -11.9 Z M5 -11.9 Q1 0 5 11.9 L8.5 11 Q4.5 0 8.5 -11 Z" fill={stripes} />}
      <ellipse cx={-3} cy={-5} rx={6} ry={2.6} fill="#fff" opacity={0.4} transform="rotate(-12 -3 -5)" />
      <circle cx={10} cy={-3} r={4.3} fill="#fff" />
      <circle cx={11} cy={-3} r={2.6} fill="#2b2140" />
      <circle cx={10.2} cy={-4.1} r={0.9} fill="#fff" />
      <path d="M16.5 3 q2.4 1.6 0 3.2" stroke={line} strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

// ---------- The sea, standing up ----------

/** [x, y, size, colour, facing, stripes] for a fish in a wall of water. */
export type FishSpot = [x: number, y: number, s?: number, color?: string, facing?: 'left' | 'right', stripes?: string]

export const WATER = { top: '#a8e6fa', mid: '#5bbcee', deep: '#2f86cf', foam: '#ffffff', foamLine: '#b5e2f7' }
export const NIGHT_WATER = { top: '#6aa8de', mid: '#3a75c0', deep: '#21438d', foam: '#e6f1ff', foamLine: '#8fb3e0' }

/** A wavy line along the top of the water, from where the path already is to x2 (Q segments only). */
export function waves(x1: number, x2: number, amp: number, step: number) {
  const n = Math.max(1, Math.round((x2 - x1) / step))
  const w = (x2 - x1) / n
  let d = ''
  for (let i = 0; i < n; i++) d += ` q${(w / 2).toFixed(1)} ${i % 2 ? amp : -amp} ${w.toFixed(1)} 0`
  return d
}

/** A frothy white edge of foam along a line from (x1, y1) to (x2, y2): a row of overlapping puffs. */
export function Foam({ x1, y1, x2, y2, r = 9, night }: { x1: number; y1: number; x2: number; y2: number; r?: number; night?: boolean }) {
  const c = night ? NIGHT_WATER : WATER
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / (r * 1.25)))
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + (i % 2 ? -r * 0.25 : r * 0.1), r * (i % 3 === 1 ? 1.12 : 0.92)] as const
  })
  return (
    <g>
      {pts.map(([x, y, rr], i) => <circle key={`o${i}`} cx={x} cy={y} r={rr + 2} fill={c.foamLine} />)}
      {pts.map(([x, y, rr], i) => <circle key={`f${i}`} cx={x} cy={y} r={rr} fill={c.foam} />)}
      {pts.filter((_, i) => i % 2 === 0).map(([x, y, rr], i) => <circle key={`h${i}`} cx={x - rr * 0.25} cy={y - rr * 0.3} r={rr * 0.35} fill="#fff" />)}
    </g>
  )
}

/** Seaweed swaying at the foot of a wall of water. */
export function Seaweed({ x, y, h = 34, color = '#4fae7a' }: { x: number; y: number; h?: number; color?: string }) {
  return (
    <g className="rs-sway">
      <path d={`M${x} ${y} q-7 ${-h * 0.3} 0 ${-h * 0.55} t0 ${-h * 0.45}`} stroke={ink(color)} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M${x} ${y} q-7 ${-h * 0.3} 0 ${-h * 0.55} t0 ${-h * 0.45}`} stroke={color} strokeWidth={3.6} fill="none" strokeLinecap="round" />
      <path d={`M${x + 7} ${y} q6 ${-h * 0.25} 0 ${-h * 0.42} t0 ${-h * 0.3}`} stroke={ink(color)} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={`M${x + 7} ${y} q6 ${-h * 0.25} 0 ${-h * 0.42} t0 ${-h * 0.3}`} stroke={lighten(color, 0.15)} strokeWidth={2.8} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A few bubbles rising in the water. */
export const Bubbles = ({ spots }: { spots: [number, number, number?][] }) => (
  <g>
    {spots.map(([x, y, r = 4], i) => (
      <g key={i} className="rs-bubble" style={{ animationDelay: `${(i * 0.7) % 3}s` }}>
        <circle cx={x} cy={y} r={r} fill="#ffffff" fillOpacity={0.25} stroke="#ffffff" strokeWidth={1.5} strokeOpacity={0.85} />
      </g>
    ))}
  </g>
)

/**
 * A tall wall of water seen from the side (the sea standing up beside the dry path): from x1 to x2,
 * its foamy top at `top` and its foot on the sea floor at `foot`. Its ends lean out and down to the
 * shores. Fish swim inside it; seaweed sways at its foot. `night`: darker water.
 */
export function WaterWall({ x1, x2, top, foot, fish = [], weeds = [], night, bubbles = [] }: {
  x1: number; x2: number; top: number; foot: number; fish?: FishSpot[]; weeds?: number[]; night?: boolean; bubbles?: [number, number, number?][]
}) {
  const id = `ww${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const c = night ? NIGHT_WATER : WATER
  const h = foot - top
  // Each end rises from a low toe of water on the shore, steep, and rounds over into the foamy top.
  const toe = Math.min(70, h * 0.3)
  const body = `M${x1 - toe} ${foot} C${x1 - toe * 0.35} ${foot - 2} ${x1 - 2} ${foot - h * 0.22} ${x1} ${top + h * 0.32}`
    + ` C${x1 + 1} ${top + 12} ${x1 + 8} ${top} ${x1 + 26} ${top}`
    + waves(x1 + 26, x2 - 26, 6, 40)
    + ` C${x2 - 8} ${top} ${x2 - 1} ${top + 12} ${x2} ${top + h * 0.32}`
    + ` C${x2 + 2} ${foot - h * 0.22} ${x2 + toe * 0.35} ${foot - 2} ${x2 + toe} ${foot} Z`
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.top} />
          <stop offset="0.45" stopColor={c.mid} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <clipPath id={`${id}c`}><path d={body} /></clipPath>
      </defs>
      <path d={body} fill={`url(#${id}g)`} stroke={darken(c.deep, 0.15)} strokeWidth={3} strokeLinejoin="round" />
      <g clipPath={`url(#${id}c)`}>
        {/* light rippling through the water */}
        {Array.from({ length: Math.floor(h / 42) }, (_, i) => top + 34 + i * 42).map((y, i) => (
          <path key={y} d={`M${x1 - 40 + (i % 2) * 30} ${y}${waves(x1 - 40 + (i % 2) * 30, x2 + 40, 4, 34)}`} stroke="#ffffff" strokeOpacity={0.22} strokeWidth={3} fill="none" />
        ))}
        {weeds.map((x) => <Seaweed key={x} x={x} y={foot + 2} h={30 + (x % 3) * 8} />)}
        {fish.map(([x, y, s = 1, color = '#ffa64d', facing = 'right', stripes], i) => (
          <g key={i} className="rs-bob" style={{ animationDelay: `${(i * 0.9) % 2.8}s` }}>
            <SeaFish x={x} y={y} s={s} color={color} facing={facing} stripes={stripes} />
          </g>
        ))}
        <Bubbles spots={bubbles} />
        {/* a soft shine across the face of the water */}
        <path d={`M${x1 + 20} ${foot} L${x1 + 90} ${top} L${x1 + 130} ${top} L${x1 + 60} ${foot} Z`} fill="#fff" opacity={0.08} />
        <path d={`M${(x1 + x2) / 2} ${foot} L${(x1 + x2) / 2 + 70} ${top} L${(x1 + x2) / 2 + 92} ${top} L${(x1 + x2) / 2 + 22} ${foot} Z`} fill="#fff" opacity={0.07} />
      </g>
      <Foam x1={x1 + 8} y1={top + 2} x2={x2 - 8} y2={top + 2} night={night} />
      {/* foam spilling a little way down the rounded ends */}
      <Foam x1={x1 + 2} y1={top + 8} x2={x1 - 1} y2={top + 34} r={7} night={night} />
      <Foam x1={x2 - 2} y1={top + 8} x2={x2 + 1} y2={top + 34} r={7} night={night} />
    </g>
  )
}

/**
 * The sea split in two, seen from a shore looking along the dry path: the ends of the two walls of
 * water face us at the left and right, their inner sides run away toward the far shore, and the dry
 * path runs between them. (vx, vy): where the path meets the far shore, on the horizon; nl, nr: the
 * path's edges at our end, at height ny; top: the walls' tops at our end. `fish` swim in the ends facing us.
 */
export function SeaPath({ vx, vy, nl, nr, ny, top, night, fish = [], children }: {
  vx: number; vy: number; nl: number; nr: number; ny: number; top: number; night?: boolean; fish?: FishSpot[]; children?: ReactNode
}) {
  const id = `sp${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const c = night ? NIGHT_WATER : WATER
  // How high the walls are where they reach the far shore.
  const farTop = vy - (vy - top) * 0.12
  const fl = vx - 9, fr = vx + 9
  const leftInner = `M${nl} ${ny} L${nl} ${top} L${fl} ${farTop} L${fl} ${vy} Z`
  const rightInner = `M${nr} ${ny} L${nr} ${top} L${fr} ${farTop} L${fr} ${vy} Z`
  const leftEnd = `M-20 ${ny} L-20 ${top}${waves(-20, nl, 6, 38)} L${nl} ${ny} Z`
  const rightEnd = `M${nr} ${ny} L${nr} ${top}${waves(nr, 820, 6, 38)} L820 ${ny} Z`
  const path = `M${nl} ${ny} L${fl} ${vy} L${fr} ${vy} L${nr} ${ny} Z`
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.top} />
          <stop offset="0.5" stopColor={c.mid} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c.mid} />
          <stop offset="1" stopColor={darken(c.deep, 0.1)} />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor={c.mid} />
          <stop offset="1" stopColor={darken(c.deep, 0.1)} />
        </linearGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? '#8a7a7a' : '#e6c98e'} />
          <stop offset="1" stopColor={night ? '#b59a78' : '#f3d9a2'} />
        </linearGradient>
        <clipPath id={`${id}a`}><path d={leftEnd} /><path d={rightEnd} /></clipPath>
      </defs>
      {/* the dry path, with ripples in the sand */}
      <path d={path} fill={`url(#${id}p)`} />
      {[0.25, 0.45, 0.62, 0.78, 0.9].map((t) => {
        const y = vy + (ny - vy) * t
        const hw = 9 + ((nr - nl) / 2 - 9) * t
        return <path key={t} d={`M${vx - hw * 0.7} ${y} q${hw * 0.35} ${-3 * t} ${hw * 0.7} 0 t${hw * 0.7} 0`} stroke={night ? '#9a8468' : '#d9b574'} strokeWidth={1 + t * 2} fill="none" strokeLinecap="round" />
      })}
      {/* the walls' inner sides, running away to the far shore */}
      <path d={leftInner} fill={`url(#${id}l)`} stroke={darken(c.deep, 0.2)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={rightInner} fill={`url(#${id}r)`} stroke={darken(c.deep, 0.2)} strokeWidth={2.5} strokeLinejoin="round" />
      {[0.3, 0.55, 0.8].map((t) => (
        <g key={t} stroke="#ffffff" strokeOpacity={0.2} strokeWidth={2.5} fill="none">
          <path d={`M${nl} ${top + (ny - top) * t} L${fl} ${farTop + (vy - farTop) * t}`} />
          <path d={`M${nr} ${top + (ny - top) * t} L${fr} ${farTop + (vy - farTop) * t}`} />
        </g>
      ))}
      <Foam x1={nl} y1={top} x2={fl} y2={farTop} r={7} night={night} />
      <Foam x1={nr} y1={top} x2={fr} y2={farTop} r={7} night={night} />
      {children}
      {/* the walls' ends, facing us, with fish inside */}
      <path d={leftEnd} fill={`url(#${id}g)`} stroke={darken(c.deep, 0.15)} strokeWidth={3} strokeLinejoin="round" />
      <path d={rightEnd} fill={`url(#${id}g)`} stroke={darken(c.deep, 0.15)} strokeWidth={3} strokeLinejoin="round" />
      <g clipPath={`url(#${id}a)`}>
        {Array.from({ length: Math.floor((ny - top) / 40) }, (_, i) => top + 30 + i * 40).map((y, i) => (
          <path key={y} d={`M${-40 + (i % 2) * 26} ${y}${waves(-40 + (i % 2) * 26, 840, 4, 34)}`} stroke="#ffffff" strokeOpacity={0.22} strokeWidth={3} fill="none" />
        ))}
        {fish.map(([x, y, s = 1, color = '#ffa64d', facing = 'right', stripes], i) => (
          <g key={i} className="rs-bob" style={{ animationDelay: `${(i * 0.9) % 2.8}s` }}>
            <SeaFish x={x} y={y} s={s} color={color} facing={facing} stripes={stripes} />
          </g>
        ))}
      </g>
      <Foam x1={-14} y1={top} x2={nl} y2={top} night={night} />
      <Foam x1={nr} y1={top} x2={814} y2={top} night={night} />
    </g>
  )
}

// ---------- God leading His people: the pillar of cloud and the pillar of fire (light, never a face) ----------

/**
 * The tall pillar of cloud that led God's people by day: a tower of soft, billowing cloud, wider at the
 * top, glowing warmly from inside. (x, y) = its foot; h tall, about w wide.
 */
export function PillarOfCloud({ x, y, h = 300, w = 70 }: { x: number; y: number; h?: number; w?: number }) {
  const id = `pc${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const rows = Math.max(5, Math.round(h / 36))
  const puffs: [number, number, number][] = []
  for (let i = 0; i < rows; i++) {
    const t = i / rows
    const r = (w / 2) * (0.74 + 0.2 * t)
    const cy = -w * 0.32 - t * (h - w * 0.95)
    const sway = Math.sin(i * 1.7 + 0.6) * w * 0.07
    puffs.push([sway, cy, r * 0.92], [sway - r * 0.58, cy + r * 0.28, r * 0.6], [sway + r * 0.6, cy + r * 0.12 * (i % 2 ? 1 : -1), r * 0.62])
  }
  // its rounded top
  const tr = w * 0.48, ty = -h + tr
  puffs.push([0, ty, tr * 0.96], [-tr * 0.62, ty + tr * 0.32, tr * 0.7], [tr * 0.64, ty + tr * 0.28, tr * 0.72])
  return (
    <g>
      <Glow x={x} y={y - h * 0.5} r={h * 0.58} color="#fff3c4" />
      <g transform={`translate(${x} ${y})`}>
        <defs>
          <radialGradient id={id} cx="50%" cy="45%" r="50%">
            <stop offset="0" stopColor="#ffe9a6" stopOpacity={0.75} />
            <stop offset="1" stopColor="#ffe9a6" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g className="rs-drift">
          {puffs.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 2.5} fill="#d3cde8" />)}
          {puffs.map(([cx, cy, r], i) => <circle key={`s${i}`} cx={cx} cy={cy} r={r} fill="#e8e3f6" />)}
          {puffs.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx - r * 0.13} cy={cy - r * 0.15} r={r * 0.83} fill="#ffffff" />)}
          {/* God's light, warm inside the cloud */}
          <ellipse cx={0} cy={-h * 0.52} rx={w * 0.62} ry={h * 0.5} fill={`url(#${id})`} />
        </g>
      </g>
    </g>
  )
}

/** A flame shape: a round bottom at (0, 0) and a point at (0, -h), w wide on each side. */
export const flame = (w: number, h: number) =>
  `M0 ${-h} C${w * 0.35} ${-h * 0.62} ${w} ${-h * 0.42} ${w} ${-h * 0.18} C${w} ${-h * 0.02} ${w * 0.55} 0 0 0 C${-w * 0.55} 0 ${-w} ${-h * 0.02} ${-w} ${-h * 0.18} C${-w} ${-h * 0.42} ${-w * 0.35} ${-h * 0.62} 0 ${-h} Z`

/** The tall pillar of fire that gave God's people light at night: a column of warm flames in a big glow. (x, y) = its foot. */
export function PillarOfFire({ x, y, h = 300, w = 40 }: { x: number; y: number; h?: number; w?: number }) {
  const tongues: [number, number, number, number][] = [[-0.8, 0.28, 0.5, -24], [0.85, 0.36, 0.48, 22], [-0.7, 0.55, 0.42, -18], [0.7, 0.66, 0.4, 20], [-0.5, 0.8, 0.34, -14], [0.45, 0.86, 0.3, 12]]
  return (
    <g>
      <Glow x={x} y={y - h * 0.45} r={h * 0.62} color="#ffd27a" />
      <ellipse cx={x} cy={y} rx={w * 3.2} ry={w * 0.55} fill="#ffcf6a" opacity={0.45} />
      <g transform={`translate(${x} ${y})`}>
        <g className="rs-flicker">
          {tongues.map(([dx, t, k, rot], i) => (
            <path key={i} d={flame(w * k, h * k * 0.55)} transform={`translate(${dx * w} ${-h * t + h * k * 0.3}) rotate(${rot})`} fill="#ff8a3d" stroke="#e4602a" strokeWidth={2} />
          ))}
          <path d={flame(w, h)} fill="#ff8a3d" stroke="#e4602a" strokeWidth={3} />
          <path d={flame(w * 0.68, h * 0.88)} fill="#ffc23f" />
          <path d={flame(w * 0.36, h * 0.66)} fill="#fff1b0" />
        </g>
      </g>
    </g>
  )
}

// ---------- Egypt ----------

/** A pyramid on the skyline: its sunny side and its shady side. (x, y) = the middle of its base. */
export function Pyramid({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const ax = x + w * 0.06
  return (
    <g>
      <path d={`M${x - w / 2} ${y} L${ax} ${y - h} L${x + w * 0.16} ${y} Z`} fill="#f5d898" />
      <path d={`M${ax} ${y - h} L${x + w / 2} ${y} L${x + w * 0.16} ${y} Z`} fill="#dcae64" />
      {[0.25, 0.5, 0.75].map((t) => <path key={t} d={`M${x - w / 2 + (ax - (x - w / 2)) * t} ${y - h * t} L${x + w * 0.16 + (ax - x - w * 0.16) * t} ${y - h * t}`} stroke="#e2bd7a" strokeWidth={1.5} />)}
      <path d={`M${x - w / 2} ${y} L${ax} ${y - h} L${x + w / 2} ${y}`} fill="none" stroke="#c99a52" strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  )
}

/** A painted Egyptian column with a lotus top. (x, y) = its foot; h tall. */
export function Column({ x, y, h, w = 40 }: { x: number; y: number; h: number; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill="#f3e4c4" stroke="#c9a46a" strokeWidth={3} />
      <rect x={x - w / 2 + 6} y={y - h + 30} width={6} height={h - 50} fill="#e8d4aa" />
      {[[34, '#3a6fc4'], [42, '#f2c94c'], [50, '#c0504d']].map(([d, col]) => <rect key={d} x={x - w / 2} y={y - h + (d as number)} width={w} height={6} fill={col as string} />)}
      <path d={`M${x - w / 2} ${y - h + 2} Q${x - w * 0.95} ${y - h - 26} ${x - w * 0.75} ${y - h - 34} L${x + w * 0.75} ${y - h - 34} Q${x + w * 0.95} ${y - h - 26} ${x + w / 2} ${y - h + 2} Z`} fill="#7cbf8a" stroke="#4f8a5c" strokeWidth={2.5} strokeLinejoin="round" />
      {[-0.42, 0, 0.42].map((k) => <path key={k} d={`M${x + k * w} ${y - h} L${x + k * w * 1.25} ${y - h - 30}`} stroke="#4f8a5c" strokeWidth={2} />)}
      <rect x={x - w * 0.8} y={y - h - 42} width={w * 1.6} height={9} fill="#e9d2a6" stroke="#c9a46a" strokeWidth={2} />
      <rect x={x - w / 2 - 5} y={y - 10} width={w + 10} height={10} fill="#e9d2a6" stroke="#c9a46a" strokeWidth={2} />
    </g>
  )
}

/** A neat stack of mud bricks. (x, y) = the middle of its bottom. */
export function BrickStack({ x, y, rows = 3, cols = 3 }: { x: number; y: number; rows?: number; cols?: number }) {
  const bw = 26, bh = 11
  return (
    <g>
      {Array.from({ length: rows }, (_, r) => Array.from({ length: cols - (r % 2) }, (_, c) => {
        const off = (r % 2) * bw / 2
        return <rect key={`${r}-${c}`} x={x - (cols * bw) / 2 + off + c * bw} y={y - (r + 1) * bh} width={bw - 1} height={bh - 1} rx={1.5} fill="#c98a55" stroke="#8f5a32" strokeWidth={1.6} />
      }))}
    </g>
  )
}

/** Bricks laid out on the ground to dry, in rows going back. */
export function DryingBricks({ x, y }: { x: number; y: number }) {
  const rows: [number, number, number, number][] = [[0, 9, 26, 0.8], [16, 9, 28, 0.9], [34, 8, 31, 1]]
  return (
    <g>
      {rows.map(([dy, n, gap, k]) => Array.from({ length: n }, (_, i) => (
        <rect key={`${dy}-${i}`} x={x + i * gap - (n * gap) / 2} y={y + dy} width={20 * k} height={8 * k} rx={1.5} fill="#cf9461" stroke="#9a6438" strokeWidth={1.4} />
      )))}
    </g>
  )
}

/** A clay water jar (figure units, held in front; (x, y) = its middle). */
export const Jar = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y}) scale(1.35)`}>
    <path d="M-8 -18 L8 -18 L6 -12 Q16 -4 12 8 Q0 14 -12 8 Q-16 -4 -6 -12 Z" fill="#d9875a" stroke="#9a5634" strokeWidth={2} strokeLinejoin="round" />
    <ellipse cx={0} cy={-18} rx={8} ry={2.4} fill="#b86a42" stroke="#9a5634" strokeWidth={1.4} />
    <path d="M-11 -1 Q0 3 11 -1" stroke="#f2c08a" strokeWidth={2} fill="none" />
  </g>
)

/** A bundle of straw for the bricks, tied in the middle (figure units, carried across the arms). */
export const Straw = ({ x, y }: { x: number; y: number }) => (
  <g>
    {[-6, -3, 0, 3, 6].map((dy, i) => <path key={dy} d={`M${x - 30} ${y + dy * 1.3 + (i % 2 ? 1 : -1)} Q${x} ${y + dy * 0.6} ${x + 30} ${y + dy * 1.3 - (i % 2 ? 1 : -1)}`} stroke={i % 2 ? '#e8c45a' : '#f2d36e'} strokeWidth={4.4} fill="none" strokeLinecap="round" />)}
    {[-4, 2].map((dy) => <path key={dy} d={`M${x - 28} ${y + dy} Q${x} ${y + dy * 0.5} ${x + 28} ${y + dy}`} stroke="#c99a2e" strokeWidth={1.2} fill="none" />)}
    <rect x={x - 3} y={y - 10} width={6} height={20} rx={2.5} fill="#a0703f" />
  </g>
)

/** A little basket of bricks hanging from a hand (figure units; (x, y) = the hand). */
export const BrickBasket = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y + 4}) scale(1.35)`}>
    <path d="M-11 12 Q0 -7 11 12" stroke="#8a5428" strokeWidth={2.2} fill="none" />
    <rect x={-12} y={5} width={11} height={8} rx={1} fill="#c98a55" stroke="#8f5a32" strokeWidth={1.3} />
    <rect x={1} y={4} width={11} height={8} rx={1} fill="#cf9461" stroke="#8f5a32" strokeWidth={1.3} />
    <path d="M-15 12 L15 12 L12 28 L-12 28 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2} strokeLinejoin="round" />
    <path d="M-14 18 L14 18 M-13 23 L13 23" stroke="#8a5428" strokeWidth={1.3} />
  </g>
)

/** The king's sunshade: a striped cloth roof on two poles over a stone step. (x, y) = the middle of the step's top. */
export function Canopy({ x, y, w = 170, h = 175 }: { x: number; y: number; w?: number; h?: number }) {
  const l = x - w / 2, r = x + w / 2, t = y - h
  return (
    <g>
      <rect x={l - 10} y={y} width={w + 20} height={16} rx={3} fill="#e9d6b0" stroke="#bf9a62" strokeWidth={2.5} />
      <rect x={l - 22} y={y + 14} width={w + 44} height={14} rx={3} fill="#dcc396" stroke="#bf9a62" strokeWidth={2.5} />
      {[l + 8, r - 8].map((px) => <rect key={px} x={px - 4} y={t} width={8} height={h} fill="#c9963f" stroke="#8a6224" strokeWidth={2} />)}
      <path d={`M${l - 8} ${t} L${r + 8} ${t} L${r + 8} ${t + 18} ${Array.from({ length: 8 }, (_, i) => `Q${r + 8 - (i + 0.5) * ((w + 16) / 8)} ${t + 30} ${r + 8 - (i + 1) * ((w + 16) / 8)} ${t + 18}`).join(' ')} Z`} fill="#fbf3e2" stroke="#c9a46a" strokeWidth={2.5} strokeLinejoin="round" />
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={l - 8 + i * ((w + 16) / 5)} y={t} width={(w + 16) / 10} height={18} fill="#3a6fc4" opacity={0.85} />)}
      <path d={`M${l - 8} ${t} L${r + 8} ${t}`} stroke="#c9a46a" strokeWidth={3} />
    </g>
  )
}

/** Pharaoh's golden throne, seen from the front. (x, y) = the middle of its foot. */
export function Throne({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 48} y={y - 170} width={96} height={170} rx={12} fill="#f2c94c" stroke="#b8901c" strokeWidth={3} />
      <rect x={x - 36} y={y - 158} width={72} height={120} rx={8} fill="#3a6fc4" stroke="#24508f" strokeWidth={2.5} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${x - 36} ${y - 140 + i * 26} L${x + 36} ${y - 140 + i * 26}`} stroke="#f2c94c" strokeWidth={4} />)}
      <circle cx={x} cy={y - 178} r={12} fill="#f7d65a" stroke="#b8901c" strokeWidth={2.5} />
      <rect x={x - 60} y={y - 60} width={22} height={60} rx={5} fill="#e8b93a" stroke="#b8901c" strokeWidth={2.5} />
      <rect x={x + 38} y={y - 60} width={22} height={60} rx={5} fill="#e8b93a" stroke="#b8901c" strokeWidth={2.5} />
    </g>
  )
}

// ---------- Chariots far away, and the wind ----------

/** One little chariot far away: a horse pulling a cart with a big wheel and a driver. Facing right; (x, y) = the wheel's foot. */
export function TinyChariot({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* horse */}
      {[22, 26, 34, 38].map((lx) => <path key={lx} d={`M${lx} -9 L${lx + (lx % 4 ? 1 : -1)} 0`} stroke="#6b4a33" strokeWidth={1.8} strokeLinecap="round" />)}
      <ellipse cx={30} cy={-11} rx={10} ry={4.5} fill="#8a6650" />
      <path d="M37 -13 L42 -21 L46 -19 L41 -11 Z" fill="#8a6650" />
      <path d="M20 -12 Q16 -12 15 -7" stroke="#6b4a33" strokeWidth={1.6} fill="none" />
      {/* cart, driver and wheel */}
      <path d="M2 -16 L14 -16 L13 -7 L3 -7 Z" fill="#d9a843" stroke="#9a7224" strokeWidth={1.2} />
      <path d="M13 -11 L21 -11" stroke="#6b4a33" strokeWidth={1.3} />
      <rect x={6} y={-24} width={5} height={8} rx={2} fill="#c9b49a" />
      <circle cx={8.5} cy={-26.5} r={2.6} fill="#c68b5e" />
      <circle cx={6} cy={-5} r={5} fill="none" stroke="#6b4a33" strokeWidth={1.6} />
      <path d="M1 -5 L11 -5 M6 -10 L6 0" stroke="#6b4a33" strokeWidth={1} />
    </g>
  )
}

/** Pharaoh's chariots far, far away, in a little cloud of dust: tiny, and coming from the left. (x, y) = the ground under them. */
export function FarChariots({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill="#e9d2b0" opacity={0.85}>
        {[[-70, -8, 12], [-54, -15, 14], [-36, -11, 13], [-18, -17, 13], [0, -12, 13], [18, -17, 12], [36, -11, 12], [52, -15, 11], [-84, -4, 9], [66, -8, 9], [80, -5, 7]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}
      </g>
      <TinyChariot x={-58} y={0} />
      <TinyChariot x={-12} y={-3} />
      <TinyChariot x={34} y={1} />
    </g>
  )
}

/** Swirls of strong wind blowing across, from left to right. */
export function Wind({ spots, color = '#ffffff' }: { spots: [number, number, number?][]; color?: string }) {
  return (
    <g>
      {spots.map(([x, y, k = 1], i) => (
        <g key={i} className="rs-gust" style={{ animationDelay: `${(i * 0.55) % 2.6}s` }}>
          <g stroke="#9fc8f0" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.45}>
            <path d={`M${x} ${y} q${50 * k} -12 ${100 * k} 0 q${26 * k} 8 ${22 * k} -10 q-6 -12 -18 -4`} />
            <path d={`M${x + 20 * k} ${y + 18} q${40 * k} -8 ${80 * k} 0`} />
          </g>
          <path d={`M${x} ${y} q${50 * k} -12 ${100 * k} 0 q${26 * k} 8 ${22 * k} -10 q-6 -12 -18 -4`} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.95} />
          <path d={`M${x + 20 * k} ${y + 18} q${40 * k} -8 ${80 * k} 0`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      ))}
    </g>
  )
}

// ---------- Miriam's tambourine ----------

/** A tambourine: a round wooden frame with a drum skin, little gold jingles and bright ribbons. (x, y) = its middle. */
export function Tambourine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-4 14 Q-10 26 -4 36" stroke="#ff6fae" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M4 14 Q10 26 5 38" stroke="#2fb5a8" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M0 15 Q-2 26 2 32" stroke="#ffd34d" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <circle r={17} fill="#d99a52" stroke="#93602c" strokeWidth={2.4} />
      <circle r={12.5} fill="#fff1d6" stroke="#c9a06a" strokeWidth={1.6} />
      <path d="M-5 -2 a5 5 0 0 1 10 0 a5 5 0 0 1 -10 0" fill="none" stroke="#e8668a" strokeWidth={1.6} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a}) translate(0 -15)`}>
          <ellipse rx={4.4} ry={2.6} fill="#ffe27a" stroke="#c99a1c" strokeWidth={1.2} />
          <ellipse rx={1.4} ry={0.8} fill="#fff8d0" />
        </g>
      ))}
    </g>
  )
}

/** Miriam (or a dancer) with both arms up, shaking a tambourine in her raised hand (figure units, pose "arms-up"). */
export const TambourineUp = () => (
  <g className="rs-shake">
    <Tambourine x={48} y={-156} s={1.35} />
  </g>
)

// ---------- Backgrounds ----------

/** The desert: golden dunes far away and sand near. */
export function Desert({ far = '#f2d39a', near = '#e8bf7a' }: { far?: string; near?: string }) {
  return (
    <g>
      <path d="M0 300 Q160 272 320 294 Q520 264 800 290 L800 450 L0 450 Z" fill={far} />
      <path d="M0 352 Q240 326 480 350 T800 342 L800 450 L0 450 Z" fill={near} />
    </g>
  )
}

/** A sandy beach in front, from the water's edge (y) down. */
export function Beach({ y = 340, edge = true }: { y?: number; edge?: boolean }) {
  return (
    <g>
      <path d={`M-10 ${y} Q200 ${y - 14} 400 ${y} T810 ${y - 4} L810 460 L-10 460 Z`} fill="#f3d9a2" stroke={edge ? '#ffffff' : 'none'} strokeWidth={edge ? 5 : 0} strokeOpacity={0.8} />
      <path d={`M-10 ${y + 50} Q240 ${y + 30} 480 ${y + 52} T810 ${y + 44} L810 460 L-10 460 Z`} fill="#ecca88" opacity={0.7} />
    </g>
  )
}

/** A calm sea out to the horizon, at `y`, from x1 to x2. */
export function CalmSea({ y, x1 = 0, x2 = 800, color = '#5bb8ea' }: { y: number; x1?: number; x2?: number; color?: string }) {
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={460 - y} fill={color} />
      <path d={`M${x1} ${y + 22}${waves(x1, x2, 4, 40)} L${x2} ${y + 40} L${x1} ${y + 40} Z`} fill={lighten(color, 0.18)} opacity={0.7} />
      {[[x1 + 60, y + 30], [x1 + 200, y + 60], [x1 + 330, y + 40], [x1 + 140, y + 92]].filter(([wx]) => wx < x2 - 30).map(([wx, wy], i) => (
        <path key={i} d={`M${wx} ${wy} q10 -6 20 0`} stroke="#fff" strokeWidth={2.5} fill="none" opacity={0.75} strokeLinecap="round" />
      ))}
    </g>
  )
}

/** A heart that bobs gently. */
export function Heart({ x, y, s = 1, color = '#ff7fae' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g className="rs-bob">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 16 C-24 2 -26 -14 -14 -19 C-7 -22 -2 -17 0 -11 C2 -17 7 -22 14 -19 C26 -14 24 2 0 16 Z" fill={color} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={-10} cy={-10} rx={4} ry={2.4} fill="#fff" opacity={0.65} transform="rotate(-35 -10 -10)" />
      </g>
    </g>
  )
}

/** Music notes floating up (everyone singing). */
export function Notes({ spots }: { spots: [number, number, string?][] }) {
  return (
    <g>
      {spots.map(([x, y, color = '#8a6ad8'], i) => (
        <g key={i} className="rs-note" style={{ animationDelay: `${(i * 0.6) % 3}s` }}>
          <g transform={`translate(${x} ${y})`} fill={color} stroke={ink(color)} strokeWidth={1.5}>
            {i % 2 ? (
              <>
                <ellipse cx={-6} cy={8} rx={6} ry={4.5} transform="rotate(-20 -6 8)" />
                <ellipse cx={10} cy={4} rx={6} ry={4.5} transform="rotate(-20 10 4)" />
                <path d="M-1 7 L-1 -16 L15 -20 L15 3" fill="none" strokeWidth={3} stroke={color} />
              </>
            ) : (
              <>
                <ellipse cx={0} cy={8} rx={6.5} ry={5} transform="rotate(-20 0 8)" />
                <path d="M5.5 6 L5.5 -16 Q12 -12 14 -6" fill="none" strokeWidth={3} stroke={color} />
              </>
            )}
          </g>
        </g>
      ))}
    </g>
  )
}
