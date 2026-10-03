// Sprinkles → Swirly → Celebrake: a cupcake with a happy face on its cup and a cherry on its frosting.
// Stage 1 piles the frosting into a tall swirl; stage 2 adds a third swirl, birthday candles and a crown.
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

const CUP = '#ff8cc0'
const LINE = '#e0508f'
const ICING = '#fff0f6'
const ICING_LINE = '#f2a0c4'
const CHERRY = '#ff3b6b'
const SPRINKLES = ['#ff5d9e', '#ffc928', '#7cc6ff', '#5fd39a', '#9b8cff']

/** A frosting layer: a dome with a drippy, scalloped bottom edge. */
function tier(top: number, bottom: number, half: number, n: number) {
  const [l, r, h] = [100 - half, 100 + half, bottom - top]
  let d = `M${pt(l, bottom)} C${pt(l, top + h * 0.2)} ${pt(100 - half * 0.55, top)} ${pt(100, top)} C${pt(100 + half * 0.55, top)} ${pt(r, top + h * 0.2)} ${pt(r, bottom)}`
  const step = (2 * half) / n
  for (let i = 1; i <= n; i++) d += ` A${(step * 0.56).toFixed(1)} ${(step * 0.56).toFixed(1)} 0 0 1 ${pt(r - step * i, bottom)}`
  return d + 'Z'
}

/** Little candy sprinkles: [x, y, angle]. */
const Sprinkles = ({ at }: { at: number[][] }) => (
  <>
    {at.map(([x, y, a], i) => (
      <rect key={i} x={x - 4.5} y={y - 1.8} width={9} height={3.6} rx={1.8} fill={SPRINKLES[i % SPRINKLES.length]} transform={`rotate(${a} ${x} ${y})`} />
    ))}
  </>
)

export default function Cupcake({ stage, mood }: BodyProps) {
  const cup = useShade(CUP, 0.3, 0.15)
  const icing = useShade(ICING, 0.5, 0.06)
  const icing2 = useShade(ICING, 0.5, 0.06)
  const cherry = useShade(CHERRY, 0.35, 0.15)
  const cherryY = stage >= 1 ? 48 : 72

  return (
    <g>
      <defs>{cup.def}{icing.def}{icing2.def}{cherry.def}</defs>

      <g className="pa-breathe">
        {/* Little feet */}
        {[84, 116].map((x) => <ellipse key={x} cx={x} cy={174} rx={12} ry={6.5} fill={cup.fill} stroke={LINE} strokeWidth={3} />)}

        {/* The paper cup, pleated */}
        <path d="M48 116 H152 L140 165 Q138 173 129 173 H71 Q62 173 60 165 Z" fill={cup.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <path d={[1, 2, 5, 6].map((i) => `M${pt(48 + (104 * i) / 7, 120)} L${pt(60 + (80 * i) / 7, 169)}`).join(' ')} stroke={LINE} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />

        {/* Frosting, piled higher as it grows */}
        <path d={tier(78, 118, 58, 7)} fill={icing.fill} stroke={ICING_LINE} strokeWidth={3} strokeLinejoin="round" />
        <Sprinkles at={[[60, 106, 30], [78, 112, -40], [122, 112, 40], [140, 106, -25], [100, 108, 90], ...(stage >= 1 ? [] : [[80, 92, 60], [120, 92, -60], [100, 86, 10]])]} />
        {stage >= 1 && (
          <>
            <path d={tier(stage >= 2 ? 56 : 54, 94, 42, 5)} fill={icing2.fill} stroke={ICING_LINE} strokeWidth={3} strokeLinejoin="round" />
            <path d="M66 76 Q100 62 134 76" stroke={ICING_LINE} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.6} />
            <Sprinkles at={[[74, 84, -30], [126, 84, 30], [100, 82, 90], [86, 65, 70], [114, 65, -20]]} />
          </>
        )}
        {stage >= 2 ? (
          <>
            <path d={tier(30, 66, 27, 4)} fill={icing.fill} stroke={ICING_LINE} strokeWidth={3} strokeLinejoin="round" />
            <path d="M80 48 Q100 38 120 48" stroke={ICING_LINE} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.6} />
            <Sprinkles at={[[90, 50, 40], [110, 52, -40], [100, 40, 0]]} />
            {/* Birthday candles standing in the middle tier of frosting (a dab of icing hides each base),
                with flickering flames. Behind the cake they looked like sticks, not candles. */}
            {[65, 135].map((x, i) => (
              <g key={x}>
                <rect x={x - 5} y={40} width={10} height={30} rx={3} fill={i ? '#5fd39a' : '#7cc6ff'} stroke={ink(i ? '#5fd39a' : '#7cc6ff')} strokeWidth={2.5} />
                <path d={`M${x - 5} 50 L${x + 5} 45 M${x - 5} 61 L${x + 5} 56`} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
                <ellipse cx={x} cy={70.5} rx={5.5} ry={3.5} fill={icing.fill} stroke={ICING_LINE} strokeWidth={2.5} />
                <Anim cls="pa-twinkle" delay={i * 0.4}>
                  <path d={`M${x} 18 Q${x + 9} 30 ${x} 37 Q${x - 9} 30 ${x} 18 Z`} fill="#ffc928" stroke="#ff9b4a" strokeWidth={2} strokeLinejoin="round" />
                  <ellipse cx={x} cy={31} rx={2.5} ry={4} fill="#fff6c2" />
                </Anim>
              </g>
            ))}
          </>
        ) : (
          <>
            {/* A cherry on top */}
            <path d={`M100 ${cherryY - 6} Q102 ${cherryY - 18} 112 ${cherryY - 21}`} stroke="#4f9a4a" strokeWidth={3} fill="none" strokeLinecap="round" />
            <circle cx={100} cy={cherryY} r={9} fill={cherry.fill} stroke={ink(CHERRY)} strokeWidth={2.5} />
            <circle cx={97} cy={cherryY - 3} r={2.5} fill="#fff" opacity={0.75} />
          </>
        )}
        <Shine x={stage >= 2 ? 86 : 70} y={stage >= 2 ? 40 : 90} rx={9} ry={5} />

        <CuteFace x={100} y={136} s={0.85} gap={16} mood={mood} blinkDelay={2.2} />
        {stage >= 2 && <Crown x={100} y={32} />}
      </g>

      {/* Party sparkles once grown */}
      {stage >= 1 && [[30, 128, 8], [172, 132, 7]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.7}>
          <path d={twinklePath(x, y, r)} fill="#ffd34d" />
        </Anim>
      ))}
    </g>
  )
}
