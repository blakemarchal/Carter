// Jesus Calms the Storm: the pictures for the island's mini-game (activities/games/types.ts says what each
// kind of game needs). TODO: pick the game that fits the story, and draw its kit.
import type { SpotKit } from '../../activities/games/types'
import { Emoji, Scene } from '../scenes/kit'

export const STORM_GAME: SpotKit = {
  Picture: () => <Scene sky="day" ground="meadow" />,
  targets: [[200, 360], [420, 330], [640, 380]].map(([x, y], i) => ({
    id: `thing-${i}`, at: [x, y] as [number, number], r: 50,
    Draw: ({ found }: { found: boolean }) => <g opacity={found ? 1 : 0.6}><Emoji e="🐑" x={0} y={0} size={70} /></g>,
  })),
}
