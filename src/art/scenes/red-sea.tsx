// The Red Sea: one picture per story page, both parts in order (see data/red-sea.ts for the words).
// Built from the kit (./kit.tsx), people (../people.tsx) and the Moses islands' shared cast and props
// (./moses.tsx). God is never drawn as a person: His presence is light (the glow, the pillar of cloud,
// the pillar of fire).
import { useId, type ReactNode } from 'react'
import { darken } from '../kit'
import { Person } from '../people'
import { Cloud, Emoji, Glow, Moon, Palm, Rays, Scene, Sheep, Sparkles, Sun, Tap, sparkle } from './kit'
import { usePlayer } from './player'
import { AARON, Beach, BrickBasket, BrickStack, CalmSea, Canopy, Column, Desert, DryingBricks, FarChariots, FishSpot, Foam, Folk, Goat, Grip, Heart, HEBREWS, Jar, Lamb, MIRIAM, MOSES, NIGHT_WATER, Notes, Pharaoh, PillarOfCloud, PillarOfFire, Pyramid, RaisedStaff, SeaFish, SeaPath, SilverHair, StaffInLeftHand, Straw, TambourineUp, Throne, WATER, WaterWall, waves, Wind } from './moses'
import './red-sea.css'

// ---------- The pages ----------

// 1. "Remember Moses? He and his brother Aaron were on their way to Egypt. There, God's people were still
// making bricks for Pharaoh, the king, all day long. But God loved His people, and He had a plan."
// God's people carry bricks, straw and water; Pharaoh points from under his sunshade. God's light shines on them.
const Page1 = () => (
  <Scene sky="day" ground="none" sun>
    <Rays x={250} y={-80} r={560} n={14} color="#fff6c0" opacity={0.2} />
    <Desert />
    <Tap say="The pyramids of Egypt! They are so big." sfx="pop">
      <Pyramid x={200} y={292} w={230} h={150} />
      <Pyramid x={360} y={296} w={140} h={90} />
    </Tap>
    <Palm x={30} y={330} s={0.7} />
    <Palm x={466} y={312} s={0.55} />
    <Tap say="God sees His people. And God loves them so much!" sfx="sparkle">
      <Glow x={230} y={250} r={150} color="#fff4c0" />
      <Sparkles spots={[[160, 170, 8], [300, 150, 10], [236, 120, 6]]} />
    </Tap>
    <DryingBricks x={470} y={392} />
    <BrickStack x={420} y={372} />
    {[[496, 360, 4], [540, 355, 7], [582, 362, 1]].map(([fx, fy, i]) => <Folk key={fx} x={fx} y={fy} s={0.62} i={i} up load />)}
    <Tap say="Phew! So many bricks. We are so tired." sfx="plop">
      <Person x={130} y={414} s={0.74} look={HEBREWS.mom} pose="hold" blinkDelay={0.8}>
        <Straw x={0} y={-64} />
        <Grip x={-8} y={-60} skin={HEBREWS.mom.skin} />
        <Grip x={8} y={-60} skin={HEBREWS.mom.skin} />
      </Person>
      <Person x={238} y={424} s={0.8} look={HEBREWS.dad}>
        <BrickBasket x={-30} y={-46} />
        <BrickBasket x={30} y={-46} />
        <Grip x={-30} y={-46} skin={HEBREWS.dad.skin} />
        <Grip x={30} y={-46} skin={HEBREWS.dad.skin} />
      </Person>
      <Person x={330} y={426} s={0.74} look={HEBREWS.boy} pose="hold" blinkDelay={2.1}>
        <Jar x={0} y={-62} />
        <Grip x={-8} y={-60} skin={HEBREWS.boy.skin} />
        <Grip x={8} y={-60} skin={HEBREWS.boy.skin} />
      </Person>
    </Tap>
    <Tap say="More bricks! More bricks!" sfx="wobble">
      <Canopy x={690} y={372} />
      <Pharaoh x={690} y={374} s={0.82} pose="point" facing="left" />
    </Tap>
  </Scene>
)

