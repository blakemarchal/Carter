// Jonah and the Big Fish: one illustration per story page (see data/jonah.ts for the words).
// God's voice and care are shown as light (Glow, beams, Sparkles), never as a person.
import { useId, type ComponentType, type ReactNode } from 'react'
import { Person, PEOPLE, type Look } from '../people'
import { BigFish, Cloud, Dove, Emoji, Fish, Glow, Palm, Scene, Sea, Sparkles } from './kit'

// ---------- Local characters ----------

const KING: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', beard: 'long', beardColor: '#5a3a24', robe: '#c0504d', sash: '#ffd34d', crown: true }
const WOMAN: Look = { skin: '#8d5a3b', hair: 'covered', hairColor: '#3b2a20', wrap: '#f0a860', robe: '#e8c06a', sash: '#c0504d' }
const MAN: Look = { skin: '#d9a47a', hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#7aa0c0', sash: '#e0b45a' }
const GIRL: Look = { skin: '#c68b5e', hair: 'pigtails', hairColor: '#3b2a20', robe: '#ff9f80', sash: '#fff3c9', build: 'child' }

// ---------- Local props ----------

/** The great city of Nineveh: a wall with a gate, towers and lots of houses. Origin at the bottom center. */
function City({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const houses: [number, number, number, number, string][] = [
    [-125, -112, 48, 52, '#f2e2c0'], [-72, -134, 44, 74, '#efd2a0'], [-20, -158, 40, 98, '#f6e6c6'],
    [28, -126, 50, 66, '#efd2a0'], [84, -110, 46, 50, '#f2e2c0'],
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {houses.map(([hx, hy, w, h, c], i) => (
        <g key={i}>
          <rect x={hx} y={hy} width={w} height={h} fill={c} stroke="#c9a46a" strokeWidth={3} />
          <rect x={hx + w / 2 - 6} y={hy + 12} width={12} height={12} rx={2} fill="#8a5a2e" />
        </g>
      ))}
      <path d="M-20 -158 A20 20 0 0 1 20 -158 Z" fill="#7cb0e0" stroke="#4f86b8" strokeWidth={3} />
      <path d="M-72 -134 A22 18 0 0 1 -28 -134 Z" fill="#e58a6a" stroke="#b8664a" strokeWidth={3} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={d * 160 - 22} y={-104} width={44} height={104} fill="#e3c48a" stroke="#b8945a" strokeWidth={3} />
          {[-22, -7, 8].map((cx) => <rect key={cx} x={d * 160 + cx} y={-116} width={14} height={14} fill="#e3c48a" stroke="#b8945a" strokeWidth={3} />)}
          <rect x={d * 160 - 6} y={-80} width={12} height={18} rx={6} fill="#8a5a2e" />
          <path d={`M${d * 160} -116 L${d * 160} -146 L${d * 160 + 24} -138 L${d * 160} -130`} fill="#5fb7ff" stroke="#7a5233" strokeWidth={3} strokeLinejoin="round" />
        </g>
      ))}
      <rect x={-140} y={-60} width={280} height={60} fill="#ecd29a" stroke="#b8945a" strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-136 + i * 23} y={-72} width={13} height={13} fill="#ecd29a" stroke="#b8945a" strokeWidth={3} />)}
      <path d="M-24 0 L-24 -30 A24 24 0 0 1 24 -30 L24 0 Z" fill="#8a5a2e" stroke="#6b4422" strokeWidth={3} />
      <path d="M-140 -36 L140 -36" stroke="#d9b67a" strokeWidth={3} />
    </g>
  )
}

/** Jonah's ship: a big wooden boat with a striped square sail. Crew (children, ship coordinates) stand
 *  on the deck behind the hull, feet near y = 10. Rocks gently. Faces right. */
