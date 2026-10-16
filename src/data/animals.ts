// Noah's Animal Book (docs/GAME-PLAN.md, the learning wave of Oct 16, 2026): a card for every animal the game
// draws (art/items), with what it is, where it lives, what it eats, what its baby is called, the sound it makes,
// and three facts, one per reading level. A card opens once the child has met the animal: it's in a finished
// island's activities (found in the island's data), or in its story (STORY_ANIMALS). Everything here is said by
// the narrator, so these lines are in the voice script (scripts/voice-script.tsx).
import type { Island, Thing } from './islands'
import { itemById, itemForEmoji } from '../art/items'
import type { Progress } from '../lib/progress'

export type Home = 'land' | 'sea' | 'sky'
export type Eats = 'plants' | 'animals' | 'both'
export type Kind = 'mammal' | 'bird' | 'fish' | 'reptile' | 'amphibian' | 'bug' | 'sea creature'

export interface Animal {
  /** The drawing's id (art/items) and the card's name. */
  id: string
  name: string
  kind: Kind
  home: Home
  eats: Eats
  /** Bigger than a child, or smaller (the big-or-small sort). */
  big: boolean
  baby: string
  sound: string
  /** Three facts, for readers at levels 1 to 3, 4 to 6, and 7 to 10: each one sentence or two, said aloud. */
  facts: [string, string, string]
}

export const HOME_NAMES: Record<Home, string> = { land: 'on land', sea: 'in the sea', sky: 'in the sky' }
export const EATS_NAMES: Record<Eats, string> = { plants: 'plants', animals: 'other animals', both: 'plants and animals' }

const a = (id: string, name: string, kind: Kind, home: Home, eats: Eats, big: boolean, baby: string, sound: string, facts: [string, string, string]): Animal =>
  ({ id, name, kind, home, eats, big, baby, sound, facts })

