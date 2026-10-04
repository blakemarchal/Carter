// Email: sign-in links and invitations, sent through Resend (https://resend.com). Optional: without
// RESEND_API_KEY the game works as before, and grown-ups share links by hand. No dependencies.
//   RESEND_API_KEY   a Resend key with sending access (npm run set-email-key)
//   EMAIL_FROM       who it's from, on a domain verified in Resend: "Ark Pals <hello@spiritflow.church>"
//   EMAIL_OUTBOX     for tests only: write each email to this file (one JSON per line) instead of sending
import { appendFileSync } from 'node:fs'

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** A mailer, or null when email isn't set up. */
export function createMailer({ apiKey, from, outbox, fetchImpl = fetch } = {}) {
  if (outbox) {
    return { send: async (m) => { appendFileSync(outbox, JSON.stringify({ from: from ?? 'Ark Pals <test@localhost>', ...m }) + '\n') } }
  }
  if (!apiKey || !from) return null
  return {
    async send({ to, subject, text, html }) {
      const r = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [to], subject, text, html }),
      })
      if (!r.ok) throw new Error(`email not sent: ${r.status} ${(await r.text()).slice(0, 200)}`)
    },
  }
}

/** A short, friendly email in the game's colors, with one big button. */
function page(lines, button, link, foot) {
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#fff0f7;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#3b2a4a">
<div style="max-width:440px;margin:0 auto;background:#fff;border-radius:24px;padding:28px 24px;text-align:center">
<div style="font-size:28px;font-weight:800;color:#e2468f;margin-bottom:12px">🌈 Ark Pals</div>
${lines.map((l) => `<p style="font-size:17px;line-height:1.5;margin:0 0 14px">${l}</p>`).join('\n')}
<a href="${esc(link)}" style="display:inline-block;margin:8px 0 16px;padding:14px 26px;background:#ff6fae;color:#fff;font-size:19px;font-weight:700;border-radius:14px;text-decoration:none">${esc(button)}</a>
<p style="font-size:13px;color:#8a7a99;line-height:1.5;margin:0">${foot}</p>
</div></body></html>`
  return html
}
const plain = (lines) => lines.map((l) => l.replace(/<[^>]+>/g, '')).join('\n\n')

/** "Here's your sign-in link." */
export function signInEmail({ link, name, family }) {
  const lines = [`Hi ${esc(name)}! Here's your link to sign in to <b>${esc(family)}</b> on Ark Pals.`]
  const foot = 'It works once, for 30 minutes, on the device you open it on. If you didn\'t ask for it, you can ignore this email.'
  return {
    subject: 'Your Ark Pals sign-in link',
    text: `${plain(lines)}\n\n${link}\n\n${foot}`,
    html: page(lines, 'Sign in', link, foot),
  }
}

/** "You're invited to join <family> on Ark Pals." */
export function inviteEmail({ link, name, family, from }) {
  const lines = [
    `Hi ${esc(name)}! ${esc(from)} invited you to join <b>${esc(family)}</b> on Ark Pals, a Bible adventure game for kids.`,
    'Open this on your phone or tablet and tap Join.',
  ]
  const foot = 'The link works once, for 7 days. On an iPhone or iPad, the page it opens shows how to put Ark Pals on your Home Screen.'
  return {
    subject: `${from} invited you to Ark Pals`,
    text: `${plain(lines)}\n\n${link}\n\n${foot}`,
    html: page(lines, 'Join the family', link, foot),
  }
}
