// Shared drawing kit for Pal art (src/art/pals/*) and story scenes (src/art/scenes/*).
// Style: chunky rounded shapes, soft radial shading (light from the top left), darker outlines,
// big glossy eyes that blink, rosy cheeks. Idle animations are CSS classes (styles.css, "Pal idle"):
//   pa-blink     on an eye group: blinks every few seconds (set style={{ '--d': '1.3s' }} to offset)
//   pa-ear       twitches (pivots at its base)          pa-tail   wags   (pivot: --o, default bottom-left)
//   pa-wing      flaps (pivot: --o, default right-middle) pa-breathe  gently squashes the body
//   pa-float     bobs up and down                       pa-twinkle  pulses (stars, sparkles)
//   pa-spin      slowly turns (sun rays)
// They only run inside an svg with class "pa-anim" (PalArt adds it unless `still`).
import { useId, type CSSProperties, type ReactNode } from 'react'

export type Mood = 'happy' | 'grumpy'
export interface BodyProps { stage: number; mood: Mood }

// ---------- Color ----------

function mix(hex: string, to: number, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (shift: number) => Math.round(((n >> shift) & 255) + (to - ((n >> shift) & 255)) * amt)
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')}`
}
export const lighten = (hex: string, amt = 0.3) => mix(hex, 255, amt)
export const darken = (hex: string, amt = 0.2) => mix(hex, 0, amt)
/** Outline color for a fill: a deeper shade of itself. */
export const ink = (hex: string) => darken(hex, 0.35)

/**
 * Soft 3D shading. Use the returned `fill` on a shape and render `def` once in the same svg:
 *   const body = useShade('#ffd94a')  ->  <defs>{body.def}</defs><ellipse fill={body.fill} stroke={ink('#ffd94a')} />
 */
export function useShade(color: string, light = 0.35, dark = 0.18) {
  const id = `sh${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return {
    fill: `url(#${id})`,
    def: (
      <radialGradient key={id} id={id} cx="35%" cy="30%" r="78%">
        <stop offset="0" stopColor={lighten(color, light)} />
        <stop offset="0.6" stopColor={color} />
        <stop offset="1" stopColor={darken(color, dark)} />
      </radialGradient>
    ),
  }
}

// ---------- Faces ----------

/**
 * The new face: big glossy eyes that blink, rosy cheeks, a little smile (or grumpy brows and a frown).
 * (x, y) is the point between the eyes; s scales it; `blinkDelay` offsets the blink so Pals don't blink together.
 */
export function CuteFace({ x, y, s = 1, mood = 'happy', blinkDelay = 0, gap = 15, mouth = true }: {
  x: number; y: number; s?: number; mood?: Mood; blinkDelay?: number; gap?: number
  /** false for beaks and snouts that replace the mouth */
  mouth?: boolean
}) {
  const grumpy = mood === 'grumpy'
  const eye = (dx: number) => (
    <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
      <ellipse cx={dx} cy={0} rx={7.5} ry={grumpy ? 5.5 : 9.5} fill="#2b2140" />
      <circle cx={dx - 2.6} cy={grumpy ? -1.6 : -3.6} r={3} fill="#fff" />
      <circle cx={dx + 2.6} cy={grumpy ? 1.4 : 3.2} r={1.4} fill="#fff" opacity={0.85} />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {eye(-gap)}
      {eye(gap)}
      {grumpy ? (
        <>
          <path d={`M${-gap - 9} -13 L${-gap + 7} -7 M${gap + 9} -13 L${gap - 7} -7`} stroke="#2b2140" strokeWidth={3.4} strokeLinecap="round" />
          {mouth && <path d="M-7 18 Q0 12 7 18" stroke="#2b2140" strokeWidth={3} fill="none" strokeLinecap="round" />}
        </>
      ) : (
        mouth && <path d="M-7 11 Q0 19 7 11 Q0 14.5 -7 11 Z" fill="#6b2a3a" stroke="#2b2140" strokeWidth={2} strokeLinejoin="round" />
      )}
      <ellipse cx={-gap - 10} cy={11} rx={6.5} ry={4.2} fill="#ff7fb0" opacity={0.55} />
      <ellipse cx={gap + 10} cy={11} rx={6.5} ry={4.2} fill="#ff7fb0" opacity={0.55} />
    </g>
  )
}

/** A soft white shine on a shaded shape (top-left highlight). */
export const Shine = ({ x, y, rx = 10, ry = 6, rot = -30 }: { x: number; y: number; rx?: number; ry?: number; rot?: number }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity={0.45} transform={`rotate(${rot} ${x} ${y})`} />
)

