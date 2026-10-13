// The Privacy Policy and Terms of Use as web pages (arkpals.world/privacy and /terms, open to anyone): made from
// docs/legal/PRIVACY.md and TERMS.md into public/legal/*.html, which the build ships. Run it after editing either:
//   node scripts/legal-pages.mjs           (a test fails while a page is out of date)
// The Markdown here is simple (headings, paragraphs, lists, bold, italics, links, a quote), so it's converted here.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const PAGES = [
  { md: 'docs/legal/PRIVACY.md', out: 'public/legal/privacy.html' },
  { md: 'docs/legal/TERMS.md', out: 'public/legal/terms.html' },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** One line of Markdown's inline marks, as HTML. */
function inline(text) {
  return esc(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

/** The page's HTML body from its Markdown. */
export function toHtml(md) {
  const out = []
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  let para = []
  let list = null // the open list's items
  let quote = []
  const flush = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`)
    para = []
    if (list) out.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`)
    list = null
    if (quote.length) out.push(`<aside class="note">${inline(quote.join(' '))}</aside>`)
    quote = []
  }
  for (const raw of lines) {
    const line = raw.trimEnd()
    let m
    if (!line.trim()) flush()
    else if ((m = /^(#{1,3}) (.*)$/.exec(line))) {
      flush()
      out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`)
    } else if ((m = /^> ?(.*)$/.exec(line))) {
      if (para.length || list) flush()
      quote.push(m[1])
    } else if ((m = /^- (.*)$/.exec(line))) {
      if (para.length || quote.length) flush()
      ;(list ??= []).push(m[1])
    } else if (list && /^\s{2,}\S/.test(line)) list[list.length - 1] += ` ${line.trim()}`
    else {
      if (list || quote.length) flush()
      para.push(line.trim())
    }
  }
  flush()
  return out.join('\n')
}

/** The whole page. (Notes to ourselves about where a draft comes from, "(docs/…)", aren't shown.) */
export function page(source) {
  const md = source.replace(/\s*\(docs\/[^)]*\)/g, '')
  const title = /^# (.*)$/m.exec(md)?.[1] ?? 'Ark Pals'
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
:root{--ink:#3b2a4a;--muted:#7a6a8a;--pink:#e2468f;--line:#f0c4da;--bg:#fff7fb}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:760px;margin:0 auto;padding:28px 20px 60px}
h1{color:var(--pink);font-size:32px;line-height:1.2;margin:8px 0 18px}h2{font-size:22px;margin:30px 0 8px}h3{font-size:18px;margin:22px 0 6px}
p,ul{margin:0 0 14px}ul{padding-left:22px}li{margin:0 0 8px}a{color:var(--pink)}code{font-size:.9em;background:#fbe9f2;padding:1px 5px;border-radius:5px}
.note{background:#fff;border:2px solid var(--line);border-radius:14px;padding:12px 16px;margin:0 0 20px;color:var(--muted);font-size:15px}
nav{display:flex;gap:16px;font-size:15px;margin-bottom:6px}nav a{text-decoration:none}
</style></head>
<body><main>
<nav><a href="/">🌈 Ark Pals</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>
${toHtml(md)}
</main></body></html>
`
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const p of PAGES) {
    mkdirSync('public/legal', { recursive: true })
    writeFileSync(p.out, page(readFileSync(p.md, 'utf8')))
    console.log(`${p.md} -> ${p.out}`)
  }
}
