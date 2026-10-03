// Every picture an activity shows is drawn (art/items or a story card), so it shows exactly what the
// narrator says and looks the same on every device. (Story pictures may still use a few emoji.)
import { expect, it } from 'vitest'
import { ISLANDS, type Thing } from '../data/islands'
import { RECIPES } from '../data/recipes'
import { CVC, LETTER_PICS } from '../data/words'
import { itemById, itemForEmoji } from '../art/items'

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
const drawn = (e: string, art?: string) =>
  (art?.startsWith('story:') ?? false) || (art ? !!itemById(art) : false) ||
  [...segmenter.segment(e)].every((g) => !!itemForEmoji(g.segment))

it('every activity picture is drawn', () => {
  const missing = new Set<string>()
  const check = (where: string, e: string, art?: string) => { if (!drawn(e, art)) missing.add(`${where}: ${e}${art ? ` (${art})` : ''}`) }
  const thing = (where: string, t: Thing) => check(where, t.emoji, t.art)
  for (const isl of ISLANDS) for (const s of isl.steps ?? []) {
    const at = `${isl.id} ${s.kind}`
    if (s.kind === 'pairs') s.animals.forEach((a) => check(at, a))
    if (s.kind === 'sequence') s.items.forEach((t) => thing(at, t))
    if (s.kind === 'sort') [...s.groups, ...s.items].forEach((t) => thing(at, t))
    if (s.kind === 'quiz') s.questions.forEach((q) => q.choices.forEach((c) => thing(at, c)))
    if (s.kind === 'count') { thing(at, s.item); check(`${at} container`, s.basket, s.basketArt) }
    if (s.kind === 'maze') { thing(at, s.hero); thing(at, s.goal) }
    if (s.kind === 'practice' && s.theme) check(at, s.theme)
    if (s.kind === 'reward') check(at, s.sticker)
  }
  for (const r of RECIPES) {
    check(`recipe ${r.id}`, r.emoji)
    for (const s of r.steps) {
      if (s.kind === 'add') check(`recipe ${r.id}`, s.item.emoji)
      if (s.kind === 'find') check(`recipe ${r.id} find`, s.emoji, s.art)
    }
  }
  for (const w of CVC) check(`word ${w.word}`, w.emoji)
  for (const [l, ws] of Object.entries(LETTER_PICS)) for (const w of ws) check(`letter ${l} ${w.word}`, w.emoji)
  expect([...missing]).toEqual([])
})
