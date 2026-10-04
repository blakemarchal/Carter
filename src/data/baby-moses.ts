import type { Step, StoryPage } from './islands'
import { BABY_MOSES_GAME } from '../art/games/baby-moses'

// Baby Moses (Exodus 1 and 2:1-10). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first,
// numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Kept gentle: Pharaoh's rule is only "an unkind rule, so baby boys were not safe" (nothing more is said
// or shown), and the family is always held in God's care.

/** Visit 1: God's people in Egypt, up to the basket in the reeds. */
export const BABY_MOSES_STORY_1: StoryPage[] = [
  { scene: '🏘️👨‍👩‍👧‍👦', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago, God\'s people lived in the land of Egypt. God blessed them, and their family grew and grew. Soon they were a big, big family!' },
  { scene: '👑🧱', bg: 'linear-gradient(#bfe6ff,#f3e4c4)', text: 'Then a new king called Pharaoh was afraid of them, because there were so many. So he made God\'s people work very hard, making bricks all day long.' },
  { scene: '📜💛', bg: 'linear-gradient(#ffd0dc,#fff3c9)', text: 'Then Pharaoh made an unkind rule, and baby boys were not safe anymore. But God was watching over His people. And God had a plan!' },
  { scene: '👶🏽🌙', bg: 'linear-gradient(#3b3486,#ffe9c9)', text: 'One mom from God\'s people had a baby boy. He was a beautiful baby! His mom hid him at home and kept him safe for three whole months.' },
  { scene: '🧺👶🏽', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'When he got too big to hide, his mom made a little basket out of reeds. She coated it so no water could get in. Then she tucked her baby inside, snug and safe.' },
  { scene: '🌿🧺👧🏽', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'She set the basket in the tall reeds by the river Nile. And his big sister Miriam hid nearby, to watch over him.' },
]

/** Visit 2: the princess finds the baby, up to his name. Its pictures follow part one's in art/scenes/baby-moses.tsx. */
export const BABY_MOSES_STORY_2: StoryPage[] = [
  { scene: '👸🏽🌿🧺', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'The little basket floated in the reeds, and Miriam watched. Then Pharaoh\'s daughter, the princess, came down to the river to wash. She saw the basket, and she sent her helper to bring it to her.' },
  { scene: '👸🏽👶🏽💗', bg: 'linear-gradient(#bfe6ff,#ffe0ef)', text: 'The princess opened the basket. There was a baby boy, and he was crying! Waah! The princess felt so kind and loving toward him.' },
  { scene: '👧🏽👩🏽👸🏽', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Miriam ran up and asked, "Shall I find someone to take care of the baby for you?" "Yes, go!" said the princess. So Miriam ran and brought the baby\'s very own mom!' },
  { scene: '🏠🤗', bg: 'linear-gradient(#ffe9c9,#fff3c9)', text: 'The princess said, "Please take care of this baby for me." So his mom took her baby home again! She took care of him until he was bigger.' },
  { scene: '👸🏽🧒🏽', bg: 'linear-gradient(#bfe6ff,#f3e4c4)', text: 'When he was older, he went to live with the princess, and she named him Moses. She said, "I pulled him out of the water."' },
  { scene: '🧺💛✨', bg: 'linear-gradient(#ffd0dc,#ffe9c9)', text: 'God kept baby Moses safe, and God had a big plan for him! And God takes care of you, too. He loves you so much.' },
]

// World English Bible (public domain), word for word: the first part of Isaiah 41:10.
export const BABY_MOSES_VERSE = {
  ref: 'Isaiah 41:10',
  chunks: ['Don\'t you be afraid,', 'for I am', 'with you.'],
}

