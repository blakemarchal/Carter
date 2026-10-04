// Story characters: one adjustable person figure (Noah, David, Mary, a shepherd…) drawn in the
// Pal style: soft shading, gentle outlines, blinking eyes. Origin is at the feet, centered;
// an adult stands about 150 units tall at s = 1. Presets for every character (PEOPLE) follow Person.
// Then, for every island: poses (Kneel, Sitting, SittingOnRock); faces and hair drawn over a Person's own
// (Brows, BeardFrown, ShutEyes, Laughing + LaughFace, LookingUp + EyesUp, SilverHair); and Figure, which is
// Person plus feelings, a coat of many colors, hugs, kneeling and Egyptian dress (and Head, its head).
import { useId, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from './kit'
import type { KidLook } from '../lib/look'

/** `hammer`: the right arm raised with a hammer, swinging (building the ark). */
export type Pose = 'stand' | 'wave' | 'pray' | 'arms-up' | 'hold' | 'point' | 'hammer'
/** `stick`: a plain walking stick (a shepherd's `staff` has a crook). `sling-empty`: the stone has flown. */
export type Holding = 'staff' | 'stick' | 'sling' | 'sling-empty' | 'baby' | 'basket' | 'bread' | 'hammer' | 'lunch' | 'scroll'
export type Hair = 'short' | 'long' | 'curly' | 'bald' | 'covered' | 'ponytail' | 'pigtails'

export interface Look {
  skin: string
  hair: Hair
  hairColor: string
  robe: string
  sash?: string
  /** head covering color, for hair: 'covered' */
  wrap?: string
  beard?: 'short' | 'long'
  beardColor?: string
  /** child = smaller, giant = Goliath */
  build?: 'adult' | 'child' | 'giant'
  crown?: boolean
  helmet?: boolean
  wings?: boolean
  glow?: boolean
  bow?: string
}

export const SKIN = { light: '#f6d2b8', medium: '#d9a47a', tan: '#c68b5e', deep: '#8d5a3b' }

function Held({ what, x, y }: { what: Holding; x: number; y: number }) {
  switch (what) {
    case 'staff':
      // From above the head down to the ground, at the hand.
      return <path d={`M${x + 2} -146 Q${x + 12} -160 ${x + 2} -166 Q${x - 6} -162 ${x - 2} -154 M${x + 2} -146 L${x} -2`} stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
    case 'stick':
      return <path d={`M${x + 1} -150 L${x} -2`} stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
    case 'sling':
    case 'sling-empty':
      return (
        <g>
          <path d={`M${x} ${y} Q${x + 14} ${y + 26} ${x + 26} ${y + 8}`} stroke="#8a5a2e" strokeWidth={3} fill="none" />
          <ellipse cx={x + 26} cy={y + 8} rx={7} ry={4} fill="#a0703f" stroke="#6b4422" strokeWidth={1.5} />
          {what === 'sling' && <circle cx={x + 26} cy={y + 5} r={6} fill="#b8b1a6" stroke="#7d766d" strokeWidth={2} />}
        </g>
      )
    case 'hammer':
      // Held up from the hand: the handle, then a heavy head across its top.
      return <g><path d={`M${x} ${y + 4} L${x + 4} ${y - 30}`} stroke="#8a5a2e" strokeWidth={5} strokeLinecap="round" /><rect x={x - 10} y={y - 42} width={28} height={13} rx={3} fill="#8d95a8" stroke="#5d6578" strokeWidth={2} /></g>
    case 'scroll':
      return <g><rect x={x - 14} y={y - 10} width={28} height={20} rx={4} fill="#fff3d6" stroke="#c9a46a" strokeWidth={2} /><circle cx={x - 14} cy={y} r={5} fill="#c9a46a" /><circle cx={x + 14} cy={y} r={5} fill="#c9a46a" /></g>
    case 'bread':
      return <ellipse cx={x} cy={y} rx={16} ry={10} fill="#e0a75e" stroke="#a8702c" strokeWidth={2.5} />
    case 'basket':
    case 'lunch':
      return (
        <g>
          <ellipse cx={x - 6} cy={y - 8} rx={10} ry={7} fill="#e0a75e" stroke="#a8702c" strokeWidth={2} />
          <ellipse cx={x + 8} cy={y - 8} rx={10} ry={7} fill="#e0a75e" stroke="#a8702c" strokeWidth={2} />
          {what === 'lunch' && <path d={`M${x - 4} ${y - 14} q12 -10 22 0 q-10 6 -22 0Z`} fill="#8fc6e8" stroke="#5a8fb0" strokeWidth={2} />}
          <path d={`M${x - 22} ${y - 6} L${x + 22} ${y - 6} L${x + 16} ${y + 14} L${x - 16} ${y + 14} Z`} fill="#c98448" stroke="#8a5428" strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      )
    case 'baby':
      return <Baby x={x} y={y} s={0.8} />
  }
}

/** A baby wrapped in a blanket (baby Jesus, a baby brother or sister). */
export function Baby({ x, y, s = 1, blanket = '#fff7e8' }: { x: number; y: number; s?: number; blanket?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={30} ry={18} fill={blanket} stroke={ink(blanket)} strokeWidth={2.5} />
      <path d="M-28 6 Q0 20 28 6" stroke={ink(blanket)} strokeWidth={2} fill="none" />
      {/* wrapped up snug: swaddling bands */}
      <path d="M-4 -8 Q6 4 2 22 M12 -10 Q22 4 18 20" stroke={ink(blanket)} strokeWidth={2.5} fill="none" opacity={0.55} strokeLinecap="round" />
      <circle cx={-12} cy={-2} r={14} fill={SKIN.medium} stroke={ink(SKIN.medium)} strokeWidth={2} />
      <path d="M-18 -4 q3 2 6 0 M-8 -4 q3 2 6 0" stroke="#2b2140" strokeWidth={2} fill="none" strokeLinecap="round" />
      <ellipse cx={-21} cy={2} rx={3.5} ry={2.2} fill="#ff7fb0" opacity={0.5} />
      <ellipse cx={-3} cy={2} rx={3.5} ry={2.2} fill="#ff7fb0" opacity={0.5} />
    </g>
  )
}

/** Arms for each pose: [shoulder, hand] pairs for left and right (figure coordinates). */
const ARMS: Record<Pose, [[number, number], [number, number]][]> = {
  stand: [[[-20, -86], [-30, -46]], [[20, -86], [30, -46]]],
  wave: [[[-20, -86], [-30, -46]], [[20, -86], [42, -128]]],
  // (the hands are drawn last, pressed together below the chin, so a beard never hides them)
  pray: [[[-20, -86], [-6, -60]], [[20, -86], [6, -60]]],
  'arms-up': [[[-20, -86], [-42, -130]], [[20, -86], [42, -130]]],
  hold: [[[-20, -86], [-8, -60]], [[20, -86], [8, -60]]],
  point: [[[-20, -86], [-30, -46]], [[20, -86], [54, -90]]],
  hammer: [[[-20, -86], [-30, -46]], [[20, -86], [38, -124]]],
}

export function Person({ x, y, s = 1, look, pose = 'stand', holding, facing = 'right', blinkDelay = 0, children }: {
  x: number; y: number; s?: number; look: Look; pose?: Pose; holding?: Holding; facing?: 'left' | 'right'
  blinkDelay?: number; children?: ReactNode
}) {
  const build = look.build ?? 'adult'
  const scale = s * (build === 'child' ? 0.74 : build === 'giant' ? 1.55 : 1)
  const robe = useShade(look.robe, 0.3, 0.2)
  const skin = useShade(look.skin, 0.25, 0.12)
  const hair = useShade(look.hairColor, 0.25, 0.15)
  const arms = ARMS[pose]
  // Something held in front (a baby, a basket) sits between the hands; anything else is in the right
  // hand, and moves with that arm.
  const inFront = pose === 'hold' || pose === 'pray'
  const swing = pose === 'wave' ? 'pa-wing' : pose === 'hammer' ? 'pa-hammer' : undefined
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -scale : scale} ${scale})`}>
      <defs>{robe.def}{skin.def}{hair.def}</defs>
      {look.glow && <circle cx={0} cy={-90} r={95} fill="#fff6b0" opacity={0.35} className="pa-twinkle" />}
      {look.wings && [-1, 1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <g className="pa-wing" style={{ '--o': '0% 60%' } as CSSProperties}>
            <path d="M14 -92 C40 -130 78 -118 84 -96 C70 -96 70 -86 80 -76 C62 -74 58 -64 64 -54 C44 -58 26 -66 14 -76 Z" fill="#ffffff" stroke="#d8c98a" strokeWidth={3} strokeLinejoin="round" />
          </g>
        </g>
      ))}
      <g className="pa-breathe">
        {/* feet */}
        <ellipse cx={-11} cy={-4} rx={10} ry={5} fill="#7a5233" />
        <ellipse cx={11} cy={-4} rx={10} ry={5} fill="#7a5233" />
        {/* robe */}
        <path d="M-21 -92 Q0 -100 21 -92 L35 -10 Q0 -1 -35 -10 Z" fill={robe.fill} stroke={ink(look.robe)} strokeWidth={3} strokeLinejoin="round" />
        {look.sash && <path d="M-27 -54 Q0 -47 27 -54 L28 -45 Q0 -38 -28 -45 Z" fill={look.sash} stroke={ink(look.sash)} strokeWidth={2} />}
        {look.helmet && <path d="M-24 -88 Q0 -96 24 -88 L26 -60 Q0 -54 -26 -60 Z" fill="#a9b1c2" stroke="#6b7385" strokeWidth={3} />}
        {/* arms */}
        {arms.map(([[sx, sy], [hx, hy]], i) => (
          <g key={i} className={i === 1 ? swing : undefined} style={i === 1 && swing ? ({ '--o': '0% 100%' } as CSSProperties) : undefined}>
            <path d={`M${sx} ${sy} L${hx} ${hy}`} stroke={ink(look.robe)} strokeWidth={17} strokeLinecap="round" />
            <path d={`M${sx} ${sy} L${hx} ${hy}`} stroke={look.robe} strokeWidth={14} strokeLinecap="round" />
            <path d={`M${sx} ${sy} L${hx} ${hy}`} stroke={lighten(look.robe, 0.15)} strokeWidth={8} strokeLinecap="round" />
            {pose !== 'pray' && <circle cx={hx} cy={hy} r={7} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} />}
            {holding && !inFront && i === 1 && <Held what={holding} x={hx} y={hy} />}
          </g>
        ))}
        {holding && inFront && <Held what={holding} x={0} y={-62} />}
        {/* neck and head */}
        <rect x={-6} y={-100} width={12} height={10} fill={look.skin} />
        {look.hair === 'long' || look.hair === 'covered' ? (
          <path d="M-26 -112 Q-30 -82 -22 -86 L22 -86 Q30 -82 26 -112 Z" fill={look.hair === 'covered' ? look.wrap ?? '#7cb0e0' : hair.fill} stroke={ink(look.hair === 'covered' ? look.wrap ?? '#7cb0e0' : look.hairColor)} strokeWidth={2.5} />
        ) : null}
        <circle cx={0} cy={-114} r={22} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2.5} />
        <circle cx={-21} cy={-112} r={4.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />
        <circle cx={21} cy={-112} r={4.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />
        {/* face */}
        <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
          <ellipse cx={-8} cy={-114} rx={3.2} ry={4.2} fill="#2b2140" />
          <ellipse cx={8} cy={-114} rx={3.2} ry={4.2} fill="#2b2140" />
          <circle cx={-9} cy={-116} r={1.2} fill="#fff" />
          <circle cx={7} cy={-116} r={1.2} fill="#fff" />
        </g>
        <ellipse cx={-13} cy={-106} rx={4} ry={2.6} fill="#ff7fb0" opacity={0.5} />
        <ellipse cx={13} cy={-106} rx={4} ry={2.6} fill="#ff7fb0" opacity={0.5} />
        {look.beard ? (() => {
          const bc = look.beardColor ?? look.hairColor
          return (
            <g fill={bc} stroke={ink(bc)} strokeWidth={2} strokeLinejoin="round">
              {(look.hair === 'covered' || look.hair === 'bald') && <path d="M-23 -118 L-17 -104 L-13 -107 L-18 -119 Z M23 -118 L17 -104 L13 -107 L18 -119 Z" />}
              <path d={look.beard === 'long' ? 'M-18 -110 Q-20 -72 0 -66 Q20 -72 18 -110 Q10 -100 0 -101 Q-10 -100 -18 -110 Z' : 'M-17 -110 Q-16 -90 0 -88 Q16 -90 17 -110 Q10 -101 0 -102 Q-10 -101 -17 -110 Z'} />
              <path d="M-10 -103 Q-5 -108 0 -105 Q5 -108 10 -103 Q5 -101 0 -102.5 Q-5 -101 -10 -103 Z" strokeWidth={1.4} />
            </g>
          )
        })() : null}
        <path d={look.beard ? 'M-3.5 -99 Q0 -96.5 3.5 -99' : 'M-5 -106 Q0 -101 5 -106'} stroke={look.beard ? '#d0707e' : '#6b2a3a'} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        {pose === 'pray' && (
          <g>
            <path d="M-7 -49 Q-9 -64 -1 -74 L1 -74 Q9 -64 7 -49 Q0 -46 -7 -49 Z" fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} strokeLinejoin="round" />
            <path d="M0 -73 L0 -50" stroke={ink(look.skin)} strokeWidth={1.4} />
          </g>
        )}
        {/* hair / headwear */}
        {look.hair === 'covered' ? (
          <path d="M-25 -112 Q-26 -142 0 -142 Q26 -142 25 -112 Q14 -128 0 -127 Q-14 -128 -25 -112 Z" fill={look.wrap ?? '#7cb0e0'} stroke={ink(look.wrap ?? '#7cb0e0')} strokeWidth={2.5} />
        ) : look.hair === 'curly' ? (
          <g fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2}>
            {[[-16, -128], [-6, -134], [6, -134], [16, -128], [-21, -118], [21, -118]].map(([cx, cy]) => <circle key={`${cx}`} cx={cx} cy={cy} r={8} />)}
          </g>
        ) : look.hair !== 'bald' ? (
          <path d="M-23 -112 Q-25 -139 0 -139 Q25 -139 23 -112 Q14 -125 0 -123 Q-14 -125 -23 -112 Z" fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2.5} />
        ) : null}
        {look.hair === 'ponytail' && <ellipse cx={26} cy={-122} rx={9} ry={13} fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2} transform="rotate(25 26 -122)" />}
        {look.hair === 'pigtails' && [-1, 1].map((d) => <ellipse key={d} cx={d * 27} cy={-112} rx={8} ry={12} fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2} />)}
        {look.bow && <path d="M14 -136 l10 -6 l0 12 Z M14 -136 l-10 -6 l0 12 Z" fill={look.bow} stroke={ink(look.bow)} strokeWidth={1.5} />}
        {look.helmet && <path d="M-24 -122 Q-24 -149 0 -149 Q24 -149 24 -122 Z M-4 -149 Q0 -167 10 -165 Q4 -155 4 -149 Z" fill="#a9b1c2" stroke="#6b7385" strokeWidth={3} />}
        {look.crown && <path d="M-16 -134 L-16 -148 L-8 -140 L0 -152 L8 -140 L16 -148 L16 -134 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} />}
        {children}
      </g>
    </g>
  )
}

// ---------- Characters ----------
// Bible characters have medium/tan skin; hair and robes are earthy and warm.

/** Jesus, grown up: long brown hair, a short beard, a white robe and a red sash. */
const JESUS = { skin: SKIN.medium, hair: 'long', hairColor: '#5a3a24', beard: 'short', robe: '#f5f0e6', sash: '#c0504d' } satisfies Look

export const PEOPLE = {
  noah: { skin: SKIN.medium, hair: 'short', hairColor: '#e8e4dc', beard: 'long', beardColor: '#f2efe8', robe: '#9a6b45', sash: '#d9b56a' },
  noahsWife: { skin: SKIN.medium, hair: 'covered', hairColor: '#5a3a24', wrap: '#c98aa8', robe: '#b77fa0', sash: '#f0d38a' },
  david: { skin: SKIN.tan, hair: 'curly', hairColor: '#7a4a24', robe: '#7cb06a', sash: '#c98448', build: 'child' },
  goliath: { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#8d95a8', helmet: true, build: 'giant' },
  saul: { skin: SKIN.medium, hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#8a5bb0', sash: '#ffd34d', crown: true },
  /**
   * Jonah: a deep violet robe and a teal sash. (Not blue and gold, as Andrew is, out on the lake in a storm; not orange,
   * as Peter is in that boat, and as Haman and one of Daniel's jealous officials are just before Jonah's island.)
   */
  jonah: { skin: SKIN.medium, hair: 'short', hairColor: '#4a3020', beard: 'short', robe: '#663f9c', sash: '#38b0a0' },
  sailor: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e06a5a', robe: '#c9a46a', beard: 'short', beardColor: '#3b2a20' },
  jesus: JESUS,
  /** Jesus as a boy (little Jesus at Christmas, Jesus at twelve, "Jesus Grew Up"): His long hair, robe and sash, and no beard yet. */
  boyJesus: { ...JESUS, beard: undefined, build: 'child' },
  boy: { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', robe: '#e6b85a', sash: '#a0612f', build: 'child' },
  /**
   * One of Jesus' friends (with the baskets at the Loaves and Fishes, and praying in the room upstairs at Pentecost):
   * near-black hair and beard, a deep wine-red robe and a gold sash. (Not brown and green, as Joseph, Jesus' earthly
   * father, wears; and not plum, as Matthew does in that same room.)
   */
  disciple: { skin: '#a8714a', hair: 'short', hairColor: '#2b1f18', beard: 'short', robe: '#7a3040', sash: '#e8c25a' },
  // The fishermen Jesus called to follow Him (Fishers of People), who sail with Him across the lake
  /** Simon Peter, a fisherman: curly dark hair and beard, a rust-red robe and a sea-blue sash. */
  peter: { skin: SKIN.tan, hair: 'curly', hairColor: '#3b2a20', beard: 'short', beardColor: '#3b2a20', robe: '#c8643c', sash: '#5f8fc0' },
  /** Andrew, Peter's brother (he found the boy with the loaves and fishes): a blue robe and a gold sash. */
  andrew: { skin: SKIN.medium, hair: 'short', hairColor: '#7a4a24', beard: 'short', beardColor: '#7a4a24', robe: '#6f9fc0', sash: '#e0b45a' },
  /** James, a fisherman, John's big brother: a dark beard and a green robe. */
  james: { skin: SKIN.medium, hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#6b8f5a', sash: '#e8dcc0' },
  /** John, the youngest fisherman: no beard yet, a golden robe and a purple sash. */
  john: { skin: SKIN.medium, hair: 'short', hairColor: '#5a3a24', robe: '#d9a85a', sash: '#8a5bb0' },
  // More of Jesus' friends, first drawn for Easter Morning, who come to Pentecost too
  /** Mary Magdalene, one of Jesus' friends (not His mother Mary): a cream head scarf and a rose-red robe with a golden sash. */
  maryMagdalene: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#f6ead2', robe: '#cc4f72', sash: '#f0c24a' },
  /** Thomas, one of Jesus' twelve friends: a short black beard and a sea-green robe. */
  thomas: { skin: SKIN.tan, hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#4fa39a', sash: '#f0d38a' },
  /** Matthew, one of Jesus' twelve friends: a cream head cloth and a plum robe. */
  matthew: { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#f0e2c0', beard: 'short', beardColor: '#5a3a24', robe: '#9a5a8a', sash: '#e8dcc0' },
  mary: { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#5f8fd0', robe: '#bcd4f0', sash: '#f5f0e6' },
  joseph: { skin: SKIN.medium, hair: 'short', hairColor: '#4a3020', beard: 'short', robe: '#a0703f', sash: '#6b8f5a' },
  shepherd: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8dcc0', robe: '#8f7a5a', beard: 'short', beardColor: '#3b2a20', sash: '#c0504d' },
  angel: { skin: SKIN.light, hair: 'long', hairColor: '#f2d27a', robe: '#ffffff', sash: '#ffd34d', wings: true, glow: true },
  mom: { skin: SKIN.light, hair: 'long', hairColor: '#7a4a24', robe: '#c9a8ff', sash: '#ffffff' },
  dad: { skin: SKIN.light, hair: 'short', hairColor: '#5a3a24', beard: 'short', robe: '#5fb7ff', sash: '#3b6fa0' },
  // The Moses islands (scenes/moses.tsx draws Pharaoh with his headdress and collar)
  /** Moses: a grown man with a long brown beard, a cream head cloth, a brick-red robe and his shepherd's staff. */
  moses: { skin: SKIN.tan, hair: 'covered', hairColor: '#4a3020', wrap: '#f0e4c4', beard: 'long', beardColor: '#7a4a28', robe: '#b0533c', sash: '#e8c25a' },
  /** Aaron, Moses' big brother: a short dark beard, a sky-blue head cloth and a purple robe. */
  aaron: { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#a9c8ec', beard: 'short', beardColor: '#3b2a20', robe: '#6a5bb0', sash: '#f0d38a' },
  /** Miriam, Moses' big sister: a rose head scarf and a sunny robe (she plays the tambourine). */
  miriam: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8668a', robe: '#f2b33d', sash: '#2fa59a' },
  /** Pharaoh, the king of Egypt: white linen and a blue sash. Draw him with <Pharaoh>, which adds his headdress and collar. */
  pharaoh: { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1f18', wrap: '#f2c94c', robe: '#fbf6ea', sash: '#3a6fc4' },
} satisfies Record<string, Look>

// ---------- The player and their family ----------
// The child in the pictures is whoever is playing: drawn from their profile's look (skin, hair, favorite
// color). Their family is drawn to match.

/** A child's look for the pictures, from their profile. A bow goes with longer hair. */
export function kidLook(k: KidLook): Look {
  const bow = k.hair === 'ponytail' || k.hair === 'pigtails' || k.hair === 'long' ? darken(k.color, 0.12) : undefined
  return { skin: SKIN[k.skin], hair: k.hair, hairColor: k.hairColor, robe: k.color, sash: '#ffffff', bow, build: 'child' }
}

/** Mom or Dad, drawn with the child's skin tone and hair color. */
export function grownupLook(role: 'mom' | 'dad', k: KidLook): Look {
  const base = PEOPLE[role]
  return { ...base, skin: SKIN[k.skin], hairColor: role === 'dad' ? darken(k.hairColor, 0.15) : k.hairColor, beardColor: role === 'dad' ? darken(k.hairColor, 0.15) : undefined }
}

const SIBLING_COLORS = ['#ffb347', '#5fd39a', '#c9a8ff', '#ff8cc0', '#5fb7ff']

/** A brother or sister without a look of their own: the family's skin and hair, a different color. */
export function siblingLook(k: KidLook, i: number): Look {
  const hair: KidLook['hair'] = i % 2 ? 'curly' : 'short'
  return kidLook({ ...k, hair, color: SIBLING_COLORS[(SIBLING_COLORS.indexOf(k.color) + 1 + i) % SIBLING_COLORS.length] })
}

// ---------- Poses: kneeling and sitting ----------

const uid = (prefix: string, id: string) => `${prefix}${id.replace(/[^a-zA-Z0-9]/g, '')}`

/**
 * Someone kneeling, seen from the front: the Person from the knees up, their robe pooled on the floor, and the
 * soles of their feet peeking out behind. (x, y) = their knees on the floor. `hem`: a band of color on the robe.
 */
export function Kneel({ x, y, s = 1, look, pose = 'pray', facing = 'right', blinkDelay = 0, hem, children }: {
  x: number; y: number; s?: number; look: Look; pose?: Pose; facing?: 'left' | 'right'; blinkDelay?: number; hem?: string; children?: ReactNode
}) {
  const clip = uid('kn', useId())
  const k = look.build === 'child' ? 0.74 : 1
  const drop = 26 * k // (the shins, folded back out of sight)
  const w = 33 * k // the robe's half-width at the knees
  const back = facing === 'left' ? 1 : -1 // (the feet peek out on the side behind them)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={clip}><rect x={-140} y={-320} width={280} height={316} /></clipPath></defs>
      {[0, 1].map((i) => {
        const fx = back * (w + 2 - i * 8 * k), fy = (-7 - i * 3) * k
        return (
          <g key={i} transform={`rotate(${back * 28} ${fx} ${fy})`}>
            <ellipse cx={fx} cy={fy} rx={8.5 * k} ry={5.2 * k} fill="#7a5233" stroke="#4a2f1c" strokeWidth={1.5} />
            <ellipse cx={fx + back * 1.2 * k} cy={fy - 0.6 * k} rx={5.4 * k} ry={3 * k} fill="#c9946a" />
          </g>
        )
      })}
      <g clipPath={`url(#${clip})`}>
        <Person x={0} y={drop} s={1} look={look} pose={pose} facing={facing} blinkDelay={blinkDelay}>{children}</Person>
      </g>
      <path d={`M${-w + 1} ${-10 * k} Q${-w - 6 * k} ${-2 * k} ${-w + 3} ${1.5 * k} Q0 ${6 * k} ${w - 3} ${1.5 * k} Q${w + 6 * k} ${-2 * k} ${w - 1} ${-10 * k} Q0 ${-5 * k} ${-w + 1} ${-10 * k} Z`}
        fill={look.robe} stroke={ink(look.robe)} strokeWidth={2.5} strokeLinejoin="round" />
      {hem && <path d={`M${-w + 3} ${-2 * k} Q0 ${3 * k} ${w - 3} ${-2 * k}`} stroke={hem} strokeWidth={4} fill="none" strokeLinecap="round" />}
    </g>
  )
}

