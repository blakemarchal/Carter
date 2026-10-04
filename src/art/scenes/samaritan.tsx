// The Good Samaritan (Luke 10:25–37): one picture per story page, both parts in order (see data/samaritan.ts for
// the words). Part one (pages 1 to 6): a man asks Jesus, "Who is my neighbor?"; the man hurt by the road; the priest
// and the temple helper go by on the other side; the Samaritan stops, bandages him and lifts him onto his donkey.
// (The island's game, art/games/samaritan.tsx, then leads them along the road to the inn.) Part two (pages 7 to 11):
// the inn at evening, the long night of care, the two coins in the morning, Jesus' question, and what it means.
//
// The road pictures (pages 3 to 6) are one place seen at different times: the road runs across the middle, the hurt
// man sits by a rock on the near side, and whoever passes by keeps to the far side. Kept gentle: the robbers are only
// tiny and far away, running off with his bag (page 2); the hurt man is sad, with a scrape and a torn sleeve, never in
// pain and never bleeding, and from page 6 he wears white bandages. The priest and the temple helper are ordinary,
// busy people, never villains. The Samaritan looks different by his clothes alone: a striped saffron head cloth and
// a teal robe.
//
// New people (for PEOPLE in people.tsx, later), all exported from here: LAWYER, TRAVELER, PRIEST, TEMPLE_HELPER,
// SAMARITAN and INNKEEPER. The traveler, the priest, the temple helper and the Samaritan are in the activities' pictures
// too, so their looks (and the hurts, bandages, faces and head cloth drawn over them) live in art/items/isl-samaritan.tsx.
// The donkey is the kit's (Donkey, scenes/kit.tsx, first drawn for the Baby Jesus island), with the Samaritan's striped
// saddle blanket and bag, a halter and lead rope, the hurt man riding it (bandaged), and legs that walk (SamaritansDonkey).
// God is never drawn as a person: His love is light (page 11).
import { useId, type ComponentProps, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Figure, Kneel, Person, PEOPLE, Sitting, SittingOnRock, SKIN, type Look } from '../people'
import { Birds, Cloud, Donkey, Dream, Glow, Heart, Moon, Palm, Rays, Rock, Scene, Sparkles, Sun, Tap } from './kit'
import {
  Bandages, HelperWalking, Hurry, Hurts, LEFT_ARM, PriestWalking, SadFace, SamaritanCloth, SAMARITAN, TRAVELER,
} from '../items/isl-samaritan'
import './samaritan.css'

type Pt = [number, number]
const f1 = (n: number) => n.toFixed(1)
const gid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

// ---------- The people ----------

/** The man who asks Jesus, "Who is my neighbor?" He knew God's law well: a long gray beard, a cream head cloth, a plum robe and a gold sash; he carries a scroll. */
export const LAWYER: Look = { skin: SKIN.light, hair: 'covered', hairColor: '#6b6560', wrap: '#efe5cf', beard: 'long', beardColor: '#a8a29a', robe: '#6a4f8f', sash: '#e0b45a' }
// (The traveler, the priest, the temple helper and the Samaritan are drawn in the activities too, so their looks, and
// the hurts, bandages, faces and head cloth drawn over them, are in art/items/isl-samaritan.tsx; they're exported again
// here with the island's other people.)
export { PRIEST, SAMARITAN, TEMPLE_HELPER, TRAVELER } from '../items/isl-samaritan'
/** The innkeeper: curly black hair and a short beard, a brick-red robe, and a cream apron (draw Apron over him). */
export const INNKEEPER: Look = { skin: SKIN.deep, hair: 'curly', hairColor: '#241a16', beard: 'short', beardColor: '#241a16', robe: '#c4663f', sash: '#f2d38a' }

/** People listening to Jesus (pages 1, 10 and 11). */
const FOLK = {
  mom: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8875a', robe: '#6fb7b0', sash: '#f5f0e6' },
  grandma: { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#f5f0e6', robe: '#c98aa8', sash: '#f0d38a' },
  girl: { skin: SKIN.medium, hair: 'pigtails', hairColor: '#3b2a20', robe: '#ffb347', sash: '#ffffff', bow: '#ff6f91', build: 'child' },
  boy: { skin: SKIN.deep, hair: 'curly', hairColor: '#2b1f18', robe: '#7cb06a', sash: '#e6b85a', build: 'child' },
  little: { skin: SKIN.tan, hair: 'short', hairColor: '#5a3a24', robe: '#5fb7ff', sash: '#ffffff', build: 'child' },
  traveler: { skin: SKIN.light, hair: 'covered', hairColor: '#5a3a24', wrap: '#a9c8ec', beard: 'short', beardColor: '#7a5a3a', robe: '#b0896a', sash: '#6b8f5a' },
} satisfies Record<string, Look>

/** The innkeeper's cream apron, tied at the waist (below the sash's top). */
export const Apron = () => (
  <g>
    <path d="M-23 -49 Q0 -43 23 -49 L27 -12 Q0 -6 -27 -12 Z" fill="#f7efdc" stroke="#c9b993" strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-10 -36 Q0 -33 10 -36 L10 -24 Q0 -21 -10 -24 Z" fill="none" stroke="#d9cba8" strokeWidth={1.6} strokeLinejoin="round" />
  </g>
)

// ---------- Things they carry ----------

/** A little clay jar of oil with a stopper. (x, y): its foot. */
export function OilJar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={13} ry={3} fill="#000" opacity={0.12} />
      <path d="M-5 -30 L5 -30 L5 -25 Q14 -20 13 -9 Q12 0 0 0 Q-12 0 -13 -9 Q-14 -20 -5 -25 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={2} />
      <path d="M-11 -12 Q0 -8 11 -12" stroke="#f2c08a" strokeWidth={2.2} fill="none" />
      <rect x={-4.5} y={-36} width={9} height={7} rx={2.5} fill="#a8774a" stroke="#6b4422" strokeWidth={1.5} />
      <ellipse cx={-6} cy={-16} rx={2.4} ry={4.5} fill="#fff" opacity={0.3} />
    </g>
  )
}

/** A wide clay bowl of clean water, a white cloth hanging over its rim (for washing the hurts). (x, y): its foot. */
export function WashBowl({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={1} rx={25} ry={3.5} fill="#000" opacity={0.12} />
      <path d="M-23 -14 L23 -14 Q21 -1 0 0 Q-21 -1 -23 -14 Z" fill="#c98448" stroke="#7a4a2a" strokeWidth={2} />
      <path d="M-18 -7 Q0 -3 18 -7" stroke="#e8a86a" strokeWidth={2.2} fill="none" />
      <ellipse cx={0} cy={-14} rx={23} ry={5.4} fill="#8fd0f2" stroke="#7a4a2a" strokeWidth={2} />
      <path d="M-12 -15.4 q4 -2 8 0 M2 -13 q3 -1.6 6 0" stroke="#ffffff" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M11 -20 Q19 -22 25 -16 L27 -3 Q23 -1 20 -4 L19 -13 Q16 -15.5 11 -16.5 Z" fill="#fffdf6" stroke="#bdb5a6" strokeWidth={1.6} />
      <path d="M22 -14 L23.4 -5" stroke="#e6e0d2" strokeWidth={1.2} strokeLinecap="round" />
    </g>
  )
}

/** A silver coin, seen face on, with a little head on it and a shine. (x, y): its middle; r: its size. */
export function Coin({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  const k = r / 10
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r={10} fill="#d9dde6" stroke="#8c93a3" strokeWidth={1.8} />
      <circle r={7.2} fill="none" stroke="#aeb4c2" strokeWidth={1.1} />
      <path d="M-2.6 3.6 Q-4.4 -0.4 -2 -3.6 Q1 -5.6 3.2 -3 Q4.2 -1 2.6 0.6 L3.4 2 L1.6 2.4 Q0.6 4 -2.6 3.6 Z" fill="#b9bfcc" />
      <path d="M-5.6 -6 Q-2 -8.6 2.4 -8" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  )
}

