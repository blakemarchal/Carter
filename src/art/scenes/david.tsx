// David and the Giant: one illustration per story page, both parts in order (see data/david.ts for the
// words). Part 1 (pictures 1 to 5) is David the shepherd boy; part 2 (pictures 6 to 11) is the giant.
// Goliath is big and loud but goofy, never scary: no weapons, and when he falls he just sits down, dizzy.
// Reusable from here: RunningLion and RunningBear (side-on, mid-gallop, to scale with people);
// ShepherdBag (a bag on a strap, worn by a Person, with stones peeking out); SAMUEL (a look, for
// people.tsx); Lyre (David's little harp, held in pose "hold"); Rock and SittingOnRock (someone sitting
// on a rock, facing us); WoolSheep (the kit's sheep grazing, drinking, asleep or carried, with eyes shut
// or ears and tail moving to music); MusicNote; and Zzz (a sleeper's z's).
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, starPath, useShade } from '../kit'
import { fluff } from '../items/draw'
import { Person, PEOPLE, SKIN, type Holding, type Look, type Pose } from '../people'
import { Emoji, Flower, Glow, House, Moon, Rays, Scene, Sheep, Sparkles, Tap, Tree } from './kit'

// ---------- Local characters ----------

const BROTHER: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#b5794a', sash: '#6b8f5a', helmet: true }
const BROTHER2: Look = { skin: '#c68b5e', hair: 'curly', hairColor: '#4a3020', robe: '#6b8fb0', sash: '#e0b45a', helmet: true }
/** At home, before they went to be soldiers: the same two brothers without their helmets, and another big brother. */
const HOME1: Look = { ...BROTHER, helmet: false }
const HOME2: Look = { ...BROTHER2, helmet: false }
const BROTHER3: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', robe: '#c0704e', sash: '#f0d38a' }

/** Samuel the prophet: old and kind, with a long white beard, a brown head cloth and a deep teal robe. */
export const SAMUEL: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#b98f5e', beard: 'long', beardColor: '#f4f1ea', robe: '#2f7f78', sash: '#f0d38a' }

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

// The kit's sheep (kit.tsx Sheep) in more poses, with the same wool, face and colors.
const WOOL: [number, number][] = [[-24, -40], [-6, -48], [12, -44], [24, -34], [-26, -26], [0, -28], [20, -24]]
const SHEEP_FACE = '#4a3a3a', SHEEP_EAR = '#3d2f31'
/** Where the ear [x, y, turn], the point it turns about, the face [x, y, rx, ry, turn] and the eye are, for each way of holding the head. */
const SHEEP_HEADS = {
  up: { ear: [30, -51, -35], hinge: [35, -48], face: [40, -40, 13, 11, 0], eye: [45, -43] },
  down: { ear: [30, -25, 15], hinge: [37, -23], face: [45, -14, 11, 12.5, -25], eye: [48.5, -18] },
  rest: { ear: [28, -23, 20], hinge: [33, -21], face: [40, -12, 12.5, 10, 8], eye: [44, -14] },
} as const

/**
 * A sheep side-on, facing right (or `facing="left"`), drawn like the kit's Sheep. (x, y) = the ground
 * under it. `head`: "up" (as the kit's), "down" (eating grass or drinking), or "rest" (lying down, its
 * legs tucked under it). `sleepy`: eyes shut (always, when resting). For music: `ear` turns the ear
 * (degrees; more is perkier), and `tail` shows a little woolly tail at the back, turned `wag` degrees.
 */