export const ANIMALS: Animal[] = [
  // ---- the farm and the garden ----
  a('sheep', 'sheep', 'mammal', 'land', 'plants', false, 'lamb', 'baa', [
    'A sheep has a soft, woolly coat.',
    'Every year the wool is cut off, and it grows back. Wool is made into warm sweaters and blankets.',
    'Sheep know their shepherd’s voice and follow it. Jesus said He is the Good Shepherd, and His sheep know His voice.',
  ]),
  a('cat', 'cat', 'mammal', 'land', 'animals', false, 'kitten', 'meow', [
    'A cat purrs when it is happy.',
    'A cat’s whiskers are as wide as its body, so it can tell if it fits through a gap.',
    'Cats can see in very dim light, six times better than we can, which is why they love to prowl at night.',
  ]),
  a('dog', 'dog', 'mammal', 'land', 'both', false, 'puppy', 'woof', [
    'A dog wags its tail when it is glad to see you.',
    'A dog’s nose can smell thousands of times better than yours.',
    'Dogs can learn hundreds of words, and some dogs help people who cannot see to find their way.',
  ]),
  a('pig', 'pig', 'mammal', 'land', 'both', true, 'piglet', 'oink', [
    'A pig has a curly tail and a flat nose called a snout.',
    'Pigs roll in mud to keep cool, because they cannot sweat.',
    'Pigs are very clever, about as clever as a dog, and they can learn their own names.',
  ]),
  a('hen', 'hen', 'bird', 'land', 'both', false, 'chick', 'cluck', [
    'A hen is a mother chicken. She lays eggs.',
    'A hen lays about one egg a day, and she sits on her eggs to keep them warm.',
    'A chick peeps inside its egg before it hatches, and the hen clucks back to it.',
  ]),
  a('chick', 'chick', 'bird', 'land', 'both', false, 'chick', 'peep', [
    'A chick is a baby chicken. It is soft and yellow.',
    'A chick pecks its way out of its egg with a tiny egg tooth on its beak.',
    'A chick can walk and peck for food on the very day it hatches, but it stays close to its mother for warmth.',
  ]),
  a('cow', 'cow', 'mammal', 'land', 'plants', true, 'calf', 'moo', [
    'A cow eats grass and gives us milk.',
    'A cow chews its food, swallows it, then brings it back up to chew again. That is called chewing the cud.',
    'A cow’s stomach has four parts, which help it turn tough grass into milk. Butter, cheese and yogurt all come from milk.',
  ]),
  a('goat', 'goat', 'mammal', 'land', 'plants', true, 'kid', 'maa', [
    'A goat has horns and a little beard.',
    'Goats are great climbers. They can walk along steep, rocky cliffs without falling.',
    'A goat’s eyes have pupils shaped like rectangles, which let it see almost all the way around to watch for danger.',
  ]),
  a('duck', 'duck', 'bird', 'land', 'both', false, 'duckling', 'quack', [
    'A duck swims on the pond and says quack.',
    'A duck’s feathers are oily, so water rolls right off and it never gets soaked.',
    'Ducklings can swim on their first day, and they follow their mother in a line wherever she goes.',
  ]),
  a('mouse', 'mouse', 'mammal', 'land', 'both', false, 'pup', 'squeak', [
    'A mouse is tiny. It has a long tail and big ears.',
    'A mouse can squeeze through a hole as small as a coin.',
    'A mouse’s whiskers feel its way in the dark, and its teeth never stop growing, so it has to keep nibbling.',
  ]),
  a('rat', 'rat', 'mammal', 'land', 'both', false, 'pup', 'squeak', [
    'A rat is like a big mouse, with a long tail.',
    'Rats are very clever and can learn tricks, like running through a maze.',
    'Rats wash themselves many times a day, and they laugh with tiny squeaks when they play.',
  ]),
  a('rabbit', 'bunny', 'mammal', 'land', 'plants', false, 'kit', 'a soft thump', [
    'A bunny hops. It has long ears and a fluffy tail.',
    'A bunny’s big ears can turn to hear a sound from any direction.',
    'A rabbit’s eyes are on the sides of its head, so it can see almost all the way around without turning.',
  ]),
  a('frog', 'frog', 'amphibian', 'land', 'animals', false, 'tadpole', 'ribbit', [
    'A frog hops and says ribbit.',
    'A baby frog is a tadpole. It has a tail and no legs, and it swims like a fish.',
    'A tadpole grows legs, loses its tail and climbs out of the water as a frog. A frog drinks through its skin.',
  ]),
  a('caterpillar', 'caterpillar', 'bug', 'land', 'plants', false, 'caterpillar', 'nothing at all', [
    'A caterpillar crawls and eats leaves.',
    'A caterpillar eats and eats, then wraps itself up. Inside, it turns into a butterfly.',
    'A caterpillar has twelve tiny eyes, but it can barely see. It finds leaves by feel and smell.',
  ]),
  a('ant', 'ant', 'bug', 'land', 'both', false, 'larva', 'nothing at all', [
    'An ant is tiny and very strong.',
    'An ant can carry something many times heavier than itself.',
    'Ants live together in a colony with one queen, and they talk by touching feelers and leaving smells to follow.',
  ]),
  a('ladybug', 'ladybug', 'bug', 'sky', 'animals', false, 'larva', 'nothing at all', [
    'A ladybug is red with black spots.',
    'A ladybug eats tiny bugs that hurt plants, so gardeners love it.',
    'A ladybug’s bright red color warns birds that it tastes bad. It hides its wings under its spotted shell.',
  ]),
  a('bee', 'bee', 'bug', 'sky', 'plants', false, 'larva', 'buzz', [
    'A bee buzzes from flower to flower.',
    'Bees make honey from the sweet nectar they find in flowers.',
    'A bee dances to tell the other bees where the best flowers are. Bees also help fruit and seeds grow.',
  ]),
  a('butterfly', 'butterfly', 'bug', 'sky', 'plants', false, 'caterpillar', 'nothing at all', [
    'A butterfly has four pretty wings.',
    'A butterfly was once a caterpillar.',
    'A butterfly tastes with its feet! It drinks nectar from flowers through a tube like a straw.',
  ]),
  a('snake', 'snake', 'reptile', 'land', 'animals', false, 'hatchling', 'hiss', [
    'A snake has no legs. It slides along the ground.',
    'A snake smells with its tongue, flicking it in and out.',
    'As a snake grows, its skin gets too tight, so it wriggles out of the old skin in one piece.',
  ]),
  a('bat', 'bat', 'mammal', 'sky', 'both', false, 'pup', 'squeak', [
    'A bat flies at night and sleeps in the day.',
    'A bat sleeps hanging upside down by its feet.',
    'A bat is the only mammal that can fly. In the dark it makes tiny squeaks and listens to the echoes to find its way.',
  ]),
  a('owl', 'owl', 'bird', 'sky', 'animals', false, 'owlet', 'hoot', [
    'An owl has big round eyes and says hoot.',
    'An owl hunts at night and can see in the dark.',
    'An owl can turn its head almost all the way around, and its soft feathers let it fly without a sound.',
  ]),
  // ---- wild animals ----
  a('lion', 'lion', 'mammal', 'land', 'animals', true, 'cub', 'roar', [
    'A lion is a big cat. It roars!',
    'Lions live together in a family called a pride.',
    'A lion’s roar is so loud it can be heard five miles away. Daniel spent a whole night with lions, and God kept him safe.',
  ]),
  a('elephant', 'elephant', 'mammal', 'land', 'plants', true, 'calf', 'trumpet', [
    'An elephant is the biggest animal on land.',
    'An elephant uses its long trunk to drink, to smell and to pick up food.',
    'An elephant flaps its big ears to keep cool, and it can hear sounds from miles away through its feet.',
  ]),
  a('giraffe', 'giraffe', 'mammal', 'land', 'plants', true, 'calf', 'a quiet hum', [
    'A giraffe is the tallest animal of all.',
    'A giraffe’s neck is so long it can eat leaves from the tops of trees.',
    'A giraffe’s tongue is as long as your arm and dark purple, and it only needs a short nap each day.',
  ]),
  a('zebra', 'zebra', 'mammal', 'land', 'plants', true, 'foal', 'bray', [
    'A zebra has black and white stripes.',
    'No two zebras have the same stripes, just like no two people have the same fingerprints.',
    'Zebras live in big herds, and their stripes make it hard for a lion to pick just one out of the crowd.',
  ]),
  a('monkey', 'monkey', 'mammal', 'land', 'both', false, 'baby', 'chatter', [
    'A monkey swings from tree to tree.',
    'Many monkeys can hang from a branch by their tail.',
    'Monkeys live in groups and groom each other’s fur to show they are friends.',
  ]),
  a('gorilla', 'gorilla', 'mammal', 'land', 'plants', true, 'baby', 'grunt', [
    'A gorilla is big and strong, with long arms.',
    'Gorillas eat leaves and fruit all day long.',
    'A father gorilla has silver hair on his back, so he is called a silverback. He keeps his family safe.',
  ]),
  a('bear', 'bear', 'mammal', 'land', 'both', true, 'cub', 'growl', [
    'A bear is big and furry.',
    'A bear sleeps for most of the winter in a cozy den.',
    'Bears love honey and berries. David fought off a bear to protect his sheep, long before he was king.',
  ]),
  a('fox', 'fox', 'mammal', 'land', 'both', false, 'kit', 'yip', [
    'A fox has red fur and a bushy tail.',
    'A fox sleeps curled up with its fluffy tail over its nose.',
    'A fox can hear a mouse squeak from far away, even under the snow, and pounce right on it.',
  ]),
  a('penguin', 'penguin', 'bird', 'land', 'animals', false, 'chick', 'squawk', [
    'A penguin is a bird that cannot fly.',
    'A penguin cannot fly, but it swims very fast, flapping its wings underwater.',
    'A penguin father keeps the egg warm on top of his feet through the long, cold winter.',
  ]),
  a('eagle', 'eagle', 'bird', 'sky', 'animals', true, 'eaglet', 'screech', [
    'An eagle is a big bird with huge wings.',
    'An eagle can see a rabbit from high, high up in the sky.',
    'An eagle’s eyes are much sharper than ours, and it builds its nest at the top of a tall tree or a cliff.',
  ]),
  a('bird', 'bird', 'bird', 'sky', 'both', false, 'chick', 'tweet', [
    'A bird has feathers and wings.',
    'A bird builds a nest for its eggs, and sings to say good morning.',
    'God used birds to feed Elijah: ravens brought him bread and meat every morning and evening.',
  ]),
  a('dove', 'dove', 'bird', 'sky', 'plants', false, 'squab', 'coo', [
    'A dove is a gentle white bird. It says coo.',
    'Noah sent a dove out from the ark, and it came back with an olive leaf.',
    'The olive leaf told Noah the water was going down. A dove is a sign of peace to this day.',
  ]),
  a('fish', 'fish', 'fish', 'sea', 'both', false, 'fry', 'nothing at all', [
    'A fish swims. It breathes under the water.',
    'A fish breathes with gills, and most fish are covered in shiny scales.',
    'Fish never close their eyes, because they have no eyelids. Jesus fed thousands of people with two small fish.',
  ]),
  a('tropical-fish', 'rainbow fish', 'fish', 'sea', 'both', false, 'fry', 'nothing at all', [
    'A rainbow fish has bright colors.',
    'Bright colors help a fish hide among the colorful coral.',
    'Coral reefs are like busy underwater cities, home to thousands of kinds of fish.',
  ]),
  a('dolphin', 'dolphin', 'mammal', 'sea', 'animals', true, 'calf', 'click and whistle', [
    'A dolphin jumps and plays in the sea.',
    'A dolphin is not a fish. It breathes air through a hole on top of its head.',
    'Dolphins talk with clicks and whistles, and each one has its own name-whistle.',
  ]),
  a('octopus', 'octopus', 'sea creature', 'sea', 'animals', false, 'larva', 'nothing at all', [
    'An octopus has eight arms.',
    'An octopus can change color to hide, and squirt ink to get away.',
    'An octopus has three hearts and blue blood, and it can squeeze through any gap bigger than its eye.',
  ]),
  a('whale', 'whale', 'mammal', 'sea', 'animals', true, 'calf', 'a song', [
    'A whale is the biggest animal in the sea.',
    'A whale is not a fish. It breathes air through a blowhole on its back.',
    'The blue whale is the biggest animal that has ever lived, as long as three buses, and it sings songs across the ocean.',
  ]),
  a('big-fish', 'big fish', 'fish', 'sea', 'animals', true, 'fry', 'nothing at all', [
    'A big fish swallowed Jonah. God kept him safe inside.',
    'The biggest fish alive today is the whale shark. It is as long as a bus, and it is gentle.',
    'The Bible says a great fish swallowed Jonah. A whale shark only eats tiny things, so it was a special fish God sent.',
  ]),
  a('camel', 'camel', 'mammal', 'land', 'plants', true, 'calf', 'grunt', [
    'A camel has a hump and lives in the desert.',
    'A camel’s hump is full of fat, not water, so it can go a long time without eating.',
    'A camel can close its nose to keep out blowing sand, and it has long eyelashes to protect its eyes.',
  ]),
  a('donkey', 'donkey', 'mammal', 'land', 'plants', true, 'foal', 'hee-haw', [
    'A donkey has long ears and says hee-haw.',
    'A donkey is small but strong, and it can carry heavy loads a long way.',
    'Jesus rode into Jerusalem on a donkey, while the crowd waved palm branches and shouted hosanna.',
  ]),
  a('big-horse', 'horse', 'mammal', 'land', 'plants', true, 'foal', 'neigh', [
    'A horse runs fast and says neigh.',
    'A horse can sleep standing up.',
    'A baby horse can stand and run just hours after it is born, and a horse’s hooves grow like our fingernails.',
  ]),
  a('quail', 'quail', 'bird', 'land', 'both', false, 'chick', 'a whistle', [
    'A quail is a small, round bird.',
    'Quail make their nests on the ground, hidden in the grass.',
    'When God’s people were hungry in the desert, He sent quail in the evening and manna in the morning.',
  ]),
]

