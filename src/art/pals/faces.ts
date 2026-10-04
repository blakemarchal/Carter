// Where each Pal's face and head are in its own 200 x 200 drawing (src/art/pals/<species>.tsx), for
// pictures that add something to a Pal: a big yawn on its mouth (bedtime), a party hat on its head (the
// birthday party). `y` and `s` are the species' <CuteFace x={100} y s> call; a beak or snout has its own
// yawn spot; the hat's brim sits where the stage-2 <Crown> sits. Keep these in step with the drawings.
import type { CSSProperties } from 'react'
import type { PalDef } from '../../data/pals'

export type Species = PalDef['species']

export interface PalFace {
  /** The point between the eyes (CuteFace y; x is always 100) and the face's scale. */
  y: number
  s: number
  /** An open, yawning mouth: its centre and size. */
  yawn: { y: number; rx: number; ry: number }
  /** A party hat: the middle of its brim, on top of the head (per stage, for Pals that grow taller), and its tilt in degrees. */
  hat: { x: number; y: [number, number, number]; tilt: number }
}

/** A face with a mouth (the yawn goes where CuteFace draws the smile), or a beak/snout `yawn` spot. */
const face = (y: number, s: number, hat: [number, number | [number, number, number], number?], yawn?: PalFace['yawn']): PalFace => ({
  y, s,
  yawn: yawn ?? { y: y + 15 * s, rx: 7 * s, ry: 8.5 * s },
  hat: { x: hat[0], y: typeof hat[1] === 'number' ? [hat[1], hat[1], hat[1]] : hat[1], tilt: hat[2] ?? -12 },
})

export const PAL_FACES: Record<Species, PalFace> = {
  mouse: face(92, 0.85, [100, 52]),
  dragon: face(82, 0.82, [100, 52], { y: 105, rx: 5.5, ry: 5 }),
  serpent: face(90, 0.88, [100, 56]),
  dove: face(80, 0.82, [100, 47], { y: 101, rx: 6.5, ry: 7.5 }),
  cloud: face(112, 0.9, [104, [49, 43, 42]]),
  cat: face(92, 0.82, [100, 56]),
  sun: face(106, 0.95, [100, 62]),
  night: face(114, 1, [100, 66]),
  lion: face(82, 0.86, [100, 56], { y: 110, rx: 5, ry: 5.5 }),
  goat: face(89, 0.78, [100, 62], { y: 122, rx: 6, ry: 5.5 }),
  whale: face(116, 0.92, [72, 84, -20]),
  wave: face(120, 0.95, [94, [40, 34, 31]]),
  donkey: face(80, 0.8, [100, 55], { y: 114.5, rx: 6.5, ry: 5.5 }),
  crab: face(95, 0.9, [100, 82]),
  lamb: face(93, 0.78, [100, 48]),
  snow: face(86, 0.85, [96, 56], { y: 108.5, rx: 6, ry: 6 }),
  cupcake: face(136, 0.85, [100, [76, 52, 34]]),
  balloon: face(94, 1, [100, 38]),
  camel: face(70, 0.8, [100, 45], { y: 106.5, rx: 7, ry: 7 }),
  star: face(120, 0.9, [100, 68]),
  peacock: face(86, 0.82, [100, 58], { y: 100, rx: 5, ry: 5.5 }),
  chameleon: face(86, 0.85, [100, 58], { y: 107, rx: 7.5, ry: 7.5 }),
  wind: face(106, 0.95, [100, 60]),
  tambourine: face(108, 0.95, [100, 59]),
  cub: face(87, 0.9, [100, 56], { y: 112, rx: 5.5, ry: 5.5 }),
  owl: face(94, 1.08, [100, 62], { y: 107, rx: 5.5, ry: 6 }),
  crocodile: face(62, 0.86, [100, 49], { y: 121, rx: 13, ry: 8 }),
  lily: face(106, 0.88, [100, 80]),
  hedgehog: face(104, 0.85, [100, 62], { y: 131, rx: 5.5, ry: 5 }),
  hyrax: face(87, 0.85, [100, 62], { y: 110, rx: 5.5, ry: 5.5 }),
  tortoise: face(133, 0.9, [100, [67, 60, 49]]),
  quail: face(99, 0.85, [100, 72], { y: 111, rx: 5, ry: 5.5 }),
  ram: face(88, 0.8, [100, [58, 57, 57]], { y: 112, rx: 6, ry: 5.5 }),
  trumpet: face(95, 0.9, [100, 62, -16]),
  grasshopper: face(84, 0.85, [100, 58]),
  hare: face(83, 0.88, [100, 55], { y: 104.5, rx: 5.5, ry: 5 }),
  bat: face(83, 0.86, [100, 57], { y: 104.5, rx: 5.5, ry: 5 }),
  fennec: face(81, 0.84, [100, 57], { y: 107, rx: 5, ry: 4.5 }),
  cactus: face(116, 0.92, [100, 76]),
  raven: face(99, 0.88, [100, 72], { y: 119, rx: 5.5, ry: 6.5 }),
  rooster: face(80, 0.82, [100, 60], { y: 92, rx: 5, ry: 5.5 }),
  butterfly: face(83, 0.82, [100, 57]),
  gecko: face(90, 0.95, [100, 67], { y: 107.5, rx: 8, ry: 7.5 }),
  sparrow: face(89, 0.84, [100, 60], { y: 101.5, rx: 5.5, ry: 5.5 }),
  pelican: face(100, 0.9, [100, 58]),
  fish: face(97, 1, [88, 64, -12]),
  seagull: face(100, 0.9, [100, 58]),
  kingfisher: face(100, 0.9, [100, 58]),
  mole: face(89, 0.8, [100, 57], { y: 114.5, rx: 5, ry: 4.5 }),
  puppy: face(80, 0.86, [100, 52], { y: 105, rx: 5.5, ry: 5 }),
}

/** PalArt draws a Pal at stage n scaled about (100, 110) in its box. */
export const stageScale = (stage: number) => 0.85 + stage * 0.08

/** A point in a species drawing → where it is in the Pal's 200 x 200 box at this stage. */
export function atStage(x: number, y: number, stage: number) {
  const k = stageScale(stage)
  return { x: 100 + (x - 100) * k, y: 110 + (y - 110) * k }
}

/** How far down a Pal's face reaches in its box (the bottom of a yawn), to keep a face above a rail. */
export function faceBottom(species: Species, stage: number) {
  const m = PAL_FACES[species].yawn
  return atStage(100, m.y + m.ry, stage).y
}

/** Where the middle of a party hat's brim goes on a Pal, in its own species drawing (before PalArt's stage scaling). */
export function hatSpot(species: Species, stage: number) {
  const h = PAL_FACES[species].hat
  return { x: h.x, y: h.y[Math.max(0, Math.min(2, stage))], tilt: h.tilt }
}

/**
 * The party hat's place on a Pal drawn in an HTML box (DressedPal and the `.dressed-hat` rule in
 * styles.css): set these on the box, e.g. style={{ width, height, ...partyHatVars(pal.species, stage) }}.
 */
export function partyHatVars(species: Species, stage: number): CSSProperties {
  const h = hatSpot(species, stage)
  const at = atStage(h.x, h.y + 2, stage)
  return { '--hat-x': `${at.x / 2}%`, '--hat-y': `${at.y / 2}%`, '--hat-tilt': `${h.tilt}deg` } as CSSProperties
}
