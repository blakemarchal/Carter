// Fishers of People (Luke 5:1-11, with Matthew 4:18-22): one picture per story page, both parts in order (see
// data/fishers.ts for the words): pages 1 to 5 are part one, pages 6 to 10 part two.
// The Lake of Galilee in the morning, after a night of fishing: the crowd on the shore (1), the two boats pulled up
// and the empty nets (2), Jesus teaching from Peter's boat (3), out to the deep water (4), the net let down (5), so
// many fish the net breaks (6), both boats full (7), Peter amazed at Jesus' feet (8), leaving everything to follow
// Him (9), and you, following Jesus too (10). Pages 5 and 6 look under the water, as the island's game does.
// God is never drawn as a person: His presence is light. Fish in nets are the fishermen's work: bright and cheerful,
// never eaten.
// Jesus is PEOPLE.jesus, and the four fishermen are PEOPLE.peter, andrew, james and john, as on Jesus Calms the Storm.
// New people (exported, to move into people.tsx): ZEBEDEE, James and John's dad, and his two HELPERS.
// Props (exported, to move into kit.tsx): FishingBoat (copied from Jesus Calms the Storm, so the disciples' boat is
// the same boat on both islands, with a fish heap, and a band color and a flag of its own for Zebedee's boat),
// NetCurtain, NetPile, Splash, LakeBed, EelGrass, Pebbles, Duck, Footprints and Heart; Folk is copied from Loaves &
// Fishes. The lake (Sky, FarHills, Lake) follows Jesus Calms the Storm's, with FrontWater for boats sitting low in it.
// The fish and nets themselves are in art/items/isl-fishers.tsx.
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Figure, PEOPLE, SKIN, type JHolding, type JLook, type JPose, type Mood } from '../people'
import { usePlayer } from './player'
import { Cloud, Glow, Scene, Sparkles, Sun, Tap } from './kit'
import { FISH_COLORS, FishHeap, Fishy, NET, NET_LINE, NetBag, Rope } from '../items/isl-fishers'
import './fishers.css'

const uidOf = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')
type Pt = [number, number]

// ---------- People ----------

const { jesus: JESUS, peter: PETER, andrew: ANDREW, james: JAMES, john: JOHN } = PEOPLE

/** Zebedee, James and John's dad: an older fisherman with a long grey beard, a cream head cloth and a plum robe. He stays in his boat. */
export const ZEBEDEE: JLook = { skin: SKIN.medium, hair: 'covered', hairColor: '#d8d2c8', wrap: '#efe3c6', beard: 'long', beardColor: '#e6e1d8', robe: '#8e6f9e', sash: '#e0b45a' }
/** The helpers in Zebedee's boat (Mark 1:20): a young man in a red head cloth, and one with short hair. */
export const HELPERS: JLook[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e0604d', beard: 'short', beardColor: '#3b2a20', robe: '#d8b77a', sash: '#6f9fc0' },
  { skin: SKIN.deep, hair: 'short', hairColor: '#2b1f18', robe: '#7fb3a6', sash: '#f0d38a' },
]

// ---------- The lake in the morning ----------

/** The light: the fresh early morning after the night's fishing, and the bright day. */
type Tone = 'morning' | 'day'
const TONES: Record<Tone, { sky: string[]; hills: [string, string]; water: [string, string, string] }> = {
  morning: { sky: ['#86c9f4', '#cbe8fb', '#ffeccf'], hills: ['#b2cdc0', '#8dbd8a'], water: ['#b3e0f3', '#64b4e4', '#4392d2'] },
  day: { sky: ['#7fc8f8', '#bfe6ff', '#fff2d2'], hills: ['#a9cdb8', '#86bb84'], water: ['#a3dbf5', '#5aaee6', '#3f8fd0'] },
}

/** The sky, down to the horizon at h. */
function Sky({ tone, h }: { tone: Tone; h: number }) {
  const id = `fsk${uidOf(useId())}`
  const stops = TONES[tone].sky
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}
        </linearGradient>
      </defs>
      <rect width={800} height={h + 4} fill={`url(#${id})`} />
    </g>
  )
}

/** The hills round the lake, far off across the water: a hazy range and a nearer one, along the horizon at h. A little white town sits on the far shore. */
function FarHills({ tone, h, town = 600 }: { tone: Tone; h: number; town?: number | null }) {
  const [back, front] = TONES[tone].hills
  return (
    <g>
      <path d={`M0 ${h - 30} Q60 ${h - 58} 130 ${h - 42} Q200 ${h - 26} 262 ${h - 40} Q340 ${h - 72} 430 ${h - 46} Q490 ${h - 30} 548 ${h - 42} Q624 ${h - 64} 704 ${h - 40} Q760 ${h - 26} 800 ${h - 36} L800 ${h + 1} L0 ${h + 1} Z`} fill={back} />
      <path d={`M0 ${h - 12} Q86 ${h - 32} 176 ${h - 15} Q250 ${h - 2} 336 ${h - 17} Q420 ${h - 34} 506 ${h - 13} Q586 ${h - 1} 666 ${h - 18} Q742 ${h - 32} 800 ${h - 11} L800 ${h + 1} L0 ${h + 1} Z`} fill={front} />
      {town !== null && (
        <g opacity={0.9}>
          {[[-22, 9, 13], [-6, 12, 11], [10, 9, 14], [26, 11, 10]].map(([dx, w, hh], i) => (
            <rect key={i} x={town + dx - w / 2} y={h - 9 - hh} width={w} height={hh} fill={i % 2 ? '#f2e8d6' : '#fbf5ea'} stroke="#c9b89a" strokeWidth={1} />
          ))}
        </g>
      )}
    </g>
  )
}

/** Where little waves are drawn on the lake: [x, how far below the horizon]. */
const WAVE_MARKS: Pt[] = [[70, 30], [250, 22], [460, 34], [660, 20], [140, 70], [380, 82], [600, 64], [740, 96], [60, 130], [300, 150], [520, 136], [700, 172]]

/** The lake's colors from the horizon at h down to the bottom of the picture (the same wherever it's used, so the water in front of a boat matches the lake behind it). */
function LakeFill({ id, tone, h }: { id: string; tone: Tone; h: number }) {
  const [top, mid, bottom] = TONES[tone].water
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={h} x2={0} y2={450}>
      <stop offset="0" stopColor={top} /><stop offset="0.4" stopColor={mid} /><stop offset="1" stopColor={bottom} />
    </linearGradient>
  )
}