const BY_ID = new Map(ANIMALS.map((x) => [x.id, x]))
export const animalById = (id: string) => BY_ID.get(id)

/** Animals in an island's story pages (the activities' animals are found in the island's data). */
export const STORY_ANIMALS: Record<string, string[]> = {
  noah: ['dove', 'lion', 'elephant', 'giraffe', 'zebra', 'sheep', 'cow', 'hen', 'duck', 'rabbit', 'bear', 'monkey'],
  creation: ['fish', 'bird', 'butterfly', 'rabbit', 'frog', 'ladybug'],
  david: ['sheep', 'lion', 'bear'],
  jonah: ['big-fish', 'whale', 'fish'],
  loaves: ['fish'],
  christmas: ['sheep', 'donkey', 'cow'],
  abraham: ['camel', 'sheep'],
  joseph: ['camel', 'cow', 'sheep'],
  'burning-bush': ['sheep', 'snake'],
  'red-sea': ['big-horse'],
  'baby-moses': [],
  jericho: [],
  manna: ['quail'],
  ruth: ['donkey'],
  samuel: [],
  elijah: ['bird'],
  esther: ['big-horse'],
  daniel: ['lion'],
  'boy-jesus': ['donkey', 'dove'],
  fishers: ['fish'],
  storm: ['fish'],
  'lost-sheep': ['sheep'],
  samaritan: ['donkey'],
  zacchaeus: [],
  'palm-sunday': ['donkey', 'big-horse'],
  easter: ['dove'],
  pentecost: ['dove'],
}

