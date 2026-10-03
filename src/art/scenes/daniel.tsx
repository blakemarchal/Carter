// Daniel and the Lions: one picture per story page, both parts in order (see data/daniel.ts for the words),
// and the people and places the island's mini-game is drawn with (art/games/daniel.tsx).
// God is never drawn as a person: His care is light. The lions are big, soft cats, never scary: no teeth,
// no claws, and their mouths stay shut.
//
// Made here to share (they can move into people.tsx and kit.tsx later):
//   People: DANIEL, DARIUS and OFFICIALS (the three jealous men), drawn with Daniel (his blue and gold robe),
//     KingDarius (his cape and tall crown) and Official (each one's fancy hat); Kneel (anyone kneeling, seen
//     from the front); Brows and BeardFrown (a grumpy or a sad face on any Person); ShutEyes.
//   Animals: GentleLion (standing, walking, sitting, lying down or asleep) and Zs (over a sleeper).
//   Places: LionsDen (outside, with its round stone door), DenInside, ThroneRoom, KingsBedroom, PalaceFront
//     and DanielsRoom (with the open window).
import { useId, type CSSProperties, type ComponentType, type ReactNode } from 'react'
import { CuteFace, darken, ink, lighten, Shine, useShade } from '../kit'
import { fluff } from '../items/draw'
import { Person, PEOPLE, SKIN, type Holding, type Look, type Pose } from '../people'
import { Emoji, Glow, Moon, Scene, Sparkles, Sun, Tap, sparkle } from './kit'
import { usePlayer } from './player'

const uid = (prefix: string, id: string) => `${prefix}${id.replace(/[^a-zA-Z0-9]/g, '')}`

const GOLD = '#f2c14e'
const FUR = '#f6c35f'
/** Each lion's mane has its own color, so they are six different lions. */
export const MANES = ['#d9802c', '#b8652a', '#e39a35', '#c96f2c', '#a85a2a', '#dd8a3a']

// ---------- People ----------

/** Daniel: a grown man with a kind face, short dark hair and beard, and a blue robe with a gold sash and hem. */
export const DANIEL: Look = { skin: SKIN.tan, hair: 'short', hairColor: '#2e2018', beard: 'short', beardColor: '#2e2018', robe: '#3f67c6', sash: GOLD }
/** King Darius: grey hair and a long grey beard, rich red robes (KingDarius adds his purple cape and tall crown). */
export const DARIUS: Look = { skin: SKIN.medium, hair: 'short', hairColor: '#9a9188', beard: 'long', beardColor: '#b3aba1', robe: '#b8323b', sash: '#ffd34d' }
/** The three jealous men, in fine robes (Official adds each one's fancy hat: a red cone, a purple turban, a tall blue hat). */
export const OFFICIALS: Look[] = [
  { skin: SKIN.tan, hair: 'short', hairColor: '#2b1d14', beard: 'short', beardColor: '#2b1d14', robe: '#4f9a6a', sash: '#e0b45a' },
  { skin: SKIN.medium, hair: 'short', hairColor: '#7a4022', beard: 'short', beardColor: '#9a5228', robe: '#e08a3c', sash: '#7d4fb3' },
  { skin: SKIN.deep, hair: 'short', hairColor: '#3b2a20', beard: 'long', beardColor: '#4a3428', robe: '#8a4f7d', sash: '#5fb7ff' },
]

/** In a Person's own units (give as its children): eyebrows for a grumpy face (low in the middle) or a sad one (raised in the middle). */
export const Brows = ({ mood }: { mood: 'grumpy' | 'sad' }) => (
  <path d={mood === 'grumpy' ? 'M-14 -123.5 L-4.5 -119.8 M14 -123.5 L4.5 -119.8' : 'M-13.5 -119.6 L-4.5 -123.2 M13.5 -119.6 L4.5 -123.2'}
    stroke="#2b2140" strokeWidth={2.6} strokeLinecap="round" fill="none" />
)

/** In a Person's own units: a frown in place of a bearded Person's smile (the smile is covered with beard). */
export const BeardFrown = ({ color }: { color: string }) => (
  <g>
    <ellipse cx={0} cy={-98.3} rx={6} ry={2.6} fill={color} />
    <path d="M-3.6 -96.9 Q0 -99.7 3.6 -96.9" stroke="#d0707e" strokeWidth={2.2} fill="none" strokeLinecap="round" />
  </g>
)

/** Put inside a scene: every Person or Pal in a `dn-shut` group has their eyes gently closed (praying, or asleep). */
export const ShutEyes = () => <style>{'.dn-shut .pa-blink{animation:none!important;transform:scaleY(.14)!important;transform-box:fill-box;transform-origin:center}'}</style>

/** Daniel's robe is blue and gold: a gold band near its hem, in Person's own units. */
const DanielHem = () => <path d="M-33.2 -17.5 Q0 -8.8 33.2 -17.5" stroke={GOLD} strokeWidth={4.5} fill="none" />

type Who = { x: number; y: number; s?: number; pose?: Pose; holding?: Holding; facing?: 'left' | 'right'; blinkDelay?: number; children?: ReactNode }

/** Daniel standing, in his blue and gold robe. */
export function Daniel({ x, y, s = 1, pose = 'stand', holding, facing = 'right', blinkDelay = 0, children }: Who) {
  return (
    <Person x={x} y={y} s={s} look={DANIEL} pose={pose} holding={holding} facing={facing} blinkDelay={blinkDelay}>
      <DanielHem />
      {children}
    </Person>
  )
}

/**
 * Someone kneeling, seen from the front: the Person from the knees up, their robe pooled on the floor, and the
 * soles of their feet peeking out behind. (x, y) = their knees on the floor. `hem`: a band of color on the robe.
 */
export function Kneel({ x, y, s = 1, look, pose = 'pray', facing = 'right', blinkDelay = 0, hem, children }: {
  x: number; y: number; s?: number; look: Look; pose?: Pose; facing?: 'left' | 'right'; blinkDelay?: number; hem?: string; children?: ReactNode
}) {
  const clip = uid('kn', useId())
  const k = look.build === 'child' ? 0.74 : 1
  const drop = 26 * k // (the shins, folded back out of sight)
  const w = 33 * k // the robe's half-width at the knees
  const back = facing === 'left' ? 1 : -1 // (the feet peek out on the side behind them)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={clip}><rect x={-140} y={-320} width={280} height={316} /></clipPath></defs>
      {[0, 1].map((i) => {
        const fx = back * (w + 2 - i * 8 * k), fy = (-7 - i * 3) * k
        return (
          <g key={i} transform={`rotate(${back * 28} ${fx} ${fy})`}>
            <ellipse cx={fx} cy={fy} rx={8.5 * k} ry={5.2 * k} fill="#7a5233" stroke="#4a2f1c" strokeWidth={1.5} />
            <ellipse cx={fx + back * 1.2 * k} cy={fy - 0.6 * k} rx={5.4 * k} ry={3 * k} fill="#c9946a" />
          </g>
        )
      })}
      <g clipPath={`url(#${clip})`}>
        <Person x={0} y={drop} s={1} look={look} pose={pose} facing={facing} blinkDelay={blinkDelay}>{children}</Person>
      </g>
      <path d={`M${-w + 1} ${-10 * k} Q${-w - 6 * k} ${-2 * k} ${-w + 3} ${1.5 * k} Q0 ${6 * k} ${w - 3} ${1.5 * k} Q${w + 6 * k} ${-2 * k} ${w - 1} ${-10 * k} Q0 ${-5 * k} ${-w + 1} ${-10 * k} Z`}
        fill={look.robe} stroke={ink(look.robe)} strokeWidth={2.5} strokeLinejoin="round" />
      {hem && <path d={`M${-w + 3} ${-2 * k} Q0 ${3 * k} ${w - 3} ${-2 * k}`} stroke={hem} strokeWidth={4} fill="none" strokeLinecap="round" />}
    </g>
  )
}

/** Daniel kneeling to pray, in his blue and gold robe. */
export const DanielKneeling = ({ x, y, s = 1, blinkDelay = 0 }: { x: number; y: number; s?: number; blinkDelay?: number }) => (
  <Kneel x={x} y={y} s={s} look={DANIEL} hem={GOLD} blinkDelay={blinkDelay} />
)

const CAPE = '#6a3d9a'

/** King Darius's tall gold crown with jewels, in Person's own units. */
const TallCrown = () => (
  <g>
    <path d="M-18.5 -131 L-21 -159 L-11 -146 L0 -165 L11 -146 L21 -159 L18.5 -131 Z" fill="#ffd34d" stroke="#d99a00" strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-7 -146 L0 -158 L7 -146" stroke="#fff3a8" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />
    <rect x={-20} y={-139} width={40} height={9} rx={2.5} fill="#ffc21a" stroke="#d99a00" strokeWidth={2} />
    <circle cx={0} cy={-134.5} r={3} fill="#e0344a" stroke="#a8202f" strokeWidth={1} />
    <circle cx={-11.5} cy={-134.5} r={2.3} fill="#3f8be0" />
    <circle cx={11.5} cy={-134.5} r={2.3} fill="#3f8be0" />
    {[[-21, -159], [0, -165], [21, -159]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r={2.8} fill="#fff1a8" stroke="#d99a00" strokeWidth={1.4} />)}
  </g>
)

