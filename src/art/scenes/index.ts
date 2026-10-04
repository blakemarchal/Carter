// Story illustrations that aren't an island's: the birthday party's and bedtime's, one component per
// page. (An island's pictures load with the island: data/islands.ts, loadIsland.)
import type { ComponentType } from 'react'
import { BIRTHDAY_ART } from './birthday'
import { BEDTIME_ART } from './bedtime'

export const STORY_ART: Record<string, ComponentType[]> = {
  birthday: BIRTHDAY_ART,
  bedtime: BEDTIME_ART,
}
