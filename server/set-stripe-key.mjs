// Connects billing to Stripe (server/billing.mjs). Run on the server:
//   cd /opt/Carter && npm run set-stripe-key            paste a restricted key (rk_…), it's checked, then saved
//   Get-Clipboard | ssh root@… "cd /opt/Carter && npm run -s set-stripe-key"   the same, from the clipboard
//   cd /opt/Carter && npm run set-stripe-key -- --check check the saved key still works
//   cd /opt/Carter && npm run set-stripe-key -- --remove turn billing off (the key is deleted from .env)
// Make the key in Stripe, in the "Ark Pals sandbox": Developers → API keys → Create restricted key, with the
// permissions deploy/DEPLOY.md lists. Then run `npm run stripe-setup` to create the products and webhook.
// The key is stored only in .env (root-only), and never shown.
import { ask, readEnv, writeEnv } from './env.mjs'
import { stripeFromEnv } from './billing.mjs'

const env = readEnv()

/** Everything piped to this script, when it isn't run at a keyboard. */
async function readStdin() {
  let text = ''
  for await (const chunk of process.stdin) text += chunk
  return text.replace(/^﻿/, '')
}

/** Asks Stripe something small that the key must be allowed to do. Never prints the key. */
async function check(key) {
  const stripe = await stripeFromEnv({ STRIPE_KEY: key })
  if (!stripe) throw new Error('The stripe package is missing. Run: cd /opt/Carter && npm install --omit=dev')
  try {
    await stripe.products.list({ limit: 1 })
  } catch (e) {
    throw new Error(`Stripe didn't accept that key (${e.type ?? 'error'}: ${String(e.message).replace(/\b[rs]k_\w+/g, '[key]')}). Nothing changed.`)
  }
}

try {
  if (process.argv.includes('--remove')) {
    delete env.STRIPE_KEY
    writeEnv(env)
    console.log('Removed. Restart the app to turn billing off:  systemctl restart carter-web')
  } else if (process.argv.includes('--check')) {
    if (!env.STRIPE_KEY) throw new Error('No Stripe key saved yet. Run: npm run set-stripe-key')
    await check(env.STRIPE_KEY)
    console.log(`The saved key works (${env.STRIPE_KEY.startsWith('rk_test_') ? 'test mode / sandbox' : 'LIVE'}).`)
  } else {
    // Piped in (e.g. from the clipboard, `Get-Clipboard | ssh … npm run -s set-stripe-key`): read it all, no prompt.
    const key = (process.stdin.isTTY ? await ask('Stripe restricted key (rk_…): ') : await readStdin()).trim()
    if (!key) throw new Error('No key entered. Nothing changed.')
    if (!key.startsWith('rk_')) throw new Error('That isn’t a restricted key (they start with rk_). Make one in Stripe: Developers → API keys → Create restricted key. Nothing changed.')
    if (!key.startsWith('rk_test_') && !process.argv.includes('--live')) {
      throw new Error('That is a live key. Billing is still in test mode: use a key from the "Ark Pals sandbox" (rk_test_…). Nothing changed.')
    }
    await check(key)
    env.STRIPE_KEY = key
    writeEnv(env)
    console.log('Saved. Next: npm run stripe-setup   (then systemctl restart carter-web)')
  }
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
