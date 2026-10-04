// Scamper → Bushytail → Treekeeper: a little red-brown squirrel sitting up on its haunches and facing you, with a
// cream tummy and muzzle, big friendly eyes, a little nose, two tufted ears, small front paws, and two long back
// feet on the ground. Its big bushy tail comes out from behind its bottom, lies on the ground, and rises up behind
// it on the right, curling over at the top.
// Bushytail's tail is bushier, and it holds out an acorn to share; Treekeeper has a little pile of nuts beside it
// to give away, glows softly, and wears a crown.
// Grumpy (in battle, before it's befriended, when it grabbed every nut and kept them all): duller fur, its cheeks
// stuffed full of nuts, an acorn clutched tight to its tummy, and cross brows.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, darken, ink, lighten, pt, Shine, twinklePath, useShade } from '../kit'

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

/** A furry arm: a tube w wide from a to b, with round ends. */
function capsule(a: Pt, b: Pt, w: number) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const len = Math.hypot(dx, dy) || 1
  const [nx, ny] = [(-dy / len) * (w / 2), (dx / len) * (w / 2)]
  const r = w / 2
  return `M${pt(a[0] + nx, a[1] + ny)} L${pt(b[0] + nx, b[1] + ny)} A${r} ${r} 0 0 0 ${pt(b[0] - nx, b[1] - ny)} L${pt(a[0] - nx, a[1] - ny)} A${r} ${r} 0 0 0 ${pt(a[0] + nx, a[1] + ny)}Z`
}

/** Points along an open Catmull-Rom curve through ps, k to each span. */
function spline(ps: Pt[], k: number): Pt[] {
  const at = (i: number) => ps[Math.max(0, Math.min(ps.length - 1, i))]
  const out: Pt[] = []
  for (let i = 0; i < ps.length - 1; i++) {
    const [a, b, c, d] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    for (let j = 0; j < k; j++) {
      const t = j / k
      out.push([0, 1].map((q) => 0.5 * (2 * b[q] + (c[q] - a[q]) * t + (2 * a[q] - 5 * b[q] + 4 * c[q] - d[q]) * t * t + (3 * b[q] - a[q] - 3 * c[q] + d[q]) * t * t * t)) as Pt)
    }
  }
  out.push(ps[ps.length - 1])
  return out
}

