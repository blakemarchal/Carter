// Queen Esther: one picture per story page, both parts in order (see data/esther.ts for the words), and the
// people and places her paint game is drawn with (art/games/esther.tsx).
// God is never drawn as a person: His quiet care is light. Haman is proud and cross, never frightening, and what
// happened to him is left out.
//
// Made here to share (they can move into people.tsx and kit.tsx later):
//   People (looks): ESTHER and ESTHER_GIRL, MORDECAI and MORDECAI_ROYAL, XERXES, HAMAN, HELPERS (Esther's two
//     friends) and GODS_PEOPLE. Drawn with Esther (her crown, the pink front of her royal robe, her pink cape and her
//     long hair), Mordecai, KingXerxes (his crimson cape, tall crown and curly beard) and Haman (his big turban with
//     its jewel and feather, and his curly mustache). For a seated Person (Sitting, SittingOnRock), the same faces
//     and hats as children: EstherFace, KingCrown, BeardCurls, HamanFace, HamanHat, ProudEyes and WowFace.
//   Props: Cape, Throne, DinnerTable, Lantern, Goblet, OpenScroll, RolledScroll and TileBand (and, from
//     ../items/isl-esther, EstherCrown and Scepter).
//   Places: KingsGate, ThroneRoom (with the hangings of Esther 1:6: white and blue, tied with purple cords to silver
//     rings and marble pillars), QueensRoom and Street.
import { useId, type ComponentType, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { EyesUp, Figure, Kneel, LookingUp, ShutEyes, Sitting, SittingOnRock, SKIN, type JLook, type JPose, type Mood } from '../people'
import { Emoji, Glow, Moon, MudHouse, MusicNote, Palm, Rays, Scene, Sparkles, Tap, ThoughtBubble, sparkle } from './kit'
import { CROWN_GOLD, CROWN_INK, ESTHER_PINK, EstherCrown, Scepter } from '../items/isl-esther'

const uidOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')
type Pt = [number, number]
type Facing = 'left' | 'right'
const f1 = (n: number) => n.toFixed(1)

const GOLD = CROWN_GOLD, GOLD_INK = CROWN_INK
/**
 * Queen Esther's colors: her royal robe is purple, its front and her cape pink, her crown and sash gold, and the
 * palace's hangings blue (and white). The paint game's paints are these, so the robe painted there is hers.
 */
export const ESTHER_COLORS = { gold: GOLD, purple: '#9a62d6', pink: ESTHER_PINK, blue: '#4f8fe0' } as const
const PURPLE = ESTHER_COLORS.purple, PINK = ESTHER_COLORS.pink, BLUE = ESTHER_COLORS.blue
const HAIR = '#2e1c14'
const CRIMSON = '#a82a40'
const TILE = '#3f6fb6'
/** The purple cords the hangings are tied back with (Esther 1:6). */
const CORD = '#8a4fc0'

// ---------- The people ----------

/** Queen Esther: long dark hair and a purple royal robe with a gold sash. Draw her with <Esther>: it adds her crown, the pink front of her robe, her pink cape and her long hair over her shoulders. */
export const ESTHER: JLook = { skin: SKIN.medium, hair: 'long', hairColor: HAIR, robe: PURPLE, sash: GOLD }
/** Esther as a little girl, before she was queen: the same long dark hair, in a pink dress (<Esther girl>). */
export const ESTHER_GIRL: JLook = { skin: SKIN.medium, hair: 'long', hairColor: HAIR, robe: PINK, sash: '#fff4dc', build: 'child' }
/** Mordecai, Esther's big cousin: a cream head wrap (<Mordecai> adds its blue stripe), a long grey-brown beard and a sage-green robe. */
export const MORDECAI: JLook = { skin: SKIN.medium, hair: 'covered', hairColor: '#5a4a3e', wrap: '#f1e8d4', beard: 'long', beardColor: '#9d948a', robe: '#5f9a78', sash: '#d9a84a' }
/** Mordecai in the royal clothes the king gave him (Esther 8:15): white and blue, a gold band on his white head wrap (and a blue cape). */
export const MORDECAI_ROYAL: JLook = { ...MORDECAI, wrap: '#fbf9f4', robe: '#f7f4ec', sash: '#3f6fc6', band: GOLD }
/** King Xerxes: a long, curly black beard and royal blue robes (<KingXerxes> adds his crimson cape and tall gold crown). */
export const XERXES: JLook = { skin: SKIN.tan, hair: 'short', hairColor: '#1f1714', beard: 'long', beardColor: '#241a16', robe: '#3557a8', sash: GOLD }
/** Proud Haman: an orange robe with a red sash (<Haman> adds his big striped turban with its jewel and feather, and his curly mustache). */
export const HAMAN: JLook = { skin: SKIN.medium, hair: 'short', hairColor: '#4a2a18', beard: 'short', beardColor: '#4a2a18', robe: '#f0a03a', sash: '#c8403a' }
/** Queen Esther's two friends, who help her in the palace. */
export const HELPERS: JLook[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1d14', wrap: '#ffd58a', robe: '#5fbfae', sash: '#fff4dc' },
  { skin: SKIN.deep, hair: 'covered', hairColor: '#1f1510', wrap: '#c9e4ff', robe: '#f2a26e', sash: '#fff4dc' },
]
/** God's people in the city: a dad, a mom, a boy, a grandma, a girl and a grandpa. */
export const GODS_PEOPLE: JLook[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8dcc0', beard: 'short', beardColor: '#3b2a20', robe: '#7aa86e', sash: '#c0504d' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#f29ab8', robe: '#f2c46e', sash: '#ffffff' },
  { skin: SKIN.deep, hair: 'curly', hairColor: '#1f1510', robe: '#6fb8e8', sash: '#ffd34d', build: 'child' },
  { skin: SKIN.light, hair: 'covered', hairColor: '#e8e4dc', wrap: '#b8a8e0', robe: '#c98a6a', sash: '#f5f0e6' },
  { skin: SKIN.tan, hair: 'pigtails', hairColor: '#2b1d14', robe: '#ff9a7a', sash: '#ffe08a', build: 'child' },
  { skin: SKIN.medium, hair: 'bald', hairColor: '#cfc8bf', beard: 'long', beardColor: '#e8e4dc', robe: '#8a9ac8', sash: '#e0b45a' },
]
/** The king's servants at his gate (they bow down to Haman). */
const SERVANTS: JLook[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1d14', wrap: '#d8c8a8', beard: 'short', beardColor: '#2b1d14', robe: '#b88a5a', sash: '#5f7fa8' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#9fc0e0', beard: 'short', beardColor: '#3b2a20', robe: '#8f9f6a', sash: '#e0b45a' },
  { skin: SKIN.deep, hair: 'covered', hairColor: '#1f1510', wrap: '#f0d8a0', beard: 'short', beardColor: '#1f1510', robe: '#a8705a', sash: '#f5f0e6' },
]
/** The two men at the king's door who whispered a plan to hurt him (Esther 2:21), in their tall hats. */
const DOORKEEPERS: { look: JLook; hat: string }[] = [
  { look: { skin: SKIN.tan, hair: 'short', hairColor: '#241a14', beard: 'short', beardColor: '#241a14', robe: '#c9a040', sash: '#7a4a9a' }, hat: '#7a3a5a' },
  { look: { skin: SKIN.medium, hair: 'short', hairColor: '#3a2618', beard: 'short', beardColor: '#3a2618', robe: '#7f9a4a', sash: '#c9a040' }, hat: '#3a5a7a' },
]

/** A hand, drawn again on top of someone else (a hug's hand on a shoulder): `look` is whose hand; scene units. */
function HandOn({ x, y, s = 1, look }: { x: number; y: number; s?: number; look: JLook }) {
  return <circle cx={x} cy={y} r={7 * s} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2 * s} />
}

// Faces, hair and hats, drawn over a Person's own (in its units: give them as children).

/** Esther's long hair, falling forward over her shoulders from behind her ears (the left lock; the right is its mirror). */
const LOCK = 'M-19.5 -103 C-23 -104.5 -26.5 -104 -27.8 -101 C-29.5 -94 -26 -88 -27.6 -81 C-28.4 -77 -26 -73.5 -22.6 -74.6 C-21 -75 -21.8 -77.5 -23.2 -78.4 C-22 -84 -24 -90 -22.2 -96 C-21.4 -99 -20.4 -101.5 -19.5 -103 Z'

/** Esther's face: her long hair over her shoulders, little gold earrings and lashes. */
export function EstherFace() {
  return (
    <g>
      {[-1, 1].map((d) => (
        <g key={d} transform={`scale(${d} 1)`}>
          <path d={LOCK} fill={HAIR} stroke={ink(HAIR)} strokeWidth={1.4} strokeLinejoin="round" />
          <path d="M-26 -97 C-27 -91 -25 -86 -26 -81" stroke={lighten(HAIR, 0.28)} strokeWidth={1.1} fill="none" strokeLinecap="round" />
          <circle cx={-21.5} cy={-106.2} r={1.9} fill={GOLD} stroke={GOLD_INK} strokeWidth={0.8} />
        </g>
      ))}
      <g stroke="#2b2140" strokeWidth={1.3} strokeLinecap="round" fill="none">
        <path d="M-10.9 -117.2 L-13.9 -119.4 M-11.6 -115.2 L-14.8 -116" />
        <path d="M10.9 -117.2 L13.9 -119.4 M11.6 -115.2 L14.8 -116" />
      </g>
    </g>
  )
}

/** The pink front of Esther's royal robe, edged with gold, from under her sash to the hem. */
const RobeFront = () => (
  <g>
    <path d="M-7.6 -41.2 Q0 -40.2 7.6 -41.2 L13.6 -7.6 Q0 -5.6 -13.6 -7.6 Z" fill={PINK} />
    <path d="M-7.6 -41 L-13.4 -7.8 M7.6 -41 L13.4 -7.8" stroke={GOLD} strokeWidth={1.8} strokeLinecap="round" />
  </g>
)

/** King Xerxes' crown: tall and gold, with five points, a pearl on each, and a band with a red jewel and two blue ones. */
export const KingCrown = () => (
  <g>
    <path d="M-18 -127 L-20.5 -157 L-13.5 -146.5 L-7 -162 L0 -170 L7 -162 L13.5 -146.5 L20.5 -157 L18 -127 Q0 -132 -18 -127 Z" fill={GOLD} stroke={GOLD_INK} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-5 -152 L-2.5 -160" stroke="#fff4b8" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
    <path d="M-18.4 -130.6 Q0 -135.6 18.4 -130.6 L18.9 -138.4 Q0 -143.4 -18.9 -138.4 Z" fill="#e2a91e" stroke={GOLD_INK} strokeWidth={1.6} strokeLinejoin="round" />
    <circle cx={0} cy={-137.2} r={3.2} fill="#e8344a" stroke="#a81f30" strokeWidth={1} />
    {[-1, 1].map((d) => <circle key={d} cx={d * 11} cy={-135.8} r={2.2} fill="#5fb7ff" stroke="#2f7fc8" strokeWidth={0.8} />)}
    {[[-20.5, -157], [-7, -162], [0, -170], [7, -162], [20.5, -157]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r={2.6} fill="#fffaf0" stroke="#c9b48a" strokeWidth={0.9} />)}
  </g>
)