function Ship({ x, y, s = 1, tilt = 0, children }: { x: number; y: number; s?: number; tilt?: number; children?: ReactNode }) {
  return (
    <g className="sc-rock">
      <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
        <path d="M-10 -20 L-10 -240" stroke="#7a5233" strokeWidth={8} strokeLinecap="round" />
        <path d="M-90 -222 L70 -222" stroke="#7a5233" strokeWidth={6} strokeLinecap="round" />
        <path d="M-84 -218 Q-10 -206 64 -218 L74 -96 Q-10 -78 -94 -96 Z" fill="#fff7e8" stroke="#d9c6a6" strokeWidth={3} strokeLinejoin="round" />
        <path d="M-58 -214 L-62 -88 M-10 -210 L-10 -84 M38 -214 L42 -88" stroke="#e06a5a" strokeWidth={14} opacity={0.85} />
        <path d="M-10 -240 L18 -232 L-10 -224 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} />
        {children}
        <path d="M-180 -40 L176 -40 Q168 10 120 30 L-130 30 Q-170 10 -180 -40 Z" fill="#c98448" stroke="#8a5428" strokeWidth={4} strokeLinejoin="round" />
        <path d="M176 -40 Q196 -62 186 -88 Q178 -96 172 -86" stroke="#8a5428" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-180 -40 Q-200 -58 -194 -76" stroke="#8a5428" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-172 -16 L168 -16 M-150 8 L148 8" stroke="#8a5428" strokeWidth={2.5} />
        {[-110, -40, 30, 100].map((cx) => <circle key={cx} cx={cx} cy={-28} r={7} fill="#ffd34d" stroke="#c99a20" strokeWidth={2} />)}
      </g>
    </g>
  )
}

/** A splash: a pointy crown of water with droplets flying up and out. */
function Splash({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={58} ry={9} fill="none" stroke="#fff" strokeWidth={3} opacity={0.8} />
      <path d="M-50 4 Q-40 -6 -38 -30 Q-30 -10 -20 -8 Q-16 -36 -6 -56 Q2 -30 8 -10 Q18 -14 26 -42 Q30 -12 50 4 Z" fill="#9bd8ff" stroke="#ffffff" strokeWidth={3.5} strokeLinejoin="round" />
      <g className="sc-float">
        {[[-44, -50, -30], [-16, -80, -10], [18, -76, 12], [44, -54, 32]].map(([cx, cy, a], i) => (
          <path key={i} d={`M${cx} ${cy - 9} Q${cx + 7} ${cy + 2} ${cx} ${cy + 5} Q${cx - 7} ${cy + 2} ${cx} ${cy - 9} Z`} transform={`rotate(${a} ${cx} ${cy})`} fill="#9bd8ff" stroke="#ffffff" strokeWidth={2.5} />
        ))}
      </g>
    </g>
  )
}

/** A few rising bubbles. */
const Bubbles = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" fillOpacity={0.25} stroke="#e6f6ff" strokeWidth={2.5}>
      <circle cx={0} cy={0} r={5} /><circle cx={8} cy={-16} r={7} /><circle cx={2} cy={-36} r={9} />
    </g>
  </g>
)

/** Wavy seaweed that sways. */
const Seaweed = ({ x, y, s = 1, color = '#3fb36b' }: { x: number; y: number; s?: number; color?: string }) => (
  <g className="sc-sway">
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth={9} fill="none" strokeLinecap="round">
      <path d="M0 0 Q-14 -24 0 -48 Q14 -72 0 -96" />
      <path d="M16 0 Q4 -20 16 -40 Q28 -60 18 -74" strokeWidth={7} />
    </g>
  </g>
)

/** A curl of wind. */
const Wind = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9}>
    <path d="M0 0 Q60 -14 120 0 Q150 8 146 -12 Q140 -28 124 -18" />
    <path d="M20 26 Q80 16 150 28" />
  </g>
)

/** The fish's open mouth, drawn just behind an open BigFish at the same x, y, s so the gap looks like a mouth. */
const Mouth = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-158 -18 L-84 0 L-158 28 Z" fill="#2a4f86" />
      <ellipse cx={-136} cy={14} rx={14} ry={7} fill="#ff8fa8" />
    </g>
  </g>
)

/** A window into the big fish's tummy: a cozy glowing room where Jonah prays. Floats with the fish. */
function Tummy({ x, y, r = 70, children }: { x: number; y: number; r?: number; children?: ReactNode }) {
  const id = `tm${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g className="sc-float">
      <defs>
        <radialGradient id={id} cx="50%" cy="45%" r="60%"><stop offset="0" stopColor="#fff6c9" /><stop offset="0.7" stopColor="#ffd59a" /><stop offset="1" stopColor="#ffb08a" /></radialGradient>
        <clipPath id={`c${id}`}><circle cx={x} cy={y} r={r} /></clipPath>
      </defs>
      <circle cx={x} cy={y} r={r + 7} fill="#3f6fb0" />
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      <g clipPath={`url(#c${id})`}>{children}</g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#ff9fb8" strokeWidth={5} />
    </g>
  )
}