/** A clay oil lamp with a little flame (and its glow, `lit`). (x, y): its foot. */
export function ClayLamp({ x, y, s = 1, lit = true }: { x: number; y: number; s?: number; lit?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      {lit && <Glow x={4} y={-16} r={46} color="#ffe39a" />}
      <path d="M-12 -2 Q-13 -9 -4 -10 L10 -10 Q16 -10 18 -7 L13 -5 Q10 -1 2 0 L-8 0 Q-12 0 -12 -2 Z" fill="#c98a5a" stroke="#7a4a2a" strokeWidth={1.8} />
      <ellipse cx={0} cy={-9.6} rx={5} ry={1.6} fill="#5a3a24" />
      {lit && <g className="pa-twinkle"><path d="M16 -9 Q21 -16 17 -23 Q12 -15 16 -9 Z" fill="#ffb347" /><path d="M16.4 -10.5 Q18.6 -14 16.8 -18 Q14.6 -14 16.4 -10.5 Z" fill="#fff3b0" /></g>}
    </g>
  )
}

/** A clay bowl of warm soup, steam rising. (x, y): its middle. */
function SoupBowl({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      {[-5, 4].map((sx, i) => (
        <g key={sx} className="sm-steam" style={{ animationDelay: `${i * 1.1}s` } as CSSProperties}>
          <path d={`M${sx} -9 q-3 -4 0 -8 q3 -4 0 -8`} stroke="#ffffff" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />
        </g>
      ))}
      <path d="M-13 -5 L13 -5 Q12 6 0 7 Q-12 6 -13 -5 Z" fill="#c98448" stroke="#7a4a2a" strokeWidth={1.8} />
      <ellipse cx={0} cy={-5} rx={13} ry={3.4} fill="#e8a64a" stroke="#7a4a2a" strokeWidth={1.6} />
      <circle cx={-4} cy={-5.4} r={1.4} fill="#7fae4a" /><circle cx={3.6} cy={-4.8} r={1.6} fill="#d96a3a" />
    </g>
  )
}

/** A small roll of white bandage cloth lying on its side, its loose end trailing along the ground, frayed. (x, y): its foot. */
function BandageRoll({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const cloth = '#fffdf6', line = '#b9b1a2'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={-10} cy={1} rx={26} ry={2.6} fill="#000" opacity={0.1} />
      <path d="M-8 -2 Q-21 -4 -33 0 L-34 4.5 Q-21 1.6 -8 3 Z" fill={cloth} stroke={line} strokeWidth={1.4} />
      <path d="M-34 1 l-3 -1 M-34 3.6 l-3 1" stroke={line} strokeWidth={1.1} />
      <path d="M-12 -16 L5 -16 A6.5 8 0 0 1 5 0 L-12 0 A6.5 8 0 0 1 -12 -16 Z" fill={cloth} stroke={line} strokeWidth={1.6} />
      <path d="M-6 -15.5 A5 7.6 0 0 1 -6 -0.5 M0 -15.5 A5 7.6 0 0 1 0 -0.5" stroke="#e6e0d2" strokeWidth={1.1} fill="none" />
      <ellipse cx={5} cy={-8} rx={6.5} ry={8} fill="#f6f1e6" stroke={line} strokeWidth={1.6} />
      <ellipse cx={5} cy={-8} rx={3.6} ry={4.6} fill="none" stroke="#d9d1c2" strokeWidth={1.1} />
    </g>
  )
}

/** A clay cup. (x, y): its foot. */
const Cup = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <path d="M-7 -14 L7 -14 L5.5 0 L-5.5 0 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={1.6} />
    <ellipse cx={0} cy={-14} rx={7} ry={2} fill="#7fc4e8" stroke="#8a4a2a" strokeWidth={1.2} />
  </g>
)

/** A tall clay water jug. (x, y): its foot. */
const Jug = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <path d="M-5 -36 L5 -36 L6 -30 Q16 -22 15 -10 Q14 0 0 0 Q-14 0 -15 -10 Q-16 -22 -6 -30 Z" fill="#c9805a" stroke="#7a4a2a" strokeWidth={1.8} />
    <path d="M6 -30 Q16 -32 15 -20" stroke="#7a4a2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <path d="M-12 -14 Q0 -10 12 -14" stroke="#ebb88a" strokeWidth={2} fill="none" />
  </g>
)

/** A friendly question mark in a little round bubble (someone asking). (x, y): its middle. */
const Asking = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={-14} cy={22} r={3.5} fill="#fff" stroke="#c9b8d8" strokeWidth={2} />
      <circle r={19} fill="#fff" stroke="#c9b8d8" strokeWidth={2.6} />
      <path d="M-6 -6 Q-6 -13 1 -13 Q8 -13 8 -6.5 Q8 -2 2 0.5 L1.6 4.5" stroke="#8a5bb0" strokeWidth={4.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={1.6} cy={11} r={2.6} fill="#8a5bb0" />
    </g>
  </g>
)

/** His scroll, tucked into his sash (in a Person's units). */
const TuckedScroll = () => (
  <g transform="translate(10 -52) rotate(-20)">
    <rect x={-12} y={-7} width={24} height={14} rx={3} fill="#fff3d6" stroke="#c9a46a" strokeWidth={1.8} />
    <circle cx={-12} cy={0} r={4.4} fill="#c9a46a" /><circle cx={12} cy={0} r={4.4} fill="#c9a46a" />
  </g>
)

/** A round, domed loaf of bread with scored marks on top (held up on a hand). (x, y): its middle. */
const Loaf = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
    <path d="M-17 6 Q-19 -12 0 -13 Q19 -12 17 6 Q0 10 -17 6 Z" fill="#e0a75e" stroke="#a8702c" strokeWidth={2.4} />
    <path d="M-9 -4 q4 -5 8 0 M2 -5 q4 -5 8 0" stroke="#a8702c" strokeWidth={1.8} fill="none" />
    <ellipse cx={-7} cy={-7} rx={4} ry={2} fill="#fff" opacity={0.35} transform="rotate(-20 -7 -7)" />
  </g>
)

// ---------- The land: the long, rocky road down from Jerusalem to Jericho ----------

/** A steady, made-up shuffle (the same picture every time). */
function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

/** A smooth curve through the points (Catmull-Rom), as path commands starting with M. */
function smooth(points: Pt[]): string {
  let d = `M${f1(points[0][0])} ${f1(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] ?? p2
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`
  }
  return d
}

/** The dusty road through the points [x, y, half its width] (narrow far away, wide up close), pebbles along its edges. */
export function RockyRoad({ pts, color = '#efdcb4', edge = '#c9a670', seed = 3 }: { pts: [number, number, number][]; color?: string; edge?: string; seed?: number }) {
  const n = pts.length
  const nrm = (i: number): Pt => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1
    return [-dy / len, dx / len]
  }
  const side = (sg: number) => pts.map(([x, y, w], i): Pt => { const [nx, ny] = nrm(i); return [x + nx * w * sg, y + ny * w * sg] })
  const d = `${smooth(side(1))} ${smooth(side(-1).reverse()).replace(/^M/, 'L')} Z`
  const r = rng(seed)
  const pebbles: [number, number, number][] = []
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0, w0] = pts[i], [x1, y1, w1] = pts[i + 1]
    const [nx, ny] = nrm(i)
    for (let k = 0; k < 3; k++) {
      const t = r(), sg = r() < 0.5 ? -1 : 1, w = w0 + (w1 - w0) * t
      const off = sg * w * (0.72 + r() * 0.34)
      pebbles.push([x0 + (x1 - x0) * t + nx * off, y0 + (y1 - y0) * t + ny * off, Math.max(1.2, w / 12) * (0.7 + r() * 0.6)])
    }
  }
  return (
    <g>
      <path d={d} fill={color} stroke={edge} strokeWidth={3} strokeLinejoin="round" />
      <path d={smooth(pts.map(([x, y]) => [x, y]))} stroke={lighten(color, 0.45)} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.55} strokeDasharray="22 18" />
      {pebbles.map(([px, py, pr], i) => <ellipse key={i} cx={f1(px)} cy={f1(py)} rx={f1(pr * 1.4)} ry={f1(pr)} fill="#cdbb98" stroke="#a8936c" strokeWidth={1} />)}
    </g>
  )
}

