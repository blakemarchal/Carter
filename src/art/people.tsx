// Story characters: one adjustable person figure (Noah, David, Mary, a shepherd…) drawn in the
// Pal style: soft shading, gentle outlines, blinking eyes. Origin is at the feet, centered;
// an adult stands about 150 units tall at s = 1. Presets for every character are at the bottom.
import type { CSSProperties, ReactNode } from 'react'
import { darken, ink, lighten, useShade } from './kit'
import type { KidLook } from '../lib/look'

export type Pose = 'stand' | 'wave' | 'pray' | 'arms-up' | 'hold' | 'point'
export type Holding = 'staff' | 'sling' | 'baby' | 'basket' | 'bread' | 'hammer' | 'lunch' | 'scroll'
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
    case 'sling':
      return (
        <g>
          <path d={`M${x} ${y} Q${x + 14} ${y + 26} ${x + 26} ${y + 8}`} stroke="#8a5a2e" strokeWidth={3} fill="none" />
          <circle cx={x + 26} cy={y + 8} r={6} fill="#b8b1a6" stroke="#7d766d" strokeWidth={2} />
        </g>
      )
    case 'hammer':
      return <g><path d={`M${x} ${y} L${x + 4} ${y - 30}`} stroke="#8a5a2e" strokeWidth={5} strokeLinecap="round" /><rect x={x - 8} y={y - 40} width={24} height={12} rx={3} fill="#8d95a8" stroke="#5d6578" strokeWidth={2} /></g>
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
  pray: [[[-20, -86], [-4, -70]], [[20, -86], [4, -70]]],
  'arms-up': [[[-20, -86], [-42, -130]], [[20, -86], [42, -130]]],
  hold: [[[-20, -86], [-8, -60]], [[20, -86], [8, -60]]],
  point: [[[-20, -86], [-30, -46]], [[20, -86], [54, -90]]],
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
  const hand = pose === 'point' || pose === 'wave' ? arms[1][1] : pose === 'hold' || pose === 'pray' ? [0, -62] : arms[1][1]
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -scale : scale} ${scale})`}>
      <defs>{robe.def}{skin.def}{hair.def}</defs>
      {look.glow && <circle cx={0} cy={-90} r={95} fill="#fff6b0" opacity={0.35} className="pa-twinkle" />}
      {look.wings && [-1, 1].map((side) => (
        <g key={side} className="pa-wing" style={{ '--o': side < 0 ? '100% 60%' : '0% 60%' } as CSSProperties}>
          <path transform={`scale(${side} 1)`} d="M14 -92 C40 -130 78 -118 84 -96 C70 -96 70 -86 80 -76 C62 -74 58 -64 64 -54 C44 -58 26 -66 14 -76 Z" fill="#ffffff" stroke="#d8c98a" strokeWidth={3} strokeLinejoin="round" />
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
          <g key={i} className={pose === 'wave' && i === 1 ? 'pa-wing' : undefined} style={pose === 'wave' && i === 1 ? ({ '--o': '0% 100%' } as CSSProperties) : undefined}>
            <path d={`M${sx} ${sy} L${hx} ${hy}`} stroke={look.robe} strokeWidth={14} strokeLinecap="round" />
            <path d={`M${sx} ${sy} L${hx} ${hy}`} stroke={lighten(look.robe, 0.15)} strokeWidth={8} strokeLinecap="round" />
            <circle cx={hx} cy={hy} r={7} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} />
          </g>
        ))}
        {holding && <Held what={holding} x={hand[0]} y={hand[1]} />}
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
        {look.beard ? (
          <path d={look.beard === 'long' ? 'M-18 -110 Q-20 -72 0 -66 Q20 -72 18 -110 Q10 -100 0 -101 Q-10 -100 -18 -110 Z' : 'M-17 -110 Q-16 -90 0 -88 Q16 -90 17 -110 Q10 -101 0 -102 Q-10 -101 -17 -110 Z'}
            fill={look.beardColor ?? look.hairColor} stroke={ink(look.beardColor ?? look.hairColor)} strokeWidth={2} />
        ) : null}
        <path d={look.beard ? 'M-4 -103 Q0 -100 4 -103' : 'M-5 -106 Q0 -101 5 -106'} stroke="#6b2a3a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
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
        {look.helmet && <path d="M-24 -116 Q-24 -144 0 -144 Q24 -144 24 -116 Z M-4 -144 Q0 -162 10 -160 Q4 -150 4 -144 Z" fill="#a9b1c2" stroke="#6b7385" strokeWidth={3} />}
        {look.crown && <path d="M-16 -134 L-16 -148 L-8 -140 L0 -152 L8 -140 L16 -148 L16 -134 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} />}
        {children}
      </g>
    </g>
  )
}

// ---------- Characters ----------
// Bible characters have medium/tan skin; hair and robes are earthy and warm.

export const PEOPLE = {
  noah: { skin: SKIN.medium, hair: 'short', hairColor: '#e8e4dc', beard: 'long', beardColor: '#f2efe8', robe: '#9a6b45', sash: '#d9b56a' },
  noahsWife: { skin: SKIN.medium, hair: 'covered', hairColor: '#5a3a24', wrap: '#c98aa8', robe: '#b77fa0', sash: '#f0d38a' },
  david: { skin: SKIN.tan, hair: 'curly', hairColor: '#7a4a24', robe: '#7cb06a', sash: '#c98448', build: 'child' },
  goliath: { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#8d95a8', helmet: true, build: 'giant' },
  saul: { skin: SKIN.medium, hair: 'short', hairColor: '#3b2a20', beard: 'short', robe: '#8a5bb0', sash: '#ffd34d', crown: true },
  jonah: { skin: SKIN.medium, hair: 'short', hairColor: '#4a3020', beard: 'short', robe: '#5f8fc0', sash: '#e0b45a' },
  sailor: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e06a5a', robe: '#c9a46a', beard: 'short', beardColor: '#3b2a20' },
  jesus: { skin: SKIN.medium, hair: 'long', hairColor: '#5a3a24', beard: 'short', robe: '#f5f0e6', sash: '#c0504d' },
  boy: { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', robe: '#e6b85a', sash: '#a0612f', build: 'child' },
  disciple: { skin: SKIN.medium, hair: 'short', hairColor: '#4a3020', beard: 'short', robe: '#a07a5a', sash: '#6b8f5a' },
  mary: { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#5f8fd0', robe: '#bcd4f0', sash: '#f5f0e6' },
  joseph: { skin: SKIN.medium, hair: 'short', hairColor: '#4a3020', beard: 'short', robe: '#a0703f', sash: '#6b8f5a' },
  shepherd: { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8dcc0', robe: '#8f7a5a', beard: 'short', beardColor: '#3b2a20', sash: '#c0504d' },
  angel: { skin: SKIN.light, hair: 'long', hairColor: '#f2d27a', robe: '#ffffff', sash: '#ffd34d', wings: true, glow: true },
  mom: { skin: SKIN.light, hair: 'long', hairColor: '#7a4a24', robe: '#c9a8ff', sash: '#ffffff' },
  dad: { skin: SKIN.light, hair: 'short', hairColor: '#5a3a24', beard: 'short', robe: '#5fb7ff', sash: '#3b6fa0' },
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