/** King Darius: red robes, a purple cape with a gold hem behind him, and his tall crown. `mood` 'sad' gives him sad brows and a frown. */
export function KingDarius({ x, y, s = 1, pose = 'stand', holding, facing = 'right', mood = 'happy', blinkDelay = 0, children }: Who & { mood?: 'happy' | 'sad' }) {
  const cape = useShade(CAPE, 0.25, 0.2)
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
        <defs>{cape.def}</defs>
        <path d="M-17 -84 C-34 -62 -45 -32 -48 -4 Q0 3 48 -4 C45 -32 34 -62 17 -84 Z" fill={cape.fill} stroke={ink(CAPE)} strokeWidth={3} strokeLinejoin="round" />
        <path d="M-46.5 -6 Q0 1 46.5 -6" stroke={GOLD} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      <Person x={x} y={y} s={s} look={DARIUS} pose={pose} holding={holding} facing={facing} blinkDelay={blinkDelay}>
        <TallCrown />
        {mood === 'sad' && <><Brows mood="sad" /><BeardFrown color={DARIUS.beardColor!} /></>}
        {children}
      </Person>
    </g>
  )
}

/** Each jealous man's fancy hat, in Person's own units. */
function OfficialHat({ n }: { n: number }) {
  if (n === 0) {
    // a tall red cone hat with a gold band and a tassel
    return (
      <g>
        <path d="M-19 -127 L-13 -171 Q0 -175 13 -171 L19 -127 Q0 -122 -19 -127 Z" fill="#c8443c" stroke="#8a2a24" strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M-9 -166 L-12 -134" stroke="#e0675e" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
        <path d="M-19.4 -128 Q0 -123 19.4 -128 L18.6 -135.5 Q0 -130.5 -18.6 -135.5 Z" fill={GOLD} stroke="#b8862a" strokeWidth={1.6} />
        <path d="M0 -173 Q14 -172 17 -156" stroke="#2b2140" strokeWidth={1.8} fill="none" />
        <path d="M14.5 -157 L19.5 -157 L21 -145 L13 -145 Z" fill="#2b2140" />
      </g>
    )
  }
  if (n === 1) {
    // a big purple turban with a jewel and a feather
    return (
      <g>
        <path d="M2 -144 C-6 -160 2 -178 13 -186 C16 -170 11 -156 6 -144 Z" fill="#fff3d6" stroke="#e0b45a" strokeWidth={2} strokeLinejoin="round" />
        <path d="M4 -146 C3 -160 7 -172 12 -180" stroke="#e0b45a" strokeWidth={1.4} fill="none" />
        <ellipse cx={0} cy={-137} rx={27} ry={15} fill="#7d4fb3" stroke="#553280" strokeWidth={2.4} />
        <path d="M-24 -131 Q-6 -146 22 -142 M-26 -138 Q-2 -154 24 -134" stroke="#9a72c8" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={-137} r={5.5} fill={GOLD} stroke="#b8862a" strokeWidth={1.6} />
        <circle cx={0} cy={-137} r={2.6} fill="#e0344a" />
      </g>
    )
  }
  // a tall flat-topped blue hat with gold stripes
  return (
    <g>
      <path d="M-17 -127 L-15 -175 Q0 -179 15 -175 L17 -127 Q0 -123 -17 -127 Z" fill="#3e6ea8" stroke="#284a75" strokeWidth={2.4} strokeLinejoin="round" />
      {[-8, 0, 8].map((dx) => <path key={dx} d={`M${dx} -127 L${dx * 0.9} -175`} stroke={GOLD} strokeWidth={2.4} />)}
      <ellipse cx={0} cy={-175.5} rx={15} ry={4} fill={GOLD} stroke="#b8862a" strokeWidth={1.6} />
      <path d="M-17.4 -128 Q0 -123.5 17.4 -128 L17 -134 Q0 -129.5 -17 -134 Z" fill={GOLD} stroke="#b8862a" strokeWidth={1.6} />
    </g>
  )
}

/**
 * One of the three jealous men (n = 0, 1 or 2), each in his own fancy hat: grumpy, never scary.
 * `mood` 'sly' keeps a sneaky little smile under his low brows; 'grumpy' frowns.
 */
export function Official({ n, x, y, s = 1, pose = 'stand', holding, facing = 'right', mood = 'sly', blinkDelay = 0 }: Who & { n: number; mood?: 'sly' | 'grumpy' }) {
  const look = OFFICIALS[n]
  return (
    <Person x={x} y={y} s={s} look={look} pose={pose} holding={holding} facing={facing} blinkDelay={blinkDelay}>
      <OfficialHat n={n} />
      <Brows mood="grumpy" />
      {mood === 'grumpy' && <BeardFrown color={look.beardColor!} />}
    </Person>
  )
}

