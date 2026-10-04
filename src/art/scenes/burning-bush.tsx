// The Burning Bush: one picture per story page, both parts in order (see data/burning-bush.ts for the words).
// Built from the kit (./kit.tsx), people (../people.tsx) and the Moses islands' shared cast and props
// (./moses.tsx). God is never drawn as a person: His presence is light (the bush that burns but does not
// burn up, its glow, its rays and its sparkles).
// New here, for other islands (and people.tsx) to reuse: JETHRO, ZIPPORAH and her SISTERS in their Midian
// clothes (Sister, MidianTrim), the grumpy SHEPHERDS; faces (MosesSad, MosesWonder, SadFace, GrumpyFace);
// BareFeet and KneelingBarefoot (holy ground); props: Well, Trough, PouringBucket, TravelBundle, BurningBush,
// MountainOfGod, Sandals, Boulder, Scrub, Clumps, Footprints; animals: a rock Hyrax and a desert Hedgehog;
// backgrounds: MidianLand.
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Person, SKIN, type Look, type Pose } from '../people'
import { Cloud, Emoji, Glow, Palm, Rays, Scene, Sheep, Sparkles, Sun, Tap } from './kit'
import { usePlayer } from './player'
import {
  AARON, BrickBasket, BrickStack, Column, Desert, DryingBricks, flame, Folk, Goat, Grip, Heart, HEBREWS, MOSES,
  Pharaoh, Pyramid, SKINS, Staff, StaffInLeftHand, Straw, type PersonProps,
} from './moses'
import { Rock, SittingOnRock, WoolSheep } from './david'
import { Tent, ThoughtBubble } from './abraham'
import { BeardFrown, Brows } from './daniel'
import './burning-bush.css'

const uid = (prefix: string, id: string) => `${prefix}${id.replace(/[^a-zA-Z0-9]/g, '')}`

const SAND = '#f2d39a', SAND2 = '#e8bf7a'

// ---------- The people of Midian ----------

/** Jethro, the priest of Midian (Moses' father-in-law): old and kind, a long white beard, a saffron head cloth and a plum robe. */
export const JETHRO: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#ece8e0', wrap: '#e9a23b', beard: 'long', beardColor: '#f4f1ea', robe: '#7b4a8c', sash: '#f2c84b' }
/** Zipporah, the oldest of Jethro's seven daughters, who married Moses: a golden head scarf and a teal robe. */
export const ZIPPORAH: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#f2b53a', robe: '#1f9488', sash: '#e8574f' }
/** Her six sisters (Exodus 2:16), from the oldest to the youngest, each in her own colors. */
export const SISTERS: Look[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#f4e3c3', robe: '#d9534a', sash: '#3f7fd0' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1f18', wrap: '#ff9ec0', robe: '#8c5cc4', sash: '#f2c84b' },
  { skin: SKIN.medium, hair: 'long', hairColor: '#3b2a20', robe: '#f08a2e', sash: '#7a3f8c', bow: '#d9534a', build: 'child' },
  { skin: SKIN.tan, hair: 'pigtails', hairColor: '#2b1f18', robe: '#f2cf3d', sash: '#2f8fd8', build: 'child' },
  { skin: SKIN.medium, hair: 'ponytail', hairColor: '#4a3020', robe: '#5fb85a', sash: '#f4e3c3', build: 'child' },
  { skin: SKIN.tan, hair: 'curly', hairColor: '#3b2a20', robe: '#4fa6e8', sash: '#ffd34d', build: 'child' },
]
/** All seven sisters, the oldest first: Zipporah, then her six sisters. */
export const SEVEN: Look[] = [ZIPPORAH, ...SISTERS]
/** The grumpy shepherds at the well (draw them with GrumpyFace). */
export const SHEPHERDS: Look[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1f18', wrap: '#a89878', beard: 'short', beardColor: '#2b1f18', robe: '#7d6a4f', sash: '#4a3a2a' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#7f8a98', beard: 'short', beardColor: '#3b2a20', robe: '#5f7a5a', sash: '#a0703f' },
]

/**
 * The sisters' Midian dress, in a Person's own units (give it as a child): a stitched band of color near the
 * robe's hem, and a band of little gold coins across the forehead under a head scarf (or a ribbon over the hair).
 */
export function MidianTrim({ look }: { look: Look }) {
  const band = look.sash ?? '#f2c84b'
  return (
    <g>
      <path d="M-33.2 -17.5 Q0 -8.8 33.2 -17.5" stroke={band} strokeWidth={5} fill="none" />
      <path d="M-31 -16.9 Q0 -8.6 31 -16.9" stroke="#fff8e6" strokeWidth={1.5} fill="none" strokeDasharray="2.2 3" opacity={0.9} />
      {look.hair === 'covered' ? (
        <g>
          <path d="M-21.5 -116 Q-12 -126.6 0 -126 Q12 -126.6 21.5 -116" stroke="#e8b730" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          {([[-16.5, -118.4], [-9.5, -122.6], [0, -123.8], [9.5, -122.6], [16.5, -118.4]] as const).map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r={1.9} fill="#ffd65a" stroke="#b8901c" strokeWidth={0.8} />
          ))}
        </g>
      ) : (
        <path d="M-21 -119 Q-12 -128.5 0 -128.5 Q12 -128.5 21 -119" stroke={band} strokeWidth={3} fill="none" strokeLinecap="round" />
      )}
    </g>
  )
}

/** A sad face over a Person's smile (no beard; in their own units): the smile covered with `skin`, a little frown and sad brows. */
export const SadFace = ({ skin }: { skin: string }) => (
  <g>
    <ellipse cx={0} cy={-104} rx={7} ry={4.4} fill={skin} />
    <path d="M-4.5 -102 Q0 -105.6 4.5 -102" stroke="#6b2a3a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <path d="M-12.5 -119.2 L-5 -121.4 M12.5 -119.2 L5 -121.4" stroke="#2b2140" strokeWidth={1.8} strokeLinecap="round" />
  </g>
)

/** A grumpy bearded face (in a Person's own units): brows low in the middle and a frown under the moustache. */
export const GrumpyFace = ({ beard }: { beard: string }) => <g><Brows mood="grumpy" /><BeardFrown color={beard} /></g>

/**
 * A tired face, "Phew!" (in a Person's own units): brows up in the middle, a frown (under the moustache, when
 * there's a `beard`: its color), and a drop of sweat by the head. `skin` covers the smile when there's no beard.
 */
export const TiredFace = ({ skin, beard }: { skin: string; beard?: string }) => (
  <g>
    {beard ? <g><Brows mood="sad" /><BeardFrown color={beard} /></g> : <SadFace skin={skin} />}
    <path d="M29 -129 q5.5 8 0 11 q-5.5 -3 0 -11 Z" fill="#8fd3ff" stroke="#5aa8d8" strokeWidth={1.4} />
  </g>
)

