// Samuel Listens: one picture per story page, both parts in order (see data/samuel.ts for the words).
// Built from the kit (./kit.tsx) and people (../people.tsx). God is never drawn as a person: His
// presence is light. Night in God's house is cozy, never spooky: the lamps glow, the stars twinkle.
// New here, for any island to reuse:
//   people: HANNAH (Samuel's mom), ELI (old Eli the priest: draw him with <Eli>, or EliOnSeat / EliInBed,
//           which add his bushy white eyebrows and the gold band on his white head wrap), YOUNG_SAMUEL (the
//           boy in the teal coat his mom made him) and SAMUEL_GROWN (the same, grown up: on the David island
//           he is old, in a teal robe too);
//   props:  GodsHouse (God's house at Shiloh, from outside), Seat (Eli's seat by its door), Bed (a bed, with
//           someone sitting up in it), and inside God's house at night: GoldWall, Veil, Pillar, NightFloor,
//           NightWindow, Rug, HallWide (the whole house, also the game's backdrop); from ../items/isl-samuel:
//           GoldenLampstand (God's lamp), ClayLamp and LittleCoat.
import { useId, type ComponentProps, type ComponentType, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Baby, Person, SKIN, type Look, type Pose } from '../people'
import { Cloud, Flower, Glow, Rays, Scene, Sparkles, Sun, Tap, Tree, sparkle } from './kit'
import { usePlayer } from './player'
import { Kneel } from './daniel'
import { SittingOnRock } from './david'
import { ThoughtBubble } from './abraham'
import { COAT_TEAL, ClayLamp, GoldenLampstand, LittleCoat, SAMUEL_BLANKET } from '../items/isl-samuel'
import './samuel.css'

const uidOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')
type PersonProps = ComponentProps<typeof Person>
type At = [number, number]

const GOLD = '#f2c440', GOLD_INK = '#a8761c'
const BLUE = '#3b56a8', PURPLE = '#7b4fa0', SCARLET = '#c8433f'

// ---------- The people ----------

/** Hannah, Samuel's mom: a mint-green head scarf and a coral robe. */
export const HANNAH: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#86cdb2', robe: '#e2725b', sash: '#fff1d6' }
/**
 * Old Eli, the priest of God's house: a white linen head wrap with a little gold plate on its front, a long white
 * beard, bushy white eyebrows and a purple robe with a gold sash. Draw him with <Eli> (or EliOnSeat, EliInBed):
 * they add the plate and the eyebrows.
 */
export const ELI: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#ece8e0', wrap: '#fbf8f1', beard: 'long', beardColor: '#f7f4ee', robe: '#7b5aa6', sash: '#f0c24a' }
/** Young Samuel: short dark hair, and the little teal coat his mom made him (a new one every year), with a gold sash. */
export const YOUNG_SAMUEL: Look = { skin: SKIN.medium, hair: 'short', hairColor: '#3b2a20', robe: COAT_TEAL, sash: '#f2c94c', build: 'child' }
/**
 * Samuel grown up: the same dark hair, teal robe and gold sash, and now a short dark beard. (On the David island,
 * scenes/david.tsx, he's old: a long white beard, a brown head cloth and a teal robe.)
 */
export const SAMUEL_GROWN: Look = { ...YOUNG_SAMUEL, build: 'adult', beard: 'short', beardColor: '#3b2a20' }

/** Eli's face and head wrap, in Person's own units: a little gold plate on the front of his white head wrap, and bushy white eyebrows. */
export const EliTrim = () => (
  <g>
    <rect x={-8} y={-133} width={16} height={6.5} rx={2.2} fill="#f2c94c" stroke="#b8901c" strokeWidth={1.3} />
    <g fill="#ffffff" stroke="#a89f92" strokeWidth={1.3} strokeLinejoin="round">
      <path d="M-17.5 -118.6 Q-14.5 -126.8 -3.4 -123.4 Q-8.5 -120.6 -17.5 -118.6 Z" />
      <path d="M17.5 -118.6 Q14.5 -126.8 3.4 -123.4 Q8.5 -120.6 17.5 -118.6 Z" />
    </g>
  </g>
)

/** Old Eli, standing. */
export function Eli({ children, ...p }: Omit<PersonProps, 'look'>) {
  return <Person {...p} look={ELI}><EliTrim />{children}</Person>
}

/** A surprised little "oh!" mouth, in Person's own units (over the smile of someone without a beard). */
const Oh = () => <ellipse cx={0} cy={-103.6} rx={3.4} ry={4.2} fill="#6b2a3a" stroke="#4a1a28" strokeWidth={1} />

/** A big sleepy yawn over Eli's beard, in Person's own units. */
const Yawn = () => (
  <g className="sm-yawn">
    <ellipse cx={0} cy={-97} rx={5} ry={6.4} fill="#6b2a3a" stroke="#4a1a28" strokeWidth={1.2} />
  </g>
)

/** A hand over something held, so it shows gripping it (Person's own units). */
const Grip = ({ x, y, skin }: { x: number; y: number; skin: string }) => <circle cx={x} cy={y} r={7} fill={skin} stroke={ink(skin)} strokeWidth={2} />

/** Something in a picture to tap, when it has a line to say (else just the thing). */
const Tappable = ({ say, sfx, children }: { say?: string; sfx?: string; children: ReactNode }) => (say ? <Tap say={say} sfx={sfx}>{children}</Tap> : <>{children}</>)

/** A little floating heart. */
function Heart({ x, y, s = 1, d = 0 }: { x: number; y: number; s?: number; d?: number }) {
  return (
    <g className="sc-float" style={{ animationDelay: `${d}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 13 C-20 0 -17 -17 -7 -17 C-3 -17 0 -14 0 -10 C0 -14 3 -17 7 -17 C17 -17 20 0 0 13 Z" fill="#ff6f91" stroke="#d94a6e" strokeWidth={2.5} strokeLinejoin="round" />
        <ellipse cx={-8} cy={-9} rx={3.6} ry={2.2} fill="#fff" opacity={0.65} transform="rotate(-35 -8 -9)" />
      </g>
    </g>
  )
}

// ---------- God's house, from outside (by day) ----------

/**
 * God's house at Shiloh: a long house of gold-covered boards under a big red covering, with the woven blue,
 * purple and red curtains showing under its edge. In the middle of its front, the doorway glows with warm light,
 * its striped curtains tied back to golden posts. (x, y) = the middle of its front, on the ground; about 500 wide
 * and 230 tall at s = 1 (the doorway is 160 tall: a grown-up is 150).
 */
export function GodsHouse({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const id = uidOf(useId())
  const boards = useShade('#d9ab5e', 0.25, 0.15)
  const roof = useShade('#a8473a', 0.22, 0.2)
  const door = 'M-56 -14 L-56 -150 Q0 -176 56 -150 L56 -14 Z'
  const drape = 'M-57 -151 L-25 -153 Q-36 -114 -46 -90 Q-33 -54 -37 -14 L-58 -14 Z'
  const scallops = Array.from({ length: 15 }, (_, i) => {
    const xa = 248 - i * (496 / 15)
    return `Q${(xa - 248 / 15).toFixed(1)} -140 ${(xa - 496 / 15).toFixed(1)} -152`
  }).join(' ')
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <defs>
        {boards.def}{roof.def}
        <linearGradient id={`${id}in`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6d4" /><stop offset="1" stopColor="#f3c869" /></linearGradient>
        <clipPath id={`${id}d`}><path d={drape} /><path d={drape} transform="scale(-1 1)" /></clipPath>
      </defs>
      {/* the stone floor it stands on */}
      <rect x={-252} y={-16} width={504} height={16} rx={4} fill="#e9d8b4" stroke="#bfa678" strokeWidth={2.5} />
      {[-196, -128, -76, 76, 128, 196].map((jx) => <path key={jx} d={`M${jx} -14 v12`} stroke="#cdb88c" strokeWidth={2} />)}
      {/* the walls: wooden boards covered with gold */}
      <rect x={-232} y={-178} width={464} height={164} fill={boards.fill} stroke="#9a6e2e" strokeWidth={3} />
      {Array.from({ length: 18 }, (_, i) => -232 + (i + 1) * (464 / 19)).map((bx) => <path key={bx} d={`M${bx.toFixed(1)} -150 V-16`} stroke="#b88a3e" strokeWidth={2} />)}
      {/* the woven curtains under the covering: blue, purple and red */}
      <rect x={-240} y={-168} width={480} height={24} fill={BLUE} />
      <rect x={-240} y={-152} width={480} height={6} fill={PURPLE} />
      <rect x={-240} y={-146} width={480} height={4} fill={SCARLET} />
      {/* the big red covering over the top, scalloped at its edge */}
      <path d={`M-248 -152 C-252 -208 -222 -232 -160 -232 L160 -232 C222 -232 252 -208 248 -152 ${scallops} Z`} fill={roof.fill} stroke="#6e2a22" strokeWidth={3} />
      <path d="M-206 -216 Q0 -224 206 -216" stroke="#c96a58" strokeWidth={3} fill="none" opacity={0.6} />
      {/* the corner posts */}
      {[-234, 234].map((px) => (
        <g key={px}>
          <rect x={px - 7} y={-150} width={14} height={136} fill="#8a5a2e" stroke="#5e3a1a" strokeWidth={2} />
          <rect x={px - 9} y={-26} width={18} height={10} rx={2} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} />
        </g>
      ))}
      {/* the doorway: warm golden light inside, and the floor going in */}
      <path d={door} fill={`url(#${id}in)`} />
      <path d="M-55 -14 L55 -14 L36 -44 L-36 -44 Z" fill="#e9c27a" opacity={0.55} />
      <Sparkles spots={[[-18, -96, 5], [20, -118, 4], [6, -70, 4]]} color="#ffffff" />
      <path d={door} fill="none" stroke="#7a5228" strokeWidth={3} />
      {/* its curtains, striped, tied back to each side */}
      <g clipPath={`url(#${id}d)`}>
        {Array.from({ length: 28 }, (_, i) => <rect key={i} x={-60 + i * 4.4} y={-160} width={4.6} height={150} fill={[BLUE, PURPLE, SCARLET, '#f8f2e4'][i % 4]} />)}
      </g>
      {[-1, 1].map((d) => <path key={d} d={drape} transform={`scale(${d} 1)`} fill="none" stroke="#3a2a4a" strokeWidth={2} />)}
      {[-1, 1].map((d) => <ellipse key={d} cx={d * 45} cy={-90} rx={7} ry={4} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} />)}
      {/* the golden door posts and the beam over them */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={d * 63 - 7} y={-168} width={14} height={154} fill="#e8b84a" stroke={GOLD_INK} strokeWidth={2.2} />
          <path d={`M${d * 63 - 2.5} -164 V-18`} stroke="#fff1a8" strokeWidth={2} opacity={0.8} />
        </g>
      ))}
      <rect x={-76} y={-178} width={152} height={13} rx={4} fill={GOLD} stroke={GOLD_INK} strokeWidth={2.2} />
      {/* a step up to the door */}
      <rect x={-74} y={-6} width={148} height={10} rx={3} fill="#f1e3c4" stroke="#bfa678" strokeWidth={2.2} />
      <Sparkles spots={[[-30, -196, 7], [34, -204, 6], [0, -222, 8]]} color="#fff6c0" />
    </g>
  )
}

