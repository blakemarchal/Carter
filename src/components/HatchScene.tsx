// The mystery egg hatching: it wobbles harder and harder, cracks, flashes, and a legendary Pal
// pops out. Shares the evolution scene's starry night and styles (styles.css, "Evolution").
import { useEffect, useState } from 'react'
import PalArt from './PalArt'
import { BigButton, Confetti } from './ui'
import type { PalDef } from '../data/pals'
import { pauseNarration, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { duck } from '../lib/audio'

export function Egg({ cracks = 0, size = 200, className = '' }: { cracks?: number; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 200 220" width={size} height={size * 1.1} className={className} aria-hidden>
      <ellipse cx={100} cy={120} rx={70} ry={90} fill="#fff7fb" stroke="#f0c4da" strokeWidth={5} />
      <circle cx={70} cy={90} r={14} fill="#c9a8ff" opacity={0.7} />
      <circle cx={130} cy={140} r={18} fill="#7cc6ff" opacity={0.6} />
      <circle cx={92} cy={170} r={11} fill="#ff9ccc" opacity={0.7} />
      <path d="M118 66 l5 10 l11 1 l-8 7 l3 11 l-11 -6 l-10 6 l3 -11 l-8 -7 l11 -1Z" fill="#ffd34d" />
      {cracks >= 1 && <path d="M60 110 L80 100 L72 122 L95 112" stroke="#8a7a99" strokeWidth={4} fill="none" strokeLinecap="round" />}
      {cracks >= 2 && <path d="M105 112 L122 126 L118 104 L140 112" stroke="#8a7a99" strokeWidth={4} fill="none" strokeLinecap="round" />}
      {cracks >= 3 && <path d="M40 120 L58 128 L66 112 L84 132 L100 116 L118 134 L134 116 L150 130 L160 118" stroke="#6f5f80" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

type Phase = 'wobble' | 'crack' | 'burst' | 'reveal'

export default function HatchScene({ pal, onDone }: { pal: PalDef; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('wobble')
  const [cracks, setCracks] = useState(0)
  const [ready, setReady] = useState(false)
  const name = pal.stages[0].name

  useEffect(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    duck(true)
    pauseNarration(true)
    speak('The egg is hatching!', { important: true })
    ;[600, 1400, 2200].forEach((ms, i) => at(ms, () => { setCracks(i + 1); setPhase('crack'); sfx.evolveTick(i * 4) }))
    at(3000, () => { setPhase('burst'); sfx.evolveBurst() })
    at(3350, () => {
      setPhase('reveal')
      sfx.fanfare()
      speak(`It's ${name}! A legendary Pal! ${name} joined your ark!`, { important: true })
    })
    at(4800, () => setReady(true))
    return () => { timers.forEach(clearTimeout); duck(false); pauseNarration(false) }
  }, [])

  return (
    <div className={`evo evo-${phase === 'reveal' ? 'reveal' : phase === 'burst' ? 'burst' : 'glow'}`}>
      <div className="evo-stars" aria-hidden />
      <div className="evo-rays" aria-hidden />
      <div className="evo-stage">
        {phase === 'reveal'
          ? <div className="evo-pal"><PalArt pal={pal} size={260} /></div>
          : <Egg cracks={cracks} size={220} className={`hatch-egg ${phase}`} />}
      </div>
      <div className="evo-caption">
        <h2 className={phase === 'reveal' ? 'evo-name' : 'evo-text'}>
          {phase === 'reveal' ? <>A legendary Pal!<br /><b>{name}!</b></> : 'The egg is hatching!'}
        </h2>
        {ready && <BigButton color="pink" onClick={onDone}>Yay! 💖</BigButton>}
      </div>
      {phase === 'reveal' && <Confetti count={60} />}
      <div className="evo-flash" aria-hidden />
    </div>
  )
}
