// Reading questions beyond the first five levels (docs/GAME-PLAN.md §4): rhyming, word families,
// short sentences to read, and tiny stories with a question.
// Every sentence, story and prompt is in the lists below (narration is recorded ahead of time).
// A sentence is never read aloud for her: she reads it, and taps any word to hear just that word.
import { useState } from 'react'
import type { Choice, Question } from '../../lib/questions'
import { build } from '../../lib/questions'
import { pick, shuffle } from '../../lib/util'
import type { PalDef } from '../../data/pals'
import Pic from '../../components/Pic'
import { itemById } from '../../art/items'
import PalArt from '../../components/PalArt'
import type { LearnView } from '../types'
import './reading.css'

// ---------- Data ----------

/**
 * Rhyming families for level 2, each a word and the drawn item that shows it. Only true rhymes with
 * clear pictures. (No rat: it looks like a mouse, and mouse rhymes with house.)
 */
export const RHYMES: Record<string, [word: string, art: string][]> = {
  at: [['cat', 'cat'], ['hat', 'top-hat'], ['bat', 'bat']],
  og: [['dog', 'dog'], ['frog', 'frog']],
  ee: [['bee', 'bee'], ['tree', 'tree']],
  ar: [['star', 'star'], ['jar', 'jar']],
  ake: [['cake', 'cake'], ['snake', 'snake']],
  ox: [['fox', 'fox'], ['box', 'box']],
  oat: [['goat', 'goat'], ['boat', 'sailboat']],
  ouse: [['mouse', 'mouse'], ['house', 'house']],
  oon: [['moon', 'moon'], ['balloon', 'balloon']],
}

/**
 * Word families for level 6. The first two words of each are the examples shown and said
 * ("Cat and hat are in the same family"); the rest are the words she finds.
 */
export const FAMILIES: Record<string, string[]> = {
  at: ['cat', 'hat', 'bat', 'mat', 'rat', 'sat', 'pat'],
  an: ['can', 'man', 'fan', 'pan', 'ran', 'van'],
  ap: ['cap', 'map', 'nap', 'tap', 'lap'],
  ig: ['pig', 'big', 'dig', 'wig', 'fig'],
  in: ['pin', 'win', 'bin', 'fin', 'tin'],
  ip: ['zip', 'lip', 'dip', 'hip', 'sip', 'tip'],
  op: ['hop', 'top', 'mop', 'pop'],
  ot: ['hot', 'pot', 'dot', 'not', 'got', 'lot'],
  og: ['dog', 'log', 'fog', 'jog'],
  un: ['sun', 'fun', 'bun', 'run'],
  ug: ['bug', 'hug', 'mug', 'rug', 'jug', 'tug'],
  en: ['hen', 'ten', 'pen', 'men', 'den'],
  et: ['pet', 'net', 'jet', 'wet', 'get', 'vet', 'set'],
  ed: ['bed', 'red', 'fed', 'led'],
}

