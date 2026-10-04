// The Lost Sheep: the island's mini-game, Spot it ("Look for the Little Lamb"; activities/games/types.ts, SpotKit).
// Evening on the hillside: the shepherd holds up his lantern on the path and calls for his little lost lamb. The child
// helps him look. Six things are hiding, each easy to see once you look (and each well away from the others):
//   - a bird's nest in the big tree, tucked behind a clump of leaves: found, the leaves part and two baby birds chirp.
//   - an owl in the hollow of the tree's trunk, only its eyes shining in the dark: found, it sits in the doorway.
//   - a bunny behind the big rock, only its ears over the top: found, it hops out beside the rock.
//   - a little mole under his molehill, only his nose and paws poking out: found, he pops up and says hello.
//   - a butterfly on the flowers, its wings shut (it looks like one more flower): found, it opens its wings.
//   - the little lamb, hidden best: stuck in a bush on the far side of the hill, only an ear and its woolly topknot
//     peeking out. Found, its head pops out of the bush ("Baa!"), a little stuck, as on page seven.
// A hiding place (the leaves, the rock, the bush) is drawn in the Picture and drawn again, the same, over what hides
// behind it (in its target's Draw), so a found thing can come out in front of it. Pieces are drawn in board units in a
// layer of their own, so they only use the pa-* and ls-* animations (art/scenes/lost-sheep.css).
import type { CSSProperties, ReactNode } from 'react'
import type { At, SpotKit, SpotTarget } from '../../activities/games/types'
import { CuteFace, darken, ink, Shine, useShade } from '../kit'
import { fluff } from '../items/draw'
import { LambFace } from '../items/isl-lost-sheep'
import { Boulder, Bramble, Hills, LambInBramble, ShepherdLooking, Tufts } from '../scenes/lost-sheep'
import { Emoji, Flower, Glow, Moon, Scene, Sparkles } from '../scenes/kit'

/** Where each thing is (its tap circle's middle). */
const SPOTS = {
  nest: [204, 122] as At,
  owl: [108, 262] as At,
  bunny: [304, 386] as At,
  mole: [506, 404] as At,
  butterfly: [652, 398] as At,
  lamb: [700, 300] as At,
}

/** The lamb's bush, and the big rock the bunny hides behind. */
const BUSH = { x: 716, y: 340, s: 0.8 }
const ROCK = { x: 300, y: 438, w: 168, h: 86 }
/** The big tree: the middle of the foot of its trunk, the owl's hollow, and the leaves' color. */
const TREE = { x: 110, y: 334 }
const HOLLOW = { x: 108, y: 262 }
const LEAF = '#4f8f5e'

// ---------- The picture ----------

/** The big tree on the left: a thick trunk with a hollow in it (the owl's home), a branch reaching out on the right
 * (the nest sits on it), and a big round crown of leaves. */
function BigTree() {
  const bark = useShade('#8a6446', 0.25, 0.2)
  const leaf = useShade(LEAF, 0.3, 0.2)
  const line = ink(LEAF)
  return (
    <g strokeLinejoin="round">
      <defs>{bark.def}{leaf.def}</defs>
      <ellipse cx={TREE.x} cy={TREE.y} rx={56} ry={7} fill="#000" opacity={0.14} />
      {/* the branch out to the right, under the nest */}
      <path d="M150 152 Q190 148 236 138" stroke={ink('#8a6446')} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M150 152 Q190 148 236 138" stroke="#8a6446" strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* the trunk, with roots */}
      <path d="M78 334 Q88 314 88 286 L92 170 L130 170 L130 286 Q130 314 142 334 Z" fill={bark.fill} stroke={ink('#8a6446')} strokeWidth={3} />
      <path d="M100 196 Q98 220 102 238 M122 300 Q124 316 120 330" stroke={darken('#8a6446', 0.25)} strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* the hollow: a dark doorway in the trunk */}
      <ellipse cx={HOLLOW.x} cy={HOLLOW.y} rx={19} ry={25} fill="#a07a58" stroke={ink('#8a6446')} strokeWidth={2.4} />
      <ellipse cx={HOLLOW.x} cy={HOLLOW.y + 2} rx={14} ry={20} fill="#2e2226" />
      {/* the crown of leaves */}
      <g>
        <circle cx={60} cy={150} r={42} fill={leaf.fill} stroke={line} strokeWidth={3} />
        <circle cx={160} cy={150} r={40} fill={leaf.fill} stroke={line} strokeWidth={3} />
        <circle cx={110} cy={104} r={70} fill={leaf.fill} stroke={line} strokeWidth={3} />
        <path d="M66 96 q8 -6 16 -2 M120 70 q8 -6 16 -2 M140 124 q7 -5 14 -2 M50 150 q7 -5 14 -2 M92 136 q7 -5 14 -2" stroke={line} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
      </g>
    </g>
  )
}