type Who = { x: number; y: number; s?: number; pose?: Pose; holding?: Holding; facing?: 'left' | 'right'; blinkDelay?: number; children?: ReactNode }

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

/** How far a sitting Person comes down (figure units): their hips onto the seat. */
const SIT_DROP = 14

/**
 * Someone sitting on a rock, facing us (draw the kit's Rock first, its seat at their hips): a Person with the
 * same look from the waist up, their knees in front under the robe, then their shins and sandals.
 * (x, y) = their feet on the ground; the seat is about 30 figure units up (times 0.74 for a child, as
 * for Person). `children` are drawn on the Person, in its own units; `front` is drawn over the lap (a
 * harp resting on it), in the same units. `sway` tips the body from the hips, in degrees (swaying to music).
 */
export function SittingOnRock({ x, y, s = 1, look, pose = 'stand', holding, blinkDelay = 0, sway = 0, children, front }: {
  x: number; y: number; s?: number; look: Look; pose?: Pose; holding?: Holding; blinkDelay?: number; sway?: number
  children?: ReactNode; front?: ReactNode
}) {
  const b = look.build === 'child' ? 0.74 : look.build === 'giant' ? 1.55 : 1
  const robe = useShade(look.robe, 0.3, 0.2)
  const clip = `sit${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const tip = `rotate(${sway} 0 -30)`
  return (
    <g transform={`translate(${x} ${y}) scale(${s * b})`}>
      <defs>{robe.def}<clipPath id={clip}><rect x={-120} y={-260} width={240} height={234} /></clipPath></defs>
      {/* shins and sandals, a little apart */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M${d * 13} -18 L${d * 14} -7`} stroke={ink(look.skin)} strokeWidth={12} strokeLinecap="round" />
          <path d={`M${d * 13} -18 L${d * 14} -7`} stroke={look.skin} strokeWidth={9} strokeLinecap="round" />
          <ellipse cx={d * 15} cy={-4} rx={10} ry={5} fill="#7a5233" />
        </g>
      ))}
      <g transform={tip}>
        <g clipPath={`url(#${clip})`}>
          <Person x={0} y={SIT_DROP} s={1 / b} look={look} pose={pose} holding={holding} blinkDelay={blinkDelay}>{children}</Person>
        </g>
      </g>
      {/* the lap: the robe over the knees (just under the sash), hanging to the middle of the shins */}
      <path d="M-28 -31 Q0 -24 28 -31 Q34 -28 34 -22 Q34 -17 31 -15 Q23 -12 15 -14 Q7 -16 0 -13 Q-7 -16 -15 -14 Q-23 -12 -31 -15 Q-34 -17 -34 -22 Q-34 -28 -28 -31 Z"
        fill={robe.fill} stroke={ink(look.robe)} strokeWidth={3} strokeLinejoin="round" />
      {[-1, 1].map((d) => <ellipse key={d} cx={d * 17} cy={-24} rx={9} ry={4.5} fill="#fff" opacity={0.16} />)}
      <path d="M0 -26 Q-1 -20 0 -14" stroke={ink(look.robe)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.55} />
      {front && <g transform={tip}><g transform={`translate(0 ${SIT_DROP})`}>{front}</g></g>}
    </g>
  )
}

