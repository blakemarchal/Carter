import type { Step, StoryPage } from './islands'
import { ESTHER_PAINT } from '../art/games/esther'

// Queen Esther (the book of Esther). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers
// in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Courage, and God's care even when He seems quiet. Haman is proud and cross, never frightening; his mean plan is
// told in one gentle sentence, and what happened to him is left out. Esther is lovely, but what the story praises is
// her bravery and kindness. (The words always say "bow down", never "bow" alone: the voice reads "bow" as a ribbon.)
// The pictures are in art/scenes/esther.tsx, the paint game's in art/games/esther.tsx.

/** Visit 1: Mordecai raises Esther, she becomes queen, and proud Haman makes his plan. Will she help? */
export const ESTHER_STORY_1: StoryPage[] = [
  { scene: '👧🏽🧔🏽💛', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago, there was a girl named Esther. She had no mom or dad, so her big cousin Mordecai took care of her. He loved her like his very own daughter.' },
  { scene: '👑👸🏽✨', bg: 'linear-gradient(#fff3c9,#ffe0b5)', text: 'Esther grew up to be kind and lovely. King Xerxes chose Esther to be his queen! He put a royal crown on her head.' },
  { scene: '🧔🏽👂🤫', bg: 'linear-gradient(#bfe6ff,#ffe9c9)', text: "Mordecai worked at the king's gate. One day, he heard two men whispering a plan to hurt the king. He told Queen Esther, and she told the king. Good Mordecai saved the king!" },
  { scene: '😤🙇🧔🏽', bg: 'linear-gradient(#bfe6ff,#ffe9c9)', text: 'There was a proud man named Haman. He wanted everyone to bow down to him. Everybody did, but not Mordecai! Mordecai bowed down only to God.' },
  { scene: '😠📜😢', bg: 'linear-gradient(#bfe6ff,#ffe9c9)', text: "Haman was so cross that he made a mean plan against Mordecai and all of God's people. Mordecai was very sad. He sent a message to Queen Esther: \"Please ask the king to help us!\"" },
  { scene: '👸🏽📜😟', bg: 'linear-gradient(#ffb3a8,#ffe0c0)', text: 'Esther read the message, and she was afraid. No one could go to see the king unless he called them! But maybe God made Esther queen for a time just like this.' },
]

/** Visit 2: Esther prays, goes to the king, tells the truth at her dinner, and God's people are saved. Its pictures follow part one's. */
export const ESTHER_STORY_2: StoryPage[] = [
  { scene: '🙏👸🏽🌙', bg: 'linear-gradient(#18163f,#3b3486)', text: "Esther was afraid to go and see the king. So she asked God's people to pray for her. For three days, Esther and her friends prayed to God, too." },
  { scene: '👑✨👸🏽', bg: 'linear-gradient(#fff3c9,#ffe0b5)', text: "On the third day, brave Queen Esther went to see the king. Would he be cross? No! He held out his golden scepter. That meant, \"Come in!\"" },
  { scene: '🍇🍞🏮', bg: 'linear-gradient(#ffb3a8,#ffe0c0)', text: "The king asked, \"What would you like, Queen Esther?\" Esther said, \"Please come to my dinner, and bring Haman, too.\" What a yummy dinner! Then she asked them to come back for another one." },
  { scene: '👸🏽👉😮', bg: 'linear-gradient(#3b3486,#8f6fa8)', text: "At the next dinner, Esther told the king the truth. \"Haman made a mean plan against my people, God's people. Please save us!\"" },
  { scene: '📜🙌🎉', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: "The king listened to Queen Esther. He made a new rule to keep God's people safe, and he made good Mordecai his top helper. God's people were saved! Hooray!" },
  { scene: '🎉🍪🏮', bg: 'linear-gradient(#ffb3a8,#ffe0c0)', text: "God's people had a great big happy party, called Purim! They shared yummy food and gave presents. God took care of His people all along, and He takes care of you, too!" },
]

// World English Bible (public domain), word for word: the middle of Joshua 1:9, God's words to Joshua ("Haven't I
// commanded you? Be strong and courageous. Don't be afraid. Don't be dismayed, for Yahweh your God is with you wherever
// you go."). Esther was afraid, and she was brave (pages six to eight). (Psalm 56:3 is David's verse.)
export const ESTHER_VERSE = {
  ref: 'Joshua 1:9',
  chunks: ['Be strong', 'and courageous.', "Don't be afraid."],
}

export const ESTHER_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Esther Becomes Queen', pages: ESTHER_STORY_1 },
  {
    kind: 'paint', title: "Esther's Royal Robe", kit: ESTHER_PAINT,
    // (The two taps in the order they're made: a paint pot, then the parts with its number.)
    intro: "Queen Esther wore a royal robe and a golden crown! Let's paint them. Tap a paint pot, then tap the parts with the same number.",
    done: 'What a lovely queen! And Esther was lovely inside, too. She was kind, and soon she would be very brave.',
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Royal Words', decor: '👑', intro: "Queen Esther read a message from Mordecai. Let's play some word games, too!" },
  // (Hopeful, not worried: Esther is afraid, but God has a plan.)
  { kind: 'pause', line: "Will Queen Esther be brave and go to see the king? Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'Brave Queen Esther', pages: ESTHER_STORY_2, first: ESTHER_STORY_1.length },
  {
    kind: 'quiz', title: 'Queen Esther Questions',
    questions: [
      {
        say: 'Who took care of Esther when she was a little girl?',
        choices: [{ emoji: '🐻', say: 'A big bear' }, { emoji: '💛', say: 'Her cousin Mordecai', art: 'story:esther:1' }, { emoji: '🐧', say: 'A penguin' }],
        answer: 1,
      },
      {
        say: 'What did Esther and her friends do for three days?',
        choices: [{ emoji: '🙏', say: 'They prayed to God' }, { emoji: '⚽', say: 'They played ball' }, { emoji: '💤', say: 'They took a long nap' }],
        answer: 0,
      },
      {
        say: 'What did the king hold out to Queen Esther?',
        choices: [{ emoji: '🐟', say: 'A fish' }, { emoji: '🎈', say: 'A balloon' }, { emoji: '✨', say: 'His golden scepter', art: 'golden-scepter' }],
        answer: 2,
      },
      {
        say: "What did God's people have at the end of the story?",
        choices: [{ emoji: '⛵', say: 'A boat ride' }, { emoji: '🎉', say: 'A happy party' }, { emoji: '🚀', say: 'A rocket ride' }],
        answer: 1,
      },
    ],
  },
  {
    kind: 'count', title: 'Treats for the Party',
    intro: "At the happy party, God's people shared yummy food with their friends. Let's fill a basket with cookies to share!",
    item: { emoji: '🍪', say: 'cookie' }, plural: 'cookies', basket: '🧺', basketArt: 'basket', into: 'the basket', rounds: [4, 7],
    done: 'Seven cookies! What a yummy present to share at the party.',
  },
  { kind: 'verse', chunks: ESTHER_VERSE.chunks, ref: ESTHER_VERSE.ref },
  { kind: 'pause', line: "Someone on the island is all puffed up and proud. Who could it be? Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell Queen Esther's story? Put the pictures in order, from the first to the last.",
    // The story's own pictures (pages counted from 1 across both parts), one from each place in the story.
    items: [
      { emoji: '💛', say: 'Mordecai taking care of little Esther', art: 'story:esther:1' },
      { emoji: '👑', say: 'Esther becoming the queen', art: 'story:esther:2' },
      { emoji: '😤', say: 'Mordecai not bowing down to proud Haman', art: 'story:esther:4' },
      { emoji: '🙏', say: 'Esther and her friends praying', art: 'story:esther:7' },
      { emoji: '✨', say: 'the king holding out his golden scepter', art: 'story:esther:8' },
      { emoji: '🎉', say: 'the happy party', art: 'story:esther:12' },
    ],
  },
  { kind: 'battle', foe: 'strut', intro: 'Oh no! A proud little rooster named Strut is strutting about with his beak in the air! Strut just needs a friend.' },
  { kind: 'song', song: 'song-esther', intro: "Let's sing about brave Queen Esther! You can sing it on your Ark any time, too." },
  // (The reward says "You also earned a royal crown sticker!": the drawing is Queen Esther's own crown.)
  { kind: 'reward', pal: 'glimmer', sticker: 'esther-crown', stickerName: 'royal crown' },
]
