import type { Step, StoryPage } from './islands'

export const NOAH_STORY: StoryPage[] = [
  { scene: '👴🏽🙏', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago there was a man named Noah. Noah loved God, and God loved Noah.' },
  { scene: '🔨🪵🚢', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: 'God told Noah, build a great big boat called an ark! Noah trusted God, so he listened and obeyed. Bang, bang, bang!' },
  { scene: '🦁🦁 🐘🐘 🦒🦒', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'Then the animals came, two by two! Lions and elephants and giraffes, too.' },
  { scene: '🌧️🚢🌊', bg: 'linear-gradient(#8fa3bf,#7cc6ff)', text: 'The rain fell and fell. But Noah, his family, and all the animals were safe inside the ark. God kept them safe.' },
  { scene: '🕊️🌿', bg: 'linear-gradient(#bfe6ff,#e6ffe9)', text: 'When the rain stopped, Noah sent out a little dove. The dove came back with an olive leaf! There was dry land again.' },
  { scene: '🌈🚢🙌', bg: 'linear-gradient(#ffe0f0,#bfe6ff)', text: 'God put a beautiful rainbow in the sky. It was His promise: God always keeps His promises!' },
]

export const NOAH_PAIRS = ['🦁', '🐘', '🦒', '🐧', '🦓', '🐒']

// World English Bible (public domain). Kids learn the first part of the verse.
export const NOAH_VERSE = {
  ref: 'Genesis 9:13',
  chunks: ['I set', 'my rainbow', 'in the cloud.'],
}

export const NOAH_STEPS: Step[] = [
  { kind: 'story', title: 'Noah and the Big Boat', pages: NOAH_STORY },
  {
    kind: 'pairs', animals: NOAH_PAIRS,
    names: { '🦁': 'lions', '🐘': 'elephants', '🦒': 'giraffes', '🐧': 'penguins', '🦓': 'zebras', '🐒': 'monkeys' },
  },
  { kind: 'practice', skill: 'reading', title: 'Word Boat', decor: '⛵', intro: "Let's help the animals with their words! Read the word, then tap the picture." },
  { kind: 'practice', skill: 'numbers', title: 'Raindrop Numbers', decor: '🌧️', theme: '💧', intro: "Drip, drop! Let's count the raindrops!" },
  { kind: 'verse', chunks: NOAH_VERSE.chunks, ref: NOAH_VERSE.ref },
  { kind: 'battle', foe: 'rumble', intro: 'Oh no! A grumpy storm cloud named Rumble is blocking the rainbow! Rumble just needs a friend.' },
  { kind: 'reward', pal: 'pip', sticker: '🌈', stickerName: 'rainbow' },
]