export function WoolSheep({ x, y, s = 1, facing = 'right', head = 'up', sleepy, ear = 0, tail, wag = 0 }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; head?: 'up' | 'down' | 'rest'; sleepy?: boolean
  ear?: number; tail?: boolean; wag?: number
}) {
  const H = SHEEP_HEADS[head]
  const rest = head === 'rest'
  const dy = rest ? 11 : 0 // lying down: the wool sits on the ground
  const shut = sleepy || rest
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      {rest ? (
        // a front hoof peeking out from under the wool
        <rect x={20} y={-7} width={13} height={7} rx={3.5} fill={SHEEP_FACE} />
      ) : (
        <>
          {[-14, 24].map((lx) => <rect key={lx} x={lx} y={-24} width={7} height={23} rx={3.5} fill="#2f2528" />)}
          {[-24, 14].map((lx) => <rect key={lx} x={lx} y={-22} width={8} height={22} rx={4} fill={SHEEP_FACE} />)}
        </>
      )}
      <g className="sc-breathe">
        {tail && (
          <g transform={`rotate(${wag} -36 ${-36 + dy})`}>
            <circle cx={-43} cy={-38 + dy} r={6.5} fill="#fffaf2" stroke="#d8cfc2" strokeWidth={2.5} />
          </g>
        )}
        <g fill="#fffaf2" stroke="#d8cfc2" strokeWidth={2.5}>
          {WOOL.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy + dy} r={15} />)}
        </g>
        <g transform={`rotate(${ear} ${H.hinge[0]} ${H.hinge[1]})`}>
          <ellipse cx={H.ear[0]} cy={H.ear[1]} rx={8} ry={3.8} fill={SHEEP_EAR} transform={`rotate(${H.ear[2]} ${H.ear[0]} ${H.ear[1]})`} />
        </g>
        <ellipse cx={H.face[0]} cy={H.face[1]} rx={H.face[2]} ry={H.face[3]} fill={SHEEP_FACE} transform={`rotate(${H.face[4]} ${H.face[0]} ${H.face[1]})`} />
        {shut ? (
          <path d={`M${H.eye[0] - 3.4} ${H.eye[1] - 0.6} q3.4 2.8 6.8 0`} stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        ) : (
          <>
            <circle cx={H.eye[0]} cy={H.eye[1]} r={2.8} fill="#fff" />
            <circle cx={H.eye[0] + 0.8} cy={H.eye[1]} r={1.4} fill="#2b2140" />
          </>
        )}
      </g>
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

