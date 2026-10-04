// Parent Corner: the grown-ups who can sign in to this family's Ark (server/families.mjs), the devices
// they're signed in on, and inviting someone new (Nana, Paw Paw…): a one-time link to send them, which
// signs their device in when they open it. Nobody needs a password. Each grown-up has an avatar.
import { useState } from 'react'
import Avatar from './Avatar'
import { familyApi, useFamilyAccount, type FamilyView, type Role } from '../lib/family'
import {
  AVATAR_PRESETS, avatarLook, GROWNUP_COLORS, GROWNUP_HAIR_COLORS, GROWNUP_HAIRS, guessAvatar, readAvatar, type GrownupAvatar,
} from '../lib/avatars'
import { SKIN } from '../art/people'

const ago = (t: number) => {
  const m = Math.round((Date.now() - t) / 60_000)
  if (m < 15) return 'just now'
  if (m < 60 * 24) return `${Math.round(m / 60) || 1} h ago`
  return new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/** A link to send: shown with Copy (and Share, where the device can). */
function LinkCard({ link, who, note }: { link: string; who: string; note: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      (document.getElementById('family-link') as HTMLInputElement | null)?.select()
    }
  }
  return (
    <div className="link-card">
      <p><b>Send this link to {who}.</b> {note}</p>
      <input id="family-link" readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Link" />
      <div className="level-row">
        <button onClick={copy}>{copied ? '✓ Copied' : '📋 Copy link'}</button>
        {'share' in navigator && <button onClick={() => navigator.share({ title: 'Ark Pals', text: `A link for ${who} to join our family's Ark Pals`, url: link }).catch(() => {})}>📤 Share</button>}
      </div>
    </div>
  )
}

/** Choosing your own avatar: a quick start, then skin, hair, beard and clothes. */
function AvatarEditor({ start, onSave }: { start: GrownupAvatar; onSave: (a: GrownupAvatar) => void }) {
  const [a, setA] = useState(start)
  const set = (c: Partial<GrownupAvatar>) => setA({ ...a, ...c })
  return (
    <div className="avatar-editor">
      <div className="ae-preview"><Avatar look={avatarLook(a)} size={120} /></div>
      <div className="ae-rows">
        <div className="ae-row"><span>Start from</span>
          {AVATAR_PRESETS.map((p) => <button key={p.name} className="ae-preset" onClick={() => setA({ ...p.avatar, skin: a.skin })}><Avatar look={avatarLook({ ...p.avatar, skin: a.skin })} size={44} />{p.name}</button>)}
        </div>
        <div className="ae-row"><span>Skin</span>
          {(Object.keys(SKIN) as GrownupAvatar['skin'][]).map((k) => <button key={k} className={`swatch ${a.skin === k ? 'on' : ''}`} style={{ background: SKIN[k] }} aria-label={`Skin ${k}`} onClick={() => set({ skin: k })} />)}
        </div>
        <div className="ae-row"><span>Hair</span>
          {GROWNUP_HAIRS.map((h) => <button key={h} className={a.hair === h ? 'on' : ''} onClick={() => set({ hair: h })}>{h}</button>)}
        </div>
        <div className="ae-row"><span>Hair color</span>
          {GROWNUP_HAIR_COLORS.map((c) => <button key={c} className={`swatch ${a.hairColor === c ? 'on' : ''}`} style={{ background: c }} aria-label={`Hair color ${c}`} onClick={() => set({ hairColor: c })} />)}
        </div>
        <div className="ae-row"><span>Beard</span>
          {(['none', 'short', 'long'] as const).map((b) => <button key={b} className={a.beard === b ? 'on' : ''} onClick={() => set({ beard: b })}>{b}</button>)}
        </div>
        <div className="ae-row"><span>Clothes</span>
          {GROWNUP_COLORS.map((c) => <button key={c} className={`swatch ${a.color === c ? 'on' : ''}`} style={{ background: c }} aria-label={`Clothes ${c}`} onClick={() => set({ color: c })} />)}
        </div>
        <button className="ae-save" onClick={() => onSave(a)}>Save my avatar</button>
      </div>
    </div>
  )
}

