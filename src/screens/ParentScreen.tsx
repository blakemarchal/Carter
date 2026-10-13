import { LEVELS } from '../learn/levels'
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { BackButton } from '../components/ui'
import {
  activeProfile, addProfile, deleteProfile, editProfile, MAX_LEVEL, playerName, resetProgress, setSkillLevel,
  switchProfile, update, useProfiles, useProgress, type Narrator, type Skill,
} from '../lib/progress'
import { setNarrator, setRate, speak, voiceSignedOut } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { applyUpdate, buildLabel, checkForUpdate, useUpdateAvailable } from '../lib/update'
import { backupNow, deviceLabel, fetchBackup, lastBackup, listBackups, restore, type BackupInfo } from '../lib/backup'
import FamilyVoices from '../components/FamilyVoices'
import { NAME_CONSENT, NAME_STATUS_TEXT, setNarratorSaysName, useAgreedNames, useNameStatus } from '../voice/name-status'
import FamilySongs from '../components/FamilySongs'
import FamilyAccounts, { FamilyDataSection } from '../components/FamilyAccounts'
import FamilyPlan from '../components/FamilyPlan'
import StickerFace from '../components/StickerFace'
import Pic from '../components/Pic'
import { FamilyCastEditor, PlayerDetails } from '../components/FamilyEditor'
import { birthdayLabel, daysUntil } from '../lib/birthday'
import { isGrownup } from '../lib/party'
import { PLAYER_EMOJIS } from '../lib/look'
import { ISLANDS } from '../data/islands'
import { DAILY_VISIT_CHOICES } from '../lib/voyage'
import { deleteFamilyStats, flushStats, setStatsOn, statsOn } from '../lib/stats'
import { useFamilyAccount } from '../lib/family'
import type { Progress } from '../lib/progress'

// (What each level practices: src/learn/levels.ts)
const SKILL_LABEL: Record<Skill, string[]> = {
  reading: LEVELS.reading.map((l) => l.label),
  numbers: LEVELS.numbers.map((l) => l.label),
}

const NARRATORS: { id: Narrator; label: string }[] = [
  { id: 'ara', label: 'Our narrator' },
  { id: 'device', label: 'iPad voice' },
]

const EMOJIS = PLAYER_EMOJIS

/** Whether the game can say this player's name in a real voice. */
function NameVoice({ name }: { name: string }) {
  const status = useNameStatus(name)
  const agreed = useAgreedNames().some((n) => n.toLowerCase() === name.trim().toLowerCase())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (!status || !name.trim()) return null
  const toggle = async (on: boolean) => {
    if (on && !confirm(NAME_CONSENT(name.trim()))) return
    setBusy(true)
    setError('')
    try {
      await setNarratorSaysName(name, on)
    } catch (e) {
      const code = (e as { status?: number }).status
      setError(code === 503 ? 'The narrator’s voice isn’t set up on this server.' : code === 429 ? 'That’s enough names for today. Try again tomorrow.' : code === 400 ? 'That doesn’t look like a name.' : 'Couldn’t do that just now. Check you’re online and try again.')
    }
    setBusy(false)
  }
  return (
    <div className={`name-voice ${status}`}>
      <p className="muted">{agreed ? `🔊 The narrator says “${name.trim()}” (you said yes).` : NAME_STATUS_TEXT[status](name.trim())}</p>
      {(status === 'missing' || agreed) && (
        <label className="check-row">
          <input type="checkbox" checked={agreed} disabled={busy} onChange={(e) => toggle(e.target.checked)} />
          <span>Let the narrator say {name.trim()}{busy ? ' …' : ''}</span>
        </label>
      )}
      {error && <p className="warn">{error}</p>}
    </div>
  )
}

