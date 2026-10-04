// Crumbs → Breadwing → Skycarrier: a chubby, friendly raven facing you, soft black all over with a shiny blue sheen
// where the light catches its feathers, big friendly eyes with bright rims, a strong but rounded dark beak and a
// fluffy little tuft on its head. Its wings are folded at its sides, its tail fans out behind it (peeping out at
// its back, low on one side), and it stands on two dark legs with three round toes on each foot. Crumbs has a few
// crumbs of bread on the ground by its feet.
// Breadwing holds a little loaf of bread in its beak, one end sticking out to the side, ready to share; Skycarrier
// opens its big wings wide at its sides, carries a basket of bread by its handle in its beak, glows gently and
// wears a crown.
// Grumpy: a dull charcoal, its feathers ruffled up, its wings folded and drooping (Skycarrier's too), with cross
// brows.
import { useId, type CSSProperties } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]
type Tones = [string, string, string]

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

/** Soft round shading like the kit's useShade, but with its own three tones (where the light catches it, the
 *  middle, the edge), so a black bird can shine blue only where the light falls. */
function useTones([hi, mid, edge]: Tones) {
  const id = `rt${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return {
    fill: `url(#${id})`,
    def: (
      <radialGradient key={id} id={id} cx="35%" cy="30%" r="78%">
        <stop offset="0" stopColor={hi} />
        <stop offset="0.55" stopColor={mid} />
        <stop offset="1" stopColor={edge} />
      </radialGradient>
    ),
  }
}

/** The plump body, egg-shaped (a little wider at the bottom); `puff` widens it. */
const bodyPts = (puff: number): Pt[] => Array.from({ length: 12 }, (_, i) => {
  const a = ((i * 30 - 90) * Math.PI) / 180
  return [100 + 45 * puff * Math.cos(a) * (1 + 0.1 * Math.sin(a)), 118 + 49 * Math.sin(a)]
})
const FACE_Y = 99
const FACE_S = 0.88
const GAP = 15
// Its beak, a little way below its eyes (so it doesn't touch their rims): rounded at the tip, never sharp. When it
// holds Breadwing's loaf it opens a little: the top of the beak over the loaf and the bottom of it (the jaw) under it.
const BEAK = 'M92 114 Q100 109.5 108 114 Q106.5 121.5 101.8 126.4 Q100 128.6 98.2 126.4 Q93.5 121.5 92 114 Z'
const BEAK_BITE = 'M92 114 Q100 109.5 108 114 Q106.5 119.8 102.4 122.8 Q100 124.2 97.6 122.8 Q93.5 119.8 92 114 Z'
const JAW = 'M94.8 130.2 Q100 128.4 105.2 130.2 Q103.6 134.4 100 135.6 Q96.4 134.4 94.8 130.2 Z'

// The left wing folded at its side (the right one is its mirror image), with three round feather tips at the
// bottom; and Skycarrier's wing opened wide: long feathers fanned out from under the little feathers at the top
// of the wing. [root x, root y, angle (180 points straight out), length, width]
const WING = 'M66 101 C54 104 46 114 44 127 C42 137 43 146 46 153 A4.2 4.2 0 0 0 52.5 157.5 A4.2 4.2 0 0 0 59.5 156 A4.2 4.2 0 0 0 64.5 150 C67.5 141 70 131 70 120 C70 111 69 105 66 101 Z'
const WING_LINES = ['52 134 50.5 154', '58.5 136 57 154.5']
const FEATHERS = [[40, 98, 202, 29, 13.5], [38, 106, 190, 33, 14.5], [40, 114, 178, 34, 14.5], [44, 121, 166, 32, 14.5], [49, 127, 154, 28, 13.5], [56, 132, 142, 22, 12]]
const COVERTS = 'M72 100 C61 92 47 91 37 95 C30 99 31 108 37 110 C33 116 37 123 45 124 C45 130 52 135 61 134 C67 129 71 120 72 110 Z'
// Skycarrier's open wings are drawn a little smaller than they're laid out, about the shoulder, and raised a little,
// so the whole span stays well inside the picture (and the coloring page)
const OPEN = 'rotate(10 68 114) translate(70 112) scale(0.86) translate(-70 -112)'
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

/** A little loaf of bread, centred on (0, 0) and lying across, `h` from its middle to each end, with three cuts
 *  across its top (lines, so the coloring page leaves them thin). */
