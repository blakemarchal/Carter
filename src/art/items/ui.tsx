// Things the game's own buttons and menus show (the map's tools, a Pal's home, the kitchen, the sing-along), drawn
// so they look the same on every device instead of each device's emoji. Each draws in a 100 x 100 box.
import type { Item } from './types'
import { groundShadow, ink, lighten, Shine, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** A microphone (the sing-along). */
function Microphone() {
  const head = useShade('#b8b2c8', 0.4, 0.2)
  const body = '#e2468f'
  return (
    <g {...ROUND}>
      <defs>{head.def}</defs>
      <path d="M44 56 L36 90 Q50 96 64 90 L56 56 Z" fill={body} stroke={ink(body)} strokeWidth={3} />
      <rect x={37} y={50} width={26} height={9} rx={3} fill={lighten(body, 0.25)} stroke={ink(body)} strokeWidth={2.6} />
      <circle cx={50} cy={31} r={22} fill={head.fill} stroke={ink('#b8b2c8')} strokeWidth={3} />
      <path d="M33 25 Q50 19 67 25 M30 34 Q50 29 70 34 M34 43 Q50 39 66 43" stroke={ink('#b8b2c8')} strokeWidth={1.8} fill="none" opacity={0.7} />
      <Shine x={41} y={22} rx={5} ry={3} rot={-25} />
    </g>
  )
}

/** A gear (the Parent Corner). */
function Gear() {
  const c = '#9a90b0'
  const metal = useShade(c, 0.35, 0.2)
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180
    return <rect key={i} x={44} y={10} width={12} height={16} rx={3} fill={metal.fill} stroke={ink(c)} strokeWidth={2.6} transform={`rotate(${(a * 180) / Math.PI} 50 50)`} />
  })
  return (
    <g {...ROUND}>
      <defs>{metal.def}</defs>
      {teeth}
      <circle cx={50} cy={50} r={29} fill={metal.fill} stroke={ink(c)} strokeWidth={3} />
      <circle cx={50} cy={50} r={11} fill="#fff8fc" stroke={ink(c)} strokeWidth={3} />
      <Shine x={40} y={37} rx={7} ry={3.5} rot={-35} />
    </g>
  )
}

/** Music notes with a line through them (music off). */
function MusicOff() {
  const c = '#8f86a8'
  return (
    <g {...ROUND}>
      <path d="M38 70 L38 26 L74 18 L74 62" fill="none" stroke={ink(c)} strokeWidth={6} />
      <path d="M38 26 L74 18 L74 30 L38 38 Z" fill={c} stroke={ink(c)} strokeWidth={2.6} />
      <ellipse cx={30} cy={72} rx={11} ry={8.5} fill={c} stroke={ink(c)} strokeWidth={2.6} transform="rotate(-18 30 72)" />
      <ellipse cx={66} cy={64} rx={11} ry={8.5} fill={c} stroke={ink(c)} strokeWidth={2.6} transform="rotate(-18 66 64)" />
      <path d="M16 18 L84 86" stroke="#e8505b" strokeWidth={8} />
    </g>
  )
}

/** A padlock (not open yet). */
function Lock() {
  const c = '#f2b43c'
  const body = useShade(c, 0.35, 0.22)
  return (
    <g {...ROUND}>
      <defs>{body.def}</defs>
      <path d="M32 46 L32 32 Q32 14 50 14 Q68 14 68 32 L68 46" fill="none" stroke="#9a90b0" strokeWidth={9} />
      <path d="M32 46 L32 32 Q32 14 50 14 Q68 14 68 32 L68 46" fill="none" stroke={ink('#9a90b0')} strokeWidth={2.4} opacity={0.5} />
      <rect x={22} y={44} width={56} height={44} rx={9} fill={body.fill} stroke={ink(c)} strokeWidth={3} />
      <circle cx={50} cy={62} r={6} fill={ink(c)} />
      <path d="M50 64 L50 74" stroke={ink(c)} strokeWidth={5} />
      <Shine x={33} y={54} rx={3} ry={8} rot={0} />
    </g>
  )
}

/** A big friendly arrow (tap here): pointing up, or down at the thing to tap. */
function TapArrow({ down = false }: { down?: boolean }) {
  const c = '#ff6fae'
  const s = useShade(c, 0.35, 0.18)
  return (
    <g {...ROUND} transform={down ? 'rotate(180 50 50)' : undefined}>
      <defs>{s.def}</defs>
      <path d="M50 8 L86 46 L64 46 L64 90 L36 90 L36 46 L14 46 Z" fill={s.fill} stroke={ink(c)} strokeWidth={4} />
      <path d="M50 18 L74 42" stroke="#fff" strokeWidth={4} opacity={0.5} />
    </g>
  )
}
const TapUp = () => <TapArrow />
const TapDown = () => <TapArrow down />

