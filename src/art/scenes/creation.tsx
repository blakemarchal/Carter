// God Made Everything: one illustration per story page, both parts in one array (data/creation.ts has the
// words). Part 1 (pages 1 to 6) is the six days; part 2 (pages 7 to 11) is God's special friends: Adam and
// Eve, their garden, the animals' names, the seventh day, and the child playing.
// God is never drawn as a person: His presence and voice are light (Glow, Rays, Sparkles).
// Pages 1 to 5, 7 and 10 are also the cards in the "Seven Days" put-in-order step, so each one shows only
// what was made by its day (no birds before day five, no animals before day six) and page 10 shows it all.
// Adam and Eve look the same on every page (ADAM, EVE; Eve always has the flower in her hair).
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Person, type Look, type Pose } from '../people'
import { usePlayer } from './player'
import { Cloud, Dove, Emoji, Fish, Flower, Glow, Moon, Palm, Rays, Scene, Sea, Sparkles, Sun, Tap, Tree, sparkle } from './kit'

// ---------- Local props ----------

/** A water drop with its tip up and its round end at (0, 0). */
const drop = (r: number) => `M0 ${-2.2 * r} C${0.7 * r} ${-1.1 * r} ${r} ${-0.5 * r} ${r} 0 A${r} ${r} 0 0 1 ${-r} 0 C${-r} ${-0.5 * r} ${-0.7 * r} ${-1.1 * r} 0 ${-2.2 * r} Z`

