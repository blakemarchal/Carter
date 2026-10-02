// Baby Jesus Is Born: one illustration per story page (see data/christmas.ts for the words).
// God is never drawn as a person: His glory is light (the 'glory' sky, Glow, rays, Sparkles).
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, useShade } from '../kit'
import { Baby, Person, PEOPLE, type Look } from '../people'
import { BigStar, Emoji, Glow, Manger, Palm, Scene, Sheep, Sparkles, Stable } from './kit'

// ---------- Local props ----------

/** A friendly little donkey, side view facing right (origin at the hooves). `rider` sits on its back. */
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
        <clipPath id={clip}><rect x={-90} y={-280} width={180} height={196} /></clipPath>
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
      {rider ? (
        <>
          <g clipPath={`url(#${clip})`}><Person x={-6} y={-40} s={0.8} look={rider} pose="hold" blinkDelay={blinkDelay + 0.7} /></g>
          <path d="M-34 -84 Q-6 -94 26 -86 L30 -60 Q-2 -52 -32 -58 Z" fill="#c0504d" stroke={ink('#c0504d')} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M-26 -88 Q-6 -94 14 -88 L22 -60 Q12 -50 2 -52 L-16 -56 Z" fill={rider.robe} stroke={ink(rider.robe)} strokeWidth={2.5} strokeLinejoin="round" />
          <ellipse cx={14} cy={-52} rx={8} ry={4.5} fill="#7a5233" />
        </>
      ) : (
        <path d="M-30 -86 Q-2 -94 26 -86 L30 -60 Q-2 -52 -32 -58 Z" fill="#c0504d" stroke={ink('#c0504d')} strokeWidth={2.5} strokeLinejoin="round" />
      )}
      {[-24, -12, 0, 12, 24].map((fx) => <circle key={fx} cx={fx} cy={-56} r={2.6} fill="#ffd34d" />)}
    </g>
  )
}

