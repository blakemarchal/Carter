// Big words (docs/GAME-PLAN.md, the learning wave of Oct 2026): one word worth knowing from each story part,
// taught three ways. Before the story, a card says the word and what it means ("Big word! Jealous. Jealous means
// wanting what someone else has. Listen for it in the story!"); in the pages it's lit up, and a tap says its
// meaning again; later the "Remember?" round asks what it means (learn/remember.ts), reading the three answers
// in order (the pictures are reminders), so the answers stay in the order written here and `answer` moves around.
// BIG_WORDS[island][k] goes with the island's k-th story step, and a test checks the word is in those pages.
export interface BigWord {
  /** The word as the card shows it (its base form). */
  word: string
  /** What the pages are searched for, when it isn't the word itself ("forg" lights up "forgave" and "forgives"). */
  root?: string
  emoji: string
  /** Its meaning as a sentence, said on the card and when the word is tapped. */
  means: string
  /** Three short meanings for the round's question, one of them right. */
  choices: { emoji: string; say: string }[]
  answer: number
}

const w = (word: string, emoji: string, means: string, choices: [string, string][], answer: number, root?: string): BigWord =>
  ({ word, emoji, means, choices: choices.map(([emoji, say]) => ({ emoji, say })), answer, ...(root ? { root } : {}) })

