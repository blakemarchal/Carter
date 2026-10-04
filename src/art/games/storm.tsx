// Jesus Calms the Storm: the island's mini-game, "Paint it" (color by number; activities/games/types.ts, PaintKit):
// "Paint the Boat". The fishing boat from the story (scenes/storm.tsx, FishingBoat) sails across the lake in the evening,
// before the storm, with Jesus and His four friends aboard, and nearly everything round them is a region to paint, each
// big enough for small fingers:
//   1 yellow: the setting sun and the sail;
//   2 orange: the glowing sky low down, over the hills;
//   3 purple: the far hills on the other side of the lake;
//   4 green: the near hills on each side;
//   5 blue: the sky up high, and the lake, near and far;
//   6 brown: the boat's wooden hull.
// The people, the mast, the blue band along the boat's side (as in the story) and the little boats far off are drawn
// already. When every part is painted, the sun glows, its golden path shines on the lake, and the water sparkles.
import { useId } from 'react'
import type { At, PaintKit } from '../../activities/games/types'
import { Figure, PEOPLE } from '../people'
import { Glow, Scene, Sparkles } from '../scenes/kit'
import { BOAT, BOAT_COLORS, Gulls, LittleBoat } from '../scenes/storm'

const INK = '#4a3a5a'

/** Where the boat is, and how big (board units: its waterline's middle). */
const BX = 400, BY = 396, BS = 1
const inBoat = `translate(${BX} ${BY}) scale(${BS})`
/** A point in the boat's own units, on the board. */
const boat = (x: number, y: number): At => [BX + x * BS, BY + y * BS]

// ---------- The regions, in board units (the boat's own are its shapes, drawn in the boat) ----------

const SKY_TOP = 'M0 0 L800 0 L800 106 Q700 122 600 106 Q500 90 400 108 Q300 126 200 106 Q100 88 0 104 Z'
const SKY_GLOW = 'M0 104 Q100 88 200 106 Q300 126 400 108 Q500 90 600 106 Q700 122 800 106 L800 242 L0 242 Z'
const SUN = 'M612 184 A40 40 0 1 1 692 184 A40 40 0 1 1 612 184 Z'
const FAR_HILLS = 'M0 206 Q70 176 150 194 Q230 212 300 190 Q380 166 470 188 Q560 212 640 190 Q720 170 800 194 L800 242 L0 242 Z'
const HILL_LEFT = 'M0 150 Q60 146 112 176 Q154 200 186 242 L0 242 Z'
const HILL_RIGHT = 'M800 166 Q752 164 712 186 Q672 208 640 242 L800 242 Z'
const WATER_FAR = 'M0 236 L800 236 L800 310 Q700 298 600 310 Q500 324 400 310 Q300 296 200 310 Q100 324 0 310 Z'
const WATER_NEAR = 'M0 310 Q100 324 200 310 Q300 296 400 310 Q500 324 600 310 Q700 298 800 310 L800 450 L0 450 Z'

/** Each region: its number, where its number goes, its shape, and whether it's drawn in the boat's units. */
const REGIONS: { id: string; n: number; at: At; d: string; inBoat?: boolean }[] = [
  { id: 'sky-top', n: 5, at: [130, 52], d: SKY_TOP },
  { id: 'sky-glow', n: 2, at: [226, 142], d: SKY_GLOW },
  { id: 'sun', n: 1, at: [652, 168], d: SUN },
  { id: 'far-hills', n: 3, at: [250, 216], d: FAR_HILLS },
  { id: 'hill-left', n: 4, at: [52, 198], d: HILL_LEFT },
  { id: 'hill-right', n: 4, at: [758, 208], d: HILL_RIGHT },
  { id: 'water-far', n: 5, at: [72, 272], d: WATER_FAR },
  { id: 'water-near', n: 5, at: [736, 404], d: WATER_NEAR },
  { id: 'sail', n: 1, at: boat(36, -212), d: BOAT.sail, inBoat: true },
  { id: 'hull', n: 6, at: boat(-20, 15), d: BOAT.hull, inBoat: true },
]
const shape = (id: string) => REGIONS.find((r) => r.id === id)!.d

/** Jesus and His friends in the boat (boat units, feet on its floor): Jesus at the back, John waving, Peter at the mast. */
function Crew() {
  return (
    <g>
      <Figure x={-178} y={2} s={0.95} look={PEOPLE.jesus} />
      <Figure x={-108} y={-6} s={0.9} look={PEOPLE.john} pose="wave" blinkDelay={0.7} />
      <Figure x={-30} y={-6} s={0.9} look={PEOPLE.peter} reach={[null, [66.7, -88.9]]} blinkDelay={1.6} />
      <Figure x={104} y={-6} s={0.9} look={PEOPLE.andrew} blinkDelay={0.3} />
      <Figure x={172} y={-6} s={0.9} look={PEOPLE.james} pose="wave" blinkDelay={2.1} />
    </g>
  )
}

/**
 * The picture: the boat sailing across the lake at sunset, with Jesus and His friends aboard. Each part to paint is a
 * region (white until it's painted); anything drawn over a region (the people, the mast, the seams of the sail, the
 * little boats far off) lets taps through to it.
 */
