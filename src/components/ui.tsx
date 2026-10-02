import { useEffect, useRef, useState, type ReactNode } from 'react'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

export function BigButton({ children, onClick, color = 'pink', className = '', disabled }: {
  children: ReactNode; onClick: () => void; color?: 'pink' | 'blue' | 'green' | 'yellow' | 'white'; className?: string; disabled?: boolean
}) {
  return (
    <button className={`big-btn ${color} ${className}`} disabled={disabled}
      onClick={() => { sfx.pop(); onClick() }}>
      {children}
    </button>
  )
}

/** Replays the current instruction. Kids can also tap the instruction text. */
export function SpeakerButton({ text }: { text: string }) {
  return (
    <button className="icon-btn speaker" aria-label="Hear it again" onClick={() => speak(text)}>🔊</button>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return <button className="icon-btn back" aria-label="Back" onClick={() => { sfx.pop(); onClick() }}>⬅️</button>
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
        <span key={i} style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}>{p.char}</span>
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
