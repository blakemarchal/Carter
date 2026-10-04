import type { Step, StoryPage } from './islands'
import { CHRISTMAS_GAME } from '../art/games/christmas'

// Baby Jesus. See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in words,
// no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// The pictures for both parts are one list, in art/scenes/christmas.tsx (part one is pages 1 to 5).

/** Visit 1: the angel's good news for Mary, Joseph's dream, the long trip, and no room in the town. */
export const CHRISTMAS_STORY_1: StoryPage[] = [
  { scene: '👼✨👩🏽', bg: 'linear-gradient(#fff3c9,#ffe0f0)', text: 'Long ago, in a little town called Nazareth, there lived a young woman named Mary. One day, God sent an angel named Gabriel to visit her!' },
  { scene: '👼👩🏽💛', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'Gabriel said, "Don\'t be afraid, Mary! You will have a baby boy. He is God\'s own Son. Name Him Jesus!" Mary was so happy. She said yes to God!' },
  { scene: '🧔🏽💤👼', bg: 'linear-gradient(#8f9bd6,#c9c3ff)', text: 'Mary was going to marry a kind man named Joseph. An angel came to Joseph in a dream, and told him all about the baby. Joseph trusted God, and took good care of Mary.' },
  { scene: '👩🏽🧔🏽🌄', bg: 'linear-gradient(#ffe0b5,#c9c3ff)', text: "Mary and Joseph took a long trip to Bethlehem, King David's little town. Mary was going to have a very special baby!" },
  { scene: '🏘️🐄🐑', bg: 'linear-gradient(#c9c3ff,#e9d3b5)', text: 'The town was so busy, there was no room for them to stay. So they stayed in a place where animals sleep.' },
]

/** Visit 2: baby Jesus is born, and the shepherds and the wise men come to see Him. */
export const CHRISTMAS_STORY_2: StoryPage[] = [
  { scene: '✨👶🏽🌾', bg: 'linear-gradient(#c9c3ff,#ffe9b5)', text: 'One night, in the little stable, baby Jesus was born! Mary wrapped Him up snug and warm, and laid Him in a manger, where the animals eat their hay.' },
  { scene: '🌙🐑🐑', bg: 'linear-gradient(#8f9bd6,#c9f2d0)', text: 'Out in the fields, shepherds were watching their sheep in the night.' },
  { scene: '👼✨', bg: 'linear-gradient(#fff6c9,#ffe0f0)', text: `Suddenly, an angel came, and God's bright glory shone all around! The angel said, "Don't be afraid! I bring you good news of great joy for everyone!"` },
  { scene: '👼👼🎶', bg: 'linear-gradient(#ffe0f0,#c9c3ff)', text: 'The angel said, "Today a Savior is born for you, Christ the Lord! You will find Him wrapped up snug, lying in a manger." Then lots and lots of angels sang, "Glory to God!"' },
  { scene: '🐑👶🏽🌾💛', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: "The shepherds hurried and found baby Jesus, just like the angel said! Jesus is God's best gift to us. He is our Savior, who came to rescue us, because God loves us so much." },
  { scene: '⭐🐫🎁', bg: 'linear-gradient(#c9c3ff,#fff3c9)', text: "Later, wise men from far away followed a bright star all the way to Jesus. They brought Him wonderful gifts. Jesus is God's best gift, for the whole wide world!" },
]

// World English Bible (public domain), word for word: part of the angel's words to the shepherds (page eight), in
// Luke 2:10 ("The angel said to them, 'Don't be afraid, for behold, I bring you good news of great joy which will be to
// all the people.'").
export const CHRISTMAS_VERSE = {
  ref: 'Luke 2:10',
  chunks: ['I bring you', 'good news', 'of great joy.'],
}

/** A story card for the put-it-in-order game: page n of the whole story (1 to 11). */
const card = (n: number, say: string) => ({ emoji: '⭐', say, art: `story:christmas:${n}` })

export const CHRISTMAS_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'A Very Special Baby', pages: CHRISTMAS_STORY_1 },
  {
    kind: 'build', title: 'Get the Stable Ready',
    intro: "Mary and Joseph need a cozy place to rest. Let's get the stable ready for the baby! Put each thing in its place.",
    done: 'The stable is clean and cozy. It is all ready for the baby!',
    kit: CHRISTMAS_GAME,
  },
  { kind: 'trace', title: 'J is for Jesus', intro: "The angel said the baby's name would be Jesus. Jesus starts with the letter J! Trace the big J with your finger.", letters: ['J', 'j'] },
  { kind: 'pause', line: "Something wonderful is about to happen in the little stable! Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'The First Christmas', pages: CHRISTMAS_STORY_2, first: CHRISTMAS_STORY_1.length },
  {
    kind: 'maze', title: 'Hurry to Bethlehem',
    intro: 'The shepherds hurried to find baby Jesus! Help the little lamb find the way to the stable.',
    hero: { emoji: '🐑', say: 'the little lamb' }, goal: { emoji: '🛖', say: 'baby Jesus in the stable' }, trail: '🐾',
  },
  {
    kind: 'count', title: 'Counting Lambs',
    intro: "The shepherds took good care of their little lambs. Let's tuck the lambs into the soft hay!",
    item: { emoji: '🐑', say: 'little lamb' }, plural: 'little lambs', basket: '🌾', basketArt: 'hay', into: 'the soft hay', rounds: [4, 8],
    done: 'All tucked in, snug in the soft hay, just like baby Jesus in the manger!',
  },
  { kind: 'verse', chunks: CHRISTMAS_VERSE.chunks, ref: CHRISTMAS_VERSE.ref },
  { kind: 'pause', line: "Someone nearby is shivering and grumpy. Who could it be? Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the Christmas story? Put the pictures in order, from first to last!',
    items: [
      card(1, 'the angel Gabriel visiting Mary'),
      card(4, 'the long trip to Bethlehem'),
      card(6, 'baby Jesus in the manger'),
      card(8, 'the angel and the shepherds'),
      card(10, 'the shepherds finding baby Jesus'),
      card(11, 'the wise men bringing gifts'),
    ],
  },
  { kind: 'battle', foe: 'chilly', intro: 'Oh no! A grumpy little snowman named Chilly is making everybody shiver! Chilly just needs a friend.' },
  { kind: 'song', song: 'away-in-a-manger', intro: "Let's sing about baby Jesus, asleep on the hay! You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'starling', sticker: '⭐', stickerName: 'Christmas star' },
]
