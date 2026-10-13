// The recording studio (owner only): the house voices record the game's lines, once, for every family
// (docs/CLOUD-BRIEF.md, wave 10). Choose a voice and a queue, then go line by line: big words, record, listen,
// retake, keep. Each take's silence is trimmed and its level set before it's saved. Progress per queue, flags on
// lines whose words changed since they were recorded, and a printable script made from the same list.
// Keys: Space or R records and stops, P plays, Enter keeps and goes on, ← → move between lines.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Studio.css'
import { BackButton } from '../components/ui'
import { ac } from '../lib/audio'
import { startRecording, stopRecording } from '../lib/recordings'
import { ISLANDS, loadIsland } from '../data/islands'
import { fingerprint } from '../voice/keys'
import { libraryName } from '../voice/names'
import { clipAudio, loadHouse } from '../voice/house'
import { playParts, stopParts } from '../voice/player'
import { buildScript, QUEUE_NAMES, QUEUES, scriptCounts, type Queue, type ScriptItem } from '../voice/script'
import { byRef, checkTake, lineStatus, progress, saveUrl, scriptLines, WARNINGS, type HouseIndex, type TakeCheck } from '../voice/studio'
import SongTake from '../components/SongTake'

type Take = { blob: Blob; audio: ArrayBuffer; check: TakeCheck }
const fmt = (n: number) => n.toLocaleString()
const mins = (n = 0) => (n < 1 ? 'under a minute' : `about ${fmt(n)} min`)

