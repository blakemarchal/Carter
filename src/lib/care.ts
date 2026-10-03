// Looking after Pals on the Ark: dress-up accessories, feeding berries, and the mystery egg.
import { addPalXp, getProgress, today, update, type Progress } from './progress'
import { hasAgeSticker } from './party'

/** needs = stickers earned; `birthday`: comes with the first birthday party instead. */
export interface Accessory { id: string; emoji: string; name: string; needs: number; birthday?: boolean }

/** Earned with stickers: one more each time she finishes an island (and a party hat on a birthday). */
export const ACCESSORIES: Accessory[] = [
  { id: 'bow', emoji: '🎀', name: 'bow', needs: 0 },
  { id: 'flower', emoji: '🌸', name: 'flower', needs: 1 },
  { id: 'tophat', emoji: '🎩', name: 'top hat', needs: 2 },
  { id: 'sunhat', emoji: '👒', name: 'sun hat', needs: 3 },
  { id: 'cap', emoji: '🧢', name: 'cap', needs: 4 },
  { id: 'star', emoji: '⭐', name: 'star clip', needs: 5 },
  { id: 'rainbow', emoji: '🌈', name: 'rainbow clip', needs: 6 },
  { id: 'partyhat', emoji: '🥳', name: 'party hat', needs: 0, birthday: true },
]
export const accessoryById = (id?: string) => ACCESSORIES.find((a) => a.id === id)
export const unlockedAccessories = (p: Progress) =>
  ACCESSORIES.filter((a) => (a.birthday ? hasAgeSticker(p.stickers) : p.stickers.length >= a.needs))

export function wear(palId: string, accessory: string | null) {
  update((p) => {
    const outfits = { ...p.outfits }
    if (accessory) outfits[palId] = accessory
    else delete outfits[palId]
    return { ...p, outfits }
  })
}

// ---------- Feeding ----------

export const BERRIES = ['🍓', '🫐', '🍇', '🍒']
export const FEEDS_PER_DAY = 3
const FEED_XP = 5

export function feedsLeft(p: Progress, palId: string) {
  return FEEDS_PER_DAY - (p.fed.day === today() ? p.fed.counts[palId] ?? 0 : 0)
}

/** Feeds a berry if there are feeds left today. Returns false when the Pal is full. */
export function feed(palId: string) {
  if (feedsLeft(getProgress(), palId) <= 0) return false
  update((p) => {
    const counts = p.fed.day === today() ? { ...p.fed.counts } : {}
    counts[palId] = (counts[palId] ?? 0) + 1
    return { ...p, fed: { day: today(), counts } }
  })
  addPalXp(palId, FEED_XP)
  return true
}

// ---------- The mystery egg ----------

export const EGG_PAL = 'nova' // the hidden legendary Pal
export const EGG_DAYS = 3

/** The egg shows up after her first island, until it hatches. */
export const eggActive = (p: Progress) => p.islandsDone.length >= 1 && !(EGG_PAL in p.pals)
export const eggReady = (p: Progress) => eggActive(p) && p.egg.warmth >= EGG_DAYS

/** Once a day, when she starts playing, the egg gets a little warmer. */
export function warmEgg() {
  const p = getProgress()
  if (!eggActive(p) || p.egg.day === today()) return
  update((x) => ({ ...x, egg: { warmth: Math.min(EGG_DAYS, x.egg.warmth + 1), day: today() } }))
}

export function hatchEgg() {
  addPalXp(EGG_PAL, 0)
}
