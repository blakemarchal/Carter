// David and the Giant: one illustration per story page (see data/david.ts for the words).
// Goliath is big and loud but goofy, never scary: no weapons, and when he falls he just sits down, dizzy.
import { useId, type ComponentType, type ReactNode } from 'react'
import { ink, lighten } from '../kit'
import { Person, PEOPLE, type Look } from '../people'
import { Emoji, Glow, Scene, Sheep, Sparkles, Tree } from './kit'

// ---------- Local characters ----------

const BROTHER: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#b5794a', sash: '#6b8f5a', helmet: true }
const BROTHER2: Look = { skin: '#c68b5e', hair: 'curly', hairColor: '#4a3020', robe: '#6b8fb0', sash: '#e0b45a', helmet: true }

// ---------- Local props ----------

/** Soft beams of light fanning out from (x, y), fading toward their tips; they turn very slowly. */
function Rays({ x, y, r = 420, n = 18, color = '#fff6b0', opacity = 0.5 }: { x: number; y: number; r?: number; n?: number; color?: string; opacity?: number }) {
  const id = `ry${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const w = (Math.PI * r) / n / 2.2
  return (
    <g className="pa-spin">
      <defs><linearGradient id={id} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={color} stopOpacity={opacity} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M0 0 L${-w} ${-r} L${w} ${-r} Z`} transform={`translate(${x} ${y}) rotate(${(i * 360) / n})`} fill={`url(#${id})`} />
      ))}
    </g>
  )
}

