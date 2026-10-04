// Noah and the Big Boat: one illustration per story page, both parts in order (see data/noah.ts for the
// words). Part one (pages 1 to 5) builds the ark, a little more on every page; part two (pages 6 to 11)
// goes into the ark, through the rain, and out under the rainbow.
// The animals walk two by two, so they're drawn here side-on (the item pictures face us): Lion,
// Elephant and Giraffe, facing right or left, with a `tilt` for walking up or down the ark's ramp.
// Their heads (LionHead, ElephantHead, GiraffeNeck) also peek out of the ark. The ark is the kit's Ark,
// or its pieces (ArkHull, ArkHouse…) while it's being built; the build game (art/games/noah.tsx) uses them too.
// God is never drawn as a person: His presence is light.
import { useId, type CSSProperties, type ReactNode } from 'react'
import { CuteFace, darken, ink, Shine, useShade } from '../kit'
import { fluff } from '../items/draw'
import { Person, PEOPLE, SKIN, type Look } from '../people'
import { Ark, Cloud, Dove, Glow, House, Rainbow, Rays, Scene, Sea, Sheep, Sparkles, Tap, Tree } from './kit'

// ---------- Noah's family ----------

/** Noah's three sons (Genesis 6:10), grown men who helped build the ark. (For PEOPLE in people.tsx.) */
export const SHEM: Look = { skin: SKIN.medium, hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#5f8f5a', sash: '#e6c27a' }
export const HAM: Look = { skin: SKIN.tan, hair: 'curly', hairColor: '#2b1d14', beard: 'short', robe: '#c8743f', sash: '#f2dca0' }
export const JAPHETH: Look = { skin: SKIN.medium, hair: 'short', hairColor: '#6a4428', robe: '#3f8f9a', sash: '#f2d38a' }

/** Hands holding something in front (pose "hold"), drawn again over what they hold. In figure units.
 * `apart`: how far each hand is from the middle, for something held round its sides (a sack). */
const Hands = ({ look, apart = 8, y = -60 }: { look: Look; apart?: number; y?: number }) => (
  <>{[-apart, apart].map((hx) => <circle key={hx} cx={hx} cy={y} r={7} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />)}</>
)

// ---------- The animals, side-on ----------

const FUR = '#ffc65a', MANE = '#e0862a'
const GREY = '#a9b5cc'
const COAT = '#ffcf5e', SPOT = '#d4843a', HOOF = '#7a5236'

/** Where a side-on animal stands: (x, y) is its feet on the ground; `tilt` turns it to walk up or down a ramp. */
type Walker = { x: number; y: number; s?: number; facing?: 'left' | 'right'; tilt?: number }
type Part = { x: number; y: number; s?: number; w?: number }

function Walk({ x, y, s = 1, facing = 'right', tilt = 0, children }: Walker & { children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${facing === 'left' ? -s : s} ${s})`}>{children}</g>
}

const shadow = (rx: number) => <ellipse cx={0} cy={-1} rx={rx} ry={rx / 10} fill="#000" opacity={0.12} />

/** A lion's head in its big fluffy mane, turned to us. (x, y) is the middle of its face; `w` is the outline width; `sleepy`: eyes shut. */
export function LionHead({ x, y, s = 1, w = 2.5, sleepy }: Part & { sleepy?: boolean }) {
  const fur = useShade(FUR, 0.4, 0.15)
  const mane = useShade(MANE, 0.3, 0.18)
  const line = ink(FUR)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{fur.def}{mane.def}</defs>
      <path d={fluff(0, 0, 21, 20, 11)} fill={mane.fill} stroke={ink(MANE)} strokeWidth={w} strokeLinejoin="round" />
      {[-10, 10].map((ex) => (
        <g key={ex}>
          <circle cx={ex} cy={-13} r={5} fill={fur.fill} stroke={line} strokeWidth={w * 0.8} />
          <circle cx={ex} cy={-13} r={2.3} fill="#ff9fb8" />
        </g>
      ))}
      <ellipse cx={0} cy={1} rx={13} ry={12.5} fill={fur.fill} stroke={line} strokeWidth={w} />
      <ellipse cx={0} cy={7} rx={7} ry={5} fill="#fff1d6" />
      <path d="M-3 3.5 Q0 2 3 3.5 Q1.5 6.5 0 6.8 Q-1.5 6.5 -3 3.5 Z" fill="#7a3b2a" />
      <path d="M0 6.8 L0 8.5 M0 8.5 Q-2.5 10.5 -4 9 M0 8.5 Q2.5 10.5 4 9" stroke="#7a3b2a" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      {sleepy ? (
        <g>
          {[-1, 1].map((d) => <path key={d} d={`M${d * 4.6 - 2.6} -1.6 Q${d * 4.6} 1 ${d * 4.6 + 2.6} -1.6`} stroke="#2b2140" strokeWidth={1.4} fill="none" strokeLinecap="round" />)}
          {[-1, 1].map((d) => <ellipse key={`c${d}`} cx={d * 7.4} cy={2.6} rx={2.2} ry={1.4} fill="#ff7fb0" opacity={0.55} />)}
        </g>
      ) : <CuteFace x={0} y={-1} s={0.3} gap={13} mouth={false} />}
    </g>
  )
}

/** A lion walking side-on: a golden body on four legs, a tufted tail and a big mane. */
export function Lion(p: Walker) {
  const fur = useShade(FUR, 0.4, 0.15)
  const line = ink(FUR)
  const w = 2.6 / (p.s ?? 1)
  return (
    <Walk {...p}>
      <defs>{fur.def}</defs>
      {shadow(34)}
      {[-22, 12].map((lx) => <rect key={lx} x={lx} y={-26} width={9} height={25} rx={4} fill={darken(FUR, 0.14)} stroke={line} strokeWidth={w} />)}
      {[-31, 4].map((lx) => <rect key={lx} x={lx} y={-26} width={10} height={26} rx={4.5} fill={fur.fill} stroke={line} strokeWidth={w} />)}
      <path d="M-30 -36 Q-42 -36 -45 -52" stroke={line} strokeWidth={w * 1.3} fill="none" strokeLinecap="round" />
      <path d={fluff(-45, -55, 4.5, 5.5, 5)} fill={MANE} stroke={ink(MANE)} strokeWidth={w * 0.8} />
      <ellipse cx={-4} cy={-33} rx={30} ry={14.5} fill={fur.fill} stroke={line} strokeWidth={w} />
      <Shine x={-16} y={-40} rx={7} ry={3.5} />
      <LionHead x={25} y={-50} w={w} />
    </Walk>
  )
}

/**
 * A lion lying down asleep (facing right): its long body low on the ground, the back leg folded along its
 * side, its tail out behind along the ground, and its head resting on its front paws. (x, y): the
 * ground under its middle.
 */
export function SleepyLion({ x, y, s = 1, facing = 'right' }: Walker) {
  const fur = useShade(FUR, 0.4, 0.15)
  const line = ink(FUR)
  const w = 2.6 / s
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{fur.def}</defs>
      {shadow(46)}
      <path d="M-40 -10 Q-54 -12 -57 -4" stroke={line} strokeWidth={w * 1.5} fill="none" strokeLinecap="round" />
      <path d={fluff(-58, -3, 4.8, 4.2, 5)} fill={MANE} stroke={ink(MANE)} strokeWidth={w * 0.8} />
      {/* the front paws, stretched out on the floor for its head to rest on */}
      <ellipse cx={38} cy={-4.5} rx={9} ry={4.2} fill={darken(FUR, 0.12)} stroke={line} strokeWidth={w} />
      <ellipse cx={33} cy={-3.2} rx={10} ry={4.4} fill={fur.fill} stroke={line} strokeWidth={w} />
      {/* its body, the rump a little higher than the shoulders */}
      <path d="M-44 -2 Q-48 -24 -28 -28 Q-6 -31 12 -24 Q24 -18 22 -2 Z" fill={fur.fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
      <Shine x={-24} y={-23} rx={8} ry={3} />
      {/* the back leg folded along its side, its paw tucked in under the belly */}
      <path d="M-40 -3 Q-42 -21 -27 -22 Q-14 -21 -14 -6" stroke={line} strokeWidth={w * 0.85} fill="none" strokeLinecap="round" />
      <ellipse cx={-10} cy={-3.4} rx={7} ry={3.4} fill={fur.fill} stroke={line} strokeWidth={w * 0.9} />
      <LionHead x={24} y={-20} s={0.82} w={w / 0.82} sleepy />
    </g>
  )
}

/** An elephant's head turned to us: a big floppy ear, a little tusk and a trunk curling at the tip. (x, y) is the middle of its head. */
export function ElephantHead({ x, y, s = 1, w = 2.5 }: Part) {
  const skin = useShade(GREY, 0.4, 0.16)
  const line = ink(GREY)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{skin.def}</defs>
      <path d="M-3 10 C1 22 3 32 1 41 C0 50 11 53 18 46 C20 43 18 40 15 42 C12 44 9 43 10 39 C13 29 13 19 12 8 Z" fill={skin.fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
      <path d="M1.5 25 q4.5 2 10 0 M2 33 q4 2 8.5 0" stroke={line} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.6} />
      <circle cx={0} cy={0} r={22} fill={skin.fill} stroke={line} strokeWidth={w} />
      <path d="M11 13 C14 19 18 21 24 20 C19 18 16 15 15 11 Z" fill="#f7f1e6" stroke="#c9bda6" strokeWidth={1.4} strokeLinejoin="round" />
      <ellipse cx={-17} cy={3} rx={14} ry={19} transform="rotate(-8 -17 3)" fill={skin.fill} stroke={line} strokeWidth={w} />
      <ellipse cx={-17} cy={4} rx={8.5} ry={13} transform="rotate(-8 -17 4)" fill="#ffbccf" />
      <CuteFace x={6} y={-3} s={0.34} gap={11} mouth={false} />
      <Shine x={-1} y={-12} rx={5} ry={3} />
    </g>
  )
}

/** An elephant walking side-on: a big grey body on four sturdy legs, a little tail, and its head and trunk in front. */
export function Elephant(p: Walker) {
  const skin = useShade(GREY, 0.4, 0.16)
  const line = ink(GREY)
  const w = 2.6 / (p.s ?? 1)
  const leg = (lx: number, far: boolean) => (
    <g key={lx}>
      <rect x={lx} y={-52} width={18} height={51} rx={7} fill={far ? darken(GREY, 0.14) : skin.fill} stroke={line} strokeWidth={w} />
      {!far && [-4.5, 0, 4.5].map((d) => <ellipse key={d} cx={lx + 9 + d} cy={-4} rx={2} ry={1.5} fill="#f7f1e6" />)}
    </g>
  )
  return (
    <Walk {...p}>
      <defs>{skin.def}</defs>
      {shadow(54)}
      {[-42, 14].map((lx) => leg(lx, true))}
      {[-33, 24].map((lx) => leg(lx, false))}
      <path d="M-52 -70 Q-61 -60 -58 -46" stroke={line} strokeWidth={w * 1.3} fill="none" strokeLinecap="round" />
      <ellipse cx={-58} cy={-44} rx={3} ry={4.5} fill={darken(GREY, 0.45)} />
      <ellipse cx={-6} cy={-66} rx={48} ry={30} fill={skin.fill} stroke={line} strokeWidth={w} />
      <Shine x={-24} y={-82} rx={12} ry={5} />
      <ElephantHead x={42} y={-74} w={w} />
    </Walk>
  )
}

/** A giraffe's long spotty neck and its head, turned to us. (x, y) is the bottom of the neck. */
export function GiraffeNeck({ x, y, s = 1, w = 2.5 }: Part) {
  const coat = useShade(COAT, 0.4, 0.15)
  const line = ink(COAT)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{coat.def}</defs>
      <path d="M-9 4 C-3 -22 5 -46 12 -66 L25 -62 C18 -40 12 -18 9 2 Z" fill={coat.fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
      <path d="M-5.5 -6 C-1 -26 5 -44 11 -60" stroke={SPOT} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {[[4, -18, 3.6, 20], [9.5, -35, 3.2, -10], [15, -51, 2.8, 30]].map(([cx, cy, r, a]) => (
        <ellipse key={cy} cx={cx} cy={cy} rx={r * 1.25} ry={r} transform={`rotate(${a} ${cx} ${cy})`} fill={SPOT} />
      ))}
      {/* little horns (ossicones), ears, then the head and pale muzzle */}
      {[[19, -77, 17, -88], [27, -79, 27, -90]].map(([x0, y0, x1, y1]) => (
        <g key={x0}>
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={line} strokeWidth={5} strokeLinecap="round" />
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={COAT} strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={x1} cy={y1} r={2.6} fill={SPOT} stroke={ink(SPOT)} strokeWidth={1.2} />
        </g>
      ))}
      <ellipse cx={12} cy={-76} rx={6} ry={2.8} transform="rotate(-28 12 -76)" fill={coat.fill} stroke={line} strokeWidth={w * 0.8} />
      <ellipse cx={35} cy={-80} rx={5.5} ry={2.6} transform="rotate(26 35 -80)" fill={coat.fill} stroke={line} strokeWidth={w * 0.8} />
      <ellipse cx={24} cy={-70} rx={12} ry={9.5} transform="rotate(18 24 -70)" fill={coat.fill} stroke={line} strokeWidth={w} />
      <ellipse cx={31} cy={-65} rx={7} ry={5.5} transform="rotate(18 31 -65)" fill="#fff2d2" stroke={ink('#fff2d2')} strokeWidth={w * 0.7} />
      <circle cx={30} cy={-66} r={1} fill={SPOT} /><circle cx={34} cy={-64.5} r={1} fill={SPOT} />
      <CuteFace x={23} y={-72} s={0.26} gap={12} mouth={false} />
      <Shine x={18} y={-75} rx={3} ry={1.8} />
    </g>
  )
}

/** A giraffe walking side-on: long legs, a spotty body, a tufted tail and a very long neck. */
export function Giraffe(p: Walker) {
  const coat = useShade(COAT, 0.4, 0.15)
  const line = ink(COAT)
  const w = 2.6 / (p.s ?? 1)
  const leg = (lx: number, far: boolean) => (
    <g key={lx}>
      <rect x={lx} y={-60} width={7.5} height={59} rx={3} fill={far ? darken(COAT, 0.14) : coat.fill} stroke={line} strokeWidth={w} />
      <rect x={lx - 0.4} y={-7} width={8.3} height={6} rx={2} fill={HOOF} />
    </g>
  )
  return (
    <Walk {...p}>
      <defs>{coat.def}</defs>
      {shadow(36)}
      {[-24, 14].map((lx) => leg(lx, true))}
      {[-31, 7].map((lx) => leg(lx, false))}
      <path d="M-31 -71 Q-39 -62 -38 -48" stroke={line} strokeWidth={w * 1.1} fill="none" strokeLinecap="round" />
      <ellipse cx={-38} cy={-45} rx={2.6} ry={4.2} fill={SPOT} />
      <GiraffeNeck x={12} y={-68} w={w} />
      <ellipse cx={-6} cy={-70} rx={28} ry={14} fill={coat.fill} stroke={line} strokeWidth={w} />
      {[[-20, -73, 5, 15], [-6, -77, 5.5, -20], [9, -72, 4.5, 10], [-13, -63, 4.2, -5], [1, -62, 4, 25], [-27, -66, 3.2, 0]].map(([cx, cy, r, a]) => (
        <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx={r * 1.2} ry={r} transform={`rotate(${a} ${cx} ${cy})`} fill={SPOT} />
      ))}
      <Shine x={-18} y={-78} rx={7} ry={3} />
    </Walk>
  )
}

/**
 * A dove sitting on a perch, side-on (facing right): its wing folded along its side, its tail out
 * behind, and both feet holding on. (x, y): its feet on the perch.
 */
export function PerchedDove({ x, y, s = 1, facing = 'right' }: Walker) {
  const line = '#b9cce6'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <path d="M-13 -13 L-33 -6 Q-31 -1 -34 3 Q-29 4 -30 8 L-11 -5 Z" fill="#fff" stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-3 -5 L-4 0 M5 -5 L6 0" stroke="#f0907a" strokeWidth={2.6} strokeLinecap="round" />
      <ellipse cx={0} cy={-15} rx={17} ry={11.5} transform="rotate(-14 0 -15)" fill="#fff" stroke={line} strokeWidth={2.5} />
      <circle cx={13} cy={-29} r={9} fill="#fff" stroke={line} strokeWidth={2.5} />
      <path d="M21.5 -31 l8 2.6 l-8 2.6 Z" fill="#ffb347" stroke="#e08a2a" strokeWidth={1} strokeLinejoin="round" />
      <circle cx={15.6} cy={-31} r={2} fill="#2b2140" />
      <circle cx={15} cy={-31.6} r={0.7} fill="#fff" />
      <path d="M9 -20 C1 -24 -12 -20 -22 -10 C-10 -8 1 -8 9 -12 Z" fill="#f2f6fc" stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-4 -16 Q-10 -13 -16 -10" stroke="#dbe5f3" strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

// ---------- The ark, the sea and the ramp ----------

/** A point on the ark's ramp (t = 0 at the door, 1 at the ground) for an Ark at (ax, ay) scale as, and the ramp's slope. */
export const onRamp = (t: number, ax: number, ay: number, as: number): [number, number] => [ax + (-5 - 206 * t) * as, ay + (-40 + 98 * t) * as]
export const RAMP_TILT = -25.4

// The kit Ark's own pieces (scenes/kit.tsx, Ark with its door and ramp), each in the ark's units, so the
// story can show it part-built and the build game can hand them out one by one. Drawn in this order
// (house, roof, windows, door, hull, ramp), they are the kit's Ark exactly.
export function ArkHull() {
  const wood = useShade('#b5794a', 0.25, 0.2)
  return (
    <g>
      <defs>{wood.def}</defs>
      <path d="M-170 -40 L170 -40 L130 30 L-130 30 Z" fill={wood.fill} stroke="#6f3f18" strokeWidth={4} strokeLinejoin="round" />
      {[-20, -2, 16].map((ly) => <path key={ly} d={`M${-160 + (ly + 20)} ${ly} L${160 - (ly + 20)} ${ly}`} stroke="#8a5428" strokeWidth={2.5} />)}
    </g>
  )
}
export const ArkHouse = () => <rect x={-90} y={-110} width={180} height={70} rx={10} fill="#d9a36a" stroke="#8a5428" strokeWidth={4} />
export const ArkRoof = () => <path d="M-104 -110 L0 -150 L104 -110 Z" fill="#a0612f" stroke="#6f3f18" strokeWidth={4} strokeLinejoin="round" />
export const ArkWindows = () => <>{[-50, 50].map((wx) => <rect key={wx} x={wx - 12} y={-96} width={24} height={20} rx={4} fill="#6b4422" />)}</>
export const ArkDoor = () => <rect x={-16} y={-82} width={32} height={42} rx={4} fill="#5a3a20" stroke="#3b2414" strokeWidth={3} />
export function ArkRamp() {
  return (
    <g>
      <path d="M-18 -40 L8 -40 L-196 58 L-226 58 Z" fill="#c98a52" stroke="#6f3f18" strokeWidth={3} strokeLinejoin="round" />
      {[0.2, 0.4, 0.6, 0.8].map((t) => <path key={t} d={`M${-18 - 208 * t} ${-40 + 98 * t} l26 0`} stroke="#8a5428" strokeWidth={2.5} strokeLinecap="round" />)}
    </g>
  )
}

/** Something drawn in the ark's own units, for an ark at (x, y) scale s. */
const AtArk = ({ x, y, s, children }: { x: number; y: number; s: number; children: ReactNode }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>
)

/** The sea's waves again, on top of something so it sits in the water (the same shapes as kit Sea at y 300):
 * "back" is the light swell (over a hill's foot), "front" the deep waves and white crests (over a boat's bottom). */
function Waves({ layer }: { layer: 'back' | 'front' }) {
  const y = 300
  const row = (dy: number) => Array.from({ length: 12 }, () => `q40 ${dy} 80 0`).join(' ')
  if (layer === 'back') return <path className="sc-wave" d={`M-80 ${y} ${row(-16)} L880 450 L-80 450 Z`} fill="#6cc0f2" />
  return (
    <g>
      {/* (#469cdc is the deep wave's colour as it looks over the swell: #3f96d8 at 85%) */}
      <path className="sc-wave slow" d={`M-80 ${y + 40} ${row(-14)} L880 450 L-80 450 Z`} fill="#469cdc" />
      {[[120, y + 70], [420, y + 100], [650, y + 60]].map(([x, yy], i) => <path key={i} className="sc-wave" d={`M${x} ${yy} q12 -8 24 0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />)}
    </g>
  )
}

