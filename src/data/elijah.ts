import type { Step, StoryPage } from './islands'
import { ELIJAH_GAME } from '../art/games/elijah'

// Elijah (1 Kings 17 and 18). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in
// words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// God takes care of His people, and God answers prayer. Kept gentle: King Ahab is only surprised, the people who
// prayed to a pretend god just learn that the Lord is God (what happened to them afterwards is left out), and the
// widow's little boy is there beside his mom, alive and well (his illness is left out). Jezebel isn't in it.
// The pictures are in art/scenes/elijah.tsx, the altar game's in art/games/elijah.tsx.

/** Visit 1: no rain, the ravens by the brook, and the widow whose flour and oil never ran out. */
export const ELIJAH_STORY_1: StoryPage[] = [
  { scene: '🧔🏽👑☁️', bg: 'linear-gradient(#bfe6ff,#e6ffe9)', text: 'Long ago, a man named Elijah loved God. But King Ahab and many of God\'s people forgot about God. So Elijah told the king, "There will be no rain, not one drop, until God says so!"' },
  { scene: '☀️🏜️💧', bg: 'linear-gradient(#bfe6ff,#fff0c4)', text: 'And no rain fell, for a long, dry time. The grass turned brown, and the ground cracked. But God took care of Elijah. He said, "Go and stay by the little brook. You can drink its water."' },
  { scene: '🐦🍞🍖', bg: 'linear-gradient(#ffd0d6,#ffeab0)', text: 'Every morning and every evening, God sent ravens to Elijah. Flap, flap! The big black birds brought him bread and meat to eat. And Elijah drank water from the brook.' },
  { scene: '🏜️🧔🏽✨', bg: 'linear-gradient(#bfe6ff,#fff0c4)', text: 'After a while, the little brook dried up. Then God said, "Go to a town far away. A widow there will give you food."' },
  { scene: '🪵👩🏽🧔🏽', bg: 'linear-gradient(#bfe6ff,#fff0c4)', text: 'At the town gate, the widow and her little boy were picking up sticks. "Please, may I have a little bread?" Elijah asked. She said, "I only have enough flour and oil for one last loaf."' },
  { scene: '🍞🫙✨', bg: 'linear-gradient(#fff3c9,#ffe0b5)', text: '"Don\'t be afraid," said Elijah. "God will not let your flour and oil run out." So the widow shared her bread. And God made her flour and oil last and last, for all three of them!' },
]

/** Visit 2: on Mount Carmel, fire from heaven, and then the rain. Its pictures follow part one's in art/scenes/elijah.tsx. */
export const ELIJAH_STORY_2: StoryPage[] = [
  { scene: '⛰️🙌🔥', bg: 'linear-gradient(#bfe6ff,#ffd9a0)', text: 'Remember? There was still no rain. Elijah called all the people to Mount Carmel. "Let\'s see who the real God is!" he said. Some people prayed to a pretend god, all day long. But nothing happened.' },
  { scene: '🪨🪵💧', bg: 'linear-gradient(#bfe6ff,#ffecc0)', text: 'Then Elijah built an altar to God with twelve big stones. He put wood on top and dug a ditch around it. "Pour water all over it!" he said. Splash, splash! The water filled the ditch.' },
  { scene: '🙏🔥✨', bg: 'linear-gradient(#5f6fb0,#ffc98a)', text: 'Elijah prayed, "Lord, show everyone that You are God." Whoosh! God sent fire from heaven! It burned up the wood and the stones, and even all the water!' },
  { scene: '🧎🙌✨', bg: 'linear-gradient(#bfe6ff,#fff0cc)', text: 'When the people saw it, they knelt down and said, "The Lord is God! The Lord is God!" Even the people who had prayed to the pretend god knew it now.' },
  { scene: '🙏🌊☁️', bg: 'linear-gradient(#bfe6ff,#ffd2a8)', text: 'Then Elijah prayed for rain. He prayed and prayed. At last, far out over the sea, a little cloud came up, as small as a hand.' },
  { scene: '🌧️🙌💚', bg: 'linear-gradient(#a8b4c8,#d9e8c4)', text: 'The little cloud grew and grew, and the sky turned dark. Then down came the rain! Splish, splash! The thirsty land drank and drank. God answers prayer, and God takes care of His people.' },
]

// World English Bible (public domain), word for word: the first part of Philippians 4:19 ("My God will supply every
// need of yours according to his riches in glory in Christ Jesus."). God gave Elijah everything he needed: bread from
// the ravens, the widow's flour and oil, and the rain.
export const ELIJAH_VERSE = {
  ref: 'Philippians 4:19',
  chunks: ['My God', 'will supply', 'every need', 'of yours.'],
}

