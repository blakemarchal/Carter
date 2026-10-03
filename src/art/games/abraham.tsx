// Abraham's Stars: "Count the Stars", a Spot it game (see activities/games/types.ts, SpotKit).
// God told Abraham, "Look now toward the sky, and count the stars" (Genesis 15:5). The picture is the
// night sky over the desert, with Abraham outside his tent and Sarah at its door, both looking up; the
// sky has no stars of its own, so every star in it is one to find. Each one is small and dim until it's
// tapped; then it shines, bigger and golden, and twinkles, and the game counts it aloud ("One!", "Two!"…).
import { useId } from 'react'
import type { SpotKit, SpotTarget } from '../../activities/games/types'
import { starPath, useShade } from '../kit'
import { Scene } from '../scenes/kit'
import { Abraham, Camel, NightDunes, Sarah, Tent } from '../scenes/abraham'

/** A soft band of faraway light across the sky (just a glow: nothing in it to count). */
function MilkyWay() {
  const id = `mw${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs>
        <radialGradient id={id}><stop offset="0" stopColor="#c9c0ff" stopOpacity={0.32} /><stop offset="1" stopColor="#c9c0ff" stopOpacity={0} /></radialGradient>
      </defs>
      <ellipse cx={420} cy={150} rx={480} ry={78} transform="rotate(-12 420 150)" fill={`url(#${id})`} />
    </g>
  )
}

function NightDesert() {
  return (
    <Scene sky="night" ground="none" stars={false}>
      <MilkyWay />
      <NightDunes />
      <Tent x={170} y={378} s={0.56} lit>
        <Sarah x={-72} y={0} s={1} pose="arms-up" blinkDelay={1.2} />
      </Tent>
      <Camel x={694} y={432} s={0.48} facing="left" resting blinkDelay={2.4} />
      <Abraham x={468} y={420} s={0.64} pose="arms-up" />
    </Scene>
  )
}

/**
 * A star in the sky: small and dim, or (found) big, golden and twinkling, in a soft glow. (The glow is a
 * blurred star behind it: a filter doesn't count toward its size, so on the shelf of finds the star fills its spot.)
 */
function SkyStar({ found }: { found: boolean }) {
  const gold = useShade('#ffd84a', 0.55, 0.12)
  const blur = `sg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  if (!found) {
    return <path d={starPath(0, 0, 11)} fill="#8f8ac4" stroke="#bdb8ec" strokeWidth={1.6} strokeLinejoin="round" opacity={0.9} />
  }
  return (
    <g>
      <defs>
        {gold.def}
        <filter id={blur} x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <path d={starPath(0, 1, 30)} fill="#fff1a0" opacity={0.85} filter={`url(#${blur})`} />
      <g className="pa-twinkle">
        <path d={starPath(0, 1, 25)} fill={gold.fill} stroke="#e0a82e" strokeWidth={2.6} strokeLinejoin="round" />
        <path d={starPath(-1.5, 0, 10)} fill="#fffbe0" opacity={0.85} />
      </g>
    </g>
  )
}

// Twelve stars, spread across the sky above the dunes (each tap circle clear of the others and of the tent).
const STARS: [number, number][] = [
  [80, 62], [225, 48], [372, 74], [520, 46], [668, 66],
  [150, 160], [300, 172], [450, 150], [600, 168], [740, 150],
  [390, 250], [548, 252],
]

export const ABRAHAM_GAME: SpotKit = {
  Picture: NightDesert,
  targets: STARS.map(([x, y], i): SpotTarget => ({ id: `star-${i + 1}`, at: [x, y], r: 44, Draw: SkyStar })),
}
