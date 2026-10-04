import type { Step, StoryPage } from './islands'
import { BURNING_BUSH_GAME } from '../art/games/burning-bush'

// The Burning Bush (Exodus 2:11 to 4:31). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace
// first, numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its
// words say. Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the
// rescue. The pictures are in art/scenes/burning-bush.tsx, the sheep game's in art/games/burning-bush.tsx.
// Kept gentle: why Moses had to leave Egypt isn't told (only that he had to go far away), and the staff
// turning into a snake is left out. God is never drawn: He speaks from the light of the bush.

/** Visit 1: from the palace to Midian, where Moses helps at the well and becomes a shepherd, up to the mountain of God. */
export const BURNING_BUSH_STORY_1: StoryPage[] = [
  { scene: '🏛️🧔🏽🧱', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: "Baby Moses grew up in the palace of the king of Egypt. But Moses loved God's people. He was sad to see them work so hard, making bricks all day long." },
  { scene: '🧔🏽🏜️👣', bg: 'linear-gradient(#bfe6ff,#ffe9b5)', text: 'One day, Moses had to leave Egypt. He walked far, far away, across the hot desert, to a land called Midian.' },
  { scene: '🪣😠🐑', bg: 'linear-gradient(#bfe6ff,#ffe9b5)', text: 'In Midian, Moses sat down by a well. Seven sisters came to give their sheep a drink. But some grumpy shepherds pushed them away. That was not kind!' },
  { scene: '🧔🏽💧🐑', bg: 'linear-gradient(#bfe6ff,#ffe9b5)', text: 'So Moses stood up and helped the sisters! He pulled up water from the well and filled the trough. All their thirsty sheep had a drink. Slurp, slurp!' },
  { scene: '⛺👴🏽💛', bg: 'linear-gradient(#bfe6ff,#ffe9b5)', text: 'The sisters told their father, Jethro, all about kind Moses. Jethro said, "Come and live with us!" Moses married Zipporah, one of the sisters. And he became a shepherd.' },
  { scene: '🧔🏽🐑⛰️', bg: 'linear-gradient(#bfe6ff,#ffe9b5)', text: "Moses took good care of Jethro's sheep. One day, he led them far across the desert, all the way to the mountain of God." },
]