/** Dusty footprints along the points (someone walked here), left and right in turn. */
function Footprints({ pts, s = 1 }: { pts: Pt[]; s?: number }) {
  return (
    <g fill="#b8935e" opacity={0.6}>
      {pts.map(([x, y], i) => {
        const [nx, ny] = pts[Math.min(pts.length - 1, i + 1)], [px, py] = pts[Math.max(0, i - 1)]
        const deg = (Math.atan2(ny - py, nx - px) * 180) / Math.PI
        return <ellipse key={i} cx={0} cy={0} rx={5.4 * s} ry={2.5 * s} transform={`translate(${f1(x)} ${f1(y + (i % 2 ? 3.4 : -3.4) * s)}) rotate(${f1(deg)})`} />
      })}
    </g>
  )
}

/** A low, scrubby desert bush. (x, y): its foot. */
function Scrub({ x, y, s = 1, color = '#9aa65a' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill={color} stroke={ink(color)} strokeWidth={2}>
        <ellipse cx={-10} cy={-8} rx={11} ry={8} />
        <ellipse cx={10} cy={-8} rx={12} ry={8.5} />
        <ellipse cx={0} cy={-14} rx={11} ry={9} />
      </g>
      <path d="M-6 -12 q3 -3 6 0 M4 -9 q3 -3 6 0" stroke={lighten(color, 0.3)} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A little lizard sunning itself (facing right). (x, y): where it sits. */
function Lizard({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const c = '#b9b06a'
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} strokeLinejoin="round">
      <path d="M-14 -3 Q-26 -2 -32 4 Q-24 0 -14 1 Z" fill={c} stroke={ink(c)} strokeWidth={1.4} />
      {[[-8, 1], [6, 1]].map(([lx, ly]) => <path key={lx} d={`M${lx} ${ly - 3} l-3 5 l-3 0 M${lx + 2} ${ly - 3} l3 5 l3 0`} stroke={ink(c)} strokeWidth={1.6} fill="none" strokeLinecap="round" />)}
      <ellipse cx={-2} cy={-3} rx={13} ry={4.6} fill={c} stroke={ink(c)} strokeWidth={1.6} />
      <ellipse cx={13} cy={-5} rx={6.4} ry={4.2} fill={c} stroke={ink(c)} strokeWidth={1.6} />
      <circle cx={15} cy={-6.4} r={1.5} fill="#2b2140" />
      <circle cx={14.6} cy={-6.9} r={0.5} fill="#fff" />
      {[-8, -2, 4].map((dx) => <circle key={dx} cx={dx} cy={-4.4} r={1.1} fill={darken(c, 0.15)} />)}
    </g>
  )
}

/** Grass tufts: [x, y] each (the ground at y). */
const Tufts = ({ spots, color = '#4f9a4a' }: { spots: [number, number][]; color?: string }) => (
  <g stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round">
    {spots.map(([tx, ty]) => <path key={`${tx},${ty}`} d={`M${tx} ${ty} l-4 -10 M${tx + 5} ${ty} l1 -13 M${tx + 10} ${ty} l5 -9`} />)}
  </g>
)

/** The colors of the wild land in the light of the time of day: far, middle and near hills, and their lines. */
const LAND = {
  day: ['#e9d4ae', '#dcbb87', '#cfa872', '#b8915a'],
  late: ['#ebcaa0', '#dfb27c', '#d2a068', '#b4844e'],
  dusk: ['#c6a3b0', '#c79a7c', '#b98a62', '#9a6e48'],
  morning: ['#efd9b8', '#e2c290', '#d4ae78', '#bc955e'],
} as const
export type LandTime = keyof typeof LAND

/** The wild, rocky hills on the way to Jericho: far, middle and near, with rocky ridges. `children` (a road, a far town) go on top. */
export function Wilderness({ time = 'day', far = 'M0 238 Q90 204 190 224 Q290 190 400 216 Q520 186 630 212 Q720 192 800 208 L800 450 L0 450 Z', mid = 'M0 290 Q150 254 300 280 Q470 248 640 274 Q730 260 800 268 L800 450 L0 450 Z', near = 'M0 352 Q200 330 420 350 T800 342 L800 450 L0 450 Z', children }: {
  time?: LandTime; far?: string; mid?: string; near?: string; children?: ReactNode
}) {
  const [a, b, c, line] = LAND[time]
  return (
    <g>
      <path d={far} fill={a} />
      <path d="M120 214 l14 -8 l10 6 M330 204 l16 -9 l12 7 M560 200 l12 -7 l14 8 M700 202 l10 -6 l12 6" stroke={darken(a, 0.12)} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <path d={mid} fill={b} />
      <path d="M60 282 l18 -10 l14 8 M250 270 l14 -8 l16 9 M500 262 l18 -9 l12 7 M700 268 l14 -8 l10 6" stroke={darken(b, 0.12)} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <path d={near} fill={c} />
      <path d="M40 412 q10 -4 20 0 M300 432 q12 -5 24 0 M610 424 q10 -4 20 0 M720 438 q12 -5 24 0" stroke={line} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.6} />
      {children}
    </g>
  )
}

/** A soft sky, top to bottom (over the Scene's own, for the times of day it doesn't have). */
function Sky({ top, bottom }: { top: string; bottom: string }) {
  const id = `sk${gid(useId())}`
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient></defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
    </g>
  )
}

/** Jerusalem far away on its hill: the city wall with towers, little houses, and God's temple shining in the middle. (x, y): the middle of the hill's foot. */
export function Jerusalem({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wall = '#efe2c4', line = '#b9a276'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <path d="M-150 14 Q-100 -22 -60 -36 Q0 -54 60 -36 Q100 -22 150 14 Z" fill={LAND.day[0]} />
      <path d="M-96 -18 Q-60 -34 -20 -40" stroke="#efdcba" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
      {/* houses peeking over the wall */}
      {[[-52, -62, 18], [-30, -66, 16], [32, -64, 18], [52, -60, 14]].map(([hx, hy, w]) => (
        <rect key={hx} x={hx - w / 2} y={hy} width={w} height={22} fill="#f4e8cc" stroke={line} strokeWidth={1.2} />
      ))}
      {/* the temple */}
      <rect x={-18} y={-92} width={36} height={52} fill="#fbf7ee" stroke={line} strokeWidth={1.6} />
      <rect x={-21} y={-96} width={42} height={6} fill="#f0d68a" stroke="#c9a040" strokeWidth={1.2} />
      <rect x={-6} y={-70} width={12} height={22} rx={6} fill="#e8c25a" stroke="#c9a040" strokeWidth={1.2} />
      {/* the wall and its towers */}
      <rect x={-74} y={-48} width={148} height={30} fill={wall} stroke={line} strokeWidth={1.6} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-72 + i * 12.4} y={-53} width={6} height={6} fill={wall} stroke={line} strokeWidth={1} />)}
      {[-74, 74].map((tx) => (
        <g key={tx}>
          <rect x={tx - 10} y={-64} width={20} height={46} fill={wall} stroke={line} strokeWidth={1.6} />
          <rect x={tx - 12} y={-68} width={24} height={6} fill={wall} stroke={line} strokeWidth={1.2} />
        </g>
      ))}
      <path d="M-8 -18 L-8 -32 Q0 -40 8 -32 L8 -18 Z" fill="#8a6a42" />
    </g>
  )
}

/** Jericho far away down in the valley: a green spot of palm trees and little flat-roofed houses. (x, y): its middle on the ground. */
function JerichoFar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={70} ry={10} fill="#9fc46a" />
      {[[-26, -2, 22], [-4, -1, 18], [16, -3, 20]].map(([hx, hy, w]) => (
        <g key={hx}>
          <rect x={hx - w / 2} y={hy - w * 0.7} width={w} height={w * 0.7} fill="#f2e2c0" stroke="#c9a46a" strokeWidth={1.4} />
          <rect x={hx - 2.5} y={hy - 8} width={5} height={8} fill="#a8804a" />
        </g>
      ))}
      <Palm x={-48} y={2} s={0.3} />
      <Palm x={40} y={2} s={0.34} />
      <Palm x={58} y={4} s={0.26} />
    </g>
  )
}