/** Curls in the king's long black beard. */
export const BeardCurls = () => (
  <path d="M-12 -91 q3 2.6 6 0 M-3 -91 q3 2.6 6 0 M6 -91 q3 2.6 6 0 M-7.5 -82 q3 2.6 6 0 M1.5 -82 q3 2.6 6 0 M-3 -74 q3 2.4 6 0"
    stroke={lighten(XERXES.beardColor!, 0.3)} strokeWidth={1.4} fill="none" strokeLinecap="round" />
)

const TURBAN = '#f07a2a'
/** Haman's big striped turban, with a green jewel set in gold and a tall white feather that sways. */
export const HamanHat = () => (
  <g>
    <g className="sc-sway">
      <path d="M4 -152 C7 -172 18 -188 33 -196 C31 -181 22 -165 11 -151 Z" fill="#fff8ec" stroke="#cdb894" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M7 -154 C13 -170 21 -182 30 -191" stroke="#e2d0ac" strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </g>
    <path d="M-26 -119 C-38 -138 -28 -164 0 -167 C28 -164 38 -138 26 -119 Q0 -129.5 -26 -119 Z" fill={TURBAN} stroke={ink(TURBAN)} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-30 -130 Q-4 -152 26 -150 M-24 -148 Q2 -165 20 -161 M-29 -134 Q0 -129 29 -134" stroke="#d2402e" strokeWidth={3} fill="none" strokeLinecap="round" />
    <circle cx={0} cy={-136} r={6.4} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.4} />
    <circle cx={0} cy={-136} r={3.5} fill="#3fbf7f" stroke="#1f8a52" strokeWidth={1} />
    <circle cx={-1.1} cy={-137.3} r={1} fill="#fff" opacity={0.8} />
  </g>
)