/** Eli's wooden seat by the door of God's house. Draw him on it with EliOnSeat (its seat is 30 up, as SittingOnRock's is). (x, y): the ground under it. */
export function Seat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wood = '#9a6a3a', light = '#b98048', line = '#5e3a1a'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      {/* its back: two posts and two rails, behind whoever sits there */}
      {[-25, 25].map((px) => <rect key={px} x={px - 4} y={-104} width={8} height={104} rx={3} fill={wood} stroke={line} strokeWidth={2} />)}
      <rect x={-31} y={-112} width={62} height={12} rx={5} fill={light} stroke={line} strokeWidth={2} />
      <rect x={-28} y={-76} width={56} height={7} rx={3} fill={light} stroke={line} strokeWidth={1.8} />
      {/* the seat, and the front legs */}
      <rect x={-34} y={-36} width={68} height={9} rx={3} fill={light} stroke={line} strokeWidth={2} />
      {[-29, 29].map((px) => <rect key={px} x={px - 3.5} y={-28} width={7} height={28} rx={2} fill={wood} stroke={line} strokeWidth={1.8} />)}
    </g>
  )
}

/** Old Eli sitting on his seat by the door of God's house. (x, y): the ground under the seat. */
export function EliOnSeat({ x, y, s = 1, pose = 'stand', blinkDelay = 0 }: { x: number; y: number; s?: number; pose?: Pose; blinkDelay?: number }) {
  return (
    <g>
      <Seat x={x} y={y} s={s} />
      <SittingOnRock x={x} y={y} s={s} look={ELI} pose={pose} blinkDelay={blinkDelay}><EliTrim /></SittingOnRock>
    </g>
  )
}

/** A broom of twigs tied to a stick, leaning to the right. (x, y): the foot of its twigs. */
function Broom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 -28 L36 -128" stroke="#6b4628" strokeWidth={7} />
      <path d="M8 -28 L36 -128" stroke="#a8743f" strokeWidth={4} />
      <path d="M-8 0 L24 2 L16 -32 L4 -33 Z" fill="#e2c26a" stroke="#a8842e" strokeWidth={2} />
      {[-2, 4, 10, 16].map((bx) => <path key={bx} d={`M${bx} -2 L${bx / 2 + 7} -28`} stroke="#c9a040" strokeWidth={1.4} />)}
      <path d="M4 -26 L16 -25" stroke="#8a4a2a" strokeWidth={3} />
    </g>
  )
}

/** The green hills of Shiloh under a blue sky (each page adds its own clouds). */
const DayHills = ({ children }: { children?: ReactNode }) => (
  <Scene sky="day" ground="hills" clouds={false}>{children}</Scene>
)

// ---------- Hannah's home (by day) ----------

/** Inside Hannah's home: plaster walls, wooden beams, a sunny window with its shutters open, and a wooden floor. */
function HomeInside({ children }: { children?: ReactNode }) {
  const id = uidOf(useId())
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3c4" stopOpacity={0.6} /><stop offset="1" stopColor="#fff3c4" stopOpacity={0.08} /></linearGradient>
      </defs>
      <rect width={800} height={340} fill="#f2dcb2" />
      {[[130, 110, 70], [330, 240, 90], [720, 90, 60], [250, 60, 40]].map(([bx, by, r], i) => <ellipse key={i} cx={bx} cy={by} rx={r} ry={r * 0.6} fill="#f8e8c8" opacity={0.7} />)}
      <rect width={800} height={26} fill="#8a6040" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={40 + i * 92} cy={34} r={9} fill="#7a5233" stroke="#5a3a20" strokeWidth={2} />)}
      {/* the window, with the sun and a cloud, its shutters open */}
      <rect x={520} y={78} width={128} height={110} rx={6} fill="#a8e0ff" stroke="#a8804a" strokeWidth={5} />
      <Sun x={560} y={118} s={0.42} />
      <Cloud x={612} y={150} s={0.3} />
      <path d="M584 80 L584 186" stroke="#8a6040" strokeWidth={5} />
      {[-1, 1].map((d) => <rect key={d} x={d < 0 ? 476 : 652} y={84} width={40} height={100} rx={4} fill="#6fa86a" stroke="#4a7a46" strokeWidth={3} />)}
      <rect x={510} y={186} width={148} height={10} rx={3} fill="#c9a06a" stroke="#a8804a" strokeWidth={2} />
      {/* a shelf with clay jars */}
      <rect x={110} y={150} width={150} height={10} rx={3} fill="#a8743f" stroke="#6b4628" strokeWidth={2} />
      {[[136, 1], [178, 0.8], [222, 1.1]].map(([jx, k]) => (
        <g key={jx} transform={`translate(${jx} 150) scale(${k})`}>
          <path d="M-9 -34 L9 -34 L8 -28 Q22 -20 19 -5 Q15 1 0 1 Q-15 1 -19 -5 Q-22 -20 -8 -28 Z" fill="#d38a58" stroke="#8a4a26" strokeWidth={2} />
          <ellipse cx={0} cy={-34} rx={9} ry={2.6} fill="#8a4a26" />
        </g>
      ))}
      {/* the floor */}
      <rect y={340} width={800} height={110} fill="#d9b47e" />
      <rect y={334} width={800} height={8} fill="#b8925a" />
      {[372, 410].map((fy) => <path key={fy} d={`M0 ${fy} H800`} stroke="#c49d68" strokeWidth={2} />)}
      {/* the sunshine falling in */}
      <path d="M526 192 L644 192 L470 448 L230 448 Z" fill={`url(#${id}b)`} />
      {children}
    </Scene>
  )
}

/** A little stool (Hannah sits on it with SittingOnRock at the same x, y and s: its seat is 30 up). */
function Stool({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-26, 26].map((px) => <rect key={px} x={px - 4} y={-30} width={8} height={30} rx={2} fill="#9a6a3a" stroke="#5e3a1a" strokeWidth={1.8} />)}
      <rect x={-36} y={-36} width={72} height={10} rx={4} fill="#b98048" stroke="#5e3a1a" strokeWidth={2} />
    </g>
  )
}

/** A wooden cradle on rockers, with a little mattress and a soft blanket. (x, y): the floor under it. */
function Cradle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wood = '#b07a44', line = '#6b4628'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={0} cy={-2} rx={66} ry={6} fill="#000" opacity={0.12} />
      <path d="M-62 -10 Q0 8 62 -10" stroke={line} strokeWidth={8} fill="none" />
      <path d="M-62 -10 Q0 8 62 -10" stroke={wood} strokeWidth={5} fill="none" />
      {[-34, 34].map((px) => <path key={px} d={`M${px} -2 L${px * 0.9} -22`} stroke={line} strokeWidth={6} />)}
      <path d="M-58 -64 L-50 -20 Q0 -14 50 -20 L58 -64 Q0 -50 -58 -64 Z" fill={wood} stroke={line} strokeWidth={2.6} />
      {[-36, -18, 0, 18, 36].map((px) => <path key={px} d={`M${px} -54 L${px * 0.94} -22`} stroke={darken(wood, 0.18)} strokeWidth={2} />)}
      <path d="M-58 -64 Q0 -50 58 -64" stroke={line} strokeWidth={3} fill="none" />
      <path d="M-52 -64 Q-30 -76 -8 -64 Q20 -74 52 -64 Q20 -58 -52 -64 Z" fill={SAMUEL_BLANKET} stroke={ink(SAMUEL_BLANKET)} strokeWidth={2} />
    </g>
  )
}

