// Creation: the pictures for the island's mini-game, "Find the Animals" (Spot it; activities/games/types.ts,
// SpotKit). A big, lush garden with eight of the animals God made hiding in it. Hidden, each one only
// peeks out (ears over a bush, a tail round a tree, eyes over the water); found, it pops up happy.
// Things they hide behind (the tree trunk, the bush, a leafy clump, a leaf, the reeds) are drawn in the
// Picture and drawn again, the same, in Front, so they cover what hides behind them.
// Pieces are drawn in board units in a layer of their own, so they only use the pa-* animations.
import { useId } from 'react'
import type { At, SpotKit, SpotTarget } from '../../activities/games/types'
import { CuteFace, darken, ink, lighten, Shine, useShade } from '../kit'
import { itemById } from '../items'
import { Cloud, Flower, Scene, Sun } from '../scenes/kit'

// ---------- Helpers ----------

/** A drawn item (art/items) by id, its middle at (x, y), `size` across, turned by `rot` degrees. */
function ItemAt({ id, x, y, size, rot = 0, flip }: { id: string; x: number; y: number; size: number; rot?: number; flip?: boolean }) {
  const item = itemById(id)
  if (!item) return null
  const k = size / 100
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -k : k} ${k}) translate(-50 -50)`}><item.Draw /></g>
}

type Round = [number, number, number, number?]

/** Round lumps drawn as one shape (a bush): one outline round the outside, shaded as one, lighter at the top. */
function Lumps({ lumps, color, w = 3 }: { lumps: Round[]; color: string; w?: number }) {
  const id = `lu${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const line = ink(color)
  const top = Math.min(...lumps.map(([, cy, rx, ry = rx]) => cy - ry))
  const bottom = Math.max(...lumps.map(([, cy, rx, ry = rx]) => cy + ry))
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={top} x2={0} y2={bottom}>
          <stop offset="0" stopColor={lighten(color, 0.22)} /><stop offset="0.55" stopColor={color} /><stop offset="1" stopColor={darken(color, 0.14)} />
        </linearGradient>
      </defs>
      {lumps.map(([cx, cy, rx, ry = rx], i) => <ellipse key={`o${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={line} stroke={line} strokeWidth={w * 2} />)}
      {lumps.map(([cx, cy, rx, ry = rx], i) => <ellipse key={`f${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} />)}
    </g>
  )
}

