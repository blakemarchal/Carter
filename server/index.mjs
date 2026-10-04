// Ark Pals server: serves the built game (dist/) to signed-in families (server/families.mjs).
// A device is signed in with a one-time link (an invitation, or "sign in another device"), or, for the
// first family, with its old family password. Each family sees only its own backups, recordings and songs.
// No dependencies. Configured by environment (systemd EnvironmentFile=/opt/Carter/.env):
//   PORT                   default 3004
//   CARTER_PASSWORD_HASH   scrypt hash written by `npm run set-password` (the first family's password)
//   CARTER_SESSION_SECRET  random secret for signing the sign-in cookies
//   XAI_API_KEY            optional: enables Grok's "Ara" narration voice (npm run set-voice-key)
//   TTS_DAILY_CHARS        optional: cap on new narration generated per day (default 200000, about $3)
//   CACHE_DIRECTORY        set by systemd (CacheDirectory=carter); where narration clips are kept
//   STATE_DIRECTORY        set by systemd (StateDirectory=carter); where progress backups are kept
import { createServer } from 'node:http'
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { mkdirSync } from 'node:fs'
import { extname, join, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createTtsCache, MAX_CHARS, SPEEDS, VOICES } from './tts.mjs'
import { createBackups } from './backup.mjs'
import { createStats } from './stats.mjs'
import { createRecordings } from './recordings.mjs'
import { createSongs } from './songs.mjs'
import { openFamilies, ROLES } from './families.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORT = Number(process.env.PORT ?? 3004)
const HASH = process.env.CARTER_PASSWORD_HASH ?? ''
const SECRET = process.env.CARTER_SESSION_SECRET ?? ''
const COOKIE = 'carter_session' // (the old family-password cookie: still honored, and swapped for a device)
const DEVICE_COOKIE = 'arkpals_device'
const YEAR = 365 * 24 * 3600

if (!HASH || !SECRET) {
  console.error('CARTER_PASSWORD_HASH and CARTER_SESSION_SECRET must be set. Run: npm run set-password')
  process.exit(1)
}

const tts = process.env.XAI_API_KEY
  ? createTtsCache({
      apiKey: process.env.XAI_API_KEY,
      dir: process.env.CACHE_DIRECTORY ?? join(ROOT, '..', '.tts-cache'),
      dailyChars: Number(process.env.TTS_DAILY_CHARS ?? 200_000),
    })
  : null
if (!tts) console.log('XAI_API_KEY not set: the game will use the device voice. Run: npm run set-voice-key')

const STATE = process.env.STATE_DIRECTORY ?? join(ROOT, '..', '.backups')
mkdirSync(STATE, { recursive: true })
const families = openFamilies(join(STATE, 'arkpals.db'))
const stats = createStats(join(STATE, 'stats')) // (play totals only, never anyone's data: shared)

/**
 * A family's own backups, recordings and songs. The first family's stay where they always were; every
 * other family has its own folder.
 */
const stores = new Map()
function storesFor(familyId) {
  let st = stores.get(familyId)
  if (!st) {
    const dir = familyId === families.firstFamily() ? STATE : join(STATE, 'families', familyId)
    st = {
      backups: createBackups(familyId === families.firstFamily() ? STATE : join(dir, 'backups')),
      recordings: createRecordings(join(dir, 'recordings')),
      songs: createSongs(join(dir, 'songs')),
    }
    stores.set(familyId, st)
  }
  return st
}

/**
 * POST /stats adds a day's play totals (opt-in, counts only, from every family together); GET /stats is the
 * last 30 days (for the site's own family).
 */
async function handleStats(req, res) {
  if (req.method === 'POST') {
    try {
      await stats.add((await readBody(req, 32 * 1024)).toString('utf8'))
      res.writeHead(204)
    } catch (e) {
      res.writeHead(e.status ?? 400)
    }
    return res.end()
  }
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  return res.end(JSON.stringify(await stats.recent()))
}