/** A basket of soft wool (teal, gold and red) with a spindle, for spinning and weaving. (x, y): the floor under it. */
function WoolBasket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <path d="M8 -34 L34 -74" stroke="#8a5a2e" strokeWidth={3.4} strokeLinecap="round" />
      <ellipse cx={30} cy={-67} rx={7} ry={4} fill="#f2c94c" stroke="#b8901c" strokeWidth={1.6} transform="rotate(-58 30 -67)" />
      {[[-14, -34, COAT_TEAL], [6, -38, '#f2c94c'], [20, -32, '#e2725b']].map(([bx, by, c]) => (
        <g key={bx as number}>
          <circle cx={bx as number} cy={by as number} r={12} fill={c as string} stroke={ink(c as string)} strokeWidth={2} />
          <path d={`M${(bx as number) - 8} ${(by as number) - 4} Q${bx} ${(by as number) + 6} ${(bx as number) + 8} ${(by as number) - 6}`} stroke={lighten(c as string, 0.35)} strokeWidth={1.6} fill="none" />
        </g>
      ))}
      <path d="M-30 -28 L30 -28 L24 0 L-24 0 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2.4} />
      <path d="M-28 -18 L28 -18 M-26 -9 L26 -9" stroke="#8a5428" strokeWidth={1.8} />
    </g>
  )
}

// ---------- Inside God's house, at night ----------

/** The gold-covered boards of the walls inside God's house, at night (a soft violet dusk over them), from x0 to x1 and down to `base` (the floor), with a woven band of blue, purple and red along the top. */
export function GoldWall({ x0 = 0, x1 = 800, base }: { x0?: number; x1?: number; base: number }) {
  const id = `gw${uidOf(useId())}`
  const xs = Array.from({ length: Math.floor((x1 - x0) / 32) + 1 }, (_, i) => x0 + 16 + i * 32).filter((bx) => bx < x1)
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a64" stopOpacity={0.5} />
          <stop offset="1" stopColor="#3a2a64" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <rect x={x0} y={0} width={x1 - x0} height={base} fill="#c4934f" />
      {xs.map((bx) => (
        <g key={bx}>
          <path d={`M${bx} 34 V${base}`} stroke="#9a6c38" strokeWidth={2.4} />
          <path d={`M${bx + 3.5} 34 V${base}`} stroke="#e4bc7a" strokeWidth={1.3} opacity={0.55} />
        </g>
      ))}
      <rect x={x0} y={0} width={x1 - x0} height={base} fill={`url(#${id})`} />
      <rect x={x0} y={0} width={x1 - x0} height={20} fill="#334c98" />
      <rect x={x0} y={20} width={x1 - x0} height={7} fill="#6c4590" />
      <rect x={x0} y={27} width={x1 - x0} height={5} fill="#b13c39" />
      {xs.filter((_, i) => i % 2 === 0).map((tx) => <circle key={tx} cx={tx + 16} cy={36} r={3} fill="#e8b84a" stroke={GOLD_INK} strokeWidth={1} />)}
    </g>
  )
}

/** Warm plaster walls (Eli's room), at night, from x0 to x1 and down to `base`. */
function PlasterWall({ x0 = 0, x1 = 800, base }: { x0?: number; x1?: number; base: number }) {
  const id = `pw${uidOf(useId())}`
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a64" stopOpacity={0.48} />
          <stop offset="1" stopColor="#3a2a64" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <rect x={x0} y={0} width={x1 - x0} height={base} fill="#e6c899" />
      {[[0.2, 0.3, 60], [0.55, 0.62, 80], [0.85, 0.22, 50], [0.4, 0.85, 40]].map(([fx, fy, r], i) => (
        <ellipse key={i} cx={x0 + (x1 - x0) * fx} cy={base * fy} rx={r} ry={r * 0.6} fill="#d4b080" opacity={0.3} />
      ))}
      <rect x={x0} y={0} width={x1 - x0} height={base} fill={`url(#${id})`} />
      <rect x={x0} y={0} width={x1 - x0} height={20} fill="#6e4a2c" />
    </g>
  )
}

/**
 * The big curtain inside God's house, woven blue with little gold stars and a purple and red border, hanging
 * in folds from a gold rod (God's lamp stands in front of it). From x0 to x1, from its rod at `top` to `base`.
 */
export function Veil({ x0, x1, top, base }: { x0: number; x1: number; top: number; base: number }) {
  const w = x1 - x0
  const n = Math.max(4, Math.round(w / 28))
  const fold = w / n
  return (
    <g>
      <rect x={x0} y={top} width={w} height={base - top} fill="#2f4a96" />
      {Array.from({ length: n }, (_, i) => <rect key={i} x={x0 + i * fold + fold * 0.2} y={top} width={fold * 0.4} height={base - top} fill="#3c5bad" />)}
      {Array.from({ length: n }, (_, i) => [0, 1, 2, 3, 4].map((j) => {
        const sy = top + 30 + j * 46 + (i % 2) * 23
        return sy < base - 44 ? <path key={`${i}-${j}`} d={sparkle(x0 + (i + 0.5) * fold, sy, 4)} fill="#e8c25a" opacity={0.8} /> : null
      }))}
      <rect x={x0} y={base - 34} width={w} height={12} fill="#6c4590" />
      <rect x={x0} y={base - 22} width={w} height={8} fill="#b13c39" />
      <path d={`M${x0} ${base - 34} H${x1} M${x0} ${base - 14} H${x1}`} stroke="#e8c25a" strokeWidth={2.5} />
      <path d={`M${x0} ${top} V${base} M${x1} ${top} V${base}`} stroke="#22357a" strokeWidth={2} />
      <rect x={x0 - 12} y={top - 9} width={w + 24} height={9} rx={4.5} fill={GOLD} stroke={GOLD_INK} strokeWidth={2} />
      {Array.from({ length: n + 1 }, (_, i) => <circle key={i} cx={x0 + i * fold} cy={top + 1} r={4} fill="none" stroke={GOLD_INK} strokeWidth={2} />)}
    </g>
  )
}

