import type { Step, StoryPage } from './islands'

export const CREATION_STORY: StoryPage[] = [
  { scene: '🌑✨', bg: 'linear-gradient(#c9c3ff,#fff3c9)', text: 'In the very beginning, there was only God. Then God said, let there be light! And there was light.' },
  { scene: '☁️🌊', bg: 'linear-gradient(#bfe6ff,#9fd8ff)', text: 'Next, God made the big blue sky up high, and the splashy sea down low.' },
  { scene: '⛰️🌳🌷', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'Then God made dry land, with tall trees, soft grass, and pretty flowers. God said, it is good!' },
  { scene: '☀️🌙⭐', bg: 'linear-gradient(#ffe9a8,#c9c3ff)', text: 'God made the bright sun for the daytime. He made the moon and twinkly stars for the night. The night is good, too!' },
  { scene: '🐟🐬🐦', bg: 'linear-gradient(#bfe6ff,#8fd3f5)', text: 'God filled the sea with fish, and the sky with birds. Splish, splash! Tweet, tweet!' },
  { scene: '🦁🐘🐰👫', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'Then God made animals of every kind. And God made people, to be His friends and to know His love.' },
  { scene: '🌍💛✨', bg: 'linear-gradient(#ffe0f0,#bfe6ff)', text: 'God looked at everything He made, and it was very, very good! Then God rested. God made it all, and God made you, too!' },
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
    intro: 'God made the world one day at a time! Tap the pictures in order, from day one to day seven.',
    items: [
      { emoji: '✨', say: 'Day one, light' },
      { emoji: '🌊', say: 'Day two, the sky and the sea' },
      { emoji: '🌳', say: 'Day three, land and plants' },
      { emoji: '☀️', say: 'Day four, the sun, the moon, and the stars' },
      { emoji: '🐟', say: 'Day five, fish and birds' },
      { emoji: '🦁', say: 'Day six, animals and people' },
      { emoji: '💤', say: 'Day seven, God rested' },
    ],
  },
  {
    kind: 'sort', title: 'Land, Sea, and Sky',
    intro: "God made animals for the land, the sea, and the sky! Let's help each animal find its home.",
    groups: [
      { id: 'land', emoji: '🌳', say: 'the land' },
      { id: 'sea', emoji: '🌊', say: 'the sea' },
      { id: 'sky', emoji: '☁️', say: 'the sky' },
    ],
    items: [
      { emoji: '🐘', say: 'the elephant', group: 'land' },
      { emoji: '🐰', say: 'the bunny', group: 'land' },
      { emoji: '🦒', say: 'the giraffe', group: 'land' },
      { emoji: '🐙', say: 'the octopus', group: 'sea' },
      { emoji: '🐬', say: 'the dolphin', group: 'sea' },
      { emoji: '🐠', say: 'the fish', group: 'sea' },
      { emoji: '🦅', say: 'the eagle', group: 'sky' },
      { emoji: '🦋', say: 'the butterfly', group: 'sky' },
    ],
  },
  { kind: 'practice', skill: 'numbers', title: 'Twinkle Star Numbers', decor: '🌙', theme: '⭐', intro: "God made so many twinkly stars! Let's count them together." },
  { kind: 'verse', chunks: CREATION_VERSE.chunks, ref: CREATION_VERSE.ref },
  { kind: 'battle', foe: 'gloomy', intro: 'Oh no! A grumpy night cloud named Gloomy is feeling left out in the dark! Gloomy just needs a friend.' },
  { kind: 'reward', pal: 'sunny', sticker: '☀️', stickerName: 'sun' },
]
