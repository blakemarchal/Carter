// A family's link opened on a device already signed in to another family: it says so, and the device moves
// only when the grown-up ticks "Yes, leave …".
import { describe, expect, it } from 'vitest'
import { leaveChoices, leaveConfirmed, linkGuard } from './link-guard.mjs'

const was = { family: { id: 'f1', name: 'The <Rivers>' }, member: { name: 'Grown-ups' }, device: { id: 'd1' } }

describe('links on a signed-in device', () => {
  it('a link into another family (or a new one) needs a confirm; the same family doesn’t', () => {
    expect(linkGuard(null, 'f2', 0)).toEqual({ leave: false, last: false })
    expect(linkGuard(was, 'f1', 3)).toEqual({ leave: false, last: false })
    expect(linkGuard(was, 'f2', 3)).toEqual({ leave: true, last: false })
    expect(linkGuard(was, null, 1)).toEqual({ leave: true, last: true }) // (a new family, from its last device)
  })

  it('says which family, offers another device, and the tick box is required', () => {
    const html = leaveChoices(was, { last: true, firstFamily: true, action: 'start the new family' })
    expect(html).toContain('This device is signed in to The &lt;Rivers&gt;')
    expect(html).toContain('another device, or in a private window')
    expect(html).toMatch(/<input type="checkbox" name="leave" value="yes" required>/)
    expect(html).toContain('family password') // (the first family's last device)
    expect(leaveConfirmed(new URLSearchParams('leave=yes'))).toBe(true)
    expect(leaveConfirmed(new URLSearchParams(''))).toBe(false)
  })
})
