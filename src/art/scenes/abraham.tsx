// Abraham's Stars: one picture per story page, both parts in order (see data/abraham.ts for the words).
// Built from the kit (./kit.tsx) and people (../people.tsx). God is never drawn as a person: His
// presence is light. New here, for any island to reuse: the people (ABRAHAM, SARAH, VISITORS), a camel
// (Camel: standing, packed for a trip, resting, or a baby), a nomad's tent (Tent), someone sitting on the
// ground (Sitting), a laughing face (Laughing + LaughFace), a big oak (Oak), and a sky full of stars.
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, Shine, starPath, useShade } from '../kit'
import { fluff } from '../items/draw'
import { Baby, Person, SKIN, type Holding, type Look, type Pose } from '../people'
import { Bread, Flower, Glow, Palm, Rays, Scene, Sheep, Sparkles, Sun, Tap, sparkle } from './kit'
import { usePlayer } from './player'

// ---------- The people ----------

/** Abraham: old, with a long white beard, a cream head cloth, a blue traveling robe, and his staff. */
export const ABRAHAM: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#ece8e0', wrap: '#efe2c4', beard: 'long', beardColor: '#f7f4ee', robe: '#4f74b8', sash: '#e0b45a' }
/** Sarah: old (her silver hair peeks out under her violet head covering: draw her with Sarah, or add SilverHair), in a rose robe. */
export const SARAH: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#e9e5de', wrap: '#8f6cc4', robe: '#e07f8f', sash: '#f3d27a' }
/** The three visitors (Genesis 18): kind travelers with walking sticks. */
export const VISITORS: Look[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#f5f0e6', beard: 'short', beardColor: '#3b2a20', robe: '#6f9a6a', sash: '#d9b56a' },
  { skin: SKIN.deep, hair: 'covered', hairColor: '#2b1f18', wrap: '#e8b84e', beard: 'short', beardColor: '#2b1f18', robe: '#8a6bb0', sash: '#f5f0e6' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#4a3020', wrap: '#7cb0e0', beard: 'short', beardColor: '#4a3020', robe: '#c98448', sash: '#6b8f5a' },
]
/** Baby Isaac's blanket (he's people.tsx's Baby). */
export const ISAAC_BLANKET = '#dff0ff'

type Who = { x: number; y: number; s?: number; pose?: Pose; holding?: Holding; facing?: 'left' | 'right'; blinkDelay?: number; children?: ReactNode }

/** Silver hair peeking out from under a head covering (in a Person's own units): she's old. */
export const SilverHair = ({ color = '#e9e5de' }: { color?: string }) => (
  <g>
    <path d="M-24 -112.5 Q-14 -128 0 -127 Q14 -128 24 -112.5 Q14 -122 0 -121 Q-14 -122 -24 -112.5 Z" fill={color} stroke={darken(color, 0.22)} strokeWidth={1.2} strokeLinejoin="round" />
    <path d="M-15 -121 Q-12 -118 -9 -120.5 M9 -120.5 Q12 -118 15 -121" stroke={darken(color, 0.22)} strokeWidth={1} fill="none" strokeLinecap="round" />
  </g>
)

/** Abraham, with his staff when his hand is free (`holding={null}`: empty hands). */
export function Abraham({ holding, ...p }: Omit<Who, 'holding'> & { holding?: Holding | null }) {
  const pose = p.pose ?? 'stand'
  const h = holding === null ? undefined : holding ?? (pose === 'stand' || pose === 'point' ? 'staff' : undefined)
  return <Person look={ABRAHAM} {...p} holding={h} />
}

/** Sarah, with her silver hair. */
export function Sarah({ children, ...p }: Who) {
  return <Person look={SARAH} {...p}><SilverHair />{children}</Person>
}

/**
 * Baby Isaac (people.tsx's Baby), in his blue blanket, where a Person holds a baby: `<Sarah pose="hold"><Isaac /></Sarah>`.
 * `awake`: his eyes open and he giggles (his name means laughter).
 */
export function Isaac({ x = 0, y = -62, s = 0.8, awake }: { x?: number; y?: number; s?: number; awake?: boolean }) {
  return (
    <g>
      <Baby x={x} y={y} s={s} blanket={ISAAC_BLANKET} />
      {awake && (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
          {/* (over the sleeping eyes: the face is one flat color) */}
          <rect x={-21} y={-8} width={20} height={7} fill={SKIN.medium} />
          {[-15, -5].map((ex) => (
            <g key={ex}>
              <ellipse cx={ex} cy={-4.5} rx={2.1} ry={2.5} fill="#2b2140" />
              <circle cx={ex - 0.6} cy={-5.4} r={0.8} fill="#fff" />
            </g>
          ))}
          <path d="M-13.5 1 Q-10 7 -6.5 1 Z" fill="#8a2f45" stroke="#2b2140" strokeWidth={1} strokeLinejoin="round" />
        </g>
      )}
    </g>
  )
}

// A laughing face: eyes squeezed shut (the open eyes are hidden: they're the blinking group) and a
// wide-open laugh, drawn over a Person's face, in their own units. Wrap the Person in <Laughing>.
const LAUGH_CSS = '.ab-laugh .pa-blink{display:none}'
export function Laughing({ children }: { children: ReactNode }) {
  return <g className="ab-laugh"><style>{LAUGH_CSS}</style>{children}</g>
}
export const LaughFace = ({ beard }: { beard?: boolean }) => (
  <g fill="none" stroke="#2b2140" strokeWidth={2.4} strokeLinecap="round">
    <path d="M-12.5 -113 Q-8 -119 -3.5 -113 M3.5 -113 Q8 -119 12.5 -113" />
    {beard
      ? <path d="M-5.5 -100.5 Q0 -91 5.5 -100.5 Q0 -98.5 -5.5 -100.5 Z" fill="#8a2f45" strokeWidth={1.8} strokeLinejoin="round" />
      : <path d="M-7 -107 Q0 -95 7 -107 Q0 -105 -7 -107 Z" fill="#8a2f45" strokeWidth={1.8} strokeLinejoin="round" />}
  </g>
)

/** Little bursts of happy lines on both sides of a laughing face. (x, y) = the middle of the face. */
function LaughMarks({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const lines = 'M36 -10 L50 -17 M38 2 L53 2 M36 14 L50 21'
  return (
    <g className="pa-twinkle">
      <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round">
        {[1, -1].map((d) => (
          <g key={d} transform={`scale(${d} 1)`}>
            <path d={lines} stroke="#7a4a2a" strokeWidth={6} />
            <path d={lines} stroke="#ffd34d" strokeWidth={3.2} />
          </g>
        ))}
      </g>
    </g>
  )
}

/**
 * Someone sitting cross-legged on the ground, facing us: the Person from the waist up, on a lap of
 * crossed legs. (x, y) = the ground under them. Pose "hold" rests their hands (and what they hold) in their lap.
 */
export function Sitting({ x, y, s = 1, look, pose = 'hold', holding, facing, blinkDelay = 0, children }: Who & { look: Look }) {
  const clip = `ab${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const robe = useShade(look.robe, 0.3, 0.2)
  // (the Person sits 22 lower, so their waist is just above the lap and their hands rest on it)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{robe.def}<clipPath id={clip}><rect x={-120} y={-260} width={240} height={244} /></clipPath></defs>
      <ellipse cx={0} cy={-2} rx={50} ry={6} fill="#000" opacity={0.12} />
      {/* crossed legs under the robe: knees out to the sides, toes peeking out under them */}
      <ellipse cx={-30} cy={-5} rx={8} ry={4.5} fill="#7a5233" />
      <ellipse cx={30} cy={-5} rx={8} ry={4.5} fill="#7a5233" />
      <path d="M-48 -9 Q-52 -27 -30 -29 Q0 -32 30 -29 Q52 -27 48 -9 Q40 -2 26 -6 Q0 -2 -26 -6 Q-40 -2 -48 -9 Z" fill={robe.fill} stroke={ink(look.robe)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-34 -12 Q-14 -22 6 -16" stroke={ink(look.robe)} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.55} />
      <g clipPath={`url(#${clip})`}><Person x={0} y={22} look={look} pose={pose} holding={holding} facing={facing} blinkDelay={blinkDelay}>{children}</Person></g>
    </g>
  )
}

// ---------- The camel ----------

const CAMEL = '#e2ad68', PAD = '#a77a4c', MUZZLE = '#f6dcb0'

/**
 * A camel side-on, facing right (or `facing="left"`), with its head turned to us: one big hump, a long
 * neck that dips and rises, four long legs with knobbly knees and wide padded feet, and a tufted tail
 * at the back. (x, y) = its feet on the ground; at s = 1 it stands about 200 tall (a grown-up is 150).
 * `pack`: a saddle blanket with a rolled-up tent and a bundle tied on, for a long trip. `resting`: lying
 * down with its legs folded under it. `baby`: a little one (draw it smaller), with a little hump.
 */
export function Camel({ x, y, s = 1, facing = 'right', pack, resting, baby, blinkDelay = 0 }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; pack?: boolean; resting?: boolean; baby?: boolean; blinkDelay?: number
}) {
  const coat = useShade(CAMEL, 0.35, 0.16)
  const muz = useShade(MUZZLE, 0.3, 0.08)
  const line = ink(CAMEL)
  const far = darken(CAMEL, 0.12)
  const w = Math.min(4.5, 2.8 / s)
  // how far the body sits down when resting (its belly on the ground)
  const drop = resting ? 88 : 0
  // A long leg from the body (tx) down through a knobbly knee (kx, ky) to a wide padded foot (fx).
  // Front legs are slim and straight; a back leg is thick at the thigh, with its hock bulging backward.
  const leg = ([tx, kx, ky, fx, top]: number[], fill: string) => {
    const lo = 4.6, kn = 8.6
    const d = `M${tx - top} -116 C${tx - top} -96 ${kx - lo - 1} ${ky - 26} ${kx - lo} ${ky - 12} Q${kx - kn} ${ky} ${kx - lo} ${ky + 10}`
      + ` L${fx - lo} -11 Q${fx - lo - 1} -5 ${fx - 10} -4 L${fx + 10} -4 Q${fx + lo + 1} -5 ${fx + lo} -11 L${kx + lo} ${ky + 10}`
      + ` Q${kx + kn} ${ky} ${kx + lo} ${ky - 12} C${kx + lo + 1} ${ky - 26} ${tx + top} -96 ${tx + top} -116 Z`
    return (
      <g key={tx}>
        <path d={d} fill={fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
        <ellipse cx={fx} cy={-3.5} rx={11} ry={4.2} fill={PAD} stroke={ink(PAD)} strokeWidth={w * 0.7} />
      </g>
    )
  }
  // [top x, knee x, knee y, foot x, half its width at the top] for each leg
  const FRONT_FAR = [54, 56, -52, 58, 8], BACK_FAR = [-34, -40, -56, -34, 11]
  const FRONT = [38, 40, -52, 42, 8.5], BACK = [-50, -56, -56, -50, 12]
  // a leg folded under a resting camel: the knee pokes out, the foot tucked under
  const folded = (kx: number, dir: 1 | -1, fill: string) => (
    <g key={kx}>
      <path d={`M${kx - dir * 40} -30 Q${kx - dir * 10} -34 ${kx} -24 Q${kx + dir * 9} -16 ${kx} -8 Q${kx - dir * 20} -1 ${kx - dir * 46} -6 Z`} fill={fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
      <ellipse cx={kx - dir * 2} cy={-16} rx={7} ry={8} fill={darken(CAMEL, 0.06)} stroke={line} strokeWidth={w * 0.6} />
    </g>
  )
  // the back, from the rump over the hump (a baby's is small) to the shoulders
  const back = baby ? 'C-48 -170 -30 -182 -8 -182 C14 -182 30 -168 40 -152' : 'C-52 -176 -32 -200 -6 -200 C20 -200 32 -178 40 -152'
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{coat.def}{muz.def}</defs>
      <ellipse cx={4} cy={-1} rx={resting ? 92 : 78} ry={7} fill="#000" opacity={0.12} />
      {/* the legs (far ones shaded), their tops tucked under the body */}
      {!resting && [FRONT_FAR, BACK_FAR].map((l) => leg(l, far))}
      {!resting && [BACK, FRONT].map((l) => leg(l, coat.fill))}
      <g transform={`translate(0 ${drop})`}>
        {/* the tail, hanging at the back, with a dark tuft */}
        <g className="pa-tail" style={{ '--o': '100% 0%' } as CSSProperties}>
          <path d="M-74 -134 Q-88 -122 -86 -100" stroke={line} strokeWidth={w * 1.6} fill="none" strokeLinecap="round" />
          <path d={fluff(-86, -96, 5, 7, 5)} fill={darken(CAMEL, 0.4)} stroke={darken(CAMEL, 0.55)} strokeWidth={1.2} />
        </g>
        {/* the neck, dipping down from the shoulders and rising to the head */}
        <path d="M32 -154 C66 -152 90 -142 98 -176 L124 -170 C116 -136 100 -102 62 -98 L42 -100 Z" fill={coat.fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
        {/* the body and its hump, in one outline */}
        <path d={`M-66 -96 C-84 -104 -86 -140 -64 -148 ${back} C52 -150 68 -140 70 -122 C72 -104 62 -92 48 -90 Q-10 -82 -66 -96 Z`}
          fill={coat.fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
        <Shine x={-14} y={baby ? -160 : -170} rx={12} ry={5} />
        {pack && (
          <g>
            {/* a red saddle blanket over the hump, with a gold fringe */}
            <path d="M-54 -150 C-46 -180 -28 -204 -6 -204 C18 -204 32 -182 40 -154 L44 -112 Q-6 -100 -60 -112 Z" fill="#c0504d" stroke={ink('#c0504d')} strokeWidth={w * 0.9} strokeLinejoin="round" />
            <path d="M-58 -124 Q-6 -112 43 -124" stroke="#f0d38a" strokeWidth={4} fill="none" />
            {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-55 + i * 10.8} cy={-108 + Math.abs(i - 4.5) * 0.7} r={2.6} fill="#ffd34d" />)}
            {/* a rolled-up tent tied on top, and a bundle hanging at the side */}
            <rect x={-48} y={-226} width={80} height={25} rx={12.5} fill={CLOTH} stroke={ink(CLOTH)} strokeWidth={w * 0.9} />
            <path d="M-36 -225 L-36 -202 M-8 -226 L-8 -201 M20 -225 L20 -202" stroke={STRIPE} strokeWidth={3.5} />
            <ellipse cx={32} cy={-213.5} rx={5} ry={12.5} fill={darken(CLOTH, 0.12)} stroke={ink(CLOTH)} strokeWidth={w * 0.8} />
            <path d="M-28 -203 L-34 -150 M14 -203 L20 -150" stroke="#8a5a2e" strokeWidth={2.5} strokeLinecap="round" />
            <path d="M12 -134 Q14 -108 24 -98 Q38 -94 42 -110 Q42 -126 34 -136 Z" fill="#d9b56a" stroke={ink('#d9b56a')} strokeWidth={w * 0.8} strokeLinejoin="round" />
            <path d="M16 -128 Q28 -122 38 -130" stroke={ink('#d9b56a')} strokeWidth={1.6} fill="none" />
          </g>
        )}
        {/* the head, turned to us: ears, a forelock, big eyes with long lashes, and a soft muzzle */}
        <g transform={baby ? 'translate(111 -170) scale(1.3) translate(-111 170)' : undefined}>
          {[[-1, 96], [1, 126]].map(([d, ex]) => (
            <ellipse key={ex} cx={ex} cy={-196} rx={5} ry={8} transform={`rotate(${d * 40} ${ex} -196)`} fill={coat.fill} stroke={line} strokeWidth={w * 0.8} />
          ))}
          <ellipse cx={111} cy={-182} rx={19} ry={18} fill={coat.fill} stroke={line} strokeWidth={w} />
          <path d={fluff(111, -197, 9, 4, 5)} fill={darken(CAMEL, 0.18)} stroke={line} strokeWidth={1.2} />
          <ellipse cx={111} cy={-166} rx={15} ry={10.5} fill={muz.fill} stroke={line} strokeWidth={w * 0.85} />
          <path d="M104.5 -170 q2 1.8 3.2 3.4 M117.5 -170 q-2 1.8 -3.2 3.4" stroke={PAD} strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M106 -161.5 Q111 -157.5 116 -161.5" stroke="#5a3a24" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
            {[-7.5, 7.5].map((d) => (
              <g key={d}>
                <ellipse cx={111 + d} cy={-184} rx={3.6} ry={4.6} fill="#2b2140" />
                <circle cx={110 + d} cy={-186} r={1.4} fill="#fff" />
              </g>
            ))}
          </g>
          {[-7.5, 7.5].map((d) => (
            <path key={d} d={`M${111 + d - 4} -189 l-2 -3 M${111 + d} -189.6 l0 -3.4 M${111 + d + 4} -189 l2 -3`} stroke="#2b2140" strokeWidth={1.3} strokeLinecap="round" />
          ))}
          <ellipse cx={99} cy={-176} rx={3.4} ry={2.2} fill="#ff7fb0" opacity={0.5} />
          <ellipse cx={123} cy={-176} rx={3.4} ry={2.2} fill="#ff7fb0" opacity={0.5} />
        </g>
      </g>
      {resting && (
        <g>
          {folded(-52, -1, far)}
          {folded(70, 1, coat.fill)}
        </g>
      )}
    </g>
  )
}

// ---------- The tent ----------

const CLOTH = '#7d5a45', STRIPE = '#ead3a5'

/**
 * Abraham's tent: a wide, low tent of woven goat hair with cream stripes, held up by poles and pegged out
 * with ropes. Its front is open, with the door flaps tied back: dark inside, or warm with lamplight at
 * night (`lit`). (x, y) = the middle of its front on the ground; at s = 1 it's about 400 wide (with its
 * ropes) and 220 tall, and its doorway fits a grown-up. `children` stand in the doorway, in front of the
 * back wall and behind the door flaps.
 */
export function Tent({ x, y, s = 1, lit, children }: { x: number; y: number; s?: number; lit?: boolean; children?: ReactNode }) {
  const cloth = useShade(CLOTH, 0.22, 0.2)
  const line = ink(CLOTH)
  const glow = `tg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        {cloth.def}
        <radialGradient id={glow} cx="50%" cy="60%" r="65%">
          <stop offset="0" stopColor="#fff1c0" /><stop offset="0.6" stopColor="#ffc95e" /><stop offset="1" stopColor="#c9822e" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={-2} rx={190} ry={10} fill="#000" opacity={0.1} />
      {/* ropes out to the pegs */}
      {[-1, 1].map((d) => (
        <g key={d} stroke="#9a7a55" strokeWidth={2.2} strokeLinecap="round">
          <path d={`M${d * 168} -138 L${d * 214} 0 M${d * 120} -176 L${d * 196} 0`} fill="none" />
          <path d={`M${d * 214} 2 L${d * 210} -14 M${d * 196} 2 L${d * 192} -14`} stroke="#6b4422" strokeWidth={4} />
        </g>
      ))}
      {/* inside: the back wall (dark by day, lamplit at night), a rug, and the middle pole */}
      <rect x={-134} y={-172} width={268} height={172} fill={lit ? `url(#${glow})` : '#46302a'} />
      {!lit && <path d="M-134 -172 L134 -172 L134 -150 Q0 -140 -134 -150 Z" fill="#33221c" />}
      <rect x={-118} y={-18} width={236} height={18} fill="#b5553f" />
      <path d={`M-114 -9 ${Array.from({ length: 12 }, () => 'l9.8 -5 l9.8 5').join(' ')}`} stroke="#f0d38a" strokeWidth={2.2} fill="none" />
      <rect x={-5} y={-206} width={10} height={190} rx={3} fill={lit ? '#9a6a3a' : '#6b4a2e'} />
      {lit && (
        <g>
          <path d="M0 -150 L0 -130" stroke="#5a3a20" strokeWidth={2} />
          <Glow x={0} y={-118} r={60} color="#fff3c0" />
          <path d="M-9 -130 L9 -130 L6 -112 L-6 -112 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2} />
          <path d="M0 -127 Q-5 -118 0 -114 Q5 -118 0 -127 Z" fill="#fff7c9" />
        </g>
      )}
      {children}
      {/* the door flaps, tied back, and the side walls */}
      {[-1, 1].map((d) => (
        <g key={d} transform={`scale(${d} 1)`}>
          <path d="M-182 -132 L-136 -172 Q-122 -120 -104 -86 Q-118 -48 -128 0 L-188 0 Z" fill={cloth.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          <path d="M-134 -164 Q-121 -118 -108 -88 Q-120 -50 -130 -4" stroke={STRIPE} strokeWidth={5} fill="none" />
          <path d="M-170 -128 L-176 -2" stroke={darken(CLOTH, 0.15)} strokeWidth={2} />
          <path d="M-112 -92 q-6 2 -6 8 q6 1 8 -4" stroke="#c0504d" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* the roof, high in the middle and sagging between the poles, with woven stripes */}
      <path d="M-196 -128 L-150 -178 Q-96 -168 -60 -192 Q0 -226 60 -192 Q96 -168 150 -178 L196 -128 Q148 -142 100 -138 Q50 -160 0 -156 Q-50 -160 -100 -138 Q-148 -142 -196 -128 Z"
        fill={cloth.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-178 -142 Q-144 -152 -104 -150 Q-52 -170 0 -168 Q52 -170 104 -150 Q144 -152 178 -142" stroke={STRIPE} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-160 -164 Q-120 -164 -82 -168 Q-40 -192 0 -194 Q40 -192 82 -168 Q120 -164 160 -164" stroke={STRIPE} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d="M-168 -153 Q-130 -158 -94 -159 Q-46 -181 0 -181 Q46 -181 94 -159 Q130 -158 168 -153" stroke="#c0504d" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.8} />
      {/* the tops of the poles */}
      {[-150, 0, 150].map((px) => <circle key={px} cx={px} cy={px ? -178 : -210} r={4} fill="#6b4422" />)}
    </g>
  )
}

// ---------- The sky and the land ----------

/** A little random-number maker, so a sky's stars land in the same places every time. */
function seeded(seed: number) {
  let n = seed
  return () => {
    n = (n * 16807) % 2147483647
    return (n - 1) / 2147483646
  }
}

/** Where the stars are: spread evenly, but not in rows, down to `bottom`, missing the boxes in `avoid` ([x0, y0, x1, y1]). */
export function starField(seed: number, bottom: number, avoid: number[][] = []) {
  const rnd = seeded(seed)
  const out: { x: number; y: number; r: number; big: boolean }[] = []
  for (let gy = 0; gy < bottom; gy += 40) for (let gx = 0; gx < 800; gx += 50) {
    const x = gx + 6 + rnd() * 38, y = gy + 6 + rnd() * 28
    const big = rnd() < 0.18
    const r = big ? 6.5 + rnd() * 4.5 : 2 + rnd() * 3
    if (y < bottom - 4 && !avoid.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1)) out.push({ x, y, r, big })
  }
  return out
}

/** A night sky full of stars: little twinkles and bright five-pointed stars, some of them twinkling. `thin`: only every so many (the first stars of the evening). */
export function StarrySky({ seed = 7, bottom = 300, avoid, thin = 1 }: { seed?: number; bottom?: number; avoid?: number[][]; thin?: number }) {
  return (
    <g>
      {starField(seed, bottom, avoid).filter((_, i) => i % thin === 0).map(({ x, y, r, big }, i) => big ? (
        <g key={i} className="pa-twinkle" style={{ animationDelay: `${(i % 9) * 0.27}s` }}>
          <path d={starPath(x, y, r)} fill="#ffe680" stroke="#f2c24e" strokeWidth={1.2} strokeLinejoin="round" />
        </g>
      ) : (
        <path key={i} className={i % 4 ? undefined : 'pa-twinkle'} style={i % 4 ? undefined : { animationDelay: `${(i % 5) * 0.4}s` }} d={sparkle(x, y, r)} fill="#fff8d6" opacity={0.9} />
      ))}
    </g>
  )
}

/** A soft round glow that fades away to nothing at its edge (so it never looks like a grey disc). */
function SoftLight({ x, y, r, color = '#fff3b0', o = 0.45 }: { x: number; y: number; r: number; color?: string; o?: number }) {
  const id = `sl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs><radialGradient id={id}><stop offset="0" stopColor={color} stopOpacity={o} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  )
}

/** One bright, golden five-pointed star with a soft glow (a star to tap). */
function BrightStar({ x, y, r = 14, d = 0 }: { x: number; y: number; r?: number; d?: number }) {
  return (
    <g className="pa-twinkle" style={{ animationDelay: `${d}s` }}>
      <SoftLight x={x} y={y} r={r * 2.8} o={0.5} />
      <path d={starPath(x, y, r)} fill="#ffe27a" stroke="#e8b43a" strokeWidth={2} strokeLinejoin="round" />
      <path d={starPath(x - r * 0.08, y - r * 0.05, r * 0.45)} fill="#fffbe0" opacity={0.8} />
    </g>
  )
}

/** Sand dunes by night, soft blue and violet. */
export function NightDunes() {
  return (
    <g>
      <path d="M0 318 Q170 282 350 312 Q560 270 800 306 L800 450 L0 450 Z" fill="#4c5288" />
      <path d="M0 378 Q240 344 470 376 T800 368 L800 450 L0 450 Z" fill="#3d4377" />
    </g>
  )
}

/** A flat-roofed house of sun-dried bricks: a low wall around its roof, an arched door, and small windows. (x, y) = the middle of its front, on the ground. */
function MudHouse({ x, y, w = 70, h = 56, color = '#ecd3a2', door = true, win = 1 }: { x: number; y: number; w?: number; h?: number; color?: string; door?: boolean; win?: 0 | 1 | 2 }) {
  const dh = Math.min(32, h * 0.5)
  const dx = win === 1 ? x - w * 0.18 : x
  const wins = win === 1 ? [x + w * 0.24] : win === 2 ? [x - w * 0.3, x + w * 0.3] : []
  const ws = Math.min(12, w * 0.16)
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={color} stroke={ink(color)} strokeWidth={2.5} />
      <rect x={x - w / 2 - 3} y={y - h - 7} width={w + 6} height={8} rx={2} fill={darken(color, 0.1)} stroke={ink(color)} strokeWidth={2} />
      {door && <path d={`M${dx - 7} ${y} L${dx - 7} ${y - dh + 7} Q${dx} ${y - dh - 3} ${dx + 7} ${y - dh + 7} L${dx + 7} ${y} Z`} fill="#8a5a2e" />}
      {wins.map((wx, i) => <rect key={i} x={wx - ws / 2} y={y - h + h * 0.2} width={ws} height={ws} rx={ws / 3} fill="#6b4422" />)}
    </g>
  )
}

/** A town far away on the horizon: little houses in a huddle. (x, y) = its middle, on the ground. */
function FarTown({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const HOUSES: [number, number, number, number][] = [[-52, 0, 34, 26], [-20, -4, 28, 40], [10, 0, 38, 28], [42, -2, 30, 36], [-36, 6, 30, 22], [26, 6, 34, 22]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {HOUSES.map(([hx, hy, w, h], i) => <MudHouse key={i} x={hx} y={hy} w={w} h={h} win={0} door={i % 2 === 0} color={['#e8cc98', '#dcb983', '#f0dbb0'][i % 3]} />)}
    </g>
  )
}

/** A big, shady oak tree (like the oaks of Mamre): a thick trunk and a wide leafy crown. (x, y) = the foot of its trunk. */
export function Oak({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const leaf = useShade('#5fae5a', 0.3, 0.22)
  const line = ink('#5fae5a')
  const CLUMPS: [number, number, number][] = [[-96, -168, 52], [-40, -212, 62], [36, -220, 64], [98, -174, 54], [-56, -138, 50], [4, -150, 62], [62, -134, 50], [-112, -126, 34], [116, -128, 34]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{leaf.def}</defs>
      <ellipse cx={0} cy={-2} rx={150} ry={12} fill="#000" opacity={0.12} />
      <path d="M-20 0 C-12 -36 -16 -70 -12 -100 L-50 -140 L-38 -148 L-4 -112 L-2 -150 L12 -150 L12 -112 L44 -144 L56 -134 L18 -96 C16 -62 18 -30 24 0 Z" fill="#8a5a33" stroke="#5e3b1f" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-4 -20 Q2 -40 -2 -62 M8 -70 Q12 -84 10 -96" stroke="#6e4526" strokeWidth={2} fill="none" strokeLinecap="round" />
      <g className="sc-sway">
        {CLUMPS.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r + 1.5} fill={line} />)}
        {CLUMPS.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r - 1.5} fill={leaf.fill} />)}
        {[[-70, -186], [20, -200], [84, -150], [-20, -130]].map(([lx, ly], i) => (
          <path key={i} d={`M${lx - 12} ${ly} q12 8 24 0`} stroke={line} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
        ))}
      </g>
    </g>
  )
}

/** A clay jug of cool milk. (x, y) = its bottom. */
function Jug({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M12 -32 Q26 -28 15 -14" stroke="#8a5428" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M-9 -38 Q-15 -31 -13 -22 Q-20 -11 -12 0 L12 0 Q20 -11 13 -22 Q15 -31 9 -38 Z" fill="#c9824a" stroke="#8a5428" strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={0} cy={-38} rx={9.5} ry={3.4} fill="#fffaf0" stroke="#8a5428" strokeWidth={2} />
      <path d="M-14 -17 Q0 -12 14 -17" stroke="#e8b07a" strokeWidth={2.2} fill="none" />
      <ellipse cx={-6} cy={-26} rx={2.5} ry={5} fill="#fff" opacity={0.35} />
    </g>
  )
}

/** A woven rug on the ground, seen from the front. */
function Rug({ x0, x1, y0, y1, color = '#b5553f' }: { x0: number; x1: number; y0: number; y1: number; color?: string }) {
  const m = (y0 + y1) / 2
  return (
    <g>
      <path d={`M${x0 + 18} ${y0} L${x1 - 18} ${y0} L${x1} ${y1} L${x0} ${y1} Z`} fill={color} stroke={ink(color)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M${x0 + 14} ${m} L${x1 - 14} ${m}`} stroke="#f0d38a" strokeWidth={3} strokeDasharray="10 7" />
    </g>
  )
}

/** A plate of warm bread. (x, y) = the middle of the plate. */
function BreadPlate({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={34} ry={9} fill="#efe2c8" stroke="#a88a5a" strokeWidth={2.5} />
      <Bread x={-13} y={-7} s={0.55} />
      <Bread x={13} y={-7} s={0.55} />
      <Bread x={0} y={-15} s={0.55} />
    </g>
  )
}

/**
 * A thought bubble: a puffy cloud at (x, y), w wide and h tall, with little round puffs (`tail`: x, y,
 * r) leading down to whoever is thinking. `children` are drawn inside it (what they wish for).
 */
function ThoughtBubble({ x, y, w, h, tail, children }: { x: number; y: number; w: number; h: number; tail: [number, number, number][]; children?: ReactNode }) {
  const puffs = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return [x + Math.cos(a) * w * 0.42, y + Math.sin(a) * h * 0.38, Math.min(w, h) * 0.24]
  })
  const line = '#c9b8d8'
  return (
    <g className="sc-float">
      {tail.map(([tx, ty, r], i) => <circle key={i} cx={tx} cy={ty} r={r} fill="#fff" stroke={line} strokeWidth={2.5} />)}
      {puffs.map(([px, py, r], i) => <circle key={i} cx={px} cy={py} r={r + 2.5} fill={line} />)}
      <ellipse cx={x} cy={y} rx={w * 0.5 + 2.5} ry={h * 0.44 + 2.5} fill={line} />
      {puffs.map(([px, py, r], i) => <circle key={`w${i}`} cx={px} cy={py} r={r} fill="#fff" />)}
      <ellipse cx={x} cy={y} rx={w * 0.5} ry={h * 0.44} fill="#fff" />
      {children}
    </g>
  )
}

