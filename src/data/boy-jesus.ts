import type { Step, StoryPage } from './islands'
import { BOY_JESUS_GAME } from '../art/games/boy-jesus'

// Boy Jesus at the Temple (Luke 2:41 to 52). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first,
// numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Jesus loved God's house, and God is His Father. The search is gentle and short: the game at the end of part one
// already shows the child where Jesus is (happy in God's house, listening and learning), so part two's looking is
// never scary, and every child knows the happy ending. Then He goes home, obeys Mary and Joseph, and grows up.

/** Visit 1: the trip to Jerusalem for the Passover, God's house, the feast, and the walk home (Jesus stays behind). */
export const BOY_JESUS_STORY_1: StoryPage[] = [
  { scene: '🏠👩🏽🧔🏽', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Jesus grew up in a little town called Nazareth, with Mary and Joseph. Every year, Mary and Joseph went to Jerusalem for a big, happy feast called the Passover.' },
  { scene: '🚶🏽🎶🫏', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'When Jesus was twelve years old, He went too! Lots of family and friends walked together. It was a long way, so they sang happy songs on the road.' },
  { scene: '🏙️✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: "At last, they saw Jerusalem, up on its hill. And there was God's house, the temple, shining in the sun!" },
  { scene: '🙌🏽🎺', bg: 'linear-gradient(#bfe6ff,#f6e8c8)', text: "The city was busy, busy, busy! People came from near and far for the feast. Jesus and His family went to God's house, to pray and to praise God." },
  { scene: '🌕🍞', bg: 'linear-gradient(#3b3486,#ffe9c9)', text: 'Then they ate the Passover dinner together. They ate flat bread, and they remembered how God set His people free from Egypt, long ago.' },
  { scene: '🚶🏽🏛️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: "When the feast was over, everyone set off for home, walking and talking together. But Jesus stayed behind in Jerusalem, and Mary and Joseph didn't know!" },
]

/** Visit 2: looking for Jesus, finding Him with the teachers, "My Father's house", and home again. Its pictures follow part one's. */
export const BOY_JESUS_STORY_2: StoryPage[] = [
  { scene: '⛺🔥', bg: 'linear-gradient(#6b5bb5,#ffa8b8)', text: "Everyone was walking home from the feast. That evening, Mary and Joseph looked for Jesus. Was He with their family? Was He with their friends? No, Jesus wasn't there!" },
  { scene: '🏘️👀', bg: 'linear-gradient(#bfe6ff,#f6e8c8)', text: 'So Mary and Joseph hurried back to Jerusalem. They looked and looked for Jesus, all over the big, busy city.' },
  { scene: '📜🧒🏽', bg: 'linear-gradient(#f6e8c8,#fff3c9)', text: "On the third day, they found Jesus in God's house! He was sitting with the teachers, listening to them and asking them questions." },
  { scene: '😮✨', bg: 'linear-gradient(#f6e8c8,#fff3c9)', text: 'Everyone who heard Jesus was amazed. He understood so much about God!' },
  { scene: '🤗🏛️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: `Mary said, "Son, we were looking everywhere for You!" Jesus said, "Didn't you know I must be in My Father's house?" Jesus is God's Son, so God's house is His Father's house!` },
  { scene: '🏠🪵💛', bg: 'linear-gradient(#bfe6ff,#e6ffd9)', text: 'Then Jesus went home to Nazareth with Mary and Joseph, and He obeyed them. Jesus grew bigger and wiser, and God and people loved Him. And God loves you, too!' },
]

// World English Bible (public domain), word for word: Luke 2:52.
export const BOY_JESUS_VERSE = {
  ref: 'Luke 2:52',
  chunks: ['And Jesus increased', 'in wisdom and stature,', 'and in favor', 'with God and men.'],
}

/** A story card for the put-it-in-order game: page n of the whole story (1 to 12). */
const card = (n: number, emoji: string, say: string) => ({ emoji, say, art: `story:boy-jesus:${n}` })

export const BOY_JESUS_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Off to Jerusalem', pages: BOY_JESUS_STORY_1 },
  {
    // (Exploring God's house and its wonders, not looking for a lost child: Jesus is one of the happy finds.)
    kind: 'spot', title: "Explore God's House", plural: 'things', kit: BOY_JESUS_GAME,
    intro: "Jesus loved God's house! It was busy with people at the feast. Can you find the golden lamp, two doves, a scroll, a little lamb, a teacher on the bench, and Jesus? Tap each one!",
    done: "You found them all! God's house is full of wonderful things. And best of all, Jesus is there, listening and learning!",
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the doves.)
  { kind: 'practice', skill: 'numbers', title: 'Dove Numbers', decor: '🕊️', theme: '🕊️', intro: "Coo, coo! The doves at God's house want to play number games with you. Let's go!" },
  { kind: 'pause', line: "Everyone is on the way home, but Jesus is still in God's house! What will Mary and Joseph do? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: "In My Father's House", pages: BOY_JESUS_STORY_2, first: BOY_JESUS_STORY_1.length },
  {
    // (Putting things in order by size, as Jesus grew: the same Jesus at four ages, standing on the same ground.)
    kind: 'sequence', title: 'Jesus Grew Up',
    intro: 'Jesus grew up, just like you are growing! Put the pictures in order, from the smallest to the biggest.',
    items: [
      { emoji: '👶', say: 'baby Jesus', art: 'jesus-baby' },
      { emoji: '🧒', say: 'little Jesus', art: 'jesus-little' },
      { emoji: '🧒', say: 'Jesus at twelve', art: 'jesus-twelve' },
      { emoji: '🧔', say: 'Jesus all grown up', art: 'jesus-grown' },
    ],
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Listen and Learn', decor: '📜', intro: "Jesus loved to listen and learn about God. You can learn, too! Let's play some word games." },
  { kind: 'verse', chunks: BOY_JESUS_VERSE.chunks, ref: BOY_JESUS_VERSE.ref },
  { kind: 'pause', line: "Scritch, scratch! Somebody is scurrying up and down the walls. Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of Jesus in God\'s house? Put the pictures in order, from the first one to the last one.',
    // The story's own pictures, one from each place in the story, so no two cards look alike. Each `say` names its
    // picture ("That's <say>.").
    items: [
      card(2, '🚶', 'everyone walking to Jerusalem'),
      card(3, '✨', "God's house, shining on the hill"),
      card(5, '🍞', 'the Passover dinner'),
      card(7, '⛺', 'Mary and Joseph looking for Jesus'),
      card(9, '📜', "Jesus with the teachers in God's house"),
      card(12, '🏠', 'Jesus back home, helping Joseph'),
    ],
  },
  { kind: 'battle', foe: 'sticky', intro: 'Oh no! A grumpy little gecko named Sticky is scurrying and fussing all over the walls! Sticky just needs a friend.' },
  { kind: 'song', song: 'song-boy-jesus', intro: "Where was Jesus? In His Father's house! Let's sing about it. You can sing it on your Ark any time, too." },
  // (A scroll of God's word, like the ones the teachers read with Jesus: the 📜 drawing in art/items/things.tsx.)
  { kind: 'reward', pal: 'chirp', sticker: '📜', stickerName: 'scroll' },
]
