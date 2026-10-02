// Huffy → Hornsby → Summit: a little goat facing you, with floppy side ears that twitch.
// The horns grow from nubs to swept-back horns to big curly ram horns; Hornsby grows a beard and a
// forelock, and Summit a shaggy coat and a crown. Grumpy Huffy turns greyer and huffs out steam.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, useShade } from '../kit'

type Pt = [number, number]
type Circle = [number, number, number]

/** Outline of a fluffy shape: the union of circles listed clockwise around its middle. */
function puff(cs: Circle[]) {
  const n = cs.length
  // Where each circle meets the next, on the outside (to the left of the way round).
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

/** A smooth tapering tube along the centerline f(t), t = 0…1, with width w(t) and round ends. */
function tube(f: (t: number) => Pt, w: (t: number) => number, n = 28) {
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

const bez = (a: Pt, b: Pt, c: Pt) => (t: number): Pt => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}

/** The left horn for each stage (the right one is its mirror image). */
function hornPath(stage: number) {
  if (stage >= 2) {
    // A curly ram horn: up from the head, out, down and round in a spiral.
    const a0 = 0.15, turns = 1.05
    return tube((t) => {
      const a = a0 - t * turns * Math.PI * 2, r = 33 - 24 * t
      return [58 + Math.cos(a) * r, 66 + Math.sin(a) * r]
    }, (t) => 15 - 10 * t, 40)
  }
  if (stage >= 1) return tube(bez([90, 68], [86, 36], [60, 28]), (t) => 13 - 9 * t)
  return tube(bez([90, 68], [87, 58], [82, 50]), (t) => 12 - 4 * t, 10)
}

// Summit's thick woolly coat: a ring of fluffy curls round the body.
const COAT = puff(Array.from({ length: 12 }, (_, i): Circle => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2
  return [100 + Math.cos(a) * 36, 137 + Math.sin(a) * 15, 12.5]
}))

export default function Goat({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const WOOL = g ? '#d5cdc4' : '#faf4ea'
  const LINE = g ? '#958a7f' : '#b6a28b'
  const NOSE = g ? '#d2c6b8' : '#f1e3d1'
  const HORN = g ? '#a1a6b0' : '#a9b4cb'
  const HOOF = '#6b7890'
  const wool = useShade(WOOL, 0.6, 0.1)
  const nose = useShade(NOSE, 0.4, 0.1)
  const horn = useShade(HORN, 0.35, 0.18)
  const horns = hornPath(stage)
  return (
    <g>
      <defs>{wool.def}{nose.def}{horn.def}</defs>

      {/* Legs with little hooves */}
      {[85, 115].map((x) => (
        <g key={x}>
          <rect x={x - 7} y={148} width={14} height={28} rx={6} fill={wool.fill} stroke={LINE} strokeWidth={3} />
          <rect x={x - 8} y={168} width={16} height={10} rx={4} fill={HOOF} stroke={ink(HOOF)} strokeWidth={2.5} />
        </g>
      ))}

      {/* Body (a shaggy coat at stage 2) */}
      <g className="pa-breathe">
        {stage >= 2
          ? <path d={COAT} fill={wool.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
          : <ellipse cx={100} cy={144} rx={38} ry={26} fill={wool.fill} stroke={LINE} strokeWidth={3} />}
        <ellipse cx={100} cy={150} rx={20} ry={13} fill="#fff" opacity={0.7} />
      </g>

      {/* Horns */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? 'translate(200 0) scale(-1 1)' : undefined}>
          <path d={horns} fill={horn.fill} stroke={ink(HORN)} strokeWidth={3} strokeLinejoin="round" />
        </g>
      ))}

      {/* Floppy side ears that twitch */}
      {[-1, 1].map((side) => (
        <Anim key={side} cls="pa-ear" origin={side < 0 ? '100% 40%' : '0% 40%'} delay={side > 0 ? 0.4 : 0}>
          <g transform={side > 0 ? 'translate(200 0) scale(-1 1)' : undefined}>
            <ellipse cx={58} cy={96} rx={18} ry={8.5} fill={wool.fill} stroke={LINE} strokeWidth={3} transform="rotate(16 58 96)" />
            <ellipse cx={58} cy={96} rx={10} ry={4} fill="#ffb7c8" transform="rotate(16 58 96)" />
          </g>
        </Anim>
      ))}

      {/* Beard (stage 1+) hangs under the chin */}
      {stage >= 1 && <path d="M90 124 C92 138 96 146 100 152 C104 146 108 138 110 124 Z" fill={wool.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />}

      {/* Head and soft nose */}
      <ellipse cx={100} cy={90} rx={32} ry={30} fill={wool.fill} stroke={LINE} strokeWidth={3} />
      <Shine x={86} y={72} rx={9} ry={5} />
      {stage >= 1 && (
        <path d="M86 68 C84 58 92 54 96 58 C96 50 106 50 106 58 C110 54 118 58 114 68 Q100 64 86 68 Z" fill={wool.fill} stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
      )}
      <ellipse cx={100} cy={116} rx={21} ry={14} fill={nose.fill} stroke={ink(NOSE)} strokeWidth={2.5} />
      <ellipse cx={93} cy={113} rx={2.2} ry={3} fill="#8f6f62" transform="rotate(-15 93 113)" />
      <ellipse cx={107} cy={113} rx={2.2} ry={3} fill="#8f6f62" transform="rotate(15 107 113)" />
      <path d={g ? 'M94 124 Q100 119 106 124' : 'M100 117 V120 M94 120 Q100 126 106 120'} stroke="#7d6052" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <CuteFace x={100} y={89} s={0.78} gap={15} mood={mood} mouth={false} blinkDelay={0.3} />

      {/* Grumpy huffs of steam */}
      {g && [-1, 1].map((side) => (
        <Anim key={side} cls="pa-twinkle" delay={side > 0 ? 0.5 : 0}>
          <g transform={side > 0 ? 'translate(200 0) scale(-1 1)' : undefined} fill="#f1f4f8" stroke="#b8c3d3" strokeWidth={1.5}>
            <circle cx={66} cy={124} r={6} /><circle cx={54} cy={118} r={7} /><circle cx={42} cy={126} r={5.5} />
          </g>
        </Anim>
      ))}

      {stage >= 2 && <Crown x={100} y={62} />}
    </g>
  )
}