// 2. "God sent Moses and his brother Aaron to see the king. Moses said, 'God says, let my people go!'"
// Pharaoh's hall: painted columns, his golden throne and his cat. Moses holds out his hand, staff in the other.
const Page2 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={560} y={150} s={0.6} />
    <path d="M0 292 Q200 276 400 290 T800 286 L800 330 L0 330 Z" fill="#f0d39a" />
    <Pyramid x={520} y={292} w={110} h={66} />
    <Pyramid x={610} y={292} w={70} h={42} />
    <Palm x={356} y={300} s={0.4} />
    <rect x={0} y={318} width={800} height={132} fill="#ead7ae" />
    {[350, 372, 398, 428].map((y) => <path key={y} d={`M0 ${y} L800 ${y}`} stroke="#d9c08e" strokeWidth={2} />)}
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${i * 80 + 20} 318 L${i * 110 - 150} 450`} stroke="#d9c08e" strokeWidth={2} />)}
    <rect x={0} y={0} width={800} height={46} fill="#e9d2a6" />
    <rect x={0} y={30} width={800} height={8} fill="#3a6fc4" />
    <rect x={0} y={38} width={800} height={5} fill="#f2c94c" />
    <rect x={0} y={43} width={800} height={4} fill="#c0504d" />
    <Column x={60} y={330} h={250} />
    <Column x={410} y={330} h={250} />
    {/* the throne on its platform */}
    <rect x={560} y={316} width={250} height={22} fill="#e2c995" stroke="#bf9a62" strokeWidth={2.5} />
    <rect x={540} y={334} width={270} height={18} fill="#d8bd86" stroke="#bf9a62" strokeWidth={2.5} />
    <Throne x={690} y={318} />
    <Tap say="No, no, no! I am the king!" sfx="wobble">
      <Pharaoh x={690} y={334} s={0.98} facing="left" />
    </Tap>
    <Tap say="Meow!" sfx="pop">
      <Emoji e="🐱" x={512} y={326} size={54} />
    </Tap>
    <Tap say="God sent us. Please let God's people go!" sfx="good">
      <Person x={160} y={424} s={1} look={AARON} blinkDelay={1.7} />
    </Tap>
    <Tap say="God says, let my people go!" sfx="ding">
      <Person x={290} y={430} s={1.06} look={MOSES} pose="point">
        <StaffInLeftHand />
      </Person>
    </Tap>
  </Scene>
)

// 3. "Pharaoh said no, and no, and no again. But at last he said, 'Go!' So off they went! God led the
// way, with a tall cloud in the day and a pillar of fire at night."
// Day on the left and night on the right: God's people follow the cloud by day and the fire by night.
const Page3 = () => {
  const id = `p3${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.36" stopColor="#8fd3ff" />
          <stop offset="0.6" stopColor="#3b3486" />
          <stop offset="1" stopColor="#1d1a4a" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.36" stopColor="#f2d39a" />
          <stop offset="0.62" stopColor="#8f7f9f" />
          <stop offset="1" stopColor="#5f5784" />
        </linearGradient>
        <linearGradient id={`${id}n`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.36" stopColor="#e8bf7a" />
          <stop offset="0.62" stopColor="#8a7698" />
          <stop offset="1" stopColor="#584f7a" />
        </linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id}s)`} />
      {[[520, 60], [600, 120], [700, 40], [760, 150], [470, 30], [650, 180], [560, 190]].map(([x, y], i) => (
        <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.3}s` }} d={sparkle(x, y, i % 3 ? 4 : 6)} fill="#fff8d0" />
      ))}
      <Sun x={80} y={80} s={0.75} />
      <Moon x={598} y={64} s={0.66} />
      <Cloud x={190} y={70} s={0.7} />
      <path d="M0 300 Q160 276 320 296 Q520 268 800 292 L800 450 L0 450 Z" fill={`url(#${id}g)`} />
      <path d="M0 360 Q240 334 480 358 T800 350 L800 450 L0 450 Z" fill={`url(#${id}n)`} />
      <Tap say="In the daytime, God led the way with a tall cloud." sfx="sparkle">
        <PillarOfCloud x={262} y={352} h={300} w={74} />
      </Tap>
      <Tap say="At night, God gave them light with a pillar of fire." sfx="sparkle">
        <PillarOfFire x={694} y={352} h={300} w={42} />
      </Tap>
      {/* God's people walking: by day behind the cloud, by night behind the fire */}
      <Tap say="We are going! Thank You, God!" sfx="good">
        <Folk x={40} y={410} s={0.9} i={3} />
        <Folk x={75} y={420} s={0.9} i={5} child wave />
        <Folk x={112} y={408} s={0.9} i={1} />
        <Folk x={150} y={418} s={0.9} i={8} />
        <Folk x={186} y={410} s={0.9} i={6} child />
      </Tap>
      <Sheep x={252} y={430} s={0.5} />
      <Goat x={208} y={440} s={0.5} />
      <Folk x={430} y={410} s={0.9} i={2} />
      <Folk x={466} y={418} s={0.9} i={7} child />
      <Folk x={500} y={408} s={0.9} i={4} />
      <Tap say="Baa! Maa! We are coming too!" sfx="pop">
        <Sheep x={445} y={436} s={0.5} />
        <Goat x={530} y={438} s={0.5} coat="#f2ece2" patch="#4a3a33" />
      </Tap>
      <Person x={584} y={420} s={0.66} look={MOSES} holding="staff" blinkDelay={1.2} />
    </Scene>
  )
}

