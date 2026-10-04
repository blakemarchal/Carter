// Palm Sunday: the island's mini-game, "The Hosanna Parade" (a rhythm game: activities/games/types.ts, RhythmKit).
// Jesus rides the little donkey up the road to Jerusalem's gate, over the coats and palm branches laid down for Him,
// and the crowd along the road waves palm branches and sings. The child plays the tambourine for the parade.
// While the music plays (`beat`), the donkey steps along on the beat, carrying Jesus up toward the gate, and Jesus waves;
// everyone's palm branches swing from side to side, reaching the end of each swing on a beat, and the girl at the front
// shakes her tambourine. Every note tapped in time (`hits`) makes the celebration grow: the palm branches swing wider,
// God's light glows round Jesus a little more, another sparkle twinkles, another music note floats up, and from the third
// one the children at the front jump for joy on the beat. When the tune ends, Jesus has come to the gate: everyone holds
// their palm branches up high and still, shouting "Hosanna!", and palm leaves and sparkles burst up round Him.
import { memo } from 'react'
import type { RhythmKit } from '../../activities/games/types'
import { BranchOnRoad, CHILDREN, CoatOnRoad, Crowd, JesusOnDonkey, PalmWaver, TOWNSFOLK } from '../scenes/palm-sunday'
import { CityWall, Cloud, Glow, MusicNote, Scene, Sparkles, Sun } from '../scenes/kit'
import { Figure } from '../people'
import { PalmFrond } from '../items/isl-palm-sunday'

// The tune: "Ellacombe" (a German hymn tune, first printed at Württemberg in 1784), the tune of "Hosanna, Loud Hosanna"
// and of the island's own song (scripts/sing/scores.py, from Douglas D. Anderson's ABC, in B flat): its first line, its
// second and its last, one note a beat (each pair of quick notes is played as one). [beat, MIDI pitch]
const D4 = 62, EB4 = 63, F4 = 65, G4 = 67, A4 = 69, BB4 = 70, C5 = 72, D5 = 74
export const PALM_SUNDAY_TUNE: [number, number][] = [
  [3, F4], [4, BB4], [5, A4], [6, F4], [7, BB4], [8, D4], [9, EB4], [10, F4], // "Ho-san-na, loud ho-san-na,"
  [11, F4], [12, G4], [13, BB4], [14, C5], [15, C5], [16, D5], // "the lit-tle chil-dren sang;"
  [19, F4], [20, G4], [21, BB4], [22, BB4], [23, A4], [24, BB4], // "the love-ly an-them rang."
]
const LAST = PALM_SUNDAY_TUNE[PALM_SUNDAY_TUNE.length - 1][0]

// The game puts its big circle to tap at (610, 245), with the notes flying in to it from the right and the count-in at
// (400, 150), so the parade is on the left: the city gate at the far left, Jesus on the donkey in the middle of the road,
// the crowd behind and in front. The right is open sky and the road coming in, with only small children low down (the
// "again, or go on?" buttons come up at the bottom right).
// The donkey walks from X0 to X1 along the road: it starts with Jesus' raised hand just clear of the circle, and it stops
// with its head to the right of the boy's palm branch, so the branch never covers its face.
const X0 = 492, X1 = 398
const Y = 410

/** Where the sparkles twinkle round the parade, one more for each note played in time. */
const SPARKS: [number, number, number][] = [
  [300, 196, 9], [440, 168, 8], [190, 236, 7], [500, 252, 7], [360, 120, 9], [250, 150, 6],
  [120, 286, 7], [470, 110, 7], [80, 200, 6], [400, 220, 6], [530, 180, 6], [210, 110, 8],
]
const NOTE_COLORS = ['#ff8cc0', '#5fb7ff', '#c9a8ff', '#ffd34d', '#5fd39a', '#ffb347', '#ff8cc0', '#5fb7ff']
/** How far left or right each note drifts on its way up. */
const NOTE_DRIFT = [-60, 40, -90, 70, -20, 100, -110, 20]
/** Where the palm leaves fly to at the end (round Jesus at the gate), and how each one is turned. */
const BURST: [number, number, number][] = [
  [-150, -150, -40], [-80, -200, -12], [10, -220, 10], [100, -196, 34], [170, -140, 58], [-200, -70, -66], [210, -60, 80],
]

