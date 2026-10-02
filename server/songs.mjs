// Sing-along songs: the audio a parent adds (any recording they own, or one made with a music
// tool), plus each song's details (title, words for added songs, when each line starts).
// Kept in STATE_DIRECTORY/songs as <id>.json and <id>.<audio ext>.
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ID = /^[a-z0-9-]{1,40}$/
const MAX_AUDIO = 20 * 1024 * 1024
const TYPES = { 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/aac': 'aac', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/webm': 'webm', 'audio/ogg': 'ogg' }

export function createSongs(dir) {
  const ready = mkdir(dir, { recursive: true })
  ready.catch((e) => console.error(`Songs folder ${dir} unavailable: ${e.message}`))
  const files = async () => { await ready; return readdir(dir) }
  const audioFile = async (id) => (await files()).find((f) => f.startsWith(`${id}.`) && !f.endsWith('.json'))
  const bad = (status, msg) => Object.assign(new Error(msg), { status })

  async function readMeta(id) {
    try { return JSON.parse(await readFile(join(dir, `${id}.json`), 'utf8')) } catch { return { id } }
  }

  return {
    /** Every song the server knows about, with `audio` (a version stamp) when it has a recording. */
    async list() {
      const all = await files()
      const ids = new Set(all.map((f) => f.split('.')[0]).filter((id) => ID.test(id)))
      return Promise.all([...ids].map(async (id) => {
        const meta = await readMeta(id)
        return { ...meta, id, audio: all.some((f) => f.startsWith(`${id}.`) && !f.endsWith('.json')) ? meta.audioVersion ?? 1 : null }
      }))
    },
    /** Saves a song's details: { title?, lines?, times? }. */
    async putMeta(id, text) {
      if (!ID.test(id)) throw bad(400, 'bad id')
      if (text.length > 64 * 1024) throw bad(413, 'too large')
      const data = JSON.parse(text)
      const meta = { ...(await readMeta(id)), id }
      if (typeof data.title === 'string') meta.title = data.title.slice(0, 80)
      if (Array.isArray(data.lines)) meta.lines = data.lines.filter((l) => typeof l === 'string').map((l) => l.slice(0, 200)).slice(0, 80)
      if (Array.isArray(data.times)) meta.times = data.times.filter((t) => typeof t === 'number' && t >= 0).slice(0, 80)
      await writeFile(join(dir, `${id}.json`), JSON.stringify(meta))
    },
    async putAudio(id, type, body) {
      if (!ID.test(id)) throw bad(400, 'bad id')
      const ext = TYPES[type.split(';')[0].trim()]
      if (!ext) throw bad(415, 'unsupported audio type')
      if (body.length > MAX_AUDIO) throw bad(413, 'too large')
      const old = await audioFile(id)
      if (old) await unlink(join(dir, old)).catch(() => {})
      await writeFile(join(dir, `${id}.${ext}`), body)
      const meta = await readMeta(id)
      await writeFile(join(dir, `${id}.json`), JSON.stringify({ ...meta, id, audioVersion: Date.now() }))
    },
    async getAudio(id) {
      if (!ID.test(id)) return null
      const f = await audioFile(id)
      if (!f) return null
      const ext = f.split('.').pop()
      return { type: Object.entries(TYPES).find(([, e]) => e === ext)?.[0] ?? 'application/octet-stream', body: await readFile(join(dir, f)) }
    },
    async remove(id) {
      if (!ID.test(id)) return
      for (const f of await files()) if (f.startsWith(`${id}.`)) await unlink(join(dir, f)).catch(() => {})
    },
  }
}
