// Manna in the Desert: one picture per story page, both parts in order (see data/manna.ts for the words).
// Built from the kit (./kit.tsx), people (../people.tsx), the Moses islands' cast and props (./moses.tsx),
// the faces and poses other islands made to share (./daniel.tsx, ./abraham.tsx), and the quail, the manna,
// Aaron's jar and the rock from ../items/isl-manna.tsx. The same family from the Red Sea walks this story
// too (HEBREWS: dad, mom and the baby, the boy, the girl, grandma and grandpa). God is never drawn as a
// person: His presence is light (the glowing cloud). Kept gentle and funny: rumbly tummies, a smelly jar,
// a buzzing fly.
//
// New here, for any island to reuse (they can move into moses.tsx or kit.tsx): CampTent (a tent in God's
// people's camp, in any colors), FarCamp (rows of little tents far away), Mountains, MannaGround (manna like
// frost on the ground), WovenBasket and Bowl (with manna heaped in them), ClayJar (fresh, or spoiled), Stink,
// Fly, CookFire, Rumble (a rumbly tummy), Grumble (a grumbly cloud over someone's head), Wonder (a question
// mark), and faces for a Person: Pout (a pouty mouth) and Yuck (eyes squeezed shut at a bad smell).
import { useId, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Person, type Look, type Pose } from '../people'
import { Flake, MannaHeap, MannaJar, MANNA, MANNA_LINE, Quail, RockSpring, seeded } from '../items/isl-manna'
import { Cloud, Glow, Rays, Scene, Sparkles, Sun, Tap, sparkle } from './kit'
import { usePlayer } from './player'
import { AARON, Folk, Goat, Grip, HEBREWS, Heart, MOSES, PillarOfCloud, SilverHair, SKINS, Staff, StaffInLeftHand, flame } from './moses'
import { BeardFrown, Brows, Kneel, ShutEyes, Zs } from './daniel'
import { EyesUp, LaughFace, Laughing, LookingUp, Sitting } from './abraham'

const { dad: DAD, mom: MOM, boy: BOY, girl: GIRL, grandma: GRANDMA, grandpa: GRANDPA, man: NEIGHBOR } = HEBREWS

// ---------- The camp in the desert ----------

/** The tents' woven cloth: [cloth, stripe]. The family's own tent is the terracotta one. */
export const FAMILY_TENT = ['#c2603f', '#f5ddb0'] as const
export const TENT_CLOTHS: [string, string][] = [['#8a6248', '#ecd6ab'], ['#a9876a', '#f3e5c8'], ['#6f5446', '#dcc39c'], ['#c08a5a', '#f6e6c6'], ['#9a6b52', '#ead6b0'], ['#7d7f5e', '#e8e0c0']]

/**
 * A tent in God's people's camp: woven cloth with stripes, high in the middle and sagging between its
 * poles, its front open with the door flaps tied back, pegged out with ropes. (x, y) = the middle of its
 * front on the ground; at s = 1 it's about 300 wide (with its ropes) and 160 tall, and its doorway (about
 * 140 wide at the bottom, 100 tall) fits someone at about s = 0.6. `children` stand in the doorway, in front
 * of the dark back wall and behind the door flaps.
 */
