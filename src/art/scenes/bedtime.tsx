// Bedtime: one calm illustration per bedtime page (the words are PAGES in screens/Bedtime.tsx).
// Slow, sleepy colors; God's care is shown as soft light, never as a person. Pages 4 to 6 are one bedroom
// (the window, the family photo, the nightstand with its lamp and Bible, the bed and its quilt), from
// saying thank you to fast asleep.
import { useContext, useId, type ComponentType, type ReactNode } from 'react'
import { palById } from '../../data/pals'
import { darken, ink, lighten, useShade } from '../kit'
import { faceBottom } from '../pals/faces'
import { Person, type Look, type Pose } from '../people'
import { BuddyContext } from './buddy'
import { usePlayer } from './player'
import { apartLooks, Heart, Little, PalAt, Room } from './birthday'
import { Cloud, Emoji, Glow, Moon, Scene, Sparkles, Sun, Tap, sparkle } from './kit'

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

const SEA = {
  night: { base: '#2a4f8a', wave: '#33609e', deep: '#264a84', shine: '#fff3b0' },
  dusk: { base: '#7466b4', wave: '#8577c2', deep: '#665aa6', shine: '#ffd9a0' },
}
const waves = (y: number, h: number) => `M-80 ${y} ${Array.from({ length: 12 }, () => `q40 -${h} 80 0`).join(' ')} L880 450 L-80 450 Z`

