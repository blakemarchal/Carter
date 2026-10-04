// Drawn things first needed by the Queen Esther island (its activities and pictures). Same style and
// rules as the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
// Queen Esther's crown and the king's golden scepter are drawn here once, for the items and for the
// story pictures (scenes/esther.tsx puts the crown on her head and the scepter in the king's hand).
import { useId } from 'react'
import type { Item } from './types'
import { groundShadow, lighten, Shine } from './draw'

const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

export const CROWN_GOLD = '#f5c33b'
export const CROWN_INK = '#b8862a'
/** The pink of the jewel in Esther's crown (and of her cape and the front of her royal robe). */
export const ESTHER_PINK = '#ff8fc4'

/** The outline of Queen Esther's crown, in a Person's own units: a band with five points (see EstherCrown). */
export const ESTHER_CROWN_D = 'M-17 -127.5 L-20 -144 L-12.5 -137 L-7.5 -149.5 L0 -158.5 L7.5 -149.5 L12.5 -137 L20 -144 L17 -127.5 Q0 -132.5 -17 -127.5 Z'

/** The pearls and jewels on Queen Esther's crown (drawn over its outline, ESTHER_CROWN_D; a Person's units). */
export function EstherCrownJewels() {
  return (
    <g>
      {[[-20, -144], [-7.5, -149.5], [0, -158.5], [7.5, -149.5], [20, -144]].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r={2.4} fill="#fffaf0" stroke="#c9b48a" strokeWidth={0.9} />
      ))}
      <ellipse cx={0} cy={-137.5} rx={3.3} ry={4.1} fill={ESTHER_PINK} stroke="#c2477e" strokeWidth={1.1} />
      <ellipse cx={-0.9} cy={-139} rx={1} ry={1.3} fill="#fff" opacity={0.8} />
      <circle cx={-10.5} cy={-133.6} r={1.8} fill="#5fb7ff" stroke="#2f7fc8" strokeWidth={0.7} />
      <circle cx={10.5} cy={-133.6} r={1.8} fill="#5fb7ff" stroke="#2f7fc8" strokeWidth={0.7} />
    </g>
  )
}

/**
 * Queen Esther's crown, in a Person's own units (it sits on her hair, its band at about y -128 to -138):
 * a gold band with five points, a pearl on the tip of each, a pink jewel in front and a little blue one
 * on each side.
 */
export function EstherCrown() {
  const id = `ec${uid(useId())}`
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lighten(CROWN_GOLD, 0.45)} />
          <stop offset="0.45" stopColor={CROWN_GOLD} />
          <stop offset="1" stopColor="#e0a422" />
        </linearGradient>
      </defs>
      <path d={ESTHER_CROWN_D} fill={`url(#${id})`} stroke={CROWN_INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M-17.6 -131.4 Q0 -136.4 17.6 -131.4" stroke="#fff4b8" strokeWidth={1.3} fill="none" opacity={0.85} />
      <EstherCrownJewels />
    </g>
  )
}

/**
 * The king's golden scepter, lying along the x axis from where it's held (0, 0) to its round top at (len, 0):
 * a gold rod with gold bands, a little knob at the end in the hand, and on top a gold ball with a red jewel.
 * `w` is the rod's thickness (about 5 in a Person's hand at s = 1).
 */
export function Scepter({ len = 90, w = 5 }: { len?: number; w?: number }) {
  const id = `sp${uid(useId())}`
  const r = w * 1.9 // (the ball on top)
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(CROWN_GOLD, 0.5)} />
          <stop offset="0.5" stopColor={CROWN_GOLD} />
          <stop offset="1" stopColor="#d99a1e" />
        </linearGradient>
      </defs>
      <rect x={-w * 2.2} y={-w / 2} width={len + w * 2.2 - r * 0.6} height={w} rx={w / 2} fill={`url(#${id})`} stroke={CROWN_INK} strokeWidth={w * 0.3} />
      <circle cx={-w * 2.2} cy={0} r={w * 0.85} fill={CROWN_GOLD} stroke={CROWN_INK} strokeWidth={w * 0.28} />
      {[0.32, 0.62].map((t) => (
        <rect key={t} x={len * t - w * 0.45} y={-w * 0.82} width={w * 0.9} height={w * 1.64} rx={w * 0.3} fill={CROWN_GOLD} stroke={CROWN_INK} strokeWidth={w * 0.26} />
      ))}
      <path d={`M${len - r * 1.55} ${-w * 0.95} L${len - r * 0.7} ${-w * 0.5} L${len - r * 0.7} ${w * 0.5} L${len - r * 1.55} ${w * 0.95} Z`} fill={CROWN_GOLD} stroke={CROWN_INK} strokeWidth={w * 0.26} strokeLinejoin="round" />
      <circle cx={len} cy={0} r={r} fill={`url(#${id})`} stroke={CROWN_INK} strokeWidth={w * 0.32} />
      <circle cx={len} cy={0} r={r * 0.42} fill="#e8344a" stroke="#a81f30" strokeWidth={w * 0.16} />
      <circle cx={len - r * 0.45} cy={-r * 0.45} r={r * 0.2} fill="#fff" opacity={0.85} />
    </g>
  )
}

/** Queen Esther's crown (the one she wears in the story pictures), big and shining. */
function CrownItem() {
  return (
    <g>
      <ellipse {...groundShadow(50, 88, 34)} />
      <g transform="translate(50 352.4) scale(2.1)"><EstherCrown /></g>
      <Shine x={30} y={52} rx={3.6} ry={2} rot={-70} />
      <path d="M86 20 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe680" stroke="#e0b030" strokeWidth={0.8} />
      <path d="M14 30 l1.4 3.4 l3.4 1.4 l-3.4 1.4 l-1.4 3.4 l-1.4 -3.4 l-3.4 -1.4 l3.4 -1.4 Z" fill="#ffe680" stroke="#e0b030" strokeWidth={0.6} />
    </g>
  )
}

/** The king's golden scepter, standing up at a slant, its jeweled top shining. */
function ScepterItem() {
  return (
    <g>
      <ellipse {...groundShadow(40, 92, 24)} />
      <g transform="translate(30 78) rotate(-58)"><Scepter len={70} w={7.5} /></g>
      <path d="M83 12 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe680" stroke="#e0b030" strokeWidth={0.8} />
      <path d="M24 36 l1.4 3.4 l3.4 1.4 l-3.4 1.4 l-1.4 3.4 l-1.4 -3.4 l-3.4 -1.4 l3.4 -1.4 Z" fill="#ffe680" stroke="#e0b030" strokeWidth={0.6} />
    </g>
  )
}

export const ISL_ESTHER: Item[] = [
  { id: 'esther-crown', name: "Queen Esther's crown", Draw: CrownItem },
  { id: 'golden-scepter', name: 'golden scepter', Draw: ScepterItem },
]