/** A little group that animates with one of the pa-* idle classes, pivoting at `origin` (CSS units, e.g. "50% 100%"). */
export const Anim = ({ cls, origin, delay, children }: { cls: string; origin?: string; delay?: number; children: ReactNode }) => (
  <g className={cls} style={{ ...(origin ? { '--o': origin } : {}), ...(delay ? { animationDelay: `${delay}s` } : {}) } as CSSProperties}>{children}</g>
)

// ---------- Older helpers (still used by species not yet redrawn) ----------

export function Face({ x, y, s = 1, mood = 'happy' }: { x: number; y: number; s?: number; mood?: Mood }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={-14} cy={0} rx={6} ry={mood === 'grumpy' ? 4 : 8} fill="#2b2140" />
      <ellipse cx={14} cy={0} rx={6} ry={mood === 'grumpy' ? 4 : 8} fill="#2b2140" />
      {mood === 'happy' && <circle cx={-12} cy={-3} r={2.4} fill="#fff" />}
      {mood === 'happy' && <circle cx={16} cy={-3} r={2.4} fill="#fff" />}
      {mood === 'grumpy' ? (
        <>
          <path d="M-22 -10 L-8 -6 M22 -10 L8 -6" stroke="#2b2140" strokeWidth={3} strokeLinecap="round" />
          <path d="M-7 18 Q0 12 7 18" stroke="#2b2140" strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <path d="M-7 12 Q0 20 7 12" stroke="#2b2140" strokeWidth={3} fill="none" strokeLinecap="round" />
      )}
      <circle cx={-24} cy={10} r={6} fill="#ff7fb0" opacity={0.6} />
      <circle cx={24} cy={10} r={6} fill="#ff7fb0" opacity={0.6} />
    </g>
  )
}

export function Crown({ x, y }: { x: number; y: number }) {
  return <path transform={`translate(${x} ${y})`} d="M-16 0 L-16 -14 L-8 -6 L0 -18 L8 -6 L16 -14 L16 0 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} />
}


// ---------- Shapes shared by several species ----------

export const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`

/** A five-pointed star centred on (cx, cy). */
export function starPath(cx: number, cy: number, r: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const d = i % 2 ? r * 0.48 : r
    return `${i ? 'L' : 'M'}${pt(cx + Math.cos(a) * d, cy + Math.sin(a) * d)}`
  }).join(' ') + 'Z'
}

/** A four-pointed twinkle centred on (x, y). */
export function twinklePath(x: number, y: number, r: number) {
  const k = r * 0.18
  return `M${pt(x, y - r)} Q${pt(x + k, y - k)} ${pt(x + r, y)} Q${pt(x + k, y + k)} ${pt(x, y + r)} Q${pt(x - k, y + k)} ${pt(x - r, y)} Q${pt(x - k, y - k)} ${pt(x, y - r)}Z`
}

export function Snowflake({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  const c = r * 0.87
  const h = r / 2
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} strokeWidth={3.5} strokeLinecap="round" fill="none">
      <path d={`M0 ${-r} V${r} M${-c} ${-h} L${c} ${h} M${-c} ${h} L${c} ${-h}`} />
      <circle r={2.5} fill={color} />
    </g>
  )
}

/** A woven basket of loaves (and, for the grown donkey, a fish poking out). */
export function Basket({ x, y, s = 1, fish }: { x: number; y: number; s?: number; fish?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {fish && (
        <g fill="#7cc6ff">
          <ellipse cx={8} cy={-24} rx={5.5} ry={10} />
          <path d="M8 -31 L0 -42 L16 -42 Z" strokeLinejoin="round" stroke="#7cc6ff" strokeWidth={2} />
        </g>
      )}
      <ellipse cx={-7} cy={-14} rx={10} ry={7} fill="#f2c27b" />
      <ellipse cx={7} cy={-15} rx={9} ry={7} fill="#e3a557" />
      <path d="M-20 -10 H20 L16 12 Q0 18 -16 12 Z" fill="#d39a5a" stroke="#a8703a" strokeWidth={2} strokeLinejoin="round" />
      <path d="M-19 -2 H19 M-17 6 H17" stroke="#a8703a" strokeWidth={2} />
      <rect x={-22} y={-13} width={44} height={6} rx={3} fill="#c0864a" />
    </g>
  )
}

/** A crab pincer: a round claw with a V-shaped opening at the top. */
export const CLAW = 'M8 -13.9 L0 -3 L-8 -13.9 A16 16 0 1 0 8 -13.9 Z'

/** A crescent moon, opening to the top right. */
export const MOON = 'M-4 -15 A15 15 0 1 0 15 4 A13.5 13.5 0 0 1 -4 -15 Z'
