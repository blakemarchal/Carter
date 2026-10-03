import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createBackups } from './backup.mjs'

let dir
let backups
beforeEach(async () => { dir = await mkdtemp(join(tmpdir(), 'ark-bk-')); backups = createBackups(dir) })
afterEach(async () => { await rm(dir, { recursive: true, force: true }) })

const backup = (device, label, extra = {}) => JSON.stringify({
  savedAt: new Date().toISOString(), device, label,
  keys: {
    'carters-ark:profiles': JSON.stringify({ active: 'robin', list: [{ id: 'robin', name: 'Robin', emoji: '🌈' }, { id: 'dad', name: 'Dad', emoji: '🧪' }] }),
    'carters-ark:v1': JSON.stringify({ islandsDone: ['noah', 'creation'], pals: { zippy: 10, pip: 0, rumble: 0 }, ...extra }),
    'carters-ark:v1:dad': JSON.stringify({ islandsDone: [], pals: {} }),
  },
})
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

describe('backups', () => {
  it('lists each backup with who is in it (an older backup: the first player was the bare "v1")', async () => {
    await backups.save(backup('ipad1', 'iPad'))
    const [b] = await backups.list()
    expect(b.label).toBe('iPad')
    expect(b.players).toEqual([
      { name: 'Robin', emoji: '🌈', islands: 2, pals: 3 },
      { name: 'Dad', emoji: '🧪', islands: 0, pals: 0 },
    ])
  })

  it('reads backups saved under the new names too', async () => {
    await backups.save(JSON.stringify({
      savedAt: new Date().toISOString(), device: 'ipad2', label: 'iPad',
      keys: {
        'ark-pals:profiles': JSON.stringify({ active: 'sam', list: [{ id: 'sam', name: 'Sam', emoji: '🦁' }, { id: 'jo', name: 'Jo', emoji: '🐳' }] }),
        'ark-pals:v1:sam': JSON.stringify({ islandsDone: ['noah'], pals: { zippy: 0 } }),
        'ark-pals:v1:jo': JSON.stringify({ islandsDone: [], pals: {} }),
      },
    }))
    const [b] = await backups.list()
    expect(b.players).toEqual([{ name: 'Sam', emoji: '🦁', islands: 1, pals: 1 }, { name: 'Jo', emoji: '🐳', islands: 0, pals: 0 }])
  })

  it('one device can never push out another device’s backups', async () => {
    await backups.save(backup('ipad1', 'iPad'))
    for (let i = 0; i < 14; i++) { await backups.save(backup('laptop', 'Windows computer')); await wait(2) }
    const list = await backups.list()
    expect(list.filter((b) => b.device === 'ipad1')).toHaveLength(1)
    expect(list.filter((b) => b.device === 'laptop')).toHaveLength(10) // only the newest ten of its own
  })

  it('newest first; get() by id returns that exact backup, and no id returns the newest', async () => {
    await backups.save(backup('ipad1', 'iPad')); await wait(3)
    await backups.save(backup('laptop', 'Windows computer'))
    const list = await backups.list()
    expect(list.map((b) => b.label)).toEqual(['Windows computer', 'iPad'])
    expect(JSON.parse(await backups.get(list[1].id)).label).toBe('iPad')
    expect(JSON.parse(await backups.get(null)).label).toBe('Windows computer')
  })

  it('rejects junk, and ignores ids that are not backup names', async () => {
    await expect(backups.save('not json')).rejects.toThrow()
    await expect(backups.save(JSON.stringify({ hello: 1 }))).rejects.toThrow('not a backup')
    expect(await backups.get('../../etc/passwd')).toBeNull()
    expect(await backups.get('backup-1-x')).toBeNull()
  })

  it('a bad device name is stored as "unknown", not used in a file name', async () => {
    const name = await backups.save(backup('../../evil', 'x'))
    expect(name.endsWith('-unknown')).toBe(true)
  })
})
