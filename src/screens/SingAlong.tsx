// Sing-along: pick a song, then Ara sings it while the words light up one by one (great for
// following along and early reading) and her Pal dances to the beat. "I sing!" swaps to the same
// song with the tune on a flute, so she can be the singer. In "Happy Birthday" the game says the
// player's name where it goes (Ara leaves it for the name). Styles: styles.css, "Sing-along".
import { useEffect, useRef, useState } from 'react'
import DressedPal from '../components/DressedPal'
import { BackButton, BigButton, Confetti } from '../components/ui'
import { SONGS, withName, type Song } from '../data/songs'
import { palById, stageFor } from '../data/pals'
import { getProgress, playerName } from '../lib/progress'
import { setMood } from '../lib/music'
import { preload, speak, stopSpeaking } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { familyAsSongs, loadSong, Playback, useFamilySongs, useNameSlot, withTimings } from '../lib/songs'
import { useAlive } from '../lib/useAlive'

/** The index of the last item whose time has come (or -1). */
function lastAt<T>(items: T[], t: number, at: (x: T) => number) {
  let lo = 0, hi = items.length - 1, ans = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (at(items[mid]) <= t) (ans = mid), (lo = mid + 1)
    else hi = mid - 1
  }
  return ans
}

function Buddy({ beat, dancing }: { beat: number; dancing: boolean }) {
  const p = getProgress()
  const pal = palById(p.battler ?? p.starter ?? 'zippy')
  const stage = stageFor(pal, p.pals[pal.id] ?? 0)
  return (
    <div className={`sing-pal ${dancing ? (beat < 0 ? 'sway' : `beat-${beat % 2}`) : ''}`}>
      <DressedPal pal={pal} stage={stage} size={210} outfit={p.outfits[pal.id]} />
      {dancing && beat >= 0 && <span key={beat} className={`sing-note n${beat % 3}`}>{beat % 2 ? '♪' : '♫'}</span>}
    </div>
  )
}

/**
 * One song playing. On an island (`inIsland`, the island's song spot) there's no back button (the
 * island has its own), the button at the end goes on, and `say` sets the song up instead of "Let's sing…".
 */
