import type { Step, StoryPage } from './islands'
import { STORM_PAINT } from '../art/games/storm'

// Jesus Calms the Storm (Mark 4:35–41, with Mark 4:1). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace
// first, numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Jesus is with us when we're scared, and even the wind and the waves obey Him. The storm is exciting, never
// frightening: big waves and a whooshing wind, nobody falls in, and the friends are worried, never terrified. Part one
// ends calmly, with dark clouds just rolling over the hills; the calm after the storm is the beautiful payoff.
// (The words only ever mean the wind that blows; listen to "wind" on the review page.)
// The pictures are in art/scenes/storm.tsx, the paint game's in art/games/storm.tsx.

/** Visit 1: Jesus teaches by the lake, they sail off in the evening, and He falls asleep. Then the clouds come. */
export const STORM_STORY_1: StoryPage[] = [
  { scene: '👥⛵☀️', bg: 'linear-gradient(#bfe6ff,#fff2d2)', text: "One day, lots of people came to the big lake to hear Jesus. He sat in a boat near the shore, and He taught them all about God's love." },
  { scene: '🌅⛵👉', bg: 'linear-gradient(#86a8e8,#ffdc9a)', text: 'When evening came, Jesus said to His friends, "Let\'s go over to the other side of the lake." So they got the boat ready to go.' },
  { scene: '⛵⛵⛵🌅', bg: 'linear-gradient(#6d6cc4,#ffd27e)', text: 'Off they sailed across the lake! The wind filled up the sail, and the boat went swish, swish over the water. Other little boats sailed along with them.' },
  { scene: '😴⛵💤', bg: 'linear-gradient(#3c3e84,#f2ad96)', text: 'Jesus was very tired after His long day. He lay down at the back of the boat, put His head on a cushion, and fell fast asleep.' },
  { scene: '☁️🌬️⛵', bg: 'linear-gradient(#394069,#c99a96)', text: 'The boat sailed on and on. Then dark clouds rolled over the hills, and the wind began to blow. Whoosh! But Jesus was still fast asleep.' },
]

/** Visit 2: the storm, Jesus calms it, and they sail safely to the other side. Its pictures follow part one's. */
export const STORM_STORY_2: StoryPage[] = [
  { scene: '🌊⛵💦', bg: 'linear-gradient(#283350,#5f7096)', text: 'Remember the dark clouds? Soon a big storm came! The wind blew and blew, and big waves splashed into the boat. The boat began to fill up with water. But Jesus was still asleep!' },
  { scene: '😟⛵🌊', bg: 'linear-gradient(#283350,#5f7096)', text: 'The friends were scared. They woke Jesus up and said, "Teacher, don\'t You care? We\'re sinking!"' },
  { scene: '🙌🌊✨', bg: 'linear-gradient(#283350,#b493cf)', text: 'Jesus stood up. He said to the wind and the waves, "Peace! Be still!"' },
  { scene: '🌙⛵⭐', bg: 'linear-gradient(#25296a,#eea3b6)', text: 'Right away, the wind stopped, and the waves went still. Everything was calm and quiet. The first little stars came out to twinkle.' },
  { scene: '😮⛵⭐', bg: 'linear-gradient(#25296a,#eea3b6)', text: 'Jesus asked them gently, "Why were you so afraid? Do you still not trust Me?" His friends were amazed. "Who is this? Even the wind and the waves obey Him!"' },
  { scene: '🏖️🙌🌙', bg: 'linear-gradient(#161a4a,#4a4292)', text: "They all sailed safely to the other side. Who is Jesus? He is God's own Son! When we are scared, Jesus is with us, and He takes care of us." },
]

// World English Bible (public domain), word for word: Psalm 107:29.
export const STORM_VERSE = {
  ref: 'Psalm 107:29',
  chunks: ['He makes the storm a calm,', 'so that its waves', 'are still.'],
}

