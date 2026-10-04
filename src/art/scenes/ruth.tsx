// Ruth and Naomi: one picture per story page, both parts in order (see data/ruth.ts for the words).
// Built from the kit (./kit.tsx) and people (../people.tsx), with joseph.tsx's Figure (faces for feelings and
// hugs), daniel.tsx's Kneel, abraham.tsx's Sitting, faces and thought bubble, and the barley, Bethlehem and
// olive trees from ../items/isl-ruth.tsx. God is never drawn as a person: His care is light (Glow, Rays).
// Kept gentle: Naomi's loss is one sentence, and her picture only shows her sad, with Ruth and Orpah close.
//
// The cast (to move into people.tsx's PEOPLE): NAOMI (silver hair under a cream head cloth: draw her with
// Naomi), RUTH and ORPAH (dark hair under their scarves: Ruth, Orpah), BOAZ, Naomi's husband ELIMELECH and
// their sons (MAHLON_BOY and CHILION_BOY, then grown up: MAHLON, CHILION), HARVESTERS (Boaz's workers),
// NEIGHBORS (the women of Bethlehem) and baby Obed's blanket (OBED_BLANKET, in isl-ruth.tsx).
// New props, for any island: BarleyField (ripe barley standing in a field, with the cut stubble in front),
// BarleySheaf, GleanBasket (a deep basket, with barley heaped in it), Sickle, WaterJar, Road, StoneHouse,
// TownGate and Moab's far hills.
import { useId, type ComponentProps, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Person, PEOPLE, SKIN, type Look } from '../people'
import { Bread, Cloud, Flower, Glow, Moon, Rays, Scene, Sheep, Sparkles, Sun, Tap, sparkle } from './kit'
import { Figure } from './joseph'
import { Kneel } from './daniel'
import { LaughFace, Laughing, SilverHair, Sitting, ThoughtBubble } from './abraham'
import { Grip, Tambourine } from './moses'
import { Birds, MudHouse } from './baby-moses'
import { TravelBundle } from './burning-bush'
import { BARLEY, BARLEY_LINE, AWN, STRAW, STRAW_LINE, BarleyBunch, BarleyEar, BarleyHeap, BarleyStalk, Bethlehem, OBED_BLANKET, OliveTree } from '../items/isl-ruth'
import { seeded } from '../items/isl-manna'

type Pt = [number, number]
const f = (n: number) => n.toFixed(1)
const rad = (a: number) => (a * Math.PI) / 180
const gid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

// ---------- The people (the same on every page) ----------

