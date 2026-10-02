// Battle move animations, drawn over the arena from the player's Pal (`from`) to the grumpy
// creature (`to`), both given as % of the arena. Every move lands about 0.6 s in (sfx.move uses the
// same timing), and the whole effect is over by 1.6 s. Styles are in styles.css under "Battle moves".
import { useState, type CSSProperties, type ReactElement } from 'react'
import type { MoveFx as Fx } from '../data/pals'

export interface Pt { x: number; y: number }
interface Ends { from: Pt; to: Pt; big?: boolean }

/** Particles flying out from a point. */
function Burst({ x, y, chars, n = 12, dist = 90, delay = 0.6, size = 30 }: {
  x: number; y: number; chars: string[]; n?: number; dist?: number; delay?: number; size?: number
}) {
  // Placed once, so re-renders don't reshuffle them mid-flight.
  const [parts] = useState(() => Array.from({ length: n }, (_, i) => {
    const a = ((360 / n) * i + Math.random() * 20) * (Math.PI / 180)
    const d = dist * (0.6 + Math.random() * 0.6)
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, c: chars[i % chars.length], s: size * (0.7 + Math.random() * 0.6) }
  }))
  return (
    <div className="fx-burst" style={{ left: `${x}%`, top: `${y}%` }}>
      {parts.map((p, i) => (
        <span key={i} style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, fontSize: p.s, animationDelay: `${delay}s` } as CSSProperties}>{p.c}</span>
      ))}
    </div>
  )
}

function Spark({ from, to, big }: Ends) {
  // A zig-zag bolt, drawn on from the Pal to the creature; a white core over a golden glow.
  // Zig-zag between the two Pals: alternate above and below the straight line.
  const pts = Array.from({ length: 8 }, (_, i) => {
    const f = i / 7
    const x = from.x + (to.x - from.x) * f
    const y = from.y + (to.y - from.y) * f - 12 + (i === 0 || i === 7 ? 0 : i % 2 ? -10 : 8)
    return `${x},${y}`
  }).join(' ')
  return (
    <>
      <svg className="fx-bolt" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={pts} className="glow" vectorEffect="non-scaling-stroke" />
        <polyline points={pts} className="core" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="fx-flash yellow" />
      <Burst x={to.x} y={to.y} chars={['✦', '⚡', '✨']} n={big ? 26 : 14} dist={big ? 150 : 90} />
    </>
  )
}

function Flame({ from, to, big }: Ends) {
  // A fireball arcs over (outer element moves across, inner one rises and falls), trailing embers.
  return (
    <>
      {[0, 0.06, 0.12, 0.18].map((d, i) => (
        <div key={i} className={`fx-arc ${i ? 'ember' : ''}`} style={{ animationDelay: `${d}s`, left: `${from.x}%`, top: `${from.y}%` }}>
          <div className="fx-arc-y" style={{ animationDelay: `${d}s` }}><div className={i ? 'fx-ember' : 'fx-fireball'} /></div>
        </div>
      ))}
      <div className="fx-glow orange" style={{ left: `${to.x}%`, top: `${to.y}%` }} />
      <Burst x={to.x} y={to.y} chars={['🔥', '✨']} n={big ? 22 : 10} dist={big ? 140 : 70} />
    </>
  )
}

/** A chunky grey rock (drawn, so it looks the same on every device). */
const RockShape = () => (
  <svg viewBox="0 0 60 50" width={64} height={54}>
    <path d="M6 46 L2 30 L14 12 L32 4 L50 12 L58 30 L54 46 Z" fill="#a9a39b" stroke="#6f685f" strokeWidth={3} strokeLinejoin="round" />
    <path d="M16 18 L30 10 L40 16" stroke="#d6d0c7" strokeWidth={4} fill="none" strokeLinecap="round" />
  </svg>
)

function Rock({ to, big }: Ends) {
  // The Pal stomps (arena shakes, see .arena.fx-rock), then rocks pop up under the creature.
  return (
    <>
      {(big ? [-15, -7.5, 0, 7.5, 15] : [-9, 0, 9]).map((dx, i) => (
        <div key={i} className="fx-rock" style={{ left: `${to.x + dx}%`, animationDelay: `${0.55 + i * 0.1}s` }}><RockShape /></div>
      ))}
      <Burst x={to.x} y={88} chars={['💨']} n={6} dist={60} delay={0.5} />
    </>
  )
}

