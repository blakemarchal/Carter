// The studio's song mode: the child sings along with a song's "I sing!" flute version, through headphones, and
// the recording is laid onto the flute track where it was sung (src/voice/song-take.ts). The words light up as
// the song plays, on the song's own timings. Listen back, nudge it earlier or later if it sounds off, keep it.
// It then plays in the sing-along as that voice's version: for the owner's family only, unless the owner shares it.
import { useEffect, useRef, useState } from 'react'
import { ac } from '../lib/audio'
import { loadSong, Playback } from '../lib/songs'
import { SONGS } from '../data/songs'
import { checkTake, saveUrl } from '../voice/studio'
import { mixedBuffer, songStartInRecording } from '../voice/song-take'
import type { ScriptItem } from '../voice/script'

type Take = { blob: Blob; vocal: AudioBuffer; start: number; gain: number }

export default function SongTake({ item, voice, id, recorded, onSaved }: { item: ScriptItem; voice: string; id: string; recorded: boolean; onSaved: () => void }) {
  const song = SONGS.find((s) => s.id === item.song)!
  const [phase, setPhase] = useState<'idle' | 'singing' | 'review' | 'saving'>('idle')
  const [take, setTake] = useState<Take | null>(null)
  const [error, setError] = useState('')
  const [pos, setPos] = useState<{ line: number; word: number }>({ line: -1, word: -1 })
  const pb = useRef<Playback | null>(null)
  const rec = useRef<{ r: MediaRecorder; chunks: Blob[]; started: number; songStarted: number } | null>(null)

  const stopAll = () => {
    pb.current?.stop()
    pb.current = null
  }
  useEffect(() => () => { stopAll(); rec.current?.r.state === 'recording' && rec.current.r.stop() }, [])

  // The word being sung now, from the song's own timings.
  useEffect(() => {
    if (phase !== 'singing' && phase !== 'review') return
    let raf = 0
    const tick = () => {
      const t = pb.current?.time() ?? 0
      const line = song.lines.findLastIndex((l) => l.start <= t + 0.2)
      const word = line < 0 ? -1 : song.lines[line].words.findLastIndex(([, at]) => at <= t + 0.05)
      setPos((p) => (p.line === line && p.word === word ? p : { line, word }))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, song])

  const sing = async () => {
    setError('')
    if (!song.audio.sing) return setError('This song has no flute version to sing along with.')
    try {
      const [backing, stream] = await Promise.all([
        loadSong(song.audio.sing),
        navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }),
      ])
      const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find((t) => MediaRecorder.isTypeSupported(t))
      const r = new MediaRecorder(stream, type ? { mimeType: type } : undefined)
      const chunks: Blob[] = []
      r.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
      r.onstop = () => finish(stream, r, chunks, backing)
      r.onstart = () => {
        const started = performance.now()
        const c = ac()
        const p = new Playback(backing)
        p.onEnd = () => { if (r.state === 'recording') r.stop() }
        pb.current = p
        p.play(0)
        // (when the song started, on the same clock as the recording)
        const ts = c.getOutputTimestamp?.()
        const songStarted = ts?.performanceTime !== undefined && ts.contextTime !== undefined ? ts.performanceTime + (c.currentTime - ts.contextTime) * 1000 : performance.now()
        rec.current = { r, chunks, started, songStarted }
        setPhase('singing')
      }
      r.start()
    } catch {
      setError('The microphone isn’t available. Allow it in Settings → Safari → Microphone.')
    }
  }

  const finish = async (stream: MediaStream, r: MediaRecorder, chunks: Blob[], backing: AudioBuffer) => {
    stream.getTracks().forEach((t) => t.stop())
    stopAll()
    const info = rec.current
    if (!info || !chunks.length) { setPhase('idle'); return setError('Nothing was recorded. Try again.') }
    const blob = new Blob(chunks, { type: r.mimeType || 'audio/webm' })
    try {
      const c = ac()
      const vocal = await c.decodeAudioData(await blob.arrayBuffer())
      const start = songStartInRecording({ recordingStarted: info.started, songStarted: info.songStarted, outputLatency: c.outputLatency || c.baseLatency || 0 })
      const level = checkTake(vocal.getChannelData(0), vocal.sampleRate)
      const t = { blob, vocal, start, gain: Math.min(level.gain, 2) }
      setTake(t)
      setPhase('review')
      listen(t, backing)
    } catch {
      setPhase('idle')
      setError('That take couldn’t be played back. Try again.')
    }
  }

  const listen = async (t: Take, backing?: AudioBuffer) => {
    stopAll()
    const flute = backing ?? (await loadSong(song.audio.sing!))
    const p = new Playback(mixedBuffer(ac(), flute, t.vocal, t.start, t.gain))
    pb.current = p
    p.play(0)
  }
  const nudge = (ms: number) => {
    if (!take) return
    const t = { ...take, start: Math.max(0, take.start + ms) }
    setTake(t)
    listen(t)
  }
  const stop = () => {
    if (phase === 'singing') rec.current?.r.stop()
    else stopAll()
  }
  const keep = async () => {
    if (!take) return
    stopAll()
    setPhase('saving')
    try {
      const r = await fetch(saveUrl(voice, id, item, { start: take.start, end: 0, gain: take.gain }), { method: 'PUT', headers: { 'Content-Type': take.blob.type.split(';')[0] }, body: take.blob })
      if (!r.ok) throw new Error(String(r.status))
      setTake(null)
      setPhase('idle')
      onSaved()
    } catch {
      setPhase('review')
      setError('Couldn’t save it. Check you’re online and try again.')
    }
  }

  return (
    <section className="studio-line studio-song noprint">
      <p className="studio-where">{item.where}{recorded ? ' · recorded ✓' : ''}</p>
      <p className="studio-say">{song.emoji} {song.title}</p>
      <p className="studio-context">🎧 Put on headphones, then sing along with the flute. The words light up as you go.</p>
      {(phase === 'singing' || phase === 'review') && (
        <p className="studio-words">
          {pos.line < 0 ? '🎶' : song.lines[pos.line].words.map(([w], k) => <span key={k} className={k === pos.word ? 'now' : k < pos.word ? 'sung' : ''}>{w} </span>)}
        </p>
      )}
      <div className="studio-tools">
        {phase === 'idle' && <button className="studio-rec" onClick={sing}>{recorded ? '🎤 Sing it again' : '🎤 Sing!'}</button>}
        {(phase === 'singing' || phase === 'review') && <button onClick={stop}>⏹ Stop</button>}
        {phase === 'review' && take && (
          <>
            <button onClick={() => listen(take)}>▶ Listen</button>
            <button onClick={() => nudge(-40)} aria-label="Voice earlier">⏪ Earlier</button>
            <button onClick={() => nudge(40)} aria-label="Voice later">Later ⏩</button>
            <button className="studio-keep" onClick={keep}>✓ Keep</button>
            <button onClick={sing}>🎤 Again</button>
          </>
        )}
        {phase === 'saving' && <button disabled>Saving…</button>}
      </div>
      {phase === 'review' && <p className="muted">If the singing sounds a little ahead of the flute or behind it, nudge it, then listen again.</p>}
      {error && <p className="warn">{error}</p>}
    </section>
  )
}
