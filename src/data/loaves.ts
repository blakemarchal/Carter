import type { Step, StoryPage } from './islands'
import { LOAVES_SHARE } from '../art/games/loaves'

// Five Loaves and Two Fish (Matthew 14, Mark 6, Luke 9, John 6). See docs/ISLAND-GUIDE.md: short
// sentences for 4-year-olds, grace first, numbers in words, nothing spoken with emoji or symbols, and
// every page's picture shows what its words say (art/scenes/loaves.tsx, one array for both parts).
// Three visits (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.

/** Part 1: the crowd, Jesus teaching and healing, the hungry evening, the boy's lunch, and Jesus giving thanks (pictures 1–6). */
export const LOAVES_STORY_1: StoryPage[] = [
  { scene: '⛰️👥👥', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'One day, a great big crowd came to see Jesus on a grassy hill. There were thousands and thousands of people!' },
  { scene: '💛🙌', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Jesus told everyone how much God loves them. He made sick people well, too! All day long, He took care of them.' },
  { scene: '🌅🍽️', bg: 'linear-gradient(#ffd9a8,#ffe9c9)', text: 'It got late, and everyone was hungry. Grumble, grumble went their tummies! But where could they find food for so many people?' },
  { scene: '👦🏽🍞🐟', bg: 'linear-gradient(#fff3c9,#ffe0b5)', text: 'Then a boy came with his lunch. He had five little loaves of bread and two little fish.' },
  { scene: '👦🏽🧺💛', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'The boy shared his lunch with Jesus. It was only a little bit of food. But Jesus knew just what to do!' },
  { scene: '🙏🍞🐟', bg: 'linear-gradient(#fff6d9,#ffe9a8)', text: 'Jesus held up the bread and fish and thanked God for the food. Then He passed it out to everyone.' },
]

/** Part 2: more than enough, twelve baskets, the boy's happy news, and the bread of life (pictures 7–11). */
export const LOAVES_STORY_2: StoryPage[] = [
  { scene: '🍞🧺✨', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: "Remember the boy's little lunch? Jesus broke the bread, and His friends passed it out. More, and more, and more! The food never ran out." },
  { scene: '😋🍞🐟', bg: 'linear-gradient(#c9f2d0,#fff3c9)', text: 'Everyone ate and ate, until their tummies were full! There was plenty for everybody.' },
  { scene: '🧺🧺🧺', bg: 'linear-gradient(#ffe0f0,#ffe9a8)', text: 'There were even twelve baskets of leftovers! Jesus took one little lunch and made more than enough. Jesus cares for us and gives us what we need.' },
  { scene: '🏠👦🏽', bg: 'linear-gradient(#c9b8ff,#ffd9c9)', text: 'Then the boy ran all the way home. "Mom! Dad! Jesus fed everybody with my little lunch!" What a happy day!' },
  { scene: '🍞💛', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'The next day, Jesus said, "I am the bread of life." Bread fills our tummies, but Jesus fills our hearts! He takes care of us every single day.' },
]

// (Story cards, `story:loaves:<n>`, count the pages from 1 through both parts: part 2 starts at page 7.)

// World English Bible (public domain): from the Lord's Prayer. Jesus gives us what we need, so we ask Him.
export const LOAVES_VERSE = {
  ref: 'Matthew 6:11',
  chunks: ['Give us', 'today', 'our daily bread.'],
}

export const LOAVES_STEPS: Step[] = [
  // ----- Visit 1: the story -----
  { kind: 'story', title: 'Five Loaves and Two Fish', pages: LOAVES_STORY_1 },
  {
    kind: 'share', title: 'Share the Bread',
    intro: "Jesus' friends passed out the bread to everyone. Let's help them!",
    // (Not "there was plenty for everybody" yet: whether there will be enough is this visit's cliffhanger.)
    done: "Thank you for helping Jesus' friends pass out the bread!",
    kit: LOAVES_SHARE,
  },
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
  { kind: 'pause', line: "Would there be enough food for everyone? Let's find out next time!" },

  // ----- Visit 2: the adventure -----
  { kind: 'story', title: 'More Than Enough', pages: LOAVES_STORY_2, first: LOAVES_STORY_1.length },
  { kind: 'practice', skill: 'reading', title: 'Picnic Words', decor: '🍞', intro: "Let's have a word picnic! Listen, then tap the right one." },
  {
    kind: 'quiz', title: 'Picnic Questions',
    questions: [
      {
        say: "What was in the boy's lunch?",
        // (The boy's own lunch, five loaves and two fish: the next question asks how many fish.)
        choices: [{ emoji: '🍕', say: 'Pizza' }, { emoji: '🧺', say: 'Bread and fish', art: 'boys-lunch' }, { emoji: '🍦', say: 'Ice cream' }],
        answer: 1,
      },
      {
        say: 'How many fish did the boy have?',
        choices: [{ emoji: '🐟', say: 'One fish' }, { emoji: '🐟🐟', say: 'Two fish' }, { emoji: '🐟🐟🐟', say: 'Three fish' }],
        answer: 1,
      },
      {
        say: 'What did Jesus do before He passed out the food?',
        choices: [{ emoji: '🎵', say: 'He sang a song' }, { emoji: '💤', say: 'He took a nap' }, { emoji: '🙏', say: 'He thanked God', art: 'story:loaves:6' }],
        answer: 2,
      },
      {
        say: 'After everyone ate, what was left over?',
        choices: [{ emoji: '🧺🧺🧺', say: 'Baskets full of food' }, { emoji: '🍽️', say: 'Nothing at all', art: 'plate' }],
        answer: 0,
      },
    ],
  },
  { kind: 'verse', chunks: LOAVES_VERSE.chunks, ref: LOAVES_VERSE.ref },
  { kind: 'pause', line: "Uh oh! Someone grumpy does not want to share. Who could it be? Let's find out next time!" },

  // ----- Visit 3: the rescue -----
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story? Put the pictures in order, from the first to the last.',
    // (Each line names a picture, as the narrator also says it in a sentence: "That's the boy with his lunch.")
    items: [
      { emoji: '👥', say: 'the crowd coming to see Jesus', art: 'story:loaves:1' },
      { emoji: '🧺', say: 'the boy with his lunch', art: 'story:loaves:4' },
      { emoji: '🙏', say: 'Jesus thanking God for the food', art: 'story:loaves:6' },
      { emoji: '🧺', say: 'twelve baskets of leftovers', art: 'story:loaves:9' },
      { emoji: '🏠', say: 'the boy running home to tell his family', art: 'story:loaves:10' },
    ],
  },
  { kind: 'battle', foe: 'crabby', intro: 'Oh no! A grumpy crab named Crabby is not sharing the picnic snacks! Crabby just needs a friend.' },
  { kind: 'song', song: 'song-loaves', intro: "Let's sing about five little loaves! You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'basket', sticker: '🧺', stickerName: 'picnic basket' },
]