/** A clump of leaves on the end of the branch (the nest is tucked in behind it). */
const LeafClump = () => {
  const leaf = useShade(LEAF, 0.3, 0.2)
  return (
    <g>
      <defs>{leaf.def}</defs>
      <path d={fluff(204, 112, 30, 20, 8, 0.6)} fill={leaf.fill} stroke={ink(LEAF)} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M190 106 q7 -5 14 -2 M208 118 q7 -5 14 -2" stroke={ink(LEAF)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.5} />
    </g>
  )
}

/** The flower patch, where the butterfly rests. */
const FLOWERS: [number, number, string, number][] = [
  [592, 440, '#ff8cc0', 1.1], [616, 420, '#ffffff', 1], [652, 414, '#c9a8ff', 1.15], [684, 436, '#ffd34d', 1.1],
  [712, 418, '#ff8cc0', 1], [740, 440, '#ffffff', 1.1], [628, 446, '#ffd34d', 1], [764, 422, '#c9a8ff', 0.95],
]

/** The way up the hill. */
const PATH = 'M392 452 Q416 420 462 404 Q508 386 494 356 Q480 326 512 300 Q536 282 532 262 L546 262 Q552 286 528 304 Q502 326 516 354 Q534 392 486 414 Q448 428 452 452 Z'

function Picture() {
  return (
    <Scene sky="dusk" ground="none" clouds={false} stars={false}>
      <Sparkles spots={[[300, 44, 5], [420, 92, 4], [740, 50, 5], [650, 120, 4]]} color="#fff8d6" />
      <Moon x={560} y={74} s={0.6} />
      <Hills time="dusk" far="M0 250 Q140 214 300 240 Q460 210 620 236 Q720 220 800 232 L800 450 L0 450 Z"
        mid="M0 300 Q200 270 420 296 Q620 266 800 288 L800 450 L0 450 Z" near="M0 372 Q240 346 470 370 T800 362 L800 450 L0 450 Z" />
      <path d={PATH} fill="#c9b48a" opacity={0.8} />
      <Tufts spots={[[22, 446], [250, 446], [420, 350], [560, 360], [780, 384], [540, 446]]} color="#4f7f5a" />
      <BigTree />
      <Bramble x={164} y={436} s={0.86} dusk />
      <Bramble x={BUSH.x} y={BUSH.y} s={BUSH.s} dusk />
      <Boulder x={ROCK.x} y={ROCK.y} w={ROCK.w} h={ROCK.h} />
      {FLOWERS.map(([fx, fy, c, s]) => <Flower key={fx} x={fx} y={fy} color={c} s={s} />)}
      {/* the shepherd on the path, holding up his lantern and calling */}
      <ShepherdLooking x={436} y={330} s={0.6} calling blinkDelay={0.7} />
    </Scene>
  )
}

// ---------- The things to find (each centred on its spot: hidden, then found) ----------

/** Draws `children` (in board units) inside a target's Draw, centred on `at`. */
const Board = ({ at, children }: { at: At; children: ReactNode }) => <g transform={`translate(${-at[0]} ${-at[1]})`}>{children}</g>

/** A happy word popping up by a found thing, at (x, y) in board units (it floats up and fades). */
const Word = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <g className="ls-word">
    <text x={x} y={y} fontSize={21} fontWeight={800} textAnchor="middle" fill="#8a4fc4" stroke="#ffffff" strokeWidth={5} strokeLinejoin="round" paintOrder="stroke"
      fontFamily="'Baloo 2', 'Chalkboard SE', system-ui, sans-serif">{text}</text>
  </g>
)

/** A baby bird in the nest: a round fluffy head, its beak open wide (or shut, `quiet`). (x, y): the middle of its head. */
function Chick({ x, y, color, quiet }: { x: number; y: number; color: string; quiet?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={9} fill={color} stroke={ink(color)} strokeWidth={1.8} />
      <path d="M-3 -9 q2 -5 4 -1 q2 -4 3 1" stroke={ink(color)} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {quiet
        ? <path d="M-3 2 L3 2 L0 6 Z" fill="#ffb347" stroke="#e08a2a" strokeWidth={1} strokeLinejoin="round" />
        : <path d="M-4.5 1 L4.5 1 L0 -3 Z M-4.5 2.5 L4.5 2.5 L0 8 Z" fill="#ffb347" stroke="#e08a2a" strokeWidth={1} strokeLinejoin="round" />}
      <circle cx={-3.6} cy={-2.6} r={1.6} fill="#2b2140" />
      <circle cx={3.6} cy={-2.6} r={1.6} fill="#2b2140" />
    </g>
  )
}

