// Family voice recordings: Mom or Dad reading a line (a story page), stored by the line's id
// (a hash of its text, made by the game). Kept in STATE_DIRECTORY/recordings.
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const MAX_BYTES = 3 * 1024 * 1024
const ID = /^[0-9a-f]{16}$/
const TYPES = { 'audio/mp4': 'm4a', 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'audio/wav': 'wav' }

/** `maxBytes`, `maxCount`: how much one family can keep (a new recording past that is refused, 507). */
export function createRecordings(dir, { maxBytes = 300 * 1024 * 1024, maxCount = 3000 } = {}) {
  const ready = mkdir(dir, { recursive: true })
  ready.catch((e) => console.error(`Recordings folder ${dir} unavailable: ${e.message}`))
  const files = async () => { await ready; return readdir(dir) }
  const find = async (id) => (await files()).find((f) => f.startsWith(`${id}.`))

  const sizeOf = async (f) => (await stat(join(dir, f)).catch(() => ({ size: 0 }))).size
  async function usage() {
    const all = (await files()).filter((f) => ID.test(f.split('.')[0]))
    let bytes = 0
    for (const f of all) bytes += await sizeOf(f)
    return { count: all.length, bytes, maxCount, maxBytes }
  }

  return {
    usage,
    /** Ids of all recordings. */
    async list() {
      return (await files()).map((f) => f.split('.')[0]).filter((id) => ID.test(id))
    },
    async get(id) {
      if (!ID.test(id)) return null
      const f = await find(id)
      if (!f) return null
      const ext = f.split('.').pop()
      const type = Object.entries(TYPES).find(([, e]) => e === ext)?.[0] ?? 'application/octet-stream'
      return { type, body: await readFile(join(dir, f)) }
    },
    async put(id, type, body) {
      if (!ID.test(id)) throw Object.assign(new Error('bad id'), { status: 400 })
      const ext = TYPES[type.split(';')[0].trim()]
      if (!ext) throw Object.assign(new Error('unsupported audio type'), { status: 415 })
      if (body.length > MAX_BYTES) throw Object.assign(new Error('too large'), { status: 413 })
      const old = await find(id)
      const u = await usage()
      const freed = old ? await sizeOf(old) : 0
      if (u.count + (old ? 0 : 1) > maxCount || u.bytes - freed + body.length > maxBytes) {
        throw Object.assign(new Error('the family recordings are full'), { status: 507 })
      }
      if (old) await unlink(join(dir, old)).catch(() => {})
      await writeFile(join(dir, `${id}.${ext}`), body)
    },
    async remove(id) {
      if (!ID.test(id)) return
      const f = await find(id)
      if (f) await unlink(join(dir, f)).catch(() => {})
    },
  }
}
