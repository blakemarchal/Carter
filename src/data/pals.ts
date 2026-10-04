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
/** `icon` shows the move itself, so a child who can't read yet can tell it apart: 🫧 for bubbles,
 *  🌊 for a splashing tail, 🌬️ for a breeze (not 💦 sweat drops, a 🐳 spout or a ⛵ boat). */
export interface Move { name: string; fx: MoveFx; icon: string }

export interface PalDef {
  id: string
  species:
    | 'mouse' | 'dragon' | 'serpent' | 'dove' | 'cloud' | 'cat'
    | 'sun' | 'night' | 'lion' | 'goat' | 'whale' | 'wave'
    | 'donkey' | 'crab' | 'lamb' | 'snow' | 'cupcake' | 'balloon'
    | 'camel' | 'star' | 'peacock' | 'chameleon' | 'wind' | 'tambourine' | 'cub' | 'owl'
    | 'crocodile' | 'lily' | 'hedgehog' | 'hyrax' | 'tortoise' | 'quail'
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
    moves: { basic: { name: 'Brave Flame', fx: 'flame', icon: '🔥' }, brave: { name: 'Wing Gust', fx: 'wind', icon: '💨' }, super: { name: 'Glory Blaze', fx: 'flame', icon: '☄️' } },
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
    moves: { basic: { name: 'Rainbow Hug', fx: 'hearts', icon: '🌈' }, brave: { name: 'Puddle Splash', fx: 'bubbles', icon: '💦' }, super: { name: 'Double Rainbow', fx: 'hearts', icon: '✨' } },
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
    moves: { basic: { name: 'Brave Roar', fx: 'wind', icon: '🦁' }, brave: { name: 'Golden Mane', fx: 'stars', icon: '🌟' }, super: { name: 'Lionheart Roar', fx: 'wind', icon: '📣' } },
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
    moves: { basic: { name: 'Bubble Blow', fx: 'bubbles', icon: '🫧' }, brave: { name: 'Tail Swish', fx: 'wind', icon: '🌊' }, super: { name: 'Whale of a Hug', fx: 'bubbles', icon: '🐋' } },
    intro: 'is a Patience Pal! God used {name} to keep Jonah safe for three days and three nights while Jonah prayed.',
  },
  {
    id: 'wavey', species: 'wave', fruit: 'Peace',
    stages: [{ name: 'Wavey', xp: 0 }, { name: 'Ripple', xp: 100 }, { name: 'Tidekeeper', xp: 300 }],
    moves: { basic: { name: 'Gentle Ripple', fx: 'bubbles', icon: '💧' }, brave: { name: 'Sea Breeze', fx: 'wind', icon: '🌬️' }, super: { name: 'Peaceful Tide', fx: 'bubbles', icon: '🌊' } },
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
    moves: { basic: { name: 'Sea Bubbles', fx: 'bubbles', icon: '🫧' }, brave: { name: 'Shell Roll', fx: 'roll', icon: '🐚' }, super: { name: 'Treasure Share', fx: 'hearts', icon: '💝' } },
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

  // The birthday party (Sprinkles comes to the party; Pouty is the grumpy balloon in its battle)
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
  // Abraham's Stars
  {
    id: 'humpy', species: 'camel', fruit: 'Patience',
    stages: [{ name: 'Humpy', xp: 0 }, { name: 'Dunewalker', xp: 100 }, { name: 'Starcaravan', xp: 300 }],
    moves: { basic: { name: 'Steady Steps', fx: 'rock', icon: '👣' }, brave: { name: 'Dune Roll', fx: 'roll', icon: '🏜️' }, super: { name: 'Starry Trek', fx: 'stars', icon: '✨' } },
    intro: 'is a Patience Pal! {name} used to grumble on the long, long walk, but now {name} knows that waiting for God is worth it.',
  },
  {
    id: 'twinkle', species: 'star', fruit: 'Goodness',
    stages: [{ name: 'Twinkle', xp: 0 }, { name: 'Starbright', xp: 100 }, { name: 'Promisestar', xp: 300 }],
    moves: { basic: { name: 'Twinkle Shine', fx: 'stars', icon: '⭐' }, brave: { name: 'Star Shower', fx: 'stars', icon: '🌠' }, super: { name: 'Promise Glow', fx: 'spark', icon: '🌟' } },
    intro: 'is a Goodness Pal! {name} twinkles to remind us that God is good, and He always keeps His promises, just like He did for Abraham.',
  },
  // Joseph's Coat
  {
    id: 'sulky', species: 'peacock', fruit: 'Love',
    stages: [{ name: 'Sulky', xp: 0 }, { name: 'Fanfeather', xp: 100 }, { name: 'Rainbowplume', xp: 300 }],
    moves: { basic: { name: 'Feather Fan', fx: 'wind', icon: '🪶' }, brave: { name: 'Color Splash', fx: 'hearts', icon: '🎨' }, super: { name: 'Rainbow Tail', fx: 'stars', icon: '🌈' } },
    intro: 'is a Love Pal! {name} used to be jealous, but now {name} knows that love is happy for others.',
  },
  {
    id: 'patches', species: 'chameleon', fruit: 'Kindness',
    stages: [{ name: 'Patches', xp: 0 }, { name: 'Colorcoat', xp: 100 }, { name: 'Rainbowrobe', xp: 300 }],
    moves: { basic: { name: 'Color Swap', fx: 'spark', icon: '🦎' }, brave: { name: 'Forgiving Hug', fx: 'hearts', icon: '🤗' }, super: { name: 'Coat of Colors', fx: 'stars', icon: '🧥' } },
    intro: 'is a Kindness Pal! {name} changes colors, and loves to forgive, just like Joseph forgave his brothers.',
  },
  // The Red Sea
  {
    id: 'gusty', species: 'wind', fruit: 'Self-Control',
    stages: [{ name: 'Gusty', xp: 0 }, { name: 'Breezy', xp: 100 }, { name: 'Windsong', xp: 300 }],
    moves: { basic: { name: 'Gentle Breeze', fx: 'wind', icon: '🌬️' }, brave: { name: 'Whirl Twirl', fx: 'roll', icon: '🌀' }, super: { name: 'Wind Song', fx: 'leaf', icon: '🍃' } },
    intro: 'is a Self-Control Pal! {name} used to huff and puff at everyone, but now {name} only blows when it helps, like the wind God sent to make a path through the sea.',
  },
  {
    id: 'jingle', species: 'tambourine', fruit: 'Joy',
    stages: [{ name: 'Jingle', xp: 0 }, { name: 'Timbrel', xp: 100 }, { name: 'Jubilee', xp: 300 }],
    moves: { basic: { name: 'Jingle Jangle', fx: 'spark', icon: '🎵' }, brave: { name: 'Happy Dance', fx: 'stars', icon: '💃' }, super: { name: 'Song of Joy', fx: 'hearts', icon: '🎶' } },
    intro: 'is a Joy Pal! {name} jingles and dances, just like Miriam did when God brought His people safely through the sea.',
  },
  // Daniel & the Lions
  {
    id: 'growly', species: 'cub', fruit: 'Gentleness',
    stages: [{ name: 'Growly', xp: 0 }, { name: 'Purrcy', xp: 100 }, { name: 'Gentlemane', xp: 300 }],
    moves: { basic: { name: 'Soft Paw', fx: 'hearts', icon: '🐾' }, brave: { name: 'Big Yawn', fx: 'wind', icon: '🥱' }, super: { name: 'Gentle Roar', fx: 'spark', icon: '🦁' } },
    intro: 'is a Gentleness Pal! {name} used to growl, but God made the lions gentle, and now {name} purrs.',
  },
  {
    id: 'hoot', species: 'owl', fruit: 'Faithfulness',
    stages: [{ name: 'Hoot', xp: 0 }, { name: 'Hootwing', xp: 100 }, { name: 'Wiseglow', xp: 300 }],
    moves: { basic: { name: 'Hoot Hello', fx: 'spark', icon: '🦉' }, brave: { name: 'Night Wing', fx: 'wind', icon: '🌙' }, super: { name: 'Prayer Glow', fx: 'stars', icon: '🙏' } },
    intro: 'is a Faithfulness Pal! {name} keeps watch at night, and prays every day, just like Daniel.',
  },
  // Baby Moses
  {
    id: 'snappy', species: 'crocodile', fruit: 'Self-Control',
    stages: [{ name: 'Snappy', xp: 0 }, { name: 'Grinny', xp: 100 }, { name: 'Riverking', xp: 300 }],
    moves: { basic: { name: 'Bubble Blow', fx: 'bubbles', icon: '🫧' }, brave: { name: 'Tail Splash', fx: 'bubbles', icon: '🌊' }, super: { name: 'River Hug', fx: 'hearts', icon: '💙' } },
    intro: 'is a Self-Control Pal! {name} used to go snap, snap, snap, but now {name} keeps a gentle smile, like the river that carried baby Moses safely.',
  },
  {
    id: 'lily', species: 'lily', fruit: 'Peace',
    stages: [{ name: 'Lily', xp: 0 }, { name: 'Lotusbloom', xp: 100 }, { name: 'Nilegrace', xp: 300 }],
    moves: { basic: { name: 'Petal Puff', fx: 'leaf', icon: '🌸' }, brave: { name: 'Lily Pad Hop', fx: 'roll', icon: '🪷' }, super: { name: 'Lotus Glow', fx: 'stars', icon: '✨' } },
    intro: 'is a Peace Pal! {name} floats calm and peaceful on the river, where God kept baby Moses safe in his basket.',
  },
  // The Burning Bush
  {
    id: 'prickles', species: 'hedgehog', fruit: 'Gentleness',
    stages: [{ name: 'Prickles', xp: 0 }, { name: 'Puffball', xp: 100 }, { name: 'Velvetquill', xp: 300 }],
    moves: { basic: { name: 'Soft Roll', fx: 'roll', icon: '🦔' }, brave: { name: 'Quill Tickle', fx: 'spark', icon: '🪶' }, super: { name: 'Snuggle Ball', fx: 'hearts', icon: '🤗' } },
    intro: "is a Gentleness Pal! {name} used to be all prickles, but now {name} is soft and kind, like God's gentle voice from the bush.",
  },
  {
    id: 'nibbles', species: 'hyrax', fruit: 'Goodness',
    stages: [{ name: 'Nibbles', xp: 0 }, { name: 'Rockhopper', xp: 100 }, { name: 'Cliffcrown', xp: 300 }],
    moves: { basic: { name: 'Rock Hop', fx: 'rock', icon: '🪨' }, brave: { name: 'Cliff Dash', fx: 'wind', icon: '💨' }, super: { name: 'Mountain Song', fx: 'stars', icon: '⛰️' } },
    intro: 'is a Goodness Pal! {name} lives in the rocks on the mountain, where God spoke to Moses from the bush that burned but did not burn up.',
  },
  // Manna in the Desert
  {
    id: 'shelly', species: 'tortoise', fruit: 'Patience',
    stages: [{ name: 'Shelly', xp: 0 }, { name: 'Sunshell', xp: 100 }, { name: 'Desertdome', xp: 300 }],
    moves: { basic: { name: 'Slow and Steady', fx: 'rock', icon: '🐢' }, brave: { name: 'Shell Spin', fx: 'roll', icon: '🌀' }, super: { name: 'Patient Glow', fx: 'stars', icon: '⭐' } },
    intro: 'is a Patience Pal! {name} used to grumble that dinner was too slow, but now {name} trusts God, who gives us what we need every day.',
  },
  {
    id: 'quilly', species: 'quail', fruit: 'Love',
    stages: [{ name: 'Quilly', xp: 0 }, { name: 'Quailbell', xp: 100 }, { name: 'Morningwing', xp: 300 }],
    moves: { basic: { name: 'Morning Peep', fx: 'spark', icon: '🐦' }, brave: { name: 'Feather Flurry', fx: 'wind', icon: '🪶' }, super: { name: 'Daily Bread', fx: 'hearts', icon: '🍞' } },
    intro: 'is a Love Pal! {name} remembers the desert mornings, when God sent bread from heaven for His people.',
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
