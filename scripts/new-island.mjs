// Starts a new island from a template (docs/ISLAND-GUIDE.md):
//   npm run new-island -- red-sea "The Red Sea"
// Writes src/data/<id>.ts, src/art/scenes/<id>.tsx and src/art/games/<id>.tsx with the shape of a
// three-visit island filled in and TODOs to replace, then prints the lines to add to the registries.
// Nothing is registered automatically, so the tests stay green until the island is ready.
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [id, ...rest] = process.argv.slice(2)
const name = rest.join(' ')
if (!id || !/^[a-z][a-z0-9-]*$/.test(id) || !name) {
  console.error('Usage: npm run new-island -- <id like red-sea> "<Name on the map>"')
  process.exit(1)
}
const ID = id.toUpperCase().replace(/-/g, '_')
const root = join(import.meta.dirname, '..')
const dataFile = join(root, 'src', 'data', `${id}.ts`)
const artFile = join(root, 'src', 'art', 'scenes', `${id}.tsx`)
const gameFile = join(root, 'src', 'art', 'games', `${id}.tsx`)
for (const f of [dataFile, artFile, gameFile]) if (existsSync(f)) { console.error(`${f} already exists`); process.exit(1) }

const PART = 5 // pages in each part of the story
const pages = (from) => Array.from({ length: PART }, (_, i) => `  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page ${from + i}' },`).join('\n')
const q = (s) => s.replace(/'/g, "\\'")
writeFileSync(dataFile, `import type { Step, StoryPage } from './islands'
import { ${ID}_GAME } from '../art/games/${id}'

// ${name}. See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in words,
// no emoji or symbols in anything spoken, and every page's picture shows what its words say.
// Three visits of about 8 to 10 minutes (docs/GAME-PLAN.md §3.1): the story, the adventure, the rescue.

/** Visit 1: the story begins, up to where the island's game fits. */
export const ${ID}_STORY_1: StoryPage[] = [
${pages(1)}
]

/** Visit 2: the story goes on. Its pictures follow part one's in art/scenes/${id}.tsx. */
export const ${ID}_STORY_2: StoryPage[] = [
${pages(PART + 1)}
]

// World English Bible (public domain), word for word.
export const ${ID}_VERSE = {
  ref: 'TODO 1:1',
  chunks: ['TODO', 'TODO'],
}

export const ${ID}_STEPS: Step[] = [
  // Visit 1: the story
  { kind: 'story', title: '${q(name)}', pages: ${ID}_STORY_1 },
  { kind: 'spot', title: 'TODO', intro: 'TODO', done: 'TODO', plural: 'TODO', kit: ${ID}_GAME },
  { kind: 'practice', skill: 'numbers', title: 'TODO', decor: '✨', theme: '⭐', intro: 'TODO' },
  { kind: 'pause', line: "TODO: a gentle cliffhanger. Let's find out next time!" },
  // Visit 2: the adventure
  { kind: 'story', title: 'TODO chapter two', pages: ${ID}_STORY_2, first: ${ID}_STORY_1.length },
  // 2 activities: pick from the kinds in islands.ts. Pictures are { emoji, say, art? } and must
  // show exactly what's said (see #gallery/items; story cards: art: 'story:${id}:<page>').
  { kind: 'practice', skill: 'reading', title: 'TODO', decor: '📖', intro: 'TODO' },
  { kind: 'verse', chunks: ${ID}_VERSE.chunks, ref: ${ID}_VERSE.ref },
  { kind: 'pause', line: "TODO. Let's find out next time!" },
  // Visit 3: the rescue
  {
    kind: 'sequence', title: 'Tell the Story', intro: 'TODO',
    items: [1, 3, 5, 7, 9].map((n) => ({ emoji: '✨', say: \`TODO page \${n}\`, art: \`story:${id}:\${n}\` })),
  },
  { kind: 'battle', foe: 'TODO-new-pal', intro: 'TODO' },
  { kind: 'song', song: 'TODO-song-id', intro: 'TODO' },
  { kind: 'reward', pal: 'TODO-new-pal', sticker: '⭐', stickerName: 'TODO' },
]
`)

const comps = Array.from({ length: PART * 2 }, (_, i) => `// ${i + 1}. "TODO page ${i + 1}"
function Page${i + 1}() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}
`).join('\n')
writeFileSync(artFile, `// ${name}: one picture per story page, both parts in order (see data/${id}.ts for the words).
// Built from the kit (./kit.tsx) and people (../people.tsx). God is never drawn as a person: His
// presence is light.
import type { ComponentType } from 'react'
import { Emoji, Scene, Tap } from './kit'

${comps}
export const ${ID}_ART: ComponentType[] = [${Array.from({ length: PART * 2 }, (_, i) => `Page${i + 1}`).join(', ')}]
`)

writeFileSync(gameFile, `// ${name}: the pictures for the island's mini-game (activities/games/types.ts says what each
// kind of game needs). TODO: pick the game that fits the story, and draw its kit.
import type { SpotKit } from '../../activities/games/types'
import { Emoji, Scene } from '../scenes/kit'

export const ${ID}_GAME: SpotKit = {
  Picture: () => <Scene sky="day" ground="meadow" />,
  targets: [[200, 360], [420, 330], [640, 380]].map(([x, y], i) => ({
    id: \`thing-\${i}\`, at: [x, y] as [number, number], r: 50,
    Draw: ({ found }: { found: boolean }) => <g opacity={found ? 1 : 0.6}><Emoji e="🐑" x={0} y={0} size={70} /></g>,
  })),
}
`)

console.log(`Created:
  src/data/${id}.ts
  src/art/scenes/${id}.tsx
  src/art/games/${id}.tsx

When it's ready (see docs/ISLAND-GUIDE.md, "Before it ships"), register it:
  src/art/scenes/index.ts   import { ${ID}_ART } from './${id}'   and   ${id}: ${ID}_ART,
  src/data/islands.ts       import { ${ID}_STEPS } from './${id}'   and add { id: '${id}', name: '${q(name)}', emoji, color, steps: ${ID}_STEPS }
  src/data/seas.ts          (it's probably listed already: check its sea and order)
  src/data/pals.ts + src/art/pals/  the island's two new Pals
  src/data/songs.ts + scripts/sing/scores.py  the island's song
Then: npx tsc -b && npm test && node scripts/film/gallery.mjs <out> scenes/${id} --scale 2`)