/** A hair bow. */
function Bow() {
  const c = '#ff6fae'
  const ribbon = useShade(c, 0.35, 0.2)
  return (
    <g {...ROUND}>
      <defs>{ribbon.def}</defs>
      <path d="M46 54 L34 86 L44 82 L48 92 L52 58 Z M54 54 L66 86 L56 82 L52 92 L48 58 Z" fill={ribbon.fill} stroke={ink(c)} strokeWidth={2.8} />
      <path d="M50 46 Q30 22 14 30 Q6 46 18 60 Q32 66 50 52 Z" fill={ribbon.fill} stroke={ink(c)} strokeWidth={3} />
      <path d="M50 46 Q70 22 86 30 Q94 46 82 60 Q68 66 50 52 Z" fill={ribbon.fill} stroke={ink(c)} strokeWidth={3} />
      <rect x={42} y={41} width={16} height={17} rx={6} fill={lighten(c, 0.15)} stroke={ink(c)} strokeWidth={3} />
      <Shine x={24} y={39} rx={6} ry={3} rot={-30} />
      <Shine x={74} y={39} rx={6} ry={3} rot={30} />
    </g>
  )
}

/** A wide straw sun hat with a ribbon. */
function SunHat() {
  const straw = '#f2cf7a'
  const s = useShade(straw, 0.3, 0.2)
  const band = '#ff8fc7'
  return (
    <g {...ROUND}>
      <defs>{s.def}</defs>
      <ellipse {...groundShadow(50, 84, 40)} />
      <ellipse cx={50} cy={66} rx={45} ry={16} fill={s.fill} stroke={ink(straw)} strokeWidth={3} />
      <path d="M26 64 Q24 30 50 28 Q76 30 74 64 Q50 72 26 64 Z" fill={s.fill} stroke={ink(straw)} strokeWidth={3} />
      <path d="M26.6 54 Q50 62 73.4 54 L73.8 62 Q50 70 26.2 62 Z" fill={band} stroke={ink(band)} strokeWidth={2.2} />
      <circle cx={70} cy={58} r={6} fill="#fff" stroke={ink(band)} strokeWidth={2} />
      <circle cx={70} cy={58} r={2.5} fill="#ffd34d" />
      <Shine x={38} y={38} rx={7} ry={3.5} rot={-25} />
    </g>
  )
}

/** A baseball cap. */
function Cap() {
  const c = '#5aa9ff'
  const s = useShade(c, 0.35, 0.2)
  return (
    <g {...ROUND}>
      <defs>{s.def}</defs>
      <ellipse {...groundShadow(52, 80, 36)} />
      <path d="M50 70 Q76 66 94 76 Q80 84 56 80 Z" fill={lighten(c, 0.1)} stroke={ink(c)} strokeWidth={3} />
      <path d="M14 72 Q12 28 48 24 Q80 24 82 66 Q50 76 14 72 Z" fill={s.fill} stroke={ink(c)} strokeWidth={3} />
      <path d="M48 24 L46 72 M30 32 Q38 52 34 72 M66 30 Q62 50 66 68" stroke={ink(c)} strokeWidth={1.8} fill="none" opacity={0.55} />
      <circle cx={48} cy={24} r={4.5} fill={lighten(c, 0.2)} stroke={ink(c)} strokeWidth={2.2} />
      <Shine x={30} y={38} rx={7} ry={3.5} rot={-35} />
    </g>
  )
}

/** A striped party hat with a pom-pom. */
function PartyHat() {
  const c = '#9b8cff'
  const s = useShade(c, 0.35, 0.2)
  return (
    <g {...ROUND}>
      <defs>{s.def}</defs>
      <ellipse {...groundShadow(50, 90, 30)} />
      <path d="M50 12 L80 84 Q50 94 20 84 Z" fill={s.fill} stroke={ink(c)} strokeWidth={3} />
      <path d="M44 27 L56 27 M38 43 L62 43 M32 59 L68 59 M26 75 L74 75" stroke="#ffd34d" strokeWidth={5} />
      <path d="M20 84 Q50 94 80 84" stroke="#ff6fae" strokeWidth={6} fill="none" />
      <circle cx={50} cy={12} r={8} fill="#ff6fae" stroke={ink('#ff6fae')} strokeWidth={2.6} />
      <Shine x={42} y={50} rx={2.5} ry={9} rot={20} />
    </g>
  )
}

