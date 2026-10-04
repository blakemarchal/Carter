// Hopper → Leapsong → Meadowking: a cheerful little green grasshopper from the barley fields of Bethlehem, standing
// side-on (facing left) with his big round head turned to face you. Two antennae grow from the top of his head; his
// wings lie folded flat along his back; he has a pale tummy with soft stripes and six legs on the ground: two little
// ones at the front and two in the middle (the far side's peep out behind the near side's), and his two big jumping
// legs at the back, folded with their knees up high.
// Leapsong is bigger, with longer wings with a pale stripe and longer jumping legs, a daisy tucked by his antenna, and
// he sings (a music note bobs beside him). Meadowking keeps his daisy and his song; his wings are edged in gold like
// ripe barley, and he wears a crown.
// Grumpy (in battle, before he's befriended): a dull olive-grey, his antennae drooping, his cheeks stuffed full, and
// a stalk of barley he's gobbling hanging out of his mouth.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** A smooth closed outline through the points (Catmull-Rom). */
function smooth(ps: Pt[]) {
  const n = ps.length
  const at = (i: number) => ps[(i + n) % n]
  let d = `M${pt(...ps[0])}`
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    d += ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }
  return `${d}Z`
}

/** A smooth tapering tube along the curve a → (b) → c, width w0 at a up to w1 at c, with round ends. */
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

const GROUND = 177

// (Legs and antennae are filled shapes rather than thick lines, so they stay legs on the coloring page.)

