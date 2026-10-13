// The sound check (owner only, Parent Corner): every letter sound, letter name and number 0 to 20 in a house
// voice (Grok's, to begin with), each with ▶ to listen and 🚩 to flag it. A flagged Grok clip is made again
// with its next prompt the next time scripts/warm-house-grok.mjs runs (docs/CLOUD-BRIEF.md, wave 11), so a
// "t" that sounds like "two", or an "n" that's spelled out, can be fixed by ear.
import { useEffect, useMemo, useState } from 'react'
import './Studio.css'
import { BackButton } from '../components/ui'
import { numberWords, PHONICS } from '../lib/spoken'
import { fingerprint, keys } from '../voice/keys'
import { clipAudio, loadHouse } from '../voice/house'
import { playParts } from '../voice/player'
import type { HouseIndex } from '../voice/studio'

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')
interface Row { group: string; label: string; key: string }
const ROWS: Row[] = [
  ...LETTERS.map((l) => ({ group: 'Letter sounds', label: `${l.toUpperCase()}: ${PHONICS[l].say}`, key: keys.sound(l) })),
  ...LETTERS.map((l) => ({ group: 'Letter names', label: l.toUpperCase(), key: keys.letter(l) })),
  ...Array.from({ length: 21 }, (_, n) => [
    { group: 'Numbers', label: `${n} (${numberWords(n)}), in a sentence`, key: keys.number(n, 'mid') },
    { group: 'Numbers', label: `${n}!`, key: keys.number(n, 'exclaim') },
  ]).flat(),
]

export default function SoundCheck({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState<HouseIndex | null>(null)
  const [ids, setIds] = useState<Record<string, string>>({})
  const [voice, setVoice] = useState('grok')
  const [error, setError] = useState('')
  const load = async () => {
    try {
      const r = await fetch('/voice/house/index', { cache: 'no-store' })
      if (!r.ok) throw new Error(String(r.status))
      setIndex(await r.json())
    } catch {
      setError('Couldn’t reach the server. The sound check needs to be online.')
    }
  }
  useEffect(() => {
    load()
    ;(async () => setIds(Object.fromEntries(await Promise.all(ROWS.map(async (r) => [r.key, await fingerprint(r.key)])))))()
  }, [])
  const clips = index?.clips[voice] ?? {}
  const groups = useMemo(() => [...new Set(ROWS.map((r) => r.group))], [])
  const flagged = ROWS.filter((r) => clips[ids[r.key]]?.flagged).length

  const play = (r: Row) => {
    const c = clips[ids[r.key]]
    if (c) playParts([{ audio: clipAudio(voice, ids[r.key], c.at.toString(36)), start: c.start, end: c.end, gain: c.gain }])
  }
  const flag = async (r: Row, on: boolean) => {
    await fetch('/voice/house/flag', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voice, id: ids[r.key], flagged: on }) })
    await load()
    loadHouse()
  }

  return (
    <div className="overlay studio sound-check">
      <header className="home-head"><BackButton onClick={onClose} /><h2>🔤 Sound check</h2><span /></header>
      <p className="muted">Listen to each one. If it sounds wrong (a “t” that sounds like “two”, an “n” spelled out as letters), tap 🚩.
        Flagged {voice === 'grok' ? 'Grok clips are made again, with a different prompt, the next time the Grok warm-up runs on the server' : 'clips show up here to record again in the studio'}.
        {flagged ? ` ${flagged} flagged now.` : ''}</p>
      <div className="studio-bar">
        <label>Voice{' '}
          <select value={voice} onChange={(e) => setVoice(e.target.value)}>
            {Object.entries(index?.voices ?? { grok: { label: 'Grok (Ara)' } }).map(([v, d]) => <option key={v} value={v}>{d.label}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="warn">{error}</p>}
      {index && groups.map((g) => (
        <section key={g} className="sc-group">
          <h3>{g}</h3>
          <div className="sc-grid">
            {ROWS.filter((r) => r.group === g).map((r) => {
              const c = clips[ids[r.key]]
              return (
                <div key={r.key} className={`sc-cell ${c?.flagged ? 'flagged' : ''} ${c ? '' : 'missing'}`}>
                  <button onClick={() => play(r)} disabled={!c} aria-label={`Listen: ${r.label}`}>▶</button>
                  <span>{r.label}{c?.said && voice === 'grok' ? <small> asked: “{c.said}”</small> : null}{!c && <small> not made yet</small>}</span>
                  <button className={`sc-flag ${c?.flagged ? 'on' : ''}`} onClick={() => flag(r, !c?.flagged)} disabled={!c} aria-label={c?.flagged ? 'Unflag' : 'Flag: sounds wrong'}>🚩</button>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
