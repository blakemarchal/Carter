// Jonah and the Big Fish: one illustration per story page, both parts in order (see data/jonah.ts for
// the words): pages 1 to 5 are part one, pages 6 to 11 part two. God's voice and care are shown as
// light (Glow, beams, Sparkles), never as a person.
// Local props worth reusing: City (Nineveh), Ship (faces either way, crew aboard), ShipHold (the same
// ship with its side cut away, to see inside), GulpFish (the big fish with its mouth open, something
// inside), Tummy (a window into the big fish), Beam (a shaft of light), Gull, Drops, Heart, Seaweed,
// Bubbles, Starfish, Jar, Sack, HangingLamp, Ladder, and SleepingJonah with SleepyEyes.
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { ink, lighten, useShade } from '../kit'
import { Person, PEOPLE, type Look } from '../people'
import { usePlayer } from './player'
import { BigFish, Cloud, Emoji, Fish, Glow, Moon, Palm, Rays, Scene, Sea, Sparkles, Sun, Tap } from './kit'

// ---------- Local characters ----------

const KING: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', beard: 'long', beardColor: '#5a3a24', robe: '#c0504d', sash: '#ffd34d', crown: true }
const WOMAN: Look = { skin: '#8d5a3b', hair: 'covered', hairColor: '#3b2a20', wrap: '#f0a860', robe: '#e8c06a', sash: '#c0504d' }
// A townsman in green with a white head-wrap, so nobody mistakes him for Jonah (blue robe, gold sash).
const MAN: Look = { skin: '#c68b5e', hair: 'covered', hairColor: '#2b2020', wrap: '#f5f0e6', beard: 'short', beardColor: '#2b2020', robe: '#6b8f5a', sash: '#c0504d' }
const GIRL: Look = { skin: '#c68b5e', hair: 'pigtails', hairColor: '#3b2a20', robe: '#ff9f80', sash: '#fff3c9', build: 'child' }
/** The second sailor (pages three and four): a blue head-wrap and a brown robe. */
const SAILOR2: Look = { ...PEOPLE.sailor, wrap: '#5fb7ff', robe: '#a07a5a' }

/** The child playing (God gives you second chances, too), drawn from their profile. */
const Kid = ({ x, y, s }: { x: number; y: number; s: number }) => <Person x={x} y={y} s={s} look={usePlayer().look} pose="arms-up" />

// ---------- Local props ----------

/** The great city of Nineveh: a wall with a gate, towers and lots of houses. Origin at the bottom center. */
function City({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const houses: [number, number, number, number, string][] = [
    [-125, -112, 48, 52, '#f2e2c0'], [-72, -134, 44, 74, '#efd2a0'], [-20, -158, 40, 98, '#f6e6c6'],
    [28, -126, 50, 66, '#efd2a0'], [84, -110, 46, 50, '#f2e2c0'],
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {houses.map(([hx, hy, w, h, c], i) => (
        <g key={i}>
          <rect x={hx} y={hy} width={w} height={h} fill={c} stroke="#c9a46a" strokeWidth={3} />
          <rect x={hx + w / 2 - 6} y={hy + 12} width={12} height={12} rx={2} fill="#8a5a2e" />
        </g>
      ))}
      <path d="M-20 -158 A20 20 0 0 1 20 -158 Z" fill="#7cb0e0" stroke="#4f86b8" strokeWidth={3} />
      <path d="M-72 -134 A22 18 0 0 1 -28 -134 Z" fill="#e58a6a" stroke="#b8664a" strokeWidth={3} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={d * 160 - 22} y={-104} width={44} height={104} fill="#e3c48a" stroke="#b8945a" strokeWidth={3} />
          {[-22, -7, 8].map((cx) => <rect key={cx} x={d * 160 + cx} y={-116} width={14} height={14} fill="#e3c48a" stroke="#b8945a" strokeWidth={3} />)}
          <rect x={d * 160 - 6} y={-80} width={12} height={18} rx={6} fill="#8a5a2e" />
          <path d={`M${d * 160} -116 L${d * 160} -146 L${d * 160 + 24} -138 L${d * 160} -130`} fill="#5fb7ff" stroke="#7a5233" strokeWidth={3} strokeLinejoin="round" />
        </g>
      ))}
      <rect x={-140} y={-60} width={280} height={60} fill="#ecd29a" stroke="#b8945a" strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-136 + i * 23} y={-72} width={13} height={13} fill="#ecd29a" stroke="#b8945a" strokeWidth={3} />)}
      <path d="M-24 0 L-24 -30 A24 24 0 0 1 24 -30 L24 0 Z" fill="#8a5a2e" stroke="#6b4422" strokeWidth={3} />
      <path d="M-140 -36 L140 -36" stroke="#d9b67a" strokeWidth={3} />
    </g>
  )
}

/** Jonah's ship: a big wooden boat with a striped square sail, sailing right (or `facing="left"`). Crew
 *  (children, in ship coordinates, so they turn with it) stand on the deck behind the hull, feet near
 *  y = 10. Rocks gently. */
