// Lines with changing parts (docs/CLOUD-BRIEF.md, wave 10): a child's name, a Pal's name, a number (0 to 140),
// a letter or a letter's sound. Each is a template, recorded once in parts (before, between and after its slots),
// and the slot is filled from a recording of that name, number, letter or sound (src/voice/stitch.ts).
// A line can be several sentences: each sentence is matched on its own, to a whole recorded line or to one of
// these. Add a template here when a new line with a name or number is written; the studio lists it to record.
//
// Slots: {name} a child's (or anyone in the family's) name, {pal} a Pal's name, {n} a number, {letter} a letter
// (said as its name: "bee"), {sound} a letter's sound (written ⟦b⟧ in the game's lines), {item} a thing's name as
// an activity says it ("the lion", "apples", "the land"), {move} a Pal's move. Items and moves are recorded one
// by one (the game's data has them all: src/voice/grok-list.ts), so their lines stitch instead of falling through.
import { withoutNames } from './nameless'
import type { Role } from './roles'

export type SlotKind = 'name' | 'pal' | 'n' | 'letter' | 'sound' | 'item' | 'move'
export interface Template {
  /** Stable: the recorded parts are kept under it, so don't change it when the words change. */
  id: string
  text: string
  role?: Role
  /** Which queue of the studio it's recorded in, and how often a child hears it (the studio's order). */
  queue: 'praise' | 'prompts' | 'learning' | 'story'
  /** Where it's said, for the printed script. */
  where: string
  /** The same line without the child's name (made below), for when the narrator can't say the name: Grok records it. */
  nameless?: boolean
}

const t = (id: string, text: string, queue: Template['queue'], where: string, role?: Role): Template => ({ id, text, queue, where, ...(role ? { role } : {}) })

