// Jingle → Timbrel → Jubilee: Miriam's tambourine, a round little drum with its face on the drumhead, shiny
// jingles set round its rim, stubby arms waving it up for joy and little feet to dance on.
// Timbrel has ribbons tied on with a bow, streaming out as it dances; Jubilee has ribbons on both sides,
// flowers round its rim and a crown. Grumpy, it goes dull and dusty, its arms hang down and its ribbons droop.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

const CX = 100, CY = 110, R = 54 // the rim's outside
const RIM_W = 11
const MIRROR = 'translate(200 0) scale(-1 1)'

/** A point on the rim's middle (or at radius r) at `deg` degrees clockwise from the top. */
const onRim = (deg: number, r = R - RIM_W / 2): Pt => {
  const a = ((deg - 90) * Math.PI) / 180
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r]
}

// Where the jingles sit round the rim, clear of the crown on top, the arms, the bow and the feet.
const JINGLES = [-40, 40, -140, 140]
// Jubilee's flowers, in between them.
const FLOWERS = [-16, 16, -66, 66]

/** A flat ribbon along the cubic curve a (b c) d, `w` wide, with a swallowtail notch cut in its end. */
function ribbon(a: Pt, b: Pt, c: Pt, d: Pt, w: number, n = 24) {
  const at = (t: number): Pt => {
    const u = 1 - t
    return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]) as Pt
  }
  const L: Pt[] = [], Rt: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const [x, y] = at(i / n), [x1, y1] = at(Math.max(0, i / n - 0.01)), [x2, y2] = at(Math.min(1, i / n + 0.01))
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, nx = (-(y2 - y1) / len) * (w / 2), ny = ((x2 - x1) / len) * (w / 2)
    L.push([x + nx, y + ny])
    Rt.push([x - nx, y - ny])
  }
  // The notch: back from the end along the ribbon's middle
  const [ex, ey] = at(1), [px, py] = at(0.97)
  const back = Math.hypot(ex - px, ey - py) || 1
  const notch: Pt = [ex - ((ex - px) / back) * w * 0.7, ey - ((ey - py) / back) * w * 0.7]
  return `M${L.map((p) => pt(...p)).join(' L')} L${pt(...notch)} L${Rt.reverse().map((p) => pt(...p)).join(' L')}Z`
}

/** A little bow, centred on (0, 0). */
const Bow = ({ color, line }: { color: string; line: string }) => (
  <g fill={color} stroke={line} strokeWidth={2} strokeLinejoin="round">
    <path d="M0 0 Q-9 -10 -12 -2 Q-10 6 0 0 Z M0 0 Q9 -10 12 -2 Q10 6 0 0 Z" />
    <circle r={3.2} />
  </g>
)