/** A lily pad: a flat round leaf with a notch, lying on the water. */
const lilyPad = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx} ${cy} L${cx + 0.94 * rx} ${cy - 0.34 * ry} A${rx} ${ry} 0 1 0 ${cx + 0.94 * rx} ${cy + 0.34 * ry} Z`

// ---------- The garden's things to hide behind (in the Picture, and again in Front) ----------

const BARK = '#9a6a3a'
const LEAF = '#5fc46a'

/** The big tree's trunk (the squirrel hides behind it), with roots at its foot. */
const TRUNK = 'M118 364 C132 358 136 342 138 300 L142 196 L164 196 L166 300 C168 342 172 358 188 364 Z'
const Trunk = () => (
  <g>
    <path d={TRUNK} fill={BARK} stroke="#6b4422" strokeWidth={3} strokeLinejoin="round" />
    <path d="M150 230 q-4 14 0 26 M156 290 q4 12 0 22" stroke="#7a5230" strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
)

/** The bush in the middle (the bunny hides behind it): two big lumps on top, with a dip between them. */
const BUSH: Round[] = [[294, 370, 26], [314, 350, 30], [386, 350, 30], [406, 370, 26], [334, 376, 26], [366, 376, 26], [350, 362, 20]]
const Bush = () => (
  <g>
    <Lumps lumps={BUSH} color="#4fb85a" />
    <path d="M300 334 q6 -6 12 0 M378 334 q6 -6 12 0 M282 362 q5 -5 10 0 M402 362 q5 -5 10 0" stroke={lighten('#4fb85a', 0.4)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
)

/** The small tree's leafy clump on its right (the bird hides behind it). */
const CLUMP: [number, number, number] = [700, 196, 34]
const Clump = () => {
  const shade = useShade(LEAF, 0.3, 0.2)
  return (
    <g>
      <defs>{shade.def}</defs>
      <circle cx={CLUMP[0]} cy={CLUMP[1]} r={CLUMP[2]} fill={shade.fill} stroke={ink(LEAF)} strokeWidth={3} />
      <path d="M684 182 q7 -7 14 0" stroke={lighten(LEAF, 0.4)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** The big leaf on the daisy's stem (the ladybug hides under it). */
const BIG_LEAF = 'M80 410 C88 396 104 386 126 388 C118 402 102 412 80 410 Z'
const BigLeaf = () => (
  <g>
    <path d={BIG_LEAF} fill="#5cbf5a" stroke="#3f8f42" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M84 408 Q104 396 122 390" stroke="#3f8f42" strokeWidth={1.6} fill="none" strokeLinecap="round" />
  </g>
)

/** Reeds at the pond's far end (the frog hides behind them), with two cattails. */
const Reeds = () => (
  <g strokeLinecap="round" fill="none">
    {[[728, 384, 716, 330], [736, 386, 734, 318], [744, 386, 748, 326], [752, 384, 764, 334], [732, 386, 724, 346], [748, 386, 758, 350], [740, 388, 740, 340]].map(([x0, y0, x1, y1], i) => (
      <path key={i} d={`M${x0} ${y0} Q${(x0 + x1) / 2 + (i % 2 ? 3 : -3)} ${(y0 + y1) / 2} ${x1} ${y1}`} stroke={i % 3 ? '#4f9a4a' : '#62b05a'} strokeWidth={6} />
    ))}
    <rect x={730} y={318} width={8} height={20} rx={4} fill="#8a5a2e" stroke="#6b4422" strokeWidth={1.5} />
    <rect x={744} y={326} width={8} height={20} rx={4} fill="#8a5a2e" stroke="#6b4422" strokeWidth={1.5} />
    <path d="M722 390 Q742 380 762 390" stroke="#3f8f42" strokeWidth={4} />
  </g>
)

// ---------- The picture ----------

const POND = { cx: 600, cy: 394, rx: 166, ry: 46 }

/** The small tree on the right: trunk, the branch the bird sits on once it's found, and leaves (the clump on its right last). */
function SmallTree() {
  const shade = useShade(LEAF, 0.3, 0.2)
  const line = ink(LEAF)
  return (
    <g>
      <defs>{shade.def}</defs>
      <path d="M650 306 L653 214 L667 214 L670 306 Z" fill={BARK} stroke="#6b4422" strokeWidth={3} strokeLinejoin="round" />
      <path d="M710 214 Q736 210 766 200" stroke="#6b4422" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M710 214 Q736 210 766 200" stroke={BARK} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M760 201 q8 -12 18 -10 q-4 10 -18 10 Z" fill="#62b05a" stroke="#3f8f42" strokeWidth={1.6} />
      {[[660, 168, 54], [618, 196, 34], [640, 132, 30], [684, 134, 30]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={shade.fill} stroke={line} strokeWidth={3} />
      ))}
      <path d="M636 150 q8 -8 16 0 M664 120 q7 -7 14 0" stroke={lighten(LEAF, 0.4)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Clump />
    </g>
  )
}

/** The big tree on the left: the trunk, then a great round crown of leaves. */
function BigTree() {
  const shade = useShade(LEAF, 0.3, 0.2)
  const line = ink(LEAF)
  return (
    <g>
      <defs>{shade.def}</defs>
      <Trunk />
      {[[152, 118, 76], [84, 160, 46], [222, 156, 48], [108, 80, 42], [198, 76, 42]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={shade.fill} stroke={line} strokeWidth={3} />
      ))}
      <path d="M100 66 q9 -9 18 0 M140 96 q8 -8 16 0 M196 64 q8 -8 16 0 M70 150 q7 -7 14 0" stroke={lighten(LEAF, 0.4)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A bush with blossoms behind the pond (the butterfly sits on it, wings folded, among the flowers). */
const FlowerBush = () => (
  <g>
    <Lumps lumps={[[548, 304, 22], [572, 292, 26], [598, 304, 20]]} color="#58b860" />
    {[[540, 298, '#ff9fc6'], [556, 280, '#ffffff'], [590, 282, '#c9a8ff'], [604, 300, '#ff9fc6'], [570, 306, '#ffd34d']].map(([x, y, c]) => (
      <g key={x as number}>
        {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={x as number} cy={(y as number) - 4.5} r={3.6} fill={c as string} transform={`rotate(${a} ${x} ${y})`} />)}
        <circle cx={x as number} cy={y as number} r={2.4} fill="#ffd34d" />
      </g>
    ))}
  </g>
)

/** A pond: a grassy bank, the water with a shine on it, ripples and lily pads (the frog sits on the one on the right once it's found). */
function Pond() {
  const { cx, cy, rx, ry } = POND
  return (
    <g>
      <ellipse cx={cx} cy={cy + 2} rx={rx + 10} ry={ry + 8} fill="#5aa85a" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#5bb8ea" stroke="#3f96d8" strokeWidth={3} />
      <ellipse cx={cx - 10} cy={cy - 12} rx={rx - 34} ry={ry - 22} fill="#86d2f7" />
      {[[500, 396], [636, 382], [560, 424], [700, 428]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q8 -5 16 0`} stroke="#fff" strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round" />)}
      {([[514, 418, 20, 7], [690, 402, 30, 9], [636, 430, 15, 5]] as const).map(([x, y, prx, pry]) => (
        <path key={x} d={lilyPad(x, y, prx, pry)} fill="#62b860" stroke="#3f8f42" strokeWidth={2} strokeLinejoin="round" />
      ))}
      <g>
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={506} cy={410} rx={2.8} ry={5} fill="#ff9fc6" transform={`rotate(${a} 506 414)`} />)}
        <circle cx={506} cy={414} r={2.6} fill="#ffd34d" />
      </g>
    </g>
  )
}

