// The Burning Bush: the island's mini-game, Spot it ("Where Are the Sheep?"; activities/games/types.ts, SpotKit).
// Moses has led the flock to the mountain of God, and some of his sheep and goats have wandered off over its
// warm, rocky slopes. Each one hides: behind a boulder or a bush, on a high ledge, in a cave, behind a dune,
// up on a tall rock. Hidden, only a bit of it peeks out (a head round a rock, horns over a bush, eyes in the
// dark); found, it comes out happily in front of its hiding place, with a little "Baa!".
// A hiding place is drawn in the Picture, and drawn again, the same, over the hidden animal (in its target's
// Draw), so a found animal can step out in front of it. Pieces are drawn in board units in a layer of their
// own, so they only use the pa-* and bb-* animations.
import type { CSSProperties, ReactNode } from 'react'
import type { At, SpotKit, SpotTarget } from '../../activities/games/types'
import { Person } from '../people'
import { Cloud, Palm, Scene, Sheep, Sun } from '../scenes/kit'
import { Goat, MOSES } from '../scenes/moses'
import { Boulder, MountainOfGod, Scrub } from '../scenes/burning-bush'

// ---------- The hiding places (drawn in the Picture, and again over whoever hides behind them) ----------

const BIG_BOULDER = () => <Boulder x={98} y={432} w={150} h={96} />
const LEFT_BUSH = () => <Scrub x={292} y={442} s={1.2} />
const RIGHT_BUSH = () => <Scrub x={610} y={444} s={1.2} flip color="#86aa58" />
const LEDGE_ROCK = () => <Boulder x={214} y={220} w={56} h={36} color="#c4906c" />
const OUTCROP = () => <Boulder x={462} y={284} w={100} h={64} color="#c4906c" flip />
const TALL_ROCK = () => <Boulder x={744} y={438} w={86} h={152} color="#c99a78" flip />

/** A little hump of sand in the middle of the picture, with a sunny crest. */
const DUNE = () => (
  <g>
    <path d="M360 420 Q392 394 430 384 Q470 380 506 400 Q526 410 540 422 Z" fill="#ecc88f" stroke="#d9ac6a" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M384 404 Q410 390 432 386 Q456 384 476 390" stroke="#fbe3b4" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
)

/** The cave's mouth in the hillside: a dark arch with rocks round its edge. */
const CAVE = { x: 650, floor: 284 }
const Cave = () => (
  <g>
    <path d={`M${CAVE.x - 52} ${CAVE.floor} Q${CAVE.x - 54} ${CAVE.floor - 70} ${CAVE.x} ${CAVE.floor - 74} Q${CAVE.x + 54} ${CAVE.floor - 70} ${CAVE.x + 52} ${CAVE.floor} Z`} fill="#b07a5a" stroke="#8a5a40" strokeWidth={3} strokeLinejoin="round" />
    <path d={`M${CAVE.x - 40} ${CAVE.floor} Q${CAVE.x - 42} ${CAVE.floor - 56} ${CAVE.x} ${CAVE.floor - 60} Q${CAVE.x + 42} ${CAVE.floor - 56} ${CAVE.x + 40} ${CAVE.floor} Z`} fill="#3d2b2b" />
    <path d={`M${CAVE.x - 30} ${CAVE.floor} Q${CAVE.x - 31} ${CAVE.floor - 40} ${CAVE.x} ${CAVE.floor - 44} Q${CAVE.x + 31} ${CAVE.floor - 40} ${CAVE.x + 30} ${CAVE.floor} Z`} fill="#2a1d1f" />
    <path d={`M${CAVE.x - 44} ${CAVE.floor + 1} L${CAVE.x + 44} ${CAVE.floor + 1}`} stroke="#c9946e" strokeWidth={4} strokeLinecap="round" />
  </g>
)

/** The ledge high on the hillside: a flat shelf of rock (the lamb hides behind the little rock on it). */
const Ledge = () => (
  <g strokeLinejoin="round">
    <path d="M138 222 Q140 210 168 208 L250 208 Q268 210 266 224 L258 246 Q200 254 146 244 Z" fill="#b98262" stroke="#8a5a40" strokeWidth={3} />
    <path d="M142 222 Q200 230 262 222" stroke="#d9a983" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M168 236 l8 6 M222 238 l-6 7" stroke="#8a5a40" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
  </g>
)

