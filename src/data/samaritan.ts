import type { Step, StoryPage } from './islands'
import { SAMARITAN_GAME } from '../art/games/samaritan'

// The Good Samaritan (Luke 10:25–37). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in
// words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Love your neighbor: a neighbor is anyone who needs our help, and God wants us to be kind to everyone, even people who
// are different from us. Kept gentle: the robbers are one sentence, and only tiny and far away in the picture; the hurt
// man is sad and needs help, never in pain; the priest and the temple helper are busy, ordinary people who made a sad
// choice. Part one ends with the Samaritan lifting the hurt man onto his own donkey, so the island's game, "To the Inn",
// goes on from there in story order, and part two picks up at the inn.

/** Visit 1: "Who is my neighbor?" The man hurt by the road, the two who go by, and the Samaritan who stops to help. */
export const SAMARITAN_STORY_1: StoryPage[] = [
  { scene: '🧔❓', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'One day, a man asked Jesus a question. "God says to love my neighbor," he said. "But who is my neighbor?" So Jesus told him a story.' },
  { scene: '🛣️😢', bg: 'linear-gradient(#bfe6ff,#f2dcb0)', text: 'A man was walking down a long, rocky road, from Jerusalem to Jericho. On the way, robbers took his things and left him hurt by the side of the road.' },
  { scene: '🚶', bg: 'linear-gradient(#bfe6ff,#f2dcb0)', text: 'Soon a priest came down the road. He saw the hurt man. But he did not stop. He went by on the other side of the road.' },
  { scene: '🚶', bg: 'linear-gradient(#bfe6ff,#f2d0a8)', text: 'Then a temple helper came by. He saw the hurt man, too. But he hurried by on the other side. Would anyone stop to help?' },
  { scene: '🧔❤️', bg: 'linear-gradient(#bfe6ff,#f2dcb0)', text: "Then a Samaritan, a man from Samaria, came by with his donkey. His people and the hurt man's people did not get along. But when he saw the hurt man, he stopped. He felt so sorry for him!" },
  { scene: '🤕💛', bg: 'linear-gradient(#bfe6ff,#f2dcb0)', text: "The Samaritan gently washed the man's hurts and wrapped them in bandages. Then he lifted him up onto his own donkey." },
]

