import type { Step, StoryPage } from './islands'
import { SAMUEL_GAME } from '../art/games/samuel'

// Samuel Listens (1 Samuel 1 to 3). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first,
// numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// God hears, and God speaks, and we listen: God answers Hannah's prayer, and He calls young Samuel by name.
// Kept simple and gentle: Eli's sons and the hard message God gave Samuel about them are left out, and night in
// God's house is cozy (God's lamp glows, the stars twinkle). Part one ends with the first call, so the game
// ("Run to Eli!") is Samuel's run to Eli, and the visit ends wondering who called him.

/** Visit 1: Hannah's prayer, baby Samuel, his new home in God's house, and a voice in the night. */
export const SAMUEL_STORY_1: StoryPage[] = [
  { scene: '🙏👶', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago, there was a woman named Hannah. She wanted a baby very much, and she felt sad. One day at God\'s house, she prayed and prayed. "Please, God, give me a baby boy. He will be Your helper all his life."' },
  { scene: '👴🏽💛', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Old Eli the priest saw Hannah praying. He said, "Go in peace. May God give you what you asked for." And Hannah was not sad anymore.' },
  { scene: '👶🏽☀️', bg: 'linear-gradient(#ffe9c9,#fff3c9)', text: 'God heard Hannah\'s prayer! Soon she had a baby boy. She named him Samuel, because she said, "I asked God for him."' },
  { scene: '👩🏽🧒🏽', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'When Samuel was old enough, Hannah kept her promise. She brought him to God\'s house, to help old Eli and learn all about God.' },
  { scene: '🧥💛', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Samuel helped Eli in God\'s house. Every year, Hannah came to visit. She brought him a new little coat she had made, just his size!' },
  { scene: '🪔🌙', bg: 'linear-gradient(#3b3486,#ffe9c9)', text: 'One night, God\'s lamp was still glowing, and Samuel was fast asleep in God\'s house. Then he heard someone call, "Samuel!"' },
]

/** Visit 2: three times to Eli, then "Speak, Lord. I am listening." Its pictures follow part one's in art/scenes/samuel.tsx. */
export const SAMUEL_STORY_2: StoryPage[] = [
  { scene: '🧒🏽👴🏽', bg: 'linear-gradient(#3b3486,#ffe9c9)', text: 'In the night, Samuel heard someone call his name. He ran to Eli and said, "Here I am! You called me." But Eli said, "I did not call you. Go back to bed."' },
  { scene: '🏃🏽🪔', bg: 'linear-gradient(#3b3486,#ffe9c9)', text: 'So Samuel lay down again. Then he heard it again: "Samuel!" He ran to Eli. "Here I am!" But Eli said, "I did not call you, my son. Lie down again."' },
  { scene: '👴🏽✨', bg: 'linear-gradient(#3b3486,#ffe9c9)', text: 'Then it happened a third time! Now Eli understood. God was calling Samuel! Eli said, "Go and lie down. If He calls you, say: Speak, Lord. I am listening."' },
  { scene: '✨🙏', bg: 'linear-gradient(#3b3486,#fff3c9)', text: 'Samuel lay down. Then God came and called, just like before: "Samuel! Samuel!" And Samuel said, "Speak, Lord. I am listening."' },
  { scene: '🧔🏽✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'God spoke to Samuel, and Samuel listened. Samuel grew up, and God was with him. He told everyone what God said.' },
  { scene: '📖💛', bg: 'linear-gradient(#3b3486,#ffe9c9)', text: 'God hears us when we pray, just like He heard Hannah. And God speaks to us in the Bible. So let\'s listen to God, just like Samuel!' },
]

// World English Bible (public domain), word for word: what Samuel said to God, at the end of 1 Samuel 3:10
// ("Yahweh came, and stood, and called as at other times, 'Samuel! Samuel!' Then Samuel said, 'Speak; for your
// servant hears.'"). The words kids learn are only Samuel's, which don't say "Yahweh".
export const SAMUEL_VERSE = {
  ref: '1 Samuel 3:10',
  chunks: ['Speak;', 'for your servant', 'hears.'],
}

export const SAMUEL_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: "Hannah's Prayer", pages: SAMUEL_STORY_1 },
  {
    kind: 'steer', title: 'Run to Eli!',
    intro: 'Someone is calling Samuel! Help him run to Eli. Slide him along the glowing path, and light the little lamps on the way.',
    done: 'You did it! Samuel ran all the way to Eli and said, Here I am! And you lit five little lamps on the way.',
    kit: SAMUEL_GAME,
  },
  // (The game counts the lamps, so this visit's activity is reading. The intro fits every level: letter sounds,
  // reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Listening Words', decor: '🪔', intro: "Samuel listened carefully. Let's listen carefully too, and play some word games!" },
  { kind: 'pause', line: "Someone called Samuel's name in the night. Who could it be? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: 'Here I Am', pages: SAMUEL_STORY_2, first: SAMUEL_STORY_1.length },
  {
    // (Putting things in order by size: the same coat, drawn four sizes, its hem resting on the ground.)
    kind: 'sequence', title: "Samuel's Coats",
    intro: 'Samuel grew bigger every year, so every new coat Hannah made was bigger, too! Put the coats in order, from the smallest to the biggest.',
    items: [
      { emoji: '🧥', say: 'the tiny coat', art: 'samuel-coat-1' },
      { emoji: '🧥', say: 'the little coat', art: 'samuel-coat-2' },
      { emoji: '🧥', say: 'the bigger coat', art: 'samuel-coat-3' },
      { emoji: '🧥', say: 'the biggest coat', art: 'samuel-coat-4' },
    ],
  },
  {
    kind: 'quiz', title: 'Samuel Questions',
    questions: [
      {
        say: 'What did Hannah pray for?',
        choices: [{ emoji: '🐶', say: 'A puppy' }, { emoji: '👶', say: 'A baby boy', art: 'swaddled-baby' }, { emoji: '🎂', say: 'A birthday cake' }],
        answer: 1,
      },
      {
        say: 'What did Hannah make for Samuel every year?',
        choices: [{ emoji: '🧥', say: 'A little coat', art: 'samuel-coat' }, { emoji: '⛵', say: 'A boat' }, { emoji: '🎈', say: 'A balloon' }],
        answer: 0,
      },
      {
        say: "What was still glowing in God's house at night?",
        choices: [{ emoji: '☀️', say: 'The sun' }, { emoji: '🌈', say: 'A rainbow' }, { emoji: '🪔', say: "God's lamp", art: 'gods-lamp' }],
        answer: 2,
      },
    ],
  },
  { kind: 'verse', chunks: SAMUEL_VERSE.chunks, ref: SAMUEL_VERSE.ref },
  { kind: 'pause', line: "Squeak, squeak, squeak! Somebody is squeaking all night long. Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell Samuel's story? Put the pictures in order, from the first one to the last one.",
    // The story's own pictures (pages counted from one across both parts), one from each place in the story,
    // so no two cards look alike. Each `say` names its picture ("That's <say>.").
    items: [
      { emoji: '🙏', say: 'Hannah praying for a baby', art: 'story:samuel:1' },
      { emoji: '👶', say: 'Hannah holding baby Samuel', art: 'story:samuel:3' },
      { emoji: '🧥', say: 'Hannah bringing Samuel his new coat', art: 'story:samuel:5' },
      { emoji: '🌙', say: 'Samuel running to Eli in the night', art: 'story:samuel:8' },
      { emoji: '✨', say: 'Samuel listening to God', art: 'story:samuel:10' },
      { emoji: '🧔', say: 'Samuel all grown up', art: 'story:samuel:11' },
    ],
  },
  { kind: 'battle', foe: 'squeaky', intro: 'Oh no! A grumpy little bat named Squeaky is squeaking all night long, so nobody can hear! Squeaky just needs a friend.' },
  { kind: 'song', song: 'song-samuel', intro: "Let's sing about Samuel, who listened when God called his name! You can sing it on your Ark any time, too." },
  // (The little clay lamp, like the ones Samuel lit on his way to Eli: the 🪔 drawing in art/items/things.tsx.)
  { kind: 'reward', pal: 'echo', sticker: '🪔', stickerName: 'glowing lamp' },
]
