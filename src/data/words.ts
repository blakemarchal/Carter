export interface Picture {
  word: string
  emoji: string
  /**
   * Other names a child might give the picture (🐶 "puppy"). A letter question never offers it as a
   * wrong answer for a letter one of these starts with, where it would look right.
   */
  alsoCalled?: string[]
}

// Short-vowel CVC words with clear pictures (Apple emoji render beautifully on iPad).
export const CVC: Picture[] = [
  { word: 'cat', emoji: '🐱' }, { word: 'dog', emoji: '🐶', alsoCalled: ['puppy'] }, { word: 'pig', emoji: '🐷' },
  { word: 'hen', emoji: '🐔', alsoCalled: ['chicken'] }, { word: 'fox', emoji: '🦊' }, { word: 'bat', emoji: '🦇' },
  { word: 'bug', emoji: '🐛' }, { word: 'sun', emoji: '☀️' }, { word: 'hat', emoji: '🎩' },
  { word: 'bed', emoji: '🛏️' }, { word: 'bus', emoji: '🚌' }, { word: 'box', emoji: '📦' },
  { word: 'map', emoji: '🗺️' }, { word: 'rat', emoji: '🐀' }, { word: 'web', emoji: '🕸️' },
  { word: 'ant', emoji: '🐜' }, { word: 'egg', emoji: '🥚' }, { word: 'cup', emoji: '☕', alsoCalled: ['coffee'] },
]

export const SIGHT = ['the', 'is', 'God', 'love', 'and', 'see', 'can', 'I', 'a', 'you', 'we', 'my', 'to', 'go']

export const LETTER_PICS: Record<string, Picture[]> = {
  b: [{ word: 'bear', emoji: '🐻' }, { word: 'ball', emoji: '⚽', alsoCalled: ['soccer ball'] }],
  c: [{ word: 'cat', emoji: '🐱' }, { word: 'cow', emoji: '🐮' }],
  d: [{ word: 'dog', emoji: '🐶', alsoCalled: ['puppy'] }, { word: 'duck', emoji: '🦆' }],
  f: [{ word: 'fish', emoji: '🐟' }, { word: 'fox', emoji: '🦊' }],
  l: [{ word: 'lion', emoji: '🦁' }, { word: 'leaf', emoji: '🍃' }],
  m: [{ word: 'monkey', emoji: '🐵' }, { word: 'moon', emoji: '🌙' }],
  p: [{ word: 'pig', emoji: '🐷' }, { word: 'penguin', emoji: '🐧' }],
  r: [{ word: 'rainbow', emoji: '🌈' }, { word: 'rabbit', emoji: '🐰', alsoCalled: ['bunny'] }],
  s: [{ word: 'sun', emoji: '☀️' }, { word: 'snake', emoji: '🐍' }],
  z: [{ word: 'zebra', emoji: '🦓' }],
  g: [{ word: 'gorilla', emoji: '🦍', alsoCalled: ['monkey'] }, { word: 'goat', emoji: '🐐' }],
  e: [{ word: 'elephant', emoji: '🐘' }, { word: 'egg', emoji: '🥚' }],
}
