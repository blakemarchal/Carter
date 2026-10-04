// Boy Jesus at the Temple: the island's mini-game, Spot it ("Explore God's House"; activities/games/types.ts, SpotKit).
// The busy courts of God's house at the Passover feast: the temple with its great doorway in the middle, porches of
// columns either side, Levites blowing silver trumpets on the steps, and people everywhere. Six things to find, each
// a little hidden in the bustle and changing when it's found:
//   - God's golden lamp, dim in the shade of the doorway: found, its seven flames light up.
//   - two doves, only their heads peeking over the low wall on the porch roof: found, they hop up onto it ("Coo, coo!").
//   - a scroll, rolled up in a niche in the porch wall: found, it opens out, glowing.
//   - a little lamb behind a big water jar, only its face peeking out: found, it steps out ("Baa!").
//   - a teacher on the stone bench, his hands resting on it: found, he holds up an open scroll to teach.
//   - Jesus on the bench beside him, listening: found, He puts up His hand to ask a question, smiling.
// A hiding place (the roof wall, the jar) is drawn in the Picture and drawn again, the same, over what hides behind it
// (in its target's Draw), so a found thing can come out in front of it. Pieces are drawn in board units in a layer of
// their own, so they only use the pa-* and bj-* animations.
import type { ReactNode } from 'react'
import type { At, SpotKit, SpotTarget } from '../../activities/games/types'
import { ink, useShade } from '../kit'
import { Person, SittingOnRock } from '../people'
import { Birds, Cloud, Glow, Scene, WoolSheep } from '../scenes/kit'
import {
  Bench, BOY_JESUS, Colonnade, HeldScroll, JESUS_K, Lampstand, LEVITE, MARBLE_INK, OpenScroll, Paving, pilgrim, RolledScroll,
  SittingDove, Talking, TEACHERS, Temple, Trumpet, Word,
} from '../scenes/boy-jesus'

/** The ground under the porches, and where the bench and the big jar stand. */
const PORCH = 262
const BENCH = { x0: 34, x1: 250, y: 346, s: 0.86 }
const JAR = { x: 610, y: 434 }
/** The niche in the right porch's back wall, where the scroll is kept: its middle, and its floor. */
const NICHE = { x: 741, floor: 248 }

/** Draws `children` (in board units) inside a target's Draw, centred on `at`. */
const Board = ({ at, children }: { at: At; children: ReactNode }) => <g transform={`translate(${-at[0]} ${-at[1]})`}>{children}</g>

/** A happy word popping up by a found thing, at (x, y) in board units (it floats up and fades). */
const Pop = ({ x, y, text }: { x: number; y: number; text: string }) => <g className="bj-word"><Word x={x} y={y} text={text} size={21} /></g>

/** A big clay water jar standing on the floor (its foot at x, y): about 60 wide and 80 tall. */
function BigJar({ x, y }: { x: number; y: number }) {
  const clay = useShade('#d98a5a', 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      <defs>{clay.def}</defs>
      <ellipse cx={0} cy={-1} rx={30} ry={5} fill="#000" opacity={0.12} />
      <path d="M-13 -78 L13 -78 L11 -68 Q32 -56 30 -30 Q28 -4 0 -2 Q-28 -4 -30 -30 Q-32 -56 -11 -68 Z" fill={clay.fill} stroke={ink('#d98a5a')} strokeWidth={2.6} />
      <ellipse cx={0} cy={-78} rx={14} ry={4} fill="#7a3f22" stroke={ink('#d98a5a')} strokeWidth={2} />
      <path d="M-27 -40 Q0 -32 27 -40" stroke="#f2c08a" strokeWidth={3} fill="none" />
      <path d="M-25 -30 Q0 -22 25 -30" stroke="#b5643a" strokeWidth={2} fill="none" opacity={0.7} />
      <ellipse cx={-14} cy={-48} rx={4} ry={9} fill="#fff" opacity={0.25} />
    </g>
  )
}

