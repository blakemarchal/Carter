// Progress backups: the game posts every player's saved progress here, so a lost or reset iPad
// doesn't lose it. Kept in STATE_DIRECTORY (systemd StateDirectory=carter -> /var/lib/carter).
// The last 20 copies are kept; restore reads the newest.
import { mkdir, readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const KEEP = 20
const MAX_BYTES = 512 * 1024

export function createBackups(dir) {
  const ready = mkdir(dir, { recursive: true })
  ready.catch((e) => console.error(`Backup folder ${dir} unavailable: ${e.message}`))

  async function list() {
    await ready
    return (await readdir(dir)).filter((f) => /^backup-\d+\.json$/.test(f)).sort()
  }

  return {
    /** Saves a backup (raw JSON text). Throws on bad input. */
    async save(text) {
      if (text.length > MAX_BYTES) throw Object.assign(new Error('backup too large'), { status: 413 })
      const data = JSON.parse(text) // must be valid JSON
      if (typeof data !== 'object' || !data || typeof data.keys !== 'object') throw Object.assign(new Error('not a backup'), { status: 400 })
      await ready
      const file = join(dir, `backup-${Date.now()}.json`)
      await writeFile(`${file}.tmp`, text)
      await rename(`${file}.tmp`, file)
      const all = await list()
      for (const old of all.slice(0, -KEEP)) await unlink(join(dir, old)).catch(() => {})
    },
    /** The newest backup as JSON text, or null. */
    async latest() {
      const all = await list()
      return all.length ? readFile(join(dir, all[all.length - 1]), 'utf8') : null
    },
  }
}
