// Public sign-up (server/landing.mjs, POST /signup, /start/<token>): a parent's emailed link starts their family,
// with the names they gave, the email the link went to, and their agreement kept on the family.
import { describe, expect, it } from 'vitest'
import { signupEmail } from './email.mjs'
import { openFamilies } from './families.mjs'
import { landingPage } from './landing.mjs'

const DAY = 24 * 3600_000
function fresh() {
  let t = Date.UTC(2026, 9, 13)
  const fams = openFamilies(':memory:', { clock: () => t })
  return { fams, later: (ms) => { t += ms } }
}

describe('a sign-up link', () => {
  it('keeps what the parent gave, and starts their family with it, once', () => {
    const { fams } = fresh()
    const link = fams.makeLink({ kind: 'signup', name: 'Jo', familyName: 'The Smiths', email: 'Jo@Example.com', madeBy: 'sign-up' })
    expect(fams.peekLink(link.token)).toMatchObject({ kind: 'signup', name: 'Jo', familyName: 'The Smiths', email: 'jo@example.com' })
    const dev = fams.useLink(link.token, { label: 'iPad' })
    const s = fams.session(dev)
    expect(s.family.name).toBe('The Smiths')
    expect(s.family.id).not.toBe(fams.firstFamily())
    expect(s.member).toMatchObject({ name: 'Jo', role: 'parent' })
    expect(fams.memberByEmail('jo@example.com')?.family.id).toBe(s.family.id)
    expect(fams.useLink(link.token, { label: 'iPad' })).toBeNull()
  })

  it('the parent can change the names on the page their link opens, but not the email', () => {
    const { fams } = fresh()
    const link = fams.makeLink({ kind: 'signup', name: 'Jo', familyName: 'The Smiths', email: 'jo@example.com' })
    const dev = fams.useLink(link.token, { label: 'iPad', familyName: 'The Smith Family', yourName: 'Mom', yourEmail: 'someone@else.com' })
    const s = fams.session(dev)
    expect(s.family.name).toBe('The Smith Family')
    expect(s.member.name).toBe('Mom')
    expect(fams.memberByEmail('jo@example.com')?.member.id).toBe(s.member.id)
    expect(fams.memberByEmail('someone@else.com')).toBeNull()
  })

  it('records how and when the parent agreed, on the family', () => {
    const { fams } = fresh()
    const link = fams.makeLink({ kind: 'signup', name: 'Jo', familyName: 'The Smiths', email: 'jo@example.com' })
    const s = fams.session(fams.useLink(link.token, { label: 'iPad' }))
    const consent = fams.consentOf(s.family.id)
    expect(consent).toMatchObject({ how: expect.stringContaining('confirmed by email') })
    expect(consent.at).toBe(Date.UTC(2026, 9, 13))
  })

  it('works for a day, needs a real email, and a family link (from the owner) records no agreement', () => {
    const { fams, later } = fresh()
    expect(() => fams.makeLink({ kind: 'signup', name: 'Jo', familyName: 'The Smiths', email: 'not an email' })).toThrow()
    const link = fams.makeLink({ kind: 'signup', name: 'Jo', familyName: 'The Smiths', email: 'jo@example.com' })
    later(DAY + 1)
    expect(fams.peekLink(link.token)).toBeNull()
    const owner = fams.makeLink({ kind: 'family' })
    const s = fams.session(fams.useLink(owner.token, { label: 'iPad', familyName: 'The Lees', yourName: 'Sam' }))
    expect(fams.consentOf(s.family.id)).toBeNull()
  })
})

describe('the sign-up email', () => {
  it('has the link, says how long it works, and escapes the names', () => {
    const m = signupEmail({ link: 'https://arkpals.world/start/abc', name: 'Jo <b>', family: 'The Smiths' })
    expect(m.subject).toBe('Start your family on Ark Pals')
    expect(m.text).toContain('https://arkpals.world/start/abc')
    expect(m.text).toContain('24 hours')
    expect(m.html).not.toContain('<b>Jo')
    expect(m.html).toContain('Jo &lt;b&gt;')
  })
})

describe('the front page', () => {
  it('offers sign-up when it is open, and an invitation note when it is not', () => {
    const open = landingPage({ open: true, email: true })
    expect(open).toContain('action="/signup')
    expect(open).toContain('name="consent"')
    expect(open).toContain('href="/terms"')
    const closed = landingPage({ open: false, email: true })
    expect(closed).not.toContain('action="/signup')
    expect(closed).toContain('by invitation')
  })

  it('shows a mistake with what was typed, escaped, and the check-your-email note after', () => {
    const again = landingPage({ open: true, email: true, form: { values: { family: '"><script>', you: 'Jo', email: 'jo@example.com' }, msg: 'Please tick the box' } })
    expect(again).toContain('Please tick the box')
    expect(again).not.toContain('"><script>')
    expect(landingPage({ open: true, email: true, signedUpTo: 'jo@example.com' })).toContain('Check your email')
  })
})