// ---------- Faces and hair, drawn over a Person's own (in its units) ----------

/** In a Person's own units (give as its children): eyebrows for a grumpy face (low in the middle) or a sad one (raised in the middle). */
export const Brows = ({ mood }: { mood: 'grumpy' | 'sad' }) => (
  <path d={mood === 'grumpy' ? 'M-14 -123.5 L-4.5 -119.8 M14 -123.5 L4.5 -119.8' : 'M-13.5 -119.6 L-4.5 -123.2 M13.5 -119.6 L4.5 -123.2'}
    stroke="#2b2140" strokeWidth={2.6} strokeLinecap="round" fill="none" />
)

/** In a Person's own units: a frown in place of a bearded Person's smile (the smile is covered with beard). */
export const BeardFrown = ({ color }: { color: string }) => (
  <g>
    <ellipse cx={0} cy={-98.3} rx={6} ry={2.6} fill={color} />
    <path d="M-3.6 -96.9 Q0 -99.7 3.6 -96.9" stroke="#d0707e" strokeWidth={2.2} fill="none" strokeLinecap="round" />
  </g>
)

/** Put inside a scene: every Person or Pal in a `dn-shut` group has their eyes gently closed (praying, or asleep). */
export const ShutEyes = () => <style>{'.dn-shut .pa-blink{animation:none!important;transform:scaleY(.14)!important;transform-box:fill-box;transform-origin:center}'}</style>

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

