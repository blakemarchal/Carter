// Drawn things first needed by the baby-moses island (its activities and pictures). Same style and rules as
// the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//
// Baby Moses, his basket boat and the river's water lilies are drawn here (and exported), so the story
// pictures (scenes/baby-moses.tsx) and the mini-game (games/baby-moses.tsx) draw them just the same.
import { useId, type ReactNode } from 'react'
import type { Item } from './types'
import { ink, Shine } from './draw'
import { SKIN } from '../people'

const uidOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

// ---------- Baby Moses ----------

/** Baby Moses' blanket: soft sky blue, the same on every page. */
export const BABY_BLANKET = '#cfe5fa'
export type BabyMood = 'asleep' | 'awake' | 'happy' | 'crying'
const EYE = '#2b2140', LIP = '#6b2a3a'

/**
 * Baby Moses, wrapped up snug in his blanket and lying with his head to the left (`flip`: to the right): a
 * curl of dark hair, rosy cheeks, and a face for `mood` (asleep, awake, happy, or crying with tears).
 * Awake, a little fist peeks out of the blanket. (x, y): the middle of the bundle; about 66 long at s = 1.
 */
export function BabyMoses({ x, y, s = 1, mood = 'asleep', flip }: { x: number; y: number; s?: number; mood?: BabyMood; flip?: boolean }) {
  const b = BABY_BLANKET, bl = ink(b), sk = SKIN.tan, skl = ink(sk)
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={6} cy={7} rx={30} ry={16} fill={b} stroke={bl} strokeWidth={2.5} />
      <path d="M-20 10 Q6 23 35 8" stroke={bl} strokeWidth={2} fill="none" opacity={0.55} />
      <path d="M8 -7 Q15 5 11 21 M21 -6 Q28 6 24 19" stroke={bl} strokeWidth={2.4} fill="none" opacity={0.45} strokeLinecap="round" />
      <ellipse cx={15} cy={-1} rx={9} ry={3.6} fill="#fff" opacity={0.4} transform="rotate(-12 15 -1)" />
      <circle cx={-14} cy={-2} r={13.5} fill={sk} stroke={skl} strokeWidth={2} />
      <path d="M-19.5 -14.2 q1.5 -5.5 6.5 -3.4 q0.5 -4.6 5.4 -3.2" stroke="#3b2a20" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <ellipse cx={-22} cy={2.5} rx={3.3} ry={2.1} fill="#ff7fb0" opacity={0.5} />
      <ellipse cx={-6} cy={2.5} rx={3.3} ry={2.1} fill="#ff7fb0" opacity={0.5} />
      {mood === 'asleep' && (
        <g>
          <path d="M-22 -4 q3 2.6 6 0 M-12 -4 q3 2.6 6 0" stroke={EYE} strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M-15.6 4 q1.6 1.2 3.2 0" stroke={LIP} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      )}
      {mood === 'happy' && (
        <g>
          <path d="M-22 -3 q3 -3.6 6 0 M-12 -3 q3 -3.6 6 0" stroke={EYE} strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M-18 1.6 Q-14 8.6 -10 1.6 Q-14 3.2 -18 1.6 Z" fill={LIP} stroke={LIP} strokeWidth={1} strokeLinejoin="round" />
        </g>
      )}
      {mood === 'awake' && (
        <g>
          <ellipse cx={-19} cy={-4} rx={2.2} ry={2.8} fill={EYE} />
          <ellipse cx={-9} cy={-4} rx={2.2} ry={2.8} fill={EYE} />
          <circle cx={-19.7} cy={-5} r={0.8} fill="#fff" />
          <circle cx={-9.7} cy={-5} r={0.8} fill="#fff" />
          <path d="M-17 2.4 q3 3 6 0" stroke={LIP} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      )}
      {mood === 'crying' && (
        <g>
          <path d="M-22.5 -6.6 L-17 -4 L-22.5 -1.6 M-5.5 -6.6 L-11 -4 L-5.5 -1.6" stroke={EYE} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-14} cy={4.4} rx={3.6} ry={4.4} fill={LIP} />
          <ellipse cx={-14} cy={6.8} rx={2.2} ry={1.3} fill="#ff8fa8" />
          {[-25, -3].map((tx) => <path key={tx} d={`M${tx} -0.5 q-2.6 4.2 0 5.8 q2.6 -1.6 0 -5.8 Z`} fill="#8fd0ff" stroke="#4a9ad8" strokeWidth={0.8} />)}
        </g>
      )}
      {mood !== 'asleep' && <circle cx={1} cy={7} r={4.6} fill={sk} stroke={skl} strokeWidth={1.6} />}
    </g>
  )
}

