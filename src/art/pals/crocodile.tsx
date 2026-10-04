// Snappy → Grinny → Riverking: a chubby little Nile crocodile sitting up to face you, with his eyes in two round
// bumps on top of his head, a broad round snout with two nostril bumps at its tip and a big open grin under it,
// a cream striped tummy, four stubby legs with round toes and a long curly tail with bumpy scales along it.
// Grinny wears a scarf woven of river reeds (like baby Moses' basket); Riverking has a pink lotus flower tucked
// in its knot, and a crown. Grumpy (in battle, before he's befriended): a dull grey-green, with a cross little
// snap showing tiny rounded teeth, his head hung low and his tail flat on the ground.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]
type Circle = [number, number, number]

/** Smooth curve segments through the points (Catmull-Rom), continuing from the first point. */
function through(ps: Pt[], closed: boolean) {
  const n = ps.length
  const at = (i: number) => (closed ? ps[(i + n) % n] : ps[Math.max(0, Math.min(n - 1, i))])
  let d = ''
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    d += ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }
  return d
}
/** A smooth closed outline through the points. */
const smooth = (ps: Pt[]) => `M${pt(...ps[0])}${through(ps, true)}Z`

/** Outline of a bumpy shape: the union of circles listed clockwise around its middle. */
function puff(cs: Circle[]) {
  const n = cs.length
  // Where each circle meets the next, on the outside (to the left of the way round).
  const meet = cs.map(([x1, y1, r1], i): Pt => {
    const [x2, y2, r2] = cs[(i + 1) % n]
    const d = Math.hypot(x2 - x1, y2 - y1)
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    const h = Math.sqrt(Math.max(0, r1 * r1 - a * a))
    const bx = x1 + (a * (x2 - x1)) / d, by = y1 + (a * (y2 - y1)) / d
    return [bx + (h * (y2 - y1)) / d, by - (h * (x2 - x1)) / d]
  })
  let d = `M${pt(...meet[n - 1])}`
  cs.forEach(([x, y, r], i) => {
    const s = meet[(i + n - 1) % n], e = meet[i]
    let turn = Math.atan2(e[1] - y, e[0] - x) - Math.atan2(s[1] - y, s[0] - x)
    if (turn < 0) turn += Math.PI * 2
    d += ` A${r} ${r} 0 ${turn > Math.PI ? 1 : 0} 1 ${pt(...e)}`
  })
  return `${d}Z`
}

/**
 * A tail's centreline: from (x, y), setting off at angle a (radians; 0 is right, -π/2 is up), running `len`
 * and turning by bend(u) radians per unit length as it goes (u = 0…1 along it; negative turns anticlockwise).
 */
function centreline(x: number, y: number, a: number, len: number, bend: (u: number) => number, n = 48): Pt[] {
  const ps: Pt[] = [[x, y]]
  const ds = len / n
  for (let i = 0; i < n; i++) {
    a += bend((i + 0.5) / n) * ds
    x += Math.cos(a) * ds
    y += Math.sin(a) * ds
    ps.push([x, y])
  }
  return ps
}

/** The point on one edge of a tube along ps (side 1: to the right of the way it goes, -1: to the left), w wide there. */
function edge(ps: Pt[], i: number, w: number, side: number): Pt {
  const n = ps.length - 1
  const [x1, y1] = ps[Math.max(0, i - 1)], [x2, y2] = ps[Math.min(n, i + 1)]
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  return [ps[i][0] - ((y2 - y1) / len) * (w / 2) * side, ps[i][1] + ((x2 - x1) / len) * (w / 2) * side]
}