/** Naomi: older, her silver hair peeking out under a cream head cloth (draw her with Naomi), in a plum robe. */
export const NAOMI: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#e9e5de', wrap: '#f1e2c2', robe: '#8e4f86', sash: '#f0c75a' }
/** Ruth, from Moab: young, her dark hair peeking out under a rose head scarf (draw her with Ruth), in a sky-blue robe. */
export const RUTH: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8607a', robe: '#4a86d8', sash: '#f6d36b' }
/** Orpah, Naomi's other daughter-in-law: young, under a teal head scarf (draw her with Orpah), in a marigold robe. */
export const ORPAH: Look = { skin: '#e3b48c', hair: 'covered', hairColor: '#3b2a20', wrap: '#46a898', robe: '#eb9a3e', sash: '#fff3d6' }
/** Boaz: a kind, well-to-do farmer of Bethlehem: a white head cloth, a short brown beard, a deep green robe and a gold sash. */
export const BOAZ: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#f6f0e2', beard: 'short', beardColor: '#6b4a30', robe: '#3c8052', sash: '#f2c94c' }
/** Naomi's husband (page 1 only): a sandy head cloth, a short dark beard and a brown robe. */
export const ELIMELECH: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e2cfa0', beard: 'short', beardColor: '#3b2a20', robe: '#8a6a4a', sash: '#c0504d' }
/** Naomi's two boys (page 1), then grown up with beards (page 2): Mahlon married Ruth, and Chilion married Orpah. */
export const MAHLON_BOY: Look = { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', robe: '#e2a33c', sash: '#8a5428', build: 'child' }
export const CHILION_BOY: Look = { skin: SKIN.medium, hair: 'curly', hairColor: '#3b2a20', robe: '#9a84cc', sash: '#f5f0e6', build: 'child' }
export const MAHLON: Look = { ...MAHLON_BOY, build: 'adult', beard: 'short', beardColor: '#3b2a20' }
export const CHILION: Look = { ...CHILION_BOY, build: 'adult', beard: 'short', beardColor: '#3b2a20' }
/** Boaz's workers in the barley field, in work clothes and head cloths. */
export const HARVESTERS: Look[] = [
  { skin: SKIN.deep, hair: 'covered', hairColor: '#2b1f18', wrap: '#f1e6cc', beard: 'short', beardColor: '#2b1f18', robe: '#b5703f', sash: '#5f8fc0' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#c0504d', robe: '#c98f8f', sash: '#7a5233' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#9ec3e6', beard: 'short', beardColor: '#3b2a20', robe: '#8f7a5a', sash: '#e8dcc0' },
  { skin: '#e3b48c', hair: 'covered', hairColor: '#4a3020', wrap: '#f5f0e6', robe: '#6fae98', sash: '#f0d38a' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#2b1f18', wrap: '#e8c25a', beard: 'short', beardColor: '#2b1f18', robe: '#a35a4a', sash: '#f5f0e6' },
]
/** The women of Bethlehem, Naomi's neighbors (the second one is old, with silver hair). */
export const NEIGHBORS: Look[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#a98cff', robe: '#f29a9a', sash: '#fff3d6' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#ffd34d', robe: '#6fb7b0', sash: '#f5f0e6' },
  { skin: '#e3b48c', hair: 'covered', hairColor: '#4a3020', wrap: '#7cc0e8', robe: '#e58a6a', sash: '#fff3d6' },
]
/** The town's old men, who sat at Bethlehem's gate (they saw Boaz and Ruth marry). */
export const ELDERS: Look[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#f5f0e6', beard: 'long', beardColor: '#eeeae2', robe: '#7d6aa8', sash: '#e0b45a' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#e8e4dc', wrap: '#c9a46a', beard: 'long', beardColor: '#e6e1d8', robe: '#5f8f6a', sash: '#f0d38a' },
]
export { OBED_BLANKET }

type FigProps = Omit<ComponentProps<typeof Figure>, 'look'>

/** Dark hair peeking out under a scarf (in a Person's own units): she's young. */
export const DarkHair = () => <SilverHair color="#3b2a20" />

/** Naomi, with her silver hair. */
export function Naomi({ children, ...p }: FigProps) {
  return <Figure {...p} look={NAOMI}><SilverHair />{children}</Figure>
}
/** Ruth, with her dark hair under her rose scarf. */
export function Ruth({ children, ...p }: FigProps) {
  return <Figure {...p} look={RUTH}><DarkHair />{children}</Figure>
}
/** Orpah, with her dark hair under her teal scarf. */
export function Orpah({ children, ...p }: FigProps) {
  return <Figure {...p} look={ORPAH}><DarkHair />{children}</Figure>
}
/** Boaz. */
export function Boaz(p: FigProps) {
  return <Figure {...p} look={BOAZ} />
}

/** Where a figure at (fx, fy), `fs` big, facing `facing`, must reach to touch (tx, ty) in the picture: in its own units. */
const reach = (fx: number, fy: number, fs: number, tx: number, ty: number, facing: 'left' | 'right' = 'right'): Pt =>
  [((tx - fx) / fs) * (facing === 'left' ? -1 : 1), (ty - fy) / fs]

/** A hand drawn again on top of someone else (a hug's hand on a shoulder), in picture units. */
const HandOn = ({ x, y, s = 1, look }: { x: number; y: number; s?: number; look: Look }) => (
  <circle cx={x} cy={y} r={7 * s} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2 * s} />
)

/** A floating heart (love and joy). */
function Heart({ x, y, s = 1, d = 0, color = '#ff6f91' }: { x: number; y: number; s?: number; d?: number; color?: string }) {
  return (
    <g className="sc-float" style={{ animationDelay: `${d}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 13 C-20 0 -17 -17 -7 -17 C-3 -17 0 -14 0 -10 C0 -14 3 -17 7 -17 C17 -17 20 0 0 13 Z" fill={color} stroke={darken(color, 0.25)} strokeWidth={2.5} strokeLinejoin="round" />
        <ellipse cx={-8} cy={-9} rx={3.6} ry={2.2} fill="#fff" opacity={0.65} transform="rotate(-35 -8 -9)" />
      </g>
    </g>
  )
}

// ---------- Barley in the field ----------

/** One little ear of barley far away, as path pieces: its grain and its whiskers (so a whole row is two paths). */
function earPieces(ex: number, ey: number, a: number, k: number): [string, string] {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a))
  const p = (x: number, y: number) => `${f(ex + x * c - y * s)} ${f(ey + x * s + y * c)}`
  const body = `M${p(0, 0)} Q${p(-3.4 * k, -8 * k)} ${p(0, -17 * k)} Q${p(3.4 * k, -8 * k)} ${p(0, 0)} Z`
  const awns = [-1.6, -0.5, 0.6, 1.7].map((dx, i) => `M${p(dx * k, (-11 - i) * k)} L${p((dx * 2.4 + (i - 1.5) * 0.8) * k, -38 * k)}`).join(' ')
  return [body, awns]
}

/**
 * Ripe barley standing in a field: golden stalks packed close, their bearded ears nodding along the top. The ears
 * run along y from x0 to x1 (`k`: how big they are; far away, small), and the stalks fill down to y + `depth`.
 * `cut`: a clean edge on that side (where the harvesters have cut up to).
 */
export function BarleyField({ x0 = -10, x1 = 810, y, depth = 60, k = 0.6, seed = 3, rows = 2, color = '#e9bf52' }: {
  x0?: number; x1?: number; y: number; depth?: number; k?: number; seed?: number; rows?: number; color?: string
}) {
  const id = `bf${gid(useId())}`
  const rnd = seeded(seed)
  const step = 6.5 * k + 2
  const bodies: string[][] = []
  const awnRows: string[][] = []
  for (let r = 0; r < rows; r++) {
    const kk = k * (1 + r * 0.18)
    const yy = y + r * 9 * k
    const b: string[] = [], a: string[] = []
    for (let x = x0 + (r % 2) * step * 0.5; x <= x1; x += step * (1 + r * 0.15)) {
      const ex = x + (rnd() - 0.5) * step * 0.6
      const ey = yy + Math.sin(x * 0.045 + seed) * 3 * k + (rnd() - 0.5) * 4 * k
      const [body, awn] = earPieces(ex, ey, 12 + (rnd() - 0.5) * 22, kk)
      b.push(body)
      a.push(awn)
    }
    bodies.push(b)
    awnRows.push(a)
  }
  const top = y + 2
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(color, 0.12)} /><stop offset="1" stopColor={darken(color, 0.12)} />
        </linearGradient>
      </defs>
      <path d={`M${x0} ${top} ${Array.from({ length: 12 }, (_, i) => `Q${f(x0 + ((x1 - x0) * (i + 0.5)) / 12)} ${f(top - 6 * k)} ${f(x0 + ((x1 - x0) * (i + 1)) / 12)} ${f(top)}`).join(' ')} L${x1} ${y + depth} L${x0} ${y + depth} Z`}
        fill={`url(#${id})`} />
      {/* stalks: fine upright strokes */}
      <path d={Array.from({ length: Math.floor((x1 - x0) / (step * 1.4)) }, (_, i) => {
        const sx = x0 + i * step * 1.4 + 3
        return `M${f(sx)} ${f(top + 4)} L${f(sx + 1.5)} ${f(y + depth - 2)}`
      }).join(' ')} stroke={darken(color, 0.16)} strokeWidth={Math.max(0.8, 1.6 * k)} opacity={0.55} />
      {bodies.map((b, r) => (
        <g key={r}>
          <path d={awnRows[r].join(' ')} stroke={AWN} strokeWidth={Math.max(0.6, 1.1 * k)} fill="none" strokeLinecap="round" />
          <path d={b.join(' ')} fill={BARLEY} stroke={BARLEY_LINE} strokeWidth={Math.max(0.6, 1.1 * k)} strokeLinejoin="round" />
        </g>
      ))}
    </g>
  )
}

/** The cut field: pale straw stubble in rows, from y0 (far) to y1 (near), x0 to x1. */
export function Stubble({ y0, y1, x0 = -10, x1 = 810, color = '#ead08a', seed = 5 }: { y0: number; y1: number; x0?: number; x1?: number; color?: string; seed?: number }) {
  const rnd = seeded(seed)
  const rows: string[] = []
  for (let y = y0 + 8, i = 0; y < y1; i++) {
    const k = 0.5 + (y - y0) / Math.max(1, y1 - y0)
    const gap = 9 * k
    let d = ''
    for (let x = x0 + (i % 2) * gap * 0.5 + rnd() * 4; x < x1; x += gap) d += `M${f(x)} ${f(y)} l${f(-1 * k)} ${f(-5 * k)} M${f(x + 3 * k)} ${f(y)} l${f(1 * k)} ${f(-6 * k)} `
    rows.push(d)
    y += 11 * k
  }
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={color} />
      <path d={rows.join(' ')} stroke={darken(color, 0.22)} strokeWidth={1.4} strokeLinecap="round" opacity={0.75} />
    </g>
  )
}

/**
 * A sheaf of barley standing in the field: an armful of stalks tied round the middle, the straw splayed out on the
 * ground below the tie and the bearded ears fanned out above it. (x, y): its foot; about 100 tall at s = 1.
 */
export function BarleySheaf({ x, y, s = 1, lean = 0 }: { x: number; y: number; s?: number; lean?: number }) {
  const fan = [-34, -22, -11, 0, 11, 22, 34]
  const tie = -40
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-1} rx={26} ry={3.5} fill="#000" opacity={0.12} />
      <path d={`M-22 -1 L-8 ${tie} L8 ${tie} L22 -1 Q0 3 -22 -1 Z`} fill={STRAW} stroke={STRAW_LINE} strokeWidth={2.2} strokeLinejoin="round" />
      <path d={[-15, -8, -1, 6, 13].map((dx) => `M${f(dx * 0.4)} ${tie} L${dx} -2`).join(' ')} stroke={STRAW_LINE} strokeWidth={1.2} opacity={0.7} />
      <g transform={`rotate(${lean} 0 ${tie})`}>
        {fan.map((a, i) => {
          const ex = Math.sin(rad(a)) * 26, ey = tie - Math.cos(rad(a)) * 26
          return (
            <g key={i}>
              <path d={`M${f(a * 0.12)} ${tie} L${f(ex)} ${f(ey)}`} stroke={STRAW_LINE} strokeWidth={4} strokeLinecap="round" />
              <path d={`M${f(a * 0.12)} ${tie} L${f(ex)} ${f(ey)}`} stroke={STRAW} strokeWidth={2.4} strokeLinecap="round" />
            </g>
          )
        })}
        {fan.map((a, i) => <BarleyEar key={i} x={Math.sin(rad(a)) * 26} y={tie - Math.cos(rad(a)) * 26} a={a * 1.2} s={0.82} />)}
      </g>
      <path d={`M-10 ${tie - 5} Q0 ${tie - 1} 10 ${tie - 5} L10 ${tie + 4} Q0 ${tie + 8} -10 ${tie + 4} Z`} fill="#b07a36" stroke="#7a5022" strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  )
}

/** A sickle for cutting barley, held in a hand at (x, y) (figure units): a wooden handle and a curved iron blade. */
export const Sickle = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-1 6 L2 -12" stroke="#7a5233" strokeWidth={5} strokeLinecap="round" />
    <path d="M1.5 -11 C10 -16 24 -18 26 -36 C28 -24 20 -10 2 -6 Z" fill="#cfd4dc" stroke="#6b7385" strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M6 -11 C14 -14 21 -18 23 -27" stroke="#ffffff" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.8} />
  </g>
)

/** A harvester in the standing barley (draw the barley after, so it hides their legs): sickle up in one hand, a bunch of barley in the other. */
export function Harvester({ x, y, s = 1, i = 0, cheer, blinkDelay = 0, facing = 'right' }: { x: number; y: number; s?: number; i?: number; cheer?: boolean; blinkDelay?: number; facing?: 'left' | 'right' }) {
  const look = HARVESTERS[i % HARVESTERS.length]
  return cheer
    ? <Figure x={x} y={y} s={s} look={look} pose="arms-up" mood="joy" facing={facing} blinkDelay={blinkDelay} />
    : (
      <Figure x={x} y={y} s={s} look={look} pose="wave" facing={facing} blinkDelay={blinkDelay}>
        <Sickle x={42} y={-128} />
        <BarleyBunch x={-30} y={-48} s={0.5} />
        <Grip x={-30} y={-46} skin={look.skin} />
      </Figure>
    )
}

/**
 * Ruth's gleaning basket: round and deep, woven of two colors of reed, with a little handle at each end of the
 * rim. (x, y): the middle of its rim; `w` wide (about half as deep). `k` (0 to 1): how full of barley.
 */
export function GleanBasket({ x, y, w = 60, k = 0 }: { x: number; y: number; w?: number; k?: number }) {
  const c = '#c98a45'
  const id = `gb${gid(useId())}`
  const wick = useShade(c, 0.32, 0.22)
  const line = ink(c)
  const ry = w * 0.15, h = w * 0.5, bw = w * 0.36
  const front = `M${f(x - w / 2)} ${f(y)} A${f(w / 2)} ${f(ry)} 0 0 0 ${f(x + w / 2)} ${f(y)} L${f(x + bw)} ${f(y + h)} Q${f(x)} ${f(y + h + ry * 1.3)} ${f(x - bw)} ${f(y + h)} Z`
  const sw = Math.max(1.2, w * 0.035)
  return (
    <g>
      <defs>{wick.def}<clipPath id={id}><path d={front} /></clipPath></defs>
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M${f(x + d * w * 0.44)} ${f(y - ry * 0.4)} Q${f(x + d * w * 0.62)} ${f(y - ry * 1.4)} ${f(x + d * w * 0.56)} ${f(y + ry * 0.9)}`} stroke={line} strokeWidth={sw * 2.4} fill="none" strokeLinecap="round" />
          <path d={`M${f(x + d * w * 0.44)} ${f(y - ry * 0.4)} Q${f(x + d * w * 0.62)} ${f(y - ry * 1.4)} ${f(x + d * w * 0.56)} ${f(y + ry * 0.9)}`} stroke={lighten(c, 0.15)} strokeWidth={sw * 1.1} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx={x} cy={y} rx={w / 2} ry={ry} fill={darken(c, 0.48)} stroke={line} strokeWidth={sw} />
      {k > 0 && <BarleyHeap x={x} y={y + ry * 0.3} w={w * 0.92} k={k} />}
      <path d={front} fill={wick.fill} stroke={line} strokeWidth={sw * 1.2} strokeLinejoin="round" />
      <g clipPath={`url(#${id})`}>
        {[0.22, 0.5, 0.78].map((t) => (
          <path key={t} d={`M${f(x - w * 0.6)} ${f(y + h * t + ry * 0.2)} Q${f(x)} ${f(y + h * t + ry * 1.8)} ${f(x + w * 0.6)} ${f(y + h * t + ry * 0.2)}`} stroke="#e7b36a" strokeWidth={h * 0.13} fill="none" opacity={0.75} />
        ))}
        {[-0.75, -0.45, -0.15, 0.15, 0.45, 0.75].map((t) => (
          <path key={t} d={`M${f(x + t * w * 0.5)} ${f(y)} L${f(x + t * bw)} ${f(y + h + ry)}`} stroke={darken(c, 0.2)} strokeWidth={sw * 0.8} />
        ))}
      </g>
      <path d={`M${f(x - w / 2)} ${f(y)} A${f(w / 2)} ${f(ry)} 0 0 0 ${f(x + w / 2)} ${f(y)}`} stroke={darken(c, 0.06)} strokeWidth={sw * 2.4} fill="none" />
      <path d={`M${f(x - w / 2)} ${f(y)} A${f(w / 2)} ${f(ry)} 0 0 0 ${f(x + w / 2)} ${f(y)}`} stroke={line} strokeWidth={sw * 0.7} fill="none" />
    </g>
  )
}

/** A big clay water jar with two handles (the workers' water): (x, y) its foot; about 70 tall at s = 1. A little cup leans on it. */
export function WaterJar({ x, y, s = 1, cup = true }: { x: number; y: number; s?: number; cup?: boolean }) {
  const c = '#d58a5a'
  const clay = useShade(c, 0.3, 0.2)
  const line = ink(c)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{clay.def}</defs>
      <ellipse cx={0} cy={-1} rx={26} ry={4} fill="#000" opacity={0.12} />
      {[-1, 1].map((d) => <path key={d} d={`M${d * 10} -58 Q${d * 30} -60 ${d * 20} -40`} stroke={line} strokeWidth={4.5} fill="none" strokeLinecap="round" />)}
      <path d="M-11 -64 L11 -64 L10 -56 Q26 -46 25 -26 Q23 -4 0 -2 Q-23 -4 -25 -26 Q-26 -46 -10 -56 Z" fill={clay.fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
      <ellipse cx={0} cy={-64} rx={12} ry={3.6} fill="#3d6f9a" stroke={line} strokeWidth={2} />
      <path d="M-5 -64.6 Q0 -66 5 -64.6" stroke="#bfe6ff" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M-22 -32 Q0 -24 22 -32" stroke={lighten(c, 0.35)} strokeWidth={2.4} fill="none" />
      <ellipse cx={-12} cy={-40} rx={3.5} ry={8} fill="#fff" opacity={0.3} />
      {cup && (
        <g transform="translate(30 -1)">
          <path d="M-8 -14 L8 -14 L6 0 L-6 0 Z" fill="#c9784a" stroke={ink('#c9784a')} strokeWidth={1.8} strokeLinejoin="round" />
          <ellipse cx={0} cy={-14} rx={8} ry={2.4} fill="#7fc4ec" stroke={ink('#c9784a')} strokeWidth={1.4} />
        </g>
      )}
    </g>
  )
}

/**
 * Where a basket `w` wide sits on someone's head (figure units): its rim's middle (its bottom resting on the top of
 * the head), and where their two hands steady it, low on its sides.
 */
export function headBasket(w: number) {
  const rim = -136 - 0.575 * w
  return { rim, hands: [[-0.388 * w, rim + 0.4 * w], [0.388 * w, rim + 0.4 * w]] as [Pt, Pt] }
}

/**
 * Ruth carrying her gleaning basket on her head, both hands up steadying it, the barley heaped up in it (`k`, 0 to 1).
 * (x, y): her feet; `w`: the basket's width in her own units. `children` go in her own units (EyesUp, a face).
 */
export function RuthWithBasket({ x, y, s = 1, w = 80, k = 1, blinkDelay = 0.9, children }: { x: number; y: number; s?: number; w?: number; k?: number; blinkDelay?: number; children?: ReactNode }) {
  const { rim, hands: [l, r] } = headBasket(w)
  return (
    <Ruth x={x} y={y} s={s} pose="arms-up" reach={[l, r]} blinkDelay={blinkDelay}>
      {children}
      <GleanBasket x={0} y={rim} w={w} k={k} />
      <Grip x={l[0]} y={l[1]} skin={RUTH.skin} />
      <Grip x={r[0]} y={r[1]} skin={RUTH.skin} />
    </Ruth>
  )
}

/** A big cloth bundle carried on the back, in a Person's units: draw it just before them, so it peeks out over their left shoulder. */
const BackBundle = ({ color = '#e3cfa4' }: { color?: string }) => (
  <g>
    <path d="M-20 -128 Q-50 -122 -52 -98 Q-52 -72 -30 -66 Q-8 -66 -6 -92 Q-6 -120 -20 -128 Z" fill={color} stroke={ink(color)} strokeWidth={2.4} strokeLinejoin="round" />
    <path d="M-50 -94 Q-30 -86 -8 -94" stroke="#c0504d" strokeWidth={3} fill="none" />
    <path d="M-48 -86 Q-30 -78 -9 -86" stroke="#3f7fd0" strokeWidth={1.8} fill="none" />
  </g>
)

// ---------- The land ----------

/** A smooth curve through the points (Catmull-Rom), as path commands starting with M. */
function smooth(points: Pt[]): string {
  let d = `M${f(points[0][0])} ${f(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

/** A dusty road through the points [x, y, half its width] (narrow far away, wide up close). */
export function Road({ pts, color = '#ecd9ad', edge = '#d2b783' }: { pts: [number, number, number][]; color?: string; edge?: string }) {
  const n = pts.length
  const nrm = (i: number): Pt => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1
    return [-dy / len, dx / len]
  }
  const side = (sg: number) => pts.map(([x, y, w], i): Pt => { const [nx, ny] = nrm(i); return [x + nx * w * sg, y + ny * w * sg] })
  const d = `${smooth(side(1))} ${smooth(side(-1).reverse()).replace(/^M/, 'L')} Z`
  return (
    <g>
      <path d={d} fill={color} stroke={edge} strokeWidth={3} strokeLinejoin="round" />
      <path d={smooth(pts.map(([x, y]) => [x, y]))} stroke={lighten(color, 0.4)} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} strokeDasharray="22 16" />
    </g>
  )
}

/** Moab far away: its long flat-topped hills (a high, wide land), from x0 to x1, their feet at y. */
function MoabFar({ x0 = -10, x1 = 810, y, color = '#b3a7d2' }: { x0?: number; x1?: number; y: number; color?: string }) {
  const w = x1 - x0
  // the high land far away: long, gently rolling tops, with a lower ridge in front of them
  const back = ([[0, 4], [0.05, 30], [0.12, 40], [0.2, 37], [0.28, 44], [0.36, 40], [0.44, 33], [0.52, 38], [0.6, 44], [0.68, 39], [0.76, 42], [0.84, 35], [0.92, 26], [1, 8]] as const)
    .map(([t, h]): Pt => [x0 + w * t, y - h])
  const front = ([[0, 2], [0.1, 16], [0.22, 12], [0.34, 20], [0.46, 13], [0.58, 18], [0.7, 11], [0.82, 17], [0.94, 10], [1, 4]] as const)
    .map(([t, h]): Pt => [x0 + w * t, y - h])
  return (
    <g>
      <path d={`${smooth(back)} L${x1} ${y + 4} L${x0} ${y + 4} Z`} fill={color} />
      <path d={smooth(back.slice(1, -1).map(([px, py]): Pt => [px, py + 3]))} stroke={lighten(color, 0.35)} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d={`${smooth(front)} L${x1} ${y + 4} L${x0} ${y + 4} Z`} fill={darken(color, 0.08)} />
    </g>
  )
}

/** Soft rolling hills along y (their tops about `h` above it), in one color, from x0 to x1. */
function Hills({ y, h = 30, color, x0 = -10, x1 = 810, n = 4, phase = 0 }: { y: number; h?: number; color: string; x0?: number; x1?: number; n?: number; phase?: number }) {
  const w = (x1 - x0) / n
  const tops = Array.from({ length: n }, (_, i) => `Q${f(x0 + w * (i + 0.5))} ${f(y - h * (1.6 + 0.5 * Math.sin(i * 2.1 + phase)))} ${f(x0 + w * (i + 1))} ${f(y - h * (0.3 + 0.3 * Math.cos(i * 1.7 + phase)))}`).join(' ')
  return <path d={`M${x0} ${y} ${tops} L${x1} 460 L${x0} 460 Z`} fill={color} />
}

/** A little tuft of dried-up plants, brown and drooping (nothing grows in a dry year): (x, y) its foot. */
const Wilted = ({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* stems bending over, each with a thin, empty head hanging down */}
    <path d="M0 0 Q1 -18 9 -24 Q14 -26 16 -20 M-3 0 Q-6 -14 -13 -18 Q-17 -19 -18 -14 M2 0 Q5 -10 12 -11" stroke="#a8875a" strokeWidth={2} />
    <path d="M16 -20 Q17 -15 15 -11 M-18 -14 Q-18 -10 -16 -7" stroke="#8f7048" strokeWidth={3} />
    {/* a dry leaf lying on the ground */}
    <path d="M-2 0 Q-12 -2 -16 2 Q-8 3 -2 0 Z" fill="#c2a06c" stroke="#9a7a4e" strokeWidth={1.2} />
  </g>
)

/** Dry, cracked ground (a patch from x0 to x1, y0 to y1). */
function Cracks({ x0, x1, y0, y1, seed = 9 }: { x0: number; x1: number; y0: number; y1: number; seed?: number }) {
  const rnd = seeded(seed)
  let d = ''
  for (let i = 0; i < 14; i++) {
    const cx = x0 + rnd() * (x1 - x0), cy = y0 + rnd() * (y1 - y0)
    d += `M${f(cx)} ${f(cy)} l${f(8 + rnd() * 8)} ${f(-2 + rnd() * 4)} l${f(6 + rnd() * 6)} ${f(3 + rnd() * 3)} M${f(cx + 9)} ${f(cy + 1)} l${f(-2 + rnd() * 3)} ${f(6 + rnd() * 4)} `
  }
  return <path d={d} stroke="#a8875a" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
}

/**
 * A stone house in Bethlehem, up close: pale stone blocks, a flat roof with a low wall round it, a wooden door in an
 * arched doorway and a little window. (x, y): the middle of its foot; `w` wide, `h` tall. `open`: the door stands open
 * with warm lamplight inside; `lit`: the window glows (evening).
 */
export function StoneHouse({ x, y, w = 240, h = 170, door = 0.1, open, lit, children }: {
  x: number; y: number; w?: number; h?: number; door?: number; open?: boolean; lit?: boolean; children?: ReactNode
}) {
  const stone = '#efe1c2', line = '#b89a6a'
  const dx = x + door * w
  const dw = Math.min(80, w * 0.2), dh = h * 0.62
  const blocks: string[] = []
  for (let r = 0; r < Math.floor(h / 22); r++) {
    const by = y - 14 - r * 22
    for (let i = 0; i < Math.ceil(w / 44) + 1; i++) {
      const bx = x - w / 2 + ((r % 2) * 22 + i * 44)
      if (bx > x - w / 2 + 6 && bx < x + w / 2 - 6 && !(Math.abs(bx - dx) < dw / 2 + 6 && by > y - dh - 10)) blocks.push(`M${f(bx)} ${f(by - 9)} l0 18`)
    }
    blocks.push(`M${f(x - w / 2 + 4)} ${f(by + 9)} L${f(x + w / 2 - 4)} ${f(by + 9)}`)
  }
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={stone} stroke={line} strokeWidth={3} />
      <path d={blocks.join(' ')} stroke="#d9c49c" strokeWidth={2} fill="none" />
      {/* the roof: beams' ends, and a low wall round its edge */}
      <rect x={x - w / 2 - 8} y={y - h - 18} width={w + 16} height={20} rx={3} fill="#e3d0a8" stroke={line} strokeWidth={3} />
      {Array.from({ length: Math.floor(w / 30) }, (_, i) => <circle key={i} cx={x - w / 2 + 16 + i * 30} cy={y - h + 8} r={4} fill="#8a6040" />)}
      {/* the doorway */}
      <path d={`M${f(dx - dw / 2 - 6)} ${y} L${f(dx - dw / 2 - 6)} ${f(y - dh + 8)} Q${f(dx)} ${f(y - dh - 22)} ${f(dx + dw / 2 + 6)} ${f(y - dh + 8)} L${f(dx + dw / 2 + 6)} ${y} Z`} fill="#d8c299" stroke={line} strokeWidth={3} />
      <path d={`M${f(dx - dw / 2)} ${y} L${f(dx - dw / 2)} ${f(y - dh + 10)} Q${f(dx)} ${f(y - dh - 12)} ${f(dx + dw / 2)} ${f(y - dh + 10)} L${f(dx + dw / 2)} ${y} Z`} fill={open ? '#ffd98a' : '#7a5233'} stroke="#5a3a20" strokeWidth={2.5} />
      {open && <path d={`M${f(dx - dw / 2)} ${y} L${f(dx - dw / 2)} ${f(y - dh + 10)} L${f(dx - dw / 2 - 14)} ${f(y - dh + 2)} L${f(dx - dw / 2 - 14)} ${f(y + 4)} Z`} fill="#8a5a33" stroke="#5a3a20" strokeWidth={2.5} strokeLinejoin="round" />}
      {!open && <path d={`M${f(dx - dw / 4)} ${f(y - dh + 4)} L${f(dx - dw / 4)} ${y} M${f(dx + dw / 4)} ${f(y - dh + 4)} L${f(dx + dw / 4)} ${y}`} stroke="#5a3a20" strokeWidth={2} />}
      {/* a little window */}
      {(() => {
        const wx = dx + (door > 0 ? -w * 0.32 : w * 0.32)
        return (
          <g>
            {lit && <circle cx={wx} cy={y - h * 0.62} r={30} fill="#ffd970" opacity={0.25} />}
            <rect x={wx - 15} y={y - h * 0.62 - 15} width={30} height={30} rx={4} fill={lit ? '#ffd970' : '#6b4a32'} stroke={line} strokeWidth={3} />
            <path d={`M${wx} ${y - h * 0.62 - 15} L${wx} ${y - h * 0.62 + 15}`} stroke={lit ? '#e0a83a' : '#4a3020'} strokeWidth={2.5} />
          </g>
        )
      })()}
      {children}
    </g>
  )
}

/** Bethlehem's town gate: a stone arch in the town wall, with houses peeking over it. (x, y): the middle of the arch's foot. */
function TownGate({ x, y }: { x: number; y: number }) {
  const stone = '#efe1c2', line = '#b89a6a'
  return (
    <g>
      {([[x - 300, 150, 58], [x - 190, 120, 70], [x + 170, 140, 64], [x + 290, 110, 54]] as const).map(([hx, w, hh]) => (
        <g key={hx}>
          <rect x={hx - w / 2} y={y - 150 - hh} width={w} height={hh + 10} fill="#f3e7cc" stroke={line} strokeWidth={2.5} />
          <rect x={hx - w / 2 - 5} y={y - 156 - hh} width={w + 10} height={10} rx={2} fill="#e3d0a8" stroke={line} strokeWidth={2.5} />
          <rect x={hx - 10} y={y - 140 - hh * 0.6} width={20} height={18} rx={3} fill="#6b4a32" />
        </g>
      ))}
      {/* the wall */}
      <rect x={-10} y={y - 150} width={820} height={150} fill={stone} stroke={line} strokeWidth={3} />
      <path d={Array.from({ length: 6 }, (_, r) => `M-10 ${y - 150 + 25 * (r + 1)} L810 ${y - 150 + 25 * (r + 1)}`).join(' ')} stroke="#dccaa2" strokeWidth={2} />
      <path d={Array.from({ length: 6 }, (_, r) => Array.from({ length: 20 }, (_, i) => `M${-10 + (r % 2) * 22 + i * 44} ${y - 150 + 25 * r} l0 25`).join(' ')).join(' ')} stroke="#dccaa2" strokeWidth={2} />
      {/* the gate's tall arch, and its towers */}
      {[-1, 1].map((d) => <rect key={d} x={x + d * 92 - 36} y={y - 196} width={72} height={196} fill="#ead9b4" stroke={line} strokeWidth={3} />)}
      {[-1, 1].map((d) => <rect key={`t${d}`} x={x + d * 92 - 42} y={y - 206} width={84} height={14} rx={3} fill="#e0caa0" stroke={line} strokeWidth={3} />)}
      <path d={`M${x - 70} ${y} L${x - 70} ${y - 110} Q${x} ${y - 190} ${x + 70} ${y - 110} L${x + 70} ${y} Z`} fill="#ead9b4" stroke={line} strokeWidth={3} />
      <path d={`M${x - 56} ${y} L${x - 56} ${y - 104} Q${x} ${y - 168} ${x + 56} ${y - 104} L${x + 56} ${y} Z`} fill="#bfe6ff" stroke={line} strokeWidth={3} />
      {/* through the gate: the fields outside */}
      <path d={`M${x - 56} ${y - 40} Q${x} ${y - 52} ${x + 56} ${y - 44} L${x + 56} ${y} L${x - 56} ${y} Z`} fill="#eccb62" />
    </g>
  )
}

/** A garland of leaves and flowers hung in a swag from (x0, y0) to (x1, y1), sagging `sag` in the middle. */
function Garland({ x0, y0, x1, y1, sag = 40 }: { x0: number; y0: number; x1: number; y1: number; sag?: number }) {
  const at = (t: number): Pt => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)]
  return (
    <g>
      <path d={`M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag * 2} ${x1} ${y1}`} stroke="#5fae5a" strokeWidth={6} fill="none" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const [gx, gy] = at((i + 0.5) / 9)
        return <Flower key={i} x={gx} y={gy + 18} s={0.8} color={['#ff8cc0', '#ffd34d', '#ffffff'][i % 3]} />
      })}
    </g>
  )
}

/** A ring of little flowers worn on the head (a bride's), in a Person's own units. */
const FlowerCrown = () => (
  <g>
    {([[-22, -122], [-14, -132], [-4, -138], [7, -137], [16, -131], [23, -121]] as const).map(([cx, cy], i) => (
      <g key={i} transform={`translate(${cx} ${cy})`}>
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-3.4} rx={2.4} ry={3.6} fill={['#ffffff', '#ffd34d', '#ffb3d1'][i % 3]} transform={`rotate(${a})`} />)}
        <circle r={1.8} fill="#f2a33c" />
      </g>
    ))}
  </g>
)

/** A little green grasshopper on the ground (just like Hopper, who gobbles up grain): (x, y) its feet, facing right. */
function Grasshopper({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const g = '#7cc04a', line = '#3f7a2a'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      {/* the big back leg folded up like a Z, then the front legs */}
      <path d="M-10 -9 L-4 -22 L-16 -2" stroke={line} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-10 -9 L-4 -22 L-16 -2" stroke={g} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 -7 L2 0 M10 -7 L12 0" stroke={line} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M-20 -9 Q-14 -17 2 -15 Q14 -14 15 -8 Q12 -3 0 -4 Q-14 -3 -20 -9 Z" fill={g} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M-16 -11 Q-6 -15 6 -13" stroke="#5aa03a" strokeWidth={1.3} fill="none" />
      <circle cx={14} cy={-12} r={5.5} fill={g} stroke={line} strokeWidth={1.6} />
      <circle cx={16} cy={-13} r={1.7} fill="#2b2140" />
      <path d="M14 -17 Q20 -30 30 -32 M12 -17 Q14 -30 22 -36" stroke={line} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </g>
  )
}

// ---------- The pages ----------

// 1. "Long ago, a woman named Naomi lived in Bethlehem with her husband and their two boys. One year, there was
// no food in Bethlehem. So they moved far away, to a land called Moab."
// Bethlehem on its hill behind, its fields dry and bare; the family sets off down the road with their bundles,
// toward the green hills of Moab far away on the right.
const Page1 = () => {
  const ground = `rt1g${gid(useId())}`
  return (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={330} y={70} s={0.6} slow />
    <Sun x={470} y={84} s={0.72} />
    {/* Moab far away, green */}
    <MoabFar x0={430} y={252} />
    <Hills y={276} h={14} color="#9fd07e" x0={420} n={3} phase={1} />
    <Hills y={286} h={18} color="#d9c493" x1={520} n={3} />
    <Tap say="The fields are all dry. Nothing is growing." sfx="wobble">
      <Bethlehem x={170} y={300} s={0.72} fields="dry" />
    </Tap>
    {/* the land: dry and dusty here, greener toward Moab */}
    <path d="M-10 296 Q200 284 420 292 Q600 282 810 290 L810 460 L-10 460 Z" fill={`url(#${ground})`} />
    <defs>
      <linearGradient id={ground} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#dcc48e" /><stop offset="0.45" stopColor="#d6c690" /><stop offset="1" stopColor="#a9d58a" />
      </linearGradient>
    </defs>
    <Road pts={[[226, 300, 6], [272, 322, 14], [330, 350, 26], [420, 384, 42], [560, 412, 58], [700, 424, 66], [860, 430, 70]]} />
    <Cracks x0={20} x1={200} y0={350} y1={440} />
    {[[40, 372], [84, 392, true], [128, 366], [170, 410, true], [30, 430], [210, 440]].map(([wx, wy, fl], i) => <Wilted key={i} x={wx as number} y={wy as number} s={1.1} flip={!!fl} />)}
    {[[640, 330], [720, 352], [770, 318]].map(([fx, fy]) => <Flower key={fx} x={fx} y={fy} s={0.8} color="#ffd34d" />)}
    <Tap say="Moab, here we come!" sfx="pop">
      <Person x={290} y={410} s={0.92} look={CHILION_BOY} blinkDelay={1.4} />
      <Person x={470} y={424} s={0.94} look={MAHLON_BOY} pose="wave" blinkDelay={0.6} />
    </Tap>
    <Tap say="Goodbye, Bethlehem. We will miss you!" sfx="pop">
      <Naomi x={380} y={418} s={0.94} blinkDelay={0.3}><TravelBundle skin={NAOMI.skin} /></Naomi>
    </Tap>
    <Tap say="Come along! We are going to the land of Moab." sfx="ding">
      {/* (the bundle on his back goes behind him, so it peeks out over his shoulder) */}
      <g transform="translate(590 430) scale(0.98)"><BackBundle /></g>
      <Person x={590} y={430} s={0.98} look={ELIMELECH} holding="stick" blinkDelay={2.1} />
    </Tap>
  </Scene>
  )
}

// 2. "In Moab, the boys grew up. They married two kind women named Ruth and Orpah. Naomi loved Ruth and Orpah,
// and they loved her, too."
// Home in green Moab: Naomi in the middle with an arm round Ruth and Orpah, her grown-up sons beside their wives,
// hearts all round. (Naomi's husband had died by then, Ruth 1:3, so he isn't here.)
const Page2 = () => {
  const y = 432, s = 0.96
  const nx = 400, rx = 328, ox = 472
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={160} y={70} s={0.7} />
      <Cloud x={600} y={56} s={0.55} slow />
      <Birds spots={[[300, 120, 1], [330, 108, 0.8], [470, 96, 0.9]]} />
      <MoabFar y={236} />
      <Hills y={276} h={22} color="#b6dd92" n={4} />
      <path d="M-10 306 Q220 290 430 304 T810 296 L810 460 L-10 460 Z" fill="#9fd07e" />
      <path d="M-10 380 Q240 362 480 382 T810 372 L810 460 L-10 460 Z" fill="#8cc66e" />
      <OliveTree x={736} y={330} s={1.5} flip />
      <MudHouse x={96} y={330} w={130} h={80} door={0.18} win={-0.22} />
      <Sheep x={560} y={298} s={0.42} />
      <Sheep x={618} y={302} s={0.38} facing="left" />
      {[[180, 404, '#ff8cc0'], [610, 410, '#ffd34d'], [740, 420, '#ffffff'], [60, 428, '#ffd34d']].map(([fx, fy, c]) => <Flower key={fx} x={fx as number} y={fy as number} color={c as string} />)}
      <Tap say="We are Naomi's boys, all grown up!" sfx="pop">
        <Person x={226} y={y + 2} s={s} look={MAHLON} pose="wave" blinkDelay={0.8} />
        <Person x={574} y={y + 2} s={s} look={CHILION} pose="wave" facing="left" blinkDelay={1.7} />
      </Tap>
      <Tap say="I love you both so much!" sfx="pop">
        <Naomi x={nx} y={y} s={s} pose="hug" mood="joy" reach={[reach(nx, y, s, rx - 19, y - 84 * s), reach(nx, y, s, ox + 19, y - 84 * s)]} />
      </Tap>
      <Tap say="Hello! My name is Ruth." sfx="pop">
        <Ruth x={rx} y={y} s={s} pose="hug-right" reach={[null, reach(rx, y, s, nx - 24, y - 60 * s)]} blinkDelay={0.4} />
      </Tap>
      <Tap say="And my name is Orpah!" sfx="pop">
        <Orpah x={ox} y={y} s={s} pose="hug-right" facing="left" reach={[null, reach(ox, y, s, nx + 24, y - 60 * s, 'left')]} blinkDelay={1.1} />
      </Tap>
      <HandOn x={rx - 19} y={y - 84 * s} s={s} look={NAOMI} />
      <HandOn x={ox + 19} y={y - 84 * s} s={s} look={NAOMI} />
      <Heart x={400} y={196} s={1.2} />
      <Heart x={300} y={230} s={0.8} d={0.6} />
      <Heart x={506} y={224} s={0.85} d={1.2} />
    </Scene>
  )
}