/** A splash: a crown of water thrown up out of the sea, with drops flying out and a ripple around it. */
function Splash({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const id = `sp${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  // Rounded tongues of water; the outline runs along the top only, so the foot melts into the sea.
  const top = 'M-46 4 C-48 -8 -56 -20 -64 -27 Q-67 -31 -62 -31 C-50 -27 -40 -18 -34 -8 C-35 -24 -33 -38 -28 -50 Q-25 -55 -22 -50 C-18 -38 -15 -24 -13 -10 C-11 -28 -6 -46 0 -62 Q3 -67 6 -62 C11 -46 13 -28 12 -10 C16 -24 21 -38 28 -50 Q31 -55 34 -50 C36 -36 34 -22 31 -8 C38 -18 48 -26 61 -31 Q66 -31 63 -27 C55 -20 49 -8 47 4'
  const drops: [number, number, number][] = [[-66, -54, 5], [-42, -84, 4.5], [-10, -100, 5.5], [22, -96, 4.5], [48, -80, 5], [70, -56, 4]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4fbff" /><stop offset="0.65" stopColor="#bfe6ff" /><stop offset="1" stopColor="#8fd0f7" stopOpacity={0.5} /></linearGradient>
      </defs>
      <ellipse cx={0} cy={4} rx={70} ry={10} fill="none" stroke="#ffffff" strokeWidth={3} opacity={0.8} />
      <path d={`${top} Z`} fill={`url(#${id})`} />
      <path d={top} fill="none" stroke="#ffffff" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      <g className="sc-float">
        {drops.map(([dx, dy, r], i) => (
          // each drop flies outward, its tip trailing back towards the splash
          <path key={i} d={drop(r)} transform={`translate(${dx} ${dy}) rotate(${(Math.atan2(-20 - dy, -dx) * 180) / Math.PI + 90})`} fill="#d8f1ff" stroke="#ffffff" strokeWidth={2} strokeLinejoin="round" />
        ))}
      </g>
    </g>
  )
}

/** A soft rounded mountain with a snowy cap. */
function Mountain({ x, y, w = 240, h = 150, color = '#9cc9a4' }: { x: number; y: number; w?: number; h?: number; color?: string }) {
  const cap = h * 0.28
  return (
    <g>
      <path d={`M${x - w / 2} ${y} Q${x - w / 6} ${y - h * 0.7} ${x - 14} ${y - h + 6} Q${x} ${y - h - 6} ${x + 14} ${y - h + 6} Q${x + w / 6} ${y - h * 0.7} ${x + w / 2} ${y} Z`} fill={color} stroke="#6f9e7a" strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${x - cap * 0.9} ${y - h + cap} Q${x - 18} ${y - h + 2} ${x - 8} ${y - h - 1} Q${x} ${y - h - 4} ${x + 8} ${y - h - 1} Q${x + 18} ${y - h + 2} ${x + cap * 0.9} ${y - h + cap} Q${x + cap * 0.4} ${y - h + cap * 0.7} ${x} ${y - h + cap} Q${x - cap * 0.4} ${y - h + cap * 0.7} ${x - cap * 0.9} ${y - h + cap} Z`} fill="#fbfdff" />
    </g>
  )
}

/** A little tuft of grass. */
const Grass = ({ x, y, s = 1, color = '#4fae55' }: { x: number; y: number; s?: number; color?: string }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-12 0 Q-12 -14 -18 -22 Q-6 -14 -4 0 M-4 0 Q-2 -20 0 -30 Q4 -18 4 0 M4 0 Q8 -16 18 -22 Q12 -12 12 0" stroke={color} strokeWidth={3.5} fill="none" strokeLinecap="round" />
)

/** A few rising bubbles. */
const Bubbles = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="#e6f6ff" strokeWidth={2.5}>
      <circle cx={0} cy={0} r={5} /><circle cx={8} cy={-16} r={7} /><circle cx={2} cy={-36} r={9} />
    </g>
  </g>
)

/** A five-petal flower to tuck into hair (no stem). */
const HairFlower = ({ x, y, color = '#ff8cc0' }: { x: number; y: number; color?: string }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill={color} transform={`rotate(${a})`} />)}
    <circle r={3.5} fill="#ffd34d" />
  </g>
)

/**
 * A little songbird flying, side-on, facing right (or `facing="left"`): the kit Dove's shape in
 * bluebird colours, with a peachy breast. Reusable for any page that needs a bird in flight.
 */
export function Bird({ x, y, s = 1, color = '#5ba8f0', breast = '#ffbd8c', facing = 'right' }: { x: number; y: number; s?: number; color?: string; breast?: string; facing?: 'left' | 'right' }) {
  const line = ink(color)
  const wing = darken(color, 0.12)
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
        {/* far wing (behind the body, tipped forward so both wings show) */}
        <g transform="rotate(26 2 -8)">
          <g className="sc-wing far" style={{ '--o': '85% 100%' } as CSSProperties}>
            <path d="M2 -8 C0 -30 -8 -48 -24 -60 C-22 -52 -26 -48 -32 -47 C-26 -41 -28 -37 -34 -35 C-27 -29 -27 -25 -31 -21 C-18 -18 -8 -13 2 -8 Z"
              fill={darken(color, 0.24)} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
          </g>
        </g>
        {/* tail, body, breast and head */}
        <path d="M-24 1 L-46 -7 Q-44 0 -48 3 Q-44 6 -47 13 L-24 9 Z" fill={wing} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M-28 5 C-22 -8 2 -15 15 -9 C23 -4 20 8 6 11 C-8 15 -22 13 -28 5 Z" fill={color} stroke={line} strokeWidth={2.5} />
        <path d="M-6 11.5 C2 11 10 9 15 4 C18 1 19 -3 18 -6 C12 -1 4 4 -6 11.5 Z" fill={breast} />
        <circle cx={20} cy={-10} r={9.5} fill={color} stroke={line} strokeWidth={2.5} />
        <path d="M28.5 -11.5 l8 2.6 l-8 2.8 Z" fill="#ffc23a" stroke="#d99a1a" strokeWidth={1} strokeLinejoin="round" />
        <circle cx={22.6} cy={-12} r={2} fill="#2b2140" />
        <circle cx={22} cy={-12.6} r={0.7} fill="#fff" />
        {/* near wing (in front) */}
        <g className="sc-wing" style={{ '--o': '90% 100%' } as CSSProperties}>
          <path d="M8 -5 C4 -26 -10 -44 -30 -54 C-27 -46 -30 -42 -35 -40 C-29 -34 -30 -30 -35 -27 C-28 -22 -27 -18 -30 -13 C-18 -11 -6 -7 8 -5 Z"
            fill={color} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M-20 -40 Q-11 -26 -2 -12 M-24 -30 Q-15 -20 -8 -10" stroke={darken(color, 0.3)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
        </g>
      </g>
    </g>
  )
}

/** The kit's meadow (Scene ground="meadow"), with its flowers where the page wants them (clear of anyone's feet). */
const Meadow = ({ flowers }: { flowers: [number, number, string][] }) => (
  <g>
    <path d="M0 330 Q200 290 400 320 T800 310 L800 450 L0 450 Z" fill="#8fd18a" />
    <path d="M0 370 Q220 340 430 372 T800 360 L800 450 L0 450 Z" fill="#6cc46a" />
    {flowers.map(([x, y, c]) => <Flower key={`${x}${y}`} x={x} y={y} color={c} />)}
  </g>
)

/** A tree at night: the kit Tree's shape as a dark silhouette. */
const NightTree = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#2a2763" stroke="#3d3888" strokeWidth={3}>
    <path d="M-10 0 L-7 -70 L7 -70 L10 0 Z" />
    <circle cx={0} cy={-100} r={46} /><circle cx={-34} cy={-76} r={28} /><circle cx={34} cy={-76} r={28} />
  </g>
)

/** God's light pouring down from above the picture (on the days before the sun was made, so it can't be mistaken for the sun). */
const LightFromAbove = () => (
  <>
    <Rays x={400} y={-70} r={440} n={16} color="#ffffff" opacity={0.42} />
    <Glow x={400} y={-40} r={180} color="#ffffff" />
  </>
)

/** A fruit tree in God's garden: the kit Tree's shape, its leaves full of fruit. (x, y) is the foot of its trunk. */
export function FruitTree({ x, y, s = 1, fruit = '#ff6b6b' }: { x: number; y: number; s?: number; fruit?: string }) {
  const leaf = useShade('#5fc46a', 0.3, 0.2)
  const line = ink('#5fc46a')
  const spots = [[-22, -122], [8, -128], [28, -108], [-6, -102], [-38, -88], [-18, -78], [20, -84], [42, -72], [-48, -70]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{leaf.def}</defs>
      <path d="M-10 0 L-7 -70 L7 -70 L10 0 Z" fill="#9a6a3a" stroke="#6b4422" strokeWidth={3} />
      <g className="sc-sway">
        <circle cx={0} cy={-100} r={46} fill={leaf.fill} stroke={line} strokeWidth={3} />
        <circle cx={-34} cy={-76} r={28} fill={leaf.fill} stroke={line} strokeWidth={3} />
        <circle cx={34} cy={-76} r={28} fill={leaf.fill} stroke={line} strokeWidth={3} />
        {spots.map(([fx, fy], i) => (
          <g key={i}>
            <circle cx={fx} cy={fy} r={7} fill={fruit} stroke={ink(fruit)} strokeWidth={2} />
            <circle cx={fx - 2.2} cy={fy - 2.4} r={2} fill="#fff" opacity={0.55} />
          </g>
        ))}
      </g>
    </g>
  )
}

/** A round leafy bush. (x, y) is the middle of its foot. */
function Bush({ x, y, s = 1, color = '#4fb85a' }: { x: number; y: number; s?: number; color?: string }) {
  const leaf = useShade(color, 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{leaf.def}</defs>
      <path d="M-46 0 C-58 -6 -56 -30 -38 -32 C-38 -50 -14 -56 -4 -44 C4 -60 32 -56 34 -38 C52 -40 60 -12 46 0 Z" fill={leaf.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-24 -30 q6 -6 12 0 M10 -36 q6 -6 12 0" stroke={lighten(color, 0.35)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </g>
  )
}

// ---------- People ----------

// Adam and Eve, in simple clothes (as children's Bibles draw them). Shared looks: move into people.tsx's PEOPLE.
export const ADAM: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', robe: '#c9a46a', sash: '#6cb45a' }
export const EVE: Look = { skin: '#d9a47a', hair: 'long', hairColor: '#4a3020', robe: '#7fc3a0', sash: '#f0d38a' }

type Who = { x: number; y: number; s?: number; pose?: Pose; facing?: 'left' | 'right'; blinkDelay?: number; children?: ReactNode }

/** Eve, always with the pink flower in her hair (on the same side of the picture whichever way she faces). */
const Eve = ({ facing = 'right', children, ...p }: Who) => (
  <Person {...p} facing={facing} look={EVE}>
    <HairFlower x={facing === 'left' ? 16 : -16} y={-132} />
    {children}
  </Person>
)

/** Hands drawn again over something held in front (pose "hold": the hands are at y -60), in figure units. */
const HandsOn = ({ look, x = 12, y = -60 }: { look: Look; x?: number; y?: number }) => (
  <>{[-x, x].map((hx) => <circle key={hx} cx={hx} cy={y} r={6.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />)}</>
)

/** A basket heaped with fruit, held in front (figure units, for pose "hold"). */
const FruitBasket = ({ look }: { look: Look }) => (
  <g>
    {[[-11, -69, '#ff6b6b'], [11, -69, '#ffa63d'], [0, -74, '#ff6b6b'], [-3, -66, '#ffd34d'], [8, -64, '#9b6bd0']].map(([fx, fy, c]) => (
      <circle key={`${fx}${fy}`} cx={fx as number} cy={fy as number} r={6} fill={c as string} stroke={ink(c as string)} strokeWidth={1.6} />
    ))}
    <path d="M-1 -80 q3 -4 6 -3" stroke="#4f8a3a" strokeWidth={2} fill="none" strokeLinecap="round" />
    <path d="M-21 -64 L21 -64 L16 -42 L-16 -42 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M-19.5 -57 H19.5 M-17.5 -49.5 H17.5" stroke="#8a5428" strokeWidth={1.6} />
    <HandsOn look={look} x={14} y={-60} />
  </g>
)

/**
 * A clay jar held in front and tipped to the right, pouring water down onto the ground in front of the
 * holder's right foot (figure units, for pose "hold"; facing right, it pours to the picture's right).
 */
const WaterJar = ({ look }: { look: Look }) => (
  <g>
    {/* the water: a stream from the jar's mouth curving down onto the flowers, splashing at the bottom */}
    <path d="M26 -55 C34 -48 39 -34 40 -6" stroke="#7cc6ef" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M26 -55 C34 -48 39 -34 40 -6" stroke="#bfe8ff" strokeWidth={5.5} fill="none" strokeLinecap="round" />
    <path d="M28 -52 C33 -47 36 -36 37 -14" stroke="#ffffff" strokeWidth={1.8} fill="none" strokeLinecap="round" />
    {[[31, -10, 2.2, -30], [49, -9, 2.2, 30], [45, -18, 1.8, 20]].map(([dx, dy, r, a]) => (
      <path key={dx} d={drop(r)} transform={`translate(${dx} ${dy}) rotate(${a})`} fill="#bfe8ff" stroke="#7cc6ef" strokeWidth={1} />
    ))}
    {/* the clay jar, tipped right over so its mouth points down at the flowers */}
    <g transform="translate(4 -64) rotate(112) scale(1.3)">
      <path d="M-12 -6 C-16 4 -12 14 0 15 C12 14 16 4 12 -6 C9 -11 5 -12 4 -14 L4 -18 L-4 -18 L-4 -14 C-5 -12 -9 -11 -12 -6 Z" fill="#d98a52" stroke="#9a5a2a" strokeWidth={2.4} strokeLinejoin="round" />
      <ellipse cx={0} cy={-18.5} rx={7} ry={2.6} fill="#c27a44" stroke="#9a5a2a" strokeWidth={2} />
      <path d="M-13.5 1 Q0 5 13.5 1" stroke="#b86a34" strokeWidth={2.2} fill="none" />
      <ellipse cx={-6} cy={-2} rx={3} ry={5} fill="#fff" opacity={0.3} />
    </g>
    {[[-12, -70], [14, -56]].map(([hx, hy]) => <circle key={hx} cx={hx} cy={hy} r={6.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />)}
  </g>
)

/** The middle of an animal's picture (see kit Emoji) for an animal of `size` standing with its feet at (x, feet). */
const stand = (x: number, feet: number, size: number) => ({ x, y: feet - 0.42 * size, size })

// ---------- The garden of Eden ----------

/** Eden's river, winding down from the far hills to the front of the picture. */
const RIVER = 'M597 266 C580 280 566 290 569 304 C572 320 560 330 566 344 C574 364 596 376 606 394 C620 418 638 432 640 450 L796 450 C778 428 736 410 704 390 C676 372 642 360 634 342 C626 324 614 314 611 302 C608 288 612 276 613 266 Z'

/** The little trees on Eden's far hills: [x, y (the foot of the trunk), size]. */
const FAR_TREES: [number, number, number][] = [[60, 290, 0.42], [200, 276, 0.36], [330, 268, 0.4], [470, 264, 0.34], [700, 262, 0.38], [770, 270, 0.34]]

/** The garden's land: far hills with little trees (`farTrees`), the meadow, and the sparkling river. */
function GardenLand({ farTrees = FAR_TREES }: { farTrees?: [number, number, number][] }) {
  return (
    <g>
      <path d="M0 296 Q120 246 260 272 Q400 236 540 264 Q680 238 800 262 L800 450 L0 450 Z" fill="#a8d8a0" />
      {farTrees.map(([tx, ty, ts]) => <Tree key={tx} x={tx} y={ty} s={ts} />)}
      <path d="M0 330 Q160 300 340 318 Q480 330 560 312 Q680 292 800 306 L800 450 L0 450 Z" fill="#8fd18a" />
      <path d={RIVER} fill="#6cc0f2" stroke="#4f9fd8" strokeWidth={3} strokeLinejoin="round" />
      <path d="M603 282 C590 300 586 320 594 340 C604 362 630 380 660 404" stroke="#a6dcff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
      {/* (ripples pulse in place: the sea's sliding waves would slide off a narrow river) */}
      {[[584, 318], [616, 376], [690, 424], [740, 440]].map(([wx, wy], i) => (
        <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.45}s` }} d={`M${wx} ${wy} q8 -6 16 0`} stroke="#fff" strokeWidth={2.5} fill="none" opacity={0.75} />
      ))}
      <path d="M0 384 Q200 356 400 384 Q500 398 560 386 L612 450 L0 450 Z" fill="#6cc46a" />
    </g>
  )
}

