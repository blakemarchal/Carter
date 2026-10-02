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
  species:
    | 'mouse' | 'dragon' | 'serpent' | 'dove' | 'cloud' | 'cat'
    | 'sun' | 'night' | 'lion' | 'goat' | 'whale' | 'wave'
    | 'donkey' | 'crab' | 'lamb' | 'snow' | 'cupcake' | 'balloon'
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

  // Creation island
  {
    id: 'sunny', species: 'sun', fruit: 'Joy',
    stages: [{ name: 'Sunny', xp: 0 }, { name: 'Sunbeam', xp: 100 }, { name: 'Radiance', xp: 300 }],
    moves: { basic: { name: 'Sunshine Smile', fx: 'stars', icon: '☀️' }, brave: { name: 'Warm Glow', fx: 'flame', icon: '🌞' }, super: { name: 'Let There Be Light', fx: 'stars', icon: '✨' } },
    intro: 'is a Joy Pal! {name} shines bright, like the light God made on the very first day!',
  },
  {
    id: 'gloomy', species: 'night', fruit: 'Gentleness',
    stages: [{ name: 'Gloomy', xp: 0 }, { name: 'Twilight', xp: 100 }, { name: 'Starlight', xp: 300 }],
    moves: { basic: { name: 'Twinkle Hush', fx: 'stars', icon: '🌙' }, brave: { name: 'Lullaby Breeze', fx: 'wind', icon: '🌬️' }, super: { name: 'Starlight Shimmer', fx: 'stars', icon: '💫' } },
    intro: 'is a Gentleness Pal! {name} glows soft and gentle, like the moon and stars God made to light the night.',
  },

  // David & Goliath island
  {
    id: 'lionel', species: 'lion', fruit: 'Faithfulness',
    stages: [{ name: 'Lionel', xp: 0 }, { name: 'Roary', xp: 100 }, { name: 'Braveheart', xp: 300 }],
    moves: { basic: { name: 'Brave Roar', fx: 'wind', icon: '🦁' }, brave: { name: 'Golden Mane', fx: 'stars', icon: '🌟' }, super: { name: 'Lionheart Roar', fx: 'wind', icon: '👑' } },
    intro: 'is a Faithfulness Pal! {name} is brave like David, because God is always with us.',
  },
  {
    id: 'huffy', species: 'goat', fruit: 'Self-Control',
    stages: [{ name: 'Huffy', xp: 0 }, { name: 'Hornsby', xp: 100 }, { name: 'Summit', xp: 300 }],
    moves: { basic: { name: 'Deep Breath', fx: 'wind', icon: '💨' }, brave: { name: 'Hilltop Hop', fx: 'rock', icon: '🏔️' }, super: { name: 'Summit Calm', fx: 'wind', icon: '🌄' } },
    intro: 'is a Self-Control Pal! {name} used to huff and puff, but now {name} takes a big, calm breath.',
  },

  // Jonah island
  {
    id: 'bubbles', species: 'whale', fruit: 'Patience',
    stages: [{ name: 'Bubbles', xp: 0 }, { name: 'Splashy', xp: 100 }, { name: 'Oceana', xp: 300 }],
    moves: { basic: { name: 'Bubble Blow', fx: 'bubbles', icon: '💦' }, brave: { name: 'Tail Swish', fx: 'wind', icon: '🐳' }, super: { name: 'Whale of a Hug', fx: 'bubbles', icon: '🐋' } },
    intro: 'is a Patience Pal! {name} kept Jonah safe inside for three days while he prayed to God.',
  },
  {
    id: 'wavey', species: 'wave', fruit: 'Peace',
    stages: [{ name: 'Wavey', xp: 0 }, { name: 'Ripple', xp: 100 }, { name: 'Tidekeeper', xp: 300 }],
    moves: { basic: { name: 'Gentle Ripple', fx: 'bubbles', icon: '💧' }, brave: { name: 'Sea Breeze', fx: 'wind', icon: '⛵' }, super: { name: 'Peaceful Tide', fx: 'bubbles', icon: '🌊' } },
    intro: 'is a Peace Pal! {name} was a big stormy wave, but God made the sea calm, and now {name} is calm too.',
  },

  // Loaves & Fishes island
  {
    id: 'basket', species: 'donkey', fruit: 'Kindness',
    stages: [{ name: 'Basket', xp: 0 }, { name: 'Trotter', xp: 100 }, { name: 'Gentlehoof', xp: 300 }],
    moves: { basic: { name: 'Sharing Basket', fx: 'hearts', icon: '🧺' }, brave: { name: 'Hay Sprinkle', fx: 'leaf', icon: '🌾' }, super: { name: 'Loaves Galore', fx: 'hearts', icon: '🍞' } },
    intro: 'is a Kindness Pal! {name} carries the baskets of bread and fish that Jesus shared with everyone.',
  },
  {
    id: 'crabby', species: 'crab', fruit: 'Goodness',
    stages: [{ name: 'Crabby', xp: 0 }, { name: 'Sharewell', xp: 100 }, { name: 'Kingclaw', xp: 300 }],
    moves: { basic: { name: 'Sea Bubbles', fx: 'bubbles', icon: '🦀' }, brave: { name: 'Shell Roll', fx: 'roll', icon: '🐚' }, super: { name: 'Treasure Share', fx: 'hearts', icon: '💝' } },
    intro: 'is a Goodness Pal! {name} loves to share, just like the boy who gave Jesus his five loaves and two fish.',
  },

  // Christmas island
  {
    id: 'starling', species: 'lamb', fruit: 'Love',
    stages: [{ name: 'Starling', xp: 0 }, { name: 'Woolly', xp: 100 }, { name: 'Shepherdee', xp: 300 }],
    moves: { basic: { name: 'Woolly Hug', fx: 'hearts', icon: '🐑' }, brave: { name: 'Christmas Star', fx: 'stars', icon: '🌟' }, super: { name: "Shepherd's Love", fx: 'hearts', icon: '💖' } },
    intro: 'is a Love Pal! {name} came to see baby Jesus, God\'s best gift of love, on the very first Christmas.',
  },
  {
    id: 'chilly', species: 'snow', fruit: 'Gentleness',
    stages: [{ name: 'Chilly', xp: 0 }, { name: 'Frosty', xp: 100 }, { name: 'Snowglow', xp: 300 }],
    moves: { basic: { name: 'Snowflake Swirl', fx: 'wind', icon: '❄️' }, brave: { name: 'Snowball Roll', fx: 'roll', icon: '⛄' }, super: { name: 'Gentle Snowfall', fx: 'wind', icon: '🌨️' } },
    intro: 'is a Gentleness Pal! {name} was frosty and grumpy, but the love of baby Jesus made {name} soft and gentle, like falling snow.',
  },

  // Birthday island
  {
    id: 'sprinkles', species: 'cupcake', fruit: 'Joy',
    stages: [{ name: 'Sprinkles', xp: 0 }, { name: 'Swirly', xp: 100 }, { name: 'Celebrake', xp: 300 }],
    moves: { basic: { name: 'Sprinkle Shower', fx: 'stars', icon: '🧁' }, brave: { name: 'Frosting Swirl', fx: 'wind', icon: '🍦' }, super: { name: 'Party Sparkle', fx: 'stars', icon: '🎉' } },
    intro: 'is a Joy Pal! {name} loves birthdays, because God made you and loves you, and that is worth a party!',
  },
  {
    id: 'pouty', species: 'balloon', fruit: 'Love',
    stages: [{ name: 'Pouty', xp: 0 }, { name: 'Floaty', xp: 100 }, { name: 'Partyloon', xp: 300 }],
    moves: { basic: { name: 'Floaty Hug', fx: 'hearts', icon: '🎈' }, brave: { name: 'Ribbon Twirl', fx: 'wind', icon: '🎀' }, super: { name: 'Love Lift', fx: 'hearts', icon: '💗' } },
    intro: 'is a Love Pal! {name} used to pout, but now {name} floats up happy, because God loves us every single day.',
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
