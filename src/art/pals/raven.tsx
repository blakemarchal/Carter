// Crumbs → Breadwing → Skycarrier: a chubby, friendly raven facing you, soft black with a shiny blue sheen on its
// feathers, big friendly eyes with bright rims, a small round grey beak, a fluffy little tuft on its head and a
// soft grey-blue tummy. Its wings are folded at its sides, its tail fans out behind it (peeping out at its back,
// low on one side), and it stands on two dark legs with three round toes on each foot. Crumbs has a few crumbs of
// bread on the ground by its feet.
// Breadwing carries a little loaf of bread in its beak, ready to share; Skycarrier opens its big wings wide at its
// sides, carries a basket of bread by its handle in its beak, glows gently and wears a crown.
// Grumpy: a dusty grey, its feathers ruffled up, its wings drooping, with cross brows.
import { useId, type CSSProperties } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

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

/** An ellipse's outline as polygon points. Soft glows are drawn as polygons, so the coloring page (which turns
 *  every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** The plump body, egg-shaped (a little wider at the bottom); `puff` widens it. */
const bodyPts = (puff: number): Pt[] => Array.from({ length: 12 }, (_, i) => {
  const a = ((i * 30 - 90) * Math.PI) / 180
  return [100 + 45 * puff * Math.cos(a) * (1 + 0.1 * Math.sin(a)), 118 + 49 * Math.sin(a)]
})
const FACE_Y = 99
const FACE_S = 0.88
const GAP = 15

// The left wing folded at its side (the right one is its mirror image), with three round feather tips at the
// bottom; and Skycarrier's wing opened wide: long feathers fanned out from under the little feathers at the top
// of the wing. [root x, root y, angle (180 points straight out), length, width]
const WING = 'M66 101 C54 104 46 114 44 127 C42 137 43 146 46 153 A4.2 4.2 0 0 0 52.5 157.5 A4.2 4.2 0 0 0 59.5 156 A4.2 4.2 0 0 0 64.5 150 C67.5 141 70 131 70 120 C70 111 69 105 66 101 Z'
const WING_LINES = ['52 134 50.5 154', '58.5 136 57 154.5']
const FEATHERS = [[40, 98, 202, 29, 13.5], [38, 106, 190, 33, 14.5], [40, 114, 178, 34, 14.5], [44, 121, 166, 32, 14.5], [49, 127, 154, 28, 13.5], [56, 132, 142, 22, 12]]
const COVERTS = 'M72 100 C61 92 47 91 37 95 C30 99 31 108 37 110 C33 116 37 123 45 124 C45 130 52 135 61 134 C67 129 71 120 72 110 Z'
/** A long feather from its root at (0, 0) out to its rounded tip at (l, 0), w wide. */
const feather = (l: number, w: number) =>
  `M0 ${-w * 0.3} C${l * 0.4} ${-w * 0.55} ${l * 0.8} ${-w * 0.55} ${l} ${-w * 0.2} Q${l + 2.5} 0 ${l} ${w * 0.2} C${l * 0.8} ${w * 0.55} ${l * 0.4} ${w * 0.55} 0 ${w * 0.3} Z`
// The tail: one wedge of feathers fanning out from behind its body, its end a row of round feather tips, pointing
// back and down at its back (on its left, our right). Drawn out along +x from its root at (0, 0).
const TAIL_L = 55, TAIL_HALF = 15, TAIL_TIPS = 4
const tailAt = (deg: number, r: number): Pt => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r]
const TAIL_FAN = (() => {
  const ends = Array.from({ length: TAIL_TIPS + 1 }, (_, i) => tailAt(-TAIL_HALF + (2 * TAIL_HALF * i) / TAIL_TIPS, TAIL_L))
  const r = (Math.hypot(ends[1][0] - ends[0][0], ends[1][1] - ends[0][1]) / 2 + 0.6).toFixed(1)
  return `M0 -6 L${pt(...ends[0])}` + ends.slice(1).map((e) => ` A${r} ${r} 0 0 1 ${pt(...e)}`).join('') + ' L0 6 Z'
})()
// The lines between its feathers, from inside the body out to between the round tips
const TAIL_LINES = Array.from({ length: TAIL_TIPS - 1 }, (_, i) => {
  const a = -TAIL_HALF + (2 * TAIL_HALF * (i + 1)) / TAIL_TIPS
  return `${pt(...tailAt(a * 0.7, 22))} ${pt(...tailAt(a, TAIL_L - 2))}`
})

/** A little loaf of bread, centred on (0, 0), lying across, with three cuts across its top (lines, so the coloring
 *  page leaves them thin). */
function Loaf({ crust, slash, line }: { crust: string; slash: string; line: string }) {
  return (
    <g>
      <path d="M-18 1 C-18 -6 -10 -8.5 0 -8.5 C10 -8.5 18 -6 18 1 C18 6 10 7.5 0 7.5 C-10 7.5 -18 6 -18 1 Z" fill={crust} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      {[-9, 0, 9].map((x) => <line key={x} x1={x - 2.4} y1={2} x2={x + 2.4} y2={-5.6} stroke={slash} strokeWidth={2.6} strokeLinecap="round" />)}
    </g>
  )
}

