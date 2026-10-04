// Scout, Trailpaw, Homefinder (The Lost Sheep): a fluffy sheepdog puppy with floppy ears.
// PLACEHOLDER: a plain round body until the real drawing is made (see the other species files).
import { type BodyProps, CuteFace, ink, useShade } from '../kit'

export default function Puppy({ stage, mood }: BodyProps) {
  const body = useShade(mood === 'grumpy' ? '#a8a0b0' : '#e0b07a', 0.35, 0.18)
  return (
    <g>
      <defs>{body.def}</defs>
      <ellipse cx={100} cy={110} rx={52 + stage * 4} ry={48 + stage * 4} fill={body.fill} stroke={ink('#e0b07a')} strokeWidth={3} />
      <CuteFace x={100} y={100} s={0.9} mood={mood} />
    </g>
  )
}
