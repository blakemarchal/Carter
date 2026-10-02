// Sunny → Sunbeam → Radiance: a round, glowing sun with a happy face and slowly turning rays.
// Each stage adds more and longer rays; stage 2 wears a jeweled crown with twinkles shining around it.
import { type BodyProps, CuteFace, Shine, pt, twinklePath, useShade } from '../kit'

const CY = 104
// A crown with a deeper outline and gems, so it stands out against the yellow rays.
const CROWN = 'M-16 0 L-16 -14 L-8 -6 L0 -18 L8 -6 L16 -14 L16 0 Z'
const at = (a: number, r: number) => pt(100 + Math.cos(a) * r, CY + Math.sin(a) * r)

/** n rounded rays from radius 38 out to `len`, starting at angle `start` (every other one when `every` is 2). */
function rays(n: number, len: number, w: number, start: number, every = 1) {
  return Array.from({ length: n / every }, (_, i) => {
    const a = start + ((i * every) / n) * Math.PI * 2
    return `M${at(a - w, 38)} Q${at(a - w * 0.45, len * 0.75)} ${at(a, len)} Q${at(a + w * 0.45, len * 0.75)} ${at(a + w, 38)} Z`
  }).join(' ')
}

export default function Sun({ stage, mood }: BodyProps) {
  const grumpy = mood === 'grumpy'
  const body = useShade(grumpy ? '#ffc23a' : '#ffd84a', 0.5, 0.12)
  const longRay = useShade('#ffa62b', 0.35, 0.12)
  const shortRay = useShade('#ffc93a', 0.4, 0.1)
  const gold = useShade('#ffe066', 0.5, 0.15)
  const s = Math.min(stage, 2)
  const n = [8, 12, 16][s]
  const start = -Math.PI / 2 + Math.PI / n // no ray straight up, so the crown fits
  return (
    <g>
      <defs>{body.def}{longRay.def}{shortRay.def}{gold.def}</defs>

      {/* Rays, slowly turning: long and short ones taking turns once grown */}
      <g className="pa-spin">
        {s === 0 ? (
          <path d={rays(8, 70, 0.26, start)} fill={longRay.fill} stroke="#ee8a1c" strokeWidth={3} strokeLinejoin="round" />
        ) : (
          <>
            <path d={rays(n, s >= 2 ? 70 : 64, 0.15, start + Math.PI / n * 2, 2)} fill={shortRay.fill} stroke="#ee9a1c" strokeWidth={3} strokeLinejoin="round" />
            <path d={rays(n, s >= 2 ? 86 : 78, 0.18, start, 2)} fill={longRay.fill} stroke="#ee8a1c" strokeWidth={3} strokeLinejoin="round" />
          </>
        )}
      </g>

      {/* Soft glow, then the round sun */}
      <circle cx={100} cy={CY} r={50} fill="#fff4b8" opacity={0.7} />
      <circle cx={100} cy={CY} r={44} fill={body.fill} stroke="#f0a020" strokeWidth={3} />
      <Shine x={80} y={CY - 24} rx={12} ry={7} />
      <CuteFace x={100} y={CY + 2} s={0.95} gap={15} mood={mood} />

      {s >= 2 && (
        <>
          <g transform={`translate(100 ${CY - 40})`}>
            <path d={CROWN} fill={gold.fill} stroke="#c07a00" strokeWidth={2.5} strokeLinejoin="round" />
            <circle cx={0} cy={-6} r={3} fill="#ff6fa8" stroke="#c94a80" strokeWidth={1} />
            <circle cx={-9.5} cy={-4} r={2} fill="#5fb7ff" />
            <circle cx={9.5} cy={-4} r={2} fill="#5fb7ff" />
          </g>
          {[[26, 28, 11], [174, 28, 11], [22, 178, 8], [178, 178, 8]].map(([x, y, r], i) => (
            <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.45}s` }} d={twinklePath(x, y, r)}
              fill="#fff6b0" stroke="#f0a020" strokeWidth={2} strokeLinejoin="round" />
          ))}
        </>
      )}
    </g>
  )
}