/** The front of the ark's hull again (as kit Ark draws it), so someone can stand on the deck behind it. */
const HullFront = ({ x, y, s }: { x: number; y: number; s: number }) => <AtArk x={x} y={y} s={s}><ArkHull /></AtArk>

/** Someone looking out of one of the ark's windows (wx: -50, 0 or 50), clipped to the window. In the ark's own units. */
export function InWindow({ wx, children }: { wx: number; children: ReactNode }) {
  const id = `win${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs><clipPath id={id}><rect x={wx - 12} y={-96} width={24} height={20} rx={4} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  )
}

// ---------- Building things ----------

const PLANK = '#c98448', PLANK_LINE = '#8a5428'

/** A wooden board from (x1, y1) to (x2, y2), `t` thick. */
function Board({ x1, y1, x2, y2, t = 10 }: { x1: number; y1: number; x2: number; y2: number; t?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${a})`}>
      <rect x={0} y={-t / 2} width={len} height={t} rx={3} fill={PLANK} stroke={PLANK_LINE} strokeWidth={2.5} />
      <path d={`M${len * 0.08} ${-t * 0.08} L${len * 0.55} ${-t * 0.08} M${len * 0.64} ${t * 0.16} L${len * 0.92} ${t * 0.16}`} stroke="#a86a34" strokeWidth={1.4} strokeLinecap="round" />
    </g>
  )
}

