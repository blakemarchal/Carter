import { useState } from 'react'
import { BackButton } from '../components/ui'
import {
  activeProfile, addProfile, deleteProfile, editProfile, MAX_LEVEL, playerName, resetProgress, setSkillLevel,
  switchProfile, update, useProfiles, useProgress, type Narrator, type Skill,
} from '../lib/progress'
import { grokVoiceAvailable, setNarrator, setRate, speak, voiceSignedOut } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { applyUpdate, buildLabel, checkForUpdate, useUpdateAvailable } from '../lib/update'
import { backupNow, deviceLabel, fetchBackup, lastBackup, listBackups, restore, type BackupInfo } from '../lib/backup'
import FamilyVoices from '../components/FamilyVoices'
import FamilySongs from '../components/FamilySongs'
import FamilyAccounts from '../components/FamilyAccounts'
import { FamilyCastEditor, PlayerDetails } from '../components/FamilyEditor'
import { birthdayLabel, daysUntil } from '../lib/birthday'
import { isGrownup } from '../lib/party'
import { PLAYER_EMOJIS } from '../lib/look'
import { ISLANDS } from '../data/islands'
import { DAILY_VISIT_CHOICES } from '../lib/voyage'
import { flushStats, setStatsOn, statsOn } from '../lib/stats'
import type { Progress } from '../lib/progress'

const SKILL_LABEL: Record<Skill, string[]> = {
  reading: ['Beginning sounds', 'Read 3-letter words (3 choices)', 'Read 3-letter words (4 choices)', 'Sight words', 'Find any word'],
  numbers: ['Count to 10', 'What comes next? (to 40)', 'What comes next? (to 100, decades)', 'Decades + adding', 'Add/subtract to 10, past 100'],
}

const NARRATORS: { id: Narrator; label: string }[] = [
  { id: 'ara', label: 'Ara (Grok)' },
  { id: 'eve', label: 'Eve (Grok)' },
  { id: 'device', label: 'iPad voice' },
]

const EMOJIS = PLAYER_EMOJIS

