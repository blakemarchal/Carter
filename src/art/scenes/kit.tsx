// Story illustration kit. A scene is an 800 x 450 svg: <Scene sky ground> plus props and people
// (../people.tsx). Gentle motion is built in: clouds drift, waves roll, rain falls, stars twinkle,
// boats rock, people blink and breathe. Animation classes live in styles.css under "Story scenes".
// At the bottom, props first drawn for one island, for every island: Rock, WoolSheep and Birds; Tent,
// CampTent, FarCamp, MudHouse and Mat; ThoughtBubble, Dream, Zs and MusicNote; FishingBoat (Peter's boat, with
// BOAT, its shapes, and BOAT_COLORS); Folk, the little people in a crowd; Heart; the little Donkey (with
// DONKEY_RIDER, where its rider sits); and God's house in Jerusalem and the city round it: Temple, Colonnade (with
// Flame, a lamp's flame), Paving, FarHouses, Jerusalem and CityWall, in TEMPLE_COLORS.
import { useId, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { itemById, itemForEmoji } from '../items'
import { FishHeap } from '../items/isl-fishers'
import { Person, type Look } from '../people'

export type Sky = 'day' | 'dawn' | 'dusk' | 'night' | 'storm' | 'dark' | 'glory'
export type Ground = 'meadow' | 'hills' | 'sea' | 'beach' | 'desert' | 'town' | 'stable' | 'none'

const SKY: Record<Sky, [string, string]> = {
  day: ['#8fd3ff', '#e2f6ff'],
  dawn: ['#ffb3c7', '#ffe8b0'],
  dusk: ['#6b5bb5', '#ffa8b8'],
  night: ['#18163f', '#3b3486'],
  storm: ['#4d5a70', '#93a1b5'],
  dark: ['#07060f', '#1a1838'],
  glory: ['#fff1c2', '#ffd6ee'],
}

const STAR_SPOTS = [[60, 50], [140, 110], [230, 40], [320, 90], [410, 30], [500, 80], [590, 45], [680, 100], [740, 40], [100, 170], [450, 140], [620, 160], [270, 160]]

/** A whole illustration. Children are drawn in order on top of the sky and ground. */
export function Scene({ sky = 'day', ground = 'meadow', sun, moon, stars, rain, clouds = sky === 'day' || sky === 'dawn', children }: {
  sky?: Sky; ground?: Ground; sun?: boolean; moon?: boolean; stars?: boolean; rain?: boolean; clouds?: boolean; children?: ReactNode
}) {
  const id = `sky${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const [top, bottom] = SKY[sky]
  return (
    <svg viewBox="0 0 800 450" className="scene pa-anim" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
      {(stars ?? (sky === 'night' || sky === 'dark')) && STAR_SPOTS.map(([x, y], i) => (
        <path key={i} className="pa-twinkle" style={{ animationDelay: `${(i % 5) * 0.37}s` }} d={sparkle(x, y, i % 3 ? 4 : 7)} fill="#fff8d0" />
      ))}
      {sun && <Sun x={660} y={90} />}
      {moon && <Moon x={650} y={85} />}
      {clouds && <><Cloud x={150} y={80} s={1} /><Cloud x={520} y={60} s={0.8} slow /></>}
      <GroundLayer kind={ground} />
      {children}
      {rain && <Rain />}
    </svg>
  )
}

export const sparkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r} L${x + r * 0.25} ${y - r * 0.25} L${x + r} ${y} L${x + r * 0.25} ${y + r * 0.25} L${x} ${y + r} L${x - r * 0.25} ${y + r * 0.25} L${x - r} ${y} L${x - r * 0.25} ${y - r * 0.25} Z`

function GroundLayer({ kind }: { kind: Ground }) {
  switch (kind) {
    case 'meadow':
      return (
        <g>
          <path d="M0 330 Q200 290 400 320 T800 310 L800 450 L0 450 Z" fill="#8fd18a" />
          <path d="M0 370 Q220 340 430 372 T800 360 L800 450 L0 450 Z" fill="#6cc46a" />
          {[[90, 400], [210, 420], [560, 410], [700, 395], [380, 430]].map(([x, y], i) => <Flower key={i} x={x} y={y} color={['#ff8cc0', '#ffd34d', '#ffffff'][i % 3]} />)}
        </g>
      )
    case 'hills':
      return (
        <g>
          <path d="M0 300 Q150 240 300 290 Q450 230 600 285 Q700 250 800 280 L800 450 L0 450 Z" fill="#a8d8a0" />
          <path d="M0 360 Q200 320 420 355 T800 345 L800 450 L0 450 Z" fill="#7cc46a" />
        </g>
      )
    case 'sea':
      return <Sea y={300} />
    case 'beach':
      return (
        <g>
          <Sea y={310} />
          <path d="M0 330 Q160 320 300 360 Q380 390 420 450 L0 450 Z" fill="#f6dfa2" stroke="#e3c27a" strokeWidth={3} />
        </g>
      )
    case 'desert':
      return (
        <g>
          <path d="M0 320 Q160 280 320 315 Q520 270 800 310 L800 450 L0 450 Z" fill="#f2d39a" />
          <path d="M0 380 Q240 340 480 378 T800 370 L800 450 L0 450 Z" fill="#e8bf7a" />
        </g>
      )
    case 'town':
      return (
        <g>
          <path d="M0 320 Q200 290 400 312 T800 305 L800 450 L0 450 Z" fill="#e8cf9a" />
          {[[90, 313, 70], [180, 306, 90], [300, 306, 60], [560, 322, 80], [680, 320, 70]].map(([x, y, w], i) => <House key={i} x={x} y={y} w={w} />)}
          <path d="M0 380 Q240 360 480 382 T800 372 L800 450 L0 450 Z" fill="#d9b67a" />
        </g>
      )
    case 'stable':
      return (
        <g>
          <rect x={0} y={0} width={800} height={450} fill="#b98a5a" />
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 90} y={0} width={86} height={340} fill={i % 2 ? '#a87a4c' : '#b4865a'} />)}
          <path d="M0 0 L400 -40 L800 0 L800 30 L400 -10 L0 30 Z" fill="#7a5233" />
          <rect x={0} y={330} width={800} height={120} fill="#e8c86a" />
          {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 27 + 5} ${340 + (i % 3) * 30} l12 -10 l4 12`} stroke="#c9a040" strokeWidth={3} fill="none" />)}
        </g>
      )
    case 'none':
      return null
  }
}

/** Rolling sea with two animated wave layers, from height y down. */
export function Sea({ y = 300 }: { y?: number }) {
  return (
    <g>
      <rect x={0} y={y} width={800} height={450 - y} fill="#4fa8e8" />
      <path className="sc-wave" d={`M-80 ${y} ${Array.from({ length: 12 }, () => `q40 -16 80 0`).join(' ')} L880 450 L-80 450 Z`} fill="#6cc0f2" />
      <path className="sc-wave slow" d={`M-80 ${y + 40} ${Array.from({ length: 12 }, () => `q40 -14 80 0`).join(' ')} L880 450 L-80 450 Z`} fill="#3f96d8" opacity={0.85} />
      {[[120, y + 70], [420, y + 100], [650, y + 60]].map(([x, yy], i) => <path key={i} className="sc-wave" d={`M${x} ${yy} q12 -8 24 0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />)}
    </g>
  )
}

export function Cloud({ x, y, s = 1, slow, grey }: { x: number; y: number; s?: number; slow?: boolean; grey?: boolean }) {
  return (
    <g className={`sc-cloud ${slow ? 'slow' : ''}`}>
      <g transform={`translate(${x} ${y}) scale(${s})`} fill={grey ? '#c3cad6' : '#fff'} opacity={0.95}>
        <ellipse cx={0} cy={0} rx={60} ry={24} /><ellipse cx={-30} cy={-12} rx={30} ry={22} /><ellipse cx={20} cy={-22} rx={36} ry={28} />
      </g>
    </g>
  )
}

export function Sun({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const sun = useShade('#ffd34d', 0.4, 0.1)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{sun.def}</defs>
      <g className="pa-spin">{Array.from({ length: 12 }, (_, i) => <path key={i} d="M0 -58 L7 -42 L-7 -42 Z" fill="#ffe680" transform={`rotate(${i * 30})`} />)}</g>
      <circle r={38} fill={sun.fill} stroke="#f0b400" strokeWidth={3} />
    </g>
  )
}

/** A soft halo that fades to nothing at its edge (for the moon and stars at night). */
function Halo({ r, color, opacity }: { r: number; color: string; opacity: number }) {
  const id = `ha${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <>
      <defs><radialGradient id={id}><stop offset="0.35" stopColor={color} stopOpacity={opacity} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      <circle r={r} fill={`url(#${id})`} />
    </>
  )
}

export function Moon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Halo r={70} color="#fff3c0" opacity={0.35} />
      <path d="M-6 -36 A36 36 0 1 0 34 10 A30 30 0 0 1 -6 -36 Z" fill="#fff3b0" stroke="#e8d27a" strokeWidth={3} />
    </g>
  )
}

/** Falling rain over the whole scene. */
export function Rain({ heavy }: { heavy?: boolean }) {
  return (
    <g className="sc-rain">
      {Array.from({ length: heavy ? 60 : 36 }, (_, i) => {
        const x = (i * 97) % 820 - 10, y = (i * 53) % 470 - 20
        return <path key={i} d={`M${x} ${y} l-6 18`} stroke="#d6ecff" strokeWidth={3} strokeLinecap="round" opacity={0.8} style={{ animationDelay: `${(i % 7) * 0.12}s` } as CSSProperties} />
      })}
    </g>
  )
}

export function Rainbow({ x = 400, y = 330, r = 300 }: { x?: number; y?: number; r?: number }) {
  return (
    <g className="sc-fadein" fill="none" strokeWidth={16} strokeLinecap="round" opacity={0.92}>
      {['#ff5d5d', '#ffa64d', '#ffe14d', '#5fd39a', '#5fb7ff', '#a98cff'].map((c, i) => (
        <path key={c} d={`M${x - r + i * 16} ${y} A${r - i * 16} ${r - i * 16} 0 0 1 ${x + r - i * 16} ${y}`} stroke={c} />
      ))}
    </g>
  )
}

export function Flower({ x, y, color = '#ff8cc0', s = 1 }: { x: number; y: number; color?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 L0 -16" stroke="#3f9a4a" strokeWidth={3} />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-24} rx={5} ry={8} fill={color} transform={`rotate(${a} 0 -18)`} />)}
      <circle cx={0} cy={-18} r={4} fill="#ffd34d" />
    </g>
  )
}

export function Tree({ x, y, s = 1, fruit }: { x: number; y: number; s?: number; fruit?: string }) {
  const leaf = useShade('#5fc46a', 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{leaf.def}</defs>
      <path d="M-10 0 L-7 -70 L7 -70 L10 0 Z" fill="#9a6a3a" stroke="#6b4422" strokeWidth={3} />
      <g className="sc-sway">
        <circle cx={0} cy={-100} r={46} fill={leaf.fill} stroke={ink('#5fc46a')} strokeWidth={3} />
        <circle cx={-34} cy={-76} r={28} fill={leaf.fill} stroke={ink('#5fc46a')} strokeWidth={3} />
        <circle cx={34} cy={-76} r={28} fill={leaf.fill} stroke={ink('#5fc46a')} strokeWidth={3} />
        {fruit && [[-18, -110], [16, -96], [-30, -78], [30, -80]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r={7} fill={fruit} stroke={ink(fruit)} strokeWidth={2} />)}
      </g>
    </g>
  )
}

export function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const frond = 'M0 0 q40 -20 70 10 q-36 -6 -70 -10Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 Q10 -60 -4 -120" stroke="#9a6a3a" strokeWidth={12} fill="none" strokeLinecap="round" />
      <g className="sc-sway">
        <g transform="translate(-4 -120)" fill="#3fb36b" stroke="#2a8a4a" strokeWidth={2}>
          {[-62, -24, 14].map((a) => <path key={a} d={frond} transform={`rotate(${a})`} />)}
          {[-62, -24, 14].map((a) => <path key={`l${a}`} d={frond} transform={`scale(-1 1) rotate(${a})`} />)}
        </g>
      </g>
    </g>
  )
}

export function House({ x, y, w = 70 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - w * 0.7} width={w} height={w * 0.7} fill="#f2e2c0" stroke="#c9a46a" strokeWidth={3} />
      <rect x={x - w / 2 - 4} y={y - w * 0.74} width={w + 8} height={8} fill="#d9b67a" />
      <rect x={x - 9} y={y - 26} width={18} height={26} rx={9} fill="#8a5a2e" />
      <rect x={x + w / 4 - 6} y={y - w * 0.55} width={12} height={12} fill="#6b4422" />
    </g>
  )
}

