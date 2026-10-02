// Zippy → Sparkle → Thunderjoy: a chubby yellow electric mouse facing you, with a lightning-bolt tail.
// Stage 1 grows taller ears, a lightning-bolt cowlick and a bigger bolt tail; stage 2 wears a jeweled crown
// and crackles with sparks.
import { type BodyProps, Anim, CuteFace, Shine, twinklePath, useShade } from '../kit'

const YELLOW = '#ffd43b'
const BELLY = '#fff4c8'
const BOLT = '#ffc21a'
const TIP = '#6a4128'
const CHEEK = '#ff7b5c'
const LINE = '#d99a1f'

const f = (n: number) => +n.toFixed(1)

/** A pointed ear standing on (0,0): the ear, its pink inside, and its dark tip (cut from the same curve). */
function earPaths(l: number, w: number) {
  const k = 0.62 // how high the sides bulge
  const t = 0.6 // where the dark tip starts along each side
  const bx = f(-w * (1 - t * t))
  const by = f(-l * (2 * k * t - 2 * k * t * t + t * t))
  const cx = f(-w * (1 - t))
  const cy = f(-k * l * (1 - t) - l * t)
  return {
    ear: `M${-w} 0 Q${-w} ${f(-k * l)} 0 ${-l} Q${w} ${f(-k * l)} ${w} 0 Z`,
    inner: `M${f(-w * 0.5)} -4 Q${f(-w * 0.55)} ${f(-l * 0.5)} 0 ${f(by + 4)} Q${f(w * 0.55)} ${f(-l * 0.5)} ${f(w * 0.5)} -4 Z`,
    tip: `M${bx} ${by} Q${cx} ${cy} 0 ${-l} Q${-cx} ${cy} ${-bx} ${by} Q0 ${f(by + 5)} ${bx} ${by} Z`,
  }
}

// A crown with a deeper outline and gems, so it stands out on yellow fur.
const CROWN = 'M-16 0 L-16 -14 L-8 -6 L0 -18 L8 -6 L16 -14 L16 0 Z'

const MIRROR = 'translate(200 0) scale(-1 1)'

// A zigzag bolt, root (6, 92) at the bottom, tip at the top.
const BOLT_PATH = 'M34 0 L4 34 L22 34 L2 62 L20 62 L6 92 L48 50 L30 50 L52 22 L34 22 Z'

export default function Mouse({ stage, mood }: BodyProps) {
  const fur = useShade(YELLOW, 0.45, 0.14)
  const belly = useShade(BELLY, 0.5, 0.06)
  const bolt = useShade(BOLT, 0.5, 0.14)
  const gold = useShade('#ffd34d', 0.5, 0.15)
  const e = earPaths([44, 53, 58][stage] ?? 58, [15, 16, 17][stage] ?? 17)
  const tail = [0.62, 0.8, 0.93][stage] ?? 0.93
  return (
    <g>
      <defs>{fur.def}{belly.def}{bolt.def}{gold.def}</defs>

      {/* Lightning-bolt tail, wagging from its root behind the body (mirrored twice so it sways inward) */}
      <g transform={MIRROR}>
        <Anim cls="pa-tail" origin="100% 100%">
          <path d={BOLT_PATH} transform={`${MIRROR} translate(128 152) rotate(10) scale(${tail}) translate(-6 -92)`}
            fill={bolt.fill} stroke={LINE} strokeWidth={3 / tail} strokeLinejoin="round" />
        </Anim>
      </g>

      {/* Big pointed ears with dark tips; they twitch */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${100 + side * 22} 70) rotate(${side * 32})`}>
          <Anim cls="pa-ear" origin="50% 100%" delay={side > 0 ? 0.4 : 0}>
            <path d={e.ear} fill={fur.fill} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
            <path d={e.inner} fill="#ffb3c4" opacity={0.75} />
            <path d={e.tip} fill={TIP} stroke="#4a2c1a" strokeWidth={3} strokeLinejoin="round" />
          </Anim>
        </g>
      ))}

      {/* A lightning-bolt cowlick (grown forms) */}
      {stage >= 1 && (
        <path d={BOLT_PATH} transform={`translate(88 68) rotate(-20) scale(0.42) translate(-27 -92)`}
          fill={fur.fill} stroke={LINE} strokeWidth={3 / 0.42} strokeLinejoin="round" />
      )}

      {/* Body, belly and little paws (gently breathing) */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={138} rx={44} ry={38} fill={fur.fill} stroke={LINE} strokeWidth={3} />
        <ellipse cx={100} cy={148} rx={27} ry={23} fill={belly.fill} />
        <ellipse cx={87} cy={137} rx={8} ry={6.5} fill={fur.fill} stroke={LINE} strokeWidth={3} />
        <ellipse cx={113} cy={137} rx={8} ry={6.5} fill={fur.fill} stroke={LINE} strokeWidth={3} />
      </g>

      {/* Round head */}
      <circle cx={100} cy={90} r={40} fill={fur.fill} stroke={LINE} strokeWidth={3} />
      <Shine x={81} y={66} rx={11} ry={6} />

      {/* Little feet */}
      {[80, 120].map((x) => (
        <ellipse key={x} cx={x} cy={172} rx={13} ry={7.5} fill={fur.fill} stroke={LINE} strokeWidth={3} />
      ))}

      {/* Rosy electric cheeks, face and a tiny nose */}
      {[-1, 1].map((s) => <circle key={s} cx={100 + s * 22} cy={101} r={7} fill={CHEEK} opacity={0.8} />)}
      <CuteFace x={100} y={92} s={0.85} gap={15} mood={mood} />
      <ellipse cx={100} cy={97} rx={2.8} ry={2} fill={TIP} />

      {stage >= 2 && (
        <>
          <g transform="translate(108 54) rotate(10)">
            <path d={CROWN} fill={gold.fill} stroke="#c07a00" strokeWidth={2.5} strokeLinejoin="round" />
            <circle cx={0} cy={-6} r={3} fill="#ff6fa8" stroke="#c94a80" strokeWidth={1} />
            <circle cx={-9.5} cy={-4} r={2} fill="#5fb7ff" />
            <circle cx={9.5} cy={-4} r={2} fill="#5fb7ff" />
          </g>
          {[[24, 84, 10], [28, 150, 8], [172, 170, 9]].map(([x, y, r], i) => (
            <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.5}s` }} d={twinklePath(x, y, r)}
              fill="#fff27a" stroke={LINE} strokeWidth={1.5} strokeLinejoin="round" />
          ))}
        </>
      )}
    </g>
  )
}
