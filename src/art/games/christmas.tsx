// Baby Jesus: the island's mini-game kit (activities/games/types.ts). "Get the Stable Ready" is a Build it
// game: inside the stable at night, with Mary and Joseph waiting at the side, the child puts each thing in
// its place: the cozy mat on the floor, the manger, the soft hay in it, a warm blanket on the hay, the lamp
// on its hook and the bright star in the window. Then the whole stable glows, ready for the baby.
// It's the same stable as story page 6 (art/scenes/christmas.tsx), where Jesus is born: the window, the
// lamp and the manger are in the same places, and the blanket is the cream one He's wrapped in.
import { useId } from 'react'
import type { BuildKit } from '../../activities/games/types'
import { darken, ink, useShade } from '../kit'
import { Person, PEOPLE } from '../people'
import { Scene, Sparkles, sparkle } from '../scenes/kit'

/** The window (as on page 6), with a cross of wooden bars: the star shines in its top right pane. */
const WIN = { x: 130, y: 56, w: 110, h: 96 }
const STAR = { x: 212.5, y: 80 }
/** The lamp's rope (as on page 6), and the hook at its end that holds the lamp's ring. */
const HOOK = { x: 640, y: 50 }

const gid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

// ---------- Behind everything: the empty stable ----------

function Backdrop() {
  return (
    <Scene sky="night" ground="stable">
      {/* the window, open to the night: no star yet */}
      <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={8} fill="#2a2660" stroke="#7a5233" strokeWidth={8} />
      <path d={`M${WIN.x + WIN.w / 2} ${WIN.y} L${WIN.x + WIN.w / 2} ${WIN.y + WIN.h} M${WIN.x} ${WIN.y + WIN.h / 2} L${WIN.x + WIN.w} ${WIN.y + WIN.h / 2}`} stroke="#7a5233" strokeWidth={6} />
      {/* the rope from the roof, and the hook at its end for the lamp */}
      <path d={`M${HOOK.x} 0 L${HOOK.x} ${HOOK.y - 10}`} stroke="#5a3a20" strokeWidth={3} />
      <path d={`M${HOOK.x} ${HOOK.y - 12} L${HOOK.x} ${HOOK.y - 2} Q${HOOK.x} ${HOOK.y + 6} ${HOOK.x - 7} ${HOOK.y + 5} Q${HOOK.x - 13} ${HOOK.y + 3} ${HOOK.x - 12} ${HOOK.y - 3}`}
        stroke="#7d7d8c" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* Mary and Joseph, waiting for a cozy place to rest (Joseph's hand clear of the board's edge) */}
      <Person x={658} y={430} s={1.05} look={PEOPLE.mary} pose="hold" facing="left" blinkDelay={0.4} />
      <Person x={740} y={428} s={1.05} look={PEOPLE.joseph} holding="stick" facing="left" blinkDelay={1.5} />
    </Scene>
  )
}

// ---------- The parts (each centred on (0, 0)) ----------

/** A soft woven mat for the floor, red with cream stripes and a fringe at each end. */
function Mat() {
  const red = '#cf634c'
  const c = useShade(red, 0.25, 0.15)
  const cream = '#f6e4c4'
  // (the mat lies on the floor, so its far edge is a little shorter than its near edge)
  const edge = (y: number) => 84 + ((y + 14) / 28) * 14
  return (
    <g>
      <defs>{c.def}</defs>
      <ellipse cx={0} cy={16} rx={100} ry={4} fill="#000" opacity={0.12} />
      {[-1, 1].map((side) => [-10, -3, 4, 11].map((fy) => (
        <path key={`${side}${fy}`} d={`M${side * edge(fy)} ${fy} l${side * 8} 0`} stroke={darken(cream, 0.15)} strokeWidth={2.4} strokeLinecap="round" />
      )))}
      <path d="M-84 -14 L84 -14 L98 14 L-98 14 Z" fill={c.fill} stroke={ink(red)} strokeWidth={3} strokeLinejoin="round" />
      {[-7, 7].map((sy) => <path key={sy} d={`M${-edge(sy) + 4} ${sy} L${edge(sy) - 4} ${sy}`} stroke={cream} strokeWidth={4} strokeLinecap="round" />)}
      {[-56, -28, 0, 28, 56].map((wx) => <path key={wx} d={`M${wx * 0.88} -12 L${wx} 12`} stroke={darken(red, 0.15)} strokeWidth={1.6} opacity={0.6} />)}
    </g>
  )
}