/**
 * Noah's ark: a big wooden boat with a house on top. It rocks on the water, or stands `still` on dry
 * land. `door`: the door in the house is open; `ramp`: a gangplank from the door down to the ground on
 * its left; `lit`: warm lights in the windows (everyone safe inside at night); `building`: only the
 * hull's ribs and lowest planks, still being built.
 */
export function Ark({ x, y, s = 1, door, still, ramp, lit, building }: {
  x: number; y: number; s?: number; door?: boolean; still?: boolean; ramp?: boolean; lit?: boolean; building?: boolean
}) {
  const wood = useShade('#b5794a', 0.25, 0.2)
  const windows = door ? [-50, 50] : [-50, 0, 50]
  const body = (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{wood.def}</defs>
      {!building && (
        <g>
          <rect x={-90} y={-110} width={180} height={70} rx={10} fill="#d9a36a" stroke="#8a5428" strokeWidth={4} />
          <path d="M-104 -110 L0 -150 L104 -110 Z" fill="#a0612f" stroke="#6f3f18" strokeWidth={4} strokeLinejoin="round" />
          {lit && windows.map((wx) => <circle key={`g${wx}`} cx={wx} cy={-86} r={24} fill="#ffd970" opacity={0.28} />)}
          {windows.map((wx) => <rect key={wx} x={wx - 12} y={-96} width={24} height={20} rx={4} fill={lit ? '#ffd970' : '#6b4422'} stroke={lit ? '#e0a83a' : 'none'} strokeWidth={2} />)}
          {door && <rect x={-16} y={-82} width={32} height={42} rx={4} fill={lit ? '#ffe9a8' : '#5a3a20'} stroke="#3b2414" strokeWidth={3} />}
        </g>
      )}
      {building ? (
        <g>
          <path d="M-170 -40 L170 -40 L130 30 L-130 30 Z" fill="#f2dcb8" opacity={0.3} />
          {Array.from({ length: 11 }, (_, i) => -150 + i * 30).map((t) => <path key={t} d={`M${t} -40 L${t * 0.8} 30`} stroke="#8a5428" strokeWidth={6} strokeLinecap="round" />)}
          <path d="M-170 -40 L170 -40" stroke="#6f3f18" strokeWidth={6} strokeLinecap="round" />
          <path d="M-142 8 L142 8 L130 30 L-130 30 Z" fill={wood.fill} stroke="#6f3f18" strokeWidth={4} strokeLinejoin="round" />
          <path d="M-136 19 L136 19" stroke="#8a5428" strokeWidth={2.5} />
        </g>
      ) : (
        <g>
          <path d="M-170 -40 L170 -40 L130 30 L-130 30 Z" fill={wood.fill} stroke="#6f3f18" strokeWidth={4} strokeLinejoin="round" />
          {[-20, -2, 16].map((ly) => <path key={ly} d={`M${-160 + (ly + 20)} ${ly} L${160 - (ly + 20)} ${ly}`} stroke="#8a5428" strokeWidth={2.5} />)}
        </g>
      )}
      {ramp && (
        <g>
          <path d="M-18 -40 L8 -40 L-196 58 L-226 58 Z" fill="#c98a52" stroke="#6f3f18" strokeWidth={3} strokeLinejoin="round" />
          {[0.2, 0.4, 0.6, 0.8].map((t) => <path key={t} d={`M${-18 - 208 * t} ${-40 + 98 * t} l26 0`} stroke="#8a5428" strokeWidth={2.5} strokeLinecap="round" />)}
        </g>
      )}
    </g>
  )
  return still ? body : <g className="sc-rock">{body}</g>
}

/** A small sailing boat (Jonah's ship, the disciples' boat). */
export function Boat({ x, y, s = 1, sail = '#fff7e8' }: { x: number; y: number; s?: number; sail?: string }) {
  return (
    <g className="sc-rock">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 -20 L0 -150" stroke="#7a5233" strokeWidth={6} />
        <path d="M4 -146 Q70 -100 4 -40 Z" fill={sail} stroke={ink(sail)} strokeWidth={3} />
        <path d="M-100 -20 L100 -20 L76 24 L-76 24 Z" fill="#c98448" stroke="#8a5428" strokeWidth={4} strokeLinejoin="round" />
        <path d="M-90 -4 L90 -4" stroke="#8a5428" strokeWidth={2.5} />
      </g>
    </g>
  )
}

/** The big fish from Jonah: a friendly whale, side view, facing left. `open` opens its mouth. */
/** Jonah's big fish. `spout`: water spouting from its top (only when it's at the surface). */
export function BigFish({ x, y, s = 1, open, spout = true }: { x: number; y: number; s?: number; open?: boolean; spout?: boolean }) {
  const skin = useShade('#5f8fd0', 0.3, 0.2)
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <defs>{skin.def}</defs>
        <path className="pa-tail" style={{ '--o': '0% 50%' } as CSSProperties} d="M150 -20 Q190 -70 210 -60 Q196 -20 210 20 Q190 30 150 0 Z" fill={skin.fill} stroke={ink('#5f8fd0')} strokeWidth={4} />
        <path d={open ? 'M-150 -10 Q-150 -100 0 -100 Q150 -100 160 -10 Q150 70 0 70 Q-120 70 -150 20 L-90 0 Z' : 'M-150 0 Q-150 -100 0 -100 Q150 -100 160 -10 Q150 70 0 70 Q-150 70 -150 0 Z'} fill={skin.fill} stroke={ink('#5f8fd0')} strokeWidth={4} strokeLinejoin="round" />
        <path d="M-140 20 Q-40 60 120 30 Q60 70 0 70 Q-110 68 -140 20 Z" fill="#cfe4ff" />
        <circle cx={-80} cy={-40} r={10} fill="#2b2140" /><circle cx={-83} cy={-44} r={3.5} fill="#fff" />
        <ellipse cx={-96} cy={-16} rx={10} ry={6} fill="#ff7fb0" opacity={0.5} />
        {spout && <path d="M-30 -100 Q-36 -130 -50 -140 M-30 -100 Q-24 -132 -10 -142" stroke="#bfe4ff" strokeWidth={6} fill="none" strokeLinecap="round" className="sc-spout" />}
      </g>
    </g>
  )
}

export function Stable({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-140 0 L-140 -120 L140 -120 L140 0 Z" fill="#a87a4c" stroke="#6f4a28" strokeWidth={4} />
      <path d="M-170 -110 L0 -190 L170 -110 Z" fill="#c9a46a" stroke="#8a6a3a" strokeWidth={4} strokeLinejoin="round" />
      <path d="M-100 0 L-100 -90 L100 -90 L100 0 Z" fill="#5a3a20" />
      {[-120, 120].map((px) => <rect key={px} x={px - 6} y={-120} width={12} height={120} fill="#7a5233" />)}
    </g>
  )
}

/** A wooden manger full of hay; with `baby`, baby Jesus sleeps in it. */
export function Manger({ x, y, s = 1, baby }: { x: number; y: number; s?: number; baby?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-50 0 L-40 -40 M50 0 L40 -40" stroke="#7a5233" strokeWidth={6} strokeLinecap="round" />
      {baby}
      <path d="M-56 -40 L56 -40 L42 -6 L-42 -6 Z" fill="#a0703f" stroke="#6f4a28" strokeWidth={4} strokeLinejoin="round" />
      <path d="M-50 -40 q10 -10 20 0 q10 -12 20 0 q10 -10 20 0 q10 -12 20 0 q10 -10 20 0" stroke="#e8c86a" strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** The bright star over Bethlehem, with long twinkling rays. */
export function BigStar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pa-twinkle"><Halo r={84} color="#ffe98a" opacity={0.5} /></g>
      <path d={sparkle(0, 0, 54)} fill="#fff3a0" stroke="#e8c84a" strokeWidth={3} />
      <path d={sparkle(0, 0, 26)} fill="#ffffff" transform="rotate(45)" />
    </g>
  )
}

/** A sheep standing side-on (facing right): four legs, a woolly body and a dark face with an ear. (x, y) = its hooves on the ground. */
export function Sheep({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      {/* far legs (in shadow), then near legs */}
      {[-14, 24].map((lx) => <rect key={lx} x={lx} y={-24} width={7} height={23} rx={3.5} fill="#2f2528" />)}
      {[-24, 14].map((lx) => <rect key={lx} x={lx} y={-22} width={8} height={22} rx={4} fill="#4a3a3a" />)}
      <g className="sc-breathe">
        <g fill="#fffaf2" stroke="#d8cfc2" strokeWidth={2.5}>
          {[[-24, -40], [-6, -48], [12, -44], [24, -34], [-26, -26], [0, -28], [20, -24]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={15} />)}
        </g>
        <ellipse cx={30} cy={-51} rx={8} ry={3.8} fill="#3d2f31" transform="rotate(-35 30 -51)" />
        <ellipse cx={40} cy={-40} rx={13} ry={11} fill="#4a3a3a" />
        <circle cx={45} cy={-43} r={2.8} fill="#fff" />
        <circle cx={45.8} cy={-43} r={1.4} fill="#2b2140" />
      </g>
    </g>
  )
}

/** A cow standing side-on (facing right): white with brown patches, four legs and a pink nose. (x, y) = its hooves on the ground. */
export function Cow({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const hide = '#fbf6ee', patch = '#9a6640', line = '#b5a898'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <path d="M-46 -62 Q-60 -46 -56 -24" stroke={line} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <ellipse cx={-56} cy={-21} rx={4.5} ry={7} fill={patch} />
      {[-30, 26].map((lx) => <rect key={lx} x={lx} y={-38} width={9} height={37} rx={3} fill="#e8dfd2" stroke={line} strokeWidth={2} />)}
      <rect x={-50} y={-80} width={100} height={48} rx={22} fill={hide} stroke={line} strokeWidth={2.5} />
      <path d="M-34 -79 Q-20 -60 -34 -40 Q-48 -46 -49 -62 Q-46 -76 -34 -79 Z" fill={patch} />
      <ellipse cx={10} cy={-62} rx={15} ry={10} fill={patch} />
      <ellipse cx={4} cy={-33} rx={10} ry={6} fill="#ffc0cf" stroke="#e090a8" strokeWidth={1.5} />
      {[-42, 14].map((lx) => <rect key={lx} x={lx} y={-36} width={10} height={36} rx={3} fill={hide} stroke={line} strokeWidth={2} />)}
      {[-42, 14].map((lx) => <rect key={`h${lx}`} x={lx} y={-6} width={10} height={6} rx={2} fill="#5a4a44" />)}
      <path d="M50 -92 l6 -10 l4 8 Z M66 -92 l4 -10 l5 9 Z" fill="#f2e6c8" stroke="#c9b48a" strokeWidth={1.5} strokeLinejoin="round" />
      <ellipse cx={46} cy={-84} rx={9} ry={4} fill={hide} stroke={line} strokeWidth={2} transform="rotate(-25 46 -84)" />
      <rect x={48} y={-94} width={30} height={34} rx={13} fill={hide} stroke={line} strokeWidth={2.5} />
      <path d="M50 -92 Q60 -84 58 -74 Q50 -76 48 -84 Z" fill={patch} />
      <ellipse cx={66} cy={-64} rx={15} ry={9} fill="#ffc0cf" stroke="#e090a8" strokeWidth={2} />
      <circle cx={61} cy={-64} r={1.8} fill="#a05a6a" /><circle cx={71} cy={-64} r={1.8} fill="#a05a6a" />
      <circle cx={68} cy={-80} r={3} fill="#2b2140" /><circle cx={67} cy={-81} r={1} fill="#fff" />
    </g>
  )
}

/**
 * A dove in flight (facing right, or `facing="left"`): the near wing in front of the body and the far
 * wing tipped forward behind it, so both show, beating from the shoulder; a fanned tail. `leaf`: an
 * olive leaf held crosswise in its beak.
 */
