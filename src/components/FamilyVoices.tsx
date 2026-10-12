// Parent Corner: record your own voice reading the stories, and your children's names. Each story page can be
// recorded; the game then plays your recording instead of the narrator wherever that page is read. A name is
// recorded twice (mid-sentence, and on its own: "…, Olivia." and "Olivia!"), and stitched into lines like
// "Way to go, ___!" (src/voice/stitch.ts), so the game says it in your voice without it ever being sent anywhere.
import { useEffect, useState, useSyncExternalStore } from 'react'
import { BackButton } from './ui'
import { ISLANDS, type Island } from '../data/islands'
import { useAllIslands } from '../lib/useIsland'
import { BEDTIME_LINES } from '../screens/Bedtime'
import { deleteRecording, hasRecording, lineId, loadRecordings, onRecordingsChange, recordingFor, saveRecording, startRecording, stopRecording } from '../lib/recordings'
import { getProgress, useFamily, useProfiles } from '../lib/progress'
import { setFamilyVoices, speak, stopSpeaking } from '../lib/speech'
import { keys } from '../voice/keys'
import { nameKey } from '../voice/names'
import { playParts } from '../voice/player'

/** Every story line, exactly as the game speaks it (each part's first page includes its title). */
function groups(islands: Island[]) {
  const out: { name: string; lines: string[] }[] = []
  for (const isl of islands) {
    const lines = isl.steps.flatMap((s) => (s.kind === 'story' ? s.pages.map((pg, i) => (i === 0 ? `${s.title}. ${pg.text}` : pg.text)) : []))
    if (lines.length) out.push({ name: isl.name, lines })
  }
  out.push({ name: 'Bedtime', lines: BEDTIME_LINES })
  return out
}

/** A line to record. `text` is what's recorded (its fingerprint); `label` is what's shown, when that's different. */
function Line({ text, label, busy, setBusy }: { text: string; label?: string; busy: string | null; setBusy: (t: string | null) => void }) {
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
      <p>{label ?? text}</p>
      <div className="fv-tools">
        <button onClick={() => (label ? has && playParts([{ audio: recordingFor(text) }]) : speak(text))} disabled={!!busy || (!!label && !has)} aria-label="Listen">▶</button>
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

/** Each child's name: the players (not grown-ups) and the brothers and sisters in the family cast. */
function Names({ busy, setBusy }: { busy: string | null; setBusy: (t: string | null) => void }) {
  const { list } = useProfiles()
  const cast = useFamily()
  const names = [...new Set([...list.filter((p) => !p.grownup).map((p) => p.name.trim()), ...cast.siblings.map((s) => s.name.trim())].filter(Boolean))]
  if (!names.length) return null
  return (
    <section>
      <h3>Names</h3>
      <p className="muted">Say each name twice: once as if in the middle of a sentence, once on its own, happily.</p>
      {names.map((n) => (
        <div key={n}>
          <Line text={keys.name(nameKey(n), 'mid')} label={`…, ${n}.  (in the middle of a sentence)`} busy={busy} setBusy={setBusy} />
          <Line text={keys.name(nameKey(n), 'exclaim')} label={`${n}!  (on its own, excited)`} busy={busy} setBusy={setBusy} />
        </div>
      ))}
    </section>
  )
}

export default function FamilyVoices({ onClose }: { onClose: () => void }) {
  const [busy, setBusy] = useState<string | null>(null)
  const islands = useAllIslands(ISLANDS.map((i) => i.id))
  useEffect(() => {
    loadRecordings()
    setFamilyVoices(true) // so "Listen" plays your recordings here
    return () => { stopSpeaking(); setFamilyVoices(getProgress().familyVoices) }
  }, [])
  return (
    <div className="overlay family-voices">
      <header className="home-head"><BackButton onClick={onClose} /><h2>🎙️ Family voices</h2><span /></header>
      <p className="muted">Tap 🎙️, read the line aloud, then tap ⏹. Your recording plays instead of the narrator wherever that line is said, on every device.</p>
      <div className="fv-list">
        <Names busy={busy} setBusy={setBusy} />
        {!islands && <p className="muted">Getting the stories…</p>}
        {islands && groups(islands).map((g) => (
          <section key={g.name}>
            <h3>{g.name}</h3>
            {g.lines.map((t) => <Line key={t} text={t} busy={busy} setBusy={setBusy} />)}
          </section>
        ))}
      </div>
    </div>
  )
}