/** The lake, from the horizon at h down to the bottom of the picture, with little waves. */
function Lake({ tone, h }: { tone: Tone; h: number }) {
  const id = `flk${uidOf(useId())}`
  const [top] = TONES[tone].water
  const deep = 450 - h
  return (
    <g>
      <defs><LakeFill id={id} tone={tone} h={h} /></defs>
      <rect x={0} y={h} width={800} height={deep} fill={`url(#${id})`} />
      <path d={`M0 ${h + 1} L800 ${h + 1}`} stroke={lighten(top, 0.4)} strokeWidth={2} opacity={0.7} />
      {WAVE_MARKS.filter(([, dy]) => dy < deep - 10).map(([x, dy], i) => {
        const k = 0.55 + (dy / deep) * 1.1
        const w = 26 * k
        return (
          <g key={i} className={`sc-wave ${i % 2 ? 'slow' : ''}`}>
            <path d={`M${x} ${h + dy} q${w / 2} ${-6 * k} ${w} 0`} stroke="#ffffff" strokeWidth={2 + k} fill="none" strokeLinecap="round" opacity={0.7} />
          </g>
        )
      })}
    </g>
  )
}

/** The near water, in front of boats sitting low in it: the lake (as Lake draws it, horizon at h) from y down, with little waves rolling along its top and splashes of foam. */
function FrontWater({ tone, h, y }: { tone: Tone; h: number; y: number }) {
  const id = `ffw${uidOf(useId())}`
  const top = `M-80 ${y} ${Array.from({ length: 12 }, () => 'q20 -7 40 0 t40 0').join(' ')}`
  return (
    <g>
      <defs><LakeFill id={id} tone={tone} h={h} /></defs>
      <path className="sc-wave" d={`${top} L880 470 L-80 470 Z`} fill={`url(#${id})`} />
      <path className="sc-wave" d={top} stroke="#ffffff" strokeWidth={3.5} fill="none" opacity={0.85} />
      {[[120, 40], [330, 62], [560, 36], [700, 70]].map(([x, dy], i) => (
        <g key={i} className={`sc-wave ${i % 2 ? 'slow' : ''}`}>
          <path d={`M${x} ${y + dy} q14 -6 28 0`} stroke="#ffffff" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      ))}
    </g>
  )
}

/** The beach in front of the lake: sand from the water's edge (`edge`, a path's top line from left to right) down, with a line of foam along it and pebbles. */
function Beach({ edge, foam = true, pebbles = [] }: { edge: string; foam?: boolean; pebbles?: Pt[] }) {
  return (
    <g>
      <path d={`${edge} L810 460 L-10 460 Z`} fill="#efd8a2" />
      <path d={`${edge} L810 460 L-10 460 Z`} fill="#e6c98c" transform="translate(0 26)" opacity={0.6} />
      {foam && <path className="sc-wave slow" d={edge} stroke="#ffffff" strokeWidth={3.5} fill="none" opacity={0.75} strokeLinecap="round" />}
      {pebbles.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={5 + (i % 3)} ry={3.2 + (i % 2)} fill={['#cfc4b2', '#b8ad9c', '#ddd3c2'][i % 3]} stroke="#9a8f7e" strokeWidth={1.2} />)}
    </g>
  )
}

// ---------- The fishing boat (as on Jesus Calms the Storm) ----------
// Boat units: (0, 0) is the middle of the waterline and the prow is on the right. At s = 1 the hull is 500 long and
// the mast stands 310 above the water. We see a little way down into the boat: its far rim, and the inside of its
// far side between the rims. People stand in it with their feet on its floor (y ≈ -6), hidden by its near side.

const BOAT = {
  hull: 'M-250 -64 Q-10 -10 246 -80 Q252 -26 210 18 Q0 44 -214 16 Q-254 -10 -250 -64 Z',
  rim: 'M-250 -64 Q-10 -10 246 -80',
  stripe: 'M-249 -58 Q-10 -4 245 -74 L242.5 -48 Q-10 22 -246.5 -32 Z',
  farRim: 'M-244 -80 Q-10 -38 240 -96',
  inside: 'M-244 -80 Q-10 -38 240 -96 L246 -80 Q-10 -10 -250 -64 Z',
  furled: 'M-94 -276 Q30 -298 154 -292 Q162 -282 152 -274 Q30 -266 -88 -260 Q-100 -266 -94 -276 Z',
}
const BOAT_COLORS = { wood: '#b5794a', line: '#6f4322', rim: '#d9a066', inside: '#7d5030', plank: '#8f5a2e', stripe: '#3f8fb8', sail: '#ffe3a1', mast: '#7a5233', flag: '#e0604d' }
/** Zebedee's boat, James and John's: the same kind of boat, with a green band and a yellow flag. */
const ZEBEDEE_BOAT = { band: '#5f9a52', flag: '#f2c94c' }
const MAST_X = 34

/**
 * A fishing boat on the lake, its sail rolled up on its yard, with a blue band (Peter's boat) or another `band`
 * and `flag` (Zebedee's). It rocks on the water, unless `still` (pulled up on the shore). `crew` stand in it (boat
 * units, feet on the floor at y ≈ -6); `heap` piles it with fish in front of them, that high above its floor (its
 * rim is about 40 above the floor in the middle); `front` is drawn over everything. (A boat sitting low in the
 * water, so full of fish: draw FrontWater over it.)
 */