export function Dove({ x, y, s = 1, leaf, facing = 'right' }: { x: number; y: number; s?: number; leaf?: boolean; facing?: 'left' | 'right' }) {
  const line = '#b9cce6'
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
        {/* far wing (behind the body, a little shaded, tipped forward) */}
        <g transform="rotate(26 2 -8)">
          <g className="sc-wing far" style={{ '--o': '85% 100%' } as CSSProperties}>
            <path d="M2 -8 C0 -30 -8 -48 -24 -60 C-22 -52 -26 -48 -32 -47 C-26 -41 -28 -37 -34 -35 C-27 -29 -27 -25 -31 -21 C-18 -18 -8 -13 2 -8 Z"
              fill="#e4ecf8" stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
          </g>
        </g>
        {/* tail */}
        <path d="M-24 1 L-46 -7 Q-44 0 -48 3 Q-44 6 -47 13 L-24 9 Z" fill="#fff" stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
        {/* body and head */}
        <path d="M-28 5 C-22 -8 2 -15 15 -9 C23 -4 20 8 6 11 C-8 15 -22 13 -28 5 Z" fill="#fff" stroke={line} strokeWidth={2.5} />
        <circle cx={20} cy={-10} r={9.5} fill="#fff" stroke={line} strokeWidth={2.5} />
        <path d="M28.5 -11.5 l9 2.8 l-9 3 Z" fill="#ffb347" stroke="#e08a2a" strokeWidth={1} strokeLinejoin="round" />
        <circle cx={22.6} cy={-12} r={2} fill="#2b2140" />
        <circle cx={22} cy={-12.6} r={0.7} fill="#fff" />
        {leaf && (
          <g transform="rotate(16 36 -8)">
            <path d="M31 -9 Q44 -18 58 -9 Q44 -1 31 -9 Z" fill="#7a9a3a" stroke="#4f6b22" strokeWidth={1.4} strokeLinejoin="round" />
            <path d="M32 -9 L57 -9" stroke="#c8d88a" strokeWidth={1.1} strokeLinecap="round" />
          </g>
        )}
        {/* near wing (in front), with feather tips along its back edge */}
        <g className="sc-wing" style={{ '--o': '90% 100%' } as CSSProperties}>
          <path d="M8 -5 C4 -26 -10 -44 -30 -54 C-27 -46 -30 -42 -35 -40 C-29 -34 -30 -30 -35 -27 C-28 -22 -27 -18 -30 -13 C-18 -11 -6 -7 8 -5 Z"
            fill="#fff" stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M-20 -40 Q-11 -26 -2 -12 M-24 -30 Q-15 -20 -8 -10" stroke="#dbe5f3" strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      </g>
    </g>
  )
}

export function Fish({ x, y, s = 1, color = '#ffa64d', facing = 'right' }: { x: number; y: number; s?: number; color?: string; facing?: 'left' | 'right' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <path d="M-22 0 L-36 -12 L-36 12 Z" fill={color} stroke={ink(color)} strokeWidth={2} />
      <ellipse cx={0} cy={0} rx={24} ry={14} fill={color} stroke={ink(color)} strokeWidth={2.5} />
      <circle cx={12} cy={-3} r={3} fill="#2b2140" />
    </g>
  )
}

export function Bread({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={26} ry={15} fill="#e0a75e" stroke="#a8702c" strokeWidth={3} />
      <path d="M-12 -6 q4 -6 8 0 M2 -6 q4 -6 8 0" stroke="#a8702c" strokeWidth={2} fill="none" />
    </g>
  )
}

export function Basket({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill?: 'bread' | 'fish' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {fill === 'bread' && <><Bread x={-14} y={-16} s={0.7} /><Bread x={14} y={-18} s={0.7} /></>}
      {fill === 'fish' && <><Fish x={-10} y={-16} s={0.6} /><Fish x={12} y={-20} s={0.6} color="#5fb7ff" /></>}
      <path d="M-36 -10 L36 -10 L28 22 L-28 22 Z" fill="#c98448" stroke="#8a5428" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-32 0 L32 0 M-30 10 L30 10" stroke="#8a5428" strokeWidth={2} />
    </g>
  )
}

export function Stones({ x, y, s = 1, n = 5 }: { x: number; y: number; s?: number; n?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, i) => <ellipse key={i} cx={(i - (n - 1) / 2) * 22} cy={(i % 2) * 6} rx={11} ry={8} fill="#bdb6ad" stroke="#7d766d" strokeWidth={2.5} />)}
    </g>
  )
}

/** Soft beams of light fanning out from (x, y), turning very slowly: God's light (never a person). */
export function Rays({ x, y, r = 420, n = 18, color = '#fff6b0', opacity = 0.5 }: { x: number; y: number; r?: number; n?: number; color?: string; opacity?: number }) {
  const id = `ry${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const w = (Math.PI * r) / n / 2.2
  return (
    <g className="pa-spin">
      <defs><linearGradient id={id} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={color} stopOpacity={opacity} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M0 0 L${-w} ${-r} L${w} ${-r} Z`} transform={`translate(${x} ${y}) rotate(${(i * 360) / n})`} fill={`url(#${id})`} />
      ))}
    </g>
  )
}

/** A soft glow of light (God's glory, a sunrise, the first light). */
export function Glow({ x, y, r = 160, color = '#fff6b0' }: { x: number; y: number; r?: number; color?: string }) {
  const id = `gl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g className="pa-twinkle">
      <defs><radialGradient id={id}><stop offset="0" stopColor={color} stopOpacity={0.95} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  )
}

export function Sparkles({ spots, color = '#fff6b0' }: { spots: [number, number, number?][]; color?: string }) {
  return <>{spots.map(([x, y, r = 8], i) => <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.3}s` }} d={sparkle(x, y, r)} fill={color} />)}</>
}

/** An emoji used as a prop (animals mostly), with an optional bob. Apple emoji look lovely on the iPad. */
/**
 * Something in a story picture to tap (a living picture book): it hops, makes a sound and, when the
 * narrator isn't mid-sentence, says its line ("Baa!", "God told me to build a boat!").
 * `sfx`: one of the game's sound effects (pop, sparkle, good, whoosh, chomp, ding…).
 */
export function Tap({ say, sfx = 'pop', count, children }: {
  say?: string; sfx?: string
  /** Things to count: every Tap with the same `count` name says the next number when it's tapped ("One!", "Two!"…). */
  count?: string
  children: ReactNode
}) {
  return <g className="tap" data-tap="" data-say={say} data-sfx={sfx} data-count={count}>{children}</g>
}

/** A thing in a picture, by its emoji: the drawn item (art/items) when there is one, else the emoji. (x, y) is its middle. */
export function Emoji({ e, art, x, y, size = 60, bob, flip }: { e: string; art?: string; x: number; y: number; size?: number; bob?: boolean; flip?: boolean }) {
  // (`art`: a drawing's id, to use instead of the emoji's)
  const item = (art ? itemById(art) : undefined) ?? itemForEmoji(e)
  if (item) {
    const k = size / 100
    return (
      <g className={bob ? 'sc-float' : undefined}>
        <g transform={`translate(${x - (flip ? -size / 2 : size / 2)} ${y - size / 2}) scale(${flip ? -k : k} ${k})`}><item.Draw /></g>
      </g>
    )
  }
  return (
    <g className={bob ? 'sc-float' : undefined}>
      <text x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="middle" transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>{e}</text>
    </g>
  )
}

export function Balloon({ x, y, color = '#ff6fae', s = 1 }: { x: number; y: number; color?: string; s?: number }) {
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 30 Q-8 60 4 90" stroke="#8a7a99" strokeWidth={2} fill="none" />
        <ellipse cx={0} cy={0} rx={24} ry={30} fill={color} stroke={ink(color)} strokeWidth={3} />
        <ellipse cx={-8} cy={-12} rx={6} ry={9} fill={lighten(color, 0.6)} opacity={0.7} />
        <path d="M-5 30 L5 30 L0 36 Z" fill={color} />
      </g>
    </g>
  )
}

export function Cake({ x, y, s = 1, candles = 5 }: { x: number; y: number; s?: number; candles?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-70} y={-60} width={140} height={60} rx={12} fill="#ffd6e8" stroke="#e58cb4" strokeWidth={4} />
      <path d="M-70 -40 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
      {Array.from({ length: candles }, (_, i) => {
        const cx = candles === 1 ? 0 : -54 + i * (108 / (candles - 1))
        return (
          <g key={i}>
            <rect x={cx - 4} y={-90} width={8} height={30} rx={3} fill={['#5fb7ff', '#ffd34d', '#5fd39a', '#c9a8ff', '#ff8cc0'][i % 5]} />
            <path className="pa-twinkle" d={`M${cx} -106 q8 10 0 16 q-8 -6 0 -16 Z`} fill="#ffb347" />
          </g>
        )
      })}
    </g>
  )
}

// ---------- Rocks, sheep and birds ----------

/** How far the seat of a Rock is above the ground, in its own units. */
const SEAT = 30

/**
 * A big smooth rock to sit on: a flat seat (SEAT·s up) in the middle, and a rounded bump at the back on
 * the left. (x, y) = the ground under the middle of the seat. `night`: in the moonlight.
 */
export function Rock({ x, y, s = 1, night }: { x: number; y: number; s?: number; night?: boolean }) {
  const color = night ? '#8d93ab' : '#c2b8a6'
  const shade = useShade(color, 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{shade.def}</defs>
      <ellipse cx={-6} cy={0} rx={80} ry={6} fill="#000" opacity={0.14} />
      <path d={`M-78 0 Q-86 -30 -68 -50 Q-52 -66 -36 -56 Q-28 -50 -26 ${-SEAT - 2} Q0 ${-SEAT - 4} 34 ${-SEAT - 1} Q58 ${-SEAT + 1} 64 -14 Q68 -4 62 0 Z`}
        fill={shade.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-66 -40 Q-58 -54 -46 -54" stroke="#fff" strokeWidth={3.5} opacity={0.35} fill="none" strokeLinecap="round" />
      <path d="M40 -20 l7 6 l-2 9" stroke={ink(color)} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
      <path d="M-58 -16 l8 4" stroke={ink(color)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.45} />
    </g>
  )
}

// The kit's sheep (Sheep, above) in more poses, with the same wool, face and colors.
const WOOL: [number, number][] = [[-24, -40], [-6, -48], [12, -44], [24, -34], [-26, -26], [0, -28], [20, -24]]
const SHEEP_FACE = '#4a3a3a', SHEEP_EAR = '#3d2f31'
/** Where the ear [x, y, turn], the point it turns about, the face [x, y, rx, ry, turn] and the eye are, for each way of holding the head. */
const SHEEP_HEADS = {
  up: { ear: [30, -51, -35], hinge: [35, -48], face: [40, -40, 13, 11, 0], eye: [45, -43] },
  down: { ear: [30, -25, 15], hinge: [37, -23], face: [45, -14, 11, 12.5, -25], eye: [48.5, -18] },
  rest: { ear: [28, -23, 20], hinge: [33, -21], face: [40, -12, 12.5, 10, 8], eye: [44, -14] },
} as const

/**
 * A sheep side-on, facing right (or `facing="left"`), drawn like the kit's Sheep. (x, y) = the ground
 * under it. `head`: "up" (as the kit's), "down" (eating grass or drinking), or "rest" (lying down, its
 * legs tucked under it). `sleepy`: eyes shut (always, when resting). For music: `ear` turns the ear
 * (degrees; more is perkier), and `tail` shows a little woolly tail at the back, turned `wag` degrees.
 */
export function WoolSheep({ x, y, s = 1, facing = 'right', head = 'up', sleepy, ear = 0, tail, wag = 0 }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; head?: 'up' | 'down' | 'rest'; sleepy?: boolean
  ear?: number; tail?: boolean; wag?: number
}) {
  const H = SHEEP_HEADS[head]
  const rest = head === 'rest'
  const dy = rest ? 11 : 0 // lying down: the wool sits on the ground
  const shut = sleepy || rest
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      {rest ? (
        // a front hoof peeking out from under the wool
        <rect x={20} y={-7} width={13} height={7} rx={3.5} fill={SHEEP_FACE} />
      ) : (
        <>
          {[-14, 24].map((lx) => <rect key={lx} x={lx} y={-24} width={7} height={23} rx={3.5} fill="#2f2528" />)}
          {[-24, 14].map((lx) => <rect key={lx} x={lx} y={-22} width={8} height={22} rx={4} fill={SHEEP_FACE} />)}
        </>
      )}
      <g className="sc-breathe">
        {tail && (
          <g transform={`rotate(${wag} -36 ${-36 + dy})`}>
            <circle cx={-43} cy={-38 + dy} r={6.5} fill="#fffaf2" stroke="#d8cfc2" strokeWidth={2.5} />
          </g>
        )}
        <g fill="#fffaf2" stroke="#d8cfc2" strokeWidth={2.5}>
          {WOOL.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy + dy} r={15} />)}
        </g>
        <g transform={`rotate(${ear} ${H.hinge[0]} ${H.hinge[1]})`}>
          <ellipse cx={H.ear[0]} cy={H.ear[1]} rx={8} ry={3.8} fill={SHEEP_EAR} transform={`rotate(${H.ear[2]} ${H.ear[0]} ${H.ear[1]})`} />
        </g>
        <ellipse cx={H.face[0]} cy={H.face[1]} rx={H.face[2]} ry={H.face[3]} fill={SHEEP_FACE} transform={`rotate(${H.face[4]} ${H.face[0]} ${H.face[1]})`} />
        {shut ? (
          <path d={`M${H.eye[0] - 3.4} ${H.eye[1] - 0.6} q3.4 2.8 6.8 0`} stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        ) : (
          <>
            <circle cx={H.eye[0]} cy={H.eye[1]} r={2.8} fill="#fff" />
            <circle cx={H.eye[0] + 0.8} cy={H.eye[1]} r={1.4} fill="#2b2140" />
          </>
        )}
      </g>
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