export default function Tambourine({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const RIM = g ? '#b39a92' : '#ff7a5c'
  const HEAD = g ? '#e4ddd2' : '#fff3da'
  const GOLD = g ? '#cfc3a0' : '#ffd34d'
  const GOLD_LINE = g ? '#9c9278' : '#d29a00'
  const RIBBONS = g ? ['#c9aebb', '#d3c79f', '#aebdcc'] : ['#ff6fae', '#ffc928', '#5fb7ff']
  const rim = useShade(RIM, 0.35, 0.18)
  const head = useShade(HEAD, 0.5, 0.08)
  const gold = useShade(GOLD, 0.5, 0.15)
  const line = ink(RIM)
  // The ribbons, tied on at the rim's lower left (both sides for Jubilee): streaming out as it dances,
  // or hanging limp when grumpy. [start, control, control, end]
  const bow = onRim(-118, R - 2)
  const strands: [Pt, Pt, Pt, Pt][] = g
    ? [[[bow[0], bow[1]], [bow[0] - 6, bow[1] + 14], [bow[0] - 2, bow[1] + 26], [bow[0] - 8, bow[1] + 40]],
       [[bow[0], bow[1]], [bow[0] - 12, bow[1] + 10], [bow[0] - 12, bow[1] + 22], [bow[0] - 20, bow[1] + 32]],
       [[bow[0], bow[1]], [bow[0] + 2, bow[1] + 14], [bow[0] + 6, bow[1] + 28], [bow[0] + 2, bow[1] + 42]]]
    : [[[bow[0], bow[1]], [bow[0] - 24, bow[1] - 12], [bow[0] - 26, bow[1] + 18], [bow[0] - 50, bow[1] + 6]],
       [[bow[0], bow[1]], [bow[0] - 16, bow[1] + 4], [bow[0] - 14, bow[1] + 30], [bow[0] - 38, bow[1] + 36]],
       [[bow[0], bow[1]], [bow[0] - 20, bow[1] - 26], [bow[0] - 36, bow[1] - 2], [bow[0] - 50, bow[1] - 24]]]
  return (
    <g>
      <defs>{rim.def}{head.def}{gold.def}</defs>

      {/* Ribbons tied on with a bow, fluttering (Timbrel: on the left; Jubilee: both sides) */}
      {stage >= 1 && [-1, 1].filter((side) => side < 0 || stage >= 2).map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-tail" origin="100% 30%" delay={side > 0 ? 0.6 : 0}>
            {strands.slice(0, stage >= 2 ? 3 : 2).map((s, i) => {
              const c = RIBBONS[(i + (side > 0 ? 1 : 0)) % 3]
              return <path key={i} d={ribbon(...s, 7)} fill={c} stroke={ink(c)} strokeWidth={2} strokeLinejoin="round" />
            })}
          </Anim>
        </g>
      ))}

      {/* Little feet to dance on, peeping out under the rim */}
      {[86, 114].map((x) => <ellipse key={x} cx={x} cy={170} rx={12} ry={7.5} fill={rim.fill} stroke={line} strokeWidth={3} />)}

      {/* Stubby arms, waving it up for joy (hanging down when grumpy) */}
      {[-1, 1].map((side) => {
        const [x, y] = onRim(side * (g ? 120 : 96), R + 5)
        return (
          <Anim key={side} cls="pa-wing" origin={side < 0 ? '100% 50%' : '0% 50%'} delay={side > 0 ? 0.4 : 0}>
            <ellipse cx={x} cy={y} rx={6.5} ry={10.5} fill={rim.fill} stroke={line} strokeWidth={2.5} transform={`rotate(${side * (g ? 25 : -50)} ${pt(x, y)})`} />
          </Anim>
        )
      })}

      <g className="pa-breathe">
        {/* The wooden rim and the drumhead */}
        <circle cx={CX} cy={CY} r={R} fill={rim.fill} stroke={line} strokeWidth={3} />
        <circle cx={CX} cy={CY} r={R - RIM_W} fill={head.fill} stroke={line} strokeWidth={2.5} />
        {/* Painted dots round the rim, between the jingles */}
        {Array.from({ length: 24 }, (_, i) => i * 15 - 172.5).filter((d) => JINGLES.every((j) => Math.abs(d - j) > 14)).map((d) => {
          const [x, y] = onRim(d)
          return <circle key={d} cx={x} cy={y} r={1.8} fill="#fff" opacity={g ? 0.5 : 0.85} />
        })}
        <Shine x={76} y={82} rx={10} ry={5} />

        {/* Jingles: pairs of little metal discs set in slots in the rim */}
        {JINGLES.map((d) => {
          const [x, y] = onRim(d, R - 3)
          return (
            <g key={d}>
              <rect x={x - 10} y={y - 5} width={20} height={10} rx={3} fill={ink(RIM)} opacity={0.5} transform={`rotate(${d} ${pt(x, y)})`} />
              <circle cx={x - 3} cy={y - 1} r={7.5} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={2} />
              <circle cx={x + 3} cy={y + 1} r={7.5} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={2} />
              <circle cx={x + 3} cy={y + 1} r={2} fill={GOLD_LINE} />
              <circle cx={x - 0.5} cy={y - 2.5} r={1.7} fill="#fff" opacity={g ? 0.4 : 0.9} />
            </g>
          )
        })}

        {/* Jubilee's flowers round the rim */}
        {stage >= 2 && FLOWERS.map((d) => {
          const [x, y] = onRim(d)
          return (
            <g key={d} transform={`translate(${pt(x, y)})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={0} cy={-4.5} rx={3.6} ry={4.8} fill={g ? '#d6cbd0' : '#fff'} stroke={g ? '#a99ea4' : '#ff8fbf'} strokeWidth={1.3} transform={`rotate(${a})`} />
              ))}
              <circle r={2.6} fill={GOLD} stroke={GOLD_LINE} strokeWidth={1} />
            </g>
          )
        })}
      </g>

      {/* The bow the ribbons are tied with */}
      {stage >= 1 && [-1, 1].filter((side) => side < 0 || stage >= 2).map((side) => (
        <g key={side} transform={`translate(${pt(side < 0 ? bow[0] : 200 - bow[0], bow[1])}) rotate(${side * 30})`}>
          <Bow color={RIBBONS[side < 0 ? 0 : 1]} line={ink(RIBBONS[side < 0 ? 0 : 1])} />
        </g>
      ))}

      <CuteFace x={100} y={108} s={0.95} gap={15} mood={mood} blinkDelay={1.8} />

      {stage >= 2 && (
        <>
          <Crown x={100} y={60} />
          {!g && [[32, 46, 8], [170, 42, 7], [178, 104, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
