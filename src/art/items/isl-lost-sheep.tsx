// Drawn things first needed by the The Lost Sheep island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
//
// The island's little lamb lives here too (LittleLamb, LambFace), with the shepherd carrying it home on his
// shoulders (ShepherdCarrying), because the activities show them as well as the story pictures
// (art/scenes/lost-sheep.tsx) and the mini-game (art/games/lost-sheep.tsx), which import them from here. The lamb
// looks like the 🐑 drawing (a creamy face, peach ears, a woolly topknot), so it's the same little lamb everywhere.
import { useId, type CSSProperties, type ReactNode } from 'react'
import type { Item } from './types'
import { CuteFace, darken, EYE, fluff, groundShadow, ink, lighten, Shine, useShade } from './draw'
import { Figure, PEOPLE } from '../people'

// ---------- The little lamb ----------

export const LAMB = { wool: '#fffaf2', line: '#cbbfb4', face: '#ffe3d3', ear: '#ffcfb8', leg: '#7a6670' }

/** How the little lamb feels: `scared` (stuck in the bush: worried brows), `joy` (eyes shut tight with smiling), `sleepy`. */
export type LambMood = 'happy' | 'scared' | 'joy' | 'sleepy'

/**
 * The little lamb's head, turned to us: a creamy face, peach ears out to the sides and a woolly topknot.
 * (x, y) is the middle of its face; at s = 1 it's about 44 wide (with its ears) and 30 tall.
 */
export function LambFace({ x = 0, y = 0, s = 1, mood = 'happy', blinkDelay = 0 }: { x?: number; y?: number; s?: number; mood?: LambMood; blinkDelay?: number }) {
  const face = useShade(LAMB.face, 0.4, 0.1)
  const wool = useShade(LAMB.wool, 0.5, 0.12)
  const shut = mood === 'joy' || mood === 'sleepy'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{face.def}{wool.def}</defs>
      {/* ears, out to the sides */}
      {[-1, 1].map((d) => (
        <g key={d} transform={`scale(${d} 1)`}>
          <ellipse cx={14.5} cy={-5} rx={8.5} ry={4.4} fill={LAMB.ear} stroke={ink(LAMB.ear)} strokeWidth={1.6} transform="rotate(18 14.5 -5)" />
          <ellipse cx={15.5} cy={-4.6} rx={5} ry={2.1} fill="#ffb3c2" transform="rotate(18 15.5 -4.6)" />
        </g>
      ))}
      <ellipse cx={0} cy={0} rx={11} ry={12} fill={face.fill} stroke={ink(LAMB.face)} strokeWidth={1.8} />
      {/* the woolly topknot */}
      <path d={fluff(0, -11.5, 8.5, 4.2, 6)} fill={wool.fill} stroke={LAMB.line} strokeWidth={1.6} strokeLinejoin="round" />
      {shut ? (
        <g>
          <path d={mood === 'joy' ? 'M-6.4 -0.2 Q-3.9 -3.4 -1.4 -0.2 M1.4 -0.2 Q3.9 -3.4 6.4 -0.2' : 'M-6.4 -1.2 Q-3.9 1.4 -1.4 -1.2 M1.4 -1.2 Q3.9 1.4 6.4 -1.2'}
            stroke={EYE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          {[-1, 1].map((d) => <ellipse key={d} cx={d * 7} cy={3.4} rx={2} ry={1.3} fill="#ff7fb0" opacity={0.55} />)}
          {mood === 'joy'
            ? <path d="M-2.4 3.6 Q0 7 2.4 3.6 Q0 4.6 -2.4 3.6 Z" fill="#6b2a3a" stroke={EYE} strokeWidth={0.9} strokeLinejoin="round" />
            : <path d="M-1.6 4.4 Q0 5.6 1.6 4.4" stroke={EYE} strokeWidth={1.1} fill="none" strokeLinecap="round" />}
        </g>
      ) : mood === 'scared' ? (
        <g>
          <CuteFace x={0} y={-0.4} s={0.3} gap={13} mouth={false} blinkDelay={blinkDelay} />
          {/* worried brows, raised in the middle, and a little "o" of a mouth */}
          <path d="M-6.6 -5.2 L-2.2 -6.8 M6.6 -5.2 L2.2 -6.8" stroke={EYE} strokeWidth={1.1} strokeLinecap="round" />
          <ellipse cx={0} cy={5} rx={1.4} ry={1.7} fill="#6b2a3a" />
        </g>
      ) : (
        <CuteFace x={0} y={-0.4} s={0.3} gap={13} blinkDelay={blinkDelay} />
      )}
    </g>
  )
}

