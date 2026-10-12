// The recording studio: progress per queue, flags on lines whose words changed since they were recorded, and
// checking a take (its silence trimmed, its level set, a warning when it's too quiet or too loud).
import { describe, expect, it } from 'vitest'
import { byRef, checkTake, lineStatus, progress, saveUrl, scriptLines, type IndexClip } from '../voice/studio'
import type { ScriptItem } from '../voice/script'

const item = (ref: string, say: string, queue: ScriptItem['queue'] = 'praise'): ScriptItem => ({ ref, queue, voice: 'mom', key: say, say })
const clip = (ref: string, said: string, at = 1): IndexClip => ({ key: said, said, ref, at, start: 0, end: 0, gain: 1 })

describe('the studio', () => {
  it('a line is done, still to do, or changed since it was recorded', () => {
    const a = item('praise:0', 'Great job!')
    const b = item('story:noah:0:1', 'God told Noah to build a big boat.', 'story')
    const clips = { id_a: clip('praise:0', 'Great job!'), id_old: clip('story:noah:0:1', 'God told Noah to build a boat.') }
    expect(lineStatus(a, 'id_a', clips)).toBe('done')
    expect(lineStatus(b, 'id_b', clips)).toBe('changed') // (the page was rewritten: record it again)
    expect(lineStatus(item('praise:1', 'Yay!'), 'id_c', clips)).toBe('todo')
    // (a template part: same key, but its words changed)
    const part: ScriptItem = { ref: 'tpl:way-to-go:0', queue: 'templates', voice: 'mom', key: '⟪part⟫ way-to-go 0', say: 'Way to go,' }
    expect(lineStatus(part, 'id_p', { id_p: clip('tpl:way-to-go:0', 'Way to go, buddy,') })).toBe('changed')
    // (copied from Family voices: no ref or words kept, recorded all the same)
    expect(lineStatus(b, 'id_b', { id_b: { ...clip('', ''), ref: null, said: null, promoted: true } })).toBe('done')
    expect(byRef({ x: clip('r', 'old', 1), y: clip('r', 'new', 2) }).get('r')!.said).toBe('new')
  })

  it('counts progress per queue: "412 of 1,030"', () => {
    const items = [item('p0', 'A!'), item('p1', 'B!'), item('s0', 'Page.', 'story')]
    const ids = new Map(items.map((it, i) => [it, `id${i}`]))
    expect(progress(items, ids, { id0: clip('p0', 'A!'), old: clip('s0', 'Old page.') })).toEqual({
      praise: { done: 1, changed: 0, total: 2 },
      story: { done: 0, changed: 1, total: 1 },
    })
  })

  it('a take is trimmed to its sound and brought to a steady level, with a warning when it’s off', () => {
    const rate = 1000
    const take = (amp: number) => { const ch = new Float32Array(2000); for (let i = 600; i < 1400; i++) ch[i] = Math.sin(i / 3) * amp; return ch }
    const ok = checkTake(take(0.3), rate)
    expect(ok.warning).toBe('')
    expect(ok.start).toBeGreaterThan(500)
    expect(ok.end).toBeLessThan(1500)
    expect(ok.gain).toBeGreaterThan(0.3)
    expect(ok.gain).toBeLessThan(1)
    expect(checkTake(take(0.02), rate).warning).toBe('quiet')
    expect(checkTake(take(1), rate).warning).toBe('loud')
    expect(checkTake(new Float32Array(500), rate).warning).toBe('empty')
  })

  it('saves with what the line is, so the next change to its words can be flagged; prints the same list', () => {
    const it = item('praise:0', 'Great job!')
    const url = new URL(saveUrl('mom', 'abcdef0123456789', it, { start: 120, end: 900, gain: 1.2 }), 'http://x')
    expect(url.pathname).toBe('/voice/house/mom/abcdef0123456789')
    expect(Object.fromEntries(url.searchParams)).toEqual({ key: 'Great job!', said: 'Great job!', ref: 'praise:0', start: '120', end: '900', gain: '1.2' })
    expect(scriptLines([it, { ...it, say: 'Way to go,', context: 'Way to go, ___!' }])).toEqual(['1. Great job!', '2. Way to go,   (Way to go, ___!)'])
  })
})
