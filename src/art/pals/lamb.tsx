// Starling → Woolly → Shepherdee: a fluffy lamb facing you, with a little Christmas star on its woolly tummy.
// Stage 1 grows a much bigger, puffier fleece and topknot; stage 2 wears a pink scarf and a crown.
import { type BodyProps, Anim, Crown, CuteFace, pt, Shine, starPath, twinklePath, useShade } from '../kit'

const WOOL = '#fff7fa'
const LINE = '#e3b3c8' // soft pink outline for white wool
const FACE = '#ffe0ea'
const EAR = '#ffd0df'
const HOOF = '#8a6a7c'
const SCARF = '#ff5d9e'
const GOLD = '#ffd34d'

/** A woolly cloud: puffs around an ellipse, as one scalloped outline. */
function fluff(cx: number, cy: number, rx: number, ry: number, n: number) {
  const p = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * (i + 0.5)) / n
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  })
  return `M${pt(p[0][0], p[0][1])}` + p.map(([x, y], i) => {
    const [nx, ny] = p[(i + 1) % n]
    const r = (Math.hypot(nx - x, ny - y) * 0.56).toFixed(1)
    return ` A${r} ${r} 0 0 1 ${pt(nx, ny)}`
  }).join('') + 'Z'
}

export default function Lamb({ stage, mood }: BodyProps) {
  const wool = useShade(WOOL, 0.5, 0.1)
  const face = useShade(FACE, 0.4, 0.08)
  const gold = useShade(GOLD, 0.4, 0.15)
  const scarf = useShade(SCARF, 0.3, 0.15)
  const [rx, ry, n] = stage >= 2 ? [58, 38, 14] : stage >= 1 ? [54, 36, 13] : [44, 30, 11]
  const top = stage >= 1 ? fluff(100, 60, 26, 13, 8) : fluff(100, 64, 19, 10, 7)

  return (
    <g>
      <defs>{wool.def}{face.def}{gold.def}{scarf.def}</defs>

      {/* Little legs with dark hooves */}
      {[86, 114].map((x) => (
        <g key={x}>
          <rect x={x - 8} y={146} width={16} height={32} rx={7} fill={face.fill} stroke={LINE} strokeWidth={3} />
          <path d={`M${x - 8} 169 H${x + 8} V172 Q${x + 8} 178 ${x + 2} 178 H${x - 2} Q${x - 8} 178 ${x - 8} 172 Z`} fill={HOOF} stroke={HOOF} strokeWidth={2} strokeLinejoin="round" />
        </g>
      ))}

      {/* Woolly body with the Christmas star */}
      <g className="pa-breathe">
        <path d={fluff(100, 132, rx, ry, n)} fill={wool.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        {[[100 - rx * 0.62, 126], [100 + rx * 0.62, 126], [100 - rx * 0.42, 152], [100 + rx * 0.42, 152]].map(([x, y]) => (
          <path key={x} d={`M${pt(x - 4, y + 2)} a4.5 4.5 0 1 1 5 4`} stroke={LINE} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        ))}
        <path d={starPath(100, 146, stage >= 1 ? 12 : 10)} fill={gold.fill} stroke="#e0a400" strokeWidth={2.5} strokeLinejoin="round" />
      </g>

      {/* Floppy ears that twitch */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(100 0) scale(${side} 1) translate(-100 0)`}>
          <Anim cls="pa-ear" origin="100% 30%" delay={side < 0 ? 0.3 : 0}>
            <ellipse cx={64} cy={92} rx={17} ry={9} fill={face.fill} stroke={LINE} strokeWidth={3} transform="rotate(22 64 92)" />
            <ellipse cx={63} cy={92} rx={10} ry={4.5} fill={EAR} transform="rotate(22 63 92)" />
          </Anim>
        </g>
      ))}

      {/* Head, woolly topknot and face */}
      <ellipse cx={100} cy={89} rx={30} ry={27} fill={face.fill} stroke={LINE} strokeWidth={3} />
      <path d={top} fill={wool.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <Shine x={84} y={stage >= 1 ? 54 : 59} rx={7} ry={4} />
      <CuteFace x={100} y={93} s={0.78} gap={15} mood={mood} blinkDelay={0.8} />

      {/* Shepherdee's scarf, its loose end fluttering */}
      {stage >= 2 && (
        <>
          <Anim cls="pa-tail" origin="30% 0%">
            <path d="M118 117 L144 148 L132 157 L108 124 Z" fill={scarf.fill} stroke="#d63c7c" strokeWidth={2.5} strokeLinejoin="round" />
            <path d="M123 131 L132 124 M130 141 L139 134" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
          </Anim>
          <path d="M68 110 Q100 128 132 110 L135 121 Q100 142 65 121 Z" fill={scarf.fill} stroke="#d63c7c" strokeWidth={2.5} strokeLinejoin="round" />
          <Crown x={100} y={47} />
          {[[30, 60, 9], [172, 70, 8], [160, 34, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
