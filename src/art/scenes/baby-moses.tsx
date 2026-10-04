// Baby Moses (Exodus 1 and 2:1-10): one picture per story page, both parts in order (see data/baby-moses.ts
// for the words). Built from the kit (./kit.tsx), the Moses islands' cast and props (./moses.tsx), and
// Joseph's Figure (./joseph.tsx: Person, with the same body and face, plus feelings, kneeling and more
// poses). Baby Moses and his basket boat are drawn in art/items/isl-baby-moses.tsx, so the activities and
// the mini-game show them the same way. God is never drawn as a person: His presence is light.
//
// New here, to move into shared files: the looks JOCHEBED, MIRIAM_GIRL, PRINCESS, PRINCESS_HELPERS and
// MOSES_BOY (with MiriamGirl, Princess, Helper and PharaohFig, which add their hair or headdress), and the
// river Nile's props: River, Papyrus, Reeds, Egret, SleepyCrocodile, BathingPlace; and MudHouse, HomeRoom
// and OilLamp for God's people's homes in Egypt.
import { useId, type ComponentProps, type ComponentType, type ReactNode } from 'react'
import { darken, ink } from '../kit'
import { Baby, Person, SKIN } from '../people'
import { Cloud, Emoji, Glow, Moon, Palm, Rays, Scene, Sparkles, Sun, Tap, sparkle } from './kit'
import { usePlayer } from './player'
import { BrickBasket, BrickStack, Column, DryingBricks, Folk, Grip, HEBREWS, Heart, Jar, MIRIAM, MOSES, PHARAOH, PharaohRegalia, PillarOfCloud, Pyramid, RaisedStaff, SeaFish, SilverHair, Straw } from './moses'
import { Dream, Figure, Mat, type JLook } from './joseph'
import { BabyMoses, BasketLid, LilyPad, ReedBasket, WaterLily } from '../items/isl-baby-moses'
import './baby-moses.css'

const uidOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

// ---------- The people (to move into people.tsx's PEOPLE) ----------

/** Jochebed, Moses' mother: a cream head cloth like the one her son wears when he's grown, a deep rose robe and a gold sash. */
export const JOCHEBED: JLook = { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#f3e3c3', robe: '#c4455a', sash: '#f2c94c' }

/** Miriam as a girl, Moses' big sister: PEOPLE.miriam's rose head scarf, sunny robe and teal sash, with a child's build. Draw her with <MiriamGirl>, which adds her fringe. */
export const MIRIAM_GIRL: JLook = { ...MIRIAM, build: 'child' }

/**
 * The princess, Pharaoh's daughter: straight black hair cut level at her shoulders, white linen with pleats,
 * a turquoise sash, a gold collar and a gold band. Draw her with <Princess>, which adds her hair beside her
 * face (`hair` is 'short' underneath, so nothing hangs behind her collar when she kneels) and a lotus flower.
 */
export const PRINCESS: JLook = { skin: SKIN.tan, hair: 'short', hairColor: '#1f1712', robe: '#fbf8ef', sash: '#2fa5c8', pleats: true, collar: '#f2c94c', band: '#f2c94c' }

/** The princess's two helpers: long dark hair with a ribbon round it, white linen and a colored sash (no gold: that's the princess). Draw them with <Helper>. */
export const PRINCESS_HELPERS: JLook[] = [
  { skin: SKIN.deep, hair: 'long', hairColor: '#1f1712', robe: '#f4ecda', sash: '#e07a5f', pleats: true },
  { skin: SKIN.medium, hair: 'long', hairColor: '#2b1f18', robe: '#f6f0e2', sash: '#8a6ad8', pleats: true },
]

/** Moses as a little boy: dark curls, a cream tunic and a brick-red sash (the colors he wears when he's grown). */
export const MOSES_BOY: JLook = { skin: SKIN.tan, hair: 'curly', hairColor: '#3b2a20', robe: '#f3e6c8', sash: '#b0533c', build: 'child' }

type FigureProps = Omit<ComponentProps<typeof Figure>, 'look'>

/** Kneeling, Figure bows the head 10 lower: what's drawn over a head goes down with it. */
const OnHead = ({ kneel, children }: { kneel?: boolean; children: ReactNode }) => <g transform={kneel ? 'translate(0 10)' : undefined}>{children}</g>

/** A girl's dark fringe, under her head scarf (figure units). */
const Fringe = ({ color = '#3b2a20' }: { color?: string }) => (
  <path d="M-16 -123 Q-8 -128.5 0 -127.6 Q8 -128.5 16 -123 Q13.5 -121 11 -123.2 Q8.5 -120.2 5.5 -123.4 Q2.8 -119.8 0 -123.6 Q-2.8 -119.8 -5.5 -123.4 Q-8.5 -120.2 -11 -123.2 Q-13.5 -121 -16 -123 Z"
    fill={color} stroke={ink(color)} strokeWidth={1.2} strokeLinejoin="round" />
)

/** Straight black hair cut level at the shoulders, the Egyptian way, falling beside the face (figure units). */
const StraightHair = ({ color }: { color: string }) => (
  <g fill={color} stroke={ink(color)} strokeWidth={2} strokeLinejoin="round">
    {[1, -1].map((sd) => <path key={sd} transform={`scale(${sd} 1)`} d="M16.5 -124 Q25.5 -121 27.6 -110 L29 -92 Q24 -90.4 19.6 -91.4 L19.8 -105 Q19.6 -115.5 14.6 -121.5 Z" />)}
  </g>
)

/** Miriam as a girl. */
export function MiriamGirl({ children, ...p }: FigureProps) {
  return <Figure {...p} look={MIRIAM_GIRL}><OnHead kneel={p.kneel}><Fringe /></OnHead>{children}</Figure>
}

/** The princess: her straight black hair, her gold band over it, and a pink lotus flower tucked in beside. */
export function Princess({ children, ...p }: FigureProps) {
  return (
    <Figure {...p} look={PRINCESS}>
      <OnHead kneel={p.kneel}>
        <StraightHair color={PRINCESS.hairColor} />
        <path d="M-23 -123 Q0 -131 23 -123" stroke={ink('#f2c94c')} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M-23 -123 Q0 -131 23 -123" stroke="#f2c94c" strokeWidth={3.6} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={-127} r={3.2} fill="#3f7fd0" stroke={ink('#f2c94c')} strokeWidth={1.4} />
        <g transform="translate(24 -125) rotate(24)">
          {[-38, 0, 38].map((a) => <path key={a} d="M0 0 Q-4 -6 0 -12 Q4 -6 0 0 Z" transform={`rotate(${a})`} fill="#ff94c2" stroke="#d9608f" strokeWidth={1.1} />)}
        </g>
      </OnHead>
      {children}
    </Figure>
  )
}

/** One of the princess's helpers (`i`: which), with a ribbon in her sash's color round her hair. */
export function Helper({ i, children, ...p }: FigureProps & { i: 0 | 1 }) {
  const look = PRINCESS_HELPERS[i]
  const c = look.sash ?? '#e07a5f'
  return (
    <Figure {...p} look={look}>
      <OnHead kneel={p.kneel}>
        <path d="M-23 -122 Q0 -130 23 -122" stroke={ink(c)} strokeWidth={5.6} fill="none" strokeLinecap="round" />
        <path d="M-23 -122 Q0 -130 23 -122" stroke={c} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      </OnHead>
      {children}
    </Figure>
  )
}

/** Pharaoh, as moses.tsx's <Pharaoh> draws him (his headdress and collar), with a feeling on his face (`mood`). */
export function PharaohFig({ children, ...p }: FigureProps) {
  return <Figure {...p} look={PHARAOH}><OnHead kneel={p.kneel}><PharaohRegalia /></OnHead>{children}</Figure>
}

// ---------- Things people hold (figure units) ----------

/** A bundle of cut reeds, tied in the middle, carried across the arms. (x, y): its middle. */
const ReedBundle = ({ x, y }: { x: number; y: number }) => (
  <g>
    {[-6, -3, 0, 3, 6].map((dy, i) => (
      <path key={dy} d={`M${x - 36} ${y + dy * 1.2 + (i % 2 ? 1 : -1)} Q${x} ${y + dy * 0.5} ${x + 34} ${y + dy * 1.2 - (i % 2 ? 1 : -1)}`} stroke={i % 2 ? '#7cbf5a' : '#a3d870'} strokeWidth={4.4} fill="none" strokeLinecap="round" />
    ))}
    <path d={`M${x + 33} ${y - 7} l9 -8 M${x + 35} ${y} l11 -2 M${x + 33} ${y + 7} l9 6`} stroke="#8fd16a" strokeWidth={2.4} strokeLinecap="round" />
    <rect x={x - 3} y={y - 10} width={6} height={20} rx={2.5} fill="#a0703f" />
  </g>
)

/** A wooden mold full of wet mud, for making a brick. (x, y): its middle. */
const BrickMold = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x - 22} y={y - 8} width={44} height={16} rx={2} fill="#8a5a2e" stroke="#5a3a1a" strokeWidth={2} />
    <rect x={x - 17} y={y - 4.5} width={34} height={9} rx={1.5} fill="#9a6440" />
    <path d={`M${x - 12} ${y - 1} l6 -2 M${x + 2} ${y + 1} l7 -2 M${x - 4} ${y + 2.5} l5 1`} stroke="#e8c45a" strokeWidth={1.4} strokeLinecap="round" />
  </g>
)