// Gazing up at the sky with one hand raised toward it: the eyes turned up (the open eyes are hidden: they're
// the blinking group), and the raised hand held still rather than waving. Give the Person pose "wave" and
// <EyesUp /> as a child, and wrap it in <LookingUp>.
const UP_CSS = '.ab-up .pa-blink{display:none}.ab-up .pa-wing{animation:none!important}'
export function LookingUp({ children }: { children: ReactNode }) {
  return <g className="ab-up"><style>{UP_CSS}</style>{children}</g>
}
export const EyesUp = () => (
  <g>
    {[-8, 8].map((ex) => (
      <g key={ex}>
        <ellipse cx={ex} cy={-116.8} rx={3.2} ry={4.2} fill="#2b2140" />
        <circle cx={ex - 0.6} cy={-119.6} r={1.3} fill="#fff" />
      </g>
    ))}
  </g>
)

/** Silver hair peeking out from under a head covering (in a Person's own units): she's old. */
export const SilverHair = ({ color = '#e9e5de' }: { color?: string }) => (
  <g>
    <path d="M-24 -112.5 Q-14 -128 0 -127 Q14 -128 24 -112.5 Q14 -122 0 -121 Q-14 -122 -24 -112.5 Z" fill={color} stroke={darken(color, 0.22)} strokeWidth={1.2} strokeLinejoin="round" />
    <path d="M-15 -121 Q-12 -118 -9 -120.5 M9 -120.5 Q12 -118 15 -121" stroke={darken(color, 0.22)} strokeWidth={1} fill="none" strokeLinecap="round" />
  </g>
)