/** Haman's curly mustache, its ends turned up onto his cheeks, and a pointy little beard below his own. */
export const HamanFace = () => (
  <g>
    <path d="M-6 -89.5 Q0 -79 6 -89.5 Z" fill={HAMAN.beardColor} stroke={ink(HAMAN.beardColor!)} strokeWidth={1.4} strokeLinejoin="round" />
    {[-1, 1].map((d) => (
      <path key={d} transform={`scale(${d} 1)`} d="M0 -103.4 C-5 -106.4 -10.5 -105.8 -14.4 -108.4 C-17.4 -110.4 -16.8 -114 -14.2 -113.6"
        stroke="#1e100a" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </g>
)

/** A proud face: eyelids half down over the eyes, and brows raised high (nose in the air). */
export const ProudEyes = ({ skin = HAMAN.skin, brow = HAMAN.hairColor }: { skin?: string; brow?: string }) => (
  <g>
    {[-8, 8].map((ex) => (
      <g key={ex}>
        <path d={`M${ex - 4.1} -114.1 A4.1 4.9 0 0 1 ${ex + 4.1} -114.1 Z`} fill={skin} />
        <path d={`M${ex - 3.9} -114.1 L${ex + 3.9} -114.1`} stroke="#2b2140" strokeWidth={1.9} strokeLinecap="round" />
      </g>
    ))}
    <path d="M-13 -119.6 Q-9 -123.6 -4.5 -120.6 M13 -119.6 Q9 -123.6 4.5 -120.6" stroke={darken(brow, 0.1)} strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </g>
)

/** A surprised face over a bearded Person's own: big round eyes, brows up and an open mouth. `brows`: how high the brows are (lower under a hat). */
export const WowFace = ({ look, brows = -124 }: { look: JLook; brows?: number }) => (
  <g>
    {[-8, 8].map((ex) => (
      <g key={ex}>
        <ellipse cx={ex} cy={-114} rx={4} ry={5.2} fill={look.skin} />
        <ellipse cx={ex} cy={-114} rx={3.7} ry={4.9} fill="#2b2140" />
        <circle cx={ex - 1} cy={-116.4} r={1.3} fill="#fff" />
      </g>
    ))}
    <path d={`M-12.5 ${brows + 1.5} Q-8 ${brows - 3} -3.5 ${brows} M12.5 ${brows + 1.5} Q8 ${brows - 3} 3.5 ${brows}`} stroke={darken(look.hairColor, 0.1)} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-98.3} rx={2.9} ry={3.6} fill="#6b2a3a" stroke="#d0707e" strokeWidth={1.2} />
  </g>
)

/** A drop of worry by someone's brow ("uh oh!"). */
const SweatDrop = () => (
  <g>
    <path d="M26 -128 Q21.5 -120 23.5 -116.5 Q26 -114 28.5 -116.5 Q30.5 -120 26 -128 Z" fill="#9fd6ff" stroke="#4a9ad8" strokeWidth={1.2} />
    <circle cx={25} cy={-118.5} r={0.9} fill="#fff" />
  </g>
)

/** A tall hat with a gold band (the men at the king's door). */
const GuardHat = ({ color }: { color: string }) => (
  <g>
    <path d="M-20.5 -123 L-17.5 -158 Q0 -166 17.5 -158 L20.5 -123 Q0 -129 -20.5 -123 Z" fill={color} stroke={ink(color)} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-20.7 -127 Q0 -133 20.7 -127" stroke={GOLD} strokeWidth={3} fill="none" />
  </g>
)

/** A cape hanging from the shoulders behind someone, down to the ground (in a Person's units). */
const CAPE = 'M-19 -92 C-35 -66 -46 -36 -51 -3 Q0 4 51 -3 C46 -36 35 -66 19 -92 Z'

/** A cape behind someone standing at (x, y), `s` big (as for Person), in `color` with a gold hem. Draw it before them. */
export function Cape({ x, y, s, facing = 'right', color }: { x: number; y: number; s: number; facing?: Facing; color: string }) {
  const shade = useShade(color, 0.25, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{shade.def}</defs>
      <path d={CAPE} fill={shade.fill} stroke={ink(color)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-49.3 -6.2 Q0 1 49.3 -6.2" stroke={GOLD} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

type Who = {
  x: number; y: number; s?: number; pose?: JPose; mood?: Mood; facing?: Facing; blinkDelay?: number
  reach?: [Pt | null, Pt | null]; item?: ReactNode; children?: ReactNode
}

/** Queen Esther standing, in her crown, royal robe and cape; `girl`: little Esther, before she was queen. */
export function Esther({ x, y, s = 1, girl, facing = 'right', children, ...rest }: Who & { girl?: boolean }) {
  return (
    <g>
      {!girl && <Cape x={x} y={y} s={s} facing={facing} color={PINK} />}
      <Figure x={x} y={y} s={s} look={girl ? ESTHER_GIRL : ESTHER} facing={facing} {...rest}>
        {!girl && <RobeFront />}
        <EstherFace />
        {!girl && <EstherCrown />}
        {children}
      </Figure>
    </g>
  )
}

/** Mordecai, in his cream head wrap with a blue stripe; `royal`: in the white and blue royal clothes the king gave him, with a blue cape. */
export function Mordecai({ x, y, s = 1, royal, facing = 'right', children, ...rest }: Who & { royal?: boolean }) {
  return (
    <g>
      {royal && <Cape x={x} y={y} s={s} facing={facing} color="#3f6fc6" />}
      <Figure x={x} y={y} s={s} look={royal ? MORDECAI_ROYAL : MORDECAI} facing={facing} {...rest}>
        {!royal && <path d="M-23.2 -128 Q0 -138.5 23.2 -128" stroke="#5f86b8" strokeWidth={3} fill="none" strokeLinecap="round" />}
        {children}
      </Figure>
    </g>
  )
}

/** King Xerxes standing, with his crimson cape, curly beard and tall crown. */
export function KingXerxes({ x, y, s = 1, facing = 'right', children, ...rest }: Who) {
  return (
    <g>
      <Cape x={x} y={y} s={s} facing={facing} color={CRIMSON} />
      <Figure x={x} y={y} s={s} look={XERXES} facing={facing} {...rest}>
        <BeardCurls />
        <KingCrown />
        {children}
      </Figure>
    </g>
  )
}

/** Proud Haman in his big turban. `mood`: 'proud' (nose in the air: eyelids half down, brows up, a smug smile), or Figure's 'grumpy' (cross) and 'wow' (caught out). */
export function Haman({ mood = 'proud', children, ...rest }: Omit<Who, 'mood'> & { mood?: Mood | 'proud' }) {
  return (
    <Figure {...rest} look={HAMAN} mood={mood === 'proud' ? 'happy' : mood}>
      {mood === 'proud' && <ProudEyes />}
      <HamanFace />
      <HamanHat />
      {children}
    </Figure>
  )
}

// ---------- Things in the pictures ----------

/** Where a seated king's feet go in the throne room: the top of the throne's steps. */
const DAIS = 356

/** A floating heart. */
function Heart({ x, y, s = 1, d = 0 }: { x: number; y: number; s?: number; d?: number }) {
  return (
    <g className="sc-float" style={{ animationDelay: `${d}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 13 C-20 0 -17 -17 -7 -17 C-3 -17 0 -14 0 -10 C0 -14 3 -17 7 -17 C17 -17 20 0 0 13 Z" fill="#ff6f91" stroke="#d94a6e" strokeWidth={2.5} strokeLinejoin="round" />
        <ellipse cx={-8} cy={-9} rx={3.6} ry={2.2} fill="#fff" opacity={0.65} transform="rotate(-35 -8 -9)" />
      </g>
    </g>
  )
}

/** An open scroll held up in front by its two rollers, its writing toward us (figure units: for <Figure pose="present" item={…}>, whose hands hold the rollers). */
const OpenScroll = () => (
  <g>
    <rect x={-17} y={-82} width={34} height={38} rx={1.5} fill="#fff6dc" stroke="#c9a46a" strokeWidth={1.6} />
    {[-75, -69, -63, -57, -51].map((ly, i) => <path key={ly} d={`M-12 ${ly} H${i === 4 ? 3 : 12}`} stroke="#a08868" strokeWidth={1.8} strokeLinecap="round" />)}
    {[-1, 1].map((d) => <rect key={d} x={d * 19 - 3.5} y={-86} width={7} height={46} rx={3.5} fill="#d39a5a" stroke="#8a5428" strokeWidth={1.6} />)}
  </g>
)

/** A rolled-up scroll, its middle at (x, y), tied with a ribbon; `seal`: the king's red wax seal hanging from it. */
function RolledScroll({ x, y, s = 1, angle = 0, seal }: { x: number; y: number; s?: number; angle?: number; seal?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <rect x={-16} y={-5.5} width={32} height={11} rx={5.5} fill="#fff3d6" stroke="#c9a46a" strokeWidth={1.6} />
      <ellipse cx={15.5} cy={0} rx={2.6} ry={5.5} fill="#ecd9b0" stroke="#c9a46a" strokeWidth={1.4} />
      <path d="M-3 -5.5 V5.5" stroke={seal ? '#c8324a' : '#5f86b8'} strokeWidth={2.6} />
      {seal && <path d="M-3 5.5 V9" stroke="#c8324a" strokeWidth={1.6} />}
      {seal && <circle cx={-3} cy={12} r={4.4} fill="#d0343a" stroke="#9a1f24" strokeWidth={1.2} />}
    </g>
  )
}

/** A golden cup on a stem; (x, y) = its foot. */
function Goblet({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-8 0 Q0 -4 8 0 Z M-1.5 -2 L-1.5 -10 L1.5 -10 L1.5 -2 Z" fill="#e2a91e" stroke={GOLD_INK} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M-9 -24 L9 -24 Q9 -10 0 -10 Q-9 -10 -9 -24 Z" fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} strokeLinejoin="round" />
      <ellipse cx={0} cy={-24} rx={9} ry={2.4} fill="#8a2a40" stroke={GOLD_INK} strokeWidth={1.2} />
      <path d="M-5.5 -21 Q-6 -15 -2.5 -12.5" stroke="#fff4b8" strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A golden lantern hanging on a chain from the ceiling, glowing warm. (x, y): its middle. */
function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} 0 V${y - 26}`} stroke="#a8862a" strokeWidth={2.2} strokeDasharray="5 3" />
      <Glow x={x} y={y} r={58} color="#ffe2a0" />
      <path d={`M${x - 8} ${y - 26} L${x + 8} ${y - 26} L${x + 14} ${y - 16} L${x - 14} ${y - 16} Z`} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d={`M${x - 14} ${y - 16} L${x + 14} ${y - 16} L${x + 11} ${y + 14} L${x - 11} ${y + 14} Z`} fill="#ffe7a0" stroke={GOLD_INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={`M${x - 4.5} ${y - 15} L${x - 3.5} ${y + 13} M${x + 4.5} ${y - 15} L${x + 3.5} ${y + 13}`} stroke={GOLD_INK} strokeWidth={1.4} />
      <path d={`M${x} ${y - 6} Q${x - 4} ${y + 1} ${x} ${y + 5} Q${x + 4} ${y + 1} ${x} ${y - 6} Z`} fill="#ff9d3a" />
      <path d={`M${x - 11} ${y + 14} L${x + 11} ${y + 14} L${x + 6} ${y + 22} L${x - 6} ${y + 22} Z`} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} strokeLinejoin="round" />
    </g>
  )
}

/** A band of blue glazed tiles with gold flowers, edged in gold, across from x0 to x1, from y down h. */
export function TileBand({ y, h = 30, x0 = 0, x1 = 800 }: { y: number; h?: number; x0?: number; x1?: number }) {
  const n = Math.max(1, Math.floor((x1 - x0) / 32))
  const step = (x1 - x0) / n
  const r = Math.min(6, h * 0.2)
  return (
    <g>
      <rect x={x0} y={y} width={x1 - x0} height={h} fill={TILE} />
      <path d={`M${x0} ${y + 1.5} H${x1} M${x0} ${y + h - 1.5} H${x1}`} stroke={GOLD} strokeWidth={3} />
      {Array.from({ length: n }, (_, i) => {
        const cx = x0 + step / 2 + i * step, cy = y + h / 2
        return (
          <g key={i}>
            {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={cx + Math.cos((a * Math.PI) / 180) * r} cy={cy + Math.sin((a * Math.PI) / 180) * r} r={r * 0.6} fill="#ffe08a" />)}
            <circle cx={cx} cy={cy} r={r * 0.5} fill="#fff" />
          </g>
        )
      })}
    </g>
  )
}

/** A white marble pillar with soft grey veins, a gold top on curled scrolls, and a base (x: its middle; from y0 down to y1). */
function Pillar({ x, y0, y1, w = 40 }: { x: number; y0: number; y1: number; w?: number }) {
  const shaft = useShade('#f6f3ee', 0.2, 0.12)
  return (
    <g>
      <defs>{shaft.def}</defs>
      <rect x={x - w / 2} y={y0 + 28} width={w} height={y1 - y0 - 46} fill={shaft.fill} stroke="#c9c2b6" strokeWidth={2.5} />
      <path d={`M${x - w * 0.2} ${y0 + 60} q${w * 0.15} 40 ${-w * 0.05} 90 q${-w * 0.1} 40 ${w * 0.1} 80`} stroke="#d8d2c8" strokeWidth={1.6} fill="none" />
      <path d={`M${x + w * 0.22} ${y0 + 110} q${-w * 0.1} 50 ${w * 0.04} 110`} stroke="#d8d2c8" strokeWidth={1.4} fill="none" />
      <path d={`M${x - w / 2 - 10} ${y0 + 30} Q${x - w / 2 - 20} ${y0 + 15} ${x - w / 2 - 5} ${y0 + 10} L${x + w / 2 + 5} ${y0 + 10} Q${x + w / 2 + 20} ${y0 + 15} ${x + w / 2 + 10} ${y0 + 30} Z`}
        fill={GOLD} stroke={GOLD_INK} strokeWidth={2.4} strokeLinejoin="round" />
      <rect x={x - w / 2 - 9} y={y0} width={w + 18} height={12} rx={3} fill="#f8d96a" stroke={GOLD_INK} strokeWidth={2.4} />
      {[-1, 1].map((d) => <circle key={d} cx={x + d * (w / 2 + 5)} cy={y0 + 21} r={5} fill="#f8d96a" stroke={GOLD_INK} strokeWidth={1.8} />)}
      <rect x={x - w / 2 - 7} y={y1 - 20} width={w + 14} height={20} rx={3} fill="#efeae2" stroke="#c9c2b6" strokeWidth={2.5} />
    </g>
  )
}

// A curtain, hanging from a rod and tied back: its top corners (a, b) at `top`, gathered at `tie` (2 tw wide),
// then falling to its bottom corners (c, d) at `bottom`.
export type Curtain = { a: number; b: number; top: number; tie: Pt; tw: number; c: number; d: number; bottom: number }

/** A line down the curtain, t of the way across it (0 its left edge, 1 its right): down from the top, and back up. */
function curtainEdge(k: Curtain, t: number) {
  const T: Pt = [k.a + (k.b - k.a) * t, k.top]
  const M: Pt = [k.tie[0] - k.tw + 2 * k.tw * t, k.tie[1]]
  const B: Pt = [k.c + (k.d - k.c) * t, k.bottom]
  const c1: Pt = [T[0], T[1] + (M[1] - T[1]) * 0.55], c2: Pt = [M[0], M[1] - (M[1] - T[1]) * 0.35]
  const c3: Pt = [M[0], M[1] + (B[1] - M[1]) * 0.4], c4: Pt = [B[0], B[1] - (B[1] - M[1]) * 0.45]
  const p = ([x, y]: Pt) => `${f1(x)} ${f1(y)}`
  return {
    down: `${p(T)} C${p(c1)} ${p(c2)} ${p(M)} C${p(c3)} ${p(c4)} ${p(B)}`,
    up: `${p(B)} C${p(c4)} ${p(c3)} ${p(M)} C${p(c2)} ${p(c1)} ${p(T)}`,
  }
}
/** The strip of curtain from t0 to t1 of the way across (the whole curtain: 0 to 1). */
export const curtainPath = (k: Curtain, t0 = 0, t1 = 1) => `M${curtainEdge(k, t0).down} L${curtainEdge(k, t1).up} Z`
/** The folds down a curtain, `n` strips wide: n - 1 lines. */
export const curtainFolds = (k: Curtain, n: number) => Array.from({ length: n - 1 }, (_, i) => `M${curtainEdge(k, (i + 1) / n).down}`).join(' ')

/** The purple cord a curtain is tied back with, and its tassel (at the tie, round a bunch 2 w wide). */
export function Cord({ at: [x, y], w, side = 1 }: { at: Pt; w: number; side?: 1 | -1 }) {
  const tx = x + side * w
  return (
    <g>
      <rect x={x - w - 4} y={y - 5} width={2 * w + 8} height={10} rx={5} fill={CORD} stroke={darken(CORD, 0.3)} strokeWidth={1.6} />
      <path d={`M${tx} ${y + 3} q${side * 4} 9 0 18`} stroke={CORD} strokeWidth={3} fill="none" strokeLinecap="round" />
      <circle cx={tx} cy={y + 21} r={4.5} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.2} />
      <path d={`M${tx - 6} ${y + 24} L${tx + 6} ${y + 24} L${tx + 8} ${y + 44} L${tx - 8} ${y + 44} Z`} fill={CORD} stroke={darken(CORD, 0.3)} strokeWidth={1.4} strokeLinejoin="round" />
      <path d={`M${tx - 3.5} ${y + 28} L${tx - 4.5} ${y + 42} M${tx + 3.5} ${y + 28} L${tx + 4.5} ${y + 42}`} stroke={lighten(CORD, 0.25)} strokeWidth={1.2} />
    </g>
  )
}

/** A silver rod with silver rings (Esther 1:6), from x0 to x1 at y. */
export function Rod({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const n = Math.max(2, Math.round((x1 - x0) / 26))
  return (
    <g>
      {Array.from({ length: n + 1 }, (_, i) => <circle key={i} cx={x0 + 6 + (i * (x1 - x0 - 12)) / n} cy={y + 5} r={5} fill="none" stroke="#b9c0cc" strokeWidth={2.4} />)}
      <rect x={x0} y={y - 3.5} width={x1 - x0} height={7} rx={3.5} fill="#d6dbe4" stroke="#8d95a8" strokeWidth={1.6} />
    </g>
  )
}

/** A striped curtain (in colors `a` and `b`, n strips), with its folds, outline and purple cord. */
function Hanging({ k, n = 8, a = BLUE, b = '#fbfaf5', line = '#2f5f9e', side = 1 }: { k: Curtain; n?: number; a?: string; b?: string; line?: string; side?: 1 | -1 }) {
  return (
    <g>
      <path d={curtainPath(k)} fill={a} />
      {Array.from({ length: n }, (_, i) => (i % 2 ? <path key={i} d={curtainPath(k, i / n, (i + 1) / n)} fill={b} /> : null))}
      <path d={curtainFolds(k, n)} stroke={line} strokeWidth={1} fill="none" opacity={0.3} />
      <path d={curtainPath(k)} fill="none" stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <Cord at={k.tie} w={k.tw} side={side} />
    </g>
  )
}

/** A pair of the palace's white and blue hangings between two marble pillars at p and q, tied back to each. */
function HangingPair({ p, q, top = 100, bottom = 338 }: { p: number; q: number; top?: number; bottom?: number }) {
  const mid = (p + q) / 2
  return (
    <g>
      <Hanging k={{ a: p + 16, b: mid + 2, top, tie: [p + 36, 232], tw: 13, c: p + 18, d: p + 70, bottom }} side={-1} />
      <Hanging k={{ a: mid - 2, b: q - 16, top, tie: [q - 36, 232], tw: 13, c: q - 70, d: q - 18, bottom }} />
      <Rod x0={p + 14} x1={q - 14} y={top - 4} />
    </g>
  )
}

/** A floor of marble tiles, cream and rose with gold lines (Esther 1:6), from y down, in gentle perspective. */
function MarbleFloor({ y = 336 }: { y?: number }) {
  const vy = y - 300, span = 450 - vy
  const rows = [y, y + 16, y + 36, y + 62, y + 96, 460]
  const colX = (c: number, yy: number) => 400 + ((c - 400) * (yy - vy)) / span
  const cols = Array.from({ length: 21 }, (_, i) => -400 + i * 80)
  const tiles: ReactNode[] = []
  for (let r = 0; r < rows.length - 1; r++) {
    for (let c = 0; c < cols.length - 1; c++) {
      const [y0, y2] = [rows[r], rows[r + 1]]
      const pts = [[colX(cols[c], y0), y0], [colX(cols[c + 1], y0), y0], [colX(cols[c + 1], y2), y2], [colX(cols[c], y2), y2]]
      tiles.push(<path key={`${r}-${c}`} d={`M${pts.map(([px, py]) => `${f1(px)} ${f1(py)}`).join(' L')} Z`} fill={(r + c) % 2 ? '#ecd5c8' : '#f7f0e4'} stroke="#e0c58c" strokeWidth={1.2} />)
    }
  }
  return <g>{tiles}</g>
}

/** The king's golden throne: a tall gold back with a crimson panel and a gold rosette on top, armrests, a purple cushion and paw feet. (x, y): the middle of its foot; someone sitting on it (SittingOnRock at the same x, y and s) sits on its cushion. */
function Throne({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const gold = useShade(GOLD, 0.35, 0.18)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{gold.def}</defs>
      <path d="M-48 -26 L-48 -150 Q-48 -194 0 -202 Q48 -194 48 -150 L48 -26 Z" fill={gold.fill} stroke={GOLD_INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-35 -34 L-35 -146 Q-35 -178 0 -185 Q35 -178 35 -146 L35 -34 Z" fill={CRIMSON} stroke={darken(CRIMSON, 0.3)} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-27 -60 L-27 -140 Q-27 -166 0 -171 Q27 -166 27 -140 L27 -60" stroke={GOLD} strokeWidth={2} fill="none" opacity={0.7} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <ellipse key={a} cx={0} cy={-213} rx={4.5} ry={9} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.4} transform={`rotate(${a} 0 -204)`} />)}
      <circle cx={0} cy={-204} r={7.5} fill="#f8d96a" stroke={GOLD_INK} strokeWidth={1.8} />
      <circle cx={0} cy={-204} r={3.6} fill="#e8344a" />
      <rect x={-56} y={-26} width={112} height={18} rx={4} fill={gold.fill} stroke={GOLD_INK} strokeWidth={2.6} />
      <rect x={-50} y={-36} width={100} height={13} rx={6} fill={PURPLE} stroke={ink(PURPLE)} strokeWidth={2.2} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={d * 58 - 6} y={-66} width={12} height={44} rx={3} fill={gold.fill} stroke={GOLD_INK} strokeWidth={2.2} />
          <rect x={d > 0 ? 44 : -68} y={-74} width={24} height={10} rx={5} fill={gold.fill} stroke={GOLD_INK} strokeWidth={2.2} />
          <circle cx={d * 68} cy={-69} r={6.5} fill="#f8d96a" stroke={GOLD_INK} strokeWidth={1.8} />
          <rect x={d * 46 - 6} y={-10} width={12} height={8} fill={gold.fill} stroke={GOLD_INK} strokeWidth={2} />
          <ellipse cx={d * 46} cy={-3} rx={10} ry={5.5} fill="#f8d96a" stroke={GOLD_INK} strokeWidth={2} />
        </g>
      ))}
    </g>
  )
}

