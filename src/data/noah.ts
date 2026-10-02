export interface StoryPage {
  scene: string // emoji scene for the prototype; replaced by illustrations later
  bg: string
  text: string
}

export const NOAH_STORY: StoryPage[] = [
  { scene: '👴🏽🙏', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago there was a man named Noah. Noah loved God, and God loved Noah.' },
  { scene: '🔨🪵🚢', bg: 'linear-gradient(#bfe6ff,#e9d3b5)', text: 'God told Noah, build a great big boat called an ark! Noah listened and obeyed. Bang, bang, bang!' },
  { scene: '🦁🦁 🐘🐘 🦒🦒', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'Then the animals came, two by two! Lions and elephants and giraffes, too.' },
  { scene: '🌧️🚢🌊', bg: 'linear-gradient(#8fa3bf,#7cc6ff)', text: 'The rain fell and fell. But Noah, his family, and all the animals were safe inside the ark. God kept them safe.' },
  { scene: '🕊️🌿', bg: 'linear-gradient(#bfe6ff,#e6ffe9)', text: 'When the rain stopped, Noah sent out a little dove. The dove came back with an olive leaf! There was dry land again.' },
  { scene: '🌈🚢🙌', bg: 'linear-gradient(#ffe0f0,#bfe6ff)', text: 'God put a beautiful rainbow in the sky. It was His promise: God always keeps His promises!' },
]

export const NOAH_PAIRS = ['🦁', '🐘', '🦒', '🐧', '🦓', '🐒']

export const NOAH_VERSE = {
  ref: 'Genesis 9:13',
  chunks: ['I have put', 'my rainbow', 'in the clouds.'],
}
