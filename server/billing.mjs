// Billing (docs/BUSINESS-PLAN.md §1 and §4): the family is what pays. Stripe Checkout starts a plan,
// Stripe's billing page (the Customer Portal) changes or cancels it, and Stripe's webhooks tell us what
// happened. Each family keeps its plan, status and paid-through date here, next to the families
// (server/families.mjs), and its Stripe Customer ID: every webhook is matched to a family by that ID.
//
// Nothing about children goes to Stripe or into anything here: only the family's id (in the Customer's
// metadata, for Blake to find it in the dashboard) and the email of the grown-up who starts the plan.
//
// Access: the first family (the site's own) and any family the owner marks as comped is always free.
// Others need a plan that's active, in its trial, or past due (Stripe is retrying the card). Nothing is
// blocked at all unless BILLING_ENFORCED is on; the game asks GET /billing when it's online, and allows 7
// days offline after its last good answer (src/lib/billing.ts).
//
// Settings (from /opt/Carter/.env, all optional; without STRIPE_KEY billing is simply off):
//   STRIPE_KEY             a restricted key (rk_…) from the "Ark Pals sandbox" (npm run set-stripe-key)
//   STRIPE_WEBHOOK_SECRET  the webhook endpoint's signing secret (written by npm run stripe-setup)
//   STRIPE_PORTAL_CONFIG   the billing page's configuration (written by npm run stripe-setup)
//   BILLING_ENFORCED       1 to start blocking families without a plan (off until Blake decides)
//   STRIPE_TAX             1 to have Stripe Tax add sales tax at checkout (off until Blake decides)
//   STRIPE_TAX_CODE        the products' tax code (txcd_…), used by npm run stripe-setup
import { randomBytes, randomInt } from 'node:crypto'

/** The Stripe API version this code is written for (the SDK's own, pinned). */
export const API_VERSION = '2026-08-26.dahlia'
/** How long the game keeps playing offline after its last good access check. */
export const OFFLINE_DAYS = 7
/** Days of free trial on a new family plan (once per family). */
export const TRIAL_DAYS = 7
/** Statuses of a Stripe subscription that give access. */
const PAID = new Set(['active', 'trialing', 'past_due'])

/** Products (custom ids, so stripe-setup can find them again). */
export const PRODUCTS = {
  family: { id: 'arkpals_family', name: 'Ark Pals Family', description: 'Ark Pals for the whole family: every island, every Pal, up to 4 players.' },
  grace: { id: 'arkpals_grace', name: 'Ark Pals Grace', description: 'Ark Pals for the whole family, at a price that helps right now.' },
  sponsor: { id: 'arkpals_sponsor', name: 'Sponsor a Family', description: 'Each month, one free Grace code for a family who needs it.' },
}
/** The prices, by the plan names the app uses. `lookup` is the price's lookup_key in Stripe. Yearly first. */
export const PLANS = {
  'family-yearly': { lookup: 'arkpals_family_yearly', product: 'family', amount: 7900, interval: 'year', label: 'Family, yearly' },
  'family-monthly': { lookup: 'arkpals_family_monthly', product: 'family', amount: 999, interval: 'month', label: 'Family, monthly' },
  'grace-monthly': { lookup: 'arkpals_grace_monthly', product: 'grace', amount: 499, interval: 'month', label: 'Grace price' },
  'sponsor-monthly': { lookup: 'arkpals_sponsor_monthly', product: 'sponsor', amount: 999, interval: 'month', label: 'Sponsor a Family' },
}
const PLAN_BY_LOOKUP = Object.fromEntries(Object.entries(PLANS).map(([k, v]) => [v.lookup, k]))
/** The 100%-off coupons behind Grace codes (custom ids), for the Family product only. */
export const COUPONS = {
  6: { id: 'arkpals_grace_6mo', name: 'Grace code: 6 months free', months: 6 },
  12: { id: 'arkpals_grace_12mo', name: 'Grace code: 12 months free', months: 12 },
}
/** Each paid Sponsor a Family invoice adds one Grace code of this many months to the owner's pool. */
export const SPONSOR_CODE_MONTHS = 6
export const WEBHOOK_EVENTS = [
  'checkout.session.completed', 'checkout.session.async_payment_succeeded',
  'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted',
  'invoice.paid', 'invoice.payment_failed',
]
const KEEP_EVENTS_DAYS = 60
const DAY = 24 * 3600_000
const err = (status, message = 'billing') => Object.assign(new Error(message), { status })
const idOf = (v) => (v && typeof v === 'object' ? v.id : v) ?? null