// ---------- The basket boat ----------

const STRAW = '#e3b660', STRAW_LINE = '#8a5a22', STRAW_SHADE = '#b98636', STRAW_LIGHT = '#f7dc98', PITCH = '#4a2f1c'
/** The rim is an ellipse round (0, 0); the basket is DEEP deep below it. */
const RX = 62, RY = 12, DEEP = 40
/** The front wall: from the rim's front edge down round the rounded bottom. */
const WALL = `M${-RX} 0 A${RX} ${RY} 0 0 0 ${RX} 0 C${RX} 20 ${RX - 14} ${DEEP - 1} ${RX - 36} ${DEEP} L${36 - RX} ${DEEP} C${14 - RX} ${DEEP - 1} ${-RX} 20 ${-RX} 0 Z`
const RIM_BACK = `M${-RX} 0 A${RX} ${RY} 0 0 1 ${RX} 0`
const RIM_FRONT = `M${-RX} 0 A${RX} ${RY} 0 0 0 ${RX} 0`
/** The lid over the foot end, its open mouth toward the head end (like a little hood). */
const HOOD = `M${-RX} 0 A${RX} ${RY} 0 0 0 6 11.9 C13 -10 4 -42 -24 -45 C-50 -47 -65 -26 ${-RX} 0 Z`
const HOOD_EDGE = 'M6 11.9 C13 -10 4 -42 -24 -45'
/** The shadowy inside of the hood, seen through its open mouth. */
const HOOD_MOUTH = 'M6 11.9 C13 -10 4 -42 -24 -45 C-9 -35 -7 -12 -5 10.6 Z'
/** The whole lid, shut. */
const LID = `M${-RX} 0 C${-RX} -26 -34 -38 0 -38 C34 -38 ${RX} -26 ${RX} 0 A${RX} ${RY} 0 0 1 ${-RX} 0 Z`

/** A thick rolled rim of reeds, bound round with stitches (along the path `d`). */
function Rim({ d }: { d: string }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={STRAW_LINE} strokeWidth={9} />
      <path d={d} stroke={STRAW} strokeWidth={6} />
      <path d={d} stroke={STRAW_LINE} strokeWidth={6} strokeDasharray="1.4 5" opacity={0.65} />
      <path d={d} stroke={STRAW_LIGHT} strokeWidth={1.6} transform="translate(0 -1.6)" opacity={0.9} />
    </g>
  )
}

/** Rows of coiled reeds across a woven shape (inside its clip), with the binding stitches between them. */
function Coils({ rows }: { rows: string[] }) {
  return (
    <g fill="none">
      {rows.map((d, k) => (
        <g key={k}>
          <path d={d} stroke={STRAW_LINE} strokeWidth={1.6} opacity={0.75} />
          <path d={d} stroke={STRAW_LINE} strokeWidth={5} strokeDasharray="1.6 6.4" strokeDashoffset={k % 2 ? 4 : 0} opacity={0.75} transform="translate(0 -3.6)" />
        </g>
      ))}
    </g>
  )
}

