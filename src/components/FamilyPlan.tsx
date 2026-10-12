// Parent Corner: the family's plan (server/billing.mjs), for parents only. Choosing a plan goes to Stripe's
// checkout (yearly first; the Grace price offered kindly, no questions asked); Stripe's billing page cancels,
// changes the card or plan, and has the receipts. A Grace code from a church gives free months with no card at
// all, and the plan simply ends when they do (a gentle note says so first). Nothing about the children is sent
// to Stripe.
import { useEffect, useState } from 'react'
import './FamilyPlan.css'
import { billingApi, dollars, graceStage, type BillingStatus, type PlanId } from '../lib/billing'
import { useFamilyAccount } from '../lib/family'

const day = (t: number) => new Date(t).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
const PLAN_NAMES: Record<string, string> = {
  'family-yearly': 'Family plan, yearly', 'family-monthly': 'Family plan, monthly', 'grace-monthly': 'Family plan, Grace price',
}

/** Why a Grace code was refused, by the server's answer. */
const CODE_REFUSED: Record<number, string> = {
  404: 'That code doesn’t look right. Check it and try again.',
  410: 'That code has already been used. Whoever gave it to you may have another.',
  423: 'That code is at a checkout right now. If it’s yours, try again in half an hour.',
  429: 'That’s a lot of tries. Please wait an hour, then try again.',
}

/** What the family has now, in a sentence or two. */
function Current({ b }: { b: BillingStatus }) {
  const name = PLAN_NAMES[b.plan ?? ''] ?? 'Family plan'
  const until = b.paidThrough ? day(b.paidThrough) : null
  const grace = graceStage(b, Date.now())
  if (grace === 'free' || grace === 'ending') {
    const monthly = b.plans.find((p) => p.id === 'family-monthly')
    return (
      <>
        <p><b>Family plan, a gift from a Grace code</b>{' · '}free{until ? ` until ${until}` : ''}</p>
        <p className="muted">No card, and no charge. When the free months end, the plan simply ends.</p>
        {grace === 'ending' && (
          <p className="plan-note">
            Your free months end{until ? ` on ${until}` : ' soon'}. We hope they&rsquo;ve been a blessing to your family.
            Nothing will be charged. To keep playing after that, you can add a card on the billing page and the plan carries
            on{monthly ? ` at ${dollars(monthly.amount)} a month` : ''}, or, once they&rsquo;ve ended, choose a plan here or enter another Grace code.
          </p>
        )}
      </>
    )
  }
  return (
    <>
      <p><b>{name}</b>{' · '}
        {b.status === 'trialing' ? `free week${until ? ` until ${until}` : ''}${b.cancelAtPeriodEnd ? ', then it ends' : ''}`
          : b.cancelAtPeriodEnd ? `ends ${until ?? 'at the end of what’s paid'}`
          : until ? `renews ${until}` : 'active'}
      </p>
      {(b.status === 'past_due' || b.paymentFailed) && (
        <p className="warn">The last payment didn&rsquo;t go through. Stripe will try again; you can update the card on the billing page. Everyone can keep playing meanwhile.</p>
      )}
    </>
  )
}