/** Whether a setting like BILLING_ENFORCED is on. */
export const isOn = (v) => /^(1|true|yes|on)$/i.test(String(v ?? '').trim())

/** The one Stripe client (no global key), or null when there's no key or the stripe package isn't installed. */
export async function stripeFromEnv(env = process.env) {
  if (!env.STRIPE_KEY) return null
  try {
    const { default: Stripe } = await import('stripe')
    return new Stripe(env.STRIPE_KEY, { apiVersion: API_VERSION, appInfo: { name: 'Ark Pals' }, maxNetworkRetries: 2 })
  } catch (e) {
    console.error(`Billing is off: the stripe package isn't installed (cd /opt/Carter && npm install --omit=dev). ${e.message}`)
    return null
  }
}

/** A Grace code people can read and type: no 0/O, 1/I/L. */
export function graceCode(months) {
  const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const part = () => Array.from({ length: 4 }, () => abc[randomInt(abc.length)]).join('')
  return `GRACE${months}-${part()}-${part()}`
}

/** `integration_identifier` for a Checkout Session: "arkpals-checkout-" and 8 random letters. */
export function integrationId() {
  return `arkpals-checkout-${Array.from({ length: 8 }, () => 'abcdefghijklmnopqrstuvwxyz'[randomInt(26)]).join('')}`
}

/**
 * Billing for the families in `families` (its SQLite `db`). `stripe` is the Stripe client (or a fake one
 * in tests; null when billing isn't set up). `webhooks` verifies signatures (the SDK's stripe.webhooks).
 */