function Players() {
  const { active, list } = useProfiles()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[2])
  const [open, setOpen] = useState<string | null>(null)
  return (
    <section>
      <h3>Who plays</h3>
      <p className="muted">Each player has their own Pals, levels and settings. Playing as one never changes another&rsquo;s progress. Tap &ldquo;Birthday &amp; look&rdquo; to add a birthday and choose how they look in the stories.</p>
      <div className="player-list">
        {list.map((pr) => (
          <div key={pr.id} className="player-block">
          <div className={`player-row ${pr.id === active ? 'on' : ''}`}>
            <button className="emoji-pick" title="Change icon"
              onClick={() => editProfile(pr.id, { emoji: EMOJIS[(EMOJIS.indexOf(pr.emoji) + 1) % EMOJIS.length] })}><Pic e={pr.emoji} /></button>
            <input value={pr.name} maxLength={16} aria-label="Player name"
              onChange={(e) => editProfile(pr.id, { name: e.target.value })}
              onBlur={(e) => !e.target.value.trim() && editProfile(pr.id, { name: 'Player' })} />
            {pr.id === active
              ? <span className="tag">playing now</span>
              : <button onClick={() => switchProfile(pr.id)}>Play as {pr.name}</button>}
            <button className={open === pr.id ? 'on' : ''} onClick={() => setOpen(open === pr.id ? null : pr.id)}>
              {pr.birthday ? `🎂 ${birthdayLabel(pr.birthday)}` : isGrownup(pr) ? 'Grown-up' : 'Birthday & look'}
            </button>
            {list.length > 1 && (
              <button className="danger" onClick={() => confirm(`Delete ${pr.name} and all of their progress?`) && deleteProfile(pr.id)}>Delete</button>
            )}
          </div>
          {!isGrownup(pr) && <NameVoice name={pr.name} />}
          {open === pr.id && <PlayerDetails profile={pr} />}
          </div>
        ))}
      </div>
      <form className="player-add" onSubmit={(e) => {
        e.preventDefault()
        if (!name.trim()) return
        addProfile(name.trim(), emoji)
        setName('')
      }}>
        <button type="button" className="emoji-pick" onClick={() => setEmoji(EMOJIS[(EMOJIS.indexOf(emoji) + 1) % EMOJIS.length])}><Pic e={emoji} /></button>
        <input value={name} maxLength={16} placeholder="New player name" onChange={(e) => setName(e.target.value)} />
        <button type="submit">Add player</button>
      </form>
    </section>
  )
}

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'never')

/** The last 7 days: minutes played and answers right. */
function Week({ p }: { p: Progress }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), ...(p.log[key] ?? { secs: 0, right: 0, tries: 0 }) }
  })
  const max = Math.max(600, ...days.map((d) => d.secs))
  const total = days.reduce((a, d) => ({ secs: a.secs + d.secs, right: a.right + d.right, tries: a.tries + d.tries }), { secs: 0, right: 0, tries: 0 })
  return (
    <section>
      <h3>This week</h3>
      <div className="week">
        {days.map((d, i) => (
          <div key={i} className="week-day">
            <div className="week-bar"><i style={{ height: `${(d.secs / max) * 100}%` }} /></div>
            <b>{Math.round(d.secs / 60)}m</b>
            <span>{d.label}</span>
          </div>
        ))}
      </div>
      <p>{Math.round(total.secs / 60)} minutes · {total.right} of {total.tries} questions right on the first try</p>
    </section>
  )
}

function Family() {
  return (
    <section>
      <h3>Family</h3>
      <p className="muted">These names appear in the stories, like the birthday story.</p>
      <FamilyCastEditor />
    </section>
  )
}

/** The birthday party: when it happens, and a preview a grown-up can play right now. */
function Party({ onParty }: { onParty: () => void }) {
  const me = activeProfile()
  const days = me.birthday ? daysUntil(me.birthday) : null
  return (
    <section>
      <h3>Birthday party</h3>
      <p>
        {me.birthday
          ? `${me.name}’s birthday is ${birthdayLabel(me.birthday)}${days === 0 ? ': today!' : `, in ${days} ${days === 1 ? 'day' : 'days'}`}. On the day, a surprise party starts when ${me.name} opens the game: Happy Birthday with their name, candles to blow out, the birthday story and a present. The week before, balloons appear on the map and their Pal counts down the sleeps.`
          : `Add a birthday for ${me.name} under Players, and the game throws a surprise party on the day.`}
      </p>
      <div className="level-row"><button onClick={onParty}>🎉 Try the party now (nothing is saved)</button></div>
    </section>
  )
}

