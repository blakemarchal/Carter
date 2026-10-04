// Battle art: the Friend Ball (our own design: pink top, white bottom, gold band, heart button)
// and Grumbleshade, the pouty shadow who makes creatures grumpy. Grumbleshade is cartoonish and
// sulky, never scary: a dusky purple cloud with glowing eyes and a big pout. On Easter Morning he
// listens, then smiles (data/shade.ts); after that a battle has a little grumpy cloud instead.
import type { CSSProperties } from 'react'
import { useShade } from './kit'

/**
 * Grumbleshade's face: his usual pout, listening to the happy news, and his very first smile.
 * `light`: his shadow turned all to light (no face), the moment before he's Gladshade.
 */
export type ShadeFace = 'pout' | 'listen' | 'smile' | 'light'

export function FriendBall({ size = 80, open = false, className = '' }: { size?: number; open?: boolean; className?: string }) {
  const top = useShade('#ff6fae', 0.4, 0.15)
  const bottom = useShade('#ffffff', 0.2, 0.1)
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>{top.def}{bottom.def}</defs>
      <g transform={open ? 'translate(0 -14) rotate(-25 20 50)' : undefined}>
        <path d="M6 50 A44 44 0 0 1 94 50 Z" fill={top.fill} stroke="#c2407e" strokeWidth={4} />
        <ellipse cx={34} cy={26} rx={10} ry={6} fill="#fff" opacity={0.6} transform="rotate(-30 34 26)" />
      </g>
      {open && <circle cx={50} cy={50} r={30} fill="#fff6b0" opacity={0.9} />}
      <path d="M6 50 A44 44 0 0 0 94 50 Z" fill={bottom.fill} stroke="#c9b7c4" strokeWidth={4} />
      <rect x={4} y={46} width={92} height={8} fill="#ffd34d" stroke="#d9a400" strokeWidth={2} />
      <circle cx={50} cy={50} r={14} fill="#fff" stroke="#d9a400" strokeWidth={4} />
      <path d="M50 57 C42 51 42 44 46 43 C48 42.5 50 44 50 46 C50 44 52 42.5 54 43 C58 44 58 51 50 57 Z" fill="#ff6fae" />
    </svg>
  )
}