/** A smooth line on through a run of points (rounding off each corner), from the first (where the pen is) to the last. */
const through = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`

/** A soft round tuft of fur along an edge: 0 between tufts, up to 1 in the middle of each. */
const lobe = (x: number) => Math.pow(Math.sin(Math.PI * (x - Math.floor(x))), 0.6)

/** How far along a run of points each one is. */
const along = (ps: Pt[]) => ps.reduce<number[]>((acc, p, i) => [...acc, i ? acc[i - 1] + Math.hypot(p[0] - ps[i - 1][0], p[1] - ps[i - 1][1]) : 0], [])

/** A smooth closed outline round a ring of points (rounding off each corner). */
function loop(ps: Pt[]) {
  const mid = (a: Pt, b: Pt) => pt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
  return `M${mid(ps[ps.length - 1], ps[0])}` + ps.map((p, i) => ` Q${pt(...p)} ${mid(p, ps[(i + 1) % ps.length])}`).join('') + 'Z'
}

/** A round puff of fur at (x, y), r across, with `tufts` soft round tufts (`fluff` deep) all round it. */
function puff(x: number, y: number, r: number, fluff: number, tufts = 9, n = 90) {
  return loop(Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, d = r + fluff * lobe((i / n) * tufts + 0.3)
    return [x + Math.cos(a) * d, y + Math.sin(a) * d] as Pt
  }))
}

/** A spiral line from angle a0 to a1 (radians), its radius going from r0 to r1. It runs there and back along itself,
 *  so it has no inside: the coloring page draws it as a line rather than making a shape of it. */
function spiral(x: number, y: number, a0: number, a1: number, r0: number, r1: number) {
  const ps = Array.from({ length: 25 }, (_, i) => {
    const f = i / 24, a = a0 + (a1 - a0) * f, r = r0 + (r1 - r0) * f
    return [x + Math.cos(a) * r, y + Math.sin(a) * r] as Pt
  })
  return `M${pt(...ps[0])} ${through(ps)} ${through([...ps].reverse())}`
}

/**
 * A soft tube along the curve through `ps`, `ws` wide at each point, with round ends and soft round tufts of fur
 * (`fluff` deep, one every `every` along) down its outside edge (the right of the way it runs), smaller down its inside.
 */
function plume(ps: Pt[], ws: number[], fluff: number, every = 22, k = 10) {
  const c = spline(ps, k)
  const n = c.length
  const width = (s: number) => {
    const i = Math.min(ps.length - 2, Math.floor(s / k)), t = s / k - i
    return ws[i] + (ws[i + 1] - ws[i]) * t * t * (3 - 2 * t)
  }
  // The two edges, smooth, then tufted (each by how far along its own edge it is)
  const norm = c.map((_, s) => {
    const [a, b] = [c[Math.max(0, s - 1)], c[Math.min(n - 1, s + 1)]]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [-(b[1] - a[1]) / len, (b[0] - a[0]) / len] as Pt
  })
  const edge = (side: number, h: (s: number) => number) => c.map(([x, y], s) => [x + side * norm[s][0] * h(s), y + side * norm[s][1] * h(s)] as Pt)
  const [dl, dr] = [along(edge(1, (s) => width(s) / 2)), along(edge(-1, (s) => width(s) / 2))]
  // (no tufts where it lies along the ground, so it lies flat on it)
  const fade = (d: number[], s: number) => fluff * Math.max(0, Math.min(1, (d[s] - 40) / 25, (d[n - 1] - d[s]) / 22))
  const L = edge(1, (s) => width(s) / 2 + fade(dl, s) * lobe(dl[s] / every))
  const R = edge(-1, (s) => width(s) / 2 + fade(dr, s) * 0.5 * lobe(dr[s] / (every * 1.2) + 0.5))
  const [r1, r0] = [width(n - 1) / 2, width(0) / 2]
  const back = [...R].reverse()
  return `M${pt(...L[0])} ${through(L)} A${r1} ${r1} 0 0 0 ${pt(...back[0])} ${through(back)} A${r0} ${r0} 0 0 0 ${pt(...L[0])}Z`
}

const GROUND = 183
// Its round head (grumpy, two round cheek pouches stuffed full of nuts puff out over it)
const HEAD =smooth([[100, 52], [118, 54], [131, 63], [136, 78], [136, 94], [131, 106], [119, 115], [100, 119], [81, 115], [69, 106], [64, 94], [64, 78], [69, 63], [82, 54]])
// Its body, sitting up: a soft pear from under its chin down to its bottom on the ground
const BODY = smooth([[100, 108], [121, 112], [134, 126], [141, 146], [140, 166], [128, 177], [100, 180], [72, 177], [60, 166], [59, 146], [66, 126], [79, 112]])
// The left ear (the right one is its mirror image), its pink inside, and the tuft of fur on its tip
const EAR = 'M71 67 C69 52 72 39 79 28 C88 36 94 47 95 58 Z'
const EAR_IN = 'M77 61 C75.5 51 77 43 80.5 37 C86 43 89 50 89.5 58 Z'
const TUFT = 'M74.5 37 C71 29 73 22 78 16 C79 21 82 23 86 20 C86 27 84 33 83 37 Z'
// A little tuft of fur on each cheek
const CHEEK_TUFT = 'M132 94.5 L139 98.5 L134.5 101 L138.5 104.5 L130 107 Z'

// Its tail: where its middle runs, from its root (behind its bottom) along the ground and up its back, and how wide
// it is along there; and the round curl it rolls up into at the top (well clear of its ear). Bushier as it grows.
const TAIL: Pt[] = [[120, 164], [141, 167], [156, 159], [160, 137], [165, 112], [167, 88], [167, 64], [161, 46]]
const TAIL_W = [18, 28, 38, 43, 36, 28, 27, 27]
const CURL = { x: 159, y: 41, r: 17.5 }
const DEG = Math.PI / 180

// Its front arms in each pose: [shoulder, paw] for its left and right
type Arms = { l: [Pt, Pt]; r: [Pt, Pt] }
const ARMS: Record<'hands' | 'offer' | 'clutch', Arms> = {
  hands: { l: [[80, 118], [93, 131]], r: [[120, 118], [107, 131]] }, // paws held together under its chin
  offer: { l: [[80, 118], [59, 128]], r: [[120, 118], [111, 134]] }, // holding out an acorn on its paw
  clutch: { l: [[80, 118], [88, 135]], r: [[120, 118], [112, 135]] }, // hugging an acorn tight
}

/** An acorn standing up, its middle at (0, 0): a smooth nut in a bumpy little cap with a stem. */
function Acorn({ nut, cap }: { nut: string; cap: string }) {
  const capLine = ink(cap)
  return (
    <g>
      <path d="M-8.5 -3 C-9 6 -4.5 13 0 15.5 C4.5 13 9 6 8.5 -3 Z" fill={nut} stroke={ink(nut)} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={-3.6} cy={3.5} rx={1.8} ry={4} fill="#fff" opacity={0.5} transform="rotate(14 -3.6 3.5)" />
      <line x1={0.5} y1={-11} x2={3} y2={-16.5} stroke={capLine} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M-11 -2.5 C-11 -9 -6 -12.5 0 -12.5 C6 -12.5 11 -9 11 -2.5 Q0 1 -11 -2.5 Z" fill={cap} stroke={capLine} strokeWidth={2} strokeLinejoin="round" />
      {/* (the cap's criss-cross pattern: lines, so the coloring page leaves them thin) */}
      <g stroke={capLine} strokeWidth={1} opacity={0.7} strokeLinecap="round">
        <line x1={-7} y1={-3.5} x2={-2} y2={-10} /><line x1={-1} y1={-2.5} x2={4} y2={-9.5} /><line x1={5} y1={-2.5} x2={8} y2={-6.5} />
        <line x1={-8} y1={-7} x2={-4} y2={-2.5} /><line x1={-3} y1={-10.5} x2={4} y2={-2.5} /><line x1={3} y1={-11} x2={9} y2={-4} />
      </g>
    </g>
  )
}

export default function Squirrel({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [glowId, tailId] = [`sq${uid}`, `st${uid}`]
  const FUR = g ? '#a8836f' : '#c96a3c' // red-brown (dull and dusty when grumpy)
  const CREAM = g ? '#e9dfd3' : '#ffe8c9'
  const EAR_PINK = g ? '#dcbab1' : '#ffb2a6'
  const NUT = g ? '#c9a27c' : '#dc9b54'
  const CAP = g ? '#8a6e58' : '#8d5630'
  const NOSE = '#5a3530'
  const GLOW = '#ffe07a'
  const fur = useShade(FUR, 0.38, 0.17)
  const cream = useShade(CREAM, 0.5, 0.07)
  const line = ink(FUR)
  const creamLine = ink(CREAM)
  const tuft = ink(FUR)
  const arms = ARMS[g ? 'clutch' : st >= 1 ? 'offer' : 'hands']
  // Bushier as it grows (and fluffed up when grumpy)
  const bushy = [1, 1.05, 1.1][st]
  const fluff = g ? 3.8 : [2.6, 3, 3.4][st]
  const tailD = plume(TAIL, TAIL_W.map((w) => w * bushy), fluff)
  const curlR = CURL.r * (1 + (bushy - 1) / 2)
  const curlD = puff(CURL.x, CURL.y, curlR, fluff, 8)
  const streak = plume(TAIL.slice(2, 7).map(([x, y]) => [x - 5, y] as Pt), TAIL_W.slice(2, 7).map((w) => w * bushy * 0.34), 0)
  const acorn = <Acorn nut={NUT} cap={CAP} />
  return (
    <g>
      <defs>
        {fur.def}{cream.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.85} />
          <stop offset="0.55" stopColor={GLOW} stopOpacity={0.42} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
        {/* (one shading over the whole tail, lit from the top left, so its curl and the rest of it match) */}
        <radialGradient id={tailId} gradientUnits="userSpaceOnUse" cx={146} cy={44} r={150}>
          <stop offset="0" stopColor={lighten(FUR, 0.42)} />
          <stop offset="0.5" stopColor={FUR} />
          <stop offset="1" stopColor={darken(FUR, 0.16)} />
        </radialGradient>
      </defs>

      {/* Treekeeper's soft glow */}
      {st >= 2 && !g && <polygon points={ring(108, 112, 94, 84)} fill={`url(#${glowId})`} />}

      {/* Its big bushy tail, from behind its bottom (on the ground) up its back and rolled into a curl at the top,
          puffing up gently: the outline of the whole tail first, then its fur over the lines inside */}
      <g className="pa-breathe" style={{ animationDelay: '0.9s' }}>
        <g fill={`url(#${tailId})`} stroke={line} strokeWidth={6} strokeLinejoin="round">
          <path d={tailD} /><path d={curlD} />
        </g>
        <g fill={`url(#${tailId})`}>
          <path d={tailD} /><path d={curlD} />
        </g>
        <path d={streak} fill={lighten(FUR, 0.28)} opacity={0.75} />
        <path d={spiral(CURL.x, CURL.y, 135 * DEG, -155 * DEG, curlR, 4.5)} stroke={line} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Tufted ears, twitching */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? 'translate(200 0) scale(-1 1)' : undefined}>
          <Anim cls="pa-ear" origin="50% 100%" delay={side > 0 ? 0.6 : 0}>
            <path d={TUFT} fill={tuft} stroke={ink(tuft)} strokeWidth={2} strokeLinejoin="round" />
            <path d={EAR} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
            <path d={EAR_IN} fill={EAR_PINK} />
          </Anim>
        </g>
      ))}

      {/* Its haunches and long back feet, on the ground */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? 'translate(200 0) scale(-1 1)' : undefined}>
          <ellipse cx={68} cy={160} rx={16} ry={19} fill={fur.fill} stroke={line} strokeWidth={3} transform="rotate(12 68 160)" />
        </g>
      ))}

      {/* Its body, with a cream tummy */}
      <g className="pa-breathe">
        <path d={BODY} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={100} cy={151} rx={24} ry={25} fill={cream.fill} stroke={creamLine} strokeWidth={2} />
      </g>
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? 'translate(200 0) scale(-1 1)' : undefined}>
          <ellipse cx={77} cy={GROUND - 6} rx={14} ry={6} fill={fur.fill} stroke={line} strokeWidth={2.6} />
          <g stroke={line} strokeWidth={1.6} strokeLinecap="round">
            <line x1={69} y1={GROUND - 4} x2={69} y2={GROUND - 1.5} /><line x1={74} y1={GROUND - 3.5} x2={74} y2={GROUND - 0.6} />
          </g>
        </g>
      ))}

      {/* A little pile of nuts beside Treekeeper, to give away */}
      {st >= 2 && (
        <g>
          <g transform="translate(25 173) rotate(-78)">{acorn}</g>
          <g transform="translate(48 174) rotate(74)">{acorn}</g>
          <g transform="translate(37 156) rotate(-6)">{acorn}</g>
        </g>
      )}

      {/* Its head: cheek tufts, the head, a cream muzzle */}
      {!g && [-1, 1].map((side) => (
        <path key={side} d={CHEEK_TUFT} fill={fur.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round"
          transform={side < 0 ? 'translate(200 0) scale(-1 1)' : undefined} />
      ))}
      <path d={HEAD} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Shine x={80} y={66} rx={8.5} ry={4.5} />
      {/* (grumpy: its cheeks puffed out round, stuffed full of nuts) */}
      {g && [-1, 1].map((side) => (
        <g key={side}>
          <circle cx={100 + side * 24.5} cy={107} r={14.5} fill={fur.fill} stroke={line} strokeWidth={2.6} />
          <Shine x={100 + side * 24.5 - 5} y={100.5} rx={4.5} ry={2.6} />
        </g>
      ))}
      <ellipse cx={100} cy={106} rx={15} ry={10} fill={cream.fill} stroke={creamLine} strokeWidth={2} />
      <CuteFace x={100} y={86} s={0.85} gap={17} mood={mood} mouth={false} blinkDelay={0.6} />
      {/* A little nose, and a smile with two little teeth (a pursed frown when grumpy, its mouth full of nuts) */}
      <path d="M95.5 100 Q100 98 104.5 100 Q103.5 104 100 105 Q96.5 104 95.5 100 Z" fill={NOSE} />
      <ellipse cx={98.4} cy={100.4} rx={1.5} ry={0.9} fill="#fff" opacity={0.8} />
      {g ? (
        <path d="M95.5 112 Q100 108 104.5 112" stroke={NOSE} strokeWidth={2} fill="none" strokeLinecap="round" />
      ) : (
        <>
          <path d="M97.8 108.6 H102.2 V111.2 Q100 112.6 97.8 111.2 Z" fill="#fff" stroke={NOSE} strokeWidth={1.1} strokeLinejoin="round" />
          <path d="M100 105 V108 M95.5 108.6 Q97.8 111.4 100 108 Q102.2 111.4 104.5 108.6" stroke={NOSE} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {/* Small front paws: held together under its chin; holding out an acorn to share; or (grumpy) hugging one tight */}
      {g && <g transform="translate(100 133) scale(1.1)">{acorn}</g>}
      {!g && st >= 1 && <g transform="translate(56 115) rotate(-6)">{acorn}</g>}
      {([arms.l, arms.r] as [Pt, Pt][]).map(([a, b], i) => (
        <g key={i}>
          <path d={capsule(a, b, 12)} fill={fur.fill} stroke={line} strokeWidth={2.6} />
          <ellipse cx={b[0]} cy={b[1]} rx={6.5} ry={5.5} fill={fur.fill} stroke={line} strokeWidth={2.4} />
        </g>
      ))}

      {st >= 2 && (
        <>
          <Crown x={100} y={55} />
          {!g && [[24, 64, 8], [21, 116, 6], [54, 24, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