/**
 * The little lamb standing side-on, facing right (or left), with its face turned to us (like the Noah animals):
 * four legs, a woolly body, a little tail that wags at the back. (x, y) = the ground under it; at s = 1 it's
 * about 74 wide and 64 tall (an adult sheep from the kit is about 95 wide at s = 1).
 */
export function LittleLamb({ x, y, s = 1, facing = 'right', mood = 'happy', blinkDelay = 0 }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; mood?: LambMood; blinkDelay?: number
}) {
  const wool = useShade(LAMB.wool, 0.5, 0.12)
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{wool.def}</defs>
      <ellipse cx={0} cy={-1} rx={27} ry={3} fill="#000" opacity={0.12} />
      {/* far legs (in shadow), then near legs */}
      {[-14, 12].map((lx) => <rect key={lx} x={lx} y={-22} width={6} height={21} rx={3} fill={darken(LAMB.leg, 0.25)} />)}
      {[-21, 5].map((lx) => <rect key={lx} x={lx} y={-21} width={6.5} height={21} rx={3.2} fill={LAMB.leg} stroke={ink(LAMB.leg)} strokeWidth={1.2} />)}
      <g className="pa-tail" style={{ '--o': '100% 60%' } as CSSProperties}>
        <circle cx={-28} cy={-35} r={5.5} fill={wool.fill} stroke={LAMB.line} strokeWidth={1.8} />
      </g>
      <path d={fluff(-2, -32, 24, 14, 10)} fill={wool.fill} stroke={LAMB.line} strokeWidth={2} strokeLinejoin="round" />
      <Shine x={-12} y={-38} rx={7} ry={3.5} />
      <LambFace x={22} y={-46} mood={mood} blinkDelay={blinkDelay} />
    </g>
  )
}

// ---------- The shepherd carrying the lamb home ----------

/** The shepherd's look (PEOPLE.shepherd), the same on every page. */
export const SHEPHERD = PEOPLE.shepherd

/** One of the shepherd's sleeves along `d` (figure units), drawn as Person draws them. */
function Sleeve({ d }: { d: string }) {
  const robe = SHEPHERD.robe
  const common = { d, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <g>
      <path {...common} stroke={ink(robe)} strokeWidth={17} />
      <path {...common} stroke={robe} strokeWidth={14} />
      <path {...common} stroke={lighten(robe, 0.15)} strokeWidth={8} />
    </g>
  )
}

/** A lamb's leg hanging down from (x1, y1) to its hoof at (x2, y2). */
const Leg = ({ x1, y1, x2, y2, far }: { x1: number; y1: number; x2: number; y2: number; far?: boolean }) => (
  <g strokeLinecap="round">
    <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={ink(LAMB.leg)} strokeWidth={7.6} />
    <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={far ? darken(LAMB.leg, 0.2) : LAMB.leg} strokeWidth={5.4} />
  </g>
)

/** Where the shepherd's right hand holds the lamb's front legs, in figure units. */
const GRIP: [number, number] = [34, -86]

/**
 * The little lamb lying across the shepherd's shoulders, in his units (drawn between his arms and his head, so
 * his head is in front of its middle): its rump and tail on his left, its back legs dangling over that shoulder,
 * and its head by his right ear, its front legs held in his right hand.
 */
function LambOnShoulders({ mood, wrap = (lamb) => lamb }: { mood: LambMood; wrap?: (lamb: ReactNode) => ReactNode }) {
  const wool = useShade(LAMB.wool, 0.5, 0.12)
  return (
    <g>
      <defs>{wool.def}</defs>
      {/* his right arm, bent up to hold the front legs (over the straight sleeve Figure draws to the hand) */}
      <Sleeve d={`M20 -86 L40 -62 L${GRIP[0]} ${GRIP[1]}`} />
      {wrap(
        <g>
          {/* back legs, dangling over his left shoulder */}
          <Leg x1={-42} y1={-100} x2={-40} y2={-73} far />
          <Leg x1={-50} y1={-101} x2={-51} y2={-75} />
          {/* the tail, then the woolly body across his shoulders */}
          <circle cx={-61} cy={-110} r={6.2} fill={wool.fill} stroke={LAMB.line} strokeWidth={1.9} />
          <path d={fluff(-1, -108, 55, 15.5, 15)} fill={wool.fill} stroke={LAMB.line} strokeWidth={2.1} strokeLinejoin="round" />
          <Shine x={-42} y={-114} rx={7} ry={3.2} rot={-10} />
          {/* front legs, held in his hand (the hand is drawn over them) */}
          <Leg x1={41} y1={-100} x2={31} y2={-74} far />
          <Leg x1={48} y1={-101} x2={37} y2={-74} />
          <LambFace x={55} y={-117} s={1.02} mood={mood} />
        </g>,
      )}
    </g>
  )
}

