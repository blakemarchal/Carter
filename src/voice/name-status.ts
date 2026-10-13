// Whether the game can say a child's name in a real voice (the Parent Corner shows it under each player):
//   'family'  the family recorded it (Family voices, both takes);
//   'house'   the house narrator recorded it (it's in the name library);
//   'library' it's in the name library, but not recorded yet;
//   'missing' neither: lines with the name are read by the device's own voice (never sent anywhere).
import { useEffect, useState, useSyncExternalStore } from 'react'
import { hasRecording, onRecordingsChange } from '../lib/recordings'
import { fingerprint, keys, type Take } from './keys'
import { houseFind, onHouseChange } from './house'
import { libraryName, nameKey } from './names'
import { voicesFor } from './roles'

export type NameStatus = 'family' | 'house' | 'library' | 'missing'
const TAKES: Take[] = ['mid', 'exclaim']

export async function nameStatus(name: string): Promise<NameStatus> {
  const own = await Promise.all(TAKES.map(async (t) => hasRecording(await fingerprint(keys.name(nameKey(name), t)))))
  if (own.every(Boolean)) return 'family'
  const lib = libraryName(name)
  const house = await Promise.all(TAKES.map((t) => houseFind(voicesFor('narrator'), keys.name(lib ?? name, t))))
  if (house.every(Boolean)) return 'house'
  return lib ? 'library' : 'missing'
}

let tick = 0
const subscribe = (l: () => void) => {
  const a = onRecordingsChange(() => { tick++; l() })
  const b = onHouseChange(() => { tick++; l() })
  return () => { a(); b() }
}

export function useNameStatus(name: string): NameStatus | null {
  const [status, setStatus] = useState<NameStatus | null>(null)
  const changed = useSyncExternalStore(subscribe, () => tick)
  useEffect(() => {
    let live = true
    if (name.trim()) nameStatus(name).then((s) => live && setStatus(s))
    return () => { live = false }
  }, [name, changed])
  return status
}

export const NAME_STATUS_TEXT: Record<NameStatus, (name: string) => string> = {
  family: (n) => `🎙️ The game says “${n}” in your own recording.`,
  house: (n) => `🔊 The narrator says “${n}” by name.`,
  library: (n) => `🔊 The narrator says “${n}” by name (it’s in our name library). You can also record it yourself in Family voices.`,
  missing: (n) => `“${n}” isn’t in our name library. Record it in Family voices (two short takes) and the game will say it in your voice. Until then, lines with the name are read by the iPad’s own voice, and the name isn’t sent anywhere, unless you choose below.`,
}

// ---------- "Let the narrator say <name>" ----------
// A name that isn't in the library is read by the device's own voice, unless a parent chooses to let the
// narrator say it: that one name is then sent to xAI, once, to make its two clips (server/voice-extras.mjs).

let agreed: string[] | null = null
const agreedListeners = new Set<() => void>()

/** The names this family agreed the narrator may say (asked of the server once). */
export async function loadAgreedNames(): Promise<string[]> {
  if (agreed) return agreed
  try {
    const r = await fetch('/voice/names/mine', { cache: 'no-store' })
    agreed = r.ok ? await r.json() : []
  } catch {
    agreed = []
  }
  agreedListeners.forEach((l) => l())
  return agreed!
}

export function useAgreedNames(): string[] {
  const [, force] = useState(0)
  useEffect(() => {
    const l = () => force((n) => n + 1)
    agreedListeners.add(l)
    loadAgreedNames()
    return () => { agreedListeners.delete(l) }
  }, [])
  return agreed ?? []
}

/** What a parent is told before agreeing: plainly, what is sent, to whom, and how to undo it. */
export const NAME_CONSENT = (name: string) =>
  `This sends the name “${name}”, and only the name, to xAI (the company that makes the narrator’s voice), once, to make two short clips of the narrator saying it. Nothing else about your family or your child is sent. The clips are kept with your family’s recordings, and turning this off deletes them.`

/** Lets the narrator say the name (true), or stops it and deletes its clips (false). Throws with a status if refused. */
export async function setNarratorSaysName(name: string, on: boolean) {
  const r = await fetch('/voice/name', { method: on ? 'POST' : 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim() }) })
  if (!r.ok) throw Object.assign(new Error(`name voice: ${r.status}`), { status: r.status })
  agreed = on ? [...(agreed ?? []), name.trim()] : (agreed ?? []).filter((n) => n.toLowerCase() !== name.trim().toLowerCase())
  agreedListeners.forEach((l) => l())
  const { loadRecordings } = await import('../lib/recordings')
  await loadRecordings()
}