/** Grey stones on the bank (the turtle hides among them, looking like one more stone). */
const Stones = () => (
  <g>
    {[[430, 340, 14, 8.5], [540, 340, 12, 7.5], [414, 326, 8, 5]].map(([x, y, rx, ry], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#bdb6ad" stroke="#7d766d" strokeWidth={2.5} />
        <ellipse cx={x - rx * 0.3} cy={y - ry * 0.35} rx={rx * 0.35} ry={ry * 0.25} fill="#fff" opacity={0.4} />
      </g>
    ))}
  </g>
)

/** A big white daisy on a tall stem with two leaves (the ladybug's flower). */
const Daisy = () => (
  <g>
    <path d="M80 440 L80 352" stroke="#3f9a4a" strokeWidth={4} strokeLinecap="round" />
    <path d="M80 418 C70 406 56 402 42 406 C50 418 64 422 80 418 Z" fill="#5cbf5a" stroke="#3f8f42" strokeWidth={2.5} strokeLinejoin="round" />
    <BigLeaf />
    {Array.from({ length: 9 }, (_, i) => (
      <ellipse key={i} cx={80} cy={334} rx={6} ry={13} fill="#ffffff" stroke="#e4d8e8" strokeWidth={1.5} transform={`rotate(${i * 40} 80 348)`} />
    ))}
    <circle cx={80} cy={348} r={9} fill="#ffd34d" stroke="#e0a800" strokeWidth={2} />
  </g>
)

const Grass = ({ x, y }: { x: number; y: number }) => (
  <path transform={`translate(${x} ${y})`} d="M-10 0 Q-10 -12 -15 -19 Q-5 -12 -3 0 M-3 0 Q-2 -17 0 -26 Q3 -15 3 0 M3 0 Q7 -14 15 -19 Q10 -10 10 0" stroke="#4fae55" strokeWidth={3} fill="none" strokeLinecap="round" />
)

function Picture() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sun x={520} y={70} s={0.7} />
      <Cloud x={370} y={86} s={0.8} slow />
      <Cloud x={580} y={44} s={0.55} />
      {/* far hills, then the meadow */}
      <path d="M0 262 Q130 216 280 244 Q420 208 560 238 Q690 214 800 232 L800 450 L0 450 Z" fill="#b9e0a8" />
      <path d="M0 302 Q180 272 380 292 Q560 312 800 288 L800 450 L0 450 Z" fill="#8fd18a" />
      <FlowerBush />
      <SmallTree />
      <Lumps lumps={[[20, 318, 26], [48, 308, 24], [70, 320, 18]]} color="#58b860" />
      <BigTree />
      <path d="M0 384 Q150 362 300 382 Q380 394 420 450 L0 450 Z" fill="#6cc46a" />
      <Pond />
      <Stones />
      <Reeds />
      <Bush />
      <Daisy />
      {[[232, 420, '#ff8cc0'], [262, 434, '#c9a8ff'], [330, 430, '#ff8cc0'], [376, 422, '#ffffff'], [420, 434, '#c9a8ff'], [24, 428, '#ffd34d'], [780, 312, '#ffd34d'], [300, 310, '#ffffff'], [470, 296, '#ff8cc0']].map(([x, y, c], i) => (
        <Flower key={i} x={x as number} y={y as number} color={c as string} />
      ))}
      {[[180, 410], [470, 440], [790, 410], [250, 300], [420, 300]].map(([x, y], i) => <Grass key={i} x={x} y={y} />)}
    </Scene>
  )
}