export function CampTent({ x, y, s = 1, cloth = FAMILY_TENT[0], stripe = FAMILY_TENT[1], children }: {
  x: number; y: number; s?: number; cloth?: string; stripe?: string; children?: ReactNode
}) {
  const shade = useShade(cloth, 0.22, 0.2)
  const line = ink(cloth)
  const roof = 'M-146 -82 L-110 -122 Q-66 -114 -40 -134 Q0 -158 40 -134 Q66 -114 110 -122 L146 -82 Q104 -92 64 -90 Q32 -106 0 -104 Q-32 -106 -64 -90 Q-104 -92 -146 -82 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{shade.def}</defs>
      <ellipse cx={0} cy={-1} rx={150} ry={8} fill="#000" opacity={0.1} />
      {/* ropes out to the pegs */}
      {[-1, 1].map((d) => (
        <g key={d} strokeLinecap="round">
          <path d={`M${d * 132} -86 L${d * 156} 0 M${d * 96} -118 L${d * 144} 0`} stroke="#9a7a55" strokeWidth={2} fill="none" />
          <path d={`M${d * 156} 1 L${d * 153} -9 M${d * 144} 1 L${d * 141} -9`} stroke="#6b4422" strokeWidth={3.5} />
        </g>
      ))}
      {/* inside: the dark back wall, a rug, and the middle pole */}
      <rect x={-96} y={-120} width={192} height={120} fill="#4a3329" />
      <path d="M-96 -120 L96 -120 L96 -100 Q0 -92 -96 -100 Z" fill="#3a271f" />
      <rect x={-84} y={-13} width={168} height={13} fill="#b5553f" />
      <path d={`M-80 -6.5 ${Array.from({ length: 14 }, () => 'l5.7 -4 l5.7 4').join(' ')}`} stroke="#f0d38a" strokeWidth={2} fill="none" />
      <rect x={-4} y={-150} width={8} height={138} rx={3} fill="#6b4a2e" />
      {children}
      {/* the side walls, their door flaps tied back */}
      {[-1, 1].map((d) => (
        <g key={d} transform={`scale(${d} 1)`}>
          <path d="M-136 -84 L-100 -120 Q-88 -84 -72 -58 Q-82 -28 -88 0 L-140 0 Z" fill={shade.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
          <path d="M-98 -110 Q-87 -82 -75 -60 Q-84 -30 -90 -4" stroke={stripe} strokeWidth={4.5} fill="none" />
          <path d="M-126 -84 L-130 -3" stroke={darken(cloth, 0.15)} strokeWidth={2} />
          <path d="M-76 -62 q-7 2 -6 9 q6 0 8 -6" stroke="#c0504d" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* the roof, high in the middle and sagging between the poles, with woven stripes */}
      <path d={roof} fill={shade.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-130 -94 Q-94 -102 -58 -101 Q-28 -118 0 -118 Q28 -118 58 -101 Q94 -102 130 -94" stroke={stripe} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M-118 -112 Q-84 -110 -52 -118 Q-24 -138 0 -140 Q24 -138 52 -118 Q84 -110 118 -112" stroke={stripe} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.85} />
      {[-110, 0, 110].map((px) => <circle key={px} cx={px} cy={px ? -122 : -156} r={4} fill="#6b4422" />)}
    </g>
  )
}

/** The rest of the camp far away: little tents along the horizon at y, `s` big, in turn colors. */
export function FarCamp({ y, s = 0.3, xs, shift = 0 }: { y: number; s?: number; xs: number[]; shift?: number }) {
  return (
    <g>
      {xs.map((x, i) => {
        const [cloth, stripe] = TENT_CLOTHS[(i + shift) % TENT_CLOTHS.length]
        return <CampTent key={x} x={x} y={y + (i % 2) * 4 * s} s={s * (i % 3 === 1 ? 0.9 : 1)} cloth={cloth} stripe={stripe} />
      })}
    </g>
  )
}

/** Rocky mountains far away along the horizon (the mountains of the desert near Sinai): their feet at y. */
export function Mountains({ y, color = '#d3aec4', k = 1 }: { y: number; color?: string; k?: number }) {
  const P: [number, number][] = [[-10, 34], [30, 58], [64, 44], [104, 82], [140, 60], [170, 70], [212, 38], [250, 52], [300, 30], [350, 48], [390, 36], [440, 64], [478, 88], [520, 60], [556, 72], [600, 40], [650, 56], [700, 34], [748, 62], [790, 46], [810, 50]]
  const pts = P.map(([px, h]) => `L${px} ${y - h * k}`).join(' ')
  return (
    <g>
      <path d={`M-10 ${y} ${pts} L810 ${y} Z`} fill={color} stroke={color} strokeWidth={6} strokeLinejoin="round" />
      {/* the sunny side of each peak */}
      {P.filter(([, h]) => h >= 56).map(([px, h]) => (
        <path key={px} d={`M${px} ${y - h * k} L${px - 22} ${y - h * k * 0.55} L${px - 6} ${y - h * k * 0.5} Z`} fill={lighten(color, 0.3)} opacity={0.8} />
      ))}
    </g>
  )
}

/**
 * Manna on the ground in the morning: little round white flakes everywhere, like frost (Exodus 16:14),
 * from y0 (far away: small) to y1 (near: bigger), x0 to x1, with a few glints. `clear`: [x, y, rx, ry]
 * patches left bare (round a tent, under the people).
 */
export function MannaGround({ y0, y1, x0 = -10, x1 = 810, n = 220, seed = 5, clear = [], glints = 6 }: {
  y0: number; y1: number; x0?: number; x1?: number; n?: number; seed?: number; clear?: [number, number, number, number][]; glints?: number
}) {
  const rnd = seeded(seed)
  const flakes: [number, number, number][] = []
  for (let i = 0; i < n; i++) {
    const t = Math.pow(rnd(), 0.8)
    const fy = y0 + (y1 - y0) * t
    const fx = x0 + (x1 - x0) * rnd()
    const r = 1.4 + 2.8 * t + rnd() * 0.7
    if (clear.some(([cx, cy, rx, ry]) => ((fx - cx) / rx) ** 2 + ((fy - cy) / ry) ** 2 < 1)) continue
    flakes.push([fx, fy, r])
  }
  flakes.sort((a, b) => a[2] - b[2])
  const shiny = flakes.filter(([, , r]) => r > 3).filter((_, i) => i % 7 === 3).slice(0, glints)
  return (
    <g>
      {flakes.map(([fx, fy, r], i) => <ellipse key={`s${i}`} cx={fx + r * 0.2} cy={fy + r * 0.5} rx={r * 1.05} ry={r * 0.45} fill="#a8824e" opacity={0.22} />)}
      {flakes.map(([fx, fy, r], i) => <circle key={`f${i}`} cx={fx} cy={fy} r={r} fill={MANNA} stroke={MANNA_LINE} strokeWidth={0.7} />)}
      {shiny.map(([fx, fy, r], i) => <path key={`g${i}`} className="pa-twinkle" style={{ animationDelay: `${(i * 0.45) % 1.8}s` }} d={sparkle(fx + r * 0.6, fy - r * 1.6, 3 + r)} fill="#ffffff" />)}
    </g>
  )
}

const WICKER = '#d0924f'

/**
 * A woven basket seen from the front, a little from above: its rim's middle at (x, y), `w` wide. `k` (0 to
 * 1): how full of manna it is (full, the manna is heaped up above the rim).
 */
export function WovenBasket({ x, y, w = 60, k = 1, seed = 3 }: { x: number; y: number; w?: number; k?: number; seed?: number }) {
  const wick = useShade(WICKER, 0.3, 0.2)
  const line = ink(WICKER)
  const ry = w * 0.15, h = w * 0.58, bw = w * 0.37
  const front = `M${x - w / 2} ${y} A${w / 2} ${ry} 0 0 0 ${x + w / 2} ${y} L${x + bw} ${y + h} Q${x} ${y + h + ry * 1.3} ${x - bw} ${y + h} Z`
  const side = (f: number) => w / 2 - (w / 2 - bw) * f
  return (
    <g>
      <defs>{wick.def}</defs>
      <ellipse cx={x} cy={y} rx={w / 2} ry={ry} fill={darken(WICKER, 0.4)} stroke={line} strokeWidth={2} />
      {k > 0 && <MannaHeap x={x} y={y + ry * 0.5} w={w * 0.94} h={w * 0.4} k={k} seed={seed} />}
      <path d={front} fill={wick.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      {[0.36, 0.7].map((f) => (
        <path key={f} d={`M${x - side(f)} ${y + h * f + ry * 0.4} Q${x} ${y + h * f + ry * 1.9} ${x + side(f)} ${y + h * f + ry * 0.4}`} stroke={darken(WICKER, 0.22)} strokeWidth={Math.max(1.2, w * 0.03)} fill="none" />
      ))}
      {[-0.6, -0.2, 0.2, 0.6].map((f) => (
        <path key={f} d={`M${x + f * w * 0.5} ${y + ry * Math.sqrt(1 - f * f)} L${x + f * bw} ${y + h + ry * 0.6}`} stroke={darken(WICKER, 0.16)} strokeWidth={Math.max(1, w * 0.022)} />
      ))}
      <path d={`M${x - w / 2} ${y} A${w / 2} ${ry} 0 0 0 ${x + w / 2} ${y}`} stroke={darken(WICKER, 0.1)} strokeWidth={Math.max(2, w * 0.06)} fill="none" />
      <path d={`M${x - w / 2} ${y} A${w / 2} ${ry} 0 0 0 ${x + w / 2} ${y}`} stroke={line} strokeWidth={1.4} fill="none" />
    </g>
  )
}

/** A little clay bowl seen from the front: its rim's middle at (x, y), `w` wide, with a heap of manna in it (`k`, 0 to 1). */
export function Bowl({ x, y, w = 36, k = 1, color = '#c9784a', seed = 4 }: { x: number; y: number; w?: number; k?: number; color?: string; seed?: number }) {
  const ry = w * 0.15
  const line = ink(color)
  return (
    <g>
      <ellipse cx={x} cy={y} rx={w / 2} ry={ry} fill={darken(color, 0.4)} stroke={line} strokeWidth={1.8} />
      {k > 0 && <MannaHeap x={x} y={y + ry * 0.4} w={w * 0.9} h={w * 0.32} k={k} seed={seed} r={Math.max(1.6, w / 13)} />}
      <path d={`M${x - w / 2} ${y} A${w / 2} ${ry} 0 0 0 ${x + w / 2} ${y} Q${x + w * 0.46} ${y + w * 0.42} ${x} ${y + w * 0.44} Q${x - w * 0.46} ${y + w * 0.42} ${x - w / 2} ${y} Z`} fill={color} stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${x - w * 0.42} ${y + w * 0.14} Q${x} ${y + w * 0.3} ${x + w * 0.42} ${y + w * 0.14}`} stroke={lighten(color, 0.35)} strokeWidth={Math.max(1.2, w * 0.05)} fill="none" />
    </g>
  )
}

/**
 * A clay jar with a wide mouth, for keeping food in: (x, y) = the middle of its mouth (so a hand can hold it
 * by the rim); it hangs down about 52 at s = 1. `fill`: fresh manna heaped in its mouth, or the manna kept
 * overnight, spoiled: gray-green and lumpy; or fresh water, right up to the brim.
 */
export function ClayJar({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill?: 'fresh' | 'spoiled' | 'water' }) {
  const c = '#d9875a'
  const clay = useShade(c, 0.3, 0.2)
  const line = ink(c)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{clay.def}</defs>
      <ellipse cx={0} cy={0} rx={12.5} ry={3.6} fill={darken(c, 0.45)} stroke={line} strokeWidth={1.8} />
      {fill === 'fresh' && <MannaHeap x={0} y={0.6} w={22} h={9} r={2.6} seed={9} />}
      {fill === 'water' && (
        <g>
          <ellipse cx={0} cy={0.4} rx={10.5} ry={2.6} fill="#6cc4f0" />
          <path d="M-6 -0.2 Q-2 -1.6 2 -0.2" stroke="#ffffff" strokeWidth={1.4} fill="none" strokeLinecap="round" />
        </g>
      )}
      {fill === 'spoiled' && (
        <g>
          <path d="M-11 1 Q-10 -6 -5 -4 Q-2 -10 3 -6 Q8 -9 9 -3 Q12 -2 11 1 Z" fill="#a5ab84" stroke="#6f7652" strokeWidth={1.5} strokeLinejoin="round" />
          {[[-6, -2, 1.6], [1, -4.5, 1.3], [6, -2, 1.5], [-1, -1, 1]].map(([dx, dy, r], i) => <circle key={i} cx={dx} cy={dy} r={r} fill="#7d8a5a" />)}
        </g>
      )}
      <path d="M-11 2 Q-25 10 -25 29 Q-25 47 -10 51 L10 51 Q25 47 25 29 Q25 10 11 2 Z" fill={clay.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M-13 0 A13 3.8 0 0 0 13 0" stroke={darken(c, 0.12)} strokeWidth={3.4} fill="none" />
      <path d="M-23 24 Q0 31 23 24" stroke="#f2c08a" strokeWidth={2.4} fill="none" />
      <path d="M-22 31 Q0 38 22 31" stroke={darken(c, 0.2)} strokeWidth={1.6} fill="none" strokeDasharray="3 3" />
    </g>
  )
}

/** Wavy green smell lines rising from (x, y): pee-yew! */
export function Stink({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-12, 0, 12].map((dx, i) => (
        <g key={dx} className="rs-note" style={{ animationDelay: `${i * 0.7}s`, animationDuration: '2.4s' }}>
          <path d={`M${dx} 0 q-6 -7 0 -14 t0 -14 t0 -14`} stroke="#5f8f3a" strokeWidth={6.5} fill="none" strokeLinecap="round" />
          <path d={`M${dx} 0 q-6 -7 0 -14 t0 -14 t0 -14`} stroke="#a8d46a" strokeWidth={3.6} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

/** A little fly buzzing round and round, with a dotted loop behind it. (x, y) = its body; it faces right (or left). */
export function Fly({ x, y, s = 1, facing = 'right' }: { x: number; y: number; s?: number; facing?: 'left' | 'right' }) {
  return (
    <g className="sc-float" style={{ animationDuration: '1.2s' }}>
      <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
        <path d="M-12 4 C-30 10 -46 -2 -38 -14 C-30 -24 -16 -16 -24 -6" stroke="#6b6680" strokeWidth={1.6} fill="none" strokeDasharray="2.5 3.5" strokeLinecap="round" opacity={0.75} />
        {/* see-through wings, buzzing */}
        {[[-3, -20], [3, 20]].map(([wx, rot]) => (
          <g key={wx} className="sc-wing" style={{ '--o': '50% 100%', animationDuration: '0.18s' } as CSSProperties}>
            <ellipse cx={wx} cy={-9} rx={4.6} ry={8} transform={`rotate(${rot} ${wx} -9)`} fill="#ffffff" opacity={0.8} stroke="#a9b8cc" strokeWidth={1.2} />
          </g>
        ))}
        <path d="M-4 5 L-6 9 M0 6 L0 10 M4 5 L6 9" stroke="#2b2838" strokeWidth={1.2} strokeLinecap="round" />
        <ellipse cx={0} cy={0} rx={8.5} ry={6.8} fill="#4a4560" stroke="#2b2838" strokeWidth={1.6} />
        <path d="M-5 -1 L-5 5 M-1 -2 L-1 6" stroke="#6b6680" strokeWidth={1.4} />
        <circle cx={6} cy={-3} r={3.8} fill="#ffffff" stroke="#2b2838" strokeWidth={1} />
        <circle cx={9.2} cy={-1} r={3.4} fill="#ffffff" stroke="#2b2838" strokeWidth={1} />
        <circle cx={6.8} cy={-2.8} r={1.6} fill="#2b2140" />
        <circle cx={9.8} cy={-0.8} r={1.5} fill="#2b2140" />
      </g>
    </g>
  )
}

/** A little cooking fire in a ring of stones, with a clay pot on it and steam curling up: dinner! (x, y) = the middle of the stones. */
export function CookFire({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const pot = '#b86a42'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="rs-flicker">
        <path d={flame(13, 34)} transform="translate(-9 -2) rotate(-12)" fill="#ff8a3d" stroke="#e4602a" strokeWidth={2} />
        <path d={flame(13, 34)} transform="translate(9 -2) rotate(12)" fill="#ff8a3d" stroke="#e4602a" strokeWidth={2} />
        <path d={flame(9, 26)} transform="translate(0 -2)" fill="#ffc23f" />
      </g>
      {[[-26, 0], [-13, 4], [0, 5], [13, 4], [26, 0]].map(([sx, sy]) => <ellipse key={sx} cx={sx} cy={sy} rx={8} ry={5.5} fill="#bdb6ad" stroke="#7d766d" strokeWidth={2} />)}
      {/* the pot sits on the stones over the fire */}
      <path d="M-22 -14 Q-28 -34 -16 -42 L16 -42 Q28 -34 22 -14 Q0 -8 -22 -14 Z" fill={pot} stroke={ink(pot)} strokeWidth={2.4} strokeLinejoin="round" />
      <ellipse cx={0} cy={-42} rx={17} ry={4.5} fill={darken(pot, 0.35)} stroke={ink(pot)} strokeWidth={2} />
      <path d="M-24 -26 Q0 -20 24 -26" stroke={lighten(pot, 0.3)} strokeWidth={2.2} fill="none" />
      {[-8, 4, 14].map((sx, i) => (
        <g key={sx} className="rs-note" style={{ animationDelay: `${i * 0.8}s`, animationDuration: '2.6s' }}>
          <path d={`M${sx} -48 q-6 -7 0 -14 t0 -14`} stroke="#ffffff" strokeWidth={3.4} fill="none" strokeLinecap="round" opacity={0.85} />
        </g>
      ))}
    </g>
  )
}

/** "Grumble, rumble": wiggly lines by a hungry tummy (scene units; (x, y) = their middle). */
export const Rumble = ({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <g className="pa-twinkle" stroke="#e07a5f" strokeWidth={2.8} fill="none" strokeLinecap="round">
      <path d="M0 -7 q4 -5 8 0 t8 0" />
      <path d="M3 4 q4 -5 8 0 t8 0" />
    </g>
  </g>
)

/** A little gray grumble cloud with a scribble in it, over someone's head: grumble, grumble! (x, y) = its middle. */
export function Grumble({ x, y, s = 1, d = 0 }: { x: number; y: number; s?: number; d?: number }) {
  const puffs: [number, number, number][] = [[-11, 2, 8], [-1, -4, 10.5], [11, 0, 8.5], [3, 5, 8]]
  return (
    <g className="sc-float" style={{ animationDelay: `${d}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {puffs.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 2} fill="#5f5775" />)}
        {puffs.map(([cx, cy, r], i) => <circle key={`i${i}`} cx={cx} cy={cy} r={r} fill="#9a90b0" />)}
        <path d="M-12 2 l3.5 -5 l3.5 5 l3.5 -5 l3.5 5 l3.5 -5 l3.5 5 l3.5 -5" stroke="#ffffff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  )
}

/** A question mark floating over someone's head: what is it? (x, y) = its middle. */
export function Wonder({ x, y, s = 1, d = 0, color = '#8a6ad8' }: { x: number; y: number; s?: number; d?: number; color?: string }) {
  const q = 'M-5.5 -7 Q-5.5 -14 1 -14 Q8 -14 8 -8 Q8 -3.5 3 -1.5 Q1 -0.5 1 3.5'
  return (
    <g className="sc-float" style={{ animationDelay: `${d}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={q} stroke="#ffffff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={1} cy={10} r={4} fill="#ffffff" />
        <path d={q} stroke={color} strokeWidth={4.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={1} cy={10} r={2.6} fill={color} />
      </g>
    </g>
  )
}

/** In a Person's own units: a pouty frown in place of the smile (no beard; the smile is covered with their skin). */
export const Pout = ({ skin }: { skin: string }) => (
  <g>
    <ellipse cx={0} cy={-104.3} rx={7} ry={3.7} fill={skin} />
    <path d="M-4.6 -102.3 Q0 -106.8 4.6 -102.3" stroke="#6b2a3a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
  </g>
)

/**
 * In a Person's own units: eyes squeezed shut and a wobbly "yuck" mouth, at a bad smell. Wrap the Person in
 * <Laughing> (from abraham.tsx: it hides the open eyes). `beard`: the beard's color (the mouth is on the
 * beard); else `skin`. `tongue`: sticking out, blech!
 */
export const Yuck = ({ skin, beard, tongue }: { skin?: string; beard?: string; tongue?: boolean }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M-12.5 -118 L-4.5 -114.2 L-12.5 -110.6 M12.5 -118 L4.5 -114.2 L12.5 -110.6" stroke="#2b2140" strokeWidth={2.4} />
    {beard
      ? <ellipse cx={0} cy={-98.4} rx={6.2} ry={2.8} fill={beard} />
      : <ellipse cx={0} cy={-104.3} rx={7} ry={3.7} fill={skin} />}
    {tongue && !beard && <path d="M-1.5 -102.6 Q-1.5 -96.6 2 -96.6 Q5.5 -96.6 5 -102.4 Z" fill="#ff8fa3" stroke="#c4566e" strokeWidth={1.2} />}
    <path d={beard ? 'M-5 -97.6 q1.7 -1.9 3.3 0 t3.3 0 t3.3 0' : 'M-6 -103.4 q2 -2.4 4 0 t4 0 t4 0'} stroke="#6b2a3a" strokeWidth={2.1} />
  </g>
)

/** One of God's people far away, grumbling: a Folk with a frown. */
function GrumpyFolk(p: ComponentProps<typeof Folk>) {
  const k = (p.s ?? 1) * (p.child ? 0.72 : 1)
  const skin = SKINS[((p.i ?? 0) * 7 + 2) % SKINS.length]
  return (
    <g>
      <Folk {...p} />
      <g transform={`translate(${p.x} ${p.y}) scale(${k})`}>
        <circle cx={0} cy={-47.4} r={4.2} fill={skin} />
        <path d="M-3.2 -45.4 Q0 -49.4 3.2 -45.4" stroke="#6b2a3a" strokeWidth={1.7} fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

/** One of God's people far away, with a little basket of manna on one arm (gathering it in the morning). */
function GatheringFolk(p: ComponentProps<typeof Folk>) {
  const k = (p.s ?? 1) * (p.child ? 0.72 : 1)
  return (
    <g>
      <Folk {...p} />
      <g transform={`translate(${p.x} ${p.y}) scale(${k})`}>
        <WovenBasket x={-19} y={-22} w={16} k={0.9} seed={p.i} />
      </g>
    </g>
  )
}

/** Hands pressed together over something held in front (figure units, pose "hold"): the two hands. */
const Hands = ({ skin }: { skin: string }) => (
  <g>
    <Grip x={-8} y={-60} skin={skin} />
    <Grip x={8} y={-60} skin={skin} />
  </g>
)

/** Grandma, with her silver hair peeking out (as on the Red Sea). */
const Grandma = ({ children, ...p }: Omit<ComponentProps<typeof Person>, 'look'>) => <Person {...p} look={GRANDMA}><SilverHair />{children}</Person>

/** Someone sitting on the ground (abraham.tsx), with grandma's silver hair when it's her. */
const Sit = ({ look, children, ...p }: { look: Look; x: number; y: number; s?: number; pose?: Pose; holding?: ComponentProps<typeof Person>['holding']; blinkDelay?: number; children?: ReactNode }) => (
  <Sitting look={look} {...p}>{look === GRANDMA && <SilverHair />}{children}</Sitting>
)

/** The far dune and the near sand of the desert (custom colors for the time of day). */
function Sands({ far = '#f2d39a', near = '#e8bf7a', farY = 286, nearY = 352 }: { far?: string; near?: string; farY?: number; nearY?: number }) {
  return (
    <g>
      <path d={`M-10 ${farY + 8} Q160 ${farY - 14} 330 ${farY + 4} Q520 ${farY - 18} 810 ${farY} L810 460 L-10 460 Z`} fill={far} />
      <path d={`M-10 ${nearY + 8} Q240 ${nearY - 16} 480 ${nearY + 6} T810 ${nearY} L810 460 L-10 460 Z`} fill={near} />
    </g>
  )
}

// ---------- The pages ----------

/** A trail of footprints in the sand, through the points `pts` (far ones smaller). */
function Footprints({ pts }: { pts: [number, number][] }) {
  const steps: [number, number, number, number][] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1]
    const n = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 16))
    for (let j = 0; j < n; j++) {
      const t = j / n
      const k = 0.5 + ((ay + (by - ay) * t) - 300) / 260
      const nx = -(by - ay), ny = bx - ax, len = Math.hypot(nx, ny) || 1
      const side = j % 2 ? 1 : -1
      steps.push([ax + (bx - ax) * t + (nx / len) * 4 * k * side, ay + (by - ay) * t + (ny / len) * 4 * k * side, k, Math.atan2(by - ay, bx - ax) * 57.3])
    }
  }
  return (
    <g fill="#d9a96a" opacity={0.75}>
      {steps.map(([fx, fy, k, a], i) => <ellipse key={i} cx={fx} cy={fy} rx={4.2 * k} ry={2.2 * k} transform={`rotate(${a} ${fx} ${fy})`} />)}
    </g>
  )
}

/** A big sack of food carried on someone's back: drawn before them, it shows over one shoulder. (x, y) = its middle. */
function BackSack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#e3cfa4'
  return (
    <g transform={`translate(${x} ${y}) scale(${s * 1.25})`}>
      <path d="M-20 -6 Q-26 10 -18 20 Q0 26 18 20 Q26 10 20 -6 Q12 -16 6 -18 L-6 -18 Q-12 -16 -20 -6 Z" fill={c} stroke={ink(c)} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M-7 -18 Q0 -26 7 -18" stroke={ink(c)} strokeWidth={2.4} fill="none" />
      <path d="M-8 -16 L8 -16" stroke="#c0504d" strokeWidth={3} strokeLinecap="round" />
      <path d="M-12 4 Q0 10 12 4" stroke={darken(c, 0.12)} strokeWidth={1.6} fill="none" />
    </g>
  )
}

/** An empty sack lying flat and crumpled on the sand: all the food is gone. (x, y) = its middle, on the ground. */
function EmptySack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#e3cfa4'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={30} ry={4} fill="#000" opacity={0.12} />
      <path d="M-26 0 Q-28 -9 -18 -11 Q-6 -15 8 -11 Q20 -10 25 -5 Q29 1 21 3 Q0 6 -20 4 Q-25 3 -26 0 Z" fill={c} stroke={ink(c)} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-12 -9 Q-6 -3 -10 2 M4 -11 Q10 -5 6 1" stroke={darken(c, 0.16)} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      {/* its open mouth, empty, with the tie hanging loose */}
      <ellipse cx={24} cy={-2.5} rx={4} ry={5.5} fill={darken(c, 0.45)} stroke={ink(c)} strokeWidth={1.6} />
      <path d="M20 -7 Q14 -14 8 -12" stroke="#c0504d" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** The Red Sea far behind, on the left: calm water out to the horizon, ending in a curve of beach. */
function FarSea() {
  const edge = 'M-10 250 L420 250 Q480 252 520 268 L-10 312 Z'
  return (
    <g>
      <path d={edge} fill="#5bb8ea" />
      <path d="M-10 262 L440 262 Q470 264 492 270 L-10 290 Z" fill="#7cc8f0" opacity={0.6} />
      {[[40, 270], [150, 262], [250, 274], [350, 264], [110, 286]].map(([wx, wy]) => (
        <path key={wx} d={`M${wx} ${wy} q10 -6 20 0`} stroke="#ffffff" strokeWidth={2.5} fill="none" opacity={0.8} strokeLinecap="round" />
      ))}
    </g>
  )
}

// 1. "After God brought His people safely through the Red Sea, they walked on into the desert. Moses led
// the way, and God's tall cloud showed them where to go."
// The Red Sea behind them on the left; God's people walk on into the desert, the family winding forward
// behind Moses, toward God's tall cloud.
const Page1 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={110} y={64} s={0.75} />
    <Cloud x={400} y={48} s={0.55} slow />
    <Sun x={530} y={98} s={0.78} />
    <Mountains y={262} color="#dcb8c6" k={0.75} />
    <Tap say="Bye-bye, Red Sea! God made a way right through it." sfx="whoosh">
      <FarSea />
    </Tap>
    <path d="M-10 304 Q80 294 170 300 Q270 310 370 292 Q540 260 810 274 L810 460 L-10 460 Z" fill="#f2d39a" />
    <path d="M-10 300 Q80 290 170 296 Q270 306 370 288 Q420 280 470 272" stroke="#ffffff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.75} />
    {/* God's people far behind, coming on from the sea */}
    {[[14, 4], [34, 7, 1], [54, 1], [74, 9], [94, 3, 1], [236, 6], [258, 2], [280, 8, 1], [302, 5]].map(([fx, i, child]) => (
      <Folk key={fx} x={fx} y={312 + (fx % 3) * 2} s={0.42} i={i} child={!!child} />
    ))}
    <path d="M-10 372 Q240 346 480 366 T810 358 L810 460 L-10 460 Z" fill="#e8bf7a" />
    <Footprints pts={[[60, 336], [130, 352], [200, 370], [270, 392], [340, 404]]} />
    <Tap say="God's tall cloud shows us the way!" sfx="sparkle">
      <PillarOfCloud x={724} y={336} h={280} w={64} />
    </Tap>
    <Goat x={74} y={360} s={0.36} />
    <Grandma x={128} y={366} s={0.62} holding="stick" blinkDelay={0.4} />
    <Person x={184} y={372} s={0.64} look={GRANDPA} holding="stick" blinkDelay={2.2} />
    <Tap say="Are we there yet?" sfx="pop">
      <Person x={250} y={394} s={0.76} look={BOY} blinkDelay={1.6} />
      <Person x={308} y={402} s={0.78} look={GIRL} holding="basket" blinkDelay={0.9} />
    </Tap>
    <Person x={384} y={412} s={0.84} look={MOM} pose="hold" holding="baby" blinkDelay={1.3} />
    <BackSack x={468 - 24} y={422 - 98} s={0.88} />
    <Person x={468} y={422} s={0.88} look={DAD} blinkDelay={2.6} />
    <Tap say="Come along, everyone! God is leading the way." sfx="ding">
      <Person x={590} y={432} s={1.0} look={MOSES} holding="staff" />
    </Tap>
  </Scene>
)

// 2. "The desert was hot and dry, and soon all the food was gone. Tummies rumbled, and the people grumbled.
// 'We are hungry! In Egypt we had bread to eat!'"
// A hot day in the camp: the basket is empty and the sack lies flat. Everyone grumbles (pouty faces, grumble
// clouds); the boy holds his rumbling tummy, and dad points back the way they came. Moses and Aaron listen.
const Page2 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Tap say="Phew! It is so hot." sfx="whoosh">
      <Sun x={600} y={92} s={1.15} />
    </Tap>
    <Mountains y={284} color="#e2bfa8" k={0.7} />
    <Sands farY={290} nearY={356} />
    <FarCamp y={300} s={0.24} xs={[60, 150, 250, 470, 560, 690, 770]} />
    {[[330, 6], [356, 2, 1], [384, 9], [410, 4], [436, 1, 1]].map(([fx, i, child]) => (
      <GrumpyFolk key={fx} x={fx} y={318} s={0.55} i={i} child={!!child} />
    ))}
    <Grumble x={370} y={270} s={0.6} d={0.5} />
    <Grumble x={424} y={276} s={0.5} d={1.3} />
    <Person x={82} y={428} s={0.86} look={GRANDPA} holding="stick" blinkDelay={2.2}>
      <Brows mood="grumpy" />
      <BeardFrown color={GRANDPA.beardColor} />
    </Person>
    <Grumble x={82} y={290} s={0.9} />
    <Tap say="In Egypt, we had bread to eat!" sfx="wobble">
      <Person x={190} y={430} s={0.92} look={DAD} pose="point" facing="left" blinkDelay={2.6}>
        <Brows mood="grumpy" />
        <BeardFrown color={DAD.beardColor} />
      </Person>
      <Grumble x={190} y={286} s={0.95} d={1.1} />
    </Tap>
    <Tap say="Empty! Not one crumb left." sfx="plop">
      <WovenBasket x={290} y={406} w={60} k={0} />
      <EmptySack x={342} y={444} s={0.9} />
    </Tap>
    <Tap say="My tummy is rumbling! Grumble, rumble." sfx="wobble">
      <Person x={410} y={440} s={0.92} look={BOY} pose="hold" blinkDelay={1.6}>
        <Brows mood="sad" />
        <Pout skin={BOY.skin} />
      </Person>
      <Rumble x={382} y={386} s={0.9} flip />
      <Rumble x={438} y={386} s={0.9} />
    </Tap>
    <Sit look={GIRL} x={490} y={442} s={0.9} blinkDelay={0.9}>
      <Brows mood="grumpy" />
      <Pout skin={GIRL.skin} />
    </Sit>
    <Person x={566} y={432} s={0.88} look={MOM} pose="hold" holding="baby" blinkDelay={1.3}>
      <Brows mood="sad" />
      <Pout skin={MOM.skin} />
    </Person>
    <Person x={658} y={428} s={0.96} look={MOSES} holding="staff" blinkDelay={0.6} />
    <Person x={742} y={430} s={0.9} look={AARON} pose="hold" blinkDelay={1.9} />
  </Scene>
)

/** A warm evening sky (rose above, gold low down), drawn over a Scene's own sky. */
function EveningSky() {
  const id = `ev${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f39c9c" /><stop offset="0.55" stopColor="#ffc9a0" /><stop offset="1" stopColor="#ffe6b0" />
        </linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
    </g>
  )
}

// 3. "Moses prayed to God. God heard all that grumbling, but He still loved His people. God said, 'I will
// rain bread from the sky for you!'"
// A warm evening: Moses kneels to pray, Aaron prays beside him. God's glory shines in the cloud (Exodus
// 16:10), and the family looks up at it in wonder.
const Page3 = () => (
  <Scene sky="glory" ground="none" clouds={false}>
    <EveningSky />
    <Rays x={540} y={180} r={660} n={18} color="#fff7cf" opacity={0.5} />
    <Mountains y={288} color="#c98d9e" k={0.75} />
    <Sands far="#f0c890" near="#e6b77a" farY={294} nearY={360} />
    <FarCamp y={304} s={0.22} xs={[30, 110, 190, 690, 770]} shift={2} />
    <Tap say="God heard them. And God loves His people!" sfx="sparkle">
      <Glow x={540} y={190} r={210} color="#fff3b0" />
      <PillarOfCloud x={540} y={336} h={310} w={84} />
      <Sparkles spots={[[460, 120, 9], [626, 96, 11], [606, 236, 7], [466, 254, 8], [548, 56, 7]]} />
    </Tap>
    <Tap say="Thank You, God!" sfx="good">
      <g className="dn-shut">
        <Person x={160} y={424} s={0.94} look={AARON} pose="pray" blinkDelay={1.9} />
      </g>
    </Tap>
    <Staff x1={200} y1={446} x2={306} y2={440} />
    <Tap say="Dear God, Your people are hungry. Please help us." sfx="ding">
      <g className="dn-shut">
        <Kneel x={304} y={434} s={1.1} look={MOSES} pose="pray" />
      </g>
    </Tap>
    <ShutEyes />
    <Tap say="Bread from the sky? Wow!" sfx="sparkle">
      <LookingUp>
        <Person x={624} y={440} s={0.9} look={GIRL} pose="wave" blinkDelay={0.9}><EyesUp /></Person>
        <Person x={684} y={442} s={0.88} look={BOY} blinkDelay={1.6}><EyesUp /></Person>
      </LookingUp>
    </Tap>
    <LookingUp>
      <Person x={748} y={434} s={0.86} look={MOM} pose="hold" holding="baby" blinkDelay={1.3}><EyesUp /></Person>
    </LookingUp>
  </Scene>
)

/** The quail flying in over the camp: [x, y, size]. */
const FLOCK: [number, number, number][] = [[110, 104, 1.0], [226, 66, 1.1], [330, 136, 0.95], [426, 80, 1.2], [528, 150, 1.0], [616, 70, 1.2], [706, 124, 1.1], [764, 210, 0.9], [470, 216, 0.85], [268, 214, 0.85], [600, 236, 0.8]]
/** The quail on the ground all over the camp: [x, y, size, facing, pecking]. */
const LANDED: [number, number, number, 'left' | 'right', boolean][] = [
  [356, 334, 0.75, 'right', true], [456, 330, 0.75, 'left', false], [540, 340, 0.85, 'right', true], [610, 334, 0.8, 'left', false],
  [690, 344, 0.9, 'left', true], [762, 336, 0.85, 'left', false], [560, 392, 1.1, 'right', false], [648, 404, 1.2, 'left', true],
  [742, 396, 1.15, 'left', false], [600, 440, 1.3, 'right', false], [712, 446, 1.3, 'left', true],
]

// 4. "That evening, God sent quail, lots and lots of little birds! They covered the whole camp. Now there
// was plenty of food for everyone."
// Dusk: a flock of quail flies in over the tents; quail all over the camp, even on the family's tent.
// Dinner is cooking. The girl and the boy are delighted.
const Page4 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Sun x={636} y={262} s={0.7} />
    <Mountains y={292} color="#b892b8" k={0.75} />
    <Sands far="#e7b88f" near="#d9a274" farY={298} nearY={368} />
    <FarCamp y={310} s={0.26} xs={[300, 400, 500, 600, 700, 790]} shift={1} />
    <CampTent x={140} y={378} s={0.66} />
    <Quail x={110} y={290} s={0.95} facing="right" />
    <Quail x={168} y={284} s={0.9} facing="left" blinkDelay={1} />
    <Tap say="Flap, flap, flap! Here come the quail!" sfx="whoosh">
      {FLOCK.map(([fx, fy, fs], i) => (
        <g key={i} className="rs-bob" style={{ animationDelay: `${(i * 0.37) % 2.4}s` }}>
          <Quail x={fx} y={fy} s={fs} facing={i % 2 ? 'left' : 'right'} flying blinkDelay={i * 0.3} />
        </g>
      ))}
    </Tap>
    {LANDED.slice(0, 6).map(([qx, qy, qs, f, peck], i) => <Quail key={i} x={qx} y={qy} s={qs} facing={f} peck={peck} blinkDelay={i * 0.4} />)}
    <Tap say="Peep, peep! Hello!" sfx="pop">
      {LANDED.slice(6).map(([qx, qy, qs, f, peck], i) => <Quail key={i} x={qx} y={qy} s={qs} facing={f} peck={peck} blinkDelay={i * 0.6} />)}
    </Tap>
    <Person x={56} y={434} s={0.84} look={MOM} pose="hold" holding="baby" blinkDelay={1.3} />
    <Person x={190} y={430} s={0.88} look={DAD} blinkDelay={2.6} />
    <Tap say="Mmm! Dinner smells so good." sfx="pop">
      <CookFire x={276} y={410} s={1.05} />
    </Tap>
    <Tap say="So many birds! Thank You, God!" sfx="good">
      <Person x={374} y={442} s={0.9} look={GIRL} pose="wave" blinkDelay={0.9} />
      <Laughing>
        <Person x={448} y={446} s={0.9} look={BOY} pose="arms-up"><LaughFace /></Person>
      </Laughing>
    </Tap>
  </Scene>
)

// 5. "The next morning, the ground was covered with little white flakes, like frost. Everyone came out of
// their tents to look. 'What is it?' they said."
// Dawn: white flakes everywhere on the sand. Grandma and grandpa come out of the tent; everyone wonders.
const Page5 = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <Sun x={612} y={232} s={0.85} />
    <Mountains y={276} color="#e3b4c2" k={0.85} />
    <Sands far="#f3d8ac" near="#ecca94" farY={284} nearY={350} />
    <FarCamp y={300} s={0.26} xs={[300, 400, 500, 610, 712, 790]} shift={3} />
    <Tap say="Little white flakes, like frost!" sfx="sparkle">
      <MannaGround y0={300} y1={448} n={330} seed={11} clear={[[150, 360, 110, 16], [150, 404, 70, 12]]} glints={8} />
    </Tap>
    <Tap say="I have never seen anything like it!" sfx="ding">
      <CampTent x={150} y={368} s={0.74} />
      <Grandma x={112} y={404} s={0.8} pose="hold" blinkDelay={0.4} />
      <Person x={186} y={408} s={0.84} look={GRANDPA} holding="stick" blinkDelay={2.2} />
      <Wonder x={150} y={262} s={0.9} d={0.3} />
    </Tap>
    <Tap say="What is it?" sfx="pop">
      <Person x={318} y={436} s={0.92} look={GIRL} pose="point" blinkDelay={0.9} />
      <Wonder x={318} y={292} d={0.9} />
    </Tap>
    <Tap say="Is it snow? In the desert?" sfx="pop">
      <Kneel x={424} y={438} s={0.92} look={BOY} pose="hold">
        <Hands skin={BOY.skin} />
        <Flake x={0} y={-75} r={7} />
      </Kneel>
    </Tap>
    <Person x={524} y={430} s={0.92} look={DAD} blinkDelay={2.6} />
    <Wonder x={524} y={276} d={1.5} />
    <Person x={616} y={434} s={0.9} look={MOM} pose="hold" holding="baby" blinkDelay={1.3} />
  </Scene>
)

/** A thin round wafer of manna with a bite out of it (figure units, held in front: its middle at (x, y)). */
const Wafer = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-13 -2 A13 6.5 0 1 0 9 -6.5 Q6.5 -3.5 9.5 -1 Q5.5 -0.5 7 3 Q3 1.5 -13 -2 Z" fill={MANNA} stroke={MANNA_LINE} strokeWidth={1.6} />
    {[[-6, 0.5], [-1, 2.6], [-2, -2.2]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={0.9} fill="#d9ccb2" />)}
  </g>
)

// 6. "Moses said, 'It is the bread God has given you. Gather just enough for today.' They called it manna. It
// tasted like crackers made with honey. Yum!"
// Morning: Moses tells everyone what it is. The family gathers it in baskets and a bowl; the boy takes a
// bite. Yum!
const Page6 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={160} y={64} s={0.7} />
    <Sun x={700} y={92} s={0.8} />
    <Mountains y={276} color="#d7b6c8" k={0.8} />
    <Sands far="#f2d6a4" near="#e9c58c" farY={284} nearY={350} />
    <FarCamp y={298} s={0.26} xs={[40, 140, 240, 340, 450, 560]} shift={4} />
    <MannaGround y0={300} y1={448} n={240} seed={23} clear={[[140, 440, 120, 30], [380, 444, 120, 20], [490, 396, 40, 10]]} />
    <Person x={496} y={396} s={0.78} look={GRANDPA} holding="stick" blinkDelay={2.2} />
    <Person x={236} y={420} s={0.92} look={DAD} pose="hold" blinkDelay={2.6}>
      <WovenBasket x={0} y={-63} w={54} k={1} seed={6} />
      <Hands skin={DAD.skin} />
    </Person>
    <Tap say="Just enough for today." sfx="pop">
      <Kneel x={96} y={438} s={0.9} look={MOM} pose="stand" />
      <WovenBasket x={136} y={422} w={44} k={0.6} seed={5} />
      <Flake x={127} y={413} r={3.4} />
    </Tap>
    <Tap say="Manna means, what is it?" sfx="ding">
      <Person x={318} y={442} s={0.92} look={GIRL} pose="hold" blinkDelay={0.9}>
        <Bowl x={0} y={-68} w={34} k={1} />
        <Hands skin={GIRL.skin} />
      </Person>
    </Tap>
    <Tap say="Yum! It tastes like crackers made with honey!" sfx="chomp">
      <Laughing>
        <Person x={414} y={448} s={1.0} look={BOY} pose="hold"><LaughFace /><Wafer x={1} y={-74} s={1.4} /><Hands skin={BOY.skin} /></Person>
      </Laughing>
      <Heart x={414} y={314} s={0.45} color="#ffcf3f" />
      <Sparkles spots={[[360, 330, 6], [462, 372, 5]]} color="#ffe27a" />
    </Tap>
    <Tap say="It is the bread God has given you!" sfx="good">
      <Person x={646} y={430} s={1.02} look={MOSES} pose="point" facing="left">
        <StaffInLeftHand />
      </Person>
    </Tap>
  </Scene>
)

// 7. "God sent manna every morning, and He said, 'Gather just enough for today.' But some people saved
// extra, just in case. The next morning, it was spoiled and smelly! Pee-yew!"
// Morning, by a neighbor's tent: he holds his jar of saved manna out at arm's length. It's gray and lumpy,
// smelly lines rise from it, and a fly buzzes round it. Eyes squeezed shut, grandma waves the smell away,
// the girl sticks out her tongue, and the boy can't stop laughing.
const Page7 = () => (
  <Scene sky="day" ground="none">
    <Mountains y={276} color="#d6b4c4" k={0.8} />
    <Sands farY={284} nearY={350} />
    <FarCamp y={298} s={0.26} xs={[30, 120, 210, 300]} shift={5} />
    <MannaGround y0={300} y1={448} n={120} seed={31} clear={[[610, 372, 170, 20]]} glints={3} />
    <CampTent x={634} y={372} s={0.74} cloth="#5f7f9a" stripe="#e6ecef" />
    <Tap say="Oops! I should have listened to God." sfx="wobble">
      <Laughing>
        <Person x={572} y={430} s={1.0} look={NEIGHBOR} pose="point" facing="left" blinkDelay={0.3}>
          <Yuck beard={NEIGHBOR.beardColor} />
        </Person>
      </Laughing>
    </Tap>
    <Tap say="Pee-yew! Smelly, spoiled manna!" sfx="wobble">
      <ClayJar x={518} y={340} s={0.92} fill="spoiled" />
      <Grip x={518} y={340} skin={NEIGHBOR.skin} />
      <Stink x={518} y={328} s={1.3} />
    </Tap>
    <Tap say="Bzzz, bzzz!" sfx="whoosh">
      <Fly x={472} y={292} s={1.25} />
    </Tap>
    <Laughing>
      <Grandma x={108} y={428} s={0.84} pose="wave" blinkDelay={0.4}><Yuck skin={GRANDMA.skin} /></Grandma>
    </Laughing>
    <Tap say="Yuck! What a smell!" sfx="pop">
      <Laughing>
        <Person x={210} y={438} s={0.94} look={GIRL} blinkDelay={0.9}><Yuck skin={GIRL.skin} tongue /></Person>
      </Laughing>
    </Tap>
    <Laughing>
      <Person x={304} y={440} s={0.94} look={BOY} pose="hold"><LaughFace /></Person>
    </Laughing>
  </Scene>
)

// 8. "But every morning, there was fresh manna on the ground again. Some people gathered a lot, and some
// gathered a little. And everyone had just enough!"
// Sunrise, fresh manna everywhere. Dad has a big basket, the girl a little bowl: both have just enough.
const Page8 = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <Rays x={400} y={250} r={560} n={16} color="#fff6c8" opacity={0.3} />
    <Sun x={400} y={238} s={0.95} />
    <Mountains y={280} color="#e6b9b8" k={0.85} />
    <Sands far="#f4dbaa" near="#eccb92" farY={288} nearY={352} />
    <FarCamp y={302} s={0.25} xs={[30, 120, 210, 590, 680, 770]} shift={2} />
    <MannaGround y0={304} y1={448} n={300} seed={41} clear={[[660, 372, 150, 18], [460, 400, 40, 10]]} glints={8} />
    <CampTent x={666} y={374} s={0.72} />
    <Tap say="Fresh manna, every morning!" sfx="sparkle">
      <Sparkles spots={[[560, 330, 7], [610, 420, 6], [120, 330, 6]]} />
    </Tap>
    <Person x={466} y={402} s={0.8} look={GRANDPA} holding="stick" blinkDelay={2.2} />
    <Kneel x={96} y={436} s={0.86} look={MOM} pose="hold">
      <Bowl x={0} y={-66} w={34} k={0.8} />
      <Hands skin={MOM.skin} />
    </Kneel>
    <Tap say="A big basket for me. Just enough!" sfx="good">
      <Person x={224} y={432} s={0.96} look={DAD} pose="hold" blinkDelay={2.6}>
        <WovenBasket x={0} y={-64} w={66} k={1} seed={8} />
        <Hands skin={DAD.skin} />
      </Person>
      <Sparkles spots={[[182, 300, 6], [268, 294, 7]]} color="#ffe27a" />
    </Tap>
    <Tap say="A little bowl for me. Just enough!" sfx="good">
      <Person x={336} y={442} s={0.94} look={GIRL} pose="hold" blinkDelay={0.9}>
        <Bowl x={0} y={-66} w={28} k={0.75} seed={12} />
        <Hands skin={GIRL.skin} />
      </Person>
      <Sparkles spots={[[306, 340, 5], [368, 334, 6]]} color="#ffe27a" />
    </Tap>
    <Tap say="Good morning, God! Thank You!" sfx="ding">
      <Person x={540} y={444} s={0.9} look={BOY} pose="arms-up" blinkDelay={1.6} />
    </Tap>
  </Scene>
)