async function readBody(req, max) {
  const chunks = []
  let size = 0
  for await (const c of req) {
    size += c.length
    if (size > max) throw Object.assign(new Error('too large'), { status: 413 })
    chunks.push(c)
  }
  return Buffer.concat(chunks)
}

/** /songs (list), /songs/<id> (PUT details, DELETE), /songs/<id>/audio (GET, PUT). */
async function handleSongs(req, res, url, { songs }) {
  const [, , id, part] = url.pathname.split('/')
  try {
    if (!id) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      return res.end(JSON.stringify(await songs.list()))
    }
    if (part === 'audio') {
      if (req.method === 'PUT') {
        await songs.putAudio(id, req.headers['content-type'] ?? '', await readBody(req, 21 * 1024 * 1024))
        res.writeHead(204)
        return res.end()
      }
      const a = await songs.getAudio(id)
      if (!a) { res.writeHead(404); return res.end() }
      // The URL carries a version (?v=), so the device may keep it for offline singing.
      res.writeHead(200, { 'Content-Type': a.type, 'Cache-Control': 'private, max-age=31536000' })
      return res.end(a.body)
    }
    if (req.method === 'PUT') {
      await songs.putMeta(id, (await readBody(req, 70 * 1024)).toString('utf8'))
      res.writeHead(204)
      return res.end()
    }
    if (req.method === 'DELETE') {
      await songs.remove(id)
      res.writeHead(204)
      return res.end()
    }
    res.writeHead(405)
    res.end()
  } catch (e) {
    res.writeHead(e.status ?? 400)
    res.end()
  }
}

/** /recordings (list), /recording/<id> (GET audio, PUT to save, DELETE). */
async function handleRecording(req, res, url, { recordings }) {
  if (url.pathname === '/recordings') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    return res.end(JSON.stringify(await recordings.list()))
  }
  const id = url.pathname.slice('/recording/'.length)
  if (req.method === 'PUT') {
    const chunks = []
    let size = 0
    for await (const c of req) {
      size += c.length
      if (size > 3.5 * 1024 * 1024) break
      chunks.push(c)
    }
    try {
      await recordings.put(id, req.headers['content-type'] ?? '', Buffer.concat(chunks))
      res.writeHead(204)
    } catch (e) {
      res.writeHead(e.status ?? 400)
    }
    return res.end()
  }
  if (req.method === 'DELETE') {
    await recordings.remove(id)
    res.writeHead(204)
    return res.end()
  }
  const rec = await recordings.get(id)
  if (!rec) {
    res.writeHead(404, { 'Cache-Control': 'no-store' })
    return res.end()
  }
  res.writeHead(200, { 'Content-Type': rec.type, 'Cache-Control': 'no-store' })
  res.end(rec.body)
}

async function handleBackup(req, res, url, { backups }) {
  if (req.method === 'POST') {
    let body = ''
    for await (const chunk of req) {
      body += chunk
      if (body.length > 600 * 1024) break
    }
    try {
      await backups.save(body)
      res.writeHead(204)
    } catch (e) {
      res.writeHead(e.status ?? 400)
    }
    return res.end()
  }
  // GET /backups lists them all (with who is in each); GET /backup?id=... is one; plain GET /backup is the newest.
  if (url.pathname === '/backups') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    return res.end(JSON.stringify(await backups.list()))
  }
  const text = await backups.get(url.searchParams.get('id'))
  res.writeHead(text ? 200 : 404, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  return res.end(text ?? '')
}