/** The niche in the porch wall: a little dark arch with a stone sill. */
const Niche = () => (
  <g strokeLinejoin="round">
    <path d={`M${NICHE.x - 24} ${NICHE.floor + 4} V${NICHE.floor - 36} Q${NICHE.x} ${NICHE.floor - 64} ${NICHE.x + 24} ${NICHE.floor - 36} V${NICHE.floor + 4} Z`} fill="#b99a6a" stroke="#9a7a4a" strokeWidth={2} />
    <path d={`M${NICHE.x - 18} ${NICHE.floor} V${NICHE.floor - 34} Q${NICHE.x} ${NICHE.floor - 56} ${NICHE.x + 18} ${NICHE.floor - 34} V${NICHE.floor} Z`} fill="#6b4c32" />
    <rect x={NICHE.x - 27} y={NICHE.floor} width={54} height={7} rx={2} fill="#efe1bf" stroke="#c4aa78" strokeWidth={1.8} />
  </g>
)

/**
 * Someone at the feast, standing: [x, feet y, size, which look, facing left, child]. Back to front. The rows are staggered,
 * each person in a gap of the row in front, so nobody's feet are hidden behind a head in front of them (and nobody stands
 * in front of a Levite's feet, on a tap circle, or with a basket on someone's head).
 */
const CROWD: [number, number, number, number, boolean?, boolean?][] = [
  [340, 296, 0.5, 3], [452, 294, 0.5, 9, true], [588, 300, 0.5, 4, true],
  [280, 350, 0.6, 1], [392, 352, 0.62, 12], [530, 348, 0.62, 7, true],
  [674, 438, 0.84, 10, true], [742, 440, 0.8, 5, true, true],
  [318, 444, 0.84, 8], [392, 446, 0.66, 11, false, true], [470, 444, 0.84, 13, true],
]

// ---------- The picture ----------

function Picture() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={120} y={44} s={0.55} />
      <Birds spots={[[214, 40, 0.8], [238, 30, 0.6]]} />
      <Paving y={PORCH - 6} />
      <Colonnade x0={-10} x1={250} y={PORCH} h={150} cols={[20, 98, 176, 236]} />
      <Colonnade x0={550} x1={810} y={PORCH} h={150} cols={[564, 624, 702, 780]} back={<Niche />} />
      <Temple x={400} y={252} s={0.92} />
      <g className="bj-still">
        <Person x={302} y={236} s={0.48} look={LEVITE} pose="wave" blinkDelay={0.6}><Trumpet /></Person>
        <Person x={498} y={236} s={0.48} look={LEVITE} pose="wave" facing="left" blinkDelay={1.6}><Trumpet /></Person>
      </g>
      <Bench x0={BENCH.x0} x1={BENCH.x1} y={BENCH.y} s={BENCH.s} />
      <BigJar x={JAR.x} y={JAR.y} />
      {CROWD.map(([x, y, s, i, left, child], k) => (
        <Person key={k} x={x} y={y} s={s} look={pilgrim(i, child)} facing={left ? 'left' : 'right'}
          pose={!child && i % 5 === 1 ? 'arms-up' : child && i % 2 ? 'wave' : 'stand'} holding={!child && i % 4 === 3 ? 'basket' : undefined} blinkDelay={(k * 0.43) % 2.2} />
      ))}
    </Scene>
  )
}

// ---------- The things to find (each centred on its spot: hidden, then found) ----------

/** Where each one is (its tap circle's middle). */
const SPOTS = {
  lamp: [400, 192] as At,
  doves: [700, 68] as At,
  scroll: [NICHE.x, 222] as At,
  lamb: [584, 406] as At,
  teacher: [88, 292] as At,
  jesus: [196, 298] as At,
}

/** God's golden lamp in the doorway of God's house: dim in the shade, then lit. */
function Lamp({ found }: { found: boolean }) {
  return (
    <Board at={SPOTS.lamp}>
      {/* (lit, its warm light fills the doorway) */}
      {found && <Glow x={400} y={176} r={74} color="#ffe39a" />}
      <Lampstand x={400} y={232} s={0.52} lit={found} glow={86} />
    </Board>
  )
}

