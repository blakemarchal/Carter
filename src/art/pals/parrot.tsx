// Chatter → Featherchat → Rainbowbeak: a bright green parrot facing you, perched on a little wooden stand that stands on
// the ground (a bar on a short post, on a round foot): a big round head on a plump round body, a pale yellow-green
// tummy, big friendly eyes, and a curved yellow beak (its rounded hook curling down over the little bottom of the beak,
// never sharp). Its green wings are folded at its sides, with long blue feathers at their ends; its long red and yellow
// tail feathers hang down behind it, peeping out low at its back on one side (its left, our right); and its two grey
// feet hold on to the bar, two toes of each curled over the front of it.
// Featherchat's long wing feathers are every colour of the rainbow. Rainbowbeak's wings are bigger and more colourful
// still; it glows softly, little speech bubbles with hearts in them float up round it (it speaks kind words now), and
// it wears a crown.
// Grumpy (in battle, before it's befriended): a dull grey-green, its feathers ruffled (its edge bumpy, a few sticking
// up on its head), its beak open mid-squawk (a little pink tongue inside), with cross brows.
import { useId } from 'react'
import { type BodyProps, Anim, Crown, CuteFace, ink, pt, Shine, twinklePath, useShade } from '../kit'

type Pt = [number, number]
const MIRROR = 'translate(200 0) scale(-1 1)'

/** A smooth closed outline through the points (Catmull-Rom). */
function smooth(ps: Pt[]) {
  const n = ps.length
  const at = (i: number) => ps[(i + n) % n]
  return `M${pt(...ps[0])}` + ps.map((_, i) => {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    return ` C${pt(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${pt(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${pt(...c)}`
  }).join('') + 'Z'
}

/** An ellipse's outline as polygon points. The glow and the shadow are drawn as polygons, so the coloring page
 *  (which turns every path, circle, ellipse and rect into a white shape to fill in) leaves them as they are. */
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48) =>
  Array.from({ length: n }, (_, i) => pt(cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry)).join(' ')

/** A little heart centred on (0, 0), about 3r across. */
const heart = (r: number) =>
  `M${pt(0, r * 1.5)} C${pt(-r * 2.2, r * 0.2)} ${pt(-r * 1.4, -r * 1.6)} ${pt(0, -r * 0.5)} C${pt(r * 1.4, -r * 1.6)} ${pt(r * 2.2, r * 0.2)} ${pt(0, r * 1.5)}Z`

/** A long feather from its root at (0, 0) out to its rounded tip at (l, 0), w wide. */
const feather = (l: number, w: number) =>
  `M0 ${-w * 0.3} C${l * 0.4} ${-w * 0.55} ${l * 0.8} ${-w * 0.55} ${l} ${-w * 0.2} Q${l + 2.5} 0 ${l} ${w * 0.2} C${l * 0.8} ${w * 0.55} ${l * 0.4} ${w * 0.55} 0 ${w * 0.3} Z`

/** A round outline (rx by ry about (cx, cy), `widen` wider at the bottom), as a smooth path through n points; ruffled
 *  when it's grumpy (a little bigger, its edge a ring of soft bumps). */
function roundPath(cx: number, cy: number, rx: number, ry: number, widen: number, ruffled: boolean, n = 16, bumps = 11) {
  const at = (i: number, k: number): Pt => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return [cx + rx * k * Math.cos(a) * (1 + widen * Math.sin(a)), cy + ry * k * Math.sin(a)]
  }
  if (!ruffled) return smooth(Array.from({ length: n }, (_, i) => at(i, 1)))
  return smooth(Array.from({ length: bumps * 2 }, (_, i) => at((i * n) / (bumps * 2), i % 2 ? 1.09 : 1.02)))
}
const HEAD = { x: 100, y: 81, r: 31 }
const BODY = { x: 100, y: 129, rx: 33, ry: 28 }
// Its pale tummy
const TUMMY = 'M79 134 C79 122 89 116 100 116 C111 116 121 122 121 134 C121 146 112 154 100 154 C88 154 79 146 79 134 Z'
// A few ruffled feathers sticking up on its head when it's grumpy: [angle, length, width] from the top of its head
const RUFFLE: [number, number, number][] = [[-38, 14, 8], [-12, 17, 8.5], [14, 15, 8], [40, 12, 7]]
/** A ruffled head feather from its root at (0, 0), pointing up, l long and w wide. */
const ruffleFeather = (l: number, w: number) =>
  `M${-w * 0.4} 0 C${-w * 0.8} ${-l * 0.4} ${-w * 0.5} ${-l * 0.8} 0 ${-l} C${w * 0.5} ${-l * 0.8} ${w * 0.8} ${-l * 0.4} ${w * 0.4} 0 Z`

