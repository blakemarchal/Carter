// Which recordings say a line (docs/BUSINESS-PLAN.md §2), first match wins:
//   1. the family's own recording of that exact line (Family voices);
//   2. the house voice for the line's role (src/voice/roles.ts) reading that exact line;
//   3. the line stitched from the house voice's recorded pieces (src/voice/stitch.ts): a template's parts, and
//      the names, numbers, letters and sounds in its slots.
// Then lib/speech.ts falls back to a narration clip made ahead of time (never for a line with a family's
// name in it), and last of all to the device's own voice.
import { recordingFor } from '../lib/recordings'
import { clipAudio, houseFind } from './house'
import type { Part } from './player'
import { voicesFor, type Role } from './roles'

export interface Plan {
  parts: Part[]
  /** Where it came from (for tests, and the studio's "Listen"). */
  from: 'family' | 'house' | 'stitched'
}

/** A stitcher (src/voice/stitch.ts), plugged in so this file stays small. */
export type Stitcher = (text: string, role: Role, opts: { family: boolean; grok: boolean }) => Promise<Part[] | null>
let stitcher: Stitcher | null = null
export const setStitcher = (s: Stitcher | null) => { stitcher = s }

/** `grok`: whether the house Grok voice may read it (not when a parent chose the iPad voice). */
export async function planLine(text: string, role: Role = 'narrator', { family = true, grok = true }: { family?: boolean; grok?: boolean } = {}): Promise<Plan | null> {
  const line = text.trim()
  if (family) {
    const rec = await recordingFor(line)
    if (rec) return { parts: [{ audio: rec }], from: 'family' }
  }
  const hit = await houseFind(voicesFor(role).filter((v) => grok || v !== 'grok'), line)
  if (hit) {
    const [v, start, end, gain] = hit.info
    return { parts: [{ audio: clipAudio(hit.voice, hit.id, v), start, end, gain }], from: 'house' }
  }
  const stitched = stitcher ? await stitcher(line, role, { family, grok }) : null
  return stitched ? { parts: stitched, from: 'stitched' } : null
}