/** Two doves on the porch roof: their heads peeking over its low wall, then up on top of it ("Coo, coo!"). */
function Doves({ found }: { found: boolean }) {
  return (
    <Board at={SPOTS.doves}>
      {found ? (
        <g>
          <SittingDove x={680} y={77} s={0.72} blinkDelay={0.3} />
          <SittingDove x={722} y={77} s={0.72} facing="left" blinkDelay={1.1} />
          <Pop x={700} y={36} text="Coo, coo!" />
        </g>
      ) : (
        <g>
          <SittingDove x={680} y={89} s={0.72} blinkDelay={0.3} />
          <SittingDove x={724} y={89} s={0.72} facing="left" blinkDelay={1.1} />
          {/* the low wall along the porch roof, drawn again in front of them */}
          <rect x={640} y={76} width={124} height={13} fill="#f1e7d0" />
          <path d="M640 77 H764" stroke={MARBLE_INK} strokeWidth={2} />
          <path d="M640 89 H764" stroke={MARBLE_INK} strokeWidth={2.5} />
        </g>
      )}
    </Board>
  )
}

/** A scroll, rolled up in the niche in the shade; then open in front of it, glowing. */
function Scroll({ found }: { found: boolean }) {
  return (
    <Board at={SPOTS.scroll}>
      {found ? (
        <g>
          <Glow x={NICHE.x} y={222} r={54} color="#fff3c0" />
          <OpenScroll x={NICHE.x} y={222} s={0.92} />
        </g>
      ) : (
        <g>
          <RolledScroll x={NICHE.x} y={NICHE.floor - 6} s={0.6} />
          <rect x={NICHE.x - 18} y={NICHE.floor - 14} width={36} height={14} fill="#3a2414" opacity={0.25} />
        </g>
      )}
    </Board>
  )
}

/** A little lamb behind the big jar, only its face peeking out; then out in front of it ("Baa!"). */
function Lamb({ found }: { found: boolean }) {
  return (
    <Board at={SPOTS.lamb}>
      {found ? (
        <g>
          <WoolSheep x={552} y={442} s={0.66} />
          <Pop x={566} y={360} text="Baa!" />
        </g>
      ) : (
        <g>
          <WoolSheep x={598} y={432} s={0.58} facing="left" />
          <BigJar x={JAR.x} y={JAR.y} />
        </g>
      )}
    </Board>
  )
}

/**
 * The teacher on the bench, his hands resting on it; then holding up an open scroll, to teach God's word. (Nothing in his
 * hands before he's found, so the only scroll to find is the one in the niche.)
 */
function Teacher({ found }: { found: boolean }) {
  const look = TEACHERS[0]
  return (
    <Board at={SPOTS.teacher}>
      <SittingOnRock x={88} y={BENCH.y} s={BENCH.s} look={look} pose={found ? 'hold' : 'stand'} blinkDelay={0.5}
        front={found ? <HeldScroll skin={look.skin} /> : undefined} />
    </Board>
  )
}

/** Jesus on the bench beside the teacher, listening; then His hand up to ask a question, smiling, in a soft glow. */
function Jesus({ found }: { found: boolean }) {
  const k = BENCH.s * JESUS_K
  // (His feet: the seat is as high as a grown-up's knees, so His feet don't quite reach the ground)
  const feet = BENCH.y - 30 * BENCH.s + 30 * 0.74 * k
  return (
    <Board at={SPOTS.jesus}>
      {found && <Glow x={196} y={276} r={64} color="#fff3c0" />}
      <g className="bj-still">
        <SittingOnRock x={196} y={feet} s={k} look={BOY_JESUS} pose={found ? 'wave' : 'stand'} blinkDelay={0.2}>{found && <Talking />}</SittingOnRock>
      </g>
    </Board>
  )
}

const target = (id: string, at: At, r: number, say: string, Draw: SpotTarget['Draw']): SpotTarget => ({ id, at, r, say, Draw })

export const BOY_JESUS_GAME: SpotKit = {
  Picture,
  targets: [
    target('lamp', SPOTS.lamp, 48, "God's golden lamp! It shines so bright.", Lamp),
    target('doves', SPOTS.doves, 50, 'Two white doves! Coo, coo!', Doves),
    target('scroll', SPOTS.scroll, 46, "A scroll! It has God's word in it.", Scroll),
    target('lamb', SPOTS.lamb, 50, 'A little lamb! Baa!', Lamb),
    target('teacher', SPOTS.teacher, 50, "A teacher! He teaches God's word.", Teacher),
    target('jesus', SPOTS.jesus, 50, 'Jesus! He loves to listen and learn in God\'s house.', Jesus),
  ],
}
