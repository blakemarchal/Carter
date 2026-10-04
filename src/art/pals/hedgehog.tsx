// Prickles → Puffball → Velvetquill: a round little desert hedgehog facing you, with big round ears, a pale
// face and tummy, a pointy nose with a shiny button tip, tiny paws and feet, and a coat of soft round spines
// (brown, with cream tips) all round the back of him.
// Puffball's coat is puffier and has a pink desert flower tucked in it; Velvetquill's spines go soft as velvet and
// glow a warm gold, like the bush that burned but didn't burn up, and he wears a crown.
// Grumpy (in battle, before he's befriended): grey and dusty, his spines bristling out sharp and spiky, his
// ears flat and a frown on his face.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

const CX = 100, CY = 118 // the middle of his coat

/**
 * A coat of n spines round (CX, CY), from radius r0 out to their tips at r1, squashed to ry, running clockwise
 * from `from` for `span` (radians clockwise from 3 o'clock) and closed through the middle (behind him). Soft
 * spines have round tips, combed a little outwards (by `comb`); sharp ones (grumpy) come to points.
 */
function spines(n: number, r0: number, r1: number, sharp: boolean, from: number, span: number, comb = 0.12, ry = 0.94) {
  const at = (a: number, r: number) => pt(CX + Math.cos(a) * r, CY + Math.sin(a) * r * ry)
  const step = span / n
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = from + i * step
    const tip = a + step / 2 + comb * Math.cos(a + step / 2)
    const mid = r0 + (r1 - r0) * 0.55
    d += `${i ? ' L' : 'M'}${at(a, r0)}`
    d += sharp
      ? ` Q${at(a + step * 0.15, mid)} ${at(tip, r1)} Q${at(a + step * 0.85, mid)} ${at(a + step, r0)}`
      : ` C${at(a + step * 0.04, mid)} ${at(tip - step * 0.22, r1 * 0.995)} ${at(tip, r1)} C${at(tip + step * 0.22, r1 * 0.995)} ${at(a + step * 0.96, mid)} ${at(a + step, r0)}`
  }
  return `${d} L${pt(CX, CY)}Z`
}

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

const DEG = Math.PI / 180
// His pale face, a little heart-shaped where his spines come down onto his forehead.
const FACE = smooth([[100, 87], [113, 82], [127, 86], [135, 99], [134, 116], [124, 130], [100, 137], [76, 130], [66, 116], [65, 99], [73, 86], [87, 82]])

