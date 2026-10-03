// Humpy → Dunewalker → Starcaravan: a young camel standing side-on with his head turned to face you:
// one round hump, four legs with knobbly knees and wide two-toed feet, big lashes and a curly tuft on top.
// The hump grows each stage. Dunewalker wears a purple travel blanket over his hump and a saddle bag;
// Starcaravan's blanket is starry and tasseled, he wears a harness with jingle bells, and a crown.
// Grumpy (in battle): tired of the long, long walk: dusty and dull, with a sweat drop and a frown, and his head,
// ears and hump all drooping.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, starPath, twinklePath, useShade } from '../kit'

type Pt = [number, number]

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

/** A curly tuft: little round curls around an ellipse, as one scalloped outline. */
function curls(cx: number, cy: number, rx: number, ry: number, n: number) {
  const p = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * (i + 0.5)) / n
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  })
  return `M${pt(p[0][0], p[0][1])}` + p.map(([x, y], i) => {
    const [nx, ny] = p[(i + 1) % n]
    const r = (Math.hypot(nx - x, ny - y) * 0.6).toFixed(1)
    return ` A${r} ${r} 0 0 1 ${pt(nx, ny)}`
  }).join('') + 'Z'
}

const MIRROR = 'translate(200 0) scale(-1 1)'
// The hump: a round dome on the back (y BACK), centred on x HX.
const HX = 146
const BACK = 108
/** The hump's outline from its front foot over the top to its back foot, `h` tall; `lean` tips its top
 *  back (a tired camel's hump goes floppy). */
const dome = (h: number, lean = 0): Pt[] => ([[126, 0], [131, 0.5], [137, 0.88], [HX, 1], [155, 0.88], [161, 0.5], [166, 0]] as Pt[])
  .map(([x, f]) => [x + lean * f * f, BACK - h * f])
/** The body side-on, facing left (chest on the left, under the head), with one round hump. */
const bodyPts = (h: number, lean: number): Pt[] => [[88, 128], [95, 115], [112, 110], ...dome(h, lean), [169, 116], [171, 130], [165, 142], [148, 147], [110, 148], [92, 142]]

/** A leg with a knobbly knee, from inside the body down to its foot, centred on x. */
const legPath = (x: number) =>
  `M${x - 6} 140 L${x - 6} 155 C${x - 9.5} 157 ${x - 9.5} 165 ${x - 5.5} 167 L${x - 5} 174 L${x + 5} 174 L${x + 5.5} 167 C${x + 9.5} 165 ${x + 9.5} 157 ${x + 6} 155 L${x + 6} 140 Z`
/** A wide, flat padded foot with two toes, standing on the ground (y 178). */
const footPath = (x: number) =>
  `M${x - 10.5} 178 C${x - 11} 173 ${x - 7} 170.5 ${x - 3} 171 Q${x} 171.5 ${x} 173.5 Q${x} 171.5 ${x + 3} 171 C${x + 7} 170.5 ${x + 11} 173 ${x + 10.5} 178 Z`

const HEM = 129 // the travel blanket's bottom edge
const BL = 115 // its front edge (behind the head)
const BR = 170.5 // its back edge, at the rump
/** The travel blanket: over the back and round the bottom of the hump (which pokes out of it), down the side to a wavy hem. */
function blanketPath(h: number) {
  const top: Pt[] = [[BL, 111], [123, 108.4], [129.5, BACK - 0.36 * h], [HX, BACK - 0.5 * h], [162.5, BACK - 0.36 * h], [167.5, 109.5], [169.6, 116], [BR, 123]]
  const waves = 6
  const step = (BR - BL) / waves
  let hem = ''
  for (let i = 1; i <= waves; i++) hem += ` Q${pt(BR - step * (i - 0.5), HEM + 4)} ${pt(BR - step * i, HEM)}`
  return `M${pt(...top[0])}${through(top, false)} L${pt(BR, HEM)}${hem} Z`
}

/** A little jingle bell hanging from (x, y). */
const Bell = ({ x, y, fill, line }: { x: number; y: number; fill: string; line: string }) => (
  <g>
    <path d={`M${x - 5} ${y + 9} Q${x - 5} ${y + 1} ${x} ${y + 1} Q${x + 5} ${y + 1} ${x + 5} ${y + 9} Z`} fill={fill} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
    <circle cx={x} cy={y + 9.5} r={1.8} fill="#a06a00" />
  </g>
)

