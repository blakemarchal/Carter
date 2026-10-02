// Ark Pals: original Pokémon-style companions. Types are the Fruit of the Spirit (Galatians 5:22–23).

export type Fruit =
  | 'Love' | 'Joy' | 'Peace' | 'Patience' | 'Kindness'
  | 'Goodness' | 'Faithfulness' | 'Gentleness' | 'Self-Control'

export const FRUIT_COLOR: Record<Fruit, string> = {
  Love: '#ff5d9e',
  Joy: '#ffc928',
  Peace: '#7cc6ff',
  Patience: '#9b8cff',
  Kindness: '#5fd39a',
  Goodness: '#ff9b4a',
  Faithfulness: '#ff6a4d',
  Gentleness: '#f7a8d8',
  'Self-Control': '#7a8aa0',
}

export interface PalStage {
  name: string
  xp: number // xp needed to reach this stage
}

export interface PalDef {
  id: string
  species: 'mouse' | 'dragon' | 'serpent' | 'dove' | 'cloud' | 'cat'
  fruit: Fruit
  stages: PalStage[]
  move: string // friendly "battle" move name
  intro: string // spoken when tapped, after the Pal's name; {name} is its current name
  starter?: boolean
}

export const PALS: PalDef[] = [
  {
    id: 'zippy', species: 'mouse', fruit: 'Joy', starter: true,
    stages: [{ name: 'Zippy', xp: 0 }, { name: 'Sparkle', xp: 100 }, { name: 'Thunderjoy', xp: 300 }],
    move: 'Joy Spark',
    intro: 'is a Joy Pal! {name} is full of happy sparkles, because the joy of the Lord is our strength!',
  },
  {
    id: 'ember', species: 'dragon', fruit: 'Faithfulness', starter: true,
    stages: [{ name: 'Ember', xp: 0 }, { name: 'Flarewing', xp: 100 }, { name: 'Glorydrake', xp: 300 }],
    move: 'Brave Flame',
    intro: 'is a Faithfulness Pal! {name} is brave and always keeps promises, just like God.',
  },
  {
    id: 'pebble', species: 'serpent', fruit: 'Patience', starter: true,
    stages: [{ name: 'Pebble', xp: 0 }, { name: 'Boulderoo', xp: 100 }, { name: 'Rockmount', xp: 300 }],
    move: 'Rock Steady',
    intro: 'is a Patience Pal! {name} is strong and steady, like a house built on the rock.',
  },
  {
    id: 'pip', species: 'dove', fruit: 'Peace',
    stages: [{ name: 'Pip', xp: 0 }, { name: 'Olivewing', xp: 100 }, { name: 'Peacewing', xp: 300 }],
    move: 'Olive Leaf',
    intro: 'is a Peace Pal! {name} the dove brought Noah an olive leaf to show the flood was over.',
  },
  {
    id: 'rumble', species: 'cloud', fruit: 'Kindness',
    stages: [{ name: 'Rumble', xp: 0 }, { name: 'Drizzle', xp: 100 }, { name: 'Rainbowl', xp: 300 }],
    move: 'Rainbow Hug',
    intro: 'is a Kindness Pal! {name} used to be grumpy, but kindness made {name} a friend.',
  },
  {
    id: 'nova', species: 'cat', fruit: 'Self-Control',
    stages: [{ name: 'Nova', xp: 0 }, { name: 'Novastar', xp: 100 }, { name: 'Cosmira', xp: 300 }],
    move: 'Star Shine',
    intro: 'is a legendary Self-Control Pal! {name} lives among the stars God made.',
  },
]

export const palById = (id: string) => PALS.find((p) => p.id === id)!

export function stageFor(pal: PalDef, xp: number) {
  let i = 0
  pal.stages.forEach((s, idx) => xp >= s.xp && (i = idx))
  return i
}

/** What a Pal says about itself, using the name for its current stage. */
export const palIntro = (pal: PalDef, stage = 0) => {
  const name = pal.stages[stage].name
  return `${name} ${pal.intro.replaceAll('{name}', name)}`
}
