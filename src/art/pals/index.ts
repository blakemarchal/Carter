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
import Camel from './camel'
import Star from './star'
import Peacock from './peacock'
import Chameleon from './chameleon'
import Wind from './wind'
import Tambourine from './tambourine'
import Cub from './cub'
import Owl from './owl'
import Crocodile from './crocodile'
import Lily from './lily'
import Hedgehog from './hedgehog'
import Hyrax from './hyrax'
import Tortoise from './tortoise'
import Quail from './quail'
import Ram from './ram'
import Trumpet from './trumpet'
import Grasshopper from './grasshopper'
import Hare from './hare'
import Bat from './bat'
import Fennec from './fennec'
import Cactus from './cactus'
import Raven from './raven'
import Rooster from './rooster'
import Butterfly from './butterfly'
import Gecko from './gecko'
import Sparrow from './sparrow'
import Pelican from './pelican'
import Fish from './fish'
import Seagull from './seagull'
import Kingfisher from './kingfisher'
import Mole from './mole'
import Puppy from './puppy'
import Ostrich from './ostrich'
import Ladybug from './ladybug'
import Squirrel from './squirrel'
import Frog from './frog'

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
  camel: Camel,
  star: Star,
  peacock: Peacock,
  chameleon: Chameleon,
  wind: Wind,
  tambourine: Tambourine,
  cub: Cub,
  owl: Owl,
  crocodile: Crocodile,
  lily: Lily,
  hedgehog: Hedgehog,
  hyrax: Hyrax,
  tortoise: Tortoise,
  quail: Quail,
  ram: Ram,
  trumpet: Trumpet,
  grasshopper: Grasshopper,
  hare: Hare,
  bat: Bat,
  fennec: Fennec,
  cactus: Cactus,
  raven: Raven,
  rooster: Rooster,
  butterfly: Butterfly,
  gecko: Gecko,
  sparrow: Sparrow,
  pelican: Pelican,
  fish: Fish,
  seagull: Seagull,
  kingfisher: Kingfisher,
  mole: Mole,
  puppy: Puppy,
  ostrich: Ostrich,
  ladybug: Ladybug,
  squirrel: Squirrel,
  frog: Frog,
}
