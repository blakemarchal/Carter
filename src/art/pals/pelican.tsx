// Gulp → Pouchbill → Netkeeper: a big, friendly white pelican, round and plump, turned a little toward our left with
// its face toward you: a round head on a round body, a long golden beak with a rounded tip, and a soft, stretchy
// peach pouch hanging under it. Its cream wings are folded at its sides (the one on our left peeping out from under
// the pouch), a short tail sticks out low at its back (our right), and it stands on two short legs with orange webbed
// feet. Gulp has a small crest of soft head feathers at the back of its head.
// Its beak always stays shut: the little fish in this story is its friend. Pouchbill's crest is fuller, and its
// happy little fish friend leaps and splashes in a puddle by its feet. Netkeeper has the fullest crest and wears a
// fishing net like a little cape (tied round its neck with a rope, hanging down behind it at its back, with little
// floats along its edge); the fish rides along in a pocket of the net on its back, peeking out over its shoulder.
// Netkeeper glows softly and wears a crown.
// Grumpy: a dull grey, its pouch puffed out greedily under its throat (and shut), its feathers ruffled every which
// way (its head and body bumpy, its crest sticking out all over), with cross brows, and no fish anywhere.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

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

/** A soft feather from its root at (0, 0) out to its rounded tip at (l, 0), w wide. */
const feather = (l: number, w: number) =>
  `M0 ${-w * 0.3} C${l * 0.4} ${-w * 0.55} ${l * 0.8} ${-w * 0.55} ${l} ${-w * 0.2} Q${l + 2.5} 0 ${l} ${w * 0.2} C${l * 0.8} ${w * 0.55} ${l * 0.4} ${w * 0.55} 0 ${w * 0.3} Z`

const FACE_Y = 70
const FACE_S = 0.8
const BX = 106, BY = 126 // the middle of the body
const MIRROR = `translate(${2 * BX} 0) scale(-1 1)`

/** The plump body, egg-shaped (a little wider at the bottom); `puff` widens it, and ruffled feathers make its
 *  edge bumpy. */
function bodyPath(puff: number, ruffled: boolean) {
  const ps: Pt[] = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180
    return [BX + 50 * puff * Math.cos(a) * (1 + 0.08 * Math.sin(a)), BY + 41 * Math.sin(a)]
  })
  if (!ruffled) return smooth(ps)
  const fluffy: Pt[] = []
  ps.forEach((p, i) => {
    const q = ps[(i + 1) % ps.length]
    const m: Pt = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    const out = Math.hypot(m[0] - BX, m[1] - BY)
    fluffy.push(p, [m[0] + ((m[0] - BX) / out) * 4, m[1] + ((m[1] - BY) / out) * 4])
  })
  return smooth(fluffy)
}

// Its round head, turned a little to our left (so its face sits a little left of the middle of it)
const HEAD = { x: 104, y: 70, r: 29 }
/** Its head with its feathers ruffled up: a bumpy circle. */
function headPath(ruffled: boolean) {
  const n = ruffled ? 18 : 12
  return smooth(Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const r = HEAD.r + (ruffled && i % 2 ? 3 : 0)
    return [HEAD.x + Math.cos(a) * r, HEAD.y + Math.sin(a) * r] as Pt
  }))
}
// The long beak, from the bottom of its face out to a rounded tip that curls down a little (always shut)
const BILL = 'M106 86 C84 84 54 91 32 102 Q22 106.5 23 113 Q24.5 118 30 115 Q32.5 110.5 36 109 C56 101 82 96 106 96 A5 5 0 0 0 106 86 Z'
const NAIL = 'M32 102 Q22 106.5 23 113 Q24.5 118 30 115 Q32.5 110.5 36 109 Q31 106 32 102 Z'
// The soft, stretchy pouch hanging under the beak, deepest by its throat: gently full, or puffed out greedily
// when grumpy
const POUCH = 'M106 94 C84 97 56 103 36 110 C44 119 58 126 76 128.5 C93 130.5 105 124 111 111 Z'
const POUCH_LINES = 'M52 116 Q72 125 100 118 M68 124 Q86 127 104 119'
const POUCH_FULL = 'M106 94 C84 97 56 103 36 110 C44 116 54 119 64 120 C56 130 56 150 70 158 C84 166 108 162 114 146 C120 130 117 114 111 106 Z'
const POUCH_FULL_LINES = 'M64 136 Q86 148 113 135 M68 149 Q88 158 110 149'