/** The lid as a hood over the foot end (seen from the side, a little above). */
function Hood() {
  const id = uidOf(useId())
  return (
    <g>
      <defs>
        <clipPath id={`${id}c`}><path d={HOOD} /></clipPath>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3cc" stopOpacity={0.4} />
          <stop offset="0.5" stopColor="#fff3cc" stopOpacity={0} />
          <stop offset="1" stopColor="#5a3510" stopOpacity={0.3} />
        </linearGradient>
      </defs>
      <path d={HOOD} fill={STRAW} />
      <g clipPath={`url(#${id}c)`}>
        <Coils rows={[-4, -13, -22, -31, -39].map((h) => `M-72 ${h + 4} Q-30 ${h + 13} 16 ${h}`)} />
        <path d={HOOD_MOUTH} fill="#7a4e1e" />
        <path d="M2 8 C7 -10 1 -34 -18 -41" stroke="#5e3a14" strokeWidth={3} fill="none" opacity={0.6} />
        <rect x={-70} y={-50} width={90} height={65} fill={`url(#${id}g)`} />
      </g>
      <path d={HOOD} fill="none" stroke={STRAW_LINE} strokeWidth={2.6} strokeLinejoin="round" />
      <Rim d={HOOD_EDGE} />
      <Shine x={-40} y={-30} rx={8} ry={3.4} rot={-35} />
    </g>
  )
}

/** The whole lid: a woven dome with a little loop of reed on top to lift it by. (0, 0): the middle of its rim. */
export function LidShape() {
  const id = uidOf(useId())
  return (
    <g>
      <defs><clipPath id={`${id}c`}><path d={LID} /></clipPath></defs>
      <path d="M-9 -36 Q0 -52 9 -36" stroke={STRAW_LINE} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-9 -36 Q0 -52 9 -36" stroke={STRAW} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={LID} fill={STRAW} />
      <g clipPath={`url(#${id}c)`}>
        <Coils rows={[-3, -11, -19, -27, -34].map((h) => `M-70 ${h + 3} Q0 ${h + 15} 70 ${h + 3}`)} />
        <path d="M-70 -40 L70 -40 L70 14 L-70 14 Z" fill="#5a3510" opacity={0.12} />
        <ellipse cx={-26} cy={-26} rx={30} ry={10} fill="#fff3cc" opacity={0.25} transform="rotate(-12 -26 -26)" />
      </g>
      <path d={LID} fill="none" stroke={STRAW_LINE} strokeWidth={2.6} strokeLinejoin="round" />
      <Rim d={RIM_FRONT} />
    </g>
  )
}

/**
 * Baby Moses' basket boat (Exodus 2:3): woven of reeds in coils, with a thick rolled rim, and coated dark
 * below (`coat`) so no water can get in. Seen from the side and a little above, the baby's head end to the
 * right (`flip`: to the left). `lid`: 'hood' (over his feet; he peeks out), 'shut', or 'off' (opened).
 * `baby`: how he looks, or 'none'. `water`: it's floating, the river halfway up its side.
 * (x, y): the middle of its rim; about 130 long and 50 deep at s = 1 (the hood stands 45 above the rim).
 */