export const TEMPLATES: Template[] = [
  // ---- a child's name ----
  t('way-to-go', 'Way to go, {name}!', 'praise', 'praise after a right answer'),
  t('chef', 'Thank you, chef {name}!', 'praise', 'Pal Kitchen, when the dish is eaten'),
  t('hooray-name', 'Hooray, {name}!', 'praise', 'finishing an island'),
  t('hi-name', 'Hi {name}!', 'prompts', 'choosing the first Pal; the Parent Corner voice test'),
  t('treasure-intro', '{pal} wants to go on a treasure hunt with you, {name}!', 'prompts', 'the placement game'),
  t('treasure-end', '{pal} had so much fun with you, {name}.', 'prompts', 'the placement game'),
  t('bday-you', 'It was you, {name}!', 'story', 'the birthday story'),
  t('bday-made', 'God made you, {name}!', 'story', 'the birthday story'),
  t('bday-title', 'Happy Birthday, {name}.', 'story', 'the birthday story: its title'),
  t('bday-happy', 'Happy birthday, {name}!', 'story', 'the birthday story'),
  t('thanks-making', 'Thank you, God, for making {name}!', 'story', 'the birthday party'),
  t('hello-baby', 'Hello, baby {name}!', 'prompts', 'the birthday party'),
  t('has-baby', '{name} has the baby!', 'prompts', 'the birthday party'),

  // ---- a Pal's name ----
  t('pal-hungry', '{pal} is hungry!', 'prompts', 'Pal home and kitchen'),
  t('pal-ready-snack', '{pal} is ready for a snack!', 'prompts', 'Pal kitchen'),
  t('pal-loves-that', '{pal} loves that!', 'prompts', 'Pal home, petting'),
  t('pal-so-happy', '{pal} is so happy!', 'prompts', 'Pal home, petting'),
  t('pal-hug', 'Aww, {pal} wants a hug!', 'prompts', 'Pal home, petting'),
  t('pal-full', '{pal} is full!', 'prompts', 'Pal home, berries'),
  t('pal-full-now', '{pal} is full now.', 'prompts', 'Pal home, berries'),
  t('pal-loves-berries', '{pal} loves berries!', 'prompts', 'Pal home, berries'),
  t('pal-took-off', '{pal} took it off.', 'prompts', 'Pal home, dress-up'),
  t('pal-growing', '{pal} is growing!', 'prompts', 'a Pal grows'),
  t('pal-became', '{pal} became {pal}!', 'prompts', 'a Pal grows'),
  t('its-pal', 'It’s {pal}!', 'prompts', 'an egg hatches'),
  t('pal-joined', '{pal} joined your ark!', 'prompts', 'a new Pal'),
  t('go-pal', 'Go, {pal}!', 'prompts', 'friendly battle'),
  t('pal-dodged', '{pal} dodged it!', 'prompts', 'friendly battle'),
  t('pal-lost-heart', '{pal} lost a heart.', 'prompts', 'friendly battle'),
  t('pal-tired', '{pal} is tired!', 'prompts', 'friendly battle'),
  t('pal-better', '{pal} feels much better!', 'prompts', 'friendly battle'),
  t('who-help', 'Who will help {pal}?', 'prompts', 'friendly battle'),
  t('join-ark', '{pal}, would you like to join our ark?', 'prompts', 'friendly battle'),
  t('pal-glad', '{pal} is so glad to see you again.', 'prompts', 'friendly battle'),
  t('pal-happy-again', '{pal} is happy again!', 'prompts', 'friendly battle'),
  t('pal-happy-see', '{pal} is so happy to see you again!', 'prompts', 'finishing an island again'),
  t('shade-making', 'Grumbleshade is making {pal} grumpy.', 'prompts', 'friendly battle', 'shade'),
  t('cloud-making', 'A little grumpy cloud is making {pal} grumpy.', 'prompts', 'friendly battle', 'shade'),
  t('color-pal', 'Let’s color {pal}!', 'prompts', 'coloring page'),
  t('you-chose', 'You chose {pal}!', 'prompts', 'choosing the first Pal'),

  // ---- numbers ----
  t('n', '{n}', 'learning', 'counting (kitchen, two by two)'),
  t('n-dot', '{n}.', 'learning', 'counting'),
  t('n-bang', '{n}!', 'learning', 'a number answer'),
  t('oclock-bang', '{n} o’clock!', 'learning', 'telling time'),
  t('half-past-bang', 'half past {n}!', 'learning', 'telling time'),
  t('which-clock', 'Which clock shows {n} o’clock?', 'learning', 'telling time'),
  t('which-clock-half', 'Which clock shows half past {n}?', 'learning', 'telling time'),
  t('make-clock', 'Make the clock say {n} o’clock!', 'learning', 'setting the clock'),
  t('turn-to', 'Turn the short hand to {n} o’clock!', 'learning', 'setting the clock'),
  t('cents-bang', '{n} cents!', 'learning', 'coins'),
  t('cent-bang', '{n} cent!', 'learning', 'coins'),
  t('seq', '{n}, {n}, {n}.', 'learning', 'what number comes next'),
  t('plus', '{n} plus {n}.', 'learning', 'adding'),
  t('plus-q', '{n} plus {n}?', 'learning', 'adding'),
  t('take-away', '{n} take away {n}.', 'learning', 'taking away'),
  t('take-away-q', '{n} take away {n}?', 'learning', 'taking away'),
  t('tens-ones', '{n} tens and {n} ones.', 'learning', 'tens and ones'),
  t('ten-ones', '{n} ten and {n} ones.', 'learning', 'tens and ones'),
  t('tens-one', '{n} tens and {n} one.', 'learning', 'tens and ones'),
  t('ten-one', '{n} ten and {n} one.', 'learning', 'tens and ones'),
  t('which-shows', 'Which one shows {n}?', 'learning', 'tens and ones'),
  t('hop-forward', 'Hop forward {n} times!', 'learning', 'the number line'),
  t('hop-back', 'Hop back {n} times!', 'learning', 'the number line'),
  t('thats-n', 'That’s {n}.', 'prompts', 'Pal kitchen'),
  t('need-n', 'We need {n}.', 'prompts', 'Pal kitchen'),
  t('oops-thats-n', 'Oops, that’s {n}.', 'prompts', 'Pal kitchen'),
  t('stir', 'Stir it round and round, {n} times!', 'prompts', 'Pal kitchen'),
  t('candles', 'Put {n} candles on the cake!', 'prompts', 'birthday cake'),
  t('candles-bang', '{n} candles!', 'prompts', 'birthday cake'),

  // ---- letters and their sounds ----
  t('starts-with', 'Which picture starts with the {sound} sound, like the letter {letter}?', 'learning', 'beginning sounds'),
  t('trace-big', 'Now trace the big {letter}!', 'prompts', 'tracing letters'),
  t('trace-little', 'Now trace the little {letter}!', 'prompts', 'tracing letters'),
  t('trace-big-finger', 'Trace the big {letter} with your finger!', 'prompts', 'tracing letters'),
  t('trace-little-finger', 'Trace the little {letter} with your finger!', 'prompts', 'tracing letters'),
  t('thats-big', 'That’s the big {letter}!', 'prompts', 'tracing letters'),
  t('thats-little', 'That’s the little {letter}!', 'prompts', 'tracing letters'),
  t('letter-says', '{letter} says {sound}!', 'prompts', 'tracing letters'),
  // (the word builder: a letter tile's sound, and the word put together from its sounds)
  t('sound-alone', '{sound}', 'learning', 'word builder: a letter tile, tapped or placed'),
  t('blend-3', '{sound}, {sound}, {sound}: {item}!', 'learning', 'word builder: the word, sound by sound'),

  // ---- things, by name ----
  t('where-does', 'Where does {item} go?', 'prompts', 'sorting'),
  t('thats-right-item', 'That’s right, {item}!', 'prompts', 'sorting'),
  t('you-found', 'You found {item}!', 'prompts', 'mazes'),
  t('maze-tap', 'Tap a glowing square next to {item}, or drag {item} along!', 'prompts', 'mazes'),
  t('thats-item', 'That’s {item}.', 'prompts', 'putting things in order'),
  t('item-bang', '{item}!', 'prompts', 'building, ordering, the map'),
  t('drag-here', 'Drag {item} here!', 'prompts', 'building'),
  t('spot-for', 'Here is the spot for {item}!', 'prompts', 'building'),
  t('first-item', 'First {item}!', 'prompts', 'building'),
  t('give-one', 'Give one to {item}!', 'prompts', 'sharing'),
  t('put-in', 'Put {n} {item} in {item}!', 'prompts', 'counting into a basket'),
  t('drag-into', 'Drag it into {item}!', 'prompts', 'counting into a basket'),
  t('take-out-of', 'Take some out of {item}.', 'prompts', 'counting into a basket'),
  t('n-items-bang', '{n} {item}!', 'prompts', 'counting'),
  t('put-in-bowl', 'Put {n} {item} in the bowl!', 'prompts', 'Pal kitchen'),
  t('drag-the', 'Drag the {item} into the bowl!', 'prompts', 'Pal kitchen'),
  t('jar-says', 'Find the jar that says {item}!', 'prompts', 'Pal kitchen'),
  t('one-says', 'That one says {item}.', 'prompts', 'Pal kitchen'),
  t('cut-into', 'Cut the {item} into {item}!', 'prompts', 'Pal kitchen'),
  t('that-makes', 'That makes {item}.', 'prompts', 'Pal kitchen'),
  t('slide-into', 'Slide the {item} into the oven!', 'prompts', 'Pal kitchen'),
  t('the-is-ready', 'The {item} is ready!', 'prompts', 'Pal kitchen'),
  t('the-are-ready', 'The {item} are ready!', 'prompts', 'Pal kitchen'),
  t('give-it-to', 'Give it to {pal}!', 'prompts', 'Pal kitchen'),
  t('give-them-to', 'Give them to {pal}!', 'prompts', 'Pal kitchen'),
  t('pal-loves-item', '{pal} loves {item}!', 'prompts', 'Pal kitchen'),
  t('lets-cook', 'Let’s cook {item}, {pal}’s favorite!', 'prompts', 'Pal kitchen'),
  t('pal-would-love', '{pal} would love some {item}.', 'prompts', 'Pal home'),
  t('pal-looks-great', '{pal} looks great in the {item}!', 'prompts', 'Pal home, dress-up'),
  t('says-oclock', 'That says {n} o’clock.', 'learning', 'setting the clock'),
  t('cents-dot', '{n} cents.', 'learning', 'paying with coins'),
  t('your-back', 'Here is your {item} back.', 'learning', 'paying with coins'),
  t('landed-on', 'You landed on {n}!', 'learning', 'the number line'),
  t('everyone-has', 'Everyone has {n}!', 'prompts', 'sharing'),
  t('item-coming-soon', '{item} is coming soon!', 'prompts', 'the map'),
  t('finish-first', 'Finish {item} first, then sail here!', 'prompts', 'the map'),

  // ---- moves ----
  t('pal-used', '{pal} used {move}!', 'prompts', 'friendly battle'),
  t('learned-super', '{pal} learned a super move: {move}!', 'prompts', 'a Pal grows'),
  t('learned-brave', '{pal} learned a brave move: {move}!', 'prompts', 'friendly battle'),
  t('knows-new', '{pal} knows a new move: {move}!', 'prompts', 'friendly battle'),
  t('knows-two-new', '{pal} knows a new move: {move} and {move}!', 'prompts', 'friendly battle'),
  t('charge-one', 'Answer {n} more question right on the first try to charge {move}!', 'prompts', 'friendly battle'),
  t('charge-many', 'Answer {n} more questions right on the first try to charge {move}!', 'prompts', 'friendly battle'),
  t('win-to-learn', 'Win a friendly battle, and {pal} will learn {move}!', 'prompts', 'friendly battle'),
  t('grow-to-learn', 'When {pal} grows, {pal} will learn {move}!', 'prompts', 'friendly battle'),

  // ---- the birthday party ----
  t('sing-to', 'Let’s sing Happy Birthday to {name}!', 'prompts', 'the birthday party'),
  t('dear-name', 'Happy birthday, dear {name}!', 'prompts', 'the birthday party'),
]

