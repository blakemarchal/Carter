// Sets the family password. Run on the server:  cd /opt/Carter && npm run set-password
// Writes CARTER_PASSWORD_HASH (and a session secret, if missing) to .env. The password itself is never stored.
import { randomBytes, randomInt, scryptSync } from 'node:crypto'
import { ask, readEnv, writeEnv } from './env.mjs'

// --generate: make a friendly random password and print it once. Use this when no
// interactive terminal is available (e.g. when Claude Code runs the command for you).
const WORDS = ['pink', 'rainbow', 'ark', 'dove', 'lamb', 'star', 'olive', 'cloud', 'sunny', 'zippy', 'ember', 'pebble', 'boat', 'lion', 'whale', 'sparkle']
let pw
if (process.argv.includes('--generate')) {
  const w = () => WORDS[randomInt(WORDS.length)]
  pw = `${w()}-${w()}-${w()}-${randomInt(1000, 10000)}`
} else {
  pw = await ask('New family password: ')
  const again = await ask('Type it again: ')
  if (pw !== again) { console.error('Passwords did not match. Nothing changed.'); process.exit(1) }
  if (pw.length < 8) { console.error('Use at least 8 characters. Nothing changed.'); process.exit(1) }
}

const salt = randomBytes(16).toString('hex')
const hash = `${salt}:${scryptSync(pw, salt, 32).toString('hex')}`
const env = readEnv()
env.CARTER_PASSWORD_HASH = hash
env.CARTER_SESSION_SECRET ??= randomBytes(32).toString('hex')
env.PORT ??= '3004'
writeEnv(env)
if (process.argv.includes('--generate')) console.log(`Family password: ${pw}\n(Write it down. It is not stored anywhere in readable form.)`)
console.log('Saved. Restart the app to use it:  systemctl restart carter-web')
console.log('Tip: to sign every device out, delete the CARTER_SESSION_SECRET line and run this again.')