// The left wing, folded at its side, with three round feather tips at the bottom (the right one is its mirror image)
const WING = 'M70 107 C58 110 50 120 48 133 C46 143 47 152 50 159 A4.2 4.2 0 0 0 56.5 163.5 A4.2 4.2 0 0 0 63.5 162 A4.2 4.2 0 0 0 68.5 156 C71.5 147 74 137 74 126 C74 117 73 111 70 107 Z'
const WING_LINES = ['56 140 54.5 160', '62.5 142 61 160.5']
// The short tail at its back: three soft feathers [angle, length, width] from under its body
const TAIL: [number, number, number][] = [[-8, 31, 14], [10, 34, 15], [28, 30, 14]]
// Its crest: soft feathers growing out of the back of its head, sweeping up and back, fuller as it grows; ruffled
// up every which way when grumpy. [root x, root y, angle, length]
const CRESTS: [number, number, number, number][][] = [
  [[112, 47, -78, 14], [118, 50, -48, 12]],
  [[110, 46, -86, 18], [116, 48, -60, 17], [122, 52, -34, 14]],
  [[114, 48, -84, 21], [119, 50, -62, 21], [124, 54, -40, 19], [128, 60, -18, 14]],
]
const RUFFLED: [number, number, number, number][] = [[100, 45, -112, 12], [108, 44, -84, 15], [116, 48, -52, 14], [123, 54, -20, 12]]

// Netkeeper's fishing net, worn like a little cape: tied round its neck, hanging down behind it at its back (our
// right) and flaring out at the bottom, with little floats along its edge
const CAPE = 'M116 88 C134 90 152 100 164 116 C176 132 184 148 188 160 Q189 167 182 168 Q172 173 162 167 Q152 173 142 167 Q134 171 128 166 C118 136 112 108 116 88 Z'
const CAPE_FLOATS: Pt[] = [[183, 167.5], [146, 169]]

// Pouchbill's little fish friend, leaping and splashing in a puddle on the ground by its feet (left of them, well
// below its beak): the puddle and a ripple round it, the fish leaping up out of it head first, and splashes
const PUDDLE = { x: 40, y: 178.5, rx: 21, ry: 5.2 }
const LEAP = 'translate(30.6 156.6) rotate(45)' // (the fish's tail tip in the water at (50, 176), its head up at (22, 148))
const DROPS: [number, number, number][] = [[57, 165, 2.2], [62, 172.5, 1.6], [16, 160, 1.8], [12, 169, 1.4]]
// Netkeeper's fish, riding in a pocket of its net on its back, peeking out over its shoulder: the pocket (behind its
// body, so only its top shows, above its shoulder), with a rope round its top edge, and the fish in it
const POCKET = 'M124 91 Q145 99 167 93 C171 104 168 116 158 122 C146 128 130 124 126 112 C123 104 122 97 124 91 Z'
const POCKET_RIM = 'M124 91 Q145 99 167 93'
const RIDE = 'translate(146 89) rotate(-55) scale(-1.12 1.12)' // (facing out, its head up by its shoulder at (154, 78))