/** One of God's people far away (moses.tsx's Folk), tired from carrying bricks all day: a little frown in place of the smile. */
function TiredFolk({ x, y, s = 1, i = 0, up, load }: { x: number; y: number; s?: number; i?: number; up?: boolean; load?: boolean }) {
  const hy = -54 // (Folk's face, in its own units)
  const skin = SKINS[(i * 7 + 2) % SKINS.length]
  return (
    <g>
      <Folk x={x} y={y} s={s} i={i} up={up} load={load} />
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={hy + 6.6} rx={4} ry={2.6} fill={skin} />
        <path d={`M-3 ${hy + 8} Q0 ${hy + 5} 3 ${hy + 8}`} stroke="#6b2a3a" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

/** One of the seven sisters (0 is Zipporah, the oldest), in her Midian clothes. `sad`: a sad face. */
export function Sister({ i, sad, children, ...p }: Omit<PersonProps, 'look'> & { i: number; sad?: boolean }) {
  const look = SEVEN[i % SEVEN.length]
  return (
    <Person {...p} look={look}>
      <MidianTrim look={look} />
      {sad && <SadFace skin={look.skin} />}
      {children}
    </Person>
  )
}

// ---------- Moses ----------

const MOSES_BEARD = MOSES.beardColor

/** Moses sad or afraid (in his own units): brows up in the middle and a frown under his moustache. */
export const MosesSad = () => <g><Brows mood="sad" /><BeardFrown color={MOSES_BEARD} /></g>

/** Moses amazed (in his own units): brows raised high and a little round "oh" under his moustache. */
export const MosesWonder = () => (
  <g>
    <path d="M-12.5 -120.6 Q-8.5 -124.6 -4.5 -121.2 M4.5 -121.2 Q8.5 -124.6 12.5 -120.6" stroke="#2b2140" strokeWidth={2} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-98.3} rx={6} ry={2.6} fill={MOSES_BEARD} />
    <ellipse cx={0} cy={-97.4} rx={2.3} ry={2.9} fill="#8a2f45" stroke="#5a1f30" strokeWidth={0.9} />
  </g>
)

/** Bare feet with little toes, over a Person's sandals (in their own units): the sandals are off, on holy ground. */
export const BareFeet = ({ skin }: { skin: string }) => (
  <g>
    {[-1, 1].map((d) => (
      <g key={d}>
        <ellipse cx={d * 11} cy={-2.2} rx={10} ry={3.8} fill={skin} stroke={ink(skin)} strokeWidth={1.3} />
        {/* four little toes and a big toe, nearest the middle */}
        {([[16.5, 1.3], [13, 1.5], [9.4, 1.7], [5.4, 2.2]] as const).map(([tx, r]) => (
          <circle key={tx} cx={d * tx} cy={0.6} r={r} fill={skin} stroke={ink(skin)} strokeWidth={0.8} />
        ))}
      </g>
    ))}
  </g>
)

/**
 * Someone kneeling barefoot, seen from the front (on holy ground): the Person from the knees up, their robe
 * pooled on the ground, and a bare foot peeking out behind them on each side: the sole, and the toes at its
 * tip. (x, y) = their knees on the ground. (Like scenes/daniel.tsx's Kneel, with bare feet.)
 */
export function KneelingBarefoot({ x, y, s = 1, look, pose = 'pray', facing = 'right', blinkDelay = 0, children }: {
  x: number; y: number; s?: number; look: Look; pose?: Pose; facing?: 'left' | 'right'; blinkDelay?: number; children?: ReactNode
}) {
  const clip = uid('kb', useId())
  const k = look.build === 'child' ? 0.74 : 1
  const drop = 26 * k
  const w = 33 * k
  const line = ink(look.skin)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={clip}><rect x={-140} y={-320} width={280} height={316} /></clipPath></defs>
      {/* a foot each side, its heel tucked under the robe and its toes out at the tip, tipped up a little */}
      {[-1, 1].map((d) => {
        const fx = d * (w + 5 * k), fy = -6 * k
        return (
          <g key={d} transform={`rotate(${-d * 24} ${fx} ${fy})`}>
            <ellipse cx={fx} cy={fy} rx={9 * k} ry={5.2 * k} fill={look.skin} stroke={line} strokeWidth={1.5} />
            <ellipse cx={fx + d * 1.4 * k} cy={fy - 0.3 * k} rx={5.4 * k} ry={2.8 * k} fill={lighten(look.skin, 0.28)} />
            {([[-3.4, 2.1], [-1.1, 1.6], [1.1, 1.5], [3.2, 1.4]] as const).map(([ty, r]) => (
              <circle key={ty} cx={fx + d * 9.4 * k} cy={fy + ty * k} r={r * k} fill={look.skin} stroke={line} strokeWidth={0.9} />
            ))}
          </g>
        )
      })}
      <g clipPath={`url(#${clip})`}>
        <Person x={0} y={drop} s={1} look={look} pose={pose} facing={facing} blinkDelay={blinkDelay}>{children}</Person>
      </g>
      <path d={`M${-w + 1} ${-10 * k} Q${-w - 6 * k} ${-2 * k} ${-w + 3} ${1.5 * k} Q0 ${6 * k} ${w - 3} ${1.5 * k} Q${w + 6 * k} ${-2 * k} ${w - 1} ${-10 * k} Q0 ${-5 * k} ${-w + 1} ${-10 * k} Z`}
        fill={look.robe} stroke={ink(look.robe)} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  )
}

/** A cloth bundle for a long trip, hanging from the left hand (in the Person's own units: the hand is at (-30, -46)). */
export const TravelBundle = ({ skin = MOSES.skin }: { skin?: string }) => (
  <g strokeLinejoin="round">
    <path d="M-30 -44 Q-46 -38 -47 -22 Q-46 -6 -31 -5 Q-15 -6 -14 -22 Q-15 -38 -30 -44 Z" fill="#eadbb8" stroke="#a88a5a" strokeWidth={2.2} />
    <path d="M-45 -25 Q-31 -19 -16 -25" stroke="#c0504d" strokeWidth={2.8} fill="none" />
    <path d="M-45 -19 Q-31 -13 -17 -19" stroke="#3f7fd0" strokeWidth={1.6} fill="none" />
    <path d="M-36 -49 L-30 -42 L-24 -49" stroke="#a88a5a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <Grip x={-30} y={-46} skin={skin} />
  </g>
)

/**
 * A wooden bucket tipped up in the right hand (pose "point", the hand at (54, -90)), pouring water out of its
 * mouth, in the Person's own units. The water itself is drawn in the picture (Pour), where it lands.
 */
export const PouringBucket = ({ skin = MOSES.skin }: { skin?: string }) => (
  <g>
    <g transform="translate(70 -88) rotate(100) scale(1.35)">
      <path d="M-6 -13 Q0 -24 6 -13" stroke="#6b4422" strokeWidth={1.6} fill="none" />
      <path d="M-12 -13 L12 -13 L9 13 L-9 13 Z" fill="#b5794a" stroke="#7a4a24" strokeWidth={2} strokeLinejoin="round" />
      <path d="M-11 -4 L11 -4 M-10 5 L10 5" stroke="#7a4a24" strokeWidth={1.4} />
      <ellipse cx={0} cy={-13} rx={12} ry={3.2} fill="#6fb8e6" stroke="#7a4a24" strokeWidth={1.6} />
    </g>
    <Grip x={54} y={-90} skin={skin} />
  </g>
)