// ---------- Tents, homes and a sleeping mat ----------

/** Abraham's tent cloth (woven goat hair) and its stripes (his camel carries the tent rolled up: scenes/abraham.tsx). */
export const CLOTH = '#7d5a45', STRIPE = '#ead3a5'

/**
 * Abraham's tent: a wide, low tent of woven goat hair with cream stripes, held up by poles and pegged out
 * with ropes. Its front is open, with the door flaps tied back: dark inside, or warm with lamplight at
 * night (`lit`). (x, y) = the middle of its front on the ground; at s = 1 it's about 400 wide (with its
 * ropes) and 220 tall, and its doorway fits a grown-up. `children` stand in the doorway, in front of the
 * back wall and behind the door flaps.
 */
export function Tent({ x, y, s = 1, lit, children }: { x: number; y: number; s?: number; lit?: boolean; children?: ReactNode }) {
  const cloth = useShade(CLOTH, 0.22, 0.2)
  const line = ink(CLOTH)
  const glow = `tg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        {cloth.def}
        <radialGradient id={glow} cx="50%" cy="60%" r="65%">
          <stop offset="0" stopColor="#fff1c0" /><stop offset="0.6" stopColor="#ffc95e" /><stop offset="1" stopColor="#c9822e" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={-2} rx={190} ry={10} fill="#000" opacity={0.1} />
      {/* ropes out to the pegs */}
      {[-1, 1].map((d) => (
        <g key={d} stroke="#9a7a55" strokeWidth={2.2} strokeLinecap="round">
          <path d={`M${d * 168} -138 L${d * 214} 0 M${d * 120} -176 L${d * 196} 0`} fill="none" />
          <path d={`M${d * 214} 2 L${d * 210} -14 M${d * 196} 2 L${d * 192} -14`} stroke="#6b4422" strokeWidth={4} />
        </g>
      ))}
      {/* inside: the back wall (dark by day, lamplit at night), a rug, and the middle pole */}
      <rect x={-134} y={-172} width={268} height={172} fill={lit ? `url(#${glow})` : '#46302a'} />
      {!lit && <path d="M-134 -172 L134 -172 L134 -150 Q0 -140 -134 -150 Z" fill="#33221c" />}
      <rect x={-118} y={-18} width={236} height={18} fill="#b5553f" />
      <path d={`M-114 -9 ${Array.from({ length: 12 }, () => 'l9.8 -5 l9.8 5').join(' ')}`} stroke="#f0d38a" strokeWidth={2.2} fill="none" />
      <rect x={-5} y={-206} width={10} height={190} rx={3} fill={lit ? '#9a6a3a' : '#6b4a2e'} />
      {lit && (
        <g>
          <path d="M0 -150 L0 -130" stroke="#5a3a20" strokeWidth={2} />
          <Glow x={0} y={-118} r={60} color="#fff3c0" />
          <path d="M-9 -130 L9 -130 L6 -112 L-6 -112 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2} />
          <path d="M0 -127 Q-5 -118 0 -114 Q5 -118 0 -127 Z" fill="#fff7c9" />
        </g>
      )}
      {children}
      {/* the door flaps, tied back, and the side walls */}
      {[-1, 1].map((d) => (
        <g key={d} transform={`scale(${d} 1)`}>
          <path d="M-182 -132 L-136 -172 Q-122 -120 -104 -86 Q-118 -48 -128 0 L-188 0 Z" fill={cloth.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          <path d="M-134 -164 Q-121 -118 -108 -88 Q-120 -50 -130 -4" stroke={STRIPE} strokeWidth={5} fill="none" />
          <path d="M-170 -128 L-176 -2" stroke={darken(CLOTH, 0.15)} strokeWidth={2} />
          <path d="M-112 -92 q-6 2 -6 8 q6 1 8 -4" stroke="#c0504d" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* the roof, high in the middle and sagging between the poles, with woven stripes */}
      <path d="M-196 -128 L-150 -178 Q-96 -168 -60 -192 Q0 -226 60 -192 Q96 -168 150 -178 L196 -128 Q148 -142 100 -138 Q50 -160 0 -156 Q-50 -160 -100 -138 Q-148 -142 -196 -128 Z"
        fill={cloth.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-178 -142 Q-144 -152 -104 -150 Q-52 -170 0 -168 Q52 -170 104 -150 Q144 -152 178 -142" stroke={STRIPE} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-160 -164 Q-120 -164 -82 -168 Q-40 -192 0 -194 Q40 -192 82 -168 Q120 -164 160 -164" stroke={STRIPE} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d="M-168 -153 Q-130 -158 -94 -159 Q-46 -181 0 -181 Q46 -181 94 -159 Q130 -158 168 -153" stroke="#c0504d" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.8} />
      {/* the tops of the poles */}
      {[-150, 0, 150].map((px) => <circle key={px} cx={px} cy={px ? -178 : -210} r={4} fill="#6b4422" />)}
    </g>
  )
}

/** The tents' woven cloth: [cloth, stripe]. The family's own tent is the terracotta one. */
export const FAMILY_TENT = ['#c2603f', '#f5ddb0'] as const
export const TENT_CLOTHS: [string, string][] = [['#8a6248', '#ecd6ab'], ['#a9876a', '#f3e5c8'], ['#6f5446', '#dcc39c'], ['#c08a5a', '#f6e6c6'], ['#9a6b52', '#ead6b0'], ['#7d7f5e', '#e8e0c0']]

/**
 * A tent in God's people's camp: woven cloth with stripes, high in the middle and sagging between its
 * poles, its front open with the door flaps tied back, pegged out with ropes. (x, y) = the middle of its
 * front on the ground; at s = 1 it's about 300 wide (with its ropes) and 160 tall, and its doorway (about
 * 140 wide at the bottom, 100 tall) fits someone at about s = 0.6. `children` stand in the doorway, in front
 * of the dark back wall and behind the door flaps.
 */
export function CampTent({ x, y, s = 1, cloth = FAMILY_TENT[0], stripe = FAMILY_TENT[1], children }: {
  x: number; y: number; s?: number; cloth?: string; stripe?: string; children?: ReactNode
}) {
  const shade = useShade(cloth, 0.22, 0.2)
  const line = ink(cloth)
  const roof = 'M-146 -82 L-110 -122 Q-66 -114 -40 -134 Q0 -158 40 -134 Q66 -114 110 -122 L146 -82 Q104 -92 64 -90 Q32 -106 0 -104 Q-32 -106 -64 -90 Q-104 -92 -146 -82 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{shade.def}</defs>
      <ellipse cx={0} cy={-1} rx={150} ry={8} fill="#000" opacity={0.1} />
      {/* ropes out to the pegs */}
      {[-1, 1].map((d) => (
        <g key={d} strokeLinecap="round">
          <path d={`M${d * 132} -86 L${d * 156} 0 M${d * 96} -118 L${d * 144} 0`} stroke="#9a7a55" strokeWidth={2} fill="none" />
          <path d={`M${d * 156} 1 L${d * 153} -9 M${d * 144} 1 L${d * 141} -9`} stroke="#6b4422" strokeWidth={3.5} />
        </g>
      ))}
      {/* inside: the dark back wall, a rug, and the middle pole */}
      <rect x={-96} y={-120} width={192} height={120} fill="#4a3329" />
      <path d="M-96 -120 L96 -120 L96 -100 Q0 -92 -96 -100 Z" fill="#3a271f" />
      <rect x={-84} y={-13} width={168} height={13} fill="#b5553f" />
      <path d={`M-80 -6.5 ${Array.from({ length: 14 }, () => 'l5.7 -4 l5.7 4').join(' ')}`} stroke="#f0d38a" strokeWidth={2} fill="none" />
      <rect x={-4} y={-150} width={8} height={138} rx={3} fill="#6b4a2e" />
      {children}
      {/* the side walls, their door flaps tied back */}
      {[-1, 1].map((d) => (
        <g key={d} transform={`scale(${d} 1)`}>
          <path d="M-136 -84 L-100 -120 Q-88 -84 -72 -58 Q-82 -28 -88 0 L-140 0 Z" fill={shade.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          <path d="M-98 -110 Q-87 -82 -75 -60 Q-84 -30 -90 -4" stroke={stripe} strokeWidth={4.5} fill="none" />
          <path d="M-126 -84 L-130 -3" stroke={darken(cloth, 0.15)} strokeWidth={2} />
          <path d="M-76 -62 q-7 2 -6 9 q6 0 8 -6" stroke="#c0504d" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* the roof, high in the middle and sagging between the poles, with woven stripes */}
      <path d={roof} fill={shade.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-130 -94 Q-94 -102 -58 -101 Q-28 -118 0 -118 Q28 -118 58 -101 Q94 -102 130 -94" stroke={stripe} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M-118 -112 Q-84 -110 -52 -118 Q-24 -138 0 -140 Q24 -138 52 -118 Q84 -110 118 -112" stroke={stripe} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.85} />
      {[-110, 0, 110].map((px) => <circle key={px} cx={px} cy={px ? -122 : -156} r={4} fill="#6b4422" />)}
    </g>
  )
}

/** The rest of the camp far away: little tents along the horizon at y, `s` big, in turn colors. */
export function FarCamp({ y, s = 0.3, xs, shift = 0 }: { y: number; s?: number; xs: number[]; shift?: number }) {
  return (
    <g>
      {xs.map((x, i) => {
        const [cloth, stripe] = TENT_CLOTHS[(i + shift) % TENT_CLOTHS.length]
        return <CampTent key={x} x={x} y={y + (i % 2) * 4 * s} s={s * (i % 3 === 1 ? 0.9 : 1)} cloth={cloth} stripe={stripe} />
      })}
    </g>
  )
}

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

/** A woven sleeping mat, its fringe at the ends. (x, y): its middle; about 210 long at s = 1. */
export function Mat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-100 -8 Q-101 -14 -93 -14 L93 -14 Q101 -14 100 -8 L96 6 Q94 10 87 10 L-87 10 Q-94 10 -96 6 Z" fill="#dcbf86" stroke="#a8803e" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-92 -5 L92 -5 M-94 3 L94 3" stroke="#c49a52" strokeWidth={2} />
      <path d="M-100 -8 l-7 3 M-98 0 l-8 2 M-96 7 l-7 3 M100 -8 l7 3 M98 0 l8 2 M96 7 l7 3" stroke="#a8803e" strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

// ---------- Thoughts, dreams, sleep and music ----------

/**
 * A thought bubble: a puffy cloud at (x, y), w wide and h tall, with little round puffs (`tail`: x, y,
 * r) leading down to whoever is thinking. `children` are drawn inside it (what they wish for, or worry about).
 */
export function ThoughtBubble({ x, y, w, h, tail, children }: { x: number; y: number; w: number; h: number; tail: [number, number, number][]; children?: ReactNode }) {
  const puffs = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return [x + Math.cos(a) * w * 0.42, y + Math.sin(a) * h * 0.38, Math.min(w, h) * 0.24]
  })
  const line = '#c9b8d8'
  return (
    <g className="sc-float">
      {tail.map(([tx, ty, r], i) => <circle key={i} cx={tx} cy={ty} r={r} fill="#fff" stroke={line} strokeWidth={2.5} />)}
      {puffs.map(([px, py, r], i) => <circle key={i} cx={px} cy={py} r={r + 2.5} fill={line} />)}
      <ellipse cx={x} cy={y} rx={w * 0.5 + 2.5} ry={h * 0.44 + 2.5} fill={line} />
      {puffs.map(([px, py, r], i) => <circle key={`w${i}`} cx={px} cy={py} r={r} fill="#fff" />)}
      <ellipse cx={x} cy={y} rx={w * 0.5} ry={h * 0.44} fill="#fff" />
      {children}
    </g>
  )
}

type Pt = [number, number]
const uidOf = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')

/**
 * A dream: a soft white cloud of a bubble, with little puffs trailing down to the dreamer's head, and the
 * dream drawn inside it (`children`, in scene units, clipped to the bubble). (x, y, w, h): its box (its
 * bumps reach about 20 beyond it); `from`: the dreamer's head; `to`: where the puffs meet the bubble (its
 * bottom left, unless said); `sky`: the dream's background.
 */
export function Dream({ x, y, w, h, from, to, sky = '#fff7d6', children }: { x: number; y: number; w: number; h: number; from: Pt; to?: Pt; sky?: string; children: ReactNode }) {
  const uid = uidOf(useId())
  // A scalloped cloud: bumps all round the box.
  const pts: Pt[] = []
  const n = Math.max(2, Math.round(w / 70)), m = Math.max(2, Math.round(h / 70))
  for (let i = 0; i < n; i++) pts.push([x + (w * i) / n, y])
  for (let i = 0; i < m; i++) pts.push([x + w, y + (h * i) / m])
  for (let i = n; i > 0; i--) pts.push([x + (w * i) / n, y + h])
  for (let i = m; i > 0; i--) pts.push([x, y + (h * i) / m])
  const d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} ` + pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length]
    const r = (Math.hypot(q[0] - p[0], q[1] - p[1]) * 0.6).toFixed(1)
    return `A${r} ${r} 0 0 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)}`
  }).join(' ') + ' Z'
  const [fx, fy] = from
  const near: Pt = to ?? [x + Math.min(w * 0.12, 60), y + h + 6]
  return (
    <g>
      {[0.2, 0.48, 0.76].map((t, i) => (
        <circle key={t} cx={fx + (near[0] - fx) * t} cy={fy + (near[1] - fy) * t} r={5 + i * 4} fill="#fff" stroke="#c9b8e8" strokeWidth={2.5} />
      ))}
      <defs><clipPath id={`dr${uid}`}><path d={d} /></clipPath></defs>
      <path d={d} fill="#fff" stroke="#c9b8e8" strokeWidth={8} strokeLinejoin="round" />
      <g clipPath={`url(#dr${uid})`}>
        <rect x={x - 40} y={y - 40} width={w + 80} height={h + 80} fill={sky} />
        {children}
      </g>
      <path d={d} fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
    </g>
  )
}