/** The people of the land, cheering for God on page 11 (a man, a mother, a boy, a grandfather, a girl, a woman). */
const TOWNSFOLK: Look[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8dcc0', robe: '#7cae7a', sash: '#c0504d', beard: 'short', beardColor: '#3b2a20' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#e88aa8', robe: '#f0c27a', sash: '#ffffff' },
  { skin: SKIN.deep, hair: 'curly', hairColor: '#1f1510', robe: '#7cc0e8', sash: '#ffd34d', build: 'child' },
  { skin: SKIN.light, hair: 'bald', hairColor: '#cfc8bf', beard: 'short', beardColor: '#dcd6ce', robe: '#b08ad0', sash: '#e0b45a' },
  { skin: SKIN.tan, hair: 'long', hairColor: '#2b1d14', robe: '#e07a5a', sash: '#ffd34d', bow: '#ffd34d', build: 'child' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#6cae9a', robe: '#c98a5a', sash: '#f5f0e6' },
]

// ---------- The lions ----------

type LionPose = 'stand' | 'walk' | 'sit' | 'lie' | 'sleep'
/** The middle of a lion's face in each pose (facing right, its feet at y 0). */
const LION_HEAD: Record<LionPose, [number, number]> = { stand: [30, -64], walk: [30, -64], sit: [14, -90], lie: [40, -29], sleep: [40, -28] }

/** A lion's round face in its big soft mane, turned to us: closed mouth, and open eyes or (`asleep`) closed ones. */
function LionFace({ x, y, mane, asleep, blinkDelay = 0, tilt = 0 }: { x: number; y: number; mane: string; asleep?: boolean; blinkDelay?: number; tilt?: number }) {
  const fur = useShade(FUR, 0.4, 0.12)
  const mn = useShade(mane, 0.32, 0.16)
  const line = ink(FUR)
  return (
    <g transform={tilt ? `rotate(${tilt} ${x} ${y})` : undefined}>
      <defs>{fur.def}{mn.def}</defs>
      <path d={fluff(x, y - 1, 27, 26, 13)} fill={mn.fill} stroke={ink(mane)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={fluff(x, y + 1, 21, 20, 11)} fill={lighten(mane, 0.12)} opacity={0.75} />
      {[-12, 12].map((ex) => (
        <g key={ex}>
          <circle cx={x + ex} cy={y - 14} r={6.5} fill={fur.fill} stroke={line} strokeWidth={2.2} />
          <circle cx={x + ex} cy={y - 14} r={3} fill="#ff9fb8" />
        </g>
      ))}
      <ellipse cx={x} cy={y + 1} rx={17} ry={16} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={x} cy={y + 8} rx={9.5} ry={6.5} fill="#fff1d6" />
      <path d={`M${x - 3.6} ${y + 3.6} Q${x} ${y + 1.6} ${x + 3.6} ${y + 3.6} Q${x + 1.8} ${y + 7} ${x} ${y + 7.4} Q${x - 1.8} ${y + 7} ${x - 3.6} ${y + 3.6} Z`} fill="#7a3b2a" />
      <path d={`M${x} ${y + 7.4} L${x} ${y + 9.2} M${x} ${y + 9.2} Q${x - 2.6} ${y + 11.4} ${x - 4.3} ${y + 9.8} M${x} ${y + 9.2} Q${x + 2.6} ${y + 11.4} ${x + 4.3} ${y + 9.8}`}
        stroke="#7a3b2a" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {asleep ? (
        <g>
          <path d={`M${x - 9} ${y - 2.5} Q${x - 5.6} ${y + 1.2} ${x - 2.2} ${y - 2.5} M${x + 2.2} ${y - 2.5} Q${x + 5.6} ${y + 1.2} ${x + 9} ${y - 2.5}`} stroke="#2b2140" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx={x - 9.8} cy={y + 2.6} rx={2.8} ry={1.8} fill="#ff7fb0" opacity={0.55} />
          <ellipse cx={x + 9.8} cy={y + 2.6} rx={2.8} ry={1.8} fill="#ff7fb0" opacity={0.55} />
        </g>
      ) : (
        <CuteFace x={x} y={y - 2} s={0.42} gap={13} mouth={false} blinkDelay={blinkDelay} />
      )}
      <Shine x={x - 8} y={y - 7} rx={3.5} ry={2} />
    </g>
  )
}

/**
 * A big, soft, gentle lion, side-on and facing right (or `facing="left"`), with its face turned to us.
 * (x, y) = its feet on the ground. Poses: 'stand' and 'walk' (alert, eyes open), 'sit', 'lie' (resting, eyes
 * open) and 'sleep' (lying down, eyes closed, with little Zs). `mane` picks its mane color.
 */
export function GentleLion({ x, y, s = 1, facing = 'right', pose = 'stand', mane = MANES[0], blinkDelay = 0, zs = pose === 'sleep' }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; pose?: LionPose; mane?: string; blinkDelay?: number; zs?: boolean
}) {
  const fur = useShade(FUR, 0.4, 0.12)
  const mn = useShade(mane, 0.32, 0.16)
  const line = ink(FUR)
  const f = facing === 'left' ? -1 : 1
  const [hx, hy] = LION_HEAD[pose]
  const leg = (lx: number, top: number, len: number, far: boolean, rot = 0) => (
    <g key={`${lx}${far}`} transform={rot ? `rotate(${rot} ${lx + 7} ${top})` : undefined}>
      <rect x={lx} y={top} width={14} height={len} rx={7} fill={far ? darken(FUR, 0.14) : fur.fill} stroke={line} strokeWidth={2.4} />
      <ellipse cx={lx + 7} cy={top + len - 4} rx={9} ry={5} fill={far ? darken(FUR, 0.08) : lighten(FUR, 0.2)} stroke={line} strokeWidth={2} />
    </g>
  )
  const tuft = (tx: number, ty: number) => <path d={fluff(tx, ty, 5.5, 6.5, 5)} fill={mn.fill} stroke={ink(mane)} strokeWidth={1.8} />
  const tail = (d: string) => (
    <g>
      <path d={d} stroke={line} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={d} stroke={FUR} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  )
  let body: ReactNode
  if (pose === 'stand' || pose === 'walk') {
    const walk = pose === 'walk'
    body = (
      <>
        <ellipse cx={-4} cy={-1} rx={52} ry={5} fill="#000" opacity={0.13} />
        <g className="pa-tail" style={{ '--o': '100% 100%' } as CSSProperties}>
          {tail('M-40 -48 C-55 -50 -62 -62 -59 -75')}
          {tuft(-59, -80)}
        </g>
        {leg(-31, -34, 34, true, walk ? -8 : 0)}
        {leg(15, -34, 34, true, walk ? 9 : 0)}
        {leg(-41, -32, 32, false, walk ? 12 : 0)}
        {leg(5, -32, 32, false, walk ? -15 : 0)}
        <ellipse cx={-6} cy={-44} rx={41} ry={22} fill={fur.fill} stroke={line} strokeWidth={2.6} />
        <Shine x={-26} y={-56} rx={9} ry={4} />
        <LionFace x={hx} y={hy} mane={mane} blinkDelay={blinkDelay} />
      </>
    )
  } else if (pose === 'sit') {
    body = (
      <>
        <ellipse cx={-4} cy={-1} rx={42} ry={5} fill="#000" opacity={0.13} />
        <g className="pa-tail" style={{ '--o': '100% 100%' } as CSSProperties}>
          {tail('M-34 -7 C-50 -6 -58 -12 -60 -26')}
          {tuft(-60, -31)}
        </g>
        <ellipse cx={-17} cy={-27} rx={26} ry={25} fill={fur.fill} stroke={line} strokeWidth={2.6} />
        {leg(-2, -44, 44, true)}
        {leg(13, -42, 42, false)}
        <ellipse cx={6} cy={-56} rx={23} ry={25} fill={fur.fill} stroke={line} strokeWidth={2.6} />
        <ellipse cx={-8} cy={-5} rx={14} ry={6} fill={lighten(FUR, 0.2)} stroke={line} strokeWidth={2} />
        <Shine x={-28} y={-38} rx={7} ry={3.5} />
        <LionFace x={hx} y={hy} mane={mane} blinkDelay={blinkDelay} />
      </>
    )
  } else {
    const asleep = pose === 'sleep'
    body = (
      <>
        <ellipse cx={-2} cy={-1} rx={62} ry={5} fill="#000" opacity={0.13} />
        {tail('M-44 -9 C-58 -6 -68 -4 -72 -11')}
        {tuft(-74, -15)}
        <ellipse cx={-8} cy={-19} rx={43} ry={18} fill={fur.fill} stroke={line} strokeWidth={2.6} />
        <ellipse cx={-28} cy={-23} rx={20} ry={17} fill={fur.fill} stroke={line} strokeWidth={2.4} />
        <ellipse cx={-10} cy={-4.5} rx={13} ry={5} fill={lighten(FUR, 0.2)} stroke={line} strokeWidth={2} />
        <Shine x={-32} y={-31} rx={7} ry={3} />
        <rect x={14} y={-15} width={48} height={11} rx={5.5} fill={darken(FUR, 0.1)} stroke={line} strokeWidth={2.2} />
        <LionFace x={hx} y={hy} mane={mane} asleep={asleep} blinkDelay={blinkDelay} tilt={asleep ? 8 : 0} />
        <rect x={10} y={-11} width={56} height={11} rx={5.5} fill={lighten(FUR, 0.14)} stroke={line} strokeWidth={2.2} />
        <path d="M60 -8 L60 -3 M55 -8 L55 -3" stroke={line} strokeWidth={1.4} strokeLinecap="round" />
      </>
    )
  }
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${f * s} ${s})`}>
        <defs>{fur.def}{mn.def}</defs>
        {body}
      </g>
      {zs && <Zs x={x + f * (hx + 4) * s} y={y + (hy - 34) * s} s={s} dir={f} />}
    </g>
  )
}

/** Three little Zs drifting up from a sleeper; (x, y) is the first, smallest one. They lean the way `dir` says (1 right, -1 left). */
export function Zs({ x, y, s = 1, dir = 1, color = '#fffbe6', line = '#5b4f8a' }: { x: number; y: number; s?: number; dir?: number; color?: string; line?: string }) {
  const z = (cx: number, cy: number, r: number) => `M${cx - r} ${cy - r} L${cx + r} ${cy - r} L${cx - r} ${cy + r} L${cx + r} ${cy + r}`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[[0, 0, 4.5, 0], [dir * 12, -14, 6, 0.7], [dir * 26, -32, 7.5, 1.4]].map(([cx, cy, r, d], i) => (
        <g key={i} className="sc-float" style={{ animationDelay: `${d}s`, animationDuration: '3.6s' }}>
          <path d={z(cx, cy, r)} stroke={line} strokeWidth={5.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={z(cx, cy, r)} stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  )
}

// ---------- The lions' den ----------

const ROCK = '#b9ad9c'
const INSIDE = '#2f2838'

/** Rows of rough stones (centre x, centre y, width, height, shade 0 to 3) filling a box, like a wall of big rounded blocks. */
function stoneRows(x0: number, y0: number, x1: number, y1: number, rowH: number, w: number) {
  const out: [number, number, number, number, number][] = []
  for (let row = 0, y = y0; y < y1; row++, y += rowH) {
    let x = x0 - (row % 2 ? w / 2 : 0)
    for (let i = 0; x < x1; i++) {
      const ww = w * (0.78 + (((row * 7 + i * 13) % 9) / 9) * 0.44)
      out.push([x + ww / 2, y + rowH / 2, ww - 5, rowH - 5, (row * 3 + i * 5) % 4])
      x += ww
    }
  }
  return out
}

const DEN_MOUND = 'M-236 0 C-232 -86 -196 -162 -118 -196 C-62 -220 62 -220 118 -196 C196 -162 232 -86 236 0 Z'
const DEN_DOOR = 'M-52 0 L-52 -72 A52 52 0 0 1 52 -72 L52 0 Z'
const DEN_DOOR_FRAME = 'M-70 0 L-70 -72 A70 70 0 0 1 70 -72 L70 0 Z'
/** Where the round stone sits: over the doorway, part way across it, or rolled away. */
const STONE_AT = { shut: 0, rolling: 132, open: 166 } as const

/**
 * The lions' den from outside: a big mound of stones with an arched doorway at the bottom, a round stone that
 * rolls in a groove to close it, and an opening in the top. (x, y) = the middle of the doorway's threshold.
 * `stone`: 'shut', 'rolling' (part way across, from the right) or 'open' (rolled away to the right).
 * `inside`: drawn in the dark doorway (in the den's own units). `ground`: the color of the ground in front.
 */
export function LionsDen({ x, y, s = 1, stone = 'shut', inside, ground = '#e8bf7a' }: {
  x: number; y: number; s?: number; stone?: keyof typeof STONE_AT; inside?: ReactNode; ground?: string
}) {
  const id = uid('den', useId())
  const boulder = useShade('#a39a8e', 0.35, 0.22)
  const sx = STONE_AT[stone]
  const shades = [ROCK, lighten(ROCK, 0.1), darken(ROCK, 0.06), lighten(ROCK, 0.18)]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        {boulder.def}
        <clipPath id={`${id}m`}><path d={DEN_MOUND} /></clipPath>
        <clipPath id={`${id}d`}><path d={DEN_DOOR} /></clipPath>
      </defs>
      <path d={DEN_MOUND} fill={darken(ROCK, 0.12)} />
      <g clipPath={`url(#${id}m)`}>
        {stoneRows(-250, -232, 250, 0, 33, 62).map(([cx, cy, w, h, k], i) => (
          <rect key={i} x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={13} fill={shades[k]} stroke="#8a7f70" strokeWidth={2.5} />
        ))}
      </g>
      <path d={DEN_MOUND} fill="none" stroke="#7d7264" strokeWidth={4} strokeLinejoin="round" />
      {/* the opening in the top, with a ring of stones round it */}
      <ellipse cx={0} cy={-207} rx={66} ry={16} fill="#d6ccbc" stroke="#7d7264" strokeWidth={3} />
      <ellipse cx={0} cy={-206} rx={52} ry={10} fill={INSIDE} />
      {/* the doorway in its frame of big stones */}
      <path d={DEN_DOOR_FRAME} fill="#d9cfbf" stroke="#7d7264" strokeWidth={3} />
      {[-150, -120, -90, -60, -30].map((a) => {
        const r = (a * Math.PI) / 180
        return <path key={a} d={`M${Math.cos(r) * 52} ${-72 + Math.sin(r) * 52} L${Math.cos(r) * 70} ${-72 + Math.sin(r) * 70}`} stroke="#9a8f80" strokeWidth={2.5} />
      })}
      <path d="M-52 -36 L-70 -36 M52 -36 L70 -36" stroke="#9a8f80" strokeWidth={2.5} />
      <path d={DEN_DOOR} fill={INSIDE} />
      {inside && <g clipPath={`url(#${id}d)`}>{inside}</g>}
      {/* the round stone, in its groove */}
      <g>
        <circle cx={sx} cy={-74} r={94} fill={boulder.fill} stroke="#6f665b" strokeWidth={4} />
        <path d={`M${sx - 46} ${-120} Q${sx - 20} ${-104} ${sx - 30} ${-78} M${sx + 30} ${-30} Q${sx + 46} ${-50} ${sx + 64} ${-46}`} stroke="#80776b" strokeWidth={3} fill="none" strokeLinecap="round" />
        <ellipse cx={sx - 36} cy={-128} rx={22} ry={11} fill="#fff" opacity={0.3} transform={`rotate(-30 ${sx - 36} -128)`} />
      </g>
      {/* (the ground in front hides the bottom of the stone, sunk in its groove) */}
      <rect x={-262} y={-1} width={524} height={26} fill={ground} />
      <ellipse cx={sx} cy={1} rx={80} ry={5} fill={darken(ground, 0.22)} opacity={0.5} />
      {stone === 'rolling' && (
        <g>
          {[[-50, 0], [-62, 22], [-56, -24]].map(([dx, dy], i) => (
            <path key={i} d={`M${sx + 104 + dx * 0.2} ${-90 + dy} q22 -6 44 0`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.75} />
          ))}
          {[[sx + 80, -4, 14], [sx + 104, -10, 10], [sx + 60, 2, 9]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#efe2c8" stroke="#c9b48a" strokeWidth={2} opacity={0.9} />
          ))}
        </g>
      )}
    </g>
  )
}

