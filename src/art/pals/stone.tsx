// Rocky → Cobblesong → Singstone: a round, friendly blue-grey stone facing you, with a few soft speckles, a soft
// cushion of green moss on top of its head, two stubby stone arms thrown up for joy and two small feet to stand and
// hop on. Its mouth is open wide: it cries out for joy, for Jesus said that even the stones would shout His praise
// (Luke 19:40).
// Cobblesong sings: musical notes burst out all round its head. Singstone sings with a ring of little pebble friends
// round its feet (each with its own little face), glows warmly and wears a crown.
// Grumpy (in battle, sitting grumpy and silent by the road): dull dark grey, little cracks for frown lines on its
// forehead, its arms folded, cross brows and a frown; its moss is dry and brown, and it doesn't sing.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, darken, ink, lighten, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

const MIRROR = 'translate(200 0) scale(-1 1)'

/** A smooth closed outline through the points (Catmull-Rom). */
function smooth(ps: Pt[]) {
  const n = ps.length
  const at = (i: number) => ps[(i + n) % n]
  return `M${pt(...ps[0])}` + ps.map((_, i) => {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    return ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }).join('') + 'Z'
}

/** An ellipse's outline as polygon points. The glow is drawn as a polygon, so the coloring page (which turns every
 *  path, circle, ellipse and rect into a white shape to fill in) leaves it as it is. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A line through the points and back along itself: it has no inside, so the coloring page inks it as a line. */
const line = (ps: Pt[]) => `M${ps.map((p) => pt(...p)).join(' L')} L${ps.slice(0, -1).reverse().map((p) => pt(...p)).join(' L')}`

/** A stubby stone arm: a tube w wide from a to b, with round ends. */
function capsule(a: Pt, b: Pt, w: number) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const len = Math.hypot(dx, dy) || 1
  const [nx, ny] = [(-dy / len) * (w / 2), (dx / len) * (w / 2)]
  const r = w / 2
  return `M${pt(a[0] + nx, a[1] + ny)} L${pt(b[0] + nx, b[1] + ny)} A${r} ${r} 0 0 0 ${pt(b[0] - nx, b[1] - ny)} L${pt(a[0] - nx, a[1] - ny)} A${r} ${r} 0 0 0 ${pt(a[0] + nx, a[1] + ny)}Z`
}

// The round stone: a ball a little squarer and lumpier than a ball, like a pebble. `onBody(deg)` is the point on its
// outline at deg degrees (0 = right, 90 = bottom, -90 = the top of its head), or k times as far out.
const CX = 100, CY = 118, RX = 54, RY = 50
const sq = (v: number) => Math.sign(v) * Math.abs(v) ** 0.88
function onBody(deg: number, k = 1): Pt {
  const a = (deg * Math.PI) / 180
  const lump = 1 + 0.02 * Math.sin(2 * a + 0.9) + 0.012 * Math.cos(3 * a)
  return [CX + sq(Math.cos(a)) * RX * k * lump, CY + sq(Math.sin(a)) * RY * k * lump]
}
const BODY = smooth(Array.from({ length: 24 }, (_, i) => onBody(i * 15)))
const FACE_Y = 112

/** The cushion of moss on its head, over its outline from a0 to a1 degrees: soft bumps outside, thinning to
 *  nothing at each end. */
function moss(a0: number, a1: number, n: number) {
  const top = Array.from({ length: n + 1 }, (_, i) => onBody(a0 + ((a1 - a0) * i) / n, 1.02))
  const under = Array.from({ length: 9 }, (_, i) => onBody(a1 - ((a1 - a0) * i) / 8, 1 - 0.15 * Math.sin((Math.PI * i) / 8)))
  let d = `M${pt(...top[0])}`
  for (let i = 1; i <= n; i++) {
    const r = (Math.hypot(top[i][0] - top[i - 1][0], top[i][1] - top[i - 1][1]) * 0.62).toFixed(2)
    d += ` A${r} ${r} 0 0 1 ${pt(...top[i])}`
  }
  return d + under.slice(1).map((p) => ` L${pt(...p)}`).join('') + 'Z'
}
const MOSS = moss(-168, -106, 4)

// Its arms (the right ones are the mirror image of the left): thrown up for joy, from its shoulder inside the body;
// or (grumpy) folded across its tummy, the right one over the left.
const ARM_UP: [Pt, Pt] = [[61, 124], [38, 94]]
const FOLD_L: [Pt, Pt] = [[52, 138], [124, 151]]
const FOLD_R: [Pt, Pt] = [[148, 138], [77, 153]]

