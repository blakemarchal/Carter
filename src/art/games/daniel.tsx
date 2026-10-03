// Daniel and the Lions: the island's mini-game, Spot it ("The Gentle Lions"). Inside the den at night, with
// moonlight falling through the opening in the roof, Daniel kneels and prays, and God's angel shines beside him.
// Six lions stand around the den, wide awake (alert, but never scary: their mouths stay shut). Tapping a lion
// finds it: it lies down gently, closes its eyes, and falls asleep. (activities/games/types.ts, SpotKit.)
import type { SpotKit, SpotTarget } from '../../activities/games/types'
import { Person, PEOPLE } from '../people'
import { DanielKneeling, DenInside, GentleLion, MANES, ShutEyes } from '../scenes/daniel'
import { Glow, Scene } from '../scenes/kit'

/** The den, Daniel and the angel, without the lions. */
function Picture() {
  return (
    <Scene sky="night" ground="none" clouds={false} stars={false}>
      <ShutEyes />
      <DenInside time="night" hole={392} door={86} ledges={[[230, 202, 150], [590, 202, 150]]} />
      <Glow x={478} y={300} r={140} color="#fff3c0" />
      <Person x={478} y={404} s={0.76} look={PEOPLE.angel} pose="wave" facing="left" blinkDelay={0.6} />
      <g className="dn-shut"><DanielKneeling x={372} y={426} s={0.98} /></g>
    </Scene>
  )
}

/**
 * Each lion: where its middle is, which way it faces, how it stands before it's found, and its size (the ones up
 * on the shelves are a little further back). A lion's feet are 45 times its size below its middle.
 */
const LIONS: { at: [number, number]; facing: 'left' | 'right'; pose: 'stand' | 'walk'; s: number }[] = [
  { at: [228, 160], facing: 'right', pose: 'stand', s: 0.92 }, // up on the shelf on the left
  { at: [180, 300], facing: 'right', pose: 'walk', s: 0.98 },
  { at: [98, 396], facing: 'left', pose: 'stand', s: 1.04 }, // (the front two face out, so their Zs have room)
  { at: [592, 160], facing: 'left', pose: 'stand', s: 0.92 }, // up on the shelf on the right
  { at: [628, 300], facing: 'left', pose: 'walk', s: 0.98 },
  { at: [712, 396], facing: 'right', pose: 'stand', s: 1.04 },
]

const targets: SpotTarget[] = LIONS.map(({ at, facing, pose, s }, i) => ({
  id: `lion-${i + 1}`,
  at,
  r: 56,
  Draw: ({ found }: { found: boolean }) => (
    <GentleLion x={0} y={45 * s} s={s} facing={facing} pose={found ? 'sleep' : pose} mane={MANES[i]} blinkDelay={i * 0.7} />
  ),
}))

export const DANIEL_GAME: SpotKit = { Picture, targets }
