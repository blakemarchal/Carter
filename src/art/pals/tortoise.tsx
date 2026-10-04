// Shelly → Sunshell → Desertdome: a desert tortoise facing you, peeking out from under a big domed shell: an
// olive shell of rounded plates with a rim of little plates round its edge (arching over its head), a friendly
// round head, four stubby legs with little toenails and a little pointed tail. Sunshell has a golden sun glowing
// on top of its shell; Desertdome's dome is taller and all golden, the sun shines brighter, and it wears a crown
// on top.
// Grumpy (in battle): grumbling that dinner is too slow, like God's people did in the desert: dusty and dull,
// with a frown, pulling its head back into its shell.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

const MIRROR = 'translate(200 0) scale(-1 1)'

/** The dome of the shell, from its bottom left corner over the top (y `top`) to its bottom right corner. */
const domePath = (top: number) => `M30 148 C27 ${top + 34} 56 ${top} 100 ${top} C144 ${top} 173 ${top + 34} 170 148`
// The shell's edge: from the bottom right corner along the bottom, up in an arch over the head and back down,
// to the bottom left corner. Its rim of little plates runs along inside it, up to the dome's plates (RIM_IN,
// from the right back to the left).
const EDGE = 'Q152 157 136 160 C140 134 126 107 100 107 C74 107 60 134 64 160 Q48 157 30 148'
const RIM_IN = 'L165 137 Q154 144 146 147 C147 120 128 98 100 98 C72 98 53 120 54 147 Q46 144 35 137'
const RIM = `M30 148 Q48 157 64 160 C60 134 74 107 100 107 C126 107 140 134 136 160 Q152 157 170 148 ${RIM_IN} Z`
// The dark opening under the arch, where the head comes out
const OPENING = 'M64 160 C60 134 74 107 100 107 C126 107 140 134 136 160 Q100 178 64 160 Z'
// The front edge of the shell's flat underside, under its chin
const BELLY = 'M72 158 Q100 172 128 158 L127 165 Q100 180 73 165 Z'

const quad = (t: number, a: Pt, b: Pt, c: Pt): Pt => [0, 1].map((k) => (1 - t) * (1 - t) * a[k] + 2 * t * (1 - t) * b[k] + t * t * c[k]) as Pt
const cubic = (t: number, a: Pt, b: Pt, c: Pt, d: Pt): Pt =>
  [0, 1].map((k) => (1 - t) ** 3 * a[k] + 3 * (1 - t) ** 2 * t * b[k] + 3 * (1 - t) * t * t * c[k] + t ** 3 * d[k]) as Pt
// The seams between the rim's little plates, across it from its outside edge to its inside edge (the left half,
// mirrored for the right): one along the bottom, two up the arch, and one at the top of the arch
const SEAM_PAIRS: [Pt, Pt][] = [
  [quad(0.45, [30, 148], [48, 157], [64, 160]), quad(0.45, [35, 137], [46, 144], [54, 147])],
  [cubic(0.3, [64, 160], [60, 134], [74, 107], [100, 107]), cubic(0.3, [54, 147], [53, 120], [72, 98], [100, 98])],
  [cubic(0.65, [64, 160], [60, 134], [74, 107], [100, 107]), cubic(0.65, [54, 147], [53, 120], [72, 98], [100, 98])],
]
const RIM_SEAMS = SEAM_PAIRS.map(([a, b]) => `M${pt(...a)} L${pt(...b)} M${pt(200 - a[0], a[1])} L${pt(200 - b[0], b[1])}`).join(' ') + ' M100 107 V98'

/** A rounded flat-topped hexagon of radius r centred on (x, y). */
function hexagon(x: number, y: number, r: number) {
  const p = Array.from({ length: 6 }, (_, i) => [x + Math.cos((i * Math.PI) / 3) * r, y + Math.sin((i * Math.PI) / 3) * r])
  const k = 0.22 // how much of each side the rounded corners take
  let d = ''
  p.forEach(([cx, cy], i) => {
    const [px, py] = p[(i + 5) % 6], [nx, ny] = p[(i + 1) % 6]
    d += `${i ? 'L' : 'M'}${pt(cx + (px - cx) * k, cy + (py - cy) * k)} Q${pt(cx, cy)} ${pt(cx + (nx - cx) * k, cy + (ny - cy) * k)} `
  })
  return `${d}Z`
}