function Players() {
  const { active, list } = useProfiles()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[2])
  const [open, setOpen] = useState<string | null>(null)
  return (
    <section>
      <h3>Players</h3>
      <p className="muted">Each player has their own Pals, levels and settings. Playing as one never changes another&rsquo;s progress. Tap &ldquo;Birthday &amp; look&rdquo; to add a birthday and choose how they look in the stories.</p>
      <div className="player-list">
        {list.map((pr) => (
          <div key={pr.id} className="player-block">
          <div className={`player-row ${pr.id === active ? 'on' : ''}`}>
            <button className="emoji-pick" title="Change icon"
              onClick={() => editProfile(pr.id, { emoji: EMOJIS[(EMOJIS.indexOf(pr.emoji) + 1) % EMOJIS.length] })}>{pr.emoji}</button>
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
        <button type="button" className="emoji-pick" onClick={() => setEmoji(EMOJIS[(EMOJIS.indexOf(emoji) + 1) % EMOJIS.length])}>{emoji}</button>
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

function Voices({ p }: { p: Progress }) {
  const [open, setOpen] = useState(false)
  return (
    <section>
      <h3>Family voices</h3>
      <p>Record yourself reading the stories. Your voice plays instead of the narrator for any page you record.</p>
      <div className="level-row">
        <button onClick={() => setOpen(true)}>🎙️ Record story pages</button>
        <button className={p.familyVoices ? 'on' : ''} onClick={() => update((x) => ({ ...x, familyVoices: !x.familyVoices }))}>
          {p.familyVoices ? 'Play family recordings: on' : 'Play family recordings: off'}
        </button>
      </div>
      {open && <FamilyVoices onClose={() => setOpen(false)} />}
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
      <p>Every player&rsquo;s progress is copied to the family server when she starts playing and after each island. This {deviceLabel()}&rsquo;s last copy: {when(last)}.</p>
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

/** Play totals (opt-in): counts only, to our own server, to make the game better. */
function Improve() {
  const [on, setOn] = useState(statsOn())
  return (
    <section>
      <h3>Help make Ark Pals better</h3>
      <div className="level-row">
        <button className={on ? 'on' : ''} onClick={() => { setStatsOn(!on); setOn(!on); if (!on) flushStats() }}>
          {on ? '✅ Sharing play totals' : 'Share play totals'}
        </button>
      </div>
      <p className="muted">Counts only, sent to our own server and no one else: how often each island is started, finished or left part-way, stars earned, and minutes played. No names, no answers, nothing personal.</p>
    </section>
  )
}

function AppVersion() {
  const update = useUpdateAvailable()
  const [status, setStatus] = useState('')
  return (
    <section>
      <h3>App version</h3>
      <p>This iPad has the version from {buildLabel()}.</p>
      <div className="level-row">
        {update
          ? <button className="on" onClick={applyUpdate}>✨ Update now</button>
          : <button onClick={async () => {
              setStatus('Checking…')
              setStatus((await checkForUpdate()) ? '' : 'Up to date.')
            }}>Check for updates</button>}
        <button onClick={applyUpdate}>Reload app</button>
      </div>
      {status && <p className="muted">{status}</p>}
      <p className="muted">Updating keeps every player&rsquo;s progress. &ldquo;Reload app&rdquo; also fixes a stuck screen.</p>
    </section>
  )
}

export default function ParentScreen({ onBack, onParty }: { onBack: () => void; onParty: () => void }) {
  const p = useProgress()
  const me = activeProfile()
  const mins = Math.round(p.playSeconds / 60)
  const pickNarrator = (n: Narrator) => {
    setNarrator(n)
    update((x) => ({ ...x, narrator: n }))
    speak(`Hi ${playerName()}! I'll read the stories and questions to you.`)
  }
  return (
    <div className="screen parent">
      <header><BackButton onClick={onBack} /><h2>Parent Corner</h2><span /></header>
      <Players />
      <FamilyAccounts />
      <Family />
      <Party onParty={onParty} />
      <section>
        <h3>Today ({me.emoji} {me.name})</h3>
        <p>{mins} min played (gentle reminder at 60 min)</p>
        <p>Islands finished: {p.islandsDone.length ? p.islandsDone.join(', ') : 'none yet'} · Pals: {Object.keys(p.pals).length} · Stickers: {p.stickers.join(' ') || 'none'}</p>
      </section>
      <Week p={p} />
      <Islands p={p} />
      {(['reading', 'numbers'] as Skill[]).map((s) => (
        <section key={s}>
          <h3>{s === 'reading' ? '📖 Reading' : '🔢 Numbers'} — level {p.skills[s]}: {SKILL_LABEL[s][p.skills[s] - 1]}</h3>
          <p className="muted">Adjusts automatically: 3 right in a row moves up, 2 misses in a row moves down.</p>
          <div className="level-row">
            {Array.from({ length: MAX_LEVEL[s] }).map((_, i) => (
              <button key={i} className={p.skills[s] === i + 1 ? 'on' : ''} onClick={() => setSkillLevel(s, i + 1)}>{i + 1}</button>
            ))}
          </div>
        </section>
      ))}
      <section>
        <h3>Narrator voice</h3>
        <div className="level-row">
          {NARRATORS.map((n) => (
            <button key={n.id} className={p.narrator === n.id ? 'on' : ''} onClick={() => pickNarrator(n.id)}>{n.label}</button>
          ))}
        </div>
        {p.narrator !== 'device' && voiceSignedOut() && (
          <p className="warn">This iPad&rsquo;s sign-in has expired, so the iPad voice is reading. <a href="/login">Sign in again</a> to get Ara back. Progress is kept.</p>
        )}
        {p.narrator !== 'device' && !grokVoiceAvailable() && (
          <p className="muted">The Grok voice isn&rsquo;t set up on the server yet, so the iPad voice is reading for now.</p>
        )}
        <h3 style={{ marginTop: 12 }}>Voice speed</h3>
        <div className="level-row">
          {[0.75, 0.9, 1].map((r) => (
            <button key={r} className={p.speechRate === r ? 'on' : ''}
              onClick={() => { setRate(r); update((x) => ({ ...x, speechRate: r })) }}>
              {r === 0.75 ? 'Slow' : r === 0.9 ? 'Normal' : 'Quick'}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h3>Sound</h3>
        <div className="level-row">
          <button className={p.music ? 'on' : ''} onClick={() => update((x) => ({ ...x, music: !x.music }))}>🎵 Music {p.music ? 'on' : 'off'}</button>
          <button className={p.sfx ? 'on' : ''} onClick={() => { update((x) => ({ ...x, sfx: !x.sfx })); if (!p.sfx) setTimeout(sfx.good, 50) }}>✨ Sound effects {p.sfx ? 'on' : 'off'}</button>
        </div>
      </section>
      <section>
        <h3>Reset</h3>
        <button className="danger" onClick={() => confirm(`Erase all of ${me.name}’s progress on this device?`) && resetProgress()}>Erase {me.name}&rsquo;s progress</button>
      </section>
      <Voices p={p} />
      <FamilySongs />
      <Backup />
      <Improve />
      <AppVersion />
      <p className="muted">Progress is stored only on this device. No ads, no chat, no accounts. Narration text is sent to xAI to create the voice; nothing else is shared.</p>
    </div>
  )
}
