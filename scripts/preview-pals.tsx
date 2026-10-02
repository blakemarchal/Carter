// Renders every Pal (all stages, happy and grumpy) to preview/pals.html, for checking art.
// Run: npm run preview:art   (then open preview/pals.html, or screenshot it)
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync, mkdirSync } from 'node:fs'
import PalArt from '../src/components/PalArt'
import { PALS } from '../src/data/pals'

const only = process.argv[2]?.split(',')
let n = 0
const html = (el: React.ReactElement) => renderToStaticMarkup(el, { identifierPrefix: `r${n++}-` })
const rows = PALS.filter((p) => !only || only.includes(p.species) || only.includes(p.id)).map((p) => `
  <div class="row"><b>${p.id} (${p.species})</b>
    ${[0, 1, 2].map((s) => `<figure>${html(<PalArt pal={p} stage={s} size={200} still />)}<figcaption>${p.stages[s].name}</figcaption></figure>`).join('')}
    <figure>${html(<PalArt pal={p} stage={0} size={200} mood="grumpy" still />)}<figcaption>grumpy</figcaption></figure>
    <figure>${html(<PalArt pal={p} stage={1} size={200} silhouette still />)}<figcaption>silhouette</figcaption></figure>
  </div>`).join('')

mkdirSync('preview', { recursive: true })
writeFileSync('preview/pals.html', `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:12px;background:#fff0f7;font:14px system-ui}.row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.row b{width:150px}figure{margin:0;background:#fff;border-radius:16px;text-align:center}figcaption{font-size:12px;color:#777}
</style>${rows}`)
console.log('wrote preview/pals.html')