/** A rock shelf jutting out of the den's wall, for a lion to stand on: its top at (x, y), `w` wide. */
function Ledge({ x, y, w, wall }: { x: number; y: number; w: number; wall: string }) {
  return (
    <g>
      <path d={`M${x - w / 2} ${y} Q${x} ${y - 6} ${x + w / 2} ${y} L${x + w / 2 - 12} ${y + 20} Q${x} ${y + 34} ${x - w / 2 + 12} ${y + 20} Z`}
        fill={lighten(wall, 0.12)} stroke={darken(wall, 0.3)} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${x - w / 2 + 6} ${y + 1} Q${x} ${y - 4} ${x + w / 2 - 6} ${y + 1}`} stroke={lighten(wall, 0.35)} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  )
}

const DEN_COLORS = {
  night: { wall: '#655b7a', line: '#3f3752', roof: '#463e5a', floor: '#8f7e70', light: '#eef0ff', sky: ['#18163f', '#3b3486'] },
  dawn: { wall: '#9c877c', line: '#6b5850', roof: '#7a665e', floor: '#c9a982', light: '#fff1b8', sky: ['#ffb3c7', '#ffe8b0'] },
}

/**
 * Inside the lions' den: rough stone walls, a sandy floor, the round stone in the doorway (`door`: its x, or
 * null), and the opening in the roof (above `hole`) with light falling through it: moonlight at 'night', the
 * first sunlight at 'dawn'. `ledges`: rock shelves on the walls, [x, y, width].
 */
export function DenInside({ time = 'night', hole = 400, door = 110, ledges = [] }: {
  time?: 'night' | 'dawn'; hole?: number; door?: number | null; ledges?: [number, number, number][]
}) {
  const id = uid('di', useId())
  const c = DEN_COLORS[time]
  const shades = [c.wall, lighten(c.wall, 0.07), darken(c.wall, 0.07), lighten(c.wall, 0.13)]
  const boulder = useShade(time === 'night' ? '#7d7488' : '#a39a8e', 0.3, 0.25)
  const hy = 30 // (the middle of the opening)
  return (
    <g>
      <defs>
        {boulder.def}
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.sky[0]} /><stop offset="1" stopColor={c.sky[1]} /></linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.light} stopOpacity={0.5} /><stop offset="1" stopColor={c.light} stopOpacity={0.06} /></linearGradient>
        <radialGradient id={`${id}v`} cx="50%" cy="58%" r="70%"><stop offset="0.55" stopColor="#140f26" stopOpacity={0} /><stop offset="1" stopColor="#140f26" stopOpacity={time === 'night' ? 0.4 : 0.15} /></radialGradient>
        <clipPath id={`${id}h`}><ellipse cx={hole} cy={hy} rx={74} ry={28} /></clipPath>
        <clipPath id={`${id}d`}><path d={`M${(door ?? 0) - 56} 336 L${(door ?? 0) - 56} 252 A56 56 0 0 1 ${(door ?? 0) + 56} 252 L${(door ?? 0) + 56} 336 Z`} /></clipPath>
      </defs>
      {/* the back wall */}
      <rect width={800} height={340} fill={c.wall} />
      {stoneRows(-30, 40, 830, 340, 44, 92).map(([cx, cy, w, h, k], i) => (
        <rect key={i} x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={16} fill={shades[k]} stroke={c.line} strokeWidth={2.5} />
      ))}
      {/* the roof, and the opening in it */}
      <path d="M0 0 H800 V62 Q720 92 620 74 Q540 62 490 58 L310 58 Q260 62 180 76 Q80 94 0 64 Z" fill={c.roof} />
      <ellipse cx={hole} cy={hy} rx={86} ry={36} fill={darken(c.roof, 0.2)} />
      <g clipPath={`url(#${id}h)`}>
        <rect x={hole - 80} y={0} width={160} height={70} fill={`url(#${id}s)`} />
        {time === 'night' ? (
          <>
            <Moon x={hole + 40} y={30} s={0.5} />
            {[[hole - 40, 22], [hole - 10, 40], [hole - 54, 44]].map(([sx, sy], i) => <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.5}s` }} d={sparkle(sx, sy, 4)} fill="#fff8d0" />)}
          </>
        ) : (
          <circle cx={hole + 30} cy={58} r={22} fill="#ffe680" />
        )}
      </g>
      <ellipse cx={hole} cy={hy} rx={74} ry={28} fill="none" stroke={c.line} strokeWidth={5} />
      {/* the floor */}
      <path d="M0 336 Q200 326 400 330 T800 336 V450 H0 Z" fill={c.floor} />
      {[[60, 380, 9], [190, 420, 7], [300, 360, 6], [520, 372, 8], [620, 430, 7], [740, 384, 9], [120, 438, 6], [700, 352, 5]].map(([px, py, r], i) => (
        <ellipse key={i} cx={px} cy={py} rx={r} ry={r * 0.6} fill={darken(c.floor, 0.12)} />
      ))}
      {[[90, 400], [250, 444], [470, 420], [580, 360], [690, 410], [360, 380]].map(([sx, sy], i) => (
        <path key={i} d={`M${sx} ${sy} l-7 -9 M${sx} ${sy} l0 -11 M${sx} ${sy} l7 -9`} stroke={lighten(c.floor, 0.3)} strokeWidth={2.5} strokeLinecap="round" />
      ))}
      {/* the doorway, shut with the round stone */}
      {door !== null && (
        <g>
          <path d={`M${door - 72} 336 L${door - 72} 252 A72 72 0 0 1 ${door + 72} 252 L${door + 72} 336 Z`} fill={lighten(c.wall, 0.16)} stroke={c.line} strokeWidth={3} />
          <g clipPath={`url(#${id}d)`}>
            <rect x={door - 60} y={190} width={120} height={150} fill={darken(c.wall, 0.4)} />
            <circle cx={door} cy={262} r={94} fill={boulder.fill} />
            <path d={`M${door - 30} 230 Q${door - 10} 246 ${door - 20} 270`} stroke={darken('#a39a8e', 0.25)} strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>
          {time === 'dawn' && <path d={`M${door - 56} 334 L${door - 56} 252 A56 56 0 0 1 ${door + 56} 252`} stroke="#ffe7a0" strokeWidth={4} fill="none" opacity={0.85} />}
        </g>
      )}
      {ledges.map(([lx, ly, lw], i) => <Ledge key={i} x={lx} y={ly} w={lw} wall={c.wall} />)}
      {/* the light falling through the opening */}
      <path d={`M${hole - 64} ${hy + 10} L${hole + 64} ${hy + 10} L${hole + 156} 446 L${hole - 156} 446 Z`} fill={`url(#${id}b)`} />
      <ellipse cx={hole} cy={418} rx={170} ry={26} fill={c.light} opacity={0.2} />
      <rect width={800} height={450} fill={`url(#${id}v)`} />
    </g>
  )
}

// ---------- The palace ----------

/** A tall palace column: a cream shaft with fluting, a gold capital and a base. (x = its middle; it stands on y.) */
function Column({ x, y = 330, top = 0, w = 54 }: { x: number; y?: number; top?: number; w?: number }) {
  const shaft = useShade('#f7ead0', 0.2, 0.14)
  return (
    <g>
      <defs>{shaft.def}</defs>
      <rect x={x - w / 2} y={top + 40} width={w} height={y - top - 56} fill={shaft.fill} stroke="#c9b48a" strokeWidth={2.5} />
      {[-14, 0, 14].map((dx) => <path key={dx} d={`M${x + (dx * w) / 54} ${top + 46} L${x + (dx * w) / 54} ${y - 22}`} stroke="#e2d2b0" strokeWidth={3} />)}
      <path d={`M${x - w / 2 - 12} ${top + 40} Q${x - w / 2 - 22} ${top + 22} ${x - w / 2 - 6} ${top + 16} L${x + w / 2 + 6} ${top + 16} Q${x + w / 2 + 22} ${top + 22} ${x + w / 2 + 12} ${top + 40} Z`}
        fill="#f0c24a" stroke="#c99a1a" strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={x - w / 2 - 10} y={top} width={w + 20} height={17} rx={3} fill="#f6d36a" stroke="#c99a1a" strokeWidth={2.5} />
      <rect x={x - w / 2 - 8} y={y - 18} width={w + 16} height={18} rx={3} fill="#efe0c0" stroke="#c9b48a" strokeWidth={2.5} />
    </g>
  )
}

/** A little gold lion's head (the throne's armrests have them). */
const LionKnob = ({ x, y, r = 9 }: { x: number; y: number; r?: number }) => (
  <g>
    <path d={fluff(x, y, r, r, 9)} fill="#e0a020" stroke="#b07a10" strokeWidth={1.6} />
    <circle cx={x} cy={y + 0.5} r={r * 0.58} fill="#ffd34d" stroke="#b07a10" strokeWidth={1.2} />
    <circle cx={x - r * 0.22} cy={y - r * 0.06} r={r * 0.09} fill="#5a3a10" />
    <circle cx={x + r * 0.22} cy={y - r * 0.06} r={r * 0.09} fill="#5a3a10" />
    <circle cx={x} cy={y + r * 0.22} r={r * 0.1} fill="#7a4a10" />
  </g>
)

/** The king's golden throne with a red velvet back and lion's-head armrests. (x = its middle; it stands on y.) */
function Throne({ x, y }: { x: number; y: number }) {
  const gold = useShade('#f0c24a', 0.35, 0.18)
  return (
    <g>
      <defs>{gold.def}</defs>
      <path d={`M${x - 52} ${y} L${x - 52} ${y - 120} Q${x - 52} ${y - 166} ${x} ${y - 172} Q${x + 52} ${y - 166} ${x + 52} ${y - 120} L${x + 52} ${y} Z`} fill={gold.fill} stroke="#c99a1a" strokeWidth={3} />
      <path d={`M${x - 38} ${y - 50} L${x - 38} ${y - 118} Q${x - 38} ${y - 152} ${x} ${y - 157} Q${x + 38} ${y - 152} ${x + 38} ${y - 118} L${x + 38} ${y - 50} Z`} fill="#b8323b" stroke="#8a2028" strokeWidth={2.5} />
      <circle cx={x} cy={y - 172} r={11} fill="#ffd34d" stroke="#c99a1a" strokeWidth={2.5} />
      <circle cx={x} cy={y - 172} r={4.5} fill="#e0344a" />
      <rect x={x - 62} y={y - 58} width={124} height={22} rx={8} fill={gold.fill} stroke="#c99a1a" strokeWidth={3} />
      <rect x={x - 54} y={y - 68} width={108} height={16} rx={8} fill="#c9404a" stroke="#8a2028" strokeWidth={2.5} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={x + d * 62 - 9} y={y - 96} width={18} height={60} rx={7} fill={gold.fill} stroke="#c99a1a" strokeWidth={2.5} />
          <LionKnob x={x + d * 62} y={y - 98} r={11} />
          <rect x={x + d * 50 - 6} y={y - 36} width={12} height={36} rx={3} fill="#e0b030" stroke="#c99a1a" strokeWidth={2.5} />
        </g>
      ))}
    </g>
  )
}

