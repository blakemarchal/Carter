import type { Step, StoryPage } from './islands'
import { EASTER_PAINT } from '../art/games/easter'

// Easter Morning (Matthew 26–28, Luke 22–24, John 19–20). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds,
// grace first, numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Jesus is alive! God's love is stronger than anything. This is the most delicate island in the game: a five-year-old
// must come away joyful, never frightened. The cross is told in two gentle sentences (page 3), and the pictures only
// ever show the friends' sad faces and a small, empty cross on a far hill at sunset. Part one ends on hope; the
// resurrection is the heart of the island.
// The island's game, "Paint the Easter Garden", comes after part two, when the tomb is empty: its finished picture is
// the joy of Easter morning (the garden waiting at dawn would be a closed tomb). So visit one has two learning
// activities, and visit two has the game and one.
// The pictures are in art/scenes/easter.tsx, the paint game's in art/games/easter.tsx.

/** Visit 1: the special supper, the cross told gently, the tomb in the garden, and the quiet. It ends on hope. */
export const EASTER_STORY_1: StoryPage[] = [
  { scene: '🍞🍷🙏', bg: 'linear-gradient(#6b5bb5,#ffc890)', text: 'One evening, Jesus and His friends ate a special supper together. Jesus took the bread and thanked God for it. Then He broke it and shared it with them all.' },
  { scene: '🍷💗', bg: 'linear-gradient(#6b5bb5,#ffc890)', text: 'Then Jesus passed them a cup to share. He said, "When you share the bread and the cup, remember Me." Jesus loved His friends so much.' },
  { scene: '🌅😢', bg: 'linear-gradient(#5f5aa8,#ffc28a)', text: 'But some people did not believe in Jesus. They put Him on a cross, and He died. His friends were very, very sad.' },
  { scene: '🪨🌿', bg: 'linear-gradient(#7d74c4,#ffd8a0)', text: 'Kind friends gently laid Jesus in a tomb. It was like a little cave in a garden. Then they rolled a big round stone across the door.' },
  { scene: '🌙🪔', bg: 'linear-gradient(#1c1d52,#3d3a8a)', text: "Then everything was quiet. Jesus' friends stayed at home, and they missed Him so much. But that was not the end of the story!" },
]

/** Visit 2: Sunday morning. The stone is rolled away, the tomb is empty, and Jesus is alive! Its pictures follow part one's. */
export const EASTER_STORY_2: StoryPage[] = [
  { scene: '🌅👣', bg: 'linear-gradient(#5f73c0,#ffdca8)', text: 'Remember the big round stone? Very early on Sunday morning, Mary Magdalene and her friends walked to the garden with sweet spices for Jesus. "Who will roll the big stone away for us?" they asked.' },
  { scene: '🪨✨', bg: 'linear-gradient(#86c8f4,#fff1cc)', text: 'But when they got there, the big stone was rolled away! An angel sat on it, shining bright, with clothes as white as snow.' },
  { scene: '✨😮', bg: 'linear-gradient(#86c8f4,#fff1cc)', text: 'The angel said, "Don\'t be afraid! He is not here, for He has risen, just like He said! Come and see." The tomb was empty!' },
  { scene: '🏃‍♀️🏠', bg: 'linear-gradient(#86c8f4,#fff1cc)', text: "The women ran as fast as they could to tell Jesus' other friends the happy news. Peter and John could hardly believe it!" },
  { scene: '🌸😊', bg: 'linear-gradient(#86c8f4,#fff1cc)', text: 'Mary Magdalene went back to the garden. She heard someone say her name. "Mary!" She turned around, and it was Jesus! He was alive!' },
  { scene: '🙌💗', bg: 'linear-gradient(#6b5bb5,#ffc890)', text: 'That evening, Jesus came to His friends. "Peace be with you!" He said. Oh, how happy they were! Jesus is alive forever, and He loves you, too. Hooray!' },
]

// World English Bible (public domain), word for word: the first part of Matthew 28:6 (the angel's words on page 8).
export const EASTER_VERSE = {
  ref: 'Matthew 28:6',
  chunks: ['He is not here,', 'for he has risen,', 'just like he said.'],
}

