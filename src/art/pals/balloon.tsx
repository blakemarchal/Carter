// Pouty → Floaty → Partyloon: a round pink balloon buddy facing you, bobbing on a curly string.
// Stage 1 brings two buddy balloons; stage 2 adds two heart balloons, a big bow and a crown.
// Grumpy: droopy and half-deflated, in dull colours.
import { type BodyProps, Anim, Crown, CuteFace, ink, Shine, twinklePath, useShade } from '../kit'

const FULL = 'M100 34 C131 34 153 58 153 90 C153 121 128 145 100 150 C72 145 47 121 47 90 C47 58 69 34 100 34 Z'
const SAGGY = 'M100 52 C132 52 157 70 156 100 C155 127 128 146 100 150 C72 146 45 127 44 100 C43 70 68 52 100 52 Z'
const HEART = 'M0 7 C-6 2 -11 -2 -11 -6 C-11 -10 -8 -12 -5 -12 C-3 -12 -1 -11 0 -9 C1 -11 3 -12 5 -12 C8 -12 11 -10 11 -6 C11 -2 6 2 0 7 Z'

export default function Balloon({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const SKIN = g ? '#b98aa3' : '#ff5d9e'
  const BUDDIES = g ? ['#cdbb84', '#9fb3c7', '#a99cc0', '#9dbfae'] : ['#ffc928', '#7cc6ff', '#9b8cff', '#5fd39a']
  const STRING = '#9a8cb0'
  const skin = useShade(SKIN, 0.35, 0.18)
  const b0 = useShade(BUDDIES[0], 0.35, 0.15)
  const b1 = useShade(BUDDIES[1], 0.35, 0.15)
  const b2 = useShade(BUDDIES[2], 0.35, 0.15)
  const b3 = useShade(BUDDIES[3], 0.35, 0.15)
  const LINE = ink(SKIN)
  const top = g ? 52 : 34
  // Buddy balloons: [x, y, shade, colour, heart?]
  const buddies: [number, number, typeof b0, string, boolean][] = [
    ...(stage >= 1 ? [[28, 70, b0, BUDDIES[0], false], [172, 62, b1, BUDDIES[1], false]] as [number, number, typeof b0, string, boolean][] : []),
    ...(stage >= 2 ? [[40, 36, b2, BUDDIES[2], true], [160, 32, b3, BUDDIES[3], true]] as [number, number, typeof b0, string, boolean][] : []),
  ]

  return (
    <g>
      <defs>{skin.def}{b0.def}{b1.def}{b2.def}{b3.def}</defs>
      <g className="pa-float">
        {/* Buddy balloons, tied to the same knot */}
        {buddies.map(([x, y, shade, color, heart]) => (
          <g key={x}>
            <path d={`M${x} ${y + (heart ? 9 : 24)} Q${(x + 100) / 2} ${y + 70} 100 156`} stroke={STRING} strokeWidth={2} fill="none" />
            {heart ? (
              <path transform={`translate(${x} ${y}) scale(1.3)`} d={HEART} fill={shade.fill} stroke={ink(color)} strokeWidth={2.2} strokeLinejoin="round" />
            ) : (
              <>
                <path d={`M${x} ${y + 19} L${x - 5} ${y + 26} L${x + 5} ${y + 26} Z`} fill={color} stroke={ink(color)} strokeWidth={2} strokeLinejoin="round" />
                <ellipse cx={x} cy={y} rx={17} ry={21} fill={shade.fill} stroke={ink(color)} strokeWidth={2.5} />
                <Shine x={x - 7} y={y - 9} rx={3.5} ry={6.5} rot={30} />
              </>
            )}
          </g>
        ))}

        {/* Curly string, swaying */}
        <Anim cls="pa-tail" origin="50% 0%">
          <path d="M100 156 Q91 166 100 174 Q109 182 100 190" stroke={STRING} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </Anim>

        {/* Little hands, waving */}
        {[-1, 1].map((side) => {
          const [x, y] = [100 + side * (g ? 54 : 50), g ? 126 : 122]
          return (
            <Anim key={side} cls="pa-wing" origin={side < 0 ? '100% 0%' : '0% 0%'} delay={side > 0 ? 0.4 : 0}>
              <ellipse cx={x} cy={y} rx={6.5} ry={10} fill={skin.fill} stroke={LINE} strokeWidth={2.5} transform={`rotate(${side * -50} ${x} ${y})`} />
            </Anim>
          )
        })}

        {/* The balloon */}
        <path d="M100 147 L91 160 Q100 155 109 160 Z" fill={skin.fill} stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
        <path d={g ? SAGGY : FULL} fill={skin.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        {g && <path d="M58 120 Q64 116 66 122 M142 120 Q136 116 134 122" stroke={LINE} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />}
        <ellipse cx={74} cy={top + 30} rx={8} ry={16} fill="#fff" opacity={0.5} transform={`rotate(35 74 ${top + 30})`} />
        <circle cx={84} cy={top + 10} r={3.5} fill="#fff" opacity={0.6} />
        <CuteFace x={100} y={g ? 102 : 94} s={1} gap={16} mood={mood} blinkDelay={0.6} />

        {/* Partyloon's big bow */}
        {stage >= 2 && (
          <g fill="#ffe14d" stroke="#d9a400" strokeWidth={2.5} strokeLinejoin="round">
            <path d="M100 160 Q80 146 76 160 Q80 174 100 160 Z M100 160 Q120 146 124 160 Q120 174 100 160 Z" />
            <path d="M97 162 L88 178 L94 178 L100 168 L106 178 L112 178 L103 162 Z" />
            <circle cx={100} cy={160} r={5} />
          </g>
        )}
        {stage >= 2 && <Crown x={100} y={top + 4} />}
      </g>

      {stage >= 2 && [[24, 126, 8], [178, 118, 7]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
