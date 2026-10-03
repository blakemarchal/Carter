import type { Step, StoryPage } from './islands'

export const LOAVES_STORY: StoryPage[] = [
  { scene: '⛰️👥👥', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'One day, a great big crowd came to see Jesus on a grassy hill. There were thousands and thousands of people!' },
  { scene: '🌅🍽️', bg: 'linear-gradient(#ffd9a8,#ffe9c9)', text: 'It got late, and everyone was hungry. Grumble, grumble went their tummies! But where could they find food for so many people?' },
  { scene: '👦🏽🍞🐟', bg: 'linear-gradient(#fff3c9,#ffe0b5)', text: 'Then a boy came with his lunch. He had five little loaves of bread and two little fish.' },
  { scene: '👦🏽🧺💛', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'The boy shared his lunch with Jesus. It was only a little bit of food. But Jesus knew just what to do!' },
  { scene: '🙏🍞🐟', bg: 'linear-gradient(#fff6d9,#ffe9a8)', text: 'Jesus held up the bread and fish and thanked God for the food. Then He passed it out to everyone.' },
  { scene: '😋🍞🐟', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'Everyone ate and ate, until their tummies were full! There was plenty for everybody.' },
  { scene: '🧺🧺🧺', bg: 'linear-gradient(#ffe0f0,#ffe9a8)', text: 'There were even twelve baskets of leftovers! Jesus took one little lunch and made more than enough. Jesus cares for us and gives us what we need.' },
]

// World English Bible (public domain): from the Lord's Prayer. Jesus gives us what we need, so we ask Him.
export const LOAVES_VERSE = {
  ref: 'Matthew 6:11',
  chunks: ['Give us', 'today', 'our daily bread.'],
}

export const LOAVES_STEPS: Step[] = [
  { kind: 'story', title: 'Five Loaves and Two Fish', pages: LOAVES_STORY },
  {
    kind: 'count', title: "The Boy's Lunch",
    intro: "Let's help the boy pack his lunch basket! First, the bread.",
    item: { emoji: '🍞', say: 'loaf of bread' }, plural: 'loaves of bread', basket: '🧺', basketArt: 'basket', rounds: [5],
  },
  {
    kind: 'count', title: 'Two Little Fish',
    intro: 'Now his two little fish!',
    item: { emoji: '🐟', say: 'fish' }, plural: 'fish', basket: '🧺', basketArt: 'basket', rounds: [2],
    done: "Five loaves and two fish. That's the boy's whole lunch!",
  },
  {
    kind: 'quiz', title: 'Picnic Questions',
    questions: [
      {
        say: "What was in the boy's lunch?",
        choices: [{ emoji: '🍕', say: 'Pizza' }, { emoji: '🧺', say: 'Bread and fish', art: 'basket-food' }, { emoji: '🍦', say: 'Ice cream' }],
        answer: 1,
      },
      {
        say: 'How many fish did the boy have?',
        choices: [{ emoji: '🐟', say: 'One fish' }, { emoji: '🐟🐟', say: 'Two fish' }, { emoji: '🐟🐟🐟', say: 'Three fish' }],
        answer: 1,
      },
      {
        say: 'What did Jesus do before He passed out the food?',
        choices: [{ emoji: '🎵', say: 'He sang a song' }, { emoji: '💤', say: 'He took a nap' }, { emoji: '🙏', say: 'He thanked God', art: 'story:loaves:5' }],
        answer: 2,
      },
      {
        say: 'After everyone ate, what was left over?',
        choices: [{ emoji: '🧺🧺🧺', say: 'Baskets full of food' }, { emoji: '🍽️', say: 'Nothing at all', art: 'plate' }],
        answer: 0,
      },
    ],
  },
  { kind: 'practice', skill: 'reading', title: 'Picnic Words', decor: '🍞', intro: "Let's have a word picnic! Listen, then tap the right one." },
  { kind: 'verse', chunks: LOAVES_VERSE.chunks, ref: LOAVES_VERSE.ref },
  { kind: 'battle', foe: 'crabby', intro: 'Oh no! A grumpy crab named Crabby is not sharing the picnic snacks! Crabby just needs a friend.' },
  { kind: 'reward', pal: 'basket', sticker: '🧺', stickerName: 'picnic basket' },
]
