// Growly → Purrcy → Gentlemane: a fuzzy little lion cub sitting on all four paws, with a tiny tuft of mane on
// top, round dark-rimmed ears, a pink nose and spotty legs (a cub, not yet a lion like Lionel: no mane ring).
// Purrcy's mane is growing in, a fuzzy ruff round his cheeks and chin; Gentlemane has a full soft mane of
// swept locks (not Lionel's round puffs), a pink flower tucked in it and a crown. Grumpy, he goes a dusty grey-tan, flattens his ears, lets his tail droop and growls (two
// tiny fangs).
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
  const smooth = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${pt(...p)} ${pt((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${pt(...ps[ps.length - 1])}`
  return `M${pt(...L[0])} ${smooth(L)} A${w1 / 2} ${w1 / 2} 0 0 0 ${pt(...R[0])} ${smooth(R)} A${w0 / 2} ${w0 / 2} 0 0 0 ${pt(...L[0])}Z`
}

/**
 * A soft mane of n fur locks around (cx, cy), squashed to ry: each lock swells out from radius r0 to a
 * rounded tip at r1, swept a little clockwise (sweep, in radians): soft fur, not Lionel's round puffs.
 * The locks go all the way round, or (with `from` and `span`, in radians clockwise from 3 o'clock) only
 * part of the way, closed through the middle (behind the head).
 */
function locks(cx: number, cy: number, n: number, r0: number, r1: number, sweep: number, ry = 1, from = -Math.PI / 2, span = Math.PI * 2) {
  const at = (a: number, r: number) => pt(cx + Math.cos(a) * r, cy + Math.sin(a) * r * ry)
  const step = span / n
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = from + i * step
    const tip = a + step * 0.5 + sweep
    d += `${i ? ' L' : 'M'}${at(a, r0)}`
    d += ` C${at(a, (r0 + r1) * 0.5)} ${at(tip - step * 0.42, r1 * 1.03)} ${at(tip, r1)}`
    d += ` C${at(tip + step * 0.22, r1 * 0.99)} ${at(a + step, (r0 + r1) * 0.52)} ${at(a + step, r0)}`
  }
  return span < Math.PI * 2 ? `${d} L${pt(cx, cy)}Z` : `${d}Z`
}

export default function Cub({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const FUR = g ? '#cdb89d' : '#f4c88e'
  const CREAM = g ? '#ece3d6' : '#fff4e3'
  const SPOT = g ? '#ad977c' : '#dc9d5e'
  const MANE = g ? '#a48a70' : '#cf8748'
  const MANE_IN = g ? '#bba489' : '#e9ad66'
  const EAR_RIM = g ? '#9a8572' : '#b8794a'
  const NOSE = g ? '#c09094' : '#f08a9c'
  const fur = useShade(FUR, 0.4, 0.14)
  const cream = useShade(CREAM, 0.5, 0.06)
  const mane = useShade(MANE, 0.3, 0.16)
  const maneIn = useShade(MANE_IN, 0.35, 0.12)
  const line = ink(FUR)
  const maneLine = ink(MANE)
  // Grumpy, the tail hangs down on the ground instead of curling up. (Under Gentlemane's big mane, the tuft
  // sits lower and further out, so it doesn't hide behind it.)
  const tip: Pt = g ? [26, 170] : stage >= 2 ? [22, 128] : [30, 116]
  return (
    <g>
      <defs>{fur.def}{cream.def}{mane.def}{maneIn.def}</defs>

      {/* Tail with a dark tuft, curling up from behind his left side; the wag swings it in towards him */}
      <Anim cls="pa-tail" origin="100% 100%">
        <path d={tube([74, 160], g ? [44, 180] : [20, 170], tip, 10, 8)} fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M${tip[0] - 7} ${tip[1] + 2} C${tip[0] - 9} ${tip[1] - 8} ${tip[0] - 2} ${tip[1] - 14} ${tip[0] + 1} ${tip[1] - 16} C${tip[0] + 3} ${tip[1] - 10} ${tip[0] + 10} ${tip[1] - 8} ${tip[0] + 8} ${tip[1] + 2} C${tip[0] + 6} ${tip[1] + 8} ${tip[0] - 5} ${tip[1] + 8} ${tip[0] - 7} ${tip[1] + 2} Z`}
          fill={mane.fill} stroke={maneLine} strokeWidth={2.5} strokeLinejoin="round" transform={g ? `rotate(-70 ${tip[0]} ${tip[1]})` : undefined} />
      </Anim>

      {/* Sitting body, with the haunches at the sides and the hind paws poking forward */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={148} rx={31} ry={27} fill={fur.fill} stroke={line} strokeWidth={3} />
        {[-1, 1].map((side) => (
          <g key={side}>
            <circle cx={100 + side * 29} cy={160} r={15} fill={fur.fill} stroke={line} strokeWidth={3} />
            {[[24, 154, 2.4], [33, 162, 2]].map(([dx, y, r]) => <circle key={y} cx={100 + side * dx} cy={y} r={r} fill={SPOT} />)}
          </g>
        ))}
      </g>
      {[-1, 1].map((side) => (
        <g key={side}>
          <ellipse cx={100 + side * 38} cy={175} rx={11} ry={6.5} fill={fur.fill} stroke={line} strokeWidth={3} />
          <path d={`M${100 + side * 35} 172 v4 M${100 + side * 41.5} 172 v4`} stroke={line} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}

      {/* Front legs with spots, coming down from under his fluffy chest, and round front paws */}
      {[-1, 1].map((side) => {
        const x = 100 + side * 12.5
        return (
          <g key={side}>
            <rect x={x - 8.5} y={136} width={17} height={38} rx={8.5} fill={fur.fill} stroke={line} strokeWidth={3} />
            <circle cx={x + side * 2} cy={157} r={2.3} fill={SPOT} />
            <circle cx={x - side * 2} cy={164} r={1.8} fill={SPOT} />
            <ellipse cx={x} cy={174} rx={11} ry={7} fill={fur.fill} stroke={line} strokeWidth={3} />
            <path d={`M${x - 3.5} 171 v5 M${x + 3.5} 171 v5`} stroke={line} strokeWidth={2} strokeLinecap="round" />
          </g>
        )
      })}
      <path d="M77 120 C78 136 84 147 89 151 Q94 147 100 152 Q106 147 111 151 C116 147 122 136 123 120 Z" fill={cream.fill} />

      {/* Purrcy's mane is just growing in, a fuzzy ruff round his cheeks and chin; Gentlemane's is full and
          soft, in two layers */}
      {stage >= 2 && <path d={locks(100, 92, 16, 46, 61, 0.12, 0.92)} fill={mane.fill} stroke={maneLine} strokeWidth={3} strokeLinejoin="round" />}
      {stage >= 2 && <path d={locks(100, 92, 15, 39, 51, 0.14, 0.94)} fill={maneIn.fill} stroke={ink(MANE_IN)} strokeWidth={2.5} strokeLinejoin="round" />}
      {stage === 1 && <path d={locks(100, 92, 10, 37, 50, 0.1, 0.96, -0.3, Math.PI + 0.6)} fill={mane.fill} stroke={maneLine} strokeWidth={3} strokeLinejoin="round" />}

      {/* Round ears with dark rims (flattened out to the sides when grumpy); they twitch */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${100 + side * 33} 66) rotate(${side * (g ? 40 : 6)})`}>
          <Anim cls="pa-ear" origin="50% 100%" delay={side > 0 ? 0.4 : 0}>
            <circle cx={0} cy={-5} r={13} fill={EAR_RIM} stroke={ink(EAR_RIM)} strokeWidth={3} />
            <circle cx={0} cy={-3} r={8.5} fill={cream.fill} />
          </Anim>
        </g>
      ))}

      {/* The tiny tuft of mane on top (behind the head, so it grows out of it) */}
      <path d="M86 64 C82 55 86 48 91 46 C91 52 95 54 97 52 C96 45 99 38 104 35 C105 42 108 46 109 50 C111 47 115 46 118 46 C118 53 117 58 114 64 Z"
        fill={mane.fill} stroke={maneLine} strokeWidth={2.5} strokeLinejoin="round" />

      {/* Fuzzy round head with cheek tufts, a soft cream muzzle and chin */}
      <path d="M61 102 L50 108 L60 111 L54 117 L67 116 Z M139 102 L150 108 L140 111 L146 117 L133 116 Z" fill={fur.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={100} cy={90} rx={42} ry={36} fill={fur.fill} stroke={line} strokeWidth={3} />
      <path d="M100 95 C89 95 75 99 75 110 C75 120 88 125.5 100 125.5 C112 125.5 125 120 125 110 C125 99 111 95 100 95 Z" fill={cream.fill} />
      <Shine x={80} y={69} rx={10} ry={5.5} />

      <CuteFace x={100} y={87} s={0.9} gap={16} mood={mood} mouth={false} blinkDelay={1.4} />
      {[[85, 109], [82, 114], [115, 109], [118, 114]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={1.3} fill={SPOT} />)}
      <path d="M95 100 Q100 98 105 100 Q104.5 104.5 100 106 Q95.5 104.5 95 100 Z" fill={NOSE} stroke={ink(NOSE)} strokeWidth={1.8} strokeLinejoin="round" />
      {g ? (
        <>
          {/* A little growl, with two tiny fangs */}
          <path d="M91 115 Q100 108 109 115 Q100 121 91 115 Z" fill="#6b2a3a" stroke="#2b2140" strokeWidth={2} strokeLinejoin="round" />
          <path d="M94.5 112.6 L96.3 116.6 L98.1 111.4 Z M101.9 111.4 L103.7 116.6 L105.5 112.6 Z" fill="#fff" />
        </>
      ) : (
        <path d="M100 106 V109 M94 110 Q97 113 100 109 Q103 113 106 110" stroke="#7a4a3a" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {stage >= 2 && (
        <>
          {/* A pink flower tucked in Gentlemane's mane */}
          <g transform="translate(145 84) rotate(10)">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx={0} cy={-6} rx={4.5} ry={6} fill={g ? '#c9b3bf' : '#ffa8d0'} stroke={g ? '#9c8693' : '#e0679f'} strokeWidth={1.5} transform={`rotate(${a})`} />
            ))}
            <circle r={3.5} fill={g ? '#d8cfa8' : '#ffd34d'} />
          </g>
          <Crown x={100} y={56} />
          {!g && [[28, 56, 8], [172, 42, 7], [178, 124, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