export default function FamilyPlan() {
  const { view } = useFamilyAccount()
  const [b, setB] = useState<BillingStatus | null>(null)
  const [busy, setBusy] = useState('')
  const [status, setStatus] = useState('')
  const [code, setCode] = useState('')
  useEffect(() => { billingApi.status().then(setB) }, [])
  if (!b) return null // (offline, or not a parent)

  const go = async (what: string, get: () => Promise<string>) => {
    setBusy(what)
    setStatus('')
    try {
      location.assign(await get())
    } catch (e) {
      setBusy('')
      const code = (e as { status?: number }).status ?? 0
      setStatus(code === 409 ? 'Your family already has a plan. Use the billing page to change it.'
        : what === 'grace' && CODE_REFUSED[code] ? CODE_REFUSED[code]
        : 'Couldn’t reach Stripe just now. Try again in a moment.')
    }
  }
  const price = (id: PlanId) => b.plans.find((p) => p.id === id)
  const pick = (id: PlanId, label: string) => (
    <button disabled={!!busy || !b.stripeOn} onClick={() => go(id, () => billingApi.checkout(id))}>{busy === id ? 'Opening…' : label}</button>
  )
  const has = ['active', 'trialing', 'past_due'].includes(b.status ?? '')
  const yearly = price('family-yearly'), monthly = price('family-monthly'), grace = price('grace-monthly'), sponsor = price('sponsor-monthly')

  return (
    <section className="family-plan">
      <h3>Your family&rsquo;s plan</h3>
      {b.free ? <p>Your family plays free: this is the site&rsquo;s own family.</p>
        : b.comped ? <p>Your family plays free, with our thanks for helping test Ark Pals.</p>
        : has ? <Current b={b} />
        : (
          <>
            {graceStage(b, Date.now()) === 'ended' && (
              <p className="plan-note">Your free months from a Grace code have ended. We hope they were a blessing to your family. Choose a plan below, or enter another Grace code.</p>
            )}
            <p>One plan covers the whole family, with up to 4 players.{!b.trialUsed && ' The first 7 days are free.'} Cancel any time.</p>
            <div className="plan-choices">
              {yearly && <div className="plan-choice best"><b>{dollars(yearly.amount)} a year</b><span>About {dollars(Math.round(yearly.amount / 12))} a month: the best value</span>{pick('family-yearly', 'Choose yearly')}</div>}
              {monthly && <div className="plan-choice"><b>{dollars(monthly.amount)} a month</b><span>Pay as you go</span>{pick('family-monthly', 'Choose monthly')}</div>}
            </div>
            {grace && (
              <div className="plan-grace">
                <p><b>This price helps our family right now:</b> {dollars(grace.amount)} a month, for everything. No questions asked.</p>
                {pick('grace-monthly', `Choose ${dollars(grace.amount)} a month`)}
              </div>
            )}
            <form className="grace-code" onSubmit={(e) => { e.preventDefault(); if (code.trim()) go('grace', () => billingApi.grace(code)) }}>
              <label>
                <span>I have a Grace code</span>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="GRACE6-XXXX-XXXX" maxLength={24}
                  autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false} />
              </label>
              <button disabled={!!busy || !b.stripeOn || !code.trim()}>{busy === 'grace' ? 'Opening…' : 'Use my code'}</button>
            </form>
            <p className="muted">A Grace code from your church gives 6 or 12 months free, with no card. When they end, the plan simply ends.</p>
          </>
        )}
      <div className="level-row">
        {b.billingPage && <button disabled={!!busy || !b.stripeOn} onClick={() => go('portal', billingApi.portal)}>{busy === 'portal' ? 'Opening…' : '💳 Billing page: card, receipts, cancel'}</button>}
        {sponsor && !b.sponsoring && pick('sponsor-monthly', `💝 Sponsor a family: ${dollars(sponsor.amount)} a month`)}
        {view?.owner && <a className="button-link" href="/billing/owner">📒 Billing, all families</a>}
      </div>
      {b.sponsoring && <p>💝 Thank you for sponsoring a family. Each month, a family who needs it gets Ark Pals free.</p>}
      {!b.sponsoring && sponsor && <p className="muted">Sponsoring gives one family a free Grace code each month, through children&rsquo;s ministries.</p>}
      {!b.stripeOn && <p className="muted">Plans aren&rsquo;t set up on this server yet.</p>}
      {!b.enforced && !b.free && !b.comped && !has && <p className="muted">Plans are still being tested: everyone can play for now.</p>}
      {status && <p className="warn">{status}</p>}
      <p className="muted">Payments are handled by Stripe. Ark Pals never sees your card, and nothing about your children is shared.</p>
    </section>
  )
}
