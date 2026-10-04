// Easter Morning (Matthew 26–28, Luke 22–24, John 19–20): one picture per story page, both parts in order (see
// data/easter.ts for the words): pages 1 to 5 are part one, pages 6 to 11 part two.
// The most delicate island in the game: a five-year-old must come away joyful, never frightened.
//   - Part one: Jesus' special supper with His friends (1, 2) in the upper room, lamplit in the evening; then the
//     cross, told in the gentlest way (3): the friends' sad faces close together, and only a small, empty cross on a
//     far hill at sunset. Never Jesus on it, no nails, no soldiers, no crown of thorns. Kind friends roll the big round
//     stone across the door of the tomb in the garden as the sun goes down (4), with the flowers closed for the night;
//     then the friends at home, sad, by one little lamp, with a star shining in the window (5).
//   - Part two is light and joy: Sunday at dawn, the women walk to the garden with sweet spices (6); the stone is
//     rolled away and a shining angel sits on it (7); the tomb is empty, full of morning light (8); they run to tell
//     Peter and John (9); Jesus says "Mary!" in the garden, with every flower open (10); and Jesus with His friends,
//     all of them overjoyed (11).
// Jesus is PEOPLE.jesus, at the supper and after He is risen; the angel is PEOPLE.angel; His friends are the four
// fishermen (PEOPLE.peter, andrew, james and john), Thomas and Matthew. New here (exported, for people.tsx later):
// MARY_MAGDALENE (not Jesus' mother, PEOPLE.mary), her friends SPICE_FRIENDS, the kind friends at the tomb
// (JOSEPH_OF_ARIMATHEA and NICODEMUS), THOMAS and MATTHEW. God is never drawn as a person: His presence is light.
// The garden tomb (Tomb, with its RoundStone) is drawn here for the story and for the paint game (games/easter.tsx).
import { useId, type ComponentType, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Figure, PEOPLE, Person, SKIN, type JLook, type JPose, type Look, type Mood, type Pose } from '../people'
import { FlatBread, HalfBread } from '../items/isl-easter'
import { Birds, Emoji, Glow, Heart, Rays, Scene, Sparkles, Tap, ThoughtBubble } from './kit'

const uidOf = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')
type Pt = [number, number]

// ---------- The people ----------

