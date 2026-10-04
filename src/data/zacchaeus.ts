import type { Step, StoryPage } from './islands'
import { ZACCHAEUS_GAME } from '../art/games/zacchaeus'

// Zacchaeus (Luke 19:1–10). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in words,
// no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Jesus loves everyone, and His love changes hearts. Zacchaeus is short, and the story is cheerful about it, never
// mocking. The people grumble a little, and that's all. His money is coins, as in Bible times.
// The island's game, "Giving It Back", comes after part two, where Zacchaeus promises to give back what he took and
// share with the poor: the child helps him do it. So the first visit has two activities instead of the game.

/** Visit 1: rich Zacchaeus takes too much money; Jesus is coming, but he's too short to see; up the sycamore tree he goes, and Jesus stops right under it. */
export const ZACCHAEUS_STORY_1: StoryPage[] = [
  { scene: '🏠🪙', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'In the city of Jericho, there lived a man named Zacchaeus. Zacchaeus was very rich. He had a big, fancy house, and lots and lots of money!' },
  { scene: '🪙👑', bg: 'linear-gradient(#bfe6ff,#f6e2b8)', text: 'Zacchaeus collected money from the people, for the king. But he took more than he should, and kept the extra for himself. So the people of Jericho did not like Zacchaeus.' },
  { scene: '📣👥', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'One day, big news came to Jericho: "Jesus is coming!" Everyone hurried to see Him. Soon the street was full of people!' },
  { scene: '👥👥', bg: 'linear-gradient(#bfe6ff,#f6e2b8)', text: 'Zacchaeus wanted to see Jesus, too. But he was short, and the crowd was tall. He hopped and jumped, but he could not see a thing!' },
  { scene: '🌳⬆️', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'So Zacchaeus ran ahead, down the road, to a big sycamore tree. Then up, up, up he climbed! Now he could see everything.' },
  { scene: '🌳👣', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Here came Jesus, walking down the road with His friends. Then Jesus stopped, right under the sycamore tree!' },
]

/** Visit 2: "Zacchaeus, hurry and come down!", dinner at his house and his promise, God's rescue, and a changed heart. Its pictures follow part one's. */
export const ZACCHAEUS_STORY_2: StoryPage[] = [
  { scene: '🌳👋', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Remember Zacchaeus, up in the sycamore tree? Jesus looked up and said, "Zacchaeus, hurry and come down! I must stay at your house today."' },
  { scene: '🙌🌳', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Zacchaeus hurried down, as fast as he could. He was so happy! But some people grumbled, "Why is Jesus going to his house?"' },
  { scene: '🍞🪙', bg: 'linear-gradient(#ffd9a8,#fff3c9)', text: 'At dinner, Zacchaeus stood up and said, "Half of what I have, I\'ll give to the poor. And if I took too much from anyone, I\'ll pay them back four times as much!"' },
  { scene: '🏠✨', bg: 'linear-gradient(#c9b8ff,#ffd9c9)', text: 'Jesus said, "Today God\'s rescue has come to this house! The Son of Man came to look for the lost ones and save them." The Son of Man is Jesus! Zacchaeus was lost, but Jesus found him.' },
  { scene: '🪙💛', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'Zacchaeus gave back what he took, and more! He shared with the poor, too. Jesus loves everyone, and His love changes hearts!' },
]

// (Story cards, `story:zacchaeus:<n>`, count the pages from 1 through both parts: part 2 starts at page 7.)

// World English Bible (public domain), word for word: Luke 19:10, what Jesus said at the house of Zacchaeus.
// (Page ten says that the Son of Man is Jesus.)
export const ZACCHAEUS_VERSE = {
  ref: 'Luke 19:10',
  chunks: ['For the Son of Man came', 'to seek and to save', 'that which was lost.'],
}

/** A story card for the put-it-in-order game: page n of the whole story (1 to 11). */
const card = (n: number, emoji: string, say: string) => ({ emoji, say, art: `story:zacchaeus:${n}` })

export const ZACCHAEUS_STEPS: Step[] = [
  // ----- Visit 1: the story -----
  { kind: 'story', title: 'Zacchaeus and the Sycamore Tree', pages: ZACCHAEUS_STORY_1 },
  {
    // (Page five: he runs ahead down the road to the sycamore tree. He faces left in the drawing, as animal emoji
    // do, so the maze turns him round to run right.)
    kind: 'maze', title: 'Run to the Tree',
    intro: 'Zacchaeus wants to see Jesus! Help him run ahead, all the way to the big sycamore tree.',
    hero: { emoji: '🏃', say: 'Zacchaeus', art: 'zacchaeus-running' }, goal: { emoji: '🌳', say: 'the sycamore tree', art: 'sycamore-tree' },
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Treetop Words', decor: '🌳', intro: "Zacchaeus can see everything from up in the tree! Let's play word games, way up high." },
  { kind: 'pause', line: "Jesus stopped right under the sycamore tree! What will He say to Zacchaeus? Let's find out next time!" },

  // ----- Visit 2: the adventure -----
  { kind: 'story', title: 'Hurry Down, Zacchaeus', pages: ZACCHAEUS_STORY_2, first: ZACCHAEUS_STORY_1.length },
  {
    // (Right after his promise at dinner, page nine: the child helps him keep it, sharing his coins fairly.)
    kind: 'share', title: 'Giving It Back',
    intro: "Zacchaeus wants to give back the money he took, and share with people who need it. Let's help him!",
    done: 'Everyone got the same! Zacchaeus gave back what he took, and more. Giving makes hearts so happy!',
    kit: ZACCHAEUS_GAME,
  },
  {
    kind: 'quiz', title: 'Zacchaeus Questions',
    questions: [
      {
        say: 'Why did Zacchaeus climb up the tree?',
        choices: [{ emoji: '💤', say: 'To take a nap' }, { emoji: '🌳', say: 'To see Jesus', art: 'story:zacchaeus:5' }, { emoji: '🐦', say: 'To find a bird' }],
        answer: 1,
      },
      {
        say: 'Where did Jesus have dinner?',
        choices: [{ emoji: '⛵', say: 'On a boat' }, { emoji: '⛺', say: 'In a tent' }, { emoji: '🏠', say: 'At the house of Zacchaeus', art: 'story:zacchaeus:9' }],
        answer: 2,
      },
      {
        // (Four times as much: for one coin too many, four coins back.)
        say: 'Zacchaeus took one coin too many. He paid back four times as much! How many coins did he give back?',
        choices: [{ emoji: '🪙', say: 'One coin' }, { emoji: '🪙🪙🪙🪙', say: 'Four coins' }, { emoji: '🪙🪙', say: 'Two coins' }],
        answer: 1,
      },
      {
        say: 'What did Zacchaeus do with his money?',
        choices: [{ emoji: '🪙', say: 'He gave it back and shared it', art: 'story:zacchaeus:11' }, { emoji: '🐫', say: 'He bought a camel' }, { emoji: '🎂', say: 'He bought a big cake' }],
        answer: 0,
      },
    ],
  },
  { kind: 'verse', chunks: ZACCHAEUS_VERSE.chunks, ref: ZACCHAEUS_VERSE.ref },
  { kind: 'pause', line: "Scritch, scratch! Somebody grumpy is grabbing every nut in the tree, and keeping them all. Who could it be? Let's find out next time!" },

  // ----- Visit 3: the rescue -----
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of Zacchaeus? Put the pictures in order, from the first one to the last one.',
    // (Each `say` names its picture: "That's <say>.")
    items: [
      card(2, '🪙', 'Zacchaeus taking too much money'),
      card(4, '👥', 'Zacchaeus trying to see over the crowd'),
      card(5, '🌳', 'Zacchaeus up in the sycamore tree'),
      card(7, '👋', 'Jesus calling Zacchaeus to come down'),
      card(9, '🍞', 'Zacchaeus making a promise at dinner'),
      card(11, '💛', 'Zacchaeus giving back the money'),
    ],
  },
  { kind: 'battle', foe: 'scamper', intro: 'Oh no! A grumpy squirrel named Scamper is grabbing every nut and keeping them all! Scamper just needs a friend.' },
  { kind: 'song', song: 'song-zacchaeus', intro: "Zacchaeus hurried down, and Jesus came to his house! Let's sing about it. You can sing it on your Ark any time, too." },
  // (Zacchaeus up in the sycamore tree: the drawing in art/items/isl-zacchaeus.tsx.)
  { kind: 'reward', pal: 'ribbit', sticker: 'zacchaeus-in-tree', stickerName: 'Zacchaeus in the tree' },
]
