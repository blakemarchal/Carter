// Placeholder Pal illustrations drawn in SVG. These get replaced by finished art later,
// but keep the same species/stage/mood props.
import type { PalDef } from '../data/pals'

interface Props {
  pal: Pick<PalDef, 'species'>
  stage?: number
  mood?: 'happy' | 'grumpy'
  size?: number
  silhouette?: boolean
  className?: string
}

function Face({ x, y, s = 1, mood = 'happy' }: { x: number; y: number; s?: number; mood?: 'happy' | 'grumpy' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={-14} cy={0} rx={6} ry={mood === 'grumpy' ? 4 : 8} fill="#2b2140" />
      <ellipse cx={14} cy={0} rx={6} ry={mood === 'grumpy' ? 4 : 8} fill="#2b2140" />
      {mood === 'happy' && <circle cx={-12} cy={-3} r={2.4} fill="#fff" />}
      {mood === 'happy' && <circle cx={16} cy={-3} r={2.4} fill="#fff" />}
      {mood === 'grumpy' ? (
        <>
          <path d="M-22 -10 L-8 -6 M22 -10 L8 -6" stroke="#2b2140" strokeWidth={3} strokeLinecap="round" />
          <path d="M-7 18 Q0 12 7 18" stroke="#2b2140" strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <path d="M-7 12 Q0 20 7 12" stroke="#2b2140" strokeWidth={3} fill="none" strokeLinecap="round" />
      )}
      <circle cx={-24} cy={10} r={6} fill="#ff7fb0" opacity={0.6} />
      <circle cx={24} cy={10} r={6} fill="#ff7fb0" opacity={0.6} />
    </g>
  )
}

function Crown({ x, y }: { x: number; y: number }) {
  return <path transform={`translate(${x} ${y})`} d="M-16 0 L-16 -14 L-8 -6 L0 -18 L8 -6 L16 -14 L16 0 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} />
}

