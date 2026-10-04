// The Good Samaritan: "To the Inn", a Steer it game (activities/games/types.ts, SteerKit). Right after story part one,
// where the Samaritan lifts the hurt man onto his own donkey, the child leads them along the winding road to the inn:
// the kind Samaritan walking ahead with the lead rope, the donkey stepping along behind him, and the hurt man riding
// safely on it, bandaged. Five little wildflowers grow by the road; each one is picked (and counted aloud) as they pass,
// to cheer the hurt man up. At the end of the road the innkeeper waves them in at the inn's door.
//
// Seen from the side, like story pages 6 and 7: the wild, rocky hills behind, the road winding across the front, and
// the inn at its end on the right. The way runs along the road's far half and the walkers' feet are on its near half,
// so they're centred on the way as the kit asks. The afternoon turns to evening as they go: the sun sinks, the sky goes
// gold and then rosy, the first stars come out and the inn's windows light up, ready for them (story page 7 is the
// evening they arrive).
import { useId } from 'react'
import type { At, SteerKit } from '../../activities/games/types'
import { Figure } from '../people'
import { Cloud, Glow, Moon, Scene, Sparkles, Sun, sparkle } from '../scenes/kit'
import { Apron, INNKEEPER, Inn, Lizard, OnTheWay, RockyRoad, Scrub, Wilderness } from '../scenes/samaritan'

// ---------- The way ----------

/** From the roadside where the man was hurt, on the left, winding along the road to the inn's door on the right. */
const PATH: At[] = [[92, 300], [172, 330], [262, 312], [344, 290], [424, 316], [504, 300], [574, 318]]
const END = PATH[PATH.length - 1]

/** How far below the way the walkers' feet are (the road is drawn under both). */
const FEET = 28

/** The point a fraction `f` of the way along the path (by length). */
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

/** The road: on from the left, along under the way, and up to the inn's door ([x, y, half its width] each). */
const ROAD: [number, number, number][] = [
  [-40, 306, 36], ...PATH.map(([x, y]): [number, number, number] => [x, y + 14, 36]), [652, 340, 28], [688, 352, 20],
]

/** Where the inn stands (the middle of its front on the ground), and how big it is. */
const INN_AT = { x: 690, y: 352, s: 0.8 }

// ---------- The backdrop: the road through the hills, from afternoon to evening ----------

/** A colour part way from a to b (both #rrggbb). */
function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16)
  const ch = (s: number) => Math.round(((pa >> s) & 255) + (((pb >> s) & 255) - ((pa >> s) & 255)) * t)
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')}`
}

/** Two colours through the evening: afternoon (p = 0), golden (p = 0.55), rosy dusk (p = 1). */
const evening = (p: number, day: string, gold: string, dusk: string) => (p < 0.55 ? mix(day, gold, p / 0.55) : mix(gold, dusk, (p - 0.55) / 0.45))

function Backdrop({ progress }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress))
  const id = `smgame${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const lit = p < 0.55 ? 0 : (p - 0.55) / 0.45
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={evening(p, '#8fd3ff', '#9cb6e8', '#6b5bb5')} />
          <stop offset="1" stopColor={evening(p, '#e2f6ff', '#ffe0b0', '#ffa8b8')} />
        </linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
      {/* the first stars, and the moon coming up */}
      <g opacity={Math.max(0, p * 1.6 - 0.6)}>
        {[[60, 40], [200, 76], [330, 30], [470, 64], [760, 36]].map(([x, y], i) => (
          <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.3}s` }} d={sparkle(x, y, i % 2 ? 4 : 6)} fill="#fff8d0" />
        ))}
        <Moon x={120} y={90} s={0.6} />
      </g>
      {/* the sun sinks behind the hills as they go (well to the left of the inn) */}
      <Sun x={520 - 70 * p} y={80 + 136 * p} s={0.66} />
      <Cloud x={250} y={70} s={0.6} />
      <Cloud x={660} y={52} s={0.48} slow />
      <Wilderness time="late"
        far="M0 226 Q100 196 210 214 Q330 184 450 208 Q570 186 690 204 Q750 196 800 200 L800 450 L0 450 Z"
        mid="M0 262 Q150 236 300 254 Q470 228 640 250 Q730 240 800 244 L800 450 L0 450 Z"
        near="M0 372 Q200 360 420 374 T800 368 L800 450 L0 450 Z">
        <RockyRoad pts={ROAD} />
      </Wilderness>
      {/* the evening light over the land */}
      <rect width={800} height={450} fill="#7a4a8a" opacity={0.16 * lit} />
      {/* the rock by the road where the man was hurt, at the start */}
      <ellipse cx={40} cy={348} rx={44} ry={6} fill="#000" opacity={0.12} />
      <path d="M-4 348 Q-8 322 8 306 Q24 292 40 302 Q48 310 50 322 Q72 320 80 334 Q84 344 78 348 Z" fill="#c2b8a6" stroke="#887e70" strokeWidth={3} strokeLinejoin="round" />
      <Scrub x={230} y={250} s={0.7} />
      <Scrub x={470} y={244} s={0.6} />
      {/* the inn at the end of the road: its windows light up for the evening */}
      <Glow x={INN_AT.x} y={INN_AT.y - 70} r={100 + 60 * lit} color="#ffe6a0" />
      <Inn x={INN_AT.x} y={INN_AT.y} s={INN_AT.s} lit={lit} />
    </Scene>
  )
}

