// David and the Giant: one illustration per story page (see data/david.ts for the words).
// Goliath is big and loud but goofy, never scary: no weapons, and when he falls he just sits down, dizzy.
// Reusable from here: RunningLion and RunningBear (side-on, mid-gallop, to scale with people), and
// ShepherdBag (a bag on a strap, worn by a Person, with stones peeking out).
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, starPath, useShade } from '../kit'
import { fluff } from '../items/draw'
import { Person, PEOPLE, type Look } from '../people'
import { Emoji, Glow, Rays, Scene, Sheep, Sparkles, Tap, Tree } from './kit'

// ---------- Local characters ----------

const BROTHER: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#b5794a', sash: '#6b8f5a', helmet: true }
const BROTHER2: Look = { skin: '#c68b5e', hair: 'curly', hairColor: '#4a3020', robe: '#6b8fb0', sash: '#e0b45a', helmet: true }

// ---------- Animals ----------

/** A leg (or tail) as a thick rounded line with an ink outline, like the people's arms. */
const Limb = ({ d, color, w }: { d: string; color: string; w: number }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={ink(color)} strokeWidth={w + 4} />
    <path d={d} stroke={color} strokeWidth={w} />
  </g>
)

/**
 * A lion running side-on, facing right (or `facing="left"`): mid-gallop with its near paws on the ground,
 * a fluffy mane and a tufted tail streaming behind. (x, y) = the ground under its middle; it's about 150
 * long and 85 tall at s = 1 (people are 150 tall).
 */
export function RunningLion({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const FUR = '#ffc65a', MANE = '#e0862a'
  const fur = useShade(FUR, 0.4, 0.15)
  const mane = useShade(MANE, 0.3, 0.18)
  const far = darken(FUR, 0.16)
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{fur.def}{mane.def}</defs>
      <ellipse cx={0} cy={0} rx={52} ry={4} fill="#000" opacity={0.12} />
      {/* tail streaming out behind, with a tuft */}
      <Limb d="M-36 -52 Q-58 -52 -68 -68" color={FUR} w={4} />
      <path d={fluff(-70, -72, 6, 6, 5)} fill={mane.fill} stroke={ink(MANE)} strokeWidth={2} />
      {/* far legs, in shadow: the back one kicked out behind, the front one reaching ahead */}
      <Limb d="M-22 -40 L-38 -30 L-56 -24" color={far} w={10} />
      <Limb d="M26 -40 L44 -32 L62 -28" color={far} w={10} />
      {/* body */}
      <ellipse cx={0} cy={-46} rx={42} ry={19} fill={fur.fill} stroke={ink(FUR)} strokeWidth={3} />
      {/* near legs: the back one pushing off the ground, the front one landing */}
      <Limb d="M-26 -38 L-34 -20 L-46 -6" color={FUR} w={10} />
      <Limb d="M22 -38 L34 -20 L46 -6" color={FUR} w={10} />
      {/* mane, ear, face (looking where it's going) */}
      <path d={fluff(42, -62, 24, 22, 11)} fill={mane.fill} stroke={ink(MANE)} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={45} cy={-75} r={5.5} fill={fur.fill} stroke={ink(FUR)} strokeWidth={2} />
      <circle cx={45} cy={-75} r={2.4} fill="#ff9fb8" />
      <ellipse cx={50} cy={-60} rx={15} ry={14} fill={fur.fill} stroke={ink(FUR)} strokeWidth={2.5} />
      <ellipse cx={62} cy={-54} rx={9} ry={7} fill="#fff1d6" stroke={ink(FUR)} strokeWidth={1.5} />
      <path d="M65 -61 Q71 -61 70 -57 Q67 -55.5 64.5 -57.5 Z" fill="#7a3b2a" />
      <ellipse cx={62.5} cy={-50.5} rx={2.4} ry={2} fill="#7a3b2a" />
      <ellipse cx={53} cy={-64} rx={2.8} ry={3.6} fill="#2b2140" />
      <circle cx={52.2} cy={-65.4} r={1.1} fill="#fff" />
    </g>
  )
}