/** Water pouring down from (x1, y1) and splashing at (x2, y2). */
function Pour({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const mx = x1 + (x2 - x1) * 0.75
  return (
    <g>
      <path d={`M${x1} ${y1 - 7} Q${mx + 10} ${y1 - 2} ${x2 + 7} ${y2} L${x2 - 7} ${y2} Q${mx - 5} ${y1 + 8} ${x1} ${y1 + 7} Z`} fill="#8fd3f7" stroke="#4fa6dc" strokeWidth={1.8} strokeLinejoin="round" />
      <path d={`M${x1 + 3} ${y1 - 1} Q${mx + 3} ${y1 + 2} ${x2} ${y2 - 4}`} stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.85} strokeLinecap="round" />
      {[[-15, -7, 3.4], [14, -9, 3.8], [-6, -15, 2.6], [7, -17, 2.4], [-20, -2, 2.4], [20, -3, 2.6]].map(([dx, dy, r], i) => (
        <circle key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.3}s` }} cx={x2 + dx} cy={y2 + dy} r={r} fill="#d6f0ff" stroke="#6fb8e6" strokeWidth={1} />
      ))}
    </g>
  )
}

// ---------- The well ----------

/**
 * A stone well: a round wall of stones with a rim around the deep water, two wooden posts with a beam across
 * them, and a rope down to the bucket. `bucket`: hanging from the beam ('hang'), or gone ('none': someone has
 * it, and the rope hangs down into the well). (x, y) = the middle of its foot on the ground; it's about 136
 * wide and 160 tall at s = 1.
 */
export function Well({ x, y, s = 1, bucket = 'hang' }: { x: number; y: number; s?: number; bucket?: 'hang' | 'none' }) {
  const id = uid('wl', useId())
  const stone = '#d2c1a4', line = '#8f7a5e'
  const wall = 'M-62 -54 L-62 -6 Q0 8 62 -6 L62 -54 Z'
  const shade = useShade(stone, 0.25, 0.18)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{shade.def}<clipPath id={id}><path d={wall} /></clipPath></defs>
      <ellipse cx={0} cy={1} rx={76} ry={7} fill="#000" opacity={0.12} />
      <path d={wall} fill={shade.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      {/* the stones, row by row */}
      <g clipPath={`url(#${id})`} fill="none" stroke={darken(stone, 0.22)} strokeWidth={2}>
        {[-42, -30, -18].map((ry, r) => (
          <g key={ry}>
            <path d={`M-64 ${ry + (r === 2 ? 1 : 0)} Q0 ${ry + 6} 64 ${ry + (r === 2 ? 1 : 0)}`} />
            {Array.from({ length: 6 }, (_, i) => -55 + i * 22 + (r % 2) * 11).map((sx) => <path key={sx} d={`M${sx} ${ry - 12 + Math.abs(sx) * 0.02} l0 12`} />)}
          </g>
        ))}
        {Array.from({ length: 6 }, (_, i) => -50 + i * 22).map((sx) => <path key={sx} d={`M${sx} -16 l0 14`} />)}
      </g>
      <path d="M-56 -46 Q-58 -26 -54 -12" stroke="#fff" strokeWidth={3} opacity={0.3} fill="none" strokeLinecap="round" />
      {/* the rim: a ring of stone around the dark water */}
      <ellipse cx={0} cy={-54} rx={66} ry={14} fill={lighten(stone, 0.18)} stroke={line} strokeWidth={3} />
      <ellipse cx={0} cy={-54} rx={51} ry={8.5} fill="#2e4a5e" />
      <ellipse cx={-12} cy={-55.5} rx={22} ry={2.6} fill="#5d8faa" opacity={0.75} />
      {/* the posts and the beam, the rope, and the bucket */}
      {[-56, 56].map((px) => <rect key={px} x={px - 5} y={-150} width={10} height={98} rx={3} fill="#9a6a3a" stroke="#6b4422" strokeWidth={2.5} />)}
      <rect x={-70} y={-158} width={140} height={13} rx={6.5} fill="#a8743f" stroke="#6b4422" strokeWidth={2.5} />
      <path d="M-62 -152 L62 -152" stroke="#c99a62" strokeWidth={2} strokeLinecap="round" />
      {bucket === 'hang' ? (
        <g>
          <path d="M0 -146 L0 -112" stroke="#c9a46a" strokeWidth={2.5} />
          <path d="M-10 -104 Q0 -118 10 -104" stroke="#6b4422" strokeWidth={2} fill="none" />
          <path d="M-12 -104 L12 -104 L9 -80 L-9 -80 Z" fill="#b5794a" stroke="#7a4a24" strokeWidth={2.2} strokeLinejoin="round" />
          <path d="M-11 -96 L11 -96 M-10 -88 L10 -88" stroke="#7a4a24" strokeWidth={1.6} />
        </g>
      ) : (
        <path d="M0 -146 L0 -56" stroke="#c9a46a" strokeWidth={2.5} />
      )}
    </g>
  )
}

/**
 * A long stone trough of water for the animals to drink from, seen from the front: its far edge, the water, and
 * its front. Animals drinking from it stand behind it: draw them first, their heads low, and the trough's far
 * edge hides their noses, dipped in the water. (x, y) = the middle of its foot; w wide, about 40 tall.
 */
export function Trough({ x, y, w = 160 }: { x: number; y: number; w?: number }) {
  const stone = '#c4b294', line = '#8a775c'
  const joints = Math.max(1, Math.round(w / 48))
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={1} rx={w / 2 + 10} ry={5} fill="#000" opacity={0.12} />
      <rect x={-w / 2} y={-40} width={w} height={9} rx={3} fill={lighten(stone, 0.12)} stroke={line} strokeWidth={2.5} />
      <rect x={-w / 2 + 5} y={-34} width={w - 10} height={9} fill="#78c4ec" />
      {[-0.3, 0.05, 0.32].map((t) => <path key={t} d={`M${w * t - 10} -30 q5 -2.5 10 0 t10 0`} stroke="#e6f6ff" strokeWidth={1.8} fill="none" strokeLinecap="round" />)}
      <rect x={-w / 2} y={-28} width={w} height={28} rx={4} fill={stone} stroke={line} strokeWidth={3} />
      <path d={`M${-w / 2 + 6} -22 L${w / 2 - 6} -22`} stroke={lighten(stone, 0.3)} strokeWidth={3} strokeLinecap="round" />
      {Array.from({ length: joints }, (_, i) => -w / 2 + ((i + 1) * w) / (joints + 1)).map((jx) => (
        <path key={jx} d={`M${jx} -18 L${jx} -2`} stroke={darken(stone, 0.18)} strokeWidth={2} />
      ))}
    </g>
  )
}

/** Moses' bundle for the trip, set down on the sand. (x, y) = its foot. */
const BundleOnGround = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
    <ellipse cx={0} cy={0} rx={22} ry={3.5} fill="#000" opacity={0.12} />
    <path d="M0 -36 Q-18 -30 -20 -15 Q-20 0 -2 0 Q18 0 18 -15 Q16 -30 0 -36 Z" fill="#eadbb8" stroke="#a88a5a" strokeWidth={2.2} />
    <path d="M-18 -17 Q0 -11 16 -17" stroke="#c0504d" strokeWidth={2.8} fill="none" />
    <path d="M-18 -11 Q0 -5 16 -11" stroke="#3f7fd0" strokeWidth={1.6} fill="none" />
    <path d="M-6 -42 L0 -34 L6 -42" stroke="#a88a5a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </g>
)

// ---------- The desert and the mountain of God ----------

type Round = [number, number, number]

/** Round clumps drawn as one shape (leaves, a bush): one outline round the outside, lighter at the top. */
export function Clumps({ clumps, color, w = 3 }: { clumps: Round[]; color: string; w?: number }) {
  const id = uid('cl', useId())
  const line = ink(color)
  const top = Math.min(...clumps.map(([, cy, r]) => cy - r))
  const bottom = Math.max(...clumps.map(([, cy, r]) => cy + r))
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={top} x2={0} y2={bottom}>
          <stop offset="0" stopColor={lighten(color, 0.24)} /><stop offset="0.55" stopColor={color} /><stop offset="1" stopColor={darken(color, 0.14)} />
        </linearGradient>
      </defs>
      {clumps.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r} fill={line} stroke={line} strokeWidth={w * 2} />)}
      {clumps.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={`url(#${id})`} />)}
    </g>
  )
}