// 4. "They came to the edge of the Red Sea. But Pharaoh changed his mind! Far away, his chariots were
// coming. Moses said, 'Do not be afraid. God will help us!'"
// Evening by the sea. The chariots are a tiny cloud of dust far away on the left; Moses calms everyone.
const Page4 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Cloud x={600} y={70} s={0.8} slow />
    <Cloud x={250} y={110} s={0.55} />
    <path d="M0 262 Q90 246 190 254 Q260 258 330 250 L330 300 L0 300 Z" fill="#c9a48a" />
    <Tap say="Far, far away. Rumble, rumble." sfx="wobble">
      <FarChariots x={100} y={256} s={0.9} />
    </Tap>
    <Sun x={690} y={252} s={0.8} />
    <CalmSea y={250} x1={300} color="#5aa6dc" />
    {[262, 276, 292, 310].map((y, i) => <path key={y} d={`M${690 - 26 - i * 10} ${y} L${690 + 26 + i * 10} ${y}`} stroke="#ffe39a" strokeWidth={3.5} strokeLinecap="round" opacity={0.85} strokeDasharray={`${18 + i * 6} ${8 + i * 2}`} />)}
    <path d="M0 270 Q120 262 240 276 Q330 290 380 320 Q440 360 470 450 L0 450 Z" fill="#e9c98c" />
    <path d="M380 320 Q440 360 470 450" stroke="#ffffff" strokeWidth={5} fill="none" opacity={0.8} />
    <Tap say="The Red Sea is so big! How can we get across?" sfx="plop">
      <Folk x={150} y={330} s={0.8} i={4} />
      <Folk x={186} y={336} s={0.8} i={9} child />
      <Folk x={218} y={328} s={0.8} i={1} />
      <Folk x={254} y={340} s={0.8} i={6} />
    </Tap>
    <Sheep x={300} y={356} s={0.5} facing="left" />
    <Person x={70} y={420} s={0.86} look={HEBREWS.grandpa} holding="stick" blinkDelay={2.3} />
    <Person x={150} y={428} s={0.86} look={HEBREWS.mom} pose="hold" holding="baby" blinkDelay={0.6} />
    <Tap say="Moses is not scared. God is with us!" sfx="pop">
      <Person x={228} y={436} s={0.86} look={HEBREWS.girl} pose="point" blinkDelay={1.1} />
    </Tap>
    <Goat x={290} y={440} s={0.62} facing="left" />
    <Tap say="Do not be afraid. God will help us!" sfx="good">
      <Person x={392} y={428} s={1} look={MOSES} pose="point" facing="left">
        <StaffInLeftHand />
      </Person>
    </Tap>
  </Scene>
)

// 5. "Moses held out his staff over the sea. God sent a strong wind that blew all night long. Whoosh!
// The sea opened up, and the water stood up like two tall walls!"
// Night. We look from the shore along the new dry path between the two walls; the wind still blows.
const Page5 = () => (
  <Scene sky="night" ground="none">
    <Moon x={540} y={56} s={0.6} />
    <path d="M300 214 L500 214 L500 230 L300 230 Z" fill="#5a5470" />
    <Tap say="The water is standing up tall, like walls!" sfx="whoosh">
      <SeaPath vx={460} vy={214} nl={330} nr={590} ny={338} top={92} night
        fish={[[150, 180, 1.2, '#ffb347', 'right'], [90, 270, 1, '#ff8cc0', 'left'], [700, 160, 1.1, '#ffd34d', 'left', '#ffffff'], [740, 270, 1, '#7fe0b0', 'right']]} />
    </Tap>
    <Beach y={336} />
    <Tap say="Whoosh! Whoosh! The strong wind blew all night." sfx="whoosh">
      <Wind spots={[[60, 44, 0.9], [236, 62, 1], [404, 136, 0.65], [610, 34, 0.85]]} />
    </Tap>
    <Folk x={630} y={398} s={0.95} i={2} up />
    <Folk x={670} y={406} s={0.95} i={9} child up />
    <Folk x={712} y={396} s={0.95} i={6} />
    <Folk x={752} y={404} s={0.95} i={7} child />
    <Tap say="Look what God is doing!" sfx="ding">
      <Person x={220} y={432} s={1.12} look={MOSES} pose="point">
        <RaisedStaff />
      </Person>
    </Tap>
  </Scene>
)

/**
 * Where the sea stands up, seen from the side (story page 6 and the mini-game): the far wall of water,
 * the dry sea floor in front of it, and (with `front`) the near wall's top along the bottom. With `shores`
 * the walls stand between the two shores (SEA_X1 to SEA_X2); without, they run on past both edges.
 */