/** The steps up to the throne (its foot at x, DAIS), with a red carpet running down them toward us. */
function Dais({ x }: { x: number }) {
  return (
    <g>
      {[[400, 150], [378, 128], [DAIS, 108]].map(([y0, w], i) => (
        <rect key={i} x={x - w} y={y0} width={2 * w} height={22} rx={3} fill={i % 2 ? '#e8d2a4' : '#f1e1bd'} stroke="#c9a46a" strokeWidth={2.5} />
      ))}
      <path d={`M${x - 52} ${DAIS} L${x + 52} ${DAIS} L${x + 96} 452 L${x - 96} 452 Z`} fill="#b8323b" />
      <path d={`M${x - 46} ${DAIS} L${x - 86} 452 M${x + 46} ${DAIS} L${x + 86} 452`} stroke={GOLD} strokeWidth={3} />
      {[378, 400, 422].map((sy) => {
        const w = 52 + ((sy - DAIS) * 44) / (452 - DAIS)
        return <path key={sy} d={`M${x - w} ${sy} H${x + w}`} stroke="#8a2028" strokeWidth={1.6} opacity={0.6} />
      })}
    </g>
  )
}

/** The valance over the throne: a band of white and blue, its bottom in three swags with a gold fringe, and blue drapes falling at each side. */
function Canopy({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const id = uidOf(useId())
  const w = (x1 - x0) / 3
  const bottom = `M${x0} ${y} H${x1} V${y + 34} ${[2, 1, 0].map((i) => `Q${f1(x0 + w * (i + 0.5))} ${y + 66} ${f1(x0 + w * i)} ${y + 34}`).join(' ')} Z`
  return (
    <g>
      {[x0 + 4, x1 - 34].map((dx, i) => (
        <path key={i} d={`M${dx} ${y + 20} L${dx + 30} ${y + 20} Q${dx + 36} ${y + 140} ${dx + 30} ${y + 250} L${dx} ${y + 250} Q${dx - 6} ${y + 140} ${dx} ${y + 20} Z`} fill={BLUE} stroke="#2f5f9e" strokeWidth={2.4} />
      ))}
      <defs><clipPath id={`cn${id}`}><path d={bottom} /></clipPath></defs>
      <path d={bottom} fill="#fbfaf5" />
      <g clipPath={`url(#cn${id})`}>
        {Array.from({ length: Math.ceil((x1 - x0) / 24) }, (_, i) => (i % 2 ? null : <rect key={i} x={x0 + i * 24} y={y} width={24} height={80} fill={BLUE} />))}
      </g>
      <path d={bottom} fill="none" stroke="#2f5f9e" strokeWidth={2.5} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${f1(x0 + w * i + 6)} ${y + 38} Q${f1(x0 + w * (i + 0.5))} ${y + 70} ${f1(x0 + w * (i + 1) - 6)} ${y + 38}`} stroke={GOLD} strokeWidth={4} strokeDasharray="2 4" fill="none" strokeLinecap="round" />)}
      <rect x={x0 - 6} y={y - 6} width={x1 - x0 + 12} height={10} rx={4} fill={GOLD} stroke={GOLD_INK} strokeWidth={2} />
    </g>
  )
}

// ---------- Places ----------

/**
 * King Xerxes' throne room: sandy walls with a band of blue tiles and gold flowers, marble pillars with the white and
 * blue hangings tied back between them, the golden throne under its canopy at `throne` (`s` big, for a king that
 * size), on steps with a red carpet, and a floor of marble tiles.
 */
function ThroneRoom({ throne = 400, s = 1.12 }: { throne?: number; s?: number }) {
  const t = throne
  const pillars = [t - 340, t - 170, t + 170, t + 340].filter((x) => x > -40 && x < 840)
  return (
    <g>
      <rect width={800} height={340} fill="#f3dfb6" />
      <rect y={36} width={800} height={10} fill="#ead1a2" />
      <TileBand y={0} h={34} />
      <MarbleFloor y={336} />
      <HangingPair p={t - 340} q={t - 170} />
      <HangingPair p={t + 170} q={t + 340} />
      <Canopy x0={t - 140} x1={t + 140} y={96} />
      {pillars.map((x) => <Pillar key={x} x={x} y0={50} y1={342} />)}
      <Dais x={t} />
      <Throne x={t} y={DAIS} s={s} />
    </g>
  )
}

/**
 * The king's gate at Susa, where Mordecai sat: two tall towers and the wall between them, of sandy brick with bands of
 * blue tiles, a big arched gateway with its doors open on the sunny palace courtyard, and stone benches. (cx: the
 * middle of the gateway; the ground is at y 340.) `win`: someone in the arched window high on the right tower,
 * behind its little railing (drawn in it, in scene units; it is 100 wide, from x cx + 160, y 150 to 262: people
 * about s = 0.58, their feet at y 268). `flags`: banners and garlands, for a happy day.
 */
function KingsGate({ cx = 400, win, flags }: { cx?: number; win?: ReactNode; flags?: boolean }) {
  const id = uidOf(useId())
  const brick = useShade('#ebcf98', 0.16, 0.12)
  const line = '#c9a46a'
  const wall = `M${cx - 150} 112 H${cx + 150} V340 H${cx + 74} V220 A74 74 0 0 0 ${cx - 74} 220 V340 H${cx - 150} Z`
  const W = { x: cx + 160, y: 150 }
  const winPath = `M${W.x} 262 V${W.y + 50} A50 50 0 0 1 ${W.x + 100} ${W.y + 50} V262 Z`
  return (
    <g>
      <defs>
        {brick.def}
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff8e2" /><stop offset="1" stopColor="#efd7a2" /></linearGradient>
        <clipPath id={`${id}w`}><path d={winPath} /></clipPath>
      </defs>
      {/* the plaza */}
      <rect y={334} width={800} height={116} fill="#ecd6a6" />
      {[362, 396, 436].map((py, r) => (
        <g key={py} stroke="#dcc08a" strokeWidth={2}>
          <path d={`M0 ${py} H800`} />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 100 + (r % 2) * 50} ${py - (r ? 34 : 28)} V${py}`} />)}
        </g>
      ))}
      {/* through the gateway: the palace courtyard in the sun, and the palace beyond */}
      <rect x={cx - 74} y={146} width={148} height={194} fill={`url(#${id}c)`} />
      <rect x={cx - 74} y={232} width={148} height={20} fill="#f3e0b8" />
      {[-44, 0, 44].map((dx) => <rect key={dx} x={cx + dx - 7} y={252} width={14} height={66} fill="#fbf6ec" stroke="#e0d2b4" strokeWidth={1.5} />)}
      <rect x={cx - 74} y={318} width={148} height={22} fill="#ead2a0" />
      {/* the towers */}
      {[cx - 270, cx + 150].map((tx) => (
        <g key={tx}>
          {Array.from({ length: 5 }, (_, i) => <rect key={i} x={tx + 4 + i * 24} y={54} width={16} height={18} fill={brick.fill} stroke={line} strokeWidth={2.5} />)}
          <rect x={tx} y={70} width={120} height={270} fill={brick.fill} stroke={line} strokeWidth={3} />
          <TileBand y={84} h={10} x0={tx} x1={tx + 120} />
        </g>
      ))}
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x={cx - 146 + i * 27} y={98} width={16} height={16} fill={brick.fill} stroke={line} strokeWidth={2.5} />)}
      <path d={wall} fill={brick.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      {/* bricks */}
      {[176, 212, 248, 284, 318].map((by, r) => (
        <g key={by} stroke="#dcbd84" strokeWidth={1.5}>
          {[cx - 266, cx - 146, cx + 78, cx + 154].map((bx, j) => (
            <path key={j} d={`M${bx + (r % 2) * 14} ${by} h24 M${bx + 46 + (r % 2) * 14} ${by + 6} h24`} />
          ))}
        </g>
      ))}
      <TileBand y={124} h={18} x0={cx - 270} x1={cx + 270} />
      {/* the doors, swung open, and the gateway's frame of blue tiles */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M${cx + d * 74} 340 L${cx + d * 74} 226 L${cx + d * 56} 236 L${cx + d * 56} 334 Z`} fill="#8a5a30" stroke="#5a3a1c" strokeWidth={2} strokeLinejoin="round" />
          {[256, 286, 316].map((sy) => <circle key={sy} cx={cx + d * 65} cy={sy} r={2.2} fill={GOLD} />)}
        </g>
      ))}
      <path d={`M${cx - 74} 340 V220 A74 74 0 0 1 ${cx + 74} 220 V340`} fill="none" stroke={TILE} strokeWidth={12} />
      <path d={`M${cx - 81} 340 V220 A81 81 0 0 1 ${cx + 81} 220 V340`} fill="none" stroke={GOLD} strokeWidth={2.5} />
      {/* stone benches by the gate */}
      {[-1, 1].map((d) => {
        const bx = cx + d * 116
        return (
          <g key={d}>
            <rect x={bx - 26} y={316} width={10} height={24} fill="#cdb488" stroke="#a88c5c" strokeWidth={2} />
            <rect x={bx + 16} y={316} width={10} height={24} fill="#cdb488" stroke="#a88c5c" strokeWidth={2} />
            <rect x={bx - 32} y={306} width={64} height={12} rx={3} fill="#e2cc9e" stroke="#a88c5c" strokeWidth={2.2} />
          </g>
        )
      })}
      {/* the window high on the right tower */}
      {win !== undefined && (
        <g>
          <path d={winPath} fill="#5a3e34" />
          <g clipPath={`url(#${id}w)`}>
            <Glow x={W.x + 50} y={W.y + 62} r={80} color="#ffc978" />
            {win}
          </g>
          <rect x={W.x - 4} y={236} width={108} height={6} rx={3} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.6} />
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={W.x + 6 + i * 11} y={242} width={4} height={20} fill={GOLD} stroke={GOLD_INK} strokeWidth={1} />)}
          <path d={winPath} fill="none" stroke={TILE} strokeWidth={7} />
          <rect x={W.x - 10} y={260} width={120} height={10} rx={3} fill="#f2dcae" stroke={line} strokeWidth={2.2} />
        </g>
      )}
      {flags && <Festive cx={cx} />}
    </g>
  )
}