/** Mary Magdalene, one of Jesus' friends (not His mother Mary, PEOPLE.mary): a cream head scarf and a rose-red robe with a golden sash. */
export const MARY_MAGDALENE: JLook = { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#f6ead2', robe: '#cc4f72', sash: '#f0c24a' }
/**
 * The friends who came with Mary Magdalene on Sunday morning with sweet spices (Mark 16:1): Mary the mother of James
 * ("the other Mary", Matthew 28:1), in a lavender scarf and a purple robe, and Salome, in a sea-green scarf and gold.
 */
export const SPICE_FRIENDS: JLook[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#cdbbe8', robe: '#7d64b4', sash: '#f0d38a' },
  { skin: SKIN.deep, hair: 'covered', hairColor: '#2b1f18', wrap: '#86cdb2', robe: '#e0a03c', sash: '#2f8f86' },
]
/** Joseph of Arimathea, the kind rich man who laid Jesus in his own new tomb (Matthew 27:57–60): a fine green robe and a cream head cloth. */
export const JOSEPH_OF_ARIMATHEA: JLook = { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#efe4cc', beard: 'short', beardColor: '#5a3a24', robe: '#3f7f6a', sash: '#e8c25a' }
/** Nicodemus, who came with him (John 19:39): old, with a long white beard, a blue head cloth and a brown robe. */
export const NICODEMUS: JLook = { skin: SKIN.tan, hair: 'covered', hairColor: '#d8d2c8', wrap: '#9fb3d8', beard: 'long', beardColor: '#ece8e0', robe: '#8a6a4a', sash: '#c0504d' }
/** Thomas, one of Jesus' twelve friends: a short black beard and a sea-green robe. */
export const THOMAS: JLook = { skin: SKIN.tan, hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#4fa39a', sash: '#f0d38a' }
/** Matthew, one of Jesus' twelve friends: a cream head cloth and a plum robe. */
export const MATTHEW: JLook = { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#f0e2c0', beard: 'short', beardColor: '#5a3a24', robe: '#9a5a8a', sash: '#e8dcc0' }
/** The angel at the tomb: the game's angel, its light drawn round it on the page (so it isn't cut off where it sits). */
const ANGEL: Look = { ...PEOPLE.angel, glow: false }

/** What a Figure is given, besides where it is. */
type Fig = { look: JLook; pose?: JPose; mood?: Mood; reach?: [Pt | null, Pt | null]; item?: ReactNode; facing?: 'left' | 'right'; blinkDelay?: number; children?: ReactNode }

/**
 * Someone sitting on the floor behind the low table: a Figure set down as people.tsx's Sitting sets a Person (the
 * table, drawn after, hides them from the waist down). (x, y): the floor under them.
 */
function AtTable({ x, y = 446, s = 1.42, ...fig }: { x: number; y?: number; s?: number } & Fig) {
  const id = `at${uidOf(useId())}`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={id}><rect x={-150} y={-300} width={300} height={284} /></clipPath></defs>
      <g clipPath={`url(#${id})`}><Figure x={0} y={22} {...fig} /></g>
    </g>
  )
}

/** Someone sitting cross-legged on the floor, facing us, as people.tsx's Sitting draws them, but a Figure (so they can look sad). (x, y): the floor under them. */
function SitOnFloor({ x, y, s = 1, ...fig }: { x: number; y: number; s?: number } & Fig) {
  const id = `sf${uidOf(useId())}`
  const robe = useShade(fig.look.robe, 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{robe.def}<clipPath id={id}><rect x={-150} y={-300} width={300} height={284} /></clipPath></defs>
      <ellipse cx={0} cy={-2} rx={50} ry={6} fill="#000" opacity={0.12} />
      <ellipse cx={-30} cy={-5} rx={8} ry={4.5} fill="#7a5233" />
      <ellipse cx={30} cy={-5} rx={8} ry={4.5} fill="#7a5233" />
      <path d="M-48 -9 Q-52 -27 -30 -29 Q0 -32 30 -29 Q52 -27 48 -9 Q40 -2 26 -6 Q0 -2 -26 -6 Q-40 -2 -48 -9 Z" fill={robe.fill} stroke={ink(fig.look.robe)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-34 -12 Q-14 -22 6 -16" stroke={ink(fig.look.robe)} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.55} />
      <g clipPath={`url(#${id})`}><Figure x={0} y={22} {...fig} /></g>
    </g>
  )
}

/** A hand resting on someone's shoulder, in front of them (for an arm drawn round behind them): a Figure's hand, its middle at (x, y), for a Figure `s` big. */
function HandOn({ x, y, s = 1, skin }: { x: number; y: number; s?: number; skin: string }) {
  const shade = useShade(skin, 0.25, 0.12)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{shade.def}</defs>
      <circle r={7} fill={shade.fill} stroke={ink(skin)} strokeWidth={2} />
    </g>
  )
}

/** In a Figure's own units (give as its children): a little tear on the cheek, under a sad face. */
const Tear = () => (
  <g>
    <path d="M-12.5 -107.5 Q-15.6 -101.5 -12.5 -99.4 Q-9.4 -101.5 -12.5 -107.5 Z" fill="#9ad6ff" stroke="#4a9ad8" strokeWidth={1.1} />
    <circle cx={-13.3} cy={-102} r={0.9} fill="#fff" />
  </g>
)

/** A little jar of sweet spices, held in front in both hands (a Figure's `item`, with pose "hold"): alabaster, clay or blue. */
function SpiceJar({ color = '#f3ecdf' }: { color?: string }) {
  const line = ink(color)
  return (
    <g strokeLinejoin="round">
      <path d="M-5.5 -80 L5.5 -80 L5 -75 Q11.5 -71 11.5 -62 Q11.5 -51 0 -49 Q-11.5 -51 -11.5 -62 Q-11.5 -71 -5 -75 Z" fill={color} stroke={line} strokeWidth={2} />
      <path d="M-10.5 -64 Q0 -60 10.5 -64" stroke={darken(color, 0.18)} strokeWidth={2} fill="none" />
      <ellipse cx={0} cy={-80.5} rx={6.5} ry={2.4} fill={darken(color, 0.25)} stroke={line} strokeWidth={1.6} />
      <ellipse cx={-5} cy={-68} rx={2} ry={4} fill="#fff" opacity={0.45} />
    </g>
  )
}

/** A clay cup, as at the supper (in a Figure's hand, or on the table): (x, y) is the middle of its foot. */
function Cup({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <path d="M-11 -24 L11 -24 Q11 -10 4 -6 L4 -2 L8 0 L-8 0 L-4 -2 L-4 -6 Q-11 -10 -11 -24 Z" fill="#c9784a" stroke="#7a4226" strokeWidth={2} />
      <ellipse cx={0} cy={-24} rx={11} ry={3} fill="#7a3a52" stroke="#7a4226" strokeWidth={1.6} />
      <path d="M-7 -20 Q-6 -13 -2 -9" stroke="#f0b48a" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  )
}

/** A clay jug (on the supper table). (x, y): the middle of its foot. */
function Jug({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <path d="M12 -34 Q26 -32 22 -16 L14 -12" stroke="#8a4a2a" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M-8 0 L-12 -20 Q-14 -32 -6 -36 L-6 -44 L6 -44 L6 -36 Q14 -32 12 -20 L8 0 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={2.4} />
      <path d="M-11 -22 Q0 -18 11 -22" stroke="#f2c08a" strokeWidth={2.6} fill="none" />
      <ellipse cx={0} cy={-44} rx={7} ry={2.4} fill="#6a3a1a" />
    </g>
  )
}

/** A bowl of grapes and olives (on the supper table). (x, y): the middle of its foot. */
function FruitBowl({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      {[[-12, -14], [-4, -18], [4, -15], [-8, -22], [2, -23], [11, -17]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={5.2} fill={i % 3 === 2 ? '#7a8a3a' : '#8a4f9a'} stroke={i % 3 === 2 ? '#4a5a1a' : '#4f2a5a'} strokeWidth={1.4} />)}
      <path d="M-22 -12 L22 -12 Q20 2 0 2 Q-20 2 -22 -12 Z" fill="#e8d4b0" stroke="#a8875a" strokeWidth={2} />
      <path d="M-18 -8 Q0 -4 18 -8" stroke="#c9a86a" strokeWidth={1.6} fill="none" />
    </g>
  )
}

/** A small clay oil lamp with its flame and a warm glow. (x, y): the middle of its foot. */
function OilLamp({ x, y, s = 1, glow = 70 }: { x: number; y: number; s?: number; glow?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 && <Glow x={4} y={-16} r={glow} color="#ffe2a0" />}
      <path d="M-16 -6 Q0 6 16 -6 L20 -12 L-16 -12 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2} strokeLinejoin="round" />
      <path d="M16 -11 L24 -16" stroke="#8a5428" strokeWidth={3.4} strokeLinecap="round" />
      <path className="pa-twinkle" d="M24 -16 Q18 -27 24 -36 Q30 -27 24 -16 Z" fill="#ffd34d" stroke="#f0a020" strokeWidth={1.4} />
      <path d="M24 -19 Q22 -24 24 -28 Q26 -24 24 -19 Z" fill="#fff7c9" />
    </g>
  )
}

// ---------- The upper room (pages 1, 2, 5 and 11) ----------

/**
 * The upper room where Jesus ate the special supper with His friends (Luke 22:12): plastered walls under a beamed
 * ceiling, an arched window on the left, two lamps glowing in their niches on the right, and a woven rug on the floor.
 * `night`: dark, with the moon and the stars in the window and only one lamp lit.
 */
function UpperRoom({ night }: { night?: boolean }) {
  const id = uidOf(useId())
  const wall = night ? ['#6f6890', '#857aa0'] : ['#f3dfba', '#e8c995']
  const floor = night ? '#7d6a78' : '#c99a64'
  return (
    <g>
      <defs>
        <linearGradient id={`wl${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wall[0]} /><stop offset="1" stopColor={wall[1]} /></linearGradient>
        <linearGradient id={`sk${id}`} x1="0" y1="0" x2="0" y2="1">
          {night
            ? <><stop offset="0" stopColor="#1c1d52" /><stop offset="1" stopColor="#3d3a8a" /></>
            : <><stop offset="0" stopColor="#6b5bb5" /><stop offset="0.6" stopColor="#e597b4" /><stop offset="1" stopColor="#ffc890" /></>}
        </linearGradient>
      </defs>
      <rect width={800} height={340} fill={`url(#wl${id})`} />
      {/* a painted band round the walls */}
      <rect y={246} width={800} height={12} fill={night ? '#5a6a9a' : '#4f8fc0'} />
      {Array.from({ length: 27 }, (_, i) => <circle key={i} cx={14 + i * 30} cy={252} r={2.4} fill={night ? '#c9b36a' : '#f2c24a'} />)}
      {/* the beams of the ceiling */}
      <rect width={800} height={20} fill={night ? '#3f3048' : '#8a5a34'} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 100 + 14} y={14} width={22} height={14} rx={3} fill={night ? '#4f3d58' : '#a0703f'} stroke={night ? '#2f2238' : '#6b4422'} strokeWidth={2} />)}
      {/* the arched window, with the evening (or the night) outside: the rooftops of Jerusalem */}
      <path d="M62 236 L62 128 Q62 66 126 66 Q190 66 190 128 L190 236 Z" fill={`url(#sk${id})`} />
      {night ? (
        <g>
          <path d="M150 104 A15 15 0 1 0 166 122 A12 12 0 0 1 150 104 Z" fill="#fff3b0" />
          <Sparkles spots={[[96, 112, 7], [118, 92, 3], [82, 150, 3], [170, 160, 3]]} color="#fff8d0" />
        </g>
      ) : (
        <circle cx={150} cy={200} r={16} fill="#ffe08a" opacity={0.9} />
      )}
      <path d="M62 236 L62 204 L80 204 L80 192 L104 192 L104 210 L128 210 L128 186 L136 180 L144 186 L144 206 L170 206 L170 196 L190 196 L190 236 Z" fill={night ? '#2a2a5e' : '#8a6fa8'} />
      <path d="M62 236 L62 128 Q62 66 126 66 Q190 66 190 128 L190 236 Z" fill="none" stroke={night ? '#4a3d5a' : '#b08a5a'} strokeWidth={8} />
      <path d="M54 240 L198 240" stroke={night ? '#4a3d5a' : '#9a7448'} strokeWidth={8} strokeLinecap="round" />
      <path d="M126 70 L126 236 M64 150 L188 150" stroke={night ? '#4a3d5a' : '#b08a5a'} strokeWidth={4} />
      {/* the lamps in their niches */}
      {[640, 740].map((nx, i) => (
        <g key={nx}>
          <path d={`M${nx - 30} 220 L${nx - 30} 168 Q${nx - 30} 138 ${nx} 138 Q${nx + 30} 138 ${nx + 30} 168 L${nx + 30} 220 Z`} fill={night ? '#4d4668' : '#e2c48e'} stroke={night ? '#3a3350' : '#b8956a'} strokeWidth={3} />
          {(!night || i === 0) && <OilLamp x={nx - 4} y={216} s={0.9} glow={night ? 90 : 60} />}
        </g>
      ))}
      {/* the floor, and the rug */}
      <rect y={330} width={800} height={120} fill={floor} />
      <path d="M0 330 L800 330" stroke={night ? '#5a4a5a' : '#a87a48'} strokeWidth={4} />
      <path d="M40 450 L110 360 L690 360 L760 450 Z" fill={night ? '#7a4a5a' : '#c0504d'} stroke={night ? '#5a3040' : '#8a3434'} strokeWidth={3} strokeLinejoin="round" />
      <path d="M72 446 L128 372 L672 372 L728 446 Z" fill="none" stroke={night ? '#b8a06a' : '#f2c24a'} strokeWidth={3} strokeDasharray="10 8" />
    </g>
  )
}

/**
 * The long low table, with a cloth hanging to the floor in front (it hides whoever sits behind it from the waist
 * down): its top runs from `top` (the back edge) down to its front edge, and the cloth from there to `bottom`.
 * `w` wide, its middle at x. `children` are set on it (in scene units).
 */
function SupperTable({ x = 400, top = 396, bottom = 456, w = 660, children }: { x?: number; top?: number; bottom?: number; w?: number; children?: ReactNode }) {
  const cloth = useShade('#f6ecd6', 0.3, 0.12)
  const l = x - w / 2, r = x + w / 2, front = top + 16
  return (
    <g strokeLinejoin="round">
      <defs>{cloth.def}</defs>
      {/* the top, a little from above */}
      <path d={`M${l + 12} ${top} L${r - 12} ${top} L${r} ${front} L${l} ${front} Z`} fill="#b07a46" stroke="#6b4422" strokeWidth={3} />
      <path d={`M${l + 22} ${top + 5} L${r - 22} ${top + 5}`} stroke="#c99a64" strokeWidth={2} opacity={0.7} />
      {/* the cloth down the front, with a red edge, a woven band and a fringe */}
      <path d={`M${l - 4} ${front - 2} L${r + 4} ${front - 2} L${r + 2} ${bottom} L${l - 2} ${bottom} Z`} fill={cloth.fill} stroke="#b8a07a" strokeWidth={3} />
      <path d={`M${l} ${front + 7} L${r} ${front + 7}`} stroke="#c0504d" strokeWidth={4} />
      <rect x={l - 2} y={front + 18} width={w + 4} height={11} fill="#4f8fc0" />
      <path d={`M${l} ${front + 23.5} ${Array.from({ length: Math.floor(w / 20) }, () => 'l10 -4 l10 4').join(' ')}`} stroke="#f2c24a" strokeWidth={2.2} fill="none" />
      {children}
    </g>
  )
}

/** Things on the table for the supper (its back edge at `top`): round flat bread, a jug and a bowl of fruit, and a cup at each place. */
function TableThings({ top = 396, bread = true, cups, bowl = 170, jug = 632 }: { top?: number; bread?: boolean; cups: number[]; bowl?: number; jug?: number }) {
  const y = top + 12
  return (
    <g>
      {bread && <FlatBread x={262} y={y - 2} r={24} />}
      {bread && <FlatBread x={540} y={y - 3} r={22} />}
      <FruitBowl x={bowl} y={y + 2} s={1.05} />
      <Jug x={jug} y={y + 2} s={0.95} />
      {cups.map((cx) => <Cup key={cx} x={cx} y={y + 3} s={0.82} />)}
    </g>
  )
}

// ---------- The land (pages 3, 4, 6 to 10) ----------

/** The light, from sunset on Friday to Sunday morning: the sky (top down), the far hills, the nearer land, and the grass. */
type Tone = 'sunset' | 'evening' | 'dawn' | 'morning'
const TONES: Record<Tone, { sky: string[]; far: string; mid: string; grass: string; front: string; path: string }> = {
  sunset: { sky: ['#5f5aa8', '#a985c0', '#f2a0ac', '#ffc28a'], far: '#a48ac4', mid: '#8a86b4', grass: '#8aa86e', front: '#71955e', path: '#e0c49a' },
  evening: { sky: ['#7d74c4', '#cf98bc', '#ffb8a0', '#ffd8a0'], far: '#b39ccc', mid: '#9db08a', grass: '#8cb46e', front: '#72a25e', path: '#e8cfa2' },
  dawn: { sky: ['#5f73c0', '#a99bd4', '#f6b6c4', '#ffdca8'], far: '#a99ccf', mid: '#93b48e', grass: '#86bf6e', front: '#6aab5e', path: '#ecd6ac' },
  morning: { sky: ['#86c8f4', '#c4e6fa', '#fff1cc'], far: '#bdb6dc', mid: '#a6cf8e', grass: '#7cc46a', front: '#5fb35a', path: '#f0dcb0' },
}

function Sky({ tone, h = 450 }: { tone: Tone; h?: number }) {
  const id = `sk${uidOf(useId())}`
  const stops = TONES[tone].sky
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}</linearGradient>
      </defs>
      <rect width={800} height={h} fill={`url(#${id})`} />
    </g>
  )
}