export function Player({ song: picked, onDone, inIsland, say }: { song: Song; onDone: () => void; inIsland?: boolean; say?: string }) {
  const alive = useAlive()
  const name = playerName()
  const [song, setSong] = useState(() => withName(picked, name))
  const [state, setState] = useState<'loading' | 'playing' | 'paused' | 'done' | 'error'>('loading')
  const [mine, setMine] = useState(false) // "I sing!": the version without Ara
  const mineNow = useRef(false)
  const [pos, setPos] = useState({ line: -1, word: -1, beat: -1 })
  const play = useRef<Playback | null>(null)
  const nameSlot = useNameSlot(song, name, () => !mineNow.current)

  const start = async () => {
    try {
      const buf = await loadSong(picked.audio.ara)
      if (!alive.current) return
      if (picked.audio.sing) loadSong(picked.audio.sing).catch(() => {}) // ready for "I sing!"
      const pb = new Playback(buf)
      pb.onEnd = () => {
        if (!alive.current) return
        setState('done')
        sfx.fanfare()
        speak('Beautiful singing!')
      }
      play.current = pb
      setSong(withName(withTimings(picked, buf.duration), name))
      if (picked.name) preload([`${name}!`])
      await speak(say ?? `Let's sing ${picked.title}!`)
      if (!alive.current) return
      pb.play(0)
      setState('playing')
    } catch {
      if (alive.current) setState('error')
    }
  }

  useEffect(() => {
    start()
    return () => { play.current?.stop() }
  }, [])

  // Follow the song: which line and word are being sung, and the beat (for dancing).
  useEffect(() => {
    if (state !== 'playing') return
    let raf = 0
    const tick = () => {
      const pb = play.current
      if (pb) {
        const t = pb.time()
        const line = lastAt(song.lines, t + 0.25, (l) => l.start)
        const words = song.lines[line]?.words ?? []
        const word = lastAt(words, t + 0.05, (w) => w[1])
        const beat = song.beats ? lastAt(song.beats, t, (b) => b) : -1
        if (pb.playing) nameSlot(t)
        setPos((p) => (p.line === line && p.word === word && p.beat === beat ? p : { line, word, beat }))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [state, song])

  const toggle = () => {
    const pb = play.current
    if (!pb) return
    if (state === 'playing') {
      pb.pause()
      setState('paused')
    } else {
      stopSpeaking()
      pb.play(state === 'done' ? 0 : undefined)
      setState('playing')
    }
  }

  const again = () => {
    stopSpeaking()
    play.current?.play(0)
    setState('playing')
  }

  const switchVoice = async () => {
    const pb = play.current
    if (!pb || !song.audio.sing) return
    const next = !mine
    setMine(next)
    mineNow.current = next
    try {
      const buf = await loadSong(next ? song.audio.sing : song.audio.ara)
      if (alive.current && play.current === pb) pb.swap(buf)
    } catch {
      setMine(!next)
      mineNow.current = !next
    }
  }

  const line = song.lines[pos.line]
  const nextLine = song.lines[pos.line + 1]
  const intro = pos.line < 0
  return (
    <div className="screen sing" style={{ ['--song' as string]: song.color }}>
      <header>
        {inIsland ? <span /> : <BackButton onClick={onDone} />}
        <h2>{song.emoji} {song.title}</h2>
        {song.audio.sing
          ? <button className={`sing-mode ${mine ? 'mine' : ''}`} onClick={() => { sfx.pop(); switchVoice() }} disabled={state === 'loading'}>
              {mine ? '🙋 I sing!' : '🎤 Ara sings'}
            </button>
          : <span />}
      </header>
      <div className="sing-stage">
        <Buddy beat={pos.beat} dancing={state === 'playing'} />
        <div className="sing-words">
          {state === 'loading' && <p className="sing-now ready">🎵 Getting the song ready…</p>}
          {state === 'error' && <p className="sing-now ready">Oh no, the song didn&rsquo;t load. Check the internet and try again.</p>}
          {state !== 'loading' && state !== 'error' && (
            <>
              {intro
                ? <p className="sing-now ready">{state === 'playing' ? '🎶 Get ready…' : '🎶'}</p>
                : <p className="sing-now" key={pos.line}>
                    {line.words.map(([w], k) => (
                      <span key={k} className={`w ${k <= pos.word ? 'sung' : ''} ${k === pos.word && state === 'playing' ? 'now' : ''}`}>{w} </span>
                    ))}
                  </p>}
              {(intro ? song.lines[0] : nextLine) && (
                <p className="sing-next">{(intro ? song.lines[0] : nextLine).words.map(([w]) => w).join(' ')}</p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="sing-controls">
        {state === 'done' ? (
          <>
            <BigButton color="yellow" onClick={again}>🔁 Again!</BigButton>
            {inIsland
              ? <BigButton color="pink" onClick={() => { stopSpeaking(); onDone() }}>➡️</BigButton>
              : <BigButton color="white" onClick={onDone}>🎵 More songs</BigButton>}
          </>
        ) : (
          <>
            <BigButton color="pink" onClick={toggle} disabled={state === 'loading' || state === 'error'}>{state === 'playing' ? '⏸' : '▶️'}</BigButton>
            <BigButton color="white" onClick={again} disabled={state === 'loading' || state === 'error'}>🔁</BigButton>
            {inIsland && state === 'error' && <BigButton color="pink" onClick={onDone}>➡️</BigButton>}
          </>
        )}
      </div>
      {state === 'done' && <Confetti />}
    </div>
  )
}

export default function SingAlong({ onBack }: { onBack: () => void }) {
  const [song, setSong] = useState<Song | null>(null)
  const family = useFamilySongs()
  // (an island's song joins once the island is done)
  const p = getProgress()
  const songs = [...SONGS.filter((s) => !s.island || p.openAll || p.islandsDone.includes(s.island)), ...familyAsSongs(family)]

  useEffect(() => {
    stopSpeaking()
    setMood(null) // the songs bring their own music
    return () => { stopSpeaking(); setMood('home') }
  }, [])
  useEffect(() => {
    if (!song) speak('Pick a song, and let’s sing!')
  }, [song])

  if (song) return <Player key={song.id} song={song} onDone={() => { stopSpeaking(); setSong(null) }} />
  return (
    <div className="screen sing">
      <header><BackButton onClick={onBack} /><h2>🎤 Sing-along!</h2><span /></header>
      <div className="song-grid">
        {songs.map((s) => (
          <button key={s.id} className="song-card" style={{ ['--song' as string]: s.color }}
            onClick={() => { sfx.pop(); setSong(s) }}>
            <span className="song-emoji">{s.emoji}</span>
            <span className="song-title">{s.title}</span>
            {s.family && <span className="song-tag">💗 our song</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
