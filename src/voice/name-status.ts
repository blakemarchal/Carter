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
  library: (n) => `“${n}” is in the name library; the narrator hasn’t recorded it yet. You can record it yourself in Family voices.`,
  missing: (n) => `“${n}” isn’t in the name library yet. Record it in Family voices (two short takes) and the game will say it in your voice. Until then, lines with the name are read by the iPad’s own voice: the name is never sent anywhere.`,
}
