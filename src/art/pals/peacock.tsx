// Sulky → Fanfeather → Rainbowplume: a round little peachick facing you, with a crest of three feathers.
// Sulky's tail is still closed, a short train lying on the ground beside it; Fanfeather fans it open behind
// itself, with eye spots; Rainbowplume's big fan is every colour of the rainbow, and it wears a crown in its crest.
// Grumpy (in battle): jealous of Joseph's colourful coat: dull, its crest flopped over, its chin up in a sulk.
import { type BodyProps, Anim, Crown, CuteFace, ink, Shine, twinklePath, useShade } from '../kit'

const RAINBOW = ['#ff6b6b', '#ffa94d', '#ffd84d', '#5fd39a', '#5fb7ff', '#a98cff']
const MIRROR = 'translate(200 0) scale(-1 1)'

/** One fan feather pointing straight up from (0, 0), `l` long, `w` wide at its round tip. */
const feather = (l: number, w: number) =>
  `M0 0 C${-w * 0.35} ${-l * 0.35} ${-w} ${-l * 0.6} ${-w} ${-l * 0.82} A${w} ${w} 0 0 1 ${w} ${-l * 0.82} C${w} ${-l * 0.6} ${w * 0.35} ${-l * 0.35} 0 0 Z`

/** An eye spot centred on (0, -d) along a feather: rings of gold, teal and deep blue. */
function EyeSpot({ d, s, dull }: { d: number; s: number; dull: boolean }) {
  return (
    <g transform={`translate(0 ${-d}) scale(${s})`}>
      <ellipse rx={8} ry={9.5} fill={dull ? '#c9c4a6' : '#ffd34d'} stroke={dull ? '#9d9a85' : '#d9a400'} strokeWidth={1.5} />
      <ellipse cy={1} rx={5.6} ry={6.8} fill={dull ? '#8fb0ad' : '#2ec4b6'} />
      <ellipse cy={1.6} rx={3.4} ry={4.2} fill={dull ? '#5d6a86' : '#2b4fb3'} />
      <circle cx={-1.2} cy={-0.6} r={1.2} fill="#fff" opacity={0.8} />
    </g>
  )
}