export default function Hedgehog({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [outerId, innerId] = [`ho${uid}`, `hi${uid}`]
  const velvet = stage >= 2
  // Spines: brown with cream tips (golden velvet for Velvetquill), grey and dusty when grumpy
  const SPINE = g ? '#9a8e86' : velvet ? '#eaa555' : '#a8714a'
  const SPINE_IN = g ? '#b2a79e' : velvet ? '#ffc879' : '#c98f5c'
  const TIP = g ? '#dcd5cd' : velvet ? '#fff0c2' : '#fbe7cc'
  const CREAM = g ? '#e4ddd3' : '#fde9d2'
  const EAR_IN = g ? '#d6bcbc' : '#ffb2c2'
  const PAW = g ? '#b9a497' : '#d9a283'
  const NOSE = '#4a2f35'
  const GLOW = '#ffe27a'
  const cream = useShade(CREAM, 0.5, 0.08)
  const snout = useShade(g ? '#ece6de' : '#fff4e8', 0.6, 0.06)
  const paw = useShade(PAW, 0.35, 0.15)
  const line = ink(SPINE)
  const creamLine = ink(CREAM)
  // Puffball's coat is puffier; grumpy, the spines bristle out further and come to points.
  const [r0, r1] = [46, (stage >= 1 ? 66 : 63) + (g ? 6 : 0)]
  const [from, span] = [146 * DEG, 248 * DEG]
  const n = stage >= 1 ? 21 : 19
  const outer = spines(n, r0, r1, g, from, span)
  const inner = spines(n - 1, r0 - 8, r1 - 11, g, from + span / n / 2, span - span / n)

  return (
    <g>
      <defs>
        {cream.def}{snout.def}{paw.def}
        {/* (out from the middle of his coat, so each spine is dark at its root and pale at its tip) */}
        <radialGradient id={outerId} gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={r1}>
          <stop offset="0.7" stopColor={SPINE} />
          <stop offset="0.84" stopColor={SPINE} />
          <stop offset="1" stopColor={TIP} />
        </radialGradient>
        <radialGradient id={innerId} gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={r1 - 11}>
          <stop offset="0.66" stopColor={SPINE_IN} />
          <stop offset="0.82" stopColor={SPINE_IN} />
          <stop offset="1" stopColor={TIP} />
        </radialGradient>
      </defs>

      {/* Little feet, under his round spiny back */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <ellipse cx={100 + side * 17} cy={174} rx={11} ry={6.5} fill={paw.fill} stroke={ink(PAW)} strokeWidth={2.5} />
          <path d={`M${100 + side * 17 - 3} 171 v4 M${100 + side * 17 + 3} 171 v4`} stroke={ink(PAW)} strokeWidth={1.8} strokeLinecap="round" />
        </g>
      ))}

      {/* His round body, all coat and spines (Velvetquill's glowing softly) */}
      <g className="pa-breathe">
        {velvet && !g && <path d={outer} fill={GLOW} opacity={0.45} stroke={GLOW} strokeWidth={12} strokeLinejoin="round" />}
        <ellipse cx={CX} cy={124} rx={50} ry={47} fill={SPINE} stroke={line} strokeWidth={3} />
        <path d={outer} fill={`url(#${outerId})`} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={inner} fill={`url(#${innerId})`} stroke={ink(SPINE_IN)} strokeWidth={2} strokeLinejoin="round" />
        {/* Glints on Velvetquill's glowing spines */}
        {velvet && !g && [200, 252, 322].map((deg, i) => (
          <Anim key={deg} cls="pa-twinkle" delay={0.3 + i * 0.5}>
            <path d={twinklePath(CX + Math.cos(deg * DEG) * (r1 - 7), CY + Math.sin(deg * DEG) * (r1 - 7) * 0.94, 4.5)} fill="#fff" opacity={0.9} />
          </Anim>
        ))}

        {/* His pale tummy, with tiny paws */}
        <ellipse cx={100} cy={148} rx={30} ry={25} fill={cream.fill} stroke={creamLine} strokeWidth={2.5} />
        {[-1, 1].map((side) => (
          <ellipse key={side} cx={100 + side * 22} cy={148} rx={7} ry={9} fill={paw.fill} stroke={ink(PAW)} strokeWidth={2.2} transform={`rotate(${side * -20} ${100 + side * 22} 148)`} />
        ))}
      </g>

      {/* Big round ears (flat out to the sides when he's cross); they twitch */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${100 + side * 31} 88) rotate(${side * (g ? 75 : 30)})`}>
          <Anim cls="pa-ear" origin="50% 100%" delay={side > 0 ? 0.5 : 0}>
            <ellipse cx={0} cy={-11} rx={13} ry={15.5} fill={cream.fill} stroke={creamLine} strokeWidth={3} />
            <ellipse cx={0} cy={-10} rx={7.5} ry={10} fill={EAR_IN} />
          </Anim>
        </g>
      ))}

      {/* His pale face */}
      <path d={FACE} fill={cream.fill} stroke={creamLine} strokeWidth={2.5} strokeLinejoin="round" />
      <Shine x={84} y={92} rx={8} ry={4.5} />

      <CuteFace x={100} y={104} s={0.85} gap={16} mood={mood} mouth={false} blinkDelay={1.2} />
      {/* The pointy nose, with a shiny button on its tip, and a little smile (a frown when grumpy) */}
      <path d="M92.5 108 Q100 104 107.5 108 Q106 120 100 127 Q94 120 92.5 108 Z" fill={snout.fill} stroke={creamLine} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={100} cy={124.5} rx={5.2} ry={4.2} fill={NOSE} />
      <circle cx={98.2} cy={123} r={1.5} fill="#fff" opacity={0.8} />
      <path d={g ? 'M95 134 Q100 129.5 105 134' : 'M100 129 V130.5 M95.5 131.5 Q97.8 134 100 130.5 Q102.2 134 104.5 131.5'} stroke="#7a4a3a" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* A pink desert flower tucked in Puffball's spines */}
      {stage >= 1 && (
        <g transform="translate(140 70) rotate(14)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-6} rx={4.6} ry={6.2} fill={g ? '#cbb5c0' : '#ff9fcb'} stroke={g ? '#9c8794' : '#e0679f'} strokeWidth={1.5} transform={`rotate(${a})`} />
          ))}
          <circle r={3.5} fill={g ? '#d8cfa8' : '#ffd34d'} />
        </g>
      )}

      {stage >= 2 && (
        <>
          <Crown x={100} y={64} />
          {!g && [[28, 52, 8], [172, 46, 7], [178, 132, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
