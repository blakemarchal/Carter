// Drawn things first needed by The Good Samaritan island (its activities and pictures). Same style and rules as the
// other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the drawing is what that emoji
// means. Every item can be used anywhere once it's here.
//
// The story's people live here too, so the activity pictures and the story pictures (scenes/samaritan.tsx, which
// imports them from here and exports them again) draw them just the same: the traveler (the man the robbers hurt, with
// his hurts and later his bandages), the priest and the temple helper going by, and the Samaritan in his striped head
// cloth. The coins are silver, as the Samaritan's two coins are on story page 9, so they claim no emoji: the coin emoji
// belongs to Zacchaeus' gold coin (isl-zacchaeus.tsx).
import { useId, type ReactNode } from 'react'
import type { Item } from './types'
import { darken, groundShadow, ink, lighten, Shine, useShade } from './draw'
import { BeardFrown, Brows, Figure, Kneel, Person, Sitting, SKIN, type Look } from '../people'

type Pt = [number, number]
const f1 = (n: number) => n.toFixed(1)

// ---------- The story's people ----------

/** The traveler, the man the robbers hurt: short brown hair and beard, a sky-blue robe and an orange sash. (Hurts and Bandages go over him.) */
export const TRAVELER: Look = { skin: SKIN.medium, hair: 'short', hairColor: '#4a3020', beard: 'short', beardColor: '#4a3020', robe: '#7aa9d6', sash: '#c97a3a' }
/** The priest: a white head cloth, a short black beard, a white linen robe and a blue sash; he walks with a stick. */
export const PRIEST: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1f18', wrap: '#fdfcf8', beard: 'short', beardColor: '#2b1f18', robe: '#eceef3', sash: '#3f6fb0' }
/** The temple helper (a Levite): young, no beard, a green robe; he carries a sack on his shoulder (Sack). */
export const TEMPLE_HELPER: Look = { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', robe: '#6fae73', sash: '#f0d38a' }
/** The Samaritan: a saffron head cloth with red stripes (draw SamaritanCloth over him), a short black beard, a teal robe and a saffron sash. */
export const SAMARITAN: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#2b1f18', wrap: '#f0b44a', beard: 'short', beardColor: '#2b1f18', robe: '#3a8f88', sash: '#e8a33d' }

// Faces, hurts and clothes, drawn over a Person (in its own units: the head's middle at (0, -114)).

/** The left arm's shoulder and hand for a pose (where the hurt and the bandage on it go). */
export const LEFT_ARM: Record<'hold' | 'wave', [Pt, Pt]> = { hold: [[-20, -86], [-8, -60]], wave: [[-20, -86], [-30, -46]] }

/** Something drawn across the middle of an arm, in the arm's own frame (x along it, y across it). */
function OnArm({ arm, children }: { arm: [Pt, Pt]; children: ReactNode }) {
  const [[sx, sy], [hx, hy]] = arm
  const deg = (Math.atan2(hy - sy, hx - sx) * 180) / Math.PI
  return <g transform={`translate(${f1((sx + hx) / 2)} ${f1((sy + hy) / 2)}) rotate(${f1(deg)})`}>{children}</g>
}

/** The traveler's hurts before they're bandaged: a scrape on his forehead, a torn sleeve with a scrape under it, and dust on his robe. */
export function Hurts({ arm }: { arm: [Pt, Pt] }) {
  const t = TRAVELER
  return (
    <g>
      <ellipse cx={-16} cy={-119.6} rx={3.6} ry={2.3} fill="#f2a0a8" opacity={0.65} />
      <path d="M-18.8 -120.6 l5.2 -1.5 M-18.2 -118 l4.6 -1.2" stroke="#d65f6c" strokeWidth={1.3} strokeLinecap="round" />
      <ellipse cx={11} cy={-72} rx={5} ry={3} fill="#c9b08a" opacity={0.5} />
      <ellipse cx={-3} cy={-50} rx={4} ry={2.4} fill="#c9b08a" opacity={0.45} />
      <OnArm arm={arm}>
        <path d="M-5.5 0 L-3.5 -4.2 L0 -5.6 L3 -4 L5.8 -1 L4.2 3.2 L1 5.6 L-2.6 4.2 Z" fill={t.skin} stroke={ink(t.robe)} strokeWidth={1.3} strokeLinejoin="round" />
        <path d="M-2.6 -1.6 L2.6 0.2 M-2 1.6 L2.2 3" stroke="#d65f6c" strokeWidth={1.2} strokeLinecap="round" />
      </OnArm>
    </g>
  )
}

/** White bandages: wrapped round his head, and round his arm where the scrape was (his left arm; leave `arm` out when it's out of sight). */
export function Bandages({ arm }: { arm?: [Pt, Pt] }) {
  return (
    <g>
      <path d="M-23.5 -117 Q0 -133 23.5 -117" stroke="#bdb5a6" strokeWidth={9.2} fill="none" strokeLinecap="round" />
      <path d="M-23.5 -117 Q0 -133 23.5 -117" stroke="#fffdf6" strokeWidth={6.8} fill="none" strokeLinecap="round" />
      <path d="M-13 -127.6 l3 4.6 M-1 -129.6 l3 4.8 M11 -127.8 l3 4.4" stroke="#ddd6c8" strokeWidth={1.2} strokeLinecap="round" />
      <path d="M22.5 -118 l8 -6 l1.6 5.6 Z M22.5 -118 l8.6 1.6 l-3.4 4.4 Z" fill="#fffdf6" stroke="#bdb5a6" strokeWidth={1.2} strokeLinejoin="round" />
      {arm && (
        <OnArm arm={arm}>
          {[-3.2, 3.2].map((dx) => <rect key={dx} x={dx - 3.2} y={-9.6} width={6.4} height={19.2} rx={2.4} fill="#fffdf6" stroke="#bdb5a6" strokeWidth={1.3} />)}
        </OnArm>
      )}
    </g>
  )
}

/** A sad face: brows raised in the middle, and (bearded) a little frown. */
export const SadFace = ({ look, frown = true }: { look: Look; frown?: boolean }) => (
  <g>
    <Brows mood="sad" />
    {frown && look.beard && <BeardFrown color={look.beardColor ?? look.hairColor} />}
  </g>
)

/** A straight little mouth in place of a smile (busy, not smiling), bearded or not. */
export function FlatMouth({ look }: { look: Look }) {
  const bearded = !!look.beard
  return bearded ? (
    <g>
      <ellipse cx={0} cy={-98.3} rx={6} ry={2.6} fill={look.beardColor ?? look.hairColor} />
      <path d="M-3.4 -98.4 L3.4 -98.4" stroke="#d0707e" strokeWidth={2.1} strokeLinecap="round" />
    </g>
  ) : (
    <g>
      <ellipse cx={0} cy={-104} rx={7} ry={3.6} fill={look.skin} />
      <path d="M-4 -104.4 L4 -104.4" stroke="#6b2a3a" strokeWidth={2.1} strokeLinecap="round" />
    </g>
  )
}

// Looking to one side: the open eyes are hidden (they're the blinking group), and eyes turned `dx` are drawn instead.
const ASIDE_CSS = '.sm-aside .pa-blink{display:none}'
export function LookingAside({ children }: { children: ReactNode }) {
  return <g className="sm-aside"><style>{ASIDE_CSS}</style>{children}</g>
}
export const AsideEyes = ({ dx }: { dx: number }) => (
  <g>
    {[-8, 8].map((ex) => (
      <g key={ex}>
        <ellipse cx={ex + dx} cy={-113.6} rx={3} ry={4} fill="#2b2140" />
        <circle cx={ex + dx - 0.8} cy={-115.6} r={1.1} fill="#fff" />
      </g>
    ))}
  </g>
)

/** The Samaritan's head cloth: red stripes across its top and down its sides (over the Person's saffron cloth). */
export function SamaritanCloth() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <g>
      <defs><clipPath id={`sc${uid}`}><path d="M-25 -112 Q-26 -142 0 -142 Q26 -142 25 -112 Q14 -128 0 -127 Q-14 -128 -25 -112 Z" /></clipPath></defs>
      <g clipPath={`url(#sc${uid})`} fill="none" stroke="#c0504d" strokeLinecap="round">
        <path d="M-27 -117 Q-14 -134 0 -133 Q14 -134 27 -117" strokeWidth={2.6} />
        <path d="M-25 -126 Q-12 -140 0 -139.4 Q12 -140 25 -126" strokeWidth={1.6} />
      </g>
      {[-1, 1].map((d) => (
        <path key={d} d={`M${d * 27.2} -106 Q${d * 28.2} -95 ${d * 24.6} -88.5`} stroke="#c0504d" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      ))}
    </g>
  )
}