/** God's care far away: the golden barley fields of Bethlehem in a soft glow, on the horizon (x, y). */
function FarGoldenHills({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={0} y={-30} r={150} color="#fff1b8" />
      <Rays x={0} y={-30} r={220} n={14} color="#fff3c4" opacity={0.42} />
      <path d="M-170 10 Q-110 -42 -40 -36 Q10 -64 70 -38 Q130 -40 170 10 Z" fill="#efcc66" stroke="#d2a845" strokeWidth={2} />
      <path d="M-130 -8 Q-60 -26 0 -18 Q70 -30 130 -8" stroke="#d9b04e" strokeWidth={3} fill="none" opacity={0.8} />
      <Bethlehem x={0} y={-30} s={0.32} />
    </g>
  )
}

// 3. "Then Naomi's husband and her two sons died, and she was very sad. One day, Naomi heard good news. God had
// given His people food in Bethlehem again! 'I will go home,' she said."
// Early morning in Moab: Naomi, sad, with Ruth and Orpah close beside her, each with a hand on her shoulder. A
// traveler comes up the road with a sack of grain and the good news; far away, Bethlehem's fields shine golden.
const Page3 = () => {
  const y = 434, s = 1
  const nx = 330, rx = 266, ox = 394
  // Ruth and Orpah stand close on either side, each with an arm round Naomi's back and a hand on her far shoulder.
  const lHand: Pt = [nx + 19, y - 84], rHand: Pt = [nx - 19, y - 84]
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      <Cloud x={140} y={66} s={0.6} slow />
      <MoabFar y={262} color="#c4a8c8" x1={420} />
      <Tap say="Golden barley is growing in Bethlehem again!" sfx="sparkle">
        <FarGoldenHills x={660} y={262} s={0.9} />
      </Tap>
      <Hills y={300} h={16} color="#b9cf8e" n={4} phase={2} />
      <path d="M-10 330 Q240 316 480 330 T810 322 L810 460 L-10 460 Z" fill="#a8c97e" />
      <Road pts={[[640, 300, 6], [600, 330, 16], [610, 370, 30], [680, 410, 46], [760, 450, 60], [800, 480, 66]]} />
      <MudHouse x={90} y={346} w={130} h={80} door={0.2} win={-0.2} />
      <OliveTree x={186} y={340} s={1} />
      <Tap say="Good news! God has given His people food in Bethlehem again!" sfx="ding">
        <Figure x={640} y={420} s={0.9} look={HARVESTERS[2]} pose="carry" holding="sack" blinkDelay={0.9} />
      </Tap>
      <Tap say="We are right here with you, Naomi." sfx="pop">
        <Ruth x={rx} y={y + 2} s={s} pose="hug-right" reach={[null, reach(rx, y + 2, s, lHand[0], lHand[1])]} blinkDelay={1.2} />
        <Orpah x={ox} y={y + 2} s={s} pose="hug-right" facing="left" reach={[null, reach(ox, y + 2, s, rHand[0], rHand[1], 'left')]} blinkDelay={0.2} />
      </Tap>
      <Tap say="I will go home to Bethlehem." sfx="pop">
        <Naomi x={nx} y={y} s={s} mood="sad" pose="pray" blinkDelay={0.5} />
      </Tap>
      <HandOn x={lHand[0]} y={lHand[1]} look={RUTH} />
      <HandOn x={rHand[0]} y={rHand[1]} look={ORPAH} />
    </Scene>
  )
}

