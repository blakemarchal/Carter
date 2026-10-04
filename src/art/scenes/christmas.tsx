// Baby Jesus: one illustration per story page, both parts in one list (see data/christmas.ts for the words).
// Part one, pages 1 to 5: the angel's good news for Mary, Joseph's dream, the long trip and no room in the town.
// Part two, pages 6 to 11: Jesus is born, the shepherds and the angels, and the wise men with their gifts.
// God is never drawn as a person: His glory is light (GloryLight, Glow, Rays, Sparkles).
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, MOON, useShade } from '../kit'
import { fluff } from '../items/draw'
import { Baby, Person, PEOPLE, SKIN, type Look } from '../people'
import { Cloud, Cow, Glow, Manger, Palm, Rays, Scene, Sheep, Sparkles, Stable, Tap, Tree, sparkle } from './kit'

const gid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

// ---------- Local props ----------

/**
 * A friendly little donkey, side view facing right (origin at the hooves). `rider` sits side-saddle on
 * its back, facing us: her top half above the saddle, her hands resting in her lap and her feet
 * hanging down the donkey's side.
 */
function Donkey({ x, y, s = 1, flip, rider, blinkDelay = 0 }: { x: number; y: number; s?: number; flip?: boolean; rider?: Look; blinkDelay?: number }) {
  const c = '#a89c9e'
  const coat = useShade(c, 0.3, 0.2)
  const clip = `dk${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const leg = (lx: number, far?: boolean) => (
    <g key={lx}>
      <rect x={lx} y={-46} width={12} height={44} rx={5} fill={far ? darken(c, 0.12) : coat.fill} stroke={ink(c)} strokeWidth={2.5} />
      <rect x={lx - 1} y={-9} width={14} height={9} rx={3} fill="#5a4646" />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        {coat.def}
        {/* the rider shows from the saddle up */}
        <clipPath id={clip}><rect x={-90} y={-280} width={180} height={190} /></clipPath>
      </defs>
      <g className="pa-tail" style={{ '--o': '100% 0%' } as CSSProperties}>
        <path d="M-50 -66 Q-64 -54 -62 -32" stroke={ink(c)} strokeWidth={5} fill="none" strokeLinecap="round" />
        <ellipse cx={-62} cy={-27} rx={6} ry={9} fill="#5a4646" />
      </g>
      {leg(-30, true)}
      {leg(24, true)}
      <ellipse cx={0} cy={-62} rx={56} ry={28} fill={coat.fill} stroke={ink(c)} strokeWidth={3} />
      <ellipse cx={4} cy={-46} rx={36} ry={10} fill="#e4dcdc" opacity={0.85} />
      {leg(-46)}
      {leg(36)}
      <path d="M30 -80 Q46 -102 54 -118 L76 -106 Q66 -82 50 -58 Z" fill={coat.fill} stroke={ink(c)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M32 -84 Q44 -104 54 -122" stroke="#5a4646" strokeWidth={8} strokeLinecap="round" fill="none" />
      <g className="pa-ear" style={{ '--o': '50% 100%' } as CSSProperties}>
        <ellipse cx={56} cy={-142} rx={7.5} ry={21} transform="rotate(-18 56 -142)" fill={coat.fill} stroke={ink(c)} strokeWidth={2.5} />
        <ellipse cx={56} cy={-140} rx={3.5} ry={13} transform="rotate(-18 56 -140)" fill="#f2b8c6" />
      </g>
      <ellipse cx={72} cy={-140} rx={7.5} ry={21} transform="rotate(14 72 -140)" fill={coat.fill} stroke={ink(c)} strokeWidth={2.5} />
      <ellipse cx={72} cy={-138} rx={3.5} ry={13} transform="rotate(14 72 -138)" fill="#f2b8c6" />
      <ellipse cx={70} cy={-112} rx={22} ry={18} transform="rotate(24 70 -112)" fill={coat.fill} stroke={ink(c)} strokeWidth={3} />
      <ellipse cx={86} cy={-98} rx={15} ry={12} fill="#e4dcdc" stroke={ink(c)} strokeWidth={2.5} />
      <ellipse cx={93} cy={-100} rx={2.2} ry={3} fill="#7a6a6a" />
      <path d="M80 -91 Q86 -87 92 -91" stroke="#5a4646" strokeWidth={2} fill="none" strokeLinecap="round" />
      <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
        <ellipse cx={70} cy={-116} rx={4} ry={5} fill="#2b2140" />
        <circle cx={68.6} cy={-118} r={1.6} fill="#fff" />
      </g>
      <ellipse cx={74} cy={-104} rx={4} ry={2.5} fill="#ff7fb0" opacity={0.5} />
      {rider && <g clipPath={`url(#${clip})`}><Person x={-6} y={-40} s={0.8} look={rider} pose="hold" blinkDelay={blinkDelay + 0.7} /></g>}
      {/* saddle blanket with a little gold fringe */}
      <path d={rider ? 'M-34 -84 Q-6 -94 26 -86 L30 -60 Q-2 -52 -32 -58 Z' : 'M-30 -86 Q-2 -94 26 -86 L30 -60 Q-2 -52 -32 -58 Z'} fill="#c0504d" stroke={ink('#c0504d')} strokeWidth={2.5} strokeLinejoin="round" />
      {(rider ? [-29, 22, 27] : [-24, -12, 0, 12, 24]).map((fx) => <circle key={fx} cx={fx} cy={-56} r={2.6} fill="#ffd34d" />)}
      {rider && (
        <g>
          {/* feet, peeking out under the hem */}
          <ellipse cx={-14} cy={-45} rx={7} ry={4} fill="#7a5233" />
          <ellipse cx={4} cy={-45} rx={7} ry={4} fill="#7a5233" />
          {/* her legs hanging down the donkey's side (two of them, a fold between) */}
          <path d="M-24 -86 L14 -86 L13 -52 Q-4 -46 -22 -51 Z" fill={rider.robe} stroke={ink(rider.robe)} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M-5 -78 L-5 -50" stroke={ink(rider.robe)} strokeWidth={1.8} opacity={0.6} strokeLinecap="round" />
          {/* her lap on the saddle, and her hands resting in it */}
          <path d="M-29 -91 Q-6 -98 17 -91 Q21 -85 17 -79 Q-6 -74 -29 -79 Q-33 -85 -29 -91 Z" fill={rider.robe} stroke={ink(rider.robe)} strokeWidth={2.5} strokeLinejoin="round" />
          {[-13, 1].map((hx) => <circle key={hx} cx={hx} cy={-88} r={5.6} fill={rider.skin} stroke={ink(rider.skin)} strokeWidth={1.8} />)}
        </g>
      )}
    </g>
  )
}

/**
 * A Bethlehem house: flat roof, an arched door and window(s); `lit` glows them for the night. The door
 * is kept below and beside the windows, so the two never merge into a shape like a person.
 */
function FlatHouse({ x, y, w = 60, h = 50, color = '#ecd9b0', lit, win = 1 }: { x: number; y: number; w?: number; h?: number; color?: string; lit?: boolean; win?: number }) {
  const glass = lit ? '#ffd76a' : '#6b4422'
  const dh = Math.min(23, h * 0.55) // door height
  const dx = win === 1 ? x - w * 0.18 : x // door middle
  const wh = Math.min(11, h * 0.3) // window height
  const wins = win === 1 ? [x + w * 0.22] : Array.from({ length: win }, (_, i) => x - w / 2 + ((i + 1) * w) / (win + 1))
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={color} stroke={ink(color)} strokeWidth={2.5} />
      <rect x={x - w / 2 - 3} y={y - h - 6} width={w + 6} height={8} rx={2} fill={darken(color, 0.12)} />
      <path d={`M${dx - 6} ${y} L${dx - 6} ${y - dh * 0.62} Q${dx} ${y - dh * 1.08} ${dx + 6} ${y - dh * 0.62} L${dx + 6} ${y} Z`} fill={lit ? '#e8a640' : '#8a5a2e'} />
      {wins.map((wx, i) => <rect key={i} x={wx - 5} y={y - h + 8} width={10} height={wh} rx={Math.min(4, wh / 2 - 0.5)} fill={glass} />)}
    </g>
  )
}

