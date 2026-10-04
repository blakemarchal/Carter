// Zacchaeus: the pictures for the island's mini-game, "Help Zacchaeus Share" (Share it: see activities/games/types.ts,
// ShareKit). At dinner Zacchaeus promised to give half of all he had to the poor (Luke 19:8); after the story, the
// child helps him keep that promise, sharing his coins with people who need them so that everyone gets the same.
// (Paying back four times as much is the farmer's part, on page 11: not shared out evenly, so not in this game.)
// The people are the story's own poor (looks in art/scenes/zacchaeus.tsx: the grandma, the grandpa and her two
// grandchildren, who all have two coins each on page 11): each is a piece about 160 tall (the children less), centred
// on (0, 0), feet on the ground at y = 80. The coin is the drawn gold coin (🪙).
import type { ShareKit } from '../../activities/games/types'
import { BOY, GIRL, Grandma, Grandpa, Townsperson } from '../scenes/zacchaeus'

const FEET = 80

export const ZACCHAEUS_GAME: ShareKit = {
  item: { emoji: '🪙', say: 'coin', art: 'gold-coin' },
  plural: 'coins',
  // In the order they join in: the grandma and the grandpa first, then the girl, then the boy.
  people: [
    { id: 'grandma', say: 'the grandma', Draw: () => <Grandma x={0} y={FEET} s={1.08} blinkDelay={1.5} /> },
    { id: 'grandpa', say: 'the grandpa', Draw: () => <Grandpa x={0} y={FEET} s={1.08} blinkDelay={0.4} /> },
    { id: 'girl', say: 'the girl', Draw: () => <Townsperson look={GIRL} x={0} y={FEET} s={1.3} pose="arms-up" mood="joy" blinkDelay={0.9} /> },
    { id: 'boy', say: 'the boy', Draw: () => <Townsperson look={BOY} x={0} y={FEET} s={1.3} pose="wave" blinkDelay={1.2} /> },
  ],
  // Six coins for two (three each), the same six coins for three (two each: more people, fewer each), then eight for
  // four (two each, as on page 11). (Twenty drags in all: plenty for small hands.)
  rounds: [{ items: 6, people: 2 }, { items: 6, people: 3 }, { items: 8, people: 4 }],
}
