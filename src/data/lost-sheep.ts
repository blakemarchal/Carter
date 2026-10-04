import type { Step, StoryPage } from './islands'
import { LOST_SHEEP_GAME } from '../art/games/lost-sheep'

// The Lost Sheep (Luke 15:3–7). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in
// words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// God loves each one of us, and He comes to find us. The little lamb is never hurt or in danger: a bit stuck in a
// bush and a bit scared, and found. The game at the end of part one has the child find the lamb on the evening hill,
// so the search in part two is never worrying: everyone already knows it ends well.
// A hundred sheep is a crowd, not a count: the pictures show a big flock and a full fold, and counting sticks to
// small numbers that are really drawn.

/** Visit 1: Jesus tells a story: the shepherd and his flock, the littlest lamb, one missing, and off he goes to look. */
export const LOST_SHEEP_STORY_1: StoryPage[] = [
  { scene: '🧔🏽👨‍👩‍👧', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Jesus loved to tell stories, and all kinds of people came to listen. One day, Jesus told them this story.' },
  { scene: '🐑🐑🐑', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'There once was a shepherd who had one hundred sheep! Every day, he led them to green grass and cool water.' },
  { scene: '🧔🏽🐑💛', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'The shepherd took good care of his sheep. He loved every one of them, even the littlest lamb.' },
  { scene: '🌅🐑❓', bg: 'linear-gradient(#6b5bb5,#ffa8b8)', text: 'Every evening, he counted his sheep into the sheepfold. One evening he counted: ninety-seven, ninety-eight, ninety-nine. Oh no! One little lamb was missing!' },
  { scene: '🌙🏮', bg: 'linear-gradient(#6b5bb5,#ffa8b8)', text: 'The shepherd made sure his ninety-nine sheep were safe together. Then off he went, to look for his little lost lamb.' },
]

/** Visit 2: the search by moonlight, the lamb in the bush, home on his shoulders, the party, and what Jesus said. Its pictures follow part one's. */
export const LOST_SHEEP_STORY_2: StoryPage[] = [
  { scene: '🌙🪨🌳', bg: 'linear-gradient(#18163f,#3b3486)', text: 'Remember the little lost lamb? The shepherd looked for it over the hills, behind the rocks, and through the bushes. "Little lamb! Where are you?" he called.' },
  { scene: '🐑🌿', bg: 'linear-gradient(#18163f,#3b3486)', text: 'Then he heard a little voice: "Baa! Baa!" There was the little lamb, stuck in a bush! It was a little bit scared, but it was not hurt.' },
  { scene: '🧔🏽🐑🌅', bg: 'linear-gradient(#ffb3c7,#ffe8b0)', text: 'The shepherd gently lifted the lamb out of the bush and put it on his shoulders. He was so happy! Then he carried it all the way home.' },
  { scene: '🎉🐑🎶', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'He called his friends and neighbors: "Celebrate with me! I found my lost sheep!" And everyone was so happy.' },
  { scene: '💛✨', bg: 'linear-gradient(#fff1c2,#bfe6ff)', text: 'Jesus said God is like that shepherd. God loves every one of us so much, and He always comes looking for us. When one of us comes home to God, heaven is full of joy!' },
]

// (Story cards, `story:lost-sheep:<n>`, count the pages from 1 through both parts: part 2 starts at page 6.)

// World English Bible (public domain), word for word: the end of Luke 15:6, the shepherd's own happy words.
export const LOST_SHEEP_VERSE = {
  ref: 'Luke 15:6',
  chunks: ['Rejoice with me,', 'for I have found', 'my sheep', 'which was lost!'],
}

/** A story card for the put-it-in-order game: page n of the whole story (1 to 10). */
const card = (n: number, emoji: string, say: string) => ({ emoji, say, art: `story:lost-sheep:${n}` })

export const LOST_SHEEP_STEPS: Step[] = [
  // ----- Visit 1: the story -----
  { kind: 'story', title: 'The Lost Sheep', pages: LOST_SHEEP_STORY_1 },
  {
    // (The shepherd sets off as part one ends; the child helps him look, and finds the little lamb, hidden best.)
    kind: 'spot', title: 'Look for the Little Lamb', plural: 'animals', kit: LOST_SHEEP_GAME,
    intro: 'The shepherd is looking for his little lamb. Can you help him? Lots of animals are hiding on the hill. Tap every one you find, and look for the little lamb!',
    done: 'Hooray! You found everyone on the hill, and the little lamb, too! Listen. Baa, baa! The little lamb is calling for the shepherd.',
  },
  {
    // (Counting sheep into the fold, as the shepherd does every evening: page four. The sheep are the flock's, dark-faced,
    // not the little lamb; the fold is its front wall, so the sheep counted in show over it, standing inside.)
    kind: 'count', title: 'Count the Sheep',
    intro: 'Every evening, the shepherd counts his sheep into the sheepfold. Can you help him count?',
    item: { emoji: '🐑', say: 'sheep', art: 'flock-sheep' }, plural: 'sheep', basket: '🐑', basketArt: 'sheepfold', into: 'the sheepfold', rounds: [4, 7],
    done: 'All safe in the sheepfold! The shepherd counts his sheep every evening, because he loves every one of them.',
  },
  { kind: 'pause', line: "The little lamb is calling, baa, baa! Will the shepherd hear it? Let's find out next time!" },

  // ----- Visit 2: the adventure -----
  { kind: 'story', title: 'The Lamb Comes Home', pages: LOST_SHEEP_STORY_2, first: LOST_SHEEP_STORY_1.length },
  {
    kind: 'maze', title: 'Carry the Lamb Home',
    intro: 'The shepherd is carrying the little lamb home on his shoulders. Help them find the way back to the sheepfold!',
    hero: { emoji: '🐑', say: 'the shepherd', art: 'shepherd-carrying-lamb' }, goal: { emoji: '🐑', say: 'the sheepfold', art: 'sheepfold-home' },
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Lamb Words', decor: '🐑', intro: "Baa! The little lamb is safe at home, and it wants to play word games with you. Let's go!" },
  { kind: 'verse', chunks: LOST_SHEEP_VERSE.chunks, ref: LOST_SHEEP_VERSE.ref },
  { kind: 'pause', line: "Dig, dig, grumble! Somebody grumpy is digging under the hill, all alone. Who could it be? Let's find out next time!" },

  // ----- Visit 3: the rescue -----
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of the lost sheep? Put the pictures in order, from the first one to the last one.',
    // The story's own pictures, one from each part of the story, so no two cards look alike. Each `say` names its
    // picture ("That's <say>.").
    items: [
      card(2, '🐑', 'the shepherd with his sheep'),
      card(4, '🌅', 'the shepherd counting his sheep'),
      card(6, '🌙', 'the shepherd looking for the lamb'),
      card(7, '🌿', 'the little lamb stuck in a bush'),
      card(8, '🧔', 'the shepherd carrying the lamb home'),
      card(9, '🎉', 'the happy party with friends and neighbors'),
    ],
  },
  { kind: 'battle', foe: 'digger', intro: 'Oh no! A grumpy little mole named Digger is grumbling all alone under the hill! Digger just needs a friend.' },
  { kind: 'song', song: 'song-lost-sheep', intro: "The shepherd looked and looked until he found his little lamb! Let's sing about it. You can sing it on your Ark any time, too." },
  // (The shepherd carrying his little lamb home on his shoulders: the drawing in art/items/isl-lost-sheep.tsx.)
  { kind: 'reward', pal: 'scout', sticker: 'shepherd-carrying-lamb', stickerName: 'shepherd and lamb' },
]
