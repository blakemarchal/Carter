// Creates or updates everything billing needs in Stripe, so it's safe to run again (after a price change,
// say). Run on the server, after npm run set-stripe-key:
//   cd /opt/Carter && npm run stripe-setup
//   cd /opt/Carter && npm run stripe-setup -- --new-webhook-secret   (makes the webhook again, with a new secret)
// It makes, each found again by its id or lookup_key:
//   - the products "Ark Pals Family" ($9.99/mo and $79/yr), "Ark Pals Grace" ($4.99/mo) and "Sponsor a Family"
//     ($9.99/mo); prices are tax-exclusive, and the products get STRIPE_TAX_CODE (from .env) if it's set
//   - the billing page's settings (cancel, change card or plan, receipts): saved to .env as STRIPE_PORTAL_CONFIG
//   - the webhook endpoint https://spiritflow.church/stripe/webhook (SITE_URL, if set): its signing secret is
//     saved to .env as STRIPE_WEBHOOK_SECRET, and never shown
import { fileURLToPath } from 'node:url'
import { readEnv, writeEnv } from './env.mjs'
import { API_VERSION, PLANS, PRODUCTS, WEBHOOK_EVENTS, stripeFromEnv } from './billing.mjs'

const missing = (e) => e?.code === 'resource_missing' || e?.statusCode === 404

/**
 * Brings Stripe up to date. Returns { webhookSecret (only when the endpoint was made now), portalConfig,
 * lines (what was done, for the screen) }.
 */
export async function setupStripe(stripe, { siteUrl = 'https://spiritflow.church', taxCode = '', portalConfig = '', haveWebhookSecret = false, newWebhookSecret = false } = {}) {
  const lines = []
  const say = (s) => lines.push(s)
  if (taxCode && !/^txcd_\d{8}$/.test(taxCode)) throw new Error(`STRIPE_TAX_CODE should look like txcd_12345678 (got "${taxCode}").`)

  // Products, by their own ids.
  for (const p of Object.values(PRODUCTS)) {
    const fields = { name: p.name, description: p.description, ...(taxCode ? { tax_code: taxCode } : {}) }
    try {
      await stripe.products.retrieve(p.id)
      await stripe.products.update(p.id, { ...fields, active: true })
      say(`Product "${p.name}": up to date`)
    } catch (e) {
      if (!missing(e)) throw e
      await stripe.products.create({ id: p.id, ...fields })
      say(`Product "${p.name}": made`)
    }
  }

  // Prices, by lookup_key. A price can't change its amount, so a different one is made and takes the key.
  const found = await stripe.prices.list({ lookup_keys: Object.values(PLANS).map((p) => p.lookup), limit: 10 })
  const byLookup = Object.fromEntries(found.data.map((p) => [p.lookup_key, p]))
  const priceIds = {}
  for (const [plan, p] of Object.entries(PLANS)) {
    const product = PRODUCTS[p.product].id
    const old = byLookup[p.lookup]
    const same = old && old.active && (old.product?.id ?? old.product) === product && old.unit_amount === p.amount
      && old.currency === 'usd' && old.recurring?.interval === p.interval && old.tax_behavior === 'exclusive'
    if (same) {
      priceIds[plan] = old.id
      say(`Price ${p.lookup} ($${(p.amount / 100).toFixed(2)}/${p.interval}): up to date`)
      continue
    }
    const made = await stripe.prices.create({
      product, currency: 'usd', unit_amount: p.amount, recurring: { interval: p.interval }, tax_behavior: 'exclusive',
      lookup_key: p.lookup, transfer_lookup_key: true, nickname: p.label,
    })
    if (old?.active) await stripe.prices.update(old.id, { active: false }) // (plans already on it carry on)
    priceIds[plan] = made.id
    say(`Price ${p.lookup} ($${(p.amount / 100).toFixed(2)}/${p.interval}): ${old ? 'replaced' : 'made'}`)
  }

  // (Grace codes need nothing here: they're kept by the server, and a Grace plan is a free trial on the Family
  // monthly price. The 6- and 12-month coupons an earlier version made aren't used any more.)

  // The billing page (Customer Portal).
  const portal = {
    business_profile: { headline: 'Ark Pals: your family’s plan' },
    default_return_url: siteUrl,
    features: {
      customer_update: { enabled: true, allowed_updates: ['email', 'address'] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true, mode: 'at_period_end' },
      subscription_update: {
        enabled: true, default_allowed_updates: ['price'], proration_behavior: 'create_prorations',
        products: [
          { product: PRODUCTS.family.id, prices: [priceIds['family-yearly'], priceIds['family-monthly']] },
          { product: PRODUCTS.grace.id, prices: [priceIds['grace-monthly']] },
        ],
      },
    },
    metadata: { arkpals: 'portal' },
  }
  let config = null
  if (portalConfig) {
    try {
      config = await stripe.billingPortal.configurations.update(portalConfig, portal)
      say('Billing page settings: up to date')
    } catch (e) {
      if (!missing(e)) throw e
    }
  }
  if (!config) {
    config = await stripe.billingPortal.configurations.create(portal)
    say('Billing page settings: made')
  }

  // The webhook endpoint. Stripe shows its secret only when it's made, so without one saved it's made again.
  const url = `${siteUrl.replace(/\/$/, '')}/stripe/webhook`
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 })
  const had = endpoints.data.find((w) => w.url === url)
  let webhookSecret = null
  if (had && haveWebhookSecret && !newWebhookSecret) {
    await stripe.webhookEndpoints.update(had.id, { enabled_events: WEBHOOK_EVENTS, disabled: false })
    say(`Webhook ${url}: up to date`)
  } else {
    if (had) await stripe.webhookEndpoints.del(had.id)
    const made = await stripe.webhookEndpoints.create({ url, enabled_events: WEBHOOK_EVENTS, api_version: API_VERSION, description: 'Ark Pals billing' })
    webhookSecret = made.secret
    say(`Webhook ${url}: ${had ? 'made again, with a new secret' : 'made'}`)
  }
  return { webhookSecret, portalConfig: config.id, lines }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const env = readEnv()
    if (!env.STRIPE_KEY) throw new Error('No Stripe key saved yet. Run: npm run set-stripe-key')
    const stripe = await stripeFromEnv(env)
    if (!stripe) throw new Error('The stripe package is missing. Run: cd /opt/Carter && npm install --omit=dev')
    const r = await setupStripe(stripe, {
      siteUrl: env.SITE_URL || 'https://spiritflow.church', taxCode: env.STRIPE_TAX_CODE ?? '', portalConfig: env.STRIPE_PORTAL_CONFIG ?? '',
      haveWebhookSecret: !!env.STRIPE_WEBHOOK_SECRET, newWebhookSecret: process.argv.includes('--new-webhook-secret'),
    })
    for (const l of r.lines) console.log(l)
    env.STRIPE_PORTAL_CONFIG = r.portalConfig
    if (r.webhookSecret) env.STRIPE_WEBHOOK_SECRET = r.webhookSecret
    writeEnv(env)
    console.log(`Saved to .env: STRIPE_PORTAL_CONFIG${r.webhookSecret ? ' and STRIPE_WEBHOOK_SECRET (not shown)' : ''}.`)
    if (!env.STRIPE_TAX_CODE) console.log('No STRIPE_TAX_CODE in .env: the products use the account’s default tax code.')
    console.log('Restart the app to use it:  systemctl restart carter-web')
  } catch (e) {
    console.error(String(e.message).replace(/\b(rk|sk|whsec)_\w+/g, '[secret]'))
    process.exit(1)
  }
}