/** A camp tent with its door open and a little flag on top. */
function Tent({ x, y, w = 170, color = '#efdcb4' }: { x: number; y: number; w?: number; color?: string }) {
  const h = w * 0.68
  return (
    <g>
      <path d={`M${x} ${y - h} L${x} ${y - h - 34}`} stroke="#7a5233" strokeWidth={4} strokeLinecap="round" />
      <path d={`M${x + 2} ${y - h - 34} L${x + 30} ${y - h - 26} L${x + 2} ${y - h - 18} Z`} fill="#ff6b6b" stroke="#c94a4a" strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y} Z`} fill={color} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${x} ${y - h} L${x - w * 0.15} ${y} L${x + w * 0.15} ${y} Z`} fill="#6b4422" />
      <path d={`M${x} ${y - h} L${x + w * 0.15} ${y} L${x + w * 0.3} ${y} Z`} fill={lighten(color, 0.4)} stroke={ink(color)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M${x - w * 0.32} ${y - h * 0.36} L${x - w * 0.22} ${y - h * 0.36}`} stroke={ink(color)} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  )
}

/** A small harp (lyre) held at the chest: draw it as a child of a Person in pose="hold". */
const Lyre = () => (
  <g>
    <path d="M-15 -90 Q-22 -58 0 -50 Q22 -58 15 -90" fill="none" stroke="#d9a030" strokeWidth={5} strokeLinecap="round" />
    {[-7, 0, 7].map((sx) => <path key={sx} d={`M${sx} -86 L${sx} -53`} stroke="#fff3c9" strokeWidth={1.6} />)}
    <path d="M-17 -87 L17 -87" stroke="#a8702c" strokeWidth={4} strokeLinecap="round" />
  </g>
)

/** A worried face over a Person's smile (figure coordinates): little brows, a wobbly mouth, a sweat drop. */
const Worried = ({ patch }: { patch: string }) => (
  <g>
    <ellipse cx={0} cy={-104} rx={7} ry={4.5} fill={patch} />
    <path d="M-6 -103 q3 -3 6 0 q3 3 6 0" stroke="#6b2a3a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <path d="M-14 -119 L-4 -122 M14 -119 L4 -122" stroke="#2b2140" strokeWidth={2} strokeLinecap="round" />
    <path d="M26 -134 q6 9 0 12 q-6 -3 0 -12 Z" fill="#8fd3ff" stroke="#5aa8d8" strokeWidth={1.5} />
  </g>
)

/** A big open "O" mouth: Goliath being loud. */
const Shout = () => <ellipse cx={0} cy={-99} rx={5.5} ry={7} fill="#6b2a3a" stroke="#2b2140" strokeWidth={2} />

/** Swirly dizzy eyes over a Person's eyes. */
const DizzyEyes = ({ patch }: { patch: string }) => (
  <g>
    {[-8, 8].map((ex) => (
      <g key={ex}>
        <circle cx={ex} cy={-114} r={5.5} fill={patch} />
        <path d={`M${ex} -114 m-4 0 a4 4 0 1 1 4 4 a2.4 2.4 0 1 1 -1.8 -2.6`} stroke="#2b2140" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </g>
    ))}
  </g>
)

/** Sound lines coming out of a loud mouth, toward dir (-1 left, 1 right). */
const Loud = ({ x, y, dir = -1, s = 1 }: { x: number; y: number; dir?: 1 | -1; s?: number }) => (
  <g className="pa-twinkle">
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round">
      <path d="M8 -12 Q16 0 8 12" />
      <path d="M22 -22 Q36 0 22 22" />
      <path d="M38 -32 Q56 0 38 32" />
    </g>
  </g>
)

/** A shepherd's bag (pouch), open at the top. */
function Bag({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-26 -30 Q-32 2 0 6 Q32 2 26 -30 Z" fill="#b5794a" stroke="#7a4a24" strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={0} cy={-30} rx={26} ry={7} fill="#5a3a20" stroke="#7a4a24" strokeWidth={3} />
      <path d="M-18 -12 Q0 -6 18 -12" stroke="#7a4a24" strokeWidth={2} fill="none" />
    </g>
  )
}

/** One smooth stone with a shine. */
const Stone = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={12} ry={9} fill="#c4bdb3" stroke="#7d766d" strokeWidth={2.5} />
    <ellipse cx={-4} cy={-3} rx={4} ry={2.5} fill="#fff" opacity={0.6} />
  </g>
)

/** Little speed lines trailing to the left of something running off to the right. */
const Speed = ({ x, y }: { x: number; y: number }) => (
  <path d={`M${x} ${y - 10} l-22 0 M${x - 4} ${y} l-30 0 M${x} ${y + 10} l-22 0`} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
)

/** A puff of dust (a little cloud on the ground). */
const Puff = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#f3e6c8" stroke="#d9c49a" strokeWidth={2.5}>
    <circle cx={-18} cy={-8} r={14} /><circle cx={0} cy={-16} r={18} /><circle cx={20} cy={-8} r={14} />
  </g>
)

/** Bits of party confetti. */
const Confetti = ({ spots }: { spots: [number, number][] }) => (
  <g className="sc-float">
    {spots.map(([x, y], i) => (
      <rect key={i} x={x} y={y} width={9} height={14} rx={2} fill={['#ff6b6b', '#ffd34d', '#5fd39a', '#5fb7ff', '#c9a8ff', '#ff8cc0'][i % 6]} transform={`rotate(${(i * 47) % 90 - 45} ${x} ${y})`} />
    ))}
  </g>
)

/**
 * Goliath sitting on the ground after his fall, legs out in front, dizzy. (x, y) is where he sits.
 * The figure is cut at the hips (figure y = -40) and given a lap and two big feet.
 */
function SittingGiant({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  const k = s * 1.55
  const cid = `cl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const robe = PEOPLE.goliath.robe
  return (
    <g>
      <defs><clipPath id={cid}><rect x={x - 300} y={y - 500} width={600} height={500 - 8 * k} /></clipPath></defs>
      <g clipPath={`url(#${cid})`}>
        <Person x={x} y={y + 40 * k} s={s} look={PEOPLE.goliath} facing="left">{children}</Person>
      </g>
      <g transform={`translate(${x} ${y}) scale(${k})`}>
        <ellipse cx={0} cy={2} rx={62} ry={8} fill="#000" opacity={0.12} />
        <path d="M-52 0 Q-58 -26 -30 -27 Q0 -31 30 -27 Q58 -26 52 0 Q0 6 -52 0 Z" fill={robe} stroke={ink(robe)} strokeWidth={3} strokeLinejoin="round" />
        <path d="M-8 -26 Q0 -14 8 -26" stroke={ink(robe)} strokeWidth={2} fill="none" />
        <ellipse cx={-38} cy={-10} rx={10} ry={15} fill="#7a5233" stroke="#5a3a20" strokeWidth={2} transform="rotate(-28 -38 -10)" />
        <ellipse cx={38} cy={-10} rx={10} ry={15} fill="#7a5233" stroke="#5a3a20" strokeWidth={2} transform="rotate(28 38 -10)" />
      </g>
    </g>
  )
}

// ---------- Pages ----------

