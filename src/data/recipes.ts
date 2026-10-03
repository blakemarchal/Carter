// Pal Kitchen recipes. Each recipe is a few cooking steps, and every step teaches something:
//   add      count ingredients into the bowl (counting)
//   find     read the label on the right jar (reading 3-letter words)
//   pattern  finish a fruit pattern (patterns)
//   cut      pick the right way to cut: halves, triangles or 4 pieces (shapes, first fractions)
//   stir     stir round the bowl with a finger (counting the stirs)
//   bake     into the oven, count down 3, 2, 1… ding!
//   candles  a candle on the cake for each year (the birthday cake, only on a birthday)
import type { Fruit } from './pals'

export interface Ingredient { emoji: string; say: string; plural: string }

export type CookStep =
  | { kind: 'add'; item: Ingredient; n: number }
  /** `emoji` is what's inside the right jar; `art` picks a particular drawing of it (see components/Pic.tsx). */
  | { kind: 'find'; word: string; emoji: string; art?: string; others: string[] }
  | { kind: 'pattern'; items: string[]; names: string[]; shown: number }
  | { kind: 'cut'; food: string; foodName: string; cut: 'halves' | 'triangles' | 'quarters' }
  | { kind: 'stir'; times: number }
  | { kind: 'bake'; what: string; many?: boolean }
  | { kind: 'candles'; n: number }

/** `many`: the dish is plural ("the cookies are ready"); otherwise "the pizza is ready". */
export interface Recipe { id: string; name: string; emoji: string; many?: boolean; steps: CookStep[] }

const I = {
  strawberry: { emoji: '🍓', say: 'strawberry', plural: 'strawberries' },
  blueberry: { emoji: '🫐', say: 'blueberry', plural: 'blueberries' },
  banana: { emoji: '🍌', say: 'banana', plural: 'bananas' },
  egg: { emoji: '🥚', say: 'egg', plural: 'eggs' },
  apple: { emoji: '🍎', say: 'apple', plural: 'apples' },
  chip: { emoji: '🍫', say: 'chocolate chip', plural: 'chocolate chips' },
  carrot: { emoji: '🥕', say: 'carrot', plural: 'carrots' },
  tomato: { emoji: '🍅', say: 'tomato', plural: 'tomatoes' },
  cheese: { emoji: '🧀', say: 'cheese', plural: 'pieces of cheese' },
  grape: { emoji: '🍇', say: 'grape', plural: 'grapes' },
} satisfies Record<string, Ingredient>

export const RECIPES: Recipe[] = [
  {
    id: 'pancakes', name: 'Pancakes', emoji: '🥞', many: true, steps: [
      { kind: 'add', item: I.egg, n: 2 },
      { kind: 'stir', times: 3 },
      { kind: 'bake', what: 'pancakes', many: true },
      { kind: 'pattern', items: ['🍓', '🫐'], names: ['strawberry', 'blueberry'], shown: 5 },
    ],
  },
  {
    id: 'cookies', name: 'Cookies', emoji: '🍪', many: true, steps: [
      { kind: 'find', word: 'egg', emoji: '🥚', others: ['jam', 'bun'] },
      { kind: 'add', item: I.chip, n: 5 },
      { kind: 'stir', times: 2 },
      { kind: 'bake', what: 'cookies', many: true },
    ],
  },
  {
    id: 'sandwich', name: 'Jam Sandwich', emoji: '🥪', steps: [
      { kind: 'find', word: 'jam', emoji: '🍓', others: ['egg', 'nut'] },
      { kind: 'add', item: I.banana, n: 3 },
      { kind: 'cut', food: '🥪', foodName: 'sandwich', cut: 'triangles' },
    ],
  },
  {
    id: 'smoothie', name: 'Berry Smoothie', emoji: '🥤', steps: [
      { kind: 'add', item: I.strawberry, n: 4 },
      { kind: 'add', item: I.blueberry, n: 3 },
      { kind: 'stir', times: 3 },
    ],
  },
  {
    id: 'pizza', name: 'Pizza', emoji: '🍕', steps: [
      { kind: 'find', word: 'bun', emoji: '🍞', others: ['jam', 'fig'] },
      { kind: 'pattern', items: ['🍅', '🧀'], names: ['tomato', 'cheese'], shown: 5 },
      { kind: 'bake', what: 'pizza' },
      { kind: 'cut', food: '🍕', foodName: 'pizza', cut: 'quarters' },
    ],
  },
  {
    id: 'salad', name: 'Fruit Salad', emoji: '🥗', steps: [
      { kind: 'add', item: I.apple, n: 2 },
      { kind: 'add', item: I.grape, n: 6 },
      { kind: 'pattern', items: ['🍓', '🍌', '🍌'], names: ['strawberry', 'banana', 'banana'], shown: 6 },
      { kind: 'stir', times: 2 },
    ],
  },
  {
    id: 'soup', name: 'Veggie Soup', emoji: '🍲', steps: [
      { kind: 'add', item: I.carrot, n: 4 },
      { kind: 'add', item: I.tomato, n: 2 },
      { kind: 'stir', times: 4 },
      { kind: 'find', word: 'pot', emoji: '🍲', art: 'pot', others: ['cup', 'pan'] },
    ],
  },
  {
    id: 'toast', name: 'Cheese Toast', emoji: '🍞', steps: [
      { kind: 'add', item: I.cheese, n: 3 },
      { kind: 'bake', what: 'toast' },
      { kind: 'cut', food: '🍞', foodName: 'toast', cut: 'halves' },
    ],
  },
]

/** Each Pal's favorite food, by its fruit of the Spirit. */
const FAVORITE: Record<Fruit, string> = {
  Love: 'cookies', Joy: 'pancakes', Peace: 'smoothie', Patience: 'soup', Kindness: 'sandwich',
  Goodness: 'pizza', Faithfulness: 'salad', Gentleness: 'toast', 'Self-Control': 'salad',
}
export const recipeFor = (fruit: Fruit) => RECIPES.find((r) => r.id === FAVORITE[fruit])!

/** On their birthday: a cake to share with a Pal, with a candle for each year. */
export const birthdayCake = (candles: number): Recipe => ({
  id: 'cake', name: 'Birthday Cake', emoji: '🎂', steps: [
    { kind: 'add', item: I.egg, n: 3 },
    { kind: 'add', item: I.strawberry, n: 2 },
    { kind: 'stir', times: 3 },
    { kind: 'bake', what: 'cake' },
    { kind: 'candles', n: Math.max(1, Math.min(12, candles)) },
  ],
})
