// Development only: a small kit for each mini-game mechanic, for trying it out at #gallery/game/<kind>
// before any island's kit is ready. Plain shapes on purpose; the islands draw the real ones.
import type { BuildKit, CatchKit, PaintKit, RhythmKit, ShareKit, SpotKit, SteerKit } from '../../activities/games/types'
import { Scene } from '../../art/scenes/kit'
import { Person, PEOPLE } from '../../art/people'
import { Sheep, Tree } from '../../art/scenes/kit' // (spot and paint)
import { Sheep as RhythmSheep, Sun as SteerSun } from '../../art/scenes/kit' // (steer and rhythm)

const Block = ({ w, h, color }: { w: number; h: number; color: string }) =>
  <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={color} stroke="#5a3a24" strokeWidth={3} />

// Build: a little house and a tree. The walls and the tree can go first; the roof, door and window
// wait for the walls, and the chimney for the roof (two steps of `after`, so the chimney tried while
// the walls are still out says "First the walls!" and lights them up). The chimney is tiny, for the smallest snap. Finished:
// smoke from the chimney and two hearts.
const build: BuildKit = {
  Backdrop: () => <Scene sky="day" ground="meadow" />,
  parts: [
    { id: 'walls', say: 'the walls', at: [400, 300], size: [220, 140], Draw: () => <Block w={220} h={140} color="#f2d39a" /> },
    { id: 'roof', say: 'the roof', at: [400, 190], size: [260, 80], after: ['walls'], Draw: () => <path d="M-130 40 L0 -40 L130 40 Z" fill="#c0504d" stroke="#5a3a24" strokeWidth={3} /> },
    { id: 'door', say: 'the door', at: [400, 330], size: [50, 80], after: ['walls'], Draw: () => <Block w={50} h={80} color="#a0703f" /> },
    { id: 'window', say: 'the window', at: [330, 285], size: [50, 50], after: ['walls'], Draw: () => <Block w={50} h={50} color="#bfe6ff" /> },
    { id: 'chimney', say: 'the chimney', at: [466, 170], size: [28, 44], after: ['roof'], Draw: () => <Block w={28} h={44} color="#b5651d" /> },
    {
      id: 'tree', say: 'the tree', at: [640, 290], size: [100, 160], Draw: () => (
        <g stroke="#5a3a24" strokeWidth={3}>
          <rect x={-12} y={10} width={24} height={70} fill="#a0703f" />
          <circle cx={0} cy={-25} r={50} fill="#5fbf5a" />
        </g>
      ),
    },
  ],
  Finished: () => (
    <g>
      {[0, 1, 2].map((i) => <circle key={i} cx={470 + i * 10} cy={128 - i * 26} r={10 + i * 4} fill="#ffffff" opacity={0.85 - i * 0.2} stroke="#c9c9d6" strokeWidth={2} />)}
      {[[250, 150], [560, 120]].map(([x, y]) => (
        <path key={x} transform={`translate(${x} ${y}) scale(2)`} d="M0 -4 C-5 -12 -15 -8 -10 0 L0 9 L10 0 C15 -8 5 -12 0 -4 Z" fill="#ff6fae" stroke="#d43a7c" strokeWidth={1.5} />
      ))}
    </g>
  ),
}

// Spot: five sheep lying low in the grass; found, each stands up with a heart. Two say a line when
// found (the rest are counted), one hides behind a bush (Front), and one asks for a tiny reach (r 30:
// the game still gives it 40).
const Heart = ({ y }: { y: number }) => <path d={`M0 ${y - 4} C-5 ${y - 12} -15 ${y - 8} -10 ${y} L0 ${y + 9} L10 ${y} C15 ${y - 8} 5 ${y - 12} 0 ${y - 4} Z`} fill="#ff6fae" stroke="#d43a7c" strokeWidth={2} />
const SpotSheep = ({ found, lift = 0 }: { found: boolean; lift?: number }) => found
  ? <g transform={`translate(0 ${-lift})`}><Sheep x={-6} y={30} s={0.9} /><Heart y={-48} /></g>
  : <g transform={`translate(0 ${-lift * 0.6})`}><Sheep x={-4} y={22} s={0.62} /></g>