export default function Camel({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const FUR = g ? '#c9bba6' : '#efc282'
  const FUR_FAR = g ? '#b8aa95' : '#dfae6d' // the legs on the far side, a shade darker
  const MUZZLE = g ? '#e4dbcc' : '#fcebcf'
  const TUFT = g ? '#a28f78' : '#c98848'
  const PAD = g ? '#948470' : '#b98858'
  const EAR_IN = g ? '#d8b9b9' : '#ffb7c6'
  const BLANKET = g ? '#a49cbf' : '#9b8cff' // Patience purple
  const TRIM = g ? '#cfc39a' : '#ffd34d'
  const GOLD_LINE = g ? '#9c8e66' : '#c08a00'
  const BAG = g ? '#9c8a76' : '#c27c45'
  const HARNESS = g ? '#b38c86' : '#ff6a4d'
  const TASSELS = g ? ['#b38c86', '#cfc39a', '#9fb0c4'] : ['#ff5d9e', '#ffc928', '#5fb7ff']
  const fur = useShade(FUR, 0.4, 0.15)
  const far = useShade(FUR_FAR, 0.35, 0.15)
  const muzzle = useShade(MUZZLE, 0.45, 0.07)
  const tuft = useShade(TUFT, 0.35, 0.15)
  const blanket = useShade(BLANKET, 0.3, 0.15)
  const bag = useShade(BAG, 0.3, 0.15)
  const gold = useShade(TRIM, 0.45, 0.12)
  const line = ink(FUR)
  const hump = [26, 30, 34][Math.min(stage, 2)] * (g ? 0.88 : 1) // (a little floppy when he's tired)
  const lean = g ? 6 : 0
  const droop = g ? 4 : 0 // a tired camel hangs his head
  const fringe = Array.from({ length: 10 }, (_, i) => BL + 5 + i * ((BR - BL - 9) / 9))
  return (
    <g>
      <defs>{fur.def}{far.def}{muzzle.def}{tuft.def}{blanket.def}{bag.def}{gold.def}</defs>

      {/* Tail with a little tuft, swishing from the rump (mirrored twice so it swings out, not in behind the legs) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="100% 0%">
          <g transform={MIRROR}>
            <path d="M166 120 C173 126 175 136 174 146" stroke={line} strokeWidth={6.5} fill="none" strokeLinecap="round" />
            <path d="M166 120 C173 126 175 136 174 146" stroke={FUR} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={curls(174, 149, 4, 6.5, 5)} fill={tuft.fill} stroke={ink(TUFT)} strokeWidth={2} strokeLinejoin="round" />
          </g>
        </Anim>
      </g>

      {/* Four legs with knobbly knees: the far pair a shade darker, just behind the near pair */}
      {([[110, far], [160, far], [98, fur], [148, fur]] as const).map(([x, f]) => (
        <g key={x}>
          <path d={legPath(x)} fill={f.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          <path d={footPath(x)} fill={PAD} stroke={ink(PAD)} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      ))}

      {/* Body and hump, with the blanket, saddle bag and harness once grown */}
      <g className="pa-breathe">
        <path d={smooth(bodyPts(hump, lean))} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={130} cy={139} rx={26} ry={5.5} fill={MUZZLE} opacity={0.55} />
        <Shine x={HX - 7 + lean * 0.6} y={BACK - hump * 0.74} rx={6.5} ry={3.8} rot={-35} />

        {stage >= 1 && (
          <>
            {/* Saddle bag, hanging from under the blanket */}
            <path d="M135 126 H159 V146 Q159 152 153 152 H141 Q135 152 135 146 Z" fill={bag.fill} stroke={ink(BAG)} strokeWidth={2.5} strokeLinejoin="round" />
            <path d="M134 127 H160 V137 Q147 143 134 137 Z" fill={BAG} stroke={ink(BAG)} strokeWidth={2.5} strokeLinejoin="round" />
            <rect x={144} y={135.5} width={6} height={6} rx={1.5} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={1.5} />

            {/* The travel blanket, with a gold stripe and a fringe (tassels and stars on Starcaravan's) */}
            {stage < 2 && fringe.map((x) => (
              <path key={x} d={`M${pt(x, HEM + 1)} V${HEM + 6.5}`} stroke={TRIM} strokeWidth={2.5} strokeLinecap="round" />
            ))}
            <path d={blanketPath(hump)} fill={blanket.fill} stroke={ink(BLANKET)} strokeWidth={2.5} strokeLinejoin="round" />
            <path d={`M${BL + 6} ${HEM - 6} H${BR - 2}`} stroke={TRIM} strokeWidth={3} strokeLinecap="round" />
            {stage >= 2 && (
              <>
                {[[134, 113, 5], [150, 108, 5.5], [162, 117, 4.5]].map(([x, y, r]) => (
                  <path key={x} d={starPath(x, y, r)} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={1.4} strokeLinejoin="round" />
                ))}
                {/* Tassels hanging from the hem: a knot and a flared skirt of threads */}
                {[122, 129.5, 163.5, 169].map((x, i) => {
                  const c = TASSELS[i % 3]
                  return (
                    <g key={x}>
                      <path d={`M${pt(x - 2, HEM + 5)} L${pt(x - 4.2, HEM + 15)} L${pt(x - 2.1, HEM + 14)} L${pt(x, HEM + 15.5)} L${pt(x + 2.1, HEM + 14)} L${pt(x + 4.2, HEM + 15)} L${pt(x + 2, HEM + 5)} Z`}
                        fill={c} stroke={ink(c)} strokeWidth={1.5} strokeLinejoin="round" />
                      <path d={`M${pt(x - 1, HEM + 8)} L${pt(x - 1.8, HEM + 13)} M${pt(x + 1, HEM + 8)} L${pt(x + 1.8, HEM + 13)}`} stroke={ink(c)} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
                      <circle cx={x} cy={HEM + 4} r={2.5} fill={gold.fill} stroke={GOLD_LINE} strokeWidth={1.2} />
                    </g>
                  )
                })}
              </>
            )}
          </>
        )}

        {/* Starcaravan's harness: a red strap across the chest with jingle bells */}
        {stage >= 2 && (
          <>
            <path d="M126 116 Q112 128 94 132.5" stroke={ink(HARNESS)} strokeWidth={7.5} fill="none" strokeLinecap="round" />
            <path d="M126 116 Q112 128 94 132.5" stroke={HARNESS} strokeWidth={4.5} fill="none" strokeLinecap="round" />
            {[[99.3, 132.4], [109.3, 128.5], [118.7, 123]].map(([x, y]) => <Bell key={x} x={x} y={y} fill={gold.fill} line={GOLD_LINE} />)}
          </>
        )}
      </g>

      {/* Head, turned to face you */}
      <g transform={droop ? `translate(0 ${droop})` : undefined}>
        {/* Small round ears that twitch (drooping when grumpy) */}
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${100 + side * 28} 55) rotate(${side * (g ? 100 : 45)})`}>
            <Anim cls="pa-ear" origin="50% 100%" delay={side > 0 ? 0.5 : 0}>
              <ellipse cx={0} cy={-6} rx={6.5} ry={9.5} fill={fur.fill} stroke={line} strokeWidth={3} />
              <ellipse cx={0} cy={-5} rx={3.2} ry={6} fill={EAR_IN} />
            </Anim>
          </g>
        ))}

        <ellipse cx={100} cy={70} rx={31} ry={28} fill={fur.fill} stroke={line} strokeWidth={3} />
        <Shine x={85} y={54} rx={8} ry={4.5} />
        {/* Curly tuft on top */}
        <path d={curls(100, 44, 11, 6, 7)} fill={tuft.fill} stroke={ink(TUFT)} strokeWidth={2.5} strokeLinejoin="round" />

        {/* Long soft muzzle with slit nostrils and a split lip (a frown when grumpy) */}
        <ellipse cx={100} cy={100} rx={21} ry={16.5} fill={muzzle.fill} stroke={ink(MUZZLE)} strokeWidth={2.5} />
        <ellipse cx={91.5} cy={94} rx={1.9} ry={3.6} fill={PAD} transform="rotate(-30 91.5 94)" />
        <ellipse cx={108.5} cy={94} rx={1.9} ry={3.6} fill={PAD} transform="rotate(30 108.5 94)" />
        <path d={g ? 'M100 99 V104 M92.5 110.5 Q100 104 107.5 110.5' : 'M100 99 V103 M92.5 104 Q96 108 100 103 Q104 108 107.5 104'}
          stroke="#7a5236" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        <CuteFace x={100} y={70} s={0.8} gap={15} mood={mood} mouth={false} blinkDelay={1.8} />
        {/* Big lashes flicking out from the outer corner of each eye */}
        {[-1, 1].map((side) => (
          <path key={side} transform={side > 0 ? MIRROR : undefined}
            d="M82.5 67.5 L77.5 65 M83.5 64 L79.5 60" stroke="#2b2140" strokeWidth={2.2} strokeLinecap="round" />
        ))}

        {stage >= 2 && <Crown x={100} y={45} />}
      </g>

      {/* A tired sweat drop */}
      {g && <path d="M140 50 Q146 58 143 62 A4.5 4.5 0 0 1 135 59 Q136 55 140 50 Z" fill="#bfe6ff" stroke="#6aa9d8" strokeWidth={2} strokeLinejoin="round" />}

      {/* Starry twinkles around Starcaravan */}
      {stage >= 2 && !g && [[34, 64, 8], [176, 50, 7], [30, 150, 6]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
