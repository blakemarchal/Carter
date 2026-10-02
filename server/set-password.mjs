// Sets the family password. Run on the server:  cd /opt/Carter && npm run set-password
// Writes CARTER_PASSWORD_HASH (and a session secret, if missing) to .env. The password itself is never stored.
import { randomBytes, scryptSync } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync, chmodSync } from 'node:fs'
import { createInterface } from 'node:readline'

function ask(q) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    rl._writeToOutput = (s) => { if (s.includes(q)) rl.output.write(s) } // hide typing
    rl.question(q, (a) => { rl.close(); process.stdout.write('\n'); resolve(a) })
  })
}

const pw = await ask('New family password: ')
const again = await ask('Type it again: ')
if (pw !== again) { console.error('Passwords did not match. Nothing changed.'); process.exit(1) }
if (pw.length < 8) { console.error('Use at least 8 characters. Nothing changed.'); process.exit(1) }

const salt = randomBytes(16).toString('hex')
const hash = `${salt}:${scryptSync(pw, salt, 32).toString('hex')}`
const lines = existsSync('.env') ? readFileSync('.env', 'utf8').split('\n').filter(Boolean) : []
const env = Object.fromEntries(lines.map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]))
env.CARTER_PASSWORD_HASH = hash
env.CARTER_SESSION_SECRET ??= randomBytes(32).toString('hex')
env.PORT ??= '3004'
writeFileSync('.env', Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n')
chmodSync('.env', 0o600)
console.log('Saved. Restart the app to use it:  systemctl restart carter-web')
console.log('Tip: to sign every device out, delete the CARTER_SESSION_SECRET line and run this again.')