/**
 * The shepherd (PEOPLE.shepherd) carrying the little lamb home across his shoulders, so happy: one hand holds
 * its front legs, the other his staff. Origin at his feet, as Person; about 170 tall with the staff at s = 1.
 * `wrapLamb` wraps the lamb's drawing (a story picture makes it a thing to tap of its own).
 */
export function ShepherdCarrying({ x, y, s = 1, facing = 'right', mood = 'joy', lambMood = 'happy', staff = true, blinkDelay = 0, wrapLamb }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; mood?: 'happy' | 'joy'; lambMood?: LambMood; staff?: boolean; blinkDelay?: number
  wrapLamb?: (lamb: ReactNode) => ReactNode
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <Figure x={0} y={0} look={SHEPHERD} mood={mood} holding={staff ? 'staff' : undefined} heldHand={0} reach={[null, GRIP]}
        item={<LambOnShoulders mood={lambMood} wrap={wrapLamb} />} blinkDelay={blinkDelay} />
    </g>
  )
}

// ---------- The sheepfold ----------

export const STONE = '#cfc3ad'
const f1 = (n: number) => n.toFixed(1)

/**
 * A round sheepfold of piled stones, seen from a little above: the inside of its back wall, the grassy floor, and
 * its front wall of stones with a gateway in it. The floor is the ellipse round (cx, cy), rx by ry; the wall is `h`
 * tall; the gateway runs from x = gate[0] to gate[1] along the front. `inside` is drawn on the floor, behind the
 * front wall (sheep in the fold peek over it); `closed` puts a gate of poles across the gateway. `w`: outline width.
 */
export function StoneFold({ cx, cy, rx, ry, h, gate, closed, inside, w = 2.2, grass = '#9fd08a', shadow = true }: {
  cx: number; cy: number; rx: number; ry: number; h: number; gate: [number, number]; closed?: boolean; inside?: ReactNode; w?: number
  grass?: string; shadow?: boolean
}) {
  const stone = useShade(STONE, 0.3, 0.18)
  const line = ink(STONE)
  /** The front of the floor ellipse, at x = u, lifted `up`. */
  const fy = (u: number, up = 0) => cy - up + ry * Math.sqrt(Math.max(0, 1 - ((u - cx) / rx) ** 2))
  const L = cx - rx, R = cx + rx
  const [g0, g1] = gate
  const arc = (sweep: 0 | 1, x: number, y: number) => `A${rx} ${ry} 0 0 ${sweep} ${f1(x)} ${f1(y)}`
  /** The front wall's face from x = a to x = b. */
  const face = (a: number, b: number) => `M${f1(a)} ${f1(fy(a))} ${arc(0, b, fy(b))} L${f1(b)} ${f1(fy(b, h))} ${arc(1, a, fy(a, h))} Z`
  /** A line along the front at height `up`, from x = a to x = b. */
  const course = (a: number, b: number, up: number) => `M${f1(a)} ${f1(fy(a, up))} ${arc(0, b, fy(b, up))}`
  const pieces: [number, number][] = [[L, g0], [g1, R]]
  // The stones: three courses of rounded stones, each course a half stone along from the one below.
  const step = Math.max(9, rx / 4.6)
  const tones = [STONE, lighten(STONE, 0.1), darken(STONE, 0.07)]
  const stones = pieces.flatMap(([a, b], p) => [0, 1, 2].flatMap((k) => {
    const out: [number, number, number][] = []
    for (let u = a + (k % 2 ? step * 0.5 : 0), i = 0; u < b + step * 0.5; u += step, i++) out.push([u, fy(u, (h * (k + 0.5)) / 3), (i * 7 + k * 3 + p) % 3])
    return out
  }))
  const clip = `sf${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const pole = (up: number) => `M${f1(g0 - w)} ${f1(fy(g0, up))} L${f1(g1 + w)} ${f1(fy(g1, up))}`
  return (
    <g strokeLinejoin="round">
      <defs>{stone.def}</defs>
      {shadow && <ellipse cx={cx} cy={cy + ry * 0.92} rx={rx * 1.04} ry={ry * 0.32} fill="#000" opacity={0.12} />}
      {/* the floor inside (and in the gateway), and the inside of the back wall */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={grass} />
      <ellipse cx={cx} cy={cy - h} rx={rx} ry={ry} fill={grass} />
      <path d={`M${f1(L)} ${f1(cy)} ${arc(1, R, cy)} L${f1(R)} ${f1(cy - h)} ${arc(0, L, cy - h)} Z`} fill={darken(STONE, 0.2)} />
      <path d={`M${f1(L)} ${f1(cy - h * 0.5)} ${arc(1, R, cy - h * 0.5)}`} stroke={darken(STONE, 0.3)} strokeWidth={w * 0.55} fill="none" />
      <path d={`M${f1(L)} ${f1(cy)} ${arc(1, R, cy)}`} stroke={darken(STONE, 0.34)} strokeWidth={w * 0.55} fill="none" />
      <path d={`M${f1(L)} ${f1(cy - h)} ${arc(1, R, cy - h)}`} stroke={lighten(STONE, 0.22)} strokeWidth={w * 2.2} fill="none" strokeLinecap="round" />
      <path d={`M${f1(L)} ${f1(cy - h)} ${arc(1, R, cy - h)}`} stroke={line} strokeWidth={w * 0.6} fill="none" />
      {inside}
      {/* the front wall of rounded stones, either side of the gateway */}
      <defs><clipPath id={clip}>{pieces.map(([a, b]) => <path key={a} d={face(a, b)} />)}</clipPath></defs>
      {pieces.map(([a, b]) => <path key={a} d={face(a, b)} fill={stone.fill} />)}
      <g clipPath={`url(#${clip})`}>
        {stones.map(([sx, sy, t], i) => (
          <ellipse key={i} cx={f1(sx)} cy={f1(sy)} rx={f1(step * 0.56)} ry={f1(h / 5.6)} fill={tones[t]} stroke={darken(STONE, 0.3)} strokeWidth={w * 0.6} />
        ))}
      </g>
      {pieces.map(([a, b]) => <path key={a} d={face(a, b)} fill="none" stroke={line} strokeWidth={w} />)}
      {/* the top of the front wall */}
      {pieces.map(([a, b]) => (
        <g key={a}>
          <path d={course(a, b, h)} stroke={lighten(STONE, 0.25)} strokeWidth={w * 2} fill="none" strokeLinecap="round" />
          <path d={course(a, b, h)} stroke={line} strokeWidth={w * 0.6} fill="none" />
        </g>
      ))}
      {/* a gate of poles across the gateway */}
      {closed && (
        <g strokeLinecap="round">
          {[h * 0.3, h * 0.72].map((up) => (
            <g key={up}>
              <path d={pole(up)} stroke="#6b4422" strokeWidth={w * 2.6} />
              <path d={pole(up)} stroke="#a0703f" strokeWidth={w * 1.6} />
            </g>
          ))}
        </g>
      )}
    </g>
  )
}