// 9. "On the sixth day, they gathered twice as much. Then on the seventh day, everyone rested, and the saved
// manna stayed fresh and yummy!"
// The day of rest: no manna on the ground today. Two baskets of yesterday's manna by the tent, still fresh.
// Grandpa naps; everyone sits and rests together.
const Page9 = () => (
  <Scene sky="day" ground="none">
    <Mountains y={278} color="#d8b8c8" k={0.8} />
    <Sands farY={286} nearY={352} />
    <FarCamp y={300} s={0.26} xs={[460, 550, 640, 730, 800]} shift={1} />
    <CampTent x={270} y={378} s={0.86} />
    <Staff x1={36} y1={446} x2={150} y2={452} />
    <Tap say="Twice as much, and still fresh and yummy!" sfx="sparkle">
      <WovenBasket x={462} y={392} w={56} k={1} seed={13} />
      <WovenBasket x={526} y={396} w={56} k={1} seed={14} />
      <Sparkles spots={[[452, 348, 7], [538, 344, 8], [494, 330, 5]]} />
    </Tap>
    <Tap say="Zzz. A day to rest!" sfx="pop">
      <g className="dn-shut">
        <Sit look={GRANDPA} x={92} y={436} s={0.86} pose="hold" />
      </g>
      <Zs x={104} y={322} s={1.1} />
    </Tap>
    <ShutEyes />
    <Sit look={GRANDMA} x={186} y={440} s={0.84} blinkDelay={0.4} />
    <Tap say="A special day to rest with God!" sfx="good">
      <Sit look={GIRL} x={306} y={444} s={0.9} blinkDelay={0.9} />
      <Sit look={BOY} x={378} y={446} s={0.9} blinkDelay={1.6} />
    </Tap>
    <Sit look={MOM} x={612} y={440} s={0.88} holding="baby" blinkDelay={1.3} />
    <Sit look={DAD} x={700} y={438} s={0.92} blinkDelay={2.6} />
    <Goat x={770} y={446} s={0.5} facing="left" />
  </Scene>
)

