// Wild animals, birds and sea creatures. Each draws in a 100 x 100 box (see ./types.ts).
import type { CSSProperties } from 'react'
import type { Item } from './types'
import { CuteFace, darken, EYE, fluff, groundShadow, ink, lighten, Shine, useShade } from './draw'

// ---------- Local shape helpers ----------

type Pt = [number, number]
const n1 = (v: number) => Math.round(v * 10) / 10
const P = (x: number, y: number) => `${n1(x)} ${n1(y)}`

/** An ellipse as a path, so it can join other shapes in a Blob. */
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${P(cx - rx, cy)} A${rx} ${ry} 0 1 0 ${P(cx + rx, cy)} A${rx} ${ry} 0 1 0 ${P(cx - rx, cy)}Z`

/** Points along a smooth curve through `ps` (Catmull-Rom). */
function curve(ps: Pt[], steps = 8): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < ps.length - 1; i++) {
    const p0 = ps[Math.max(0, i - 1)], p1 = ps[i], p2 = ps[i + 1], p3 = ps[Math.min(ps.length - 1, i + 2)]
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t
      const c = (k: 0 | 1) => 0.5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3)
      out.push([c(0), c(1)])
    }
  }
  out.push(ps[ps.length - 1])
  return out
}

/**
 * A smooth body along a curve through `ps`, with round ends. Its width follows `ws`: [t, width] pairs,
 * t running from 0 at the first point to 1 at the last (by length along the curve).
 */
function tubeW(ps: Pt[], ws: [number, number][]): string {
  const c = curve(ps)
  const n = c.length
  const along = [0]
  for (let i = 1; i < n; i++) along.push(along[i - 1] + Math.hypot(c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1]))
  const wAt = (t: number) => {
    for (let i = 1; i < ws.length; i++) {
      if (t <= ws[i][0]) return ws[i - 1][1] + ((ws[i][1] - ws[i - 1][1]) * (t - ws[i - 1][0])) / (ws[i][0] - ws[i - 1][0] || 1)
    }
    return ws[ws.length - 1][1]
  }
  const L: Pt[] = [], R: Pt[] = []
  c.forEach(([x, y], i) => {
    const [ax, ay] = c[Math.max(0, i - 1)], [bx, by] = c[Math.min(n - 1, i + 1)]
    const len = Math.hypot(bx - ax, by - ay) || 1
    const h = wAt(along[i] / along[n - 1]) / 2
    const nx = (-(by - ay) / len) * h, ny = ((bx - ax) / len) * h
    L.push([x + nx, y + ny])
    R.push([x - nx, y - ny])
  })
  R.reverse()
  const r0 = wAt(0) / 2, r1 = wAt(1) / 2
  const run = (q: Pt[]) => q.map((p) => `L${P(...p)}`).join(' ')
  return `M${P(...L[0])} ${run(L.slice(1))} A${n1(r1)} ${n1(r1)} 0 0 0 ${P(...R[0])} ${run(R.slice(1))} A${n1(r0)} ${n1(r0)} 0 0 0 ${P(...L[0])}Z`
}

/** A smooth tube along a curve through `ps` (trunks, necks, tails, arms), tapering from width w0 to w1, with round ends. */
const tube = (ps: Pt[], w0: number, w1: number) => tubeW(ps, [[0, w0], [1, w1]])

/** A stripe tapering from width w at (x0, y0) to a point at (x1, y1), bowed sideways by `bow`. */
function wedge(x0: number, y0: number, x1: number, y1: number, w: number, bow = 0) {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1
  const nx = -dy / len, ny = dx / len
  const mx = (x0 + x1) / 2 + nx * bow, my = (y0 + y1) / 2 + ny * bow
  const h = w / 2
  return `M${P(x0 + nx * h, y0 + ny * h)} Q${P(mx + nx * h * 0.6, my + ny * h * 0.6)} ${P(x1, y1)} Q${P(mx - nx * h * 0.6, my - ny * h * 0.6)} ${P(x0 - nx * h, y0 - ny * h)}Z`
}

/** The top (or bottom) edge of an ellipse at x. */
const edgeY = (cx: number, cy: number, rx: number, ry: number, x: number, bottom = false) =>
  cy + (bottom ? 1 : -1) * ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2))

/** A band across an ellipse from x = xa to x = xb, its sides bowed towards the front by `bow` (fish stripes). */
function band(cx: number, cy: number, rx: number, ry: number, xa: number, xb: number, bow: number) {
  const top = (x: number) => P(x, edgeY(cx, cy, rx, ry, x)), bot = (x: number) => P(x, edgeY(cx, cy, rx, ry, x, true))
  return `M${top(xa)} Q${P(xa - bow, cy)} ${bot(xa)} A${rx} ${ry} 0 0 0 ${bot(xb)} Q${P(xb - bow, cy)} ${top(xb)} A${rx} ${ry} 0 0 0 ${top(xa)}Z`
}

/** A giraffe patch: a rounded, slightly irregular polygon. */
function patch(cx: number, cy: number, r: number, k: number) {
  const n = 5 + (k % 2)
  const ps: Pt[] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + k
    const rr = r * (0.84 + 0.16 * Math.sin(k * 3.1 + i * 2.3))
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.88]
  })
  const mid = (a: Pt, b: Pt) => P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
  return `M${mid(ps[n - 1], ps[0])}` + ps.map((p, i) => ` Q${P(...p)} ${mid(p, ps[(i + 1) % n])}`).join('') + 'Z'
}

/** Several shapes drawn as one: a shared outline with no seams inside (outlines first at double width, then fills). */
function Blob({ ds, fill, line, w = 2.5 }: { ds: string[]; fill: string; line: string; w?: number }) {
  return (
    <g>
      {ds.map((d, i) => <path key={`o${i}`} d={d} fill={line} stroke={line} strokeWidth={w * 2} strokeLinejoin="round" />)}
      {ds.map((d, i) => <path key={i} d={d} fill={fill} />)}
    </g>
  )
}

// ---------- Animals ----------

/** A friendly lion sitting up, facing us, with a big fluffy mane. */
function Lion() {
  const fur = useShade('#ffc65a', 0.4, 0.15)
  const mane = useShade('#e0862a', 0.3, 0.18)
  return (
    <g>
      <defs>{fur.def}{mane.def}</defs>
      <ellipse {...groundShadow(50, 93, 28)} />
      {/* tail, curling up behind */}
      <path d="M68 84 Q88 84 86 66" stroke={ink('#ffc65a')} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d={fluff(86, 62, 5, 6, 5)} fill={mane.fill} stroke={ink('#e0862a')} strokeWidth={1.8} />
      {/* body and front paws */}
      <ellipse cx={50} cy={76} rx={21} ry={16} fill={fur.fill} stroke={ink('#ffc65a')} strokeWidth={2.5} />
      <ellipse cx={41} cy={90} rx={7} ry={4.5} fill={fur.fill} stroke={ink('#ffc65a')} strokeWidth={2.2} />
      <ellipse cx={59} cy={90} rx={7} ry={4.5} fill={fur.fill} stroke={ink('#ffc65a')} strokeWidth={2.2} />
      {/* mane, ears, face */}
      <path d={fluff(50, 40, 31, 29, 13)} fill={mane.fill} stroke={ink('#e0862a')} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={35} cy={24} r={6.5} fill={fur.fill} stroke={ink('#ffc65a')} strokeWidth={2.2} />
      <circle cx={65} cy={24} r={6.5} fill={fur.fill} stroke={ink('#ffc65a')} strokeWidth={2.2} />
      <circle cx={35} cy={24} r={3} fill="#ff9fb8" />
      <circle cx={65} cy={24} r={3} fill="#ff9fb8" />
      <ellipse cx={50} cy={42} rx={19} ry={18} fill={fur.fill} stroke={ink('#ffc65a')} strokeWidth={2.5} />
      <ellipse cx={50} cy={51} rx={10} ry={7} fill="#fff1d6" />
      <path d="M45.5 46.5 Q50 44 54.5 46.5 Q52 51 50 51.5 Q48 51 45.5 46.5 Z" fill="#7a3b2a" />
      <path d="M50 51.5 L50 54 M50 54 Q46 57.5 43.5 55 M50 54 Q54 57.5 56.5 55" stroke="#7a3b2a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <CuteFace x={50} y={38} s={0.4} gap={15} mouth={false} />
      <Shine x={38} y={33} rx={5} ry={3} />
    </g>
  )
}

/** A friendly grey elephant facing us, with big floppy ears, little tusks and a trunk curling up at the tip. */
function Elephant() {
  const GREY = '#a9b5cc'
  const skin = useShade(GREY, 0.4, 0.16)
  const line = ink(GREY)
  const NAIL = '#f7f1e6'
  return (
    <g>
      <defs>{skin.def}</defs>
      <ellipse {...groundShadow(50, 93, 32)} />
      {/* back legs peeking out behind the front ones */}
      {[23, 66].map((x) => <rect key={x} x={x} y={69} width={11} height={21} rx={5} fill={darken(GREY, 0.1)} stroke={line} strokeWidth={2.5} />)}
      <ellipse cx={50} cy={67} rx={27} ry={16} fill={skin.fill} stroke={line} strokeWidth={2.5} />
      {[34, 54].map((x) => (
        <g key={x}>
          <rect x={x} y={70} width={12} height={22} rx={5.5} fill={skin.fill} stroke={line} strokeWidth={2.5} />
          {[-3.3, 0, 3.3].map((d) => <ellipse key={d} cx={x + 6 + d} cy={89.4} rx={1.5} ry={1.2} fill={NAIL} />)}
        </g>
      ))}
      {/* big floppy ears */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={50 + s * 25} cy={41} rx={16} ry={19.5} transform={`rotate(${s * -12} ${50 + s * 25} 41)`} fill={skin.fill} stroke={line} strokeWidth={2.5} />
          <ellipse cx={50 + s * 26} cy={42} rx={10} ry={13} transform={`rotate(${s * -12} ${50 + s * 26} 42)`} fill="#ffbccf" />
        </g>
      ))}
      {/* little tusks, under the head */}
      <path d="M45.5 50 C42.5 54 39.5 58 38.5 63 C41.5 62 44.5 58.5 47 54 Z M54.5 50 C57.5 54 60.5 58 61.5 63 C58.5 62 55.5 58.5 53 54 Z" fill={NAIL} stroke="#c2b59c" strokeWidth={1.8} strokeLinejoin="round" />
      {/* head and trunk as one shape */}
      <Blob ds={[ell(50, 38, 20, 18), tube([[50, 44], [50, 57], [51, 66], [56, 70], [61, 66]], 12, 6.5)]} fill={skin.fill} line={line} />
      <path d="M47 60 Q50.3 61.4 53.6 60 M47.8 64.6 Q50.8 65.8 53.6 64.2" stroke={line} strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.65} />
      <ellipse cx={61.3} cy={65.6} rx={1.7} ry={1.3} fill={darken(GREY, 0.4)} />
      <CuteFace x={50} y={36} s={0.4} gap={14} mouth={false} />
      <Shine x={40} y={28} rx={5} ry={3} />
    </g>
  )
}

/** A tall giraffe with a long spotty neck, two little horns (ossicones) and a tufted tail. */
function Giraffe() {
  const COAT = '#ffcf5e'
  const SPOT = '#d4843a'
  const HOOF = '#7a5236'
  const MUZ = '#fff2d2'
  const coat = useShade(COAT, 0.4, 0.15)
  const line = ink(COAT)
  const legs = (xs: number[], fill: string) => xs.map((x) => (
    <g key={x}>
      <rect x={x - 3.5} y={64} width={7} height={27} rx={3} fill={fill} stroke={line} strokeWidth={2.2} />
      <rect x={x - 3.6} y={87.5} width={7.2} height={4} rx={1.8} fill={HOOF} stroke={ink(HOOF)} strokeWidth={1.4} />
    </g>
  ))
  return (
    <g>
      <defs>{coat.def}</defs>
      <ellipse {...groundShadow(58, 93, 28)} />
      {/* tail with a dark tuft */}
      <path d="M80 58 Q86 64 85.5 74" stroke={line} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M85.5 71 C88.5 73 88.5 80 85.5 83 C82.5 80 82.5 73 85.5 71 Z" fill={SPOT} stroke={ink(SPOT)} strokeWidth={1.6} />
      {legs([51, 68], darken(COAT, 0.12))}
      {legs([43, 76], coat.fill)}
      {/* mane along the back of the neck */}
      <path d={tube([[38, 17], [42, 29], [48, 42], [56, 51]], 5, 5)} fill={SPOT} stroke={ink(SPOT)} strokeWidth={1.6} />
      {/* long neck rising out of the body */}
      <Blob ds={[tube([[47, 60], [41, 46], [36, 32], [33, 22]], 16, 10), ell(60, 61, 22, 12.5)]} fill={coat.fill} line={line} />
      {[[50, 55, 3.8], [61, 53.5, 4.2], [72, 56.5, 3.8], [55, 65.5, 4], [67, 66, 3.8], [77, 63.5, 2.6], [43.5, 51, 3.2], [39, 40.5, 2.9], [35.8, 31, 2.4]].map(([x, y, r], i) => (
        <path key={i} d={patch(x, y, r, i + 1)} fill={SPOT} />
      ))}
      {/* ossicones (little horns) and ears */}
      {[[28, 14, 26.5, 6], [36, 14, 37.5, 6]].map(([x0, y0, x1, y1]) => (
        <g key={x0}>
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={line} strokeWidth={5.6} strokeLinecap="round" />
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={COAT} strokeWidth={3} strokeLinecap="round" />
          <circle cx={x1} cy={y1} r={2.8} fill={SPOT} stroke={ink(SPOT)} strokeWidth={1.5} />
        </g>
      ))}
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={32 + s * 11.5} cy={17} rx={6.5} ry={3.2} transform={`rotate(${s * 22} ${32 + s * 11.5} 17)`} fill={coat.fill} stroke={line} strokeWidth={2} />
      ))}
      {/* head with a pale muzzle */}
      <ellipse cx={32} cy={21} rx={10.5} ry={10} fill={coat.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={32} cy={28.5} rx={8.5} ry={6} fill={MUZ} stroke={line} strokeWidth={2} />
      <ellipse cx={29.3} cy={27.5} rx={1.2} ry={1.6} fill={SPOT} />
      <ellipse cx={34.7} cy={27.5} rx={1.2} ry={1.6} fill={SPOT} />
      <path d="M29.5 30.8 Q32 32.8 34.5 30.8" stroke={EYE} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <CuteFace x={32} y={19.5} s={0.34} gap={12} mouth={false} />
      <Shine x={26} y={15} rx={3.5} ry={2} />
    </g>
  )
}

/** A zebra standing side-on: bold black-and-white stripes, a striped mane and a tufted tail. */
function Zebra() {
  const WHITE = '#fbfaff'
  const INK = '#38334a'
  const MUZ = '#8a8399'
  const coat = useShade(WHITE, 0.5, 0.12)
  const legs = (xs: number[], fill: string) => xs.map((x) => (
    <g key={x}>
      <rect x={x - 3.6} y={62} width={7.2} height={29} rx={3} fill={fill} stroke={INK} strokeWidth={2.2} />
      <path d={`M${x - 3.6} 72.5 h7.2 M${x - 3.6} 79.5 h7.2`} stroke={INK} strokeWidth={2.6} />
      <rect x={x - 3.9} y={86.5} width={7.8} height={5} rx={1.8} fill={INK} />
    </g>
  ))
  const B = [58, 58, 24, 14] as const
  const body = ell(...B)
  const neck = tube([[45, 56], [39, 44], [33, 32]], 18, 13)
  const maneLine: Pt[] = [[34, 20], [40.5, 27], [47, 36], [54, 45]]
  const mane = curve(maneLine, 3)
  return (
    <g>
      <defs>{coat.def}</defs>
      <ellipse {...groundShadow(56, 93, 30)} />
      {/* tail with a dark tuft */}
      <path d="M80 54 Q86 60 85.5 72" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <path d="M85.5 69 C88.5 71 88.5 78 85.5 81 C82.5 78 82.5 71 85.5 69 Z" fill={INK} />
      {legs([50, 66], '#e4e2ec')}
      {legs([41, 75], coat.fill)}
      {/* a short, stiff mane along the back of the neck, striped white */}
      <path d={tube(maneLine, 8, 6.5)} fill={INK} />
      {mane.slice(1, -1).map(([x, y], i) => {
        const [ax, ay] = mane[i], [bx, by] = mane[i + 2]
        const len = Math.hypot(bx - ax, by - ay)
        const nx = (-(by - ay) / len) * 3.6, ny = ((bx - ax) / len) * 3.6
        return <path key={i} d={`M${P(x, y)} L${P(x + nx, y + ny)}`} stroke={coat.fill} strokeWidth={1.7} strokeLinecap="round" />
      })}
      {/* neck behind the body, both sharing one outline; stripes round the neck, then down the body */}
      {[neck, body].map((d) => <path key={d} d={d} fill={INK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />)}
      <path d={neck} fill={coat.fill} />
      {[[46.7, 41.7, 34.7, 47.7], [43.1, 35.9, 32.1, 41.4]].map(([x0, y0, x1, y1]) => <path key={x0} d={wedge(x0, y0, x1, y1, 4.4)} fill={INK} />)}
      <path d={body} fill={coat.fill} />
      {[52, 58.5, 65, 71.5, 77.5].map((x, i) => (
        <path key={x} d={wedge(x, edgeY(...B, x) - 1, x - 2.5, 63 + (i % 2) * 3.5, 4.6, 1)} fill={INK} />
      ))}
      {[39.5, 46, 55, 62, 69].map((x) => <path key={x} d={wedge(x, edgeY(...B, x, true) + 1, x + 1.5, 62.5, 3.8)} fill={INK} />)}
      {/* ears, head, muzzle */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`rotate(${s * 20} ${30 + s * 6.5} 19)`}>
          <ellipse cx={30 + s * 6.5} cy={19} rx={4.2} ry={7.5} fill={coat.fill} stroke={INK} strokeWidth={2.2} />
          <ellipse cx={30 + s * 6.5} cy={20.5} rx={2} ry={4} fill="#ffc6d6" />
          <path d={`M${30 + s * 6.5 - 3.5} 15 A4.2 7.5 0 0 1 ${30 + s * 6.5 + 3.5} 15 Z`} fill={INK} />
        </g>
      ))}
      <ellipse cx={30} cy={31} rx={11} ry={12} fill={coat.fill} stroke={INK} strokeWidth={2.5} />
      {[[30, 19, 30, 25.2, 3.4], [24.6, 20.6, 27, 25.6, 2.8], [35.4, 20.6, 33, 25.6, 2.8]].map(([x0, y0, x1, y1, w]) => (
        <path key={x0} d={wedge(x0, y0, x1, y1, w)} fill={INK} />
      ))}
      <ellipse cx={30} cy={40.5} rx={9} ry={6.5} fill={MUZ} stroke={INK} strokeWidth={2.2} />
      <ellipse cx={26.8} cy={39.5} rx={1.3} ry={1.8} fill={INK} />
      <ellipse cx={33.2} cy={39.5} rx={1.3} ry={1.8} fill={INK} />
      <path d="M27.5 43 Q30 45 32.5 43" stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <CuteFace x={30} y={30} s={0.34} gap={12} mouth={false} />
      <Shine x={24} y={26} rx={3.5} ry={2} />
    </g>
  )
}

/** A cheeky brown monkey sitting up, with a peachy face, round ears and a curly tail. */
function Monkey() {
  const FUR = '#b47a4e'
  const FACE = '#ffd9b3'
  const fur = useShade(FUR, 0.35, 0.18)
  const line = ink(FUR)
  const tail = 'M60 86 C76 90 88 80 86 66 C85 58 77 56 75 62 C74 67 80 69 82 65'
  return (
    <g>
      <defs>{fur.def}</defs>
      <ellipse {...groundShadow(50, 93, 26)} />
      {/* curly tail */}
      <path d={tail} stroke={line} strokeWidth={7.5} fill="none" strokeLinecap="round" />
      <path d={tail} stroke={FUR} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* body, tummy, feet and arms */}
      <ellipse cx={50} cy={73} rx={17} ry={16} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={76} rx={10} ry={10} fill={FACE} />
      {[39, 61].map((x) => <ellipse key={x} cx={x} cy={89} rx={7} ry={4.5} fill={FACE} stroke={line} strokeWidth={2} />)}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={tube([[50 + s * 14, 62], [50 + s * 18, 72], [50 + s * 14, 81]], 8, 7)} fill={fur.fill} stroke={line} strokeWidth={2.2} />
          <circle cx={50 + s * 13.5} cy={82} r={4.5} fill={FACE} stroke={line} strokeWidth={2} />
        </g>
      ))}
      {/* ears and head */}
      {[28, 72].map((x) => (
        <g key={x}>
          <circle cx={x} cy={40} r={9} fill={fur.fill} stroke={line} strokeWidth={2.5} />
          <circle cx={x} cy={40} r={5} fill={FACE} />
        </g>
      ))}
      <circle cx={50} cy={40} r={20} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <path d="M47 21 C46 15 52 13 55 16 C52 16 50.5 18 52 20.5" stroke={line} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* peachy face */}
      {[ell(43, 38, 8.5, 9), ell(57, 38, 8.5, 9), ell(50, 48, 12.5, 8.5)].map((d) => <path key={d} d={d} fill={FACE} />)}
      <ellipse cx={47.8} cy={46} rx={1.2} ry={1} fill={line} />
      <ellipse cx={52.2} cy={46} rx={1.2} ry={1} fill={line} />
      <path d="M45 50 Q50 54.5 55 50" stroke={EYE} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <CuteFace x={50} y={38} s={0.38} gap={13} mouth={false} />
      <Shine x={37} y={28} rx={4.5} ry={2.6} />
    </g>
  )
}

/** A gentle gorilla sitting with its knuckles on the ground: dark fur, a soft grey face and a kind smile. */
function Gorilla() {
  const FUR = '#5e5872'
  const SKIN = '#aaa0b6'
  const fur = useShade(FUR, 0.35, 0.2)
  const skin = useShade(SKIN, 0.35, 0.1)
  const line = ink(FUR)
  return (
    <g>
      <defs>{fur.def}{skin.def}</defs>
      <ellipse {...groundShadow(50, 93, 38)} />
      {/* feet */}
      {[37, 63].map((x) => <ellipse key={x} cx={x} cy={89} rx={8} ry={4.5} fill={fur.fill} stroke={line} strokeWidth={2.2} />)}
      {/* big body with a paler chest */}
      <path d="M26 60 C26 46 38 42 50 42 C62 42 74 46 74 60 C76 76 68 90 50 90 C32 90 24 76 26 60 Z" fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <path d="M40 58 C44 55 56 55 60 58 C62 66 58 74 50 75 C42 74 38 66 40 58 Z" fill={SKIN} opacity={0.55} />
      {/* long arms, knuckles on the ground */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={tube([[50 + s * 20, 50], [50 + s * 28, 66], [50 + s * 30, 84]], 14, 12)} fill={fur.fill} stroke={line} strokeWidth={2.5} />
          <ellipse cx={50 + s * 30} cy={87} rx={7.5} ry={5.5} fill={skin.fill} stroke={line} strokeWidth={2.2} />
          <path d={`M${50 + s * 30 - 3} 84 v3 M${50 + s * 30} 83.5 v3.5 M${50 + s * 30 + 3} 84 v3`} stroke={line} strokeWidth={1.4} strokeLinecap="round" />
        </g>
      ))}
      {/* head with a little peak, small ears */}
      {[33, 67].map((x) => <circle key={x} cx={x} cy={36} r={4.5} fill={skin.fill} stroke={line} strokeWidth={2} />)}
      <path d="M33 36 C33 22 40 14 50 14 C60 14 67 22 67 36 C67 48 60 54 50 54 C40 54 33 48 33 36 Z" fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <path d="M38 32 C38 26 44 25 50 28 C56 25 62 26 62 32 C66 38 64 50 50 51 C36 50 34 38 38 32 Z" fill={skin.fill} stroke={darken(SKIN, 0.25)} strokeWidth={1.5} />
      <ellipse cx={47} cy={42} rx={1.8} ry={1.3} fill={FUR} />
      <ellipse cx={53} cy={42} rx={1.8} ry={1.3} fill={FUR} />
      <path d="M45 46 Q50 49.5 55 46" stroke={EYE} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <CuteFace x={50} y={34} s={0.36} gap={12} mouth={false} />
      <Shine x={41} y={21} rx={5} ry={2.8} />
    </g>
  )
}

/** A cuddly brown bear sitting up, facing us, with round ears and a pale muzzle. */
function Bear() {
  const FUR = '#b9804f'
  const PALE = '#f3d6ae'
  const fur = useShade(FUR, 0.38, 0.18)
  const line = ink(FUR)
  return (
    <g>
      <defs>{fur.def}</defs>
      <ellipse {...groundShadow(50, 93, 28)} />
      <ellipse cx={50} cy={72} rx={21} ry={18} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={76} rx={12} ry={10.5} fill={PALE} />
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={50 + s * 18} cy={70} rx={6} ry={10} transform={`rotate(${s * -20} ${50 + s * 18} 70)`} fill={fur.fill} stroke={line} strokeWidth={2.4} />
      ))}
      {[37, 63].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={88} rx={8} ry={5.5} fill={fur.fill} stroke={line} strokeWidth={2.4} />
          <ellipse cx={x} cy={88.6} rx={4.6} ry={3.2} fill={PALE} />
        </g>
      ))}
      {[32, 68].map((x) => (
        <g key={x}>
          <circle cx={x} cy={22} r={8} fill={fur.fill} stroke={line} strokeWidth={2.5} />
          <circle cx={x} cy={22} r={4.3} fill={PALE} />
        </g>
      ))}
      <circle cx={50} cy={39} r={20} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={47.5} rx={10} ry={7.5} fill={PALE} />
      <path d="M46 44 Q50 42 54 44 Q52.5 47.5 50 48 Q47.5 47.5 46 44 Z" fill="#5a3826" />
      <path d="M50 48 L50 50 M50 50 Q47 52.5 45 51 M50 50 Q53 52.5 55 51" stroke="#5a3826" strokeWidth={1.7} fill="none" strokeLinecap="round" />
      <CuteFace x={50} y={36} s={0.4} gap={14} mouth={false} />
      <Shine x={39} y={29} rx={5} ry={3} />
    </g>
  )
}

/** An orange fox sitting up, facing us: pointy dark-tipped ears, a white muzzle and a big bushy tail. */
function Fox() {
  const ORANGE = '#ff9a45'
  const WHITE = '#fff8ef'
  const DARK = '#5b3b3b'
  const fur = useShade(ORANGE, 0.4, 0.16)
  const line = ink(ORANGE)
  return (
    <g>
      <defs>{fur.def}</defs>
      <ellipse {...groundShadow(52, 93, 30)} />
      {/* bushy tail with a white tip */}
      <path d="M58 90 C76 93 92 82 90 62 C89 54 84 49 79 51 C82 62 78 76 60 81 Z" fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M79 51 C84 49 89 54 90 62 C90 64 89.6 66 89 68 C85 64 81.5 59 79 51 Z" fill={WHITE} stroke={line} strokeWidth={2} strokeLinejoin="round" />
      {/* sitting body with a white chest and dark socks */}
      <ellipse cx={50} cy={75} rx={16} ry={16} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <path d="M50 60 C56 62 58 70 56 80 C54 84 46 84 44 80 C42 70 44 62 50 60 Z" fill={WHITE} />
      {[44, 56].map((x) => (
        <g key={x}>
          <rect x={x - 3.6} y={76} width={7.2} height={15.5} rx={3.2} fill={fur.fill} stroke={line} strokeWidth={2.2} />
          <rect x={x - 3.6} y={84} width={7.2} height={7.5} rx={3.2} fill={DARK} />
        </g>
      ))}
      {/* pointy ears with dark tips */}
      {[-1, 1].map((s) => {
        const X = (x: number) => 50 + s * (x - 50)
        return (
          <g key={s}>
            <path d={`M${X(30)} 32 C${X(28)} 23 ${X(27.5)} 15 ${X(29)} 8 C${X(35)} 11 ${X(41)} 16 ${X(45)} 24 Z`} fill={fur.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
            <path d={`M${X(29)} 8 C${X(31.5)} 9.2 ${X(34)} 10.8 ${X(36.3)} 12.8 C${X(33)} 13.2 ${X(30.2)} 14.5 ${X(28.3)} 16.2 C${X(28.1)} 13.4 ${X(28.4)} 10.6 ${X(29)} 8 Z`} fill={DARK} />
            <path d={`M${X(32)} 28 C${X(31)} 23 ${X(31)} 19 ${X(31.5)} 16.5 C${X(35)} 18.5 ${X(38.5)} 21.5 ${X(41)} 25 Z`} fill={WHITE} />
          </g>
        )
      })}
      {/* head: round on top, fluffy cheeks, white muzzle */}
      <path d="M50 22 C62 22 70 28 71 38 C72 42 75 45 78 47 C72 50 66 52 60 54 Q55 59 50 59 Q45 59 40 54 C34 52 28 50 22 47 C25 45 28 42 29 38 C30 28 38 22 50 22 Z" fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M23 47 C29 44 35 43.5 41 45 C44.5 46 47 48.5 50 51.5 C53 48.5 55.5 46 59 45 C65 43.5 71 44 77 47 C71 50 65.5 52 60 54 Q55 59 50 59 Q45 59 40 54 C34.5 52 29 50 23 47 Z" fill={WHITE} />
      <path d="M47 51.5 Q50 50 53 51.5 Q51.5 54.5 50 54.6 Q48.5 54.5 47 51.5 Z" fill={DARK} />
      <path d="M50 54.6 L50 55.8 M47 56.2 Q50 58.4 53 56.2" stroke={DARK} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <CuteFace x={50} y={39} s={0.38} gap={14} mouth={false} />
      <Shine x={40} y={30} rx={4.5} ry={2.6} />
    </g>
  )
}

/** A penguin standing up, facing us: a dark back, a white tummy and face, an orange beak and feet. */
function Penguin() {
  const NAVY = '#3f4d70'
  const BEAK = '#ffb02e'
  const coat = useShade(NAVY, 0.3, 0.2)
  const belly = useShade('#ffffff', 0.4, 0.07)
  const line = ink(NAVY)
  return (
    <g>
      <defs>{coat.def}{belly.def}</defs>
      <ellipse {...groundShadow(50, 93, 24)} />
      {/* orange feet */}
      {[41, 59].map((x) => <path key={x} d={`M${x - 7} 92 Q${x - 5} 85 ${x} 85 Q${x + 5} 85 ${x + 7} 92 Z`} fill={BEAK} stroke={ink(BEAK)} strokeWidth={2} strokeLinejoin="round" />)}
      {/* flippers at the sides */}
      {[-1, 1].map((s) => {
        const X = (x: number) => 50 + s * (x - 50)
        return <path key={s} d={`M${X(27)} 48 C${X(17)} 54 ${X(13)} 66 ${X(15)} 75 C${X(21)} 72 ${X(27)} 65 ${X(30)} 58 Z`} fill={coat.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      })}
      <ellipse cx={50} cy={56} rx={26} ry={34} fill={coat.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={66} rx={18} ry={22.5} fill={belly.fill} />
      <path d="M50 35 C46 28 34.5 28 33.5 37 C32.5 46 41 52 50 54 C59 52 67.5 46 66.5 37 C65.5 28 54 28 50 35 Z" fill={belly.fill} />
      <path d="M45 44.5 Q50 42 55 44.5 Q52 50.5 50 50.8 Q48 50.5 45 44.5 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={1.6} strokeLinejoin="round" />
      <CuteFace x={50} y={39.5} s={0.38} gap={12} mouth={false} />
      <Shine x={42} y={26.5} rx={4.5} ry={2.2} rot={-20} />
    </g>
  )
}

/** An eagle facing us, wings spread wide from its shoulders: brown body, white head and tail, a hooked yellow beak. */
function Eagle() {
  const BROWN = '#8f5e3e'
  const WHITE = '#fbf8f1'
  const BEAK = '#ffc23a'
  const brown = useShade(BROWN, 0.35, 0.18)
  const white = useShade(WHITE, 0.4, 0.08)
  const line = ink(BROWN)
  // the left wing, from the shoulder out to rounded flight feathers along its outer edge
  const wing = 'M40 46 C33 38 22 30 10 26 C6 25 2 26 2.5 28.5 C3 30.5 6 31 8.5 31 C4 32 1.5 34 2.2 36.2 C3 38.5 6.5 38.8 9.5 38.5 ' +
    'C5.5 40 3.5 42.5 4.3 44.5 C5.5 46.5 9.5 46.5 12.5 45.5 C9.5 47.5 8.5 50 9.8 51.8 C11.5 53.5 15.5 53 18 51 ' +
    'C16.5 53 16 56 17.6 57.8 C19.5 59.5 23 58.5 25 56 C25 58.5 24.5 61 26.2 62.4 C28.5 63.8 31.5 62 33 59.5 L41 62 Z'
  const flip = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${n1(100 - Number(x))} ${y}`)
  return (
    <g transform="translate(0 -4)">
      <defs>{brown.def}{white.def}</defs>
      {/* wings spread out from the shoulders */}
      {[-1, 1].map((s) => {
        const X = (x: number) => (s < 0 ? x : 100 - x)
        return (
          <g key={s}>
            <path d={s < 0 ? wing : flip(wing)} fill={brown.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
            <path d={[[8.5, 31], [9.5, 38.5], [12.5, 45.5], [18, 51], [25, 56], [33, 59.5]].map(([x, y]) => `M${X(x)} ${y} L${X(x + 7)} ${y - 3.5}`).join(' ')}
              stroke={line} strokeWidth={1.6} strokeLinecap="round" opacity={0.55} />
            <path d={`M${X(36)} 49 Q${X(26)} 40 ${X(14)} 33`} stroke={lighten(BROWN, 0.3)} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          </g>
        )
      })}
      {/* white tail fan */}
      <path d="M43 74 L37 90 Q50 95 63 90 L57 74 Z" fill={white.fill} stroke={ink(WHITE)} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M46 80 L44 90 M50 80 V91.5 M54 80 L56 90" stroke={ink(WHITE)} strokeWidth={1.4} strokeLinecap="round" />
      <ellipse cx={50} cy={60} rx={15} ry={19} fill={brown.fill} stroke={line} strokeWidth={2.5} />
      {/* yellow feet with little dark talons */}
      {[44, 56].map((x) => (
        <g key={x}>
          <path d={`M${x - 3} 82.6 l-0.6 1.6 M${x} 83 v1.8 M${x + 3} 82.6 l0.6 1.6`} stroke={EYE} strokeWidth={1.4} strokeLinecap="round" />
          <path d={`M${x - 4.6} 82 C${x - 4.6} 78 ${x - 2.5} 76.5 ${x} 76.5 C${x + 2.5} 76.5 ${x + 4.6} 78 ${x + 4.6} 82 C${x + 3} 83.4 ${x - 3} 83.4 ${x - 4.6} 82 Z`} fill={BEAK} stroke={ink(BEAK)} strokeWidth={1.5} strokeLinejoin="round" />
        </g>
      ))}
      {/* white head, its feathers overlapping the brown body, and a hooked beak */}
      <path d="M36.5 33 C36.5 24 42.5 19 50 19 C57.5 19 63.5 24 63.5 33 C63.5 37.5 62 41 59.5 43.5 L61.5 47 L56.5 46 L55 49.5 L50 46.8 L45 49.5 L43.5 46 L38.5 47 L40.5 43.5 C38 41 36.5 37.5 36.5 33 Z"
        fill={white.fill} stroke={ink(WHITE)} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M44.5 37 Q50 34 55.5 37 Q55.5 42.5 51.2 46.5 Q50 49.2 48.8 46.5 Q44.5 42.5 44.5 37 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M46.2 39.4 Q50 41 53.8 39.4" stroke={ink(BEAK)} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.7} />
      <CuteFace x={50} y={30} s={0.36} gap={12} mouth={false} />
      <Shine x={43} y={25} rx={4} ry={2.4} />
    </g>
  )
}

