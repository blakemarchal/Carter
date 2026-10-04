// Jesus Calms the Storm (Mark 4:35–41): one picture per story page, both parts in order (see data/storm.ts for the
// words): pages 1 to 5 are part one, pages 6 to 11 part two.
// A little fishing boat on the Lake of Galilee, a lake ringed with hills (not Jonah's big ship on the open sea), and
// the evening goes by from page to page: the afternoon by the lake (1), the golden evening (2), the sun going down as
// they sail off (3), dusk (4), dark clouds rolling over the hills (5), the storm (6 to 8), the glassy calm with the
// first stars and a new moon (9, 10), and night on the other side (11).
// The storm is exciting, never frightening: big round rolling waves and a whooshing wind, no lightning, nobody falls
// in, and faces are worried, never terrified. Jesus is PEOPLE.jesus; His friends are the four fishermen
// (PEOPLE.peter, andrew, james and john), as on Fishers of People. God is never drawn as a person: His presence is light.
// Props other islands could use are exported: FishingBoat (and BOAT, its shapes, for the paint game), Asleep
// (someone lying asleep on a cushion), Cushion, LittleBoat, Gulls, SwimmingGull, StormCloud, Swells, Wind, Splash,
// Crescent, and Folk (copied from Loaves & Fishes).
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Figure, Head, PEOPLE, type JHolding, type JLook, type JPose, type Mood } from '../people'
import { Cloud, Flower, Glow, Rays, Scene, Sparkles, Sun, Tap, Zs } from './kit'

const uidOf = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')
type Pt = [number, number]

// ---------- The lake as the evening goes by ----------

/** The light on the lake: the afternoon, the golden evening, sunset, dusk, the clouds coming, the storm, the calm after it, and night. */
export type Tone = 'day' | 'gold' | 'sunset' | 'dusk' | 'gloom' | 'storm' | 'calm' | 'night'

/** For each tone: the sky (top down), the far hills (the hazy range, then the nearer one), the water (from the horizon to the front), the grass, and the foam on the waves. */
export const TONES: Record<Tone, { sky: string[]; hills: [string, string]; water: [string, string, string]; land: string; foam: string }> = {
  day: { sky: ['#7fc8f8', '#bfe6ff', '#fff2d2'], hills: ['#a9cdb8', '#86bb84'], water: ['#a3dbf5', '#5aaee6', '#3f8fd0'], land: '#7cc46a', foam: '#ffffff' },
  gold: { sky: ['#86a8e8', '#f4c3b2', '#ffdc9a'], hills: ['#c4a6c2', '#97a87a'], water: ['#f1d2b2', '#7cabd8', '#4a82c0'], land: '#8db866', foam: '#fff6e0' },
  sunset: { sky: ['#6d6cc4', '#e597b4', '#ffb27a', '#ffd27e'], hills: ['#a083b6', '#7a659c'], water: ['#f4b89a', '#9a88c4', '#4c6cb4'], land: '#6f8f62', foam: '#ffe9d0' },
  dusk: { sky: ['#3c3e84', '#7867ae', '#d58cae', '#f2ad96'], hills: ['#6c5c9a', '#514780'], water: ['#c494b4', '#6c66a6', '#383f88'], land: '#4f6a5a', foam: '#f4e6f4' },
  gloom: { sky: ['#394069', '#61668f', '#a3849f', '#c99a96'], hills: ['#5c5884', '#46436c'], water: ['#8a83a8', '#516496', '#2c4b7c'], land: '#4a5a58', foam: '#eef0ff' },
  storm: { sky: ['#283350', '#435276', '#5f7096'], hills: ['#46516e', '#363f5a'], water: ['#4b6c8c', '#3f6f98', '#2a5a86'], land: '#3f4f50', foam: '#e8f6ff' },
  calm: { sky: ['#25296a', '#4b4796', '#9474bc', '#eea3b6'], hills: ['#574a8a', '#3d356e'], water: ['#e9a5b8', '#7d6ab2', '#2e3376'], land: '#3a4a5a', foam: '#ffffff' },
  night: { sky: ['#161a4a', '#2a2b74', '#4a4292'], hills: ['#3a3478', '#29265e'], water: ['#4a4592', '#302e76', '#1c2054'], land: '#3c5a4a', foam: '#ffffff' },
}

/** The sky, down to the horizon at h. */
function Sky({ tone, h }: { tone: Tone; h: number }) {
  const id = `sk${uidOf(useId())}`
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

/** The hills all round the lake, far away across the water: a hazy range, and a nearer one in front, along the horizon at h. */
function FarHills({ tone, h }: { tone: Tone; h: number }) {
  const [back, front] = TONES[tone].hills
  return (
    <g>
      <path d={`M0 ${h - 30} Q60 ${h - 58} 130 ${h - 42} Q200 ${h - 26} 262 ${h - 40} Q340 ${h - 72} 430 ${h - 46} Q490 ${h - 30} 548 ${h - 42} Q624 ${h - 64} 704 ${h - 40} Q760 ${h - 26} 800 ${h - 36} L800 ${h + 1} L0 ${h + 1} Z`} fill={back} />
      <path d={`M0 ${h - 12} Q86 ${h - 32} 176 ${h - 15} Q250 ${h - 2} 336 ${h - 17} Q420 ${h - 34} 506 ${h - 13} Q586 ${h - 1} 666 ${h - 18} Q742 ${h - 32} 800 ${h - 11} L800 ${h + 1} L0 ${h + 1} Z`} fill={front} />
    </g>
  )
}

/** Where the little waves are drawn on the lake: [x, how far below the horizon]. */
const WAVE_MARKS: Pt[] = [[70, 30], [250, 22], [460, 34], [660, 20], [140, 70], [380, 82], [600, 64], [740, 96], [60, 130], [300, 150], [520, 136], [700, 172]]

/** The lake, from the horizon at h down: little waves (`waves`), or none (`glass`, perfectly still). */
function Lake({ tone, h, waves = 'gentle' }: { tone: Tone; h: number; waves?: 'gentle' | 'choppy' | 'glass' }) {
  const id = `lk${uidOf(useId())}`
  const [top, mid, bottom] = TONES[tone].water
  const foam = TONES[tone].foam
  const deep = 450 - h
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} /><stop offset="0.4" stopColor={mid} /><stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={0} y={h} width={800} height={deep} fill={`url(#${id})`} />
      <path d={`M0 ${h + 1} L800 ${h + 1}`} stroke={lighten(top, 0.4)} strokeWidth={2} opacity={0.7} />
      {waves === 'glass' ? (
        // (still water: long, faint lines of light across it)
        [0.12, 0.3, 0.52, 0.78].map((t, i) => (
          <path key={i} d={`M${60 + i * 90} ${h + deep * t} l${180 - i * 20} 0`} stroke="#ffffff" strokeWidth={1.6 + t * 2} opacity={0.22} strokeLinecap="round" />
        ))
      ) : (
        WAVE_MARKS.filter(([, dy]) => dy < deep - 10).map(([x, dy], i) => {
          const k = 0.55 + (dy / deep) * 1.1
          const w = (waves === 'choppy' ? 34 : 26) * k
          return (
            <g key={i} className={`sc-wave ${i % 2 ? 'slow' : ''}`}>
              <path d={`M${x} ${h + dy} q${w / 2} ${-6 * k} ${w} 0`} stroke={foam} strokeWidth={2 + k} fill="none" strokeLinecap="round" opacity={0.7} />
              {waves === 'choppy' && <path d={`M${x + w * 0.35} ${h + dy - 2 * k} l${5 * k} ${-6 * k} l${5 * k} ${6 * k} Z`} fill={foam} opacity={0.8} />}
            </g>
          )
        })
      )}
    </g>
  )
}

