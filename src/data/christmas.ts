import type { Step, StoryPage } from './islands'

export const CHRISTMAS_STORY: StoryPage[] = [
  { scene: '👩🏽🧔🏽🌄', bg: 'linear-gradient(#ffe0b5,#c9c3ff)', text: 'Mary and Joseph took a long trip to the little town of Bethlehem. Mary was going to have a very special baby!' },
  { scene: '🏘️🐄🐑', bg: 'linear-gradient(#c9c3ff,#e9d3b5)', text: 'The town was so busy, there was no room for them to stay. So they stayed in a place where animals sleep.' },
  { scene: '✨👶🏽🌾', bg: 'linear-gradient(#c9c3ff,#ffe9b5)', text: 'That night, baby Jesus was born! Mary wrapped Him up snug and warm, and laid Him in a manger, where the animals eat their hay.' },
  { scene: '🌙🐑🐑', bg: 'linear-gradient(#8f9bd6,#c9f2d0)', text: 'Out in the fields, shepherds were watching their sheep in the night.' },
  { scene: '👼✨', bg: 'linear-gradient(#fff6c9,#ffe0f0)', text: "Suddenly, an angel came, and God's bright glory shone all around! The angel said, don't be afraid! I bring you happy news for everyone!" },
  { scene: '👼👼🎶', bg: 'linear-gradient(#ffe0f0,#c9c3ff)', text: 'The angel said, today a Savior is born for you, Christ the Lord! Then lots and lots of angels sang, glory to God!' },
  { scene: '🐑👶🏽🌾💛', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: "The shepherds hurried and found baby Jesus, just like the angel said! Jesus is God's best gift to us, because God loves us so much." },
]

// World English Bible (public domain).
export const CHRISTMAS_VERSE = {
  ref: 'Luke 2:11',
  chunks: ['For there is born to you today,', "in David's city,", 'a Savior,', 'who is Christ the Lord.'],
}

export const CHRISTMAS_STEPS: Step[] = [
  { kind: 'story', title: 'Baby Jesus Is Born', pages: CHRISTMAS_STORY },
  {
    kind: 'maze', title: 'Hurry to Bethlehem',
    intro: 'The shepherds hurried to find baby Jesus! Help the little lamb find the way to the stable.',
    hero: { emoji: '🐑', say: 'the little lamb' }, goal: { emoji: '🛖', say: 'baby Jesus in the stable' },
  },
  {
    kind: 'count', title: 'Counting Lambs',
    intro: "The shepherds took good care of their little lambs. Let's tuck the lambs into the soft hay!",
    item: { emoji: '🐑', say: 'little lamb' }, plural: 'little lambs', basket: '🌾', into: 'the soft hay', rounds: [4, 8],
  },
  { kind: 'trace', title: 'J is for Jesus', intro: 'Jesus starts with the letter J! Trace the big J with your finger.', letters: ['J', 'j'] },
  { kind: 'verse', chunks: CHRISTMAS_VERSE.chunks, ref: CHRISTMAS_VERSE.ref },
  { kind: 'battle', foe: 'chilly', intro: 'Oh no! A grumpy snowflake named Chilly is making everybody shiver! Chilly just needs a friend.' },
  { kind: 'reward', pal: 'starling', sticker: '⭐', stickerName: 'Christmas star' },
]