const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`

/** A five-pointed star centred on (cx, cy). */
function starPath(cx: number, cy: number, r: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const d = i % 2 ? r * 0.48 : r
    return `${i ? 'L' : 'M'}${pt(cx + Math.cos(a) * d, cy + Math.sin(a) * d)}`
  }).join(' ') + 'Z'
}

/** A four-pointed twinkle centred on (x, y). */
function twinklePath(x: number, y: number, r: number) {
  const k = r * 0.18
  return `M${pt(x, y - r)} Q${pt(x + k, y - k)} ${pt(x + r, y)} Q${pt(x + k, y + k)} ${pt(x, y + r)} Q${pt(x - k, y + k)} ${pt(x - r, y)} Q${pt(x - k, y - k)} ${pt(x, y - r)}Z`
}

function Snowflake({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  const c = r * 0.87
  const h = r / 2
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} strokeWidth={3.5} strokeLinecap="round" fill="none">
      <path d={`M0 ${-r} V${r} M${-c} ${-h} L${c} ${h} M${-c} ${h} L${c} ${-h}`} />
      <circle r={2.5} fill={color} />
    </g>
  )
}

/** A woven basket of loaves (and, for the grown donkey, a fish poking out). */
function Basket({ x, y, s = 1, fish }: { x: number; y: number; s?: number; fish?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {fish && (
        <g fill="#7cc6ff">
          <ellipse cx={8} cy={-24} rx={5.5} ry={10} />
          <path d="M8 -31 L0 -42 L16 -42 Z" strokeLinejoin="round" stroke="#7cc6ff" strokeWidth={2} />
        </g>
      )}
      <ellipse cx={-7} cy={-14} rx={10} ry={7} fill="#f2c27b" />
      <ellipse cx={7} cy={-15} rx={9} ry={7} fill="#e3a557" />
      <path d="M-20 -10 H20 L16 12 Q0 18 -16 12 Z" fill="#d39a5a" stroke="#a8703a" strokeWidth={2} strokeLinejoin="round" />
      <path d="M-19 -2 H19 M-17 6 H17" stroke="#a8703a" strokeWidth={2} />
      <rect x={-22} y={-13} width={44} height={6} rx={3} fill="#c0864a" />
    </g>
  )
}

/** A crab pincer: a round claw with a V-shaped opening at the top. */
const CLAW = 'M8 -13.9 L0 -3 L-8 -13.9 A16 16 0 1 0 8 -13.9 Z'

/** A crescent moon, opening to the top right. */
const MOON = 'M-4 -15 A15 15 0 1 0 15 4 A13.5 13.5 0 0 1 -4 -15 Z'

function Body({ species, stage, mood }: { species: PalDef['species']; stage: number; mood: 'happy' | 'grumpy' }) {
  switch (species) {
    case 'mouse': {
      // Grown forms: taller ears, a bigger lightning tail and a tuft of hair, so the outline changes.
      const ear = stage >= 1 ? 46 : 34
      return (
        <g>
          {stage >= 1
            ? <path d="M146 150 L182 128 L164 116 L196 90 L176 82 L196 50" stroke="#e8a800" strokeWidth={13} fill="none" strokeLinejoin="round" />
            : <path d="M150 140 L175 120 L162 112 L185 88" stroke="#e8a800" strokeWidth={10} fill="none" strokeLinejoin="round" />}
          <ellipse cx={62} cy={70 - ear / 2 + 5} rx={18} ry={ear} fill="#ffd94a" transform="rotate(-25 62 58)" />
          <ellipse cx={138} cy={70 - ear / 2 + 5} rx={18} ry={ear} fill="#ffd94a" transform="rotate(25 138 58)" />
          <ellipse cx={62} cy={58 - ear + 16} rx={10} ry={14} fill="#3a2a1a" transform="rotate(-25 62 58)" />
          <ellipse cx={138} cy={58 - ear + 16} rx={10} ry={14} fill="#3a2a1a" transform="rotate(25 138 58)" />
          {stage >= 1 && <path d="M84 72 L90 46 L99 64 L106 40 L112 66 L120 50 L118 76 Z" fill="#ffd94a" />}
          <ellipse cx={100} cy={120} rx={58} ry={56} fill="#ffd94a" />
          <ellipse cx={100} cy={145} rx={30} ry={22} fill="#fff2b8" />
          <Face x={100} y={108} mood={mood} />
          {stage >= 1 && <path d="M60 170 l10 -12 l10 12 Z M120 170 l10 -12 l10 12 Z" fill="#ff8cc0" />}
          {stage >= 2 && <Crown x={100} y={40} />}
        </g>
      )
    }
    case 'dragon':
      return (
        <g>
          <path d="M150 150 Q190 150 182 115" stroke="#ff8a3d" strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M182 115 q-6 -20 6 -30 q2 16 10 22 q-6 10 -16 8Z" fill="#ffcf3d" />
          {stage >= 1 && (
            <>
              <path d="M58 100 L10 60 L30 110 L5 110 L50 130 Z" fill="#5fb7ff" />
              <path d="M142 100 L190 60 L170 110 L195 110 L150 130 Z" fill="#5fb7ff" />
            </>
          )}
          <ellipse cx={100} cy={128} rx={52} ry={50} fill="#ff8a3d" />
          <ellipse cx={100} cy={145} rx={28} ry={28} fill="#ffe2b0" />
          <circle cx={100} cy={82} r={40} fill="#ff8a3d" />
          {stage >= 2
            ? <path d="M74 50 l-14 -34 l24 22Z M126 50 l14 -34 l-24 22Z" fill="#ffe2b0" />
            : <path d="M75 48 l-6 -18 l14 12Z M125 48 l6 -18 l-14 12Z" fill="#ffe2b0" />}
          <Face x={100} y={82} s={0.9} mood={mood} />
          {stage >= 2 && <Crown x={100} y={46} />}
        </g>
      )
    case 'serpent': {
      const segs = stage >= 1 ? 5 : 3
      return (
        <g>
          {Array.from({ length: segs }).map((_, i) => (
            <circle key={i} cx={150 - i * 14} cy={165 - i * 6} r={22 - i} fill={i % 2 ? '#a9a39b' : '#bdb6ad'} stroke="#7d766d" strokeWidth={3} />
          ))}
          {stage >= 1 && <path d="M58 76 L64 40 L80 64 L90 28 L100 62 L116 36 L120 76 Z" fill="#a9a39b" stroke="#7d766d" strokeWidth={3} strokeLinejoin="round" />}
          <ellipse cx={90} cy={100} rx={46} ry={40} fill="#bdb6ad" stroke="#7d766d" strokeWidth={3} />
          <path d="M70 66 l6 -14 l8 12 M104 62 l6 -14 l8 12" stroke="#7d766d" strokeWidth={4} fill="none" />
          <Face x={90} y={100} s={0.9} mood={mood} />
          {stage >= 2 && <Crown x={90} y={58} />}
        </g>
      )
    }
    case 'dove':
      return (
        <g>
          {stage >= 1 && <path d="M70 110 Q40 40 90 20 Q100 70 110 105Z" fill="#e8f2ff" stroke="#b9cce6" strokeWidth={2} />}
          {stage >= 1 && <path d="M55 125 L10 100 L18 125 L5 145 L52 138Z" fill="#e8f2ff" stroke="#b9cce6" strokeWidth={2} />}
          <path d="M50 120 Q20 90 40 70 Q70 100 90 110Z" fill="#e8f2ff" stroke="#b9cce6" strokeWidth={2} />
          <ellipse cx={105} cy={125} rx={55} ry={42} fill="#fff" stroke="#b9cce6" strokeWidth={2} />
          <path d="M100 120 Q130 70 165 95 Q140 125 110 135Z" fill="#e8f2ff" stroke="#b9cce6" strokeWidth={2} />
          <circle cx={140} cy={78} r={30} fill="#fff" stroke="#b9cce6" strokeWidth={2} />
          <path d="M168 78 l18 6 l-18 6Z" fill="#ffb347" />
          <path d="M184 86 q10 10 2 22 q-12 -6 -2 -22Z" fill="#6cc46a" />
          <Face x={140} y={78} s={0.6} mood={mood} />
          {stage >= 2 && <Crown x={140} y={50} />}
        </g>
      )
    case 'cloud': {
      const fill = mood === 'grumpy' ? '#8d95a8' : '#dff1ff'
      return (
        <g>
          {mood === 'happy' && (
            <g fill="none" strokeWidth={8} opacity={0.9}>
              {['#ff5d5d', '#ffa64d', '#ffe14d', '#5fd39a', '#5fb7ff', '#a98cff'].map((c, i) => (
                <path key={c} d={`M${30 + i * 8} 190 A ${70 - i * 8} ${70 - i * 8} 0 0 1 ${170 - i * 8} 190`} stroke={c} />
              ))}
            </g>
          )}
          <g fill={fill}>
            <circle cx={70} cy={100} r={36} />
            <circle cx={110} cy={80} r={44} />
            <circle cx={145} cy={105} r={32} />
            <rect x={50} y={100} width={110} height={40} rx={20} />
          </g>
          {mood === 'grumpy' && (
            <g fill="#7cc6ff">
              <path d="M70 150 q5 12 0 16 q-5 -4 0 -16Z" />
              <path d="M105 155 q5 12 0 16 q-5 -4 0 -16Z" />
              <path d="M140 150 q5 12 0 16 q-5 -4 0 -16Z" />
            </g>
          )}
          <Face x={108} y={102} mood={mood} />
          {stage >= 2 && <Crown x={110} y={40} />}
        </g>
      )
    }
    case 'cat':
      return (
        <g>
          <path d="M140 150 Q200 150 180 90 Q172 70 186 60" stroke="#c9a8ff" strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M62 70 l6 -36 l26 24Z M138 70 l-6 -36 l-26 24Z" fill="#c9a8ff" />
          <ellipse cx={100} cy={130} rx={44} ry={44} fill="#c9a8ff" />
          <circle cx={100} cy={88} r={42} fill="#d9c2ff" />
          <path d="M100 52 l4 9 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 l10 -1Z" fill="#fff" />
          <Face x={100} y={92} s={0.9} mood={mood} />
          {stage >= 2 && <Crown x={100} y={44} />}
        </g>
      )
    case 'sun': {
      // Grown forms: more and longer rays; the top form also has twinkles around it.
      const n = stage >= 1 ? 12 : 8
      const at = (a: number, r: number) => pt(100 + Math.cos(a) * r, 108 + Math.sin(a) * r)
      const rays = Array.from({ length: n }, (_, i) => {
        const a = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2 // no ray straight up, so the crown fits
        const len = stage === 0 ? 66 : i % 2 ? 68 : 82
        const w = stage === 0 ? 0.24 : 0.17
        return `M${at(a - w, 42)} L${at(a, len)} L${at(a + w, 42)} Z`
      }).join(' ')
      return (
        <g>
          {stage >= 2 && (
            <g fill="#fff6b0" stroke="#ffb000" strokeWidth={2} strokeLinejoin="round">
              <path d={twinklePath(28, 34, 13)} />
              <path d={twinklePath(172, 34, 13)} />
              <path d={twinklePath(22, 152, 9)} />
              <path d={twinklePath(178, 152, 9)} />
            </g>
          )}
          <path d={rays} fill="#ffa62b" stroke="#ffa62b" strokeWidth={6} strokeLinejoin="round" />
          <circle cx={100} cy={108} r={46} fill="#ffd23f" />
          <circle cx={100} cy={108} r={37} fill="#ffe27a" />
          <Face x={100} y={110} mood={mood} />
          {stage >= 2 && <Crown x={100} y={64} />}
        </g>
      )
    }
    case 'night': {
      // A sleepy night-sky puff with a moon clip. Grown forms: a starry tail, a bigger moon, then orbiting stars.
      const g = mood === 'grumpy'
      const body = g ? '#5a5d7a' : '#6f62d9'
      const belly = g ? '#7e8199' : '#a69cff'
      const glow = g ? '#c9c6a8' : '#ffe066'
      const freckle = g ? '#a9adc2' : '#fff1a8'
      return (
        <g>
          {stage >= 1 && <path d="M136 162 Q178 170 187 134 Q191 116 179 102 Q182 124 170 136 Q158 146 138 146 Z" fill={body} />}
          {stage >= 1 && <path d={starPath(178, 96, 12)} fill={glow} stroke="#e8b800" strokeWidth={2} strokeLinejoin="round" />}
          {stage >= 2 && (
            <g fill={glow} stroke="#e8b800" strokeWidth={2} strokeLinejoin="round">
              <path d={starPath(30, 62, 13)} />
              <path d={starPath(18, 108, 8)} />
              <path d={starPath(172, 44, 9)} />
            </g>
          )}
          <ellipse cx={78} cy={172} rx={14} ry={7} fill={belly} />
          <ellipse cx={122} cy={172} rx={14} ry={7} fill={belly} />
          <ellipse cx={100} cy={122} rx={54} ry={52} fill={body} />
          <ellipse cx={100} cy={154} rx={30} ry={16} fill={belly} />
          <g fill={freckle}>
            <path d={starPath(62, 100, 5)} />
            <path d={starPath(140, 106, 4)} />
            <path d={starPath(138, 144, 4.5)} />
            <path d={starPath(62, 144, 3.5)} />
          </g>
          <path transform={`translate(138 76) rotate(-15) scale(${stage >= 1 ? 1.3 : 0.95})`} d={MOON} fill={glow} stroke="#e8b800" strokeWidth={2} strokeLinejoin="round" />
          <Face x={100} y={114} mood={mood} />
          {stage >= 2 && <Crown x={100} y={74} />}
        </g>
      )
    }
    case 'lion': {
      // The mane grows with each stage, and the tail gets longer with a bigger tuft.
      const [n, R, r] = stage >= 2 ? [14, 50, 19] : stage >= 1 ? [12, 46, 18] : [10, 40, 15]
      return (
        <g>
          {stage >= 1
            ? <path d="M132 160 Q186 172 182 122" stroke="#ffb347" strokeWidth={9} fill="none" strokeLinecap="round" />
            : <path d="M132 160 Q170 168 168 138" stroke="#ffb347" strokeWidth={8} fill="none" strokeLinecap="round" />}
          <circle cx={stage >= 1 ? 182 : 168} cy={stage >= 1 ? 116 : 132} r={stage >= 2 ? 15 : stage >= 1 ? 12 : 9} fill="#e8772e" />
          <ellipse cx={100} cy={146} rx={40} ry={30} fill="#ffb347" />
          {Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2
            return <circle key={i} cx={100 + Math.cos(a) * R} cy={96 + Math.sin(a) * R} r={r} fill={i % 2 ? '#e8772e' : '#f59a3c'} />
          })}
          <circle cx={70} cy={66} r={11} fill="#ffc766" />
          <circle cx={130} cy={66} r={11} fill="#ffc766" />
          <circle cx={70} cy={66} r={5} fill="#ff9fb8" />
          <circle cx={130} cy={66} r={5} fill="#ff9fb8" />
          <circle cx={100} cy={96} r={38} fill="#ffc766" />
          <ellipse cx={100} cy={110} rx={17} ry={11} fill="#fff1d6" />
          <Face x={100} y={92} s={0.8} mood={mood} />
          <ellipse cx={100} cy={99} rx={3.5} ry={2.5} fill="#ff7fa0" />
          <ellipse cx={80} cy={172} rx={14} ry={9} fill="#ffc766" />
          <ellipse cx={120} cy={172} rx={14} ry={9} fill="#ffc766" />
          {stage >= 2 && <Crown x={100} y={60} />}
        </g>
      )
    }
    case 'goat': {
      // Horns grow from little nubs to curved horns to big curly ones; the top form gets a woolly coat.
      const g = mood === 'grumpy'
      const wool = g ? '#cdc4bb' : '#f7f1e8'
      const shade = g ? '#b3a99f' : '#e9dfd0'
      const horns = stage >= 2
        ? 'M86 68 Q70 28 44 36 Q24 46 32 66 Q40 80 54 70 M114 68 Q130 28 156 36 Q176 46 168 66 Q160 80 146 70'
        : stage >= 1 ? 'M86 68 Q74 32 50 38 M114 68 Q126 32 150 38' : 'M88 68 Q84 50 76 42 M112 68 Q116 50 124 42'
      return (
        <g>
          {stage >= 2 && (
            <g fill={wool}>
              <circle cx={60} cy={128} r={12} />
              <circle cx={56} cy={146} r={11} />
              <circle cx={140} cy={128} r={12} />
              <circle cx={144} cy={146} r={11} />
            </g>
          )}
          <rect x={76} y={146} width={14} height={30} rx={6} fill={shade} />
          <rect x={110} y={146} width={14} height={30} rx={6} fill={shade} />
          <rect x={76} y={168} width={14} height={8} rx={3} fill="#6b7890" />
          <rect x={110} y={168} width={14} height={8} rx={3} fill="#6b7890" />
          <ellipse cx={100} cy={136} rx={42} ry={26} fill={wool} />
          <path d={horns} stroke="#8d9bb3" strokeWidth={stage >= 1 ? 12 : 10} strokeLinecap="round" fill="none" />
          <ellipse cx={60} cy={96} rx={18} ry={8} fill={shade} transform="rotate(20 60 96)" />
          <ellipse cx={140} cy={96} rx={18} ry={8} fill={shade} transform="rotate(-20 140 96)" />
          <ellipse cx={100} cy={96} rx={36} ry={34} fill={wool} />
          {stage >= 1 && <path d="M90 124 Q100 152 110 124 Z" fill={shade} />}
          {stage >= 1 && (
            <g fill={wool}>
              <circle cx={89} cy={65} r={9} />
              <circle cx={100} cy={60} r={10} />
              <circle cx={111} cy={65} r={9} />
            </g>
          )}
          <ellipse cx={100} cy={114} rx={20} ry={11} fill={shade} />
          <Face x={100} y={98} s={0.8} mood={mood} />
          {g && (
            <g fill="#eef2f7" stroke="#b8c3d3" strokeWidth={1.5}>
              <circle cx={50} cy={122} r={7} /><circle cx={42} cy={115} r={6} /><circle cx={35} cy={123} r={5} />
              <circle cx={150} cy={122} r={7} /><circle cx={158} cy={115} r={6} /><circle cx={165} cy={123} r={5} />
            </g>
          )}
          {stage >= 2 && <Crown x={100} y={62} />}
        </g>
      )
    }
    case 'whale': {
      // Grown forms: a bigger tail, a flipper and a tall spout; the top form blows bubbles.
      const big = stage >= 1
      const body = '#7f9cff'
      return (
        <g>
          <g fill="#a8e0ff" stroke="#6cbcf0" strokeWidth={2}>
            <path d={big ? 'M118 90 V40' : 'M118 90 V62'} stroke="#a8e0ff" strokeWidth={7} strokeLinecap="round" />
            {big ? (
              <>
                <circle cx={102} cy={44} r={7} /><circle cx={118} cy={34} r={8} /><circle cx={134} cy={44} r={7} />
                <circle cx={93} cy={58} r={5} /><circle cx={143} cy={58} r={5} />
              </>
            ) : (
              <><circle cx={108} cy={60} r={5} /><circle cx={118} cy={54} r={6} /><circle cx={128} cy={60} r={5} /></>
            )}
          </g>
          {stage >= 2 && (
            <g fill="#eaf7ff" stroke="#7cc6ff" strokeWidth={2.5}>
              <circle cx={30} cy={72} r={8} /><circle cx={46} cy={50} r={5} /><circle cx={20} cy={100} r={5} />
            </g>
          )}
          <path d={big ? 'M140 150 Q176 146 174 104' : 'M140 150 Q170 146 170 118'} stroke={body} strokeWidth={big ? 22 : 18} fill="none" strokeLinecap="round" />
          <path transform={big ? 'translate(174 100) scale(1.15)' : 'translate(170 114) scale(0.85)'} d="M0 6 Q-20 -2 -18 -18 Q-8 -12 0 -4 Q8 -12 18 -18 Q20 -2 0 6 Z" fill={body} />
          {big && <path d="M50 146 Q22 150 16 172 Q40 178 62 160 Z" fill="#6a85ea" />}
          <ellipse cx={96} cy={128} rx={62} ry={46} fill={body} />
          <ellipse cx={94} cy={150} rx={40} ry={20} fill="#e3e9ff" />
          <path d="M66 152 Q94 160 122 152 M72 162 Q94 168 116 162" stroke="#c3cdf7" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {!big && <path d="M60 140 Q42 150 46 164 Q60 160 70 148 Z" fill="#6a85ea" />}
          <Face x={84} y={120} s={0.85} mood={mood} />
          {stage >= 2 && <Crown x={80} y={86} />}
        </g>
      )
    }
    case 'wave': {
      // A curl of sea water. Grown forms: a bigger curl plus a second little one; the top form throws spray.
      const g = mood === 'grumpy'
      const body = g ? '#56789c' : '#5fb7ff'
      const light = g ? '#86a0bc' : '#bfe6ff'
      const foam = g ? '#d5dde7' : '#ffffff'
      const big = stage >= 1
      // The crest curls over and spirals in on itself, like a breaking wave.
      const crest = big
        ? 'M124 94 Q130 40 90 40 Q56 42 58 70 Q62 88 80 80 Q92 74 88 62 Q84 56 78 60'
        : 'M120 94 Q122 54 94 54 Q70 56 72 74 Q76 86 88 80 Q96 74 92 66'
      const foamX = big ? [44, 60, 76, 92, 108, 124, 140, 156] : [56, 74, 92, 110, 128, 146]
      return (
        <g>
          {stage >= 2 && (
            <g fill={light} stroke={body} strokeWidth={2}>
              <circle cx={44} cy={38} r={5} /><circle cx={34} cy={56} r={4} />
              <circle cx={176} cy={62} r={5} /><circle cx={186} cy={78} r={3.5} />
            </g>
          )}
          {big && (
            <>
              <path d="M136 100 Q146 70 164 76 Q178 82 172 96 Q166 104 158 98" stroke={body} strokeWidth={14} fill="none" strokeLinecap="round" />
              <path d="M136 100 Q146 70 164 76 Q178 82 172 96 Q166 104 158 98" stroke={light} strokeWidth={4} fill="none" strokeLinecap="round" />
            </>
          )}
          <path d={crest} stroke={body} strokeWidth={big ? 18 : 15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={crest} stroke={light} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={100} cy={128} rx={56} ry={46} fill={body} />
          <ellipse cx={100} cy={152} rx={32} ry={16} fill={light} />
          <g fill={foam} stroke={light} strokeWidth={2}>
            {foamX.map((x) => <circle key={x} cx={x} cy={170} r={big ? 12 : 11} />)}
          </g>
          <Face x={100} y={116} mood={mood} />
          {stage >= 2 && <Crown x={94} y={32} />}
        </g>
      )
    }
    case 'donkey': {
      // Ears get longer and a mane appears; it carries one basket, then two, then baskets with fish.
      const body = '#b5a8c8'
      const ear = stage >= 1 ? 32 : 25
      return (
        <g>
          <ellipse cx={82} cy={70 - ear} rx={11} ry={ear} fill={body} transform="rotate(-22 82 70)" />
          <ellipse cx={118} cy={70 - ear} rx={11} ry={ear} fill={body} transform="rotate(22 118 70)" />
          <ellipse cx={82} cy={72 - ear} rx={5} ry={ear - 9} fill="#ffb8d2" transform="rotate(-22 82 70)" />
          <ellipse cx={118} cy={72 - ear} rx={5} ry={ear - 9} fill="#ffb8d2" transform="rotate(22 118 70)" />
          <rect x={74} y={152} width={14} height={24} rx={6} fill={body} />
          <rect x={112} y={152} width={14} height={24} rx={6} fill={body} />
          <rect x={74} y={168} width={14} height={8} rx={3} fill="#6d5f84" />
          <rect x={112} y={168} width={14} height={8} rx={3} fill="#6d5f84" />
          <ellipse cx={100} cy={140} rx={44} ry={28} fill={body} />
          {stage >= 1
            ? <><Basket x={52} y={140} fish={stage >= 2} /><Basket x={148} y={140} fish={stage >= 2} /></>
            : <Basket x={146} y={142} s={0.85} />}
          <ellipse cx={100} cy={90} rx={34} ry={32} fill={body} />
          {stage >= 1 && <path d="M84 66 L88 50 L95 60 L100 44 L105 60 L112 50 L116 66 Z" fill="#8b7da3" strokeLinejoin="round" stroke="#8b7da3" strokeWidth={2} />}
          <ellipse cx={100} cy={110} rx={24} ry={14} fill="#efe7f6" />
          <circle cx={90} cy={114} r={2.4} fill="#8b7da3" />
          <circle cx={110} cy={114} r={2.4} fill="#8b7da3" />
          <Face x={100} y={90} s={0.8} mood={mood} />
          {stage >= 2 && <Crown x={100} y={62} />}
        </g>
      )
    }
    case 'crab': {
      // The claws grow bigger and reach higher; the top form gets a spiky shell.
      const g = mood === 'grumpy'
      const shell = g ? '#cf4a3a' : '#ff7f5c'
      const pale = g ? '#e58a78' : '#ffc0a8'
      const claw = stage >= 2 ? 1.35 : stage >= 1 ? 1.15 : 0.85
      const [cx, cy] = stage >= 1 ? [30, 66] : [38, 90]
      return (
        <g>
          <g stroke={shell} strokeWidth={7} strokeLinecap="round" fill="none">
            <path d="M52 140 Q34 148 32 166 M58 152 Q46 162 46 178 M148 140 Q166 148 168 166 M142 152 Q154 162 154 178" />
            {stage >= 1 && <path d="M48 128 Q28 130 20 148 M152 128 Q172 130 180 148" />}
            <path d={stage >= 1 ? 'M54 118 Q30 104 30 66 M146 118 Q170 104 170 66' : 'M56 120 Q40 112 38 90 M144 120 Q160 112 162 90'} strokeWidth={9} />
          </g>
          <path transform={`translate(${cx} ${cy}) rotate(-25) scale(${claw})`} d={CLAW} fill={shell} />
          <path transform={`translate(${200 - cx} ${cy}) rotate(25) scale(${claw})`} d={CLAW} fill={shell} />
          {stage >= 2 && <path d="M54 108 L58 88 L70 102 Z M68 98 L76 80 L86 96 Z M146 108 L142 88 L130 102 Z M132 98 L124 80 L114 96 Z" fill={shell} stroke={shell} strokeWidth={3} strokeLinejoin="round" />}
          <ellipse cx={100} cy={128} rx={58} ry={40} fill={shell} />
          <ellipse cx={100} cy={142} rx={34} ry={20} fill={pale} />
          <Face x={100} y={122} mood={mood} />
          {stage >= 2 && <Crown x={100} y={92} />}
        </g>
      )
    }
    case 'lamb': {
      // The wool gets fluffier with each stage; the top form wears a pink scarf.
      const [Rx, Ry, r, n] = stage >= 2 ? [48, 25, 20, 12] : stage >= 1 ? [44, 25, 19, 11] : [36, 24, 17, 9]
      const puffs = Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2
        return [100 + Math.cos(a) * Rx, 128 + Math.sin(a) * Ry]
      })
      const tuft = stage >= 1
        ? [[80, 68, 10], [90, 57, 11], [100, 53, 12], [110, 57, 11], [120, 68, 10]]
        : [[88, 64, 9], [100, 59, 10], [112, 64, 9]]
      return (
        <g>
          <rect x={78} y={150} width={12} height={34} rx={5} fill="#f4bfd2" />
          <rect x={110} y={150} width={12} height={34} rx={5} fill="#f4bfd2" />
          <rect x={78} y={177} width={12} height={7} rx={3} fill="#7a6070" />
          <rect x={110} y={177} width={12} height={7} rx={3} fill="#7a6070" />
          {puffs.map(([x, y], i) => <circle key={`e${i}`} cx={x} cy={y} r={r + 3} fill="#f2cfe0" />)}
          {puffs.map(([x, y], i) => <circle key={`w${i}`} cx={x} cy={y} r={r} fill="#fff" />)}
          <ellipse cx={100} cy={128} rx={Rx} ry={Ry} fill="#fff" />
          <path d={starPath(100, 146, 9)} fill="#ffd34d" stroke="#e8b400" strokeWidth={2} strokeLinejoin="round" />
          {stage >= 2 && (
            <g fill="#ff5d9e">
              <path d="M122 124 Q156 110 184 124 L176 138 Q152 128 126 136 Z" />
              <path d="M70 116 Q100 134 130 116 L132 126 Q100 146 68 126 Z" />
            </g>
          )}
          <ellipse cx={64} cy={96} rx={17} ry={8} fill="#ffc2d6" transform="rotate(20 64 96)" />
          <ellipse cx={136} cy={96} rx={17} ry={8} fill="#ffc2d6" transform="rotate(-20 136 96)" />
          <ellipse cx={100} cy={94} rx={32} ry={30} fill="#ffe6ee" />
          {tuft.map(([x, y, tr]) => <circle key={`te${x}`} cx={x} cy={y} r={tr + 2.5} fill="#f2cfe0" />)}
          {tuft.map(([x, y, tr]) => <circle key={`tw${x}`} cx={x} cy={y} r={tr} fill="#fff" />)}
          <Face x={100} y={100} s={0.8} mood={mood} />
          {stage >= 2 && <Crown x={100} y={46} />}
        </g>
      )
    }
    case 'snow': {
      // Grown forms: twig arms and a bigger snowflake; the top form has mittens and falling snowflakes.
      const g = mood === 'grumpy'
      const snow = g ? '#c2d4e8' : '#ffffff'
      const edge = g ? '#93abc8' : '#cfe2f4'
      const scarf = g ? '#7a8aa0' : '#ff5d9e'
      const flake = g ? '#6f87a6' : '#7cc6ff'
      return (
        <g>
          {stage >= 1 && <path d="M70 140 L34 116 M46 124 L40 108 M130 140 L166 116 M154 124 L160 108" stroke="#9a6a48" strokeWidth={5} strokeLinecap="round" fill="none" />}
          {stage >= 2 && (
            <>
              <circle cx={32} cy={114} r={9} fill={scarf} />
              <circle cx={168} cy={114} r={9} fill={scarf} />
              <Snowflake x={34} y={62} r={9} color={flake} />
              <Snowflake x={168} y={48} r={8} color={flake} />
            </>
          )}
          <circle cx={100} cy={144} r={32} fill={snow} stroke={edge} strokeWidth={3} />
          <g fill={scarf}>
            <circle cx={100} cy={146} r={3.5} />
            <circle cx={100} cy={158} r={3.5} />
          </g>
          <path d="M74 126 L66 162 L82 164 L88 130 Z" fill={scarf} strokeLinejoin="round" stroke={scarf} strokeWidth={2} />
          <circle cx={100} cy={90} r={36} fill={snow} stroke={edge} strokeWidth={3} />
          <path d="M66 118 Q100 136 134 118 L136 128 Q100 148 64 128 Z" fill={scarf} strokeLinejoin="round" stroke={scarf} strokeWidth={2} />
          <Face x={100} y={92} s={0.85} mood={mood} />
          <Snowflake x={130} y={60} r={stage >= 1 ? 13 : 10} color={flake} />
          {stage >= 2 && <Crown x={96} y={56} />}
        </g>
      )
    }
    case 'cupcake': {
      // Grown forms: a tall swirl of frosting; the top form has birthday candles and a crown instead of a cherry.
      const frosting = (props: { fill: string; stroke?: string; strokeWidth?: number }) => (
        <g {...props}>
          {[58, 72, 86, 100, 114, 128, 142].map((x) => <circle key={x} cx={x} cy={128} r={11} />)}
          <ellipse cx={100} cy={104} rx={50} ry={32} />
          {stage >= 1 && <ellipse cx={100} cy={74} rx={34} ry={15} />}
          {stage >= 1 && <ellipse cx={100} cy={56} rx={21} ry={11} />}
        </g>
      )
      const colors = ['#ff5d9e', '#ffc928', '#7cc6ff', '#5fd39a', '#9b8cff']
      const sprinkles = [[64, 96, 30], [78, 82, -40], [122, 82, 40], [136, 96, -25], [100, 82, 90], [58, 112, 10], [142, 112, -10],
        ...(stage >= 1 ? [[84, 76, 20], [116, 74, -30], [94, 56, -60], [108, 58, 45]] : [])]
      return (
        <g>
          {stage >= 2 && (
            <>
              <rect x={52} y={64} width={9} height={30} rx={3} fill="#7cc6ff" />
              <rect x={139} y={64} width={9} height={30} rx={3} fill="#5fd39a" />
              <path d="M52 74 l9 -4 M52 84 l9 -4 M139 74 l9 -4 M139 84 l9 -4" stroke="#fff" strokeWidth={2} />
              <path d="M56.5 48 Q64 57 56.5 63 Q49 57 56.5 48 Z M143.5 48 Q151 57 143.5 63 Q136 57 143.5 48 Z" fill="#ffc928" stroke="#ff9b4a" strokeWidth={1.5} />
            </>
          )}
          <ellipse cx={82} cy={176} rx={12} ry={6} fill="#ff5d9e" />
          <ellipse cx={118} cy={176} rx={12} ry={6} fill="#ff5d9e" />
          <path d="M54 128 L146 128 L134 174 L66 174 Z" fill="#ff8cc0" stroke="#ff5d9e" strokeWidth={3} strokeLinejoin="round" />
          <path d={Array.from({ length: 6 }, (_, i) => `M${pt(54 + (92 * (i + 1)) / 7, 130)} L${pt(66 + (68 * (i + 1)) / 7, 172)}`).join(' ')} stroke="#ff5d9e" strokeWidth={2.5} />
          {frosting({ fill: '#ffb3d1', stroke: '#ffb3d1', strokeWidth: 6 })}
          {frosting({ fill: '#fff2f8' })}
          {sprinkles.map(([x, y, a], i) => (
            <rect key={i} x={x - 4.5} y={y - 1.75} width={9} height={3.5} rx={1.75} fill={colors[i % colors.length]} transform={`rotate(${a} ${x} ${y})`} />
          ))}
          {stage < 2 && (
            <>
              <path d={stage >= 1 ? 'M100 34 Q102 24 110 22' : 'M100 58 Q102 48 110 46'} stroke="#5fb36a" strokeWidth={3} fill="none" strokeLinecap="round" />
              <circle cx={100} cy={stage >= 1 ? 40 : 64} r={stage >= 1 ? 8 : 9} fill="#ff3b6b" />
              <circle cx={97} cy={stage >= 1 ? 37 : 61} r={2.5} fill="#fff" opacity={0.7} />
            </>
          )}
          <Face x={100} y={106} s={0.85} mood={mood} />
          {stage >= 2 && <Crown x={100} y={47} />}
        </g>
      )
    }
    case 'balloon': {
      // Grown forms: two buddy balloons on ribbons; the top form adds a big bow.
      const g = mood === 'grumpy'
      const skin = g ? '#b9809e' : '#ff5d9e'
      return (
        <g>
          {stage >= 1 && (
            <>
              <path d="M34 89 Q44 140 100 166 M166 79 Q156 140 100 166" stroke="#9a8cb0" strokeWidth={2} fill="none" />
              <ellipse cx={34} cy={62} rx={17} ry={21} fill="#ffc928" />
              <path d="M34 82 L30 89 L38 89 Z" fill="#ffc928" />
              <ellipse cx={28} cy={54} rx={4} ry={7} fill="#fff" opacity={0.55} transform="rotate(30 28 54)" />
              <ellipse cx={166} cy={52} rx={17} ry={21} fill="#7cc6ff" />
              <path d="M166 72 L162 79 L170 79 Z" fill="#7cc6ff" />
              <ellipse cx={160} cy={44} rx={4} ry={7} fill="#fff" opacity={0.55} transform="rotate(30 160 44)" />
            </>
          )}
          <path d="M100 166 Q90 174 100 182 Q110 190 100 196" stroke="#9a8cb0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d="M100 156 L93 166 L107 166 Z" fill={skin} strokeLinejoin="round" stroke={skin} strokeWidth={2} />
          <ellipse cx={100} cy={100} rx={52} ry={58} fill={skin} />
          <ellipse cx={76} cy={72} rx={8} ry={15} fill="#fff" opacity={0.55} transform="rotate(35 76 72)" />
          <Face x={100} y={104} mood={mood} />
          {stage >= 2 && (
            <g fill="#ffe14d" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round">
              <path d="M98 170 Q90 182 84 190 M102 170 Q112 182 118 190" fill="none" strokeWidth={4} strokeLinecap="round" />
              <path d="M100 166 Q78 152 76 166 Q78 180 100 166 Z M100 166 Q122 152 124 166 Q122 180 100 166 Z" />
              <circle cx={100} cy={166} r={5} />
            </g>
          )}
          {stage >= 2 && <Crown x={100} y={46} />}
        </g>
      )
    }
  }
}

export default function PalArt({ pal, stage = 0, mood = 'happy', size = 160, silhouette, className }: Props) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}
      style={silhouette ? { filter: 'brightness(0) opacity(0.25)' } : undefined} aria-hidden>
      <g transform={`translate(100 110) scale(${0.85 + stage * 0.08}) translate(-100 -110)`}>
        <Body species={pal.species} stage={stage} mood={mood} />
      </g>
    </svg>
  )
}