export const BIG_WORDS: Record<string, BigWord[]> = {
  noah: [
    w('obey', '🙏', 'Obey means doing what you are told.', [['🙏', 'doing what you are told'], ['🏃', 'running away'], ['😴', 'taking a nap']], 0),
    w('promise', '🌈', 'A promise is saying you will do something, and then doing it.', [['🍪', 'a kind of cookie'], ['🌈', 'saying you will do something, and doing it'], ['🎈', 'a big balloon']], 1),
  ],
  creation: [
    w('beginning', '🌅', 'The beginning is the very first part of something.', [['🏁', 'the very last part of something'], ['🌅', 'the very first part of something'], ['🍕', 'a slice of pizza']], 1),
    w('wonderfully', '✨', 'Wonderfully means in a very good and special way.', [['✨', 'in a very good and special way'], ['😢', 'in a sad way'], ['🐌', 'very slowly']], 0),
  ],
  david: [
    w('shepherd', '🐑', 'A shepherd is someone who takes care of sheep.', [['🍞', 'someone who bakes bread'], ['👑', "a king's crown"], ['🐑', 'someone who takes care of sheep']], 2),
    w('trust', '🙏', 'Trust means believing someone will help you.', [['🙏', 'believing someone will help you'], ['🏃', 'running very fast'], ['🍎', 'eating an apple']], 0),
  ],
  jonah: [
    w('swallow', '🐋', 'Swallow means to take something down into your tummy in one gulp.', [['🎨', 'to paint a picture'], ['🐋', 'to take something down into your tummy in one gulp'], ['🐦', 'to fly away like a bird']], 1),
    w('forgive', '🤗', 'Forgive means to stop being upset with someone who said sorry.', [['😡', 'to stay cross forever'], ['🏃', 'to run away'], ['🤗', 'to stop being upset with someone who said sorry']], 2, 'forg'),
  ],
  loaves: [
    w('crowd', '👥', 'A crowd is a great big group of people.', [['👥', 'a great big group of people'], ['🐟', 'a little fish'], ['🏠', 'a tiny house']], 0),
    w('leftovers', '🧺', 'Leftovers are the food that is still there when everyone is full.', [['🩴', 'sandals that are too big'], ['🧺', 'the food that is still there when everyone is full'], ['🎵', 'a happy song']], 1, 'leftover'),
  ],
  christmas: [
    w('angel', '👼', 'An angel is a messenger God sends from heaven.', [['🐑', 'a baby sheep'], ['🎁', 'a shiny present'], ['👼', 'a messenger God sends from heaven']], 2),
    w('Savior', '💝', 'A Savior is someone who comes to rescue us.', [['💝', 'someone who comes to rescue us'], ['🍲', 'someone who cooks soup'], ['🚌', 'someone who drives a bus']], 0),
  ],
  abraham: [
    w('believe', '⭐', 'Believe means being sure that what someone says is true.', [['🏃', 'running in a race'], ['⭐', 'being sure that what someone says is true'], ['😴', 'falling asleep']], 1, 'believ'),
    w('laughter', '😂', 'Laughter is the happy sound you make when something is funny.', [['😢', 'the sound of crying'], ['🌧️', 'the sound of rain'], ['😂', 'the happy sound you make when something is funny']], 2),
  ],
  joseph: [
    w('jealous', '😠', 'Jealous means wanting what someone else has.', [['😠', 'wanting what someone else has'], ['😴', 'feeling very sleepy'], ['🎉', 'having a party']], 0),
    w('storehouse', '🏚️', 'A storehouse is a big building where food is kept safe.', [['🚌', 'a big bus'], ['🏚️', 'a big building where food is kept safe'], ['🎩', 'a tall hat']], 1),
  ],
  'red-sea': [
    w('chariot', '🐎', 'A chariot is a cart with wheels that horses pull fast.', [['⛵', 'a little boat'], ['🏠', 'a big house'], ['🐎', 'a cart with wheels that horses pull fast']], 2),
    w('tambourine', '🪘', 'A tambourine is a little drum with jingles that you shake.', [['🪘', 'a little drum with jingles that you shake'], ['🍇', 'a bunch of grapes'], ['🐻', 'a teddy bear']], 0),
  ],
  daniel: [
    w('trick', '🎭', 'Trick means fooling someone to get your way.', [['🎁', 'giving a present'], ['🎭', 'fooling someone to get your way'], ['🛏️', 'going to bed']], 1),
    w('den', '🦁', 'A den is the home where wild animals sleep.', [['🌊', 'the deep blue sea'], ['⛺', 'a camping tent'], ['🦁', 'the home where wild animals sleep']], 2),
  ],
  'baby-moses': [
    w('reed', '🌾', 'A reed is tall grass that grows by the water.', [['🌾', 'tall grass that grows by the water'], ['📖', 'a book to read'], ['🧱', 'a red brick']], 0),
    w('princess', '👸', "A princess is a king's daughter.", [['🐸', 'a green frog'], ['👸', "a king's daughter"], ['🎂', 'a birthday cake']], 1),
  ],
  'burning-bush': [
    w('desert', '🏜️', 'A desert is a hot, dry land with lots of sand.', [['🍦', 'a sweet ice cream'], ['🌊', 'the deep blue sea'], ['🏜️', 'a hot, dry land with lots of sand']], 2),
    w('holy', '✨', 'Holy means special, because it belongs to God.', [['✨', 'special, because it belongs to God'], ['🧀', 'full of holes'], ['🥶', 'very cold']], 0),
  ],
  manna: [
    w('grumble', '😤', 'Grumble means complaining in a grumpy voice.', [['🎵', 'singing a song'], ['😤', 'complaining in a grumpy voice'], ['😴', 'snoring']], 1, 'grumbl'),
    w('spoil', '🤢', 'Spoil means to go bad, so it cannot be eaten.', [['🎁', 'to wrap a present'], ['🏃', 'to run fast'], ['🤢', 'to go bad, so it cannot be eaten']], 2),
  ],
  jericho: [
    w('priest', '🕯️', 'A priest is a helper who leads people to worship God.', [['🕯️', 'a helper who leads people to worship God'], ['🐘', 'a big gray animal'], ['🚌', 'a big bus']], 0),
    w('trumpet', '🎺', 'A trumpet is a horn you blow to make a loud sound.', [['🥁', 'a drum you hit with sticks'], ['🎺', 'a horn you blow to make a loud sound'], ['🎵', 'a song you sing']], 1),
  ],
  ruth: [
    w('harvest', '🌾', 'Harvest is the time when the food in the fields is ready to pick.', [['❄️', 'the time when snow falls'], ['🌙', 'the time when we go to bed'], ['🌾', 'the time when the food in the fields is ready to pick']], 2),
    w('barley', '🍞', 'Barley is a grain that is made into bread.', [['🍞', 'a grain that is made into bread'], ['🐑', 'a woolly animal'], ['🎈', 'a red balloon']], 0),
  ],
  samuel: [
    w('pray', '🙏', 'Pray means talking to God.', [['🏃', 'running a race'], ['🙏', 'talking to God'], ['🎨', 'painting a picture']], 1),
    w('listen', '👂', 'Listen means paying attention with your ears.', [['👀', 'looking with your eyes'], ['🥄', 'eating with a spoon'], ['👂', 'paying attention with your ears']], 2),
  ],
  elijah: [
    w('raven', '🐦', 'A raven is a big black bird.', [['🐦', 'a big black bird'], ['🐟', 'a little fish'], ['🌸', 'a pink flower']], 0),
    w('altar', '🪨', 'An altar is a special table of stones for giving gifts to God.', [['🛏️', 'a cozy bed'], ['🪨', 'a special table of stones for giving gifts to God'], ['🚲', 'a fast bike']], 1),
  ],
  esther: [
    w('cousin', '👫', 'A cousin is the child of your aunt or uncle.', [['🐶', 'a puppy'], ['🍪', 'a cookie'], ['👫', 'the child of your aunt or uncle']], 2),
    w('brave', '🦁', 'Brave means doing the right thing even when you are afraid.', [['🦁', 'doing the right thing even when you are afraid'], ['😴', 'feeling sleepy'], ['🍦', 'eating ice cream']], 0),
  ],
  'boy-jesus': [
    w('feast', '🍽️', 'A feast is a big, happy meal to celebrate.', [['🏃', 'a long run'], ['🍽️', 'a big, happy meal to celebrate'], ['📖', 'a big book']], 1),
    w('amazed', '😮', 'Amazed means so surprised that your mouth falls open.', [['😡', 'very cross'], ['😴', 'very sleepy'], ['😮', 'so surprised that your mouth falls open']], 2, 'amaz'),
  ],
  fishers: [
    w('net', '🕸️', 'A net is a big web of rope for catching fish.', [['🕸️', 'a big web of rope for catching fish'], ['🎩', 'a hat'], ['🛏️', 'a bed']], 0),
    w('follow', '👣', 'Follow means to go where someone goes.', [['🪨', 'to sit still like a stone'], ['👣', 'to go where someone goes'], ['😴', 'to go to sleep']], 1),
  ],
  storm: [
    w('cushion', '🛋️', 'A cushion is a soft pillow.', [['🪨', 'a hard rock'], ['🍎', 'a crunchy apple'], ['🛋️', 'a soft pillow']], 2),
    w('calm', '😌', 'Calm means quiet and still, with no wind or waves.', [['😌', 'quiet and still, with no wind or waves'], ['💥', 'loud and wild'], ['🏃', 'fast and busy']], 0),
  ],
  'lost-sheep': [
    w('sheepfold', '🏡', 'A sheepfold is a safe pen where sheep sleep.', [['🚌', 'a big bus'], ['🏡', 'a safe pen where sheep sleep'], ['⛺', 'a camping tent']], 1),
    w('celebrate', '🎉', 'Celebrate means having a happy party because something good happened.', [['😢', 'crying because you are sad'], ['😴', 'sleeping all day'], ['🎉', 'having a happy party because something good happened']], 2),
  ],
  samaritan: [
    w('robber', '🦹', 'A robber is someone who takes things that are not theirs.', [['🦹', 'someone who takes things that are not theirs'], ['🩹', 'someone who helps sick people'], ['🍲', 'someone who cooks soup']], 0),
    w('neighbor', '🏘️', 'A neighbor is anyone who needs our help.', [['🐴', 'a horse'], ['🏘️', 'anyone who needs our help'], ['🌧️', 'a rainy day']], 1),
  ],
  zacchaeus: [
    w('sycamore', '🌳', 'A sycamore is a big tree with wide branches.', [['🍌', 'a yellow banana'], ['🚲', 'a bicycle'], ['🌳', 'a big tree with wide branches']], 2),
    w('poor', '🪙', 'Poor means having very little money or food.', [['🪙', 'having very little money or food'], ['👑', "wearing a king's crown"], ['🎂', 'eating lots of cake']], 0),
  ],
  'palm-sunday': [
    w('village', '🛖', 'A village is a very small town.', [['🏙️', 'a great big city'], ['🛖', 'a very small town'], ['⛵', 'a big boat']], 1),
    w('Hosanna', '🌴', 'Hosanna is a happy shout that praises God.', [['😡', 'a cross word'], ['🥱', 'a sleepy yawn'], ['🌴', 'a happy shout that praises God']], 2),
  ],
  easter: [
    w('tomb', '🪨', 'A tomb is a little cave where someone is laid after they die.', [['🪨', 'a little cave where someone is laid after they die'], ['🏠', 'a cozy house'], ['⛺', 'a big tent']], 0),
    w('alive', '🌱', 'Alive means living and growing.', [['🪨', 'still, like a stone'], ['🌱', 'living and growing'], ['❄️', 'cold, like snow']], 1),
  ],
  pentecost: [
    w('Helper', '✨', 'The Helper is the Holy Spirit, who God sends to be with us.', [['🔑', 'a key'], ['🚌', 'a big bus'], ['✨', 'the Holy Spirit, who God sends to be with us']], 2),
    w('language', '🗣️', 'A language is the words people speak in a country.', [['🗣️', 'the words people speak in a country'], ['🍕', 'a kind of pizza'], ['🏃', 'a running race']], 0),
  ],
}

