// Crabby → Sharewell → Kingclaw: a round little crab facing you, its eyes bulging up on top of its shell.
// Stage 1 raises bigger claws and grows an extra pair of legs; stage 2 has huge claws, a spiky shell and a crown.
// Grumpy: a darker red, with its claws up.
import { type BodyProps, Anim, Crown, CuteFace, ink, lighten, Shine, useShade } from '../kit'

/** A pincer opening at the top, centred on its palm. */
const PINCER = 'M6 -15 Q1.5 -9 0 -3 Q-1.5 -9 -6 -15 A16 16 0 1 0 6 -15 Z'
/** The shell: a round body with two eye bumps on top. */
const SHELL_PATH = 'M44 134 C44 114 54 104 67 100 A16 16 0 1 1 97 100 Q100 102 103 100 A16 16 0 1 1 133 100 C146 104 156 114 156 134 C156 158 132 172 100 172 C68 172 44 158 44 134 Z'

export default function Crab({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const SHELL = g ? '#c4463b' : '#ff7650'
  const BELLY = g ? '#e3a294' : '#ffd6c0'
  const LINE = ink(SHELL)
  const body = useShade(SHELL, 0.35, 0.16)
  const claw = useShade(SHELL, 0.45, 0.18)
  const belly = useShade(BELLY, 0.4, 0.06)
  const up = stage >= 1 || g
  const size = stage >= 2 ? 1.3 : stage >= 1 ? 1.12 : 0.95
  const [cx, cy, rot] = stage >= 2 ? [34, 58, -18] : up ? [32, 68, -18] : [28, 104, -40]
  const arm = up ? `M56 124 Q36 114 ${cx + 4} ${cy + 14}` : `M56 128 Q40 126 ${cx + 8} ${cy + 10}`
  const legs = [
    'M54 138 Q34 136 26 158 L24 172',
    'M58 150 Q42 152 38 168 L38 178',
    'M68 160 Q58 166 56 178',
    ...(stage >= 1 ? ['M52 128 Q32 122 21 137 L16 149'] : []),
  ].join(' ')

  return (
    <g>
      <defs>{body.def}{claw.def}{belly.def}</defs>

      {/* Legs (behind the shell), an outline stroke under a colour stroke */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(100 0) scale(${side} 1) translate(-100 0)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={legs} stroke={LINE} strokeWidth={10} />
          <path d={legs} stroke={SHELL} strokeWidth={5.5} />
        </g>
      ))}

      {/* Arms and pincers, waving (drawn as the right arm, mirrored for the left, so both wave up and in) */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(100 0) scale(${side} 1) translate(-100 0)`}>
          <Anim cls="pa-wing" origin="0% 100%" delay={side > 0 ? 0.25 : 0}>
            <g transform="translate(200 0) scale(-1 1)">
              <path d={arm} stroke={LINE} strokeWidth={12} fill="none" strokeLinecap="round" />
              <path d={arm} stroke={SHELL} strokeWidth={7} fill="none" strokeLinecap="round" />
              <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${size})`}>
                <path d={PINCER} fill={claw.fill} stroke={LINE} strokeWidth={3 / size} strokeLinejoin="round" />
                <ellipse cx={-6} cy={-2} rx={4.5} ry={3} fill="#fff" opacity={0.45} transform="rotate(-50 -6 -2)" />
              </g>
            </g>
          </Anim>
        </g>
      ))}

      {/* Shell (spiky for Kingclaw), belly, face and crown */}
      <g className="pa-breathe">
        {stage >= 2 && [-1, 1].map((side) => (
          <path key={side} transform={`translate(100 0) scale(${side} 1) translate(-100 0)`}
            d="M56 134 L46 130 L27 117 L48 114 L35 95 L57 105 L52 83 L69 100 L70 120 Z" fill={claw.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        ))}
        <path d={SHELL_PATH} fill={body.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={100} cy={151} rx={33} ry={15} fill={belly.fill} stroke={lighten(LINE, 0.25)} strokeWidth={2} />
        {[[58, 130, 5], [67, 146, 3.5], [142, 130, 5], [133, 146, 3.5]].map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={lighten(SHELL, 0.35)} opacity={0.8} />
        ))}
        <Shine x={63} y={113} rx={8} ry={4.5} rot={-40} />
        <CuteFace x={100} y={95} s={0.9} gap={20} mood={mood} blinkDelay={0.4} />
        {stage >= 2 && <Crown x={100} y={81} />}
      </g>

      {/* Little sea bubbles once grown */}
      {stage >= 1 && [[134, 62, 5.5], [144, 46, 4], [132, 32, 3]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
          <circle cx={x} cy={y} r={r} fill="#dff4ff" stroke="#8fcdf2" strokeWidth={2} />
        </Anim>
      ))}
    </g>
  )
}