/** A pile of boards for the ark. (x, y): the middle of its bottom, on the ground. */
export function WoodPile({ x, y, s = 1, n = 3 }: { x: number; y: number; s?: number; n?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={-52 + (i % 2) * 6} y={-12 - i * 12} width={104} height={12} rx={4} fill={PLANK} stroke={PLANK_LINE} strokeWidth={2.5} />
      ))}
    </g>
  )
}

/** A sawhorse with a board lying across it. (x, y): the ground under its middle. */
export function Sawhorse({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const leg = (x1: number, x2: number, far: boolean) => (
    <g key={x1}>
      <path d={`M${x1} -42 L${x2} -2`} stroke={far ? '#6f3f18' : PLANK_LINE} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${x1} -42 L${x2} -2`} stroke={far ? '#a86a34' : PLANK} strokeWidth={4} strokeLinecap="round" />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {leg(-26, -18, true)}{leg(26, 18, true)}
      {leg(-32, -44, false)}{leg(32, 44, false)}
      <rect x={-46} y={-50} width={92} height={10} rx={3} fill={PLANK} stroke={PLANK_LINE} strokeWidth={2.5} />
    </g>
  )
}

/** A saw held at its handle (x, y), its blade pointing along `a` degrees, the teeth underneath. */
export function Saw({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  const teeth = Array.from({ length: 14 }, (_, i) => `L${62 - i * 4} ${7.5 + (i % 2 ? 0 : 3.2)}`).join(' ')
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <path d={`M6 -6 L64 -2.5 L64 6 ${teeth} L6 8.5 Z`} fill="#cdd4de" stroke="#6b7385" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M12 -2 L58 0.6" stroke="#eef1f6" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M-9 -9 L9 -9 L9 9 L-9 9 Q-15 0 -9 -9 Z" fill="#a0612f" stroke="#6f3f18" strokeWidth={2} strokeLinejoin="round" />
    </g>
  )
}

/** A bundle of hay tied in the middle. (x, y): its middle. */
export function HayBundle({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <path d="M-34 -12 Q-41 0 -34 12 L-6 5 L6 5 L34 12 Q41 0 34 -12 L6 -5 L-6 -5 Z" fill="#f2d16b" stroke="#c9a040" strokeWidth={2} strokeLinejoin="round" />
      {[-9, -3, 3, 9].map((ly) => <path key={ly} d={`M-33 ${ly * 1.1} L-8 ${ly * 0.4} M8 ${ly * 0.4} L33 ${ly * 1.1}`} stroke="#d9b24a" strokeWidth={1.4} strokeLinecap="round" />)}
      <path d="M-36 -8 l-5 -3 M-37 6 l-5 3 M36 -8 l5 -3 M37 6 l5 3" stroke="#e0b84a" strokeWidth={1.6} strokeLinecap="round" />
      <rect x={-6} y={-6.5} width={12} height={13} rx={2} fill="#a0703f" stroke="#6b4422" strokeWidth={1.5} />
    </g>
  )
}

/** A big soft heap of hay. (x, y): the middle of its bottom. */
export function Haystack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-62 0 Q-62 -38 -30 -54 Q0 -66 30 -54 Q62 -38 62 0 Z" fill="#f2d16b" stroke="#c9a040" strokeWidth={2.5} strokeLinejoin="round" />
      {[[-40, -12, -30, -34], [-18, -6, -10, -44], [6, -8, 10, -50], [26, -10, 34, -38], [-30, -30, -16, -52], [16, -30, 26, -50]].map(([x1, y1, x2, y2]) => (
        <path key={`${x1}${y1}`} d={`M${x1} ${y1} Q${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2} ${x2} ${y2}`} stroke="#d9b24a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      ))}
      <path d="M-8 -60 l-6 -10 M2 -61 l2 -11 M12 -59 l7 -9" stroke="#e0b84a" strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

/** A low bed of hay on the floor. (x, y): the middle of its bottom; w: how wide. */
export function HayBed({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2} 0 Q${-w / 2 + 6} -16 ${-w / 4} -18 Q0 -24 ${w / 4} -18 Q${w / 2 - 6} -16 ${w / 2} 0 Z`} fill="#f2d16b" stroke="#c9a040" strokeWidth={2.5} strokeLinejoin="round" />
      {Array.from({ length: Math.round(w / 26) }, (_, i) => -w / 2 + 14 + i * 26).map((hx) => (
        <path key={hx} d={`M${hx} -4 q4 -8 10 -10`} stroke="#d9b24a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      ))}
    </g>
  )
}

/** A woven basket heaped with red apples and purple grapes. (x, y): the middle of its bottom. */
export function FruitBasket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[[-12, -30], [-4, -27], [-8, -36], [0, -33]].map(([gx, gy]) => <circle key={`${gx}${gy}`} cx={gx} cy={gy} r={5} fill="#9a5bc0" stroke="#6a3a8a" strokeWidth={1.4} />)}
      {[[10, -28], [-18, -24]].map(([ax, ay]) => (
        <g key={ax}>
          <circle cx={ax} cy={ay} r={8} fill="#ff5d5d" stroke="#c03a3a" strokeWidth={1.6} />
          <path d={`M${ax} ${ay - 7} l1 -4`} stroke="#6b4422" strokeWidth={1.6} strokeLinecap="round" />
          <ellipse cx={ax - 2.5} cy={ay - 3} rx={2} ry={1.4} fill="#fff" opacity={0.6} />
        </g>
      ))}
      <path d="M-26 -22 L26 -22 L20 0 L-20 0 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-24 -15 L24 -15 M-22 -8 L22 -8" stroke="#8a5428" strokeWidth={1.8} />
    </g>
  )
}

