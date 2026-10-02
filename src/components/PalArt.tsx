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