/** A sentence to read and the picture it tells (levels 7–8). Pictures are art item ids (art/items/learn-reading.tsx). */
interface SentencePic { text: string; right: string; wrong: [string, string] }
export const SENTENCES: SentencePic[] = [
  { text: 'The cat is on the bed.', right: 'rd-cat-on-bed', wrong: ['rd-dog-on-bed', 'rd-cat-in-box'] },
  { text: 'The dog is in the box.', right: 'rd-dog-in-box', wrong: ['rd-cat-in-box', 'rd-dog-on-bed'] },
  { text: 'The pig is in the mud.', right: 'rd-pig-in-mud', wrong: ['rd-pig-in-tub', 'rd-hen-in-mud'] },
  { text: 'The pig is in the tub.', right: 'rd-pig-in-tub', wrong: ['rd-pig-in-mud', 'rd-dog-in-tub'] },
  { text: 'The hen is on the box.', right: 'rd-hen-on-box', wrong: ['rd-hen-in-box', 'rd-cat-on-box'] },
  { text: 'The hen is in the box.', right: 'rd-hen-in-box', wrong: ['rd-hen-on-box', 'rd-hen-in-mud'] },
  { text: 'The cat sat on the mat.', right: 'rd-cat-on-mat', wrong: ['rd-dog-on-mat', 'rd-cat-on-bed'] },
  { text: 'The dog sat on the mat.', right: 'rd-dog-on-mat', wrong: ['rd-dog-on-bed', 'rd-cat-on-mat'] },
  { text: 'The frog is on the log.', right: 'rd-frog-on-log', wrong: ['rd-duck-on-log', 'rd-frog-in-tub'] },
  { text: 'A bug is on the bed.', right: 'rd-bug-on-bed', wrong: ['rd-bug-on-log', 'rd-frog-on-bed'] },
  { text: 'I see two cats.', right: 'rd-cats-2', wrong: ['cat', 'rd-dogs-2'] },
  { text: 'I see two hens.', right: 'rd-hens-2', wrong: ['rd-hens-3', 'rd-pigs-2'] },
  { text: 'I see three pigs.', right: 'rd-pigs-3', wrong: ['rd-pigs-2', 'rd-hens-3'] },
  { text: 'A hen is by a pig.', right: 'rd-hen-pig', wrong: ['rd-hen-dog', 'rd-cat-pig'] },
  { text: 'A dog is by a frog.', right: 'rd-dog-frog', wrong: ['rd-duck-frog', 'rd-cat-dog'] },
  { text: 'The dog has a ball.', right: 'rd-dog-ball', wrong: ['rd-cat-ball', 'rd-dog-hat'] },
  { text: 'The cat has a hat.', right: 'rd-cat-hat', wrong: ['rd-dog-hat', 'rd-cat-ball'] },
  { text: 'The duck is in the tub.', right: 'rd-duck-in-tub', wrong: ['rd-duck-on-log', 'rd-frog-in-tub'] },
  { text: 'The fox is in the box.', right: 'rd-fox-in-box', wrong: ['rd-fox-on-box', 'rd-dog-in-box'] },
  { text: 'The dog is in the mud.', right: 'rd-dog-in-mud', wrong: ['rd-dog-in-tub', 'rd-pig-in-mud'] },
]

/** An answer: a word to read (`word`), or a picture (`art`, an item id) with what's said for it. */
type Ans = { word: string } | { art: string; say: string }
/** A sentence or tiny story and one question about it (levels 9–10). The first answer is the right one. */
interface ReadAsk {
  lines: string[]
  ask: string
  answers: [Ans, Ans, Ans]
  /** A Pal to show beside a story (only where the picture doesn't give the answer away). */
  pal?: PalDef['species']
}

const w = (word: string): Ans => ({ word })
const p = (art: string, say: string): Ans => ({ art, say })

