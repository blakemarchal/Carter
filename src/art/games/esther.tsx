// Queen Esther: the island's mini-game, "Paint it" (color by number; activities/games/types.ts, PaintKit):
// "Esther's Royal Robe". Queen Esther stands before the throne room's curtains, filling the board, and every part
// of her crown and royal robe is a region to paint, each big enough for small fingers. The paints are the story's
// own colors (scenes/esther.tsx, ESTHER_COLORS), so she comes out just as she looks in the story:
//   1 gold: her crown and her sash;
//   2 purple: her robe (its top, the two sleeves and the two sides of the skirt);
//   3 pink: the front of her robe, and her cape on each side;
//   4 blue: the curtains, which come out blue and white, like the palace's hangings (Esther 1:6).
// When every part is painted, Esther beams, and a warm light shines behind her.
import { useId } from 'react'
import type { At, PaintKit } from '../../activities/games/types'
import { Head } from '../people'
import { Glow, Scene, Sparkles } from '../scenes/kit'
import { Cord, curtainFolds, curtainPath, ESTHER, ESTHER_COLORS, EstherFace, Rod, TileBand, type Curtain } from '../scenes/esther'
import { ESTHER_CROWN_D, EstherCrownJewels } from '../items/isl-esther'

const INK = '#5a3a5a'
const SKIN = ESTHER.skin
const f1 = (n: number) => n.toFixed(1)

/** Her head: the Head drawing at twice a Person's size, its middle at (400, 120). */
const HEAD = 'translate(400 348) scale(2)'
/** Her crown, in the head's units, a little bigger again (1.2 times, about the foot of its band), so it's easy to tap. */
const CROWN = 'translate(0 -128) scale(1.2) translate(0 128)'

