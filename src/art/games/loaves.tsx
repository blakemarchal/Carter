// Five Loaves and Two Fish: the pictures for the island's mini-game, "Share the bread" (Share it: see
// activities/games/types.ts, ShareKit). Jesus' friends passed the bread out to the people sitting on the
// grass (John 6:11); here the child helps, giving everyone the same.
// The people are from the crowd on the hill, drawn like the story's people (looks in art/scenes/loaves.tsx):
// each is a piece about 160 tall (the children less), centred on (0, 0), feet on the ground at y = 80.
import type { ShareKit } from '../../activities/games/types'
import { Person, PEOPLE } from '../people'
import { BABY_MOM, DAD, GIRL, GRANDPA } from '../scenes/loaves'

const FEET = 80

export const LOAVES_SHARE: ShareKit = {
  item: { emoji: '🍞', say: 'loaf of bread', art: 'bread' },
  plural: 'loaves of bread',
  // In the order they join in: each round shares among the first few (the boy who gave his lunch comes last).
  people: [
    // (the baby in her arms doesn't eat bread yet: the share is hers)
    { id: 'mom', say: 'the mom', Draw: () => <Person x={0} y={FEET} s={1.1} look={BABY_MOM} pose="hold" holding="baby" blinkDelay={0.4} /> },
    { id: 'grandpa', say: 'the grandpa', Draw: () => <Person x={0} y={FEET} s={1.1} look={GRANDPA} holding="stick" blinkDelay={1.5} /> },
    { id: 'girl', say: 'the girl', Draw: () => <Person x={0} y={FEET} s={1.3} look={GIRL} pose="wave" blinkDelay={0.9} /> },
    { id: 'boy', say: 'the boy', Draw: () => <Person x={0} y={FEET} s={1.3} look={PEOPLE.boy} blinkDelay={1.2} /> },
    { id: 'dad', say: 'the dad', Draw: () => <Person x={0} y={FEET} s={1.12} look={DAD} blinkDelay={2.1} /> },
  ],
  // Always two each, among more and more people (the boy who shared his lunch joins in the last round).
  // (Three rounds: about twenty drags is plenty for small hands; the dad waits for a longer game.)
  rounds: [{ items: 4, people: 2 }, { items: 6, people: 3 }, { items: 8, people: 4 }],
}
