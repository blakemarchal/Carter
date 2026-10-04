// Baby Moses: "Float the Basket", a Steer it game (activities/games/types.ts, SteerKit). The child floats baby
// Moses' basket boat gently down the river Nile, from the reeds near home (where Miriam watches, peeking
// out of the papyrus) to the stone steps of a bathing place, picking up five pink water lilies on the way.
//
// The river is seen from the side and a little above: the far bank along the top (palms, a sleepy little
// crocodile far away on a sandbank, an egret wading), the water below, and reeds in front at the bottom
// corners (the Front). The sky turns from early morning to bright day as the basket goes, and the bathing
// place grows sunny. The way runs on the water; the basket is centred on it (its rim), floating half in it.
// (The princess isn't there yet: who finds the baby is the next visit's surprise.)
import { useId } from 'react'
import type { At, SteerKit } from '../../activities/games/types'
import { Cloud, Glow, Palm, Scene, Sparkles, Sun, sparkle } from '../scenes/kit'
import { Pyramid } from '../scenes/moses'
import { BathingSteps, Egret, LeapingFish, MiriamGirl, Papyrus, Reeds, River, SleepyCrocodile } from '../scenes/baby-moses'
import { LilyPad, ReedBasket, WaterLily } from '../items/isl-baby-moses'

// ---------- The way ----------

/** From the reeds near home on the left, gently winding down the river, to the foot of the stone steps on the right. */
const PATH: At[] = [[128, 300], [196, 324], [270, 334], [346, 312], [420, 288], [494, 296], [560, 322], [626, 334], [698, 320]]

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

/** Where the stone steps come down to the water (the bottom step's front edge). */
const STEPS: At = [742, 330]
const S = 0.72 // the basket's size

// ---------- The backdrop: the river, from early morning to bright day ----------

/** A colour part way from a to b (both #rrggbb). */
function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16)
  const ch = (s: number) => Math.round(((pa >> s) & 255) + (((pb >> s) & 255) - ((pa >> s) & 255)) * t)
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')}`
}

