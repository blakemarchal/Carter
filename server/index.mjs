// Carter's Ark server: serves the built game (dist/) behind a family password.
// No dependencies. Configured by environment (systemd EnvironmentFile=/opt/Carter/.env):
//   PORT                   default 3004
//   CARTER_PASSWORD_HASH   scrypt hash written by `npm run set-password`
//   CARTER_SESSION_SECRET  random secret for signing the login cookie
//   XAI_API_KEY            optional: enables Grok's "Ara" narration voice (npm run set-voice-key)
//   TTS_DAILY_CHARS        optional: cap on new narration generated per day (default 200000, about $3)
//   CACHE_DIRECTORY        set by systemd (CacheDirectory=carter); where narration clips are kept
import { createServer } from 'node:http'
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createTtsCache, MAX_CHARS, SPEEDS, VOICES } from './tts.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORT = Number(process.env.PORT ?? 3004)
const HASH = process.env.CARTER_PASSWORD_HASH ?? ''
const SECRET = process.env.CARTER_SESSION_SECRET ?? ''
const COOKIE = 'carter_session'
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
function makeToken() {
  const exp = String(Math.floor(Date.now() / 1000) + YEAR)
  return `${exp}.${sign(exp)}`
}
function validToken(tok) {
  const [exp, mac] = (tok ?? '').split('.')
  if (!exp || !mac) return false
  const a = Buffer.from(mac), b = Buffer.from(sign(exp))
  return a.length === b.length && timingSafeEqual(a, b) && Number(exp) > Date.now() / 1000
}
function cookies(req) {
  return Object.fromEntries((req.headers.cookie ?? '').split(';').map((c) => c.trim().split('=')).filter((p) => p.length === 2))
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
<meta name="apple-mobile-web-app-capable" content="yes"><title>Carter's Ark</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:linear-gradient(#ffe0f0,#ffc0dc);color:#3b2a4a}
form{background:#fff;padding:32px 28px;border-radius:28px;box-shadow:0 10px 0 rgba(0,0,0,.08);width:min(360px,90vw);text-align:center}
h1{margin:0 0 6px;color:#e2468f;font-size:30px}p{margin:0 0 18px;color:#8a7a99}
input{width:100%;box-sizing:border-box;font-size:20px;padding:14px;border-radius:14px;border:2px solid #f0c4da;margin-bottom:14px}
button{width:100%;font-size:22px;font-weight:700;padding:14px;border:0;border-radius:14px;background:#ff6fae;color:#fff}
.err{color:#b42318;margin-bottom:12px}
</style></head><body><form method="post" action="/login">
<h1>🌈 Carter's Ark</h1><p>Grown-ups only: family password</p>
${msg ? `<div class="err">${msg}</div>` : ''}
<input type="password" name="password" autocomplete="current-password" autofocus required>
<button>Open the Ark</button></form></body></html>`

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
  const immutable = file.includes(`${join(ROOT, 'assets')}`)
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
        res.writeHead(303, {
          'Set-Cookie': `${COOKIE}=${makeToken()}; Max-Age=${YEAR}; Path=/; HttpOnly; Secure; SameSite=Lax`,
          Location: '/',
        })
        return res.end()
      }
      fail(ip)
      res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(LOGIN_PAGE('That password didn’t work.'))
    }
    // Browsers fetch the app manifest and icon without cookies, so these two stay public (they contain nothing private).
    const isPublic = url.pathname === '/manifest.webmanifest' || url.pathname === '/icon.svg'
    if (!isPublic && !validToken(cookies(req)[COOKIE])) {
      // Pages get the login form; everything else is simply refused.
      const wantsPage = (req.headers.accept ?? '').includes('text/html')
      res.writeHead(wantsPage ? 200 : 401, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
      return res.end(wantsPage ? LOGIN_PAGE() : '')
    }
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
}).listen(PORT, '127.0.0.1', () => console.log(`Carter's Ark listening on 127.0.0.1:${PORT}`))