/** Visit 2: the bush that did not burn up. Its pictures follow part one's in art/scenes/burning-bush.tsx. */
export const BURNING_BUSH_STORY_2: StoryPage[] = [
  { scene: '🔥🌿⛰️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Moses was with his sheep by the mountain of God. Then he saw something very strange. A bush was on fire, but it did not burn up!' },
  { scene: '🔥✨🧔🏽', bg: 'linear-gradient(#fff6c9,#ffe9b5)', text: 'Moses said, "I will go closer and see!" Then God called to him from the bush, "Moses! Moses!" And Moses said, "Here I am!"' },
  { scene: '🩴✨🙏', bg: 'linear-gradient(#fff6c9,#ffe9b5)', text: 'God said, "Take off your sandals, for this is holy ground." It was a special place, because God was there! So Moses took off his sandals.' },
  { scene: '🔥💛🧱', bg: 'linear-gradient(#fff6c9,#ffe9b5)', text: 'God said, "I have seen how hard My people work in Egypt, and I care about them. I will send you to Pharaoh, to bring My people out of Egypt."' },
  { scene: '😟🔥💛', bg: 'linear-gradient(#fff6c9,#ffe9b5)', text: 'But Moses was afraid. "Who am I?" he said. "I can\'t do it!" God said, "I will be with you. And your brother Aaron will help you."' },
  { scene: '🧔🏽🤗🧔🏽', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Moses trusted God. He took his staff and set off for Egypt, and Aaron came to meet him on the way. God was with Moses, and God is with you, too, even when you are afraid!' },
]

// World English Bible (public domain), word for word: God's promise to Moses at the bush, the first part of
// Exodus 3:12 ("Certainly I will be with you. This will be the token to you…").
export const BURNING_BUSH_VERSE = {
  ref: 'Exodus 3:12',
  chunks: ['Certainly', 'I will be', 'with you.'],
}

export const BURNING_BUSH_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Moses the Shepherd', pages: BURNING_BUSH_STORY_1 },
  {
    kind: 'spot', title: 'Where Are the Sheep?', plural: 'sheep', kit: BURNING_BUSH_GAME,
    intro: "Oh no! Some of Moses' sheep and goats have wandered off on the mountain, and they are hiding. Can you help Moses find them all? Tap each one!",
    done: 'Hooray, you found them all! Moses takes good care of every one of his sheep. And God takes good care of you, too!',
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the sheep,
  // so it doesn't promise any.)
  { kind: 'practice', skill: 'numbers', title: 'Sheep Numbers', decor: '⛰️', theme: '🐑', intro: "Baa, baa! The sheep want to play some number games with you. Let's go!" },
  // (Wonder, not worry: the very next page is the bush.)
  { kind: 'pause', line: "Then Moses saw something very strange on the mountain. What could it be? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: 'God Calls Moses', pages: BURNING_BUSH_STORY_2, first: BURNING_BUSH_STORY_1.length },
  {
    kind: 'quiz', title: 'Burning Bush Questions',
    questions: [
      {
        say: 'Who did Moses help at the well?',
        choices: [{ emoji: '🐟', say: 'A fish' }, { emoji: '🐑', say: 'The seven sisters and their sheep', art: 'story:burning-bush:4' }, { emoji: '🐝', say: 'A busy bee' }],
        answer: 1,
      },
      {
        say: 'What did Moses see on the mountain?',
        choices: [{ emoji: '🔥', say: 'A bush on fire that did not burn up', art: 'burning-bush' }, { emoji: '🌈', say: 'A rainbow' }, { emoji: '⛵', say: 'A boat' }],
        answer: 0,
      },
      {
        say: 'What did God tell Moses to take off?',
        choices: [{ emoji: '👑', say: 'His crown' }, { emoji: '🎩', say: 'His hat' }, { emoji: '🩴', say: 'His sandals' }],
        answer: 2,
      },
      {
        say: 'Who did God say would help Moses?',
        choices: [{ emoji: '🦁', say: 'A lion' }, { emoji: '🧔🏽', say: 'His brother Aaron', art: 'aaron' }, { emoji: '🐭', say: 'A little mouse' }],
        answer: 1,
      },
    ],
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Glowing Words', decor: '🔥', intro: "The bush glowed with a bright, warm light. Let's play some word games together!" },
  { kind: 'verse', chunks: BURNING_BUSH_VERSE.chunks, ref: BURNING_BUSH_VERSE.ref },
  { kind: 'pause', line: "Somebody on the mountain is feeling very prickly today. Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell the story of Moses and the burning bush? Put the pictures in order, from the first to the last!",
    // The story's own pictures (pages counted from one across both parts), one from each place in the story.
    items: [
      { emoji: '🏛️', say: 'Moses growing up in the palace', art: 'story:burning-bush:1' },
      { emoji: '🐑', say: 'Moses helping at the well', art: 'story:burning-bush:4' },
      { emoji: '⛺', say: 'Moses joining Jethro\'s family', art: 'story:burning-bush:5' },
      { emoji: '🔥', say: 'the bush that did not burn up', art: 'story:burning-bush:7' },
      { emoji: '🩴', say: 'Moses taking off his sandals', art: 'story:burning-bush:9' },
      { emoji: '🤗', say: 'Aaron coming to meet Moses', art: 'story:burning-bush:12' },
    ],
  },
  { kind: 'battle', foe: 'prickles', intro: 'Oh no! A little desert hedgehog named Prickles is feeling very prickly today! Prickles just needs a friend.' },
  { kind: 'song', song: 'song-burning-bush', intro: "Let's sing about Moses and the bush that did not burn up! You can sing it on your Ark any time, too." },
  // (Moses' sandals, which he took off on holy ground: a sticker is named by its emoji.)
  { kind: 'reward', pal: 'nibbles', sticker: '🩴', stickerName: 'sandal' },
]