/** Banners on the gate's towers and a garland of flowers over its gateway, for a happy day. */
function Festive({ cx }: { cx: number }) {
  return (
    <g>
      {[cx - 210, cx + 210].map((bx, i) => (
        <g key={bx}>
          <rect x={bx - 30} y={150} width={60} height={8} rx={4} fill={GOLD_INK} />
          <path d={`M${bx - 26} 154 L${bx + 26} 154 L${bx + 26} 290 L${bx} 270 L${bx - 26} 290 Z`} fill={i ? PURPLE : BLUE} stroke={GOLD} strokeWidth={4} strokeLinejoin="round" />
          <path d={sparkle(bx, 206, 14)} fill={GOLD} />
        </g>
      ))}
      <path d={`M${cx - 150} 150 Q${cx - 75} 186 ${cx} 152 Q${cx + 75} 186 ${cx + 150} 150`} stroke="#5aa04a" strokeWidth={9} fill="none" strokeLinecap="round" />
      {[-120, -80, -40, 0, 40, 80, 120].map((dx, i) => {
        const t = (dx + 150) / 150
        const yy = t < 1 ? 150 + 18 * Math.sin(Math.PI * t) : 150 + 18 * Math.sin(Math.PI * (t - 1))
        return <circle key={dx} cx={cx + dx} cy={yy + 4} r={6} fill={['#ff8cc0', '#ffd34d', '#ffffff'][i % 3]} stroke="#d0708a" strokeWidth={1.2} />
      })}
    </g>
  )
}

const ROOM_SKY = { day: ['#8fd3ff', '#e2f6ff'], dusk: ['#ff9a7a', '#ffd9a0'], night: ['#18163f', '#3b3486'] } as const

/**
 * Queen Esther's room in the palace: soft pink walls with a band of tiles, an arched window looking out over the city
 * (by day, at sunset or at night, `time`: at night its houses' windows glow), its pink curtains tied back, a tall
 * golden lamp at `lamp` (lit after dark), and a floor of soft tiles with a round rug. `win`: the window's middle.
 */
function QueensRoom({ time = 'day', win = 600, lamp = 120 }: { time?: 'day' | 'dusk' | 'night'; win?: number; lamp?: number | null }) {
  const id = uidOf(useId())
  const W = { x: win - 78, y: 70, w: 156, h: 196 }
  const winPath = `M${W.x} ${W.y + W.h} V${W.y + 78} A78 78 0 0 1 ${W.x + W.w} ${W.y + 78} V${W.y + W.h} Z`
  const night = time === 'night'
  const [skyTop, skyBottom] = ROOM_SKY[time]
  const wallColor = night ? '#cdb6d4' : time === 'dusk' ? '#f4d9df' : '#f6e4ee'
  const roofs = night ? '#5a4a6a' : time === 'dusk' ? '#d9a882' : '#e8cf9a'
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skyTop} /><stop offset="1" stopColor={skyBottom} /></linearGradient>
        <clipPath id={`${id}w`}><path d={winPath} /></clipPath>
      </defs>
      <rect width={800} height={344} fill={wallColor} />
      <rect y={0} width={800} height={26} fill={night ? '#8f6fa8' : '#d98fb4'} />
      {Array.from({ length: 25 }, (_, i) => <path key={i} d={sparkle(16 + i * 32, 13, 7)} fill={GOLD} />)}
      <rect y={26} width={800} height={5} fill={GOLD} />
      <rect y={300} width={800} height={44} fill={night ? '#b79cc2' : '#efcfdc'} />
      <rect y={298} width={800} height={5} fill={GOLD} opacity={0.8} />
      {/* the floor and the rug */}
      <rect y={344} width={800} height={106} fill={night ? '#c9b0bf' : '#f1ddd4'} />
      {[366, 396, 432].map((fy, r) => (
        <g key={fy} stroke={night ? '#b79aac' : '#e2c5bb'} strokeWidth={2}>
          <path d={`M0 ${fy} H800`} />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 100 + (r % 2) * 50} ${fy - (r ? 30 : 22)} V${fy}`} />)}
        </g>
      ))}
      <ellipse cx={400} cy={418} rx={250} ry={30} fill={night ? '#a8587a' : '#e07a9c'} stroke={GOLD} strokeWidth={4} />
      <ellipse cx={400} cy={418} rx={214} ry={20} fill="none" stroke="#ffd9e6" strokeWidth={2.5} strokeDasharray="7 6" />
      {/* the window and what it looks out on */}
      <g clipPath={`url(#${id}w)`}>
        <rect x={W.x} y={W.y} width={W.w} height={W.h} fill={`url(#${id}s)`} />
        {night && <Moon x={W.x + 104} y={W.y + 62} s={0.5} />}
        {night && [[0.2, 0.3], [0.32, 0.12], [0.7, 0.18], [0.12, 0.55], [0.86, 0.46]].map(([fx, fy], i) => (
          <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={sparkle(W.x + W.w * fx, W.y + W.h * fy, 4)} fill="#fff8d0" />
        ))}
        {time === 'dusk' && <circle cx={W.x + 50} cy={W.y + 150} r={26} fill="#ffcf5a" stroke="#f0a020" strokeWidth={2} />}
        {time === 'day' && <ellipse cx={W.x + 60} cy={W.y + 50} rx={30} ry={10} fill="#fff" opacity={0.9} />}
        {[[0, 150, 44], [40, 162, 36], [76, 146, 40], [112, 158, 38], [146, 150, 36]].map(([dx, top, w], i) => (
          <g key={i}>
            <rect x={W.x + dx - 6} y={W.y + top} width={w} height={W.h - top} fill={i % 2 ? darken(roofs, 0.06) : roofs} />
            <rect x={W.x + dx + w / 2 - 10} y={W.y + top + 12} width={8} height={9} fill={night ? '#ffd970' : darken(roofs, 0.3)} />
          </g>
        ))}
        <path d={`M${W.x + 128} ${W.y + 150} Q${W.x + 132} ${W.y + 118} ${W.x + 126} ${W.y + 96}`} stroke={night ? '#3a3050' : '#8a6a3a'} strokeWidth={4} fill="none" />
        {[-50, -10, 30].map((a) => <path key={a} d={`M${W.x + 126} ${W.y + 96} q14 -8 26 4 q-14 -2 -26 -4 Z`} fill={night ? '#3f4a52' : '#4fae6a'} transform={`rotate(${a} ${W.x + 126} ${W.y + 96})`} />)}
        {[150, 210].map((a) => <path key={a} d={`M${W.x + 126} ${W.y + 96} q14 -8 26 4 q-14 -2 -26 -4 Z`} fill={night ? '#3f4a52' : '#4fae6a'} transform={`rotate(${a} ${W.x + 126} ${W.y + 96})`} />)}
      </g>
      <path d={winPath} fill="none" stroke="#e8c9a0" strokeWidth={10} />
      <path d={`M${W.x - 7} ${W.y + W.h} V${W.y + 78} A85 85 0 0 1 ${W.x + W.w + 7} ${W.y + 78} V${W.y + W.h}`} fill="none" stroke={GOLD} strokeWidth={2.5} />
      <rect x={W.x - 14} y={W.y + W.h - 4} width={W.w + 28} height={12} rx={4} fill="#f2dcae" stroke="#c9a46a" strokeWidth={2.2} />
      {/* its pink curtains, tied back */}
      <Hanging k={{ a: W.x - 34, b: W.x + 30, top: 56, tie: [W.x - 18, 214], tw: 11, c: W.x - 34, d: W.x + 4, bottom: 342 }} n={6} a="#f59ac0" b="#ffc6dc" line="#c2477e" side={-1} />
      <Hanging k={{ a: W.x + W.w - 30, b: W.x + W.w + 34, top: 56, tie: [W.x + W.w + 18, 214], tw: 11, c: W.x + W.w - 4, d: W.x + W.w + 34, bottom: 342 }} n={6} a="#f59ac0" b="#ffc6dc" line="#c2477e" />
      <Rod x0={W.x - 44} x1={W.x + W.w + 44} y={52} />
      {/* the tall golden lamp */}
      {lamp !== null && (
        <g>
          {time !== 'day' && <Glow x={lamp} y={214} r={110} color="#ffe2a0" />}
          <path d={`M${lamp - 26} 432 Q${lamp} 414 ${lamp + 26} 432 Z`} fill={GOLD} stroke={GOLD_INK} strokeWidth={2} strokeLinejoin="round" />
          <rect x={lamp - 4} y={236} width={8} height={186} rx={3} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.8} />
          {[300, 360].map((ky) => <ellipse key={ky} cx={lamp} cy={ky} rx={9} ry={5} fill="#f8d96a" stroke={GOLD_INK} strokeWidth={1.6} />)}
          <path d={`M${lamp - 22} 230 Q${lamp} 248 ${lamp + 22} 230 Z`} fill="#f8d96a" stroke={GOLD_INK} strokeWidth={2} strokeLinejoin="round" />
          {time !== 'day' && <path d={`M${lamp} 202 Q${lamp - 9} 218 ${lamp} 228 Q${lamp + 9} 218 ${lamp} 202 Z`} fill="#ffb347" stroke="#f08a20" strokeWidth={1.4} />}
          {time !== 'day' && <path d={`M${lamp} 212 Q${lamp - 4} 220 ${lamp} 226 Q${lamp + 4} 220 ${lamp} 212 Z`} fill="#fff3b0" />}
        </g>
      )}
      {night && <rect width={800} height={450} fill="#2a2050" opacity={0.08} />}
    </g>
  )
}