export default function Peacock({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const BLUE = g ? '#7d92b4' : '#3f8cf0'
  const BELLY = g ? '#b3c3c0' : '#7fe3d6'
  const WING = g ? '#8fa59e' : '#2fb59e'
  const FAN = g ? '#9aae9f' : '#3cbf7a'
  const BEAK = g ? '#d9c08e' : '#ffc45e'
  const FEET = g ? '#b9a083' : '#f0a35a'
  const body = useShade(BLUE, 0.4, 0.16)
  const belly = useShade(BELLY, 0.4, 0.08)
  const wing = useShade(WING, 0.35, 0.15)
  const fan = useShade(FAN, 0.3, 0.15)
  const RB = g ? RAINBOW.map(() => '#a7aab0') : RAINBOW
  const rainbow = [useShade(RB[0], 0.3, 0.15), useShade(RB[1], 0.3, 0.15), useShade(RB[2], 0.3, 0.15), useShade(RB[3], 0.3, 0.15), useShade(RB[4], 0.3, 0.15), useShade(RB[5], 0.3, 0.15)]
  const line = ink(BLUE)
  // The open fan (stages 1 and 2): n feathers from low on the left, up over the top, to low on the right,
  // longest in the middle.
  const n = stage >= 2 ? 12 : 9
  const [from, to] = stage >= 2 ? [192, 348] : [196, 344]
  const L = (a: number) => (stage >= 2 ? 106 : 96) * (0.85 + 0.15 * Math.abs(Math.sin((a * Math.PI) / 180))) * (g ? 0.94 : 1)
  const feathers = Array.from({ length: n }, (_, i) => from + ((to - from) * i) / (n - 1))
  const order = feathers.map((a, i) => [a, i] as const).sort((p, q) => Math.abs(q[0] - 270) - Math.abs(p[0] - 270)) // outer ones first
  const tilt = g ? -7 : 0 // sulking, chin up
  // The crest: three feathers on stalks, [stalk, tip x, tip y, tip angle]; taller once grown, flopped over when sulking.
  const [mid, side] = stage >= 1 ? [0, 0] : [8, 6] // (shorter on Sulky)
  const crest: [string, number, number, number][] = g
    ? [['M100 56 C100 46 106 40 114 40', 117, 41, 60], ['M97 56 C96 44 100 36 106 33', 109, 32, 40], ['M103 57 C106 50 114 48 122 51', 125, 53, 80]]
    : [[`M100 56 V${26 + mid}`, 100, 22 + mid, 0], [`M97 57 C94 48 90 42 86 ${32 + side}`, 85, 28 + side, -22], [`M103 57 C106 48 110 42 114 ${32 + side}`, 115, 28 + side, 22]]
  return (
    <g>
      <defs>{body.def}{belly.def}{wing.def}{fan.def}{rainbow.map((r) => r.def)}</defs>

      {/* The tail: a closed train lying on the ground (Sulky), or a fan opened up behind it */}
      {stage >= 1 ? (
        <Anim cls="pa-breathe">
          {order.map(([a, i]) => {
            const l = L(a)
            const c = stage >= 2 ? Math.min(i, n - 1 - i) % 6 : -1
            const f = c >= 0 ? rainbow[c].fill : fan.fill
            const ln = c >= 0 ? ink(RB[c]) : ink(FAN)
            return (
              <g key={a} transform={`translate(100 130) rotate(${a + 90})`}>
                <path d={feather(l, stage >= 2 ? 12.5 : 13)} fill={f} stroke={ln} strokeWidth={2.5} strokeLinejoin="round" />
                <path d={`M0 -4 V${-l * 0.66}`} stroke={ln} strokeWidth={1.8} opacity={0.6} />
                <EyeSpot d={l * 0.8} s={stage >= 2 ? 1 : 0.95} dull={g} />
              </g>
            )
          })}
        </Anim>
      ) : (
        // A bundle of three long feathers, its tips slightly apart, flicking up a little (mirrored twice so the
        // flick lifts it off the ground rather than pushing it in)
        <g transform={MIRROR}>
          <Anim cls="pa-tail" origin="100% 60%">
            <g transform={MIRROR}>
              {([[-19, 64], [3, 60], [-8, 72]] as const).map(([a, l]) => (
                <g key={a} transform={`translate(116 166) rotate(${a + 90})`}>
                  <path d={feather(l, 8.5)} fill={fan.fill} stroke={ink(FAN)} strokeWidth={2.4} strokeLinejoin="round" />
                  <EyeSpot d={l * 0.8} s={0.62} dull={g} />
                </g>
              ))}
            </g>
          </Anim>
        </g>
      )}

      {/* Wings tucked at its sides, flapping a little (the right one mirrored) */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="90% 10%" delay={side > 0 ? 0.2 : 0}>
            <path d="M66 120 C50 124 42 142 48 158 C57 156 66 149 72 136 Z" fill={wing.fill} stroke={ink(WING)} strokeWidth={3} strokeLinejoin="round" />
            <path d="M54 140 Q58 146 57 152 M61 134 Q65 140 64 147" stroke={ink(WING)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.7} />
          </Anim>
        </g>
      ))}

      {/* Round body with a teal tummy */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={140} rx={40} ry={34} fill={body.fill} stroke={line} strokeWidth={3} />
        <ellipse cx={100} cy={148} rx={24} ry={21} fill={belly.fill} />
      </g>

      {/* Little feet */}
      {[88, 112].map((x) => (
        <path key={x} d={`M${x - 7} 179 L${x} 172 L${x + 7} 179 M${x} 172 V180`} stroke={FEET} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {/* Head with its crest (flopped over when sulking), a crown in it for Rainbowplume */}
      <g transform={tilt ? `rotate(${tilt} 100 118)` : undefined}>
        {crest.map(([d, x, y, r]) => (
          <g key={d}>
            <path d={d} stroke={line} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <ellipse cx={x} cy={y} rx={4.2} ry={6} fill={stage >= 2 && !g ? '#ffd34d' : body.fill} stroke={stage >= 2 && !g ? '#d9a400' : line} strokeWidth={2} transform={`rotate(${r} ${x} ${y})`} />
          </g>
        ))}
        <circle cx={100} cy={86} r={32} fill={body.fill} stroke={line} strokeWidth={3} />
        <Shine x={86} y={66} rx={9} ry={5} />
        <CuteFace x={100} y={86} s={0.82} gap={14} mood={mood} mouth={false} blinkDelay={1.2} />
        <path d="M92.5 96 Q100 91.5 107.5 96 L100 106 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={2.4} strokeLinejoin="round" />
        {stage >= 2 && <Crown x={100} y={58} />}
      </g>

      {/* Rainbowplume's sparkles */}
      {stage >= 2 && !g && [[24, 50, 7], [178, 60, 6]].map(([x, y, r], i) => (
        <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
          <path d={twinklePath(x, y, r)} fill="#ffe680" />
        </Anim>
      ))}
    </g>
  )
}