/** A woven hanging on the wall, in the colors of God's house (blue, purple, red and gold), on a gold rod. (x, y): the middle of its rod; w wide, h long. */
function WallHanging({ x, y, w = 76, h = 108 }: { x: number; y: number; w?: number; h?: number }) {
  const bands = [BLUE, PURPLE, SCARLET, '#e8b84a', BLUE]
  return (
    <g strokeLinejoin="round">
      <rect x={x - w / 2} y={y + 3} width={w} height={h} rx={3} fill="#efe2c4" stroke="#b8925a" strokeWidth={2} />
      {bands.map((c, i) => <rect key={i} x={x - w / 2} y={y + 13 + i * 19} width={w} height={9} fill={c} opacity={0.9} />)}
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${x - w / 2 + 8 + i * ((w - 16) / 6)} ${y + h + 3} v10`} stroke="#d8c39a" strokeWidth={3} strokeLinecap="round" />)}
      <rect x={x - w / 2 - 7} y={y - 3} width={w + 14} height={7} rx={3.5} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} />
    </g>
  )
}

/** A wooden pillar with gold at its top and foot (inside God's house), from `top` down to `base`. */
export function Pillar({ x, top = 36, base }: { x: number; top?: number; base: number }) {
  return (
    <g>
      <rect x={x - 11} y={top} width={22} height={base - top} fill="#8a5a30" stroke="#5a3a1c" strokeWidth={2.5} />
      <path d={`M${x - 4} ${top + 6} V${base - 6}`} stroke="#b07a48" strokeWidth={3} opacity={0.7} />
      <rect x={x - 15} y={top - 2} width={30} height={12} rx={3} fill={GOLD} stroke={GOLD_INK} strokeWidth={2} />
      <rect x={x - 15} y={base - 10} width={30} height={12} rx={3} fill={GOLD} stroke={GOLD_INK} strokeWidth={2} />
    </g>
  )
}

/** A wooden floor at night, from y0 down to the bottom of the picture. */
export function NightFloor({ y0 }: { y0: number }) {
  const h = 450 - y0
  const rows = [0.15, 0.35, 0.6, 0.88].map((f) => Math.round(y0 + h * f))
  return (
    <g>
      <rect x={0} y={y0} width={800} height={h} fill="#a5764c" />
      {rows.map((ry, r) => (
        <g key={ry}>
          <path d={`M0 ${ry} H800`} stroke="#87603c" strokeWidth={2} />
          {Array.from({ length: 6 }, (_, i) => {
            const jx = 60 + i * 140 + (r % 2) * 70
            return <path key={i} d={`M${jx} ${r ? rows[r - 1] : y0} V${ry}`} stroke="#87603c" strokeWidth={1.6} />
          })}
        </g>
      ))}
      <rect x={0} y={y0 - 4} width={800} height={7} fill="#6e4a2c" />
    </g>
  )
}

/** A woven rug lying on the floor, seen a little from above: its middle at (x, y), w wide and h deep. */
export function Rug({ x, y, w, h, color = '#b8433f' }: { x: number; y: number; w: number; h: number; color?: string }) {
  const t = w * 0.05
  const quad = (inset: number) => {
    const hw = w / 2 - inset, hh = h / 2 - inset * 0.5
    return `M${x - hw + t} ${y - hh} L${x + hw - t} ${y - hh} L${x + hw} ${y + hh} L${x - hw} ${y + hh} Z`
  }
  return (
    <g strokeLinejoin="round">
      <path d={quad(0)} fill={color} stroke={ink(color)} strokeWidth={2.5} />
      <path d={quad(9)} fill="none" stroke="#f0c75a" strokeWidth={3} />
      <path d={quad(16)} fill="none" stroke={lighten(color, 0.3)} strokeWidth={2} />
      <path d={`M${x} ${y - h * 0.3} L${x + w * 0.1} ${y} L${x} ${y + h * 0.3} L${x - w * 0.1} ${y} Z`} fill="#f0c75a" stroke={ink('#f0c75a')} strokeWidth={1.6} />
      {[-1, 1].map((d) => Array.from({ length: 5 }, (_, i) => {
        const fy = y - h / 2 + 4 + (i * (h - 8)) / 4
        const ex = x + d * (w / 2 - t * (1 - (i / 4))) // (the fringe along each end)
        return <path key={`${d}${i}`} d={`M${ex} ${fy} l${d * 6} 0`} stroke="#f2e2c0" strokeWidth={2.4} strokeLinecap="round" />
      }))}
    </g>
  )
}

/** A window at night: an arched opening with the moon and twinkling stars, in a wooden frame with a sill. (x, y): its top left; w by h. */
export function NightWindow({ x, y, w, h, moon = 0.36 }: { x: number; y: number; w: number; h: number; moon?: number }) {
  const id = `nw${uidOf(useId())}`
  const r = w / 2
  const d = `M${x} ${y + h} L${x} ${y + r} A${r} ${r} 0 0 1 ${x + w} ${y + r} L${x + w} ${y + h} Z`
  const stars: [number, number, number][] = [[0.74, 0.32, 5], [0.22, 0.72, 3.8], [0.64, 0.74, 3.4], [0.86, 0.58, 3.8], [0.46, 0.2, 3.2], [0.3, 0.46, 2.8]]
  const k = w / 100
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f1b52" /><stop offset="1" stopColor="#433a9e" /></linearGradient>
        <clipPath id={`${id}c`}><path d={d} /></clipPath>
      </defs>
      <path d={d} fill={`url(#${id}s)`} />
      <g clipPath={`url(#${id}c)`}>
        {/* (the moon: a crescent with a soft halo) */}
        <g transform={`translate(${x + w * moon} ${y + h * 0.42}) scale(${k * 0.62})`}>
          <circle r={56} fill="#fff3c0" opacity={0.16} />
          <path d="M-6 -36 A36 36 0 1 0 34 10 A30 30 0 0 1 -6 -36 Z" fill="#fff3b0" stroke="#e8d27a" strokeWidth={3} />
        </g>
        {stars.map(([fx, fy, sr], i) => <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={sparkle(x + w * fx, y + h * fy, sr * k)} fill="#fff8d0" />)}
      </g>
      <path d={d} fill="none" stroke="#5e3c22" strokeWidth={9} />
      <path d={d} fill="none" stroke="#9a6a3a" strokeWidth={4} />
      <rect x={x - 10} y={y + h - 3} width={w + 20} height={11} rx={3} fill="#a8743f" stroke="#5e3c22" strokeWidth={2.5} />
    </g>
  )
}

/** Moonlight falling through a window onto the floor: from the window's foot (x0 to x1, at y) to the floor (fx0 to fx1, at fy). */
function Moonbeam({ x0, x1, y, fx0, fx1, fy }: { x0: number; x1: number; y: number; fx0: number; fx1: number; fy: number }) {
  const id = `mb${uidOf(useId())}`
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e3e8ff" stopOpacity={0.3} /><stop offset="1" stopColor="#e3e8ff" stopOpacity={0.05} /></linearGradient></defs>
      <path d={`M${x0} ${y} L${x1} ${y} L${fx1} ${fy} L${fx0} ${fy} Z`} fill={`url(#${id})`} />
    </g>
  )
}

/** A soft pool of warm lamplight (over the walls and floor, under the people). */
export function Warmth({ x, y, r, o = 0.45, color = '#ffd27a' }: { x: number; y: number; r: number; o?: number; color?: string }) {
  const id = `wm${uidOf(useId())}`
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={o} />
          <stop offset="0.5" stopColor={color} stopOpacity={o * 0.4} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  )
}

/** Night in a room: a soft violet dusk, a little deeper toward the corners (cozy, never dark). */
function Dusk() {
  const id = `dk${uidOf(useId())}`
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="50%" cy="60%" r="75%">
          <stop offset="0.4" stopColor="#24184a" stopOpacity={0} />
          <stop offset="1" stopColor="#24184a" stopOpacity={0.38} />
        </radialGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
    </g>
  )
}

// ---------- Beds ----------

/**
 * Someone sitting up in bed: their look, size (as Person's s), pose, eyes and which way they face. `children` go
 * on the Person; `front` too (in the Person's own units), but over the quilt (a book held on the lap).
 */
export interface Sitter { look: Look; k?: number; pose?: Pose; eyes?: 'open' | 'sleepy' | 'shut'; facing?: 'left' | 'right'; blinkDelay?: number; children?: ReactNode; front?: ReactNode }

const QUILTS = { samuel: '#7d8fd6', eli: '#7fb27a' }

/**
 * A wooden bed seen from the side, its head end on the left: a headboard, a lower footboard, a soft mattress,
 * a plump pillow and a patchwork quilt. `who`: someone sitting up in it, leaning back on the pillow with the quilt
 * over their legs; with nobody in it, the quilt is thrown back (they've just jumped up). (x, y) = the floor under
 * the middle of the bed, which is `w` long.
 */
