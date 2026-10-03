import type { Step, StoryPage } from './islands'
import { ABRAHAM_GAME } from '../art/games/abraham'

// Abraham's Stars (Genesis 12, 15, 18 and 21). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds,
// grace first, numbers in words, no emoji or symbols in anything spoken, and every page's picture shows
// what its words say. Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the
// adventure, the rescue. The pictures are in art/scenes/abraham.tsx, the star game's in art/games/abraham.tsx.

/** Visit 1: God's big promise, up to the night God showed Abraham the stars. */
export const ABRAHAM_STORY_1: StoryPage[] = [
  { scene: '🏘️👴🏽👵🏽', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago, a man named Abraham lived in a big, busy city with his wife, Sarah. God loved Abraham, and Abraham loved God.' },
  { scene: '✨👴🏽🙏', bg: 'linear-gradient(#fff6c9,#ffe9b5)', text: 'One day, God said, "Abraham, leave your home, and go to a new land. I will show you the way." Abraham did not know where he was going. But he trusted God!' },
  { scene: '🐫🐫🐑', bg: 'linear-gradient(#ffe9b5,#f2d39a)', text: 'So Abraham and Sarah packed up their tents. They took their sheep and their camels, and off they went. They walked a long, long way!' },
  { scene: '⛺🌳🙌', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'At last, they came to a beautiful land. God said, "I will give this land to your family." So Abraham and Sarah set up their tents, and they thanked God.' },
  { scene: '👴🏽👵🏽🐑', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'But Abraham and Sarah were very old, and they had no children. They wished for a baby so much.' },
  { scene: '🌌⭐👴🏽', bg: 'linear-gradient(#18163f,#3b3486)', text: 'One night, God took Abraham outside and said, "Look up at the sky, and count the stars, if you can! Your family will be like the stars." And Abraham believed God.' },
]

/** Visit 2: the promise comes true. Its pictures follow part one's in art/scenes/abraham.tsx. */
export const ABRAHAM_STORY_2: StoryPage[] = [
  { scene: '🌙⭐👴🏽👵🏽', bg: 'linear-gradient(#6b5bb5,#ffa8b8)', text: "Abraham and Sarah waited and waited, for years and years. Every night, Abraham looked up at the stars and remembered God's promise of a great big family." },
  { scene: '☀️⛺🌳', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: `One hot day, three visitors came to Abraham's tent. Abraham ran to meet them. "Welcome!" he said. "Come and rest in the shade!"` },
  { scene: '🍞🥛🌳', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Sarah baked warm bread, and Abraham brought cool milk. The visitors sat under a big shady tree, and they ate and ate.' },
  { scene: '⛺😂', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'One visitor said, "Next year, Sarah will have a baby boy!" Sarah was listening at the tent door. She laughed and said, "Me? I am too old to have a baby!" But nothing is too hard for God.' },
  { scene: '👶🏽💛😂', bg: 'linear-gradient(#ffd6e0,#fff3c9)', text: 'And God kept His promise! The next year, Sarah had a baby boy. They named him Isaac. Isaac means laughter! Sarah laughed for joy and said, "God has made me laugh!"' },
  { scene: '⭐👨‍👩‍👧‍👦✨', bg: 'linear-gradient(#18163f,#3b5e86)', text: "Abraham's family grew and grew, until it was like the stars in the sky! God always keeps His promises. And God's family has room for you, too!" },
]

// World English Bible (public domain), word for word: God's words to Abraham, the night He showed him the stars.
export const ABRAHAM_VERSE = {
  ref: 'Genesis 15:5',
  chunks: ['Look now toward the sky,', 'and count the stars,', 'if you are able to count them.'],
}

export const ABRAHAM_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: "God's Big Promise", pages: ABRAHAM_STORY_1 },
  {
    kind: 'spot', title: 'Count the Stars',
    intro: 'God said to Abraham, look up at the sky, and count the stars! Can you help Abraham count them? Tap each star to make it shine.',
    done: 'So many stars! God promised Abraham a family as big as the sky full of stars.',
    plural: 'stars', kit: ABRAHAM_GAME,
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Starry Words', decor: '⭐', intro: "Twinkle, twinkle! Let's play word games under the stars." },
  { kind: 'pause', line: "Abraham and Sarah waited and waited. Will God keep His promise? Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'A Baby Named Laughter', pages: ABRAHAM_STORY_2, first: ABRAHAM_STORY_1.length },
  {
    kind: 'count', title: 'Bread for the Visitors',
    intro: "Abraham and Sarah shared their bread with the three visitors. Let's fill the basket with warm bread!",
    item: { emoji: '🍞', say: 'loaf of bread' }, plural: 'loaves of bread', basket: '🧺', basketArt: 'basket', rounds: [3, 6],
    done: 'Six loaves of bread, two for each visitor! Abraham and Sarah loved to share.',
  },
  { kind: 'trace', title: 'A is for Abraham', intro: 'Abraham starts with the letter A! Trace the big A, and then the little a, with your finger.', letters: ['A', 'a'] },
  { kind: 'verse', chunks: ABRAHAM_VERSE.chunks, ref: ABRAHAM_VERSE.ref },
  { kind: 'pause', line: "Somebody is grumbling out in the desert. Who could it be? Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell Abraham's story? Put the pictures in order, from the first to the last!",
    // The story's own pictures (pages counted from 1 across both parts), one from each place in the
    // story so no two cards look alike (the visitors' pages 8 to 10 share a place: page 8 stands for them).
    items: [
      { emoji: '🏘️', say: 'Abraham and Sarah in their busy city', art: 'story:abraham:1' },
      { emoji: '✨', say: 'God telling Abraham to go to a new land', art: 'story:abraham:2' },
      { emoji: '🐫', say: 'the long, long walk', art: 'story:abraham:3' },
      { emoji: '⭐', say: 'Abraham counting the stars', art: 'story:abraham:6' },
      { emoji: '⛺', say: 'three visitors coming to the tent', art: 'story:abraham:8' },
      { emoji: '👶', say: 'baby Isaac, born at last', art: 'story:abraham:11' },
    ],
  },
  { kind: 'battle', foe: 'humpy', intro: 'Oh no! A grumpy camel named Humpy is tired of the long, long walk! Humpy just needs a friend.' },
  { kind: 'song', song: 'song-abraham', intro: "Let's sing about Abraham and the stars! You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'twinkle', sticker: '🌟', stickerName: 'shining star' },
]