/** A little floating heart: love and joy. */
function Heart({ x, y, s = 1, d = 0 }: { x: number; y: number; s?: number; d?: number }) {
  return (
    <g className="sc-float" style={{ animationDelay: `${d}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 13 C-20 0 -17 -17 -7 -17 C-3 -17 0 -14 0 -10 C0 -14 3 -17 7 -17 C17 -17 20 0 0 13 Z" fill="#ff6f91" stroke="#d94a6e" strokeWidth={2.5} strokeLinejoin="round" />
        <ellipse cx={-8} cy={-9} rx={3.6} ry={2.2} fill="#fff" opacity={0.65} transform="rotate(-35 -8 -9)" />
      </g>
    </g>
  )
}

/** Footprints in the sand: a trail through `pts`, getting smaller as it goes far away (`far`: the size at the end). */
function Footprints({ pts, far = 0.4 }: { pts: [number, number][]; far?: number }) {
  const steps: { x: number; y: number; a: number }[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 22))
    for (let j = 0; j < n; j++) {
      const t = j / n
      steps.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, a: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI })
    }
  }
  return (
    <g fill="#b98a4f" opacity={0.75}>
      {steps.map(({ x, y, a }, i) => {
        const k = 1 - (1 - far) * (i / Math.max(1, steps.length - 1))
        const side = i % 2 ? 5 : -5
        return <ellipse key={i} cx={0} cy={side * k} rx={5 * k} ry={2.6 * k} transform={`translate(${x} ${y}) rotate(${a})`} />
      })}
    </g>
  )
}

// ---------- Abraham's big family (page 12) ----------

const FOLK_ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const FOLK_WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
const FOLK_SKINS = [SKIN.medium, SKIN.tan, SKIN.deep, SKIN.light, '#e3b48c']
const FOLK_HAIR = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24']

/** Someone in Abraham's big family, long after him: a man, a woman, a girl or a boy, different for each `i`. */
function folkLook(i: number): Look {
  const skin = FOLK_SKINS[(i * 3) % 5], robe = FOLK_ROBES[(i * 7) % 10], hairColor = FOLK_HAIR[i % 4]
  switch (i % 4) {
    case 0: return { skin, robe, hairColor, hair: 'short', beard: 'short', sash: FOLK_WRAPS[i % 6] }
    case 1: return { skin, robe, hairColor, hair: 'covered', wrap: FOLK_WRAPS[(i + 2) % 6], sash: '#f5f0e6' }
    case 2: return { skin, robe, hairColor, hair: i % 8 === 2 ? 'pigtails' : 'curly', build: 'child', sash: '#ffffff' }
    default: return { skin, robe, hairColor, hair: 'covered', wrap: FOLK_WRAPS[(i + 4) % 6], beard: 'short', beardColor: hairColor }
  }
}

/**
 * A row of Abraham's family across the hills, standing on y at size s, at xs. (Each row's people stand in
 * the gaps of the row in front, so nobody's head covers somebody behind them.)
 */
function FamilyRow({ y, s, xs, seed }: { y: number; s: number; xs: number[]; seed: number }) {
  const POSES: Pose[] = ['wave', 'stand', 'arms-up', 'stand']
  return (
    <g>
      {xs.map((x, i) => {
        const k = seed + i
        return <Person key={i} x={x} y={y + ((k * 13) % 5)} s={s} look={folkLook(k)} pose={POSES[k % 4]} facing={k % 2 ? 'left' : 'right'} blinkDelay={(k % 7) * 0.5} />
      })}
    </g>
  )
}

// ---------- The pages ----------

// 1. "Long ago, a man named Abraham lived in a big, busy city with his wife, Sarah. God loved Abraham,
// and Abraham loved God." Their house on a busy street, with God's love shining down on them.
const STREET_BACK: [number, number, number, number][] = [[300, 300, 64, 52], [362, 296, 54, 72], [426, 302, 70, 48], [492, 298, 58, 64], [556, 302, 66, 50], [618, 296, 56, 76], [680, 300, 70, 54], [748, 298, 66, 66], [796, 302, 44, 48]]
const SANDS = ['#ecd3a2', '#e3c28c', '#f2dfb6', '#dcb57e']
const TOWNSFOLK: Look[] = [
  { skin: SKIN.deep, hair: 'covered', hairColor: '#2b1f18', wrap: '#5fb7ff', robe: '#f0a860', sash: '#ffffff' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8dcc0', beard: 'short', beardColor: '#3b2a20', robe: '#6fb7b0', sash: '#c0504d' },
  { skin: SKIN.tan, hair: 'curly', hairColor: '#3b2a20', robe: '#ffcf5a', sash: '#c0504d', build: 'child' },
]
const Page1 = () => (
  <Scene sky="day" ground="none">
    <Rays x={300} y={-60} r={620} n={16} color="#fff6c0" opacity={0.2} />
    <path d="M0 302 Q200 284 400 298 T800 292 L800 450 L0 450 Z" fill="#f0d6a2" />
    <Palm x={336} y={290} s={0.55} />
    <Palm x={654} y={286} s={0.6} />
    {STREET_BACK.map(([hx, hy, w, h], i) => <MudHouse key={i} x={hx} y={hy} w={w} h={h} color={SANDS[i % 4]} win={i % 3 === 1 ? 2 : 1} />)}
    <path d="M0 352 Q300 338 520 354 T800 348 L800 450 L0 450 Z" fill="#e8c98e" />
    <MudHouse x={480} y={356} w={108} h={84} color="#efd8a8" win={2} />
    <MudHouse x={604} y={350} w={92} h={104} color="#e6c690" />
    <MudHouse x={728} y={358} w={118} h={80} color="#f2dfb6" win={2} />
    {/* Abraham and Sarah's house, with a striped awning over the door and a big water pot */}
    <MudHouse x={140} y={378} w={220} h={170} color="#f0dbb0" door={false} win={0} />
    <path d="M70 378 L70 300 Q92 278 114 300 L114 378 Z" fill="#8a5a2e" stroke="#6b4422" strokeWidth={2} />
    <rect x={160} y={250} width={34} height={30} rx={8} fill="#6b4422" />
    <path d="M56 286 L128 286 L136 266 L48 266 Z" fill="#c0504d" stroke="#8a3a36" strokeWidth={2} strokeLinejoin="round" />
    {[60, 78, 96, 114].map((sx) => <path key={sx} d={`M${sx} 266 L${sx + 2} 286`} stroke="#f5f0e6" strokeWidth={5} />)}
    <path d="M140 378 Q128 360 136 346 Q132 336 144 334 L176 334 Q188 336 184 346 Q192 360 180 378 Z" fill="#c9824a" stroke="#8a5428" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M136 352 Q160 358 184 352" stroke="#e8b07a" strokeWidth={2.5} fill="none" />
    {/* busy townsfolk: a woman with a water jar on her head, a man with a basket, a boy running */}
    <Person x={534} y={404} s={0.6} look={TOWNSFOLK[0]} blinkDelay={0.8}>
      <path d="M-14 -142 Q-20 -156 -10 -166 L10 -166 Q20 -156 14 -142 Z" fill="#c9824a" stroke="#8a5428" strokeWidth={2.5} strokeLinejoin="round" />
    </Person>
    <Person x={606} y={400} s={0.62} look={TOWNSFOLK[1]} pose="hold" holding="basket" facing="left" blinkDelay={1.6} />
    <Person x={664} y={408} s={0.6} look={TOWNSFOLK[2]} pose="wave" blinkDelay={2.2} />
    <Tap say="God loves Abraham. And God loves you, too!" sfx="sparkle">
      <Glow x={300} y={90} r={150} />
      <Sparkles spots={[[250, 150, 8], [352, 128, 10], [300, 96, 6]]} />
    </Tap>
    <Tap say="Hello! My name is Abraham." sfx="good">
      <Person x={290} y={420} s={1.02} look={ABRAHAM} pose="wave" />
    </Tap>
    <Tap say="And I am Sarah!" sfx="pop">
      <Sarah x={374} y={424} s={0.96} blinkDelay={1.1} />
    </Tap>
    <Tap say="Baa! Baa!" sfx="pop">
      <Sheep x={712} y={436} s={0.62} facing="left" />
      <Sheep x={772} y={426} s={0.52} facing="left" />
    </Tap>
  </Scene>
)

// 2. "One day, God said, "Abraham, leave your home, and go to a new land. I will show you the way."
// Abraham did not know where he was going. But he trusted God!" God's light shines on a path that leads
// away from the town, over the sand, to a green land far away.
const Page2 = () => (
  <Scene sky="day" ground="none">
    <Rays x={600} y={40} r={560} n={16} color="#fff3b0" opacity={0.32} />
    <path d="M540 302 Q620 270 700 290 Q760 276 800 284 L800 316 L540 316 Z" fill="#9fd394" stroke="#7cb874" strokeWidth={2} />
    <path d="M610 296 Q660 278 720 296" stroke="#7cb874" strokeWidth={2} fill="none" />
    <path d="M0 302 Q200 282 400 300 Q600 288 800 302 L800 450 L0 450 Z" fill="#f2d39a" />
    <FarTown x={110} y={304} s={0.9} />
    <path d="M0 382 Q240 352 480 380 T800 372 L800 450 L0 450 Z" fill="#e8bf7a" />
    {/* the way ahead, winding off to the new land */}
    <path d="M330 450 C380 404 520 384 556 354 C592 326 618 314 644 304 L660 304 C646 318 634 332 604 358 C566 390 476 414 474 450 Z" fill="#fbe6bd" opacity={0.9} />
    <Tap say="God will show Abraham the way!" sfx="sparkle">
      <Glow x={600} y={80} r={150} color="#fff6c0" />
      <Sparkles spots={[[560, 120, 9], [650, 64, 7], [610, 150, 6]]} />
    </Tap>
    <Tap say="A new land, far, far away!" sfx="ding">
      <Sparkles spots={[[640, 262, 8], [740, 252, 7], [700, 236, 5]]} />
    </Tap>
    <Tap say="Where are we going, Abraham?" sfx="pop">
      <Sarah x={210} y={424} s={0.98} blinkDelay={1.3} />
    </Tap>
    <Tap say="I don't know. But I trust God!" sfx="good">
      <Person x={310} y={422} s={1.05} look={ABRAHAM} pose="pray" />
    </Tap>
  </Scene>
)

// 3. "So Abraham and Sarah packed up their tents. They took their sheep and their camels, and off they
// went. They walked a long, long way!" Their footprints go all the way back to the town they left.
const Page3 = () => (
  <Scene sky="day" ground="desert" sun>
    <FarTown x={70} y={316} s={0.5} />
    <Footprints pts={[[150, 404], [118, 380], [150, 356], [214, 344], [160, 330], [96, 320]]} far={0.35} />
    <Palm x={756} y={350} s={0.5} />
    <Tap say="Baa! Are we there yet?" sfx="pop">
      <Sheep x={84} y={430} s={0.58} />
      <Sheep x={140} y={442} s={0.52} />
      <Sheep x={612} y={440} s={0.5} />
    </Tap>
    <Camel x={232} y={404} s={0.64} pack blinkDelay={1.2} />
    <Tap say="We packed up our tents!" sfx="pop">
      <Sarah x={368} y={424} s={0.9} blinkDelay={0.6} />
    </Tap>
    <Tap say="Grumble, grumble! What a long, long walk!" sfx="wobble">
      <Camel x={510} y={420} s={0.76} pack />
    </Tap>
    <Tap say="God is showing us the way!" sfx="good">
      <Abraham x={694} y={416} s={0.92} />
    </Tap>
  </Scene>
)

// 4. "At last, they came to a beautiful land. God said, "I will give this land to your family." So
// Abraham and Sarah set up their tents, and they thanked God."
const Page4 = () => (
  <Scene sky="day" ground="hills">
    <Rays x={400} y={-60} r={640} n={18} color="#fff6c0" opacity={0.22} />
    <Oak x={668} y={318} s={0.7} />
    <Tent x={540} y={300} s={0.34} />
    {[[40, 440], [330, 436], [770, 424], [384, 446]].map(([fx, fy], i) => <Flower key={i} x={fx} y={fy} color={['#ff8cc0', '#ffd34d', '#ffffff'][i % 3]} />)}
    <Tap say="Our new home!" sfx="pop">
      <Tent x={250} y={372} s={0.7} />
    </Tap>
    <Tap say="God gave them this land!" sfx="sparkle">
      <Sparkles spots={[[400, 60, 10], [300, 120, 7], [520, 110, 8], [640, 60, 6]]} />
    </Tap>
    <Sheep x={64} y={416} s={0.62} />
    <Sheep x={120} y={430} s={0.58} facing="left" />
    <Tap say="Thank You, God!" sfx="good">
      <Person x={444} y={420} s={0.98} look={ABRAHAM} pose="arms-up" />
    </Tap>
    <Sarah x={532} y={424} s={0.92} pose="pray" blinkDelay={1.4} />
    <Tap say="Ahh, time for a rest!" sfx="wobble">
      <Camel x={690} y={436} s={0.55} facing="left" resting blinkDelay={0.9} />
    </Tap>
  </Scene>
)

// 5. "But Abraham and Sarah were very old, and they had no children. They wished for a baby so much."
// They sit at their tent door, watching a mother sheep and her lamb, and a mother camel and her baby.
const Page5 = () => (
  <Scene sky="day" ground="hills" sun>
    <Tent x={200} y={366} s={0.7} />
    <Tap say="God loves us, Sarah." sfx="good">
      <Sitting x={150} y={414} s={0.92} look={ABRAHAM} pose="pray" />
    </Tap>
    <Tap say="We wish we had a baby." sfx="pop">
      <Sitting x={252} y={416} s={0.88} look={SARAH} blinkDelay={1.2}><SilverHair /></Sitting>
    </Tap>
    <Tap say="Baa! I stay close to my mama!" sfx="pop">
      <Sheep x={470} y={412} s={0.8} facing="left" />
      <Sheep x={414} y={426} s={0.46} facing="left" />
    </Tap>
    <Tap say="Hello, little one!" sfx="wobble">
      <Camel x={718} y={404} s={0.56} facing="left" blinkDelay={0.5} />
      <Camel x={622} y={432} s={0.33} facing="left" baby blinkDelay={1.7} />
    </Tap>
    {/* what they wish for */}
    <ThoughtBubble x={420} y={150} w={190} h={120} tail={[[222, 300, 5], [252, 276, 8], [290, 246, 11]]}>
      <Baby x={428} y={146} s={1.45} blanket="#ffe9a8" />
      <Heart x={346} y={130} s={0.55} />
      <Heart x={498} y={124} s={0.6} d={0.7} />
    </ThoughtBubble>
  </Scene>
)

// 6. "One night, God took Abraham outside and said, "Look up at the sky, and count the stars, if you can! Your
// family will be like the stars." And Abraham believed God."
const Page6 = () => (
  <Scene sky="night" ground="none" stars={false}>
    <StarrySky seed={11} bottom={300} />
    <Rays x={470} y={-40} r={520} n={12} color="#fff6c0" opacity={0.16} />
    <Tap say="Twinkle, twinkle! Can you count them all?" sfx="sparkle">
      <BrightStar x={140} y={90} r={16} />
      <BrightStar x={330} y={60} r={13} d={0.5} />
      <BrightStar x={620} y={80} r={15} d={0.9} />
      <BrightStar x={720} y={190} r={12} d={1.3} />
      <BrightStar x={250} y={200} r={12} d={0.3} />
    </Tap>
    <NightDunes />
    <Tap say="God always keeps His promises!" sfx="ding">
      <Glow x={470} y={300} r={170} color="#fff3c0" />
    </Tap>
    <Tent x={168} y={372} s={0.6} lit />
    <Camel x={692} y={430} s={0.52} facing="left" resting blinkDelay={2} />
    <Tap say="So many stars! I can't count them all!" sfx="good">
      <Person x={470} y={420} s={1.05} look={ABRAHAM} pose="arms-up" />
    </Tap>
  </Scene>
)

// 7. "Abraham and Sarah waited and waited, for years and years. Every night, Abraham looked up at the
// stars and remembered God's promise of a great big family." At dusk, on a rug outside their tent.
const Page7 = () => (
  <Scene sky="dusk" ground="none" moon>
    <StarrySky seed={5} bottom={230} thin={3} avoid={[[560, 0, 760, 170], [240, 50, 360, 170]]} />
    <path d="M0 312 Q200 280 420 306 Q620 276 800 300 L800 450 L0 450 Z" fill="#8a7cb6" />
    <path d="M0 372 Q240 344 470 370 T800 362 L800 450 L0 450 Z" fill="#6f639e" />
    <Tent x={590} y={372} s={0.68} lit />
    <Rug x0={150} x1={400} y0={398} y1={428} />
    <Tap say="Twinkle, twinkle! Remember God's promise?" sfx="sparkle">
      <BrightStar x={300} y={110} r={18} />
    </Tap>
    <Tap say="God promised me a great big family." sfx="good">
      <Sitting x={226} y={418} s={0.95} look={ABRAHAM} pose="pray" />
    </Tap>
    <Tap say="We will keep waiting for God." sfx="pop">
      <Sitting x={326} y={420} s={0.9} look={SARAH} blinkDelay={1.5}><SilverHair /></Sitting>
    </Tap>
  </Scene>
)

// 8. "One hot day, three visitors came to Abraham's tent. Abraham ran to meet them. "Welcome!" he said.
// "Come and rest in the shade!""
const WarmHills = () => (
  <g>
    <path d="M0 312 Q160 286 340 306 Q560 276 800 304 L800 450 L0 450 Z" fill="#d6dc8c" />
    <path d="M0 376 Q240 350 470 374 T800 366 L800 450 L0 450 Z" fill="#c3cf72" />
  </g>
)
/** Wavy lines of heat under a hot sun. */
const Heat = ({ x, y }: { x: number; y: number }) => (
  <g className="sc-float" fill="none" strokeLinecap="round">
    {[[-40, 0], [0, 14], [40, 0]].map(([dx, dy]) => (
      <path key={dx} d={`M${x + dx - 18} ${y + dy} q4.5 -6 9 0 t9 0 t9 0 t9 0`} stroke="#ffb84a" strokeWidth={3.5} />
    ))}
  </g>
)
const Page8 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Tap say="Phew! It is a hot, hot day!" sfx="wobble">
      <Sun x={660} y={90} s={1.15} />
      <Heat x={660} y={182} />
    </Tap>
    <WarmHills />
    <Oak x={330} y={372} s={0.95} />
    <Tent x={126} y={380} s={0.56}>
      <Tap say="Visitors are here!" sfx="pop"><Sarah x={-60} y={0} s={1} blinkDelay={0.4} /></Tap>
    </Tent>
    <Tap say="Welcome! Come and rest in the shade!" sfx="good">
      <Person x={430} y={420} s={1} look={ABRAHAM} pose="wave" />
    </Tap>
    <Tap say="Hello, Abraham!" sfx="pop">
      <Person x={566} y={424} s={0.96} look={VISITORS[0]} holding="stick" facing="left" blinkDelay={0.7} />
      <Person x={648} y={418} s={0.96} look={VISITORS[1]} pose="wave" facing="left" blinkDelay={1.9} />
      <Person x={732} y={426} s={0.96} look={VISITORS[2]} holding="stick" facing="left" blinkDelay={1.2} />
    </Tap>
  </Scene>
)

// 9. "Sarah baked warm bread, and Abraham brought cool milk. The visitors sat under a big shady tree, and
// they ate and ate." 10. uses the same place: the meal under the oak, Sarah at the tent door.
function Picnic({ children }: { children?: ReactNode }) {
  return (
    <>
      <WarmHills />
      <Oak x={600} y={352} s={1.12} />
      {/* the tree's cool shade, where the visitors sit */}
      <ellipse cx={600} cy={414} rx={220} ry={34} fill="#000" opacity={0.07} />
      <Rug x0={430} x1={770} y0={398} y1={436} color="#c0504d" />
      {children}
    </>
  )
}
const Page9 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Picnic>
      <Tap say="Yum! Thank you, Abraham!" sfx="pop">
        <Sitting x={492} y={414} s={0.86} look={VISITORS[0]} holding="bread" blinkDelay={0.3} />
        <Sitting x={598} y={410} s={0.86} look={VISITORS[1]} holding="bread" blinkDelay={1.4} />
        <Sitting x={704} y={416} s={0.86} look={VISITORS[2]} holding="bread" blinkDelay={2.1} />
      </Tap>
      <BreadPlate x={548} y={426} s={0.8} />
      <Jug x={652} y={432} s={0.8} />
    </Picnic>
    <Tent x={168} y={404} s={0.78}>
      <Tap say="I baked warm bread!" sfx="pop"><Sarah x={0} y={0} s={1} pose="hold" holding="bread" blinkDelay={0.9} /></Tap>
    </Tent>
    <Tap say="Here is some cool milk!" sfx="good">
      <Person x={392} y={424} s={0.98} look={ABRAHAM} pose="hold"><Jug x={0} y={-46} s={0.9} /></Person>
    </Tap>
  </Scene>
)

// 10. "One visitor said, "Next year, Sarah will have a baby boy!" Sarah was listening at the tent door.
// She laughed and said, "Me? I am too old to have a baby!" But nothing is too hard for God."
const Page10 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Picnic>
      <Sitting x={492} y={414} s={0.86} look={VISITORS[0]} holding="bread" blinkDelay={0.3} />
      <Tap say="Next year, Sarah will have a baby boy!" sfx="ding">
        <Sitting x={598} y={410} s={0.86} look={VISITORS[1]} pose="point" facing="left" blinkDelay={1.4} />
      </Tap>
      <Sitting x={704} y={416} s={0.86} look={VISITORS[2]} holding="bread" blinkDelay={2.1} />
      <BreadPlate x={548} y={426} s={0.8} />
      <Jug x={652} y={432} s={0.8} />
    </Picnic>
    <Tent x={168} y={404} s={0.78}>
      <Tap say="Ha, ha, ha! A baby? Me? I am too old!" sfx="pop">
        <Laughing><Sarah x={0} y={0} s={1} pose="hold" blinkDelay={0.9}><LaughFace /></Sarah></Laughing>
      </Tap>
    </Tent>
    <LaughMarks x={168} y={404 - 114 * 0.78} s={0.85} />
    <Tap say="Nothing is too hard for God!" sfx="good">
      <Person x={392} y={424} s={0.98} look={ABRAHAM} pose="arms-up" />
    </Tap>
  </Scene>
)

// 11. "And God kept His promise! The next year, Sarah had a baby boy. They named him Isaac. Isaac means
// laughter! Sarah laughed for joy and said, "God has made me laugh!""
const Page11 = () => (
  <Scene sky="dawn" ground="hills">
    <Tent x={150} y={372} s={0.66} />
    <Tap say="God always keeps His promises!" sfx="sparkle">
      <Heart x={330} y={196} s={1.1} />
      <Heart x={436} y={150} s={1.4} d={0.6} />
      <Heart x={540} y={200} s={1} d={1.2} />
      <Sparkles spots={[[290, 130, 8], [600, 140, 9], [380, 90, 6], [500, 80, 7]]} />
    </Tap>
    <Tap say="God has made me laugh!" sfx="good">
      <Laughing><Sarah x={380} y={424} s={1.08} pose="hold" blinkDelay={0.5}><LaughFace /></Sarah></Laughing>
    </Tap>
    <Tap say="Hee, hee, hee!" sfx="pop">
      <g transform={`translate(380 424) scale(1.08)`}><Isaac awake /></g>
    </Tap>
    <Tap say="God kept His promise!" sfx="good">
      <Laughing><Person x={492} y={422} s={1.08} look={ABRAHAM} pose="arms-up"><LaughFace beard /></Person></Laughing>
    </Tap>
    <Sheep x={640} y={428} s={0.72} facing="left" />
    <Sheep x={700} y={436} s={0.44} facing="left" />
    <Camel x={730} y={392} s={0.42} facing="left" resting blinkDelay={1.1} />
  </Scene>
)

// 12. "Abraham's family grew and grew, until it was like the stars in the sky! God always keeps His
// promises. And God's family has room for you, too!" Abraham's family down the years fills the hills,
// with Abraham, Sarah and baby Isaac in front, and the child playing (usePlayer) right there with them.
const Page12 = () => {
  const me = usePlayer()
  return (
    <Scene sky="night" ground="none" stars={false}>
      <StarrySky seed={23} bottom={258} />
      <Tap say="Twinkle, twinkle! Too many to count!" sfx="sparkle">
        <BrightStar x={120} y={70} r={15} />
        <BrightStar x={400} y={50} r={17} d={0.4} />
        <BrightStar x={690} y={86} r={14} d={0.8} />
      </Tap>
      <path d="M0 302 Q180 272 380 298 Q580 264 800 294 L800 450 L0 450 Z" fill="#3e5e86" />
      <path d="M0 352 Q220 324 440 350 T800 342 L800 450 L0 450 Z" fill="#35577a" />
      <path d="M0 398 Q240 378 480 396 T800 390 L800 450 L0 450 Z" fill="#2f4f70" />
      {/* (each row stands on its own hill, above the next one's top, so they can all be drawn after the hills) */}
      <Tap say="Hello! We are all in Abraham's big family!" sfx="good">
        <FamilyRow y={302} s={0.27} xs={[236, 301, 364, 426, 489, 551, 614, 662, 706, 744, 788]} seed={1} />
        {/* (no one just behind the child in front, whose arms reach up across this row) */}
        <FamilyRow y={352} s={0.38} xs={[270, 332, 395, 457, 520, 582, 770]} seed={20} />
        <FamilyRow y={404} s={0.5} xs={[300, 426, 551]} seed={40} />
      </Tap>
      <Tap say="God always keeps His promises!" sfx="good">
        <Abraham x={86} y={432} s={0.9} />
        <Sarah x={176} y={436} s={0.86} pose="hold" blinkDelay={1.2}><Isaac awake /></Sarah>
      </Tap>
      <Tap say="I am in God's family, too!" sfx="sparkle">
        <Person x={680} y={440} s={1.25} look={me.look} pose="arms-up" blinkDelay={0.6} />
      </Tap>
    </Scene>
  )
}

export const ABRAHAM_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