/** The sun on the horizon at (x, y): half risen (or half set), with a soft glow. */
function LowSun({ x, y, r = 34, color = '#ffd96a' }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <g>
      <Glow x={x} y={y} r={r * 3.2} color="#fff0b8" />
      <circle cx={x} cy={y} r={r} fill={color} stroke={darken(color, 0.12)} strokeWidth={2} />
    </g>
  )
}

/** Jerusalem far away: flat-roofed houses behind its wall and towers, and God's house shining, all in the hazy color `tint`. (x, y): the foot of its wall in the middle. */
function FarCity({ x, y, s = 1, tint }: { x: number; y: number; s?: number; tint: string }) {
  const light = lighten(tint, 0.28), lighter = lighten(tint, 0.55), dark = darken(tint, 0.08), win = darken(tint, 0.22)
  const houses: [number, number, number][] = [[-86, -38, 24], [-60, -48, 22], [-36, -40, 26], [40, -46, 22], [64, -36, 26], [-6, -30, 50]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {houses.map(([hx, top, w], i) => (
        <g key={i}>
          <rect x={hx} y={top} width={w} height={-top} fill={light} />
          <rect x={hx - 2} y={top - 3} width={w + 4} height={4} fill={lighter} />
          <rect x={hx + w / 2 - 3} y={top + 8} width={6} height={6} fill={win} />
        </g>
      ))}
      {/* God's house, catching the light */}
      <rect x={-12} y={-74} width={44} height={52} fill={lighter} />
      <rect x={-17} y={-80} width={54} height={7} rx={1.5} fill="#f6e2a4" />
      {[-4, 8, 20].map((cx) => <rect key={cx} x={cx} y={-64} width={4} height={30} fill={light} />)}
      {/* the wall and its towers */}
      <rect x={-100} y={-22} width={200} height={22} fill={dark} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-99 + i * 14.4} y={-27} width={7} height={6} fill={dark} />)}
      {[-100, -34, 34, 100].map((tx) => (
        <g key={tx}>
          <rect x={tx - 9} y={-36} width={18} height={36} fill={dark} />
          <rect x={tx - 11} y={-40} width={22} height={5} fill={dark} />
          <rect x={tx - 2.5} y={-28} width={5} height={8} rx={2.5} fill={win} />
        </g>
      ))}
    </g>
  )
}

/** The far hills along the horizon at h, in the tone's hazy color. */
function FarHills({ tone, h }: { tone: Tone; h: number }) {
  const { far } = TONES[tone]
  return <path d={`M0 ${h - 24} Q90 ${h - 50} 190 ${h - 32} Q290 ${h - 14} 380 ${h - 38} Q470 ${h - 62} 570 ${h - 36} Q660 ${h - 16} 740 ${h - 34} Q780 ${h - 42} 800 ${h - 38} L800 ${h + 4} L0 ${h + 4} Z`} fill={far} />
}

