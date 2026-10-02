// The Adventure Map: an ocean with story islands joined by a sea route. Her Ark (with her Pal
// aboard) sits at the island she visited last; tapping an open island sails it there, then the
// island starts. Locked islands hide under clouds. Styles: styles.css, "Map".
import { useEffect, useMemo, useRef, useState } from 'react'
import PalArt from '../components/PalArt'
import { HoldButton } from '../components/ui'
import { ISLANDS, islandOpen, type Island } from '../data/islands'
import { palById, stageFor } from '../data/pals'
import { activeProfile, today, update, useProgress } from '../lib/progress'
import { hungryPals } from '../lib/kitchen'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

type P = [number, number]

/** Where the boat docks at each island: in the water just right of it. */
const dock = (i: Island): P => [i.at[0] + 116, i.at[1] + 40]

/** A smooth curve through the docks (Catmull-Rom as cubic Béziers). */
function routePath(pts: P[]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`
  }
  return d
}

function Palm({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 Q4 -22 -2 -44" stroke="#9a6a3a" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-2 -44 q-22 -6 -30 8 q16 -12 30 -8Z M-2 -44 q20 -10 30 2 q-16 -8 -30 -2Z M-2 -44 q-8 -20 -26 -18 q16 2 26 18Z M-2 -44 q10 -22 26 -18 q-16 4 -26 18Z" fill="#3fb36b" />
    </g>
  )
}

function IslandShape({ isl, state }: { isl: Island; state: 'locked' | 'open' | 'next' | 'done' }) {
  const [x, y] = isl.at
  return (
    <g transform={`translate(${x} ${y})`} className={`map-island ${state}`}>
      {state === 'next' && <ellipse className="map-ring" cx={0} cy={6} rx={104} ry={52} />}
      <ellipse cx={0} cy={14} rx={92} ry={40} fill="#3a9bd8" opacity={0.35} />
      <ellipse cx={0} cy={6} rx={86} ry={36} fill="#f6dfa2" />
      <path d="M-66 4 Q-60 -34 -14 -38 Q30 -46 60 -20 Q76 -4 62 8 Q20 20 -30 18 Q-62 16 -66 4Z" fill="#7ed68a" />
      <path d="M-40 -6 Q-20 -24 10 -22" stroke={isl.color} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.7} />
      <Palm x={-48} y={6} s={0.9} />
      <Palm x={54} y={4} s={0.8} flip />
      <text className="map-landmark" x={4} y={-12} textAnchor="middle">{isl.emoji}</text>
      {state === 'done' && (
        <g transform="translate(36 -64)">
          <line x1={0} y1={0} x2={0} y2={40} stroke="#7a5a3a" strokeWidth={4} />
          <path d="M0 0 L30 8 L0 16Z" fill="#ff6fae" />
          <text x={12} y={13} fontSize={12} textAnchor="middle">⭐</text>
        </g>
      )}
      <g transform="translate(0 52)">
        <rect x={-isl.name.length * 6.2 - 14} y={-17} width={isl.name.length * 12.4 + 28} height={32} rx={16} className="map-label" />
        <text className="map-name" x={0} y={6} textAnchor="middle">{isl.name}</text>
      </g>
      {state === 'locked' && (
        <g className="map-fog">
          <circle cx={-44} cy={-6} r={34} /><circle cx={0} cy={-22} r={42} /><circle cx={46} cy={-4} r={34} />
          <rect x={-74} y={-8} width={148} height={40} rx={20} />
          <text x={0} y={8} textAnchor="middle" fontSize={34}>🔒</text>
        </g>
      )}
      {state === 'next' && <text className="map-point" x={4} y={-70} textAnchor="middle">👇</text>}
    </g>
  )
}

function Boat({ palId, stage }: { palId: string; stage: number }) {
  return (
    <g className="map-boat-inner">
      <svg x={-34} y={-78} width={68} height={68} overflow="visible"><PalArt pal={palById(palId)} stage={stage} size={68} /></svg>
      <rect x={-30} y={-30} width={60} height={22} rx={5} fill="#c98448" stroke="#8a5428" strokeWidth={3} />
      <path d="M-58 -10 L58 -10 L42 16 L-42 16 Z" fill="#a0612f" stroke="#6f3f18" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-50 -2 L50 -2" stroke="#6f3f18" strokeWidth={2} />
    </g>
  )
}

export default function MapScreen({ onIsland, onArk, onParent, onPlayers, onBedtime }: {
  onIsland: (id: string) => void; onArk: () => void; onParent: () => void; onPlayers: () => void; onBedtime: () => void
}) {
  const p = useProgress()
  const me = activeProfile()
  const buddy = palById(p.starter ?? 'zippy')
  const route = useRef<SVGPathElement>(null)
  const docks = useMemo(() => ISLANDS.map(dock), [])
  const d = useMemo(() => routePath(docks), [docks])
  const startAt = Math.max(0, ISLANDS.findIndex((i) => i.id === p.mapAt))
  const [boat, setBoat] = useState<{ x: number; y: number; flip: boolean }>({ x: docks[startAt][0], y: docks[startAt][1], flip: false })
  const [sailing, setSailing] = useState(false)
  const at = useRef(startAt)

  useEffect(() => { speak('Where should we go? Tap an island!') }, [])

  const states = ISLANDS.map((isl, i) => {
    if (!islandOpen(i, p.islandsDone, today(), p.openAll)) return 'locked' as const
    if (p.islandsDone.includes(isl.id)) return 'done' as const
    return 'next' as const
  })

  /** Where along the route each dock is (by sampling the path). */
  const lengthAt = (pt: P) => {
    const path = route.current!
    const total = path.getTotalLength()
    let best = 0, bestD = Infinity
    for (let l = 0; l <= total; l += 4) {
      const q = path.getPointAtLength(l)
      const dd = (q.x - pt[0]) ** 2 + (q.y - pt[1]) ** 2
      if (dd < bestD) (bestD = dd), (best = l)
    }
    return best
  }

  const sailTo = (i: number) => {
    const path = route.current
    if (!path || i === at.current) return onIsland(ISLANDS[i].id)
    setSailing(true)
    sfx.whoosh()
    const from = lengthAt(docks[at.current]), to = lengthAt(docks[i])
    const ms = Math.min(2200, Math.max(900, Math.abs(to - from) * 2.2))
    const t0 = performance.now()
    let arrived = false
    const arrive = () => {
      if (arrived) return
      arrived = true
      at.current = i
      update((x) => ({ ...x, mapAt: ISLANDS[i].id }))
      setSailing(false)
      onIsland(ISLANDS[i].id)
    }
    const step = (now: number) => {
      if (arrived) return
      const k = Math.min(1, (now - t0) / ms)
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2 // ease in-out
      const l = from + (to - from) * e
      const q = path.getPointAtLength(l)
      const ahead = path.getPointAtLength(Math.max(0, Math.min(path.getTotalLength(), l + (to > from ? 4 : -4))))
      setBoat({ x: q.x, y: q.y, flip: ahead.x < q.x })
      if (k < 1) requestAnimationFrame(step)
      else arrive()
    }
    requestAnimationFrame(step)
    // Animation frames pause while the app is in the background; never leave her stuck at sea.
    setTimeout(arrive, ms + 400)
  }

  const tapIsland = (i: number) => {
    if (sailing) return
    sfx.pop()
    const isl = ISLANDS[i]
    if (states[i] === 'locked') {
      const prev = ISLANDS[i - 1]
      speak(isl.steps && prev ? `Finish ${prev.name.replace(/!$/, '')} first, then sail here!` : `${isl.name.replace(/!$/, '')} is coming soon!`)
      return
    }
    sailTo(i)
  }

  return (
    <div className="screen map">
      <header className="map-head">
        <button className="ark-btn" onClick={() => { sfx.pop(); onArk() }}>
          <PalArt pal={buddy} stage={stageFor(buddy, p.pals[buddy.id] ?? 0)} size={70} />
          <span>My Ark</span>
          {hungryPals(p, me.id).length > 0 && <span className="hungry-badge small">🍽️</span>}
        </button>
        <h2>Adventure Map</h2>
        <div className="map-tools">
          <button className="who-chip" aria-label="Switch player" onClick={() => { sfx.pop(); onPlayers() }}>
            <span>{me.emoji}</span>{me.name.trim() || 'Player'}
          </button>
          <button className={`icon-btn music ${p.music ? '' : 'off'}`} aria-label={p.music ? 'Turn music off' : 'Turn music on'}
            onClick={() => { sfx.pop(); update((x) => ({ ...x, music: !x.music })) }}>{p.music ? '🎵' : '🔇'}</button>
          <button className="icon-btn music" aria-label="Bedtime story" onClick={() => { sfx.pop(); onBedtime() }}>🌙</button>
          <HoldButton onHold={onParent} className="parent-gear">⚙️</HoldButton>
        </div>
      </header>
      <div className="sea">
        <svg className="sea-map" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="waves" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M6 22 q10 -8 20 0 q10 8 20 0" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect className="sea-waves" x={-80} y={-40} width={1160} height={700} fill="url(#waves)" />
          {/* Things to spot: clouds, seagulls, a whale and a jumping fish */}
          <g className="sea-cloud c1"><ellipse cx={0} cy={0} rx={46} ry={18} /><ellipse cx={30} cy={-10} rx={30} ry={18} /><ellipse cx={-26} cy={-6} rx={24} ry={14} /></g>
          <g className="sea-cloud c2"><ellipse cx={0} cy={0} rx={38} ry={15} /><ellipse cx={24} cy={-8} rx={24} ry={14} /></g>
          <g className="sea-gull g1"><path d="M0 0 q8 -8 16 0 q8 -8 16 0" /></g>
          <g className="sea-gull g2"><path d="M0 0 q6 -6 12 0 q6 -6 12 0" /></g>
          <text className="sea-whale" x={700} y={560} fontSize={44}>🐳</text>
          <text className="sea-fish" x={420} y={600} fontSize={30}>🐟</text>
          <path ref={route} d={d} className="sea-route" />
          {ISLANDS.map((isl, i) => (
            <g key={isl.id} onClick={() => tapIsland(i)} style={{ cursor: 'pointer' }}>
              <IslandShape isl={isl} state={states[i]} />
            </g>
          ))}
          <g transform={`translate(${boat.x} ${boat.y}) scale(${boat.flip ? -1 : 1} 1)`} onClick={() => { if (!sailing) { sfx.pop(); onArk() } }} style={{ cursor: 'pointer' }}>
            <Boat palId={buddy.id} stage={stageFor(buddy, p.pals[buddy.id] ?? 0)} />
          </g>
        </svg>
      </div>
    </div>
  )
}
