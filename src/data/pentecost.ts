import type { Step, StoryPage } from './islands'
import { PENTECOST_GAME } from '../art/games/pentecost'

// Pentecost (Acts 1:3–14 and Acts 2). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in
// words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// God keeps His promises: Jesus promised the Helper, and God sent His Spirit, and the church began. The Holy Spirit is never
// drawn as a person: only as wind (soft swirls) and as little flames of warm light resting just above each head, that
// never burn anything. Jesus going up to heaven is gentle: light and a soft cloud. The pictures are in
// art/scenes/pentecost.tsx, the game's in art/games/pentecost.tsx.

/** Visit 1: Jesus alive, His promise of the Helper, going up to heaven, and His friends praying together upstairs. */
export const PENTECOST_STORY_1: StoryPage[] = [
  { scene: '🌅🍞🐟', bg: 'linear-gradient(#ffd0d6,#ffeab0)', text: 'Jesus was alive! After Easter, He came to see His friends again and again, for forty days. They ate together and talked together, and Jesus taught them all about God.' },
  { scene: '⛰️🏙️👉', bg: 'linear-gradient(#bfe6ff,#e6ffe9)', text: 'One day, up on a hill near Jerusalem, Jesus said to His friends, "Stay in Jerusalem, and wait. My Father will send you the Helper I promised, the Holy Spirit. He will make you brave, to tell the whole world about Me!"' },
  { scene: '🙌☁️✨', bg: 'linear-gradient(#fff6d8,#bfe6ff)', text: 'Then Jesus lifted up His hands and blessed them. And as they watched, Jesus went up, up, up into heaven, and a cloud hid Him.' },
  { scene: '👼👼👀', bg: 'linear-gradient(#bfe6ff,#e6ffe9)', text: 'His friends kept looking up at the sky. Then two angels in white stood beside them. "Jesus went up to heaven," they said. "And one day, He will come back!"' },
  { scene: '🏠🙏🙏', bg: 'linear-gradient(#fff3c9,#ffe0b5)', text: 'So the friends went back to Jerusalem, full of joy. In a room upstairs, they prayed together every day: Peter, Andrew, James, John, Mary, Jesus\' mother, and many more. They were waiting for the Helper, just like Jesus said.' },
]

/** Visit 2: the wind and the little flames, the crowd from many lands, Peter, and the church. Its pictures follow part one's in art/scenes/pentecost.tsx. */
export const PENTECOST_STORY_2: StoryPage[] = [
  { scene: '🌬️🏠✨', bg: 'linear-gradient(#fff6cf,#ffe7a6)', text: 'Remember? Jesus\' friends were waiting for the Helper. On the day of a big feast called Pentecost, they were all together in the room upstairs. Suddenly, there was a sound from heaven, like a mighty rushing wind! Whoosh! It filled the whole house.' },
  { scene: '🔥🙌✨', bg: 'linear-gradient(#fff3c4,#ffd9a0)', text: 'Then little flames, like fire, came to rest on each one of them! The flames did not burn. They glowed softly, like little lights. And they were all filled with the Holy Spirit.' },
  { scene: '🗣️🌍💬', bg: 'linear-gradient(#bfe6ff,#f3dcb0)', text: 'They began to speak in other languages that they had never learned! People from many lands were in Jerusalem for the feast. A big crowd came running, and each one heard about God\'s wonders in their very own language!' },
  { scene: '🙌👥💛', bg: 'linear-gradient(#bfe6ff,#f3dcb0)', text: 'Then Peter stood up and told the crowd all about Jesus: how God sent Him, how He died and rose again, and how much God loves them. About three thousand people believed in Jesus that day!' },
  { scene: '🍞💛🏠', bg: 'linear-gradient(#ffd0a8,#fff0c8)', text: 'That was how the church began! God\'s family prayed together and shared what they had. They ate together in their homes, with happy hearts. And God\'s Spirit is with us, too. He is our Helper, every day!' },
]

// World English Bible (public domain), word for word: the first part of Galatians 5:22 ("But the fruit of the Spirit is
// love, joy, peace, patience, kindness, goodness, faith,"). Every Pal's fruit is a fruit of the Spirit, and on the last
// island, God's Spirit comes.
export const PENTECOST_VERSE = {
  ref: 'Galatians 5:22',
  chunks: ['But the fruit', 'of the Spirit', 'is love,', 'joy, peace.'],
}

