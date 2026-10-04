import type { Step, StoryPage } from './islands'
import { PALM_SUNDAY_GAME } from '../art/games/palm-sunday'

// Palm Sunday (Matthew 21:1–17, Luke 19:28–40, John 12:12–16). See docs/ISLAND-GUIDE.md: short sentences for
// 4-year-olds, grace first, numbers in words, no emoji or symbols in anything spoken, and every page's picture shows
// what its words say (art/scenes/palm-sunday.tsx, one array for both parts). Jesus is our King: a gentle King who comes
// in peace, riding a little donkey, not a big horse. The grumpy leaders are cross, never frightening, and the
// overturned tables in the temple are left out.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue. The island's
// game, "The Hosanna Parade", comes after part one, as Jesus rides toward the city: the child plays the tambourine
// while the crowd waves its palm branches (part two tells it).

/** Visit 1: the road to Jerusalem, the young donkey found just as Jesus said, the friends' coats, and the ride toward the city. */
export const PALM_SUNDAY_STORY_1: StoryPage[] = [
  { scene: '🚶🏽🏙️', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Jesus and His friends were walking to Jerusalem, the big city. It was almost time for a happy feast called the Passover, and lots of people were on the road.' },
  { scene: '👉🏘️', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Near the city, Jesus said to two of His friends, "Go to the village over there. You will find a young donkey that no one has ever ridden. Bring it to Me. If anyone asks, say, \'The Lord needs it.\'"' },
  { scene: '🫏🏠', bg: 'linear-gradient(#bfe6ff,#f6e2b8)', text: 'The friends found the young donkey, just as Jesus said! "Why are you untying our donkey?" asked its owners. "The Lord needs it," said the friends. So the owners let them take it.' },
  { scene: '🧥🫏', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'They brought the little donkey to Jesus. They put their coats on its back, to make a soft seat. Then Jesus sat on the donkey.' },
  { scene: '🫏🏙️', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Jesus rode the little donkey down the hill, toward the city. Clip, clop, clip, clop! People saw Him coming. "Look! It\'s Jesus!" they said, and they ran to see Him.' },
]

/** Visit 2: coats and palm branches on the road, "Hosanna!", the stones that would shout, the children in God's house, and the gentle King. Its pictures follow part one's. */
export const PALM_SUNDAY_STORY_2: StoryPage[] = [
  { scene: '🧥🌴', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Remember Jesus, riding the little donkey? Lots and lots of people came! Some spread their coats on the road for Him. Others cut branches from the palm trees and laid them down, too.' },
  { scene: '🌴🙌', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Everyone waved palm branches and shouted, "Hosanna! Blessed is he who comes in the name of the Lord!" Hosanna is a happy shout that praises God.' },
  { scene: '😠🪨', bg: 'linear-gradient(#bfe6ff,#f6e2b8)', text: 'But some grumpy leaders did not like it. "Teacher, tell them to be quiet!" they said. Jesus said, "If they were quiet, even the stones would shout!"' },
  { scene: '🏛️🎶', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Then Jesus went into God\'s house, the temple. Children were singing there, "Hosanna! Hosanna!" Jesus was so glad. He said God loves to hear children praise Him!' },
  { scene: '🐴🕊️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Kings usually rode big, strong horses. But Jesus rode a little donkey! He is a gentle King, and He came to bring peace.' },
  { scene: '👑💛', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'Jesus is our King, too! He loves us so much. We can sing "Hosanna!" to Him, just like the children did.' },
]

// (Story cards, `story:palm-sunday:<n>`, count the pages from 1 through both parts: part two starts at page 6.)

// World English Bible (public domain), word for word: part of Matthew 21:9, what the crowd shouted (page seven).
export const PALM_SUNDAY_VERSE = {
  ref: 'Matthew 21:9',
  chunks: ['Blessed is he', 'who comes', 'in the name of the Lord!'],
}

/** A story card for the put-it-in-order game: page n of the whole story (1 to 11). */
const card = (n: number, emoji: string, say: string) => ({ emoji, say, art: `story:palm-sunday:${n}` })

export const PALM_SUNDAY_STEPS: Step[] = [
  // ----- Visit 1: the story -----
  { kind: 'story', title: 'Jesus and the Little Donkey', pages: PALM_SUNDAY_STORY_1 },
  {
    kind: 'rhythm', title: 'The Hosanna Parade',
    intro: "Here comes Jesus, riding the little donkey! Everyone is so happy to see Him. Let's play the tambourine for the parade! Tap it when a note gets to it.",
    done: 'Hosanna! Everyone waved palm branches and sang for Jesus, the King!',
    kit: PALM_SUNDAY_GAME,
  },
  // (The intro fits every level: letter sounds, reading words, finding words. 🌴 is drawn as a date palm: art/items/isl-palm-sunday.tsx.)
  { kind: 'practice', skill: 'reading', title: 'Hosanna Words', decor: '🌴', intro: "Hosanna! What a happy parade! Now let's play word games under the palm trees." },
  { kind: 'pause', line: "Jesus is almost at the big city, and the crowd is getting bigger and bigger! What will happen next? Let's find out next time!" },

  // ----- Visit 2: the adventure -----
  { kind: 'story', title: 'Hosanna to the King', pages: PALM_SUNDAY_STORY_2, first: PALM_SUNDAY_STORY_1.length },
  {
    // (Palm branches like the ones the people waved and laid on the road, on pages six and seven.)
    kind: 'count', title: 'Palm Branches for Jesus',
    intro: "Let's gather palm branches in the basket, so everyone can wave one for Jesus!",
    item: { emoji: '🌿', say: 'palm branch', art: 'palm-branch' }, plural: 'palm branches', basket: '🧺', basketArt: 'basket', into: 'the basket', rounds: [3, 6],
    done: 'So many palm branches! Now everyone can wave them for Jesus. Hosanna!',
  },
  {
    // (Each picture shows just what's said: one camel, one balloon, one kite, one duck, one frog; sheep and fish are
    // the same for one or many; the stones are three; the children are on page nine.)
    kind: 'quiz', title: 'Palm Sunday Questions',
    questions: [
      {
        say: 'What did Jesus ride into Jerusalem?',
        choices: [{ emoji: '🐫', say: 'A camel' }, { emoji: '🫏', say: 'A little donkey', art: 'donkey' }, { emoji: '🐎', say: 'A big horse', art: 'big-horse' }],
        answer: 1,
      },
      {
        say: 'What did the people wave for Jesus?',
        choices: [{ emoji: '🎈', say: 'A balloon' }, { emoji: '🪁', say: 'A kite' }, { emoji: '🌿', say: 'A palm branch', art: 'palm-branch' }],
        answer: 2,
      },
      {
        say: 'Jesus said that if the people were quiet, something else would shout! What was it?',
        choices: [{ emoji: '🐟', say: 'The fish' }, { emoji: '🪨', say: 'The stones', art: 'stones' }, { emoji: '🐑', say: 'The sheep' }],
        answer: 1,
      },
      {
        say: "Who sang Hosanna in God's house?",
        choices: [{ emoji: '👧', say: 'The children', art: 'story:palm-sunday:9' }, { emoji: '🦆', say: 'A duck' }, { emoji: '🐸', say: 'A frog' }],
        answer: 0,
      },
    ],
  },
  { kind: 'verse', chunks: PALM_SUNDAY_VERSE.chunks, ref: PALM_SUNDAY_VERSE.ref },
  { kind: 'pause', line: "Shh! A little stone is sitting by the road, grumpy and quiet. It won't make a sound! Who could it be? Let's find out next time!" },

  // ----- Visit 3: the rescue -----
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of Palm Sunday? Put the pictures in order, from the first one to the last one.',
    // (Each `say` names its picture: "That's <say>.")
    items: [
      card(2, '👉', 'Jesus sending two friends to find a donkey'),
      card(3, '🏠', 'the friends finding the young donkey'),
      card(4, '🧥', 'Jesus sitting on the coats on the little donkey'),
      card(7, '🌴', 'everyone waving palm branches and shouting Hosanna'),
      card(8, '🪨', 'Jesus saying that even the stones would shout'),
      card(9, '🎶', "the children singing in God's house"),
    ],
  },
  { kind: 'battle', foe: 'rocky', intro: "Oh no! A grumpy little stone named Rocky is sitting by the road, with its arms folded tight. It won't make a sound! Rocky just needs a friend." },
  { kind: 'song', song: 'song-palm-sunday', intro: "Everyone waved palm branches and sang Hosanna to Jesus, the gentle King! Let's sing about it. You can sing it on your Ark any time, too." },
  // (A palm branch, like the ones the crowd waved: the drawing in art/items/isl-palm-sunday.tsx. 🌿 is a herb.)
  { kind: 'reward', pal: 'swish', sticker: 'palm-branch', stickerName: 'palm branch' },
]
