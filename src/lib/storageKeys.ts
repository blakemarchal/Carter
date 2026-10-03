// Where the game saves things on the device. Everything starts with "ark-pals".
export const NS = 'ark-pals'
export const PROFILES_KEY = `${NS}:profiles`
export const FAMILY_KEY = `${NS}:family`
export const progressKey = (id: string) => `${NS}:v1:${id}`
/** Not part of a backup: when this device last backed up, and its random device id. */
export const BACKUP_LAST = `${NS}-backup:last`
export const BACKUP_DEVICE = `${NS}-backup:device`

/** The game's first name, for moving older saves (and restoring older backups). */
export const OLD_NS = 'carters-ark'
/** How the game drew the player of a save from before there were players (kept when it moves). */
const FIRST_LOOK = { skin: 'light', hair: 'ponytail', hairColor: '#7a4a24', color: '#ff8cc0' }

interface KV {
  readonly length: number
  key(i: number): string | null
  getItem(k: string): string | null
  setItem(k: string, v: string): void
  removeItem(k: string): void
}

/**
 * Moves anything saved under the game's first name ("carters-ark…") to "ark-pals…". Progress saved
 * before there were players (the bare "…:v1") belongs to the first player on the device (or a new
 * "player" if there was no player list yet), who keeps the look the game drew them with. An old
 * copy is only removed once the new one is saved. Safe to run on every start. Returns how many moved.
 */
export function migrateStorage(s: KV): number {
  const old: string[] = []
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i)
    if (k?.startsWith(OLD_NS)) old.push(k)
  }
  if (!old.length) return 0
  let index: { list?: { id?: string }[] } | null = null
  try {
    index = JSON.parse(s.getItem(`${OLD_NS}:profiles`) ?? s.getItem(PROFILES_KEY) ?? 'null')
  } catch {
    index = null
  }
  const first = index?.list?.[0]?.id ?? 'player'
  const bare = s.getItem(`${OLD_NS}:v1`) !== null
  let moved = 0
  for (const k of old) {
    const v = s.getItem(k)
    if (v === null) continue
    const to = k === `${OLD_NS}:v1` ? progressKey(first) : NS + k.slice(OLD_NS.length)
    try {
      if (s.getItem(to) === null) s.setItem(to, v)
      if (s.getItem(to) !== null) {
        s.removeItem(k)
        moved++
      }
    } catch {
      /* storage full or unavailable: keep the old copy, try again next time */
    }
  }
  if (bare) {
    try {
      const list = JSON.parse(s.getItem(PROFILES_KEY) ?? 'null')
      const p = list?.list?.find((x: { id?: string }) => x.id === first)
      if (p && !p.look) {
        p.look = FIRST_LOOK
        s.setItem(PROFILES_KEY, JSON.stringify(list))
      }
    } catch {
      /* leave it: a grown-up can pick a look in the Parent Corner */
    }
  }
  return moved
}
