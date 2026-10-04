// Zacchaeus: the pictures for the island's mini-game, "Giving It Back" (Share it: see activities/games/types.ts,
// ShareKit). After dinner with Jesus, Zacchaeus gives back what he took and shares with the poor (Luke 19:8);
// the child helps him share his coins fairly among the people of Jericho, a few at a time.
// The people are the story's own townsfolk (looks in art/scenes/zacchaeus.tsx): each is a piece about 160 tall
// (the children less), centred on (0, 0), feet on the ground at y = 80. The coin is the drawn gold coin (🪙).
import type { ShareKit } from '../../activities/games/types'
import { BOY, FARMER, GIRL, Grandma, Townsperson } from '../scenes/zacchaeus'

const FEET = 80

export const ZACCHAEUS_GAME: ShareKit = {
  item: { emoji: '🪙', say: 'coin', art: 'gold-coin' },
  plural: 'coins',
  // In the order they join in: the farmer he took too much from and the poor grandma first, then her grandchildren.
  people: [
    { id: 'farmer', say: 'the farmer', Draw: () => <Townsperson look={FARMER} x={0} y={FEET} s={1.1} pose="wave" blinkDelay={0.4} /> },
    { id: 'grandma', say: 'the grandma', Draw: () => <Grandma x={0} y={FEET} s={1.08} blinkDelay={1.5} /> },
    { id: 'girl', say: 'the girl', Draw: () => <Townsperson look={GIRL} x={0} y={FEET} s={1.3} pose="arms-up" mood="joy" blinkDelay={0.9} /> },
    { id: 'boy', say: 'the boy', Draw: () => <Townsperson look={BOY} x={0} y={FEET} s={1.3} pose="wave" blinkDelay={1.2} /> },
  ],
  // Six coins for two (three each), the same six coins for three (two each: more people, fewer each), then eight for
  // four. (Twenty drags in all: plenty for small hands.)
  rounds: [{ items: 6, people: 2 }, { items: 6, people: 3 }, { items: 8, people: 4 }],
}