/** A hanging banner: purple with a gold border, a gold sun, and a swallowtail end. (x = its middle, from y down, h tall.) */
function Banner({ x, y, h = 140, color = '#6a3d9a' }: { x: number; y: number; h?: number; color?: string }) {
  return (
    <g>
      <rect x={x - 36} y={y - 6} width={72} height={9} rx={4} fill="#c99a1a" />
      <path d={`M${x - 30} ${y} L${x + 30} ${y} L${x + 30} ${y + h} L${x} ${y + h - 22} L${x - 30} ${y + h} Z`} fill={color} stroke={GOLD} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={x} cy={y + h * 0.4} r={11} fill={GOLD} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${x} ${y + h * 0.4 - 15} L${x} ${y + h * 0.4 - 20}`} stroke={GOLD} strokeWidth={3} strokeLinecap="round" transform={`rotate(${i * 45} ${x} ${y + h * 0.4})`} />)}
    </g>
  )
}

/** What a window shows: the sky at that time (with a cloud, the sunset, or the moon and stars). Clip it to the window. */
function WindowSky({ x, y, w, h, time, id }: { x: number; y: number; w: number; h: number; time: 'day' | 'dusk' | 'night' | 'late'; id: string }) {
  const sky = { day: ['#8fd3ff', '#e2f6ff'], late: ['#9fd0f0', '#ffe9b8'], dusk: ['#ff9a7a', '#ffd9a0'], night: ['#18163f', '#3b3486'] }[time]
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      {time === 'day' && <ellipse cx={x + w * 0.38} cy={y + h * 0.3} rx={w * 0.2} ry={9} fill="#fff" opacity={0.9} />}
      {time === 'dusk' && <circle cx={x + w * 0.5} cy={y + h * 0.86} r={w * 0.24} fill="#ffcf5a" stroke="#f0a020" strokeWidth={2} />}
      {time === 'night' && (
        <>
          <Moon x={x + w * 0.62} y={y + h * 0.3} s={0.45} />
          {[[0.22, 0.2], [0.3, 0.52], [0.8, 0.66], [0.18, 0.8]].map(([fx, fy], i) => <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={sparkle(x + w * fx, y + h * fy, 4)} fill="#fff8d0" />)}
        </>
      )}
    </g>
  )
}

const arch = (x: number, y: number, w: number, h: number) => `M${x} ${y + h} L${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L${x + w} ${y + h} Z`

/**
 * King Darius's throne room: sandstone walls with a blue tiled frieze, tall columns, purple banners, a window
 * (its sky shows the time of day) and the throne on its steps at `throne`. At 'dusk' the room glows orange.
 */
function ThroneRoom({ time = 'day', throne = 400, win = 660 }: { time?: 'day' | 'dusk'; throne?: number; win?: number }) {
  const id = uid('tr', useId())
  const W = { x: win - 44, y: 96, w: 88, h: 150 }
  return (
    <g>
      <defs><clipPath id={`${id}w`}><path d={arch(W.x, W.y, W.w, W.h)} /></clipPath></defs>
      <rect width={800} height={330} fill="#f4ddb0" />
      <rect y={258} width={800} height={72} fill="#e6c48c" />
      <rect y={252} width={800} height={8} fill="#f8e8c4" stroke="#d2ad6e" strokeWidth={2} />
      <rect y={30} width={800} height={34} fill="#3f6fb6" />
      <path d="M0 30 H800 M0 64 H800" stroke={GOLD} strokeWidth={4} />
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i}>
          {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={32 + i * 64 + Math.cos((a * Math.PI) / 180) * 6} cy={47 + Math.sin((a * Math.PI) / 180) * 6} r={3.4} fill="#ffe08a" />)}
          <circle cx={32 + i * 64} cy={47} r={3} fill="#ffffff" />
        </g>
      ))}
      <g clipPath={`url(#${id}w)`}><WindowSky {...W} time={time} id={`${id}s`} /></g>
      <path d={arch(W.x, W.y, W.w, W.h)} fill="none" stroke="#e8cf9c" strokeWidth={9} />
      <rect x={W.x - 10} y={W.y + W.h - 2} width={W.w + 20} height={10} rx={3} fill="#f8e8c4" stroke="#d2ad6e" strokeWidth={2} />
      {/* the floor, with a red carpet up to the throne */}
      <rect y={330} width={800} height={120} fill="#e8c690" />
      {[352, 382, 418].map((fy, r) => (
        <g key={fy}>
          <path d={`M0 ${fy} H800`} stroke="#d4ad70" strokeWidth={2} />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 100 + (r % 2) * 50} ${fy - (r ? 30 : 22) + 2} V${fy}`} stroke="#d4ad70" strokeWidth={2} />)}
        </g>
      ))}
      <path d={`M${throne - 58} 318 L${throne + 58} 318 L${throne + 92} 450 L${throne - 92} 450 Z`} fill="#b8323b" />
      <path d={`M${throne - 50} 318 L${throne - 80} 450 M${throne + 50} 318 L${throne + 80} 450`} stroke={GOLD} strokeWidth={3.5} />
      <Banner x={throne - 170} y={64} h={150} />
      <Banner x={throne + 170} y={64} h={150} />
      <rect x={throne - 128} y={302} width={256} height={18} rx={4} fill="#efdcb2" stroke="#c9a46a" strokeWidth={2.5} />
      <rect x={throne - 108} y={288} width={216} height={16} rx={4} fill="#f6e6c2" stroke="#c9a46a" strokeWidth={2.5} />
      <Throne x={throne} y={290} />
      <Column x={44} />
      <Column x={756} />
      {time === 'dusk' && <rect width={800} height={450} fill="#ff8a3c" opacity={0.12} />}
    </g>
  )
}

/** The king's bedroom at night: deep blue walls, the window with the moon, his big bed (not slept in) and a table. */
function KingsBedroom() {
  const id = uid('kb', useId())
  const W = { x: 86, y: 86, w: 128, h: 176 }
  const blanket = useShade('#b8323b', 0.25, 0.2)
  return (
    <g>
      <defs><clipPath id={`${id}w`}><path d={arch(W.x, W.y, W.w, W.h)} /></clipPath></defs>
      <rect width={800} height={340} fill="#3c3f7a" />
      <rect y={28} width={800} height={26} fill="#2c2f63" />
      <path d="M0 28 H800 M0 54 H800" stroke="#c9a640" strokeWidth={3} />
      {Array.from({ length: 13 }, (_, i) => <circle key={i} cx={32 + i * 64} cy={41} r={4} fill="#c9a640" />)}
      <rect y={340} width={800} height={110} fill="#5a4a72" />
      {[372, 410].map((fy) => <path key={fy} d={`M0 ${fy} H800`} stroke="#4c3e64" strokeWidth={2} />)}
      <g clipPath={`url(#${id}w)`}><WindowSky {...W} time="night" id={`${id}s`} /></g>
      <path d={arch(W.x, W.y, W.w, W.h)} fill="none" stroke="#6a6ab0" strokeWidth={9} />
      <rect x={W.x - 10} y={W.y + W.h - 2} width={W.w + 20} height={10} rx={3} fill="#7a7ac0" />
      {/* moonlight on the floor */}
      <path d={`M${W.x + 6} ${W.y + W.h + 8} L${W.x + W.w - 6} ${W.y + W.h + 8} L${W.x + W.w + 150} 446 L${W.x + 110} 446 Z`} fill="#fff6c8" opacity={0.1} />
      {/* the big bed with its canopy, neat and empty */}
      <g>
        <rect x={548} y={96} width={14} height={300} rx={4} fill="#c99a3a" stroke="#8a6420" strokeWidth={2} />
        <rect x={764} y={96} width={14} height={300} rx={4} fill="#c99a3a" stroke="#8a6420" strokeWidth={2} />
        <path d="M540 92 L786 92 L786 120 Q663 140 540 120 Z" fill="#7d4fb3" stroke="#553280" strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M562 120 Q578 220 566 330 L586 330 Q596 220 584 128 Z" fill="#8f62c4" />
        <rect x={556} y={300} width={216} height={56} rx={8} fill="#f4eee2" stroke="#c9bfae" strokeWidth={2.5} />
        <rect x={556} y={296} width={190} height={50} rx={10} fill={blanket.fill} stroke="#8a2028" strokeWidth={2.5} />
        <defs>{blanket.def}</defs>
        <path d="M560 316 H742" stroke={GOLD} strokeWidth={3} />
        <ellipse cx={738} cy={290} rx={28} ry={14} fill="#ffffff" stroke="#c9bfae" strokeWidth={2.5} />
        <rect x={552} y={352} width={226} height={14} rx={4} fill="#b8862a" stroke="#8a6420" strokeWidth={2} />
      </g>
      {/* a little table with his supper, not eaten */}
      <g>
        <rect x={262} y={318} width={10} height={70} fill="#9a6a3a" />
        <rect x={348} y={318} width={10} height={70} fill="#9a6a3a" />
        <ellipse cx={310} cy={318} rx={70} ry={12} fill="#b8864a" stroke="#7a5228" strokeWidth={2.5} />
        <ellipse cx={300} cy={308} rx={40} ry={9} fill="#f4f0e8" stroke="#c9bfae" strokeWidth={2} />
        <Emoji e="🍞" x={286} y={292} size={42} />
        <Emoji e="🍇" x={318} y={290} size={36} />
        <Emoji e="🪔" x={360} y={296} size={44} />
      </g>
      <Glow x={368} y={278} r={70} color="#ffd98a" />
    </g>
  )
}

/** The front of the king's palace: a blue tiled gate with lions on it, towers with banners, and wide steps. */
function PalaceFront() {
  const wall = useShade('#efd6a2', 0.18, 0.12)
  const blue = '#3f6fb6'
  return (
    <g>
      <defs>{wall.def}</defs>
      {[120, 680].map((tx) => (
        <g key={tx}>
          <rect x={tx - 56} y={92} width={112} height={240} fill={wall.fill} stroke="#c9a46a" strokeWidth={3} />
          {[-44, -18, 8, 34].map((dx) => <rect key={dx} x={tx + dx} y={74} width={18} height={20} fill="#efd6a2" stroke="#c9a46a" strokeWidth={2.5} />)}
          <rect x={tx - 56} y={150} width={112} height={14} fill={blue} />
          <Banner x={tx} y={176} h={110} color="#b8323b" />
        </g>
      ))}
      <rect x={176} y={150} width={448} height={182} fill={wall.fill} stroke="#c9a46a" strokeWidth={3} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={180 + i * 32} y={134} width={20} height={18} fill="#efd6a2" stroke="#c9a46a" strokeWidth={2.5} />)}
      <rect x={176} y={168} width={448} height={16} fill={blue} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={192 + i * 32} cy={176} r={4} fill="#ffe08a" />)}
      {/* the great gate, tiled blue, with a golden lion on each side */}
      <path d={arch(330, 186, 140, 146)} fill={blue} stroke="#2a4f8a" strokeWidth={3} />
      <path d={arch(352, 214, 96, 118)} fill="#6a4a2a" stroke="#4a3018" strokeWidth={3} />
      <path d="M400 214 L400 332" stroke="#4a3018" strokeWidth={3} />
      {[264, 536].map((lx) => <g key={lx}><rect x={lx - 34} y={206} width={68} height={52} rx={6} fill={blue} stroke="#2a4f8a" strokeWidth={2.5} /><LionKnob x={lx} y={232} r={16} /></g>)}
      {/* the steps */}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={150 - i * 24} y={332 + i * 12} width={500 + i * 48} height={13} rx={3} fill={i % 2 ? '#efe0c0' : '#e6d3ac'} stroke="#c9b48a" strokeWidth={2} />)}
    </g>
  )
}