// 4. "So Naomi set off for home, and Ruth and Orpah went with her. On the way, Naomi said, 'Go back home to your
// mothers, my dears.' Orpah kissed Naomi goodbye, and she went back home."
// On the road out of Moab: Orpah heads back toward home (the little house on the hill behind her), turning to
// blow a goodbye kiss; Naomi waves her off, and Ruth holds on to Naomi's arm.
const Page4 = () => {
  const y = 432, s = 0.98
  const nx = 470, rx = 560
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={520} y={62} s={0.7} />
      <Cloud x={160} y={84} s={0.5} slow />
      <Birds spots={[[380, 130, 1], [410, 118, 0.8]]} />
      <MoabFar y={250} x1={480} />
      <Hills y={288} h={20} color="#c2d895" n={4} phase={0.6} />
      <OliveTree x={706} y={300} s={1.3} />
      <MudHouse x={110} y={292} w={64} h={40} door={0.15} win={-0.25} />
      <path d="M-10 318 Q220 304 430 316 T810 312 L810 460 L-10 460 Z" fill="#cfd69a" />
      <Road pts={[[-40, 330, 16], [80, 336, 22], [220, 360, 34], [380, 394, 48], [560, 420, 60], [740, 412, 56], [860, 396, 50]]} />
      {[[300, 310], [690, 330], [40, 420], [760, 440]].map(([fx, fy]) => <Flower key={fx} x={fx} y={fy} s={0.9} color={fx % 3 ? '#ff8cc0' : '#ffd34d'} />)}
      <Tap say="Goodbye, Naomi! I love you." sfx="pop">
        <Orpah x={200} y={392} s={0.9} pose="wave" facing="left" blinkDelay={0.7}><TravelBundle skin={ORPAH.skin} /></Orpah>
        <Heart x={262} y={262} s={0.7} />
        <Heart x={306} y={236} s={0.5} d={0.8} />
      </Tap>
      <Tap say="Go home, my dear. God bless you, Orpah!" sfx="pop">
        <Naomi x={nx} y={y} s={s} pose="wave" facing="left" blinkDelay={0.3}><TravelBundle skin={NAOMI.skin} /></Naomi>
      </Tap>
      <Tap say="Bye-bye, Orpah!" sfx="pop">
        <Ruth x={rx} y={y + 2} s={s} pose="hug-right" facing="left" reach={[null, reach(rx, y + 2, s, nx + 22, y - 70 * s, 'left')]} blinkDelay={1.3}>
          <TravelBundle skin={RUTH.skin} />
        </Ruth>
      </Tap>
    </Scene>
  )
}

