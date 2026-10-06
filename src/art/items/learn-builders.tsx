// Things drawn for the word builder (src/learn/topics/builders.tsx): short words that finish a word
// family (cat, hat… / pan, fan, van / dog, log). Each draws in a 100 x 100 box (see ./types.ts).
import type { Item } from './types'
import { groundShadow, ink, lighten, darken, Shine, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** A writing pen, lying on a slant: blue barrel, clip and a pointed nib. */
function Pen() {
  const blue = '#4f8df0'
  const barrel = useShade(blue, 0.4, 0.2)
  const line = ink(blue)
  return (
    <g {...ROUND}>
      <defs>{barrel.def}</defs>
      <ellipse {...groundShadow(50, 90, 34)} />
      <g transform="rotate(-38 50 52)">
        {/* nib */}
        <path d="M14 52 L26 45 L26 59 Z" fill="#f2e6cf" stroke={ink('#d8c7a4')} strokeWidth={2.4} />
        <path d="M14 52 L19 49.2 L19 54.8 Z" fill="#2b2140" />
        {/* barrel and cap */}
        <rect x={26} y={44} width={44} height={16} rx={4} fill={barrel.fill} stroke={line} strokeWidth={2.6} />
        <rect x={64} y={42.5} width={24} height={19} rx={7} fill={darken(blue, 0.12)} stroke={line} strokeWidth={2.6} />
        <path d="M70 42.5 L70 36 Q70 33 74 33 L86 33" fill="none" stroke={lighten('#c0c8d8', 0.1)} strokeWidth={6} />
        <path d="M70 42.5 L70 36 Q70 33 74 33 L86 33" fill="none" stroke={ink('#c0c8d8')} strokeWidth={1.6} opacity={0.6} />
        <Shine x={42} y={48.5} rx={10} ry={2} rot={0} />
      </g>
    </g>
  )
}

/** A log: a round of wood on its side, rings on the end, a little twig. */
function Log() {
  const bark = '#9a6a3f'
  const side = useShade(bark, 0.3, 0.2)
  const line = ink(bark)
  const wood = '#f0c98f'
  return (
    <g {...ROUND}>
      <defs>{side.def}</defs>
      <ellipse {...groundShadow(50, 88, 42)} />
      <path d="M22 40 L80 40 L80 84 L22 84 Z" fill={side.fill} stroke={line} strokeWidth={2.6} />
      <path d="M34 48 Q44 46 56 49 M30 62 Q46 59 64 63 M38 75 Q50 73 70 76" fill="none" stroke={darken(bark, 0.25)} strokeWidth={2.2} />
      {/* a twig with a leaf */}
      <path d="M56 40 L62 28" stroke={line} strokeWidth={3.4} />
      <path d="M62 28 Q72 22 76 28 Q70 34 62 28 Z" fill="#7ccf6a" stroke={ink('#7ccf6a')} strokeWidth={2} />
      <ellipse cx={80} cy={62} rx={12} ry={22} fill={side.fill} stroke={line} strokeWidth={2.6} />
      <ellipse cx={22} cy={62} rx={13} ry={22} fill={wood} stroke={line} strokeWidth={2.6} />
      <ellipse cx={22} cy={62} rx={8.5} ry={14.5} fill="none" stroke={darken(wood, 0.22)} strokeWidth={2} />
      <ellipse cx={22} cy={62} rx={4} ry={7} fill="none" stroke={darken(wood, 0.22)} strokeWidth={2} />
      <Shine x={46} y={47} rx={9} ry={2.5} rot={0} />
    </g>
  )
}

/** A mug with a big round handle and a heart on it. */
function Mug() {
  const red = '#f06a6a'
  const body = useShade(red, 0.38, 0.18)
  const line = ink(red)
  return (
    <g {...ROUND}>
      <defs>{body.def}</defs>
      <ellipse {...groundShadow(48, 92, 32)} />
      <path d="M70 40 Q90 40 90 58 Q90 76 68 76" fill="none" stroke={line} strokeWidth={14} />
      <path d="M70 40 Q90 40 90 58 Q90 76 68 76" fill="none" stroke={red} strokeWidth={8.6} />
      <path d="M18 28 L74 28 L72 84 Q72 91 64 91 L28 91 Q20 91 20 84 Z" fill={body.fill} stroke={line} strokeWidth={2.8} />
      <ellipse cx={46} cy={28} rx={28} ry={6} fill={darken(red, 0.3)} stroke={line} strokeWidth={2.6} />
      <path d="M46 68 C34 60 34 50 41 50 C44 50 46 53 46 54 C46 53 48 50 51 50 C58 50 58 60 46 68 Z" fill="#fff" opacity={0.9} />
      <Shine x={28} y={46} rx={3.5} ry={10} rot={0} />
    </g>
  )
}

/** A round bun with seeds on top. */
function Bun() {
  const crust = '#e3a157'
  const top = useShade(crust, 0.4, 0.18)
  const line = ink(crust)
  return (
    <g {...ROUND}>
      <defs>{top.def}</defs>
      <ellipse {...groundShadow(50, 86, 40)} />
      <path d="M12 72 Q12 84 50 84 Q88 84 88 72 Z" fill={lighten(crust, 0.35)} stroke={line} strokeWidth={2.6} />
      <path d="M12 72 Q10 32 50 30 Q90 32 88 72 Q70 78 50 78 Q30 78 12 72 Z" fill={top.fill} stroke={line} strokeWidth={2.8} />
      {[[36, 44, -20], [52, 40, 10], [66, 48, 30], [44, 56, -5], [60, 60, 20], [30, 60, -30]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={3} ry={1.8} fill="#fff6dd" stroke={ink('#fff6dd')} strokeWidth={0.8} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <Shine x={30} y={44} rx={8} ry={4} />
    </g>
  )
}

/** A frying pan with a long handle and an egg-shaped shine. */
function Pan() {
  const iron = '#4c4a5e'
  const body = useShade(iron, 0.35, 0.2)
  const line = darken(iron, 0.35)
  return (
    <g {...ROUND}>
      <defs>{body.def}</defs>
      <ellipse {...groundShadow(44, 86, 38)} />
      <path d="M66 58 L94 44" stroke={line} strokeWidth={11} />
      <path d="M66 58 L94 44" stroke="#9a6a3f" strokeWidth={7} />
      <ellipse cx={40} cy={64} rx={34} ry={20} fill={body.fill} stroke={line} strokeWidth={2.8} />
      <ellipse cx={40} cy={60} rx={28} ry={14} fill={lighten(iron, 0.15)} stroke={line} strokeWidth={2} />
      <Shine x={28} y={56} rx={8} ry={3} rot={-10} />
    </g>
  )
}

/** A desk fan: a round cage with three blades, on a stand. */
function Fan() {
  const blue = '#6cc4e8'
  const blade = useShade(blue, 0.4, 0.15)
  const metal = '#c9d2e0'
  const line = ink(metal)
  return (
    <g {...ROUND}>
      <defs>{blade.def}</defs>
      <ellipse {...groundShadow(50, 92, 26)} />
      <path d="M50 72 L50 86" stroke={line} strokeWidth={8} />
      <path d="M50 72 L50 86" stroke={metal} strokeWidth={4.6} />
      <ellipse cx={50} cy={88} rx={22} ry={5} fill={metal} stroke={line} strokeWidth={2.4} />
      <circle cx={50} cy={42} r={33} fill="#f4fbff" stroke={line} strokeWidth={2.8} />
      {[0, 120, 240].map((a) => (
        <path key={a} d="M50 42 C40 30 40 16 50 13 C60 16 60 30 50 42 Z" fill={blade.fill} stroke={ink(blue)} strokeWidth={2} transform={`rotate(${a} 50 42)`} />
      ))}
      <circle cx={50} cy={42} r={33} fill="none" stroke={line} strokeWidth={1.4} strokeDasharray="2 5" />
      <circle cx={50} cy={42} r={6} fill={metal} stroke={line} strokeWidth={2.2} />
    </g>
  )
}

/** A little van: rounded body, big windows, two wheels. */
function Van() {
  const green = '#5cc98c'
  const body = useShade(green, 0.35, 0.18)
  const line = ink(green)
  const glass = '#cdeeff'
  return (
    <g {...ROUND}>
      <defs>{body.def}</defs>
      <ellipse {...groundShadow(50, 90, 44)} />
      <path d="M8 76 L8 36 Q8 26 18 26 L66 26 Q74 26 79 34 L90 52 Q93 56 93 62 L93 76 Q93 80 89 80 L12 80 Q8 80 8 76 Z" fill={body.fill} stroke={line} strokeWidth={2.8} />
      <path d="M16 34 L36 34 L36 52 L16 52 Z" fill={glass} stroke={line} strokeWidth={2.2} />
      <path d="M42 34 L62 34 L62 52 L42 52 Z" fill={glass} stroke={line} strokeWidth={2.2} />
      <path d="M68 34 L74 34 L84 52 L68 52 Z" fill={glass} stroke={line} strokeWidth={2.2} />
      <path d="M8 64 L93 64" stroke={lighten(green, 0.35)} strokeWidth={4} />
      <rect x={86} y={66} width={7} height={5} rx={2} fill="#ffe680" stroke={ink('#ffe680')} strokeWidth={1.4} />
      {[26, 72].map((x) => (
        <g key={x}>
          <circle cx={x} cy={80} r={10} fill="#3b3a4a" stroke="#22212e" strokeWidth={2.4} />
          <circle cx={x} cy={80} r={4} fill="#c9d2e0" />
        </g>
      ))}
      <Shine x={24} y={30} rx={6} ry={2} rot={0} />
    </g>
  )
}

export const LEARN_BUILDERS: Item[] = [
  { id: 'pen', name: 'pen', emoji: [], Draw: Pen },
  { id: 'log', name: 'log', emoji: [], Draw: Log },
  { id: 'mug', name: 'mug', emoji: [], Draw: Mug },
  { id: 'bun', name: 'bun', emoji: [], Draw: Bun },
  { id: 'pan', name: 'pan', emoji: [], Draw: Pan },
  { id: 'fan', name: 'fan', emoji: [], Draw: Fan },
  { id: 'van', name: 'van', emoji: [], Draw: Van },
]
