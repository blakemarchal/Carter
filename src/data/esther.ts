import type { Step, StoryPage } from './islands'
import { ESTHER_GAME } from '../art/games/esther'

// Queen Esther. See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in words,
// no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.

/** Visit 1: the story begins, up to where the island's game fits. */
export const ESTHER_STORY_1: StoryPage[] = [
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 1' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 2' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 3' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 4' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 5' },
]

/** Visit 2: the story goes on. Its pictures follow part one's in art/scenes/esther.tsx. */
export const ESTHER_STORY_2: StoryPage[] = [
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 6' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 7' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 8' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 9' },
  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page 10' },
]

// World English Bible (public domain), word for word.
export const ESTHER_VERSE = {
  ref: 'TODO 1:1',
  chunks: ['TODO', 'TODO'],
}

export const ESTHER_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Queen Esther', pages: ESTHER_STORY_1 },
  { kind: 'spot', title: 'TODO', intro: 'TODO', done: 'TODO', plural: 'TODO', kit: ESTHER_GAME },
  { kind: 'practice', skill: 'numbers', title: 'TODO', decor: '✨', theme: '⭐', intro: 'TODO' },
  { kind: 'pause', line: "TODO: a gentle cliffhanger. Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'TODO chapter two', pages: ESTHER_STORY_2, first: ESTHER_STORY_1.length },
  // 2 activities: pick from the kinds in islands.ts. Pictures are { emoji, say, art? } and must
  // show exactly what's said (see #gallery/items; story cards: art: 'story:esther:<page>').
  { kind: 'practice', skill: 'reading', title: 'TODO', decor: '📖', intro: 'TODO' },
  { kind: 'verse', chunks: ESTHER_VERSE.chunks, ref: ESTHER_VERSE.ref },
  { kind: 'pause', line: "TODO. Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story', intro: 'TODO',
    items: [1, 3, 5, 7, 9].map((n) => ({ emoji: '✨', say: `TODO page ${n}`, art: `story:esther:${n}` })),
  },
  { kind: 'battle', foe: 'strut', intro: 'TODO' },
  { kind: 'song', song: 'song-esther', intro: 'TODO' },
  { kind: 'reward', pal: 'glimmer', sticker: '⭐', stickerName: 'TODO' },
]