/** The manger: a wooden feeding box on splayed legs, empty, so you can see inside it. */
function Manger() {
  const wood = '#a0703f'
  const w = useShade(wood, 0.25, 0.2)
  const line = ink(wood)
  return (
    <g>
      <defs>{w.def}</defs>
      <ellipse cx={0} cy={33} rx={88} ry={4} fill="#000" opacity={0.12} />
      {/* the legs: the far ones in shadow, then the near ones */}
      <path d="M-48 6 L-36 33 M48 6 L36 33" stroke={darken(wood, 0.35)} strokeWidth={8} strokeLinecap="round" />
      <path d="M-62 4 L-80 33 M62 4 L80 33" stroke={line} strokeWidth={11} strokeLinecap="round" />
      <path d="M-62 4 L-80 33 M62 4 L80 33" stroke={wood} strokeWidth={6.5} strokeLinecap="round" />
      {/* the inside (empty), then the front of the box */}
      <path d="M-76 -34 L76 -34 L86 -24 L-86 -24 Z" fill={darken(wood, 0.45)} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-86 -24 L86 -24 L68 12 L-68 12 Z" fill={w.fill} stroke={line} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-80 -12 L80 -12 M-74 0 L74 0" stroke={darken(wood, 0.18)} strokeWidth={2.5} />
      {[-1, 1].map((d) => <circle key={d} cx={d * 74} cy={-18} r={2.4} fill={darken(wood, 0.45)} />)}
      <ellipse cx={-48} cy={-17} rx={15} ry={3.5} fill="#fff" opacity={0.25} />
    </g>
  )
}