export function FishingBoat({ x, y, s = 1, tilt = 0, facing = 'right', still, band = BOAT_COLORS.stripe, flag = BOAT_COLORS.flag, crew, heap = 0, front }: {
  x: number; y: number; s?: number; tilt?: number; facing?: 'left' | 'right'; still?: boolean; band?: string; flag?: string
  crew?: ReactNode; heap?: number; front?: ReactNode
}) {
  const uid = uidOf(useId())
  const C = BOAT_COLORS
  const wood = useShade(C.wood, 0.22, 0.22)
  const cloth = useShade(C.sail, 0.3, 0.12)
  const fl = 34
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
      {/* the mast, its stay to the prow, the flag, the yard and the sail rolled up on it */}
      <path d={`M${MAST_X} -300 L240 -90`} stroke="#8a6a4a" strokeWidth={2} />
      <path d={`M${MAST_X} -20 L${MAST_X} -312`} stroke={C.mast} strokeWidth={9} strokeLinecap="round" />
      <path d={`M${MAST_X} -311 Q${MAST_X + fl * 0.5} -310 ${MAST_X + fl} -304 Q${MAST_X + fl * 0.5} -300 ${MAST_X} -293 Z`} fill={flag} stroke={ink(flag)} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-96 -270 L154 -285" stroke={C.mast} strokeWidth={7} strokeLinecap="round" />
      <path d={BOAT.furled} fill={cloth.fill} stroke={ink(C.sail)} strokeWidth={3} strokeLinejoin="round" />
      {[-60, -10, 40, 90, 136].map((tx) => <path key={tx} d={`M${tx} ${-290 + (tx + 90) * -0.02} l-3 22`} stroke="#a0703f" strokeWidth={3} strokeLinecap="round" />)}
      {crew}
      {/* fish piled up in the boat, round the crew's knees */}
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

/** Someone standing in the boat (boat units): a Figure with their feet on its floor, so its near side hides their legs. `low` sits them lower (sitting down). */
function Aboard({ x, look, s = 0.9, low = 0, ...rest }: {
  x: number; look: JLook; s?: number; low?: number; pose?: JPose; mood?: Mood; facing?: 'left' | 'right'; blinkDelay?: number
  holding?: JHolding; reach?: [Pt | null, Pt | null]; item?: ReactNode; kneel?: boolean; children?: ReactNode
}) {
  return <Figure x={x} y={-6 + low} s={s} look={look} {...rest} />
}

/** Where a hand goes, in a Figure's own units, to reach the point (bx, by) in the boat: for a Figure at x (feet at -6 + low), s big. */
const reachTo = (fx: number, s: number, bx: number, by: number, facing: 'left' | 'right' = 'right', low = 0): Pt =>
  [((bx - fx) / s) * (facing === 'left' ? -1 : 1), (by - (-6 + low)) / s]

// ---------- Nets, oars and the water ----------

/** Diagonal cords crossing in diamonds over the box (x0, y0)-(x1, y1), `step` apart, as one path. */
function meshPath(x0: number, y0: number, x1: number, y1: number, step: number) {
  const h = y1 - y0
  const out: string[] = []
  for (let cx = x0 - h; cx <= x1 + h; cx += step) {
    out.push(`M${cx.toFixed(1)} ${y0} l${h} ${h}`, `M${(cx + h).toFixed(1)} ${y0} l${-h} ${h}`)
  }
  return out.join(' ')
}

/**
 * A net held up by its top corners, at a and b: its top rope sagging between them and the net hanging below in a
 * soft U, `drop` deep (`drip`: water dripping from it, just washed). It's empty unless it has `children` drawn in it.
 */
export function NetCurtain({ a, b, drop, sag = 10, drip, children }: { a: Pt; b: Pt; drop: number; sag?: number; drip?: boolean; children?: ReactNode }) {
  const id = `nc${uidOf(useId())}`
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  // (the U of the net, from b round the bottom to a)
  const u = `C${b[0] + 4} ${b[1] + drop * 0.7} ${mx + (b[0] - a[0]) * 0.25} ${my + drop} ${mx} ${my + drop} C${mx - (b[0] - a[0]) * 0.25} ${my + drop} ${a[0] - 4} ${a[1] + drop * 0.7} ${a[0]} ${a[1]}`
  const shape = `M${a[0]} ${a[1]} Q${mx} ${my + sag} ${b[0]} ${b[1]} ${u} Z`
  const x0 = Math.min(a[0], b[0]) - 10, x1 = Math.max(a[0], b[0]) + 10
  return (
    <g>
      <defs><clipPath id={id}><path d={shape} /></clipPath></defs>
      <path d={shape} fill="#ffffff" opacity={0.12} />
      {children}
      <g clipPath={`url(#${id})`}>
        <path d={meshPath(x0, Math.min(a[1], b[1]) - 4, x1, my + drop + 4, 11)} stroke={NET_LINE} strokeWidth={2.6} fill="none" opacity={0.5} />
        <path d={meshPath(x0, Math.min(a[1], b[1]) - 4, x1, my + drop + 4, 11)} stroke={NET} strokeWidth={1.4} fill="none" />
      </g>
      <path d={`M${b[0]} ${b[1]} ${u}`} fill="none" stroke={NET} strokeWidth={2} opacity={0.9} />
      <Rope d={`M${a[0]} ${a[1]} Q${mx} ${my + sag} ${b[0]} ${b[1]}`} w={3} />
      {drip && [[mx - 18, my + drop * 0.9 + 14, 0], [mx + 6, my + drop + 18, 0.7], [mx + 26, my + drop * 0.85 + 10, 1.3]].map(([dx, dy, d], i) => (
        <g key={i} className="sc-float" style={{ animationDelay: `${d}s` } as CSSProperties}>
          <path d={`M${dx} ${dy - 7} q-4 6 0 8.5 q4 -2.5 0 -8.5 Z`} fill="#9fd8ff" stroke="#4a9ad8" strokeWidth={1.3} />
        </g>
      ))}
    </g>
  )
}

/** A net folded up in a heap, ready to let down: a lumpy pile of cords with cork floats. (x, y): the middle of its bottom; about 120 wide at s = 1. */
export function NetPile({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const id = `np${uidOf(useId())}`
  const shape = 'M-60 0 Q-66 -22 -44 -30 Q-36 -46 -14 -42 Q0 -56 18 -44 Q42 -48 48 -30 Q66 -22 60 0 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={id}><path d={shape} /></clipPath></defs>
      <path d={shape} fill="#e8d9b4" stroke={NET_LINE} strokeWidth={2.4} strokeLinejoin="round" />
      <g clipPath={`url(#${id})`}>
        <path d={meshPath(-70, -60, 70, 4, 9)} stroke={NET_LINE} strokeWidth={1.4} fill="none" opacity={0.7} />
        <path d="M-56 -14 Q-20 -30 20 -22 Q44 -18 58 -26 M-50 -30 Q-10 -44 34 -36" stroke={NET_LINE} strokeWidth={2} fill="none" opacity={0.6} />
      </g>
      {[[-40, -26], [-8, -40], [26, -34], [48, -16]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={7} ry={4.5} fill="#c98448" stroke="#8a5428" strokeWidth={1.6} />)}
    </g>
  )
}

/** Sand heaped against the bottom of a boat pulled up on the beach, so it sits in the sand: a low bank `w` wide, its middle at (x, y). */
const SandBank = ({ x, y, w, color = '#e9cf95' }: { x: number; y: number; w: number; color?: string }) => (
  <g>
    <ellipse cx={x} cy={y + 6} rx={w * 0.5} ry={7} fill="#7a5a30" opacity={0.12} />
    <path d={`M${x - w / 2} ${y + 4} Q${x - w / 4} ${y - 9} ${x} ${y - 9} Q${x + w / 4} ${y - 9} ${x + w / 2} ${y + 4} Q${x} ${y + 9} ${x - w / 2} ${y + 4} Z`} fill={color} />
  </g>
)

/** A long oar (or a pole), held from (x1, y1) down into the water at (x2, y2), its blade at the bottom. */
const Oar = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => {
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#6b4422" strokeWidth={8} strokeLinecap="round" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#b07a45" strokeWidth={5} strokeLinecap="round" />
      <g transform={`translate(${x2} ${y2}) rotate(${a})`}>
        <path d="M-6 -2 Q14 -10 34 -7 Q38 0 34 7 Q14 10 -6 2 Z" fill="#b07a45" stroke="#6b4422" strokeWidth={2.4} strokeLinejoin="round" />
      </g>
    </g>
  )
}