/** Every big word, by word (for the "Remember?" round). */
export const bigWordByName = (word: string): BigWord | undefined => Object.values(BIG_WORDS).flat().find((b) => b.word === word)

/** The word with a capital, as the card shows it. */
export const capital = (s: string) => s[0].toUpperCase() + s.slice(1)

/** What the card says before the story. */
export const cardLine = (b: BigWord) => `Big word! ${capital(b.word)}. ${b.means} Listen for it in the story!`

/** The round's question: the word, then the three meanings in order. */
export function meaningSay(b: BigWord): string {
  const [a, c, d] = b.choices.map((x) => x.say)
  return `What does ${b.word} mean? ${capital(a)}, ${c}, or ${d}?`
}

/** A pattern that finds the word (and its forms: "obeyed", "promises") in a page's text. */
export const wordPattern = (b: BigWord) => new RegExp(`\\b(${b.root ?? b.word})\\w*`, 'gi')

/** Every line the big words say, for the voice script: the cards, the meanings, the round's questions and answers. */
export function bigWordLines(): string[] {
  const out = new Set<string>()
  for (const b of Object.values(BIG_WORDS).flat()) {
    out.add(cardLine(b))
    out.add(b.means)
    out.add(meaningSay(b))
    for (const c of b.choices) out.add(`${c.say}!`)
  }
  return [...out]
}
