import type { Step, StoryPage } from './islands'

export const DAVID_STORY: StoryPage[] = [
  { scene: '👦🏽🐑🐑', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'David was a shepherd boy who took care of his sheep. David loved God, and God loved David.' },
  { scene: '🎶🐑🌄', bg: 'linear-gradient(#ffe0b5,#c9f2d0)', text: 'Out in the fields, David sang songs to God. God helped David keep his sheep safe, even from a lion and a bear!' },
  { scene: '⛺😟😟', bg: 'linear-gradient(#e9d3b5,#fff3c9)', text: 'One day, David went to visit his big brothers. A giant named Goliath was there. He was big and loud, and everyone was afraid of him.' },
  { scene: '👦🏽💪✨', bg: 'linear-gradient(#fff3c9,#ffd9a8)', text: 'But David was not afraid. He said, God helped me before, and God will help me now! David trusted God.' },
  { scene: '🏞️🪨👝', bg: 'linear-gradient(#bfe6ff,#d8f0e0)', text: 'David went to a stream and picked five smooth stones. He put them in his shepherd bag.' },
  { scene: '👦🏽🪨💨', bg: 'linear-gradient(#ffe9c9,#bfe6ff)', text: 'David swung his sling, round and round. Whoosh! The little stone flew, and the great big giant fell down. Boom!' },
  { scene: '🎉🙌✨', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'Everybody cheered! God helped David, just like David trusted He would. God is bigger than any giant, and He is always with you, too!' },
]

// World English Bible (public domain).
export const DAVID_VERSE = {
  ref: 'Philippians 4:13',
  chunks: ['I can do all things', 'through Christ,', 'who strengthens me.'],
}

export const DAVID_STEPS: Step[] = [
  { kind: 'story', title: 'David and the Giant', pages: DAVID_STORY },
  {
    kind: 'count', title: 'Five Smooth Stones',
    intro: "David picked smooth stones from the stream. Let's help him count them into his bag!",
    item: { emoji: '🪨', say: 'smooth stone' }, plural: 'smooth stones', basket: '👝', into: "David's bag", rounds: [3, 5],
  },
  {
    kind: 'sort', title: 'Big and Small',
    intro: "Goliath was big, and David was small. Let's sort! Big things go with the elephant, and small things go with the mouse.",
    groups: [
      { id: 'big', emoji: '🐘', say: 'big' },
      { id: 'small', emoji: '🐭', say: 'small' },
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
  { kind: 'trace', title: 'D is for David', intro: 'David starts with the letter D! Trace the big D with your finger.', letters: ['D', 'd'] },
  { kind: 'verse', chunks: DAVID_VERSE.chunks, ref: DAVID_VERSE.ref },
  { kind: 'battle', foe: 'huffy', intro: 'Oh no! A grumpy goat named Huffy is huffing and puffing on the hill! Huffy just needs a friend.' },
  { kind: 'reward', pal: 'lionel', sticker: '🪨', stickerName: 'smooth stone' },
]