function Leaf({ from, to }: Ends) {
  return (
    <>
      {[0, 0.12, 0.24, 0.36, 0.48].map((d, i) => (
        <div key={i} className="fx-arc leaf" style={{ animationDelay: `${d}s`, left: `${from.x}%`, top: `${from.y - 10 + i * 4}%` }}>
          <div className="fx-wave" style={{ animationDelay: `${d}s` }}>🍃</div>
        </div>
      ))}
      <Burst x={to.x} y={to.y} chars={['🌿', '✨']} n={8} dist={60} delay={0.9} />
    </>
  )
}

function Hearts({ from, to, big }: Ends) {
  return (
    <>
      <svg className="fx-rainbow" viewBox="0 0 100 50" preserveAspectRatio="none">
        {['#ff5d5d', '#ffa64d', '#ffe14d', '#5fd39a', '#5fb7ff', '#a98cff'].map((c, i) => (
          <path key={c} d={`M ${from.x} 45 Q ${(from.x + to.x) / 2} ${-8 + i * 3} ${to.x} 45`} stroke={c} vectorEffect="non-scaling-stroke" style={{ animationDelay: `${i * 0.04}s` }} />
        ))}
      </svg>
      <Burst x={to.x} y={to.y} chars={['💖', '💗', '💕']} n={big ? 22 : 10} dist={big ? 150 : 80} />
    </>
  )
}

function Stars({ to, big }: Ends) {
  return (
    <>
      {[0, 0.1, 0.2].map((d, i) => (
        <div key={i} className="fx-shoot" style={{ animationDelay: `${d}s`, top: `${10 + i * 8}%` }}>🌟</div>
      ))}
      <Burst x={to.x} y={to.y} chars={['⭐', '✨', '🌟']} n={big ? 26 : 14} dist={big ? 150 : 90} />
    </>
  )
}

function Wind({ from, to }: Ends) {
  // Gusts swoop across, then a swirl spins on the creature.
  return (
    <>
      {[0, 0.1, 0.2].map((d, i) => (
        <div key={i} className="fx-arc gust" style={{ animationDelay: `${d}s`, left: `${from.x}%`, top: `${from.y - 18 + i * 14}%` }}>
          <div className="fx-gust" style={{ animationDelay: `${d}s` }}>💨</div>
        </div>
      ))}
      <div className="fx-swirl" style={{ left: `${to.x}%`, top: `${to.y}%` }}>🌀</div>
      <Burst x={to.x} y={to.y} chars={['🍃', '✨']} n={8} dist={70} delay={0.7} />
    </>
  )
}

function Roll({ from, to }: Ends) {
  // A boulder rolls along the ground and bumps the creature.
  return (
    <>
      <div className="fx-roll" style={{ top: `${Math.max(from.y, to.y) + 12}%` }}><RockShape /></div>
      <Burst x={to.x} y={Math.max(from.y, to.y) + 14} chars={['💨', '✨']} n={8} dist={60} />
    </>
  )
}

function Bubbles({ from, to }: Ends) {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="fx-arc bubble" style={{ animationDelay: `${i * 0.06}s`, left: `${from.x}%`, top: `${from.y - 14 + (i % 4) * 8}%` }}>
          <div className="fx-arc-y" style={{ animationDelay: `${i * 0.06}s` }}><div className="fx-bubble" style={{ width: 18 + (i % 3) * 10, height: 18 + (i % 3) * 10 }} /></div>
        </div>
      ))}
      <Burst x={to.x} y={to.y} chars={['💦', '💧']} n={12} dist={80} />
    </>
  )
}

const FX: Record<Fx, (e: Ends) => ReactElement> = { spark: Spark, flame: Flame, rock: Rock, leaf: Leaf, hearts: Hearts, stars: Stars, wind: Wind, roll: Roll, bubbles: Bubbles }

/** One move, start to finish. Remount (change `key`) to play it again. */
export default function MoveFx({ fx, move, color, from, to, superMove, hearts = 1 }: { fx: Fx; move: string; color: string; superMove?: boolean; hearts?: number } & Ends) {
  const Effect = FX[fx]
  // --from-x / --to-x drive the CSS animations that travel across (fireball, leaves, stars).
  const vars = { '--from-x': `${from.x}%`, '--to-x': `${to.x}%` } as CSSProperties
  return (
    <div className={`fx ${superMove ? 'super' : ''}`} style={vars} aria-hidden>
      {superMove && <div className="fx-superglow" />}
      <div className="fx-banner" style={{ '--c': color } as CSSProperties}>{superMove && '★ '}{move}!</div>
      <Effect from={from} to={to} big={superMove} />
      <div className="fx-plusheart" style={{ left: `${to.x}%`, top: `${to.y - 30}%` }}>+{'💖'.repeat(hearts)}</div>
    </div>
  )
}
