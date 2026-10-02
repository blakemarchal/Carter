// Pal Kitchen: each day two of her Pals get hungry. Cooking their favorite food fills them up.
import { addPalXp, getProgress, today, update, type Progress } from './progress'

export const HUNGRY_PER_DAY = 2
const HUNGRY_XP = 25 // cooking for a hungry Pal
const SNACK_XP = 5 // cooking again for a Pal who's already eaten today

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

/** Today's hungry Pals: picked from the date and player, so they stay the same all day. */
export function hungryPals(p: Progress, player: string): string[] {
  const owned = Object.keys(p.pals).sort()
  if (!owned.length) return []
  const d = today()
  const picks = new Set<string>()
  for (let i = 0; picks.size < Math.min(HUNGRY_PER_DAY, owned.length); i++) picks.add(owned[hash(`${d}|${player}|${i}`) % owned.length])
  return [...picks].filter((id) => p.cooked[id] !== d)
}

/** Serves the food. Returns the XP the Pal got. */
export function serve(palId: string, wasHungry: boolean) {
  const first = getProgress().cooked[palId] !== today()
  update((p) => ({ ...p, cooked: { ...p.cooked, [palId]: today() } }))
  const xp = wasHungry && first ? HUNGRY_XP : SNACK_XP
  addPalXp(palId, xp)
  return xp
}