/** The garden's grass, rolling from y down: a farther band (`mid`), then the near grass, with tufts. */
function Lawn({ tone, y, flat }: { tone: Tone; y: number; flat?: boolean }) {
  const { mid, grass, front } = TONES[tone]
  return (
    <g>
      <path d={`M0 ${y} Q200 ${y - 18} 400 ${y - 4} T800 ${y - 8} L800 450 L0 450 Z`} fill={mid} />
      <path d={flat ? `M0 ${y + 30} L800 ${y + 30} L800 450 L0 450 Z` : `M0 ${y + 34} Q220 ${y + 14} 430 ${y + 32} T800 ${y + 22} L800 450 L0 450 Z`} fill={grass} />
      <path d={`M0 ${y + 92} Q200 ${y + 76} 420 ${y + 90} T800 ${y + 84} L800 450 L0 450 Z`} fill={front} opacity={0.55} />
      {[[60, y + 70], [180, y + 110], [330, y + 66], [470, y + 120], [610, y + 76], [740, y + 112], [270, y + 140], [540, y + 150]].map(([tx, ty], i) => (
        <path key={i} d={`M${tx - 6} ${ty} l3 -9 l3 9 l3 -11 l3 11`} stroke={darken(grass, 0.18)} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </g>
  )
}

/** An olive tree: a twisted grey trunk and a silvery green crown. (x, y): the foot of its trunk. */
export function OliveTree({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const leaf = useShade('#93b47c', 0.3, 0.2)
  const line = ink('#93b47c')
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs>{leaf.def}</defs>
      <ellipse cx={0} cy={0} rx={46} ry={6} fill="#000" opacity={0.1} />
      <path d="M-14 0 C-18 -18 -4 -30 -10 -50 C-14 -62 -24 -70 -30 -84 L-22 -88 C-14 -76 -4 -70 0 -62 C4 -74 12 -82 22 -90 L28 -84 C18 -74 12 -62 12 -48 C12 -32 20 -16 16 0 Z" fill="#8f7a64" stroke="#5f4a3a" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-6 -10 Q0 -24 -4 -40 M6 -20 Q8 -34 6 -46" stroke="#6f5a48" strokeWidth={2} fill="none" strokeLinecap="round" />
      <g className="sc-sway">
        {[[-38, -98, 34, 24], [0, -116, 42, 28], [38, -100, 34, 24], [-18, -86, 30, 18], [20, -84, 30, 18]].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={leaf.fill} stroke={line} strokeWidth={2.6} />
        ))}
        {[[-48, -100], [-30, -108], [-8, -124], [12, -120], [30, -110], [46, -98], [-20, -92], [4, -100], [24, -90], [-36, -88]].map(([lx, ly], i) => (
          <path key={i} d={`M${lx - 4} ${ly} q4 -4 8 0`} stroke="#e4eed8" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.75} />
        ))}
      </g>
    </g>
  )
}

/** A spring flower (an anemone): a stem with two leaves, and a flower of six petals, open (or a closed bud, `bud`). (x, y): the foot of its stem. */
function Bloom({ x, y, s = 1, color = '#ff6f8a', bud }: { x: number; y: number; s?: number; color?: string; bud?: boolean }) {
  const line = ink(color)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 Q-2 -16 0 -30" stroke="#4f9a4a" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M0 -8 Q-12 -14 -14 -4 Q-6 -2 0 -8 Z M0 -14 Q12 -22 14 -12 Q6 -8 0 -14 Z" fill="#6cbf5f" stroke="#3f8a4a" strokeWidth={1.4} strokeLinejoin="round" />
      {bud ? (
        <path d="M0 -28 Q-8 -36 -4 -46 Q0 -50 0 -50 Q0 -50 4 -46 Q8 -36 0 -28 Z" fill={color} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
      ) : (
        <g>
          {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx={0} cy={-46} rx={6.4} ry={9.5} fill={color} stroke={line} strokeWidth={1.5} transform={`rotate(${a} 0 -36)`} />)}
          <circle cx={0} cy={-36} r={5.2} fill="#3b2a4a" />
          <circle cx={-1.6} cy={-37.6} r={1.6} fill="#fff" opacity={0.6} />
        </g>
      )}
    </g>
  )
}

/** A bed of spring flowers along the ground: [x, y, color, size] each; `buds`: all closed for the night. */
function Flowers({ spots, buds }: { spots: [number, number, string, number?][]; buds?: boolean }) {
  return <>{spots.map(([fx, fy, c, k = 1], i) => <Bloom key={i} x={fx} y={fy} s={k} color={c} bud={buds} />)}</>
}

// ---------- The garden tomb, and its big round stone ----------

/** The tomb's rock (limestone), the round stone's grey, and the warm light inside once it's empty. */
export const TOMB_COLORS = { rock: '#d6cab6', stone: '#b9b0a2', inside: ['#fff8dc', '#f3d494'] as const }
/** The tomb's shapes, in its own units: (0, 0) is the middle of the doorway's foot. */
export const TOMB = {
  /** The rock it's cut into, a big rounded crag. */
  rock: 'M-200 0 C-208 -66 -192 -146 -132 -194 C-84 -232 -2 -242 70 -226 C150 -208 198 -136 206 -62 C208 -36 206 -16 202 0 Z',
  /** The doorway, with a rounded top. */
  door: 'M-44 0 L-44 -80 A44 44 0 0 1 44 -80 L44 0 Z',
  /** The carved frame round the doorway. */
  frame: 'M-58 0 L-58 -80 A58 58 0 0 1 58 -80 L58 0 Z',
  /** The groove in front, where the stone rolls. */
  groove: 'M-82 0 L240 0 L236 12 L-78 12 Z',
  /** Tufts of grass growing along the top of the rock. */
  tufts: [[-108, -205], [-40, -226], [36, -230], [124, -199]].map(([x, y]) => `M${x - 9} ${y} l3 -10 l3 10 l3 -14 l3 14 l3 -9 l3 9`).join(' '),
}
/** The round stone's size, and where its middle is: across the door (0), or rolled away to the right (1). */
export const STONE_R = 68
export const stoneX = (open: number) => open * 160

/**
 * The big round stone that closed the tomb (Mark 16:4): a thick disc standing on its edge, its rim showing on one side.
 * (x, y): its middle; r its size.
 */
export function RoundStone({ x, y, r = STONE_R }: { x: number; y: number; r?: number }) {
  const shade = useShade(TOMB_COLORS.stone, 0.35, 0.22)
  const line = ink(TOMB_COLORS.stone)
  const k = r / STONE_R
  return (
    <g>
      <defs>{shade.def}</defs>
      <circle cx={x + 9 * k} cy={y + 1} r={r} fill={darken(TOMB_COLORS.stone, 0.22)} stroke={line} strokeWidth={3} />
      <circle cx={x} cy={y} r={r} fill={shade.fill} stroke={line} strokeWidth={3} />
      <circle cx={x} cy={y} r={r * 0.7} fill="none" stroke={line} strokeWidth={2} opacity={0.3} />
      <path d={`M${x - r * 0.72} ${y - r * 0.3} A${r * 0.78} ${r * 0.78} 0 0 1 ${x - r * 0.12} ${y - r * 0.78}`} stroke="#fff" strokeWidth={4 * k} fill="none" strokeLinecap="round" opacity={0.5} />
      {[[0.3, 0.25, 5], [-0.35, 0.4, 4], [0.45, -0.3, 3.5], [-0.1, -0.45, 3]].map(([dx, dy, rr], i) => <ellipse key={i} cx={x + dx * r} cy={y + dy * r} rx={rr * k} ry={rr * 0.7 * k} fill={line} opacity={0.18} />)}
      <path d={`M${x + r * 0.2} ${y + r * 0.55} l${6 * k} ${-8 * k} l${4 * k} ${3 * k}`} stroke={line} strokeWidth={1.6} fill="none" opacity={0.4} strokeLinecap="round" />
    </g>
  )
}

/**
 * Inside the empty tomb, through its doorway (tomb units, clipped to the door): warm morning light, the stone shelf
 * along the side where Jesus had lain, and the linen cloths lying folded on it (John 20:6–7). Nobody is there.
 */