// 1. "David was a shepherd boy who took care of his sheep. David loved God, and God loved David."
const Page1 = () => (
  <Scene sky="day" ground="hills" sun>
    <Glow x={400} y={90} r={200} />
    <Tree x={130} y={350} s={1.1} />
    <Sheep x={235} y={408} s={1.15} />
    <Person x={390} y={412} s={1.45} look={PEOPLE.david} holding="staff" />
    <Sheep x={530} y={398} s={1} facing="left" />
    <Sheep x={470} y={428} s={0.65} facing="left" />
    <Sheep x={640} y={414} s={1.15} facing="left" />
    <Emoji e="💛" x={400} y={150} size={40} bob />
    <Sparkles spots={[[330, 120, 8], [470, 110, 10], [400, 80, 6]]} />
  </Scene>
)

// 2. "Out in the fields, David sang songs to God. God helped David keep his sheep safe, even from a lion and a bear!"
const Page2 = () => (
  <Scene sky="dawn" ground="hills">
    <Glow x={260} y={330} r={190} />
    <Sheep x={130} y={398} s={1.05} />
    <Sheep x={190} y={425} s={0.75} />
    <Person x={320} y={414} s={1.45} look={PEOPLE.david} pose="hold">
      <Lyre />
    </Person>
    <Emoji e="🎵" x={400} y={225} size={38} bob />
    <Emoji e="🎶" x={450} y={170} size={44} bob />
    <Emoji e="🎵" x={380} y={130} size={30} bob />
    <Emoji e="🦁" x={570} y={292} size={46} />
    <Emoji e="🐻" x={684} y={282} size={44} />
    <Speed x={536} y={292} />
    <Speed x={650} y={282} />
    <Sparkles spots={[[200, 270, 8], [140, 320, 6], [270, 210, 7]]} />
  </Scene>
)

// 3. "One day, David went to visit his big brothers. A giant named Goliath was there. He was big and loud, and everyone was afraid of him."
const Page3 = () => (
  <Scene sky="day" ground="hills" sun>
    <Tent x={175} y={345} w={180} />
    <Person x={130} y={412} s={1.05} look={BROTHER}>
      <Worried patch={BROTHER.beardColor ?? BROTHER.hairColor} />
    </Person>
    <Person x={230} y={418} s={1} look={BROTHER2} blinkDelay={1.2}>
      <Worried patch={BROTHER2.skin} />
    </Person>
    <Person x={350} y={418} s={1.15} look={PEOPLE.david} holding="basket" pose="hold" blinkDelay={2.1} />
    <Person x={590} y={412} s={1.08} look={PEOPLE.goliath} pose="arms-up" facing="left" blinkDelay={0.7}>
      <Shout />
    </Person>
    <Loud x={560} y={244} s={1.2} />
    <Loud x={620} y={244} s={1.2} dir={1} />
  </Scene>
)

// 4. "But David was not afraid. He said, God helped me before, and God will help me now! David trusted God."
const Page4 = () => (
  <Scene sky="glory" ground="hills">
    <Rays x={330} y={-20} r={560} n={20} opacity={0.45} />
    <Glow x={330} y={200} r={230} />
    <Person x={330} y={426} s={2.05} look={PEOPLE.david} pose="pray" />
    <g>
      <circle cx={455} cy={180} r={7} fill="#fff" stroke="#e8c0d0" strokeWidth={2.5} />
      <circle cx={480} cy={150} r={11} fill="#fff" stroke="#e8c0d0" strokeWidth={2.5} />
      <path d="M520 130 Q500 80 560 70 Q590 40 630 64 Q690 60 690 110 Q710 150 660 160 Q630 186 590 166 Q540 180 530 150 Q505 146 520 130 Z" fill="#fff" stroke="#e8c0d0" strokeWidth={3} strokeLinejoin="round" />
      <Emoji e="🐑" x={560} y={118} size={42} />
      <Emoji e="🦁" x={612} y={104} size={30} />
      <Emoji e="🐻" x={650} y={128} size={30} />
    </g>
    <Emoji e="💛" x={330} y={110} size={40} bob />
    <Sparkles spots={[[230, 140, 9], [420, 240, 8], [250, 260, 7], [410, 120, 6]]} />
  </Scene>
)