export function Grumbleshade({ size = 160, className = '', style, face = 'pout' }: {
  size?: number; className?: string; style?: CSSProperties; face?: ShadeFace
}) {
  const light = face === 'light'
  const ink = light ? '#ffe7a0' : '#2a1848'
  // (smiling, he's already a little lighter; then all light)
  const grad = light ? 'gshade-light' : face === 'smile' ? 'gshade-glad' : 'gshade'
  return (
    <svg viewBox="0 0 200 160" width={size} height={size * 0.8} className={`pa-anim ${className}`} style={style} aria-hidden>
      <defs>
        <radialGradient id="gshade" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#8a6bc0" /><stop offset="0.6" stopColor="#5b3f8f" /><stop offset="1" stopColor="#38245e" />
        </radialGradient>
        <radialGradient id="gshade-glad" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#c4ace8" /><stop offset="0.6" stopColor="#8a6bc0" /><stop offset="1" stopColor="#5b3f8f" />
        </radialGradient>
        <radialGradient id="gshade-light" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ffffff" /><stop offset="0.7" stopColor="#fffdf0" /><stop offset="1" stopColor="#fff3c4" />
        </radialGradient>
      </defs>
      <g className="pa-float">
        {/* wispy cloud body */}
        <path d="M30 110 C10 108 6 80 26 72 C20 44 52 30 70 46 C78 22 120 18 132 44 C152 34 180 50 172 76 C192 84 188 112 166 112 C150 132 120 124 110 118 C96 132 64 132 52 118 C44 124 32 120 30 110 Z"
          fill={`url(#${grad})`} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        {/* wisps trailing below */}
        {[60, 100, 140].map((x, i) => (
          <path key={x} className="pa-tail" style={{ '--o': '50% 0%', animationDelay: `${i * 0.3}s` } as CSSProperties}
            d={`M${x} 118 q-8 14 2 24 q-12 -2 -14 -12`} fill="none" stroke={light ? '#fffbe6' : face === 'smile' ? '#8a6bc0' : '#5b3f8f'} strokeWidth={8} strokeLinecap="round" />
        ))}
        {face === 'pout' && (
          <>
            {/* glowing eyes and a big pout */}
            <path d="M66 70 L88 78 M134 70 L112 78" stroke={ink} strokeWidth={5} strokeLinecap="round" />
            <ellipse className="pa-blink" cx={80} cy={86} rx={9} ry={7} fill="#ffe14d" />
            <ellipse className="pa-blink" cx={120} cy={86} rx={9} ry={7} fill="#ffe14d" />
            <circle cx={82} cy={87} r={3.5} fill={ink} />
            <circle cx={118} cy={87} r={3.5} fill={ink} />
            <path d="M86 108 Q100 98 114 108 Q100 104 86 108 Z" fill={ink} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
          </>
        )}
        {face === 'listen' && (
          <>
            {/* brows up, big round eyes looking up, a little "oh" */}
            <path d="M66 74 Q76 66 88 66 M134 74 Q124 66 112 66" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
            <ellipse className="pa-blink" cx={80} cy={86} rx={10} ry={10} fill="#ffe14d" />
            <ellipse className="pa-blink" cx={120} cy={86} rx={10} ry={10} fill="#ffe14d" />
            <circle cx={80} cy={83} r={4.5} fill={ink} />
            <circle cx={120} cy={83} r={4.5} fill={ink} />
            <circle cx={82} cy={81} r={1.6} fill="#fff" />
            <circle cx={122} cy={81} r={1.6} fill="#fff" />
            <ellipse cx={100} cy={108} rx={5} ry={6} fill={ink} />
          </>
        )}
        {face === 'smile' && (
          <>
            {/* happy eyes, rosy cheeks and his very first smile */}
            <path d="M68 72 Q78 66 88 70 M132 72 Q122 66 112 70" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
            <path d="M70 90 Q80 78 90 90 M110 90 Q120 78 130 90" fill="none" stroke="#ffe14d" strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={62} cy={100} rx={9} ry={5.5} fill="#ff8cc0" opacity={0.7} />
            <ellipse cx={138} cy={100} rx={9} ry={5.5} fill="#ff8cc0" opacity={0.7} />
            <path d="M84 100 Q100 120 116 100 Q100 108 84 100 Z" fill={ink} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
          </>
        )}
      </g>
    </svg>
  )
}

/** After Easter Morning: the little grumpy cloud that hides in a creature now (it pops into sparkles). */
export function GrumpyCloud({ size = 120, className = '', style }: { size?: number; className?: string; style?: CSSProperties }) {
  const ink = '#57527a'
  return (
    <svg viewBox="0 0 200 160" width={size} height={size * 0.8} className={`pa-anim ${className}`} style={style} aria-hidden>
      <defs>
        <radialGradient id="gcloud" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#e4e1f0" /><stop offset="0.65" stopColor="#b3aecb" /><stop offset="1" stopColor="#8f89ad" />
        </radialGradient>
      </defs>
      <g className="pa-float">
        <path d="M46 118 C22 118 18 90 40 84 C36 58 66 48 80 64 C88 40 126 38 132 64 C150 52 176 68 166 92 C184 98 178 120 158 120 Z"
          fill="url(#gcloud)" stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        {/* a cross little face */}
        <path d="M74 84 L88 89 M126 84 L112 89" stroke={ink} strokeWidth={4} strokeLinecap="round" />
        <circle className="pa-blink" cx={84} cy={98} r={5} fill={ink} />
        <circle className="pa-blink" cx={116} cy={98} r={5} fill={ink} />
        <path d="M89 112 Q100 104 111 112" fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" />
      </g>
    </svg>
  )
}
