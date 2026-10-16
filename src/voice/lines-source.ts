/// <reference types="node" />
// What scripts/voice-script.tsx writes to ./lines.gen.json (and what its test checks against): see there.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { bookLines } from '../data/animals'
import { LEVELS } from '../learn/levels'
import { rememberLines } from '../learn/remember'
import { thinkLines } from '../data/think'
import { bigWordLines } from '../data/bigwords'
import { scienceLines } from '../data/science'
import type { Skill } from '../lib/progress'

/** A small seeded random number generator (mulberry32), so sampling makes the same lines every time. */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const THEMES = [undefined, '💧', '🐟', '⭐', '🐑', '🌾']

/** Every line the learning levels say, with how many times it came up in the sampling, most first. */
export function learningLines(): [string, number][] {
  const counts = new Map<string, number>()
  const add = (t: string) => { const s = t.replace(/\s+/g, ' ').trim(); if (s) counts.set(s, (counts.get(s) ?? 0) + 1) }
  const random = Math.random
  Math.random = seeded(20261012)
  try {
    for (const skill of Object.keys(LEVELS) as Skill[]) {
      for (const level of LEVELS[skill]) {
        let quiet = 0
        for (let i = 0; quiet < 1500 && i < 30000; i++) {
          const before = counts.size
          const theme = THEMES[i % THEMES.length]
          const q = level.question(theme)
          add(q.say)
          for (const c of q.choices) add(`${c.say}!`) // (said when it's the right answer)
          const ex = level.exercise?.(theme)
          if (ex) add(ex.say)
          quiet = counts.size === before ? quiet + 1 : 0
        }
      }
    }
  } finally {
    Math.random = random
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? (f === '__tests__' || f === 'dev' ? [] : files(p)) : /\.tsx?$/.test(f) ? [p] : []
  }).sort()

const unescape = (s: string) => s.replace(/\\(['"`\\])/g, '$1')

/** The fixed strings the code passes to speak(), and what story pictures say when tapped. */
export function codeLines(root = 'src'): { code: string[]; taps: string[] } {
  const code = new Set<string>()
  const taps = new Set<string>()
  for (const f of files(root)) {
    const src = readFileSync(f, 'utf8')
    for (const m of src.matchAll(/\bspeak\(\s*(?:'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`$\\]|\\.)*)`)\s*[,)]/g)) code.add(unescape(m[1] ?? m[2] ?? m[3]))
    // (a line built at runtime: its sentences with nothing filled in are fixed, "… Which one comes next?")
    for (const m of src.matchAll(/\bspeak\(\s*`((?:[^`\\]|\\.)*\$\{(?:[^`\\]|\\.)*)`/g)) {
      const marked = unescape(m[1]).replace(/\$\{[^}]*\}/g, '\u0000')
      for (const sentence of marked.split(/(?<=[.!?])\s+/)) {
        const t = sentence.trim()
        if (t && !t.includes('\u0000') && !/[`$]/.test(t) && /^[A-Z"“]/.test(t) && /[.!?]$/.test(t)) code.add(t)
      }
    }
    if (f.includes(join('src', 'art'))) for (const m of src.matchAll(/\bsay="([^"]+)"/g)) taps.add(m[1])
  }
  const said = (t: string) => /\p{L}/u.test(t)
  return { code: [...code].filter(said).sort(), taps: [...taps].filter((t) => !code.has(t) && said(t)).sort() }
}

export const voiceLines = () => ({ learning: learningLines(), ...codeLines(), book: bookLines(), remember: rememberLines(), think: thinkLines(), bigwords: bigWordLines(), science: scienceLines() })
