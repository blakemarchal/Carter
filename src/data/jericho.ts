import type { Step, StoryPage } from './islands'
import { JERICHO_GAME } from '../art/games/jericho'

// The Walls of Jericho (Joshua 1 to 6). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace
// first, numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its
// words say (art/scenes/jericho.tsx, one array for both parts). Trust and obey: God gave His people a strange
// plan, and they did it, day after day. God's power, never fighting: the walls fall down flat, and nobody is
// hurt. The ark of the covenant is "God's special golden box".
// Three visits (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.

/** Part 1: Joshua, Rahab and the two men, the red cord, across the Jordan, and God's strange plan (pictures 1 to 6). */
export const JERICHO_STORY_1: StoryPage[] = [
  { scene: '🙏✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'When Moses was very old, he died. God chose Joshua to lead His people. God said, "Be strong and brave! I will be with you wherever you go."' },
  { scene: '🏰🌊', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: 'Across the Jordan River was a city called Jericho. It had great big, strong walls all the way around. Joshua sent two men to go and look at it.' },
  { scene: '🏠🌾', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'In Jericho lived a kind woman named Rahab. Her house was built right into the big wall! She hid the two men up on her roof, to keep them safe.' },
  { scene: '🌙❤️', bg: 'linear-gradient(#3b3486,#35577a)', text: 'Rahab said, "I know your God is the real God. Please keep my family safe!" The men said, "Tie this red cord in your window, and everyone in your house will be safe."' },
  { scene: '✨🌊', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: "Then God's people came to the Jordan River. When the priests carried God's special golden box into the water, God stopped the river! Everyone walked across on dry ground." },
  { scene: '🎺🤫', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'God gave Joshua a strange plan. "March around Jericho once a day for six days. The priests will blow trumpets made from rams\' horns. Everyone else must be very quiet."' },
]

/** Part 2: round and round Jericho, the shout, the walls fall, Rahab's family safe, and thanks to God (pictures 7 to 12). */
export const JERICHO_STORY_2: StoryPage[] = [
  { scene: '🎺👣', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: "Remember God's strange plan? Joshua and God's people did just what God said. They marched around Jericho one time. Toot, toot went the trumpets! Nobody else made a sound." },
  { scene: '🌅⛺', bg: 'linear-gradient(#ffb3a0,#e9d3b5)', text: 'The next day, they did it again. And the next day, and the next! Day after day, for six days, they marched around the city, just like God said.' },
  { scene: '🎺📣', bg: 'linear-gradient(#ffe0c0,#e9d3b5)', text: 'On the seventh day, they marched around Jericho seven times! Then the priests blew their trumpets, and Joshua said, "Shout! God has given you the city!"' },
  { scene: '💥🧱', bg: 'linear-gradient(#fff3c9,#e9d3b5)', text: 'So everybody shouted, as loud as they could. And the great big walls came tumbling down, flat on the ground! Crash!' },
  { scene: '🏠❤️', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: "But Rahab's house, with the red cord in the window, was safe. The two men brought Rahab and all her family out, safe and sound, just as they promised." },
  { scene: '🙌✨', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'Everyone thanked God. God was with Joshua, just as He promised. God always keeps His promises, and He is with you, too!' },
]

/** Every page, in order: story cards (`story:jericho:<n>`) count from 1 through both parts. */
export const JERICHO_STORY: StoryPage[] = [...JERICHO_STORY_1, ...JERICHO_STORY_2]

// World English Bible (public domain), word for word: the walls fell down when God's people trusted Him.
export const JERICHO_VERSE = {
  ref: 'Hebrews 11:30',
  chunks: ['By faith', 'the walls of Jericho fell down', 'after they had been encircled', 'for seven days.'],
}

export const JERICHO_STEPS: Step[] = [
  // ----- Visit 1: the story -----
  { kind: 'story', title: 'The Walls of Jericho', pages: JERICHO_STORY_1 },
  {
    kind: 'rhythm', title: 'March Around Jericho',
    intro: "Let's march around Jericho, just like God said! You can blow the trumpet. Tap the trumpet when a note gets to it.",
    done: 'Crash! The big walls came tumbling down! Nothing is too hard for God.',
    kit: JERICHO_GAME,
  },
  // (The intro fits every level: letter sounds, reading words, finding words. 🎵 is drawn as music notes.)
  { kind: 'practice', skill: 'reading', title: 'Trumpet Words', decor: '🎵', intro: "Toot, toot! You played the trumpet so well. Now let's play word games!" },
  { kind: 'pause', line: "The two men made Rahab a promise. Will they keep it? Let's find out next time!" },

  // ----- Visit 2: the adventure -----
  { kind: 'story', title: 'Seven Times Around', pages: JERICHO_STORY_2, first: JERICHO_STORY_1.length },
  {
    kind: 'quiz', title: 'Jericho Questions',
    questions: [
      {
        say: 'What did Rahab tie in her window?',
        choices: [{ emoji: '🍌', say: 'A banana' }, { emoji: '🧶', say: 'A red cord', art: 'red-cord' }, { emoji: '🎩', say: 'A big hat' }],
        answer: 1,
      },
      {
        say: 'What did the priests blow as they marched?',
        choices: [{ emoji: '🎈', say: 'A balloon' }, { emoji: '🎵', say: 'A harp', art: 'harp' }, { emoji: '📯', say: "Trumpets made from rams' horns", art: 'rams-horn' }],
        answer: 2,
      },
      {
        say: 'What did the priests carry into the river?',
        choices: [{ emoji: '✨', say: "God's special golden box", art: 'golden-box' }, { emoji: '🍕', say: 'A pizza' }, { emoji: '⛵', say: "Noah's big boat", art: 'ark' }],
        answer: 0,
      },
      {
        say: 'What happened when everybody shouted?',
        choices: [{ emoji: '🌈', say: 'A rainbow came out' }, { emoji: '🧱', say: 'The walls fell down flat', art: 'story:jericho:10' }, { emoji: '🐸', say: 'A frog said ribbit' }],
        answer: 1,
      },
    ],
  },
  // (🪨 is drawn as a stone: the stones of the fallen walls.)
  { kind: 'practice', skill: 'numbers', title: 'Tumbling Stones', decor: '🪨', theme: '🪨', intro: "Crash! The walls came down, and there are stones everywhere! Let's play number games with them." },
  { kind: 'verse', chunks: JERICHO_VERSE.chunks, ref: JERICHO_VERSE.ref },
  { kind: 'pause', line: "Stomp, stomp! Somebody grumpy is stomping around the camp. Who could it be? Let's find out next time!" },

  // ----- Visit 3: the rescue -----
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of Jericho? Put the pictures in order, from the first one to the last one.',
    items: [
      { emoji: '🙏', say: 'God choosing Joshua', art: 'story:jericho:1' },
      { emoji: '🏠', say: 'Rahab hiding the two men on her roof', art: 'story:jericho:3' },
      { emoji: '🌊', say: 'crossing the river on dry ground', art: 'story:jericho:5' },
      { emoji: '🎺', say: 'marching around Jericho, ready to shout', art: 'story:jericho:9' },
      { emoji: '💥', say: 'the walls tumbling down', art: 'story:jericho:10' },
      { emoji: '❤️', say: "Rahab's family, safe and sound", art: 'story:jericho:11' },
    ],
  },
  { kind: 'battle', foe: 'stomper', intro: 'Oh no! A grumpy little ram named Stomper is stomping around and bumping into everybody! Stomper just needs a friend.' },
  { kind: 'song', song: 'song-jericho', intro: "God's people marched round and round Jericho, and God made the walls fall down! Let's sing about it. You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'toot', sticker: 'rams-horn', stickerName: "ram's horn trumpet" },
]
