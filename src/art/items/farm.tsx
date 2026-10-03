// Farm animals, pets and little creatures. Each draws in a 100 x 100 box (see ./types.ts).
import type { CSSProperties } from 'react'
import type { Item } from './types'
import { CuteFace, darken, EYE, fluff, groundShadow, ink, lighten, Shine, useShade } from './draw'

// ---------- Local helpers ----------

type Pt = [number, number]

const p2 = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`

/** Mirrors a drawing left to right across the middle of the box (for the right-hand ear, wing, leg...). */
const MIRROR = 'translate(100 0) scale(-1 1)'

/** A point on the quadratic curve a → (b) → c, t = 0…1. */
const bez = (a: Pt, b: Pt, c: Pt) => (t: number): Pt => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}

/** A smooth tapering tube along the centre line f(t), t = 0…1, with width w(t) and round ends (tails, a snake). */
function tube(f: (t: number) => Pt, w: (t: number) => number, n = 28) {
  const L: Pt[] = [], R: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = f(t)
    const [x1, y1] = f(Math.max(0, t - 0.005)), [x2, y2] = f(Math.min(1, t + 0.005))
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, h = w(t) / 2
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len
    L.push([x + nx * h, y + ny * h])
    R.unshift([x - nx * h, y - ny * h])
  }
  const smooth = (ps: Pt[]) => ps.slice(1, -1).map((p, i) => `Q${p2(...p)} ${p2((p[0] + ps[i + 2][0]) / 2, (p[1] + ps[i + 2][1]) / 2)}`).join(' ') + ` L${p2(...ps[ps.length - 1])}`
  const r0 = w(0) / 2, r1 = w(1) / 2
  return `M${p2(...L[0])} ${smooth(L)} A${r1} ${r1} 0 0 0 ${p2(...R[0])} ${smooth(R)} A${r0} ${r0} 0 0 0 ${p2(...L[0])}Z`
}

/** A short line straight across the curve f at t, `len` long (a stripe across a tail). */
function band(f: (t: number) => Pt, t: number, len: number) {
  const [x, y] = f(t)
  const [x1, y1] = f(Math.max(0, t - 0.01)), [x2, y2] = f(Math.min(1, t + 0.01))
  const d = Math.hypot(x2 - x1, y2 - y1) || 1
  const nx = (-(y2 - y1) / d) * (len / 2), ny = ((x2 - x1) / d) * (len / 2)
  return `M${p2(x + nx, y + ny)} L${p2(x - nx, y - ny)}`
}

/** A patch of colour hugging the edge of an ellipse from angle a1 to a2 (degrees, clockwise from 3 o'clock), reaching in by `d`. */
function edgePatch(cx: number, cy: number, rx: number, ry: number, a1: number, a2: number, d: number) {
  const at = (a: number): Pt => [cx + rx * Math.cos((a * Math.PI) / 180), cy + ry * Math.sin((a * Math.PI) / 180)]
  const inward = (a: number, k: number): Pt => {
    const [x, y] = at(a)
    const l = Math.hypot(x - cx, y - cy) || 1
    return [x + ((cx - x) / l) * k, y + ((cy - y) / l) * k]
  }
  const s = at(a1), e = at(a2)
  const c1 = inward(a1 + (a2 - a1) * 0.7, d * 1.3), c2 = inward(a1 + (a2 - a1) * 0.3, d * 1.1)
  return `M${p2(...s)} A${rx} ${ry} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${p2(...e)} C${p2(...c1)} ${p2(...c2)} ${p2(...s)}Z`
}

/** The style object for a CSS-animated group (custom properties need the cast). */
const css = (o: Record<string, string>) => o as CSSProperties

/** One glossy blinking eye, drawn just as CuteFace draws its eyes (for faces that need their own cheeks or mouth). */
function Eye({ x, y, s, rim }: { x: number; y: number; s: number; rim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pa-blink" style={css({ '--d': '0s' })}>
        {rim && <ellipse cx={0} cy={0} rx={10.5} ry={12.5} fill="#fff" />}
        <ellipse cx={0} cy={0} rx={7.5} ry={9.5} fill={EYE} />
        <circle cx={-2.6} cy={-3.6} r={3} fill="#fff" />
        <circle cx={2.6} cy={3.2} r={1.4} fill="#fff" opacity={0.85} />
      </g>
    </g>
  )
}

/** A band across an ellipse between heights y1 and y2, bowing down by `bow` (a bee's stripe). */
function stripeBand(cx: number, cy: number, rx: number, ry: number, y1: number, y2: number, bow: number) {
  const half = (y: number) => rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2))
  const a = half(y1), b = half(y2)
  return `M${p2(cx - a, y1)} Q${p2(cx, y1 + bow)} ${p2(cx + a, y1)} A${rx} ${ry} 0 0 1 ${p2(cx + b, y2)} Q${p2(cx, y2 + bow)} ${p2(cx - b, y2)} A${rx} ${ry} 0 0 1 ${p2(cx - a, y1)}Z`
}

// ---------- The animals ----------

/** A fluffy white sheep (or lamb), facing us. */
function Sheep() {
  const wool = useShade('#fffaf2', 0.5, 0.12)
  const face = useShade('#ffe3d3', 0.4, 0.1)
  const line = '#cbbfb4'
  return (
    <g>
      <defs>{wool.def}{face.def}</defs>
      <ellipse {...groundShadow(50, 93, 30)} />
      {[34, 44, 56, 66].map((x) => <rect key={x} x={x - 3.5} y={74} width={7} height={18} rx={3.5} fill="#7a6670" stroke={ink('#7a6670')} strokeWidth={2} />)}
      <path d={fluff(50, 60, 34, 22, 12)} fill={wool.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={30} cy={34} rx={9} ry={5} fill="#ffcfb8" stroke={ink('#ffcfb8')} strokeWidth={2} transform="rotate(-25 30 34)" />
      <ellipse cx={70} cy={34} rx={9} ry={5} fill="#ffcfb8" stroke={ink('#ffcfb8')} strokeWidth={2} transform="rotate(25 70 34)" />
      <ellipse cx={50} cy={40} rx={16} ry={17} fill={face.fill} stroke={ink('#ffe3d3')} strokeWidth={2.5} />
      <path d={fluff(50, 24, 12, 6, 6)} fill={wool.fill} stroke={line} strokeWidth={2} />
      <CuteFace x={50} y={40} s={0.42} gap={14} />
      <Shine x={30} y={52} rx={7} ry={4} />
    </g>
  )
}

/** A ginger tabby cat sitting and facing us, with whiskers and its striped tail curled round the side. */
function Cat() {
  const FUR = '#f6a84a'
  const fur = useShade(FUR, 0.4, 0.15)
  const line = ink(FUR)
  const stripe = darken(FUR, 0.22)
  const cream = '#fff4e3'
  const tail = bez([64, 86], [92, 90], [84, 60])
  return (
    <g>
      <defs>{fur.def}</defs>
      <ellipse {...groundShadow(50, 93, 30)} />
      {/* striped tail curling up at the side */}
      <path d={tube(tail, (t) => 8.5 - 2 * t)} fill={fur.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      {[0.5, 0.75].map((t) => <path key={t} d={band(tail, t, 6.5)} stroke={stripe} strokeWidth={2.4} strokeLinecap="round" />)}
      {/* body with a cream chest, and front paws */}
      <ellipse cx={50} cy={75} rx={21} ry={17} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={79} rx={10} ry={11} fill={cream} />
      <path d="M31 70 Q34 72 34.5 76 M69 70 Q66 72 65.5 76" stroke={stripe} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {[42, 58].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={89} rx={7} ry={4.5} fill={fur.fill} stroke={line} strokeWidth={2.2} />
          <path d={`M${x - 2} 91.5 v-2.5 M${x + 2} 91.5 v-2.5`} stroke={line} strokeWidth={1.4} strokeLinecap="round" />
        </g>
      ))}
      {/* pointed ears with pink insides */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <path d="M25 42 L27 16 Q28 11 33 14 L47 28 Z" fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M30 34 L31 21 L40 29 Z" fill="#ffb1c2" />
        </g>
      ))}
      {/* head with tabby stripes, whisker pads, a pink nose and whiskers */}
      <ellipse cx={50} cy={45} rx={26} ry={21} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <path d="M50 25.5 V31 M43.5 26.5 L45 31 M56.5 26.5 L55 31" stroke={stripe} strokeWidth={2.6} strokeLinecap="round" />
      <ellipse cx={46.3} cy={52.6} rx={4.6} ry={3.6} fill={cream} />
      <ellipse cx={53.7} cy={52.6} rx={4.6} ry={3.6} fill={cream} />
      <CuteFace x={50} y={43.5} s={0.42} gap={15} mouth={false} />
      <path d="M47.4 49 L52.6 49 L50 51.8 Z" fill="#ff8fab" stroke="#d9667f" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M50 51.8 V53.4 M50 53.4 Q48 55.6 46 54 M50 53.4 Q52 55.6 54 54" stroke={EYE} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M38 50.5 L20 47.5 M38 53 L20 55 M62 50.5 L80 47.5 M62 53 L80 55" stroke={line} strokeWidth={1.3} strokeLinecap="round" />
      <Shine x={36} y={33} rx={6} ry={3.5} />
    </g>
  )
}

/** A puppy sitting and facing us: floppy brown ears, a patch round one eye, a red collar and its tongue out. */
function Dog() {
  const FUR = '#f3d3a6'
  const BROWN = '#b5713f'
  const fur = useShade(FUR, 0.4, 0.14)
  const ear = useShade(BROWN, 0.3, 0.18)
  const line = ink(FUR)
  const cream = '#fff8ec'
  const tail = bez([64, 84], [84, 86], [82, 64])
  return (
    <g>
      <defs>{fur.def}{ear.def}</defs>
      <ellipse {...groundShadow(50, 93, 30)} />
      {/* wagging tail */}
      <g className="pa-tail" style={css({ '--o': '0% 100%' })}>
        <path d={tube(tail, (t) => 8 - 3 * t)} fill={fur.fill} stroke={line} strokeWidth={2.4} />
      </g>
      {/* body, chest and front legs */}
      <ellipse cx={50} cy={74} rx={21} ry={18} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={76} rx={10} ry={12} fill={cream} />
      {[42, 58].map((x) => (
        <g key={x}>
          <rect x={x - 5} y={72} width={10} height={20} rx={5} fill={fur.fill} stroke={line} strokeWidth={2.3} />
          <path d={`M${x - 1.8} 92 v-3 M${x + 1.8} 92 v-3`} stroke={line} strokeWidth={1.4} strokeLinecap="round" />
        </g>
      ))}
      {/* collar and tag */}
      <path d="M31 58 Q50 69 69 58 L69.5 63 Q50 74 30.5 63 Z" fill="#e8483f" stroke={ink('#e8483f')} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={50} cy={71} r={3.6} fill="#ffd34d" stroke={ink('#ffd34d')} strokeWidth={1.6} />
      {/* head, eye patch, muzzle */}
      <ellipse cx={50} cy={42} rx={23} ry={20} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={57} cy={40} rx={8} ry={8.5} fill={BROWN} opacity={0.9} />
      <ellipse cx={50} cy={51} rx={11} ry={8} fill={cream} />
      {/* floppy ears hanging over the sides of the head */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <path d="M37 24 C26 21 18 30 18 42 C18 52 22 60 27 60 C32 60 33 54 33 48 C33 40 36 32 41 27 Z" fill={ear.fill} stroke={ink(BROWN)} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      ))}
      <CuteFace x={50} y={40} s={0.42} gap={14} mouth={false} />
      {/* nose, mouth and tongue */}
      <ellipse cx={50} cy={47.5} rx={4.6} ry={3.3} fill="#3b2a35" />
      <ellipse cx={48.6} cy={46.6} rx={1.4} ry={0.8} fill="#fff" opacity={0.7} />
      <path d="M47.4 54.6 Q47 60.5 50 60.8 Q53 60.5 52.6 54.6 Q50 55.8 47.4 54.6 Z" fill="#ff7f99" stroke="#d65a76" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M50 56 V58.6" stroke="#d65a76" strokeWidth={1.1} strokeLinecap="round" />
      <path d="M50 50.8 V52.8 M50 52.8 Q47 55.8 44.5 53.6 M50 52.8 Q53 55.8 55.5 53.6" stroke={EYE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Shine x={46} y={28} rx={5} ry={2.8} rot={-15} />
    </g>
  )
}

/** A pink pig standing and facing us, with a round snout and a curly tail. */
function Pig() {
  const PINK = '#ffb3c6'
  const skin = useShade(PINK, 0.35, 0.15)
  const line = ink(PINK)
  const deep = darken(PINK, 0.18)
  return (
    <g>
      <defs>{skin.def}</defs>
      <ellipse {...groundShadow(50, 93, 32)} />
      {/* curly tail peeking out at the side */}
      <path d="M78 64 C86 64 89 57 85 54 C81 51 78 57 82 59 C86 61 90 57 90 52" stroke={line} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {/* legs with little trotters */}
      {[33, 43, 57, 67].map((x) => (
        <g key={x}>
          <rect x={x - 4} y={76} width={8} height={16} rx={3.5} fill={skin.fill} stroke={line} strokeWidth={2.2} />
          <path d={`M${x - 4} 88 H${x + 4} M${x} 88 V92`} stroke={line} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx={50} cy={66} rx={31} ry={20} fill={skin.fill} stroke={line} strokeWidth={2.5} />
      {/* ears */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <path d="M30 36 L23 17 Q23 13 27 15 L45 26 Z" fill={skin.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M30 31 L27 21 L38 27 Z" fill={deep} />
        </g>
      ))}
      {/* head and snout */}
      <ellipse cx={50} cy={45} rx={23} ry={20} fill={skin.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={53} rx={10.5} ry={7.5} fill={lighten(PINK, 0.25)} stroke={line} strokeWidth={2.2} />
      <ellipse cx={46.5} cy={53} rx={1.8} ry={2.8} fill={darken(PINK, 0.35)} />
      <ellipse cx={53.5} cy={53} rx={1.8} ry={2.8} fill={darken(PINK, 0.35)} />
      <CuteFace x={50} y={39} s={0.4} gap={15} mouth={false} />
      <path d="M45.5 62.5 Q50 65.5 54.5 62.5" stroke={EYE} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Shine x={37} y={33} rx={6} ry={3.5} />
    </g>
  )
}

/** A little red hen standing side-on with her head turned to us: red comb and wattle, yellow beak and feet. */
function Hen() {
  const RED = '#d9773d'
  const COMB = '#ef4a3c'
  const BEAK = '#ffc23a'
  const feather = useShade(RED, 0.4, 0.15)
  const tail = useShade(darken(RED, 0.2), 0.3, 0.2)
  const comb = useShade(COMB, 0.3, 0.15)
  const line = ink(RED)
  return (
    <g>
      <defs>{feather.def}{tail.def}{comb.def}</defs>
      <ellipse {...groundShadow(50, 93, 26)} />
      {/* legs and three-toed feet */}
      {[44, 55].map((x) => (
        <path key={x} d={`M${x} 82 V90 M${x} 90 L${x - 4.5} 92.5 M${x} 90 L${x} 93 M${x} 90 L${x + 4.5} 92.5`} stroke="#f0a02c" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {/* tail feathers fanned up at the back */}
      {[10, 32, 54].map((a) => (
        <ellipse key={a} cx={28 - 11 * Math.sin((a * Math.PI) / 180)} cy={56 - 11 * Math.cos((a * Math.PI) / 180)} rx={6} ry={12.5}
          transform={`rotate(${-a} ${28 - 11 * Math.sin((a * Math.PI) / 180)} ${56 - 11 * Math.cos((a * Math.PI) / 180)})`}
          fill={tail.fill} stroke={ink(darken(RED, 0.2))} strokeWidth={2.2} />
      ))}
      {/* body, a paler breast and a wing */}
      <ellipse cx={48} cy={66} rx={28} ry={20} fill={feather.fill} />
      <path d={edgePatch(48, 66, 28, 20, -50, 60, 9)} fill={lighten(RED, 0.18)} />
      <ellipse cx={48} cy={66} rx={28} ry={20} fill="none" stroke={line} strokeWidth={2.5} />
      <path d="M30 62 Q44 54 60 62 Q58 76 44 77 Q30 76 30 62 Z" fill={darken(RED, 0.1)} stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <path d="M36 66 Q42 69 48 68 M38 71 Q44 73 50 72" stroke={line} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      {/* comb behind the head, then the head, beak and wattle */}
      <path d="M53 26 Q50 18 56 17 Q57 11 63 13 Q67 9 70 15 Q75 16 72 24 Z" fill={comb.fill} stroke={ink(COMB)} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={62} cy={36} r={14} fill={feather.fill} stroke={line} strokeWidth={2.5} />
      <CuteFace x={62} y={35} s={0.38} gap={13} mouth={false} />
      <path d="M59.5 46 Q59 51 62 51.5 Q65 51 64.5 46 Z" fill={comb.fill} stroke={ink(COMB)} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M58.5 40 Q62 38.5 65.5 40 L62 46 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={1.6} strokeLinejoin="round" />
      <Shine x={56} y={28} rx={4.5} ry={2.6} />
    </g>
  )
}

/** A black-and-white cow standing and facing us, with a pink muzzle and little horns. */
function Cow() {
  const WHITE = '#fffdf8'
  const SPOT = '#3d3445'
  const PINK = '#ffc1c9'
  const HORN = '#f1e2c0'
  const coat = useShade(WHITE, 0.5, 0.1)
  const muzzle = useShade(PINK, 0.35, 0.12)
  const line = '#b9aea8'
  return (
    <g>
      <defs>{coat.def}{muzzle.def}</defs>
      <ellipse {...groundShadow(50, 93, 32)} />
      {/* tail with a dark tuft, peeking out at the side */}
      <path d="M76 58 Q86 60 85 76" stroke={line} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d={fluff(85, 79, 3, 4, 5)} fill={SPOT} />
      {/* legs with dark hooves */}
      {[33, 43, 57, 67].map((x) => (
        <g key={x}>
          <rect x={x - 4} y={72} width={8} height={20} rx={3.5} fill={coat.fill} stroke={line} strokeWidth={2.2} />
          <rect x={x - 4} y={86} width={8} height={6} rx={2} fill="#5d5060" stroke={ink('#5d5060')} strokeWidth={1.6} />
        </g>
      ))}
      {/* body with patches (outline drawn again on top so the patches sit inside it) */}
      <ellipse cx={50} cy={64} rx={30} ry={17} fill={coat.fill} />
      <path d={edgePatch(50, 64, 30, 17, 150, 215, 9)} fill={SPOT} />
      <path d={edgePatch(50, 64, 30, 17, 330, 395, 10)} fill={SPOT} />
      <ellipse cx={50} cy={64} rx={30} ry={17} fill="none" stroke={line} strokeWidth={2.5} />
      {/* horns and ears */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <path d="M37 30 Q30 26 31 15 Q35 20 42 25 Z" fill={HORN} stroke={ink(HORN)} strokeWidth={2} strokeLinejoin="round" />
          <ellipse cx={27} cy={36} rx={9} ry={5} fill={side > 0 ? SPOT : coat.fill} stroke={side > 0 ? ink(SPOT) : line} strokeWidth={2} transform="rotate(-20 27 36)" />
          <ellipse cx={27.5} cy={36} rx={5} ry={2.4} fill={PINK} transform="rotate(-20 27.5 36)" />
        </g>
      ))}
      {/* head with a patch, and the big pink muzzle */}
      <ellipse cx={50} cy={40} rx={18} ry={17} fill={coat.fill} />
      <path d={edgePatch(50, 40, 18, 17, 260, 330, 7)} fill={SPOT} />
      <ellipse cx={50} cy={40} rx={18} ry={17} fill="none" stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={55} rx={15} ry={9.5} fill={muzzle.fill} stroke={ink(PINK)} strokeWidth={2.2} />
      <ellipse cx={44.5} cy={54} rx={2} ry={2.8} fill="#c46a7b" />
      <ellipse cx={55.5} cy={54} rx={2} ry={2.8} fill="#c46a7b" />
      <path d="M45.5 59.5 Q50 62.5 54.5 59.5" stroke={EYE} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <CuteFace x={50} y={39} s={0.4} gap={13} mouth={false} />
      <Shine x={41} y={30} rx={5} ry={3} />
    </g>
  )
}

/** A white goat standing side-on with its head turned to us: little horns, floppy ears and a beard. */
function Goat() {
  const WOOL = '#faf5ec'
  const LINE = '#b6a28b'
  const NOSE = '#f1e3d1'
  const HORN = '#a9b4cb'
  const HOOF = '#6b7890'
  const wool = useShade(WOOL, 0.6, 0.1)
  const far = useShade(darken(WOOL, 0.08), 0.4, 0.1)
  const nose = useShade(NOSE, 0.4, 0.1)
  const horn = useShade(HORN, 0.35, 0.18)
  const BEARD = '#dccbb2'
  const leg = (x: number, fill: string) => (
    <g key={x}>
      <rect x={x - 4} y={68} width={8} height={23} rx={3.5} fill={fill} stroke={LINE} strokeWidth={2.2} />
      <rect x={x - 4.3} y={86} width={8.6} height={6} rx={2} fill={HOOF} stroke={ink(HOOF)} strokeWidth={1.6} />
    </g>
  )
  return (
    <g>
      <defs>{wool.def}{far.def}{nose.def}{horn.def}</defs>
      <ellipse {...groundShadow(47, 93, 32)} />
      {/* far legs, then the near ones in front of the body */}
      {[28, 60].map((x) => leg(x, far.fill))}
      {/* little tail flicked up, the neck (set back, so the beard hangs free in front), then the body */}
      <ellipse cx={13} cy={51} rx={3.5} ry={7} fill={wool.fill} stroke={LINE} strokeWidth={2} transform="rotate(-35 13 51)" />
      <path d={tube(bez([52, 60], [57, 46], [62, 36]), () => 15, 8)} fill={wool.fill} stroke={LINE} strokeWidth={2.4} />
      <ellipse cx={39} cy={61} rx={27} ry={17} fill={wool.fill} stroke={LINE} strokeWidth={2.5} />
      {[21, 54].map((x) => leg(x, wool.fill))}
      {/* a rounded haunch over the near back leg */}
      <path d="M14 62 C14 52 30 50 32 62 C33 70 28 76 22 76 C17 76 14 70 14 62 Z" fill={wool.fill} stroke={LINE} strokeWidth={2.2} />
      {/* horns and floppy ears */}
      <path d={tube(bez([62, 22], [59, 11], [52, 8]), (t) => 6 - 3.2 * t, 12)} fill={horn.fill} stroke={ink(HORN)} strokeWidth={2} />
      <path d={tube(bez([74, 22], [77, 11], [84, 8]), (t) => 6 - 3.2 * t, 12)} fill={horn.fill} stroke={ink(HORN)} strokeWidth={2} />
      <ellipse cx={53} cy={31} rx={8.5} ry={4} fill={wool.fill} stroke={LINE} strokeWidth={2} transform="rotate(20 53 31)" />
      <ellipse cx={83} cy={31} rx={8.5} ry={4} fill={wool.fill} stroke={LINE} strokeWidth={2} transform="rotate(-20 83 31)" />
      <ellipse cx={53.5} cy={31} rx={4.8} ry={1.9} fill="#ffb7c8" transform="rotate(20 53.5 31)" />
      <ellipse cx={82.5} cy={31} rx={4.8} ry={1.9} fill="#ffb7c8" transform="rotate(-20 82.5 31)" />
      {/* a pointed beard under the chin, then the head and nose */}
      <path d="M62.5 45 Q65 57 68.5 64 Q72 57 74.5 45 Z" fill={BEARD} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={68} cy={31} rx={13.5} ry={13} fill={wool.fill} stroke={LINE} strokeWidth={2.5} />
      <ellipse cx={68} cy={43} rx={9} ry={6.5} fill={nose.fill} stroke={ink(NOSE)} strokeWidth={2} />
      <ellipse cx={65} cy={42} rx={1.2} ry={1.7} fill="#8f6f62" />
      <ellipse cx={71} cy={42} rx={1.2} ry={1.7} fill="#8f6f62" />
      <path d="M65 46 Q68 48 71 46" stroke="#7d6052" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <CuteFace x={68} y={30} s={0.38} gap={13} mouth={false} />
      <Shine x={43} y={51} rx={7} ry={3.2} rot={-12} />
    </g>
  )
}

/** A mallard duck standing side-on with its head turned to us: green head, white collar, flat orange bill. */
function Duck() {
  const BODY = '#e6e3dc'
  const HEAD = '#3fa35b'
  const BREAST = '#a8613f'
  const WING = '#b4aa9c'
  const BILL = '#ffb43b'
  const body = useShade(BODY, 0.5, 0.12)
  const head = useShade(HEAD, 0.4, 0.2)
  const wing = useShade(WING, 0.35, 0.15)
  const line = ink(BODY)
  // The round breast at the front, shared by the body outline and the chestnut patch.
  const front = 'M62 56 C82 55 89 73 79 83'
  return (
    <g>
      <defs>{body.def}{head.def}{wing.def}</defs>
      <ellipse {...groundShadow(49, 93, 30)} />
      {/* webbed orange feet */}
      {[42, 56].map((x) => (
        <g key={x}>
          <path d={`M${x} 84 V89`} stroke="#f0902c" strokeWidth={2.8} strokeLinecap="round" />
          <path d={`M${x} 88.5 L${x - 6} 92 Q${x} 93.6 ${x + 6} 92 Z`} fill="#ff9d3c" stroke={ink('#ff9d3c')} strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      ))}
      {/* plump body: pointed tail up at the back, round chestnut breast at the front */}
      <path d={`M12 49 C18 56 26 58 35 56 C45 53 55 53 62 56 C82 55 89 73 79 83 C69 91 40 92 26 85 C15 79 10 65 12 49 Z`} fill={body.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`${front} C71 78 64 70 60 56.5 Z`} fill={BREAST} />
      <path d={front} stroke={line} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M12 49 C15 53 18 55 21 56.5" stroke="#3a4448" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {/* wing folded on its side, with feather tips and a blue patch */}
      <path d="M63 67 C61 80 43 84 24 71 C35 63 51 60 63 67 Z" fill={wing.fill} stroke={ink(WING)} strokeWidth={2} strokeLinejoin="round" />
      <path d="M30 73.5 Q34 76.5 38.5 77 M36 69.5 Q40 72.5 45 73" stroke={ink(WING)} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M41 77.5 Q47 79.5 53 78" stroke="#4f6fd0" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      {/* short neck with a white collar, then the head and its flat bill */}
      <path d={tube(bez([66, 50], [67, 55], [67, 61]), () => 14, 6)} fill={head.fill} stroke={ink(HEAD)} strokeWidth={2.2} />
      <path d="M60.5 57 Q67 59.5 73.5 57" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <circle cx={66} cy={40} r={15} fill={head.fill} stroke={ink(HEAD)} strokeWidth={2.5} />
      <CuteFace x={66} y={38} s={0.4} gap={13} mouth={false} />
      <ellipse cx={66} cy={48.5} rx={10} ry={4.8} fill={BILL} stroke={ink(BILL)} strokeWidth={1.8} />
      <path d="M57 48.8 Q66 51 75 48.8" stroke={ink(BILL)} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Shine x={59} y={31} rx={4.5} ry={2.6} />
    </g>
  )
}

/** A fluffy yellow chick just hatched, sitting in its cracked eggshell with the top of the shell on its head. */
function Chick() {
  const YELLOW = '#ffd84a'
  const SHELL = '#fff8ea'
  const fluffy = useShade(YELLOW, 0.45, 0.15)
  const shell = useShade(SHELL, 0.5, 0.1)
  const line = ink(YELLOW)
  const shellLine = '#d6c3a5'
  return (
    <g>
      <defs>{fluffy.def}{shell.def}</defs>
      <ellipse {...groundShadow(50, 93, 26)} />
      {/* little wings stretched out over the rim */}
      <ellipse cx={26} cy={58} rx={5.5} ry={9} fill={fluffy.fill} stroke={line} strokeWidth={2.2} transform="rotate(-50 26 58)" />
      <ellipse cx={74} cy={58} rx={5.5} ry={9} fill={fluffy.fill} stroke={line} strokeWidth={2.2} transform="rotate(50 74 58)" />
      {/* round fluffy chick */}
      <circle cx={50} cy={52} r={25} fill={fluffy.fill} stroke={line} strokeWidth={2.5} />
      <CuteFace x={50} y={50} s={0.42} gap={14} mouth={false} />
      <path d="M46.2 55.6 Q50 53.6 53.8 55.6 L50 60 Z" fill="#ff9d3c" stroke={ink('#ff9d3c')} strokeWidth={1.5} strokeLinejoin="round" />
      <Shine x={38} y={42} rx={5} ry={3} />
      {/* bottom of the eggshell, with a cracked zigzag rim and a few speckles */}
      <path d="M20 64 L26 70 L32 63 L38 70 L44 63 L50 70 L56 63 L62 70 L68 63 L74 70 L80 64 C82 80 69 92 50 92 C31 92 18 80 20 64 Z"
        fill={shell.fill} stroke={shellLine} strokeWidth={2.4} strokeLinejoin="round" />
      {[[34, 80, 1.6], [62, 84, 1.3], [48, 78, 1.1], [70, 76, 1.2]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="#e3cfae" />)}
      {/* the top of the shell, worn like a hat */}
      <g transform="translate(53 30) rotate(14)">
        <path d="M-15 0 C-15 -10 -8 -16 0 -16 C8 -16 15 -10 15 0 L11 -4 L7 1 L3 -4 L-1 1 L-5 -4 L-9 1 L-12 -3 Z"
          fill={shell.fill} stroke={shellLine} strokeWidth={2.2} strokeLinejoin="round" />
        <circle cx={-6} cy={-9} r={1.3} fill="#e3cfae" />
        <circle cx={5} cy={-11} r={1} fill="#e3cfae" />
      </g>
    </g>
  )
}

/** A little grey mouse sitting up and facing us: big round ears, a pink nose, whiskers and a long thin tail. */
function Mouse() {
  const FUR = '#bdb5c8'
  const PINK = '#ffb3c6'
  const fur = useShade(FUR, 0.45, 0.15)
  const line = ink(FUR)
  const belly = '#efeaf4'
  return (
    <g>
      <defs>{fur.def}</defs>
      <ellipse {...groundShadow(50, 93, 26)} />
      {/* long thin tail curling round at the side */}
      <path d="M62 87 C80 92 92 84 88 70 C86 62 79 62 79 68" stroke={darken(PINK, 0.3)} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M62 87 C80 92 92 84 88 70 C86 62 79 62 79 68" stroke={PINK} strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* round ears with pink insides */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <circle cx={29} cy={29} r={13} fill={fur.fill} stroke={line} strokeWidth={2.4} />
          <circle cx={29.5} cy={29.5} r={8} fill={PINK} />
        </g>
      ))}
      {/* body, feet and little paws held up */}
      <ellipse cx={50} cy={74} rx={19} ry={16} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={77} rx={10} ry={10} fill={belly} />
      <ellipse cx={40} cy={90} rx={7} ry={3.6} fill={PINK} stroke={darken(PINK, 0.3)} strokeWidth={1.8} />
      <ellipse cx={60} cy={90} rx={7} ry={3.6} fill={PINK} stroke={darken(PINK, 0.3)} strokeWidth={1.8} />
      <ellipse cx={45} cy={70} rx={3.6} ry={3} fill={PINK} stroke={darken(PINK, 0.3)} strokeWidth={1.5} />
      <ellipse cx={55} cy={70} rx={3.6} ry={3} fill={PINK} stroke={darken(PINK, 0.3)} strokeWidth={1.5} />
      {/* head, face, nose and whiskers */}
      <ellipse cx={50} cy={48} rx={21} ry={18} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <CuteFace x={50} y={47} s={0.42} gap={14} mouth={false} />
      <ellipse cx={50} cy={54} rx={3} ry={2.3} fill="#ff8fab" stroke="#d9667f" strokeWidth={1.2} />
      <path d="M50 56.3 V57.6 M50 57.6 Q48.2 59.5 46.5 58.2 M50 57.6 Q51.8 59.5 53.5 58.2" stroke={EYE} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      <path d="M41 54 L25 51 M41 56.5 L25 58.5 M59 54 L75 51 M59 56.5 L75 58.5" stroke={line} strokeWidth={1.2} strokeLinecap="round" />
      <Shine x={39} y={37} rx={5.5} ry={3.2} />
    </g>
  )
}

/** A friendly brown rat side-on, head turned to us: a long pointed snout, small round ears and a long bare tail. */
function Rat() {
  const FUR = '#a08d82'
  const PINK = '#f5a9b7'
  const fur = useShade(FUR, 0.4, 0.16)
  const far = useShade(darken(FUR, 0.12), 0.3, 0.15)
  const line = ink(FUR)
  const pinkLine = darken(PINK, 0.3)
  const tail = bez([20, 77], [-2, 92], [7, 58])
  return (
    <g>
      <defs>{fur.def}{far.def}</defs>
      <ellipse {...groundShadow(50, 92, 34)} />
      {/* long bare pink tail with faint rings */}
      <path d={tube(tail, (t) => 5 - 3.2 * t)} fill={PINK} stroke={pinkLine} strokeWidth={1.8} />
      {[0.25, 0.42, 0.58, 0.74].map((t) => <path key={t} d={band(tail, t, 3.6 - 2.4 * t)} stroke={pinkLine} strokeWidth={1} strokeLinecap="round" opacity={0.7} />)}
      {/* far feet peeking out behind */}
      <ellipse cx={36} cy={88} rx={5} ry={2.8} fill={darken(PINK, 0.1)} stroke={pinkLine} strokeWidth={1.5} />
      <ellipse cx={66} cy={88} rx={4.5} ry={2.6} fill={darken(PINK, 0.1)} stroke={pinkLine} strokeWidth={1.5} />
      {/* body with a paler belly, near legs and feet */}
      <ellipse cx={42} cy={69} rx={25} ry={17} fill={fur.fill} />
      <path d={edgePatch(42, 69, 25, 17, 30, 150, 7)} fill={lighten(FUR, 0.45)} />
      <ellipse cx={42} cy={69} rx={25} ry={17} fill="none" stroke={line} strokeWidth={2.5} />
      <ellipse cx={26} cy={76} rx={9} ry={8} fill={fur.fill} stroke={line} strokeWidth={2} />
      <ellipse cx={24} cy={88.5} rx={6.5} ry={3} fill={PINK} stroke={pinkLine} strokeWidth={1.6} />
      <rect x={54.5} y={72} width={7.5} height={16} rx={3.7} fill={fur.fill} stroke={line} strokeWidth={2} />
      <ellipse cx={59.5} cy={88.5} rx={5.5} ry={2.8} fill={PINK} stroke={pinkLine} strokeWidth={1.6} />
      {/* small round ears, then the head with its long snout */}
      <circle cx={67} cy={42} r={6.5} fill={far.fill} stroke={line} strokeWidth={2} />
      <circle cx={67.3} cy={42.3} r={3.6} fill={PINK} />
      <circle cx={57} cy={44} r={8} fill={fur.fill} stroke={line} strokeWidth={2.2} />
      <circle cx={57.5} cy={44.5} r={4.6} fill={PINK} />
      <path d="M52 52 C56 42 72 42 81 51 C85 55 90 59 89.5 63 C89 67 84 67.5 78 67.5 C67 68.5 57 69 52 63 C49.5 59.5 50 55.5 52 52 Z" fill={fur.fill} stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <CuteFace x={69.5} y={54} s={0.38} gap={11.5} mouth={false} />
      <circle cx={88.5} cy={62.5} r={2.8} fill="#ff8fab" stroke="#d9667f" strokeWidth={1.2} />
      <path d="M78.5 65 Q82 67.5 85 65" stroke={EYE} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      <path d="M84 61 L95 57 M84.5 63.5 L96 63" stroke={line} strokeWidth={1.1} strokeLinecap="round" />
      <Shine x={34} y={60} rx={7} ry={3.5} />
    </g>
  )
}

/** A white bunny sitting up and facing us, with long pink-lined ears, big hind feet and a fluffy tail. */
function Rabbit() {
  const FUR = '#fdfaf6'
  const LINE = '#bfaba5'
  const PINK = '#ffb8c8'
  const fur = useShade(FUR, 0.5, 0.1)
  return (
    <g>
      <defs>{fur.def}</defs>
      <ellipse {...groundShadow(50, 93, 26)} />
      {/* fluffy tail peeking out at the side */}
      <path d={fluff(70, 80, 6, 6, 7)} fill={fur.fill} stroke={LINE} strokeWidth={2} />
      {/* long ears */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <ellipse cx={41} cy={23} rx={7.5} ry={19} fill={fur.fill} stroke={LINE} strokeWidth={2.4} transform="rotate(-10 41 23)" />
          <ellipse cx={41.3} cy={24} rx={3.8} ry={14} fill={PINK} transform="rotate(-10 41.3 24)" />
        </g>
      ))}
      {/* body, front paws and big hind feet */}
      <ellipse cx={50} cy={74} rx={19} ry={16} fill={fur.fill} stroke={LINE} strokeWidth={2.5} />
      <ellipse cx={37} cy={89} rx={9} ry={4} fill={fur.fill} stroke={LINE} strokeWidth={2.2} />
      <ellipse cx={63} cy={89} rx={9} ry={4} fill={fur.fill} stroke={LINE} strokeWidth={2.2} />
      <ellipse cx={44} cy={76} rx={4} ry={5} fill={fur.fill} stroke={LINE} strokeWidth={2} />
      <ellipse cx={56} cy={76} rx={4} ry={5} fill={fur.fill} stroke={LINE} strokeWidth={2} />
      {/* head, face, nose, buck teeth and whiskers */}
      <ellipse cx={50} cy={50} rx={19} ry={16} fill={fur.fill} stroke={LINE} strokeWidth={2.5} />
      <CuteFace x={50} y={48} s={0.42} gap={14} mouth={false} />
      <path d="M47.6 53.6 L52.4 53.6 L50 56 Z" fill="#ff8fab" stroke="#d9667f" strokeWidth={1.2} strokeLinejoin="round" />
      <rect x={48.1} y={58} width={1.8} height={2.6} rx={0.5} fill="#fff" stroke={LINE} strokeWidth={0.8} />
      <rect x={50.1} y={58} width={1.8} height={2.6} rx={0.5} fill="#fff" stroke={LINE} strokeWidth={0.8} />
      <path d="M50 56 V57.6 M50 57.6 Q48 59.6 46 58.2 M50 57.6 Q52 59.6 54 58.2" stroke={EYE} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      <path d="M42 55 L28 53 M42 57.5 L28 59 M58 55 L72 53 M58 57.5 L72 59" stroke={LINE} strokeWidth={1.2} strokeLinecap="round" />
      <Shine x={40} y={42} rx={5.5} ry={3.2} />
    </g>
  )
}

/** A happy green frog sitting and facing us: eyes up on top of its head, a wide smile and splayed toes. */
function Frog() {
  const GREEN = '#7ccf5a'
  const skin = useShade(GREEN, 0.4, 0.18)
  const line = ink(GREEN)
  const belly = '#dcf2a6'
  const toes = (x: number, y: number, dir: number) => [-1, 0, 1].map((k) => (
    <circle key={k} cx={x + k * 3.6 + dir * Math.abs(k) * 0.6} cy={y + Math.abs(k) * -0.6} r={2.2} fill={skin.fill} stroke={line} strokeWidth={1.5} />
  ))
  return (
    <g>
      <defs>{skin.def}</defs>
      <ellipse {...groundShadow(50, 93, 36)} />
      {/* folded back legs at the sides */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          {toes(15, 90, -1)}
          <path d="M14 89 Q22 84 30 87 L30 91 Q20 92 14 91 Z" fill={skin.fill} stroke={line} strokeWidth={1.8} strokeLinejoin="round" />
          <ellipse cx={25} cy={78} rx={11} ry={9} fill={skin.fill} stroke={line} strokeWidth={2.4} transform="rotate(-25 25 78)" />
        </g>
      ))}
      {/* round body and belly */}
      <ellipse cx={50} cy={64} rx={30} ry={24} fill={skin.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={75} rx={17} ry={11} fill={belly} />
      {[[25, 66, 2.5], [75, 63, 2.1], [71, 73, 1.7]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill={darken(GREEN, 0.15)} />)}
      {/* front legs with round toes */}
      {[40, 60].map((x) => (
        <g key={x}>
          <path d={`M${x} 76 L${x} 88`} stroke={line} strokeWidth={7.5} strokeLinecap="round" />
          <path d={`M${x} 76 L${x} 88`} stroke={GREEN} strokeWidth={3.5} strokeLinecap="round" />
          {toes(x, 90, 0)}
        </g>
      ))}
      {/* eye bumps on top, the eyes, rosy cheeks and a wide smile */}
      <circle cx={35} cy={40} r={11.5} fill={skin.fill} stroke={line} strokeWidth={2.4} />
      <circle cx={65} cy={40} r={11.5} fill={skin.fill} stroke={line} strokeWidth={2.4} />
      <Eye x={35} y={40.5} s={0.58} />
      <Eye x={65} y={40.5} s={0.58} />
      <ellipse cx={33} cy={59} rx={4.6} ry={2.8} fill="#ff8fb8" opacity={0.75} />
      <ellipse cx={67} cy={59} rx={4.6} ry={2.8} fill="#ff8fb8" opacity={0.75} />
      <path d="M37 58 Q50 67 63 58" stroke={EYE} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Shine x={29} y={34} rx={4} ry={2.4} />
    </g>
  )
}

/** A green caterpillar (a "bug") inching along: round segments, little legs, and a smiling head with antennae. */
function Caterpillar() {
  const GREEN = '#7cc95a'
  const HEAD = '#a6db6c'
  const body = useShade(GREEN, 0.4, 0.15)
  const head = useShade(HEAD, 0.4, 0.15)
  const line = ink(GREEN)
  // Segments from the tail end to the neck: [x, y, r]
  const segs: [number, number, number][] = [[12, 81, 7.5], [23, 78, 9.5], [35, 75, 11], [48, 74, 11.5], [61, 73, 12], [70, 62, 12]]
  return (
    <g>
      <defs>{body.def}{head.def}</defs>
      <ellipse {...groundShadow(48, 92, 40)} />
      {/* little legs under each segment */}
      {segs.slice(0, 5).map(([x, y, r]) => (
        <ellipse key={x} cx={x} cy={y + r - 0.5} rx={2} ry={3} fill={darken(GREEN, 0.3)} />
      ))}
      {segs.map(([x, y, r]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r} fill={body.fill} stroke={line} strokeWidth={2.3} />
          <circle cx={x - r * 0.15} cy={y - r * 0.45} r={r * 0.2} fill="#ffe066" />
        </g>
      ))}
      {/* antennae with round tips */}
      <path d="M68 32 Q64 22 58 17 M80 31 Q84 21 90 17" stroke={darken(HEAD, 0.35)} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <circle cx={58} cy={17} r={3} fill="#ff9fb8" stroke={ink('#ff9fb8')} strokeWidth={1.4} />
      <circle cx={90} cy={17} r={3} fill="#ff9fb8" stroke={ink('#ff9fb8')} strokeWidth={1.4} />
      {/* head */}
      <circle cx={74} cy={44} r={16} fill={head.fill} stroke={ink(HEAD)} strokeWidth={2.5} />
      <CuteFace x={74} y={43} s={0.42} gap={14} />
      <Shine x={66} y={35} rx={5} ry={3} />
    </g>
  )
}

/** A red-brown ant side-on with its head turned to us: six legs, elbowed antennae and a round tail end. */
function Ant() {
  const BODY = '#c4643f'
  const body = useShade(BODY, 0.4, 0.2)
  const line = ink(BODY)
  const LEG = '#6b3a28'
  // Legs, all from the middle (thorax): far side first, then near side. [hip, knee, foot]
  const far: [Pt, Pt, Pt][] = [[[58, 62], [70, 66], [78, 86]], [[54, 63], [60, 70], [60, 87]], [[50, 63], [46, 71], [42, 87]]]
  const near: [Pt, Pt, Pt][] = [[[57, 64], [65, 71], [69, 89]], [[53, 65], [52, 74], [50, 90]], [[49, 64], [40, 73], [32, 89]]]
  const legPath = ([h, k, f]: [Pt, Pt, Pt]) => `M${p2(...h)} L${p2(...k)} L${p2(...f)}`
  return (
    <g>
      <defs>{body.def}</defs>
      <ellipse {...groundShadow(52, 91, 34)} />
      {far.map((l, i) => <path key={i} d={legPath(l)} stroke={darken(LEG, 0.15)} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      {/* round tail end (gaster), a little waist, then the middle */}
      <ellipse cx={27} cy={60} rx={17} ry={14} fill={body.fill} stroke={line} strokeWidth={2.5} transform="rotate(-12 27 60)" />
      <circle cx={45} cy={61} r={4} fill={body.fill} stroke={line} strokeWidth={2} />
      <ellipse cx={54} cy={59} rx={9} ry={7} fill={body.fill} stroke={line} strokeWidth={2.3} transform="rotate(-15 54 59)" />
      {near.map((l, i) => <path key={i} d={legPath(l)} stroke={LEG} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      {/* elbowed antennae */}
      <path d="M68 34 L64 23 L70 14 M78 34 L80 23 L88 16" stroke={LEG} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={70} cy={14} r={2.4} fill={LEG} />
      <circle cx={88} cy={16} r={2.4} fill={LEG} />
      {/* big round head */}
      <circle cx={73} cy={47} r={15.5} fill={body.fill} stroke={line} strokeWidth={2.5} />
      <CuteFace x={73} y={47} s={0.4} gap={13} />
      <Shine x={66} y={39} rx={4.5} ry={2.6} />
    </g>
  )
}

/** A red ladybug seen from above: black spots, a dark head with a smiling face, six legs and two antennae. */
function Ladybug() {
  const RED = '#ec4a3c'
  const DARK = '#3b3247'
  const shell = useShade(RED, 0.4, 0.18)
  const head = useShade(DARK, 0.45, 0.2)
  const line = ink(RED)
  // The left-hand legs (hip under the shell, knee, foot); the right ones are their mirror image.
  const legs = ['M32 42 L19 36 L14 28', 'M28 59 L14 59 L9 65', 'M32 75 L21 81 L18 89']
  // Spots on the left wing case, mirrored on the right.
  const spots: [number, number, number][] = [[36, 47, 6], [29, 64, 5.5], [39, 79, 5]]
  return (
    <g>
      <defs>{shell.def}{head.def}</defs>
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          {legs.map((d) => <path key={d} d={d} stroke={DARK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
          <path d="M45 13 Q42 6 36 4.5" stroke={DARK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <circle cx={36} cy={4.5} r={2.6} fill={DARK} />
        </g>
      ))}
      <circle cx={50} cy={26} r={16} fill={head.fill} stroke={ink(DARK)} strokeWidth={2.2} />
      <ellipse cx={50} cy={60} rx={31} ry={29} fill={shell.fill} stroke={line} strokeWidth={2.5} />
      <path d="M50 31.5 V88.5" stroke={line} strokeWidth={2} />
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          {spots.map(([x, y, r]) => <circle key={y} cx={x} cy={y} r={r} fill={DARK} />)}
        </g>
      ))}
      <circle cx={50} cy={38} r={4.5} fill={DARK} />
      <Shine x={33} y={38} rx={6} ry={3.2} />
      {/* face: white-rimmed eyes so they show on the dark head */}
      <Eye x={44.5} y={20} s={0.36} rim />
      <Eye x={55.5} y={20} s={0.36} rim />
      <path d="M47 26 Q50 28.5 53 26" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A round honeybee hovering and facing us: black stripes, six little legs, a stinger, and two pairs of wings at its sides. */
function Bee() {
  const YELLOW = '#ffd03d'
  const DARK = '#3b3247'
  const body = useShade(YELLOW, 0.45, 0.15)
  const line = ink(YELLOW)
  const wingLine = '#9cc2e8'
  return (
    <g>
      <defs>{body.def}</defs>
      {/* a big front wing and a smaller back wing on each side, gently flapping */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <g className="pa-wing" style={css({ '--o': '100% 70%' })}>
            <ellipse cx={20} cy={40} rx={15} ry={10} fill="#eef8ff" opacity={0.92} stroke={wingLine} strokeWidth={2} transform="rotate(-28 20 40)" />
            <ellipse cx={21} cy={58} rx={10.5} ry={7} fill="#eef8ff" opacity={0.92} stroke={wingLine} strokeWidth={2} transform="rotate(22 21 58)" />
          </g>
        </g>
      ))}
      {/* six little legs tucked up underneath, antennae and stinger (all behind the body) */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <path d="M28.5 64 L22.5 67 L22.5 71.5 M33.5 74 L28 79 L29.5 83 M40.5 80 L37 86 L39.5 89.5" stroke={DARK} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <path d="M44 32 Q41 22 34 17 M56 32 Q59 22 66 17" stroke={DARK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <circle cx={34} cy={17} r={2.8} fill={DARK} />
      <circle cx={66} cy={17} r={2.8} fill={DARK} />
      <path d="M46 80 L50 90 L54 80 Z" fill={DARK} stroke={DARK} strokeWidth={1.5} strokeLinejoin="round" />
      {/* round striped body (the outline goes on last, over the stripes) */}
      <ellipse cx={50} cy={56} rx={24} ry={27} fill={body.fill} />
      <path d={stripeBand(50, 56, 24, 27, 61, 69, 3)} fill={DARK} />
      <path d={stripeBand(50, 56, 24, 27, 75, 81, 2)} fill={DARK} />
      <ellipse cx={50} cy={56} rx={24} ry={27} fill="none" stroke={line} strokeWidth={2.5} />
      <CuteFace x={50} y={46} s={0.42} gap={14} />
      <Shine x={38} y={40} rx={6} ry={3.5} />
    </g>
  )
}

/** A butterfly seen from above, wings open: two pairs of patterned wings, a slim body, a smiling head and antennae. */
function Butterfly() {
  const UPPER = '#ff8cc6'
  const LOWER = '#b48cff'
  const BODY = '#8c74b8'
  const upper = useShade(UPPER, 0.4, 0.18)
  const lower = useShade(LOWER, 0.4, 0.18)
  const body = useShade(BODY, 0.4, 0.2)
  return (
    <g>
      <defs>{upper.def}{lower.def}{body.def}</defs>
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          {/* antenna */}
          <path d="M47.5 27 Q44 17 37 10" stroke={darken(BODY, 0.2)} strokeWidth={2} fill="none" strokeLinecap="round" />
          <circle cx={37} cy={10} r={2.6} fill={darken(BODY, 0.2)} />
          {/* the smaller lower wing, then the big upper wing */}
          <path d="M48 56 C38 56 22 60 18 74 C15 86 28 92 37 84 C43 78 47 68 48 60 Z" fill={lower.fill} stroke={ink(LOWER)} strokeWidth={2.4} strokeLinejoin="round" />
          <circle cx={30} cy={75} r={4.5} fill="#ffe680" stroke={darken('#ffe680', 0.2)} strokeWidth={1.2} />
          <path d="M48 50 C42 34 28 14 14 16 C4 18 4 36 10 46 C16 56 34 58 48 54 Z" fill={upper.fill} stroke={ink(UPPER)} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M45 50 C40 42 32 32 24 32 C18 32 18 41 22 46 C28 51 38 52 45 51 Z" fill={lighten(UPPER, 0.4)} />
          {[[13, 27, 2.6], [20, 21, 2.2], [10, 36, 2]].map(([x, y, r]) => <circle key={y} cx={x} cy={y} r={r} fill="#fff" />)}
        </g>
      ))}
      {/* slim striped body and round head */}
      <ellipse cx={50} cy={58} rx={5} ry={20} fill={body.fill} stroke={ink(BODY)} strokeWidth={2} />
      <path d="M46.5 56 H53.5 M46.5 62 H53.5 M47 68 H53" stroke={ink(BODY)} strokeWidth={1.3} strokeLinecap="round" opacity={0.7} />
      <circle cx={50} cy={34} r={10} fill={body.fill} stroke={ink(BODY)} strokeWidth={2.2} />
      <CuteFace x={50} y={33.5} s={0.3} gap={13} />
      <Shine x={27} y={29} rx={5} ry={3} />
    </g>
  )
}

/** A round spider web, with a small friendly spider sitting in it. */
function Web() {
  const SILK = '#827b9f'
  const SPIDER = '#7a63b3'
  const spider = useShade(SPIDER, 0.4, 0.2)
  const cx = 50, cy = 47
  const R = [42, 40, 43, 40, 42, 40, 43, 40] // spoke lengths, a little uneven like real silk
  const spoke = (i: number, f: number): Pt => {
    const a = ((-90 + i * 45) * Math.PI) / 180
    return [cx + Math.cos(a) * R[i % 8] * f, cy + Math.sin(a) * R[i % 8] * f]
  }
  // One ring of the spiral: from spoke to spoke, each thread sagging in towards the middle.
  const ring = (f: number, sag: number) => {
    let d = `M${p2(...spoke(0, f))}`
    for (let i = 0; i < 8; i++) {
      const [ax, ay] = spoke(i, f), [bx, by] = spoke(i + 1, f)
      const mx = (ax + bx) / 2, my = (ay + by) / 2
      d += ` Q${p2(mx + (cx - mx) * sag, my + (cy - my) * sag)} ${p2(bx, by)}`
    }
    return `${d}Z`
  }
  const sx = 64, sy = 64
  // The spider's left legs (hip, knee, foot) from its middle; the right ones are mirrored.
  const legs = ['M-5 -4 L-11 -12 L-16 -9', 'M-6 -1 L-14 -6 L-19 -1', 'M-6 2 L-14 2 L-18 9', 'M-5 5 L-11 9 L-13 16']
  return (
    <g>
      <defs>{spider.def}</defs>
      {/* the thread it hangs from, the spokes, then the spiral rings */}
      <path d={`M${p2(...spoke(0, 1))} V2`} stroke={SILK} strokeWidth={2} strokeLinecap="round" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${cx} ${cy} L${p2(...spoke(i, 1))}`} stroke={SILK} strokeWidth={2.2} strokeLinecap="round" />
      ))}
      {[0.22, 0.42, 0.62, 0.82].map((f) => <path key={f} d={ring(f, 0.16)} stroke={SILK} strokeWidth={2} fill="none" strokeLinejoin="round" />)}
      <path d={ring(1, 0.08)} stroke={SILK} strokeWidth={2.4} fill="none" strokeLinejoin="round" />
      {/* the spider: eight bent legs and a round body */}
      {[1, -1].map((side) => (
        <g key={side} transform={`translate(${sx} ${sy}) scale(${side} 1)`}>
          {legs.map((d) => <path key={d} d={d} stroke="#4a3a6e" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
        </g>
      ))}
      <circle cx={sx} cy={sy} r={8} fill={spider.fill} stroke={ink(SPIDER)} strokeWidth={2} />
      <CuteFace x={sx} y={sy - 0.5} s={0.27} gap={12} />
      <Shine x={sx - 3.5} y={sy - 4} rx={2.6} ry={1.6} />
    </g>
  )
}