/** Three little Zs drifting up from a sleeper; (x, y) is the first, smallest one. They lean the way `dir` says (1 right, -1 left). */
export function Zs({ x, y, s = 1, dir = 1, color = '#fffbe6', line = '#5b4f8a' }: { x: number; y: number; s?: number; dir?: number; color?: string; line?: string }) {
  const z = (cx: number, cy: number, r: number) => `M${cx - r} ${cy - r} L${cx + r} ${cy - r} L${cx - r} ${cy + r} L${cx + r} ${cy + r}`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[[0, 0, 4.5, 0], [dir * 12, -14, 6, 0.7], [dir * 26, -32, 7.5, 1.4]].map(([cx, cy, r, d], i) => (
        <g key={i} className="sc-float" style={{ animationDelay: `${d}s`, animationDuration: '3.6s' }}>
          <path d={z(cx, cy, r)} stroke={line} strokeWidth={5.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={z(cx, cy, r)} stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  )
}

/** A little music note (or two joined notes, `double`), with an outline so it shows on any sky. (x, y) = its middle. */
export function MusicNote({ x, y, s = 1, color = '#ffe680', double }: { x: number; y: number; s?: number; color?: string; double?: boolean }) {
  const line = darken(color, 0.45)
  const stem = double ? 'M-5 10 L-5 -14 L15 -19 L15 5' : 'M3 10 L3 -16 Q12 -12 13 -3'
  const heads: [number, number][] = double ? [[-10, 11], [10, 6]] : [[-2, 11]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={stem} fill="none" stroke={line} strokeWidth={6.5} strokeLinejoin="round" strokeLinecap="round" />
      <path d={stem} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      {heads.map(([hx, hy]) => <ellipse key={hx} cx={hx} cy={hy} rx={6.6} ry={5} transform={`rotate(-20 ${hx} ${hy})`} fill={color} stroke={line} strokeWidth={2} />)}
    </g>
  )
}

// ---------- Peter's fishing boat (Jesus Calms the Storm, Fishers of People) ----------
// Boat units: (0, 0) is the middle of the waterline and the prow is on the right. At s = 1 the hull is 500 long and
// the mast stands 310 above the water. We see a little way down into the boat: its far rim, and the inside of its
// far side between the rims. People stand in it with their feet on its floor (y ≈ -6), hidden by its near side.

/** The boat's shapes (boat units), shared with Jesus Calms the Storm's paint game. */
export const BOAT = {
  /** The near side of the hull: its rim high at the stern and the prow and low in the middle, and a round bottom. */
  hull: 'M-250 -64 Q-10 -10 246 -80 Q252 -26 210 18 Q0 44 -214 16 Q-254 -10 -250 -64 Z',
  /** The rim along the top of the near side. */
  rim: 'M-250 -64 Q-10 -10 246 -80',
  /** The band painted along the hull under the rim. */
  stripe: 'M-249 -58 Q-10 -4 245 -74 L242.5 -48 Q-10 22 -246.5 -32 Z',
  /** The far rim, and the inside of the boat between the two rims. */
  farRim: 'M-244 -80 Q-10 -38 240 -96',
  inside: 'M-244 -80 Q-10 -38 240 -96 L246 -80 Q-10 -10 -250 -64 Z',
  /** The square sail, full of wind (bellying out toward the prow), hanging from its yard. */
  sail: 'M-88 -270 L148 -284 Q174 -218 146 -152 Q32 -134 -80 -146 Q-102 -208 -88 -270 Z',
  /** The sail rolled up along its yard. */
  furled: 'M-94 -276 Q30 -298 154 -292 Q162 -282 152 -274 Q30 -266 -88 -260 Q-100 -266 -94 -276 Z',
}
/** Its colors: `stripe` is the blue band along Peter's boat, and `flag` its little red flag. */
export const BOAT_COLORS = { wood: '#b5794a', line: '#6f4322', rim: '#d9a066', inside: '#7d5030', plank: '#8f5a2e', stripe: '#3f8fb8', sail: '#ffe3a1', mast: '#7a5233', flag: '#e0604d' }
const MAST_X = 34

/**
 * Peter's fishing boat, the disciples' boat on Jesus Calms the Storm and Fishers of People: a wooden boat with a band
 * along its side (`band`: blue, unless said), a mast with a square sail (`sail`: rolled up on its yard, unless `full`
 * of wind), and a little flag at the top of the mast (`flagColor`: red, unless said). `wind` is how hard the wind blows
 * the flag, from 0 (it hangs limp in still air) through 1 (a breeze) to 2 (a gale: it streams out straight). It rocks
 * on the water, unless `still` (calm water, or pulled up on the shore).
 * What's in it, in boat units: `inside` is drawn in the bottom of the boat (water sloshing in); `crew` stand in it
 * (feet on the floor at y ≈ -6); `stern` is at the back, in front of them (someone asleep); `heap` piles it with fish
 * round the crew's knees, that high above its floor (its rim is about 40 above the floor in the middle); `front` is
 * drawn over everything (spray, an oar, a net). (A boat sitting low in the water, so full of fish: draw the water in
 * front of it over it.)
 */
export function FishingBoat({ x, y, s = 1, tilt = 0, facing = 'right', sail = 'furled', still, wind = 1, band = BOAT_COLORS.stripe, flagColor = BOAT_COLORS.flag, inside, crew, stern, heap = 0, front }: {
  x: number; y: number; s?: number; tilt?: number; facing?: 'left' | 'right'; sail?: 'full' | 'furled'; still?: boolean; wind?: number
  band?: string; flagColor?: string; inside?: ReactNode; crew?: ReactNode; stern?: ReactNode; heap?: number; front?: ReactNode
}) {
  const uid = uidOf(useId())
  const C = BOAT_COLORS
  const wood = useShade(C.wood, 0.22, 0.22)
  const cloth = useShade(C.sail, 0.3, 0.12)
  // (the flag hangs down in still air, and streams out straight in a gale)
  const fl = 18 + wind * 14, droop = Math.max(0, 1 - wind) * 14
  const body = (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>
        {wood.def}{cloth.def}
        <clipPath id={`hl${uid}`}><path d={BOAT.hull} /></clipPath>
        <clipPath id={`in${uid}`}><path d={BOAT.inside} /></clipPath>
      </defs>
      {/* the inside of the boat: its far side, with ribs, and the far rim */}
      <path d={BOAT.inside} fill={C.inside} />
      <g clipPath={`url(#in${uid})`}>
        {[-200, -130, -60, 10, 80, 150, 210].map((rx) => <path key={rx} d={`M${rx} -110 L${rx + 4} -20`} stroke={darken(C.inside, 0.2)} strokeWidth={5} />)}
        <path d="M-244 -70 Q-10 -28 240 -86" stroke={lighten(C.inside, 0.12)} strokeWidth={4} fill="none" />
      </g>
      <path d={BOAT.farRim} stroke={C.rim} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* the mast, its stay to the prow, the yard and the sail, then the flag (in front, so a limp flag hangs over the rolled-up sail) */}
      <path d={`M${MAST_X} -300 L240 -90`} stroke="#8a6a4a" strokeWidth={2} />
      <path d={`M${MAST_X} -20 L${MAST_X} -312`} stroke={C.mast} strokeWidth={9} strokeLinecap="round" />
      <path d="M-96 -270 L154 -285" stroke={C.mast} strokeWidth={7} strokeLinecap="round" />
      {sail === 'full' ? (
        <g>
          <path d="M-80 -146 L-132 -48 M146 -152 L196 -68" stroke="#8a6a4a" strokeWidth={2} />
          <path d={BOAT.sail} fill={cloth.fill} stroke={ink(C.sail)} strokeWidth={3} strokeLinejoin="round" />
          <path d="M30 -277 Q38 -210 32 -138" stroke={darken(C.sail, 0.12)} strokeWidth={2} fill="none" />
          <path d="M-84 -232 Q34 -246 156 -250 M-88 -190 Q36 -200 160 -204" stroke={darken(C.sail, 0.08)} strokeWidth={1.6} fill="none" opacity={0.7} />
          {/* a patch, sewn on */}
          <rect x={70} y={-196} width={30} height={24} rx={3} fill={darken(C.sail, 0.06)} stroke={darken(C.sail, 0.25)} strokeWidth={1.5} strokeDasharray="3 2" transform="rotate(-4 85 -184)" />
        </g>
      ) : (
        <g>
          <path d={BOAT.furled} fill={cloth.fill} stroke={ink(C.sail)} strokeWidth={3} strokeLinejoin="round" />
          {[-60, -10, 40, 90, 136].map((tx) => <path key={tx} d={`M${tx} ${-290 + (tx + 90) * -0.02} l-3 22`} stroke="#a0703f" strokeWidth={3} strokeLinecap="round" />)}
        </g>
      )}
      <path d={`M${MAST_X} -311 Q${MAST_X + fl * 0.5} ${-312 + droop * 0.3} ${MAST_X + fl * 0.95} ${-302 + droop} Q${MAST_X + fl * 0.45} ${-299 + droop * 0.6} ${MAST_X} -293 Z`}
        fill={flagColor} stroke={ink(flagColor)} strokeWidth={2} strokeLinejoin="round" />
      {inside && <g clipPath={`url(#in${uid})`}>{inside}</g>}
      {crew}
      {stern}
      {/* fish piled up in the boat, round the crew's knees (scattered by a seed from the length of the boat's id) */}
      {heap > 0 && <FishHeap x={-6} y={-8} w={430} h={heap} len={46} seed={uid.length * 7 + 3} />}
      {/* the near side: the hull, its band and plank seams, and the rim */}
      <path d={BOAT.hull} fill={wood.fill} />
      <g clipPath={`url(#hl${uid})`}>
        <path d={BOAT.stripe} fill={band} />
        <path d="M-249 -55 Q-10 -1 245 -71" stroke={lighten(band, 0.3)} strokeWidth={2.5} fill="none" opacity={0.8} />
        <path d="M-262 -6 Q-10 46 262 -22 M-262 14 Q-10 62 262 -2" stroke={C.plank} strokeWidth={2.5} fill="none" />
      </g>
      <path d={BOAT.hull} fill="none" stroke={C.line} strokeWidth={4} strokeLinejoin="round" />
      <path d={BOAT.rim} stroke={C.rim} strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* the stem post curling up at the prow, and the stern post */}
      {['M244 -80 Q264 -98 258 -120 Q254 -130 244 -124', 'M-248 -64 Q-264 -80 -258 -96'].map((d) => (
        <g key={d}>
          <path d={d} stroke={C.line} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={d} stroke={C.rim} strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {front}
    </g>
  )
  return still ? body : <g className="sc-rock">{body}</g>
}

// ---------- Little people in a crowd ----------

const FOLK_SKINS = ['#d9a47a', '#c68b5e', '#f6d2b8', '#8d5a3b', '#e3b48c']
const FOLK_ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const FOLK_WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
const FOLK_HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24', '#e8e4dc']

/**
 * One small person in a crowd (Loaves & Fishes, and the crowds by the lake on Jesus Calms the Storm and Fishers of
 * People), front view, standing or sitting on the ground. `i` picks the colors. Standing, both arms hang at the sides
 * (with `wave`, the right one waves). Sitting, the hands rest in the lap, hold the tummy (`hungry`), or hold up some
 * food (`hold`).
 */
export function Folk({ x, y, s = 1, i = 0, sit, hold, hungry, wave }: {
  x: number; y: number; s?: number; i?: number; sit?: boolean; hold?: 'bread' | 'fish'; hungry?: boolean; wave?: boolean
}) {
  const robe = FOLK_ROBES[i % FOLK_ROBES.length]
  const skin = FOLK_SKINS[(i * 7 + 2) % FOLK_SKINS.length]
  const kind = (i * 5) % 4 // 0, 3: head covering · 1: short hair · 2: long hair
  const hair = FOLK_HAIRS[(i * 3) % FOLK_HAIRS.length]
  const wrap = FOLK_WRAPS[(i * 11) % FOLK_WRAPS.length]
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

// ---------- A heart ----------

const HEART = 'M0 16 C-24 2 -26 -14 -14 -19 C-7 -22 -2 -17 0 -11 C2 -17 7 -22 14 -19 C26 -14 24 2 0 16 Z'

/** A heart's shape, shaded (a component of its own, so a flat heart takes no gradient). */
function ShadedHeart({ color }: { color: string }) {
  const shade = useShade(color, 0.35, 0.15)
  return (
    <>
      <defs>{shade.def}</defs>
      <path d={HEART} fill={shade.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
    </>
  )
}

/**
 * A drawn heart that bobs gently: God's love, sharing, being thankful. Pink, unless said; `shaded`: soft and shiny,
 * with light and shade (as on Fishers of People), rather than flat.
 */
export function Heart({ x, y, s = 1, color = '#ff8fb1', shaded }: { x: number; y: number; s?: number; color?: string; shaded?: boolean }) {
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {shaded ? <ShadedHeart color={color} /> : <path d={HEART} fill={color} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />}
        <ellipse cx={-10} cy={-10} rx={4} ry={2.4} fill="#fff" opacity={0.65} transform="rotate(-35 -10 -10)" />
      </g>
    </g>
  )
}

// ---------- The little donkey (Baby Jesus, Boy Jesus at the Temple, the Good Samaritan, Palm Sunday) ----------

const f1 = (n: number) => n.toFixed(1)

/**
 * Where someone riding the Donkey sits, in its units: their Person (or Figure) is drawn at (x, y), s big, and shows from
 * the seat up.
 */
export const DONKEY_RIDER = { x: -6, y: -31, s: 0.95 }
/** Where a `smallRider` sits. */
const SMALL_RIDER = { x: -6, y: -40, s: 0.8 }
/** The red of its saddle blanket. */
const SADDLE = '#c0504d'

/** One coat hanging over the donkey's back (in its units): from x0 to x1 along the back at `top`, its hem at `hem`. */
function DrapedCoat({ x0, x1, top, hem, cloth, stripe }: { x0: number; x1: number; top: number; hem: number; cloth: string; stripe: string }) {
  const mid = (x0 + x1) / 2
  const d = `M${x0} ${top + 4} Q${mid} ${top - 6} ${x1} ${top + 4} L${x1 + 3} ${hem - 2} Q${x1 - 9} ${hem + 4} ${mid + 14} ${hem} Q${mid} ${hem + 5} ${mid - 14} ${hem + 1} Q${x0 + 9} ${hem + 5} ${x0 - 3} ${hem - 1} Z`
  const band = `M${x0 - 1.5} ${hem - 8} Q${x0 + 9} ${hem - 3} ${mid - 14} ${hem - 6} Q${mid} ${hem - 2} ${mid + 14} ${hem - 7} Q${x1 - 9} ${hem - 3} ${x1 + 2.5} ${hem - 9}`
  return (
    <g strokeLinejoin="round">
      <path d={d} fill={cloth} stroke={ink(cloth)} strokeWidth={2.4} />
      <path d={band} stroke={stripe} strokeWidth={3.4} fill="none" />
      {/* a tassel at each corner */}
      {[x0 - 3, x1 + 3].map((tx) => (
        <g key={tx}>
          <path d={`M${tx} ${hem - 2} L${tx} ${hem + 5}`} stroke={stripe} strokeWidth={2} strokeLinecap="round" />
          <circle cx={tx} cy={hem + 6.5} r={2.3} fill={stripe} stroke={darken(stripe, 0.3)} strokeWidth={0.9} />
        </g>
      ))}
    </g>
  )
}

/** Where the coats lie over its back, the bottom one first: [x0, x1, top, hem] each. */
const COAT_LAYERS: [number, number, number, number][] = [[-50, 44, -92, -40], [-45, 38, -95, -53], [-39, 32, -97, -66]]

/**
 * A friendly little donkey, side view facing right (or `flip`), origin at its hooves: first drawn for the Baby Jesus
 * island, and on Boy Jesus at the Temple, the Good Samaritan and Palm Sunday too. A soft shadow under it.
 * On its back: a red saddle blanket with a little gold fringe (`blanketStripe`: a stripe across it, that color;
 * `blanket` false: none, for a young donkey nobody has ridden yet), or `coats` laid over it instead, for a soft seat
 * ([cloth, stripe] each, the bottom one first, up to three). `load`: two rolled-up bundles on top and a water skin at
 * its side, for a long trip; `bags`: a woven bag hanging at its side. `lead`: a rope halter, round its nose and up
 * behind its eye to its ear, with the lead rope running to that point, in its units (tied to a post, or held).
 * `rider` sits side-saddle on its back, facing us, shown from the seat up: a Person in that look, hands resting in the
 * lap (`riderKids` are drawn on them, in a Person's units: bandages, a face), or `riderArt` in its place (another pose,
 * or a Figure, drawn at DONKEY_RIDER). Their lap, and their legs hanging down its side, are drawn in `rider`'s look,
 * with `hands` of their hands resting in the lap (`rest`: which one, when it's one). `smallRider`: the rider drawn
 * smaller (Mary, on the Baby Jesus island).
 * `walk`: it walks, its legs swung by this CSS class from the island's own CSS (one pair with the class, the other with
 * it and "b", the other way); `step`: its legs swung that many degrees, set by hand (in a game, on the beat).
 */
export function Donkey({ x, y, s = 1, flip, blanket = true, blanketStripe, coats, load, bags, lead, rider, riderArt, riderKids, smallRider, hands = 2, rest = 'left', walk, step, blinkDelay = 0 }: {
  x: number; y: number; s?: number; flip?: boolean
  blanket?: boolean; blanketStripe?: string; coats?: [string, string][]; load?: boolean; bags?: boolean; lead?: Pt
  rider?: Look; riderArt?: ReactNode; riderKids?: ReactNode; smallRider?: boolean; hands?: 0 | 1 | 2
  /** With one hand in the lap: which one (the rider's own left or right). */
  rest?: 'left' | 'right'
  walk?: string; step?: number; blinkDelay?: number
}) {
  const c = '#a89c9e'
  const fur = useShade(c, 0.3, 0.2)
  const clip = `dk${uidOf(useId())}`
  const seat = smallRider ? SMALL_RIDER : DONKEY_RIDER
  const lap = hands === 2 ? (smallRider ? [-13, 1] : [-13.6, 1.6]) : hands === 1 ? [rest === 'left' ? -24 : 13] : []
  // (a little donkey far away gets a thicker rope, so it still shows)
  const rope = Math.max(1, 0.5 / s)
  const leg = (lx: number, far: boolean, b: boolean) => (
    <g key={lx}>
      <g className={walk ? `${walk}${b ? ' b' : ''}` : undefined}>
        <g transform={step ? `rotate(${f1(b ? -step : step)} ${lx + 6} -46)` : undefined}>
          <rect x={lx} y={-46} width={12} height={44} rx={5} fill={far ? darken(c, 0.12) : fur.fill} stroke={ink(c)} strokeWidth={2.5} />
          <rect x={lx - 1} y={-9} width={14} height={9} rx={3} fill="#5a4646" />
        </g>
      </g>
    </g>
  )
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        {fur.def}
        {/* the rider shows from the seat up */}
        {rider && <clipPath id={clip}><rect x={-90} y={-280} width={180} height={190} /></clipPath>}
      </defs>
      <ellipse cx={0} cy={-1} rx={64} ry={6} fill="#000" opacity={0.1} />
      <g className="pa-tail" style={{ '--o': '100% 0%' } as CSSProperties}>
        <path d="M-50 -66 Q-64 -54 -62 -32" stroke={ink(c)} strokeWidth={5} fill="none" strokeLinecap="round" />
        <ellipse cx={-62} cy={-27} rx={6} ry={9} fill="#5a4646" />
      </g>
      {leg(-30, true, false)}
      {leg(24, true, true)}
      <ellipse cx={0} cy={-62} rx={56} ry={28} fill={fur.fill} stroke={ink(c)} strokeWidth={3} />
      <ellipse cx={4} cy={-46} rx={36} ry={10} fill="#e4dcdc" opacity={0.85} />
      {leg(-46, false, true)}
      {leg(36, false, false)}
      <path d="M30 -80 Q46 -102 54 -118 L76 -106 Q66 -82 50 -58 Z" fill={fur.fill} stroke={ink(c)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M32 -84 Q44 -104 54 -122" stroke="#5a4646" strokeWidth={8} strokeLinecap="round" fill="none" />
      <g className="pa-ear" style={{ '--o': '50% 100%' } as CSSProperties}>
        <ellipse cx={56} cy={-142} rx={7.5} ry={21} transform="rotate(-18 56 -142)" fill={fur.fill} stroke={ink(c)} strokeWidth={2.5} />
        <ellipse cx={56} cy={-140} rx={3.5} ry={13} transform="rotate(-18 56 -140)" fill="#f2b8c6" />
      </g>
      <ellipse cx={72} cy={-140} rx={7.5} ry={21} transform="rotate(14 72 -140)" fill={fur.fill} stroke={ink(c)} strokeWidth={2.5} />
      <ellipse cx={72} cy={-138} rx={3.5} ry={13} transform="rotate(14 72 -138)" fill="#f2b8c6" />
      <ellipse cx={70} cy={-112} rx={22} ry={18} transform="rotate(24 70 -112)" fill={fur.fill} stroke={ink(c)} strokeWidth={3} />
      <ellipse cx={86} cy={-98} rx={15} ry={12} fill="#e4dcdc" stroke={ink(c)} strokeWidth={2.5} />
      <ellipse cx={93} cy={-100} rx={2.2} ry={3} fill="#7a6a6a" />
      <path d="M80 -91 Q86 -87 92 -91" stroke="#5a4646" strokeWidth={2} fill="none" strokeLinecap="round" />
      <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
        <ellipse cx={70} cy={-116} rx={4} ry={5} fill="#2b2140" />
        <circle cx={68.6} cy={-118} r={1.6} fill="#fff" />
      </g>
      <ellipse cx={74} cy={-104} rx={4} ry={2.5} fill="#ff7fb0" opacity={0.5} />
      {lead && (
        <g fill="none" stroke="#8a5a2e" strokeLinecap="round" strokeLinejoin="round">
          {/* the rope halter: round the nose, and up behind the eye to the ear */}
          <path d="M73 -101 Q88 -113 100 -101" strokeWidth={3 * rope} />
          <path d="M74 -100 L56 -121" strokeWidth={2.6 * rope} />
          <path d={`M80 -88 Q${f1((80 + lead[0]) / 2)} ${f1(Math.max(-88, lead[1]) + 26)} ${f1(lead[0])} ${f1(lead[1])}`} strokeWidth={2.4 * rope} />
          <circle cx={80} cy={-89} r={2.6} strokeWidth={2} />
        </g>
      )}
      {bags && (
        <g strokeLinejoin="round">
          {/* a woven bag, hanging at its side behind the saddle */}
          <path d="M-50 -84 Q-36 -90 -26 -84 L-27 -55 Q-38 -49 -50 -56 Z" fill="#d6aa52" stroke="#8a6a2a" strokeWidth={2.2} />
          <path d="M-48 -74 L-28 -76 M-48 -64 L-28 -66" stroke="#f2d38a" strokeWidth={2.4} />
          <path d="M-46 -82 Q-38 -76 -30 -82" stroke="#8a6a2a" strokeWidth={1.6} fill="none" />
        </g>
      )}
      {rider && (
        <g clipPath={`url(#${clip})`}>
          {riderArt ?? <Person x={seat.x} y={seat.y} s={seat.s} look={rider} pose="hold" blinkDelay={blinkDelay + 0.7}>{riderKids}</Person>}
        </g>
      )}
      {/* the coats, one over another, with stripes and tassels; or the saddle blanket, with a little gold fringe */}
      {coats ? (
        <g>
          {coats.slice(0, COAT_LAYERS.length).map(([cloth, stripe], i) => {
            const [x0, x1, top, hem] = COAT_LAYERS[i]
            return <DrapedCoat key={i} x0={x0} x1={x1} top={top} hem={hem} cloth={cloth} stripe={stripe} />
          })}
        </g>
      ) : blanket && (
        <>
          <path d={rider ? 'M-34 -84 Q-6 -94 26 -86 L30 -60 Q-2 -52 -32 -58 Z' : 'M-30 -86 Q-2 -94 26 -86 L30 -60 Q-2 -52 -32 -58 Z'} fill={SADDLE} stroke={ink(SADDLE)} strokeWidth={2.5} strokeLinejoin="round" />
          {blanketStripe && <path d="M-31 -71 Q-2 -79 28 -72" stroke={blanketStripe} strokeWidth={4} fill="none" />}
          {(rider ? [-29, 22, 27] : [-24, -12, 0, 12, 24]).map((fx) => <circle key={fx} cx={fx} cy={-56} r={2.6} fill="#ffd34d" />)}
        </>
      )}
      {load && (
        <g strokeLinejoin="round">
          {/* a water skin hanging at its side, and two rolled-up bundles tied on top */}
          <path d="M8 -84 Q22 -82 22 -68 Q20 -54 8 -56 Q-2 -60 0 -72 Q2 -82 8 -84 Z" fill="#9a6a42" stroke="#5f3f22" strokeWidth={2} />
          <ellipse cx={-14} cy={-98} rx={20} ry={11} fill="#e8d6b0" stroke="#a8875a" strokeWidth={2.2} />
          <path d="M-22 -107 Q-25 -98 -22 -89 M-6 -107 Q-3 -98 -6 -89" stroke="#8a6a3a" strokeWidth={2.2} fill="none" />
          <ellipse cx={12} cy={-99} rx={16} ry={10} fill="#7fa8d0" stroke="#4f7aa8" strokeWidth={2.2} />
          <path d="M6 -108 Q3 -99 6 -90 M19 -108 Q22 -99 19 -90" stroke="#3f6a98" strokeWidth={2} fill="none" />
        </g>
      )}
      {rider && (
        <g>
          {/* feet, peeking out under the hem */}
          <ellipse cx={-14} cy={-45} rx={7} ry={4} fill="#7a5233" />
          <ellipse cx={4} cy={-45} rx={7} ry={4} fill="#7a5233" />
          {/* legs hanging down the donkey's side (two of them, a fold between) */}
          <path d="M-24 -86 L14 -86 L13 -52 Q-4 -46 -22 -51 Z" fill={rider.robe} stroke={ink(rider.robe)} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M-5 -78 L-5 -50" stroke={ink(rider.robe)} strokeWidth={1.8} opacity={0.6} strokeLinecap="round" />
          {/* the lap on the seat, and the hands resting in it */}
          <path d="M-29 -91 Q-6 -98 17 -91 Q21 -85 17 -79 Q-6 -74 -29 -79 Q-33 -85 -29 -91 Z" fill={rider.robe} stroke={ink(rider.robe)} strokeWidth={2.5} strokeLinejoin="round" />
          {lap.map((hx) => <circle key={hx} cx={hx} cy={-88} r={smallRider ? 5.6 : 6.6} fill={rider.skin} stroke={ink(rider.skin)} strokeWidth={1.8} />)}
        </g>
      )}
    </g>
  )
}

// ---------- God's house in Jerusalem, and the city (Boy Jesus at the Temple, Palm Sunday) ----------

/**
 * God's house's colors: its gold trim (`gold`, edged `goldInk`), its white marble (`marble`, edged `marbleInk`, with
 * faint rows of stone, `course`), and the golden-cream stone of its steps and floors (`stone`, edged `stoneInk`).
 */
export const TEMPLE_COLORS = { gold: '#f2c440', goldInk: '#a8761c', marble: '#fbf6ea', marbleInk: '#bba67c', course: '#ebdfc2', stone: '#efe1bf', stoneInk: '#c4aa78' }
const { gold: GOLD, goldInk: GOLD_INK, marble: MARBLE, marbleInk: MARBLE_INK, course: COURSE, stone: STONE, stoneInk: STONE_INK } = TEMPLE_COLORS

/** Little gold spikes along a roof edge, from x0 to x1, standing on y. */
function Spikes({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const n = Math.max(2, Math.round((x1 - x0) / 8))
  const d = Array.from({ length: n + 1 }, (_, i) => {
    const sx = x0 + ((x1 - x0) * i) / n
    return `M${(sx - 1.8).toFixed(1)} ${y} L${sx.toFixed(1)} ${y - 9} L${(sx + 1.8).toFixed(1)} ${y} Z`
  }).join(' ')
  return <path d={d} fill={GOLD} stroke={GOLD_INK} strokeWidth={0.9} strokeLinejoin="round" />
}

/** Faint rows of stone across a wall, from x0 to x1, every `gap` up from y0 to y1. */
function Courses({ x0, x1, y0, y1, gap = 22 }: { x0: number; x1: number; y0: number; y1: number; gap?: number }) {
  const ys: number[] = []
  for (let yy = y0; yy > y1; yy -= gap) ys.push(yy)
  return <path d={ys.map((yy) => `M${x0} ${yy} H${x1}`).join(' ')} stroke={COURSE} strokeWidth={1.6} />
}

/** The golden grapevine over the temple's door: a wavy gold stem with leaves and three bunches of purple grapes. */
function Vine() {
  return (
    <g strokeLinejoin="round">
      <path d="M-58 -186 q14.5 -7 29 0 t29 0 t29 0 t29 0" stroke={GOLD_INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      <path d="M-58 -186 q14.5 -7 29 0 t29 0 t29 0 t29 0" stroke={GOLD} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {[-50, -22, 8, 36, 52].map((lx, i) => (
        <ellipse key={lx} cx={lx} cy={i % 2 ? -183 : -192} rx={5.5} ry={3.2} transform={`rotate(${i % 2 ? 24 : -24} ${lx} ${i % 2 ? -183 : -192})`} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.2} />
      ))}
      {[-36, 0, 36].map((gx) => (
        <g key={gx} fill="#7b4fa0" stroke="#4f2f6a" strokeWidth={0.9}>
          {[[-3.2, -182], [3.2, -182], [0, -178], [-3.2, -174.4], [3.2, -174.4], [0, -171]].map(([dx, dy], j) => <circle key={j} cx={gx + dx} cy={dy} r={2.8} />)}
        </g>
      ))}
    </g>
  )
}

/**
 * God's house in Jerusalem, the temple, seen from the front: a tall white building trimmed with gold, up on wide steps,
 * with lower wings either side, gold spikes along its roofs, a golden grapevine over its great doorway, and (inside the
 * doorway, in the shade) the big curtain of blue, purple and scarlet. (x, y) = the middle of its bottom step; at s = 1
 * it's 300 wide and about 250 tall. `inside` is drawn in the doorway, in front of the curtain, in the same units (its
 * floor is at y = -22; it's 80 wide and 143 tall). `shine`: a soft glow behind it, and sparkles on its gold.
 */
export function Temple({ x, y, s = 1, shine, inside }: { x: number; y: number; s?: number; shine?: boolean; inside?: ReactNode }) {
  const wall = useShade(MARBLE, 0.5, 0.07)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{wall.def}</defs>
      {shine && <Glow x={0} y={-130} r={240} color="#fff3c0" />}
      {/* the side wings */}
      {[-1, 1].map((d) => (
        <g key={d} transform={`scale(${d} 1)`}>
          <rect x={78} y={-152} width={52} height={130} fill={wall.fill} stroke={MARBLE_INK} strokeWidth={2.5} />
          <Courses x0={80} x1={128} y0={-44} y1={-146} />
          <rect x={74} y={-162} width={60} height={11} rx={2} fill={GOLD} stroke={GOLD_INK} strokeWidth={2} />
          <Spikes x0={77} x1={131} y={-162} />
        </g>
      ))}
      {/* the tall middle, with a pillar either side of the door */}
      <rect x={-80} y={-232} width={160} height={210} fill={wall.fill} stroke={MARBLE_INK} strokeWidth={2.5} />
      <Courses x0={-78} x1={78} y0={-44} y1={-226} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={d * 64 - 6} y={-226} width={12} height={204} fill="#fffaf0" stroke={MARBLE_INK} strokeWidth={2} />
          <rect x={d * 64 - 9} y={-230} width={18} height={10} rx={2} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} />
          <rect x={d * 64 - 9} y={-30} width={18} height={8} rx={2} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} />
        </g>
      ))}
      <rect x={-87} y={-243} width={174} height={12} rx={2} fill={GOLD} stroke={GOLD_INK} strokeWidth={2} />
      <Spikes x0={-84} x1={84} y={-243} />
      {/* the great doorway: a gold frame, and inside, in the shade, the curtain (blue with gold stars, a purple and red hem) */}
      <rect x={-47} y={-172} width={94} height={150} fill={GOLD} stroke={GOLD_INK} strokeWidth={2.5} />
      <rect x={-40} y={-165} width={80} height={143} fill="#2b3f78" />
      {[-30, -10, 10, 30].map((fx) => <rect key={fx} x={fx - 3} y={-165} width={6} height={143} fill="#35508f" />)}
      {[[-30, -140], [-10, -118], [10, -140], [30, -118], [-30, -92], [10, -92], [-10, -66], [30, -66]].map(([sx, sy], i) => (
        <path key={i} d={sparkle(sx, sy, 3.6)} fill="#d8b04a" opacity={0.75} />
      ))}
      <rect x={-40} y={-50} width={80} height={11} fill="#5a3a7e" />
      <rect x={-40} y={-39} width={80} height={8} fill="#963532" />
      <rect x={-40} y={-165} width={80} height={143} fill="#1e1530" opacity={0.18} />
      {inside}
      <Vine />
      {/* the steps */}
      <rect x={-130} y={-24} width={260} height={9} fill={STONE} stroke={STONE_INK} strokeWidth={2} />
      <rect x={-140} y={-16} width={280} height={9} fill={STONE} stroke={STONE_INK} strokeWidth={2} />
      <rect x={-150} y={-8} width={300} height={9} fill={STONE} stroke={STONE_INK} strokeWidth={2} />
      <path d="M-128 -22.5 H128 M-138 -14.5 H138 M-148 -6.5 H148" stroke="#fbf3de" strokeWidth={1.6} />
      {shine && <Sparkles spots={[[-70, -250, 7], [60, -246, 6], [-112, -170, 5], [118, -168, 6], [0, -200, 5]]} color="#fff8d0" />}
    </g>
  )
}