/**
 * A bear running side-on, facing right (or `facing="left"`): a round furry body with a shoulder hump,
 * stubby legs mid-stride, round ears and a pale snout. (x, y) = the ground under its middle; about 125
 * long and 85 tall at s = 1.
 */
export function RunningBear({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const FUR = '#b9804f', PALE = '#f3d6ae'
  const fur = useShade(FUR, 0.38, 0.18)
  const far = darken(FUR, 0.16)
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{fur.def}</defs>
      <ellipse cx={0} cy={0} rx={48} ry={4} fill="#000" opacity={0.12} />
      {/* far legs, in shadow */}
      <Limb d="M-22 -34 L-34 -26 L-48 -22" color={far} w={13} />
      <Limb d="M26 -34 L40 -28 L54 -24" color={far} w={13} />
      {/* stubby tail, then the body with a hump over the shoulders */}
      <circle cx={-43} cy={-50} r={6} fill={fur.fill} stroke={ink(FUR)} strokeWidth={2.2} />
      <path d="M-46 -44 Q-46 -68 -14 -68 Q8 -78 30 -66 Q48 -56 44 -38 Q40 -22 0 -22 Q-44 -22 -46 -44 Z" fill={fur.fill} stroke={ink(FUR)} strokeWidth={3} strokeLinejoin="round" />
      {/* near legs */}
      <Limb d="M-26 -30 L-32 -17 L-42 -7" color={FUR} w={13} />
      <Limb d="M24 -30 L32 -17 L40 -7" color={FUR} w={13} />
      {/* ear (half behind the head), head, snout, nose, eye */}
      <circle cx={45} cy={-75} r={7} fill={fur.fill} stroke={ink(FUR)} strokeWidth={2.2} />
      <circle cx={45} cy={-75} r={3.4} fill={PALE} />
      <circle cx={53} cy={-58} r={17} fill={fur.fill} stroke={ink(FUR)} strokeWidth={2.5} />
      <ellipse cx={67} cy={-52} rx={9} ry={7} fill={PALE} stroke={ink(FUR)} strokeWidth={1.5} />
      <ellipse cx={73} cy={-56} rx={3.6} ry={2.8} fill="#5a3826" />
      <ellipse cx={67} cy={-47.5} rx={2.2} ry={1.8} fill="#5a3826" />
      <ellipse cx={57} cy={-62} rx={2.8} ry={3.6} fill="#2b2140" />
      <circle cx={56.2} cy={-63.4} r={1.1} fill="#fff" />
    </g>
  )
}

// ---------- Local props ----------

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

/**
 * A worried face over a Person's smile (figure coordinates): slanted brows just under the helmet rim, a
 * wobbly mouth and a sweat drop. `beard`: the mouth is on the beard, under the moustache.
 */
const Worried = ({ patch, beard }: { patch: string; beard?: boolean }) => (
  <g>
    {beard ? (
      <>
        <ellipse cx={0} cy={-98} rx={5.8} ry={3.2} fill={patch} />
        <path d="M-5 -98 q2.5 -2.4 5 0 q2.5 2.4 5 0" stroke="#d0707e" strokeWidth={2} fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx={0} cy={-104} rx={7} ry={4.5} fill={patch} />
        <path d="M-6 -103 q3 -3 6 0 q3 3 6 0" stroke="#6b2a3a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </>
    )}
    <path d="M-13 -118.6 L-4.5 -120.2 M13 -118.6 L4.5 -120.2" stroke="#2b2140" strokeWidth={1.8} strokeLinecap="round" />
    <path d="M27 -132 q6 9 0 12 q-6 -3 0 -12 Z" fill="#8fd3ff" stroke="#5aa8d8" strokeWidth={1.5} />
  </g>
)

/** A big open "O" mouth under the moustache: Goliath being loud. */
const Shout = () => <ellipse cx={0} cy={-95.5} rx={5} ry={6} fill="#6b2a3a" stroke="#2b2140" strokeWidth={1.8} />

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

