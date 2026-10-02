import { BackButton } from '../components/ui'
import { MAX_LEVEL, resetProgress, setSkillLevel, update, useProgress, type Skill } from '../lib/progress'
import { setRate } from '../lib/speech'

const SKILL_LABEL: Record<Skill, string[]> = {
  reading: ['Beginning sounds', 'Read 3-letter words (2 choices)', 'Read 3-letter words (3 choices)', 'Sight words', 'Find any word'],
  numbers: ['Count to 10', 'What comes next? (to 40)', 'What comes next? (to 100, decades)', 'Decades + adding', 'Add/subtract to 10, past 100'],
}

export default function ParentScreen({ onBack }: { onBack: () => void }) {
  const p = useProgress()
  const mins = Math.round(p.playSeconds / 60)
  return (
    <div className="screen parent">
      <header><BackButton onClick={onBack} /><h2>Parent Corner</h2><span /></header>
      <section>
        <h3>Today</h3>
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
        <h3>Voice speed</h3>
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
        <h3>Reset</h3>
        <button className="danger" onClick={() => confirm('Erase all of Carter’s progress on this device?') && resetProgress()}>Erase progress</button>
      </section>
      <p className="muted">All progress is stored only on this device. No ads, no chat, no accounts, nothing shared.</p>
    </div>
  )
}
