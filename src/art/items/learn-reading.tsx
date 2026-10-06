// Little scenes for the reading questions (src/learn/topics/reading.tsx): "the cat is on the bed",
// "the pig is in the tub", "two cats"… Each is composed from the drawn animals and things, plus a few
// props drawn here (an open box, a tub, a mud puddle, a mat, a log). Every scene draws in the usual
// 100 x 100 box. Scene ids are `rd-…`; the topic asks for them by id.
import type { ReactNode } from 'react'
import type { Item } from './types'
import { FARM } from './farm'
import { WILD } from './wild'
import { THINGS } from './things'
import { FOOD } from './food'
import { darken, groundShadow, ink, lighten, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** Another item's drawing, its feet (50, 92) put at (x, y), scaled by s (mirrored when flip). */
function Put({ id, x, y, s, flip }: { id: string; x: number; y: number; s: number; flip?: boolean }) {
  const it = [...FARM, ...WILD, ...THINGS, ...FOOD].find((i) => i.id === id)
  if (!it) return null
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-50 -92)`}>
      <it.Draw />
    </g>
  )
}

// ---------- Props ----------

const BOX = '#d9a066'
const TUB = '#f2f6fb'
const MUD = '#8a5a35'
const MAT = '#e8604c'
const WOOD = '#a8743f'

/** An open cardboard box: the back and inside, drawn before what's in it. */
function BoxBack() {
  return (
    <g {...ROUND}>
      <path d="M22 52 L30 40 L80 40 L86 52 Z" fill={darken(BOX, 0.35)} stroke={ink(BOX)} strokeWidth={2.5} />
      <path d="M30 40 L22 30 L70 30 L80 40 Z" fill={lighten(BOX, 0.1)} stroke={ink(BOX)} strokeWidth={2.5} />
    </g>
  )
}
/** The front of the open box, drawn over what's in it. */
function BoxFront() {
  const sh = useShade(BOX, 0.25, 0.15)
  return (
    <g {...ROUND}>
      <defs>{sh.def}</defs>
      <ellipse {...groundShadow(52, 93, 36)} />
      <path d="M86 52 L86 86 L78 92 L78 58 Z" fill={darken(BOX, 0.2)} stroke={ink(BOX)} strokeWidth={2.5} />
      <rect x={18} y={52} width={60} height={40} rx={2} fill={sh.fill} stroke={ink(BOX)} strokeWidth={2.5} />
      <path d="M18 52 L8 64 L66 64 L78 52" fill={lighten(BOX, 0.18)} stroke={ink(BOX)} strokeWidth={2.5} />
      <path d="M78 52 L94 44 L86 52" fill={lighten(BOX, 0.05)} stroke={ink(BOX)} strokeWidth={2.5} />
    </g>
  )
}

/** A bath tub on little feet: the inside, drawn first. */
function TubBack() {
  return <ellipse cx={50} cy={56} rx={42} ry={8} fill="#c9e6f7" stroke="#8aa4bd" strokeWidth={2.5} />
}
function TubFront() {
  const sh = useShade(TUB, 0.2, 0.12)
  return (
    <g {...ROUND}>
      <defs>{sh.def}</defs>
      <ellipse {...groundShadow(50, 94, 36)} />
      <path d="M22 84 L18 94 M78 84 L82 94" stroke="#c99a3a" strokeWidth={5} />
      <path d="M8 56 Q8 88 30 88 L70 88 Q92 88 92 56 Q50 66 8 56 Z" fill={sh.fill} stroke="#8aa4bd" strokeWidth={2.5} />
      {/* bubbles along the rim */}
      {[[14, 56, 6], [24, 59, 7], [36, 61, 6], [64, 61, 6], [76, 59, 7], [87, 56, 6]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke="#b9cde0" strokeWidth={1.5} />
      ))}
    </g>
  )
}

/** A brown mud puddle: the back half, then the front lip over the feet. */
function MudBack() {
  return <ellipse cx={50} cy={86} rx={46} ry={10} fill={MUD} stroke={ink(MUD)} strokeWidth={2.5} />
}
function MudFront() {
  return (
    <g {...ROUND}>
      <path d="M6 87 Q14 80 24 86 Q34 80 44 87 Q54 80 64 87 Q74 80 84 86 Q90 82 95 87 Q90 96 50 96 Q10 96 6 87 Z"
        fill={darken(MUD, 0.08)} stroke={ink(MUD)} strokeWidth={2.5} />
      <ellipse cx={30} cy={91} rx={7} ry={2} fill={lighten(MUD, 0.25)} opacity={0.7} />
      <ellipse cx={68} cy={92} rx={9} ry={2} fill={lighten(MUD, 0.25)} opacity={0.7} />
      {/* splashes */}
      <circle cx={14} cy={72} r={3} fill={MUD} /><circle cx={86} cy={70} r={2.5} fill={MUD} /><circle cx={22} cy={64} r={2} fill={MUD} />
    </g>
  )
}

/** A red mat with a fringe, lying flat. */
function Mat() {
  return (
    <g {...ROUND}>
      <path d="M14 80 L86 80 L94 94 L6 94 Z" fill={MAT} stroke={ink(MAT)} strokeWidth={2.5} />
      <path d="M18 84 L82 84 L87 90 L13 90 Z" fill="none" stroke="#ffd36e" strokeWidth={2} />
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => <path key={x} d={`M${x} 94 L${x} 98`} stroke={ink(MAT)} strokeWidth={2} />)}
    </g>
  )
}

/** A log lying on its side; what's on it stands at y = 64. */
function Log() {
  const sh = useShade(WOOD, 0.25, 0.2)
  return (
    <g {...ROUND}>
      <defs>{sh.def}</defs>
      <ellipse {...groundShadow(50, 93, 40)} />
      <path d="M14 66 L82 66 A10 13 0 0 1 82 92 L14 92 Z" fill={sh.fill} stroke={ink(WOOD)} strokeWidth={2.5} />
      <ellipse cx={14} cy={79} rx={10} ry={13} fill="#e6c08a" stroke={ink(WOOD)} strokeWidth={2.5} />
      <ellipse cx={14} cy={79} rx={5} ry={7} fill="none" stroke={darken('#e6c08a', 0.2)} strokeWidth={1.5} />
      <path d="M34 72 Q46 70 56 73 M44 84 Q58 82 70 85" fill="none" stroke={darken(WOOD, 0.3)} strokeWidth={1.8} />
    </g>
  )
}

// ---------- Scenes ----------

type Who = 'cat' | 'dog' | 'pig' | 'hen' | 'frog' | 'duck' | 'fox' | 'bug'
const ART: Record<Who, string> = { cat: 'cat', dog: 'dog', pig: 'pig', hen: 'hen', frog: 'frog', duck: 'duck', fox: 'fox', bug: 'caterpillar' }

type Place = 'bed' | 'box' | 'open-box' | 'tub' | 'mud' | 'mat' | 'log'

/** Someone on or in something. */
function placed(who: Who, place: Place): () => ReactNode {
  const a = ART[who]
  switch (place) {
    case 'bed': return () => <><Put id="bed" x={50} y={92} s={1} /><Put id={a} x={56} y={62} s={0.5} /></>
    case 'box': return () => <><Put id="box" x={50} y={94} s={0.8} /><Put id={a} x={50} y={39} s={0.5} /></>
    case 'open-box': return () => <><BoxBack /><Put id={a} x={50} y={68} s={0.66} /><BoxFront /></>
    case 'tub': return () => <><TubBack /><Put id={a} x={50} y={72} s={0.6} /><TubFront /></>
    case 'mud': return () => <><MudBack /><Put id={a} x={50} y={92} s={0.72} /><MudFront /></>
    case 'mat': return () => <><Mat /><Put id={a} x={50} y={89} s={0.72} /></>
    case 'log': return () => <><Log /><Put id={a} x={48} y={68} s={0.52} /></>
  }
}

/** Two or three of the same animal. */
function many(who: Who, n: number): () => ReactNode {
  const a = ART[who]
  const spots = n === 2 ? [[28, 82], [72, 82]] : [[20, 92], [50, 72], [80, 92]]
  return () => <>{spots.map(([x, y], i) => <Put key={i} id={a} x={x} y={y} s={n === 2 ? 0.55 : 0.46} flip={i === 0 && n === 2} />)}</>
}

/** Two different animals side by side. */
function pair(a: Who, b: Who): () => ReactNode {
  return () => <><Put id={ART[a]} x={27} y={86} s={0.55} flip /><Put id={ART[b]} x={73} y={86} s={0.55} /></>
}

/** Where a hat sits on each head (the animal drawn at full size). */
const HEAD: Partial<Record<Who, [number, number, number]>> = { cat: [44, 24, -8], dog: [50, 21, 0] }

/** An animal with a ball beside it, or wearing a hat. */
function having(who: Who, thing: 'ball' | 'hat'): () => ReactNode {
  const a = ART[who]
  if (thing === 'ball') return () => <><Put id={a} x={38} y={92} s={0.78} /><Put id="ball" x={80} y={92} s={0.34} /></>
  const [hx, hy, rot] = HEAD[who] ?? [50, 20, 0]
  // (the animal at s = 0.86, centred: its head point moves with it)
  const s = 0.86, x = 50 + (hx - 50) * s, y = 96 + (hy - 92) * s
  return () => <><Put id={a} x={50} y={96} s={s} /><g transform={`rotate(${rot} ${x} ${y})`}><Put id="top-hat" x={x} y={y + 3} s={0.4} /></g></>
}

const scene = (id: string, name: string, draw: () => ReactNode): Item => {
  const Draw = () => <g>{draw()}</g>
  return { id: `rd-${id}`, name, emoji: [], Draw }
}

const ON: [Who, Place][] = [
  ['cat', 'bed'], ['dog', 'bed'], ['bug', 'bed'], ['frog', 'bed'],
  ['hen', 'box'], ['cat', 'box'], ['fox', 'box'],
  ['cat', 'mat'], ['dog', 'mat'],
  ['frog', 'log'], ['duck', 'log'], ['bug', 'log'],
]
const IN: [Who, Place][] = [
  ['cat', 'open-box'], ['dog', 'open-box'], ['hen', 'open-box'], ['fox', 'open-box'],
  ['pig', 'tub'], ['dog', 'tub'], ['frog', 'tub'], ['duck', 'tub'],
  ['pig', 'mud'], ['hen', 'mud'], ['dog', 'mud'],
]
const PLACE_NAME: Record<Place, string> = { bed: 'bed', box: 'box', 'open-box': 'box', tub: 'tub', mud: 'mud', mat: 'mat', log: 'log' }
const NUM = ['', 'one', 'two', 'three']

export const LEARN_READING: Item[] = [
  ...ON.map(([w, p]) => scene(`${w}-on-${PLACE_NAME[p]}`, `${w} on the ${PLACE_NAME[p]}`, placed(w, p))),
  ...IN.map(([w, p]) => scene(`${w}-in-${PLACE_NAME[p]}`, `${w} in the ${PLACE_NAME[p]}`, placed(w, p))),
  ...([['cat', 2], ['dog', 2], ['pig', 2], ['pig', 3], ['hen', 3], ['hen', 2]] as [Who, number][])
    .map(([w, n]) => scene(`${w}s-${n}`, `${NUM[n]} ${w}s`, many(w, n))),
  ...([['hen', 'pig'], ['hen', 'dog'], ['cat', 'pig'], ['cat', 'dog'], ['duck', 'frog'], ['dog', 'frog']] as [Who, Who][])
    .map(([a, b]) => scene(`${a}-${b}`, `a ${a} and a ${b}`, pair(a, b))),
  ...([['dog', 'ball'], ['cat', 'ball'], ['dog', 'hat'], ['cat', 'hat']] as [Who, 'ball' | 'hat'][])
    .map(([w, t]) => scene(`${w}-${t}`, `${w} with a ${t}`, having(w, t))),
  // The props alone, for pictures of a place.
  scene('tub', 'tub', () => <><TubBack /><TubFront /></>),
  scene('mud', 'mud', () => <><MudBack /><MudFront /></>),
  scene('mat', 'mat', () => <Mat />),
  scene('log', 'log', () => <Log />),
]
