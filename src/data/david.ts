import type { Step, StoryPage } from './islands'
import { DAVID_GAME } from '../art/games/david'

// David and the Giant (1 Samuel 16 and 17). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds,
// grace first, numbers in words, nothing spoken with emoji or symbols, and every page's picture shows what
// its words say (art/scenes/david.tsx, one array for both parts). Goliath is big and loud but never scary.
// Three visits (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// (Pages 1, 3 and 7 to 11 are the island's first seven pages, word for word, and part 1 keeps the first
// title, so the family's recordings of them still play.)

/** Part 1: David the shepherd boy: his sheep, God's choice, and his songs (pictures 1 to 5). */
export const DAVID_STORY_1: StoryPage[] = [
  { scene: '👦🏽🐑🐑', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'David was a shepherd boy who took care of his sheep. God loved David, and David loved God.' },
  { scene: '👦🏽🐑💧', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: "Every day, David led his father's sheep to green grass and cool water. When a little lamb got tired, David carried it in his arms." },
  { scene: '🎶🐑🌄', bg: 'linear-gradient(#ffe0b5,#c9f2d0)', text: 'Out in the fields, David sang songs to God. God helped David keep his sheep safe, even from a lion and a bear!' },
  { scene: '👴🏽👦🏽💛', bg: 'linear-gradient(#fff3c9,#c9f2d0)', text: "God sent a man named Samuel to David's family. David's big brothers were tall and strong. But God looks at the heart. God picked David to be king one day!" },
  { scene: '🌙🎶🐑', bg: 'linear-gradient(#3b3486,#35577a)', text: 'At night, under the twinkly stars, David played his harp. He made up songs for God. One song says, God is my shepherd. He takes care of me!' },
]

/** Part 2: the giant, David's trust in God, five smooth stones, and the giant falls (pictures 6 to 11). */
export const DAVID_STORY_2: StoryPage[] = [
  { scene: '👦🏽⛺👑', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: "Remember David, the shepherd boy who loved God? David's big brothers were soldiers in King Saul's army, far away." },
  { scene: '⛺😟😟', bg: 'linear-gradient(#e9d3b5,#fff3c9)', text: 'One day, David took some bread to his big brothers. A giant named Goliath was there. He was big and loud, and all the soldiers were afraid of him.' },
  { scene: '👦🏽👑✨', bg: 'linear-gradient(#fff3c9,#ffd9a8)', text: 'But David was not afraid. He told King Saul, "God helped me before, and God will help me now!" David trusted God.' },
  { scene: '🏞️👦🏽👝', bg: 'linear-gradient(#bfe6ff,#d8f0e0)', text: "David went to a stream and picked five smooth stones. He put them in his shepherd's bag." },
  { scene: '👦🏽💨', bg: 'linear-gradient(#ffe9c9,#bfe6ff)', text: 'David swung his sling, round and round. Whoosh! The little stone flew, and the great big giant fell down. Boom!' },
  { scene: '🎉🙌✨', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'Everybody cheered! God helped David, just like David knew He would. God is bigger than any giant, and He is always with you, too!' },
]

/** Every page, in order: story cards (`story:david:<n>`) count from 1 through both parts. */
export const DAVID_STORY: StoryPage[] = [...DAVID_STORY_1, ...DAVID_STORY_2]

// World English Bible (public domain). David wrote it, and it's page 8: afraid, but trusting God.
export const DAVID_VERSE = {
  ref: 'Psalm 56:3',
  chunks: ['When I am afraid,', 'I will put my trust', 'in you.'],
}

export const DAVID_STEPS: Step[] = [
  // ----- Visit 1: the story -----
  { kind: 'story', title: 'David and the Giant', pages: DAVID_STORY_1 },
  {
    kind: 'rhythm', title: "Play David's Harp",
    intro: 'David played his harp and sang to God. Now you can play it, too! Tap the harp when a note gets to it.',
    done: 'What a beautiful song for God! He loves it when we sing and play for Him.',
    kit: DAVID_GAME,
  },
  { kind: 'trace', title: 'D is for David', intro: 'David starts with the letter D! Trace the big D, and then the little d, with your finger.', letters: ['D', 'd'] },
  { kind: 'pause', line: "One day, David went to visit his big brothers. Who will he meet there? Let's find out next time!" },

  // ----- Visit 2: the adventure -----
  { kind: 'story', title: 'David Trusts God', pages: DAVID_STORY_2, first: DAVID_STORY_1.length },
  {
    kind: 'count', title: 'Five Smooth Stones',
    intro: "David picked smooth stones from the stream. Let's help him count them into his bag!",
    // (👝 is drawn as a shepherd's bag: art/items/things.tsx)
    item: { emoji: '🪨', say: 'smooth stone', art: 'stone' }, plural: 'smooth stones', basket: '👝', into: "David's bag", rounds: [3, 5],
    done: 'Five smooth stones, just like David!',
  },
  {
    kind: 'sort', title: 'Big and Small',
    intro: "Goliath was big, and David was small. Let's sort! Big things go with the elephant, and small things go with the mouse.",
    hint: 'Drag it to big or small!',
    groups: [
      { id: 'big', emoji: '🐘', say: "it's big" },
      { id: 'small', emoji: '🐭', say: "it's small" },
    ],
    items: [
      { emoji: '🦒', say: 'the giraffe', group: 'big' },
      { emoji: '🐳', say: 'the whale', group: 'big' },
      { emoji: '🌳', say: 'the tall tree', group: 'big' },
      { emoji: '⛰️', say: 'the mountain', group: 'big' },
      { emoji: '🐜', say: 'the ant', group: 'small' },
      { emoji: '🐞', say: 'the ladybug', group: 'small' },
      { emoji: '🐣', say: 'the baby chick', group: 'small' },
      { emoji: '🍓', say: 'the strawberry', group: 'small' },
    ],
  },
  { kind: 'verse', chunks: DAVID_VERSE.chunks, ref: DAVID_VERSE.ref },
  { kind: 'pause', line: "Uh oh! Someone grumpy is huffing and puffing up on the hill. Who could it be? Let's find out next time!" },

  // ----- Visit 3: the rescue -----
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Can you tell David's story? Put the pictures in order, from the first to the last.",
    items: [
      { emoji: '🐑', say: 'David taking care of his sheep', art: 'story:david:1' },
      { emoji: '🎶', say: 'David playing his harp under the stars', art: 'story:david:5' },
      { emoji: '⛺', say: 'Goliath the giant shouting', art: 'story:david:7' },
      { emoji: '🪨', say: 'David picking five smooth stones', art: 'story:david:9' },
      { emoji: '💫', say: 'the giant falling down', art: 'story:david:10' },
      { emoji: '🎉', say: 'everybody cheering', art: 'story:david:11' },
    ],
  },
  { kind: 'battle', foe: 'huffy', intro: 'Oh no! A grumpy goat named Huffy is huffing and puffing on the hill! Huffy just needs a friend.' },
  { kind: 'song', song: 'song-david', intro: "David loved to sing to God. Let's sing David's song! You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'lionel', sticker: '🪨', stickerName: 'smooth stone' },
]