/** A scrubby desert bush: a low clump of small grey-green leaves on twiggy stems. (x, y) = its foot; about 92 wide and 50 tall at s = 1. */
export function Scrub({ x, y, s = 1, color = '#8fb05c', flip }: { x: number; y: number; s?: number; color?: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={0} rx={48} ry={5} fill="#000" opacity={0.12} />
      <path d="M0 0 L-16 -24 M0 0 L2 -34 M0 0 L18 -22" stroke="#7a5a3a" strokeWidth={4} strokeLinecap="round" />
      <Clumps clumps={[[-30, -16, 16], [-13, -30, 20], [12, -32, 19], [31, -17, 16], [0, -15, 18]]} color={color} w={2.5} />
      <path d="M-22 -32 q5 -5 10 0 M10 -42 q5 -5 10 0 M-36 -18 q4 -4 8 0" stroke={lighten(color, 0.45)} strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A big rounded desert boulder: sunny on top, shady underneath, with a crack. (x, y) = the middle of its foot; w wide, h tall. */
export function Boulder({ x, y, w = 100, h = 70, color = '#c99a78', flip }: { x: number; y: number; w?: number; h?: number; color?: string; flip?: boolean }) {
  const shade = useShade(color, 0.3, 0.24)
  const d = `M${-w / 2} 0 C${-w / 2} ${-h * 0.55} ${-w * 0.3} ${-h} ${w * 0.02} ${-h} C${w * 0.32} ${-h} ${w / 2} ${-h * 0.64} ${w / 2} ${-h * 0.22} Q${w / 2} 0 ${w * 0.4} 0 Z`
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <defs>{shade.def}</defs>
      <ellipse cx={0} cy={0} rx={w * 0.56} ry={5} fill="#000" opacity={0.13} />
      <path d={d} fill={shade.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${w * 0.14} ${-h * 0.62} l${w * 0.07} ${h * 0.14} l${-w * 0.03} ${h * 0.16}`} stroke={ink(color)} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      <path d={`M${-w * 0.36} ${-h * 0.5} Q${-w * 0.28} ${-h * 0.82} ${-w * 0.06} ${-h * 0.88}`} stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.32} />
    </g>
  )
}

/**
 * The mountain of God (Horeb): a tall, rugged mountain of red-brown rock, sunny on the left and shady on the
 * right, with rocky ridges. `glow`: a soft warm light at its top. (x, y) = the middle of its foot; w wide, h tall.
 */
export function MountainOfGod({ x, y, w = 560, h = 320, glow }: { x: number; y: number; w?: number; h?: number; glow?: boolean }) {
  const P = ([fx, fy]: readonly [number, number]) => `${(x + (fx * w) / 2).toFixed(1)} ${(y - fy * h).toFixed(1)}`
  const outline: [number, number][] = [[-1, 0], [-0.82, 0.24], [-0.68, 0.34], [-0.56, 0.5], [-0.42, 0.56], [-0.26, 0.78], [-0.12, 0.84], [0.02, 1], [0.12, 0.9], [0.22, 0.94], [0.36, 0.72], [0.5, 0.64], [0.64, 0.46], [0.8, 0.38], [0.9, 0.18], [1, 0]]
  // the shady side: from the top, down a ridge to the foot, and back up round the right
  const ridge: [number, number][] = [[0.02, 1], [0.08, 0.74], [0.02, 0.5], [0.12, 0.28], [0.06, 0]]
  const shadow = [...ridge, ...outline.filter(([fx]) => fx > 0.06).reverse()]
  const peak = outline[7]
  return (
    <g>
      {glow && <Glow x={x + (peak[0] * w) / 2} y={y - peak[1] * h + 26} r={h * 0.42} color="#fff3c4" />}
      <path d={`M${outline.map(P).join(' L')} Z`} fill="#d9a07a" stroke="#9a5f45" strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${shadow.map(P).join(' L')} Z`} fill="#b97c5c" />
      {/* rocky ridges and ledges */}
      <g stroke="#a86a4e" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75}>
        <path d={`M${P([-0.56, 0.5])} L${P([-0.48, 0.34])} L${P([-0.52, 0.16])}`} />
        <path d={`M${P([-0.26, 0.78])} L${P([-0.2, 0.56])} L${P([-0.28, 0.36])} L${P([-0.22, 0.12])}`} />
        <path d={`M${P([0.36, 0.72])} L${P([0.32, 0.5])} L${P([0.4, 0.3])}`} />
        <path d={`M${P([0.64, 0.46])} L${P([0.6, 0.26])} L${P([0.68, 0.1])}`} />
      </g>
      <g stroke="#e8be98" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.8}>
        <path d={`M${P([-0.7, 0.2])} l${w * 0.05} -4`} />
        <path d={`M${P([-0.38, 0.4])} l${w * 0.05} -5`} />
        <path d={`M${P([-0.12, 0.62])} l${w * 0.04} -4`} />
      </g>
      <path d={`M${outline.map(P).join(' L')} Z`} fill="none" stroke="#9a5f45" strokeWidth={3} strokeLinejoin="round" />
    </g>
  )
}

/** Midian: far hills of red-brown rock under the sky, and warm sand in front. `y`: where the sand begins. */
export function MidianLand({ y = 300 }: { y?: number }) {
  return (
    <g>
      <path d={`M0 ${y - 40} Q60 ${y - 96} 140 ${y - 66} Q200 ${y - 116} 290 ${y - 72} Q360 ${y - 98} 430 ${y - 58} Q520 ${y - 108} 610 ${y - 64} Q690 ${y - 102} 800 ${y - 54} L800 ${y + 10} L0 ${y + 10} Z`} fill="#e7b48c" />
      <path d={`M0 ${y - 12} Q120 ${y - 42} 260 ${y - 22} Q400 ${y - 48} 560 ${y - 18} Q690 ${y - 40} 800 ${y - 14} L800 ${y + 10} L0 ${y + 10} Z`} fill="#dba077" />
      <path d={`M0 ${y} Q200 ${y - 16} 400 ${y - 4} T800 ${y - 6} L800 450 L0 450 Z`} fill={SAND} />
      <path d={`M0 ${y + 66} Q240 ${y + 42} 480 ${y + 64} T800 ${y + 56} L800 450 L0 450 Z`} fill={SAND2} />
    </g>
  )
}

/**
 * A trail of footprints in the sand, left, right, left, from (x0, y0) (near: big) along a curve through (cx, cy)
 * to (x1, y1) (far away: small). Each print is a sole and a little round toe end, pointing toward (x0, y0): whoever
 * made them walked from far away to here.
 */