export const ELIJAH_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'God Takes Care of Elijah', pages: ELIJAH_STORY_1 },
  // (A look ahead to the mountain: part two tells it all. The finished picture shows God's fire, so the done line looks
  // ahead too ("That's how it will be when…"), and the pause still asks about the rain. The tray's stone rows are
  // different sizes, so she can see which one goes at the bottom, and five, four and three make twelve.)
  {
    kind: 'build', title: 'Build the Altar', kit: ELIJAH_GAME,
    intro: "One day, Elijah built an altar to God on a mountain, to show everyone who the real God is. Let's help him build it! Drag each part to its place, starting with the stones at the bottom.",
    done: "Five stones, four stones and three stones make twelve stones! That's how it will be when Elijah prays on the mountain, and God sends fire from heaven!",
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Raven Words', decor: '🍞', intro: "Flap, flap! The ravens brought Elijah bread every morning and every evening. Now let's play some word games together!" },
  { kind: 'pause', line: "The land is still so dry, and everyone is waiting for rain. Will the rain ever come? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: 'Fire from Heaven', pages: ELIJAH_STORY_2, first: ELIJAH_STORY_1.length },
  {
    kind: 'quiz', title: 'Elijah Questions',
    questions: [
      {
        say: 'Who brought Elijah bread and meat by the brook?',
        choices: [{ emoji: '🐘', say: 'An elephant' }, { emoji: '🐦', say: 'The ravens', art: 'story:elijah:3' }, { emoji: '🐸', say: 'A frog' }],
        answer: 1,
      },
      {
        say: 'What did God make last and last, so it never ran out?',
        choices: [{ emoji: '🫙', say: "The widow's flour and oil", art: 'flour-and-oil' }, { emoji: '🍦', say: 'Ice cream' }, { emoji: '🍪', say: 'Cookies' }],
        answer: 0,
      },
      {
        say: 'What did God send down from heaven on the mountain?',
        choices: [{ emoji: '🌈', say: 'A rainbow' }, { emoji: '⭐', say: 'A star' }, { emoji: '🔥', say: 'Fire', art: 'fire-from-heaven' }],
        answer: 2,
      },
      {
        say: 'When Elijah prayed for rain, what came up over the sea?',
        choices: [{ emoji: '⛵', say: 'A boat' }, { emoji: '☁️', say: 'A little cloud' }, { emoji: '🐋', say: 'A big fish' }],
        answer: 1,
      },
    ],
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the raindrops, so
  // it doesn't promise any.)
  { kind: 'practice', skill: 'numbers', title: 'Rainy Day Numbers', decor: '🌧️', theme: '💧', intro: "Splish, splash! God sent the rain at last. Now let's play some number games!" },
  { kind: 'verse', chunks: ELIJAH_VERSE.chunks, ref: ELIJAH_VERSE.ref },
  { kind: 'pause', line: "Somebody little and prickly is feeling very cross. He waited so long for the rain! Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell Elijah's story? Put the pictures in order, from the first to the last!",
    // The story's own pictures (pages counted from one across both parts), one from each place in the story. Each
    // `say` names its picture as a lowercase phrase ("That's <say>.").
    items: [
      { emoji: '👑', say: 'Elijah telling the king there will be no rain', art: 'story:elijah:1' },
      { emoji: '🐦', say: 'the ravens bringing Elijah food', art: 'story:elijah:3' },
      { emoji: '🍞', say: 'the widow sharing her bread', art: 'story:elijah:6' },
      { emoji: '💧', say: 'the water poured on the altar', art: 'story:elijah:8' },
      { emoji: '🔥', say: 'God sending fire from heaven', art: 'story:elijah:9' },
      { emoji: '🌧️', say: 'the rain coming down at last', art: 'story:elijah:12' },
    ],
  },
  { kind: 'battle', foe: 'spike', intro: 'Oh no! A little cactus named Spike is prickly and cross! He waited and waited for rain, and he got very grumpy. Spike just needs a friend.' },
  { kind: 'song', song: 'song-elijah', intro: "Elijah prayed, and God sent fire from heaven, and then the rain! Let's sing about it. You can sing it on your Ark any time, too." },
  // (God's fire on Elijah's altar of twelve stones, drawn in art/items/isl-elijah.tsx: no emoji names it.)
  { kind: 'reward', pal: 'crumbs', sticker: 'fire-from-heaven', stickerName: 'fire from heaven' },
]
