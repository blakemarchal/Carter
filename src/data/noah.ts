import type { Step, StoryPage } from './islands'
import { NOAH_GAME } from '../art/games/noah'

// Noah's Ark. See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in words,
// no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// (The six pages from the first version keep their words, which families may have recorded: pages 1 and
// 2 here, and pages 7, 8, 10 and 11. Part one keeps its title, so page 1 is still read the same way.)

/** Visit 1: God asks Noah to build the ark, and his family builds it. */
export const NOAH_STORY_1: StoryPage[] = [
  { scene: '👴🏽🙏', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago there was a man named Noah. God loved Noah, and Noah loved God.' },
  { scene: '👴🏽🔨', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: 'God told Noah, "A big flood is coming. Build a great big boat called an ark!" Noah trusted God, so he listened and obeyed. Bang, bang, bang!' },
  { scene: '🪚🪵', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: "Noah's three sons helped him build. They sawed the wood and carried big, long boards. Everyone worked hard, day after day." },
  { scene: '🧺🌾', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'God said, "Bring food for your family and for the animals, too." So they carried in baskets of fruit, sacks of grain, and lots and lots of hay!' },
  { scene: '🚢🔨', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: 'At last, the ark was almost ready. It was big and strong, with a roof, windows, and a door, just like God said.' },
]

/** Visit 2: into the ark, through the rain, and out under the rainbow. Its pictures follow part one's. */
export const NOAH_STORY_2: StoryPage[] = [
  { scene: '🚢🙏', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'Noah\'s family built the big ark, just like God said. Then God said, "It is time. Go into the ark, with your family and the animals."' },
  { scene: '🦁🦁 🐘🐘 🦒🦒', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'Then the animals came, two by two! Lions and elephants and giraffes, too.' },
  { scene: '🌧️🌊', bg: 'linear-gradient(#8fa3bf,#7cc6ff)', text: 'The rain fell and fell. But Noah, his family, and all the animals were safe inside the ark. God kept them safe.' },
  { scene: '🐘🐑🦁', bg: 'linear-gradient(#8fa3bf,#e9d3b5)', text: "It rained for forty days and forty nights. Inside the ark, Noah's family fed the animals and took good care of them." },
  { scene: '🕊️🌿', bg: 'linear-gradient(#bfe6ff,#e6ffe9)', text: 'When the rain stopped, the water went down, down, down. Noah sent out a little dove. The dove came back with an olive leaf! There was dry land again.' },
  { scene: '🌈🙌', bg: 'linear-gradient(#ffe0f0,#bfe6ff)', text: 'God put a beautiful rainbow in the sky. It was His promise: He would never flood the whole earth again. And God always keeps His promises!' },
]

export const NOAH_PAIRS = ['🦁', '🐘', '🦒', '🐧', '🦓', '🐒']

// World English Bible (public domain). Kids learn the first part of the verse.
export const NOAH_VERSE = {
  ref: 'Genesis 9:13',
  chunks: ['I set', 'my rainbow', 'in the cloud.'],
}

export const NOAH_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Noah and the Big Boat', pages: NOAH_STORY_1 },
  {
    kind: 'build', title: 'Build the Ark', kit: NOAH_GAME,
    intro: "Now it's your turn! Let's build the ark, just like Noah's family. Drag each part to its place.",
    done: 'You built the ark! It is big and strong, just like God said.',
  },
  {
    kind: 'pairs', animals: NOAH_PAIRS,
    names: { '🦁': 'lions', '🐘': 'elephants', '🦒': 'giraffes', '🐧': 'penguins', '🦓': 'zebras', '🐒': 'monkeys' },
    // (Visit 1 ends before God says "Go into the ark" on page six, so the animals are only ready here.)
    done: 'Two by two, all the animals are ready! When God says it is time, they will go into the ark.',
  },
  { kind: 'pause', line: "Noah's big ark is ready! But big gray clouds are rolling in. What will happen? Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'Safe in the Ark', pages: NOAH_STORY_2, first: NOAH_STORY_1.length },
  // (The intros fit every level: letter sounds, reading words, finding words; counting, what comes next, adding.)
  { kind: 'practice', skill: 'reading', title: 'Word Boat', decor: '⛵', intro: "Let's play word games with the animals!" },
  { kind: 'practice', skill: 'numbers', title: 'Raindrop Numbers', decor: '🌧️', theme: '💧', intro: "Drip, drop! Let's play number games in the rain!" },
  { kind: 'verse', chunks: NOAH_VERSE.chunks, ref: NOAH_VERSE.ref },
  { kind: 'pause', line: "Shh, listen. A little cloud is grumbling, way up in the sky. Who could it be? Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell Noah's story? Put the pictures in order, from the first one to the last one.",
    items: [
      { emoji: '🙏', say: 'Noah praying to God', art: 'story:noah:1' },
      { emoji: '🔨', say: 'Noah building the ark', art: 'story:noah:2' },
      { emoji: '🦁', say: 'the animals coming two by two', art: 'story:noah:7' },
      { emoji: '🌧️', say: 'the ark safe in the rain', art: 'story:noah:8' },
      { emoji: '🕊️', say: 'the dove with the olive leaf', art: 'story:noah:10' },
      { emoji: '🌈', say: "God's rainbow promise", art: 'story:noah:11' },
    ],
  },
  { kind: 'battle', foe: 'rumble', intro: 'Oh no! Here comes a grumpy storm cloud named Rumble! Rumble just needs a friend.' },
  { kind: 'song', song: 'noah-boat', intro: "Noah built a big boat, and God kept everyone safe inside! Let's sing about it. You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'pip', sticker: '🌈', stickerName: 'rainbow' },
]