export function Footprints({ x0, y0, cx, cy, x1, y1, n = 12, color = '#cf9c58' }: { x0: number; y0: number; cx: number; cy: number; x1: number; y1: number; n?: number; color?: string }) {
  return (
    <g fill={color} opacity={0.9}>
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1
        // the way the trail goes here (away from the walker), and across it
        const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy)
        const len = Math.hypot(dx, dy) || 1
        const k = 1.25 - t * 0.85
        const side = i % 2 ? 1 : -1
        const px = x - (dy / len) * side * 5 * k, py = y + (dx / len) * side * 2.6 * k
        const a = (Math.atan2(dy * 0.55, dx) * 180) / Math.PI
        return (
          <g key={i} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${a.toFixed(1)}) scale(${k.toFixed(2)} ${(k * 0.62).toFixed(2)})`}>
            <ellipse cx={1.5} cy={0} rx={5.6} ry={3.6} />
            <ellipse cx={-6.2} cy={0} rx={3} ry={3.3} />
          </g>
        )
      })}
    </g>
  )
}

/** A little desert hedgehog, side-on (facing right): big round ears, a pointy snout and a coat of prickles. (x, y) = its feet; about 46 long at s = 1. */
export function Hedgehog({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const SPINE = '#8f6542', FACE = '#f1dcc0'
  // its coat of prickles: a tall, round, zigzag dome over its back, from its tail end over to its neck
  const spikes = Array.from({ length: 21 }, (_, i) => {
    const a = Math.PI * (1 + (i / 20) * 0.92)
    const r = i % 2 ? 0.8 : 1
    return `${(-5 + Math.cos(a) * 21 * r).toFixed(1)} ${(-4 + Math.sin(a) * 22 * r).toFixed(1)}`
  })
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={26} ry={3.4} fill="#000" opacity={0.14} />
      {[-14, 4].map((fx) => <ellipse key={fx} cx={fx} cy={-1.8} rx={4.6} ry={2.6} fill="#5a3d28" />)}
      <path d={`M${spikes.join(' L')} L15 -4 Q6 -1 -4 -1 Q-20 -1 -26 -4 Z`} fill={SPINE} stroke="#5a3d28" strokeWidth={2} />
      <path d="M-20 -10 l5 -7 M-11 -16 l3 -8 M-1 -18 l1 -8 M8 -14 l-1 -7" stroke="#e0bf94" strokeWidth={1.8} strokeLinecap="round" />
      {/* its face, poking out from its prickles: a pale pointy snout with a black nose, a bright eye, and a round ear */}
      <path d="M9 -17 Q17 -17 27 -6 Q24 -2 15 -2 Q8 -3 8 -10 Z" fill={FACE} stroke="#b89a76" strokeWidth={1.8} />
      <circle cx={27} cy={-6.2} r={2.3} fill="#2b2140" />
      <circle cx={10} cy={-18} r={4.4} fill={FACE} stroke="#b89a76" strokeWidth={1.6} />
      <circle cx={10} cy={-18} r={2.2} fill="#f6b8c0" />
      <circle cx={17.5} cy={-10.6} r={1.9} fill="#2b2140" />
      <circle cx={17} cy={-11.2} r={0.7} fill="#fff" />
    </g>
  )
}

/** Little birds flying far away: soft v's. */
const FarBirds = ({ spots }: { spots: [number, number, number?][] }) => (
  <g stroke="#6b6f8a" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round">
    {spots.map(([bx, by, k = 1], i) => <path key={i} d={`M${bx - 8 * k} ${by - 3 * k} Q${bx - 4 * k} ${by - 6 * k} ${bx} ${by} Q${bx + 4 * k} ${by - 6 * k} ${bx + 8 * k} ${by - 3 * k}`} />)}
  </g>
)

/** A rock hyrax: a little round furry animal that lives among the rocks of the mountain, sitting side-on (facing right). (x, y) = its feet. */
export function Hyrax({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  const FUR = '#a8835c'
  const fur = useShade(FUR, 0.32, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{fur.def}</defs>
      <ellipse cx={0} cy={0} rx={20} ry={3} fill="#000" opacity={0.14} />
      {[-9, 5].map((fx) => <ellipse key={fx} cx={fx} cy={-2.5} rx={5} ry={3} fill={darken(FUR, 0.25)} />)}
      <ellipse cx={-2} cy={-12} rx={17} ry={11} fill={fur.fill} stroke={ink(FUR)} strokeWidth={2} />
      <ellipse cx={0} cy={-6} rx={10} ry={4} fill="#e6cfae" opacity={0.85} />
      <circle cx={9} cy={-24} r={3.4} fill={fur.fill} stroke={ink(FUR)} strokeWidth={1.5} />
      <circle cx={14} cy={-17} r={9} fill={fur.fill} stroke={ink(FUR)} strokeWidth={2} />
      <ellipse cx={21} cy={-14.5} rx={3} ry={2.4} fill="#4a3426" />
      <circle cx={16} cy={-19} r={1.9} fill="#2b2140" />
      <circle cx={15.4} cy={-19.6} r={0.6} fill="#fff" />
      <path d="M17 -12.5 q2.5 1.5 4.5 0" stroke="#4a3426" strokeWidth={1} fill="none" strokeLinecap="round" />
    </g>
  )
}

// ---------- The bush that burned but did not burn up ----------

/** A tongue of flame, its round foot at (x, y) and its tip h above: orange outside, then yellow, then a white-hot middle. */
function Flame({ x, y, w, h, rot = 0, d = 0 }: { x: number; y: number; w: number; h: number; rot?: number; d?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <g className="bb-flame" style={{ animationDelay: `${-d}s` }}>
        <path d={flame(w, h)} fill="#ffa63a" stroke="#f0782a" strokeWidth={2} strokeLinejoin="round" />
        <path d={flame(w * 0.68, h * 0.8)} fill="#ffd451" />
        <path d={flame(w * 0.36, h * 0.56)} fill="#fff6c8" />
      </g>
    </g>
  )
}

/** The bush's leaves: the clumps at the back (its top), and the clumps in front (its lower half), with the fire between them. */
const BUSH_BACK: Round[] = [[-32, -70, 27], [4, -82, 30], [38, -68, 27], [-54, -46, 20], [60, -44, 19]]
const BUSH_FRONT: Round[] = [[-42, -28, 23], [-10, -26, 27], [24, -28, 25], [52, -22, 18], [-60, -18, 14]]

/**
 * The bush that was on fire but did not burn up (Exodus 3:2): a leafy green bush with bright, gentle flames
 * dancing up among its leaves and over its top, in a big warm glow with sparkles. Its leaves stay green: nothing
 * is burnt, and there is no smoke. This light is God's presence; God is never drawn. (x, y) = the bush's foot;
 * it's about 150 wide and 220 tall with its flames at s = 1. `rays`: soft beams of light turning slowly behind it
 * (God speaking from the bush).
 */
export function BurningBush({ x, y, s = 1, rays }: { x: number; y: number; s?: number; rays?: boolean }) {
  return (
    <g>
      {rays && <Rays x={x} y={y - 96 * s} r={380 * s} n={16} color="#fff4b8" opacity={0.4} />}
      <Glow x={x} y={y - 90 * s} r={210 * s} color="#ffe9a0" />
      <Glow x={x} y={y - 92 * s} r={120 * s} color="#fffbe2" />
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={0} rx={100} ry={12} fill="#fff4c4" opacity={0.7} />
        {/* the big flames, behind the leaves and up over the top */}
        <Flame x={-66} y={-30} w={14} h={58} rot={-18} d={0.35} />
        <Flame x={68} y={-28} w={14} h={56} rot={18} d={0.65} />
        <Flame x={-38} y={-62} w={22} h={98} rot={-10} d={0.2} />
        <Flame x={42} y={-60} w={22} h={94} rot={10} d={0.8} />
        <Flame x={2} y={-76} w={28} h={136} d={0.5} />
        {/* the stems */}
        <path d="M-4 0 Q-10 -20 -32 -40 M0 0 Q2 -30 4 -62 M4 0 Q12 -20 36 -42 M-2 0 Q-22 -8 -50 -22 M2 0 Q26 -8 52 -22" stroke="#7a5233" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* the leaves at the back, then flames rising up among the leaves, then the leaves in front: all of
            them green and fresh, because the fire does not burn them up */}
        <Clumps clumps={BUSH_BACK} color="#58b858" />
        <Flame x={-48} y={-30} w={8} h={42} rot={-6} d={0.9} />
        <Flame x={-22} y={-38} w={11} h={60} rot={-4} d={0.15} />
        <Flame x={14} y={-42} w={13} h={72} rot={3} d={0.6} />
        <Flame x={42} y={-34} w={9} h={50} rot={7} d={0.4} />
        <Clumps clumps={BUSH_FRONT} color="#5cbf5a" />
        <path d="M-42 -78 q6 -6 12 0 M-6 -92 q7 -7 14 0 M30 -78 q6 -6 12 0 M-50 -36 q5 -5 10 0 M-16 -40 q6 -6 12 0 M18 -40 q6 -6 12 0" stroke="#b6e8a0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </g>
      <Sparkles spots={[[x - 112 * s, y - 150 * s, 11 * s], [x + 110 * s, y - 168 * s, 10 * s], [x - 80 * s, y - 220 * s, 7 * s], [x + 72 * s, y - 236 * s, 8 * s], [x + 130 * s, y - 74 * s, 7 * s], [x - 128 * s, y - 70 * s, 7 * s], [x + 6 * s, y - 250 * s, 6 * s]]} />
    </g>
  )
}

/** Soft arcs of light spreading out from the bush at (x, y) toward the left: God calling from the bush. */
function CallRings({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const r = (70 + i * 34) * s
        return (
          <g key={i} className="bb-call" style={{ animationDelay: `${i * 0.8}s`, transformBox: 'view-box', transformOrigin: `${x}px ${y}px` } as CSSProperties}>
            <path d={`M${x - r * 0.62} ${y - r * 0.78} Q${x - r * 1.22} ${y} ${x - r * 0.62} ${y + r * 0.78}`} stroke="#fff3b0" strokeWidth={7 * s} fill="none" strokeLinecap="round" opacity={0.85} />
            <path d={`M${x - r * 0.62} ${y - r * 0.78} Q${x - r * 1.22} ${y} ${x - r * 0.62} ${y + r * 0.78}`} stroke="#ffffff" strokeWidth={2.5 * s} fill="none" strokeLinecap="round" />
          </g>
        )
      })}
    </g>
  )
}

/**
 * Moses' sandals, taken off and set side by side on the ground (holy ground): the sandals item (🩴, items/
 * isl-burning-bush.tsx), lying flat, so seen a little squashed. (x, y) = their middle, on the ground; about 64
 * wide at s = 1.
 */
export function Sandals({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * 0.6})`}>
      <Emoji e="🩴" x={0} y={-30} size={64} />
    </g>
  )
}

// ---------- Egypt: the palace ----------

