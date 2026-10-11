// Clocks, coins and measured things for the time and money lessons (src/learn/topics/time-money.tsx).
// Each item draws in a 100 x 100 box (see ./types.ts). The drawing parts (ClockFace, Coin, Measured)
// are also used at any size by the lessons' own pictures and exercises.
import { useId, type CSSProperties } from 'react'
import type { Item } from './types'
import { darken, ink, lighten, Shine, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const
const FONT = "'Baloo 2', 'Chalkboard SE', 'Comic Sans MS', system-ui, sans-serif"
const f = (n: number) => n.toFixed(1)
const INK = '#3b2a4a'

// ---------- Clocks ----------

/** Where the hour hand points (degrees clockwise from 12) at h:m. */
export const hourAngle = (h: number, m = 0) => ((h % 12) + m / 60) * 30
/** Where the minute hand points at m minutes. */
export const minuteAngle = (m: number) => m * 6

const RIM = '#5fb7ff'
const HOUR_HAND = '#3b2a4a'
const MINUTE_HAND = '#ff4f8b'

/**
 * A friendly clock face in a 100 x 100 box: a round blue rim, big numbers, a short thick dark hour hand
 * and a long thin pink minute hand. `hourRot` / `minuteRot` turn the hands (degrees, any number of
 * turns, so a CSS transition can glide the short way round). `knob` puts a big round grip on the
 * hour hand's tip (for dragging it); `glow` lights a ring behind one number.
 */
export function ClockFace({ h = 12, m = 0, hourRot, minuteRot, knob, glow, handStyle, handClass }: {
  h?: number; m?: number; hourRot?: number; minuteRot?: number; knob?: boolean; glow?: number
  handStyle?: CSSProperties; handClass?: string
}) {
  const rim = useShade(RIM, 0.4, 0.2)
  const face = useShade('#fffdf4', 0.6, 0.06)
  const hr = hourRot ?? hourAngle(h, m)
  const mr = minuteRot ?? minuteAngle(m)
  const turn = (deg: number): CSSProperties => ({ transform: `rotate(${deg}deg)`, transformOrigin: '50px 50px', ...handStyle })
  return (
    <g {...ROUND}>
      <defs>{rim.def}{face.def}</defs>
      <circle cx={50} cy={50} r={47} fill={rim.fill} stroke={ink(RIM)} strokeWidth={2.5} />
      <circle cx={50} cy={50} r={40.5} fill={face.fill} stroke={darken(RIM, 0.25)} strokeWidth={1.6} />
      <Shine x={24} y={20} rx={9} ry={3.5} rot={-42} />
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0
        const a = (i * 6 * Math.PI) / 180
        const r0 = big ? 36.3 : 37.6
        return <line key={i} x1={f(50 + Math.sin(a) * r0)} y1={f(50 - Math.cos(a) * r0)} x2={f(50 + Math.sin(a) * 39)} y2={f(50 - Math.cos(a) * 39)}
          stroke={big ? INK : '#b7a9c4'} strokeWidth={big ? 1.6 : 0.7} />
      })}
      {/* the long minute hand (under the numbers, which keep a little halo so they stay readable) */}
      <g style={turn(mr)} className={handClass}>
        <path d="M50 57 L50 14 M46.6 18 L50 13 L53.4 18" fill="none" stroke={ink(MINUTE_HAND)} strokeWidth={4.8} />
        <path d="M50 57 L50 14 M46.6 18 L50 13 L53.4 18" fill="none" stroke={MINUTE_HAND} strokeWidth={2.8} />
      </g>
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1
        const a = (n * 30 * Math.PI) / 180
        const x = 50 + Math.sin(a) * 30.2, y = 50 - Math.cos(a) * 30.2
        return (
          <g key={n}>
            {glow === n && <circle className="tm-glow-ring" cx={f(x)} cy={f(y)} r={8.5} fill="#ffe680" stroke="#ffc21a" strokeWidth={1.5} />}
            <text x={f(x)} y={f(y + 0.6)} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800}
              fontSize={n >= 10 ? 10.6 : 12} fill={INK} stroke="#fffdf4" strokeWidth={2.2} paintOrder="stroke">{n}</text>
          </g>
        )
      })}
      {/* the short, thick hour hand */}
      <g style={turn(hr)} className={handClass}>
        <path d="M45.4 55 L46 34.5 Q50 27.5 54 34.5 L54.6 55 Z" fill={HOUR_HAND} stroke={darken(HOUR_HAND, 0.3)} strokeWidth={1.4} />
        {knob && <circle className="tm-knob" cx={50} cy={32} r={5.6} fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={1.6} />}
      </g>
      <circle cx={50} cy={50} r={4.2} fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={1.5} />
    </g>
  )
}

