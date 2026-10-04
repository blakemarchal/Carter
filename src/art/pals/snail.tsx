// Swirly → Shellbright → Morningshell: a little snail with a soft cream body lying along the ground, its swirly pink
// shell on its back and its round head turned to smile at you. Two eye stalks with round bobbles on their tips rise
// from the top of its head (its eyes are the big ones on its face), and a soft shadow lies under it.
// Shellbright's shell swirls with the colours of sunrise: gold in the middle, then orange, then pink. Morningshell has
// a little sun in the middle of its swirl and dewdrops on its shell, a dewdrop hangs on a blade of grass beside it,
// it glows gently like the morning, and it wears a crown.
// Grumpy (in battle: hiding away in its shell, sad and alone): it has pulled itself into its shell, which has gone a
// dull colour; just the edge of its foot shows under it, and its face peeks out of the shell's opening with cross
// brows and a frown.
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

/** An ellipse's outline as polygon points. The glow and the shadow are drawn as polygons, so the coloring page
 *  (which turns every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

type Curve = [Pt, Pt, Pt]
const bez = (t: number, [a, b, c]: Curve): Pt => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}
/** A smooth tapering tube along the curve a → (b) → c, w0 wide at a down to w1 at c, with round ends. */
function tube(cv: Curve, w0: number, w1: number, n = 10) {
  const L: Pt[] = [], R: Pt[] = []
  const [a, b, c] = cv
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t
    const [x, y] = bez(t, cv)
    const dx = u * (b[0] - a[0]) + t * (c[0] - b[0]), dy = u * (b[1] - a[1]) + t * (c[1] - b[1])
    const len = Math.hypot(dx, dy) || 1, h = (w0 + (w1 - w0) * t) / 2
    L.push([x - (dy / len) * h, y + (dx / len) * h])
    R.unshift([x + (dy / len) * h, y - (dx / len) * h])
  }
  return `M${L.map((p) => pt(...p)).join(' L')} A${w1 / 2} ${w1 / 2} 0 0 0 ${R.map((p) => pt(...p)).join(' L')} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}

/**
 * The swirl on a shell of radius r round (0, 0): a band winding out from the middle in `turns` turns, as one shape,
 * thin at its very middle and tapering away again at its outer end (at `end` degrees).
 */
function swirl(r: number, turns: number, end: number) {
  const grow = 3.2 // each turn of the band is this much further out than the one inside it
  const b = Math.log(grow) / (2 * Math.PI)
  const wide = Math.sqrt(grow) // the band's outer edge: half way out to the next turn
  const th1 = turns * 2 * Math.PI
  const s1 = (r * 0.9) / wide
  const N = Math.round(turns * 48)
  const at = (th: number, k: number): Pt => {
    const a = (end * Math.PI) / 180 - (th1 - th)
    const s = s1 * Math.exp(b * (th - th1)) * k
    return [Math.cos(a) * s, Math.sin(a) * s]
  }
  const inner: Pt[] = [], outer: Pt[] = []
  for (let i = 0; i <= N; i++) {
    const th = (i / N) * th1
    const taper = Math.min(1, (th1 - th) / (0.6 * Math.PI))
    inner.push(at(th, 1))
    outer.push(at(th, 1 + (wide - 1) * Math.sin((taper * Math.PI) / 2)))
  }
  return `M${outer.map((p) => pt(...p)).join(' L')} L${inner.reverse().map((p) => pt(...p)).join(' L')}Z`
}

/** A dewdrop hanging from (0, 0). */
const DROP = 'M0 0 C2.6 3.8 5 6.4 5 9.2 A5 5 0 0 1 -5 9.2 C-5 6.4 -2.6 3.8 0 0 Z'

// Happy: its body (head and foot in one, lying along the ground with its tail to the right), its shell on its back
const BODY = smooth([
  [100, 72], [116, 75], [127, 85], [132, 100], [133, 116], [133, 132], [140, 144], [156, 148], [172, 153],
  [186, 161], [195, 171], [187, 178], [160, 180], [128, 181], [96, 181], [70, 180], [56, 177], [50, 170],
  [54, 160], [62, 150], [66, 136], [67, 118], [68, 100], [72, 86], [84, 75],
])
const SHELL = { x: 146, y: 98, r: 46 }
const FACE_Y = 112
// Its eye stalks, from inside the top of its head out to the bobbles on their tips
const STALKS: Curve[] = [[[87, 84], [83, 64], [75, 47]], [[113, 84], [117, 64], [125, 47]]]
// Dewdrops on Morningshell's shell
const DEW: Pt[] = [[121, 71], [176, 112], [165, 66]]

// Grumpy: its shell resting on the ground, the edge of its foot under it and its face in the shell's opening
const G_SHELL = { x: 128, y: 112, r: 54 }
const G_FOOT = 'M66 181 C64 170 76 164 100 165 L170 166 C182 167 190 172 193 180 Z'
const MOUTH = { x: 99, y: 150, rx: 37, ry: 29, rot: 10 } // the shell's opening, with its lip
const G_FACE_Y = 152

export default function Snail({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const glowId = `sg${uid}`, shadowId = `ss${uid}`, baseId = `sb${uid}`, bandId = `sw${uid}`, clipId = `sc${uid}`
  const sunrise = st >= 1 && !g
  const CREAM = g ? '#e6dccb' : '#fbe7c6'
  const BOBBLE = '#ffc9d6'
  const body = useShade(CREAM, 0.5, 0.1)
  const bobble = useShade(BOBBLE, 0.4, 0.12)
  const line = ink(CREAM)
  // The shell's colours, from the middle out: pink (dull when grumpy), or the colours of sunrise
  const SH = g ? { base: ['#d8ccd2', '#cbbdc4', '#b9aab2'], band: ['#b6a2ad', '#a7929e', '#98838f'], edge: '#857380' }
    : sunrise ? { base: ['#fff0a8', '#ffcf8a', '#ffb3c4'], band: ['#ffb627', '#ff8a4a', '#ff5f97'], edge: '#d9547f' }
      : { base: ['#ffe0ec', '#ffc8dd', '#ffb2cf'], band: ['#ff9cc6', '#f77fb4', '#ec66a3'], edge: '#cf4f8a' }
  const shell = g ? G_SHELL : SHELL
  const grad = (id: string, stops: string[]) => (
    <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={shell.x} cy={shell.y} r={shell.r}>
      {stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}
    </radialGradient>
  )

  const Shell = (
    <g>
      <circle cx={shell.x} cy={shell.y} r={shell.r} fill={`url(#${baseId})`} stroke={SH.edge} strokeWidth={3} />
      <path d={swirl(shell.r, 2.15, 150)} transform={`translate(${shell.x} ${shell.y})`} fill={`url(#${bandId})`} stroke={SH.edge} strokeWidth={2} strokeLinejoin="round" />
      <Shine x={shell.x - shell.r * 0.45} y={shell.y - shell.r * 0.64} rx={shell.r * 0.2} ry={shell.r * 0.1} rot={-35} />
      {/* Morningshell's little sun in the middle of its swirl */}
      {st >= 2 && (
        <g transform={`translate(${shell.x} ${shell.y})`}>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M-2.6 -6.4 L0 -11.5 L2.6 -6.4 Z" fill={g ? '#d8cfa8' : '#ffd34d'} stroke={g ? '#a89f7c' : '#e09a00'} strokeWidth={1.2} strokeLinejoin="round" transform={`rotate(${i * 45})`} />
          ))}
          <circle r={6.4} fill={g ? '#e2dbbf' : '#ffe066'} stroke={g ? '#a89f7c' : '#e09a00'} strokeWidth={1.4} />
        </g>
      )}
    </g>
  )

  return (
    <g>
      <defs>
        {body.def}{bobble.def}
        {grad(baseId, SH.base)}
        {grad(bandId, SH.band)}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#fff2d6" stopOpacity={0.95} />
          <stop offset="0.6" stopColor="#ffd9c2" stopOpacity={0.5} />
          <stop offset="1" stopColor="#ffd9c2" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={shadowId}>
          <stop offset="0" stopColor="#3b2a4a" stopOpacity={0.22} />
          <stop offset="1" stopColor="#3b2a4a" stopOpacity={0} />
        </radialGradient>
        <clipPath id={clipId}>
          <ellipse cx={MOUTH.x} cy={MOUTH.y - 1.5} rx={MOUTH.rx - 5} ry={MOUTH.ry - 5.5} transform={`rotate(${MOUTH.rot} ${MOUTH.x} ${MOUTH.y})`} />
        </clipPath>
      </defs>

      {/* Morningshell's gentle morning glow */}
      {st >= 2 && !g && <polygon points={ring(110, 110, 96, 90)} fill={`url(#${glowId})`} />}

      {/* Its soft shadow on the ground */}
      <polygon points={ring(g ? 128 : 120, 181, g ? 72 : 84, 8)} fill={`url(#${shadowId})`} />

      {g ? (
        <>
          {/* Hiding in its shell: the edge of its foot under it, and its face peeking out of the shell's opening */}
          <path d={G_FOOT} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          {Shell}
          <g transform={`rotate(${MOUTH.rot} ${MOUTH.x} ${MOUTH.y})`}>
            <ellipse cx={MOUTH.x} cy={MOUTH.y} rx={MOUTH.rx} ry={MOUTH.ry} fill={`url(#${baseId})`} stroke={SH.edge} strokeWidth={3} />
            <ellipse cx={MOUTH.x} cy={MOUTH.y - 1.5} rx={MOUTH.rx - 5} ry={MOUTH.ry - 5.5} fill="#6f5d69" stroke={SH.edge} strokeWidth={2} />
          </g>
          <g clipPath={`url(#${clipId})`}>
            <ellipse cx={100} cy={166} rx={31} ry={27} fill={body.fill} stroke={line} strokeWidth={2.6} />
            <CuteFace x={100} y={G_FACE_Y} s={0.82} gap={15} mood={mood} blinkDelay={1.2} />
          </g>
        </>
      ) : (
        <>
          {/* Its eye stalks, with round bobbles on their tips (behind its head, so they grow out of it) */}
          {STALKS.map((cv, i) => (
            <Anim key={i} cls="pa-ear" origin={i ? '0% 100%' : '100% 100%'} delay={i * 0.9}>
              <path d={tube(cv, 8, 5.5)} fill={body.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
              <circle cx={cv[2][0]} cy={cv[2][1]} r={6.5} fill={bobble.fill} stroke={ink(BOBBLE)} strokeWidth={2.4} />
              {/* (its shine a polygon, so on the coloring page the bobble is a plain round shape, not an eye) */}
              <polygon points={ring(cv[2][0] - 2, cv[2][1] - 2.2, 1.8, 1.8, 12)} fill="#fff" opacity={0.85} />
            </Anim>
          ))}
          {/* Its swirly shell on its back, then its soft body in front */}
          {Shell}
          <g className="pa-breathe">
            <path d={BODY} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
            <Shine x={81} y={87} rx={7} ry={4} />
          </g>
          <CuteFace x={100} y={FACE_Y} s={0.85} gap={15} mood={mood} blinkDelay={1.2} />
          {st >= 2 && <g transform="translate(100 77) scale(0.8) translate(-100 -77)"><Crown x={100} y={77} /></g>}
        </>
      )}

      {/* Morningshell's dewdrops, on its shell and hanging on a blade of grass, and sparkles */}
      {st >= 2 && !g && (
        <>
          <path d="M30 182 Q25 166 34 148 Q32 166 37 182 Z" fill="#7fd36e" stroke="#4fa65a" strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M36 182 Q40 172 48 166 Q44 174 41 182 Z" fill="#7fd36e" stroke="#4fa65a" strokeWidth={1.8} strokeLinejoin="round" />
          <Anim cls="pa-twinkle" delay={0.4}>
            <g transform="translate(34 149) scale(0.8)">
              <path d={DROP} fill="#c4ecff" stroke="#5fb0e8" strokeWidth={1.8} strokeLinejoin="round" />
              <polygon points={ring(-1.6, 8.6, 1.3, 2, 12)} fill="#fff" opacity={0.9} />
            </g>
          </Anim>
          {/* (their glints are polygons, so on the coloring page each is a plain round drop, not an eye) */}
          {DEW.map(([x, y], i) => (
            <g key={x}>
              <circle cx={x} cy={y} r={4} fill="#c4ecff" stroke="#5fb0e8" strokeWidth={1.6} />
              <Anim cls="pa-twinkle" delay={i * 0.6}>
                <polygon points={ring(x - 1.3, y - 1.4, 1.4, 1.4, 12)} fill="#fff" />
              </Anim>
            </g>
          ))}
          {[[44, 40, 7], [182, 28, 6], [188, 140, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.7}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
