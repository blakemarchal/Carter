// Dash → Longstride → Kindstride: a big, fluffy, friendly ostrich, round and cute, turned a little toward our left
// with its face toward you. A round, fluffy dark body with soft white wing plumes hanging at its sides, a round,
// fluffy white tail puff peeking out at its back (our right), a long pink neck curving up to a small round head with
// big friendly eyes (with ostrich eyelashes), a short, rounded peach beak and a little dark tuft of fluff on top.
// Two long pink legs (with knobbly knees that bend back a little) come down from under its body to two-toed feet (a
// big toe and a little one), flat on the ground.
// Longstride has a calmer, kinder face (its eyes smile), fuller plumes and tuft, and carries a little satchel of
// bandages slung across its body: a strap over its shoulder to a canvas bag at its hip, with a pink heart on the
// flap and a rolled bandage peeking out. Kindstride's plumes and tuft are fullest; it glows softly gold and wears a
// crown, with sparkles round it.
// Grumpy: a dull grey-brown, its feathers ruffled every which way (its body bumpy, its plumes, tail and tuft
// sticking out), cross brows and a frowning beak, and one foot lifted mid-stamp as if it's in a hurry, with a
// little puff of dust under it.
import { useId, type CSSProperties } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]

/** A smooth tapering tube along the curve a → (b) → c, width w0 at a down to w1 at c, with round ends. */
function tube(a: Pt, b: Pt, c: Pt, w0: number, w1: number, n = 16) {
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t
    const x = u * u * a[0] + 2 * u * t * b[0] + t * t * c[0]
    const y = u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]
    const dx = u * (b[0] - a[0]) + t * (c[0] - b[0]), dy = u * (b[1] - a[1]) + t * (c[1] - b[1])
    const len = Math.hypot(dx, dy) || 1, h = (w0 + (w1 - w0) * t) / 2
    L.push([x - (dy / len) * h, y + (dx / len) * h])
    R.unshift([x + (dy / len) * h, y - (dx / len) * h])
  }
  const sm = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return `M${pt(...L[0])} ${sm(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${sm(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}

/**
 * A soft, fluffy outline round the ellipse (cx, cy, rx, ry): n scallops, each bulging out by `bump`. Ruffled, every
 * other scallop sticks out further in a soft point, swept to one side, like feathers fluffed up the wrong way.
 */
function fluffy(cx: number, cy: number, rx: number, ry: number, n: number, bump: number, ruffled = false) {
  const ps: Pt[] = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]
  })
  return `M${pt(...ps[0])}` + ps.map((p, i) => {
    const q = ps[(i + 1) % n]
    const m: Pt = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1
    let [nx, ny] = [(q[1] - p[1]) / len, -(q[0] - p[0]) / len]
    if ((m[0] - cx) * nx + (m[1] - cy) * ny < 0) [nx, ny] = [-nx, -ny]
    const out = ruffled && i % 2 ? bump * 3.2 : bump * 2
    const sweep = ruffled && i % 2 ? len * 0.3 : 0
    return ` Q${pt(m[0] + nx * out + ny * sweep, m[1] + ny * out - nx * sweep)} ${pt(...q)}`
  }).join('') + 'Z'
}

/** A fluffy plume from its root at (0, 0) out to its tip at (l, 0), w wide. */
const plume = (l: number, w: number) => fluffy(l / 2, 0, l / 2, w / 2, 7, Math.min(2.2, w / 6))

/** A soft feather from its root at (0, 0) out to its rounded tip at (l, 0), w wide. */
const feather = (l: number, w: number) =>
  `M0 ${-w * 0.3} C${l * 0.4} ${-w * 0.55} ${l * 0.8} ${-w * 0.55} ${l} ${-w * 0.2} Q${l + 2.5} 0 ${l} ${w * 0.2} C${l * 0.8} ${w * 0.55} ${l * 0.4} ${w * 0.55} 0 ${w * 0.3} Z`

/** An ellipse's outline as polygon points. The glow is drawn as a polygon, so the coloring page (which turns every
 *  path, circle, ellipse and rect into a white shape to fill in) leaves it as it is. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A little heart centred on (0, 0), about 3r across. */
const heart = (r: number) =>
  `M${pt(0, r * 1.5)} C${pt(-r * 2.2, r * 0.2)} ${pt(-r * 1.4, -r * 1.6)} ${pt(0, -r * 0.5)} C${pt(r * 1.4, -r * 1.6)} ${pt(r * 2.2, r * 0.2)} ${pt(0, r * 1.5)}Z`

// Its small round head (a little wider than tall), and the face on it
const HEAD = { x: 100, y: 40, rx: 22.5, ry: 20.5 }
const FACE_Y = 40
const FACE_S = 0.72
const GAP = 12.5
const BLINK = 0.7
// The big round body, turned a little to our left (so it sits a little right of its face)
const BX = 108, BY = 115, BRX = 52, BRY = 31
const MIRROR = `translate(${2 * BX} 0) scale(-1 1)`
// The long neck, curving gently from under its head down into the top of its body
const NECK: [Pt, Pt, Pt] = [[100, 52], [85, 72], [96, 100]]
// Its left wing (the right one is its mirror image): soft plumes hanging down from its shoulder, at its side.
// [angle, length, width] from the root; more and longer plumes as it grows.
const WING_ROOT: Pt = [76, 103]
const WINGS: [number, number, number][][] = [
  [[98, 34, 14], [115, 38, 15], [132, 32, 13]],
  [[96, 36, 14], [112, 41, 16], [128, 38, 15], [144, 30, 12]],
  [[94, 38, 15], [110, 44, 17], [126, 41, 16], [142, 33, 13]],
]
// Grumpy, its plumes stick out every which way
const WING_RUFFLED: [number, number, number][] = [[84, 32, 13], [108, 38, 14], [134, 34, 13], [162, 27, 11]]
// The round, fluffy tail puff at its back (our right), peeking out from behind its body and tilted up a little:
// [x, y, rx, ry] for each stage, a little bigger as it grows
const TAILS: [number, number, number, number][] = [[161, 92, 14, 11.5], [162, 90, 15.5, 12.5], [163, 88, 17, 13.5]]
// Its little tuft of dark fluff on top of its head: [root x, root y, angle, length, width]
const TUFTS: [number, number, number, number, number][][] = [
  [[98, 22, -104, 11, 7], [104, 22, -70, 12, 7]],
  [[95, 23, -120, 11, 7], [100, 21, -90, 14, 8], [106, 22, -60, 12, 7]],
  [[94, 23, -124, 12, 7], [100, 21, -94, 15, 8], [106, 22, -64, 14, 8], [111, 25, -36, 10, 6]],
]
const TUFT_RUFFLED: [number, number, number, number, number][] = [[92, 25, -150, 11, 6], [96, 21, -112, 13, 7], [103, 21, -80, 14, 7], [108, 23, -46, 12, 6], [112, 28, -14, 9, 5]]
// Its legs, the left one and the right one: [x at the top, x at the foot]
const LEGS: [number, number][] = [[97, 95], [121, 120]]
const GROUND = 182

export default function Ostrich({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '')
  const glowId = `og${ids}`
  const bodyClip = `ob${ids}`
  const BODY = g ? '#77707a' : '#4f4150'
  const PLUME = g ? '#d9d5da' : '#fffaf4'
  const PLUME_LINE = g ? '#9a929c' : '#c4ae9e'
  const SKIN = g ? '#d9c6c0' : '#f7cdbd'
  const LEG = g ? '#cdb4ab' : '#f0b19c'
  const BEAK = g ? '#d8b49c' : '#ffb27a'
  const TUFT = g ? '#8b848d' : '#5d4c5c'
  const STRAP = g ? '#b49a83' : '#c98d55'
  const BAG = g ? '#d9d0c4' : '#f5e3c0'
  const HEART = g ? '#c9a3ad' : '#ff6f9c'
  const DUST = '#c9bfb4'
  const NAIL = g ? '#b3a29b' : '#d98f80'
  const GLOW = '#ffe3a3'
  const body = useShade(BODY, 0.3, 0.2)
  const plumeS = useShade(PLUME, 0.6, 0.1)
  const skin = useShade(SKIN, 0.4, 0.12)
  const leg = useShade(LEG, 0.35, 0.14)
  const beak = useShade(BEAK, 0.45, 0.12)
  const tuft = useShade(TUFT, 0.3, 0.15)
  const bag = useShade(BAG, 0.5, 0.12)
  const helper = st >= 1
  const glowing = st >= 2 && !g
  const wings = g ? WING_RUFFLED : WINGS[st]
  const [tx, ty, trx, try_] = TAILS[st]
  const tufts = g ? TUFT_RUFFLED : TUFTS[st]
  const outline = fluffy(BX, BY, BRX, BRY, 18, 2.6, g)
  const line = ink(BODY)

  /** A two-toed foot flat on the ground at (x, y): a big toe pointing forward and out to our left, and a little
   *  one splayed out to our right, each with a toenail. */
  const foot = (x: number, y: number, rot = 0) => (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <ellipse cx={x + 5.5} cy={y - 3.8} rx={5.4} ry={3.6} transform={`rotate(14 ${x + 5.5} ${y - 3.8})`} fill={leg.fill} stroke={ink(LEG)} strokeWidth={2} />
      <ellipse cx={x - 5.5} cy={y - 4.4} rx={8} ry={4.4} transform={`rotate(-8 ${x - 5.5} ${y - 4.4})`} fill={leg.fill} stroke={ink(LEG)} strokeWidth={2} />
      <ellipse cx={x - 11.6} cy={y - 3.6} rx={2.4} ry={2} fill={NAIL} />
      <ellipse cx={x + 9.4} cy={y - 2.6} rx={1.9} ry={1.6} fill={NAIL} />
    </g>
  )

  return (
    <g>
      <defs>
        {body.def}{plumeS.def}{skin.def}{leg.def}{beak.def}{tuft.def}{bag.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
        {/* (the satchel's strap goes over its shoulder: it stops at the edge of its body) */}
        <clipPath id={bodyClip}><path d={outline} /></clipPath>
      </defs>

      {/* Kindstride's soft glow all round it */}
      {glowing && <polygon points={ring(106, 102, 94, 88)} fill={`url(#${glowId})`} />}

      {/* The round, fluffy tail puff at its back (behind its body), wagging a little; ruffled up when grumpy */}
      <Anim cls="pa-tail" origin="0% 100%" delay={0.4}>
        <g transform={`rotate(-28 ${tx} ${ty})`}>
          <path d={fluffy(tx, ty, trx, try_, 11, 2.3, g)} fill={plumeS.fill} stroke={PLUME_LINE} strokeWidth={2.2} strokeLinejoin="round" />
          <polyline points={`${tx - trx * 0.45} ${ty + 2} ${tx - trx * 0.1} ${ty - 1.5} ${tx + trx * 0.3} ${ty + 0.5}`} fill="none" stroke={PLUME_LINE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
          <polyline points={`${tx - trx * 0.2} ${ty + try_ * 0.5} ${tx + trx * 0.25} ${ty + try_ * 0.25} ${tx + trx * 0.55} ${ty + try_ * 0.45}`} fill="none" stroke={PLUME_LINE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
        </g>
      </Anim>

      {/* Two long legs from under its body, with two-toed feet flat on the ground. Grumpy, it lifts its left foot
          to stamp it, in a hurry: a little puff of dust where it stamped, and stamp lines by the foot. */}
      {g && (
        <g>
          {[[84, 179.4, 3.6], [92, 177.8, 4.6], [101, 179.6, 3.4]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill={DUST} opacity={0.75} />)}
          <polyline points="81 158 78.6 163 81 168" fill="none" stroke="#a49ca6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="76 156 72.6 163 76 170" fill="none" stroke="#a49ca6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {LEGS.map(([x0, x1], i) => {
        const stamping = g && i === 0
        const footY = stamping ? GROUND - 14 : GROUND
        // (the leg bows back a little at its joint, like a real ostrich's)
        const knee: Pt = [x0 + 5, stamping ? 150 : 158]
        return (
          <g key={x0}>
            {/* (its knobbly knee: a bump at the back of the joint) */}
            <ellipse cx={knee[0] + 3.2} cy={knee[1]} rx={4.6} ry={4.2} fill={leg.fill} stroke={ink(LEG)} strokeWidth={2} />
            <path d={tube([x0, 132], [knee[0] + 4, knee[1]], [x1, footY - 4], 12.5, 8)}
              fill={leg.fill} stroke={ink(LEG)} strokeWidth={2.2} strokeLinejoin="round" />
            {foot(x1, footY, stamping ? -12 : 0)}
          </g>
        )
      })}

      {/* The long neck, curving up to its head (behind its body, so it grows out of it) */}
      <path d={tube(...NECK, 17.5, 24)} fill={skin.fill} stroke={ink(SKIN)} strokeWidth={2.4} strokeLinejoin="round" />

      {/* The big, round, fluffy body (ruffled up when grumpy) */}
      <g className="pa-breathe">
        <path d={outline} fill={body.fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
        {/* soft feathery marks */}
        {[[96, 121], [120, 125], [108, 134], [132, 113], [85, 132]].map(([x, y]) => (
          <polyline key={`${x}${y}`} points={`${x - 5} ${y - 1.5} ${x} ${y + 1.5} ${x + 5} ${y - 1.5}`} fill="none" stroke={g ? '#948d96' : '#6f5d72'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <Shine x={122} y={97} rx={9} ry={4.2} rot={14} />

        {/* Longstride's satchel strap, over its shoulder and across its body */}
        {helper && (
          <g clipPath={`url(#${bodyClip})`}>
            <path d={tube([76, 79], [104, 110], [136, 128], 5.5, 5.5)} fill={STRAP} stroke={ink(STRAP)} strokeWidth={1.8} strokeLinejoin="round" />
          </g>
        )}
      </g>

      {/* Soft white wing plumes hanging at its sides, from its shoulders, flapping a little */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="90% 10%" delay={side > 0 ? 0.25 : 0}>
            {wings.map(([a, l, w]) => (
              <g key={a} transform={`translate(${pt(...WING_ROOT)}) rotate(${a})`}>
                <path d={plume(l, w)} fill={plumeS.fill} stroke={PLUME_LINE} strokeWidth={2.2} strokeLinejoin="round" />
                <polyline points={`4 0 ${l - 6} 0`} fill="none" stroke={PLUME_LINE} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
              </g>
            ))}
          </Anim>
        </g>
      ))}

      {/* Longstride's satchel of bandages at its hip, with a heart on the flap and a rolled bandage peeking out */}
      {helper && (
        <g transform="translate(139 134) rotate(-8)">
          <g transform="rotate(-24 -6 -9)">
            <rect x={-11} y={-15} width={11} height={8} rx={3} fill="#fffdf8" stroke="#c9b9a6" strokeWidth={1.6} />
            <polyline points="-6 -15 -6 -7" fill="none" stroke="#ff9db8" strokeWidth={1.6} />
          </g>
          <path d="M-14 -8 H14 Q15.5 -8 15.5 -6 V7 Q15.5 11 11.5 11 H-11.5 Q-15.5 11 -15.5 7 V-6 Q-15.5 -8 -14 -8 Z" fill={bag.fill} stroke={ink(BAG)} strokeWidth={2} strokeLinejoin="round" />
          <path d="M-15.5 -6 Q-15.5 -9 -12.5 -9 H12.5 Q15.5 -9 15.5 -6 V0 Q0 5 -15.5 0 Z" fill={bag.fill} stroke={ink(BAG)} strokeWidth={2} strokeLinejoin="round" />
          <path d={heart(2.6)} transform="translate(0 -3.4)" fill={HEART} stroke={ink(HEART)} strokeWidth={1.2} strokeLinejoin="round" />
        </g>
      )}

      {/* Its little tuft of dark fluff (behind its head, so it grows out of it), twitching */}
      <Anim cls="pa-ear" origin="50% 100%" delay={0.9}>
        {tufts.map(([x, y, a, l, w]) => (
          <path key={`${x}${a}`} d={feather(l, w)} transform={`translate(${x} ${y}) rotate(${a})`} fill={tuft.fill} stroke={ink(TUFT)} strokeWidth={1.8} strokeLinejoin="round" />
        ))}
      </Anim>

      {/* Its small round head */}
      <ellipse cx={HEAD.x} cy={HEAD.y} rx={HEAD.rx} ry={HEAD.ry} fill={skin.fill} stroke={ink(SKIN)} strokeWidth={2.6} />
      <Shine x={90} y={27} rx={6.5} ry={3.6} />
      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={GAP} mood={mood} mouth={false} blinkDelay={BLINK} />
      <Lashes smiling={st >= 1 && !g} grumpy={g} lid={SKIN} />

      {/* Its short, rounded beak: smiling (frowning when grumpy) */}
      <g transform={`translate(100 ${FACE_Y + 6.6}) scale(0.86)`}>
        <path d="M-10.5 5 C-11 1 -6 -1 0 -1 C6 -1 11 1 10.5 5 Q10 8 6.5 8.2 Q0 10.2 -6.5 8.2 Q-10 8 -10.5 5 Z" fill={beak.fill} stroke={ink(BEAK)} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M-8 8.4 Q0 10.8 8 8.4 Q6.6 12.8 0 13 Q-6.6 12.8 -8 8.4 Z" fill={beak.fill} stroke={ink(BEAK)} strokeWidth={1.8} strokeLinejoin="round" />
        <polyline points={g ? '-9 9.4 -5 8 0 7.6 5 8 9 9.4' : '-9.5 7.2 -5 8.8 0 9.4 5 8.8 9.5 7.2'} fill="none" stroke={ink(BEAK)} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={-4.5} cy={1.8} rx={3.2} ry={1.4} fill="#fff" opacity={0.6} transform="rotate(-8 -4.5 1.8)" />
      </g>

      {st >= 2 && (
        <>
          <g transform="translate(100 24) scale(0.8)"><Crown x={0} y={0} /></g>
          {glowing && [[30, 46, 7], [176, 40, 6], [180, 150, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}

/**
 * Drawn over CuteFace's eyes: ostrich eyelashes at the outer corner of each eye and (once it's grown: Longstride,
 * Kindstride) smiling eyes, its cheeks lifting the bottom of each eye, for a calmer, kinder face. Each eye's group
 * has an invisible box round it with the eye in the middle, so it squashes about the eye's middle as it blinks.
 */
function Lashes({ smiling, grumpy, lid }: { smiling: boolean; grumpy: boolean; lid: string }) {
  const ry = grumpy ? 5.5 : 9.5
  const LASH = '#2b2140'
  return (
    <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
      {[-1, 1].map((side) => (
        <g key={side} className="pa-blink" style={{ '--d': `${BLINK}s` } as CSSProperties}>
          <polygon points={`${side * GAP - 15} -15 ${side * GAP + 15} -15 ${side * GAP + 15} 15 ${side * GAP - 15} 15`} fill="none" />
          {/* (drawn for the left eye; the right eye's are its mirror image) */}
          <g transform={side > 0 ? 'scale(-1 1)' : undefined}>
            {smiling && <path d={`M${-GAP - 7.35} 5.5 Q${-GAP} 1.5 ${-GAP + 7.35} 5.5 A8.6 10.6 0 0 1 ${-GAP - 7.35} 5.5 Z`} fill={lid} />}
            <polyline points={`${-GAP - 6.4} ${-ry * 0.5} ${-GAP - 10.6} ${-ry * 0.5 - 3}`} fill="none" stroke={LASH} strokeWidth={2.2} strokeLinecap="round" />
            {!grumpy && <polyline points={`${-GAP - 3.8} ${-ry * 0.86} ${-GAP - 6.6} ${-ry * 0.86 - 3.8}`} fill="none" stroke={LASH} strokeWidth={2.2} strokeLinecap="round" />}
          </g>
        </g>
      ))}
    </g>
  )
}