// 10. "One day, there was no water, and everyone was thirsty. God told Moses to hit a big rock with his
// staff. Moses did, and splash! Fresh water came pouring out!"
// A rocky place: Moses touches the big rock with his staff, and water pours out of it into a pool. The
// children splash, dad dips a jar, and a goat comes for a drink.
const Page10 = () => (
  <Scene sky="day" ground="none">
    <Mountains y={262} color="#cfa3a8" k={1.1} />
    <Sands far="#ecc996" near="#e3b77e" farY={278} nearY={350} />
    <Tap say="Splash! Fresh, cool water!" sfx="whoosh">
      <RockSpring x={566} y={382} s={1.06} />
    </Tap>
    <Tap say="Maa! Slurp, slurp!" sfx="pop">
      <Goat x={566} y={414} s={0.55} facing="left" />
    </Tap>
    <Kneel x={236} y={414} s={0.8} look={DAD} pose="hold">
      <ClayJar x={0} y={-62} s={0.9} fill="water" />
      <Hands skin={DAD.skin} />
    </Kneel>
    <Tap say="Thank You, God, for the water!" sfx="ding">
      <Person x={752} y={430} s={0.98} look={MOSES} pose="point" facing="left">
        <Staff x1={98} y1={-104} x2={-14} y2={-66} />
        <Grip x={54} y={-90} skin={MOSES.skin} />
      </Person>
    </Tap>
    <Person x={52} y={434} s={0.86} look={MOM} pose="hold" holding="baby" blinkDelay={1.3} />
    <Tap say="Hooray! Water to drink!" sfx="good">
      <Person x={136} y={442} s={0.92} look={GIRL} pose="arms-up" blinkDelay={0.9} />
      <Laughing>
        <Person x={476} y={446} s={0.94} look={BOY} pose="arms-up"><LaughFace /></Person>
      </Laughing>
    </Tap>
  </Scene>
)

