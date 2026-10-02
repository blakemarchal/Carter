// Nova → Novastar → Cosmira: a legendary lilac cosmic cat sitting and facing you, a star on her forehead.
// Stage 1 grows tufted ears, cheek fluff and a star on her tail; stage 2 wears a crown with stars twinkling around her.
import { type BodyProps, Anim, Crown, CuteFace, Shine, starPath, twinklePath, useShade } from '../kit'

const LILAC = '#cdaeff'
const BELLY = '#efe4ff'
const EAR_IN = '#ffb8dc'
const LINE = '#9a78d6'
const STAR = '#fff3a6'
const STAR_LINE = '#e3b23c'

/** A cat ear standing on (0,0), height h; leaning comes from the caller's rotate. */
const earPath = (h: number) => `M-16 6 C-14 -${h * 0.4} -8 -${h * 0.8} -2 -${h} Q0 -${h + 2} 2 -${h} C8 -${h * 0.8} 14 -${h * 0.4} 16 6 Z`
const earInner = (h: number) => `M-8 2 C-7 -${h * 0.35} -4 -${h * 0.62} 0 -${h * 0.74} C4 -${h * 0.62} 7 -${h * 0.35} 8 2 Z`

export default function Cat({ stage, mood }: BodyProps) {
  const fur = useShade(LILAC, 0.45, 0.15)
  const belly = useShade(BELLY, 0.5, 0.06)
  const grown = stage >= 1
  const earH = [30, 38, 40][stage] ?? 40
  return (
    <g>
      <defs>{fur.def}{belly.def}</defs>

      {/* Curly tail, swaying from its middle (a star on its tip once grown) */}
      <Anim cls="pa-tail" origin="0% 60%">
        <path d="M124 176 C158 180 186 158 184 120 C183 98 178 84 168 72 Q160 64 156 72 C164 86 170 102 169 122 C168 146 150 160 126 158 Z"
          fill={fur.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        {grown && <path d={starPath(162, 68, 11)} fill={STAR} stroke={STAR_LINE} strokeWidth={2} strokeLinejoin="round" />}
      </Anim>

      {/* Ears with pink insides (tufted once grown); they twitch */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${100 + side * 25} 64) rotate(${side * 20})`}>
          <Anim cls="pa-ear" origin="50% 100%" delay={side > 0 ? 0.5 : 0}>
            {grown && <path d={`M-3 -${earH - 2} L0 -${earH + 10} L3 -${earH - 2} Z`} fill={fur.fill} stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />}
            <path d={earPath(earH)} fill={fur.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
            <path d={earInner(earH)} fill={EAR_IN} />
          </Anim>
        </g>
      ))}

      {/* Sitting body with a soft chest and starry speckles (breathing) */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={142} rx={38} ry={36} fill={fur.fill} stroke={LINE} strokeWidth={3} />
        <ellipse cx={100} cy={150} rx={22} ry={22} fill={belly.fill} />
        <path d={twinklePath(73, 140, 4)} fill="#fff" opacity={0.9} />
        <path d={twinklePath(127, 150, 3.5)} fill="#fff" opacity={0.9} />
        <circle cx={124} cy={130} r={1.6} fill="#fff" opacity={0.9} />
        <circle cx={78} cy={160} r={1.4} fill="#fff" opacity={0.9} />
      </g>

      {/* Front paws */}
      {[86, 114].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={171} rx={12} ry={8} fill={fur.fill} stroke={LINE} strokeWidth={3} />
          <path d={`M${x - 3.5} 174 v-4 M${x + 3.5} 174 v-4`} stroke={LINE} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}

      {/* Cheek fluff (grown forms) */}
      {grown && [-1, 1].map((side) => (
        <path key={side} transform={`translate(100 0) scale(${side} 1) translate(-100 0)`}
          d="M62 82 L46 90 L58 96 L44 104 L62 108 Z" fill={fur.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      ))}

      {/* Wide round head */}
      <ellipse cx={100} cy={90} rx={44} ry={37} fill={fur.fill} stroke={LINE} strokeWidth={3} />
      <Shine x={78} y={68} rx={11} ry={6} />
      <path d={starPath(100, 65, 9)} fill={STAR} stroke={STAR_LINE} strokeWidth={2} strokeLinejoin="round" />

      {/* Face: eyes, a pink nose above the smile, whiskers */}
      <CuteFace x={100} y={92} s={0.82} gap={16} mood={mood} />
      <path d="M96.5 95 L103.5 95 L100 99 Z" fill="#ff8fbf" stroke="#d9608f" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M70 99 L50 95 M70 104 L50 106 M130 99 L150 95 M130 104 L150 106" stroke={LINE} strokeWidth={2} strokeLinecap="round" />

      {stage >= 2 && (
        <>
          <Crown x={100} y={56} />
          {[[30, 46, 9], [168, 40, 7], [24, 130, 7], [44, 172, 6]].map(([x, y, r], i) => (
            <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.45}s` }} d={starPath(x, y, r)}
              fill={STAR} stroke={STAR_LINE} strokeWidth={1.5} strokeLinejoin="round" />
          ))}
        </>
      )}
    </g>
  )
}