/** A friendly green snake coiled up, with its head raised to smile at us and a little forked tongue. */
function Snake() {
  const GREEN = '#7cc95a'
  const head = useShade(GREEN, 0.4, 0.16)
  const line = ink(GREEN)
  const shine = lighten(GREEN, 0.35)
  const spot = darken(GREEN, 0.18)
  // The coils: [cx, cy, rx, ry, thickness]
  const low = [50, 76, 32, 8.5, 13] as const
  const top = [50, 64.5, 25, 7, 12] as const
  const coil = ([x, y, rx, ry, w]: readonly number[]) => (
    <>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={line} strokeWidth={w + 4.6} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={GREEN} strokeWidth={w} />
      <ellipse cx={x} cy={y - 2.6} rx={rx} ry={ry} fill="none" stroke={shine} strokeWidth={3} opacity={0.7} />
    </>
  )
  // The front half of a coil, drawn again over the neck (butt ends, so the joins don't show).
  const front = ([x, y, rx, ry, w]: readonly number[]) => {
    const d = `M${x - rx} ${y} A${rx} ${ry} 0 0 0 ${x + rx} ${y}`
    return (
      <>
        <path d={d} fill="none" stroke={line} strokeWidth={w + 4.6} />
        <path d={d} fill="none" stroke={GREEN} strokeWidth={w} />
        <path d={d} transform="translate(0 -2.6)" fill="none" stroke={shine} strokeWidth={3} opacity={0.7} />
      </>
    )
  }
  const spots = (x: number, y: number, rx: number, ry: number) => [35, 70, 110, 145].map((a) => (
    <ellipse key={a} cx={x + rx * Math.cos((a * Math.PI) / 180)} cy={y + ry * Math.sin((a * Math.PI) / 180) + 1} rx={2.6} ry={1.7} fill={spot} />
  ))
  const neck = 'M50 70 C50 60 58 56 56 48 C55 44 52 42 50 40'
  return (
    <g>
      <defs>{head.def}</defs>
      <ellipse {...groundShadow(50, 92, 38)} />
      {/* the tail tip, poking out from behind the bottom coil */}
      <path d={tube(bez([74, 82], [90, 86], [93, 74]), (t) => 11 - 8.5 * t, 16)} fill={GREEN} stroke={line} strokeWidth={2.3} />
      {coil(low)}
      {spots(50, 76, 32, 8.5)}
      {coil(top)}
      {/* the neck rising out of the middle, then the front of the top coil over its base */}
      <path d={neck} fill="none" stroke={line} strokeWidth={15.6} strokeLinecap="round" />
      <path d={neck} fill="none" stroke={GREEN} strokeWidth={11} strokeLinecap="round" />
      <path d={neck} transform="translate(-2.4 0)" fill="none" stroke={shine} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      {front(top)}
      {spots(50, 64.5, 25, 7)}
      {/* head with a smile and a little forked tongue */}
      <ellipse cx={50} cy={31} rx={18} ry={14} fill={head.fill} stroke={line} strokeWidth={2.5} />
      <CuteFace x={50} y={30} s={0.45} gap={15} />
      <path d="M50 36.8 V43 M50 43 L47.6 46 M50 43 L52.4 46" stroke="#ff5c7a" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Shine x={39} y={24} rx={5.5} ry={3.2} />
    </g>
  )
}

