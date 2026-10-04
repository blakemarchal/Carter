// Easter Morning: the island's mini-game, "Paint it" (color by number; activities/games/types.ts, PaintKit):
// "Paint the Easter Garden". It comes after part two of the story, once the tomb is empty: the garden on Easter
// morning, with the big round stone rolled away from the tomb, the doorway full of light, the sun coming up, spring
// flowers and a butterfly. Every part is a region to paint, each big enough for small fingers:
//   1 yellow: the sun, and two of the flowers;
//   2 orange: the glowing sky low down, and the butterfly;
//   3 purple: the far hills, and the other two flowers;
//   4 green: the grass, the meadow far off, and the olive tree;
//   5 blue: the sky up high;
//   6 gray: the rock of the tomb, and the big round stone.
// The doorway's light inside, the path, the tree's trunk and the flowers' stems are drawn already. When every part is
// painted, the sun shines out, the doorway glows, and sparkles twinkle all over the garden.
import { useId } from 'react'
import type { At, PaintKit } from '../../activities/games/types'
import { Glow, Rays, Scene, Sparkles } from '../scenes/kit'
import { EmptyInside, STONE_R, stoneX, TOMB } from '../scenes/easter'

const INK = '#5a4a5a'

/** Where the tomb is on the board, and how big (its doorway's foot). */
const TX = 214, TY = 362, TS = 0.95
const inTomb = `translate(${TX} ${TY}) scale(${TS})`
/** A point in the tomb's own units, on the board. */
const tomb = (x: number, y: number): At => [TX + x * TS, TY + y * TS]
const STONE_AT = tomb(stoneX(1), -STONE_R + 6)