// ---------- Pages ----------

// 1. "God said to Jonah, go to the big city of Nineveh. Tell the people to stop doing wrong things and come back to Me."
const Page1 = () => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <Scene sky="day" ground="hills">
      <defs>
        <linearGradient id={`bm${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6b0" stopOpacity={0.9} /><stop offset="1" stopColor="#fff6b0" stopOpacity={0.15} /></linearGradient>
      </defs>
      <path d="M170 -10 L330 -10 L380 450 L100 450 Z" fill={`url(#bm${id})`} />
      <Glow x={250} y={40} r={190} />
      <City x={565} y={330} s={0.78} />
      <Cloud x={560} y={150} s={0.7} grey />
      <path d="M300 410 Q420 380 470 345 Q500 330 540 330" stroke="#f6e6c6" strokeWidth={14} fill="none" strokeLinecap="round" />
      <Person x={240} y={412} s={1.35} look={PEOPLE.jonah} />
      <Sparkles spots={[[190, 120, 9], [310, 160, 7], [250, 90, 6], [170, 230, 6], [330, 260, 8]]} />
    </Scene>
  )
}

// 2. "But Jonah did not want to go! He ran the other way and got on a boat, sailing far, far away."
const Page2 = () => (
  <Scene sky="day" ground="none" sun>
    <Sea y={285} />
    <path d="M0 296 Q30 268 110 270 Q180 272 220 296 Z" fill="#cfe3a8" stroke="#a8c47a" strokeWidth={3} />
    <City x={100} y={286} s={0.26} />
    <Ship x={470} y={350} s={0.8}>
      <Person x={-110} y={10} s={0.95} look={PEOPLE.sailor} pose="wave" facing="left" blinkDelay={1.3} />
      <Person x={95} y={10} s={1} look={PEOPLE.jonah} />
    </Ship>
    {[[310, 372], [270, 392], [300, 410]].map(([x, y], i) => <path key={i} className="sc-wave" d={`M${x} ${y} q-24 -8 -48 0`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />)}
    <Dove x={650} y={190} s={0.8} />
  </Scene>
)

// 3. "God sent a big wind, and the boat rocked up and down. So the sailors put Jonah into the sea. Splash!"
const Page3 = () => (
  <Scene sky="storm" ground="none" rain>
    <Cloud x={140} y={60} s={1.4} grey />
    <Cloud x={460} y={40} s={1.6} grey slow />
    <Cloud x={720} y={70} s={1.2} grey />
    <Sea y={290} />
    <Emoji e="🌬️" x={130} y={150} size={64} bob />
    <Wind x={180} y={150} s={0.9} />
    <Wind x={420} y={110} s={0.7} />
    <Ship x={330} y={350} s={0.75} tilt={-9}>
      <Person x={-100} y={10} s={1} look={PEOPLE.sailor} pose="arms-up" blinkDelay={0.6} />
      <Person x={70} y={10} s={1} look={{ ...PEOPLE.sailor, wrap: '#5fb7ff', robe: '#a07a5a' }} pose="point" blinkDelay={2} />
    </Ship>
    <InSea x={590} y={362} s={0.9} />
  </Scene>
)

/** Jonah in the water up to his chest (waterline at y), splashing between two splash crowns. */
function InSea({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const cid = `cl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs><clipPath id={cid}><rect x={x - 200} y={y - 300} width={400} height={300} /></clipPath></defs>
      <g clipPath={`url(#${cid})`}>
        <Person x={x} y={y + 66 * s} s={s} look={PEOPLE.jonah} pose="arms-up" facing="left" />
      </g>
      <ellipse cx={x} cy={y} rx={70 * s} ry={12 * s} fill="none" stroke="#fff" strokeWidth={4} opacity={0.85} />
      <Splash x={x - 58 * s} y={y + 2} s={0.75 * s} />
      <Splash x={x + 62 * s} y={y + 2} s={0.7 * s} />
    </g>
  )
}

// 4. "But God sent a great big fish. Gulp! The fish swallowed Jonah up, and God kept him safe inside."
const Page4 = () => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`wa${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7cd0f8" /><stop offset="1" stopColor="#2f78c4" /></linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#wa${id})`} />
      {[[120, 60], [330, 110], [560, 50]].map(([x, w], i) => <path key={i} d={`M${x} 0 L${x + w} 0 L${x + w - 140} 450 L${x - 200} 450 Z`} fill="#ffffff" opacity={0.08} />)}
      <path className="sc-wave" d={`M-80 34 ${Array.from({ length: 12 }, () => 'q40 -12 80 0').join(' ')}`} stroke="#d6f0ff" strokeWidth={5} fill="none" opacity={0.7} />
      <path d="M0 420 Q200 398 400 416 T800 408 L800 450 L0 450 Z" fill="#f2dca0" stroke="#d9bd7a" strokeWidth={3} />
      <Seaweed x={110} y={430} />
      <Seaweed x={700} y={425} s={1.1} color="#5fc46a" />
      <Fish x={660} y={110} s={0.7} color="#ffe14d" facing="left" />
      <Glow x={215} y={250} r={110} />
      <Mouth x={500} y={250} s={1.35} />
      <BigFish x={500} y={250} s={1.35} open />
      <Person x={215} y={300} s={0.6} look={PEOPLE.jonah} pose="arms-up" />
      <path d="M262 236 Q290 226 300 234 M262 270 Q292 266 302 268" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
      <Bubbles x={170} y={230} />
      <Bubbles x={280} y={330} s={0.8} />
      <Sparkles spots={[[160, 290, 7], [260, 200, 8], [200, 180, 5]]} />
    </Scene>
  )
}

