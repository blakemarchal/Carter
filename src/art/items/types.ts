import type { ComponentType } from 'react'

/**
 * One drawn picture of a thing: an animal, food, part of nature or an object. `Draw` draws it in a
 * 100 x 100 box (centred; standing things rest near y = 92). `emoji` lists the emoji it stands in
 * for, so content written with emoji gets the drawing; `name` is what it is (for screen readers).
 */
export interface Item {
  id: string
  name: string
  emoji?: string[]
  Draw: ComponentType
}
