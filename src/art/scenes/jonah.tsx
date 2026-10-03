// Jonah and the Big Fish: one illustration per story page (see data/jonah.ts for the words).
// God's voice and care are shown as light (Glow, beams, Sparkles), never as a person.
// Local props worth reusing: City (Nineveh), Ship (faces either way, crew aboard), GulpFish (the big
// fish with its mouth open, something inside), Beam (a shaft of light), Gull, Drops, Heart.
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { ink, useShade } from '../kit'
import { Person, PEOPLE, type Look } from '../people'
import { BigFish, Cloud, Fish, Glow, Moon, Palm, Scene, Sea, Sparkles, Sun, Tap } from './kit'

// ---------- Local characters ----------

const KING: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', beard: 'long', beardColor: '#5a3a24', robe: '#c0504d', sash: '#ffd34d', crown: true }
const WOMAN: Look = { skin: '#8d5a3b', hair: 'covered', hairColor: '#3b2a20', wrap: '#f0a860', robe: '#e8c06a', sash: '#c0504d' }
// A townsman in green with a white head-wrap, so nobody mistakes him for Jonah (blue robe, gold sash).
const MAN: Look = { skin: '#c68b5e', hair: 'covered', hairColor: '#2b2020', wrap: '#f5f0e6', beard: 'short', beardColor: '#2b2020', robe: '#6b8f5a', sash: '#c0504d' }
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

/** Jonah's ship: a big wooden boat with a striped square sail, sailing right (or `facing="left"`). Crew
 *  (children, in ship coordinates, so they turn with it) stand on the deck behind the hull, feet near
 *  y = 10. Rocks gently. */
function Ship({ x, y, s = 1, tilt = 0, facing = 'right', children }: {
  x: number; y: number; s?: number; tilt?: number; facing?: 'left' | 'right'; children?: ReactNode
}) {
  return (
    <g className="sc-rock">
      <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${facing === 'left' ? -s : s} ${s})`}>
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

/** Water drops flying off something wet: [x, y, tilt in degrees]. */
const Drops = ({ spots }: { spots: [number, number, number][] }) => (
  <g className="sc-float">
    {spots.map(([cx, cy, a], i) => (
      <path key={i} d={`M${cx} ${cy - 9} Q${cx + 7} ${cy + 2} ${cx} ${cy + 5} Q${cx - 7} ${cy + 2} ${cx} ${cy - 9} Z`} transform={`rotate(${a} ${cx} ${cy})`} fill="#9bd8ff" stroke="#3f96d8" strokeWidth={2} />
    ))}
  </g>
)

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

/** A curl of wind (swirls only: the wind is never drawn with a face). */
const Wind = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9}>
    <path d="M0 0 Q60 -14 120 0 Q150 8 146 -12 Q140 -28 124 -18" />
    <path d="M20 26 Q80 16 150 28" />
  </g>
)

/** A shaft of God's light shining down from above, fading as it goes (`from` / `to`: its opacity). */
function Beam({ top, bottom, y0 = -10, y1 = 450, from = 0.9, to = 0.15 }: {
  top: [number, number]; bottom: [number, number]; y0?: number; y1?: number; from?: number; to?: number
}) {
  const id = `bm${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6b0" stopOpacity={from} /><stop offset="1" stopColor="#fff6b0" stopOpacity={to} /></linearGradient>
      </defs>
      <path d={`M${top[0]} ${y0} L${top[1]} ${y0} L${bottom[1]} ${y1} L${bottom[0]} ${y1} Z`} fill={`url(#${id})`} />
    </g>
  )
}

/** A seagull gliding far off: a white "m" of wings. (A see-through circle makes it easy to tap.) */
const Gull = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={0} cy={-4} r={30} fill="transparent" />
      <path d="M-28 4 Q-15 -16 0 0 Q15 -16 28 4" stroke="#8796ad" strokeWidth={8} />
      <path d="M-28 4 Q-15 -16 0 0 Q15 -16 28 4" stroke="#ffffff" strokeWidth={4} />
    </g>
  </g>
)

/** A soft, shiny heart (God's love), bobbing gently. */
function Heart({ x, y, s = 1, color = '#ffd34d' }: { x: number; y: number; s?: number; color?: string }) {
  const shade = useShade(color, 0.35, 0.15)
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <defs>{shade.def}</defs>
        <path d="M0 20 C-30 0 -30 -26 -14 -28 C-6 -29 -1 -22 0 -16 C1 -22 6 -29 14 -28 C30 -26 30 0 0 20 Z" fill={shade.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={-13} cy={-16} rx={4} ry={6.5} fill="#ffffff" opacity={0.65} transform="rotate(-35 -13 -16)" />
      </g>
    </g>
  )
}

