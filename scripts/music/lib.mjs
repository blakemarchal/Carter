// Shared bits for the music scripts (docs/GAME-PLAN.md, the music decision of Oct 16, 2026): the ElevenLabs key,
// kept outside the repo and never printed; calls to ElevenLabs; the songs and their lyrics; the work folders;
// the Python environment (Demucs for the "I sing!" version, librosa for the beat, LAME for the mp3s).
//
// The pipeline, one song at a time (scripts/music/run.mjs does all of it):
//   make.mjs      the sung song from its lyrics (ElevenLabs Music), or a file from the drop folder (Suno…)
//   separate.mjs  the same song without the voice (Demucs), for "I sing!" and the studio
//   align.mjs     when each word is sung (ElevenLabs Scribe), checked against the lyrics; the beat (librosa)
//   install.mjs   the files into public/music and the timings into src/data/songs.gen.json
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const HERE = join(ROOT, 'scripts', 'music')
export const WORK = join(HERE, 'work') // (not committed: what's made, before it's installed)
export const DROP = join(HERE, 'drop') // (not committed: songs made elsewhere, e.g. Suno: <id>.mp3, <id>-sing.mp3)
export const APP_DIR = join(process.env.LOCALAPPDATA ?? join(homedir(), '.local', 'share'), 'ArkPals')
export const KEY_FILE = join(APP_DIR, 'elevenlabs.key')
export const PY = join(APP_DIR, 'musicenv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')
export const API = 'https://api.elevenlabs.io'

/** The key, from the file key.mjs wrote (never from the command line, so it's never in a shell history). */
export function readKey() {
  if (!existsSync(KEY_FILE)) throw new Error('No ElevenLabs key saved yet. Copy the key, then run: node scripts/music/key.mjs')
  const key = readFileSync(KEY_FILE, 'utf8').trim()
  if (!key) throw new Error('The saved ElevenLabs key is empty. Copy the key, then run: node scripts/music/key.mjs')
  return key
}

/** A call to ElevenLabs. `json` or `form` is the body; the key goes in the header and nowhere else. */
export async function eleven(path, { method = 'GET', json, form, query, key = readKey() } = {}) {
  const url = new URL(API + path)
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v))
  const headers = { 'xi-api-key': key }
  if (json) headers['Content-Type'] = 'application/json'
  const r = await fetch(url, { method, headers, body: json ? JSON.stringify(json) : form })
  if (!r.ok) {
    const text = (await r.text().catch(() => '')).replaceAll(key, '[key]').slice(0, 600)
    throw Object.assign(new Error(`ElevenLabs ${method} ${path}: HTTP ${r.status} ${text}`), { status: r.status })
  }
  return r
}

/** Every built-in song, in the game's order: id, title, island (src/data/songs.ts), and its lyric lines (lyrics.json). */
export function songs() {
  const ts = readFileSync(join(ROOT, 'src', 'data', 'songs.ts'), 'utf8')
  const lyrics = JSON.parse(readFileSync(join(HERE, 'lyrics.json'), 'utf8'))
  const out = []
  for (const m of ts.matchAll(/\{ id: '([^']+)', title: (?:'([^']*)'|"([^"]*)"), emoji: '[^']*', color: '[^']*'(?:, island: '([^']+)')? \}/g)) {
    const id = m[1]
    if (!lyrics[id]) continue
    out.push({ id, title: m[2] ?? m[3], island: m[4] ?? null, lines: lyrics[id].lines, name: lyrics[id].name ?? null })
  }
  return out
}

export const styles = () => JSON.parse(readFileSync(join(HERE, 'styles.json'), 'utf8'))

/** Re-encodes to a small mp3 at a steady loudness (the songs and loops all play at the same level): encode.py. */
export function transcode(input, output, { kbps = 96, loudnorm = true, fadeOut = 0 } = {}) {
  python(join(HERE, 'encode.py'), [input, output, '--kbps', String(kbps), ...(loudnorm ? ['--loudnorm'] : []), ...(fadeOut ? ['--fade-out', String(fadeOut)] : [])])
}

/** A file's name with its content hash, so devices fetch a new version when it changes (as make.py did). */
export const hashedName = (stem, data) => `${stem}.${createHash('sha1').update(data).digest('hex').slice(0, 8)}.mp3`

/** Runs a Python script in the music environment (set up by setup.mjs), with its output shown. */
export function python(script, args = []) {
  if (!existsSync(PY)) throw new Error(`The music Python environment isn't set up. Run: node scripts/music/setup.mjs`)
  const r = spawnSync(PY, [script, ...args], { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.status !== 0) throw new Error(`${script} failed (exit ${r.status})`)
  return r.stdout
}

export const ensureDir = (d) => mkdirSync(d, { recursive: true })
