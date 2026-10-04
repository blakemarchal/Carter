import type { Step, StoryPage } from './islands'
import { RED_SEA_GAME } from '../art/games/red-sea'

// The Red Sea (Exodus 12 to 15). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first,
// numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Kept gentle: the plagues aren't told ("Pharaoh said no, and no, and no again"), the chariots are only
// ever far away, and when the sea comes back together nobody is in the water.

/** Visit 1: from Egypt to the path through the sea. */
export const RED_SEA_STORY_1: StoryPage[] = [
  { scene: '🏜️🧱', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago, God\'s people lived in Egypt. The king of Egypt was called Pharaoh. He made God\'s people work very hard, making bricks all day long. But God loved His people, and He had a plan.' },
  { scene: '🧔🏽👑', bg: 'linear-gradient(#bfe6ff,#f3e4c4)', text: 'God sent Moses and his brother Aaron to see the king. Moses said, "God says, let my people go!"' },
  { scene: '☁️🔥', bg: 'linear-gradient(90deg,#bfe6ff,#3b3486)', text: 'Pharaoh said no, and no, and no again. But at last he said, "Go!" So off they went! God led the way, with a tall cloud in the day and a pillar of fire at night.' },
  { scene: '🌊🧔🏽', bg: 'linear-gradient(#c9b8ff,#ffd0dc)', text: 'They came to the edge of the Red Sea. But then Pharaoh changed his mind! Far away, his chariots were coming. Moses said, "Do not be afraid. God will help us!"' },
  { scene: '🌬️🌊', bg: 'linear-gradient(#2a2668,#5a7fc0)', text: 'Moses held out his staff over the sea. God sent a strong wind that blew all night long. Whoosh! The sea opened up, and the water stood up like two tall walls!' },
  { scene: '🌊👨‍👩‍👧‍👦🌊', bg: 'linear-gradient(#ffd0dc,#9fd8ff)', text: 'Then God\'s people walked right through the sea on dry ground! Moms and dads, boys and girls, grandmas and grandpas, and even the sheep and goats.' },
]

/** Visit 2: safe on the other side, and Miriam's song. Its pictures follow part one's in art/scenes/red-sea.tsx. */
export const RED_SEA_STORY_2: StoryPage[] = [
  { scene: '🌊🏖️', bg: 'linear-gradient(#ffd0dc,#fff3c9)', text: 'God\'s people were walking through the sea on dry ground. Step by step, everyone made it all the way to the other side, safe and sound!' },
  { scene: '💦🌊', bg: 'linear-gradient(#bfe6ff,#9fd8ff)', text: 'Then Moses held out his hand over the sea, and the water came rushing back together. Splash! Now Pharaoh\'s chariots could not follow them.' },
  { scene: '🙌☀️', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'God\'s people were safe and free! They would never have to make bricks for Pharaoh again. God had saved them!' },
  { scene: '💃🎵', bg: 'linear-gradient(#bfe6ff,#ffe9c9)', text: 'Then Miriam, the big sister of Moses, picked up her tambourine. Jingle, jingle! The women danced, and everyone sang a happy song to God.' },
  { scene: '🌅💛', bg: 'linear-gradient(#c9b8ff,#ffe9c9)', text: 'God made a way for His people, right through the sea! And God is with you, too. He loves you, and He will always help you.' },
]

// World English Bible (public domain), word for word: Psalm 136:13, with the WEB's semicolon after
// "apart". (The WEB's verse ends with another semicolon, as the psalm goes on into verse 14, so it ends
// with a full stop here, as Noah's verse does.)
export const RED_SEA_VERSE = {
  ref: 'Psalm 136:13',
  chunks: ['To him who divided', 'the Red Sea apart;', 'for his loving kindness', 'endures forever.'],
}

