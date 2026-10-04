// The family on the server (server/families.mjs): its grown-ups, their devices, and invitations.
// Grown-ups join by link (a parent makes one in the Parent Corner); nobody has a password.
import { useCallback, useEffect, useState } from 'react'

export type Role = 'parent' | 'grownup'

export interface FamilyView {
  me: { member: string; device: string; role: Role }
  family: { id: string; name: string }
  members: { id: string; name: string; role: Role; look: unknown }[]
  devices: { id: string; label: string; seen: number; member: string; mine: boolean }[]
  invites: { id: string; name: string; role: Role; expires: number }[]
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const r = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!r.ok) throw Object.assign(new Error(`${method} ${path}: ${r.status}`), { status: r.status })
  return (r.status === 204 ? undefined : await r.json()) as T
}

/** The server gives links as paths (/join/…): this site's address goes in front. */
const withSite = <T extends { link: string }>(r: T): T => ({ ...r, link: new URL(r.link, location.origin).href })

export const familyApi = {
  get: () => call<FamilyView>('GET', '/family'),
  rename: (name: string) => call<void>('PUT', '/family', { name }),
  updateMe: (changes: { name?: string; look?: unknown }) => call<void>('PUT', '/family/me', changes),
  /** A one-time link (7 days) that brings a new grown-up into the family. */
  invite: (name: string, role: Role) => call<{ id: string; link: string; expires: number }>('POST', '/family/invite', { name, role }).then(withSite),
  cancelInvite: (id: string) => call<void>('DELETE', `/family/invite/${id}`),
  /** A one-time link (1 day) that signs another device in as me. */
  deviceLink: () => call<{ link: string; expires: number }>('POST', '/family/device-link').then(withSite),
  /** This device's name in the list of signed-in devices. */
  relabel: (label: string) => call<void>('PUT', '/family/device', { label }),
  removeMember: (id: string) => call<void>('DELETE', `/family/member/${id}`),
  removeDevice: (id: string) => call<void>('DELETE', `/family/device/${id}`),
}

let cached: FamilyView | null = null
const listeners = new Set<(v: FamilyView | null) => void>()

/**
 * The family, fetched when needed (kept for the session; `reload` after a change). null while it's
 * loading, or offline (the game itself doesn't need it).
 */
export function useFamilyAccount() {
  const [view, setView] = useState<FamilyView | null>(cached)
  const reload = useCallback(async () => {
    try {
      cached = await familyApi.get()
      // An iPad's browser says it's a Mac (the server names devices by that): name it properly.
      const mine = cached.devices.find((d) => d.mine)
      if (mine?.label === 'Mac' && navigator.maxTouchPoints > 1) {
        mine.label = 'iPad'
        familyApi.relabel('iPad').catch(() => {})
      }
      listeners.forEach((f) => f(cached))
    } catch { /* offline, or an older server: nothing to show */ }
  }, [])
  useEffect(() => {
    listeners.add(setView)
    if (!cached) reload()
    return () => { listeners.delete(setView) }
  }, [])
  return { view, reload }
}