// ---------- Pages ----------

// 1. Day one: light. Only God, and His light shining in the dark (the sparkles stay inside the light, so they can't be stars).
const Page1 = () => (
  <Scene sky="dark" ground="none" stars={false}>
    <Rays x={400} y={215} r={400} opacity={0.55} />
    <Glow x={400} y={215} r={300} color="#ffe9a0" />
    <Tap say="Let there be light!" sfx="sparkle">
      <Glow x={400} y={215} r={140} color="#ffffff" />
      <path className="pa-twinkle" d={sparkle(400, 215, 46)} fill="#fffbe6" />
    </Tap>
    <Tap say="Shine, shine!" sfx="ding">
      <Sparkles spots={[[332, 158, 10], [474, 164, 9], [326, 270, 8], [482, 266, 11], [400, 118, 7], [400, 316, 8], [292, 214, 6], [510, 212, 7]]} />
    </Tap>
  </Scene>
)

// 2. Day two: the sky up high and the sea down low. No sun yet: God's light comes from above.
const Page2 = () => (
  <Scene sky="day" ground="none">
    <LightFromAbove />
    <Tap say="A big, fluffy cloud!" sfx="whoosh"><Cloud x={330} y={150} s={1.3} slow /></Tap>
    <Cloud x={660} y={170} s={1} />
    <Cloud x={120} y={200} s={0.7} slow />
    <Sea y={265} />
    <Tap say="Splash!" sfx="plop"><Splash x={250} y={345} s={1.5} /></Tap>
    <Tap say="Splish!" sfx="plop"><Splash x={590} y={310} s={1} /></Tap>
    <Sparkles spots={[[470, 100, 9], [250, 110, 6], [610, 84, 7]]} />
  </Scene>
)

