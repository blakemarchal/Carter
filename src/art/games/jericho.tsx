// The Walls of Jericho: the island's mini-game, "March Around Jericho" (a rhythm game: activities/games/
// types.ts, RhythmKit). God's people march round Jericho: the seven priests blow their rams'-horn trumpets,
// God's special golden box goes with them, then Joshua and everyone else, quiet. The child blows the trumpet.
// While the music plays (`beat`), the march goes once all the way round the city, a step on every beat, and
// the priests' trumpets sound on every note of the tune. Every note tapped in time (`hits`) makes the
// celebration grow: God's light round the city glows a little more, another sparkle twinkles, another music
// note floats up, and from the third one the children hop on the beat, higher and higher. When the tune
// ends, everyone shouts, and the walls come tumbling down flat, all but Rahab's stretch with the red cord in
// the window, where she looks out, safe. The march goes round on a path well away from the walls, so nobody
// is near them when they fall.
import { memo } from 'react'
import type { RhythmKit } from '../../activities/games/types'
import { Cloud, Glow, Palm, Rays, Scene, Sparkles } from '../scenes/kit'
import { FarHills, LAP_BEATS, MARCH_START, MarchingRound, Plain, Tufts } from '../scenes/jericho'
import { MusicNote } from '../scenes/david'
import { RamsHornItem } from '../items/isl-jericho'

// The tune: "When the Saints Go Marching In" (a traditional spiritual: a marching song), as Musica Viva
// writes it (abcnotation.com, "When the saints go marching in", K:C), in G: its first line, its third
// ("oh when the saints go marching in") and its last ("when the saints go marching in"). [beat, MIDI pitch]
const G4 = 67, A4 = 69, B4 = 71, C5 = 72, D5 = 74
export const JERICHO_TUNE: [number, number][] = [
  [1, G4], [2, B4], [3, C5], [4, D5], // "Oh when the saints"
  [9, G4], [10, B4], [11, C5], [12, D5], [14, B4], [16, G4], [18, B4], [20, A4], // "oh when the saints go marching in"
  [26, B4], [27, C5], [28, D5], [30, B4], [32, G4], [34, A4], [36, G4], // "when the saints go marching in"
]
const LAST = JERICHO_TUNE[JERICHO_TUNE.length - 1][0] // (the march has gone round once by then: LAP_BEATS)

/** How loudly the trumpets are sounding at beat b (0 to 1): a burst on every note, and a long blast at the end. */
function trumpets(b: number) {
  if (b >= LAST) return b < LAST + 1.6 ? 1 : Math.max(0, 1 - (b - LAST - 1.6) / 0.5)
  let o = 0
  for (const [nb] of JERICHO_TUNE) if (b >= nb && b < nb + 0.55) o = Math.max(o, 1 - (b - nb) / 0.55)
  return o
}

/** Where the sparkles twinkle round the city, one more for each note played in time. */
const SPARKS: [number, number, number][] = [
  [118, 176, 9], [384, 168, 8], [64, 250, 7], [446, 246, 8], [250, 112, 9], [176, 212, 6],
  [330, 210, 7], [40, 346, 7], [470, 330, 6], [206, 140, 7], [300, 138, 8], [122, 300, 6],
]
const NOTE_COLORS = ['#ff8cc0', '#5fb7ff', '#c9a8ff', '#ffd34d', '#5fd39a', '#ffb347', '#ff8cc0', '#5fb7ff']
/** How far left or right each note drifts on its way up. */
const NOTE_DRIFT = [-60, 40, -90, 70, -20, 100, -110, 20]

// The game puts its big circle to tap at (610, 245), with the notes flying in to it from the right and the
// count-in at (400, 150), so Jericho and the march are on the left (the march's right end stays clear of the
// circle's glow), and the right is open plain and sky.
const CX = 262 // the middle of Jericho

/** The land round Jericho, which never changes: sky, clouds, hills, the plain and its palm trees. */
const Land = memo(function Land() {
  return (
    <g>
      <Cloud x={130} y={64} s={0.8} />
      <Cloud x={500} y={52} s={0.62} slow />
      <Cloud x={730} y={96} s={0.5} />
      <FarHills y={226} />
      <Plain y={238} />
      <Palm x={20} y={262} s={0.42} />
      <Palm x={492} y={258} s={0.4} />
      <Palm x={760} y={262} s={0.46} />
      <Palm x={742} y={436} s={0.62} />
      <Tufts spots={[[30, 440], [200, 446], [430, 444], [560, 438], [660, 446]]} />
    </g>
  )
})

/** God's people marching round Jericho, the trumpets sounding, and at the end the walls tumbling down. */
function MarchBackdrop({ beat, hits }: { beat: number; hits: number }) {
  const b = Math.max(0, beat) // (0 until the music starts)
  const marching = b > 0 && b < LAST
  const lead = MARCH_START + (2 * Math.PI * Math.min(b, LAP_BEATS)) / LAP_BEATS
  const step = marching ? Math.abs(Math.sin(Math.PI * b)) : 0 // a step on every beat, landing on the beat
  const h = Math.max(0, Math.min(hits, 12))
  const hop = marching && hits >= 3 ? Math.min(13, 4 + 1.3 * (hits - 3)) * step : 0
  const shout = b >= LAST + 0.4
  const fall = Math.max(0, Math.min(1, (b - LAST - 1) / 1.6))
  const notes = 1 + Math.min(h, 7)
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Land />
      {/* God's light round the city, growing as she plays, and shining out when the walls fall */}
      {(h >= 8 || fall > 0) && <Rays x={CX} y={240} r={520} n={18} color="#fff6c0" opacity={0.12 + 0.25 * fall} />}
      <Glow x={CX} y={250} r={120 + 9 * h + 90 * fall} color="#fff6c8" />
      <MarchingRound x={CX} y={300} lead={lead} lift={2.6 * step} hop={hop} blast={trumpets(b)} up={shout} fall={fall} rahab={fall >= 1} />
      {/* music notes floating up over the city, each its own way */}
      {Array.from({ length: notes }, (_, i) => {
        const p = (b / 4 + i / 8) % 1
        const fade = Math.min(1, p * 6) * Math.min(1, (1 - p) * 3) * (b < LAST + 2 ? 1 : 0)
        const x = CX + NOTE_DRIFT[i] * p + 14 * Math.sin((p * 2 + i * 0.37) * Math.PI * 2)
        return (
          <g key={i} opacity={fade}>
            <MusicNote x={x} y={250 - (150 + 16 * (i % 3)) * p} s={0.8 + 0.4 * p} color={NOTE_COLORS[i]} double={i % 3 === 1} />
          </g>
        )
      })}
      <Sparkles spots={SPARKS.slice(0, fall > 0 ? SPARKS.length : h)} color="#fffbe0" />
    </Scene>
  )
}

export const JERICHO_GAME: RhythmKit = {
  Backdrop: MarchBackdrop,
  instrument: 'trumpet',
  // (the priests' trumpets were rams' horns: the circle shows one, not a band trumpet)
  Icon: () => <g transform="translate(-42 -42) scale(0.84)"><RamsHornItem /></g>,
  notes: JERICHO_TUNE,
  bpm: 80,
}