/** Little stars circling a dizzy head, on an orbit tilted `rot` degrees. */
function DizzyStars({ x, y, rx = 36, ry = 9, rot = 0 }: { x: number; y: number; rx?: number; ry?: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="6 6" opacity={0.9} />
      {[200, 290, 20, 110].map((deg, i) => {
        const a = (deg * Math.PI) / 180
        return (
          <path key={deg} className="pa-twinkle" style={{ animationDelay: `${i * 0.25}s` } as CSSProperties}
            d={starPath(x + Math.cos(a) * rx, y + Math.sin(a) * ry, i % 2 ? 6 : 8)} fill="#ffe14d" stroke="#e0a800" strokeWidth={1.5} strokeLinejoin="round" />
        )
      })}
    </g>
  )
}

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

/** One smooth stone with a shine. */
const Stone = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={12} ry={9} fill="#c4bdb3" stroke="#7d766d" strokeWidth={2.5} />
    <ellipse cx={-4} cy={-3} rx={4} ry={2.5} fill="#fff" opacity={0.6} />
  </g>
)

/** Where the stones sit in a ShepherdBag's open top (figure coordinates). */
const BAG_STONES: [number, number][] = [[14, -59.5], [23, -61], [32, -61], [41, -59.5]]

/**
 * A shepherd's bag at a Person's right hip, on a strap over the other shoulder, open at the top with up
 * to 4 smooth `stones` peeking out. Draw it as a child of the Person (figure coordinates); it suits any
 * pose that keeps the right hand clear of the hip (point, wave, arms-up).
 */
export const ShepherdBag = ({ stones = 0 }: { stones?: number }) => (
  <g>
    <path d="M-16 -88 L12 -61" stroke="#6b4422" strokeWidth={6} strokeLinecap="round" />
    <path d="M-16 -88 L12 -61" stroke="#a0703f" strokeWidth={3.2} strokeLinecap="round" />
    <ellipse cx={28} cy={-60} rx={20} ry={5} fill="#5a3a20" stroke="#7a4a24" strokeWidth={2} />
    {BAG_STONES.slice(0, stones).map(([sx, sy]) => <Stone key={sx} x={sx} y={sy} s={0.4} />)}
    <path d="M8 -60 Q28 -54 48 -60 Q52 -36 28 -32 Q4 -36 8 -60 Z" fill="#b5794a" stroke="#7a4a24" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M14 -46 Q28 -41 42 -46" stroke="#7a4a24" strokeWidth={1.6} fill="none" strokeLinecap="round" />
  </g>
)

/** A stone held up in a Person's right hand in pose="point", still dripping from the stream. */
const StoneInHand = () => (
  <g>
    <Stone x={55} y={-97} s={0.55} />
    <path d="M59 -79 q2.4 3.4 0 5 q-2.4 -1.6 0 -5 Z M64 -73 q2 2.8 0 4.2 q-2 -1.4 0 -4.2 Z" fill="#8fd3ff" stroke="#5aa8d8" strokeWidth={0.8} />
  </g>
)