const ROOM_WIN = { x: 452, y: 64, w: 176, h: 236 }

/**
 * Daniel's room: warm plaster walls, a tiled floor, a woven hanging, a little table (LampAndScroll goes on it),
 * and the big open window (its blue shutters folded back) looking out over the hills. `time`: 'day' or 'late'.
 * `view`: drawn in the window, in front of the sky (people looking in). `pot`: flowers on the sill. The sunlight
 * falls across the floor.
 */
function DanielsRoom({ time = 'day', view, pot = true }: { time?: 'day' | 'late'; view?: ReactNode; pot?: boolean }) {
  const id = uid('dr', useId())
  const { x, y, w, h } = ROOM_WIN
  return (
    <g>
      <defs>
        <clipPath id={`${id}w`}><path d={arch(x, y, w, h)} /></clipPath>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3c4" stopOpacity={0.55} /><stop offset="1" stopColor="#fff3c4" stopOpacity={0.1} /></linearGradient>
      </defs>
      <rect width={800} height={360} fill="#f3e0bd" />
      {[[120, 90, 70], [300, 210, 90], [700, 120, 60], [210, 300, 50]].map(([bx, by, r], i) => <ellipse key={i} cx={bx} cy={by} rx={r} ry={r * 0.6} fill="#f8ead0" opacity={0.7} />)}
      <rect y={344} width={800} height={16} fill="#e2c894" stroke="#c9a46a" strokeWidth={2} />
      <rect y={360} width={800} height={90} fill="#d8b582" />
      {[384, 414].map((fy, r) => (
        <g key={fy}>
          <path d={`M0 ${fy} H800`} stroke="#c49d68" strokeWidth={2} />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 100 + (r % 2) * 50} ${fy - (r ? 30 : 24)} V${fy}`} stroke="#c49d68" strokeWidth={2} />)}
        </g>
      ))}
      {/* the view: hills far away, and the sky */}
      <g clipPath={`url(#${id}w)`}>
        <WindowSky x={x} y={y} w={w} h={h} time={time} id={`${id}s`} />
        <path d={`M${x} ${y + h - 70} Q${x + 50} ${y + h - 104} ${x + 100} ${y + h - 80} T${x + w} ${y + h - 92} L${x + w} ${y + h} L${x} ${y + h} Z`} fill="#c9dfa0" />
        <path d={`M${x} ${y + h - 40} Q${x + 70} ${y + h - 66} ${x + 130} ${y + h - 44} T${x + w + 40} ${y + h - 50} L${x + w} ${y + h} L${x} ${y + h} Z`} fill="#a8cf86" />
        {view}
      </g>
      <path d={arch(x, y, w, h)} fill="none" stroke="#e6cfa2" strokeWidth={12} />
      <path d={arch(x - 7, y - 7, w + 14, h + 7)} fill="none" stroke="#c9a46a" strokeWidth={2.5} />
      {/* the blue shutters, folded back against the wall */}
      {[-1, 1].map((side) => {
        const sx = side < 0 ? x - 64 : x + w + 12
        return (
          <g key={side}>
            <rect x={sx} y={y + 74} width={52} height={h - 80} rx={6} fill="#4f86c6" stroke="#2f5f98" strokeWidth={3} />
            {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${sx + 8} ${y + 96 + i * 22} H${sx + 44}`} stroke="#3a6fae" strokeWidth={3} strokeLinecap="round" />)}
            <circle cx={side < 0 ? sx + 46 : sx + 6} cy={y + 150} r={3} fill="#2f5f98" />
          </g>
        )
      })}
      <rect x={x - 16} y={y + h - 6} width={w + 32} height={14} rx={4} fill="#ead6ac" stroke="#c9a46a" strokeWidth={2.5} />
      {/* a pot of flowers on the sill */}
      <g display={pot ? undefined : 'none'}>
        <path d={`M${x + w - 44} ${y + h - 30} L${x + w - 16} ${y + h - 30} L${x + w - 20} ${y + h - 6} L${x + w - 40} ${y + h - 6} Z`} fill="#d9824a" stroke="#a85a2a" strokeWidth={2.5} strokeLinejoin="round" />
        {[[-38, -46, '#ff8cc0'], [-26, -54, '#ffd34d'], [-18, -42, '#ff8cc0']].map(([dx, dy, col], i) => (
          <g key={i}>
            <path d={`M${x + w - 30} ${y + h - 30} L${x + w + (dx as number) + 4} ${y + h + (dy as number) + 6}`} stroke="#4f9a4a" strokeWidth={2.5} />
            <circle cx={x + w + (dx as number) + 4} cy={y + h + (dy as number) + 4} r={6} fill={col as string} stroke={ink(col as string)} strokeWidth={1.5} />
          </g>
        ))}
      </g>
      {/* a woven hanging on the wall */}
      <g>
        <rect x={124} y={92} width={96} height={4} rx={2} fill="#9a6a3a" />
        <rect x={130} y={96} width={84} height={120} rx={4} fill="#e9d7b0" stroke="#b8925a" strokeWidth={2.5} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={130} y={106 + i * 22} width={84} height={9} fill={['#3f67c6', '#c0504d', GOLD, '#4f9a6a', '#3f67c6'][i]} opacity={0.85} />)}
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${136 + i * 12} 216 v12`} stroke="#b8925a" strokeWidth={3} strokeLinecap="round" />)}
      </g>
      {/* a little table with a lamp and a scroll */}
      <g>
        <rect x={112} y={318} width={10} height={76} fill="#9a6a3a" />
        <rect x={218} y={318} width={10} height={76} fill="#9a6a3a" />
        <rect x={98} y={308} width={144} height={14} rx={4} fill="#b8864a" stroke="#7a5228" strokeWidth={2.5} />
      </g>
      {/* sunlight falling in across the floor */}
      <path d={`M${x + 14} ${y + h + 6} L${x + w - 14} ${y + h + 6} L${x + w - 160} 448 L${x - 210} 448 Z`} fill={`url(#${id}b)`} />
    </g>
  )
}

/** The lamp and scroll on Daniel's table (drawn over the room so they can be tapped). */
const LampAndScroll = () => (
  <g>
    <Emoji e="📜" x={142} y={290} size={48} />
    <Emoji e="🪔" x={204} y={286} size={52} />
  </g>
)

/** A soft golden heart, floating (God's love). */
const Heart = ({ x, y, r = 12, d = 0 }: { x: number; y: number; r?: number; d?: number }) => (
  <g className="sc-float" style={{ animationDelay: `${d}s` }}>
    <path d={`M${x} ${y + r} C${x - r * 1.6} ${y} ${x - r * 1.3} ${y - r * 1.3} ${x - r * 0.55} ${y - r * 1.3} C${x - r * 0.25} ${y - r * 1.3} ${x} ${y - r * 1.05} ${x} ${y - r * 0.75} C${x} ${y - r * 1.05} ${x + r * 0.25} ${y - r * 1.3} ${x + r * 0.55} ${y - r * 1.3} C${x + r * 1.3} ${y - r * 1.3} ${x + r * 1.6} ${y} ${x} ${y + r} Z`}
      fill="#ffd34d" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />
  </g>
)

/** Little puffs of dust behind someone hurrying (to the right of x when `dir` is 1). */
const Dust = ({ x, y, dir = 1 }: { x: number; y: number; dir?: number }) => (
  <g opacity={0.85}>
    {[[0, 0, 11], [dir * 20, -6, 8], [dir * 36, -2, 6]].map(([dx, dy, r], i) => <circle key={i} cx={x + dx} cy={y + dy} r={r} fill="#f4ead6" stroke="#d2c09a" strokeWidth={2} />)}
    {[[dir * 30, -40], [dir * 38, -24], [dir * 30, -56]].map(([dx, dy], i) => <path key={i} d={`M${x + dx} ${y + dy} h${dir * 26}`} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.8} />)}
  </g>
)

// ---------- The pages ----------

// 1. "Long ago, there was a man named Daniel. God loved Daniel, and Daniel loved God with all his heart. Three times
// every day, he knelt by his open window and prayed to God." His room, with God's light shining on him by the window.
const Page1 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <ShutEyes />
    <DanielsRoom />
    <Glow x={370} y={330} r={130} color="#fff6c8" />
    <Tap say="My window is open wide." sfx="swish">
      <rect x={ROOM_WIN.x} y={ROOM_WIN.y} width={ROOM_WIN.w} height={ROOM_WIN.h} fill="transparent" />
      <Sparkles spots={[[ROOM_WIN.x + 50, ROOM_WIN.y + 70, 7], [ROOM_WIN.x + 130, ROOM_WIN.y + 110, 5]]} />
    </Tap>
    <Tap say="A little lamp, and God's words on a scroll." sfx="ding"><LampAndScroll /></Tap>
    <PrayerRug x={370} />
    <Tap say="I love to talk to God!" sfx="good">
      <g className="dn-shut"><DanielKneeling x={370} y={420} s={1.18} /></g>
    </Tap>
    <Heart x={370} y={238} r={12} />
    <Sparkles spots={[[310, 270, 6], [430, 262, 7]]} />
  </Scene>
)

/** Daniel's little red prayer rug with a gold border, on the floor at x (`w`: half its width). */
const PrayerRug = ({ x, w = 96 }: { x: number; w?: number }) => (
  <g>
    <ellipse cx={x} cy={424} rx={w} ry={17} fill="#c0504d" stroke="#8a2f2c" strokeWidth={2.5} />
    <ellipse cx={x} cy={424} rx={w - 16} ry={11} fill="none" stroke={GOLD} strokeWidth={3} />
  </g>
)

// 2. "King Darius liked Daniel very much. Daniel was wise and kind, and he always told the truth. So the king
// gave him a very important job." In the throne room, the king points to Daniel, who holds his work (a scroll).
const Page2 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <ThroneRoom />
    <Tap say="What a shiny gold throne!" sfx="ding"><rect x={340} y={110} width={120} height={180} fill="transparent" /></Tap>
    <Tap say="Daniel, you are my most helpful helper!" sfx="good">
      <KingDarius x={268} y={420} s={1.12} pose="point" />
    </Tap>
    <Tap say="Thank you, King Darius! I will do my best." sfx="pop">
      <Daniel x={540} y={420} s={1.08} pose="hold" holding="scroll" facing="left" blinkDelay={1.2} />
    </Tap>
    <Sparkles spots={[[600, 230, 6], [470, 250, 5], [660, 290, 5]]} />
  </Scene>
)

/** The new rule: a big scroll with writing and a red seal. (x, y) = its middle. */
const RuleScroll = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-26} y={-30} width={52} height={60} rx={3} fill="#fff6dc" stroke="#c9a46a" strokeWidth={2} />
    {[-18, -10, -2, 6].map((ly) => <path key={ly} d={`M-17 ${ly} H${ly === 6 ? 4 : 17}`} stroke="#a08868" strokeWidth={2} strokeLinecap="round" />)}
    <circle cx={12} cy={18} r={6} fill="#d0343a" stroke="#9a1f24" strokeWidth={1.5} />
    <rect x={-30} y={-36} width={60} height={9} rx={4.5} fill="#e6cf9c" stroke="#b8925a" strokeWidth={2} />
    <rect x={-30} y={27} width={60} height={9} rx={4.5} fill="#e6cf9c" stroke="#b8925a" strokeWidth={2} />
  </g>
)