/** A path on the board's left, mirrored onto its right (every point written "x y"). */
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${f1(800 - Number(x))} ${y}`)

// ---------- Her robe, in board units (the left side; the right is its mirror) ----------

/** The top of her robe, from the neckline and shoulders down to her waist (it's the same on both sides). */
const BODICE = 'M378 176 Q400 194 422 176 L448 184 L440 252 L360 252 L352 184 Z'
/** A wide bell sleeve: from the shoulder down the arm to its bell, and back up to the armpit. */
const SLEEVE = 'M368 176 C340 180 294 240 256 306 Q288 338 326 344 C340 304 360 258 374 228 C372 210 372 192 368 176 Z'
/** One side of the skirt, from the waist (under the sash) to the hem. */
const SKIRT = 'M362 270 L388 270 L346 446 Q300 444.4 254 440 Z'
/** The front of the skirt, pink like hers in the story, between the two sides. */
const FRONT = 'M388 270 L412 270 L454 446 Q400 448 346 446 Z'
/** Her cape, behind her: what shows of it below the sleeve and beside the skirt (the rest is hidden behind them). */
const CAPE = 'M272 268 C258 320 220 394 186 446 Q226 451 266 444 L340 400 L350 300 Z'
/** Her sash: the band round her waist, its knot, and the two ends hanging down. */
const SASH = 'M361 240 Q400 251 439 240 L444 277 Q400 288 356 277 Z M386 246 L414 246 L416 280 L384 280 Z M386 278 L398 280 L392 338 L384 329 L376 340 Z M414 278 L402 280 L408 338 L416 329 L424 340 Z'

/** The curtains, swept back and tied with purple cords, from a silver rod along the top. */
const CURTAINS: Curtain[] = [
  { a: -8, b: 270, top: 30, tie: [112, 262], tw: 30, c: -8, d: 178, bottom: 452 },
  { a: 530, b: 808, top: 30, tie: [688, 262], tw: 30, c: 622, d: 808, bottom: 452 },
]

// Each region: its number, where its number goes, and its shape (the crown's is drawn on her head, in its units).
const REGIONS: { id: string; n: number; at: At; d?: string }[] = [
  { id: 'crown', n: 1, at: [400, 58] },
  { id: 'sash', n: 1, at: [400, 263], d: SASH },
  { id: 'bodice', n: 2, at: [400, 220], d: BODICE },
  { id: 'sleeve-left', n: 2, at: [318, 270], d: SLEEVE },
  { id: 'sleeve-right', n: 2, at: [482, 270], d: mirror(SLEEVE) },
  { id: 'skirt-left', n: 2, at: [320, 398], d: SKIRT },
  { id: 'skirt-right', n: 2, at: [480, 398], d: mirror(SKIRT) },
  { id: 'front', n: 3, at: [400, 396], d: FRONT },
  { id: 'cape-left', n: 3, at: [244, 402], d: CAPE },
  { id: 'cape-right', n: 3, at: [556, 402], d: mirror(CAPE) },
  { id: 'curtain-left', n: 4, at: [110, 140], d: curtainPath(CURTAINS[0]) },
  { id: 'curtain-right', n: 4, at: [690, 140], d: curtainPath(CURTAINS[1]) },
]
const shape = (id: string) => REGIONS.find((r) => r.id === id)!.d!

/** The parts of her (not the curtains), for the soft shading over her robe. */
const HER = ['cape-left', 'cape-right', 'skirt-left', 'skirt-right', 'front', 'bodice', 'sash', 'sleeve-left', 'sleeve-right']

/**
 * The picture: Queen Esther in her royal robe and crown, before the curtains of the throne room, in front of a
 * golden doorway. Each part to paint is a region (white until it's painted). Anything drawn over a region (the
 * curtains' stripes and folds, the jewels on her crown, the gold edges of her robe) lets taps through to it.
 */
function RobePicture({ fills }: { fills: Record<string, string> }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const done = REGIONS.every((r) => fills[r.id])
  const region = (id: string) => <path key={id} data-region={id} d={shape(id)} fill={fills[id] ?? '#ffffff'} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`dw${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6d6" /><stop offset="1" stopColor="#f6dca0" /></linearGradient>
        <radialGradient id={`sh${uid}`} cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity={0.3} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#3b1f3b" stopOpacity={0.2} />
        </radialGradient>
        <clipPath id={`her${uid}`}>{HER.map((id) => <path key={id} d={shape(id)} />)}</clipPath>
      </defs>
      {/* the palace wall, its band of blue tiles, the marble floor, and the golden doorway behind her */}
      <rect width={800} height={450} fill="#f3dfb6" />
      <TileBand y={0} h={22} />
      <rect y={416} width={800} height={34} fill="#f3e8d8" />
      <path d="M0 416 H800 M0 432 H800" stroke="#e0c58c" strokeWidth={1.5} />
      <path d="M296 450 V162 A104 104 0 0 1 504 162 V450 Z" fill={`url(#dw${uid})`} />
      <path d="M296 450 V162 A104 104 0 0 1 504 162 V450" fill="none" stroke="#3f6fb6" strokeWidth={10} />
      <path d="M285 450 V162 A115 115 0 0 1 515 162 V450" fill="none" stroke={ESTHER_COLORS.gold} strokeWidth={3} />
      {done && <Glow x={400} y={210} r={250} color="#fff3c0" />}
      {/* the curtains to paint, their white stripes and folds, and the cords tying them back */}
      {region('curtain-left')}
      {region('curtain-right')}
      <g pointerEvents="none">
        {CURTAINS.map((k, j) => (
          <g key={j}>
            {Array.from({ length: 8 }, (_, i) => (i % 2 ? <path key={i} d={curtainPath(k, i / 8, (i + 1) / 8)} fill="#ffffff" /> : null))}
            <path d={curtainFolds(k, 8)} stroke={INK} strokeWidth={1.2} fill="none" opacity={0.28} />
            <path d={curtainPath(k)} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <Cord at={k.tie} w={k.tw} side={j ? 1 : -1} />
          </g>
        ))}
        <Rod x0={-10} x1={810} y={28} />
      </g>
      {/* her hair, behind her shoulders */}
      <path d="M346 118 C332 160 334 200 346 228 L454 228 C466 200 468 160 454 118 Z" fill="#2e1c14" />
      {/* her cape and skirt, the front of her robe, its top and her sash */}
      {region('cape-left')}
      {region('cape-right')}
      {region('skirt-left')}
      {region('skirt-right')}
      {region('front')}
      <path d="M388 140 L412 140 L415 186 Q400 194 385 186 Z" fill={SKIN} stroke="#a8724a" strokeWidth={2.5} />
      {region('bodice')}
      {region('sash')}
      {/* her hands, out of the bells of her sleeves */}
      {[284, 516].map((hx) => <circle key={hx} cx={hx} cy={346} r={16} fill={SKIN} stroke="#a8724a" strokeWidth={3} />)}
      {region('sleeve-left')}
      {region('sleeve-right')}
      {/* soft shading over her robe, and its gold edges (taps go through them) */}
      <g pointerEvents="none">
        <rect x={150} y={150} width={500} height={300} fill={`url(#sh${uid})`} clipPath={`url(#her${uid})`} />
        <path d={`M389 282 L348 442 M411 282 L452 442`} stroke={ESTHER_COLORS.gold} strokeWidth={4} strokeLinecap="round" />
        <path d="M192 441 Q228 446 262 440 M538 440 Q572 446 608 441" stroke={ESTHER_COLORS.gold} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M330 300 Q322 372 300 436 M470 300 Q478 372 500 436" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.25} />
        <path d="M390 286 L396 334 M410 286 L404 334" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.3} />
      </g>
      {/* Queen Esther's face and hair, and her crown to paint, with its pearls and jewels */}
      <g transform={HEAD}>
        <g pointerEvents="none">
          <Head look={ESTHER} mood={done ? 'joy' : 'happy'} />
          <EstherFace />
        </g>
        <g transform={CROWN}>
          <path data-region="crown" d={ESTHER_CROWN_D} fill={fills.crown ?? '#ffffff'} stroke={INK} strokeWidth={1.7} strokeLinejoin="round" />
          <g pointerEvents="none"><EstherCrownJewels /></g>
        </g>
      </g>
      {done && (
        <g pointerEvents="none">
          <Sparkles spots={[[300, 40, 10], [500, 44, 10], [220, 200, 8], [580, 196, 8], [150, 360, 7], [650, 356, 7], [400, 152, 6]]} color="#ffe680" />
        </g>
      )}
    </Scene>
  )
}

export const ESTHER_PAINT: PaintKit = {
  Picture: RobePicture,
  regions: REGIONS.map(({ id, n, at }) => ({ id, n, at })),
  palette: [
    { n: 1, color: ESTHER_COLORS.gold, name: 'gold' },
    { n: 2, color: ESTHER_COLORS.purple, name: 'purple' },
    { n: 3, color: ESTHER_COLORS.pink, name: 'pink' },
    { n: 4, color: ESTHER_COLORS.blue, name: 'blue' },
  ],
}
