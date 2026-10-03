// Story illustration kit. A scene is an 800 x 450 svg: <Scene sky ground> plus props and people
// (../people.tsx). Gentle motion is built in: clouds drift, waves roll, rain falls, stars twinkle,
// boats rock, people blink and breathe. Animation classes live in styles.css under "Story scenes".
import { useId, type CSSProperties, type ReactNode } from 'react'
import { ink, lighten, useShade } from '../kit'
import { itemForEmoji } from '../items'

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
export function Emoji({ e, x, y, size = 60, bob, flip }: { e: string; x: number; y: number; size?: number; bob?: boolean; flip?: boolean }) {
  const item = itemForEmoji(e)
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
