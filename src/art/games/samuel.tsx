// Samuel Listens: "Run to Eli!", a Steer it game (activities/games/types.ts, SteerKit). One night in God's
// house, someone calls "Samuel!", and the child leads Samuel from beside his little bed, past God's golden lamp
// and through the hall to Eli, lighting five little clay lamps on the way: each one lights up as he passes it,
// and is counted aloud. The way ends beside old Eli, sitting up in bed by his lamp.
//
// The house is seen from the side, just as story page 8 shows it: the gold walls and the big curtain at the
// back, and the floor in front, where the way winds. Samuel is centred on the way (his feet on the floor just
// below it), and the lamps stand on their stands just behind it, so he runs in front of them. The hall grows
// warmer as he goes. It's night, but cozy: God's lamp glows, and the stars twinkle in the windows.
// Eli and his bed are part of the backdrop, so they stay put: he wakes up as Samuel gets to him. The goal is
// light enough to hop for joy at the end: a little heart and sparkles over the spot where Samuel stops.
import type { SteerKit } from '../../activities/games/types'
import { Person } from '../people'
import { Sparkles } from '../scenes/kit'
import { ELI_BED, EliInBed, HALL_LAMPS, HALL_PATH, HallWide, LAMP_STAND, LampOnStand, YOUNG_SAMUEL } from '../scenes/samuel'

/**
 * God's house at night, warmer and warmer as Samuel goes, with Eli's lamp burning on its shelf in his room, and
 * Eli in his bed: sleepy, until Samuel gets to him (then he's wide awake).
 */
function Backdrop({ progress }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress))
  return (
    <HallWide warm={0.25 + 0.75 * p}>
      <EliInBed x={ELI_BED.x} y={ELI_BED.y} s={ELI_BED.s} eyes={p > 0.96 ? 'open' : 'sleepy'} lamp={false} />
    </HallWide>
  )
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

/**
 * Where Samuel stops, beside the head of Eli's bed (centred on the way's end, where Samuel's middle will be): a
 * little heart floating just over his head, and sparkles around it ("Here I am!"). Nothing that stands on the
 * floor, so it can hop for joy at the end.
 */
function Goal() {
  return (
    <g>
      <g className="sc-float">
        <path d="M0 -70 C-18 -82 -15 -97 -6.5 -97 C-3 -97 0 -94.5 0 -91 C0 -94.5 3 -97 6.5 -97 C15 -97 18 -82 0 -70 Z"
          fill="#ff6f91" stroke="#d94a6e" strokeWidth={2.4} strokeLinejoin="round" />
        <ellipse cx={-7} cy={-89} rx={3.2} ry={2} fill="#fff" opacity={0.65} transform="rotate(-35 -7 -89)" />
      </g>
      <Sparkles spots={[[-34, -60, 6], [-28, -108, 5], [20, -114, 6], [30, -74, 4]]} color="#fff6d0" />
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
