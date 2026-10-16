// When each word of a song is sung, so the words light up as it plays (and the child reads along): ElevenLabs
// Scribe hears the song and says when each word was sung; those words are matched to the lyrics, so a word the
// model mis-heard still gets its time from its neighbours. The match is also the check that the singer sang the
// words we wrote: a song whose words differ much from the lyrics is flagged to listen to (or make again).
// The beat comes from librosa (beats.py). Writes work/<id>/timing.json and prints the check.
//   node scripts/music/align.mjs <id> [id…]
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { HERE, WORK, eleven, python, songs } from './lib.mjs'

/** A word as compared: lower case, letters and digits only ("Hooray!" and "hooray" are the same). */
export const norm = (w) => w.toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, '')

/** How alike two words are, 0 to 1 (so "Jericho" and "Jerico" nearly match). */
function alike(a, b) {
  if (a === b) return 1
  if (!a || !b) return 0
  const n = a.length, m = b.length
  const d = Array.from({ length: n + 1 }, (_, i) => [i, ...Array(m).fill(0)])
  for (let j = 1; j <= m; j++) d[0][j] = j
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return 1 - d[n][m] / Math.max(n, m)
}

/**
 * The lyrics' words matched to the heard words (each with a time): the best alignment, where a match scores by
 * likeness and a skip on either side costs a little. Returns, per lyric word, the heard word's start (or null).
 */
export function alignWords(lyricWords, heard) {
  const L = lyricWords.map(norm), H = heard.map((h) => norm(h.text))
  const n = L.length, m = H.length
  const SKIP = -0.4
  // best[i][j]: best score matching the first i lyric words with the first j heard words
  const best = Array.from({ length: n + 1 }, () => new Float64Array(m + 1))
  const from = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1)) // 1 match, 2 skip lyric, 3 skip heard
  for (let i = 1; i <= n; i++) { best[i][0] = i * SKIP; from[i][0] = 2 }
  for (let j = 1; j <= m; j++) { best[0][j] = j * SKIP; from[0][j] = 3 }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const s = alike(L[i - 1], H[j - 1])
      const match = best[i - 1][j - 1] + (s >= 0.5 ? s : -1)
      const skipL = best[i - 1][j] + SKIP
      const skipH = best[i][j - 1] + SKIP
      if (match >= skipL && match >= skipH) { best[i][j] = match; from[i][j] = 1 } else if (skipL >= skipH) { best[i][j] = skipL; from[i][j] = 2 } else { best[i][j] = skipH; from[i][j] = 3 }
    }
  }
  const times = Array(n).fill(null)
  let matched = 0
  for (let i = n, j = m; i > 0 || j > 0;) {
    const f = from[i][j]
    if (f === 1) { if (alike(L[i - 1], H[j - 1]) >= 0.5) { times[i - 1] = heard[j - 1].start; matched++ } i--; j-- }
    else if (f === 2) i--
    else j--
  }
  return { times, matched }
}

/** Times for the words that weren't heard: spread evenly between the neighbours that were. */
export function fillGaps(times, duration) {
  const out = times.slice()
  const known = out.map((t, i) => (t === null ? -1 : i)).filter((i) => i >= 0)
  if (!known.length) return out.map((_, i) => (i / out.length) * duration)
  for (let i = 0; i < out.length; i++) {
    if (out[i] !== null) continue
    const prev = known.filter((k) => k < i).pop()
    const next = known.find((k) => k > i)
    const t0 = prev === undefined ? 0 : out[prev]
    const t1 = next === undefined ? Math.min(duration, t0 + (i - (prev ?? -1)) * 0.6) : out[next]
    const a = prev === undefined ? -1 : prev, b = next === undefined ? out.length : next
    out[i] = t0 + ((t1 - t0) * (i - a)) / (b - a)
  }
  // (never backwards)
  for (let i = 1; i < out.length; i++) if (out[i] < out[i - 1]) out[i] = out[i - 1] + 0.05
  return out
}

/** The song's timing in the game's shape (src/data/songs.gen.json): lines of [word, start], with start and end. */
export function timingFor(lines, wordTimes, duration) {
  const out = []
  let k = 0
  for (const line of lines) {
    const ws = line.split(/\s+/).filter(Boolean)
    const words = ws.map((w) => [w, Math.round(wordTimes[k++] * 1000) / 1000])
    out.push({ start: words[0][1], words })
  }
  for (let i = 0; i < out.length; i++) out[i].end = i + 1 < out.length ? out[i + 1].start : Math.round(Math.min(duration, out[i].words.at(-1)[1] + 2.5) * 1000) / 1000
  return out
}

async function hear(file) {
  const form = new FormData()
  form.set('file', new Blob([readFileSync(file)], { type: 'audio/mpeg' }), 'song.mp3')
  form.set('model_id', 'scribe_v2')
  form.set('language_code', 'en')
  form.set('timestamps_granularity', 'word')
  form.set('tag_audio_events', 'false')
  let r
  try {
    r = await eleven('/v1/speech-to-text', { method: 'POST', form })
  } catch (e) {
    if (/missing_permissions/.test(e.message)) throw new Error('The ElevenLabs key isn\'t allowed to use Speech to Text, which times the words. In ElevenLabs, edit the key (profile → API keys) and turn on Speech to Text, then run this again.')
    throw e
  }
  const j = await r.json()
  return (j.words ?? []).filter((w) => w.type === 'word').map((w) => ({ text: w.text, start: w.start, end: w.end }))
}

export async function align(song) {
  const dir = join(WORK, song.id)
  const vocal = join(dir, 'vocal.mp3')
  if (!existsSync(vocal)) throw new Error(`${song.id}: no vocal.mp3 in work/${song.id}`)
  const beat = JSON.parse(python(join(HERE, 'beats.py'), [vocal]))
  const heard = await hear(vocal)
  const lines = song.lines.filter((l) => !l.includes('{name}'))
  const lyricWords = lines.flatMap((l) => l.split(/\s+/).filter(Boolean))
  const { times, matched } = alignWords(lyricWords, heard)
  const wordTimes = fillGaps(times, beat.duration)
  const timing = { duration: beat.duration, bpm: beat.bpm, beats: beat.beats, lines: timingFor(lines, wordTimes, beat.duration) }
  const check = {
    lyricWords: lyricWords.length, heardWords: heard.length, matched,
    missed: lyricWords.filter((_, i) => times[i] === null),
    extra: heard.length - matched,
    heardText: heard.map((h) => h.text).join(' '),
  }
  writeFileSync(join(dir, 'timing.json'), JSON.stringify(timing))
  writeFileSync(join(dir, 'check.json'), JSON.stringify(check, null, 1))
  const pct = Math.round((100 * matched) / lyricWords.length)
  const verdict = pct >= 85 ? 'ok' : pct >= 70 ? 'LISTEN' : 'REDO?'
  console.log(`${song.id}: ${pct}% of the words heard as written (${matched}/${lyricWords.length}, ${check.extra} extra), ${beat.bpm} bpm, ${beat.duration}s: ${verdict}${check.missed.length ? '. Not heard: ' + check.missed.slice(0, 12).join(' ') : ''}`)
  return { timing, check }
}

if (process.argv[1]?.endsWith('align.mjs')) {
  try {
    const ids = process.argv.slice(2)
    if (!ids.length) throw new Error('Say which: node scripts/music/align.mjs <id…>')
    const all = songs()
    for (const id of ids) {
      const s = all.find((x) => x.id === id)
      if (!s) throw new Error(`${id}: not a song`)
      await align(s)
    }
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
