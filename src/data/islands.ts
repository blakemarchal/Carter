// Story islands. Each island is data: a list of steps (story, activities, verse, battle, reward)
// that IslandScreen plays in order, and one picture per story page (art/scenes/<id>.tsx).
// An island has up to three visits, split by 'pause' steps (docs/GAME-PLAN.md §3.1).
// Only what the map needs is loaded up front (ISLANDS); an island's content (its steps, pictures and
// mini-game) loads when it's needed (loadIsland, or useIsland in lib/useIsland.ts), so the game
// starts quickly however many islands it grows to. Adding an island = an entry in ISLANDS and in CONTENT.
import type { ComponentType } from 'react'
import type { Skill } from '../lib/progress'
import type { BuildKit, CatchKit, PaintKit, RhythmKit, ShareKit, SpotKit, SteerKit } from '../activities/games/types'

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
  /**
   * The island's reward: a new Pal and a sticker. Always the last step. The sticker is an emoji, or the id
   * of a drawing (art/items) for a thing no emoji names, like baby Moses' basket.
   */
  | { kind: 'reward'; pal: string; sticker: string; stickerName: string }

/** A built island, as the map knows it. Where it sits on the voyage (which sea, in what order) is in seas.ts. */
export interface IslandInfo {
  id: string
  name: string
  emoji: string // landmark on the map
  color: string
  /** Goes up when the island gets new content (more visits), so players who finished it see "New!". */
  version?: number
}

/** A built island with its content: its steps, and one picture per story page (all its parts, in order). */
export interface Island extends IslandInfo {
  steps: Step[]
  art: ComponentType[]
}

// (version 2: the island grew from one visit to three)
export const ISLANDS: IslandInfo[] = [
  { id: 'noah', name: "Noah's Ark", emoji: '🌈', color: '#7cc6ff', version: 2 },
  { id: 'creation', name: 'Creation', emoji: '🌍', color: '#5fd39a', version: 2 },
  { id: 'david', name: 'David & Goliath', emoji: '🪨', color: '#ffb347', version: 2 },
  { id: 'jonah', name: 'Jonah & the Big Fish', emoji: '🐋', color: '#5fb7ff', version: 2 },
  { id: 'loaves', name: 'Loaves & Fishes', emoji: '🧺', color: '#ffd34d', version: 2 },
  { id: 'christmas', name: 'Baby Jesus', emoji: '⭐', color: '#c9a8ff', version: 2 },
  { id: 'abraham', name: "Abraham's Stars", emoji: '✨', color: '#9b8cff' },
  { id: 'joseph', name: "Joseph's Coat", emoji: '🧥', color: '#ff9b4a' },
  { id: 'red-sea', name: 'The Red Sea', emoji: '🌊', color: '#4fb0d8' },
  { id: 'daniel', name: 'Daniel & the Lions', emoji: '🦁', color: '#e0a85a' },
  { id: 'baby-moses', name: 'Baby Moses', emoji: '👶', color: '#7ec8e3' },
  { id: 'burning-bush', name: 'The Burning Bush', emoji: '🔥', color: '#ff7a45' },
  { id: 'manna', name: 'Manna in the Desert', emoji: '🍯', color: '#e8c25a' },
  { id: 'jericho', name: 'The Walls of Jericho', emoji: '🎺', color: '#e0904f' },
  { id: 'ruth', name: 'Ruth and Naomi', emoji: '🌾', color: '#d4b44a' },
  { id: 'samuel', name: 'Samuel Listens', emoji: '🪔', color: '#8f8ae0' },
  { id: 'elijah', name: 'Elijah', emoji: '🔥', color: '#e8743b' },
  { id: 'esther', name: 'Queen Esther', emoji: '👑', color: '#b48be0' },
  { id: 'boy-jesus', name: 'Boy Jesus at the Temple', emoji: '📜', color: '#e0b85a' },
  { id: 'fishers', name: 'Fishers of People', emoji: '🐟', color: '#3fa7b8' },
  { id: 'storm', name: 'Jesus Calms the Storm', emoji: '⛵', color: '#6f8fc0' },
  { id: 'lost-sheep', name: 'The Lost Sheep', emoji: '🐑', color: '#8fcf6a' },
  { id: 'samaritan', name: 'The Good Samaritan', emoji: '❤️', color: '#e8667a' },
  { id: 'zacchaeus', name: 'Zacchaeus', emoji: '🌳', color: '#3f9a5a' },
]

type Content = Promise<{ steps: Step[]; art: ComponentType[] }>
const both = async (data: Promise<Step[]>, art: Promise<ComponentType[]>): Content => ({ steps: await data, art: await art })