async function serveTts(res, url) {
  const text = (url.searchParams.get('text') ?? '').trim()
  const voice = url.searchParams.get('voice') ?? 'ara'
  const speed = url.searchParams.get('speed') ?? '1'
  if (!text || text.length > MAX_CHARS || !VOICES.has(voice) || !SPEEDS.has(speed)) {
    res.writeHead(400)
    return res.end()
  }
  // 503 tells the game the voice isn't set up, so it stops asking and uses the device voice.
  if (!tts) {
    res.writeHead(503, { 'Cache-Control': 'no-store' })
    return res.end()
  }
  try {
    const mp3 = await tts(text, voice, speed)
    // The URL fully determines the audio, so the device can keep it forever (and offline).
    res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=31536000, immutable' })
    res.end(mp3)
  } catch (e) {
    console.error(e.budget ? `TTS: ${e.message}` : e)
    res.writeHead(e.budget ? 429 : 502, { 'Cache-Control': 'no-store' })
    res.end()
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.txt': 'text/plain',
  '.woff2': 'font/woff2',
}

// ---- auth ----
function checkPassword(pw) {
  const [salt, hex] = HASH.split(':')
  if (!salt || !hex) return false
  const want = Buffer.from(hex, 'hex')
  const got = scryptSync(pw, salt, want.length)
  return timingSafeEqual(want, got)
}
const sign = (v) => createHmac('sha256', SECRET).update(v).digest('base64url')
/** Seconds until an old family-password cookie expires, or 0 if it isn't valid. */
function tokenLife(tok) {
  const [exp, mac] = (tok ?? '').split('.')
  if (!exp || !mac) return 0
  const a = Buffer.from(mac), b = Buffer.from(sign(exp))
  if (a.length !== b.length || !timingSafeEqual(a, b)) return 0
  return Math.max(0, Number(exp) - Date.now() / 1000)
}
// (Secure cookies need https. A request straight to this server, not through the web server in front of
// it, is a local test over http, so its cookies are plain.)
const secure = (req) => (req.headers['x-forwarded-for'] || !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host ?? '') ? ' Secure' : '')
const deviceCookie = (req, id) => `${DEVICE_COOKIE}=${id}.${sign(id)}; Max-Age=${YEAR}; Path=/; HttpOnly;${secure(req)} SameSite=Lax`
const clearOldCookie = `${COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`
/** The device id in a signed device cookie, or null. */
function deviceFrom(value) {
  const [id, mac] = (value ?? '').split('.')
  if (!id || !mac) return null
  const a = Buffer.from(mac), b = Buffer.from(sign(id))
  return a.length === b.length && timingSafeEqual(a, b) ? id : null
}
/** A short name for the device a request came from, so a family can tell its devices apart. */
function deviceLabel(req) {
  const ua = String(req.headers['user-agent'] ?? '')
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && /Mobile/.test(ua))) return 'iPad'
  if (/iPhone/.test(ua)) return 'iPhone'
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? 'Android phone' : 'Android tablet'
  if (/Windows/.test(ua)) return 'Windows computer'
  if (/Macintosh/.test(ua)) return 'Mac'
  if (/CrOS/.test(ua)) return 'Chromebook'
  return 'A device'
}
/** The signed-in device's { device, member, family }, from its cookie alone, or null. */
const currentSession = (req) => {
  const id = deviceFrom(cookies(req)[DEVICE_COOKIE])
  return id ? families.session(id) : null
}
/**
 * Who's asking: { device, member, family }, or null. Using the game keeps a device signed in (its cookie
 * is renewed as it's used). A device from before families (the old family-password cookie) becomes a
 * device of the first family's parents and gets a device cookie. Its old cookie is left alone: it always
 * means that same device, and stops working if the device is signed out.
 */
function sessionOf(req, res) {
  const s = currentSession(req)
  if (s) {
    if (families.seen(s.device.id)) res.setHeader('Set-Cookie', deviceCookie(req, s.device.id))
    return s
  }
  const old = cookies(req)[COOKIE]
  if (tokenLife(old) > 0) {
    const dev = families.passwordDevice(deviceLabel(req), old)
    if (!dev) return null
    res.setHeader('Set-Cookie', deviceCookie(req, dev))
    return families.session(dev)
  }
  return null
}
function cookies(req) {
  return Object.fromEntries((req.headers.cookie ?? '').split(';').map((c) => c.trim()).filter(Boolean).map((c) => [c.slice(0, c.indexOf('=')), c.slice(c.indexOf('=') + 1)]).filter(([k]) => k))
}

