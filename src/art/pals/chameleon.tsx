// Patches → Colorcoat → Rainbowrobe: a friendly little chameleon facing you, with a rounded casque on its
// head, big eyes in round eye turrets, a wide smile, mitten feet and a curly tail. Patches wears patches of
// many colours like Joseph's coat; Colorcoat's colours grow into bands round its tummy and tail; Rainbowrobe
// is striped in every colour of the rainbow, and wears a crown.
// Grumpy: its colours fade to dull, greyish tones, and it frowns.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

const smoothThrough = (ps: Pt[]) =>
  ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`

/** Both edges of a tube round the centerline f(t), t = 0…1, w(t) wide, at n + 1 steps (left[i] and right[i] face each other). */
function tubeEdges(f: (t: number) => Pt, w: (t: number) => number, n: number) {
  const left: Pt[] = [], right: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = f(t)
    const [x1, y1] = f(Math.max(0, t - 0.004)), [x2, y2] = f(Math.min(1, t + 0.004))
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, h = w(t) / 2
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len
    left.push([x + nx * h, y + ny * h])
    right.push([x - nx * h, y - ny * h])
  }
  return { left, right }
}

// The curly tail: a spiral round (150, 126), from behind the body (bottom left of the curl) round and in.
const N = 54
const tailAt = (t: number): Pt => {
  const a = ((135 - 540 * t) * Math.PI) / 180, r = 36 - 30 * t
  return [150 + Math.cos(a) * r, 126 + Math.sin(a) * r]
}
const tailW = (t: number) => 15 - 10 * t
const TAIL_PATH = (() => {
  const { left, right } = tubeEdges(tailAt, tailW, N)
  const back = [...right].reverse()
  return `M${pt(...left[0])} ${smoothThrough(left)} A${tailW(1) / 2} ${tailW(1) / 2} 0 0 1 ${pt(...back[0])} ${smoothThrough(back)} A${tailW(0) / 2} ${tailW(0) / 2} 0 0 1 ${pt(...left[0])}Z`
})()
// The rings of colour are cut from a slightly narrower tube, so they stay inside the tail's outline.
const RINGS = tubeEdges(tailAt, (t) => tailW(t) - 3, N)
/** A band round the tail, from step i0 to step i1. */
const tailBand = (i0: number, i1: number) => {
  const l = RINGS.left.slice(i0, i1 + 1), r = RINGS.right.slice(i0, i1 + 1).reverse()
  return `M${pt(...l[0])} ${smoothThrough(l)} L${pt(...r[0])} ${smoothThrough(r)}Z`
}

/** An irregular, rounded patch of colour round (cx, cy), about r across; `seed` varies its shape. */
function blob(cx: number, cy: number, r: number, seed: number) {
  const k = [1, 1.12, 0.96, 0.8, 0.88, 1.06, 1.14, 0.9]
  const ps: Pt[] = k.map((_, i) => {
    const a = (i / 8) * Math.PI * 2 + seed
    const d = r * k[(i + seed * 3) % 8]
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]
  })
  const at = (i: number) => ps[(i + 8) % 8]
  let d = `M${pt(...ps[0])}`
  for (let i = 0; i < 8; i++) {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    d += ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }
  return `${d}Z`
}

const MIRROR = 'translate(200 0) scale(-1 1)'
const COLORS = ['#ff6b6b', '#ffa94d', '#ffd84d', '#5fd39a', '#5fb7ff', '#a98cff'] // red, orange, yellow, green, blue, purple
const DULL = ['#c9a0a0', '#cdb49c', '#cfc79e', '#a3bfae', '#a0b5c9', '#b0a8c6']
const PINK = '#ff7eb6'

export default function Chameleon({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const GREEN = g ? '#a1b8a3' : '#6dd283'
  const BELLY = g ? '#d6ddcc' : '#e6f8b8'
  const C = g ? DULL : COLORS
  const P = g ? '#c9a9b8' : PINK
  const skin = useShade(GREEN, 0.4, 0.15)
  const belly = useShade(BELLY, 0.4, 0.06)
  const clip = `cl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const line = ink(GREEN)
  const s = Math.min(stage, 2)
  // Bands round the body: at stage 1 three, at stage 2 the whole rainbow (each [top, colour]).
  const bands: [number, string][] = s >= 2 ? C.map((c, i) => [116 + i * 10, c]) : s >= 1 ? [[128, C[2]], [146, C[4]], [164, P]] : []
  // Patches of colour on the body (stage 0): [x, y, r, colour]
  const patches: [number, number, number, string][] = [[76, 137, 8, C[0]], [125, 136, 7.5, C[2]], [118, 163, 6.5, C[4]], [81, 162, 6, C[5]]]
  // Rings round the tail: patches at stage 0, then alternating bands, then the rainbow over and over.
  const rings: [number, number, string][] = s >= 2
    ? Array.from({ length: 9 }, (_, i) => [3 + i * 5.5, 3 + i * 5.5 + 5.5, C[i % 6]] as [number, number, string])
    : s >= 1
      ? Array.from({ length: 5 }, (_, i) => [5 + i * 10, 10 + i * 10, [C[2], C[4], P, C[0], C[5]][i]] as [number, number, string])
      : [[12, 16, C[1]], [28, 32, P], [42, 45, C[5]]]
  return (
    <g>
      <defs>
        {skin.def}{belly.def}
        {/* (just inside the body's outline, so the colours don't cover it) */}
        <clipPath id={clip}><ellipse cx={100} cy={146} rx={34.5} ry={26.5} /></clipPath>
      </defs>

      {/* Curly tail with coloured rings, swishing (mirrored twice so it lifts rather than dips) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="88% 80%">
          <g transform={MIRROR}>
            <path d={TAIL_PATH} fill={skin.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
            {rings.map(([i0, i1, c]) => <path key={i0} d={tailBand(Math.round(i0), Math.round(i1))} fill={c} />)}
          </g>
        </Anim>
      </g>

      {/* Front legs with mitten feet (two bunches of toes, like a real chameleon's) */}
      {[84, 116].map((x) => (
        <g key={x}>
          <rect x={x - 5} y={152} width={10} height={22} rx={5} fill={skin.fill} stroke={line} strokeWidth={3} />
          <ellipse cx={x - 4.5} cy={175} rx={6} ry={4} fill={skin.fill} stroke={line} strokeWidth={2.5} transform={`rotate(-25 ${x - 4.5} 175)`} />
          <ellipse cx={x + 4.5} cy={175} rx={6} ry={4} fill={skin.fill} stroke={line} strokeWidth={2.5} transform={`rotate(25 ${x + 4.5} 175)`} />
        </g>
      ))}

      {/* Round body: patches of colour, then bands, then the whole rainbow; a pale tummy */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={146} rx={36} ry={28} fill={skin.fill} stroke={line} strokeWidth={3} />
        <g clipPath={`url(#${clip})`}>
          {s === 0 && patches.map(([x, y, r, c], i) => <path key={x} d={blob(x, y, r, i + 1)} fill={c} stroke={ink(c)} strokeWidth={1.5} />)}
          {bands.map(([y, c]) => (
            <path key={y} d={`M58 ${y} Q100 ${y + 9} 142 ${y} L142 ${y + (s >= 2 ? 10 : 8)} Q100 ${y + (s >= 2 ? 19 : 17)} 58 ${y + (s >= 2 ? 10 : 8)} Z`} fill={c} />
          ))}
        </g>
        <ellipse cx={100} cy={152} rx={17} ry={16} fill={belly.fill} stroke={ink(BELLY)} strokeWidth={1.5} />
      </g>

      {/* Head with a rounded casque, big eye turrets and a wide smile */}
      <path d="M80 70 C82 56 92 44 100 42 C108 44 118 56 120 70 Z" fill={skin.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={100} cy={88} rx={38} ry={31} fill={skin.fill} stroke={line} strokeWidth={3} />
      <Shine x={82} y={70} rx={9} ry={5} />
      {/* Eye turrets: round cones with a ring round each eye */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <circle cx={100 + side * 22} cy={86} r={14} fill={skin.fill} stroke={line} strokeWidth={2.5} />
          <circle cx={100 + side * 22} cy={86} r={10.5} fill="none" stroke={line} strokeWidth={1.4} opacity={0.45} />
        </g>
      ))}
      <CuteFace x={100} y={86} s={0.85} gap={26} mood={mood} mouth={false} blinkDelay={2} />
      <path d={g ? 'M89 112 Q100 104 111 112' : 'M84 103 Q100 116 116 103'} stroke="#2b2140" strokeWidth={2.8} fill="none" strokeLinecap="round" />

      {s >= 2 && (
        <>
          <Crown x={100} y={58} />
          {!g && [[30, 60, 8], [176, 52, 7], [24, 132, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
