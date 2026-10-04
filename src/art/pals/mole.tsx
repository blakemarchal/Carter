// Digger → Burrowpaw → Tunnelheart: a little velvety mole in soft grey-plum fur, standing up on his little pink
// back feet beside the molehill he dug, facing you. A round pink nose on a short snout, two small bright eyes, a
// tuft of fur on his head, a pale tummy, big pink front paws held up to say hello (with round, blunt claws), and
// a short pink tail peeking out at his back.
// Burrowpaw has a pink flower growing on his molehill; Tunnelheart's molehill has a ring of flowers round it, he
// glows softly, and he wears a crown.
// Grumpy (in battle, before he's befriended): duller fur, a smudge of dirt on his head, his arms crossed, and a
// cross frown.
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

/** An ellipse's outline as polygon points. Soft glows are drawn as polygons, so the coloring page (which turns
 *  every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A furry arm: a tube w wide from a to b, with round ends. */
function capsule(a: Pt, b: Pt, w: number) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const len = Math.hypot(dx, dy) || 1
  const [nx, ny] = [(-dy / len) * (w / 2), (dx / len) * (w / 2)]
  const r = w / 2
  return `M${pt(a[0] + nx, a[1] + ny)} L${pt(b[0] + nx, b[1] + ny)} A${r} ${r} 0 0 0 ${pt(b[0] - nx, b[1] - ny)} L${pt(a[0] - nx, a[1] - ny)} A${r} ${r} 0 0 0 ${pt(a[0] + nx, a[1] + ny)}Z`
}

const GROUND = 181
// His body, one soft bean from the top of his head down to his bottom (moles have no neck)
const BODY = smooth([[100, 54], [121, 58], [136, 72], [141, 94], [143, 118], [147, 142], [142, 162], [124, 173], [100, 175], [76, 173], [58, 162], [53, 142], [57, 118], [59, 94], [64, 72], [79, 58]])
// The molehill beside him (behind, on the right): a lumpy mound of earth, its clods drawn into its outline
const HILL = smooth([[116, 183], [118, 168], [125, 154], [135, 142], [147, 133], [160, 127], [172, 127], [181, 134], [187, 148], [189, 166], [189, 183], [152, 184]])
const LUMPS: [number, number, number][] = [[131, 147, 6.5], [146, 136, 7], [161, 129, 7.5], [175, 130, 7], [184, 143, 6.5], [188, 160, 5.5]]
const CRUMBS: [number, number, number][] = [[160, 146, 3], [176, 153, 2.6], [148, 160, 2.4], [181, 170, 2.8], [165, 168, 2.2], [138, 171, 2.5], [112, 181, 2.2]]
// Flowers, from where they grow: [x, y, size, colour]; Burrowpaw's on top of the molehill, Tunnelheart's in a
// ring round it and him
const FLOWERS: [number, number, number, string][][] = [
  [],
  [[174, 128, 1, '#ff8fc0']],
  [[175, 128, 1.05, '#ff8fc0'], [187, 150, 0.75, '#fff2a8'], [181, 183, 0.8, '#ffb3d6'], [148, 184, 0.7, '#fff2a8'], [26, 182, 0.8, '#ffb3d6'], [44, 186, 0.65, '#ff8fc0']],
]

const FINGERS = [-44, -22, 0, 22, 44]
/** A big front paw, its palm at (0, 0) and its five fingers up, each with a round, blunt claw. The palm and
 *  fingers are one shape (outlines first, then the pink over the lines inside). */
function Paw({ fill, line, claw }: { fill: string; line: string; claw: string }) {
  const parts = (stroke: boolean) => (
    <g fill={fill} stroke={stroke ? line : 'none'} strokeWidth={5}>
      <ellipse cx={0} cy={0} rx={13.5} ry={12.5} />
      {FINGERS.map((a) => <ellipse key={a} cx={0} cy={-12.5} rx={4.4} ry={6.5} transform={`rotate(${a})`} />)}
    </g>
  )
  return (
    <g>
      {FINGERS.map((a) => <ellipse key={a} cx={0} cy={-18.5} rx={2.9} ry={3.3} fill={claw} stroke={line} strokeWidth={1.8} transform={`rotate(${a})`} />)}
      {parts(true)}
      {parts(false)}
      <ellipse cx={-2} cy={1} rx={6} ry={4.5} fill="#fff" opacity={0.3} />
    </g>
  )
}

/** A little flower with five round petals on a short stem with a leaf, growing up from (0, 0). */
function Flower({ color, g }: { color: string; g: boolean }) {
  const petal = g ? '#cbbcc4' : color
  return (
    <g>
      <path d="M0 0 Q-2 -10 0 -20" stroke={g ? '#8f9a86' : '#4fae5a'} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M0 -6 Q7 -14 13 -11 Q8 -4 0 -6 Z" fill={g ? '#a4ae98' : '#6ccf6a'} stroke={g ? '#7d8774' : '#3f9a4a'} strokeWidth={1.5} strokeLinejoin="round" />
      <g transform="translate(0 -22)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-6} rx={4.6} ry={6.2} fill={petal} stroke={ink(petal)} strokeWidth={1.5} transform={`rotate(${a})`} />
        ))}
        <circle r={3.6} fill={g ? '#d8cfa8' : '#ffd34d'} stroke={g ? '#a89f7c' : '#e0a800'} strokeWidth={1.2} />
      </g>
    </g>
  )
}