const FACE_Y = 80
const FACE_S = 0.9
// Its curved beak, just below its eyes: the top of it a rounded hook that bulges out a little to our right and curls
// down over the little bottom of the beak (the jaw), its tip round, never sharp
const BEAK_TOP = 'M90 94.5 C95 90 107 89.5 113 95 C118 100 118 109.5 113 116 C110.5 119.5 105.5 121 103.8 118 C104.6 115 106 110.5 102.5 107.3 C99 104.3 94 104 90.4 102.3 C88.4 100.4 88.2 96.6 90 94.5 Z'
const JAW = 'M90.8 102 C95 104.4 100 105.4 102.6 108.4 C104.4 112 102.2 116.3 97.8 115.8 C93.3 115.2 90.2 109.8 90.8 102 Z'
const BEAK_SHINE = '94.5 94.5 103 92.5 109.5 94.5'
// Grumpy, mid-squawk: the top of the beak tipped up a little and the jaw dropped down, its mouth open in between, with
// a little pink tongue in it
const SQUAWK_TOP = 'rotate(-7 90 98)'
const SQUAWK_MOUTH = 'M90.3 99.5 C95.5 101 102.5 103 107 106 C108.5 113 106 121 100.5 124.5 C94.5 122.5 90.4 113 90.3 99.5 Z'
const SQUAWK_JAW = 'M91.2 113 C95.5 116 100 118 102.6 121 C104 124.6 101.8 128.2 97.6 127.7 C93.2 127 90.4 121.5 91.2 113 Z'

// The left wing folded at its side (the right one is its mirror image): the green feathers at the top of the wing,
// on its shoulder below its head, over long feathers out to its tip at the bottom.
// [root x, root y, angle (90 points straight down), length, width] for those long feathers.
const COVERTS = 'M79 107 C71 105 64 110 61 120 C58.5 129 59.5 138 64.5 142.5 C69 146 75 143 77.5 136 C80.5 127 81.5 115 79 107 Z'
const FLIGHT: [number, number, number, number, number][] = [[64, 126, 98, 26, 11], [69, 129, 92, 25, 11], [74, 130, 86, 21, 10]]
const FLIGHT_MORE: [number, number, number, number, number][] = [[62.5, 124, 102, 27, 10.5], [66.5, 127, 96, 28, 10.5], [71, 129, 90, 26, 10.5], [75, 130, 84, 21, 10]]
const FLIGHT_MOST: [number, number, number, number, number][] = [[60, 121, 110, 27, 10.5], [62.5, 124, 103, 30, 10.5], [66.5, 127, 96, 31, 10.5], [71, 129, 89, 28, 10.5], [75, 130, 82, 22, 10]]
const RAINBOW4 = ['#ff5b5b', '#ffd84a', '#4fb4ff', '#a98bff']
const RAINBOW5 = ['#ff5b5b', '#ff9f43', '#ffd84a', '#4fb4ff', '#a98bff']

// Its long tail feathers, hanging down behind it and peeping out low at its back on our right, red and yellow:
// [angle, length, width, red?]
const TAIL: [number, number, number, boolean][] = [[28, 40, 12, true], [43, 41, 12.5, false], [58, 37, 12, true], [73, 32, 11, false]]
const TAIL_ROOT: Pt = [121, 146]

// The little wooden stand it perches on: a round bar, on a short post, on a round foot on the ground
const BAR = { x: 68, y: 154, w: 64, h: 9 }
const POST = 'M95.5 161 H104.5 V177 H95.5 Z'
const FOOT = 'M77 178.5 C77 174.5 89 173 100 173 C111 173 123 174.5 123 178.5 C123 182 111 183.5 100 183.5 C89 183.5 77 182 77 178.5 Z'

// Rainbowbeak's little speech bubbles, each with a heart in it, their little tails pointing back at it:
// [x, y, size, which way the tail points]
const BUBBLES: [number, number, number, number][] = [[38, 64, 1, 1], [163, 58, 0.9, -1], [172, 106, 0.72, -1]]

