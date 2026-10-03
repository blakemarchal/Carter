// Objects, places and Bible things. Each draws in a 100 x 100 box (see ./types.ts).
import type { ReactNode } from 'react'
import type { Item } from './types'
import { darken, EYE, groundShadow, ink, lighten, Shine, useShade } from './draw'

// ---------- Local helpers ----------

/** Round line ends and corners, for everything in an item. */
const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

const f = (n: number) => n.toFixed(1)

/** A five-pointed star centred on (cx, cy). */
function starPath(cx: number, cy: number, r: number, inner = 0.48, turn = 0) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = ((36 * i - 90 + turn) * Math.PI) / 180
    const d = i % 2 ? r * inner : r
    return `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * d)} ${f(cy + Math.sin(a) * d)}`
  }).join(' ') + 'Z'
}

/** A four-pointed twinkle centred on (x, y). */
function twinkle(x: number, y: number, r: number) {
  const k = r * 0.2
  return `M${f(x)} ${f(y - r)} Q${f(x + k)} ${f(y - k)} ${f(x + r)} ${f(y)} Q${f(x + k)} ${f(y + k)} ${f(x)} ${f(y + r)} Q${f(x - k)} ${f(y + k)} ${f(x - r)} ${f(y)} Q${f(x - k)} ${f(y - k)} ${f(x)} ${f(y - r)}Z`
}

/** A jagged burst: its points reach out to each radius in `out` in turn, with dips to `inner` between. */
function burst(cx: number, cy: number, out: number[], inner: number, turn = 0) {
  const n = out.length
  return Array.from({ length: n * 2 }, (_, i) => {
    const a = (((i * 180) / n - 90 + turn) * Math.PI) / 180
    const r = i % 2 ? inner : out[i / 2]
    return `${i ? 'L' : 'M'}${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`
  }).join(' ') + 'Z'
}

/** A spiral from radius r0 out to r1 (clockwise), `turns` times round, ending at angle `end` (degrees). */
function spiral(cx: number, cy: number, r0: number, r1: number, turns: number, end: number) {
  const steps = Math.round(turns * 60)
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    const a = (end * Math.PI) / 180 - turns * Math.PI * 2 * (1 - t)
    const r = r0 + (r1 - r0) * t
    return `${i ? 'L' : 'M'}${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`
  }).join(' ')
}

/** A soft heap (of hay) from x0 to x1, standing on y = base and h high, its top a row of n little puffs. */
function heap(x0: number, x1: number, base: number, h: number, n: number) {
  const p = Array.from({ length: n + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / n, base - h * Math.sin((Math.PI * i) / n) ** 0.6])
  return `M${f(p[0][0])} ${f(p[0][1])}` + p.slice(1).map(([x, y], i) => {
    const r = f(Math.hypot(x - p[i][0], y - p[i][1]) * 0.62)
    return ` A${r} ${r} 0 0 1 ${f(x)} ${f(y)}`
  }).join('') + 'Z'
}

/** Draws `children` twice, a fat ink outline under the fill, so overlapping parts read as one outlined shape. */
function Merged({ color, fill, w = 2.5, children }: { color: string; fill: string; w?: number; children: ReactNode }) {
  return (
    <>
      <g fill={ink(color)} stroke={ink(color)} strokeWidth={w * 2}>{children}</g>
      <g fill={fill}>{children}</g>
    </>
  )
}

/** A thick outlined line along `d` (a bike frame, a harp's arms, a cord): ink underneath, colour on top. */
function Tube({ d, color, paint, w, line = 2.2 }: { d: string; color: string; paint?: string; w: number; line?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={ink(color)} strokeWidth={w + line * 2} />
      <path d={d} fill="none" stroke={paint ?? color} strokeWidth={w} />
    </>
  )
}

/** The black patches and seams of a soccer ball centred on (cx, cy) with radius R. */
function soccer(cx: number, cy: number, R: number, turn: number) {
  type P = [number, number]
  const at = (ox: number, oy: number, r: number, deg: number): P => [ox + r * Math.cos((deg * Math.PI) / 180), oy + r * Math.sin((deg * Math.PI) / 180)]
  const xy = ([x, y]: P) => `${f(x)} ${f(y)}`
  // where the edge p -> q crosses the ball's rim (going out, or coming back in)
  const rim = (p: P, q: P, entering: boolean): P => {
    const dx = q[0] - p[0], dy = q[1] - p[1], fx = p[0] - cx, fy = p[1] - cy
    const a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - R * R
    const s = Math.sqrt(b * b - 4 * a * c)
    const t = (-b + (entering ? -s : s)) / (2 * a)
    return [p[0] + t * dx, p[1] + t * dy]
  }
  const mid = Array.from({ length: 5 }, (_, k) => at(cx, cy, R * 0.3, turn - 90 + 72 * k))
  const outer = Array.from({ length: 5 }, (_, k) => {
    const th = turn - 90 + 72 * k
    const [ox, oy] = at(cx, cy, R * 0.86, th)
    return Array.from({ length: 5 }, (_, j) => at(ox, oy, R * 0.29, th + 180 + 72 * j))
  })
  return {
    patches: [
      `M${mid.map(xy).join(' L')}Z`,
      ...outer.map((v) => `M${xy(v[0])} L${xy(v[1])} L${xy(rim(v[1], v[2], false))} A${R} ${R} 0 0 1 ${xy(rim(v[3], v[4], true))} L${xy(v[4])}Z`),
    ],
    seams: outer.map((v, k) => `M${xy(mid[k])} L${xy(v[0])} M${xy(v[4])} L${xy(outer[(k + 1) % 5][1])}`).join(' '),
  }
}
const BALL = soccer(50, 52, 38, 0)
const HAY = heap(10, 90, 64, 24, 9)

// ---------- Items ----------

/** A woven basket heaped with bread and fish (the leftovers at the loaves and fishes). */
function BasketOfFood() {
  const wicker = useShade('#d0924f', 0.3, 0.2)
  const crust = '#e3a253'
  return (
    <g>
      <defs>{wicker.def}</defs>
      <ellipse {...groundShadow(50, 92, 34)} />
      {/* food piled up inside, behind the front of the basket */}
      <ellipse cx={36} cy={44} rx={16} ry={10} fill={crust} stroke={ink(crust)} strokeWidth={2.2} />
      <path d="M28 42 q4 -5 8 0 M38 41 q4 -5 8 0" stroke={lighten(crust, 0.45)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <g transform="rotate(-18 64 42)">
        <path d="M78 42 L88 34 L88 50 Z" fill="#7cc0f0" stroke={ink('#7cc0f0')} strokeWidth={2} strokeLinejoin="round" />
        <ellipse cx={64} cy={42} rx={16} ry={9} fill="#7cc0f0" stroke={ink('#7cc0f0')} strokeWidth={2.2} />
        <circle cx={55} cy={40} r={1.8} fill="#2b2140" />
      </g>
      <ellipse cx={52} cy={50} rx={15} ry={9} fill={crust} stroke={ink(crust)} strokeWidth={2.2} />
      {/* the basket */}
      <path d="M12 50 L88 50 L78 88 Q50 94 22 88 Z" fill={wicker.fill} stroke={ink('#d0924f')} strokeWidth={2.8} strokeLinejoin="round" />
      {[60, 70, 80].map((y) => <path key={y} d={`M${14 + (y - 50) * 0.25} ${y} Q50 ${y + 5} ${86 - (y - 50) * 0.25} ${y}`} stroke={darken('#d0924f', 0.22)} strokeWidth={2} fill="none" />)}
      {[26, 38, 50, 62, 74].map((x) => <path key={x} d={`M${x} 52 L${x + (x - 50) * -0.12} 88`} stroke={darken('#d0924f', 0.18)} strokeWidth={1.6} />)}
      <rect x={9} y={46} width={82} height={9} rx={4.5} fill={lighten('#d0924f', 0.15)} stroke={ink('#d0924f')} strokeWidth={2.5} />
      <Shine x={24} y={62} rx={6} ry={3.5} />
    </g>
  )
}

/** A little sailing boat on a wave: a red hull, two white sails and a yellow flag on the mast. */
function Sailboat() {
  const hull = useShade('#f25f5c', 0.3, 0.2)
  const sail = useShade('#fffdf7', 0.5, 0.1)
  const sea = useShade('#5fb7ff', 0.4, 0.15)
  const sailLine = '#a9a2b9'
  return (
    <g {...ROUND}>
      <defs>{hull.def}{sail.def}{sea.def}</defs>
      <path d="M51 9 L64 13 L51 17 Z" fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={2} />
      <rect x={47} y={8} width={5} height={58} rx={2.5} fill="#b07a45" stroke={ink('#b07a45')} strokeWidth={2} />
      <path d="M55 17 Q79 38 87 62 L55 62 Z" fill={sail.fill} stroke={sailLine} strokeWidth={2.5} />
      <path d="M44 23 Q31 44 15 62 L44 62 Z" fill={sail.fill} stroke={sailLine} strokeWidth={2.5} />
      <path d="M7 64 L93 64 Q88 82 76 86 L24 86 Q12 82 7 64 Z" fill={hull.fill} stroke={ink('#f25f5c')} strokeWidth={2.8} />
      <path d="M12.5 71 L87.5 71" stroke="#fff" strokeWidth={3} opacity={0.9} />
      <Shine x={24} y={77} rx={6} ry={2.6} rot={-8} />
      <path d="M8 85 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 L92 89 Q92 94 87 94 L13 94 Q8 94 8 89 Z" fill={sea.fill} stroke={ink('#5fb7ff')} strokeWidth={2.5} />
    </g>
  )
}

/** A bicycle side-on: two spoked wheels, an orange frame, a saddle and handlebars. */
function Bike() {
  const c = '#ff8a3d'
  const paint = useShade(c, 0.4, 0.15)
  const tyre = '#3d3550'
  const hubs = [25, 75]
  return (
    <g {...ROUND}>
      <defs>{paint.def}</defs>
      <ellipse {...groundShadow(50, 92, 44)} />
      {hubs.map((x) => (
        <g key={x}>
          <circle cx={x} cy={73} r={13.5} fill="none" stroke="#d3cddd" strokeWidth={1.6} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4 + 0.2
            return <path key={i} d={`M${x} 73 L${f(x + 13.5 * Math.cos(a))} ${f(73 + 13.5 * Math.sin(a))}`} stroke="#bdb5cb" strokeWidth={1.3} />
          })}
          <circle cx={x} cy={73} r={17} fill="none" stroke={tyre} strokeWidth={5} />
        </g>
      ))}
      {/* chain */}
      <path d="M46 69.5 L25 70.5 M46 80.5 L25 75.5" stroke="#6b6378" strokeWidth={1.4} />
      {/* frame, seat post and handlebars */}
      <Tube d="M37 38 L39 46" color={c} w={3.5} line={2} />
      <Tube d="M25 73 L46 75 L39 46 Z M39 46 L68 43 M46 75 L69.5 51 M67 41 L75 73 M67 41 L65 33 Q63 29 57 30" color={c} paint={paint.fill} w={4.5} line={2} />
      <path d="M58 30 L52 31" stroke={tyre} strokeWidth={5} />
      <path d="M27 35 Q36 31 45 34 Q45 38.5 39 38.5 Q31 39 27 35 Z" fill={tyre} stroke={ink(tyre)} strokeWidth={2} />
      {hubs.map((x) => <circle key={x} cx={x} cy={73} r={3} fill="#8a8399" stroke={ink('#8a8399')} strokeWidth={1.4} />)}
      {/* pedals */}
      <circle cx={46} cy={75} r={5.5} fill="#d3cddd" stroke={ink('#d3cddd')} strokeWidth={2} />
      <path d="M46 75 L51 83" stroke="#6b6378" strokeWidth={3} />
      <rect x={46.5} y={82} width={9} height={3.2} rx={1.6} fill="#6b6378" />
      <Shine x={52} y={43.5} rx={5} ry={1.3} rot={-6} />
    </g>
  )
}

