// Peep → Fluffy → Sunbeam: a round, fluffy yellow chick facing you, just hatched: one soft ball (head and body all one,
// its edge a little fluffy), with big eyes, rosy cheeks and a tiny orange beak, a little tuft of three feathers on top
// of its head, two little wings at its sides and two thin orange legs with three toes on each foot on the ground. Peep
// has the broken bottom half of its eggshell on the ground by its feet (and a little bit of shell on the other side).
// Fluffy is fluffier all over, with a soft pale fluffy chest, a fuller tuft and a little pink flower tucked in beside
// its tuft. Sunbeam keeps its flower; a warm sunrise glows behind it, soft rays fanning out over the top of it, with
// sparkles, and it wears a crown (its tuft tucked under it).
// Grumpy: a pale, dusty yellow, its feathers all fluffed up (bigger, its edge bumpy, its tuft sticking up every which
// way), its wings held down, with a cross frown.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]
const MIRROR = 'translate(200 0) scale(-1 1)'

/** An ellipse's outline as polygon points. The glow and the shadow are drawn as polygons, so the coloring page
 *  (which turns every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** Sunbeam's sunrise: soft rays fanning out from behind it, over the top from one side to the other (thin wedges from
 *  its middle, behind it; one polygon, for the coloring page). */
const rays = (cx: number, cy: number, r: number, n = 11, from = 165, to = 375, half = 5.5) =>
  Array.from({ length: n }, (_, i) => {
    const a = from + ((to - from) * i) / (n - 1)
    const at = (d: number) => pt(cx + Math.cos(((a + d) * Math.PI) / 180) * r, cy + Math.sin(((a + d) * Math.PI) / 180) * r)
    return `${pt(cx, cy)} ${at(-half)} ${at(half)}`
  }).join(' ')

// The middle of its round body, and its size
const CX = 100, CY = 117, R = 48
/** A point on the edge of its round body (a ball, a little wider at the bottom), a radians round from the top, k times
 *  its size out. */
const onBall = (a: number, k: number): Pt => {
  const t = a - Math.PI / 2
  return [CX + R * k * Math.cos(t) * (1 + 0.05 * Math.sin(t)), CY + R * k * 0.97 * Math.sin(t)]
}
/** Its round body with a soft, fluffy edge: n little rounded bumps all round, each bulging `fluff` out, all puffed up
 *  `puff` times bigger when it's grumpy. */
function ballPath(n: number, fluff: number, puff = 1) {
  const step = (Math.PI * 2) / n
  let d = `M${pt(...onBall(0, puff))}`
  for (let i = 0; i < n; i++) {
    const c = onBall((i + 0.5) * step, puff + (2 * fluff) / R)
    d += ` Q${pt(...c)} ${pt(...onBall((i + 1) * step, puff))}`
  }
  return d + 'Z'
}
// Fluffy's soft, pale chest, with a fluffy edge at the top
const CHEST = 'M74 141 C77 135 81 134 84 136 C86 131 91 130 94 133 C96 129 104 129 106 133 C109 130 114 131 116 136 C119 134 123 135 126 141 C127 152 117 161 100 162 C83 161 73 152 74 141 Z'

/** A feather of its tuft from its root at (0, 0), pointing up, l long and w wide, its tip curling over a little. */
const tuftFeather = (l: number, w: number) =>
  `M${-w * 0.35} 0 C${-w * 0.9} ${-l * 0.35} ${-w * 0.6} ${-l * 0.8} ${w * 0.25} ${-l} C${w * 0.5} ${-l * 0.7} ${w * 0.6} ${-l * 0.35} ${w * 0.35} 0 Z`
