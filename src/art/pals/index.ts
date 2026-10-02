// One drawing per species. Each file draws its Pal in a 200x200 box (see ../kit.tsx for the style).
import type { ComponentType } from 'react'
import type { BodyProps } from '../kit'
import type { PalDef } from '../../data/pals'
import Mouse from './mouse'
import Dragon from './dragon'
import Serpent from './serpent'
import Dove from './dove'
import Cloud from './cloud'
import Cat from './cat'
import Sun from './sun'
import Night from './night'
import Lion from './lion'
import Goat from './goat'
import Whale from './whale'
import Wave from './wave'
import Donkey from './donkey'
import Crab from './crab'
import Lamb from './lamb'
import Snow from './snow'
import Cupcake from './cupcake'
import Balloon from './balloon'

export const SPECIES: Record<PalDef['species'], ComponentType<BodyProps>> = {
  mouse: Mouse,
  dragon: Dragon,
  serpent: Serpent,
  dove: Dove,
  cloud: Cloud,
  cat: Cat,
  sun: Sun,
  night: Night,
  lion: Lion,
  goat: Goat,
  whale: Whale,
  wave: Wave,
  donkey: Donkey,
  crab: Crab,
  lamb: Lamb,
  snow: Snow,
  cupcake: Cupcake,
  balloon: Balloon,
}
