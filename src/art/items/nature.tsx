// Sky, weather, land and water. Each draws in a 100 x 100 box (see ./types.ts).
import type { Item } from './types'
import { CuteFace, darken, EYE, groundShadow, ink, lighten, Shine, useShade } from './draw'

type Pt = [number, number]
type Circle = [number, number, number]

const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`

/** Outline of a puffy shape (a cloud, a treetop, a bush): the union of circles listed clockwise around its middle. */
function puff(cs: Circle[]) {
  const n = cs.length
  // where each circle meets the next, on the outside
  const meet = cs.map(([x1, y1, r1], i): Pt => {
    const [x2, y2, r2] = cs[(i + 1) % n]
    const d = Math.hypot(x2 - x1, y2 - y1)
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    const h = Math.sqrt(Math.max(0, r1 * r1 - a * a))
    const bx = x1 + (a * (x2 - x1)) / d, by = y1 + (a * (y2 - y1)) / d
    return [bx + (h * (y2 - y1)) / d, by - (h * (x2 - x1)) / d]
  })
  let d = `M${pt(...meet[n - 1])}`
  cs.forEach(([x, y, r], i) => {
    const s = meet[(i + n - 1) % n], e = meet[i]
    let turn = Math.atan2(e[1] - y, e[0] - x) - Math.atan2(s[1] - y, s[0] - x)
    if (turn < 0) turn += Math.PI * 2
    d += ` A${r} ${r} 0 ${turn > Math.PI ? 1 : 0} 1 ${pt(...e)}`
  })
  return `${d}Z`
}

/** A closed outline through the points, with each corner rounded off (radius rad(i) at corner i). */
function roundCorners(ps: Pt[], rad: (i: number) => number) {
  const n = ps.length
  const toward = ([x, y]: Pt, [tx, ty]: Pt, r: number): Pt => {
    const l = Math.hypot(tx - x, ty - y)
    return [x + ((tx - x) / l) * r, y + ((ty - y) / l) * r]
  }
  return ps.map((p, i) => {
    const a = toward(p, ps[(i + n - 1) % n], rad(i)), b = toward(p, ps[(i + 1) % n], rad(i))
    return `${i ? 'L' : 'M'}${pt(...a)} Q${pt(...p)} ${pt(...b)}`
  }).join(' ') + 'Z'
}

/** A plump five-pointed star with rounded points, centred on (cx, cy), its points r from the middle. */
function starPath(cx: number, cy: number, r: number) {
  const ps = Array.from({ length: 10 }, (_, i): Pt => {
    const a = (Math.PI / 5) * i - Math.PI / 2, d = i % 2 ? r * 0.5 : r
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]
  })
  return roundCorners(ps, (i) => r * (i % 2 ? 0.065 : 0.15))
}

/** A four-pointed twinkle centred on (x, y); k makes its middle plumper. */
function twinkle(x: number, y: number, r: number, k = 0.2) {
  const q = r * k
  return `M${pt(x, y - r)} Q${pt(x + q, y - q)} ${pt(x + r, y)} Q${pt(x + q, y + q)} ${pt(x, y + r)} Q${pt(x - q, y + q)} ${pt(x - r, y)} Q${pt(x - q, y - q)} ${pt(x, y - r)}Z`
}

/** A water drop pointing up: (x, y) is the middle of its round bottom, r its radius. */
function drop(x: number, y: number, r: number) {
  return `M${pt(x, y - 2 * r)} C${pt(x + 0.2 * r, y - 1.55 * r)} ${pt(x + r, y - 0.95 * r)} ${pt(x + r, y)} A${r} ${r} 0 0 1 ${pt(x - r, y)} C${pt(x - r, y - 0.95 * r)} ${pt(x - 0.2 * r, y - 1.55 * r)} ${pt(x, y - 2 * r)}Z`
}

/** A crescent: the circle c1 with the circle c2 taken out of it. */
function crescent([x1, y1, r1]: Circle, [x2, y2, r2]: Circle) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy)
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(r1 * r1 - a * a)
  const bx = x1 + (dx * a) / d, by = y1 + (dy * a) / d
  const p: Pt = [bx + (dy * h) / d, by - (dx * h) / d], q: Pt = [bx - (dy * h) / d, by + (dx * h) / d]
  return `M${pt(...p)} A${r1} ${r1} 0 1 0 ${pt(...q)} A${r2} ${r2} 0 0 1 ${pt(...p)}Z`
}

/** A smooth tapering tube along the curve f(t), t = 0…1, w(t) wide, with round ends. */
function tube(f: (t: number) => Pt, w: (t: number) => number, n = 36) {
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = f(t)
    const [x1, y1] = f(Math.max(0, t - 0.005)), [x2, y2] = f(Math.min(1, t + 0.005))
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, h = w(t) / 2
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len
    L.push([x + nx * h, y + ny * h])
    R.unshift([x - nx * h, y - ny * h])
  }
  const smooth = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  const r0 = w(0) / 2, r1 = w(1) / 2
  return `M${pt(...L[0])} ${smooth(L)} A${r1} ${r1} 0 0 0 ${pt(...R[0])} ${smooth(R)} A${r0} ${r0} 0 0 0 ${pt(...L[0])}Z`
}

/** A point along the curve a → (b) → c, t = 0…1. */
const bend = (a: Pt, b: Pt, c: Pt) => (t: number): Pt => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}

/**
 * A wave's curling crest: water spiralling round (cx, cy), starting at angle a0 (radians) and going
 * `turns` times round (positive = clockwise) while its radius shrinks r0 → r1 and its width w0 → w1.
 */
interface Curl { cx: number; cy: number; a0: number; turns: number; r0: number; r1: number; w0: number; w1: number }
const curlWidth = (c: Curl, t: number) => c.w0 + (c.w1 - c.w0) * t
const curlAt = (c: Curl, t: number, out = 0): Pt => {
  const a = c.a0 + t * c.turns * Math.PI * 2, r = c.r0 + (c.r1 - c.r0) * t + out
  return [c.cx + Math.cos(a) * r, c.cy + Math.sin(a) * r]
}
const curlPath = (c: Curl) => tube((t) => curlAt(c, t), (t) => curlWidth(c, t))
/** White foam riding along the outer edge of a curl, from t0 to t1. */
const foamPath = (c: Curl, t0: number, t1: number) => tube((t) => {
  const u = t0 + (t1 - t0) * t
  return curlAt(c, u, curlWidth(c, u) * 0.2)
}, (t) => Math.max(1, curlWidth(c, t0 + (t1 - t0) * t) * 0.45 * Math.sin(Math.PI * (0.12 + 0.76 * t))))

const CLOUD_WHITE = '#eef7ff'
const CLOUD_LINE = '#9cc3e8'
const GOLD = '#ffd34d'

/** A little cloud (for the ends of a rainbow), centred on (cx, cy). */
const littleCloud = (cx: number, cy: number): Circle[] => [
  [cx - 10, cy + 2, 6.5], [cx - 5, cy - 5, 8], [cx + 5, cy - 6, 8.5], [cx + 10.5, cy + 1.5, 6.5], [cx + 4, cy + 6, 7], [cx - 4, cy + 6, 7],
]

/** The sun: a warm smiling face with rounded rays. */
function Sun() {
  const body = useShade('#ffd34d', 0.45, 0.15)
  return (
    <g>
      <defs>{body.def}</defs>
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M50 6 Q55 16 50 20 Q45 16 50 6 Z" fill="#ffb92e" stroke={ink('#ffb92e')} strokeWidth={1.6} strokeLinejoin="round" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <circle cx={50} cy={50} r={27} fill={body.fill} stroke={ink('#ffd34d')} strokeWidth={2.8} />
      <CuteFace x={50} y={48} s={0.45} gap={13} />
      <Shine x={39} y={36} rx={7} ry={4} />
    </g>
  )
}

/** Light (day one): a soft golden burst of light, with a big twinkle in the middle and little sparkles round it. */
function Light() {
  const core = useShade('#ffe066', 0.75, 0.1)
  const line = ink(GOLD)
  return (
    <g>
      <defs>{core.def}</defs>
      {/* soft glow, brightest in the middle */}
      {[47, 39, 31, 23].map((r) => <circle key={r} cx={50} cy={50} r={r} fill="#ffe27a" opacity={0.22} />)}
      {/* rays: long ones straight out, shorter ones between */}
      {Array.from({ length: 16 }, (_, i) => {
        const r = i % 4 === 0 ? 47 : i % 2 === 0 ? 38 : 30
        return <path key={i} d={`M46.5 50 L49 ${50 - r + 1.5} Q50 ${50 - r} 51 ${50 - r + 1.5} L53.5 50 Z`} fill={i % 2 ? '#ffe27a' : GOLD} opacity={0.85} transform={`rotate(${i * 22.5} 50 50)`} />
      })}
      <path d={twinkle(50, 50, 31, 0.3)} fill={core.fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
      {/* a white-hot glint in the middle */}
      <path d={twinkle(50, 50, 13, 0.22)} fill="#fff" opacity={0.85} transform="rotate(45 50 50)" />
      <Shine x={44} y={43} rx={4} ry={2.4} />
      {/* little sparkles */}
      {[[16, 17, 8], [84, 19, 6], [83, 83, 8.5], [18, 82, 5.5]].map(([x, y, r]) => (
        <path key={x * 100 + y} d={twinkle(x, y, r, 0.22)} fill="#fff4b3" stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
      ))}
    </g>
  )
}

/** The moon: a plump golden crescent, fast asleep with a little smile. */
function Moon() {
  const body = useShade('#ffe27a', 0.5, 0.14)
  return (
    <g>
      <defs>{body.def}</defs>
      <path d={crescent([50, 51, 40], [66.3, 34.7, 32])} fill={body.fill} stroke={ink(GOLD)} strokeWidth={2.8} strokeLinejoin="round" />
      <Shine x={19} y={40} rx={3.5} ry={9} rot={20} />
      {/* sleepy face in the fat part of the crescent: closed eyes, a little smile, rosy cheeks */}
      <g transform="translate(37 68) rotate(22) scale(1.15)">
        <path d="M-10 0 Q-6.5 3.6 -3 0 M3 0 Q6.5 3.6 10 0" stroke={EYE} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M-2.6 5.4 Q0 8 2.6 5.4" stroke={EYE} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <ellipse cx={-11.5} cy={4.5} rx={3} ry={2} fill="#ff7fb0" opacity={0.55} />
        <ellipse cx={11.5} cy={4.5} rx={3} ry={2} fill="#ff7fb0" opacity={0.55} />
      </g>
    </g>
  )
}

/** A golden star with five plump, rounded points and a little smile. */
function Star() {
  const body = useShade('#ffd23f', 0.45, 0.15)
  return (
    <g>
      <defs>{body.def}</defs>
      <path d={starPath(50, 54, 47)} fill={body.fill} stroke={ink('#ffd23f')} strokeWidth={2.8} strokeLinejoin="round" />
      <CuteFace x={50} y={55} s={0.34} gap={13} />
      <Shine x={38} y={40} rx={5} ry={3} />
    </g>
  )
}

/** A fluffy white cloud. */
function Cloud() {
  const body = useShade(CLOUD_WHITE, 0.6, 0.12)
  return (
    <g>
      <defs>{body.def}</defs>
      <path d={puff([[19, 60, 12], [30, 45, 14], [50, 36, 19], [70, 44, 15], [82, 58, 12], [68, 68, 12], [50, 70, 12], [32, 68, 12]])}
        fill={body.fill} stroke={CLOUD_LINE} strokeWidth={2.8} strokeLinejoin="round" />
      <Shine x={34} y={40} rx={8} ry={4} />
    </g>
  )
}

const RAINBOW = ['#ff6b6b', '#ffa94d', '#ffe14d', '#5fd39a', '#5fb7ff', '#a98cff']

/** A rainbow: six bright bands in an arch, with a little cloud at each end. */
function Rainbow() {
  const fluffy = useShade(CLOUD_WHITE, 0.6, 0.12)
  const cx = 50, cy = 65, R = 44, w = 4.6
  const band = (ro: number, ri: number) => `M${cx - ro} ${cy} A${ro} ${ro} 0 0 1 ${cx + ro} ${cy} L${cx + ri} ${cy} A${ri} ${ri} 0 0 0 ${cx - ri} ${cy} Z`
  return (
    <g>
      <defs>{fluffy.def}</defs>
      {RAINBOW.map((c, i) => <path key={c} d={band(R - i * w, R - (i + 1) * w)} fill={c} />)}
      <path d={band(R, R - 6 * w)} fill="none" stroke="#b58ab8" strokeWidth={2.2} strokeLinejoin="round" />
      <Shine x={21} y={37} rx={6} ry={2.4} rot={-55} />
      {[20, 80].map((x) => <path key={x} d={puff(littleCloud(x, 68))} fill={fluffy.fill} stroke={CLOUD_LINE} strokeWidth={2.4} strokeLinejoin="round" />)}
    </g>
  )
}

// The sea's two curling crests (they roll to the right) and its body of water, which hides where they start.
const BIG_CREST: Curl = { cx: 36, cy: 34, a0: 2.5, turns: 1, r0: 24, r1: 5, w0: 16, w1: 4.5 }
const SMALL_CREST: Curl = { cx: 74, cy: 50, a0: 2.5, turns: 0.95, r0: 15, r1: 4, w0: 11, w1: 3.5 }
const SEA_BODY = 'M5 81 L5 62 C5 53 8 45 14 42 C20 39 24 44 27 48 C32 52 44 53 52 52 C56 51 58 50 61 51 C64 52 66 55 70 58 C76 61 83 60 88 62 C93 64 95 69 95 74 L95 81 Q95 90 86 90 L14 90 Q5 90 5 81 Z'
const SEA_FRONT = 'M5 81 L5 76 Q11 70 17 74 T29 74 T41 74 T53 74 T65 74 T77 74 T89 74 Q93 71 95 76 L95 81 Q95 90 86 90 L14 90 Q5 90 5 81 Z'

/** The sea: rolling blue waves, a big one curling over with white foam, a smaller one behind it, and more rolling in front. */
function Sea() {
  const water = useShade('#5fb7ff', 0.35, 0.18)
  const deep = useShade('#3f9ae6', 0.3, 0.2)
  const line = ink('#5fb7ff')
  return (
    <g>
      <defs>{water.def}{deep.def}</defs>
      {[SMALL_CREST, BIG_CREST].map((c) => (
        <g key={c.cx}>
          <path d={curlPath(c)} fill={water.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
          <path d={foamPath(c, 0.08, 0.5)} fill="#fff" />
        </g>
      ))}
      <path d={SEA_BODY} fill={water.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <Shine x={16} y={54} rx={6} ry={3} />
      <path d={SEA_FRONT} fill={deep.fill} stroke={ink('#3f9ae6')} strokeWidth={2.5} strokeLinejoin="round" />
      {[11, 35, 59, 83].map((x) => <path key={x} d={`M${x - 4} 76 q4 -3 8 0`} stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />)}
    </g>
  )
}

/** A raindrop: one big shiny drop of water. */
function Raindrop() {
  const water = useShade('#5fb7ff', 0.45, 0.15)
  return (
    <g>
      <defs>{water.def}</defs>
      <path d={drop(50, 63, 28)} fill={water.fill} stroke={ink('#5fb7ff')} strokeWidth={2.8} strokeLinejoin="round" />
      <Shine x={37} y={60} rx={4.5} ry={10} rot={20} />
    </g>
  )
}

/** A splash: a crown of water jumping up out of a pool, with drops flying off it. */
function Splash() {
  const water = useShade('#7cc8ff', 0.45, 0.15)
  const pool = useShade('#5fb7ff', 0.35, 0.15)
  const line = ink('#5fb7ff')
  return (
    <g>
      <defs>{water.def}{pool.def}</defs>
      <ellipse cx={50} cy={80} rx={42} ry={11} fill={pool.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={81} rx={30} ry={6} fill="none" stroke="#fff" strokeWidth={2} opacity={0.6} />
      <path d="M24 82 C22 72 16 62 10 55 Q7 51 11 50.5 C19 54 26 59 30 65 C29 54 27 44 28 35 Q30 29 32 34 C36 42 39 51 42 59 C43 46 46 32 48 21 Q50 15 52 21 C54 32 57 46 58 59 C61 51 64 42 68 34 Q70 29 72 35 C73 44 71 54 70 65 C74 59 81 54 89 50.5 Q93 51 90 55 C84 62 78 72 76 82 Q50 88 24 82 Z"
        fill={water.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      {[[13, 37, 135], [28, 16, 160], [72, 16, -160], [87, 37, -135]].map(([x, y, a]) => (
        <path key={x} d={drop(x, y, 4)} fill={water.fill} stroke={line} strokeWidth={2} strokeLinejoin="round" transform={`rotate(${a} ${x} ${y})`} />
      ))}
      <Shine x={47} y={44} rx={2} ry={6} rot={5} />
    </g>
  )
}

/** Wind: three swirly gusts blowing along, curling round at their ends (no face). */
function Wind() {
  const air = useShade('#d9f1ff', 0.7, 0.1)
  const line = '#6aa6dc'
  const gusts = [
    'M8 34 C22 28 38 36 54 32 C66 29 76 26 76 18 C76 11 66 9 62 14 C59 18 62 23 67 22',
    'M6 54 C24 50 46 58 70 52 C82 49 92 42 89 34 C86 27 76 28 75 34 C74 38 78 41 82 39',
    'M14 74 C28 70 40 78 56 76 C66 75 74 79 73 86 C72 92 63 93 60 88 C58 84 61 81 65 82',
  ]
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>{air.def}</defs>
      {gusts.map((d) => <path key={d} d={d} stroke={line} strokeWidth={10.5} />)}
      {gusts.map((d) => <path key={`${d}-in`} d={d} stroke={air.fill} strokeWidth={5.8} />)}
    </g>
  )
}

/** A big leafy tree on a sturdy trunk. */
function Tree() {
  const leaves = useShade('#5fc46a', 0.3, 0.2)
  const bark = useShade('#9a6a3a', 0.25, 0.2)
  const green = ink('#5fc46a')
  return (
    <g>
      <defs>{leaves.def}{bark.def}</defs>
      <ellipse {...groundShadow(50, 93, 26)} />
      <path d="M36 92 Q43 89 44 80 L45 60 L55 60 L56 80 Q57 89 64 92 Z" fill={bark.fill} stroke={ink('#9a6a3a')} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={puff([[18, 42, 12], [24, 27, 12], [37, 19, 13], [55, 19, 14], [71, 23, 13], [81, 36, 12], [80, 51, 12], [66, 60, 12], [48, 62, 13], [30, 58, 12]])}
        fill={leaves.fill} stroke={green} strokeWidth={2.8} strokeLinejoin="round" />
      {[[30, 44], [56, 34], [64, 50], [42, 54], [46, 30]].map(([x, y]) => (
        <path key={x} d={`M${x - 5} ${y} Q${x} ${y + 4} ${x + 5} ${y}`} stroke={darken('#5fc46a', 0.18)} strokeWidth={2} fill="none" strokeLinecap="round" />
      ))}
      <Shine x={32} y={28} rx={8} ry={4.5} />
    </g>
  )
}

/** One green leaf with its veins and a little stalk. */
function Leaf() {
  const body = useShade('#6cc75a', 0.35, 0.18)
  const line = ink('#6cc75a')
  const vein = lighten('#6cc75a', 0.4)
  return (
    <g>
      <defs>{body.def}</defs>
      <g transform="translate(50 50) rotate(-42) scale(1.1) translate(-50 -50)">
        <path d="M3 52 Q8 51 15 50.5" stroke={line} strokeWidth={3} strokeLinecap="round" fill="none" />
        <path d="M12 51 C14 31 36 22 58 25 C72 27 84 41 96 49 C84 56 72 72 54 74 C34 76 14 70 12 51 Z" fill={body.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M16 50.5 Q52 47 90 49" stroke={vein} strokeWidth={2.1} fill="none" strokeLinecap="round" />
        {[30, 48, 66].map((x) => (
          <path key={x} d={`M${x} 49 Q${x + 6} 42 ${x + 12} 37 M${x} 49.5 Q${x + 6} 56 ${x + 12} 61`} stroke={vein} strokeWidth={1.7} fill="none" strokeLinecap="round" />
        ))}
        <Shine x={34} y={36} rx={6} ry={3} rot={0} />
      </g>
    </g>
  )
}

/** A smooth, round river stone, like the ones David picked from the stream. */
function Stone() {
  const body = useShade('#a9b1ba', 0.4, 0.2)
  return (
    <g>
      <defs>{body.def}</defs>
      <ellipse {...groundShadow(50, 91, 36)} />
      <path d="M10 70 C9 48 30 33 54 33 C78 33 93 50 90 70 C88 85 72 91 50 91 C28 91 11 85 10 70 Z" fill={body.fill} stroke={ink('#a9b1ba')} strokeWidth={2.8} strokeLinejoin="round" />
      {[[36, 56, 1.6], [62, 48, 1.2], [70, 72, 1.8], [44, 78, 1.3], [26, 68, 1.1], [80, 60, 1]].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={darken('#a9b1ba', 0.2)} />
      ))}
      <Shine x={33} y={47} rx={11} ry={5.5} />
    </g>
  )
}

/** A big mountain with a snowy top and a smaller one beside it, with green hills at their feet. */
function Mountain() {
  const rock = useShade('#8f9cbc', 0.3, 0.2)
  const far = useShade('#adb8d4', 0.3, 0.15)
  const hills = useShade('#7cc46a', 0.3, 0.15)
  const main = 'M4 90 L36.7 19.3 Q40 12 43.9 19 L84 90 Z'
  const back = 'M50 90 L70.6 42 Q74 35 77.4 42 L97 90 Z'
  const snow = '#fbfdff', snowShade = '#dce4f2'
  return (
    <g>
      <defs>{rock.def}{far.def}{hills.def}</defs>
      <ellipse {...groundShadow(50, 91, 46)} />
      {/* the smaller mountain behind, shady on its right */}
      <path d={back} fill={far.fill} />
      <path d="M74 38.5 Q75.7 38.5 77.4 42 L97 90 L82 90 L80 70 L83 60 L77 48 Z" fill={darken('#adb8d4', 0.1)} />
      <path d="M66.8 50.6 L70.6 42 Q74 35 77.4 42 L81 50.4 Q78.6 54 76 50.5 Q73.5 55 71 51 Q69 53.5 66.8 50.6 Z" fill={snow} />
      <path d="M74 38.5 Q75.7 38.5 77.4 42 L81 50.4 Q78.6 54 76 50.5 L77 48 Z" fill={snowShade} />
      <path d={back} fill="none" stroke={ink('#adb8d4')} strokeWidth={2.5} strokeLinejoin="round" />
      {/* the big mountain */}
      <path d={main} fill={rock.fill} />
      <path d="M40.2 15.6 Q42 15.5 43.9 19 L84 90 L58 90 L52 72 L55 58 L47 42 L44 26 Z" fill={darken('#8f9cbc', 0.12)} />
      <path d="M27.4 39.2 L36.7 19.3 Q40 12 43.9 19 L54.7 38.1 Q51 43 47.5 38 Q44 44.5 40 38.5 Q36 44 32 39.6 Q29.6 41.6 27.4 39.2 Z" fill={snow} />
      <path d="M40.2 15.6 Q42 15.5 43.9 19 L54.7 38.1 Q51 43 47.5 38 L44 26 Z" fill={snowShade} />
      <path d={main} fill="none" stroke={ink('#8f9cbc')} strokeWidth={2.8} strokeLinejoin="round" />
      <Shine x={28} y={56} rx={6} ry={3} rot={-60} />
      {/* grassy hills along the bottom */}
      <path d="M3 90 C5 83 13 80 21 83 C29 78 39 79 45 84 C53 79 63 80 69 84 C77 80 89 81 97 89 L97 90 Z" fill={hills.fill} stroke={ink('#7cc46a')} strokeWidth={2.4} strokeLinejoin="round" />
    </g>
  )
}

/** A palm frond from (x, y): a long leaf pointing at angle a (degrees), arching up and drooping at its tip, and its midrib. */
function frond(x: number, y: number, a: number, len: number) {
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r)
  // in its own frame the frond points along +u; -v is the side facing the sky
  const up = c < 0 ? -1 : 1
  const at = (u: number, v: number) => pt(x + u * c - v * up * s, y + u * s + v * up * c)
  return {
    leaf: `M${at(0, -1.5)} Q${at(len * 0.5, -len * 0.32)} ${at(len, len * 0.06)} Q${at(len * 0.5, -len * 0.04)} ${at(0, 2)}Z`,
    rib: `M${at(3, 0)} Q${at(len * 0.5, -len * 0.17)} ${at(len * 0.88, len * 0.03)}`,
  }
}

const PALM_TRUNK = bend([38, 82], [40, 50], [58, 32])

/** The beach: golden sand and a bit of blue sea, with a palm tree. */
function Beach() {
  const sand = useShade('#f6d48c', 0.4, 0.15)
  const sea = useShade('#5fb7ff', 0.35, 0.15)
  const palm = useShade('#4cbf6a', 0.3, 0.2)
  const trunk = useShade('#b07a45', 0.3, 0.2)
  const leafLine = ink('#4cbf6a')
  return (
    <g>
      <defs>{sand.def}{sea.def}{palm.def}{trunk.def}</defs>
      <ellipse {...groundShadow(50, 91, 44)} />
      {/* the sea behind, with a little foam */}
      <path d="M8 78 C4 74 4 63 8 60 Q14 54 20 60 T32 60 T44 60 T56 60 T68 60 T80 60 T92 60 C96 63 96 74 92 78 Z" fill={sea.fill} stroke={ink('#5fb7ff')} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M22 66 q4 -3 8 0 M70 65 q4 -3 8 0" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />
      {/* the palm tree */}
      <path d={tube(PALM_TRUNK, (t) => 11 - 5 * t, 16)} fill={trunk.fill} stroke={ink('#b07a45')} strokeWidth={2.4} strokeLinejoin="round" />
      {[0.2, 0.4, 0.6, 0.78].map((t) => {
        // rings round the trunk
        const [x, y] = PALM_TRUNK(t), [x2, y2] = PALM_TRUNK(t + 0.01)
        const l = Math.hypot(x2 - x, y2 - y), tx = (x2 - x) / l, ty = (y2 - y) / l, h = (11 - 5 * t) / 2 - 0.8
        return <path key={t} d={`M${pt(x - ty * h, y + tx * h)} Q${pt(x + tx * 3, y + ty * 3)} ${pt(x + ty * h, y - tx * h)}`} stroke={darken('#b07a45', 0.25)} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      })}
      {[-15, -60, -112, -160, 22, 158].map((a) => {
        const f = frond(58, 30, a, a === -60 || a === -112 ? 24 : 30)
        return (
          <g key={a}>
            <path d={f.leaf} fill={palm.fill} stroke={leafLine} strokeWidth={2.2} strokeLinejoin="round" />
            <path d={f.rib} stroke={leafLine} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.7} />
          </g>
        )
      })}
      {[[54.5, 35], [61.5, 35], [58, 39]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={3.8} fill="#8a5a2e" stroke={ink('#8a5a2e')} strokeWidth={1.6} />)}
      {/* the sand in front, with a starfish */}
      <path d="M6 90 C6 78 18 72 34 72 C52 72 60 68 76 68 C88 68 95 76 95 90 Z" fill={sand.fill} stroke={ink('#f6d48c')} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={starPath(76, 81, 6.5)} fill="#ff9a62" stroke={ink('#ff9a62')} strokeWidth={1.6} strokeLinejoin="round" transform="rotate(12 76 81)" />
      <Shine x={22} y={78} rx={6} ry={3} />
    </g>
  )
}

/** The world: a round globe of blue sea with green land on it. */
function Earth() {
  const sea = useShade('#4fa8f0', 0.4, 0.2)
  const land = useShade('#6cc46a', 0.35, 0.15)
  const coast = ink('#6cc46a')
  return (
    <g>
      <defs>{sea.def}{land.def}</defs>
      <circle cx={50} cy={50} r={42} fill={sea.fill} />
      <g fill={land.fill} stroke={coast} strokeWidth={1.8} strokeLinejoin="round">
        <path d="M9.4 39.1 C14 40 18 44 22 48 C25 51 28 54 32 54 C30 50 32 46 37 46 C40 46 42 42 41 38 C46 36 48 30 46 24 C45 20 42 16 35.6 10.5 A42 42 0 0 0 9.4 39.1 Z" />
        <path d="M33 56 C38 54 46 56 50 60 C52 64 50 70 46 74 C44 78 42 84 40 88 C38 84 35 78 33 72 C31 66 30 60 33 56 Z" />
        <path d="M74.1 15.6 C70 20 66 24 68 30 C64 34 62 40 66 44 C70 48 74 50 74 56 C76 64 78 70 82.2 77 A42 42 0 0 0 74.1 15.6 Z" />
      </g>
      <circle cx={50} cy={50} r={42} fill="none" stroke={ink('#4fa8f0')} strokeWidth={2.8} />
      <Shine x={34} y={26} rx={9} ry={5} />
    </g>
  )
}

/** A pink blossom: five notched petals round a little yellow middle. */
function Flower() {
  const petal = useShade('#ffb0d0', 0.45, 0.12)
  const line = ink('#ffb0d0')
  return (
    <g>
      <defs>{petal.def}</defs>
      <g transform="translate(50 52)">
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -6 C-9 -12 -17 -24 -13 -33 C-11 -38 -6 -40 -2.5 -37 L0 -34 L2.5 -37 C6 -40 11 -38 13 -33 C17 -24 9 -12 0 -6 Z" fill={petal.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
            <path d="M0 -10 L0 -20" stroke="#ff7fb0" strokeWidth={1.8} strokeLinecap="round" />
          </g>
        ))}
        <circle r={8} fill="#ffe066" stroke={ink('#ffe066')} strokeWidth={2} />
      </g>
      <Shine x={38} y={30} rx={5} ry={3} />
    </g>
  )
}

/** A grass tuft: three pointed blades growing up from (x, y). */
const tuft = (x: number, y: number) =>
  `M${x - 5} ${y} Q${x - 6} ${y - 8} ${x - 11} ${y - 13} Q${x - 2} ${y - 9} ${x - 1} ${y} Z ` +
  `M${x - 2.5} ${y} Q${x - 2} ${y - 12} ${x} ${y - 19} Q${x + 2} ${y - 12} ${x + 2.5} ${y} Z ` +
  `M${x + 1} ${y} Q${x + 2} ${y - 9} ${x + 11} ${y - 12} Q${x + 6} ${y - 7} ${x + 5} ${y} Z`

/** Plants: a little patch of ground with grass, a flower and a small bush growing from it. */
function Plants() {
  const soil = useShade('#a8714a', 0.3, 0.2)
  const bush = useShade('#5cbf62', 0.35, 0.2)
  const petal = '#ff7a9a'
  const green = '#4fae55'
  return (
    <g>
      <defs>{soil.def}{bush.def}</defs>
      <ellipse {...groundShadow(50, 91, 42)} />
      {/* the bush */}
      <path d={puff([[54, 68, 10], [56, 55, 11], [68, 46, 13], [81, 53, 11], [85, 66, 9], [70, 72, 10]])} fill={bush.fill} stroke={ink('#5cbf62')} strokeWidth={2.5} strokeLinejoin="round" />
      <Shine x={62} y={48} rx={5} ry={3} />
      {/* the flower */}
      <path d="M30 78 C32 64 26 50 28 34" stroke={ink(green)} strokeWidth={4.6} fill="none" strokeLinecap="round" />
      <path d="M30 78 C32 64 26 50 28 34" stroke={green} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M30 64 Q20 56 14 60 Q20 68 30 64 Z M28.5 54 Q38 46 43 50 Q38 58 28.5 54 Z" fill={green} stroke={ink(green)} strokeWidth={1.8} strokeLinejoin="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={28} cy={18} r={7} fill={petal} stroke={ink(petal)} strokeWidth={2} transform={`rotate(${a} 28 26)`} />
      ))}
      <circle cx={28} cy={26} r={5.5} fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={1.8} />
      {/* the ground, with grass */}
      <path d="M6 90 C8 78 26 74 50 74 C74 74 92 78 94 90 Z" fill={soil.fill} stroke={ink('#a8714a')} strokeWidth={2.5} strokeLinejoin="round" />
      {[[24, 85], [38, 81], [60, 85], [74, 82]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx={1.8} ry={1.1} fill={darken('#a8714a', 0.25)} />)}
      <path d={`${tuft(16, 80)} ${tuft(47, 76)} ${tuft(84, 80)}`} fill={green} stroke={ink(green)} strokeWidth={1.6} strokeLinejoin="round" />
    </g>
  )
}

/** A friendly campfire: a warm flame dancing on two crossed logs. */
function Fire() {
  const outer = useShade('#ff7a3d', 0.35, 0.15)
  const wood = useShade('#a0693c', 0.3, 0.2)
  const flame = 'M50 86 C32 86 20 76 20 62 C20 50 24 40 26 30 C32 38 36 42 39 46 C38 30 46 14 49 8 Q50 6 51 8 C56 18 64 28 63 39 C68 34 72 30 75 22 C80 34 82 48 80 62 C78 76 66 86 50 86 Z'
  const log = (a: number) => (
    <g transform={`rotate(${a} 50 79)`}>
      <rect x={15} y={73} width={70} height={12} rx={6} fill={wood.fill} stroke={ink('#a0693c')} strokeWidth={2.4} />
      <ellipse cx={a < 0 ? 80 : 20} cy={79} rx={3.4} ry={5} fill="#e8c08a" stroke={ink('#a0693c')} strokeWidth={1.6} />
    </g>
  )
  return (
    <g>
      <defs>{outer.def}{wood.def}</defs>
      <ellipse {...groundShadow(50, 93, 36)} />
      <path d={flame} fill={outer.fill} stroke={ink('#ff7a3d')} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={flame} fill="#ffa93a" transform="translate(50 86) scale(0.7) translate(-50 -86)" />
      <path d={flame} fill="#ffe066" transform="translate(50 86) scale(0.42) translate(-50 -86)" />
      <Shine x={34} y={52} rx={3} ry={7} rot={15} />
      {log(12)}
      {log(-12)}
      <circle cx={24} cy={18} r={2.4} fill="#ffb347" />
      <circle cx={78} cy={12} r={1.9} fill="#ffb347" />
    </g>
  )
}

/** Fast asleep: three floating Z shapes, getting smaller as they drift up. */
function Sleep() {
  const color = '#8fb4ff'
  const line = ink(color)
  // each Z is a zigzag: along the top, down the slant, along the bottom
  const zs: [number, number, number, number][] = [[30, 68, 30, 8], [59, 41, 22, 6.5], [81, 19, 15, 5]]
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {zs.map(([x, y, s, w]) => {
        const d = `M${x - s / 2} ${y - s / 2} L${x + s / 2} ${y - s / 2} L${x - s / 2} ${y + s / 2} L${x + s / 2} ${y + s / 2}`
        return (
          <g key={x} transform={`rotate(-8 ${x} ${y})`}>
            <path d={d} stroke={line} strokeWidth={w + 4.5} />
            <path d={d} stroke={color} strokeWidth={w} />
          </g>
        )
      })}
      <Shine x={24} y={52} rx={4} ry={1.6} rot={-8} />
    </g>
  )
}

export const NATURE: Item[] = [
  { id: 'sun', name: 'sun', emoji: ['☀️'], Draw: Sun },
  { id: 'light', name: 'light', emoji: ['✨'], Draw: Light },
  { id: 'moon', name: 'moon', emoji: ['🌙'], Draw: Moon },
  { id: 'star', name: 'star', emoji: ['⭐'], Draw: Star },
  { id: 'cloud', name: 'cloud', emoji: ['☁️', '☁'], Draw: Cloud },
  { id: 'rainbow', name: 'rainbow', emoji: ['🌈'], Draw: Rainbow },
  { id: 'sea', name: 'the sea', emoji: ['🌊'], Draw: Sea },
  { id: 'raindrop', name: 'raindrop', emoji: ['💧'], Draw: Raindrop },
  { id: 'splash', name: 'splash', emoji: ['💦'], Draw: Splash },
  { id: 'wind', name: 'wind', emoji: ['🌬️', '🌬'], Draw: Wind },
  { id: 'tree', name: 'tree', emoji: ['🌳'], Draw: Tree },
  { id: 'leaf', name: 'leaf', emoji: ['🍃'], Draw: Leaf },
  { id: 'stone', name: 'smooth stone', emoji: ['🪨'], Draw: Stone },
  { id: 'mountain', name: 'mountain', emoji: ['⛰️', '⛰'], Draw: Mountain },
  { id: 'beach', name: 'beach', emoji: ['🏖️', '🏖'], Draw: Beach },
  { id: 'earth', name: 'the world', emoji: ['🌍', '🌎', '🌏'], Draw: Earth },
  { id: 'flower', name: 'flower', emoji: ['🌸'], Draw: Flower },
  { id: 'plants', name: 'plants', emoji: [], Draw: Plants },
  { id: 'fire', name: 'fire', emoji: ['🔥'], Draw: Fire },
  { id: 'sleep', name: 'fast asleep', emoji: ['💤'], Draw: Sleep },
]
