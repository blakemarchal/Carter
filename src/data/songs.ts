// Sing-along songs. The built-in ones are made by scripts/sing (Ara singing each word on the real
// tune), which also writes songs.gen.json: the audio files and when every line and word is sung.
// Parents can add more in the Parent Corner (a recording plus its words); see lib/songs.ts.
import gen from './songs.gen.json'

export interface SongLine {
  start: number
  end: number
  /** Each word and when it starts (seconds). */
  words: [string, number][]
}

export interface Song {
  id: string
  title: string
  emoji: string
  color: string
  /** Ara singing, and (for built-in songs) a sing-it-yourself version with the tune on a flute. */
  audio: { ara: string; sing?: string }
  lines: SongLine[]
  /** When each beat falls, for dancing (built-in songs only). */
  beats?: number[]
  /** Added by a parent, rather than built in. */
  family?: boolean
}

const BUILT_IN: { id: keyof typeof gen; title: string; emoji: string; color: string }[] = [
  { id: 'jesus-loves-me', title: 'Jesus Loves Me', emoji: '💛', color: '#ffcf5a' },
  { id: 'this-little-light', title: 'This Little Light of Mine', emoji: '🕯️', color: '#ffa94d' },
  { id: 'noah-boat', title: 'Noah Built a Big Boat', emoji: '🚢', color: '#5ec8f2' },
  { id: 'twinkle', title: 'Twinkle, Twinkle, Little Star', emoji: '⭐', color: '#9b8cff' },
  { id: 'away-in-a-manger', title: 'Away in a Manger', emoji: '👶', color: '#7ed68a' },
  { id: 'happy-birthday', title: 'Happy Birthday, Carter', emoji: '🎂', color: '#ff8fc7' },
]

export const SONGS: Song[] = BUILT_IN.filter((s) => s.id in gen).map((s) => {
  const g = gen[s.id]
  return { ...s, audio: g.audio, lines: g.lines as SongLine[], beats: g.beats }
})

/**
 * Lines with word timings for a song that only has its words and when each line starts:
 * the words of a line are spread over its time, longer words taking longer.
 */
export function timedLines(lines: string[], starts: number[], duration: number): SongLine[] {
  const n = lines.length
  const at = (i: number) => starts[i] ?? (n ? (duration * i) / n : 0)
  return lines.map((text, i) => {
    const start = at(i)
    const end = Math.min(i + 1 < n ? at(i + 1) : duration, start + Math.max(2, text.length * 0.12))
    const words = text.split(/\s+/).filter(Boolean)
    const weights = words.map((w) => Math.max(2, w.replace(/[^a-z]/gi, '').length))
    const total = weights.reduce((a, b) => a + b, 0) || 1
    let t = start
    const timed = words.map((w, k): [string, number] => {
      const here = t
      t += ((end - start) * 0.9 * weights[k]) / total
      return [w, Math.round(here * 1000) / 1000]
    })
    return { start, end, words: timed }
  })
}
