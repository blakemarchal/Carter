// Sets up email (sign-in links and invitations, sent through Resend). Run on the server:
//   cd /opt/Carter && npm run set-email-key            paste a Resend API key, set who emails are from, send a test
//   cd /opt/Carter && npm run set-email-key -- --check  send a test email with the saved settings
//   cd /opt/Carter && npm run set-email-key -- --remove stop sending email (links are shared by hand again)
// First verify the sending domain in Resend (Domains), then make a key with sending access (API Keys).
// The key is stored only in .env (root-only), and never shown.
import { ask, readEnv, writeEnv } from './env.mjs'
import { createMailer } from './email.mjs'
import { createInterface } from 'node:readline'

const env = readEnv()
const askShown = (q) => new Promise((resolve) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  rl.question(q, (a) => { rl.close(); resolve(a.trim()) })
})

async function test(key, from) {
  const to = await askShown('Send a test email to (your address, or Enter to skip): ')
  if (!to) return
  await createMailer({ apiKey: key, from }).send({
    to, subject: 'Ark Pals email works', text: 'Sign-in links and invitations can be sent by email now.',
    html: '<p style="font-family:system-ui,sans-serif;font-size:17px">🌈 Sign-in links and invitations can be sent by email now.</p>',
  })
  console.log(`Sent. Check ${to} (and its spam folder).`)
}

try {
  if (process.argv.includes('--remove')) {
    delete env.RESEND_API_KEY
    writeEnv(env)
    console.log('Removed. Restart the app to stop sending email:  systemctl restart carter-web')
  } else if (process.argv.includes('--check')) {
    if (!env.RESEND_API_KEY || !env.EMAIL_FROM) throw new Error('No email settings saved yet. Run: npm run set-email-key')
    await test(env.RESEND_API_KEY, env.EMAIL_FROM)
  } else {
    const key = (await ask('Resend API key: ')).trim()
    if (!key) throw new Error('No key entered. Nothing changed.')
    const from = (await askShown(`Emails come from [${env.EMAIL_FROM ?? 'Ark Pals <hello@spiritflow.church>'}]: `)) || env.EMAIL_FROM || 'Ark Pals <hello@spiritflow.church>'
    await test(key, from)
    env.RESEND_API_KEY = key
    env.EMAIL_FROM = from
    writeEnv(env)
    console.log('Saved. Restart the app to use it:  systemctl restart carter-web')
  }
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
