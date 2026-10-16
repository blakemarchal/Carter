// Feelings, for the "Think about it" questions and the big words ("How did they feel? Scared, silly, or sleepy?"):
// one round face drawn with a different look for each feeling, so a feeling is a drawing like everything else a
// child taps, not each device's emoji. Each draws in a 100 x 100 box (see ./types.ts).
import type { Item } from './types'
import { darken, EYE, groundShadow, ink, lighten, useShade } from './draw'

const ROUND = { strokeLinejoin: 'round', strokeLinecap: 'round' } as const

export type Feeling =
  | 'happy' | 'sad' | 'scared' | 'cross' | 'jealous' | 'calm' | 'sleepy' | 'laughing' | 'grumbling' | 'yuck'
  | 'worried' | 'loving' | 'amazed' | 'silly' | 'yawning' | 'cold' | 'yum'

const SKIN = '#ffd27a'
/** A cross face goes red, a sick one green, a cold one blue. */
const TINT: Partial<Record<Feeling, string>> = { cross: '#ff9a7a', jealous: '#d9e07a', yuck: '#b8e08a', cold: '#9fcfff' }

/** An eye: open (a shiny dot), shut (an arc), wide (a bigger dot), or glancing to one side. */
function Eye({ x, y, kind = 'open', r = 6 }: { x: number; y: number; kind?: 'open' | 'shut' | 'wide' | 'side' | 'small'; r?: number }) {
  if (kind === 'shut') return <path d={`M${x - 7} ${y} Q${x} ${y + 7} ${x + 7} ${y}`} stroke={EYE} strokeWidth={3.2} fill="none" {...ROUND} />
  const rr = kind === 'wide' ? r + 2.5 : kind === 'small' ? r - 2 : r
  const dx = kind === 'side' ? 3 : 0
  return (
    <g>
      <ellipse cx={x + dx} cy={y} rx={rr} ry={rr + 1} fill={EYE} />
      <circle cx={x + dx - rr * 0.35} cy={y - rr * 0.4} r={rr * 0.36} fill="#fff" />
    </g>
  )
}

/** Eyebrows: angry (sloping in), sad (sloping out), or raised. */
function Brows({ kind }: { kind: 'angry' | 'sad' | 'raised' }) {
  const d = kind === 'angry' ? 'M24 30 L40 37 M76 30 L60 37' : kind === 'sad' ? 'M26 36 L40 30 M74 36 L60 30' : 'M26 28 Q33 22 41 27 M74 28 Q67 22 59 27'
  return <path d={d} stroke={EYE} strokeWidth={3.6} fill="none" {...ROUND} />
}

