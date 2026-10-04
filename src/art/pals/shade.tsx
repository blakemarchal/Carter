// Gladshade → Brightshade → Shinelight: Grumbleshade, the pouty shadow from every battle (src/art/battle.tsx), made
// glad on Easter Morning when he hears that God loves him too. He's the very same wispy cloud (Grumbleshade's own
// outline, a little rounder, with his three wisps trailing under him, softened into curls that sway), floating over a
// soft shadow on the ground, but soft lavender now, with a gentle morning-gold glow round him: kind round eyes, rosy
// cheeks and a big happy smile (his old pout turned upside down).
// Brightshade glows brighter, from the middle of him out to a warm golden edge, with a few sparkles round him.
// Shinelight is all sunny gold light, with a soft glow all round him, little pink and lilac hearts, sparkles and a crown.
// Grumpy, he's his old self again: Grumbleshade's dusky purple (no glow), his yellow eyes under cross brows and his big
// pout (round-eyed, with a twinkle, and rosy-cheeked, so he's sulky, never scary).
import { useId, type CSSProperties } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, pt, Shine, twinklePath } from '../kit'

type Pt = [number, number]

// Grumbleshade's own shapes, from src/art/battle.tsx (in his 200 x 160 box): his wispy cloud, his three wisps, his
// eyes, cross brows and pout. His wisps are drawn lines hanging from under him and hooking back up to the left
// (`M${x} 118 q-8 14 2 24 q-12 -2 -14 -12`, at x = 60, 100, 140); Gladshade's are soft curls in the same places that
// flow down and hook back up to the left the same way, tapering to a fine tip (three curves that join smoothly: a
// start, then a control point and an end for each).
const GRUMBLE_BODY = 'M30 110 C10 108 6 80 26 72 C20 44 52 30 70 46 C78 22 120 18 132 44 C152 34 180 50 172 76 C192 84 188 112 166 112 C150 132 120 124 110 118 C96 132 64 132 52 118 C44 124 32 120 30 110 Z'
const grumbleWisp = (x: number): Pt[] => [[x, 116], [x + 5, 126], [x + 1, 134], [x - 3, 142], [x - 9, 142], [x - 15, 142], [x - 14, 133]]
const GRUMBLE_EYES: Pt[] = [[80, 86], [120, 86]]
const GRUMBLE_BROWS = 'M66 70 L88 78 M134 70 L112 78'
const GRUMBLE_POUT = 'M86 108 Q100 98 114 108 Q100 104 86 108 Z'

// Gladshade is Grumbleshade moved into a Pal's 200 x 200 box: a little narrower, so he's rounder, and up off the ground
const SX = 0.84, SY = 0.96, CY = 103
const at = ([x, y]: Pt): Pt => [100 + (x - 100) * SX, CY + (y - 80) * SY]
const moved = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => pt(...at([+x, +y])))
const BODY = moved(GRUMBLE_BODY)
const BROWS = moved(GRUMBLE_BROWS)
const POUT = moved(GRUMBLE_POUT)
const EYES = GRUMBLE_EYES.map(at)
/** The top of his head (the top of his big middle puff), where the crown sits */
const TOP = at([99.5, 26.3])

const FACE_Y = EYES[0][1]
const FACE_S = 1
const GAP = (EYES[1][0] - EYES[0][0]) / 2
const BLINK = 0.9

/** A smooth tube along a chain of curves (a start, then a control point and an end for each), tapering from w0 wide
 *  to w1, with round ends. Grumbleshade's wisps are drawn lines; these are shapes, so they can be colored in. */
