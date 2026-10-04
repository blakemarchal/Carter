// Progress backups: the game posts every player's saved progress here, so a lost or reset iPad
// doesn't lose it. Kept in STATE_DIRECTORY (set by systemd's StateDirectory).
// Each backup is tagged with the device that made it, and the last KEEP copies per device are kept,
// so one device's backups (a test laptop, say) can never push out or hide another's (the iPad's).
import { mkdir, readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const KEEP = 10
const MAX_BYTES = 512 * 1024
const NAME = /^backup-(\d+)-([a-z0-9]{1,16})$/ // backup-<time>-<device>

/**
 * Who is in a backup: each player's name and how far they've got. Saves are named "ark-pals:…";
 * backups from before the game had that name say "carters-ark:…", where the first player's progress
 * was the bare "…:v1".
 */
function summarize(data) {
  const parse = (s) => { try { return JSON.parse(s) } catch { return null } }
  const keys = data.keys ?? {}
  const ns = keys['ark-pals:profiles'] ? 'ark-pals' : 'carters-ark'
  const profiles = parse(keys[`${ns}:profiles`])?.list ?? []
  return profiles.map((p, i) => {
    const prog = parse(keys[`${ns}:v1:${p.id}`] ?? (ns === 'carters-ark' && i === 0 ? keys['carters-ark:v1'] : undefined)) ?? {}
    return { name: String(p.name ?? '').slice(0, 16), emoji: p.emoji, islands: prog.islandsDone?.length ?? 0, pals: Object.keys(prog.pals ?? {}).length }
  })
}

/** `maxFiles`: how many backups one family keeps in all (the oldest go first). */
export function createBackups(dir, { maxFiles = 60 } = {}) {
  const ready = mkdir(dir, { recursive: true })
  ready.catch((e) => console.error(`Backup folder ${dir} unavailable: ${e.message}`))

  async function names() {
    await ready
    return (await readdir(dir)).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).filter((n) => NAME.test(n))
  }

  return {
    /** Saves a backup (raw JSON text: { savedAt, device, label, keys }). Throws on bad input. */
    async save(text) {
      if (text.length > MAX_BYTES) throw Object.assign(new Error('backup too large'), { status: 413 })
      const data = JSON.parse(text) // must be valid JSON
      if (typeof data !== 'object' || !data || typeof data.keys !== 'object') throw Object.assign(new Error('not a backup'), { status: 400 })
      const device = /^[a-z0-9]{1,16}$/.test(data.device ?? '') ? data.device : 'unknown'
      await ready
      const name = `backup-${Date.now()}-${device}`
      await writeFile(join(dir, `${name}.json.tmp`), text)
      await rename(join(dir, `${name}.json.tmp`), join(dir, `${name}.json`))
      const mine = (await names()).filter((n) => n.endsWith(`-${device}`)).sort()
      for (const old of mine.slice(0, -KEEP)) await unlink(join(dir, `${old}.json`)).catch(() => {})
      const all = (await names()).sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]))
      for (const old of all.slice(0, -maxFiles)) if (old !== name) await unlink(join(dir, `${old}.json`)).catch(() => {})
      return name
    },
    /** Every backup, newest first, each with a summary of who is in it. */
    async list() {
      const out = []
      for (const name of (await names()).sort().reverse()) {
        try {
          const data = JSON.parse(await readFile(join(dir, `${name}.json`), 'utf8'))
          out.push({ id: name, savedAt: data.savedAt ?? null, device: name.split('-')[2], label: String(data.label ?? 'Unknown device').slice(0, 40), players: summarize(data) })
        } catch { /* unreadable file: skip */ }
      }
      return out
    },
    /** How many backups there are. */
    async usage() {
      return { count: (await names()).length, maxFiles }
    },
    /** One backup's JSON text by id, or the newest overall when no id is given. */
    async get(id) {
      const all = (await names()).sort()
      const name = id ? all.find((n) => n === id) : all[all.length - 1]
      return name ? readFile(join(dir, `${name}.json`), 'utf8') : null
    },
  }
}
