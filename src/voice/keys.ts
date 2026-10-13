// What a recording is of, as a key, and its fingerprint (the first 16 hex characters of SHA-256 of the key).
// A whole line's key is its text, so the fingerprint is the same one a family's own recordings use
// (lib/recordings.ts). The pieces a line is stitched from (src/voice/templates.ts) have keys of their own.
export { lineId as fingerprint } from '../lib/recordings'

/** A spoken name or number has two takes: in the middle of a sentence ("…, Olivia.") and on its own ("Olivia!"). */
export type Take = 'mid' | 'exclaim'

export const keys = {
  /** A child's name: the library's spelling (src/voice/names.ts), or as the family typed it. */
  name: (name: string, take: Take) => `⟪name⟫ ${name.trim().toLowerCase()} ${take}`,
  /** A Pal's name (every Pal at every stage). */
  pal: (name: string, take: Take) => `⟪pal⟫ ${name.trim().toLowerCase()} ${take}`,
  /** A number, 0 to 140. */
  number: (n: number, take: Take) => `⟪number⟫ ${n} ${take}`,
  /** A letter's name ("bee"). */
  letter: (l: string) => `⟪letter⟫ ${l.toLowerCase()}`,
  /** A letter's sound ("buh"). */
  sound: (l: string) => `⟪sound⟫ ${l.toLowerCase()}`,
  /** A thing's name as an activity says it ("the lion", "apples", "the bowl"). */
  item: (say: string) => `⟪item⟫ ${say.trim().toLowerCase()}`,
  /** A Pal's move ("Spark Shower"). */
  move: (name: string) => `⟪move⟫ ${name.trim().toLowerCase()}`,
  /** One of a template's fixed parts, before, between or after its slots. */
  part: (template: string, i: number) => `⟪part⟫ ${template} ${i}`,
  /** A sung recording of a song. */
  song: (song: string) => `⟪song⟫ ${song}`,
}
