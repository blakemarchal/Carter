import type { Step, StoryPage } from './islands'
import { BOY_JESUS_GAME } from '../art/games/boy-jesus'

// Boy Jesus at the Temple. See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in words,
// no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.

/** Visit 1: the story begins, up to where the island's game fits. */
export const BOY_JESUS_STORY_1: StoryPage[] = [
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 1' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 2' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 3' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 4' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 5' },
]

/** Visit 2: the story goes on. Its pictures follow part one's in art/scenes/boy-jesus.tsx. */
export const BOY_JESUS_STORY_2: StoryPage[] = [
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 6' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 7' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 8' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 9' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 10' },
]

// World English Bible (public domain), word for word.
export const BOY_JESUS_VERSE = {
  ref: 'TODO 1:1',
  chunks: ['TODO', 'TODO'],
}

export const BOY_JESUS_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Boy Jesus at the Temple', pages: BOY_JESUS_STORY_1 },
  { kind: 'spot', title: 'TODO', intro: 'TODO', done: 'TODO', plural: 'TODO', kit: BOY_JESUS_GAME },
  { kind: 'practice', skill: 'numbers', title: 'TODO', decor: '✨', theme: '⭐', intro: 'TODO' },
  { kind: 'pause', line: "TODO: a gentle cliffhanger. Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'TODO chapter two', pages: BOY_JESUS_STORY_2, first: BOY_JESUS_STORY_1.length },
  // 2 activities: pick from the kinds in islands.ts. Pictures are { emoji, say, art? } and must
  // show exactly what's said (see #gallery/items; story cards: art: 'story:boy-jesus:<page>').
  { kind: 'practice', skill: 'reading', title: 'TODO', decor: '📖', intro: 'TODO' },
  { kind: 'verse', chunks: BOY_JESUS_VERSE.chunks, ref: BOY_JESUS_VERSE.ref },
  { kind: 'pause', line: "TODO. Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story', intro: 'TODO',
    items: [1, 3, 5, 7, 9].map((n) => ({ emoji: '✨', say: `TODO page ${n}`, art: `story:boy-jesus:${n}` })),
  },
  { kind: 'battle', foe: 'sticky', intro: 'TODO' },
  { kind: 'song', song: 'song-boy-jesus', intro: 'TODO' },
  { kind: 'reward', pal: 'chirp', sticker: '⭐', stickerName: 'TODO' },
]