const spot: SpotKit = {
  Picture: () => <Scene sky="day" ground="meadow"><Tree x={600} y={330} s={0.9} /><Tree x={70} y={320} s={0.7} /></Scene>,
  targets: [
    { id: 'sheep-a', at: [150, 365], r: 50, Draw: ({ found }) => <SpotSheep found={found} /> },
    { id: 'sheep-b', at: [330, 305], r: 50, say: 'Baa! You found me!', Draw: ({ found }) => <SpotSheep found={found} /> },
    { id: 'sheep-c', at: [500, 395], r: 30, Draw: ({ found }) => <SpotSheep found={found} /> },
    { id: 'sheep-d', at: [705, 350], r: 55, say: 'Here I am, behind the bush!', Draw: ({ found }) => <SpotSheep found={found} lift={34} /> },
    { id: 'sheep-e', at: [265, 415], r: 45, Draw: ({ found }) => <SpotSheep found={found} /> },
  ],
  Front: () => (
    <g fill="#4fae5a" stroke="#2f7d3a" strokeWidth={3}>
      <circle cx={672} cy={372} r={30} /><circle cx={738} cy={372} r={30} /><circle cx={705} cy={358} r={36} />
      <path d="M640 392 L770 392" stroke="#2f7d3a" strokeWidth={4} />
    </g>
  ),
}

// Paint: a little house to color by number, with four paints. The windows' crossbars and the doorknob
// are drawn over their regions (paint goes under them), the chimney is tiny (its number shrinks to fit),
// and the sun is moved into place with a transform.
const paint: PaintKit = {
  Picture: ({ fills }) => {
    const f = (id: string) => fills[id] ?? '#ffffff'
    const line = { stroke: '#5a3a24', strokeWidth: 4, strokeLinejoin: 'round' as const }
    return (
      <Scene sky="day" ground="none" clouds={false}>
        <path data-region="grass" d="M0 372 Q200 350 400 372 T800 366 L800 450 L0 450 Z" fill={f('grass')} {...line} />
        <path data-region="chimney" d="M420 150 h26 v56 h-26 Z" fill={f('chimney')} {...line} />
        <path data-region="walls" d="M250 236 h220 v150 h-220 Z" fill={f('walls')} {...line} />
        <path data-region="roof" d="M226 240 L360 140 L494 240 Z" fill={f('roof')} {...line} />
        <path data-region="door" d="M336 302 h48 v84 h-48 Z" fill={f('door')} {...line} />
        <path data-region="window-l" d="M270 258 h46 v44 h-46 Z" fill={f('window-l')} {...line} />
        <path data-region="window-r" d="M404 258 h46 v44 h-46 Z" fill={f('window-r')} {...line} />
        <g transform="translate(640 110) rotate(12)">
          <path data-region="sun" d="M-50 0 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0 Z" fill={f('sun')} {...line} />
        </g>
        <path d="M293 258 v44 M270 280 h46 M427 258 v44 M404 280 h46" stroke="#5a3a24" strokeWidth={4} />
        <circle cx={374} cy={348} r={4.5} fill="#5a3a24" />
      </Scene>
    )
  },
  regions: [
    { id: 'walls', n: 1, at: [430, 346] },
    { id: 'chimney', n: 1, at: [433, 168] },
    { id: 'door', n: 2, at: [358, 334] },
    { id: 'sun', n: 2, at: [640, 110] },
    { id: 'roof', n: 3, at: [360, 206] },
    { id: 'window-l', n: 3, at: [293, 280] },
    { id: 'window-r', n: 3, at: [427, 280] },
    { id: 'grass', n: 4, at: [120, 410] },
  ],
  palette: [{ n: 1, color: '#ff6b6b', name: 'red' }, { n: 2, color: '#ffd34d', name: 'yellow' }, { n: 3, color: '#5fb7ff', name: 'blue' }, { n: 4, color: '#5fd39a', name: 'green' }],
}