/** A happy little fish, its head at the left. */
function Fish({ fill, line }: { fill: string; line: string }) {
  return (
    <g>
      <path d="M17 0 L26 -6 Q27.5 0 26 6 Z" fill={fill} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M-12 0 C-12 -6 -5 -8.5 3 -8 C11 -7.5 17 -4 19 0 C17 4 11 7.5 3 8 C-5 8.5 -12 6 -12 0 Z" fill={fill} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M0 -8 Q5 -13 11 -7" fill={fill} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={-5} cy={-2.2} r={2.9} fill="#2b2140" />
      <circle cx={-6} cy={-3.3} r={1.1} fill="#fff" />
      <ellipse cx={-1.5} cy={3} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.6} />
      <polyline points="-10.5 2.5 -8 4.2 -5.5 3.4" fill="none" stroke="#2b2140" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

export default function Pelican({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '')
  const glowId = `pg${ids}`
  const capeClip = `pc${ids}`
  const pocketClip = `pp${ids}`
  const WHITE = g ? '#d8d3d4' : '#fbf6ec'
  const WINGC = g ? '#cbc5c8' : '#f0e7d8'
  const LINE = g ? '#8c8389' : '#b39c84' // a warm grey-brown outline (the dove's is blue)
  const CREST = g ? '#cfc8c4' : '#fff0c2'
  const BILLC = g ? '#d7c08e' : '#ffc451'
  const NAILC = g ? '#c9a37e' : '#ff9a3c'
  const POUCHC = g ? '#d6a493' : '#ffab7c'
  const FEET = g ? '#c9a289' : '#ff9a3c'
  const FISH = '#5fb7ff'
  const NET = '#b98b52'
  const FLOAT = '#ff6a4d'
  const GLOW = '#ffd99a'
  const body = useShade(WHITE, 0.6, 0.12)
  const wing = useShade(WINGC, 0.45, 0.14)
  const crest = useShade(CREST, 0.5, 0.1)
  const bill = useShade(BILLC, 0.4, 0.12)
  const pouch = useShade(POUCHC, 0.35, 0.14)
  const fish = useShade(FISH, 0.4, 0.12)
  const caped = st >= 2
  // Pouchbill's fish friend splashes in a puddle by its feet; Netkeeper's rides in its net. (Grumpy, there's no fish.)
  const splashing = st === 1 && !g
  const riding = caped && !g
  const crests = g ? RUFFLED : CRESTS[st]

  return (
    <g>
      <defs>
        {body.def}{wing.def}{crest.def}{bill.def}{pouch.def}{fish.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
        <clipPath id={capeClip}><path d={CAPE} /></clipPath>
        <clipPath id={pocketClip}><path d={POCKET} /></clipPath>
      </defs>

      {/* Netkeeper's soft glow all round it */}
      {caped && !g && <polygon points={ring(104, 114, 94, 86)} fill={`url(#${glowId})`} />}

      {/* Netkeeper's net cape, flaring out behind it: you can see through the net to the glow behind */}
      {caped && (
        <g>
          <path d={CAPE} fill={g ? '#d9cfc2' : '#f6e3c4'} fillOpacity={0.55} stroke={ink(NET)} strokeWidth={2.4} strokeLinejoin="round" />
          <g clipPath={`url(#${capeClip})`}>
            {Array.from({ length: 22 }, (_, i) => 60 + i * 9).map((x) => (
              <g key={x}>
                <polyline points={`${x - 48} 80 ${x + 48} 176`} fill="none" stroke={NET} strokeWidth={1.5} opacity={0.85} />
                <polyline points={`${x + 48} 80 ${x - 48} 176`} fill="none" stroke={NET} strokeWidth={1.5} opacity={0.85} />
              </g>
            ))}
          </g>
          {CAPE_FLOATS.map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx={4.6} ry={3.6} fill={FLOAT} stroke={ink(FLOAT)} strokeWidth={1.6} />)}
          {/* The fish riding in a pocket of the net on its back, peeking out happily over its shoulder (you can see
              the rest of it through the net) */}
          {riding && (
            <g>
              <g transform={RIDE}><Fish fill={fish.fill} line={ink(FISH)} /></g>
              <path d={POCKET} fill="#f6e3c4" fillOpacity={0.55} stroke={ink(NET)} strokeWidth={2} strokeLinejoin="round" />
              <g clipPath={`url(#${pocketClip})`}>
                {Array.from({ length: 9 }, (_, i) => 118 + i * 7).map((x) => (
                  <g key={x}>
                    <polyline points={`${x - 20} 88 ${x + 20} 128`} fill="none" stroke={NET} strokeWidth={1.4} opacity={0.85} />
                    <polyline points={`${x + 20} 88 ${x - 20} 128`} fill="none" stroke={NET} strokeWidth={1.4} opacity={0.85} />
                  </g>
                ))}
              </g>
              <path d={POCKET_RIM} fill="none" stroke={ink(NET)} strokeWidth={5.6} strokeLinecap="round" />
              <path d={POCKET_RIM} fill="none" stroke="#e2b878" strokeWidth={3} strokeLinecap="round" />
            </g>
          )}
        </g>
      )}

      {/* The short tail at its back, wagging a little */}
      <Anim cls="pa-tail" origin="0% 50%" delay={0.3}>
        {TAIL.map(([a, l, w]) => (
          <path key={a} d={feather(l, w)} transform={`translate(140 155) rotate(${a + (g ? (a - 10) / 3 : 0)})`} fill={wing.fill} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
        ))}
      </Anim>

      {/* Its crest of soft head feathers (behind its head, so they grow out of it) */}
      <Anim cls="pa-ear" origin="30% 100%" delay={0.6}>
        {crests.map(([x, y, a, l]) => (
          <path key={`${x}${a}`} d={feather(l, 8)} transform={`translate(${x} ${y}) rotate(${a})`} fill={crest.fill} stroke={LINE} strokeWidth={2.2} strokeLinejoin="round" />
        ))}
      </Anim>

      {/* Two short legs with orange webbed feet, pointing the way it faces */}
      {[93, 119].map((x) => (
        <g key={x} fill={FEET} stroke={ink(FEET)} strokeWidth={2} strokeLinejoin="round">
          <rect x={x - 3.5} y={154} width={7} height={20} rx={3.5} />
          <path d={`M${x + 4} 172 C${x - 2} 170.5 ${x - 11} 172 ${x - 17} 175.5 Q${x - 21} 178.5 ${x - 16.5} 180 Q${x - 13} 182 ${x - 9.5} 179.6 Q${x - 6} 182 ${x - 2.5} 179.6 Q${x + 1.5} 181.5 ${x + 5} 178 Q${x + 7.5} 175 ${x + 4} 172 Z`} />
          <polyline points={`${x - 1} 174 ${x - 13} 178.5`} fill="none" stroke={ink(FEET)} strokeWidth={1.3} opacity={0.6} />
          <polyline points={`${x} 174.5 ${x - 5.5} 179`} fill="none" stroke={ink(FEET)} strokeWidth={1.3} opacity={0.6} />
        </g>
      ))}

      {/* The plump white body (bumpy with ruffled feathers when grumpy) */}
      <g className="pa-breathe">
        <path d={bodyPath(g ? 1.04 : 1, g)} fill={body.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <Shine x={128} y={104} rx={8} ry={4.5} rot={30} />
      </g>

      {/* Wings folded at its sides, flapping a little */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="80% 10%" delay={side > 0 ? 0.2 : 0}>
            <g transform={g ? 'rotate(8 70 107) translate(0 3)' : undefined}>
              <path d={WING} fill={wing.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
              {WING_LINES.map((p) => <polyline key={p} points={p} fill="none" stroke={LINE} strokeWidth={1.8} strokeLinecap="round" />)}
            </g>
          </Anim>
        </g>
      ))}

      {/* Pouchbill's little fish friend, leaping and splashing in a puddle by its feet */}
      {splashing && (
        <g>
          <ellipse cx={PUDDLE.x} cy={PUDDLE.y} rx={PUDDLE.rx + 6} ry={PUDDLE.ry + 2.4} fill="none" stroke={FISH} strokeWidth={1.8} opacity={0.6} />
          <ellipse cx={PUDDLE.x} cy={PUDDLE.y} rx={PUDDLE.rx} ry={PUDDLE.ry} fill="#cdeaff" stroke={FISH} strokeWidth={2} />
          <ellipse cx={49} cy={177} rx={7.5} ry={2.2} fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.9} />
          <g transform={LEAP}><Fish fill={fish.fill} line={ink(FISH)} /></g>
          {DROPS.map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="#9fd8ff" stroke={FISH} strokeWidth={1} />)}
        </g>
      )}

      {/* Netkeeper's rope, tied round its neck */}
      {caped && (
        <g>
          <path d="M100 104 Q118 106 136 94" fill="none" stroke={ink(NET)} strokeWidth={6.5} strokeLinecap="round" />
          <path d="M100 104 Q118 106 136 94" fill="none" stroke={g ? '#cdb89c' : '#e2b878'} strokeWidth={3.6} strokeLinecap="round" />
          <path d="M118 106 Q116 113 119 118 M118 106 Q123 112 125 116" fill="none" stroke={ink(NET)} strokeWidth={5.4} strokeLinecap="round" />
          <path d="M118 106 Q116 113 119 118 M118 106 Q123 112 125 116" fill="none" stroke={g ? '#cdb89c' : '#e2b878'} strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={118} cy={105} r={4.4} fill={g ? '#cdb89c' : '#e2b878'} stroke={ink(NET)} strokeWidth={1.8} />
        </g>
      )}

      {/* Its round head */}
      {g
        ? <path d={headPath(true)} fill={body.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        : <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={body.fill} stroke={LINE} strokeWidth={3} />}
      <Shine x={93} y={55} rx={8} ry={4.5} />
      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={15} mood={mood} mouth={false} blinkDelay={1.1} />

      {/* The soft, stretchy pouch under its beak (puffed out greedily when grumpy) */}
      <path d={g ? POUCH_FULL : POUCH} fill={pouch.fill} stroke={ink(POUCHC)} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={g ? POUCH_FULL_LINES : POUCH_LINES} fill="none" stroke={ink(POUCHC)} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
      {g && <Shine x={74} y={131} rx={7} ry={4} />}

      {/* Its long beak, shut, with a rounded tip */}
      <path d={BILL} fill={bill.fill} stroke={ink(BILLC)} strokeWidth={2.2} strokeLinejoin="round" />
      <path d={NAIL} fill={NAILC} opacity={0.75} />
      <polyline points="48 95.5 70 89.5 94 88" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.55} />

      {st >= 2 && (
        <>
          <Crown x={102} y={48} />
          {!g && [[24, 54, 8], [178, 58, 7], [156, 24, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