/** The king's palace far away on its hill: pale walls and towers with a blue band, and a gate. (x, y): the middle of its foot. */
function FarPalace({ x, y }: { x: number; y: number }) {
  const wall = '#f4e6c6', line = '#d8c296'
  return (
    <g>
      {[-92, 62].map((dx) => (
        <g key={dx}>
          <rect x={x + dx} y={y - 74} width={30} height={74} fill={wall} stroke={line} strokeWidth={2} />
          {[0, 1, 2].map((i) => <rect key={i} x={x + dx + 1 + i * 10} y={y - 81} width={7} height={8} fill={wall} stroke={line} strokeWidth={1.6} />)}
        </g>
      ))}
      <rect x={x - 62} y={y - 52} width={124} height={52} fill={wall} stroke={line} strokeWidth={2} />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={x - 60 + i * 16} y={y - 58} width={9} height={7} fill={wall} stroke={line} strokeWidth={1.6} />)}
      <rect x={x - 92} y={y - 44} width={184} height={6} fill="#8fb0de" />
      <path d={`M${x - 13} ${y} V${y - 18} A13 13 0 0 1 ${x + 13} ${y - 18} V${y} Z`} fill="#9ab8e0" stroke="#7a98c4" strokeWidth={1.6} />
      <path d={`M${x - 77} ${y - 74} V${y - 108} M${x + 77} ${y - 74} V${y - 108}`} stroke="#b89a6a" strokeWidth={1.6} />
      <path d={`M${x - 77} ${y - 108} l14 4 l-14 4 Z M${x + 77} ${y - 108} l14 4 l-14 4 Z`} fill="#c0607a" />
    </g>
  )
}

/** A street in the city of Susa: sandy ground, and the king's palace far away on its hill (on the left). */
function Street() {
  return (
    <g>
      <path d="M0 252 Q90 226 230 216 Q380 210 500 306 L0 320 Z" fill="#e8d3a4" />
      <FarPalace x={236} y={222} />
      <path d="M0 304 Q200 292 400 302 T800 296 L800 450 L0 450 Z" fill="#ecd3a0" />
      <path d="M0 376 Q240 360 480 376 T800 370 L800 450 L0 450 Z" fill="#e2c48e" />
      {[[60, 404], [210, 430], [520, 420], [740, 410]].map(([px, py], i) => <ellipse key={i} cx={px} cy={py} rx={10} ry={4} fill="#d4b47a" />)}
    </g>
  )
}

/** A pot of flowers by a door. (x, y): the middle of its foot. */
function FlowerPot({ x, y, color = '#ff8cc0' }: { x: number; y: number; color?: string }) {
  return (
    <g>
      {[[-9, -40], [0, -48], [9, -38]].map(([dx, dy], i) => (
        <g key={i}>
          <path d={`M${x} ${y - 22} L${x + dx} ${y + dy + 4}`} stroke="#4f9a4a" strokeWidth={2.5} />
          <circle cx={x + dx} cy={y + dy} r={6} fill={i === 1 ? '#ffd34d' : color} stroke={ink(i === 1 ? '#ffd34d' : color)} strokeWidth={1.5} />
        </g>
      ))}
      <path d={`M${x - 14} ${y - 24} L${x + 14} ${y - 24} L${x + 10} ${y} L${x - 10} ${y} Z`} fill="#d9824a" stroke="#a85a2a" strokeWidth={2.2} strokeLinejoin="round" />
    </g>
  )
}

/** The low table for Esther's dinners, with a white cloth edged with gold hanging in front. Its top is at y, from x0 to x1; `children` sit on it. */
function DinnerTable({ x0 = 110, x1 = 690, y = 372, children }: { x0?: number; x1?: number; y?: number; children?: ReactNode }) {
  const n = 8, w = (x1 - x0) / n
  // (the cloth's scalloped hem, right to left; and its gold trim a little above it, left to right)
  const hem = Array.from({ length: n }, (_, i) => `Q${f1(x1 - w * (i + 0.5))} ${y + 58} ${f1(x1 - w * (i + 1))} ${y + 48}`).join(' ')
  const trim = Array.from({ length: n }, (_, i) => `Q${f1(x0 + w * (i + 0.5))} ${y + 53} ${f1(x0 + w * (i + 1))} ${y + 43}`).join(' ')
  return (
    <g>
      <rect x={x0 - 6} y={y - 8} width={x1 - x0 + 12} height={14} rx={5} fill="#b07a44" stroke="#7a4a24" strokeWidth={2.4} />
      {children}
      <path d={`M${x0} ${y + 2} H${x1} L${x1} ${y + 48} ${hem} Z`} fill="#fbf7ee" stroke="#d8cdb8" strokeWidth={2.4} strokeLinejoin="round" />
      <path d={`M${x0} ${y + 43} ${trim}`} fill="none" stroke={GOLD} strokeWidth={3.5} />
      <path d={`M${x0 + 4} ${y + 12} H${x1 - 4}`} stroke={PINK} strokeWidth={4} />
    </g>
  )
}

/** What a king on his throne looks like in a thought: the king seated on his golden throne. (x, y): the throne's foot. */
function KingOnThrone({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g>
      <Throne x={x} y={y} s={s} />
      <SittingOnRock x={x} y={y} s={s} look={XERXES} pose="hold"><BeardCurls /><KingCrown /></SittingOnRock>
    </g>
  )
}

/** Little curves of whispering between two heads (from x0 to x1, at y). */
const Whisper = ({ x0, x1, y }: { x0: number; x1: number; y: number }) => (
  <g className="pa-twinkle" fill="none" strokeLinecap="round" stroke="#8a6a4a" strokeWidth={2.4}>
    {[0.3, 0.5, 0.7].map((t, i) => <path key={t} d={`M${f1(x0 + (x1 - x0) * t)} ${y - 6 - i} q4 6 0 ${12 + 2 * i}`} />)}
  </g>
)

/** Little curves of sound going into someone's ear at (x, y), coming from the left. */
const Hearing = ({ x, y }: { x: number; y: number }) => (
  <g className="pa-twinkle" fill="none" strokeLinecap="round">
    {[10, 18, 26].map((r) => (
      <g key={r}>
        <path d={`M${x - r * 0.6} ${y - r * 0.8} Q${x - r * 1.15} ${y} ${x - r * 0.6} ${y + r * 0.8}`} stroke="#8a5a3a" strokeWidth={5.5} opacity={0.3} />
        <path d={`M${x - r * 0.6} ${y - r * 0.8} Q${x - r * 1.15} ${y} ${x - r * 0.6} ${y + r * 0.8}`} stroke="#ffffff" strokeWidth={3} />
      </g>
    ))}
  </g>
)

// ---------- The pages ----------

// 1. "Long ago, there was a girl named Esther. She had no mom or dad, so her big cousin Mordecai took care of her. He
// loved her like his very own daughter." In the city, by their little house: Mordecai with his arm round little Esther,
// and Esther hugging him; the king's palace far away on its hill.
const Page1 = () => {
  const mx = 384, my = 432, ms = 1.12 // Mordecai
  const ex = 444, ey = 436, ek = 1.12 * 0.74 // little Esther (a child)
  const shoulder: Pt = [ex + 20 * ek, ey - 86 * ek] // her far shoulder (she faces left)
  return (
    <Scene sky="day" ground="none">
      <Street />
      <Palm x={92} y={344} s={1.0} />
      <Tap say="This is our little house." sfx="pop">
        <MudHouse x={652} y={344} w={230} h={136} door={-0.2} win={0.24} />
        <FlowerPot x={566} y={346} />
        <FlowerPot x={740} y={346} color="#c9a8ff" />
      </Tap>
      <Tap say="I will always take care of you, Esther." sfx="good">
        <Mordecai x={mx} y={my} s={ms} pose="hug-right" mood="joy" reach={[null, [(shoulder[0] - mx) / ms, (shoulder[1] - my) / ms]]} />
      </Tap>
      <Tap say="I love you, cousin Mordecai!" sfx="pop">
        <Esther girl x={ex} y={ey} s={1.12} facing="left" pose="hug-right" mood="joy" blinkDelay={0.8}
          reach={[null, [-(mx + 12 - ex) / ek, (my - 58 * ms - ey) / ek]]} />
      </Tap>
      <HandOn x={shoulder[0]} y={shoulder[1]} s={ms} look={MORDECAI} />
      <Tap say="Mordecai loves Esther, and God loves them both!" sfx="sparkle">
        <Heart x={414} y={232} s={1.2} />
        <Heart x={360} y={262} s={0.8} d={0.7} />
        <Heart x={470} y={266} s={0.8} d={1.4} />
      </Tap>
    </Scene>
  )
}