// 3. Day three: dry land, trees, grass and flowers. The mountains rise from behind the land and sea.
const Page3 = () => (
  <Scene sky="day" ground="none">
    <LightFromAbove />
    <Mountain x={470} y={320} w={300} h={170} />
    <Mountain x={300} y={320} w={240} h={120} color="#b3d8a8" />
    <Sea y={300} />
    <path d="M0 300 Q140 270 300 296 Q470 318 560 350 Q640 380 690 450 L0 450 Z" fill="#8fd18a" stroke="#6cb46a" strokeWidth={3} />
    <path d="M0 372 Q200 342 400 378 Q500 398 560 450 L0 450 Z" fill="#6cc46a" />
    <Tap say="A tall, tall tree!" sfx="swish"><Tree x={150} y={350} s={1.35} /></Tap>
    <Tap say="Yummy fruit!" sfx="chomp"><Tree x={330} y={330} s={0.95} fruit="#ff6b6b" /></Tap>
    <Tap say="A palm tree by the sea!" sfx="swish"><Palm x={560} y={378} s={0.8} /></Tap>
    {[[200, 372], [260, 340], [420, 360], [480, 385], [80, 380]].map(([x, y], i) => <Grass key={i} x={x} y={y} />)}
    {[[110, 412, '#ff8cc0'], [170, 422, '#ffd34d'], [230, 405, '#ffffff'], [290, 420, '#ff8cc0'], [350, 408, '#c9a8ff'], [410, 424, '#ffd34d'], [460, 410, '#ff8cc0']].map(([x, y, c], i) => (
      <Tap key={i} say="Pretty flowers!" sfx="sparkle"><Flower x={x as number} y={y as number} color={c as string} s={1.3} /></Tap>
    ))}
    <Sparkles spots={[[340, 70, 10], [460, 60, 8], [400, 110, 6]]} />
  </Scene>
)