export const EASTER_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Jesus Loves His Friends', pages: EASTER_STORY_1 },
  {
    kind: 'count', title: 'Bread to Share',
    intro: "Do you remember Jesus' special supper? He broke the bread and shared it with His friends. Let's fill the basket with bread to share!",
    item: { emoji: '🫓', say: 'loaf of bread', art: 'flat-bread' }, plural: 'loaves of bread', basket: '🧺', basketArt: 'basket', rounds: [4, 6],
    done: 'Six loaves of bread to share! When we share, we can remember how much Jesus loves us.',
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Love Words', decor: '💛', intro: "Jesus loves His friends so much, and He loves you, too! Let's play some word games together." },
  { kind: 'pause', line: "Jesus' friends were so sad. But that was not the end of the story! Something wonderful is coming on Sunday morning. Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'Easter Morning', pages: EASTER_STORY_2, first: EASTER_STORY_1.length },
  {
    kind: 'paint', title: 'Paint the Easter Garden', kit: EASTER_PAINT,
    // (The two taps in the order they're made: a paint pot, then the parts with its number.)
    intro: "It's Easter morning, and the tomb is empty! Let's paint the garden. Tap a paint pot, then tap the parts with the same number.",
    done: "What a beautiful Easter morning! The big stone is rolled away, the flowers are blooming, and Jesus is alive! God's love is stronger than anything.",
  },
  {
    kind: 'quiz', title: 'Easter Questions',
    questions: [
      {
        say: 'Early on Sunday morning, what did Mary and her friends carry to the garden?',
        choices: [{ emoji: '🪁', say: 'A kite' }, { emoji: '🫙', say: 'Sweet spices', art: 'sweet-spices' }, { emoji: '🎂', say: 'A birthday cake' }],
        answer: 1,
      },
      {
        say: 'When they got there, what was rolled away?',
        // (the empty tomb, with the big round stone rolled away beside its door)
        choices: [{ emoji: '🪨', say: 'The big round stone', art: 'empty-tomb' }, { emoji: '⚽', say: 'A ball' }, { emoji: '🍎', say: 'An apple' }],
        answer: 0,
      },
      {
        say: 'Who told the women, "Don\'t be afraid! He has risen!"',
        choices: [{ emoji: '🐮', say: 'A cow' }, { emoji: '🦆', say: 'A duck' }, { emoji: '✨', say: 'A shining angel', art: 'story:easter:8' }],
        answer: 2,
      },
      {
        say: 'Who said Mary\'s name in the garden?',
        choices: [{ emoji: '✨', say: 'Jesus! He was alive!', art: 'story:easter:10' }, { emoji: '🐑', say: 'A sheep' }, { emoji: '🐸', say: 'A frog' }],
        answer: 0,
      },
    ],
  },
  { kind: 'verse', chunks: EASTER_VERSE.chunks, ref: EASTER_VERSE.ref },
  { kind: 'pause', line: "Shh, look by the garden path. A little snail is hiding in its shell, sad and all alone. Who could it be? Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the Easter story? Put the pictures in order, from the first one to the last one.',
    // The story's own pictures (pages counted from 1 across both parts), one from each place in the story, all of them
    // easy to tell apart. (The cross, page 3, is left out: the rescue is a happy visit. So is page 11, Jesus with His
    // friends in the upper room, which looks too much like the supper there on page 1.)
    items: [
      { emoji: '🍞', say: 'Jesus sharing the bread at supper', art: 'story:easter:1' },
      { emoji: '🪨', say: 'the big stone rolled across the door', art: 'story:easter:4' },
      { emoji: '🌅', say: 'the women walking to the garden', art: 'story:easter:6' },
      { emoji: '✨', say: 'the angel on the stone, rolled away', art: 'story:easter:7' },
      { emoji: '🏃‍♀️', say: 'the women running to tell the happy news', art: 'story:easter:9' },
      { emoji: '🌸', say: 'Jesus saying, Mary!', art: 'story:easter:10' },
    ],
  },
  { kind: 'battle', foe: 'twirl', intro: "Oh! A little snail named Twirl is hiding in its shell, all grumpy and sad. Twirl hasn't heard the happy news yet! Twirl just needs a friend." },
  { kind: 'song', song: 'song-easter', intro: "Early in the morning, the stone was rolled away, and Jesus is alive! Let's sing about it, with lots of alleluias. You can sing it on your Ark any time, too." },
  // (The reward says "You also earned a happy Easter sticker!": the drawing is the empty tomb in the garden at sunrise.)
  { kind: 'reward', pal: 'peep', sticker: 'empty-tomb', stickerName: 'happy Easter' },
]