export function EmptyInside() {
  const id = uidOf(useId())
  return (
    <g>
      <defs>
        <linearGradient id={`in${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={TOMB_COLORS.inside[0]} /><stop offset="1" stopColor={TOMB_COLORS.inside[1]} /></linearGradient>
        <clipPath id={`dc${id}`}><path d={TOMB.door} /></clipPath>
      </defs>
      <path d={TOMB.door} fill={`url(#in${id})`} />
      <g clipPath={`url(#dc${id})`}>
        {/* the back wall's corner, and the stone shelf along the side */}
        <path d="M-44 -100 L-22 -88 L-22 -12 L-44 0 Z" fill="#ecd096" />
        <path d="M-22 -88 L-22 -12" stroke="#d6b06a" strokeWidth={1.4} />
        <path d="M-12 -36 L46 -36 L46 -31 L-6 -31 Z" fill="#f7e6bc" stroke="#b8904e" strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M-6 -31 L46 -31 L46 -12 L-6 -12 Z" fill="#e2c07a" stroke="#b8904e" strokeWidth={1.6} strokeLinejoin="round" />
        {/* the linen cloths, folded: the long one, and the cloth for His head, rolled up by itself (John 20:7) */}
        <rect x={6} y={-46} width={32} height={10} rx={4} fill="#ffffff" stroke="#b9a888" strokeWidth={1.6} />
        <path d="M10 -41 L34 -41" stroke="#ddd2bc" strokeWidth={1.4} />
        <ellipse cx={-3} cy={-41} rx={6.5} ry={5} fill="#ffffff" stroke="#b9a888" strokeWidth={1.6} />
        <path d="M-6.5 -41 Q-3 -44 0.5 -41" stroke="#ddd2bc" strokeWidth={1.2} fill="none" />
        {/* light pouring in from the door, across the floor */}
        <path d="M-44 0 L44 0 L30 -10 L-30 -10 Z" fill="#fffbe8" opacity={0.7} />
      </g>
    </g>
  )
}

/**
 * The garden tomb: a doorway cut into a big rock, with grass and plants on top, and the big round stone in its groove,
 * across the door (`open` 0) or rolled away to the right (`open` 1). Once the stone is away, the doorway is full of
 * morning light (EmptyInside) and light spills out (`shine`). (x, y): the middle of the doorway's foot.
 */
export function Tomb({ x, y, s = 1, open = 0, shine = open > 0.5, ivy = true }: { x: number; y: number; s?: number; open?: number; shine?: boolean; ivy?: boolean }) {
  const rock = useShade(TOMB_COLORS.rock, 0.3, 0.22)
  const line = ink(TOMB_COLORS.rock)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <defs>{rock.def}</defs>
      <ellipse cx={0} cy={2} rx={230} ry={10} fill="#000" opacity={0.1} />
      <path d={TOMB.rock} fill={rock.fill} stroke={line} strokeWidth={3.5} />
      {/* ledges and cracks in the rock, and light on its top */}
      <path d="M-150 -150 Q-90 -196 -10 -204 M60 -196 Q120 -180 160 -130" stroke="#fff" strokeWidth={5} opacity={0.35} fill="none" strokeLinecap="round" />
      <path d="M-170 -60 q24 -8 44 2 M120 -96 q22 -6 40 4 M-110 -160 q16 -10 30 -6 M140 -40 l14 -10 l8 6" stroke={line} strokeWidth={2} opacity={0.4} fill="none" strokeLinecap="round" />
      {/* grass and little plants growing on top, and ivy hanging down */}
      <path d={TOMB.tufts} stroke="#5fae55" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {ivy && (
        <g>
          <path d="M-160 -150 Q-170 -120 -162 -96 M-150 -156 Q-152 -136 -146 -120" stroke="#5f9a4f" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          {[[-166, -126], [-160, -106], [-150, -132], [-147, -124]].map(([lx, ly], i) => <ellipse key={i} cx={lx} cy={ly} rx={5} ry={3.4} fill="#6cbf5f" stroke="#3f8a4a" strokeWidth={1.2} transform={`rotate(${i * 40} ${lx} ${ly})`} />)}
        </g>
      )}
      {/* the doorway in its carved frame, and the groove for the stone */}
      <path d={TOMB.frame} fill={darken(TOMB_COLORS.rock, 0.1)} stroke={line} strokeWidth={2.5} />
      {open > 0.05 ? <EmptyInside /> : <path d={TOMB.door} fill="#6a5a50" />}
      <path d={TOMB.door} fill="none" stroke={line} strokeWidth={3} />
      <path d={TOMB.groove} fill={darken(TOMB_COLORS.rock, 0.2)} stroke={line} strokeWidth={2.5} />
      {shine && <Glow x={0} y={-50} r={110} color="#fff4c8" />}
      <RoundStone x={stoneX(open)} y={-STONE_R + 6} />
    </g>
  )
}

/**
 * The shining angel sitting on top of the stone (Matthew 28:2), as people.tsx's SittingOnRock sits someone on a rock:
 * the Person from the waist up, its white robe over its knees, and its shins and sandals hanging down over the
 * stone's front. (x, y): where it sits, on top of the stone.
 */
function AngelOnStone({ x, y, s = 1, pose = 'wave', facing = 'left', blinkDelay = 0 }: { x: number; y: number; s?: number; pose?: Pose; facing?: 'left' | 'right'; blinkDelay?: number }) {
  const id = `an${uidOf(useId())}`
  const robe = useShade('#ffffff', 0.3, 0.12)
  const skin = ANGEL.skin
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{robe.def}<clipPath id={id}><rect x={-160} y={-300} width={320} height={304} /></clipPath></defs>
      {/* shins and sandals, hanging down a little apart */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M${d * 13} 12 L${d * 14} 38`} stroke={ink(skin)} strokeWidth={12} strokeLinecap="round" />
          <path d={`M${d * 13} 12 L${d * 14} 38`} stroke={skin} strokeWidth={9} strokeLinecap="round" />
          <ellipse cx={d * 15} cy={43} rx={10} ry={5} fill="#c99a5a" stroke="#8a6a3a" strokeWidth={1.5} />
        </g>
      ))}
      <g clipPath={`url(#${id})`}><Person x={0} y={44} look={ANGEL} pose={pose} facing={facing} blinkDelay={blinkDelay} /></g>
      {/* the lap: the white robe over the knees, hanging to the middle of the shins */}
      <path d="M-28 -1 Q0 6 28 -1 Q34 2 34 8 Q34 18 31 22 Q23 25 15 23 Q7 21 0 24 Q-7 21 -15 23 Q-23 25 -31 22 Q-34 18 -34 8 Q-34 2 -28 -1 Z"
        fill={robe.fill} stroke="#d8c98a" strokeWidth={3} strokeLinejoin="round" />
      <path d="M0 4 Q-1 12 0 22" stroke="#d8c98a" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.6} />
    </g>
  )
}

// ---------- More for the pictures ----------

/** Lines of speed behind someone running (to the right), from (x, y). */
const SpeedLines = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.8} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -96 h-34" /><path d="M-6 -70 h-44" /><path d="M0 -44 h-30" />
  </g>
)

/** A speech bubble with words in it, pointing at whoever says them (`tail`). */
function Say({ x, y, w, h, tail, text, size = 34 }: { x: number; y: number; w: number; h: number; tail: Pt; text: string; size?: number }) {
  const [tx, ty] = tail
  const bx = Math.min(Math.max(tx, x + 30), x + w - 30)
  const line = '#d8b8a0'
  return (
    <g className="sc-float">
      <path d={`M${bx - 14} ${y + h - 4} L${tx} ${ty} L${bx + 14} ${y + h - 4} Z`} fill="#fff" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#fff" stroke={line} strokeWidth={3} />
      <path d={`M${bx - 12} ${y + h - 1.5} L${bx + 12} ${y + h - 1.5}`} stroke="#fff" strokeWidth={5} />
      <text x={x + w / 2} y={y + h / 2 + size * 0.36} fontSize={size} fontWeight={800} textAnchor="middle" fill="#c0507a"
        fontFamily="'Baloo 2', 'Chalkboard SE', system-ui, sans-serif">{text}</text>
    </g>
  )
}

