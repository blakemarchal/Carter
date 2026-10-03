// Play totals: only well-formed counts are kept, and they add up per day.
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { beforeEach, expect, it } from 'vitest'
import { createStats } from './stats.mjs'

let stats
beforeEach(async () => { stats = createStats(await mkdtemp(join(tmpdir(), 'ark-stats-'))) })

it('adds counts up per day', async () => {
  await stats.add(JSON.stringify({ day: '2026-10-03', counts: { 'start:noah': 1, 'done:noah': 1 } }))
  await stats.add(JSON.stringify({ day: '2026-10-03', counts: { 'start:noah': 2 } }))
  await stats.add(JSON.stringify({ day: '2026-10-04', counts: { 'start:creation': 1 } }))
  expect(await stats.recent()).toEqual([
    { day: '2026-10-04', counts: { 'start:creation': 1 } },
    { day: '2026-10-03', counts: { 'start:noah': 3, 'done:noah': 1 } },
  ])
})

it('keeps only plain counts (nothing that could carry personal details)', async () => {
  await stats.add(JSON.stringify({ day: '2026-10-03', counts: { 'start:noah': 1, 'Name: Robin': 1, 'quit:noah:3': 'x', 'big:one': 1e9, 'ok:one': 2.5 } }))
  expect(await stats.recent()).toEqual([{ day: '2026-10-03', counts: { 'start:noah': 1 } }])
  await expect(Promise.resolve().then(() => stats.add(JSON.stringify({ day: 'today', counts: {} })))).rejects.toMatchObject({ status: 400 })
  await expect(Promise.resolve().then(() => stats.add('not json'))).rejects.toMatchObject({ status: 400 })
})
