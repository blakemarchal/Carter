// Battle art: the Friend Ball (our own design: pink top, white bottom, gold band, heart button)
// and Grumbleshade, the pouty shadow who makes creatures grumpy. Grumbleshade is cartoonish and
// sulky, never scary: a dusky purple cloud with glowing eyes and a big pout.
import type { CSSProperties } from 'react'
import { useShade } from './kit'

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

export function Grumbleshade({ size = 160, className = '', style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 160" width={size} height={size * 0.8} className={`pa-anim ${className}`} style={style} aria-hidden>
      <defs>
        <radialGradient id="gshade" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#8a6bc0" /><stop offset="0.6" stopColor="#5b3f8f" /><stop offset="1" stopColor="#38245e" />
        </radialGradient>
      </defs>
      <g className="pa-float">
        {/* wispy cloud body */}
        <path d="M30 110 C10 108 6 80 26 72 C20 44 52 30 70 46 C78 22 120 18 132 44 C152 34 180 50 172 76 C192 84 188 112 166 112 C150 132 120 124 110 118 C96 132 64 132 52 118 C44 124 32 120 30 110 Z"
          fill="url(#gshade)" stroke="#2a1848" strokeWidth={4} strokeLinejoin="round" />
        {/* wisps trailing below */}
        {[60, 100, 140].map((x, i) => (
          <path key={x} className="pa-tail" style={{ '--o': '50% 0%', animationDelay: `${i * 0.3}s` } as CSSProperties}
            d={`M${x} 118 q-8 14 2 24 q-12 -2 -14 -12`} fill="none" stroke="#5b3f8f" strokeWidth={8} strokeLinecap="round" />
        ))}
        {/* glowing eyes and a big pout */}
        <path d="M66 70 L88 78 M134 70 L112 78" stroke="#2a1848" strokeWidth={5} strokeLinecap="round" />
        <ellipse className="pa-blink" cx={80} cy={86} rx={9} ry={7} fill="#ffe14d" />
        <ellipse className="pa-blink" cx={120} cy={86} rx={9} ry={7} fill="#ffe14d" />
        <circle cx={82} cy={87} r={3.5} fill="#2a1848" />
        <circle cx={118} cy={87} r={3.5} fill="#2a1848" />
        <path d="M86 108 Q100 98 114 108 Q100 104 86 108 Z" fill="#2a1848" stroke="#2a1848" strokeWidth={3} strokeLinejoin="round" />
      </g>
    </svg>
  )
}
