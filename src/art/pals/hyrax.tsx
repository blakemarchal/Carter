// Nibbles → Rockhopper → Cliffcrown: a round, furry little rock hyrax sitting on a rock from the mountain where
// God spoke to Moses: like a plump guinea pig with tiny round ears and no tail, a little tuft of fur on top, a
// blunt cream snout with a dark nose, two buck teeth and whiskers, a cream tummy and little paws.
// Rockhopper's rock has a sprig of pink desert flowers growing out of a crack; Cliffcrown sits on a bigger rock
// with a little shining stone set in it, and wears a crown.
// Grumpy, it goes a dusty grey-brown, hunches down, flattens its ears, droops its whiskers and frowns.
import { type BodyProps, Anim, Crown, CuteFace, ink, lighten, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** A smooth closed outline through the points (Catmull-Rom). */
function smooth(ps: Pt[]) {
  const n = ps.length
  const at = (i: number) => ps[(i + n) % n]
  let d = `M${pt(...ps[0])}`
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    d += ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }
  return `${d}Z`
}

const MIRROR = 'translate(200 0) scale(-1 1)'

// The rock it sits on (its top, under the hyrax, at about y 144), a little lumpy, with its flat top showing at
// the sides; and Cliffcrown's bigger one: wider, with a craggy cliff of rock rising up behind it on the right.
const ROCK: Pt[] = [[100, 180], [56, 179], [45, 173], [42, 162], [46, 151], [56, 143], [72, 143], [86, 145], [100, 144], [116, 144], [136, 145], [150, 151], [157, 161], [156, 172], [146, 179]]
const ROCK_TOP = 'M45 153 C49 145 62 141 78 143 C92 145 108 143 122 144 C137 145 148 148 155 155 C141 161 121 162 100 162 C79 162 58 161 45 153 Z'
const BIG_ROCK: Pt[] = [[100, 180], [44, 179], [33, 173], [30, 161], [35, 150], [49, 144], [68, 144], [86, 145], [100, 144], [118, 144], [138, 144], [154, 147], [165, 155], [169, 166], [165, 176], [154, 179]]
const BIG_TOP = 'M33 152 C38 145 52 141 70 143 C86 145 112 142 130 143 C148 144 160 149 166 157 C150 162 124 163 100 163 C76 163 48 161 33 152 Z'
const CLIFF: Pt[] = [[128, 152], [131, 132], [139, 117], [151, 106], [165, 102], [175, 111], [179, 128], [178, 147], [170, 156]]
const CLIFF_TOP = 'M137 121 C142 112 152 104 165 102 C171 104 174 108 175 112 C164 112 150 116 137 121 Z'