/** Fresh golden hay, heaped up to fill the manger, with straws poking out and wisps hanging over its front. */
function Hay() {
  const straw = '#f5cf5a'
  const hay = useShade(straw, 0.4, 0.15)
  const dark = darken(straw, 0.24)
  return (
    <g>
      <defs>{hay.def}</defs>
      <path d="M-70 4 L-82 -4 M70 2 L83 -6 M-40 -14 L-46 -26 M-8 -20 L-8 -31 M26 -18 L32 -29 M52 -8 L62 -18" stroke={dark} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M-84 20 C-88 6 -76 -4 -62 -4 C-58 -16 -40 -20 -28 -14 C-20 -24 2 -26 12 -18 C24 -26 46 -20 50 -10 C66 -12 82 -2 84 20 Z"
        fill={hay.fill} stroke={ink(straw)} strokeWidth={2.8} strokeLinejoin="round" />
      <path d="M-62 4 q8 -8 18 -8 M-30 -4 q10 -8 20 -6 M6 -6 q10 -8 20 -5 M34 2 q9 -6 18 -4 M-46 12 q8 -6 16 -6 M14 12 q8 -6 18 -5 M52 12 q6 -4 14 -2"
        stroke={dark} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M-60 19 q-1 6 -5 10 M-24 19 q2 6 -1 10 M18 19 q2 5 6 9 M54 19 q2 5 6 8" stroke={darken(straw, 0.08)} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * A soft cream blanket with pale blue stripes (the one baby Jesus is wrapped in on page 6), laid over the
 * heap of hay, so the hay still shows at its sides, its wavy hem just over the front of the manger.
 */
function Blanket() {
  const id = gid(useId())
  const cream = '#fff7e8'
  const c = useShade(cream, 0.5, 0.1)
  const line = darken(cream, 0.3)
  const cloth = 'M-56 16 C-61 2 -54 -13 -36 -21 C-20 -27 20 -27 36 -21 C54 -13 61 2 56 16 C48 21 40 17 32 21 C24 25 16 20 8 24 '
    + 'C0 27 -8 22 -16 25 C-24 28 -32 22 -40 25 C-48 27 -52 20 -56 16 Z'
  return (
    <g>
      <defs>{c.def}<clipPath id={id}><path d={cloth} /></clipPath></defs>
      <path d={cloth} fill={c.fill} stroke={line} strokeWidth={2.6} strokeLinejoin="round" />
      <g clipPath={`url(#${id})`}>
        <path d="M-62 8 C-30 14 30 14 62 8 M-62 -1 C-30 5 30 5 62 -1" stroke="#a9cdf0" strokeWidth={3.6} fill="none" />
        <path d="M-22 -22 C-25 -4 -20 10 -18 26 M20 -22 C23 -4 18 10 16 26" stroke={line} strokeWidth={1.8} fill="none" opacity={0.5} />
      </g>
    </g>
  )
}

/** The lamp (as on page 6): a little lantern glowing warm, with a ring on top to hang it by. */
function Lamp() {
  const id = gid(useId())
  return (
    <g>
      <defs>
        <radialGradient id={id}><stop offset="0" stopColor="#ffe9a0" stopOpacity={0.8} /><stop offset="1" stopColor="#ffd98a" stopOpacity={0} /></radialGradient>
      </defs>
      <circle cx={0} cy={2} r={40} fill={`url(#${id})`} className="pa-twinkle" />
      <circle cx={0} cy={-28} r={5} fill="none" stroke="#7d7d8c" strokeWidth={3} />
      <rect x={-6} y={-25} width={12} height={5} rx={1.5} fill="#7a5233" />
      <rect x={-16} y={-22} width={32} height={44} rx={8} fill="#ffe8a0" stroke="#7a5233" strokeWidth={4} />
      <path d="M0 12 C-7 7 -6 -1 0 -9 C6 -1 7 7 0 12 Z" fill="#ffb347" opacity={0.85} />
      <path d="M0 10 C-3 7 -3 3 0 -2 C3 3 3 7 0 10 Z" fill="#fff4b0" />
    </g>
  )
}

/** The bright star (as on page 6, a little bigger), twinkling, with a soft glow around it. */
function Star() {
  const id = gid(useId())
  return (
    <g>
      <defs>
        <radialGradient id={id}><stop offset="0.3" stopColor="#fff3a0" stopOpacity={0.6} /><stop offset="1" stopColor="#fff3a0" stopOpacity={0} /></radialGradient>
      </defs>
      <circle r={26} fill={`url(#${id})`} />
      <path d={sparkle(0, 0, 17)} fill="#fff3a0" stroke="#e8c84a" strokeWidth={2} strokeLinejoin="round" />
      <g className="pa-twinkle"><path d={sparkle(0, 0, 8)} fill="#ffffff" transform="rotate(45)" /></g>
    </g>
  )
}

/** All ready: the stable fills with a warm golden glow, and sparkles twinkle all around the manger. */
function Finished() {
  const id = gid(useId())
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#fff2b8" stopOpacity={0.26} />
          <stop offset="0.55" stopColor="#ffd970" stopOpacity={0.14} />
          <stop offset="1" stopColor="#ffc850" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={400} cy={270} r={300} fill={`url(#${id})`} />
      <Sparkles spots={[[300, 284, 11], [506, 278, 12], [404, 240, 8], [246, 352, 8], [566, 346, 9], [338, 214, 7], [470, 206, 8]]} />
    </g>
  )
}

export const CHRISTMAS_GAME: BuildKit = {
  Backdrop,
  // (the cozy mat first, then the manger and what goes in it, then the light: the lamp and the star.
  // The blanket names the manger too: tried first, it hears "First the manger!" while the manger
  // lights up in the tray.)
  parts: [
    { id: 'mat', say: 'the cozy mat', Draw: Mat, at: [190, 410], size: [212, 36] },
    { id: 'manger', say: 'the manger', Draw: Manger, at: [400, 385], size: [176, 72] },
    { id: 'hay', say: 'the soft hay', Draw: Hay, at: [400, 341], size: [170, 60], after: ['manger'] },
    { id: 'blanket', say: 'the warm blanket', Draw: Blanket, at: [400, 339], size: [120, 56], after: ['manger', 'hay'] },
    { id: 'lamp', say: 'the lamp', Draw: Lamp, at: [HOOK.x, HOOK.y + 32], size: [56, 84] },
    { id: 'star', say: 'the bright star', Draw: Star, at: [STAR.x, STAR.y], size: [52, 52] },
  ],
  Finished,
}