/** The sun's (or the moon's) path of light on the water, from the horizon at h toward us, under it at x. */
function LightPath({ x, h, color = '#ffd77a', n = 5, opacity = 0.95 }: { x: number; h: number; color?: string; n?: number; opacity?: number }) {
  return (
    <g className="sc-wave slow" opacity={opacity}>
      {Array.from({ length: n }, (_, i) => {
        const y = h + 7 + i * i * 3.6 + i * 9
        const w = 30 + i * 14
        return <path key={i} d={`M${x - w / 2 + (i % 2 ? 7 : -5)} ${y} l${w} 0`} stroke={color} strokeWidth={3.5 + i * 0.7} strokeLinecap="round" opacity={1 - i * 0.06} />
      })}
    </g>
  )
}

/** The new moon: a thin crescent with a soft glow round it, (x, y) its middle. */
export function Crescent({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const id = `cr${uidOf(useId())}`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={id}><stop offset="0.25" stopColor="#fff3c0" stopOpacity={0.4} /><stop offset="1" stopColor="#fff3c0" stopOpacity={0} /></radialGradient>
      </defs>
      <circle r={70} fill={`url(#${id})`} />
      <path d="M-8 -30 A31 31 0 1 0 27 13 A25 25 0 0 1 -8 -30 Z" fill="#fff3b0" stroke="#e8d27a" strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  )
}

/** A small evening cloud, its underside lit pink by the last of the sunset. */
const PinkCloud = ({ x, y, s = 1, slow }: { x: number; y: number; s?: number; slow?: boolean }) => (
  <g className={`sc-cloud ${slow ? 'slow' : ''}`}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={62} ry={18} fill="#e9a6c4" opacity={0.75} />
      <ellipse cx={-24} cy={-10} rx={30} ry={16} fill="#c49ad0" opacity={0.75} />
      <ellipse cx={18} cy={-14} rx={34} ry={18} fill="#c49ad0" opacity={0.75} />
    </g>
  </g>
)

// ---------- The fishing boat ----------
// Boat units: (0, 0) is the middle of the waterline and the prow is on the right. At s = 1 the hull is 500 long and
// the mast stands 310 above the water. We see a little way down into the boat: its far rim, and the inside of its
// far side between the rims. People stand in it with their feet on its floor (y ≈ -6), hidden by its near side.

/** The boat's shapes (boat units), shared with the paint game. */
export const BOAT = {
  /** The near side of the hull: its rim high at the stern and the prow and low in the middle, and a round bottom. */
  hull: 'M-250 -64 Q-10 -10 246 -80 Q252 -26 210 18 Q0 44 -214 16 Q-254 -10 -250 -64 Z',
  /** The rim along the top of the near side. */
  rim: 'M-250 -64 Q-10 -10 246 -80',
  /** The blue band painted along the hull under the rim. */
  stripe: 'M-249 -58 Q-10 -4 245 -74 L242.5 -48 Q-10 22 -246.5 -32 Z',
  /** The far rim, and the inside of the boat between the two rims. */
  farRim: 'M-244 -80 Q-10 -38 240 -96',
  inside: 'M-244 -80 Q-10 -38 240 -96 L246 -80 Q-10 -10 -250 -64 Z',
  /** The square sail, full of wind (bellying out toward the prow), hanging from its yard. */
  sail: 'M-88 -270 L148 -284 Q174 -218 146 -152 Q32 -134 -80 -146 Q-102 -208 -88 -270 Z',
  /** The sail rolled up along its yard. */
  furled: 'M-94 -276 Q30 -298 154 -292 Q162 -282 152 -274 Q30 -266 -88 -260 Q-100 -266 -94 -276 Z',
}
export const BOAT_COLORS = { wood: '#b5794a', line: '#6f4322', rim: '#d9a066', inside: '#7d5030', plank: '#8f5a2e', stripe: '#3f8fb8', sail: '#ffe3a1', mast: '#7a5233', flag: '#e0604d' }
const MAST_X = 34

/**
 * The disciples' fishing boat: a wooden boat with a blue band along its side, a mast and a square sail (`sail`: full of
 * wind, or rolled up), and a little red flag. It rocks on the water, unless `still`. `crew` stand in it (boat units, feet on
 * the floor at y ≈ -6); `stern` is at the back, in front of them (someone asleep); `inside` is drawn in the bottom of the
 * boat before them (water sloshing in); `front` over everything (spray). `flag` is how hard the wind blows its flag (0 to 2).
 */