function Ship({ x, y, s = 1, tilt = 0, facing = 'right', children }: {
  x: number; y: number; s?: number; tilt?: number; facing?: 'left' | 'right'; children?: ReactNode
}) {
  return (
    <g className="sc-rock">
      <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${facing === 'left' ? -s : s} ${s})`}>
        <path d="M-10 -20 L-10 -240" stroke="#7a5233" strokeWidth={8} strokeLinecap="round" />
        <path d="M-90 -222 L70 -222" stroke="#7a5233" strokeWidth={6} strokeLinecap="round" />
        <path d="M-84 -218 Q-10 -206 64 -218 L74 -96 Q-10 -78 -94 -96 Z" fill="#fff7e8" stroke="#d9c6a6" strokeWidth={3} strokeLinejoin="round" />
        <path d="M-58 -214 L-62 -88 M-10 -210 L-10 -84 M38 -214 L42 -88" stroke="#e06a5a" strokeWidth={14} opacity={0.85} />
        <path d="M-10 -240 L18 -232 L-10 -224 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} />
        {children}
        <path d="M-180 -40 L176 -40 Q168 10 120 30 L-130 30 Q-170 10 -180 -40 Z" fill="#c98448" stroke="#8a5428" strokeWidth={4} strokeLinejoin="round" />
        <path d="M176 -40 Q196 -62 186 -88 Q178 -96 172 -86" stroke="#8a5428" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-180 -40 Q-200 -58 -194 -76" stroke="#8a5428" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-172 -16 L168 -16 M-150 8 L148 8" stroke="#8a5428" strokeWidth={2.5} />
        {[-110, -40, 30, 100].map((cx) => <circle key={cx} cx={cx} cy={-28} r={7} fill="#ffd34d" stroke="#c99a20" strokeWidth={2} />)}
      </g>
    </g>
  )
}

/**
 * Jonah's ship (Ship's striped sail, yellow shields and curled ends) with the near side of its hull cut
 * away, to show the hold under the deck. (x, y) = the middle of the deck. `crew` (ship coordinates)
 * stand behind the rail, feet near y = 4; `hold` is drawn inside the hull, clipped to it, on a floor at
 * y = 120. Rocks gently.
 */
function ShipHold({ x, y, s = 1, crew, hold }: { x: number; y: number; s?: number; crew?: ReactNode; hold?: ReactNode }) {
  const id = `hd${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const inner = 'M-262 16 L268 16 Q262 92 188 132 L-180 132 Q-256 92 -262 16 Z'
  return (
    <g className="sc-rock">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <defs><clipPath id={id}><path d={inner} /></clipPath></defs>
        {/* mast, yard, sail and flag */}
        <path d="M20 4 L20 -176" stroke="#7a5233" strokeWidth={8} strokeLinecap="round" />
        <path d="M-66 -160 L106 -160" stroke="#7a5233" strokeWidth={6} strokeLinecap="round" />
        <path d="M-60 -156 Q20 -144 100 -156 L110 -56 Q20 -40 -70 -56 Z" fill="#fff7e8" stroke="#d9c6a6" strokeWidth={3} strokeLinejoin="round" />
        <path d="M-34 -152 L-38 -50 M20 -148 L20 -44 M74 -152 L78 -50" stroke="#e06a5a" strokeWidth={14} opacity={0.85} />
        <path d="M20 -176 L48 -168 L20 -160 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} />
        {crew}
        {/* the hull: the rail and deck along the top, the hold below */}
        <path d="M-286 -18 L292 -18 Q286 98 196 150 L-188 150 Q-282 98 -286 -18 Z" fill="#c98448" stroke="#8a5428" strokeWidth={4} strokeLinejoin="round" />
        <path d="M292 -18 Q314 -42 304 -70 Q296 -78 290 -68" stroke="#8a5428" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-286 -18 Q-306 -38 -300 -58" stroke="#8a5428" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-282 2 L288 2" stroke="#8a5428" strokeWidth={2.5} />
        {[-210, -130, -50, 70, 150, 230].map((cx) => <circle key={cx} cx={cx} cy={-8} r={6.5} fill="#ffd34d" stroke="#c99a20" strokeWidth={2} />)}
        <path d={inner} fill="#8f5f36" />
        <g clipPath={`url(#${id})`}>
          {[38, 60, 82, 104].map((ly) => <path key={ly} d={`M-270 ${ly} L280 ${ly}`} stroke="#7d5130" strokeWidth={2} />)}
          {[-200, -120, -40, 40, 120, 200].map((rx) => <path key={rx} d={`M${rx} 16 Q${rx * 0.97} 80 ${rx * 0.8} 132`} stroke="#6b4422" strokeWidth={8} strokeLinecap="round" fill="none" />)}
          <rect x={-270} y={120} width={550} height={20} fill="#a8774a" />
          <path d="M-270 120 L280 120" stroke="#7a5233" strokeWidth={2.5} />
          {hold}
        </g>
        <path d={inner} fill="none" stroke="#6f4422" strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  )
}

/** A clay jar of the ship's cargo: a round belly, a narrow neck with a lip, two little handles. (x, y) = its bottom. */
const Jar = ({ x, y, s = 1, color = '#d98a5a' }: { x: number; y: number; s?: number; color?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-8 -40 Q-8 -36 -15 -32 Q-24 -24 -20 -10 Q-15 0 0 0 Q15 0 20 -10 Q24 -24 15 -32 Q8 -36 8 -40 Z" fill={color} stroke={ink(color)} strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M-8 -36 Q-18 -38 -15 -26 M8 -36 Q18 -38 15 -26" stroke={ink(color)} strokeWidth={3} fill="none" strokeLinecap="round" />
    <rect x={-10} y={-46} width={20} height={7} rx={3} fill={color} stroke={ink(color)} strokeWidth={2.5} />
    <path d="M-15 -18 Q0 -12 15 -18" stroke={lighten(color, 0.35)} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
)

/** A sack of grain, tied at the top. (x, y) = its bottom. */
const Sack = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22 0 Q-30 -22 -16 -40 Q-10 -46 -6 -46 L6 -46 Q10 -46 16 -40 Q30 -22 22 0 Z" fill="#e6d2a4" stroke="#b39a68" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M-7 -46 L-11 -56 Q0 -52 11 -56 L7 -46" fill="#e6d2a4" stroke="#b39a68" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M-8 -46 L8 -46" stroke="#a0703f" strokeWidth={3.5} strokeLinecap="round" />
  </g>
)

/** A little clay oil lamp hanging by three cords, its flame lit. (x, y) = where it hangs from. */
const HangingLamp = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 L-13 30 M0 0 L0 28 M0 0 L13 30" stroke="#4a3020" strokeWidth={1.6} fill="none" />
    <path d="M-17 30 L17 30 Q14 44 0 45 Q-14 44 -17 30 Z" fill="#c97a4a" stroke="#8a4f2a" strokeWidth={2} strokeLinejoin="round" />
    <path d="M16 31 L24 27" stroke="#8a4f2a" strokeWidth={3.5} strokeLinecap="round" />
    <g className="pa-twinkle"><path d="M25 25 Q31 15 25 6 Q19 15 25 25 Z" fill="#ffb347" stroke="#ff8a3d" strokeWidth={1.2} /></g>
  </g>
)