/**
 * A soft cloth sack over the shoulder (in a Person's units: for pose "carry", behind the hand at the shoulder): a lumpy,
 * slumped bag of rough cloth with folds, its top gathered and tied with a rope, the rope's ends hanging loose.
 */
export const Sack = () => (
  <g transform="translate(38 -100) rotate(14) scale(1.3)" strokeLinejoin="round" strokeLinecap="round">
    <path d="M-15 9 Q-21 1 -16 -6 Q-13 -11 -7 -11 Q-3 -14 1 -12 Q5 -14 9 -11 Q15 -10 17 -4 Q21 3 15 9 Q11 14 4 12 Q0 15 -5 12 Q-11 14 -15 9 Z"
      fill="#cfae7c" stroke="#8a6a3e" strokeWidth={2} />
    <path d="M-9 -5 Q-12 2 -9 9 M2 -7 Q5 1 2 10 M10 -5 Q13 0 11 6" stroke="#a8875a" strokeWidth={1.4} fill="none" />
    {/* the gathered top, puckered above the rope */}
    <path d="M-5 -12 Q-9 -16 -7 -21 Q-4 -18 -2 -21 Q0 -17 2 -21 Q4 -18 7 -21 Q8 -16 5 -12 Z" fill="#cfae7c" stroke="#8a6a3e" strokeWidth={1.8} />
    {/* the rope tie, and its loose ends */}
    <path d="M-6 -12.5 Q0 -10 6 -12.5" stroke="#6b4a26" strokeWidth={2.4} fill="none" />
    <path d="M5 -12 q5 2 5 8 M5 -12 q7 -1 10 4" stroke="#6b4a26" strokeWidth={1.8} fill="none" />
  </g>
)