/** The king's palace: a raised hall with painted columns and a painted beam, its floor high above the yard. (Page 1.) */
function PalaceHall() {
  return (
    <g>
      {/* the floor, and the front of the platform under it */}
      <rect x={-10} y={372} width={366} height={22} fill="#efe0c0" stroke="#c9a46a" strokeWidth={3} />
      {[60, 140, 220, 300].map((fx) => <path key={fx} d={`M${fx} 374 L${fx - 8} 392`} stroke="#dcc79c" strokeWidth={2} />)}
      <rect x={-10} y={392} width={360} height={70} fill="#e2cc9e" stroke="#c9a46a" strokeWidth={3} />
      <rect x={-10} y={404} width={360} height={8} fill="#3a6fc4" />
      <rect x={-10} y={412} width={360} height={5} fill="#f2c94c" />
      <rect x={-10} y={417} width={360} height={4} fill="#c0504d" />
      <Column x={44} y={384} h={244} />
      <Column x={312} y={384} h={244} />
      {/* the painted beam across the tops of the columns */}
      <rect x={-10} y={44} width={370} height={56} fill="#e9d2a6" stroke="#c9a46a" strokeWidth={3} />
      <rect x={-10} y={76} width={370} height={8} fill="#3a6fc4" />
      <rect x={-10} y={84} width={370} height={5} fill="#f2c94c" />
      <rect x={-10} y={89} width={370} height={4} fill="#c0504d" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={14 + i * 40} cy={60} r={6} fill="#f2c94c" stroke="#c99a1c" strokeWidth={2} />)}
    </g>
  )
}

// ---------- The pages ----------

// 1. "Baby Moses grew up in the palace of the king of Egypt. But Moses loved God's people. He was sad to see
// them work so hard, making bricks all day long."
// Moses, grown up, stands in the king's palace between its painted columns, looking sadly down at God's
// people making bricks in the yard below (the same family as on the Red Sea island).
const Page1 = () => (
  <Scene sky="day" ground="none" clouds={false} sun>
    <Cloud x={470} y={64} s={0.6} slow />
    <path d="M0 282 Q200 264 400 278 T800 274 L800 450 L0 450 Z" fill={SAND} />
    <Tap say="The pyramids of Egypt! They are so big." sfx="pop">
      <Pyramid x={572} y={280} w={180} h={116} />
      <Pyramid x={706} y={282} w={110} h={70} />
    </Tap>
    <Palm x={760} y={300} s={0.6} />
    <Palm x={452} y={292} s={0.48} />
    <path d="M330 318 Q560 302 800 312 L800 450 L330 450 Z" fill="#e8c88c" />
    <DryingBricks x={650} y={340} />
    <Tap say="Phew! So many bricks. We are so tired." sfx="plop">
      {[[566, 330, 4], [622, 324, 7], [708, 328, 1]].map(([fx, fy, i]) => <TiredFolk key={fx} x={fx} y={fy} s={0.6} i={i} up load />)}
    </Tap>
    <BrickStack x={746} y={430} rows={4} cols={4} />
    <Tap say="Phew! So many bricks. We are so tired." sfx="plop">
      <Person x={470} y={432} s={0.8} look={HEBREWS.dad} blinkDelay={2.2}>
        <BrickBasket x={-30} y={-46} />
        <BrickBasket x={30} y={-46} />
        <Grip x={-30} y={-46} skin={HEBREWS.dad.skin} />
        <Grip x={30} y={-46} skin={HEBREWS.dad.skin} />
        <TiredFace skin={HEBREWS.dad.skin} beard={HEBREWS.dad.beardColor} />
      </Person>
      <Person x={594} y={440} s={0.76} look={HEBREWS.mom} pose="hold" blinkDelay={0.8}>
        <Straw x={0} y={-64} />
        <Grip x={-8} y={-60} skin={HEBREWS.mom.skin} />
        <Grip x={8} y={-60} skin={HEBREWS.mom.skin} />
        <TiredFace skin={HEBREWS.mom.skin} />
      </Person>
    </Tap>
    <PalaceHall />
    <Tap say="Meow!" sfx="pop">
      <Emoji e="🐱" x={110} y={360} size={46} />
    </Tap>
    <Tap say="God's people work so hard. It makes me sad." sfx="plop">
      <Person x={214} y={386} s={1.04} look={MOSES} blinkDelay={1.2}><MosesSad /></Person>
    </Tap>
  </Scene>
)

// 2. "One day, Moses had to leave Egypt. He walked far, far away, across the hot desert, to a land called
// Midian."
// Moses walks on with a walking stick and a bundle, his footprints winding back to Egypt's tiny pyramids; the
// hills of Midian are far ahead.
const Page2 = () => (
  <Scene sky="day" ground="none" clouds={false} sun>
    <Cloud x={300} y={76} s={0.55} slow />
    <Cloud x={120} y={150} s={0.45} />
    <Cloud x={470} y={170} s={0.4} slow />
    <FarBirds spots={[[520, 96, 1], [548, 110, 0.8], [500, 120, 0.7]]} />
    {/* the hills of Midian, far away ahead */}
    <path d="M500 296 Q560 240 616 262 Q666 220 726 250 Q770 232 820 246 L820 300 L500 300 Z" fill="#dba077" />
    <path d="M560 296 Q620 266 676 278 Q730 260 820 272 L820 300 L560 300 Z" fill="#cf9168" />
    <Desert />
    <Tap say="Egypt is far behind now." sfx="pop">
      <Pyramid x={78} y={294} w={74} h={46} />
      <Pyramid x={132} y={296} w={46} h={28} />
    </Tap>
    <Palm x={250} y={300} s={0.32} />
    <Palm x={268} y={302} s={0.26} />
    <Tap say="Step, step, step. What a long, long walk!" sfx="pop">
      <Footprints x0={398} y0={432} cx={196} cy={430} x1={168} y1={306} n={14} />
    </Tap>
    <Boulder x={640} y={420} w={70} h={40} />
    <Scrub x={720} y={436} s={0.7} />
    <Tap say="Sniff, sniff! A little hedgehog lives in the desert." sfx="pop">
      <Hedgehog x={600} y={438} s={0.9} facing="left" />
    </Tap>
    <Tap say="I have to go far away. God, please be with me." sfx="whoosh">
      <Person x={436} y={426} s={1.06} look={MOSES} holding="stick" blinkDelay={0.9}><TravelBundle /></Person>
    </Tap>
  </Scene>
)

/** The well in Midian, with its trough (pages 3 and 4): the well's foot and the trough's foot, on the sand. */
const WELL = { x: 230, y: 372 }, TROUGH = { x: 452, y: 398, w: 170 }

/** The oasis round the well in Midian: its far hills and sand, and palms (pages 3 and 4). */
const Oasis = () => (
  <g>
    <MidianLand y={300} />
    <Palm x={30} y={330} s={0.9} />
    <Palm x={544} y={306} s={0.76} />
    <Palm x={582} y={312} s={0.56} />
  </g>
)

// 3. "In Midian, Moses sat down by a well. Seven sisters came to give their sheep a drink. But some grumpy
// shepherds pushed them away. That was not kind!"
// Moses rests on a rock by the well. Two grumpy shepherds and their goats crowd round the trough, and one shoos
// the seven sisters away; the sisters wait sadly with their sheep. Tapping each sister counts them: one to seven.
const Page3 = () => (
  <Scene sky="day" ground="none">
    <Oasis />
    <Tap say="A deep well, full of cool water." sfx="plop">
      <Well x={WELL.x} y={WELL.y} />
    </Tap>
    {/* (the first shepherd stands behind the trough, so it's drawn over his feet) */}
    <Tap say="Go away! Our goats drink first!" sfx="wobble">
      <Person x={430} y={380} s={0.78} look={SHEPHERDS[0]} blinkDelay={1.4}><GrumpyFace beard={SHEPHERDS[0].beardColor!} /></Person>
    </Tap>
    <Tap say="A long trough for the animals to drink from." sfx="plop">
      <Trough x={TROUGH.x} y={TROUGH.y} w={TROUGH.w} />
    </Tap>
    <Tap say="Go away! Our goats drink first!" sfx="wobble">
      <Goat x={390} y={436} s={0.56} />
      <Goat x={476} y={442} s={0.6} facing="left" coat="#4a3a33" patch="#2b2422" />
      <Person x={516} y={418} s={0.84} look={SHEPHERDS[1]} pose="point" blinkDelay={0.6}><GrumpyFace beard={SHEPHERDS[1].beardColor!} /></Person>
    </Tap>
    {/* the seven sisters, waiting sadly with their sheep: the big sisters at the back, the little ones in front */}
    <Sheep x={780} y={382} s={0.4} facing="left" />
    <Tap count="sisters"><Sister i={1} x={612} y={376} s={0.72} sad blinkDelay={0.3} /></Tap>
    <Tap count="sisters"><Sister i={0} x={668} y={372} s={0.74} sad blinkDelay={1.1} /></Tap>
    <Tap count="sisters"><Sister i={2} x={724} y={378} s={0.72} sad blinkDelay={2.0} /></Tap>
    <Tap count="sisters"><Sister i={3} x={590} y={438} s={0.8} sad blinkDelay={0.7} /></Tap>
    <Tap count="sisters"><Sister i={4} x={638} y={442} s={0.8} sad blinkDelay={1.6} /></Tap>
    <Tap count="sisters"><Sister i={5} x={686} y={438} s={0.8} sad blinkDelay={2.4} /></Tap>
    <Tap count="sisters"><Sister i={6} x={734} y={442} s={0.8} sad blinkDelay={0.2} /></Tap>
    <Sheep x={774} y={446} s={0.48} facing="left" />
    {/* Moses, resting on a rock after his long walk, his bundle by his feet */}
    <Tap say="Oh no! That is not kind." sfx="plop">
      <Rock x={86} y={428} s={0.8} />
      <SittingOnRock x={86} y={430} s={0.82} look={MOSES} blinkDelay={1.8}><MosesSad /></SittingOnRock>
      <BundleOnGround x={150} y={444} />
    </Tap>
  </Scene>
)