/** A crayon (coloring). */
function Crayon() {
  const c = '#ff6fae'
  const s = useShade(c, 0.35, 0.2)
  return (
    <g {...ROUND} transform="rotate(35 50 50)">
      <defs>{s.def}</defs>
      <path d="M38 22 L50 4 L62 22 Z" fill={c} stroke={ink(c)} strokeWidth={2.8} />
      <rect x={38} y={22} width={24} height={70} rx={4} fill={s.fill} stroke={ink(c)} strokeWidth={3} />
      <rect x={38} y={36} width={24} height={36} fill="#fff" opacity={0.85} stroke={ink(c)} strokeWidth={2.4} />
      <path d="M42 46 Q50 42 58 46 M42 56 Q50 52 58 56" stroke={c} strokeWidth={2.4} fill="none" />
    </g>
  )
}

/** An empty heart (a heart that's been used up). */
function HeartEmpty() {
  const c = '#d6cfe0'
  return (
    <g {...ROUND}>
      <path d="M50 86 C24 68 10 52 12 34 C14 18 34 12 50 28 C66 12 86 18 88 34 C90 52 76 68 50 86 Z" fill="#fff" stroke={ink(c)} strokeWidth={4} />
      <path d="M50 74 C32 60 22 50 23 37 C24 27 38 23 50 36" fill="none" stroke={c} strokeWidth={3} opacity={0.6} />
    </g>
  )
}

/** A candle with a flame (This Little Light of Mine). */
function Candle() {
  const wax = '#fff3e0'
  const s = useShade('#ffe6c2', 0.4, 0.15)
  return (
    <g {...ROUND}>
      <defs>{s.def}</defs>
      <ellipse {...groundShadow(50, 92, 26)} />
      <ellipse cx={50} cy={88} rx={26} ry={6} fill="#c9a26b" stroke={ink('#c9a26b')} strokeWidth={2.6} />
      <rect x={36} y={38} width={28} height={50} rx={5} fill={s.fill} stroke={ink('#e8c79a')} strokeWidth={3} />
      <path d="M40 42 Q42 52 40 58" stroke={wax} strokeWidth={3} fill="none" />
      <path d="M50 38 L50 30" stroke="#5b4a3a" strokeWidth={2.6} />
      <path d="M50 6 Q62 20 58 28 Q54 34 50 34 Q46 34 42 28 Q38 20 50 6 Z" fill="#ffb347" stroke="#e8743b" strokeWidth={2.4} />
      <path d="M50 16 Q55 24 52 29 Q50 31 48 29 Q45 24 50 16 Z" fill="#fff3a6" />
    </g>
  )
}

/** A wooden spoon (stir). */
function Spoon() {
  const c = '#d9a066'
  const s = useShade(c, 0.3, 0.2)
  return (
    <g {...ROUND} transform="rotate(-35 50 50)">
      <defs>{s.def}</defs>
      <rect x={45} y={36} width={10} height={58} rx={5} fill={s.fill} stroke={ink(c)} strokeWidth={2.8} />
      <ellipse cx={50} cy={22} rx={15} ry={19} fill={s.fill} stroke={ink(c)} strokeWidth={3} />
      <ellipse cx={50} cy={22} rx={9} ry={12} fill={lighten(c, 0.15)} opacity={0.8} />
    </g>
  )
}

/** A mixing bowl. */
function Bowl() {
  const c = '#5ec8f2'
  const s = useShade(c, 0.35, 0.2)
  return (
    <g {...ROUND}>
      <defs>{s.def}</defs>
      <ellipse {...groundShadow(50, 90, 32)} />
      <path d="M10 42 Q14 86 50 88 Q86 86 90 42 Z" fill={s.fill} stroke={ink(c)} strokeWidth={3} />
      <ellipse cx={50} cy={42} rx={40} ry={10} fill={lighten(c, 0.35)} stroke={ink(c)} strokeWidth={3} />
      <ellipse cx={50} cy={44} rx={32} ry={6} fill="#fff4e0" />
      <Shine x={24} y={58} rx={3} ry={10} rot={-15} />
    </g>
  )
}

/** A kitchen timer bell (ding!). */
function Bell() {
  const c = '#f2b43c'
  const s = useShade(c, 0.4, 0.22)
  return (
    <g {...ROUND}>
      <defs>{s.def}</defs>
      <ellipse {...groundShadow(50, 90, 32)} />
      <rect x={14} y={78} width={72} height={10} rx={5} fill="#b8b2c8" stroke={ink('#b8b2c8')} strokeWidth={2.6} />
      <path d="M20 78 Q20 34 50 32 Q80 34 80 78 Z" fill={s.fill} stroke={ink(c)} strokeWidth={3} />
      <rect x={46} y={20} width={8} height={13} rx={3} fill={c} stroke={ink(c)} strokeWidth={2.6} />
      <circle cx={50} cy={17} r={6} fill={lighten(c, 0.15)} stroke={ink(c)} strokeWidth={2.6} />
      <Shine x={36} y={50} rx={4} ry={10} rot={20} />
    </g>
  )
}