/** A rocket zooming up and to the right: a white body, red nose and fins, a round window and a flame. */
function Rocket() {
  const body = useShade('#f6f3fb', 0.6, 0.16)
  const red = useShade('#f2545b', 0.35, 0.2)
  const glass = useShade('#7cd0ff', 0.55, 0.2)
  const flame = useShade('#ffb347', 0.5, 0.1)
  const line = '#8f88a3'
  return (
    <g {...ROUND}>
      <defs>{body.def}{red.def}{glass.def}{flame.def}</defs>
      <g transform="translate(53 49) rotate(40)">
        <path d="M-9 19 Q-12 34 0 50 Q12 34 9 19 Z" fill={flame.fill} stroke={ink('#ff9a3c')} strokeWidth={2.2} />
        <path d="M-4.5 19 Q-5.5 30 0 40 Q5.5 30 4.5 19 Z" fill="#fff1a8" />
        <path d="M-14 -4 Q-30 2 -30 26 Q-23 17 -13 16 Z" fill={red.fill} stroke={ink('#f2545b')} strokeWidth={2.5} />
        <path d="M14 -4 Q30 2 30 26 Q23 17 13 16 Z" fill={red.fill} stroke={ink('#f2545b')} strokeWidth={2.5} />
        <path d="M-9 15 L9 15 L7.5 21 L-7.5 21 Z" fill="#9aa1b5" stroke={ink('#9aa1b5')} strokeWidth={2} />
        <path d="M0 -50 Q16 -36 16 -10 L16 12 Q16 17 11 17 L-11 17 Q-16 17 -16 12 L-16 -10 Q-16 -36 0 -50 Z" fill={body.fill} stroke={line} strokeWidth={2.5} />
        <path d="M0 -50 Q9.2 -42 13.1 -30 Q0 -25 -13.1 -30 Q-9.2 -42 0 -50 Z" fill={red.fill} stroke={ink('#f2545b')} strokeWidth={2.5} />
        <circle cx={0} cy={-10} r={8.5} fill="#b9c3d8" stroke={line} strokeWidth={2.2} />
        <circle cx={0} cy={-10} r={5.6} fill={glass.fill} stroke={ink('#7cd0ff')} strokeWidth={1.2} />
        <circle cx={-2} cy={-12.2} r={1.6} fill="#fff" />
        <rect x={-2.5} y={4} width={5} height={22} rx={2.5} fill={red.fill} stroke={ink('#f2545b')} strokeWidth={2} />
        <Shine x={-8} y={-24} rx={2.6} ry={7} rot={0} />
      </g>
    </g>
  )
}

/** A black-and-white soccer ball. */
function Ball() {
  const white = useShade('#f7f5fb', 0.6, 0.2)
  const patch = '#3b3448'
  return (
    <g {...ROUND}>
      <defs>{white.def}</defs>
      <ellipse {...groundShadow(50, 92, 30)} />
      <circle cx={50} cy={52} r={38} fill={white.fill} />
      <path d={BALL.seams} stroke={patch} strokeWidth={2.2} />
      {BALL.patches.map((d, i) => <path key={i} d={d} fill={patch} stroke={patch} strokeWidth={1.5} />)}
      <circle cx={50} cy={52} r={38} fill="none" stroke="#5e566e" strokeWidth={2.8} />
      <Shine x={33} y={31} rx={8} ry={4.5} />
    </g>
  )
}

/** An artist's wooden palette with six blobs of paint and a paintbrush resting on it. */
function Paints() {
  const wood = useShade('#ecc184', 0.35, 0.18)
  const blobs: [number, number, string][] = [
    [22, 40, '#ff4d5e'], [36, 25, '#ff9a3c'], [55, 20, '#ffd23f'], [74, 25, '#4cc96a'], [17, 60, '#3d9bff'], [54, 79, '#a46bff'],
  ]
  return (
    <g {...ROUND}>
      <defs>{wood.def}</defs>
      <path fillRule="evenodd" d="M48 13 C74 12 93 27 93 45 C93 57 87 63 79 63 C71 63 67 69 69 77 C71 86 62 91 50 91 C24 91 7 74 7 52 C7 29 24 14 48 13 Z M75 46 a5 4.5 0 1 0 10 0 a5 4.5 0 1 0 -10 0 Z" fill={wood.fill} stroke={ink('#ecc184')} strokeWidth={2.8} />
      {blobs.map(([x, y, c]) => (
        <g key={c}>
          <path d={`M${x - 7} ${y + 1} C${x - 7} ${y - 6} ${x - 1} ${y - 8} ${x + 3} ${y - 6.5} C${x + 8} ${y - 5} ${x + 8.5} ${y + 2} ${x + 6} ${y + 5} C${x + 3} ${y + 8} ${x - 6} ${y + 7} ${x - 7} ${y + 1} Z`} fill={c} stroke={ink(c)} strokeWidth={2} />
          <circle cx={x - 2.5} cy={y - 2.5} r={1.8} fill="#fff" opacity={0.75} />
        </g>
      ))}
      {/* the brush */}
      <g transform="translate(32 84) rotate(-50)">
        <path d="M2 0 L30 0" stroke={ink('#e0603a')} strokeWidth={7.5} />
        <path d="M2 0 L30 0" stroke="#e0603a" strokeWidth={4} />
        <rect x={29} y={-4.2} width={9} height={8.4} rx={1.5} fill="#cfd5e2" stroke={ink('#cfd5e2')} strokeWidth={2} />
        <path d="M38 -4.2 Q48 -5 55 0 Q48 5 38 4.2 Z" fill="#3d9bff" stroke={ink('#3d9bff')} strokeWidth={2} />
        <path d="M38 -4.2 Q42 -4.6 44 -4.4 L44 4.4 Q42 4.6 38 4.2 Z" fill="#f2dcae" />
      </g>
      <Shine x={44} y={44} rx={7} ry={4} />
    </g>
  )
}