export function Crossing({ night, fish, weeds, children, front = true, shores = true, top = 56, foot = 262 }: {
  night?: boolean; fish?: FishSpot[]; weeds?: number[]; children?: ReactNode; front?: boolean; shores?: boolean; top?: number; foot?: number
}) {
  const [x1, x2] = shores ? [SEA_X1, SEA_X2] : [-70, 870]
  return (
    <g>
      {shores && (
        <g>
          {/* the land beyond each shore */}
          <path d={`M-10 ${foot - 14} Q70 ${foot - 30} 150 ${foot - 18} Q190 ${foot - 12} 230 ${foot} L-10 ${foot + 10} Z`} fill="#e8cf9c" />
          <path d={`M570 ${foot} Q620 ${foot - 14} 680 ${foot - 22} Q750 ${foot - 30} 810 ${foot - 20} L810 ${foot + 10} Z`} fill="#e8cf9c" />
        </g>
      )}
      <WaterWall x1={x1} x2={x2} top={top} foot={foot} night={night} fish={fish} weeds={weeds}
        bubbles={[[x1 + 80, foot - 70], [x1 + 92, foot - 110, 3], [x2 - 120, foot - 40], [x2 - 104, foot - 82, 3], [(x1 + x2) / 2, top + 70, 3.5]]} />
      {/* the dry sea floor */}
      <path d={`M-10 ${foot - 2} L810 ${foot - 2} L810 460 L-10 460 Z`} fill="#f0d6a0" />
      <path d={`M-10 ${foot - 2} L810 ${foot - 2} L810 ${foot + 12} Q400 ${foot + 20} -10 ${foot + 12} Z`} fill="#e3c286" />
      {[[210, 34], [360, 30], [500, 36], [280, 66], [440, 72], [590, 62], [130, 96], [330, 116], [520, 120], [690, 100]].map(([x, dy], i) => (
        <path key={i} d={`M${x} ${foot + dy} q12 -5 24 0 t24 0`} stroke="#dab878" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      ))}
      {[[236, 52, '#d9cfc2'], [470, 88, '#c9c0b6'], [610, 38, '#e0d6c8'], [150, 80, '#cfc6ba'], [720, 120, '#d9cfc2']].map(([x, dy, c], i) => (
        <ellipse key={i} cx={x as number} cy={foot + (dy as number)} rx={7} ry={4.5} fill={c as string} stroke="#a89f94" strokeWidth={1.5} />
      ))}
      {children}
      {front && <NearWall night={night} x1={x1} x2={x2} />}
    </g>
  )
}

/** Where the sea is in the side view (Crossing, the mini-game): the walls stand between these. */
export const SEA_X1 = 210, SEA_X2 = 630

/** The near wall of water's top edge, along the bottom of the picture (the path runs between it and the far wall). */
export function NearWall({ night, top = 410, x1 = SEA_X1, x2 = SEA_X2, fish }: { night?: boolean; top?: number; x1?: number; x2?: number; fish?: FishSpot[] }) {
  const id = `nw${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const c = night ? NIGHT_WATER : WATER
  const swim: FishSpot[] = fish ?? [[x1 + (x2 - x1) * 0.25, top + 34, 0.9, '#ffd34d', 'right'], [x1 + (x2 - x1) * 0.72, top + 38, 0.85, '#ff8cc0', 'left']]
  const body = `M${x1 - 60} 470 C${x1 - 22} 468 ${x1 - 2} ${top + 26} ${x1} ${top + 14} C${x1 + 2} ${top + 4} ${x1 + 10} ${top} ${x1 + 26} ${top}`
    + waves(x1 + 26, x2 - 26, 5, 40)
    + ` C${x2 - 10} ${top} ${x2 - 2} ${top + 4} ${x2} ${top + 14} C${x2 + 2} ${top + 26} ${x2 + 22} 468 ${x2 + 60} 470 Z`
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.top} />
          <stop offset="1" stopColor={c.mid} />
        </linearGradient>
        <clipPath id={`${id}c`}><path d={body} /></clipPath>
      </defs>
      <path d={body} fill={`url(#${id}g)`} stroke={darken(c.deep, 0.15)} strokeWidth={3} strokeLinejoin="round" />
      <g clipPath={`url(#${id}c)`}>
        {swim.map(([x, y, s = 1, color = '#ffa64d', facing = 'right', stripes], i) => (
          <g key={i} className="rs-bob" style={{ animationDelay: `${i * 1.1}s` }}>
            <SeaFish x={x} y={y} s={s} color={color} facing={facing} stripes={stripes} />
          </g>
        ))}
      </g>
      <Foam x1={x1 + 8} y1={top + 2} x2={x2 - 8} y2={top + 2} night={night} />
    </g>
  )
}