// 3. "But some men were jealous of Daniel. They tricked the king. They said, 'Make a new rule! For thirty days,
// everyone must pray only to you, or go into the lions' den.' So the king signed the rule." The three jealous men around
// the king, who holds the new rule.
const Page3 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <ThroneRoom />
    <Tap say="Grumble, grumble. We want Daniel's job!" sfx="wobble">
      <Official n={1} x={96} y={428} s={1} mood="grumpy" />
      <Official n={0} x={222} y={424} s={1.02} pose="point" />
    </Tap>
    <Tap say="I will sign the new rule." sfx="pop">
      <KingDarius x={410} y={420} s={1.1} pose="hold">
        <RuleScroll x={0} y={-60} s={0.62} />
        {[-8, 8].map((hx) => <circle key={hx} cx={hx} cy={-58} r={7} fill={DARIUS.skin} stroke={ink(DARIUS.skin)} strokeWidth={2} />)}
      </KingDarius>
    </Tap>
    <Tap say="Hee hee! Our trick is working." sfx="wobble">
      <Official n={2} x={600} y={424} s={1.02} pose="point" facing="left" blinkDelay={1.6} />
    </Tap>
  </Scene>
)

// 4. "Daniel heard about the rule. But he still knelt by his open window and prayed to God, just like he always
// did. The jealous men saw him praying!" The same room; the three men peek in at the window from outside.
const Page4 = () => {
  const { x, y, w, h } = ROOM_WIN
  const feet = y + h + 58 // (their chins just over the sill: they're standing outside, looking in)
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <ShutEyes />
      <DanielsRoom time="late" pot={false} view={
        <Tap say="Look! Daniel is praying to God!" sfx="wobble">
          <Official n={0} x={x + 38} y={feet} s={0.84} />
          <Official n={2} x={x + w - 38} y={feet} s={0.84} blinkDelay={2.2} />
          <Official n={1} x={x + w / 2} y={feet + 6} s={0.84} blinkDelay={1.1} />
        </Tap>
      } />
      <Glow x={340} y={330} r={130} color="#fff6c8" />
      <LampAndScroll />
      <PrayerRug x={340} />
      <Tap say="Thank you, God, for taking care of me." sfx="good">
        <g className="dn-shut"><DanielKneeling x={340} y={420} s={1.18} /></g>
      </Tap>
      <Heart x={340} y={238} r={12} />
    </Scene>
  )
}

// 5. "They hurried to tell the king. The king was very sad, because he loved Daniel. He tried and tried to help
// him. But the king's rule could not be changed." Sunset in the window: he tried all day long.
const Page5 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <ThroneRoom time="dusk" />
    <Tap say="Oh no. I love Daniel. What can I do?" sfx="wobble">
      <KingDarius x={400} y={420} s={1.1} pose="hold" mood="sad" />
    </Tap>
    <Tap say="The rule can not be changed!" sfx="pop">
      <Official n={0} x={168} y={426} s={1.02} pose="point" />
      <Official n={2} x={70} y={430} s={0.98} blinkDelay={1.4} />
    </Tap>
    <Tap say="Daniel prayed to God. We saw him!" sfx="pop">
      <Official n={1} x={628} y={426} s={1.02} pose="point" facing="left" blinkDelay={0.7} />
    </Tap>
  </Scene>
)

