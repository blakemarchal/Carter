// The Privacy Policy and Terms of Use pages (arkpals.world/privacy and /terms) match their documents.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
// @ts-expect-error (a plain script, without types)
import { PAGES, page, toHtml } from '../../scripts/legal-pages.mjs'

describe('the legal pages', () => {
  it('are up to date with docs/legal (if not: node scripts/legal-pages.mjs)', () => {
    // (line endings aside: a Windows checkout has CRLF)
    const read = (f: string) => readFileSync(f, 'utf8').replace(/
/g, '
')
    for (const p of PAGES as { md: string; out: string }[]) expect(read(p.out)).toBe(page(read(p.md)))
  })

  it('turn the Markdown into HTML, escaped', () => {
    expect(toHtml('## Hi\n\nSome **bold** and a [link](/terms).\n\n- one\n  more\n- two')).toBe(
      '<h2>Hi</h2>\n<p>Some <strong>bold</strong> and a <a href="/terms">link</a>.</p>\n<ul><li>one more</li><li>two</li></ul>')
    expect(toHtml('<script>x</script>')).toBe('<p>&lt;script&gt;x&lt;/script&gt;</p>')
  })

  it('leave out notes about where a draft comes from', () => {
    expect(page('# T\n\n> DRAFT (docs/BUSINESS-PLAN.md §5). Read it.')).not.toContain('docs/')
  })
})