/** A lamp's little flame, flickering (sc-flicker, in styles.css): its foot at (x, y), h tall. `d`: when it flickers. */
export function Flame({ x, y, h = 16, d = 0 }: { x: number; y: number; h?: number; d?: number }) {
  const w = h * 0.36
  return (
    <g className="sc-flicker" style={{ animationDelay: `${d}s` } as CSSProperties}>
      <path d={`M${x} ${y} C${x - w * 1.2} ${y - h * 0.35} ${x - w * 0.55} ${y - h * 0.75} ${x} ${y - h} C${x + w * 0.55} ${y - h * 0.75} ${x + w * 1.2} ${y - h * 0.35} ${x} ${y} Z`}
        fill="#ffb347" stroke="#f08a2a" strokeWidth={1.2} />
      <path d={`M${x} ${y - h * 0.08} C${x - w * 0.6} ${y - h * 0.32} ${x - w * 0.3} ${y - h * 0.58} ${x} ${y - h * 0.72} C${x + w * 0.3} ${y - h * 0.58} ${x + w * 0.6} ${y - h * 0.32} ${x} ${y - h * 0.08} Z`}
        fill="#fff3b0" />
    </g>
  )
}

/** One stone column: its foot at (x, y), h tall, w wide, with a gold top. */
function Column({ x, y, h, w = 22 }: { x: number; y: number; h: number; w?: number }) {
  const id = `cl${uidOf(useId())}`
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9dcbf" /><stop offset="0.35" stopColor="#fffaf0" /><stop offset="1" stopColor="#d9c8a2" />
        </linearGradient>
      </defs>
      <rect x={x - w / 2 - 5} y={y - 9} width={w + 10} height={9} rx={2} fill={STONE} stroke={STONE_INK} strokeWidth={2} />
      <rect x={x - w / 2} y={y - h + 12} width={w} height={h - 21} fill={`url(#${id})`} stroke={MARBLE_INK} strokeWidth={2} />
      <path d={`M${x - w * 0.18} ${y - h + 16} V${y - 12} M${x + w * 0.18} ${y - h + 16} V${y - 12}`} stroke="#e4d6b6" strokeWidth={1.4} />
      <path d={`M${x - w / 2 - 7} ${y - h + 12} Q${x - w / 2 - 9} ${y - h + 3} ${x - w / 2 - 2} ${y - h} L${x + w / 2 + 2} ${y - h} Q${x + w / 2 + 9} ${y - h + 3} ${x + w / 2 + 7} ${y - h + 12} Z`}
        fill={GOLD} stroke={GOLD_INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={`M${x - w / 2 - 3} ${y - h + 7} Q${x} ${y - h + 11} ${x + w / 2 + 3} ${y - h + 7}`} stroke={GOLD_INK} strokeWidth={1.2} fill="none" opacity={0.7} />
    </g>
  )
}

