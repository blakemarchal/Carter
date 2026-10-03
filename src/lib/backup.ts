// Saves every player's progress to the server (POST /backup), and can restore it from there.
// Each device labels its backups ("iPad", "Windows computer"…), so restoring is always a choice
// between named copies, never "whatever was saved last". Restoring first saves the current state.
// Backups happen when she starts playing (at most every few hours) and after each island.

const PREFIX = 'carters-ark'
const LAST = 'carters-ark-backup:last' // when this device last backed up (not part of the backup)
const DEVICE = 'carters-ark-backup:device' // this device's random id (not part of the backup)
const EVERY = 4 * 3600_000

export interface BackupInfo {
  id: string
  savedAt: string | null
  device: string
  label: string
  players: { name: string; emoji?: string; islands: number; pals: number }[]
}

function deviceId() {
  try {
    let id = localStorage.getItem(DEVICE)
    if (!id) {
      id = Array.from(crypto.getRandomValues(new Uint8Array(5)), (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 10)
      localStorage.setItem(DEVICE, id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

/** A friendly name for this device. */
export function deviceLabel() {
  const ua = navigator.userAgent
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'iPad'
  if (/iPhone/.test(ua)) return 'iPhone'
  if (/Android/.test(ua)) return 'Android tablet or phone'
  if (/Windows/.test(ua)) return 'Windows computer'
  if (/Macintosh/.test(ua)) return 'Mac'
  return 'This device'
}

function collect() {
  const keys: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!
    if (k.startsWith(PREFIX) && k !== LAST && k !== DEVICE) keys[k] = localStorage.getItem(k)!
  }
  return { savedAt: new Date().toISOString(), device: deviceId(), label: deviceLabel(), keys }
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

/** Every backup on the server, newest first. */
export async function listBackups(): Promise<BackupInfo[] | null> {
  try {
    const r = await fetch('/backups', { cache: 'no-store' })
    return r.ok ? await r.json() : null
  } catch {
    return null
  }
}

/** One backup's contents. */
export async function fetchBackup(id: string): Promise<{ savedAt: string; keys: Record<string, string> } | null> {
  try {
    const r = await fetch(`/backup?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
    return r.ok ? await r.json() : null
  } catch {
    return null
  }
}

/** Replaces this device's progress with a backup, then reloads. */
export function restore(b: { keys: Record<string, string> }) {
  for (const k of Object.keys(localStorage)) if (k.startsWith(PREFIX) && k !== LAST && k !== DEVICE) localStorage.removeItem(k)
  for (const [k, v] of Object.entries(b.keys)) localStorage.setItem(k, v)
  location.reload()
}
