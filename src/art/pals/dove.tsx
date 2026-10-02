// Pip → Olivewing → Peacewing: a chubby dove facing you, with an olive sprig in its beak.
// Stage 1 raises big wings and grows a crest; stage 2 fans long tail plumes and wears a crown.
import { type BodyProps, Anim, Crown, CuteFace, ink, Shine, useShade } from '../kit'

const WHITE = '#f4f8ff'
const WING = '#dde9fb'
const BEAK = '#ffb347'
const LINE = '#a9bddb' // a soft blue-grey outline suits a white bird better than grey

export default function Dove({ stage, mood }: BodyProps) {
  const body = useShade(WHITE, 0.6, 0.12)
  const wing = useShade(WING, 0.4, 0.15)
  const big = stage >= 1
  return (
    <g>
      <defs>{body.def}{wing.def}</defs>

      {/* Tail feathers, fanned behind (longer plumes at stage 2) */}
      <Anim cls="pa-tail" origin="50% 0%">
        {(stage >= 2 ? [-46, -24, 0, 24, 46] : [-22, 0, 22]).map((a) => (
          <ellipse key={a} cx={100} cy={stage >= 2 ? 172 : 170} rx={13} ry={stage >= 2 ? 26 : 18} fill={wing.fill} stroke={LINE} strokeWidth={3}
            transform={`rotate(${a * (stage >= 2 ? 1.6 : 1)} 100 140)`} />
        ))}
      </Anim>

      {/* Wings: tucked at the sides, or raised up high once grown */}
      {[-1, 1].map((side) => (
        <Anim key={side} cls="pa-wing" origin={side < 0 ? '100% 80%' : '0% 80%'} delay={side > 0 ? 0.1 : 0}>
          <g transform={`translate(100 0) scale(${side} 1) translate(-100 0)`}>
            {big ? (
              <path d="M58 118 C30 108 14 78 22 52 C34 62 44 60 52 76 C56 64 64 62 70 74 C74 88 72 108 66 124 Z" fill={wing.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
            ) : (
              <path d="M56 112 C38 116 30 136 38 150 C48 150 58 144 66 132 Z" fill={wing.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
            )}
            {big && <path d="M36 70 C42 80 48 86 58 92 M30 86 C38 94 46 98 56 102" stroke={LINE} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />}
          </g>
        </Anim>
      ))}

      {/* Body and head */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={134} rx={50} ry={44} fill={body.fill} stroke={LINE} strokeWidth={3} />
        <ellipse cx={100} cy={146} rx={28} ry={22} fill="#fff" opacity={0.8} />
        <circle cx={100} cy={82} r={38} fill={body.fill} stroke={LINE} strokeWidth={3} />
        <Shine x={84} y={60} rx={11} ry={6} />
      </g>

      {/* Head crest (bigger once grown) */}
      <path d={big ? 'M92 46 C86 26 96 18 100 14 C102 26 108 30 112 24 C114 36 108 42 106 46 Z' : 'M95 46 C92 36 98 32 101 30 C102 38 106 40 108 37 C108 42 106 45 104 47 Z'}
        fill={body.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />

      <CuteFace x={100} y={80} s={0.82} gap={14} mood={mood} mouth={false} />

      {/* Beak, centered under the eyes, with an olive sprig */}
      <path d="M90 92 Q100 86 110 92 L100 104 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M106 98 C118 104 124 112 126 122" stroke="#5a8f3c" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <ellipse cx={120} cy={106} rx={7} ry={3.5} fill="#7cc46a" stroke="#4f8a3a" strokeWidth={1.5} transform="rotate(35 120 106)" />
      <ellipse cx={127} cy={118} rx={7} ry={3.5} fill="#7cc46a" stroke="#4f8a3a" strokeWidth={1.5} transform="rotate(70 127 118)" />

      {/* Little orange feet */}
      {[86, 114].map((x) => (
        <path key={x} d={`M${x - 8} 178 Q${x} 170 ${x + 8} 178`} stroke={BEAK} strokeWidth={5} fill="none" strokeLinecap="round" />
      ))}

      {stage >= 2 && (
        <>
          <Crown x={100} y={20} />
          {[[40, 40], [160, 46], [150, 150]].map(([x, y]) => (
            <path key={`${x}`} className="pa-twinkle" d={`M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2} Z`} fill="#ffe680" />
          ))}
        </>
      )}
    </g>
  )
}
