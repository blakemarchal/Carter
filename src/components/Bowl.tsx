// The Pal Kitchen's mixing bowl. Drawn in layers so food sits *inside* it: the far wall, then what's in
// the bowl, then the near wall over the bottom of it. MixingBowl holds ingredients (Kitchen "add");
// StirBowl is the same bowl full of batter, with a wooden spoon that follows her finger round and
// round while the batter swirls after it and the ingredients slowly blend in (Kitchen "stir").
import { useId, type ReactNode, type Ref } from 'react'

// The bowl, in a 300 x 230 drawing: the rim is an ellipse; the near wall curves down to the foot.
const CX = 150, RIM_Y = 78, RX = 136, RY = 40
const FRONT = `M${CX - RX} ${RIM_Y} A${RX} ${RY} 0 0 0 ${CX + RX} ${RIM_Y} C${CX + RX} 160 ${CX + 70} 214 ${CX} 214 C${CX - 70} 214 ${CX - RX} 160 ${CX - RX} ${RIM_Y} Z`
const NEAR_RIM = `M${CX - RX} ${RIM_Y} A${RX} ${RY} 0 0 0 ${CX + RX} ${RIM_Y}`
const FAR_RIM = `M${CX - RX} ${RIM_Y} A${RX} ${RY} 0 0 1 ${CX + RX} ${RIM_Y}`

function BowlBack({ id }: { id: string }) {
  return (
    <svg className="bowl-layer bowl-back" viewBox="0 0 300 230" aria-hidden>
      <defs>
        <linearGradient id={`${id}-in`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9e1fa" /><stop offset="1" stopColor="#e9f7ff" />
        </linearGradient>
      </defs>
      <ellipse cx={CX} cy={RIM_Y} rx={RX} ry={RY} fill={`url(#${id}-in)`} />
      <path d={FAR_RIM} fill="none" stroke="#3a9bd8" strokeWidth={5} />
    </svg>
  )
}

function BowlFront({ id }: { id: string }) {
  return (
    <svg className="bowl-layer bowl-front" viewBox="0 0 300 230" aria-hidden>
      <defs>
        <linearGradient id={`${id}-out`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a9bd8" /><stop offset="0.35" stopColor="#7cc9f7" /><stop offset="0.7" stopColor="#5fb7ff" /><stop offset="1" stopColor="#2f86c4" />
        </linearGradient>
      </defs>
      <ellipse cx={CX} cy={222} rx={58} ry={7} fill="rgba(0,0,0,.12)" />
      <path d={FRONT} fill={`url(#${id}-out)`} stroke="#2a78b0" strokeWidth={4} strokeLinejoin="round" />
      {/* a white band with pink dots, and a soft shine */}
      <path d={`M${CX - RX + 14} 132 Q${CX} 178 ${CX + RX - 14} 132`} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.9} />
      {[-90, -45, 0, 45, 90].map((dx) => <circle key={dx} cx={CX + dx} cy={155 - Math.abs(dx) * 0.27 + (Math.abs(dx) > 60 ? -4 : 0)} r={4.5} fill="#ff8cc0" />)}
      <path d={`M${CX - 104} 104 Q${CX - 96} 150 ${CX - 60} 180`} fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.4} />
      <path d={NEAR_RIM} fill="none" stroke="#e9f7ff" strokeWidth={9} strokeLinecap="round" />
      <path d={NEAR_RIM} className="bowl-glow" fill="none" stroke="#ffe14d" strokeWidth={9} strokeLinecap="round" />
    </svg>
  )
}

/** Where the i-th thing in the bowl sits (% of the bowl box): the bottom first, then piling up. */
export function bowlSlot(i: number) {
  const SLOTS: [number, number][] = [
    // low enough that the near wall hides their bottoms, so they're in the bowl, not on it
    [150, 112], [122, 102], [178, 102], [96, 110], [204, 110], [150, 90], [98, 92], [202, 92],
    [124, 80], [176, 80], [150, 70], [112, 64], [188, 64], [150, 52], [130, 42], [170, 42],
  ]
  const [x, y] = SLOTS[Math.min(i, SLOTS.length - 1)]
  return { left: `${(x / 300) * 100}%`, top: `${(y / 230) * 100}%`, z: Math.round(y) }
}

