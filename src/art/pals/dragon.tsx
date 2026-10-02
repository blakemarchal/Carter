// Ember → Flarewing → Glorydrake: a chubby orange baby dragon facing you, with a flame on its tail.
// Stage 1 spreads flapping blue wings and longer horns; stage 2 has big curled horns, bigger wings and a crown.
import { type BodyProps, Anim, Crown, CuteFace, Shine, useShade } from '../kit'

const ORANGE = '#ff8f3f'
const CREAM = '#ffe0ae'
const WING = '#62b8ff'
const HORN = '#fff0cc'
const LINE = '#d9652b'
const CREAM_LINE = '#e5a564'
const WING_LINE = '#3a8ad6'

/** A horn standing on (0,0), curling outward to the left, length l. */
const hornPath = (l: number) =>
  `M-6 4 C-6 ${-l * 0.4} ${-l * 0.2} ${-l * 0.78} ${-l * 0.5} ${-l} C${-l * 0.12} ${-l * 0.66} 5 ${-l * 0.4} 6 4 Z`

// The left wing, hinged at the shoulder (74, 116): a bat wing with a scalloped edge.
const WING_PATH = 'M76 112 C62 96 44 78 26 56 Q35 79 30 100 Q44 98 50 110 Q63 113 66 128 Z'
const WING_RIBS = 'M72 116 L32 98 M72 118 L50 110'

const MIRROR = 'translate(200 0) scale(-1 1)'

// Tail flame, standing on (0,0).
const FLAME = 'M0 5 C-11 5 -14 -8 -8 -18 C-7 -12 -4 -11 -3 -14 C-4 -24 2 -32 7 -38 C6 -28 14 -24 13 -12 C14 -3 9 5 0 5 Z'
const FLAME_IN = 'M0 2 C-6 2 -7 -5 -3 -11 C-2 -8 0 -8 1 -10 C1 -15 4 -19 6 -22 C6 -16 9 -12 8 -6 C8 -1 5 2 0 2 Z'

export default function Dragon({ stage, mood }: BodyProps) {
  const skin = useShade(ORANGE, 0.38, 0.15)
  const cream = useShade(CREAM, 0.45, 0.08)
  const wing = useShade(WING, 0.4, 0.15)
  const horn = useShade(HORN, 0.5, 0.12)
  const flame = useShade('#ffa62b', 0.45, 0.1)
  const grumpy = mood === 'grumpy'
  const hornL = [15, 23, 33][stage] ?? 33
  const wingS = stage >= 2 ? 1.25 : 1
  const fl = [0.8, 1, 1.25][stage] ?? 1.25
  return (
    <g>
      <defs>{skin.def}{cream.def}{wing.def}{horn.def}{flame.def}</defs>

      {/* Wings (grown forms), flapping up and in from the shoulders. The right wing is the left one mirrored;
          the left one is mirrored twice so the flap stays symmetric. */}
      {stage >= 1 && [-1, 1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="0% 85%">
            <g transform={`${MIRROR} translate(74 118) scale(${wingS}) translate(-74 -118)`}>
              <path d={WING_PATH} fill={wing.fill} stroke={WING_LINE} strokeWidth={3 / wingS} strokeLinejoin="round" />
              <path d={WING_RIBS} stroke={WING_LINE} strokeWidth={2.2 / wingS} strokeLinecap="round" opacity={0.7} />
            </g>
          </Anim>
        </g>
      ))}

      {/* Tail curling up on the right, with a flickering flame (mirrored twice so it sways inward) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="100% 100%">
          <g transform={MIRROR}>
            <path d="M134 148 C152 154 164 146 167 124 Q172 117 178 123 C180 154 162 172 126 170 Z" fill={skin.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
            <g transform={`translate(172 120) scale(${fl})`}>
              <path d={FLAME} fill={flame.fill} stroke="#f0752a" strokeWidth={2.5 / fl} strokeLinejoin="round" />
              <g className="pa-twinkle"><path d={FLAME_IN} fill="#fff1a0" /></g>
            </g>
          </g>
        </Anim>
      </g>

      {/* Horns, behind the head */}
      {[1, -1].map((side) => (
        <path key={side} d={hornPath(hornL)} fill={horn.fill} stroke={CREAM_LINE} strokeWidth={3} strokeLinejoin="round"
          transform={`translate(${100 - side * 25} 62) scale(${side} 1) rotate(-6)`} />
      ))}

      {/* Body with a plated belly, and stubby arms (breathing) */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={138} rx={44} ry={38} fill={skin.fill} stroke={LINE} strokeWidth={3} />
        <ellipse cx={100} cy={148} rx={27} ry={25} fill={cream.fill} stroke={CREAM_LINE} strokeWidth={2} />
        <path d="M78 142 Q100 149 122 142 M79 156 Q100 163 121 156" stroke={CREAM_LINE} strokeWidth={2} fill="none" strokeLinecap="round" />
        <ellipse cx={72} cy={136} rx={9} ry={12} transform="rotate(30 72 136)" fill={skin.fill} stroke={LINE} strokeWidth={3} />
        <ellipse cx={128} cy={136} rx={9} ry={12} transform="rotate(-30 128 136)" fill={skin.fill} stroke={LINE} strokeWidth={3} />
      </g>

      {/* Head */}
      <ellipse cx={100} cy={86} rx={41} ry={37} fill={skin.fill} stroke={LINE} strokeWidth={3} />
      <Shine x={80} y={64} rx={11} ry={6} />

      {/* Feet with little claws */}
      {[80, 120].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={172} rx={14} ry={8} fill={skin.fill} stroke={LINE} strokeWidth={3} />
          {[-6, 0, 6].map((dx) => <circle key={dx} cx={x + dx} cy={177} r={2.4} fill={HORN} stroke={CREAM_LINE} strokeWidth={1} />)}
        </g>
      ))}

      {/* Face: eyes above a round snout with nostrils and a smile */}
      <CuteFace x={100} y={82} s={0.82} gap={15} mood={mood} mouth={false} />
      <ellipse cx={100} cy={101} rx={17} ry={10.5} fill={cream.fill} stroke={CREAM_LINE} strokeWidth={2} />
      <ellipse cx={94.5} cy={97} rx={2} ry={1.5} fill="#8a3d1c" />
      <ellipse cx={105.5} cy={97} rx={2} ry={1.5} fill="#8a3d1c" />
      {grumpy
        ? <path d="M94 106 Q100 101.5 106 106" stroke="#2b2140" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        : <path d="M93 102 Q100 110 107 102 Q100 104.5 93 102 Z" fill="#6b2a3a" stroke="#2b2140" strokeWidth={2} strokeLinejoin="round" />}

      {stage >= 2 && <Crown x={100} y={54} />}
    </g>
  )
}