export function Bed({ x, y, s = 1, w = 220, quilt = QUILTS.samuel, who }: { x: number; y: number; s?: number; w?: number; quilt?: string; who?: Sitter }) {
  const id = uidOf(useId())
  const q = useShade(quilt, 0.28, 0.16)
  const wood = useShade('#b07a44', 0.25, 0.2)
  const x0 = -w / 2, x1 = w / 2, top = -50
  const eff = who ? (who.k ?? 1) * (who.look.build === 'child' ? 0.74 : 1) : 1
  const sx = x0 + 40 + 30 * eff // (the middle of whoever sits up in it)
  const legs = 92 * eff
  const knee = sx + legs * 0.5, toe = Math.min(sx + legs, x1 - 18)
  const kh = 10 + 12 * eff // (how high the knees lift the quilt)
  const cover = who
    ? `M${sx - 34} ${top + 1} C${sx - 10} ${top - 6} ${knee - 30} ${top - 4} ${knee - 12} ${top - kh} C${knee - 2} ${top - kh - 5} ${knee + 12} ${top - kh - 2} ${knee + 22} ${top - 8} `
      + `C${toe - 16} ${top - 2} ${toe - 12} ${top - 12} ${toe} ${top - 11} C${x1 - 12} ${top - 10} ${x1 - 6} ${top - 4} ${x1 - 6} ${top + 4} L${x1 - 4} -20 Q${(x1 + sx) / 2} -13 ${sx - 38} -20 Z`
    : `M${x0 + w * 0.36} ${top + 2} C${x0 + w * 0.34} ${top - 14} ${x0 + w * 0.44} ${top - 22} ${x0 + w * 0.52} ${top - 12} `
      + `C${x0 + w * 0.6} ${top - 4} ${x1 - 24} ${top - 5} ${x1 - 6} ${top + 3} L${x1 - 4} -20 Q${x0 + w * 0.68} -13 ${x0 + w * 0.36 - 4} -20 Z`
  const eyes = who?.eyes === 'sleepy' ? 'sm-sleepy' : who?.eyes === 'shut' ? 'sm-shut' : undefined
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <defs>
        {q.def}{wood.def}
        <clipPath id={`${id}q`}><path d={cover} /></clipPath>
        <clipPath id={`${id}p`}><rect x={x0 - 80} y={-400} width={w + 160} height={400 + top + 3} /></clipPath>
      </defs>
      <ellipse cx={0} cy={-1} rx={w / 2 + 12} ry={7} fill="#000" opacity={0.16} />
      {/* the headboard and the footboard */}
      <path d={`M${x0 - 6} 0 L${x0 - 6} -98 Q${x0 + 3} -112 ${x0 + 12} -98 L${x0 + 12} 0 Z`} fill={wood.fill} stroke="#6b4628" strokeWidth={2.4} />
      <circle cx={x0 + 3} cy={-108} r={5} fill="#c98a50" stroke="#6b4628" strokeWidth={2} />
      <path d={`M${x1 - 12} 0 L${x1 - 12} -66 Q${x1 - 3} -78 ${x1 + 6} -66 L${x1 + 6} 0 Z`} fill={wood.fill} stroke="#6b4628" strokeWidth={2.4} />
      <circle cx={x1 - 3} cy={-74} r={4.4} fill="#c98a50" stroke="#6b4628" strokeWidth={2} />
      {/* the side of the bed, and the mattress on it */}
      <rect x={x0 + 4} y={-40} width={w - 10} height={22} rx={3} fill={wood.fill} stroke="#6b4628" strokeWidth={2.4} />
      <rect x={x0 + 8} y={top} width={w - 18} height={13} rx={6} fill="#f6eddc" stroke="#d6c3a2" strokeWidth={2} />
      {/* the pillow: plumped up behind whoever sits up, or lying flat */}
      {who
        ? <ellipse cx={x0 + 26} cy={top - 22} rx={17} ry={27} fill="#fbf6ec" stroke="#d6c3a2" strokeWidth={2.2} transform={`rotate(-10 ${x0 + 26} ${top - 22})`} />
        : <ellipse cx={x0 + 38} cy={top - 7} rx={27} ry={11} fill="#fbf6ec" stroke="#d6c3a2" strokeWidth={2.2} />}
      {who && (
        <g clipPath={`url(#${id}p)`}>
          <g className={eyes}>
            <Person x={sx} y={top + 2 + 50 * eff} s={who.k ?? 1} look={who.look} pose={who.pose ?? 'stand'} facing={who.facing ?? 'right'} blinkDelay={who.blinkDelay ?? 0}>{who.children}</Person>
          </g>
        </g>
      )}
      {/* the patchwork quilt */}
      <path d={cover} fill={q.fill} stroke={ink(quilt)} strokeWidth={2.6} />
      <g clipPath={`url(#${id}q)`}>
        {Array.from({ length: Math.ceil(w / 22) + 2 }, (_, i) => Array.from({ length: 4 }, (_, j) => (i + j) % 2 ? null : (
          <rect key={`${i}-${j}`} x={x0 - 10 + i * 22} y={top - 40 + j * 22} width={22} height={22} fill={lighten(quilt, 0.22)} opacity={0.55} />
        )))}
        <path d={`M${x0} -26 H${x1}`} stroke={lighten(quilt, 0.45)} strokeWidth={3} strokeDasharray="6 5" />
      </g>
      <path d={cover} fill="none" stroke={ink(quilt)} strokeWidth={2.6} />
      {who?.front && (
        <g transform={`translate(${sx} ${top + 2 + 50 * eff}) scale(${who.facing === 'left' ? -eff : eff} ${eff})`}>{who.front}</g>
      )}
    </g>
  )
}

/** Eli's little lamp, burning on a shelf on the wall (above the head of his bed). (x, y): the middle of the shelf's top. */
export function EliLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-24 2 L-20 14 M24 2 L20 14" stroke="#6b4628" strokeWidth={4} strokeLinecap="round" />
      <rect x={-32} y={0} width={64} height={8} rx={3} fill="#a8743f" stroke="#6b4628" strokeWidth={2} />
      <ClayLamp x={-6} y={0} s={0.9} lit glow={46} />
    </g>
  )
}

/** Where Eli's lamp shelf is, from the middle of his bed's floor line (in the bed's units). */
export const ELI_LAMP: At = [-62, -168]

/**
 * Old Eli sitting up in his bed (its head on the left), and his little lamp burning on its shelf on the wall above
 * (`lamp` false: without it, when the wall behind draws it). `eyes` and `pose` as for Sitter; `yawn` opens his mouth
 * in a big sleepy yawn. (x, y): the floor under the middle of the bed, which is 190 long at s = 1.
 */
export function EliInBed({ x, y, s = 1, pose = 'stand', eyes = 'open', yawn, lamp = true, children }: {
  x: number; y: number; s?: number; pose?: Pose; eyes?: Sitter['eyes']; yawn?: boolean; lamp?: boolean; children?: ReactNode
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {lamp && <EliLamp x={ELI_LAMP[0]} y={ELI_LAMP[1]} />}
      <Bed x={0} y={0} w={190} quilt={QUILTS.eli} who={{ look: ELI, pose, eyes, facing: 'left', blinkDelay: 0.8, children: <><EliTrim />{yawn && <Yawn />}{children}</> }} />
    </g>
  )
}

/** Young Samuel sitting up in his little bed (its head on the left). (x, y): the floor under the middle of the bed; it's 200 long at s = 1. */
function SamuelInBed({ x, y, s = 1, pose = 'stand', eyes = 'open', children }: { x: number; y: number; s?: number; pose?: Pose; eyes?: Sitter['eyes']; children?: ReactNode }) {
  return <Bed x={x} y={y} s={s} w={200} quilt={QUILTS.samuel} who={{ look: YOUNG_SAMUEL, k: 1.25, pose, eyes, blinkDelay: 0.3, children }} />
}

// ---------- The night views ----------

/** By Samuel's little bed, at night (pages 6 and 10): the window over his bed with the moon and stars, and God's golden lamp glowing in front of the big curtain. */
function SamuelsCorner({ children, lamp, win }: { children?: ReactNode; lamp?: ReactNode; win?: string }) {
  return (
    <Scene sky="night" ground="none" stars={false} clouds={false}>
      <GoldWall base={300} />
      <Tappable say={win} sfx="sparkle"><NightWindow x={86} y={72} w={116} h={130} /></Tappable>
      <Veil x0={436} x1={716} top={66} base={300} />
      <Pillar x={760} base={300} />
      <NightFloor y0={300} />
      <Moonbeam x0={94} x1={196} y={204} fx0={130} fx1={360} fy={430} />
      <Rug x={250} y={420} w={380} h={46} />
      <Dusk />
      <Warmth x={580} y={150} r={300} o={0.5} />
      {lamp}
      {children}
    </Scene>
  )
}

/** Where God's lamp stands by Samuel's corner (pages 6 and 10). */
const CornerLamp = () => <GoldenLampstand x={580} y={300} s={1.25} />

/**
 * Eli's room at night (pages 7 and 9): warm plaster walls, a window with the moon and stars, and on the left the
 * open doorway Samuel ran in through, its curtain tied back: through it, far away in the hall, God's lamp glows.
 * `lamp`: where Eli's lamp is, to light up the wall around it. `zoom`: a closer look, k times as big, centred on (cx, cy).
 */
function ElisRoom({ children, lamp, zoom, win }: { children?: ReactNode; lamp: At; zoom?: { k: number; cx: number; cy: number }; win?: string }) {
  const id = uidOf(useId())
  const door = 'M38 306 L38 150 Q108 104 178 150 L178 306 Z'
  return (
    <Scene sky="night" ground="none" stars={false} clouds={false}>
      <defs>
        <clipPath id={`${id}d`}><path d={door} /></clipPath>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9a556" /><stop offset="1" stopColor="#f2cf86" /></linearGradient>
      </defs>
      <g transform={zoom ? `translate(400 225) scale(${zoom.k}) translate(${-zoom.cx} ${-zoom.cy})` : undefined}>
        <PlasterWall base={306} />
        {/* through the doorway: the hall's gold walls and floor, and God's lamp far away, glowing */}
        <g clipPath={`url(#${id}d)`}>
          <rect x={30} y={96} width={160} height={214} fill={`url(#${id}g)`} />
          {[56, 84, 112, 140, 168].map((bx) => <path key={bx} d={`M${bx} 100 V262`} stroke="#b8843e" strokeWidth={2} opacity={0.5} />)}
          <rect x={30} y={262} width={160} height={48} fill="#c3935c" />
          <path d="M30 262 H190" stroke="#8a6040" strokeWidth={2.5} />
          <Warmth x={108} y={196} r={96} o={0.75} color="#fff1b8" />
          <GoldenLampstand x={108} y={262} s={0.44} />
        </g>
        <path d={door} fill="none" stroke="#7a5228" strokeWidth={6} />
        <path d="M176 152 Q208 196 200 240 Q190 262 198 306 L178 306 L178 150 Z" fill={SCARLET} stroke="#7a2422" strokeWidth={2} />
        <path d="M186 172 Q200 200 194 238" stroke="#e8a090" strokeWidth={2} fill="none" />
        <ellipse cx={196} cy={240} rx={6} ry={4} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.4} />
        <Tappable say={win} sfx="sparkle"><NightWindow x={606} y={96} w={108} h={122} /></Tappable>
        <NightFloor y0={306} />
        <Rug x={440} y={420} w={470} h={48} color="#3f6aa8" />
        <Dusk />
        <Warmth x={lamp[0]} y={lamp[1] - 16} r={240} o={0.5} />
        {children}
      </g>
    </Scene>
  )
}

