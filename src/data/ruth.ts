import type { Step, StoryPage } from './islands'
import { RUTH_GAME } from '../art/games/ruth'

// Ruth and Naomi (the book of Ruth). See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first,
// numbers in words, no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.
// Love that stays, and God's care through kind people. Kept gentle: Naomi's loss is one sentence ("Naomi's
// husband and her two sons died, and she was very sad"), and the story goes straight on to the good news and
// Ruth's love. It ends with baby Obed, who grew up to be the grandpa of King David (the David of David and Goliath).

/** Visit 1: from Bethlehem to Moab and back again, with Ruth beside Naomi all the way. */
export const RUTH_STORY_1: StoryPage[] = [
  { scene: '🏘️🚶', bg: 'linear-gradient(#bfe6ff,#f3e4c4)', text: 'Long ago, a woman named Naomi lived in Bethlehem with her husband and their two boys. One year, there was no food in Bethlehem. So they moved far away, to a land called Moab.' },
  { scene: '👩🏽💛👩🏽', bg: 'linear-gradient(#bfe6ff,#c9f2d0)', text: 'In Moab, the boys grew up. They married two kind women named Ruth and Orpah. Naomi loved Ruth and Orpah, and they loved her, too.' },
  { scene: '😢🌅', bg: 'linear-gradient(#ffd0dc,#ffe9c9)', text: 'Then Naomi\'s husband and her two sons died, and she was very sad. One day, Naomi heard good news. God had given His people food in Bethlehem again! "I will go home," she said.' },
  { scene: '👋💋', bg: 'linear-gradient(#bfe6ff,#e6f0c4)', text: 'So Naomi set off for home, and Ruth and Orpah went with her. On the way, Naomi said, "Go back home to your mothers, my dears." Orpah kissed Naomi goodbye, and she went back home.' },
  { scene: '🤗💛', bg: 'linear-gradient(#ffd0dc,#fff3c9)', text: 'But Ruth hugged Naomi tight. "Where you go, I will go," said Ruth. "Your people will be my people, and your God will be my God."' },
  { scene: '🏘️🌾', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Ruth and Naomi walked together, all the way to Bethlehem. When they got there, the barley in the fields was golden and ready to harvest!' },
]

/** Visit 2: kind Boaz, a basket full of barley, a wedding, and baby Obed. Its pictures follow part one's in art/scenes/ruth.tsx. */
export const RUTH_STORY_2: StoryPage[] = [
  { scene: '🌾🧺', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Remember Ruth and Naomi? They were home in Bethlehem, but they had no food. So Ruth went to pick up the leftover barley in a field. The field belonged to a kind man named Boaz.' },
  { scene: '🍞💧', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'At lunchtime, Boaz shared his bread with Ruth, and cool water, too. Then he told his workers, "Drop some extra barley for her, on purpose!"' },
  { scene: '🧺🌙', bg: 'linear-gradient(#6b5bb5,#ffa8b8)', text: 'That evening, Ruth brought home a big basket full of barley! Naomi was so happy. "God bless kind Boaz!" she said. "God is taking care of us."' },
  { scene: '💐💛', bg: 'linear-gradient(#bfe6ff,#ffe0ef)', text: 'Boaz loved Ruth, and Ruth loved Boaz. So they got married! Everyone in Bethlehem was happy for them.' },
  { scene: '👶💛', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'Then God gave Ruth and Boaz a baby boy named Obed. Naomi held baby Obed close. She was so happy again!' },
  { scene: '👑🌅', bg: 'linear-gradient(#ffb3a8,#ffe3a0)', text: 'Baby Obed grew up, and one day he became the grandpa of King David! God took care of Ruth and Naomi, and God takes care of you, too.' },
]

// World English Bible (public domain), word for word: the second sentence of Ruth 1:16, Ruth's promise to Naomi
// ("...where you go, I will go; and where you stay, I will stay. Your people will be my people, and your God my God.").
export const RUTH_VERSE = {
  ref: 'Ruth 1:16',
  chunks: ['Your people', 'will be my people,', 'and your God', 'my God.'],
}

export const RUTH_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: 'Ruth and Naomi', pages: RUTH_STORY_1 },
  {
    kind: 'catch', title: 'Gather the Barley',
    intro: 'Ruth went out to a barley field, to pick up the leftover barley. The kind workers are tossing some to her! Move Ruth, and catch the barley in her basket. Can you catch ten?',
    done: "Ten bunches of barley, and Ruth's basket is full! Now Ruth and Naomi will have bread to eat. Thank You, God!",
    plural: 'bunches of barley', kit: RUTH_GAME,
  },
  // (The game counts to ten, so this visit's activity is reading. The intro fits every level: letter sounds,
  // reading words, finding words.)
  { kind: 'practice', skill: 'reading', title: 'Together Words', decor: '💛', intro: "Ruth and Naomi stayed together, no matter what. Let's play some word games together, too!" },
  // (The game shows Boaz in his field, not yet named: the next visit tells who he is.)
  { kind: 'pause', line: "Ruth is working hard in the barley field. Who is the kind man who owns it? Let's find out next time!" },

  // Visit 2: the adventure
  { kind: 'story', title: 'Kind Boaz', pages: RUTH_STORY_2, first: RUTH_STORY_1.length },
  {
    kind: 'quiz', title: 'Ruth and Naomi Questions',
    questions: [
      {
        say: 'Ruth told Naomi, where you go, I will go. Where did they go together?',
        choices: [{ emoji: '🏘️', say: 'To Bethlehem', art: 'bethlehem' }, { emoji: '🏖️', say: 'To the beach' }, { emoji: '🌙', say: 'To the moon' }],
        answer: 0,
      },
      {
        say: "What did Ruth pick up in Boaz's field?",
        choices: [{ emoji: '🐚', say: 'Seashells' }, { emoji: '🌾', say: 'Barley' }, { emoji: '🍎', say: 'Apples' }],
        answer: 1,
      },
      {
        say: 'What did kind Boaz share with Ruth at lunchtime?',
        choices: [{ emoji: '🍕', say: 'Pizza' }, { emoji: '🍦', say: 'Ice cream' }, { emoji: '🍞', say: 'Bread' }],
        answer: 2,
      },
      {
        say: 'What did God give Ruth and Boaz?',
        choices: [{ emoji: '👶', say: 'A baby boy named Obed', art: 'baby-obed' }, { emoji: '🐫', say: 'A camel' }, { emoji: '⛵', say: 'A boat' }],
        answer: 0,
      },
    ],
  },
  // (The intro fits every level: counting, what comes next, adding. Only counting and adding show the barley, so
  // it doesn't promise any.)
  { kind: 'practice', skill: 'numbers', title: "Ruth's Barley", decor: '🌾', theme: '🌾', intro: "Ruth gathered barley all day long! Now let's play some number games." },
  { kind: 'verse', chunks: RUTH_VERSE.chunks, ref: RUTH_VERSE.ref },
  { kind: 'pause', line: "Munch, munch, crunch! Someone in the barley field is gobbling up all the grain. Who could it be? Let's find out next time!" },

  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story',
    intro: 'Can you tell the story of Ruth and Naomi? Put the pictures in order, from the first to the last!',
    // The story's own pictures (pages counted from one across both parts), one from each place in the story, so no
    // two cards look alike. Each `say` names its picture as a lowercase phrase ("That's <say>.").
    items: [
      { emoji: '🏘️', say: "Naomi's family moving to Moab", art: 'story:ruth:1' },
      { emoji: '🤗', say: 'Ruth hugging Naomi', art: 'story:ruth:5' },
      { emoji: '🌾', say: 'Ruth picking up barley in the field', art: 'story:ruth:7' },
      { emoji: '🍞', say: 'kind Boaz sharing his bread', art: 'story:ruth:8' },
      { emoji: '💐', say: 'Ruth and Boaz getting married', art: 'story:ruth:10' },
      { emoji: '👶', say: 'Naomi holding baby Obed', art: 'story:ruth:11' },
    ],
  },
  { kind: 'battle', foe: 'hopper', intro: 'Oh no! A grumpy grasshopper named Hopper is gobbling up all the barley in the field! Hopper just needs a friend.' },
  { kind: 'song', song: 'song-ruth', intro: "Ruth told Naomi, where you go, I will go! Let's sing Ruth's song. You can sing it on your Ark any time, too." },
  // (A golden bundle of barley, from Boaz's field: 🌾 is drawn as a bundle of grain, art/items/isl-joseph.tsx.)
  { kind: 'reward', pal: 'barley', sticker: '🌾', stickerName: 'golden barley' },
]