function BoatPicture({ fills }: { fills: Record<string, string> }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const done = REGIONS.every((r) => fills[r.id])
  const C = BOAT_COLORS
  const region = (id: string) => {
    const r = REGIONS.find((q) => q.id === id)!
    return <path key={id} data-region={id} d={r.d} fill={fills[id] ?? '#ffffff'} stroke={INK} strokeWidth={r.inBoat ? 4 / BS : 4} strokeLinejoin="round" />
  }
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <clipPath id={`hl${uid}`}><path d={shape('hull')} /></clipPath>
      </defs>
      {region('sky-top')}
      {region('sky-glow')}
      {region('sun')}
      {done && <Glow x={652} y={190} r={120} color="#fff1b0" />}
      <g pointerEvents="none"><Gulls spots={[[560, 64, 0.8], [612, 46, 0.6]]} color="#ffffff" /></g>
      {region('far-hills')}
      {region('hill-left')}
      {region('hill-right')}
      {region('water-far')}
      {region('water-near')}
      {/* little boats far off, and the little waves (taps go through them) */}
      <g pointerEvents="none">
        <LittleBoat x={738} y={284} s={0.22} sail="#ffe8f0" hull="#9a6a44" />
        {[[40, 352], [118, 380], [690, 352], [760, 436], [52, 428], [670, 440]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q16 -7 32 0`} stroke="#ffffff" strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.8} />
        ))}
      </g>
      {/* all painted: the setting sun's golden path shines on the lake */}
      {done && (
        <g pointerEvents="none" className="sc-wave slow">
          {/* (close under the hills, where the boat's prow doesn't hide it) */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = 245 + i * 8 + i * i * 1.4, w = 34 + i * 16
            return <path key={i} d={`M${664 - w / 2 + (i % 2 ? 8 : -4)} ${y} l${w} 0`} stroke="#ffd77a" strokeWidth={3.6 + i * 0.5} strokeLinecap="round" opacity={0.95 - i * 0.07} />
          })}
        </g>
      )}
      {/* the boat: its mast, flag and yard; the sail to paint; Jesus and His friends; then its hull to paint */}
      <g transform={inBoat}>
        <g pointerEvents="none">
          <path d={BOAT.inside} fill={C.inside} />
          <path d={BOAT.farRim} stroke={C.rim} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M34 -300 L240 -90" stroke="#8a6a4a" strokeWidth={2} />
          <path d="M34 -20 L34 -312" stroke={C.mast} strokeWidth={9} strokeLinecap="round" />
          <path d="M34 -311 Q58 -312 66 -302 Q50 -299 34 -293 Z" fill={C.flag} stroke="#8a3a2a" strokeWidth={2} strokeLinejoin="round" />
          <path d="M-96 -270 L154 -285" stroke={C.mast} strokeWidth={7} strokeLinecap="round" />
          <path d="M-80 -146 L-132 -48 M146 -152 L196 -68" stroke="#8a6a4a" strokeWidth={2} />
        </g>
        {region('sail')}
        <g pointerEvents="none">
          <path d="M30 -277 Q38 -210 32 -138 M-84 -232 Q34 -246 156 -250 M-88 -190 Q36 -200 160 -204" stroke={INK} strokeWidth={1.4} fill="none" opacity={0.35} />
          <Crew />
        </g>
        {region('hull')}
        {/* the blue band along the hull, and its plank seams (taps go through to the hull) */}
        <g pointerEvents="none">
          <g clipPath={`url(#hl${uid})`}>
            <path d={BOAT.stripe} fill={C.stripe} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
            <path d="M-262 -6 Q-10 46 262 -22 M-262 14 Q-10 62 262 -2" stroke={INK} strokeWidth={2} fill="none" opacity={0.35} />
          </g>
          <path d={BOAT.hull} fill="none" stroke={INK} strokeWidth={4 / BS} strokeLinejoin="round" />
          <path d={BOAT.rim} stroke={C.rim} strokeWidth={7} fill="none" strokeLinecap="round" />
          {['M244 -80 Q264 -98 258 -120 Q254 -130 244 -124', 'M-248 -64 Q-264 -80 -258 -96'].map((d) => (
            <g key={d}>
              <path d={d} stroke={C.line} strokeWidth={10} fill="none" strokeLinecap="round" />
              <path d={d} stroke={C.rim} strokeWidth={5} fill="none" strokeLinecap="round" />
            </g>
          ))}
        </g>
      </g>
      {done && (
        <g pointerEvents="none">
          <Sparkles spots={[[90, 360, 9], [200, 420, 7], [620, 300, 8], [720, 380, 9], [560, 430, 7], [470, 60, 8], [80, 70, 7]]} color="#fff6c0" />
        </g>
      )}
    </Scene>
  )
}

export const STORM_PAINT: PaintKit = {
  Picture: BoatPicture,
  regions: REGIONS.map(({ id, n, at }) => ({ id, n, at })),
  palette: [
    { n: 1, color: '#ffd84d', name: 'yellow' },
    { n: 2, color: '#ffa65c', name: 'orange' },
    { n: 3, color: '#9c80d4', name: 'purple' },
    { n: 4, color: '#6cc46a', name: 'green' },
    { n: 5, color: '#4f9fe0', name: 'blue' },
    { n: 6, color: BOAT_COLORS.wood, name: 'brown' },
  ],
}