/** A wooden ladder, `h` tall. (x, y) = the top of its left rail. */
const Ladder = ({ x, y, h }: { x: number; y: number; h: number }) => (
  <g>
    <path d={`M${x} ${y} L${x} ${y + h} M${x + 26} ${y} L${x + 26} ${y + h}`} stroke="#c98a52" strokeWidth={6} strokeLinecap="round" />
    {Array.from({ length: Math.floor(h / 20) }, (_, i) => <path key={i} d={`M${x} ${y + 14 + i * 20} L${x + 26} ${y + 14 + i * 20}`} stroke="#b0703a" strokeWidth={4} strokeLinecap="round" />)}
  </g>
)

/** Closes the eyes of every Person inside a `jn-sleepy` group (their blink, held shut). Put it on the page once. */
const SleepyEyes = () => <style>{'.jn-sleepy .pa-blink{animation:none!important;transform:scaleY(.14)!important;transform-box:fill-box;transform-origin:center}'}</style>

/**
 * Jonah asleep on a mat, his head on a pillow and his blanket pulled up under his beard, his feet poking
 * out at the end (eyes shut: the page needs <SleepyEyes />). (x, y) = the floor under the pillow; he lies
 * toward the right, about 150 long at s = 1.
 */
function SleepingJonah({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const clip = `sj${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const blanket = useShade('#f2b84b', 0.3, 0.15)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{blanket.def}<clipPath id={clip}><rect x={-60} y={-90} width={130} height={84} /></clipPath></defs>
      <rect x={-30} y={-6} width={160} height={7} rx={3} fill="#d9b77a" stroke="#b08a4a" strokeWidth={2} />
      <ellipse cx={0} cy={-16} rx={27} ry={12} fill="#f4ead2" stroke="#c9b48a" strokeWidth={2.5} />
      <g clipPath={`url(#${clip})`}>
        <g className="jn-sleepy">
          <g transform="rotate(-16 6 -30)"><Person x={6} y={59} s={0.78} look={PEOPLE.jonah} /></g>
        </g>
      </g>
      <path d="M-16 -3 Q-18 -9 -6 -9 L14 -9 Q30 -12 40 -20 Q56 -27 72 -23 Q82 -21 90 -26 Q102 -31 109 -21 Q114 -12 112 -3 Z" fill={blanket.fill} stroke={ink('#f2b84b')} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M40 -15 Q56 -19 72 -15 M88 -19 Q97 -23 104 -17" stroke={lighten('#f2b84b', 0.45)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <ellipse cx={117} cy={-14} rx={4.5} ry={8} fill="#7a5233" transform="rotate(14 117 -14)" />
      <ellipse cx={124} cy={-11} rx={4.5} ry={8} fill="#7a5233" stroke="#5a3a20" strokeWidth={1} transform="rotate(14 124 -11)" />
    </g>
  )
}

/** A splash: a pointy crown of water with droplets flying up and out. */
function Splash({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={58} ry={9} fill="none" stroke="#fff" strokeWidth={3} opacity={0.8} />
      <path d="M-50 4 Q-40 -6 -38 -30 Q-30 -10 -20 -8 Q-16 -36 -6 -56 Q2 -30 8 -10 Q18 -14 26 -42 Q30 -12 50 4 Z" fill="#9bd8ff" stroke="#ffffff" strokeWidth={3.5} strokeLinejoin="round" />
      <g className="sc-float">
        {[[-44, -50, -30], [-16, -80, -10], [18, -76, 12], [44, -54, 32]].map(([cx, cy, a], i) => (
          <path key={i} d={`M${cx} ${cy - 9} Q${cx + 7} ${cy + 2} ${cx} ${cy + 5} Q${cx - 7} ${cy + 2} ${cx} ${cy - 9} Z`} transform={`rotate(${a} ${cx} ${cy})`} fill="#9bd8ff" stroke="#ffffff" strokeWidth={2.5} />
        ))}
      </g>
    </g>
  )
}

/** Water drops flying off something wet: [x, y, tilt in degrees]. */
const Drops = ({ spots }: { spots: [number, number, number][] }) => (
  <g className="sc-float">
    {spots.map(([cx, cy, a], i) => (
      <path key={i} d={`M${cx} ${cy - 9} Q${cx + 7} ${cy + 2} ${cx} ${cy + 5} Q${cx - 7} ${cy + 2} ${cx} ${cy - 9} Z`} transform={`rotate(${a} ${cx} ${cy})`} fill="#9bd8ff" stroke="#3f96d8" strokeWidth={2} />
    ))}
  </g>
)

/** A few rising bubbles. */
export const Bubbles = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" fillOpacity={0.25} stroke="#e6f6ff" strokeWidth={2.5}>
      <circle cx={0} cy={0} r={5} /><circle cx={8} cy={-16} r={7} /><circle cx={2} cy={-36} r={9} />
    </g>
  </g>
)

