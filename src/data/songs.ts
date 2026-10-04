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
  /** Where the birthday child's name goes (seconds): the tune plays on and the game says the name. */
  name?: [number, number]
  /** An island's own song: it's in the sing-along once that island is done (its song spot plays it first). */
  island?: string
}

/** Stands for the birthday child's name in a song's words. */
export const NAME_SLOT = '{name}'

type Gen = { audio: Song['audio']; lines: unknown; beats?: number[]; name?: unknown }
const GEN = gen as Record<string, Gen>

const BUILT_IN: { id: string; title: string; emoji: string; color: string; island?: string }[] = [
  { id: 'jesus-loves-me', title: 'Jesus Loves Me', emoji: '💛', color: '#ffcf5a' },
  { id: 'this-little-light', title: 'This Little Light of Mine', emoji: '🕯️', color: '#ffa94d' },
  { id: 'noah-boat', title: 'Noah Built a Big Boat', emoji: '🚢', color: '#5ec8f2' },
  { id: 'twinkle', title: 'Twinkle, Twinkle, Little Star', emoji: '⭐', color: '#9b8cff' },
  { id: 'away-in-a-manger', title: 'Away in a Manger', emoji: '👶', color: '#7ed68a' },
  { id: 'happy-birthday', title: 'Happy Birthday', emoji: '🎂', color: '#ff8fc7' },
  // Island songs: new words to public-domain tunes (docs/GAME-PLAN.md §10), sung at each island's song spot.
  { id: 'song-creation', title: 'God Made It All', emoji: '🌍', color: '#5fd39a', island: 'creation' },
  { id: 'song-abraham', title: 'Count the Stars', emoji: '✨', color: '#9b8cff', island: 'abraham' },
  { id: 'song-joseph', title: "Joseph's Coat", emoji: '🧥', color: '#ff9b4a', island: 'joseph' },
  { id: 'song-red-sea', title: 'Through the Sea', emoji: '🌊', color: '#4fb0d8', island: 'red-sea' },
  { id: 'song-david', title: "David's Song", emoji: '🎵', color: '#ffb347', island: 'david' },
  { id: 'song-daniel', title: 'Daniel Prayed', emoji: '🦁', color: '#e0a85a', island: 'daniel' },
  { id: 'song-jonah', title: 'Jonah and the Big Fish', emoji: '🐋', color: '#5fb7ff', island: 'jonah' },
  { id: 'song-loaves', title: 'Five Little Loaves', emoji: '🧺', color: '#ffd34d', island: 'loaves' },
  { id: 'song-baby-moses', title: 'Baby in a Basket', emoji: '👶', color: '#7ec8e3', island: 'baby-moses' },
  { id: 'song-burning-bush', title: 'Moses and the Bush', emoji: '🔥', color: '#ff9b4a', island: 'burning-bush' },
  { id: 'song-manna', title: 'Bread from Heaven', emoji: '🍯', color: '#e8c25a', island: 'manna' },
  { id: 'song-jericho', title: 'Round and Round Jericho', emoji: '🎺', color: '#e0904f', island: 'jericho' },
  { id: 'song-ruth', title: 'Where You Go, I Will Go', emoji: '🌾', color: '#d4b44a', island: 'ruth' },
  { id: 'song-samuel', title: 'Speak, Lord, I Am Listening', emoji: '🪔', color: '#8f8ae0', island: 'samuel' },
  { id: 'song-elijah', title: 'Fire from Heaven', emoji: '🔥', color: '#e8743b', island: 'elijah' },
  { id: 'song-esther', title: 'Brave Queen Esther', emoji: '👑', color: '#b48be0', island: 'esther' },
  { id: 'song-boy-jesus', title: 'Where Can Our Jesus Be?', emoji: '📜', color: '#e0b85a', island: 'boy-jesus' },
]

/** Every built-in song's id, made yet or not (an island's song step names one). */
export const SONG_IDS = BUILT_IN.map((s) => s.id)

export const SONGS: Song[] = BUILT_IN.filter((s) => s.id in GEN).map((s) => {
  const g = GEN[s.id]
  return { ...s, audio: g.audio, lines: g.lines as SongLine[], beats: g.beats, name: 'name' in g ? (g.name as [number, number]) : undefined }
})

/** The song with the birthday child's name in its words. */
export function withName(song: Song, name: string): Song {
  if (!song.name) return song
  return { ...song, lines: song.lines.map((l) => ({ ...l, words: l.words.map(([w, t]): [string, number] => [w.replace(NAME_SLOT, name), t]) })) }
}

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