// Steer: a sheep leads her three lambs home along a winding path. It doubles back once (so they all
// turn round), starts near the edge (so the lambs wait bunched up), has four flowers to pick up (one
// a little off the path), tall grass in front (Front), and a sun that arcs over as they go (progress).
const DemoSheep = ({ s = 1, moving = false, facing = 1 }: { s?: number; moving?: boolean; facing?: 1 | -1 }) => (
  <g transform={`scale(${facing * s} ${s})`}>
    {[-20, -7, 8, 20].map((x, i) => (
      <rect key={i} x={x - 4} y={6} width={8} height={26} rx={4} fill="#4a3a40">
        {moving && <animateTransform attributeName="transform" type="rotate" dur="0.42s" repeatCount="indefinite"
          values={`${i % 2 ? 24 : -24} ${x} 8;${i % 2 ? -24 : 24} ${x} 8;${i % 2 ? 24 : -24} ${x} 8`} />}
      </rect>
    ))}
    <g fill="#ffffff" stroke="#c9bfd0" strokeWidth={2}>
      <circle cx={-16} cy={-6} r={16} /><circle cx={2} cy={-12} r={17} /><circle cx={17} cy={-4} r={15} /><circle cx={-3} cy={4} r={16} />
    </g>
    <ellipse cx={31} cy={-14} rx={13} ry={11} fill="#4a3a40" />
    <ellipse cx={24} cy={-25} rx={8} ry={4} fill="#4a3a40" transform="rotate(-30 24 -25)" />
    <circle cx={35} cy={-16} r={2.8} fill="#ffffff" />
  </g>
)
const DemoFlower = ({ taken }: { taken: boolean }) => (taken ? null : (
  <g>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-10} rx={7} ry={10} fill="#ff8cc0" stroke="#e05a9a" strokeWidth={1.5} transform={`rotate(${a})`} />)}
    <circle r={6} fill="#ffd34d" />
  </g>
))
const steer: SteerKit = {
  Backdrop: ({ progress }) => (
    <Scene sky="day" ground="none">
      <SteerSun x={130 + 520 * progress} y={150 - 90 * Math.sin(progress * Math.PI)} />
      <path d="M0 170 Q200 150 400 175 T800 165 L800 450 L0 450 Z" fill="#9ad88f" />
      <path d="M0 300 Q220 280 430 305 T800 295 L800 450 L0 450 Z" fill="#84cc7c" />
    </Scene>
  ),
  path: [[80, 400], [320, 395], [560, 390], [620, 330], [500, 280], [560, 220], [700, 215]],
  Hero: ({ moving, facing }) => <DemoSheep moving={moving} facing={facing} />,
  followers: [() => <DemoSheep s={0.8} />, () => <DemoSheep s={0.68} />, () => <DemoSheep s={0.58} />],
  collect: ([[210, 398], [440, 358], [575, 300], [630, 218]] as [number, number][]).map((at) => ({ at, Draw: DemoFlower })),
  Goal: () => (
    <g transform="translate(0 -30)">
      <rect x={-44} y={-20} width={88} height={64} rx={6} fill="#f2d39a" stroke="#5a3a24" strokeWidth={3} />
      <path d="M-56 -16 L0 -60 L56 -16 Z" fill="#c0504d" stroke="#5a3a24" strokeWidth={3} strokeLinejoin="round" />
      <rect x={-12} y={8} width={24} height={36} rx={4} fill="#a0703f" stroke="#5a3a24" strokeWidth={3} />
    </g>
  ),
  Front: ({ progress }) => (
    <g>
      <g fill="#4fae5a">
        {Array.from({ length: 9 }, (_, i) => 270 + i * 13).map((x, i) => <path key={x} d={`M${x - 6} 452 Q${x} ${404 - (i % 3) * 8} ${x + 6} 452 Z`} />)}
      </g>
      <g transform={`translate(${140 + 560 * progress} ${110 + 10 * Math.sin(progress * 28)})`}>
        <ellipse cx={-7} cy={0} rx={8} ry={11} fill="#ffb3d9" /><ellipse cx={7} cy={0} rx={8} ry={11} fill="#ffb3d9" />
        <rect x={-1.5} y={-8} width={3} height={16} rx={1.5} fill="#6b4a8a" />
      </g>
    </g>
  ),
}