/** The bowl, with `children` (the things in it) placed with bowlSlot. */
export function MixingBowl({ children, className = '', ref, onClick, label }: {
  children?: ReactNode; className?: string; ref?: Ref<HTMLDivElement>; onClick?: () => void; label?: string
}) {
  const id = `bowl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <div ref={ref} className={`bowl ${className}`} onClick={onClick} role={onClick ? 'button' : undefined} aria-label={label}>
      <BowlBack id={id} />
      <div className="bowl-items">{children}</div>
      <BowlFront id={id} />
    </div>
  )
}

// ---------- stirring ----------

const mixHex = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [p(a), p(b)]
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`
}

/** What each ingredient looks like stirred into batter. */
export const CHUNK_COLOR: Record<string, string> = {
  '🥚': '#ffcf3d', '🍓': '#ff4d6d', '🫐': '#5664c9', '🍌': '#ffe680', '🍎': '#ff6b5a', '🍫': '#6b3d1f',
  '🥕': '#ff8a2a', '🍅': '#ff5a3c', '🧀': '#ffd34d', '🍇': '#8e5bd6',
}

export interface Batter { base: string; done: string; keep?: boolean }

const SY = 0.27 // how flat the batter's circle looks from above at an angle
const SURF_Y = 92, SURF_RX = 116, SURF_RY = 31

/**
 * The bowl full of batter. `spoon` is the spoon's angle (radians); `swirl` is how far the batter has
 * turned (it lags behind the spoon, like a real batter); `progress` 0..1 blends the ingredients in.
 */
