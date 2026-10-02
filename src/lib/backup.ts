// Saves every player's progress to the server (POST /backup), and can restore it from there.
// Backups happen when she starts playing (at most every few hours) and after each island.

const PREFIX = 'carters-ark'
const LAST = 'carters-ark-backup:last' // when this device last backed up (not part of the backup)
const EVERY = 4 * 3600_000

function collect() {
  const keys: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!
    if (k.startsWith(PREFIX) && k !== LAST) keys[k] = localStorage.getItem(k)!
  }
  return { savedAt: new Date().toISOString(), keys }
}

/** Saves now. Resolves true if the server kept it. */
export async function backupNow(): Promise<boolean> {
  try {
    const r = await fetch('/backup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(collect()) })
    if (!r.ok) return false
    localStorage.setItem(LAST, new Date().toISOString())
    return true
  } catch {
    return false
  }
}

/** Saves if the last backup from this device is a few hours old. */
export function backupSoon() {
  try {
    const last = localStorage.getItem(LAST)
    if (!last || Date.now() - Date.parse(last) > EVERY) backupNow()
  } catch {
    /* storage unavailable */
  }
}

export const lastBackup = () => {
  try {
    return localStorage.getItem(LAST)
  } catch {
    return null
  }
}

/** The newest backup on the server, or null. */
export async function fetchBackup(): Promise<{ savedAt: string; keys: Record<string, string> } | null> {
  try {
    const r = await fetch('/backup', { cache: 'no-store' })
    return r.ok ? await r.json() : null
  } catch {
    return null
  }
}

/** Replaces this device's progress with a backup, then reloads. */
export function restore(b: { keys: Record<string, string> }) {
  for (const k of Object.keys(localStorage)) if (k.startsWith(PREFIX) && k !== LAST) localStorage.removeItem(k)
  for (const [k, v] of Object.entries(b.keys)) localStorage.setItem(k, v)
  location.reload()
}