/** A robber far away, running off to the right (tiny: about 40 tall at s = 1). `bag`: carrying the traveler's bag. */
function Robber({ x, y, s = 1, color, bag }: { x: number; y: number; s?: number; color: string; bag?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round" strokeLinejoin="round">
      <g className="sm-puff"><circle cx={-14} cy={-3} r={4} fill="#e8d3ae" /></g>
      <path d="M-2 -15 L-10 -6 L-13 -7" stroke="#4a3a2e" strokeWidth={3.4} fill="none" />
      <path d="M3 -15 L9 -5 L14 -5" stroke="#4a3a2e" strokeWidth={3.4} fill="none" />
      <path d="M-5 -31 Q3 -35 8 -30 L9 -14 Q1 -11 -7 -14 Z" fill={color} stroke={ink(color)} strokeWidth={1.4} />
      <path d="M-2 -28 L-10 -21" stroke={color} strokeWidth={3.6} />
      <path d="M6 -28 L13 -22" stroke={color} strokeWidth={3.6} />
      {bag && (
        <g>
          <path d="M-4 -29 Q-10 -38 -18 -36" stroke="#8a5a2e" strokeWidth={1.6} fill="none" />
          <path d="M-24 -40 Q-14 -44 -12 -36 Q-12 -28 -20 -28 Q-28 -29 -27 -35 Q-27 -38 -24 -40 Z" fill="#c98a4a" stroke="#7a4a22" strokeWidth={1.4} />
        </g>
      )}
      <circle cx={6} cy={-37} r={5} fill="#c68b5e" stroke="#8a5a3a" strokeWidth={1} />
      <path d="M1 -38 Q2 -44 7 -43.5 Q12 -43 11.5 -38 Q7 -41 1 -38 Z" fill="#3f3530" />
    </g>
  )
}

/** The rock by the roadside where the hurt man sits. */
const RoadRock = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => <Rock x={x} y={y} s={s} />

// ---------- The donkey ----------

/** The saffron stripe across the Samaritan's saddle blanket (like his head cloth). */
const SAFFRON = '#f0b44a'

/**
 * The Samaritan's donkey: the kit's Donkey, with a saffron stripe across its red saddle blanket (like his head cloth)
 * and his woven bag hanging at its side. `walk`: its legs step (sm-leg, in samaritan.css: in the game). The rest as
 * for Donkey.
 */
function SamaritansDonkey({ walk, ...p }: Omit<ComponentProps<typeof Donkey>, 'walk' | 'bags' | 'blanketStripe'> & { walk?: boolean }) {
  return <Donkey {...p} bags blanketStripe={SAFFRON} walk={walk ? 'sm-leg' : undefined} />
}

/** The hurt man riding the donkey: bandaged, and smiling now (in a Person's units, for the donkey's `riderKids`). */
export const RiderBandaged = () => <Bandages arm={LEFT_ARM.hold} />

/**
 * On the way to the inn: the donkey with the hurt man riding it (bandaged), and the Samaritan walking ahead of it,
 * holding its lead rope. Facing right; (x, y): the donkey's hooves. At s = 1 it reaches from 70 behind to 190 ahead.
 * `walk`: they step along (in the game).
 */
export function OnTheWay({ x, y, s = 1, walk, blinkDelay = 0 }: { x: number; y: number; s?: number; walk?: boolean; blinkDelay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <SamaritansDonkey x={0} y={0} rider={TRAVELER} riderKids={<RiderBandaged />} lead={[124, -40]} walk={walk} blinkDelay={blinkDelay} />
      <g className={walk ? 'sm-walk' : undefined}>
        <Person x={152} y={4} look={SAMARITAN} blinkDelay={blinkDelay + 1.3}><SamaritanCloth /></Person>
      </g>
    </g>
  )
}

// ---------- The inn ----------

/** Where things are on the inn, in its own units (origin: the middle of its front on the ground). */
export const INN = {
  /** The door: its middle, width and height. */
  door: { x: 0, w: 52, h: 104 },
  /** The middle window upstairs (someone can look out of it): its middle, and its size. */
  window: { x: 0, y: -150, w: 58, h: 56 },
}

/**
 * The inn: a big two-floor house of mud brick where travelers stay, with a flat roof, an arched door standing open, and
 * windows that glow when the lamps are lit (`lit`, 0 to 1); a lamp stands on a little shelf beside the door (`lamp`:
 * false leaves it out, when someone will stand there). A courtyard wall runs off to the right, a palm behind it.
 * (x, y): the middle of its front on the ground; at s = 1 it's about 380 wide and 210 tall.
 * `atWindow` is drawn in the middle window upstairs (in the inn's units, clipped to the window).
 */
export function Inn({ x, y, s = 1, lit = 0, lamp = true, atWindow }: { x: number; y: number; s?: number; lit?: number; lamp?: boolean; atWindow?: ReactNode }) {
  const uid = gid(useId())
  const wall = useShade('#e4c592', 0.2, 0.16)
  const line = '#b08a55'
  const glass = (k: number) => (k > 0.5 ? '#ffd76a' : k > 0 ? '#e8b05a' : '#5a3a24')
  const glow = Math.max(0, Math.min(1, lit))
  const W = INN.window
  const archWin = (wx: number, top: number, w: number, h: number) => `M${wx - w / 2} ${top + h} L${wx - w / 2} ${top + w / 2} Q${wx - w / 2} ${top} ${wx} ${top} Q${wx + w / 2} ${top} ${wx + w / 2} ${top + w / 2} L${wx + w / 2} ${top + h} Z`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <defs>
        {wall.def}
        <clipPath id={`iw${uid}`}><path d={archWin(W.x, W.y - W.h / 2, W.w, W.h)} /></clipPath>
        <radialGradient id={`id${uid}`} cx="50%" cy="70%" r="70%"><stop offset="0" stopColor="#fff1c0" /><stop offset="0.6" stopColor="#ffc95e" /><stop offset="1" stopColor="#c9822e" /></radialGradient>
      </defs>
      <ellipse cx={20} cy={2} rx={210} ry={9} fill="#000" opacity={0.1} />
      {/* the courtyard wall, and a palm tree behind it */}
      <Palm x={206} y={-40} s={0.8} />
      <rect x={118} y={-60} width={122} height={60} fill="#dcb880" stroke={line} strokeWidth={2.5} />
      <rect x={114} y={-68} width={130} height={10} rx={2} fill="#c99e66" stroke={line} strokeWidth={2} />
      <path d="M150 -30 l18 0 M190 -44 l16 0 M210 -18 l14 0" stroke="#c39a62" strokeWidth={1.6} strokeLinecap="round" />
      {/* the house */}
      <rect x={-142} y={-196} width={262} height={196} fill={wall.fill} stroke={line} strokeWidth={3} />
      <rect x={-148} y={-210} width={274} height={16} rx={3} fill="#cfa66a" stroke={line} strokeWidth={2.5} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-132 + i * 18.6} cy={-186} r={3} fill="#8a6040" />)}
      <path d="M-142 -98 L120 -98" stroke="#cfae78" strokeWidth={5} opacity={0.7} />
      {[[-110, -60], [-40, -130], [70, -40], [96, -160], [-118, -170], [30, -112]].map(([bx, by], i) => (
        <path key={i} d={`M${bx - 10} ${by} l20 0 M${bx - 4} ${by + 7} l18 0`} stroke="#c9a46a" strokeWidth={1.6} strokeLinecap="round" />
      ))}
      {/* windows: two downstairs, three upstairs (someone may look out of the middle one) */}
      {[[-92, -76], [74, -76], [-92, -172], [82, -172]].map(([wx, top]) => (
        <path key={`${wx}${top}`} d={archWin(wx, top, 26, 32)} fill={glass(glow)} stroke={line} strokeWidth={2.4} />
      ))}
      <path d={archWin(W.x, W.y - W.h / 2, W.w, W.h)} fill={glow > 0 ? glass(glow) : '#6b4a30'} stroke={line} strokeWidth={2.6} />
      {atWindow && <g clipPath={`url(#iw${uid})`}>{atWindow}</g>}
      <rect x={W.x - W.w / 2 - 5} y={W.y + W.h / 2 - 2} width={W.w + 10} height={7} rx={2} fill="#c99e66" stroke={line} strokeWidth={1.8} />
      {glow > 0 && [[-92, -60], [74, -60], [-92, -156], [82, -156], [W.x, W.y]].map(([gx, gy]) => <circle key={`${gx}${gy}`} cx={gx} cy={gy} r={30} fill="#ffd970" opacity={0.22 * glow} />)}
      {/* the door, standing open, warm inside */}
      <path d="M-26 0 L-26 -78 Q-26 -104 0 -104 Q26 -104 26 -78 L26 0 Z" fill={glow > 0 ? `url(#id${uid})` : '#4a3020'} stroke={line} strokeWidth={3} />
      <path d="M-26 -2 L-26 -90 L-40 -84 L-40 -6 Z" fill="#8a5a32" stroke="#5a3a20" strokeWidth={2} />
      <path d="M-33 -84 L-33 -6" stroke="#6b4422" strokeWidth={1.4} />
      <rect x={-30} y={-2} width={60} height={6} rx={2} fill="#c9a46a" stroke={line} strokeWidth={1.6} />
      {/* the lamp by the door, on a little shelf */}
      {lamp && (
        <g>
          <rect x={-66} y={-98} width={20} height={5} rx={1.5} fill="#8a6040" />
          <ClayLamp x={-58} y={-98} s={0.7} lit={glow > 0} />
        </g>
      )}
    </g>
  )
}