// ---------- The picture ----------

function Picture() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sun x={84} y={70} s={0.7} />
      <Cloud x={300} y={64} s={0.6} slow />
      <MountainOfGod x={520} y={262} w={660} h={246} />
      {/* the hillside, with its ledge and its cave */}
      <path d="M-10 250 Q110 200 240 212 Q370 226 470 206 Q600 178 700 196 Q760 206 810 198 L810 340 L-10 340 Z" fill="#d9a983" stroke="#b9845e" strokeWidth={3} strokeLinejoin="round" />
      <g stroke="#c6936c" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8}>
        <path d="M40 270 q40 -10 80 -4" /><path d="M330 250 q50 -8 90 -2" /><path d="M560 228 q36 -8 70 -2" /><path d="M720 232 q30 -6 60 0" />
      </g>
      <Ledge />
      <LEDGE_ROCK />
      <Cave />
      <OUTCROP />
      <Palm x={556} y={306} s={0.58} />
      {/* the sand at the foot of the hillside */}
      <path d="M-10 334 Q200 316 400 330 T810 324 L810 460 L-10 460 Z" fill="#f2d39a" />
      <path d="M-10 398 Q240 374 480 396 T810 388 L810 460 L-10 460 Z" fill="#e8bf7a" />
      <Palm x={58} y={344} s={0.86} />
      <BIG_BOULDER />
      <LEFT_BUSH />
      <DUNE />
      <TALL_ROCK />
      <RIGHT_BUSH />
      {/* Moses, looking for his sheep */}
      <Person x={362} y={350} s={0.62} look={MOSES} holding="staff" blinkDelay={0.7} />
    </Scene>
  )
}

// ---------- The animals (each centred on its spot: hidden, then found) ----------

/** Draws `children` (in board units) inside a target's Draw, centred on `at`. */
const Board = ({ at, children }: { at: At; children: ReactNode }) => <g transform={`translate(${-at[0]} ${-at[1]})`}>{children}</g>

/** A happy "Baa!" (or "Maa!") popping up by a found animal's head, at (x, y) in board units. */
const Baa = ({ x, y, word = 'Baa!' }: { x: number; y: number; word?: string }) => (
  <g className="bb-baa">
    <text x={x} y={y} fontSize={22} fontWeight={800} textAnchor="middle" fill="#8a4fc4" stroke="#ffffff" strokeWidth={5} strokeLinejoin="round" paintOrder="stroke"
      fontFamily="'Baloo 2', 'Chalkboard SE', system-ui, sans-serif">{word}</text>
  </g>
)

/**
 * One animal hiding: hidden, it's drawn at `hide` (feet, board units) with its hiding place over it; found, it's
 * drawn at `show` with its "Baa!". `animal` draws it with its feet at (x, y).
 */
function hider(at: At, cover: () => ReactNode, hide: At, show: At, animal: (x: number, y: number, found: boolean) => ReactNode, baa: At, word?: string) {
  return function Hider({ found }: { found: boolean }) {
    return (
      <Board at={at}>
        {found ? (
          <g>
            {animal(show[0], show[1], true)}
            <Baa x={baa[0]} y={baa[1]} word={word} />
          </g>
        ) : (
          <g>
            {animal(hide[0], hide[1], false)}
            {cover()}
          </g>
        )}
      </Board>
    )
  }
}