// 5. "David went to a stream and picked five smooth stones. He put them in his shepherd bag."
const ARC: [number, number][] = [[503, 347], [458, 304], [414, 283], [368, 280], [321, 297]]
const Page5 = () => (
  <Scene sky="day" ground="hills" sun>
    <Tree x={110} y={350} s={0.9} />
    <Sheep x={175} y={335} s={0.6} />
    <path d="M520 290 Q478 330 518 362 Q568 404 520 450 L760 450 Q690 396 642 354 Q602 318 572 290 Z" fill="#6cc0f2" stroke="#4fa8e8" strokeWidth={4} strokeLinejoin="round" />
    {[[540, 320], [575, 372], [610, 420], [650, 400]].map(([x, y], i) => <path key={i} className="sc-wave" d={`M${x} ${y} q10 -6 20 0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.8} />)}
    {[[598, 340], [628, 435], [560, 400]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={6} fill="#a9b3bd" opacity={0.8} />)}
    {[[500, 300], [470, 330], [680, 360]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l-4 -26 M${x + 6} ${y} l2 -30 M${x + 12} ${y} l6 -22`} stroke="#3f9a4a" strokeWidth={3} strokeLinecap="round" />)}
    <path d="M540 400 Q420 200 275 330" stroke="#fff" strokeWidth={3} strokeDasharray="4 10" fill="none" strokeLinecap="round" opacity={0.9} />
    <Person x={262} y={414} s={1.4} look={PEOPLE.david} pose="hold" />
    <Bag x={262} y={378} s={1.15} />
    {ARC.map(([x, y], i) => <Stone key={i} x={x} y={y} s={1.25} />)}
    <Sparkles spots={[[520, 330, 6], [300, 300, 7], [430, 260, 6]]} />
  </Scene>
)

// 6. "David swung his sling, round and round. Whoosh! The little stone flew, and the great big giant fell down. Boom!"
const Page6 = () => (
  <Scene sky="day" ground="hills" sun>
    <Person x={200} y={412} s={1.3} look={PEOPLE.david} pose="arms-up" holding="sling" />
    <ellipse cx={248} cy={280} rx={38} ry={15} stroke="#fff" strokeWidth={3.5} strokeDasharray="10 8" fill="none" />
    <path d="M290 262 Q440 120 596 196" stroke="#fff" strokeWidth={4} strokeDasharray="14 10" fill="none" strokeLinecap="round" />
    <g transform="rotate(24 560 410)">
      <Person x={560} y={410} s={1} look={PEOPLE.goliath} facing="left" blinkDelay={0.5}>
        <DizzyEyes patch={PEOPLE.goliath.skin} />
      </Person>
    </g>
    <path className="pa-twinkle" d="M606 198 l6 -16 l4 14 l14 -6 l-8 12 l14 6 l-16 2 l2 14 l-10 -10 l-10 10 l2 -14 l-16 -2 l14 -6 l-8 -12 Z" fill="#ffe14d" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />
    <Stone x={598} y={198} s={0.9} />
    <Emoji e="💫" x={678} y={176} size={40} bob />
    <path d="M690 230 q16 30 4 60 M712 260 q10 24 0 46" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
    <Puff x={500} y={420} s={1.1} />
    <Puff x={640} y={418} s={1.2} />
    <Emoji e="💥" x={575} y={385} size={56} />
  </Scene>
)

// 7. "Everybody cheered! God helped David, just like David trusted He would. God is bigger than any giant, and He is always with you, too!"
const Page7 = () => (
  <Scene sky="dawn" ground="hills">
    <Glow x={360} y={110} r={210} />
    <Tent x={700} y={300} w={110} />
    <Person x={150} y={412} s={1.1} look={PEOPLE.saul} pose="arms-up" blinkDelay={1.1} />
    <Person x={250} y={418} s={1.05} look={BROTHER} pose="arms-up" blinkDelay={2.4} />
    <Person x={370} y={414} s={1.5} look={PEOPLE.david} pose="arms-up" holding="sling" />
    <SittingGiant x={590} y={408} s={0.95}>
      <DizzyEyes patch={PEOPLE.goliath.skin} />
    </SittingGiant>
    <Sparkles spots={[[548, 196, 10], [590, 178, 8], [632, 196, 10], [612, 214, 6], [568, 214, 6]]} color="#ffe14d" />
    <Emoji e="🎉" x={480} y={120} size={44} bob />
    <Confetti spots={[[180, 140], [250, 90], [300, 180], [440, 200], [520, 90], [620, 130], [140, 230], [400, 60]]} />
    <Sparkles spots={[[300, 110, 9], [430, 100, 7], [360, 60, 6]]} />
  </Scene>
)

export const DAVID_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