/** Clock emoji, for content that names a time by emoji: 🕐 is 1:00 … 🕛 is 12:00, 🕜 is 1:30 … 🕧 is 12:30. */
export const clockEmoji = (h: number, half: boolean) => String.fromCodePoint((half ? 0x1f55c : 0x1f550) + h - 1)

/** The item id of a clock showing h o'clock, or half past h. */
export const clockId = (h: number, half = false) => `tm-clock-${h}${half ? '-30' : ''}`

const CLOCKS: Item[] = [false, true].flatMap((half) => Array.from({ length: 12 }, (_, i) => {
  const h = i + 1
  const Draw = () => <ClockFace h={h} m={half ? 30 : 0} />
  return { id: clockId(h, half), name: half ? `clock at half past ${h}` : `clock at ${h} o'clock`, emoji: [clockEmoji(h, half)], Draw }
}))

// ---------- Coins (US) ----------

export type CoinKind = 'penny' | 'nickel' | 'dime' | 'quarter'

/**
 * What each coin is worth and how it looks: radius in a 100 box (real sizes, so the dime is the smallest
 * and the quarter the biggest), its metal, ridged edge or smooth, and which way its president faces.
 */
export const COINS: Record<CoinKind, { cents: number; r: number; metal: string; ridged: boolean; faceRight: boolean; hair: 'short' | 'tied' | 'beard' }> = {
  penny: { cents: 1, r: 36.5, metal: '#c87a43', ridged: false, faceRight: true, hair: 'beard' },
  nickel: { cents: 5, r: 40.5, metal: '#b9bfc8', ridged: false, faceRight: false, hair: 'tied' },
  dime: { cents: 10, r: 34.5, metal: '#c9cfd8', ridged: true, faceRight: false, hair: 'short' },
  quarter: { cents: 25, r: 46, metal: '#c3c9d2', ridged: true, faceRight: false, hair: 'tied' },
}

/** A head and shoulders in profile, facing left, in a coin of radius 40 centred on (50, 50). */
const BUST = 'M37 27 C43 15 63 14 68 28 C72 38 71 50 64 57 L65 67 C73 69 81 75 85 86 L18 86 C21 77 32 71 43 69 L45 62 C41 62 38 60 37 57 C34.5 56 34 54 36 52.5 C34 51 34 49 35.5 47.5 L31.5 43.5 C33 41.5 34.5 40 35 38 C34.5 34 35 30 37 27Z'

/** One coin, centred on (cx, cy), at `scale` times its size in a 100 box. */
export function Coin({ kind, cx = 50, cy = 50, scale = 1 }: { kind: CoinKind; cx?: number; cy?: number; scale?: number }) {
  const c = COINS[kind]
  const metal = useShade(c.metal, 0.5, 0.22)
  const clip = `cc${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const R = c.r
  const inner = R * 0.84
  const deep = darken(c.metal, 0.22)
  const s = inner / 40
  return (
    <g transform={`translate(${f(cx)} ${f(cy)}) scale(${scale})`} {...ROUND}>
      <defs>{metal.def}<clipPath id={clip}><circle cx={0} cy={0} r={inner} /></clipPath></defs>
      <circle r={R} fill={metal.fill} stroke={ink(c.metal)} strokeWidth={2.2} />
      {c.ridged && Array.from({ length: 72 }, (_, i) => {
        const a = (i * 5 * Math.PI) / 180
        return <line key={i} x1={f(Math.cos(a) * (R - 0.6))} y1={f(Math.sin(a) * (R - 0.6))} x2={f(Math.cos(a) * (R - 3))} y2={f(Math.sin(a) * (R - 3))}
          stroke={deep} strokeWidth={0.9} opacity={0.7} />
      })}
      <circle r={inner} fill="none" stroke={deep} strokeWidth={1.3} opacity={0.75} />
      <g clipPath={`url(#${clip})`}>
        <g transform={`scale(${c.faceRight ? -s : s} ${s}) translate(-50 -50)`}>
          <path d={BUST} fill={lighten(c.metal, 0.12)} stroke={deep} strokeWidth={1.8 / s} />
          {/* hair and ear */}
          <path d="M45 27 C52 20 63 21 66 30 C68 38 66 45 62 50 C58 44 56 38 52 34 C49 31 46 30 45 27Z" fill={deep} opacity={0.45} />
          <path d="M53 41 C56 38 60 41 58 45 C57 48 54 47 53 45" fill="none" stroke={deep} strokeWidth={1.6 / s} />
          {c.hair === 'beard' && <path d="M45 46 C47 52 50 57 56 58 C60 58 62 55 63 52 C60 60 56 64 48 63 C42 62 39 58 39 55 C42 56 44 52 45 46Z" fill={deep} opacity={0.45} />}
          {c.hair === 'tied' && <path d="M66 50 C72 50 75 55 72 60 C70 63 66 61 66 57 Z" fill={deep} opacity={0.55} />}
          <circle cx={42} cy={41} r={1.6} fill={deep} />
        </g>
      </g>
      {/* little letters round the edge, the way coins have words on them */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = ((-150 + i * 12.5) * Math.PI) / 180
        const rr = (R + inner) / 2 - 0.3
        return <rect key={i} x={f(Math.cos(a) * rr - 1.1)} y={f(Math.sin(a) * rr - 1.1)} width={2.2} height={2.2} rx={0.6} fill={deep} opacity={0.55} />
      })}
      <Shine x={-R * 0.45} y={-R * 0.5} rx={R * 0.22} ry={R * 0.09} rot={-42} />
    </g>
  )
}