const HILLS = ['M0 330 Q150 280 300 315 Q450 345 600 300 Q700 275 800 300 L800 450 L0 450 Z', 'M0 380 Q220 350 430 380 T800 368 L800 450 L0 450 Z']

// 4. Day four: the sun for the day, the moon and stars for the night. No animals yet (birds come on day five).
const Page4 = () => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`nt${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#18163f" /><stop offset="1" stopColor="#3b3486" /></linearGradient>
        <linearGradient id={`fd${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0.36" stopColor="#fff" stopOpacity={0} /><stop offset="0.64" stopColor="#fff" stopOpacity={1} /></linearGradient>
        <mask id={`mk${id}`}><rect width={800} height={450} fill={`url(#fd${id})`} /></mask>
      </defs>
      <g mask={`url(#mk${id})`}>
        <rect width={800} height={450} fill={`url(#nt${id})`} />
      </g>
      <Tap say="The bright, warm sun!" sfx="sparkle"><Sun x={210} y={130} s={1.3} /></Tap>
      <Cloud x={150} y={190} s={0.8} slow />
      <Tap say="Twinkle, twinkle, little stars!" sfx="ding">
        {[[470, 60], [540, 150], [610, 50], [700, 120], [660, 210], [500, 230], [740, 260], [590, 270]].map(([x, y], i) => (
          <path key={i} className="pa-twinkle" style={{ animationDelay: `${(i % 4) * 0.4}s` }} d={sparkle(x, y, i % 3 ? 7 : 11)} fill="#fff8d0" />
        ))}
      </Tap>
      <Tap say="Hello, moon!" sfx="ding"><Moon x={600} y={140} s={1.25} /></Tap>
      {HILLS.map((d, i) => <path key={i} d={d} fill={i ? '#7cc46a' : '#a8d8a0'} />)}
      <g mask={`url(#mk${id})`} fill="#1d1a4a" opacity={0.55}>
        {HILLS.map((d, i) => <path key={i} d={d} />)}
      </g>
      <Tree x={130} y={380} s={0.9} />
      <NightTree x={670} y={392} s={0.9} />
      <Flower x={280} y={410} color="#ffd34d" s={1.2} />
      <Flower x={320} y={420} color="#ff8cc0" s={1.2} />
    </Scene>
  )
}