/** Night-time hills: blue-green, moonlit. */
function NightHills() {
  return (
    <g>
      <path d="M0 300 Q160 262 340 292 Q540 250 800 286 L800 450 L0 450 Z" fill="#3e5e86" />
      <path d="M0 362 Q220 330 440 360 T800 350 L800 450 L0 450 Z" fill="#35577a" />
    </g>
  )
}

function Campfire({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={0} y={-24} r={90} color="#ffc46a" />
      <rect x={-34} y={-12} width={68} height={12} rx={6} fill="#8a5a2e" stroke="#5a3a20" strokeWidth={2.5} transform="rotate(14)" />
      <rect x={-34} y={-12} width={68} height={12} rx={6} fill="#9a6a3a" stroke="#5a3a20" strokeWidth={2.5} transform="rotate(-14)" />
      <g className="pa-twinkle">
        <path d="M0 -8 Q-24 -28 -4 -62 Q0 -40 10 -50 Q22 -26 0 -8 Z" fill="#ff9a3c" />
        <path d="M0 -10 Q-12 -24 0 -42 Q12 -24 0 -10 Z" fill="#ffe680" />
      </g>
    </g>
  )
}

/** A little music note floating up. */
const Note = ({ x, y, s = 1, color = '#ffe680', d = 0 }: { x: number; y: number; s?: number; color?: string; d?: number }) => (
  <g className="sc-float" style={{ animationDelay: `${d}s` }}>
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color} stroke={darken(color, 0.3)} strokeWidth={1.5}>
      <ellipse cx={0} cy={0} rx={9} ry={6.5} transform="rotate(-20)" />
      <path d="M6 -2 L6 -32 Q18 -28 20 -14 Q14 -22 9 -23 L9 -2 Z" />
    </g>
  </g>
)

/** A still, soft circle of light (a moon's or a star's halo): fades out, so it never reads as a grey disc. */
function SoftLight({ x, y, r, color = '#fff3c0', o = 0.4 }: { x: number; y: number; r: number; color?: string; o?: number }) {
  const id = `sl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs><radialGradient id={id}><stop offset="0" stopColor={color} stopOpacity={o} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  )
}

/** The moon with a soft halo. */
function NightMoon({ x = 650, y = 85 }: { x?: number; y?: number }) {
  return (
    <g>
      <SoftLight x={x + 6} y={y} r={74} o={0.32} />
      <path d={`M${x - 6} ${y - 36} A36 36 0 1 0 ${x + 34} ${y + 10} A30 30 0 0 1 ${x - 6} ${y - 36} Z`} fill="#fff3b0" stroke="#e8d27a" strokeWidth={3} />
    </g>
  )
}

/** One bright star in the night sky (just a star: it doesn't point anywhere). */
function BrightStar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <SoftLight x={x} y={y} r={80 * s} color="#fff3a0" o={0.5} />
      <path d={sparkle(x, y, 54 * s)} fill="#fff3a0" stroke="#e8c84a" strokeWidth={3} />
      <g className="pa-twinkle"><path d={sparkle(x, y, 26 * s)} fill="#ffffff" transform={`rotate(45 ${x} ${y})`} /></g>
    </g>
  )
}

/** God's glory as light: a big warm glow that lights up the night (never a person). */
function GloryLight({ x, y, r }: { x: number; y: number; r: number }) {
  const id = `gy${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#fffbe8" stopOpacity={1} />
          <stop offset="0.42" stopColor="#fff0b0" stopOpacity={0.96} />
          <stop offset="0.7" stopColor="#ffd98a" stopOpacity={0.78} />
          <stop offset="0.88" stopColor="#f5b27a" stopOpacity={0.36} />
          <stop offset="1" stopColor="#e8a0a0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  )
}

/** A stable seen from outside at night, glowing warm inside; `children` are drawn in the doorway. */
function GlowingStable({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  const clip = `gs${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <Stable x={x} y={y} s={s} />
      <defs><clipPath id={clip}><rect x={x - 100 * s} y={y - 90 * s} width={200 * s} height={90 * s} /></clipPath></defs>
      <rect x={x - 100 * s} y={y - 90 * s} width={200 * s} height={90 * s} fill="#ffd98a" opacity={0.9} />
      {/* (the glow stays inside the doorway: spilling onto the dark ground it read as grey fog) */}
      <g clipPath={`url(#${clip})`}><Glow x={x} y={y - 30 * s} r={110 * s} color="#fff3c0" /></g>
      <path d={`M${x - 100 * s} ${y} L${x + 100 * s} ${y} L${x + 100 * s} ${y - 14 * s} Q${x} ${y - 24 * s} ${x - 100 * s} ${y - 14 * s} Z`} fill="#e8c86a" />
      {children}
    </g>
  )
}

/** A little floating heart: God's love. */
function Heart({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 13 C-20 0 -17 -17 -7 -17 C-3 -17 0 -14 0 -10 C0 -14 3 -17 7 -17 C17 -17 20 0 0 13 Z" fill="#ff6f91" stroke="#d94a6e" strokeWidth={2.5} strokeLinejoin="round" />
        <ellipse cx={-8} cy={-9} rx={3.6} ry={2.2} fill="#fff" opacity={0.65} transform="rotate(-35 -8 -9)" />
      </g>
    </g>
  )
}

const INNKEEPER: Look = { skin: '#c68b5e', hair: 'covered', hairColor: '#3b2a20', wrap: '#f5f0e6', robe: '#c98448', sash: '#7cb06a', beard: 'short', beardColor: '#3b2a20' }
const SINGER: Look = { ...PEOPLE.angel, glow: false }
const SHEPHERD_BOY: Look = { ...PEOPLE.shepherd, build: 'child', beard: undefined, wrap: '#c0504d', robe: '#a88a5a', sash: '#e8dcc0' }

// ---------- New for the angel's news, Joseph's dream and the wise men (pages 1 to 3, and 11) ----------
// (Surprised, Sleeper, WISE_MEN, Turban, MagiGift and Camel could join people.tsx and the scene kit.)

/**
 * Surprise on a Person's face (draw it inside the Person, so it's in figure units): eyebrows up, and a little
 * round "oh" for a mouth over the smile.
 */
export function Surprised({ look }: { look: Look }) {
  return (
    <g>
      <path d="M-12.5 -121.5 Q-8 -125.5 -3.5 -121.5 M3.5 -121.5 Q8 -125.5 12.5 -121.5" stroke={darken(look.hairColor, 0.1)} strokeWidth={2} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-104.6} rx={7} ry={3.9} fill={look.skin} />
      <ellipse cx={0} cy={-104} rx={3.3} ry={4.3} fill="#6b2a3a" stroke="#4a1a28" strokeWidth={1} />
    </g>
  )
}

/** A clay water jar with two handles, standing on the floor. (x, y) = where it stands. */
function WaterJar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const clay = '#c9774a'
  const c = useShade(clay, 0.3, 0.2)
  const line = ink(clay)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{c.def}</defs>
      <ellipse cx={0} cy={-1} rx={28} ry={4} fill="#000" opacity={0.12} />
      <path d="M-11 -60 Q-27 -60 -24 -42 M11 -60 Q27 -60 24 -42" stroke={line} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-11 -60 Q-27 -60 -24 -42 M11 -60 Q27 -60 24 -42" stroke={clay} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M-12 -64 L12 -64 L10 -54 Q31 -44 29 -24 Q27 -3 0 -2 Q-27 -3 -29 -24 Q-31 -44 -10 -54 Z" fill={c.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={0} cy={-64} rx={13} ry={4} fill={darken(clay, 0.3)} stroke={line} strokeWidth={2.5} />
      <path d="M-26 -34 Q0 -27 26 -34" stroke={lighten(clay, 0.35)} strokeWidth={3} fill="none" strokeLinecap="round" />
      <ellipse cx={-15} cy={-42} rx={6} ry={3.5} fill="#fff" opacity={0.35} transform="rotate(-35 -15 -42)" />
    </g>
  )
}

