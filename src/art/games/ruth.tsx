// Ruth and Naomi: "Gather the Barley", a Catch it game (activities/games/types.ts, CatchKit).
// Boaz's barley field at harvest time. His kind workers toss extra barley up high for Ruth, and it comes
// tumbling down; the child moves Ruth along the stubble, her gleaning basket on her head, to catch ten bunches,
// and the barley heaps up in the basket as it fills. Behind her the harvesters cut the standing barley, and
// Boaz watches kindly from the shade of an olive tree. As the basket fills the day turns golden toward
// evening, Boaz waves, and at the end everyone cheers. Stubble and poppies run along the front.
// (The falling barley is seen against the sky: the basket's opening runs along just above the far hills.)
import { useId } from 'react'
import type { CatchKit } from '../../activities/games/types'
import { Figure } from '../scenes/joseph'
import { EyesUp, LookingUp } from '../scenes/abraham'
import { Cloud, Scene, Sparkles, Sun } from '../scenes/kit'
import { BarleyField, BarleySheaf, Boaz, DarkHair, HARVESTERS, Harvester, RuthWithBasket, Stubble, WaterJar, headBasket } from '../scenes/ruth'
import { BarleyBunch, BarleyStalk, Bethlehem, OliveTree } from '../items/isl-ruth'

const GOAL = 10
/** Ruth's size, and her basket's width (in her own units): the opening is W * RS across. */
const RS = 1.12, W = 100
/** The basket's rim, above her feet. */
const RIM = -headBasket(W).rim * RS
const LANE_Y = 214

// ---------- The backdrop: Boaz's field ----------

/** A kind worker tossing a handful of barley up high for Ruth: arms up, the stalks flying up out of their hands. */
function Tosser({ x, y, s = 0.66, i, cheer, facing = 'right', blinkDelay = 0 }: { x: number; y: number; s?: number; i: number; cheer?: boolean; facing?: 'left' | 'right'; blinkDelay?: number }) {
  const look = HARVESTERS[i % HARVESTERS.length]
  const d = facing === 'left' ? -1 : 1
  return (
    <g>
      <Figure x={x} y={y} s={s} look={look} pose="arms-up" mood="joy" facing={facing} blinkDelay={blinkDelay}>
        {look.beard === undefined && <DarkHair />}
      </Figure>
      {!cheer && (
        <g>
          {/* the handful flying up, with little swooshes */}
          {([[16, -168, -20], [34, -188, 25], [50, -170, 50]] as const).map(([sx, sy, a], j) => (
            <g key={j} transform={`translate(${x + d * sx * s} ${y + sy * s}) rotate(${a * d})`}><BarleyStalk x={0} y={12} h={26} nod={6} s={0.62 * s / 0.66} /></g>
          ))}
          <path d={`M${x + d * 12 * s} ${y - 140 * s} q${d * -4} -16 ${d * 2} -30 M${x + d * 48 * s} ${y - 140 * s} q${d * 6} -14 ${d * 2} -28`} stroke="#ffffff" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.85} />
        </g>
      )}
    </g>
  )
}

/** A color part of the way (`t`, 0 to 1) from one #rrggbb color to another. */
const mix = (a: string, b: string, t: number) => {
  const ch = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
  const [pa, pb] = [ch(a), ch(b)]
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')}`
}

/**
 * The sky as the basket fills, [top, middle, low]: a clear blue day, a soft lavender afternoon, then a golden evening
 * (blue at the top, peach, then gold). It's always one solid sky, worked out step by step: never a see-through warm
 * layer over the blue, which mixes to grey.
 */
const SKIES: { at: number; c: [string, string, string] }[] = [
  { at: 0, c: ['#8fd3ff', '#c4e9ff', '#e2f6ff'] },
  { at: 0.5, c: ['#8ccaf6', '#dcd6f6', '#fff0d2'] },
  { at: 1, c: ['#8fbaec', '#ffc6b0', '#ffe29c'] },
]
function skyAt(p: number): [string, string, string] {
  const j = p >= SKIES[1].at ? 1 : 0
  const a = SKIES[j], b = SKIES[j + 1]
  const t = Math.max(0, Math.min(1, (p - a.at) / (b.at - a.at)))
  return [mix(a.c[0], b.c[0], t), mix(a.c[1], b.c[1], t), mix(a.c[2], b.c[2], t)]
}