// ---------- Places ----------

/** A little house far away (x, y: the middle of its foot): flat-roofed, with a door and a window. */
const FarHouse = ({ x, y, w = 34 }: { x: number; y: number; w?: number }) => (
  <g>
    <rect x={x - w / 2} y={y - w * 0.72} width={w} height={w * 0.72} fill="#e2c9a0" stroke="#b39468" strokeWidth={2} />
    <rect x={x - w / 2 - 2} y={y - w * 0.72 - 4} width={w + 4} height={5} rx={1.5} fill="#c9a87a" stroke="#b39468" strokeWidth={1.2} />
    <path d={`M${x - w * 0.3} ${y} L${x - w * 0.3} ${y - w * 0.32} Q${x - w * 0.19} ${y - w * 0.44} ${x - w * 0.08} ${y - w * 0.32} L${x - w * 0.08} ${y} Z`} fill="#7a5a3a" />
    <rect x={x + w * 0.1} y={y - w * 0.5} width={w * 0.2} height={w * 0.18} rx={1.5} fill="#7a5a3a" />
  </g>
)

/** An olive tree: a twisty trunk and a round, silvery-green crown. (x, y): the foot of its trunk. */
function OliveTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const leaf = useShade('#9cb27a', 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{leaf.def}</defs>
      <path d="M-12 0 Q-4 -26 -14 -48 L-4 -52 Q4 -34 2 -56 L12 -54 Q8 -26 14 0 Z" fill="#8a6a4a" stroke="#5a4430" strokeWidth={3} strokeLinejoin="round" />
      <g className="sc-sway">
        {[[0, -92, 40], [-34, -70, 28], [34, -72, 30], [-14, -112, 26], [18, -108, 24]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={leaf.fill} stroke="#6f8a4f" strokeWidth={3} />
        ))}
        {[[-20, -90], [10, -100], [24, -80], [-30, -64], [-4, -74]].map(([lx, ly], i) => <ellipse key={i} cx={lx} cy={ly} rx={5} ry={2.2} fill="#e4ecd2" opacity={0.6} transform={`rotate(-30 ${lx} ${ly})`} />)}
      </g>
    </g>
  )
}

/** The green hillside where Jesus talks with the man (pages 1, 10 and 11): far hills, a village, olive trees. */
function TellingHill() {
  return (
    <g>
      <path d="M0 250 Q130 214 280 238 Q420 212 560 234 Q690 210 800 230 L800 450 L0 450 Z" fill="#c4dca0" />
      {[[662, 230, 26], [694, 226, 30], [728, 231, 24]].map(([hx, hy, w]) => <FarHouse key={hx} x={hx} y={hy} w={w} />)}
      <path d="M0 306 Q200 272 420 296 Q620 270 800 290 L800 450 L0 450 Z" fill="#a6d084" />
      <OliveTree x={84} y={334} s={0.95} />
      <OliveTree x={770} y={316} s={0.7} />
      <path d="M0 364 Q240 336 470 360 T800 352 L800 450 L0 450 Z" fill="#86c26a" />
      <Tufts spots={[[30, 446], [470, 430], [520, 444], [760, 440], [700, 448], [150, 430]]} />
    </g>
  )
}

/** A child sitting cross-legged on the grass (Sitting draws a grown-up's lap, so a child is a grown-up, smaller). */
const SitKid = ({ x, y, s = 1, look, blinkDelay }: { x: number; y: number; s?: number; look: Look; blinkDelay?: number }) => (
  <Sitting x={x} y={y} s={s * 0.74} look={{ ...look, build: undefined }} blinkDelay={blinkDelay} />
)

// ---------- On the road: the people who pass by, and the man by the road ----------

/** The hurt man sitting by the road, facing us: sad, with his scrape and torn sleeve. `hopeful`: someone has come. */
function HurtMan({ x, y, s = 1, mood = 'sad', blinkDelay = 0 }: { x: number; y: number; s?: number; mood?: 'sad' | 'hopeful'; blinkDelay?: number }) {
  return (
    <Sitting x={x} y={y} s={s} look={TRAVELER} blinkDelay={blinkDelay}>
      <Hurts arm={LEFT_ARM.hold} />
      <SadFace look={TRAVELER} frown={mood === 'sad'} />
    </Sitting>
  )
}

/** The road where the man was hurt, seen from the roadside (pages 3 to 6): it runs across the middle; `time` of day. */
const ROAD: [number, number, number][] = [[-30, 318, 32], [180, 314, 34], [400, 322, 36], [620, 314, 36], [830, 318, 36]]
function RoadPlace({ time = 'day', children }: { time?: LandTime; children?: ReactNode }) {
  return (
    <g>
      <Wilderness time={time}>
        <RockyRoad pts={ROAD} />
      </Wilderness>
      {children}
    </g>
  )
}

/** Where the hurt man sits by the road on pages 3 to 5, and the rock behind him. */
const HURT = { x: 232, y: 404, rock: 182 }

// ---------- Part one ----------

/** The story Jesus tells, as a little picture in a dream bubble (page 1): the rocky road winding down, a traveler on it. */
function StoryBubble() {
  return (
    <g>
      <path d="M540 116 Q600 96 660 108 Q720 92 790 104 L790 170 L540 170 Z" fill="#e2c38e" />
      <path d="M540 140 Q620 124 700 136 Q750 130 790 136 L790 170 L540 170 Z" fill="#d4ad74" />
      <Jerusalem x={590} y={112} s={0.32} />
      <path d="M600 112 Q640 118 630 126 Q620 134 680 140 Q730 146 790 160" stroke="#f3e2bf" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Person x={672} y={142} s={0.22} look={TRAVELER} />
      <JerichoFar x={760} y={124} s={0.32} />
    </g>
  )
}

// 1. "One day, a man asked Jesus a question. "God says to love my neighbor," he said. "But who is my neighbor?" So Jesus
// told him a story."
// Jesus sits on a rock on the hillside, two of His friends beside Him. The man who knew God's law stands before Him with
// his scroll, asking (a question mark bubbles up). Children sit on the grass to listen, and the story Jesus is about to
// tell floats up in a dream bubble: a traveler on the road from Jerusalem down to Jericho.
function Page1() {
  return (
    <Scene sky="day" ground="none">
      <TellingHill />
      <Tap say="Jesus is telling a story about a long, rocky road." sfx="sparkle">
        <Dream x={548} y={34} w={226} h={118} from={[606, 262]} sky="#fff1d6">
          <StoryBubble />
        </Dream>
      </Tap>
      <Person x={712} y={384} s={0.84} look={PEOPLE.peter} facing="left" blinkDelay={1.2} />
      <Person x={766} y={396} s={0.84} look={PEOPLE.john} facing="left" blinkDelay={2.2} />
      <Rock x={600} y={426} s={1.05} />
      <Tap say="Listen, and I will tell you a story." sfx="sparkle">
        <SittingOnRock x={600} y={426} s={1.05} look={PEOPLE.jesus} pose="wave" />
      </Tap>
      <Tap say="Who is my neighbor?" sfx="pop">
        <Person x={404} y={424} s={1.02} look={LAWYER} pose="hold" holding="scroll" blinkDelay={0.6} />
        <Asking x={452} y={238} s={1.05} />
      </Tap>
      <Tap say="Shh! Jesus is telling a story." sfx="pop">
        <SitKid x={170} y={438} s={1.08} look={FOLK.girl} blinkDelay={0.9} />
        <SitKid x={270} y={442} s={1.08} look={FOLK.boy} blinkDelay={2.1} />
      </Tap>
    </Scene>
  )
}