export function FishingBoat({ x, y, s = 1, tilt = 0, facing = 'right', sail = 'full', still, flag = 1, crew, stern, inside, front }: {
  x: number; y: number; s?: number; tilt?: number; facing?: 'left' | 'right'; sail?: 'full' | 'furled'; still?: boolean; flag?: number
  crew?: ReactNode; stern?: ReactNode; inside?: ReactNode; front?: ReactNode
}) {
  const uid = uidOf(useId())
  const C = BOAT_COLORS
  const wood = useShade(C.wood, 0.22, 0.22)
  const cloth = useShade(C.sail, 0.3, 0.12)
  // (the flag hangs down in still air, and streams out straight in a gale)
  const fl = 18 + flag * 14, droop = Math.max(0, 1 - flag) * 14
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
      {/* the mast, its stay to the prow, the flag, the yard and the sail */}
      <path d={`M${MAST_X} -300 L240 -90`} stroke="#8a6a4a" strokeWidth={2} />
      <path d={`M${MAST_X} -20 L${MAST_X} -312`} stroke={C.mast} strokeWidth={9} strokeLinecap="round" />
      <path d={`M${MAST_X} -311 Q${MAST_X + fl * 0.5} ${-312 + droop * 0.3} ${MAST_X + fl * 0.95} ${-302 + droop} Q${MAST_X + fl * 0.45} ${-299 + droop * 0.6} ${MAST_X} -293 Z`}
        fill={C.flag} stroke={ink(C.flag)} strokeWidth={2} strokeLinejoin="round" />
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
      {inside && <g clipPath={`url(#in${uid})`}>{inside}</g>}
      {crew}
      {stern}
      {/* the near side: the hull, its blue band and plank seams, and the rim */}
      <path d={BOAT.hull} fill={wood.fill} />
      <g clipPath={`url(#hl${uid})`}>
        <path d={BOAT.stripe} fill={C.stripe} />
        <path d="M-249 -55 Q-10 -1 245 -71" stroke={lighten(C.stripe, 0.3)} strokeWidth={2.5} fill="none" opacity={0.8} />
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

/** Someone standing in the boat (boat units): a Figure with their feet on its floor, so its near side hides their legs. `low` sits them lower (sitting down), or higher (less than 0: up on the stern). */
function Aboard({ x, look, s = 0.9, low = 0, ...rest }: {
  x: number; look: JLook; s?: number; low?: number; pose?: JPose; mood?: Mood; facing?: 'left' | 'right'; blinkDelay?: number
  holding?: JHolding; reach?: [Pt | null, Pt | null]; item?: ReactNode; children?: ReactNode
}) {
  return <Figure x={x} y={-6 + low} s={s} look={look} {...rest} />
}

/** Where a hand goes, in a Figure's own units, to reach the point (bx, by) in the boat: for a Figure standing at x (feet at -6 + low), s big. */
const reachTo = (fx: number, s: number, bx: number, by: number, facing: 'left' | 'right' = 'right', low = 0): Pt =>
  [((bx - fx) / s) * (facing === 'left' ? -1 : 1), (by - (-6 + low)) / s]

/** A finger held up to the lips ("Shh!"), drawn over a beardless Figure's face in its own units, with its hand at reach (5, -94). */
const Shh = ({ skin }: { skin: string }) => (
  <g strokeLinecap="round">
    <path d="M4.5 -96 L2.5 -105.5" stroke={ink(skin)} strokeWidth={6.4} />
    <path d="M4.5 -96 L2.5 -105.5" stroke={skin} strokeWidth={3.8} />
  </g>
)

/** A soft cushion: red, with a gold band and little gold tassels. (x, y) = its bottom middle; about 64 wide at s = 1. */
export const Cushion = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-31 0 Q-36 -12 -27 -21 Q0 -27 27 -21 Q36 -12 31 0 Q0 6 -31 0 Z" fill="#c8524a" stroke={ink('#c8524a')} strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M-29 -10 Q0 -15 29 -10" stroke="#f2c35a" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M-20 -19 Q0 -23 18 -19" stroke="#ffffff" strokeWidth={2.5} fill="none" opacity={0.35} strokeLinecap="round" />
    {[-31, 31].map((tx) => <circle key={tx} cx={tx} cy={-3} r={4} fill="#f2c35a" stroke="#b8862a" strokeWidth={1.5} />)}
  </g>
)

/**
 * Someone lying asleep on their back, their head on a cushion (Jesus at the back of the boat): (x, y) = the floor under
 * the cushion; they lie toward the right, about 150 long at s = 1. `mood` is their face ("asleep", unless said).
 */
export function Asleep({ x, y, s = 1, look, mood = 'asleep' }: { x: number; y: number; s?: number; look: JLook; mood?: Mood }) {
  const robe = useShade(look.robe, 0.25, 0.2)
  const line = ink(look.robe)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{robe.def}</defs>
      <Cushion x={-4} y={0} s={1.1} />
      {/* the body under the robe: the shoulders by the cushion, the knees a little up, the feet at the end */}
      <path d="M10 -4 C6 -30 26 -38 48 -35 Q72 -32 92 -40 Q108 -47 120 -35 L125 -7 Q70 2 10 -4 Z" fill={robe.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      {look.sash && <path d="M44 -35.5 L56 -35 L57 -2 L45 -2.5 Z" fill={look.sash} stroke={ink(look.sash)} strokeWidth={1.5} />}
      <path d="M78 -34 Q96 -42 110 -40" stroke={line} strokeWidth={1.6} fill="none" opacity={0.5} strokeLinecap="round" />
      {/* the near arm, resting on the chest */}
      <path d="M22 -26 Q36 -36 54 -34" stroke={line} strokeWidth={15} fill="none" strokeLinecap="round" />
      <path d="M22 -26 Q36 -36 54 -34" stroke={look.robe} strokeWidth={11.5} fill="none" strokeLinecap="round" />
      <circle cx={56} cy={-34} r={6.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />
      {/* sandals, toes up */}
      <ellipse cx={127} cy={-19} rx={5} ry={9.5} fill="#7a5233" transform="rotate(10 127 -19)" />
      <ellipse cx={122} cy={-10} rx={5} ry={9.5} fill="#8a6040" stroke="#5a3a20" strokeWidth={1} transform="rotate(10 122 -10)" />
      {/* the head on the cushion */}
      <g transform="translate(-4 -38) rotate(-72) translate(0 114)">
        <Head look={look} mood={mood} />
      </g>
    </g>
  )
}

// ---------- Weather, water and birds ----------

/** Puffs of a storm cloud: [x, y, r]. */
const PUFFS: [number, number, number][] = [[-104, 8, 38], [-56, -16, 50], [4, -30, 58], [64, -14, 48], [112, 8, 36], [-24, 14, 46], [48, 18, 40], [-84, 22, 30], [90, 24, 28]]

/** A big storm cloud, puffed up and rolling along: (x, y) is its middle; about 290 wide at s = 1. */
export function StormCloud({ x, y, s = 1, color = '#4a5578', slow }: { x: number; y: number; s?: number; color?: string; slow?: boolean }) {
  return (
    <g className={`sc-cloud ${slow ? 'slow' : ''}`}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <g fill={lighten(color, 0.2)}>{PUFFS.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy - 4} r={r} />)}</g>
        <g fill={color}>{PUFFS.map(([cx, cy, r], i) => <circle key={i} cx={cx + 2} cy={cy + 2} r={r - 2} />)}</g>
        <path d="M-136 20 Q-60 46 0 40 Q70 46 136 22 Q120 50 60 52 Q0 58 -60 52 Q-120 50 -136 20 Z" fill={darken(color, 0.18)} />
      </g>
    </g>
  )
}

/** A curl of wind, whooshing along (only swirls: the wind never has a face). `flip` blows it the other way. */
export const Wind = ({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) => (
  <g className="sc-cloud">
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} stroke="#ffffff" fill="none" strokeLinecap="round" opacity={0.85}>
      <path d="M0 0 Q52 -16 104 -4 Q138 4 140 -16 Q140 -34 122 -31 Q109 -28 115 -17" strokeWidth={5} />
      <path d="M26 22 Q84 12 152 24" strokeWidth={4} opacity={0.8} />
    </g>
  </g>
)

