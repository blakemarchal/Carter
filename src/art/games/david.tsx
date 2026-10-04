// David and the Giant: the island's mini-game, "Play David's Harp" (a rhythm game: activities/games/
// types.ts, RhythmKit). David sits on a rock in the hills at golden evening, playing his harp to God,
// with his sheep around him. While the music plays (`beat`), David sways from side to side and his harp
// strings shimmer on every beat, and the sheep flick their ears and wag their tails. Every note tapped in
// time (`hits`) sends up another note and another sparkle and makes God's light round David glow a
// little more, and from the third one the little lamb hops on the beat, higher and higher.
import { useId } from 'react'
import type { RhythmKit } from '../../activities/games/types'
import { PEOPLE } from '../people'
import { Glow, Scene, Sparkles } from '../scenes/kit'
import { Lyre, MusicNote, Rock, SittingOnRock, WoolSheep } from '../scenes/david'

// The tune: "Old Hundredth" (Louis Bourgeois, 1551), the old psalm tune sung to Psalm 100 ("All people
// that on earth do dwell") and to the Doxology: a song from the Psalms, like David's own. Its first
// three lines, in G, each one starting and ending on a long note. [beat, MIDI pitch]
const D4 = 62, E4 = 64, FS4 = 66, G4 = 67, A4 = 69, B4 = 71, C5 = 72
/** A line of the hymn: a long first note (two beats), six short ones, then a long last note. */
const line = (start: number, pitches: number[]): [number, number][] => pitches.map((p, i) => [start + (i ? i + 1 : 0), p])
export const DAVID_TUNE: [number, number][] = [
  ...line(0, [G4, G4, FS4, E4, D4, G4, A4, B4]), // "Praise God, from whom all blessings flow"
  ...line(10, [B4, B4, B4, A4, G4, C5, B4, A4]), // "Praise Him, all creatures here below"
  ...line(20, [G4, A4, B4, A4, G4, E4, FS4, G4]), // "Praise Him above, ye heavenly host"
]

