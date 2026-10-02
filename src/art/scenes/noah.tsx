// Noah and the Big Boat: one illustration per story page (see data/noah.ts for the words).
import { Person, PEOPLE } from '../people'
import { Ark, Cloud, Dove, Emoji, Glow, Palm, Rainbow, Scene, Sea, Sparkles, Tree, House } from './kit'

// 1. "Long ago there was a man named Noah. Noah loved God, and God loved Noah."
const Page1 = () => (
  <Scene sky="day" ground="meadow" sun>
    <Glow x={400} y={60} r={200} />
    <House x={620} y={330} w={90} />
    <Tree x={160} y={350} s={1.1} fruit="#ff6b6b" />
    <Person x={400} y={400} s={1.25} look={PEOPLE.noah} pose="pray" />
    <Sparkles spots={[[330, 150], [470, 130, 10], [400, 100, 6]]} />
  </Scene>
)

// 2. "God told Noah, build a great big boat called an ark! … Bang, bang, bang!"
const Page2 = () => (
  <Scene sky="day" ground="hills" sun>
    <Ark x={470} y={330} s={1.1} />
    <Person x={190} y={410} s={1.15} look={PEOPLE.noah} pose="hold" holding="hammer" />
    <Person x={290} y={420} s={0.95} look={PEOPLE.noahsWife} pose="wave" blinkDelay={1.4} />
    <g>
      {[0, 1, 2].map((i) => <rect key={i} x={60} y={380 + i * 14} width={110} height={12} rx={4} fill="#c98448" stroke="#8a5428" strokeWidth={2.5} />)}
    </g>
    <Emoji e="💥" x={235} y={300} size={40} bob />
  </Scene>
)

// 3. "Then the animals came, two by two! Lions and elephants and giraffes, too."
const Page3 = () => (
  <Scene sky="day" ground="meadow" sun>
    <Ark x={560} y={320} s={0.95} door />
    <Person x={680} y={410} s={0.95} look={PEOPLE.noah} pose="wave" facing="left" />
    {[['🦒', 60, 330, 70], ['🦒', 120, 340, 70], ['🐘', 200, 370, 66], ['🐘', 270, 375, 66], ['🦁', 340, 395, 54], ['🦁', 395, 400, 54]].map(([e, x, y, size], i) => (
      <Emoji key={i} e={e as string} x={x as number} y={y as number} size={size as number} bob flip />
    ))}
    <Palm x={40} y={420} s={0.8} />
  </Scene>
)

// 4. "The rain fell and fell. But Noah, his family, and all the animals were safe inside the ark."
const Page4 = () => (
  <Scene sky="storm" ground="none" rain>
    <Cloud x={120} y={60} s={1.4} grey />
    <Cloud x={430} y={40} s={1.6} grey slow />
    <Cloud x={700} y={70} s={1.3} grey />
    <Sea y={300} />
    <Ark x={400} y={320} s={1} />
    <Glow x={400} y={240} r={110} color="#ffe9a0" />
  </Scene>
)

// 5. "When the rain stopped, Noah sent out a little dove. The dove came back with an olive leaf!"
const Page5 = () => (
  <Scene sky="day" ground="none" sun>
    <Sea y={300} />
    <Ark x={300} y={320} s={0.95} />
    <Dove x={560} y={170} s={1.6} leaf />
    <Sparkles spots={[[620, 140], [520, 120, 6]]} />
    <path d="M650 300 Q700 270 760 300 Z" fill="#8fd18a" />
  </Scene>
)

// 6. "God put a beautiful rainbow in the sky. It was His promise: God always keeps His promises!"
const Page6 = () => (
  <Scene sky="dawn" ground="hills">
    <Rainbow x={400} y={330} r={320} />
    <Ark x={620} y={330} s={0.7} door />
    <Person x={290} y={410} s={1.1} look={PEOPLE.noah} pose="arms-up" />
    <Person x={390} y={415} s={0.95} look={PEOPLE.noahsWife} pose="arms-up" blinkDelay={2} />
    <Emoji e="🐑" x={120} y={395} size={50} bob />
    <Emoji e="🕊️" x={500} y={150} size={44} bob />
    <Sparkles spots={[[200, 120], [600, 110], [400, 70, 10]]} />
  </Scene>
)

export const NOAH_ART = [Page1, Page2, Page3, Page4, Page5, Page6]