/** The land, which never changes: sky, sun and clouds, the hills, the city wall and its gate, the grass and the road. */
const Land = memo(function Land() {
  return (
    <g>
      <Sun x={724} y={72} s={0.72} />
      <Cloud x={300} y={58} s={0.66} />
      <Cloud x={520} y={36} s={0.5} slow />
      <path d="M0 262 Q160 236 330 256 Q520 228 800 250 L800 450 L0 450 Z" fill="#b8d6b0" />
      <CityWall x0={-20} x1={300} y={336} h={104} gx={150} through={<rect x={100} y={180} width={100} height={160} fill="#efdcb2" />} />
      <path d="M0 330 Q300 316 560 332 Q700 340 800 336 L800 450 L0 450 Z" fill="#a8cf8e" />
      <path d="M150 334 Q220 346 300 360 Q420 386 560 412 Q680 428 830 430 L830 470 L560 470 Q420 444 290 404 Q206 378 150 352 Z" fill="#ecd4a4" stroke="#d8b97e" strokeWidth={2} strokeLinejoin="round" />
      {/* coats and palm branches laid on the road */}
      <CoatOnRoad x={228} y={356} s={0.56} cloth="#e07a8f" stripe="#ffe9a8" tilt={18} />
      <BranchOnRoad x={276} y={378} len={66} angle={-150} />
      <CoatOnRoad x={560} y={428} s={0.92} cloth="#7cb0e0" stripe="#fff4d6" tilt={8} />
      <BranchOnRoad x={640} y={444} len={84} angle={176} />
      <CoatOnRoad x={704} y={438} s={0.9} cloth="#e6b85a" stripe="#c0504d" tilt={2} />
    </g>
  )
})

/** The parade: Jesus riding into the city, the crowd cheering, all moving to the music. */
function ParadeBackdrop({ beat, hits }: { beat: number; hits: number }) {
  const b = Math.max(0, beat) // (0 until the music starts)
  const moving = b > 0 && b < LAST + 1
  const h = Math.max(0, Math.min(hits, 12))
  const at = Math.min(1, b / (LAST + 1)) // how far up the road Jesus has come
  const x = X0 + (X1 - X0) * at
  const lift = moving ? 2.4 * Math.abs(Math.sin(Math.PI * b)) : 0 // a little bob between steps, down on each beat
  const step = moving ? 11 * Math.sin(Math.PI * b) : 0
  // the palm branches: a swing to one side and back to the other, the end of each swing on a beat, wider as she plays;
  // at the end they're all held up high and still
  const done = b >= LAST + 0.5
  const swing = moving ? (9 + 1.4 * h) * Math.cos(Math.PI * b) : 0
  const sway = (i: number) => (done ? 0 : i % 2 ? swing : -swing)
  const hop = moving && hits >= 3 ? Math.min(14, 5 + 1.2 * (hits - 3)) * Math.abs(Math.sin(Math.PI * b)) : 0
  const wave = moving ? 7 * Math.sin(Math.PI * b) : 0 // (Jesus' hand, waving; at rest again when the walk ends)
  const burst = Math.max(0, Math.min(1, (b - LAST - 0.5) / 2)) // the leaves flying up at the end
  const e = 1 - (1 - burst) ** 3
  const notes = 1 + Math.min(h, 7)
  const shake = moving ? 12 * Math.sin(2 * Math.PI * b) : 0
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Land />
      {/* God's light round Jesus, growing as she plays */}
      <Glow x={x - 4} y={Y - 120} r={110 + 8 * h + 70 * e} color="#fff6c8" />
      {/* the crowd behind the road, waving palm branches */}
      <Crowd rows={[[340, 212, 520, 8, 0.72]]} seed={2} sway={sway} />
      {/* Jesus on the little donkey, walking up the road to the gate */}
      <g transform={`translate(0 ${(-lift).toFixed(2)})`}>
        <JesusOnDonkey x={x} y={Y} s={1.02} flip step={step} mood={done ? 'joy' : 'happy'}
          reach={[[-32 - wave, -128 + Math.abs(wave) * 0.3], null]} blinkDelay={0.4} />
      </g>
      {/* the front of the crowd: a man with a palm branch, a girl with her tambourine, and a boy jumping for joy */}
      <PalmWaver x={58} y={446} s={0.98} look={TOWNSFOLK[1]} cheer={done} sway={sway(1)} blinkDelay={0.6} />
      <g transform={`translate(0 ${(-hop).toFixed(2)})`}>
        <Figure x={132} y={448} s={1} look={CHILDREN[0]} pose="stand" mood="joy" reach={[[-30, -60], [38, -130]]} blinkDelay={1.2}
          item={<g transform={`translate(38 -130) rotate(${shake.toFixed(1)})`}><Tambourine /></g>} />
      </g>
      <g transform={`translate(0 ${(-hop * 0.8).toFixed(2)})`}>
        <PalmWaver x={226} y={450} s={1} look={CHILDREN[1]} cheer={done} sway={sway(0)} blinkDelay={0.3} />
      </g>
      {/* little ones on the right, low down, cheering */}
      <g transform={`translate(0 ${(-hop * 0.6).toFixed(2)})`}>
        <Figure x={600} y={450} s={0.8} look={CHILDREN[2]} facing="left" pose="arms-up" mood="joy" blinkDelay={0.9} />
      </g>
      <Figure x={668} y={450} s={0.76} look={CHILDREN[4]} facing="left" pose={done ? 'arms-up' : 'wave'} mood="joy" blinkDelay={1.5} />
      {/* music notes floating up over the crowd, each its own way */}
      {Array.from({ length: notes }, (_, i) => {
        const p = (b / 4 + i / 8) % 1
        const fade = Math.min(1, p * 6) * Math.min(1, (1 - p) * 3) * (b < LAST + 2 ? 1 : 0)
        const nx = 300 + NOTE_DRIFT[i] * p + 14 * Math.sin((p * 2 + i * 0.37) * Math.PI * 2)
        return (
          <g key={i} opacity={fade}>
            <MusicNote x={nx} y={300 - (170 + 16 * (i % 3)) * p} s={0.8 + 0.4 * p} color={NOTE_COLORS[i]} double={i % 3 === 1} />
          </g>
        )
      })}
      {/* at the end, palm leaves fly up round Jesus */}
      {burst > 0 && BURST.map(([dx, dy, r], i) => (
        <g key={i} opacity={Math.min(1, burst * 3)} transform={`translate(${(x - 10 + dx * e).toFixed(1)} ${(Y - 130 + dy * e).toFixed(1)}) rotate(${(r * e).toFixed(1)})`}>
          <PalmFrond len={34} w={8} n={6} flat color={i % 2 ? '#6cbf52' : '#5fae4a'} />
        </g>
      ))}
      <Sparkles spots={SPARKS.slice(0, burst > 0 ? SPARKS.length : h)} color="#fffbe0" />
    </Scene>
  )
}