/**
 * Mary's home in Nazareth, inside, by day (pages 1 and 2): plaster walls under a wooden beam, an earth floor
 * with a woven rug, a clay water jar, and an arched window looking out on the little town: flat-roofed houses
 * and olive trees on a green hill. `town` is what the town says when it's tapped.
 */
function MaryHome({ town, children }: { town: string; children?: ReactNode }) {
  const wall = '#f3e2c4', floor = '#d9b789', rug = '#c0504d'
  const win = 'M68 268 L68 162 A86 86 0 0 1 240 162 L240 268 Z'
  // (the rug lies on the floor: its far edge is shorter than its near one)
  const rugAt = (t: number) => ({ y: 384 + 56 * t, l: 250 - 40 * t, r: 560 + 40 * t })
  return (
    <Scene sky="day" ground="none" clouds={false}>
      {/* outside the window: Nazareth on its hill */}
      <Tap say={town} sfx="ding">
        <Cloud x={118} y={116} s={0.42} />
        <path d="M60 300 L60 236 Q116 188 166 194 Q214 200 250 230 L250 300 Z" fill="#a5d890" />
        <Tree x={84} y={246} s={0.24} fruit="#4f5d2a" />
        {[[120, 226, 30, 22], [156, 212, 34, 26], [196, 222, 30, 22], [224, 248, 26, 18], [138, 256, 30, 20], [184, 262, 28, 18]].map(([hx, hy, w, h], i) => (
          <FlatHouse key={i} x={hx} y={hy} w={w} h={h} />
        ))}
        <Tree x={236} y={228} s={0.2} fruit="#4f5d2a" />
      </Tap>
      {/* the wall, with the window open in it */}
      <path fillRule="evenodd" d={`M0 0 H800 V450 H0 Z ${win}`} fill={wall} />
      <rect x={0} y={300} width={800} height={54} fill={darken(wall, 0.05)} />
      <rect x={0} y={0} width={800} height={20} fill="#9a6a3a" />
      <rect x={0} y={20} width={800} height={5} fill="#000" opacity={0.08} />
      <path d={win} fill="none" stroke="#c9a46a" strokeWidth={10} strokeLinejoin="round" />
      <rect x={56} y={266} width={196} height={12} rx={4} fill="#dcc08e" stroke="#b8975e" strokeWidth={2} />
      {/* the floor, the rug and the water jar */}
      <rect x={0} y={354} width={800} height={96} fill={floor} />
      <path d="M0 354 L800 354" stroke={darken(floor, 0.14)} strokeWidth={3} />
      <path d={`M${rugAt(1).l} 440 L250 384 L560 384 L${rugAt(1).r} 440 Z`} fill={rug} stroke={ink(rug)} strokeWidth={3} strokeLinejoin="round" />
      {([[0.22, '#f3e2c4'], [0.5, '#ffd34d'], [0.78, '#f3e2c4']] as const).map(([t, c]) => {
        const r = rugAt(t)
        return <path key={t} d={`M${r.l + 8} ${r.y} L${r.r - 8} ${r.y}`} stroke={c} strokeWidth={5} strokeLinecap="round" />
      })}
      <WaterJar x={112} y={416} s={1.1} />
      {children}
    </Scene>
  )
}

/** Joseph's carpenter's tools, hanging on pegs on the wall: a saw and a hammer. (x, y) = the first peg. */
function Tools({ x, y }: { x: number; y: number }) {
  const wood = '#c08a52', steel = '#c9d2e0', head = '#8d95a8'
  const teeth = Array.from({ length: 10 }, (_, i) => `L${-11 + i * 0.85 - 4} ${17 + i * 7 + 3.5} L${-11 + (i + 1) * 0.85} ${17 + (i + 1) * 7}`).join(' ')
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      {/* the saw, hanging by its handle */}
      <path d={`M-11 17 ${teeth} L6 87 L11 17 Z`} fill={steel} stroke={ink(steel)} strokeWidth={2.2} />
      <path d="M-14 -4 Q-14 -12 -6 -12 L6 -12 Q14 -12 14 -4 L14 18 L-14 18 Z" fill={wood} stroke={ink(wood)} strokeWidth={2.5} />
      <ellipse cx={0} cy={1} rx={6} ry={5} fill="#3b2a4a" />
      {/* the hammer */}
      <rect x={67} y={14} width={7} height={52} rx={3} fill={wood} stroke={ink(wood)} strokeWidth={2.2} />
      <rect x={56} y={3} width={30} height={13} rx={3} fill={head} stroke={ink(head)} strokeWidth={2.2} />
      {/* the pegs */}
      {[0, 71].map((px) => <circle key={px} cx={px} cy={px === 0 ? 0 : 1} r={4.5} fill="#6b4422" stroke="#3b2414" strokeWidth={1.5} />)}
    </g>
  )
}

/**
 * A little wooden stool that Joseph made, and two boards leaning on the wall beside it. (x, y) = where the
 * stool stands; the boards stand at the foot of the wall, to its right.
 */
