// Noah and the Big Boat: one illustration per story page (see data/noah.ts for the words).
// The animals walk two by two, so they're drawn here side-on (the item pictures face us): Lion,
// Elephant and Giraffe, facing right or left, with a `tilt` for walking up or down the ark's ramp.
// Their heads (LionHead, ElephantHead, GiraffeNeck) also peek out of the ark on page 4.
import { useId, type ReactNode } from 'react'
import { CuteFace, darken, ink, Shine, useShade } from '../kit'
import { fluff } from '../items/draw'
import { Person, PEOPLE, SKIN } from '../people'
import { Ark, Cloud, Dove, Glow, House, Rainbow, Rays, Scene, Sea, Sheep, Sparkles, Tap, Tree } from './kit'

// ---------- The animals, side-on ----------

const FUR = '#ffc65a', MANE = '#e0862a'
const GREY = '#a9b5cc'
const COAT = '#ffcf5e', SPOT = '#d4843a', HOOF = '#7a5236'

/** Where a side-on animal stands: (x, y) is its feet on the ground; `tilt` turns it to walk up or down a ramp. */
type Walker = { x: number; y: number; s?: number; facing?: 'left' | 'right'; tilt?: number }
type Part = { x: number; y: number; s?: number; w?: number }

function Walk({ x, y, s = 1, facing = 'right', tilt = 0, children }: Walker & { children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${facing === 'left' ? -s : s} ${s})`}>{children}</g>
}

const shadow = (rx: number) => <ellipse cx={0} cy={-1} rx={rx} ry={rx / 10} fill="#000" opacity={0.12} />

/** A lion's head in its big fluffy mane, turned to us. (x, y) is the middle of its face; `w` is the outline width. */
function LionHead({ x, y, s = 1, w = 2.5 }: Part) {
  const fur = useShade(FUR, 0.4, 0.15)
  const mane = useShade(MANE, 0.3, 0.18)
  const line = ink(FUR)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{fur.def}{mane.def}</defs>
      <path d={fluff(0, 0, 21, 20, 11)} fill={mane.fill} stroke={ink(MANE)} strokeWidth={w} strokeLinejoin="round" />
      {[-10, 10].map((ex) => (
        <g key={ex}>
          <circle cx={ex} cy={-13} r={5} fill={fur.fill} stroke={line} strokeWidth={w * 0.8} />
          <circle cx={ex} cy={-13} r={2.3} fill="#ff9fb8" />
        </g>
      ))}
      <ellipse cx={0} cy={1} rx={13} ry={12.5} fill={fur.fill} stroke={line} strokeWidth={w} />
      <ellipse cx={0} cy={7} rx={7} ry={5} fill="#fff1d6" />
      <path d="M-3 3.5 Q0 2 3 3.5 Q1.5 6.5 0 6.8 Q-1.5 6.5 -3 3.5 Z" fill="#7a3b2a" />
      <path d="M0 6.8 L0 8.5 M0 8.5 Q-2.5 10.5 -4 9 M0 8.5 Q2.5 10.5 4 9" stroke="#7a3b2a" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <CuteFace x={0} y={-1} s={0.3} gap={13} mouth={false} />
    </g>
  )
}

/** A lion walking side-on: a golden body on four legs, a tufted tail and a big mane. */
function Lion(p: Walker) {
  const fur = useShade(FUR, 0.4, 0.15)
  const line = ink(FUR)
  const w = 2.6 / (p.s ?? 1)
  return (
    <Walk {...p}>
      <defs>{fur.def}</defs>
      {shadow(34)}
      {[-22, 12].map((lx) => <rect key={lx} x={lx} y={-26} width={9} height={25} rx={4} fill={darken(FUR, 0.14)} stroke={line} strokeWidth={w} />)}
      {[-31, 4].map((lx) => <rect key={lx} x={lx} y={-26} width={10} height={26} rx={4.5} fill={fur.fill} stroke={line} strokeWidth={w} />)}
      <path d="M-30 -36 Q-42 -36 -45 -52" stroke={line} strokeWidth={w * 1.3} fill="none" strokeLinecap="round" />
      <path d={fluff(-45, -55, 4.5, 5.5, 5)} fill={MANE} stroke={ink(MANE)} strokeWidth={w * 0.8} />
      <ellipse cx={-4} cy={-33} rx={30} ry={14.5} fill={fur.fill} stroke={line} strokeWidth={w} />
      <Shine x={-16} y={-40} rx={7} ry={3.5} />
      <LionHead x={25} y={-50} w={w} />
    </Walk>
  )
}

/** An elephant's head turned to us: a big floppy ear, a little tusk and a trunk curling at the tip. (x, y) is the middle of its head. */
function ElephantHead({ x, y, s = 1, w = 2.5 }: Part) {
  const skin = useShade(GREY, 0.4, 0.16)
  const line = ink(GREY)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{skin.def}</defs>
      <path d="M-3 10 C1 22 3 32 1 41 C0 50 11 53 18 46 C20 43 18 40 15 42 C12 44 9 43 10 39 C13 29 13 19 12 8 Z" fill={skin.fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
      <path d="M1.5 25 q4.5 2 10 0 M2 33 q4 2 8.5 0" stroke={line} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.6} />
      <circle cx={0} cy={0} r={22} fill={skin.fill} stroke={line} strokeWidth={w} />
      <path d="M11 13 C14 19 18 21 24 20 C19 18 16 15 15 11 Z" fill="#f7f1e6" stroke="#c9bda6" strokeWidth={1.4} strokeLinejoin="round" />
      <ellipse cx={-17} cy={3} rx={14} ry={19} transform="rotate(-8 -17 3)" fill={skin.fill} stroke={line} strokeWidth={w} />
      <ellipse cx={-17} cy={4} rx={8.5} ry={13} transform="rotate(-8 -17 4)" fill="#ffbccf" />
      <CuteFace x={6} y={-3} s={0.34} gap={11} mouth={false} />
      <Shine x={-1} y={-12} rx={5} ry={3} />
    </g>
  )
}

/** An elephant walking side-on: a big grey body on four sturdy legs, a little tail, and its head and trunk in front. */
function Elephant(p: Walker) {
  const skin = useShade(GREY, 0.4, 0.16)
  const line = ink(GREY)
  const w = 2.6 / (p.s ?? 1)
  const leg = (lx: number, far: boolean) => (
    <g key={lx}>
      <rect x={lx} y={-52} width={18} height={51} rx={7} fill={far ? darken(GREY, 0.14) : skin.fill} stroke={line} strokeWidth={w} />
      {!far && [-4.5, 0, 4.5].map((d) => <ellipse key={d} cx={lx + 9 + d} cy={-4} rx={2} ry={1.5} fill="#f7f1e6" />)}
    </g>
  )
  return (
    <Walk {...p}>
      <defs>{skin.def}</defs>
      {shadow(54)}
      {[-42, 14].map((lx) => leg(lx, true))}
      {[-33, 24].map((lx) => leg(lx, false))}
      <path d="M-52 -70 Q-61 -60 -58 -46" stroke={line} strokeWidth={w * 1.3} fill="none" strokeLinecap="round" />
      <ellipse cx={-58} cy={-44} rx={3} ry={4.5} fill={darken(GREY, 0.45)} />
      <ellipse cx={-6} cy={-66} rx={48} ry={30} fill={skin.fill} stroke={line} strokeWidth={w} />
      <Shine x={-24} y={-82} rx={12} ry={5} />
      <ElephantHead x={42} y={-74} w={w} />
    </Walk>
  )
}

/** A giraffe's long spotty neck and its head, turned to us. (x, y) is the bottom of the neck. */
function GiraffeNeck({ x, y, s = 1, w = 2.5 }: Part) {
  const coat = useShade(COAT, 0.4, 0.15)
  const line = ink(COAT)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{coat.def}</defs>
      <path d="M-9 4 C-3 -22 5 -46 12 -66 L25 -62 C18 -40 12 -18 9 2 Z" fill={coat.fill} stroke={line} strokeWidth={w} strokeLinejoin="round" />
      <path d="M-5.5 -6 C-1 -26 5 -44 11 -60" stroke={SPOT} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {[[4, -18, 3.6, 20], [9.5, -35, 3.2, -10], [15, -51, 2.8, 30]].map(([cx, cy, r, a]) => (
        <ellipse key={cy} cx={cx} cy={cy} rx={r * 1.25} ry={r} transform={`rotate(${a} ${cx} ${cy})`} fill={SPOT} />
      ))}
      {/* little horns (ossicones), ears, then the head and pale muzzle */}
      {[[19, -77, 17, -88], [27, -79, 27, -90]].map(([x0, y0, x1, y1]) => (
        <g key={x0}>
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={line} strokeWidth={5} strokeLinecap="round" />
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={COAT} strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={x1} cy={y1} r={2.6} fill={SPOT} stroke={ink(SPOT)} strokeWidth={1.2} />
        </g>
      ))}
      <ellipse cx={12} cy={-76} rx={6} ry={2.8} transform="rotate(-28 12 -76)" fill={coat.fill} stroke={line} strokeWidth={w * 0.8} />
      <ellipse cx={35} cy={-80} rx={5.5} ry={2.6} transform="rotate(26 35 -80)" fill={coat.fill} stroke={line} strokeWidth={w * 0.8} />
      <ellipse cx={24} cy={-70} rx={12} ry={9.5} transform="rotate(18 24 -70)" fill={coat.fill} stroke={line} strokeWidth={w} />
      <ellipse cx={31} cy={-65} rx={7} ry={5.5} transform="rotate(18 31 -65)" fill="#fff2d2" stroke={ink('#fff2d2')} strokeWidth={w * 0.7} />
      <circle cx={30} cy={-66} r={1} fill={SPOT} /><circle cx={34} cy={-64.5} r={1} fill={SPOT} />
      <CuteFace x={23} y={-72} s={0.26} gap={12} mouth={false} />
      <Shine x={18} y={-75} rx={3} ry={1.8} />
    </g>
  )
}

/** A giraffe walking side-on: long legs, a spotty body, a tufted tail and a very long neck. */
function Giraffe(p: Walker) {
  const coat = useShade(COAT, 0.4, 0.15)
  const line = ink(COAT)
  const w = 2.6 / (p.s ?? 1)
  const leg = (lx: number, far: boolean) => (
    <g key={lx}>
      <rect x={lx} y={-60} width={7.5} height={59} rx={3} fill={far ? darken(COAT, 0.14) : coat.fill} stroke={line} strokeWidth={w} />
      <rect x={lx - 0.4} y={-7} width={8.3} height={6} rx={2} fill={HOOF} />
    </g>
  )
  return (
    <Walk {...p}>
      <defs>{coat.def}</defs>
      {shadow(36)}
      {[-24, 14].map((lx) => leg(lx, true))}
      {[-31, 7].map((lx) => leg(lx, false))}
      <path d="M-31 -71 Q-39 -62 -38 -48" stroke={line} strokeWidth={w * 1.1} fill="none" strokeLinecap="round" />
      <ellipse cx={-38} cy={-45} rx={2.6} ry={4.2} fill={SPOT} />
      <GiraffeNeck x={12} y={-68} w={w} />
      <ellipse cx={-6} cy={-70} rx={28} ry={14} fill={coat.fill} stroke={line} strokeWidth={w} />
      {[[-20, -73, 5, 15], [-6, -77, 5.5, -20], [9, -72, 4.5, 10], [-13, -63, 4.2, -5], [1, -62, 4, 25], [-27, -66, 3.2, 0]].map(([cx, cy, r, a]) => (
        <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx={r * 1.2} ry={r} transform={`rotate(${a} ${cx} ${cy})`} fill={SPOT} />
      ))}
      <Shine x={-18} y={-78} rx={7} ry={3} />
    </Walk>
  )
}

// ---------- The ark, the sea and the ramp ----------

/** A point on the ark's ramp (t = 0 at the door, 1 at the ground) for an Ark at (ax, ay) scale as, and the ramp's slope. */
const onRamp = (t: number, ax: number, ay: number, as: number): [number, number] => [ax + (-5 - 206 * t) * as, ay + (-40 + 98 * t) * as]
const RAMP_TILT = -25.4

/** The sea's waves again, on top of something so it sits in the water (the same shapes as kit Sea at y 300):
 * "back" is the light swell (over a hill's foot), "front" the deep waves and white crests (over a boat's bottom). */
function Waves({ layer }: { layer: 'back' | 'front' }) {
  const y = 300
  const row = (dy: number) => Array.from({ length: 12 }, () => `q40 ${dy} 80 0`).join(' ')
  if (layer === 'back') return <path className="sc-wave" d={`M-80 ${y} ${row(-16)} L880 450 L-80 450 Z`} fill="#6cc0f2" />
  return (
    <g>
      {/* (#469cdc is the deep wave's colour as it looks over the swell: #3f96d8 at 85%) */}
      <path className="sc-wave slow" d={`M-80 ${y + 40} ${row(-14)} L880 450 L-80 450 Z`} fill="#469cdc" />
      {[[120, y + 70], [420, y + 100], [650, y + 60]].map(([x, yy], i) => <path key={i} className="sc-wave" d={`M${x} ${yy} q12 -8 24 0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />)}
    </g>
  )
}