// 2. "Esther grew up to be kind and lovely. King Xerxes chose Esther to be his queen! He put a royal crown on her head."
// In the throne room: Esther, grown up, in her new crown and royal robe, the king welcoming her, and her two
// friends cheering.
const Page2 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <ThroneRoom throne={400} />
    <Tap say="Hooray for Queen Esther!" sfx="fanfare">
      <Figure x={124} y={428} s={0.98} look={HELPERS[0]} pose="arms-up" mood="joy" />
      <Figure x={678} y={428} s={0.98} look={HELPERS[1]} pose="arms-up" mood="joy" blinkDelay={1.1} />
    </Tap>
    <Tap say="Thank you, King Xerxes!" sfx="good">
      <Esther x={336} y={440} s={1.16} pose="hold" mood="joy" />
    </Tap>
    <Tap say="You will be my queen, Esther!" sfx="pop">
      <KingXerxes x={476} y={440} s={1.16} facing="left" pose="open" blinkDelay={0.8} />
    </Tap>
    <Tap say="A royal crown for Queen Esther!" sfx="sparkle">
      <circle cx={336} cy={268} r={30} fill="transparent" />
      <Sparkles spots={[[296, 252, 8], [376, 246, 9], [338, 212, 6], [282, 290, 5]]} />
    </Tap>
  </Scene>
)

// 3. "Mordecai worked at the king's gate. One day, he heard two men whispering a plan to hurt the king. He told Queen
// Esther, and she told the king. Good Mordecai saved the king!" At the king's gate: two cross men whisper; Mordecai
// hears them. Up in the tower's window, Esther tells the king.
const Page3 = () => {
  const cx = 470
  const [g0, g1] = DOORKEEPERS
  return (
    <Scene sky="day" ground="none">
      <KingsGate cx={cx} win={
        <Tap say="Thank you for telling me, Queen Esther!" sfx="good">
          <KingXerxes x={cx + 236} y={268} s={0.58} facing="left" mood="wow" blinkDelay={0.6} />
          <Esther x={cx + 186} y={268} s={0.58} pose="point" />
        </Tap>
      } />
      <Tap say="Psst, psst! Grumble, grumble." sfx="wobble">
        <Figure x={96} y={438} s={1.02} look={g0.look} mood="grumpy"><GuardHat color={g0.hat} /></Figure>
        <Figure x={170} y={438} s={1.02} look={g1.look} facing="left" pose="carry" mood="grumpy" blinkDelay={1.3}><GuardHat color={g1.hat} /></Figure>
        <Whisper x0={110} x1={156} y={326} />
      </Tap>
      <Tap say="Oh no! I must tell Queen Esther!" sfx="pop">
        <Mordecai x={322} y={438} s={1.1} facing="left" pose="carry" mood="wow" blinkDelay={0.4} />
      </Tap>
      <Hearing x={296} y={318} />
    </Scene>
  )
}

// 4. "There was a proud man named Haman. He wanted everyone to bow down to him. Everybody did, but not Mordecai!
// Mordecai bowed down only to God." At the king's gate: proud Haman, arms crossed; the king's servants bowing low;
// Mordecai standing tall with his hands together, looking up, in God's light.
const Page4 = () => (
  <Scene sky="day" ground="none">
    <KingsGate cx={400} />
    <Rays x={636} y={-40} r={460} n={14} color="#fff6b0" opacity={0.3} />
    <Glow x={636} y={250} r={150} color="#fff6c8" />
    <Tap say="Yes, Haman. Yes, Haman." sfx="pop">
      <Figure x={62} y={430} s={0.98} look={SERVANTS[0]} kneel />
      <Figure x={150} y={440} s={0.98} look={SERVANTS[1]} kneel blinkDelay={0.6} />
      <Figure x={452} y={442} s={0.98} look={SERVANTS[2]} kneel blinkDelay={1.2} />
    </Tap>
    <Tap say="Bow down to me! I am very, very important!" sfx="wobble">
      <Haman x={296} y={440} s={1.14} pose="cross" mood="grumpy" />
    </Tap>
    <Tap say="I bow down only to God." sfx="good">
      <LookingUp><Mordecai x={636} y={438} s={1.12} facing="left" pose="pray"><EyesUp /></Mordecai></LookingUp>
    </Tap>
  </Scene>
)

// 5. "Haman was so cross that he made a mean plan against Mordecai and all of God's people. Mordecai was very sad. He
// sent a message to Queen Esther: 'Please ask the king to help us!'" Haman holds up his plan, sealed; Mordecai,
// sad, gives his message to Esther's friend to take to her; Esther looks out of her window.
const Page5 = () => {
  const cx = 470
  const mx = 420, my = 438, ms = 1.1
  const a: Pt = [mx + 54 * ms, my - 90 * ms] // Mordecai's hand, holding one end of the message
  const b: Pt = [a[0] + 46, a[1] + 2] // and Esther's friend's hand, holding its other end
  const hx = 580, hy = 440, hs = 1.04
  return (
    <Scene sky="day" ground="none">
      <KingsGate cx={cx} win={
        <Tap say="Is that a message for me?" sfx="pop">
          <Esther x={cx + 210} y={268} s={0.58} pose="hold" mood="wow" />
        </Tap>
      } />
      <Tap say="Hmph! I am very cross with Mordecai!" sfx="wobble">
        <Haman x={128} y={442} s={1.12} pose="wave" mood="grumpy" item={<RolledScroll x={44} y={-136} s={1.35} angle={-24} seal />} />
      </Tap>
      <Tap say="Please take this message to Queen Esther." sfx="pop">
        <Mordecai x={mx} y={my} s={ms} pose="point" mood="sad" />
      </Tap>
      <Tap say="I will hurry to the queen!" sfx="good">
        <Figure x={hx} y={hy} s={hs} look={HELPERS[0]} facing="left" mood="sad" blinkDelay={0.9} reach={[null, [-(b[0] - hx) / hs, (b[1] - hy) / hs]]} />
      </Tap>
      <RolledScroll x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2} s={1.45} angle={2} />
      <HandOn x={a[0]} y={a[1]} s={ms} look={MORDECAI} />
      <HandOn x={b[0]} y={b[1]} s={hs} look={HELPERS[0]} />
    </Scene>
  )
}

// 6. "Esther read the message, and she was afraid. No one could go to see the king unless he called them! But maybe God
// made Esther queen for a time just like this." In her room at sunset: Esther holds the open message, worried; she
// thinks of the king on his throne. Her friend is beside her, and God's quiet light is all around her.
const Page6 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <QueensRoom time="dusk" win={640} lamp={84} />
    <Tap say="The king did not call for me." sfx="wobble">
      <ThoughtBubble x={226} y={104} w={250} h={150} tail={[[314, 238, 5], [296, 216, 7.5], [276, 192, 10]]}>
        <path d="M120 156 Q226 146 332 156 L320 166 Q226 158 132 166 Z" fill="#b8323b" opacity={0.85} />
        <KingOnThrone x={226} y={158} s={0.52} />
      </ThoughtBubble>
    </Tap>
    <Glow x={330} y={330} r={130} color="#fff3c8" />
    <Tap say="Oh my. What should I do?" sfx="pop">
      <Esther x={330} y={440} s={1.18} pose="present" mood="sad" item={<OpenScroll />} />
    </Tap>
    <Tap say="Mordecai is so sad, Queen Esther." sfx="pop">
      <Figure x={506} y={436} s={1.04} look={HELPERS[0]} facing="left" pose="pray" mood="sad" blinkDelay={1.1} />
    </Tap>
    <Tap say="God has a plan, Esther." sfx="sparkle">
      <Sparkles spots={[[250, 300, 7], [408, 290, 8], [240, 384, 5], [420, 372, 6], [330, 196, 5]]} />
    </Tap>
  </Scene>
)

// 7. "Esther was afraid to go and see the king. So she asked God's people to pray for her. For three days, Esther and
// her friends prayed to God, too." Night in her room: Esther and her two friends kneel and pray, in God's light; out of
// the window, the windows of God's people's houses glow.
const Page7 = () => (
  <Scene sky="night" ground="none" clouds={false}>
    <ShutEyes />
    <QueensRoom time="night" win={624} lamp={104} />
    <Rays x={400} y={-60} r={560} n={16} color="#fff3c0" opacity={0.24} />
    <Glow x={400} y={320} r={180} color="#fff3c8" />
    <Tap say="God's people are praying, too." sfx="sparkle"><rect x={546} y={70} width={156} height={196} fill="transparent" /></Tap>
    <Tap say="We are praying with you, Queen Esther." sfx="pop">
      <g className="dn-shut">
        <Kneel x={232} y={426} s={1.06} look={HELPERS[0]} />
        <Kneel x={568} y={426} s={1.06} look={HELPERS[1]} blinkDelay={0.8} />
      </g>
    </Tap>
    <Tap say="Dear God, please help me to be brave." sfx="good">
      <g className="dn-shut">
        <Kneel x={400} y={430} s={1.2} look={ESTHER}><RobeFront /><EstherFace /><EstherCrown /></Kneel>
      </g>
    </Tap>
    <Tap say="God hears every prayer." sfx="sparkle">
      <Heart x={400} y={214} s={1.1} />
      <Sparkles spots={[[330, 236, 6], [470, 230, 6], [400, 170, 5]]} />
    </Tap>
  </Scene>
)

// 8. "On the third day, Esther put on her royal robe and went to see the king. Would he be cross? No! He held out his
// golden scepter. That meant, 'Come in!'" The throne room: the king on his throne holds out his golden scepter, and
// Esther, in her royal robe, reaches up and touches its top.
const Page8 = () => {
  const kx = 552, ks = 1.12
  const hand: Pt = [kx - 54 * ks, DAIS + (14 - 90) * ks] // the king's hand (he faces left)
  const len = 100, ang = 158
  const tip: Pt = [hand[0] + len * Math.cos((ang * Math.PI) / 180), hand[1] + len * Math.sin((ang * Math.PI) / 180)]
  const ex = 338, ey = 440, es = 1.12
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <ThroneRoom throne={kx} s={ks} />
      <Tap say="Come in, Queen Esther!" sfx="good">
        <g transform={`translate(${2 * kx} 0) scale(-1 1)`}>
          <SittingOnRock x={kx} y={DAIS} s={ks} look={XERXES} pose="point" blinkDelay={0.5}><BeardCurls /><KingCrown /></SittingOnRock>
        </g>
      </Tap>
      <Tap say="The king's golden scepter!" sfx="sparkle">
        <g transform={`translate(${f1(hand[0])} ${f1(hand[1])}) rotate(${ang})`}><Scepter len={len} w={7} /></g>
        <HandOn x={hand[0]} y={hand[1]} s={ks} look={XERXES} />
      </Tap>
      <Tap say="Thank you, my king!" sfx="pop">
        <Esther x={ex} y={ey} s={es} pose="point" reach={[null, [(tip[0] - 9 - ex) / es, (tip[1] + 8 - ey) / es]]} />
      </Tap>
      <Sparkles spots={[[tip[0] - 4, tip[1] - 28, 8], [tip[0] + 26, tip[1] - 12, 6], [tip[0] - 30, tip[1] - 8, 5]]} />
    </Scene>
  )
}

/** The lanterns over Esther's dinner. */
const DinnerLanterns = () => (
  <g>
    {[[140, 130], [400, 104], [748, 132]].map(([x, y]) => <Lantern key={x} x={x} y={y} />)}
  </g>
)