/** Wavy seaweed that sways. */
export const Seaweed = ({ x, y, s = 1, color = '#3fb36b' }: { x: number; y: number; s?: number; color?: string }) => (
  <g className="sc-sway">
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth={9} fill="none" strokeLinecap="round">
      <path d="M0 0 Q-14 -24 0 -48 Q14 -72 0 -96" />
      <path d="M16 0 Q4 -20 16 -40 Q28 -60 18 -74" strokeWidth={7} />
    </g>
  </g>
)

/** A little starfish with five round arms, resting on the sand. (x, y) = its middle. */
export function Starfish({ x, y, s = 1, color = '#ff9f6b' }: { x: number; y: number; s?: number; color?: string }) {
  const tips = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 7.5 : 18
    return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`
  })
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`${tips.join(' ')} Z`} fill={color} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
      {[[0, -8], [7.6, -2.5], [4.7, 6.5], [-4.7, 6.5], [-7.6, -2.5]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={1.6} fill={lighten(color, 0.5)} />)}
    </g>
  )
}

/** A curl of wind (swirls only: the wind is never drawn with a face). */
const Wind = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9}>
    <path d="M0 0 Q60 -14 120 0 Q150 8 146 -12 Q140 -28 124 -18" />
    <path d="M20 26 Q80 16 150 28" />
  </g>
)

/** A shaft of God's light shining down from above, fading as it goes (`from` / `to`: its opacity). */
function Beam({ top, bottom, y0 = -10, y1 = 450, from = 0.9, to = 0.15 }: {
  top: [number, number]; bottom: [number, number]; y0?: number; y1?: number; from?: number; to?: number
}) {
  const id = `bm${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6b0" stopOpacity={from} /><stop offset="1" stopColor="#fff6b0" stopOpacity={to} /></linearGradient>
      </defs>
      <path d={`M${top[0]} ${y0} L${top[1]} ${y0} L${bottom[1]} ${y1} L${bottom[0]} ${y1} Z`} fill={`url(#${id})`} />
    </g>
  )
}

/** A seagull gliding far off: a white "m" of wings. (A see-through circle makes it easy to tap.) */
const Gull = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={0} cy={-4} r={30} fill="transparent" />
      <path d="M-28 4 Q-15 -16 0 0 Q15 -16 28 4" stroke="#8796ad" strokeWidth={8} />
      <path d="M-28 4 Q-15 -16 0 0 Q15 -16 28 4" stroke="#ffffff" strokeWidth={4} />
    </g>
  </g>
)

/** A soft, shiny heart (God's love), bobbing gently. */
function Heart({ x, y, s = 1, color = '#ffd34d' }: { x: number; y: number; s?: number; color?: string }) {
  const shade = useShade(color, 0.35, 0.15)
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <defs>{shade.def}</defs>
        <path d="M0 20 C-30 0 -30 -26 -14 -28 C-6 -29 -1 -22 0 -16 C1 -22 6 -29 14 -28 C30 -26 30 0 0 20 Z" fill={shade.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={-13} cy={-16} rx={4} ry={6.5} fill="#ffffff" opacity={0.65} transform="rotate(-35 -13 -16)" />
      </g>
    </g>
  )
}

type Pt = [number, number]
/** The big fish's open mouth: upper lip tip, mouth corner, lower lip tip, and the curves between them. */
const JAWS: Record<'wide' | 'open', { u: Pt; h: Pt; l: Pt; roof: Pt; floor: Pt; front: Pt; tongue: [number, number, number] }> = {
  wide: { u: [-165, -50], h: [-50, 40], l: [-152, 62], roof: [-95, -15], floor: [-101, 64], front: [-128, 6], tongue: [-106, 58, -12] },
  open: { u: [-160, -32], h: [-62, 22], l: [-150, 44], roof: [-100, -14], floor: [-106, 46], front: [-133, 6], tongue: [-110, 42, -14] },
}

/**
 * The big fish (the same friendly whale as kit's BigFish, facing left, origin in its middle) with its
 * mouth open: `wide` enough to swallow Jonah, or a little less once it has spat him out. `children`
 * (scene coordinates) sit inside its mouth: in front of the dark throat, behind the jaws. `spout` only
 * when it's at the surface. Floats like BigFish.
 */