/** The front of the ark's hull again (as kit Ark draws it), so someone can stand on the deck behind it. */
function HullFront({ x, y, s }: { x: number; y: number; s: number }) {
  const wood = useShade('#b5794a', 0.25, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{wood.def}</defs>
      <path d="M-170 -40 L170 -40 L130 30 L-130 30 Z" fill={wood.fill} stroke="#6f3f18" strokeWidth={4} strokeLinejoin="round" />
      {[-20, -2, 16].map((ly) => <path key={ly} d={`M${-160 + (ly + 20)} ${ly} L${160 - (ly + 20)} ${ly}`} stroke="#8a5428" strokeWidth={2.5} />)}
    </g>
  )
}

/** Someone looking out of one of the ark's windows (wx: -50, 0 or 50), clipped to the window. In the ark's own units. */
function InWindow({ wx, children }: { wx: number; children: ReactNode }) {
  const id = `win${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <defs><clipPath id={id}><rect x={wx - 12} y={-96} width={24} height={20} rx={4} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  )
}

// ---------- The pages ----------

// 1. "Long ago there was a man named Noah. God loved Noah, and Noah loved God."
const Page1 = () => (
  <Scene sky="day" ground="meadow">
    {/* God's love, shown as light shining down on Noah */}
    <Rays x={400} y={-40} r={620} n={16} color="#fff6c0" opacity={0.24} />
    <Tap say="God loves Noah. And God loves you, too!" sfx="sparkle">
      <Glow x={400} y={60} r={200} />
      <Sparkles spots={[[330, 150], [470, 130, 10], [400, 100, 6]]} />
    </Tap>
    <House x={620} y={330} w={90} />
    <Tap say="Yummy fruit!" sfx="pop">
      <Tree x={160} y={350} s={1.1} fruit="#ff6b6b" />
    </Tap>
    <Tap say="I love God, and God loves me!" sfx="good">
      <Person x={400} y={400} s={1.25} look={PEOPLE.noah} pose="pray" />
    </Tap>
  </Scene>
)

// 2. "God told Noah, 'A big flood is coming. Build a great big boat called an ark!' … Bang, bang, bang!"
// Noah's hammer swings down every 0.9s (pa-hammer); the little burst of lines flashes as it hits the wood.
const BANG_CSS = '.scene .noah-bang{animation:noahbang .9s ease-in-out infinite;transform-box:fill-box;transform-origin:center}'
  + '@keyframes noahbang{0%,38%{opacity:0;transform:scale(.4)}48%{opacity:1;transform:scale(1)}68%,100%{opacity:0;transform:scale(1.25)}}'

/** Over kit Ark's `building` hull (same x, y, s): the bow and stern posts, and a second row of planks
 * going on from the bow, so it reads as a boat being built (not a fence). */
function HullWork({ x, y, s }: { x: number; y: number; s: number }) {
  const wood = useShade('#b5794a', 0.25, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{wood.def}</defs>
      <path d="M-155.1 -14 L40 -14 L40 8 L-142.6 8 Z" fill={wood.fill} stroke="#6f3f18" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-148.9 -3 L40 -3" stroke="#8a5428" strokeWidth={2} />
      <path d="M-170 -40 L-130 30 M170 -40 L130 30" stroke="#6f3f18" strokeWidth={7} strokeLinecap="round" />
    </g>
  )
}

const Page2 = () => {
  const ax = 510, ay = 335, as = 1.65
  const nx = 363, ny = 412, ns = 0.75
  // where the hammer head meets the new planks, at the bottom of its swing (people.tsx, pose "hammer")
  const ix = nx + 85 * ns, iy = ny - 127 * ns
  return (
    <Scene sky="day" ground="hills">
      <style>{BANG_CSS}</style>
      <Rays x={60} y={-60} r={560} n={14} color="#fff6c0" opacity={0.14} />
      <Tap say="A great big boat, just like God said!" sfx="wobble">
        <Ark x={ax} y={ay} s={as} building still />
        <HullWork x={ax} y={ay} s={as} />
      </Tap>
      <Tap say="Wood for the ark!" sfx="plop">
        {[0, 1, 2].map((i) => <rect key={i} x={22 + (i % 2) * 6} y={402 + i * 13} width={104} height={12} rx={4} fill="#c98448" stroke="#8a5428" strokeWidth={2.5} />)}
      </Tap>
      <Tap say="Here is another board, Noah!" sfx="pop">
        <Person x={228} y={418} s={0.66} look={PEOPLE.noahsWife} pose="hold" blinkDelay={1.4}>
          {/* carrying a board for the ark */}
          <rect x={-40} y={-67} width={98} height={11} rx={3} fill="#c98448" stroke="#8a5428" strokeWidth={2.5} />
          <path d="M-33 -61.5 L52 -61.5" stroke="#a86a34" strokeWidth={1.5} />
          {[-8, 8].map((hx) => <circle key={hx} cx={hx} cy={-60} r={7} fill={SKIN.medium} stroke={ink(SKIN.medium)} strokeWidth={2} />)}
        </Person>
      </Tap>
      <Tap say="Bang, bang, bang! I am building the ark, just like God said." sfx="ding">
        <Person x={nx} y={ny} s={ns} look={PEOPLE.noah} pose="hammer" holding="hammer" />
      </Tap>
      <g className="noah-bang">
        {[-160, -115, -70, -25].map((a) => {
          const r = (a * Math.PI) / 180
          const d = `M${ix + Math.cos(r) * 9} ${iy + Math.sin(r) * 9} L${ix + Math.cos(r) * 21} ${iy + Math.sin(r) * 21}`
          return <g key={a}><path d={d} stroke="#d98a1a" strokeWidth={6} strokeLinecap="round" /><path d={d} stroke="#fff2a8" strokeWidth={2.6} strokeLinecap="round" /></g>
        })}
      </g>
    </Scene>
  )
}

// 3. "Then the animals came, two by two! Lions and elephants and giraffes, too."
// Up the ramp into the ark, with Noah waving them in at the door. Sizes go by real life: the giraffes
// are the tallest, then the elephants, then the lions (Noah in the doorway is as tall as the door).
const Page3 = () => {
  const ax = 580, ay = 305, as = 1.25
  const [l1x, l1y] = onRamp(0.3, ax, ay, as)
  const [l2x, l2y] = onRamp(0.62, ax, ay, as)
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="Look how tall we are!" sfx="pop">
        <Giraffe x={64} y={352} s={1} />
        <Giraffe x={150} y={346} s={0.97} />
      </Tap>
      <Ark x={ax} y={ay} s={as} door ramp still />
      <Tap say="Come in, come in, two by two!" sfx="good">
        <Person x={ax} y={ay - 40 * as} s={0.37} look={PEOPLE.noah} pose="wave" facing="left" />
      </Tap>
      <Tap say="Roar! Here we come!" sfx="pop">
        <Lion x={l1x} y={l1y} s={0.55} tilt={RAMP_TILT} />
        <Lion x={l2x} y={l2y} s={0.55} tilt={RAMP_TILT} />
      </Tap>
      <Tap say="Toot, toot! Two big elephants!" sfx="wobble">
        <Elephant x={252} y={398} s={0.95} />
        <Elephant x={110} y={410} s={1} />
      </Tap>
    </Scene>
  )
}

// 4. "The rain fell and fell. But Noah, his family, and all the animals were safe inside the ark."
// Warm lights in the windows, faces looking out, and a giraffe's head through the roof hatch. The
// ark and everyone in it rock together; the deep waves are drawn again over the hull so it floats.
const Page4 = () => {
  const ax = 400, ay = 322, as = 1.4
  return (
    <Scene sky="storm" ground="none" rain>
      <Cloud x={120} y={60} s={1.4} grey />
      <Cloud x={340} y={36} s={1.6} grey slow />
      <Cloud x={700} y={70} s={1.3} grey />
      <Sea y={300} />
      <Glow x={400} y={225} r={200} color="#ffe9a0" />
      <Tap say="Safe and dry inside the ark!" sfx="wobble">
        <g className="sc-rock">
          <Ark x={ax} y={ay} s={as} lit still />
          {/* (in the ark's own units, so they rock with it) */}
          <g transform={`translate(${ax} ${ay}) scale(${as})`}>
            <ellipse cx={52} cy={-122} rx={13} ry={4.5} fill="#4a2c14" />
            <Tap say="It is cozy in here!" sfx="pop">
              <GiraffeNeck x={52} y={-120} s={0.64} />
            </Tap>
            <rect x={37} y={-125.5} width={30} height={7} rx={3} fill="#8a5428" stroke="#5a3418" strokeWidth={2} />
            <InWindow wx={-50}>
              <Tap say="We are safe! God is keeping us safe." sfx="good">
                <Person x={-50} y={-86 + 114 * 0.34} s={0.34} look={PEOPLE.noah} />
              </Tap>
            </InWindow>
            <InWindow wx={0}>
              <LionHead x={0} y={-85} s={0.44} />
            </InWindow>
            <InWindow wx={50}>
              <Tap say="Toot, toot!" sfx="wobble">
                <ElephantHead x={50} y={-88} s={0.34} />
              </Tap>
            </InWindow>
          </g>
        </g>
      </Tap>
      <Waves layer="front" />
    </Scene>
  )
}

// 5. "When the rain stopped, the water went down, down, down. Noah sent out a little dove. The dove came
// back with an olive leaf! There was dry land again." The dove flies back to Noah's hand (Genesis 8:9),
// from the green hill where a little olive tree is growing.
const Page5 = () => {
  const ax = 245, ay = 322, as = 1.05
  return (
    <Scene sky="day" ground="none" sun>
      <Sea y={300} />
      <Tap say="Dry land! A little olive tree is growing." sfx="ding">
        <path d="M545 330 C590 268 640 232 700 226 C745 222 780 236 800 248 L800 330 Z" fill="#8fd18a" stroke="#6cae66" strokeWidth={3} strokeLinejoin="round" />
        <path d="M640 330 C676 292 728 274 800 272 L800 330 Z" fill="#7cc46a" />
        {[[606, 270], [656, 246], [780, 254]].map(([gx, gy]) => <path key={gx} d={`M${gx} ${gy} l-3 -8 M${gx} ${gy} l0 -10 M${gx} ${gy} l3 -8`} stroke="#4f9a4a" strokeWidth={2} fill="none" strokeLinecap="round" />)}
        <Tree x={735} y={232} s={0.55} fruit="#4f5d2a" />
      </Tap>
      <Waves layer="back" />
      <g className="sc-rock">
        <Ark x={ax} y={ay} s={as} still />
        <Tap say="Welcome back, little dove!" sfx="good">
          <Person x={ax + 122 * as} y={ay - 30 * as} s={0.5} look={PEOPLE.noah} pose="point" />
        </Tap>
        <HullFront x={ax} y={ay} s={as} />
      </g>
      <Waves layer="front" />
      <Tap say="Coo, coo! I found a leaf!" sfx="swish">
        <Dove x={482} y={222} s={1.35} leaf facing="left" />
      </Tap>
      <Sparkles spots={[[690, 172, 6], [786, 206, 5], [610, 214, 5]]} />
    </Scene>
  )
}

// 6. "God put a beautiful rainbow in the sky. It was His promise: …" The rainbow's ends go behind the
// near hill (drawn again over them), and the animals come down out of the ark.
const FRONT_HILL = 'M0 360 Q200 320 420 355 T800 345 L800 450 L0 450 Z' // (kit ground "hills", front layer)

const Page6 = () => {
  const ax = 624, ay = 338, as = 0.98
  const [l1x, l1y] = onRamp(0.34, ax, ay, as)
  const [l2x, l2y] = onRamp(0.66, ax, ay, as)
  return (
    <Scene sky="dawn" ground="hills" clouds={false}>
      <Tap say="Red, orange, yellow, green, blue, purple!" sfx="sparkle">
        <Rainbow x={400} y={372} r={320} />
      </Tap>
      <path d={FRONT_HILL} fill="#7cc46a" />
      <Ark x={ax} y={ay} s={as} door ramp still />
      <Lion x={l1x} y={l1y} s={0.45} facing="left" tilt={RAMP_TILT} />
      <Lion x={l2x} y={l2y} s={0.45} facing="left" tilt={RAMP_TILT} />
      <Tap say="Baa! Baa!" sfx="pop">
        <Sheep x={70} y={424} s={0.85} />
        <Sheep x={176} y={410} s={0.8} />
      </Tap>
      <Tap say="Thank you, God!" sfx="good">
        <Person x={262} y={414} s={0.88} look={PEOPLE.noah} pose="arms-up" />
      </Tap>
      <Person x={352} y={418} s={0.78} look={PEOPLE.noahsWife} pose="arms-up" blinkDelay={2} />
      <Tap say="Coo, coo!" sfx="swish">
        <Dove x={478} y={182} s={0.9} leaf facing="left" />
      </Tap>
      <Sparkles spots={[[210, 160], [592, 150], [400, 66, 10]]} />
    </Scene>
  )
}

export const NOAH_ART = [Page1, Page2, Page3, Page4, Page5, Page6]