/** A calm sea from y down, with the moon's light (or the setting sun's, at `dusk`) shimmering on it under (mx). */
function NightSea({ y = 330, mx = 650, dusk }: { y?: number; mx?: number; dusk?: boolean }) {
  const c = dusk ? SEA.dusk : SEA.night
  return (
    <g>
      <rect x={0} y={y} width={800} height={450 - y} fill={c.base} />
      <path className="sc-wave" d={waves(y, 12)} fill={c.wave} />
      <path className="sc-wave slow" d={waves(y + 40, 10)} fill={c.deep} opacity={0.9} />
      {[[0, 16, 30], [8, 40, 50], [-6, 66, 38], [6, 94, 60]].map(([dx, dy, w], i) => (
        <ellipse key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.5}s`, animationDuration: '3s' }} cx={mx + dx} cy={y + dy} rx={w / 2} ry={3} fill={c.shine} opacity={0.75} />
      ))}
    </g>
  )
}

/** A band of little waves drawn in front of a boat, so it sits in the water. */
const SeaFront = ({ y, dusk }: { y: number; dusk?: boolean }) => <path className="sc-wave slow" d={waves(y, 9)} fill={(dusk ? SEA.dusk : SEA.night).deep} />

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
 *  `sleeper`: the child tucked in with their head on the pillow. `behind`: drawn behind the mattress (kneeling to pray). */
function Bed({ x, y, w = 320, quilt = '#ff9fc6', sleeper, asleep, behind, children }: {
  x: number; y: number; w?: number; quilt?: string; sleeper?: boolean; asleep?: boolean; behind?: ReactNode; children?: ReactNode
}) {
  const clip = `bd${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const { look } = usePlayer()
  const wood = '#c98448'
  return (
    <g>
      <defs><clipPath id={clip}><rect x={x} y={y - 300} width={200} height={196} /></clipPath></defs>
      <path d={`M${x} ${y} L${x} ${y - 150} Q${x} ${y - 176} ${x + 26} ${y - 176} Q${x + 30} ${y - 176} ${x + 30} ${y - 150} L${x + 30} ${y} Z`} fill={wood} stroke={ink(wood)} strokeWidth={3} />
      {behind}
      <ellipse cx={x + 82} cy={y - 104} rx={50} ry={20} fill="#ffffff" stroke="#d8cfe8" strokeWidth={3} />
      {sleeper && (
        <g className={asleep ? 'bt-sleepy' : undefined} clipPath={`url(#${clip})`}>
          <Person x={x + 86} y={y - 13} s={1.45} look={look} blinkDelay={0.5} />
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
      <path d="M-26 -40 L-16 -78 L16 -78 L26 -40 Z" fill={on ? '#fff0b8' : '#8a80b0'} stroke={on ? '#d0a860' : '#6a6090'} strokeWidth={3} strokeLinejoin="round" />
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

/** The child playing, as drawn from their profile. */
const Kid = ({ x, y, s, pose }: { x: number; y: number; s: number; pose?: Pose }) => <Person x={x} y={y} s={s} look={usePlayer().look} pose={pose} />

/** The family photo on the bedroom wall, from the family in the Parent Corner (just the child and their Pal
 *  when there's nobody else). `dim`: the lights are out. */
function FamilyPhoto({ x, y, dim }: { x: number; y: number; dim?: boolean }) {
  const p = usePlayer()
  const clip = `fp${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const [g1, g2] = p.grownups
  const kids = apartLooks(p.look, p.siblings.filter((s) => !s.baby).map((s) => s.look)).slice(0, 3)
  const baby = p.siblings.find((s) => s.baby)
  // Left to right: a grown-up, the child (holding the baby), brothers and sisters, the other grown-up.
  const row: { look: Look; grown?: boolean; baby?: Look }[] = [
    ...(g1 ? [{ look: g1.look, grown: true }] : []),
    { look: p.look, baby: baby?.look },
    ...kids.map((look) => ({ look })),
    ...(g2 ? [{ look: g2.look, grown: true }] : []),
  ]
  const alone = row.length === 1
  const step = 30, w = Math.max(96, (row.length + (alone ? 1 : 0)) * step + 26), h = 76
  const left = x - w / 2, top = y - h / 2
  return (
    <g>
      <defs><clipPath id={clip}><rect x={left} y={top} width={w} height={h} rx={5} /></clipPath></defs>
      <rect x={left - 6} y={top - 6} width={w + 12} height={h + 12} rx={8} fill="#fff8ec" stroke="#c98448" strokeWidth={6} />
      <g clipPath={`url(#${clip})`}>
        <rect x={left} y={top} width={w} height={h} fill="#dff0ff" />
        <path d={`M${left} ${top + h - 14} Q${x} ${top + h - 22} ${left + w} ${top + h - 14} L${left + w} ${top + h} L${left} ${top + h} Z`} fill="#b8e0a8" />
        {row.map((m, i) => (
          <Person key={i} x={left + 13 + step / 2 + i * step} y={top + h - 4} s={0.42} look={m.look} pose={m.baby ? 'hold' : 'stand'} blinkDelay={i * 0.7}>
            {m.baby && <Little x={0} y={-60} s={1} blanket={lighten(m.baby.robe, 0.45)} skin={p.look.skin} awake />}
          </Person>
        ))}
        {alone && <PalAt id="buddy" x={left + 13 + step * 1.5} y={top + h - 4} size={40} />}
      </g>
      {dim && <rect x={left - 6} y={top - 6} width={w + 12} height={h + 12} rx={8} fill="#1b1640" opacity={0.45} />}
    </g>
  )
}

// ---------- The bedroom (pages 4 to 6) ----------

const ROOM = { wall: '#6a64a8', floor: '#8c6f78', stripes: 0.22 }
const ROOM_DARK = { wall: '#3b3770', floor: '#5a4a5e', stripes: 0.18 }
const BED = { x: 300, y: 432, w: 370 }
/** Their quilt is in their favorite color. */
const quiltOf = (look: Look) => lighten(look.robe, 0.3)

/** The child's bedroom, the same on every page: the window, the family photo, and the nightstand with its lamp
 *  and Bible (`bible="open"`: open, with soft light rising from it). `dark`: the light is off. */
function Bedroom({ dark, bible = 'closed' }: { dark?: boolean; bible?: 'open' | 'closed' }) {
  return (
    <>
      <Room {...(dark ? ROOM_DARK : ROOM)} win={{ x: 80, y: 60, w: 140, h: 120, night: true, curtain: dark ? '#8a7ac0' : '#c9a8ff' }}>
        <Tap say="My family!" sfx="ding"><FamilyPhoto x={648} y={130} dim={dark} /></Tap>
      </Room>
      <Nightstand x={214} y={BED.y} w={140} h={100} />
      <Tap sfx="ding"><Lamp x={170} y={324} s={0.95} on={!dark} /></Tap>
      {bible === 'open' ? (
        <>
          <Beam x={240} y={318} w={110} h={150} />
          <Tap say="God cares for you!" sfx="sparkle"><Bible x={240} y={322} s={0.85} open /></Tap>
        </>
      ) : <Bible x={246} y={324} s={0.62} />}
    </>
  )
}

// ---------- Pages ----------

// 1. "The sun went down, and the moon came up. God made the day, and God made the night."
const Page1 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <StarField stars={[[520, 50, 4], [600, 150, 3], [700, 60, 5], [740, 200, 3], [460, 120, 3]]} />
    <Glow x={170} y={300} r={200} color="#ffc49a" />
    <Tap say="Goodnight, sun!" sfx="whoosh"><Sun x={170} y={300} s={1.15} /></Tap>
    <Tap say="Hello, moon!" sfx="sparkle"><Moon x={630} y={120} s={1.1} /></Tap>
    <Cloud x={330} y={120} s={0.8} slow />
    <NightSea y={298} mx={170} dusk />
    <Tap say="Time for bed, Ark Pals!" sfx="ding"><NightArk x={480} y={356} s={0.7} /></Tap>
    <SeaFront y={370} dusk />
    <Tap say="Time to fly home!" sfx="swish">
      <g stroke="#4a3f78" strokeWidth={3} fill="none" strokeLinecap="round">
        <path d="M300 170 q8 -7 14 0 q6 -7 14 0" /><path d="M340 196 q6 -5 11 0 q5 -5 11 0" /><path d="M276 204 q5 -4 9 0 q4 -4 9 0" />
      </g>
    </Tap>
  </Scene>
)

// 2. "One by one, the stars came out. God knows every star by name. And He knows you, too."
const Page2 = () => (
  <Scene sky="night" ground="none" moon>
    <StarField />
    {[[160, 70, 10], [430, 40, 9], [700, 190, 8]].map(([sx, sy, r]) => (
      <Tap key={sx} say="Twinkle, twinkle!" sfx="sparkle"><path className="pa-twinkle" d={sparkle(sx, sy, r)} fill="#fff8d0" /></Tap>
    ))}
    <Tap say="A shooting star!" sfx="whoosh">
      <g className="pa-twinkle" style={{ animationDuration: '5s' }}>
        <path d="M180 120 L300 170" stroke="#fff8d0" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        <path d={sparkle(300, 170, 9)} fill="#fff8d0" />
      </g>
    </Tap>
    <path d="M0 330 Q200 300 380 326 Q560 290 800 320 L800 450 L0 450 Z" fill="#3e5e86" />
    <path d="M300 450 Q420 340 560 350 Q700 356 800 380 L800 450 Z" fill="#35577a" />
    <Glow x={520} y={290} r={130} color="#fff3c0" />
    <Tap say="Hello, stars!" sfx="sparkle"><Kid x={500} y={404} s={1.45} pose="wave" /></Tap>
    <Tap say="Goodnight, stars!" sfx="ding"><PalAt id="buddy" x={610} y={404} size={120} /></Tap>
    <Sparkles spots={[[440, 230, 6], [590, 220, 5]]} />
  </Scene>
)

// 3. "All the Ark Pals are getting sleepy. <Pal> gives a great big yawn."
//    Their own Pals on the deck (friends fill in), each lifted so its face clears the rail; their buddy yawns.
const DECK: [number, number, number][] = [[-122, -14, 104], [-42, -14, 102], [40, -12, 108], [122, -16, 98]]
const Page3 = () => {
  const p = usePlayer()
  const buddy = useContext(BuddyContext)
  const own = p.pals.filter((x) => x.id !== buddy.id)
  const fill = ['ember', 'starling', 'pebble', 'zippy', 'pip'].filter((id) => id !== buddy.id && !own.some((x) => x.id === id)).map((id) => ({ id, stage: 0 }))
  const [a, b, c] = [...own, ...fill]
  const deck = [a, b, { id: 'buddy', stage: buddy.stage }, c]
  /** How far to raise a Pal so the bottom of its face is just above the rail (y -40). */
  const lift = (id: string, stage: number, y: number, size: number) => {
    const species = palById(id === 'buddy' ? buddy.id : id).species
    return Math.max(0, y - size * 0.92 + (faceBottom(species, stage) * size) / 200 + 46)
  }
  return (
    <Scene sky="night" ground="none" moon>
      <SleepyEyes />
      <NightSea y={330} mx={650} />
      <NightArk x={390} y={336} s={1.4} deck={
        <>
          {deck.map((pal, i) => {
            const [x, y, size] = DECK[i]
            const isBuddy = pal.id === 'buddy'
            return (
              <Tap key={pal.id} say={isBuddy ? 'So sleepy!' : 'Goodnight!'} sfx="ding">
                <PalAt id={pal.id} stage={pal.stage} x={x} y={y - lift(pal.id, pal.stage, y, size)} size={size} sleepy yawn={isBuddy} exact={!isBuddy} />
              </Tap>
            )
          })}
        </>
      } />
      <Zzz x={250} y={170} />
      <Zzz x={340} y={150} size={26} d={1.2} />
      <Zzz x={470} y={140} size={34} d={0.6} />
      <Zzz x={560} y={176} size={26} d={1.8} />
    </Scene>
  )
}

// 4. "Let's tell God thank you. Thank you, God, for today. Thank you for my family, and for my friends. Thank you for loving me."
//    Kneeling at the bed with eyes closed, their Pal asleep on the pillow, their own family in the photo on the wall.
const Page4 = () => {
  const { look } = usePlayer()
  return (
    <Scene sky="night" ground="none" clouds={false}>
      <SleepyEyes />
      <Bedroom />
      <Glow x={470} y={130} r={160} />
      <Bed {...BED} quilt={quiltOf(look)} behind={<Tap say="Thank you, God!" sfx="sparkle"><g className="bt-sleepy"><Kid x={480} y={392} s={1.5} pose="pray" /></g></Tap>}>
        <Tap say="Goodnight!" sfx="ding"><g className="bt-sleepy"><PalAt id="buddy" x={384} y={318} size={84} /></g></Tap>
      </Bed>
      <Sparkles spots={[[430, 170, 7], [510, 150, 9], [470, 110, 6], [390, 140, 5]]} />
      <Heart x={548} y={214} r={13} color="#ffd34d" />
    </Scene>
  )
}

// 5. "The Bible says to give all your worries to God, because He cares for you. … He cares for you, all night long."
const Page5 = () => {
  const { look } = usePlayer()
  return (
    <Scene sky="night" ground="none" clouds={false}>
      <SleepyEyes />
      <Bedroom bible="open" />
      <Bed {...BED} sleeper quilt={quiltOf(look)}>
        <Tap say="Goodnight!" sfx="ding"><g className="bt-sleepy"><PalAt id="buddy" x={600} y={332} size={86} /></g></Tap>
      </Bed>
      <Sparkles spots={[[204, 250, 6], [290, 214, 8], [250, 190, 6], [318, 262, 5]]} />
      <Heart x={470} y={236} r={14} color="#ffd34d" />
    </Scene>
  )
}

// 6. "Goodnight, <name>. God loves you so much. Sweet dreams!"
const Page6 = () => {
  const { look } = usePlayer()
  return (
    <Scene sky="dark" ground="none" clouds={false}>
      <SleepyEyes />
      <Bedroom dark />
      {/* moonlight from the window across the floor */}
      <path d="M96 186 L220 186 L600 434 L330 442 Z" fill="#fff6c8" opacity={0.12} />
      <Bed {...BED} sleeper asleep quilt={darken(quiltOf(look), 0.3)}>
        <Tap say="Shh. Sleeping." sfx="ding"><g className="bt-sleepy"><PalAt id="buddy" x={600} y={332} size={90} /></g></Tap>
      </Bed>
      <g opacity={0.4}><Glow x={420} y={250} r={150} color="#fff3c0" /></g>
      <Zzz x={460} y={226} size={34} />
      <Zzz x={640} y={238} size={26} d={1.5} />
      <Sparkles spots={[[520, 150, 8], [440, 104, 6], [370, 170, 7], [566, 250, 5]]} color="#fff3c0" />
    </Scene>
  )
}

export const BEDTIME_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6]