function Backdrop({ progress }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress))
  const id = `bmgame${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix('#f7b9a8', '#8fd3ff', p)} />
          <stop offset="1" stopColor={mix('#ffe6b8', '#e2f6ff', p)} />
        </linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
      {/* the sun comes up as the basket floats along */}
      <Sun x={560} y={138 - 84 * p} s={0.58} />
      <Cloud x={150} y={56} s={0.5} />
      <Cloud x={420} y={40} s={0.42} slow />
      {/* the far bank: sand, palms, the pyramids far away, and a little crocodile fast asleep in the sun */}
      <path d="M0 122 Q200 112 400 120 T800 116 L800 158 L0 158 Z" fill="#efd9a6" />
      <Pyramid x={250} y={124} w={70} h={40} />
      <Pyramid x={302} y={126} w={44} h={26} />
      <Palm x={92} y={130} s={0.36} />
      <Palm x={116} y={134} s={0.3} />
      <Palm x={480} y={126} s={0.38} />
      <River y={150} n={16} />
      <path d="M330 152 Q380 140 432 152 Z" fill="#e8d09a" />
      <SleepyCrocodile x={380} y={150} s={0.42} />
      {[[30, 160, 32], [200, 160, 28], [560, 160, 30], [640, 160, 26]].map(([px, py, ph], i) => <Papyrus key={px} x={px} y={py} h={ph} n={4} delay={-i * 0.6} />)}
      <Egret x={600} y={178} s={0.44} facing="left" />
      {/* lily pads drifting on the water (the flowers to pick up are on the way) */}
      <LilyPad x={240} y={410} r={18} />
      <LilyPad x={276} y={424} r={13} notch={200} />
      <LilyPad x={500} y={400} r={16} notch={250} />
      <LilyPad x={618} y={426} r={18} />
      <LilyPad x={180} y={226} r={12} notch={210} />
      <LilyPad x={460} y={220} r={13} />
      <LeapingFish x={400} y={404} color="#ffb347" />
      {/* the bathing place: a palace wall, a palm, and the stone steps down into the water, sunnier and sunnier */}
      <Glow x={STEPS[0]} y={STEPS[1] - 60} r={110 + 40 * p} color="#fff1b8" />
      <rect x={668} y={134} width={150} height={78} fill="#f1e0b8" stroke="#c9a46a" strokeWidth={2.5} />
      <rect x={668} y={134} width={150} height={16} fill="#e8d09c" />
      {[686, 716, 746, 776].map((fx, i) => (
        <g key={fx}>
          <path d={`M${fx} 148 L${fx - 7} 136 Q${fx} 140 ${fx + 7} 136 Z`} fill={['#3f7fd0', '#d0503f', '#5fae6a'][i % 3]} />
          <circle cx={fx} cy={136} r={2} fill="#ffd34d" />
        </g>
      ))}
      <rect x={668} y={150} width={150} height={3} fill="#ffd34d" />
      <Palm x={790} y={150} s={0.62} />
      <BathingSteps x={STEPS[0]} y={STEPS[1]} n={4} w={128} />
      <Sparkles spots={[[700, 176, 6], [760, 160, 7], [722, 120, 5]]} color="#fff6c8" />
      {/* home: the reeds on the left bank, and Miriam peeking out of them, watching over her baby brother */}
      <path d="M-10 152 L48 152 Q76 196 70 248 Q66 286 84 318 Q96 344 72 372 Q50 396 60 460 L-10 460 Z" fill="#cfae74" />
      <path d="M48 152 Q76 196 70 248 Q66 286 84 318 Q96 344 72 372" stroke="#8fc862" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Papyrus x={22} y={232} h={86} n={5} delay={-0.2} />
      <MiriamGirl x={44} y={322} s={0.82} pose="hold" blinkDelay={0.4} />
      <Papyrus x={76} y={340} h={66} n={4} delay={-1.1} />
      <Reeds x={30} y={340} h={50} />
    </Scene>
  )
}

// ---------- The basket boat, bobbing along ----------

/** Baby Moses in his basket boat, floating; while she leads it, it bobs quicker, ripples spread behind, and he's so happy. */
function Hero({ moving, facing }: { moving: boolean; facing: 1 | -1 }) {
  return (
    <g transform={facing === -1 ? 'scale(-1 1)' : undefined}>
      {moving && (
        <g stroke="#ffffff" strokeWidth={2.4} fill="none" strokeLinecap="round">
          <g className="bm-ripple"><path d="M-74 16 q-10 4 -18 14" /></g>
          <g className="bm-ripple" style={{ animationDelay: '-0.7s' }}><path d="M-60 24 q-12 6 -26 10" /></g>
        </g>
      )}
      <g className={moving ? 'bm-bob go' : 'bm-bob'}>
        <ReedBasket x={0} y={0} s={S} lid="hood" baby={moving ? 'happy' : 'awake'} water />
      </g>
    </g>
  )
}

// ---------- Water lilies on the way ----------

/** A pink water lily on its pad, twinkling so it's easy to spot. Once it's picked up, just a twinkle where it was. */
function Lily({ taken }: { taken: boolean }) {
  if (taken) return <g className="pa-twinkle"><path d={sparkle(0, 0, 8)} fill="#fff6c9" opacity={0.85} /></g>
  return (
    <g>
      <WaterLily x={0} y={8} s={0.6} />
      <Sparkles spots={[[16, -16, 5]]} color="#ffffff" />
    </g>
  )
}

// ---------- The goal: the foot of the stone steps ----------

/** Water lilies blooming by the bottom step (drawn either side of the way's end, where the basket comes to rest). */
function Goal() {
  return (
    <g>
      <WaterLily x={-62} y={30} s={0.5} />
      <WaterLily x={60} y={36} s={0.46} />
      <Sparkles spots={[[-40, -40, 6], [44, -46, 7], [0, -58, 5]]} color="#fff3b0" />
    </g>
  )
}

// ---------- In front: reeds at the bottom corners ----------

const Front = () => (
  <g>
    <Reeds x={20} y={464} h={92} />
    <Reeds x={78} y={470} h={70} flip />
    <Papyrus x={-6} y={470} h={120} n={4} delay={-0.8} />
    <Reeds x={772} y={468} h={88} flip />
    <Papyrus x={806} y={474} h={110} n={4} delay={-1.6} />
  </g>
)

export const BABY_MOSES_GAME: SteerKit = {
  Backdrop,
  path: PATH,
  Hero,
  // (the first one well ahead of the basket at the start, so it can be seen before it's picked up)
  collect: [0.2, 0.36, 0.52, 0.68, 0.84].map((f) => ({ at: along(PATH, f), Draw: Lily })),
  Goal,
  Front,
}
