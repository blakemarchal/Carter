// Gladshade, Brightshade, Shinelight: Grumbleshade, the grumpy shadow from every battle, made glad on Easter Morning.
// PLACEHOLDER: a plain round body until the real drawing is made (see the other species files).
import { type BodyProps, CuteFace, ink, useShade } from '../kit'

export default function Shade({ stage, mood }: BodyProps) {
  const body = useShade(mood === 'grumpy' ? '#8a7aa0' : '#c9b6f2', 0.35, 0.18)
  return (
    <g>
      <defs>{body.def}</defs>
      <ellipse cx={100} cy={110} rx={52 + stage * 4} ry={48 + stage * 4} fill={body.fill} stroke={ink('#c9b6f2')} strokeWidth={3} />
      <CuteFace x={100} y={100} s={0.9} mood={mood} />
    </g>
  )
}