/** What the animals hide behind, drawn again over them. */
function Front() {
  return (
    <g>
      <Trunk />
      <Clump />
      <Bush />
      <BigLeaf />
      <Reeds />
    </g>
  )
}

// ---------- The animals (each centred on its spot: hidden, then found) ----------

/** A bunny behind the bush. Hidden, only its ears and eyes peek over; found, it pops up with its paws on the top of the bush. */
function Bunny({ found }: { found: boolean }) {
  return <ItemAt id="rabbit" x={0} y={found ? -8 : 10} size={74} />
}

/** A little bird in the small tree. Hidden, only its head peeks out from behind the leaves; found, it hops out onto the branch. */
function TreeBird({ found }: { found: boolean }) {
  if (found) return <ItemAt id="bird" x={36} y={-12} size={50} />
  const BLUE = '#5ba8f0'
  return (
    <g>
      <ellipse cx={-6} cy={4} rx={16} ry={12} fill={BLUE} />
      <circle cx={6} cy={-8} r={10} fill={BLUE} stroke={ink(BLUE)} strokeWidth={2.4} />
      <path d="M14.5 -9.5 L23 -6.5 L14.5 -3.5 Z" fill="#ffc23a" stroke={ink('#ffc23a')} strokeWidth={1.4} strokeLinejoin="round" />
      <g className="pa-blink"><ellipse cx={9} cy={-10.5} rx={2.4} ry={3} fill="#2b2140" /><circle cx={8.3} cy={-11.6} r={0.9} fill="#fff" /></g>
    </g>
  )
}

/** An acorn, upright, its middle at (x, y). */
const Acorn = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={1.5} rx={4.6} ry={5.6} fill="#e0a85a" stroke="#a8702c" strokeWidth={1.4} />
    <path d="M-5.6 -1 Q-5.6 -6 0 -6 Q5.6 -6 5.6 -1 Q0 1 -5.6 -1 Z" fill="#8a5a2e" stroke="#5e3a1a" strokeWidth={1.3} strokeLinejoin="round" />
    <path d="M0 -6 L0.8 -8.6" stroke="#5e3a1a" strokeWidth={1.5} strokeLinecap="round" />
  </g>
)

const FUR = '#c9773f', CREAM = '#ffe6c4'

/** A squirrel's big bushy tail, curling up (its root at (0, 0), curling up and to the right). */
const TAIL = 'M2 -4 C22 -2 34 -20 31 -40 C28 -58 14 -70 0 -66 C-8 -64 -8 -54 0 -52 C10 -50 16 -42 15 -32 C14 -20 8 -14 -2 -12 Z'
/** A paler streak down the middle of the tail. */
const TAIL_SHINE = 'M10 -10 C24 -18 28 -36 22 -52'