export function createBilling({ db, families, stripe = null, webhooks = stripe?.webhooks ?? null, webhookSecret = '', enforced = false, tax = false, portalConfig = '', clock = () => Date.now(), log = console } = {}) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS billing (
      family_id TEXT PRIMARY KEY REFERENCES families(id) ON DELETE CASCADE,
      customer_id TEXT UNIQUE,
      comped INTEGER NOT NULL DEFAULT 0,
      plan TEXT, status TEXT, subscription_id TEXT, paid_through INTEGER,
      cancel_at_period_end INTEGER NOT NULL DEFAULT 0, sub_stamp INTEGER,
      trial_used INTEGER NOT NULL DEFAULT 0, payment_failed INTEGER,
      sponsor_subscription_id TEXT, sponsor_status TEXT, sponsor_stamp INTEGER, sponsored INTEGER NOT NULL DEFAULT 0,
      updated INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS stripe_events (id TEXT PRIMARY KEY, type TEXT NOT NULL, received INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS grace_codes (
      id TEXT PRIMARY KEY, promo_id TEXT, code TEXT, months INTEGER NOT NULL, source TEXT NOT NULL,
      batch TEXT, ref TEXT UNIQUE, created INTEGER NOT NULL);
  `)
  const q = (sql) => db.prepare(sql)
  const row = (familyId) => q('SELECT * FROM billing WHERE family_id = ?').get(familyId) ?? null
  const ensure = (familyId) => q('INSERT INTO billing (family_id, updated) VALUES (?, ?) ON CONFLICT(family_id) DO NOTHING').run(familyId, clock())
  const set = (familyId, fields) => {
    ensure(familyId)
    const keys = Object.keys(fields)
    q(`UPDATE billing SET ${keys.map((k) => `${k} = ?`).join(', ')}, updated = ? WHERE family_id = ?`).run(...keys.map((k) => fields[k]), clock(), familyId)
  }
  const familyOfCustomer = (customer) => (customer ? q('SELECT family_id FROM billing WHERE customer_id = ?').get(idOf(customer))?.family_id ?? null : null)
  const needStripe = () => { if (!stripe) throw err(503, 'billing is not set up') }

  // Prices are found by their lookup_key (they can change in Stripe; the keys don't). Kept 10 minutes.
  let prices = { at: 0, byLookup: {} }
  async function priceId(plan) {
    if (clock() - prices.at > 10 * 60_000) {
      const r = await stripe.prices.list({ lookup_keys: Object.values(PLANS).map((p) => p.lookup), active: true, limit: 10 })
      prices = { at: clock(), byLookup: Object.fromEntries(r.data.map((p) => [p.lookup_key, p.id])) }
    }
    const id = prices.byLookup[PLANS[plan].lookup]
    if (!id) throw err(503, `no price ${PLANS[plan].lookup}: run npm run stripe-setup`)
    return id
  }

  /** What a subscription is: 'sponsor', or the family's own plan. */
  const kindOf = (sub) => {
    const item = sub.items?.data?.[0]
    const plan = PLAN_BY_LOOKUP[item?.price?.lookup_key] ?? null
    const sponsor = plan === 'sponsor-monthly' || idOf(item?.price?.product) === PRODUCTS.sponsor.id || sub.metadata?.arkpals === 'sponsor'
    return { sponsor, plan, item }
  }

  /**
   * Saves a subscription's state on its family. `stamp` (seconds) orders the updates: an older event that
   * arrives late doesn't undo a newer one. A family has one plan of its own (and maybe a sponsorship).
   */
  function applySubscription(familyId, sub, stamp) {
    const r = row(familyId)
    const { sponsor, plan, item } = kindOf(sub)
    if (sponsor) {
      if (r?.sponsor_subscription_id === sub.id && (r.sponsor_stamp ?? 0) > stamp) return
      if (r?.sponsor_subscription_id && r.sponsor_subscription_id !== sub.id && PAID.has(r.sponsor_status) && !PAID.has(sub.status)) return
      return set(familyId, { sponsor_subscription_id: sub.id, sponsor_status: sub.status, sponsor_stamp: stamp })
    }
    if (r?.subscription_id === sub.id && (r.sub_stamp ?? 0) > stamp) return
    // (an old plan ending doesn't touch the newer one the family has now)
    if (r?.subscription_id && r.subscription_id !== sub.id && PAID.has(r.status) && !PAID.has(sub.status)) return
    const end = sub.status === 'trialing' && sub.trial_end ? sub.trial_end : (item?.current_period_end ?? sub.ended_at ?? null)
    set(familyId, {
      subscription_id: sub.id, plan: plan ?? 'other', status: sub.status,
      paid_through: end ? end * 1000 : null,
      cancel_at_period_end: sub.cancel_at_period_end || sub.cancel_at ? 1 : 0,
      sub_stamp: stamp,
      trial_used: r?.trial_used || sub.trial_end || sub.trial_start ? 1 : 0,
      ...(sub.status === 'active' || sub.status === 'trialing' ? { payment_failed: null } : {}),
    })
  }

  async function syncFromSession(event) {
    const s = event.data.object
    if (s.mode !== 'subscription') return
    const fam = familyOfCustomer(s.customer)
    if (!fam) return log.warn?.(`Stripe ${event.type}: not one of our customers`)
    // (a bank payment that's still on its way: wait for checkout.session.async_payment_succeeded)
    if (s.payment_status !== 'paid' && s.payment_status !== 'no_payment_required') return
    const subId = idOf(s.subscription)
    if (!subId) return
    needStripe()
    // (fetched fresh, so it's newer than any event about it that's still on its way)
    const sub = await stripe.subscriptions.retrieve(subId)
    applySubscription(fam, sub, Math.max(event.created, Math.floor(clock() / 1000)))
  }

  /** Each paid Sponsor a Family invoice: one Grace code into the owner's pool (once per invoice). */
  async function sponsorCode(invoiceId, familyId) {
    const id = `gc_${randomBytes(9).toString('base64url')}`
    const claimed = q('INSERT INTO grace_codes (id, months, source, batch, ref, created) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(ref) DO NOTHING')
      .run(id, SPONSOR_CODE_MONTHS, 'sponsor', 'Sponsored', `invoice:${invoiceId}`, clock()).changes > 0
    if (!claimed) return
    try {
      needStripe()
      const promo = await createPromo(SPONSOR_CODE_MONTHS, { source: 'sponsor' })
      q('UPDATE grace_codes SET promo_id = ?, code = ? WHERE id = ?').run(promo.id, promo.code, id)
      set(familyId, { sponsored: (row(familyId)?.sponsored ?? 0) + 1 })
    } catch (e) {
      q('DELETE FROM grace_codes WHERE id = ?').run(id) // (Stripe sends the event again, and it's tried again)
      throw e
    }
  }

  async function createPromo(months, metadata = {}) {
    for (let tries = 0; ; tries++) {
      try {
        return await stripe.promotionCodes.create({
          promotion: { type: 'coupon', coupon: COUPONS[months].id }, code: graceCode(months), max_redemptions: 1, metadata,
        })
      } catch (e) {
        if (tries >= 2 || e?.code !== 'resource_already_exists') throw e // (the same code twice: very unlikely; try another)
      }
    }
  }

  const HANDLERS = {
    'checkout.session.completed': syncFromSession,
    'checkout.session.async_payment_succeeded': syncFromSession,
    'customer.subscription.created': subscriptionEvent,
    'customer.subscription.updated': subscriptionEvent,
    'customer.subscription.deleted': subscriptionEvent,
    async 'invoice.paid'(event) {
      const inv = event.data.object
      const fam = familyOfCustomer(inv.customer)
      if (!fam) return log.warn?.(`Stripe ${event.type}: not one of our customers`)
      const subId = idOf(inv.parent?.subscription_details?.subscription)
      const lines = inv.lines?.data ?? []
      const sponsor = (subId && subId === row(fam)?.sponsor_subscription_id)
        || inv.parent?.subscription_details?.metadata?.arkpals === 'sponsor'
        || lines.some((l) => idOf(l.pricing?.price_details?.product) === PRODUCTS.sponsor.id)
      if (sponsor) {
        if (inv.amount_paid > 0) await sponsorCode(inv.id, fam)
        return
      }
      const r = row(fam)
      if (subId && r?.subscription_id && subId !== r.subscription_id) return
      const end = Math.max(0, ...lines.map((l) => l.period?.end ?? 0)) * 1000
      set(fam, { paid_through: Math.max(r?.paid_through ?? 0, end) || null, payment_failed: null })
    },
    async 'invoice.payment_failed'(event) {
      const inv = event.data.object
      const fam = familyOfCustomer(inv.customer)
      if (!fam) return
      const subId = idOf(inv.parent?.subscription_details?.subscription)
      const r = row(fam)
      if ((subId && subId === r?.sponsor_subscription_id) || inv.parent?.subscription_details?.metadata?.arkpals === 'sponsor') return
      if (subId && r?.subscription_id && subId !== r.subscription_id) return
      set(fam, { payment_failed: event.created * 1000 })
    },
  }
  async function subscriptionEvent(event) {
    const sub = event.data.object
    const fam = familyOfCustomer(sub.customer)
    if (!fam) return log.warn?.(`Stripe ${event.type}: not one of our customers`)
    applySubscription(fam, sub, event.created)
  }

  const api = {
    enforced,
    stripeOn: !!stripe,

    /** The family's billing, as the Parent Corner shows it (parents only). */
    status(familyId) {
      const r = row(familyId)
      const first = familyId === families.firstFamily()
      return {
        stripeOn: !!stripe, enforced, free: first, comped: !!r?.comped,
        plan: r?.plan ?? null, status: r?.status ?? null, paidThrough: r?.paid_through ?? null,
        cancelAtPeriodEnd: !!r?.cancel_at_period_end, trialUsed: !!r?.trial_used, paymentFailed: r?.payment_failed ?? null,
        sponsoring: PAID.has(r?.sponsor_status), billingPage: !!r?.customer_id,
        plans: Object.entries(PLANS).map(([id, p]) => ({ id, amount: p.amount, interval: p.interval, label: p.label })),
      }
    },

    /**
     * Whether the family may play: { allowed, enforced, reason }. reason: 'free' (the first family),
     * 'comped', 'paid' (active, trial, or a card being retried), or 'none' (no plan, or it ended).
     * With enforcement off, everyone is allowed whatever the reason.
     */
    access(familyId) {
      const r = row(familyId)
      const reason = familyId === families.firstFamily() ? 'free' : r?.comped ? 'comped' : PAID.has(r?.status) ? 'paid' : 'none'
      return { allowed: !enforced || reason !== 'none', enforced, reason }
    },

    /** Stripe Checkout for a plan: returns its URL. The family's Stripe Customer is made the first time. */
    async checkout(session, plan, { returnUrl, email = null }) {
      if (!(plan in PLANS)) throw err(400, 'bad plan')
      needStripe()
      const fam = session.family.id
      const sponsor = plan === 'sponsor-monthly'
      const r = row(fam)
      if (sponsor ? PAID.has(r?.sponsor_status) : (fam === families.firstFamily() || r?.comped || PAID.has(r?.status))) throw err(409, 'already has a plan')
      const price = await priceId(plan)
      let customer = r?.customer_id
      if (!customer) {
        const c = await stripe.customers.create({ ...(email ? { email } : {}), metadata: { arkpals_family: fam } })
        ensure(fam)
        q('UPDATE billing SET customer_id = ?, updated = ? WHERE family_id = ? AND customer_id IS NULL').run(c.id, clock(), fam)
        customer = row(fam).customer_id // (if two parents asked at once, the first one's)
      }
      const s = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer,
        line_items: [{ price, quantity: 1 }],
        ...(sponsor ? {} : { allow_promotion_codes: true }),
        subscription_data: {
          ...(sponsor || r?.trial_used ? {} : { trial_period_days: TRIAL_DAYS }),
          metadata: { arkpals: sponsor ? 'sponsor' : 'family' },
        },
        integration_identifier: integrationId(),
        ...(tax ? { automatic_tax: { enabled: true }, customer_update: { address: 'auto', name: 'auto' } } : {}),
        success_url: `${returnUrl}/?billing=done`,
        cancel_url: `${returnUrl}/?billing=back`,
      })
      return s.url
    },

    /** Stripe's billing page (cancel, change card or plan, receipts): returns its URL. */
    async portal(session, { returnUrl }) {
      needStripe()
      const customer = row(session.family.id)?.customer_id
      if (!customer) throw err(404, 'no billing yet')
      const s = await stripe.billingPortal.sessions.create({ customer, return_url: `${returnUrl}/?billing=back`, ...(portalConfig ? { configuration: portalConfig } : {}) })
      return s.url
    },

    /**
     * A webhook from Stripe: `raw` is the body exactly as it came (a Buffer: never parsed first), `signature`
     * the Stripe-Signature header. Returns the HTTP status. Each event is handled once: one that arrives
     * again is acknowledged and skipped. A failure answers 500, so Stripe sends it again later.
     */
    async webhook(raw, signature) {
      if (!webhooks || !webhookSecret) return 503
      let event
      try {
        event = webhooks.constructEvent(raw, String(signature ?? ''), webhookSecret)
      } catch {
        return 400
      }
      if (q('SELECT 1 FROM stripe_events WHERE id = ?').get(event.id)) return 200
      const handle = HANDLERS[event.type]
      try {
        if (handle) await handle(event)
      } catch (e) {
        log.error?.(`Stripe ${event.type} ${event.id}: ${e.message}`)
        return 500
      }
      q('INSERT INTO stripe_events (id, type, received) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING').run(event.id, event.type, clock())
      q('DELETE FROM stripe_events WHERE received < ?').run(clock() - KEEP_EVENTS_DAYS * DAY)
      return 200
    },

    // ---- the owner's dashboard ----

    /** Families on each plan (counts only), and every family's name with its plan, for comping. */
    ownerSummary() {
      const first = families.firstFamily()
      const rows = Object.fromEntries(q('SELECT * FROM billing').all().map((r) => [r.family_id, r]))
      const list = q('SELECT id, name, created FROM families ORDER BY created').all().map((f) => {
        const r = rows[f.id]
        const what = f.id === first ? 'free' : r?.comped ? 'comped' : PAID.has(r?.status) ? (r.status === 'trialing' ? 'trial' : r.plan ?? 'other') : r?.status ? 'ended' : 'none'
        return { id: f.id, name: f.name, created: f.created, what, status: r?.status ?? null, pastDue: r?.status === 'past_due', comped: !!r?.comped, first: f.id === first, sponsoring: PAID.has(r?.sponsor_status) }
      })
      const counts = {}
      for (const f of list) counts[f.what] = (counts[f.what] ?? 0) + 1
      return {
        counts, families: list, sponsors: list.filter((f) => f.sponsoring).length,
        pastDue: list.filter((f) => f.pastDue).length,
        codes: q('SELECT code, months, source, batch, created FROM grace_codes WHERE code IS NOT NULL ORDER BY created DESC LIMIT 500').all().map((c) => ({ ...c })),
      }
    },

    /** A batch of single-use Grace codes (6 or 12 months free). Returns the codes. */
    async makeCodes(months, count, batch) {
      months = Number(months)
      count = Number(count)
      if (!COUPONS[months] || !Number.isInteger(count) || count < 1 || count > 100) throw err(400, 'bad batch')
      needStripe()
      const label = String(batch ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60) || new Date(clock()).toISOString().slice(0, 10)
      const made = []
      for (let i = 0; i < count; i++) {
        const promo = await createPromo(months, { source: 'batch' })
        q('INSERT INTO grace_codes (id, promo_id, code, months, source, batch, created) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .run(`gc_${randomBytes(9).toString('base64url')}`, promo.id, promo.code, months, 'batch', label, clock())
        made.push(promo.code)
      }
      return { months, batch: label, codes: made }
    },

    /** Marks a family as comped (always free, like the church beta), or not. */
    setComped(familyId, on) {
      if (!q('SELECT 1 FROM families WHERE id = ?').get(familyId)) throw err(404, 'no family')
      set(familyId, { comped: on ? 1 : 0 })
    },

    // ---- the family's own data ----

    /** Everything kept about the family's billing (for its download), or null. */
    exportFamily(familyId) {
      const r = row(familyId)
      if (!r) return null
      const at = (t) => (t ? new Date(t).toISOString() : null)
      return {
        stripeCustomer: r.customer_id, comped: !!r.comped, plan: r.plan, status: r.status, subscription: r.subscription_id,
        paidThrough: at(r.paid_through), cancelAtPeriodEnd: !!r.cancel_at_period_end, trialUsed: !!r.trial_used,
        lastPaymentFailed: at(r.payment_failed), sponsorSubscription: r.sponsor_subscription_id, sponsorStatus: r.sponsor_status,
        sponsoredCodes: r.sponsored, updated: at(r.updated),
      }
    },

    /**
     * Before a family is deleted: its Stripe Customer is deleted, which cancels its plans at once (so no
     * one is charged after leaving). Its billing row goes with the family (ON DELETE CASCADE).
     */
    async forget(familyId) {
      const customer = row(familyId)?.customer_id
      if (!customer) return
      if (!stripe) throw err(503, 'billing is not set up, so the plan cannot be cancelled')
      try {
        await stripe.customers.del(customer)
      } catch (e) {
        if (e?.code !== 'resource_missing') throw err(502, e.message)
      }
      q('UPDATE billing SET customer_id = NULL WHERE family_id = ?').run(familyId)
    },
  }
  return api
}

// ---- HTTP ----

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(body === undefined ? '' : JSON.stringify(body))
}
async function readBody(req, max) {
  const chunks = []
  let size = 0
  for await (const c of req) {
    size += c.length
    if (size > max) throw err(413, 'too large')
    chunks.push(c)
  }
  return Buffer.concat(chunks)
}
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
/** A form posted from another site is refused (the cookie is SameSite=Lax too). */
const sameOrigin = (req) => !req.headers.origin || new URL(req.headers.origin).host === req.headers.host

/** POST /stripe/webhook (no sign-in: Stripe's signature is checked instead). */
export async function handleWebhook(req, res, billing) {
  let raw
  try {
    raw = await readBody(req, 1024 * 1024)
  } catch (e) {
    return json(res, e.status ?? 400)
  }
  return json(res, await billing.webhook(raw, req.headers['stripe-signature']))
}

/**
 * GET /billing: whether the family may play ({ allowed, enforced, checkedAt }), and for parents its plan.
 * Parents: POST /billing/checkout {plan} -> {url}; POST /billing/portal -> {url}.
 * The owner (a parent in the first family): GET /billing/owner (the dashboard), POST /billing/owner/codes,
 * POST /billing/owner/comp.
 */
export async function handleBilling(req, res, url, s, billing, { siteUrl, isOwner }) {
  const parent = s.member.role === 'parent'
  const what = url.pathname.split('/')[2] ?? ''
  try {
    if (!what && req.method === 'GET') {
      const a = billing.access(s.family.id)
      return json(res, 200, { allowed: a.allowed, enforced: a.enforced, checkedAt: Date.now(), ...(parent ? { billing: billing.status(s.family.id) } : {}) })
    }
    if (what === 'owner') return await handleOwner(req, res, url, s, billing, isOwner)
    if (!parent) return json(res, 403)
    if (what === 'checkout' && req.method === 'POST') {
      const b = JSON.parse((await readBody(req, 4096)).toString('utf8') || '{}')
      return json(res, 200, { url: await billing.checkout(s, String(b.plan ?? ''), { returnUrl: siteUrl(req), email: s.member.email ?? null }) })
    }
    if (what === 'portal' && req.method === 'POST') return json(res, 200, { url: await billing.portal(s, { returnUrl: siteUrl(req) }) })
    return json(res, 405)
  } catch (e) {
    if (!e.status) console.error(`billing: ${e.message}`)
    return json(res, e.status ?? (e.type?.startsWith?.('Stripe') ? 502 : 400))
  }
}

async function handleOwner(req, res, url, s, billing, isOwner) {
  if (!isOwner(s)) return json(res, 403)
  const page = (body) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(ownerPage(body))
  }
  const sub = url.pathname.split('/')[3] ?? ''
  if (req.method === 'GET' && !sub) return page(dashboard(billing.ownerSummary(), billing))
  if (req.method !== 'POST' || !sameOrigin(req)) return json(res, 405)
  const f = new URLSearchParams((await readBody(req, 4096)).toString('utf8'))
  if (sub === 'codes') {
    const made = await billing.makeCodes(f.get('months'), f.get('count'), f.get('batch'))
    return page(codesPage(made))
  }
  if (sub === 'comp') {
    billing.setComped(String(f.get('family') ?? ''), f.get('comped') === '1')
    res.writeHead(303, { Location: '/billing/owner' })
    return res.end()
  }
  return json(res, 404)
}

const NAMES = { free: 'Free (our family)', comped: 'Comped', 'family-yearly': 'Family, yearly', 'family-monthly': 'Family, monthly', 'grace-monthly': 'Grace price', trial: 'In their free week', other: 'Another price', ended: 'Plan ended', none: 'No plan yet' }

function dashboard(o, billing) {
  const order = ['family-yearly', 'family-monthly', 'grace-monthly', 'trial', 'comped', 'free', 'ended', 'none', 'other']
  const counts = order.filter((k) => o.counts[k]).map((k) => `<tr><td>${esc(NAMES[k])}</td><td>${o.counts[k]}</td></tr>`).join('')
  const day = (t) => new Date(t).toISOString().slice(0, 10)
  const fams = o.families.map((f) => `<tr><td>${esc(f.name)}</td><td>${esc(NAMES[f.what])}${f.pastDue ? ' (card being retried)' : ''}${f.sponsoring ? ' · sponsors a family' : ''}</td><td>${day(f.created)}</td><td>${f.first ? '' : `<form method="post" action="/billing/owner/comp"><input type="hidden" name="family" value="${esc(f.id)}"><input type="hidden" name="comped" value="${f.comped ? '0' : '1'}"><button class="small">${f.comped ? 'Stop comping' : 'Comp'}</button></form>`}</td></tr>`).join('')
  const codes = o.codes.map((c) => `<tr><td class="code">${esc(c.code)}</td><td>${c.months} months</td><td>${esc(c.source === 'sponsor' ? 'Sponsored' : c.batch)}</td><td>${day(c.created)}</td></tr>`).join('')
  return `<h1>Billing</h1>
<p class="note">${billing.stripeOn ? 'Stripe is connected.' : 'Stripe isn’t set up yet (npm run set-stripe-key, then npm run stripe-setup).'} Access is ${billing.enforced ? '<b>enforced</b>' : 'not enforced yet (BILLING_ENFORCED is off): every family can play'}. Counts only: nothing about children is here.</p>
<h2>Families on each plan</h2>
<table><tbody>${counts || '<tr><td>No families yet</td><td></td></tr>'}</tbody></table>
<p class="note">${o.sponsors} ${o.sponsors === 1 ? 'family sponsors' : 'families sponsor'} another family. ${o.pastDue ? `${o.pastDue} with a card being retried.` : ''}</p>
<h2>Make Grace codes</h2>
<p class="note">Each code works once, at checkout, for a family plan: free for 6 or 12 months. Give them to children’s pastors and ministry leaders to hand out quietly.</p>
<form method="post" action="/billing/owner/codes" class="row">
<label>How many <input name="count" type="number" min="1" max="100" value="10" required></label>
<label>Free for <select name="months"><option value="6">6 months</option><option value="12">12 months</option></select></label>
<label>Who they're for <input name="batch" maxlength="60" placeholder="Grace Church, children's ministry"></label>
<button ${billing.stripeOn ? '' : 'disabled'}>Make codes</button></form>
<h2>Families</h2>
<p class="note">Comped families (like the church beta) are always free. The first family always is.</p>
<div class="wrap"><table><thead><tr><th>Family</th><th>Plan</th><th>Joined</th><th></th></tr></thead><tbody>${fams}</tbody></table></div>
<h2>Grace codes made</h2>
${codes ? `<div class="wrap"><table><thead><tr><th>Code</th><th>Free for</th><th>For</th><th>Made</th></tr></thead><tbody>${codes}</tbody></table></div>` : '<p class="note">None yet.</p>'}
<p class="note"><a href="/">Back to Ark Pals</a></p>`
}

function codesPage(m) {
  return `<h1>${m.codes.length} Grace ${m.codes.length === 1 ? 'code' : 'codes'}</h1>
<p class="note">${esc(m.batch)} · each free for ${m.months} months, once. Enter it at checkout (“Add promotion code”).</p>
<ul class="codes">${m.codes.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
<p class="note noprint">To print, use your browser’s Print (on an iPad: Share, then Print). To copy, select the codes. They’re kept on the billing page too.</p>
<p class="noprint"><a href="/billing/owner">Back to billing</a></p>`
}

const ownerPage = (body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Billing</title>
<style>
body{margin:0;padding:24px 16px 48px;font-family:system-ui,sans-serif;background:#fff;color:#2b2233;line-height:1.4}
main{max-width:860px;margin:0 auto}h1{margin:0 0 4px}h2{margin:32px 0 8px;font-size:20px}
.note{color:#6a5a7a;margin:4px 0 12px}.wrap{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;font-size:15px}
th,td{padding:6px 10px;border-bottom:1px solid #eadff0;text-align:left;vertical-align:middle}th{background:#faf5fc}
td form{margin:0}.row{display:flex;flex-wrap:wrap;gap:12px;align-items:end}label{display:grid;gap:4px;font-weight:600}
input,select,button{font:inherit;padding:8px 10px;border-radius:10px;border:1px solid #d9c6e4}
button{background:#ff6fae;color:#fff;border:0;font-weight:700;cursor:pointer}button.small{padding:4px 10px;font-size:14px}
button:disabled{opacity:.5}.code,.codes{font-family:ui-monospace,Menlo,monospace}
.codes{columns:2;font-size:22px;letter-spacing:.04em;padding-left:1.2em}.codes li{margin:0 0 10px;break-inside:avoid}
a{color:#b0307a}
@media print{.noprint{display:none}body{padding:0}}
@media (prefers-color-scheme:dark){body{background:#1d1822;color:#eee6f2}.note{color:#b8a8c6}th{background:#2a2330}th,td{border-color:#3a3040}a{color:#ff8cc0}}
</style></head><body><main>${body}</main></body></html>`
