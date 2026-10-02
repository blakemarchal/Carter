// App updates. Every build has an id (baked in here, and published by the server as /version.json).
// When the server has a newer build, the app shows an "Update" button. Updating drops the cached app
// and the service worker, then reloads from the server. Saved progress and narration clips are kept.
import { useSyncExternalStore } from 'react'

export const BUILD = __BUILD_ID__

let latest: string | null = null
const listeners = new Set<() => void>()

/** Asks the server which build is current. Resolves true if it's newer than this one. */
export async function checkForUpdate(): Promise<boolean> {
  try {
    const r = await fetch('/version.json', { cache: 'no-store' })
    if (r.ok) {
      latest = (await r.json()).build ?? null
      listeners.forEach((l) => l())
    }
  } catch {
    /* offline: try again later */
  }
  return updateAvailable()
}

export const updateAvailable = () => latest !== null && latest !== BUILD

export function useUpdateAvailable() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => { listeners.delete(l) }),
    updateAvailable,
  )
}

/** Throw away the cached app (not progress or narration clips) and load the newest version. */
export async function applyUpdate() {
  try {
    const regs = (await navigator.serviceWorker?.getRegistrations()) ?? []
    await Promise.all(regs.map((r) => r.unregister()))
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k !== 'narration').map((k) => caches.delete(k)))
  } finally {
    location.reload()
  }
}

/** Check now, whenever the app comes back to the screen, and every 10 minutes. */
export function watchForUpdates() {
  checkForUpdate()
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkForUpdate() })
  setInterval(checkForUpdate, 10 * 60_000)
}

/** "Oct 2, 3:42 PM" */
export const buildLabel = (id: string = BUILD) =>
  new Date(id).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
