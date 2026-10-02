// Chilly → Frosty → Snowglow: a round little snow buddy facing you, with a carrot nose, a scarf and a snowflake clip.
// Stage 1 waves twig arms; stage 2 wears mittens and a crown while snowflakes fall all around.
// Grumpy: icy blue-grey.
import { type BodyProps, Anim, Crown, CuteFace, ink, Shine, Snowflake, useShade } from '../kit'

export default function Snow({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const SNOW = g ? '#c3d3e6' : '#f6fbff'
  const LINE = g ? '#8199b8' : '#a9c4e0'
  const SCARF = g ? '#8796ae' : '#ff7eb6'
  const SCARF_LINE = g ? '#64738a' : '#e0508f'
  const FLAKE = g ? '#7f97b6' : '#7cc6ff'
  const CARROT = g ? '#d6976a' : '#ff9b4a'
  const snow = useShade(SNOW, 0.5, 0.1)
  const scarf = useShade(SCARF, 0.3, 0.12)
  const carrot = useShade(CARROT, 0.3, 0.15)
  const flakes = [[162, 64, 7], ...(stage >= 1 ? [[36, 46, 6]] : []), ...(stage >= 2 ? [[24, 156, 6], [178, 158, 6], [146, 26, 5]] : [])]

  return (
    <g>
      <defs>{snow.def}{scarf.def}{carrot.def}</defs>

      {/* Twig arms (mittens once grown), waving: drawn as the right arm, mirrored for the left, so both wave up */}
      {stage >= 1 && [-1, 1].map((side) => (
        <g key={side} transform={`translate(100 0) scale(${side} 1) translate(-100 0)`}>
          <Anim cls="pa-wing" origin="0% 100%" delay={side > 0 ? 0.3 : 0}>
            <g transform="translate(200 0) scale(-1 1)">
              <path d="M66 138 L30 112 M44 122 L38 104 M38 118 L24 120" stroke="#6e4a30" strokeWidth={8} fill="none" strokeLinecap="round" />
              <path d="M66 138 L30 112 M44 122 L38 104 M38 118 L24 120" stroke="#a87650" strokeWidth={4} fill="none" strokeLinecap="round" />
              {stage >= 2 && (
                <>
                  <ellipse cx={19} cy={107} rx={5} ry={7} fill={scarf.fill} stroke={SCARF_LINE} strokeWidth={2.5} transform="rotate(-30 19 107)" />
                  <circle cx={29} cy={110} r={11} fill={scarf.fill} stroke={SCARF_LINE} strokeWidth={2.5} />
                </>
              )}
            </g>
          </Anim>
        </g>
      ))}

      {/* Snowy body and little snow feet */}
      <g className="pa-breathe">
        {[82, 118].map((x) => <ellipse key={x} cx={x} cy={172} rx={14} ry={8} fill={snow.fill} stroke={LINE} strokeWidth={3} />)}
        <ellipse cx={100} cy={146} rx={41} ry={31} fill={snow.fill} stroke={LINE} strokeWidth={3} />
        {[146, 160].map((y) => <circle key={y} cx={100} cy={y} r={4} fill="#4f5d75" />)}
      </g>

      {/* Head */}
      <circle cx={100} cy={88} r={35} fill={snow.fill} stroke={LINE} strokeWidth={3} />
      <Shine x={84} y={66} rx={10} ry={6} />

      {/* Scarf: a band round the neck, its end swinging */}
      <Anim cls="pa-tail" origin="50% 0%">
        <path d="M74 118 L64 156 L80 160 L88 124 Z" fill={scarf.fill} stroke={SCARF_LINE} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M70 136 L84 139 M67 147 L81 150" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.75} />
      </Anim>
      <path d="M66 112 Q100 130 134 112 L136 123 Q100 143 64 123 Z" fill={scarf.fill} stroke={SCARF_LINE} strokeWidth={2.5} strokeLinejoin="round" />

      {/* Face: eyes, carrot nose, smile */}
      <CuteFace x={100} y={86} s={0.85} gap={15} mood={mood} mouth={false} blinkDelay={1.6} />
      <path d="M95 96 Q100 92 104 95 L116 100 Q107 103 97 100 Q94 98 95 96 Z" fill={carrot.fill} stroke={ink(CARROT)} strokeWidth={2} strokeLinejoin="round" />
      {g
        ? <path d="M94 109 Q100 104 106 109" stroke="#2b2140" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        : <path d="M94 105 Q100 112 106 105 Q100 107.5 94 105 Z" fill="#6b2a3a" stroke="#2b2140" strokeWidth={1.8} strokeLinejoin="round" />}

      {/* Snowflake hair clip (bigger once grown) */}
      <g transform={`translate(125 ${stage >= 1 ? 58 : 60}) scale(${stage >= 1 ? 1.4 : 1})`}>
        <Snowflake x={0} y={0} r={8} color={FLAKE} />
      </g>

      {stage >= 2 && <Crown x={96} y={56} />}

      {/* Falling snowflakes */}
      {flakes.map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.45}>
          <Snowflake x={x} y={y} r={r} color={FLAKE} />
        </Anim>
      ))}
    </g>
  )
}