/** A friendly purple bat facing us with its wings spread wide: big ears, a smile and two tiny fangs. */
function Bat() {
  const FUR = '#8c72c6'
  const WING = '#6a54a6'
  const fur = useShade(FUR, 0.4, 0.18)
  const wing = useShade(WING, 0.35, 0.2)
  const line = ink(FUR)
  return (
    <g>
      <defs>{fur.def}{wing.def}</defs>
      {/* wings spread wide, gently flapping (one wing drawn, and mirrored for the right) */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <g className="pa-wing" style={css({ '--o': '100% 30%' })}>
            <path d="M42 50 L26 34 Q14 30 5 38 Q12 46 11 58 Q18 52 24 60 Q30 55 34 64 Q38 60 43 63 Z" fill={wing.fill} stroke={ink(WING)} strokeWidth={2.3} strokeLinejoin="round" />
            <path d="M26 34 L11 58 M26 34 L24 60 M26 34 L34 64" stroke={ink(WING)} strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
          </g>
        </g>
      ))}
      {/* pointed ears with pink insides */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <path d="M37 36 L33 18 Q33 15 36 16 L48 30 Z" fill={fur.fill} stroke={line} strokeWidth={2.3} strokeLinejoin="round" />
          <path d="M38 31 L36 21 L44 29 Z" fill="#ffb3d1" />
        </g>
      ))}
      {/* body, pale belly and little clawed feet */}
      <path d="M45 76 L44 80 M47 76.5 L47.5 80.5 M55 76 L56 80 M53 76.5 L52.5 80.5" stroke={line} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={50} cy={64} rx={12} ry={13} fill={fur.fill} stroke={line} strokeWidth={2.4} />
      <ellipse cx={50} cy={67} rx={7} ry={8} fill={lighten(FUR, 0.35)} />
      {/* round head, smile and fangs */}
      <circle cx={50} cy={44} r={16} fill={fur.fill} stroke={line} strokeWidth={2.5} />
      <CuteFace x={50} y={43} s={0.42} gap={14} />
      <path d="M47.6 48.2 L48.4 50.8 L49.2 48.5 Z M52.4 48.2 L51.6 50.8 L50.8 48.5 Z" fill="#fff" stroke="#fff" strokeWidth={0.6} strokeLinejoin="round" />
      <Shine x={41} y={35} rx={5} ry={3} />
    </g>
  )
}