function Members({ view, reload }: { view: FamilyView; reload: () => void }) {
  const [editing, setEditing] = useState(false)
  const parent = view.me.role === 'parent'
  return (
    <div className="player-list">
      {view.members.map((m) => {
        const me = m.id === view.me.member
        const look = avatarLook(readAvatar(m.look, m.name))
        return (
          <div key={m.id} className="player-block">
            <div className={`player-row family-member ${me ? 'on' : ''}`}>
              <Avatar look={look} size={52} />
              {me
                ? <input defaultValue={m.name} maxLength={40} aria-label="Your name"
                    onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== m.name) familyApi.updateMe({ name: v }).then(reload).catch(() => {}) }} />
                : <b className="fm-name">{m.name}</b>}
              <span className="tag">{m.role === 'parent' ? 'parent' : 'grown-up'}{me ? ' · you' : ''}</span>
              {me && <button className={editing ? 'on' : ''} onClick={() => setEditing(!editing)}>My avatar</button>}
              {parent && !me && (
                <button className="danger" onClick={() => {
                  if (confirm(`Remove ${m.name}? Their devices will be signed out.`)) familyApi.removeMember(m.id).then(reload).catch(() => alertFail())
                }}>Remove</button>
              )}
            </div>
            {me && editing && (
              <AvatarEditor start={readAvatar(m.look, m.name)} onSave={(a) => familyApi.updateMe({ look: a }).then(() => { setEditing(false); reload() }).catch(() => alertFail())} />
            )}
          </div>
        )
      })}
    </div>
  )
}

const alertFail = () => alert('That didn’t work. Check the internet and try again.')

function Invite({ view, reload }: { view: FamilyView; reload: () => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('grownup')
  const [made, setMade] = useState<{ link: string; who: string } | null>(null)
  return (
    <>
      <h4>Invite a grown-up</h4>
      <p className="muted">Grandparents, a babysitter, the other parent: they get their own sign-in on their own phone or tablet, and play with their own players. Parents can also invite people and remove them.</p>
      <form className="player-add" onSubmit={(e) => {
        e.preventDefault()
        const who = name.trim()
        if (!who) return
        familyApi.invite(who, role).then((r) => { setMade({ link: r.link, who }); setName(''); reload() }).catch(() => alertFail())
      }}>
        <Avatar look={avatarLook(guessAvatar(name))} size={44} />
        <input value={name} maxLength={40} placeholder="What you call them: Nana" onChange={(e) => setName(e.target.value)} aria-label="Their name" />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="Who they are">
          <option value="grownup">Grandparent or other grown-up</option>
          <option value="parent">Parent</option>
        </select>
        <button type="submit">Make their link</button>
      </form>
      {made && <LinkCard link={made.link} who={made.who} note="It works once, for 7 days. They open it on their phone or tablet and tap Join, and they're in. (On an iPhone or iPad, they can then put Ark Pals on their Home Screen: Safari's Share button, then Add to Home Screen.)" />}
      {view.invites.length > 0 && (
        <div className="family-invites">
          {view.invites.map((i) => (
            <div key={i.id} className="player-row">
              <span>✉️ <b>{i.name}</b> hasn&rsquo;t joined yet (link works until {new Date(i.expires).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})</span>
              <button onClick={() => familyApi.cancelInvite(i.id).then(reload).catch(() => alertFail())}>Cancel</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function Devices({ view, reload }: { view: FamilyView; reload: () => void }) {
  const [link, setLink] = useState<string | null>(null)
  const parent = view.me.role === 'parent'
  const nameOf = (id: string) => view.members.find((m) => m.id === id)?.name ?? '?'
  return (
    <>
      <h4>Signed-in devices</h4>
      <div className="family-devices">
        {view.devices.map((d) => (
          <div key={d.id} className="player-row">
            <span>{d.label} · <b>{nameOf(d.member)}</b> · {d.mine ? <span className="tag">this device</span> : ago(d.seen)}</span>
            {parent && !d.mine && (
              <button className="danger" onClick={() => confirm(`Sign out ${nameOf(d.member)}'s ${d.label}? It will need a new link to come back.`) && familyApi.removeDevice(d.id).then(reload).catch(() => alertFail())}>Sign out</button>
            )}
          </div>
        ))}
      </div>
      <div className="level-row">
        <button onClick={() => familyApi.deviceLink().then((r) => setLink(r.link)).catch(() => alertFail())}>📱 Sign in another device as me</button>
      </div>
      {link && <LinkCard link={link} who="your other device" note="Open it there within a day. It works once." />}
    </>
  )
}

export default function FamilyAccounts() {
  const { view, reload } = useFamilyAccount()
  if (!view) {
    return (
      <section>
        <h3>Grown-ups who can sign in</h3>
        <p className="muted">This needs the internet. Connecting…</p>
      </section>
    )
  }
  const parent = view.me.role === 'parent'
  return (
    <section className="family-accounts">
      <h3>Grown-ups who can sign in</h3>
      <div className="player-row">
        <span>Family name</span>
        {parent
          ? <input defaultValue={view.family.name} maxLength={40} aria-label="Family name"
              onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== view.family.name) familyApi.rename(v).then(reload).catch(() => alertFail()) }} />
          : <b>{view.family.name}</b>}
      </div>
      <Members view={view} reload={reload} />
      {parent && <Invite view={view} reload={reload} />}
      <Devices view={view} reload={reload} />
    </section>
  )
}