export function ReedBasket({ x, y, s = 1, lid = 'hood', baby = 'awake', coat = true, water, flip }: {
  x: number; y: number; s?: number; lid?: 'hood' | 'shut' | 'off'; baby?: BabyMood | 'none'; coat?: boolean; water?: boolean; flip?: boolean
}) {
  const id = uidOf(useId())
  const wl = 23 // the waterline, when it floats
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        <clipPath id={`${id}w`}><path d={WALL} /></clipPath>
        {/* (a little bigger than the wall, so the water hides its outline too) */}
        <clipPath id={`${id}u`}><path d={WALL} transform="scale(1.06 1.12)" /></clipPath>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3cc" stopOpacity={0.4} />
          <stop offset="0.45" stopColor="#fff3cc" stopOpacity={0} />
          <stop offset="1" stopColor="#5a3510" stopOpacity={0.35} />
        </linearGradient>
      </defs>
      {water && <ellipse cx={0} cy={wl + 5} rx={RX + 12} ry={9} fill="#1d5f96" opacity={0.22} />}
      {/* inside: the far wall and the floor, in shadow */}
      <ellipse cx={0} cy={0} rx={RX} ry={RY} fill={STRAW_SHADE} />
      <path d={`M${-RX + 7} 1 A${RX - 7} ${RY - 4} 0 0 1 ${RX - 7} 1`} stroke="#9a6a28" strokeWidth={3} fill="none" opacity={0.55} />
      <Rim d={RIM_BACK} />
      {baby !== 'none' && lid !== 'shut' && (
        <g className={baby === 'crying' ? 'bm-cry' : undefined}>
          <BabyMoses x={16} y={-9} s={0.95} mood={baby} flip />
        </g>
      )}
      {/* the front wall, woven in coils of reeds, and coated dark below */}
      <path d={WALL} fill={STRAW} />
      <g clipPath={`url(#${id}w)`}>
        <Coils rows={[1, 2, 3, 4].map((k) => `M${-RX - 4} ${k * 7.5} Q0 ${24 + k * 5} ${RX + 4} ${k * 7.5}`)} />
        {coat && (
          <g>
            <path d={`M${-RX - 4} 23 Q-30 30 0 26.5 Q30 23 ${RX + 4} 27 L${RX + 4} 50 L${-RX - 4} 50 Z`} fill={PITCH} />
            {[[-36, 28.5], [-8, 27.4], [24, 25.6]].map(([dx, dy]) => <ellipse key={dx} cx={dx} cy={dy} rx={2.6} ry={3.6} fill={PITCH} />)}
            <path d="M-40 35 Q-12 40 18 36" stroke="#8a5f3e" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />
          </g>
        )}
        <rect x={-RX - 4} y={-2} width={RX * 2 + 8} height={DEEP + 6} fill={`url(#${id}s)`} />
      </g>
      <path d={WALL} fill="none" stroke={STRAW_LINE} strokeWidth={2.6} strokeLinejoin="round" />
      {/* floating: the river comes halfway up its side */}
      {water && (
        <g clipPath={`url(#${id}u)`}>
          <rect x={-RX - 8} y={wl} width={RX * 2 + 16} height={DEEP + 12} fill="#4aa0da" opacity={0.78} />
          <path d={`M${-RX - 8} ${wl}${' q8 -3 16 0'.repeat(9)}`} stroke="#ffffff" strokeWidth={2.2} fill="none" opacity={0.85} />
        </g>
      )}
      <Rim d={RIM_FRONT} />
      <Shine x={-30} y={9} rx={9} ry={2.6} rot={4} />
      {lid === 'hood' && <Hood />}
      {lid === 'shut' && <LidShape />}
      {water && (
        <g stroke="#ffffff" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.85}>
          <path d={`M${-RX - 24} ${wl + 3} q8 -4 16 0`} />
          <path d={`M${-RX - 12} ${wl + 9} q7 -3 14 0`} />
          <path d={`M${RX + 8} ${wl + 3} q8 -4 16 0`} />
          <path d={`M${RX - 2} ${wl + 9} q7 -3 14 0`} />
        </g>
      )}
    </g>
  )
}

/** The basket's lid on its own, lifted off (`tilt` degrees). (x, y): the middle of its rim; 124 wide at s = 1. */
export function BasketLid({ x, y, s = 1, tilt = 0 }: { x: number; y: number; s?: number; tilt?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
      <ellipse cx={0} cy={1} rx={RX} ry={RY} fill="#8a5a22" />
      <LidShape />
    </g>
  )
}

// ---------- Water lilies on the river ----------