/** A sack of grain, tied at the top (`open`: its top rolled down to show the grain). (x, y): the middle of its bottom. */
export function GrainSack({ x, y, s = 1, open }: { x: number; y: number; s?: number; open?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {open ? (
        <g>
          <path d="M-22 0 Q-29 -22 -20 -38 L20 -38 Q29 -22 22 0 Q0 4 -22 0 Z" fill="#dcc08a" stroke="#a88a50" strokeWidth={2.5} strokeLinejoin="round" />
          <ellipse cx={0} cy={-38} rx={20} ry={6} fill="#f0cf6a" stroke="#a88a50" strokeWidth={2} />
          {[[-9, -39], [-3, -41], [4, -39], [10, -40], [0, -37], [-6, -36], [7, -36]].map(([gx, gy]) => <ellipse key={`${gx}${gy}`} cx={gx} cy={gy} rx={2} ry={1.3} fill="#d9a84a" />)}
          <path d="M-21 -33 Q0 -27 21 -33" stroke="#a88a50" strokeWidth={2} fill="none" />
        </g>
      ) : (
        <g>
          <path d="M-20 0 Q-27 -22 -14 -38 L14 -38 Q27 -22 20 0 Q0 4 -20 0 Z" fill="#dcc08a" stroke="#a88a50" strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M-11 -38 Q-15 -48 -6 -50 Q0 -46 6 -50 Q15 -48 11 -38 Z" fill="#dcc08a" stroke="#a88a50" strokeWidth={2} strokeLinejoin="round" />
          <path d="M-13 -38 L13 -38" stroke="#8a5428" strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
      {/* an ear of wheat on the sack: grain inside */}
      <path d="M0 -6 L0 -26" stroke="#b08a40" strokeWidth={1.6} strokeLinecap="round" />
      {[-24, -19, -14].map((wy) => <path key={wy} d={`M0 ${wy} q-5 -2 -6 -6 q5 1 6 5 Z M0 ${wy} q5 -2 6 -6 q-5 1 -6 5 Z`} fill="#c9a050" />)}
    </g>
  )
}

/** A wooden ladder from its feet (x1, y1) up to its top (x2, y2). */
export function Ladder({ x1, y1, x2, y2, w = 24 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${a})`}>
      {Array.from({ length: Math.floor((len - 10) / 20) }, (_, i) => 12 + i * 20).map((rx) => (
        <path key={rx} d={`M${rx} ${-w / 2} L${rx} ${w / 2}`} stroke={PLANK_LINE} strokeWidth={5} strokeLinecap="round" />
      ))}
      {[-w / 2, w / 2].map((ry) => (
        <g key={ry}>
          <path d={`M0 ${ry} L${len} ${ry}`} stroke={PLANK_LINE} strokeWidth={7} strokeLinecap="round" />
          <path d={`M0 ${ry} L${len} ${ry}`} stroke={PLANK} strokeWidth={3.5} strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

// A hammer swings down every 0.9s (pa-hammer); a little burst of lines flashes as it hits the wood.
const BANG_CSS = '.scene .noah-bang{animation:noahbang .9s ease-in-out infinite;transform-box:fill-box;transform-origin:center}'
  + '@keyframes noahbang{0%,38%{opacity:0;transform:scale(.4)}48%{opacity:1;transform:scale(1)}68%,100%{opacity:0;transform:scale(1.25)}}'

/** The burst where a hammer hits (x, y): needs BANG_CSS on the page. For someone with the pose "hammer"
 * at (px, py) scale ps, it's at (px + 85 ps, py - 127 ps), or (px - 85 ps, …) facing left. */
function Bang({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g className="noah-bang">
      {[-160, -115, -70, -25].map((a) => {
        const r = (a * Math.PI) / 180
        const d = `M${x + Math.cos(r) * 9 * s} ${y + Math.sin(r) * 9 * s} L${x + Math.cos(r) * 21 * s} ${y + Math.sin(r) * 21 * s}`
        return <g key={a}><path d={d} stroke="#d98a1a" strokeWidth={6 * s} strokeLinecap="round" /><path d={d} stroke="#fff2a8" strokeWidth={2.6 * s} strokeLinecap="round" /></g>
      })}
    </g>
  )
}

/** "Z z z" floating up over someone asleep, from (x, y). */
export function Snooze({ x, y }: { x: number; y: number }) {
  const z = (zx: number, zy: number, k: number) => `M${zx} ${zy} h${7 * k} l${-7 * k} ${8 * k} h${7 * k}`
  return (
    <g className="sc-float" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[[0, 0, 0.8], [12, -16, 1.1], [26, -36, 1.4]].map(([zx, zy, k]) => (
        <g key={zx}>
          <path d={z(x + zx, y + zy, k)} stroke="#7a5236" strokeWidth={5} />
          <path d={z(x + zx, y + zy, k)} stroke="#fff7e0" strokeWidth={2.4} />
        </g>
      ))}
    </g>
  )
}

// ---------- The pages: part one, building the ark ----------

// 1. "Long ago there was a man named Noah. God loved Noah, and Noah loved God."
const Page1 = () => (
  <Scene sky="day" ground="meadow">
    {/* God's love, shown as light shining down on Noah */}
    <Rays x={400} y={-40} r={620} n={16} color="#fff6c0" opacity={0.24} />
    <Tap say="God loves Noah. And God loves you, too!" sfx="sparkle">
      <Glow x={400} y={60} r={200} />
      <Sparkles spots={[[330, 150], [470, 130, 10], [400, 100, 6]]} />
    </Tap>
    <House x={620} y={330} w={90} />
    <Tap say="Yummy fruit!" sfx="pop">
      <Tree x={160} y={350} s={1.1} fruit="#ff6b6b" />
    </Tap>
    <Tap say="I love God, and God loves me!" sfx="good">
      <Person x={400} y={400} s={1.25} look={PEOPLE.noah} pose="pray" />
    </Tap>
  </Scene>
)

// 2. "God told Noah, 'A big flood is coming. Build a great big boat called an ark!' … Bang, bang, bang!"
// Noah's hammer swings down onto the new planks, and the little burst of lines flashes as it hits.

/** Over kit Ark's `building` hull (same x, y, s): the bow and stern posts, and a second row of planks
 * going on from the bow, so it reads as a boat being built (not a fence). */
function HullWork({ x, y, s }: { x: number; y: number; s: number }) {
  const wood = useShade('#b5794a', 0.25, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{wood.def}</defs>
      <path d="M-155.1 -14 L40 -14 L40 8 L-142.6 8 Z" fill={wood.fill} stroke="#6f3f18" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-148.9 -3 L40 -3" stroke="#8a5428" strokeWidth={2} />
      <path d="M-170 -40 L-130 30 M170 -40 L130 30" stroke="#6f3f18" strokeWidth={7} strokeLinecap="round" />
    </g>
  )
}

const Page2 = () => {
  const ax = 510, ay = 335, as = 1.65
  const nx = 363, ny = 412, ns = 0.75
  return (
    <Scene sky="day" ground="hills">
      <style>{BANG_CSS}</style>
      <Rays x={60} y={-60} r={560} n={14} color="#fff6c0" opacity={0.14} />
      <Tap say="A great big boat, just like God said!" sfx="wobble">
        <Ark x={ax} y={ay} s={as} building still />
        <HullWork x={ax} y={ay} s={as} />
      </Tap>
      <Tap say="Wood for the ark!" sfx="plop">
        {[0, 1, 2].map((i) => <rect key={i} x={22 + (i % 2) * 6} y={402 + i * 13} width={104} height={12} rx={4} fill="#c98448" stroke="#8a5428" strokeWidth={2.5} />)}
      </Tap>
      <Tap say="Here is another board, Noah!" sfx="pop">
        <Person x={228} y={418} s={0.66} look={PEOPLE.noahsWife} pose="hold" blinkDelay={1.4}>
          {/* carrying a board for the ark */}
          <rect x={-40} y={-67} width={98} height={11} rx={3} fill="#c98448" stroke="#8a5428" strokeWidth={2.5} />
          <path d="M-33 -61.5 L52 -61.5" stroke="#a86a34" strokeWidth={1.5} />
          {[-8, 8].map((hx) => <circle key={hx} cx={hx} cy={-60} r={7} fill={SKIN.medium} stroke={ink(SKIN.medium)} strokeWidth={2} />)}
        </Person>
      </Tap>
      <Tap say="Bang, bang, bang! I am building the ark, just like God said." sfx="ding">
        <Person x={nx} y={ny} s={ns} look={PEOPLE.noah} pose="hammer" holding="hammer" />
      </Tap>
      <Bang x={nx + 85 * ns} y={ny - 127 * ns} />
    </Scene>
  )
}

// 3. "Noah's three sons helped him build. They sawed the wood and carried big, long boards. Everyone
// worked hard, day after day." The hull is finished now, and the house on it is going up: Noah, on the
// deck, nails a board to its frame. Shem saws at the sawhorse; Ham and Japheth carry a long board together.

/** The house's frame going up on the deck (ark units): four posts, the top beam over three of them,
 * and the board Noah is nailing on. */
function HouseFrame() {
  const post = (px: number) => <rect key={px} x={px - 5} y={-110} width={10} height={72} rx={2} fill={PLANK} stroke={PLANK_LINE} strokeWidth={2.5} />
  return (
    <g>
      {[-86, -30, 30, 86].map(post)}
      <rect x={-93} y={-116} width={130} height={10} rx={2} fill={PLANK} stroke={PLANK_LINE} strokeWidth={2.5} />
      <rect x={-91} y={-88} width={126} height={9} rx={2} fill={PLANK} stroke={PLANK_LINE} strokeWidth={2.5} />
    </g>
  )
}

const Page3 = () => {
  const ax = 545, ay = 332, as = 1.3
  const nx = 528, ny = ay - 30 * as, ns = 0.56 // Noah, on the deck behind the hull's front
  const [h1, h2] = [{ x: 352, y: 440, s: 0.66, look: HAM }, { x: 478, y: 444, s: 0.64, look: JAPHETH }]
  return (
    <Scene sky="day" ground="hills" sun>
      <style>{BANG_CSS}</style>
      <Tap say="Bang, bang! Thank you for helping, my sons!" sfx="ding">
        <AtArk x={ax} y={ay} s={as}><HouseFrame /></AtArk>
        <Person x={nx} y={ny} s={ns} look={PEOPLE.noah} pose="hammer" holding="hammer" />
      </Tap>
      <HullFront x={ax} y={ay} s={as} />
      <Bang x={nx + 85 * ns} y={ny - 127 * ns} s={0.75} />
      <Tap say="So much wood for the ark!" sfx="plop">
        <WoodPile x={64} y={404} s={0.78} />
      </Tap>
      <Tap say="Zzzt, zzzt! I am sawing the wood." sfx="swish">
        <Sawhorse x={226} y={420} s={0.66} />
        <Board x1={176} y1={383} x2={276} y2={383} t={7} />
        {[[203, 394], [207, 403], [201, 411]].map(([dx, dy]) => <circle key={dy} cx={dx} cy={dy} r={1.8} fill="#f2dcae" />)}
        <Person x={138} y={414} s={0.62} look={SHEM} pose="point" blinkDelay={0.6}>
          <Saw x={54} y={-90} a={33} />
          <circle cx={54} cy={-90} r={7} fill={SHEM.skin} stroke={ink(SHEM.skin)} strokeWidth={2} />
        </Person>
      </Tap>
      <Tap say="Heave, ho! This board is so long!" sfx="pop">
        {[h1, h2].map((h, i) => <Person key={i} x={h.x} y={h.y} s={h.s} look={h.look} pose="hold" blinkDelay={1.1 + i * 1.2} />)}
        <Board x1={304} y1={h1.y - 40} x2={526} y2={h2.y - 37} t={9} />
        {[h1, h2].flatMap((h, i) => [-8, 8].map((hx) => (
          <circle key={`${i}${hx}`} cx={h.x + hx * h.s} cy={h.y - 60 * h.s} r={7 * h.s} fill={h.look.skin} stroke={ink(h.look.skin)} strokeWidth={1.4} />
        )))}
      </Tap>
    </Scene>
  )
}

// 4. "God said, 'Bring food for your family and for the animals, too.' So they carried in baskets of
// fruit, sacks of grain, and lots and lots of hay!" The house is up (its roof still only a frame), and
// the family carries the food up the ramp: Noah's wife with fruit, Ham with hay, Shem with a sack.

/** The roof's frame (ark units), before its boards go on: the two sloping beams and three struts. */
function RoofFrame() {
  const beam = (d: string) => (
    <g key={d}>
      <path d={d} stroke={PLANK_LINE} strokeWidth={9} strokeLinecap="round" />
      <path d={d} stroke={PLANK} strokeWidth={4.5} strokeLinecap="round" />
    </g>
  )
  return <g>{['M-50 -110 L-50 -130', 'M0 -110 L0 -148', 'M50 -110 L50 -130', 'M-102 -110 L0 -149', 'M102 -110 L0 -149'].map(beam)}</g>
}

const Page4 = () => {
  const ax = 600, ay = 328, as = 1.12
  const [hx, hy] = onRamp(0.42, ax, ay, as) // Ham, halfway up the ramp
  const [sx, sy] = onRamp(0.84, ax, ay, as) // Shem, just starting up
  return (
    <Scene sky="day" ground="hills">
      <Rays x={60} y={-60} r={560} n={14} color="#fff6c0" opacity={0.14} />
      <AtArk x={ax} y={ay} s={as}><RoofFrame /><ArkHouse /><ArkWindows /><ArkDoor /><ArkHull /><ArkRamp /></AtArk>
      <Tap say="Up the ramp we go!" sfx="pop">
        <Person x={hx} y={hy} s={0.5} look={HAM} pose="hold" blinkDelay={0.5}>
          <HayBundle x={0} y={-62} s={1.15} />
          <Hands look={HAM} />
        </Person>
        <Person x={sx} y={sy} s={0.54} look={SHEM} pose="hold" blinkDelay={2.1}>
          <GrainSack x={0} y={-36} s={0.95} />
          {/* (hugging it at its sides: two hands on the front of the sack looked like a face) */}
          <Hands look={SHEM} apart={21} y={-56} />
        </Person>
      </Tap>
      <Tap say="Hay, and grain, and fruit. So much food!" sfx="swish">
        <Haystack x={80} y={402} s={1.05} />
        <GrainSack x={34} y={436} s={0.9} open />
        <GrainSack x={84} y={444} s={0.95} />
        <FruitBasket x={132} y={446} s={0.95} />
      </Tap>
      <Tap say="Yummy apples and grapes!" sfx="pop">
        <Person x={302} y={428} s={0.62} look={PEOPLE.noahsWife} pose="hold" blinkDelay={1.4}>
          <FruitBasket x={0} y={-49} s={1.05} />
          {/* (holding it by its sides, like Shem's sack) */}
          <Hands look={PEOPLE.noahsWife} apart={24} y={-62} />
        </Person>
      </Tap>
      <Tap say="Thank You, God, for all this food!" sfx="good">
        <Person x={204} y={432} s={0.64} look={PEOPLE.noah} pose="point" />
      </Tap>
    </Scene>
  )
}

// 5. "At last, the ark was almost ready. It was big and strong, with a roof, windows, and a door, just
// like God said." The last boards are going on the roof: Japheth, up a ladder, hammers one in. The rest
// of the family watches from the ground.

/** The roof with its last boards still to go on (ark units): boarded up to x = 30, a new board from 30
 * to 46 going on now, and beyond it only the frame, with the sky showing through. */
function AlmostRoof() {
  const id = `rf${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const top = (x: number) => -110 - 40 * (1 - x / 104) // the roof's top edge
  const beam = (d: string) => (
    <g key={d}>
      <path d={d} stroke={PLANK_LINE} strokeWidth={8} strokeLinecap="round" />
      <path d={d} stroke={PLANK} strokeWidth={4} strokeLinecap="round" />
    </g>
  )
  return (
    <g>
      {[`M62 -110 L62 ${top(62)}`, `M84 -110 L84 ${top(84)}`, 'M102 -110 L28 -138.5'].map(beam)}
      <defs><clipPath id={id}><rect x={-120} y={-160} width={150} height={60} /></clipPath></defs>
      <g clipPath={`url(#${id})`}><ArkRoof /></g>
      <path d={`M30 -110 L30 ${top(30)} L46 ${top(46)} L46 -110 Z`} fill="#b8763e" stroke="#6f3f18" strokeWidth={3} strokeLinejoin="round" />
    </g>
  )
}

const Page5 = () => {
  const ax = 520, ay = 330, as = 1.25
  const js = 0.46, jx = ax + 46 * as + 85 * js, jy = ay - 122 * as + 127 * js // Japheth on the ladder, hammering the new board's edge
  return (
    <Scene sky="day" ground="hills">
      <style>{BANG_CSS}</style>
      <Rays x={520} y={-80} r={620} n={16} color="#fff6c0" opacity={0.18} />
      <Tap say="It is so big and strong!" sfx="wobble">
        <AtArk x={ax} y={ay} s={as}><ArkHouse /><AlmostRoof /><ArkWindows /><ArkDoor /></AtArk>
      </Tap>
      <Ladder x1={632} y1={285} x2={602} y2={185} w={22} />
      <Tap say="Bang, bang! Just a few more boards." sfx="ding">
        <Person x={jx} y={jy} s={js} look={JAPHETH} pose="hammer" holding="hammer" facing="left" blinkDelay={0.8} />
      </Tap>
      <HullFront x={ax} y={ay} s={as} />
      <AtArk x={ax} y={ay} s={as}><ArkRamp /></AtArk>
      <Bang x={jx - 85 * js} y={jy - 127 * js} s={0.7} />
      <Tap say="Hooray! Good work, everyone!" sfx="pop">
        <Person x={52} y={432} s={0.62} look={PEOPLE.noahsWife} pose="arms-up" blinkDelay={1.6} />
        <Person x={112} y={438} s={0.64} look={SHEM} pose="wave" blinkDelay={0.4} />
        <Person x={172} y={434} s={0.64} look={HAM} pose="arms-up" blinkDelay={2.4} />
      </Tap>
      <Tap say="Look! The ark is almost ready!" sfx="good">
        <Person x={240} y={430} s={0.68} look={PEOPLE.noah} pose="point" />
      </Tap>
    </Scene>
  )
}

// ---------- The pages: part two, safe in the ark ----------

// 6. "Noah's family built the big ark, just like God said. Then God said, 'It is time. Go into the ark,
// with your family and the animals.'" God's light shines on Noah; his family goes up the ramp, two sheep
// wait their turn, and grey clouds are coming in from the right.
const Page6 = () => {
  const ax = 560, ay = 320, as = 1.2
  const up = [[0.13, PEOPLE.noahsWife, 'wave'], [0.37, JAPHETH, 'stand'], [0.6, HAM, 'stand'], [0.83, SHEM, 'stand']] as const
  return (
    <Scene sky="day" ground="hills" clouds={false}>
      <Rays x={150} y={-70} r={620} n={16} color="#fff6c0" opacity={0.26} />
      <Cloud x={130} y={80} s={0.9} />
      <Tap say="Rumble, rumble. Here comes the rain!" sfx="wobble">
        <Cloud x={660} y={64} s={1.25} grey />
        <Cloud x={770} y={118} s={0.95} grey slow />
      </Tap>
      <Ark x={ax} y={ay} s={as} door ramp still />
      <Tap say="In we go!" sfx="pop">
        {up.map(([t, look, pose], i) => {
          const [px, py] = onRamp(t, ax, ay, as)
          return <Person key={i} x={px} y={py} s={0.42} look={look} pose={pose} blinkDelay={i * 0.7} />
        })}
      </Tap>
      <Tap say="Yes, God. We will go in, just like You said." sfx="good">
        <Glow x={214} y={350} r={110} />
        <Person x={214} y={424} s={0.66} look={PEOPLE.noah} pose="pray" />
      </Tap>
      <Tap say="Baa! Wait for us!" sfx="pop">
        <Sheep x={64} y={428} s={0.75} />
        <Sheep x={128} y={438} s={0.8} />
      </Tap>
    </Scene>
  )
}

// 7. "Then the animals came, two by two! Lions and elephants and giraffes, too."
// Up the ramp into the ark, with Noah waving them in at the door. Sizes go by real life: the giraffes
// are the tallest, then the elephants, then the lions (Noah in the doorway is as tall as the door).
const Page7 = () => {
  const ax = 580, ay = 305, as = 1.25
  const [l1x, l1y] = onRamp(0.3, ax, ay, as)
  const [l2x, l2y] = onRamp(0.62, ax, ay, as)
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="Look how tall we are!" sfx="pop">
        <Giraffe x={64} y={352} s={1} />
        <Giraffe x={150} y={346} s={0.97} />
      </Tap>
      <Ark x={ax} y={ay} s={as} door ramp still />
      <Tap say="Come in, come in, two by two!" sfx="good">
        <Person x={ax} y={ay - 40 * as} s={0.37} look={PEOPLE.noah} pose="wave" facing="left" />
      </Tap>
      <Tap say="Roar! Here we come!" sfx="pop">
        <Lion x={l1x} y={l1y} s={0.55} tilt={RAMP_TILT} />
        <Lion x={l2x} y={l2y} s={0.55} tilt={RAMP_TILT} />
      </Tap>
      <Tap say="Toot, toot! Two big elephants!" sfx="wobble">
        <Elephant x={252} y={398} s={0.95} />
        <Elephant x={110} y={410} s={1} />
      </Tap>
    </Scene>
  )
}

// 8. "The rain fell and fell. But Noah, his family, and all the animals were safe inside the ark."
// Warm lights in the windows, faces looking out, and a giraffe's head through the roof hatch. The
// ark and everyone in it rock together; the deep waves are drawn again over the hull so it floats.
const Page8 = () => {
  const ax = 400, ay = 322, as = 1.4
  return (
    <Scene sky="storm" ground="none" rain>
      <Cloud x={120} y={60} s={1.4} grey />
      <Cloud x={340} y={36} s={1.6} grey slow />
      <Cloud x={700} y={70} s={1.3} grey />
      <Sea y={300} />
      <Glow x={400} y={225} r={200} color="#ffe9a0" />
      <Tap say="Safe and dry inside the ark!" sfx="wobble">
        <g className="sc-rock">
          <Ark x={ax} y={ay} s={as} lit still />
          {/* (in the ark's own units, so they rock with it) */}
          <g transform={`translate(${ax} ${ay}) scale(${as})`}>
            <ellipse cx={52} cy={-122} rx={13} ry={4.5} fill="#4a2c14" />
            <Tap say="It is cozy in here!" sfx="pop">
              <GiraffeNeck x={52} y={-120} s={0.64} />
            </Tap>
            <rect x={37} y={-125.5} width={30} height={7} rx={3} fill="#8a5428" stroke="#5a3418" strokeWidth={2} />
            <InWindow wx={-50}>
              <Tap say="We are safe! God is keeping us safe." sfx="good">
                <Person x={-50} y={-86 + 114 * 0.34} s={0.34} look={PEOPLE.noah} />
              </Tap>
            </InWindow>
            <InWindow wx={0}>
              <LionHead x={0} y={-85} s={0.44} />
            </InWindow>
            <InWindow wx={50}>
              <Tap say="Toot, toot!" sfx="wobble">
                <ElephantHead x={50} y={-88} s={0.34} />
              </Tap>
            </InWindow>
          </g>
        </g>
      </Tap>
      <Waves layer="front" />
    </Scene>
  )
}

// 9. "It rained for forty days and forty nights. Inside the ark, Noah's family fed the animals and took
// good care of them." Inside, by lamplight: Noah brings hay to the elephants (bigger than him, as in real
// life), his wife cuddles a lamb (its mother beside her), two doves sit on the beam, the lions sleep, and
// the food they brought is on the shelf. Rain at the window.

/** The ark's inside: plank walls, a beam, two posts between the stalls, and the floor. */
function Inside() {
  return (
    <g>
      <rect width={800} height={450} fill="#c48a55" />
      {Array.from({ length: 16 }, (_, i) => i * 52).map((px) => <rect key={px} x={px} y={0} width={50} height={380} fill={px % 104 ? '#bd8250' : '#c68c58'} />)}
      {Array.from({ length: 16 }, (_, i) => i * 52 + 50).map((px) => <path key={px} d={`M${px + 1} 0 L${px + 1} 380`} stroke="#a46d3c" strokeWidth={3} />)}
      <rect x={0} y={372} width={800} height={78} fill="#a8743f" />
      {[396, 422].map((fy) => <path key={fy} d={`M0 ${fy} L800 ${fy}`} stroke="#8f5f30" strokeWidth={2.5} />)}
      <path d="M0 372 L800 372" stroke="#7a4f26" strokeWidth={4} />
      {[250, 548].map((px) => <rect key={px} x={px - 11} y={70} width={22} height={306} rx={3} fill="#9a6234" stroke="#5a3418" strokeWidth={3} />)}
      <rect x={-10} y={50} width={820} height={26} rx={3} fill="#8a5428" stroke="#5a3418" strokeWidth={3} />
      {[120, 400, 680].map((px) => <circle key={px} cx={px} cy={63} r={3.2} fill="#5a3418" />)}
    </g>
  )
}

/** A window in the ark's wall, its shutters open, with the rain falling outside. */
export function RainyWindow({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const id = `rw${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        <clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={6} /></clipPath>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4d5a70" /><stop offset="1" stopColor="#93a1b5" /></linearGradient>
      </defs>
      {[-1, 1].map((side) => {
        const sx = side < 0 ? x - 30 : x + w + 4
        return <rect key={side} x={sx} y={y + 2} width={26} height={h - 4} rx={3} fill="#9a6234" stroke="#5a3418" strokeWidth={2.5} />
      })}
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}s)`} />
        <Cloud x={x + w * 0.3} y={y + 18} s={0.7} grey />
        <Cloud x={x + w * 0.85} y={y + 30} s={0.55} grey slow />
        <g className="sc-rain">
          {Array.from({ length: 14 }, (_, i) => {
            const rx = x + ((i * 37) % (w + 20)), ry = y + ((i * 29) % h) - 10
            return <path key={i} d={`M${rx} ${ry} l-5 15`} stroke="#d6ecff" strokeWidth={2.6} strokeLinecap="round" opacity={0.85} style={{ animationDelay: `${(i % 7) * 0.12}s` } as CSSProperties} />
          })}
        </g>
      </g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke="#6f3f18" strokeWidth={7} />
      <path d={`M${x - 6} ${y + h + 4} L${x + w + 6} ${y + h + 4}`} stroke="#8a5428" strokeWidth={7} strokeLinecap="round" />
    </g>
  )
}

/** A little oil lantern hanging from the beam at (x, y), glowing. */
export function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Glow x={x} y={y + 52} r={170} color="#ffd970" />
      <path d={`M${x} ${y} L${x} ${y + 34}`} stroke="#5a3418" strokeWidth={2.5} />
      <path d={`M${x - 9} ${y + 40} L${x + 9} ${y + 40} L${x + 5} ${y + 34} L${x - 5} ${y + 34} Z`} fill="#6f3f18" />
      <rect x={x - 11} y={y + 40} width={22} height={28} rx={6} fill="#ffe9a0" stroke="#c9902a" strokeWidth={2.5} />
      <g className="pa-twinkle"><path d={`M${x} ${y + 46} Q${x + 6} ${y + 56} ${x} ${y + 62} Q${x - 6} ${y + 56} ${x} ${y + 46} Z`} fill="#ff9a3c" /></g>
      <rect x={x - 9} y={y + 68} width={18} height={5} rx={2} fill="#6f3f18" />
    </g>
  )
}

