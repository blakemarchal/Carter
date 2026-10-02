// Five Loaves and Two Fish: one illustration per story page (see data/loaves.ts for the words).
// God is never drawn as a person: His presence is light (Glow, rays, Sparkles).
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import { ink } from '../kit'
import { Person, PEOPLE, type Look } from '../people'
import { Basket, Bread, Emoji, Fish, Flower, Glow, Scene, Sparkles, Sun, Tree } from './kit'

// ---------- Local props ----------

const SKINS = ['#d9a47a', '#c68b5e', '#f6d2b8', '#8d5a3b', '#e3b48c']
const ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
const HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24', '#e8e4dc']

/** One small person in the crowd, front view, standing or sitting on the grass. `i` picks the colors. */
function Folk({ x, y, s = 1, i = 0, sit, hold, hungry, wave }: {
  x: number; y: number; s?: number; i?: number; sit?: boolean; hold?: 'bread' | 'fish'; hungry?: boolean; wave?: boolean
}) {
  const robe = ROBES[i % ROBES.length]
  const skin = SKINS[(i * 7 + 2) % SKINS.length]
  const kind = (i * 5) % 4 // 0, 3: head covering · 1: short hair · 2: long hair
  const hair = HAIRS[(i * 3) % HAIRS.length]
  const wrap = WRAPS[(i * 11) % WRAPS.length]
  const covered = kind === 0 || kind === 3
  const hy = sit ? -38 : -54
  const cap = `M-12 ${hy} Q-13 ${hy - 15} 0 ${hy - 15} Q13 ${hy - 15} 12 ${hy} Q6 ${hy - 8} 0 ${hy - 7} Q-6 ${hy - 8} -12 ${hy} Z`
  const back = `M-13 ${hy - 3} Q-16 ${hy + 15} -11 ${hy + 13} L11 ${hy + 13} Q16 ${hy + 15} 13 ${hy - 3} Z`
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
      {wave && (
        <g className="pa-wing" style={{ '--o': '0% 100%' } as CSSProperties}>
          <path d={`M9 ${hy + 18} L20 ${hy - 2}`} stroke={robe} strokeWidth={6} strokeLinecap="round" />
          <circle cx={20} cy={hy - 3} r={3.6} fill={skin} stroke={ink(skin)} strokeWidth={1.5} />
        </g>
      )}
      {hold === 'bread' && <ellipse cx={0} cy={hy + 20} rx={8} ry={5} fill="#e0a75e" stroke="#a8702c" strokeWidth={2} />}
      {hold === 'fish' && <Fish x={0} y={hy + 20} s={0.36} color="#ffa64d" />}
      {hold && [-8, 8].map((hx) => <circle key={hx} cx={hx} cy={hy + 22} r={3.4} fill={skin} stroke={ink(skin)} strokeWidth={1.5} />)}
      <circle cx={0} cy={hy} r={11} fill={skin} stroke={ink(skin)} strokeWidth={2} />
      <circle cx={-4} cy={hy} r={1.9} fill="#2b2140" />
      <circle cx={4} cy={hy} r={1.9} fill="#2b2140" />
      <ellipse cx={-7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <ellipse cx={7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      {hungry
        ? <ellipse cx={0} cy={hy + 6} rx={1.8} ry={2.3} fill="#6b2a3a" />
        : <path d={`M-3 ${hy + 5} Q0 ${hy + 8.5} 3 ${hy + 5}`} stroke="#6b2a3a" strokeWidth={1.6} fill="none" strokeLinecap="round" />}
      <path d={cap} fill={covered ? wrap : hair} stroke={ink(covered ? wrap : hair)} strokeWidth={2} />
    </g>
  )
}

type Row = [y: number, x0: number, x1: number, n: number, s: number]

/** Rows of Folk, back row first. Spacing wobbles a little so it looks like a real crowd. */
function Crowd({ rows, sit, hold, hungry, seed = 0 }: { rows: Row[]; sit?: boolean; hold?: boolean; hungry?: boolean; seed?: number }) {
  let k = seed
  return (
    <g>
      {rows.map(([y, x0, x1, n, s], r) => Array.from({ length: n }, (_, j) => {
        const i = k++
        const step = n > 1 ? (x1 - x0) / (n - 1) : 0
        const jx = Math.sin(i * 12.9898) * step * 0.2
        const jy = Math.cos(i * 4.1) * 3 * s
        return (
          <Folk key={`${r}-${j}`} x={x0 + j * step + jx} y={y + jy} s={s} i={i} sit={sit} hungry={hungry}
            hold={hold ? (i % 3 === 2 ? 'fish' : 'bread') : undefined} wave={!sit && !hold && i % 5 === 1} />
        )
      }))}
    </g>
  )
}

/** Rolling grassy hills; `warm` tints them for the evening. */
function Hills({ warm, lake }: { warm?: boolean; lake?: boolean }) {
  const [far, back, front] = warm ? ['#9cc29a', '#8fbf7e', '#74b064'] : ['#b8e0b0', '#a8d8a0', '#7cc46a']
  return (
    <g>
      {lake && (
        <g>
          <rect x={0} y={258} width={800} height={50} fill={warm ? '#8fb0d8' : '#7cc6f0'} />
          {[[60, 272], [180, 280], [300, 270]].map(([x, y], i) => <path key={i} className="sc-wave" d={`M${x} ${y} q10 -6 20 0`} stroke="#fff" strokeWidth={2.5} fill="none" opacity={0.7} />)}
        </g>
      )}
      <path d="M380 290 Q560 230 800 262 L800 330 L380 330 Z" fill={far} />
      <path d="M0 300 Q180 266 400 292 Q600 268 800 290 L800 450 L0 450 Z" fill={back} />
      <path d="M0 372 Q240 338 460 368 T800 356 L800 450 L0 450 Z" fill={front} />
    </g>
  )
}

/** The boy's lunch: a little basket with five loaves and two fish, easy to count. */
function Lunch({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform="rotate(45 -46 -30)"><Fish x={-46} y={-30} s={0.9} color="#5fb7ff" facing="left" /></g>
      <g transform="rotate(-45 46 -30)"><Fish x={46} y={-30} s={0.9} /></g>
      <Bread x={-17} y={-40} s={0.68} />
      <Bread x={17} y={-40} s={0.68} />
      <Bread x={-34} y={-24} s={0.68} />
      <Bread x={0} y={-26} s={0.68} />
      <Bread x={34} y={-24} s={0.68} />
      <path d="M-54 -14 L54 -14 L43 26 L-43 26 Z" fill="#c98448" stroke="#8a5428" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-50 -1 L50 -1 M-46 12 L46 12" stroke="#8a5428" strokeWidth={2.5} />
      <rect x={-58} y={-19} width={116} height={9} rx={4.5} fill="#b5723c" stroke="#8a5428" strokeWidth={2.5} />
    </g>
  )
}

/** A fluffy thought bubble whose little puffs trail down toward (tx, ty). */
function Thought({ x, y, tx, ty, children }: { x: number; y: number; tx: number; ty: number; children?: ReactNode }) {
  const p = (t: number) => [tx + (x - tx) * t, ty + (y - ty) * t]
  return (
    <g className="sc-float">
      {[[0.12, 6], [0.3, 9]].map(([t, r]) => <circle key={t} cx={p(t)[0]} cy={p(t)[1]} r={r} fill="#fff" stroke="#d9cfe8" strokeWidth={2.5} />)}
      <g fill="#fff" stroke="#d9cfe8" strokeWidth={3}>
        {[[-40, 6, 30], [-14, -18, 34], [22, -16, 32], [44, 8, 28], [0, 20, 32]].map(([cx, cy, r], i) => <circle key={i} cx={x + cx} cy={y + cy} r={r} />)}
      </g>
      <g fill="#fff">
        {[[-40, 6, 27], [-14, -18, 31], [22, -16, 29], [44, 8, 25], [0, 20, 29], [0, 0, 36]].map(([cx, cy, r], i) => <circle key={i} cx={x + cx} cy={y + cy} r={r} />)}
      </g>
      {children}
    </g>
  )
}

/** "Grumble, grumble": a little wiggle by a hungry tummy. */
const Rumble = ({ x, y, flip }: { x: number; y: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} className="pa-twinkle" stroke="#e07a5f" strokeWidth={2.6} fill="none" strokeLinecap="round">
    <path d="M0 -6 q4 -5 8 0 t8 0" />
    <path d="M2 4 q4 -5 8 0 t8 0" />
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

const ANDREW: Look = { ...PEOPLE.disciple, robe: '#6f9fc0', sash: '#e0b45a', hairColor: '#7a4a24', beardColor: '#7a4a24' }
const GIRL: Look = { ...PEOPLE.boy, hair: 'pigtails', hairColor: '#4a3020', robe: '#ff9fb8', sash: '#ffffff', skin: '#d9a47a' }
const MOTHER: Look = { ...PEOPLE.mary, wrap: '#e8a35a', robe: '#6fb7b0', sash: '#f5f0e6' }

// ---------- Pages ----------

// 1. "One day, a great big crowd came to see Jesus on a grassy hill. There were thousands and thousands of people!"
const Page1 = () => (
  <Scene sky="day" ground="none" sun>
    <Hills lake />
    <path d="M430 330 Q615 222 800 330 Z" fill="#a8d8a0" />
    <Glow x={615} y={210} r={110} color="#fff6c8" />
    <Crowd rows={[[296, 70, 360, 13, 0.28], [314, 60, 440, 12, 0.4], [344, 50, 470, 11, 0.52], [380, 40, 500, 9, 0.66], [424, 50, 520, 7, 0.82]]} />
    <Person x={615} y={288} s={1} look={PEOPLE.jesus} pose="wave" facing="left" />
    <Flower x={700} y={420} color="#ffd34d" />
    <Flower x={580} y={432} color="#ff8cc0" />
  </Scene>
)

// 2. "It got late, and everyone was hungry. Grumble, grumble went their tummies! But where could they find food for so many people?"
const Page2 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Sun x={150} y={290} s={1.2} />
    <Hills warm />
    <Crowd sit hungry seed={3} rows={[[318, 70, 420, 10, 0.4], [350, 60, 440, 9, 0.55], [392, 70, 430, 6, 0.75]]} />
    <Rumble x={128} y={378} />
    <Rumble x={300} y={382} />
    <Rumble x={200} y={340} flip />
    <Folk x={120} y={432} s={1} i={6} sit hungry />
    <Folk x={250} y={436} s={1} i={9} sit hungry />
    <Folk x={380} y={432} s={1} i={2} sit hungry />
    <Rumble x={146} y={424} />
    <Rumble x={276} y={428} />
    <Rumble x={354} y={424} flip />
    <Person x={540} y={405} s={1.05} look={PEOPLE.jesus} facing="left" />
    <Person x={640} y={410} s={1} look={ANDREW} pose="point" facing="left" blinkDelay={1.2} />
    <Thought x={600} y={120} tx={630} ty={225}>
      <path d="M572 112 Q600 150 628 112 Z" fill="#e8e0f0" stroke="#a89cc0" strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={600} cy={112} rx={30} ry={7} fill="#f5f0fa" stroke="#a89cc0" strokeWidth={3} />
      <text x={640} y={110} fontSize={44} fontWeight={900} fill="#9a7ad0" textAnchor="middle" dominantBaseline="middle">?</text>
    </Thought>
    <rect width={800} height={450} fill="#ff9a6a" opacity={0.08} />
  </Scene>
)

// 3. "Then a boy came with his lunch. He had five little loaves of bread and two little fish."
const Page3 = () => (
  <Scene sky="day" ground="meadow" sun>
    <Crowd sit seed={20} rows={[[312, 470, 740, 8, 0.32], [330, 520, 760, 6, 0.4]]} />
    <Tree x={140} y={360} s={0.9} />
    <Person x={600} y={412} s={1.05} look={ANDREW} pose="point" facing="left" blinkDelay={0.8} />
    <Person x={340} y={420} s={1.75} look={PEOPLE.boy} pose="hold">
      <Lunch x={0} y={-34} s={0.78} />
    </Person>
    <Sparkles spots={[[250, 200, 9], [430, 190, 11], [450, 280, 6], [230, 290, 6]]} />
  </Scene>
)

// 4. "The boy shared his lunch with Jesus. It was just a little bit of food. But Jesus knew just what to do!"
const Page4 = () => (
  <Scene sky="dawn" ground="none">
    <Hills />
    <Crowd sit seed={40} rows={[[306, 60, 330, 9, 0.32], [320, 560, 760, 6, 0.34]]} />
    <Person x={610} y={398} s={0.95} look={PEOPLE.disciple} facing="left" blinkDelay={2.1} />
    <Person x={470} y={405} s={1.15} look={PEOPLE.jesus} pose="point" facing="left" />
    <Person x={290} y={418} s={1.5} look={PEOPLE.boy} pose="point">
      <Lunch x={60} y={-88} s={0.6} />
    </Person>
    <Glow x={385} y={300} r={70} color="#fff3c0" />
    <Emoji e="💛" x={390} y={225} size={40} bob />
    <Sparkles spots={[[340, 240, 6], [440, 225, 7]]} />
  </Scene>
)

// 5. "Jesus held up the bread and fish and thanked God for the food. Then He passed it out to everyone."
const Page5 = () => (
  <Scene sky="glory" ground="none" clouds={false}>
    <Rays x={400} y={40} r={560} opacity={0.3} />
    <Hills />
    <Crowd sit seed={60} rows={[[306, 60, 740, 18, 0.3], [326, 70, 250, 4, 0.4], [326, 560, 740, 4, 0.4]]} />
    <Folk x={110} y={378} s={0.62} i={3} sit />
    <Folk x={690} y={380} s={0.62} i={8} sit />
    <Person x={200} y={392} s={0.92} look={PEOPLE.disciple} pose="hold" holding="basket" facing="left" blinkDelay={1.5} />
    <Person x={600} y={392} s={0.92} look={ANDREW} pose="hold" holding="basket" blinkDelay={0.6} />
    <Glow x={400} y={190} r={190} />
    <Person x={400} y={415} s={1.3} look={PEOPLE.jesus} pose="arms-up" holding="bread">
      <Fish x={-44} y={-140} s={0.62} color="#5fb7ff" facing="left" />
    </Person>
    <Sparkles spots={[[300, 120, 10], [500, 110, 12], [400, 70, 8], [250, 200, 6], [560, 200, 7]]} />
  </Scene>
)

// 6. "Everyone ate and ate, until their tummies were full! There was plenty for everybody."
const Page6 = () => (
  <Scene sky="day" ground="meadow" sun>
    <Crowd sit hold seed={80} rows={[[316, 60, 740, 14, 0.36], [346, 70, 730, 11, 0.5]]} />
    <Person x={200} y={418} s={1.45} look={PEOPLE.boy} pose="hold" holding="bread" />
    <Basket x={395} y={405} s={1.25} fill="bread" />
    <Basket x={300} y={420} s={0.95} fill="fish" />
    <Person x={560} y={420} s={1.4} look={GIRL} pose="hold" blinkDelay={0.9}>
      <Fish x={0} y={-62} s={0.75} />
    </Person>
    <Person x={655} y={410} s={1.05} look={MOTHER} pose="hold" holding="bread" facing="left" blinkDelay={1.7} />
    <Emoji e="😋" x={248} y={218} size={42} bob />
    <Emoji e="😋" x={608} y={232} size={42} bob />
  </Scene>
)

// 7. "There were even twelve baskets of leftovers! Jesus took one little lunch and made more than enough. …"
const Page7 = () => (
  <Scene sky="dusk" ground="none" stars clouds={false}>
    <Hills warm />
    <Crowd sit seed={100} rows={[[312, 300, 740, 12, 0.3]]} />
    <Person x={165} y={408} s={1.15} look={PEOPLE.jesus} pose="arms-up" />
    <Person x={252} y={420} s={1.25} look={PEOPLE.boy} pose="arms-up" blinkDelay={1.1} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Basket key={`b${i}`} x={362 + i * 60} y={360} s={0.74} fill={i % 2 ? 'fish' : 'bread'} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => <Basket key={`f${i}`} x={332 + i * 70} y={410} s={0.86} fill={i % 2 ? 'bread' : 'fish'} />)}
    <Emoji e="💛" x={205} y={190} size={40} bob />
    <Sparkles spots={[[420, 290, 8], [560, 280, 10], [680, 300, 7], [330, 220, 6]]} />
    <rect width={800} height={450} fill="#ff9a6a" opacity={0.06} />
  </Scene>
)

export const LOAVES_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