// 6. "Then God's people walked right through the sea on dry ground! Moms and dads, boys and girls,
// grandmas and grandpas, and even the sheep and goats."
// From the side: the far wall of water (with fish), the dry sea floor, and the near wall's top in front.
const Page6 = () => (
  <Scene sky="dawn" ground="none" clouds={false}>
    <Cloud x={720} y={40} s={0.55} slow />
    <Tap say="Blub, blub! Hello, fish!" sfx="plop">
      <Crossing front={false} shores={false} top={66} foot={268}
        fish={[[90, 150, 1.1, '#c9a8ff', 'right'], [240, 120, 1.15, '#ffb347', 'right'], [330, 200, 1, '#ff8cc0', 'left'], [450, 112, 1.05, '#ffd34d', 'right', '#ffffff'], [560, 186, 1.2, '#7fe0b0', 'left'], [700, 120, 1, '#ff8a5c', 'left', '#ffffff']]}
        weeds={[40, 200, 330, 470, 610, 760]} />
    </Tap>
    <Tap say="Maa! I am walking through the sea!" sfx="pop">
      <Goat x={78} y={378} s={0.6} coat="#f2ece2" patch="#4a3a33" />
    </Tap>
    <Goat x={140} y={372} s={0.62} />
    <Sheep x={200} y={382} s={0.6} />
    <Person x={262} y={380} s={0.68} look={HEBREWS.grandpa} holding="stick" blinkDelay={2.2} />
    <Tap say="Dry ground! My feet are not even wet!" sfx="good">
      <Person x={322} y={386} s={0.66} look={HEBREWS.grandma} holding="stick" blinkDelay={0.4}><SilverHair /></Person>
    </Tap>
    <Person x={378} y={390} s={0.66} look={HEBREWS.boy} blinkDelay={1.6} />
    <Tap say="Look, a fish! Hi, fish!" sfx="pop">
      <Person x={424} y={386} s={0.66} look={HEBREWS.girl} pose="point" blinkDelay={0.9} />
    </Tap>
    <Person x={486} y={390} s={0.7} look={HEBREWS.mom} pose="hold" holding="baby" blinkDelay={1.3} />
    <Person x={550} y={384} s={0.72} look={HEBREWS.dad} pose="hold" blinkDelay={2.6}>
      <Lamb x={0} y={-66} />
      <Grip x={-8} y={-60} skin={HEBREWS.dad.skin} />
      <Grip x={8} y={-60} skin={HEBREWS.dad.skin} />
    </Person>
    <Person x={640} y={380} s={0.74} look={MOSES} holding="staff" />
    <NearWall x1={-70} x2={870} fish={[[150, 444, 0.9, '#ffd34d', 'right'], [420, 448, 0.85, '#ff8cc0', 'left'], [700, 446, 0.9, '#7fe0b0', 'right']]} />
  </Scene>
)

// 7. "God's people were walking through the sea on dry ground. Step by step, everyone made it all the way
// to the other side, safe and sound!"
// Morning. We stand on the far shore: everyone comes out from between the walls onto the beach.
const Page7 = () => (
  <Scene sky="dawn" ground="none" clouds={false} sun>
    <path d="M330 222 L470 222 L470 236 L330 236 Z" fill="#c9a48a" />
    <SeaPath vx={400} vy={224} nl={262} nr={538} ny={336} top={84}
      fish={[[120, 170, 1.2, '#ffb347', 'right'], [70, 280, 1, '#c9a8ff', 'left'], [690, 150, 1.1, '#ff8cc0', 'left'], [730, 270, 1.05, '#ffd34d', 'right', '#ffffff']]}>
      <Folk x={398} y={248} s={0.32} i={3} />
      <Folk x={410} y={252} s={0.3} i={7} />
      <Folk x={386} y={262} s={0.42} i={5} />
      <Folk x={416} y={270} s={0.44} i={1} child />
      <Folk x={372} y={290} s={0.6} i={8} />
      <Sheep x={426} y={296} s={0.36} facing="left" />
    </SeaPath>
    <Beach y={334} />
    <Tap say="Pretty seashells!" sfx="ding">
      <Emoji e="🐚" x={92} y={420} size={44} />
      <Emoji e="🐚" x={700} y={428} size={38} flip />
    </Tap>
    <Tap say="We made it! Safe and sound!" sfx="good">
      <Person x={340} y={396} s={0.8} look={HEBREWS.grandpa} holding="stick" blinkDelay={1.9} />
      <Person x={440} y={402} s={0.78} look={HEBREWS.grandma} holding="stick" blinkDelay={0.5}><SilverHair /></Person>
    </Tap>
    <Tap say="Hooray! We are on the other side!" sfx="pop">
      <Person x={250} y={436} s={0.9} look={HEBREWS.boy} pose="arms-up" blinkDelay={1.2} />
      <Person x={180} y={430} s={0.9} look={HEBREWS.girl} pose="wave" blinkDelay={0.3} />
    </Tap>
    <Tap say="Come on, everyone! God brought us through!" sfx="ding">
      <Person x={620} y={432} s={1.02} look={MOSES} pose="wave" facing="left">
        <StaffInLeftHand />
      </Person>
    </Tap>
  </Scene>
)

