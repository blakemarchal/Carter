// Hoot → Hootwing → Wiseglow: a round purple owl facing you, with big round eyes in a pale face, feathery ear
// tufts, wings folded at its sides and little orange toes. Hootwing holds out a little glowing lantern on the
// tip of its wing, to keep watch through the night; Wiseglow's own wings glow instead: it spreads them wide,
// full of stars, and wears a crown.
// Grumpy, it goes a dusty grey, its ear tufts flop and its wings hang, and the lantern goes dim.
import { type BodyProps, Anim, Crown, CuteFace, ink, Shine, starPath, twinklePath, useShade } from '../kit'

const MIRROR = 'translate(200 0) scale(-1 1)'

// The left ear tuft, a soft feathery point (behind the head, so it grows out of it), with a feather line;
// the right one is its mirror image. Grumpy, the tufts flop down to the sides.
const TUFT = 'M65 88 C61 76 56 63 50 51 Q48 45 54 46 C67 52 79 60 90 70 Z'
const TUFT_LINE = 'M56 54 Q62 62 66 72'
// The left wing folded at its side (in front of the body), and spread wide (behind it).
const WING = 'M62 106 C46 112 38 134 42 156 C46 164 56 162 62 152 C68 140 70 122 66 108 Z'
const WING_DROOP = 'M62 112 C48 122 44 144 48 166 C52 172 60 168 64 158 C69 144 70 128 66 114 Z'
const WING_OPEN = 'M68 122 C50 116 30 100 18 76 C16 70 22 66 28 70 C30 62 38 60 42 66 C46 60 54 60 56 68 C62 80 70 96 74 112 Z'