/** The animals an island's activities show (its things, by emoji or drawing). */
export function animalsIn(island: Island): string[] {
  const out = new Set<string>()
  const see = (t: Partial<Thing>) => {
    const item = (t.art ? itemById(t.art) : undefined) ?? (t.emoji ? itemForEmoji(t.emoji) : undefined)
    if (item && BY_ID.has(item.id)) out.add(item.id)
  }
  const walk = (o: unknown) => {
    if (Array.isArray(o)) return o.forEach(walk)
    if (o && typeof o === 'object') {
      const t = o as Partial<Thing>
      if (typeof t.emoji === 'string' || typeof t.art === 'string') see(t)
      Object.values(o).forEach(walk)
    }
  }
  for (const step of island.steps) if (step.kind !== 'story') walk(step)
  for (const id of STORY_ANIMALS[island.id] ?? []) out.add(id)
  return [...out]
}

/** The animals the player has met: those of the islands they've finished. */
export function animalsMet(p: Progress, islands: Island[]): Set<string> {
  const done = new Set(p.islandsDone)
  const out = new Set<string>()
  for (const isl of islands) if (done.has(isl.id)) for (const id of animalsIn(isl)) out.add(id)
  return out
}

/** How many of an animal's facts a reader at this level sees (and hears): one, two or all three. */
export const factsFor = (animal: Animal, readingLevel: number): string[] => animal.facts.slice(0, readingLevel >= 7 ? 3 : readingLevel >= 4 ? 2 : 1)