/** Each island's content, loaded when it's first needed (each becomes its own download). */
const CONTENT: Record<string, () => Content> = {
  noah: () => both(import('./noah').then((m) => m.NOAH_STEPS), import('../art/scenes/noah').then((m) => m.NOAH_ART)),
  creation: () => both(import('./creation').then((m) => m.CREATION_STEPS), import('../art/scenes/creation').then((m) => m.CREATION_ART)),
  david: () => both(import('./david').then((m) => m.DAVID_STEPS), import('../art/scenes/david').then((m) => m.DAVID_ART)),
  jonah: () => both(import('./jonah').then((m) => m.JONAH_STEPS), import('../art/scenes/jonah').then((m) => m.JONAH_ART)),
  loaves: () => both(import('./loaves').then((m) => m.LOAVES_STEPS), import('../art/scenes/loaves').then((m) => m.LOAVES_ART)),
  christmas: () => both(import('./christmas').then((m) => m.CHRISTMAS_STEPS), import('../art/scenes/christmas').then((m) => m.CHRISTMAS_ART)),
  abraham: () => both(import('./abraham').then((m) => m.ABRAHAM_STEPS), import('../art/scenes/abraham').then((m) => m.ABRAHAM_ART)),
  joseph: () => both(import('./joseph').then((m) => m.JOSEPH_STEPS), import('../art/scenes/joseph').then((m) => m.JOSEPH_ART)),
  'red-sea': () => both(import('./red-sea').then((m) => m.RED_SEA_STEPS), import('../art/scenes/red-sea').then((m) => m.RED_SEA_ART)),
  daniel: () => both(import('./daniel').then((m) => m.DANIEL_STEPS), import('../art/scenes/daniel').then((m) => m.DANIEL_ART)),
  'baby-moses': () => both(import('./baby-moses').then((m) => m.BABY_MOSES_STEPS), import('../art/scenes/baby-moses').then((m) => m.BABY_MOSES_ART)),
  'burning-bush': () => both(import('./burning-bush').then((m) => m.BURNING_BUSH_STEPS), import('../art/scenes/burning-bush').then((m) => m.BURNING_BUSH_ART)),
  manna: () => both(import('./manna').then((m) => m.MANNA_STEPS), import('../art/scenes/manna').then((m) => m.MANNA_ART)),
  jericho: () => both(import('./jericho').then((m) => m.JERICHO_STEPS), import('../art/scenes/jericho').then((m) => m.JERICHO_ART)),
  ruth: () => both(import('./ruth').then((m) => m.RUTH_STEPS), import('../art/scenes/ruth').then((m) => m.RUTH_ART)),
  samuel: () => both(import('./samuel').then((m) => m.SAMUEL_STEPS), import('../art/scenes/samuel').then((m) => m.SAMUEL_ART)),
  elijah: () => both(import('./elijah').then((m) => m.ELIJAH_STEPS), import('../art/scenes/elijah').then((m) => m.ELIJAH_ART)),
  esther: () => both(import('./esther').then((m) => m.ESTHER_STEPS), import('../art/scenes/esther').then((m) => m.ESTHER_ART)),
  'boy-jesus': () => both(import('./boy-jesus').then((m) => m.BOY_JESUS_STEPS), import('../art/scenes/boy-jesus').then((m) => m.BOY_JESUS_ART)),
  fishers: () => both(import('./fishers').then((m) => m.FISHERS_STEPS), import('../art/scenes/fishers').then((m) => m.FISHERS_ART)),
  storm: () => both(import('./storm').then((m) => m.STORM_STEPS), import('../art/scenes/storm').then((m) => m.STORM_ART)),
  'lost-sheep': () => both(import('./lost-sheep').then((m) => m.LOST_SHEEP_STEPS), import('../art/scenes/lost-sheep').then((m) => m.LOST_SHEEP_ART)),
  samaritan: () => both(import('./samaritan').then((m) => m.SAMARITAN_STEPS), import('../art/scenes/samaritan').then((m) => m.SAMARITAN_ART)),
  zacchaeus: () => both(import('./zacchaeus').then((m) => m.ZACCHAEUS_STEPS), import('../art/scenes/zacchaeus').then((m) => m.ZACCHAEUS_ART)),
}

export const islandById = (id: string) => ISLANDS.find((i) => i.id === id)

// ---------- Loading an island's content ----------

const loaded = new Map<string, Island>()
const loading = new Map<string, Promise<Island>>()
const listeners = new Set<() => void>()

/** An island's content, loading it the first time (later calls get the same island). */
export function loadIsland(id: string): Promise<Island> {
  const have = loaded.get(id)
  if (have) return Promise.resolve(have)
  let p = loading.get(id)
  if (!p) {
    const info = islandById(id)
    const load = CONTENT[id]
    if (!info || !load) return Promise.reject(new Error(`No island ${id}`))
    p = load().then((c) => {
      const isl: Island = { ...info, ...c }
      loaded.set(id, isl)
      listeners.forEach((f) => f())
      return isl
    })
    // (a failed download can be tried again)
    p.catch(() => loading.delete(id))
    loading.set(id, p)
  }
  return p
}

/** An island's content if it has loaded already (or undefined). */
export const loadedIsland = (id: string) => loaded.get(id)

/** Every built island, loaded (for the review page, the family voices list and the tests). */
export const loadAllIslands = () => Promise.all(ISLANDS.map((i) => loadIsland(i.id)))

/** Hears when an island finishes loading (for useSyncExternalStore). */
export function onIslandLoaded(f: () => void) {
  listeners.add(f)
  return () => { listeners.delete(f) }
}
