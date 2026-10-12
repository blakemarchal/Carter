// Billing: signed webhooks (every kind we handle), matched to a family by its Stripe Customer ID, each handled
// once; who may play; Checkout and the billing page; the owner's dashboard; and the family's own data.
// Nothing here talks to Stripe: the webhooks are signed with the SDK's own test helper, and the API is a fake.
import { EventEmitter } from 'node:events'
import Stripe from 'stripe'
import { describe, expect, it } from 'vitest'
import { openFamilies } from './families.mjs'
import { API_VERSION, GRACE_MONTHS, PLANS, SPONSOR_CODE_MONTHS, WEBHOOK_EVENTS, addMonths, createBilling, graceCode, handleBilling, handleWebhook, integrationId, isOn, sameOrigin, tidyCode } from './billing.mjs'
import { setupStripe } from './stripe-setup.mjs'
import { writeFamilyExport } from './family-data.mjs'

const NOW = Date.UTC(2026, 9, 11, 15)
const SEC = Math.floor(NOW / 1000)
const DAY_S = 24 * 3600
const SECRET = 'whsec_test_secret_for_unit_tests'
/** Checkout parameters Stripe Managed Payments (Stripe as merchant of record) refuses. */
const MANAGED_PAYMENTS_REFUSES = ['automatic_tax', 'customer_update', 'payment_method_types', 'tax_id_collection', 'invoice_creation']
const sdk = new Stripe('rk_test_not_a_real_key', { apiVersion: API_VERSION })