/**
 * A long porch of stone columns round the courts of God's house (Solomon's porch): its back wall in the shade, the columns
 * on a low step, and the roof beam on top with a gold band (and a low wall along the roof, `parapet`). From x0 to x1, its
 * step on the ground at y; the columns are h tall, at the x's in `cols`. `back` is drawn in the shade, behind the columns.
 */
export function Colonnade({ x0, x1, y, h, cols, w = 22, parapet = true, back, frieze, lamps = [] }: {
  x0: number; x1: number; y: number; h: number; cols: number[]; w?: number; parapet?: boolean; back?: ReactNode
  /** A woven band of blue, red and gold along the back wall, under the roof. */
  frieze?: boolean
  /** Little gold lamps hanging from the roof on chains, at these x's, their flames flickering. */
  lamps?: number[]
}) {
  const wallTop = y - h
  return (
    <g>
      <rect x={x0} y={y - h - 22} width={x1 - x0} height={h + 22} fill="#dcc497" />
      {frieze && (
        <g>
          <path d={Array.from({ length: Math.ceil(h / 46) }, (_, i) => `M${x0} ${wallTop + 74 + i * 46} H${x1}`).filter((_, i) => wallTop + 74 + i * 46 < y - 20).join(' ')} stroke="#ceb586" strokeWidth={1.6} />
          <rect x={x0} y={wallTop + 22} width={x1 - x0} height={30} fill="#3b56a8" opacity={0.85} />
          <rect x={x0} y={wallTop + 22} width={x1 - x0} height={5} fill="#c8433f" />
          <rect x={x0} y={wallTop + 47} width={x1 - x0} height={5} fill="#c8433f" />
          {Array.from({ length: Math.ceil((x1 - x0) / 40) }, (_, i) => <path key={i} d={sparkle(x0 + 20 + i * 40, wallTop + 37, 6)} fill={GOLD} />)}
        </g>
      )}
      <rect x={x0} y={y - h} width={x1 - x0} height={20} fill="#c7a873" opacity={0.75} />
      {lamps.map((lx, i) => (
        <g key={lx}>
          <path d={`M${lx} ${wallTop} L${lx} ${wallTop + 54} M${lx} ${wallTop + 54} L${lx - 12} ${wallTop + 70} M${lx} ${wallTop + 54} L${lx + 12} ${wallTop + 70}`} stroke="#8a6a3a" strokeWidth={1.6} fill="none" />
          <circle cx={lx} cy={wallTop + 74} r={26} fill="#ffe7a0" opacity={0.28} />
          <path d={`M${lx - 15} ${wallTop + 70} Q${lx} ${wallTop + 86} ${lx + 15} ${wallTop + 70} Z`} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.8} strokeLinejoin="round" />
          <Flame x={lx} y={wallTop + 70} h={14} d={-i * 0.3} />
        </g>
      ))}
      {back}
      <rect x={x0} y={y - 9} width={x1 - x0} height={10} fill={STONE} stroke={STONE_INK} strokeWidth={2} />
      {cols.map((cx) => <Column key={cx} x={cx} y={y - 8} h={h - 8} w={w} />)}
      {parapet && <rect x={x0} y={y - h - 36} width={x1 - x0} height={15} fill="#f1e7d0" stroke={MARBLE_INK} strokeWidth={2} />}
      <rect x={x0} y={y - h - 23} width={x1 - x0} height={23} fill={MARBLE} stroke={MARBLE_INK} strokeWidth={2.5} />
      <rect x={x0} y={y - h - 13} width={x1 - x0} height={5} fill={GOLD} />
      <path d={`M${x0} ${y - h - 13} H${x1} M${x0} ${y - h - 8} H${x1}`} stroke={GOLD_INK} strokeWidth={1} opacity={0.6} />
    </g>
  )
}