/** The top of the dinner table, and where the diners sit (on cushions on the floor behind it). */
const TABLE = 392, SEAT = 414

// 9. "The king asked, 'What would you like, Queen Esther?' Esther said, 'Please come to my dinner, and bring Haman, too.'
// What a yummy dinner! Then she asked them to come back for another one." Esther's dinner at sunset: the king, Esther
// and proud Haman sit on cushions at her low table, set with grapes, bread, apples and honey.
const Page9 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    <QueensRoom time="dusk" win={590} lamp={null} />
    <DinnerLanterns />
    <Tap say="Yum! What a wonderful dinner!" sfx="pop">
      <Sitting x={226} y={SEAT} s={1.16} look={XERXES} pose="hold"><BeardCurls /><KingCrown /></Sitting>
    </Tap>
    <Tap say="Welcome! Please come back tomorrow, too." sfx="good">
      <Sitting x={400} y={SEAT} s={1.12} look={ESTHER} pose="wave" blinkDelay={0.7}><EstherFace /><EstherCrown /></Sitting>
    </Tap>
    <Tap say="Just me and the king! I am so important." sfx="wobble">
      <Sitting x={574} y={SEAT} s={1.14} look={HAMAN} pose="hold" blinkDelay={1.4}><ProudEyes /><HamanFace /><HamanHat /></Sitting>
    </Tap>
    <Tap say="Grapes, bread, and apples. Yum!" sfx="chomp">
      <DinnerTable y={TABLE}>
        <Goblet x={268} y={TABLE - 4} />
        <Emoji e="🍇" x={316} y={TABLE - 22} size={44} />
        <Emoji e="🍞" x={362} y={TABLE - 18} size={40} />
        <Goblet x={440} y={TABLE - 4} />
        <Emoji e="🍎" x={478} y={TABLE - 17} size={34} />
        <Emoji e="🍎" x={508} y={TABLE - 16} size={32} />
        <Goblet x={616} y={TABLE - 4} />
        <Emoji e="🍯" x={656} y={TABLE - 20} size={36} />
      </DinnerTable>
    </Tap>
  </Scene>
)

// 10. "At the next dinner, Esther told the king the truth. 'Haman made a mean plan against my people, God's people.
// Please save us!'" The second dinner, at night: Esther stands up and points to Haman; the king is surprised, and Haman
// is caught out ("uh oh!").
const Page10 = () => (
  <Scene sky="night" ground="none" clouds={false}>
    <QueensRoom time="night" win={590} lamp={null} />
    <DinnerLanterns />
    <Tap say="A mean plan? I did not know!" sfx="wobble">
      <Sitting x={214} y={SEAT} s={1.16} look={XERXES} pose="hold"><BeardCurls /><WowFace look={XERXES} /><KingCrown /></Sitting>
    </Tap>
    <Tap say="Uh oh!" sfx="wobble">
      <Sitting x={590} y={SEAT} s={1.14} look={HAMAN} pose="hold" blinkDelay={0.6}><WowFace look={HAMAN} brows={-121.5} /><HamanFace /><HamanHat /><SweatDrop /></Sitting>
    </Tap>
    <Tap say="Please save my people, God's people!" sfx="good">
      <Esther x={402} y={424} s={1.24} pose="point" mood="sad" />
    </Tap>
    <DinnerTable y={TABLE}>
      <Goblet x={258} y={TABLE - 4} />
      <Emoji e="🍞" x={312} y={TABLE - 18} size={40} />
      <Emoji e="🍇" x={480} y={TABLE - 22} size={44} />
      <Goblet x={532} y={TABLE - 4} />
      <Goblet x={622} y={TABLE - 4} />
      <Emoji e="🍎" x={664} y={TABLE - 17} size={34} />
    </DinnerTable>
  </Scene>
)

// 11. "The king listened to Queen Esther. He made a new rule to keep God's people safe, and he made good Mordecai his
// top helper. God's people were saved! Hooray!" At the gate, hung with banners: the king holds up his new rule, with
// Esther and Mordecai (in the king's royal clothes), and God's people cheer.
const Page11 = () => (
  <Scene sky="day" ground="none">
    <KingsGate cx={400} flags />
    <Tap say="Here is my new rule. God's people will be safe!" sfx="fanfare">
      <KingXerxes x={400} y={344} s={0.92} pose="wave" item={<RolledScroll x={44} y={-138} s={1.45} angle={-24} seal />} />
    </Tap>
    <Tap say="God took care of us!" sfx="good">
      <Esther x={310} y={346} s={0.92} pose="arms-up" mood="joy" blinkDelay={0.7} />
    </Tap>
    <Tap say="Now I am the king's top helper. Thank You, God!" sfx="good">
      <Mordecai royal x={492} y={346} s={0.92} pose="wave" mood="joy" blinkDelay={1.3} />
    </Tap>
    <Tap say="Hooray! We are safe!" sfx="fanfare">
      <Figure x={74} y={440} s={0.98} look={GODS_PEOPLE[0]} pose="arms-up" mood="joy" />
      <Figure x={146} y={448} s={1.0} look={GODS_PEOPLE[2]} pose="wave" mood="joy" blinkDelay={0.6} />
      <Figure x={214} y={442} s={0.98} look={GODS_PEOPLE[1]} pose="arms-up" mood="joy" blinkDelay={1.2} />
      <Figure x={588} y={442} s={0.98} look={GODS_PEOPLE[5]} pose="open" mood="joy" blinkDelay={0.3} />
      <Figure x={654} y={448} s={1.0} look={GODS_PEOPLE[4]} pose="arms-up" mood="joy" blinkDelay={0.9} />
      <Figure x={724} y={440} s={0.98} look={GODS_PEOPLE[3]} pose="arms-up" mood="joy" blinkDelay={1.6} />
    </Tap>
    <Sparkles spots={[[300, 60, 7], [500, 50, 8], [400, 30, 6], [120, 110, 5], [690, 100, 6]]} />
  </Scene>
)

/** Strings of little lanterns across the street, for the party. */
const LanternStrings = () => (
  <g>
    {[[-20, 70, 420, 60], [380, 60, 820, 76]].map(([x0, y0, x1, y1], k) => {
      const mid = [(x0 + x1) / 2, (y0 + y1) / 2 + 46]
      const at = (t: number): Pt => [(1 - t) ** 2 * x0 + 2 * t * (1 - t) * mid[0] + t * t * x1, (1 - t) ** 2 * y0 + 2 * t * (1 - t) * mid[1] + t * t * y1]
      return (
        <g key={k}>
          <path d={`M${x0} ${y0} Q${mid[0]} ${mid[1]} ${x1} ${y1}`} stroke="#6a4a3a" strokeWidth={2} fill="none" />
          {[0.12, 0.27, 0.42, 0.57, 0.72, 0.87].map((t, i) => {
            const [lx, ly] = at(t)
            const c = ['#ff8cc0', '#ffd34d', '#7fd0ff', '#b48be0', '#8fe08a', '#ffa64d'][(i + k) % 6]
            return (
              <g key={t}>
                <circle cx={lx} cy={ly + 13} r={16} fill={c} opacity={0.3} />
                <rect x={lx - 3} y={ly} width={6} height={4} fill="#6a4a3a" />
                <ellipse cx={lx} cy={ly + 13} rx={9} ry={11} fill={c} stroke={darken(c, 0.3)} strokeWidth={1.6} />
                <path d={`M${lx - 9} ${ly + 13} H${lx + 9}`} stroke={darken(c, 0.25)} strokeWidth={1.2} />
              </g>
            )
          })}
        </g>
      )
    })}
  </g>
)

// 12. "God's people had a great big happy party, called Purim! They shared yummy food and gave presents. God took care
// of His people all along, and He takes care of you, too!" Evening in the city, with lanterns: Esther and Mordecai
// dance, children shake tambourines, a mom gives grandma a basket of food, and a table is full of treats.
const Page12 = () => (
  <Scene sky="dusk" ground="none" clouds={false}>
    {[[90, 70, 4], [700, 50, 5], [520, 40, 3.5], [250, 30, 3.5]].map(([sx, sy, r], i) => (
      <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.45}s` }} d={sparkle(sx, sy, r)} fill="#fff8d0" />
    ))}
    <path d="M0 304 Q200 292 400 302 T800 296 L800 450 L0 450 Z" fill="#e6c894" />
    <path d="M0 380 Q240 364 480 380 T800 374 L800 450 L0 450 Z" fill="#dcb980" />
    <MudHouse x={110} y={318} w={170} h={110} door={0.2} win={-0.22} />
    <MudHouse x={400} y={306} w={150} h={96} door={-0.15} win={0.25} />
    <MudHouse x={690} y={318} w={180} h={116} door={0.2} win={-0.24} />
    <LanternStrings />
    <Tap say="Cookies and grapes to share. Yum!" sfx="chomp">
      <rect x={636} y={378} width={10} height={52} fill="#9a6a3a" />
      <rect x={752} y={378} width={10} height={52} fill="#9a6a3a" />
      <rect x={620} y={368} width={158} height={14} rx={5} fill="#b07a44" stroke="#7a4a24" strokeWidth={2.4} />
      <Emoji e="🍪" x={652} y={350} size={32} />
      <Emoji e="🍪" x={676} y={354} size={28} />
      <Emoji e="🍇" x={712} y={346} size={40} />
      <Emoji e="🍯" x={752} y={348} size={36} />
    </Tap>
    <Tap say="A present of yummy food for you!" sfx="pop">
      <Figure x={84} y={442} s={1.0} look={GODS_PEOPLE[1]} pose="present" mood="joy" item={<g transform="translate(0 -50) scale(0.5)"><Emoji e="🧺" x={0} y={0} size={100} /></g>} />
      <Figure x={164} y={444} s={1.0} look={GODS_PEOPLE[3]} facing="left" pose="open" mood="joy" blinkDelay={0.7} />
    </Tap>
    <Tap say="Happy Purim! Let's thank God!" sfx="good">
      <Esther x={316} y={442} s={1.06} pose="arms-up" mood="joy" />
      <Mordecai royal x={430} y={442} s={1.06} pose="arms-up" mood="joy" blinkDelay={1.1} />
    </Tap>
    <Tap say="Shake, shake! Let's dance!" sfx="pop">
      <Figure x={536} y={446} s={1.04} look={GODS_PEOPLE[2]} pose="arms-up" mood="joy" blinkDelay={0.4} />
      <Emoji e="" art="tambourine" x={536 + 42 * 1.04 * 0.74} y={446 - 130 * 1.04 * 0.74} size={46} />
      <Figure x={596} y={448} s={1.04} look={GODS_PEOPLE[4]} pose="wave" mood="joy" blinkDelay={1.6} />
    </Tap>
    <MusicNote x={250} y={200} s={1.1} color="#ffe680" />
    <MusicNote x={540} y={190} s={1.0} color="#ffd0e8" double />
    <MusicNote x={386} y={150} s={0.9} color="#c8f0ff" />
  </Scene>
)

export const ESTHER_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