export const RED_SEA_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Let My People Go', pages: RED_SEA_STORY_1 },
  {
    kind: 'steer', title: 'Through the Sea',
    intro: 'Help Moses lead God\'s people through the sea on dry ground! Slide Moses along the glowing path, and pick up the seashells on the way.',
    done: 'Hooray! Everyone walked through the sea, safe and sound. And you found five seashells!',
    kit: RED_SEA_GAME,
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the
  // seashells, so it doesn't promise any.)
  { kind: 'practice', skill: 'numbers', title: 'Seashell Numbers', decor: '🌊', theme: '🐚', intro: 'Splish, splash! Let\'s play some number games by the sea.' },
  // (A cliffhanger of wonder, not worry: the game just ended with everyone safe on the far shore.)
  { kind: 'pause', line: 'Everyone is safe! But the water is still standing up like two tall walls. What will God do next? Let\'s find out next time!' },

  // Visit 2: the adventure
  { kind: 'story', title: 'God Makes a Way', pages: RED_SEA_STORY_2, first: RED_SEA_STORY_1.length },
  {
    kind: 'sort', title: 'Day and Night',
    intro: 'God led His people with a tall cloud in the daytime, and with a pillar of fire at nighttime. Let\'s sort! Does it go with the day, or with the night?',
    hint: 'Day or night?',
    groups: [
      { id: 'day', emoji: '☀️', say: 'in the daytime', art: 'sun' },
      { id: 'night', emoji: '🌙', say: 'at nighttime', art: 'moon' },
    ],
    items: [
      { emoji: '☁️', say: 'the tall cloud', art: 'pillar-of-cloud', group: 'day' },
      { emoji: '🔥', say: 'the pillar of fire', art: 'pillar-of-fire', group: 'night' },
      { emoji: '🦋', say: 'the butterfly', group: 'day' },
      { emoji: '⭐', say: 'the twinkly star', group: 'night' },
      { emoji: '🌈', say: 'the rainbow', group: 'day' },
      { emoji: '🦉', say: 'the owl', group: 'night' },
      { emoji: '🐝', say: 'the busy bee', group: 'day' },
      { emoji: '🛏️', say: 'the bed', group: 'night' },
    ],
  },
  // (The intro fits every level: letter sounds, reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Jingle Words', decor: '🎵', intro: 'Jingle, jingle! Let\'s play some happy word games together.' },
  { kind: 'verse', chunks: RED_SEA_VERSE.chunks, ref: RED_SEA_VERSE.ref },
  { kind: 'pause', line: 'Whoosh! A grumpy little wind is huffing and puffing on the beach. Who will be his friend? Let\'s find out next time!' },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story', intro: 'Let\'s tell the story of the Red Sea! Put the pictures in order, from first to last.',
    // The story's own pictures (pages counted from one across both parts). Each `say` names its picture
    // as a lowercase phrase, as the other islands' do, since a wrong pick is answered "That's <say>."
    items: [
      { emoji: '👑', say: 'Moses talking to the king', art: 'story:red-sea:2' },
      { emoji: '🔥', say: 'the cloud and the fire leading the way', art: 'story:red-sea:3' },
      { emoji: '🌬️', say: 'Moses holding out his staff over the sea', art: 'story:red-sea:5' },
      { emoji: '🌊', say: 'God\'s people walking through the sea on dry ground', art: 'story:red-sea:6' },
      { emoji: '💦', say: 'the water coming back together', art: 'story:red-sea:8' },
      { emoji: '🎵', say: 'Miriam\'s happy song', art: 'story:red-sea:10' },
    ],
  },
  { kind: 'battle', foe: 'gusty', intro: 'Whoosh! A huffy puff of wind named Gusty is blowing sand all over the beach! Gusty just needs a friend.' },
  { kind: 'song', song: 'song-red-sea', intro: 'Let\'s sing about how God made a way through the sea! You can sing it on your Ark any time, too.' },
  // (A seashell, like the ones picked up on the way through the sea: a sticker is named by its emoji, and
  // there's no tambourine emoji to name Miriam's tambourine by.)
  { kind: 'reward', pal: 'jingle', sticker: '🐚', stickerName: 'seashell' },
]