/** Bubbles (a move that blows bubbles). */
function Bubbles() {
  const bubble = (cx: number, cy: number, r: number) => (
    <g key={`${cx}${cy}`}>
      <circle cx={cx} cy={cy} r={r} fill="#dff4ff" fillOpacity={0.55} stroke="#7cc4ec" strokeWidth={3} />
      <path d={`M${cx - r * 0.55} ${cy - r * 0.2} Q${cx - r * 0.45} ${cy - r * 0.55} ${cx - r * 0.1} ${cy - r * 0.6}`} stroke="#fff" strokeWidth={3} fill="none" />
    </g>
  )
  return <g {...ROUND}>{bubble(40, 58, 26)}{bubble(72, 30, 16)}{bubble(76, 74, 11)}{bubble(22, 22, 9)}</g>
}

/** Two footprints (a maze's trail). */
function Footprints() {
  const c = '#c9a07a'
  const foot = (x: number, y: number, r: number) => (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={9} ry={14} fill={c} stroke={ink(c)} strokeWidth={2.2} />
      {[-7, -2.5, 2, 6.5].map((dx, i) => <circle key={i} cx={x + dx} cy={y - 18 + Math.abs(dx) * 0.35} r={i === 0 ? 3.2 : 2.6} fill={c} stroke={ink(c)} strokeWidth={1.6} />)}
    </g>
  )
  return <g {...ROUND}>{foot(34, 64, -12)}{foot(64, 40, 12)}</g>
}

/** A pattern: shapes that repeat (the kitchen's "what comes next?"). */
function Pattern() {
  return (
    <g {...ROUND}>
      <circle cx={18} cy={50} r={12} fill="#ff6fae" stroke={ink('#ff6fae')} strokeWidth={2.6} />
      <rect x={38} y={38} width={24} height={24} rx={5} fill="#5ec8f2" stroke={ink('#5ec8f2')} strokeWidth={2.6} />
      <circle cx={82} cy={50} r={12} fill="#ff6fae" stroke={ink('#ff6fae')} strokeWidth={2.6} />
      <path d="M14 74 Q50 90 86 74" fill="none" stroke="#b8b2c8" strokeWidth={4} strokeDasharray="2 8" />
    </g>
  )
}

/** A round-ended butter knife (cutting, safely). */
function ButterKnife() {
  const blade = '#c9cfdc'
  const handle = '#ffb347'
  return (
    <g {...ROUND} transform="rotate(-40 50 50)">
      <path d="M44 8 Q58 8 58 26 L58 56 L44 56 Z" fill={blade} stroke={ink(blade)} strokeWidth={2.8} />
      <rect x={42} y={54} width={18} height={40} rx={7} fill={handle} stroke={ink(handle)} strokeWidth={2.8} />
      <Shine x={51} y={26} rx={2.2} ry={10} rot={0} />
    </g>
  )
}

export const UI_ITEMS: Item[] = [
  { id: 'microphone', name: 'microphone', emoji: ['🎤', '🎙️'], Draw: Microphone },
  { id: 'gear', name: 'settings', emoji: ['⚙️'], Draw: Gear },
  { id: 'music-off', name: 'music off', emoji: ['🔇'], Draw: MusicOff },
  { id: 'lock', name: 'locked', emoji: ['🔒'], Draw: Lock },
  { id: 'tap-up', name: 'tap here', emoji: ['👆'], Draw: TapUp },
  { id: 'tap-down', name: 'tap here', emoji: ['👇'], Draw: TapDown },
  { id: 'bow', name: 'bow', emoji: ['🎀'], Draw: Bow },
  { id: 'sun-hat', name: 'sun hat', emoji: ['👒'], Draw: SunHat },
  { id: 'cap', name: 'cap', emoji: ['🧢'], Draw: Cap },
  { id: 'party-hat', name: 'party hat', emoji: ['🥳'], Draw: PartyHat },
  { id: 'crayon', name: 'crayon', emoji: ['🖍️'], Draw: Crayon },
  { id: 'heart-empty', name: 'empty heart', emoji: ['🤍'], Draw: HeartEmpty },
  { id: 'candle', name: 'candle', emoji: ['🕯️'], Draw: Candle },
  { id: 'spoon', name: 'spoon', emoji: ['🥄'], Draw: Spoon },
  { id: 'bowl', name: 'bowl', emoji: ['🥣'], Draw: Bowl },
  { id: 'bell', name: 'bell', emoji: ['🔔'], Draw: Bell },
  { id: 'bubbles', name: 'bubbles', emoji: ['🫧'], Draw: Bubbles },
  { id: 'footprints', name: 'footprints', emoji: ['👣'], Draw: Footprints },
  { id: 'pattern', name: 'pattern', emoji: ['🔁'], Draw: Pattern },
  { id: 'butter-knife', name: 'knife', emoji: ['🔪'], Draw: ButterKnife },
]