/** The nest of twigs on the branch, with the baby birds in it. */
function NestWithChicks({ quiet }: { quiet?: boolean }) {
  const up = quiet ? 6 : 0
  return (
    <g strokeLinejoin="round">
      <Chick x={196} y={124 + up} color="#8fc6ff" quiet={quiet} />
      <Chick x={214} y={121 + up} color="#ffd36a" quiet={quiet} />
      <path d="M182 128 Q205 138 228 128 L224 140 Q205 148 186 140 Z" fill="#b08050" stroke="#6b4a2e" strokeWidth={2.2} />
      <path d="M184 132 L224 136 M186 138 L222 131 M194 142 L216 129" stroke="#8a5a32" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  )
}

function Nest({ found }: { found: boolean }) {
  return (
    <Board at={SPOTS.nest}>
      {found ? (
        <g>
          <NestWithChicks />
          <Word x={206} y={92} text="Tweet, tweet!" />
        </g>
      ) : (
        <g>
          <NestWithChicks quiet />
          <LeafClump />
        </g>
      )}
    </Board>
  )
}

/** An owl in the hollow of the tree: only its eyes shining in the dark, then sitting in the doorway ("Hoo, hoo!"). */
function Owl({ found }: { found: boolean }) {
  const feather = useShade('#a8825e', 0.3, 0.2)
  const { x, y } = HOLLOW
  return (
    <Board at={SPOTS.owl}>
      {found ? (
        <g strokeLinejoin="round">
          <defs>{feather.def}</defs>
          <path d={`M${x - 10} ${y - 16} L${x - 8} ${y - 26} L${x - 2} ${y - 18} Z M${x + 10} ${y - 16} L${x + 8} ${y - 26} L${x + 2} ${y - 18} Z`} fill="#a8825e" stroke="#6b4a2e" strokeWidth={1.6} />
          <ellipse cx={x} cy={y + 2} rx={14} ry={18} fill={feather.fill} stroke="#6b4a2e" strokeWidth={2} />
          <ellipse cx={x} cy={y + 8} rx={8.5} ry={10} fill="#f2e2c4" />
          {[-1, 1].map((d) => <path key={d} d={`M${x + d * 12} ${y - 4} Q${x + d * 18} ${y + 6} ${x + d * 11} ${y + 16}`} stroke="#6b4a2e" strokeWidth={2} fill="#957050" />)}
          {[-5.5, 5.5].map((ex) => (
            <g key={ex}>
              <circle cx={x + ex} cy={y - 6} r={6} fill="#fff8d6" stroke="#6b4a2e" strokeWidth={1.4} />
              <g className="pa-blink" style={{ '--d': `${ex > 0 ? 0.2 : 0}s` } as CSSProperties}><circle cx={x + ex} cy={y - 6} r={3} fill="#2b2140" /></g>
            </g>
          ))}
          <path d={`M${x - 2.4} ${y - 1} L${x + 2.4} ${y - 1} L${x} ${y + 4} Z`} fill="#e8a83a" />
          <path d={`M${x - 6} ${y + 20} l0 3 M${x - 3} ${y + 20} l0 3 M${x + 3} ${y + 20} l0 3 M${x + 6} ${y + 20} l0 3`} stroke="#e8a83a" strokeWidth={2} strokeLinecap="round" />
          <Word x={x + 4} y={y - 34} text="Hoo, hoo!" />
        </g>
      ) : (
        // (far back in the dark: two eyes, blinking)
        <g className="pa-blink" style={{ '--d': '1.1s' } as CSSProperties}>
          {[-5.5, 5.5].map((ex) => (
            <g key={ex}>
              <circle cx={x + ex} cy={y - 2} r={4.4} fill="#ffe680" />
              <circle cx={x + ex} cy={y - 2} r={2} fill="#2b2140" />
            </g>
          ))}
        </g>
      )}
    </Board>
  )
}

/** A bunny's long ears, peeking up over the rock. */
const BunnyEars = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-1, 1].map((d) => (
      <g key={d} transform={`rotate(${d * 9} ${d * 7} 0)`}>
        <ellipse cx={d * 7} cy={-16} rx={5.6} ry={16} fill="#fbf7fc" stroke="#b8aac4" strokeWidth={2} />
        <ellipse cx={d * 7} cy={-15} rx={2.6} ry={10.5} fill="#ffc6d6" />
      </g>
    ))}
  </g>
)

