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

/**
 * A picture with what the narrator calls it. `emoji` names it (and is the fallback); `art` picks a
 * particular drawing: an item id from art/items, or `story:<island>:<page>` for a story page.
 */
export interface Thing { emoji: string; say: string; art?: string }

export type Step =
  /** Narrated picture book. */
  | { kind: 'story'; title: string; pages: StoryPage[] }
  /** Memory match: find pairs, then count them by twos. `names` are plural ("lions"). */
  | { kind: 'pairs'; animals: string[]; names: Record<string, string> }
  /** A run of adaptive reading or number questions; `theme` is what number questions count. */
  | { kind: 'practice'; skill: Skill; title: string; decor: string; intro: string; theme?: string }
  /** Tap the pictures in the right order (story events, days of creation, 1-2-3). */
  | { kind: 'sequence'; title: string; intro: string; items: Thing[] }
  /**
   * Tap each picture, then the group it belongs to (land / sea / sky). `hint` is the line under the
   * groups; the default, "Drag it to where it lives!", is for animal homes, so set one for any other sort.
   */
  | { kind: 'sort'; title: string; intro: string; hint?: string; groups: (Thing & { id: string })[]; items: (Thing & { group: string })[] }
  /** Story questions with picture answers. `answer` is the index of the right choice. */
  | { kind: 'quiz'; title: string; questions: { say: string; choices: Thing[]; answer: number }[] }
  /**
   * Put the right number of things in a container: one round per number in `rounds`. `into` is said
   * aloud (default "the basket"). `done` is said after the last round, to tie it back to the story.
   */
  | { kind: 'count'; title: string; intro: string; item: Thing; plural: string; basket: string; into?: string; rounds: number[]; done?: string
      /** A particular (empty) container drawing, e.g. 'basket' or 'hay' (the emoji alone means the full basket, a sheaf…). */
      basketArt?: string }
  /** Trace big letters with a finger. */
  | { kind: 'trace'; title: string; intro: string; letters: string[] }
  /**
   * Guide the hero through a little maze to the goal. `trail` marks the squares it has been (an
   * emoji, default 👣); `theme: 'water'` makes it a sea maze (blue water and walls) for swimmers.
   */
  | { kind: 'maze'; title: string; intro: string; hero: Thing; goal: Thing; trail?: string; theme?: 'water' }
  /** Memory verse: listen, then tap the pieces in order. */
  | { kind: 'verse'; chunks: string[]; ref: string }
  /** Friendly battle against a grumpy creature (a Pal id), who joins the Ark at the end. */
  | { kind: 'battle'; foe: string; intro: string }
  /** The end of a visit (an island has up to three): a little cliffhanger, then back to the map. */
  | { kind: 'pause'; line: string }
  /** The island's reward: a new Pal and a sticker. Always the last step. */
  | { kind: 'reward'; pal: string; sticker: string; stickerName: string }

/** A built island's content. Where it sits on the voyage (which sea, in what order) is in seas.ts. */
export interface Island {
  id: string
  name: string
  emoji: string // landmark on the map
  color: string
  steps?: Step[] // islands without steps yet show as "coming soon"
}

export const ISLANDS: Island[] = [
  { id: 'noah', name: "Noah's Ark", emoji: '🌈', color: '#7cc6ff', steps: NOAH_STEPS },
  { id: 'creation', name: 'Creation', emoji: '🌍', color: '#5fd39a', steps: CREATION_STEPS },
  { id: 'david', name: 'David & Goliath', emoji: '🪨', color: '#ffb347', steps: DAVID_STEPS },
  { id: 'jonah', name: 'Jonah & the Big Fish', emoji: '🐋', color: '#5fb7ff', steps: JONAH_STEPS },
  { id: 'loaves', name: 'Loaves & Fishes', emoji: '🧺', color: '#ffd34d', steps: LOAVES_STEPS },
  { id: 'christmas', name: 'Baby Jesus', emoji: '⭐', color: '#c9a8ff', steps: CHRISTMAS_STEPS },
]

export const islandById = (id: string) => ISLANDS.find((i) => i.id === id)