function Backdrop({ caught }: { caught: number }) {
  const id = `rg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const p = Math.max(0, Math.min(1, caught / GOAL))
  const done = caught >= GOAL
  const [top, middle, low] = skyAt(p)
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} /><stop offset="0.55" stopColor={middle} /><stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      {/* the day goes on toward evening as the basket fills: the sun goes over, and the sky turns golden */}
      <rect width={800} height={300} fill={`url(#${id})`} />
      <Sun x={150 + 470 * p} y={74 + 50 * p * p} s={0.62} />
      <Cloud x={300} y={60} s={0.55} slow />
      <Cloud x={620} y={92} s={0.45} />
      <path d="M-10 262 Q120 236 260 252 Q420 232 560 248 Q690 232 810 246 L810 460 L-10 460 Z" fill="#c9d79a" />
      <Bethlehem x={604} y={276} s={0.44} fields="gold" />
      <path d="M-10 270 Q200 260 420 268 T810 264 L810 460 L-10 460 Z" fill="#d6cf8a" />
      {/* the standing barley, with harvesters cutting it (either side of the town, clear of where Ruth starts) */}
      {done ? (
        <g>
          <Figure x={500} y={292} s={0.56} look={HARVESTERS[0]} pose="arms-up" mood="joy" blinkDelay={0.3} />
          <Figure x={764} y={296} s={0.56} look={HARVESTERS[2]} pose="arms-up" mood="joy" facing="left" blinkDelay={1.1} />
        </g>
      ) : (
        <g>
          <Harvester x={500} y={292} s={0.56} i={0} blinkDelay={0.3} />
          <Harvester x={764} y={296} s={0.56} i={2} blinkDelay={1.1} facing="left" />
        </g>
      )}
      <BarleyField x0={300} x1={810} y={268} depth={40} k={0.52} seed={51} />
      <Stubble y0={302} y1={460} />
      <path d="M-10 300 L300 300 Q300 284 312 276 L-10 276 Z" fill="#d6cf8a" />
      <BarleySheaf x={206} y={330} s={0.56} />
      <BarleySheaf x={586} y={334} s={0.58} lean={-5} />
      {/* Boaz in the shade of an olive tree, by the water jar */}
      <OliveTree x={74} y={330} s={1.7} />
      <WaterJar x={160} y={346} s={0.6} />
      <Boaz x={112} y={352} s={0.7} pose={done ? 'arms-up' : caught >= 3 ? 'wave' : 'stand'} mood={done ? 'joy' : 'happy'} blinkDelay={0.8} />
      {/* his kind workers, tossing extra barley up for Ruth (well clear of her basket where she starts, at 400) */}
      <Tosser x={270} y={350} i={3} cheer={done} blinkDelay={0.5} />
      <Tosser x={684} y={354} i={4} cheer={done} blinkDelay={1.4} />
      {done && <Sparkles spots={[[200, 200, 9], [400, 168, 10], [560, 196, 9], [720, 176, 8]]} color="#fff3a8" />}
    </Scene>
  )
}

// ---------- Ruth, with her basket on her head ----------

/** Ruth, looking up for the barley, her basket on her head; (0, 0) is the middle of the basket's opening. The barley heaps up in it (`fill`). */
function Catcher({ fill }: { fill: number }) {
  return (
    <LookingUp>
      <RuthWithBasket x={0} y={RIM} s={RS} w={W} k={fill} blinkDelay={0.6}><EyesUp /></RuthWithBasket>
    </LookingUp>
  )
}

// ---------- What falls: bunches of barley ----------

/** A little bunch of barley, three stalks tied with a twist of straw. */
const FallingBunch = () => <BarleyBunch n={3} s={0.85} />
/** Four stalks tied with a bit of red string: a present from the kind workers. */
const FallingGift = () => <BarleyBunch n={4} s={0.85} tie="#d9534f" />

// ---------- In front: the stubble's edge, with poppies ----------

function Front() {
  return (
    <g>
      <path d="M-10 460 L-10 440 Q120 434 260 440 Q420 446 560 438 Q690 432 810 438 L810 460 Z" fill="#e3c77c" />
      <path d={Array.from({ length: 60 }, (_, i) => `M${i * 14 - 4} ${442 + (i % 3)} l-1.5 -7 M${i * 14 + 2} ${443 - (i % 2)} l1.5 -8`).join(' ')} stroke="#b8963e" strokeWidth={1.6} strokeLinecap="round" />
      {[[40, 444], [196, 446], [452, 448], [668, 442], [778, 446]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M0 0 L0 -8" stroke="#5f9a4a" strokeWidth={2} />
          {[0, 90, 180, 270].map((a) => <ellipse key={a} cx={0} cy={-14} rx={3.4} ry={4.6} fill="#ef5a4a" transform={`rotate(${a} 0 -10)`} />)}
          <circle cx={0} cy={-10} r={2} fill="#3b2a20" />
        </g>
      ))}
    </g>
  )
}

export const RUTH_GAME: CatchKit = {
  Backdrop,
  Catcher,
  width: W * RS,
  falling: [FallingBunch, FallingGift],
  goal: GOAL,
  lane: { y: LANE_Y, from: 30, to: 770 },
  Front,
}