function GulpFish({ x, y, s = 1, wide, spout, children }: { x: number; y: number; s?: number; wide?: boolean; spout?: boolean; children?: ReactNode }) {
  const skin = useShade('#5f8fd0', 0.3, 0.2)
  const line = ink('#5f8fd0')
  const j = JAWS[wide ? 'wide' : 'open']
  const p = (q: number[]) => `${q[0]} ${q[1]}`
  const body = `M${p(j.u)} Q-152 -100 0 -100 Q150 -100 160 -10 Q150 70 0 72 Q-120 74 ${p(j.l)} Q${p(j.floor)} ${p(j.h)} Q${p(j.roof)} ${p(j.u)} Z`
  const mouth = `M${p(j.u)} Q${p(j.roof)} ${p(j.h)} Q${p(j.floor)} ${p(j.l)} Q${p(j.front)} ${p(j.u)} Z`
  const at = `translate(${x} ${y}) scale(${s})`
  const [tx, ty, ta] = j.tongue
  return (
    <g className="sc-float">
      <g transform={at}>
        <defs>{skin.def}</defs>
        <path className="pa-tail" style={{ '--o': '0% 50%' } as CSSProperties} d="M150 -20 Q190 -70 210 -60 Q196 -20 210 20 Q190 30 150 0 Z" fill={skin.fill} stroke={line} strokeWidth={4} />
        <path d={mouth} fill="#24467a" />
        <ellipse cx={tx} cy={ty} rx={34} ry={10} fill="#ff8fa8" transform={`rotate(${ta} ${tx} ${ty})`} />
      </g>
      {children}
      <g transform={at}>
        <path d={body} fill={skin.fill} stroke={line} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M${j.l[0] + 4} ${j.l[1] + 4} Q-60 74 120 30 Q60 72 0 72 Q-118 74 ${j.l[0] + 4} ${j.l[1] + 4} Z`} fill="#cfe4ff" />
        <circle cx={-80} cy={-44} r={10} fill="#2b2140" /><circle cx={-83} cy={-48} r={3.5} fill="#fff" />
        <ellipse cx={-104} cy={-30} rx={10} ry={6} fill="#ff7fb0" opacity={0.5} />
        {spout && <path d="M-30 -100 Q-36 -130 -50 -140 M-30 -100 Q-24 -132 -10 -142" stroke="#bfe4ff" strokeWidth={6} fill="none" strokeLinecap="round" className="sc-spout" />}
      </g>
    </g>
  )
}

/** A window into the big fish's tummy: a cozy glowing room where Jonah prays. Floats with the fish. */
export function Tummy({ x, y, r = 70, children }: { x: number; y: number; r?: number; children?: ReactNode }) {
  const id = `tm${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g className="sc-float">
      <defs>
        <radialGradient id={id} cx="50%" cy="45%" r="60%"><stop offset="0" stopColor="#fff6c9" /><stop offset="0.7" stopColor="#ffd59a" /><stop offset="1" stopColor="#ffb08a" /></radialGradient>
        <clipPath id={`c${id}`}><circle cx={x} cy={y} r={r} /></clipPath>
      </defs>
      <circle cx={x} cy={y} r={r + 7} fill="#3f6fb0" />
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      <g clipPath={`url(#c${id})`}>{children}</g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#ff9fb8" strokeWidth={5} />
    </g>
  )
}

/** Jonah in the water up to his chest (waterline at y), splashing between two splash crowns. */
function InSea({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const cid = `cl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs><clipPath id={cid}><rect x={x - 200} y={y - 300} width={400} height={300} /></clipPath></defs>
      <g clipPath={`url(#${cid})`}>
        <Person x={x} y={y + 66 * s} s={s} look={PEOPLE.jonah} pose="arms-up" facing="left" />
      </g>
      <ellipse cx={x} cy={y} rx={84 * s} ry={12 * s} fill="none" stroke="#fff" strokeWidth={4} opacity={0.85} />
      <Splash x={x - 80 * s} y={y + 2} s={0.75 * s} />
      <Splash x={x + 82 * s} y={y + 2} s={0.7 * s} />
    </g>
  )
}

// ---------- Part one: Jonah runs away (pages 1 to 5) ----------

// 1. "God said to Jonah, go to the big city of Nineveh. Tell the people to stop doing wrong things and come back to Me."
const Page1 = () => (
  <Scene sky="day" ground="hills">
    <Beam top={[170, 330]} bottom={[100, 380]} />
    <Glow x={250} y={40} r={190} />
    {/* the road to Nineveh, running into its gate */}
    <path d="M300 410 Q440 392 518 360 Q558 344 565 334" stroke="#f6e6c6" strokeWidth={14} fill="none" strokeLinecap="round" />
    <Tap say="Nineveh was a big, big city." sfx="ding"><City x={565} y={330} s={0.78} /></Tap>
    <Cloud x={560} y={150} s={0.7} grey />
    <Tap say="Who, me? Go all the way to Nineveh?"><Person x={240} y={412} s={1.35} look={PEOPLE.jonah} /></Tap>
    <Sparkles spots={[[190, 120, 9], [310, 160, 7], [250, 90, 6], [170, 230, 6], [330, 260, 8]]} color="#ffd34d" />
  </Scene>
)

// 2. "But Jonah did not want to go! He ran the other way and got on a boat, sailing far, far away."
// Nineveh stays on the right, where it was on page 1, and the ship sails off the other way.
const Page2 = () => (
  <Scene sky="day" ground="none" sun>
    <Sea y={285} />
    <path d="M800 296 Q770 268 690 270 Q620 272 580 296 Z" fill="#cfe3a8" stroke="#a8c47a" strokeWidth={3} />
    <City x={700} y={286} s={0.26} />
    <Tap say="Squawk!"><Gull x={150} y={178} /><Gull x={222} y={146} s={0.75} /></Tap>
    <Ship x={340} y={350} s={0.8} facing="left">
      <Tap say="Ahoy! Off we sail!"><Person x={-110} y={10} s={0.95} look={PEOPLE.sailor} pose="wave" facing="left" blinkDelay={1.3} /></Tap>
      <Tap say="I'm going far, far away!"><Person x={95} y={10} s={1} look={PEOPLE.jonah} /></Tap>
    </Ship>
    {[[510, 372], [550, 392], [520, 410]].map(([x, y], i) => <path key={i} className="sc-wave" d={`M${x} ${y} q24 -8 48 0`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />)}
  </Scene>
)

// 3. "Jonah went down inside the boat. He lay down and fell fast asleep."
// The ship from page two with its side cut away: down in the hold Jonah sleeps on a mat (eyes shut,
// tucked in) by a little lamp, among jars and sacks, with a ladder up to the deck, where the two sailors
// from page four sail on. Grey clouds are coming in the evening sky: the storm is next.
const Page3 = () => (
  <Scene sky="dusk" ground="none">
    <SleepyEyes />
    <Cloud x={92} y={84} s={1.1} grey />
    <Cloud x={262} y={50} s={0.85} grey slow />
    <Sun x={736} y={300} s={0.7} />
    <Sea y={300} />
    <ShipHold x={400} y={192}
      crew={<>
        <Tap say="Is Jonah still asleep?"><Person x={-196} y={4} s={0.86} look={PEOPLE.sailor} blinkDelay={1.3} /></Tap>
        <Tap say="Look at those grey clouds!"><Person x={204} y={4} s={0.86} look={SAILOR2} pose="point" facing="left" blinkDelay={0.5} /></Tap>
      </>}
      hold={<>
        <Glow x={-62} y={70} r={130} color="#ffd98a" />
        <HangingLamp x={-62} y={16} />
        <Jar x={14} y={120} s={0.95} />
        <Jar x={46} y={120} s={0.85} color="#c9744a" />
        <Jar x={78} y={120} s={0.95} />
        <Ladder x={104} y={16} h={104} />
        <Sack x={162} y={120} />
        <Tap say="Squeak!"><Emoji e="🐭" x={162} y={50} size={30} /></Tap>
        <Tap say="Snore! Snore!"><SleepingJonah x={-176} y={120} s={1.25} /></Tap>
        <Emoji e="💤" x={-110} y={40} size={40} bob />
      </>}
    />
    {[[86, 336], [120, 362], [700, 330], [664, 358]].map(([x, y], i) => <path key={i} className="sc-wave" d={`M${x} ${y} q20 -8 40 0`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />)}
  </Scene>
)

// 4. "God sent a big wind, and the boat rocked up and down. Jonah told the sailors, this storm is my fault.
//    Put me into the sea. So they did. Splash! And the sea was calm again."
// The wind is only swirls; God's light breaks through the clouds onto Jonah as the storm ends.
const Page4 = () => (
  <Scene sky="storm" ground="none" rain>
    <Cloud x={140} y={60} s={1.4} grey />
    <Cloud x={460} y={40} s={1.6} grey slow />
    <Cloud x={720} y={70} s={1.2} grey />
    <Sea y={290} />
    <Beam top={[580, 630]} bottom={[505, 680]} y1={400} from={0.75} to={0} />
    <Glow x={590} y={350} r={90} />
    <Tap say="Whoooosh!" sfx="whoosh">
      <Wind x={30} y={210} s={0.8} />
      <Wind x={180} y={150} s={0.9} />
      <Wind x={420} y={110} s={0.7} />
    </Tap>
    <Ship x={330} y={350} s={0.75} tilt={-9}>
      <Tap say="Thank You, God!"><Person x={-100} y={10} s={1} look={PEOPLE.sailor} pose="pray" blinkDelay={0.6} /></Tap>
      <Person x={70} y={10} s={1} look={{ ...PEOPLE.sailor, wrap: '#5fb7ff', robe: '#a07a5a' }} pose="point" blinkDelay={2} />
    </Ship>
    <Tap say="Splash! Glub, glub!" sfx="plop"><InSea x={590} y={362} s={0.9} /></Tap>
    <Sparkles spots={[[548, 220, 7], [636, 250, 6], [600, 175, 5]]} />
  </Scene>
)

// 5. "But God sent a great big fish. Gulp! The fish swallowed Jonah up, and God kept him safe inside."
// The gulp: Jonah is already in the fish's wide-open mouth, safe in God's light.
const Page5 = () => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`wa${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7cd0f8" /><stop offset="1" stopColor="#2f78c4" /></linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#wa${id})`} />
      {[[120, 60], [330, 110], [560, 50]].map(([x, w], i) => <path key={i} d={`M${x} 0 L${x + w} 0 L${x + w - 140} 450 L${x - 200} 450 Z`} fill="#ffffff" opacity={0.08} />)}
      <path className="sc-wave" d={`M-80 34 ${Array.from({ length: 12 }, () => 'q40 -12 80 0').join(' ')}`} stroke="#d6f0ff" strokeWidth={5} fill="none" opacity={0.7} />
      <path d="M0 420 Q200 398 400 416 T800 408 L800 450 L0 450 Z" fill="#f2dca0" stroke="#d9bd7a" strokeWidth={3} />
      <Seaweed x={90} y={430} />
      <Seaweed x={745} y={425} s={1.1} color="#5fc46a" />
      <Tap say="Blub, blub!" sfx="plop"><Fish x={660} y={110} s={0.7} color="#ffe14d" facing="left" /></Tap>
      {/* water rushing into the open mouth */}
      <path d="M112 214 Q152 206 186 218 M104 300 Q148 296 190 304" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
      <Tap say="Gulp!" sfx="chomp">
        <GulpFish x={450} y={240} s={1.5} wide>
          <Glow x={273} y={292} r={84} />
          <Tap say="Whoa! What a great big fish!"><Person x={273} y={331} s={0.55} look={PEOPLE.jonah} pose="arms-up" /></Tap>
          <Sparkles spots={[[244, 266, 6], [304, 270, 7], [262, 234, 5]]} />
        </GulpFish>
      </Tap>
      <Bubbles x={64} y={262} />
      <Bubbles x={120} y={372} s={0.8} />
    </Scene>
  )
}

// ---------- Part two: a second chance (pages 6 to 11) ----------

// 6. "Remember Jonah? He ran away from God, and a big fish swallowed him up! But God was still with
//    Jonah, even inside the fish."
// Down in the deep blue sea: the big fish of page seven, with a window into its tummy where Jonah waves,
// safe in God's light (a beam shines down to him from above).
const Page6 = () => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`dp${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#62c6f0" /><stop offset="1" stopColor="#23559c" /></linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#dp${id})`} />
      {[[60, 70], [290, 100], [610, 60]].map(([x, w], i) => <path key={i} d={`M${x} 0 L${x + w} 0 L${x + w - 140} 450 L${x - 200} 450 Z`} fill="#ffffff" opacity={0.07} />)}
      <path className="sc-wave" d={`M-80 28 ${Array.from({ length: 12 }, () => 'q40 -12 80 0').join(' ')}`} stroke="#d6f0ff" strokeWidth={5} fill="none" opacity={0.6} />
      <Beam top={[392, 500]} bottom={[372, 548]} y1={190} from={0.75} to={0} />
      {/* the sea floor: sand, rocks, seaweed and a starfish */}
      <path d="M0 408 Q140 390 280 404 T560 398 T800 396 L800 450 L0 450 Z" fill="#dcc58e" stroke="#bfa86e" strokeWidth={3} />
      <ellipse cx={604} cy={410} rx={44} ry={24} fill="#7f8fa3" stroke="#5f6d80" strokeWidth={3} />
      <ellipse cx={652} cy={418} rx={28} ry={16} fill="#8d9cb0" stroke="#5f6d80" strokeWidth={3} />
      <ellipse cx={176} cy={416} rx={34} ry={18} fill="#8d9cb0" stroke="#5f6d80" strokeWidth={3} />
      <Starfish x={318} y={424} />
      <Tap say="Swish, swish!" sfx="swish"><Seaweed x={70} y={428} s={1.25} /><Seaweed x={746} y={424} s={1.1} color="#5fc46a" /></Tap>
      <Tap say="Blub, blub!" sfx="plop">
        <BigFish x={410} y={240} s={1.3} spout={false} />
        <Tummy x={440} y={212} r={74}>
          <Glow x={440} y={202} r={70} color="#fffbe0" />
          <path d="M356 270 Q440 254 524 270 L524 296 L356 296 Z" fill="#f2a084" stroke="#ffd2b8" strokeWidth={3} />
          <Tap say="I'm safe! God is with me." sfx="sparkle"><Person x={440} y={266} s={0.6} look={PEOPLE.jonah} pose="wave" /></Tap>
          <Sparkles spots={[[396, 176, 6], [486, 170, 7], [480, 230, 5]]} color="#ffffff" />
        </Tummy>
      </Tap>
      <Tap say="Swim, swim!"><Fish x={124} y={148} s={0.8} color="#ffe14d" /><Fish x={166} y={190} s={0.6} color="#ff8fa8" /></Tap>
      <Fish x={736} y={108} s={0.7} color="#ffa64d" facing="left" />
      <Bubbles x={204} y={228} />
      <Bubbles x={700} y={316} s={0.7} />
    </Scene>
  )
}