// Each line with a child's name, also without it (./nameless.ts): "Way to go, {name}!" -> "Way to go!". When the
// narrator can't say a name (not in the library, not recorded by the family), lib/speech.ts says the line this way
// instead of handing all of it to the device's own voice. A line that's about the name ("{name} has the baby!")
// has no such twin.
const SOMEONE = 'Qzxsomeone'
for (const tpl of [...TEMPLATES]) {
  if (!tpl.text.includes('{name}')) continue
  const text = withoutNames(tpl.text.replaceAll('{name}', SOMEONE), [SOMEONE])
  if (text && !TEMPLATES.some((x) => x.text === text)) TEMPLATES.push({ ...tpl, id: `${tpl.id}~noname`, text, nameless: true })
}

const SLOT = /\{(name|pal|n|letter|sound|item|move)\}/g

/** A template's pieces in order: its fixed words (kept even when only punctuation) and its slots. */
export function pieces(text: string): ({ said: string } | { slot: SlotKind })[] {
  const out: ({ said: string } | { slot: SlotKind })[] = []
  let at = 0
  for (const m of text.matchAll(SLOT)) {
    out.push({ said: text.slice(at, m.index) })
    out.push({ slot: m[1] as SlotKind })
    at = m.index! + m[0].length
  }
  out.push({ said: text.slice(at) })
  return out
}

/** Whether fixed words are recorded (they have something to say, not just punctuation). */
export const hasWords = (s: string) => /[\p{L}\p{N}]/u.test(s)

/** A template's parts that are recorded: [index among its fixed pieces, the words]. */
export function recordedParts(tpl: Template): [number, string][] {
  return pieces(tpl.text).filter((p): p is { said: string } => 'said' in p).map((p, i) => [i, p.said.trim()] as [number, string]).filter(([, s]) => hasWords(s))
}