/** A circle as a path, for a region (and the sun). */
const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} Z`

/**
 * A flower's outline round (cx, cy), r to the tips of its petals: six round petals, one shape (so it paints all at
 * once). Each petal is an arc bulging out between two dips, the dips a little over half way out.
 */
const petals = (cx: number, cy: number, r: number) => {
  const dip = (i: number) => {
    const a = (i * 60 - 120) * (Math.PI / 180)
    return `${(cx + Math.cos(a) * r * 0.56).toFixed(1)} ${(cy + Math.sin(a) * r * 0.56).toFixed(1)}`
  }
  const rr = (r * 0.31).toFixed(1)
  return `M${dip(0)} ${Array.from({ length: 6 }, (_, i) => `A${rr} ${rr} 0 1 1 ${dip(i + 1)}`).join(' ')} Z`
}

// ---------- The regions, in board units (the tomb's rock in its own units) ----------

const SKY = 'M0 0 L800 0 L800 124 Q700 142 600 128 Q500 114 400 132 Q300 150 200 130 Q100 112 0 128 Z'
const GLOW = 'M0 128 Q100 112 200 130 Q300 150 400 132 Q500 114 600 128 Q700 142 800 124 L800 280 L0 280 Z'
const SUN = circle(556, 240, 54)
const HILLS = 'M0 236 Q80 206 170 222 Q260 238 340 214 Q430 190 520 214 Q600 236 680 218 Q750 204 800 214 L800 320 L0 320 Z'
const MEADOW = 'M0 296 Q140 278 300 288 Q470 298 620 282 Q720 272 800 280 L800 350 L0 350 Z'
const GRASS = 'M0 340 Q160 330 320 338 Q500 346 650 334 Q740 328 800 332 L800 450 L0 450 Z'
/** The olive tree's leafy crown, one shape of round clumps. */
const TREE = 'M622 262 Q604 236 626 214 Q634 186 664 190 Q680 166 712 174 Q742 166 758 190 Q790 196 788 226 Q806 250 784 270 Q776 296 746 292 Q726 310 700 298 Q672 312 652 292 Q620 290 622 262 Z'
/** Where the butterfly is (the middle of its body). */
const BX = 412, BY = 110
/** The butterfly's four wings, as one shape, round the middle of its body (its body is drawn over them). */
const WINGS = 'M-4 -2 C-16 -26 -42 -44 -60 -36 C-74 -28 -70 -6 -54 4 C-40 12 -18 8 -4 2 Z M-4 2 C-18 6 -38 14 -42 30 C-44 44 -28 48 -18 38 C-10 28 -6 16 -4 6 Z ' +
  'M4 -2 C16 -26 42 -44 60 -36 C74 -28 70 -6 54 4 C40 12 18 8 4 2 Z M4 2 C18 6 38 14 42 30 C44 44 28 48 18 38 C10 28 6 16 4 6 Z'
const FLOWERS: { id: string; n: number; at: At; r: number }[] = [
  { id: 'flower-left', n: 1, at: [74, 398], r: 40 },
  { id: 'flower-middle', n: 3, at: [176, 420], r: 36 },
  { id: 'flower-right', n: 1, at: [652, 404], r: 38 },
  { id: 'flower-corner', n: 3, at: [748, 392], r: 34 },
]

/** Each region: its number, where its number goes, its shape, and the units it's drawn in (`tf`: its place on the board, and its scale `k`). */
const REGIONS: { id: string; n: number; at: At; d: string; tf?: string; k?: number }[] = [
  { id: 'sky', n: 5, at: [116, 56], d: SKY },
  { id: 'glow', n: 2, at: [652, 170], d: GLOW },
  { id: 'sun', n: 1, at: [556, 216], d: SUN },
  { id: 'hills', n: 3, at: [470, 258], d: HILLS },
  { id: 'meadow', n: 4, at: [560, 310], d: MEADOW },
  { id: 'grass', n: 4, at: [520, 404], d: GRASS },
  { id: 'tree', n: 4, at: [706, 236], d: TREE },
  { id: 'rock', n: 6, at: tomb(-128, -112), d: TOMB.rock, tf: inTomb, k: TS },
  { id: 'stone', n: 6, at: STONE_AT, d: circle(STONE_AT[0], STONE_AT[1], STONE_R * TS) },
  { id: 'butterfly', n: 2, at: [BX - 36, BY - 14], d: WINGS, tf: `translate(${BX} ${BY})` },
  ...FLOWERS.map((f) => ({ id: f.id, n: f.n, at: f.at, d: petals(f.at[0], f.at[1], f.r) })),
]

/**
 * The picture: the garden on Easter morning. Each part to paint is a region (white until it's painted); anything drawn
 * over a region (the doorway and its light, the path, the tree's trunk, the flowers' middles, the butterfly's body)
 * lets taps through to it.
 */
function GardenPicture({ fills }: { fills: Record<string, string> }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const done = REGIONS.every((r) => fills[r.id])
  const region = (id: string) => {
    const r = REGIONS.find((q) => q.id === id)!
    const path = <path key={id} data-region={id} d={r.d} fill={fills[id] ?? '#ffffff'} stroke={INK} strokeWidth={4 / (r.k ?? 1)} strokeLinejoin="round" />
    return r.tf ? <g key={id} transform={r.tf}>{path}</g> : path
  }
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs><clipPath id={`gr${uid}`}><path d={GRASS} /></clipPath></defs>
      {region('sky')}
      {region('glow')}
      {region('sun')}
      {done && (
        <g pointerEvents="none">
          <Rays x={556} y={240} r={300} n={16} color="#fff4b0" opacity={0.55} />
          <Glow x={556} y={240} r={130} color="#fff1b0" />
        </g>
      )}
      {region('hills')}
      {region('meadow')}
      {region('grass')}
      {/* the path from the tomb's door, and little tufts in the grass (taps go through them) */}
      <g pointerEvents="none">
        <path d="M168 366 C236 378 318 404 372 452 L478 452 C420 400 330 368 262 358 Z" fill="#f0dcb0" stroke={INK} strokeWidth={3} strokeLinejoin="round" clipPath={`url(#gr${uid})`} />
        {[[300, 432], [560, 440], [458, 360], [610, 352], [40, 352], [120, 446]].map(([x, y], i) => (
          <path key={i} d={`M${x - 6} ${y} l3 -9 l3 9 l3 -11 l3 11`} stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
        ))}
        {/* the olive tree's trunk */}
        <path d="M690 380 C686 360 698 346 692 326 C688 312 680 304 674 292 L684 288 C692 300 700 306 704 314 C708 302 716 294 724 288 L732 294 C722 304 716 316 716 330 C716 346 724 362 720 380 Z" fill="#8f7a64" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      </g>
      {region('tree')}
      {/* the tomb: its rock, its doorway full of light, and the round stone rolled away */}
      {region('rock')}
      <g transform={inTomb} pointerEvents="none">
        <path d={TOMB.frame} fill="none" stroke={INK} strokeWidth={3 / TS} />
        <EmptyInside />
        <path d={TOMB.door} fill="none" stroke={INK} strokeWidth={4 / TS} />
        <path d={TOMB.groove} fill="#d8cbb4" stroke={INK} strokeWidth={3 / TS} strokeLinejoin="round" />
        <path d={TOMB.tufts} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
        <path d="M-170 -60 q24 -8 44 2 M120 -96 q22 -6 40 4" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.4} />
        {done && <Glow x={0} y={-50} r={120} color="#fff4c8" />}
      </g>
      {/* the stone's rim, behind it (taps on it go through to the stone) */}
      <g pointerEvents="none">
        <circle cx={STONE_AT[0] + 8} cy={STONE_AT[1] + 1} r={STONE_R * TS} fill="#ffffff" stroke={INK} strokeWidth={4} />
      </g>
      {region('stone')}
      <g pointerEvents="none">
        <circle cx={STONE_AT[0]} cy={STONE_AT[1]} r={STONE_R * TS * 0.68} fill="none" stroke={INK} strokeWidth={2} opacity={0.35} />
      </g>
      {/* the flowers: stems and leaves, the petals to paint, and their dark middles */}
      <g pointerEvents="none">
        {FLOWERS.map((f) => (
          <g key={f.id} stroke={INK} strokeWidth={2.4} strokeLinejoin="round">
            <path d={`M${f.at[0]} ${f.at[1] + f.r * 0.5} Q${f.at[0] - 4} ${f.at[1] + f.r * 1.2} ${f.at[0]} 456`} fill="none" strokeWidth={4} />
            <path d={`M${f.at[0]} ${f.at[1] + f.r * 1.3} q-20 -10 -26 4 q12 6 26 -4 Z`} fill="#6cbf5f" />
          </g>
        ))}
      </g>
      {FLOWERS.map((f) => region(f.id))}
      {/* (a flower's dark middle shows once it's painted, so its number sits on white until then) */}
      <g pointerEvents="none">
        {FLOWERS.map((f) => fills[f.id] && <circle key={f.id} cx={f.at[0]} cy={f.at[1]} r={f.r * 0.24} fill="#5a3a4a" stroke={INK} strokeWidth={2} />)}
      </g>
      {/* the butterfly: its wings to paint, then its body and feelers */}
      {region('butterfly')}
      <g pointerEvents="none" strokeLinecap="round" transform={`translate(${BX} ${BY})`}>
        <path d="M0 -26 Q-8 -42 -16 -48 M0 -26 Q8 -42 16 -48" stroke={INK} strokeWidth={2.4} fill="none" />
        <ellipse cx={0} cy={2} rx={6} ry={26} fill="#5a4a6a" stroke={INK} strokeWidth={2} />
        <circle cx={0} cy={-24} r={7} fill="#5a4a6a" stroke={INK} strokeWidth={2} />
      </g>
      {done && (
        <g pointerEvents="none">
          <Sparkles spots={[[90, 160, 10], [300, 90, 8], [720, 70, 10], [560, 300, 7], [400, 420, 8], [760, 330, 8], [40, 40, 7]]} color="#fff6c0" />
        </g>
      )}
    </Scene>
  )
}

export const EASTER_PAINT: PaintKit = {
  Picture: GardenPicture,
  regions: REGIONS.map(({ id, n, at }) => ({ id, n, at })),
  palette: [
    { n: 1, color: '#ffd84d', name: 'yellow' },
    { n: 2, color: '#ffa65c', name: 'orange' },
    { n: 3, color: '#a98ce0', name: 'purple' },
    { n: 4, color: '#6cc46a', name: 'green' },
    { n: 5, color: '#7cc4f2', name: 'blue' },
    { n: 6, color: '#bdb4a6', name: 'gray' },
  ],
}