// 2. "A man was walking down a long, rocky road, from Jerusalem to Jericho. On the way, robbers took his things and left
// him hurt by the side of the road."
// The whole way, seen from high up: Jerusalem on its hill far away on the left, the road winding down through the wild,
// rocky hills toward Jericho's palm trees far off on the right. The man sits by the road in front, hurt and sad. Far
// away over a hill, two tiny robbers run off with his bag (never near him).
function Page2() {
  return (
    <Scene sky="day" ground="none">
      <Wilderness
        far="M0 214 Q80 180 170 198 Q290 168 410 196 Q540 170 660 194 Q740 182 800 190 L800 450 L0 450 Z"
        mid="M0 272 Q150 238 300 262 Q470 232 640 258 Q730 246 800 252 L800 450 L0 450 Z"
        near="M0 386 Q200 370 420 384 T800 378 L800 450 L0 450 Z">
        <RockyRoad pts={[[132, 206, 3], [170, 222, 5], [146, 244, 7], [204, 278, 12], [300, 336, 21], [432, 382, 29], [560, 370, 27], [646, 326, 19], [694, 278, 12], [712, 238, 6], [718, 212, 3]]} />
        <Tap say="Far away is Jericho, with its palm trees." sfx="pop">
          <JerichoFar x={724} y={204} s={0.62} />
        </Tap>
      </Wilderness>
      <Tap say="That's Jerusalem, the big city on the hill." sfx="sparkle">
        <Jerusalem x={122} y={210} s={0.74} />
      </Tap>
      <g>
        <Robber x={456} y={238} s={0.62} color="#6b5a4a" bag />
        <Robber x={482} y={234} s={0.62} color="#5a5060" />
      </g>
      <RoadRock x={286} y={432} s={1.05} />
      <Tap say="A little lizard, sitting in the sunshine." sfx="wobble">
        <Lizard x={236} y={376} s={0.95} />
      </Tap>
      <Tap say="Oh, I am hurt. Will somebody help me?" sfx="pop">
        <HurtMan x={340} y={430} s={1} blinkDelay={0.5} />
      </Tap>
      <Scrub x={90} y={330} s={1} />
      <Scrub x={600} y={440} s={1.2} />
      <Scrub x={560} y={276} s={0.7} />
      <Birds spots={[[300, 110, 1], [330, 96, 0.8]]} />
    </Scene>
  )
}

// 3. "Soon a priest came down the road. He saw the hurt man. But he did not stop. He went by on the other side of the
// road."
// The road where the man sits. The priest walks along the far side of the road, looking over at the hurt man as he
// goes, his footprints swerving away from him across the road. Not cross, just busy: he keeps going.
function Page3() {
  return (
    <Scene sky="day" ground="none" sun>
      <RoadPlace>
        <Footprints pts={[[24, 322], [62, 320], [100, 317], [138, 312], [176, 305], [214, 298], [252, 294], [290, 292], [328, 292], [366, 292]]} />
      </RoadPlace>
      <Tap say="I am in a hurry. I must keep going." sfx="whoosh">
        <PriestWalking x={410} y={294} s={0.74} />
        <Hurry x={410} y={238} s={0.8} />
      </Tap>
      <RoadRock x={HURT.rock} y={HURT.y} s={1.08} />
      <Tap say="Please, will you help me?" sfx="pop">
        <HurtMan x={HURT.x} y={HURT.y} />
      </Tap>
      <Tap say="A little lizard is sunning itself." sfx="wobble">
        <Lizard x={640} y={404} s={1.1} flip />
      </Tap>
      <Scrub x={720} y={250} s={0.8} />
      <Scrub x={520} y={438} s={1.2} />
      <Birds spots={[[480, 120, 1], [512, 104, 0.8]]} />
    </Scene>
  )
}

// 4. "Then a temple helper came by. He saw the hurt man, too. But he hurried by on the other side. Would anyone stop to
// help?"
// The same road, later in the day. The temple helper hurries along the far side with a sack on his shoulder, looking
// over at the hurt man but not stopping. Far away on the hill behind, a tiny traveler with a donkey is coming down the
// road (the one who will stop).
function Page4() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sky top="#9cc8ec" bottom="#ffe6c2" />
      <Sun x={700} y={120} s={0.8} />
      <Cloud x={200} y={70} s={0.8} />
      <RoadPlace time="late">
        <Footprints pts={[[24, 322], [62, 320], [100, 317], [138, 312], [176, 305], [214, 298], [252, 294], [290, 292], [328, 292], [366, 292], [404, 292]]} />
      </RoadPlace>
      <Tap say="Here comes someone else, far away on the hill!" sfx="sparkle">
        <g>
          <SamaritansDonkey x={112} y={256} s={0.2} />
          <Person x={146} y={257} s={0.2} look={SAMARITAN} />
        </g>
      </Tap>
      <Tap say="I am too busy to stop today." sfx="whoosh">
        <HelperWalking x={450} y={294} s={0.74} />
        <Hurry x={450} y={238} s={0.8} />
      </Tap>
      <RoadRock x={HURT.rock} y={HURT.y} s={1.08} />
      <Tap say="Will anyone stop to help me?" sfx="pop">
        <HurtMan x={HURT.x} y={HURT.y} blinkDelay={1.2} />
      </Tap>
      <Scrub x={720} y={250} s={0.8} />
      <Scrub x={520} y={438} s={1.2} />
      <Scrub x={680} y={430} s={0.9} />
    </Scene>
  )
}

// 5. "Then a Samaritan, a man from Samaria, came by with his donkey. His people and the hurt man's people did not get
// along. But when he saw the hurt man, he stopped. He felt so sorry for him!"
// The Samaritan (his striped saffron head cloth and teal robe) has stopped: he kneels beside the hurt man with a hand on
// his shoulder, so sorry for him. His donkey waits on the road with his bags. The hurt man looks up, hopeful.
function Page5() {
  return (
    <Scene sky="day" ground="none" sun>
      <RoadPlace />
      <Tap say="Hee-haw! My friend stopped to help." sfx="wobble">
        <SamaritansDonkey x={470} y={338} s={0.86} flip blinkDelay={0.8} />
      </Tap>
      <RoadRock x={HURT.rock} y={HURT.y} s={1.08} />
      <Tap say="Someone stopped! Thank you." sfx="pop">
        <HurtMan x={HURT.x} y={HURT.y} mood="hopeful" />
      </Tap>
      <Tap say="Oh, you poor man! I will help you." sfx="sparkle">
        <Kneel x={312} y={410} s={1} look={SAMARITAN} pose="point" facing="left" blinkDelay={0.4}>
          <SamaritanCloth />
          <SadFace look={SAMARITAN} frown={false} />
        </Kneel>
      </Tap>
      <Heart x={272} y={236} s={0.5} color="#ff6f91" />
      <Scrub x={720} y={250} s={0.8} />
      <Scrub x={600} y={432} s={1.2} />
      <Birds spots={[[480, 120, 1], [512, 104, 0.8]]} />
    </Scene>
  )
}

// 6. "The Samaritan gently washed the man's hurts and wrapped them in bandages. Then he lifted him up onto his own
// donkey."
// The same roadside: the man sits up on the donkey now, white bandages round his head and his arm, smiling. The Samaritan
// stands at the donkey's head with its lead rope, ready to go. On the ground by the rock: the water skin and the little
// jar of oil he washed the hurts with, and what's left of the bandage roll.
function Page6() {
  return (
    <Scene sky="day" ground="none" sun>
      <RoadPlace />
      <RoadRock x={HURT.rock} y={HURT.y} s={1.08} />
      <Tap say="Clean water and oil, to make the sore spots better." sfx="pop">
        <BandageRoll x={204} y={434} s={1.15} />
        <WashBowl x={262} y={426} s={1.2} />
        <OilJar x={318} y={428} s={1.15} />
      </Tap>
      <Tap say="Thank you, my kind friend!" sfx="sparkle">
        <SamaritansDonkey x={410} y={372} s={1.02} rider={TRAVELER} riderKids={<RiderBandaged />} lead={[121, -78]} blinkDelay={0.6} />
      </Tap>
      <Tap say="Up you go, onto my donkey. I will take care of you." sfx="pop">
        <Person x={588} y={384} s={1.02} look={SAMARITAN} pose="point" facing="left" blinkDelay={1.4}><SamaritanCloth /></Person>
      </Tap>
      <Scrub x={720} y={250} s={0.8} />
      <Scrub x={700} y={430} s={1.2} />
      <Sparkles spots={[[346, 230, 7], [470, 210, 6]]} color="#ffffff" />
    </Scene>
  )
}

