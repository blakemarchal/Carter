// Drawn pictures of things, for activities and story pictures: what's shown is exactly what the
// narrator says, and it looks the same on every device. Content still names things by emoji (🦁, 🍞)
// or by an item id (`art: 'manger-baby'`). components/Pic.tsx draws the picture when there is one
// and falls back to the emoji. Every item draws in a 100 x 100 box; see #gallery/items (dev only).
import type { Item } from './types'
import { FARM } from './farm'
import { WILD } from './wild'
import { FOOD } from './food'
import { NATURE } from './nature'
import { THINGS } from './things'

export type { Item } from './types'
export const ITEM_GROUPS: Record<string, Item[]> = { farm: FARM, wild: WILD, food: FOOD, nature: NATURE, things: THINGS }
export const ITEMS: Item[] = Object.values(ITEM_GROUPS).flat()

// (Emoji are matched without their invisible "show as emoji" marks, so ☀️ and ☀ are the same.)
const plain = (e: string) => e.replace(/[︎️]/g, '')
const byId = new Map(ITEMS.map((it) => [it.id, it]))
const byEmoji = new Map(ITEMS.flatMap((it) => (it.emoji ?? []).map((e) => [plain(e), it] as const)))

/** The drawing for an item id. */
export const itemById = (id: string) => byId.get(id)
/** The drawing that stands in for an emoji (one emoji, not a row of them). */
export const itemForEmoji = (e: string) => byEmoji.get(plain(e))