// 5. "But Ruth hugged Naomi tight. 'Where you go, I will go,' said Ruth. 'Your people will be my people, and your God
// will be my God.'"
// Up close on the road, in a warm glow: Ruth hugs Naomi tight, her arm round Naomi's shoulders, and Naomi cries happy
// tears. Hearts float up; the road runs on to Bethlehem, far away on its hill.
/** (px, py) turned `a` degrees round (cx, cy). */
const turn = ([px, py]: Pt, [cx, cy]: Pt, a: number): Pt => {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a))
  return [cx + (px - cx) * c - (py - cy) * s, cy + (px - cx) * s + (py - cy) * c]
}

const Page5 = () => {
  const y = 446, s = 1.34
  const rx = 352, nx = 446
  const lean = 6 // (they lean in to each other, cheek to cheek)
  // Ruth's hand on Naomi's far shoulder (it leans with Naomi), and Naomi's hand at Ruth's waist (it leans with Ruth).
  const hand = turn([nx + 20 * s, y - 86 * s], [nx, y], -lean)
  const ruthHand = turn(hand, [rx, y], -lean)
  const waist = turn([rx + 24 * s, y - 50 * s], [rx, y], lean)
  const naomiHand = turn(waist, [nx, y], lean)
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      <Glow x={400} y={250} r={300} color="#fff3c8" />
      <Rays x={400} y={250} r={480} n={16} color="#fff6d0" opacity={0.36} />
      <Cloud x={130} y={70} s={0.6} slow />
      <Tap say="Bethlehem is far away. We will go there together!" sfx="whoosh">
        <Bethlehem x={690} y={286} s={0.4} fields="gold" />
      </Tap>
      <Hills y={300} h={16} color="#cbd99c" n={4} phase={1.4} />
      <path d="M-10 322 Q220 310 430 320 T810 314 L810 460 L-10 460 Z" fill="#d3d89e" />
      <Road pts={[[690, 300, 4], [640, 316, 10], [560, 340, 22], [470, 380, 40], [380, 430, 62], [320, 480, 80]]} />
      <Tap say="Where you go, I will go!" sfx="pop">
        <g transform={`rotate(${lean} ${rx} ${y})`}>
          <Ruth x={rx} y={y} s={s} pose="hug-right" reach={[null, reach(rx, y, s, ruthHand[0], ruthHand[1])]} blinkDelay={0.6} />
        </g>
      </Tap>
      <Tap say="Oh, Ruth! Thank you, my dear." sfx="pop">
        <g transform={`rotate(${-lean} ${nx} ${y})`}>
          <Naomi x={nx} y={y} s={s} pose="hug-right" facing="left" mood="teary" reach={[null, reach(nx, y, s, naomiHand[0], naomiHand[1], 'left')]} />
        </g>
      </Tap>
      <HandOn x={hand[0]} y={hand[1]} s={s} look={RUTH} />
      <Tap say="Ruth loves Naomi, and Naomi loves Ruth." sfx="sparkle">
        <Heart x={398} y={150} s={1.5} />
        <Heart x={276} y={196} s={0.9} d={0.5} />
        <Heart x={526} y={186} s={1} d={1.1} />
        <Heart x={210} y={120} s={0.6} d={1.6} />
        <Heart x={590} y={112} s={0.65} d={0.9} />
      </Tap>
      <Sparkles spots={[[330, 110, 7], [470, 96, 6], [160, 236, 6], [640, 230, 6]]} />
    </Scene>
  )
}

