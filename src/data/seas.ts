// The voyage: the map is a run of seas, one for each part of the Bible, sailed in order. Each sea
// holds its islands in story order. An island here that isn't built yet (no entry in islands.ts)
// shows on the map as "coming soon". See docs/GAME-PLAN.md §3.
export interface SeaIsland {
  id: string
  name: string
  /** Its landmark on the map (drawn when art/items has a picture for it). */
  emoji: string
  /** A drawing (art/items id) to show as the landmark instead, for a thing no emoji names. */
  landmark?: string
}

export interface Sea {
  id: string
  name: string
  /** The water's colour on this sea's map. */
  color: string
  islands: SeaIsland[]
}

export const SEAS: Sea[] = [
  {
    id: 'beginning', name: 'In the Beginning', color: '#5fb7ff',
    islands: [
      { id: 'creation', name: 'Creation', emoji: '🌍' },
      { id: 'noah', name: "Noah's Ark", emoji: '🌈' },
      { id: 'abraham', name: "Abraham's Stars", emoji: '✨' },
      { id: 'joseph', name: "Joseph's Coat", emoji: '🧥' },
    ],
  },
  {
    id: 'egypt', name: 'Out of Egypt', color: '#4fb0d8',
    islands: [
      { id: 'baby-moses', name: 'Baby Moses', emoji: '👶', landmark: 'moses-basket' },
      { id: 'burning-bush', name: 'The Burning Bush', emoji: '🔥' },
      { id: 'red-sea', name: 'The Red Sea', emoji: '🌊' },
      { id: 'manna', name: 'Manna in the Desert', emoji: '🍯', landmark: 'manna-jar' },
    ],
  },
  {
    id: 'promised-land', name: 'The Promised Land', color: '#5ab8c8',
    islands: [
      { id: 'jericho', name: 'The Walls of Jericho', emoji: '🎺', landmark: 'rams-horn' },
      { id: 'ruth', name: 'Ruth and Naomi', emoji: '🌾' },
      { id: 'samuel', name: 'Samuel Listens', emoji: '🪔' },
      { id: 'david', name: 'David & Goliath', emoji: '🪨' },
    ],
  },
  {
    id: 'kings', name: 'Kings & Prophets', color: '#6aa8e8',
    islands: [
      { id: 'elijah', name: 'Elijah', emoji: '🔥', landmark: 'fire-from-heaven' },
      { id: 'esther', name: 'Queen Esther', emoji: '👑' },
      { id: 'daniel', name: 'Daniel & the Lions', emoji: '🦁' },
      { id: 'jonah', name: 'Jonah & the Big Fish', emoji: '🐋' },
    ],
  },
  {
    id: 'jesus-comes', name: 'Jesus Comes', color: '#7fa8f0',
    islands: [
      { id: 'christmas', name: 'Baby Jesus', emoji: '⭐' },
      { id: 'boy-jesus', name: 'Boy Jesus at the Temple', emoji: '📜' },
      { id: 'fishers', name: 'Fishers of People', emoji: '🐟' },
      { id: 'storm', name: 'Jesus Calms the Storm', emoji: '⛵' },
    ],
  },
  {
    id: 'stories', name: "Jesus' Stories & Miracles", color: '#5fc0b0',
    islands: [
      { id: 'loaves', name: 'Loaves & Fishes', emoji: '🧺' },
      { id: 'lost-sheep', name: 'The Lost Sheep', emoji: '🐑' },
      { id: 'samaritan', name: 'The Good Samaritan', emoji: '❤️' },
      { id: 'zacchaeus', name: 'Zacchaeus', emoji: '🌳' },
    ],
  },
  {
    id: 'easter', name: 'Easter & Beyond', color: '#9f9cf0',
    islands: [
      { id: 'palm-sunday', name: 'Palm Sunday', emoji: '🌴', landmark: 'palm-branch' },
      { id: 'easter', name: 'Easter Morning', emoji: '🌅', landmark: 'empty-tomb' },
      { id: 'pentecost', name: 'Pentecost', emoji: '🕊️', landmark: 'pentecost-flame' },
    ],
  },
]

/** Where the islands sit on a sea's map (1000 x 620), for a sea of 3 or 4 islands: a zig-zag voyage left to right. */
export function islandSpots(n: number): [number, number][] {
  if (n <= 3) return [[210, 410], [500, 230], [780, 410]].slice(0, n) as [number, number][]
  return [[200, 420], [400, 240], [600, 420], [790, 240]]
}

export const seaOf = (islandId: string) => SEAS.findIndex((s) => s.islands.some((i) => i.id === islandId))