// ---------- Part two ----------

// 7. "Remember the hurt man on the road? The kind Samaritan took him to an inn, a house where travelers can stay. The
// innkeeper opened the door. "Come in, come in!" he said."
// Evening at the inn: warm lights in the windows, a lamp by the door, the first stars. The innkeeper stands at the open
// door, waving them in. The Samaritan leads his donkey up the road, the hurt man riding it, bandaged.
function Page7() {
  return (
    <Scene sky="dusk" ground="none">
      <Moon x={110} y={80} s={0.7} />
      <Wilderness time="dusk"
        far="M0 232 Q120 204 250 222 Q380 196 520 218 Q650 198 800 214 L800 450 L0 450 Z"
        mid="M0 296 Q160 268 330 288 Q520 262 800 284 L800 450 L0 450 Z"
        near="M0 372 Q220 356 430 370 T800 364 L800 450 L0 450 Z">
        <RockyRoad pts={[[-30, 362, 30], [160, 364, 32], [360, 378, 30], [480, 388, 24], [560, 392, 19]]} color="#e2c7a0" edge="#b88f62" />
      </Wilderness>
      <Inn x={560} y={388} s={1.08} lit={1} />
      <Tap say="Welcome to the inn! Come in, come in!" sfx="good">
        <Figure x={566} y={392} s={0.74} look={INNKEEPER} pose="wave" blinkDelay={0.3}><Apron /></Figure>
      </Tap>
      <Tap say="Hee-haw! We made it to the inn." sfx="wobble">
        <OnTheWay x={160} y={404} s={0.9} blinkDelay={0.5} />
      </Tap>
      <Sparkles spots={[[300, 60, 5], [420, 90, 4], [740, 50, 5], [240, 130, 4]]} color="#fff8d0" />
    </Scene>
  )
}

/** Inside the inn at night: plastered walls, beams, a window onto the moon and stars, and a lamp in a niche. */
function InnRoom({ children }: { children?: ReactNode }) {
  const wall = useShade('#e2c49a', 0.15, 0.2)
  return (
    <g>
      <defs>{wall.def}</defs>
      <rect width={800} height={450} fill={wall.fill} />
      <rect x={0} y={0} width={800} height={34} fill="#8a6040" />
      {[60, 250, 450, 650].map((bx) => <rect key={bx} x={bx} y={0} width={26} height={44} rx={3} fill="#6b4a30" />)}
      {/* the window: night sky, the moon and the stars */}
      <path d="M90 230 L90 120 Q90 80 140 80 Q190 80 190 120 L190 230 Z" fill="#232052" stroke="#a8804a" strokeWidth={6} />
      <g>
        <path d="M160 120 A16 16 0 1 0 176 140 A13 13 0 0 1 160 120 Z" fill="#fff3b0" />
        <Sparkles spots={[[112, 112, 4], [130, 160, 3], [150, 200, 4], [176, 190, 3], [114, 210, 3]]} color="#fff8d0" />
      </g>
      <rect x={80} y={228} width={120} height={10} rx={3} fill="#a8804a" />
      {/* the lamp in its niche */}
      <path d="M640 210 L640 170 Q640 150 662 150 Q684 150 684 170 L684 210 Z" fill="#c9a074" />
      {/* the floor and a rug */}
      <rect x={0} y={370} width={800} height={80} fill="#c9a06a" />
      <path d="M0 370 L800 370" stroke="#a8804a" strokeWidth={3} />
      <path d="M470 446 L520 392 L780 392 L800 446 Z" fill="#b5553f" />
      <path d="M498 430 L534 398 L766 398 L786 430" stroke="#f0d38a" strokeWidth={3} fill="none" />
      {children}
    </g>
  )
}

// 8. "That night, the Samaritan took care of him. He gave him water to drink and warm soup to eat, and he tucked him
// into a cozy bed."
// Night in a room at the inn, the lamp glowing and the moon at the window. The man sits up in a cozy bed under a warm
// blanket, bandaged and smiling. The Samaritan kneels by the bed and holds a bowl of warm soup out to him on his hand;
// a cup of water and a jug stand on the floor nearby.
function Page8() {
  return (
    <Scene sky="night" ground="none" clouds={false} stars={false}>
      <InnRoom>
        {/* the bed: a low wooden frame, a soft mattress and a pillow */}
        <g transform="translate(80 0)">
          <rect x={140} y={360} width={330} height={36} rx={6} fill="#9a6a3a" stroke="#5a3a20" strokeWidth={3} />
          <rect x={150} y={340} width={310} height={30} rx={12} fill="#f4ead2" stroke="#c9b993" strokeWidth={2.5} />
          <path d="M150 318 Q148 296 176 296 L224 300 Q244 304 240 326 Q236 346 214 344 L170 342 Q150 340 150 318 Z" fill="#ffffff" stroke="#c9c2b2" strokeWidth={2.5} />
        </g>
      </InnRoom>
      <Tap say="Mmm, thank you. I feel better already." sfx="pop">
        <Sitting x={316} y={366} s={1} look={TRAVELER} blinkDelay={0.6}><Bandages arm={LEFT_ARM.hold} /></Sitting>
        {/* the blanket, tucked up over his lap */}
        <g transform="translate(80 0)">
          <path d="M188 334 Q236 322 300 330 Q380 334 452 328 Q462 346 452 366 L190 366 Q180 350 188 334 Z" fill="#e8875a" stroke="#a8553a" strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M206 346 Q300 338 444 342 M204 356 Q300 350 446 354" stroke="#f6d38a" strokeWidth={3} fill="none" />
        </g>
      </Tap>
      <Tap say="Here is some warm soup. Rest now, my friend." sfx="sparkle">
        {/* (kneeling by the bed, he holds the bowl out to the man on his hand, which shows under it: his own two hands only) */}
        <Kneel x={404} y={412} s={1.04} look={SAMARITAN} pose="point" facing="left" blinkDelay={1.4}>
          <SamaritanCloth />
          <SoupBowl x={54} y={-101} s={1.2} />
        </Kneel>
      </Tap>
      <Tap say="A cup of cool water." sfx="pop">
        <Jug x={532} y={432} s={1.15} />
        <Cup x={566} y={430} s={1.25} />
      </Tap>
      <Tap say="The little lamp glows all night long." sfx="sparkle">
        <ClayLamp x={660} y={206} s={1.1} />
      </Tap>
    </Scene>
  )
}

// 9. "In the morning, the Samaritan gave the innkeeper two coins. "Please take care of him," he said. "I will come back.""
// Morning at the inn. The Samaritan holds out two shiny coins to the innkeeper, who holds out his hand for them. The
// donkey waits, ready for the road. Upstairs, the man waves from the window, bandaged and smiling. A rooster crows on the
// courtyard wall.
function Page9() {
  const win = INN.window
  return (
    <Scene sky="dawn" ground="none">
      <Sun x={120} y={190} s={0.8} />
      <Wilderness time="morning"
        far="M0 232 Q120 204 250 222 Q380 196 520 218 Q650 198 800 214 L800 450 L0 450 Z"
        mid="M0 296 Q160 268 330 288 Q520 262 800 284 L800 450 L0 450 Z"
        near="M0 372 Q220 356 430 370 T800 364 L800 450 L0 450 Z" />
      <Inn x={560} y={392} s={1.08} lit={0}
        atWindow={
          <Tap say="Good morning! I feel much better." sfx="pop">
            <Figure x={win.x} y={win.y + 66} s={0.62} look={TRAVELER} pose="wave" reach={[null, [30, -124]]} blinkDelay={0.9}><Bandages /></Figure>
          </Tap>
        } />
      <Tap say="Cock-a-doodle-doo! Good morning!" sfx="wobble">
        <Rooster x={730} y={318} s={0.9} />
      </Tap>
      <SamaritansDonkey x={170} y={408} s={0.86} blinkDelay={0.5} />
      <Tap say="Please take care of him. I will come back." sfx="ding">
        <Person x={452} y={412} s={0.96} look={SAMARITAN} pose="point" blinkDelay={1.1}>
          <SamaritanCloth />
          <Coin x={49} y={-104} r={8.4} />
          <Coin x={64} y={-101} r={8.4} />
        </Person>
      </Tap>
      <Tap say="Thank you! I will take good care of him." sfx="good">
        <Figure x={612} y={414} s={0.92} look={INNKEEPER} pose="point" facing="left" blinkDelay={0.4}><Apron /></Figure>
      </Tap>
      <Sparkles spots={[[532, 300, 6], [486, 296, 4], [526, 326, 4]]} color="#ffffff" />
    </Scene>
  )
}

