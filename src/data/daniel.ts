import type { Step, StoryPage } from './islands'
import { DANIEL_GAME } from '../art/games/daniel'

// Daniel and the Lions (Daniel 6). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first,
// numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// The lions are big, gentle cats: nothing in it is frightening. (The end of the chapter, where the jealous men
// are punished, is left out.)

/** Visit 1: Daniel prays, the trick, and the lions' den. Then the lions' game: God's angel shuts their mouths. */
export const DANIEL_STORY_1: StoryPage[] = [
  { scene: '🧔🏽🙏🪟', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Long ago, there was a man named Daniel. God loved Daniel, and Daniel loved God with all his heart. Three times every day, he knelt by his open window and prayed to God.' },
  { scene: '👑🧔🏽📜', bg: 'linear-gradient(#fff3c9,#ffe0b5)', text: 'King Darius liked Daniel very much. Daniel was wise and kind, and he always told the truth. So the king gave him a very important job.' },
  { scene: '👑📜😠', bg: 'linear-gradient(#fff3c9,#e9d3b5)', text: "But some men were jealous of Daniel. They tricked the king. They said, \"Make a new rule! For thirty days, everyone must pray only to you, or go into the lions' den.\" So the king signed the rule." },
  { scene: '🧔🏽🙏👀', bg: 'linear-gradient(#ffe9c9,#fff3c9)', text: 'Daniel heard about the rule. But he still knelt by his open window and prayed to God, just like he always did. The jealous men saw him praying!' },
  { scene: '👑😢', bg: 'linear-gradient(#ffd9a8,#ffb3a8)', text: "They hurried to tell the king. The king was very sad, because he loved Daniel. He tried and tried to help him. But the king's rule could not be changed." },
  { scene: '🦁🪨🌙', bg: 'linear-gradient(#c9a8ff,#ffd9a8)', text: 'So Daniel was put into a den of lions, and a big stone was rolled over the door. The king said, "Daniel, your God will keep you safe!"' },
]

/** Visit 2: the morning. Its pictures follow part one's in art/scenes/daniel.tsx. */
export const DANIEL_STORY_2: StoryPage[] = [
  { scene: '👑🌙😟', bg: 'linear-gradient(#8f9bd6,#c9c3ff)', text: "That night, Daniel was in the lions' den. Back at the palace, the king could not sleep. He did not want to eat. He was so worried about Daniel." },
  { scene: '🌅👑🏃', bg: 'linear-gradient(#ffb3c7,#ffe8b0)', text: 'Early in the morning, the king hurried to the den. He called out, "Daniel! Did your God keep you safe from the lions?"' },
  { scene: '🧔🏽😇🦁', bg: 'linear-gradient(#ffe8b0,#fff6d9)', text: "Daniel called back, \"Yes, King Darius! My God sent His angel and shut the lions' mouths. They did not hurt me at all!\"" },
  { scene: '🧔🏽🙌👑', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'The king was so happy! He had the stone rolled away, and Daniel came out of the den. He did not have a single scratch, because he trusted God.' },
  { scene: '👑📜🎉', bg: 'linear-gradient(#bfe6ff,#ffe9c9)', text: "Then the king sent a letter to everyone in the land. It said, \"Daniel's God is the living God! He saves, and He rescues.\"" },
  { scene: '🙏💛', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: 'Daniel kept on praying every day, and God was always with him. You can talk to God any time, too, in the morning, at lunch, and at night. God always hears you!' },
]

// World English Bible (public domain), word for word: the first part of Daniel 6:22.
export const DANIEL_VERSE = {
  ref: 'Daniel 6:22',
  chunks: ['My God', 'has sent his angel,', 'and has shut', "the lions' mouths."],
}

export const DANIEL_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Daniel Loves to Pray', pages: DANIEL_STORY_1 },
  {
    kind: 'spot', title: 'The Gentle Lions', plural: 'lions', kit: DANIEL_GAME,
    intro: "That night, God sent His angel to shut the lions' mouths! Tap each lion, and watch it lie down gently.",
    done: 'All the lions are sleepy and gentle. God kept Daniel safe all night long!',
  },
  { kind: 'practice', skill: 'numbers', title: 'Lion Numbers', decor: '🦁', theme: '🦁', intro: "Purr, purr! The gentle lions want to play a number game with you. Let's go!" },
  { kind: 'pause', line: "The king couldn't sleep all night. What will he find in the morning? Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'Safe All Night Long', pages: DANIEL_STORY_2, first: DANIEL_STORY_1.length },
  {
    kind: 'quiz', title: 'Daniel Questions',
    questions: [
      {
        say: 'Where did Daniel pray to God?',
        choices: [{ emoji: '🪟', say: 'By his open window', art: 'story:daniel:1' }, { emoji: '⛵', say: 'On a boat' }, { emoji: '⛺', say: 'In a tent' }],
        answer: 0,
      },
      {
        say: 'How many times did Daniel pray every day?',
        choices: [{ emoji: '🙏', say: 'One time' }, { emoji: '🙏🙏', say: 'Two times' }, { emoji: '🙏🙏🙏', say: 'Three times' }],
        answer: 2,
      },
      {
        say: "Who did God send to shut the lions' mouths?",
        choices: [{ emoji: '🐦', say: 'A little bird' }, { emoji: '👼', say: 'An angel', art: 'daniel-angel' }, { emoji: '🐘', say: 'A big elephant' }],
        answer: 1,
      },
      {
        say: 'What did the king do early in the morning?',
        choices: [{ emoji: '🛏️', say: 'He went back to bed' }, { emoji: '👑', say: 'He hurried to the den', art: 'story:daniel:8' }, { emoji: '🎂', say: 'He ate some cake' }],
        answer: 1,
      },
    ],
  },
  { kind: 'practice', skill: 'reading', title: "The King's Letter", decor: '📜', intro: "The king wrote a letter to tell everyone about God! Let's play word games, too." },
  { kind: 'verse', chunks: DANIEL_VERSE.chunks, ref: DANIEL_VERSE.ref },
  { kind: 'pause', line: "Someone on the island is feeling very growly. Who could it be? Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story', intro: "Can you tell Daniel's story? Put the pictures in order, from the first to the last.",
    items: [
      { emoji: '🙏', say: 'Daniel praying by his window', art: 'story:daniel:1' },
      { emoji: '📜', say: 'the king signing the new rule', art: 'story:daniel:3' },
      { emoji: '🦁', say: "Daniel going into the lions' den", art: 'story:daniel:6' },
      { emoji: '🌅', say: 'the king hurrying to the den', art: 'story:daniel:8' },
      { emoji: '🙌', say: 'Daniel coming out safe', art: 'story:daniel:10' },
    ],
  },
  { kind: 'battle', foe: 'growly', intro: 'Oh no! A grumpy lion cub named Growly is growling at everybody! Growly just needs a friend.' },
  { kind: 'song', song: 'song-daniel', intro: "Let's sing about Daniel, who prayed to God every day! You can sing it on your Ark any time, too." },
  { kind: 'reward', pal: 'hoot', sticker: '🦁', stickerName: 'lion' },
]