// 11. "For forty years, God fed His people with manna, every single morning. Aaron even kept some manna in a
// jar, so they would always remember how God took care of them."
// Sunrise over the whole camp, manna everywhere, people gathering it. Aaron holds the golden jar of manna.
const Page11 = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <Rays x={400} y={236} r={600} n={18} color="#fff3c0" opacity={0.32} />
    <Sun x={400} y={230} s={0.9} />
    <Mountains y={272} color="#e0b0bf" k={0.9} />
    <Sands far="#f4dbaa" near="#ecca94" farY={280} nearY={340} />
    <FarCamp y={292} s={0.2} xs={[20, 80, 140, 200, 260, 540, 600, 660, 720, 780]} />
    <FarCamp y={318} s={0.28} xs={[60, 170, 280, 520, 630, 740]} shift={3} />
    <Tap say="Fresh manna, every single morning!" sfx="sparkle">
      <MannaGround y0={322} y1={448} n={300} seed={53} glints={8} />
      {[[110, 352, 3], [178, 356, 7, 1], [610, 350, 5], [676, 356, 2, 1], [736, 348, 9]].map(([fx, fy, i, child]) => (
        <GatheringFolk key={fx} x={fx} y={fy} s={0.62} i={i} child={!!child} />
      ))}
    </Tap>
    <Person x={514} y={432} s={1.0} look={MOSES} holding="staff" blinkDelay={1.2} />
    <Person x={214} y={444} s={0.9} look={BOY} blinkDelay={1.6} />
    <Person x={290} y={442} s={0.9} look={GIRL} pose="point" blinkDelay={0.9} />
    <Tap say="A jar of manna, so we always remember!" sfx="sparkle">
      <Glow x={400} y={356} r={64} color="#fff3b0" />
      <Person x={400} y={436} s={1.04} look={AARON} pose="hold">
        <MannaJar x={0} y={-20} s={0.7} />
        <Hands skin={AARON.skin} />
      </Person>
      <Sparkles spots={[[350, 330, 7], [452, 334, 8], [400, 296, 6]]} color="#ffe27a" />
    </Tap>
  </Scene>
)