export default function Raven({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `rg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const BLACK = g ? '#8e8a97' : '#3d4262'
  const WINGC = g ? '#827e8c' : '#353a58'
  const TUMMY = g ? '#a5a1ad' : '#575f84'
  const SHEEN = g ? '#c9c6d2' : '#8fb0ff'
  const BEAK = g ? '#aaa49f' : '#8b91ab'
  const LEGS = g ? '#7b7782' : '#4b4f66'
  const RIM = g ? '#efedf2' : '#f6f7ff'
  const CRUST = g ? '#cdbba4' : '#e8a256'
  const SLASH = g ? '#e6dccd' : '#fde3b4'
  const WICKER = g ? '#c4b49f' : '#d39a5a'
  const GOLD = '#ffe9a6'
  const body = useShade(BLACK, 0.32, 0.2)
  const wing = useShade(WINGC, 0.3, 0.2)
  const tummy = useShade(TUMMY, 0.3, 0.12)
  const beak = useShade(BEAK, 0.45, 0.15)
  const legs = useShade(LEGS, 0.3, 0.15)
  const crust = useShade(CRUST, 0.4, 0.15)
  const wicker = useShade(WICKER, 0.35, 0.15)
  const line = ink(BLACK)
  const open = st >= 2
  const outline = smooth(bodyPts(g ? 1.04 : 1))
  // Its little head tuft: soft feathers, fuller as it grows; ruffled up every which way when grumpy. [angle, length]
  const tuft: [number, number][] = g
    ? [[-38, 12], [-8, 15], [22, 13], [52, 10]]
    : st >= 1 ? [[-26, 13], [-6, 17], [16, 14]] : [[-16, 12], [8, 14]]

  return (
    <g>
      <defs>
        {body.def}{wing.def}{tummy.def}{beak.def}{legs.def}{crust.def}{wicker.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GOLD} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={GOLD} stopOpacity={0.45} />
          <stop offset="1" stopColor={GOLD} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Skycarrier's gentle glow all round it */}
      {open && !g && <polygon points={ring(100, 116, 96, 86)} fill={`url(#${glowId})`} />}

      {/* Skycarrier's big wings, opened wide at its sides (drooping when grumpy), flapping slowly */}
      {open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="95% 50%" delay={side > 0 ? 0.1 : 0}>
            <g transform={g ? 'rotate(-24 68 114)' : 'rotate(10 68 114)'}>
              {FEATHERS.map(([x, y, a, l, w]) => (
                <g key={y} transform={`translate(${x} ${y}) rotate(${a})`}>
                  <path d={feather(l, w)} fill={wing.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
                  <line x1={4} y1={0} x2={l - 5} y2={0} stroke={SHEEN} strokeWidth={1.3} strokeLinecap="round" opacity={0.45} />
                </g>
              ))}
              <path d={COVERTS} fill={wing.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
              <polyline points="44 101 52 104 58 110" fill="none" stroke={SHEEN} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
            </g>
          </Anim>
        </g>
      ))}

      {/* The tail, fanned out behind it at its back, wagging a little (mirrored twice, so the wag lifts it up off
          the ground rather than pushing it down into it) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="100% 0%" delay={0.4}>
          <g transform={MIRROR}>
            <g transform={`translate(122 142) rotate(${g ? 28 : 24})`}>
              <path d={TAIL_FAN} fill={wing.fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
              {TAIL_LINES.map((p) => <polyline key={p} points={p} fill="none" stroke={line} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />)}
              <polyline points={`${pt(...tailAt(-9, 24))} ${pt(...tailAt(-10, TAIL_L - 8))}`} fill="none" stroke={SHEEN} strokeWidth={2.2} strokeLinecap="round" opacity={0.45} />
            </g>
          </g>
        </Anim>
      </g>

      {/* The fluffy little tuft on its head (behind it, so it grows out of it; under Skycarrier's crown) */}
      <Anim cls="pa-ear" origin="50% 100%" delay={0.6}>
        {!open && tuft.map(([a, l]) => (
          <g key={a} transform={`translate(100 74) rotate(${a - 90})`}>
            <path d={feather(l, 8)} fill={body.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
          </g>
        ))}
      </Anim>

      {/* Two dark legs with three round toes on each foot */}
      {[89, 111].map((x) => (
        <g key={x} fill={legs.fill} stroke={ink(LEGS)} strokeWidth={2}>
          <rect x={x - 3} y={150} width={6} height={25} rx={3} />
          <ellipse cx={x - 6} cy={176.5} rx={2.8} ry={5.5} transform={`rotate(58 ${x - 6} 176.5)`} />
          <ellipse cx={x + 6} cy={176.5} rx={2.8} ry={5.5} transform={`rotate(-58 ${x + 6} 176.5)`} />
          <ellipse cx={x} cy={177.5} rx={3} ry={5} />
        </g>
      ))}

      {/* Crumbs: a few crumbs of bread on the ground by its feet */}
      {st === 0 && [[62, 177, 3.4], [71.5, 178.5, 2.4], [55, 179, 2]].map(([x, y, r]) => (
        <path key={x} d={`M${pt(x - r, y + r * 0.4)} Q${pt(x - r, y - r)} ${pt(x, y - r)} Q${pt(x + r * 1.1, y - r * 0.8)} ${pt(x + r, y + r * 0.3)} Q${pt(x, y + r * 0.9)} ${pt(x - r, y + r * 0.4)} Z`}
          fill={crust.fill} stroke={ink(CRUST)} strokeWidth={1.5} strokeLinejoin="round" />
      ))}

      {/* The plump body with its soft grey-blue tummy, and a shiny blue sheen on its head */}
      <g className="pa-breathe">
        <path d={outline} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={100} cy={142} rx={27} ry={23} fill={tummy.fill} />
        {[[91, 136], [109, 136], [100, 144], [86, 149], [114, 149], [100, 155]].map(([x, y]) => (
          <polyline key={`${x}${y}`} points={`${x - 3.5} ${y - 1.5} ${x} ${y + 2} ${x + 3.5} ${y - 1.5}`} fill="none" stroke={g ? '#c7c3cd' : '#8592c0'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <polyline points="70 92 76 81 86 74" fill="none" stroke={SHEEN} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
        <Shine x={80} y={82} rx={7} ry={4} />
      </g>

      {/* Wings folded at its sides (hanging lower when grumpy), flapping a little */}
      {!open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="80% 10%" delay={side > 0 ? 0.2 : 0}>
            <g transform={g ? 'rotate(10 66 102) translate(0 4)' : undefined}>
              <path d={WING} fill={wing.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
              {WING_LINES.map((p) => <polyline key={p} points={p} fill="none" stroke={line} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />)}
              <polyline points="52 112 48 122 47 132" fill="none" stroke={SHEEN} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
            </g>
          </Anim>
        </g>
      ))}

      {/* Skycarrier's basket of bread, carried by its handle (in its beak) */}
      {open && (
        <g>
          <path d="M80 141 C80 116 90 113 100 113 C110 113 120 116 120 141 L114.5 141 C114.5 121 108 119 100 119 C92 119 85.5 121 85.5 141 Z" fill={wicker.fill} stroke={ink(WICKER)} strokeWidth={2} strokeLinejoin="round" />
          <g transform="translate(100 140)">
            <g transform="translate(-8 -2) rotate(-16)"><Loaf crust={crust.fill} slash={SLASH} line={ink(CRUST)} /></g>
            <g transform="translate(9 -3) rotate(14) scale(0.9)"><Loaf crust={crust.fill} slash={SLASH} line={ink(CRUST)} /></g>
          </g>
          <path d="M77 140 H123 L119 160 Q100 166 81 160 Z" fill={wicker.fill} stroke={ink(WICKER)} strokeWidth={2.2} strokeLinejoin="round" />
          <polyline points="79.5 148 120.5 148" fill="none" stroke={ink(WICKER)} strokeWidth={1.6} opacity={0.6} />
          <polyline points="81 155 119 155" fill="none" stroke={ink(WICKER)} strokeWidth={1.6} opacity={0.6} />
          <rect x={75} y={137} width={50} height={6} rx={3} fill={wicker.fill} stroke={ink(WICKER)} strokeWidth={2} />
        </g>
      )}

      {/* Breadwing's little loaf of bread, held in its beak */}
      {st === 1 && (
        <g transform="translate(102 125) rotate(-14) scale(1.3 1.22)">
          <Loaf crust={crust.fill} slash={SLASH} line={ink(CRUST)} />
        </g>
      )}

      {/* Big friendly eyes with bright rims (blinking with the eyes), and a small round beak */}
      {[-1, 1].map((side) => (
        <g key={side} className="pa-blink" style={{ '--d': '0.9s' } as CSSProperties}>
          <ellipse cx={100 + side * GAP * FACE_S} cy={FACE_Y} rx={(7.5 + 2.6) * FACE_S} ry={((g ? 5.5 : 9.5) + 2.6) * FACE_S} fill={RIM} />
        </g>
      ))}
      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={GAP} mood={mood} mouth={false} blinkDelay={0.9} />
      <path d="M92.5 107.5 Q100 103.5 107.5 107.5 Q106 114 100 119 Q94 114 92.5 107.5 Z" fill={beak.fill} stroke={ink(BEAK)} strokeWidth={2} strokeLinejoin="round" />

      {open && (
        <>
          <Crown x={100} y={74} />
          {!g && [[24, 50, 8], [176, 46, 7], [100, 22, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