// ---------- Figure ----------
// Figure is Person (the same body, face and proportions) plus a few things Person can't draw yet: a coat of
// many colors (`coat` stripes on the robe and sleeves), faces for feelings (`mood`: grumpy brothers, a
// surprised Pharaoh, happy tears), crossed arms and hugs (`pose`, `reach`), kneeling (`kneel`), a striped
// head cloth (`wrapStripes`), and Egyptian dress (`collar`, `band`, `nemes`, `pleats`). First drawn for
// Joseph's Coat (scenes/joseph.tsx, where Sleeper draws someone lying asleep with its Head). When Person
// gains these, Figure can become Person.

type Pt = [number, number]

/**
 * Person's poses, and: `open` (arms out, welcoming), `cross` (arms crossed, grumpy), `hug` / `hug-right`
 * (both arms, or the right, out at the shoulders, round whoever stands beside; `reach` sets where the
 * hands go), `carry` (a hand up at the shoulder, steadying a sack), `present` (holding something up in
 * front by its top corners).
 */
export type JPose = 'stand' | 'wave' | 'pray' | 'arms-up' | 'hold' | 'point' | 'open' | 'cross' | 'hug' | 'hug-right' | 'carry' | 'present'
/** How someone feels: `joy` (eyes shut tight with smiling), `teary` (happy tears), `asleep`. */
export type Mood = 'happy' | 'grumpy' | 'sad' | 'wow' | 'asleep' | 'joy' | 'teary'
/** `crook`: Pharaoh's striped crook; `jar`: a big water jar held in front; `sack`: a sack on the shoulder (with `carry`). */
export type JHolding = 'staff' | 'stick' | 'crook' | 'jar' | 'sack'

export interface JLook extends Look {
  /** A coat of many colors: the robe in these stripes, top to bottom (the sleeves take three of them). */
  coat?: string[]
  /** A broad Egyptian collar of beads, in this color (gold), with rows of blue and red. */
  collar?: string
  /** A band round the head (a gold circlet), with a blue gem at the front. */
  band?: string
  /** Pharaoh's striped headdress, [cloth, stripes], over the head and down behind the ears to the shoulders. */
  nemes?: [string, string]
  /** Pleats down an Egyptian linen robe. */
  pleats?: boolean
  /**
   * A striped head cloth (with hair "covered"): two bands of this color along its front edge, and two across its ends
   * (as Jacob wears it). Figure and Head draw it; Person draws a plain head cloth.
   */
  wrapStripes?: string
}

/** Arms for each pose: the shoulder, (an elbow,) then the hand, left arm first (figure coordinates). */
const FIGURE_ARMS: Record<JPose, Pt[][]> = {
  stand: [[[-20, -86], [-30, -46]], [[20, -86], [30, -46]]],
  wave: [[[-20, -86], [-30, -46]], [[20, -86], [42, -128]]],
  pray: [[[-20, -86], [-6, -60]], [[20, -86], [6, -60]]],
  'arms-up': [[[-20, -86], [-42, -130]], [[20, -86], [42, -130]]],
  hold: [[[-20, -86], [-8, -60]], [[20, -86], [8, -60]]],
  point: [[[-20, -86], [-30, -46]], [[20, -86], [54, -90]]],
  open: [[[-20, -86], [-50, -60]], [[20, -86], [50, -60]]],
  // (the left forearm goes under the right; the right hand rests on the left elbow)
  cross: [[[-20, -86], [-27, -63], [21, -66]], [[20, -86], [27, -58], [-22, -60]]],
  hug: [[[-20, -86], [-60, -84]], [[20, -86], [60, -84]]],
  'hug-right': [[[-20, -86], [-30, -46]], [[20, -86], [60, -84]]],
  carry: [[[-20, -86], [-30, -46]], [[20, -86], [32, -70], [24, -100]]],
  present: [[[-20, -86], [-19, -64]], [[20, -86], [19, -64]]],
}
/** Holding the big jar: a hand on each side of it. */
const JAR_ARMS: Pt[][] = [[[-20, -86], [-21, -58]], [[20, -86], [21, -58]]]

const EYE = '#2b2140'
/** The ink of a coat of many colors' outlines and seams. */
export const COAT_INK = '#5a3a24'
const armPath = (pts: Pt[]) => `M${pts.map((p) => p.join(' ')).join(' L')}`
const armLength = (pts: Pt[]) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)
const uidOf = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')

/** One sleeve: a plain robe color, or the coat's stripes across it (shoulder, middle, cuff). */
function Sleeve({ pts, robe, stripes }: { pts: Pt[]; robe: string; stripes?: string[] }) {
  const d = armPath(pts)
  const common = { d, fill: 'none', strokeLinejoin: 'round' as const }
  if (!stripes) {
    return (
      <g>
        <path {...common} stroke={ink(robe)} strokeWidth={17} strokeLinecap="round" />
        <path {...common} stroke={robe} strokeWidth={14} strokeLinecap="round" />
        <path {...common} stroke={lighten(robe, 0.15)} strokeWidth={8} strokeLinecap="round" />
      </g>
    )
  }
  // Each later stripe is the same arm drawn again with a dash that starts further along it.
  const L = armLength(pts)
  const n = stripes.length
  return (
    <g>
      <path {...common} stroke={COAT_INK} strokeWidth={17} strokeLinecap="round" />
      <path {...common} stroke={stripes[0]} strokeWidth={14} strokeLinecap="round" />
      <path {...common} stroke={lighten(stripes[0], 0.25)} strokeWidth={7} strokeLinecap="round" />
      {stripes.slice(1).map((c, i) => {
        const a = (L * (i + 1)) / n
        const dash = `0 ${a.toFixed(1)} ${(L - a + 10).toFixed(1)} ${L.toFixed(1)}`
        return (
          <g key={i}>
            <path {...common} stroke={c} strokeWidth={14} strokeDasharray={dash} />
            <path {...common} stroke={lighten(c, 0.25)} strokeWidth={7} strokeDasharray={dash} />
            <path {...common} stroke={COAT_INK} strokeWidth={14} strokeDasharray={`0 ${(a - 0.7).toFixed(1)} 1.4 ${L.toFixed(1)}`} opacity={0.5} />
          </g>
        )
      })}
    </g>
  )
}