function Workshop({ x, y }: { x: number; y: number }) {
  const wood = '#c08a52', board = '#d9a868'
  const foot = 372 // (just in front of the wall)
  return (
    <g strokeLinejoin="round">
      {[[x + 56, -7, 0], [x + 78, -4, 1]].map(([bx, tilt, i]) => (
        <rect key={i} x={bx - 9} y={foot - 118} width={18} height={118} rx={3} fill={i ? darken(board, 0.08) : board} stroke={ink(board)} strokeWidth={2.2} transform={`rotate(${tilt} ${bx} ${foot})`} />
      ))}
      {/* the stool: three legs, then the seat */}
      <path d={`M${x - 26} ${y} L${x - 18} ${y - 44} M${x + 26} ${y} L${x + 18} ${y - 44}`} stroke={ink(wood)} strokeWidth={10} strokeLinecap="round" />
      <path d={`M${x - 26} ${y} L${x - 18} ${y - 44} M${x + 26} ${y} L${x + 18} ${y - 44}`} stroke={wood} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${x} ${y + 4} L${x} ${y - 44}`} stroke={darken(wood, 0.25)} strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={x} cy={y - 48} rx={34} ry={9} fill={wood} stroke={ink(wood)} strokeWidth={2.5} />
      <ellipse cx={x - 8} cy={y - 50} rx={12} ry={3} fill="#fff" opacity={0.3} />
    </g>
  )
}

/**
 * Joseph's home at night (page 3): moonlit walls, a window with the moon and stars, his carpenter's tools on
 * the wall and a stool he made (`tools` and `stool` are what they say when tapped).
 */
function JosephHome({ tools, stool, children }: { tools: string; stool: string; children?: ReactNode }) {
  const wall = '#4f4b8a', floor = '#3d3a72'
  const win = 'M66 62 H192 V168 H66 Z'
  return (
    <Scene sky="night" ground="none">
      {/* outside the window: the moon and a few stars */}
      <path d={MOON} transform="translate(160 100) scale(1.5)" fill="#fff3b0" stroke="#e8d27a" strokeWidth={2} />
      {[[90, 84, 4], [118, 140, 3], [174, 150, 3.5], [96, 120, 2.5]].map(([sx, sy, r], i) => (
        <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={sparkle(sx, sy, r)} fill="#fff8d0" />
      ))}
      <path fillRule="evenodd" d={`M0 0 H800 V450 H0 Z ${win}`} fill={wall} />
      <rect x={0} y={0} width={800} height={20} fill="#332f62" />
      <path d={win} fill="none" stroke="#6b4f3a" strokeWidth={9} strokeLinejoin="round" />
      <rect x={56} y={166} width={146} height={10} rx={3} fill="#7a5a44" stroke="#4e3a2c" strokeWidth={2} />
      <Tap say={tools} sfx="ding"><Tools x={262} y={112} /></Tap>
      <rect x={0} y={354} width={800} height={96} fill={floor} />
      <path d="M0 354 L800 354" stroke={darken(floor, 0.25)} strokeWidth={3} />
      <Tap say={stool} sfx="pop"><Workshop x={680} y={416} /></Tap>
      {children}
    </Scene>
  )
}

/** Holds the eyes of every Person inside an `xm-sleepy` group shut (their blink, held closed): asleep. */
const SLEEPY_CSS = '.xm-sleepy .pa-blink{animation:none!important;transform:scaleY(.14)!important;transform-box:fill-box;transform-origin:center}'

/**
 * Someone fast asleep on a sleeping mat on the floor (page 3: Joseph), seen from the side: their head on a
 * pillow at the right-hand end and a warm blanket over them, tucked up to the chin. (x, y) = the middle of
 * the mat on the floor. The head is the Person's own, so they look just as they do standing up.
 */
export function Sleeper({ x, y, s = 1, look, blanket = '#c8644a' }: { x: number; y: number; s?: number; look: Look; blanket?: string }) {
  const id = gid(useId())
  const b = useShade(blanket, 0.3, 0.2)
  const mat = '#c9a46a'
  // The blanket's top, from under the chin: up over the chest, along the body and legs, and up over the toes.
  const cover = 'M138 -40 C130 -44 122 -46 112 -45 C100 -56 86 -64 66 -64 C44 -64 32 -60 14 -60 C-8 -60 -24 -62 -40 -60 '
    + 'C-62 -58 -80 -52 -100 -50 C-116 -49 -126 -50 -134 -56 C-142 -66 -157 -64 -160 -50 C-163 -38 -163 -26 -162 -16 L140 -16 C142 -26 141 -34 138 -40 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        {b.def}
        {/* (just the head shows above the blanket) */}
        <clipPath id={`${id}h`}><rect x={40} y={-220} width={150} height={178} /></clipPath>
        <clipPath id={`${id}b`}><path d={cover} /></clipPath>
      </defs>
      <style>{SLEEPY_CSS}</style>
      {/* the mat and the pillow */}
      <rect x={-172} y={-18} width={344} height={18} rx={8} fill={mat} stroke={ink(mat)} strokeWidth={2.5} />
      {[-130, -90, -50, -10, 30, 70, 110, 150].map((mx) => <path key={mx} d={`M${mx} -15 L${mx} -3`} stroke={darken(mat, 0.15)} strokeWidth={2} />)}
      <ellipse cx={122} cy={-36} rx={46} ry={20} fill="#f4ecdc" stroke="#cfc2a6" strokeWidth={2.5} />
      {/* their head on the pillow, eyes closed */}
      <g clipPath={`url(#${id}h)`}>
        <g className="xm-sleepy" transform="rotate(10 112 -70)"><Person x={112} y={44} look={look} /></g>
      </g>
      {/* the blanket, striped, with the sheet turned down over its top */}
      <path d={cover} fill={b.fill} stroke={ink(blanket)} strokeWidth={3} strokeLinejoin="round" />
      <g clipPath={`url(#${id}b)`}>
        {[-118, -78, -38, 2, 42].map((sx) => <rect key={sx} x={sx} y={-72} width={12} height={60} fill={lighten(blanket, 0.4)} opacity={0.55} />)}
      </g>
      <path d="M124 -43 C112 -47 100 -58 80 -63 C70 -65 60 -64 52 -63" stroke="#f4e6cf" strokeWidth={9} strokeLinecap="round" fill="none" />
    </g>
  )
}

/** A dream: a soft cloud, with little bubbles rising to it from the sleeper's head at `from`. */
function DreamCloud({ x, y, rx, ry, from, children }: { x: number; y: number; rx: number; ry: number; from: [number, number]; children?: ReactNode }) {
  const id = gid(useId())
  const [hx, hy] = from
  const ex = x - rx * 0.62, ey = y + ry * 0.78 // where the bubbles meet the cloud (its lower left)
  return (
    <g>
      <defs><radialGradient id={id}><stop offset="0" stopColor="#fff8e0" /><stop offset="1" stopColor="#ece4ff" /></radialGradient></defs>
      {[0.22, 0.52, 0.82].map((t, i) => (
        <circle key={t} cx={hx + (ex - hx) * t} cy={hy + (ey - hy) * t} r={5 + i * 4} fill="#f2ecff" stroke="#c9bdf0" strokeWidth={2.5} />
      ))}
      <path d={fluff(x, y, rx, ry, 16)} fill={`url(#${id})`} stroke="#c9bdf0" strokeWidth={3} />
      {children}
    </g>
  )
}

/** The wise men from far away (page 11): each in a rich robe with a gold sash, and a turban with a jewel. */
export const WISE_MEN: { look: Look; turban: string; gem: string }[] = [
  { look: { skin: SKIN.tan, hair: 'bald', hairColor: '#2b1d14', beard: 'short', beardColor: '#2b1d14', robe: '#7d55b0', sash: '#ffd34d' }, turban: '#f5f0e6', gem: '#e0506a' },
  { look: { skin: SKIN.medium, hair: 'bald', hairColor: '#f2efe8', beard: 'long', beardColor: '#f2efe8', robe: '#2f8f8a', sash: '#ffd34d' }, turban: '#c0504d', gem: '#5fb7ff' },
  { look: { skin: SKIN.deep, hair: 'bald', hairColor: '#2b1d14', robe: '#c0504d', sash: '#ffd34d' }, turban: '#ffd34d', gem: '#5fd39a' },
]

/** A wise man's turban, wrapped round and round, with a jewel at the front (inside a Person: figure units). */
export function Turban({ color, gem }: { color: string; gem: string }) {
  const line = ink(color)
  return (
    <g strokeLinejoin="round">
      <path d="M-25 -114 C-34 -140 -18 -161 0 -161 C18 -161 34 -140 25 -114 C14 -125 -14 -125 -25 -114 Z" fill={color} stroke={line} strokeWidth={2.5} />
      <path d="M-26 -130 C-10 -138 10 -138 26 -130 M-20 -146 C-7 -153 7 -153 20 -146" stroke={line} strokeWidth={1.8} fill="none" opacity={0.5} />
      <circle cx={0} cy={-128.5} r={4.5} fill={gem} stroke={ink(gem)} strokeWidth={1.5} />
      <circle cx={-1.4} cy={-130} r={1.4} fill="#fff" opacity={0.8} />
    </g>
  )
}

export type MagiGiftKind = 'gold' | 'incense' | 'myrrh'

/**
 * A wise man's gift, held in both hands in front of him (inside a Person with pose "hold": figure units):
 * a little chest of gold, a pot of sweet-smelling incense, or a tall flask of perfume (myrrh).
 */
export function MagiGift({ kind, skin }: { kind: MagiGiftKind; skin: string }) {
  const gold = useShade('#f2c040', 0.45, 0.2)
  const silver = useShade('#b9c7e0', 0.5, 0.2)
  const rose = useShade('#d26a94', 0.45, 0.2)
  return (
    <g strokeLinejoin="round">
      <defs>{gold.def}{silver.def}{rose.def}</defs>
      {kind === 'gold' && (
        <g>
          <rect x={-18} y={-73} width={36} height={23} rx={3} fill={gold.fill} stroke="#a8761a" strokeWidth={2} />
          <path d="M-20 -73 C-18 -86 18 -86 20 -73 Z" fill={gold.fill} stroke="#a8761a" strokeWidth={2} />
          <path d="M-20 -73 L20 -73" stroke="#a8761a" strokeWidth={2.5} />
          <circle cx={-9} cy={-62} r={3.2} fill="#e0506a" stroke="#a83048" strokeWidth={1} />
          <circle cx={9} cy={-62} r={3.2} fill="#4f8fe0" stroke="#2f5fa8" strokeWidth={1} />
          <circle cx={0} cy={-78} r={2.6} fill="#5fd39a" stroke="#2f8f5a" strokeWidth={1} />
        </g>
      )}
      {kind === 'incense' && (
        <g>
          <path d="M-15 -53 C-21 -61 -18 -74 -9 -77 L9 -77 C18 -74 21 -61 15 -53 C8 -48 -8 -48 -15 -53 Z" fill={silver.fill} stroke="#6f7f9e" strokeWidth={2} />
          <path d="M-11 -77 C-9 -87 9 -87 11 -77 Z" fill={silver.fill} stroke="#6f7f9e" strokeWidth={2} />
          <circle cx={0} cy={-88} r={3} fill="#f2c040" stroke="#a8761a" strokeWidth={1.2} />
          <path d="M-16 -65 L16 -65" stroke="#f2c040" strokeWidth={3} />
        </g>
      )}
      {kind === 'myrrh' && (
        <g>
          <path d="M-5 -88 L5 -88 L5 -81 C16 -77 17 -64 13 -57 C9 -50 -9 -50 -13 -57 C-17 -64 -16 -77 -5 -81 Z" fill={rose.fill} stroke="#9a3f66" strokeWidth={2} />
          <rect x={-7} y={-94} width={14} height={8} rx={3} fill="#f2c040" stroke="#a8761a" strokeWidth={1.5} />
          <path d="M-12.5 -68 L12.5 -68" stroke="#f2c040" strokeWidth={3} />
          <ellipse cx={-6} cy={-74} rx={2.5} ry={4.5} fill="#fff" opacity={0.5} />
        </g>
      )}
      {/* his hands, holding it */}
      {[-1, 1].map((d) => <circle key={d} cx={d * 13} cy={-58} r={7} fill={skin} stroke={ink(skin)} strokeWidth={2} />)}
    </g>
  )
}

/** One of the wise men (WISE_MEN[i]), carrying his gift, with a gold hem on his robe. (x, y) = his feet. */
export function WiseMan({ x, y, s = 1, i, gift, facing, blinkDelay }: { x: number; y: number; s?: number; i: number; gift: MagiGiftKind; facing?: 'left' | 'right'; blinkDelay?: number }) {
  const m = WISE_MEN[i]
  return (
    <Person x={x} y={y} s={s} look={m.look} pose="hold" facing={facing} blinkDelay={blinkDelay}>
      <Turban color={m.turban} gem={m.gem} />
      <path d="M-35 -10 Q0 -1 35 -10 L33.6 -18 Q0 -9 -33.6 -18 Z" fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={1.5} />
      <MagiGift kind={gift} skin={m.look.skin} />
    </Person>
  )
}

/**
 * A camel resting on the ground with its legs folded under it (page 11), side view facing right, with a
 * bright saddle cloth over its hump. (x, y) = where it rests on the ground.
 */
export function Camel({ x, y, s = 1, blinkDelay = 0 }: { x: number; y: number; s?: number; blinkDelay?: number }) {
  const c = '#d9a86c'
  const coat = useShade(c, 0.3, 0.2)
  const line = ink(c)
  const cloth = '#5f8fd0'
  const pad = darken(c, 0.32)
  // (the cloth's lower edge, for its fringe)
  const fringe = (fx: number) => -47 - 6 * ((fx + 12) / 44) ** 2
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{coat.def}</defs>
      <ellipse cx={-4} cy={-2} rx={100} ry={6} fill="#000" opacity={0.14} />
      <g className="pa-tail" style={{ '--o': '100% 0%' } as CSSProperties}>
        <path d="M-88 -48 Q-100 -38 -96 -22" stroke={line} strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={-96} cy={-18} rx={5} ry={8} fill={darken(c, 0.4)} />
      </g>
      {/* the far legs' folded feet, peeking out under it */}
      <ellipse cx={-62} cy={-5} rx={14} ry={5} fill={pad} />
      <ellipse cx={46} cy={-4} rx={13} ry={5} fill={pad} />
      {/* the body, with its big hump */}
      <path d="M-92 -28 C-96 -52 -82 -68 -62 -70 C-52 -108 20 -116 34 -72 C56 -70 78 -60 82 -40 C86 -22 74 -6 52 -6 L-74 -6 C-88 -8 -92 -16 -92 -28 Z" fill={coat.fill} stroke={line} strokeWidth={3} />
      {/* the near legs, folded under it: the back leg's haunch and foot, the front leg's knee */}
      <path d="M-80 -8 C-86 -34 -50 -42 -34 -24 C-28 -16 -30 -6 -38 -4 L-76 -4 C-80 -4 -80 -6 -80 -8 Z" fill={coat.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={-86} cy={-5} rx={10} ry={5} fill={pad} stroke={ink(pad)} strokeWidth={1.5} />
      <path d="M28 -4 C28 -24 62 -30 76 -14 C80 -6 74 -1 64 -1 L32 -1 C29 -1 28 -2 28 -4 Z" fill={coat.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={66} cy={-12} rx={6} ry={4} fill={pad} opacity={0.6} />
      {/* a saddle cloth over its hump (the top of the hump shows above it), with a golden stripe and fringe */}
      <path d="M-52 -76 C-38 -94 12 -96 26 -76 L30 -52 C6 -45 -32 -45 -56 -52 Z" fill={cloth} stroke={ink(cloth)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-54 -62 C-30 -55 8 -55 28 -62" stroke="#ffd34d" strokeWidth={4} fill="none" />
      {[-50, -38, -26, -14, -2, 10, 22, 29].map((fx) => <circle key={fx} cx={fx} cy={fringe(fx)} r={2.6} fill="#ffd34d" />)}
      {/* the long, curving neck */}
      <path d="M48 -66 C80 -80 100 -90 104 -118 L128 -112 C126 -80 108 -44 74 -34 Z" fill={coat.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      {/* a little round ear, then the long head with its soft nose */}
      <ellipse cx={104} cy={-140} rx={5} ry={8.5} transform="rotate(-40 104 -140)" fill={coat.fill} stroke={line} strokeWidth={2.5} />
      <path d="M100 -126 C102 -142 124 -146 140 -138 C152 -132 158 -122 154 -112 C150 -104 138 -104 128 -108 C114 -110 100 -114 100 -126 Z" fill={coat.fill} stroke={line} strokeWidth={3} />
      <ellipse cx={145} cy={-117} rx={11} ry={9} fill="#f0d8b0" />
      <path d="M149 -124 q3 -2 6 1" stroke={darken(c, 0.45)} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M139 -109 Q146 -106 152 -110" stroke={darken(c, 0.45)} strokeWidth={2} fill="none" strokeLinecap="round" />
      <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
        <ellipse cx={120} cy={-129} rx={3.6} ry={4.5} fill="#2b2140" />
        <circle cx={118.8} cy={-130.6} r={1.4} fill="#fff" />
      </g>
      <path d="M115.5 -134 l-3 -3 M119.5 -135 l-1 -4 M123.5 -134 l1 -4" stroke="#2b2140" strokeWidth={1.4} strokeLinecap="round" />
      <ellipse cx={126} cy={-121} rx={4} ry={2.5} fill="#ff7fb0" opacity={0.45} />
    </g>
  )
}

/** A soft beam of starlight shining straight down from (x, y) to y2. */
function StarBeam({ x, y, y2, w = 130 }: { x: number; y: number; y2: number; w?: number }) {
  const id = gid(useId())
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3a0" stopOpacity={0.42} /><stop offset="1" stopColor="#fff3a0" stopOpacity={0.06} /></linearGradient>
      </defs>
      <path d={`M${x - 12} ${y} L${x + 12} ${y} L${x + w / 2} ${y2} L${x - w / 2} ${y2} Z`} fill={`url(#${id})`} />
    </g>
  )
}

/** The house in Bethlehem where the wise men found Jesus (page 11), its doorway glowing. `children` stand in the doorway; (x, y) = the doorstep. */
function StarHouse({ x, y, children }: { x: number; y: number; children?: ReactNode }) {
  const c = '#b6a6d0'
  const clip = `hs${gid(useId())}`
  const door = `M${x - 42} ${y} L${x - 42} ${y - 118} Q${x} ${y - 166} ${x + 42} ${y - 118} L${x + 42} ${y} Z`
  return (
    <g>
      <rect x={x - 118} y={y - 172} width={236} height={172} fill={c} stroke="#7c6c9a" strokeWidth={3} />
      <rect x={x - 125} y={y - 182} width={250} height={13} rx={3} fill="#8c7cae" />
      {[x - 92, x + 92].map((wx) => <rect key={wx} x={wx - 15} y={y - 142} width={30} height={30} rx={12} fill="#ffd76a" />)}
      <defs><clipPath id={clip}><path d={door} /></clipPath></defs>
      <path d={door} fill="#ffd98a" />
      <g clipPath={`url(#${clip})`}><Glow x={x} y={y - 70} r={120} color="#fff3c0" /></g>
      <path d={door} fill="none" stroke="#7c6c9a" strokeWidth={3} />
      {children}
    </g>
  )
}

// ---------- Pages: part one ----------

// 1. "Long ago, in a little town called Nazareth, there lived a young woman named Mary. One day, God sent an
// angel named Gabriel to visit her!" Gabriel comes in a soft glow of light, and Mary is very surprised.
const PageGabriel = () => (
  <MaryHome town="This is Nazareth, Mary's little town.">
    <Glow x={590} y={226} r={220} color="#fff3c0" />
    <Rays x={590} y={226} r={330} n={14} color="#fff3b0" opacity={0.3} />
    <Tap say="Hello, Mary! God is with you!" sfx="sparkle">
      <g className="sc-float"><Person x={590} y={344} s={1.22} look={PEOPLE.angel} pose="wave" facing="left" /></g>
    </Tap>
    <Tap say="Oh my! An angel!">
      <Person x={330} y={420} s={1.2} look={PEOPLE.mary} pose="hold" blinkDelay={0.6}><Surprised look={PEOPLE.mary} /></Person>
    </Tap>
    <Sparkles spots={[[470, 150, 9], [706, 176, 8], [530, 92, 6], [676, 316, 7], [474, 318, 6]]} />
  </MaryHome>
)

// 2. 'Gabriel said, "Don't be afraid, Mary! You will have a baby boy. He is God's own Son. Name Him Jesus!"
// Mary was so happy. She said yes to God!' The same room: Mary, full of joy, with little hearts.
const PageNews = () => (
  <MaryHome town="Mary's little town is called Nazareth.">
    <Glow x={590} y={226} r={200} color="#fff3c0" />
    <Tap say="Nothing is too hard for God!" sfx="sparkle">
      <g className="sc-float"><Person x={590} y={344} s={1.22} look={PEOPLE.angel} pose="arms-up" facing="left" /></g>
    </Tap>
    <Tap say="Yes! I will do what God wants." sfx="good">
      <Person x={330} y={420} s={1.2} look={PEOPLE.mary} pose="pray" blinkDelay={0.6} />
    </Tap>
    <Tap say="Mary is so happy!" sfx="ding">
      <Heart x={296} y={206} s={1.1} />
      <Heart x={366} y={178} s={0.8} />
      <Heart x={262} y={150} s={0.62} />
    </Tap>
    <Sparkles spots={[[470, 150, 9], [706, 176, 8], [530, 92, 6], [430, 236, 6]]} />
  </MaryHome>
)

// 3. "Mary was going to marry a kind man named Joseph. An angel came to Joseph in a dream, and told him all
// about the baby. Joseph trusted God, and took good care of Mary." Joseph asleep at home; in his dream, the
// angel and Mary.
const PageDream = () => (
  <JosephHome tools="Joseph is a carpenter. He makes things out of wood!" stool="Joseph made this little stool!">
    <Tap say="Shh! Joseph is fast asleep." sfx="pop"><Sleeper x={262} y={414} s={1.05} look={PEOPLE.joseph} /></Tap>
    <Tap say="Don't be afraid, Joseph! Mary's baby is from God." sfx="sparkle">
      <DreamCloud x={604} y={150} rx={160} ry={102} from={[400, 312]}>
        <ellipse cx={604} cy={224} rx={118} ry={12} fill="#e2d8fa" />
        <Glow x={548} y={160} r={86} color="#fff3c0" />
        <Person x={548} y={222} s={0.6} look={PEOPLE.angel} pose="wave" />
        <Person x={662} y={224} s={0.6} look={PEOPLE.mary} pose="pray" facing="left" blinkDelay={1.2} />
        <Sparkles spots={[[612, 96, 6], [500, 110, 5], [712, 130, 5]]} />
      </DreamCloud>
    </Tap>
  </JosephHome>
)

// 4. "Mary and Joseph took a long trip to Bethlehem, King David's little town. Mary was going to have a very special baby!"
const PageTrip = () => (
  <Scene sky="dawn" ground="none">
    <path d="M430 312 Q610 226 800 286 L800 340 L430 340 Z" fill="#efcf96" />
    {[[540, 284, 50, 34], [586, 270, 56, 44], [636, 262, 48, 36], [680, 268, 52, 40], [612, 296, 60, 34]].map(([hx, hy, w, h], i) => (
      <FlatHouse key={i} x={hx} y={hy} w={w} h={h} />
    ))}
    <path d="M0 330 Q160 292 320 322 Q520 290 800 318 L800 450 L0 450 Z" fill="#f2d39a" />
    <path d="M0 392 Q240 362 480 388 T800 382 L800 450 L0 450 Z" fill="#e8bf7a" />
    <path d="M40 450 Q240 404 420 372 Q540 344 610 312 L628 314 Q570 356 450 392 Q300 432 200 450 Z" fill="#fbe6bd" opacity={0.85} />
    <Palm x={110} y={392} s={0.85} />
    <Glow x={300} y={300} r={90} color="#fff3c8" />
    <Tap say="Hee-haw!" sfx="wobble"><Donkey x={300} y={420} s={1.05} rider={PEOPLE.mary} /></Tap>
    <Tap say="Bethlehem is just ahead!"><Person x={450} y={414} s={1.05} look={PEOPLE.joseph} holding="stick" blinkDelay={1.3} /></Tap>
    <Sparkles spots={[[250, 210, 8], [350, 200, 6], [300, 175, 5]]} />
  </Scene>
)

// 5. "The town was so busy, there was no room for them to stay. So they stayed in a place where animals sleep."
const PageNoRoom = () => (
  <Scene sky="night" ground="none">
    <NightMoon />
    <path d="M0 330 Q200 300 400 318 T800 312 L800 450 L0 450 Z" fill="#6a5f96" />
    <FlatHouse x={350} y={318} w={70} h={56} color="#a898c4" lit win={2} />
    <FlatHouse x={432} y={322} w={56} h={44} color="#9a8ab8" lit />
    <FlatHouse x={505} y={316} w={64} h={52} color="#a898c4" lit win={2} />
    <path d="M0 384 Q240 364 480 386 T800 376 L800 450 L0 450 Z" fill="#5a5088" />
    {/* the inn, full up: someone at every window */}
    <g>
      <rect x={90} y={236} width={200} height={170} fill="#b6a6d0" stroke="#7c6c9a" strokeWidth={3} />
      <rect x={84} y={228} width={212} height={12} rx={3} fill="#8c7cae" />
      {[[110, 256], [230, 256], [110, 312], [230, 312]].map(([wx, wy], i) => (
        <g key={i}>
          <rect x={wx} y={wy} width={40} height={36} rx={14} fill="#ffd76a" />
          <circle cx={wx + 20} cy={wy + 26} r={9} fill="#8a6a50" opacity={0.7} />
          <rect x={wx + 9} y={wy + 32} width={22} height={6} rx={3} fill="#8a6a50" opacity={0.7} />
        </g>
      ))}
      <path d="M160 406 L160 330 Q190 306 220 330 L220 406 Z" fill="#ffcf6a" />
    </g>
    <Tap say="So sorry, the inn is full! You can stay where the animals sleep."><Person x={190} y={404} s={0.92} look={INNKEEPER} pose="point" /></Tap>
    <GlowingStable x={672} y={398} s={0.62}>
      <Tap say="Moo!" sfx="wobble"><Cow x={646} y={396} s={0.42} facing="left" /></Tap>
      <Sheep x={702} y={396} s={0.36} facing="left" />
    </GlowingStable>
    <Tap say="Hee-haw!" sfx="wobble"><Donkey x={566} y={420} s={0.72} flip blinkDelay={2.6} /></Tap>
    <Tap say="Is there any room for us?"><Person x={360} y={414} s={1.05} look={PEOPLE.joseph} holding="stick" facing="left" blinkDelay={0.5} /></Tap>
    <Person x={450} y={418} s={1} look={PEOPLE.mary} pose="hold" facing="left" blinkDelay={1.8} />
  </Scene>
)

// ---------- Pages: part two ----------

// 6. "One night, in the little stable, baby Jesus was born! Mary wrapped Him up snug and warm, and laid Him in a manger, …"
const PageBorn = () => (
  <Scene sky="night" ground="stable">
    <rect x={130} y={56} width={110} height={96} rx={8} fill="#2a2660" stroke="#7a5233" strokeWidth={8} />
    <path d="M185 56 L185 152 M130 104 L240 104" stroke="#7a5233" strokeWidth={6} />
    <path className="pa-twinkle" d="M212 68 L215 78 L225 81 L215 84 L212 94 L209 84 L199 81 L209 78 Z" fill="#fff3a0" />
    <path d="M640 0 L640 60" stroke="#5a3a20" strokeWidth={3} />
    <Glow x={640} y={84} r={70} color="#ffd98a" />
    <rect x={624} y={60} width={32} height={44} rx={8} fill="#ffe8a0" stroke="#7a5233" strokeWidth={4} />
    <Glow x={400} y={330} r={170} color="#fff3c0" />
    {/* the animals, at real size, both looking at the baby */}
    <Tap say="Moo!" sfx="wobble"><Cow x={124} y={380} s={0.95} /></Tap>
    <Tap say="Hee-haw!" sfx="wobble"><Donkey x={692} y={398} s={0.9} flip blinkDelay={2.2} /></Tap>
    <Tap say="His name is Jesus."><Person x={270} y={420} s={1.15} look={PEOPLE.mary} pose="pray" blinkDelay={0.4} /></Tap>
    <Person x={540} y={420} s={1.15} look={PEOPLE.joseph} holding="stick" facing="left" blinkDelay={1.6} />
    <Tap say="Baby Jesus is fast asleep." sfx="sparkle"><Manger x={400} y={418} s={1.45} baby={<Baby x={6} y={-64} s={1} />} /></Tap>
    <Sparkles spots={[[340, 270, 8], [460, 260, 10], [400, 230, 6]]} />
  </Scene>
)

// 7. "Out in the fields, shepherds were watching their sheep in the night."
const PageFields = () => (
  <Scene sky="night" ground="none">
    <NightMoon />
    <path d="M420 296 Q560 226 720 280 L720 320 L420 320 Z" fill="#4a5c96" />
    {[[508, 268, 34, 24], [542, 260, 38, 30], [580, 256, 34, 26], [616, 262, 36, 26]].map(([hx, hy, w, h], i) => (
      <FlatHouse key={i} x={hx} y={hy} w={w} h={h} color="#8a86b8" lit />
    ))}
    <NightHills />
    <Tap say="Crackle, crackle!" sfx="sizzle"><Campfire x={400} y={410} s={1} /></Tap>
    <Tap say="I keep my sheep safe, all night long."><Person x={220} y={410} s={1.15} look={PEOPLE.shepherd} holding="staff" /></Tap>
    <Person x={310} y={418} s={1.2} look={SHEPHERD_BOY} pose="hold" blinkDelay={1.2} />
    <Sheep x={735} y={346} s={0.42} facing="left" />
    <Sheep x={600} y={360} s={0.6} facing="left" />
    <Tap say="Baa!" sfx="wobble"><Sheep x={520} y={414} s={0.9} /></Tap>
    <Tap say="Baa!" sfx="wobble"><Sheep x={650} y={404} s={0.85} facing="left" /></Tap>
  </Scene>
)

// 8. "Suddenly, an angel came, and God's bright glory shone all around! The angel said, "Don't be afraid! …""
// Still night, but the glory lights up the sky and the field all around them.
const PageAngel = () => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <Scene sky="night" ground="none">
      <GloryLight x={410} y={210} r={440} />
      <Rays x={410} y={160} r={560} n={18} color="#ffe28a" opacity={0.6} />
      <defs>
        <radialGradient id={`hb${id}`} gradientUnits="userSpaceOnUse" cx={400} cy={300} r={470}>
          <stop offset="0" stopColor="#dfe0a0" /><stop offset="0.5" stopColor="#c6d290" /><stop offset="0.8" stopColor="#7f9086" /><stop offset="1" stopColor="#3e5e86" />
        </radialGradient>
        <radialGradient id={`hf${id}`} gradientUnits="userSpaceOnUse" cx={400} cy={330} r={470}>
          <stop offset="0" stopColor="#c8dc90" /><stop offset="0.5" stopColor="#abd086" /><stop offset="0.8" stopColor="#6c8e7c" /><stop offset="1" stopColor="#35577a" />
        </radialGradient>
      </defs>
      <path d="M0 300 Q160 262 340 292 Q540 250 800 286 L800 450 L0 450 Z" fill={`url(#hb${id})`} />
      <path d="M0 362 Q220 330 440 360 T800 350 L800 450 L0 450 Z" fill={`url(#hf${id})`} />
      <Glow x={410} y={170} r={240} color="#ffd970" />
      <Tap say="Don't be afraid! I bring you happy news!" sfx="sparkle">
        <g className="sc-float">
          <Person x={410} y={290} s={1.3} look={PEOPLE.angel} pose="wave" />
        </g>
      </Tap>
      <Tap say="Wow, an angel!"><Person x={150} y={412} s={1.05} look={PEOPLE.shepherd} pose="arms-up" /></Tap>
      <Person x={238} y={420} s={1.1} look={SHEPHERD_BOY} pose="arms-up" blinkDelay={0.7} />
      <Tap say="Baa!" sfx="wobble"><Sheep x={590} y={414} s={0.85} facing="left" /></Tap>
      <Sheep x={670} y={392} s={0.7} facing="left" />
      <Sparkles spots={[[260, 120, 12], [570, 110, 10], [300, 230, 7], [540, 240, 8], [410, 50, 9]]} />
    </Scene>
  )
}

// 9. "The angel said, "Today a Savior is born for you, Christ the Lord! …" Then lots and lots of angels sang, "Glory to God!""
const ANGELS: [number, number, number, 'arms-up' | 'pray'][] = [
  [300, 120, 0.42, 'pray'], [500, 116, 0.42, 'pray'], [150, 220, 0.5, 'arms-up'], [650, 218, 0.5, 'arms-up'],
  [270, 260, 0.58, 'arms-up'], [530, 258, 0.58, 'arms-up'], [400, 230, 0.75, 'pray'],
]
const PageChoir = () => (
  <Scene sky="night" ground="none">
    <NightHills />
    {/* the whole choir hops and sings together */}
    <Tap say="Glory to God!" sfx="ding">
      {ANGELS.map(([ax, ay, s, pose], i) => (
        <g key={i} className="sc-float" style={{ animationDelay: `${i * 0.4}s` }}>
          <Glow x={ax} y={ay - 80 * s} r={110 * s} color="#fff3c0" />
          <Person x={ax} y={ay} s={s} look={SINGER} pose={pose} blinkDelay={i * 0.6} />
        </g>
      ))}
    </Tap>
    <Note x={200} y={120} s={1.1} />
    <Note x={600} y={100} s={1.2} d={0.8} color="#ffd6ee" />
    <Note x={360} y={70} d={1.4} color="#ffd6ee" />
    <Note x={450} y={300} s={0.9} d={0.5} />
    <Note x={120} y={330} s={0.8} d={1.1} color="#ffd6ee" />
    <Sparkles spots={[[90, 90, 6], [710, 150, 7], [215, 300, 5], [590, 300, 6]]} />
    <Tap say="Let's go to Bethlehem!"><Person x={600} y={420} s={0.85} look={PEOPLE.shepherd} pose="arms-up" facing="left" blinkDelay={0.9} /></Tap>
    <Person x={672} y={424} s={0.9} look={SHEPHERD_BOY} pose="arms-up" facing="left" blinkDelay={1.9} />
    <Tap say="Baa!" sfx="wobble"><Sheep x={210} y={420} s={0.7} /></Tap>
    <Sheep x={300} y={410} s={0.6} facing="left" />
  </Scene>
)

// 10. "The shepherds hurried and found baby Jesus, just like the angel said! Jesus is God's best gift to us. …"
// Everyone at one size, in the stable: Joseph and Mary, the manger, and the shepherds at the manger.
const PageFound = () => (
  <Scene sky="night" ground="none">
    <NightHills />
    <BrightStar x={660} y={62} s={0.5} />
    <GlowingStable x={420} y={404} s={1.75}>
      <Person x={282} y={402} s={0.85} look={PEOPLE.joseph} holding="stick" blinkDelay={1.4} />
      <Person x={350} y={402} s={0.85} look={PEOPLE.mary} pose="pray" blinkDelay={0.6} />
      <Tap say="Baby Jesus, God's best gift!" sfx="sparkle"><Manger x={432} y={404} s={1} baby={<Baby x={6} y={-64} s={1} />} /></Tap>
      <Person x={508} y={404} s={0.85} look={SHEPHERD_BOY} pose="pray" facing="left" blinkDelay={1} />
      <Tap say="We found Him, just like the angel said!"><Person x={562} y={402} s={0.85} look={PEOPLE.shepherd} pose="pray" facing="left" blinkDelay={2.1} /></Tap>
    </GlowingStable>
    <Tap say="Baa!" sfx="wobble"><Sheep x={694} y={430} s={0.7} facing="left" /></Tap>
    <Sheep x={110} y={428} s={0.6} />
    <Tap say="God loves you so much!" sfx="ding"><Heart x={432} y={300} s={1} /></Tap>
    <Sparkles spots={[[370, 262, 6], [500, 256, 7], [432, 240, 5]]} />
  </Scene>
)

// 11. "Later, wise men from far away followed a bright star all the way to Jesus. They brought Him wonderful
// gifts. Jesus is God's best gift, for the whole wide world!" The star shines over the house where Jesus is
// (Matthew 2:11: "the young child with Mary, his mother"): a little boy now, not the newborn in the manger,
// so the picture says "later" too. He waves to the wise men from the doorstep, with Mary in the doorway;
// they bring their gifts, and their camel rests after the long trip.
/** Jesus as a little boy, a while after He was born (page 11), in the colors He wears grown up (PEOPLE.jesus). */
const LITTLE_JESUS: Look = { ...PEOPLE.jesus, hair: 'short', beard: undefined, build: 'child' }

const PageWiseMen = () => (
  <Scene sky="night" ground="none">
    <Tap say="The star showed the wise men the way to Jesus!" sfx="sparkle">
      <BrightStar x={650} y={66} s={0.72} />
    </Tap>
    <StarBeam x={650} y={78} y2={232} w={150} />
    <path d="M0 312 Q120 270 260 300 Q380 276 520 304 L520 360 L0 360 Z" fill="#5e5490" />
    <path d="M0 330 Q200 300 400 318 T800 312 L800 450 L0 450 Z" fill="#6a5f96" />
    <path d="M0 384 Q240 364 480 386 T800 376 L800 450 L0 450 Z" fill="#5a5088" />
    <StarHouse x={650} y={412}>
      <Tap say="Come in! This is Jesus." sfx="sparkle">
        <Person x={656} y={410} s={0.92} look={PEOPLE.mary} pose="hold" facing="left" blinkDelay={0.8} />
        {/* little Jesus, on the doorstep in front of Mary, waving to the wise men */}
        <Person x={622} y={414} s={0.72} look={LITTLE_JESUS} pose="wave" facing="left" blinkDelay={2.6} />
      </Tap>
    </StarHouse>
    <Tap say="Phew! What a long, long trip!" sfx="wobble"><Camel x={110} y={418} s={0.74} blinkDelay={1.6} /></Tap>
    <Tap say="We brought gifts for Jesus, the King!" sfx="ding">
      <WiseMan x={300} y={420} s={0.95} i={2} gift="myrrh" blinkDelay={2.2} />
      <WiseMan x={398} y={424} s={0.95} i={1} gift="incense" blinkDelay={1.1} />
      <WiseMan x={496} y={420} s={0.95} i={0} gift="gold" blinkDelay={0.3} />
    </Tap>
    <Sparkles spots={[[560, 140, 6], [740, 150, 5], [600, 210, 5]]} />
  </Scene>
)

export const CHRISTMAS_ART: ComponentType[] = [
  PageGabriel, PageNews, PageDream, PageTrip, PageNoRoom,
  PageBorn, PageFields, PageAngel, PageChoir, PageFound, PageWiseMen,
]