// 6. "Ruth and Naomi walked together, all the way to Bethlehem. When they got there, the barley in the fields was
// golden and ready to harvest!"
// Bethlehem on its hill, with golden barley on every terrace and harvesters at work; Ruth and Naomi come up the road
// together, arm in arm, with their bundles. Ripe barley stands at the roadside.
const Page6 = () => {
  const y = 430, s = 0.96
  const nx = 214, rx = 300
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={130} y={70} s={0.7} />
      <Cloud x={420} y={54} s={0.5} slow />
      <Sun x={700} y={78} s={0.66} />
      <Hills y={256} h={16} color="#c9d79a" n={4} phase={2.5} />
      <Tap say="Home at last! This is Bethlehem." sfx="ding">
        <Bethlehem x={540} y={308} s={1.18} fields="gold">
          {([[100, -12], [-20, -10], [52, -12], [-56, -40], [30, -42]] as const).map(([hx, hy], i) => (
            <Figure key={i} x={hx} y={hy} s={0.13} look={HARVESTERS[i]} pose="wave" />
          ))}
        </Bethlehem>
        {/* the road on up the hill to the houses */}
        <Road pts={[[530, 228, 3], [506, 244, 4], [474, 266, 5], [448, 288, 6], [436, 304, 7]]} />
      </Tap>
      <path d="M-10 300 Q180 292 360 302 Q600 290 810 300 L810 460 L-10 460 Z" fill="#dccf8e" />
      <Tap say="The barley is golden and ready to harvest!" sfx="sparkle">
        <BarleyField x0={-10} x1={420} y={310} depth={50} k={0.55} seed={4} />
        <BarleyField x0={600} x1={810} y={318} depth={60} k={0.6} seed={8} />
      </Tap>
      <Road pts={[[436, 300, 7], [428, 322, 14], [380, 350, 26], [300, 380, 40], [220, 420, 56], [140, 470, 70]]} />
      <BarleyField x0={530} x1={810} y={392} depth={70} k={0.95} seed={12} />
      <BarleyField x0={-10} x1={70} y={404} depth={60} k={0.95} seed={13} />
      <Tap say="We walked all the way here, together." sfx="pop">
        <Naomi x={nx} y={y} s={s} holding="stick" blinkDelay={0.4}><TravelBundle skin={NAOMI.skin} /></Naomi>
        <Ruth x={rx} y={y + 2} s={s} pose="hug-right" facing="left" reach={[null, reach(rx, y + 2, s, nx + 24, y - 66 * s, 'left')]} blinkDelay={1}>
          <TravelBundle skin={RUTH.skin} />
        </Ruth>
      </Tap>
    </Scene>
  )
}

// ---------- Part two ----------

/** The far side of Boaz's field: hills, and Bethlehem small on its hill (top right). */
function FieldBehind({ town = true }: { town?: boolean }) {
  return (
    <g>
      <Hills y={250} h={16} color="#c9d79a" n={4} phase={0.8} />
      {town && <Bethlehem x={660} y={254} s={0.56} fields="gold" />}
      <path d="M-10 254 Q200 244 420 252 T810 250 L810 460 L-10 460 Z" fill="#cfcf8a" />
    </g>
  )
}

// 7. "Remember Ruth and Naomi? They were home in Bethlehem, but they had no food. So Ruth went to pick up the
// leftover barley in a field. It belonged to a kind man named Boaz."
// A barley field at harvest: harvesters cut the standing barley with their sickles and tie it in sheaves. Behind
// them, Ruth kneels in the stubble picking up the stalks they left behind, with her basket; Boaz comes along the
// path from town, waving hello (Ruth 2:4).
const Page7 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={200} y={64} s={0.65} />
    <Sun x={520} y={80} s={0.62} />
    <FieldBehind />
    <Tap say="God bless you, Boaz! Swish, swish!" sfx="whoosh">
      <Harvester x={360} y={318} s={0.62} i={0} blinkDelay={0.3} />
      <Harvester x={500} y={322} s={0.62} i={1} blinkDelay={1.1} facing="left" />
      <Harvester x={640} y={318} s={0.62} i={2} blinkDelay={0.7} />
      <BarleyField x0={260} x1={810} y={296} depth={42} k={0.6} seed={21} />
    </Tap>
    <Stubble y0={330} y1={460} />
    <path d="M-10 336 Q120 326 250 300 L272 300 Q150 344 -10 360 Z" fill="#e3c98a" />
    <BarleySheaf x={300} y={360} s={0.62} />
    <BarleySheaf x={410} y={366} s={0.64} lean={-6} />
    <BarleySheaf x={720} y={370} s={0.66} lean={5} />
    <Figure x={570} y={380} s={0.7} look={HARVESTERS[3]} pose="hold" blinkDelay={1.6} item={<BarleySheaf x={0} y={-30} s={0.5} />} />
    <Tap say="God be with you, my workers!" sfx="ding">
      <Boaz x={110} y={410} s={0.92} pose="wave" blinkDelay={0.5} />
    </Tap>
    <Tap say="I will pick up the barley that is left. Every little bit helps!" sfx="pop">
      <Kneel x={470} y={432} s={0.98} look={RUTH} pose="stand" blinkDelay={0.9}>
        <DarkHair />
        {/* a bunch gathered in one hand, and a stalk just picked up in the other */}
        <BarleyBunch x={31} y={-50} s={0.5} />
        <Grip x={30} y={-46} skin={RUTH.skin} />
        <g transform="translate(-30 -46) rotate(-38)"><BarleyStalk x={0} y={12} h={40} nod={10} s={0.75} /></g>
        <Grip x={-30} y={-46} skin={RUTH.skin} />
      </Kneel>
      <GleanBasket x={556} y={404} w={62} k={0.25} />
    </Tap>
    {([[250, 430, -60], [330, 444, 70], [620, 438, -75], [690, 428, 65], [390, 420, 80]] as const).map(([sx, sy, a]) => (
      <Tap key={sx} count="stalks" sfx="pop">
        <g transform={`translate(${sx} ${sy}) rotate(${a})`}><BarleyStalk x={0} y={14} h={34} nod={8} s={0.8} /></g>
      </Tap>
    ))}
  </Scene>
)