const ROBE = 'M-21 -92 Q0 -100 21 -92 L35 -10 Q0 -1 -35 -10 Z'
// (kneeling: the robe spreads out over the two knees on the ground)
const ROBE_KNEEL = 'M-21 -92 Q0 -100 21 -92 L35 -52 Q46 -44 38 -35 Q20 -30 2 -36 Q-20 -30 -38 -35 Q-46 -44 -35 -52 Z'

/** The coat of many colors in the shape `d`: curved bands top to bottom, softly shaded. */
function CoatBody({ d, stripes, top, bottom }: { d: string; stripes: string[]; top: number; bottom: number }) {
  const uid = uidOf(useId())
  const h = (bottom - top) / stripes.length
  return (
    <g>
      <defs>
        <clipPath id={`cc${uid}`}><path d={d} /></clipPath>
        <radialGradient id={`cs${uid}`} cx="35%" cy="25%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity={0.4} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#3b2414" stopOpacity={0.28} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#cc${uid})`}>
        {stripes.map((c, i) => {
          const y0 = top + i * h
          return <path key={i} d={`M-50 ${y0} Q0 ${y0 + 7} 50 ${y0} L50 ${y0 + h + 1} Q0 ${y0 + h + 8} -50 ${y0 + h + 1} Z`} fill={c} />
        })}
        {stripes.slice(1).map((_, i) => {
          const y0 = top + (i + 1) * h
          return <path key={i} d={`M-50 ${y0} Q0 ${y0 + 7} 50 ${y0}`} stroke={COAT_INK} strokeWidth={1.2} fill="none" opacity={0.5} />
        })}
        <rect x={-50} y={top - 10} width={100} height={bottom - top + 20} fill={`url(#cs${uid})`} />
      </g>
      <path d={d} fill="none" stroke={COAT_INK} strokeWidth={3} strokeLinejoin="round" />
    </g>
  )
}

/** A broad collar of beads round the neck and over the shoulders. */
function Collar({ color }: { color: string }) {
  return (
    <g>
      <path d="M-12 -97 Q0 -90 12 -97 L27 -92 Q0 -64 -27 -92 Z" fill={color} stroke={ink(color)} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-18 -92 Q0 -76 18 -92" stroke="#3f7fd0" strokeWidth={3.2} fill="none" />
      <path d="M-22 -91 Q0 -70 22 -91" stroke="#d0503f" strokeWidth={2.4} fill="none" strokeDasharray="2.4 2.6" />
    </g>
  )
}

/** A head cloth (hair "covered"): its top, over the head, and its ends, hanging down behind the face to the shoulders. */
const CLOTH_TOP = 'M-25 -112 Q-26 -142 0 -142 Q26 -142 25 -112 Q14 -128 0 -127 Q-14 -128 -25 -112 Z'
const CLOTH_ENDS = 'M-26 -112 Q-30 -82 -22 -86 L22 -86 Q30 -82 26 -112 Z'

/**
 * A head (figure coordinates: its middle at (0, -114), as Person draws it), with hair or headwear, and a
 * face for `mood`. Used by Figure, and by Sleeper (scenes/joseph.tsx) for someone lying down.
 */