/** A short little leg from its hip, bent at the knee, down to a round foot on the ground. */
function Leg({ hip, knee, foot, w, fill, line }: { hip: Pt; knee: Pt; foot: Pt; w: number; fill: string; line: string }) {
  return (
    <g>
      <path d={tube(hip, knee, [foot[0], foot[1] - 3], w, w * 0.85)} fill={fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={foot[0] - 2.5} cy={foot[1] - 2} rx={6.5} ry={4} fill={fill} stroke={line} strokeWidth={2.5} />
    </g>
  )
}

/**
 * A big jumping leg, folded up the way a grasshopper rests: a plump thigh from the hip up to the knee above his back,
 * and the thin shin folded back down under it to a foot on the ground.
 */
function JumpLeg({ hip, knee, foot, w, fill, line, stripe }: { hip: Pt; knee: Pt; foot: Pt; w: number; fill: string; line: string; stripe: string }) {
  const len = Math.hypot(knee[0] - hip[0], knee[1] - hip[1]), ux = (knee[0] - hip[0]) / len, uy = (knee[1] - hip[1]) / len
  const mid: Pt = [(hip[0] + knee[0]) / 2 + uy * 3, (hip[1] + knee[1]) / 2 - ux * 3] // the thigh bulges a little on top
  const shin = tube(knee, [(knee[0] + foot[0]) / 2 + 5, (knee[1] + foot[1]) / 2], [foot[0], foot[1] - 3], 6, 5.5)
  // little chevrons along the thigh, like a real grasshopper's
  const chev = [0.32, 0.52, 0.72].map((t) => {
    const x = hip[0] + (knee[0] - hip[0]) * t, y = hip[1] + (knee[1] - hip[1]) * t
    const ww = w * (0.36 - t * 0.14)
    return `M${pt(x + uy * ww - ux * 4, y - ux * ww - uy * 4)} L${pt(x + ux * 2, y + uy * 2)} L${pt(x - uy * ww - ux * 4, y + ux * ww - uy * 4)}`
  }).join(' ')
  return (
    <g>
      <path d={shin} fill={fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={foot[0] - 2.5} cy={foot[1] - 2} rx={7} ry={4.2} fill={fill} stroke={line} strokeWidth={2.5} />
      <path d={tube(hip, mid, knee, w, w * 0.48)} fill={fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
      <path d={chev} stroke={stripe} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
    </g>
  )
}

export default function Grasshopper({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const GREEN = g ? '#adb592' : '#8fd462'
  const FAR = g ? '#979f7e' : '#73b94c' // his legs on the far side, a shade darker
  const BELLY = g ? '#e4e6cf' : '#eef9bf'
  const WING = g ? '#8f9879' : '#5fae4d'
  const VEIN = g ? '#b7bea3' : '#b5e79a'
  const GOLD = g ? '#d3c9a4' : '#ffd34d'
  const BARLEY = '#e9c46a'
  const NOTE = '#2fb67a' // Kindness green
  const green = useShade(GREEN, 0.4, 0.14)
  const far = useShade(FAR, 0.3, 0.14)
  const belly = useShade(BELLY, 0.5, 0.06)
  const wing = useShade(WING, 0.35, 0.15)
  const line = ink(GREEN)
  const farLine = ink(FAR)

  // He grows longer, with longer wings and bigger jumping legs
  const L = [168, 172, 176][st] // the tip of his tummy
  const kneeY = [110, 106, 102][st]
  const thigh = [19, 21, 23][st]
  const BODY: Pt[] = [[108, 100], [132, 98], [156, 104], [L - 4, 114], [L, 126], [L - 6, 138], [150, 148], [126, 152], [106, 148], [96, 132], [98, 112]]
  const WINGS = `M111 102 C132 90 ${L - 20} 96 ${L + 8} 122 C${L - 10} 128 ${L - 44} 128 115 120 Z`
  const VEINS = `M119 110 C139 102 ${L - 24} 107 ${L + 1} 122 M136 105 C148 102 ${L - 14} 107 ${L - 4} 113`
  // [hip, knee, foot] of the little legs, near side and far side
  const front: [Pt, Pt, Pt] = [[106, 145], [94, 158], [91, GROUND]]
  const middle: [Pt, Pt, Pt] = [[123, 151], [123, 164], [118, GROUND]]
  const farFront: [Pt, Pt, Pt] = [[113, 144], [103, 157], [102, GROUND - 2]]
  const farMiddle: [Pt, Pt, Pt] = [[132, 149], [134, 162], [130, GROUND - 2]]
  // The big jumping legs at the back
  const jump = { hip: [127, 145] as Pt, knee: [L - 2, kneeY] as Pt, foot: [148, GROUND] as Pt }
  const farJump = { hip: [136, 141] as Pt, knee: [L + 5, kneeY - 5] as Pt, foot: [162, GROUND - 2] as Pt }
  // Antennae from the top of his head (drooping forward when grumpy), longer as he grows
  const reach = [0, 5, 9][st]
  const antennae: [Pt, Pt, Pt][] = g
    ? [[[91, 60], [80, 46], [66, 58]], [[109, 60], [118, 44], [133, 54]]]
    : [[[91, 60], [84, 38 - reach * 0.6], [70 - reach, 30 - reach * 0.5]], [[109, 60], [116, 38 - reach * 0.6], [130 + reach, 30 - reach * 0.5]]]

  return (
    <g>
      <defs>{green.def}{far.def}{belly.def}{wing.def}</defs>

      {/* The far side's legs, peeping out behind his body */}
      <JumpLeg {...farJump} w={thigh - 2} fill={far.fill} line={farLine} stripe={ink(FAR)} />
      <Leg hip={farFront[0]} knee={farFront[1]} foot={farFront[2]} w={6.5} fill={FAR} line={farLine} />
      <Leg hip={farMiddle[0]} knee={farMiddle[1]} foot={farMiddle[2]} w={6.5} fill={FAR} line={farLine} />

      {/* His body, with a pale striped tummy, and his wings folded flat along his back */}
      <g className="pa-breathe">
        <path d={smooth(BODY)} fill={green.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M100 134 Q126 150 ${L - 6} 132 Q${L - 14} 145 150 148 Q126 152 106 147 Z`} fill={belly.fill} />
        {[118, 132, 146].map((x) => (
          <path key={x} d={`M${x} ${139 + (x - 118) * 0.03} q2.5 4.5 0 8.5`} stroke={ink(BELLY)} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.6} />
        ))}
        <path d={WINGS} fill={wing.fill} stroke={ink(WING)} strokeWidth={2.6} strokeLinejoin="round" />
        {st >= 1 && <path d={`M118 116 C138 109 ${L - 26} 112 ${L + 3} 121 C${L - 28} 120 138 119 118 116 Z`} fill={VEIN} opacity={0.75} />}
        <path d={VEINS} stroke={st >= 2 ? GOLD : VEIN} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.85} />
        {st >= 2 && <path d={`M113 103 C133 92 ${L - 21} 98 ${L + 7} 121`} stroke={GOLD} strokeWidth={2.6} fill="none" strokeLinecap="round" />}
      </g>

      {/* His near legs: two little ones in front, and the big jumping leg at the back */}
      <Leg hip={front[0]} knee={front[1]} foot={front[2]} w={7} fill={GREEN} line={line} />
      <Leg hip={middle[0]} knee={middle[1]} foot={middle[2]} w={7} fill={GREEN} line={line} />
      <JumpLeg {...jump} w={thigh} fill={green.fill} line={line} stripe={ink(GREEN)} />

      {/* Antennae, twitching (behind his head, so they grow from it) */}
      {antennae.map(([a, b, c], i) => (
        <Anim key={i} cls="pa-ear" origin={i ? '0% 100%' : '100% 100%'} delay={i * 0.5}>
          <path d={tube(a, b, c, 3.4, 2.6)} fill={GREEN} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
          <circle cx={c[0]} cy={c[1]} r={4} fill={green.fill} stroke={line} strokeWidth={2} />
        </Anim>
      ))}

      {/* His big round head (cheeks stuffed full of grain when he's grumpy) */}
      <ellipse cx={100} cy={82} rx={31} ry={28} fill={green.fill} stroke={line} strokeWidth={3} />
      <ellipse cx={100} cy={97} rx={20} ry={10} fill={BELLY} opacity={0.45} />
      <Shine x={86} y={64} rx={8} ry={4.5} />
      {g && [-1, 1].map((side) => (
        <path key={side} d={`M${100 + side * 13} 89 A11 11 0 1 ${side > 0 ? 1 : 0} ${100 + side * 14} 108`} fill={green.fill} stroke={line} strokeWidth={2.6} />
      ))}

      {/* Leapsong's daisy, tucked by his antenna */}
      {st >= 1 && (
        <g transform={st >= 2 ? 'translate(123 66) scale(0.9)' : 'translate(117 62)'}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse key={a} cx={0} cy={-5} rx={2.6} ry={4.6} fill="#fff" stroke="#d9d2c0" strokeWidth={1} transform={`rotate(${a})`} />
          ))}
          <circle r={3.4} fill={GOLD} stroke="#d29a00" strokeWidth={1.2} />
        </g>
      )}

      <CuteFace x={100} y={84} s={0.85} gap={15} mood={mood} blinkDelay={0.4} />

      {/* Grumpy: a stalk of barley he's gobbling, hanging out of the side of his mouth */}
      {g && (
        <g>
          <path d="M96 101 Q86 108 77 116" stroke="#c4a35e" strokeWidth={2.8} fill="none" strokeLinecap="round" />
          <g transform="translate(76 117) rotate(42)">
            {[0, 1, 2, 3, 4].map((k) => (
              <g key={k}>
                <ellipse cx={-3.2} cy={3 + k * 5.4} rx={3.3} ry={4.6} fill={BARLEY} stroke="#b88a2a" strokeWidth={1.3} transform={`rotate(-22 ${-3.2} ${3 + k * 5.4})`} />
                <ellipse cx={3.2} cy={5.6 + k * 5.4} rx={3.3} ry={4.6} fill={BARLEY} stroke="#b88a2a" strokeWidth={1.3} transform={`rotate(22 3.2 ${5.6 + k * 5.4})`} />
              </g>
            ))}
            <path d="M-2 31 L-5 41 M1 32 L1 43 M4 31 L7 41" stroke="#c9a24e" strokeWidth={1.3} strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* He sings as he grows: a music note bobbing up beside him */}
      {st >= 1 && !g && (
        <Anim cls="pa-float" delay={0.3}>
          <g transform={`translate(${st >= 2 ? '56 98' : '58 84'}) rotate(-8)`} fill={NOTE} stroke={ink(NOTE)} strokeWidth={1.4} strokeLinejoin="round">
            <path d="M0 0 V-19 Q8 -16 9 -8" fill="none" strokeWidth={3.2} stroke={NOTE} strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx={-4} cy={0.5} rx={5} ry={3.8} transform="rotate(-20 -4 0.5)" />
          </g>
        </Anim>
      )}

      {st >= 2 && (
        <>
          <Crown x={100} y={58} />
          {!g && [[38, 62, 7], [176, 52, 7], [30, 150, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