/** Little lines behind someone in a hurry (to their left; `flip` for the right). (x, y): their middle. */
export const Hurry = ({ x, y, s = 1, flip, color = '#ffffff' }: { x: number; y: number; s?: number; flip?: boolean; color?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} stroke={color} strokeWidth={3.2} strokeLinecap="round" opacity={0.85}>
    <path d="M-40 -20 l-18 0 M-44 -4 l-24 0 M-40 12 l-16 0" />
  </g>
)

/**
 * The priest walking by with his stick, his eyes turned back toward the hurt man (`look` -1: back behind him, whichever
 * way he's facing), not smiling.
 */
export function PriestWalking({ x, y, s = 1, look = -1, facing = 'right' }: { x: number; y: number; s?: number; look?: number; facing?: 'left' | 'right' }) {
  return (
    <LookingAside>
      <Person x={x} y={y} s={s} look={PRIEST} holding="stick" facing={facing} blinkDelay={0.4}>
        <AsideEyes dx={2.4 * look} />
        <Brows mood="sad" />
        <FlatMouth look={PRIEST} />
      </Person>
    </LookingAside>
  )
}

/** The temple helper hurrying by with a sack on his shoulder, his eyes turned back toward the hurt man (as PriestWalking), not smiling. */
export function HelperWalking({ x, y, s = 1, look = -1, facing = 'right' }: { x: number; y: number; s?: number; look?: number; facing?: 'left' | 'right' }) {
  return (
    <LookingAside>
      <Figure x={x} y={y} s={s} look={TEMPLE_HELPER} pose="carry" item={<Sack />} facing={facing} blinkDelay={1.1}>
        <AsideEyes dx={2.4 * look} />
        <Brows mood="sad" />
        <FlatMouth look={TEMPLE_HELPER} />
      </Figure>
    </LookingAside>
  )
}