export const READ_AND_ANSWER: ReadAsk[] = [
  { lines: ['Pip has a red hat.'], ask: 'What color is the hat?', answers: [w('red'), w('blue'), w('green')] },
  { lines: ['The dog is in the box.'], ask: 'Where is the dog?', answers: [p('box', 'in the box'), p('bed', 'on the bed'), p('rd-tub', 'in the tub')] },
  { lines: ['Zippy can hop.'], ask: 'What can Zippy do?', answers: [w('hop'), w('run'), w('sit')] },
  { lines: ['The cat sat on the mat.'], ask: 'Who sat on the mat?', answers: [p('cat', 'the cat'), p('dog', 'the dog'), p('pig', 'the pig')] },
  { lines: ['I see two pigs.'], ask: 'How many pigs?', answers: [w('2'), w('1'), w('3')] },
  { lines: ['The sun is hot.'], ask: 'What is hot?', answers: [p('sun', 'the sun'), p('moon', 'the moon'), p('tree', 'the tree')] },
  { lines: ['Pebble has a big ball.'], ask: 'What does Pebble have?', answers: [p('ball', 'a ball'), p('top-hat', 'a hat'), p('cup', 'a cup')] },
  { lines: ['Dad and I got on the bus.'], ask: 'What did we get on?', answers: [p('bus', 'the bus'), p('sailboat', 'a boat'), p('bike', 'a bike')] },
  { lines: ['We sing a song to God.'], ask: 'Who do we sing to?', answers: [w('God'), w('the dog'), w('the bus')] },
  { lines: ['The frog is green.'], ask: 'What color is the frog?', answers: [w('green'), w('red'), w('blue')] },
  { lines: ['The hen sat on ten eggs.'], ask: 'How many eggs?', answers: [w('10'), w('6'), w('3')] },
  { lines: ['Nova can see the moon.'], ask: 'What can Nova see?', answers: [p('moon', 'the moon'), p('sun', 'the sun'), p('rainbow', 'a rainbow')] },
  { lines: ['Ember ran to the tree.'], ask: 'Where did Ember run?', answers: [p('tree', 'to the tree'), p('house', 'to the house'), p('tent', 'to the tent')] },
  { lines: ['A bug is in the cup.'], ask: 'What is in the cup?', answers: [p('caterpillar', 'a bug'), p('frog', 'a frog'), p('fish', 'a fish')] },
  { lines: ['Mom got a cake.'], ask: 'What did Mom get?', answers: [p('cake', 'a cake'), p('pizza', 'a pizza'), p('apple', 'an apple')] },
  { lines: ['The fox hid in the den.'], ask: 'Where did the fox hide?', answers: [w('den'), w('bed'), w('box')] },
]

export const TINY_STORIES: ReadAsk[] = [
  { lines: ['Pip got a new hat.', 'Pip put it on.', 'Pip is glad.'], ask: 'What did Pip get?', pal: 'dove',
    answers: [p('top-hat', 'a hat'), p('ball', 'a ball'), p('cup', 'a cup')] },
  { lines: ['Zippy ran to the pond.', 'Zippy saw a frog.', 'The frog went hop!'], ask: 'What did Zippy see?', pal: 'mouse',
    answers: [p('frog', 'a frog'), p('fish', 'a fish'), p('duck', 'a duck')] },
  { lines: ['Mom made a cake.', 'Dad said, yum!', 'We all had some.'], ask: 'What did Mom make?',
    answers: [p('cake', 'a cake'), p('pizza', 'a pizza'), p('soup', 'soup')] },
  { lines: ['The hen sat on her egg.', 'Tap, tap, pop!', 'Out came a chick.'], ask: 'What came out of the egg?',
    answers: [p('chick', 'a chick'), p('duck', 'a duck'), p('frog', 'a frog')] },
  { lines: ['Ember and Pebble got a ball.', 'Ember kicks it.', 'Pebble gets it.'], ask: 'What did they play with?', pal: 'dragon',
    answers: [p('ball', 'a ball'), p('box', 'a box'), p('top-hat', 'a hat')] },
  { lines: ['It is bed time.', 'Nova is in bed.', 'Nova can see the moon.'], ask: 'What can Nova see?', pal: 'cat',
    answers: [p('moon', 'the moon'), p('sun', 'the sun'), p('rainbow', 'a rainbow')] },
  { lines: ['The dog dug in the mud.', 'Now the dog is a mess!', 'Mom gets the tub.'], ask: 'Where did the dog dig?',
    answers: [p('rd-mud', 'in the mud'), p('rd-tub', 'in the tub'), p('rd-mat', 'on the mat')] },
  { lines: ['It is time to eat.', 'We fold our hands.', 'We thank God for our food.'], ask: 'Who do we thank for our food?',
    answers: [w('God'), w('the cat'), w('the bus')] },
  { lines: ['Huffy is mad.', 'Huffy takes a big, deep breath.', 'Now Huffy is glad.'], ask: 'How does Huffy feel at the end?',
    answers: [w('glad'), w('mad'), w('sad')] },
  { lines: ['Bubbles is a big whale.', 'Bubbles can swim fast.', 'Bubbles blows bubbles, pop, pop!'], ask: 'What is Bubbles?',
    answers: [p('whale', 'a whale'), p('fish', 'a fish'), p('duck', 'a duck')] },
  { lines: ['Rumble is a little cloud.', 'Rumble made rain on the hill.', 'Then came a rainbow!'], ask: 'What came after the rain?', pal: 'cloud',
    answers: [p('rainbow', 'a rainbow'), p('sun', 'the sun'), p('moon', 'the moon')] },
  { lines: ['Sam has a bug in a jar.', 'The bug is red with dots.', 'Sam lets it go.'], ask: 'Which bug is in the jar?',
    answers: [p('ladybug', 'a ladybug'), p('ant', 'an ant'), p('bee', 'a bee')] },
  { lines: ['Dad and I get on the bus.', 'The bus is big and red.', 'We go to see Gran.'], ask: 'What do Dad and I get on?',
    answers: [p('bus', 'the bus'), p('bike', 'a bike'), p('sailboat', 'a boat')] },
  { lines: ['The cat is in a box.', 'The dog is on the bed.', 'The pig is in the mud.'], ask: 'Who is on the bed?',
    answers: [p('dog', 'the dog'), p('cat', 'the cat'), p('pig', 'the pig')] },
  { lines: ['Pip sat in the sun.', 'A bee came by.', 'Pip said, hi, bee!'], ask: 'Who came by?', pal: 'dove',
    answers: [p('bee', 'a bee'), p('frog', 'a frog'), p('duck', 'a duck')] },
]