/**
 * Big rolling waves: a row of round swells from height y down, each `amp` high and `len` long, leaning a little the way
 * the wind blows (to the right), with a white cap of foam on its top. `shift` slides the row along. They roll gently to
 * and fro (`slow`: more slowly).
 */
export function Swells({ y, amp, len, color, foam = '#e8f6ff', shift = 0, slow }: {
  y: number; amp: number; len: number; color: string; foam?: string; shift?: number; slow?: boolean
}) {
  const n = Math.ceil(1000 / len) + 1
  const x0 = -100 + shift
  const L = len, A = amp
  let d = `M${x0} 470 L${x0} ${y}`
  for (let i = 0; i < n; i++) {
    const a = x0 + i * L
    d += ` C${a + L * 0.24} ${y} ${a + L * 0.36} ${y - A} ${a + L * 0.55} ${y - A} C${a + L * 0.68} ${y - A} ${a + L * 0.72} ${y - A * 0.3} ${a + L} ${y}`
  }
  d += ` L${x0 + n * L} 470 Z`
  const f = (v: number) => v.toFixed(1)
  return (
    <g className={`sc-wave ${slow ? 'slow' : ''}`}>
      <path d={d} fill={color} />
      <path d={d} fill="none" stroke={lighten(color, 0.28)} strokeWidth={3} opacity={0.7} />
      {Array.from({ length: n }, (_, i) => {
        const a = x0 + i * L
        // the cap: over the top of the crest, with three scallops hanging down under it
        const cap = `M${f(a + L * 0.38)} ${f(y - A * 0.78)} Q${f(a + L * 0.54)} ${f(y - A * 1.16)} ${f(a + L * 0.7)} ${f(y - A * 0.66)}`
          + ` Q${f(a + L * 0.66)} ${f(y - A * 0.52)} ${f(a + L * 0.61)} ${f(y - A * 0.72)}`
          + ` Q${f(a + L * 0.56)} ${f(y - A * 0.6)} ${f(a + L * 0.5)} ${f(y - A * 0.8)}`
          + ` Q${f(a + L * 0.45)} ${f(y - A * 0.64)} ${f(a + L * 0.38)} ${f(y - A * 0.78)} Z`
        return (
          <g key={i}>
            <path d={cap} fill={foam} />
            <circle cx={a + L * 0.76} cy={y - A * 0.56} r={A * 0.07} fill={foam} opacity={0.9} />
            <circle cx={a + L * 0.82} cy={y - A * 0.42} r={A * 0.05} fill={foam} opacity={0.75} />
            <path d={`M${f(a + L * 0.12)} ${f(y - A * 0.12)} Q${f(a + L * 0.24)} ${f(y - A * 0.36)} ${f(a + L * 0.34)} ${f(y - A * 0.62)}`} stroke={lighten(color, 0.35)} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
          </g>
        )
      })}
    </g>
  )
}

/** A splash of water: a crown of spray with drops flying up out of it. (x, y) = its foot; `rot` tips it. */
export function Splash({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-48 4 Q-38 -8 -36 -32 Q-28 -12 -18 -10 Q-14 -42 -2 -62 Q6 -34 10 -12 Q20 -16 28 -46 Q32 -14 50 4 Z" fill="#bfe6ff" stroke="#ffffff" strokeWidth={3.5} strokeLinejoin="round" />
      <g className="sc-float">
        {[[-44, -52, -30], [-16, -84, -10], [18, -78, 12], [46, -56, 32]].map(([cx, cy, a], i) => (
          <path key={i} d={`M${cx} ${cy - 9} Q${cx + 7} ${cy + 2} ${cx} ${cy + 5} Q${cx - 7} ${cy + 2} ${cx} ${cy - 9} Z`} transform={`rotate(${a} ${cx} ${cy})`} fill="#bfe6ff" stroke="#ffffff" strokeWidth={2.5} />
        ))}
      </g>
    </g>
  )
}

/** Water sloshing in the bottom of the boat (give it as a FishingBoat's `inside`). */
const Sloshing = () => (
  <g>
    <path d="M-250 -58 Q-180 -70 -110 -60 Q-40 -50 30 -60 Q110 -72 180 -70 Q220 -70 250 -86 L250 0 L-250 0 Z" fill="#6cbcf0" />
    <path d="M-230 -62 Q-180 -70 -120 -62 M-20 -56 Q30 -62 80 -64 M130 -70 Q170 -74 210 -74" stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.75} strokeLinecap="round" />
  </g>
)

/** Seagulls gliding far off: a white "m" of wings each, [x, y, size]. */
export const Gulls = ({ spots, color = '#ffffff' }: { spots: [number, number, number][]; color?: string }) => (
  <g className="sc-float">
    {spots.map(([x, y, k], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${k})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx={0} cy={-2} r={28} fill="transparent" stroke="none" />
        <path d="M-26 4 Q-14 -14 0 0 Q14 -14 26 4" stroke="#6a7590" strokeWidth={7.5} />
        <path d="M-26 4 Q-14 -14 0 0 Q14 -14 26 4" stroke={color} strokeWidth={3.8} />
      </g>
    ))}
  </g>
)

/**
 * A seagull floating on calm water, side-on, facing right (or `facing="left"`): a white head and body, a grey wing folded
 * along its side with black tips crossed over its tail, a yellow beak with a red spot. (x, y) = the waterline under it.
 */
export function SwimmingGull({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const line = '#a3aec0'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <ellipse cx={-4} cy={1} rx={46} ry={5} fill="none" stroke="#ffffff" strokeWidth={2} opacity={0.45} />
      {/* the black wing tips over the tail, with white spots */}
      <path d="M-28 -11 L-50 -16 L-43 -7 L-28 -3 Z" fill="#2f3040" stroke="#2f3040" strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={-43} cy={-12} r={1.7} fill="#ffffff" />
      {/* the body, floating */}
      <path d="M-36 -2 Q-34 -18 -8 -20 Q16 -22 24 -12 Q28 -4 22 0 Q-6 2 -36 -2 Z" fill="#ffffff" stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      {/* the neck and head */}
      <path d="M10 -16 Q12 -27 16 -31 L28 -28 Q26 -19 24 -12" fill="#ffffff" stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      <circle cx={21} cy={-32} r={9.5} fill="#ffffff" stroke={line} strokeWidth={2.2} />
      <path d="M12 -19 Q17 -22 24 -16" stroke="#ffffff" strokeWidth={5} fill="none" />
      {/* the grey wing, folded along its side */}
      <path d="M-32 -9 Q-20 -21 4 -18 Q14 -16 16 -11 Q0 -5 -26 -4 Z" fill="#c3ccda" stroke="#97a3b6" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-18 -12 Q-4 -15 6 -13" stroke="#ffffff" strokeWidth={1.4} fill="none" opacity={0.7} />
      {/* the yellow beak with its red spot, and a bright eye */}
      <path d="M29 -33.5 L43 -30.5 Q38 -26.5 29 -27.5 Z" fill="#ffc94a" stroke="#d99a1a" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={37} cy={-29} r={1.5} fill="#e0503a" />
      <circle cx={24} cy={-34} r={2.2} fill="#2b2140" />
      <circle cx={24.6} cy={-34.7} r={0.7} fill="#ffffff" />
    </g>
  )
}