/** A little stone house in the town, flat-roofed, with its door open (`door`: its x). (x, y): the middle of its foot. */
function TownHouse({ x, y, w = 230, h = 170, door = 0, children }: { x: number; y: number; w?: number; h?: number; door?: number; children?: ReactNode }) {
  const wall = useShade('#ead6ae', 0.3, 0.15)
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      <defs>{wall.def}</defs>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={wall.fill} stroke="#b8956a" strokeWidth={3} />
      <rect x={-w / 2 - 8} y={-h - 12} width={w + 16} height={14} rx={3} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={2.5} />
      {Array.from({ length: Math.floor(w / 26) }, (_, i) => <circle key={i} cx={-w / 2 + 14 + i * 26} cy={-h + 10} r={3.2} fill="#8a6040" />)}
      {[[-0.32, 0.4], [0.3, 0.62], [-0.1, 0.8], [0.36, 0.22]].map(([bx, by], i) => (
        <path key={i} d={`M${bx * w - 10} ${-h * by} l20 0 M${bx * w - 4} ${-h * by + 8} l18 0`} stroke="#d2b88a" strokeWidth={2} strokeLinecap="round" />
      ))}
      <rect x={w * 0.22} y={-h + 34} width={34} height={30} rx={4} fill="#5a3a24" stroke="#8a6a3a" strokeWidth={2.5} />
      {/* the doorway, open, with its wooden door swung back */}
      <path d={`M${door - 40} 0 L${door - 40} -104 Q${door} -132 ${door + 40} -104 L${door + 40} 0 Z`} fill="#6a4a34" stroke="#8a6a3a" strokeWidth={3} />
      <path d={`M${door - 40} 0 L${door - 40} -104 L${door - 64} -100 L${door - 64} 4 Z`} fill="#a0703f" stroke="#6b4422" strokeWidth={2.5} />
      {children}
    </g>
  )
}

// ---------- The pages ----------

// 1. "One evening, Jesus and His friends ate a special supper together. Jesus took the bread and thanked God for
// it. Then He broke it and shared it with them all."
// The upper room in the evening, lamplit: Jesus in the middle of the low table, holding up the two halves of the round
// bread He has just broken, and His friends all round the table with Him, glad (John beside Him, then Peter).
function Page1() {
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <UpperRoom />
      <Tap say="Mmm, that bread smells so good!" sfx="chomp">
        <g>
          <AtTable x={124} look={THOMAS} blinkDelay={0.4} />
          <AtTable x={216} look={PEOPLE.james} blinkDelay={1.9} />
          <AtTable x={308} look={PEOPLE.john} blinkDelay={1.2} />
        </g>
      </Tap>
      <Tap say="Supper with Jesus is the best." sfx="pop">
        <g>
          <AtTable x={492} look={PEOPLE.peter} blinkDelay={0.8} />
          <AtTable x={584} look={PEOPLE.andrew} blinkDelay={2.4} />
          <AtTable x={676} look={MATTHEW} blinkDelay={1.5} />
        </g>
      </Tap>
      <Tap say="Thank You, God, for this bread." sfx="sparkle">
        <AtTable x={400} s={1.5} look={PEOPLE.jesus} reach={[[-30, -71], [30, -71]]}
          item={<g><HalfBread x={-11} y={-74} r={20} /><HalfBread x={11} y={-74} r={20} flip /></g>} />
      </Tap>
      <SupperTable>
        <Tap say="Bread, grapes and a big jug. Yum!" sfx="chomp"><TableThings cups={[124, 216, 318, 482, 584, 690]} /></Tap>
      </SupperTable>
    </Scene>
  )
}

// 2. "Then Jesus passed them a cup to share. He said, "When you share the bread and the cup, remember Me." Jesus
// loved His friends so much."
// Closer in at the same table: Jesus passes the cup to Peter, who reaches out to take it; John beside Him, listening.
// A warm glow round Jesus, and little hearts floating up (His love for His friends).
function Page2() {
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <g transform="translate(400 456) scale(1.45) translate(-400 -456)">
        <UpperRoom />
        <Glow x={400} y={330} r={130} color="#fff1c4" />
        <AtTable x={216} look={PEOPLE.james} blinkDelay={1.9} />
        <Tap say="We will always remember, Jesus." sfx="ding"><AtTable x={308} look={PEOPLE.john} blinkDelay={1.2} /></Tap>
        <AtTable x={584} look={PEOPLE.andrew} blinkDelay={2.4} />
        <Tap say="Thank You, Jesus." sfx="pop"><AtTable x={492} look={PEOPLE.peter} reach={[[-26, -66], null]} blinkDelay={0.8} /></Tap>
        <Tap say="Remember Me. I love you." sfx="sparkle">
          <AtTable x={400} s={1.5} look={PEOPLE.jesus} reach={[[-12, -60], [40, -71]]} item={<Cup x={40} y={-66} s={1.05} />} />
        </Tap>
        <SupperTable>
          <TableThings bread={false} cups={[216, 318, 584]} bowl={262} jug={540} />
          <HalfBread x={170} y={404} r={20} />
          <HalfBread x={640} y={403} r={20} flip />
        </SupperTable>
      </g>
      <Tap say="Hearts full of love!" sfx="sparkle">
        <g>
          <Heart x={340} y={92} s={0.7} shaded />
          <Heart x={462} y={70} s={0.85} shaded color="#ff9fbe" />
          <Heart x={404} y={130} s={0.55} shaded color="#ffb3c9" />
        </g>
      </Tap>
    </Scene>
  )
}

// 3. "But some leaders did not like Jesus. They put Him on a cross, and He died. His friends were very, very sad."
// Told gently: the sun going down, and far away, small on a hill, an empty cross. Close by, His friends stand together,
// sad: John with his arm round Jesus' mother Mary, Mary Magdalene with a tear, and her friend the other Mary.
function Page3() {
  const t = TONES.sunset
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <Sky tone="sunset" />
      <LowSun x={236} y={236} r={32} color="#ffcf70" />
      <FarHills tone="sunset" h={250} />
      <FarCity x={120} y={246} s={0.62} tint="#9a86bc" />
      {/* the hill far away, with the empty cross small on top */}
      <path d="M470 252 Q540 214 600 206 Q660 200 720 222 Q760 236 800 238 L800 256 L470 256 Z" fill={t.mid} />
      <g stroke="#5e4878" strokeLinecap="round">
        <path d="M612 207 L612 176" strokeWidth={4.5} />
        <path d="M602 186 L622 186" strokeWidth={4} />
      </g>
      <Lawn tone="sunset" y={262} />
      <OliveTree x={720} y={330} s={0.8} />
      <OliveTree x={64} y={318} s={0.66} flip />
      <Birds spots={[[330, 120, 0.9], [366, 104, 0.7]]} />
      {/* John's arm goes round behind Mary, and his hand rests on her far shoulder */}
      <Tap say="Let's stay close together." sfx="ding">
        <g>
          <Figure x={360} y={416} s={1.18} look={PEOPLE.john} mood="sad" pose="hug-right" reach={[null, [84, -83]]} blinkDelay={2.2} />
          <Figure x={436} y={414} s={1.14} look={PEOPLE.mary} mood="sad" pose="pray" blinkDelay={0.9} />
          <HandOn x={459} y={318} s={1.18} skin={PEOPLE.john.skin} />
        </g>
      </Tap>
      <Tap say="We love Jesus so much." sfx="ding">
        <Figure x={268} y={420} s={1.12} look={MARY_MAGDALENE} mood="sad" blinkDelay={1.6}><Tear /></Figure>
      </Tap>
      <Tap say="I miss Jesus." sfx="ding">
        <Figure x={530} y={418} s={1.1} look={SPICE_FRIENDS[0]} mood="sad" pose="pray" blinkDelay={0.3} />
      </Tap>
    </Scene>
  )
}

