// Starts a new island from a template (docs/ISLAND-GUIDE.md):
//   npm run new-island -- red-sea "The Red Sea"
// Writes src/data/<id>.ts and src/art/scenes/<id>.tsx with the shape filled in and TODOs to replace,
// then prints the lines to add to the registries. Nothing is registered automatically, so the tests
// stay green until the island is ready.
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [id, ...rest] = process.argv.slice(2)
const name = rest.join(' ')
if (!id || !/^[a-z][a-z0-9-]*$/.test(id) || !name) {
  console.error('Usage: npm run new-island -- <id like red-sea> "<Name on the map>"')
  process.exit(1)
}
const ID = id.toUpperCase().replace(/-/g, '_')
const Pascal = id.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())
const root = join(import.meta.dirname, '..')
const dataFile = join(root, 'src', 'data', `${id}.ts`)
const artFile = join(root, 'src', 'art', 'scenes', `${id}.tsx`)
for (const f of [dataFile, artFile]) if (existsSync(f)) { console.error(`${f} already exists`); process.exit(1) }

const pages = Array.from({ length: 7 }, (_, i) => `  { scene: '✨', bg: 'linear-gradient(#bfe6ff,#fff3c9)', text: 'TODO page ${i + 1}' },`).join('\n')
writeFileSync(dataFile, `import type { Step, StoryPage } from './islands'

// ${name}. See docs/ISLAND-GUIDE.md: short sentences for 4-year-olds, grace first, numbers in words,
// no emoji or symbols in anything spoken, and every page's picture shows what its words say.
export const ${ID}_STORY: StoryPage[] = [
${pages}
]

// World English Bible (public domain), word for word.
export const ${ID}_VERSE = {
  ref: 'TODO 1:1',
  chunks: ['TODO', 'TODO'],
}

export const ${ID}_STEPS: Step[] = [
  { kind: 'story', title: '${name.replace(/'/g, "\\'")}', pages: ${ID}_STORY },
  // 2-4 activities: pick from the kinds in islands.ts. Pictures are { emoji, say, art? } and must
  // show exactly what's said (see #gallery/items; story cards: art: 'story:${id}:<page>').
  { kind: 'practice', skill: 'numbers', title: 'TODO', decor: '✨', theme: '⭐', intro: 'TODO' },
  { kind: 'verse', chunks: ${ID}_VERSE.chunks, ref: ${ID}_VERSE.ref },
  { kind: 'battle', foe: 'TODO-new-pal', intro: 'TODO' },
  { kind: 'reward', pal: 'TODO-new-pal', sticker: '⭐', stickerName: 'TODO' },
]
`)

const comps = Array.from({ length: 7 }, (_, i) => `// ${i + 1}. "TODO page ${i + 1}"
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
writeFileSync(artFile, `// ${name}: one picture per story page (see data/${id}.ts for the words). Built from the kit
// (./kit.tsx) and people (../people.tsx). God is never drawn as a person: His presence is light.
import type { ComponentType } from 'react'
import { Emoji, Scene, Tap } from './kit'

${comps}
export const ${ID}_ART: ComponentType[] = [${Array.from({ length: 7 }, (_, i) => `Page${i + 1}`).join(', ')}]
`)

console.log(`Created:
  src/data/${id}.ts
  src/art/scenes/${id}.tsx

When it's ready (see docs/ISLAND-GUIDE.md, "Before it ships"), register it:
  src/art/scenes/index.ts   import { ${ID}_ART } from './${id}'   and   ${id}: ${ID}_ART,
  src/data/islands.ts       import { ${ID}_STEPS } from './${id}'   and add { id: '${id}', name: '${name}', ... steps: ${ID}_STEPS }
  src/data/seas.ts          (it's probably listed already: check its sea and order)
  src/data/pals.ts + src/art/pals/  the island's two new Pals
Then: npx tsc -b && npm test && node scripts/film/gallery.mjs <out> scenes/${id} --scale 2
(${Pascal} is the island's name in code.)`)
