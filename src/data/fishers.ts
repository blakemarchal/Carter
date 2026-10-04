import type { Step, StoryPage } from './islands'
import { FISHERS_GAME } from '../art/games/fishers'

// Fishers of People (Luke 5:1-11, with Matthew 4:18-22 and Mark 1:16-20). See docs/ISLAND-GUIDE.md: short sentences
// for 4-year-olds, grace first, numbers in words, no emoji or symbols in anything spoken, and every page's picture
// shows what its words say (art/scenes/fishers.tsx, one array for both parts).
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Jesus calls ordinary fishermen to follow Him. Peter trusts Him ("because You say so"), Jesus fills the nets, and
// "fishers of people" is said for a four-year-old: helping everyone know how much God loves them. The fish are the
// fishermen's work: bright and cheerful, never eaten. (No "tear" for the breaking net: the voice can read it as crying.)

/** Visit 1: the crowd by the lake, the empty nets, Jesus teaching from Peter's boat, and "Go out where it's deep." */
export const FISHERS_STORY_1: StoryPage[] = [
  { scene: '🌅👥', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'One morning, Jesus was by the Lake of Galilee. A great big crowd came to hear Him talk about God.' },
  { scene: '⛵⛵', bg: 'linear-gradient(#bfe6ff,#f3dcb0)', text: 'Two fishing boats sat on the shore. The fishermen were washing their nets. Their nets were empty. Not one fish!' },
  { scene: '⛵🙌', bg: 'linear-gradient(#bfe6ff,#c9ecff)', text: "One boat belonged to a fisherman named Peter. Jesus got into Peter's boat, and Peter pushed it out onto the water. Then Jesus sat down in the boat and taught the people." },
  { scene: '🌊👉', bg: 'linear-gradient(#bfe6ff,#8fcbf0)', text: 'When Jesus was done teaching, He said to Peter, "Now go out where the water is deep, and let down your nets."' },
  { scene: '🙏🎣', bg: 'linear-gradient(#bfe6ff,#7fc4ea)', text: 'Peter said, "Teacher, we worked hard all night, and we didn\'t catch anything. But because You say so, I will!"' },
]

/** Visit 2: so many fish, both boats full, "Come, follow Me", leaving everything, and following Jesus, too. Its pictures follow part one's. */
export const FISHERS_STORY_2: StoryPage[] = [
  { scene: '🐟🐟🐟', bg: 'linear-gradient(#bfe6ff,#7fc4ea)', text: 'Peter let down the nets, just like Jesus said. Then, splash! So many fish! The nets were so full, they started to break.' },
  { scene: '⛵🐟⛵', bg: 'linear-gradient(#bfe6ff,#8fcbf0)', text: 'Peter waved to James and John in the other boat. "Come and help us!" Soon both boats were so full of fish, they sank down low in the water!' },
  { scene: '🙏✨', bg: 'linear-gradient(#fff6d9,#bfe6ff)', text: 'Peter knelt down in front of Jesus. He was so amazed! Jesus smiled and said, "Don\'t be afraid. Come, follow Me, and I will make you fishers of people."' },
  { scene: '⛵👣', bg: 'linear-gradient(#bfe6ff,#f3dcb0)', text: 'So they pulled their boats up onto the shore. They left everything, and they followed Jesus! James and John\'s dad, Zebedee, stayed in his boat with his helpers and waved goodbye.' },
  { scene: '💛👣', bg: 'linear-gradient(#ffe0f0,#bfe6ff)', text: 'Fishers of people help everyone know how much God loves them. Jesus wants you to follow Him, too! And God loves you, every single day.' },
]

// (Story cards, `story:fishers:<n>`, count the pages from 1 through both parts: part two starts at page 6.)

// World English Bible (public domain), word for word: Jesus' words in Matthew 4:19 (the words before them, "He said to
// them," are left out). The WEB says "fishers for men"; the story says "fishers of people".
export const FISHERS_VERSE = {
  ref: 'Matthew 4:19',
  chunks: ['Come after me,', 'and I will make you', 'fishers for men.'],
}