/** A tambourine (in figure units, held up in a hand at (0, 0)): a wooden ring, its pairs of jingles, and a ribbon. */
function Tambourine() {
  const ink = '#6b4a2a'
  return (
    <g transform="translate(0 -12)">
      <circle r={19} fill="#fff1d6" stroke="#c98a3d" strokeWidth={6} />
      <circle r={19} fill="none" stroke={ink} strokeWidth={1.4} />
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a}) translate(0 -19)`}>
          <circle cx={-3.2} r={3.2} fill="#ffd34d" stroke="#b8860b" strokeWidth={1.1} />
          <circle cx={3.2} r={3.2} fill="#ffd34d" stroke="#b8860b" strokeWidth={1.1} />
        </g>
      ))}
      <path d="M12 14 q8 8 3 17 M15 13 q12 4 11 15" fill="none" stroke="#ff6fae" strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

/** The circle's picture: a tambourine for the parade, with two palm leaves tucked behind it (a piece, about 86 across). */
function TambourineIcon() {
  const ink = '#6b4a2a'
  return (
    <g>
      <PalmFrond x={-8} y={10} len={60} w={13} n={7} angle={-40} line={1.8} />
      <PalmFrond x={8} y={10} len={60} w={13} n={7} angle={40} line={1.8} />
      <circle r={30} fill="#fff1d6" stroke="#c98a3d" strokeWidth={8} />
      <circle r={30} fill="none" stroke={ink} strokeWidth={1.8} />
      <circle r={26} fill="none" stroke="#e8c48a" strokeWidth={1.6} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a}) translate(0 -30)`}>
          <rect x={-8.5} y={-5.5} width={17} height={11} rx={3} fill="#fff1d6" stroke={ink} strokeWidth={1.4} />
          <circle cx={-3.8} r={4.2} fill="#ffd34d" stroke="#b8860b" strokeWidth={1.4} />
          <circle cx={3.8} r={4.2} fill="#ffd34d" stroke="#b8860b" strokeWidth={1.4} />
        </g>
      ))}
      <path d="M20 22 q10 8 4 18 M24 20 q14 4 12 16" fill="none" stroke="#ff6fae" strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

export const PALM_SUNDAY_GAME: RhythmKit = {
  Backdrop: ParadeBackdrop,
  instrument: 'tambourine',
  Icon: TambourineIcon,
  notes: PALM_SUNDAY_TUNE,
  bpm: 80,
}
