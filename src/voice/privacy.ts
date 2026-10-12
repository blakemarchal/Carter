// No child's name ever leaves our server (docs/legal/PRIVACY.md). A line that mentions a player, or anyone in
// the family cast, is never asked of the narration service (/tts): it's stitched from recordings (a name the
// family or the house narrator recorded), or read by the device's own voice.
import { getFamily, getProfiles } from '../lib/progress'

const DEFAULT_CAST = new Set(['mom', 'dad'])

/** Every name in this family: its players, and its cast (parents' names if changed, siblings, pets). */
export function privateNames(): string[] {
  const f = getFamily()
  const names = [
    ...getProfiles().list.map((p) => p.name),
    f.mom, f.dad,
    ...f.siblings.map((s) => s.name),
    ...f.pets.map((p) => p.name),
  ].map((n) => (n ?? '').trim()).filter((n) => n && !DEFAULT_CAST.has(n.toLowerCase()))
  return [...new Set(names)]
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Whether the text says any of `names` (as a whole word, any case). */
export function mentions(text: string, names: string[]): boolean {
  return names.some((n) => new RegExp(`(^|[^\\p{L}])${escape(n)}($|[^\\p{L}])`, 'iu').test(text))
}

/** Whether the text says the name of anyone in this family. */
export const mentionsPrivateName = (text: string) => mentions(text, privateNames())
