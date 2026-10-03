// Jonah and the Big Fish: the island's mini-game, "Swim with the Big Fish" (Steer it: see
// activities/games/types.ts, SteerKit). Down in the deep blue sea, the child leads the big fish (Jonah is
// safe inside: he waves from a glowing window in its side) along a winding way to the sunny beach,
// picking up six shiny pearls on the way. Three little fish follow along, and the sea gets brighter and
// sunnier as the beach gets nearer.
import { useId } from 'react'
import type { At, SteerKit } from '../../activities/games/types'
import { Person, PEOPLE } from '../people'
import { BigFish, Cloud, Fish, Glow, Palm, Scene, Sparkles, Sun, sparkle } from '../scenes/kit'
import { Bubbles, Seaweed, Starfish, Tummy } from '../scenes/jonah'

/** Where the sea starts (the sky is above it). */
const SURFACE = 116

/** A smooth way through the key points (a Catmull-Rom curve), with `per` points from each one to the next. */
function smooth(keys: At[], per: number): At[] {
  const k = (i: number) => keys[Math.max(0, Math.min(keys.length - 1, i))]
  const out: At[] = []
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, p1, p2, p3] = [k(i - 1), k(i), k(i + 1), k(i + 2)]
    for (let j = 0; j < per; j++) {
      const t = j / per
      const c = (a: number, b: number, c2: number, d: number) =>
        0.5 * (2 * b + (c2 - a) * t + (2 * a - 5 * b + 4 * c2 - d) * t * t + (3 * b - a - 3 * c2 + d) * t * t * t)
      out.push([Math.round(c(p0[0], p1[0], p2[0], p3[0])), Math.round(c(p0[1], p1[1], p2[1], p3[1]))])
    }
  }
  out.push(keys[keys.length - 1])
  return out
}

/** The point a fraction `f` of the way along a path (by length). */
function along(path: At[], f: number): At {
  const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]))
  let d = f * seg.reduce((a, b) => a + b, 0)
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const t = seg[i] ? d / seg[i] : 0
      return [Math.round(path[i][0] + (path[i + 1][0] - path[i][0]) * t), Math.round(path[i][1] + (path[i + 1][1] - path[i][1]) * t)]
    }
    d -= seg[i]
  }
  return path[path.length - 1]
}

/** The way: out of the open sea on the left, down past the rocks, up over them, and on to the beach. (It
 *  sets off level, so the little fish wait in the water behind the big one, and there's room for them.) */
const PATH = smooth([[212, 238], [264, 240], [306, 296], [352, 336], [406, 322], [442, 256], [476, 200], [522, 190], [560, 226], [596, 176]], 5)
const END = PATH[PATH.length - 1]

/** Where the beach comes down to the water. */
const SHORE: At = [688, SURFACE]

