// Drawn things first needed by the joseph island (its activities and pictures). Same style and rules as
// the other item files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the
// drawing is what that emoji means. Every item can be used anywhere once it's here.
import { useId } from 'react'
import type { Item } from './types'
import { CuteFace, darken, EYE, groundShadow, ink, lighten, Shine, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const
const f = (n: number) => n.toFixed(1)
const uidOf = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')

/** The colors of Joseph's coat, top to bottom (as in the story pictures and the painting game). */
const COAT = ['#ff5d5d', '#ffa64d', '#ffe14d', '#5fd39a', '#5fb7ff', '#a98cff']
const COAT_INK = '#5a3a24'

/**
 * Joseph's coat of many colors, laid out flat: a long robe with its sleeves out wide, striped red,
 * orange, yellow, green, blue and purple down the front, and blue, yellow and red across each sleeve.
 */
function JosephCoat() {
  const uid = uidOf(useId())
  const outline = 'M38 13 Q50 21 62 13 L72 15 L95 28 L92 47 L71 40 L78 89 Q50 97 22 89 L29 40 L8 47 L5 28 L28 15 Z'
  const sleeve = (side: 1 | -1) => {
    const m = (x: number) => (side === 1 ? x : 100 - x)
    // A sleeve, from the shoulder out to the cuff, in three stripes across it.
    const top = [[72, 15], [80, 19.5], [87.5, 23.7], [95, 28]]
    const bot = [[71, 40], [78, 42.3], [85, 44.7], [92, 47]]
    return [0, 1, 2].map((i) => (
      <path key={i} d={`M${m(top[i][0])} ${top[i][1]} L${m(top[i + 1][0])} ${top[i + 1][1]} L${m(bot[i + 1][0])} ${bot[i + 1][1]} L${m(bot[i][0])} ${bot[i][1]} Z`}
        fill={[COAT[4], COAT[2], COAT[0]][i]} stroke={COAT_INK} strokeWidth={1} strokeOpacity={0.5} />
    ))
  }
  return (
    <g {...ROUND}>
      <defs>
        <clipPath id={`jc${uid}`}><path d={outline} /></clipPath>
        <radialGradient id={`js${uid}`} cx="38%" cy="28%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity={0.45} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#3b2414" stopOpacity={0.25} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#jc${uid})`}>
        {COAT.map((c, i) => <path key={c} d={`M0 ${f(12 + i * 14)} Q50 ${f(17 + i * 14)} 100 ${f(12 + i * 14)} L100 ${f(27 + i * 14)} Q50 ${f(32 + i * 14)} 0 ${f(27 + i * 14)} Z`} fill={c} />)}
        {COAT.slice(1).map((c, i) => <path key={c} d={`M0 ${f(26 + i * 14)} Q50 ${f(31 + i * 14)} 100 ${f(26 + i * 14)}`} stroke={COAT_INK} strokeWidth={0.9} fill="none" opacity={0.45} />)}
        {sleeve(1)}
        {sleeve(-1)}
        <rect width={100} height={100} fill={`url(#js${uid})`} />
      </g>
      {/* the neck, where the back of the coat shows inside */}
      <path d="M38 13 Q50 21 62 13 Q50 8 38 13 Z" fill="#a0612f" />
      <path d={outline} fill="none" stroke={COAT_INK} strokeWidth={2.6} />
      <Shine x={33} y={32} rx={5} ry={3} />
    </g>
  )
}

/** A bundle of grain (a sheaf): golden stalks tied round the middle, splayed out at the bottom, the ears of grain fanned out on top. */
function GrainSheaf() {
  const gold = '#f0c75a', line = '#b8892a', ear = '#e8b440'
  const ears = [-36, -24, -12, 0, 12, 24, 36]
  const at = (a: number, d: number) => [50 + Math.sin((a * Math.PI) / 180) * d, 52 - Math.cos((a * Math.PI) / 180) * d]
  return (
    <g {...ROUND}>
      <ellipse {...groundShadow(50, 93, 26)} />
      <path d="M44 52 L30 91 Q50 95 70 91 L56 52 Z" fill={gold} stroke={line} strokeWidth={2.2} />
      {[-14, -7, 0, 7, 14].map((dx) => <path key={dx} d={`M${f(50 + dx * 0.4)} 54 L${50 + dx} 90`} stroke={line} strokeWidth={1.2} opacity={0.7} />)}
      {ears.map((a) => {
        const [x, y] = at(a, 30)
        return <path key={`s${a}`} d={`M${f(50 + Math.sin((a * Math.PI) / 180) * 4)} 50 L${f(x)} ${f(y)}`} stroke={line} strokeWidth={4} />
      })}
      {ears.map((a) => {
        const [x, y] = at(a, 30)
        return <path key={`g${a}`} d={`M${f(50 + Math.sin((a * Math.PI) / 180) * 4)} 50 L${f(x)} ${f(y)}`} stroke={gold} strokeWidth={2} />
      })}
      {ears.map((a) => {
        const [x, y] = at(a, 34)
        return (
          <g key={`e${a}`} transform={`translate(${f(x)} ${f(y)}) rotate(${a})`}>
            <path d="M0 -12 L-2 -20 M0 -12 L0 -22 M0 -12 L2 -20" stroke={line} strokeWidth={1} />
            <ellipse cx={0} cy={-3} rx={4.2} ry={9} fill={ear} stroke={line} strokeWidth={1.6} />
            <path d="M-3.2 -6 L0 -3.6 L3.2 -6 M-3.2 -1 L0 1.4 L3.2 -1" stroke={line} strokeWidth={0.9} fill="none" />
          </g>
        )
      })}
      <path d="M41 47 Q50 50 59 47 L59 56 Q50 59 41 56 Z" fill="#a0612f" stroke="#6b4422" strokeWidth={1.8} />
      <Shine x={40} y={74} rx={3} ry={6} rot={-12} />
    </g>
  )
}

/**
 * An empty storehouse for grain, as Joseph's were in Egypt: a round bin of mud bricks, open at the
 * top (dark inside, ready to fill), with a painted band under its rim and a little wooden door.
 */
function Storehouse() {
  const c = '#e2bd84'
  const mud = useShade(c, 0.3, 0.2)
  const line = '#a87e46'
  return (
    <g {...ROUND}>
      <defs>{mud.def}</defs>
      <ellipse {...groundShadow(50, 92, 40)} />
      {/* the empty inside */}
      <ellipse cx={50} cy={43} rx={39} ry={11} fill="#5a3e24" />
      <path d="M17 45 Q50 31 83 45" stroke="#7a5638" strokeWidth={2} fill="none" />
      {/* the round wall */}
      <path d="M11 43 A39 11 0 0 0 89 43 L87 87 Q50 95 13 87 Z" fill={mud.fill} stroke={line} strokeWidth={2.6} />
      <path d="M12 52 Q50 66 88 52" stroke="#3f7fd0" strokeWidth={4} fill="none" />
      <path d="M12 58 Q50 72 88 58" stroke="#d0503f" strokeWidth={2} fill="none" strokeDasharray="4 3" />
      {[72, 82].map((y) => <path key={y} d={`M13 ${y} Q50 ${y + 12} 87 ${y}`} stroke="#cfa66a" strokeWidth={1.6} fill="none" />)}
      {[[24, 66], [70, 66], [32, 78], [64, 79], [20, 84]].map(([x, y]) => <path key={`${x}${y}`} d={`M${x} ${y} l0 8`} stroke="#cfa66a" strokeWidth={1.6} />)}
      {/* a little wooden door */}
      <path d="M41 91 L41 78 Q41 70 50 70 Q59 70 59 78 L59 91 Z" fill="#8a5a2e" stroke="#5a3a20" strokeWidth={2} />
      <path d="M47 72 L47 91 M53 72 L53 91" stroke="#6b4422" strokeWidth={1.4} />
      {/* the rim */}
      <ellipse cx={50} cy={43} rx={39} ry={11} fill="none" stroke={line} strokeWidth={7} />
      <ellipse cx={50} cy={43} rx={39} ry={11} fill="none" stroke={lighten(c, 0.2)} strokeWidth={3.5} />
      <Shine x={24} y={68} rx={4} ry={7} rot={-8} />
    </g>
  )
}

/**
 * Pharaoh's dream: a big fat cow, round and happy, and beside it a skinny cow, thin and hungry with its
 * ribs showing and its head hanging low. Both face right, standing on the grass.
 */
function DreamCows() {
  const hide = '#fbf3e6', line = '#b5a08a', patch = '#a8683e'
  const thin = '#e6d6bc', thinLine = '#a08a6e'
  return (
    <g {...ROUND}>
      <path d="M2 88 Q50 84 98 88 L98 92 L2 92 Z" fill="#9cd08a" />
      {/* the fat cow */}
      <ellipse {...groundShadow(28, 89, 22)} />
      {[12, 32].map((x) => <rect key={x} x={x} y={70} width={6} height={18} rx={2.5} fill="#e8dccb" stroke={line} strokeWidth={1.4} />)}
      <path d="M6 58 Q1 66 3 75" stroke={line} strokeWidth={2} fill="none" />
      <ellipse cx={24} cy={64} rx={21} ry={15} fill={hide} stroke={line} strokeWidth={2} />
      <path d="M12 52 Q18 62 10 72 Q4 68 4 62 Q6 54 12 52 Z" fill={patch} />
      <ellipse cx={30} cy={56} rx={6} ry={4} fill={patch} />
      {[16, 36].map((x) => <rect key={x} x={x} y={72} width={6.5} height={17} rx={2.5} fill={hide} stroke={line} strokeWidth={1.4} />)}
      <path d="M40 41 l2 -5 l2 4 Z M49 41 l2 -5 l2 4 Z" fill="#f2e6c8" stroke="#c9b48a" strokeWidth={1} />
      <rect x={38} y={40} width={17} height={20} rx={8} fill={hide} stroke={line} strokeWidth={1.8} />
      <ellipse cx={37} cy={44} rx={4.5} ry={2.2} fill={hide} stroke={line} strokeWidth={1.2} transform="rotate(-25 37 44)" />
      <ellipse cx={48} cy={56} rx={8} ry={5} fill="#ffc0cf" stroke="#e090a8" strokeWidth={1.2} />
      <circle cx={45.5} cy={56} r={1} fill="#a05a6a" /><circle cx={50.5} cy={56} r={1} fill="#a05a6a" />
      <circle cx={49} cy={47} r={1.8} fill={EYE} /><circle cx={48.4} cy={46.4} r={0.6} fill="#fff" />
      <ellipse cx={52} cy={51} rx={1.8} ry={1.1} fill="#ff7fb0" opacity={0.5} />
      {/* the skinny cow */}
      <ellipse {...groundShadow(76, 89, 15)} />
      {[64, 82].map((x) => <rect key={x} x={x} y={62} width={3.6} height={26} rx={1.6} fill="#d6c4a6" stroke={thinLine} strokeWidth={1.2} />)}
      <path d="M60 56 Q56 64 57 72" stroke={thinLine} strokeWidth={1.6} fill="none" />
      <path d="M60 58 Q60 51 66 52 Q73 55 80 52 Q86 50 88 56 Q88 64 82 65 Q73 66 64 65 Q60 64 60 58 Z" fill={thin} stroke={thinLine} strokeWidth={1.6} />
      {[69, 74, 79].map((x) => <path key={x} d={`M${x} 55 Q${x - 2} 59 ${x} 63`} stroke={thinLine} strokeWidth={1.1} fill="none" />)}
      {[67, 85].map((x) => <rect key={x} x={x} y={63} width={3.8} height={26} rx={1.6} fill={thin} stroke={thinLine} strokeWidth={1.2} />)}
      {/* its head hangs low */}
      <g transform="rotate(22 88 58)">
        <path d="M88 50 l1.5 -4 l1.5 3.5 Z M94 50 l1.5 -4 l1.5 3.5 Z" fill="#f2e6c8" stroke="#c9b48a" strokeWidth={0.8} />
        <rect x={87} y={49} width={11} height={14} rx={5} fill={thin} stroke={thinLine} strokeWidth={1.4} />
        <ellipse cx={95} cy={61} rx={5} ry={3.4} fill="#ffc0cf" stroke="#e090a8" strokeWidth={1} />
        <path d="M91 55 Q93 56.5 95 55" stroke={EYE} strokeWidth={1.2} fill="none" />
      </g>
      <Shine x={16} y={58} rx={4} ry={2.5} />
    </g>
  )
}

export const ISL_JOSEPH: Item[] = [
  { id: 'joseph-coat', name: "Joseph's coat", emoji: ['🧥'], Draw: JosephCoat },
  { id: 'grain-sheaf', name: 'bundle of grain', emoji: ['🌾'], Draw: GrainSheaf },
  { id: 'grain-storehouse', name: 'storehouse', emoji: [], Draw: Storehouse },
  { id: 'cows-fat-skinny', name: 'fat cow and skinny cow', emoji: [], Draw: DreamCows },
]

// (CuteFace, darken and ink are here for drawings still to come.)
void CuteFace
void darken
void ink