// Rhythm: David plays for his sheep. The sheep sway with the beat, and a heart pops up for every note
// tapped in time (hits). The instrument comes from the address, to try each one:
// #gallery/game/rhythm/drum (harp, tambourine, drum or trumpet; the harp by default).
const RhythmHeart = () => <path d="M0 -4 C-5 -12 -15 -8 -10 0 L0 9 L10 0 C15 -8 5 -12 0 -4 Z" fill="#ff6fae" stroke="#d43a7c" strokeWidth={2} />
const rhythm: RhythmKit = {
  Backdrop: ({ beat, hits }) => (
    <Scene sky="day" ground="meadow">
      <Person look={PEOPLE.david} x={170} y={380} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`rotate(${(Math.sin((beat + i * 0.5) * Math.PI) * 5).toFixed(2)} ${330 + i * 75} 410)`}><RhythmSheep x={330 + i * 75} y={405} s={0.65} /></g>
      ))}
      {Array.from({ length: Math.min(hits, 24) }, (_, i) => <g key={i} transform={`translate(${40 + (i % 12) * 26} ${36 + Math.floor(i / 12) * 26})`}><RhythmHeart /></g>)}
    </Scene>
  ),
  get instrument() {
    const pick = (typeof location === 'undefined' ? '' : location.hash.split('/')[3]) as RhythmKit['instrument']
    return ['harp', 'tambourine', 'drum', 'trumpet'].includes(pick) ? pick : 'harp'
  },
  notes: [[0, 60], [1, 62], [2, 64], [3, 65], [4, 67], [6, 67], [8, 69], [9, 69], [10, 67], [12, 65], [13, 65], [14, 64], [16, 62], [17, 62], [18, 60]],
  bpm: 80,
}

// Share: bread for two, then three, then four people (the most a round can have side by side).
const share: ShareKit = {
  item: { emoji: '🍞', say: 'loaf of bread' },
  plural: 'loaves of bread',
  people: ([['boy', 'the boy'], ['disciple', 'the man'], ['mary', 'the mom'], ['dad', 'the dad']] as const).map(([k, say]) => ({ id: k, say, Draw: () => <Person look={PEOPLE[k]} x={0} y={80} /> })),
  rounds: [{ items: 4, people: 2 }, { items: 6, people: 3 }, { items: 8, people: 4 }],
}

// Catch: raindrops into a bucket that fills up.
const catcher: CatchKit = {
  Backdrop: () => <Scene sky="day" ground="meadow" />,
  Catcher: ({ fill }) => (
    <g>
      <path d="M-55 -10 L55 -10 L42 60 L-42 60 Z" fill="#9fb8d0" stroke="#4a6a8a" strokeWidth={3} />
      <rect x={-50} y={50 - 58 * fill} width={100} height={58 * fill} fill="#7cc6ff" opacity={0.85} />
    </g>
  ),
  width: 110,
  falling: [() => <path d="M0 -16 Q12 2 0 14 Q-12 2 0 -16 Z" fill="#5fb7ff" stroke="#2f7fc0" strokeWidth={2} />],
  goal: 8,
  lane: { y: 370, from: 90, to: 710 },
}

export const DEMO_GAMES = {
  build: { title: 'Build a House', intro: "Let's build a little house! Drag each piece to its place.", done: 'You built a house!', kit: build },
  spot: { title: 'Find the Sheep', intro: 'Five little sheep are hiding! Can you find them all?', done: 'You found all five sheep!', plural: 'sheep', kit: spot },
  paint: { title: 'Paint by Number', intro: 'Tap a paint, then paint the parts with the same number!', done: 'What a beautiful picture!', kit: paint },
  steer: { title: 'Lead the Sheep Home', intro: 'Help the little sheep get home! Drag it along the path.', done: 'The sheep are home!', kit: steer },
  rhythm: { title: 'Play the Harp', intro: 'Tap the harp when the notes come!', done: 'What beautiful music!', kit: rhythm },
  share: { title: 'Share the Bread', intro: "Let's share the bread, so everyone gets the same!", done: 'Everyone has the same. That is fair!', kit: share },
  catch: { title: 'Catch the Rain', intro: 'Rain is falling! Move the bucket and catch eight raindrops.', done: 'The bucket is full!', plural: 'raindrops', kit: catcher },
}