/** Little speed lines trailing to the left of something running off to the right. */
const Speed = ({ x, y, s = 1, color = '#fff' }: { x: number; y: number; s?: number; color?: string }) => (
  <path d={`M${x} ${y - 10 * s} l${-22 * s} 0 M${x - 4 * s} ${y} l${-30 * s} 0 M${x} ${y + 10 * s} l${-22 * s} 0`} stroke={color} strokeWidth={4 * Math.min(1, s * 1.5)} strokeLinecap="round" />
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
 * Goliath sitting on the ground after his fall, dizzy: his legs stuck out toward us in a V, his hands
 * resting on his knees. (x, y) is where he sits. The standing figure is cut off at the hips.
 */
function SittingGiant({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  const k = s * 1.55
  const cid = `cl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const { robe, skin } = PEOPLE.goliath
  const leg = (d: string) => (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={ink(robe)} strokeWidth={29} />
      <path d={d} stroke={robe} strokeWidth={25} />
      <path d={d} stroke={lighten(robe, 0.15)} strokeWidth={12} opacity={0.7} />
    </g>
  )
  return (
    <g>
      <defs><clipPath id={cid}><rect x={x - 300} y={y - 500} width={600} height={500 - 8 * k} /></clipPath></defs>
      <g clipPath={`url(#${cid})`}>
        <Person x={x} y={y + 40 * k} s={s} look={PEOPLE.goliath} facing="left">{children}</Person>
      </g>
      <g transform={`translate(${x} ${y}) scale(${k})`}>
        <ellipse cx={0} cy={1} rx={70} ry={8} fill="#000" opacity={0.12} />
        {/* his lap, then each leg stuck out toward us */}
        <path d="M-31 -25 Q0 -31 31 -25 L33 -6 Q0 0 -33 -6 Z" fill={robe} stroke={ink(robe)} strokeWidth={3} strokeLinejoin="round" />
        {leg('M-13 -14 L-39 -6')}
        {leg('M13 -14 L39 -6')}
        <path d="M0 -25 Q-2 -15 0 -7" stroke={ink(robe)} strokeWidth={2} fill="none" strokeLinecap="round" />
        {/* the soles of his big feet */}
        {[-1, 1].map((d) => <ellipse key={d} cx={d * 50} cy={-8} rx={10} ry={15} fill="#7a5233" stroke="#5a3a20" strokeWidth={2} transform={`rotate(${d * 22} ${d * 50} -8)`} />)}
        {/* hands resting on his knees, where his arms come down */}
        {[-1, 1].map((d) => <circle key={d} cx={d * 25} cy={-25} r={7} fill={skin} stroke={ink(skin)} strokeWidth={2} />)}
      </g>
    </g>
  )
}

// ---------- Pages ----------

// 1. "David was a shepherd boy who took care of his sheep. God loved David, and David loved God."
const Page1 = () => (
  <Scene sky="day" ground="hills" sun>
    <Glow x={400} y={90} r={200} />
    <Tree x={130} y={350} s={1.1} />
    <Tap say="Baa!"><Sheep x={235} y={408} s={1.15} /></Tap>
    <Tap say="Hi! I'm David. I take care of my sheep!">
      <Person x={390} y={412} s={1.45} look={PEOPLE.david} holding="staff" />
    </Tap>
    <Sheep x={530} y={398} s={1} facing="left" />
    <Tap say="Baa, baa!"><Sheep x={470} y={428} s={0.65} facing="left" /></Tap>
    <Sheep x={640} y={414} s={1.15} facing="left" />
    <Tap say="God loves you!" sfx="sparkle"><Emoji e="💛" x={400} y={150} size={40} bob /></Tap>
    <Sparkles spots={[[330, 120, 8], [470, 110, 10], [400, 80, 6]]} />
  </Scene>
)

// 2. "Out in the fields, David sang songs to God. God helped David keep his sheep safe, even from a lion and a bear!"
// God's light is round David and his sheep; the lion and the bear run off over the hill.
const Page2 = () => (
  <Scene sky="dawn" ground="hills">
    <Glow x={250} y={340} r={210} />
    <Tap say="Grr!" sfx="whoosh"><RunningBear x={705} y={324} s={0.6} /></Tap>
    <Speed x={668} y={298} />
    <Tap say="Roar!" sfx="whoosh"><RunningLion x={572} y={334} s={0.62} /></Tap>
    <Speed x={518} y={305} />
    <Tap say="Baa!"><Sheep x={130} y={398} s={1.05} /></Tap>
    <Sheep x={190} y={425} s={0.75} />
    {/* his shepherd's crook, stuck in the ground beside him while he plays */}
    <path d="M380 418 L374 270 Q372 250 386 248 Q398 248 396 262" stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
    <Tap say="I love to sing to God!" sfx="ding">
      <Person x={320} y={414} s={1.45} look={PEOPLE.david} pose="hold"><Lyre /></Person>
    </Tap>
    <Emoji e="🎵" x={400} y={225} size={38} bob />
    <Emoji e="🎶" x={450} y={170} size={44} bob />
    <Emoji e="🎵" x={380} y={130} size={30} bob />
    <Sparkles spots={[[200, 270, 8], [140, 320, 6], [270, 210, 7], [420, 330, 6]]} />
  </Scene>
)

// 3. "One day, David took some bread to his big brothers. A giant named Goliath was there. He was big and loud, and all the soldiers were afraid of him."
const Page3 = () => (
  <Scene sky="day" ground="hills" sun>
    <Tent x={175} y={345} w={180} />
    <Tap say="Oh no, a giant!" sfx="wobble">
      <Person x={130} y={412} s={1.05} look={BROTHER}>
        <Worried patch={BROTHER.beardColor ?? BROTHER.hairColor} beard />
      </Person>
    </Tap>
    <Tap say="He is so loud!" sfx="wobble">
      <Person x={230} y={418} s={1} look={BROTHER2} blinkDelay={1.2}>
        <Worried patch={BROTHER2.skin} />
      </Person>
    </Tap>
    <Tap say="I brought you some bread!">
      <Person x={350} y={418} s={1.15} look={PEOPLE.david} holding="basket" pose="hold" blinkDelay={2.1} />
    </Tap>
    <Tap say="I'm Goliath! I'm big and loud!" sfx="wobble">
      <g>
        {/* his loud voice, outside his raised arms (drawn first, so the arms are in front) */}
        <Loud x={500} y={250} s={1.1} />
        <Loud x={680} y={250} s={1.1} dir={1} />
        <Person x={590} y={412} s={1.08} look={PEOPLE.goliath} pose="arms-up" facing="left" blinkDelay={0.7}>
          <Shout />
        </Person>
      </g>
    </Tap>
  </Scene>
)

// 4. "But David was not afraid. He told King Saul, "God helped me before, and God will help me now!" David trusted God."
// David thinks of the lion and the bear running away from his sheep.
const Page4 = () => (
  <Scene sky="glory" ground="hills">
    <Rays x={390} y={-20} r={560} n={20} opacity={0.45} />
    <Glow x={390} y={220} r={220} />
    <Tap say="Go, and God be with you!" sfx="good">
      <Person x={150} y={420} s={1.45} look={PEOPLE.saul} blinkDelay={1.4} />
    </Tap>
    <Tap say="God will help me!" sfx="sparkle">
      <Person x={390} y={428} s={1.6} look={PEOPLE.david} pose="pray" />
    </Tap>
    <Tap say="God kept my sheep safe!">
      <g>
        <circle cx={466} cy={226} r={6} fill="#fff" stroke="#e8c0d0" strokeWidth={2.5} />
        <circle cx={496} cy={200} r={10} fill="#fff" stroke="#e8c0d0" strokeWidth={2.5} />
        <path d={fluff(630, 116, 120, 70, 13, 0.6)} fill="#fff" stroke="#e8c0d0" strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={632} cy={150} rx={100} ry={7} fill="#c8ecc0" />
        <Sheep x={556} y={150} s={0.55} />
        <Speed x={602} y={130} s={0.35} color="#d9b8cc" />
        <RunningLion x={640} y={150} s={0.44} />
        <Speed x={683} y={134} s={0.3} color="#d9b8cc" />
        <RunningBear x={704} y={150} s={0.38} />
      </g>
    </Tap>
    <Tap say="God loves you!" sfx="sparkle"><Emoji e="💛" x={390} y={186} size={40} bob /></Tap>
    <Sparkles spots={[[300, 160, 9], [470, 280, 8], [300, 300, 7], [455, 150, 6]]} />
  </Scene>
)

// 5. "David went to a stream and picked five smooth stones. He put them in his shepherd's bag."
// Four are in his bag and he holds up the fifth, still dripping: five to count.
// The stream winds down from a dip between the far hills (its far end tucked under a little knoll) and
// widens toward us.
const STREAM = 'M595 285 C590 296 580 304 579 318 C578 332 590 340 588 356 C586 374 566 386 558 404 C550 422 542 436 538 450 L792 450 C744 428 700 410 682 390 C664 370 648 358 638 342 C628 326 616 318 612 304 C609 294 608 290 606 285 Z'
const Page5 = () => (
  <Scene sky="day" ground="hills" sun>
    <Tree x={150} y={352} s={0.95} />
    <Tap say="Baa!"><Sheep x={300} y={346} s={0.62} /></Tap>
    <path d={STREAM} fill="#6cc0f2" stroke="#4fa8e8" strokeWidth={4} strokeLinejoin="round" />
    <path d="M566 290 C578 278 594 278 601 281 C608 278 624 278 636 290 C620 296 582 296 566 290 Z" fill="#a8d8a0" />
    {[[592, 336], [596, 384], [626, 418], [696, 440]].map(([x, y], i) => <path key={i} className="sc-wave" d={`M${x} ${y} q10 -6 20 0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.8} />)}
    {[[640, 300], [694, 374], [762, 404]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l-4 -26 M${x + 6} ${y} l2 -30 M${x + 12} ${y} l6 -22`} stroke="#3f9a4a" strokeWidth={3} strokeLinecap="round" />)}
    <Tap say="One, two, three, four, five smooth stones!" sfx="plop">
      <Person x={490} y={422} s={1.55} look={PEOPLE.david} pose="point">
        <ShepherdBag stones={4} />
        <StoneInHand />
      </Person>
    </Tap>
    <Sparkles spots={[[568, 298, 7], [542, 288, 5]]} />
  </Scene>
)

// 6. "David swung his sling, round and round. Whoosh! The little stone flew, and the great big giant fell down. Boom!"
// The sling is empty now; the stone bonks Goliath's forehead and he tips over, dizzy.
const Page6 = () => (
  <Scene sky="day" ground="hills" sun>
    {/* the sling whirling round his hand (behind his head) */}
    <ellipse cx={236} cy={300} rx={27} ry={9} stroke="#fff" strokeWidth={3.5} strokeDasharray="10 8" fill="none" />
    <Tap say="Whoosh!" sfx="whoosh">
      <Person x={200} y={412} s={1.1} look={PEOPLE.david} pose="wave" holding="sling-empty" />
    </Tap>
    <path d="M262 296 Q440 106 588 214" stroke="#fff" strokeWidth={4} strokeDasharray="14 10" fill="none" strokeLinecap="round" />
    <Tap say="Whoa! I'm dizzy!" sfx="wobble">
      <g>
        <g transform="rotate(24 560 410)">
          <Person x={560} y={410} s={1} look={PEOPLE.goliath} facing="left" blinkDelay={0.5}>
            <DizzyEyes patch={PEOPLE.goliath.skin} />
          </Person>
        </g>
        <DizzyStars x={656} y={192} rx={38} ry={9} rot={24} />
        <path d="M700 236 q16 30 4 60 M722 266 q10 24 0 46" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </Tap>
    {/* bonk! on his forehead */}
    <path className="pa-twinkle" d={starPath(610, 231, 12)} fill="#ffe14d" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />
    <Tap say="Bonk!" sfx="ding"><Stone x={599} y={224} s={0.85} /></Tap>
    <Puff x={500} y={420} s={1.1} />
    <Puff x={640} y={418} s={1.2} />
  </Scene>
)

// 7. "Everybody cheered! God helped David, just like David knew He would. God is bigger than any giant, and He is always with you, too!"
const Page7 = () => (
  <Scene sky="dawn" ground="hills">
    <Glow x={330} y={110} r={210} />
    <Tent x={718} y={300} w={110} />
    <Tap say="Hooray for David!" sfx="good">
      <Person x={120} y={412} s={1.1} look={PEOPLE.saul} pose="arms-up" blinkDelay={1.1} />
    </Tap>
    <Tap say="Hooray!">
      <Person x={215} y={418} s={1.05} look={BROTHER} pose="arms-up" blinkDelay={2.4} />
    </Tap>
    <Tap say="God helped me!" sfx="fanfare">
      <Person x={318} y={414} s={1.15} look={PEOPLE.david} pose="arms-up" holding="sling-empty" />
    </Tap>
    <Person x={432} y={418} s={1} look={BROTHER2} pose="arms-up" blinkDelay={0.6} />
    <Tap say="Ooh, I'm dizzy!" sfx="wobble">
      <g>
        <SittingGiant x={590} y={408} s={0.95}>
          <DizzyEyes patch={PEOPLE.goliath.skin} />
        </SittingGiant>
        <Sparkles spots={[[548, 196, 10], [590, 178, 8], [632, 196, 10], [612, 214, 6], [568, 214, 6]]} color="#ffe14d" />
      </g>
    </Tap>
    <Confetti spots={[[180, 140], [250, 90], [300, 180], [440, 200], [520, 90], [620, 130], [140, 230], [400, 60]]} />
    <Sparkles spots={[[300, 110, 9], [430, 100, 7], [360, 60, 6]]} />
  </Scene>
)

export const DAVID_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