/** The way Samuel runs to Eli, through the whole house (the game): from beside his bed, winding along the hall, to beside Eli's. */
export const HALL_PATH: At[] = [[196, 334], [236, 356], [282, 372], [330, 376], [378, 362], [424, 340], [470, 332], [514, 344], [552, 352], [580, 340], [596, 324]]
/** How high the way is at x (straight between its points). */
const wayAt = (x: number) => {
  const i = Math.max(0, HALL_PATH.findIndex((p, k) => k > 0 && p[0] >= x) - 1)
  const [a, b] = [HALL_PATH[i], HALL_PATH[i + 1] ?? HALL_PATH[i]]
  return a[1] + (b[1] - a[1]) * (b[0] === a[0] ? 0 : (x - a[0]) / (b[0] - a[0]))
}
/** A lamp's stand: from the floor just behind the way (36 below its middle, where Samuel's middle is) up to the lamp, just over his head. */
export const LAMP_STAND = 100
/** The little clay lamps along the way, on their stands (where each lamp is). */
export const HALL_LAMPS: At[] = [332, 384, 436, 488, 540].map((x) => [x, Math.round(wayAt(x) + 36 - LAMP_STAND)])
/** Where Eli's bed is in the whole house (the middle of its floor line), and its size. */
export const ELI_BED = { x: 706, y: 386, s: 0.84 }
/** The floor under the middle of Samuel's little bed in the whole house, and its size. */
const SAMUEL_BED = { x: 92, y: 388, s: 0.78 }

/**
 * A little clay lamp on a tall stand (in the hall): a three-footed stand down to the floor `h` below the lamp,
 * a dish on top, and the lamp in it, `lit` or not. (0, 0) = the lamp's middle (a piece, for the game).
 */
export function LampOnStand({ h, lit }: { h: number; lit?: boolean }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {lit && <ellipse cx={4} cy={h} rx={34} ry={8} fill="#ffd98a" opacity={0.3} />}
      <path d={`M0 10 L0 ${h - 6}`} stroke="#5a3a1c" strokeWidth={6} />
      <path d={`M0 10 L0 ${h - 6}`} stroke="#9a6a3a" strokeWidth={3.4} />
      <path d={`M-14 ${h} L0 ${h - 12} L14 ${h} M0 ${h - 12} L0 ${h}`} stroke="#5a3a1c" strokeWidth={4} fill="none" />
      <ellipse cx={0} cy={9} rx={16} ry={4} fill="#b88a50" stroke="#5a3a1c" strokeWidth={2} />
      <ClayLamp x={-3} y={8} s={0.82} lit={lit} glow={58} />
    </g>
  )
}

/**
 * The whole of God's house at night, seen from the side (page 8, and the game's backdrop): Samuel's little bed
 * under its window on the left (empty: he has just jumped up), God's golden lamp in front of the big curtain, the
 * hall, and Eli's room on the right, through its doorway (a pillar, its curtain tied back), with its own window
 * and Eli's lamp on its shelf (`eliLamp`). Eli's bed is drawn on top (EliInBed, at ELI_BED). `warm` (0 to 1): how
 * warmly the hall is lit. `lamp`: drawn in place of God's lamp (to tap it).
 */
export function HallWide({ warm = 1, eliLamp = true, lamp, bed, children }: { warm?: number; eliLamp?: boolean; lamp?: ReactNode; bed?: string; children?: ReactNode }) {
  return (
    <Scene sky="night" ground="none" stars={false} clouds={false}>
      <GoldWall x0={0} x1={572} base={292} />
      <PlasterWall x0={572} x1={800} base={292} />
      <NightWindow x={40} y={66} w={86} h={100} />
      <NightWindow x={694} y={84} w={80} h={94} moon={0.62} />
      <Veil x0={176} x1={300} top={58} base={292} />
      <WallHanging x={436} y={80} />
      <NightFloor y0={292} />
      <Moonbeam x0={46} x1={122} y={166} fx0={50} fx1={190} fy={400} />
      <Rug x={390} y={414} w={400} h={44} />
      <Rug x={700} y={414} w={170} h={40} color="#3f6aa8" />
      <Dusk />
      <Warmth x={238} y={150} r={210} o={0.5} />
      <Warmth x={420} y={250} r={240} o={0.32 * warm} />
      <Warmth x={ELI_BED.x + ELI_LAMP[0] * ELI_BED.s} y={ELI_BED.y + ELI_LAMP[1] * ELI_BED.s - 30} r={170} o={0.4} />
      {lamp ?? <GoldenLampstand x={238} y={292} s={0.86} />}
      {/* the doorway into Eli's room: a pillar, and its curtain tied back */}
      <Pillar x={572} top={36} base={292} />
      <path d="M584 44 Q618 100 606 160 Q598 196 608 292 L586 292 L586 44 Z" fill={SCARLET} stroke="#7a2422" strokeWidth={2} />
      <path d="M594 70 Q610 110 600 158" stroke="#e8a090" strokeWidth={2} fill="none" />
      <ellipse cx={605} cy={160} rx={6} ry={4} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.4} />
      {eliLamp && <EliLamp x={ELI_BED.x + ELI_LAMP[0] * ELI_BED.s} y={ELI_BED.y + ELI_LAMP[1] * ELI_BED.s} s={ELI_BED.s} />}
      <Tappable say={bed} sfx="pop"><Bed x={SAMUEL_BED.x} y={SAMUEL_BED.y} s={SAMUEL_BED.s} w={200} quilt={QUILTS.samuel} /></Tappable>
      {children}
    </Scene>
  )
}

// ---------- Story pages: part one ----------

// 1. "Long ago, there was a woman named Hannah. She wanted a baby very much. One day at God's house, she
// prayed and prayed. 'Please, God, give me a baby boy. He will serve You all his life.'"
// Hannah kneeling to pray in front of God's house, dreaming of a baby; old Eli on his seat by its door.
const Page1 = () => (
  <DayHills>
    <Sun x={724} y={68} s={0.62} />
    <Cloud x={430} y={62} s={0.62} slow />
    <Tree x={86} y={326} s={0.82} />
    <Tap say="This is God's house." sfx="sparkle">
      <GodsHouse x={570} y={330} s={0.78} />
    </Tap>
    <Tap say="Hello! I am Eli, the priest." sfx="pop">
      <EliOnSeat x={690} y={356} s={0.84} blinkDelay={1.4} />
    </Tap>
    <Tap say="Please, God, give me a baby boy." sfx="good">
      <g className="sm-shut"><Kneel x={312} y={418} s={1.3} look={HANNAH} pose="pray" /></g>
    </Tap>
    <Tap say="A baby! Hannah wanted a baby so much." sfx="sparkle">
      <ThoughtBubble x={160} y={120} w={196} h={136} tail={[[276, 254, 7], [248, 226, 10], [216, 192, 13]]}>
        <Baby x={166} y={126} s={1.25} blanket={SAMUEL_BLANKET} />
        <Heart x={112} y={98} s={0.5} />
        <Heart x={218} y={92} s={0.42} d={0.8} />
      </ThoughtBubble>
    </Tap>
    {[[40, 430, '#ff8cc0'], [470, 438, '#ffd34d'], [770, 430, '#ffffff'], [560, 420, '#ff8cc0']].map(([fx, fy, c]) => <Flower key={fx as number} x={fx as number} y={fy as number} color={c as string} />)}
  </DayHills>
)

// 2. "Old Eli the priest saw Hannah praying. He said, 'Go in peace. May God give you what you asked for.'
// And Hannah was not sad anymore."
// Eli, up from his seat, raising his hand to bless her; Hannah glad, with hearts.
const Page2 = () => (
  <DayHills>
    <Cloud x={120} y={64} s={0.7} />
    <Cloud x={420} y={46} s={0.55} slow />
    <Tree x={92} y={350} s={0.84} />
    <GodsHouse x={560} y={350} s={1.02} />
    <Seat x={716} y={378} s={1.02} />
    <Tap say="Go in peace!" sfx="sparkle">
      <Eli x={612} y={424} s={1.16} pose="wave" facing="left" blinkDelay={0.9} />
    </Tap>
    <Tap say="Thank you, Eli!" sfx="good">
      <Person x={318} y={428} s={1.18} look={HANNAH} pose="hold" />
    </Tap>
    <Tap say="Hannah is happy now." sfx="pop">
      <g>
        <Heart x={250} y={214} s={1.05} />
        <Heart x={378} y={186} s={0.8} d={0.6} />
        <Heart x={318} y={150} s={0.6} d={1.2} />
      </g>
    </Tap>
    <Sparkles spots={[[520, 250, 7], [440, 216, 6], [600, 196, 5]]} color="#fffbe0" />
    {[[60, 432, '#ff8cc0'], [180, 440, '#ffd34d'], [760, 436, '#ffffff']].map(([fx, fy, c]) => <Flower key={fx as number} x={fx as number} y={fy as number} color={c as string} />)}
  </DayHills>
)