/** A Stripe API that remembers what it was asked, and answers like Stripe would (enough for billing). */
function fakeStripe() {
  const calls = []
  const subs = {}
  let n = 0
  const rec = (name, fn) => async (...a) => { calls.push([name, ...a]); return fn(...a) }
  return {
    calls, subs,
    called: (name) => calls.filter((c) => c[0] === name),
    customers: {
      create: rec('customers.create', () => ({ id: `cus_${++n}` })),
      del: rec('customers.del', (id) => ({ id, deleted: true })),
    },
    prices: { list: rec('prices.list', () => ({ data: Object.values(PLANS).map((p) => ({ id: `price_${p.lookup}`, lookup_key: p.lookup })) })) },
    checkout: { sessions: { create: rec('checkout.sessions.create', () => ({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/cs_test_1' })) } },
    billingPortal: { sessions: { create: rec('portal.create', () => ({ url: 'https://billing.stripe.com/p/session/test_1' })) } },
    subscriptions: { retrieve: rec('subscriptions.retrieve', (id) => { if (!subs[id]) throw Object.assign(new Error('no such'), { code: 'resource_missing' }); return subs[id] }) },
  }
}

function setup({ enforced = false, secret = SECRET, stripe = fakeStripe() } = {}) {
  let t = NOW
  const fams = openFamilies(':memory:', { clock: () => t })
  const billing = createBilling({ db: fams.db, families: fams, stripe, webhooks: sdk.webhooks, webhookSecret: secret, enforced, clock: () => t, log: { warn() {}, error() {} } })
  const newFamily = (name = 'The Rivers') => {
    const dev = fams.useLink(fams.makeLink({ kind: 'family' }).token, { label: 'iPad', familyName: name, yourName: 'Sam' })
    return fams.session(dev)
  }
  return { fams, billing, stripe, newFamily, later: (ms) => { t += ms } }
}

let seq = 0
const event = (type, object, { created = SEC, id = `evt_${++seq}` } = {}) => ({ id, object: 'event', api_version: API_VERSION, created, type, livemode: false, data: { object } })
/** The body and Stripe-Signature header Stripe would send. */
function signed(evt, secret = SECRET) {
  const payload = JSON.stringify(evt)
  return { raw: Buffer.from(payload), sig: sdk.webhooks.generateTestHeaderString({ payload, secret }) }
}
const deliver = (billing, evt) => { const { raw, sig } = signed(evt); return billing.webhook(raw, sig) }

const sub = (id, customer, { status = 'active', plan = 'family-yearly', end = SEC + 365 * DAY_S, trialEnd = null, cancel = false, metadata = { arkpals: 'family' } } = {}) => ({
  id, object: 'subscription', customer, status, cancel_at_period_end: cancel, cancel_at: null, ended_at: null,
  trial_start: trialEnd ? SEC : null, trial_end: trialEnd, metadata,
  items: { object: 'list', data: [{ id: `si_${id}`, object: 'subscription_item', current_period_end: end, price: { id: `price_${PLANS[plan].lookup}`, lookup_key: PLANS[plan].lookup, product: `arkpals_${PLANS[plan].product}` } }] },
})
const invoice = (id, customer, subId, { paid = 7900, end = SEC + 365 * DAY_S, product = 'arkpals_family', metadata = { arkpals: 'family' } } = {}) => ({
  id, object: 'invoice', customer, amount_paid: paid, status: 'paid',
  parent: { type: 'subscription_details', subscription_details: { subscription: subId, metadata } },
  lines: { object: 'list', data: [{ id: `il_${id}`, period: { start: SEC, end }, pricing: { type: 'price_details', price_details: { price: 'price_x', product } } }] },
})
const session = (customer, subId, { payment_status = 'paid', metadata = {} } = {}) => ({
  id: 'cs_test_1', object: 'checkout.session', mode: 'subscription', customer, subscription: subId, payment_status, status: 'complete', metadata,
})

/** A family that has been to Checkout once (so it has its Stripe Customer). */
async function withCustomer(t, name) {
  const s = t.newFamily(name)
  await t.billing.checkout(s, 'family-yearly', { returnUrl: 'https://spiritflow.church' })
  return { s, fam: s.family.id, cus: t.fams.db.prepare('SELECT customer_id FROM billing WHERE family_id = ?').get(s.family.id).customer_id }
}

describe('webhook signatures', () => {
  it('accepts only events signed with our secret, checked on the body exactly as it came', async () => {
    const { billing } = setup()
    const evt = event('customer.subscription.updated', sub('sub_1', 'cus_nobody'))
    const { raw, sig } = signed(evt)
    expect(await billing.webhook(raw, sig)).toBe(200)
    expect(await billing.webhook(raw, signed(evt, 'whsec_someone_else').sig)).toBe(400)
    expect(await billing.webhook(Buffer.from(raw.toString().replace('active', 'trialing')), sig)).toBe(400) // (changed on the way)
    expect(await billing.webhook(raw, '')).toBe(400)
    expect(await billing.webhook(raw, undefined)).toBe(400)
    // (a signature from long ago: someone replaying an old delivery)
    const payload = JSON.stringify(event('invoice.paid', invoice('in_old', 'cus_nobody', 'sub_1')))
    expect(await billing.webhook(Buffer.from(payload), sdk.webhooks.generateTestHeaderString({ payload, secret: SECRET, timestamp: SEC - 3600 }))).toBe(400)
  })

  it('answers 503 until the webhook secret is set up', async () => {
    const { billing } = setup({ secret: '' })
    const { raw, sig } = signed(event('invoice.paid', invoice('in_1', 'cus_x', 'sub_1')))
    expect(await billing.webhook(raw, sig)).toBe(503)
  })

  it('the route reads the raw body and passes the Stripe-Signature header', async () => {
    const { billing } = setup()
    const { raw, sig } = signed(event('customer.subscription.created', sub('sub_1', 'cus_nobody')))
    const res = fakeRes()
    await handleWebhook(fakeReq({ body: raw, headers: { 'stripe-signature': sig } }), res, billing)
    expect(res.status).toBe(200)
    const bad = fakeRes()
    await handleWebhook(fakeReq({ body: Buffer.concat([raw, Buffer.from(' ')]), headers: { 'stripe-signature': sig } }), bad, billing)
    expect(bad.status).toBe(400)
  })

  it('listens for exactly the events it handles', () => {
    expect(WEBHOOK_EVENTS).toEqual(['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'customer.subscription.created',
      'customer.subscription.updated', 'customer.subscription.deleted', 'invoice.paid', 'invoice.payment_failed'])
  })
})

describe('Checkout and the billing page', () => {
  it('starts a subscription that takes a card, with a 7-day trial, and nothing Managed Payments refuses', async () => {
    const t = setup()
    const s = t.newFamily()
    const url = await t.billing.checkout(s, 'family-yearly', { returnUrl: 'https://spiritflow.church', email: 'sam@example.com' })
    expect(url).toMatch(/^https:\/\/checkout\.stripe\.com\//)
    const [[, cust]] = t.stripe.called('customers.create')
    expect(cust).toEqual({ email: 'sam@example.com', metadata: { arkpals_family: s.family.id } })
    const [[, p]] = t.stripe.called('checkout.sessions.create')
    expect(p.mode).toBe('subscription')
    expect(p.customer).toBe('cus_1')
    expect(p.line_items).toEqual([{ price: 'price_arkpals_family_yearly', quantity: 1 }])
    expect(p.payment_method_collection).toBe('always')
    expect(p.subscription_data.trial_period_days).toBe(7)
    expect(p.subscription_data).not.toHaveProperty('trial_settings')
    expect(p.integration_identifier).toMatch(/^arkpals-checkout-[a-z]{8}$/)
    for (const no of MANAGED_PAYMENTS_REFUSES) expect(p).not.toHaveProperty(no)
    // (Grace codes are typed in Ark Pals, not at a paid checkout: there's no promotion code box to stack one on)
    expect(p).not.toHaveProperty('allow_promotion_codes')
    expect(p).not.toHaveProperty('discounts')
    expect(p.success_url).toBe('https://spiritflow.church/?billing=done')
    expect(JSON.stringify(p)).not.toMatch(/Rivers|Sam/) // (nothing about the family's people)
  })

  it('makes the Stripe Customer once, and a family has one free week only', async () => {
    const t = setup()
    const { s, fam, cus } = await withCustomer(t)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_1', cus, { status: 'trialing', trialEnd: SEC + 7 * DAY_S })))
    await deliver(t.billing, event('customer.subscription.deleted', sub('sub_1', cus, { status: 'canceled' }), { created: SEC + 10 }))
    await t.billing.checkout(s, 'grace-monthly', { returnUrl: 'https://x' })
    expect(t.stripe.called('customers.create')).toHaveLength(1)
    const p = t.stripe.called('checkout.sessions.create')[1][1]
    expect(p.customer).toBe(cus)
    expect(p.line_items[0].price).toBe('price_arkpals_grace_monthly')
    expect(p.subscription_data).not.toHaveProperty('trial_period_days')
    expect(t.billing.status(fam).trialUsed).toBe(true)
  })


  it('Sponsor a Family: no codes and no trial', async () => {
    const t = setup()
    await t.billing.checkout(t.newFamily(), 'sponsor-monthly', { returnUrl: 'https://x' })
    const [[, p]] = t.stripe.called('checkout.sessions.create')
    expect(p.line_items[0].price).toBe('price_arkpals_sponsor_monthly')
    expect(p).not.toHaveProperty('allow_promotion_codes')
    expect(p.subscription_data).toEqual({ metadata: { arkpals: 'sponsor' } })
    expect(p.payment_method_collection).toBe('always')
    for (const no of MANAGED_PAYMENTS_REFUSES) expect(p).not.toHaveProperty(no)
  })

  it('refuses a plan the family doesn’t need, or one that doesn’t exist', async () => {
    const t = setup()
    const first = { family: { id: t.fams.firstFamily() }, member: { role: 'parent' } }
    await expect(t.billing.checkout(first, 'family-yearly', { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 409 })
    const { s, fam, cus } = await withCustomer(t)
    await expect(t.billing.checkout(s, 'family-weekly', { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 400 })
    await deliver(t.billing, event('customer.subscription.created', sub('sub_1', cus)))
    await expect(t.billing.checkout(s, 'family-monthly', { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 409 })
    const comped = t.newFamily('The Hills')
    t.billing.setComped(comped.family.id, true)
    await expect(t.billing.checkout(comped, 'family-yearly', { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 409 })
    // (sponsoring is open to anyone, the first family too)
    expect(await t.billing.checkout(first, 'sponsor-monthly', { returnUrl: 'https://x' })).toMatch(/^https:/)
    expect(t.billing.status(fam).plan).toBe('family-yearly')
  })

  it('opens the billing page for a family with a Stripe Customer', async () => {
    const t = setup()
    await expect(t.billing.portal(t.newFamily('No plan'), { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 404 })
    const { s, cus } = await withCustomer(t)
    expect(await t.billing.portal(s, { returnUrl: 'https://spiritflow.church' })).toMatch(/^https:\/\/billing\.stripe\.com\//)
    expect(t.stripe.called('portal.create')[0][1]).toEqual({ customer: cus, return_url: 'https://spiritflow.church/?billing=back' })
  })

  it('without a Stripe key, there is no checkout (503), but access still works', async () => {
    const t = setup({ stripe: null })
    const s = t.newFamily()
    await expect(t.billing.checkout(s, 'family-yearly', { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 503 })
    expect(t.billing.access(s.family.id)).toEqual({ allowed: true, enforced: false, reason: 'none' })
  })
})

describe('Grace codes take no card', () => {
  /** A family with a Grace plan that has just started, from a 6-month code. */
  async function graceFamily(t, name = 'The Rivers', months = 6) {
    const [code] = (await t.billing.makeCodes(months, 1, 'Grace Church')).codes
    const s = t.newFamily(name)
    await t.billing.graceCheckout(s, code, { returnUrl: 'https://spiritflow.church' })
    const p = t.stripe.called('checkout.sessions.create').at(-1)[1]
    const fam = s.family.id
    const cus = t.fams.db.prepare('SELECT customer_id FROM billing WHERE family_id = ?').get(fam).customer_id
    const graceSub = (status = 'trialing') => ({ ...sub(`sub_${fam}`, cus, { status, plan: 'family-monthly', trialEnd: p.subscription_data.trial_end, end: p.subscription_data.trial_end }), metadata: p.subscription_data.metadata })
    return { code, s, fam, cus, p, graceSub }
  }

  it('a Grace checkout asks for no card, and is free for exactly the code’s months', async () => {
    const t = setup()
    const [code] = (await t.billing.makeCodes(12, 1, 'Grace Church')).codes
    const s = t.newFamily()
    // (typed any old way: lower case, spaces, no dashes)
    const url = await t.billing.graceCheckout(s, ` ${code.toLowerCase().replace(/-/g, ' ')} `, { returnUrl: 'https://spiritflow.church', email: 'sam@example.com' })
    expect(url).toMatch(/^https:\/\/checkout\.stripe\.com\//)
    const [[, p]] = t.stripe.called('checkout.sessions.create')
    expect(p.mode).toBe('subscription')
    expect(p.line_items).toEqual([{ price: 'price_arkpals_family_monthly', quantity: 1 }])
    expect(p.payment_method_collection).toBe('if_required')
    expect(p.subscription_data.trial_end).toBe(Math.floor(Date.UTC(2027, 9, 11, 15) / 1000)) // (12 months from Oct 11, 2026)
    expect(p.subscription_data.trial_settings).toEqual({ end_behavior: { missing_payment_method: 'cancel' } })
    expect(p.subscription_data).not.toHaveProperty('trial_period_days')
    expect(p.subscription_data.metadata).toMatchObject({ arkpals: 'family', arkpals_grace: expect.stringMatching(/^gc_/) })
    expect(p.expires_at).toBe(SEC + 30 * 60)
    expect(p).not.toHaveProperty('allow_promotion_codes')
    expect(p).not.toHaveProperty('discounts')
    for (const no of MANAGED_PAYMENTS_REFUSES) expect(p).not.toHaveProperty(no)
    expect(JSON.stringify(p)).not.toMatch(/Rivers|Sam|GRACE/) // (nothing about the family, and not the code itself)
    expect(addMonths(Date.UTC(2026, 7, 31), 6)).toBe(Date.UTC(2027, 1, 28)) // (Aug 31 + 6 months: the end of February)
  })

  it('the plan starts with no payment: the family plays, and the code is used', async () => {
    const t = setup({ enforced: true })
    const { fam, cus, p, graceSub } = await graceFamily(t)
    expect(t.billing.ownerSummary().codes[0].used).toBeNull() // (not used until the plan starts)
    t.stripe.subs[`sub_${fam}`] = graceSub()
    await deliver(t.billing, event('checkout.session.completed', { ...session(cus, `sub_${fam}`, { payment_status: 'no_payment_required', metadata: p.metadata }) }))
    expect(t.billing.status(fam)).toMatchObject({ plan: 'family-monthly', status: 'trialing', grace: true, paidThrough: p.subscription_data.trial_end * 1000 })
    expect(t.billing.access(fam)).toEqual({ allowed: true, enforced: true, reason: 'paid' })
    expect(t.billing.ownerSummary().codes[0].used).toBe(NOW)
    expect(t.billing.ownerSummary().counts).toMatchObject({ grace: 1 })
    expect(t.billing.exportFamily(fam).graceCode).toBe(true)
  })

  it('the subscription event alone (before the checkout one) uses the code too', async () => {
    const t = setup()
    const { fam, graceSub } = await graceFamily(t)
    await deliver(t.billing, event('customer.subscription.created', graceSub()))
    expect(t.billing.status(fam)).toMatchObject({ status: 'trialing', grace: true })
    expect(t.billing.ownerSummary().codes[0].used).toBe(NOW)
  })

  it('the free months end without a card: Stripe cancels the plan, nothing is charged, and the family can choose again', async () => {
    const t = setup({ enforced: true })
    const { code, s, fam, p, graceSub } = await graceFamily(t)
    await deliver(t.billing, event('customer.subscription.created', graceSub()))
    // (missing_payment_method 'cancel': at the trial's end Stripe deletes the subscription; no invoice is paid or failed)
    const ended = { ...graceSub('canceled'), ended_at: p.subscription_data.trial_end }
    expect(await deliver(t.billing, event('customer.subscription.deleted', ended, { created: p.subscription_data.trial_end }))).toBe(200)
    expect(t.billing.status(fam)).toMatchObject({ status: 'canceled', grace: true, paymentFailed: null })
    expect(t.billing.access(fam)).toEqual({ allowed: false, enforced: true, reason: 'none' })
    // (the same code again: refused; a new one: fine; a paid plan: a card, and no second free week)
    await expect(t.billing.graceCheckout(s, code, { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 410 })
    const [another] = (await t.billing.makeCodes(6, 1)).codes
    expect(await t.billing.graceCheckout(s, another, { returnUrl: 'https://x' })).toMatch(/^https:/)
    await t.billing.checkout(s, 'family-monthly', { returnUrl: 'https://x' })
    const paid = t.stripe.called('checkout.sessions.create').at(-1)[1]
    expect(paid.payment_method_collection).toBe('always')
    expect(paid.subscription_data).not.toHaveProperty('trial_period_days')
  })

  it('a family that adds a card on the billing page keeps its plan after the free months', async () => {
    const t = setup({ enforced: true })
    const { fam, p, graceSub } = await graceFamily(t)
    await deliver(t.billing, event('customer.subscription.created', graceSub()))
    const later = p.subscription_data.trial_end
    await deliver(t.billing, event('customer.subscription.updated', { ...graceSub('active'), items: sub('x', 'y', { plan: 'family-monthly', end: later + 30 * DAY_S }).items }, { created: later }))
    expect(t.billing.status(fam)).toMatchObject({ status: 'active', plan: 'family-monthly', paidThrough: (later + 30 * DAY_S) * 1000 })
    expect(t.billing.access(fam).allowed).toBe(true)
  })

  it('refuses a used code, a code that isn’t ours, a family that has a plan, and too many guesses', async () => {
    const t = setup()
    const { code, graceSub } = await graceFamily(t, 'The Rivers')
    await deliver(t.billing, event('customer.subscription.created', graceSub()))
    const other = t.newFamily('The Hills')
    await expect(t.billing.graceCheckout(other, code, { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 410 })
    await expect(t.billing.graceCheckout(other, 'GRACE6-AAAA-AAAA', { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 404 })
    await expect(t.billing.graceCheckout(other, 'hello', { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 404 })
    const first = { family: { id: t.fams.firstFamily() }, member: { role: 'parent' } }
    const [fresh] = (await t.billing.makeCodes(6, 1)).codes
    await expect(t.billing.graceCheckout(first, fresh, { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 409 })
    for (let i = 0; i < 8; i++) await expect(t.billing.graceCheckout(other, `GRACE6-BBBB-BB${i}${i}`, { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 404 })
    await expect(t.billing.graceCheckout(other, fresh, { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 429 })
    t.later(61 * 60_000)
    expect(await t.billing.graceCheckout(other, fresh, { returnUrl: 'https://x' })).toMatch(/^https:/)
    expect(tidyCode('grace12 abcd-efgh')).toBe('GRACE12-ABCD-EFGH')
    expect(tidyCode('GRACE7-ABCD-EFGH')).toBeNull()
  })

  it('a code at one family’s checkout waits for it (longer than the checkout lasts), then is free again', async () => {
    const t = setup()
    const [code] = (await t.billing.makeCodes(6, 1)).codes
    const a = t.newFamily('The Rivers')
    const b = t.newFamily('The Hills')
    await t.billing.graceCheckout(a, code, { returnUrl: 'https://x' })
    await t.billing.graceCheckout(a, code, { returnUrl: 'https://x' }) // (the same family again: fine)
    await expect(t.billing.graceCheckout(b, code, { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 423 })
    t.later(36 * 60_000) // (A's checkout expired at 30 minutes, unused)
    expect(await t.billing.graceCheckout(b, code, { returnUrl: 'https://x' })).toMatch(/^https:/)
    await expect(t.billing.graceCheckout(a, code, { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 423 })
  })

  it('the route: parents only, and the Parent Corner hears why a code was refused', async () => {
    const t = setup()
    const [code] = (await t.billing.makeCodes(6, 1)).codes
    const s = t.newFamily()
    const opts = { siteUrl: () => 'https://spiritflow.church', isOwner: () => false }
    const post = async (who, body) => {
      const res = fakeRes()
      await handleBilling(fakeReq({ body: Buffer.from(JSON.stringify(body)) }), res, new URL('http://x/billing/grace'), who, t.billing, opts)
      return res
    }
    expect((await post({ ...s, member: { ...s.member, role: 'grownup' } }, { code })).status).toBe(403)
    expect((await post(s, { code: 'GRACE6-ZZZZ-ZZZZ' })).status).toBe(404)
    const ok = await post(s, { code })
    expect(ok.status).toBe(200)
    expect(JSON.parse(ok.body).url).toMatch(/^https:\/\/checkout\.stripe\.com\//)
    expect(t.stripe.called('checkout.sessions.create')[0][1].success_url).toBe('https://spiritflow.church/?billing=done')
  })

  it('deleting the family keeps its code used, without saying by whom', async () => {
    const t = setup()
    const { code, fam, graceSub } = await graceFamily(t)
    await deliver(t.billing, event('customer.subscription.created', graceSub()))
    await t.billing.forget(fam)
    t.fams.deleteFamily(fam)
    expect(t.fams.db.prepare('SELECT used_by FROM grace_codes WHERE code = ?').get(code).used_by).toBe('deleted')
    await expect(t.billing.graceCheckout(t.newFamily('The Hills'), code, { returnUrl: 'https://x' })).rejects.toMatchObject({ status: 410 })
  })
})

describe('webhooks: each event, matched by Customer ID', () => {
  it('checkout.session.completed (paid) saves the plan, status and paid-through date', async () => {
    const t = setup({ enforced: true })
    const { fam, cus } = await withCustomer(t)
    expect(t.billing.access(fam).allowed).toBe(false)
    t.stripe.subs.sub_1 = sub('sub_1', cus, { end: SEC + 365 * DAY_S })
    expect(await deliver(t.billing, event('checkout.session.completed', session(cus, 'sub_1')))).toBe(200)
    expect(t.billing.status(fam)).toMatchObject({ plan: 'family-yearly', status: 'active', paidThrough: (SEC + 365 * DAY_S) * 1000 })
    expect(t.billing.access(fam)).toEqual({ allowed: true, enforced: true, reason: 'paid' })
  })

  it('a free week through Checkout counts too (no payment required)', async () => {
    const t = setup({ enforced: true })
    const { fam, cus } = await withCustomer(t)
    t.stripe.subs.sub_1 = sub('sub_1', cus, { status: 'trialing', trialEnd: SEC + 7 * DAY_S })
    await deliver(t.billing, event('checkout.session.completed', session(cus, 'sub_1', { payment_status: 'no_payment_required' })))
    expect(t.billing.status(fam)).toMatchObject({ status: 'trialing', paidThrough: (SEC + 7 * DAY_S) * 1000, trialUsed: true })
    expect(t.billing.access(fam).allowed).toBe(true)
  })

  it('a payment still on its way waits for checkout.session.async_payment_succeeded, which checks payment_status', async () => {
    const t = setup({ enforced: true })
    const { fam, cus } = await withCustomer(t)
    t.stripe.subs.sub_1 = sub('sub_1', cus)
    await deliver(t.billing, event('checkout.session.completed', session(cus, 'sub_1', { payment_status: 'unpaid' })))
    expect(t.billing.status(fam).status).toBeNull()
    expect(t.stripe.called('subscriptions.retrieve')).toHaveLength(0)
    await deliver(t.billing, event('checkout.session.async_payment_succeeded', session(cus, 'sub_1', { payment_status: 'unpaid' })))
    expect(t.billing.status(fam).status).toBeNull()
    await deliver(t.billing, event('checkout.session.async_payment_succeeded', session(cus, 'sub_1', { payment_status: 'paid' })))
    expect(t.billing.status(fam).status).toBe('active')
    expect(t.billing.access(fam).allowed).toBe(true)
  })

  it('matches by the Customer ID saved on the family, never by metadata', async () => {
    const t = setup({ enforced: true })
    const a = await withCustomer(t, 'The Rivers')
    const b = await withCustomer(t, 'The Hills')
    // (metadata naming family A, on family B's customer: B gets it)
    t.stripe.subs.sub_b = { ...sub('sub_b', b.cus), metadata: { arkpals_family: a.fam } }
    await deliver(t.billing, event('checkout.session.completed', session(b.cus, 'sub_b', { metadata: { arkpals_family: a.fam } })))
    expect(t.billing.status(b.fam).status).toBe('active')
    expect(t.billing.status(a.fam).status).toBeNull()
    // (a customer we don't know: acknowledged, and nothing changes)
    expect(await deliver(t.billing, event('customer.subscription.created', { ...sub('sub_z', 'cus_unknown'), metadata: { arkpals_family: a.fam } }))).toBe(200)
    expect(t.billing.status(a.fam).status).toBeNull()
  })

  it('customer.subscription.created, .updated and .deleted follow the plan through its life', async () => {
    const t = setup({ enforced: true })
    const { fam, cus } = await withCustomer(t)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_1', cus, { status: 'trialing', plan: 'family-monthly', trialEnd: SEC + 7 * DAY_S }), { created: SEC }))
    expect(t.billing.status(fam)).toMatchObject({ plan: 'family-monthly', status: 'trialing', paidThrough: (SEC + 7 * DAY_S) * 1000 })
    await deliver(t.billing, event('customer.subscription.updated', sub('sub_1', cus, { plan: 'family-monthly', end: SEC + 37 * DAY_S }), { created: SEC + 7 * DAY_S }))
    expect(t.billing.status(fam)).toMatchObject({ status: 'active', paidThrough: (SEC + 37 * DAY_S) * 1000 })
    // (switched to the Grace price on the billing page)
    await deliver(t.billing, event('customer.subscription.updated', sub('sub_1', cus, { plan: 'grace-monthly', end: SEC + 37 * DAY_S }), { created: SEC + 8 * DAY_S }))
    expect(t.billing.status(fam).plan).toBe('grace-monthly')
    // (cancelled: carries on to the end of what's paid)
    await deliver(t.billing, event('customer.subscription.updated', sub('sub_1', cus, { plan: 'grace-monthly', cancel: true, end: SEC + 37 * DAY_S }), { created: SEC + 9 * DAY_S }))
    expect(t.billing.status(fam).cancelAtPeriodEnd).toBe(true)
    expect(t.billing.access(fam).allowed).toBe(true)
    await deliver(t.billing, event('customer.subscription.deleted', sub('sub_1', cus, { status: 'canceled', plan: 'grace-monthly' }), { created: SEC + 37 * DAY_S }))
    expect(t.billing.status(fam).status).toBe('canceled')
    expect(t.billing.access(fam)).toEqual({ allowed: false, enforced: true, reason: 'none' })
  })

  it('an older event arriving late doesn’t undo a newer one', async () => {
    const t = setup({ enforced: true })
    const { fam, cus } = await withCustomer(t)
    await deliver(t.billing, event('customer.subscription.deleted', sub('sub_1', cus, { status: 'canceled' }), { created: SEC + 100 }))
    await deliver(t.billing, event('customer.subscription.created', sub('sub_1', cus), { created: SEC }))
    expect(t.billing.status(fam).status).toBe('canceled')
  })

  it('an old plan ending doesn’t end the new one', async () => {
    const t = setup({ enforced: true })
    const { fam, cus } = await withCustomer(t)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_new', cus), { created: SEC }))
    await deliver(t.billing, event('customer.subscription.deleted', sub('sub_old', cus, { status: 'canceled' }), { created: SEC + 10 }))
    expect(t.billing.status(fam).status).toBe('active')
  })

  it('a card being retried (past_due) keeps the game open; invoice.payment_failed and invoice.paid tell the parents', async () => {
    const t = setup({ enforced: true })
    const { fam, cus } = await withCustomer(t)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_1', cus, { plan: 'family-monthly', end: SEC + 30 * DAY_S })))
    await deliver(t.billing, event('invoice.payment_failed', invoice('in_1', cus, 'sub_1', { paid: 0 }), { created: SEC + 30 * DAY_S }))
    await deliver(t.billing, event('customer.subscription.updated', sub('sub_1', cus, { status: 'past_due', plan: 'family-monthly', end: SEC + 60 * DAY_S }), { created: SEC + 30 * DAY_S + 1 }))
    expect(t.billing.status(fam)).toMatchObject({ status: 'past_due', paymentFailed: (SEC + 30 * DAY_S) * 1000 })
    expect(t.billing.access(fam).allowed).toBe(true)
    await deliver(t.billing, event('invoice.paid', invoice('in_1', cus, 'sub_1', { paid: 999, end: SEC + 60 * DAY_S }), { created: SEC + 32 * DAY_S }))
    expect(t.billing.status(fam)).toMatchObject({ paymentFailed: null, paidThrough: (SEC + 60 * DAY_S) * 1000 })
    await deliver(t.billing, event('customer.subscription.updated', sub('sub_1', cus, { status: 'unpaid', plan: 'family-monthly', end: SEC + 60 * DAY_S }), { created: SEC + 50 * DAY_S }))
    expect(t.billing.access(fam).allowed).toBe(false)
  })

  it('invoice.paid only moves the paid-through date forward', async () => {
    const t = setup()
    const { fam, cus } = await withCustomer(t)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_1', cus, { end: SEC + 365 * DAY_S })))
    await deliver(t.billing, event('invoice.paid', invoice('in_old', cus, 'sub_1', { end: SEC + 10 * DAY_S })))
    expect(t.billing.status(fam).paidThrough).toBe((SEC + 365 * DAY_S) * 1000)
  })

  it('the same event twice is handled once', async () => {
    const t = setup()
    const { fam, cus } = await withCustomer(t)
    t.stripe.subs.sub_1 = sub('sub_1', cus)
    const evt = event('checkout.session.completed', session(cus, 'sub_1'))
    expect(await deliver(t.billing, evt)).toBe(200)
    expect(await deliver(t.billing, evt)).toBe(200)
    expect(t.stripe.called('subscriptions.retrieve')).toHaveLength(1)
    // (and the sponsor's code, below, is made once per invoice even if it comes as two different events)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_s', cus, { plan: 'sponsor-monthly', metadata: { arkpals: 'sponsor' } })))
    const paid = invoice('in_s1', cus, 'sub_s', { paid: 999, product: 'arkpals_sponsor', metadata: { arkpals: 'sponsor' } })
    const e1 = event('invoice.paid', paid)
    await deliver(t.billing, e1)
    await deliver(t.billing, e1)
    await deliver(t.billing, event('invoice.paid', paid))
    expect(t.billing.ownerSummary().codes).toHaveLength(1)
    expect(t.billing.exportFamily(fam).sponsoredCodes).toBe(1)
  })

  it('a failure answers 500 and isn’t marked done, so Stripe’s retry is handled', async () => {
    const t = setup()
    const { fam, cus } = await withCustomer(t)
    const evt = event('checkout.session.completed', session(cus, 'sub_later'))
    expect(await deliver(t.billing, evt)).toBe(500) // (Stripe can't find it yet)
    t.stripe.subs.sub_later = sub('sub_later', cus)
    expect(await deliver(t.billing, evt)).toBe(200)
    expect(t.billing.status(fam).status).toBe('active')
  })

  it('events we don’t handle are acknowledged', async () => {
    const { billing } = setup()
    expect(await deliver(billing, event('customer.created', { id: 'cus_1', object: 'customer' }))).toBe(200)
  })
})

describe('Sponsor a Family', () => {
  it('each paid invoice adds one Grace code to the owner’s pool, and the sponsor’s own plan is untouched', async () => {
    const t = setup({ enforced: true })
    const { fam, cus } = await withCustomer(t)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_s', cus, { plan: 'sponsor-monthly', metadata: { arkpals: 'sponsor' } })))
    expect(t.billing.status(fam)).toMatchObject({ sponsoring: true, status: null, plan: null })
    await deliver(t.billing, event('invoice.payment_failed', invoice('in_0', cus, 'sub_s', { paid: 0, product: 'arkpals_sponsor', metadata: { arkpals: 'sponsor' } })))
    expect(t.billing.status(fam).paymentFailed).toBeNull() // (a sponsorship's card isn't the family's plan)
    expect(t.billing.access(fam).allowed).toBe(false) // (sponsoring isn't a plan of their own)
    await deliver(t.billing, event('invoice.paid', invoice('in_1', cus, 'sub_s', { paid: 999, product: 'arkpals_sponsor', metadata: { arkpals: 'sponsor' } })))
    await deliver(t.billing, event('invoice.paid', invoice('in_2', cus, 'sub_s', { paid: 999, product: 'arkpals_sponsor', metadata: { arkpals: 'sponsor' } })))
    await deliver(t.billing, event('invoice.paid', invoice('in_3', cus, 'sub_s', { paid: 0, product: 'arkpals_sponsor', metadata: { arkpals: 'sponsor' } })))
    const codes = t.billing.ownerSummary().codes
    expect(codes).toHaveLength(2)
    expect(codes.every((c) => c.source === 'sponsor' && c.months === SPONSOR_CODE_MONTHS && /^GRACE6-/.test(c.code) && c.used === null)).toBe(true)
    expect(t.billing.status(fam).paidThrough).toBeNull()
    expect(t.billing.ownerSummary().sponsors).toBe(1)
  })

  it('is found by its product even before the subscription event arrives', async () => {
    const t = setup()
    const { cus } = await withCustomer(t)
    await deliver(t.billing, event('invoice.paid', invoice('in_1', cus, 'sub_s', { paid: 999, product: 'arkpals_sponsor', metadata: {} })))
    expect(t.billing.ownerSummary().codes).toHaveLength(1)
  })
})

describe('who may play', () => {
  it('with BILLING_ENFORCED off (the default), everyone', async () => {
    const t = setup()
    const s = t.newFamily()
    expect(t.billing.access(s.family.id)).toEqual({ allowed: true, enforced: false, reason: 'none' })
    expect(isOn(undefined)).toBe(false)
    expect(isOn('')).toBe(false)
    expect(isOn('0')).toBe(false)
    expect(isOn('1')).toBe(true)
    expect(isOn('true')).toBe(true)
  })

  it('enforced: the first family and comped families always, others with a plan', async () => {
    const t = setup({ enforced: true })
    expect(t.billing.access(t.fams.firstFamily())).toEqual({ allowed: true, enforced: true, reason: 'free' })
    const church = t.newFamily('Beta family').family.id
    expect(t.billing.access(church).allowed).toBe(false)
    t.billing.setComped(church, true)
    expect(t.billing.access(church)).toEqual({ allowed: true, enforced: true, reason: 'comped' })
    t.billing.setComped(church, false)
    expect(t.billing.access(church).allowed).toBe(false)
    expect(() => t.billing.setComped('fam_nope', true)).toThrow()
  })
})

describe('the owner’s dashboard', () => {
  it('counts families on each plan, with nothing about children', async () => {
    const t = setup()
    const a = await withCustomer(t, 'The Rivers')
    const b = await withCustomer(t, 'The Hills')
    t.newFamily('The Woods')
    t.billing.setComped(t.newFamily('Beta').family.id, true)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_a', a.cus, { plan: 'family-yearly' })))
    await deliver(t.billing, event('customer.subscription.created', sub('sub_b', b.cus, { status: 'trialing', plan: 'grace-monthly', trialEnd: SEC + 7 * DAY_S })))
    const o = t.billing.ownerSummary()
    expect(o.counts).toEqual({ free: 1, 'family-yearly': 1, trial: 1, none: 1, comped: 1 })
    expect(Object.keys(o.families[0]).sort()).toEqual(['comped', 'created', 'first', 'id', 'name', 'pastDue', 'sponsoring', 'status', 'what'])
  })

  it('makes batches of single-use Grace codes, for 6 or 12 months (kept here: nothing is made in Stripe)', async () => {
    const t = setup({ stripe: null })
    const made = await t.billing.makeCodes('12', '3', 'Grace Church')
    expect(made.codes).toHaveLength(3)
    expect(new Set(made.codes).size).toBe(3)
    expect(made.codes.every((c) => /^GRACE12-/.test(c))).toBe(true)
    expect(GRACE_MONTHS).toEqual([6, 12])
    expect(t.billing.ownerSummary().codes.map((c) => c.batch)).toEqual(['Grace Church', 'Grace Church', 'Grace Church'])
    await expect(t.billing.makeCodes(3, 1)).rejects.toMatchObject({ status: 400 })
    await expect(t.billing.makeCodes(6, 0)).rejects.toMatchObject({ status: 400 })
    await expect(t.billing.makeCodes(6, 101)).rejects.toMatchObject({ status: 400 })
    expect(graceCode(6)).toMatch(/^GRACE6-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/)
    expect(integrationId()).toMatch(/^arkpals-checkout-[a-z]{8}$/)
  })

  it('only the owner sees it; other grown-ups don’t see the plan', async () => {
    const t = setup()
    const owner = t.fams.session(t.fams.passwordDevice('iPad'))
    const other = t.newFamily()
    const opts = { siteUrl: () => 'https://spiritflow.church', isOwner: (s) => s.family.id === t.fams.firstFamily() && s.member.role === 'parent' }
    const page = fakeRes()
    await handleBilling(fakeReq({ method: 'GET' }), page, new URL('http://x/billing/owner'), owner, t.billing, opts)
    expect(page.status).toBe(200)
    expect(page.body).toContain('Make Grace codes')
    expect(page.body).toContain('no card')
    expect(page.body).not.toContain('promotion code')
    const no = fakeRes()
    await handleBilling(fakeReq({ method: 'GET' }), no, new URL('http://x/billing/owner'), other, t.billing, opts)
    expect(no.status).toBe(403)
    // (a grown-up who isn't a parent: whether to play, not the plan)
    const grownup = { ...other, member: { ...other.member, role: 'grownup' } }
    const g = fakeRes()
    await handleBilling(fakeReq({ method: 'GET' }), g, new URL('http://x/billing'), grownup, t.billing, opts)
    expect(Object.keys(JSON.parse(g.body)).sort()).toEqual(['allowed', 'checkedAt', 'enforced'])
    const p = fakeRes()
    await handleBilling(fakeReq({ method: 'GET' }), p, new URL('http://x/billing'), other, t.billing, opts)
    expect(JSON.parse(p.body).billing).toMatchObject({ free: false, plan: null })
    const pay = fakeRes()
    await handleBilling(fakeReq({ method: 'POST', body: Buffer.from('{"plan":"family-yearly"}') }), pay, new URL('http://x/billing/checkout'), grownup, t.billing, opts)
    expect(pay.status).toBe(403)
    // (a form posted from another site)
    const cross = fakeRes()
    await handleBilling(fakeReq({ method: 'POST', body: Buffer.from('family=x&comped=1'), headers: { origin: 'https://evil.example', host: 'spiritflow.church' } }), cross, new URL('http://x/billing/owner/comp'), owner, t.billing, opts)
    expect(cross.status).toBe(405)
  })

  it('takes our own forms, which browsers post with Origin: null (our pages send no referrer)', async () => {
    const t = setup()
    const owner = t.fams.session(t.fams.passwordDevice('iPad'))
    const opts = { siteUrl: () => 'https://spiritflow.church', isOwner: (s) => s.family.id === t.fams.firstFamily() && s.member.role === 'parent' }
    const ours = fakeRes()
    await handleBilling(fakeReq({ method: 'POST', body: Buffer.from('months=6&count=1&batch=Test'), headers: { origin: 'null', 'sec-fetch-site': 'same-origin', host: 'spiritflow.church' } }), ours, new URL('http://x/billing/owner/codes'), owner, t.billing, opts)
    expect(ours.status).toBe(200)
    expect(ours.body).toMatch(/GRACE6-/)
    expect(ours.body).toContain('I have a Grace code')
    const host = { host: 'spiritflow.church' }
    expect(sameOrigin({ headers: host })).toBe(true)
    expect(sameOrigin({ headers: { ...host, origin: 'https://spiritflow.church' } })).toBe(true)
    expect(sameOrigin({ headers: { ...host, origin: 'null', 'sec-fetch-site': 'cross-site' } })).toBe(false)
    expect(sameOrigin({ headers: { ...host, origin: 'null' } })).toBe(false)
    expect(sameOrigin({ headers: { ...host, origin: 'not a url' } })).toBe(false)
  })
})

describe('the family’s own data', () => {
  it('the download includes its billing', async () => {
    const t = setup()
    const { fam, cus } = await withCustomer(t)
    await deliver(t.billing, event('customer.subscription.created', sub('sub_1', cus)))
    const res = fakeRes()
    const none = async () => []
    const st = { backups: { list: none }, recordings: { list: none }, songs: { list: none }, stats: { get: async () => ({}) } }
    await writeFamilyExport(res, t.fams, fam, st, { billing: t.billing.exportFamily(fam) })
    const out = JSON.parse(res.body)
    expect(out.billing).toMatchObject({ stripeCustomer: cus, plan: 'family-yearly', status: 'active', subscription: 'sub_1' })
  })

  it('deleting the family cancels it in Stripe (deletes the Customer), and its billing goes with it', async () => {
    const t = setup()
    const { fam, cus } = await withCustomer(t)
    await t.billing.forget(fam)
    expect(t.stripe.called('customers.del')).toEqual([['customers.del', cus]])
    t.fams.deleteFamily(fam)
    expect(t.fams.db.prepare('SELECT COUNT(*) AS n FROM billing WHERE family_id = ?').get(fam).n).toBe(0)
    expect(t.billing.exportFamily(fam)).toBeNull()
  })

  it('a family that can’t be cancelled in Stripe isn’t deleted', async () => {
    const t = setup()
    const { fam } = await withCustomer(t)
    t.stripe.customers.del = async () => { throw Object.assign(new Error('Stripe is down'), { type: 'StripeConnectionError' }) }
    await expect(t.billing.forget(fam)).rejects.toMatchObject({ status: 502 })
  })
})

describe('npm run stripe-setup', () => {
  /** A Stripe that keeps what's made, so running setup twice can be checked. */
  function catalogStripe() {
    const made = { products: {}, prices: [], coupons: {}, portals: {}, hooks: [] }
    const calls = []
    let n = 0
    const missing = () => Object.assign(new Error('No such'), { code: 'resource_missing', statusCode: 404 })
    const log = (name, fn) => async (...a) => { calls.push(name); return fn(...a) }
    return {
      made, calls,
      products: {
        retrieve: log('products.retrieve', (id) => made.products[id] ?? (() => { throw missing() })()),
        create: log('products.create', (p) => (made.products[p.id] = { ...p })),
        update: log('products.update', (id, p) => Object.assign(made.products[id], p)),
      },
      prices: {
        list: log('prices.list', ({ lookup_keys }) => ({ data: made.prices.filter((p) => lookup_keys.includes(p.lookup_key)) })),
        create: log('prices.create', (p) => {
          if (p.transfer_lookup_key) for (const o of made.prices) if (o.lookup_key === p.lookup_key) o.lookup_key = null
          const { transfer_lookup_key, ...rest } = p
          const price = { id: `price_${++n}`, active: true, ...rest }
          made.prices.push(price)
          return price
        }),
        update: log('prices.update', (id, p) => Object.assign(made.prices.find((x) => x.id === id), p)),
      },
      coupons: {
        retrieve: log('coupons.retrieve', (id) => made.coupons[id] ?? (() => { throw missing() })()),
        create: log('coupons.create', (c) => (made.coupons[c.id] = { ...c })),
      },
      billingPortal: { configurations: {
        create: log('portal.create', (c) => { const id = `bpc_${++n}`; made.portals[id] = c; return { id } }),
        update: log('portal.update', (id, c) => { if (!made.portals[id]) throw missing(); made.portals[id] = c; return { id } }),
      } },
      webhookEndpoints: {
        list: log('hooks.list', () => ({ data: made.hooks })),
        create: log('hooks.create', (w) => { const h = { id: `we_${++n}`, ...w, secret: `whsec_made_${n}` }; made.hooks.push(h); return h }),
        update: log('hooks.update', (id, w) => Object.assign(made.hooks.find((h) => h.id === id), w)),
        del: log('hooks.del', (id) => { made.hooks = made.hooks.filter((h) => h.id !== id) }),
      },
    }
  }

  it('makes the catalog, the billing page and the webhook (no coupons: Grace codes are ours), and running it again changes nothing', async () => {
    const st = catalogStripe()
    const r1 = await setupStripe(st, { taxCode: 'txcd_10000000' })
    expect(Object.keys(st.made.products).sort()).toEqual(['arkpals_family', 'arkpals_grace', 'arkpals_sponsor'])
    expect(st.made.products.arkpals_family).toMatchObject({ name: 'Ark Pals Family', tax_code: 'txcd_10000000' })
    const byKey = Object.fromEntries(st.made.prices.map((p) => [p.lookup_key, p]))
    expect(byKey.arkpals_family_monthly).toMatchObject({ product: 'arkpals_family', unit_amount: 999, currency: 'usd', recurring: { interval: 'month' }, tax_behavior: 'exclusive' })
    expect(byKey.arkpals_family_yearly).toMatchObject({ product: 'arkpals_family', unit_amount: 7900, recurring: { interval: 'year' } })
    expect(byKey.arkpals_grace_monthly).toMatchObject({ product: 'arkpals_grace', unit_amount: 499 })
    expect(byKey.arkpals_sponsor_monthly).toMatchObject({ product: 'arkpals_sponsor', unit_amount: 999 })
    expect(st.made.coupons).toEqual({})
    expect(st.made.hooks).toHaveLength(1)
    expect(st.made.hooks[0]).toMatchObject({ url: 'https://spiritflow.church/stripe/webhook', enabled_events: WEBHOOK_EVENTS, api_version: API_VERSION })
    expect(r1.webhookSecret).toBe(st.made.hooks[0].secret)
    expect(st.made.portals[r1.portalConfig].features.subscription_cancel).toEqual({ enabled: true, mode: 'at_period_end' })

    const before = st.made.prices.length
    const r2 = await setupStripe(st, { taxCode: 'txcd_10000000', portalConfig: r1.portalConfig, haveWebhookSecret: true })
    expect(st.made.prices.length).toBe(before)
    expect(st.made.hooks).toHaveLength(1)
    expect(r2.webhookSecret).toBeNull()
    expect(r2.portalConfig).toBe(r1.portalConfig)
    expect(st.calls.filter((c) => c === 'products.create' || c === 'coupons.create')).toHaveLength(3)
  })

  it('a changed price takes over the lookup key; a lost webhook secret makes the webhook again', async () => {
    const st = catalogStripe()
    await setupStripe(st)
    st.made.prices.find((p) => p.lookup_key === 'arkpals_family_monthly').unit_amount = 899 // (as if the amount had been different)
    const r = await setupStripe(st, { haveWebhookSecret: false })
    const now = st.made.prices.filter((p) => p.lookup_key === 'arkpals_family_monthly')
    expect(now).toHaveLength(1)
    expect(now[0].unit_amount).toBe(999)
    expect(st.made.prices.filter((p) => !p.active)).toHaveLength(1)
    expect(st.made.hooks).toHaveLength(1)
    expect(r.webhookSecret).toBe(st.made.hooks[0].secret)
  })

  it('refuses a tax code that isn’t one, and sets none when there isn’t one', async () => {
    await expect(setupStripe(catalogStripe(), { taxCode: 'digital' })).rejects.toThrow(/txcd_/)
    const st = catalogStripe()
    await setupStripe(st)
    expect(st.made.products.arkpals_family).not.toHaveProperty('tax_code')
  })
})

/** Enough of a request: its method, headers and body. */
function fakeReq({ method = 'POST', body = Buffer.alloc(0), headers = {} } = {}) {
  return { method, headers: { host: 'spiritflow.church', ...headers }, async *[Symbol.asyncIterator]() { if (body.length) yield body } }
}
function fakeRes() {
  const res = new EventEmitter()
  res.body = ''
  res.writeHead = (status, headers) => { res.status = status; res.headers = headers }
  res.write = (c) => { res.body += c; return true }
  res.end = (c) => { if (c) res.body += c; res.ended = true }
  return res
}