type Pt = [number, number]
/** The big fish's open mouth: upper lip tip, mouth corner, lower lip tip, and the curves between them. */
const JAWS: Record<'wide' | 'open', { u: Pt; h: Pt; l: Pt; roof: Pt; floor: Pt; front: Pt; tongue: [number, number, number] }> = {
  wide: { u: [-165, -50], h: [-50, 40], l: [-152, 62], roof: [-95, -15], floor: [-101, 64], front: [-128, 6], tongue: [-106, 58, -12] },
  open: { u: [-160, -32], h: [-62, 22], l: [-150, 44], roof: [-100, -14], floor: [-106, 46], front: [-133, 6], tongue: [-110, 42, -14] },
}

/**
 * The big fish (the same friendly whale as kit's BigFish, facing left, origin in its middle) with its
 * mouth open: `wide` enough to swallow Jonah, or a little less once it has spat him out. `children`
 * (scene coordinates) sit inside its mouth: in front of the dark throat, behind the jaws. `spout` only
 * when it's at the surface. Floats like BigFish.
 */
function GulpFish({ x, y, s = 1, wide, spout, children }: { x: number; y: number; s?: number; wide?: boolean; spout?: boolean; children?: ReactNode }) {
  const skin = useShade('#5f8fd0', 0.3, 0.2)
  const line = ink('#5f8fd0')
  const j = JAWS[wide ? 'wide' : 'open']
  const p = (q: number[]) => `${q[0]} ${q[1]}`
  const body = `M${p(j.u)} Q-152 -100 0 -100 Q150 -100 160 -10 Q150 70 0 72 Q-120 74 ${p(j.l)} Q${p(j.floor)} ${p(j.h)} Q${p(j.roof)} ${p(j.u)} Z`
  const mouth = `M${p(j.u)} Q${p(j.roof)} ${p(j.h)} Q${p(j.floor)} ${p(j.l)} Q${p(j.front)} ${p(j.u)} Z`
  const at = `translate(${x} ${y}) scale(${s})`
  const [tx, ty, ta] = j.tongue
  return (
    <g className="sc-float">
      <g transform={at}>
        <defs>{skin.def}</defs>
        <path className="pa-tail" style={{ '--o': '0% 50%' } as CSSProperties} d="M150 -20 Q190 -70 210 -60 Q196 -20 210 20 Q190 30 150 0 Z" fill={skin.fill} stroke={line} strokeWidth={4} />
        <path d={mouth} fill="#24467a" />
        <ellipse cx={tx} cy={ty} rx={34} ry={10} fill="#ff8fa8" transform={`rotate(${ta} ${tx} ${ty})`} />
      </g>
      {children}
      <g transform={at}>
        <path d={body} fill={skin.fill} stroke={line} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M${j.l[0] + 4} ${j.l[1] + 4} Q-60 74 120 30 Q60 72 0 72 Q-118 74 ${j.l[0] + 4} ${j.l[1] + 4} Z`} fill="#cfe4ff" />
        <circle cx={-80} cy={-44} r={10} fill="#2b2140" /><circle cx={-83} cy={-48} r={3.5} fill="#fff" />
        <ellipse cx={-104} cy={-30} rx={10} ry={6} fill="#ff7fb0" opacity={0.5} />
        {spout && <path d="M-30 -100 Q-36 -130 -50 -140 M-30 -100 Q-24 -132 -10 -142" stroke="#bfe4ff" strokeWidth={6} fill="none" strokeLinecap="round" className="sc-spout" />}
      </g>
    </g>
  )
}

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

/** Jonah in the water up to his chest (waterline at y), splashing between two splash crowns. */
function InSea({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const cid = `cl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs><clipPath id={cid}><rect x={x - 200} y={y - 300} width={400} height={300} /></clipPath></defs>
      <g clipPath={`url(#${cid})`}>
        <Person x={x} y={y + 66 * s} s={s} look={PEOPLE.jonah} pose="arms-up" facing="left" />
      </g>
      <ellipse cx={x} cy={y} rx={84 * s} ry={12 * s} fill="none" stroke="#fff" strokeWidth={4} opacity={0.85} />
      <Splash x={x - 80 * s} y={y + 2} s={0.75 * s} />
      <Splash x={x + 82 * s} y={y + 2} s={0.7 * s} />
    </g>
  )
}

// ---------- Pages ----------