// 7. "Jonah was inside the fish for three days and three nights. He prayed to God and said, thank You for saving me!"
// Three day-and-night pairs to count (tap each one), and Jonah praying in the fish's tummy.
const DAYS = ['One day and one night.', 'Two days and two nights.', 'Three days and three nights!']
const Page7 = () => (
  <Scene sky="dusk" ground="none" stars>
    {DAYS.map((say, i) => (
      <Tap key={i} say={say} sfx="ding">
        <circle cx={250 + i * 150} cy={62} r={36} fill="#fff" opacity={0.25} />
        <Sun x={233 + i * 150} y={62} s={0.28} />
        <Moon x={267 + i * 150} y={62} s={0.36} />
      </Tap>
    ))}
    <Sea y={215} />
    <Tap say="Blub, blub!" sfx="plop">
      <BigFish x={400} y={300} s={1.3} />
      <Tummy x={430} y={272} r={74}>
        <Glow x={430} y={262} r={70} color="#fffbe0" />
        <path d="M346 330 Q430 314 514 330 L514 356 L346 356 Z" fill="#f2a084" stroke="#ffd2b8" strokeWidth={3} />
        <Tap say="Thank You, God, for saving me!" sfx="sparkle"><Person x={430} y={326} s={0.6} look={PEOPLE.jonah} pose="pray" /></Tap>
        <Sparkles spots={[[386, 236, 6], [476, 230, 7], [470, 290, 5]]} color="#ffffff" />
      </Tummy>
    </Tap>
  </Scene>
)