function Islands({ p }: { p: Progress }) {
  return (
    <section>
      <h3>Islands</h3>
      <p>Finished: {p.islandsDone.length ? p.islandsDone.map((id) => ISLANDS.find((i) => i.id === id)?.name ?? id).join(', ') : 'none yet'}</p>
      <div className="level-row">
        <button className={p.openAll ? 'on' : ''} onClick={() => update((x) => ({ ...x, openAll: !x.openAll }))}>
          {p.openAll ? '🔓 All islands open' : '🔒 Islands open in order'}
        </button>
      </div>
      <p className="muted">Normally each island opens when the one before it is finished. &ldquo;All islands open&rdquo; is for this player only.</p>
      <h3 style={{ marginTop: 12 }}>New adventures a day</h3>
      <div className="level-row">
        {DAILY_VISIT_CHOICES.map((n) => (
          <button key={n} className={p.dailyVisits === n ? 'on' : ''} onClick={() => update((x) => ({ ...x, dailyVisits: n }))}>{n || 'No limit'}</button>
        ))}
      </div>
      <p className="muted">How many new island visits {activeProfile().name || 'this player'} can sail to each day. Finished islands, songs, the Ark and bedtime are always open. A little each day helps it stick, and the adventure lasts longer.</p>
    </section>
  )
}

const Studio = lazy(() => import('./Studio'))
const SoundCheck = lazy(() => import('./SoundCheck'))

function Voices({ p }: { p: Progress }) {
  const [open, setOpen] = useState(false)
  const [studio, setStudio] = useState(false)
  const [soundCheck, setSoundCheck] = useState(false)
  const { view } = useFamilyAccount()
  return (
    <section>
      <h3>Family voices</h3>
      <p>Record yourself reading the stories, and your children&rsquo;s names. Your voice plays instead of the narrator for any page you record, and the game says your child&rsquo;s name in your voice.</p>
      <div className="level-row">
        <button onClick={() => setOpen(true)}>🎙️ Record names and story pages</button>
        <button className={p.familyVoices ? 'on' : ''} onClick={() => update((x) => ({ ...x, familyVoices: !x.familyVoices }))}>
          {p.familyVoices ? 'Play family recordings: on' : 'Play family recordings: off'}
        </button>
      </div>
      {view?.owner && (
        <div className="level-row">
          <button onClick={() => setStudio(true)}>🎚️ Recording studio: the house voices</button>
          <button onClick={() => setSoundCheck(true)}>🔤 Sound check: letters and numbers</button>
        </div>
      )}
      {open && <FamilyVoices onClose={() => setOpen(false)} />}
      {studio && <Suspense fallback={null}><Studio onClose={() => setStudio(false)} /></Suspense>}
      {soundCheck && <Suspense fallback={null}><SoundCheck onClose={() => setSoundCheck(false)} /></Suspense>}
    </section>
  )
}

function Backup() {
  const [status, setStatus] = useState('')
  const [last, setLast] = useState(lastBackup())
  const [list, setList] = useState<BackupInfo[] | null>(null)
  const who = (b: BackupInfo) => b.players.map((x) => `${x.emoji ?? ''} ${x.name}: ${x.islands} ${x.islands === 1 ? 'island' : 'islands'}, ${x.pals} Pals`).join(' · ') || 'no players'

  const choose = async (b: BackupInfo) => {
    if (!confirm(`Replace ALL progress on this ${deviceLabel()} with the copy from ${b.label}, ${when(b.savedAt)}?

${who(b)}

The current progress is saved to the server first, so you can undo this.`)) return
    setStatus('Saving what’s here first…')
    if (!(await backupNow())) return setStatus('Couldn’t save the current progress first, so nothing was changed. Try again when online.')
    const full = await fetchBackup(b.id)
    if (!full) return setStatus('Couldn’t read that copy. Nothing was changed.')
    restore(full)
  }

  return (
    <section>
      <h3>Backup</h3>
      <p>Every player&rsquo;s progress is copied to the family server when they start playing and after each island. This {deviceLabel()}&rsquo;s last copy: {when(last)}.</p>
      <div className="level-row">
        <button onClick={async () => {
          setStatus('Saving…')
          const ok = await backupNow()
          setLast(lastBackup())
          setStatus(ok ? 'Saved.' : 'Couldn’t reach the server. Try again when online.')
        }}>Save now</button>
        <button onClick={async () => {
          setStatus('Looking…')
          const l = await listBackups()
          setStatus(l ? (l.length ? '' : 'No backups on the server yet.') : 'Couldn’t reach the server.')
          setList(l)
        }}>Restore from a backup…</button>
      </div>
      {list && list.length > 0 && (
        <div className="backup-list">
          {list.map((b) => (
            <div key={b.id} className="backup-row">
              <div><b>{b.label}</b> · {when(b.savedAt)}<br /><span className="muted">{who(b)}</span></div>
              <button onClick={() => choose(b)}>Restore this</button>
            </div>
          ))}
        </div>
      )}
      {status && <p className="muted">{status}</p>}
    </section>
  )
}