/** One of the other little boats that sailed along, far off: a small hull and a three-cornered sail. (x, y) = its waterline. */
export function LittleBoat({ x, y, s = 1, sail = '#fff7e8', hull = '#a8714a', still }: { x: number; y: number; s?: number; sail?: string; hull?: string; still?: boolean }) {
  const body = (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -24 L0 -150" stroke="#6b4a2e" strokeWidth={6} />
      <path d="M4 -146 Q74 -96 4 -34 Z" fill={sail} stroke={ink(sail)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-4 -140 Q-50 -96 -4 -46 Z" fill={darken(sail, 0.06)} stroke={ink(sail)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-104 -26 Q0 -12 104 -30 Q100 6 76 16 Q0 26 -76 16 Q-100 6 -104 -26 Z" fill={hull} stroke={ink(hull)} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-100 -14 Q0 2 100 -18" stroke={lighten(hull, 0.3)} strokeWidth={3} fill="none" />
    </g>
  )
  return still ? body : <g className="sc-rock">{body}</g>
}

// ---------- People on the shore (Folk is copied from Loaves & Fishes) ----------

const SKINS = ['#d9a47a', '#c68b5e', '#f6d2b8', '#8d5a3b', '#e3b48c']
const ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
const HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24', '#e8e4dc']

/**
 * One small person in the crowd, front view, standing or sitting on the grass. `i` picks the colors. Standing, both arms
 * hang at the sides (with `wave`, the right one waves); sitting, the hands rest in the lap.
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

/** Rows of Folk sitting on the grass, back row first: [y, from x, to x, how many, size]. `seed` picks their colors; every `waveEvery`th one waves. */
function SittingCrowd({ rows, seed = 0, waveEvery = 7 }: { rows: [number, number, number, number, number][]; seed?: number; waveEvery?: number }) {
  let k = seed
  return (
    <g>
      {rows.map(([y, x0, x1, n, s], r) => Array.from({ length: n }, (_, j) => {
        const i = k++
        const step = n > 1 ? (x1 - x0) / (n - 1) : 0
        const x = x0 + j * step + Math.sin(i * 12.9898) * step * 0.18
        return <Folk key={`${r}-${j}`} x={x} y={y + Math.cos(i * 4.1) * 3 * s} s={s} i={i} sit wave={i % waveEvery === 3} />
      }))}
    </g>
  )
}

/** The near shore: a grassy slope on the left, coming down to a sandy beach along the water. */
function NearShore({ tone }: { tone: Tone }) {
  const grass = TONES[tone].land
  return (
    <g>
      <path d="M0 252 Q140 246 244 274 Q322 300 360 350 Q388 390 394 450 L0 450 Z" fill="#ecd29a" />
      <path d="M0 248 Q130 240 232 266 Q306 290 340 340 Q364 380 366 450 L0 450 Z" fill={grass} />
      <path d="M0 300 Q120 290 220 312 Q290 336 316 392 Q326 420 326 450 L0 450 Z" fill={darken(grass, 0.07)} />
      <path d="M248 276 Q330 304 368 360 M380 402 Q386 424 388 446" stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.55} strokeLinecap="round" />
    </g>
  )
}

const JESUS = PEOPLE.jesus
const { peter: PETER, andrew: ANDREW, james: JAMES, john: JOHN } = PEOPLE

// ---------- Part one: a boat ride with Jesus (pages 1 to 5) ----------

// 1. "One day, lots of people came to the big lake to hear Jesus. He sat in a boat near the shore, and He taught them
//    all about God's love."
// (Mark 4:1: the crowd on the shore, and Jesus sitting in a boat on the water to teach them.) The afternoon.
const Page1 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="day" h={236} />
    <Sun x={712} y={70} s={0.7} />
    <Cloud x={150} y={66} s={0.85} />
    <Cloud x={470} y={44} s={0.6} slow />
    <FarHills tone="day" h={236} />
    <Lake tone="day" h={236} />
    <NearShore tone="day" />
    <Flower x={350} y={444} color="#ffd34d" s={0.8} />
    {/* the crowd on the grass, listening, row behind row */}
    <SittingCrowd seed={3} rows={[[262, 8, 186, 9, 0.38], [280, 4, 250, 11, 0.45], [301, 6, 284, 11, 0.52], [325, 8, 308, 10, 0.6], [353, 10, 326, 9, 0.68], [386, 14, 336, 8, 0.77]]} />
    {[[30, 0], [96, 1], [230, 3], [296, 4]].map(([x, k]) => <Folk key={x} x={x} y={436 + (k % 2) * 4} s={0.86} i={40 + k * 3} sit />)}
    <Tap say="I love to hear about God!" sfx="good"><Folk x={163} y={440} s={0.88} i={31} sit wave /></Tap>
    <FishingBoat x={572} y={398} s={0.76} sail="furled"
      crew={<>
        <Tap say="This is my fishing boat!"><Aboard x={-176} look={PETER} blinkDelay={1.4} /></Tap>
        <Tap say="God loves every one of you!" sfx="sparkle"><Aboard x={-54} look={JESUS} s={1.04} pose="open" low={4} /></Tap>
        <Aboard x={150} look={ANDREW} blinkDelay={0.6} />
      </>}
    />
    <Tap say="Squawk!"><Gulls spots={[[560, 128, 0.8], [612, 106, 0.6]]} /></Tap>
  </Scene>
)

// 2. "When evening came, Jesus said to His friends, "Let's go over to the other side of the lake." So they got the boat
//    ready to go."
// The golden evening: the crowd goes home up the hill, waving. In the boat, Jesus points across the lake to the hills on
// the other side; Peter waves goodbye, Andrew and James are aboard, and John brings a cushion.
const Page2 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="gold" h={236} />
    <Sun x={742} y={210} s={0.78} />
    <FarHills tone="gold" h={236} />
    <Lake tone="gold" h={236} />
    <LightPath x={742} h={236} />
    <NearShore tone="gold" />
    {/* the crowd going home over the hill, waving goodbye */}
    <Tap say="Goodbye, Jesus! Thank You!">
      {[[22, 266, 0.5], [62, 262, 0.48], [104, 268, 0.52], [146, 276, 0.54], [190, 286, 0.56], [44, 300, 0.6], [100, 306, 0.62]].map(([x, y, s], i) => (
        <Folk key={i} x={x} y={y} s={s} i={i * 3 + 2} wave={i % 2 === 0} />
      ))}
    </Tap>
    <FishingBoat x={572} y={398} s={0.76} sail="furled"
      crew={<>
        <Tap say="Goodbye, everyone!" sfx="good"><Aboard x={-182} look={PETER} pose="wave" blinkDelay={1.1} /></Tap>
        <Tap say="Let's go over to the other side!" sfx="ding"><Aboard x={-96} look={JESUS} s={1.02} reach={[null, [58, -104]]} /></Tap>
        <Aboard x={100} look={ANDREW} blinkDelay={0.4} />
        <Aboard x={170} look={JAMES} blinkDelay={2.2} />
      </>}
    />
    <Tap say="Here's a soft cushion for Jesus.">
      <Figure x={300} y={432} s={0.92} look={JOHN} pose="hold" blinkDelay={1.7} item={<Cushion x={0} y={-49} s={0.72} />} />
    </Tap>
  </Scene>
)