/** A red squirrel sitting up, facing us, holding an acorn, its bushy tail curled up behind. (0, 0) is between its feet. */
function SquirrelSitting() {
  const fur = useShade(FUR, 0.35, 0.18)
  const line = ink(FUR)
  return (
    <g>
      <defs>{fur.def}</defs>
      <ellipse cx={2} cy={0} rx={22} ry={3} fill="#000" opacity={0.12} />
      <g transform="translate(8 0)">
        <path d={TAIL} fill={fur.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
        <path d={TAIL_SHINE} stroke={lighten(FUR, 0.35)} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
      {/* body, cream tummy, haunches and feet */}
      <ellipse cx={0} cy={-19} rx={13} ry={17} fill={fur.fill} stroke={line} strokeWidth={2.4} />
      <ellipse cx={-1} cy={-16} rx={7.5} ry={11} fill={CREAM} />
      {[-1, 1].map((s) => <ellipse key={s} cx={s * 9} cy={-8} rx={6} ry={7} fill={fur.fill} stroke={line} strokeWidth={2} />)}
      {[-1, 1].map((s) => <ellipse key={`f${s}`} cx={s * 8} cy={-2} rx={6.5} ry={3} fill={darken(FUR, 0.08)} stroke={line} strokeWidth={1.8} />)}
      {/* the acorn in its front paws */}
      <Acorn x={0} y={-27} s={1.05} />
      {[-1, 1].map((s) => <ellipse key={`p${s}`} cx={s * 5.5} cy={-25} rx={3.6} ry={3} fill={fur.fill} stroke={line} strokeWidth={1.6} />)}
      {/* tufted ears, the head, a cream muzzle, and a happy face */}
      {[-1, 1].map((s) => (
        <g key={`e${s}`}>
          <path d={`M${s * 4} -50 L${s * 10} -63 L${s * 12} -48 Z`} fill={fur.fill} stroke={line} strokeWidth={2} strokeLinejoin="round" />
          <path d={`M${s * 10} -63 l${s * -1.5} -4 M${s * 10} -63 l${s * 2} -3.5`} stroke={line} strokeWidth={1.6} strokeLinecap="round" />
          <path d={`M${s * 6.5} -51 L${s * 9.6} -58 L${s * 10.6} -50 Z`} fill="#ffb8b0" />
        </g>
      ))}
      <circle cx={0} cy={-43} r={12.5} fill={fur.fill} stroke={line} strokeWidth={2.4} />
      <ellipse cx={0} cy={-37.5} rx={7} ry={5} fill={CREAM} />
      <ellipse cx={0} cy={-40} rx={2.2} ry={1.6} fill="#5a3826" />
      <path d="M-2.6 -36.4 Q0 -34.4 2.6 -36.4" stroke="#5a3826" strokeWidth={1.3} fill="none" strokeLinecap="round" />
      <CuteFace x={0} y={-45} s={0.27} gap={14} mouth={false} />
      <Shine x={-5} y={-50} rx={3.5} ry={2} />
    </g>
  )
}

/**
 * A squirrel by the big tree. Hidden, it's behind the trunk: its bushy tail sticks out on one side and its
 * face peeks round the other (the trunk, in Front, covers the rest). Found, it sits out by the roots with an acorn.
 */
function Squirrel({ found }: { found: boolean }) {
  const fur = useShade(FUR, 0.35, 0.18)
  const line = ink(FUR)
  if (found) return <g transform="translate(36 52)"><SquirrelSitting /></g>
  return (
    <g>
      <defs>{fur.def}</defs>
      {/* its tail, out to the left of the trunk */}
      <g transform="translate(-14 22) scale(-1 1)">
        <path d={TAIL} fill={fur.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
        <path d={TAIL_SHINE} stroke={lighten(FUR, 0.35)} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
      {/* (its body, behind the trunk) */}
      <ellipse cx={-6} cy={10} rx={12} ry={16} fill={fur.fill} />
      {/* its face, peeking round the right of the trunk, and a paw holding on */}
      {[-1, 1].map((s) => <path key={s} d={`M${14 + s * 4} -12 L${14 + s * 10} -25 L${14 + s * 12} -10 Z`} fill={fur.fill} stroke={line} strokeWidth={2} strokeLinejoin="round" />)}
      <circle cx={14} cy={-5} r={12} fill={fur.fill} stroke={line} strokeWidth={2.4} />
      <ellipse cx={15} cy={0.5} rx={6.5} ry={4.6} fill={CREAM} />
      <ellipse cx={15} cy={-2} rx={2} ry={1.5} fill="#5a3826" />
      <CuteFace x={14} y={-7} s={0.26} gap={14} mouth={false} />
      <ellipse cx={8} cy={12} rx={4} ry={3.4} fill={fur.fill} stroke={line} strokeWidth={1.6} />
    </g>
  )
}

/**
 * A ladybug by the daisy. Hidden, she's under the big leaf: her face and the back of her red shell peek out
 * below it. Found, she sits on the daisy.
 */
function Ladybug({ found }: { found: boolean }) {
  return found
    ? <ItemAt id="ladybug" x={-10} y={-36} size={30} />
    : <ItemAt id="ladybug" x={22} y={21} size={30} rot={90} />
}

/** A butterfly on the flowering bush. Hidden, her wings are folded up (she looks like one more flower); found, she opens them and flutters. */
function Butterfly({ found }: { found: boolean }) {
  if (found) return <g className="pa-float"><ItemAt id="butterfly" x={0} y={-28} size={52} /></g>
  const UP = '#ff8cc6', LOW = '#b48cff', BODY = '#8c74b8'
  // (side-on, facing right, standing on the top of the bush: its feet at y -9)
  return (
    <g transform="translate(-4 -12)">
      {/* folded wings standing up over its back: the purple lower wing behind, the pink upper wing in front */}
      <path d="M1 -6 C-7 -12 -15 -22 -11 -30 C-5 -32 1 -24 2 -10 Z" fill={LOW} stroke={ink(LOW)} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M2 -6 C-1 -16 1 -32 11 -36 C17 -32 13 -18 4 -6 Z" fill={UP} stroke={ink(UP)} strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={8} cy={-25} r={2} fill="#fff" />
      {/* little legs, the body trailing back, and its head with an eye and antennae */}
      <path d="M1 -2 L0 3 M4 -2 L5 3" stroke={BODY} strokeWidth={1.2} strokeLinecap="round" />
      <ellipse cx={-3} cy={-2} rx={2.2} ry={6} transform="rotate(-55 -3 -2)" fill={BODY} />
      <ellipse cx={3} cy={-4} rx={3} ry={3.4} fill={BODY} />
      <circle cx={8} cy={-6} r={3.6} fill={BODY} />
      <circle cx={9.2} cy={-6.6} r={1.4} fill="#2b2140" />
      <circle cx={8.8} cy={-7.1} r={0.5} fill="#fff" />
      <path d="M9 -9.5 Q12 -16 16 -18 M7.6 -9.5 Q8.6 -17 6.4 -21" stroke={BODY} strokeWidth={1.3} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * A little turtle on the bank, side-on (facing right) with its head turned to us. Hidden, it has pulled in its
 * head and legs, so it looks like one more stone (only its eyes peep out); found, it stands up and comes out
 * smiling. (0, 0) is the middle of its spot; it stands on the ground at y 14.
 */
function Turtle({ found }: { found: boolean }) {
  const SHELL = '#5e9e48', PLATE = '#80c060', SKIN = '#a9d77a'
  const shell = useShade(SHELL, 0.35, 0.2)
  const skin = useShade(SKIN, 0.35, 0.15)
  const line = ink(SHELL), sline = ink(SKIN)
  return (
    <g>
      <defs>{shell.def}{skin.def}</defs>
      <ellipse cx={2} cy={14} rx={found ? 36 : 30} ry={3.5} fill="#000" opacity={0.12} />
      {found && (
        <g>
          {/* a little tail, then four stubby legs (the far ones a shade darker) */}
          <path d="M-26 3 L-38 8 L-26 9 Z" fill={skin.fill} stroke={sline} strokeWidth={1.8} strokeLinejoin="round" />
          {[-13, 19].map((x) => <rect key={x} x={x} y={0} width={8} height={13} rx={3.5} fill={darken(SKIN, 0.14)} stroke={sline} strokeWidth={1.8} />)}
          {[-21, 9].map((x) => <rect key={x} x={x} y={0} width={10} height={14} rx={4} fill={skin.fill} stroke={sline} strokeWidth={1.8} />)}
          {/* its neck stretching out from under the shell, and its head */}
          <path d="M22 4 C30 2 35 -4 38 -10" stroke={sline} strokeWidth={13} fill="none" strokeLinecap="round" />
          <path d="M22 4 C30 2 35 -4 38 -10" stroke={SKIN} strokeWidth={9} fill="none" strokeLinecap="round" />
          <circle cx={41} cy={-15} r={11} fill={skin.fill} stroke={sline} strokeWidth={2.2} />
          <CuteFace x={41} y={-16} s={0.27} gap={12} />
          <Shine x={37} y={-21} rx={3} ry={1.8} />
        </g>
      )}
      {/* the shell: a dome with plates and a paler rim (sitting right down on the ground while it hides) */}
      <g transform={found ? undefined : 'translate(0 5)'}>
        <path d="M-27 0 C-27 -22 -12 -30 1 -30 C14 -30 29 -22 29 0 Z" fill={shell.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
        {[[1, -16, 9], [-15, -10, 7], [16, -10, 7]].map(([x, y, r]) => (
          <path key={x} d={`M${x - r} ${y} L${x - r / 2} ${y - r * 0.85} L${x + r / 2} ${y - r * 0.85} L${x + r} ${y} L${x + r / 2} ${y + r * 0.85} L${x - r / 2} ${y + r * 0.85} Z`} fill={PLATE} stroke={line} strokeWidth={1.4} strokeLinejoin="round" />
        ))}
        <path d="M-29 0 Q1 7 31 0 L30 5 Q1 12 -28 5 Z" fill="#c9e39a" stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
        <Shine x={-8} y={-23} rx={6} ry={2.6} rot={-12} />
        {!found && (
          // shy: two eyes peeping out from under the front of its shell
          <g>
            <path d="M21 1 Q26 -6 32 1 Z" fill="#3b4a2e" />
            <g className="pa-blink"><circle cx={24.6} cy={-1} r={1.5} fill="#fff" /><circle cx={28.6} cy={-1} r={1.5} fill="#fff" /></g>
          </g>
        )}
      </g>
    </g>
  )
}

/** A fish in the pond. Hidden, it's a shadow under the water; found, it leaps out with a splash. */
function PondFish({ found }: { found: boolean }) {
  if (!found) {
    return (
      <g opacity={0.42}>
        <path d="M-20 4 C-20 -6 -6 -12 6 -10 C14 -8 20 -2 22 4 C20 10 12 16 4 16 C-8 16 -20 12 -20 4 Z M20 4 L32 -6 L30 4 L32 14 Z" fill="#2f74b0" />
        <circle cx={-8} cy={-18} r={3} fill="none" stroke="#e6f6ff" strokeWidth={2} />
        <circle cx={-3} cy={-28} r={2} fill="none" stroke="#e6f6ff" strokeWidth={1.6} />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx={0} cy={10} rx={26} ry={6} fill="none" stroke="#ffffff" strokeWidth={3} opacity={0.85} />
      {[[-24, -2, -20], [22, -4, 20], [-12, -10, -10], [14, -12, 12]].map(([x, y, a], i) => (
        <ellipse key={i} cx={x} cy={y} rx={2.6} ry={4} fill="#d8f1ff" stroke="#ffffff" strokeWidth={1.2} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      <ItemAt id="fish" x={0} y={-22} size={56} rot={-22} />
    </g>
  )
}

/** A frog in the pond. Hidden, only its eyes peek over the water by the reeds; found, it sits up on the lily pad. */
function Frog({ found }: { found: boolean }) {
  if (found) return <ItemAt id="frog" x={-26} y={-4} size={52} />
  const GREEN = '#7ccf5a'
  return (
    <g transform="translate(-24 0)">
      <path d="M8 -2 C8 -12 16 -16 28 -16 C40 -16 48 -12 48 -2 Z" fill={GREEN} stroke={ink(GREEN)} strokeWidth={2} />
      {[20, 36].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-14} r={6.5} fill={GREEN} stroke={ink(GREEN)} strokeWidth={2} />
          <g className="pa-blink"><ellipse cx={x} cy={-14} rx={3} ry={3.6} fill="#2b2140" /><circle cx={x - 1} cy={-15.4} r={1.1} fill="#fff" /></g>
        </g>
      ))}
      <ellipse cx={28} cy={-1} rx={26} ry={4} fill="none" stroke="#e6f6ff" strokeWidth={2} opacity={0.8} />
    </g>
  )
}

// ---------- The kit ----------

const target = (id: string, at: At, r: number, say: string, Draw: SpotTarget['Draw']): SpotTarget => ({ id, at, r, say, Draw })

export const CREATION_GAME: SpotKit = {
  Picture,
  targets: [
    target('bunny', [350, 326], 48, 'A bunny!', Bunny),
    target('squirrel', [160, 310], 50, 'A squirrel!', Squirrel),
    target('bird', [724, 194], 46, 'A little bird!', TreeBird),
    target('ladybug', [90, 384], 44, 'A ladybug!', Ladybug),
    target('butterfly', [574, 276], 44, 'A butterfly!', Butterfly),
    target('turtle', [476, 330], 46, 'A turtle!', Turtle),
    target('fish', [580, 404], 46, 'A fish!', PondFish),
    target('frog', [716, 384], 46, 'A frog!', Frog),
  ],
  Front,
}