/** The n pointed rays round a sun of radius r centred on (0, 0), every other one shorter. */
function sunRays(r: number, n: number, long: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i * Math.PI * 2) / n - Math.PI / 2, w = (Math.PI / n) * 0.55
    const l = i % 2 ? long * 0.72 : long
    return `M${pt(Math.cos(a - w) * (r + 1), Math.sin(a - w) * (r + 1))} L${pt(Math.cos(a) * (r + l), Math.sin(a) * (r + l))} L${pt(Math.cos(a + w) * (r + 1), Math.sin(a + w) * (r + 1))} Z`
  }).join(' ')
}

/** A stubby leg standing on the ground at y `foot`, centred on x, w wide (its top hidden under the shell). */
const legPath = (x: number, w: number, foot: number) =>
  `M${x - w / 2} 138 L${x - w / 2} ${foot - 9} Q${x - w / 2 - 2} ${foot} ${x - w / 2 + 6} ${foot} H${x + w / 2 - 6} Q${x + w / 2 + 2} ${foot} ${x + w / 2} ${foot - 9} L${x + w / 2} 138 Z`

const TOPS = [64, 57, 46] // how tall the dome is at each stage (the y of its top)

export default function Tortoise({ stage, mood }: BodyProps) {
  const clip = `tc${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const g = mood === 'grumpy'
  const gold = stage >= 2
  const SEAM = g ? (gold ? '#a39a72' : '#8d8f74') : gold ? '#d39320' : '#6f8d3a' // the shell under its plates
  const PLATE = g ? (gold ? '#d3c79c' : '#b3b597') : gold ? '#ffd34d' : '#a3bf5c'
  const RIMC = g ? (gold ? '#c4b78c' : '#a7a98b') : gold ? '#f5b93a' : '#93b04f'
  const UNDER = g ? '#ddd6c2' : gold ? '#ffe9a8' : '#f1e3a6' // the shell's flat underside
  const DARK = g ? '#625f56' : gold ? '#7a5418' : '#3f4f22' // inside the shell
  const SKIN = g ? '#d3c8b2' : '#e5c584'
  const SKIN_FAR = g ? '#c6bba5' : '#d8b670' // the back legs and tail, a shade darker
  const NAIL = g ? '#eee8dd' : '#fff6e2'
  const SUN = g ? '#ddd5b0' : gold ? '#fffbe6' : '#ffd34d'
  const RAYS = g ? '#cfc59a' : gold ? '#ff8c1a' : '#ffad1f'
  const GLOW = gold ? '#fff5c4' : '#ffe680'
  const seam = useShade(SEAM, 0.3, 0.2)
  const plate = useShade(PLATE, 0.45, 0.12)
  const rim = useShade(RIMC, 0.35, 0.15)
  const under = useShade(UNDER, 0.4, 0.1)
  const skin = useShade(SKIN, 0.45, 0.12)
  const far = useShade(SKIN_FAR, 0.35, 0.12)
  const sun = useShade(SUN, 0.6, 0.1)
  const line = ink(SEAM)
  const skinLine = ink(SKIN)
  const top = TOPS[Math.min(stage, 2)]
  const cy = (top + 98) / 2 // the middle plate (the sun, once it has one)
  // The plates: a honeycomb round the middle one, cut off at the edge of the dome and the rim
  const S = 20.5
  const plates = [[0, 0], [-1.5, -0.866], [1.5, -0.866], [-1.5, 0.866], [1.5, 0.866], [-3, 0], [3, 0], [-3, 1.732], [3, 1.732], [-3, -1.732], [3, -1.732], [-1.5, 2.6], [1.5, 2.6]]
    .map(([i, j]) => [100 + i * S, cy + j * S] as const)
  const shell = `${domePath(top)} ${EDGE}Z`
  const sink = g ? 6 : 0 // a grumpy tortoise pulls its head back in
  return (
    <g>
      <defs>
        {seam.def}{plate.def}{rim.def}{under.def}{skin.def}{far.def}{sun.def}
        <clipPath id={clip}><path d={`${domePath(top)} ${RIM_IN}Z`} /></clipPath>
      </defs>

      {/* A little pointed tail, peeking out at the back and wagging (mirrored twice so the wag lifts it) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="100% 0%">
          <g transform={MIRROR}>
            <path d="M158 150 C170 151 179 157 186 167 C176 168 166 165 157 160 Z" fill={far.fill} stroke={skinLine} strokeWidth={2.5} strokeLinejoin="round" />
          </g>
        </Anim>
      </g>

      {/* Four stubby legs with little toenails: the back pair a shade darker, peeking out at the sides */}
      {([[-1, 40, 20, 174, far], [1, 160, 20, 174, far], [-1, 62, 24, 178, skin], [1, 138, 24, 178, skin]] as const).map(([side, x, w, foot, f]) => (
        <g key={x}>
          <path d={legPath(x, w, foot)} fill={f.fill} stroke={skinLine} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M${x - side * 3} ${foot - 20} q${side * 3} 2.5 ${side * 6} 0 M${x + side * 2} ${foot - 13} q${side * 3} 2.5 ${side * 6} 0`}
            stroke={skinLine} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.45} />
          {[-1, 0, 1].map((k) => (
            <ellipse key={k} cx={x + k * w * 0.28} cy={foot - 1.8} rx={w * 0.1} ry={2.3} fill={NAIL} stroke={skinLine} strokeWidth={1.2} />
          ))}
        </g>
      ))}

      {/* The shell (breathing): plates on the dome, a rim of little plates arching over the dark opening its head
          comes out of, and the sun once it has one */}
      <g className="pa-breathe">
        <path d={shell} fill={seam.fill} />
        <g clipPath={`url(#${clip})`}>
          {plates.map(([x, y], i) => (stage >= 1 && i === 0 ? null : (
            <path key={i} d={hexagon(x, y, S - 3.2)} fill={plate.fill} stroke={line} strokeWidth={1.5} strokeOpacity={0.35} />
          )))}
          {plates.map(([x, y], i) => i > 0 && (
            <path key={i} d={hexagon(x, y, S - 9.5)} fill="#fff" opacity={g ? 0.08 : 0.16} />
          ))}
        </g>
        <path d={RIM} fill={rim.fill} stroke={line} strokeWidth={2} strokeLinejoin="round" />
        <path d={RIM_SEAMS} stroke={line} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        <path d={OPENING} fill={DARK} />
        <path d={shell} fill="none" stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <Shine x={58} y={top + 26} rx={10} ry={5} rot={-40} />

        {/* Sunshell's sun, glowing on top of the shell (bigger and brighter on Desertdome's golden dome) */}
        {stage >= 1 && (
          <g transform={`translate(${pt(100, cy)}) scale(${gold ? 1.12 : 1})`}>
            {!g && (
              <Anim cls="pa-twinkle">
                <circle r={25} fill={GLOW} opacity={gold ? 0.7 : 0.5} />
              </Anim>
            )}
            <path d={sunRays(11.5, 12, 9)} fill={RAYS} stroke={ink(RAYS)} strokeWidth={1.3} strokeLinejoin="round" />
            <circle r={11.5} fill={sun.fill} stroke={ink(RAYS)} strokeWidth={2} />
            <ellipse cx={-3.8} cy={-4.2} rx={4.2} ry={2.5} fill="#fff" opacity={0.7} transform="rotate(-30 -3.8 -4.2)" />
          </g>
        )}

        {gold && <Crown x={100} y={top + 3} />}
      </g>

      {/* The front edge of its flat underside, under its chin (in front of it when it pulls its head in) */}
      {!g && <path d={BELLY} fill={under.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />}

      {/* The head, peeking out of the shell (pulled back in a little and tilted when grumpy, cheeks puffed out,
          grumbling) */}
      <g transform={sink ? `translate(0 ${sink}) rotate(-6 100 137)` : undefined}>
        <ellipse cx={100} cy={137} rx={32} ry={26} fill={skin.fill} stroke={skinLine} strokeWidth={3} />
        <Shine x={85} y={120} rx={8} ry={4.2} />
        {g && [-1, 1].map((side) => <ellipse key={side} cx={100 + side * 23} cy={145} rx={9} ry={6.5} fill="#ff7fb0" opacity={0.3} />)}
        <CuteFace x={100} y={133} s={0.9} gap={15} mood={mood} mouth={!g} blinkDelay={1.2} />
        {g && <path d="M90 151 q2.5 -3 5 0 t5 0 t5 0 t5 0" stroke="#2b2140" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </g>
      {g && <path d={BELLY} fill={under.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />}

      {gold && !g && [[30, 58, 8], [172, 50, 7], [176, 112, 6]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
