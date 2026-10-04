// Glint, Divedash, Sparklewing (Jesus Calms the Storm): a tiny kingfisher with a bright blue back and an orange tummy.
// PLACEHOLDER: a plain round body until the real drawing is made (see the other species files).
import { type BodyProps, CuteFace, ink, useShade } from '../kit'

export default function Kingfisher({ stage, mood }: BodyProps) {
  const body = useShade(mood === 'grumpy' ? '#a8a0b0' : '#2fa3d6', 0.35, 0.18)
  return (
    <g>
      <defs>{body.def}</defs>
      <ellipse cx={100} cy={110} rx={52 + stage * 4} ry={48 + stage * 4} fill={body.fill} stroke={ink('#2fa3d6')} strokeWidth={3} />
      <CuteFace x={100} y={100} s={0.9} mood={mood} />
    </g>
  )
}
