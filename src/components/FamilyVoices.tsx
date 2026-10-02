// Parent Corner: record your own voice reading the stories. Each story page can be recorded;
// the game then plays your recording instead of the narrator wherever that page is read.
import { useEffect, useState, useSyncExternalStore } from 'react'
import { BackButton } from './ui'
import { ISLANDS } from '../data/islands'
import { BEDTIME_LINES } from '../screens/Bedtime'
import { deleteRecording, hasRecording, lineId, loadRecordings, onRecordingsChange, saveRecording, startRecording, stopRecording } from '../lib/recordings'
import { getProgress } from '../lib/progress'
import { setFamilyVoices, speak, stopSpeaking } from '../lib/speech'

/** Every story line, exactly as the game speaks it (the first page includes the title). */
function groups() {
  const out: { name: string; lines: string[] }[] = []
  for (const isl of ISLANDS) {
    const story = isl.steps?.find((s) => s.kind === 'story')
    if (story?.kind === 'story') out.push({ name: isl.name, lines: story.pages.map((pg, i) => (i === 0 ? `${story.title}. ${pg.text}` : pg.text)) })
  }
  out.push({ name: 'Bedtime', lines: BEDTIME_LINES })
  return out
}

function Line({ text, busy, setBusy }: { text: string; busy: string | null; setBusy: (t: string | null) => void }) {
  const [id, setId] = useState('')
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState('')
  useSyncExternalStore(onRecordingsChange, () => (id ? hasRecording(id) : false))
  useEffect(() => { lineId(text).then(setId) }, [text])
  const has = !!id && hasRecording(id)

  const rec = async () => {
    setError('')
    if (!recording) {
      try {
        stopSpeaking()
        await startRecording()
        setRecording(true)
        setBusy(text)
      } catch {
        setError('The microphone isn’t available. Allow it in Settings → Safari → Microphone.')
      }
      return
    }
    setRecording(false)
    const blob = await stopRecording()
    setBusy(null)
    if (!blob) return setError('Nothing was recorded. Try again.')
    try {
      await saveRecording(text, blob)
    } catch {
      setError('Couldn’t save it. Check you’re online and try again.')
    }
  }

  return (
    <div className={`fv-line ${has ? 'has' : ''}`}>
      <p>{text}</p>
      <div className="fv-tools">
        <button onClick={() => speak(text)} disabled={!!busy} aria-label="Listen">▶</button>
        <button className={recording ? 'rec' : ''} onClick={rec} disabled={!!busy && busy !== text} aria-label={recording ? 'Stop recording' : 'Record'}>
          {recording ? '⏹' : '🎙️'}
        </button>
        {has && <button onClick={() => deleteRecording(text)} disabled={!!busy} aria-label="Delete recording">🗑</button>}
        {has && <span className="fv-tag">your voice ✓</span>}
      </div>
      {error && <p className="warn">{error}</p>}
    </div>
  )
}

export default function FamilyVoices({ onClose }: { onClose: () => void }) {
  const [busy, setBusy] = useState<string | null>(null)
  useEffect(() => {
    loadRecordings()
    setFamilyVoices(true) // so "Listen" plays your recordings here
    return () => { stopSpeaking(); setFamilyVoices(getProgress().familyVoices) }
  }, [])
  return (
    <div className="overlay family-voices">
      <header className="home-head"><BackButton onClick={onClose} /><h2>🎙️ Family voices</h2><span /></header>
      <p className="muted">Tap 🎙️, read the page aloud, then tap ⏹. Your recording plays instead of the narrator wherever that page is read, on every device.</p>
      <div className="fv-list">
        {groups().map((g) => (
          <section key={g.name}>
            <h3>{g.name}</h3>
            {g.lines.map((t) => <Line key={t} text={t} busy={busy} setBusy={setBusy} />)}
          </section>
        ))}
      </div>
    </div>
  )
}
