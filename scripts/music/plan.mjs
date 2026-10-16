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
 * The plan: one section per section of the song (a verse, the chorus…), named as the song names it, with its
 * lines; a traditional song written as lines alone is cut into sections of four. A line with the name slot
 * "{name}" is left out (those songs stay on the old pipeline). The first section's styles set the tone.
 */
export function buildPlan(song, style) {
  const base = style.default
  const own = style[song.id] ?? {}
  const positive = merge(base.positive, own.positive)
  const negative = merge(base.negative, own.negative)
  const msPerLine = own.msPerLine ?? base.msPerLine
  const given = song.sections ?? [{ name: 'Verse 1', lines: song.lines }]
  const sections = given.length === 1 && given[0].lines.length > LINES_PER_SECTION
    ? Array.from({ length: Math.ceil(given[0].lines.length / LINES_PER_SECTION) }, (_, i) => ({ name: `Verse ${i + 1}`, lines: given[0].lines.slice(i * LINES_PER_SECTION, (i + 1) * LINES_PER_SECTION) }))
    : given
  const chunks = []
  for (const sec of sections) {
    const lines = sec.lines.filter((l) => !l.includes('{name}'))
    if (!lines.length) continue
    for (const l of lines) if (l.length > MAX_LINE_CHARS) throw new Error(`${song.id}: a line is longer than ${MAX_LINE_CHARS} characters`)
    if (lines.length > MAX_LINES) throw new Error(`${song.id}: too many lines in a section`)
    chunks.push({
      text: `[${sec.name}]\n${lines.join('\n')}`,
      duration_ms: Math.min(MAX_SECTION_MS, Math.max(MIN_SECTION_MS, lines.length * msPerLine)),
      positive_styles: chunks.length ? merge(own.positive, ['same song', 'same singer', 'same tempo', ...(/chorus/i.test(sec.name) ? ['chorus', 'catchy', 'the same melody as the other chorus'] : [])]) : positive,
      negative_styles: negative,
      context_adherence: 'high',
    })
  }
  if (!chunks.length) throw new Error(`${song.id}: no lines to sing`)
  return { chunks }
}

/** About how long the plan's song is, in ms. */
export const planMs = (plan) => plan.chunks.reduce((n, c) => n + c.duration_ms, 0)
