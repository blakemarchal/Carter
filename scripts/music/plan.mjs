// A song's composition plan for ElevenLabs Music (music_v2_5): the lyrics in sections of a few lines, how
// each should sound (styles.json), and how long each is expected to take. Kept apart from make.mjs so it's tested.

const MAX_LINES = 30 // per section (the API's limit)
const MAX_LINE_CHARS = 200
const MIN_SECTION_MS = 3000
const MAX_SECTION_MS = 120000
const LINES_PER_SECTION = 4

/** A list of styles with no repeats, in order. */
const merge = (...lists) => [...new Set(lists.flat().filter(Boolean))]

/**
 * The plan: `lines` are the sung lines in order (a line with the name slot "{name}" is left out: those songs
 * stay on the old pipeline). Sections of four lines, named Verse 1, 2…; the first section's styles set the tone.
 */
export function buildPlan(song, style) {
  const base = style.default
  const own = style[song.id] ?? {}
  const positive = merge(base.positive, own.positive)
  const negative = merge(base.negative, own.negative)
  const msPerLine = own.msPerLine ?? base.msPerLine
  const lines = song.lines.filter((l) => !l.includes('{name}'))
  if (!lines.length) throw new Error(`${song.id}: no lines to sing`)
  for (const l of lines) if (l.length > MAX_LINE_CHARS) throw new Error(`${song.id}: a line is longer than ${MAX_LINE_CHARS} characters`)
  const chunks = []
  for (let i = 0; i < lines.length; i += LINES_PER_SECTION) {
    const part = lines.slice(i, i + LINES_PER_SECTION)
    const n = chunks.length + 1
    chunks.push({
      text: `[Verse ${n}]\n${part.join('\n')}`,
      duration_ms: Math.min(MAX_SECTION_MS, Math.max(MIN_SECTION_MS, part.length * msPerLine)),
      positive_styles: chunks.length ? merge(own.positive, ['same song', 'same singer', 'same tempo']) : positive,
      negative_styles: negative,
      context_adherence: 'high',
    })
  }
  if (chunks.some((c) => c.text.split('\n').length - 1 > MAX_LINES)) throw new Error(`${song.id}: too many lines in a section`)
  return { chunks }
}

/** About how long the plan's song is, in ms. */
export const planMs = (plan) => plan.chunks.reduce((n, c) => n + c.duration_ms, 0)
