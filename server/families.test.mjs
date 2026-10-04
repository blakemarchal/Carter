// Families: the first family (from the old shared password), invitations, devices, and who can do what.
import { describe, expect, it } from 'vitest'
import { cleanLook, cleanName, openFamilies } from './families.mjs'

const DAY = 24 * 3600_000
function fresh() {
  let t = Date.UTC(2026, 9, 4)
  const fams = openFamilies(':memory:', { clock: () => t })
  return { fams, later: (ms) => { t += ms } }
}

describe('families', () => {
  it('starts with the first family, which the old family password signs into as its parents', () => {
    const { fams } = fresh()
    const dev = fams.passwordDevice('iPad')
    const s = fams.session(dev)
    expect(s.family.id).toBe(fams.firstFamily())
    expect(s.member.role).toBe('parent')
    expect(s.device.label).toBe('iPad')
  })

  it('an old sign-in cookie is always the same device, and stays out once signed out', () => {
    const { fams } = fresh()
    const fam = fams.firstFamily()
    const dev = fams.passwordDevice('iPad', 'old-cookie-1')
    expect(fams.passwordDevice('iPad', 'old-cookie-1')).toBe(dev) // (an app asking twice at once)
    expect(fams.passwordDevice('Mac', 'old-cookie-2')).not.toBe(dev)
    expect(fams.view(fam, dev).devices).toHaveLength(2)
    fams.removeDevice(fam, dev)
    expect(fams.passwordDevice('iPad', 'old-cookie-1')).toBeNull()
  })

  it('the family password still works after the grown-ups it was for are replaced', () => {
    const { fams } = fresh()
    const fam = fams.firstFamily()
    const first = fams.session(fams.passwordDevice('iPad')).member.id
    const mom = fams.session(fams.useLink(fams.makeLink({ kind: 'member', familyId: fam, name: 'Mom', role: 'parent' }).token, { label: 'iPhone' })).member.id
    expect(fams.removeMember(fam, first)).toBe(true)
    expect(fams.session(fams.passwordDevice('Mac')).member.id).toBe(mom)
  })

  it('notes when a device is used, and names it better than its browser did', () => {
    const { fams, later } = fresh()
    const fam = fams.firstFamily()
    const dev = fams.passwordDevice('Mac')
    expect(fams.seen(dev)).toBe(false) // (just made)
    later(11 * 60_000)
    expect(fams.seen(dev)).toBe(true)
    expect(fams.seen(dev)).toBe(false)
    fams.relabelDevice(fam, dev, 'iPad')
    expect(fams.session(dev).device.label).toBe('iPad')
  })

  it('an invitation brings a new grown-up in, once', () => {
    const { fams } = fresh()
    const fam = fams.firstFamily()
    const link = fams.makeLink({ kind: 'member', familyId: fam, name: 'Nana', role: 'grownup' })
    expect(fams.peekLink(link.token)).toMatchObject({ kind: 'member', name: 'Nana', family: { id: fam } })
    const dev = fams.useLink(link.token, { label: 'iPhone' })
    expect(fams.session(dev).member).toMatchObject({ name: 'Nana', role: 'grownup' })
    expect(fams.useLink(link.token, { label: 'another' })).toBeNull() // used up
    expect(fams.peekLink(link.token)).toBeNull()
    expect(fams.view(fam, dev).members.map((m) => m.name)).toEqual(['Grown-ups', 'Nana'])
  })

  it('links stop working when they expire, and a wrong token never works', () => {
    const { fams, later } = fresh()
    const link = fams.makeLink({ kind: 'member', familyId: fams.firstFamily(), name: 'Paw Paw', role: 'grownup' })
    expect(fams.peekLink('not-a-token')).toBeNull()
    later(8 * DAY)
    expect(fams.peekLink(link.token)).toBeNull()
    expect(fams.useLink(link.token, { label: 'x' })).toBeNull()
  })

  it('signs another device in as the same grown-up', () => {
    const { fams } = fresh()
    const first = fams.passwordDevice('iPad')
    const me = fams.session(first).member
    const link = fams.makeLink({ kind: 'device', familyId: fams.firstFamily(), memberId: me.id })
    const second = fams.useLink(link.token, { label: 'Windows computer' })
    expect(fams.session(second).member.id).toBe(me.id)
  })

  it('starts a new family from a site owner link, with its own data and nobody else in it', () => {
    const { fams } = fresh()
    const link = fams.makeLink({ kind: 'family' })
    const dev = fams.useLink(link.token, { label: 'iPad', familyName: 'The Smiths', yourName: 'Jo' })
    const s = fams.session(dev)
    expect(s.family.name).toBe('The Smiths')
    expect(s.family.id).not.toBe(fams.firstFamily())
    expect(s.member).toMatchObject({ name: 'Jo', role: 'parent' })
    expect(fams.view(s.family.id, dev).members).toHaveLength(1)
  })

  it('a bad family name leaves the link unused', () => {
    const { fams } = fresh()
    const link = fams.makeLink({ kind: 'family' })
    expect(() => fams.useLink(link.token, { label: 'iPad', familyName: '   ', yourName: 'Jo' })).toThrow()
    expect(fams.peekLink(link.token)).not.toBeNull()
  })

  it('signing a device out, removing a grown-up, and cancelling an invitation', () => {
    const { fams } = fresh()
    const fam = fams.firstFamily()
    const mine = fams.passwordDevice('iPad')
    const nana = fams.useLink(fams.makeLink({ kind: 'member', familyId: fam, name: 'Nana', role: 'grownup' }).token, { label: 'iPhone' })
    const nanaId = fams.session(nana).member.id
    expect(fams.removeDevice(fam, nana)).toBe(true)
    expect(fams.session(nana)).toBeNull()
    const again = fams.useLink(fams.makeLink({ kind: 'device', familyId: fam, memberId: nanaId }).token, { label: 'iPad' })
    expect(fams.removeMember(fam, nanaId)).toBe(true)
    expect(fams.session(again)).toBeNull() // her devices go with her
    const inv = fams.makeLink({ kind: 'member', familyId: fam, name: 'Paw Paw', role: 'grownup' })
    expect(fams.view(fam, mine).invites.map((i) => i.name)).toEqual(['Paw Paw'])
    expect(fams.cancelLink(fam, inv.id)).toBe(true)
    expect(fams.peekLink(inv.token)).toBeNull()
  })

  it('a family always keeps a parent, and families only touch their own people', () => {
    const { fams } = fresh()
    const fam = fams.firstFamily()
    const parent = fams.session(fams.passwordDevice('iPad')).member.id
    expect(() => fams.removeMember(fam, parent)).toThrow()
    const other = fams.useLink(fams.makeLink({ kind: 'family' }).token, { label: 'iPad', familyName: 'Others', yourName: 'Sam' })
    const otherFam = fams.session(other).family.id
    expect(fams.removeDevice(otherFam, fams.passwordDevice('Mac'))).toBe(false) // not theirs
    expect(fams.removeMember(otherFam, parent)).toBe(false)
  })

  it('a grown-up can keep an email for sign-in links: one grown-up per address', () => {
    const { fams } = fresh()
    const fam = fams.firstFamily()
    const dad = fams.session(fams.passwordDevice('iPad')).member.id
    fams.updateMember(fam, dad, { email: '  Dad@Example.com ' })
    expect(fams.memberByEmail('dad@example.com')).toMatchObject({ member: { id: dad }, family: { id: fam } })
    expect(fams.memberByEmail('nobody@example.com')).toBeNull()
    expect(fams.memberByEmail('not an email')).toBeNull()
    const other = fams.useLink(fams.makeLink({ kind: 'family' }).token, { label: 'iPad', familyName: 'Others', yourName: 'Sam' })
    const s = fams.session(other)
    expect(() => fams.updateMember(s.family.id, s.member.id, { email: 'DAD@example.com' })).toThrow(expect.objectContaining({ status: 409 }))
    expect(() => fams.updateMember(fam, dad, { email: 'nope' })).toThrow(expect.objectContaining({ status: 400 }))
    fams.updateMember(fam, dad, { email: '' })
    expect(fams.memberByEmail('dad@example.com')).toBeNull()
  })

  it("an emailed invitation's address becomes the new grown-up's, and a sign-in link can be short", () => {
    const { fams, later } = fresh()
    const fam = fams.firstFamily()
    const nana = fams.useLink(fams.makeLink({ kind: 'member', familyId: fam, name: 'Nana', role: 'grownup', email: 'nana@example.com' }).token, { label: 'iPhone' })
    expect(fams.session(nana).member.email).toBe('nana@example.com')
    const start = fams.useLink(fams.makeLink({ kind: 'family' }).token, { label: 'iPad', familyName: 'The Smiths', yourName: 'Jo', yourEmail: 'jo@example.com' })
    expect(fams.session(start).member.email).toBe('jo@example.com')
    const quick = fams.makeLink({ kind: 'device', familyId: fam, memberId: fams.session(nana).member.id, minutes: 30 })
    later(31 * 60_000)
    expect(fams.peekLink(quick.token)).toBeNull()
  })

  it("a family's export has its grown-ups and devices; a family can be deleted, but never the first", () => {
    const { fams } = fresh()
    const dev = fams.useLink(fams.makeLink({ kind: 'family' }).token, { label: 'iPad', familyName: 'The Smiths', yourName: 'Jo', yourEmail: 'jo@example.com' })
    const fam = fams.session(dev).family.id
    const out = fams.exportFamily(fam)
    expect(out.family.name).toBe('The Smiths')
    expect(out.members).toEqual([expect.objectContaining({ name: 'Jo', role: 'parent', email: 'jo@example.com' })])
    expect(out.devices).toEqual([expect.objectContaining({ label: 'iPad', member: 'Jo' })])
    expect(fams.deleteFamily(fam)).toBe(true)
    expect(fams.session(dev)).toBeNull()
    expect(fams.memberByEmail('jo@example.com')).toBeNull()
    expect(() => fams.deleteFamily(fams.firstFamily())).toThrow(expect.objectContaining({ status: 409 }))
  })

  it('cleans names and looks', () => {
    expect(cleanName('  Paw   Paw ')).toBe('Paw Paw')
    expect(() => cleanName('')).toThrow()
    expect(() => cleanName('x'.repeat(41))).toThrow()
    expect(cleanName('<b>Nana</b>')).toBe('bNana/b')
    expect(cleanLook({ base: 'grandma', skin: 'light', hairColor: '#d9d4cc', color: '#c9a8ff' })).toContain('grandma')
    expect(() => cleanLook({ base: { nested: 1 } })).toThrow()
  })
})
