// Story islands. Each island is data: a list of steps (story, activities, verse, battle, reward)
// that IslandScreen plays in order. Adding an island = adding an entry here with its steps.
import type { Skill } from '../lib/progress'
import { NOAH_STEPS } from './noah'

export interface StoryPage {
  scene: string // emoji scene for now; replaced by illustrations later
  bg: string
  text: string
}

export type Step =
  | { kind: 'story'; title: string; pages: StoryPage[] }
  | { kind: 'pairs'; animals: string[]; names: Record<string, string> }
  | { kind: 'practice'; skill: Skill; title: string; decor: string; intro: string; theme?: string }
  | { kind: 'verse'; chunks: string[]; ref: string }
  | { kind: 'battle'; foe: string; intro: string }
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
  { id: 'creation', name: 'Creation', emoji: '🌍', color: '#5fd39a', at: [355, 395] },
  { id: 'david', name: 'David & Goliath', emoji: '🪨', color: '#ffb347', at: [235, 175] },
  { id: 'jonah', name: 'Jonah & the Big Fish', emoji: '🐋', color: '#5fb7ff', at: [495, 120] },
  { id: 'loaves', name: 'Loaves & Fishes', emoji: '🧺', color: '#ffd34d', at: [610, 330] },
  { id: 'christmas', name: 'Baby Jesus', emoji: '⭐', color: '#c9a8ff', at: [815, 180] },
  { id: 'birthday', name: "Carter's Birthday!", emoji: '🎂', color: '#ff8cc0', at: [850, 470] },
]

export const islandById = (id: string) => ISLANDS.find((i) => i.id === id)

/** Islands open in order: the first one, then each one after the previous is finished. */
export function islandOpen(index: number, done: string[]) {
  const isl = ISLANDS[index]
  if (!isl?.steps) return false
  return index === 0 || done.includes(ISLANDS[index - 1].id)
}