/** Two hands pressed together to pray, in a soft glow, with sleeves at the wrists. */
function PrayingHands() {
  const skin = '#ebb48d'
  const hand = useShade(skin, 0.35, 0.15)
  const sleeve = useShade('#8fc1ff', 0.35, 0.18)
  const line = ink(skin)
  // one hand (the other is its mirror): stepped fingertips on the outside, the thumb along the middle
  const one = (
    <g>
      <path d="M50 9 C47 9 45 11.5 44.5 16 C41.5 16 39 19 38.8 24 C35.5 24.5 33 28 33 33.5 C32 45 32 57 34.5 67 C36 73 37.5 77 38.5 81 L50 81 Z" fill={hand.fill} stroke={line} strokeWidth={2.6} />
      <path d="M44.5 16 Q46 28 46 40 M38.8 24 Q40.5 36 41 47" stroke={line} strokeWidth={2} fill="none" />
      <path d="M50 47 C46.5 47 44.5 50 44.5 55 C44.5 63 45 71 46 77 Q47.5 80 50 80 Z" fill={hand.fill} stroke={line} strokeWidth={2.2} />
      <path d="M35 79 L50 79 L50 93 L31 93 Q29 93 30 90 Z" fill={sleeve.fill} stroke={ink('#8fc1ff')} strokeWidth={2.5} />
    </g>
  )
  return (
    <g {...ROUND}>
      <defs>{hand.def}{sleeve.def}</defs>
      <circle cx={50} cy={46} r={40} fill="#fff4bf" opacity={0.5} />
      {one}
      <g transform="translate(100 0) scale(-1 1)">{one}</g>
      <Shine x={38} y={52} rx={2.2} ry={8} rot={0} />
      {[[18, 22, 5], [83, 30, 4], [16, 62, 3.5], [86, 66, 5]].map(([x, y, r], i) => (
        <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={twinkle(x, y, r)} fill="#ffd34d" />
      ))}
    </g>
  )
}

/** Music: two notes joined by a beam, and a single little note. */
function Notes() {
  const blue = '#5b7cfa'
  const pink = '#ff6fae'
  const b = useShade(blue, 0.45, 0.2)
  const p = useShade(pink, 0.45, 0.2)
  return (
    <g {...ROUND}>
      <defs>{b.def}{p.def}</defs>
      <Merged color={pink} fill={p.fill}>
        <ellipse cx={19} cy={52} rx={9.5} ry={7} transform="rotate(-24 19 52)" />
        <rect x={24} y={14} width={4.5} height={38} rx={2} />
        <path d="M24 14 L28.5 14 C30 22 42 25 40 40 C37 32 33 30 28.5 30 Z" />
      </Merged>
      <Merged color={blue} fill={b.fill}>
        <ellipse cx={42} cy={80} rx={11.5} ry={8.5} transform="rotate(-24 42 80)" />
        <ellipse cx={78} cy={70} rx={11.5} ry={8.5} transform="rotate(-24 78 70)" />
        <rect x={47.5} y={26} width={5.5} height={52} rx={2} />
        <rect x={83.5} y={16} width={5.5} height={52} rx={2} />
        <path d="M47.5 24 L89 13 L89 25 L47.5 36 Z" />
      </Merged>
      <Shine x={37} y={77} rx={4} ry={2.4} rot={-24} />
    </g>
  )
}

/** Baby Jesus asleep in a manger, inside a little wooden stable with a bright star above. */
function Stable() {
  const roof = useShade('#e0a94f', 0.35, 0.2)
  const wall = useShade('#9a6a3e', 0.2, 0.25)
  const post = useShade('#b9824e', 0.3, 0.2)
  const manger = useShade('#c98a4e', 0.3, 0.2)
  const blanket = useShade('#fffaf0', 0.5, 0.12)
  const star = useShade('#ffd84a', 0.5, 0.15)
  const skin = '#e8b48c'
  return (
    <g {...ROUND}>
      <defs>{roof.def}{wall.def}{post.def}{manger.def}{blanket.def}{star.def}</defs>
      <ellipse {...groundShadow(50, 92, 42)} />
      {/* the star */}
      <circle cx={50} cy={11} r={11} fill="#fff3a8" opacity={0.6} />
      <path d={starPath(50, 11.5, 9.5)} fill={star.fill} stroke={ink('#ffd84a')} strokeWidth={2} />
      {/* back wall, a soft light inside, roof and posts */}
      <path d="M14 52 L50 33 L86 52 L86 91 L14 91 Z" fill={wall.fill} stroke={ink('#9a6a3e')} strokeWidth={2.5} />
      {[26, 38, 50, 62, 74].map((x) => <path key={x} d={`M${x} ${f(52 - (x <= 50 ? x - 14 : 86 - x) * 0.53 + 3)} L${x} 90`} stroke={darken('#9a6a3e', 0.2)} strokeWidth={1.6} />)}
      <ellipse cx={50} cy={60} rx={33} ry={20} fill="#fff6c0" opacity={0.5} />
      <path d="M4 50 L50 23 L96 50 L90 56 L50 33 L10 56 Z" fill={roof.fill} stroke={ink('#e0a94f')} strokeWidth={2.5} />
      <rect x={11} y={53} width={7} height={38} rx={2} fill={post.fill} stroke={ink('#b9824e')} strokeWidth={2.2} />
      <rect x={82} y={53} width={7} height={38} rx={2} fill={post.fill} stroke={ink('#b9824e')} strokeWidth={2.2} />
      {/* hay on the floor */}
      <path d="M18 91 L18 88 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 L82 91 Z" fill="#f0c95a" />
      {/* manger legs and hay */}
      <Tube d="M32 78 L26 91 M68 78 L74 91" color="#c98a4e" w={2.6} line={1.1} />
      <path d="M24 67 Q24 58 30 61 Q34 55 40 59 Q46 54 52 58 Q58 54 63 58 Q69 55 72 60 Q77 59 76 67 Z" fill="#f2c94c" stroke={ink('#f2c94c')} strokeWidth={1.8} />
      {/* baby Jesus, wrapped up warm and fast asleep */}
      <ellipse cx={56} cy={59} rx={18} ry={10} fill={blanket.fill} stroke={ink('#e8dcc4')} strokeWidth={2.2} />
      <path d="M47 50.5 Q52 59 48 68" stroke={ink('#e8dcc4')} strokeWidth={1.6} fill="none" />
      <circle cx={35} cy={56} r={11} fill={blanket.fill} stroke={ink('#e8dcc4')} strokeWidth={2.2} />
      <circle cx={36.5} cy={57.5} r={8} fill={skin} stroke={ink(skin)} strokeWidth={1.6} />
      <path d="M31.7 57.6 q1.6 1.6 3.2 0 M38.1 57.6 q1.6 1.6 3.2 0" stroke={EYE} strokeWidth={1.4} fill="none" />
      <ellipse cx={32.2} cy={61} rx={1.9} ry={1.2} fill="#ff7fb0" opacity={0.6} />
      <ellipse cx={40.8} cy={61} rx={1.9} ry={1.2} fill="#ff7fb0" opacity={0.6} />
      <path d="M35.4 61.9 q1.1 0.9 2.2 0" stroke={EYE} strokeWidth={1.1} fill="none" />
      {/* the front of the manger */}
      <path d="M24 66 L76 66 L70 81 L30 81 Z" fill={manger.fill} stroke={ink('#c98a4e')} strokeWidth={2.5} />
      <path d="M27.5 73.5 L72.5 73.5" stroke={darken('#c98a4e', 0.18)} strokeWidth={1.6} />
      <path d="M27 66 L25 61 M73 66 L76 61" stroke="#e3b33a" strokeWidth={1.8} />
      <Shine x={33} y={70} rx={5} ry={2.2} rot={-8} />
    </g>
  )
}

/** A black top hat with a red band. */
function TopHat() {
  const c = '#3d3550'
  const felt = useShade(c, 0.35, 0.25)
  const band = '#e8505b'
  return (
    <g {...ROUND}>
      <defs>{felt.def}</defs>
      <ellipse {...groundShadow(50, 92, 36)} />
      <ellipse cx={50} cy={80} rx={41} ry={10} fill={felt.fill} stroke={ink(c)} strokeWidth={2.8} />
      <path d="M26 22 L28 79 Q50 87 72 79 L74 22 Z" fill={felt.fill} stroke={ink(c)} strokeWidth={2.8} />
      <path d="M27.4 62 Q50 69 72.6 62 L72.9 73 Q50 80 27.1 73 Z" fill={band} stroke={ink(band)} strokeWidth={2.2} />
      <ellipse cx={50} cy={22} rx={24} ry={6.5} fill={lighten(c, 0.15)} stroke={ink(c)} strokeWidth={2.8} />
      <Shine x={35} y={42} rx={2.6} ry={11} rot={0} />
    </g>
  )
}