/** An open scroll with writing on it, held up (Pharaoh's new rule). (x, y): its middle. */
const OpenScroll = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x - 12} y={y - 22} width={24} height={42} fill="#fff3d6" stroke="#c9a46a" strokeWidth={2} />
    {[-14, -8, -2, 4, 10].map((dy) => <path key={dy} d={`M${x - 7} ${y + dy} l${dy % 4 ? 14 : 10} 0`} stroke="#8a6a4a" strokeWidth={1.6} strokeLinecap="round" />)}
    <rect x={x - 15} y={y - 27} width={30} height={8} rx={4} fill="#c9a46a" stroke="#9a7a42" strokeWidth={1.5} />
    <rect x={x - 15} y={y + 17} width={30} height={8} rx={4} fill="#c9a46a" stroke="#9a7a42" strokeWidth={1.5} />
  </g>
)

/** A worried drop of sweat beside someone's head. */
const SweatDrop = ({ x, y }: { x: number; y: number }) => (
  <path d={`M${x} ${y} q-5 8 0 10.5 q5 -2.5 0 -10.5 Z`} fill="#9fd8ff" stroke="#4a9ad8" strokeWidth={1.4} />
)

// ---------- The river Nile ----------

/** The river from y down to y2: blue water, paler far away, with ripples drifting on it. */
export function River({ y, y2 = 460, x1 = -10, x2 = 810, n = 12 }: { y: number; y2?: number; x1?: number; x2?: number; n?: number }) {
  const id = uidOf(useId())
  const h = y2 - y
  const ripples = Array.from({ length: n }, (_, i) => {
    const t = ((i * 0.618) % 1) * 0.86 + 0.07
    const ry = y + 10 + t * (h - 20)
    const rx = x1 + 20 + ((i * 263) % Math.max(40, x2 - x1 - 60))
    return [rx, ry, 14 + t * 30] as const
  })
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a4dcf3" />
          <stop offset="0.3" stopColor="#66b8e6" />
          <stop offset="1" stopColor="#3a8fd0" />
        </linearGradient>
      </defs>
      <rect x={x1} y={y} width={x2 - x1} height={h} fill={`url(#${id})`} />
      <path d={`M${x1} ${y + 1} L${x2} ${y + 1}`} stroke="#e6f7ff" strokeWidth={2.4} opacity={0.8} />
      {ripples.map(([rx, ry, w], i) => (
        <path key={i} className="sc-wave" style={{ animationDelay: `${-i * 0.7}s` }} d={`M${rx} ${ry} q${w / 4} ${-w / 7} ${w / 2} 0 t${w / 2} 0`} stroke="#ffffff" strokeWidth={1.6 + w / 22} fill="none" opacity={0.55} strokeLinecap="round" />
      ))}
    </g>
  )
}