export const coinId = (kind: CoinKind) => `tm-${kind}`
const COIN_ITEMS: Item[] = (Object.keys(COINS) as CoinKind[]).map((kind) => {
  const Draw = () => <Coin kind={kind} />
  return { id: coinId(kind), name: kind, emoji: [], Draw }
})

// ---------- Things to measure ----------

export type MeasureKind = 'pencil' | 'worm' | 'flower'
export type MeasureColor = 'red' | 'blue' | 'yellow'
export const MEASURE_COLORS: Record<MeasureColor, string> = { red: '#ff5a64', blue: '#4f8cff', yellow: '#ffc53a' }
/** Lengths are in units of 10 (in a 100 box), from 3 to 9. */
export const MEASURE_LENGTHS = [3, 4, 5, 6, 7, 8, 9]

/** A colored pencil lying down: eraser at (x, y - 7), point `len` to the right. */
export function Pencil({ x, y, len, color }: { x: number; y: number; len: number; color: string }) {
  const body = useShade(color, 0.35, 0.15)
  const end = x + len
  const b0 = x + 10, b1 = end - 13
  return (
    <g {...ROUND}>
      <defs>{body.def}</defs>
      <path d={`M${f(x + 3)} ${f(y - 7)} L${f(x + 7)} ${f(y - 7)} L${f(x + 7)} ${f(y + 7)} L${f(x + 3)} ${f(y + 7)} Q${f(x)} ${f(y + 7)} ${f(x)} ${f(y + 3)} L${f(x)} ${f(y - 3)} Q${f(x)} ${f(y - 7)} ${f(x + 3)} ${f(y - 7)}Z`}
        fill="#ff9fc0" stroke={ink('#ff9fc0')} strokeWidth={1.6} />
      <rect x={f(x + 6.5)} y={f(y - 7.3)} width={4.4} height={14.6} fill="#d3d8e0" stroke={ink('#d3d8e0')} strokeWidth={1.4} />
      <path d={`M${f(b1 + 0.5)} ${f(y - 7)} L${f(end)} ${f(y)} L${f(b1 + 0.5)} ${f(y + 7)} Z`} fill="#f6d29b" stroke={ink('#f6d29b')} strokeWidth={1.5} />
      <path d={`M${f(end - 4.6)} ${f(y - 2.5)} L${f(end)} ${f(y)} L${f(end - 4.6)} ${f(y + 2.5)} Z`} fill={darken(color, 0.1)} stroke={ink(color)} strokeWidth={1.2} />
      <rect x={f(b0)} y={f(y - 7)} width={f(b1 - b0 + 1)} height={14} fill={body.fill} stroke={ink(color)} strokeWidth={1.6} />
      <line x1={f(b0 + 1)} y1={f(y - 2.6)} x2={f(b1)} y2={f(y - 2.6)} stroke={lighten(color, 0.45)} strokeWidth={1.3} opacity={0.8} />
      <line x1={f(b0 + 1)} y1={f(y + 2.6)} x2={f(b1)} y2={f(y + 2.6)} stroke={darken(color, 0.18)} strokeWidth={1.3} opacity={0.7} />
    </g>
  )
}

