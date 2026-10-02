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

/** How a Pal's friendly move looks in battle (see components/MoveFx.tsx). */
export type MoveFx = 'spark' | 'flame' | 'rock' | 'leaf' | 'hearts' | 'stars' | 'wind' | 'roll' | 'bubbles'

/**
 * Every Pal has three moves (see lib/moves.ts for when they unlock):
 *   basic  always known; fills 1 heart of friendship
 *   brave  a trickier question, fills 2 hearts
 *   super  charged by 3 first-try answers in a row, fills 3 hearts
 */
export type MoveKind = 'basic' | 'brave' | 'super'
export interface Move { name: string; fx: MoveFx; icon: string }

export interface PalDef {
  id: string
  species: 'mouse' | 'dragon' | 'serpent' | 'dove' | 'cloud' | 'cat'
  fruit: Fruit
  stages: PalStage[]
  moves: Record<MoveKind, Move>
  intro: string // spoken when tapped, after the Pal's name; {name} is its current name
  starter?: boolean
}

export const PALS: PalDef[] = [
  {
    id: 'zippy', species: 'mouse', fruit: 'Joy', starter: true,
    stages: [{ name: 'Zippy', xp: 0 }, { name: 'Sparkle', xp: 100 }, { name: 'Thunderjoy', xp: 300 }],
    moves: { basic: { name: 'Joy Spark', fx: 'spark', icon: '⚡' }, brave: { name: 'Twinkle Dash', fx: 'stars', icon: '🌟' }, super: { name: 'Thunder Joy', fx: 'spark', icon: '🌩️' } },
    intro: 'is a Joy Pal! {name} is full of happy sparkles, because the joy of the Lord is our strength!',
  },
  {
    id: 'ember', species: 'dragon', fruit: 'Faithfulness', starter: true,
    stages: [{ name: 'Ember', xp: 0 }, { name: 'Flarewing', xp: 100 }, { name: 'Glorydrake', xp: 300 }],
    moves: { basic: { name: 'Brave Flame', fx: 'flame', icon: '🔥' }, brave: { name: 'Wing Gust', fx: 'wind', icon: '🌪️' }, super: { name: 'Glory Blaze', fx: 'flame', icon: '☄️' } },
    intro: 'is a Faithfulness Pal! {name} is brave and always keeps promises, just like God.',
  },
  {
    id: 'pebble', species: 'serpent', fruit: 'Patience', starter: true,
    stages: [{ name: 'Pebble', xp: 0 }, { name: 'Boulderoo', xp: 100 }, { name: 'Rockmount', xp: 300 }],
    moves: { basic: { name: 'Rock Steady', fx: 'rock', icon: '🪨' }, brave: { name: 'Pebble Roll', fx: 'roll', icon: '🎳' }, super: { name: 'Mountain Hug', fx: 'rock', icon: '⛰️' } },
    intro: 'is a Patience Pal! {name} is strong and steady, like a house built on the rock.',
  },
  {
    id: 'pip', species: 'dove', fruit: 'Peace',
    stages: [{ name: 'Pip', xp: 0 }, { name: 'Olivewing', xp: 100 }, { name: 'Peacewing', xp: 300 }],
    moves: { basic: { name: 'Olive Leaf', fx: 'leaf', icon: '🍃' }, brave: { name: 'Peace Breeze', fx: 'wind', icon: '💨' }, super: { name: 'Dove Glow', fx: 'hearts', icon: '🕊️' } },
    intro: 'is a Peace Pal! {name} the dove brought Noah an olive leaf to show the flood was over.',
  },
  {
    id: 'rumble', species: 'cloud', fruit: 'Kindness',
    stages: [{ name: 'Rumble', xp: 0 }, { name: 'Drizzle', xp: 100 }, { name: 'Rainbowl', xp: 300 }],
    moves: { basic: { name: 'Rainbow Hug', fx: 'hearts', icon: '🌈' }, brave: { name: 'Puddle Splash', fx: 'bubbles', icon: '💦' }, super: { name: 'Double Rainbow', fx: 'hearts', icon: '🌈' } },
    intro: 'is a Kindness Pal! {name} used to be grumpy, but kindness made {name} a friend.',
  },
  {
    id: 'nova', species: 'cat', fruit: 'Self-Control',
    stages: [{ name: 'Nova', xp: 0 }, { name: 'Novastar', xp: 100 }, { name: 'Cosmira', xp: 300 }],
    moves: { basic: { name: 'Star Shine', fx: 'stars', icon: '⭐' }, brave: { name: 'Comet Swirl', fx: 'wind', icon: '🌀' }, super: { name: 'Galaxy Glow', fx: 'stars', icon: '🌌' } },
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