// 4. "So Moses stood up and helped the sisters! He pulled up water from the well and filled the trough. All
// their thirsty sheep had a drink. Slurp, slurp!"
// Moses pours a bucket of water into the trough; the sisters' sheep drink, their noses dipped in. The seven
// sisters are happy, and the grumpy shepherds go off far away with their goats.
const Page4 = () => (
  <Scene sky="day" ground="none">
    <Oasis />
    <Tap say="Hmph! Off we go." sfx="wobble">
      <Goat x={694} y={306} s={0.26} />
      <Person x={722} y={308} s={0.36} look={SHEPHERDS[0]}><GrumpyFace beard={SHEPHERDS[0].beardColor!} /></Person>
      <Goat x={750} y={312} s={0.26} coat="#4a3a33" patch="#2b2422" />
      <Person x={776} y={312} s={0.36} look={SHEPHERDS[1]} blinkDelay={1}><GrumpyFace beard={SHEPHERDS[1].beardColor!} /></Person>
    </Tap>
    <Well x={WELL.x} y={WELL.y} bucket="none" />
    {/* the sheep stand behind the trough, so it's drawn over their noses */}
    <Tap say="Slurp, slurp! Baa! Thank you, Moses!" sfx="chomp">
      <WoolSheep x={426} y={364} s={0.6} head="down" />
      <WoolSheep x={484} y={362} s={0.58} head="down" />
      <WoolSheep x={566} y={364} s={0.6} facing="left" head="down" />
    </Tap>
    <Trough x={TROUGH.x} y={TROUGH.y} w={TROUGH.w} />
    <Pour x1={405} y1={348} x2={415} y2={368} />
    <Tap say="Here you go, thirsty sheep!" sfx="plop">
      <Person x={322} y={430} s={0.96} look={MOSES} pose="point" blinkDelay={1.3}><PouringBucket /></Person>
    </Tap>
    <Tap say="Thank you for helping us, Moses!" sfx="good">
      <Sister i={0} x={168} y={432} s={0.92} pose="wave" blinkDelay={0.4} />
      <Sister i={3} x={102} y={440} s={0.88} pose="arms-up" blinkDelay={1.4} />
      <Sister i={6} x={44} y={436} s={0.86} blinkDelay={2.1} />
    </Tap>
    <Tap say="Thank you for helping us, Moses!" sfx="good">
      <Sister i={1} x={624} y={408} s={0.8} pose="arms-up" blinkDelay={0.9} />
      <Sister i={2} x={686} y={402} s={0.78} blinkDelay={1.9} />
      <Sister i={4} x={656} y={444} s={0.86} pose="arms-up" blinkDelay={0.1} />
      <Sister i={5} x={720} y={440} s={0.86} pose="wave" blinkDelay={2.5} />
    </Tap>
    <Sheep x={768} y={444} s={0.5} facing="left" />
  </Scene>
)

// 5. "The sisters told their father, Jethro, all about kind Moses. Jethro said, 'Come and live with us!' Moses
// married Zipporah, one of the sisters. And he became a shepherd."
// Jethro welcomes Moses at his tent with open arms. Moses, with a shepherd's staff now, stands beside Zipporah
// (a heart over them), with her sisters all around and the sheep.
const Page5 = () => (
  <Scene sky="day" ground="none">
    <MidianLand y={300} />
    <Palm x={40} y={318} s={0.7} />
    <Tent x={600} y={372} s={0.58} />
    {/* the sisters, the big ones at the back and the little ones in front */}
    <Sister i={1} x={136} y={384} s={0.74} pose="wave" blinkDelay={0.5} />
    <Sister i={2} x={196} y={380} s={0.72} blinkDelay={1.7} />
    <Sister i={4} x={476} y={384} s={0.82} pose="arms-up" blinkDelay={2.3} />
    <Tap say="Welcome to our family, Moses!" sfx="good">
      <Sister i={3} x={80} y={436} s={0.86} pose="arms-up" blinkDelay={0.9} />
      <Sister i={5} x={150} y={440} s={0.86} blinkDelay={2.6} />
      <Sister i={6} x={528} y={440} s={0.86} pose="wave" blinkDelay={1.2} />
    </Tap>
    <Tap say="Come and live with us, Moses!" sfx="good">
      <Person x={652} y={430} s={0.98} look={JETHRO} pose="wave" facing="left" blinkDelay={1.5} />
    </Tap>
    <Tap say="Now I am a shepherd!" sfx="ding">
      <Person x={290} y={432} s={1.02} look={MOSES} holding="staff" blinkDelay={0.3} />
    </Tap>
    <Tap say="Moses and Zipporah are married!" sfx="sparkle">
      <Sister i={0} x={368} y={434} s={0.98} facing="left" blinkDelay={2} />
      <Heart x={330} y={232} s={0.9} />
    </Tap>
    <Sheep x={740} y={444} s={0.56} facing="left" />
    <Sheep x={226} y={448} s={0.46} />
  </Scene>
)

// 6. "Moses took good care of Jethro's sheep. One day, he led them far across the desert, all the way to the
// mountain of God."
// Moses walks ahead with his staff, the flock following him across the sand toward the great mountain; a rock
// hyrax watches from the rocks at its foot.
const Page6 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Sun x={110} y={84} s={0.8} />
    <Cloud x={300} y={70} s={0.6} slow />
    <Tap say="This is the mountain of God." sfx="sparkle">
      <MountainOfGod x={610} y={320} w={540} h={292} glow />
      <Sparkles spots={[[600, 30, 8], [646, 56, 6], [560, 60, 5]]} />
    </Tap>
    <Desert />
    <Boulder x={736} y={352} w={92} h={56} />
    <Tap say="Squeak! I live in the rocks." sfx="pop">
      <Hyrax x={736} y={300} s={0.9} facing="left" />
    </Tap>
    <path d="M0 420 Q240 392 470 372 Q600 360 680 340" stroke="#f6e2b6" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.6} />
    <Scrub x={560} y={420} s={0.8} />
    <Tap say="Come along, sheep! Follow me." sfx="ding">
      <Person x={378} y={424} s={0.96} look={MOSES} holding="staff" blinkDelay={0.6} />
    </Tap>
    <Tap say="Baa! Baa! We are coming!" sfx="pop">
      <Sheep x={292} y={428} s={0.56} />
      <Sheep x={216} y={418} s={0.5} />
      <WoolSheep x={150} y={436} s={0.58} head="down" />
      <Goat x={92} y={398} s={0.46} />
      <Sheep x={240} y={448} s={0.4} />
      <Sheep x={58} y={446} s={0.5} />
    </Tap>
  </Scene>
)

