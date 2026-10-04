// Elijah: the island's mini-game kit (activities/games/types.ts). "Build the Altar" is a Build it game: on top of Mount
// Carmel, with Elijah beside it and the people watching from the far side, the child builds Elijah's altar in order:
// five big stones, four more stones and three more stones (twelve stones, 1 Kings 18:31), the wood on top, the ditch
// all round it, and the jars of water poured over it all. Then God's fire comes down from heaven on it: warm, bright,
// holy light and a great blaze, with steam rising from the water (God is only ever light).
// The parts are the story's own altar pieces (art/scenes/elijah.tsx: AltarRow, AltarWood, Ditch…), so the altar is the
// same one as on story pages 8 and 9.
import type { ComponentType } from 'react'
import type { BuildKit, BuildPart } from '../../activities/games/types'
import { Cloud, Glow } from '../scenes/kit'
import {
  AltarRow, AltarWood, Carmel, CARMEL_SKIES, Crowd, Ditch, DitchWater, Elijah, HeavenFire, JarsOnWood, Rivulets, Steam, StoneFlames,
} from '../scenes/elijah'

/** Where the altar goes on the board (the ground under the middle of its front), and how big it is. */
const AX = 470, AY = 388, K = 0.95

/**
 * One part of the altar. `box` is where it is in the altar's own units [left, top, right, bottom], so the part is
 * drawn around its own middle, and that middle goes to the same spot on the board.
 */
function part(id: string, say: string, box: [number, number, number, number], Draw: ComponentType, after?: string[]): BuildPart {
  const [x0, y0, x1, y1] = box
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  return {
    id, say, after,
    Draw: () => <g transform={`scale(${K}) translate(${-cx} ${-cy})`}><Draw /></g>,
    at: [AX + cx * K, AY + cy * K],
    size: [(x1 - x0) * K, (y1 - y0) * K],
  }
}

/** The top of Mount Carmel at midday, everything dry: Elijah ready to build, and the people watching from far off. */
function Backdrop() {
  return (
    <Carmel sky={CARMEL_SKIES.noon} back={<Cloud x={650} y={66} s={0.5} slow />}>
      <Crowd seed={51} rows={[[322, 0.6, [624, 656, 688, 720, 752, 784]], [342, 0.68, [646, 686, 726, 766]]]} />
      <Elijah x={180} y={432} s={1.04} pose="open" blinkDelay={0.6} />
    </Carmel>
  )
}

/**
 * God answers with fire from heaven: it falls on the altar in a great bright blaze over the wood and the jars, flames
 * run all over the stones, and the water steams away.
 */
function Finished() {
  const sx = 136 * K
  return (
    <g>
      <g opacity={0.55}><Glow x={AX} y={AY - 70 * K} r={190} color="#fff2c0" /></g>
      <g transform={`translate(${AX} ${AY}) scale(${K})`}><StoneFlames /></g>
      <HeavenFire x={AX} y={AY - 136 * K} top={-20} k={1} />
      {[[-sx, 0, 1, 0], [sx, -2, 1.1, 0.8], [-60, 18, 0.8, 1.5], [60, 18, 0.9, 0.4], [0, 22, 0.8, 1.1]].map(([dx, dy, s, d], i) => (
        <Steam key={i} x={AX + dx} y={AY + dy} s={s} d={d} />
      ))}
    </g>
  )
}

const Water = () => <><DitchWater /><Rivulets /><JarsOnWood /></>
const STONES = ['stones-1', 'stones-2', 'stones-3']

export const ELIJAH_GAME: BuildKit = {
  Backdrop,
  // (In building order: each part names everything that has to go in before it, so tried too early it hears the
  // first one still to go in ("First five stones!"). The ditch only needs the stones, so it can go in before the
  // wood or after it.)
  parts: [
    part('stones-1', 'five stones', [-114, -36, 114, 2], () => <AltarRow row={0} />),
    part('stones-2', 'four more stones', [-92, -63, 92, -29], () => <AltarRow row={1} />, ['stones-1']),
    part('stones-3', 'three more stones', [-70, -89, 70, -57], () => <AltarRow row={2} />, ['stones-1', 'stones-2']),
    part('wood', 'the wood', [-58, -138, 58, -85], AltarWood, STONES),
    part('ditch', 'the ditch', [-160, -42, 160, 30], () => <Ditch />, STONES),
    part('water', 'the jars of water', [-150, -180, 150, 26], Water, [...STONES, 'wood', 'ditch']),
  ],
  Finished,
}