/** The child playing, there with God's people (God takes care of you, too!). */
const Kid = ({ x, y, s }: { x: number; y: number; s: number }) => <Sitting x={x} y={y} s={s} look={usePlayer().look} pose="pray" />

/** A rug spread on the sand for breakfast, from x0 to x1 (its front edge at y). */
function Rug({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const c = '#b5553f'
  return (
    <g>
      <path d={`M${x0 + 24} ${y - 34} L${x1 - 24} ${y - 34} L${x1} ${y} L${x0} ${y} Z`} fill={c} stroke={ink(c)} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={`M${x0 + 18} ${y - 8} L${x1 - 18} ${y - 8} M${x0 + 30} ${y - 27} L${x1 - 30} ${y - 27}`} stroke="#f0d38a" strokeWidth={2.6} />
      <path d={`M${x0 + 34} ${y - 17.5} ${Array.from({ length: Math.floor((x1 - x0 - 68) / 14) }, () => 'l7 -5 l7 5').join(' ')}`} stroke="#f0d38a" strokeWidth={2} fill="none" />
    </g>
  )
}

/** A warm golden morning sky (peach above, pale gold low down), drawn over a Scene's own sky. */
function MorningSky() {
  const id = `ms${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb8a0" /><stop offset="0.6" stopColor="#ffdcae" /><stop offset="1" stopColor="#fff0c4" />
        </linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
    </g>
  )
}

// 12. "God gave His people just what they needed, every single day. And God takes care of you, too! He loves
// you, and He gives you what you need, every day."
// A golden morning: you sit with God's people round a breakfast of manna, everyone thanking God.
const Page12 = () => (
  <Scene sky="glory" ground="none" clouds={false}>
    <MorningSky />
    <Rays x={400} y={140} r={620} n={18} color="#fff6d0" opacity={0.45} />
    <Mountains y={268} color="#dfa0ae" k={0.8} />
    <Sands far="#f4d8a6" near="#ebc890" farY={276} nearY={344} />
    <Tap say="God is with us, every single day!" sfx="sparkle">
      <PillarOfCloud x={96} y={322} h={250} w={60} />
    </Tap>
    <CampTent x={680} y={350} s={0.66} />
    <Rug x0={170} x1={630} y={436} />
    <Tap say="Thank You, God!" sfx="good">
      <Sit look={GRANDMA} x={226} y={398} s={0.8} pose="pray" blinkDelay={0.4} />
      <Sit look={GRANDPA} x={306} y={396} s={0.82} pose="pray" blinkDelay={2.2} />
      <Sit look={DAD} x={494} y={396} s={0.84} pose="pray" blinkDelay={2.6} />
      <Sit look={MOM} x={576} y={398} s={0.82} holding="baby" blinkDelay={1.3} />
    </Tap>
    <Tap say="Just what we need, every day!" sfx="pop">
      <Bowl x={236} y={414} w={38} k={1} seed={21} />
      <Bowl x={566} y={414} w={38} k={1} seed={22} />
    </Tap>
    <Sit look={GIRL} x={312} y={448} s={0.96} pose="pray" blinkDelay={0.9} />
    <Sit look={BOY} x={490} y={448} s={0.96} pose="pray" blinkDelay={1.6} />
    <Tap say="Thank You, God, for taking care of me!" sfx="sparkle">
      <Kid x={400} y={452} s={1.08} />
    </Tap>
    <Heart x={400} y={232} s={0.9} />
    <Sparkles spots={[[300, 196, 8], [500, 186, 9], [400, 150, 6], [200, 220, 6], [620, 210, 7]]} />
  </Scene>
)

export const MANNA_ART = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