/** A little round songbird (a bluebird) with a peachy breast, perched on two thin legs. */
function Bird() {
  const BLUE = '#5ba8f0'
  const BREAST = '#ffbd8c'
  const BEAK = '#ffc23a'
  const LEG = '#e58a5a'
  const blue = useShade(BLUE, 0.4, 0.16)
  const wingC = darken(BLUE, 0.12)
  const wing = useShade(wingC, 0.3, 0.15)
  const line = ink(BLUE)
  return (
    <g>
      <defs>{blue.def}{wing.def}</defs>
      <ellipse {...groundShadow(50, 93, 20)} />
      <path d="M66 62 C72 54 80 46 90 40 C93 45 92 50 88 53 C92 55 91 61 86 63 C80 66 72 69 66 70 Z" fill={wing.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M45 78 L44 90 M55 78 L56 90 M40 91.5 L44 90 L47.5 91.5 M52.5 91.5 L56 90 L60 91.5" stroke={LEG} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Blob ds={[ell(53, 62, 22, 18.5), ell(40, 41, 15.5, 15)]} fill={blue.fill} line={line} />
      {/* peachy breast, down the front of the body */}
      <path d="M35.5 51 C31 58 31.5 69 37 75 C42 80 50 81 56 80 C51 75 49.5 69 49.5 63 C49.5 57 46 52.5 40.5 50 Z" fill={BREAST} />
      <path d="M50 55 C58 48 72 50 79 61 C72 67 62 70 54 68 C49 64 48 59 50 55 Z" fill={wing.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M58 58 Q66 58 72 62 M56 63 Q63 64 68 66" stroke={ink(wingC)} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d="M39 44 L30.5 47.5 L39 50 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={1.6} strokeLinejoin="round" />
      <CuteFace x={39} y={40.5} s={0.34} gap={12} mouth={false} />
      <Shine x={33} y={33} rx={4} ry={2.4} />
    </g>
  )
}

/** A white dove flying, both wings raised from its shoulders and its tail fanned out behind. */
function Dove() {
  const WHITE = '#f7faff'
  const LINE = '#9cb2d6' // a soft blue-grey outline suits a white bird (a little deeper than the Pal's, to read when small)
  const BEAK = '#ffb347'
  const white = useShade(WHITE, 0.6, 0.1)
  const far = useShade('#dfe8f6', 0.4, 0.12)
  return (
    <g transform="translate(1 6)">
      <defs>{white.def}{far.def}</defs>
      {/* far wing, rising from the far shoulder behind the body */}
      <path d="M65 53 C65 38 61 22 53 7 C51 13 48 15 44 15 C46 20 45 24 41 26 C43 30 42 34 38 36 C47 43 57 48 65 53 Z" fill={far.fill} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
      {/* fanned tail */}
      <path d="M30 64 L12 58 Q14 64 10 68 Q14 72 12 78 L30 72 Z" fill={white.fill} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
      {/* body and head */}
      <path d="M24 68 C30 56 52 50 68 54 C78 57 77 69 64 74 C50 78 32 76 24 68 Z" fill={white.fill} stroke={LINE} strokeWidth={2.4} />
      <circle cx={72} cy={47} r={11.5} fill={white.fill} stroke={LINE} strokeWidth={2.4} />
      {/* (side-on, like the story pictures' dove: one big glossy eye, a pink cheek, the beak pointing ahead) */}
      <path d="M82 45.2 L91.5 48.6 L82 52 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={1.5} strokeLinejoin="round" />
      <ellipse cx={75.5} cy={50.5} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.5} />
      <g className="pa-blink" style={{ '--d': '1.1s' } as CSSProperties}>
        <ellipse cx={75.6} cy={44.6} rx={2.7} ry={3.3} fill={EYE} />
        <circle cx={74.7} cy={43.3} r={1.1} fill="#fff" />
        <circle cx={76.5} cy={45.8} r={0.5} fill="#fff" opacity={0.85} />
      </g>
      {/* near wing, in front, from the near shoulder */}
      <path d="M60 58 C56 41 44 25 24 15 C26 22 22 26 16 26 C21 32 19 36 13 37 C19 42 17 46 13 49 C27 54 44 58 60 58 Z" fill={white.fill} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M36 32 Q45 41 52 52 M28 40 Q38 47 46 54" stroke="#dbe5f3" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Shine x={34} y={28} rx={5} ry={2.6} />
    </g>
  )
}

/** A simple, friendly blue fish with a forked tail (the one children count). */
function Fish() {
  const BLUE = '#5fb2ff'
  const FIN = '#3f8fe6'
  const body = useShade(BLUE, 0.4, 0.16)
  const fin = useShade(FIN, 0.3, 0.12)
  const line = ink(BLUE)
  return (
    <g transform="translate(0 4)">
      <defs>{body.def}{fin.def}</defs>
      <path d="M70 50 C76 42 82 34 92 28 C95 36 94 44 88 50 C94 56 95 64 92 72 C82 66 76 58 70 50 Z" fill={fin.fill} stroke={ink(FIN)} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M34 30 C38 18 54 16 64 30 Z" fill={fin.fill} stroke={ink(FIN)} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M8 50 C8 36 24 26 42 26 C58 26 70 38 74 50 C70 62 58 74 42 74 C24 74 8 64 8 50 Z" fill={body.fill} stroke={line} strokeWidth={2.5} />
      <path d="M11 57 C19 67 32 71.5 44 71.5 C56 71.5 64 64 70 56 C58 61 30 63 11 57 Z" fill="#e2f2ff" opacity={0.85} />
      <path d="M34 34 Q28 50 34 66" stroke={line} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d="M45 40 q4 4 8 0 M53 47 q4 4 8 0 M45 54 q4 4 8 0" stroke={lighten(BLUE, 0.5)} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M42 56 C48 54 54 58 54 64 C48 64.5 44 61 42 56 Z" fill={fin.fill} stroke={ink(FIN)} strokeWidth={2} strokeLinejoin="round" />
      <CuteFace x={22} y={46} s={0.36} gap={12} />
      <Shine x={48} y={32} rx={6} ry={2.8} rot={-12} />
    </g>
  )
}

/** A bright tropical fish, stripy and colourful, with tall fins. */
function TropicalFish() {
  const YEL = '#ffd23f'
  const STRIPE = '#3f9dff'
  const FIN = '#ff8a5c'
  const body = useShade(YEL, 0.4, 0.15)
  const fin = useShade(FIN, 0.3, 0.12)
  const line = '#c07a1c' // a warm amber outline suits the yellow better than its own ink
  const B = [42, 50, 29, 25] as const
  return (
    <g>
      <defs>{body.def}{fin.def}</defs>
      <path d="M30 30 C34 14 46 6 58 8 C56 16 60 26 66 36 Z" fill={fin.fill} stroke={ink(FIN)} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M36 70 C40 82 50 90 60 88 C58 82 60 74 64 64 Z" fill={fin.fill} stroke={ink(FIN)} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M68 50 C74 42 80 36 90 32 C92 40 92 44 88 50 C92 56 92 60 90 68 C80 64 74 58 68 50 Z" fill={fin.fill} stroke={ink(FIN)} strokeWidth={2.4} strokeLinejoin="round" />
      <ellipse cx={B[0]} cy={B[1]} rx={B[2]} ry={B[3]} fill={body.fill} />
      {[[33, 40], [51, 58], [65, 69]].map(([a, b]) => <path key={a} d={band(...B, a, b, 4)} fill={STRIPE} stroke={ink(STRIPE)} strokeWidth={1.4} />)}
      <ellipse cx={B[0]} cy={B[1]} rx={B[2]} ry={B[3]} fill="none" stroke={line} strokeWidth={2.5} />
      <path d="M40 57 C46 55 52 59 52 64 C46 65 42 62 40 57 Z" fill={fin.fill} stroke={ink(FIN)} strokeWidth={2} strokeLinejoin="round" />
      <CuteFace x={23} y={46} s={0.34} gap={11} />
      <Shine x={28} y={34} rx={5} ry={2.8} />
    </g>
  )
}

/** A happy dolphin swimming along, its tail curving up: a beak-like nose, a curved back fin and tail flukes. */
function Dolphin() {
  const BLUE = '#64a9c8' // a sea-grey teal, so it isn't the same blue as the fish and the whales
  const BELLY = '#e4f5f8'
  const skin = useShade(BLUE, 0.4, 0.16)
  const line = ink(BLUE)
  const FLUKE = 'M-10 0 C-9 -14 -7 -24 -5 -32 C-15 -34 -25 -40 -29 -52 C-17 -53 -7 -49 0 -41 C7 -49 17 -53 29 -52 C25 -40 15 -34 5 -32 C7 -24 9 -14 10 0 Z'
  return (
    <g>
      <defs>{skin.def}</defs>
      {/* back fin and tail flukes, behind the body */}
      <path d="M38 52 C42 44 50 37 58 34 C55 40 54 46 55 51 Z" fill={skin.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      <g transform="translate(74 46) rotate(30) scale(0.42)">
        <path d={FLUKE} fill={skin.fill} stroke={line} strokeWidth={2.4 / 0.42} strokeLinejoin="round" />
      </g>
      <path d={tubeW([[9, 60], [22, 59], [40, 62], [58, 60], [71, 51], [78, 39]], [[0, 7], [0.06, 10], [0.16, 24], [0.34, 27], [0.62, 18], [0.88, 8], [1, 5.5]])}
        fill={skin.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M12 64.5 C20 70.5 33 75 46 74 C57 73 64 68 70 60.5 C61 64.5 48 66.5 37 66.5 C27 66.5 19 66 12 64.5 Z" fill={BELLY} />
      {/* near flipper */}
      <path d="M27 70 C29 76 34 80 41 82 C39 77 38 73 37.5 69 Z" fill={skin.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M8 61.5 Q15 64.5 22.5 61.5" stroke={line} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <CuteFace x={25.5} y={54.5} s={0.38} gap={11} mouth={false} />
      <Shine x={50} y={54.5} rx={6} ry={2.2} rot={-4} />
    </g>
  )
}

/** A friendly octopus with a round head and eight curly arms. */
function Octopus() {
  const PINK = '#f48fc8'
  const skin = useShade(PINK, 0.4, 0.16)
  const line = ink(PINK)
  const arms: Pt[][] = [
    [[32, 50], [20, 56], [12, 63], [11, 71], [16, 72], [17, 67]],
    [[36, 55], [28, 66], [23, 76], [23, 84], [28, 85], [29, 80]],
    [[42, 58], [39, 70], [36, 80], [37, 89], [42, 89]],
    [[47, 59], [47, 72], [46, 82], [48, 90], [52, 88]],
  ]
  const mirror = (a: Pt[]) => a.map(([x, y]) => [100 - x, y] as Pt)
  const all = [arms[0], mirror(arms[0]), arms[1], mirror(arms[1]), arms[2], mirror(arms[2]), arms[3], mirror(arms[3])]
  return (
    <g>
      <defs>{skin.def}</defs>
      {all.map((a, i) => {
        const c = curve(a, 4)
        return (
          <g key={i}>
            <path d={tube(a, 11, 4.5)} fill={skin.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
            {/* suckers along the curling end */}
            {[0.55, 0.7, 0.84].map((t) => {
              const [x, y] = c[Math.round(t * (c.length - 1))]
              return <circle key={t} cx={x} cy={y} r={1.3 - t * 0.4} fill={lighten(PINK, 0.55)} />
            })}
          </g>
        )
      })}
      <ellipse cx={50} cy={36} rx={25} ry={24} fill={skin.fill} stroke={line} strokeWidth={2.5} />
      <CuteFace x={50} y={38} s={0.42} gap={14} />
      <Shine x={38} y={22} rx={6} ry={3.4} />
    </g>
  )
}

/** A big blue whale spouting a fountain of water from its blowhole. */
function Whale() {
  const BLUE = '#6f97ea'
  const BELLY = '#e7ecff'
  const WATER = '#a6ddff'
  const WATER_LINE = '#5aa9e6'
  const body = useShade(BLUE, 0.35, 0.18)
  const water = useShade(WATER, 0.5, 0.1)
  const line = ink(BLUE)
  return (
    <g>
      <defs>{body.def}{water.def}</defs>
      {/* spout */}
      {[tube([[36, 33], [36, 22], [36, 11]], 5, 8), tube([[35, 32], [31, 18], [22, 13]], 4.5, 7), tube([[37, 32], [41, 18], [50, 13]], 4.5, 7)].map((d) => (
        <path key={d} d={d} fill={water.fill} stroke={WATER_LINE} strokeWidth={2.2} strokeLinejoin="round" />
      ))}
      {[[17, 20], [55, 20]].map(([x, y]) => <path key={x} d={`M${x} ${y - 4} C${x + 2.5} ${y - 1} ${x + 3} ${y + 1} ${x + 3} ${y + 2} A3 3 0 0 1 ${x - 3} ${y + 2} C${x - 3} ${y + 1} ${x - 2.5} ${y - 1} ${x} ${y - 4} Z`} fill={water.fill} stroke={WATER_LINE} strokeWidth={1.8} />)}
      {/* tail flukes */}
      <g transform="translate(75 58) rotate(20) scale(0.5)">
        <path d="M-10 0 C-9 -14 -7 -24 -5 -32 C-15 -34 -25 -40 -29 -52 C-17 -53 -7 -49 0 -41 C7 -49 17 -53 29 -52 C25 -40 15 -34 5 -32 C7 -24 9 -14 10 0 Z" fill={body.fill} stroke={line} strokeWidth={2.4 / 0.5} strokeLinejoin="round" />
      </g>
      {/* body, tummy and flipper */}
      <path d="M8 58 C8 40 24 32 42 32 C62 32 78 42 82 56 C84 68 72 80 50 80 C28 80 8 74 8 58 Z" fill={body.fill} stroke={line} strokeWidth={2.5} />
      <path d="M12 66 C24 74 44 78 66 73 C58 79 50 80.5 42 80.5 C28 80.5 16 76 12 66 Z" fill={BELLY} />
      <path d="M22 72 Q38 77 56 76 M30 76.5 Q40 79 50 78.6" stroke="#c4cdf2" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M37 71 C40 78 46 84 55 86 C53 81 50 75 46 70 Z" fill={body.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      <ellipse cx={36} cy={32.5} rx={4} ry={1.6} fill={line} opacity={0.6} />
      <CuteFace x={23} y={52} s={0.38} gap={12} />
      <Shine x={30} y={41} rx={7} ry={3.5} />
    </g>
  )
}

/**
 * The big fish from Jonah's story, drawn like the story pictures' fish (scenes/kit.tsx BigFish): a huge, smooth,
 * friendly blue fish facing left, its mouth a little open, one big glossy eye, a pale belly and a forked tail.
 */
function BigFish() {
  const BLUE = '#5f8fd0'
  const skin = useShade(BLUE, 0.3, 0.2)
  const line = ink(BLUE)
  // The story's fish is drawn about its middle, 360 across; here it's a little shorter for its height, to fill the box.
  const K = (x: number, y: number) => P(44 + x * 0.24, 57 + y * 0.3)
  const u = K(-160, -16), h = K(-72, 22), l = K(-150, 38), roof = K(-106, -2), floor = K(-110, 41) // jaws, a little open
  const body = `M${u} Q${K(-152, -100)} ${K(0, -100)} Q${K(150, -100)} ${K(160, -10)} Q${K(150, 70)} ${K(0, 72)} Q${K(-120, 74)} ${l} Q${floor} ${h} Q${roof} ${u}Z`
  return (
    <g>
      <defs>{skin.def}</defs>
      {/* a few bubbles: it's under the sea */}
      {[[7, 24, 2.6], [13.5, 16, 1.8]].map(([x, y, r]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r} fill="#eef9ff" stroke="#7cc6ff" strokeWidth={1.4} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#fff" />
        </g>
      ))}
      {/* forked tail, swishing */}
      <g className="pa-tail" style={{ '--o': '0% 50%' } as CSSProperties}>
        <path d={`M${K(150, -20)} Q${K(188, -74)} ${K(212, -66)} Q${K(194, -20)} ${K(212, 28)} Q${K(188, 34)} ${K(150, 0)}Z`} fill={skin.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      </g>
      {/* mouth a little open: dark inside, a pink tongue */}
      <path d={`M${u} Q${roof} ${h} Q${floor} ${l} Q${K(-136, 12)} ${u}Z`} fill="#24467a" stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={17} cy={67.4} rx={7.4} ry={2.7} fill="#ff8fa8" transform="rotate(-8 17 67.4)" />
      {/* smooth round body with a pale belly */}
      <path d={body} fill={skin.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M${K(-146, 42)} Q${K(-60, 74)} ${K(120, 30)} Q${K(60, 72)} ${K(0, 72)} Q${K(-118, 74)} ${K(-146, 42)}Z`} fill="#cfe4ff" />
      <Shine x={36} y={33} rx={8} ry={3.6} rot={-14} />
      {/* one big glossy eye and a pink cheek */}
      <ellipse cx={19.5} cy={48.5} rx={3.6} ry={2.3} fill="#ff7fb0" opacity={0.5} />
      <g className="pa-blink" style={{ '--d': '0.7s' } as CSSProperties}>
        <ellipse cx={25} cy={43} rx={3.8} ry={4.7} fill={EYE} />
        <circle cx={23.7} cy={41.2} r={1.6} fill="#fff" />
        <circle cx={26.3} cy={44.7} r={0.75} fill="#fff" opacity={0.85} />
      </g>
    </g>
  )
}

/** A two-humped camel standing side-on, with a long curvy neck and knobbly knees. */
function Camel() {
  const SAND = '#e7b977'
  const MUZ = '#f8dfb4'
  const PAD = '#a9794b'
  const sand = useShade(SAND, 0.4, 0.15)
  const line = ink(SAND)
  // long legs with knobbly knees and wide padded feet
  const legs = (xs: number[], fill: string) => xs.map((x) => (
    <g key={x}>
      <path d={`M${x - 3} 64 L${x - 3} 75 Q${x - 4.8} 78 ${x - 3} 81 L${x - 3} 89 L${x + 3} 89 L${x + 3} 81 Q${x + 4.8} 78 ${x + 3} 75 L${x + 3} 64 Z`} fill={fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      <ellipse cx={x} cy={90} rx={4.6} ry={2.4} fill={PAD} stroke={ink(PAD)} strokeWidth={1.6} />
    </g>
  ))
  const body = 'M40 60 C40 48 44 38 52 38 C58 38 59 45 61 45 C63 45 64 38 70 38 C78 38 83 48 83 58 C83 68 75 72 62 72 C49 72 40 70 40 60 Z'
  return (
    <g>
      <defs>{sand.def}</defs>
      <ellipse {...groundShadow(56, 93, 30)} />
      <path d="M82 56 Q87 62 86 72" stroke={line} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M86 69 C89 71 89 77 86 80 C83 77 83 71 86 69 Z" fill={PAD} stroke={ink(PAD)} strokeWidth={1.5} />
      {legs([52, 70], darken(SAND, 0.1))}
      {legs([45, 77], sand.fill)}
      <Blob ds={[tube([[46, 58], [36, 60], [27, 54], [24, 40], [24, 32]], 13, 10), body]} fill={sand.fill} line={line} />
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={24 + s * 9} cy={21} rx={3.6} ry={2.3} transform={`rotate(${s * 30} ${24 + s * 9} 21)`} fill={sand.fill} stroke={line} strokeWidth={2} />
      ))}
      <ellipse cx={24} cy={27} rx={10} ry={9.5} fill={sand.fill} stroke={line} strokeWidth={2.5} />
      <path d={fluff(24, 18.5, 5, 2.4, 4)} fill={darken(SAND, 0.15)} stroke={line} strokeWidth={1.5} />
      <ellipse cx={24} cy={34} rx={8} ry={5.5} fill={MUZ} stroke={line} strokeWidth={1.8} />
      <path d="M21 32.5 l1.2 1.2 M27 32.5 l-1.2 1.2" stroke={PAD} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M21.5 36 Q24 38 26.5 36" stroke={EYE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <CuteFace x={24} y={26} s={0.32} gap={12} mouth={false} />
      <Shine x={52} y={44} rx={4} ry={2.4} />
    </g>
  )
}

/** A friendly grey donkey standing side-on, with long ears, a pale nose and a tufted tail. */
function Donkey() {
  const FUR = '#aca2bd'
  const MUZ = '#f2ecf6'
  const MANE = '#6e6387'
  const HOOF = '#5b5173'
  const fur = useShade(FUR, 0.4, 0.15)
  const muz = useShade(MUZ, 0.4, 0.06)
  const line = ink(FUR)
  const legs = (xs: number[], fill: string) => xs.map((x) => (
    <g key={x}>
      <rect x={x - 3.6} y={66} width={7.2} height={25} rx={3} fill={fill} stroke={line} strokeWidth={2.2} />
      <rect x={x - 3.9} y={86.5} width={7.8} height={5} rx={1.8} fill={HOOF} stroke={ink(HOOF)} strokeWidth={1.5} />
    </g>
  ))
  return (
    <g>
      <defs>{fur.def}{muz.def}</defs>
      <ellipse {...groundShadow(56, 93, 30)} />
      <path d="M81 58 Q87 64 86 74" stroke={line} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M86 71 C89 73 89 79 86 82 C83 79 83 73 86 71 Z" fill={MANE} stroke={ink(MANE)} strokeWidth={1.5} />
      {legs([50, 66], darken(FUR, 0.1))}
      {legs([42, 74], fur.fill)}
      <path d={tube([[34, 27], [40, 34], [47, 44], [54, 50]], 6, 5)} fill={MANE} stroke={ink(MANE)} strokeWidth={1.6} />
      <Blob ds={[tube([[45, 58], [39, 48], [33, 38]], 18, 14), ell(58, 62, 23, 13.5)]} fill={fur.fill} line={line} />
      <ellipse cx={58} cy={70} rx={14} ry={4.5} fill={MUZ} opacity={0.7} />
      {/* long ears */}
      {[-1, 1].map((s) => {
        const X = (x: number) => 30 + s * (x - 30)
        return (
          <g key={s}>
            <path d={`M${X(23)} 30 C${X(17)} 22 ${X(15)} 13 ${X(17)} 5 C${X(22)} 8 ${X(27)} 17 ${X(28.5)} 28 Z`} fill={fur.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
            <path d={`M${X(23)} 26 C${X(20)} 20.5 ${X(18.6)} 14.5 ${X(19)} 10 C${X(22)} 13 ${X(24.5)} 19 ${X(25.6)} 26 Z`} fill="#ffbcd4" />
          </g>
        )
      })}
      <ellipse cx={30} cy={38} rx={12.5} ry={12} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <path d="M25 29 C25 24 28 22 30 23 C32 21 36 23 35 28 C33 27 31 28 30 29.5 C28.5 28 27 28 25 29 Z" fill={MANE} stroke={ink(MANE)} strokeWidth={1.4} strokeLinejoin="round" />
      <ellipse cx={30} cy={48} rx={10.5} ry={7.5} fill={muz.fill} stroke={ink(MUZ)} strokeWidth={2} />
      <ellipse cx={26.5} cy={47} rx={1.5} ry={2} fill="#8b7da3" />
      <ellipse cx={33.5} cy={47} rx={1.5} ry={2} fill="#8b7da3" />
      <path d="M26.5 51 Q30 53.5 33.5 51" stroke="#6d5f84" strokeWidth={1.7} fill="none" strokeLinecap="round" />
      <CuteFace x={30} y={37} s={0.36} gap={12} mouth={false} />
      <Shine x={24} y={33} rx={3.6} ry={2.2} />
    </g>
  )
}

export const WILD: Item[] = [
  { id: 'lion', name: 'lion', emoji: ['🦁'], Draw: Lion },
  { id: 'elephant', name: 'elephant', emoji: ['🐘'], Draw: Elephant },
  { id: 'giraffe', name: 'giraffe', emoji: ['🦒'], Draw: Giraffe },
  { id: 'zebra', name: 'zebra', emoji: ['🦓'], Draw: Zebra },
  { id: 'monkey', name: 'monkey', emoji: ['🐒', '🐵'], Draw: Monkey },
  { id: 'gorilla', name: 'gorilla', emoji: ['🦍'], Draw: Gorilla },
  { id: 'bear', name: 'bear', emoji: ['🐻'], Draw: Bear },
  { id: 'fox', name: 'fox', emoji: ['🦊'], Draw: Fox },
  { id: 'penguin', name: 'penguin', emoji: ['🐧'], Draw: Penguin },
  { id: 'eagle', name: 'eagle', emoji: ['🦅'], Draw: Eagle },
  { id: 'bird', name: 'bird', emoji: ['🐦'], Draw: Bird },
  { id: 'dove', name: 'dove', emoji: ['🕊️', '🕊'], Draw: Dove },
  { id: 'fish', name: 'fish', emoji: ['🐟'], Draw: Fish },
  { id: 'tropical-fish', name: 'fish', emoji: ['🐠'], Draw: TropicalFish },
  { id: 'dolphin', name: 'dolphin', emoji: ['🐬'], Draw: Dolphin },
  { id: 'octopus', name: 'octopus', emoji: ['🐙'], Draw: Octopus },
  { id: 'whale', name: 'whale', emoji: ['🐳'], Draw: Whale },
  { id: 'big-fish', name: 'big fish', emoji: ['🐋'], Draw: BigFish },
  { id: 'camel', name: 'camel', emoji: ['🐫', '🐪'], Draw: Camel },
  { id: 'donkey', name: 'donkey', emoji: [], Draw: Donkey },
]