/** One papyrus head: a round spray of thin green threads, springing up and out from the top of its stalk. */
function PapyrusHead({ x, y, r }: { x: number; y: number; r: number }) {
  const rays = Array.from({ length: 11 }, (_, i) => -168 + i * 15.6)
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-r} ${-r * 0.05} Q0 ${-r * 1.55} ${r} ${-r * 0.05} Q0 ${-r * 0.5} ${-r} ${-r * 0.05} Z`} fill="#a6dc78" opacity={0.85} />
      {rays.map((a) => {
        const rad = (a * Math.PI) / 180
        const ex = Math.cos(rad) * r, ey = Math.sin(rad) * r * 0.8 + r * 0.22
        return <path key={a} d={`M0 0 Q${(Math.cos(rad) * r * 0.5).toFixed(1)} ${(Math.sin(rad) * r * 1.05).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`} stroke="#4f9e43" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      })}
      {rays.map((a) => {
        const rad = (a * Math.PI) / 180
        return <circle key={a} cx={(Math.cos(rad) * r).toFixed(1)} cy={(Math.sin(rad) * r * 0.8 + r * 0.22).toFixed(1)} r={1.7} fill="#c2ea8e" />
      })}
    </g>
  )
}

/**
 * A clump of papyrus, the tall reeds of the Nile: green stalks fanning up from the water's edge, each topped
 * with a round feathery head. (x, y): its foot; `h`: about how tall; `n` stalks. It sways in the breeze.
 */
export function Papyrus({ x, y, h = 150, n = 5, s = 1, delay = 0 }: { x: number; y: number; h?: number; n?: number; s?: number; delay?: number }) {
  const stalks = Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5
    const hh = h * (0.8 + 0.2 * (((i * 7 + 3) % 5) / 4))
    return { bx: t * 14, tx: t * h * 0.44, ty: -hh }
  })
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sc-sway" style={{ animationDelay: `${delay}s` }}>
        {stalks.map(({ bx, tx, ty }, i) => (
          <path key={i} d={`M${bx} 0 Q${(bx + tx * 0.15).toFixed(1)} ${(ty * 0.55).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`} stroke="#3f8a3a" strokeWidth={3.6} fill="none" strokeLinecap="round" />
        ))}
        {stalks.map(({ bx, tx, ty }, i) => (
          <path key={i} d={`M${bx} 0 Q${(bx + tx * 0.15).toFixed(1)} ${(ty * 0.55).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`} stroke="#6cbf55" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        ))}
        {stalks.map(({ tx, ty }, i) => <PapyrusHead key={i} x={tx} y={ty} r={10 + h * 0.07} />)}
        {[-1, 1].map((d) => <path key={d} d={`M${d * 2} 0 Q${d * 9} -12 ${d * 15} -24 Q${d * 5} -15 ${-d * 4} 0 Z`} fill="#4f9a4a" stroke="#357a36" strokeWidth={1.4} strokeLinejoin="round" />)}
      </g>
    </g>
  )
}

/** A clump of reeds at the water's edge: long green blades and two brown cattails. (x, y): its foot. */
export function Reeds({ x, y, h = 90, s = 1, flip }: { x: number; y: number; h?: number; s?: number; flip?: boolean }) {
  const blades: [number, number, number][] = [[-20, 0.55, -24], [-13, 0.82, -14], [-6, 1, -4], [2, 0.92, 9], [9, 0.74, 19], [16, 0.6, 28], [-1, 0.66, -16]]
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="sc-sway">
        {[[-9, 1.06, -7], [5, 0.96, 6]].map(([dx, k, bend]) => (
          <g key={dx}>
            <path d={`M${dx} 0 Q${dx + bend * 0.4} ${-h * k * 0.5} ${dx + bend} ${-h * k}`} stroke="#5a9a44" strokeWidth={2.4} fill="none" />
            <rect x={dx + bend * 0.9 - 4} y={-h * k * 0.94} width={8} height={h * 0.2} rx={4} fill="#8a5a32" stroke="#5e3a1e" strokeWidth={1.4} transform={`rotate(${bend * 0.5} ${dx + bend * 0.9} ${-h * k * 0.85})`} />
          </g>
        ))}
        {blades.map(([dx, k, bend], i) => {
          const hh = h * k
          return <path key={i} d={`M${dx - 3} 0 Q${dx + bend * 0.35} ${-hh * 0.5} ${dx + bend} ${-hh} Q${dx + bend * 0.35 + 2.5} ${-hh * 0.5} ${dx + 3} 0 Z`} fill={i % 2 ? '#6dbb5a' : '#82c968'} stroke="#3f8a3a" strokeWidth={1.4} strokeLinejoin="round" />
        })}
      </g>
    </g>
  )
}

/** A white egret wading in the shallows (facing right): long thin legs down into the water, its wing folded at its side, an S-shaped neck and a long yellow beak. (x, y): where its feet are. */
export function Egret({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const line = '#aebbd0'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <path d="M-5 -42 L-7 0 M5 -42 L8 0" stroke="#5a4a3a" strokeWidth={2.6} strokeLinecap="round" />
      <path d="M-24 -50 L-40 -42 L-37 -48 L-42 -46 L-27 -55 Z" fill="#ffffff" stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
      <ellipse cx={-4} cy={-53} rx={22} ry={12.5} fill="#ffffff" stroke={line} strokeWidth={2.2} transform="rotate(-14 -4 -53)" />
      <path d="M-22 -50 Q-6 -66 12 -59 Q2 -48 -22 -50 Z" fill="#eef2f8" stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M12 -61 Q24 -71 14 -83 Q6 -93 16 -101" stroke={line} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M12 -61 Q24 -71 14 -83 Q6 -93 16 -101" stroke="#ffffff" strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={18} cy={-102} r={6.6} fill="#ffffff" stroke={line} strokeWidth={2} />
      <path d="M23.5 -104 L43 -100 L23.5 -98.6 Z" fill="#ffc94a" stroke="#d99a1a" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={19.8} cy={-103.4} r={1.6} fill="#2b2140" />
    </g>
  )
}

/** A little crocodile fast asleep in the sun, far away on a sandbank (facing right), smiling in its sleep, with a "z z z" floating up. (x, y): under its middle. */
export function SleepyCrocodile({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const g = '#79b45e', line = '#3f7a3a'
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
        <path d="M-12 -6 L-15 0 M20 -6 L23 0" stroke={darken(g, 0.2)} strokeWidth={5.5} strokeLinecap="round" />
        <path d="M-26 -11 Q-48 -12 -66 -1 Q-46 -3 -26 -1 Z" fill={g} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M-30 -1 Q-31 -16 -8 -16.5 L20 -15.5 Q31 -14.5 33 -8 L33 -1 Q0 2 -30 -1 Z" fill={g} stroke={line} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-26 -3 Q0 0 30 -3" stroke="#d8e8a8" strokeWidth={3} fill="none" strokeLinecap="round" />
        {[-20, -10, 0, 10].map((bx) => <path key={bx} d={`M${bx - 3.5} -15.8 q3.5 -4.5 7 0`} fill={g} stroke={line} strokeWidth={1.4} />)}
        <path d="M28 -12.5 Q47 -12.5 57 -6.5 Q59.5 -1.5 51 -0.5 L28 -0.5 Z" fill={g} stroke={line} strokeWidth={2} strokeLinejoin="round" />
        <path d="M34 -3.6 Q46 -1.4 55.5 -4.6" stroke={line} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <circle cx={55} cy={-8.6} r={1.2} fill={line} />
        <circle cx={29} cy={-15.5} r={5} fill={g} stroke={line} strokeWidth={1.6} />
        <path d="M26.2 -15.2 q2.8 2.2 5.6 0" stroke="#2b2140" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <path d="M-17 -4 L-20 1 M15 -4 L12 1" stroke={line} strokeWidth={7.6} strokeLinecap="round" />
        <path d="M-17 -4 L-20 1 M15 -4 L12 1" stroke={g} strokeWidth={5} strokeLinecap="round" />
      </g>
      <g className="bm-z">
        <path d={`M${x + 22 * s} ${y - 34 * s} l7 0 l-7 7 l7 0 M${x + 33 * s} ${y - 46 * s} l5 0 l-5 5 l5 0`} stroke="#ffffff" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  )
}

/** A fish leaping out of the water, with a splash under it. (x, y): where it leapt out. */
export function LeapingFish({ x, y, color = '#ffb347', s = 1 }: { x: number; y: number; color?: string; s?: number }) {
  return (
    <g>
      <g className="sc-float">
        <g transform={`translate(${x + 10 * s} ${y - 26 * s}) rotate(-28)`}><SeaFish x={0} y={0} s={0.9 * s} color={color} /></g>
        {[[-8, -18, 2.6], [-14, -10, 2], [24, -8, 2.2]].map(([dx, dy, r], i) => <circle key={i} cx={x + dx * s} cy={y + dy * s} r={r * s} fill="#ffffff" stroke="#9fd6f2" strokeWidth={1} />)}
      </g>
      <ellipse cx={x} cy={y + 2} rx={18 * s} ry={4 * s} fill="none" stroke="#ffffff" strokeWidth={2} opacity={0.8} />
    </g>
  )
}

/** Little birds flying far away over the river: [x, y, size] each. */
export const Birds = ({ spots }: { spots: [number, number, number][] }) => (
  <g className="sc-float">
    {spots.map(([x, y, k], i) => (
      <path key={i} d={`M${x - 11 * k} ${y - 3 * k} Q${x - 5 * k} ${y - 8 * k} ${x} ${y} Q${x + 5 * k} ${y - 8 * k} ${x + 11 * k} ${y - 3 * k}`} stroke="#5a6478" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </g>
)

/**
 * The princess's bathing place: wide stone steps coming down into the river, seen from the water, with a
 * square post at each side of the bottom and the top step. (x, y): the middle of the bottom step's front
 * edge, at the water; `n` steps, each a front `rise` tall with a `tread` on top; `w` wide. Use `stepAt`
 * to stand someone on a step.
 */
export function BathingSteps({ x, y, n = 4, w = 280, rise = 18, tread = 12, water = true }: {
  x: number; y: number; n?: number; w?: number; rise?: number; tread?: number; water?: boolean
}) {
  const l = x - w / 2, r = x + w / 2
  const top = y - n * (rise + tread)
  const post = (px: number, py: number, ph: number) => (
    <g key={`${px}-${py}`}>
      <rect x={px - 9} y={py - ph} width={18} height={ph} fill="#e6d3aa" stroke="#b89a64" strokeWidth={2} />
      <path d={`M${px - 12} ${py - ph} Q${px} ${py - ph - 16} ${px + 12} ${py - ph} Z`} fill="#8fcf8a" stroke="#4f8a5c" strokeWidth={1.8} />
      <rect x={px - 9} y={py - ph + 8} width={18} height={4} fill="#3a6fc4" />
    </g>
  )
  return (
    <g>
      {Array.from({ length: n }, (_, i) => n - 1 - i).map((k) => {
        const yk = y - k * (rise + tread)
        return (
          <g key={k}>
            <rect x={l} y={yk - rise - tread} width={w} height={tread + 1} fill="#f2e6c9" />
            <rect x={l} y={yk - rise} width={w} height={rise} fill="#dcc79c" />
            <path d={`M${l} ${yk - rise} L${r} ${yk - rise}`} stroke="#c2a874" strokeWidth={2} />
            {Array.from({ length: Math.floor(w / 52) }, (_, j) => <path key={j} d={`M${l + 30 + j * 52 + (k % 2) * 22} ${yk - rise + 3} l0 ${rise - 6}`} stroke="#c7ad7c" strokeWidth={1.6} />)}
            <path d={`M${l} ${yk} L${r} ${yk}`} stroke="#b89a64" strokeWidth={2} />
          </g>
        )
      })}
      <path d={`M${l} ${top} L${l} ${y} M${r} ${top} L${r} ${y}`} stroke="#b89a64" strokeWidth={2.4} />
      {post(l, top + tread, 34)}
      {post(r, top + tread, 34)}
      {water && (
        <g>
          <rect x={l - 4} y={y - rise * 0.45} width={w + 8} height={30 + rise * 0.45} fill="#4aa2dc" opacity={0.6} />
          <path d={`M${l - 4} ${y - rise * 0.45}${' q10 -3 20 0'.repeat(Math.ceil((w + 8) / 20))}`} stroke="#ffffff" strokeWidth={2.2} fill="none" opacity={0.85} />
        </g>
      )}
      {post(l, y - rise * 0.2, 30)}
      {post(r, y - rise * 0.2, 30)}
    </g>
  )
}

/** Where to stand someone on step k (counting up from 0, the bottom step) of BathingSteps at y: the middle of its tread. */
export const stepAt = (y: number, k: number, rise = 18, tread = 12) => y - k * (rise + tread) - rise - tread / 2

/** A painted stone wall along the top of the bathing place, with a frieze of lotus flowers, and the river palace's palms. (x1..x2, from y down to y2.) */
function PalaceWall({ x1, x2, y, y2 }: { x1: number; x2: number; y: number; y2: number }) {
  const n = Math.floor((x2 - x1) / 34)
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={y2 - y} fill="#f1e0b8" stroke="#c9a46a" strokeWidth={2.5} />
      <rect x={x1} y={y} width={x2 - x1} height={22} fill="#e8d09c" />
      {Array.from({ length: n }, (_, i) => {
        const fx = x1 + 17 + i * 34
        const c = ['#3f7fd0', '#d0503f', '#5fae6a'][i % 3]
        return (
          <g key={i}>
            <path d={`M${fx} ${y + 20} L${fx - 8} ${y + 4} Q${fx} ${y + 9} ${fx + 8} ${y + 4} Z`} fill={c} />
            <circle cx={fx} cy={y + 4} r={2.4} fill="#ffd34d" />
          </g>
        )
      })}
      <rect x={x1} y={y + 22} width={x2 - x1} height={4} fill="#ffd34d" />
    </g>
  )
}

// ---------- God's people's homes ----------

/** A little mud-brick house: flat-roofed, with the ends of its roof poles showing, a dark doorway and a small window. (x, y): the middle of its foot. `door`, `win`: where they are, as a part of its width from the middle. */
export function MudHouse({ x, y, w = 110, h = 72, door = -0.2, win = 0.25 }: { x: number; y: number; w?: number; h?: number; door?: number; win?: number | null }) {
  const line = '#a8804a'
  const dx = door * w, wx = (win ?? 0) * w
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill="#dcb880" stroke={line} strokeWidth={2.5} />
      <path d={`M${-w / 2 + 2} ${-h * 0.35} L${w / 2 - 2} ${-h * 0.35}`} stroke="#cfa86c" strokeWidth={3} opacity={0.6} />
      {[[-0.3, 0.3], [0.18, 0.55], [-0.12, 0.8], [0.33, 0.18]].map(([bx, by], i) => (
        <path key={i} d={`M${bx * w - 8} ${-h * by} l16 0 M${bx * w - 2} ${-h * by + 6} l14 0`} stroke="#c39a62" strokeWidth={1.5} strokeLinecap="round" />
      ))}
      <rect x={-w / 2 - 4} y={-h - 8} width={w + 8} height={10} rx={2} fill="#c99e66" stroke={line} strokeWidth={2.2} />
      {Array.from({ length: Math.floor(w / 16) }, (_, i) => <circle key={i} cx={-w / 2 + 9 + i * 16} cy={-h + 7} r={2.6} fill="#8a6040" />)}
      <path d={`M${dx - 12} 0 L${dx - 12} -32 Q${dx} -43 ${dx + 12} -32 L${dx + 12} 0 Z`} fill="#5a3a24" stroke={line} strokeWidth={2} />
      {win !== null && <rect x={wx - 8} y={-h + 18} width={16} height={13} rx={2} fill="#5a3a24" stroke={line} strokeWidth={2} />}
    </g>
  )
}

/** A little clay oil lamp with its flame, glowing warm. (x, y): its foot. */
export function OilLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={18} y={-22} r={70} color="#ffe08a" />
      <path d="M-18 -1 Q-20 -12 -4 -13 L12 -12 Q24 -12 26 -8 Q22 -3 12 -2 Q2 1 -18 -1 Z" fill="#c97a4a" stroke="#8a4a26" strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={-2} cy={-11.5} rx={7} ry={2.2} fill="#5a2e14" />
      <g className="pa-twinkle">
        <path d="M24 -10 C30 -16 28 -24 23 -31 C20 -24 17 -17 24 -10 Z" fill="#ffb347" stroke="#f08a2a" strokeWidth={1.2} />
        <path d="M23.6 -12.5 C26.5 -16 25.5 -20.5 23 -24.5 C21.5 -20.5 20.5 -16.5 23.6 -12.5 Z" fill="#fff1b0" />
      </g>
    </g>
  )
}

/**
 * Inside the family's little house: plastered walls, roof beams, a doorway with a woven curtain, a small
 * window high up and a niche for the lamp; the floor from y = 340. `night`: dark outside, the curtain drawn
 * shut (they're keeping the baby hidden) and the lamp lit; by day the curtain is tied back.
 */
function HomeRoom({ night }: { night?: boolean }) {
  const id = uidOf(useId())
  const wall = night ? '#d6b47f' : '#efd9ae'
  return (
    <g>
      <defs>
        <radialGradient id={`${id}v`} cx="50%" cy="58%" r="70%">
          <stop offset="0.45" stopColor="#2a1a3a" stopOpacity={0} />
          <stop offset="1" stopColor="#2a1a3a" stopOpacity={night ? 0.5 : 0.08} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={800} height={340} fill={wall} />
      {[[140, 90, 60, 26], [470, 60, 80, 22], [690, 250, 70, 30], [250, 270, 90, 24]].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#c9a36a" opacity={0.18} />
      ))}
      {/* roof beams */}
      <rect x={0} y={0} width={800} height={26} fill="#8a6040" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={30 + i * 96} cy={34} r={9} fill="#7a5233" stroke="#5a3a20" strokeWidth={2} />)}
      {/* the floor */}
      <rect x={0} y={340} width={800} height={110} fill={night ? '#c9a46e' : '#dcbc86'} />
      <rect x={0} y={334} width={800} height={8} fill="#b8925a" />
      {/* the doorway: by night the curtain is shut; by day it's tied back and the sun comes in */}
      <path d="M34 340 L34 158 Q96 126 158 158 L158 340 Z" fill={night ? '#3a2a40' : '#ffe9b0'} stroke="#a8804a" strokeWidth={4} />
      {night ? (
        <g>
          <path d="M40 160 Q96 132 152 160 L152 336 L40 336 Z" fill="#b9845a" />
          {[56, 78, 100, 122, 144].map((sx) => <path key={sx} d={`M${sx} 152 L${sx} 336`} stroke={sx % 44 === 12 ? '#e8c27a' : '#8a5a36'} strokeWidth={6} opacity={0.75} />)}
          <path d="M40 300 L152 300" stroke="#e8c27a" strokeWidth={5} />
        </g>
      ) : (
        <g>
          <path d="M40 300 L40 336 L150 336 L150 300 Z" fill="#f2d38a" opacity={0.6} />
          <path d="M40 160 Q60 150 84 146 Q66 220 70 336 L40 336 Z" fill="#b9845a" stroke="#8a5a36" strokeWidth={2} />
          <path d="M52 160 L60 336 M66 152 L66 336" stroke="#8a5a36" strokeWidth={4} opacity={0.6} />
          <path d="M56 246 Q70 240 80 248" stroke="#e8c27a" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* the window, high up, with two wooden bars */}
      <rect x={604} y={90} width={92} height={72} rx={4} fill={night ? '#26245e' : '#a8e0ff'} stroke="#a8804a" strokeWidth={4} />
      {night ? (
        <g>
          <Moon x={636} y={118} s={0.36} />
          <path d={sparkle(676, 106, 4)} fill="#fff8d0" />
          <path d={sparkle(668, 140, 3)} fill="#fff8d0" />
        </g>
      ) : (
        <g>
          <Cloud x={672} y={124} s={0.3} />
          <circle cx={626} cy={110} r={11} fill="#ffe680" stroke="#f0b400" strokeWidth={2} />
        </g>
      )}
      <path d="M635 92 L635 160 M665 92 L665 160" stroke="#8a6040" strokeWidth={5} />
      <rect x={598} y={160} width={104} height={9} rx={3} fill="#c9a06a" stroke="#a8804a" strokeWidth={2} />
      {/* the niche for the lamp */}
      <path d="M290 246 L290 196 Q318 172 346 196 L346 246 Z" fill="#b8925a" stroke="#a07a48" strokeWidth={3} />
      {/* clay jars on the floor */}
      {[[728, 352, 1.15], [770, 356, 0.9]].map(([jx, jy, k]) => (
        <g key={jx} transform={`translate(${jx} ${jy}) scale(${k})`}>
          <path d="M-12 -46 L12 -46 L10 -38 Q30 -26 26 -6 Q20 6 0 6 Q-20 6 -26 -6 Q-30 -26 -10 -38 Z" fill="#d38a58" stroke="#8a4a26" strokeWidth={2.4} strokeLinejoin="round" />
          <ellipse cx={0} cy={-46} rx={12} ry={3.4} fill="#8a4a26" />
          <path d="M-24 -18 Q0 -12 24 -18" stroke="#f2c08a" strokeWidth={3} fill="none" />
        </g>
      ))}
      <rect x={0} y={0} width={800} height={450} fill={`url(#${id}v)`} />
    </g>
  )
}

/** A heap of cut reeds lying on the ground, ready for weaving. (x, y): the middle of its foot. */
function ReedPile({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const reeds: [number, number, number, string][] = [[-50, 0, -4, '#8fc862'], [-46, -6, 3, '#a3d870'], [-54, -11, -2, '#7cbf5a'], [-44, -16, 5, '#b2dd7c'], [-48, -21, -3, '#94cc66']]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={58} ry={6} fill="#000" opacity={0.1} />
      {reeds.map(([rx, ry, tilt, c], i) => (
        <g key={i} transform={`rotate(${tilt} 0 ${ry})`}>
          <path d={`M${rx} ${ry - 2} L${-rx} ${ry - 4}`} stroke="#4f8a3a" strokeWidth={6.4} strokeLinecap="round" />
          <path d={`M${rx} ${ry - 2} L${-rx} ${ry - 4}`} stroke={c} strokeWidth={4} strokeLinecap="round" />
          <path d={`M${-rx} ${ry - 4} l9 -6 M${-rx} ${ry - 4} l11 1`} stroke="#8fd16a" strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

/** A little clay pot of the dark, sticky coating (tar and pitch), its brush standing in it. (x, y): its foot. */
function PitchPot({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={1} rx={22} ry={4} fill="#000" opacity={0.12} />
      <path d="M2 -20 L18 -56" stroke="#7a5233" strokeWidth={4.4} strokeLinecap="round" />
      <path d="M-17 -24 Q-22 -6 -12 0 L12 0 Q22 -6 17 -24 Z" fill="#c97a4a" stroke="#8a4a26" strokeWidth={2.2} strokeLinejoin="round" />
      <ellipse cx={0} cy={-24} rx={18} ry={5} fill="#a85f34" stroke="#8a4a26" strokeWidth={2} />
      <ellipse cx={0} cy={-24} rx={14} ry={3.4} fill="#2e1c10" />
      <path d="M-12 -21 Q-14 -14 -11 -12 Q-9 -15 -10 -21 Z M10 -21 Q12 -13 9 -11 Q7 -15 8 -21 Z" fill="#2e1c10" />
      <ellipse cx={-6} cy={-25} rx={3} ry={1} fill="#ffffff" opacity={0.6} />
      <path d="M-14 -12 Q0 -8 14 -12" stroke="#f2c08a" strokeWidth={2.4} fill="none" />
    </g>
  )
}

/** A woven ball, the kind children played with long ago. */
const ReedBall = ({ x, y, r = 11 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#e6a050" stroke="#9a5a26" strokeWidth={2} />
    <path d={`M${x - r} ${y} Q${x} ${y - r * 0.6} ${x + r} ${y} M${x - r * 0.8} ${y + r * 0.5} Q${x} ${y} ${x + r * 0.8} ${y + r * 0.5} M${x} ${y - r} Q${x - r * 0.5} ${y} ${x} ${y + r}`} stroke="#9a5a26" strokeWidth={1.6} fill="none" />
    <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.3} ry={r * 0.18} fill="#fff" opacity={0.5} />
  </g>
)

// ---------- The pages ----------

// 1. "Long ago, God's people lived in the land of Egypt. God blessed them, and their family grew and
// grew. Soon they were a big, big family!"
// Their village by the Nile, the pyramids beyond: a crowd of God's people, grandparents, moms and dads,
// children playing, and a brand new baby. God's light shines warm over them all.
const Page1 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Rays x={400} y={-90} r={560} n={14} color="#fff6c0" opacity={0.2} />
    <Cloud x={120} y={58} s={0.56} />
    <Cloud x={520} y={42} s={0.46} slow />
    <Sun x={714} y={70} s={0.6} />
    <path d="M0 188 Q170 178 340 186 Q540 176 800 184 L800 214 L0 214 Z" fill="#f0dcae" />
    <Pyramid x={128} y={198} w={150} h={90} />
    <Pyramid x={236} y={200} w={90} h={54} />
    <Palm x={340} y={206} s={0.36} />
    <Palm x={364} y={209} s={0.29} />
    <Palm x={626} y={204} s={0.38} />
    <Palm x={652} y={208} s={0.3} />
    <River y={206} y2={236} n={5} />
    {[[30, 238, 44], [292, 238, 38], [512, 238, 42], [770, 238, 46]].map(([px, py, ph], i) => <Papyrus key={px} x={px} y={py} h={ph} n={4} delay={-i * 0.8} />)}
    <path d="M0 234 Q200 226 400 236 T800 230 L800 450 L0 450 Z" fill="#ead2a0" />
    <MudHouse x={104} y={292} w={124} h={70} door={0.18} win={-0.25} />
    <MudHouse x={262} y={288} w={96} h={58} door={-0.15} win={0.22} />
    <Palm x={410} y={292} s={0.56} />
    <MudHouse x={548} y={292} w={108} h={64} door={0.2} win={-0.24} />
    <MudHouse x={702} y={290} w={130} h={72} door={-0.22} win={0.26} />
    <Tap say="What a big, big family!" sfx="pop">
      {[[34, 1, 0], [74, 6, 1], [116, 3, 0], [160, 8, 2], [204, 5, 0], [248, 2, 1], [292, 9, 0], [338, 4, 2], [384, 7, 0], [430, 1, 1], [476, 6, 0], [520, 3, 2], [566, 8, 0], [612, 5, 1], [656, 2, 0], [700, 9, 2], [746, 4, 0], [786, 7, 1]].map(([fx, i, kind], k) => (
        <Folk key={fx} x={fx} y={318 + (k % 3) * 4} s={0.54} i={i} child={kind === 1} wave={kind === 2} />
      ))}
    </Tap>
    <path d="M0 392 Q220 380 460 394 T800 386 L800 450 L0 450 Z" fill="#e2c48e" />
    <Tap say="God has blessed our family so much!" sfx="ding">
      <Figure x={62} y={436} s={0.8} look={HEBREWS.grandpa} holding="stick" blinkDelay={2.3} />
      <Figure x={138} y={440} s={0.78} look={HEBREWS.grandma} pose="wave" blinkDelay={0.7}><SilverHair /></Figure>
    </Tap>
    <Tap say="A brand new baby! Thank You, God!" sfx="good">
      <Figure x={276} y={438} s={0.86} look={HEBREWS.dad} pose="hug-right" reach={[null, [66, -84]]} blinkDelay={2.6} />
      <Figure x={352} y={440} s={0.84} look={HEBREWS.mom} pose="hold" mood="joy"><Baby x={0} y={-62} s={0.8} /></Figure>
    </Tap>
    <Tap say="Throw the ball! Catch!" sfx="pop">
      <Figure x={520} y={442} s={0.84} look={HEBREWS.girl} pose="arms-up" mood="joy" blinkDelay={0.4} />
      <ReedBall x={584} y={346} />
      <Figure x={648} y={442} s={0.84} look={HEBREWS.lass} pose="arms-up" blinkDelay={1.2} />
      <Figure x={736} y={444} s={0.84} look={HEBREWS.boy} pose="wave" mood="joy" blinkDelay={1.9} />
    </Tap>
    <Sparkles spots={[[300, 150, 7], [480, 130, 9], [420, 96, 6], [180, 140, 6], [600, 150, 7]]} />
  </Scene>
)

// 2. "Then a new king called Pharaoh was afraid of them, because there were so many. So he made God's
// people work very hard, making bricks all day long."
// Pharaoh stands worried on his palace terrace, looking at God's people. Below, they make bricks in the hot
// sun: shaping the mud, carrying bricks and straw and water, bricks drying in rows and stacked up.
const Page2 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sun x={96} y={74} s={0.8} />
    <Cloud x={400} y={60} s={0.5} slow />
    <path d="M0 214 Q200 204 400 212 T800 208 L800 450 L0 450 Z" fill="#f0d9a8" />
    <Pyramid x={250} y={214} w={120} h={68} />
    <Pyramid x={340} y={216} w={70} h={40} />
    <path d="M0 330 Q240 318 480 332 T800 326 L800 450 L0 450 Z" fill="#e6c58c" />
    {/* Pharaoh's palace terrace, high above the brick fields */}
    <rect x={540} y={250} width={270} height={84} fill="#ead6ae" stroke="#bf9a62" strokeWidth={3} />
    <rect x={540} y={262} width={270} height={6} fill="#3a6fc4" />
    <rect x={540} y={268} width={270} height={4} fill="#f2c94c" />
    <rect x={540} y={272} width={270} height={4} fill="#c0504d" />
    <rect x={532} y={242} width={286} height={10} rx={2} fill="#f3e4c4" stroke="#bf9a62" strokeWidth={2.5} />
    {[0, 1, 2, 3].map((k) => <rect key={k} x={500 + k * 10} y={334 - (k + 1) * 21} width={44 - k * 10} height={21} fill="#e3cc9c" stroke="#bf9a62" strokeWidth={2} />)}
    <Column x={566} y={244} h={168} w={30} />
    <Column x={790} y={244} h={168} w={30} />
    <rect x={540} y={22} width={280} height={14} fill="#f3e4c4" stroke="#bf9a62" strokeWidth={2.5} />
    <rect x={540} y={28} width={280} height={4} fill="#3a6fc4" />
    <Tap say="Oh no, there are so many of them!" sfx="wobble">
      <PharaohFig x={684} y={246} s={0.84} facing="left" mood="sad">
        <SweatDrop x={30} y={-136} />
      </PharaohFig>
    </Tap>
    {/* the brick fields */}
    <DryingBricks x={300} y={330} />
    <BrickStack x={44} y={362} rows={4} cols={3} />
    <BrickStack x={500} y={360} rows={3} cols={3} />
    <Tap say="Bricks, bricks, and more bricks!" sfx="pop">
      {[[372, 2], [418, 5], [464, 8]].map(([fx, i], k) => <Folk key={fx} x={fx} y={318 + k * 4} s={0.6} i={i} up load />)}
    </Tap>
    <ellipse cx={204} cy={434} rx={52} ry={13} fill="#8a5a36" stroke="#6a4224" strokeWidth={2} />
    <path d="M172 432 l10 -3 M204 438 l12 -2 M226 430 l8 3" stroke="#e8c45a" strokeWidth={2} strokeLinecap="round" />
    <Tap say="Squish, squish! Mud and straw make bricks." sfx="pop">
      <Figure x={100} y={444} s={1.08} look={HEBREWS.man} kneel pose="hold" item={<BrickMold x={0} y={-58} />} blinkDelay={1.5} />
    </Tap>
    <Tap say="Phew! These bricks are so heavy." sfx="plop">
      <Figure x={300} y={444} s={1.0} look={HEBREWS.dad} blinkDelay={0.6}>
        <BrickBasket x={-30} y={-46} />
        <BrickBasket x={30} y={-46} />
        <Grip x={-30} y={-46} skin={HEBREWS.dad.skin} />
        <Grip x={30} y={-46} skin={HEBREWS.dad.skin} />
      </Figure>
    </Tap>
    <Figure x={398} y={442} s={0.98} look={HEBREWS.mom} pose="hold" item={<Straw x={0} y={-64} />} blinkDelay={2.2} />
    <Figure x={482} y={446} s={0.98} look={HEBREWS.boy} pose="hold" item={<Jar x={0} y={-62} />} blinkDelay={1.1} />
  </Scene>
)

// 3. "Then Pharaoh made an unkind rule, and baby boys were not safe anymore. But God was watching over
// His people. And God had a plan!"
// Kept gentle: in his palace, Pharaoh holds up his rule on a scroll. At their house a family holds their
// baby close, and God's warm light shines down over them.
const Page3 = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <Cloud x={330} y={64} s={0.5} slow />
    <path d="M0 300 Q200 290 400 300 T800 296 L800 450 L0 450 Z" fill="#e8cd9a" />
    {/* Pharaoh's palace */}
    <rect x={-10} y={150} width={222} height={182} fill="#ecd9b0" stroke="#bf9a62" strokeWidth={3} />
    <rect x={-10} y={162} width={222} height={7} fill="#3a6fc4" />
    <rect x={-10} y={169} width={222} height={4} fill="#f2c94c" />
    <rect x={-10} y={173} width={222} height={4} fill="#c0504d" />
    <path d="M74 332 L74 238 Q104 218 134 238 L134 332 Z" fill="#a8804a" opacity={0.5} />
    <rect x={-10} y={322} width={230} height={14} fill="#e2c995" stroke="#bf9a62" strokeWidth={2.5} />
    <Column x={20} y={324} h={136} w={28} />
    <Column x={192} y={324} h={136} w={28} />
    <Tap say="Hmph! Here is my new rule." sfx="wobble">
      <PharaohFig x={104} y={326} s={0.74} pose="point" mood="grumpy" item={<OpenScroll x={60} y={-98} />} />
    </Tap>
    <Palm x={262} y={318} s={0.6} />
    {/* God's light, shining down on His people */}
    <Tap say="God loves His people. And God has a plan!" sfx="sparkle">
      <Rays x={560} y={-40} r={520} n={16} color="#fff8d0" opacity={0.3} />
      <Glow x={560} y={330} r={230} color="#fff4c0" />
      <Sparkles spots={[[470, 150, 9], [640, 120, 8], [560, 190, 6], [700, 180, 7], [410, 210, 6]]} color="#fffbe0" />
    </Tap>
    <MudHouse x={566} y={334} w={260} h={120} door={0.36} win={-0.32} />
    <Heart x={560} y={176} s={0.8} />
    <Heart x={618} y={196} s={0.5} color="#ffcf3f" />
    <Tap say="Dear God, please keep the babies safe." sfx="good">
      <Figure x={402} y={440} s={1.0} look={HEBREWS.girl} pose="pray" blinkDelay={0.5} />
      <Figure x={706} y={442} s={0.98} look={HEBREWS.grandma} pose="pray" blinkDelay={2.0}><SilverHair /></Figure>
    </Tap>
    <Tap say="Shh, little one. God is watching over us." sfx="pop">
      <Figure x={510} y={438} s={1.04} look={HEBREWS.mom} pose="hold" blinkDelay={1.4}><Baby x={0} y={-62} s={0.8} /></Figure>
      <Figure x={610} y={440} s={1.06} look={HEBREWS.dad} pose="hug-right" facing="left" reach={[null, [70, -85]]} blinkDelay={2.4} />
    </Tap>
  </Scene>
)

// 4. "One mom from God's people had a baby boy. He was a beautiful baby! His mom hid him at home and kept
// him safe for three whole months."
// Night in their little house, the curtain drawn across the door. His mom holds her sleeping baby close by
// the lamp; his big sister Miriam smiles at him; the cat is curled up nearby.
const Page4 = () => (
  <Scene sky="night" ground="none" stars={false}>
    <HomeRoom night />
    <OilLamp x={312} y={240} s={0.95} />
    <Mat x={440} y={412} s={1.5} />
    <Tap say="Purr, purr." sfx="pop">
      <Emoji e="🐱" x={210} y={390} size={74} />
    </Tap>
    <Tap say="I will keep you safe, my little one." sfx="good">
      <Figure x={420} y={418} s={1.32} look={JOCHEBED} kneel pose="hold" blinkDelay={1.1}>
        <Tap say="Shh! The baby is fast asleep." sfx="pop">
          <BabyMoses x={0} y={-62} s={0.86} mood="asleep" />
        </Tap>
      </Figure>
    </Tap>
    <Tap say="My baby brother is so beautiful!" sfx="ding">
      <MiriamGirl x={568} y={422} s={1.3} facing="left" pose="hold" mood="joy" />
    </Tap>
    <Sparkles spots={[[420, 230, 6], [500, 210, 5], [350, 260, 4]]} color="#fff3c0" />
  </Scene>
)

// 5. "When he got too big to hide, his mom made a little basket out of reeds. She coated it so no water
// could get in. Then she tucked her baby inside, snug and safe."
// Morning by the house near the river: the new basket, woven of reeds and coated dark underneath. His mom
// tucks him in; the pot of coating stands by with its brush; Miriam brings an armful of reeds.
const Page5 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={560} y={58} s={0.5} />
    <Cloud x={250} y={44} s={0.4} slow />
    <Birds spots={[[330, 112, 1], [362, 128, 0.8], [690, 132, 0.9]]} />
    <path d="M0 230 Q200 222 400 230 T800 226 L800 256 L0 256 Z" fill="#efd9a6" />
    <Palm x={470} y={242} s={0.42} />
    <Palm x={496} y={246} s={0.34} />
    <River y={250} y2={312} n={6} />
    {[[318, 316, 74], [600, 314, 84], [756, 316, 78]].map(([px, py, ph], i) => <Papyrus key={px} x={px} y={py} h={ph} n={5} delay={-i * 0.9} />)}
    <path d="M0 310 Q200 302 400 312 T800 306 L800 450 L0 450 Z" fill="#e2cd96" />
    <path d="M0 398 Q240 384 480 398 T800 390 L800 450 L0 450 Z" fill="#d9c088" />
    <MudHouse x={62} y={384} w={214} h={150} door={0.3} win={-0.2} />
    <Palm x={198} y={380} s={0.8} />
    <ReedPile x={142} y={444} s={1.0} />
    <Tap say="Here are more reeds, Mom!" sfx="ding">
      <MiriamGirl x={266} y={446} s={1.3} pose="hold" mood="joy" blinkDelay={0.8} item={<ReedBundle x={0} y={-62} />} />
    </Tap>
    <Tap say="Dab, dab! Now no water can get in." sfx="plop">
      <PitchPot x={372} y={448} s={1.3} />
    </Tap>
    <ellipse cx={490} cy={449} rx={92} ry={8} fill="#000" opacity={0.12} />
    <Tap say="A little basket boat, made of reeds!" sfx="pop">
      <ReedBasket x={490} y={392} s={1.42} lid="hood" baby="happy" />
    </Tap>
    <Tap say="Snug and safe, my little one." sfx="good">
      <Figure x={640} y={448} s={1.3} look={JOCHEBED} kneel facing="left" reach={[null, [72, -75]]} blinkDelay={1.6} />
    </Tap>
  </Scene>
)

// 6. "She set the basket in the tall reeds by the river Nile. And his big sister Miriam hid nearby, to watch
// over him."
// The Nile: the basket floats among the tall papyrus and reeds by the bank. His mom kneels on the bank and
// prays; Miriam peeks out from behind the reeds on the other side. A fish leaps, and an egret wades.
const Page6 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={640} y={52} s={0.55} />
    <Sun x={92} y={64} s={0.55} />
    <path d="M0 128 Q200 118 400 126 T800 122 L800 156 L0 156 Z" fill="#efd9a6" />
    <Palm x={150} y={136} s={0.42} />
    <Palm x={176} y={140} s={0.34} />
    <Palm x={610} y={132} s={0.42} />
    <River y={150} n={14} />
    {[[40, 158, 40], [250, 158, 34], [440, 158, 38], [720, 158, 42]].map(([px, py, ph], i) => <Papyrus key={px} x={px} y={py} h={ph} n={4} delay={-i * 0.6} />)}
    <Tap say="Hello, little basket!" sfx="pop">
      <Egret x={652} y={176} s={0.55} facing="left" />
    </Tap>
    <LeapingFish x={250} y={250} />
    {/* the near banks */}
    <path d="M-10 368 Q80 350 170 358 Q250 366 292 400 Q318 426 322 460 L-10 460 Z" fill="#cfae74" />
    <path d="M-10 368 Q80 350 170 358 Q250 366 292 400" stroke="#8fc862" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M590 460 Q600 414 650 396 Q720 376 810 384 L810 460 Z" fill="#cfae74" />
    <path d="M650 396 Q720 376 810 384" stroke="#8fc862" strokeWidth={6} fill="none" strokeLinecap="round" />
    {/* the basket in the tall reeds */}
    <Papyrus x={360} y={350} h={150} n={5} delay={-0.4} />
    <Papyrus x={526} y={352} h={170} n={6} delay={-1.3} />
    <Tap say="Bob, bob! The little basket floats in the reeds." sfx="plop">
      <g className="bm-bob">
        <ReedBasket x={440} y={362} s={1.1} lid="hood" baby="asleep" water />
      </g>
    </Tap>
    <Reeds x={352} y={404} h={66} />
    <Reeds x={530} y={404} h={58} flip />
    <WaterLily x={300} y={428} s={0.75} />
    <WaterLily x={586} y={440} s={0.66} />
    <LilyPad x={400} y={442} r={20} />
    <LilyPad x={478} y={430} r={16} notch={210} />
    <Tap say="Please keep my baby safe, God." sfx="good">
      <Figure x={164} y={384} s={1.0} look={JOCHEBED} kneel pose="pray" blinkDelay={1.2} />
    </Tap>
    <Tap say="I will watch over my baby brother." sfx="ding">
      <MiriamGirl x={712} y={404} s={1.02} facing="left" blinkDelay={0.6} />
    </Tap>
    <Papyrus x={680} y={410} h={150} n={5} delay={-2} />
    <Reeds x={690} y={414} h={74} />
    <Reeds x={752} y={418} h={64} flip />
  </Scene>
)

/** The bathing place on pages 7 to 9: the river, the far bank, and the stone steps with the palace wall at the top. */
const STEPS = { x: 642, y: 352 }
function BathingPlace({ children }: { children?: ReactNode }) {
  return (
    <g>
      <path d="M0 214 Q160 206 320 214 Q420 220 520 214 L520 240 L0 240 Z" fill="#efd9a6" />
      <Palm x={110} y={222} s={0.4} />
      <Palm x={134} y={226} s={0.32} />
      <River y={234} n={12} />
      {[[30, 242, 34], [210, 242, 30], [400, 242, 34]].map(([px, py, ph], i) => <Papyrus key={px} x={px} y={py} h={ph} n={4} delay={-i * 0.7} />)}
      <PalaceWall x1={470} x2={810} y={150} y2={238} />
      <Palm x={770} y={164} s={0.7} />
      <Column x={526} y={238} h={150} w={28} />
      <Column x={786} y={238} h={150} w={28} />
      <rect x={498} y={32} width={320} height={16} fill="#f3e4c4" stroke="#bf9a62" strokeWidth={2.5} />
      <rect x={498} y={38} width={320} height={4} fill="#3a6fc4" />
      <BathingSteps x={STEPS.x} y={STEPS.y} n={4} w={300} />
      {children}
    </g>
  )
}

// 7. "The little basket floated in the reeds, and Miriam watched. Then Pharaoh's daughter, the princess, came
// down to the river to wash. She saw the basket, and she sent her helper to bring it to her."
// The princess's bathing place: stone steps down into the river. The princess points at the basket in the
// reeds; one helper goes down to bring it, the other waits at the top with a jar. Miriam peeks out of the reeds.
const Page7 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={160} y={70} s={0.6} />
    <Cloud x={420} y={46} s={0.46} slow />
    <BathingPlace>
      <Tap say="Bob, bob." sfx="plop">
        <Papyrus x={268} y={352} h={120} n={4} delay={-0.5} />
        <g className="bm-bob">
          <ReedBasket x={330} y={364} s={0.95} lid="hood" baby="asleep" water />
        </g>
        <Reeds x={256} y={400} h={60} />
      </Tap>
      <WaterLily x={420} y={410} s={0.7} />
      <LilyPad x={240} y={424} r={18} />
      <Tap say="Look! What is that in the reeds?" sfx="ding">
        <Princess x={650} y={stepAt(STEPS.y, 2)} s={0.92} facing="left" pose="point" blinkDelay={0.9} />
      </Tap>
      <Helper i={1} x={748} y={stepAt(STEPS.y, 3)} s={0.86} facing="left" pose="hold" item={<Jar x={0} y={-62} />} blinkDelay={2.1} />
      <Tap say="I will bring it to you, Princess!" sfx="pop">
        <Helper i={0} x={528} y={stepAt(STEPS.y, 0)} s={0.88} facing="left" pose="point" blinkDelay={1.4} />
      </Tap>
      {/* Miriam, watching from the reeds */}
      <path d="M-10 404 Q60 388 140 396 Q196 404 214 460 L-10 460 Z" fill="#cfae74" />
      <Tap say="Oh! The princess sees the basket!" sfx="pop">
        <MiriamGirl x={92} y={440} s={0.98} mood="wow" blinkDelay={0.3} />
      </Tap>
      <Reeds x={60} y={446} h={76} />
      <Reeds x={132} y={448} h={66} flip />
    </BathingPlace>
  </Scene>
)

// 8. "The princess opened the basket. There was a baby boy, and he was crying! Waah! The princess felt so
// kind and loving toward him."
// Close up on the steps: the basket, its lid lifted off by a helper, and the baby crying in it. The
// princess kneels and reaches in to him, full of love; hearts float up.
const Page8 = () => {
  const y = 446, rise = 26, tread = 18
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={140} y={60} s={0.55} />
      <path d="M0 148 Q200 140 400 148 T800 144 L800 176 L0 176 Z" fill="#efd9a6" />
      <Palm x={90} y={156} s={0.4} />
      <River y={170} n={8} />
      <PalaceWall x1={150} x2={810} y={84} y2={232} />
      <Palm x={760} y={110} s={0.72} />
      <BathingSteps x={500} y={y} n={5} w={700} rise={rise} tread={tread} water={false} />
      <Helper i={1} x={650} y={stepAt(y, 3, rise, tread)} s={0.94} facing="left" mood="joy" pose="hold" blinkDelay={1.8} />
      <Tap say="Waah! Waah!" sfx="pop">
        <ReedBasket x={330} y={stepAt(y, 1, rise, tread) - 40 * 1.15} s={1.15} lid="off" baby="crying" />
      </Tap>
      <Tap say="Oh, little one, don't cry. I will take care of you." sfx="good">
        <Princess x={454} y={stepAt(y, 1, rise, tread)} s={1.05} facing="left" kneel reach={[null, [70, -79]]} blinkDelay={0.6} />
      </Tap>
      {/* the basket's lid, just lifted off and set down on the step */}
      <BasketLid x={228} y={stepAt(y, 1, rise, tread) - 4} s={0.62} tilt={-10} />
      <Tap say="Look, a baby boy!" sfx="ding">
        <Helper i={0} x={190} y={stepAt(y, 2, rise, tread)} s={1.0} mood="wow" pose="open" blinkDelay={1.1} />
      </Tap>
      <Tap say="The princess loves the baby." sfx="sparkle">
        <Heart x={400} y={226} s={0.8} />
        <Heart x={460} y={190} s={0.6} color="#ff9fc4" />
        <Heart x={344} y={200} s={0.5} color="#ffcf3f" />
      </Tap>
      {/* Miriam, still watching from the reeds by the water */}
      <path d="M-10 330 Q60 318 140 330 L150 460 L-10 460 Z" fill="#cfae74" />
      <MiriamGirl x={74} y={372} s={0.86} mood="wow" blinkDelay={0.9} />
      <Reeds x={44} y={380} h={60} />
      <Reeds x={112} y={382} h={54} flip />
    </Scene>
  )
}