/** The slopes of the mountain of God, where the bush is (pages 7 to 11): the mountain behind, and rocky ground. */
const Mountainside = ({ x = 470 }: { x?: number }) => (
  <g>
    <MountainOfGod x={x} y={322} w={860} h={300} />
    <path d="M0 322 Q160 300 360 316 Q560 300 800 314 L800 450 L0 450 Z" fill="#e4b98a" />
    <path d="M0 388 Q220 360 460 380 T800 372 L800 450 L0 450 Z" fill="#ecc896" />
    <Boulder x={70} y={330} w={96} h={50} color="#c4906c" />
    <Boulder x={736} y={336} w={100} h={56} color="#c4906c" flip />
  </g>
)

// 7. "Moses was with his sheep by the mountain of God. Then he saw something very strange. A bush was on fire,
// but it did not burn up!"
// On the mountainside, Moses points in wonder at a bush blazing with bright flames, its leaves still green.
const Page7 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Mountainside />
    <Tap say="The bush is on fire, but it does not burn up! Its leaves are still green." sfx="sparkle">
      <BurningBush x={566} y={366} s={0.92} />
    </Tap>
    <Tap say="Baa?" sfx="pop">
      <WoolSheep x={92} y={432} s={0.6} head="down" />
      <Sheep x={330} y={444} s={0.5} />
    </Tap>
    <Tap say="Look! What is that? A bush on fire!" sfx="ding">
      <Person x={214} y={428} s={1.02} look={MOSES} pose="point" blinkDelay={1}>
        <StaffInLeftHand />
        <MosesWonder />
      </Person>
    </Tap>
  </Scene>
)

// 8. "Moses said, 'I will go closer and see!' Then God called to him from the bush, 'Moses! Moses!' And Moses
// said, 'Here I am!'"
// Closer now: God's voice calls from the light of the bush (soft rings of light), and Moses raises his hand.
const Page8 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Mountainside x={520} />
    <Tap say="God called Moses by his name!" sfx="sparkle">
      <BurningBush x={566} y={384} s={1.18} rays />
      <CallRings x={500} y={250} />
    </Tap>
    <Tap say="Baa!" sfx="pop">
      <Sheep x={96} y={440} s={0.56} />
    </Tap>
    <Tap say="Here I am!" sfx="ding">
      <Person x={262} y={432} s={1.08} look={MOSES} pose="wave" blinkDelay={0.4}>
        <StaffInLeftHand />
      </Person>
    </Tap>
  </Scene>
)

/** Moses' staff, laid down on the ground: from its foot at x1 to its crook at x2, at height y. */
const StaffOnGround = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => <Staff x1={x1} y1={y} x2={x2} y2={y} />

// 9. "God said, 'Take off your sandals, for this is holy ground.' It was a special place, because God was
// there! So Moses took off his sandals."
// Moses kneels barefoot before the bush, his sandals set side by side and his staff laid down beside him.
const Page9 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Mountainside x={540} />
    <Tap say="Holy ground is a special place, because God is there." sfx="sparkle">
      <BurningBush x={590} y={384} s={1.14} rays />
    </Tap>
    <StaffOnGround x1={200} x2={64} y={418} />
    <Tap say="Moses took off his sandals." sfx="pop">
      <Sandals x={236} y={440} s={1.1} />
    </Tap>
    <Tap say="This is holy ground. God is here!" sfx="ding">
      <KneelingBarefoot x={356} y={434} s={1.08} look={MOSES} blinkDelay={0.8} />
    </Tap>
  </Scene>
)

// 10. "God said, 'I have seen how hard My people work in Egypt, and I care about them. I will send you to
// Pharaoh, to bring My people out of Egypt.'"
// Moses kneels and listens; he thinks of God's people working hard in Egypt for Pharaoh, and God's love for
// them (a heart).
const Page10 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Mountainside x={560} />
    <Tap say="God has a plan to help His people." sfx="sparkle">
      <BurningBush x={622} y={386} s={1.08} rays />
    </Tap>
    <StaffOnGround x1={210} x2={74} y={420} />
    <Sandals x={250} y={442} s={1.05} />
    <Tap say="Me? Go and see Pharaoh?" sfx="plop">
      <KneelingBarefoot x={388} y={434} s={1.06} look={MOSES} pose="stand" blinkDelay={1.6}><MosesWonder /></KneelingBarefoot>
    </Tap>
    <Tap say="God sees how hard His people work. And He cares about them!" sfx="sparkle">
      <ThoughtBubble x={196} y={130} w={330} h={190} tail={[[350, 262, 7], [318, 236, 10], [280, 212, 13]]}>
        <Pyramid x={96} y={176} w={92} h={58} />
        <Pyramid x={150} y={178} w={58} h={36} />
        <path d="M58 178 Q196 168 340 176" stroke="#e8c88c" strokeWidth={6} fill="none" strokeLinecap="round" />
        {[[186, 182, 3], [222, 186, 6], [252, 180, 9]].map(([fx, fy, i]) => <TiredFolk key={fx} x={fx} y={fy} s={0.82} i={i} up load />)}
        <Pharaoh x={298} y={184} s={0.44} facing="left" blinkDelay={0.9} />
        <Heart x={196} y={70} s={0.95} />
      </ThoughtBubble>
    </Tap>
  </Scene>
)

// 11. "But Moses was afraid. 'Who am I?' he said. 'I can't do it!' God said, 'I will be with you. And your
// brother Aaron will help you.'"
// Moses stands barefoot, worried. The bush shines on him (God will be with him), and he thinks of his big
// brother Aaron, who will help him.
const Page11 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Mountainside x={560} />
    <Tap say="God said, I will be with you." sfx="sparkle">
      <BurningBush x={622} y={386} s={1.08} rays />
      <Glow x={392} y={330} r={130} color="#fff4c4" />
      <Heart x={500} y={196} s={0.9} />
    </Tap>
    <StaffOnGround x1={210} x2={74} y={420} />
    <Sandals x={250} y={442} s={1.05} />
    <Tap say="Who am I? I can't do it!" sfx="plop">
      <Person x={392} y={434} s={1.06} look={MOSES} blinkDelay={0.5}>
        <BareFeet skin={MOSES.skin} />
        <MosesSad />
      </Person>
    </Tap>
    <Tap say="Your brother Aaron will help you." sfx="good">
      <ThoughtBubble x={190} y={124} w={230} h={200} tail={[[338, 254, 7], [306, 232, 10], [272, 210, 13]]}>
        <Person x={190} y={206} s={0.84} look={AARON} pose="wave" blinkDelay={1.1} />
      </ThoughtBubble>
    </Tap>
  </Scene>
)

/** The child playing, there in the picture (God is with you, too!). */
const Kid = ({ x, y, s }: { x: number; y: number; s: number }) => <Person x={x} y={y} s={s} look={usePlayer().look} pose="arms-up" />

// 12. "Moses trusted God. He took his staff and set off for Egypt, and Aaron came to meet him on the way. God was
// with Moses, and God is with you, too, even when you are afraid!"
// In the desert, with the mountain of God behind, Moses (his staff in his hand and his sandals on again) and
// Aaron meet with joy. And you are there too.
const Page12 = () => (
  <Scene sky="day" ground="none" clouds={false} sun>
    <Cloud x={420} y={70} s={0.6} slow />
    <MountainOfGod x={150} y={300} w={380} h={210} glow />
    <Desert />
    <Footprints x0={318} y0={440} cx={170} cy={432} x1={110} y1={312} n={11} />
    <Footprints x0={488} y0={442} cx={640} cy={430} x1={690} y1={300} n={11} />
    <Scrub x={56} y={420} s={0.7} />
    <Boulder x={740} y={420} w={76} h={42} />
    <Tap say="God is with me. I will not be afraid!" sfx="ding">
      <Person x={350} y={430} s={1.04} look={MOSES} pose="arms-up" holding="staff" blinkDelay={0.6} />
    </Tap>
    <Tap say="Moses, my brother! God sent me to help you!" sfx="good">
      <Person x={452} y={432} s={1.02} look={AARON} pose="arms-up" facing="left" blinkDelay={1.4} />
    </Tap>
    <Heart x={402} y={226} s={0.85} />
    <Heart x={366} y={190} s={0.55} color="#ffcf3f" />
    <Tap say="God is with me, too!" sfx="sparkle">
      <Kid x={640} y={438} s={0.98} />
    </Tap>
  </Scene>
)

export const BURNING_BUSH_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
