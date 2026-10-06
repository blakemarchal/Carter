// Reading questions beyond the first five levels (docs/GAME-PLAN.md §4): rhyming, word families,
// short sentences to read, and tiny stories with a question.
// STUB: each generator falls back to an earlier question until it's built.
import type { Question } from '../../lib/questions'
import { readingQ } from '../../lib/questions'
import type { LearnView } from '../types'

/** Level 2. "Which one rhymes with cat?": a picture to hear, three picture choices, one rhyming. */
export function rhymeQ(): Question { return readingQ(1) }

/** Level 6. Word families (-at, -ig, -op…): e.g. "Which word is in the at family?" with word choices. */
export function wordFamilyQ(): Question { return readingQ(5) }

/** Levels 7–8. A short sentence to read ("The cat is on the bed."), then tap the picture it tells. */
export function sentencePictureQ(): Question { return readingQ(5) }

/** Level 9. Read a sentence, then answer a question about it with picture or word choices. */
export function readAndAnswerQ(): Question { return readingQ(5) }

/** Level 10. A tiny story (two or three short sentences) and a question about it. */
export function tinyStoryQ(): Question { return readingQ(5) }

/** Pictures for these questions' `learn` visuals (e.g. a sentence with tappable words). */
export const VIEWS: Record<string, LearnView> = {}
