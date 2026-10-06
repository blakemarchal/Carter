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
import { ISL_NOAH } from './isl-noah'
import { ISL_CREATION } from './isl-creation'
import { ISL_DAVID } from './isl-david'
import { ISL_JONAH } from './isl-jonah'
import { ISL_LOAVES } from './isl-loaves'
import { ISL_CHRISTMAS } from './isl-christmas'
import { ISL_ABRAHAM } from './isl-abraham'
import { ISL_JOSEPH } from './isl-joseph'
import { ISL_RED_SEA } from './isl-red-sea'
import { ISL_DANIEL } from './isl-daniel'
import { ISL_BABY_MOSES } from './isl-baby-moses'
import { ISL_BURNING_BUSH } from './isl-burning-bush'
import { ISL_MANNA } from './isl-manna'
import { ISL_JERICHO } from './isl-jericho'
import { ISL_RUTH } from './isl-ruth'
import { ISL_SAMUEL } from './isl-samuel'
import { ISL_ELIJAH } from './isl-elijah'
import { ISL_ESTHER } from './isl-esther'
import { ISL_BOY_JESUS } from './isl-boy-jesus'
import { ISL_FISHERS } from './isl-fishers'
import { ISL_STORM } from './isl-storm'
import { ISL_LOST_SHEEP } from './isl-lost-sheep'
import { ISL_SAMARITAN } from './isl-samaritan'
import { ISL_ZACCHAEUS } from './isl-zacchaeus'
import { ISL_PALM_SUNDAY } from './isl-palm-sunday'
import { ISL_EASTER } from './isl-easter'
import { ISL_PENTECOST } from './isl-pentecost'
import { LEARN_TIME_MONEY } from './learn-time-money'

export type { Item } from './types'
export const ITEM_GROUPS: Record<string, Item[]> = {
  farm: FARM, wild: WILD, food: FOOD, nature: NATURE, things: THINGS,
  // (things first drawn for one island's story)
  'noah': ISL_NOAH,
  'creation': ISL_CREATION,
  'david': ISL_DAVID,
  'jonah': ISL_JONAH,
  'loaves': ISL_LOAVES,
  'christmas': ISL_CHRISTMAS,
  'abraham': ISL_ABRAHAM,
  'joseph': ISL_JOSEPH,
  'red-sea': ISL_RED_SEA,
  'daniel': ISL_DANIEL,
  'baby-moses': ISL_BABY_MOSES,
  'burning-bush': ISL_BURNING_BUSH,
  'manna': ISL_MANNA,
  'jericho': ISL_JERICHO,
  'ruth': ISL_RUTH,
  'samuel': ISL_SAMUEL,
  'elijah': ISL_ELIJAH,
  'esther': ISL_ESTHER,
  'boy-jesus': ISL_BOY_JESUS,
  'fishers': ISL_FISHERS,
  'storm': ISL_STORM,
  'lost-sheep': ISL_LOST_SHEEP,
  'samaritan': ISL_SAMARITAN,
  'zacchaeus': ISL_ZACCHAEUS,
  'palm-sunday': ISL_PALM_SUNDAY,
  'easter': ISL_EASTER,
  'pentecost': ISL_PENTECOST,
  'learn-time-money': LEARN_TIME_MONEY,
}
export const ITEMS: Item[] = Object.values(ITEM_GROUPS).flat()

// (Emoji are matched without their invisible "show as emoji" marks, so ☀️ and ☀ are the same.)
const plain = (e: string) => e.replace(/[︎️]/g, '')
const byId = new Map(ITEMS.map((it) => [it.id, it]))
const byEmoji = new Map(ITEMS.flatMap((it) => (it.emoji ?? []).map((e) => [plain(e), it] as const)))

/** The drawing for an item id. */
export const itemById = (id: string) => byId.get(id)
/** The drawing that stands in for an emoji (one emoji, not a row of them). */
export const itemForEmoji = (e: string) => byEmoji.get(plain(e))
