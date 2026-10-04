// Story illustrations, by island id (and 'bedtime'): one component per story page, in order.
// A page without an illustration falls back to its emoji scene.
import type { ComponentType } from 'react'
import { NOAH_ART } from './noah'
import { CREATION_ART } from './creation'
import { DAVID_ART } from './david'
import { JONAH_ART } from './jonah'
import { LOAVES_ART } from './loaves'
import { CHRISTMAS_ART } from './christmas'
import { ABRAHAM_ART } from './abraham'
import { JOSEPH_ART } from './joseph'
import { RED_SEA_ART } from './red-sea'
import { DANIEL_ART } from './daniel'
import { BABY_MOSES_ART } from './baby-moses'
import { BURNING_BUSH_ART } from './burning-bush'
import { MANNA_ART } from './manna'
import { BIRTHDAY_ART } from './birthday'
import { BEDTIME_ART } from './bedtime'

export const STORY_ART: Record<string, ComponentType[]> = {
  noah: NOAH_ART,
  creation: CREATION_ART,
  david: DAVID_ART,
  jonah: JONAH_ART,
  loaves: LOAVES_ART,
  christmas: CHRISTMAS_ART,
  abraham: ABRAHAM_ART,
  joseph: JOSEPH_ART,
  'red-sea': RED_SEA_ART,
  daniel: DANIEL_ART,
  'baby-moses': BABY_MOSES_ART,
  'burning-bush': BURNING_BUSH_ART,
  manna: MANNA_ART,
  birthday: BIRTHDAY_ART,
  bedtime: BEDTIME_ART,
}
