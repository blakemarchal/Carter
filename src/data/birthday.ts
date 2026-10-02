import type { Step, StoryPage } from './islands'

// The birthday bonus island opens on Carter's 5th birthday (January 8).
export const BIRTHDAY_STORY: StoryPage[] = [
  { scene: '👶🎀💗', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'Five years ago, on January eighth, a special baby girl was born. Her name was Carter!' },
  { scene: '✨👧💗', bg: 'linear-gradient(#ffd6ec,#e6d9ff)', text: 'God made Carter. He made her bright eyes, her happy giggles, and her smart brain. God made her wonderfully!' },
  { scene: '✨🌍💗', bg: 'linear-gradient(#e6d9ff,#bfe6ff)', text: 'God knows Carter, inside and out. He knows when she sits down and when she gets up. And God loves her so much, all the time, no matter what!' },
  { scene: '👩👨👧👶', bg: 'linear-gradient(#fff3c9,#ffe0f0)', text: "Carter's family thanks God for her every day! Mom and Dad love her so much. And her baby brother Luke gives her big, giggly hugs!" },
  { scene: '🎈🎂🎁', bg: 'linear-gradient(#ffe0f0,#fff0b3)', text: "And now, Carter is five years old! Hooray! It's party time!" },
  { scene: '🎉🧁🎈', bg: 'linear-gradient(#e6ffe9,#ffe0f0)', text: "All of Carter's Ark Pals came to the party! They brought balloons, presents, and yummy cupcakes." },
  { scene: '💗✨🎂', bg: 'linear-gradient(#ffd6ec,#fff3c9)', text: 'Happy birthday, Carter! God made you, God knows you, and God will love you forever and ever.' },
]

// World English Bible (public domain).
export const BIRTHDAY_VERSE = {
  ref: 'Psalm 139:14',
  chunks: ['I will give thanks to you,', 'for I am fearfully', 'and wonderfully made.'],
}

export const BIRTHDAY_STEPS: Step[] = [
  // No "!" in the title: StoryBook reads it as "<title>. <first page>".
  { kind: 'story', title: 'Happy Birthday, Carter', pages: BIRTHDAY_STORY },
  { kind: 'trace', title: 'C is for Carter', intro: 'Carter starts with the letter C! Trace the big C with your finger.', letters: ['C', 'c'] },
  {
    kind: 'count', title: 'Party Cupcakes',
    intro: "Carter is turning five! Let's pack yummy cupcakes for the party.",
    item: { emoji: '🧁', say: 'cupcake' }, plural: 'cupcakes', basket: '🧺', rounds: [5, 10],
  },
  {
    kind: 'quiz', title: 'Birthday Questions',
    questions: [
      {
        say: 'Who made Carter so wonderfully?',
        choices: [{ emoji: '🤖', say: 'A robot' }, { emoji: '🐸', say: 'A frog' }, { emoji: '✨', say: 'God' }],
        answer: 2,
      },
      {
        say: 'How old is Carter today?',
        choices: [{ emoji: '4️⃣', say: 'Four' }, { emoji: '5️⃣', say: 'Five' }, { emoji: '6️⃣', say: 'Six' }],
        answer: 1,
      },
      {
        say: "Who is Carter's baby brother?",
        choices: [{ emoji: '👶', say: 'Baby Luke' }, { emoji: '🐶', say: 'A puppy' }],
        answer: 0,
      },
      {
        say: 'How much does God love Carter?',
        choices: [{ emoji: '🤏', say: 'Just a tiny bit' }, { emoji: '💗', say: 'So much, forever and ever' }],
        answer: 1,
      },
    ],
  },
  {
    kind: 'sequence', title: 'Party Countdown',
    intro: "Let's count down to the party, from five all the way to one! Then it's party time!",
    items: [
      { emoji: '5️⃣', say: 'Five' },
      { emoji: '4️⃣', say: 'Four' },
      { emoji: '3️⃣', say: 'Three' },
      { emoji: '2️⃣', say: 'Two' },
      { emoji: '1️⃣', say: 'One' },
      { emoji: '🎉', say: 'Party time' },
    ],
  },
  { kind: 'verse', chunks: BIRTHDAY_VERSE.chunks, ref: BIRTHDAY_VERSE.ref },
  { kind: 'battle', foe: 'pouty', intro: 'Oh no! A grumpy balloon named Pouty is floating away all alone! Pouty thinks everybody forgot about Pouty. Pouty just needs a friend.' },
  { kind: 'reward', pal: 'sprinkles', sticker: '🎂', stickerName: 'birthday cake' },
]
