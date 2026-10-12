// The family's plan (server/billing.mjs). The game asks the server whether the family may play when it's
// online, keeps the answer on the device, and keeps playing for 7 days offline after its last good answer.
// While the server isn't enforcing plans (BILLING_ENFORCED off, the default), nothing is ever blocked.
import { useCallback, useEffect, useState } from 'react'
import { NS } from './storageKeys'

/** Days the game keeps playing offline after its last good check. */
export const OFFLINE_DAYS = 7
const DAY = 24 * 3600_000
/** Not part of a backup: this device's last answer from the server. */
const ACCESS_KEY = `${NS}-billing:access`

/** The server's answer, and when this device got it. */
export interface AccessCheck { allowed: boolean; enforced: boolean; checkedAt: number }
export type Access = { allowed: true } | { allowed: false; why: 'no-plan' | 'offline-too-long' }

/** The family's plan, as parents see it in the Parent Corner. */
export interface BillingStatus {
  stripeOn: boolean
  enforced: boolean
  /** The site's own family: always free. */
  free: boolean
  comped: boolean
  plan: string | null
  /** Stripe's subscription status: trialing, active, past_due, canceled… */
  status: string | null
  paidThrough: number | null
  /** The plan came from a Grace code: free for its months, with no card, and then it simply ends. */
  grace: boolean
  cancelAtPeriodEnd: boolean
  trialUsed: boolean
  paymentFailed: number | null
  sponsoring: boolean
  /** Whether the family can open Stripe's billing page (it has been to Checkout). */
  billingPage: boolean
  plans: { id: PlanId; amount: number; interval: 'month' | 'year'; label: string }[]
}
export type PlanId = 'family-yearly' | 'family-monthly' | 'grace-monthly' | 'sponsor-monthly'

/** How long before a Grace code's free months end the Parent Corner says so. */
export const GRACE_NOTE_DAYS = 14

/**
 * What to tell a family on a Grace code: 'free' (the free months, no card), 'ending' (they end within
 * GRACE_NOTE_DAYS), 'ended' (they have, and the plan with them), or null (not on a Grace code).
 */
export function graceStage(b: Pick<BillingStatus, 'grace' | 'status' | 'paidThrough'>, now: number): 'free' | 'ending' | 'ended' | null {
  if (!b.grace) return null
  if (b.status === 'trialing') return b.paidThrough && b.paidThrough - now <= GRACE_NOTE_DAYS * DAY ? 'ending' : 'free'
  if (b.status === 'canceled' || b.status === 'incomplete_expired') return 'ended'
  return null // (they added a card, and the plan carries on as any other)
}

/**
 * Whether the game opens, from the last answer the server gave (`last`, null if it never has). Never
 * blocks while plans aren't enforced, or on a device that has never been able to ask.
 */
export function decideAccess(last: AccessCheck | null, now: number): Access {
  if (!last || !last.enforced) return { allowed: true }
  if (!last.allowed) return { allowed: false, why: 'no-plan' }
  if (now - last.checkedAt > OFFLINE_DAYS * DAY) return { allowed: false, why: 'offline-too-long' }
  return { allowed: true }
}

export function savedCheck(): AccessCheck | null {
  try {
    const v = JSON.parse(localStorage.getItem(ACCESS_KEY) ?? 'null')
    return v && typeof v.allowed === 'boolean' && typeof v.enforced === 'boolean' && typeof v.checkedAt === 'number' ? v : null
  } catch {
    return null
  }
}

/** Asks the server (when online). Returns the new answer, or null if it couldn't be asked: the saved one stands. */
export async function checkAccess(): Promise<AccessCheck | null> {
  try {
    const r = await fetch('/billing', { cache: 'no-store', signal: AbortSignal.timeout(8000) })
    if (!r.ok) return null // (signed out, or an older server: as if offline)
    const b = await r.json()
    if (typeof b.allowed !== 'boolean') return null
    const check = { allowed: b.allowed, enforced: !!b.enforced, checkedAt: Date.now() }
    try { localStorage.setItem(ACCESS_KEY, JSON.stringify(check)) } catch { /* storage full: next time */ }
    return check
  } catch {
    return null
  }
}

/** Whether the game opens now: checked when the app starts, comes back on screen, and every half hour. */
export function useAccess() {
  const [access, setAccess] = useState<Access>(() => decideAccess(savedCheck(), Date.now()))
  const recheck = useCallback(async () => {
    await checkAccess()
    setAccess(decideAccess(savedCheck(), Date.now()))
  }, [])
  useEffect(() => {
    // (back from Stripe's checkout or billing page: ?billing=done or ?billing=back)
    if (new URLSearchParams(location.search).has('billing')) history.replaceState(null, '', location.pathname + location.hash)
    recheck()
    const onShow = () => { if (!document.hidden) recheck() }
    document.addEventListener('visibilitychange', onShow)
    const t = setInterval(recheck, 30 * 60_000)
    return () => { document.removeEventListener('visibilitychange', onShow); clearInterval(t) }
  }, [recheck])
  return { access, recheck }
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body ?? {}) })
  if (!r.ok) throw Object.assign(new Error(`POST ${path}: ${r.status}`), { status: r.status })
  return r.json()
}

export const billingApi = {
  /** The family's plan (parents), or null offline or for grown-ups who aren't parents. */
  async status(): Promise<BillingStatus | null> {
    try {
      const r = await fetch('/billing', { cache: 'no-store' })
      return r.ok ? ((await r.json()).billing ?? null) : null
    } catch {
      return null
    }
  },
  /** Stripe Checkout for a plan: its address, to go to. */
  checkout: (plan: PlanId) => post<{ url: string }>('/billing/checkout', { plan }).then((r) => r.url),
  /** Stripe Checkout for a Grace code (no card): its address. Refused with 404, 410, 423 or 429 (see FamilyPlan). */
  grace: (code: string) => post<{ url: string }>('/billing/grace', { code }).then((r) => r.url),
  /** Stripe's billing page (cancel, card, plan, receipts): its address. */
  portal: () => post<{ url: string }>('/billing/portal').then((r) => r.url),
}

/** "$9.99", "$79". */
export const dollars = (cents: number) => `$${cents % 100 ? (cents / 100).toFixed(2) : cents / 100}`