// 3. "Off they sailed across the lake! The wind filled up the sail, and the boat went swish, swish over the water.
//    Other little boats sailed along with them."
// The sun going down behind the hills on the other side; three little boats sail along.
const Page3 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sky tone="sunset" h={250} />
    <Sun x={622} y={204} s={0.95} />
    <Cloud x={160} y={84} s={0.8} />
    <Cloud x={420} y={58} s={0.6} slow />
    <FarHills tone="sunset" h={250} />
    <Lake tone="sunset" h={250} />
    <LightPath x={622} h={250} />
    <Tap say="Hello, little boats!" sfx="good">
      <LittleBoat x={656} y={322} s={0.3} sail="#ffe8f0" />
      <LittleBoat x={752} y={294} s={0.22} sail="#e8f4ff" hull="#9a6a44" />
      <LittleBoat x={92} y={302} s={0.24} sail="#fff4d8" hull="#b07a50" />
    </Tap>
    <Tap say="Squawk! Squawk!"><Gulls spots={[[470, 120, 0.7], [520, 96, 0.55]]} /></Tap>
    <Tap say="Swish, swish! Off we go!" sfx="whoosh">
      <FishingBoat x={320} y={376} s={0.74} sail="full"
        crew={<>
          <Aboard x={-178} look={JESUS} s={0.95} low={8} />
          <Aboard x={-108} look={JOHN} pose="wave" blinkDelay={0.7} />
          <Aboard x={-30} look={PETER} reach={[null, reachTo(-30, 0.9, 30, -86)]} blinkDelay={1.6} />
          <Aboard x={104} look={ANDREW} blinkDelay={0.3} />
          <Aboard x={172} look={JAMES} pose="wave" blinkDelay={2.1} />
        </>}
      />
    </Tap>
  </Scene>
)

// 4. "Jesus was very tired after His long day. He lay down at the back of the boat, put His head on a cushion, and fell
//    fast asleep."
// Dusk, close up: Jesus asleep at the stern on the cushion; John says "Shh!"; Peter leans on the mast.
const Page4 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Sky tone="dusk" h={262} />
    <FarHills tone="dusk" h={262} />
    <Lake tone="dusk" h={262} />
    <FishingBoat x={400} y={392} s={1.04} sail="full"
      crew={<>
        <Tap say="Shh! Jesus is sleeping."><Aboard x={-74} look={JOHN} reach={[null, [5, -94]]} blinkDelay={0.9}><Shh skin={JOHN.skin} /></Aboard></Tap>
        <Tap say="What a long, busy day!"><Aboard x={-14} look={PETER} reach={[null, reachTo(-14, 0.9, 30, -86)]} blinkDelay={1.8} /></Tap>
        <Aboard x={110} look={ANDREW} blinkDelay={0.2} />
        <Aboard x={176} look={JAMES} blinkDelay={2.4} />
      </>}
      stern={
        <Tap say="Jesus is fast asleep.">
          <Asleep x={-206} y={-58} s={0.84} look={JESUS} />
          <Zs x={-200} y={-122} s={1.3} dir={-1} />
        </Tap>
      }
    />
  </Scene>
)

// 5. "The boat sailed on and on. Then dark clouds rolled over the hills, and the wind began to blow. Whoosh! But Jesus was
//    still fast asleep."
// The clouds come over the hills on the left, and the friends look up at them. Jesus sleeps on.
const Page5 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Sky tone="gloom" h={262} />
    <Tap say="Here come the dark clouds." sfx="wobble">
      <StormCloud x={40} y={130} s={1} color="#454b72" slow />
      <StormCloud x={190} y={186} s={1.1} color="#4c5279" />
      <StormCloud x={330} y={208} s={0.7} color="#535a82" slow />
    </Tap>
    <FarHills tone="gloom" h={262} />
    <Lake tone="gloom" h={262} waves="choppy" />
    <Tap say="Whoosh!" sfx="whoosh">
      <Wind x={60} y={60} s={0.7} />
      <Wind x={620} y={170} s={0.65} />
      <Wind x={40} y={290} s={0.6} />
    </Tap>
    <Gulls spots={[[690, 86, 0.9]]} />
    <FishingBoat x={430} y={388} s={0.98} sail="full" tilt={-3} flag={1.6}
      crew={<>
        <Tap say="Look at the sky!" sfx="ding"><Aboard x={-70} look={JOHN} mood="wow" facing="left" reach={[null, [50, -140]]} blinkDelay={0.9} /></Tap>
        <Aboard x={-14} look={PETER} mood="sad" reach={[null, reachTo(-14, 0.9, 30, -86)]} blinkDelay={1.8} />
        <Aboard x={110} look={ANDREW} mood="wow" blinkDelay={0.2} />
        <Aboard x={176} look={JAMES} mood="sad" blinkDelay={2.4} />
      </>}
      stern={
        <Tap say="Jesus is still asleep.">
          <Asleep x={-206} y={-58} s={0.84} look={JESUS} />
          <Zs x={-200} y={-122} s={1.3} dir={-1} />
        </Tap>
      }
    />
  </Scene>
)

// ---------- Part two: Jesus calms the storm (pages 6 to 11) ----------

/** The stormy sky: dark clouds rolling right across it (behind the hills' tops). */
const StormSky = ({ h }: { h: number }) => (
  <g>
    <Sky tone="storm" h={h} />
    <StormCloud x={110} y={64} s={1.25} color="#3e4868" />
    <StormCloud x={430} y={40} s={1.35} color="#46506f" slow />
    <StormCloud x={730} y={70} s={1.15} color="#3e4868" />
  </g>
)