// 8. "Then Moses held out his hand over the sea, and the water came rushing back together. Splash! Now
// Pharaoh's chariots could not follow them."
// From the beach on the far shore: the two walls of water curl over and splash back together where the
// path was. Everyone is safe on the beach (nobody in the water, no chariots). Moses holds his hand and
// staff up and out toward the splash, as on page 5 (a level point would aim at the mom beside him).
const Page8 = () => (
  <Scene sky="day" ground="none">
    <Tap say="Splash! Crash! The sea came back together." sfx="whoosh">
      <ClosingSea />
    </Tap>
    <Beach y={336} />
    <Tap say="We are safe! God kept us safe." sfx="good">
      <Person x={90} y={428} s={0.86} look={HEBREWS.grandpa} holding="stick" blinkDelay={1.9} />
      <Person x={170} y={436} s={0.86} look={HEBREWS.girl} pose="arms-up" blinkDelay={0.7} />
      <Person x={250} y={432} s={0.84} look={HEBREWS.grandma} holding="stick" blinkDelay={0.3}><SilverHair /></Person>
    </Tap>
    <Tap say="Maa!" sfx="pop">
      <Goat x={330} y={444} s={0.6} />
    </Tap>
    <Person x={470} y={430} s={0.86} look={HEBREWS.mom} pose="hold" holding="baby" blinkDelay={1.3} />
    <Person x={720} y={432} s={0.86} look={HEBREWS.dad} pose="hold" facing="left" blinkDelay={2.6}>
      <Lamb x={0} y={-66} />
      <Grip x={-8} y={-60} skin={HEBREWS.dad.skin} />
      <Grip x={8} y={-60} skin={HEBREWS.dad.skin} />
    </Person>
    <Tap say="God made a way for us, and now the way is closed." sfx="ding">
      <Person x={600} y={436} s={1.04} look={MOSES} pose="point" facing="left">
        <RaisedStaff />
      </Person>
    </Tap>
  </Scene>
)

/**
 * One great wave of the sea tumbling back, its crest curling over (facing right; `flip` faces it left).
 * (x, y) = the back of its foot; it is about 330 wide and 240 tall at s = 1.
 */
function GreatWave({ x, y, s = 1, flip, fish = [] }: { x: number; y: number; s?: number; flip?: boolean; fish?: FishSpot[] }) {
  const id = `gw${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const body = 'M0 0 L0 -120 C0 -192 80 -240 170 -240 C252 -240 306 -200 306 -150 C306 -114 280 -96 254 -102 C236 -106 230 -124 240 -140'
    + ' C214 -124 198 -74 226 -34 C246 -8 286 0 334 0 Z'
  const hollow = 'M254 -102 C236 -106 230 -124 240 -140 C214 -124 198 -74 226 -34 C230 -64 236 -90 254 -102 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={WATER.top} />
          <stop offset="0.5" stopColor={WATER.mid} />
          <stop offset="1" stopColor={WATER.deep} />
        </linearGradient>
        <clipPath id={`${id}c`}><path d={body} /></clipPath>
      </defs>
      <path d={body} fill={`url(#${id}g)`} stroke="#2f7cc0" strokeWidth={3.5} strokeLinejoin="round" />
      <g clipPath={`url(#${id}c)`}>
        {[-200, -160, -120, -80, -40].map((wy, i) => <path key={wy} d={`M${-20 + (i % 2) * 24} ${wy}${waves(-20 + (i % 2) * 24, 340, 4, 34)}`} stroke="#ffffff" strokeOpacity={0.22} strokeWidth={3} fill="none" />)}
        {fish.map(([fx, fy, fs = 1, color = '#ffa64d', facing = 'right', stripes], i) => (
          <g key={i} className="rs-bob" style={{ animationDelay: `${i * 0.8}s` }}>
            <SeaFish x={fx} y={fy} s={fs} color={color} facing={facing} stripes={stripes} />
          </g>
        ))}
      </g>
      <path d={hollow} fill="#2a6fb4" opacity={0.85} />
      {/* the curl inside the crest, and foam along its top */}
      <path d="M200 -214 C252 -222 286 -190 280 -160 C276 -140 256 -134 246 -146" stroke="#ffffff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
      <Foam x1={70} y1={-226} x2={190} y2={-238} r={9} />
      <Foam x1={190} y1={-238} x2={290} y2={-196} r={9} />
      <Foam x1={300} y1={-176} x2={300} y2={-126} r={7} />
    </g>
  )
}

/**
 * The walls of water falling back together where the path was: a great wave from each side, their
 * crests meeting in a crown of splashing water in the middle. (Nobody is in the water.)
 */