/** A wiggly worm lying down: tail at x, smiling head `len` to the right, its middle on y. */
export function Worm({ x, y, len, color }: { x: number; y: number; len: number; color: string }) {
  const head = useShade(color, 0.4, 0.15)
  const t0 = x + 6, t1 = x + len - 8
  const steps = Math.max(6, Math.round((t1 - t0) / 2))
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const px = t0 + ((t1 - t0) * i) / steps
    return [px, y + Math.sin((px - t0) / 5.5) * 2.4 * Math.min(1, (t1 - px) / 8)] as const
  })
  const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${f(px)} ${f(py)}`).join(' ')
  return (
    <g {...ROUND}>
      <defs>{head.def}</defs>
      <path d={d} fill="none" stroke={ink(color)} strokeWidth={15} />
      <path d={d} fill="none" stroke={color} strokeWidth={11.6} />
      <path d={d} fill="none" stroke={lighten(color, 0.4)} strokeWidth={3} transform="translate(0 -2.6)" opacity={0.7} />
      {pts.filter((_, i) => i % 3 === 1 && i < steps - 2).map(([px, py], i) => (
        <path key={i} d={`M${f(px)} ${f(py - 4.5)} Q${f(px + 1.4)} ${f(py)} ${f(px)} ${f(py + 4.5)}`} fill="none" stroke={darken(color, 0.2)} strokeWidth={1.1} opacity={0.6} />
      ))}
      <circle cx={f(t1)} cy={f(y - 1)} r={8} fill={head.fill} stroke={ink(color)} strokeWidth={1.7} />
      {[t1 + 0.6, t1 + 5].map((ex, i) => (
        <g key={i}>
          <ellipse cx={f(ex)} cy={f(y - 3.4)} rx={1.5} ry={1.9} fill="#2b2140" />
          <circle cx={f(ex - 0.5)} cy={f(y - 4.2)} r={0.6} fill="#fff" />
        </g>
      ))}
      <path d={`M${f(t1 + 1.6)} ${f(y + 1.6)} Q${f(t1 + 3.8)} ${f(y + 4)} ${f(t1 + 6)} ${f(y + 1.6)}`} fill="none" stroke="#2b2140" strokeWidth={1.2} />
      <ellipse cx={f(t1 - 1.5)} cy={f(y + 1.5)} rx={1.8} ry={1.1} fill="#ff7fb0" opacity={0.6} />
    </g>
  )
}

/** A flower standing on the ground at (x, base), `h` tall (to the top of its petals). */
export function Flower({ x, base, h, color }: { x: number; base: number; h: number; color: string }) {
  const petal = useShade(color, 0.4, 0.15)
  const cy = base - h + 10.5
  const green = '#4cbb5e'
  const leafY = base - Math.min(h * 0.38, 18)
  return (
    <g {...ROUND}>
      <defs>{petal.def}</defs>
      <ellipse cx={x} cy={base} rx={11} ry={2.6} fill="#000" opacity={0.12} />
      <path d={`M${f(x)} ${f(base)} L${f(x)} ${f(cy)}`} stroke={ink(green)} strokeWidth={5} />
      <path d={`M${f(x)} ${f(base)} L${f(x)} ${f(cy)}`} stroke={green} strokeWidth={3} />
      {h >= 40 && <path d={`M${f(x)} ${f(leafY)} Q${f(x + 6)} ${f(leafY - 9)} ${f(x + 13)} ${f(leafY - 7)} Q${f(x + 9)} ${f(leafY + 1)} ${f(x)} ${f(leafY)}Z`}
        fill={green} stroke={ink(green)} strokeWidth={1.4} />}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 * Math.PI) / 180
        return <circle key={i} cx={f(x + Math.cos(a) * 5.6)} cy={f(cy + Math.sin(a) * 5.6)} r={4.8} fill={petal.fill} stroke={ink(color)} strokeWidth={1.3} />
      })}
      <circle cx={x} cy={cy} r={4.3} fill={color === MEASURE_COLORS.yellow ? '#a8672e' : '#ffd34d'} stroke={ink('#d9a12a')} strokeWidth={1.2} />
    </g>
  )
}

/** One thing to measure, `len` tens long (or tall), in a 100 box: lying ones start at x = 5, flowers stand on y = 94. */
export function Measured({ kind, color, len }: { kind: MeasureKind; color: MeasureColor; len: number }) {
  const c = MEASURE_COLORS[color]
  if (kind === 'flower') return <Flower x={50} base={94} h={len * 10} color={c} />
  if (kind === 'worm') return <Worm x={5} y={52} len={len * 10} color={c} />
  return <Pencil x={5} y={50} len={len * 10} color={c} />
}

export const measureId = (kind: MeasureKind, color: MeasureColor, len: number) => `tm-${kind}-${color}-${len}`
const MEASURED: Item[] = (['pencil', 'worm', 'flower'] as MeasureKind[]).flatMap((kind) =>
  (Object.keys(MEASURE_COLORS) as MeasureColor[]).flatMap((color) => MEASURE_LENGTHS.map((len) => {
    const Draw = () => <Measured kind={kind} color={color} len={len} />
    return { id: measureId(kind, color, len), name: `${color} ${kind}`, emoji: [], Draw }
  })))

export const LEARN_TIME_MONEY: Item[] = [...CLOCKS, ...COIN_ITEMS, ...MEASURED]
