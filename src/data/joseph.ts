import type { Step, StoryPage } from './islands'
import { JOSEPH_PAINT } from '../art/games/joseph'

// Joseph's Coat (Genesis 37 and 39 to 45). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds,
// grace first, numbers in words, no emoji or symbols in anything spoken, and every page's picture shows
// what its words say. Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the
// adventure, the rescue. The pictures are in art/scenes/joseph.tsx, the coat game's in art/games/joseph.tsx.

/** Visit 1: the coat, the dream, and the jealous brothers, up to Joseph being taken far away to Egypt. */
export const JOSEPH_STORY_1: StoryPage[] = [
  { scene: '👨🏽‍🦳👦🏽⛺', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'Long ago, a man named Jacob had twelve sons. He loved his son Joseph very, very much.' },
  { scene: '🧥🌈😃', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'One day, Jacob gave Joseph a beautiful coat. It had many colors: red, orange, yellow, green, blue, and purple!' },
  { scene: '😴🌾✨', bg: 'linear-gradient(#18163f,#3b3486)', text: "One night, Joseph had a dream. There were bundles of grain in a field. Joseph's bundle stood up tall, and his brothers' bundles all bowed down to it!" },
  { scene: '💬😠😠', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'Joseph told his brothers all about his dream. But his brothers did not like it. They were jealous of Joseph and his beautiful coat. Grumble, grumble!' },
  { scene: '🐫🏜️🔺', bg: 'linear-gradient(#ffe9b5,#f2d39a)', text: 'His brothers were so jealous that they took his coat. Then they sent Joseph far away, to a land called Egypt.' },
]

/** Visit 2: God is with Joseph in Egypt, all the way to forgiving his brothers. Its pictures follow part one's. */
export const JOSEPH_STORY_2: StoryPage[] = [
  { scene: '🔺🌴🏺', bg: 'linear-gradient(#bfe6ff,#ffe9b5)', text: 'Far away in Egypt, God was with Joseph. Joseph worked hard, and he was kind to everyone.' },
  { scene: '😴🐄🐄', bg: 'linear-gradient(#18163f,#3b3486)', text: 'One night, Pharaoh, the king of Egypt, had a strange dream. Seven fat cows came up out of the river. Then seven skinny cows came up, too!' },
  { scene: '👑🖼️✨', bg: 'linear-gradient(#fff6c9,#ffe9b5)', text: 'God helped Joseph explain the dream to Pharaoh. First there would be lots of food, like the fat cows. Then there would be no food, like the skinny cows.' },
  { scene: '🌾🏛️💪', bg: 'linear-gradient(#bfe6ff,#ffe9b5)', text: 'So Pharaoh put Joseph in charge of all the food. Joseph saved up lots and lots of grain in big storehouses.' },
  { scene: '🙇🏽🙇🏽🌾', bg: 'linear-gradient(#ffe9b5,#f2d39a)', text: "Soon there was no food anywhere, except in Joseph's storehouses! Joseph's hungry brothers came to Egypt to buy food. They bowed down low, just like in Joseph's dream! But they did not know it was Joseph." },
  { scene: '🤗😭💛', bg: 'linear-gradient(#ffd6e0,#fff3c9)', text: 'Joseph said, "I am Joseph, your brother!" He forgave his brothers, and they hugged and cried happy tears. God turned something bad into something good!' },
]

// World English Bible (public domain), word for word: Joseph to his brothers, at the end of the story.
export const JOSEPH_VERSE = {
  ref: 'Genesis 50:20',
  chunks: ['You meant evil against me,', 'but God meant it', 'for good.'],
}

export const JOSEPH_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: "Joseph's Beautiful Coat", pages: JOSEPH_STORY_1 },
  {
    kind: 'paint', title: "Paint Joseph's Coat",
    // (The two taps in the order they're made: a paint pot, then the stripes with its number.)
    intro: "Joseph's coat had many colors! Let's paint it. Tap a paint pot, then tap the stripes with the same number.",
    done: 'What a beautiful coat! Red, orange, yellow, green, blue, and purple. Jacob loved Joseph so much!',
    kit: JOSEPH_PAINT,
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the
  // bundles, so it doesn't promise any.)
  { kind: 'practice', skill: 'numbers', title: 'Bundles of Grain', decor: '🌾', theme: '🌾', intro: "Joseph dreamed about bundles of grain! Now let's play some number games." },
  // (Hopeful, not worried: the visit ends with Joseph far from home, but never without God.)
  { kind: 'pause', line: "Joseph is far away in Egypt. But God has a plan for him! What could it be? Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'God Was With Joseph', pages: JOSEPH_STORY_2, first: JOSEPH_STORY_1.length },
  {
    kind: 'count', title: 'Fill the Storehouse',
    intro: "Joseph saved up grain for the hungry times. Let's fill the storehouse with bundles of grain!",
    item: { emoji: '🌾', say: 'bundle of grain' }, plural: 'bundles of grain', basket: '🌾', basketArt: 'grain-storehouse',
    into: 'the storehouse', rounds: [4, 7],
    done: 'Seven bundles of grain! Now there is food for everyone, even when the hungry times come.',
  },
  { kind: 'trace', title: 'J is for Joseph', intro: 'Joseph starts with the letter J! Trace the big J, and then the little j, with your finger.', letters: ['J', 'j'] },
  { kind: 'verse', chunks: JOSEPH_VERSE.chunks, ref: JOSEPH_VERSE.ref },
  { kind: 'pause', line: "Somebody on the island is feeling very jealous. Who could it be? Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell Joseph's story? Put the pictures in order, from the first to the last!",
    // The story's own pictures (pages counted from 1 across both parts), one from each place in the story.
    items: [
      { emoji: '🧥', say: 'Joseph getting his beautiful coat', art: 'story:joseph:2' },
      { emoji: '🌾', say: "Joseph's dream about the bundles of grain", art: 'story:joseph:3' },
      { emoji: '🐫', say: 'Joseph going far away to Egypt', art: 'story:joseph:5' },
      { emoji: '🐄', say: "Pharaoh's dream about the cows", art: 'story:joseph:7' },
      { emoji: '🏛️', say: 'Joseph saving up grain in the storehouses', art: 'story:joseph:9' },
      { emoji: '🤗', say: 'Joseph forgiving his brothers', art: 'story:joseph:11' },
    ],
  },
  { kind: 'battle', foe: 'sulky', intro: 'Oh no! A grumpy peacock named Sulky is jealous of everybody\'s colors! Sulky just needs a friend.' },
  { kind: 'song', song: 'song-joseph', intro: "Let's sing about Joseph and his coat! You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'patches', sticker: '🧥', stickerName: 'colorful coat' },
]