// 5. "Jonah was inside the fish for three days and three nights. He prayed to God and said, thank You for saving me!"
const Page5 = () => (
  <Scene sky="dusk" ground="none" stars>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <circle cx={250 + i * 150} cy={62} r={30} fill="#fff" opacity={0.25} />
        <Emoji e="☀️" x={236 + i * 150} y={62} size={30} />
        <Emoji e="🌙" x={266 + i * 150} y={62} size={28} />
      </g>
    ))}
    <Sea y={215} />
    <BigFish x={400} y={300} s={1.3} />
    <Tummy x={430} y={272} r={74}>
      <Glow x={430} y={262} r={70} color="#fffbe0" />
      <Person x={430} y={336} s={0.6} look={PEOPLE.jonah} pose="pray" />
      <Sparkles spots={[[386, 236, 6], [476, 230, 7], [470, 290, 5]]} color="#ffffff" />
    </Tummy>
  </Scene>
)

// 6. "Then God told the fish to spit Jonah out onto the dry land. Bleh! Jonah was back on the beach."
const Page6 = () => (
  <Scene sky="day" ground="beach" sun>
    <Palm x={115} y={375} s={0.95} />
    <Mouth x={600} y={340} s={0.85} />
    <BigFish x={600} y={340} s={0.85} open />
    <path d="M465 340 Q380 250 280 300" stroke="#fff" strokeWidth={4} strokeDasharray="12 10" fill="none" strokeLinecap="round" />
    {[[440, 300, 6], [400, 270, 5], [360, 262, 6], [320, 272, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#d6f0ff" stroke="#6cc0f2" strokeWidth={2} />)}
    <Person x={235} y={410} s={1.25} look={PEOPLE.jonah} pose="arms-up" blinkDelay={0.8} />
    <Emoji e="💦" x={300} y={320} size={34} />
    <Sparkles spots={[[180, 250, 7], [300, 230, 8], [240, 210, 6]]} />
  </Scene>
)

// 7. "God gave Jonah a second chance, and this time Jonah went to Nineveh. The people listened and turned back to God. And God forgave them, because God loves everyone!"
const Page7 = () => (
  <Scene sky="dawn" ground="town">
    <Glow x={430} y={110} r={240} />
    <Person x={215} y={414} s={1.25} look={PEOPLE.jonah} pose="wave" />
    <Person x={380} y={416} s={1.1} look={KING} pose="pray" facing="left" blinkDelay={1.5} />
    <Person x={470} y={420} s={1.02} look={WOMAN} pose="pray" facing="left" blinkDelay={0.4} />
    <Person x={560} y={414} s={1.08} look={MAN} pose="arms-up" facing="left" blinkDelay={2.2} />
    <Person x={645} y={422} s={1.15} look={GIRL} pose="arms-up" facing="left" blinkDelay={1} />
    <Emoji e="💛" x={360} y={150} size={40} bob />
    <Emoji e="💛" x={500} y={120} size={46} bob />
    <Emoji e="💛" x={620} y={170} size={36} bob />
    <Sparkles spots={[[430, 70, 9], [300, 110, 7], [560, 80, 8], [680, 120, 6]]} />
  </Scene>
)

export const JONAH_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