/** The courts' stone floor, from y down to the bottom of the picture: big pale flagstones, their joints wider apart nearer us. */
export function Paving({ y, color = '#ecdcb4', line = '#d5bf92' }: { y: number; color?: string; line?: string }) {
  const rows: [number, number][] = []
  let yy = y, gap = 10
  while (yy < 450) { rows.push([yy, Math.min(gap, 450 - yy)]); yy += gap; gap *= 1.32 }
  return (
    <g>
      <rect x={0} y={y} width={800} height={450 - y} fill={color} />
      {rows.map(([ry, rh], i) => {
        const w = rh * 4.6
        const off = (i % 2) * w * 0.5
        const xs = Array.from({ length: Math.ceil(800 / w) + 2 }, (_, k) => k * w - off)
        return (
          <g key={i} stroke={line} strokeWidth={Math.min(2.4, 1 + rh * 0.03)}>
            <path d={`M0 ${ry} H800`} />
            {xs.map((jx) => <path key={jx} d={`M${jx} ${ry} L${jx} ${ry + rh}`} />)}
          </g>
        )
      })}
    </g>
  )
}

/** Little flat-roofed houses far away (a town on a hill): [x, foot y, width] each. */
export function FarHouses({ spots, color = '#efdcb2', line = '#c9a670' }: { spots: [number, number, number][]; color?: string; line?: string }) {
  return (
    <g>
      {spots.map(([hx, hy, w], i) => (
        <g key={i}>
          <rect x={hx - w / 2} y={hy - w * 0.72} width={w} height={w * 0.72} fill={color} stroke={line} strokeWidth={1.6} />
          <rect x={hx - w / 2 - 1.5} y={hy - w * 0.76} width={w + 3} height={w * 0.1} fill={line} />
          <rect x={hx - w * 0.1 + (i % 2 ? w * 0.18 : -w * 0.16)} y={hy - w * 0.3} width={w * 0.2} height={w * 0.3} fill="#8a5a36" />
        </g>
      ))}
    </g>
  )
}

/**
 * Jerusalem on its hill, far away: the city wall round the hilltop with towers and a gate, flat-roofed houses packed inside,
 * and God's house on top, on its great platform with porches round it, shining (`shine`). (x, y) = the bottom middle of
 * the hill; at s = 1 the hill is 620 wide and the temple's top is about 300 up.
 */
export function Jerusalem({ x, y, s = 1, shine = true }: { x: number; y: number; s?: number; shine?: boolean }) {
  const wallC = '#e6c792', wallInk = '#b08d55'
  const towers = [-238, -120, 20, 236]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-310 0 Q-280 -70 -230 -100 Q-150 -140 0 -146 Q150 -140 230 -100 Q280 -70 310 0 Z" fill="#c8c27e" />
      <path d="M-310 0 Q-260 -40 -180 -56 Q0 -76 180 -56 Q260 -40 310 0 Z" fill="#b6b56e" />
      {/* the houses, packed in on the hilltop (behind the wall) */}
      <FarHouses spots={[[-210, -122, 26], [-182, -132, 30], [-150, -126, 24], [-124, -140, 28], [-96, -128, 26], [-66, -144, 30], [-40, -132, 24], [-200, -150, 22], [-160, -156, 26], [-112, -162, 22]]} />
      {/* God's house: the great platform with its porches, and the temple in the middle */}
      <rect x={-10} y={-178} width={236} height={92} fill="#e9cf9c" stroke={wallInk} strokeWidth={2.5} />
      <path d="M-10 -150 H226 M-10 -122 H226" stroke="#d6b77e" strokeWidth={1.6} />
      <rect x={-12} y={-186} width={240} height={10} fill="#f6ecd4" stroke={MARBLE_INK} strokeWidth={1.8} />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={-6 + i * 15} y={-198} width={4} height={12} fill="#fbf6ea" stroke={MARBLE_INK} strokeWidth={0.8} />)}
      <rect x={-12} y={-202} width={240} height={5} fill="#f6ecd4" stroke={MARBLE_INK} strokeWidth={1.2} />
      <Temple x={108} y={-198} s={0.42} shine={shine} />
      {/* the city wall, with its towers and a gate */}
      <path d="M-262 -76 Q-240 -96 -230 -98 L-14 -98 L-14 -70 L-262 -50 Z" fill={wallC} stroke={wallInk} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M226 -86 L262 -74 L262 -50 L226 -58 Z" fill={wallC} stroke={wallInk} strokeWidth={2.5} strokeLinejoin="round" />
      {Array.from({ length: 13 }, (_, i) => <rect key={i} x={-226 + i * 16.5} y={-106} width={9} height={9} fill={wallC} stroke={wallInk} strokeWidth={1.6} />)}
      {towers.map((tx) => (
        <g key={tx}>
          <rect x={tx - 13} y={-122} width={26} height={tx === 236 ? 66 : 62} fill="#e0bd84" stroke={wallInk} strokeWidth={2.2} />
          {[-9, 0, 9].map((mx) => <rect key={mx} x={tx + mx - 3.5} y={-129} width={7} height={8} fill="#e0bd84" stroke={wallInk} strokeWidth={1.4} />)}
        </g>
      ))}
      <path d="M-188 -58 L-188 -78 Q-178 -90 -168 -78 L-168 -60 Z" fill="#6b4630" stroke={wallInk} strokeWidth={1.8} />
    </g>
  )
}

/**
 * A stretch of Jerusalem's city wall up close, with a gate tower: big golden stone blocks, battlements, and a tall arched
 * gateway (`through`: drawn in the gateway, what's beyond it). From x0 to x1, its foot at y, h tall; the gate's middle at gx.
 */
export function CityWall({ x0, x1, y, h, gx, through }: { x0: number; x1: number; y: number; h: number; gx: number; through?: ReactNode }) {
  const c = '#e6c792', line = '#b08d55'
  const id = `gw${uidOf(useId())}`
  const top = y - h, tw = 150, tt = top - 50
  const blocks: string[] = []
  for (let r = 0, by = y; by > top + 4; r++, by -= 26) {
    blocks.push(`M${x0} ${by} H${x1}`)
    for (let bx = x0 + (r % 2) * 30; bx < x1; bx += 60) blocks.push(`M${bx} ${by} V${Math.max(top, by - 26)}`)
  }
  return (
    <g>
      <defs><clipPath id={id}><path d={`M${gx - 36} ${y} V${y - 104} Q${gx} ${y - 140} ${gx + 36} ${y - 104} V${y} Z`} /></clipPath></defs>
      <rect x={x0} y={top} width={x1 - x0} height={h} fill={c} stroke={line} strokeWidth={2.5} />
      <path d={blocks.join(' ')} stroke="#d2b07a" strokeWidth={1.8} />
      {Array.from({ length: Math.ceil((x1 - x0) / 34) }, (_, i) => <rect key={i} x={x0 + 4 + i * 34} y={top - 16} width={20} height={16} fill={c} stroke={line} strokeWidth={2} />)}
      {/* the gate tower */}
      <rect x={gx - tw / 2} y={tt} width={tw} height={y - tt} fill="#e0bd84" stroke={line} strokeWidth={2.5} />
      <path d={`M${gx - tw / 2} ${tt + 40} H${gx + tw / 2} M${gx - tw / 2} ${tt + 80} H${gx + tw / 2} M${gx - tw / 2} ${tt + 120} H${gx + tw / 2}`} stroke="#cfa86c" strokeWidth={1.8} />
      {[-60, -30, 0, 30, 60].map((mx) => <rect key={mx} x={gx + mx - 9} y={tt - 18} width={18} height={18} fill="#e0bd84" stroke={line} strokeWidth={2} />)}
      <rect x={gx - 8} y={tt + 18} width={16} height={22} rx={8} fill="#5a3a24" />
      <g clipPath={`url(#${id})`}>
        <rect x={gx - 40} y={y - 150} width={80} height={150} fill="#5a3a24" />
        {through}
      </g>
      <path d={`M${gx - 36} ${y} V${y - 104} Q${gx} ${y - 140} ${gx + 36} ${y - 104} V${y}`} fill="none" stroke={line} strokeWidth={3} />
      <path d={`M${gx - 44} ${y} V${y - 106} Q${gx} ${y - 150} ${gx + 44} ${y - 106} V${y}`} fill="none" stroke="#cfa86c" strokeWidth={5} />
    </g>
  )
}
