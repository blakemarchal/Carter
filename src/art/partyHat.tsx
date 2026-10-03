// A striped party hat with a pom-pom: on every Pal at a birthday party, and the birthday outfit.
// Drawn in its own 60 x 70 box; (30, 66) is the brim's middle.
export function PartyHatShape({ color = '#ff6fae', stripe = '#ffd34d', pom = '#5fb7ff' }: { color?: string; stripe?: string; pom?: string }) {
  return (
    <g>
      <path d="M8 64 L30 8 L52 64 Q30 72 8 64 Z" fill={color} stroke="#c2407e" strokeWidth={3} strokeLinejoin="round" />
      <path d="M15 46 Q30 52 45 46 M21 30 Q30 34 39 30" stroke={stripe} strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={23} cy={56} r={3} fill="#fff" opacity={0.85} />
      <circle cx={37} cy={40} r={2.5} fill="#fff" opacity={0.85} />
      <path d="M8 64 Q30 72 52 64" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9} />
      <circle cx={30} cy={8} r={8} fill={pom} stroke="#3a8fd0" strokeWidth={2.5} />
      <circle cx={27} cy={5} r={2.5} fill="#fff" opacity={0.7} />
    </g>
  )
}

/** The hat as an HTML element (for Pals drawn on screens rather than in pictures). */
export function PartyHat({ size = 60, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 74" width={size} height={size * (74 / 60)} aria-hidden>
      <PartyHatShape />
    </svg>
  )
}