export default function Mole({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.min(stage, 2)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const glowGrad = `mg${uid}`
  const FUR = g ? '#8d8590' : '#8f7a9c' // soft grey-plum
  const TUMMY = g ? '#c4bec6' : '#cdbcd6'
  const PINK = g ? '#e3b3bd' : '#ffadc6' // his nose, paws, feet and tail
  const CLAW = g ? '#efe6e0' : '#fff3e6'
  const SOIL = g ? '#9b7d66' : '#a87450'
  const GLOW = '#ffd6ea'
  const fur = useShade(FUR, 0.38, 0.16)
  const tummy = useShade(TUMMY, 0.45, 0.06)
  const pink = useShade(PINK, 0.35, 0.12)
  const soil = useShade(SOIL, 0.3, 0.2)
  const snout = useShade(g ? '#b8aeb6' : '#c7b2cc', 0.45, 0.1)
  const line = ink(FUR)
  const pinkLine = ink(PINK)
  const paw = { fill: pink.fill, line: pinkLine, claw: CLAW }
  return (
    <g>
      <defs>
        {fur.def}{tummy.def}{pink.def}{soil.def}{snout.def}
        <radialGradient id={glowGrad}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.95} />
          <stop offset="0.55" stopColor={GLOW} stopOpacity={0.5} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Tunnelheart's soft glow */}
      {st >= 2 && !g && <polygon points={ring(104, 118, 92, 80)} fill={`url(#${glowGrad})`} />}

      {/* The molehill, lumpy with clods of earth, and crumbs */}
      <g fill={soil.fill} stroke={ink(SOIL)} strokeWidth={6} strokeLinejoin="round">
        <path d={HILL} />
        {LUMPS.map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} />)}
      </g>
      <g fill={soil.fill}>
        <path d={HILL} />
        {LUMPS.map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} />)}
      </g>
      {CRUMBS.map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill={ink(SOIL)} opacity={0.5} />)}
      {FLOWERS[st].map(([x, y, k, c]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${k})`}><Flower color={c} g={g} /></g>
      ))}

      {/* His short pink tail, curling out at his back */}
      <path d="M68 161 C60 163 50 162 44 152 A3.2 3.2 0 0 0 38.5 155 C44 166 56 171 68 171 Z" fill={pink.fill} stroke={pinkLine} strokeWidth={2.4} strokeLinejoin="round" />

      {/* Little pink back feet, on the ground */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <ellipse cx={100 + side * 17} cy={GROUND - 5.5} rx={12} ry={6} fill={pink.fill} stroke={pinkLine} strokeWidth={2.5} />
          <path d={`M${100 + side * 17 - 4} ${GROUND - 9} v4 M${100 + side * 17 + 4} ${GROUND - 9} v4`} stroke={pinkLine} strokeWidth={1.8} strokeLinecap="round" />
        </g>
      ))}

      {/* A tuft of fur on his head */}
      <path d="M90 60 C86 50 92 44 97 49 C98 42 106 41 107 48 C112 45 116 51 111 60 Z" fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />

      {/* His soft velvety body, with a pale tummy */}
      <g className="pa-breathe">
        <path d={BODY} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={100} cy={146} rx={31} ry={25} fill={tummy.fill} stroke={ink(TUMMY)} strokeWidth={2} />
        <Shine x={80} y={70} rx={9} ry={5} />
      </g>

      {/* Two small bright eyes, his snout with its round pink nose, and a smile (a frown when grumpy) */}
      <CuteFace x={100} y={89} s={0.8} gap={15} mood={mood} mouth={false} blinkDelay={1.4} />
      <ellipse cx={100} cy={108} rx={14} ry={10.5} fill={snout.fill} stroke={ink(g ? '#b8aeb6' : '#c7b2cc')} strokeWidth={2} />
      <ellipse cx={100} cy={103.5} rx={8.5} ry={6.8} fill={pink.fill} stroke={pinkLine} strokeWidth={2} />
      <ellipse cx={97.5} cy={101.5} rx={2.6} ry={1.8} fill="#fff" opacity={0.85} />
      <path d={g ? 'M95 117 Q100 112.5 105 117' : 'M100 110.5 V112.5 M95.5 113.5 Q97.8 116.5 100 112.5 Q102.2 116.5 104.5 113.5'}
        stroke="#5a3a4a" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* A smudge of dirt on his head when he's grumpy */}
      {g && (
        <g fill="#86593a" opacity={0.6}>
          <path d="M107 70 C110 64.5 120 63.5 126 67 C130 69.5 128.5 74 123 74.5 C117 75 108 75 107 70 Z" />
          <circle cx={131} cy={73} r={1.6} /><circle cx={104} cy={66} r={1.4} /><circle cx={112} cy={78.5} r={1.2} />
        </g>
      )}

      {/* Big pink front paws: held up to say hello, or (grumpy) arms crossed in front of him */}
      {g ? (
        <g>
          <path d={capsule([62, 124], [126, 136], 19)} fill={fur.fill} stroke={line} strokeWidth={2.8} />
          <g transform="translate(132 130) rotate(70) scale(0.85)"><Paw {...paw} /></g>
          <path d={capsule([138, 124], [74, 140], 19)} fill={fur.fill} stroke={line} strokeWidth={2.8} />
          <g transform="translate(68 136) rotate(-70) scale(0.85)"><Paw {...paw} /></g>
        </g>
      ) : (
        [-1, 1].map((side) => (
          <g key={side} transform={side > 0 ? 'translate(200 0) scale(-1 1)' : undefined}>
            <Anim cls="pa-wing" origin="100% 100%" delay={side > 0 ? 0.5 : 0}>
              <path d={capsule([66, 124], [55, 106], 18)} fill={fur.fill} stroke={line} strokeWidth={2.8} />
              <g transform="translate(52 99) rotate(-16)"><Paw {...paw} /></g>
            </Anim>
          </g>
        ))
      )}

      {st >= 2 && (
        <>
          <Crown x={100} y={57} />
          {!g && [[28, 60, 7], [172, 52, 7], [26, 128, 5.5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