/** Visit 2: the inn, the long night of care, the two coins, Jesus' question, and what it means. Its pictures follow part one's. */
export const SAMARITAN_STORY_2: StoryPage[] = [
  { scene: '🏠🌙', bg: 'linear-gradient(#6b5bb5,#ffa8b8)', text: 'Remember the hurt man on the road? The kind Samaritan took him to an inn, a house where travelers can stay. The innkeeper opened the door. "Come in, come in!" he said.' },
  { scene: '🛏️🌙', bg: 'linear-gradient(#18163f,#3b3486)', text: 'All night long, the Samaritan took care of him. He gave him water to drink and warm soup to eat. Then he tucked him into a cozy bed.' },
  { scene: '🌅🙏', bg: 'linear-gradient(#ffb3c7,#ffe8b0)', text: 'In the morning, the Samaritan gave the innkeeper two coins. "Please take care of him," he said. "I will come back."' },
  { scene: '❓❤️', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Then Jesus asked, "Which one was a good neighbor to the hurt man?" The man said, "The one who was kind to him." "Yes," said Jesus. "Now you go and do the same."' },
  { scene: '❤️✨', bg: 'linear-gradient(#fff1c2,#bfe6ff)', text: 'A neighbor is anyone who needs our help. God loves everyone, and He wants us to be kind to everyone, just like the good Samaritan!' },
]

// (Story cards, `story:samaritan:<n>`, count the pages from 1 through both parts: part 2 starts at page 7.)

// World English Bible (public domain), word for word: the end of Matthew 22:39 (Jesus' words, which the man in the
// story says too, Luke 10:27).
export const SAMARITAN_VERSE = {
  ref: 'Matthew 22:39',
  chunks: ['You shall love', 'your neighbor', 'as yourself.'],
}

/** A story card for the put-it-in-order game and the questions: page n of the whole story (1 to 11). */
const card = (n: number, emoji: string, say: string) => ({ emoji, say, art: `story:samaritan:${n}` })

export const SAMARITAN_STEPS: Step[] = [
  // ----- Visit 1: the story -----
  { kind: 'story', title: 'The Good Samaritan', pages: SAMARITAN_STORY_1 },
  {
    // (Part one ends as the Samaritan lifts the hurt man onto his donkey: now the child leads them to the inn.)
    kind: 'steer', title: 'To the Inn', kit: SAMARITAN_GAME,
    intro: "Let's take the hurt man to an inn, where he can rest! Lead the kind Samaritan and his donkey along the road. Pick the little flowers on the way, to cheer up his new friend!",
    done: 'Hooray, you made it to the inn! The innkeeper is waving hello. Now the hurt man can rest.',
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Donkey Words', decor: '❤️', intro: "Hee-haw! The Samaritan's little donkey wants to play word games with you. Let's go!" },
  { kind: 'pause', line: "The hurt man is safe at the inn. What will the kind Samaritan do next? Let's find out next time!" },

  // ----- Visit 2: the adventure -----
  { kind: 'story', title: 'A Good Neighbor', pages: SAMARITAN_STORY_2, first: SAMARITAN_STORY_1.length },
  {
    kind: 'quiz', title: 'Good Neighbor Questions',
    questions: [
      {
        // (Each picture shows that person in the story: the two going by, and the Samaritan kneeling to help.)
        say: 'Who stopped to help the hurt man?',
        choices: [
          { emoji: '🚶', say: 'The priest', art: 'priest-going-by' },
          { emoji: '🚶', say: 'The temple helper', art: 'temple-helper-going-by' },
          { emoji: '❤️', say: 'The Samaritan', art: 'samaritan-helping' },
        ],
        answer: 2,
      },
      {
        say: 'What did the Samaritan wrap around the hurts?',
        choices: [{ emoji: '🎈', say: 'A balloon' }, { emoji: '🩹', say: 'White bandages', art: 'bandaged-traveler' }, { emoji: '🍃', say: 'A leaf' }],
        answer: 1,
      },
      {
        say: 'Where did the Samaritan take the hurt man?',
        choices: [{ emoji: '🏖️', say: 'To the beach' }, { emoji: '⛰️', say: 'Up a big mountain' }, card(7, '🏠', 'To an inn, to rest')],
        answer: 2,
      },
      {
        say: 'What did the Samaritan give the innkeeper?',
        choices: [{ emoji: '🪙', say: 'Two coins', art: 'two-denarii' }, { emoji: '🍎', say: 'An apple' }, { emoji: '🐑', say: 'A sheep' }],
        answer: 0,
      },
    ],
  },
  {
    // (Money, the sea's numbers goal: two coins first, as in the story. The coins are silver, as on page 9.)
    kind: 'count', title: 'Coins for the Innkeeper',
    intro: "The Samaritan gave the innkeeper coins, so he could take care of the hurt man. Let's count coins into the money bag!",
    item: { emoji: '🪙', say: 'coin', art: 'denarius' }, plural: 'coins', basket: '👝', basketArt: 'money-bag-open', into: 'the money bag', rounds: [2, 5],
    done: 'Thank you! Now the innkeeper can take good care of the hurt man, until the Samaritan comes back.',
  },
  { kind: 'verse', chunks: SAMARITAN_VERSE.chunks, ref: SAMARITAN_VERSE.ref },
  { kind: 'pause', line: "Whoosh! Somebody is racing down the road, too busy to stop for anyone. Who could it be? Let's find out next time!" },

  // ----- Visit 3: the rescue -----
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of the good Samaritan? Put the pictures in order, from the first one to the last one.',
    // The story's own pictures, each a different moment, so no two cards look alike. Each `say` names its picture ("That's <say>.").
    items: [
      card(2, '😢', 'the man hurt by the road'),
      card(3, '🚶', 'the priest going by'),
      card(5, '❤️', 'the Samaritan stopping to help'),
      card(6, '🤕', 'the hurt man riding the donkey'),
      card(8, '🛏️', 'the Samaritan caring for him at the inn'),
      card(9, '🌅', 'the Samaritan paying the innkeeper'),
    ],
  },
  { kind: 'battle', foe: 'dash', intro: 'Oh no! A grumpy ostrich named Dash is zooming down the road, too busy to stop for anyone! Dash just needs a friend.' },
  { kind: 'song', song: 'song-samaritan', intro: "The kind Samaritan stopped to help, and Jesus says we can be kind like him! Let's sing about it. You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'dottie', sticker: '❤️', stickerName: 'kind heart' },
]
