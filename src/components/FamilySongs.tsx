// Parent Corner: add your own sing-along songs (a recording you own, plus its words), and set
// when each line starts by tapping along once while it plays. They appear in the Sing-along list
// with "our song" on them, on every device.
import { useEffect, useRef, useState } from 'react'
import { BackButton } from './ui'
import { addFamilySong, deleteFamilySong, familyAudioUrl, loadSong, Playback, saveFamilySong, useFamilySongs, type FamilySong } from '../lib/songs'
import { stopSpeaking } from '../lib/speech'

function Timer({ song, onClose }: { song: FamilySong; onClose: () => void }) {
  const lines = song.lines ?? []
  const play = useRef<Playback | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'playing' | 'done' | 'error'>('loading')
  const [times, setTimes] = useState<number[]>([])
  const [saved, setSaved] = useState('')

  useEffect(() => {
    stopSpeaking()
    loadSong(familyAudioUrl(song))
      .then((buf) => {
        const pb = new Playback(buf)
        pb.onEnd = () => setStatus((s) => (s === 'playing' ? 'done' : s))
        play.current = pb
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
    return () => { play.current?.stop() }
  }, [])

  const begin = () => {
    setTimes([])
    setSaved('')
    play.current?.play(0)
    setStatus('playing')
  }
  const tap = () => {
    const t = play.current?.time() ?? 0
    const next = [...times, Math.round(t * 100) / 100]
    setTimes(next)
    if (next.length >= lines.length) {
      setStatus('done')
    }
  }
  const save = async () => {
    try {
      await saveFamilySong(song.id, { times })
      setSaved('Saved! The words will light up in time.')
      play.current?.pause()
    } catch {
      setSaved('Couldn’t save. Check you’re online and try again.')
    }
  }

  const i = times.length
  return (
    <div className="overlay family-voices">
      <header className="home-head"><BackButton onClick={onClose} /><h2>⏱ {song.title}</h2><span /></header>
      <p className="muted">Press <b>Start</b>, then tap the big button each time a new line begins singing. It takes one listen.</p>
      {status === 'loading' && <p>Loading the recording…</p>}
      {status === 'error' && <p className="warn">Couldn&rsquo;t load the recording.</p>}
      <div className="fs-timer">
        {(status === 'ready' || status === 'done') && <button className="fs-start" onClick={begin}>{times.length ? '↺ Start over' : '▶ Start'}</button>}
        {status === 'playing' && i < lines.length && (
          <button className="fs-tap" onClick={tap}>
            <small>Tap when this line starts ({i + 1} of {lines.length}):</small>
            {lines[i]}
          </button>
        )}
        {status === 'done' && times.length >= lines.length && <button className="fs-start on" onClick={save}>✓ Save timing</button>}
        {status === 'done' && times.length < lines.length && <p className="warn">The song ended before every line was tapped. Start over to try again.</p>}
        {saved && <p className="muted">{saved}</p>}
      </div>
      <ol className="fs-lines">
        {lines.map((l, k) => <li key={k} className={k < i ? 'done' : k === i ? 'now' : ''}>{l}{times[k] !== undefined && <span> · {times[k].toFixed(1)}s</span>}</li>)}
      </ol>
    </div>
  )
}

export default function FamilySongs() {
  const list = useFamilySongs()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [words, setWords] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [timing, setTiming] = useState<string | null>(null)
  const timingSong = list.find((s) => s.id === timing)

  const add = async () => {
    const lines = words.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!title.trim() || !lines.length || !file) return setStatus('Add a title, the words, and a recording.')
    if (file.size > 20 * 1024 * 1024) return setStatus('That recording is too big (20 MB at most).')
    setStatus('Uploading…')
    try {
      const id = await addFamilySong(title.trim(), lines, file)
      setStatus('')
      setAdding(false)
      setTitle(''); setWords(''); setFile(null)
      setTiming(id)
    } catch {
      setStatus('Couldn’t upload it. mp3 and m4a recordings work best; check you’re online.')
    }
  }

  return (
    <section>
      <h3>Sing-along songs</h3>
      <p>Ara sings 6 songs built into the game. You can add your own too: any recording you own (an mp3 or m4a, like a song you bought or recorded), plus its words. Then tap along once so the words light up in time.</p>
      {list.length > 0 && (
        <div className="backup-list">
          {list.map((s) => (
            <div key={s.id} className="backup-row">
              <div><b>{s.title || 'Untitled'}</b> · {(s.lines ?? []).length} lines<br />
                <span className="muted">{!s.audio ? 'No recording' : s.times?.length ? 'Timed ✓' : 'Needs timing (the words will be spread evenly until then)'}</span>
              </div>
              <div className="level-row">
                {s.audio && <button onClick={() => setTiming(s.id)}>⏱ Set timing</button>}
                <button className="danger" onClick={() => confirm(`Delete “${s.title}”?`) && deleteFamilySong(s.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!adding
        ? <div className="level-row"><button onClick={() => setAdding(true)}>➕ Add a song</button></div>
        : (
          <div className="fs-form">
            <label>Title <input value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} placeholder="Jesus Loves Me (our version)" /></label>
            <label>Words, one line each <textarea rows={6} value={words} onChange={(e) => setWords(e.target.value)} placeholder={'Jesus loves me, this I know\nFor the Bible tells me so'} /></label>
            <label>Recording <input type="file" accept="audio/*,.mp3,.m4a" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
            <div className="level-row">
              <button className="on" onClick={add}>Upload</button>
              <button onClick={() => { setAdding(false); setStatus('') }}>Cancel</button>
            </div>
          </div>
        )}
      {status && <p className="muted">{status}</p>}
      {timingSong && <Timer song={timingSong} onClose={() => setTiming(null)} />}
    </section>
  )
}
