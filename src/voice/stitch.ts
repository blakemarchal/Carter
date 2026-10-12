// Stitching (docs/CLOUD-BRIEF.md, wave 10): a line that isn't recorded whole is put together from recorded
// pieces, all in one house voice. The line is split into sentences; each run of sentences is either a whole
// recorded line or a template (./templates.ts) whose parts and slots are all recorded. A slot is filled from:
//   a child's name: the family's own recording of it (Family voices), else the house name library (./names.ts);
//   a Pal's name, a number, a letter or a letter's sound: the house recording of it.
// If any piece is missing, nothing is stitched, and the line goes on down the list (lib/speech.ts). A line with
// a family's name in it then goes to the device's own voice: it's never sent anywhere.
import { recordingFor } from '../lib/recordings'
import { numberWords } from '../lib/spoken'
import { PALS } from '../data/pals'
import { fingerprint, keys, type Take } from './keys'
import { clipAudio, houseFind, houseManifest } from './house'
import { libraryName, nameKey } from './names'
import { PART_GAP, SENTENCE_GAP, type Part } from './player'
import { voicesFor, type Role, type Voice } from './roles'
import { hasWords, pieces, TEMPLATES, type SlotKind, type Template } from './templates'

/** Numbers that have recordings: 0 to 140 (the brief says 130; counting past 100 goes up to 140). */
export const MAX_NUMBER = 140
/** A pause where a template has a comma between slots ("3, 4, 5."). */
const COMMA_GAP = 160

/** Every Pal's name, at every stage, and the shadow's. */
export const PAL_NAMES: string[] = [...new Set([...PALS.flatMap((p) => p.stages.map((s) => s.name)), 'Grumbleshade', 'Gladshade'])]

const tidy = (s: string) => s.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim()
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const byLength = (a: string, b: string) => b.length - a.length

const NUMBER_WORDS = Array.from({ length: MAX_NUMBER + 1 }, (_, n) => numberWords(n))
const NUMBER_BY_WORD = new Map(NUMBER_WORDS.map((w, n) => [w, n]))
const SLOT_RE: Record<SlotKind, string> = {
  name: "(\\p{L}[\\p{L}'\\-]*(?: \\p{L}[\\p{L}'\\-]*){0,2})",
  pal: `(${[...PAL_NAMES].sort(byLength).map(escape).join('|')})`,
  n: `(\\d{1,3}|${[...NUMBER_WORDS].sort(byLength).map(escape).join('|')})`,
  letter: '([A-Za-z])',
  sound: '⟦([a-z])⟧',
}

/** A number as said or written ("47", "forty-seven", "Seven"), or null if it's not 0 to MAX_NUMBER. */
export function parseNumber(s: string): number | null {
  const n = /^\d+$/.test(s) ? Number(s) : NUMBER_BY_WORD.get(s.toLowerCase())
  return n !== undefined && n <= MAX_NUMBER ? n : null
}

interface Compiled { tpl: Template; re: RegExp; slots: { kind: SlotKind; take: Take }[]; said: string[] }
function compile(tpl: Template): Compiled {
  const ps = pieces(tidy(tpl.text))
  const slots: Compiled['slots'] = []
  const said: string[] = []
  let re = '^'
  ps.forEach((p, i) => {
    if ('said' in p) {
      said.push(p.said)
      re += escape(p.said)
    } else {
      // (a slot right before "!" is said as an exclamation: "Olivia!"; otherwise mid-sentence)
      const next = ps[i + 1]
      slots.push({ kind: p.slot, take: next && 'said' in next && next.said.startsWith('!') ? 'exclaim' : 'mid' })
      re += SLOT_RE[p.slot]
    }
  })
  // (the most specific first: more fixed words)
  return { tpl, re: new RegExp(`${re}$`, 'iu'), slots, said }
}
let compiled: Compiled[] | null = null
const all = () => (compiled ??= TEMPLATES.map(compile).sort((a, b) => b.said.join('').length - a.said.join('').length))

/** A template a sentence fits, with what's in its slots, or null. */
export function matchTemplate(sentence: string): { tpl: Template; values: { kind: SlotKind; take: Take; value: string }[] } | null {
  const s = tidy(sentence)
  for (const c of all()) {
    const m = c.re.exec(s)
    if (!m) continue
    const values = c.slots.map((sl, i) => ({ ...sl, value: m[i + 1] }))
    if (values.some((v) => v.kind === 'n' && parseNumber(v.value) === null)) continue
    return { tpl: c.tpl, values }
  }
  return null
}

