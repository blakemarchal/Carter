// Toot → Fanfare → Jubileehorn: a shofar, the ram's-horn trumpet God's people blew as they marched round the walls
// of Jericho. A chubby curved horn, creamy at its wide end and warming to gold along it, with ridges round it like a
// real ram's horn: its wide mouth tipped up to toot, and its narrow end curling round at its side like a tail, with
// a little golden mouthpiece. Its face is on the wide part of the horn; it has stubby arms, little feet to march
// on, and music notes bounce out of its mouth.
// Fanfare shines more, has a gold band round its middle and waves a little red banner (for Faithfulness) on a gold
// pole. Jubileehorn glows gold, with gold bands round its middle and its tail, a bigger banner with a gold star, a
// tassel hanging from its tail, and sparkles all round.
// Grumpy: tarnished and dull, its arms hanging down (and its banner drooping), and only a sour little puff of dust
// comes out instead of a toot.
import { useId } from 'react'
import { type BodyProps, Anim, CuteFace, darken, ink, pt, starPath, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** Points along a smooth curve through ps (Catmull-Rom), k per span. */
function spline(ps: Pt[], k = 12): Pt[] {
  const n = ps.length
  const at = (i: number) => ps[Math.max(0, Math.min(n - 1, i))]
  const out: Pt[] = [ps[0]]
  for (let i = 0; i < n - 1; i++) {
    const [a, b, c, d] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    for (let j = 1; j <= k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t
      const f = (m: 0 | 1) => 0.5 * (2 * b[m] + (c[m] - a[m]) * t + (2 * a[m] - 5 * b[m] + 4 * c[m] - d[m]) * t2 + (3 * b[m] - a[m] - 3 * c[m] + d[m]) * t3)
      out.push([f(0), f(1)])
    }
  }
  return out
}

/** The point on one edge of a tube along ps (side 1 or -1), w wide there. */
function edge(ps: Pt[], i: number, w: number, side: number): Pt {
  const n = ps.length - 1
  const [x1, y1] = ps[Math.max(0, i - 1)], [x2, y2] = ps[Math.min(n, i + 1)]
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  return [ps[i][0] - ((y2 - y1) / len) * (w / 2) * side, ps[i][1] + ((x2 - x1) / len) * (w / 2) * side]
}

/** A smooth tube along ps, ws[i] wide at ps[i]: open (flat) at its start, rounded at its end. */
function tube(ps: Pt[], ws: number[]) {
  const n = ps.length - 1
  const L = ps.map((_, i) => edge(ps, i, ws[i], 1))
  const R = ps.map((_, i) => edge(ps, i, ws[i], -1)).reverse()
  const sm = (qs: Pt[]) => qs.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + qs[i + 2][0]) / 2, (p[1] + qs[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...qs[qs.length - 1])}`
  const r1 = ws[n] / 2
  return `M${pt(...L[0])} ${sm(L)} A${r1} ${r1} 0 0 0 ${pt(...R[0])} ${sm(R)} Z`
}

// The horn's middle line, from the middle of its wide mouth (tipped up and a little to the right) down through its
// body, round the bottom and up its side to the tip of the mouthpiece.
const LINE = spline([[121, 55], [107, 77], [100, 103], [95, 127], [86, 146], [69, 155], [51, 151], [39, 137], [37, 119], [43, 104]])
// How far along it each point is (0 at the mouth, 1 at the tip)
const ALONG = (() => {
  const d = [0]
  for (let i = 1; i < LINE.length; i++) d.push(d[i - 1] + Math.hypot(LINE[i][0] - LINE[i - 1][0], LINE[i][1] - LINE[i - 1][1]))
  return d.map((x) => x / d[d.length - 1])
})()
/** Its width: wide and chubby where its face is, tapering round the curl to the narrow mouthpiece; flared at the mouth. */
const widthAt = (u: number) => 11 + 61 * Math.cos((u * Math.PI) / 2) ** 1.5 + 7 * Math.max(0, 1 - u / 0.07) ** 2
const WIDTHS = ALONG.map(widthAt)
const HORN = tube(LINE, WIDTHS)
const iAt = (u: number) => ALONG.findIndex((a) => a >= u)
// A soft sheen over the horn, just inside its outline. It's a polygon, not a path, so the coloring page (which turns
// paths white) leaves it as it is, shining over the colours a child paints.
const GLOSS = [...LINE.map((_, i) => edge(LINE, i, WIDTHS[i] - 4, 1)), ...LINE.map((_, i) => edge(LINE, i, WIDTHS[i] - 4, -1)).reverse()]
  .map((p) => pt(...p)).join(' ')
/** An ellipse's outline as polygon points (for the glow, which the coloring page should leave alone too). */
const ellipsePts = (cx: number, cy: number, rx: number, ry: number) =>
  Array.from({ length: 48 }, (_, i) => pt(cx + Math.cos((i * Math.PI) / 24) * rx, cy + Math.sin((i * Math.PI) / 24) * ry)).join(' ')

/** An arc round the horn at u along it (the front of a ring round it), inset a little from its edges. */
function ring(u: number, inset = 1.5) {
  const i = iAt(u)
  const w = WIDTHS[i]
  const a = edge(LINE, i, w - inset * 2, 1), b = edge(LINE, i, w - inset * 2, -1)
  const [x1, y1] = LINE[Math.max(0, i - 1)], [x2, y2] = LINE[Math.min(LINE.length - 1, i + 1)]
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const bulge = w * 0.16
  const m: Pt = [(a[0] + b[0]) / 2 + ((x2 - x1) / len) * bulge * 2, (a[1] + b[1]) / 2 + ((y2 - y1) / len) * bulge * 2]
  return `M${pt(...a)} Q${pt(...m)} ${pt(...b)}`
}

// Its mouth: the end of the horn, seen from a little above, so you can see in
const MOUTH = LINE[0]
const MOUTH_TILT = (Math.atan2(LINE[0][1] - LINE[3][1], LINE[0][0] - LINE[3][0]) * 180) / Math.PI + 90
const MOUTH_R = WIDTHS[0] / 2

/** A music note bouncing out of its mouth. */
const Note = ({ x, y, s, color, twin }: { x: number; y: number; s: number; color: string; twin?: boolean }) => (
  <g transform={`translate(${pt(x, y)}) scale(${s}) rotate(12)`} fill={color} stroke={ink(color)} strokeWidth={1.4} strokeLinejoin="round">
    {twin ? (
      <>
        <path d="M-1.5 0 V-17 L12.5 -20 V-3" fill="none" strokeWidth={3.4} stroke={color} strokeLinecap="round" />
        <path d="M-1.5 -17 L12.5 -20 L12.5 -15 L-1.5 -12 Z" />
        <ellipse cx={-5.5} cy={0.5} rx={5} ry={3.8} transform="rotate(-20 -5.5 0.5)" />
        <ellipse cx={8.5} cy={-2.5} rx={5} ry={3.8} transform="rotate(-20 8.5 -2.5)" />
      </>
    ) : (
      <>
        <path d="M0 0 V-19 Q8 -16 9 -8" fill="none" strokeWidth={3.2} stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={-4} cy={0.5} rx={5} ry={3.8} transform="rotate(-20 -4 0.5)" />
      </>
    )}
  </g>
)

export default function Trumpet({ stage, mood }: BodyProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  // Cream at its mouth, warming to gold along it (more golden, and shinier, as it grows)
  const CREAM = g ? '#e6e0d2' : st >= 2 ? '#fff3cf' : '#fff6e2'
  const MID = g ? '#d9cfba' : st >= 2 ? '#ffd970' : st >= 1 ? '#fbe2a6' : '#f8e6bd'
  const GOLDEN = g ? '#bfb398' : st >= 2 ? '#f0b23a' : st >= 1 ? '#eebd5c' : '#e8bd72'
  const LINE_C = g ? '#9b917f' : '#b9873f'
  const INSIDE = g ? '#8e8474' : '#b7782f'
  const GOLD = g ? '#d3c9a4' : '#ffd34d'
  const GOLD_LINE = g ? '#9c9278' : '#c98d00'
  const BANNER = g ? '#c4a49c' : '#ff6a4d' // Faithfulness red
  const NOTES = ['#ff6a4d', '#9b6cff', '#3fb4e8']
  // Where its notes bounce, one more as it grows: [x, y, size, a pair of notes?]
  const notes: [number, number, number, boolean][] = [[127, 36, 0.9, false], [101, 26, 0.8, true], [149, 21, 0.75, false]]
  const gold = useShade(GOLD, 0.5, 0.15)
  const arm = useShade(MID, 0.4, 0.15)
  const banner = useShade(BANNER, 0.3, 0.15)
  const along = `ta${uid}`, gloss = `tg${uid}`, deep = `td${uid}`, glow = `tw${uid}`
  const line = LINE_C
  const tipFrom = iAt(0.9)
  const TIP = tube(LINE.slice(tipFrom), WIDTHS.slice(tipFrom))
  const bands = st >= 2 ? [0.36, 0.8] : st >= 1 ? [0.36] : []
  const ridges = [0.09, 0.17, 0.27, 0.44, 0.5, 0.56, 0.63, 0.7, 0.76, 0.84].filter((u) => bands.every((b) => Math.abs(u - b) > 0.04))
  // The arms: out at its sides, waving (hanging down when grumpy). [x, y, tilt]
  const arms: [number, number, number][] = g ? [[64, 121, 24], [131, 128, -20]] : [[63, 104, -42], [143, 101, 62]]
  // The right hand (the top end of the right arm, or its bottom end when it hangs down), holding the banner's pole
  const hand: Pt = g ? [134.8, 138.3] : [152.7, 95.8]
  const pole = st >= 2 ? 68 : 54

  return (
    <g>
      <defs>
        {gold.def}{arm.def}{banner.def}
        {/* along the horn: creamy at its mouth, golden at its tail */}
        <radialGradient id={along} gradientUnits="userSpaceOnUse" cx={MOUTH[0]} cy={MOUTH[1]} r={128}>
          <stop offset="0" stopColor={CREAM} />
          <stop offset="0.38" stopColor={CREAM} />
          <stop offset="0.7" stopColor={MID} />
          <stop offset="1" stopColor={GOLDEN} />
        </radialGradient>
        {/* round it: a soft shine on its left and shadow on its right */}
        <linearGradient id={gloss} x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.22" stopColor="#fff" stopOpacity={g ? 0.2 : 0.5} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#7a4a10" stopOpacity={0.16} />
        </linearGradient>
        <radialGradient id={deep} cx="50%" cy="65%" r="60%">
          <stop offset="0" stopColor={darken(INSIDE, 0.45)} />
          <stop offset="1" stopColor={INSIDE} />
        </radialGradient>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#fff2b0" stopOpacity={0.9} />
          <stop offset="0.6" stopColor="#ffe27a" stopOpacity={0.35} />
          <stop offset="1" stopColor="#ffe27a" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Jubileehorn's golden glow */}
      {st >= 2 && !g && <polygon points={ellipsePts(92, 106, 84, 78)} fill={`url(#${glow})`} pointerEvents="none" />}

      {/* A banner on a gold pole, held up in its right hand (a bigger one with a star for Jubileehorn); drooping
          when grumpy */}
      {st >= 1 && (
        <g transform={`translate(${pt(...hand)}) rotate(${g ? 38 : 15})`}>
          <path d={`M0 3 V${-pole}`} stroke={GOLD_LINE} strokeWidth={5} strokeLinecap="round" />
          <path d={`M0 3 V${-pole}`} stroke={GOLD} strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={0} cy={-pole - 3} r={4} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={1.6} />
          <g transform={`translate(0 ${-pole})${g ? ' rotate(58)' : ''}`}>
            <Anim cls="pa-tail" origin="0% 0%" delay={0.3}>
              {st >= 2 ? (
                <g>
                  <path d="M-1 4 Q13 0 27 5 L26 40 L18 32 L10 43 L4 36 Z" fill={banner.fill} stroke={ink(BANNER)} strokeWidth={2.2} strokeLinejoin="round" />
                  <path d={starPath(14, 20, 7.5)} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={1.5} strokeLinejoin="round" />
                  <path d="M0 6 Q13 2 26 7" stroke={GOLD} strokeWidth={2.4} fill="none" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  <path d="M-1 4 Q10 1 22 6 L20 27 L13 21 L6 30 L3 23 Z" fill={banner.fill} stroke={ink(BANNER)} strokeWidth={2.2} strokeLinejoin="round" />
                  <circle cx={11} cy={16} r={3.2} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={1.2} />
                </g>
              )}
            </Anim>
          </g>
        </g>
      )}

      {/* Little feet to march on */}
      {[[75, 172.5], [102, 171]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx={12} ry={7} fill={arm.fill} stroke={line} strokeWidth={2.8} />
      ))}

      {/* Stubby arms (waving, or hanging down when grumpy). The hand holding the banner keeps still, so it never lets go
          of the pole. */}
      {arms.map(([x, y, a], k) => {
        const el = <ellipse cx={x} cy={y} rx={6.5} ry={11} fill={arm.fill} stroke={line} strokeWidth={2.6} transform={`rotate(${a} ${pt(x, y)})`} />
        return k && st >= 1 ? <g key={k}>{el}</g> : (
          <Anim key={k} cls="pa-wing" origin={k ? '0% 60%' : '100% 60%'} delay={k * 0.4}>{el}</Anim>
        )
      })}

      {/* The horn, with ridges round it, gold bands as it grows and a golden mouthpiece */}
      <g className="pa-breathe">
        <path d={HORN} fill={`url(#${along})`} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <polygon points={GLOSS} fill={`url(#${gloss})`} pointerEvents="none" />
        {ridges.map((u) => <path key={u} d={ring(u)} stroke={line} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.45} />)}
        {bands.map((u) => (
          <g key={u} fill="none">
            <path d={ring(u, 2.6)} stroke={GOLD_LINE} strokeWidth={8} />
            <path d={ring(u, 2.6)} stroke={GOLD} strokeWidth={5} />
            <path d={ring(u, 2.6)} stroke="#fff" strokeWidth={1.4} opacity={0.6} strokeDasharray="3 9" />
          </g>
        ))}
        <path d={TIP} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={2} />

        {/* Its mouth: a lip round the opening, and the shadowy inside */}
        <g transform={`translate(${pt(...MOUTH)}) rotate(${MOUTH_TILT.toFixed(1)})`}>
          <ellipse rx={MOUTH_R} ry={MOUTH_R * 0.34} fill={CREAM} stroke={line} strokeWidth={3} />
          <ellipse cy={0.6} rx={MOUTH_R - 5} ry={MOUTH_R * 0.34 - 3.6} fill={`url(#${deep})`} />
        </g>
      </g>

      {/* Jubileehorn's tassel, hanging from its tail */}
      {st >= 2 && (
        <g>
          <path d="M36 118 Q29 126 30 136" stroke={GOLD_LINE} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <Anim cls="pa-tail" origin="50% 0%" delay={0.8}>
            <path d="M27 139 L22 158 L25.5 156 L28 160 L30 156 L32.5 160 L35 156 L38 158 L33 139 Z" fill={banner.fill} stroke={ink(BANNER)} strokeWidth={1.6} strokeLinejoin="round" />
            <path d="M28 143 L26 154 M32 143 L34 154" stroke={ink(BANNER)} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
            <circle cx={30} cy={137} r={4} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={1.4} />
          </Anim>
        </g>
      )}

      <CuteFace x={100} y={95} s={0.9} gap={15} mood={mood} blinkDelay={0.9} />

      {/* Music notes bouncing out of its mouth (a sour little puff of dust when grumpy) */}
      {g ? (
        <Anim cls="pa-twinkle">
          <g fill="#e2dccf" stroke="#b3a993" strokeWidth={1.8}>
            <circle cx={118} cy={33} r={6} /><circle cx={127} cy={27} r={7.5} /><circle cx={136} cy={33} r={5} />
          </g>
        </Anim>
      ) : (
        notes.slice(0, st + 1).map(([x, y, s, twin], i) => (
          <Anim key={i} cls="pa-float" delay={i * 0.5}>
            <Note x={x} y={y} s={s} color={NOTES[i]} twin={twin} />
          </Anim>
        ))
      )}

      {st >= 2 && !g && [[24, 58, 8], [176, 104, 7], [30, 176, 6], [174, 160, 5]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