export const BABY_MOSES_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'A Basket in the Reeds', pages: BABY_MOSES_STORY_1 },
  {
    kind: 'steer', title: 'Float the Basket',
    intro: 'Help the little basket float safely down the river! Slide it along the glowing path, and pick up the water lilies on the way.',
    done: 'You did it! The basket floated safely all the way to the stone steps. And you picked up five water lilies! God was watching over the baby.',
    kit: BABY_MOSES_GAME,
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the
  // water lilies, so it doesn't promise any.)
  { kind: 'practice', skill: 'numbers', title: 'Water Lily Numbers', decor: '🪷', theme: '🪷', intro: 'Splish, splash! Let\'s play some number games down by the river.' },
  // (Wonder, not worry: the baby is safe in the reeds, and Miriam is watching.)
  { kind: 'pause', line: 'The little basket is safe in the reeds, and Miriam is watching. Who will find the baby in the basket? Let\'s find out next time!' },

  // Visit 2: the adventure
  { kind: 'story', title: 'The Princess and the Baby', pages: BABY_MOSES_STORY_2, first: BABY_MOSES_STORY_1.length },
  {
    kind: 'sort', title: 'Float or Sink?',
    intro: 'Baby Moses floated safely in his basket, because his mom made it so no water could get in! Let\'s sort. Does it float on top of the water, or sink to the bottom?',
    hint: 'Float or sink?',
    groups: [
      { id: 'float', emoji: '🛟', say: 'it floats', art: 'it-floats' },
      { id: 'sink', emoji: '⚓', say: 'it sinks', art: 'it-sinks' },
    ],
    items: [
      { emoji: '👶', say: 'the basket boat', art: 'moses-basket', group: 'float' },
      { emoji: '🦆', say: 'the duck', group: 'float' },
      { emoji: '🍃', say: 'the leaf', group: 'float' },
      { emoji: '🚢', say: 'Noah\'s big boat', art: 'ark', group: 'float' },
      { emoji: '🪨', say: 'the stone', group: 'sink' },
      // (a metal key, not a seashell: a cupped shell can float, and nobody argues about a key)
      { emoji: '🔑', say: 'the key', art: 'brass-key', group: 'sink' },
      { emoji: '👑', say: 'the gold crown', group: 'sink' },
      { emoji: '🚲', say: 'the bike', group: 'sink' },
    ],
  },
  { kind: 'trace', title: 'M is for Moses', intro: 'Moses starts with the letter M. So does Miriam! Trace the big M, and then the little m, with your finger.', letters: ['M', 'm'] },
  { kind: 'verse', chunks: BABY_MOSES_VERSE.chunks, ref: BABY_MOSES_VERSE.ref },
  { kind: 'pause', line: 'Snap, snap! Somebody down by the river is feeling very grumpy. Who could it be? Let\'s find out next time!' },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of baby Moses? Put the pictures in order, from the first to the last!',
    // The story's own pictures (pages counted from 1 across both parts), one from each place in the story,
    // so no two cards look alike (the bathing place's pages 7 to 9 share a place: page 8 stands for them).
    items: [
      { emoji: '🧱', say: 'God\'s people making bricks', art: 'story:baby-moses:2' },
      { emoji: '🌙', say: 'his mom keeping the baby safe at home', art: 'story:baby-moses:4' },
      { emoji: '🧺', say: 'his mom tucking him into the basket', art: 'story:baby-moses:5' },
      { emoji: '🌿', say: 'the basket in the tall reeds', art: 'story:baby-moses:6' },
      { emoji: '👸', say: 'the princess finding the baby', art: 'story:baby-moses:8' },
      { emoji: '💛', say: 'the princess naming him Moses', art: 'story:baby-moses:11' },
    ],
  },
  { kind: 'battle', foe: 'snappy', intro: 'Oh no! A grumpy little crocodile named Snappy is going snap, snap, snap at everybody by the river! Snappy just needs a friend.' },
  { kind: 'song', song: 'song-baby-moses', intro: 'Let\'s sing about baby Moses in his basket! You can sing it on your Ark any time, too.' },
  // (The basket boat, with baby Moses peeking out: art/items/isl-baby-moses.tsx.)
  { kind: 'reward', pal: 'lily', sticker: 'moses-basket', stickerName: 'basket boat' },
]
