// Helpers for the setup scripts: read/write /opt/Carter/.env and ask questions without echoing.
import { existsSync, readFileSync, writeFileSync, chmodSync } from 'node:fs'
import { createInterface } from 'node:readline'

export function readEnv() {
  const lines = existsSync('.env') ? readFileSync('.env', 'utf8').split('\n').filter(Boolean) : []
  return Object.fromEntries(lines.map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]))
}

/** Writes .env readable by root only. */
export function writeEnv(env) {
  writeFileSync('.env', Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n')
  chmodSync('.env', 0o600)
}

/** Asks a question; what is typed is not shown on screen. */
export function ask(q) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    rl._writeToOutput = (s) => { if (s.includes(q)) rl.output.write(s) } // hide typing
    rl.question(q, (a) => { rl.close(); process.stdout.write('\n'); resolve(a) })
  })
}