// A few soft speckles, clear of its face: [x, y, r, lighter]
const SPECKLES: [number, number, number, boolean][] = [
  [63, 104, 2.4, false], [70, 142, 3, false], [135, 89, 2.2, false], [142, 131, 2.7, false], [121, 157, 2, false],
  [86, 158, 1.8, true], [56, 122, 1.6, true], [147, 109, 1.7, true], [117, 80, 1.6, true],
]

// The notes bursting out as it sings: [x, y, size, tilt, ♫ (or ♪), colour, from stage]
const NOTES: [number, number, number, number, boolean, string, number][] = [
  [34, 62, 1, -10, false, '#ffc928', 1], [152, 46, 1, 8, true, '#ff7eb6', 1], [178, 88, 0.8, 12, false, '#5fb7ff', 1],
  [64, 40, 0.85, -6, true, '#5fb7ff', 2],
]

// Grumpy: little cracks for frown lines (one between its brows, two at its sides)
const CRACKS: Pt[][] = [
  [[100, 85], [97.6, 90], [101, 94.5], [98.6, 99]],
  [[47.5, 104], [54, 106.5], [52.5, 111], [58, 114]],
  [[147, 92], [141.5, 96], [144, 100.5]],
]

/** A musical note, its (first) head at (0, 0): ♪, or ♫ with `two`. The stems and the flag or beam are strokes, their
 *  outline under their colour, running there and back so the coloring page inks them as lines. */
function Note({ two, color }: { two?: boolean; color: string }) {
  const edge = ink(color)
  const stems = two ? 'M5 -1 L5 -22 L5 -1 M20 -5 L20 -26 L20 -5' : 'M5 -1 L5 -23 L5 -1'
  const top = two ? 'M5 -22 L20 -26 L5 -22' : 'M5 -23 C6 -16 14 -17 12 -8 C14 -17 6 -16 5 -23'
  const heads: Pt[] = two ? [[0, 0], [15, -4]] : [[0, 0]]
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={stems} stroke={edge} strokeWidth={5.4} />
      <path d={top} stroke={edge} strokeWidth={two ? 8.4 : 5.4} />
      <path d={stems} stroke={color} strokeWidth={2.6} />
      <path d={top} stroke={color} strokeWidth={two ? 5.6 : 2.6} />
      {heads.map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx={6} ry={4.6} fill={color} stroke={edge} strokeWidth={2} transform={`rotate(-22 ${x} ${y})`} />
      ))}
    </g>
  )
}

/** A little pebble friend sitting on the ground, the middle of its bottom at (0, 0), with a tiny face. (The face
 *  is drawn in polygons and lines, which the coloring page leaves as they are: its own outlines would swallow
 *  something so small.) */
function PebbleFriend({ color, r, g, open }: { color: string; r: number; g: boolean; open?: boolean }) {
  const shade = useShade(color, 0.4, 0.16)
  const ry = r * 0.8
  const k = r / 14 // the face's scale
  const fy = -ry * 0.95 // the face's middle
  const at = (x: number, y: number): [number, number] => [x * k, fy + y * k]
  const dot = (x: number, y: number, rx: number, ry2 = rx) => ring(...at(x, y), rx * k, ry2 * k, 14)
  return (
    <g>
      <defs>{shade.def}</defs>
      <ellipse cx={0} cy={-ry} rx={r} ry={ry} fill={shade.fill} stroke={ink(color)} strokeWidth={2.4} />
      <polygon points={ring(-r * 0.45, -ry * 1.45, r * 0.28, r * 0.15, 14)} fill="#fff" opacity={0.5} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <polygon points={dot(s * 4.6, 0, 2, g ? 1.6 : 2.5)} fill="#2b2140" />
          {!g && <polygon points={dot(s * 4.6 - 0.7, -0.9, 0.8)} fill="#fff" />}
          <polygon points={dot(s * 8.4, 4, 2.4, 1.5)} fill="#ff7fb0" opacity={0.55} />
        </g>
      ))}
      {g
        ? <polyline points={[at(-2.2, 5.5), at(2.2, 5.5)].map((p) => pt(...p)).join(' ')} stroke="#2b2140" strokeWidth={1.4} strokeLinecap="round" fill="none" />
        : open
          ? <polygon points={dot(0, 5, 1.8, 2.2)} fill="#6b2a3a" />
          : <polyline points={[-2.6, -1.3, 0, 1.3, 2.6].map((x) => pt(...at(x, 4 + 2.8 * (1 - (x / 2.6) ** 2)))).join(' ')} stroke="#2b2140" strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  )
}