/** A splash on the water where a fish leaps out or dives in: a little crown of water with drops flying up. It springs up and falls back every few seconds (fs-splash; `delay` times it), unless `still`. (x, y): on the surface. */
export function Splash({ x, y, s = 1, delay = 0, still }: { x: number; y: number; s?: number; delay?: number; still?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={still ? undefined : 'fs-splash'} style={still ? undefined : ({ animationDelay: `${delay}s` } as CSSProperties)}>
        <ellipse cx={0} cy={2} rx={40} ry={6} fill="none" stroke="#ffffff" strokeWidth={2.5} opacity={0.8} />
        <path d="M-34 2 Q-26 -4 -24 -22 Q-18 -8 -12 -6 Q-9 -28 -2 -40 Q4 -24 8 -7 Q14 -10 20 -28 Q23 -8 34 2 Z" fill="#c9f0ff" stroke="#ffffff" strokeWidth={3} strokeLinejoin="round" />
        {[[-30, -36, -30], [-10, -58, -8], [13, -54, 12], [31, -38, 32]].map(([cx, cy, a], i) => (
          <path key={i} d={`M${cx} ${cy - 7} Q${cx + 5.5} ${cy + 2} ${cx} ${cy + 4} Q${cx - 5.5} ${cy + 2} ${cx} ${cy - 7} Z`} transform={`rotate(${a} ${cx} ${cy})`} fill="#c9f0ff" stroke="#ffffff" strokeWidth={2} />
        ))}
      </g>
    </g>
  )
}

/** The lake bed seen from under the water: sandy mounds from about y down (`near`: the close-up front edge, warm and sandy; else far off, blue with the water). */
export function LakeBed({ y, near }: { y: number; near?: boolean }) {
  return near ? (
    <g>
      <path d={`M-10 470 L-10 ${y} Q100 ${y - 10} 210 ${y - 2} Q330 ${y + 8} 450 ${y - 4} Q580 ${y - 14} 690 ${y - 2} Q760 ${y + 4} 810 ${y - 4} L810 470 Z`} fill="#d8c08a" />
      <path d={`M-10 ${y} Q100 ${y - 10} 210 ${y - 2} Q330 ${y + 8} 450 ${y - 4} Q580 ${y - 14} 690 ${y - 2} Q760 ${y + 4} 810 ${y - 4}`} stroke="#ecd9a8" strokeWidth={3} fill="none" />
    </g>
  ) : (
    <path d={`M-10 470 L-10 ${y + 4} Q80 ${y - 10} 170 ${y} Q260 ${y + 10} 350 ${y - 2} Q450 ${y - 14} 540 ${y} Q640 ${y + 12} 720 ${y - 2} Q770 ${y - 8} 810 ${y} L810 470 Z`} fill="#93b9a8" />
  )
}

/** A clump of eelgrass on the lake bed, its long blades swaying in the water. (x, y): its foot. */
export function EelGrass({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  const blades: [number, number, number][] = [[-12, -46, -18], [-6, -70, -6], [0, -84, 6], [6, -64, 16], [12, -44, 24]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sc-sway" style={{ animationDelay: `${delay}s` } as CSSProperties}>
        {blades.map(([bx, h, lean], i) => (
          <path key={i} d={`M${bx - 3} 0 Q${bx + lean * 0.3} ${h * 0.5} ${bx + lean} ${h} Q${bx + lean * 0.3 + 3} ${h * 0.5} ${bx + 3} 0 Z`} fill={i % 2 ? '#4f9e62' : '#63b06c'} stroke="#3a7d4c" strokeWidth={1.4} strokeLinejoin="round" />
        ))}
      </g>
    </g>
  )
}

/** Smooth pebbles along the lake bed at y (`near`: bigger, close up). */
export const Pebbles = ({ y, xs, near }: { y: number; xs: number[]; near?: boolean }) => (
  <g>
    {xs.map((x, i) => (
      <ellipse key={i} cx={x} cy={y + (i % 2) * 4} rx={near ? 10 : 6.5} ry={near ? 6 : 4} fill={['#b9b0a2', '#a39a8c', '#c9c0b0'][i % 3]} stroke="#7f776b" strokeWidth={1.4} />
    ))}
  </g>
)

/** Under the lake, seen through a cut in the picture: from the surface at y down, light water getting deeper, sunbeams, bubbles and the lake bed. Drawn over a boat's hull, so its bottom shows through the water. */
function Underwater({ y, children }: { y: number; children?: ReactNode }) {
  const id = `uw${uidOf(useId())}`
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd0e4" stopOpacity={0.82} />
          <stop offset="0.25" stopColor="#5ab8da" stopOpacity={0.96} />
          <stop offset="1" stopColor="#2f7cb4" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.3} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path className="sc-wave" d={`M-80 ${y} ${Array.from({ length: 12 }, () => 'q20 -6 40 0 t40 0').join(' ')} L880 470 L-80 470 Z`} fill={`url(#${id}w)`} />
      <g className="fs-shimmer">
        {[[90, 50], [300, 40], [520, 56], [720, 44]].map(([x, w], i) => (
          <path key={i} d={`M${x} ${y + 4} L${x + w} ${y + 4} L${x + w - 70} 440 L${x - 110} 440 Z`} fill={`url(#${id}r)`} />
        ))}
      </g>
      <LakeBed y={428} />
      {[[60, 440, 0.8], [700, 442, 0.9]].map(([x, yy, s], i) => <EelGrass key={i} x={x} y={yy} s={s} delay={i * 0.9} />)}
      {[[150, 420, 0], [640, 410, 1.8]].map(([x, yy, d], i) => (
        <g key={i} className="fs-rise" style={{ animationDelay: `${d}s` } as CSSProperties}>
          {[[0, 0, 4], [5, -16, 3], [-2, -30, 5]].map(([dx, dy, r], j) => <circle key={j} cx={x + dx} cy={yy + dy} r={r} fill="#ffffff" fillOpacity={0.3} stroke="#e8fbff" strokeWidth={1.5} />)}
        </g>
      ))}
      {children}
      <path className="sc-wave" d={`M-80 ${y} ${Array.from({ length: 12 }, () => 'q20 -6 40 0 t40 0').join(' ')}`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.85} />
    </g>
  )
}

// ---------- Little things ----------

