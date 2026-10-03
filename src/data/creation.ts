import type { Step, StoryPage } from './islands'

// Each page names its day (the "Seven Days" step asks for them in order), and "And God saw that it was
// good!" comes back as a refrain to say along, on the days Genesis says it (it isn't said on day two).
export const CREATION_STORY: StoryPage[] = [
  { scene: '🌑✨', bg: 'linear-gradient(#c9c3ff,#fff3c9)', text: 'In the very beginning, there was only God. On day one, God said, let there be light! And there was light. And God saw that it was good!' },
  { scene: '☁️🌊', bg: 'linear-gradient(#bfe6ff,#9fd8ff)', text: 'On day two, God made the big blue sky up high, and the splashy sea down low.' },
  { scene: '⛰️🌳🌷', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'On day three, God made dry land, with tall trees, soft grass, and pretty flowers. And God saw that it was good!' },
  { scene: '☀️🌙⭐', bg: 'linear-gradient(#ffe9a8,#c9c3ff)', text: 'On day four, God made the bright sun for the daytime, and the moon and twinkly stars for the night. And God saw that it was good!' },
  { scene: '🐟🐬🐦', bg: 'linear-gradient(#bfe6ff,#8fd3f5)', text: 'On day five, God filled the sea with fish, and the sky with birds. Splish, splash! Tweet, tweet! And God saw that it was good!' },
  { scene: '🦁🐘🐰👫', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'On day six, God made animals of every kind. And God saw that it was good! Then God made the first people, Adam and Eve. God loved them, and He made them to be His friends.' },
  { scene: '🌍💛✨', bg: 'linear-gradient(#ffe0f0,#bfe6ff)', text: 'God looked at everything He made, and it was very, very good! Then, on day seven, God rested, because all His work was done. God made it all, and God made you, too!' },
]

// World English Bible (public domain).
export const CREATION_VERSE = {
  ref: 'Genesis 1:1',
  chunks: ['In the beginning,', 'God created', 'the heavens and the earth.'],
}

export const CREATION_STEPS: Step[] = [
  { kind: 'story', title: 'God Made Everything', pages: CREATION_STORY },
  {
    kind: 'sequence', title: 'Seven Days',
    intro: 'God made the world one day at a time! Put the pictures from the story in order, from day one to day seven.',
    // The story's own pictures, so each day shows everything the narrator names.
    items: [
      { emoji: '✨', say: 'Day one, light', art: 'story:creation:1' },
      { emoji: '🌊', say: 'Day two, the sky and the sea', art: 'story:creation:2' },
      { emoji: '🌳', say: 'Day three, land and plants', art: 'story:creation:3' },
      { emoji: '☀️', say: 'Day four, the sun, the moon, and the stars', art: 'story:creation:4' },
      { emoji: '🐟', say: 'Day five, fish and birds', art: 'story:creation:5' },
      { emoji: '🦁', say: 'Day six, animals and people', art: 'story:creation:6' },
      { emoji: '🌍', say: 'Day seven, God rested from His work', art: 'story:creation:7' },
    ],
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
  { kind: 'practice', skill: 'numbers', title: 'Twinkle Star Numbers', decor: '🌙', theme: '⭐', intro: "God made so many twinkly stars! Let's count them together." },
  { kind: 'verse', chunks: CREATION_VERSE.chunks, ref: CREATION_VERSE.ref },
  { kind: 'battle', foe: 'gloomy', intro: 'Oh no! A grumpy night cloud named Gloomy is feeling left out in the dark! Gloomy just needs a friend.' },
  { kind: 'reward', pal: 'sunny', sticker: '☀️', stickerName: 'sun' },
]