export default function Parrot({ stage, mood }: BodyProps) {
  const g = mood === 'grumpy'
  const st = Math.max(0, Math.min(2, stage))
  const glowId = `pg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const GREEN = g ? '#97a897' : '#3cc45c'
  const WINGC = g ? '#899b8b' : '#2fab50'
  const TUMMYC = g ? '#d2d8ca' : '#c8ef78'
  const BLUE = g ? '#93a1ae' : '#2f8fd6'
  const RED = g ? '#c7a39d' : '#ff5a4f'
  const YELLOW = g ? '#ddd1a2' : '#ffd23f'
  const BEAKC = g ? '#dbcd9b' : '#ffcf3a'
  const JAWC = g ? '#cbb78c' : '#f5a93a'
  const FEET = g ? '#a09a9d' : '#a3949d'
  const WOOD = '#bd8550'
  const GLOW = '#f4ffc0'
  const body = useShade(GREEN, 0.4, 0.15)
  const wing = useShade(WINGC, 0.35, 0.15)
  const tummy = useShade(TUMMYC, 0.45, 0.08)
  const beak = useShade(BEAKC, 0.45, 0.12)
  const jaw = useShade(JAWC, 0.35, 0.12)
  const wood = useShade(WOOD, 0.35, 0.15)
  const line = ink(GREEN)
  const rainbow = st >= 1 && !g
  const flight = st >= 2 ? FLIGHT_MOST : st >= 1 ? FLIGHT_MORE : FLIGHT
  const featherC = (i: number) => (!rainbow ? BLUE : st >= 2 ? RAINBOW5[i] : RAINBOW4[i])

  return (
    <g>
      <defs>
        {body.def}{wing.def}{tummy.def}{beak.def}{jaw.def}{wood.def}
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={GLOW} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={GLOW} stopOpacity={0.45} />
          <stop offset="1" stopColor={GLOW} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Rainbowbeak's soft glow all round it */}
      {st >= 2 && !g && <polygon points={ring(100, 110, 90, 82)} fill={`url(#${glowId})`} />}

      {/* Its soft shadow on the ground, under the stand */}
      <polygon points={ring(100, 182, 36, 4.5)} fill="#2b2140" opacity={0.12} />

      {/* Its long red and yellow tail, hanging down behind it, peeping out low at its back; it sways a little */}
      <Anim cls="pa-tail" origin="0% 0%" delay={0.4}>
        {TAIL.map(([a, l, w, red]) => {
          const c = red ? RED : YELLOW
          return (
            <g key={a} transform={`translate(${pt(...TAIL_ROOT)}) rotate(${a + (g ? (a - 50) * 0.35 : 0)})`}>
              <path d={feather(l, w)} fill={c} stroke={ink(c)} strokeWidth={2.2} strokeLinejoin="round" />
              <polyline points={`8 0 ${l - 4} 0`} fill="none" stroke={ink(c)} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
            </g>
          )
        })}
      </Anim>

      {/* The little wooden stand: a round foot on the ground, a short post and the bar it perches on */}
      <path d={FOOT} fill={wood.fill} stroke={ink(WOOD)} strokeWidth={2.2} strokeLinejoin="round" />
      <path d={POST} fill={wood.fill} stroke={ink(WOOD)} strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx={BAR.h / 2} fill={wood.fill} stroke={ink(WOOD)} strokeWidth={2.2} />

      {/* Its plump round body, with its pale tummy */}
      <g className="pa-breathe">
        <path d={roundPath(BODY.x, BODY.y, BODY.rx, BODY.ry, 0.07, g)} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
        <path d={TUMMY} fill={tummy.fill} />
        {[[92, 129], [108, 129], [100, 139], [88, 143], [112, 143]].map(([x, y]) => (
          <polyline key={`${x}${y}`} points={`${x - 4} ${y} ${x} ${y + 3} ${x + 4} ${y}`} fill="none" stroke={ink(TUMMYC)} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
        ))}
      </g>

      {/* Two grey feet holding on to the bar, two toes of each curled over the front of it */}
      {[89, 111].map((x) => (
        <g key={x} fill={FEET} stroke={ink(FEET)} strokeWidth={1.6}>
          {[-3.4, 3.4].map((d) => <ellipse key={d} cx={x + d} cy={157.5} rx={3} ry={5.2} />)}
        </g>
      ))}

      {/* Wings folded at its sides: green feathers on its shoulder, over long feathers (every colour of the rainbow,
          once it's grown) out to the tip; they flap a little */}
      {[-1, 1].map((side) => (
        <g key={side} transform={side > 0 ? MIRROR : undefined}>
          <Anim cls="pa-wing" origin="85% 5%" delay={side > 0 ? 0.2 : 0}>
            {flight.map(([x, y, a, l, w], i) => {
              const c = featherC(i)
              return (
                <g key={a} transform={`translate(${x} ${y}) rotate(${a})`}>
                  <path d={feather(l, w)} fill={c} stroke={ink(c)} strokeWidth={2} strokeLinejoin="round" />
                  <polyline points={`5 0 ${l - 4} 0`} fill="none" stroke={rainbow ? '#fff' : ink(c)} strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
                </g>
              )
            })}
            <path d={COVERTS} fill={wing.fill} stroke={ink(WINGC)} strokeWidth={2.6} strokeLinejoin="round" />
          </Anim>
        </g>
      ))}

      {/* Grumpy: a few ruffled feathers sticking up on its head (behind it, so they grow out of it) */}
      {g && RUFFLE.map(([a, l, w]) => (
        <path key={a} d={ruffleFeather(l, w)} transform={`translate(100 ${HEAD.y - HEAD.r + 6}) rotate(${a})`} fill={body.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      ))}

      {/* Its big round head */}
      <path d={roundPath(HEAD.x, HEAD.y, HEAD.r, HEAD.r, 0, g)} fill={body.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Shine x={86} y={62} rx={8.5} ry={4.8} />
      <CuteFace x={100} y={FACE_Y} s={FACE_S} gap={15} mood={mood} mouth={false} blinkDelay={0.9} />
      {/* (rosier cheeks, which look muddy on green otherwise: the same ellipses as CuteFace's, so the coloring page
          doesn't change) */}
      <g transform={`translate(100 ${FACE_Y}) scale(${FACE_S})`}>
        {[-1, 1].map((side) => <ellipse key={side} cx={side * 25} cy={11} rx={6.5} ry={4.2} fill="#ff8fc0" opacity={0.6} />)}
      </g>

      {/* Its curved yellow beak: shut, or open mid-squawk when it's grumpy */}
      {g ? (
        <g strokeLinejoin="round">
          <path d={SQUAWK_MOUTH} fill="#b8435c" stroke={ink(BEAKC)} strokeWidth={1.6} />
          <ellipse cx={98.5} cy={114} rx={4.6} ry={2.9} transform="rotate(-28 98.5 114)" fill="#ff8fa8" />
          <path d={SQUAWK_JAW} fill={jaw.fill} stroke={ink(JAWC)} strokeWidth={1.8} />
          <path d={BEAK_TOP} transform={SQUAWK_TOP} fill={beak.fill} stroke={ink(BEAKC)} strokeWidth={2} />
        </g>
      ) : (
        <g strokeLinejoin="round">
          <path d={JAW} fill={jaw.fill} stroke={ink(JAWC)} strokeWidth={1.8} />
          <path d={BEAK_TOP} fill={beak.fill} stroke={ink(BEAKC)} strokeWidth={2} />
          <polyline points={BEAK_SHINE} fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" opacity={0.6} />
        </g>
      )}

      {/* Rainbowbeak's little speech bubbles with hearts in them, floating up round it */}
      {st >= 2 && !g && BUBBLES.map(([x, y, s, dir], i) => (
        <Anim key={x} cls="pa-float" delay={i * 0.7}>
          <g transform={`translate(${x} ${y}) scale(${s})`}>
            <path d={`M-13 -2 C-13 -10 -7 -13 0 -13 C7 -13 13 -10 13 -2 C13 6 7 9 ${dir * 4} 9 L${dir * 9} 15 L${dir * -1} 9 C-7 9 -13 6 -13 -2 Z`}
              fill="#ffffff" stroke="#e58fb3" strokeWidth={2} strokeLinejoin="round" />
            <path d={heart(3.6)} transform="translate(0 -2)" fill="#ff5d9e" stroke={ink('#ff5d9e')} strokeWidth={1.2} strokeLinejoin="round" />
          </g>
        </Anim>
      ))}

      {st >= 2 && (
        <>
          <Crown x={100} y={54} />
          {!g && [[26, 126, 6], [176, 152, 5], [30, 30, 5]].map(([x, y, r], i) => (
            <Anim key={x} cls="pa-twinkle" delay={i * 0.5}>
              <path d={twinklePath(x, y, r)} fill="#ffe680" />
            </Anim>
          ))}
        </>
      )}
    </g>
  )
}