// 8. "Then God told the fish to spit Jonah out onto the dry land. Bleh! Jonah was back on the beach."
// The fish is still big next to Jonah (it swallowed him!), and he lands with a splash of water, not on it.
const Page8 = () => (
  <Scene sky="day" ground="beach" sun>
    <Tap sfx="swish"><Palm x={130} y={378} s={1.45} /></Tap>
    <Tap say="Bleh!" sfx="plop"><GulpFish x={575} y={350} s={1} spout /></Tap>
    <path d="M420 350 Q362 200 296 402" stroke="#fff" strokeWidth={4} strokeDasharray="12 10" fill="none" strokeLinecap="round" />
    {[[403, 292, 5], [376, 270, 6], [344, 281, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#d6f0ff" stroke="#6cc0f2" strokeWidth={2} />)}
    <ellipse cx={266} cy={410} rx={50} ry={8} fill="#bfe6ff" stroke="#8fd0f5" strokeWidth={2} opacity={0.9} />
    <Tap say="Dry land! Thank You, God!"><Person x={245} y={410} s={1.05} look={PEOPLE.jonah} pose="arms-up" blinkDelay={0.8} /></Tap>
    <Drops spots={[[176, 254, -25], [316, 240, 25], [166, 304, -40], [314, 296, 35]]} />
    <Sparkles spots={[[300, 200, 7], [250, 228, 5], [196, 210, 6]]} color="#ffd34d" />
  </Scene>
)

// 9. "God said to Jonah again, go to Nineveh and tell the people what I say. And Jonah said, yes, God!
//    I will go."
// Back on dry land and in God's light again (as on page one), Jonah points the way to Nineveh, off over
// the hills, while the big fish swims away out to sea.
const Page9 = () => (
  <Scene sky="day" ground="none">
    <Sea y={296} />
    <path d="M300 297 Q390 290 470 262 Q560 236 660 246 Q740 254 800 240 L800 450 L400 450 Q330 360 300 297 Z" fill="#a8d8a0" />
    <Tap say="That's Nineveh, far away!" sfx="ding"><City x={652} y={270} s={0.36} /></Tap>
    <path d="M150 450 Q196 384 300 360 Q420 334 560 346 Q680 356 800 342 L800 450 Z" fill="#7cc46a" />
    <path d="M150 450 Q196 384 300 360 Q372 346 430 344 Q392 394 410 450 Z" fill="#f6dfa2" stroke="#e3c27a" strokeWidth={3} />
    {/* the road to Nineveh */}
    <path d="M380 424 Q480 400 548 352 Q606 304 652 272" stroke="#f6e6c6" strokeWidth={12} fill="none" strokeLinecap="round" />
    <Beam top={[230, 390]} bottom={[160, 440]} />
    <Glow x={310} y={40} r={180} />
    <Tap say="Splash! Bye bye, big fish!" sfx="plop"><BigFish x={118} y={336} s={0.44} /></Tap>
    <Tap say="Squawk!"><Gull x={196} y={170} s={0.8} /></Tap>
    <Tap say="Yes, God! I will go." sfx="sparkle"><Person x={300} y={414} s={1.3} look={PEOPLE.jonah} pose="point" blinkDelay={0.6} /></Tap>
    <Sparkles spots={[[244, 140, 8], [360, 170, 7], [304, 96, 6], [226, 250, 6], [384, 266, 8]]} color="#ffd34d" />
  </Scene>
)

// 10. "God gave Jonah a second chance, and this time he went to Nineveh. The people listened, said sorry
//    to God, and stopped doing wrong things. God forgave them, because God loves everyone!"
// The same Nineveh as page 1, with its people come out to listen to Jonah.
const Page10 = () => (
  <Scene sky="dawn" ground="hills">
    <Glow x={440} y={120} r={240} />
    <City x={440} y={312} s={0.9} />
    <Tap say="God loves you! Come back to Him!"><Person x={190} y={414} s={1.25} look={PEOPLE.jonah} pose="wave" /></Tap>
    <Tap say="We are sorry, God."><Person x={370} y={416} s={1.1} look={KING} pose="pray" facing="left" blinkDelay={1.5} /></Tap>
    <Person x={465} y={420} s={1.02} look={WOMAN} pose="pray" facing="left" blinkDelay={0.4} />
    <Person x={560} y={414} s={1.08} look={MAN} pose="arms-up" facing="left" blinkDelay={2.2} />
    <Tap say="God loves everyone!"><Person x={650} y={422} s={1.15} look={GIRL} pose="arms-up" facing="left" blinkDelay={1} /></Tap>
    <Tap sfx="sparkle">
      <Heart x={330} y={140} s={0.8} />
      <Heart x={470} y={112} s={0.95} />
      <Heart x={620} y={150} s={0.75} />
    </Tap>
    <Sparkles spots={[[440, 70, 9], [290, 100, 7], [560, 70, 8], [690, 110, 6]]} />
  </Scene>
)

// 11. "And God gives second chances to you and me, too! When we say sorry, He forgives us. God loves us
//     so much!"
// You (the child playing) and Jonah together on the beach in God's light, with hearts, and the big fish
// splashing in the sea.
const Page11 = () => (
  <Scene sky="glory" ground="beach">
    <Rays x={300} y={-60} r={540} n={16} opacity={0.4} />
    <Tap say="Blub, blub!" sfx="plop"><BigFish x={626} y={344} s={0.55} /></Tap>
    <Tap say="God loves you, too!"><Person x={150} y={416} s={1.25} look={PEOPLE.jonah} pose="wave" blinkDelay={0.8} /></Tap>
    <Tap say="Thank You, God, for second chances!" sfx="sparkle"><Kid x={298} y={424} s={1.5} /></Tap>
    <Tap say="God loves us so much!" sfx="sparkle">
      <Heart x={226} y={132} s={0.8} color="#ff8fb8" />
      <Heart x={330} y={98} s={1} />
      <Heart x={434} y={142} s={0.75} color="#ff8fb8" />
    </Tap>
    <Sparkles spots={[[222, 224, 7], [384, 204, 8], [300, 60, 6], [118, 176, 6]]} color="#ffd34d" />
  </Scene>
)

export const JONAH_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]