/** A wooden shelf on the wall at (x, y), w wide, with the food on it: clay jars of grain and a basket of fruit. */
function FoodShelf({ x, y, w }: { x: number; y: number; w: number }) {
  const jar = (jx: number, h: number) => (
    <g key={jx}>
      <path d={`M${jx - 9} ${y} Q${jx - 15} ${y - h * 0.55} ${jx - 7} ${y - h} L${jx + 7} ${y - h} Q${jx + 15} ${y - h * 0.55} ${jx + 9} ${y} Z`} fill="#c8794a" stroke="#8a4a26" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={jx - 8} y={y - h - 4} width={16} height={5} rx={2} fill="#a85f34" stroke="#8a4a26" strokeWidth={1.8} />
      <path d={`M${jx - 11} ${y - h * 0.5} Q${jx} ${y - h * 0.42} ${jx + 11} ${y - h * 0.5}`} stroke="#e8b48a" strokeWidth={2} fill="none" />
    </g>
  )
  return (
    <g>
      {jar(x + 26, 30)}{jar(x + 56, 36)}{jar(x + 86, 28)}
      <FruitBasket x={x + w - 40} y={y} s={0.9} />
      <rect x={x} y={y} width={w} height={9} rx={2} fill="#9a6234" stroke="#5a3418" strokeWidth={2.5} />
      {[x + 14, x + w - 14].map((bx) => <path key={bx} d={`M${bx} ${y + 9} L${bx} ${y + 22} L${bx + (bx < x + w / 2 ? 12 : -12)} ${y + 9}`} stroke="#5a3418" strokeWidth={3} fill="none" strokeLinejoin="round" />)}
    </g>
  )
}