/** A line in sentences: "Great job! 3 plus 4." -> ["Great job!", "3 plus 4."] */
export function sentences(text: string): string[] {
  // (a new sentence starts with a capital, a number, a letter sound or a quote: "Even… me?" he whispered. is one)
  return text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?…]["”'’]?)\s+(?=["“']?[\p{Lu}\d⟦])/u).filter(Boolean)
}

/**
 * A piece found but not yet fetched (so trying a voice that turns out to miss a piece fetches nothing): a house
 * clip, or the family's own recording (fetched as it's found: it's the family's).
 */
type Piece = { house: { voice: Voice; id: string; info: [string, number, number, number] }; gap?: number } | { own: Promise<ArrayBuffer | null>; gap?: number }

const toPart = (p: Piece): Part => {
  if ('own' in p) return { audio: p.own, gap: p.gap }
  const [v, start, end, gain] = p.house.info
  return { audio: clipAudio(p.house.voice, p.house.id, v), start, end, gain, gap: p.gap }
}

/** One recorded piece in `voice`, or null. */
async function housePiece(voice: Voice, key: string): Promise<Piece | null> {
  const hit = await houseFind([voice], key)
  return hit ? { house: hit } : null
}

/** A slot's recording: a name from the family's own recordings first, then the house voice. */
async function slotPiece(voice: Voice, kind: SlotKind, value: string, take: Take, family: boolean): Promise<Piece | null> {
  switch (kind) {
    case 'name': {
      if (family) {
        const own = recordingFor(keys.name(nameKey(value), take))
        if (await own) return { own }
      }
      // (the library's spelling, or a name the owner recorded beyond the library: families use it)
      return (await housePiece(voice, keys.name(libraryName(value) ?? value, take)))
    }
    case 'pal': return housePiece(voice, keys.pal(value, take))
    case 'n': return housePiece(voice, keys.number(parseNumber(value)!, take))
    case 'letter': return housePiece(voice, keys.letter(value))
    case 'sound': return housePiece(voice, keys.sound(value))
  }
}

/** A run of sentences as recorded pieces in `voice`: the whole run recorded, or a template filled in. */
async function runPieces(voice: Voice, run: string, family: boolean): Promise<Piece[] | null> {
  const whole = await housePiece(voice, run)
  if (whole) return [whole]
  const m = matchTemplate(run)
  if (!m) return null
  const parts: Piece[] = []
  let slot = 0
  let fixed = 0
  for (const p of pieces(m.tpl.text)) {
    if ('said' in p) {
      const i = fixed++
      if (hasWords(p.said)) {
        const part = await housePiece(voice, keys.part(m.tpl.id, i))
        if (!part) return null
        parts.push(part)
      } else if (/,/.test(p.said) && parts.length) {
        parts[parts.length - 1] = { ...parts[parts.length - 1], gap: COMMA_GAP }
      }
    } else {
      const v = m.values[slot++]
      const piece = await slotPiece(voice, v.kind, v.value, v.take, family)
      if (!piece) return null
      parts.push(piece)
    }
  }
  return parts
}

/**
 * The line as recorded pieces, in the first of the role's voices that has every piece, or null.
 * Runs of sentences are tried longest first, so a recorded two-sentence line beats two halves.
 */
export async function stitch(text: string, role: Role = 'narrator', { family = true }: { family?: boolean } = {}): Promise<Part[] | null> {
  if (!houseManifest() && !family) return null
  const ss = sentences(text)
  if (!ss.length) return null
  for (const voice of voicesFor(role)) {
    const memo = new Map<number, Piece[] | null>()
    const cover = async (i: number): Promise<Piece[] | null> => {
      if (i === ss.length) return []
      if (memo.has(i)) return memo.get(i)!
      let found: Piece[] | null = null
      for (let j = ss.length; j > i && !found; j--) {
        const head = await runPieces(voice, ss.slice(i, j).join(' '), family)
        if (!head) continue
        const rest = await cover(j)
        if (rest) {
          if (rest.length) head[head.length - 1] = { ...head[head.length - 1], gap: SENTENCE_GAP }
          found = [...head, ...rest]
        }
      }
      memo.set(i, found)
      return found
    }
    const parts = await cover(0)
    if (parts) return parts.map((p, i) => toPart(i < parts.length - 1 && p.gap === undefined ? { ...p, gap: PART_GAP } : p))
  }
  return null
}

/** Every key a template needs recorded in its voice (its parts; the slots are recorded on their own). */
export async function templatePartIds(tpl: Template): Promise<string[]> {
  const ids: string[] = []
  let i = 0
  for (const p of pieces(tpl.text)) if ('said' in p) { if (hasWords(p.said)) ids.push(await fingerprint(keys.part(tpl.id, i))); i++ }
  return ids
}