/** The evening sky, warm gold and paler down by the hills (over the Scene's own sky). */
function EveningSky() {
  const id = `ev${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb98c" /><stop offset="0.5" stopColor="#ffd8a2" /><stop offset="1" stopColor="#fff2c8" />
        </linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
    </>
  )
}

/** A soft evening cloud, tinted by the setting sun. */
const PinkCloud = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff0e6" opacity={0.85}>
    <ellipse cx={0} cy={0} rx={62} ry={14} /><ellipse cx={-22} cy={-9} rx={26} ry={13} /><ellipse cx={18} cy={-13} rx={30} ry={16} />
  </g>
)

// The game (activities/games/Rhythm.tsx) puts its big circle to tap at (610, 245), with the notes flying
// in to it from the right and the count-in at (400, 150), so the picture keeps that side calm: David,
// the setting sun, his notes and the sparkles are all on the left.
// The notes float up from the harp, and the sparkles twinkle round David: one more for each note tapped in time.
const NOTE_COLORS = ['#ff8cc0', '#5fb7ff', '#c9a8ff', '#ffffff', '#5fd39a', '#ffb347', '#ff8cc0', '#5fb7ff']
/** How far left each note drifts on its way up. */
const NOTE_DRIFT = [-120, -45, -165, -80, -30, -140, -60, -100]
const SPARKS: [number, number, number][] = [
  [212, 262, 9], [356, 226, 8], [178, 196, 7], [384, 304, 6], [150, 346, 7],
  [262, 150, 8], [424, 250, 7], [216, 122, 6], [320, 112, 9], [96, 214, 7],
]

/**
 * The beat after the tune's last note: from then on David and his sheep are still. (The game stops
 * counting beats a little after the end, part of the way through a beat, and keeps showing that moment
 * while it asks "again, or go on?": without this the lamb would hang in the air, mid-hop, and David
 * would stay leaning. Each movement has come to rest by the end of a beat, so they settle without a jump.)
 */
const TUNE_OVER = DAVID_TUNE[DAVID_TUNE.length - 1][0] + 1

/** David at evening on his rock, his sheep round him, all moving to the music. */
function HarpBackdrop({ beat, hits }: { beat: number; hits: number }) {
  const b = Math.max(0, beat) // (0 until the music starts)
  const moving = b > 0 && b < TUNE_OVER
  const f = b - Math.floor(b) // how far through this beat
  const flash = moving ? (1 - f) ** 2 : 0 // bright right on each beat, fading by the next
  const odd = Math.floor(b) % 2 === 1
  const sway = moving ? 3 * Math.sin(Math.PI * b) : 0 // leaning one way, then the other, a beat each
  const wag = moving ? 18 * Math.sin(2 * Math.PI * b) : 0
  const h = Math.max(0, Math.min(hits, 12))
  const notes = 1 + Math.min(Math.max(hits, 0), 7)
  // the lamb: from the third note in time, a hop on every beat (landing on the beat), higher as she plays
  const hop = moving && hits >= 3 ? Math.min(26, 8 + 2 * (hits - 3)) * Math.sin(Math.PI * f) : 0
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      <EveningSky />
      {/* the sun going down behind the far hill */}
      <Glow x={112} y={282} r={210} color="#fff0b0" />
      <circle cx={112} cy={282} r={46} fill="#ffd25a" stroke="#f5a83a" strokeWidth={3} />
      <PinkCloud x={236} y={86} s={0.9} />
      <PinkCloud x={540} y={60} s={0.75} />
      <path d="M0 300 Q150 240 300 290 Q450 230 600 285 Q700 250 800 280 L800 450 L0 450 Z" fill="#c3cf88" />
      <path d="M0 360 Q200 320 420 355 T800 345 L800 450 L0 450 Z" fill="#9cc266" />
      {[[40, 400], [176, 446], [470, 440], [590, 452], [742, 412]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y} l-5 -12 M${x + 5} ${y} l1 -15 M${x + 10} ${y} l6 -11`} stroke="#5f9a46" strokeWidth={3} fill="none" strokeLinecap="round" />
      ))}
      {/* God's light round David, growing as she plays */}
      <Glow x={300} y={330} r={140 + 7 * h} color="#fff6c8" />
      {/* the sheep: a far one eating, two listening (their ears flick on the beat, taking turns) */}
      <WoolSheep x={668} y={378} s={0.56} facing="left" head="down" />
      <WoolSheep x={548} y={412} s={0.84} facing="left" ear={odd ? 30 * flash : 0} tail wag={-wag} />
      <WoolSheep x={118} y={426} s={0.94} ear={odd ? 0 : 30 * flash} tail wag={wag} />
      <Rock x={300} y={432} s={1.36} />
      <SittingOnRock x={300} y={436} s={1.8} look={PEOPLE.david} pose="hold" sway={sway}
        front={(
          <g>
            <Lyre />
            {/* the strings ringing on the beat */}
            <g opacity={flash}>
              {[-7, 0, 7].map((sx) => <path key={sx} d={`M${sx} -86 L${sx} -53`} stroke="#fffbe6" strokeWidth={3.4} strokeLinecap="round" />)}
              <path d="M30 -84 q7 10 0 20 M38 -88 q10 14 0 28 M-30 -84 q-7 10 0 20 M-38 -88 q-10 14 0 28" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
            </g>
          </g>
        )}
      />
      {/* the little lamb, hopping to the music */}
      <ellipse cx={440} cy={436} rx={22 - hop * 0.3} ry={3.5} fill="#000" opacity={0.12} />
      <WoolSheep x={440} y={436 - hop} s={0.6} facing="left" ear={hop > 0 ? 24 * Math.sin(Math.PI * f) : 0} tail wag={wag} />
      {/* notes floating up from the harp and drifting off into the evening sky, each its own way */}
      {Array.from({ length: notes }, (_, i) => {
        const p = (b / 4 + i / 8) % 1
        const fade = Math.min(1, p * 6) * Math.min(1, (1 - p) * 3)
        const x = 256 + NOTE_DRIFT[i] * p + 12 * Math.sin((p * 2 + i * 0.37) * Math.PI * 2)
        return (
          <g key={i} opacity={fade}>
            <MusicNote x={x} y={334 - (206 + 18 * (i % 3)) * p} s={0.8 + 0.45 * p} color={NOTE_COLORS[i]} double={i % 3 === 1} />
          </g>
        )
      })}
      <Sparkles spots={SPARKS.slice(0, Math.min(Math.max(hits, 0), SPARKS.length))} color="#fffbe0" />
    </Scene>
  )
}

export const DAVID_GAME: RhythmKit = {
  Backdrop: HarpBackdrop,
  instrument: 'harp',
  notes: DAVID_TUNE,
  bpm: 80,
}