// ---------- Helpers ----------

// One-letter words are unclear alone ("a" can sound like "uh"), as in lib/questions.ts.
const CARRIER: Record<string, string> = { a: 'a, like a cat', i: 'I, like I love you' }
/** What's said when she taps a word: the word without its punctuation. */
export const wordSay = (word: string) => {
  const bare = word.replace(/[^A-Za-z']/g, '')
  return CARRIER[bare.toLowerCase()] ?? bare
}
/** The sentence said back after she gets it right (QuestionCard adds "!"). */
const sayBack = (text: string) => text.replace(/[.!?]+$/, '')
const choice = (a: Ans): Choice => ('word' in a
  ? { label: a.word, say: a.word }
  : { label: a.art, art: a.art, say: a.say })

/** Data for the `rd-read` view. */
interface ReadData { lines: string[]; ask?: string; pal?: PalDef['species'] }

function readAsk(r: ReadAsk, intro: string): Question {
  const [right, ...wrong] = r.answers
  const data: ReadData = { lines: r.lines, ask: r.ask, pal: r.pal }
  return build('reading', `${intro} ${r.ask}`, { kind: 'learn', view: 'rd-read', data }, choice(right), wrong.map(choice))
}

// ---------- Questions ----------

/** Level 2. "Which one rhymes with cat?": a picture to hear, three picture choices, one rhyming. */
export function rhymeQ(): Question {
  const fams = Object.keys(RHYMES)
  const fam = pick(fams)
  const [target, right] = shuffle(RHYMES[fam])
  const wrong = shuffle(fams.filter((f) => f !== fam)).slice(0, 2).map((f) => pick(RHYMES[f]))
  const pic = ([word, art]: [string, string]): Choice => ({ label: art, art, say: word })
  return build('reading', `Which one rhymes with ${target[0]}?`,
    { kind: 'learn', view: 'rd-word-pic', data: { word: target[0], art: target[1] } }, pic(right), wrong.map(pic))
}

/** Level 6. Word families (-at, -ig, -op…): "Cat and hat are in the same family. Which word is in their family too?" */
export function wordFamilyQ(): Question {
  const fams = Object.keys(FAMILIES)
  const fam = pick(fams)
  const [a, b, ...rest] = FAMILIES[fam]
  const right = pick(rest)
  // Wrong words look like the right one (same first letter, or same vowel) but end another way,
  // so she has to read the end of the word: for "mat", "map" and "man".
  const others = fams.filter((f) => f !== fam).flatMap((f) => FAMILIES[f])
  const score = new Map(others.map((x) => [x, (x[0] === right[0] ? 2 : 0) + (x[1] === right[1] ? 1 : 0) + Math.random()]))
  const wrong: string[] = []
  for (const x of others.sort((x, y) => score.get(y)! - score.get(x)!)) {
    if (wrong.length === 2) break
    // (two wrong words from two different families)
    if (!wrong.some((v) => v.slice(1) === x.slice(1))) wrong.push(x)
  }
  const word = (x: string): Choice => ({ label: x, say: x })
  const cap = (x: string) => x[0].toUpperCase() + x.slice(1)
  return build('reading', `${cap(a)} and ${b} are in the same family. Which word is in their family too?`,
    { kind: 'learn', view: 'rd-family', data: { rime: fam, examples: [a, b] } }, word(right), wrong.map(word))
}

/** Levels 7–8. A short sentence to read ("The cat is on the bed."), then tap the picture it tells. */
export function sentencePictureQ(): Question {
  const s = pick(SENTENCES)
  const data: ReadData = { lines: [s.text] }
  const scene = (art: string): Choice => ({ label: art, art, say: art === s.right ? sayBack(s.text) : itemById(art)?.name ?? art })
  return build('reading', 'Read the sentence. Then tap the picture that matches!', { kind: 'learn', view: 'rd-read', data },
    scene(s.right), s.wrong.map(scene))
}

/** Level 9. Read a sentence, then answer a question about it with picture or word choices. */
export function readAndAnswerQ(): Question {
  return readAsk(pick(READ_AND_ANSWER), 'Read the sentence.')
}

/** Level 10. A tiny story (two or three short sentences) and a question about it. */
export function tinyStoryQ(): Question {
  return readAsk(pick(TINY_STORIES), 'Read the story.')
}

// ---------- Views ----------

/** A word that says itself when tapped (and lights up for a moment). */
function Word({ text, onSay }: { text: string; onSay: (s: string) => void }) {
  const [lit, setLit] = useState(0)
  const tap = () => {
    onSay(wordSay(text))
    setLit((n) => n + 1)
    setTimeout(() => setLit((n) => Math.max(0, n - 1)), 700)
  }
  return <button className={`rd-w ${lit ? 'lit' : ''}`} onClick={tap}>{text}</button>
}

/** A line of text as tappable words. */
const Line = ({ text, onSay }: { text: string; onSay: (s: string) => void }) => (
  <div className="rd-line">{text.split(' ').map((t, i) => <Word key={i} text={t} onSay={onSay} />)}</div>
)

export const VIEWS: Record<string, LearnView> = {
  /** A picture to hear (tap it to hear its word again), its word under it. */
  'rd-word-pic': ({ data, onSay }) => {
    const { word, art } = data as { word: string; art: string }
    return (
      <button className="rd-word-pic" onClick={() => onSay(word)}>
        <Pic e={art} art={art} />
        <span>{word}</span>
      </button>
    )
  },

  /** A word family: its ending, and two example words with the ending colored. Tap a word to hear it. */
  'rd-family': ({ data, onSay }) => {
    const { rime, examples } = data as { rime: string; examples: string[] }
    return (
      <div className="rd-family">
        <div className="rd-rime">-{rime}</div>
        <div className="rd-examples">
          {examples.map((x) => (
            <button key={x} className="rd-w rd-ex" onClick={() => onSay(x)}>
              {x.slice(0, x.length - rime.length)}<b>{x.slice(x.length - rime.length)}</b>
            </button>
          ))}
        </div>
      </div>
    )
  },

  /** A sentence or tiny story to read, every word tappable; maybe a question under it and a Pal beside it. */
  'rd-read': ({ data, onSay }) => {
    const { lines, ask, pal } = data as ReadData
    return (
      <div className={`rd-read ${lines.length > 1 ? 'rd-story' : ''} ${ask ? 'asks' : ''}`}>
        {pal && <PalArt pal={{ species: pal }} size={140} className="rd-pal" />}
        <div className="rd-text">
          {lines.map((l, i) => <Line key={i} text={l} onSay={onSay} />)}
          {ask && <button className="rd-ask" onClick={() => onSay(ask)}>{ask}</button>}
        </div>
      </div>
    )
  },
}