function tube(ps: Pt[], w0: number, w1: number, n = 10) {
  const P: Pt[] = [], D: Pt[] = []
  for (let k = 0; k + 2 < ps.length; k += 2) {
    const [a, b, c] = [ps[k], ps[k + 1], ps[k + 2]]
    for (let i = k ? 1 : 0; i <= n; i++) {
      const t = i / n, u = 1 - t
      P.push([u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]])
      D.push([u * (b[0] - a[0]) + t * (c[0] - b[0]), u * (b[1] - a[1]) + t * (c[1] - b[1])])
    }
  }
  const L: Pt[] = [], R: Pt[] = []
  P.forEach((p, i) => {
    const [dx, dy] = D[i], len = Math.hypot(dx, dy) || 1, h = (w0 + ((w1 - w0) * i) / (P.length - 1)) / 2
    L.push([p[0] - (dy / len) * h, p[1] + (dx / len) * h])
    R.unshift([p[0] + (dy / len) * h, p[1] - (dx / len) * h])
  })
  const sm = (q: Pt[]) => q.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + q[i + 2][0]) / 2, (p[1] + q[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...q[q.length - 1])}`
  return `M${pt(...L[0])} ${sm(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${sm(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}
const WISPS = [60, 100, 140].map((x) => tube(grumbleWisp(x).map(at), 11, 2.2))

/** An ellipse's outline as polygon points. The glows and the shadow are drawn as polygons, so the coloring page
 *  (which turns every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A little heart centred on (0, 0), about 3r across. */
const heart = (r: number) =>
  `M${pt(0, r * 1.5)} C${pt(-r * 2.2, r * 0.2)} ${pt(-r * 1.4, -r * 1.6)} ${pt(0, -r * 0.5)} C${pt(r * 1.4, -r * 1.6)} ${pt(r * 2.2, r * 0.2)} ${pt(0, r * 1.5)}Z`
const PINK = ['#ff7fb0', '#d9508a'], LILAC = ['#c9a8ff', '#9a78d8']
/** Shinelight's little hearts round him: [x, y, size, [color, outline]] */
const HEARTS: [number, number, number, string[]][] = [[22, 108, 4.4, PINK], [180, 100, 4, LILAC], [150, 34, 3.6, PINK], [52, 36, 3.4, LILAC]]
/** Brightshade's sparkles (and the first three of Shinelight's): [x, y, size] */
const SPARKLES: [number, number, number][] = [[28, 70, 7], [173, 62, 8], [168, 148, 5.5], [34, 146, 5]]

// His colors at each stage, and grumpy: his body's shading (its colors from the middle of the light out to his edge,
// and where the light is: [x, y, reach] across his body), its outline, his wisps' [top, tip] (their tips a little
// see-through, so they're wispy), and his glow's [middle, edge] (none when he's grumpy)
interface Look { body: [number, string][]; light: [string, string, string]; line: string; wisp: [string, string]; tip: number; glow?: [string, string] }
const GRUMPY: Look = { body: [[0, '#8a6bc0'], [0.6, '#5b3f8f'], [1, '#38245e']], light: ['40%', '32%', '75%'], line: '#2a1848', wisp: ['#5b3f8f', '#5b3f8f'], tip: 1 }
const LOOKS: Look[] = [
  { body: [[0, '#f6f1ff'], [0.6, '#cdbaf5'], [1, '#b49ae8']], light: ['40%', '32%', '75%'], line: '#8a6cc8', wisp: ['#c4aef2', '#fff0d2'], tip: 0.75, glow: ['#fff3d6', '#ffdf9e'] },
  // (Brightshade glows from the middle of him, so his golden edge goes all round him)
  { body: [[0, '#ffffff'], [0.6, '#e9e0fd'], [0.8, '#d9cbf8'], [0.93, '#f4d79e'], [1, '#ffcc5e']], light: ['50%', '54%', '56%'], line: '#e0a93a', wisp: ['#d8c8fa', '#ffe9b0'], tip: 0.8, glow: ['#fff4d0', '#ffd98a'] },
  { body: [[0, '#fffef4'], [0.5, '#fff0a6'], [0.82, '#ffdb63'], [1, '#ffc341']], light: ['46%', '46%', '62%'], line: '#e39a1a', wisp: ['#ffe27a', '#fff2c0'], tip: 0.85, glow: ['#fff6c8', '#ffe08a'] },
]
/** His glow at each stage: [middle x, middle y, across, down] (it grows wider as he does) */
const GLOWS: [number, number, number, number][] = [[100, 106, 96, 80], [100, 105, 100, 88], [100, 104, 100, 96]]

export default function Shade({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const look = g ? GRUMPY : LOOKS[st]
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [bodyId, wispId, wispLineId, glowId] = [`gb${ids}`, `gw${ids}`, `gl${ids}`, `gg${ids}`]

  return (
    <g>
      <defs>
        <radialGradient id={bodyId} cx={look.light[0]} cy={look.light[1]} r={look.light[2]}>
          {look.body.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </radialGradient>
        <linearGradient id={wispId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.2" stopColor={look.wisp[0]} />
          <stop offset="1" stopColor={look.wisp[1]} stopOpacity={look.tip} />
        </linearGradient>
        <linearGradient id={wispLineId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.3" stopColor={look.line} />
          <stop offset="1" stopColor={look.line} stopOpacity={look.tip - 0.15} />
        </linearGradient>
        {look.glow && (
          <radialGradient id={glowId}>
            <stop offset="0" stopColor={look.glow[0]} stopOpacity={0.95} />
            <stop offset="0.6" stopColor={look.glow[1]} stopOpacity={0.55} />
            <stop offset="1" stopColor={look.glow[1]} stopOpacity={0} />
          </radialGradient>
        )}
      </defs>

      {/* His soft shadow on the ground, under him (he floats) */}
      <polygon points={ring(100, 183, 36, 5)} fill="#2b2140" opacity={0.1} />

      <g className="pa-float">
        {/* A soft glow round him (warmer and wider as he grows; none when he's grumpy) */}
        {look.glow && <polygon points={ring(...GLOWS[st])} fill={`url(#${glowId})`} />}

        {/* His three wisps trailing under him, swaying (behind him, so they come out from under his cloud) */}
        {WISPS.map((d, i) => (
          <Anim key={i} cls="pa-tail" origin="50% 0%" delay={i * 0.3}>
            <path d={d} fill={`url(#${wispId})`} stroke={`url(#${wispLineId})`} strokeWidth={2.2} strokeLinejoin="round" />
          </Anim>
        ))}

        {/* His wispy cloud: Grumbleshade's own outline */}
        <path d={BODY} fill={`url(#${bodyId})`} stroke={look.line} strokeWidth={3} strokeLinejoin="round" />
        <Shine x={64} y={80} rx={11} ry={6} />

        {g ? (
          <>
            {/* His old face: glowing yellow eyes (round now, with a twinkle), cross brows and his big pout */}
            {EYES.map(([x, y], i) => (
              <g key={x} className="pa-blink" style={{ '--d': `${BLINK}s` } as CSSProperties}>
                <ellipse cx={x} cy={y} rx={8.6} ry={8} fill="#ffe14d" stroke="#2a1848" strokeWidth={1.6} />
                <circle cx={x + (i ? -1.6 : 1.6)} cy={y + 1} r={4.4} fill="#2a1848" />
                <circle cx={x + (i ? -3 : 0.2)} cy={y - 0.8} r={1.5} fill="#fff" />
              </g>
            ))}
            {/* (his brows a little higher than his own, so they don't sit right on his eyes) */}
            <path d={BROWS} transform="translate(0 -3)" stroke="#2a1848" strokeWidth={3.8} strokeLinecap="round" fill="none" />
            <path d={POUT} fill="#2a1848" stroke="#2a1848" strokeWidth={2.6} strokeLinejoin="round" />
            {EYES.map(([x, y], i) => <ellipse key={x} cx={x + (i ? 11 : -11)} cy={y + 11} rx={6} ry={3.8} fill="#ff8fbf" opacity={0.4} />)}
          </>
        ) : (
          <>
            <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={GAP} mouth={false} blinkDelay={BLINK} />
            {/* A big happy smile (his old pout, turned upside down), with a little pink tongue (faces.ts has a yawn
                spot as wide as it) */}
            <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
              <path d="M-11 9.5 Q0 24.5 11 9.5 Q0 13 -11 9.5 Z" fill="#6b2a3a" stroke="#2b2140" strokeWidth={2} strokeLinejoin="round" />
              <path d="M-4.2 14.6 Q0 11.8 4.2 14.6 Q0 17.3 -4.2 14.6 Z" fill="#ff8fa8" />
            </g>
          </>
        )}

        {/* Brightshade's and Shinelight's sparkles */}
        {st >= 1 && !g && SPARKLES.slice(0, st >= 2 ? 4 : 3).map(([x, y, r], i) => (
          <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
            <path d={twinklePath(x, y, r)} fill="#fff3a0" stroke="#e8b830" strokeWidth={1.5} strokeLinejoin="round" />
          </Anim>
        ))}

        {/* Shinelight's little hearts, and his crown */}
        {st >= 2 && !g && HEARTS.map(([x, y, r, [c, line]], i) => (
          <Anim key={x} cls="pa-twinkle" delay={0.3 + i * 0.45}>
            <path d={heart(r)} transform={`translate(${x} ${y})`} fill={c} stroke={line} strokeWidth={1.6} strokeLinejoin="round" />
          </Anim>
        ))}
        {st >= 2 && <Crown x={TOP[0]} y={TOP[1] + 5} />}
      </g>
    </g>
  )
}