/** A cosy wooden bed side-on, with a fluffy pillow and a blue quilt. */
function Bed() {
  const wood = useShade('#c98a4e', 0.3, 0.2)
  const sheet = useShade('#fffaf2', 0.5, 0.12)
  const quilt = useShade('#6fb3ff', 0.35, 0.18)
  const w = ink('#c98a4e')
  const s = ink('#e8dfd2')
  return (
    <g {...ROUND}>
      <defs>{wood.def}{sheet.def}{quilt.def}</defs>
      <ellipse {...groundShadow(50, 92, 44)} />
      {/* headboard, mattress on its rail, pillow */}
      <path d="M7 92 L7 36 Q7 26 15 26 Q23 26 23 36 L23 92 Z" fill={wood.fill} stroke={w} strokeWidth={2.6} />
      <rect x={21} y={70} width={60} height={9} rx={2} fill={wood.fill} stroke={w} strokeWidth={2.4} />
      <rect x={21} y={57} width={60} height={14} rx={5} fill={sheet.fill} stroke={s} strokeWidth={2.2} />
      <path d="M24 56 C22 49 27 46 34 46 C41 46 46 48 45 54 C45 58 40 59 34 59 C28 59 24 59 24 56 Z" fill={sheet.fill} stroke={s} strokeWidth={2.2} />
      <path d="M31 48.5 Q33.5 52.5 31.5 57" stroke={s} strokeWidth={1.4} fill="none" />
      {/* the quilt, hanging over the side, then the footboard */}
      <path d="M43 55 Q43 51 48 51 L82 52 L82 79 Q77 82 72 79 Q67 82 62 79 Q57 82 52 79 Q47 82 43 79 Z" fill={quilt.fill} stroke={ink('#6fb3ff')} strokeWidth={2.4} />
      <path d="M44 58 L81 58.5" stroke="#fff" strokeWidth={2} opacity={0.7} />
      {[[54, 66], [66, 72], [74, 63], [60, 75], [50, 73]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill="#fff" opacity={0.8} />)}
      <path d="M79 92 L79 56 Q79 48 86 48 Q93 48 93 56 L93 92 Z" fill={wood.fill} stroke={w} strokeWidth={2.6} />
      <Shine x={12} y={40} rx={2} ry={6} rot={0} />
    </g>
  )
}

/** A yellow school bus side-on, with a row of windows, a door and two big wheels. */
function Bus() {
  const yellow = '#ffc531'
  const body = useShade(yellow, 0.35, 0.18)
  const glass = useShade('#9fdcff', 0.5, 0.15)
  const line = ink(yellow)
  const tyre = '#3d3550'
  return (
    <g {...ROUND}>
      <defs>{body.def}{glass.def}</defs>
      <ellipse {...groundShadow(50, 92, 44)} />
      <path d="M72 50 L87 50 Q93 50 93 58 L93 80 L72 80 Z" fill={body.fill} stroke={line} strokeWidth={2.6} />
      <path d="M7 30 Q7 22 15 22 L70 22 Q76 22 77 28 L79 50 L79 80 L7 80 Z" fill={body.fill} stroke={line} strokeWidth={2.6} />
      {[12, 27, 42].map((x) => <rect key={x} x={x} y={29} width={12} height={15} rx={2.5} fill={glass.fill} stroke={line} strokeWidth={2} />)}
      <rect x={59} y={28} width={15} height={49} rx={2} fill={darken(yellow, 0.08)} stroke={line} strokeWidth={2} />
      <rect x={61} y={30} width={5} height={20} rx={1.5} fill={glass.fill} />
      <rect x={67} y={30} width={5} height={20} rx={1.5} fill={glass.fill} />
      <rect x={61} y={53} width={5} height={21} rx={1.5} fill={glass.fill} />
      <rect x={67} y={53} width={5} height={21} rx={1.5} fill={glass.fill} />
      <path d="M7 53 L58 53 M7 61 L58 61 M79 61 L93 61" stroke={tyre} strokeWidth={2} />
      {[22, 81].map((x) => <path key={x} d={`M${x - 14} 80 A14 14 0 0 1 ${x + 14} 80 Z`} fill={tyre} />)}
      {[22, 81].map((x) => (
        <g key={x}>
          <circle cx={x} cy={80} r={11} fill={tyre} stroke={ink(tyre)} strokeWidth={2} />
          <circle cx={x} cy={80} r={4.5} fill="#cfc8da" />
        </g>
      ))}
      <rect x={88} y={74} width={8} height={6} rx={2} fill={tyre} />
      <rect x={4} y={74} width={6} height={6} rx={2} fill={tyre} />
      <ellipse cx={92} cy={65} rx={2.4} ry={3} fill="#fff4b0" stroke={line} strokeWidth={1.4} />
      <rect x={7.5} y={64} width={3} height={6} rx={1} fill="#ff6b6b" />
      <rect x={14} y={18} width={7} height={4.5} rx={1.5} fill="#ff9a3c" stroke={line} strokeWidth={1.4} />
      <rect x={64} y={18} width={7} height={4.5} rx={1.5} fill="#ff9a3c" stroke={line} strokeWidth={1.4} />
      <Shine x={16} y={50} rx={6} ry={3} />
    </g>
  )
}

/** A brown cardboard box, taped shut across the top. */
function Box() {
  const front = useShade('#d9a066', 0.3, 0.18)
  const line = ink('#c98f55')
  const tape = '#f4d9a4'
  return (
    <g {...ROUND}>
      <defs>{front.def}</defs>
      <ellipse {...groundShadow(52, 92, 42)} />
      <path d="M62 40 L90 25 L90 76 L62 91 Z" fill="#bb8248" stroke={line} strokeWidth={2.6} />
      <path d="M9 40 L37 25 L90 25 L62 40 Z" fill="#ecc08a" stroke={line} strokeWidth={2.6} />
      <path d="M9 40 L62 40 L62 91 L9 91 Z" fill={front.fill} stroke={line} strokeWidth={2.6} />
      <path d="M31.5 40 L59.5 25 L67.5 25 L39.5 40 Z" fill={tape} stroke={line} strokeWidth={1.6} />
      <path d="M31.5 40 L39.5 40 L39.5 53 L31.5 53 Z" fill={tape} stroke={line} strokeWidth={1.6} />
      <Shine x={20} y={53} rx={6} ry={3.5} />
    </g>
  )
}