function ClosingSea() {
  const base = 336
  // A crown of splashing water, its petals leaping up and out; (0, 0) is the middle of its foot.
  const petal = (a: number, len: number, w: number) => {
    const r = (a * Math.PI) / 180, ux = Math.sin(r), uy = -Math.cos(r)
    const px = -uy, py = ux
    const tip = [ux * len, uy * len]
    const f = (n: number) => n.toFixed(1)
    return `M${f(-px * w)} ${f(-py * w)} Q${f(tip[0] * 0.55 - px * w * 1.1)} ${f(tip[1] * 0.55 - py * w * 1.1)} ${f(tip[0])} ${f(tip[1])} Q${f(tip[0] * 0.55 + px * w * 1.1)} ${f(tip[1] * 0.55 + py * w * 1.1)} ${f(px * w)} ${f(py * w)} Z`
  }
  const petals: [number, number, number][] = [[-64, 86, 15], [-36, 122, 17], [-12, 146, 17], [12, 142, 17], [38, 120, 17], [64, 84, 15]]
  const drops: [number, number, number][] = [[-104, -96, 6], [110, -104, 6], [-60, -160, 5], [66, -164, 6], [-16, -184, 5], [22, -192, 4], [-130, -40, 5], [136, -50, 5]]
  return (
    <g>
      <CalmSea y={214} color="#5aaee6" />
      <GreatWave x={-40} y={base} s={1.05} fish={[[90, -150, 1.1, '#ffb347', 'right'], [150, -60, 1, '#c9a8ff', 'right']]} />
      <GreatWave x={840} y={base} s={1.05} flip fish={[[90, -146, 1.05, '#ff8cc0', 'right'], [150, -58, 1, '#ffd34d', 'right', '#ffffff']]} />
      <g className="rs-splash">
        <g transform={`translate(400 ${base - 40})`}>
          {petals.map(([a, len, w], i) => <path key={`o${i}`} d={petal(a, len + 3, w + 3)} fill="#a9dcf5" />)}
          {petals.map(([a, len, w], i) => <path key={`p${i}`} d={petal(a, len, w)} fill="#ffffff" />)}
          {petals.map(([a, len, w], i) => <path key={`s${i}`} d={petal(a, len * 0.55, w * 0.4)} fill="#e2f4fd" />)}
          {drops.map(([x, y, r], i) => <circle key={`d${i}`} cx={x} cy={y} r={r} fill="#ffffff" stroke="#9fd6f2" strokeWidth={1.5} />)}
        </g>
      </g>
      <Foam x1={250} y1={base - 30} x2={550} y2={base - 30} r={12} />
      <Foam x1={-10} y1={base - 4} x2={810} y2={base - 4} r={8} />
    </g>
  )
}

// 9. "God's people were safe and free! They would never have to make bricks for Pharaoh again. God had saved them!"
// A sunny morning on the far shore: everyone cheers. The pillar of cloud glows: God is with them.
const Page9 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <Cloud x={430} y={70} s={0.8} />
    <Sun x={140} y={84} s={0.85} />
    <CalmSea y={236} />
    <Beach y={300} />
    <Tap say="God is with us! He saved us!" sfx="sparkle">
      <PillarOfCloud x={726} y={322} h={270} w={66} />
    </Tap>
    <Palm x={36} y={322} s={0.85} />
    {[[160, 2], [252, 7], [328, 4], [398, 8], [572, 1]].map(([x, i], k) => <Folk key={x} x={x} y={306 + (k % 2) * 4} s={0.5} i={i} up={k % 2 === 0} wave={k % 2 === 1} />)}
    <Person x={112} y={416} s={0.86} look={HEBREWS.grandma} pose="wave" blinkDelay={0.7}><SilverHair /></Person>
    <Tap say="No more bricks! Thank You, God!" sfx="ding">
      <Person x={210} y={420} s={0.92} look={HEBREWS.dad} pose="arms-up" blinkDelay={2.4} />
    </Tap>
    <Tap say="We are free! Hooray!" sfx="good">
      <Person x={292} y={424} s={0.88} look={HEBREWS.boy} pose="arms-up" blinkDelay={1.1} />
      <Person x={362} y={428} s={0.88} look={HEBREWS.girl} pose="arms-up" blinkDelay={0.4} />
    </Tap>
    <Person x={444} y={420} s={0.9} look={HEBREWS.mom} pose="hold" holding="baby" blinkDelay={1.5} />
    <Person x={530} y={424} s={0.92} look={AARON} pose="arms-up" blinkDelay={2.9} />
    <Person x={616} y={428} s={0.96} look={MOSES} pose="arms-up" holding="staff" />
    <Tap say="Baa! Baa!" sfx="pop">
      <Sheep x={704} y={444} s={0.62} facing="left" />
    </Tap>
    <Goat x={44} y={446} s={0.56} />
    <Heart x={300} y={226} s={0.8} />
    <Heart x={500} y={232} s={0.65} color="#ffcf3f" />
  </Scene>
)