// 9. "Miriam ran up and asked, "Shall I find someone to take care of the baby for you?" "Yes, go!" said the
// princess. So Miriam ran and brought the baby's very own mom!"
// Back at the bathing place: the princess holds the baby. Miriam comes along the riverbank, leading their
// mom by the hand, both so happy.
const Page9 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={160} y={70} s={0.6} />
    <Cloud x={420} y={46} s={0.46} slow />
    <BathingPlace>
      <ReedBasket x={520} y={stepAt(STEPS.y, 0) - 40 * 0.72} s={0.72} lid="off" baby="none" />
      <Helper i={1} x={760} y={stepAt(STEPS.y, 3)} s={0.86} facing="left" mood="joy" blinkDelay={2.1} />
      <Helper i={0} x={704} y={stepAt(STEPS.y, 2)} s={0.88} facing="left" pose="hold" blinkDelay={1.4} />
      <Tap say="Yes, go!" sfx="pop">
        <Princess x={612} y={stepAt(STEPS.y, 1)} s={0.98} facing="left" pose="hold" blinkDelay={0.9}>
          <Tap say="Coo!" sfx="pop">
            <BabyMoses x={0} y={-58} s={0.84} mood="awake" />
          </Tap>
        </Princess>
      </Tap>
      {/* the riverbank path to the steps */}
      <path d="M-10 384 Q150 364 330 372 Q440 378 496 398 L500 460 L-10 460 Z" fill="#d9be86" />
      <path d="M-10 384 Q150 364 330 372 Q440 378 496 398" stroke="#8fc862" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Papyrus x={40} y={386} h={130} n={5} delay={-0.3} />
      <Tap say="My baby! Thank You, God!" sfx="good">
        <Figure x={296} y={432} s={1.0} look={JOCHEBED} pose="open" mood="joy" reach={[null, [46, -40]]} blinkDelay={1.2} />
      </Tap>
      <Tap say="Shall I find someone to take care of the baby for you?" sfx="ding">
        <MiriamGirl x={368} y={434} s={1.0} pose="open" mood="joy" reach={[[-40, -56], null]} blinkDelay={0.5} />
      </Tap>
    </BathingPlace>
  </Scene>
)