// 3. "God heard Hannah's prayer! Soon she had a baby boy. She named him Samuel, because she said, 'I asked
// God for him.'"
// At home, the sun shining in on Hannah and baby Samuel in her arms; his cradle, and her basket of wool.
const Page3 = () => (
  <HomeInside>
    <Tap say="The sun is shining in. God heard Hannah's prayer!" sfx="sparkle">
      <Sparkles spots={[[480, 236, 8], [420, 200, 6], [540, 290, 6], [470, 330, 7]]} color="#fffbe0" />
    </Tap>
    <Tap say="A little bed for baby Samuel." sfx="pop"><Cradle x={640} y={432} s={1.1} /></Tap>
    <Tap say="Soft wool, for making clothes." sfx="pop"><WoolBasket x={104} y={436} s={1.2} /></Tap>
    <Tap say="Thank You, God, for baby Samuel!" sfx="good">
      <Stool x={356} y={442} s={1.5} />
      <SittingOnRock x={356} y={442} s={1.5} look={HANNAH} pose="hold" blinkDelay={0.6}>
        {/* (one hand cradling his head, behind it; the other on his blanket) */}
        <Grip x={-25} y={-59} skin={HANNAH.skin} />
        <Baby x={2} y={-64} s={0.98} blanket={SAMUEL_BLANKET} />
        <Grip x={24} y={-60} skin={HANNAH.skin} />
      </SittingOnRock>
    </Tap>
    <Heart x={262} y={180} s={0.86} />
    <Heart x={446} y={150} s={0.66} d={0.9} />
  </HomeInside>
)

/** A dirt path up the hill to God's house. */
const PathUp = () => (
  <path d="M120 450 C220 420 380 396 470 372 Q520 360 548 346 L640 346 Q600 368 560 384 C470 414 380 436 330 450 Z" fill="#ead6a4" stroke="#d6bd84" strokeWidth={2.5} strokeLinejoin="round" />
)

// 4. "When Samuel was old enough, Hannah kept her promise. She brought him to God's house, to help old Eli
// and learn all about God."
// Hannah and little Samuel coming up the path to God's house; Eli at the door, welcoming them.
const Page4 = () => (
  <DayHills>
    <Cloud x={120} y={60} s={0.66} />
    <Cloud x={380} y={44} s={0.5} slow />
    <Tree x={62} y={330} s={0.86} />
    <GodsHouse x={594} y={340} s={0.86} />
    <PathUp />
    <Tap say="Welcome, Samuel!" sfx="pop">
      <Eli x={598} y={376} s={1.0} pose="arms-up" facing="left" blinkDelay={1.1} />
    </Tap>
    <Tap say="Here we are, Samuel. This is God's house." sfx="good">
      <Person x={262} y={430} s={1.18} look={HANNAH} blinkDelay={0.4} />
    </Tap>
    <Tap say="Hello, Eli!" sfx="pop">
      <Person x={352} y={420} s={0.84} look={YOUNG_SAMUEL} pose="wave" blinkDelay={1.7} />
    </Tap>
    {[[30, 438, '#ffd34d'], [180, 444, '#ff8cc0'], [770, 432, '#ff8cc0'], [700, 444, '#ffd34d']].map(([fx, fy, c]) => <Flower key={fx as number} x={fx as number} y={fy as number} color={c as string} />)}
  </DayHills>
)

// 5. "Samuel helped Eli in God's house. Every year, Hannah came to visit. She brought him a new little coat
// she had made, just his size!"
// Hannah, come to visit, kneeling to hold up the new coat; Samuel (bigger now) so happy; his broom by the step
// of God's house, and Eli smiling on his seat by its door.
const Page5 = () => (
  <DayHills>
    <Cloud x={560} y={58} s={0.66} />
    <Cloud x={740} y={84} s={0.5} slow />
    <GodsHouse x={206} y={338} s={0.84} />
    <Tap say="Samuel is a good helper." sfx="pop"><EliOnSeat x={318} y={366} s={0.9} blinkDelay={1.3} /></Tap>
    <Tap say="Swish, swish! Samuel sweeps God's house." sfx="swish"><Broom x={104} y={366} s={0.9} /></Tap>
    <Tap say="A new coat, just my size! Thank you!" sfx="pop">
      <Person x={446} y={428} s={1.06} look={YOUNG_SAMUEL} pose="arms-up" blinkDelay={0.5} />
    </Tap>
    <Tap say="I made it just for you!" sfx="good">
      {/* (she holds it up by its collar, out toward Samuel) */}
      <Kneel x={600} y={422} s={1.2} look={HANNAH} pose="point" facing="left">
        <LittleCoat x={56} y={-60} s={0.72} />
        <Grip x={54} y={-90} skin={HANNAH.skin} />
      </Kneel>
    </Tap>
    <Heart x={520} y={232} s={0.72} />
    <Heart x={586} y={204} s={0.56} d={0.7} />
    {[[660, 440, '#ff8cc0'], [760, 432, '#ffd34d'], [40, 436, '#ffffff']].map(([fx, fy, c]) => <Flower key={fx as number} x={fx as number} y={fy as number} color={c as string} />)}
  </DayHills>
)

/** Arcs of sound by someone's ear at (x, y), coming and going one after another: someone is calling them. */
const Calling = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => {
  const a = Math.PI / 4.2
  const arc = (r: number) => `M${(x + r * Math.cos(-a)).toFixed(1)} ${(y + r * Math.sin(-a)).toFixed(1)} A${r} ${r} 0 0 1 ${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`
  return (
    <g fill="none" strokeLinecap="round">
      {[26, 44, 62].map((r, i) => (
        <g key={r} className="sm-pulse" style={{ animationDelay: `${-0.6 * (2 - i)}s` }}>
          <path d={arc(r * s)} stroke="#6a4a8a" strokeWidth={8} opacity={0.35} />
          <path d={arc(r * s)} stroke="#fff4c8" strokeWidth={4.5} />
        </g>
      ))}
    </g>
  )
}

// 6. "One night, God's lamp was still glowing, and Samuel was fast asleep in God's house. Then he heard
// someone call, 'Samuel!'"
// Samuel sitting up in his little bed, surprised; God's lamp glowing; the moon and stars in the window.
const Page6 = () => (
  <SamuelsCorner lamp={<Tap say="God's lamp is still glowing." sfx="ding"><CornerLamp /></Tap>} win="Twinkle, twinkle! The moon and the stars are out.">
    <Sparkles spots={[[300, 214, 6], [336, 250, 5], [286, 168, 4]]} color="#fff8d6" />
    <Tap say="Who is calling me?" sfx="pop">
      <SamuelInBed x={232} y={426} s={1.28}><Oh /></SamuelInBed>
    </Tap>
    <Calling x={216} y={290} s={1.15} />
  </SamuelsCorner>
)

// ---------- Story pages: part two ----------

// 7. "In the night, Samuel heard someone call his name. He ran to Eli and said, 'Here I am! You called me.'
// But Eli said, 'I did not call you. Go back to bed.'"
// Eli's room: Samuel beside the bed with his arms out; Eli sitting up, sleepy.
const Page7 = () => (
  <ElisRoom lamp={[464, 221]} win="The moon is shining.">
    <Tap say="I did not call you. Go back to bed." sfx="pop">
      <EliInBed x={540} y={426} s={1.22} eyes="sleepy" />
    </Tap>
    <Tap say="Here I am! You called me." sfx="good">
      <Person x={318} y={432} s={1.3} look={YOUNG_SAMUEL} pose="arms-up" blinkDelay={0.4} />
    </Tap>
  </ElisRoom>
)

/** Samuel running: leaning forward, one arm reaching out ahead, his feet off the floor, with speed lines behind. (x, y): the floor under him. */
function RunningSamuel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={30} ry={6} fill="#000" opacity={0.16} />
      <g stroke="#fff6d8" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.75}>
        <path d="M-50 -88 h-36" /><path d="M-56 -62 h-46" /><path d="M-48 -36 h-30" />
      </g>
      <g transform="translate(0 -9) rotate(9)">
        <Person x={0} y={0} s={1.3} look={YOUNG_SAMUEL} pose="point" blinkDelay={0.2} />
      </g>
    </g>
  )
}

// 8. "So Samuel lay down again. Then he heard it again: 'Samuel!' He ran to Eli. 'Here I am!' But Eli said,
// 'I did not call you, my son. Lie down again.'"
// The whole house: Samuel's bed empty, Samuel running past God's lamp to Eli, who sits up in bed with a big yawn.
const Page8 = () => (
  <HallWide lamp={<Tap say="God's lamp is still glowing." sfx="ding"><GoldenLampstand x={238} y={292} s={0.86} /></Tap>} bed="Samuel's bed is empty!">
    <Tap say="Yawn! Lie down again, my son." sfx="pop">
      <EliInBed x={ELI_BED.x} y={ELI_BED.y} s={ELI_BED.s} eyes="sleepy" yawn lamp={false} />
    </Tap>
    <Tap say="Here I come, Eli!" sfx="whoosh">
      <RunningSamuel x={440} y={434} s={0.92} />
    </Tap>
  </HallWide>
)

