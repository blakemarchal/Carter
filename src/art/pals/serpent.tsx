// Pebble → Boulderoo → Rockmount: a round little rock serpent facing you, its chain of boulders coiled
// around behind its head. Each stage adds boulders to the coil (round the bottom, then up the left);
// Pebble has a tiny sprout, stage 1 grows a purple crystal crest, stage 2 a crown and crystals down its back.
import { type BodyProps, Anim, Crown, CuteFace, Shine, pt, twinklePath, useShade } from '../kit'

const ROCK = '#bcb5ac'
const ROCK2 = '#aaa399'
const LINE = '#847c72'
const GEM = '#ab9bff'
const GEM_LINE = '#7262d4'

const LUMPS = [1, 0.93, 1.03, 0.95, 1.02, 0.94, 1.04, 0.96]

/** A slightly lumpy round rock (a smooth curve through 8 wobbly points); `amp` scales the lumps. */
function rock(cx: number, cy: number, rx: number, ry: number, seed = 0, amp = 1) {
  const p = LUMPS.map((_, i) => {
    const a = (i / 8) * Math.PI * 2 + seed * 0.7
    const k = 1 + (LUMPS[(i + seed) % 8] - 1) * amp
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
  })
  const at = (i: number) => p[(i + 8) % 8]
  let d = `M${pt(p[0][0], p[0][1])}`
  for (let i = 0; i < 8; i++) {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    d += ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(c[0], c[1])}`
  }
  return `${d}Z`
}

// The chain of boulders: from the neck (low on the left, under the head) along the ground, then curling up
// the right side and round behind the head. [x, y, r, angle its back crystal points (degrees, 0 = none)]
type Boulder = [number, number, number, number]
const CHAIN: Boulder[] = [
  [70, 142, 24, 0],
  [100, 158, 22, 0],
  [132, 153, 20, 0],
  [148, 132, 17, -10],
  [150, 108, 14.5, -15],
  [150, 86, 12, -40],
  [144, 68, 10, 0],
]

/** A pointed crystal standing on (0,0). */
const crystal = (h: number, w: number) => `M${-w} 0 L${-w} ${-h * 0.62} L0 ${-h} L${w} ${-h * 0.62} L${w} 0 Z`

export default function Serpent({ stage, mood }: BodyProps) {
  const light = useShade(ROCK, 0.42, 0.16)
  const dark = useShade(ROCK2, 0.42, 0.16)
  const gem = useShade(GEM, 0.5, 0.15)
  const crest = stage >= 2 ? 1.25 : 1
  const chain = CHAIN.slice(0, stage >= 2 ? 7 : stage >= 1 ? 5 : 3)

  const boulder = ([x, y, r, out]: Boulder, i: number) => (
    <g key={i}>
      {stage >= 2 && out !== 0 && (
        <path d={crystal(r * 1.05, r * 0.36)} fill={gem.fill} stroke={GEM_LINE} strokeWidth={2} strokeLinejoin="round"
          transform={`translate(${x + Math.cos((out * Math.PI) / 180) * r * 0.7} ${y + Math.sin((out * Math.PI) / 180) * r * 0.7}) rotate(${out + 90})`} />
      )}
      <path d={rock(x, y, r, r * 0.93, i * 3 + 1)} fill={i % 2 ? dark.fill : light.fill} stroke={LINE} strokeWidth={3} />
      <circle cx={x + r * 0.35} cy={y + r * 0.3} r={r * 0.12} fill={LINE} opacity={0.45} />
    </g>
  )
  const last = chain.length - 1

  return (
    <g>
      <defs>{light.def}{dark.def}{gem.def}</defs>

      {/* The chain of boulders, tail first so the neck sits in front; the tail tip wiggles */}
      <Anim cls="pa-tail" origin="0% 100%">{boulder(chain[last], last)}</Anim>
      <g className="pa-breathe">
        {chain.slice(0, -1).map((b, i) => [b, i] as const).reverse().map(([b, i]) => boulder(b, i))}
        <path d="M56 140 Q61 136 66 141 M96 165 Q101 161 106 164" stroke={LINE} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
      </g>

      {/* On top: a tiny sprout for Pebble, then a purple crystal crest */}
      {stage >= 1 ? (
        <g stroke={GEM_LINE} strokeWidth={2.5} strokeLinejoin="round">
          <path d={crystal(20 * crest, 6)} fill={gem.fill} transform="translate(87 60) rotate(-24)" />
          <path d={crystal(20 * crest, 6)} fill={gem.fill} transform="translate(113 60) rotate(24)" />
          <path d={crystal(32 * crest, 8)} fill={gem.fill} transform="translate(100 58)" />
          <path d={`M100 ${58 - 28 * crest} L100 50`} stroke="#fff" strokeWidth={2} opacity={0.6} strokeLinecap="round" />
          <path className="pa-twinkle" d={twinklePath(108, 58 - 26 * crest, 5)} fill="#fff" stroke="none" />
        </g>
      ) : (
        <Anim cls="pa-ear" origin="50% 100%">
          <path d="M100 54 C100 46 101 42 104 36" stroke="#4f8a3a" strokeWidth={3} fill="none" strokeLinecap="round" />
          <ellipse cx={95} cy={38} rx={8} ry={4.5} transform="rotate(25 95 38)" fill="#7cc46a" stroke="#4f8a3a" strokeWidth={2} />
          <ellipse cx={111} cy={33} rx={9} ry={5} transform="rotate(-25 111 33)" fill="#7cc46a" stroke="#4f8a3a" strokeWidth={2} />
        </Anim>
      )}

      {/* Big boulder head */}
      <path d={rock(100, 89, 47, 38, 0, 0.35)} fill={light.fill} stroke={LINE} strokeWidth={3} />
      <Shine x={80} y={64} rx={12} ry={6} />
      <circle cx={132} cy={70} r={2.6} fill={LINE} opacity={0.4} />
      <circle cx={66} cy={106} r={2.2} fill={LINE} opacity={0.4} />
      <path d="M138 98 L131 103 L135 110" stroke={LINE} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />

      <CuteFace x={100} y={90} s={0.88} gap={15} mood={mood} />

      {stage >= 2 && <Crown x={100} y={55} />}
    </g>
  )
}
