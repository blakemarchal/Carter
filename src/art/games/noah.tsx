// Noah's Ark: the pictures for the island's mini-game, "Build the Ark" (activities/games/types.ts,
// BuildKit). The parts are the kit Ark's own pieces (art/scenes/noah.tsx: ArkHull, ArkHouse…), so the
// finished build is the story's ark exactly: the boat, the house on it, its roof, the windows, the door
// and the ramp. It's built on the meadow by the sea; when it's done, Noah's family cheers, the lions
// walk up the ramp, the elephants and a giraffe look out, and two doves fly round.
import type { ComponentType } from 'react'
import type { BuildKit, BuildPart } from '../../activities/games/types'
import { Cloud, Dove, House, Scene, Sparkles, Sun, Tree } from '../scenes/kit'
import { Person, PEOPLE } from '../people'
import {
  ArkDoor, ArkHouse, ArkHull, ArkRamp, ArkRoof, ArkWindows, ElephantHead, GiraffeNeck, HAM, InWindow, JAPHETH, Lion, onRamp,
  RAMP_TILT, SHEM,
} from '../scenes/noah'

/** Where the ark goes on the board, and its size (a kit Ark at (AX, AY) scale S). */
const AX = 510, AY = 318, S = 1.3

/**
 * One piece of the ark. `box` is where it is in the ark's own units [left, top, right, bottom], so the
 * piece is drawn around its own middle, and that middle goes to the same spot on the board.
 */
function part(id: string, say: string, box: [number, number, number, number], Draw: ComponentType, after?: string[]): BuildPart {
  const [x0, y0, x1, y1] = box
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  return {
    id, say, after,
    Draw: () => <g transform={`scale(${S}) translate(${-cx} ${-cy})`}><Draw /></g>,
    at: [AX + cx * S, AY + cy * S],
    size: [(x1 - x0) * S, (y1 - y0) * S],
  }
}

/** The meadow by the sea where the ark is built: wood ready to use, and Noah's house up on the hill. */
function Backdrop() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sun x={86} y={74} s={0.8} />
      <Cloud x={430} y={58} s={0.75} slow />
      <Cloud x={690} y={80} s={0.9} />
      {/* the sea, far off behind the meadow */}
      <rect x={0} y={258} width={800} height={110} fill="#5fb7ef" />
      {[[476, 280], [612, 296], [726, 274], [548, 312]].map(([wx, wy]) => <path key={wx} d={`M${wx} ${wy} q12 -6 24 0`} stroke="#bfe6ff" strokeWidth={2.5} fill="none" strokeLinecap="round" />)}
      {/* the hill with Noah's house, then the meadow */}
      <path d="M0 262 Q100 206 220 226 Q330 244 430 300 L430 360 L0 360 Z" fill="#a8d8a0" />
      <House x={170} y={232} w={52} />
      <Tree x={62} y={250} s={0.5} />
      <Tree x={292} y={256} s={0.42} />
      <path d="M0 330 Q240 304 470 326 Q640 342 800 318 L800 450 L0 450 Z" fill="#8fd18a" />
      <path d="M0 376 Q220 354 430 380 T800 370 L800 450 L0 450 Z" fill="#7cc46a" />
      {[[184, 430], [610, 412], [330, 432], [470, 420]].map(([fx, fy], i) => (
        <g key={fx} transform={`translate(${fx} ${fy})`}>
          <path d="M0 0 L0 -12" stroke="#3f9a4a" strokeWidth={2.5} />
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-18} rx={4} ry={6} fill={['#ff8cc0', '#ffd34d', '#ffffff', '#ff8cc0'][i]} transform={`rotate(${a} 0 -13)`} />)}
          <circle cx={0} cy={-13} r={3} fill="#ffd34d" />
        </g>
      ))}
      {/* boards ready to build with */}
      {[0, 1, 2].map((i) => <rect key={i} x={36 + (i % 2) * 6} y={384 + i * 11} width={86} height={11} rx={4} fill="#c98448" stroke="#8a5428" strokeWidth={2.5} />)}
    </Scene>
  )
}

/** Hooray, the ark is built: everyone comes to see. Drawn over the finished ark, in board units. */
function Finished() {
  const [l1x, l1y] = onRamp(0.3, AX, AY, S)
  const [l2x, l2y] = onRamp(0.62, AX, AY, S)
  const family = [[56, 438, PEOPLE.noahsWife, 0.6], [128, 444, SHEM, 0.62], [702, 440, HAM, 0.6], [760, 446, JAPHETH, 0.58]] as const
  return (
    <g>
      <g transform={`translate(${AX} ${AY}) scale(${S})`}>
        {/* a giraffe looking out of a hatch in the roof, and the two elephants at the windows */}
        <ellipse cx={52} cy={-122} rx={13} ry={4.5} fill="#4a2c14" />
        <GiraffeNeck x={52} y={-120} s={0.64} />
        <rect x={37} y={-125.5} width={30} height={7} rx={3} fill="#8a5428" stroke="#5a3418" strokeWidth={2} />
        <InWindow wx={-50}><ElephantHead x={-50} y={-88} s={0.34} /></InWindow>
        <InWindow wx={50}><ElephantHead x={50} y={-88} s={0.34} /></InWindow>
      </g>
      <Person x={AX} y={AY - 40 * S} s={0.385} look={PEOPLE.noah} pose="wave" facing="left" />
      <Lion x={l1x} y={l1y} s={0.57} tilt={RAMP_TILT} />
      <Lion x={l2x} y={l2y} s={0.57} tilt={RAMP_TILT} />
      {family.map(([x, y, look, s], i) => <Person key={i} x={x} y={y} s={s} look={look} pose="arms-up" blinkDelay={i * 0.6} />)}
      <Dove x={300} y={124} s={0.75} />
      <Dove x={712} y={176} s={0.7} facing="left" />
      <Sparkles spots={[[352, 156, 9], [664, 128, 9], [470, 92, 11], [246, 232, 7], [776, 236, 7]]} />
    </g>
  )
}

// The game draws the parts in building order, the boat first, but the kit Ark draws the boat's top edge
// over the bottom of the house and the door. So those two carry that bit of edge with them: built, the
// ark looks just like the kit's.
const sill = (x0: number, x1: number) => <path d={`M${x0} -40 L${x1} -40`} stroke="#6f3f18" strokeWidth={4} />
const HouseOnDeck = () => <><ArkHouse />{sill(-92, 92)}</>
const DoorOnDeck = () => <><ArkDoor />{sill(-17.5, 17.5)}</>

export const NOAH_GAME: BuildKit = {
  Backdrop,
  // (Each part names everything that goes in before it, the boat too. Tried too early, a part hears the
  // first one still to go in ("First the boat!") while that one lights up in the tray. The ramp only
  // needs the boat to lean on.)
  parts: [
    part('boat', 'the boat', [-170, -40, 170, 30], ArkHull),
    part('house', 'the house', [-90, -110, 90, -40], HouseOnDeck, ['boat']),
    part('roof', 'the roof', [-104, -150, 104, -110], ArkRoof, ['boat', 'house']),
    part('windows', 'the windows', [-62, -96, 62, -76], ArkWindows, ['boat', 'house']),
    part('door', 'the door', [-16, -82, 16, -40], DoorOnDeck, ['boat', 'house']),
    part('ramp', 'the ramp', [-226, -40, 8, 58], ArkRamp, ['boat']),
  ],
  Finished,
}
