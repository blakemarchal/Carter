// Flicker → Glowbug → Lanternwing: a cute round firefly standing on the ground (with a soft shadow under it), turned
// a little toward our left with its face toward you. A round dark-plum body (head and body all one ball) with big
// friendly eyes in bright white rims, rosy cheeks, a pink smile and a slightly lighter plum tummy underneath; two
// antennae with round tips growing from the top of it; see-through wings at its sides, two on each side, fluttering;
// six little legs, short stubs tucked right under its body, three on each side, so only their small round feet peep
// out under its edge, on the ground (so it never looks like a spider); and its tail end at its back (our right), low
// behind the ball: a short plum band, then a big round light that glows yellow, with a soft glow round it.
// Glowbug's light is brighter and warmer, with a wider glow, and the tips of its antennae glow too.
// Lanternwing's light glows like a paper lantern (soft ribs round it), it glows warmly all round, its wings shine
// gold in the light, and it wears a crown, with sparkles all round.
// Grumpy: a dull grey-plum, its light gone dim and dull (just a faint flicker by it), its antennae drooping, and
// cross brows.
import { useId, type CSSProperties } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** A smooth tapering tube along the curve a → (b) → c, width w0 at a down to w1 at c, with round ends. */
function tube(a: Pt, b: Pt, c: Pt, w0: number, w1: number, n = 16) {
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t
    const x = u * u * a[0] + 2 * u * t * b[0] + t * t * c[0]
    const y = u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]
    const dx = u * (b[0] - a[0]) + t * (c[0] - b[0]), dy = u * (b[1] - a[1]) + t * (c[1] - b[1])
    const len = Math.hypot(dx, dy) || 1, h = (w0 + (w1 - w0) * t) / 2
    L.push([x - (dy / len) * h, y + (dx / len) * h])
    R.unshift([x + (dy / len) * h, y - (dx / len) * h])
  }
  const sm = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return `M${pt(...L[0])} ${sm(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${sm(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}

/** An ellipse's outline as polygon points. The glows and the shadow are drawn as polygons, so the coloring page
 *  (which turns every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

// Its round body (the middle of it is a little to our right of its face, the way it's turned), and its face
const BX = 105, BY = 121, BRX = 42, BRY = 40
const FACE_Y = 117
const FACE_S = 0.88
const GAP = 15
const BLINK = 0.3
/** Mirrored about the middle of its body (for the wings on its other side). */
const MIRROR_BODY = `translate(${2 * BX} 0) scale(-1 1)`
/** Mirrored about its face (for its antennae). */
const MIRROR_FACE = 'translate(200 0) scale(-1 1)'

// Its tail end, at its back behind the ball (our right): a plum segment, and its big round light at the very end (the
// light is the end of the segment's ellipse, from a little left of its middle round to the back)
const TAIL = { x: 153, y: 141, rx: 27, ry: 22 }
const LIGHT_FROM = 151 // where the light starts, along the tail's ellipse
const lightPath = (() => {
  const dy = TAIL.ry * Math.sqrt(1 - ((LIGHT_FROM - TAIL.x) / TAIL.rx) ** 2)
  const [top, bot]: Pt[] = [[LIGHT_FROM, TAIL.y - dy], [LIGHT_FROM, TAIL.y + dy]]
  return `M${pt(...top)} A${TAIL.rx} ${TAIL.ry} 0 1 1 ${pt(...bot)} C${pt(LIGHT_FROM - 7, TAIL.y + dy * 0.45)} ${pt(LIGHT_FROM - 7, TAIL.y - dy * 0.45)} ${pt(...top)}Z`
})()
// Lanternwing's paper-lantern ribs round its light, curving from its top to its bottom (polylines, which the coloring
// page leaves as they are)
const RIBS = [0.45, 0.75, 0.93].map((k) => Array.from({ length: 13 }, (_, i) => {
  const y = TAIL.y - TAIL.ry * 0.92 + (TAIL.ry * 1.84 * i) / 12
  return pt(TAIL.x + TAIL.rx * k * Math.sqrt(Math.max(0, 1 - ((y - TAIL.y) / TAIL.ry) ** 2)), y)
}).join(' '))

// Its left wings (the right ones are their mirror image): see-through, from its side, behind the ball: a big one
// out and up, a smaller one out and a little down. [root x, root y, angle (180 points straight out), length, width]
const WINGS: [number, number, number, number, number][] = [[72, 107, 205, 48, 25], [74, 124, 170, 38, 19]]
const VEINS = (l: number) => `${(l * 0.18).toFixed(1)} 0 ${(l * 0.85).toFixed(1)} 0`

// Its six legs are short stubs tucked right under its round body, three on each side, so all that shows of them is
// their small round feet, peeping out under its edge (so it never looks like a spider). Where they are, left to right:
// each peeps out just under the edge of its body there, so the back ones, further out, are a little higher up (the
// ones on our right a little closer together, the way it's turned, so the back one is clear of its tail)
const FEET = [78, 88, 98, 111, 120, 129]
/** The bottom edge of its round body at x. */
const bottomAt = (x: number) => BY + BRY * Math.sqrt(Math.max(0, 1 - ((x - BX) / BRX) ** 2))
// Its slightly lighter tummy: the underside of its round body, below its smile (along the bottom of its body just
// inside its outline, and back across in a gentle curve)
const TUMMY = (() => {
  const [rx, ry, top] = [BRX - 1.5, BRY - 1.5, 143]
  const dx = rx * Math.sqrt(1 - ((top - BY) / ry) ** 2)
  const [l, r]: Pt[] = [[BX - dx, top], [BX + dx, top]]
  return `M${pt(...l)} A${rx} ${ry} 0 0 0 ${pt(...r)} Q102 132 ${pt(...l)}Z`
})()

export default function Firefly({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [haloId, lightId, glowId] = [`fh${ids}`, `fl${ids}`, `fg${ids}`]
  const PLUM = g ? '#6f6774' : '#5c2f73'
  const LEGC = g ? '#58525c' : '#43215a'
  const TUMMYC = g ? '#8c8592' : '#7d4c96'
  const LIGHT = g ? '#cbc39f' : st >= 1 ? '#ffd23a' : '#ffe04f'
  const HALO = st >= 1 ? '#ffc94d' : '#ffe680'
  const RIM = g ? '#ece8ee' : '#ffffff'
  const WINGC = st >= 2 && !g ? '#fff3c4' : '#eaf5ff'
  const WING_LINE = st >= 2 && !g ? '#e5bd55' : g ? '#b8c0c8' : '#a6c4e6'
  const TIP = g ? '#8d8592' : st >= 1 ? '#ffd84a' : '#9a6fc0'
  const body = useShade(PLUM, 0.32, 0.2)
  const leg = useShade(LEGC, 0.3, 0.15)
  const tummy = useShade(TUMMYC, 0.3, 0.12)
  const tip = useShade(TIP, 0.45, 0.1)
  const glowing = !g
  const line = g ? '#4a444e' : '#33163f'
  // Antennae from the top of its head, curling out (drooping to the sides when grumpy)
  const antenna: [Pt, Pt, Pt] = g ? [[92, 87], [79, 74], [67, 84]] : [[92, 87], [86, 67], [73, 58]]

  return (
    <g>
      <defs>
        {body.def}{leg.def}{tummy.def}{tip.def}
        <radialGradient id={haloId}>
          <stop offset="0" stopColor={HALO} stopOpacity={0.9} />
          <stop offset="0.55" stopColor={HALO} stopOpacity={0.4} />
          <stop offset="1" stopColor={HALO} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={lightId} cx="62%" cy="45%" r="70%">
          <stop offset="0" stopColor={g ? '#e6e0c6' : '#fffbe2'} />
          <stop offset="0.45" stopColor={LIGHT} />
          <stop offset="1" stopColor={g ? '#a9a184' : '#f5a623'} />
        </radialGradient>
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#fff0b0" stopOpacity={0.95} />
          <stop offset="0.6" stopColor="#ffe08a" stopOpacity={0.45} />
          <stop offset="1" stopColor="#ffd27a" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Its soft shadow on the ground, under it */}
      <polygon points={ring(110, 165, 56, 7)} fill="#2b2140" opacity={0.12} />

      {/* Lanternwing's warm glow all round it */}
      {st >= 2 && glowing && <polygon points={ring(108, 120, 90, 82)} fill={`url(#${glowId})`} />}

      {/* The soft glow round its light (bigger and warmer as it grows; none when it's grumpy) */}
      {glowing && <polygon points={ring(TAIL.x + 6, TAIL.y, [32, 38, 40][st], [30, 36, 40][st])} fill={`url(#${haloId})`} />}

      {/* Its tail end at its back: a plum segment, then its big round light (with Lanternwing's lantern ribs) */}
      <ellipse cx={TAIL.x} cy={TAIL.y} rx={TAIL.rx} ry={TAIL.ry} fill={body.fill} stroke={line} strokeWidth={2.6} />
      <path d={lightPath} fill={`url(#${lightId})`} stroke={g ? '#a39b7c' : '#e0a21c'} strokeWidth={2.2} strokeLinejoin="round" />
      {st >= 2 && glowing && RIBS.map((p) => <polyline key={p} points={p} fill="none" stroke="#f0a92a" strokeWidth={1.6} strokeLinecap="round" opacity={0.65} />)}
      {glowing && <Shine x={165} y={129} rx={6} ry={3.4} rot={-30} />}

      {/* See-through wings at its sides, two on each side, fluttering (gold in Lanternwing's light) */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR_BODY : undefined}>
          <Anim cls="pa-wing" origin="100% 50%" delay={side > 0 ? 0.1 : 0}>
            {WINGS.map(([x, y, a, l, w]) => (
              <g key={y} transform={`translate(${x} ${y}) rotate(${a + (g ? (a > 180 ? -16 : 10) : 0)})`}>
                <ellipse cx={l / 2} cy={0} rx={l / 2} ry={w / 2} fill={WINGC} fillOpacity={0.72} stroke={WING_LINE} strokeWidth={2} />
                <polyline points={VEINS(l)} fill="none" stroke={WING_LINE} strokeWidth={1.4} strokeLinecap="round" opacity={0.8} />
              </g>
            ))}
          </Anim>
        </g>
      ))}

      {/* Six little legs, short stubs tucked right under it (behind its body), three on each side, so only their small
          round feet peep out under its edge, on the ground */}
      {FEET.map((x) => {
        const [y, s] = [bottomAt(x), x < BX ? -1 : 1] // (s: which way its foot turns out)
        return (
          <g key={x}>
            <path d={tube([x - 1.5 * s, y - 9], [x - 0.5 * s, y - 4], [x + 0.3 * s, y + 0.5], 6.4, 5.8)} fill={leg.fill} stroke={line} strokeWidth={1.4} strokeLinejoin="round" />
            <ellipse cx={x + 0.6 * s} cy={y + 2.6} rx={4.5} ry={3.1} fill={leg.fill} stroke={line} strokeWidth={1.4} />
          </g>
        )
      })}

      {/* Antennae with round tips, from the top of it (behind it, so they grow out of it); they twitch */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR_FACE : undefined}>
          <Anim cls="pa-ear" origin="100% 100%" delay={side > 0 ? 0.5 : 0}>
            {st >= 1 && glowing && <polygon points={ring(antenna[2][0], antenna[2][1], 10)} fill={`url(#${haloId})`} />}
            <path d={tube(...antenna, 3.6, 2.8)} fill={PLUM} stroke={line} strokeWidth={1.2} strokeLinejoin="round" />
            <circle cx={antenna[2][0]} cy={antenna[2][1]} r={5} fill={tip.fill} stroke={st >= 1 && glowing ? '#e0a21c' : line} strokeWidth={1.4} />
          </Anim>
        </g>
      ))}

      {/* Its round plum body, with its slightly lighter tummy underneath */}
      <g className="pa-breathe">
        <ellipse cx={BX} cy={BY} rx={BRX} ry={BRY} fill={body.fill} stroke={line} strokeWidth={3} />
        <path d={TUMMY} fill={tummy.fill} />
        <Shine x={84} y={93} rx={9} ry={5} />
      </g>

      {/* Its face: big eyes in bright white rims (blinking with the eyes), so they show on its dark body */}
      {[-1, 1].map((side) => (
        <g key={side} className="pa-blink" style={{ '--d': `${BLINK}s` } as CSSProperties}>
          <ellipse cx={100 + side * GAP * FACE_S} cy={FACE_Y} rx={(7.5 + 2.8) * FACE_S} ry={((g ? 5.5 : 9.5) + 2.8) * FACE_S} fill={RIM} />
        </g>
      ))}
      {/* (grumpy: a pale edge round its cross brows, so they show on its dark face) */}
      {g && (
        <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
          <path d={`M${-GAP - 9} -13 L${-GAP + 7} -7 M${GAP + 9} -13 L${GAP - 7} -7`} stroke="#d9d3dc" strokeWidth={7} strokeLinecap="round" fill="none" />
        </g>
      )}
      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={GAP} mood={mood} mouth={false} blinkDelay={BLINK} />
      <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
        {/* rosier cheeks, which would look muddy on plum otherwise (the same ellipses as CuteFace's) */}
        {[-1, 1].map((side) => <ellipse key={side} cx={side * (GAP + 10)} cy={11} rx={6.5} ry={4.2} fill="#ff8fbf" opacity={0.6} />)}
        {/* a pink smile (a light frown when grumpy) */}
        {g
          ? <path d="M-7 18 Q0 12 7 18" stroke="#d9d3dc" strokeWidth={3} fill="none" strokeLinecap="round" />
          : <path d="M-7 11 Q0 19 7 11 Q0 14.5 -7 11 Z" fill="#ff6f96" stroke="#ffc3d4" strokeWidth={1.8} strokeLinejoin="round" />}
      </g>

      {st >= 2 && <g transform="translate(100 85) scale(0.8)"><Crown x={0} y={0} /></g>}

      {/* Grumpy: its light gone dim, just a faint flicker by it */}
      {g && (
        <Anim cls="pa-twinkle" delay={0.4}>
          <path d={twinklePath(179, 119, 6.5)} fill="#e2d690" stroke="#bdb27e" strokeWidth={1} opacity={0.9} />
        </Anim>
      )}

      {st >= 2 && glowing && [[24, 44, 7], [178, 40, 6], [186, 168, 5], [20, 150, 5]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