/** A little pink heart, still (in an activity picture; the story pictures use the kit's floating Heart). (x, y): its middle. */
const LittleHeart = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 16 C-24 2 -26 -14 -14 -19 C-7 -22 -2 -17 0 -11 C2 -17 7 -22 14 -19 C26 -14 24 2 0 16 Z" fill="#ff6f91" stroke={ink('#ff6f91')} strokeWidth={3} strokeLinejoin="round" />
    <ellipse cx={-10} cy={-10} rx={4} ry={2.4} fill="#fff" opacity={0.65} transform="rotate(-35 -10 -10)" />
  </g>
)

// ---------- Pictures of the story's people, for activities ----------

/** The priest going by on the road, his eyes turned to the hurt man, hurrying on. */
function PriestGoingBy() {
  return (
    <g>
      <ellipse {...groundShadow(52, 93, 20)} />
      <Hurry x={46} y={46} s={0.62} color="#c9b48a" />
      <PriestWalking x={54} y={93} s={0.56} />
    </g>
  )
}

/** The temple helper going by, a sack on his shoulder, hurrying on. */
function HelperGoingBy() {
  return (
    <g>
      <ellipse {...groundShadow(48, 93, 20)} />
      <Hurry x={42} y={46} s={0.62} color="#c9b48a" />
      <HelperWalking x={48} y={93} s={0.56} />
    </g>
  )
}

/** The Samaritan stopping to help: kneeling by the hurt man with a hand on his shoulder, a heart over them. */
function SamaritanHelping() {
  return (
    <g>
      <ellipse {...groundShadow(52, 93, 42)} />
      <Sitting x={33} y={93} s={0.5} look={TRAVELER} blinkDelay={0.4}>
        <Hurts arm={LEFT_ARM.hold} />
        <SadFace look={TRAVELER} frown={false} />
      </Sitting>
      <Kneel x={72} y={93} s={0.5} look={SAMARITAN} pose="point" facing="left" blinkDelay={1.2}>
        <SamaritanCloth />
        <SadFace look={SAMARITAN} frown={false} />
      </Kneel>
      <LittleHeart x={52} y={16} s={0.36} />
    </g>
  )
}

/**
 * White bandages, close up: the hurt man's head and shoulders in a round frame, smiling now, a white bandage wrapped
 * round his head and another round his left arm (as in the story), which he holds up to wave, so the bandages fill
 * the picture.
 */
function BandagedTraveler() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  // (his left arm raised out to the side, clear of his face)
  const left: [Pt, Pt] = [[-20, -86], [-46, -112]]
  return (
    <g>
      <defs><clipPath id={`bt${uid}`}><circle cx={50} cy={50} r={44} /></clipPath></defs>
      <circle cx={50} cy={50} r={44} fill="#f8ecd6" />
      <g clipPath={`url(#bt${uid})`}>
        <path d="M6 70 Q50 58 94 70 L94 100 L6 100 Z" fill="#ead6b0" />
        <Figure x={56} y={154} s={0.9} look={TRAVELER} reach={[left[1], null]} blinkDelay={0.6}><Bandages arm={left} /></Figure>
      </g>
      <circle cx={50} cy={50} r={44} fill="none" stroke="#d9bf92" strokeWidth={3.2} />
    </g>
  )
}

// ---------- Coins and a money bag ----------

const SILVER = '#d4d9e3'
const SILVER_LINE = '#7f8799'

/** A silver coin face on, with a raised rim, a little head in profile and a ring of dots. (cx, cy): its middle. */
function SilverCoin({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const metal = useShade(SILVER, 0.5, 0.18)
  const k = r / 36
  return (
    <g transform={`translate(${cx} ${cy}) scale(${k})`}>
      <defs>{metal.def}</defs>
      <circle r={36} fill={metal.fill} stroke={SILVER_LINE} strokeWidth={3.2} />
      <circle r={29} fill="none" stroke={darken(SILVER, 0.18)} strokeWidth={2.2} />
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2
        return <circle key={i} cx={32.5 * Math.cos(a)} cy={32.5 * Math.sin(a)} r={1.3} fill={darken(SILVER, 0.22)} />
      })}
      {/* a little head in profile, raised on the coin */}
      <path d="M-9 15 Q-15 4 -11 -6 Q-7 -16 3 -17 Q12 -17 14 -9 Q15 -4 12 -1 L15 4 L11 5 Q12 10 8 12 Q4 13 1 12 L1 17 Z"
        fill={darken(SILVER, 0.1)} stroke={darken(SILVER, 0.3)} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M-11 -6 Q-4 -12 4 -10 M-12 0 Q-5 -5 2 -3" stroke={darken(SILVER, 0.3)} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M-22 -18 Q-12 -27 2 -27" stroke="#ffffff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
    </g>
  )
}