/** A round brown owl standing and facing us: ear tufts, big eyes in a pale heart-shaped face, a small beak and orange feet. */
function Owl() {
  const BROWN = '#a8774f'
  const FACE = '#f7e3c5'
  const BELLY = '#ecd2a6'
  const body = useShade(BROWN, 0.4, 0.18)
  const wing = useShade(darken(BROWN, 0.15), 0.3, 0.18)
  const line = ink(BROWN)
  return (
    <g>
      <defs>{body.def}{wing.def}</defs>
      <ellipse {...groundShadow(50, 93, 28)} />
      {/* ear tufts */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <path d="M25 36 L22 13 Q22 10 25 12 L42 27 Z" fill={body.fill} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      ))}
      {/* round body, and a pale belly with little feather marks */}
      <ellipse cx={50} cy={58} rx={30} ry={32} fill={body.fill} stroke={line} strokeWidth={2.5} />
      <ellipse cx={50} cy={71} rx={17} ry={16} fill={BELLY} />
      {[[44, 64], [56, 64], [50, 71], [44, 78], [56, 78]].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 3} ${y - 1.5} Q${x} ${y + 1.5} ${x + 3} ${y - 1.5}`} stroke={darken(BELLY, 0.25)} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      ))}
      {/* wings folded at the sides */}
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? MIRROR : undefined}>
          <path d="M24 46 C15 58 17 76 30 86 C34 76 34 60 24 46 Z" fill={wing.fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
        </g>
      ))}
      {/* orange feet, three toes each */}
      {[42, 58].map((x) => (
        <path key={x} d={`M${x} 87.5 L${x - 3.6} 92 M${x} 87.5 L${x} 92.8 M${x} 87.5 L${x + 3.6} 92`} stroke="#f2a03a" strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* the pale face: two discs, with their inner outlines covered so it reads as one heart shape */}
      <circle cx={39} cy={44} r={12.5} fill={FACE} stroke={darken(FACE, 0.22)} strokeWidth={1.8} />
      <circle cx={61} cy={44} r={12.5} fill={FACE} stroke={darken(FACE, 0.22)} strokeWidth={1.8} />
      <circle cx={39} cy={44} r={11.6} fill={FACE} />
      <circle cx={61} cy={44} r={11.6} fill={FACE} />
      <Eye x={39} y={44} s={0.6} />
      <Eye x={61} y={44} s={0.6} />
      <ellipse cx={31} cy={53} rx={3.6} ry={2.2} fill="#ff7fb0" opacity={0.5} />
      <ellipse cx={69} cy={53} rx={3.6} ry={2.2} fill="#ff7fb0" opacity={0.5} />
      <path d="M46.5 50 Q50 48.5 53.5 50 L50 56 Z" fill="#ffb347" stroke={ink('#ffb347')} strokeWidth={1.5} strokeLinejoin="round" />
      <Shine x={33} y={29} rx={5} ry={3} />
    </g>
  )
}

export const FARM: Item[] = [
  { id: 'sheep', name: 'sheep', emoji: ['🐑'], Draw: Sheep },
  { id: 'cat', name: 'cat', emoji: ['🐱'], Draw: Cat },
  { id: 'dog', name: 'dog', emoji: ['🐶'], Draw: Dog },
  { id: 'pig', name: 'pig', emoji: ['🐷'], Draw: Pig },
  { id: 'hen', name: 'hen', emoji: ['🐔'], Draw: Hen },
  { id: 'cow', name: 'cow', emoji: ['🐮', '🐄'], Draw: Cow },
  { id: 'goat', name: 'goat', emoji: ['🐐'], Draw: Goat },
  { id: 'duck', name: 'duck', emoji: ['🦆'], Draw: Duck },
  { id: 'chick', name: 'chick', emoji: ['🐣'], Draw: Chick },
  { id: 'mouse', name: 'mouse', emoji: ['🐭'], Draw: Mouse },
  { id: 'rat', name: 'rat', emoji: ['🐀'], Draw: Rat },
  { id: 'rabbit', name: 'bunny', emoji: ['🐰'], Draw: Rabbit },
  { id: 'frog', name: 'frog', emoji: ['🐸'], Draw: Frog },
  { id: 'caterpillar', name: 'bug', emoji: ['🐛'], Draw: Caterpillar },
  { id: 'ant', name: 'ant', emoji: ['🐜'], Draw: Ant },
  { id: 'ladybug', name: 'ladybug', emoji: ['🐞'], Draw: Ladybug },
  { id: 'bee', name: 'bee', emoji: ['🐝'], Draw: Bee },
  { id: 'butterfly', name: 'butterfly', emoji: ['🦋'], Draw: Butterfly },
  { id: 'web', name: 'web', emoji: ['🕸️'], Draw: Web },
  { id: 'snake', name: 'snake', emoji: ['🐍'], Draw: Snake },
  { id: 'bat', name: 'bat', emoji: ['🦇'], Draw: Bat },
  { id: 'owl', name: 'owl', emoji: ['🦉'], Draw: Owl },
]