export default function Owl({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const PLUM = g ? '#8f889c' : '#9a6fd2'
  const FACE = g ? '#dcd8e2' : '#f1e6ff'
  const WINGC = g ? '#7a7388' : '#8159c0'
  const NIGHT = g ? '#6d6880' : '#5d3fa8'
  const BEAK = g ? '#d8b17c' : '#ffb347'
  const GLOW = g ? '#d8d3bd' : '#ffe066'
  const body = useShade(PLUM, 0.4, 0.18)
  const face = useShade(FACE, 0.5, 0.06)
  const wing = useShade(WINGC, 0.35, 0.18)
  const night = useShade(NIGHT, 0.3, 0.2)
  const glow = useShade(GLOW, 0.55, 0.12)
  const line = ink(PLUM)
  const wingLine = ink(WINGC)
  const open = stage >= 2
  return (
    <g>
      <defs>{body.def}{face.def}{wing.def}{night.def}{glow.def}</defs>

      {/* Wiseglow's big starry wings, spread wide behind it with a soft glow, flapping slowly */}
      {open && [-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="90% 95%" delay={side > 0 ? 0.1 : 0}>
            {!g && <path d={WING_OPEN} fill={GLOW} opacity={0.35} stroke={GLOW} strokeWidth={10} strokeLinejoin="round" />}
            <path d={WING_OPEN} fill={night.fill} stroke={ink(NIGHT)} strokeWidth={3} strokeLinejoin="round" />
            <path d="M30 76 C40 90 52 100 64 106 M42 70 C50 84 58 94 68 100" stroke={ink(NIGHT)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
            {[[36, 88, 4.5], [52, 92, 3.5], [48, 76, 3], [62, 108, 3]].map(([x, y, r], i) => (
              <path key={i} d={starPath(x, y, r)} fill={GLOW} opacity={g ? 0.6 : 1} />
            ))}
          </Anim>
        </g>
      ))}

      {/* Feathery ear tufts (flopped when grumpy) */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-ear" origin="80% 100%" delay={side > 0 ? 0.5 : 0}>
            <g transform={g ? 'rotate(-52 80 80)' : undefined}>
              <path d={TUFT} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
              <path d={TUFT_LINE} stroke={line} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
            </g>
          </Anim>
        </g>
      ))}

      {/* Little orange toes */}
      {[84, 116].map((x) => (
        <g key={x} fill={BEAK} stroke={ink(BEAK)} strokeWidth={2}>
          <ellipse cx={x - 6} cy={173} rx={4} ry={5.5} transform={`rotate(20 ${x - 6} 173)`} />
          <ellipse cx={x + 6} cy={173} rx={4} ry={5.5} transform={`rotate(-20 ${x + 6} 173)`} />
          <ellipse cx={x} cy={174} rx={4} ry={6} />
        </g>
      ))}

      {/* Round body with a pale feathery tummy */}
      <g className="pa-breathe">
        <ellipse cx={100} cy={114} rx={48} ry={55} fill={body.fill} stroke={line} strokeWidth={3} />
        <ellipse cx={100} cy={140} rx={29} ry={26} fill={face.fill} opacity={0.9} />
        {[[90, 130], [110, 130], [100, 141], [86, 151], [114, 151], [100, 160]].map(([x, y]) => (
          <path key={`${x}${y}`} d={`M${x - 3.5} ${y - 2} L${x} ${y + 2} L${x + 3.5} ${y - 2}`} stroke={g ? '#a9a2b6' : '#c3a6ea'} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <Shine x={76} y={74} rx={10} ry={5.5} />
      </g>

      {/* Folded wings at its sides (hanging lower when grumpy). Hootwing lifts its right wing out a little,
          with the lantern hanging from its tip (inside the wing's flap, so they move together). */}
      {!open && [-1, 1].map((side) => {
        const lantern = stage === 1 && side > 0
        return (
          <g key={side} transform={side > 0 ? MIRROR : undefined}>
            <Anim cls="pa-wing" origin="80% 10%" delay={side > 0 ? 0.2 : 0}>
              <g transform={lantern ? 'rotate(24 64 108)' : undefined}>
                <path d={g ? WING_DROOP : WING} fill={wing.fill} stroke={wingLine} strokeWidth={3} strokeLinejoin="round" />
                <path d={g ? 'M52 140 Q56 150 54 160' : 'M50 134 Q54 144 52 154'} stroke={wingLine} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
              </g>
              {lantern && (
                <g transform="translate(26 150) scale(-1 1)">
                  {/* (drawn upright about its handle at (0, 0), mirrored back so it reads the right way round) */}
                  {!g && (
                    <Anim cls="pa-twinkle">
                      <circle cx={0} cy={20} r={17} fill={GLOW} opacity={0.4} />
                    </Anim>
                  )}
                  <path d="M0 -2 V4" stroke="#8a6a1c" strokeWidth={2.5} strokeLinecap="round" />
                  <circle cx={0} cy={-4} r={3} fill="none" stroke="#8a6a1c" strokeWidth={2.2} />
                  <path d="M-8 9 H8 L5 4 H-5 Z" fill="#d9a33a" stroke="#8a6a1c" strokeWidth={2} strokeLinejoin="round" />
                  <rect x={-8} y={9} width={16} height={19} rx={4} fill={glow.fill} stroke="#c9962e" strokeWidth={2.5} />
                  <path d="M0 13 Q4.5 19 0 24 Q-4.5 19 0 13 Z" fill={g ? '#bdb59a' : '#ff9b4a'} />
                  <rect x={-9} y={27} width={18} height={5} rx={2} fill="#d9a33a" stroke="#8a6a1c" strokeWidth={2} />
                </g>
              )}
            </Anim>
          </g>
        )
      })}

      {/* The pale face: two big round discs round the eyes */}
      <path d="M100 81 C91 70 64 70 62 92 C60 112 80 120 100 113 C120 120 140 112 138 92 C136 70 109 70 100 81 Z" fill={face.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <CuteFace x={100} y={94} s={1.08} gap={16} mood={mood} mouth={false} blinkDelay={0.4} />
      {/* A little beak between the eyes */}
      <path d="M94 102 Q100 99 106 102 Q104 109 100 113 Q96 109 94 102 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={2} strokeLinejoin="round" />

      {open && (
        <>
          <Crown x={100} y={64} />
          {!g && [[30, 128, 8], [172, 132, 7], [100, 30, 6]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.6}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