export function Head({ look, mood = 'happy', blinkDelay = 0 }: { look: JLook; mood?: Mood; blinkDelay?: number }) {
  const skin = useShade(look.skin, 0.25, 0.12)
  const hair = useShade(look.hairColor, 0.25, 0.15)
  const nid = uidOf(useId())
  const bearded = !!look.beard
  const wrap = look.wrap ?? '#7cb0e0'
  const back = look.hair === 'long' || look.hair === 'covered'
  const closed = mood === 'asleep' || mood === 'joy' || mood === 'teary'
  const eyeRy = mood === 'grumpy' ? 3.2 : mood === 'wow' ? 5 : 4.2
  const eyeRx = mood === 'wow' ? 3.6 : 3.2
  const nemes = look.nemes
  const lip = bearded ? '#d0707e' : '#6b2a3a'
  const stripes = look.hair === 'covered' && !nemes ? look.wrapStripes : undefined
  return (
    <g>
      <defs>{skin.def}{hair.def}</defs>
      {back && !nemes && (
        <path d="M-26 -112 Q-30 -82 -22 -86 L22 -86 Q30 -82 26 -112 Z" fill={look.hair === 'covered' ? wrap : hair.fill} stroke={ink(look.hair === 'covered' ? wrap : look.hairColor)} strokeWidth={2.5} />
      )}
      {/* (a striped head cloth: two bands across its ends, where they hang down beside the face) */}
      {stripes && (
        <g>
          <defs><clipPath id={`wd${nid}`}><path d={CLOTH_ENDS} /></clipPath></defs>
          <path d="M-36 -98 L36 -98 M-36 -92.5 L36 -92.5" stroke={stripes} strokeWidth={2.6} clipPath={`url(#wd${nid})`} />
          <path d={CLOTH_ENDS} fill="none" stroke={ink(wrap)} strokeWidth={2.5} />
        </g>
      )}
      {nemes && (
        <g>
          <defs><clipPath id={`nb${nid}`}><path d="M-25 -124 L-36 -86 Q0 -80 36 -86 L25 -124 Z" /></clipPath></defs>
          <path d="M-25 -124 L-36 -86 Q0 -80 36 -86 L25 -124 Z" fill={nemes[0]} />
          <g clipPath={`url(#nb${nid})`}>
            {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-40} y={-124 + i * 5} width={80} height={2.5} fill={nemes[1]} />)}
          </g>
          <path d="M-25 -124 L-36 -86 Q0 -80 36 -86 L25 -124 Z" fill="none" stroke={ink(nemes[0])} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      )}
      <circle cx={0} cy={-114} r={22} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2.5} />
      {!nemes && <circle cx={-21} cy={-112} r={4.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />}
      {!nemes && <circle cx={21} cy={-112} r={4.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />}
      {/* eyes */}
      {closed ? (
        <g stroke={EYE} strokeWidth={2.2} fill="none" strokeLinecap="round">
          {mood === 'asleep'
            ? <path d="M-11.5 -114 Q-8 -110.5 -4.5 -114 M4.5 -114 Q8 -110.5 11.5 -114" />
            : <path d="M-11.5 -113 Q-8 -118 -4.5 -113 M4.5 -113 Q8 -118 11.5 -113" />}
        </g>
      ) : (
        <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
          <ellipse cx={-8} cy={-114} rx={eyeRx} ry={eyeRy} fill={EYE} />
          <ellipse cx={8} cy={-114} rx={eyeRx} ry={eyeRy} fill={EYE} />
          <circle cx={-9} cy={-116} r={1.2} fill="#fff" />
          <circle cx={7} cy={-116} r={1.2} fill="#fff" />
        </g>
      )}
      {/* brows, for feelings */}
      {(mood === 'grumpy' || mood === 'sad' || mood === 'wow') && (
        <path
          d={mood === 'grumpy' ? 'M-13.5 -123 L-4 -119.5 M13.5 -123 L4 -119.5' : mood === 'sad' ? 'M-12.5 -119.5 L-4 -123 M12.5 -119.5 L4 -123' : 'M-12 -123 Q-8 -127 -4 -124 M12 -123 Q8 -127 4 -124'}
          stroke={darken(look.hairColor === '#e8e4dc' ? '#9a9088' : look.hairColor, 0.1)} strokeWidth={2.4} fill="none" strokeLinecap="round"
        />
      )}
      {mood !== 'grumpy' && <ellipse cx={-13} cy={-106} rx={4} ry={2.6} fill="#ff7fb0" opacity={0.5} />}
      {mood !== 'grumpy' && <ellipse cx={13} cy={-106} rx={4} ry={2.6} fill="#ff7fb0" opacity={0.5} />}
      {bearded && (() => {
        const bc = look.beardColor ?? look.hairColor
        return (
          <g fill={bc} stroke={ink(bc)} strokeWidth={2} strokeLinejoin="round">
            {(look.hair === 'covered' || look.hair === 'bald') && <path d="M-23 -118 L-17 -104 L-13 -107 L-18 -119 Z M23 -118 L17 -104 L13 -107 L18 -119 Z" />}
            <path d={look.beard === 'long' ? 'M-18 -110 Q-20 -72 0 -66 Q20 -72 18 -110 Q10 -100 0 -101 Q-10 -100 -18 -110 Z' : 'M-17 -110 Q-16 -90 0 -88 Q16 -90 17 -110 Q10 -101 0 -102 Q-10 -101 -17 -110 Z'} />
            <path d="M-10 -103 Q-5 -108 0 -105 Q5 -108 10 -103 Q5 -101 0 -102.5 Q-5 -101 -10 -103 Z" strokeWidth={1.4} />
          </g>
        )
      })()}
      {/* mouth */}
      {mood === 'grumpy' ? (
        <path d={bearded ? 'M-4 -97.5 Q0 -101 4 -97.5' : 'M-5 -103 Q0 -107.5 5 -103'} stroke={lip} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      ) : mood === 'sad' ? (
        <path d={bearded ? 'M-3.5 -98 Q0 -100.5 3.5 -98' : 'M-4 -103.5 Q0 -106 4 -103.5'} stroke={lip} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      ) : mood === 'wow' ? (
        <ellipse cx={0} cy={bearded ? -98.5 : -104} rx={bearded ? 2.6 : 3} ry={bearded ? 3.2 : 3.8} fill="#6b2a3a" stroke={bearded ? '#d0707e' : '#4a1a2a'} strokeWidth={1.2} />
      ) : mood === 'joy' || mood === 'teary' ? (
        <path d={bearded ? 'M-4.5 -100 Q0 -93.5 4.5 -100 Q0 -98.5 -4.5 -100 Z' : 'M-6 -106 Q0 -98 6 -106 Q0 -104 -6 -106 Z'} fill="#6b2a3a" stroke={bearded ? '#d0707e' : '#4a1a2a'} strokeWidth={1.4} strokeLinejoin="round" />
      ) : (
        <path d={bearded ? 'M-3.5 -99 Q0 -96.5 3.5 -99' : 'M-5 -106 Q0 -101 5 -106'} stroke={lip} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      )}
      {/* hair and headwear */}
      {nemes ? (
        <g>
          <defs><clipPath id={`nt${nid}`}><path d="M-26 -110 Q-28 -147 0 -147 Q28 -147 26 -110 Q15 -126 0 -126 Q-15 -126 -26 -110 Z" /></clipPath></defs>
          <path d="M-26 -110 Q-28 -147 0 -147 Q28 -147 26 -110 Q15 -126 0 -126 Q-15 -126 -26 -110 Z" fill={nemes[0]} />
          <g clipPath={`url(#nt${nid})`}>
            {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-30 + i * 5.5} -150 L${-30 + i * 5.5 + (i - 5.5) * 1.6} -108`} stroke={nemes[1]} strokeWidth={2.4} />)}
          </g>
          <path d="M-26 -110 Q-28 -147 0 -147 Q28 -147 26 -110 Q15 -126 0 -126 Q-15 -126 -26 -110 Z" fill="none" stroke={ink(nemes[0])} strokeWidth={2.4} strokeLinejoin="round" />
          {/* the lappets hanging in front of the shoulders */}
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`scale(${sd} 1)`}>
              <path d="M21 -112 L31 -110 L33 -80 L23 -80 Z" fill={nemes[0]} stroke={ink(nemes[0])} strokeWidth={2} strokeLinejoin="round" />
              {[-104, -97, -90].map((sy) => <path key={sy} d={`M22.5 ${sy} L32 ${sy + 0.6}`} stroke={nemes[1]} strokeWidth={2.6} />)}
            </g>
          ))}
          <path d="M-24 -121 Q0 -130 24 -121" stroke={look.band ?? '#ffd34d'} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ) : stripes ? (
        <g>
          <defs><clipPath id={`wt${nid}`}><path d={CLOTH_TOP} /></clipPath></defs>
          <path d={CLOTH_TOP} fill={wrap} />
          {/* two bands along its front edge */}
          <path d="M-31 -115.5 Q-14 -131.5 0 -130.5 Q14 -131.5 31 -115.5 M-31 -120.5 Q-14 -136.5 0 -135.5 Q14 -136.5 31 -120.5" stroke={stripes} strokeWidth={2.6} fill="none" clipPath={`url(#wt${nid})`} />
          <path d={CLOTH_TOP} fill="none" stroke={ink(wrap)} strokeWidth={2.5} />
        </g>
      ) : look.hair === 'covered' ? (
        <path d={CLOTH_TOP} fill={wrap} stroke={ink(wrap)} strokeWidth={2.5} />
      ) : look.hair === 'curly' ? (
        <g fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2}>
          {[[-16, -128], [-6, -134], [6, -134], [16, -128], [-21, -118], [21, -118]].map(([cx, cy]) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={8} />)}
        </g>
      ) : look.hair !== 'bald' ? (
        <path d="M-23 -112 Q-25 -139 0 -139 Q25 -139 23 -112 Q14 -125 0 -123 Q-14 -125 -23 -112 Z" fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2.5} />
      ) : null}
      {look.hair === 'ponytail' && !nemes && <ellipse cx={26} cy={-122} rx={9} ry={13} fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2} transform="rotate(25 26 -122)" />}
      {look.hair === 'pigtails' && !nemes && [-1, 1].map((d) => <ellipse key={d} cx={d * 27} cy={-112} rx={8} ry={12} fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2} />)}
      {look.band && !nemes && (
        <g>
          <path d="M-23 -123 Q0 -131 23 -123" stroke={ink(look.band)} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M-23 -123 Q0 -131 23 -123" stroke={look.band} strokeWidth={3.6} fill="none" strokeLinecap="round" />
          <circle cx={0} cy={-127} r={3.2} fill="#3f7fd0" stroke={ink(look.band)} strokeWidth={1.4} />
        </g>
      )}
      {look.crown && <path d="M-16 -140 L-16 -154 L-8 -146 L0 -158 L8 -146 L16 -154 L16 -140 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />}
      {nemes && <path d="M0 -121 q-4.5 -6 0 -12 q4.5 6 0 12 Z" fill="#ffd34d" stroke="#c99a10" strokeWidth={1.4} />}
      {mood === 'teary' && [-1, 1].map((sd) => (
        <g key={sd} transform={`scale(${sd} 1)`}>
          <path d="M-12.5 -110 Q-15.5 -104.5 -12.5 -102.5 Q-9.5 -104.5 -12.5 -110 Z" fill="#8fd0ff" stroke="#4a9ad8" strokeWidth={1} />
          <circle cx={-13.4} cy={-104.8} r={0.9} fill="#fff" />
        </g>
      ))}
    </g>
  )
}