export default function Stone({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `rg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const STONE = g ? '#7f8088' : '#b3b9c2'
  const MOSS_C = g ? '#8f8a63' : '#7cc45a'
  const stone = useShade(STONE, 0.4, 0.18)
  const moss = useShade(MOSS_C, 0.35, 0.15)
  const edge = ink(STONE)
  const dark = darken(STONE, 0.3)
  const light = lighten(STONE, 0.45)
  // Singstone's pebble friends round its feet: [x, y, r, colour, singing]
  const FRIENDS: [number, number, number, string, boolean][] = [
    [28, 176, 10, g ? '#8d8a86' : '#cfc6bb', false], [52, 184, 12.5, g ? '#86888f' : '#c3cad4', true],
    [148, 184, 12.5, g ? '#8f8a88' : '#d6c7b6', false], [173, 176, 10.5, g ? '#888a8e' : '#bfc6cf', true],
  ]
  return (
    <g>
      <defs>
        {stone.def}{moss.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#fff1b8" stopOpacity={0.95} />
          <stop offset="0.6" stopColor="#ffe08a" stopOpacity={0.5} />
          <stop offset="1" stopColor="#ffe08a" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Singstone's warm glow */}
      {st >= 2 && !g && <polygon points={ring(100, 116, 94, 90)} fill={`url(#${glowId})`} />}

      {/* Singstone's pebble friends at the back of the ring */}
      {st >= 2 && FRIENDS.filter(([, y]) => y < 180).map(([x, y, r, c, open]) => (
        <g key={x} transform={`translate(${x} ${y})`}><PebbleFriend color={c} r={r} g={g} open={open} /></g>
      ))}

      {/* Two small feet to stand and hop on, peeping out under it */}
      {[84, 116].map((x) => <ellipse key={x} cx={x} cy={171} rx={12.5} ry={7.5} fill={stone.fill} stroke={edge} strokeWidth={3} />)}

      {/* Stubby arms thrown up for joy, behind the body so they grow out of its sides */}
      {!g && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="100% 100%" delay={side > 0 ? 0.5 : 0}>
            <path d={capsule(...ARM_UP, 18)} fill={stone.fill} stroke={edge} strokeWidth={3} />
          </Anim>
        </g>
      ))}

      {/* The round stone, with its speckles */}
      <g className="pa-breathe">
        <path d={BODY} fill={stone.fill} stroke={edge} strokeWidth={3} strokeLinejoin="round" />
        {/* (polygons, so the coloring page leaves them as soft speckles instead of making them shapes to colour in) */}
        {SPECKLES.map(([x, y, r, l]) => <polygon key={`${x} ${y}`} points={ring(x, y, r, r, 14)} fill={l ? light : dark} opacity={l ? 0.8 : 0.4} />)}
        <Shine x={74} y={90} rx={10} ry={5.5} />
        {g && CRACKS.map((c, i) => <path key={i} d={line(c)} fill="none" stroke={dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />)}
      </g>

      {/* The cushion of moss on its head */}
      <path d={MOSS} fill={moss.fill} stroke={ink(MOSS_C)} strokeWidth={2.4} strokeLinejoin="round" />

      {/* Its face: wide open, crying out for joy (cross and silent when grumpy) */}
      <CuteFace x={100} y={FACE_Y} s={0.92} gap={15} mood={mood} mouth={g} blinkDelay={0.7} />
      {!g && (
        <g transform={`translate(100 ${FACE_Y}) scale(0.92)`}>
          <path d="M-8.5 10 Q0 25 8.5 10 Q0 13 -8.5 10 Z" fill="#6b2a3a" />
          <path d="M-5 15.4 Q0 12 5 15.4 Q0 19.4 -5 15.4 Z" fill="#ff8fa8" />
          <path d="M-8.5 10 Q0 25 8.5 10 Q0 13 -8.5 10 Z" fill="none" stroke="#2b2140" strokeWidth={2} strokeLinejoin="round" />
        </g>
      )}

      {/* Its arms folded, cross (grumpy) */}
      {g && (
        <g fill={stone.fill} stroke={edge} strokeWidth={3}>
          <path d={capsule(...FOLD_L, 17)} />
          <path d={capsule(...FOLD_R, 17)} />
        </g>
      )}

      {/* Singstone's pebble friends at the front of the ring, and its crown */}
      {st >= 2 && FRIENDS.filter(([, y]) => y >= 180).map(([x, y, r, c, open]) => (
        <g key={x} transform={`translate(${x} ${y})`}><PebbleFriend color={c} r={r} g={g} open={open} /></g>
      ))}
      {st >= 2 && <Crown x={100} y={CY - RY + 6} />}

      {/* The notes bursting out as it sings, and Singstone's sparkles */}
      {!g && NOTES.filter((n) => st >= n[6]).map(([x, y, s, rot, two, c], i) => (
        <Anim key={x} cls="pa-float" delay={i * 0.45}>
          <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><Note two={two} color={c} /></g>
        </Anim>
      ))}
      {st >= 2 && !g && [[22, 120, 6], [182, 132, 5.5]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={0.3 + i * 0.7}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