/** A little five-petal desert flower centred on (x, y). */
const Flower = ({ x, y, r, petal, line, mid }: { x: number; y: number; r: number; petal: string; line: string; mid: string }) => (
  <g transform={`translate(${pt(x, y)}) scale(${r})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={0} cy={-4.2} rx={3.3} ry={4.4} fill={petal} stroke={line} strokeWidth={1.3} transform={`rotate(${a})`} />
    ))}
    <circle r={2.4} fill={mid} stroke={ink(mid)} strokeWidth={1} />
  </g>
)

export default function Hyrax({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const FUR = g ? '#b5a597' : '#c98f5f'
  const CREAM = g ? '#e7dfd4' : '#fde9d0'
  const EAR_IN = g ? '#cdb0a9' : '#f4a99f'
  const NOSE = g ? '#6c5c55' : '#5d3a2e'
  const ROCKC = g ? '#aba7b4' : '#b7aecb'
  const PETAL = g ? '#cdb6c2' : '#ff8fc4'
  const PETAL_LINE = g ? '#a08b97' : '#e0609a'
  const MID = g ? '#d8d0a8' : '#ffd34d'
  const LEAF = g ? '#a9b29b' : '#93c46f'
  const GEM = g ? '#a9c2ca' : '#5cd3f2'
  const fur = useShade(FUR, 0.4, 0.15)
  const cream = useShade(CREAM, 0.5, 0.06)
  const rock = useShade(ROCKC, 0.3, 0.18)
  const rockTop = useShade(lighten(ROCKC, 0.35), 0.3, 0.05)
  const gem = useShade(GEM, 0.55, 0.15)
  const line = ink(FUR)
  const rockLine = ink(ROCKC)
  const big = stage >= 2
  // Where the flower sprig grows out of the rock: from a crack at the top of its left side
  const sprig: Pt = big ? [40, 150] : [49, 156]
  const hunch = g ? 3 : 0 // a grumpy hyrax hunches its head down into its fur
  return (
    <g>
      <defs>{fur.def}{cream.def}{rock.def}{rockTop.def}{gem.def}</defs>

      {/* The rock, with its flat top showing at the sides, a few cracks and specks (Cliffcrown's is bigger, with
          a cliff behind it) */}
      {big && (
        <>
          <path d={smooth(CLIFF)} fill={rock.fill} stroke={rockLine} strokeWidth={3} strokeLinejoin="round" />
          <path d={CLIFF_TOP} fill={rockTop.fill} />
          <path d="M160 116 L155 127 L161 135 M172 138 L167 146" stroke={rockLine} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />
        </>
      )}
      <path d={smooth(big ? BIG_ROCK : ROCK)} fill={rock.fill} stroke={rockLine} strokeWidth={3} strokeLinejoin="round" />
      <path d={big ? BIG_TOP : ROCK_TOP} fill={rockTop.fill} />
      <path d={big ? 'M154 160 L148 167 L152 174 M48 164 L54 170' : 'M138 163 L133 169 L137 175 M60 166 L65 171'}
        stroke={rockLine} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />
      {(big ? [[62, 175], [84, 177], [140, 176], [40, 165], [160, 168]] : [[72, 175], [126, 176], [148, 168]]).map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.8} fill={rockLine} opacity={0.45} />
      ))}
      {!big && <path d={smooth([[158, 178], [160, 172], [167, 170], [172, 174], [170, 179]])} fill={rock.fill} stroke={rockLine} strokeWidth={2.5} strokeLinejoin="round" />}

      {/* Rockhopper's sprig of desert flowers, growing out of a crack in the rock and swaying */}
      {stage >= 1 && (
        <g transform={`translate(${pt(...sprig)})`}>
          <Anim cls="pa-tail" origin="100% 100%">
            <path d="M0 0 C-3 -10 -8 -20 -15 -30 M-5 -13 C-11 -15 -17 -14 -23 -10 M-9 -20 C-7 -28 -6 -34 -6 -40"
              stroke={g ? '#8f977f' : '#5f9a46'} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            {[[-10, -9, -30], [-15, -21, 40], [-3, -27, -60]].map(([x, y, a]) => (
              <ellipse key={a} cx={x} cy={y} rx={2.6} ry={6} fill={LEAF} stroke={ink(LEAF)} strokeWidth={1.3} transform={`rotate(${a} ${x} ${y})`} />
            ))}
            <Flower x={-15} y={-31} r={1} petal={PETAL} line={PETAL_LINE} mid={MID} />
            <Flower x={-24} y={-10} r={0.85} petal={PETAL} line={PETAL_LINE} mid={MID} />
            <Flower x={-6} y={-42} r={0.8} petal={PETAL} line={PETAL_LINE} mid={MID} />
          </Anim>
        </g>
      )}

      {/* Big hind feet turned out at its sides */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <g transform="rotate(-14 62 157)">
            <ellipse cx={62} cy={157} rx={13.5} ry={7.5} fill={fur.fill} stroke={line} strokeWidth={3} />
            <path d="M55 153.5 v5 M61 153 v5.5 M67 153.5 v5" stroke={line} strokeWidth={2} strokeLinecap="round" />
          </g>
        </g>
      ))}

      {/* Plump round body with a cream tummy, breathing */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={129} rx={42} ry={34} fill={fur.fill} stroke={line} strokeWidth={3} />
        <ellipse cx={100} cy={141} rx={25} ry={19} fill={cream.fill} />
        {[-1, 1].map((side) => (
          <path key={side} transform={side > 0 ? MIRROR : undefined} d="M62 126 Q65 134 64 142" stroke={line} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.45} />
        ))}
      </g>

      {/* Little front paws, tucked under its tummy */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <ellipse cx={100 + side * 11} cy={161} rx={8.5} ry={6} fill={fur.fill} stroke={line} strokeWidth={3} />
          <path d={`M${100 + side * 11 - 2.8} 158.5 v4 M${100 + side * 11 + 2.8} 158.5 v4`} stroke={line} strokeWidth={1.8} strokeLinecap="round" />
        </g>
      ))}

      {/* Head (hunched down a little when grumpy) */}
      <g transform={hunch ? `translate(0 ${hunch})` : undefined}>
        {/* Tiny round ears that twitch (flattened out to the sides when grumpy) */}
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${100 + side * (g ? 33 : 29.5)} ${g ? 74 : 69}) rotate(${side * (g ? 62 : 12)})`}>
            <Anim cls="pa-ear" origin="50% 100%" delay={side > 0 ? 0.5 : 0}>
              <ellipse cx={0} cy={-3} rx={7.5} ry={g ? 5.5 : 7} fill={fur.fill} stroke={line} strokeWidth={3} />
              <ellipse cx={0} cy={-2.5} rx={4} ry={g ? 2.8 : 3.8} fill={EAR_IN} />
            </Anim>
          </g>
        ))}
        {/* A little tuft of fur on top (behind the head, so it grows out of it; under Cliffcrown's crown) */}
        {!big && <path d="M91 64 C88 57 91 52 95 51 C95 55 97 57 99 56 C98 50 101 46 106 45 C105 50 107 53 109 55 C111 53 113 53 115 54 C114 58 112 61 110 64 Z"
          fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />}

        <ellipse cx={100} cy={92} rx={37} ry={33} fill={fur.fill} stroke={line} strokeWidth={3} />
        <Shine x={81} y={71} rx={9} ry={5} />

        {/* A blunt cream snout with whiskers, a dark nose, a little mouth and two buck teeth */}
        <ellipse cx={100} cy={106} rx={16} ry={11.5} fill={cream.fill} />
        {[-1, 1].map((side) => (
          <path key={side} transform={side > 0 ? MIRROR : undefined}
            d={g ? 'M85 104 L68 108 M85 108 L67 115 M86 112 L70 121' : 'M85 103 L67 99 M85 107 L65 108 M86 111 L68 116'}
            stroke={NOSE} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.55} />
        ))}
        <CuteFace x={100} y={87} s={0.85} gap={16} mood={mood} mouth={false} blinkDelay={1.6} />
        <g fill="#fff" stroke="#b9a596" strokeWidth={1.2}>
          <rect x={97.2} y={g ? 109.8 : 107.4} width={2.8} height={4.4} rx={1} />
          <rect x={100} y={g ? 109.8 : 107.4} width={2.8} height={4.4} rx={1} />
        </g>
        <path d="M95 98.5 Q100 96.5 105 98.5 Q104.5 102.5 100 104 Q95.5 102.5 95 98.5 Z" fill={NOSE} stroke={NOSE} strokeWidth={1.5} strokeLinejoin="round" />
        <path d={g ? 'M100 104 V107 M93.5 112 Q100 106.5 106.5 112' : 'M100 104 V107 M93.5 107.2 Q96.8 111 100 107 Q103.2 111 106.5 107.2'}
          stroke={NOSE} strokeWidth={2.1} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {big && <Crown x={100} y={62} />}
      </g>

      {big && (
        <>
          {/* The little shining stone, set in the front of the rock */}
          <g transform="translate(125 170)">
            <path d="M-8 -1.5 L-5 -7 L5 -7 L8 -1.5 L0 8 Z" fill={gem.fill} stroke={ink(GEM)} strokeWidth={2} strokeLinejoin="round" />
            <path d="M-8 -1.5 H8 M-2 -7 L-3 -1.5 L0 8 L3 -1.5 L2 -7" stroke={ink(GEM)} strokeWidth={1.1} fill="none" strokeLinejoin="round" opacity={0.6} />
            <path d="M-5 -4.3 L-2.8 -4.3" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.9} />
          </g>
          {!g && (
            <Anim cls="pa-twinkle" delay={0.3}>
              <path d={twinklePath(136, 166, 6)} fill="#fff6c2" stroke="#ffe066" strokeWidth={1} />
            </Anim>
          )}
          {!g && [[28, 64, 8], [168, 48, 7], [185, 86, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
