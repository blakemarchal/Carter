// Signature mini-games (docs/GAME-PLAN.md §5.2): reusable mechanics, each played with an island's own
// "kit" of pictures. The mechanic (src/activities/games/<Name>.tsx) knows how the game plays; the kit
// (src/art/games/<island>.tsx) knows what it looks like. A step in an island's data names both:
//   { kind: 'build', title, intro, done, kit: NOAH_BUILD }
//
// The board is 800 x 450, the same space as a story picture (src/art/scenes/kit.tsx), and is
// letterboxed the same way. Kit pictures come in two sorts:
//   - Backdrops (Backdrop, Picture): a whole <Scene> (its own <svg>), drawn behind everything.
//   - Pieces (everything else): SVG fragments (<g>…</g>), drawn by the mechanic in board units,
//     centred on (0, 0) unless the field says otherwise. Never a <Scene> or an <svg>.
// Anything said aloud (say, intro, done) follows the story rules: plain words, no emoji or symbols.
import type { ComponentType } from 'react'
import type { Thing } from '../../data/islands'

/** A point on the 800 x 450 board. */
export type At = [number, number]

// ---------- Build it: drag the parts onto their places (the ark, the manger) ----------

export interface BuildKit {
  /** Behind everything: where it's built, with nothing built yet. A whole <Scene>. */
  Backdrop: ComponentType
  /** The parts, in a sensible building order. Each one shows as a faint outline where it goes. */
  parts: BuildPart[]
  /** Drawn over the finished build for the celebration (animals walking in, a glow). A piece. */
  Finished?: ComponentType
}

export interface BuildPart {
  id: string
  /** What it is, said when it's picked up and placed: "the roof". */
  say: string
  /** The part as it looks in place: a piece, centred on (0, 0). */
  Draw: ComponentType
  /** Where its centre goes on the board. */
  at: At
  /** Its size on the board (w, h): for its outline, the snap distance and the tray. */
  size: [number, number]
  /** Parts that have to be in place first (the roof goes on the walls). */
  after?: string[]
}

// ---------- Spot it: find things in a big picture by tapping them (hidden animals, stars, lions) ----------

export interface SpotKit {
  /** The picture, without the things to find. A whole <Scene>. */
  Picture: ComponentType
  /** The things to find. Each is drawn at its spot, and changes once it's found. */
  targets: SpotTarget[]
  /** Drawn in front of the targets, for things they hide behind (a bush, a cloud). A piece, in board units. */
  Front?: ComponentType
}

export interface SpotTarget {
  id: string
  /** Where it is (its centre). */
  at: At
  /** How far from `at` a tap still finds it, in board units. At least 40, for small fingers. */
  r: number
  /** The thing itself, centred on (0, 0): before (`found` false) and after it's found (a star lights up, a lion lies down). */
  Draw: ComponentType<{ found: boolean }>
  /** Said when it's found ("A bunny!"). Without one, finding it counts aloud: "One!", "Two!"… */
  say?: string
}

// ---------- Paint it: color by number (Joseph's coat) ----------

export interface PaintKit {
  /**
   * The picture, a whole <Scene>, with every paintable region drawn as
   * <path data-region={id} fill={fills[id] ?? '#ffffff'} … />. A tap on a region paints it.
   */
  Picture: ComponentType<{ fills: Record<string, string> }>
  /** Each region, its number, and where its number is written (the middle of the region). */
  regions: { id: string; n: number; at: At }[]
  /** The paints: one per number, with a color name to say ("red"). */
  palette: { n: number; color: string; name: string }[]
}

// ---------- Steer it: lead the hero along the way to the goal (through the sea, swimming home) ----------

export interface SteerKit {
  /** Behind everything; `progress` (0 to 1) is how far along the way the hero is. A whole <Scene>. */
  Backdrop: ComponentType<{ progress: number }>
  /** The way, from the start to the goal, as points on the board. The hero stays on it. */
  path: At[]
  /** The one the child moves, facing right (`facing` -1 flips it); `moving` while being led. A piece. */
  Hero: ComponentType<{ moving: boolean; facing: 1 | -1 }>
  /** Who follows along the way behind the hero, nearest first (the people, the animals). Pieces. */
  followers?: ComponentType[]
  /** Things on the way to pick up as the hero passes (bubbles, pearls); counted aloud. Pieces, at their spots. */
  collect?: { at: At; Draw: ComponentType<{ taken: boolean }> }[]
  /** At the end of the way (the far shore, the beach). A piece, centred on the path's last point. */
  Goal: ComponentType
  /** Drawn over the hero (a front wave, reeds); `progress` as for Backdrop. A piece, in board units. */
  Front?: ComponentType<{ progress: number }>
}

// ---------- Rhythm: tap along with the music (David's harp, Miriam's tambourine) ----------

export interface RhythmKit {
  /**
   * Behind everything: the player and the instrument. `beat` is the song's position in beats (it
   * keeps counting while the music plays); `hits` counts the notes tapped in time, to celebrate. A whole <Scene>.
   */
  Backdrop: ComponentType<{ beat: number; hits: number }>
  instrument: 'harp' | 'tambourine' | 'drum' | 'trumpet'
  /** The tune to tap: [beat, MIDI pitch] for each note, beats counted from 0. Keep it short (16 to 24 notes). */
  notes: [number, number][]
  /** Beats per minute; slow for small hands (70 to 90). */
  bpm: number
}

// ---------- Share it: give everyone the same (the loaves and fishes) ----------

export interface ShareKit {
  /** What's shared; its picture is drawn by Pic (art/items), and `say` is its name ("loaf of bread"). */
  item: Thing
  /** Its plural, said aloud: "loaves of bread". */
  plural: string
  /** The people sharing, each standing behind a plate. A piece, centred on (0, 0), about 160 tall. */
  people: { id: string; say: string; Draw: ComponentType }[]
  /** Each round: how many things to share among how many of the people (it always comes out even). */
  rounds: { items: number; people: number }[]
}

// ---------- Catch it: catch what falls (manna into a basket, rain into a jar, fish into a net) ----------

export interface CatchKit {
  /** Behind everything; `caught` counts what's been caught so far. A whole <Scene>. */
  Backdrop: ComponentType<{ caught: number }>
  /**
   * What the child moves left and right (a basket, a jar, a net): a piece, centred on (0, 0) at the middle
   * of its opening. `fill` (0 to 1) is how full it is, so the pile inside can grow.
   */
  Catcher: ComponentType<{ fill: number }>
  /** How wide the catcher's opening is, in board units: a falling thing that lands within it is caught. */
  width: number
  /** What falls: pieces, centred on (0, 0). With more than one, they take turns. */
  falling: ComponentType[]
  /** How many to catch. Each one is counted aloud as it's caught. */
  goal: number
  /** Where the catcher's opening runs: its height on the board, and how far left and right it can go. */
  lane: { y: number; from: number; to: number }
  /** Drawn over everything (a ridge of sand, a tent flap). A piece, in board units. */
  Front?: ComponentType
}