/** The sea, deep blue, getting brighter and sunnier toward the beach as the big fish gets nearer to it. */
function Backdrop({ progress }: { progress: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const p = Math.max(0, Math.min(1, progress))
  const [sx, sy] = SHORE
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`sea${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ac6ef" /><stop offset="0.6" stopColor="#2f85cc" /><stop offset="1" stopColor="#21529a" />
        </linearGradient>
        <radialGradient id={`lit${id}`} cx="0.9" cy="0" r="0.95">
          <stop offset="0" stopColor="#fff4b8" stopOpacity={0.9} /><stop offset="0.45" stopColor="#bff0ff" stopOpacity={0.4} /><stop offset="1" stopColor="#bff0ff" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`sand${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2dca0" /><stop offset="1" stopColor="#cdb277" /></linearGradient>
      </defs>
      {/* the sky, and the sun over the beach */}
      <Cloud x={110} y={50} s={0.62} />
      <Cloud x={380} y={42} s={0.5} slow />
      <Glow x={640} y={56} r={60 + 60 * p} color="#fff1a0" />
      <Sun x={640} y={56} s={0.46} />
      {/* the sea, lit up from the sunny side */}
      <rect x={0} y={SURFACE} width={800} height={450 - SURFACE} fill={`url(#sea${id})`} />
      <rect x={0} y={SURFACE} width={800} height={450 - SURFACE} fill={`url(#lit${id})`} opacity={0.3 + 0.6 * p} />
      {[[150, 60], [330, 80], [520, 70]].map(([x, w], i) => (
        <path key={i} d={`M${x} ${SURFACE} L${x + w} ${SURFACE} L${x + w - 90} 450 L${x - 130} 450 Z`} fill="#ffffff" opacity={0.06 + 0.06 * p} />
      ))}
      <path className="sc-wave" d={`M-80 ${SURFACE} ${Array.from({ length: 12 }, () => 'q40 -10 80 0').join(' ')} L880 ${SURFACE + 12} L-80 ${SURFACE + 12} Z`} fill="#8fdcf7" opacity={0.85} />
      {/* far-off rocks, then the sea floor */}
      <path d="M0 450 L0 352 Q36 330 80 346 Q120 318 160 344 Q190 336 210 360 L230 450 Z" fill="#2c6aa6" opacity={0.55} />
      <path d="M300 450 Q330 360 380 350 Q420 330 460 356 Q500 344 520 380 L540 450 Z" fill="#2c6aa6" opacity={0.45} />
      <path d="M0 422 Q120 404 240 418 Q360 430 470 414 Q540 406 600 420 L600 450 L0 450 Z" fill="#dcc58e" stroke="#bfa86e" strokeWidth={3} />
      {/* the beach: the sand slopes up out of the sea, and the dry beach is sunny */}
      <path d={`M572 450 C606 372 656 270 672 176 Q680 140 ${sx} ${sy} L800 ${sy} L800 450 Z`} fill={`url(#sand${id})`} stroke="#bfa86e" strokeWidth={3} strokeLinejoin="round" />
      {[[640, 300, 34], [618, 362, 30], [664, 214, 26], [700, 260, 40], [690, 340, 44]].map(([x, y, w], i) => (
        <path key={i} d={`M${x - w / 2} ${y} q${w / 4} -4 ${w / 2} 0 t${w / 2} 0`} stroke="#bfa86e" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.45} />
      ))}
      <path d={`M${sx - 6} ${sy + 1} Q${sx + 40} ${sy - 16} 800 ${sy - 24} L800 ${sy + 1} Z`} fill="#f6dfa2" stroke="#e3c27a" strokeWidth={3} strokeLinejoin="round" />
      <path className="sc-wave" d={`M${sx - 30} ${sy + 3} q10 -6 20 0 t20 0 t20 0`} stroke="#ffffff" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* rocks, seaweed and sea friends on the bottom */}
      <ellipse cx={396} cy={428} rx={58} ry={30} fill="#7f8fa3" stroke="#5f6d80" strokeWidth={3} />
      <ellipse cx={452} cy={436} rx={34} ry={20} fill="#8d9cb0" stroke="#5f6d80" strokeWidth={3} />
      <Seaweed x={372} y={406} s={0.9} />
      <Seaweed x={226} y={430} s={0.75} color="#5fc46a" />
      <Seaweed x={646} y={398} s={0.6} color="#5fc46a" />
      <Starfish x={290} y={432} s={0.85} />
      <Starfish x={712} y={312} s={0.75} color="#ffb3c7" />
      <g className="sc-float"><Fish x={84} y={372} s={0.44} color="#7fd6c2" /><Fish x={112} y={392} s={0.38} color="#7fd6c2" /></g>
      <g className="sc-float"><Fish x={540} y={330} s={0.46} color="#b9a2f0" facing="left" /></g>
      <Bubbles x={392} y={384} s={0.8} />
      <Bubbles x={120} y={176} s={0.7} />
    </Scene>
  )
}

