// Saves the ElevenLabs API key for the music scripts, from the clipboard, so it's never typed in a terminal or
// shown anywhere. It's kept in %LOCALAPPDATA%\ArkPals\elevenlabs.key (outside the repo) and checked with
// ElevenLabs before it's saved.
//   node scripts/music/key.mjs            copy the key first, then run this
//   node scripts/music/key.mjs --check    checks the saved key and shows the plan
//   node scripts/music/key.mjs --remove
import { chmodSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { APP_DIR, KEY_FILE, eleven, readKey } from './lib.mjs'

function clipboard() {
  const text = process.platform === 'win32'
    ? execFileSync('powershell', ['-NoProfile', '-Command', 'Get-Clipboard'], { encoding: 'utf8' })
    : execFileSync(process.platform === 'darwin' ? 'pbpaste' : 'xclip', process.platform === 'darwin' ? [] : ['-o'], { encoding: 'utf8' })
  return text.replace(/^﻿/, '').trim()
}

/** Asks ElevenLabs who the key belongs to; says the plan, never the key. */
async function check(key) {
  const r = await eleven('/v1/user/subscription', { key })
  const s = await r.json()
  console.log(`The key works. Plan: ${s.tier ?? '?'}; ${s.character_count ?? '?'} of ${s.character_limit ?? '?'} characters used this cycle.`)
}

try {
  if (process.argv.includes('--remove')) {
    rmSync(KEY_FILE, { force: true })
    console.log('Removed.')
  } else if (process.argv.includes('--check')) {
    await check(readKey())
  } else {
    const key = clipboard()
    if (!key || key.length < 20 || /\s/.test(key)) throw new Error('The clipboard doesn\'t hold a key. In ElevenLabs: profile → API keys → Create, copy it, then run this again.')
    await check(key)
    mkdirSync(APP_DIR, { recursive: true })
    writeFileSync(KEY_FILE, key + '\n')
    try { chmodSync(KEY_FILE, 0o600) } catch { /* Windows */ }
    console.log(`Saved to ${KEY_FILE}. You can copy something else now.`)
  }
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