export const STORM_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'A Boat Ride with Jesus', pages: STORM_STORY_1 },
  {
    kind: 'paint', title: 'Paint the Boat', kit: STORM_PAINT,
    // (The two taps in the order they're made: a paint pot, then the parts with its number.)
    intro: "Before the clouds came, the sun was going down over the lake. Let's paint the boat Jesus and His friends are sailing in! Tap a paint pot, then tap the parts with the same number.",
    done: 'What a beautiful picture! The little boat sailed on across the lake, and Jesus was with His friends all the way.',
  },
  // (The intro fits every level: counting, what comes next, adding.)
  { kind: 'practice', skill: 'numbers', title: 'Little Boat Numbers', decor: '⛵', theme: '⛵', intro: "Other little boats sailed across the lake, too. Let's play number games with the boats!" },
  { kind: 'pause', line: "Dark clouds are rolling in, and Jesus is still fast asleep! What will happen? Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'Jesus Calms the Storm', pages: STORM_STORY_2, first: STORM_STORY_1.length },
  {
    kind: 'quiz', title: 'Storm Questions',
    questions: [
      {
        say: 'Where did Jesus sleep in the boat?',
        choices: [{ emoji: '💤', say: 'On a cushion at the back of the boat', art: 'story:storm:4' }, { emoji: '🛏️', say: 'In a big bed' }, { emoji: '🌳', say: 'Up in a tree' }],
        answer: 0,
      },
      {
        say: 'Who woke Jesus up?',
        choices: [{ emoji: '🐔', say: 'A noisy hen' }, { emoji: '🐋', say: 'A big fish' }, { emoji: '😟', say: 'His friends in the boat', art: 'story:storm:7' }],
        answer: 2,
      },
      {
        say: 'Jesus told the wind and the waves to be still. What happened then?',
        choices: [{ emoji: '🎈', say: 'Balloons flew up in the sky' }, { emoji: '🌙', say: 'Everything was calm and quiet', art: 'story:storm:9' }, { emoji: '🌈', say: 'A big rainbow came out' }],
        answer: 1,
      },
      {
        say: 'When we are scared, who is with us?',
        choices: [{ emoji: '✨', say: 'Jesus', art: 'jesus-grown' }, { emoji: '🐧', say: 'A penguin' }, { emoji: '🐸', say: 'A frog' }],
        answer: 0,
      },
    ],
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Calm Lake Words', decor: '⭐', intro: "The lake is calm and quiet now. Let's play word games under the twinkly stars!" },
  { kind: 'verse', chunks: STORM_VERSE.chunks, ref: STORM_VERSE.ref },
  { kind: 'pause', line: "Shh, listen. Someone is squawking and flapping down by the water. Who could it be? Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of Jesus and the storm? Put the pictures in order, from the first one to the last one.',
    // The story's own pictures (pages counted from 1 across both parts), one from each place in the story.
    items: [
      { emoji: '👥', say: 'Jesus teaching by the lake', art: 'story:storm:1' },
      { emoji: '⛵', say: 'the boat sailing off', art: 'story:storm:3' },
      { emoji: '💤', say: 'Jesus asleep on a cushion', art: 'story:storm:4' },
      { emoji: '🌊', say: 'the big storm', art: 'story:storm:6' },
      { emoji: '✨', say: 'Jesus telling the storm to be still', art: 'story:storm:8' },
      { emoji: '🌙', say: 'the calm lake under the stars', art: 'story:storm:9' },
    ],
  },
  { kind: 'battle', foe: 'squawk', intro: 'Oh no! A grumpy seagull named Squawk is flapping and squawking in the wind! Squawk just needs a friend.' },
  { kind: 'song', song: 'song-storm', intro: "Jesus said, peace, be still, and the wind and the waves obeyed Him! Let's sing about it. You can sing it on your Ark any time, too." },
  // (The reward says "You also earned a fishing boat sticker!": the drawing is the friends' own boat on the calm lake.)
  { kind: 'reward', pal: 'glint', sticker: 'calm-boat', stickerName: 'fishing boat' },
]
