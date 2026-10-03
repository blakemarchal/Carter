import type { Step, StoryPage } from './islands'

export const JONAH_STORY: StoryPage[] = [
  { scene: '🧔🏽🏙️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'God said to Jonah, go to the big city of Nineveh. Tell the people to stop doing wrong things and come back to Me.' },
  { scene: '🧔🏽⛵🌊', bg: 'linear-gradient(#bfe6ff,#9fd8ff)', text: 'But Jonah did not want to go! He ran the other way and got on a boat, sailing far, far away.' },
  { scene: '⛵🌊💦', bg: 'linear-gradient(#a9b8cf,#7cc6ff)', text: 'God sent a big wind, and the boat rocked up and down. Jonah told the sailors, this storm is my fault. Put me into the sea. So they did. Splash! And the sea was calm again.' },
  { scene: '🐋💦', bg: 'linear-gradient(#7cc6ff,#5fb7ff)', text: 'But God sent a great big fish. Gulp! The fish swallowed Jonah up, and God kept him safe inside.' },
  { scene: '🐋🙏', bg: 'linear-gradient(#9fd8ff,#c9c3ff)', text: 'Jonah was inside the fish for three days and three nights. He prayed to God and said, thank You for saving me!' },
  { scene: '🐋🏖️', bg: 'linear-gradient(#9fd8ff,#ffe9b5)', text: 'Then God told the fish to spit Jonah out onto the dry land. Bleh! Jonah was back on the beach.' },
  { scene: '🏙️💛🙌', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'God gave Jonah a second chance, and this time he went to Nineveh. The people listened, said sorry to God, and stopped doing wrong things. God forgave them, because God loves everyone!' },
]

// World English Bible (public domain).
export const JONAH_VERSE = {
  ref: '1 John 4:8',
  chunks: ['God', 'is', 'love.'],
}

export const JONAH_STEPS: Step[] = [
  { kind: 'story', title: 'Jonah and the Big Fish', pages: JONAH_STORY },
  {
    kind: 'maze', title: 'Swim to the Beach',
    intro: 'Help the big fish swim to the beach, so Jonah can get out on dry land!',
    hero: { emoji: '🐋', say: 'the big fish' }, goal: { emoji: '🏖️', say: 'the beach' },
    trail: '💧', theme: 'water',
  },
  {
    kind: 'quiz', title: 'Jonah Questions',
    questions: [
      {
        say: 'What did God send to keep Jonah safe in the sea?',
        choices: [{ emoji: '🦒', say: 'A giraffe' }, { emoji: '🐋', say: 'A big fish' }, { emoji: '🐝', say: 'A bee' }],
        answer: 1,
      },
      {
        say: 'How did Jonah try to run away?',
        choices: [{ emoji: '⛵', say: 'On a boat' }, { emoji: '🚲', say: 'On a bike' }, { emoji: '🚀', say: 'On a rocket' }],
        answer: 0,
      },
      {
        say: 'What did Jonah do inside the big fish?',
        choices: [{ emoji: '⚽', say: 'He played ball' }, { emoji: '🎨', say: 'He painted a picture' }, { emoji: '🙏', say: 'He prayed to God' }],
        answer: 2,
      },
      {
        // Both choices are pictures from the story: Jonah on his own (page 1), and Jonah with all the people of Nineveh (page 7).
        say: 'Does God love just Jonah, or everyone?',
        choices: [{ emoji: '🧔', say: 'Just Jonah', art: 'story:jonah:1' }, { emoji: '👨‍👩‍👧‍👦', say: 'Everyone', art: 'story:jonah:7' }],
        answer: 1,
      },
    ],
  },
  { kind: 'practice', skill: 'numbers', title: 'Fishy Numbers', decor: '🌊', theme: '🐟', intro: "Blub, blub! The little fish want to play a number game with you. Let's go!" },
  { kind: 'verse', chunks: JONAH_VERSE.chunks, ref: JONAH_VERSE.ref },
  { kind: 'battle', foe: 'wavey', intro: 'Oh no! A grumpy wave named Wavey is splashing everybody on the beach! Wavey just needs a friend.' },
  { kind: 'reward', pal: 'bubbles', sticker: '🐋', stickerName: 'big fish' },
]