const Page9 = () => {
  const noah = { x: 264, y: 428, s: 0.76 }
  const wife = { x: 402, y: 426, s: 0.74 }
  return (
    <Scene sky="storm" ground="none" clouds={false}>
      <Inside />
      <RainyWindow x={604} y={118} w={140} h={88} />
      <Lantern x={400} y={76} />
      <FoodShelf x={286} y={238} w={226} />
      <HayBed x={128} y={420} w={200} />
      <Tap say="Munch, munch! Thank you for the hay, Noah!" sfx="chomp">
        {/* the one behind stands further back, so its head and back show over the one in front */}
        <Elephant x={110} y={378} s={1} />
        <Elephant x={150} y={420} s={1.15} />
        <Person x={noah.x} y={noah.y} s={noah.s} look={PEOPLE.noah} pose="hold">
          <HayBundle x={0} y={-62} s={0.78} />
          <Hands look={PEOPLE.noah} />
        </Person>
      </Tap>
      <Tap say="Coo, coo!" sfx="swish">
        <PerchedDove x={304} y={50} s={0.95} />
        <PerchedDove x={382} y={50} s={0.95} facing="left" />
      </Tap>
      <Tap say="There, there, little lamb. You are safe with me." sfx="pop">
        <Sheep x={494} y={432} s={0.66} facing="left" />
        <Person x={wife.x} y={wife.y} s={wife.s} look={PEOPLE.noahsWife} pose="hold" blinkDelay={1.2}>
          <Sheep x={4} y={-42} s={0.5} />
          <Hands look={PEOPLE.noahsWife} />
        </Person>
      </Tap>
      {[[572, 434], [604, 441], [664, 438], [700, 442], [758, 437], [782, 443]].map(([sx, sy]) => (
        <path key={sx} d={`M${sx} ${sy} q5 -7 11 -8 M${sx + 4} ${sy + 1} q6 -4 12 -3`} stroke="#e8c86a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      ))}
      <Tap say="Shh! The lions are fast asleep." sfx="pop">
        <SleepyLion x={614} y={426} s={1.05} />
        <SleepyLion x={728} y={430} s={1.05} facing="left" />
        <Snooze x={676} y={352} />
      </Tap>
    </Scene>
  )
}

// 10. "When the rain stopped, the water went down, down, down. Noah sent out a little dove. The dove came
// back with an olive leaf! There was dry land again." The dove flies back to Noah's hand (Genesis 8:9),
// from the green hill where a little olive tree is growing.
const Page10 = () => {
  const ax = 245, ay = 322, as = 1.05
  return (
    <Scene sky="day" ground="none" sun>
      <Sea y={300} />
      <Tap say="Dry land! A little olive tree is growing." sfx="ding">
        <path d="M545 330 C590 268 640 232 700 226 C745 222 780 236 800 248 L800 330 Z" fill="#8fd18a" stroke="#6cae66" strokeWidth={3} strokeLinejoin="round" />
        <path d="M640 330 C676 292 728 274 800 272 L800 330 Z" fill="#7cc46a" />
        {[[606, 270], [656, 246], [780, 254]].map(([gx, gy]) => <path key={gx} d={`M${gx} ${gy} l-3 -8 M${gx} ${gy} l0 -10 M${gx} ${gy} l3 -8`} stroke="#4f9a4a" strokeWidth={2} fill="none" strokeLinecap="round" />)}
        <Tree x={735} y={232} s={0.55} fruit="#4f5d2a" />
      </Tap>
      <Waves layer="back" />
      <g className="sc-rock">
        <Ark x={ax} y={ay} s={as} still />
        <Tap say="Welcome back, little dove!" sfx="good">
          <Person x={ax + 122 * as} y={ay - 30 * as} s={0.5} look={PEOPLE.noah} pose="point" />
        </Tap>
        <HullFront x={ax} y={ay} s={as} />
      </g>
      <Waves layer="front" />
      <Tap say="Coo, coo! I found a leaf!" sfx="swish">
        <Dove x={482} y={222} s={1.35} leaf facing="left" />
      </Tap>
      <Sparkles spots={[[690, 172, 6], [786, 206, 5], [610, 214, 5]]} />
    </Scene>
  )
}

// 11. "God put a beautiful rainbow in the sky. It was His promise: …" The rainbow's ends go behind the
// near hill (drawn again over them), and the animals come down out of the ark.
const FRONT_HILL = 'M0 360 Q200 320 420 355 T800 345 L800 450 L0 450 Z' // (kit ground "hills", front layer)

const Page11 = () => {
  const ax = 624, ay = 338, as = 0.98
  const [l1x, l1y] = onRamp(0.34, ax, ay, as)
  const [l2x, l2y] = onRamp(0.66, ax, ay, as)
  return (
    <Scene sky="dawn" ground="hills" clouds={false}>
      <Tap say="Red, orange, yellow, green, blue, purple!" sfx="sparkle">
        <Rainbow x={400} y={372} r={320} />
      </Tap>
      <path d={FRONT_HILL} fill="#7cc46a" />
      <Ark x={ax} y={ay} s={as} door ramp still />
      <Lion x={l1x} y={l1y} s={0.45} facing="left" tilt={RAMP_TILT} />
      <Lion x={l2x} y={l2y} s={0.45} facing="left" tilt={RAMP_TILT} />
      <Tap say="Baa! Baa!" sfx="pop">
        <Sheep x={70} y={424} s={0.85} />
        <Sheep x={176} y={410} s={0.8} />
      </Tap>
      <Tap say="Thank you, God!" sfx="good">
        <Person x={262} y={414} s={0.88} look={PEOPLE.noah} pose="arms-up" />
      </Tap>
      <Person x={352} y={418} s={0.78} look={PEOPLE.noahsWife} pose="arms-up" blinkDelay={2} />
      <Tap say="Coo, coo!" sfx="swish">
        <Dove x={478} y={182} s={0.9} leaf facing="left" />
      </Tap>
      <Sparkles spots={[[210, 160], [592, 150], [400, 66, 10]]} />
    </Scene>
  )
}

/** Part one is pages 1 to 5 (data/noah.ts NOAH_STORY_1), part two pages 6 to 11. */
export const NOAH_ART = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]
