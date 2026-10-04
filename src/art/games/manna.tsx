// Manna in the Desert: "Gather the Manna", a Catch it game (activities/games/types.ts, CatchKit).
// God's people's tent camp at dawn: manna falls like gentle snow, and the child slides a woven basket along
// the bottom to catch it, ten pieces, just enough for today. The basket's pile of manna grows as it fills;
// behind it the family gathers manna too, and as the basket fills they stop to smile and wave, and the sun
// comes up. At the end everyone cheers. A ridge of sand runs along the front.
import { useId } from 'react'
import type { CatchKit } from '../../activities/games/types'
import { darken, ink, useShade } from '../kit'
import { Person } from '../people'
import { Scene, Sparkles, Sun } from '../scenes/kit'
import { Grip, Heart, HEBREWS, SilverHair } from '../scenes/moses'
import { Kneel } from '../scenes/daniel'
import { Bowl, CampTent, FarCamp, MannaGround, Mountains, WovenBasket } from '../scenes/manna'
import { MANNA, MANNA_LINE, MannaHeap } from '../items/isl-manna'

const GOAL = 10
const { dad: DAD, mom: MOM, boy: BOY, girl: GIRL, grandma: GRANDMA, grandpa: GRANDPA } = HEBREWS

// ---------- The backdrop: the camp at dawn ----------

/** Hands round something held in front (figure units, pose "hold"). */
const Hands = ({ skin }: { skin: string }) => <g><Grip x={-8} y={-60} skin={skin} /><Grip x={8} y={-60} skin={skin} /></g>

/** The family gathering manna behind the basket: each one stops to smile and wave as it fills (`caught`). */
function Family({ caught }: { caught: number }) {
  const done = caught >= GOAL
  const y = 352
  return (
    <g>
      {/* grandma: gathering into her bowl, then waving */}
      {caught >= 7 || done
        ? <Person x={196} y={y} s={0.58} look={GRANDMA} pose="wave" blinkDelay={0.4}><SilverHair /></Person>
        : <Kneel x={196} y={y} s={0.58} look={GRANDMA} pose="hold"><SilverHair /><Bowl x={0} y={-64} w={28} k={0.7} seed={3} /><Hands skin={GRANDMA.skin} /></Kneel>}
      <Person x={284} y={y} s={0.6} look={MOM} pose="hold" holding="baby" blinkDelay={1.3} />
      {/* the girl: gathering, then up and waving from the first catch or two */}
      {caught >= 2 || done
        ? <Person x={384} y={y + 4} s={0.6} look={GIRL} pose="wave" blinkDelay={0.9} />
        : <Kneel x={384} y={y + 4} s={0.6} look={GIRL} pose="hold"><Bowl x={0} y={-64} w={26} k={0.5} seed={4} /><Hands skin={GIRL.skin} /></Kneel>}
      <Person x={482} y={y} s={0.62} look={DAD} pose={done ? 'arms-up' : 'hold'} blinkDelay={2.6}>
        {!done && <><WovenBasket x={0} y={-63} w={44} k={0.8} seed={8} /><Hands skin={DAD.skin} /></>}
      </Person>
      {/* the boy: gathering, then cheering */}
      {caught >= 4 || done
        ? <Person x={578} y={y + 4} s={0.6} look={BOY} pose="arms-up" blinkDelay={1.6} />
        : <Kneel x={578} y={y + 4} s={0.6} look={BOY} pose="hold"><Bowl x={0} y={-64} w={26} k={0.6} seed={5} /><Hands skin={BOY.skin} /></Kneel>}
      <Person x={668} y={y} s={0.58} look={GRANDPA} pose={caught >= 9 || done ? 'wave' : 'stand'} holding={caught >= 9 || done ? undefined : 'stick'} blinkDelay={2.2} />
      {done && (
        <g>
          <Heart x={334} y={250} s={0.6} />
          <Heart x={530} y={244} s={0.55} color="#ffcf3f" />
          <Sparkles spots={[[240, 240, 8], [430, 226, 9], [630, 236, 8]]} color="#ffe27a" />
        </g>
      )}
    </g>
  )
}

function Backdrop({ caught }: { caught: number }) {
  const p = Math.max(0, Math.min(1, caught / GOAL))
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      {/* the sun comes up as the basket fills */}
      <Sun x={604} y={236 - 92 * p} s={0.78} />
      <Mountains y={262} color="#e3b4c2" k={0.8} />
      <path d="M-10 276 Q160 256 330 270 Q520 250 810 266 L810 460 L-10 460 Z" fill="#f3d8ac" />
      <path d="M-10 336 Q240 316 480 334 T810 328 L810 460 L-10 460 Z" fill="#ecca94" />
      <FarCamp y={284} s={0.22} xs={[40, 120, 200, 290, 380, 470, 560, 650, 740]} shift={2} />
      {/* manna on the ground in the middle distance (none along the lane, so nothing there looks like it fell);
          the near tents stand on it, in front of what's behind them */}
      <MannaGround y0={290} y1={350} n={130} seed={61} glints={5} clear={[[96, 330, 74, 6], [736, 332, 72, 6]]} />
      <CampTent x={96} y={328} s={0.46} />
      <CampTent x={736} y={330} s={0.44} cloth="#8a6248" stripe="#ecd6ab" />
      <Family caught={caught} />
    </Scene>
  )
}

