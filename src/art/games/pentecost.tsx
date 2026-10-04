// Pentecost: the island's mini-game kit (activities/games/types.ts). "When the Spirit Came" is a Build it game: the child
// builds the picture of the day God's Spirit came (Acts 2:1–6), in order: Jesus' friends praying in the room upstairs
// (Peter and his friends, and Mary and her friends), the rushing wind from heaven (soft swirls over the roof and through
// the room), a little flame of light over each friend (four little flames, then three more: seven), and the crowd from
// many lands who came running to see. Then God's light shines down on the house: the friends lift up their hands for joy
// and tell about God's wonders (bubbles with the rainbow, the stars, the big fish…), and the crowd cheers.
// It's the house with the room upstairs from the story (art/scenes/pentecost.tsx: UpperHouse, open at the front so you
// can see in), with the same friends, flames and visitors. Each part draws its people twice, still and joyful, and
// scenes/pentecost.css shows the joyful ones once the picture is finished (BuildIt's root gets the class "finished").
import type { ComponentType } from 'react'
import type { BuildKit, BuildPart } from '../../activities/games/types'
import { Kneel, Laughing, LaughFace, PEOPLE, ShutEyes, type Look, type Pose } from '../people'
import { Cloud, Glow, Heart, MusicNote, Rays, Scene, Sparkles, Sun } from '../scenes/kit'
import {
  FarTemple, FRIENDS, Gust, HOUSE, Roofs, SpiritFlame, UpperHouse, VISITORS, VisitorFigure, WonderBubble,
} from '../scenes/pentecost'

/** Where the house goes on the board (the ground under the middle of its front), and how big it is. */
const HX = 290, HY = 422, HS = 0.95
/** How big the people are, next to the house. */
const PS = 0.72 * HS
/** Where the friends kneel: on the floor of the room upstairs. */
const KY = HY + (HOUSE.floor - 1) * HS
/** A spot in the house's own units, on the board. */
const bx = (hx: number) => HX + hx * HS

/** The friends in the room, left to right: the four fishermen, then Mary between two friends. [look, x in house units, their joyful pose]. */
const FRIENDS_1: [Look, number, Pose][] = [[PEOPLE.andrew, -205, 'arms-up'], [PEOPLE.peter, -150, 'pray'], [PEOPLE.john, -95, 'arms-up'], [PEOPLE.james, -40, 'pray']]
const FRIENDS_2: [Look, number, Pose][] = [[FRIENDS[0], 15, 'pray'], [PEOPLE.mary, 70, 'arms-up'], [PEOPLE.disciple, 125, 'pray']]

/** A flame's foot, over a friend's head (on the board), and how tall it is. */
const FLAME_Y = KY + (26 - 150) * PS
const FLAME_H = 30 * PS

/**
 * One part, drawn on the board where it goes: `box` is the part's [left, top, right, bottom] on the board, so it's drawn
 * round its own middle, and that middle goes to the same spot.
 */
function piece(id: string, say: string, box: [number, number, number, number], Draw: ComponentType, after?: string[]): BuildPart {
  const [x0, y0, x1, y1] = box
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  return {
    id, say, after,
    Draw: () => <g transform={`translate(${-cx} ${-cy})`}><Draw /></g>,
    at: [cx, cy],
    size: [x1 - x0, y1 - y0],
  }
}

/** Friends kneeling in the room: praying with their eyes shut, and (when the picture is finished) full of joy. */
function Kneelers({ who }: { who: [Look, number, Pose][] }) {
  return (
    <g>
      <g className="pc-still dn-shut">
        <ShutEyes />
        {who.map(([look, x], i) => <Kneel key={x} x={bx(x)} y={KY} s={PS} look={look} pose="pray" blinkDelay={i * 0.5} />)}
      </g>
      <g className="pc-joy">
        <Laughing>
          {who.map(([look, x, pose], i) => <Kneel key={x} x={bx(x)} y={KY} s={PS} look={look} pose={pose} blinkDelay={i * 0.5}><LaughFace beard={!!look.beard} /></Kneel>)}
        </Laughing>
      </g>
    </g>
  )
}

/** The little flames over some of the friends' heads. */
const Flames = ({ who }: { who: [Look, number, Pose][] }) => (
  <g>{who.map(([, x], i) => <SpiritFlame key={x} x={bx(x)} y={FLAME_Y} h={FLAME_H} d={i * 0.4} />)}</g>
)

/** The rushing wind from heaven: big soft swirls pouring down from the sky, over the roof, and through the room upstairs. */
function Wind() {
  const blue = '#5f9fd8'
  return (
    <g>
      <Gust x={474} y={58} len={196} flip rot={-14} d={0} w={8} o={1} edge={blue} eo={0.9} />
      <Gust x={452} y={116} len={232} flip rot={-2} d={0.9} w={8} o={1} edge={blue} eo={0.9} />
      <Gust x={414} y={172} len={214} flip d={1.7} w={7} o={1} edge={blue} eo={0.9} />
    </g>
  )
}