/** A folded paper treasure map: hills, a lake and a dotted path to a red X. */
function TreasureMap() {
  const paper = useShade('#fff1c9', 0.4, 0.12)
  const fold = useShade('#f0d9a2', 0.3, 0.15)
  const line = ink('#e9d199')
  const red = '#e8505b'
  return (
    <g {...ROUND}>
      <defs>{paper.def}{fold.def}</defs>
      <path d="M8 24 L36 16 L36 82 L8 90 Z" fill={paper.fill} stroke={line} strokeWidth={2.5} />
      <path d="M36 16 L64 24 L64 90 L36 82 Z" fill={fold.fill} stroke={line} strokeWidth={2.5} />
      <path d="M64 24 L92 16 L92 82 L64 90 Z" fill={paper.fill} stroke={line} strokeWidth={2.5} />
      {/* a lake, hills and trees */}
      <path d="M44 66 Q50 60 58 64 Q62 70 56 74 Q48 77 44 72 Q42 69 44 66 Z" fill="#8fd0ff" stroke={ink('#8fd0ff')} strokeWidth={1.6} />
      <path d="M14 46 L21 34 L28 46 Z" fill="#b9a58a" stroke={ink('#b9a58a')} strokeWidth={1.6} />
      <path d="M22 46 L28 37 L34 46 Z" fill="#a8947a" stroke={ink('#b9a58a')} strokeWidth={1.6} />
      {[[72, 66], [82, 60]].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x} ${y + 3} L${x} ${y + 7}`} stroke="#8a5a2e" strokeWidth={2} />
          <circle cx={x} cy={y} r={4.5} fill="#5fc46a" stroke={ink('#5fc46a')} strokeWidth={1.5} />
        </g>
      ))}
      {/* the dotted path and the X */}
      <path d="M16 78 Q22 58 34 58 Q46 58 48 46 Q50 34 62 36 Q70 38 74 40" fill="none" stroke={red} strokeWidth={2.8} strokeDasharray="0.1 5.5" />
      <path d="M74 30 L84 40 M84 30 L74 40" stroke={red} strokeWidth={4.5} />
      <Shine x={18} y={30} rx={5} ry={2.5} />
    </g>
  )
}

/** A plump golden heart. */
function Heart() {
  const c = '#ffc93c'
  const gold = useShade(c, 0.5, 0.2)
  return (
    <g {...ROUND}>
      <defs>{gold.def}</defs>
      <path d="M50 86 C24 70 8 54 8 35 C8 21 18 12 30 12 C40 12 46 18 50 26 C54 18 60 12 70 12 C82 12 92 21 92 35 C92 54 76 70 50 86 Z" fill={gold.fill} stroke={ink(c)} strokeWidth={3} />
      <Shine x={27} y={30} rx={9} ry={5.5} />
      <circle cx={19} cy={42} r={2.4} fill="#fff" opacity={0.6} />
      <path className="pa-twinkle" d={twinkle(87, 12, 6.5)} fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={1.2} />
    </g>
  )
}

/** A party popper bursting with confetti and curly streamers. */
function Party() {
  const c = '#ffc93c'
  const gold = useShade(c, 0.45, 0.18)
  const h = (y: number) => (15 * -y) / 44
  const band = (y1: number, y2: number) => {
    const a = h(y1), b = h(y2)
    return `M${f(-a)} ${y1} A${f(a)} ${f(a * 0.37)} 0 0 0 ${f(a)} ${y1} L${f(b)} ${y2} A${f(b)} ${f(b * 0.37)} 0 0 1 ${f(-b)} ${y2} Z`
  }
  const bits: [number, number, string, number][] = [
    [62, 20, '#5fb7ff', 20], [80, 12, '#ff5d8f', -30], [88, 34, '#5fd39a', 45], [44, 26, '#a77bff', -15],
    [74, 36, '#ffd34d', 60], [90, 58, '#a77bff', 10], [76, 72, '#5fb7ff', -40], [58, 38, '#ff9a3c', 30],
  ]
  const dots: [number, number, string][] = [[36, 40, '#ff5d8f'], [68, 8, '#ffd34d'], [86, 82, '#ff9a3c'], [66, 52, '#a77bff']]
  return (
    <g {...ROUND}>
      <defs>{gold.def}</defs>
      {/* streamers */}
      <path d="M52 50 C45 41 59 37 53 28 C48 21 59 15 57 8" fill="none" stroke="#ff5d8f" strokeWidth={3} />
      <path d="M56 55 C64 50 66 61 74 57 C82 53 82 63 92 60" fill="none" stroke="#5fb7ff" strokeWidth={3} />
      <path d="M55 51 C62 42 70 47 74 37 C78 29 86 33 90 23" fill="none" stroke="#5fd39a" strokeWidth={3} />
      {bits.map(([x, y, col, r], i) => <rect key={i} x={x - 4} y={y - 2} width={8} height={4} rx={1.5} fill={col} stroke={ink(col)} strokeWidth={1.2} transform={`rotate(${r} ${x} ${y})`} />)}
      {dots.map(([x, y, col], i) => <circle key={i} cx={x} cy={y} r={2.6} fill={col} />)}
      <path className="pa-twinkle" d={starPath(30, 20, 6)} fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={1.4} />
      <path className="pa-twinkle" style={{ animationDelay: '0.6s' }} d={starPath(92, 76, 5)} fill="#ff9a3c" stroke={ink('#ff9a3c')} strokeWidth={1.4} />
      {/* the popper */}
      <g transform="translate(18 86) rotate(45)">
        <path d="M0 0 L-15 -44 A15 5.5 0 0 0 15 -44 Z" fill={gold.fill} />
        <path d={band(-12, -19)} fill="#ff5d8f" />
        <path d={band(-26, -33)} fill="#ff5d8f" />
        <path d="M0 0 L-15 -44 A15 5.5 0 0 0 15 -44 Z" fill="none" stroke={ink(c)} strokeWidth={2.6} />
        <ellipse cx={0} cy={-44} rx={15} ry={5.5} fill="#7a3d6e" stroke={ink(c)} strokeWidth={2.6} />
        <Shine x={-6} y={-24} rx={1.8} ry={7} rot={-12} />
      </g>
    </g>
  )
}

/** A glowing light bulb with little rays: a bright idea! */
function Lightbulb() {
  const glass = useShade('#ffe066', 0.6, 0.12)
  const metal = useShade('#b9bfcf', 0.4, 0.2)
  return (
    <g {...ROUND}>
      <defs>{glass.def}{metal.def}</defs>
      <circle cx={50} cy={40} r={33} fill="#fff3a0" opacity={0.45} />
      {[-160, -125, -90, -55, -20].map((a) => {
        const r = (a * Math.PI) / 180
        return <path key={a} d={`M${f(50 + 31 * Math.cos(r))} ${f(40 + 31 * Math.sin(r))} L${f(50 + 37 * Math.cos(r))} ${f(40 + 37 * Math.sin(r))}`} stroke="#ffb92e" strokeWidth={4} />
      })}
      <path d="M50 14 C65 14 76 25 76 40 C76 50 70 56 66 62 C64 65 63 68 63 72 L37 72 C37 68 36 65 34 62 C30 56 24 50 24 40 C24 25 35 14 50 14 Z" fill={glass.fill} stroke={ink('#ffd34d')} strokeWidth={2.8} />
      <path d="M44 71 L44 58 M56 71 L56 58" stroke="#c9a24a" strokeWidth={1.8} />
      <path d="M44 58 L46 50 L48 58 L50 50 L52 58 L54 50 L56 58" stroke="#ff8a3d" strokeWidth={2.4} fill="none" />
      <rect x={36} y={70} width={28} height={15} rx={3} fill={metal.fill} stroke={ink('#b9bfcf')} strokeWidth={2.4} />
      <path d="M37 75 L63 75 M37 80 L63 80" stroke={ink('#b9bfcf')} strokeWidth={1.8} />
      <path d="M42 85 L58 85 Q57 92 50 92 Q43 92 42 85 Z" fill="#6b6378" stroke={ink('#6b6378')} strokeWidth={2} />
      <Shine x={38} y={29} rx={7} ry={4.5} />
    </g>
  )
}

/** A comic-book "boom": a jagged burst of red, orange and yellow. */
function Bang() {
  const out = [45, 37, 43, 35, 45, 38, 42, 36, 44, 37, 41, 36]
  const red = useShade('#ff5a3c', 0.3, 0.15)
  return (
    <g {...ROUND}>
      <defs>{red.def}</defs>
      <path d={burst(50, 50, out, 27)} fill={red.fill} stroke={ink('#ff5a3c')} strokeWidth={2.8} />
      <path d={burst(50, 50, out.map((r) => r * 0.66), 18, 7)} fill="#ffa53c" stroke={ink('#ffa53c')} strokeWidth={2} />
      <path d={burst(50, 50, out.map((r) => r * 0.38), 10, 0)} fill="#ffe873" />
      <Shine x={44} y={44} rx={4} ry={2.5} />
    </g>
  )
}

/** Dizzy stars: a golden swirl spinning out to a star, with two little stars nearby. */
function Dizzy() {
  const c = '#ffc93c'
  const star = useShade('#ffd84a', 0.5, 0.15)
  const swirl = spiral(46, 55, 2, 32, 1.5, -40)
  return (
    <g {...ROUND}>
      <defs>{star.def}</defs>
      <path d={swirl} fill="none" stroke={ink(c)} strokeWidth={9} />
      <path d={swirl} fill="none" stroke={c} strokeWidth={5} />
      <path d={starPath(72, 33, 13, 0.5, 8)} fill={star.fill} stroke={ink('#ffd84a')} strokeWidth={2.4} />
      <path className="pa-twinkle" d={starPath(18, 22, 7)} fill={star.fill} stroke={ink('#ffd84a')} strokeWidth={2} />
      <path className="pa-twinkle" style={{ animationDelay: '0.7s' }} d={starPath(84, 76, 6)} fill={star.fill} stroke={ink('#ffd84a')} strokeWidth={2} />
      <Shine x={68} y={30} rx={3} ry={2} />
    </g>
  )
}

/** A wrapped present: a purple box with a gold ribbon and a big bow. */
function Gift() {
  const c = '#9b7bff'
  const paper = useShade(c, 0.35, 0.2)
  const r = '#ffcf3f'
  const ribbon = useShade(r, 0.45, 0.15)
  return (
    <g {...ROUND}>
      <defs>{paper.def}{ribbon.def}</defs>
      <ellipse {...groundShadow(50, 92, 38)} />
      <rect x={17} y={48} width={66} height={43} rx={3} fill={paper.fill} stroke={ink(c)} strokeWidth={2.6} />
      {[[27, 60], [36, 76], [71, 62], [64, 80], [27, 84]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.6} fill={lighten(c, 0.45)} />)}
      <rect x={44} y={48} width={12} height={43} fill={ribbon.fill} stroke={ink(r)} strokeWidth={2} />
      <rect x={12} y={37} width={76} height={15} rx={3} fill={paper.fill} stroke={ink(c)} strokeWidth={2.6} />
      <rect x={44} y={37} width={12} height={15} fill={ribbon.fill} stroke={ink(r)} strokeWidth={2} />
      <path d="M50 35 C42 20 22 18 26 31 C28 37 40 37 50 35 Z" fill={ribbon.fill} stroke={ink(r)} strokeWidth={2.4} />
      <path d="M50 35 C58 20 78 18 74 31 C72 37 60 37 50 35 Z" fill={ribbon.fill} stroke={ink(r)} strokeWidth={2.4} />
      <ellipse cx={35} cy={29.5} rx={5.5} ry={2.6} fill={darken(r, 0.38)} transform="rotate(20 35 29.5)" />
      <ellipse cx={65} cy={29.5} rx={5.5} ry={2.6} fill={darken(r, 0.38)} transform="rotate(-20 65 29.5)" />
      <ellipse cx={50} cy={34} rx={6} ry={5} fill={ribbon.fill} stroke={ink(r)} strokeWidth={2.4} />
      <Shine x={25} y={66} rx={6} ry={3.5} />
    </g>
  )
}

/** A shiny red balloon on a curly string. */
function Balloon() {
  const c = '#ff4f5e'
  const skin = useShade(c, 0.4, 0.2)
  return (
    <g {...ROUND}>
      <defs>{skin.def}</defs>
      <path d="M50 74 C44 80 56 84 50 89 C46 93 51 95 54 95" fill="none" stroke="#8a7a99" strokeWidth={2} />
      <path d="M50 7 C68 7 79 21 79 38 C79 55 64 68 52 70 L48 70 C36 68 21 55 21 38 C21 21 32 7 50 7 Z" fill={skin.fill} stroke={ink(c)} strokeWidth={2.8} />
      <path d="M45.5 75 L54.5 75 L52 69 L48 69 Z" fill={c} stroke={ink(c)} strokeWidth={2.2} />
      <Shine x={35} y={25} rx={5} ry={10} rot={25} />
      <circle cx={30} cy={42} r={2.5} fill="#fff" opacity={0.5} />
    </g>
  )
}

/** A king's golden crown with five points, pearls and bright jewels. */
function Crown() {
  const c = '#ffc933'
  const gold = useShade(c, 0.45, 0.2)
  const line = ink(c)
  return (
    <g {...ROUND}>
      <defs>{gold.def}</defs>
      <ellipse {...groundShadow(50, 91, 38)} />
      <path d="M14 76 L10 32 L20 54 L30 36 L40 54 L50 20 L60 54 L70 36 L80 54 L90 32 L86 76 Z" fill={gold.fill} stroke={line} strokeWidth={2.8} />
      <path d="M13 70 Q50 78 87 70 L86 86 Q50 94 14 86 Z" fill={gold.fill} stroke={line} strokeWidth={2.8} />
      {[[10, 29, 4.5], [30, 33, 4], [50, 16, 5], [70, 33, 4], [90, 29, 4.5]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="#fff6e6" stroke={ink('#e8d8c0')} strokeWidth={1.8} />)}
      <ellipse cx={50} cy={82} rx={6} ry={4.5} fill="#ff4f6e" stroke={ink('#ff4f6e')} strokeWidth={1.8} />
      <circle cx={30} cy={80} r={3.8} fill="#4fa8ff" stroke={ink('#4fa8ff')} strokeWidth={1.8} />
      <circle cx={70} cy={80} r={3.8} fill="#4cc96a" stroke={ink('#4cc96a')} strokeWidth={1.8} />
      <path d="M50 37 L55 44 L50 51 L45 44 Z" fill="#4fa8ff" stroke={ink('#4fa8ff')} strokeWidth={1.8} />
      <Shine x={22} y={77} rx={5} ry={2.5} rot={-10} />
    </g>
  )
}

/** King David's little harp (a lyre): golden curling arms, a crossbar, strings and a wooden sound box. */
function Harp() {
  const gold = '#e4a93c'
  const g = useShade(gold, 0.45, 0.2)
  const wood = useShade('#b9763f', 0.3, 0.2)
  return (
    <g {...ROUND}>
      <defs>{g.def}{wood.def}</defs>
      <ellipse {...groundShadow(50, 92, 30)} />
      {[34, 40.5, 47, 53, 59.5, 66].map((x) => <path key={x} d={`M${x} 31 L${x} 68`} stroke="#b88a4a" strokeWidth={1.8} />)}
      <Tube d="M31 70 C20 62 14 48 18 35 C21 26 19 18 12 17" color={gold} paint={g.fill} w={7} />
      <Tube d="M69 70 C80 62 86 48 82 35 C79 26 81 18 88 17" color={gold} paint={g.fill} w={7} />
      <Tube d="M15 30 L85 30" color="#a8703c" w={5} />
      <path d="M24 66 L76 66 Q80 66 79 71 L76 86 Q75 90 70 90 L30 90 Q25 90 24 86 L21 71 Q20 66 24 66 Z" fill={wood.fill} stroke={ink('#b9763f')} strokeWidth={2.6} />
      <circle cx={50} cy={79} r={4.5} fill={darken('#b9763f', 0.45)} />
      <path d="M32 70 L68 70" stroke="#8a5428" strokeWidth={3} />
      <Shine x={31} y={76} rx={5} ry={3} />
    </g>
  )
}

/** David's sling: a soft leather pouch cradling a smooth stone, its two cords knotted where he holds it. */
function Sling() {
  const leather = '#a8693a'
  const l = useShade(leather, 0.35, 0.2)
  const stone = useShade('#b8b1a6', 0.45, 0.2)
  const cord = '#c99560'
  return (
    <g {...ROUND}>
      <defs>{l.def}{stone.def}</defs>
      {/* two long cords, knotted where David holds them: a finger loop and a loose end */}
      <Tube d="M30 65 Q35 42 48 21" color={cord} w={2.8} line={1.5} />
      <Tube d="M70 65 Q65 42 52 21" color={cord} w={2.8} line={1.5} />
      <Tube d="M48 19 C40 14 40 4 46 4 C52 4 52 13 49 18" color={cord} w={2.8} line={1.5} />
      <Tube d="M52 19 Q58 14 57 7" color={cord} w={2.8} line={1.5} />
      <path d="M57 7 L55 2.5 M57 7 L59.5 3" stroke={ink(cord)} strokeWidth={1.6} />
      <circle cx={50} cy={20} r={4.2} fill={cord} stroke={ink(cord)} strokeWidth={1.8} />
      {/* the pouch: a soft piece of leather folded round a smooth stone */}
      <path d="M28 66 Q50 54 72 66 Q50 72 28 66 Z" fill={darken(leather, 0.12)} stroke={ink(leather)} strokeWidth={2.2} />
      <circle cx={50} cy={71} r={12.5} fill={stone.fill} stroke={ink('#b8b1a6')} strokeWidth={2.4} />
      <path d="M28 66 Q50 87 72 66 Q67 90 50 92 Q33 90 28 66 Z" fill={l.fill} stroke={ink(leather)} strokeWidth={2.6} />
      <path d="M50 84 L50 89" stroke={ink(leather)} strokeWidth={1.6} />
      <circle cx={31.5} cy={67.5} r={1.4} fill={ink(leather)} />
      <circle cx={68.5} cy={67.5} r={1.4} fill={ink(leather)} />
      <Shine x={45} y={65} rx={4} ry={2.4} />
    </g>
  )
}

/** A scroll of parchment, unrolled a little between its two wooden rollers. */
function Scroll() {
  const paper = useShade('#fbe8bd', 0.45, 0.12)
  const roll = useShade('#f2d79e', 0.4, 0.2)
  const wood = '#a0663a'
  const line = ink('#e9cf95')
  const roller = (x: number) => (
    <g>
      <rect x={x - 2.5} y={9} width={5} height={82} rx={2.5} fill={wood} stroke={ink(wood)} strokeWidth={2} />
      <circle cx={x} cy={9} r={4} fill={wood} stroke={ink(wood)} strokeWidth={2} />
      <circle cx={x} cy={91} r={4} fill={wood} stroke={ink(wood)} strokeWidth={2} />
      <rect x={x - 9} y={18} width={18} height={64} rx={7} fill={roll.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={x} cy={21} rx={7.5} ry={2.6} fill="none" stroke={line} strokeWidth={1.4} />
    </g>
  )
  return (
    <g {...ROUND}>
      <defs>{paper.def}{roll.def}</defs>
      <path d="M22 24 Q50 20 78 24 L78 76 Q50 80 22 76 Z" fill={paper.fill} stroke={line} strokeWidth={2.5} />
      {roller(19)}
      {roller(81)}
      <Shine x={34} y={34} rx={6} ry={3.5} />
    </g>
  )
}

/** A little clay oil lamp from Bible times, its wick burning with a bright flame. */
function Lamp() {
  const clay = '#d9824a'
  const c = useShade(clay, 0.35, 0.2)
  const flame = useShade('#ffb347', 0.55, 0.1)
  return (
    <g {...ROUND}>
      <defs>{c.def}{flame.def}</defs>
      <ellipse {...groundShadow(48, 91, 34)} />
      <circle cx={85} cy={42} r={15} fill="#fff1a0" opacity={0.55} />
      <Tube d="M20 68 C6 64 6 82 18 80" color={clay} w={4} line={2.2} />
      <path d="M16 73 C16 62 30 58 46 58 C58 58 66 60 74 61 L85 60 Q91 60 91 65 Q91 70 85 71 L76 72 C72 83 60 88 46 88 C28 88 16 83 16 73 Z" fill={c.fill} stroke={ink(clay)} strokeWidth={2.8} />
      <ellipse cx={44} cy={63} rx={11} ry={3.6} fill={darken(clay, 0.12)} stroke={ink(clay)} strokeWidth={2} />
      <ellipse cx={44} cy={63} rx={5} ry={1.8} fill="#4a2a1a" />
      {[26, 36, 46, 56, 66].map((x) => <circle key={x} cx={x} cy={76} r={1.6} fill={darken(clay, 0.25)} />)}
      <path d="M86 61 L86 57" stroke="#4a3a3a" strokeWidth={2.2} />
      <path d="M86 58 C77 53 77 41 84 28 C92 41 95 53 86 58 Z" fill={flame.fill} stroke={ink('#ff9a3c')} strokeWidth={2.2} />
      <path d="M86 56 C82 53 82 47 85 41 C88 47 90 53 86 56 Z" fill="#fff4b0" />
      <Shine x={28} y={67} rx={6} ry={3} />
    </g>
  )
}

/** A desert tent of striped cloth on a wooden pole, its door flaps tied open. */
function Tent() {
  const cloth = '#ecd2a0'
  const c = useShade(cloth, 0.35, 0.18)
  const line = ink(cloth)
  const flap = lighten(cloth, 0.3)
  const tent = 'M50 12 C44 34 28 66 8 89 L92 89 C72 66 56 34 50 12 Z'
  return (
    <g {...ROUND}>
      <defs>{c.def}</defs>
      <ellipse {...groundShadow(50, 92, 44)} />
      {/* ropes to the pegs, and the pole with its pennant */}
      <path d="M30 58 L5 89 M70 58 L95 89" stroke="#8a6a4a" strokeWidth={1.8} />
      <path d="M5 89 L3.5 84 M95 89 L96.5 84" stroke="#7a5233" strokeWidth={2.6} />
      <path d="M50 14 L50 4" stroke="#8a5a2e" strokeWidth={3.5} />
      <path d="M51.5 4 L63 7.5 L51.5 11 Z" fill="#e8505b" stroke={ink('#e8505b')} strokeWidth={1.6} />
      {/* the cloth, with two broad stripes */}
      <path d={tent} fill={c.fill} />
      <path d="M50 13 L22 89 L35 89 Z M50 13 L65 89 L78 89 Z" fill="#c98a55" opacity={0.7} />
      <path d={tent} fill="none" stroke={line} strokeWidth={2.8} />
      {/* the open door, its flaps tied back */}
      <path d="M50 36 C47 54 44 72 40 89 L60 89 C56 72 53 54 50 36 Z" fill="#5a3a24" />
      <path d="M50 36 C46 52 40 64 34 70 C37 76 36 83 31 89 L40 89 C44 72 47 54 50 36 Z" fill={flap} stroke={line} strokeWidth={2.2} />
      <path d="M50 36 C54 52 60 64 66 70 C63 76 64 83 69 89 L60 89 C56 72 53 54 50 36 Z" fill={flap} stroke={line} strokeWidth={2.2} />
      <path d="M33.5 70 L40 68.5 M66.5 70 L60 68.5" stroke="#8a5a2e" strokeWidth={2.4} />
      <Shine x={36} y={48} rx={5} ry={2.4} rot={-62} />
    </g>
  )
}

/** A little flat-roofed house from Bible times: thick walls, an arched door, a window and a ladder to the roof. */
function House() {
  const wall = '#f0d3a0'
  const w = useShade(wall, 0.35, 0.15)
  const line = ink(wall)
  const wood = '#9a6237'
  return (
    <g {...ROUND}>
      <defs>{w.def}</defs>
      <ellipse {...groundShadow(50, 92, 44)} />
      <path d="M14 34 L82 34 L82 91 L14 91 Z" fill={w.fill} stroke={line} strokeWidth={2.8} />
      {/* a plant in a pot up on the flat roof */}
      {[[17, 15, -35], [23, 12, 0], [29, 15, 35]].map(([x, y, r]) => <ellipse key={x} cx={x} cy={y} rx={3.4} ry={6.5} fill="#5fc46a" stroke={ink('#5fc46a')} strokeWidth={1.6} transform={`rotate(${r} ${x} ${y})`} />)}
      <path d="M16 20 L30 20 L28 28.5 L18 28.5 Z" fill="#d9824a" stroke={ink('#d9824a')} strokeWidth={2} />
      <rect x={10} y={28} width={76} height={8} rx={2} fill={lighten(wall, 0.2)} stroke={line} strokeWidth={2.5} />
      {[20, 32, 44, 56, 68, 78].map((x) => <circle key={x} cx={x} cy={40} r={2.2} fill={wood} />)}
      <path d="M26 91 L26 66 Q26 56 35 56 Q44 56 44 66 L44 91 Z" fill={wood} stroke={ink(wood)} strokeWidth={2.4} />
      <circle cx={40} cy={75} r={1.6} fill="#ffd34d" />
      <rect x={56} y={52} width={16} height={14} rx={2} fill="#5a3a24" stroke={line} strokeWidth={2.2} />
      <path d="M64 52 L64 66" stroke={wood} strokeWidth={2} />
      <Tube d="M86 91 L94 24" color="#a8703c" w={2.6} line={1.4} />
      <Tube d="M76 91 L84 24" color="#a8703c" w={2.6} line={1.4} />
      {[80, 68, 56, 44, 32].map((y) => <path key={y} d={`M${f(76 + (91 - y) * 0.12)} ${y} L${f(86 + (91 - y) * 0.12)} ${y}`} stroke="#a8703c" strokeWidth={2.4} />)}
      <Shine x={22} y={46} rx={5} ry={3} />
    </g>
  )
}

/** Noah's ark: a big wooden boat with a house on top, a door and little windows, on the water. */
function Ark() {
  const hull = useShade('#b5794a', 0.3, 0.2)
  const cabin = useShade('#e2ae72', 0.35, 0.18)
  const roof = useShade('#a0612f', 0.3, 0.2)
  const sea = useShade('#5fb7ff', 0.4, 0.15)
  return (
    <g {...ROUND}>
      <defs>{hull.def}{cabin.def}{roof.def}{sea.def}</defs>
      <rect x={24} y={34} width={52} height={28} rx={2} fill={cabin.fill} stroke={ink('#e2ae72')} strokeWidth={2.6} />
      {[33, 67].map((x) => <rect key={x} x={x - 4.5} y={41} width={9} height={8} rx={2} fill="#5a3a20" />)}
      <path d="M43 62 L43 46 Q43 41 50 41 Q57 41 57 46 L57 62 Z" fill="#7a4a24" stroke={ink('#7a4a24')} strokeWidth={2.2} />
      <path d="M17 37 L50 15 L83 37 Z" fill={roof.fill} stroke={ink('#a0612f')} strokeWidth={2.6} />
      <path d="M5 54 Q12 60 22 60 L78 60 Q88 60 95 54 Q92 74 80 84 Q50 90 20 84 Q8 74 5 54 Z" fill={hull.fill} stroke={ink('#b5794a')} strokeWidth={2.8} />
      {[68, 76].map((y) => <path key={y} d={`M${y === 68 ? 10 : 14} ${y} Q50 ${y + 6} ${y === 68 ? 90 : 86} ${y}`} stroke={darken('#b5794a', 0.2)} strokeWidth={1.8} fill="none" />)}
      <Shine x={20} y={66} rx={5} ry={2.6} />
      <path d="M6 86 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 L90 90 Q90 94 85 94 L11 94 Q6 94 6 90 Z" fill={sea.fill} stroke={ink('#5fb7ff')} strokeWidth={2.5} />
    </g>
  )
}

/** An empty woven basket with a handle on each side, open at the top so things can go in. */
function Basket() {
  const c = '#d0924f'
  const wicker = useShade(c, 0.3, 0.2)
  const line = ink(c)
  const ribs = [32, 56, 80, 100, 124, 148].map((deg) => {
    const a = (deg * Math.PI) / 180
    return `M${f(50 + 40 * Math.cos(a))} ${f(45 + 12 * Math.sin(a))} L${f(50 + 30 * Math.cos(a))} ${f(86 + 4 * Math.sin(a))}`
  }).join(' ')
  return (
    <g {...ROUND}>
      <defs>{wicker.def}</defs>
      <ellipse {...groundShadow(50, 92, 36)} />
      <Tube d="M15 54 C3 54 3 41 12 41" color={c} w={4} />
      <Tube d="M85 54 C97 54 97 41 88 41" color={c} w={4} />
      {/* the empty inside, with the far wall's weave */}
      <ellipse cx={50} cy={45} rx={40} ry={12} fill={darken(c, 0.38)} />
      <path d="M15 47 Q50 30 85 47 M21 51 Q50 37 79 51" stroke={darken(c, 0.2)} strokeWidth={2} fill="none" />
      {/* the front */}
      <path d="M10 45 A40 12 0 0 0 90 45 L80 87 Q50 94 20 87 Z" fill={wicker.fill} stroke={line} strokeWidth={2.8} />
      {[56, 66, 76].map((y) => {
        const d = (y - 45) * 0.238
        return <path key={y} d={`M${f(10 + d)} ${y} Q50 ${y + 22} ${f(90 - d)} ${y}`} stroke={darken(c, 0.22)} strokeWidth={2} fill="none" />
      })}
      <path d={ribs} stroke={darken(c, 0.16)} strokeWidth={1.6} />
      {/* the rim */}
      <ellipse cx={50} cy={45} rx={40} ry={12} fill="none" stroke={line} strokeWidth={8.5} />
      <ellipse cx={50} cy={45} rx={40} ry={12} fill="none" stroke={lighten(c, 0.15)} strokeWidth={4.5} />
      <Shine x={24} y={67} rx={6} ry={3.5} />
    </g>
  )
}

/** David's leather shepherd's bag, open at the top, with a long strap. */
function ShepherdBag() {
  const c = '#a8693a'
  const leather = useShade(c, 0.35, 0.2)
  const line = ink(c)
  const brass = '#e3b45a'
  return (
    <g {...ROUND}>
      <defs>{leather.def}</defs>
      <ellipse {...groundShadow(50, 92, 34)} />
      {/* the long shoulder strap, flopped over behind the bag, with stitching and a buckle */}
      <Tube d="M22 62 C10 38 18 12 42 10 C68 8 90 26 78 62" color={darken(c, 0.1)} w={4} line={1.6} />
      <path d="M22 62 C10 38 18 12 42 10 C68 8 90 26 78 62" stroke={lighten(c, 0.3)} strokeWidth={0.9} strokeDasharray="2 2.4" fill="none" />
      <rect x={76.9} y={30} width={7.2} height={8} rx={1.5} fill="none" stroke={ink(brass)} strokeWidth={3.6} transform="rotate(-13 80.5 34)" />
      <rect x={76.9} y={30} width={7.2} height={8} rx={1.5} fill="none" stroke={brass} strokeWidth={1.8} transform="rotate(-13 80.5 34)" />
      {/* the open top, then the soft leather sack */}
      <ellipse cx={50} cy={52} rx={27} ry={7.5} fill={darken(c, 0.55)} />
      <path d="M23 52 A27 7.5 0 0 0 77 52 C85 60 89 72 85 82 Q81 91 66 91 L34 91 Q19 91 15 82 C11 72 15 60 23 52 Z" fill={leather.fill} stroke={line} strokeWidth={2.8} />
      {/* a drawstring round the neck, its ends tied in front */}
      <path d="M22.5 58 Q50 69 77.5 58" stroke="#e8c690" strokeWidth={2.2} fill="none" />
      <path d="M50 63.5 Q45 69 43 75 M50 63.5 Q55 69 57 75" stroke="#e8c690" strokeWidth={2.2} fill="none" />
      <circle cx={43} cy={75.5} r={1.8} fill="#e8c690" stroke={ink('#e8c690')} strokeWidth={1} />
      <circle cx={57} cy={75.5} r={1.8} fill="#e8c690" stroke={ink('#e8c690')} strokeWidth={1} />
      <ellipse cx={50} cy={52} rx={27} ry={7.5} fill="none" stroke={line} strokeWidth={6.5} />
      <ellipse cx={50} cy={52} rx={27} ry={7.5} fill="none" stroke={lighten(c, 0.18)} strokeWidth={3.2} />
      {/* stitching, and the brass rivets holding the strap */}
      <path d="M17 80 Q50 90 83 80" stroke={lighten(c, 0.4)} strokeWidth={1.5} strokeDasharray="2.5 3" fill="none" />
      <circle cx={21} cy={61} r={2.6} fill={brass} stroke={ink(brass)} strokeWidth={1.2} />
      <circle cx={79} cy={61} r={2.6} fill={brass} stroke={ink(brass)} strokeWidth={1.2} />
      <Shine x={28} y={72} rx={6} ry={3.5} />
    </g>
  )
}

/** A low wooden trough heaped with soft golden hay, a cosy bed for lambs. */
function Hay() {
  const straw = '#f5cf5a'
  const wood = useShade('#b9824e', 0.3, 0.2)
  const hay = useShade(straw, 0.4, 0.15)
  const dark = darken(straw, 0.2)
  return (
    <g {...ROUND}>
      <defs>{wood.def}{hay.def}</defs>
      <ellipse {...groundShadow(50, 92, 44)} />
      <Tube d="M17 80 L12 91 M83 80 L88 91" color="#b9824e" w={3.2} line={1.3} />
      {/* straws poking out, the heap, and its strands */}
      <path d="M14 60 L6 55 M86 60 L94 55 M28 44 L24 36 M48 39 L47 31 M66 40 L70 32 M80 50 L87 44" stroke={dark} strokeWidth={2} />
      <path d={HAY} fill={hay.fill} stroke={ink(straw)} strokeWidth={2.4} />
      <path d="M22 56 q5 -6 11 -6 M40 48 q6 -5 12 -4 M60 50 q6 -5 12 -3 M30 61 q5 -4 10 -4 M54 58 q5 -4 11 -3 M72 61 q4 -3 8 -2" stroke={dark} strokeWidth={1.6} fill="none" />
      {/* the trough, with wisps hanging over its edge */}
      <path d="M8 62 L92 62 L86 84 L14 84 Z" fill={wood.fill} stroke={ink('#b9824e')} strokeWidth={2.6} />
      <path d="M11.5 73 L88.5 73" stroke={darken('#b9824e', 0.2)} strokeWidth={1.6} />
      <path d="M24 62 q-1 5 -4 7 M44 62 q1 4 -1 7 M66 62 q2 4 5 6" stroke={straw} strokeWidth={2} fill="none" />
      <Shine x={24} y={50} rx={6} ry={3} />
    </g>
  )
}

/** A round metal cooking pot with two handles and a lid, a little steam rising. */
function Pot() {
  const steel = '#aebbd0'
  const metal = useShade(steel, 0.55, 0.2)
  const line = ink(steel)
  const grip = '#4a4458'
  return (
    <g {...ROUND}>
      <defs>{metal.def}</defs>
      <ellipse {...groundShadow(50, 92, 36)} />
      {/* steam */}
      <path className="pa-twinkle" d="M31 28 q-4 -5 0 -10 t0 -10 M69 28 q4 -5 0 -10 t0 -10" stroke="#cfc8dc" strokeWidth={3.2} fill="none" />
      {/* handles, body, lid and knob */}
      <Tube d="M17 58 L9 58 Q5 58 5 62 Q5 66 9 66 L17 66" color={grip} w={3.6} line={1.4} />
      <Tube d="M83 58 L91 58 Q95 58 95 62 Q95 66 91 66 L83 66" color={grip} w={3.6} line={1.4} />
      <path d="M16 52 L84 52 C86 66 84 80 76 86 Q66 92 50 92 Q34 92 24 86 C16 80 14 66 16 52 Z" fill={metal.fill} stroke={line} strokeWidth={2.8} />
      <path d="M17.5 60 L82.5 60" stroke={lighten(steel, 0.3)} strokeWidth={2.2} opacity={0.8} />
      <path d="M16 48 Q18 32 50 31 Q82 32 84 48 Z" fill={metal.fill} stroke={line} strokeWidth={2.8} />
      <rect x={12} y={46} width={76} height={7.5} rx={3.75} fill={lighten(steel, 0.15)} stroke={line} strokeWidth={2.6} />
      <path d="M47 31 L47 27.5 M53 31 L53 27.5" stroke={grip} strokeWidth={3} />
      <rect x={42} y={22} width={16} height={7} rx={3.5} fill={grip} stroke={ink(grip)} strokeWidth={1.8} />
      <Shine x={27} y={70} rx={3} ry={9} rot={10} />
    </g>
  )
}

export const THINGS: Item[] = [
  { id: 'basket-food', name: 'basket full of food', emoji: ['🧺'], Draw: BasketOfFood },
  { id: 'sailboat', name: 'boat', emoji: ['⛵'], Draw: Sailboat },
  { id: 'bike', name: 'bike', emoji: ['🚲'], Draw: Bike },
  { id: 'rocket', name: 'rocket', emoji: ['🚀'], Draw: Rocket },
  { id: 'ball', name: 'ball', emoji: ['⚽'], Draw: Ball },
  { id: 'paints', name: 'painting', emoji: ['🎨'], Draw: Paints },
  { id: 'praying-hands', name: 'praying hands', emoji: ['🙏'], Draw: PrayingHands },
  { id: 'notes', name: 'music', emoji: ['🎵', '🎶'], Draw: Notes },
  { id: 'stable', name: 'baby Jesus in the stable', emoji: ['🛖'], Draw: Stable },
  { id: 'top-hat', name: 'hat', emoji: ['🎩'], Draw: TopHat },
  { id: 'bed', name: 'bed', emoji: ['🛏️', '🛏'], Draw: Bed },
  { id: 'bus', name: 'bus', emoji: ['🚌'], Draw: Bus },
  { id: 'box', name: 'box', emoji: ['📦'], Draw: Box },
  { id: 'map', name: 'map', emoji: ['🗺️', '🗺'], Draw: TreasureMap },
  { id: 'heart', name: 'heart', emoji: ['💛', '❤️', '💗', '💖'], Draw: Heart },
  { id: 'party', name: 'party popper', emoji: ['🎉'], Draw: Party },
  { id: 'lightbulb', name: 'idea', emoji: ['💡'], Draw: Lightbulb },
  { id: 'bang', name: 'boom', emoji: ['💥'], Draw: Bang },
  { id: 'dizzy', name: 'dizzy stars', emoji: ['💫'], Draw: Dizzy },
  { id: 'gift', name: 'gift', emoji: ['🎁'], Draw: Gift },
  { id: 'balloon', name: 'balloon', emoji: ['🎈'], Draw: Balloon },
  { id: 'crown', name: 'crown', emoji: ['👑'], Draw: Crown },
  { id: 'harp', name: 'harp', emoji: [], Draw: Harp },
  { id: 'sling', name: 'sling', emoji: [], Draw: Sling },
  { id: 'scroll', name: 'scroll', emoji: ['📜'], Draw: Scroll },
  { id: 'lamp', name: 'lamp', emoji: ['🪔'], Draw: Lamp },
  { id: 'tent', name: 'tent', emoji: ['⛺'], Draw: Tent },
  { id: 'house', name: 'house', emoji: ['🏠'], Draw: House },
  { id: 'ark', name: "Noah's ark", emoji: [], Draw: Ark },
  // empty containers that counting games fill (asked for by id)
  { id: 'basket', name: 'basket', emoji: [], Draw: Basket },
  { id: 'shepherd-bag', name: "shepherd's bag", emoji: ['👝'], Draw: ShepherdBag },
  { id: 'hay', name: 'soft hay', emoji: [], Draw: Hay },
  { id: 'pot', name: 'pot', emoji: [], Draw: Pot },
]