/** Something held (figure coordinates; at the hand (x, y), or in front between the hands). */
function FigureHeld({ what, x, y }: { what: JHolding; x: number; y: number }) {
  switch (what) {
    case 'staff':
      return <path d={`M${x + 2} -146 Q${x + 12} -160 ${x + 2} -166 Q${x - 6} -162 ${x - 2} -154 M${x + 2} -146 L${x} -2`} stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
    case 'stick':
      return <path d={`M${x + 1} ${y - 8} L${x} -2`} stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
    case 'crook': {
      // Pharaoh's crook, in gold and blue bands: leaning out from the hand, its hook curling back in at the top.
      const sg = x < 0 ? -1 : 1
      const tx = x + 12 * sg, ty = y - 80
      const d = `M${x - 6 * sg} ${y + 34} L${tx} ${ty} Q${tx + 3 * sg} ${ty - 17} ${tx - 9 * sg} ${ty - 17} Q${tx - 19 * sg} ${ty - 16} ${tx - 18 * sg} ${ty - 6}`
      return (
        <g>
          <path d={d} stroke="#1f3f78" strokeWidth={7.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} stroke="#ffd34d" strokeWidth={4.2} fill="none" strokeLinecap="round" strokeDasharray="5 4" />
        </g>
      )
    }
    case 'jar':
      return (
        <g transform={`translate(${x} ${y + 8})`}>
          <path d="M-9 -24 L9 -24 L8 -18 Q22 -12 20 4 Q18 20 0 22 Q-18 20 -20 4 Q-22 -12 -8 -18 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-17 -2 Q0 4 17 -2" stroke="#f2c08a" strokeWidth={3} fill="none" />
          <ellipse cx={0} cy={-24} rx={10} ry={3} fill="#6a3a1a" />
          <ellipse cx={-8} cy={-8} rx={3} ry={6} fill="#fff" opacity={0.3} />
        </g>
      )
    case 'sack':
      // On the shoulder, steadied by the hand.
      return (
        <g transform={`translate(${x + 2} ${y + 2}) rotate(-12)`}>
          <path d="M-20 -14 Q-6 -24 6 -20 Q24 -16 26 0 Q26 14 8 14 Q-12 14 -22 6 Q-28 -4 -20 -14 Z" fill="#d8b47a" stroke="#9a7442" strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-8 -4 q4 6 0 12 M8 -8 q-3 7 1 14" stroke="#b9925a" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      )
  }
}

/**
 * A person, drawn as Person draws them (origin at the feet; an adult is about 150 tall at s = 1), plus
 * the coat, moods, poses and Egyptian dress described at the top of this section.
 * `reach`: where the hands go instead of the pose's (figure coordinates; for hugs, a hand on a shoulder).
 * `heldHand`: which hand holds `holding` (1, the right, unless said). `kneel`: kneeling, bowed low.
 * `item`: something drawn in figure units between the arms and the hands (the hands go over it).
 */
export function Figure({ x, y, s = 1, look, pose = 'stand', mood = 'happy', holding, heldHand = 1, facing = 'right', blinkDelay = 0, kneel, reach, item, children }: {
  x: number; y: number; s?: number; look: JLook; pose?: JPose; mood?: Mood; holding?: JHolding; heldHand?: 0 | 1
  facing?: 'left' | 'right'; blinkDelay?: number; kneel?: boolean; reach?: [Pt | null, Pt | null]; item?: ReactNode; children?: ReactNode
}) {
  const build = look.build ?? 'adult'
  const scale = s * (build === 'child' ? 0.74 : build === 'giant' ? 1.55 : 1)
  const robe = useShade(look.robe, 0.3, 0.2)
  const skin = useShade(look.skin, 0.25, 0.12)
  const base = holding === 'jar' ? JAR_ARMS : FIGURE_ARMS[pose]
  const arms = base.map((pts, i) => (reach?.[i] ? [pts[0], reach[i]!] : pts))
  const inFront = holding === 'jar'
  const sleeves = look.coat ? [look.coat[4] ?? look.coat[0], look.coat[2] ?? look.coat[0], look.coat[0]] : undefined
  // Kneeling: everything above the knees comes down, and the head bows a little more.
  const drop = kneel ? 32 : 0
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -scale : scale} ${scale})`}>
      <defs>{robe.def}{skin.def}</defs>
      <g className="pa-breathe">
        {!kneel && (
          <g>
            <ellipse cx={-11} cy={-4} rx={10} ry={5} fill="#7a5233" />
            <ellipse cx={11} cy={-4} rx={10} ry={5} fill="#7a5233" />
          </g>
        )}
        <g transform={drop ? `translate(0 ${drop})` : undefined}>
          {look.coat ? (
            <CoatBody d={kneel ? ROBE_KNEEL : ROBE} stripes={look.coat} top={-100} bottom={kneel ? -30 : -2} />
          ) : (
            <path d={kneel ? ROBE_KNEEL : ROBE} fill={robe.fill} stroke={ink(look.robe)} strokeWidth={3} strokeLinejoin="round" />
          )}
          {kneel && <path d="M-36 -46 Q-18 -52 -4 -44 M36 -46 Q18 -52 4 -44" stroke={ink(look.robe)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />}
          {look.pleats && (
            <path d={kneel ? 'M-10 -54 L-14 -40 M0 -54 L0 -36 M10 -54 L14 -40' : 'M-12 -50 L-17 -10 M-4 -50 L-6 -6 M4 -50 L6 -6 M12 -50 L17 -10'} stroke={darken(look.robe, 0.12)} strokeWidth={1.6} strokeLinecap="round" />
          )}
          {look.sash && !kneel && <path d="M-27 -54 Q0 -47 27 -54 L28 -45 Q0 -38 -28 -45 Z" fill={look.sash} stroke={ink(look.sash)} strokeWidth={2} />}
          {/* arms */}
          {arms.map((pts, i) => (
            <g key={i}>
              <Sleeve pts={pts} robe={look.robe} stripes={sleeves} />
              {holding && !inFront && holding !== 'crook' && i === heldHand && <FigureHeld what={holding} x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1]} />}
            </g>
          ))}
          {holding && inFront && <FigureHeld what={holding} x={0} y={-62} />}
          {item}
          {/* hands (the left one tucked away when the arms are crossed) */}
          {pose !== 'pray' && arms.map((pts, i) => {
            if (pose === 'cross' && i === 0) return null
            const [hx, hy] = pts[pts.length - 1]
            return <circle key={i} cx={hx} cy={hy} r={7} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} />
          })}
          {look.collar && <Collar color={look.collar} />}
          <rect x={-6} y={-100} width={12} height={10} fill={look.skin} />
          {/* (kneeling, the head bows down low onto the chest, eyes lowered) */}
          <g transform={kneel ? 'translate(0 10)' : undefined}>
            <Head look={look} mood={kneel && mood === 'happy' ? 'asleep' : mood} blinkDelay={blinkDelay} />
          </g>
          {pose === 'pray' && (
            <g>
              <path d="M-7 -49 Q-9 -64 -1 -74 L1 -74 Q9 -64 7 -49 Q0 -46 -7 -49 Z" fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} strokeLinejoin="round" />
              <path d="M0 -73 L0 -50" stroke={ink(look.skin)} strokeWidth={1.4} />
            </g>
          )}
          {/* (a crook is held up in front of everything, so its hook shows beside the head) */}
          {holding === 'crook' && <FigureHeld what="crook" x={arms[heldHand][arms[heldHand].length - 1][0]} y={arms[heldHand][arms[heldHand].length - 1][1]} />}
          {holding === 'crook' && (() => {
            const [hx, hy] = arms[heldHand][arms[heldHand].length - 1]
            return <circle cx={hx} cy={hy} r={7} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} />
          })()}
          {children}
        </g>
      </g>
    </g>
  )
}
