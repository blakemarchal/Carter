// Story islands. Each island is data: a list of steps (story, activities, verse, battle, reward)
// that IslandScreen plays in order. Adding an island = adding an entry here with its steps.
// An island has up to three visits, split by 'pause' steps (docs/GAME-PLAN.md §3.1).
import type { Skill } from '../lib/progress'
import type { BuildKit, CatchKit, PaintKit, RhythmKit, ShareKit, SpotKit, SteerKit } from '../activities/games/types'
import { NOAH_STEPS } from './noah'
import { CREATION_STEPS } from './creation'
import { DAVID_STEPS } from './david'
import { JONAH_STEPS } from './jonah'
import { LOAVES_STEPS } from './loaves'
import { CHRISTMAS_STEPS } from './christmas'
import { ABRAHAM_STEPS } from './abraham'
import { JOSEPH_STEPS } from './joseph'
import { RED_SEA_STEPS } from './red-sea'
import { DANIEL_STEPS } from './daniel'
import { BABY_MOSES_STEPS } from './baby-moses'
import { BURNING_BUSH_STEPS } from './burning-bush'
import { MANNA_STEPS } from './manna'

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
  /**
   * Narrated picture book. An island's pictures (art/scenes) run on through all its story parts, so a
   * later part says where its pages start in them: `first` (0 for the first part, the default).
   */
  | { kind: 'story'; title: string; pages: StoryPage[]; first?: number }
  /**
   * Memory match: find pairs, then count them by twos. `names` are plural ("lions"). `done` is said at the
   * end (default "All the animals are safe in the ark!"), so it can fit where the game sits in the story.
   */
  | { kind: 'pairs'; animals: string[]; names: Record<string, string>; done?: string }
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
  /**
   * The island's signature mini-game (activities/games): a mechanic played with the island's own kit of
   * pictures (art/games/<island>.tsx). `intro` is said at the start, `done` at the end.
   */
  | { kind: 'build'; title: string; intro: string; done: string; kit: BuildKit }
  /** Find things in a big picture; `plural` names them ("stars"), for hints. */
  | { kind: 'spot'; title: string; intro: string; done: string; plural: string; kit: SpotKit }
  | { kind: 'paint'; title: string; intro: string; done: string; kit: PaintKit }
  | { kind: 'steer'; title: string; intro: string; done: string; kit: SteerKit }
  | { kind: 'rhythm'; title: string; intro: string; done: string; kit: RhythmKit }
  | { kind: 'share'; title: string; intro: string; done: string; kit: ShareKit }
  /** Catch what falls; `plural` names it ("pieces of manna"), for hints. */
  | { kind: 'catch'; title: string; intro: string; done: string; plural: string; kit: CatchKit }
  /** The island's song (a song id in data/songs.ts) to sing along with; then it's in the sing-along on the Ark. */
  | { kind: 'song'; song: string; intro: string }
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
  /** Goes up when the island gets new content (more visits), so players who finished it see "New!". */
  version?: number
}

// (version 2: the island grew from one visit to three)
export const ISLANDS: Island[] = [
  { id: 'noah', name: "Noah's Ark", emoji: '🌈', color: '#7cc6ff', steps: NOAH_STEPS, version: 2 },
  { id: 'creation', name: 'Creation', emoji: '🌍', color: '#5fd39a', steps: CREATION_STEPS, version: 2 },
  { id: 'david', name: 'David & Goliath', emoji: '🪨', color: '#ffb347', steps: DAVID_STEPS, version: 2 },
  { id: 'jonah', name: 'Jonah & the Big Fish', emoji: '🐋', color: '#5fb7ff', steps: JONAH_STEPS, version: 2 },
  { id: 'loaves', name: 'Loaves & Fishes', emoji: '🧺', color: '#ffd34d', steps: LOAVES_STEPS, version: 2 },
  { id: 'christmas', name: 'Baby Jesus', emoji: '⭐', color: '#c9a8ff', steps: CHRISTMAS_STEPS, version: 2 },
  { id: 'abraham', name: "Abraham's Stars", emoji: '✨', color: '#9b8cff', steps: ABRAHAM_STEPS },
  { id: 'joseph', name: "Joseph's Coat", emoji: '🧥', color: '#ff9b4a', steps: JOSEPH_STEPS },
  { id: 'red-sea', name: 'The Red Sea', emoji: '🌊', color: '#4fb0d8', steps: RED_SEA_STEPS },
  { id: 'daniel', name: 'Daniel & the Lions', emoji: '🦁', color: '#e0a85a', steps: DANIEL_STEPS },
  { id: 'baby-moses', name: 'Baby Moses', emoji: '👶', color: '#7ec8e3', steps: BABY_MOSES_STEPS },
  { id: 'burning-bush', name: 'The Burning Bush', emoji: '🔥', color: '#ff7a45', steps: BURNING_BUSH_STEPS },
  { id: 'manna', name: 'Manna in the Desert', emoji: '🍯', color: '#e8c25a', steps: MANNA_STEPS },
]

export const islandById = (id: string) => ISLANDS.find((i) => i.id === id)