export const FISHERS_STEPS: Step[] = [
  // ----- Visit 1: the story -----
  { kind: 'story', title: 'Fishers of People', pages: FISHERS_STORY_1 },
  {
    kind: 'catch', title: 'Let Down the Nets',
    intro: 'Peter and his brother Andrew let down the net into the deep water, just like Jesus said. Look! Here come the fish! Slide the net, and catch ten fish.',
    // (Not "the net is breaking" yet: what happens next is part two.)
    done: 'Ten fish in the net, and more are coming! Jesus knew just where the fish were.',
    plural: 'fish', kit: FISHERS_GAME,
  },
  // (The game counts to ten, so this visit's activity is reading. The intro fits every level: letter sounds, reading
  // words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Word Fishing', decor: '🐟', intro: "Let's go fishing for words! Listen, then tap the right one." },
  { kind: 'pause', line: "Splash, splash! More and more fish are swimming into Peter's net. What will happen? Let's find out next time!" },

  // ----- Visit 2: the adventure -----
  { kind: 'story', title: 'Come, Follow Me', pages: FISHERS_STORY_2, first: FISHERS_STORY_1.length },
  {
    kind: 'quiz', title: 'Fishing Questions',
    questions: [
      {
        say: 'Where did Jesus sit to teach the people?',
        choices: [{ emoji: '🐪', say: 'On a camel' }, { emoji: '⛵', say: "In Peter's boat", art: 'story:fishers:3' }, { emoji: '🌳', say: 'Up in a tree' }],
        answer: 1,
      },
      {
        say: 'How many fish did Peter catch, all night long?',
        choices: [{ emoji: '🎣', say: 'Not one fish', art: 'empty-net' }, { emoji: '🐟🐟', say: 'Two fish' }, { emoji: '🐟', say: 'Lots and lots of fish', art: 'net-of-fish' }],
        answer: 0,
      },
      {
        say: 'What happened when Peter let down the nets, just like Jesus said?',
        choices: [{ emoji: '🐳', say: 'A big whale came' }, { emoji: '🐸', say: 'Lots of frogs hopped in' }, { emoji: '🐟', say: 'The nets filled up with fish', art: 'story:fishers:6' }],
        answer: 2,
      },
      {
        say: 'What did Jesus say to Peter?',
        choices: [{ emoji: '🙏', say: 'Come, follow Me', art: 'story:fishers:8' }, { emoji: '🛏️', say: 'Go to bed' }, { emoji: '🎂', say: "Let's eat cake" }],
        answer: 0,
      },
    ],
  },
  // (The intro fits every level: counting, what comes next, adding. Counting and adding show the fish.)
  { kind: 'practice', skill: 'numbers', title: 'Fish Numbers', decor: '⛵', theme: '🐟', intro: "So many fish! Let's play some number games with them." },
  { kind: 'verse', chunks: FISHERS_VERSE.chunks, ref: FISHERS_VERSE.ref },
  { kind: 'pause', line: "Uh oh! Someone with a great big beak wants to gobble up all the fish. Who could it be? Let's find out next time!" },

  // ----- Visit 3: the rescue -----
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: "Let's tell the story of Peter and the fish! Put the pictures in order, from first to last.",
    // (The story's own pictures, pages counted from one across both parts, picked so no two cards look alike. Each
    // `say` names its picture as a lowercase phrase: "That's the big crowd by the lake.")
    items: [
      { emoji: '👥', say: 'the big crowd by the lake', art: 'story:fishers:1' },
      { emoji: '⛵', say: "Jesus teaching from Peter's boat", art: 'story:fishers:3' },
      { emoji: '🐟', say: 'the net so full of fish', art: 'story:fishers:6' },
      { emoji: '🙏', say: 'Peter kneeling in front of Jesus', art: 'story:fishers:8' },
      { emoji: '👣', say: 'everyone following Jesus', art: 'story:fishers:9' },
    ],
  },
  { kind: 'battle', foe: 'gulp', intro: 'Oh no! A grumpy pelican named Gulp is gobbling up all the fish! Gulp just needs a friend.' },
  { kind: 'song', song: 'song-fishers', intro: "Let's sing about the fishermen who followed Jesus! You can sing it on your Ark any time, too." },
  // (Peter's net full of fish, from the story: art/items/isl-fishers.tsx.)
  { kind: 'reward', pal: 'splash', sticker: 'net-of-fish', stickerName: 'net full of fish' },
]