// 4. "Kind friends gently laid Jesus in a tomb. It was like a little cave in a garden. Then they rolled a big round
// stone across the door."
// The garden as the sun goes down, its flowers closed for the night: the tomb cut into the rock, and the two kind
// friends rolling the big round stone across its door, Joseph of Arimathea pushing and Nicodemus steadying it. Mary
// Magdalene and the other Mary watch, sad, by an olive tree.
function Page4() {
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <Sky tone="evening" />
      <LowSun x={120} y={232} r={30} color="#ffd27a" />
      <FarHills tone="evening" h={240} />
      <Lawn tone="evening" y={250} />
      <OliveTree x={110} y={330} s={1.05} />
      <Tap say="The big stone rolled across the door." sfx="wobble">
        <Tomb x={520} y={364} s={1.02} />
      </Tap>
      {/* the two kind friends, one on each side of the stone: Joseph of Arimathea pushing it across the door, and
          Nicodemus steadying it into place */}
      <Tap say="Gently, gently. Push!" sfx="ding">
        <g>
          <g transform="rotate(-9 640 424)"><Figure x={640} y={424} s={1.04} look={JOSEPH_OF_ARIMATHEA} facing="left" mood="sad" reach={[[32, -62], [50, -78]]} blinkDelay={0.5} /></g>
          <g transform="rotate(7 402 426)"><Figure x={402} y={426} s={1.0} look={NICODEMUS} mood="sad" reach={[[30, -62], [48, -78]]} blinkDelay={1.7} /></g>
        </g>
      </Tap>
      <Tap say="We will come back with sweet spices." sfx="ding">
        <g>
          <Figure x={196} y={420} s={1.04} look={MARY_MAGDALENE} mood="sad" pose="pray" blinkDelay={1.1} />
          <Figure x={270} y={424} s={1.0} look={SPICE_FRIENDS[0]} mood="sad" blinkDelay={2.3} />
        </g>
      </Tap>
      <Tap say="The flowers are closed up for the night." sfx="pop">
        <g><Flowers buds spots={[[40, 420, '#ff7a8a'], [330, 436, '#c49aff'], [360, 428, '#ff7a8a', 0.9], [600, 444, '#ffd34d', 0.9], [774, 440, '#c49aff']]} /></g>
      </Tap>
    </Scene>
  )
}

// 5. "Then everything was quiet. Jesus' friends stayed at home, and they missed Him so much. But that was not the end
// of the story!"
// The upper room at night: one little lamp glowing, the moon in the window and a star shining bright. His friends sit
// close together on the floor, sad and quiet: Peter, John, Mary Magdalene, Andrew and James.
function Page5() {
  return (
    <Scene sky="night" ground="none" clouds={false}>
      <UpperRoom night />
      <Tap say="Twinkle, twinkle! A bright star is shining." sfx="sparkle">
        <g><Sparkles spots={[[104, 112, 11]]} color="#fff4b0" /></g>
      </Tap>
      <SitOnFloor x={180} y={398} s={1.1} look={PEOPLE.james} mood="sad" blinkDelay={1.2} />
      <Tap say="We will always love Jesus." sfx="ding">
        <SitOnFloor x={300} y={404} s={1.12} look={PEOPLE.peter} mood="sad" pose="pray" blinkDelay={0.4} />
      </Tap>
      <SitOnFloor x={412} y={408} s={1.1} look={PEOPLE.john} mood="sad" blinkDelay={2.1} />
      <Tap say="I miss Jesus so much." sfx="ding">
        <SitOnFloor x={520} y={406} s={1.08} look={MARY_MAGDALENE} mood="sad" pose="pray" blinkDelay={1.6}><Tear /></SitOnFloor>
      </Tap>
      <SitOnFloor x={630} y={400} s={1.1} look={PEOPLE.andrew} mood="sad" blinkDelay={0.9} />
      <Tap say="The little lamp is still shining. Something wonderful is coming!" sfx="ding"><OilLamp x={736} y={430} s={1.3} glow={110} /></Tap>
    </Scene>
  )
}

// 6. "Remember the big round stone? Very early on Sunday morning, Mary Magdalene and her friends walked to the garden
// with sweet spices for Jesus. "Who will roll the big stone away for us?" they asked."
// Sunday at dawn: the sun peeping over the hills and the birds waking up. The three women walk along the garden path,
// each carrying a little jar of spices, Mary Magdalene in front, wondering about the big round stone.
function Page6() {
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      <Sky tone="dawn" />
      <LowSun x={660} y={226} r={34} color="#ffd86a" />
      <FarHills tone="dawn" h={236} />
      <Lawn tone="dawn" y={250} />
      <path d="M-10 428 C100 416 200 404 300 396 C420 386 560 366 820 330 L820 364 C560 402 420 424 300 436 C200 444 100 456 -10 470 Z" fill={TONES.dawn.path} />
      <OliveTree x={90} y={322} s={0.92} flip />
      <OliveTree x={740} y={330} s={0.86} />
      <Birds spots={[[300, 92, 1], [336, 76, 0.8], [364, 98, 0.7]]} />
      <Tap say="Sweet spices for Jesus." sfx="pop">
        <Figure x={240} y={414} s={1.06} look={SPICE_FRIENDS[1]} pose="hold" item={<SpiceJar color="#d9905e" />} blinkDelay={0.6} />
      </Tap>
      <Tap say="It's so early. The birds are just waking up." sfx="pop">
        <Figure x={340} y={406} s={1.08} look={SPICE_FRIENDS[0]} pose="hold" item={<SpiceJar color="#8fb8e0" />} blinkDelay={1.8} />
      </Tap>
      <Tap say="Who will roll the big stone away for us?" sfx="ding">
        <Figure x={446} y={398} s={1.1} look={MARY_MAGDALENE} pose="hold" item={<SpiceJar />} blinkDelay={1.1} />
      </Tap>
      <ThoughtBubble x={600} y={120} w={170} h={120} tail={[[486, 266, 6], [510, 236, 9], [540, 200, 12]]}>
        <RoundStone x={590} y={124} r={38} />
        <text x={662} y={146} fontSize={56} fontWeight={800} textAnchor="middle" fill="#9a7ad0" fontFamily="'Baloo 2', 'Chalkboard SE', system-ui, sans-serif">?</text>
      </ThoughtBubble>
      <Flowers spots={[[40, 440, '#ff8aa0', 0.9], [600, 430, '#c49aff', 0.9], [690, 444, '#ffd34d', 0.9], [770, 430, '#ff8aa0', 0.9]]} />
    </Scene>
  )
}

// 7. "But when they got there, the big stone was rolled away! An angel sat on it, shining bright, with clothes as
// white as snow."
// The garden in the morning sun: the big round stone rolled away from the door, and the angel sitting on it, shining.
// The doorway is full of light. The women have stopped on the path, amazed, still holding their jars of spices.
function Page7() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sky tone="morning" />
      <FarHills tone="morning" h={232} />
      <Lawn tone="morning" y={244} />
      <Rays x={624} y={180} r={260} n={16} color="#fff6c0" opacity={0.7} />
      <Tap say="The stone is rolled away!" sfx="whoosh">
        <Tomb x={452} y={372} s={1.08} open={1} />
      </Tap>
      <Glow x={624} y={186} r={120} color="#fffbe0" />
      <Tap say="Don't be afraid!" sfx="sparkle">
        <AngelOnStone x={625} y={232} s={1.0} pose="wave" />
      </Tap>
      <Tap say="Who rolled the big stone away?" sfx="pop">
        <Figure x={180} y={428} s={1.1} look={MARY_MAGDALENE} mood="wow" pose="hold" item={<SpiceJar />} blinkDelay={1.1} />
      </Tap>
      <Tap say="Wow! An angel!" sfx="pop">
        <g>
          <Figure x={96} y={420} s={1.04} look={SPICE_FRIENDS[0]} mood="wow" pose="hold" item={<SpiceJar color="#8fb8e0" />} blinkDelay={0.4} />
          <Figure x={262} y={432} s={1.02} look={SPICE_FRIENDS[1]} mood="wow" pose="hold" item={<SpiceJar color="#d9905e" />} blinkDelay={2.0} />
        </g>
      </Tap>
      <Flowers spots={[[330, 440, '#ff8aa0', 0.9], [730, 436, '#c49aff'], [780, 446, '#ffd34d', 0.9]]} />
    </Scene>
  )
}