/** The sort games: which animals go in which group. */
export const SORTS = {
  home: {
    title: 'Where does it live?', intro: 'Where does each animal live? On the land, in the sea, or up in the sky?',
    hint: 'Drag it to where it lives!',
    groups: [
      { id: 'land', emoji: '🌳', art: 'tree', say: 'the land' },
      { id: 'sea', emoji: '🌊', art: 'sea', say: 'the sea' },
      { id: 'sky', emoji: '☁️', art: 'cloud', say: 'the sky' },
    ],
    group: (x: Animal) => x.home,
  },
  size: {
    title: 'Big or small?', intro: 'Is each animal bigger than you, or smaller than you?',
    hint: 'Drag it to the big side or the small side!',
    groups: [
      { id: 'big', emoji: '🦒', art: 'giraffe', say: 'bigger than you' },
      { id: 'small', emoji: '🐭', art: 'mouse', say: 'smaller than you' },
    ],
    group: (x: Animal) => (x.big ? 'big' : 'small'),
  },
} as const
export type SortKind = keyof typeof SORTS

/** Every line the book says, for the voice script and the warm-up (names, facts, and what the cards say). */
export function bookLines(): string[] {
  const out = new Set<string>()
  for (const x of ANIMALS) {
    out.add(`${x.name[0].toUpperCase()}${x.name.slice(1)}!`)
    for (const f of x.facts) out.add(f)
    out.add(`A ${x.name} lives ${HOME_NAMES[x.home]}. It eats ${EATS_NAMES[x.eats]}. A baby ${x.name} is called a ${x.baby}.`)
    out.add(x.sound === 'nothing at all' ? `A ${x.name} makes no sound at all.` : `A ${x.name} says ${x.sound}!`)
  }
  for (const s of Object.values(SORTS)) { out.add(s.intro); for (const g of s.groups) out.add(`That's right, ${g.say}!`) }
  return [...out]
}