/** Play totals (opt-in, per device, parents): counts only, kept with the family's data on our own server. */
function Improve() {
  const [on, setOn] = useState(statsOn())
  const [status, setStatus] = useState('')
  const { view } = useFamilyAccount()
  // (a parent decides; offline, or before the family has loaded, whoever is in the Parent Corner can switch it off)
  const parent = !view || view.me.role === 'parent'
  return (
    <section>
      <h3>Help make Ark Pals better</h3>
      <div className="level-row">
        <button className={on ? 'on' : ''} disabled={!on && !parent} onClick={() => { setStatsOn(!on); setOn(!on); setStatus(''); if (!on) flushStats() }}>
          {on ? '✅ Sharing play totals' : 'Share play totals'}
        </button>
        {parent && view && (
          <button onClick={async () => {
            if (!confirm('Delete the play totals your family has shared so far?')) return
            try { await deleteFamilyStats(); setStatus('Deleted.') } catch { setStatus('Couldn’t delete them just now. Try again later.') }
          }}>Delete our play totals</button>
        )}
        {view?.owner && <a className="button-link" href="/stats">📊 Play totals, all families</a>}
      </div>
      {status && <p className="muted">{status}</p>}
      <p className="muted">
        Off unless a parent turns it on, for this device only. When it&rsquo;s on, this device counts how often each island, visit and
        activity is started, finished and replayed, and how many questions were answered wrong the first time; how often each
        practice exercise and question is started, finished and got right the first time, by its level; and which level each
        treasure hunt (finding her levels) ended at. It sends those
        counts for each day to our own server, where they&rsquo;re kept with your family&rsquo;s data for about 13 months. No names,
        players, answers or times of day; no one else sees them. They&rsquo;re in your family&rsquo;s download, and deleted with your family.
        {!parent && ' A parent can turn this on.'}
      </p>
    </section>
  )
}

function AppVersion() {
  const update = useUpdateAvailable()
  // (feedback at once: a reload can take a few seconds to start on an iPad)
  const [busy, setBusy] = useState<'' | 'checking' | 'updating'>('')
  const [status, setStatus] = useState('')
  const reload = () => { setBusy('updating'); setStatus(''); setTimeout(applyUpdate, 50) }
  const check = async () => {
    setBusy('checking')
    setStatus('')
    const newer = await checkForUpdate()
    setBusy('')
    setStatus(newer ? '' : 'You have the newest version.')
  }
  return (
    <section>
      <h3>App version</h3>
      <p>This {deviceLabel()} has the version from {buildLabel()}.</p>
      <div className="level-row">
        {update
          ? <button className="on" onClick={reload} disabled={!!busy}>✨ Update now</button>
          : <button onClick={check} disabled={!!busy}>{busy === 'checking' ? <><span className="spinner" aria-hidden /> Checking…</> : 'Check for updates'}</button>}
        <button onClick={reload} disabled={!!busy}>Reload app</button>
      </div>
      {busy === 'updating' && <p className="muted" role="status"><span className="spinner" aria-hidden /> Updating… the app will open again in a moment.</p>}
      {status && <p className="muted" role="status">{status}</p>}
      <p className="muted">Updating keeps every player&rsquo;s progress. &ldquo;Reload app&rdquo; also fixes a stuck screen.</p>
    </section>
  )
}