/** A picnic cloth spread on the ground: (x0..x1, y0..y1), seen from the front. */
function Cloth({ x0, x1, y0, y1, color = '#e8dcc0' }: { x0: number; x1: number; y0: number; y1: number; color?: string }) {
  return (
    <g>
      <path d={`M${x0 + 24} ${y0} L${x1 - 24} ${y0} L${x1} ${y1} L${x0} ${y1} Z`} fill={color} stroke={ink(color)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M${x0 + 16} ${(y0 + y1) / 2} L${x1 - 16} ${(y0 + y1) / 2}`} stroke="#c0504d" strokeWidth={3} strokeDasharray="12 8" />
      <path d={`M${x0 + 8} ${y1 - 7} L${x1 - 8} ${y1 - 7}`} stroke="#3f7fd0" strokeWidth={2.4} strokeDasharray="8 8" />
    </g>
  )
}

/** A big shady tree at the edge of the field (a terebinth): (x, y) its foot. */
function ShadeTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const leaf = useShade('#6fae5a', 0.3, 0.22)
  const line = ink('#6fae5a')
  const C: [number, number, number][] = [[-110, -190, 54], [-40, -232, 64], [44, -236, 62], [112, -186, 54], [-70, -150, 52], [8, -170, 64], [80, -144, 50], [-140, -140, 36], [140, -140, 36]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{leaf.def}</defs>
      <ellipse cx={0} cy={-2} rx={170} ry={14} fill="#000" opacity={0.12} />
      <path d="M-22 0 C-14 -40 -18 -76 -14 -110 L-56 -150 L-42 -158 L-6 -122 L-4 -160 L12 -160 L12 -122 L48 -154 L60 -144 L20 -106 C18 -70 20 -32 26 0 Z" fill="#8a5a33" stroke="#5e3b1f" strokeWidth={3} strokeLinejoin="round" />
      <g className="sc-sway">
        {C.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r + 1.5} fill={line} />)}
        {C.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r - 1.5} fill={leaf.fill} />)}
      </g>
    </g>
  )
}

// 8. "At lunchtime, Boaz shared his bread with Ruth, and cool water, too. Then he told his workers, 'Drop some extra
// barley for her, on purpose!'"
// Lunch in the shade of a big tree at the field's edge: the harvesters sit on a cloth with bread, the water jar
// beside them; Boaz hands Ruth a loaf. Out in the field, two workers with sheaves let stalks fall behind them for
// Ruth, on purpose, with a smile.
const Page8 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={560} y={60} s={0.6} slow />
    <Sun x={700} y={80} s={0.62} />
    <FieldBehind town={false} />
    <BarleyField x0={380} x1={810} y={280} depth={46} k={0.55} seed={31} />
    <Stubble y0={322} y1={460} x0={300} />
    <path d="M-10 322 L310 322 L330 460 L-10 460 Z" fill="#d9cf8e" />
    <Tap say="Oops! We dropped some barley for Ruth, on purpose!" sfx="pop">
      {/* two workers with big sheaves in their arms let stalks slip out and fall beside them, smiling */}
      {([[566, 362, 'right', 4, 0.4], [690, 366, 'left', 3, 1.2]] as const).map(([wx, wy, facing, i, d]) => {
        const k = facing === 'left' ? -1 : 1
        return (
          <g key={wx}>
            <Figure x={wx} y={wy} s={0.68} look={HARVESTERS[i]} pose="hold" mood="joy" facing={facing} blinkDelay={d}
              item={<BarleySheaf x={0} y={-24} s={0.6} />}>
              {HARVESTERS[i].beard === undefined && <DarkHair />}
            </Figure>
            {([[-34, -30, -40], [36, -18, 55]] as const).map(([dx, dy, a], j) => (
              <g key={j} transform={`translate(${wx + k * dx} ${wy + dy}) rotate(${k * a})`}>
                <BarleyStalk x={0} y={10} h={22} nod={6} s={0.6} />
              </g>
            ))}
          </g>
        )
      })}
      {/* and on the ground, left for Ruth */}
      {([[512, 378, -70], [612, 384, 80], [650, 378, -20], [742, 384, 60], [592, 394, 20]] as const).map(([sx, sy, a]) => (
        <g key={sx} transform={`translate(${sx} ${sy}) rotate(${a})`}><BarleyStalk x={0} y={10} h={26} nod={6} s={0.66} /></g>
      ))}
    </Tap>
    <ShadeTree x={190} y={372} s={0.9} />
    <ellipse cx={210} cy={400} rx={210} ry={26} fill="#000" opacity={0.08} />
    <Cloth x0={20} x1={380} y0={386} y1={440} />
    <Tap say="Cool water! Glug, glug, glug." sfx="plop">
      <WaterJar x={60} y={430} s={0.95} />
    </Tap>
    <Sitting x={150} y={436} s={0.86} look={HARVESTERS[1]} holding="bread" blinkDelay={0.8} />
    <Sitting x={250} y={440} s={0.86} look={HARVESTERS[2]} holding="bread" blinkDelay={1.5} />
    <Bread x={200} y={426} s={0.6} />
    <Tap say="Thank you, Boaz! You are so kind to me." sfx="pop">
      <Sitting x={360} y={446} s={0.92} look={RUTH} pose="point" blinkDelay={0.4}><DarkHair /></Sitting>
    </Tap>
    {/* Boaz holds out a loaf, and Ruth's hand takes it (her hand is at (410, 383)) */}
    <Tap say="Come and eat with us, Ruth!" sfx="ding">
      <Boaz x={462} y={438} s={0.98} pose="hug-right" facing="left" reach={[null, reach(462, 438, 0.98, 414, 378, 'left')]} blinkDelay={1}
        item={<Bread x={reach(462, 438, 0.98, 410, 380, 'left')[0]} y={reach(462, 438, 0.98, 410, 380, 'left')[1]} s={0.66} />} />
    </Tap>
  </Scene>
)

// 9. "That evening, Ruth brought home a big basket full of barley! Naomi was so happy. 'God bless kind Boaz!' she
// said. 'God is taking care of us.'"
// Evening in Bethlehem: Naomi at the door of her little stone house, lamplight behind her, holds out her arms with
// joy; Ruth comes up the street holding a big basket heaped with barley. Stars come out over the houses.
const Page9 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Moon x={110} y={80} s={0.7} />
    <Sparkles spots={[[260, 50, 5], [420, 40, 6], [560, 70, 5], [700, 46, 6], [340, 110, 4], [760, 120, 4]]} color="#fff3c0" />
    {/* the houses across the street, their windows lit for the evening */}
    {([[60, 300, 120, 110, 0.2], [190, 296, 110, 130, -0.25], [700, 300, 130, 120, 0.22]] as const).map(([hx, hy, w, h, dd]) => (
      <g key={hx}>
        <rect x={hx - w / 2} y={hy - h} width={w} height={h} fill="#cbbcb0" stroke="#9a8878" strokeWidth={2.5} />
        <rect x={hx - w / 2 - 5} y={hy - h - 8} width={w + 10} height={10} rx={2} fill="#bcaca0" stroke="#9a8878" strokeWidth={2.5} />
        <path d={`M${hx + dd * w - 13} ${hy} L${hx + dd * w - 13} ${hy - 34} Q${hx + dd * w} ${hy - 46} ${hx + dd * w + 13} ${hy - 34} L${hx + dd * w + 13} ${hy} Z`} fill="#6e5a52" stroke="#9a8878" strokeWidth={2} />
        <circle cx={hx - dd * w} cy={hy - h * 0.62} r={20} fill="#ffd970" opacity={0.25} />
        <rect x={hx - dd * w - 12} y={hy - h * 0.62 - 10} width={24} height={20} rx={3} fill="#ffd970" stroke="#9a8878" strokeWidth={2} />
      </g>
    ))}
    <path d="M-10 300 L810 300 L810 460 L-10 460 Z" fill="#cdb894" />
    <path d="M-10 356 Q400 340 810 356" stroke="#bda57e" strokeWidth={3} fill="none" opacity={0.6} />
    <Tap say="Home sweet home." sfx="ding">
      <StoneHouse x={540} y={420} w={330} h={220} door={-0.18} open lit />
    </Tap>
    <Tap say="So much barley! God bless kind Boaz! God is taking care of us." sfx="sparkle">
      <Naomi x={480} y={424} s={1.04} pose="open" mood="joy" blinkDelay={0.4} />
    </Tap>
    <Tap say="Look, Naomi! Kind Boaz let me gather all this barley." sfx="pop">
      <RuthWithBasket x={262} y={436} s={1.04} k={1} />
    </Tap>
    <Heart x={380} y={190} s={0.8} />
    <Heart x={430} y={160} s={0.55} d={0.7} />
  </Scene>
)

// 10. "Boaz loved Ruth, and Ruth loved Boaz. So they got married! Everyone in Bethlehem was happy for them."
// A wedding at Bethlehem's gate, hung with garlands: Ruth, with flowers in her hair, holds hands with Boaz. Naomi
// claps for joy; neighbors cheer and play the tambourine, and the town's old men at the gate smile (Ruth 4:11).
const Page10 = () => {
  const y = 436, s = 1.08
  const rx = 362, bx = 446
  const meet: Pt = [(rx + bx) / 2, y - 62 * s]
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={150} y={60} s={0.6} />
      <Cloud x={640} y={52} s={0.55} slow />
      <TownGate x={404} y={330} />
      <Garland x0={300} y0={140} x1={508} y1={140} sag={18} />
      <path d="M-10 330 L810 330 L810 460 L-10 460 Z" fill="#e6d3a6" />
      <Tap say="May God bless you both!" sfx="pop">
        <Figure x={330} y={330} s={0.6} look={ELDERS[0]} pose="open" blinkDelay={0.6} />
        <Figure x={480} y={330} s={0.6} look={ELDERS[1]} pose="wave" facing="left" blinkDelay={1.4} />
      </Tap>
      <Tap say="My dear Ruth! I am so happy for you." sfx="sparkle">
        <Naomi x={214} y={y} s={1.02} pose="pray" mood="joy" blinkDelay={0.4} />
      </Tap>
      <Tap say="Hooray for Ruth and Boaz!" sfx="good">
        <Figure x={584} y={y} s={0.98} look={NEIGHBORS[0]} pose="arms-up" mood="joy" blinkDelay={0.9}>
          <DarkHair />
          <Tambourine x={48} y={-154} s={1.15} />
        </Figure>
        <Figure x={690} y={y + 4} s={0.94} look={NEIGHBORS[2]} pose="wave" facing="left" blinkDelay={1.6}><DarkHair /></Figure>
        <Figure x={92} y={y + 4} s={0.94} look={NEIGHBORS[1]} pose="arms-up" mood="joy" blinkDelay={1.2}><SilverHair /></Figure>
      </Tap>
      <Tap say="We are married! Thank You, God!" sfx="ding">
        <Ruth x={rx} y={y} s={s} pose="hug-right" reach={[null, reach(rx, y, s, meet[0], meet[1])]} blinkDelay={0.2}><FlowerCrown /></Ruth>
        <Boaz x={bx} y={y} s={s} pose="hug-right" facing="left" reach={[null, reach(bx, y, s, meet[0], meet[1], 'left')]} blinkDelay={1.1} />
        <HandOn x={meet[0]} y={meet[1]} s={s} look={RUTH} />
      </Tap>
      <Heart x={404} y={250} s={1} />
      {([[150, 120], [260, 90], [560, 100], [670, 130], [404, 60]] as const).map(([px, py], i) => (
        <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.35}s` } as CSSProperties} d={sparkle(px, py, 7)} fill={['#ffb3d1', '#ffd34d', '#ffffff'][i % 3]} />
      ))}
    </Scene>
  )
}