// 10. "Then Miriam, the big sister of Moses, picked up her tambourine. Jingle, jingle! The women danced, and
// everyone sang a happy song to God."
// Miriam leads the dance with her tambourine; the women dance with theirs; everyone sings.
const Page10 = () => (
  <Scene sky="day" ground="none" sun>
    <CalmSea y={236} />
    <Beach y={300} />
    <Palm x={34} y={318} s={0.8} />
    <Folk x={132} y={300} s={0.46} i={3} up />
    <Folk x={176} y={304} s={0.46} i={9} wave />
    <Tap say="Thank You, God!" sfx="good">
      <Person x={720} y={430} s={0.9} look={MOSES} pose="arms-up" holding="staff" blinkDelay={1.4} />
      <Person x={640} y={426} s={0.88} look={AARON} pose="arms-up" blinkDelay={2.2} />
    </Tap>
    <Tap say="Jingle, jingle! We are dancing for God!" sfx="ding">
      <g className="rs-dance" style={{ animationDelay: '-0.3s' }}>
        <Person x={250} y={420} s={0.88} look={HEBREWS.woman} pose="arms-up" blinkDelay={0.6}><TambourineUp /></Person>
      </g>
      <g className="rs-dance" style={{ animationDelay: '-0.6s' }}>
        <Person x={540} y={420} s={0.88} look={HEBREWS.auntie} pose="arms-up" blinkDelay={1.8}><TambourineUp /></Person>
      </g>
    </Tap>
    <Tap say="Sing to God! He is so great!" sfx="sparkle">
      <g className="rs-dance">
        <Person x={396} y={432} s={1.08} look={MIRIAM} pose="arms-up"><TambourineUp /></Person>
      </g>
    </Tap>
    <Person x={160} y={436} s={0.86} look={HEBREWS.girl} pose="arms-up" blinkDelay={0.2} />
    <Person x={96} y={436} s={0.86} look={HEBREWS.lad} pose="wave" blinkDelay={1.1} />
    <Tap say="La, la, la!" sfx="pop">
      <Notes spots={[[300, 150, '#8a6ad8'], [470, 130, '#ff6fae'], [380, 90, '#2fa5c8'], [560, 170, '#8a6ad8'], [210, 180, '#ff6fae']]} />
    </Tap>
  </Scene>
)

/** The child playing, there with God's people (God is with you, too!). */
const Kid = ({ x, y, s }: { x: number; y: number; s: number }) => <Person x={x} y={y} s={s} look={usePlayer().look} pose="arms-up" />

// 11. "God made a way for His people, right through the sea! And God is with you, too. He loves you, and
// He will always help you."
// Golden evening: a shining path of light on the calm sea, the glowing cloud, and you, with God's people.
const Page11 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <Rays x={400} y={210} r={620} n={18} color="#fff1c2" opacity={0.28} />
    <Sun x={400} y={216} s={0.9} />
    <CalmSea y={226} color="#6a8fd8" />
    <Tap say="God makes a way!" sfx="sparkle">
      {/* the sunlight on the water: a shining way across the sea */}
      <path d="M388 230 L412 230 L462 330 L338 330 Z" fill="#ffe7a0" opacity={0.35} />
      {[[236, 22, 0], [246, 30, 6], [258, 40, -8], [272, 52, 10], [288, 64, -10], [306, 78, 8], [324, 92, -6]].map(([y, w, dx], i) => (
        <g key={y}>
          <path d={`M${400 + dx - w / 2} ${y} L${400 + dx - 4} ${y}`} stroke={i % 2 ? '#fff6d0' : '#ffe08a'} strokeWidth={3 + i * 0.5} strokeLinecap="round" />
          <path d={`M${400 + dx + 6} ${y} L${400 + dx + w / 2} ${y}`} stroke={i % 2 ? '#ffe08a' : '#fff6d0'} strokeWidth={3 + i * 0.5} strokeLinecap="round" />
        </g>
      ))}
    </Tap>
    <Beach y={322} />
    <PillarOfCloud x={120} y={340} h={250} w={64} />
    <Tap say="Thank You, God!" sfx="ding">
      <Person x={230} y={412} s={0.92} look={MOSES} pose="arms-up" holding="staff" blinkDelay={1.4} />
    </Tap>
    <Tap say="Jingle, jingle! God is so good!" sfx="pop">
      <Person x={566} y={414} s={0.9} look={MIRIAM} pose="arms-up" blinkDelay={0.8}><TambourineUp /></Person>
    </Tap>
    <Person x={692} y={410} s={0.86} look={AARON} pose="arms-up" blinkDelay={2.1} />
    <Person x={300} y={420} s={0.8} look={HEBREWS.girl} pose="arms-up" blinkDelay={0.3} />
    <Person x={500} y={420} s={0.8} look={HEBREWS.boy} pose="arms-up" blinkDelay={1.7} />
    <Tap say="God is with me, too!" sfx="sparkle">
      <Kid x={400} y={436} s={1.12} />
    </Tap>
    <Heart x={400} y={262} s={0.9} />
    <Sparkles spots={[[300, 180, 8], [500, 170, 9], [400, 120, 6], [190, 150, 6], [610, 140, 7]]} />
  </Scene>
)

export const RED_SEA_ART = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]