function Bunny({ found }: { found: boolean }) {
  return (
    <Board at={SPOTS.bunny}>
      {found ? (
        <g>
          <Emoji e="🐰" x={366} y={400} size={72} />
          <Word x={366} y={354} text="Hop, hop!" />
        </g>
      ) : (
        <g>
          <BunnyEars x={300} y={364} />
          <Boulder x={ROCK.x} y={ROCK.y} w={ROCK.w} h={ROCK.h} />
        </g>
      )}
    </Board>
  )
}

/** The molehill: a little mound of soft dirt with a hole at the top. `front`: only its front (drawn over the mole). */
function Molehill({ front }: { front?: boolean }) {
  const dirt = useShade('#9a724e', 0.3, 0.2)
  const { x, y } = { x: 506, y: 424 }
  return (
    <g strokeLinejoin="round">
      <defs>{dirt.def}</defs>
      {!front && <ellipse cx={x} cy={y} rx={40} ry={5} fill="#000" opacity={0.13} />}
      {!front && <ellipse cx={x} cy={y - 30} rx={12} ry={4.5} fill="#3a2a22" />}
      <path d={front ? `M${x - 40} ${y} Q${x - 30} ${y - 26} ${x - 13} ${y - 30} Q${x} ${y - 24} ${x + 13} ${y - 30} Q${x + 30} ${y - 26} ${x + 40} ${y} Z`
        : `M${x - 40} ${y} Q${x - 32} ${y - 30} ${x - 12} ${y - 32} Q${x} ${y - 27} ${x + 12} ${y - 32} Q${x + 32} ${y - 30} ${x + 40} ${y} Z`}
        fill={dirt.fill} stroke={ink('#9a724e')} strokeWidth={2.4} />
      {[[x - 22, y - 12], [x + 4, y - 8], [x + 24, y - 16], [x - 8, y - 20]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r={2.4} fill={darken('#9a724e', 0.25)} />)}
    </g>
  )
}

const MOLE = '#6e5c62'

function Mole({ found }: { found: boolean }) {
  const fur = useShade(MOLE, 0.35, 0.2)
  const x = 506, top = 394
  const paw = (px: number, py: number, d: number, down?: boolean) => (
    <g transform={`translate(${px} ${py}) rotate(${down ? 180 - d * 12 : d * 14})`}>
      <ellipse rx={6.5} ry={5} fill="#ffb3c2" stroke="#d07a90" strokeWidth={1.4} />
      <path d="M-4 -4 l-1 -3 M0 -5 l0 -3.4 M4 -4 l1 -3" stroke="#d07a90" strokeWidth={1.4} strokeLinecap="round" />
    </g>
  )
  return (
    <Board at={SPOTS.mole}>
      <defs>{fur.def}</defs>
      {found ? (
        <g strokeLinejoin="round">
          <Molehill />
          {/* up out of his hole to his tummy, his big digging paws on the rim */}
          <path d={`M${x - 15} ${top + 4} Q${x - 17} ${top - 30} ${x} ${top - 32} Q${x + 17} ${top - 30} ${x + 15} ${top + 4} Z`} fill={fur.fill} stroke={ink(MOLE)} strokeWidth={2.2} />
          <ellipse cx={x} cy={top - 8} rx={8} ry={9} fill="#a8949a" />
          <Shine x={x - 7} y={top - 24} rx={4} ry={2.4} />
          <path d={`M${x - 7} ${top - 20} q2.4 -2.6 4.8 0 M${x + 2.2} ${top - 20} q2.4 -2.6 4.8 0`} stroke="#2b2140" strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <ellipse cx={x} cy={top - 13} rx={4.4} ry={3.4} fill="#ff8fa8" stroke="#d0607a" strokeWidth={1.2} />
          <path d={`M${x - 3} ${top - 8} Q${x} ${top - 5.4} ${x + 3} ${top - 8}`} stroke="#2b2140" strokeWidth={1.3} fill="none" strokeLinecap="round" />
          {[-1, 1].map((d) => <ellipse key={d} cx={x + d * 9.5} cy={top - 14} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />)}
          <Molehill front />
          {paw(x - 13, top + 3, -1, true)}
          {paw(x + 13, top + 3, 1, true)}
          <Word x={x} y={top - 48} text="Hello!" />
        </g>
      ) : (
        <g>
          <Molehill />
          {/* just his pink nose and paws, poking out of the hole */}
          {paw(x - 9, top - 3, -1)}
          {paw(x + 9, top - 3, 1)}
          <ellipse cx={x} cy={top - 6} rx={4.4} ry={3.4} fill="#ff8fa8" stroke="#d0607a" strokeWidth={1.2} />
        </g>
      )}
    </Board>
  )
}