// 11. "Then God gave Ruth and Boaz a baby boy named Obed. Naomi held baby Obed close. She was so happy again!"
// In the sunny courtyard: Naomi sits holding baby Obed in his golden blanket, laughing with joy; Ruth and Boaz stand
// beside her, and two neighbors come to see ("Naomi has a son!", Ruth 4:17). Hearts, and God's warm light.
const Page11 = () => {
  const y = 436
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={120} y={64} s={0.6} slow />
      <StoneHouse x={400} y={330} w={560} h={200} door={0.3} />
      {/* a vine climbing the wall, and the family's sheaves of barley, safe at home */}
      <path d="M190 330 Q176 280 196 240 Q214 200 190 160 Q232 160 260 148" stroke="#6b8f3a" strokeWidth={4} fill="none" strokeLinecap="round" />
      {([[190, 300], [200, 262], [206, 226], [196, 190], [226, 158], [254, 150]] as const).map(([lx, ly], i) => (
        <g key={i} transform={`translate(${lx} ${ly}) rotate(${i % 2 ? 30 : -30})`}>
          <ellipse cx={0} cy={0} rx={9} ry={6} fill="#7cb04a" stroke="#4f7f2a" strokeWidth={1.6} />
        </g>
      ))}
      <BarleySheaf x={142} y={330} s={0.6} lean={-4} />
      <BarleySheaf x={650} y={330} s={0.6} lean={4} />
      <OliveTree x={60} y={330} s={1.5} />
      <path d="M-10 330 L810 330 L810 460 L-10 460 Z" fill="#e9d8ae" />
      <path d={Array.from({ length: 7 }, (_, i) => `M-10 ${344 + i * 18} L810 ${344 + i * 18}`).join(' ')} stroke="#dcc79a" strokeWidth={2} />
      <Glow x={400} y={330} r={190} color="#fff3c4" />
      <Tap say="Naomi has a baby boy in her family!" sfx="pop">
        <Figure x={92} y={y + 2} s={0.9} look={NEIGHBORS[1]} pose="open" mood="joy" blinkDelay={1.3}><SilverHair /></Figure>
        <Figure x={712} y={y + 2} s={0.9} look={NEIGHBORS[0]} pose="pray" mood="joy" facing="left" blinkDelay={0.5}><DarkHair /></Figure>
      </Tap>
      <Tap say="Our baby boy's name is Obed. Thank You, God!" sfx="ding">
        <Ruth x={252} y={y} s={1.04} pose="pray" blinkDelay={0.6} />
        <Boaz x={552} y={y} s={1.04} pose="open" blinkDelay={1.1} />
      </Tap>
      <Tap say="God gave us a baby boy! I am so happy again." sfx="sparkle">
        <Laughing>
          <Sitting x={400} y={446} s={1.12} look={NAOMI} pose="hold" blinkDelay={0.3}>
            <SilverHair />
            <LaughFace />
          </Sitting>
        </Laughing>
      </Tap>
      {/* (Sitting draws its Person 22 lower, in its own units: the baby goes in front, between her arms) */}
      <Tap say="Goo goo! Hello, baby Obed!" sfx="pop">
        <g transform={`translate(400 ${446 + 22 * 1.12}) scale(1.12)`}>
          <BabyObedHeld />
        </g>
      </Tap>
      <Heart x={400} y={262} s={1.1} />
      <Heart x={322} y={292} s={0.7} d={0.6} />
      <Heart x={478} y={290} s={0.75} d={1.2} />
    </Scene>
  )
}

/** Baby Obed in his golden blanket, held in front in someone's arms (in their figure units, pose "hold"). */
const BabyObedHeld = () => <g transform="translate(0 -62) scale(0.86)"><ObedBaby /></g>

/** Baby Obed (people.tsx's Baby in his golden blanket), awake and smiling: (0, 0) is his middle. */
function ObedBaby() {
  return (
    <g>
      <ellipse cx={0} cy={6} rx={30} ry={18} fill={OBED_BLANKET} stroke={ink(OBED_BLANKET)} strokeWidth={2.5} />
      <path d="M-28 6 Q0 20 28 6" stroke={ink(OBED_BLANKET)} strokeWidth={2} fill="none" />
      <path d="M-4 -8 Q6 4 2 22 M12 -10 Q22 4 18 20" stroke={ink(OBED_BLANKET)} strokeWidth={2.5} fill="none" opacity={0.55} strokeLinecap="round" />
      <circle cx={-12} cy={-2} r={14} fill={SKIN.medium} stroke={ink(SKIN.medium)} strokeWidth={2} />
      <path d="M-14 -15 Q-10 -19 -7 -14" stroke="#3b2a20" strokeWidth={2} fill="none" strokeLinecap="round" />
      {[-17, -7].map((ex) => (
        <g key={ex}>
          <ellipse cx={ex} cy={-4} rx={2} ry={2.5} fill="#2b2140" />
          <circle cx={ex - 0.6} cy={-4.9} r={0.8} fill="#fff" />
        </g>
      ))}
      <path d="M-15.5 2 Q-12 6.5 -8.5 2" stroke="#6b2a3a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <ellipse cx={-21} cy={2} rx={3.5} ry={2.2} fill="#ff7fb0" opacity={0.5} />
      <ellipse cx={-3} cy={2} rx={3.5} ry={2.2} fill="#ff7fb0" opacity={0.5} />
    </g>
  )
}

// 12. "Baby Obed grew up, and one day he became the grandpa of King David! God took care of Ruth and Naomi, and God
// takes care of you, too."
// Sunset over Bethlehem's golden fields: Ruth, Boaz and Naomi with baby Obed on the hill, God's light shining over
// them. Up in a dream cloud: one day, David (the shepherd boy from David and Goliath) with his sheep and his harp,
// and the crown he would wear, shining over his head.
const Page12 = () => {
  const y = 436
  const sky = `rt12s${gid(useId())}`
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <path d="M0 0 L800 0 L800 340 L0 340 Z" fill={`url(#${sky})`} />
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f84d8" /><stop offset="0.5" stopColor="#ffb3a8" /><stop offset="0.88" stopColor="#ffe3a0" /><stop offset="1" stopColor="#ffe9b0" />
        </linearGradient>
      </defs>
      <Tap say="God takes care of you, too!" sfx="sparkle">
        <Rays x={150} y={300} r={560} n={16} color="#fff1b8" opacity={0.3} />
        <Glow x={150} y={290} r={140} color="#fff1b8" />
        <Sun x={150} y={300} s={0.7} />
      </Tap>
      <Bethlehem x={170} y={322} s={0.62} fields="gold" />
      <path d="M-10 316 Q200 302 420 318 T810 310 L810 460 L-10 460 Z" fill="#e8c766" />
      <BarleyField x0={-10} x1={810} y={330} depth={40} k={0.5} seed={41} color="#e2b64c" />
      <path d="M-10 392 Q240 372 520 386 T810 380 L810 460 L-10 460 Z" fill="#d9b25a" />
      <Tap say="One day, David will be king!" sfx="ding">
        <ThoughtBubble x={560} y={150} w={300} h={210} tail={[[466, 352, 6], [480, 320, 9], [498, 286, 12]]}>
          <Glow x={560} y={110} r={70} color="#fff3b0" />
          <ellipse cx={560} cy={222} rx={88} ry={13} fill="#b6dd92" />
          <Sheep x={614} y={222} s={0.32} facing="left" />
          <Person x={548} y={224} s={0.82} look={PEOPLE.david} holding="staff" blinkDelay={0.8} />
          <path d="M530 98 L530 82 L539 90 L548 76 L557 90 L566 82 L566 98 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2.2} strokeLinejoin="round" />
          <Sparkles spots={[[512, 84, 5], [584, 80, 5], [548, 62, 4]]} color="#ffe680" />
        </ThoughtBubble>
      </Tap>
      <Tap say="God takes good care of us!" sfx="pop">
        <Boaz x={250} y={y} s={1.02} pose="wave" blinkDelay={0.8} />
        <Ruth x={334} y={y + 2} s={1.02} pose="pray" blinkDelay={0.2} />
        <Naomi x={424} y={y} s={1.02} pose="hold" mood="joy" blinkDelay={0.5} reach={[[-26, -50], [24, -58]]} item={<BabyObedHeld />} />
      </Tap>
      <Tap say="Munch, munch! A little grasshopper in the barley." sfx="pop">
        <Grasshopper x={720} y={430} s={0.9} facing="left" />
      </Tap>
    </Scene>
  )
}

export const RUTH_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
