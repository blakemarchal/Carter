// Drawn things first needed by the loaves island (its activities and pictures). Same style and rules as
// the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
import type { Item } from './types'
import { darken, EYE, groundShadow, ink, lighten, Shine, useShade } from './draw'

const CRUST = '#e3a253'
const WICKER = '#d0924f'

/** A little round loaf, `rx` across, with two baked marks on top like the story's loaves. (x, y) = its middle. */
const Loaf = ({ x, y, rx = 13, fill }: { x: number; y: number; rx?: number; fill: string }) => {
  const ry = rx * 0.64
  const mark = (mx: number) => `M${mx - rx * 0.2} ${y - ry * 0.15} q${rx * 0.2} ${-ry * 0.55} ${rx * 0.4} 0`
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} stroke={ink(CRUST)} strokeWidth={2.2} />
      <path d={`${mark(x - rx * 0.28)} ${mark(x + rx * 0.28)}`} stroke={darken(CRUST, 0.3)} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A whole little fish lying on its side, its head toward `facing` (1: right): body, tail, gill and eye. (x, y) = the middle of its body. */
function LunchFish({ x, y, color, facing }: { x: number; y: number; color: string; facing: 1 | -1 }) {
  const body = useShade(color, 0.4, 0.15)
  return (
    <g transform={`translate(${x} ${y}) scale(${facing} 1)`}>
      <defs>{body.def}</defs>
      <path d="M-13 0 L-21 -7.5 L-21 7.5 Z" fill={body.fill} stroke={ink(color)} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={15} ry={8.5} fill={body.fill} stroke={ink(color)} strokeWidth={2.2} />
      <path d="M5 -6 Q2 0 5 6" stroke={ink(color)} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.7} />
      <circle cx={9.5} cy={-1.5} r={2} fill={EYE} />
    </g>
  )
}

/**
 * The boy's lunch (John 6:9): a little woven basket with five round loaves heaped up in it (three, and
 * two on top) and two whole fish, a blue one and an orange one, laid tail to tail along the front, so all
 * seven are easy to count. The same lunch the boy carries in the story (art/scenes/loaves.tsx, Lunch).
 * (No emoji: 🧺 is any basket of food, drawn with less in it.)
 */
function BoysLunch() {
  const crust = useShade(CRUST, 0.35, 0.18)
  const wicker = useShade(WICKER, 0.3, 0.2)
  const line = ink(WICKER)
  const front = 'M10 56 A40 10 0 0 0 90 56'
  return (
    <g strokeLinejoin="round">
      <defs>{crust.def}{wicker.def}</defs>
      <ellipse {...groundShadow(50, 92, 34)} />
      {/* the inside and the back of the rim, then the loaves heaped up in it */}
      <ellipse cx={50} cy={56} rx={40} ry={10} fill={darken(WICKER, 0.38)} stroke={line} strokeWidth={2.5} />
      <Loaf x={38} y={35} fill={crust.fill} />
      <Loaf x={62} y={35} fill={crust.fill} />
      <Loaf x={25} y={47} fill={crust.fill} />
      <Loaf x={50} y={46} fill={crust.fill} />
      <Loaf x={75} y={47} fill={crust.fill} />
      {/* the front of the basket, its weave, and the near side of the rim */}
      <path d={`${front} L80 88 Q50 95 20 88 Z`} fill={wicker.fill} stroke={line} strokeWidth={2.6} />
      {[74, 82].map((y) => <path key={y} d={`M${13 + (y - 56) * 0.28} ${y} Q50 ${y + 8} ${87 - (y - 56) * 0.28} ${y}`} stroke={darken(WICKER, 0.22)} strokeWidth={2} fill="none" />)}
      {[30, 42, 58, 70].map((x) => <path key={x} d={`M${x} 68 L${x + (x - 50) * -0.1} 90`} stroke={darken(WICKER, 0.18)} strokeWidth={1.6} />)}
      <path d={front} stroke={line} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={front} stroke={lighten(WICKER, 0.15)} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* the two fish, lying along the front */}
      <LunchFish x={29} y={64} color="#5fb7ff" facing={-1} />
      <LunchFish x={71} y={64} color="#ffa64d" facing={1} />
      <Shine x={24} y={78} rx={5} ry={3} />
    </g>
  )
}

export const ISL_LOAVES: Item[] = [
  { id: 'boys-lunch', name: "the boy's lunch: five loaves of bread and two fish", Draw: BoysLunch },
]
