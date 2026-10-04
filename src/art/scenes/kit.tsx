// Story illustration kit. A scene is an 800 x 450 svg: <Scene sky ground> plus props and people
// (../people.tsx). Gentle motion is built in: clouds drift, waves roll, rain falls, stars twinkle,
// boats rock, people blink and breathe. Animation classes live in styles.css under "Story scenes".
// At the bottom, props first drawn for one island, for every island: Rock, WoolSheep and Birds; Tent,
// CampTent, FarCamp, MudHouse and Mat; ThoughtBubble, Dream, Zs and MusicNote.
import { useId, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { itemById, itemForEmoji } from '../items'

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