/** David's small harp (a lyre), held at the chest: draw it as a child of a Person in pose="hold". */
export const Lyre = () => (
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

/** A surprised face over a Person's smile (figure coordinates; no beard): raised eyebrows and a little round "oh". */
const Surprised = ({ patch }: { patch: string }) => (
  <g>
    <ellipse cx={0} cy={-104.5} rx={7} ry={4.4} fill={patch} />
    <ellipse cx={0} cy={-104} rx={3.4} ry={4.2} fill="#6b2a3a" stroke="#2b2140" strokeWidth={1.2} />
    <path d="M-11.5 -121 Q-8 -125 -4.5 -121 M4.5 -121 Q8 -125 11.5 -121" stroke="#2b2140" strokeWidth={1.8} fill="none" strokeLinecap="round" />
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

// ---------- Sitting on a rock, music and sleep ----------

/** How far the seat of a Rock is above the ground, in its own units. */
const SEAT = 30

/**
 * A big smooth rock to sit on: a flat seat (SEAT·s up) in the middle, and a rounded bump at the back on
 * the left. (x, y) = the ground under the middle of the seat. `night`: in the moonlight.
 */
export function Rock({ x, y, s = 1, night }: { x: number; y: number; s?: number; night?: boolean }) {
  const color = night ? '#8d93ab' : '#c2b8a6'
  const shade = useShade(color, 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{shade.def}</defs>
      <ellipse cx={-6} cy={0} rx={80} ry={6} fill="#000" opacity={0.14} />
      <path d={`M-78 0 Q-86 -30 -68 -50 Q-52 -66 -36 -56 Q-28 -50 -26 ${-SEAT - 2} Q0 ${-SEAT - 4} 34 ${-SEAT - 1} Q58 ${-SEAT + 1} 64 -14 Q68 -4 62 0 Z`}
        fill={shade.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-66 -40 Q-58 -54 -46 -54" stroke="#fff" strokeWidth={3.5} opacity={0.35} fill="none" strokeLinecap="round" />
      <path d="M40 -20 l7 6 l-2 9" stroke={ink(color)} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
      <path d="M-58 -16 l8 4" stroke={ink(color)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.45} />
    </g>
  )
}

/** How far a sitting Person comes down (figure units): their hips onto the seat. */
const SIT_DROP = 14

/**
 * Someone sitting on a rock, facing us (draw the Rock first, its seat at their hips): a Person with the
 * same look from the waist up, their knees in front under the robe, then their shins and sandals.
 * (x, y) = their feet on the ground; the seat is about 30 figure units up (times 0.74 for a child, as
 * for Person). `children` are drawn on the Person, in its own units; `front` is drawn over the lap (a
 * harp resting on it), in the same units. `sway` tips the body from the hips, in degrees (swaying to music).
 */
export function SittingOnRock({ x, y, s = 1, look, pose = 'stand', holding, blinkDelay = 0, sway = 0, children, front }: {
  x: number; y: number; s?: number; look: Look; pose?: Pose; holding?: Holding; blinkDelay?: number; sway?: number
  children?: ReactNode; front?: ReactNode
}) {
  const b = look.build === 'child' ? 0.74 : look.build === 'giant' ? 1.55 : 1
  const robe = useShade(look.robe, 0.3, 0.2)
  const clip = `sit${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const tip = `rotate(${sway} 0 -30)`
  return (
    <g transform={`translate(${x} ${y}) scale(${s * b})`}>
      <defs>{robe.def}<clipPath id={clip}><rect x={-120} y={-260} width={240} height={234} /></clipPath></defs>
      {/* shins and sandals, a little apart */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M${d * 13} -18 L${d * 14} -7`} stroke={ink(look.skin)} strokeWidth={12} strokeLinecap="round" />
          <path d={`M${d * 13} -18 L${d * 14} -7`} stroke={look.skin} strokeWidth={9} strokeLinecap="round" />
          <ellipse cx={d * 15} cy={-4} rx={10} ry={5} fill="#7a5233" />
        </g>
      ))}
      <g transform={tip}>
        <g clipPath={`url(#${clip})`}>
          <Person x={0} y={SIT_DROP} s={1 / b} look={look} pose={pose} holding={holding} blinkDelay={blinkDelay}>{children}</Person>
        </g>
      </g>
      {/* the lap: the robe over the knees (just under the sash), hanging to the middle of the shins */}
      <path d="M-28 -31 Q0 -24 28 -31 Q34 -28 34 -22 Q34 -17 31 -15 Q23 -12 15 -14 Q7 -16 0 -13 Q-7 -16 -15 -14 Q-23 -12 -31 -15 Q-34 -17 -34 -22 Q-34 -28 -28 -31 Z"
        fill={robe.fill} stroke={ink(look.robe)} strokeWidth={3} strokeLinejoin="round" />
      {[-1, 1].map((d) => <ellipse key={d} cx={d * 17} cy={-24} rx={9} ry={4.5} fill="#fff" opacity={0.16} />)}
      <path d="M0 -26 Q-1 -20 0 -14" stroke={ink(look.robe)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.55} />
      {front && <g transform={tip}><g transform={`translate(0 ${SIT_DROP})`}>{front}</g></g>}
    </g>
  )
}

/** A little music note (or two joined notes, `double`), with an outline so it shows on any sky. (x, y) = its middle. */
export function MusicNote({ x, y, s = 1, color = '#ffe680', double }: { x: number; y: number; s?: number; color?: string; double?: boolean }) {
  const line = darken(color, 0.45)
  const stem = double ? 'M-5 10 L-5 -14 L15 -19 L15 5' : 'M3 10 L3 -16 Q12 -12 13 -3'
  const heads: [number, number][] = double ? [[-10, 11], [10, 6]] : [[-2, 11]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={stem} fill="none" stroke={line} strokeWidth={6.5} strokeLinejoin="round" strokeLinecap="round" />
      <path d={stem} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      {heads.map(([hx, hy]) => <ellipse key={hx} cx={hx} cy={hy} rx={6.6} ry={5} transform={`rotate(-20 ${hx} ${hy})`} fill={color} stroke={line} strokeWidth={2} />)}
    </g>
  )
}

