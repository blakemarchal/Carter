// A round portrait: someone's head and shoulders, drawn just as they are in the stories
// (art/people.tsx Person), on a soft circle of their color. For grown-ups (lib/avatars.ts) and children
// (their story look). It blinks and breathes like everyone else in the game.
import { useId } from 'react'
import { lighten } from '../art/kit'
import { Person, type Look } from '../art/people'

export default function Avatar({ look, size = 64, className = '' }: { look: Look; size?: number; className?: string }) {
  const id = `av${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  // (a child is drawn smaller: the same crop, scaled to them)
  const k = look.build === 'child' ? 0.74 : 1
  const cx = 0, cy = -122 * k, r = 46 * k
  return (
    <svg className={`avatar pa-anim ${className}`} width={size} height={size} viewBox={`${cx - r} ${cy - r} ${r * 2} ${r * 2}`} aria-hidden>
      <defs><clipPath id={id}><circle cx={cx} cy={cy} r={r} /></clipPath></defs>
      <circle cx={cx} cy={cy} r={r} fill={lighten(look.robe, 0.6)} />
      <g clipPath={`url(#${id})`}><Person x={0} y={0} look={look} /></g>
      <circle cx={cx} cy={cy} r={r - 1.5} fill="none" stroke={lighten(look.robe, 0.25)} strokeWidth={3} />
    </svg>
  )
}