// 6. "Remember the dark clouds? Soon a big storm came! The wind blew and blew, and big waves splashed into the boat. The
//    boat began to fill up with water. But Jesus was still asleep!"
// Big rolling waves (round and friendly), water splashing in; the friends hold on and scoop the water out. Jesus sleeps.
const Page6 = () => (
  <Scene sky="storm" ground="none" clouds={false}>
    <StormSky h={238} />
    <FarHills tone="storm" h={238} />
    <Lake tone="storm" h={238} waves="choppy" />
    <Swells y={300} amp={30} len={170} color="#467aa8" shift={-40} slow />
    <Swells y={352} amp={58} len={250} color="#3a6d9e" shift={10} />
    <Wind x={30} y={180} s={0.8} />
    <Wind x={590} y={150} s={0.7} />
    <FishingBoat x={392} y={366} s={0.92} sail="furled" tilt={-9} flag={2}
      inside={<Sloshing />}
      crew={<>
        <Tap say="Scoop the water out!" sfx="plop"><Aboard x={-60} look={ANDREW} mood="sad" holding="jar" blinkDelay={0.3} /></Tap>
        <Tap say="Hold on tight!" sfx="wobble"><Aboard x={-4} look={PETER} mood="sad" reach={[null, reachTo(-4, 0.9, 30, -112)]} blinkDelay={1.2} /></Tap>
        <Aboard x={100} look={JOHN} mood="sad" reach={[[-30, -48], [30, -48]]} blinkDelay={0.8} />
        <Aboard x={178} look={JAMES} mood="sad" reach={[null, reachTo(178, 0.9, 236, -84)]} blinkDelay={2} />
      </>}
      stern={
        <Tap say="Jesus is still asleep!">
          <Asleep x={-206} y={-58} s={0.84} look={JESUS} />
          <Zs x={-200} y={-122} s={1.3} dir={-1} />
        </Tap>
      }
      front={<Tap say="Splash! Splash!" sfx="plop">
        <Splash x={250} y={-66} s={1.05} rot={18} />
        <Splash x={40} y={-34} s={0.6} rot={-6} />
      </Tap>}
    />
    <Swells y={446} amp={66} len={280} color="#2d5f92" shift={-110} slow />
  </Scene>
)

// 7. "The friends were scared. They woke Jesus up and said, "Teacher, don't You care? We're sinking!""
// Closer: Jesus sits up, awake; Peter has a hand on His shoulder, John points at the water in the boat.
const Page7 = () => (
  <Scene sky="storm" ground="none" clouds={false}>
    <StormSky h={226} />
    <FarHills tone="storm" h={226} />
    <Lake tone="storm" h={226} waves="choppy" />
    <Swells y={290} amp={34} len={200} color="#467aa8" shift={-70} slow />
    <Wind x={610} y={150} s={0.7} />
    <FishingBoat x={460} y={380} s={1.12} sail="furled" tilt={-5} flag={2}
      inside={<Sloshing />}
      crew={<>
        <Tap say="Teacher, wake up! Help us!" sfx="wobble">
          <Aboard x={-104} look={PETER} mood="sad" facing="left" reach={[null, reachTo(-104, 0.9, -156, -88, 'left')]} blinkDelay={1.2} />
        </Tap>
        <Tap say="Look at all the water!" sfx="plop"><Aboard x={-30} look={JOHN} mood="sad" facing="left" reach={[null, [40, -50]]} blinkDelay={0.5} /></Tap>
        <Aboard x={96} look={ANDREW} mood="sad" holding="jar" blinkDelay={0.3} />
        <Aboard x={180} look={JAMES} mood="sad" reach={[null, reachTo(180, 0.9, 236, -84)]} blinkDelay={2} />
      </>}
      stern={
        <Tap say="I'm awake. I am here." sfx="sparkle">
          <Cushion x={-222} y={-56} s={1} />
          <Aboard x={-176} look={JESUS} s={0.98} low={2} />
        </Tap>
      }
      front={<>
        <Splash x={250} y={-70} s={0.9} rot={16} />
        <Splash x={10} y={-34} s={0.55} rot={-8} />
      </>}
    />
    <Swells y={452} amp={60} len={280} color="#2d5f92" shift={-150} slow />
  </Scene>
)

// 8. "Jesus stood up. He said to the wind and the waves, "Peace! Be still!""
// Jesus stands tall at the back of the boat, His arms held out over the wind and the waves. Right over Him the clouds
// open, and soft light shines down.
const Page8 = () => (
  <Scene sky="storm" ground="none" clouds={false}>
    <Sky tone="storm" h={244} />
    {/* where the clouds are opening: the evening sky, and light */}
    <ellipse cx={250} cy={96} rx={160} ry={92} fill="#7d6ab8" />
    <ellipse cx={250} cy={112} rx={116} ry={62} fill="#b493cf" />
    <Rays x={250} y={104} r={400} n={14} color="#fff3c0" opacity={0.35} />
    <Glow x={250} y={112} r={150} color="#fff3c0" />
    <Sparkles spots={[[200, 70, 6], [290, 58, 5], [320, 100, 4]]} />
    <StormCloud x={0} y={86} s={1.2} color="#3e4868" />
    <StormCloud x={560} y={62} s={1.4} color="#46506f" slow />
    <StormCloud x={760} y={120} s={1.1} color="#3e4868" />
    <StormCloud x={250} y={-34} s={1.2} color="#424c6c" />
    <FarHills tone="storm" h={244} />
    <Lake tone="storm" h={244} waves="choppy" />
    <Swells y={306} amp={32} len={200} color="#467aa8" shift={30} slow />
    <Swells y={360} amp={44} len={250} color="#3a6d9e" shift={-30} />
    <FishingBoat x={440} y={376} s={0.98} sail="furled" tilt={-2} flag={1.2}
      crew={<>
        <Tap say="Peace! Be still!" sfx="sparkle">
          <Aboard x={-150} look={JESUS} s={1} low={-22} reach={[[-60, -100], [62, -108]]} />
        </Tap>
        <Tap say="Wow! Look at Jesus!" sfx="ding"><Aboard x={-40} look={JOHN} mood="wow" facing="left" blinkDelay={0.5} /></Tap>
        <Aboard x={70} look={PETER} mood="wow" facing="left" reach={[reachTo(70, 0.9, 34, -110, 'left'), null]} blinkDelay={1.2} />
        <Aboard x={140} look={ANDREW} mood="wow" facing="left" blinkDelay={0.3} />
        <Aboard x={200} look={JAMES} mood="wow" facing="left" blinkDelay={2} />
      </>}
    />
    <Swells y={448} amp={50} len={280} color="#2d5f92" shift={-90} slow />
  </Scene>
)

/** Things shining in still water: `children` turned upside down about the waterline at y. */
const Mirrored = ({ y, opacity = 0.3, children }: { y: number; opacity?: number; children: ReactNode }) => (
  <g opacity={opacity} transform={`translate(0 ${2 * y}) scale(1 -1)`}>{children}</g>
)