function Face({ feeling }: { feeling: Feeling }) {
  const color = TINT[feeling] ?? SKIN
  const skin = useShade(color, 0.3, 0.15)
  const line = ink(color)
  const cheeks = !['cross', 'yuck', 'cold', 'scared'].includes(feeling)
  const mouth = (() => {
    switch (feeling) {
      case 'happy': case 'loving': return <path d="M36 62 Q50 78 64 62 Q50 70 36 62 Z" fill="#8a2d3e" stroke={EYE} strokeWidth={2.2} {...ROUND} />
      case 'calm': return <path d="M40 65 Q50 72 60 65" stroke={EYE} strokeWidth={3.2} fill="none" {...ROUND} />
      case 'sad': case 'worried': return <path d="M39 70 Q50 60 61 70" stroke={EYE} strokeWidth={3.2} fill="none" {...ROUND} />
      case 'cross': case 'jealous': case 'grumbling': return <path d="M38 70 Q50 62 62 70" stroke={EYE} strokeWidth={3.4} fill="none" {...ROUND} />
      case 'scared': return <path d="M36 68 Q43 62 50 68 Q57 74 64 68" stroke={EYE} strokeWidth={3.2} fill="none" {...ROUND} />
      case 'sleepy': return <path d="M43 67 Q50 71 57 67" stroke={EYE} strokeWidth={3} fill="none" {...ROUND} />
      case 'laughing': return <path d="M33 60 Q50 84 67 60 Z" fill="#8a2d3e" stroke={EYE} strokeWidth={2.2} {...ROUND} />
      case 'amazed': case 'yawning': return <ellipse cx={50} cy={68} rx={feeling === 'yawning' ? 11 : 8} ry={feeling === 'yawning' ? 13 : 10} fill="#8a2d3e" stroke={EYE} strokeWidth={2.2} />
      case 'yuck': return <path d="M36 66 Q43 60 50 66 Q57 72 64 66" stroke={EYE} strokeWidth={3.2} fill="none" {...ROUND} />
      case 'silly': return (
        <g>
          <path d="M36 62 Q50 76 64 62" stroke={EYE} strokeWidth={3} fill="none" {...ROUND} />
          <path d="M50 67 Q52 82 60 78 Q62 70 56 66 Z" fill="#ff6f9a" stroke={EYE} strokeWidth={2} {...ROUND} />
        </g>
      )
      case 'yum': return (
        <g>
          <path d="M36 62 Q50 78 64 62 Q50 70 36 62 Z" fill="#8a2d3e" stroke={EYE} strokeWidth={2.2} {...ROUND} />
          <path d="M40 66 Q36 78 44 78 Q50 76 48 68 Z" fill="#ff6f9a" stroke={EYE} strokeWidth={2} {...ROUND} />
        </g>
      )
      case 'cold': return <path d="M36 67 L41 63 L46 69 L51 63 L56 69 L61 63 L64 67" stroke={EYE} strokeWidth={3} fill="none" {...ROUND} />
    }
  })()
  const eyes = (() => {
    switch (feeling) {
      case 'calm': case 'sleepy': case 'laughing': case 'yawning': case 'loving': case 'yum': return <><Eye x={37} y={46} kind="shut" /><Eye x={63} y={46} kind="shut" /></>
      case 'scared': case 'amazed': return <><Eye x={37} y={46} kind="wide" /><Eye x={63} y={46} kind="wide" /></>
      case 'jealous': return <><Eye x={37} y={46} kind="side" r={5} /><Eye x={63} y={46} kind="side" r={5} /></>
      case 'cross': case 'grumbling': return <><Eye x={37} y={47} r={5} /><Eye x={63} y={47} r={5} /></>
      case 'silly': return <><Eye x={37} y={44} kind="wide" /><Eye x={63} y={48} kind="small" /></>
      default: return <><Eye x={37} y={46} /><Eye x={63} y={46} /></>
    }
  })()
  const brows = ['cross', 'jealous', 'grumbling'].includes(feeling) ? <Brows kind="angry" />
    : ['sad', 'worried', 'scared'].includes(feeling) ? <Brows kind="sad" />
      : feeling === 'amazed' ? <Brows kind="raised" /> : null
  return (
    <g {...ROUND}>
      <defs>{skin.def}</defs>
      <ellipse {...groundShadow(50, 93, 34)} />
      <circle cx={50} cy={50} r={40} fill={skin.fill} stroke={line} strokeWidth={3} />
      {eyes}
      {brows}
      {mouth}
      {cheeks && <>
        <ellipse cx={26} cy={60} rx={7} ry={4.5} fill="#ff7fb0" opacity={0.5} />
        <ellipse cx={74} cy={60} rx={7} ry={4.5} fill="#ff7fb0" opacity={0.5} />
      </>}
      {/* the extras that say the feeling: a tear, sweat, zzz, hearts, puffs, snow, laughing tears */}
      {feeling === 'sad' && <path d="M66 54 Q72 64 66 70 Q60 64 66 54 Z" fill="#8fd1ff" stroke={ink('#8fd1ff')} strokeWidth={1.8} />}
      {feeling === 'worried' && <path d="M50 76 Q50 84 50 84" stroke={EYE} strokeWidth={0} />}
      {feeling === 'scared' && <path d="M82 34 Q87 42 82 47 Q77 42 82 34 Z" fill="#8fd1ff" stroke={ink('#8fd1ff')} strokeWidth={1.8} />}
      {feeling === 'laughing' && [30, 70].map((x) => <path key={x} d={`M${x} 50 Q${x + 5} 58 ${x} 63 Q${x - 5} 58 ${x} 50 Z`} fill="#8fd1ff" stroke={ink('#8fd1ff')} strokeWidth={1.6} />)}
      {feeling === 'sleepy' && <text x={70} y={30} fontSize={20} fontWeight={900} fill={darken(SKIN, 0.4)} fontFamily="system-ui, sans-serif">zZ</text>}
      {feeling === 'loving' && [[18, 24, 0.9], [82, 22, 0.8]].map(([x, y, s]) => (
        <path key={x} transform={`translate(${x} ${y}) scale(${s})`} d="M0 8 C-10 -2 -8 -12 0 -8 C8 -12 10 -2 0 8 Z" fill="#ff5c8a" stroke={ink('#ff5c8a')} strokeWidth={1.8} />
      ))}
      {feeling === 'grumbling' && [[20, 66], [80, 66]].map(([x, y]) => (
        <g key={x}><circle cx={x} cy={y} r={5} fill="#fff" stroke={line} strokeWidth={1.6} /><circle cx={x + (x < 50 ? -7 : 7)} cy={y - 4} r={3.4} fill="#fff" stroke={line} strokeWidth={1.4} /></g>
      ))}
      {feeling === 'cold' && [[18, 22], [84, 30], [12, 78]].map(([x, y]) => (
        <path key={x} transform={`translate(${x} ${y})`} d="M0 -6 L0 6 M-6 0 L6 0 M-4 -4 L4 4 M-4 4 L4 -4" stroke="#fff" strokeWidth={2} />
      ))}
      {feeling === 'amazed' && <circle cx={50} cy={50} r={40} fill="none" stroke={lighten(color, 0.4)} strokeWidth={0} />}
    </g>
  )
}

const face = (id: string, name: string, feeling: Feeling, emoji: string[]): Item =>
  ({ id, name, emoji, Draw: () => <Face feeling={feeling} /> })

export const LEARN_FACES: Item[] = [
  face('face-happy', 'a happy face', 'happy', ['😊', '😄', '🙂', '😃']),
  face('face-sad', 'a sad face', 'sad', ['😢', '😭', '🙁']),
  face('face-scared', 'a scared face', 'scared', ['😨', '😰', '😱']),
  face('face-cross', 'a cross face', 'cross', ['😡']),
  face('face-jealous', 'a jealous face', 'jealous', ['😠']),
  face('face-calm', 'a calm face', 'calm', ['😌']),
  face('face-sleepy', 'a sleepy face', 'sleepy', ['😴']),
  face('face-laughing', 'a laughing face', 'laughing', ['😂', '🤣']),
  face('face-grumbling', 'a grumbling face', 'grumbling', ['😤']),
  face('face-yuck', 'a yuck face', 'yuck', ['🤢', '🤮']),
  face('face-worried', 'a worried face', 'worried', ['😟', '😕']),
  face('face-loving', 'a loving face', 'loving', ['🥰', '😍']),
  face('face-amazed', 'an amazed face', 'amazed', ['😮', '😲']),
  face('face-silly', 'a silly face', 'silly', ['🤪', '😜']),
  face('face-yawning', 'a yawning face', 'yawning', ['🥱']),
  face('face-cold', 'a cold face', 'cold', ['🥶']),
  face('face-yum', 'a yum face', 'yum', ['😋']),
]
