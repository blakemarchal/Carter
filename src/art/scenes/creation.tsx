// God Made Everything: one illustration per story page (see data/creation.ts for the words).
// God is never drawn as a person: His presence and voice are light (Glow, rays, Sparkles).
import { useId, type ComponentType } from 'react'
import { Person, type Look } from '../people'
import { usePlayer } from './player'
import { Cloud, Dove, Emoji, Fish, Flower, Glow, Moon, Palm, Scene, Sea, Sparkles, Sun, Tree, sparkle } from './kit'

// ---------- Local props ----------

/** Soft beams of light fanning out from (x, y), fading toward their tips; they turn very slowly. */
function Rays({ x, y, r = 420, n = 18, color = '#fff6b0', opacity = 0.5 }: { x: number; y: number; r?: number; n?: number; color?: string; opacity?: number }) {
  const id = `ry${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const w = (Math.PI * r) / n / 2.2
  return (
    <g className="pa-spin">
      <defs><linearGradient id={id} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={color} stopOpacity={opacity} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M0 0 L${-w} ${-r} L${w} ${-r} Z`} transform={`translate(${x} ${y}) rotate(${(i * 360) / n})`} fill={`url(#${id})`} />
      ))}
    </g>
  )
}

/** A splash: a pointy crown of water with droplets flying up and out. */
function Splash({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={58} ry={9} fill="none" stroke="#fff" strokeWidth={3} opacity={0.8} />
      <path d="M-50 4 Q-40 -6 -38 -30 Q-30 -10 -20 -8 Q-16 -36 -6 -56 Q2 -30 8 -10 Q18 -14 26 -42 Q30 -12 50 4 Z" fill="#9bd8ff" stroke="#ffffff" strokeWidth={3.5} strokeLinejoin="round" />
      <g className="sc-float">
        {[[-44, -50, -30], [-16, -80, -10], [18, -76, 12], [44, -54, 32]].map(([cx, cy, a], i) => (
          <path key={i} d={`M${cx} ${cy - 9} Q${cx + 7} ${cy + 2} ${cx} ${cy + 5} Q${cx - 7} ${cy + 2} ${cx} ${cy - 9} Z`} transform={`rotate(${a} ${cx} ${cy})`} fill="#9bd8ff" stroke="#ffffff" strokeWidth={2.5} />
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

const ADAM: Look = { skin: '#c68b5e', hair: 'short', hairColor: '#3b2a20', robe: '#c9a46a', sash: '#6cb45a' }
const EVE: Look = { skin: '#d9a47a', hair: 'long', hairColor: '#4a3020', robe: '#7fc3a0', sash: '#f0d38a' }

// ---------- Pages ----------

// 1. "In the very beginning, there was only God. Then God said, let there be light! And there was light."
const Page1 = () => (
  <Scene sky="dark" ground="none" stars={false}>
    <Rays x={400} y={215} r={400} opacity={0.55} />
    <Glow x={400} y={215} r={300} color="#ffe9a0" />
    <Glow x={400} y={215} r={140} color="#ffffff" />
    <path className="pa-twinkle" d={sparkle(400, 215, 46)} fill="#fffbe6" />
    <Sparkles spots={[[250, 130, 12], [560, 120, 10], [190, 290, 8], [610, 300, 12], [330, 340, 7], [480, 90, 7], [470, 350, 9], [300, 80, 6]]} />
  </Scene>
)

// 2. "Next, God made the big blue sky up high, and the splashy sea down low."
const Page2 = () => (
  <Scene sky="day" ground="none">
    <Glow x={400} y={50} r={160} />
    <Cloud x={330} y={150} s={1.3} slow />
    <Cloud x={660} y={170} s={1} />
    <Cloud x={120} y={200} s={0.7} slow />
    <Sea y={265} />
    <Splash x={250} y={340} s={1.7} />
    <Splash x={580} y={305} s={1.1} />
    <Sparkles spots={[[440, 90, 9], [230, 110, 6], [600, 80, 7]]} />
  </Scene>
)

// 3. "Then God made dry land, with tall trees, soft grass, and pretty flowers. God said, it is good!"
const Page3 = () => (
  <Scene sky="day" ground="none">
    <Sea y={300} />
    <Mountain x={470} y={320} w={300} h={170} />
    <Mountain x={300} y={320} w={240} h={120} color="#b3d8a8" />
    <path d="M0 300 Q140 270 300 296 Q470 318 560 350 Q640 380 690 450 L0 450 Z" fill="#8fd18a" stroke="#6cb46a" strokeWidth={3} />
    <path d="M0 372 Q200 342 400 378 Q500 398 560 450 L0 450 Z" fill="#6cc46a" />
    <Tree x={150} y={350} s={1.35} />
    <Tree x={330} y={330} s={0.95} fruit="#ff6b6b" />
    <Palm x={560} y={378} s={0.8} />
    {[[110, 412, '#ff8cc0'], [170, 422, '#ffd34d'], [230, 405, '#ffffff'], [290, 420, '#ff8cc0'], [350, 408, '#c9a8ff'], [410, 424, '#ffd34d'], [460, 410, '#ff8cc0']].map(([x, y, c], i) => (
      <Flower key={i} x={x as number} y={y as number} color={c as string} s={1.3} />
    ))}
    {[[200, 372], [260, 340], [420, 360], [480, 385], [80, 380]].map(([x, y], i) => <Grass key={i} x={x} y={y} />)}
    <Glow x={400} y={70} r={150} />
    <Sparkles spots={[[340, 70, 10], [460, 60, 8], [400, 110, 6]]} />
  </Scene>
)

const HILLS = ['M0 330 Q150 280 300 315 Q450 345 600 300 Q700 275 800 300 L800 450 L0 450 Z', 'M0 380 Q220 350 430 380 T800 368 L800 450 L0 450 Z']

// 4. "God made the bright sun for the daytime. He made the moon and twinkly stars for the night. The night is good, too!"
const Page4 = () => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`nt${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#18163f" /><stop offset="1" stopColor="#3b3486" /></linearGradient>
        <linearGradient id={`fd${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0.36" stopColor="#fff" stopOpacity={0} /><stop offset="0.64" stopColor="#fff" stopOpacity={1} /></linearGradient>
        <mask id={`mk${id}`}><rect width={800} height={450} fill={`url(#fd${id})`} /></mask>
      </defs>
      <Cloud x={150} y={190} s={0.8} slow />
      <g mask={`url(#mk${id})`}>
        <rect width={800} height={450} fill={`url(#nt${id})`} />
      </g>
      <Sun x={210} y={130} s={1.3} />
      {[[470, 60], [540, 150], [610, 50], [700, 120], [660, 210], [500, 230], [740, 260], [590, 270]].map(([x, y], i) => (
        <path key={i} className="pa-twinkle" style={{ animationDelay: `${(i % 4) * 0.4}s` }} d={sparkle(x, y, i % 3 ? 7 : 11)} fill="#fff8d0" />
      ))}
      <Moon x={600} y={140} s={1.25} />
      {HILLS.map((d, i) => <path key={i} d={d} fill={i ? '#7cc46a' : '#a8d8a0'} />)}
      <g mask={`url(#mk${id})`} fill="#1d1a4a" opacity={0.55}>
        {HILLS.map((d, i) => <path key={i} d={d} />)}
      </g>
      <Tree x={130} y={380} s={0.9} />
      <Flower x={280} y={410} color="#ffd34d" s={1.2} />
      <Flower x={320} y={420} color="#ff8cc0" s={1.2} />
      <Emoji e="🦉" x={640} y={330} size={40} bob />
    </Scene>
  )
}

// 5. "God filled the sea with fish, and the sky with birds. Splish, splash! Tweet, tweet!"
const Page5 = () => (
  <Scene sky="day" ground="none" sun>
    <Sea y={235} />
    <Dove x={220} y={120} s={1.4} />
    <Dove x={360} y={170} s={1} />
    <Emoji e="🐦" x={480} y={95} size={44} bob />
    <Emoji e="🐬" x={600} y={200} size={84} bob />
    <Splash x={560} y={262} s={0.8} />
    <Fish x={180} y={330} s={1.3} />
    <Fish x={330} y={390} s={1.1} color="#ff8cc0" facing="left" />
    <Fish x={470} y={340} s={1.2} color="#ffe14d" />
    <Emoji e="🐠" x={640} y={385} size={52} bob />
    <Bubbles x={240} y={310} />
    <Bubbles x={520} y={320} s={0.8} />
  </Scene>
)

// 6. "Then God made animals of every kind. And God made people, to be His friends and to know His love."
const Page6 = () => (
  <Scene sky="day" ground="meadow" sun>
    <Glow x={400} y={150} r={170} />
    <Emoji e="🦒" x={150} y={290} size={96} bob />
    <Emoji e="🐘" x={230} y={360} size={76} bob />
    <Person x={355} y={410} s={1.15} look={ADAM} pose="wave" />
    <Person x={450} y={414} s={1.1} look={EVE} pose="wave" facing="left" blinkDelay={1.6}>
      <HairFlower x={16} y={-132} />
    </Person>
    <Emoji e="💛" x={405} y={170} size={44} bob />
    <Emoji e="🦁" x={570} y={375} size={62} bob flip />
    <Emoji e="🐰" x={660} y={400} size={46} bob flip />
    <Sparkles spots={[[340, 150, 8], [470, 140, 10], [405, 110, 6]]} />
  </Scene>
)

/** The child playing (God made you, too!), drawn from their profile. */
const Kid = ({ x, y, s }: { x: number; y: number; s: number }) => <Person x={x} y={y} s={s} look={usePlayer().look} pose="arms-up" />

// 7. "God looked at everything He made, and it was very, very good! Then God rested. God made it all, and God made you, too!"
const Page7 = () => (
  <Scene sky="dusk" ground="none" stars moon>
    <Sun x={560} y={320} s={1.2} />
    <path d="M0 310 Q160 270 340 300 Q520 330 640 300 Q720 282 800 296 L800 450 L0 450 Z" fill="#86b98e" />
    <path d="M0 375 Q220 345 430 375 T800 362 L800 450 L0 450 Z" fill="#62a36c" />
    <Glow x={330} y={300} r={130} color="#ffe9b0" />
    <Tree x={140} y={370} s={1.1} fruit="#ff6b6b" />
    <Kid x={330} y={410} s={1.4} />
    <Emoji e="💛" x={330} y={170} size={46} bob />
    <Emoji e="🐑" x={510} y={392} size={64} />
    <Emoji e="🐰" x={610} y={402} size={48} />
    <Emoji e="💤" x={560} y={335} size={38} bob />
    <Sparkles spots={[[270, 200, 8], [395, 210, 9], [330, 120, 6]]} />
  </Scene>
)

export const CREATION_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
