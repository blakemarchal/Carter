// Drawn things first needed by the Pentecost island (its activities and pictures). Same style and rules as the other item
// files: one 100 x 100 drawing each (see ./farm.tsx), and an emoji only when the drawing is what that emoji means. Every
// item can be used anywhere once it's here.
import { useId } from 'react'
import type { Item } from './types'

const gid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')

/** A flame's shape: a teardrop with a round foot at (x, y) and its tip h above, w wide each side. */
const drop = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y - h} C${x + w * 0.35} ${y - h * 0.72} ${x + w} ${y - h * 0.52} ${x + w} ${y - h * 0.3} C${x + w} ${y - h * 0.08} ${x + w * 0.55} ${y} ${x} ${y} `
  + `C${x - w * 0.55} ${y} ${x - w} ${y - h * 0.08} ${x - w} ${y - h * 0.3} C${x - w} ${y - h * 0.52} ${x - w * 0.35} ${y - h * 0.72} ${x} ${y - h} Z`

/** A little four-pointed twinkle. */
const twinkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`

/**
 * A little flame of God's light, as at Pentecost (Acts 2:3): a soft, warm flame like a candle's (with no candle), glowing,
 * with a swirl of the rushing wind curling round under it and a few twinkles. It's gentle light: it never burns.
 */
function PentecostFlame() {
  const id = gid(useId())
  const swirl = 'M10 76 C26 88 54 90 74 79 C86 72 91 59 83 52 C76 46 68 53 73 58'
  return (
    <g>
      <defs>
        <radialGradient id={`${id}g`} cx="50%" cy="54%" r="50%">
          <stop offset="0" stopColor="#fff4c0" stopOpacity={1} />
          <stop offset="0.5" stopColor="#ffd97a" stopOpacity={0.45} />
          <stop offset="1" stopColor="#ffd06a" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffbe48" />
          <stop offset="1" stopColor="#ff8a3a" />
        </linearGradient>
      </defs>
      <circle cx={50} cy={52} r={47} fill={`url(#${id}g)`} />
      {/* the wind, swirling round under the flame */}
      <path d={swirl} fill="none" stroke="#8fbfe4" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={swirl} fill="none" stroke="#ffffff" strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />
      {/* the flame, three colors deep */}
      <path d={drop(50, 76, 17, 62)} fill={`url(#${id}f)`} stroke="#e8742a" strokeWidth={2.4} strokeLinejoin="round" />
      <path d={drop(50, 74, 11.5, 43)} fill="#ffd65c" />
      <path d={drop(50, 72, 6.4, 24)} fill="#fff9de" />
      <ellipse cx={43} cy={44} rx={2.6} ry={6} fill="#fff" opacity={0.45} transform="rotate(14 43 44)" />
      {[[20, 28, 6], [82, 22, 5], [24, 54, 3.6], [86, 38, 3.4]].map(([x, y, r], i) => <path key={i} d={twinkle(x, y, r)} fill="#fff3a6" stroke="#f0b43a" strokeWidth={1.2} strokeLinejoin="round" />)}
    </g>
  )
}

export const ISL_PENTECOST: Item[] = [
  { id: 'pentecost-flame', name: 'a little flame of light', Draw: PentecostFlame },
]