// ---------- The basket ----------

/**
 * A wide, shallow woven basket for gathering manna, its opening's middle at (0, 0), 124 across. Empty, its
 * dark inside shows; as it fills (`fill`, 0 to 1), a pile of manna grows up out of it.
 */
function Catcher({ fill }: { fill: number }) {
  const c = '#d0924f'
  const wick = useShade(c, 0.3, 0.2)
  const line = ink(c)
  const w = 124, ry = 14, h = 46, bw = 47
  const front = `M${-w / 2} 0 A${w / 2} ${ry} 0 0 0 ${w / 2} 0 L${bw} ${h} Q0 ${h + 15} ${-bw} ${h} Z`
  const side = (f: number) => w / 2 - (w / 2 - bw) * f
  return (
    <g>
      <defs>{wick.def}</defs>
      {/* little handles at the ends of the rim */}
      {[-1, 1].map((d) => <path key={d} d={`M${d * 56} -3 Q${d * 74} -6 ${d * 70} 12`} stroke={line} strokeWidth={6} fill="none" strokeLinecap="round" />)}
      {[-1, 1].map((d) => <path key={`i${d}`} d={`M${d * 56} -3 Q${d * 74} -6 ${d * 70} 12`} stroke={c} strokeWidth={3} fill="none" strokeLinecap="round" />)}
      <ellipse cx={0} cy={0} rx={w / 2} ry={ry} fill={darken(c, 0.42)} stroke={line} strokeWidth={2.4} />
      {fill > 0 && <MannaHeap x={0} y={5} w={112} h={44} k={fill} seed={2} r={6} />}
      <path d={front} fill={wick.fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
      {[0.38, 0.72].map((f) => <path key={f} d={`M${-side(f)} ${h * f + 5} Q0 ${h * f + 25} ${side(f)} ${h * f + 5}`} stroke={darken(c, 0.22)} strokeWidth={2.4} fill="none" />)}
      {[-0.64, -0.32, 0, 0.32, 0.64].map((f) => <path key={f} d={`M${f * w * 0.5} ${ry * Math.sqrt(1 - f * f)} L${f * bw} ${h + 9 - Math.abs(f) * 6}`} stroke={darken(c, 0.15)} strokeWidth={2} />)}
      <path d={`M${-w / 2} 0 A${w / 2} ${ry} 0 0 0 ${w / 2} 0`} stroke={darken(c, 0.08)} strokeWidth={7} fill="none" />
      <path d={`M${-w / 2} 0 A${w / 2} ${ry} 0 0 0 ${w / 2} 0`} stroke={line} strokeWidth={1.6} fill="none" />
    </g>
  )
}

// ---------- What falls: manna, like gentle snow ----------

/** A soft round glow behind a falling flake. */
function SoftGlow({ r }: { r: number }) {
  const id = `mg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <>
      <defs><radialGradient id={id}><stop offset="0.3" stopColor="#fffbe8" stopOpacity={0.9} /><stop offset="1" stopColor="#fffbe8" stopOpacity={0} /></radialGradient></defs>
      <circle r={r} fill={`url(#${id})`} />
    </>
  )
}

/** One round white flake of manna, glowing softly. */
const FallingFlake = () => (
  <g>
    <SoftGlow r={28} />
    <circle r={13.5} fill={MANNA} stroke={MANNA_LINE} strokeWidth={2} />
    <circle cx={-4.3} cy={-4.5} r={3.9} fill="#ffffff" />
  </g>
)

/** Two little flakes stuck together, glowing softly. */
const FallingPair = () => (
  <g>
    <SoftGlow r={32} />
    <circle cx={-7.5} cy={3} r={13} fill={MANNA} stroke={MANNA_LINE} strokeWidth={2} />
    <circle cx={9} cy={-4} r={12.5} fill={MANNA} stroke={MANNA_LINE} strokeWidth={2} />
    <circle cx={5.4} cy={-8.2} r={3.7} fill="#ffffff" />
    <circle cx={-11.4} cy={-1.2} r={3.6} fill="#ffffff" />
  </g>
)

// ---------- In front: a ridge of sand ----------

function Front() {
  return (
    <g>
      <path d="M-10 460 L-10 428 Q110 412 230 422 Q400 436 560 418 Q690 406 810 420 L810 460 Z" fill="#e3b77e" />
      <path d="M-10 428 Q110 412 230 422 Q400 436 560 418 Q690 406 810 420" stroke="#f3d29c" strokeWidth={4} fill="none" strokeLinecap="round" />
      {[[60, 436], [180, 430], [330, 442], [470, 438], [620, 426], [750, 432]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.4} fill={MANNA} stroke={MANNA_LINE} strokeWidth={1} />)}
    </g>
  )
}

export const MANNA_GAME: CatchKit = {
  Backdrop,
  Catcher,
  width: 124,
  falling: [FallingFlake, FallingPair],
  goal: GOAL,
  lane: { y: 366, from: 40, to: 760 },
  Front,
}
