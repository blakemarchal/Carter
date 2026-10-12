// The name library (scripts/name-library.mjs -> ./names.json): the children's first names the house narrator
// records, each twice: mid-sentence ("…, Olivia.") and as an exclamation ("Olivia!"). Spellings that sound
// alike share one recording. A name that isn't here (and that the family hasn't recorded) is never sent
// anywhere: the line it's in is read by the device's own voice.
import data from './names.json'

/** Every name to record, by its main spelling (the most common one), most common first. */
export const LIBRARY_NAMES: string[] = data.names.map((g) => g[0])
/** Where the list comes from. */
export const LIBRARY_SOURCE: string = data.source

const bySpelling = new Map<string, string>()
for (const g of data.names) for (const s of g) bySpelling.set(s.toLowerCase(), g[0])

/** A name as typed, tidied for looking up: "  olivia " -> "olivia". */
export const nameKey = (name: string) => name.trim().toLowerCase().normalize('NFC')

/** The library's spelling for a child's name ("Aidan" -> "Aiden"), or null when it isn't in the library. */
export function libraryName(name: string): string | null {
  return bySpelling.get(nameKey(name)) ?? null
}

/** The two takes of a name. */
export type NameTake = 'mid' | 'exclaim'