/** One silver coin (a denarius, like the two the Samaritan gave the innkeeper). */
function Denarius() {
  return (
    <g>
      <ellipse {...groundShadow(50, 90, 26)} />
      <SilverCoin cx={50} cy={50} r={36} />
    </g>
  )
}

/** Two silver coins, one in front of the other. */
function TwoDenarii() {
  return (
    <g>
      <ellipse {...groundShadow(50, 91, 36)} />
      <SilverCoin cx={36} cy={42} r={27} />
      <SilverCoin cx={63} cy={60} r={27} />
    </g>
  )
}

/** An empty leather money bag, open at the top so coins can go in: a ruffled collar, gathered in at the neck by its loose drawstring, and a round, full bottom. */
function MoneyBagOpen() {
  const c = '#b07a4a'
  const leather = useShade(c, 0.32, 0.2)
  const line = ink(c)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>{leather.def}</defs>
      <ellipse {...groundShadow(50, 92, 32)} />
      {/* the open mouth: the dark inside, and the far edge of the collar, ruffled */}
      <ellipse cx={50} cy={34} rx={26} ry={8} fill={darken(c, 0.5)} />
      <path d="M24 35 Q26 26 35 28 Q42 21 50 25 Q58 21 65 28 Q74 26 76 35" fill={darken(c, 0.1)} stroke={line} strokeWidth={2.4} />
      {/* the bag */}
      <path d="M24 35 Q30 42 50 42 Q70 42 76 35 L70 51 Q88 58 90 73 Q90 92 50 92 Q10 92 10 73 Q12 58 30 51 Z" fill={leather.fill} stroke={line} strokeWidth={2.8} />
      <path d="M33 38 l-1 7 M42 40 l0 7 M58 40 l0 7 M67 38 l1 7" stroke={darken(c, 0.18)} strokeWidth={1.6} />
      <path d="M35 54 Q30 62 26 68 M45 55 Q43 63 41 70 M55 55 Q57 63 59 70 M65 54 Q70 62 74 68" stroke={darken(c, 0.2)} strokeWidth={1.8} fill="none" />
      <path d="M28 82 Q38 88 48 88" stroke={lighten(c, 0.28)} strokeWidth={2.2} fill="none" opacity={0.7} />
      {/* the drawstring, loose, its ends hanging with little tassels */}
      <path d="M29 49 Q50 56 71 49" stroke="#e8c25a" strokeWidth={3.2} fill="none" />
      <path d="M64 52 Q68 60 65 67 M64 52 Q73 57 74 65" stroke="#e8c25a" strokeWidth={2.4} fill="none" />
      <circle cx={65} cy={69} r={2.8} fill="#e8c25a" stroke="#a8862a" strokeWidth={1.2} />
      <circle cx={74} cy={67} r={2.8} fill="#e8c25a" stroke="#a8862a" strokeWidth={1.2} />
      <Shine x={24} y={72} rx={6} ry={3.4} />
    </g>
  )
}

export const ISL_SAMARITAN: Item[] = [
  { id: 'priest-going-by', name: 'the priest going by', emoji: [], Draw: PriestGoingBy },
  { id: 'temple-helper-going-by', name: 'the temple helper going by', emoji: [], Draw: HelperGoingBy },
  { id: 'samaritan-helping', name: 'the Samaritan stopping to help', emoji: [], Draw: SamaritanHelping },
  { id: 'bandaged-traveler', name: 'the hurt man in his white bandages', emoji: [], Draw: BandagedTraveler },
  { id: 'denarius', name: 'silver coin', emoji: [], Draw: Denarius },
  { id: 'two-denarii', name: 'two silver coins', emoji: [], Draw: TwoDenarii },
  { id: 'money-bag-open', name: 'money bag', emoji: [], Draw: MoneyBagOpen },
]