// The tuft on top of its head: [angle, length, width] (fuller once it's grown; sticking up every which way when grumpy)
const TUFT: [number, number, number][] = [[-30, 14, 8], [0, 19, 9], [28, 13, 8]]
const TUFT_FULL: [number, number, number][] = [[-48, 12, 7], [-24, 17, 8.5], [0, 21, 9.5], [22, 16, 8.5], [44, 11, 7]]
const TUFT_CROSS: [number, number, number][] = [[-62, 13, 7], [-30, 16, 8], [-4, 18, 8], [24, 15, 8], [56, 12, 7]]
const TUFT_ROOT: Pt = [100, 74]

// Its little left wing at its side (the right one is its mirror image): from its shoulder, inside the edge of its body,
// out and down, with three soft, round feather tips along its bottom edge
const WING = 'M65 110 C57 105 45 108 38 117 C33 124 32 131 35 135 A4 4 0 0 0 42.5 137.5 A4 4 0 0 0 50 139 A4 4 0 0 0 57 136.5 C62 133 66 121 65 110 Z'

// The broken bottom half of its eggshell, on the ground by its feet (our right): its jagged edge at the top, and the
// inside of the shell showing through the break
const SHELL = 'M136.5 152 L142.5 147.5 L146 154 L152 148 L156.5 154.5 L162.5 148.5 L166 155 L172 151 L176.5 157 C178 169 171 180 158 181 C145.5 181.5 136.5 172 136.5 152 Z'
const SHELL_INSIDE = 'M138.5 153.2 L142.5 150.2 L146 156.6 L152 150.6 L156.5 157.2 L162.5 151.2 L166 157.6 L172 153.6 L175 157.6 C166 163.5 145 163 138.5 153.2 Z'
// A little bit of shell on the ground on the other side
const CHIP = 'M45 180.5 L47 174 L51.5 177 L55 172.5 L59 177.5 L60 181 Z'

/** A little flower: five round petals round a golden middle. */
function Flower({ x, y, s, petal, mid }: { x: number; y: number; s: number; petal: string; mid: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = ((i * 72 - 90) * Math.PI) / 180
        return <circle key={i} cx={Math.cos(a) * 5.4} cy={Math.sin(a) * 5.4} r={4.4} fill={petal} stroke={ink(petal)} strokeWidth={1.3} />
      })}
      <circle r={3.5} fill={mid} stroke={ink(mid)} strokeWidth={1.2} />
    </g>
  )
}

const FACE_Y = 106
const FACE_S = 0.95

