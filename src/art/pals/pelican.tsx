// Gulp, Pouchbill, Netkeeper (Fishers of People): a big, friendly white pelican with a stretchy beak pouch.
// PLACEHOLDER: a plain round body until the real drawing is made (see the other species files).
import { type BodyProps, CuteFace, ink, useShade } from '../kit'

export default function Pelican({ stage, mood }: BodyProps) {
  const body = useShade(mood === 'grumpy' ? '#a8a0b0' : '#ece6d8', 0.35, 0.18)
  return (
    <g>
      <defs>{body.def}</defs>
      <ellipse cx={100} cy={110} rx={52 + stage * 4} ry={48 + stage * 4} fill={body.fill} stroke={ink('#ece6d8')} strokeWidth={3} />
      <CuteFace x={100} y={100} s={0.9} mood={mood} />
    </g>
  )
}