// 5. Day five: fish in the sea and birds in the sky, all of them flying or swimming.
const Page5 = () => (
  <Scene sky="day" ground="none" sun>
    {/* the dolphin is drawn before the sea, so it swims at the surface: head, back fin and tail above the water */}
    <Tap say="Splish, splash!" sfx="plop"><Emoji e="🐬" {...stand(600, 262, 130)} /></Tap>
    <Sea y={235} />
    <Splash x={676} y={240} s={0.55} />
    <Tap say="Coo, coo!" sfx="whoosh"><Dove x={270} y={135} s={1.4} /></Tap>
    <Dove x={392} y={186} s={1} />
    <Tap say="Tweet, tweet!" sfx="ding"><Bird x={470} y={142} s={0.9} facing="left" /></Tap>
    <Fish x={180} y={330} s={1.3} />
    <Tap say="Blub, blub!" sfx="plop"><Fish x={330} y={390} s={1.1} color="#ff8cc0" facing="left" /></Tap>
    <Fish x={470} y={340} s={1.2} color="#ffe14d" />
    <Emoji e="🐠" x={650} y={375} size={72} bob />
    <Bubbles x={240} y={310} />
    <Bubbles x={520} y={320} s={0.8} />
  </Scene>
)

// 6. Day six: animals of every kind (true to size: the giraffe and elephant tower over the rest). This is
// page 7's meadow before Adam and Eve were made, with a zebra and a monkey where they will stand.
const Page6 = () => (
  <Scene sky="day" ground="meadow" sun>
    <Glow x={428} y={150} r={170} />
    <Emoji e="🦒" {...stand(115, 345, 250)} flip />
    <Tap say="Toot, toot!" sfx="whoosh"><Emoji e="🐘" {...stand(222, 404, 232)} /></Tap>
    <Emoji e="🦓" {...stand(400, 406, 200)} flip />
    <Tap say="Ooh, ooh, ah, ah!" sfx="pop"><Emoji e="🐒" {...stand(502, 414, 88)} /></Tap>
    <Tap say="Roar!" sfx="pop"><Emoji e="🦁" {...stand(605, 410, 138)} /></Tap>
    <Tap say="Hop, hop!" sfx="pop"><Emoji e="🐰" {...stand(720, 414, 54)} /></Tap>
    <Sparkles spots={[[366, 150, 8], [496, 140, 10], [430, 110, 6]]} />
  </Scene>
)

// 7. Part 2 begins, still on day six: "after God made the animals, He made the first people, Adam and Eve!
// God loved them, and He made them to be His friends." The meadow again, now with Adam and Eve in God's
// light, and His love (the heart). Also the "day six, animals and people" card.
const Page7 = () => (
  <Scene sky="day" ground="meadow" sun>
    <Glow x={428} y={150} r={170} />
    <Emoji e="🦒" {...stand(115, 345, 250)} flip />
    <Tap say="Toot, toot!" sfx="whoosh"><Emoji e="🐘" {...stand(222, 404, 232)} /></Tap>
    <Tap say="God made us, and God loves us!" sfx="sparkle">
      <Person x={382} y={410} s={1.15} look={ADAM} pose="wave" />
      <Eve x={477} y={414} s={1.1} pose="wave" facing="left" blinkDelay={1.6} />
    </Tap>
    <Emoji e="💛" x={430} y={170} size={44} bob />
    <Tap say="Roar!" sfx="pop"><Emoji e="🦁" {...stand(605, 410, 138)} /></Tap>
    <Tap say="Hop, hop!" sfx="pop"><Emoji e="🐰" {...stand(720, 414, 54)} /></Tap>
    <Sparkles spots={[[366, 150, 8], [496, 140, 10], [430, 110, 6]]} />
  </Scene>
)

