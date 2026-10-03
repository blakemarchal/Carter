import type { Step, StoryPage } from './islands'
import { JONAH_GAME } from '../art/games/jonah'

// Jonah and the Big Fish, in three visits (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// The pictures for both parts are one list (art/scenes/jonah.tsx), so pages are counted across both:
// part one is pages 1 to 5, part two pages 6 to 11 (story cards: 'story:jonah:<page>').

/** Part one: Jonah runs away, and a big fish swallows him up. */
export const JONAH_STORY_1: StoryPage[] = [
  { scene: '🧔🏽🏙️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'God said to Jonah, go to the big city of Nineveh. Tell the people to stop doing wrong things and come back to Me.' },
  { scene: '🧔🏽⛵🌊', bg: 'linear-gradient(#bfe6ff,#9fd8ff)', text: 'But Jonah did not want to go! He ran the other way and got on a boat, sailing far, far away.' },
  { scene: '⛵💤', bg: 'linear-gradient(#c9b8e8,#9fd8ff)', text: 'Jonah went down inside the boat. He lay down and fell fast asleep.' },
  { scene: '⛵🌊💦', bg: 'linear-gradient(#a9b8cf,#7cc6ff)', text: 'God sent a big wind, and the boat rocked up and down. Jonah told the sailors, this storm is my fault. Put me into the sea. So they did. Splash! And the sea was calm again.' },
  { scene: '🐋💦', bg: 'linear-gradient(#7cc6ff,#5fb7ff)', text: 'But God sent a great big fish. Gulp! The fish swallowed Jonah up, and God kept him safe inside.' },
]

/** Part two: Jonah prays, and God gives him (and the people of Nineveh, and us) a second chance. */
export const JONAH_STORY_2: StoryPage[] = [
  { scene: '🐋🧔🏽', bg: 'linear-gradient(#5fb7ff,#2f78c4)', text: 'Remember Jonah? He ran away from God, and a big fish swallowed him up! But God was still with Jonah, even inside the fish.' },
  { scene: '🐋🙏', bg: 'linear-gradient(#9fd8ff,#c9c3ff)', text: 'Jonah was inside the fish for three days and three nights. He prayed to God and said, thank You for saving me!' },
  { scene: '🐋🏖️', bg: 'linear-gradient(#9fd8ff,#ffe9b5)', text: 'Then God told the fish to spit Jonah out onto the dry land. Bleh! Jonah was back on the beach.' },
  { scene: '🧔🏽✨🏙️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'God said to Jonah again, go to Nineveh and tell the people what I say. And Jonah said, yes, God! I will go.' },
  { scene: '🏙️💛🙌', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'God gave Jonah a second chance, and this time he went to Nineveh. The people listened, said sorry to God, and stopped doing wrong things. God forgave them, because God loves everyone!' },
  { scene: '🧒💛🙌', bg: 'linear-gradient(#fff1c2,#ffd6ee)', text: 'And God gives second chances to you and me, too! When we say sorry, He forgives us. God loves us so much!' },
]

// World English Bible (public domain).
export const JONAH_VERSE = {
  ref: '1 John 4:8',
  chunks: ['God', 'is', 'love.'],
}

export const JONAH_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Jonah and the Big Fish', pages: JONAH_STORY_1 },
  {
    kind: 'steer', title: 'Swim with the Big Fish',
    intro: 'Jonah is safe inside the big fish! Drag the fish all the way to the sunny beach, and pick up the shiny pearls on the way.',
    done: 'Hooray! The big fish swam all the way to the beach. Six shiny pearls!',
    kit: JONAH_GAME,
  },
  { kind: 'practice', skill: 'numbers', title: 'Fishy Numbers', decor: '🌊', theme: '🐟', intro: "Blub, blub! The little fish want to play a number game with you. Let's go!" },
  { kind: 'pause', line: "Jonah was inside the big fish for three days and three nights! What will he do? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: 'A Second Chance', pages: JONAH_STORY_2, first: JONAH_STORY_1.length },
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
        say: 'Where did the big fish take Jonah?',
        choices: [{ emoji: '🌙', say: 'To the moon' }, { emoji: '🏖️', say: 'To the beach' }, { emoji: '🌳', say: 'Up a tree' }],
        answer: 1,
      },
      {
        // Both choices are pictures from the story: Jonah on his own (page 1), and Jonah with all the people of Nineveh (page 10).
        say: 'Does God love just Jonah, or everyone?',
        choices: [{ emoji: '🧔', say: 'Just Jonah', art: 'story:jonah:1' }, { emoji: '👨‍👩‍👧‍👦', say: 'Everyone', art: 'story:jonah:10' }],
        answer: 1,
      },
    ],
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Big City Words', decor: '📜', intro: "Jonah told the people of Nineveh what God said. Now let's play some word games!" },
  { kind: 'verse', chunks: JONAH_VERSE.chunks, ref: JONAH_VERSE.ref },
  { kind: 'pause', line: "Splash! Somebody grumpy is splashing on the beach. Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell Jonah's story? Put the pictures in order, from the first one to the last!",
    items: [
      { emoji: '🏙️', say: 'God asking Jonah to go to Nineveh', art: 'story:jonah:1' },
      { emoji: '⛵', say: 'Jonah sailing away on a boat', art: 'story:jonah:2' },
      { emoji: '🌊', say: 'the big storm', art: 'story:jonah:4' },
      { emoji: '🐋', say: 'the big fish swallowing Jonah', art: 'story:jonah:5' },
      { emoji: '🏖️', say: 'Jonah back on the beach', art: 'story:jonah:8' },
      { emoji: '💛', say: 'the people of Nineveh saying sorry to God', art: 'story:jonah:10' },
    ],
  },
  { kind: 'battle', foe: 'wavey', intro: 'Oh no! A grumpy wave named Wavey is splashing everybody on the beach! Wavey just needs a friend.' },
  { kind: 'song', song: 'song-jonah', intro: "Let's sing about Jonah and the big fish! You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'bubbles', sticker: '🐋', stickerName: 'big fish' },
]