/** A Bethlehem house: flat roof, arched door; `lit` glows its windows for the night. */
function FlatHouse({ x, y, w = 60, h = 50, color = '#ecd9b0', lit, win = 1 }: { x: number; y: number; w?: number; h?: number; color?: string; lit?: boolean; win?: number }) {
  const glass = lit ? '#ffd76a' : '#6b4422'
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={color} stroke={ink(color)} strokeWidth={2.5} />
      <rect x={x - w / 2 - 3} y={y - h - 6} width={w + 6} height={8} rx={2} fill={darken(color, 0.12)} />
      <path d={`M${x - 7} ${y} L${x - 7} ${y - 15} Q${x} ${y - 23} ${x + 7} ${y - 15} L${x + 7} ${y} Z`} fill={lit ? '#e8a640' : '#8a5a2e'} />
      {Array.from({ length: win }, (_, i) => {
        const wx = x - w / 2 + ((i + 1) * w) / (win + 1)
        return <rect key={i} x={wx - 5} y={y - h + 10} width={10} height={11} rx={4} fill={glass} />
      })}
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

/** Soft beams of light fanning out from (x, y); they turn very slowly. */
function Rays({ x, y, r = 520, n = 16, color = '#fff6b0', opacity = 0.25 }: { x: number; y: number; r?: number; n?: number; color?: string; opacity?: number }) {
  const w = (Math.PI * r) / n / 2.4
  return (
    <g className="pa-spin">
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M0 0 L${-w} ${-r} L${w} ${-r} Z`} transform={`translate(${x} ${y}) rotate(${(i * 360) / n})`} fill={color} opacity={opacity} />
      ))}
    </g>
  )
}

/** A stable seen from outside at night, glowing warm inside; `children` are drawn in the doorway. */
function GlowingStable({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  return (
    <g>
      <Stable x={x} y={y} s={s} />
      <rect x={x - 100 * s} y={y - 90 * s} width={200 * s} height={90 * s} fill="#ffd98a" opacity={0.9} />
      <Glow x={x} y={y - 30 * s} r={110 * s} color="#fff3c0" />
      <path d={`M${x - 100 * s} ${y} L${x + 100 * s} ${y} L${x + 100 * s} ${y - 14 * s} Q${x} ${y - 24 * s} ${x - 100 * s} ${y - 14 * s} Z`} fill="#e8c86a" />
      {children}
    </g>
  )
}

const INNKEEPER: Look = { skin: '#c68b5e', hair: 'covered', hairColor: '#3b2a20', wrap: '#f5f0e6', robe: '#c98448', sash: '#7cb06a', beard: 'short', beardColor: '#3b2a20' }
const SINGER: Look = { ...PEOPLE.angel, glow: false }
const SHEPHERD_BOY: Look = { ...PEOPLE.shepherd, build: 'child', beard: undefined, wrap: '#c0504d', robe: '#a88a5a', sash: '#e8dcc0' }

// ---------- Pages ----------

// 1. "Mary and Joseph took a long trip to the little town of Bethlehem. Mary was going to have a very special baby!"
const Page1 = () => (
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
    <Donkey x={300} y={420} s={1.05} rider={PEOPLE.mary} />
    <Person x={450} y={414} s={1.05} look={PEOPLE.joseph} holding="staff" blinkDelay={1.3} />
    <Sparkles spots={[[250, 210, 8], [350, 200, 6], [300, 175, 5]]} />
  </Scene>
)

// 2. "The town was so busy, there was no room for them to stay. So they stayed in a place where animals sleep."
const Page2 = () => (
  <Scene sky="night" ground="none" moon>
    <path d="M0 330 Q200 300 400 318 T800 312 L800 450 L0 450 Z" fill="#6a5f96" />
    <FlatHouse x={350} y={318} w={70} h={56} color="#a898c4" lit win={2} />
    <FlatHouse x={432} y={322} w={56} h={44} color="#9a8ab8" lit />
    <FlatHouse x={505} y={316} w={64} h={52} color="#a898c4" lit win={2} />
    <path d="M0 384 Q240 364 480 386 T800 376 L800 450 L0 450 Z" fill="#5a5088" />
    <g>
      <rect x={90} y={236} width={200} height={170} fill="#b6a6d0" stroke="#7c6c9a" strokeWidth={3} />
      <rect x={84} y={228} width={212} height={12} rx={3} fill="#8c7cae" />
      {[[110, 256], [170, 256], [230, 256], [110, 312], [230, 312]].map(([wx, wy], i) => (
        <g key={i}>
          <rect x={wx} y={wy} width={40} height={36} rx={14} fill="#ffd76a" />
          <circle cx={wx + 20} cy={wy + 26} r={9} fill="#8a6a50" opacity={0.7} />
          <rect x={wx + 9} y={wy + 32} width={22} height={6} rx={3} fill="#8a6a50" opacity={0.7} />
        </g>
      ))}
      <path d="M160 406 L160 330 Q190 306 220 330 L220 406 Z" fill="#ffcf6a" />
    </g>
    <Person x={190} y={404} s={0.8} look={INNKEEPER} pose="point" />
    <GlowingStable x={630} y={398} s={0.62}>
      <Emoji e="🐄" x={608} y={366} size={34} />
      <Emoji e="🐑" x={656} y={374} size={26} />
    </GlowingStable>
    <Person x={360} y={414} s={1.05} look={PEOPLE.joseph} holding="staff" facing="left" blinkDelay={0.5} />
    <Person x={450} y={418} s={1} look={PEOPLE.mary} pose="hold" facing="left" blinkDelay={1.8} />
  </Scene>
)

// 3. "That night, baby Jesus was born! Mary wrapped Him up snug and warm, and laid Him in a manger, …"
const Page3 = () => (
  <Scene sky="night" ground="stable">
    <rect x={130} y={56} width={110} height={96} rx={8} fill="#2a2660" stroke="#7a5233" strokeWidth={8} />
    <path d="M185 56 L185 152 M130 104 L240 104" stroke="#7a5233" strokeWidth={6} />
    <path className="pa-twinkle" d="M212 68 L215 78 L225 81 L215 84 L212 94 L209 84 L199 81 L209 78 Z" fill="#fff3a0" />
    <path d="M640 0 L640 60" stroke="#5a3a20" strokeWidth={3} />
    <Glow x={640} y={84} r={70} color="#ffd98a" />
    <rect x={624} y={60} width={32} height={44} rx={8} fill="#ffe8a0" stroke="#7a5233" strokeWidth={4} />
    <Glow x={400} y={330} r={170} color="#fff3c0" />
    <Emoji e="🐄" x={140} y={316} size={76} />
    <Donkey x={680} y={366} s={0.62} flip blinkDelay={2.2} />
    <Person x={270} y={420} s={1.15} look={PEOPLE.mary} pose="pray" blinkDelay={0.4} />
    <Person x={540} y={420} s={1.15} look={PEOPLE.joseph} holding="staff" facing="left" blinkDelay={1.6} />
    <Manger x={400} y={418} s={1.45} baby={<Baby x={6} y={-54} s={1} />} />
    <Sparkles spots={[[340, 270, 8], [460, 260, 10], [400, 230, 6]]} />
  </Scene>
)

// 4. "Out in the fields, shepherds were watching their sheep in the night."
const Page4 = () => (
  <Scene sky="night" ground="none" moon>
    <path d="M420 296 Q560 226 720 280 L720 320 L420 320 Z" fill="#4a5c96" />
    {[[508, 268, 34, 24], [542, 260, 38, 30], [580, 256, 34, 26], [616, 262, 36, 26]].map(([hx, hy, w, h], i) => (
      <FlatHouse key={i} x={hx} y={hy} w={w} h={h} color="#8a86b8" lit />
    ))}
    <NightHills />
    <Campfire x={400} y={410} s={1} />
    <Person x={220} y={410} s={1.15} look={PEOPLE.shepherd} holding="staff" />
    <Person x={310} y={418} s={1.2} look={SHEPHERD_BOY} pose="hold" blinkDelay={1.2} />
    <Sheep x={600} y={360} s={0.6} facing="left" />
    <Sheep x={520} y={414} s={0.9} />
    <Sheep x={650} y={404} s={0.85} facing="left" />
  </Scene>
)

// 5. "Suddenly, an angel came, and God's bright glory shone all around! The angel said, don't be afraid! …"
const Page5 = () => (
  <Scene sky="glory" ground="none" clouds={false}>
    <Rays x={410} y={150} r={600} n={18} color="#ffe28a" opacity={0.35} />
    <path d="M0 300 Q160 262 340 292 Q540 250 800 286 L800 450 L0 450 Z" fill="#c9dc9a" />
    <path d="M0 362 Q220 330 440 360 T800 350 L800 450 L0 450 Z" fill="#a8cf84" />
    <Glow x={410} y={170} r={240} color="#ffd970" />
    <g className="sc-float">
      <Person x={410} y={290} s={1.3} look={PEOPLE.angel} pose="wave" />
    </g>
    <Person x={150} y={412} s={1.05} look={PEOPLE.shepherd} pose="arms-up" />
    <Person x={238} y={420} s={1.1} look={SHEPHERD_BOY} pose="arms-up" blinkDelay={0.7} />
    <Sheep x={590} y={414} s={0.85} facing="left" />
    <Sheep x={670} y={392} s={0.7} facing="left" />
    <Sparkles spots={[[260, 120, 12], [570, 110, 10], [300, 230, 7], [540, 240, 8], [410, 50, 9]]} />
  </Scene>
)

// 6. "The angel said, today a Savior is born for you, Christ the Lord! Then lots and lots of angels sang, glory to God!"
const ANGELS: [number, number, number, 'arms-up' | 'pray'][] = [
  [300, 120, 0.42, 'pray'], [500, 116, 0.42, 'pray'], [150, 220, 0.5, 'arms-up'], [650, 218, 0.5, 'arms-up'],
  [270, 260, 0.58, 'arms-up'], [530, 258, 0.58, 'arms-up'], [400, 230, 0.75, 'pray'],
]
const Page6 = () => (
  <Scene sky="night" ground="none">
    <Glow x={400} y={170} r={260} color="#fff3c0" />
    <NightHills />
    {ANGELS.map(([ax, ay, s, pose], i) => (
      <g key={i} className="sc-float" style={{ animationDelay: `${i * 0.4}s` }}>
        <Glow x={ax} y={ay - 80 * s} r={110 * s} color="#fff3c0" />
        <Person x={ax} y={ay} s={s} look={SINGER} pose={pose} blinkDelay={i * 0.6} />
      </g>
    ))}
    <Note x={200} y={120} s={1.1} />
    <Note x={600} y={100} s={1.2} d={0.8} color="#ffd6ee" />
    <Note x={360} y={70} d={1.4} color="#ffd6ee" />
    <Note x={450} y={300} s={0.9} d={0.5} />
    <Note x={120} y={330} s={0.8} d={1.1} color="#ffd6ee" />
    <Person x={600} y={420} s={0.85} look={PEOPLE.shepherd} pose="arms-up" facing="left" blinkDelay={0.9} />
    <Person x={672} y={424} s={0.9} look={SHEPHERD_BOY} pose="arms-up" facing="left" blinkDelay={1.9} />
    <Sheep x={210} y={420} s={0.7} />
    <Sheep x={300} y={410} s={0.6} facing="left" />
  </Scene>
)

// 7. "The shepherds hurried and found baby Jesus, just like the angel said! Jesus is God's best gift to us, …"
const Page7 = () => (
  <Scene sky="night" ground="none">
    <NightHills />
    <path d="M420 104 L330 260 L510 260 Z" fill="#fff6b0" opacity={0.18} />
    <BigStar x={420} y={70} s={0.72} />
    <GlowingStable x={420} y={404} s={1.35}>
      <Person x={348} y={402} s={0.68} look={PEOPLE.mary} pose="pray" blinkDelay={0.6} />
      <Person x={494} y={402} s={0.7} look={PEOPLE.joseph} holding="staff" facing="left" blinkDelay={1.4} />
      <Manger x={420} y={404} s={0.85} baby={<Baby x={6} y={-54} s={1} />} />
    </GlowingStable>
    <Person x={130} y={414} s={1.05} look={PEOPLE.shepherd} pose="pray" blinkDelay={2.1} />
    <Person x={204} y={420} s={1.05} look={SHEPHERD_BOY} pose="pray" blinkDelay={1} />
    <Sheep x={668} y={420} s={0.8} facing="left" />
    <Sheep x={612} y={430} s={0.6} facing="left" />
    <Emoji e="💛" x={420} y={318} size={26} bob />
    <Sparkles spots={[[340, 250, 6], [500, 240, 7]]} />
  </Scene>
)

export const CHRISTMAS_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