// 8. "God gave Adam and Eve a beautiful garden called Eden. It had a sparkly river and trees full of yummy
// fruit. God asked them to take good care of it." Eve has picked a basket of fruit; Adam waters the flowers
// with water from the river. God's light shines down on the garden.
const Page8 = () => (
  <Scene sky="day" ground="none" sun>
    <Rays x={400} y={-60} r={560} n={16} color="#fff6c0" opacity={0.2} />
    {/* (without the far trees that would peek out round the fruit trees, like lumps on them) */}
    <GardenLand farTrees={FAR_TREES.filter(([tx]) => tx !== 60 && tx !== 200 && tx !== 700)} />
    <FruitTree x={724} y={344} s={0.78} fruit="#ffa63d" />
    <Tap say="Splish, splash!" sfx="plop">
      <Sparkles spots={[[592, 300, 7], [612, 352, 9], [668, 398, 8], [720, 432, 10]]} color="#ffffff" />
    </Tap>
    <Tap say="So much yummy fruit!" sfx="chomp"><FruitTree x={128} y={372} s={1.38} /></Tap>
    <Bush x={58} y={424} s={0.8} />
    {[[210, 432, '#ffd34d'], [356, 436, '#c9a8ff'], [538, 430, '#ffffff']].map(([fx, fy, c], i) => <Flower key={i} x={fx as number} y={fy as number} color={c as string} s={1.2} />)}
    <Tap say="Thank you, God, for this beautiful garden!" sfx="sparkle">
      <Eve x={268} y={414} s={1.05} pose="hold" blinkDelay={1.2}><FruitBasket look={EVE} /></Eve>
    </Tap>
    <Tap say="I will take good care of God's garden!" sfx="good">
      <Person x={420} y={412} s={1.08} look={ADAM} pose="hold"><WaterJar look={ADAM} /></Person>
    </Tap>
    {/* the flowers Adam is watering, at the foot of the water */}
    {[[458, 420, '#ff8cc0'], [478, 426, '#ffd34d'], [498, 418, '#ff8cc0']].map(([fx, fy, c], i) => <Flower key={i} x={fx as number} y={fy as number} color={c as string} s={1.1} />)}
    <Sparkles spots={[[320, 120, 9], [470, 96, 7], [400, 160, 6]]} />
  </Scene>
)

// 9. "God brought the animals to Adam, and Adam gave each one a name. Zebra! Monkey! Bear! What a fun job!"
// The animals wait their turn in a line, the zebra first, and the giraffe last, on the far bank of the
// river (its feet clear of the water); Adam points to the zebra. (Eve isn't in this picture: in Genesis,
// Adam named the animals before Eve was made.)
const Page9 = () => (
  <Scene sky="day" ground="none" sun>
    <Rays x={400} y={-60} r={560} n={16} color="#fff6c0" opacity={0.16} />
    <GardenLand />
    <Emoji e="🦒" {...stand(700, 358, 204)} />
    <Glow x={420} y={250} r={150} />
    <Tap say="You are a zebra!" sfx="good">
      <Person x={146} y={414} s={1.12} look={ADAM} pose="point" />
    </Tap>
    <Tap say="Neigh! I love my name!" sfx="pop"><Emoji e="🦓" {...stand(306, 412, 200)} /></Tap>
    <Tap say="Ooh, ooh, ah, ah!" sfx="pop"><Emoji e="🐒" {...stand(432, 416, 90)} /></Tap>
    <Tap say="Grr! Hello, Adam!" sfx="pop"><Emoji e="🐻" {...stand(540, 418, 122)} /></Tap>
    {[[36, 434, '#ff8cc0'], [236, 438, '#ffd34d'], [600, 440, '#ffffff']].map(([fx, fy, c], i) => <Flower key={i} x={fx as number} y={fy as number} color={c as string} s={1.1} />)}
    <Sparkles spots={[[300, 196, 8], [420, 300, 6], [530, 250, 7]]} />
  </Scene>
)

/** The child playing (God made you, too!), drawn from their profile. */
const Kid = ({ x, y, s }: { x: number; y: number; s: number }) => <Person x={x} y={y} s={s} look={usePlayer().look} pose="arms-up" />