export const PENTECOST_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Jesus Makes a Promise', pages: PENTECOST_STORY_1 },
  // (A look ahead: part two tells it all, so the done line looks ahead too, and the pause can still ask when the Helper
  // will come. The friends kneel in the room upstairs in two groups, so their flames come four and then three more: seven.)
  {
    kind: 'build', title: 'When the Spirit Came', kit: PENTECOST_GAME,
    intro: "Jesus promised to send the Helper, the Holy Spirit. Soon He will come, like a rushing wind, with little flames of light! Let's build a picture of that wonderful day. Drag each part to its place, starting with Jesus' friends.",
    done: "Four little flames and three more flames make seven little flames, one for each friend here! That's how it will be when the Helper comes, just like Jesus promised.",
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Waiting Words', decor: '🙏', intro: "Jesus' friends waited and prayed together, just like Jesus said. While we wait, let's play some word games!" },
  { kind: 'pause', line: "Jesus' friends are waiting and praying, just like He said. When will the Helper come? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: 'The Helper Comes', pages: PENTECOST_STORY_2, first: PENTECOST_STORY_1.length },
  {
    kind: 'quiz', title: 'Pentecost Questions',
    questions: [
      {
        say: 'What did Jesus\' friends hear, on the day of Pentecost?',
        choices: [{ emoji: '🐶', say: 'A puppy barking' }, { emoji: '🌬️', say: 'A sound like a mighty rushing wind', art: 'story:pentecost:6' }, { emoji: '🦁', say: 'A lion roaring' }],
        answer: 1,
      },
      {
        say: 'What came to rest on each one of Jesus\' friends?',
        choices: [{ emoji: '🦋', say: 'Butterflies' }, { emoji: '🎩', say: 'Tall hats' }, { emoji: '✨', say: 'Little flames, like fire', art: 'story:pentecost:7' }],
        answer: 2,
      },
      {
        say: 'Who came running to see?',
        choices: [{ emoji: '🐘', say: 'A big herd of elephants' }, { emoji: '🌍', say: 'People from many lands', art: 'story:pentecost:8' }, { emoji: '🐧', say: 'Some penguins' }],
        answer: 1,
      },
      {
        say: 'Who stood up and told the crowd all about Jesus?',
        choices: [{ emoji: '🙌', say: 'Peter', art: 'story:pentecost:9' }, { emoji: '🐋', say: 'A big fish' }, { emoji: '🐑', say: 'A little sheep' }],
        answer: 0,
      },
    ],
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the bread, so it
  // doesn't promise any.)
  { kind: 'practice', skill: 'numbers', title: 'Bread to Share', decor: '🧺', theme: '🍞', intro: "God's family shared their bread with each other. Now let's play some number games!" },
  { kind: 'verse', chunks: PENTECOST_VERSE.chunks, ref: PENTECOST_VERSE.ref },
  { kind: 'pause', line: "Squawk, squawk! Somebody is chattering so loudly that nobody else can talk! Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell the story of the day God's Spirit came? Put the pictures in order, from the first one to the last one.",
    // The story's own pictures (pages counted from one across both parts), each one different to look at (the wind, in the
    // same room as the praying and the flames, is in the quiz instead). Each `say` names its picture as a lowercase
    // phrase ("That's <say>.").
    items: [
      { emoji: '👉', say: 'Jesus telling His friends to wait for the Helper', art: 'story:pentecost:2' },
      { emoji: '☁️', say: 'Jesus going up to heaven', art: 'story:pentecost:3' },
      { emoji: '🙏', say: 'the friends praying in the room upstairs', art: 'story:pentecost:5' },
      { emoji: '✨', say: 'the little flames on each friend', art: 'story:pentecost:7' },
      { emoji: '💛', say: 'Peter telling the big crowd about Jesus', art: 'story:pentecost:9' },
      { emoji: '🍞', say: "God's family sharing and eating together", art: 'story:pentecost:10' },
    ],
  },
  { kind: 'battle', foe: 'chatter', intro: 'Oh no! A noisy parrot named Chatter is squawking over everyone! Squawk, squawk! Chatter talks and talks, and never listens. Chatter just needs a friend.' },
  { kind: 'song', song: 'song-pentecost', intro: "God sent His Spirit, just like Jesus promised, and He came to stay! Let's sing about it. You can sing it on your Ark any time, too." },
  // (A little flame of God's light, drawn in art/items/isl-pentecost.tsx: no emoji names it.)
  { kind: 'reward', pal: 'flicker', sticker: 'pentecost-flame', stickerName: 'little flame' },
]