function Loaf({ h = 18, v = 8, crust, slash, line }: { h?: number; v?: number; crust: string; slash: string; line: string }) {
  return (
    <g>
      <path d={`M${-h} 1 C${-h} ${1.5 - v} ${-h * 0.6} ${-v} 0 ${-v} C${h * 0.6} ${-v} ${h} ${1.5 - v} ${h} 1 C${h} ${v - 1} ${h * 0.6} ${v} 0 ${v} C${-h * 0.6} ${v} ${-h} ${v - 1} ${-h} 1 Z`}
        fill={crust} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      {[-h / 2, 0, h / 2].map((x) => <line key={x} x1={x - 2.2} y1={1.5} x2={x + 2.2} y2={2 - v} stroke={slash} strokeWidth={2.6} strokeLinecap="round" />)}
    </g>
  )
}

export default function Raven({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `rg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  // Soft black, shining blue only where the light catches it; a dull charcoal when grumpy
  const body = useTones(g ? ['#8c8994', '#4f4d56', '#34333a'] : ['#5c6b9e', '#2b2e40', '#17181f'])
  const wing = useTones(g ? ['#86838f', '#47454e', '#302f35'] : ['#4f5c8c', '#24273a', '#131419'])
  const beak = useTones(g ? ['#aba7b0', '#6b6771', '#48464d'] : ['#9399b2', '#4b4f62', '#2a2c38'])
  const legs = useTones(g ? ['#8a8790', '#5a5862', '#3d3c43'] : ['#5f6378', '#34374a', '#1f2130'])
  const LINE = g ? '#26252b' : '#0f1018'
  const FEATHER = g ? '#6e6c76' : '#48537e' // the lines between its feathers, light enough to see on black
  const SHEEN = g ? '#b9b6c2' : '#86a2f0'
  const RIM = g ? '#efedf2' : '#f6f7ff'
  const CRUST = g ? '#c99e6e' : '#e8a256'
  const SLASH = g ? '#ecdcc4' : '#fde3b4'
  const WICKER = g ? '#c2a689' : '#d39a5a'
  const GOLD = '#ffe9a6'
  const crust = useShade(CRUST, 0.4, 0.15)
  const wicker = useShade(WICKER, 0.35, 0.15)
  const open = st >= 2 && !g // grumpy, Skycarrier keeps its wings folded and drooping too
  const outline = smooth(bodyPts(g ? 1.04 : 1))
  // Its little head tuft: soft feathers, fuller as it grows; ruffled up every which way when grumpy. [angle, length]
  const tuft: [number, number][] = g
    ? [[-38, 12], [-8, 15], [22, 13], [52, 10]]
    : st >= 1 ? [[-26, 13], [-6, 17], [16, 14]] : [[-16, 12], [8, 14]]
  const eyes = (
    <>
      {/* Big friendly eyes with bright rims (blinking with the eyes) */}
      {[-1, 1].map((side) => (
        <g key={side} className="pa-blink" style={{ '--d': '0.9s' } as CSSProperties}>
          <ellipse cx={100 + side * GAP * FACE_S} cy={FACE_Y} rx={(7.5 + 2.6) * FACE_S} ry={((g ? 5.5 : 9.5) + 2.6) * FACE_S} fill={RIM} />
        </g>
      ))}
      {/* (grumpy: a pale edge round its cross brows, so they show on its dark face) */}
      {g && (
        <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
          <path d="M-24 -13 L-8 -7 M24 -13 L8 -7" stroke="#cfcbd6" strokeWidth={6.6} strokeLinecap="round" fill="none" />
        </g>
      )}
      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={GAP} mood={mood} mouth={false} blinkDelay={0.9} />
      {/* (a little more pink in its cheeks, which would look muddy on black otherwise: the same ellipses as
          CuteFace's, so the coloring page doesn't change) */}
      <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
        {[-1, 1].map((side) => <ellipse key={side} cx={side * (GAP + 10)} cy={11} rx={6.5} ry={4.2} fill="#ff8fc4" opacity={0.5} />)}
      </g>
    </>
  )

  return (
    <g>
      <defs>
        {body.def}{wing.def}{beak.def}{legs.def}{crust.def}{wicker.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GOLD} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={GOLD} stopOpacity={0.45} />
          <stop offset="1" stopColor={GOLD} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Skycarrier's gentle glow all round it */}
      {open && <polygon points={ring(100, 116, 92, 86)} fill={`url(#${glowId})`} />}

      {/* Skycarrier's big wings, opened wide at its sides, flapping slowly */}
      {open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="95% 50%" delay={side > 0 ? 0.1 : 0}>
            <g transform={OPEN}>
              {FEATHERS.map(([x, y, a, l, w]) => (
                <g key={y} transform={`translate(${x} ${y}) rotate(${a})`}>
                  <path d={feather(l, w)} fill={wing.fill} stroke={LINE} strokeWidth={2.2} strokeLinejoin="round" />
                  <line x1={4} y1={0} x2={l - 5} y2={0} stroke={SHEEN} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
                </g>
              ))}
              <path d={COVERTS} fill={wing.fill} stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
              <polyline points="44 101 52 104 58 110" fill="none" stroke={SHEEN} strokeWidth={2} strokeLinecap="round" opacity={0.55} />
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
              <path d={TAIL_FAN} fill={wing.fill} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
              {TAIL_LINES.map((p) => <path key={p} d={`M${p}`} fill="none" stroke={FEATHER} strokeWidth={1.8} strokeLinecap="round" />)}
              <polyline points={`${pt(...tailAt(-9, 24))} ${pt(...tailAt(-10, TAIL_L - 8))}`} fill="none" stroke={SHEEN} strokeWidth={2.2} strokeLinecap="round" opacity={0.5} />
            </g>
          </g>
        </Anim>
      </g>

      {/* The fluffy little tuft on its head (behind it, so it grows out of it; under Skycarrier's crown) */}
      <Anim cls="pa-ear" origin="50% 100%" delay={0.6}>
        {st < 2 && tuft.map(([a, l]) => (
          <g key={a} transform={`translate(100 74) rotate(${a - 90})`}>
            <path d={feather(l, 8)} fill={body.fill} stroke={LINE} strokeWidth={2.2} strokeLinejoin="round" />
          </g>
        ))}
      </Anim>

      {/* Two dark legs with three round toes on each foot */}
      {[89, 111].map((x) => (
        <g key={x} fill={legs.fill} stroke={LINE} strokeWidth={2}>
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

      {/* The plump body, all soft black, with a blue sheen where the light catches it */}
      <g className="pa-breathe">
        <path d={outline} fill={body.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <polyline points="70 92 76 81 86 74" fill="none" stroke={SHEEN} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        <polyline points="62 126 63 139 68 150" fill="none" stroke={SHEEN} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
        <Shine x={80} y={82} rx={7} ry={4} />
      </g>

      {/* Wings folded at its sides (hanging lower when grumpy), flapping a little */}
      {!open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="80% 10%" delay={side > 0 ? 0.2 : 0}>
            <g transform={g ? 'rotate(10 66 102) translate(0 4)' : undefined}>
              <path d={WING} fill={wing.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
              {WING_LINES.map((p) => <path key={p} d={`M${p}`} fill="none" stroke={FEATHER} strokeWidth={1.8} strokeLinecap="round" />)}
              <polyline points="52 112 48 122 47 132" fill="none" stroke={SHEEN} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
            </g>
          </Anim>
        </g>
      ))}

      {/* Skycarrier's basket of bread, carried by its handle (the beak, drawn over it, holds the top of it) */}
      {st >= 2 && (
        <g>
          <path d="M80 147 C80 125 90 121 100 121 C110 121 120 125 120 147 L114.5 147 C114.5 130 108 127 100 127 C92 127 85.5 130 85.5 147 Z" fill={wicker.fill} stroke={ink(WICKER)} strokeWidth={2} strokeLinejoin="round" />
          <g transform="translate(100 146)">
            <g transform="translate(-8 -2) rotate(-16)"><Loaf crust={crust.fill} slash={SLASH} line={ink(CRUST)} /></g>
            <g transform="translate(9 -3) rotate(14) scale(0.9)"><Loaf crust={crust.fill} slash={SLASH} line={ink(CRUST)} /></g>
          </g>
          <path d="M78 146 H122 L118.5 162 Q100 167.5 81.5 162 Z" fill={wicker.fill} stroke={ink(WICKER)} strokeWidth={2.2} strokeLinejoin="round" />
          <path d="M80 152.5 H120" fill="none" stroke={ink(WICKER)} strokeWidth={1.6} opacity={0.6} />
          <path d="M81.5 158 H118.5" fill="none" stroke={ink(WICKER)} strokeWidth={1.6} opacity={0.6} />
          <rect x={75} y={143} width={50} height={6} rx={3} fill={wicker.fill} stroke={ink(WICKER)} strokeWidth={2} />
        </g>
      )}

      {/* Breadwing's little loaf, held in its beak by one end, the other end sticking out to the side */}
      {st === 1 && (
        <g transform="translate(110 126.5) rotate(8)">
          <Loaf h={15} v={6.5} crust={crust.fill} slash={SLASH} line={ink(CRUST)} />
        </g>
      )}

      {eyes}

      {/* Its beak: open a little round Breadwing's loaf (the top over it, the jaw under it), shut otherwise */}
      <path d={st === 1 ? BEAK_BITE : BEAK} fill={beak.fill} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
      {st === 1 && <path d={JAW} fill={beak.fill} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />}
      <polyline points="96 113.5 100 112.6 104 113.5" fill="none" stroke="#c9d2f2" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={g ? 0.4 : 0.6} />

      {st >= 2 && (
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