// 10. Day seven: God rested, because all His work was done. Everything He made, calm at sunset: the light,
// the sky and sea, land and plants, the sun, moon and stars, a fish and a bird, animals, and you.
const Page10 = () => (
  <Scene sky="dusk" ground="none" stars moon>
    <Rays x={400} y={-70} r={430} n={16} color="#fff1c9" opacity={0.2} />
    <Sun x={612} y={302} s={1.15} />
    <Sea y={300} />
    <path d="M0 318 Q150 292 320 306 Q470 318 560 356 Q630 388 660 450 L0 450 Z" fill="#86b98e" stroke="#6fa278" strokeWidth={3} />
    <path d="M0 386 Q200 356 390 386 Q470 400 520 450 L0 450 Z" fill="#62a36c" />
    <Glow x={318} y={300} r={130} color="#ffe9b0" />
    <Tree x={120} y={372} s={1.05} fruit="#ff6b6b" />
    {[[60, 420, '#ff8cc0'], [196, 410, '#ffd34d'], [236, 428, '#ffffff'], [604, 424, '#c9a8ff']].map(([x, y, c], i) => <Flower key={i} x={x as number} y={y as number} color={c as string} />)}
    <Dove x={500} y={168} s={0.75} facing="left" />
    <Tap say="Blub, blub!" sfx="plop"><Fish x={706} y={392} s={1} color="#ffa64d" facing="left" /></Tap>
    <Bubbles x={680} y={372} s={0.7} />
    <Tap say="God made me, and God loves me!" sfx="sparkle"><Kid x={318} y={410} s={1.4} /></Tap>
    <Emoji e="💛" x={318} y={170} size={46} bob />
    <Tap say="Baa!" sfx="pop"><Emoji e="🐑" {...stand(452, 406, 118)} /></Tap>
    <Tap say="Hop, hop!" sfx="pop"><Emoji e="🐰" {...stand(544, 414, 50)} /></Tap>
    <Sparkles spots={[[258, 200, 8], [383, 210, 9], [318, 120, 6]]} />
  </Scene>
)

/**
 * Little lines either side of two hands meeting: a clap. (0, y) is where the hands meet, in figure units.
 * They lie over the child's clothes, which are their favorite color, so each line has a white edge: it
 * shows on an orange or yellow robe as well as on a blue one.
 */
const ClapLines = ({ y = -60 }: { y?: number }) => {
  const d = [-1, 1].flatMap((side) => [-44, -8, 28].map((a) => {
    const dx = Math.cos((a * Math.PI) / 180) * side, dy = Math.sin((a * Math.PI) / 180)
    return `M${dx * 18} ${y + dy * 18} L${dx * 28} ${y + dy * 28}`
  })).join(' ')
  return (
    <g className="pa-twinkle" fill="none" strokeLinecap="round">
      <path d={d} stroke="#ffffff" strokeWidth={6} />
      <path d={d} stroke="#ff9a1f" strokeWidth={2.8} />
    </g>
  )
}

// 11. "Yes, you! God made your eyes to see, your ears to hear, and your hands to clap. You are wonderfully
// made, and God loves you so much!" The child playing, clapping in God's light: a butterfly to see, a
// bird singing to hear, and God's love (the hearts).
function Page11() {
  const p = usePlayer()
  return (
    <Scene sky="day" ground="none" clouds={false}>
      {/* (the meadow's flowers kept clear of the child's feet and the bunny) */}
      <Meadow flowers={[[90, 400, '#ff8cc0'], [210, 420, '#ffd34d'], [300, 436, '#ffffff'], [500, 434, '#ffd34d'], [622, 430, '#ffffff'], [700, 395, '#ff8cc0']]} />
      <Rays x={400} y={-30} r={620} n={18} color="#fff6c0" opacity={0.3} />
      <Glow x={400} y={250} r={200} />
      <Tree x={660} y={340} s={1.15} />
      <Tap say="Tweet, tweet! Can you hear me sing?" sfx="ding">
        <Emoji e="🐦" x={640} y={186} size={62} />
        <g className="sc-float">
          <text x={590} y={160} fontSize={30} fill="#5ba8f0" fontWeight={800} fontFamily="'Baloo 2', system-ui, sans-serif">♪</text>
          <text x={562} y={136} fontSize={24} fill="#ff8cc0" fontWeight={800} fontFamily="'Baloo 2', system-ui, sans-serif">♫</text>
        </g>
      </Tap>
      <Tap say="Flutter, flutter! Can you see me?" sfx="whoosh"><Emoji e="🦋" x={232} y={196} size={64} bob /></Tap>
      <Tap say="God made me, and I am wonderfully made!" sfx="sparkle">
        <Person x={400} y={420} s={1.75} look={p.look} pose="hold"><ClapLines /></Person>
      </Tap>
      <Tap say="God loves you so much!" sfx="sparkle">
        <Emoji e="💛" x={400} y={110} size={50} bob />
      </Tap>
      <Emoji e="💛" x={300} y={140} size={30} bob />
      <Emoji e="💛" x={508} y={136} size={32} bob />
      <Emoji e="🐰" {...stand(560, 424, 56)} />
      <Sparkles spots={[[330, 230, 7], [470, 226, 8], [400, 180, 6]]} />
    </Scene>
  )
}

export const CREATION_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]
