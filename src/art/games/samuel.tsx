// Samuel Listens: "Run to Eli!", a Steer it game (activities/games/types.ts, SteerKit). One night in God's
// house, someone calls "Samuel!", and the child leads Samuel from beside his little bed, past God's golden lamp
// and through the hall to Eli's room, lighting five little clay lamps on the way: each one lights up as he
// passes it, and is counted aloud. The goal is old Eli, sitting up in bed by his lamp.
//
// The house is seen from the side, just as story page 8 shows it: the gold walls and the big curtain at the
// back, and the floor in front, where the way winds. Samuel is centred on the way (his feet on the floor just
// below it), and the lamps stand on their stands just behind it, so he runs in front of them. The hall grows
// warmer as he goes. It's night, but cozy: God's lamp glows, and the stars twinkle in the windows.
import type { SteerKit } from '../../activities/games/types'
import { Person } from '../people'
import { Sparkles } from '../scenes/kit'
import { ELI_BED, EliInBed, HALL_LAMPS, HALL_PATH, HallWide, LAMP_STAND, LampOnStand, YOUNG_SAMUEL } from '../scenes/samuel'

/** Where the way ends: beside the head of Eli's bed. */
const END = HALL_PATH[HALL_PATH.length - 1]

/** God's house at night, warmer and warmer as Samuel goes (and Eli's lamp burning on its shelf in his room). */
function Backdrop({ progress }: { progress: number }) {
  return <HallWide warm={0.25 + 0.75 * Math.max(0, Math.min(1, progress))} />
}

/** Young Samuel in his teal coat; while she leads him, he runs (a quick bob, leaning forward). */
function Hero({ moving, facing }: { moving: boolean; facing: 1 | -1 }) {
  return (
    <g transform={facing === -1 ? 'scale(-1 1)' : undefined}>
      <g className={moving ? 'sm-run' : undefined}>
        <Person x={0} y={52} s={1} look={YOUNG_SAMUEL} blinkDelay={0.3} />
      </g>
    </g>
  )
}

/** A little clay lamp on its stand: dark, with a twinkle to show it's waiting, until Samuel passes; then it's lit. */
function LampOnTheWay({ taken }: { taken: boolean }) {
  return (
    <g>
      <LampOnStand h={LAMP_STAND} lit={taken} />
      {!taken && <Sparkles spots={[[20, -14, 5]]} color="#fff6d0" />}
    </g>
  )
}

/** Old Eli, sitting up in his bed, sleepy (he has just woken up). Drawn at the end of the way, beside the head of his bed. */
function Goal() {
  return (
    <g transform={`translate(${ELI_BED.x - END[0]} ${ELI_BED.y - END[1]})`}>
      <EliInBed x={0} y={0} s={ELI_BED.s} eyes="sleepy" lamp={false} />
    </g>
  )
}

export const SAMUEL_GAME: SteerKit = {
  Backdrop,
  path: HALL_PATH,
  Hero,
  collect: HALL_LAMPS.map((at) => ({ at, Draw: LampOnTheWay })),
  Goal,
}