// 9. "Right away, the wind stopped, and the waves went still. Everything was calm and quiet. The first little stars came
//    out to twinkle."
// The calm: glassy water, the evening sky, the first stars and a new moon; the hills and the boat shine in the water.
const Page9 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Sky tone="calm" h={250} />
    <Tap say="Twinkle, twinkle, little stars!" sfx="sparkle">
      <Sparkles spots={[[90, 60, 7], [200, 34, 5], [300, 90, 6], [470, 40, 7], [540, 110, 5], [740, 56, 6], [150, 140, 4], [760, 150, 4]]} color="#fff8d0" />
    </Tap>
    <Tap say="Good evening, moon!" sfx="ding"><Crescent x={700} y={84} /></Tap>
    <PinkCloud x={120} y={196} s={0.7} />
    <PinkCloud x={430} y={176} s={0.5} slow />
    <FarHills tone="calm" h={250} />
    <Lake tone="calm" h={250} waves="glass" />
    {/* the hills, the moon and the boat shining in the still water */}
    <Mirrored y={250.5} opacity={0.35}><FarHills tone="calm" h={250} /></Mirrored>
    <LightPath x={700} h={250} color="#fff3b0" n={5} opacity={0.6} />
    <Mirrored y={352}><FishingBoat x={400} y={352} s={0.84} sail="furled" still flag={0} /></Mirrored>
    <Tap say="Wow! It's so calm and quiet now." sfx="good">
      <FishingBoat x={400} y={352} s={0.84} sail="furled" still flag={0}
        crew={<>
          <Aboard x={-160} look={JESUS} />
          <Aboard x={-80} look={JOHN} mood="wow" pose="arms-up" blinkDelay={0.5} />
          <Aboard x={-14} look={PETER} mood="wow" reach={[[-14, -136], [14, -136]]} blinkDelay={1.2} />
          <Aboard x={104} look={ANDREW} mood="wow" reach={[null, [44, -146]]} blinkDelay={0.3} />
          <Aboard x={176} look={JAMES} mood="wow" blinkDelay={2} />
        </>}
      />
    </Tap>
    <Tap say="Ahh. Nice and calm." sfx="swish"><SwimmingGull x={150} y={404} s={1.15} /></Tap>
  </Scene>
)

// 10. "Jesus asked them gently, "Why were you so afraid? Do you still not trust Me?" His friends were amazed. "Who is
//     this? Even the wind and the waves obey Him!""
// Closer, on the still water under the stars: Jesus speaks gently; His friends look at Him, amazed.
const Page10 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Sky tone="calm" h={276} />
    <Sparkles spots={[[80, 50, 6], [190, 90, 5], [300, 36, 6], [430, 70, 5], [520, 30, 5], [760, 120, 6], [40, 150, 4]]} color="#fff8d0" />
    <Crescent x={680} y={70} s={0.9} />
    <FarHills tone="calm" h={276} />
    <Lake tone="calm" h={276} waves="glass" />
    <FishingBoat x={392} y={420} s={1.24} sail="furled" still flag={0}
      crew={<>
        <Tap say="You can always trust Me." sfx="sparkle"><Aboard x={-160} look={JESUS} pose="open" /></Tap>
        <Tap say="Who is this? Even the wind and the waves obey Him!" sfx="ding">
          <Aboard x={-86} look={PETER} mood="wow" facing="left" blinkDelay={1.2} />
        </Tap>
        <Aboard x={-18} look={JOHN} mood="wow" facing="left" pose="pray" blinkDelay={0.5} />
        <Tap say="Wow!" sfx="good"><Aboard x={104} look={ANDREW} mood="wow" facing="left" pose="arms-up" blinkDelay={0.3} /></Tap>
        <Aboard x={176} look={JAMES} mood="wow" facing="left" blinkDelay={2} />
      </>}
    />
  </Scene>
)

// 11. "They all sailed safely to the other side. Who is Jesus? He is God's own Son! When we are scared, Jesus is with us,
//     and He takes care of us."
// Night on the other side: the boat pulled up on the beach under the moon and stars. Peter pulls it in by its rope, John
// jumps for joy, James waves from the boat with Andrew beside him, and Jesus stands on the sand with His arms open wide.
const Page11 = () => (
  <Scene sky="night" ground="none" clouds={false}>
    <Sky tone="night" h={236} />
    <Sparkles spots={[[60, 40, 6], [150, 90, 5], [250, 30, 6], [350, 70, 5], [450, 36, 7], [560, 84, 5], [760, 110, 4], [500, 150, 4], [120, 170, 4]]} color="#fff8d0" />
    <Crescent x={690} y={70} s={0.9} />
    <FarHills tone="night" h={236} />
    <Lake tone="night" h={236} waves="glass" />
    <LightPath x={690} h={236} color="#fff3b0" n={4} opacity={0.6} />
    {/* the other side: a beach, with a grassy hill behind it */}
    <path d="M300 450 Q360 372 470 344 Q600 318 800 316 L800 450 Z" fill="#d9c08a" />
    <path d="M470 346 Q600 290 800 260 L800 318 Q600 318 470 346 Z" fill={TONES.night.land} />
    <path d="M330 420 Q380 372 470 348" stroke="#fff6dc" strokeWidth={3} fill="none" opacity={0.4} strokeLinecap="round" />
    {/* pebbles and a shell on the sand, and footprints up from the water */}
    {[[560, 440, 7], [584, 446, 5], [770, 436, 6], [452, 434, 5], [690, 352, 4]].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.62} fill="#b8a48a" stroke="#8f7c64" strokeWidth={1.5} />
    ))}
    <path d="M748 452 q0 -16 10 -18 q10 2 10 18 Z" fill="#f6d6d0" stroke="#c99a90" strokeWidth={1.5} />
    {[[452, 404], [472, 392], [478, 418], [500, 408]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx={5} ry={3} fill="#c4a874" opacity={0.7} transform={`rotate(-22 ${x} ${y})`} />
    ))}
    <FishingBoat x={250} y={392} s={0.72} sail="furled" still flag={0}
      crew={<>
        <Tap say="Hooray! We're here!" sfx="good"><Aboard x={20} look={JAMES} pose="wave" blinkDelay={2} /></Tap>
        <Aboard x={130} look={ANDREW} blinkDelay={0.3} />
      </>}
    />
    {/* Peter pulls the boat up the beach by its rope */}
    <path d="M436 300 Q470 330 498 344" stroke="#c9a46a" strokeWidth={3} fill="none" />
    <Tap say="Pull the boat up onto the sand!" sfx="pop"><Figure x={512} y={404} s={0.86} look={PETER} facing="left" reach={[null, [16, -66]]} blinkDelay={1.2} /></Tap>
    <Tap say="We made it! Safe and sound!" sfx="good"><Figure x={732} y={402} s={0.86} look={JOHN} pose="arms-up" blinkDelay={0.5} /></Tap>
    <Tap say="I am always with you." sfx="sparkle">
      <Glow x={622} y={318} r={96} color="#fff3c0" />
      <Figure x={622} y={420} s={1} look={JESUS} pose="open" />
    </Tap>
  </Scene>
)

/** Part one is pages 1 to 5; part two (data/storm.ts, `first: 5`) is pages 6 to 11. */
export const STORM_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]