export default function Chick({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [glowId, rayId] = [`cg${ids}`, `cr${ids}`]
  const YELLOW = g ? '#e6d8a2' : '#ffd84a'
  const PALE = g ? '#f1ead0' : '#fff3b0'
  const BEAK = g ? '#d9a87c' : '#ff9a2e'
  const LEGS = g ? '#cba383' : '#f39a35'
  const SHELLC = g ? '#ebe6dc' : '#fffaf0'
  const PETAL = g ? '#dcb9c5' : '#ff7fb6'
  const MID = g ? '#e3cf96' : '#ffc93a'
  const line = g ? '#a99a68' : '#cf931c'
  const SHELL_LINE = g ? '#b9b0a2' : '#c4ab86'
  const body = useShade(YELLOW, 0.45, 0.12)
  const wing = useShade(YELLOW, 0.3, 0.16)
  const pale = useShade(PALE, 0.5, 0.05)
  const beak = useShade(BEAK, 0.35, 0.12)
  const shell = useShade(SHELLC, 0.4, 0.1)
  const fluffy = st >= 1
  const tuft = g ? TUFT_CROSS : fluffy ? TUFT_FULL : TUFT

  return (
    <g>
      <defs>
        {body.def}{wing.def}{pale.def}{beak.def}{shell.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#fff2b8" stopOpacity={0.95} />
          <stop offset="0.6" stopColor="#ffd9a0" stopOpacity={0.5} />
          <stop offset="1" stopColor="#ffc9a0" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={rayId} gradientUnits="userSpaceOnUse" cx={CX} cy={118} r={90}>
          <stop offset="0.45" stopColor="#ffcf5c" stopOpacity={0.8} />
          <stop offset="0.75" stopColor="#ffae7c" stopOpacity={0.4} />
          <stop offset="1" stopColor="#ffa0a0" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Sunbeam's sunrise: a warm glow behind it, soft rays fanning out over the top of it */}
      {st >= 2 && !g && (
        <>
          <polygon points={rays(CX, 118, 90)} fill={`url(#${rayId})`} />
          <polygon points={ring(CX, 114, 80, 74)} fill={`url(#${glowId})`} />
        </>
      )}

      {/* Its soft shadow on the ground */}
      <polygon points={ring(CX, 180, 44, 5.5)} fill="#2b2140" opacity={0.12} />

      {/* The tuft on top of its head (behind it, so it grows out of it; under Sunbeam's crown) */}
      {st < 2 && tuft.map(([a, l, w]) => (
        <path key={a} d={tuftFeather(l, w)} transform={`translate(${pt(...TUFT_ROOT)}) rotate(${a})`} fill={body.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      ))}

      {/* Two thin legs from under its body, with three toes on each foot, on the ground */}
      {[89, 111].map((x) => (
        <path key={x} d={`M${x} 156 V175 M${x} 175 L${x - 8} 180 M${x} 175 L${x} 181.5 M${x} 175 L${x + 8} 180`}
          stroke={LEGS} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {/* Its round, fluffy body (fluffier once it's grown, all puffed up when it's grumpy), and Fluffy's pale chest */}
      <g className="pa-breathe">
        <path d={g ? ballPath(14, 4.2, 1.05) : fluffy ? ballPath(18, 2.6) : ballPath(24, 1.5)} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        {fluffy && <path d={CHEST} fill={pale.fill} />}
        <Shine x={78} y={84} rx={9} ry={5} />
      </g>

      {/* Little wings at its sides, flapping (held down at its sides when it's grumpy) */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <g transform={g ? 'rotate(-14 62 112)' : undefined}>
            <Anim cls="pa-wing" origin="90% 10%" delay={side > 0 ? 0.15 : 0}>
              <path d={WING} fill={wing.fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
            </Anim>
          </g>
        </g>
      ))}

      <CuteFace x={CX} y={FACE_Y} s={FACE_S} gap={16} mood={mood} mouth={false} blinkDelay={0.7} />

      {/* Its tiny orange beak, and a cross frown under it when it's grumpy */}
      <path d="M93.5 113 Q100 109.5 106.5 113 Q104.5 118.5 100 122 Q95.5 118.5 93.5 113 Z" fill={beak.fill} stroke={ink(BEAK)} strokeWidth={1.8} strokeLinejoin="round" />
      <polyline points="96 115.4 100 116.6 104 115.4" fill="none" stroke={ink(BEAK)} strokeWidth={1.3} strokeLinecap="round" opacity={0.7} />
      {g && <path d="M94 128 Q100 124 106 128" stroke="#2b2140" strokeWidth={2.6} fill="none" strokeLinecap="round" />}

      {/* Fluffy's and Sunbeam's little flower, tucked in beside its tuft */}
      {fluffy && <Flower x={121} y={77} s={0.95} petal={PETAL} mid={MID} />}

      {/* Peep's broken eggshell on the ground by its feet, and a little bit of shell on the other side */}
      {st === 0 && (
        <g strokeLinejoin="round">
          <path d={SHELL} fill={shell.fill} stroke={SHELL_LINE} strokeWidth={2.4} />
          <path d={SHELL_INSIDE} fill={g ? '#ddd6c8' : '#f3e6cc'} />
          {[[148, 170], [163, 166], [156, 175.5]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={1.6} fill={g ? '#cfc6b8' : '#e8d5b0'} />)}
          <path d={CHIP} fill={shell.fill} stroke={SHELL_LINE} strokeWidth={2} />
        </g>
      )}

      {st >= 2 && (
        <>
          <Crown x={CX} y={76} />
          {!g && [[30, 58, 7], [172, 54, 6], [180, 128, 5], [22, 138, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