// 1. "God said to Jonah, go to the big city of Nineveh. Tell the people to stop doing wrong things and come back to Me."
const Page1 = () => (
  <Scene sky="day" ground="hills">
    <Beam top={[170, 330]} bottom={[100, 380]} />
    <Glow x={250} y={40} r={190} />
    {/* the road to Nineveh, running into its gate */}
    <path d="M300 410 Q440 392 518 360 Q558 344 565 334" stroke="#f6e6c6" strokeWidth={14} fill="none" strokeLinecap="round" />
    <Tap say="Nineveh was a big, big city." sfx="ding"><City x={565} y={330} s={0.78} /></Tap>
    <Cloud x={560} y={150} s={0.7} grey />
    <Tap say="Who, me? Go all the way to Nineveh?"><Person x={240} y={412} s={1.35} look={PEOPLE.jonah} /></Tap>
    <Sparkles spots={[[190, 120, 9], [310, 160, 7], [250, 90, 6], [170, 230, 6], [330, 260, 8]]} color="#ffd34d" />
  </Scene>
)

// 2. "But Jonah did not want to go! He ran the other way and got on a boat, sailing far, far away."
// Nineveh stays on the right, where it was on page 1, and the ship sails off the other way.
const Page2 = () => (
  <Scene sky="day" ground="none" sun>
    <Sea y={285} />
    <path d="M800 296 Q770 268 690 270 Q620 272 580 296 Z" fill="#cfe3a8" stroke="#a8c47a" strokeWidth={3} />
    <City x={700} y={286} s={0.26} />
    <Tap say="Squawk!"><Gull x={150} y={178} /><Gull x={222} y={146} s={0.75} /></Tap>
    <Ship x={340} y={350} s={0.8} facing="left">
      <Tap say="Ahoy! Off we sail!"><Person x={-110} y={10} s={0.95} look={PEOPLE.sailor} pose="wave" facing="left" blinkDelay={1.3} /></Tap>
      <Tap say="I'm going far, far away!"><Person x={95} y={10} s={1} look={PEOPLE.jonah} /></Tap>
    </Ship>
    {[[510, 372], [550, 392], [520, 410]].map(([x, y], i) => <path key={i} className="sc-wave" d={`M${x} ${y} q24 -8 48 0`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />)}
  </Scene>
)

// 3. "God sent a big wind, and the boat rocked up and down. Jonah told the sailors, this storm is my fault.
//    Put me into the sea. So they did. Splash! And the sea was calm again."
// The wind is only swirls; God's light breaks through the clouds onto Jonah as the storm ends.
const Page3 = () => (
  <Scene sky="storm" ground="none" rain>
    <Cloud x={140} y={60} s={1.4} grey />
    <Cloud x={460} y={40} s={1.6} grey slow />
    <Cloud x={720} y={70} s={1.2} grey />
    <Sea y={290} />
    <Beam top={[580, 630]} bottom={[505, 680]} y1={400} from={0.75} to={0} />
    <Glow x={590} y={350} r={90} />
    <Tap say="Whoooosh!" sfx="whoosh">
      <Wind x={30} y={210} s={0.8} />
      <Wind x={180} y={150} s={0.9} />
      <Wind x={420} y={110} s={0.7} />
    </Tap>
    <Ship x={330} y={350} s={0.75} tilt={-9}>
      <Tap say="Thank You, God!"><Person x={-100} y={10} s={1} look={PEOPLE.sailor} pose="pray" blinkDelay={0.6} /></Tap>
      <Person x={70} y={10} s={1} look={{ ...PEOPLE.sailor, wrap: '#5fb7ff', robe: '#a07a5a' }} pose="point" blinkDelay={2} />
    </Ship>
    <Tap say="Splash! Glub, glub!" sfx="plop"><InSea x={590} y={362} s={0.9} /></Tap>
    <Sparkles spots={[[548, 220, 7], [636, 250, 6], [600, 175, 5]]} />
  </Scene>
)

// 4. "But God sent a great big fish. Gulp! The fish swallowed Jonah up, and God kept him safe inside."
// The gulp: Jonah is already in the fish's wide-open mouth, safe in God's light.
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
      <Seaweed x={90} y={430} />
      <Seaweed x={745} y={425} s={1.1} color="#5fc46a" />
      <Tap say="Blub, blub!" sfx="plop"><Fish x={660} y={110} s={0.7} color="#ffe14d" facing="left" /></Tap>
      {/* water rushing into the open mouth */}
      <path d="M112 214 Q152 206 186 218 M104 300 Q148 296 190 304" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
      <Tap say="Gulp!" sfx="chomp">
        <GulpFish x={450} y={240} s={1.5} wide>
          <Glow x={273} y={292} r={84} />
          <Tap say="Whoa! What a great big fish!"><Person x={273} y={331} s={0.55} look={PEOPLE.jonah} pose="arms-up" /></Tap>
          <Sparkles spots={[[244, 266, 6], [304, 270, 7], [262, 234, 5]]} />
        </GulpFish>
      </Tap>
      <Bubbles x={64} y={262} />
      <Bubbles x={120} y={372} s={0.8} />
    </Scene>
  )
}