/** The crowd from many lands in the street: [x, y, s, visitor, their pose] (amazed while the picture is built, then cheering). */
const CROWD: [number, number, number, number, 'stand' | 'wave' | 'open'][] = [
  [560, 408, 0.58, 2, 'stand'], [628, 410, 0.58, 8, 'wave'], [696, 408, 0.58, 1, 'open'], [764, 410, 0.58, 6, 'stand'],
  [336, 446, 0.66, 11, 'wave'], [404, 448, 0.66, 0, 'open'], [470, 446, 0.6, 9, 'wave'], [534, 448, 0.66, 3, 'stand'],
  [602, 446, 0.66, 7, 'open'], [670, 448, 0.66, 5, 'wave'], [738, 446, 0.62, 10, 'stand'],
]

function Crowd() {
  const one = (joy: boolean) => CROWD.map(([x, y, s, v, pose], i) => (
    <VisitorFigure key={i} x={x} y={y} s={s} v={VISITORS[v]} pose={joy ? (i % 2 ? 'arms-up' : 'wave') : pose}
      mood={joy ? 'joy' : i % 3 === 1 ? 'happy' : 'wow'} facing={x > HX ? 'left' : 'right'} blinkDelay={i * 0.37} />
  ))
  return (
    <g>
      <g className="pc-still">{one(false)}</g>
      <g className="pc-joy">{one(true)}</g>
    </g>
  )
}

/** A Jerusalem street on a bright morning: the house with the room upstairs, open at the front, with nobody there yet. */
function Backdrop() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Sun x={728} y={62} s={0.6} />
      <Cloud x={150} y={50} s={0.55} slow />
      <Roofs spots={[[560, 350, 60, 78], [618, 350, 56, 56], [672, 350, 54, 92], [730, 350, 62, 64], [786, 350, 56, 80]]} />
      <FarTemple x={690} y={318} s={0.42} />
      <rect x={0} y={346} width={800} height={104} fill="#e9d3a6" />
      {[372, 398, 424].map((y) => <path key={y} d={`M0 ${y} H800`} stroke="#d8bd88" strokeWidth={1.6} opacity={0.7} />)}
      <UpperHouse x={HX} y={HY} s={HS} open />
    </Scene>
  )
}

/** The picture finished: God's light shines down on the house, the friends tell about God's wonders, and the crowd cheers (and everyone's joy shows: see Kneelers and Crowd). */
function Finished() {
  const roomX = bx(-40), roomY = HY + -206 * HS
  return (
    <g>
      <Rays x={roomX} y={-30} r={480} n={18} color="#fff6c8" opacity={0.42} />
      <g opacity={0.35}><Glow x={roomX} y={roomY - 30} r={230} color="#fff3c4" /></g>
      <WonderBubble x={92} y={70} r={24} to={[bx(-205), 150]} e="🌈" />
      <WonderBubble x={196} y={50} r={24} to={[bx(-150), 150]} e="💛" />
      <WonderBubble x={300} y={64} r={24} to={[bx(-95), 150]} e="🐋" />
      <WonderBubble x={404} y={48} r={24} to={[bx(15), 150]} e="⭐" />
      <WonderBubble x={502} y={74} r={24} to={[bx(70), 150]} e="🦁" />
      <Heart x={612} y={262} s={0.55} shaded />
      <Heart x={704} y={232} s={0.65} color="#ffcf3f" shaded />
      <Heart x={780} y={276} s={0.45} shaded />
      <MusicNote x={640} y={232} s={0.9} />
      <MusicNote x={760} y={300} s={0.8} double />
      <Sparkles spots={[[130, 120, 8], [250, 112, 9], [370, 120, 8], [470, 140, 7], [560, 190, 8], [40, 240, 7], [620, 120, 9]]} />
    </g>
  )
}

const FRIENDS_IN = ['friends-1', 'friends-2']
const left = (who: [Look, number, Pose][]) => bx(who[0][1]) - 28
const right = (who: [Look, number, Pose][]) => bx(who[who.length - 1][1]) + 28

export const PENTECOST_GAME: BuildKit = {
  Backdrop,
  // (In building order: each part names everything that goes in before it, so tried too early it hears the first one
  // still to go in ("First Peter and his friends!"). The friends can go in either way round; then the wind; then the
  // flames, four and then three more; and last the crowd, who heard the sound and came running.)
  parts: [
    piece('friends-1', 'Peter and his friends', [left(FRIENDS_1), KY - 82, right(FRIENDS_1), KY + 6], () => <Kneelers who={FRIENDS_1} />),
    piece('friends-2', 'Mary and her friends', [left(FRIENDS_2), KY - 82, right(FRIENDS_2), KY + 6], () => <Kneelers who={FRIENDS_2} />),
    piece('wind', 'the rushing wind', [186, 34, 484, 196], Wind, FRIENDS_IN),
    piece('flames-1', 'four little flames', [left(FRIENDS_1) + 6, FLAME_Y - FLAME_H - 6, right(FRIENDS_1) - 6, FLAME_Y + 4], () => <Flames who={FRIENDS_1} />, [...FRIENDS_IN, 'wind']),
    piece('flames-2', 'three more flames', [left(FRIENDS_2) + 6, FLAME_Y - FLAME_H - 6, right(FRIENDS_2) - 6, FLAME_Y + 4], () => <Flames who={FRIENDS_2} />, [...FRIENDS_IN, 'wind', 'flames-1']),
    piece('crowd', 'the crowd from many lands', [300, 330, 796, 450], Crowd, [...FRIENDS_IN, 'wind', 'flames-1', 'flames-2']),
  ],
  Finished,
}
