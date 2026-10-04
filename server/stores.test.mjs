// A family's recordings, songs and backups: how much one family can keep.
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createBackups } from './backup.mjs'
import { createRecordings } from './recordings.mjs'
import { createSongs } from './songs.mjs'

const folder = () => mkdtempSync(join(tmpdir(), 'arkpals-store-'))
const id = (n) => n.toString(16).padStart(16, '0')

describe('family storage limits', () => {
  it('recordings: a new one past the limit is refused, but replacing one is fine', async () => {
    const rec = createRecordings(folder(), { maxBytes: 2500, maxCount: 3 })
    await rec.put(id(1), 'audio/mp4', Buffer.alloc(1000))
    await rec.put(id(2), 'audio/mp4', Buffer.alloc(1000))
    await expect(rec.put(id(3), 'audio/mp4', Buffer.alloc(1000))).rejects.toMatchObject({ status: 507 })
    await rec.put(id(2), 'audio/mp4', Buffer.alloc(1400)) // (a redo of the same line)
    expect(await rec.usage()).toMatchObject({ count: 2, bytes: 2400 })
    await rec.put(id(3), 'audio/mp4', Buffer.alloc(100))
    await expect(rec.put(id(4), 'audio/mp4', Buffer.alloc(1))).rejects.toMatchObject({ status: 507 }) // (too many)
  })

  it('songs: the same', async () => {
    const songs = createSongs(folder(), { maxBytes: 3000, maxCount: 2 })
    await songs.putAudio('first', 'audio/mpeg', Buffer.alloc(1000))
    await songs.putAudio('second', 'audio/mpeg', Buffer.alloc(1000))
    await expect(songs.putAudio('third', 'audio/mpeg', Buffer.alloc(10))).rejects.toMatchObject({ status: 507 })
    await expect(songs.putAudio('second', 'audio/mpeg', Buffer.alloc(2500))).rejects.toMatchObject({ status: 507 })
    expect((await songs.usage()).count).toBe(2)
  })

  it('backups: only the newest are kept, in all and for each device', async () => {
    const backups = createBackups(folder(), { maxFiles: 4 })
    for (let i = 0; i < 6; i++) {
      await backups.save(JSON.stringify({ savedAt: `day ${i}`, device: `dev${i % 3}`, keys: {} }))
      await new Promise((r) => setTimeout(r, 3))
    }
    expect((await backups.usage()).count).toBe(4)
    expect((await backups.list()).map((b) => b.savedAt)).toEqual(['day 5', 'day 4', 'day 3', 'day 2'])
  })
})
