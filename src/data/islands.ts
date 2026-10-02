export interface Island {
  id: string
  name: string
  emoji: string
  color: string
  ready: boolean
}

export const ISLANDS: Island[] = [
  { id: 'noah', name: "Noah's Ark", emoji: '🌈', color: '#7cc6ff', ready: true },
  { id: 'creation', name: 'Creation', emoji: '🌍', color: '#5fd39a', ready: false },
  { id: 'david', name: 'David & Goliath', emoji: '🪨', color: '#ffb347', ready: false },
  { id: 'jonah', name: 'Jonah & the Big Fish', emoji: '🐋', color: '#5fb7ff', ready: false },
  { id: 'loaves', name: 'Loaves & Fishes', emoji: '🧺', color: '#ffd34d', ready: false },
  { id: 'christmas', name: 'Baby Jesus', emoji: '⭐', color: '#c9a8ff', ready: false },
  { id: 'birthday', name: "Carter's Birthday!", emoji: '🎂', color: '#ff8cc0', ready: false },
]