/** A rooster on a wall (facing left), crowing in the morning. (x, y): its feet. */
function Rooster({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <path d="M-2 -2 L-2 -14 M6 -2 L6 -14" stroke="#e0a030" strokeWidth={2.6} strokeLinecap="round" />
      <g className="pa-tail" style={{ '--o': '0% 100%' } as CSSProperties}>
        <path d="M14 -24 Q34 -46 28 -62 Q22 -44 12 -36 Q30 -40 32 -30 Q20 -30 12 -28 Z" fill="#3f6a4a" stroke="#2a4a32" strokeWidth={1.6} />
        <path d="M16 -30 Q30 -52 24 -64" stroke="#c0504d" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
      <ellipse cx={2} cy={-24} rx={16} ry={12} fill="#c98a4a" stroke="#8a5a2a" strokeWidth={2} />
      <path d="M-4 -26 Q4 -20 12 -26" stroke="#e8b06a" strokeWidth={2.4} fill="none" />
      <circle cx={-12} cy={-38} r={8} fill="#c98a4a" stroke="#8a5a2a" strokeWidth={2} />
      <path d="M-16 -45 l2 -6 l3 4 l2 -6 l3 5 l1 -4 l1 6 Z" fill="#e0453a" stroke="#a8302a" strokeWidth={1.2} />
      <path d="M-19.5 -38 l-6 1.5 l6 2 Z" fill="#ffc94a" stroke="#c99a10" strokeWidth={1} />
      <path d="M-17 -33 q-2 5 1 7 q2 -3 0 -7 Z" fill="#e0453a" />
      <circle cx={-14} cy={-40} r={1.6} fill="#2b2140" />
      <path d="M-30 -42 q-6 -4 -10 -2 M-30 -36 q-7 0 -10 3" stroke="#ffffff" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.85} />
    </g>
  )
}

// 10. "Then Jesus asked, "Which one was a good neighbor to the hurt man?" The man said, "The one who was kind to him."
// "Yes," said Jesus. "Now you go and do the same.""
// Back on the hillside with Jesus. Over them, a dream bubble shows the three from the story: the priest and the temple
// helper hurrying away from the hurt man (looking back at him, worried, as on pages 3 and 4), and the Samaritan kneeling
// to help him, a heart over them. The man who asked raises his hand: he knows the answer.
function Page10() {
  return (
    <Scene sky="day" ground="none">
      <TellingHill />
      <Tap say="Which one was a good neighbor? The one who was kind!" sfx="sparkle">
        <Dream x={150} y={30} w={430} h={150} from={[404, 268]} to={[396, 186]} sky="#fff1d6">
          <path d="M140 150 Q300 128 460 144 Q540 136 600 142 L600 200 L140 200 Z" fill="#e2c38e" />
          {/* (the two who went by, hurrying away from the hurt man, looking back at him as on pages 3 and 4) */}
          <PriestWalking x={214} y={164} s={0.42} facing="left" />
          <Hurry x={214} y={136} s={0.5} color="#c9a46a" flip />
          <HelperWalking x={300} y={164} s={0.42} facing="left" />
          <Hurry x={300} y={136} s={0.5} color="#c9a46a" flip />
          <Sitting x={430} y={166} s={0.42} look={TRAVELER}><Bandages arm={LEFT_ARM.hold} /></Sitting>
          <Kneel x={482} y={166} s={0.42} look={SAMARITAN} pose="point" facing="left"><SamaritanCloth /></Kneel>
          <Heart x={456} y={70} s={0.62} color="#ff6f91" />
          <Sparkles spots={[[410, 66, 6], [506, 80, 5]]} color="#ffd34d" />
        </Dream>
      </Tap>
      <Rock x={600} y={426} s={1.05} />
      <Tap say="Now you go and do the same." sfx="sparkle">
        <g transform="translate(1200 0) scale(-1 1)">
          <SittingOnRock x={600} y={426} s={1.05} look={PEOPLE.jesus} pose="point" />
        </g>
      </Tap>
      <Tap say="The one who was kind to him!" sfx="good">
        <Person x={404} y={424} s={1.02} look={LAWYER} pose="wave" blinkDelay={0.6}><TuckedScroll /></Person>
      </Tap>
      <Tap say="We will be kind, too!" sfx="pop">
        <SitKid x={170} y={438} s={1.08} look={FOLK.girl} blinkDelay={0.9} />
        <SitKid x={270} y={442} s={1.08} look={FOLK.boy} blinkDelay={2.1} />
      </Tap>
      <Person x={712} y={384} s={0.84} look={PEOPLE.peter} facing="left" blinkDelay={1.2} />
      <Person x={766} y={396} s={0.84} look={PEOPLE.john} facing="left" blinkDelay={2.2} />
    </Scene>
  )
}

// 11. "A neighbor is anyone who needs our help. God loves everyone. He wants us to be kind to everyone, even people who
// are different from us, just like the good Samaritan!"
// God's warm light shines down on the hillside, and hearts float up. Jesus stands with His arms open. All around Him,
// all kinds of people are being kind: the man who asked carries a water jar for a grandma, a boy shares his bread with
// a little one, and a girl gives a tired traveler a cup of water.
function Page11() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Rays x={466} y={-60} r={560} n={16} color="#fff3b0" opacity={0.42} />
      <Glow x={466} y={0} r={240} color="#fff6c8" />
      <TellingHill />
      <Tap say="God loves everyone!" sfx="sparkle">
        <Figure x={466} y={404} s={1.0} look={PEOPLE.jesus} pose="open" />
      </Tap>
      <Tap say="Let me carry that for you." sfx="good">
        <Person x={96} y={420} s={0.9} look={FOLK.grandma} holding="stick" blinkDelay={0.5} />
        <Figure x={182} y={418} s={0.94} look={LAWYER} holding="jar" facing="left" blinkDelay={1.6} />
      </Tap>
      <Tap say="You can have some of my bread." sfx="pop">
        {/* (the loaf held up on his hand, over it, so his hand shows under it) */}
        <Figure x={268} y={440} s={0.95} look={FOLK.boy} pose="point" blinkDelay={1.1}><Loaf x={56} y={-105} s={1.25} /></Figure>
        <SitKid x={362} y={444} s={0.95} look={FOLK.little} blinkDelay={0.3} />
      </Tap>
      <Tap say="Here is some water for you." sfx="pop">
        <Rock x={668} y={428} s={0.9} />
        <SittingOnRock x={668} y={428} s={0.9} look={FOLK.traveler} blinkDelay={0.8} />
        <Figure x={588} y={432} s={0.95} look={FOLK.girl} pose="point" blinkDelay={2.2} item={<Cup x={58} y={-86} s={1.4} />} />
      </Tap>
      <Heart x={310} y={196} s={0.55} color="#ff6f91" />
      <Heart x={610} y={176} s={0.5} color="#ffcf3f" />
      <Heart x={740} y={262} s={0.45} color="#ff6f91" />
      <Heart x={130} y={250} s={0.45} color="#ff9ec0" />
      <Sparkles spots={[[400, 80, 9], [530, 54, 7], [610, 110, 8], [290, 120, 6], [690, 150, 6]]} />
    </Scene>
  )
}

export const SAMARITAN_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]

// (For the game, art/games/samaritan.tsx.)
export { Scrub, Lizard, Sky, JerichoFar }