export function StirBowl({ contents, batter, spoon, swirl, progress, ref, spoonDown }: {
  contents: string[]; batter: Batter; spoon: number; swirl: number; progress: number; ref?: Ref<SVGSVGElement>; spoonDown: boolean
}) {
  const color = mixHex(batter.base, batter.done, Math.min(1, progress * 1.15))
  const light = mixHex(color, '#ffffff', 0.45)
  const dark = mixHex(color, '#000000', 0.18)
  // Ingredient streaks fade as they mix in; the batter's own swirl shows most while it's half mixed.
  const streak = 0.15 + 0.55 * Math.sin(Math.PI * Math.min(1, progress))
  const colors = [...new Set(contents.map((c) => CHUNK_COLOR[c] ?? dark))]
  // Each chunk: a spot on the batter, turning with it (faster near the middle, like a whirlpool).
  const chunks = contents.map((c, i) => {
    const r = 24 + ((i * 37) % 76)
    const a = i * 2.4 + swirl * (1.35 - r / 140)
    const keep = batter.keep
    const size = (keep ? 24 : 26 * (1 - 0.65 * progress)) * (0.88 + 0.12 * Math.sin(a))
    return { c, x: CX + r * Math.cos(a), y: SURF_Y + r * Math.sin(a) * SY, size, back: Math.sin(a) < 0, op: keep ? 1 : Math.max(0, 1 - progress * 1.25) }
  }).sort((p, q) => p.y - q.y)
  // The spoon dips in partway out from the middle, at the finger's angle.
  const px = CX + 66 * Math.cos(spoon), py = SURF_Y + 66 * Math.sin(spoon) * SY
  const hx = px + 52, hy = py - 132
  const arm = (k: number, col: string, w: number, op: number) => {
    // one arm of a spiral, from the middle out, in the batter's flattened circle
    const pts = Array.from({ length: 28 }, (_, j) => {
      const t = j / 27
      const ang = k + t * 4.2
      const r = 8 + t * 100
      return `${(r * Math.cos(ang)).toFixed(1)},${(r * Math.sin(ang)).toFixed(1)}`
    }).join(' ')
    return <polyline key={`${k}-${col}`} points={pts} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" opacity={op} />
  }
  return (
    <svg ref={ref} className="stir-bowl" viewBox="0 0 300 230" aria-hidden>
      <defs>
        <linearGradient id="sb-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9e1fa" /><stop offset="1" stopColor="#e9f7ff" /></linearGradient>
        <linearGradient id="sb-out" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a9bd8" /><stop offset="0.35" stopColor="#7cc9f7" /><stop offset="0.7" stopColor="#5fb7ff" /><stop offset="1" stopColor="#2f86c4" />
        </linearGradient>
        <radialGradient id="sb-batter" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor={light} /><stop offset="0.55" stopColor={color} /><stop offset="1" stopColor={dark} /></radialGradient>
        <clipPath id="sb-clip"><ellipse cx={CX} cy={SURF_Y} rx={SURF_RX} ry={SURF_RY} /></clipPath>
      </defs>
      {/* far wall, batter, its swirl and chunks */}
      <ellipse cx={CX} cy={RIM_Y} rx={RX} ry={RY} fill="url(#sb-in)" />
      <path d={FAR_RIM} fill="none" stroke="#3a9bd8" strokeWidth={5} />
      <ellipse cx={CX} cy={SURF_Y} rx={SURF_RX} ry={SURF_RY} fill="url(#sb-batter)" />
      <g clipPath="url(#sb-clip)">
        <g transform={`translate(${CX} ${SURF_Y}) scale(1 ${SY}) rotate(${(swirl * 180) / Math.PI})`}>
          {[0, 2.1, 4.2].map((k) => arm(k, light, 9, streak))}
          {colors.map((col, i) => arm(i * 1.7 + 0.8, col, 7, batter.keep ? 0.2 : Math.max(0, 0.75 - progress * 0.9)))}
        </g>
        {/* the wake behind the spoon */}
        {spoonDown && [0.35, 0.7].map((d, i) => {
          const a1 = spoon - d, a2 = spoon - d - 0.5
          const r = 66
          return <path key={i} d={`M${CX + r * Math.cos(a1)} ${SURF_Y + r * Math.sin(a1) * SY} A${r} ${r * SY} 0 0 0 ${CX + r * Math.cos(a2)} ${SURF_Y + r * Math.sin(a2) * SY}`}
            fill="none" stroke={light} strokeWidth={4 - i * 1.5} strokeLinecap="round" opacity={0.7 - i * 0.3} />
        })}
      </g>
      {chunks.map((k, i) => k.op > 0.02 && (k.c === '🥚'
        // eggs are cracked in: a blob of white with a sunny yolk, flattened like the batter
        ? <g key={i} opacity={k.op} transform={`translate(${k.x} ${k.y})`}>
            <ellipse rx={k.size * 0.62} ry={k.size * 0.62 * 0.42} fill="#fffaf0" opacity={0.9} />
            <ellipse cx={-1} cy={-1} rx={k.size * 0.27} ry={k.size * 0.27 * 0.62} fill="#ffc62e" stroke="#f0a400" strokeWidth={1} />
            <ellipse cx={-3} cy={-2.5} rx={k.size * 0.08} ry={k.size * 0.05} fill="#fff" opacity={0.8} />
          </g>
        : <text key={i} x={k.x} y={k.y} fontSize={k.size} textAnchor="middle" dominantBaseline="central" opacity={k.op * (k.back ? 0.85 : 1)}>{k.c}</text>
      ))}
      {/* a shiny highlight once it's smooth */}
      <ellipse cx={CX - 34} cy={SURF_Y - 12} rx={30} ry={6} fill="#fff" opacity={0.15 + 0.25 * progress} />
      {/* the near wall */}
      <ellipse cx={CX} cy={222} rx={58} ry={7} fill="rgba(0,0,0,.12)" />
      <path d={FRONT} fill="url(#sb-out)" stroke="#2a78b0" strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${CX - RX + 14} 132 Q${CX} 178 ${CX + RX - 14} 132`} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.9} />
      {[-90, -45, 0, 45, 90].map((dx) => <circle key={dx} cx={CX + dx} cy={155 - Math.abs(dx) * 0.27 + (Math.abs(dx) > 60 ? -4 : 0)} r={4.5} fill="#ff8cc0" />)}
      <path d={`M${CX - 104} 104 Q${CX - 96} 150 ${CX - 60} 180`} fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.4} />
      <path d={NEAR_RIM} fill="none" stroke="#e9f7ff" strokeWidth={9} strokeLinecap="round" />
      {/* the wooden spoon: where it dips in, then the handle up out of the bowl */}
      <ellipse cx={px} cy={py} rx={17} ry={6} fill={dark} opacity={0.55} />
      <ellipse cx={px} cy={py - 1} rx={13} ry={4} fill={light} opacity={0.5} />
      <line x1={px} y1={py} x2={hx} y2={hy} stroke="#8a5428" strokeWidth={17} strokeLinecap="round" />
      <line x1={px} y1={py} x2={hx} y2={hy} stroke="#d8a15e" strokeWidth={12} strokeLinecap="round" />
      <line x1={px + 2} y1={py - 8} x2={hx - 1} y2={hy + 4} stroke="#f0c98f" strokeWidth={3} strokeLinecap="round" />
      <line x1={px - 1} y1={py - 2} x2={px + 7} y2={py - 20} stroke={color} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
    </svg>
  )
}
