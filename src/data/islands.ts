// Story islands. Each island is data: a list of steps (story, activities, verse, battle, reward)
// that IslandScreen plays in order. Adding an island = adding an entry here with its steps.
import type { Skill } from '../lib/progress'
import { NOAH_STEPS } from './noah'
import { CREATION_STEPS } from './creation'
import { DAVID_STEPS } from './david'
import { JONAH_STEPS } from './jonah'
import { LOAVES_STEPS } from './loaves'
import { CHRISTMAS_STEPS } from './christmas'

export interface StoryPage {
  scene: string // emoji scene for now; replaced by illustrations later
  bg: string
  text: string
}

/** A picture with what the narrator calls it. */
export interface Thing { emoji: string; say: string }

export type Step =
  /** Narrated picture book. */
  | { kind: 'story'; title: string; pages: StoryPage[] }
  /** Memory match: find pairs, then count them by twos. `names` are plural ("lions"). */
  | { kind: 'pairs'; animals: string[]; names: Record<string, string> }
  /** A run of adaptive reading or number questions; `theme` is what number questions count. */
  | { kind: 'practice'; skill: Skill; title: string; decor: string; intro: string; theme?: string }
  /** Tap the pictures in the right order (story events, days of creation, 1-2-3). */
  | { kind: 'sequence'; title: string; intro: string; items: Thing[] }
  /** Tap each picture, then the group it belongs to (land / sea / sky). */
  | { kind: 'sort'; title: string; intro: string; groups: (Thing & { id: string })[]; items: (Thing & { group: string })[] }
  /** Story questions with picture answers. `answer` is the index of the right choice. */
  | { kind: 'quiz'; title: string; questions: { say: string; choices: Thing[]; answer: number }[] }
  /** Put the right number of things in a container: one round per number in `rounds`. `into` is said aloud (default "the basket"). */
  | { kind: 'count'; title: string; intro: string; item: Thing; plural: string; basket: string; into?: string; rounds: number[] }
  /** Trace big letters with a finger. */
  | { kind: 'trace'; title: string; intro: string; letters: string[] }
  /** Guide the hero through a little maze to the goal. */
  | { kind: 'maze'; title: string; intro: string; hero: Thing; goal: Thing }
  /** Memory verse: listen, then tap the pieces in order. */
  | { kind: 'verse'; chunks: string[]; ref: string }
  /** Friendly battle against a grumpy creature (a Pal id), who joins the Ark at the end. */
  | { kind: 'battle'; foe: string; intro: string }
  /** The island's reward: a new Pal and a sticker. Always the last step. */
  | { kind: 'reward'; pal: string; sticker: string; stickerName: string }

export interface Island {
  id: string
  name: string
  emoji: string // landmark on the map
  color: string
  at: [number, number] // position on the map (viewBox 1000 x 620)
  steps?: Step[] // islands without steps yet show as "coming soon"
}

export const ISLANDS: Island[] = [
  { id: 'noah', name: "Noah's Ark", emoji: '🌈', color: '#7cc6ff', at: [150, 470], steps: NOAH_STEPS },
  { id: 'creation', name: 'Creation', emoji: '🌍', color: '#5fd39a', at: [355, 395], steps: CREATION_STEPS },
  { id: 'david', name: 'David & Goliath', emoji: '🪨', color: '#ffb347', at: [235, 175], steps: DAVID_STEPS },
  { id: 'jonah', name: 'Jonah & the Big Fish', emoji: '🐋', color: '#5fb7ff', at: [495, 120], steps: JONAH_STEPS },
  { id: 'loaves', name: 'Loaves & Fishes', emoji: '🧺', color: '#ffd34d', at: [610, 330], steps: LOAVES_STEPS },
  { id: 'christmas', name: 'Baby Jesus', emoji: '⭐', color: '#c9a8ff', at: [815, 180], steps: CHRISTMAS_STEPS },
]

export const islandById = (id: string) => ISLANDS.find((i) => i.id === id)

/**
 * Islands open in order: the first one, then each one after the previous is finished.
 * `openAll` (Parent Corner) opens every island that's built.
 */
export function islandOpen(index: number, done: string[], openAll = false) {
  const isl = ISLANDS[index]
  if (!isl?.steps) return false
  if (openAll) return true
  return index === 0 || done.includes(ISLANDS[index - 1].id)
}