// 5. "Jonah was inside the fish for three days and three nights. He prayed to God and said, thank You for saving me!"
// Three day-and-night pairs to count (tap each one), and Jonah praying in the fish's tummy.
const DAYS = ['One day and one night.', 'Two days and two nights.', 'Three days and three nights!']
const Page5 = () => (
  <Scene sky="dusk" ground="none" stars>
    {DAYS.map((say, i) => (
      <Tap key={i} say={say} sfx="ding">
        <circle cx={250 + i * 150} cy={62} r={36} fill="#fff" opacity={0.25} />
        <Sun x={233 + i * 150} y={62} s={0.28} />
        <Moon x={267 + i * 150} y={62} s={0.36} />
      </Tap>
    ))}
    <Sea y={215} />
    <Tap say="Blub, blub!" sfx="plop">
      <BigFish x={400} y={300} s={1.3} />
      <Tummy x={430} y={272} r={74}>
        <Glow x={430} y={262} r={70} color="#fffbe0" />
        <path d="M346 330 Q430 314 514 330 L514 356 L346 356 Z" fill="#f2a084" stroke="#ffd2b8" strokeWidth={3} />
        <Tap say="Thank You, God, for saving me!" sfx="sparkle"><Person x={430} y={326} s={0.6} look={PEOPLE.jonah} pose="pray" /></Tap>
        <Sparkles spots={[[386, 236, 6], [476, 230, 7], [470, 290, 5]]} color="#ffffff" />
      </Tummy>
    </Tap>
  </Scene>
)

// 6. "Then God told the fish to spit Jonah out onto the dry land. Bleh! Jonah was back on the beach."
// The fish is still big next to Jonah (it swallowed him!), and he lands with a splash of water, not on it.
const Page6 = () => (
  <Scene sky="day" ground="beach" sun>
    <Tap sfx="swish"><Palm x={130} y={378} s={1.45} /></Tap>
    <Tap say="Bleh!" sfx="plop"><GulpFish x={575} y={350} s={1} spout /></Tap>
    <path d="M420 350 Q362 200 296 402" stroke="#fff" strokeWidth={4} strokeDasharray="12 10" fill="none" strokeLinecap="round" />
    {[[403, 292, 5], [376, 270, 6], [344, 281, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#d6f0ff" stroke="#6cc0f2" strokeWidth={2} />)}
    <ellipse cx={266} cy={410} rx={50} ry={8} fill="#bfe6ff" stroke="#8fd0f5" strokeWidth={2} opacity={0.9} />
    <Tap say="Dry land! Thank You, God!"><Person x={245} y={410} s={1.05} look={PEOPLE.jonah} pose="arms-up" blinkDelay={0.8} /></Tap>
    <Drops spots={[[176, 254, -25], [316, 240, 25], [166, 304, -40], [314, 296, 35]]} />
    <Sparkles spots={[[300, 200, 7], [250, 228, 5], [196, 210, 6]]} color="#ffd34d" />
  </Scene>
)

// 7. "God gave Jonah a second chance, and this time he went to Nineveh. The people listened, said sorry
//    to God, and stopped doing wrong things. God forgave them, because God loves everyone!"
// The same Nineveh as page 1, with its people come out to listen to Jonah.
const Page7 = () => (
  <Scene sky="dawn" ground="hills">
    <Glow x={440} y={120} r={240} />
    <City x={440} y={312} s={0.9} />
    <Tap say="God loves you! Come back to Him!"><Person x={190} y={414} s={1.25} look={PEOPLE.jonah} pose="wave" /></Tap>
    <Tap say="We are sorry, God."><Person x={370} y={416} s={1.1} look={KING} pose="pray" facing="left" blinkDelay={1.5} /></Tap>
    <Person x={465} y={420} s={1.02} look={WOMAN} pose="pray" facing="left" blinkDelay={0.4} />
    <Person x={560} y={414} s={1.08} look={MAN} pose="arms-up" facing="left" blinkDelay={2.2} />
    <Tap say="God loves everyone!"><Person x={650} y={422} s={1.15} look={GIRL} pose="arms-up" facing="left" blinkDelay={1} /></Tap>
    <Tap sfx="sparkle">
      <Heart x={330} y={140} s={0.8} />
      <Heart x={470} y={112} s={0.95} />
      <Heart x={620} y={150} s={0.75} />
    </Tap>
    <Sparkles spots={[[440, 70, 9], [290, 100, 7], [560, 70, 8], [690, 110, 6]]} />
  </Scene>
)

export const JONAH_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
