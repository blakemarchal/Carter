import { describe, expect, it } from 'vitest'
import { LEVELS } from '../learn/levels'
import { itemById, itemForEmoji } from '../art/items'
import type { Skill } from '../lib/progress'

// The game plan's rule: pictures are drawn (art/items), never a device's emoji. Every emoji a learning
// question or exercise shows, alone or in a row ("🐟🐟🐟"), must have a drawing.
const EMOJI = /\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*/gu
const THEMES = [undefined, '💧', '🐟', '⭐', '🐑', '🌾']

function emojiIn(v: unknown, out: Set<string>, skip = new Set(['say'])) {
  if (typeof v === 'string') for (const m of v.match(EMOJI) ?? []) out.add(m)
  else if (Array.isArray(v)) v.forEach((x) => emojiIn(x, out, skip))
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!skip.has(k)) emojiIn(x, out, skip)
}

describe('learning pictures are drawn', () => {
  for (const skill of Object.keys(LEVELS) as Skill[]) {
    LEVELS[skill].forEach((level, i) => {
      it(`${skill} level ${i + 1}`, () => {
        const seen = new Set<string>()
        for (let n = 0; n < 300; n++) {
          const t = THEMES[n % THEMES.length]
          const q = level.question(t)
          // (a choice with its own drawing shows that, whatever its label)
          for (const c of q.choices) if (!(c.art && itemById(c.art))) emojiIn(c.label, seen)
          emojiIn(q.visual, seen)
          const ex = level.exercise?.(t)
          if (ex) emojiIn(ex, seen)
        }
        const missing = [...seen].filter((e) => !itemForEmoji(e))
        expect(missing, `no drawing for ${missing.join(' ')}`).toEqual([])
      })
    })
  }
})
