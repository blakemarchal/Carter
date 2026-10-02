// Renders the story illustrations, with each page's words, to preview/scenes.html.
// Run: npm run preview:scenes -- noah,creation   (no argument = all islands)
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync, mkdirSync } from 'node:fs'
import { STORY_ART } from '../src/art/scenes'
import { ISLANDS } from '../src/data/islands'

const only = process.argv[2]?.split(',')
let n = 0
const blocks = Object.entries(STORY_ART).filter(([id]) => !only || only.includes(id)).map(([id, pages]) => {
  const story = ISLANDS.find((i) => i.id === id)?.steps?.find((s) => s.kind === 'story')
  const words = story?.kind === 'story' ? story.pages.map((p) => p.text) : []
  return `<h2>${id}</h2><div class="grid">${pages.map((Page, i) => `<figure>${renderToStaticMarkup(<Page />, { identifierPrefix: `r${n++}-` })}<figcaption>${i + 1}. ${words[i] ?? ''}</figcaption></figure>`).join('')}</div>`
}).join('')

mkdirSync('preview', { recursive: true })
writeFileSync('preview/scenes.html', `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:12px;background:#fff0f7;font:13px system-ui}h2{margin:8px 0}
.grid{display:grid;grid-template-columns:repeat(3,400px);gap:10px}figure{margin:0;background:#fff;border-radius:12px;overflow:hidden}
figure svg{display:block;width:400px;height:225px}figcaption{padding:6px 8px;color:#555}
</style>${blocks}`)
console.log('wrote preview/scenes.html')