// ---------- The walkers: the Samaritan leading his donkey, the hurt man riding it ----------

/** OnTheWay at this size (about 145 wide), centred on the way: the group's middle over it, their feet FEET below it. */
const S = 0.56
const MID = 33 // (the group's middle, in the scaled group's units, from the donkey's hooves)

function Hero({ moving, facing }: { moving: boolean; facing: 1 | -1 }) {
  return (
    <g transform={facing === -1 ? 'scale(-1 1)' : undefined}>
      <OnTheWay x={-MID} y={FEET} s={S} walk={moving} blinkDelay={0.4} />
    </g>
  )
}

// ---------- Little wildflowers by the road ----------

const PETALS = ['#ff6f91', '#ffd34d', '#c9a8ff', '#ff8c5a', '#ffffff']

/** A little clump of wildflowers growing by the road (its petals in one colour), twinkling so it's easy to spot. Once it's picked, just a twinkle where it was. */
const wildflowers = (color: string) => function Wildflowers({ taken }: { taken: boolean }) {
  if (taken) return <g className="pa-twinkle"><path d={sparkle(0, 6, 8)} fill="#fff6c9" opacity={0.85} /></g>
  return (
    <g transform="translate(0 14)">
      <path d="M-8 0 Q-9 -10 -12 -16 M0 0 L0 -20 M8 0 Q9 -9 12 -14" stroke="#4f9a4a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M-3 -2 Q-12 -8 -14 -2 Q-8 1 -3 -2 Z M3 -3 Q12 -10 14 -3 Q8 0 3 -3 Z" fill="#6cc46a" stroke="#3f8a3f" strokeWidth={1.2} />
      {[[-12, -17, 0.8], [0, -22, 1], [12, -15, 0.8]].map(([fx, fy, k]) => (
        <g key={fx} transform={`translate(${fx} ${fy}) scale(${k})`}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-4.4} rx={3.4} ry={4.6} fill={color} stroke={color === '#ffffff' ? '#d8d0c8' : 'none'} strokeWidth={1} transform={`rotate(${a})`} />)}
          <circle r={2.6} fill={color === '#ffd34d' ? '#e08a2a' : '#ffd34d'} />
        </g>
      ))}
      <Sparkles spots={[[14, -30, 5]]} color="#ffffff" />
    </g>
  )
}

// ---------- The goal: the innkeeper at the inn's door ----------

/**
 * The innkeeper standing by the inn's open door, waving them in (centred on the way's end, where the Samaritan's donkey
 * stops; the door is a little ahead, so the innkeeper stands there, his feet on the road). Light enough to hop for joy.
 */
function Goal() {
  const dx = INN_AT.x - END[0] + 4, dy = INN_AT.y - END[1] + 2
  return (
    <g>
      <Figure x={dx} y={dy} s={0.58} look={INNKEEPER} pose="wave" blinkDelay={0.3}><Apron /></Figure>
      <Sparkles spots={[[dx - 30, dy - 100, 6], [dx + 34, dy - 86, 5], [dx - 6, dy - 124, 4]]} color="#fff3b0" />
    </g>
  )
}

// ---------- In front: rocks and scrub at the bottom corners ----------

const Front = () => (
  <g>
    <Scrub x={36} y={462} s={1.4} />
    <ellipse cx={120} cy={456} rx={46} ry={20} fill="#c2b8a6" stroke="#887e70" strokeWidth={3} />
    <Lizard x={300} y={432} s={1} />
    <Scrub x={520} y={460} s={1.2} />
    <Scrub x={780} y={458} s={1.3} />
  </g>
)

export const SAMARITAN_GAME: SteerKit = {
  Backdrop,
  path: PATH,
  Hero,
  // (the first one well ahead of the walkers at the start, so it can be seen before it's picked)
  collect: [0.2, 0.36, 0.52, 0.68, 0.84].map((f, i) => ({ at: along(PATH, f), Draw: wildflowers(PETALS[i]) })),
  Goal,
  Front,
}