// 10. "The princess said, "Please take care of this baby for me." So his mom took her baby home again! She
// took care of him until he was bigger."
// Home again, by day (the curtain tied back). Little Moses, bigger now, toddles to his mom's open arms;
// Miriam cheers; the cat watches.
const Page10 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <HomeRoom />
    <OilLamp x={312} y={240} s={0.95} />
    <Mat x={380} y={412} s={1.5} />
    <Tap say="Meow!" sfx="pop">
      <Emoji e="🐱" x={704} y={396} size={68} />
    </Tap>
    <Tap say="Come here, my little one! I love you so much." sfx="good">
      <Figure x={290} y={424} s={1.3} look={JOCHEBED} kneel pose="open" mood="joy" blinkDelay={1.1} />
    </Tap>
    <Tap say="Mama!" sfx="pop">
      <Figure x={430} y={430} s={0.8} look={MOSES_BOY} facing="left" pose="open" mood="joy" blinkDelay={0.4} />
    </Tap>
    <Tap say="Hooray! Look how big he is!" sfx="ding">
      <MiriamGirl x={580} y={430} s={1.3} facing="left" pose="arms-up" mood="joy" blinkDelay={0.7} />
    </Tap>
    <Heart x={384} y={290} s={0.7} />
    <Heart x={420} y={258} s={0.5} color="#ffcf3f" />
  </Scene>
)

