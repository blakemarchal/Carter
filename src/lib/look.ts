// How a child looks in the pictures (stories, bedtime, the birthday party), from their profile.
export interface KidLook {
  skin: 'light' | 'medium' | 'tan' | 'deep'
  hair: 'short' | 'ponytail' | 'pigtails' | 'curly' | 'long'
  hairColor: string
  /** Favorite color: their clothes in the pictures. */
  color: string
}

export const DEFAULT_LOOK: KidLook = { skin: 'light', hair: 'short', hairColor: '#7a4a24', color: '#5fb7ff' }

export const SKIN_TONES: KidLook['skin'][] = ['light', 'medium', 'tan', 'deep']
export const HAIR_STYLES: KidLook['hair'][] = ['short', 'curly', 'ponytail', 'pigtails', 'long']
export const HAIR_COLORS = ['#2b1d14', '#5a3a24', '#7a4a24', '#a8662f', '#d9a441', '#f2d27a', '#c0502a']
export const FAVORITE_COLORS = ['#ff8cc0', '#ff6b6b', '#ffa64d', '#ffd34d', '#5fd39a', '#5fb7ff', '#8d7cff', '#c9a8ff']

/** Icons a player can pick (on the title screen and in the Parent Corner). */
export const PLAYER_EMOJIS = ['🌈', '🦁', '🐳', '🌟', '🦄', '🐻', '🚀', '🌸', '🐶', '🧪']
