import type { Step, StoryPage } from './islands'
import { MANNA_GAME } from '../art/games/manna'

// Manna in the Desert (Exodus 16, and 17:1-7 for the water from the rock). See docs/ISLAND-GUIDE.md: short
// sentences for 4-year-olds, grace first, numbers in words, no emoji or symbols in anything spoken, and every
// page's picture shows what its words say. Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1):
// the story, the adventure, the rescue. The same family from the Red Sea walks this story too.
// Grace first: God hears all the grumbling and still feeds His people, every single day. Kept gentle and
// funny: the spoiled manna is just smelly (no worms), with a buzzing fly.

/** Visit 1: into the desert, hungry, God's promise, the quail, and the first morning of manna. */
export const MANNA_STORY_1: StoryPage[] = [
  { scene: '🏜️☁️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: "After God brought His people safely through the Red Sea, they walked on into the desert. Moses led the way, and God's tall cloud showed them where to go." },
  { scene: '☀️😠', bg: 'linear-gradient(#bfe6ff,#f3dcb0)', text: 'The desert was hot and dry, and soon all the food was gone. Tummies rumbled, and the people grumbled. "We are hungry! In Egypt, we had bread to eat!"' },
  { scene: '🙏✨', bg: 'linear-gradient(#f9b4a8,#ffe6b0)', text: 'Moses prayed to God. God heard all that grumbling, but He still loved His people. God said, "I will rain bread from the sky for you!"' },
  { scene: '🐦🌙', bg: 'linear-gradient(#6b5bb5,#ffa8b8)', text: 'That evening, God sent quail, lots and lots of little birds! They covered the whole camp. Now there was plenty of food for everyone.' },
  { scene: '🌅❄️', bg: 'linear-gradient(#ffb3c7,#ffe8b0)', text: 'The next morning, the ground was covered with little white flakes, like frost. Everyone came out of their tents to look. "What is it?" they said.' },
  { scene: '🧺😋', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Moses said, "It is the bread God has given you. Gather just enough for today." They called it manna. It tasted like crackers made with honey. Yum!' },
]

/** Visit 2: just enough every day, the day of rest, water from the rock, and forty years. Its pictures follow part one's. */
export const MANNA_STORY_2: StoryPage[] = [
  { scene: '🫙🪰', bg: 'linear-gradient(#bfe6ff,#f3dcb0)', text: 'God sent manna every morning, and He said, "Gather just enough for today." But some people saved extra, just in case. The next morning, it was spoiled and smelly! Pee-yew!' },
  { scene: '🌅🧺', bg: 'linear-gradient(#ffb3c7,#ffe8b0)', text: 'But every morning, there was fresh manna on the ground again. Some people gathered a lot, and some gathered a little. And everyone had just enough!' },
  { scene: '😴⛺', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'On the sixth day, they gathered twice as much. Then on the seventh day, everyone rested, and the saved manna stayed fresh and yummy!' },
  { scene: '🪨💦', bg: 'linear-gradient(#bfe6ff,#f3dcb0)', text: 'One day, there was no water, and everyone was thirsty. God told Moses to hit a big rock with his staff. Moses did, and splash! Fresh water came pouring out!' },
  { scene: '🌅🍯', bg: 'linear-gradient(#ffb3c7,#ffe8b0)', text: 'For forty years, God fed His people with manna, every single morning. Aaron even kept some manna in a jar, so they would always remember how God took care of them.' },
  { scene: '🙏💛', bg: 'linear-gradient(#ffc9a8,#fff0c4)', text: 'God gave His people just what they needed, every single day. And God takes care of you, too! He loves you, and He gives you what you need, every day.' },
]

// World English Bible (public domain), word for word: the first words God says in Exodus 16:4 (the words
// before them, "Then Yahweh said to Moses," are left out). The WEB's verse goes on after a comma ("...for
// you, and the people shall go out..."), so it ends with a full stop here, as Noah's verse does.
export const MANNA_VERSE = {
  ref: 'Exodus 16:4',
  chunks: ['Behold,', 'I will rain bread', 'from the sky', 'for you.'],
}

export const MANNA_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Bread from Heaven', pages: MANNA_STORY_1 },
  {
    kind: 'catch', title: 'Gather the Manna',
    intro: 'God rained bread from the sky! Move the basket, and catch the manna as it falls. Can you catch ten pieces?',
    done: 'Ten pieces of manna, just enough for today! Thank You, God, for bread from heaven.',
    plural: 'pieces of manna', kit: MANNA_GAME,
  },
  // (The game counts to ten, so this visit's activity is reading. The intro fits every level: letter sounds,
  // reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Sweet Words', decor: '🍯', intro: "Mmm! Manna tasted like honey. Let's play some sweet word games together!" },
  { kind: 'pause', line: "God said, gather just enough for today. But what happens if someone saves extra? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: 'Just Enough', pages: MANNA_STORY_2, first: MANNA_STORY_1.length },
  {
    kind: 'quiz', title: 'Manna Questions',
    questions: [
      {
        say: 'What did God send to the camp in the evening?',
        choices: [{ emoji: '🐘', say: 'An elephant' }, { emoji: '🐦', say: 'Quail', art: 'quail' }, { emoji: '🐧', say: 'A penguin' }],
        answer: 1,
      },
      {
        say: 'What did the manna taste like?',
        choices: [{ emoji: '🍕', say: 'Pizza' }, { emoji: '🧀', say: 'Cheese' }, { emoji: '🍯', say: 'Crackers made with honey', art: 'manna-wafers' }],
        answer: 2,
      },
      {
        say: 'What happened to the manna that people saved overnight?',
        choices: [{ emoji: '🫙', say: 'It was spoiled and smelly', art: 'spoiled-manna' }, { emoji: '🐸', say: 'It turned into a frog' }, { emoji: '🎂', say: 'It turned into a cake' }],
        answer: 0,
      },
      {
        say: 'What came out of the rock when Moses hit it?',
        choices: [{ emoji: '🍦', say: 'Ice cream' }, { emoji: '🦋', say: 'Butterflies' }, { emoji: '💦', say: 'Fresh water', art: 'rock-water' }],
        answer: 2,
      },
    ],
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the drops.)
  { kind: 'practice', skill: 'numbers', title: 'Water from the Rock', decor: '💦', theme: '💧', intro: "Splish, splash! God gave His people fresh water from a rock. Let's play some number games!" },
  { kind: 'verse', chunks: MANNA_VERSE.chunks, ref: MANNA_VERSE.ref },
  { kind: 'pause', line: "Grumble, grumble! Someone in the desert thinks dinner is much too slow. Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story', intro: "Let's tell the story of the manna! Put the pictures in order, from first to last.",
    // The story's own pictures (pages counted from one across both parts), one from each part of the story
    // so no two cards look alike. Each `say` names its picture as a lowercase phrase ("That's <say>.").
    items: [
      { emoji: '😠', say: 'the hungry people grumbling', art: 'story:manna:2' },
      { emoji: '🐦', say: 'the quail coming in the evening', art: 'story:manna:4' },
      { emoji: '❄️', say: 'little white flakes on the ground', art: 'story:manna:5' },
      { emoji: '🫙', say: 'the smelly manna saved overnight', art: 'story:manna:7' },
      { emoji: '😴', say: 'the day of rest', art: 'story:manna:9' },
      { emoji: '💦', say: 'water pouring out of the rock', art: 'story:manna:10' },
    ],
  },
  { kind: 'battle', foe: 'shelly', intro: 'Oh no! A grumpy little tortoise named Shelly is grumbling that dinner is much too slow! Shelly just needs a friend.' },
  { kind: 'song', song: 'song-manna', intro: "Let's sing about the bread from heaven that God gave His people every morning! You can sing it on your Ark any time, too." },
  // (Aaron's golden jar of manna, from the end of the story: art/items/isl-manna.tsx.)
  { kind: 'reward', pal: 'quilly', sticker: 'manna-jar', stickerName: 'jar of manna' },
]
