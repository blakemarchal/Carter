/// <reference types="node" />
// No child is written into the code: names, birthdays and families come from the players and the
// Parent Corner. (The game's first storage name, "carters-ark", is only kept for moving old saves.)
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { expect, it } from 'vitest'

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|json|css|html)$/.test(f) ? [p] : []
  })

it('no child is written into the game', () => {
  const found: string[] = []
  for (const f of [...files('src'), 'index.html', 'vite.config.ts']) {
    if (f.includes('__tests__')) continue
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      // "Luke 2:11" is the Bible book; "carters-ark" is the old storage name.
      if (/\bcarter\b/i.test(line) || /\bLuke\b(?!\s+\d)/.test(line)) found.push(`${f}:${i + 1}: ${line.trim()}`)
    })
  }
  expect(found).toEqual([])
})
