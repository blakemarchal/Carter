import { useState } from 'react'
import { BackButton } from '../components/ui'
import {
  activeProfile, addProfile, deleteProfile, editProfile, MAX_LEVEL, playerName, resetProgress, setSkillLevel,
  switchProfile, update, useProfiles, useProgress, type Narrator, type Skill,
} from '../lib/progress'
import { grokVoiceAvailable, setNarrator, setRate, speak, voiceSignedOut } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { applyUpdate, buildLabel, checkForUpdate, useUpdateAvailable } from '../lib/update'

const SKILL_LABEL: Record<Skill, string[]> = {
  reading: ['Beginning sounds', 'Read 3-letter words (3 choices)', 'Read 3-letter words (4 choices)', 'Sight words', 'Find any word'],
  numbers: ['Count to 10', 'What comes next? (to 40)', 'What comes next? (to 100, decades)', 'Decades + adding', 'Add/subtract to 10, past 100'],
}

const NARRATORS: { id: Narrator; label: string }[] = [
  { id: 'ara', label: 'Ara (Grok)' },
  { id: 'eve', label: 'Eve (Grok)' },
  { id: 'device', label: 'iPad voice' },
]

const EMOJIS = ['🌈', '🧪', '🦁', '🐳', '🌟', '🦄', '🐻', '🚀', '🌸', '🐶']

function Players() {
  const { active, list } = useProfiles()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[2])
  return (
    <section>
      <h3>Players</h3>
      <p className="muted">Each player has their own Pals, levels and settings. Playing as one never changes another&rsquo;s progress.</p>
      <div className="player-list">
        {list.map((pr) => (
          <div key={pr.id} className={`player-row ${pr.id === active ? 'on' : ''}`}>
            <button className="emoji-pick" title="Change icon"
              onClick={() => editProfile(pr.id, { emoji: EMOJIS[(EMOJIS.indexOf(pr.emoji) + 1) % EMOJIS.length] })}>{pr.emoji}</button>
            <input value={pr.name} maxLength={16} aria-label="Player name"
              onChange={(e) => editProfile(pr.id, { name: e.target.value })}
              onBlur={(e) => !e.target.value.trim() && editProfile(pr.id, { name: 'Player' })} />
            {pr.id === active
              ? <span className="tag">playing now</span>
              : <button onClick={() => switchProfile(pr.id)}>Play as {pr.name}</button>}
            {list.length > 1 && (
              <button className="danger" onClick={() => confirm(`Delete ${pr.name} and all of their progress?`) && deleteProfile(pr.id)}>Delete</button>
            )}
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

export default function ParentScreen({ onBack }: { onBack: () => void }) {
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
      <section>
        <h3>Today ({me.emoji} {me.name})</h3>
        <p>{mins} min played (gentle reminder at 60 min)</p>
        <p>Islands finished: {p.islandsDone.length ? p.islandsDone.join(', ') : 'none yet'} · Pals: {Object.keys(p.pals).length} · Stickers: {p.stickers.join(' ') || 'none'}</p>
      </section>
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
      <AppVersion />
      <p className="muted">Progress is stored only on this device. No ads, no chat, no accounts. Narration text is sent to xAI to create the voice; nothing else is shared.</p>
    </div>
  )
}