/** Sleepy z's floating up from a sleeper, getting bigger as they go. (x, y) = the first, smallest z. */
export const Zzz = ({ x, y, s = 1, color = '#e8f0ff' }: { x: number; y: number; s?: number; color?: string }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 0 h9 l-9 10 h9" />
      <path d="M14 -18 h12 l-12 13 h12" />
      <path d="M32 -40 h15 l-15 16 h15" />
    </g>
  </g>
)

/** Hills by moonlight (the same blues as the shepherds' fields on the Christmas island). */
const NightHills = () => (
  <g>
    <path d="M0 300 Q160 262 340 292 Q540 250 800 286 L800 450 L0 450 Z" fill="#3e5e86" />
    <path d="M0 362 Q220 330 440 360 T800 350 L800 450 L0 450 Z" fill="#35577a" />
  </g>
)

// ---------- Pages ----------
// Part 1: David the shepherd boy.

// 1. "David was a shepherd boy who took care of his sheep. God loved David, and David loved God."
const Shepherd = () => (
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

// 2. "Every day, David led his father's sheep to green grass and cool water. When a little lamb got tired, David carried it in his arms."
// The flock eats the grass and drinks at a still pond; the tired lamb dozes in David's arms.
const POND = 'M452 404 C452 382 522 370 602 370 C690 370 752 384 752 404 C752 424 690 436 602 436 C516 436 452 426 452 404 Z'
const TUFTS: [number, number][] = [[30, 392], [92, 438], [168, 376], [236, 442], [300, 410], [340, 446], [470, 446], [764, 444], [512, 352], [660, 348], [770, 362]]
const FLOWERS: [number, number, string][] = [[52, 424, '#ff8cc0'], [126, 400, '#ffffff'], [214, 436, '#ffd34d'], [276, 424, '#ff8cc0'], [24, 446, '#ffd34d']]

const GreenGrass = () => (
  <Scene sky="day" ground="hills" sun>
    <Tree x={74} y={356} s={1.05} />
    {TUFTS.map(([x, y]) => <path key={`${x}${y}`} d={`M${x} ${y} l-5 -12 M${x + 5} ${y} l1 -15 M${x + 10} ${y} l6 -11`} stroke="#4f9a4a" strokeWidth={3} fill="none" strokeLinecap="round" />)}
    {FLOWERS.map(([x, y, c]) => <Flower key={`${x}${y}`} x={x} y={y} color={c} />)}
    <WoolSheep x={290} y={380} s={0.66} facing="left" head="down" />
    <Tap say="Munch, munch! Yummy green grass." sfx="chomp"><WoolSheep x={150} y={414} s={1} head="down" /></Tap>
    {/* the still pond, with two sheep drinking at the far side */}
    <path d={POND} fill="#6cc0f2" stroke="#4fa8e8" strokeWidth={4} strokeLinejoin="round" />
    <path d="M492 402 C500 388 548 380 600 380" stroke="#fff" strokeWidth={4} opacity={0.45} fill="none" strokeLinecap="round" />
    {[[566, 412], [650, 424], [700, 398]].map(([x, y], i) => <path key={i} className="sc-wave" d={`M${x} ${y} q10 -6 20 0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.8} />)}
    <Tap say="Slurp, slurp! Cool water." sfx="plop">
      <WoolSheep x={518} y={370} s={0.72} head="down" />
      <WoolSheep x={704} y={372} s={0.68} facing="left" head="down" />
      {[[556, 372], [670, 374]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx={13} ry={3.5} fill="none" stroke="#fff" strokeWidth={2} opacity={0.75} />)}
    </Tap>
    {[[468, 432], [736, 424]].map(([x, y]) => <path key={x} d={`M${x} ${y} l-4 -26 M${x + 6} ${y} l2 -30 M${x + 12} ${y} l6 -22`} stroke="#3f9a4a" strokeWidth={3} strokeLinecap="round" />)}
    <Tap say="Here you go, sheep! Green grass and cool water." sfx="good">
      <Person x={384} y={422} s={1.45} look={PEOPLE.david} pose="hold" blinkDelay={0.8}>
        <Tap say="Baa! Thank you, David!">
          <WoolSheep x={-6} y={-42} s={0.68} sleepy />
          {/* his hands under the lamb, holding it */}
          {[-11, 9].map((hx) => <circle key={hx} cx={hx} cy={-52} r={7} fill={PEOPLE.david.skin} stroke={ink(PEOPLE.david.skin)} strokeWidth={2} />)}
        </Tap>
      </Person>
    </Tap>
  </Scene>
)

// 3. "Out in the fields, David sang songs to God. God helped David keep his sheep safe, even from a lion and a bear!"
// God's light is round David and his sheep; the lion and the bear run off over the hill.
const LionAndBear = () => (
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

// 4. "God sent a man named Samuel to David's family. David's big brothers were tall and strong. But God looks at the heart. God picked David to be king one day!"
// (1 Samuel 16) At David's home: his big brothers, tall and strong, and Samuel pointing to David, the
// youngest, with God's light on him and a heart over him.
const GodPicksDavid = () => (
  <Scene sky="day" ground="hills">
    <Rays x={482} y={-30} r={560} n={18} opacity={0.34} />
    <House x={84} y={338} w={120} />
    <Glow x={482} y={300} r={150} />
    <Tap say="Wow! God picked our little brother!" sfx="wobble">
      <Person x={148} y={420} s={1.22} look={HOME1} blinkDelay={1.6} />
      <Person x={340} y={420} s={1.2} look={BROTHER3} blinkDelay={0.4} />
      <Person x={244} y={424} s={1.16} look={HOME2} blinkDelay={2.2}><Surprised patch={HOME2.skin} /></Person>
    </Tap>
    <Tap say="Me? God picked me?" sfx="sparkle">
      <Person x={482} y={424} s={1.45} look={PEOPLE.david} holding="staff" />
    </Tap>
    <Tap say="God picked you, David!" sfx="good">
      <Person x={642} y={420} s={1.35} look={SAMUEL} pose="point" facing="left" blinkDelay={1.1} />
    </Tap>
    <Sheep x={748} y={416} s={0.72} facing="left" />
    <Tap say="God looks at the heart. One day, David will be king!" sfx="sparkle">
      <Emoji e="💛" x={482} y={234} size={40} bob />
      {/* high up in God's light, the crown David will wear one day */}
      <g className="sc-float" style={{ animationDelay: '-1.5s' } as CSSProperties}>
        <g transform="translate(482 172) scale(1.5)" opacity={0.9}>
          <path d="M-16 6 L-16 -8 L-8 0 L0 -12 L8 0 L16 -8 L16 6 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />
          <circle cx={0} cy={1} r={2.2} fill="#ff6b8a" />
        </g>
      </g>
    </Tap>
    <Sparkles spots={[[430, 212, 8], [534, 204, 7], [446, 160, 6], [520, 156, 6], [410, 290, 6], [556, 280, 7]]} />
  </Scene>
)

// 5. "At night, under the twinkly stars, David played his harp. He made up songs for God. One song says, God is my shepherd. He takes care of me!"
// David sits on a rock playing his harp while his sheep sleep around him; his songs float up to the stars.
const HarpAtNight = () => (
  <Scene sky="night" ground="none" clouds={false}>
    <Tap say="God made the moon and the stars!" sfx="sparkle"><Moon x={662} y={88} /></Tap>
    <NightHills />
    <Glow x={318} y={336} r={175} color="#fff0b8" />
    <WoolSheep x={700} y={384} s={0.56} facing="left" head="rest" />
    <WoolSheep x={590} y={402} s={0.72} facing="left" head="rest" />
    <Zzz x={582} y={344} s={0.8} />
    <Rock x={318} y={428} s={1.1} night />
    <Tap say="God is my shepherd. He takes care of me!" sfx="ding">
      <SittingOnRock x={318} y={430} s={1.45} look={PEOPLE.david} pose="hold" front={<Lyre />} />
    </Tap>
    <WoolSheep x={118} y={434} s={0.95} head="rest" />
    <WoolSheep x={208} y={440} s={0.6} head="rest" />
    <Tap say="Baa. I'm so sleepy. Goodnight, David!"><WoolSheep x={480} y={436} s={0.9} facing="left" head="rest" /></Tap>
    <Zzz x={448} y={378} s={0.7} />
    <Tap say="La, la, la! You can find David's songs in the Bible." sfx="sparkle">
      <g className="sc-float"><MusicNote x={392} y={300} color="#ffe680" /></g>
      <g className="sc-float" style={{ animationDelay: '-1s' } as CSSProperties}><MusicNote x={436} y={242} s={1.15} color="#ffd6ee" double /></g>
      <g className="sc-float" style={{ animationDelay: '-2s' } as CSSProperties}><MusicNote x={402} y={180} s={0.9} color="#c9e8ff" /></g>
    </Tap>
    <Sparkles spots={[[250, 260, 7], [390, 240, 6], [230, 330, 5]]} color="#fff3c0" />
  </Scene>
)

// Part 2: the giant.

// 6. "Remember David, the shepherd boy who loved God? David's big brothers were soldiers in King Saul's army, far away."
// David and his sheep on the hill at home; far off, at the army camp, his brothers in their helmets with King Saul.
const BigBrothers = () => (
  <Scene sky="day" ground="hills" sun>
    {/* the way to the army camp */}
    <path d="M196 450 C268 418 410 388 606 344 L618 346 C456 396 352 426 300 450 Z" fill="#ead6a4" />
    <Tent x={566} y={326} w={56} />
    <Tent x={648} y={314} w={72} />
    <Tent x={736} y={306} w={64} />
    <Tap say="We are soldiers in King Saul's army!" sfx="pop">
      <Person x={606} y={344} s={0.44} look={BROTHER} blinkDelay={0.9} />
      <Person x={768} y={336} s={0.43} look={BROTHER2} blinkDelay={1.7} />
    </Tap>
    <Tap say="I am King Saul!" sfx="good"><Person x={688} y={340} s={0.47} look={PEOPLE.saul} blinkDelay={0.3} /></Tap>
    <Sheep x={70} y={416} s={0.9} />
    <Sheep x={312} y={432} s={0.74} facing="left" />
    <Tap say="My big brothers are far away, at the army camp.">
      <Person x={180} y={422} s={1.45} look={PEOPLE.david} pose="point" />
    </Tap>
    <Tap say="God loves you!" sfx="sparkle"><Emoji e="💛" x={180} y={234} size={38} bob /></Tap>
    <Sparkles spots={[[130, 214, 7], [232, 206, 8], [180, 186, 6]]} />
  </Scene>
)

// 7. "One day, David took some bread to his big brothers. A giant named Goliath was there. He was big and loud, and all the soldiers were afraid of him."
const TheGiant = () => (
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

// 8. "But David was not afraid. He told King Saul, "God helped me before, and God will help me now!" David trusted God."
// David thinks of the lion and the bear running away from his sheep.
const NotAfraid = () => (
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

// 9. "David went to a stream and picked five smooth stones. He put them in his shepherd's bag."
// Four are in his bag and he holds up the fifth, still dripping: five to count.
// The stream winds down from a dip between the far hills (its far end tucked under a little knoll) and
// widens toward us.
const STREAM = 'M595 285 C590 296 580 304 579 318 C578 332 590 340 588 356 C586 374 566 386 558 404 C550 422 542 436 538 450 L792 450 C744 428 700 410 682 390 C664 370 648 358 638 342 C628 326 616 318 612 304 C609 294 608 290 606 285 Z'
const FiveStones = () => (
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

// 10. "David swung his sling, round and round. Whoosh! The little stone flew, and the great big giant fell down. Boom!"
// The sling is empty now; the stone bonks Goliath's forehead and he tips over, dizzy.
const Whoosh = () => (
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

// 11. "Everybody cheered! God helped David, just like David knew He would. God is bigger than any giant, and He is always with you, too!"
const Hooray = () => (
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

export const DAVID_ART: ComponentType[] = [
  // part 1
  Shepherd, GreenGrass, LionAndBear, GodPicksDavid, HarpAtNight,
  // part 2
  BigBrothers, TheGiant, NotAfraid, FiveStones, Whoosh, Hooray,
]