/** The big fish (kit's BigFish, turned to face right), Jonah waving from a glowing window in its side.
 *  Bubbles trail behind it while it swims. */
function Hero({ moving, facing }: { moving: boolean; facing: 1 | -1 }) {
  return (
    <g transform={`scale(${facing * 0.46} 0.46)`}>
      {moving && (
        <g fill="#ffffff" fillOpacity={0.3} stroke="#e6f6ff" strokeWidth={4}>
          <circle cx={-198} cy={-4} r={8} /><circle cx={-226} cy={-26} r={11} /><circle cx={-256} cy={-6} r={7} />
        </g>
      )}
      <g transform="translate(30 15) scale(-1 1)"><BigFish x={0} y={0} spout={false} /></g>
      <Tummy x={4} y={-8} r={56}>
        <Glow x={4} y={-14} r={58} color="#fffbe0" />
        <Person x={4} y={92} s={0.9} look={PEOPLE.jonah} pose="wave" />
        <Sparkles spots={[[-30, -36, 7], [40, -40, 6]]} color="#ffffff" />
      </Tummy>
    </g>
  )
}

/** A shiny pearl in a soft glow; once it's picked up, just a little twinkle where it was. */
function Pearl({ taken }: { taken: boolean }) {
  const id = `pl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  if (taken) return <g className="pa-twinkle"><path d={sparkle(0, 0, 9)} fill="#fff6c9" opacity={0.85} /></g>
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="38%" cy="34%" r="70%"><stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#f7eef6" /><stop offset="1" stopColor="#d9c3e6" /></radialGradient>
      </defs>
      <g className="pa-twinkle"><circle r={21} fill="#fff7d6" opacity={0.5} /></g>
      <circle r={13} fill={`url(#${id})`} stroke="#c2a9d2" strokeWidth={2} />
      <ellipse cx={-4.5} cy={-5} rx={4} ry={3} fill="#ffffff" />
      <path d={sparkle(10, -10, 5)} fill="#ffffff" />
    </g>
  )
}

/** A little fish swimming along behind the big one. (The mechanic spaces followers by their size, which
 *  would put the first one on the big fish's tail: each swims a little way further back.) */
const follower = (color: string, s: number) => () => <g transform="translate(-20 0)"><Fish x={0} y={0} s={s} color={color} /></g>

/** The sunny beach: a palm tree on the sand above the waves, twinkling in the sun. (Drawn at the end
 *  of the way, where the big fish comes up beside the beach; it's laid out in board units.) */
function Goal() {
  return (
    <g transform={`translate(${-END[0]} ${-END[1]})`}>
      <Glow x={752} y={70} r={70} color="#fff6c0" />
      <Palm x={758} y={98} s={0.52} />
      <Sparkles spots={[[712, 76, 6], [790, 58, 5], [722, 36, 4]]} color="#fff3b0" />
    </g>
  )
}

/** Rocks and seaweed at the bottom, in front of everything. */
const Front = () => (
  <g>
    <Seaweed x={30} y={462} s={1.3} />
    <ellipse cx={84} cy={454} rx={62} ry={26} fill="#6f8096" stroke="#4f5d70" strokeWidth={3} />
    <Seaweed x={498} y={466} s={1.05} color="#5fc46a" />
    <ellipse cx={524} cy={458} rx={46} ry={20} fill="#7f8fa3" stroke="#5f6d80" strokeWidth={3} />
  </g>
)

export const JONAH_GAME: SteerKit = {
  Backdrop,
  path: PATH,
  Hero,
  followers: [follower('#ffe14d', 0.56), follower('#ff8fa8', 0.5), follower('#ffa64d', 0.46)],
  // (the first one well ahead of the big fish's nose at the start, so it can be seen before it's picked up)
  collect: [0.25, 0.38, 0.51, 0.64, 0.77, 0.9].map((f) => ({ at: along(PATH, f), Draw: Pearl })),
  Goal,
  Front,
}