/** A water lily's pad: a round flat leaf with a notch, lying on the water (squashed, as it's seen from the side). (x, y): its middle. */
export function LilyPad({ x, y, r = 24, notch = 300 }: { x: number; y: number; r?: number; notch?: number }) {
  const k = 0.38
  const at = (deg: number) => {
    const a = (deg * Math.PI) / 180
    return `${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r * k).toFixed(1)}`
  }
  return (
    <g>
      <path d={`M${x} ${y} L${at(notch + 16)} A${r} ${r * k} 0 1 1 ${at(notch - 16)} Z`} fill="#5cb85a" stroke="#3a8a3e" strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${x} ${y} L${at(notch + 110)} M${x} ${y} L${at(notch + 180)} M${x} ${y} L${at(notch + 250)}`} stroke="#86d27a" strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
    </g>
  )
}

/** A pink water lily, open on its pad (the lilies of the river Nile). (x, y): the foot of the flower, on the pad; about 50 wide at s = 1. */
export function WaterLily({ x, y, s = 1, pad = true }: { x: number; y: number; s?: number; pad?: boolean }) {
  const back = 'M0 0 Q-8 -11 0 -24 Q8 -11 0 0 Z'
  const front = 'M0 0 Q-7 -9 0 -19 Q7 -9 0 0 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {pad && <LilyPad x={0} y={3} r={27} />}
      {[-64, -34, 0, 34, 64].map((a) => <path key={a} d={back} transform={`rotate(${a})`} fill="#ffcfe3" stroke="#d9608f" strokeWidth={1.4} strokeLinejoin="round" />)}
      <ellipse cx={0} cy={-9} rx={7} ry={3.4} fill="#ffd34d" stroke="#e0a800" strokeWidth={1.2} />
      {[-50, -18, 18, 50].map((a) => <path key={a} d={front} transform={`rotate(${a})`} fill="#ff94c2" stroke="#d9608f" strokeWidth={1.4} strokeLinejoin="round" />)}
      <path d={front} fill="#ffa8cf" stroke="#d9608f" strokeWidth={1.4} strokeLinejoin="round" transform="scale(1 0.8)" />
      <ellipse cx={-3} cy={-12} rx={2.4} ry={4} fill="#fff" opacity={0.5} transform="rotate(-20 -3 -12)" />
    </g>
  )
}

// ---------- The items ----------

/** Baby Moses peeking out of his basket boat, floating on the river (the sticker, and "the basket boat"). */
function MosesBasket() {
  return (
    <g>
      <ellipse cx={50} cy={78} rx={47} ry={10} fill="#8fd0f2" />
      <path d="M8 79 q6 -3 12 0 M78 79 q6 -3 12 0" stroke="#ffffff" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.85} />
      <ReedBasket x={50} y={63} s={0.66} lid="hood" baby="happy" water />
    </g>
  )
}

/** A water lily (🪷): a pink flower open on its round green pad. */
function WaterLilyItem() {
  return (
    <g>
      <ellipse cx={50} cy={80} rx={44} ry={9} fill="#8fd0f2" opacity={0.7} />
      <WaterLily x={50} y={72} s={1.55} />
    </g>
  )
}

/** Water in a clear tub, seen from the side, its surface at y = 34 (for the float and sink pictures). */
function Tub({ children }: { children?: ReactNode }) {
  const id = uidOf(useId())
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd3f5" />
          <stop offset="1" stopColor="#3f96d6" />
        </linearGradient>
      </defs>
      <path d="M10 34 L90 34 L88 86 Q88 94 80 94 L20 94 Q12 94 12 86 Z" fill={`url(#${id}g)`} />
      {children}
      <path d="M10 34 q10 -4 20 0 t20 0 t20 0 t20 0" stroke="#ffffff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <path d="M8 22 L10 34 L12 86 Q12 95 21 95 L79 95 Q88 95 88 86 L90 34 L92 22" stroke="#7aa7c6" strokeWidth={3.4} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M16 44 L17 84" stroke="#ffffff" strokeWidth={3} opacity={0.4} strokeLinecap="round" />
    </g>
  )
}

/** It floats: a red and white ring float bobbing on top of the water. */
function Floats() {
  const id = uidOf(useId())
  return (
    <Tub>
      <defs><clipPath id={`${id}u`}><rect x={0} y={34} width={100} height={70} /></clipPath></defs>
      <g>
        <ellipse cx={50} cy={31} rx={27} ry={12} fill="#ef4f4f" stroke="#a82a2a" strokeWidth={2.4} />
        <path d="M30 23 Q38 19 44 19.6 L46 26 Q40 26 35 28.4 Z M70 23 Q62 19 56 19.6 L54 26 Q60 26 65 28.4 Z M28 38 Q36 43 44 43.2 L45.6 36.4 Q39 36 34.4 33.8 Z M72 38 Q64 43 56 43.2 L54.4 36.4 Q61 36 65.6 33.8 Z" fill="#ffffff" />
        <ellipse cx={50} cy={31} rx={10} ry={4.2} fill="#8fd3f5" stroke="#a82a2a" strokeWidth={2} />
        <ellipse cx={38} cy={24} rx={6} ry={2.2} fill="#fff" opacity={0.55} transform="rotate(-12 38 24)" />
      </g>
      {/* the water comes a little way up its sides */}
      <g clipPath={`url(#${id}u)`}>
        <ellipse cx={50} cy={31} rx={27} ry={12} fill="#5fb3e6" opacity={0.55} />
      </g>
      <path d="M17 37 q4 -2 8 0 M75 37 q4 -2 8 0" stroke="#ffffff" strokeWidth={2} fill="none" strokeLinecap="round" />
    </Tub>
  )
}

/** It sinks: an anchor resting on the bottom, with bubbles going up. */
function Sinks() {
  const line = '#4f5868'
  return (
    <Tub>
      <ellipse cx={50} cy={90} rx={28} ry={3.4} fill="#2a6aa6" opacity={0.35} />
      <g stroke={line} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M50 52 L50 88" strokeWidth={7} />
        <path d="M30 76 Q32 89 50 89 Q68 89 70 76" strokeWidth={7} />
        <path d="M40 58 L60 58" strokeWidth={6} />
        <circle cx={50} cy={47} r={5} strokeWidth={4} />
      </g>
      <g stroke="#8d97a8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M50 52 L50 87" strokeWidth={3} />
        <path d="M31.5 76.5 Q33.5 87 50 87 Q66.5 87 68.5 76.5" strokeWidth={3} />
      </g>
      <path d="M26 72 L30 79 L35 72 Z M74 72 L70 79 L65 72 Z" fill="#8d97a8" stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      {[[62, 44, 3.4], [66, 38, 2.4], [60, 40, 1.8], [38, 64, 2.6]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" fillOpacity={0.3} stroke="#ffffff" strokeWidth={1.4} />
      ))}
    </Tub>
  )
}