/** The fold in the item pictures: a 100 x 100 box. */
const ITEM_FOLD = { cx: 50, cy: 76, rx: 44, ry: 14, h: 22, gate: [64, 79] as [number, number] }

/**
 * The empty sheepfold, for counting the sheep into: taller, and seen from a little higher, with its open top high in
 * the box, so the sheep that the counting game piles into the top of it stand just inside its back wall.
 */
function Sheepfold() {
  return <StoneFold cx={50} cy={64} rx={45} ry={16} h={32} gate={[60, 77]} grass="#7fb06e" />
}

/** Sheep's woolly backs and dark faces peeking over the fold's front wall: the sheep safe at home. */
function SheepfoldHome() {
  const wool = useShade(LAMB.wool, 0.5, 0.12)
  const backs: [number, number, number][] = [[26, 52, 1], [47, 49, -1], [68, 52, 1], [36, 60, -1], [58, 61, 1], [80, 58, -1]]
  return (
    <StoneFold {...ITEM_FOLD} inside={(
      <g>
        <defs>{wool.def}</defs>
        {backs.map(([bx, by, d], i) => (
          <g key={i}>
            <path d={fluff(bx, by, 10, 6.5, 7)} fill={wool.fill} stroke={LAMB.line} strokeWidth={1.6} />
            <ellipse cx={bx + d * 9.5} cy={by - 4} rx={4.6} ry={4} fill="#4a3a3a" />
            <circle cx={bx + d * 10.8} cy={by - 5} r={1.1} fill="#fff" />
          </g>
        ))}
      </g>
    )} />
  )
}

/** The shepherd carrying the little lamb home on his shoulders, standing on the grass (the maze's hero, and a sticker). */
function ShepherdAndLamb() {
  return (
    <g>
      <ellipse {...groundShadow(50, 95, 22)} />
      <ShepherdCarrying x={52} y={96} s={0.54} />
    </g>
  )
}

export const ISL_LOST_SHEEP: Item[] = [
  { id: 'sheepfold', name: 'sheepfold', emoji: [], Draw: Sheepfold },
  { id: 'sheepfold-home', name: 'sheepfold with the sheep safe inside', emoji: [], Draw: SheepfoldHome },
  { id: 'shepherd-carrying-lamb', name: 'the shepherd carrying the lamb home', emoji: [], Draw: ShepherdAndLamb },
]