/** The butterfly on its flower: wings shut, pink like the flowers; then wings open wide, fluttering up. */
function Butterfly({ found }: { found: boolean }) {
  const x = 652, y = 392
  return (
    <Board at={SPOTS.butterfly}>
      {found ? (
        <g>
          <g className="pa-float">
            <g transform={`translate(${x} ${y - 14})`} strokeLinejoin="round">
              {[-1, 1].map((d) => (
                <g key={d} transform={`scale(${d} 1)`}>
                  <path d="M2 -2 C10 -22 30 -22 28 -8 C27 0 14 2 2 0 Z" fill="#ff9fc8" stroke="#c0508a" strokeWidth={1.8} />
                  <path d="M2 1 C14 2 24 8 18 16 C12 22 4 14 2 4 Z" fill="#c9a8ff" stroke="#8a5bc4" strokeWidth={1.8} />
                  <circle cx={18} cy={-10} r={3} fill="#fff4a0" />
                  <circle cx={12} cy={10} r={2.2} fill="#fff" opacity={0.8} />
                </g>
              ))}
              <ellipse cx={0} cy={0} rx={3} ry={11} fill="#6b4a8a" />
              <circle cx={0} cy={-12} r={3.6} fill="#6b4a8a" />
              <path d="M-1 -15 Q-4 -22 -7 -24 M1 -15 Q4 -22 7 -24" stroke="#6b4a8a" strokeWidth={1.4} fill="none" strokeLinecap="round" />
              <CuteFace x={0} y={-12} s={0.12} gap={11} mouth={false} />
            </g>
          </g>
          <Word x={x} y={y - 48} text="Flutter!" />
        </g>
      ) : (
        // resting on the purple flower, its wings shut above it (pink and lilac, like the flowers round it)
        <g transform={`translate(${x} ${y + 2})`} strokeLinejoin="round">
          <path d="M0 0 C-6 -10 -10 -24 -2 -28 C4 -24 3 -10 0 0 Z" fill="#ff9fc8" stroke="#c0508a" strokeWidth={1.6} />
          <path d="M0 0 C6 -8 10 -20 4 -24 C-1 -20 -1 -8 0 0 Z" fill="#c9a8ff" stroke="#8a5bc4" strokeWidth={1.6} />
          <path d="M-1 -2 Q-4 -7 -6 -8 M1 -2 Q4 -7 6 -8" stroke="#6b4a8a" strokeWidth={1.2} fill="none" strokeLinecap="round" />
        </g>
      )}
    </Board>
  )
}

/** The little lamb in the bush: only an ear and its topknot peeking out; then its head pops out of the bush ("Baa!"). */
function Lamb({ found }: { found: boolean }) {
  return (
    <Board at={SPOTS.lamb}>
      {found ? (
        <g>
          <Glow x={680} y={300} r={50} color="#fff3c0" />
          <Bramble x={BUSH.x} y={BUSH.y} s={BUSH.s} dusk />
          <LambInBramble x={BUSH.x} y={BUSH.y} s={BUSH.s} dusk mood="happy" />
          <Word x={672} y={250} text="Baa!" />
        </g>
      ) : (
        <g>
          <LambFace x={680} y={302} s={0.82} mood="scared" />
          <Bramble x={BUSH.x} y={BUSH.y} s={BUSH.s} dusk />
        </g>
      )}
    </Board>
  )
}

const target = (id: string, at: At, r: number, say: string, Draw: SpotTarget['Draw']): SpotTarget => ({ id, at, r, say, Draw })

export const LOST_SHEEP_GAME: SpotKit = {
  Picture,
  targets: [
    target('nest', SPOTS.nest, 48, "A bird's nest, with baby birds inside! Tweet, tweet!", Nest),
    target('owl', SPOTS.owl, 48, 'An owl, in the tree! Hoo, hoo!', Owl),
    target('bunny', SPOTS.bunny, 50, 'A bunny, behind the rock! Hop, hop!', Bunny),
    target('mole', SPOTS.mole, 48, 'A little mole, peeking out of his molehill!', Mole),
    target('lamb', SPOTS.lamb, 50, 'Baa! There you are, little lamb!', Lamb),
    target('butterfly', SPOTS.butterfly, 48, 'A butterfly, on the flowers! Flutter, flutter!', Butterfly),
  ],
}
