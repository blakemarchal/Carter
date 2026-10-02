// Bedtime: one calm illustration per bedtime page (the words are PAGES in screens/Bedtime.tsx).
// Slow, sleepy colors; God's care is shown as soft light, never as a person.
import { useId, type ComponentType, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { Person, PEOPLE } from '../people'
import { PalAt, Room } from './birthday'
import { Cloud, Emoji, Glow, Moon, Scene, Sparkles, Sun, sparkle } from './kit'

// ---------- Local props ----------

/** Closes the eyes of every Pal or Person inside a `bt-sleepy` group (their blink, held shut). */
const SleepyEyes = () => <style>{'.bt-sleepy .pa-blink{animation:none!important;transform:scaleY(.14)!important;transform-box:fill-box;transform-origin:center}'}</style>

/** The ark at night: warm lit windows; `deck` is drawn behind the rail (Pals peeking over). `still` = resting on land. */
function NightArk({ x, y, s = 1, deck, still }: { x: number; y: number; s?: number; deck?: ReactNode; still?: boolean }) {
  const wood = useShade('#b5794a', 0.25, 0.2)
  return (
    <g className={still ? undefined : 'sc-rock'}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <defs>{wood.def}</defs>
        <rect x={-90} y={-110} width={180} height={70} rx={10} fill="#d9a36a" stroke="#8a5428" strokeWidth={4} />
        <path d="M-104 -110 L0 -150 L104 -110 Z" fill="#a0612f" stroke="#6f3f18" strokeWidth={4} strokeLinejoin="round" />
        {[-50, 0, 50].map((wx) => (
          <g key={wx}>
            <circle cx={wx} cy={-92} r={24} fill="#ffe08a" opacity={0.3} className="pa-twinkle" />
            <rect x={wx - 12} y={-102} width={24} height={20} rx={4} fill="#ffd76a" stroke="#8a5428" strokeWidth={2.5} />
          </g>
        ))}
        {deck}
        <path d="M-170 -40 L170 -40 L130 30 L-130 30 Z" fill={wood.fill} stroke="#6f3f18" strokeWidth={4} strokeLinejoin="round" />
        {[-20, -2, 16].map((ly) => <path key={ly} d={`M${-160 + (ly + 20)} ${ly} L${160 - (ly + 20)} ${ly}`} stroke="#8a5428" strokeWidth={2.5} />)}
      </g>
    </g>
  )
}

/** A calm sea at night, with the moon's light shimmering on it under (mx). */
function NightSea({ y = 330, mx = 650 }: { y?: number; mx?: number }) {
  return (
    <g>
      <rect x={0} y={y} width={800} height={450 - y} fill="#2a4f8a" />
      <path className="sc-wave" d={`M-80 ${y} ${Array.from({ length: 12 }, () => 'q40 -12 80 0').join(' ')} L880 450 L-80 450 Z`} fill="#33609e" />
      <path className="sc-wave slow" d={`M-80 ${y + 40} ${Array.from({ length: 12 }, () => 'q40 -10 80 0').join(' ')} L880 450 L-80 450 Z`} fill="#264a84" opacity={0.9} />
      {[[0, 16, 30], [8, 40, 50], [-6, 66, 38], [6, 94, 60]].map(([dx, dy, w], i) => (
        <ellipse key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.5}s`, animationDuration: '3s' }} cx={mx + dx} cy={y + dy} rx={w / 2} ry={3} fill="#fff3b0" opacity={0.75} />
      ))}
    </g>
  )
}

/** Extra stars of many sizes, twinkling slowly one by one. */
const MANY_STARS = [[90, 60, 5], [180, 30, 4], [260, 95, 6], [330, 40, 4], [400, 110, 5], [470, 60, 7], [540, 30, 4], [110, 150, 4], [200, 200, 5],
  [300, 170, 4], [380, 210, 6], [470, 170, 4], [560, 120, 5], [600, 210, 4], [720, 160, 5], [740, 230, 4], [150, 250, 4], [520, 250, 5], [280, 260, 4]]
const StarField = ({ stars = MANY_STARS }: { stars?: number[][] }) => (
  <g>
    {stars.map(([x, y, r], i) => (
      <path key={i} className="pa-twinkle" style={{ animationDelay: `${(i * 0.53) % 3}s`, animationDuration: '3.2s' }} d={sparkle(x, y, r)} fill="#fff8d0" />
    ))}
  </g>
)

/** A bed seen from the side, headboard on the left. (x, y) = the left foot of the bed on the floor.
 *  `sleeper`: Carter tucked in with her head on the pillow. `behind`: drawn behind the mattress (kneeling to pray). */
function Bed({ x, y, w = 320, quilt = '#ff9fc6', sleeper, asleep, behind, children }: {
  x: number; y: number; w?: number; quilt?: string; sleeper?: boolean; asleep?: boolean; behind?: ReactNode; children?: ReactNode
}) {
  const clip = `bd${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const wood = '#c98448'
  return (
    <g>
      <defs><clipPath id={clip}><rect x={x} y={y - 300} width={200} height={196} /></clipPath></defs>
      <path d={`M${x} ${y} L${x} ${y - 150} Q${x} ${y - 176} ${x + 26} ${y - 176} Q${x + 30} ${y - 176} ${x + 30} ${y - 150} L${x + 30} ${y} Z`} fill={wood} stroke={ink(wood)} strokeWidth={3} />
      {behind}
      <ellipse cx={x + 82} cy={y - 104} rx={50} ry={20} fill="#ffffff" stroke="#d8cfe8" strokeWidth={3} />
      {sleeper && (
        <g className={asleep ? 'bt-sleepy' : undefined} clipPath={`url(#${clip})`}>
          <Person x={x + 86} y={y - 13} s={1.45} look={PEOPLE.carter} blinkDelay={0.5} />
        </g>
      )}
      <rect x={x + 24} y={y - 92} width={w - 40} height={28} rx={8} fill="#fffaf2" stroke="#d8cfe8" strokeWidth={2.5} />
      <path d={sleeper
        ? `M${x + 52} ${y - 100} Q${x + 100} ${y - 112} ${x + 140} ${y - 112} Q${x + 220} ${y - 128} ${x + 280} ${y - 108} Q${x + w - 50} ${y - 102} ${x + w - 18} ${y - 96} L${x + w - 18} ${y - 46} Q${x + w / 2 + 40} ${y - 36} ${x + 54} ${y - 46} Q${x + 36} ${y - 74} ${x + 52} ${y - 100} Z`
        : `M${x + 120} ${y - 96} Q${x + 160} ${y - 100} ${x + 220} ${y - 106} Q${x + w - 60} ${y - 104} ${x + w - 18} ${y - 96} L${x + w - 18} ${y - 46} Q${x + w / 2 + 40} ${y - 36} ${x + 54} ${y - 46} Q${x + 40} ${y - 70} ${x + 120} ${y - 96} Z`}
        fill={quilt} stroke={ink(quilt)} strokeWidth={3} strokeLinejoin="round" />
      {[0.35, 0.55, 0.75].map((t) => <circle key={t} cx={x + w * t} cy={y - 66} r={6} fill={lighten(quilt, 0.5)} />)}
      {[0.45, 0.65].map((t) => <path key={t} d={sparkle(x + w * t, y - 80, 6)} fill={lighten(quilt, 0.5)} />)}
      {sleeper && <path d={`M${x + 58} ${y - 100} Q${x + 100} ${y - 111} ${x + 150} ${y - 112}`} stroke="#fffaf2" strokeWidth={10} strokeLinecap="round" fill="none" />}
      <rect x={x + 24} y={y - 48} width={w - 40} height={18} rx={4} fill={wood} stroke={ink(wood)} strokeWidth={3} />
      <rect x={x + 34} y={y - 30} width={12} height={30} fill={darken(wood, 0.15)} />
      <path d={`M${x + w - 24} ${y} L${x + w - 24} ${y - 104} Q${x + w - 24} ${y - 120} ${x + w - 8} ${y - 120} Q${x + w + 2} ${y - 120} ${x + w + 2} ${y - 104} L${x + w + 2} ${y} Z`} fill={wood} stroke={ink(wood)} strokeWidth={3} />
      {children}
    </g>
  )
}

function Nightstand({ x, y, w = 110, h = 96 }: { x: number; y: number; w?: number; h?: number }) {
  const c = '#d9a36a'
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={6} fill={c} stroke={ink(c)} strokeWidth={3} />
      <rect x={x - w / 2 - 6} y={y - h - 8} width={w + 12} height={12} rx={4} fill={lighten(c, 0.15)} stroke={ink(c)} strokeWidth={3} />
      <rect x={x - w / 2 + 10} y={y - h + 18} width={w - 20} height={30} rx={4} fill={lighten(c, 0.1)} stroke={ink(c)} strokeWidth={2} />
      <circle cx={x} cy={y - h + 33} r={4} fill={ink(c)} />
    </g>
  )
}

/** A little bedside lamp; `on` makes it glow. (x, y) = where it stands. */
function Lamp({ x, y, s = 1, on = true }: { x: number; y: number; s?: number; on?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {on && <Glow x={0} y={-56} r={110} color="#ffd98a" />}
      <path d="M-16 0 Q0 -10 16 0 Z" fill="#c98aa8" stroke="#9a5a7a" strokeWidth={2.5} />
      <rect x={-3} y={-40} width={6} height={38} fill="#c98aa8" />
      <path d="M-26 -40 L-16 -78 L16 -78 L26 -40 Z" fill={on ? '#fff0b8' : '#e8d8c8'} stroke="#d0a860" strokeWidth={3} strokeLinejoin="round" />
    </g>
  )
}

/** The Bible: open with soft light rising from its pages, or closed. */
function Bible({ x, y, s = 1, open }: { x: number; y: number; s?: number; open?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {open ? (
        <>
          <path d="M-58 -2 L58 -2 L54 6 L-54 6 Z" fill="#8a3a3a" stroke="#5a2020" strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M0 -6 Q-26 -22 -54 -12 L-54 0 Q-26 -10 0 2 Z" fill="#fffaf0" stroke="#d8c8a8" strokeWidth={2} />
          <path d="M0 -6 Q26 -22 54 -12 L54 0 Q26 -10 0 2 Z" fill="#fffaf0" stroke="#d8c8a8" strokeWidth={2} />
          {[-44, -32, -20].map((lx) => <path key={lx} d={`M${lx} ${-13 + (lx + 44) * 0.12} L${lx + 8} ${-15 + (lx + 44) * 0.12}`} stroke="#c9b8a0" strokeWidth={2} strokeLinecap="round" />)}
          {[12, 24, 36].map((lx) => <path key={lx} d={`M${lx} ${-15 + (lx - 12) * 0.04} L${lx + 8} ${-14 + (lx - 12) * 0.04}`} stroke="#c9b8a0" strokeWidth={2} strokeLinecap="round" />)}
          <path d="M2 2 L4 22 L9 16 L12 22 L10 2 Z" fill="#c0504d" />
        </>
      ) : (
        <>
          <rect x={-40} y={-22} width={80} height={22} rx={4} fill="#fffaf0" stroke="#d8c8a8" strokeWidth={2} />
          <rect x={-44} y={-30} width={88} height={12} rx={4} fill="#8a3a3a" stroke="#5a2020" strokeWidth={2.5} />
          <path d="M0 -28 L0 -20 M-4 -25 L4 -25" stroke="#ffd34d" strokeWidth={2} />
        </>
      )}
    </g>
  )
}

/** A gentle rising beam: soft light over something precious. */
const Beam = ({ x, y, w = 120, h = 220 }: { x: number; y: number; w?: number; h?: number }) => {
  const id = `bm${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g className="pa-twinkle" style={{ animationDuration: '4s' }}>
      <defs><linearGradient id={id} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff6b0" stopOpacity={0.75} /><stop offset="1" stopColor="#fff6b0" stopOpacity={0} /></linearGradient></defs>
      <path d={`M${x - w * 0.3} ${y} L${x - w / 2} ${y - h} L${x + w / 2} ${y - h} L${x + w * 0.3} ${y} Z`} fill={`url(#${id})`} />
    </g>
  )
}

const Zzz = ({ x, y, size = 30, d = 0 }: { x: number; y: number; size?: number; d?: number }) => (
  <g className="sc-float" style={{ animationDelay: `${d}s`, animationDuration: '4s' }}><Emoji e="💤" x={x} y={y} size={size} /></g>
)

const NIGHT_ROOM = { wall: '#6a64a8', floor: '#8c6f78', stripes: 0.22 }

// ---------- Pages ----------

// 1. "The sun went down, and the moon came up. God made the day, and God made the night."
const Page1 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <StarField stars={[[520, 50, 4], [600, 150, 3], [700, 60, 5], [740, 200, 3], [460, 120, 3]]} />
    <Glow x={170} y={300} r={200} color="#ffc49a" />
    <Sun x={170} y={300} s={1.15} />
    <Moon x={630} y={120} s={1.1} />
    <Cloud x={330} y={120} s={0.8} slow />
    <path d="M0 300 Q180 262 380 292 Q560 250 800 280 L800 450 L0 450 Z" fill="#9a88c2" />
    <NightArk x={440} y={354} s={0.62} still />
    <path d="M0 352 Q220 318 440 348 T800 340 L800 450 L0 450 Z" fill="#7c72b2" />
    <path d="M0 404 Q260 384 520 406 T800 398 L800 450 L0 450 Z" fill="#665f9e" />
    <g stroke="#4a3f78" strokeWidth={3} fill="none" strokeLinecap="round">
      <path d="M300 170 q8 -7 14 0 q6 -7 14 0" /><path d="M340 196 q6 -5 11 0 q5 -5 11 0" /><path d="M276 204 q5 -4 9 0 q4 -4 9 0" />
    </g>
  </Scene>
)

// 2. "One by one, the stars came out. God knows every star by name. And He knows you, too."
const Page2 = () => (
  <Scene sky="night" ground="none" moon>
    <StarField />
    <g className="pa-twinkle" style={{ animationDuration: '5s' }}>
      <path d="M180 120 L300 170" stroke="#fff8d0" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      <path d={sparkle(300, 170, 9)} fill="#fff8d0" />
    </g>
    <path d="M0 330 Q200 300 380 326 Q560 290 800 320 L800 450 L0 450 Z" fill="#3e5e86" />
    <path d="M300 450 Q420 340 560 350 Q700 356 800 380 L800 450 Z" fill="#35577a" />
    <Glow x={520} y={290} r={130} color="#fff3c0" />
    <Person x={500} y={404} s={1.45} look={PEOPLE.carter} pose="wave" />
    <PalAt id="buddy" x={610} y={404} size={120} />
    <Sparkles spots={[[440, 230, 6], [590, 220, 5]]} />
  </Scene>
)

// 3. "All the Ark Pals are getting sleepy. <Pal> gives a great big yawn."
const Page3 = () => (
  <Scene sky="night" ground="none" moon>
    <SleepyEyes />
    <NightSea y={330} mx={650} />
    <NightArk x={390} y={336} s={1.4} deck={
      <>
        <PalAt id="ember" x={-122} y={-14} size={104} sleepy />
        <PalAt id="starling" x={-42} y={-14} size={102} sleepy />
        <PalAt id="buddy" x={40} y={-12} size={108} sleepy yawn />
        <PalAt id="pebble" x={122} y={-16} size={98} sleepy />
      </>
    } />
    <Zzz x={250} y={170} />
    <Zzz x={340} y={150} size={26} d={1.2} />
    <Zzz x={470} y={140} size={34} d={0.6} />
    <Zzz x={560} y={176} size={26} d={1.8} />
  </Scene>
)

// 4. "Let's tell God thank you. Thank you, God, for today. Thank you for my family, and for my friends. Thank you for loving me."
const Page4 = () => (
  <Scene sky="night" ground="none" clouds={false}>
    <SleepyEyes />
    <Room {...NIGHT_ROOM} win={{ x: 110, y: 70, w: 130, h: 120, night: true, curtain: '#c9a8ff' }}>
      <g>
        <rect x={560} y={96} width={110} height={84} rx={6} fill="#fff8ec" stroke="#c98448" strokeWidth={6} />
        {[[590, 140, '#c9a8ff', '#7a4a24'], [615, 134, '#5fb7ff', '#5a3a24'], [640, 142, '#ff8cc0', '#7a4a24']].map(([fx, fy, robe, hair], i) => (
          <g key={i}>
            <path d={`M${(fx as number) - 12} 172 Q${fx} ${(fy as number) + 8} ${(fx as number) + 12} 172 Z`} fill={robe as string} />
            <circle cx={fx as number} cy={fy as number} r={10} fill="#f6d2b8" />
            <path d={`M${(fx as number) - 10} ${(fy as number) - 2} Q${fx} ${(fy as number) - 16} ${(fx as number) + 10} ${(fy as number) - 2} Z`} fill={hair as string} />
          </g>
        ))}
        <circle cx={655} cy={158} r={7} fill="#f6d2b8" />
      </g>
    </Room>
    <Nightstand x={130} y={420} w={100} h={92} />
    <Lamp x={118} y={320} s={0.9} />
    <Glow x={480} y={120} r={160} />
    <Bed x={300} y={420} w={360} behind={<Person x={480} y={388} s={1.5} look={PEOPLE.carter} pose="pray" />}>
      <g className="bt-sleepy"><PalAt id="buddy" x={384} y={316} size={84} /></g>
    </Bed>
    <Sparkles spots={[[440, 170, 7], [520, 150, 9], [480, 110, 6], [400, 140, 5]]} />
    <Emoji e="💛" x={530} y={200} size={28} bob />
  </Scene>
)

// 5. "The Bible says: casting all your worries on him, because he cares for you. God cares for you, all night long."
const Page5 = () => (
  <Scene sky="night" ground="none" clouds={false}>
    <Room {...NIGHT_ROOM} win={{ x: 560, y: 60, w: 140, h: 120, night: true, curtain: '#c9a8ff' }} />
    <Bed x={400} y={430} w={360} sleeper quilt="#9ad0ff" />
    <Nightstand x={250} y={430} w={190} h={130} />
    <Lamp x={170} y={292} s={1.1} />
    <Beam x={290} y={290} w={150} h={230} />
    <Bible x={290} y={292} s={1.2} open />
    <Sparkles spots={[[250, 200, 7], [330, 170, 9], [290, 120, 6], [360, 230, 5]]} />
    <Emoji e="💛" x={470} y={232} size={30} bob />
  </Scene>
)

// 6. "Goodnight, <name>. God loves you so much. Sweet dreams!"
const Page6 = () => (
  <Scene sky="dark" ground="none" clouds={false}>
    <SleepyEyes />
    <Room wall="#3b3770" floor="#5a4a5e" stripes={0.18} win={{ x: 120, y: 60, w: 150, h: 140, night: true, curtain: '#8a7ac0' }} />
    <path d="M150 200 L270 200 L620 430 L380 440 Z" fill="#fff6c8" opacity={0.12} />
    <Bed x={300} y={432} w={380} sleeper asleep quilt="#c9a8ff">
      <g className="bt-sleepy"><PalAt id="buddy" x={606} y={330} size={92} /></g>
    </Bed>
    <g opacity={0.4}><Glow x={420} y={250} r={150} color="#fff3c0" /></g>
    <Zzz x={460} y={226} size={34} />
    <Zzz x={640} y={238} size={26} d={1.5} />
    <Glow x={130} y={330} r={60} color="#ffe7a0" />
    <rect x={120} y={326} width={20} height={22} rx={5} fill="#e8e0f0" />
    <Moon x={132} y={326} s={0.3} />
    <Sparkles spots={[[520, 150, 8], [600, 110, 6], [420, 120, 7], [700, 170, 5]]} color="#fff3c0" />
  </Scene>
)

export const BEDTIME_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6]
