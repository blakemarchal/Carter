// A family's link (an invitation, a "sign in another device" link, or a new family's start link) opened on a
// device that's already signed in to a different family. Before wave 11 the device was quietly moved into the
// new family; now the page says so, and moving needs the grown-up to tick "Yes, leave <family> on this device".
// (Within the same family, signing a device in as another grown-up only carries a warning, as before.)

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/**
 * What a link needs on this device. `was`: the device's session (or null); `targetFamilyId`: the family the
 * link signs into (null for a new family); `devicesInFamily`: how many devices the current family has.
 * Returns { leave: whether leaving the current family has to be confirmed, last: whether it's that family's last device }.
 */
export function linkGuard(was, targetFamilyId, devicesInFamily) {
  const leave = !!was && was.family.id !== targetFamilyId
  return { leave, last: leave && devicesInFamily <= 1 }
}

/** Whether a posted form confirmed leaving (the tick box). */
export const leaveConfirmed = (form) => form.get('leave') === 'yes'

/** The part of the link's page that explains it, with the two ways on. Put inside the page's form. */
export function leaveChoices(was, { last, firstFamily, action }) {
  const fam = esc(was.family.name)
  return `<div class="err"><p><b>This device is signed in to ${fam}</b> (as ${esc(was.member.name)}).</p></div>
<p><b>To keep it in ${fam}:</b> open this link on another device, or in a private window (in Safari: the tabs button, then Private).</p>
<p><b>Or move this device:</b></p>
<label class="check"><input type="checkbox" name="leave" value="yes" required> Yes, leave ${fam} on this device and ${esc(action)}.</label>
${last ? `<p class="err">This is the last device signed in to ${fam}.${firstFamily ? ' To sign a device back in to it afterwards you would need its family password.' : ` To get back in, a grown-up in ${fam} would need to send a new sign-in link.`}</p>` : ''}`
}