// 6. "So Daniel was put into a den of lions, and a big stone was rolled over the door. The king said, 'Daniel,
// your God will keep you safe!'" Evening: the stone rolls across the doorway; inside, Daniel prays, and a lion
// looks out at him. The king watches, sad, with his hands together.
const Page6 = () => (
  <Scene sky="dusk" ground="desert" clouds={false}>
    <ShutEyes />
    <Moon x={700} y={80} s={0.7} />
    {/* the first stars coming out */}
    {[[90, 60, 5], [250, 40, 4], [470, 70, 5], [580, 30, 4], [380, 120, 3.5]].map(([sx, sy, r], i) => (
      <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.45}s` }} d={sparkle(sx, sy, r)} fill="#fff8d0" />
    ))}
    <Tap say="Roll, roll, roll! A great big stone." sfx="wobble">
      <LionsDen x={290} y={394} s={1.24} stone="rolling" ground="#e8bf7a" inside={
        <g>
          <Tap say="Purr? Hello, Daniel." sfx="pop"><GentleLion x={-30} y={-2} s={0.56} pose="sit" mane={MANES[1]} blinkDelay={0.8} /></Tap>
          <Tap say="I trust You, God." sfx="good"><g className="dn-shut"><Daniel x={14} y={-2} s={0.62} pose="pray" /></g></Tap>
        </g>
      } />
    </Tap>
    <Tap say="Daniel, your God will keep you safe!" sfx="good">
      <KingDarius x={694} y={424} s={1.0} pose="pray" mood="sad" facing="left" />
    </Tap>
  </Scene>
)

// 7. "That night, Daniel was in the lions' den. Back at the palace, the king could not sleep. He did not want to eat.
// He was so worried about Daniel." His bed not slept in, his supper not eaten, the moon in the window.
const Page7 = () => (
  <Scene sky="night" ground="none" clouds={false}>
    <KingsBedroom />
    <Tap say="Oh, Daniel. I hope you are safe." sfx="wobble">
      <KingDarius x={460} y={424} s={1.12} pose="hold" mood="sad" />
    </Tap>
    <Tap say="No supper tonight. The king is too worried." sfx="pop"><rect x={250} y={260} width={130} height={70} fill="transparent" /></Tap>
    <Tap say="The moon is up all night long." sfx="sparkle"><rect x={86} y={86} width={128} height={176} fill="transparent" /></Tap>
  </Scene>
)

/** Little curved lines from someone's mouth, calling out (to the left when `dir` is -1). */
const Calling = ({ x, y, dir = -1 }: { x: number; y: number; dir?: number }) => (
  <g className="pa-twinkle" fill="none" strokeLinecap="round">
    {[8, 16, 24].map((r) => (
      <g key={r}>
        <path d={`M${x + dir * r * 0.5} ${y - r * 0.8} Q${x + dir * r * 1.1} ${y} ${x + dir * r * 0.5} ${y + r * 0.8}`} stroke="#8a5a3a" strokeWidth={5.5} opacity={0.35} />
        <path d={`M${x + dir * r * 0.5} ${y - r * 0.8} Q${x + dir * r * 1.1} ${y} ${x + dir * r * 0.5} ${y + r * 0.8}`} stroke="#ffffff" strokeWidth={3} />
      </g>
    ))}
  </g>
)

// 8. "Early in the morning, the king hurried to the den. He called out, 'Daniel! Did your God keep you safe from
// the lions?'" Sunrise; the stone is still over the doorway; the king runs up to it, calling.
const Page8 = () => (
  <Scene sky="dawn" ground="desert">
    <Sun x={700} y={300} s={0.9} />
    <path d="M0 320 Q160 280 320 315 Q520 270 800 310 L800 450 L0 450 Z" fill="#f2d39a" />
    <path d="M0 380 Q240 340 480 378 T800 370 L800 450 L0 450 Z" fill="#e8bf7a" />
    <Tap say="Is Daniel safe in there?" sfx="wobble"><LionsDen x={280} y={398} s={1.08} ground="#e8bf7a" /></Tap>
    <Tap say="Daniel! Daniel! Are you there?" sfx="pop">
      <KingDarius x={590} y={428} s={1.0} pose="point" facing="left" mood="sad" />
    </Tap>
    <Calling x={556} y={300} />
    <Dust x={652} y={424} />
    <Tap say="Good morning, sun!" sfx="sparkle"><circle cx={700} cy={286} r={46} fill="transparent" /></Tap>
  </Scene>
)

// 9. "Daniel called back, 'Yes, King Darius! My God sent His angel and shut the lions' mouths. They did not hurt
// me at all!'" Inside the den in the morning light: Daniel, the shining angel, and the lions all calm.
const Page9 = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <DenInside time="dawn" hole={420} door={96} />
    <Glow x={520} y={300} r={150} color="#fff3c0" />
    <Tap say="God sent me to keep Daniel safe." sfx="sparkle">
      <Person x={540} y={404} s={0.92} look={PEOPLE.angel} pose="wave" facing="left" blinkDelay={0.8} />
    </Tap>
    <Tap say="Shh! This lion is still sleeping." sfx="pop"><GentleLion x={130} y={436} s={1.0} pose="sleep" mane={MANES[2]} /></Tap>
    <Tap say="Purr, purr! Good morning, Daniel." sfx="pop">
      <GentleLion x={252} y={350} s={0.82} pose="sit" mane={MANES[0]} blinkDelay={1.3} />
      <GentleLion x={690} y={440} s={1.0} pose="lie" facing="left" mane={MANES[4]} blinkDelay={0.4} />
    </Tap>
    <Tap say="God kept me safe!" sfx="good">
      <Daniel x={400} y={424} s={1.04} pose="arms-up" />
    </Tap>
    <Sparkles spots={[[470, 200, 7], [610, 230, 6], [560, 160, 5], [350, 250, 5]]} />
  </Scene>
)

// 10. "The king was so happy! He had the stone rolled away, and Daniel came out of the den. He did not have a single
// scratch, because he trusted God." Morning sun; the stone rolled aside; a sleepy lion lies in the doorway.
const Page10 = () => (
  <Scene sky="day" ground="desert" sun>
    <Tap say="The big stone is rolled away!" sfx="wobble">
      <LionsDen x={250} y={396} s={1.0} stone="open" ground="#e8bf7a" inside={
        <Tap say="Yawn! What a cozy night." sfx="pop"><GentleLion x={-8} y={-3} s={0.78} pose="sleep" mane={MANES[3]} zs={false} /></Tap>
      } />
    </Tap>
    <Zs x={280} y={336} s={0.9} />
    <Tap say="Not one scratch! God kept me safe." sfx="good">
      <Daniel x={360} y={428} s={1.0} pose="wave" />
    </Tap>
    <Tap say="Hooray! Daniel is safe!" sfx="fanfare">
      <KingDarius x={560} y={428} s={1.02} pose="arms-up" facing="left" blinkDelay={0.9} />
    </Tap>
    <Sparkles spots={[[300, 250, 7], [440, 230, 9], [620, 240, 6], [500, 300, 5]]} />
  </Scene>
)

// 11. "Then the king sent a letter to everyone in the land. It said, 'Daniel's God is the living God! He saves, and
// He rescues.'" The king holds up his letter on the palace steps; Daniel and the people cheer.
const Page11 = () => (
  <Scene sky="day" ground="desert">
    <PalaceFront />
    <Tap say="Daniel's God is the living God!" sfx="fanfare">
      <KingDarius x={366} y={336} s={0.8} pose="wave" holding="scroll" />
    </Tap>
    <Tap say="God saves, and God rescues!" sfx="good">
      <Daniel x={450} y={336} s={0.78} pose="arms-up" blinkDelay={1.1} />
    </Tap>
    <Tap say="Hooray for God!" sfx="pop">
      <Person x={80} y={436} s={0.86} look={TOWNSFOLK[0]} pose="arms-up" />
      <Person x={160} y={444} s={0.86} look={TOWNSFOLK[2]} pose="wave" blinkDelay={0.6} />
      <Person x={230} y={440} s={0.86} look={TOWNSFOLK[1]} pose="arms-up" blinkDelay={1.2} />
      <Person x={570} y={440} s={0.86} look={TOWNSFOLK[3]} pose="wave" blinkDelay={1.8} />
      <Person x={644} y={446} s={0.86} look={TOWNSFOLK[4]} pose="arms-up" blinkDelay={0.3} />
      <Person x={720} y={440} s={0.86} look={TOWNSFOLK[5]} pose="arms-up" blinkDelay={2.2} />
    </Tap>
    <Sparkles spots={[[300, 110, 7], [500, 100, 6], [400, 70, 9]]} />
  </Scene>
)

// 12. "Daniel kept on praying every day, and God was always with him. You can talk to God any time, too, in the
// morning, at lunch, and at night. God always hears you!" Daniel at his window, and the child playing, praying too.
const Page12 = () => {
  const { look } = usePlayer()
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <ShutEyes />
      <DanielsRoom />
      <Glow x={365} y={330} r={170} color="#fff6c8" />
      <LampAndScroll />
      <PrayerRug x={365} w={140} />
      <Tap say="Let's talk to God together!" sfx="good">
        <g className="dn-shut"><DanielKneeling x={300} y={420} s={1.12} /></g>
      </Tap>
      <Tap say="Thank you, God, for loving me!" sfx="sparkle">
        <g className="dn-shut"><Kneel x={430} y={424} s={1.16} look={look} blinkDelay={0.7} /></g>
      </Tap>
      <Tap say="God hears you, any time at all!" sfx="sparkle">
        <Heart x={360} y={220} r={13} />
        <Heart x={260} y={260} r={8} d={0.8} />
        <Heart x={470} y={250} r={9} d={1.6} />
      </Tap>
    </Scene>
  )
}

export const DANIEL_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