/** The sheep in the cave: hidden, only its eyes shine in the dark; found, it stands in the cave's mouth. */
function CaveSheep({ found }: { found: boolean }) {
  const at: At = [CAVE.x, 256]
  return (
    <Board at={at}>
      {found ? (
        <g>
          <Sheep x={CAVE.x + 4} y={CAVE.floor - 2} s={0.56} facing="left" />
          <Baa x={CAVE.x - 26} y={CAVE.floor - 64} />
        </g>
      ) : (
        // far back in the dark: a sheep, dim but woolly, its eye shining (over the sheep's own eye)
        <g>
          <Sheep x={CAVE.x + 10} y={CAVE.floor - 8} s={0.46} facing="left" />
          <path d={`M${CAVE.x - 30} ${CAVE.floor} Q${CAVE.x - 31} ${CAVE.floor - 40} ${CAVE.x} ${CAVE.floor - 44} Q${CAVE.x + 31} ${CAVE.floor - 40} ${CAVE.x + 30} ${CAVE.floor} Z`} fill="#2a1d1f" opacity={0.45} />
          <g className="pa-blink" style={{ '--d': '0.6s' } as CSSProperties}>
            <circle cx={CAVE.x + 10 - 45 * 0.46} cy={CAVE.floor - 8 - 43 * 0.46} r={2.5} fill="#fffbe8" />
            <circle cx={CAVE.x + 10 - 45.8 * 0.46} cy={CAVE.floor - 8 - 43 * 0.46} r={1.3} fill="#2b2140" />
          </g>
        </g>
      )}
    </Board>
  )
}

const sheep = (facing: 'left' | 'right', s: number) => (x: number, y: number) => <Sheep x={x} y={y} s={s} facing={facing} />
const goat = (facing: 'left' | 'right', s: number, coat?: string, patch?: string) => (x: number, y: number) => <Goat x={x} y={y} s={s} facing={facing} coat={coat} patch={patch} />

const target = (id: string, at: At, r: number, say: string, Draw: SpotTarget['Draw']): SpotTarget => ({ id, at, r, say, Draw })

/** Where each one hides (its tap circle's middle). */
const SPOTS = {
  boulder: [178, 392] as At,
  leftBush: [282, 398] as At,
  ledge: [200, 196] as At,
  dune: [434, 384] as At,
  outcrop: [516, 258] as At,
  cave: [CAVE.x, 256] as At,
  tallRock: [742, 270] as At,
  rightBush: [606, 402] as At,
}

export const BURNING_BUSH_GAME: SpotKit = {
  Picture,
  targets: [
    // a sheep behind the big boulder: its head peeks round the rock; found, it steps out in front
    target('boulder-sheep', SPOTS.boulder, 46, 'A sheep!', hider(SPOTS.boulder, BIG_BOULDER, [162, 418], [198, 440], sheep('right', 0.64), [222, 384])),
    // a sheep behind the bush: its head and woolly back peek over the top; found, it comes out in front
    target('bush-sheep', SPOTS.leftBush, 46, 'Another sheep!', hider(SPOTS.leftBush, LEFT_BUSH, [276, 392], [296, 446], sheep('right', 0.62), [336, 392])),
    // a little lamb on the high ledge, peeking over the little rock; found, it stands on the ledge
    target('ledge-lamb', SPOTS.ledge, 42, 'A little lamb!', hider(SPOTS.ledge, LEDGE_ROCK, [222, 200], [196, 228], sheep('left', 0.42), [168, 180])),
    // a sheep behind the dune: its ears and the top of its head over the crest; found, it stands on top
    target('dune-sheep', SPOTS.dune, 44, 'A sheep on the sand!', hider(SPOTS.dune, DUNE, [418, 412], [436, 392], sheep('right', 0.58), [476, 336])),
    // a sheep behind the rock on the hillside: its head round the rock's edge; found, it stands beside it
    target('outcrop-sheep', SPOTS.outcrop, 44, 'A sheep by the rocks!', hider(SPOTS.outcrop, OUTCROP, [508, 272], [530, 296], sheep('right', 0.52), [566, 238])),
    // a sheep in the cave: only its eyes in the dark; found, it stands in the cave's mouth
    target('cave-sheep', SPOTS.cave, 44, 'A sheep in the cave!', CaveSheep),
    // a goat behind the tall rock: only its horns over the top; found, it stands right up on top (goats love to climb)
    target('rock-goat', SPOTS.tallRock, 44, 'A goat! He likes to climb.', hider(SPOTS.tallRock, TALL_ROCK, [756, 322], [748, 292], goat('left', 0.6), [700, 236], 'Maa!')),
    // a goat behind the other bush: its horns and tail peek out; found, it comes out in front
    target('bush-goat', SPOTS.rightBush, 46, 'A goat!', hider(SPOTS.rightBush, RIGHT_BUSH, [598, 418], [616, 448], goat('left', 0.6, '#f2ece2', '#4a3a33'), [570, 380], 'Maa!')),
  ],
}
