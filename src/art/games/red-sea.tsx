// The Red Sea: "Through the Sea", a Steer it game (activities/games/types.ts, SteerKit). Moses leads God's
// people along the dry path between the walls of water, from the shore on the left to the far shore on
// the right, picking up five seashells on the sea floor on the way.
//
// Seen from the side and a little above (like story page 6): the far wall of water with its fish, the dry
// sea floor, and the near wall's foamy top along the bottom (the Front, drawn over the walkers). The way
// runs along the sea floor; things higher up on the floor are farther back, so the walkers, centred on
// the way as the kit asks, stand on the floor just in front of it. The sky turns from dawn to morning as
// they go (they crossed in the night, Exodus 14:21-24).
import { useId } from 'react'
import type { At, SteerKit } from '../../activities/games/types'
import { Person } from '../people'
import { Cloud, Emoji, Palm, Scene, Sparkles, Sun, sparkle } from '../scenes/kit'
import { Goat, Grip, HEBREWS, Lamb, MOSES, PillarOfCloud, SilverHair } from '../scenes/moses'
import { Crossing, NearWall, SEA_X1, SEA_X2 } from '../scenes/red-sea'

// ---------- The way ----------

/** From the shore on the left, gently winding along the sea floor, to the far shore on the right. */
const PATH: At[] = [[172, 300], [262, 314], [342, 328], [422, 312], [502, 296], [582, 310], [652, 324], [726, 306]]

// ---------- The backdrop: the sea standing up, from dawn to morning ----------

/** A colour part way from a to b (both #rrggbb). */
function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16)
  const ch = (s: number) => Math.round(((pa >> s) & 255) + (((pb >> s) & 255) - ((pa >> s) & 255)) * t)
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')}`
}

function Backdrop({ progress }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress))
  const top = mix('#7d6cc4', '#8fd3ff', p), bottom = mix('#ffc0cb', '#e2f6ff', p)
  const id = `rsgame${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
      {/* the last stars fade as the morning comes */}
      <g opacity={Math.max(0, 1 - p * 2.2)}>
        {[[40, 40], [120, 90], [300, 24], [700, 30], [770, 96], [660, 120]].map(([x, y], i) => (
          <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.3}s` }} d={sparkle(x, y, i % 2 ? 4 : 6)} fill="#fff8d0" />
        ))}
      </g>
      {/* the sun comes up over the far shore */}
      <Sun x={742} y={228 - 140 * p} s={0.7} />
      <Cloud x={120} y={70} s={0.6} />
      <Cloud x={700} y={54} s={0.5} slow />
      <Crossing front={false}
        fish={[[290, 120, 1.05, '#ffb347', 'right'], [372, 200, 0.95, '#ff8cc0', 'left'], [452, 108, 1, '#ffd34d', 'right', '#ffffff'], [540, 180, 1.1, '#7fe0b0', 'left'], [590, 100, 0.85, '#c9a8ff', 'right']]}
        weeds={[250, 340, 470, 600]}>
        {/* the far shore: brighter and brighter as everyone gets closer */}
        <ellipse cx={730} cy={350} rx={120} ry={46} fill="#fff6c8" opacity={0.25 + 0.5 * p} />
      </Crossing>
      {/* God's pillar of cloud stands behind His people, on the shore they're leaving (Exodus 14:19) */}
      <PillarOfCloud x={58} y={292} h={250} w={56} />
      <Palm x={784} y={268} s={0.62} />
    </Scene>
  )
}

// ---------- The walkers: centred on the way, feet on the sea floor ----------

/** Moses with his staff, walking (a step-by-step bob while she leads him). */
function Hero({ moving, facing }: { moving: boolean; facing: 1 | -1 }) {
  return (
    <g transform={facing === -1 ? 'scale(-1 1)' : undefined}>
      <g className={moving ? 'rs-walk' : undefined}>
        <Person x={0} y={62} s={0.78} look={MOSES} holding="staff" />
      </g>
    </g>
  )
}

const Dad = () => (
  <Person x={0} y={54} s={0.76} look={HEBREWS.dad} pose="hold" blinkDelay={2.6}>
    <Lamb x={0} y={-66} />
    <Grip x={-8} y={-60} skin={HEBREWS.dad.skin} />
    <Grip x={8} y={-60} skin={HEBREWS.dad.skin} />
  </Person>
)
const Mom = () => <Person x={0} y={52} s={0.74} look={HEBREWS.mom} pose="hold" holding="baby" blinkDelay={1.3} />
const Girl = () => <Person x={0} y={40} s={0.76} look={HEBREWS.girl} pose="wave" blinkDelay={0.6} />
const Boy = () => <Person x={0} y={40} s={0.76} look={HEBREWS.boy} blinkDelay={1.9} />
const Grandma = () => <Person x={0} y={54} s={0.72} look={HEBREWS.grandma} holding="stick" blinkDelay={0.3}><SilverHair /></Person>
const LittleGoat = () => <Goat x={0} y={31} s={0.62} coat="#f2ece2" patch="#4a3a33" />

// ---------- Seashells on the sea floor ----------

/** A pink scallop shell lying on the sand, centred on (0, 0). */
function Scallop() {
  return (
    <g>
      <ellipse cx={0} cy={9} rx={15} ry={3} fill="#000" opacity={0.12} />
      <path d="M0 8 L-15 -4 Q-14 -15 0 -16 Q14 -15 15 -4 Z" fill="#ffc2d4" stroke="#e0889f" strokeWidth={2} strokeLinejoin="round" />
      {[-10, -5, 0, 5, 10].map((x) => <path key={x} d={`M0 7 L${x} -14`} stroke="#e0889f" strokeWidth={1.4} />)}
      <path d="M-5 8 L-4 3 L4 3 L5 8 Z" fill="#ffc2d4" stroke="#e0889f" strokeWidth={1.6} strokeLinejoin="round" />
      <ellipse cx={-6} cy={-9} rx={3.5} ry={2} fill="#fff" opacity={0.6} transform="rotate(-30 -6 -9)" />
    </g>
  )
}

/** A shell on the way: a spiral shell or a scallop, with a little twinkle so it's easy to spot. Gone once it's picked up. */
const shell = (spiral: boolean) => function ShellOnTheWay({ taken }: { taken: boolean }) {
  if (taken) return null
  return (
    <g>
      {spiral ? <Emoji e="🐚" x={0} y={-2} size={36} /> : <Scallop />}
      <Sparkles spots={[[14, -16, 5]]} color="#ffffff" />
    </g>
  )
}

// ---------- The goal: the dry far shore ----------

function Goal() {
  return (
    <g>
      <ellipse cx={0} cy={58} rx={56} ry={13} fill="#fbe4ae" />
      <Palm x={40} y={46} s={0.62} />
      <Palm x={-30} y={38} s={0.5} />
      {[[-34, 62, '#ff8cc0'], [38, 66, '#ffd34d']].map(([x, y, c]) => (
        <g key={x as number} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-5} rx={3} ry={4.5} fill={c as string} transform={`rotate(${a})`} />)}
          <circle r={2.4} fill="#fff3b0" />
        </g>
      ))}
    </g>
  )
}

// ---------- In front: the near wall of water's foamy top ----------

const Front = () => <NearWall x1={SEA_X1} x2={SEA_X2} />

export const RED_SEA_GAME: SteerKit = {
  Backdrop,
  path: PATH,
  Hero,
  followers: [Dad, Mom, Girl, Boy, Grandma, LittleGoat],
  collect: [1, 2, 3, 4, 5].map((i) => ({ at: PATH[i], Draw: shell(i % 2 === 1) })),
  Goal,
  Front,
}