export default function Studio({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<ScriptItem[] | null>(null)
  const [ids, setIds] = useState<Map<ScriptItem, string>>(new Map())
  const [index, setIndex] = useState<HouseIndex | null>(null)
  const [voice, setVoice] = useState('mom')
  const [queue, setQueue] = useState<Queue>('praise')
  const [onlyTodo, setOnlyTodo] = useState(true)
  const [at, setAt] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'recording' | 'review' | 'saving'>('idle')
  const [take, setTake] = useState<Take | null>(null)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [used, setUsed] = useState<{ name: string; families: number }[]>([])
  const [missed, setMissed] = useState<{ line: string; count: number; last: number }[]>([])
  const loadMissed = () => fetch('/voice/missed', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : [])).then(setMissed).catch(() => {})
  useEffect(() => { loadMissed() }, [])

  const loadIndex = useCallback(async () => {
    try {
      const r = await fetch('/voice/house/index', { cache: 'no-store' })
      if (!r.ok) throw new Error(String(r.status))
      setIndex(await r.json())
    } catch {
      setError('Couldn’t reach the server. The studio needs to be online.')
    }
  }, [])

  useEffect(() => {
    loadIndex()
    ;(async () => {
      const islands = await Promise.all(ISLANDS.map((i) => loadIsland(i.id)))
      // (children's names families use, 3 or more families each: the ones not in the library go first)
      const inUse: { name: string; families: number }[] = await fetch('/voice/names', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : [])).catch(() => [])
      const missing = inUse.filter((n) => !libraryName(n.name))
      setUsed(missing)
      const all = buildScript(islands, { extraNames: missing.map((n) => n.name) })
      const m = new Map<ScriptItem, string>()
      for (const it of all) m.set(it, await fingerprint(it.key))
      setIds(m)
      setItems(all)
    })().catch(() => setError('Couldn’t load the game’s lines.'))
    return () => { stopParts(); stopRecording().catch(() => {}) }
  }, [loadIndex])

  const clips = index?.clips[voice] ?? {}
  const refs = useMemo(() => byRef(clips), [clips])
  const mine = useMemo(() => (items ?? []).filter((i) => i.voice === voice), [items, voice])
  const counts = useMemo(() => progress(mine, ids, clips), [mine, ids, clips])
  const inQueue = useMemo(() => mine.filter((i) => i.queue === queue), [mine, queue])
  const list = useMemo(
    () => (onlyTodo ? inQueue.filter((i) => lineStatus(i, ids.get(i)!, clips, refs) !== 'done') : inQueue),
    // (the list stays put while a line is being recorded: it's worked through in order)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inQueue, onlyTodo, items, voice, queue, index?.version],
  )
  const item = list[Math.min(at, list.length - 1)] as ScriptItem | undefined
  const id = item ? ids.get(item)! : ''
  const status = item ? lineStatus(item, id, clips, refs) : 'todo'
  const recorded = id ? clips[id] : undefined
  const voices = Object.entries(index?.voices ?? {})

  useEffect(() => { setAt(0); setTake(null); setPhase('idle') }, [voice, queue, onlyTodo])

  const listen = (t: Take) => playParts([{ audio: t.audio, start: t.check.start, end: t.check.end, gain: t.check.gain }])
  const record = async () => {
    setError('')
    if (phase === 'recording') {
      const blob = await stopRecording()
      if (!blob) { setPhase('idle'); return setError('Nothing was recorded. Try again.') }
      const audio = await blob.arrayBuffer()
      try {
        const buf = await ac().decodeAudioData(audio.slice(0))
        const t = { blob, audio, check: checkTake(buf.getChannelData(0), buf.sampleRate) }
        setTake(t)
        setPhase('review')
        if (t.check.warning !== 'empty') listen(t)
      } catch {
        setPhase('idle')
        setError('That take couldn’t be played back. Try again.')
      }
      return
    }
    try {
      stopParts()
      await startRecording()
      setTake(null)
      setPhase('recording')
    } catch {
      setError('The microphone isn’t available. Allow it in Settings → Safari → Microphone.')
    }
  }
  const keep = async () => {
    if (!item || !take || phase !== 'review') return
    setPhase('saving')
    try {
      const r = await fetch(saveUrl(voice, id, item, take.check), { method: 'PUT', headers: { 'Content-Type': take.blob.type.split(';')[0] }, body: take.blob })
      if (!r.ok) throw new Error(String(r.status))
      await loadIndex()
      loadHouse()
      setTake(null)
      setPhase('idle')
      if (!onlyTodo) setAt((a) => Math.min(a + 1, list.length - 1))
    } catch {
      setPhase('review')
      setError('Couldn’t save it. Check you’re online and try again.')
    }
  }
  const playRecorded = () => {
    if (take) return listen(take)
    if (recorded) playParts([{ audio: clipAudio(voice, id, recorded.at.toString(36)), start: recorded.start, end: recorded.end, gain: recorded.gain }])
  }
  const move = (d: number) => { stopParts(); setTake(null); setPhase('idle'); setAt((a) => Math.max(0, Math.min(list.length - 1, a + d))) }
  const share = async (on: boolean) => {
    await fetch('/voice/house/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voice, id, shared: on }) })
    await loadIndex()
  }
  const rename = async () => {
    const label = prompt('What should this voice be called? (Shown in the studio, and in the sing-along as “<name>’s version”.)', index?.voices[voice]?.label ?? '')
    if (!label?.trim()) return
    await fetch('/voice/house/voice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voice, label: label.trim() }) })
    await loadIndex()
    loadHouse()
  }
  const promote = async () => {
    if (!confirm('Copy your family’s own Family voices recordings into Mom’s house voice, for every family? Lines she has already recorded in the studio stay as they are.')) return
    const r = await fetch('/voice/house/promote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voice: 'mom' }) })
    if (r.ok) {
      const { copied, had } = await r.json()
      setNote(`${copied} recordings copied into Mom’s voice${had ? ` (${had} she had already)` : ''}.`)
      await loadIndex()
      loadHouse()
    }
  }

  // Keys, for recording with a keyboard (or a page-turner pedal).
  const keys = useRef({ record, keep, move, playRecorded })
  keys.current = { record, keep, move, playRecorded }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'SELECT' || item?.song) return
      const k = keys.current
      if (e.key === ' ' || e.key === 'r') { e.preventDefault(); k.record() }
      else if (e.key === 'Enter') { e.preventDefault(); k.keep() }
      else if (e.key === 'ArrowRight') k.move(1)
      else if (e.key === 'ArrowLeft') k.move(-1)
      else if (e.key === 'p') k.playRecorded()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item])

  const totals = items ? scriptCounts(mine)[voice] ?? {} : {}
  const label = index?.voices[voice]?.label ?? voice
  const isPrivate = !!index?.voices[voice]?.private

  return (
    <div className="overlay studio">
      <header className="home-head noprint"><BackButton onClick={onClose} /><h2>🎚️ Recording studio</h2><span /></header>
      {error && <p className="warn noprint">{error}</p>}
      {!items || !index ? <p className="muted">Getting every line in the game…</p> : (
        <>
          <div className="studio-bar noprint">
            <label>Voice{' '}
              <select value={voice} onChange={(e) => setVoice(e.target.value)}>
                {voices.map(([v, d]) => <option key={v} value={v}>{d.label}{d.private ? ' (our family only)' : ''}</option>)}
              </select>
            </label>
            <button onClick={rename}>Rename voice</button>
            <label className="studio-check"><input type="checkbox" checked={onlyTodo} onChange={(e) => setOnlyTodo(e.target.checked)} /> Only lines still to record</label>
            <button onClick={() => window.print()}>🖨️ Print this script</button>
            {voice === 'mom' && <button onClick={promote}>Copy our Family voices into Mom’s voice</button>}
          </div>
          {note && <p className="muted noprint">{note}</p>}
          <nav className="studio-queues noprint">
            {QUEUES.filter((q) => counts[q]).map((q) => (
              <button key={q} className={q === queue ? 'on' : ''} onClick={() => setQueue(q)}>
                <b>{QUEUE_NAMES[q]}</b>
                <span>{fmt(counts[q]!.done)} of {fmt(counts[q]!.total)}{counts[q]!.changed ? ` · ${counts[q]!.changed} changed` : ''}</span>
                <span className="muted">{mins(totals[q]?.minutes)}</span>
              </button>
            ))}
          </nav>

          {queue === 'names' && used.length > 0 && (
            <p className="muted noprint">Names families use that aren’t in the library yet (first in this queue): {used.map((n) => `${n.name} (${n.families} families)`).join(', ')}.</p>
          )}
          {!item ? <p className="studio-done noprint">Every line in {QUEUE_NAMES[queue]} is recorded. Thank you!</p> : item.song ? (
            <SongTake key={item.song} item={item} voice={voice} id={id} recorded={!!recorded} onSaved={async () => { await loadIndex(); loadHouse() }} />
          ) : (
            <section className={`studio-line noprint ${status}`}>
              <p className="studio-where">{at + 1} of {fmt(list.length)} · {item.where}{status === 'changed' && <b> · the words changed since this was recorded</b>}</p>
              {status === 'changed' && refs.get(item.ref)?.said && <p className="studio-was">It was: “{refs.get(item.ref)!.said}”</p>}
              <p className="studio-say">{item.say}</p>
              {item.context && <p className="studio-context">{item.context}</p>}
              <div className="studio-tools">
                <button onClick={() => move(-1)} disabled={at === 0 || phase === 'recording'} aria-label="Previous line">←</button>
                <button className={`studio-rec ${phase === 'recording' ? 'on' : ''}`} onClick={record} disabled={phase === 'saving'}>{phase === 'recording' ? '⏹ Stop' : take || recorded ? '🎙️ Retake' : '🎙️ Record'}</button>
                <button onClick={playRecorded} disabled={!take && !recorded}>▶ Listen</button>
                <button className="studio-keep" onClick={keep} disabled={phase !== 'review' || take?.check.warning === 'empty'}>{phase === 'saving' ? 'Saving…' : '✓ Keep'}</button>
                <button onClick={() => move(1)} disabled={at >= list.length - 1 || phase === 'recording'} aria-label="Next line">→</button>
              </div>
              {take?.check.warning && <p className="warn">{WARNINGS[take.check.warning]}</p>}
              {take && !take.check.warning && <p className="muted">Trimmed to {((take.check.end - take.check.start) / 1000).toFixed(1)} s, level set. Keep it, or record again.</p>}
              {recorded && !take && <p className="muted">Recorded {new Date(recorded.at).toLocaleDateString()}.{recorded.promoted ? ' (copied from Family voices)' : ''}</p>}
              {isPrivate && recorded && (
                <label className="studio-check"><input type="checkbox" checked={!!recorded.shared} onChange={(e) => share(e.target.checked)} /> Share this {label} recording with every family (otherwise it’s for our family only)</label>
              )}
              <p className="muted">Space or R: record and stop · P: listen · Enter: keep · ← →: move</p>
            </section>
          )}

          <section className="studio-missed noprint">
            <h3>Lines that fell to the device voice</h3>
            {missed.length ? (
              <>
                <p className="muted">Heard on our own (the owner’s) devices with no recording or Grok clip. The next Grok warm-up on the server adds them:
                  <code> node scripts/warm-house-grok.mjs --missed</code></p>
                <ol>{missed.map((m) => <li key={m.line}>{m.line} <span className="muted">({m.count}×)</span></li>)}</ol>
                <button onClick={async () => { if (confirm('Clear this list? (Do it after the warm-up has made them.)')) { await fetch('/voice/missed', { method: 'DELETE' }); loadMissed() } }}>Clear the list</button>
              </>
            ) : <p className="muted">None so far: everything our devices said had a voice.</p>}
          </section>

          <section className="studio-print">
            <h2>Ark Pals: {label}, {QUEUE_NAMES[queue]}</h2>
            <p>{fmt(inQueue.length)} lines, {mins(totals[queue]?.minutes)}. Read each as written; where a line says how, say it that way.</p>
            <ol>{scriptLines(inQueue).map((l, i) => <li key={i}>{l.replace(/^\d+\. /, '')}</li>)}</ol>
          </section>
        </>
      )}
    </div>
  )
}
