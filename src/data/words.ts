export interface Picture {
  word: string
  emoji: string
}

// Short-vowel CVC words with clear pictures (Apple emoji render beautifully on iPad).
export const CVC: Picture[] = [
  { word: 'cat', emoji: '🐱' }, { word: 'dog', emoji: '🐶' }, { word: 'pig', emoji: '🐷' },
  { word: 'hen', emoji: '🐔' }, { word: 'fox', emoji: '🦊' }, { word: 'bat', emoji: '🦇' },
  { word: 'bug', emoji: '🐛' }, { word: 'sun', emoji: '☀️' }, { word: 'hat', emoji: '🎩' },
  { word: 'bed', emoji: '🛏️' }, { word: 'bus', emoji: '🚌' }, { word: 'box', emoji: '📦' },
  { word: 'map', emoji: '🗺️' }, { word: 'rat', emoji: '🐀' }, { word: 'web', emoji: '🕸️' },
  { word: 'ant', emoji: '🐜' }, { word: 'egg', emoji: '🥚' }, { word: 'cup', emoji: '☕' },
]

export const SIGHT = ['the', 'is', 'God', 'love', 'and', 'see', 'can', 'I', 'a', 'you', 'we', 'my', 'to', 'go']

export const LETTER_PICS: Record<string, Picture[]> = {
  b: [{ word: 'bear', emoji: '🐻' }, { word: 'ball', emoji: '⚽' }],
  c: [{ word: 'cat', emoji: '🐱' }, { word: 'cow', emoji: '🐮' }],
  d: [{ word: 'dog', emoji: '🐶' }, { word: 'duck', emoji: '🦆' }],
  f: [{ word: 'fish', emoji: '🐟' }, { word: 'fox', emoji: '🦊' }],
  l: [{ word: 'lion', emoji: '🦁' }, { word: 'leaf', emoji: '🍃' }],
  m: [{ word: 'monkey', emoji: '🐵' }, { word: 'moon', emoji: '🌙' }],
  p: [{ word: 'pig', emoji: '🐷' }, { word: 'penguin', emoji: '🐧' }],
  r: [{ word: 'rainbow', emoji: '🌈' }, { word: 'rabbit', emoji: '🐰' }],
  s: [{ word: 'sun', emoji: '☀️' }, { word: 'snake', emoji: '🐍' }],
  z: [{ word: 'zebra', emoji: '🦓' }],
  g: [{ word: 'gorilla', emoji: '🦍' }, { word: 'goat', emoji: '🐐' }],
  e: [{ word: 'elephant', emoji: '🐘' }, { word: 'egg', emoji: '🥚' }],
}
