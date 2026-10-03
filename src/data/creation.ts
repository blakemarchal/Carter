import type { Step, StoryPage } from './islands'
import { CREATION_GAME } from '../art/games/creation'

// God Made Everything, in three visits (docs/GAME-PLAN.md §3.1): the six days, then God's special friends
// (Adam and Eve, their garden, the animals' names, the seventh day, and you), then the rescue.
// Each day's page names its day (the "Seven Days" step asks for them in order), and "And God saw that it
// was good!" comes back as a refrain to say along, on the days Genesis says it (it isn't said on day two).
// The pictures for both parts are one array in art/scenes/creation.tsx: part 1's six, then part 2's five.

/** Visit 1: the six days, ending with the animals (people come next time). */
export const CREATION_STORY_1: StoryPage[] = [
  { scene: '🌑✨', bg: 'linear-gradient(#c9c3ff,#fff3c9)', text: 'In the very beginning, there was only God. On day one, God said, let there be light! And there was light. And God saw that it was good!' },
  { scene: '☁️🌊', bg: 'linear-gradient(#bfe6ff,#9fd8ff)', text: 'On day two, God made the big blue sky up high, and the splashy sea down low.' },
  { scene: '⛰️🌳🌷', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'On day three, God made dry land, with tall trees, soft grass, and pretty flowers. And God saw that it was good!' },
  { scene: '☀️🌙⭐', bg: 'linear-gradient(#ffe9a8,#c9c3ff)', text: 'On day four, God made the bright sun for the daytime, and the moon and twinkly stars for the night. And God saw that it was good!' },
  { scene: '🐟🐬🐦', bg: 'linear-gradient(#bfe6ff,#8fd3f5)', text: 'On day five, God filled the sea with fish, and the sky with birds. Splish, splash! Tweet, tweet! And God saw that it was good!' },
  { scene: '🦁🐘🦒', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'On day six, God made animals of every kind. And God saw that it was good!' },
]

/** Visit 2: God's special friends. It picks up on day six, just after the animals. */
export const CREATION_STORY_2: StoryPage[] = [
  { scene: '👫💛', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'On day six, after God made the animals, He made the first people, Adam and Eve! God loved them, and He made them to be His friends.' },
  { scene: '🌳🍎🏞️', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'God gave Adam and Eve a beautiful garden called Eden. It had a sparkly river and trees full of yummy fruit. God asked them to take good care of it.' },
  { scene: '🦓🐒🐻', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'God brought the animals to Adam, and Adam gave each one a name. Zebra! Monkey! Bear! What a fun job!' },
  { scene: '🌍💛✨', bg: 'linear-gradient(#ffe0f0,#bfe6ff)', text: 'God looked at everything He made, and it was very, very good! Then, on day seven, God rested, because all His work was done. God made it all, and God made you, too!' },
  { scene: '🧒💛', bg: 'linear-gradient(#fff3c9,#ffe0f0)', text: 'Yes, you! God made your eyes to see, your ears to hear, and your hands to clap. You are wonderfully made, and God loves you so much!' },
]

// World English Bible (public domain).
export const CREATION_VERSE = {
  ref: 'Genesis 1:1',
  chunks: ['In the beginning,', 'God created', 'the heavens and the earth.'],
}

export const CREATION_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'God Made Everything', pages: CREATION_STORY_1 },
  {
    kind: 'spot', title: 'Find the Animals', plural: 'animals', kit: CREATION_GAME,
    intro: 'God made so many animals! Eight of them are hiding in this garden. Can you find them all?',
    done: 'You found all eight! God made every one of them, and God saw that it was good!',
  },
  {
    kind: 'sort', title: 'Land, Sea, and Sky',
    intro: "God made animals for the land, the sea, and the sky! Let's help each animal find its home.",
    hint: 'Does it walk, swim, or fly?',
    // Ground with plants for the land (a tree would invite the birds), waves for the sea, a cloud for the sky.
    groups: [
      { id: 'land', emoji: '🌳', say: 'the land', art: 'plants' },
      { id: 'sea', emoji: '🌊', say: 'the sea', art: 'sea' },
      { id: 'sky', emoji: '☁️', say: 'the sky', art: 'cloud' },
    ],
    items: [
      { emoji: '🐘', say: 'the elephant', group: 'land' },
      { emoji: '🐰', say: 'the bunny', group: 'land' },
      { emoji: '🦒', say: 'the giraffe', group: 'land' },
      { emoji: '🐙', say: 'the octopus', group: 'sea' },
      { emoji: '🐬', say: 'the dolphin', group: 'sea' },
      { emoji: '🐠', say: 'the fish', group: 'sea' },
      { emoji: '🦅', say: 'the eagle', group: 'sky' },
      { emoji: '🕊️', say: 'the dove', group: 'sky' },
    ],
  },
  { kind: 'pause', line: "God had one more very special thing to make. What could it be? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: "God's Special Friends", pages: CREATION_STORY_2, first: CREATION_STORY_1.length },
  // (Adam named the animals: word games, most of them with animal pictures. The intro fits every level.)
  { kind: 'practice', skill: 'reading', title: 'Name Game', decor: '🦓', intro: "Adam gave every animal a name! Now let's play some word games." },
  { kind: 'practice', skill: 'numbers', title: 'Twinkle Star Numbers', decor: '🌙', theme: '⭐', intro: "God made so many twinkly stars! Let's count them together." },
  { kind: 'verse', chunks: CREATION_VERSE.chunks, ref: CREATION_VERSE.ref },
  { kind: 'pause', line: "Someone up in the night sky needs a friend. Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Seven Days',
    intro: 'God made the world one day at a time! Put the pictures from the story in order, from day one to day seven.',
    // The story's own pictures, so each day shows everything the narrator names (pages count across both parts).
    items: [
      { emoji: '✨', say: 'Day one, light', art: 'story:creation:1' },
      { emoji: '🌊', say: 'Day two, the sky and the sea', art: 'story:creation:2' },
      { emoji: '🌳', say: 'Day three, land and plants', art: 'story:creation:3' },
      { emoji: '☀️', say: 'Day four, the sun, the moon, and the stars', art: 'story:creation:4' },
      { emoji: '🐟', say: 'Day five, fish and birds', art: 'story:creation:5' },
      { emoji: '🦁', say: 'Day six, animals and people', art: 'story:creation:7' },
      { emoji: '🌍', say: 'Day seven, God rested from His work', art: 'story:creation:10' },
    ],
  },
  { kind: 'battle', foe: 'gloomy', intro: 'Oh no! A grumpy night cloud named Gloomy is feeling left out in the dark! Gloomy just needs a friend.' },
  { kind: 'song', song: 'song-creation', intro: "Let's sing about everything God made! You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'sunny', sticker: '☀️', stickerName: 'sun' },
]