// 11. "When he was older, he went to live with the princess, and she named him Moses. She said, "I pulled
// him out of the water.""
// The palace by the river. Little Moses holds the princess's hand and waves to his mom and Miriam, and they
// wave back, smiling: God is with him.
const Page11 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    {/* through the palace's open hall: the river, the papyrus and the far bank */}
    <Cloud x={300} y={92} s={0.5} />
    <path d="M0 196 Q200 188 400 196 T800 192 L800 222 L0 222 Z" fill="#efd9a6" />
    <Palm x={250} y={200} s={0.4} />
    <River y={216} y2={320} n={7} />
    {[[150, 316, 70], [460, 316, 80], [640, 316, 64]].map(([px, py, ph], i) => <Papyrus key={px} x={px} y={py} h={ph} n={5} delay={-i * 0.8} />)}
    {/* the palace: its painted top, two great columns, and the tiled floor */}
    <rect x={0} y={0} width={800} height={60} fill="#f1dfb4" />
    <rect x={0} y={46} width={800} height={6} fill="#3f7fd0" />
    <rect x={0} y={52} width={800} height={5} fill="#ffd34d" />
    {Array.from({ length: 21 }, (_, i) => {
      const fx = i * 40 + 20
      return (
        <g key={i}>
          <path d={`M${fx} 40 L${fx - 10} 16 Q${fx} 22 ${fx + 10} 16 Z`} fill={['#3f7fd0', '#d0503f', '#5fae6a'][i % 3]} />
          <circle cx={fx} cy={14} r={3} fill="#ffd34d" />
        </g>
      )
    })}
    <rect x={0} y={312} width={800} height={138} fill="#e3c48a" />
    <rect x={0} y={312} width={800} height={6} fill="#3f7fd0" />
    {[350, 392].map((ty) => <path key={ty} d={`M0 ${ty} L800 ${ty}`} stroke="#d2b074" strokeWidth={2} />)}
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${i * 80 + (i % 2) * 20} 318 L${i * 80 - 30 + (i % 2) * 20} 450`} stroke="#d2b074" strokeWidth={2} />)}
    <Column x={44} y={318} h={232} w={44} />
    <Column x={756} y={318} h={232} w={44} />
    <Helper i={1} x={668} y={412} s={0.9} facing="left" pose="hold" mood="joy" blinkDelay={2.2} />
    <Tap say="We love you, little brother!" sfx="pop">
      <MiriamGirl x={150} y={438} s={1.12} pose="wave" blinkDelay={0.5} />
    </Tap>
    <Tap say="God will always be with you, Moses." sfx="good">
      <Figure x={262} y={434} s={1.04} look={JOCHEBED} pose="wave" blinkDelay={1.3} />
    </Tap>
    <Tap say="I will call you Moses, because I pulled you out of the water!" sfx="ding">
      <Princess x={533} y={434} s={1.02} facing="left" mood="joy" reach={[null, [40, -28]]} blinkDelay={0.8} />
    </Tap>
    <Tap say="Moses! That is my name!" sfx="pop">
      <Figure x={470} y={438} s={0.88} look={MOSES_BOY} facing="left" pose="wave" mood="joy" reach={[[-34, -50], null]} blinkDelay={0.2} />
    </Tap>
  </Scene>
)

/** The child playing, on the riverbank (God takes care of you, too!). */
const Kid = ({ x, y, s }: { x: number; y: number; s: number }) => <Person x={x} y={y} s={s} look={usePlayer().look} pose="arms-up" />

// 12. "God kept baby Moses safe, and God had a big plan for him! And God takes care of you, too. He loves
// you so much."
// A golden evening on the Nile: baby Moses asleep in his basket in a pool of God's light, dreaming of his
// big plan (one day he will lead God's people), and you, on the riverbank, with a heart.
const Page12 = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <Rays x={250} y={216} r={620} n={18} color="#fff6d8" opacity={0.22} />
    <Sun x={250} y={222} s={0.8} />
    <path d="M0 204 Q200 196 400 204 T800 200 L800 222 L0 222 Z" fill="#f0cf98" />
    <Pyramid x={560} y={210} w={90} h={52} />
    <Pyramid x={630} y={212} w={56} h={32} />
    <River y={216} n={12} />
    <path d="M232 226 L268 226 L310 330 L190 330 Z" fill="#ffe7a0" opacity={0.3} />
    <Papyrus x={52} y={430} h={210} n={6} delay={-0.4} />
    <Papyrus x={128} y={444} h={160} n={5} delay={-1.5} />
    <Tap say="God kept baby Moses safe!" sfx="sparkle">
      <Glow x={330} y={340} r={150} color="#fff4c0" />
      <g className="bm-bob">
        <ReedBasket x={330} y={346} s={1.3} lid="hood" baby="asleep" water />
      </g>
      <Sparkles spots={[[250, 290, 8], [410, 280, 7], [330, 250, 6], [222, 360, 5], [440, 352, 6]]} color="#fffbe0" />
    </Tap>
    <WaterLily x={210} y={414} s={0.8} />
    <WaterLily x={452} y={420} s={0.7} />
    <LilyPad x={300} y={430} r={20} />
    <Tap say="One day, Moses will lead God's people!" sfx="ding">
      <Dream x={440} y={46} w={300} h={150} from={[372, 312]} to={[474, 206]} sky="#fff3d0">
        <path d="M430 172 Q560 150 760 166 L760 220 L430 220 Z" fill="#f2d39a" />
        <PillarOfCloud x={706} y={172} h={96} w={30} />
        {[[468, 178, 3], [494, 174, 7], [520, 178, 5], [546, 174, 1], [572, 178, 9]].map(([fx, fy, i], k) => <Folk key={fx} x={fx} y={fy} s={0.42} i={i} child={k === 2} />)}
        <Person x={624} y={182} s={0.54} look={MOSES} pose="point"><RaisedStaff /></Person>
      </Dream>
    </Tap>
    <path d="M520 460 Q560 414 640 404 Q730 394 810 404 L810 460 Z" fill="#d9be86" />
    <path d="M560 414 Q640 400 810 404" stroke="#8fc862" strokeWidth={6} fill="none" strokeLinecap="round" />
    <Reeds x={760} y={424} h={70} flip />
    <Tap say="God takes care of me, too!" sfx="good">
      <Kid x={660} y={440} s={1.04} />
    </Tap>
    <Heart x={660} y={286} s={0.8} />
  </Scene>
)

export const BABY_MOSES_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