// 9. "Then it happened a third time! Now Eli understood. God was calling Samuel! Eli said, 'Go and lie down.
// If He calls you, say, Speak, Lord. I am listening.'"
// Eli's room again: Eli wide awake now, his hand raised; Samuel close by, listening.
const Page9 = () => (
  <ElisRoom lamp={[470, 221]} zoom={{ k: 1.24, cx: 446, cy: 268 }}>
    <Tap say="It is God who is calling you, Samuel!" sfx="sparkle">
      <EliInBed x={546} y={426} s={1.22} pose="wave" />
    </Tap>
    <Sparkles spots={[[572, 196, 7], [632, 232, 5], [520, 176, 5]]} color="#fff8d6" />
    <Tap say="What should I say, Eli?" sfx="pop">
      <Person x={346} y={432} s={1.3} look={YOUNG_SAMUEL} pose="hold" blinkDelay={0.4} />
    </Tap>
  </ElisRoom>
)

// 10. "Samuel lay down. Then God came and called, just like before: 'Samuel! Samuel!' And Samuel said,
// 'Speak, Lord. I am listening.'"
// God's light (never a person) shining by Samuel's bed; Samuel sitting up, hands together, listening.
const Page10 = () => (
  <SamuelsCorner lamp={<Tap say="God's lamp is glowing." sfx="ding"><CornerLamp /></Tap>}>
    <Tap say="God came and called, Samuel! Samuel!" sfx="sparkle">
      <g>
        <Rays x={404} y={230} r={320} n={16} color="#fff3c0" opacity={0.28} />
        <Glow x={404} y={230} r={160} color="#fff6d0" />
        <Glow x={404} y={230} r={70} color="#ffffff" />
        <Sparkles spots={[[364, 152, 8], [458, 178, 7], [410, 110, 6], [336, 236, 5], [476, 262, 6], [430, 304, 5]]} color="#fffbe0" />
      </g>
    </Tap>
    <Tap say="Speak, Lord. I am listening." sfx="good">
      <SamuelInBed x={232} y={426} s={1.28} pose="pray" />
    </Tap>
    <Heart x={318} y={246} s={0.6} d={0.4} />
  </SamuelsCorner>
)

// 11. "God spoke to Samuel, and Samuel listened. Samuel grew up, and God was with him. He told everyone
// what God said."
// Samuel grown up, in front of God's house in God's light, telling the people; they listen, and old Eli smiles.
/** God's people, come to listen to Samuel (page 11): moms and dads and children. */
const LISTENERS: Look[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8dcc0', beard: 'short', beardColor: '#3b2a20', robe: '#c98448', sash: '#6b8f5a' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#9fc6ea', robe: '#d9708a', sash: '#fff1d6' },
  { skin: SKIN.deep, hair: 'curly', hairColor: '#1f1712', robe: '#f2b33d', sash: '#ffffff', build: 'child' },
  { skin: SKIN.light, hair: 'pigtails', hairColor: '#7a4a24', robe: '#a98cff', sash: '#ffffff', build: 'child' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#ff9f6a', robe: '#5f9fc0', sash: '#f5f0e6' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#2b1f18', wrap: '#c0504d', beard: 'short', beardColor: '#2b1f18', robe: '#8f86c8', sash: '#e8c25a' },
]

const Page11 = () => (
  <DayHills>
    <Cloud x={110} y={60} s={0.7} />
    <Cloud x={720} y={52} s={0.55} slow />
    <GodsHouse x={400} y={316} s={0.78} />
    <Tap say="Samuel listens to God." sfx="pop"><EliOnSeat x={514} y={342} s={0.76} blinkDelay={1.2} /></Tap>
    <Tap say="God was with Samuel." sfx="sparkle">
      <g>
        <Rays x={400} y={300} r={290} n={16} color="#fff3c0" opacity={0.3} />
        <Glow x={400} y={300} r={150} color="#fff6c8" />
        <Sparkles spots={[[318, 214, 7], [482, 226, 6], [400, 168, 8]]} color="#fffbe0" />
      </g>
    </Tap>
    <Tap say="We are listening, Samuel!" sfx="pop">
      <g>
        <Person x={84} y={424} s={0.98} look={LISTENERS[0]} pose="hold" blinkDelay={0.2} />
        <Person x={166} y={430} s={0.96} look={LISTENERS[1]} pose="hold" blinkDelay={1.1} />
        <Person x={244} y={438} s={1.0} look={LISTENERS[2]} blinkDelay={0.7} />
        <Person x={558} y={438} s={1.0} look={LISTENERS[3]} blinkDelay={1.6} />
        <Person x={636} y={430} s={0.96} look={LISTENERS[4]} pose="hold" blinkDelay={0.4} />
        <Person x={718} y={424} s={0.98} look={LISTENERS[5]} pose="hold" blinkDelay={1.9} />
      </g>
    </Tap>
    <Tap say="Listen to what God says!" sfx="good">
      <Person x={400} y={420} s={1.18} look={SAMUEL_GROWN} pose="wave" blinkDelay={0.3} />
    </Tap>
  </DayHills>
)

/** An open Bible held in both hands, in Person's own units (pose "hold"). */
const OpenBible = ({ skin }: { skin: string }) => (
  <g strokeLinejoin="round">
    <path d="M-27 -70 L0 -64 L27 -70 L27 -44 L0 -38 L-27 -44 Z" fill="#7a3b2e" stroke="#4a2018" strokeWidth={2} />
    <path d="M-24 -72 Q-12 -76 0 -67 L0 -42 Q-12 -50 -24 -46 Z" fill="#fffaf0" stroke="#c9b48a" strokeWidth={1.4} />
    <path d="M24 -72 Q12 -76 0 -67 L0 -42 Q12 -50 24 -46 Z" fill="#fffaf0" stroke="#c9b48a" strokeWidth={1.4} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M-19 ${-66 + i * 5.5} Q-11 ${-68 + i * 5.5} -4 ${-63 + i * 5.5} M4 ${-63 + i * 5.5} Q11 ${-68 + i * 5.5} 19 ${-66 + i * 5.5}`} stroke="#b9ad98" strokeWidth={1.4} fill="none" />)}
    <path d="M0 -42 L2 -32" stroke="#c0504d" strokeWidth={2.6} strokeLinecap="round" />
    <Grip x={-25} y={-52} skin={skin} />
    <Grip x={25} y={-52} skin={skin} />
  </g>
)

/** A cozy bedroom at night today: soft walls, a window with the moon and stars, and a little table for a lamp. */
function MyRoom({ children, win }: { children?: ReactNode; win?: string }) {
  return (
    <Scene sky="night" ground="none" stars={false} clouds={false}>
      <rect width={800} height={316} fill="#cdbfe6" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${30 + i * 58} 0 V316`} stroke="#c0b0de" strokeWidth={10} />)}
      <Tappable say={win} sfx="sparkle"><NightWindow x={540} y={66} w={124} h={136} moon={0.4} /></Tappable>
      <rect y={316} width={800} height={134} fill="#b98a62" />
      <rect y={310} width={800} height={8} fill="#8a6244" />
      {[350, 396].map((fy) => <path key={fy} d={`M0 ${fy} H800`} stroke="#a47650" strokeWidth={2} />)}
      <Rug x={380} y={424} w={500} h={40} color="#d9708a" />
      <Dusk />
      {/* the little table */}
      <rect x={668} y={318} width={84} height={12} rx={4} fill="#c98a50" stroke="#7a5228" strokeWidth={2.4} />
      {[680, 740].map((lx) => <rect key={lx} x={lx - 4} y={330} width={8} height={78} rx={2} fill="#a8743f" stroke="#7a5228" strokeWidth={2} />)}
      {children}
    </Scene>
  )
}

// 12. "God hears us when we pray, just like He heard Hannah. And God speaks to us in the Bible. So let's
// listen to God, just like Samuel!"
// You, at bedtime: sitting up in bed with the Bible open, a little lamp glowing, the moon and stars outside.
const Page12 = () => {
  const me = usePlayer()
  const quilt = lighten(me.look.robe, 0.12)
  return (
    <MyRoom win="Good night, moon! Good night, stars!">
      {/* a little picture of a rainbow on the wall */}
      <g>
        <rect x={84} y={92} width={116} height={86} rx={6} fill="#fffaf0" stroke="#c98a50" strokeWidth={6} />
        {['#ff5d5d', '#ffa64d', '#ffe14d', '#5fd39a', '#5fb7ff'].map((c, i) => <path key={c} d={`M${108 + i * 6} 160 A${34 - i * 6} ${34 - i * 6} 0 0 1 ${176 - i * 6} 160`} stroke={c} strokeWidth={6} fill="none" />)}
      </g>
      <Warmth x={712} y={290} r={170} o={0.5} />
      <Tap say="My little lamp is glowing." sfx="ding"><ClayLamp x={706} y={318} s={1.3} lit glow={60} /></Tap>
      <Tap say="Speak, Lord. I am listening!" sfx="good">
        <Bed x={364} y={432} s={1.4} w={250} quilt={quilt} who={{ look: me.look, k: 1.3, pose: 'hold', blinkDelay: 0.5, front: <OpenBible skin={me.look.skin} /> }} />
      </Tap>
      <Sparkles spots={[[226, 196, 7], [356, 168, 6], [292, 140, 5]]} color="#fff6d0" />
      <Heart x={196} y={248} s={0.72} />
      <Heart x={392} y={222} s={0.58} d={0.8} />
    </MyRoom>
  )
}

export const SAMUEL_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