// Simple brute-force brake: 8 failed attempts per IP per 15 minutes.
const failures = new Map()
function limited(ip) {
  const f = failures.get(ip)
  if (!f || Date.now() - f.first > 15 * 60_000) return false
  return f.count >= 8
}
function fail(ip) {
  const f = failures.get(ip)
  if (!f || Date.now() - f.first > 15 * 60_000) failures.set(ip, { first: Date.now(), count: 1 })
  else f.count++
}

const LOGIN_PAGE = (msg = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<meta name="apple-mobile-web-app-capable" content="yes"><title>Ark Pals</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;align-content:center;gap:16px;padding:16px 0;box-sizing:border-box;font-family:system-ui,sans-serif;background:linear-gradient(#ffe0f0,#ffc0dc);color:#3b2a4a}
form{background:#fff;padding:32px 28px;border-radius:28px;box-shadow:0 10px 0 rgba(0,0,0,.08);width:min(360px,90vw);text-align:center}
h1{margin:0 0 6px;color:#e2468f;font-size:30px}p{margin:0 0 18px;color:#8a7a99}
input{width:100%;box-sizing:border-box;font-size:20px;padding:14px;border-radius:14px;border:2px solid #f0c4da;margin-bottom:14px}
button{width:100%;font-size:22px;font-weight:700;padding:14px;border:0;border-radius:14px;background:#ff6fae;color:#fff}
.err{color:#b42318;margin-bottom:12px}
form.alt{padding:22px 28px}.alt p{margin-bottom:12px;color:#6a5a7a}.alt input{font-size:16px}.alt button{font-size:18px;background:#fff;color:#e2468f;border:2px solid #ff6fae}
</style></head><body><form method="post" action="/login">
<h1>🌈 Ark Pals</h1><p>Grown-ups only: family password</p>
${msg ? `<div class="err">${msg}</div>` : ''}
<input type="password" name="password" autocomplete="current-password" aria-label="Family password" required>
<button>Open the Ark</button></form>
<form method="post" action="/login/link" class="alt"><p><b>Got a link from your family?</b> Open it, or paste it here:</p>
<input name="link" autocomplete="off" aria-label="Your link" placeholder="Paste your link" required>
<button>Use my link</button></form></body></html>`

// ---- families: the Parent Corner's family section, and the pages a link opens ----

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(body === undefined ? '' : JSON.stringify(body))
}
async function readJson(req) {
  try { return JSON.parse((await readBody(req, 8 * 1024)).toString('utf8') || '{}') } catch (e) { throw Object.assign(new Error('bad json'), { status: e.status ?? 400 }) }
}

/**
 * GET /family: the family, its grown-ups, devices and open invitations (and who "me" is).
 * Parents: POST /family/invite {name, role} -> {link}; DELETE /family/invite/<id>; DELETE /family/member/<id>;
 * PUT /family {name}. Anyone: POST /family/device-link -> {link}; PUT /family/me {name, look};
 * PUT /family/device {label} (this device's name); DELETE /family/device/<id> (parents: any of the
 * family's; others: only their own). Links are paths (/join/<token>): the app adds its own address.
 */
async function handleFamily(req, res, url, s) {
  const fam = s.family.id
  const parent = s.member.role === 'parent'
  const [, , what, id] = url.pathname.split('/')
  try {
    if (!what && req.method === 'GET') {
      return json(res, 200, { me: { member: s.member.id, device: s.device.id, role: s.member.role }, ...families.view(fam, s.device.id) })
    }
    if (!what && req.method === 'PUT') {
      if (!parent) return json(res, 403)
      families.renameFamily(fam, (await readJson(req)).name)
      return json(res, 204)
    }
    if (what === 'me' && req.method === 'PUT') {
      const b = await readJson(req)
      families.updateMember(fam, s.member.id, { name: b.name, look: b.look })
      return json(res, 204)
    }
    if (what === 'invite' && req.method === 'POST') {
      if (!parent) return json(res, 403)
      const b = await readJson(req)
      if (!ROLES.includes(b.role)) return json(res, 400)
      const l = families.makeLink({ kind: 'member', familyId: fam, name: b.name, role: b.role, madeBy: s.member.id })
      return json(res, 200, { id: l.id, link: `/join/${l.token}`, expires: l.expires })
    }
    if (what === 'device-link' && req.method === 'POST') {
      const l = families.makeLink({ kind: 'device', familyId: fam, memberId: s.member.id, madeBy: s.member.id })
      return json(res, 200, { link: `/join/${l.token}`, expires: l.expires })
    }
    if (what === 'device' && req.method === 'PUT' && !id) {
      families.relabelDevice(fam, s.device.id, (await readJson(req)).label)
      return json(res, 204)
    }
    if (what === 'invite' && req.method === 'DELETE' && id) {
      if (!parent) return json(res, 403)
      return json(res, families.cancelLink(fam, id) ? 204 : 404)
    }
    if (what === 'member' && req.method === 'DELETE' && id) {
      if (!parent) return json(res, 403)
      return json(res, families.removeMember(fam, id) ? 204 : 404)
    }
    if (what === 'device' && req.method === 'DELETE' && id) {
      if (!parent && id !== s.device.id) return json(res, 403)
      return json(res, families.removeDevice(fam, id) ? 204 : 404)
    }
    return json(res, 405)
  } catch (e) {
    return json(res, e.status ?? 400)
  }
}

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
/** A small page outside the game (sign-in, joining, starting a family), in the game's colors. */
const PAGE = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<meta name="apple-mobile-web-app-capable" content="yes"><title>${esc(title)}</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:linear-gradient(#ffe0f0,#ffc0dc);color:#3b2a4a}
form,.card{background:#fff;padding:32px 28px;border-radius:28px;box-shadow:0 10px 0 rgba(0,0,0,.08);width:min(380px,90vw);box-sizing:border-box;text-align:center}
h1{margin:0 0 6px;color:#e2468f;font-size:30px}p{margin:0 0 18px;color:#6a5a7a;line-height:1.45}
label{display:block;text-align:left;font-weight:700;margin:0 0 6px}
input{width:100%;box-sizing:border-box;font-size:20px;padding:14px;border-radius:14px;border:2px solid #f0c4da;margin-bottom:14px}
button{width:100%;font-size:22px;font-weight:700;padding:14px;border:0;border-radius:14px;background:#ff6fae;color:#fff;cursor:pointer}
.err{color:#b42318;margin-bottom:12px}.small{font-size:14px;color:#8a7a99;margin:16px 0 0}
</style></head><body>${body}</body></html>`
const sendPage = (res, status, title, body) => {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(PAGE(title, body))
}
const DEAD_LINK = `<div class="card"><h1>🌈 Ark Pals</h1><p>This link has already been used, or it has expired.</p><p>Ask whoever sent it for a new one. Each link works once, on one device.</p></div>`

/** GET/POST /join/<token>: a grown-up's invitation, or signing in another device. */
async function handleJoin(req, res, url, ip) {
  const token = url.pathname.slice('/join/'.length)
  if (limited(ip)) return sendPage(res, 429, 'Ark Pals', `<div class="card"><h1>🌈 Ark Pals</h1><p>Too many tries. Please wait 15 minutes.</p></div>`)
  const link = families.peekLink(token)
  if (!link || link.kind === 'family') {
    fail(ip)
    return sendPage(res, 404, 'Ark Pals', DEAD_LINK)
  }
  const was = currentSession(req)
  if (req.method === 'POST') {
    const dev = families.useLink(token, { label: was?.device.label ?? deviceLabel(req) })
    if (!dev) return sendPage(res, 404, 'Ark Pals', DEAD_LINK)
    if (was) families.removeDevice(was.family.id, was.device.id) // (this device was someone else: it's this one now)
    res.writeHead(303, { 'Set-Cookie': [deviceCookie(req, dev), clearOldCookie], Location: '/' })
    return res.end()
  }
  const who = link.kind === 'member' ? link.name : link.member.name
  const lead = link.kind === 'member'
    ? `<p>You're invited to join <b>${esc(link.family.name)}</b> on Ark Pals, as <b>${esc(who)}</b>.</p>`
    : `<p>Sign this ${esc(deviceLabel(req))} in to <b>${esc(link.family.name)}</b>, as <b>${esc(who)}</b>.</p>`
  const switching = was && (link.kind === 'member' || was.member.id !== link.member.id)
    ? `<p class="err">This device is signed in as <b>${esc(was.member.name)}</b> now. If it isn't ${esc(who)}'s device, don't tap the button: send ${esc(who)} the link instead.</p>`
    : ''
  return sendPage(res, 200, 'Join Ark Pals', `<form method="post"><h1>🌈 Ark Pals</h1>${lead}${switching}
<button>${link.kind === 'member' ? 'Join on this device' : 'Sign in this device'}</button>
<p class="small">The link works once. After that, this device stays signed in.</p></form>`)
}

/** GET/POST /start/<token>: a new family, from a link the site owner made. */
async function handleStart(req, res, url, ip) {
  const token = url.pathname.slice('/start/'.length)
  if (limited(ip)) return sendPage(res, 429, 'Ark Pals', `<div class="card"><h1>🌈 Ark Pals</h1><p>Too many tries. Please wait 15 minutes.</p></div>`)
  const link = families.peekLink(token)
  if (!link || link.kind !== 'family') {
    fail(ip)
    return sendPage(res, 404, 'Ark Pals', DEAD_LINK)
  }
  const form = (msg = '', family = '', you = '') => `<form method="post"><h1>🌈 Ark Pals</h1>
<p>Welcome! Start your family's Ark. You can invite more grown-ups, like grandparents, once you're in.</p>
${msg ? `<div class="err">${esc(msg)}</div>` : ''}
<label for="family">Your family's name</label><input id="family" name="family" maxlength="40" placeholder="The Smith family" value="${esc(family)}" required autofocus>
<label for="you">Your name (what the family calls you)</label><input id="you" name="you" maxlength="40" placeholder="Mom" value="${esc(you)}" required>
<button>Start our family</button></form>`
  if (req.method === 'POST') {
    const f = new URLSearchParams((await readBody(req, 2000)).toString('utf8'))
    try {
      const was = currentSession(req)
      const dev = families.useLink(token, { label: was?.device.label ?? deviceLabel(req), familyName: f.get('family'), yourName: f.get('you') })
      if (!dev) return sendPage(res, 404, 'Ark Pals', DEAD_LINK)
      if (was) families.removeDevice(was.family.id, was.device.id)
      res.writeHead(303, { 'Set-Cookie': [deviceCookie(req, dev), clearOldCookie], Location: '/' })
      return res.end()
    } catch {
      return sendPage(res, 400, 'Start your family', form('Please give both names (up to 40 letters each).', f.get('family') ?? '', f.get('you') ?? ''))
    }
  }
  return sendPage(res, 200, 'Start your family', form())
}

// ---- static files ----
async function serveFile(res, path) {
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '')
  let file = join(ROOT, safe)
  if (!file.startsWith(ROOT)) file = join(ROOT, 'index.html')
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
  } catch {
    file = join(ROOT, 'index.html') // single-page app fallback
  }
  const body = await readFile(file)
  const ext = extname(file)
  // Built files and sing-along songs have a content hash in their names, so they never change.
  const immutable = file.includes(`${join(ROOT, 'assets')}`) || file.includes(`${join(ROOT, 'music')}`)
  res.writeHead(200, {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  res.end(body)
}

const SECURITY_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; media-src 'self' blob:; frame-ancestors 'none'; form-action 'self'",
}

createServer(async (req, res) => {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v)
  const url = new URL(req.url ?? '/', 'http://x')
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ?? req.socket.remoteAddress ?? ''

  try {
    if (url.pathname === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      return res.end('User-agent: *\nDisallow: /\n')
    }
    if (url.pathname === '/login' && req.method === 'POST') {
      if (limited(ip)) {
        res.writeHead(429, { 'Content-Type': 'text/html; charset=utf-8' })
        return res.end(LOGIN_PAGE('Too many tries. Please wait 15 minutes.'))
      }
      let body = ''
      for await (const chunk of req) {
        body += chunk
        if (body.length > 2000) break
      }
      const pw = new URLSearchParams(body).get('password') ?? ''
      if (pw && checkPassword(pw)) {
        failures.delete(ip)
        // (the family password signs a device in as the first family's parents)
        res.writeHead(303, { 'Set-Cookie': [deviceCookie(req, families.passwordDevice(deviceLabel(req))), clearOldCookie], Location: '/' })
        return res.end()
      }
      fail(ip)
      res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(LOGIN_PAGE('That password didn’t work.'))
    }
    // A pasted link: go to its page (/join/… or /start/…), just as opening it would.
    if (url.pathname === '/login/link' && req.method === 'POST') {
      const pasted = new URLSearchParams((await readBody(req, 2000)).toString('utf8')).get('link') ?? ''
      const m = /(?:^|\/)(join|start)\/([A-Za-z0-9_-]{20,64})(?![A-Za-z0-9_-])/.exec(pasted) ?? /^\s*()([A-Za-z0-9_-]{20,64})\s*$/.exec(pasted)
      res.writeHead(303, { Location: m ? `/${m[1] || 'join'}/${m[2]}` : '/' })
      return res.end()
    }
    if (url.pathname.startsWith('/join/')) return await handleJoin(req, res, url, ip)
    if (url.pathname.startsWith('/start/')) return await handleStart(req, res, url, ip)
    // Browsers fetch the app manifest and icons without cookies, so these stay public (they contain nothing private).
    const isPublic = ['/manifest.webmanifest', '/icon.svg', '/apple-touch-icon.png'].includes(url.pathname)
    const s = isPublic ? null : sessionOf(req, res)
    if (!isPublic && !s) {
      // Pages get the sign-in form; everything else is simply refused.
      const wantsPage = (req.headers.accept ?? '').includes('text/html')
      res.writeHead(wantsPage ? 200 : 401, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
      return res.end(wantsPage ? LOGIN_PAGE() : '')
    }
    if (url.pathname === '/family' || url.pathname.startsWith('/family/')) return await handleFamily(req, res, url, s)
    const mine = s ? storesFor(s.family.id) : null
    if ((url.pathname === '/backup' && (req.method === 'POST' || req.method === 'GET')) || (url.pathname === '/backups' && req.method === 'GET')) return await handleBackup(req, res, url, mine)
    if (url.pathname === '/recordings' || url.pathname.startsWith('/recording/')) return await handleRecording(req, res, url, mine)
    if (url.pathname === '/songs' || url.pathname.startsWith('/songs/')) return await handleSongs(req, res, url, mine)
    if (url.pathname === '/stats' && req.method === 'GET' && s.family.id !== families.firstFamily()) return json(res, 403)
    if (url.pathname === '/stats' && (req.method === 'POST' || req.method === 'GET')) return await handleStats(req, res)
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405)
      return res.end()
    }
    if (url.pathname === '/tts') return await serveTts(res, url)
    await serveFile(res, decodeURIComponent(url.pathname))
  } catch (e) {
    console.error(e)
    res.writeHead(500)
    res.end()
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Ark Pals listening on 127.0.0.1:${PORT}`))