/** A duck swimming on the lake (facing right, or `left`): brown, with a green head and an orange beak. (x, y): the water under it. */
export function Duck({ x, y, s = 1, left }: { x: number; y: number; s?: number; left?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${left ? -s : s} ${s})`}>
      <ellipse cx={0} cy={1} rx={22} ry={3} fill="none" stroke="#ffffff" strokeWidth={1.6} opacity={0.7} />
      <path d="M-20 -6 L-29 -14 L-24 -3 Z" fill="#8a6a4a" stroke="#5e4630" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M-21 0 Q-24 -15 -6 -15 Q8 -15 14 -5 Q16 -1 14 0 Z" fill="#a8825a" stroke="#6e5236" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-14 -6 Q-2 -12 8 -6 Q-2 -2 -14 -6 Z" fill="#8a6a4a" />
      <circle cx={13} cy={-18} r={7.5} fill="#3f9a62" stroke="#2c6e46" strokeWidth={1.6} />
      <path d="M19.5 -19 L28 -16.5 L19.5 -14.5 Z" fill="#ffad3d" stroke="#d98a1a" strokeWidth={1} strokeLinejoin="round" />
      <circle cx={15} cy={-20} r={1.7} fill="#2b2140" />
      <path d="M8 -12 Q12 -10 16 -12" stroke="#ffffff" strokeWidth={1.6} fill="none" />
    </g>
  )
}

/** Footprints in the sand: pairs of little sandal prints along the way from a to b. */
export const Footprints =({ a, b, n = 6 }: { a: Pt; b: Pt; n?: number }) => (
  <g fill="#c9a66a" opacity={0.75}>
    {Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1)
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
      const k = 0.7 + 0.3 * t
      return <ellipse key={i} cx={x} cy={y + (i % 2 ? 5 : -5) * k} rx={6 * k} ry={2.8 * k} />
    })}
  </g>
)

/** A soft, shiny heart that bobs gently: God's love. */
export function Heart({ x, y, s = 1, color = '#ff8fb1' }: { x: number; y: number; s?: number; color?: string }) {
  const shade = useShade(color, 0.35, 0.15)
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <defs>{shade.def}</defs>
        <path d="M0 16 C-24 2 -26 -14 -14 -19 C-7 -22 -2 -17 0 -11 C2 -17 7 -22 14 -19 C26 -14 24 2 0 16 Z" fill={shade.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={-10} cy={-10} rx={4} ry={2.4} fill="#fff" opacity={0.65} transform="rotate(-35 -10 -10)" />
      </g>
    </g>
  )
}

// ---------- People on the shore (Folk is copied from Loaves & Fishes) ----------

const SKINS = ['#d9a47a', '#c68b5e', '#f6d2b8', '#8d5a3b', '#e3b48c']
const ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
const HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24', '#e8e4dc']

/**
 * One small person in the crowd, front view, standing or sitting on the sand. `i` picks the colors. Standing, both
 * arms hang at the sides (with `wave`, the right one waves); sitting, the hands rest in the lap.
 */
export function Folk({ x, y, s = 1, i = 0, sit, wave }: { x: number; y: number; s?: number; i?: number; sit?: boolean; wave?: boolean }) {
  const robe = ROBES[i % ROBES.length]
  const skin = SKINS[(i * 7 + 2) % SKINS.length]
  const kind = (i * 5) % 4 // 0, 3: head covering · 1: short hair · 2: long hair
  const hair = HAIRS[(i * 3) % HAIRS.length]
  const wrap = WRAPS[(i * 11) % WRAPS.length]
  const covered = kind === 0 || kind === 3
  const hy = sit ? -38 : -54
  const cap = `M-12 ${hy} Q-13 ${hy - 15} 0 ${hy - 15} Q13 ${hy - 15} 12 ${hy} Q6 ${hy - 8} 0 ${hy - 7} Q-6 ${hy - 8} -12 ${hy} Z`
  const back = `M-13 ${hy - 3} Q-16 ${hy + 15} -11 ${hy + 13} L11 ${hy + 13} Q16 ${hy + 15} 13 ${hy - 3} Z`
  const [sx, sy] = sit ? [-13, -21] : [-10.5, -39]
  const [hx, hy2] = sit ? [-8, -8] : [-17.5, -19]
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
      {hand(hx, hy2)}
      {!wave && hand(-hx, hy2)}
      <circle cx={0} cy={hy} r={11} fill={skin} stroke={ink(skin)} strokeWidth={2} />
      <circle cx={-4} cy={hy} r={1.9} fill="#2b2140" />
      <circle cx={4} cy={hy} r={1.9} fill="#2b2140" />
      <ellipse cx={-7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <ellipse cx={7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <path d={`M-3 ${hy + 5} Q0 ${hy + 8.5} 3 ${hy + 5}`} stroke="#6b2a3a" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d={cap} fill={covered ? wrap : hair} stroke={ink(covered ? wrap : hair)} strokeWidth={2} />
    </g>
  )
}

type Row = [y: number, x0: number, x1: number, n: number, s: number]

/** Rows of Folk, back row first, their spacing wobbling a little so it looks like a real crowd. `skip`: x ranges left empty. */
function Crowd({ rows, sit, seed = 0, skip = [], waves = 5 }: { rows: Row[]; sit?: boolean; seed?: number; skip?: [number, number][]; waves?: number }) {
  let k = seed
  return (
    <g>
      {rows.map(([y, x0, x1, n, s], r) => Array.from({ length: n }, (_, j) => {
        const i = k++
        const step = n > 1 ? (x1 - x0) / (n - 1) : 0
        const x = x0 + j * step + Math.sin(i * 12.9898) * step * 0.2
        if (skip.some(([a, b]) => x > a && x < b)) return null
        return <Folk key={`${r}-${j}`} x={x} y={y + Math.cos(i * 4.1) * 3 * s} s={s} i={i} sit={sit} wave={!sit && i % waves === 1} />
      }))}
    </g>
  )
}

/** The child playing (Jesus wants you to follow Him, too), drawn from their profile. */
const Kid = ({ x, y, s }: { x: number; y: number; s: number }) => <Figure x={x} y={y} s={s} look={usePlayer().look} pose="arms-up" mood="joy" />

// ---------- Part one (pages 1 to 5) ----------

// 1. "One morning, Jesus was by the Lake of Galilee. A great big crowd came to hear Him talk about God."
// The fresh morning: Jesus at the water's edge, the crowd pressing in close on the beach to hear Him (Luke 5:1).
const Page1 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="morning" h={222} />
    <Sun x={118} y={96} s={0.72} />
    <Cloud x={330} y={70} s={0.8} />
    <Cloud x={640} y={56} s={0.6} slow />
    <FarHills tone="morning" h={222} />
    <Lake tone="morning" h={222} />
    <Tap say="Quack, quack!" sfx="pop">
      <g className="sc-float">
        <Duck x={476} y={262} s={0.62} />
        <Duck x={512} y={270} s={0.4} />
        <Duck x={540} y={274} s={0.4} />
      </g>
    </Tap>
    <Beach edge="M-10 300 Q180 290 360 302 Q560 316 810 300" pebbles={[[470, 360], [560, 420], [748, 352], [690, 436]]} />
    <Tap say="We came to hear Jesus!" sfx="good">
      <Crowd seed={2} rows={[[322, 20, 450, 12, 0.42], [346, 10, 470, 11, 0.52], [378, 20, 490, 9, 0.64], [414, 30, 470, 7, 0.8]]} />
    </Tap>
    <Tap say="Hi, Jesus! Over here!" sfx="pop">
      <Folk x={120} y={440} s={0.98} i={18} wave />
    </Tap>
    <Folk x={300} y={444} s={1} i={11} />
    <Tap say="Good morning! God loves every one of you!" sfx="sparkle">
      <Figure x={628} y={420} s={1.04} look={JESUS} pose="open" facing="left" blinkDelay={0.4} />
    </Tap>
  </Scene>
)

// 2. "Two fishing boats sat on the shore. The fishermen were washing their nets. Their nets were empty. Not one fish!"
// The two boats pulled up on the sand (Luke 5:2): Peter's with its blue band and red flag, and Zebedee's, with
// Zebedee aboard mending a net. In front, Peter and Andrew, and James and John, hold up their nets, just washed and
// dripping: empty.
const Page2 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="morning" h={214} />
    <Sun x={110} y={90} s={0.66} />
    <Cloud x={420} y={62} s={0.7} slow />
    <FarHills tone="morning" h={214} town={680} />
    <Lake tone="morning" h={214} />
    <Beach edge="M-10 288 Q200 280 400 292 Q600 302 810 286" pebbles={[[40, 330], [770, 330], [404, 352]]} />
    {/* the two boats, pulled up on the sand */}
    <FishingBoat x={214} y={334} s={0.5} tilt={-2} still />
    <Tap say="Time to fix this net." sfx="pop">
      <FishingBoat x={600} y={330} s={0.5} tilt={2} still band={ZEBEDEE_BOAT.band} flag={ZEBEDEE_BOAT.flag}
        crew={<Aboard x={-70} look={ZEBEDEE} pose="hold" low={-8} blinkDelay={1.2} />}
        front={<NetCurtain a={[-150, -47]} b={[-20, -41]} drop={46} sag={6} />}
      />
    </Tap>
    <SandBank x={214} y={350} w={300} />
    <SandBank x={600} y={346} w={300} />
    {/* Peter and Andrew, holding up their net, just washed */}
    <Tap say="Not one fish. Not even a little one!" sfx="wobble">
      <g>
        <Figure x={104} y={438} s={0.88} look={PETER} facing="right" reach={[[34, -88], [52, -100]]} blinkDelay={0.9} />
        <Figure x={322} y={440} s={0.88} look={ANDREW} facing="left" reach={[[34, -88], [52, -100]]} blinkDelay={1.7} />
        <NetCurtain a={[150, 352]} b={[276, 354]} drop={62} sag={12} drip />
      </g>
    </Tap>
    {/* James and John, with theirs */}
    <Tap say="Our net is empty, too!" sfx="wobble">
      <g>
        <Figure x={480} y={440} s={0.86} look={JAMES} facing="right" reach={[[34, -88], [52, -100]]} blinkDelay={0.3} />
        <Figure x={694} y={444} s={0.82} look={JOHN} facing="left" reach={[[34, -88], [52, -100]]} blinkDelay={2.2} />
        <NetCurtain a={[525, 354]} b={[651, 358]} drop={58} sag={12} drip />
      </g>
    </Tap>
  </Scene>
)

// 3. "One boat belonged to a fisherman named Peter. Jesus got into Peter's boat, and Peter pushed it out onto the
// water. Then Jesus sat down in the boat and taught the people."
// Peter holds the boat steady with a long oar, a little way out from the shore; Jesus sits in it, teaching the crowd
// on the beach (Luke 5:3).
const Page3 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="morning" h={214} />
    <Sun x={712} y={84} s={0.66} />
    <Cloud x={200} y={70} s={0.75} />
    <FarHills tone="morning" h={214} town={140} />
    <Lake tone="morning" h={214} />
    {/* the beach, coming down to the water on the right, and the crowd on it */}
    <Beach edge="M470 460 Q500 380 600 330 Q690 294 810 288" pebbles={[[560, 446], [770, 336]]} />
    <Tap say="We can hear Jesus from here!" sfx="good">
      <Crowd sit seed={30} rows={[[322, 660, 790, 4, 0.42], [348, 620, 790, 5, 0.52], [382, 590, 790, 5, 0.64], [420, 570, 790, 4, 0.8]]} />
    </Tap>
    <Tap say="Hi, Jesus!" sfx="pop">
      <Folk x={640} y={448} s={0.95} i={9} wave />
    </Tap>
    <FishingBoat x={290} y={378} s={0.7}
      crew={<>
        <Tap say="Hold on! I'll keep the boat steady." sfx="pop">
          <Aboard x={-160} look={PETER} pose="hold" low={-14} blinkDelay={1.4} />
        </Tap>
        <Tap say="God loves each one of you, so much!" sfx="sparkle">
          <Aboard x={120} look={JESUS} low={10} reach={[[-46, -100], [46, -100]]} blinkDelay={0.5} />
        </Tap>
      </>}
      front={<Oar x1={-160} y1={-82} x2={-292} y2={58} />}
    />
  </Scene>
)

// 4. "When Jesus was done teaching, He said to Peter, "Now go out where the water is deep, and let down your nets.""
// Out on the lake, far from the shore: Andrew rows, Peter listens, and Jesus points out to the deep water. The nets
// are piled up in the boat, ready (Luke 5:4).
const Page4 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="day" h={206} />
    <Sun x={680} y={78} s={0.62} />
    <Cloud x={170} y={60} s={0.8} />
    <Cloud x={470} y={86} s={0.55} slow />
    <FarHills tone="day" h={206} town={null} />
    <Lake tone="day" h={206} />
    {/* the shore they came from, far away, and the people on it */}
    <path d="M-10 214 Q60 204 150 210 L150 216 L-10 218 Z" fill="#efd8a2" />
    <g opacity={0.8}>{[20, 38, 56, 74, 92, 110].map((x, i) => <Folk key={x} x={x} y={213} s={0.16} i={i + 4} />)}</g>
    <FishingBoat x={392} y={376} s={0.84}
      crew={<>
        <Tap say="Row, row, row!" sfx="whoosh">
          <g>
            <Aboard x={-182} look={ANDREW} pose="hold" low={-8} blinkDelay={0.6} />
            <Oar x1={-170} y1={-66} x2={-290} y2={40} />
          </g>
        </Tap>
        <Tap say="Out there, Teacher? Okay!" sfx="pop">
          <Aboard x={-70} look={PETER} mood="wow" low={-8} blinkDelay={1.6} />
        </Tap>
        <Tap say="Go out where the water is deep!" sfx="sparkle">
          <Aboard x={130} look={JESUS} pose="point" low={-8} blinkDelay={0.3} />
        </Tap>
      </>}
      front={<Tap say="Our nets are ready." sfx="pop"><NetPile x={-12} y={-40} s={0.8} /></Tap>}
    />
    <path d="M640 330 l40 0 M660 352 l60 0 M720 322 l40 0" stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.5} />
  </Scene>
)

// 5. "Peter said, "Teacher, we worked hard all night, and we didn't catch anything. But because You say so, I will!""
// Looking under the water: Peter and Andrew let the empty net down over the side, down into the deep water, and
// Jesus watches, smiling (Luke 5:5).
const Page5 = () => {
  const s = 0.8
  const bx = 400, by = 262
  // (where their hands hold the ropes, in boat units, and so in the picture)
  const hands: Pt[] = [[-150, -70], [-50, -64]]
  const at = ([hx, hy]: Pt): Pt => [bx + hx * s, by + hy * s]
  const [a, b] = hands.map(at)
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sky tone="day" h={176} />
      <Sun x={700} y={66} s={0.56} />
      <Cloud x={190} y={54} s={0.7} />
      <FarHills tone="day" h={176} town={null} />
      <Lake tone="day" h={176} />
      <FishingBoat x={bx} y={by} s={s} still
        crew={<>
          <Tap say="Here goes!" sfx="pop">
            <Aboard x={-196} look={ANDREW} low={-12} reach={[reachTo(-196, 0.9, -168, -80, 'right', -12), reachTo(-196, 0.9, hands[0][0], hands[0][1], 'right', -12)]} blinkDelay={0.8} />
          </Tap>
          <Tap say="Because You say so, I will!" sfx="good">
            <Aboard x={-92} look={PETER} low={-12} reach={[reachTo(-92, 0.9, -66, -76, 'right', -12), reachTo(-92, 0.9, hands[1][0], hands[1][1], 'right', -12)]} blinkDelay={1.5} />
          </Tap>
          <Tap say="Thank you, Peter." sfx="sparkle">
            <Aboard x={150} look={JESUS} pose="hold" facing="left" low={-14} blinkDelay={0.4} />
          </Tap>
        </>}
      />
      <Underwater y={by}>
        <Tap say="Down, down, down it goes!" sfx="whoosh">
          <g>
            <Rope d={`M${a[0]} ${a[1]} Q${a[0] - 16} ${by + 40} 256 364`} w={3} />
            <Rope d={`M${b[0]} ${b[1]} Q${b[0] + 6} ${by + 40} 356 366`} w={3} />
            <NetBag x={306} y={366} w={108} depth={64} fill={0} />
          </g>
        </Tap>
      </Underwater>
    </Scene>
  )
}

// ---------- Part two (pages 6 to 10) ----------

// 6. "Peter let down the nets, just like Jesus said. Then, splash! So many fish! The nets were so full, they started to
// break."
// Under the water again: the net is packed with fish, so heavy that a few cords have broken and one fish is wriggling
// out. Peter and Andrew pull with all their might; fish leap and splash all round (Luke 5:6).
const Page6 = () => {
  const s = 0.76
  const bx = 420, by = 246
  const hands: Pt[] = [[-176, -86], [-66, -82]]
  const at = ([hx, hy]: Pt): Pt => [bx + hx * s, by + hy * s]
  const [a, b] = hands.map(at)
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sky tone="day" h={160} />
      <Sun x={706} y={60} s={0.52} />
      <FarHills tone="day" h={160} town={null} />
      <Lake tone="day" h={160} />
      <FishingBoat x={bx} y={by} s={s} still
        crew={<>
          <Aboard x={-206} look={ANDREW} mood="wow" low={-12} reach={[reachTo(-206, 0.9, -186, -100, 'right', -12), reachTo(-206, 0.9, hands[0][0], hands[0][1], 'right', -12)]} blinkDelay={0.8} />
          <Tap say="It's so heavy! Pull, Andrew, pull!" sfx="wobble">
            <Aboard x={-96} look={PETER} mood="joy" low={-12} reach={[reachTo(-96, 0.9, -78, -96, 'right', -12), reachTo(-96, 0.9, hands[1][0], hands[1][1], 'right', -12)]} />
          </Tap>
          <Tap say="Look at all the fish!" sfx="sparkle">
            <Aboard x={150} look={JESUS} pose="open" facing="left" low={-16} blinkDelay={0.4} />
          </Tap>
        </>}
      />
      <Underwater y={by}>
        <Rope d={`M${a[0]} ${a[1]} Q${a[0] - 10} ${by + 30} 212 318`} w={3.4} />
        <Rope d={`M${b[0]} ${b[1]} Q${b[0] + 10} ${by + 30} 432 318`} w={3.4} />
        <Tap say="So many fish! The net is breaking!" sfx="plop">
          <NetBag x={322} y={318} w={228} depth={100} many torn seed={11} />
        </Tap>
        {/* more fish, swimming in */}
        <Fishy x={606} y={330} s={0.62} flip color={FISH_COLORS[0]} wag />
        <Fishy x={664} y={372} s={0.55} flip color={FISH_COLORS[2]} wag delay={0.2} />
        <Fishy x={590} y={400} s={0.5} flip color={FISH_COLORS[1]} wag delay={0.35} />
        <Fishy x={84} y={350} s={0.55} color={FISH_COLORS[1]} wag delay={0.1} />
      </Underwater>
      {/* fish leaping out of the water, and splashing */}
      <Tap say="Splash! Splash!" sfx="plop">
        <g>
          <g className="sc-float"><Fishy x={668} y={170} s={0.6} rot={-30} color={FISH_COLORS[2]} /></g>
          <Splash x={644} y={by + 2} s={0.7} still />
          <g className="sc-float" style={{ animationDelay: '-1.2s' } as CSSProperties}><Fishy x={744} y={188} s={0.5} rot={25} color={FISH_COLORS[0]} /></g>
          <Splash x={760} y={by + 2} s={0.55} still />
          <g className="sc-float" style={{ animationDelay: '-0.6s' } as CSSProperties}><Fishy x={70} y={176} s={0.52} flip rot={20} color={FISH_COLORS[1]} /></g>
          <Splash x={88} y={by + 2} s={0.6} still />
        </g>
      </Tap>
    </Scene>
  )
}

// 7. "Peter waved to James and John in the other boat. "Come and help us!" Soon both boats were so full of fish, they
// sank down low in the water!"
// James and John have come alongside in Zebedee's boat (green band, yellow flag): both boats are heaped with fish and
// sit low, the lake lapping right up their sides (Luke 5:7). Peter waves; James and John wave back; Andrew cheers.
const Page7 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="day" h={200} />
    <Sun x={400} y={70} s={0.6} />
    <Cloud x={140} y={64} s={0.7} />
    <Cloud x={640} y={56} s={0.6} slow />
    <FarHills tone="day" h={200} town={null} />
    <Lake tone="day" h={200} />
    <FishingBoat x={208} y={380} s={0.64} heap={92}
      crew={<>
        <Aboard x={-196} look={JESUS} low={-30} blinkDelay={0.4} />
        <Tap say="So many fish!" sfx="plop">
          <Aboard x={-76} look={ANDREW} pose="arms-up" mood="joy" low={-50} />
        </Tap>
        <Tap say="James! John! Come and help us!" sfx="good">
          <Aboard x={140} look={PETER} pose="wave" low={-46} blinkDelay={1.2} />
        </Tap>
      </>}
    />
    <FishingBoat x={594} y={374} s={0.64} heap={92} band={ZEBEDEE_BOAT.band} flag={ZEBEDEE_BOAT.flag} facing="left"
      crew={<>
        <Tap say="We're coming, Peter!" sfx="good">
          <g>
            <Aboard x={130} look={JAMES} pose="wave" low={-46} blinkDelay={0.7} />
            <Aboard x={-70} look={JOHN} pose="arms-up" mood="joy" low={-50} blinkDelay={1.9} />
          </g>
        </Tap>
      </>}
    />
    {/* so full, they sit low in the water, with the lake right up their sides */}
    <Tap say="Whoa! The boats are so full!" sfx="plop">
      <g>
        <FrontWater tone="day" h={200} y={364} />
        <Splash x={402} y={364} s={0.5} still />
        <Splash x={46} y={362} s={0.42} still />
        <Splash x={760} y={360} s={0.42} still />
      </g>
    </Tap>
  </Scene>
)

// 8. "Peter knelt down in front of Jesus. He was so amazed! Jesus smiled and said, "Don't be afraid. Come, follow Me,
// and I will make you fishers of people.""
// Close up in Peter's boat, full of fish: Peter on his knees, amazed (Luke 5:8-10); Jesus, kind and smiling, reaches
// out to him. Andrew is amazed too. Light shines round Jesus (God is never drawn as a person).
const Page8 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="day" h={236} />
    <Cloud x={130} y={70} s={0.7} />
    <Cloud x={690} y={58} s={0.6} slow />
    <FarHills tone="day" h={236} town={160} />
    <Lake tone="day" h={236} />
    <Glow x={556} y={262} r={190} color="#fff5c4" />
    <FishingBoat x={420} y={446} s={1.02} heap={56}
      crew={<>
        <Tap say="So many fish! Wow!" sfx="pop">
          <Aboard x={-214} look={ANDREW} mood="wow" low={-36} blinkDelay={0.9} />
        </Tap>
        <Tap say="Jesus, You are so amazing!" sfx="good">
          <Aboard x={-56} look={PETER} kneel pose="pray" mood="wow" low={-36} />
        </Tap>
        <Tap say="Don't be afraid. Come, follow Me!" sfx="sparkle">
          <Aboard x={130} look={JESUS} pose="open" facing="left" low={-36} reach={[null, [58, -78]]} blinkDelay={0.3} />
        </Tap>
      </>}
    />
    <g pointerEvents="none"><Sparkles spots={[[560, 120, 10], [470, 168, 7], [660, 168, 8], [606, 92, 6], [420, 112, 6]]} /></g>
  </Scene>
)

// 9. "So they pulled their boats up onto the shore. They left everything, and they followed Jesus! James and John's
// dad, Zebedee, stayed in his boat with his helpers, and waved goodbye."
// The boats are up on the beach, still full of fish: they left everything. Zebedee and his two helpers wave from his
// boat; Jesus leads the way along the shore, and Peter, Andrew, James and John follow Him, their footprints behind.
const Page9 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="day" h={206} />
    <Sun x={700} y={70} s={0.58} />
    <Cloud x={420} y={58} s={0.7} />
    <FarHills tone="day" h={206} town={540} />
    <Lake tone="day" h={206} />
    <Beach edge="M-10 280 Q200 270 420 282 Q620 292 810 278" pebbles={[[30, 440], [440, 444], [780, 330]]} />
    <Tap say="Look! We left all the fish!" sfx="plop">
      <FishingBoat x={110} y={292} s={0.34} tilt={-2} still heap={60} />
    </Tap>
    <SandBank x={110} y={302} w={190} color="#ecd49c" />
    <FishingBoat x={300} y={342} s={0.54} tilt={1} still heap={30} band={ZEBEDEE_BOAT.band} flag={ZEBEDEE_BOAT.flag}
      crew={
        <Tap say="Goodbye, my boys! Follow Jesus!" sfx="good">
          <g>
            <Aboard x={-196} look={HELPERS[0]} pose="wave" low={-16} blinkDelay={0.6} />
            <Aboard x={150} look={HELPERS[1]} pose="arms-up" facing="left" low={-16} blinkDelay={1.6} />
            <Aboard x={-40} look={ZEBEDEE} pose="wave" low={-16} blinkDelay={1.1} />
          </g>
        </Tap>
      }
    />
    <SandBank x={300} y={358} w={300} />
    <Footprints a={[250, 392]} b={[420, 440]} n={8} />
    {/* Jesus leads the way, and His new friends follow Him */}
    <Tap say="We're coming, Jesus!" sfx="good">
      <g>
        <Figure x={470} y={438} s={0.76} look={PETER} pose="wave" facing="right" blinkDelay={1.3} />
        <Figure x={536} y={428} s={0.72} look={ANDREW} facing="right" blinkDelay={0.5} />
        <Figure x={600} y={440} s={0.74} look={JAMES} facing="right" blinkDelay={2.1} />
        <Figure x={662} y={430} s={0.7} look={JOHN} pose="wave" facing="right" blinkDelay={0.9} />
      </g>
    </Tap>
    <Tap say="Come, follow Me!" sfx="sparkle">
      <Figure x={738} y={436} s={0.82} look={JESUS} pose="point" facing="right" blinkDelay={0.2} />
    </Tap>
  </Scene>
)

// 10. "Fishers of people help everyone know how much God loves them. Jesus wants you to follow Him, too! And God loves
// you, every single day."
// By the lake: Jesus welcomes everyone, His four new friends bring people to meet Him, and you (the child playing)
// run to Jesus too. Hearts float up: God's love.
const Page10 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="day" h={236} />
    <Sun x={110} y={76} s={0.62} />
    <Cloud x={600} y={64} s={0.7} slow />
    <FarHills tone="day" h={236} town={520} />
    <Lake tone="day" h={236} />
    <path d="M-10 300 Q200 284 400 296 Q600 306 810 290 L810 460 L-10 460 Z" fill="#9cd38a" />
    <path d="M-10 360 Q220 340 420 356 Q620 368 810 352 L810 460 L-10 460 Z" fill="#86c574" />
    <Glow x={400} y={250} r={170} color="#fff5c4" />
    {/* Peter and Andrew bring a family to meet Jesus; James and John bring some children */}
    <Tap say="Come and meet Jesus! God loves you!" sfx="good">
      <g>
        <Folk x={52} y={392} s={0.86} i={5} />
        <Folk x={96} y={398} s={0.62} i={12} wave />
        <Figure x={168} y={400} s={0.82} look={PETER} pose="point" facing="right" blinkDelay={1.1} />
      </g>
    </Tap>
    <Figure x={252} y={388} s={0.78} look={ANDREW} pose="wave" facing="right" blinkDelay={0.4} />
    <Figure x={552} y={388} s={0.78} look={JOHN} pose="wave" facing="left" blinkDelay={1.8} />
    <Figure x={638} y={398} s={0.82} look={JAMES} pose="point" facing="left" blinkDelay={0.7} />
    <Folk x={710} y={400} s={0.64} i={7} wave />
    <Folk x={756} y={396} s={0.66} i={14} />
    <Tap say="Come, follow Me! I love you so much." sfx="sparkle">
      <Figure x={400} y={394} s={1.06} look={JESUS} pose="open" blinkDelay={0.3} />
    </Tap>
    <Tap say="I can follow Jesus, too!" sfx="fanfare">
      <Kid x={316} y={444} s={1.05} />
    </Tap>
    <Tap say="God loves you!" sfx="ding">
      <g>
        <Heart x={300} y={150} s={0.8} />
        <Heart x={500} y={128} s={1} color="#ffcf3f" />
        <Heart x={200} y={232} s={0.6} color="#ffcf3f" />
        <Heart x={612} y={222} s={0.65} />
      </g>
    </Tap>
  </Scene>
)

/** Part one is pages 1 to 5; part two (data/fishers.ts, `first: 5`) is pages 6 to 10. */
export const FISHERS_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10]
