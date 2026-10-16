// What the server needs to know about the islands for the weekly parent email (server/weekly.mjs): each island's
// name, memory verse, "Think about it" questions, big words and science moment. scripts/voice-script.tsx writes it
// to server/content.gen.json (a test checks it's current), so the server, plain Node, never imports the game's data.
import type { Island } from './islands'
import { THINK } from './think'
import { BIG_WORDS } from './bigwords'
import { SCIENCE } from './science'

export interface IslandContent {
  id: string
  name: string
  verse?: { text: string; ref: string }
  think: { ask: string; why: string }[]
  bigWords: { word: string; means: string }[]
  science?: { title: string; fact: string; tryIt: string }
}

export function contentForServer(islands: Island[]): { islands: IslandContent[] } {
  return {
    islands: islands.map((isl) => {
      const verse = isl.steps.find((s) => s.kind === 'verse')
      const sc = SCIENCE[isl.id]
      return {
        id: isl.id,
        name: isl.name,
        ...(verse?.kind === 'verse' ? { verse: { text: verse.chunks.join(' '), ref: verse.ref } } : {}),
        think: (THINK[isl.id] ?? []).map((q) => ({ ask: q.ask, why: q.why })),
        bigWords: (BIG_WORDS[isl.id] ?? []).map((b) => ({ word: b.word, means: b.means })),
        ...(sc ? { science: { title: sc.title, fact: sc.facts[1], tryIt: sc.tryIt } } : {}),
      }
    }),
  }
}