// 8. "The angel said, "Don't be afraid! He is not here, for He has risen, just like He said! Come and see." The tomb
// was empty!"
// Close by the doorway, full of light: inside, nobody is there, just the stone shelf and the linen cloths lying folded.
// The angel stands beside the door, shining, showing the women in; the three of them, still holding their jars of
// spices, peek in, amazed, and Mary Magdalene starts to smile.
function Page8() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sky tone="morning" />
      <Lawn tone="morning" y={330} flat />
      <Tap say="The tomb is empty!" sfx="sparkle">
        <Tomb x={380} y={448} s={1.75} open={1.15} ivy={false} />
      </Tap>
      <Glow x={612} y={290} r={150} color="#fffbe0" />
      <Tap say="He is not here. He has risen!" sfx="sparkle">
        <g className="sc-float"><Person x={616} y={438} s={1.34} look={ANGEL} pose="point" facing="left" blinkDelay={0.7} /></g>
      </Tap>
      <Tap say="He is risen! Let's go and tell everyone!" sfx="good">
        <g>
          <Figure x={62} y={444} s={1.14} look={SPICE_FRIENDS[1]} mood="wow" pose="hold" item={<SpiceJar color="#d9905e" />} blinkDelay={1.4} />
          <Figure x={142} y={446} s={1.16} look={SPICE_FRIENDS[0]} mood="wow" pose="hold" item={<SpiceJar color="#8fb8e0" />} blinkDelay={0.6} />
          <Figure x={226} y={448} s={1.2} look={MARY_MAGDALENE} mood="joy" pose="hold" item={<SpiceJar />} blinkDelay={0.3} />
        </g>
      </Tap>
      <Sparkles spots={[[300, 130, 9], [470, 160, 7], [380, 96, 6], [700, 120, 8]]} color="#fff6b0" />
      <Flowers spots={[[278, 456, '#ff8aa0', 0.8], [492, 456, '#ffd34d', 0.8], [530, 458, '#c49aff', 0.7], [770, 456, '#ff8aa0', 0.8]]} />
    </Scene>
  )
}

// 9. "The women ran as fast as they could to tell Jesus' other friends the happy news. Peter and John could hardly
// believe it!"
// In the town in the morning: the three women running up the street, overjoyed, Mary Magdalene waving; Peter and John
// at the door of their house, amazed.
function Page9() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sky tone="morning" />
      <FarCity x={250} y={250} s={1.1} tint="#c9b8d8" />
      <Lawn tone="morning" y={262} flat />
      <path d="M0 320 L800 300 L800 450 L0 450 Z" fill="#ecd9b0" />
      <path d="M0 330 L800 312" stroke="#d6bf8e" strokeWidth={3} />
      <TownHouse x={652} y={318} door={-24}>
        <Tap say="What? The stone is rolled away?" sfx="pop">
          <g>
            <Figure x={-60} y={4} s={1.05} look={PEOPLE.john} mood="wow" blinkDelay={1.3} />
            <Figure x={20} y={8} s={1.08} look={PEOPLE.peter} mood="wow" pose="arms-up" blinkDelay={0.5} />
          </g>
        </Tap>
      </TownHouse>
      <Tap say="Jesus is alive! Come and see!" sfx="whoosh">
        <g>
          <SpeedLines x={112} y={414} />
          <g transform="rotate(9 156 420)"><Figure x={156} y={420} s={1.06} look={SPICE_FRIENDS[1]} mood="joy" blinkDelay={0.2} /></g>
          <SpeedLines x={226} y={400} s={0.6} />
          <g transform="rotate(9 270 410)"><Figure x={270} y={410} s={1.08} look={SPICE_FRIENDS[0]} mood="joy" pose="arms-up" blinkDelay={1.7} /></g>
          <SpeedLines x={346} y={406} s={0.6} />
          <g transform="rotate(10 388 418)"><Figure x={388} y={418} s={1.1} look={MARY_MAGDALENE} mood="joy" pose="wave" blinkDelay={0.9} /></g>
        </g>
      </Tap>
    </Scene>
  )
}

// 10. "Mary Magdalene went back to the garden. She heard someone say her name. "Mary!" She turned around, and it was
// Jesus! He was alive!"
// The garden in full morning sun, every flower open, butterflies and birds: Jesus stands in a soft glow of light,
// saying "Mary!", and Mary Magdalene turns to Him, so happy she cries happy tears. The empty tomb is far behind.
function Page10() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sky tone="morning" />
      <FarHills tone="morning" h={226} />
      <Lawn tone="morning" y={240} />
      <Tomb x={150} y={300} s={0.42} open={1} shine={false} />
      <OliveTree x={720} y={318} s={0.9} />
      <Glow x={520} y={300} r={170} color="#fff6c8" />
      <Tap say="Mary! It's Me!" sfx="sparkle">
        <Figure x={520} y={420} s={1.3} look={PEOPLE.jesus} pose="open" blinkDelay={0.6} />
      </Tap>
      <Say x={556} y={84} w={150} h={66} tail={[548, 238]} text="Mary!" />
      <Tap say="Jesus! You're alive!" sfx="good">
        <Figure x={334} y={424} s={1.18} look={MARY_MAGDALENE} mood="teary" pose="pray" blinkDelay={1.2} />
      </Tap>
      <Tap say="Flutter, flutter!" sfx="swish">
        <g>
          <Emoji e="🦋" x={250} y={150} size={58} bob />
          <Emoji e="🦋" x={420} y={110} size={42} bob flip />
        </g>
      </Tap>
      <Birds spots={[[110, 84, 0.9], [146, 68, 0.7]]} />
      <Flowers spots={[[40, 430, '#ff8aa0'], [96, 446, '#ffd34d', 0.9], [200, 440, '#c49aff'], [420, 446, '#ff8aa0', 0.9], [640, 440, '#ffd34d'], [700, 446, '#c49aff', 0.9], [770, 432, '#ff8aa0']]} />
    </Scene>
  )
}

// 11. "That evening, Jesus came to His friends. "Peace be with you!" He said. Oh, how happy they were! Jesus is alive
// forever, and He loves you, too. Hooray!"
// The upper room again, warm with lamplight: Jesus in the middle with His arms open wide, in a soft glow, and His
// friends all round Him, overjoyed: James, John, Peter, Andrew and Mary Magdalene. Hearts and sparkles.
function Page11() {
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <g transform="translate(400 452) scale(1.2) translate(-400 -452)">
        <UpperRoom />
        <Glow x={400} y={300} r={180} color="#fff4cc" />
        <Tap say="Hooray! Jesus is alive!" sfx="good">
          <g>
            <Figure x={140} y={438} s={1.12} look={MATTHEW} mood="joy" pose="wave" facing="left" blinkDelay={0.4} />
            <Figure x={214} y={434} s={1.14} look={PEOPLE.james} mood="joy" blinkDelay={1.6} />
            <Figure x={306} y={440} s={1.12} look={PEOPLE.john} mood="joy" pose="wave" facing="left" blinkDelay={2.2} />
          </g>
        </Tap>
        <Tap say="It's really You, Jesus!" sfx="good">
          <g>
            <Figure x={494} y={440} s={1.16} look={PEOPLE.peter} mood="joy" pose="wave" blinkDelay={0.7} />
            <Figure x={588} y={436} s={1.1} look={MARY_MAGDALENE} mood="teary" pose="pray" blinkDelay={1.3} />
            <Figure x={662} y={438} s={1.12} look={PEOPLE.andrew} mood="joy" pose="wave" blinkDelay={2.6} />
          </g>
        </Tap>
        {/* Jesus, His arms round John and Peter */}
        <Tap say="Peace be with you!" sfx="sparkle">
          <Figure x={400} y={430} s={1.3} look={PEOPLE.jesus} pose="hug" reach={[[-54, -66], [54, -69]]} blinkDelay={0.9} />
        </Tap>
      </g>
      <Heart x={240} y={120} s={0.75} shaded />
      <Heart x={566} y={96} s={0.85} shaded color="#ffb3c9" />
      <Sparkles spots={[[330, 80, 9], [470, 56, 8], [400, 36, 6], [660, 150, 7], [150, 170, 6]]} color="#fff2a8" />
    </Scene>
  )
}

export const EASTER_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]
