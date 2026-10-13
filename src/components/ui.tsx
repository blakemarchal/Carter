import { useEffect, useRef, useState, type ReactNode } from 'react'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import Pic from './Pic'

export function BigButton({ children, onClick, color = 'pink', className = '', disabled, 'aria-label': label }: {
  children: ReactNode; onClick: () => void; color?: 'pink' | 'blue' | 'green' | 'yellow' | 'white'; className?: string; disabled?: boolean
  /** What it does, for a button that's only a picture (the arrows). */
  'aria-label'?: string
}) {
  return (
    <button className={`big-btn ${color} ${className}`} disabled={disabled} aria-label={label}
      onClick={() => { sfx.pop(); onClick() }}>
      {children}
    </button>
  )
}

/** Replays the current instruction. Kids can also tap the instruction text. */
export function SpeakerButton({ text }: { text: string }) {
  return (
    <button className="icon-btn speaker" aria-label="Hear it again" onClick={() => speak(text)}><Icon kind="speaker" /></button>
  )
}

/** A drawn arrow (the ⬅️ and ➡️ emoji look different on every device: a blue square on Windows). */
export function Arrow({ dir = 'right' }: { dir?: 'left' | 'right' }) {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true" style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Drawn play, pause, again, speaker and check icons (the emoji look different on every device: blue squares on Windows). */
export function Icon({ kind }: { kind: 'play' | 'pause' | 'again' | 'speaker' | 'check' }) {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
      {kind === 'play' && <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />}
      {kind === 'pause' && <><rect x="5.5" y="4.5" width="4.5" height="15" rx="1.5" fill="currentColor" /><rect x="14" y="4.5" width="4.5" height="15" rx="1.5" fill="currentColor" /></>}
      {kind === 'speaker' && <><path d="M3.5 9.5h4l5-4.5v14l-5-4.5h-4z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16 8.5q2.2 3.5 0 7M18.6 6q4 6 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></>}
      {kind === 'check' && <path d="M4.5 12.5l5 5 10-11" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />}
      {kind === 'again' && <><path d="M19 12a7 7 0 1 1-2.05-4.95" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M20 3.5v5h-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></>}
    </svg>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return <button className="icon-btn back" aria-label="Back" onClick={() => { sfx.pop(); onClick() }}><Arrow dir="left" /></button>
}

export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="step-dots">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={i < current ? 'done' : i === current ? 'now' : ''} />
      ))}
    </div>
  )
}

export function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useRef(
    Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      dur: 1.8 + Math.random() * 1.5,
      char: ['💖', '⭐', '🌸', '✨', '🎀', '🌈'][Math.floor(Math.random() * 6)],
    })),
  )
  return (
    <div className="confetti" aria-hidden>
      {pieces.current.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}><Pic e={p.char} /></span>
      ))}
    </div>
  )
}

/** Press and hold for `ms` to activate — keeps little fingers out of the parent area. */
export function HoldButton({ children, onHold, ms = 3000, className = '' }: {
  children: ReactNode; onHold: () => void; ms?: number; className?: string
}) {
  const [held, setHeld] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const start = () => {
    setHeld(true)
    timer.current = window.setTimeout(() => { setHeld(false); onHold() }, ms)
  }
  const cancel = () => { setHeld(false); clearTimeout(timer.current) }
  useEffect(() => () => clearTimeout(timer.current), [])
  return (
    <button className={`icon-btn hold ${held ? 'holding' : ''} ${className}`} style={{ ['--hold-ms' as string]: `${ms}ms` }}
      onPointerDown={start} onPointerUp={cancel} onPointerLeave={cancel} onContextMenu={(e) => e.preventDefault()}>
      {children}
    </button>
  )
}
