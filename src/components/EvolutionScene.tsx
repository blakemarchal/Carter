// The big moment when a Pal grows into its next form:
//   intro   the Pal appears on a starry night ("Whoa! Pebble is growing!")
//   glow    it turns into a glowing silhouette while sparkles stream in
//   morph   it flickers between old and new shapes, faster and faster
//   burst   a white flash and light rays
//   reveal  the new form bounces out in color, with its name, confetti and a fanfare
// Other narration waits until it's over, and the music dips. Styles: styles.css, "Evolution".
import { useEffect, useState, type CSSProperties } from 'react'
import PalArt from './PalArt'
import { BigButton, Confetti } from './ui'
import type { PalDef } from '../data/pals'
import { pauseNarration, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { duck } from '../lib/audio'

type Phase = 'intro' | 'glow' | 'morph' | 'burst' | 'reveal'

// Gaps between flickers (ms): slow at first, then faster and faster. Odd count, so it ends on the new form.
const FLICKERS = [420, 360, 300, 250, 210, 175, 145, 120, 100, 85, 72, 62, 55, 50, 45]

function Converge() {
  const [parts] = useState(() => Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2
    const d = 170 + Math.random() * 90
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, delay: Math.random() * 1.2, c: i % 3 ? '✦' : '✨' }
  }))
  return (
    <div className="evo-converge" aria-hidden>
      {parts.map((p, i) => (
        <span key={i} style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, animationDelay: `${p.delay}s` } as CSSProperties}>{p.c}</span>
      ))}
    </div>
  )
}

export default function EvolutionScene({ pal, from, to, onDone }: { pal: PalDef; from: number; to: number; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [showNew, setShowNew] = useState(false)
  const [ready, setReady] = useState(false)
  const oldName = pal.stages[from].name
  const newName = pal.stages[to].name

  useEffect(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    duck(true)
    pauseNarration(true)
    speak(`Whoa! ${oldName} is growing!`, { important: true })
    sfx.sparkle()
    at(1300, () => setPhase('glow'))
    let t = 2000
    at(t, () => setPhase('morph'))
    FLICKERS.forEach((gap, i) => {
      t += gap
      at(t, () => { setShowNew(i % 2 === 0); sfx.evolveTick(i) })
    })
    t += 250
    at(t, () => { setShowNew(true); setPhase('burst'); sfx.evolveBurst() })
    t += 350
    at(t, () => {
      setPhase('reveal')
      sfx.fanfare()
      speak(`${oldName} became ${newName}! Hooray!`, { important: true })
    })
    at(t + 1400, () => setReady(true))
    return () => {
      timers.forEach(clearTimeout)
      duck(false)
      pauseNarration(false)
    }
  }, [])

  const glowing = phase === 'glow' || phase === 'morph' || phase === 'burst'
  return (
    <div className={`evo evo-${phase}`}>
      <div className="evo-stars" aria-hidden />
      <div className="evo-rays" aria-hidden />
      <div className="evo-stage">
        {(phase === 'glow' || phase === 'morph') && <Converge />}
        <div className={`evo-pal ${glowing ? 'silhouette' : ''}`}>
          <PalArt pal={pal} stage={showNew ? to : from} size={260} />
        </div>
      </div>
      <div className="evo-caption">
        {phase === 'reveal'
          ? <h2 className="evo-name">{oldName} became<br /><b>{newName}!</b></h2>
          : <h2 className="evo-text">{phase === 'intro' ? `Whoa! ${oldName} is…` : 'growing!'}</h2>}
        {ready && <BigButton color="pink" onClick={onDone}>Yay! 💖</BigButton>}
      </div>
      {phase === 'reveal' && <Confetti count={50} />}
      <div className="evo-flash" aria-hidden />
    </div>
  )
}