/** A brass key (🔑), lying slanted: a round bow with a hole, a collar, a long shaft and its notched bit. */
function BrassKey() {
  const id = uidOf(useId())
  const line = '#9a6e16'
  const fill = `url(#${id}g)`
  return (
    <g strokeLinejoin="round">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.55" stopColor="#e8b94a" />
          <stop offset="1" stopColor="#c9952e" />
        </linearGradient>
      </defs>
      <ellipse cx={52} cy={89} rx={36} ry={4.5} fill="#000" opacity={0.12} />
      <g transform="rotate(-32 50 54)">
        <path d="M34 49 L86 49 Q89 49 89 52 L89 56 Q89 59 86 59 L34 59 Z" fill={fill} stroke={line} strokeWidth={2.6} />
        <path d="M68 58 L68 72 L74 72 L74 66 L79 66 L79 74 L86 74 L86 58 Z" fill={fill} stroke={line} strokeWidth={2.6} />
        <rect x={40} y={45} width={7} height={18} rx={2.5} fill={fill} stroke={line} strokeWidth={2.4} />
        <path fillRule="evenodd" d="M7 54 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0 Z M17 54 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 Z" fill={fill} stroke={line} strokeWidth={2.6} />
        <path d="M50 51.6 L84 51.6" stroke="#fff3c4" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        <Shine x={17} y={45} rx={6} ry={3} rot={-20} />
      </g>
    </g>
  )
}

export const ISL_BABY_MOSES: Item[] = [
  // (The island's sticker, and its landmark on the map. No emoji names it: 👶 is every baby, like baby Jesus.)
  { id: 'moses-basket', name: 'baby Moses in his basket boat', Draw: MosesBasket },
  { id: 'water-lily', name: 'water lily', emoji: ['🪷'], Draw: WaterLilyItem },
  // (The two groups for "Float or Sink?": no emoji, as nothing means just these.)
  { id: 'it-floats', name: 'it floats', emoji: [], Draw: Floats },
  { id: 'it-sinks', name: 'it sinks', emoji: [], Draw: Sinks },
  // (Something that sinks, for "Float or Sink?", that nobody argues about.)
  { id: 'brass-key', name: 'key', emoji: ['🔑'], Draw: BrassKey },
]