/** The Parent Corner's groups, in order. */
const GROUPS = [
  { id: 'players', title: 'Players', help: 'Who plays, their birthdays and how they look, and the family in the stories.' },
  { id: 'grownups', title: 'Grown-ups and devices', help: 'Who can sign in, inviting a grown-up, and the devices signed in.' },
  { id: 'plan', title: 'Your family’s plan', help: 'Your plan, the billing page, and Grace codes.' },
  { id: 'voices', title: 'Voices and recordings', help: 'The narrator, your own recordings and songs.' },
  { id: 'learning', title: 'Learning levels', help: 'Where each player is in reading and numbers.' },
  { id: 'play', title: 'Play and limits', help: 'Time played, new islands each day, and sound.' },
  { id: 'data', title: 'Data and privacy', help: 'What’s kept, backups, downloads, and sharing play totals.' },
  { id: 'app', title: 'App', help: 'The version on this device, and updates.' },
] as const
type GroupId = (typeof GROUPS)[number]['id']

/** Wide enough for a side menu (an iPad in landscape, a laptop). */
function useWide(min = 960) {
  const q = `(min-width: ${min}px)`
  const [wide, setWide] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return wide
}

export default function ParentScreen({ onBack, onParty, onPlacement }: { onBack: () => void; onParty: () => void; onPlacement: () => void }) {
  const p = useProgress()
  const me = activeProfile()
  const mins = Math.round(p.playSeconds / 60)
  const wide = useWide()
  const [group, setGroup] = useState<GroupId>('players')
  const [open, setOpen] = useState<Set<GroupId>>(() => new Set(['players']))
  const pickNarrator = (n: Narrator) => {
    setNarrator(n)
    update((x) => ({ ...x, narrator: n }))
    speak(`Hi ${playerName()}! I'll read the stories and questions to you.`)
  }

  const content: Record<GroupId, ReactNode> = {
    players: <>
      <Players />
      <Family />
      <Party onParty={onParty} />
    </>,
    grownups: <FamilyAccounts />,
    plan: <FamilyPlan />,
    voices: <>
      <section>
        <h3>Narrator</h3>
        <p className="muted">The narrator is our own family&rsquo;s recorded voice where it has recorded a line, and Grok&rsquo;s &ldquo;Ara&rdquo; voice for the rest. The iPad voice reads everything on the device instead.</p>
        <div className="level-row">
          {NARRATORS.map((n) => (
            <button key={n.id} className={(p.narrator === 'eve' ? 'ara' : p.narrator) === n.id ? 'on' : ''} onClick={() => pickNarrator(n.id)}>{n.label}</button>
          ))}
        </div>
        {p.narrator !== 'device' && voiceSignedOut() && (
          <p className="warn">This iPad&rsquo;s sign-in has expired, so the iPad voice is reading. <a href="/login">Sign in again</a> to get the narrator back. Progress is kept.</p>
        )}
        <h4>Speed of the iPad voice</h4>
        <div className="level-row">
          {[0.75, 0.9, 1].map((r) => (
            <button key={r} className={p.speechRate === r ? 'on' : ''}
              onClick={() => { setRate(r); update((x) => ({ ...x, speechRate: r })) }}>
              {r === 0.75 ? 'Slow' : r === 0.9 ? 'Normal' : 'Quick'}
            </button>
          ))}
        </div>
      </section>
      <Voices p={p} />
      <FamilySongs />
    </>,
    learning: <>
      <section>
        <h3>Starting levels</h3>
        <p className="muted">A short treasure hunt with {me.name}&rsquo;s Pal (2 or 3 minutes) finds where to start reading and numbers. It plays once for a new player; play it again here, or set the levels below by hand.</p>
        <div className="level-row"><button onClick={onPlacement}>Find my levels again</button></div>
      </section>
      {(['reading', 'numbers'] as Skill[]).map((s) => (
        <section key={s}>
          <h3>{s === 'reading' ? 'Reading' : 'Numbers'}: level {p.skills[s]}</h3>
          <p>{SKILL_LABEL[s][p.skills[s] - 1]}</p>
          <p className="muted">Adjusts by itself: 3 right in a row moves up, 2 misses in a row moves down.</p>
          <div className="level-row">
            {Array.from({ length: MAX_LEVEL[s] }).map((_, i) => (
              <button key={i} className={p.skills[s] === i + 1 ? 'on' : ''} onClick={() => setSkillLevel(s, i + 1)} aria-label={`Level ${i + 1}: ${SKILL_LABEL[s][i]}`}>{i + 1}</button>
            ))}
          </div>
        </section>
      ))}
    </>,
    play: <>
      <section>
        <h3>Today: {me.name}</h3>
        <p>{mins} min played (a gentle reminder comes at 60 min)</p>
        <p>Islands finished: {p.islandsDone.length ? p.islandsDone.map((id) => ISLANDS.find((i) => i.id === id)?.name ?? id).join(', ') : 'none yet'} · Pals: {Object.keys(p.pals).length} · Stickers: {p.stickers.length ? p.stickers.map((s) => <StickerFace key={s} s={s} />) : 'none yet'}</p>
      </section>
      <Week p={p} />
      <Islands p={p} />
      <section>
        <h3>Sound</h3>
        <div className="level-row">
          <button className={p.music ? 'on' : ''} onClick={() => update((x) => ({ ...x, music: !x.music }))}>Music {p.music ? 'on' : 'off'}</button>
          <button className={p.sfx ? 'on' : ''} onClick={() => { update((x) => ({ ...x, sfx: !x.sfx })); if (!p.sfx) setTimeout(sfx.good, 50) }}>Sound effects {p.sfx ? 'on' : 'off'}</button>
        </div>
      </section>
    </>,
    data: <>
      <FamilyDataSection />
      <Backup />
      <Improve />
      <section>
        <h3>Erase progress</h3>
        <p className="muted">Erases {me.name}&rsquo;s progress on this device only (backups on the server stay).</p>
        <div className="level-row"><button className="danger" onClick={() => confirm(`Erase all of ${me.name}’s progress on this device?`) && resetProgress()}>Erase {me.name}&rsquo;s progress</button></div>
      </section>
      <p className="muted">No ads, no chat, no tracking. The narrator&rsquo;s voice is made ahead of time on our server; a child&rsquo;s name is never sent anywhere unless you choose &ldquo;Let the narrator say&rdquo; it. See our privacy policy for everything we keep.</p>
    </>,
    app: <AppVersion />,
  }

  const toggle = (id: GroupId) => setOpen((o) => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n })
  return (
    <div className={`screen parent ${wide ? 'wide' : 'narrow'}`}>
      <header><BackButton onClick={onBack} /><h2>Parent Corner</h2><span /></header>
      {wide ? (
        <div className="pc-layout">
          <nav className="pc-nav" aria-label="Parent Corner">
            {GROUPS.map((g) => (
              <button key={g.id} className={group === g.id ? 'on' : ''} aria-current={group === g.id ? 'page' : undefined} onClick={() => setGroup(g.id)}>{g.title}</button>
            ))}
          </nav>
          <div className="pc-group" key={group}>
            <h2 className="pc-title">{GROUPS.find((g) => g.id === group)!.title}</h2>
            <p className="muted pc-help">{GROUPS.find((g) => g.id === group)!.help}</p>
            {content[group]}
          </div>
        </div>
      ) : (
        <div className="pc-stack">
          {GROUPS.map((g) => (
            <div key={g.id} className={`pc-fold ${open.has(g.id) ? 'open' : ''}`}>
              <button className="pc-fold-head" aria-expanded={open.has(g.id)} onClick={() => toggle(g.id)}>
                <span><b>{g.title}</b><small>{g.help}</small></span>
                <span className="pc-chevron" aria-hidden>›</span>
              </button>
              {open.has(g.id) && <div className="pc-fold-body">{content[g.id]}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