/** A smooth tube along the points ps, its width w(t) for t = 0…1 along it, with round ends. */
function tubeAlong(ps: Pt[], w: (t: number) => number) {
  const n = ps.length - 1
  const L = ps.map((_, i) => edge(ps, i, w(i / n), 1))
  const R = ps.map((_, i) => edge(ps, i, w(i / n), -1)).reverse()
  const sm = (qs: Pt[]) => qs.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + qs[i + 2][0]) / 2, (p[1] + qs[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...qs[qs.length - 1])}`
  const r0 = w(0) / 2, r1 = w(1) / 2
  return `M${pt(...L[0])} ${sm(L)} A${r1} ${r1} 0 0 0 ${pt(...R[0])} ${sm(R)} A${r0} ${r0} 0 0 0 ${pt(...L[0])}Z`
}

const MIRROR = 'translate(200 0) scale(-1 1)'
// The head: two round eye bumps on top, round cheeks and a chin (the snout and jaw go in front).
const HEAD = puff([[86, 59, 16.5], [114, 59, 16.5], [122, 88, 18], [100, 100, 26], [78, 88, 18]])
// The broad round snout, from just under his eyes down to its tip; its lower edge, from corner to corner, is his
// top lip: under it, a big open grin (or, when he's cross, a little snap with tiny teeth).
const LC: Pt = [64, 102], RC: Pt = [136, 102]
const SNOUT_TOP = `M${pt(...LC)} C64 93 70 83 77 76 Q100 70 123 76 C130 83 136 93 ${pt(...RC)}`
const LIP = `C136 113 120 118 100 118 C80 118 64 113 ${pt(...LC)}`
const LIP_CROSS = `C136 110 124 115 100 115 C76 115 64 110 ${pt(...LC)}`
// The dark of his mouth (its top edge tucked under the snout): a wide grin, or a narrow snap.
const GRIN = 'M67 106 C70 122 86 128.5 100 128.5 C114 128.5 130 122 133 106 Z'
const SNAP = 'M68 106 C68 118 84 123 100 123 C116 123 132 118 132 106 Z'
// The cream lower jaw round it.
const JAW = 'M64 100 C60 120 80 134 100 134 C120 134 140 120 136 100 Z'
// His body, with round shoulders under his cheeks.
const BODY: Pt[] = [[100, 112], [120, 113], [132, 122], [136, 142], [133, 162], [120, 175], [100, 178], [80, 175], [67, 162], [64, 142], [68, 122], [80, 113]]

export default function Crocodile({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const GREEN = g ? '#a2ad9b' : '#58b46e'
  const SCUTE = g ? '#86917f' : '#3b9356'
  const SNOUT_C = g ? '#b4bdad' : '#7fcf8c'
  const BELLY = g ? '#e5e1cc' : '#fdf1bf'
  const REED = g ? '#cfc4a2' : '#f0c75a'
  const REED_LINE = g ? '#a29777' : '#bf8f2a'
  const LOTUS = g ? '#cdb7c2' : '#ff94c4'
  const MOUTH = g ? '#4a4f45' : '#2f5a3a'
  const green = useShade(GREEN, 0.4, 0.15)
  const snout = useShade(SNOUT_C, 0.45, 0.1)
  const belly = useShade(BELLY, 0.5, 0.06)
  const scute = useShade(SCUTE, 0.3, 0.15)
  const reed = useShade(REED, 0.45, 0.12)
  const line = ink(GREEN)

  // The tail: along the ground from behind him, then up and round into a curl (flat on the ground when grumpy),
  // with a row of round scales along its top.
  const tail = g
    ? centreline(116, 170, 0.02, 72, (u) => (u < 0.5 ? 0 : 0.01))
    : centreline(116, 170, -0.1, 100, (u) => (u < 0.25 ? -0.004 : -0.115 * ((u - 0.25) / 0.75) ** 1.3))
  const tw = (t: number) => 20 - 14 * t ** 0.8
  const scutes = Array.from({ length: g ? 7 : 9 }, (_, k) => {
    const u = g ? 0.18 + k * 0.1 : 0.3 + k * 0.077
    const i = Math.round(u * (tail.length - 1))
    return { at: edge(tail, i, tw(u) - 1, g ? -1 : 1), r: 5.2 - 2.2 * u }
  })
  const drop = g ? 3 : 0 // a sulky crocodile hangs his head

  return (
    <g>
      <defs>{green.def}{snout.def}{belly.def}{scute.def}{reed.def}</defs>

      {/* The curly tail with its bumpy scales, flicking up (mirrored twice so the flick lifts it, rather than
          swinging it down into the ground) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="100% 100%">
          <g transform={MIRROR}>
            {scutes.map(({ at, r }, k) => <circle key={k} cx={at[0]} cy={at[1]} r={r} fill={scute.fill} stroke={ink(SCUTE)} strokeWidth={2.2} />)}
            <path d={tubeAlong(tail, tw)} fill={green.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          </g>
        </Anim>
      </g>

      {/* Sitting body, with his hind legs at the sides, feet poking forward */}
      <g className="pa-breathe">
        {[-1, 1].map((side) => (
          <g key={side}>
            <circle cx={100 + side * 30} cy={160} r={15} fill={green.fill} stroke={line} strokeWidth={3} />
            {/* bumpy scales on his haunches */}
            {[[39.5, 153, 2.4], [41.5, 161.5, 1.8]].map(([dx, y, r]) => <circle key={y} cx={100 + side * dx} cy={y} r={r} fill={SCUTE} opacity={0.6} />)}
          </g>
        ))}
        <path d={smooth(BODY)} fill={green.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={100} cy={154} rx={20} ry={21} fill={belly.fill} />
        {[142, 150, 158, 166].map((y) => (
          <path key={y} d={`M${100 - 17 + Math.abs(y - 153) * 0.35} ${y} Q100 ${y + 3} ${100 + 17 - Math.abs(y - 153) * 0.35} ${y}`} stroke={ink(BELLY)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.6} />
        ))}
      </g>
      {[-1, 1].map((side) => (
        <g key={side}>
          <ellipse cx={100 + side * 40} cy={174} rx={12} ry={7} fill={green.fill} stroke={line} strokeWidth={3} />
          <path d={`M${100 + side * 36} 171 v4.5 M${100 + side * 44} 171 v4.5`} stroke={line} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}

      {/* Stubby front legs at his sides, with round toes */}
      {[-1, 1].map((side) => {
        const x = 100 + side * 23
        return (
          <g key={side}>
            <rect x={x - 7.5} y={132} width={15} height={40} rx={7.5} fill={green.fill} stroke={line} strokeWidth={3} />
            <circle cx={x + side * 1.5} cy={150} r={2.2} fill={SCUTE} opacity={0.7} />
            <ellipse cx={x} cy={174} rx={10.5} ry={6.5} fill={green.fill} stroke={line} strokeWidth={3} />
            <path d={`M${x - 3.5} 171 v4.5 M${x + 3.5} 171 v4.5`} stroke={line} strokeWidth={2} strokeLinecap="round" />
          </g>
        )
      })}

      {/* Grinny's scarf, woven of river reeds, tied at the side with its ends hanging (Riverking's has a lotus in the knot) */}
      {stage >= 1 && (
        <>
          <Anim cls="pa-tail" origin="50% 0%" delay={0.4}>
            <path d="M68 134 L59 158 L63 157 L65 161 L68 157 L71 160 L74 137 Z" fill={reed.fill} stroke={REED_LINE} strokeWidth={2} strokeLinejoin="round" />
            <path d="M65 141 L62 151 M70 142 L68 152" stroke={REED_LINE} strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
          </Anim>
          <path d="M63 121 Q100 143 137 121 L139 131 Q100 155 61 131 Z" fill={reed.fill} stroke={REED_LINE} strokeWidth={2.2} strokeLinejoin="round" />
          {Array.from({ length: 13 }, (_, k) => {
            // a basket weave: little stitches, alternately in the top and bottom half of the band
            const t = (k + 0.5) / 13, u = 1 - t
            const top: Pt = [u * u * 63 + 2 * u * t * 100 + t * t * 137, u * u * 121 + 2 * u * t * 143 + t * t * 121]
            const bot: Pt = [u * u * 61 + 2 * u * t * 100 + t * t * 139, u * u * 131 + 2 * u * t * 155 + t * t * 131]
            const [f0, f1] = k % 2 ? [0.55, 0.85] : [0.15, 0.45]
            return <path key={k} d={`M${pt(top[0] + (bot[0] - top[0]) * f0, top[1] + (bot[1] - top[1]) * f0)} L${pt(top[0] + (bot[0] - top[0]) * f1, top[1] + (bot[1] - top[1]) * f1)}`}
              stroke={REED_LINE} strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
          })}
          <ellipse cx={68} cy={133} rx={7} ry={6} fill={reed.fill} stroke={REED_LINE} strokeWidth={2} />
        </>
      )}

      {/* Head (hung a little low when he's sulking) */}
      <g transform={drop ? `translate(0 ${drop})` : undefined}>
        <path d={HEAD} fill={green.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <Shine x={79} y={53} rx={7} ry={4} />
        {/* Bumpy scales on his cheeks */}
        {[[68, 81, 2.4], [63.5, 91, 1.9], [132, 81, 2.4], [136.5, 91, 1.9]].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={SCUTE} opacity={0.6} />
        ))}

        {/* The cream lower jaw and the open mouth in it: a big grin with a pink tongue, or, when he's cross, a
            snap with tiny rounded teeth. Then the snout over them, with two nostril bumps at its tip. */}
        <path d={JAW} fill={belly.fill} stroke={ink(BELLY)} strokeWidth={2.5} strokeLinejoin="round" />
        <path d={g ? SNAP : GRIN} fill="#6b2a3a" stroke={MOUTH} strokeWidth={2} strokeLinejoin="round" />
        {g
          ? [94, 106].map((x) => <path key={x} d={`M${x - 2.8} 122.6 Q${x} 115.5 ${x + 2.8} 122.6 Z`} fill="#fff" />)
          : <path d="M88 127 Q100 119 112 127 Q100 130.5 88 127 Z" fill="#ff8fa8" />}
        <path d={`${SNOUT_TOP} ${g ? LIP_CROSS : LIP}Z`} fill={snout.fill} />
        <path d={SNOUT_TOP} stroke={ink(SNOUT_C)} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.6} />
        {g && [[88, 114.5], [100, 115], [112, 114.5]].map(([x, y]) => (
          <path key={x} d={`M${x - 2.8} ${y - 0.5} Q${x} ${y + 6.5} ${x + 2.8} ${y - 0.5} Z`} fill="#fff" />
        ))}
        {[-1, 1].map((side) => (
          <g key={side}>
            <ellipse cx={100 + side * 8.5} cy={100} rx={6} ry={4.5} fill={SNOUT_C} opacity={0.9} />
            <ellipse cx={100 + side * 8} cy={100.5} rx={2} ry={2.8} fill={ink(SNOUT_C)} transform={`rotate(${side * 25} ${100 + side * 8} 100.5)`} />
          </g>
        ))}
        <Shine x={86} y={84} rx={7} ry={3.5} rot={-15} />
        {/* His top lip along the snout's lower edge, curling up into dimples (down at the corners when he's cross) */}
        <path d={g
          ? `M60 108 Q62 104 ${pt(...LC)} C64 110 76 115 100 115 C124 115 136 110 ${pt(...RC)} Q138 104 140 108`
          : `M60 93 Q62 99 ${pt(...LC)} C64 113 80 118 100 118 C120 118 136 113 ${pt(...RC)} Q138 99 140 93`}
          stroke={MOUTH} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        <CuteFace x={100} y={62} s={0.86} gap={16} mood={mood} mouth={false} blinkDelay={0.6} />

        {stage >= 2 && <Crown x={100} y={51} />}
      </g>

      {stage >= 2 && (
        <>
          {/* A pink lotus flower tucked in the knot of Riverking's scarf */}
          <g transform="translate(66 129) rotate(-14)">
            {[-70, -35, 35, 70, 0].map((a) => (
              <path key={a} d="M0 0 C-5 -4 -5 -11 0 -16 C5 -11 5 -4 0 0 Z" fill={LOTUS} stroke={ink(LOTUS)} strokeWidth={1.5} strokeLinejoin="round" transform={`rotate(${a})`} />
            ))}
            <circle cx={0} cy={-2} r={2.6} fill={g ? '#d8cfa8' : '#ffd34d'} />
          </g>
          {!g && [[30, 56, 8], [172, 46, 7], [26, 140, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
