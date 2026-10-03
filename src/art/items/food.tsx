// Food and dishes. Each draws in a 100 x 100 box (see ./types.ts).
import type { Item } from './types'
import { darken, groundShadow, ink, lighten, Shine, useShade } from './draw'

// ---------- Little shape helpers (local to food) ----------

type Pt = [number, number]
const P = (x: number, y: number) => `${+x.toFixed(1)} ${+y.toFixed(1)}`

/** An outline in the ink of a fill colour, with round joins and caps. */
const edge = (c: string, w = 2.5) => ({ stroke: ink(c), strokeWidth: w, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const })

/** A smooth closed curve through the points (Catmull-Rom). */
function smooth(p: Pt[]) {
  const n = p.length
  let d = `M${P(p[0][0], p[0][1])}`
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [p[(i + n - 1) % n], p[i], p[(i + 1) % n], p[(i + 2) % n]]
    d += ` C${P(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${P(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${P(c[0], c[1])}`
  }
  return d + 'Z'
}

/** A wobbly round outline (cookie edges, melted cheese, chocolate chips): `amp` is how far it wanders. */
function wobble(cx: number, cy: number, r: number, amp: number, n = 16, seed = 1) {
  return smooth(Array.from({ length: n }, (_, i): Pt => {
    const a = (Math.PI * 2 * i) / n
    const rr = r + amp * Math.sin(i * 2.4 + seed * 1.7) * Math.cos(i * 1.1 + seed)
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]
  }))
}

/** A crown of pointed leaves (strawberry and tomato tops). `tips` go round in order; neighbouring
 *  leaves meet in a notch `notch` of the way out from the centre (cx, cy). */
function leafCrown(cx: number, cy: number, tips: Pt[], notch = 0.4) {
  const n = tips.length
  const V = tips.map(([x, y], i): Pt => {
    const [nx, ny] = tips[(i + 1) % n]
    return [cx + ((x + nx) / 2 - cx) * notch, cy + ((y + ny) / 2 - cy) * notch]
  })
  let d = `M${P(V[n - 1][0], V[n - 1][1])}`
  tips.forEach(([x, y], i) => {
    const [ax, ay] = V[(i + n - 1) % n]
    const [bx, by] = V[i]
    d += ` Q${P((ax + x) / 2 + (ax - bx) * 0.3, (ay + y) / 2 + (ay - by) * 0.3)} ${P(x, y)}`
    d += ` Q${P((bx + x) / 2 + (bx - ax) * 0.3, (by + y) / 2 + (by - ay) * 0.3)} ${P(bx, by)}`
  })
  return d + 'Z'
}

/** A small five-pointed star (a blueberry's crown). */
function star(cx: number, cy: number, r: number, inner = 0.45) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const d = i % 2 ? r * inner : r
    return `${i ? 'L' : 'M'}${P(cx + Math.cos(a) * d, cy + Math.sin(a) * d)}`
  }).join(' ') + 'Z'
}

const GREEN = '#5cbf4c'

// ---------- Food ----------

/** A loaf of bread with a golden crust and three cuts across the top. */
function Bread() {
  const crust = useShade('#e3a253', 0.35, 0.18)
  return (
    <g>
      <defs>{crust.def}</defs>
      <ellipse {...groundShadow(50, 82, 38)} />
      <path d="M12 70 Q10 38 50 34 Q90 38 88 70 Q88 80 78 80 L22 80 Q12 80 12 70 Z" fill={crust.fill} stroke={ink('#e3a253')} strokeWidth={2.8} strokeLinejoin="round" />
      {[[30, 46], [48, 42], [66, 46]].map(([x, y]) => (
        <path key={x} d={`M${x - 6} ${y + 6} Q${x} ${y - 4} ${x + 7} ${y - 2}`} stroke={lighten('#e3a253', 0.45)} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      ))}
      <path d="M16 72 Q50 80 84 72" stroke={darken('#e3a253', 0.15)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
      <Shine x={28} y={46} rx={8} ry={4} />
    </g>
  )
}

/** A ripe red strawberry with golden seeds and a leafy green top. */
function Strawberry() {
  const red = '#ff4560'
  const berry = useShade(red, 0.35, 0.2)
  const leaf = useShade(GREEN, 0.3, 0.2)
  const seeds: Pt[] = [[33, 43], [50, 45], [67, 43], [23, 56], [40, 57], [60, 57], [77, 56], [31, 70], [50, 71], [69, 70], [41, 83], [59, 83]]
  return (
    <g>
      <defs>{berry.def}{leaf.def}</defs>
      <path d="M50 29 C37 25 12 25 12 44 C12 63 34 85 46 91.5 Q50 93.5 54 91.5 C66 85 88 63 88 44 C88 25 63 25 50 29Z" fill={berry.fill} {...edge(red, 2.8)} />
      {seeds.map(([x, y]) => (
        <ellipse key={`${x},${y}`} cx={x} cy={y} rx={1.7} ry={2.7} fill="#ffe7a1" stroke={darken(red, 0.25)} strokeWidth={0.6} transform={`rotate(${(x - 50) * 0.8} ${x} ${y})`} />
      ))}
      <path d="M50 26 Q49 16 54 8" stroke={ink(GREEN)} strokeWidth={6.5} fill="none" strokeLinecap="round" />
      <path d="M50 26 Q49 16 54 8" stroke={darken(GREEN, 0.05)} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d={leafCrown(50, 28, [[79, 31], [66, 43], [50, 47], [34, 43], [21, 31], [36, 19], [64, 19]])} fill={leaf.fill} {...edge(GREEN, 2.2)} />
      <Shine x={27} y={48} rx={7} ry={4} rot={-55} />
    </g>
  )
}

/** A whole round pizza from above with pepperoni and basil (centred, so the kitchen can cut it into four). */
function Pizza() {
  const crustC = '#e8a453'
  const crust = useShade(crustC, 0.35, 0.18)
  const cheeseC = '#ffd65a'
  const cheese = useShade(cheeseC, 0.4, 0.08)
  const pepC = '#e0443a'
  const pep = useShade(pepC, 0.3, 0.2)
  const basilC = '#43a843'
  const polar = (deg: number, r: number): Pt => [50 + Math.cos((deg * Math.PI) / 180) * r, 50 + Math.sin((deg * Math.PI) / 180) * r]
  const peps = [[-62, 25], [-24, 23], [28, 25], [64, 22], [118, 24], [155, 23], [205, 23], [243, 25]].map(([a, r]) => polar(a, r))
  const basil = [[-40, 13, 30], [48, 12, -40], [138, 12, 70], [226, 13, -15]]
  return (
    <g>
      <defs>{crust.def}{cheese.def}{pep.def}</defs>
      <circle cx={50} cy={53} r={44} fill="#000" opacity={0.1} />
      <path d={wobble(50, 50, 44, 1.2, 22, 3)} fill={crust.fill} {...edge(crustC, 2.8)} />
      <circle cx={50} cy={50} r={37.5} fill="#e2553d" />
      <path d={wobble(50, 50, 35, 1.6, 18, 5)} fill={cheese.fill} />
      {[20, 75, 130, 170, 250, 300, 340].map((a) => {
        const [x, y] = polar(a, 41)
        return <ellipse key={a} cx={x} cy={y} rx={2.2} ry={1.3} fill={darken(crustC, 0.18)} opacity={0.55} transform={`rotate(${a + 90} ${x} ${y})`} />
      })}
      {[[-10, 30], [100, 31], [190, 30], [280, 14], [10, 12]].map(([a, r]) => {
        const [x, y] = polar(a, r)
        return <ellipse key={a} cx={x} cy={y} rx={2.6} ry={1.8} fill="#fff6c8" opacity={0.75} />
      })}
      {peps.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5.8} fill={pep.fill} stroke={ink(pepC)} strokeWidth={1.6} />
          <circle cx={x - 1.6} cy={y - 1.2} r={1} fill={darken(pepC, 0.3)} />
          <circle cx={x + 2} cy={y + 1.5} r={0.8} fill={darken(pepC, 0.3)} />
        </g>
      ))}
      {basil.map(([a, r, rot], i) => {
        const [x, y] = polar(a, r)
        return (
          <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
            <path d={`M${x - 5} ${y} Q${x} ${y - 4.5} ${x + 5} ${y} Q${x} ${y + 4.5} ${x - 5} ${y}Z`} fill={basilC} {...edge(basilC, 1.2)} />
            <path d={`M${x - 4} ${y} L${x + 3.5} ${y}`} stroke={lighten(basilC, 0.35)} strokeWidth={0.9} />
          </g>
        )
      })}
      <Shine x={22} y={22} rx={7} ry={2.5} rot={-45} />
    </g>
  )
}

/** An ice cream cone: a crunchy waffle cone with a big scoop of pink strawberry ice cream and sprinkles. */
function IceCream() {
  const coneC = '#e8b067'
  const cone = useShade(coneC, 0.3, 0.2)
  const pinkC = '#ff9cc5'
  const scoop = useShade(pinkC, 0.4, 0.15)
  const A: Pt = [27, 50], B: Pt = [73, 50], C: Pt = [50, 96]
  const lerp = (p: Pt, q: Pt, t: number): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
  const waffle = [0.2, 0.4, 0.6, 0.8].flatMap((t) => {
    const s = lerp(A, B, t), u = lerp(B, C, 1 - t), v = lerp(A, C, t)
    return [`M${P(s[0], s[1])} L${P(u[0], u[1])}`, `M${P(s[0], s[1])} L${P(v[0], v[1])}`]
  }).join(' ')
  const sprinkles: [number, number, number, string][] = [[36, 22, 35, '#ffd93d'], [56, 15, -25, '#5fc8ff'], [67, 29, 55, '#7edb6a'], [46, 33, -45, '#ffffff'], [29, 37, 15, '#b48cff'], [59, 42, 75, '#ffd93d'], [49, 21, 80, '#ff6f91']]
  return (
    <g>
      <defs>{cone.def}{scoop.def}</defs>
      <path d="M27 50 L73 50 L52.6 91.5 Q50 96.5 47.4 91.5 Z" fill={cone.fill} {...edge(coneC, 2.6)} />
      <path d={waffle} stroke={darken(coneC, 0.2)} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M21 47 C14 26 30 6 50 6 C70 6 86 26 79 47 Q84 55 76 57 Q72 61 68 58 Q68 68 64 68 Q60 68 60 59 Q56 62 52 59 Q48 62 44 59 Q41 61 40 59 Q40 65 37 65 Q34 65 34 59 Q30 61 27 57 Q17 55 21 47 Z" fill={scoop.fill} {...edge(pinkC, 2.6)} />
      {sprinkles.map(([x, y, r, c]) => (
        <rect key={`${x},${y}`} x={x - 3.2} y={y - 1.3} width={6.4} height={2.6} rx={1.3} fill={c} stroke={ink(c)} strokeWidth={0.6} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <Shine x={35} y={18} rx={7} ry={4} />
    </g>
  )
}

/** A whole egg in its smooth shell, standing up. */
function Egg() {
  const shellC = '#f7e2c3'
  const shell = useShade(shellC, 0.65, 0.12)
  return (
    <g>
      <defs>{shell.def}</defs>
      <ellipse {...groundShadow(50, 92, 25)} />
      <path d="M50 7 C72 7 83 44 83 62 C83 81 68 91 50 91 C32 91 17 81 17 62 C17 44 28 7 50 7Z" fill={shell.fill} {...edge(shellC, 2.8)} />
      {[[60, 30], [66, 46], [58, 72], [38, 79], [71, 64]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={0.9} fill={darken(shellC, 0.3)} opacity={0.6} />)}
      <Shine x={36} y={30} rx={6} ry={10} rot={25} />
    </g>
  )
}

/** One chocolate chip, the baking kind: a glossy drop with a flat bottom and a curly tip. */
function ChocolateChip() {
  const chocC = '#7b4a2b'
  const choc = useShade(chocC, 0.35, 0.25)
  return (
    <g>
      <defs>{choc.def}</defs>
      <ellipse {...groundShadow(50, 91, 38)} />
      <path d="M56 15 Q64 16 59 24 Q56 40 72 54 Q92 70 86 82 Q83 89 72 89 L28 89 Q17 89 14 82 Q8 70 29 54 Q44 42 46 29 Q48 17 56 15Z" fill={choc.fill} {...edge(chocC, 2.8)} />
      <path d="M18 83 Q50 89 82 83" stroke={lighten(chocC, 0.2)} strokeWidth={2} fill="none" opacity={0.6} strokeLinecap="round" />
      <Shine x={34} y={60} rx={7} ry={4} rot={-45} />
    </g>
  )
}

/** A ripe yellow banana with a brown stem and tip. */
function Banana() {
  const yellow = '#ffd648'
  const peel = useShade(yellow, 0.4, 0.15)
  const stemC = '#9a8a3e'
  return (
    <g>
      <defs>{peel.def}</defs>
      <ellipse {...groundShadow(50, 91, 32)} />
      <g transform="translate(0 3)">
        <path d="M80 50 L85 31 Q86 27 89.5 28 L92 29 Q95 30.5 93.5 34 L87 51 Z" fill={stemC} {...edge(stemC, 2.4)} />
        <ellipse cx={90.5} cy={29.5} rx={3.2} ry={2} fill="#5a4630" transform="rotate(20 90.5 29.5)" />
        <path d="M10 44 C16 74 50 94 76 81 C86 76 90 64 87 50 C84 48 81 48 79 50 C77 64 63 72 47 70 C31 68 19 59 10 44Z" fill={peel.fill} {...edge(yellow, 2.8)} />
        <path d="M14 48 C24 70 52 82 80 64" stroke={darken(yellow, 0.14)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
        <ellipse cx={10.5} cy={44.5} rx={3.6} ry={2.8} fill="#6b5232" transform="rotate(-55 10.5 44.5)" />
        <Shine x={38} y={70} rx={8} ry={2.6} rot={18} />
      </g>
    </g>
  )
}

/** Three blueberries with their little star-shaped crowns, and a green leaf. */
function Blueberry() {
  const blue = '#4f5bcb'
  const berry = useShade(blue, 0.45, 0.25)
  const leaf = useShade(GREEN, 0.3, 0.2)
  const berries: [number, number, number][] = [[52, 40, 20], [31, 68, 21], [69, 69, 21]]
  return (
    <g>
      <defs>{berry.def}{leaf.def}</defs>
      <ellipse {...groundShadow(50, 91, 36)} />
      <path d="M56 28 Q66 6 92 8 Q86 32 56 28Z" fill={leaf.fill} {...edge(GREEN, 2.2)} />
      <path d="M58 27 Q72 18 88 11" stroke={ink(GREEN)} strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.6} />
      {berries.map(([x, y, r]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r} fill={berry.fill} {...edge(blue, 2.5)} />
          <path d={star(x + 3, y - 4, 6)} fill={darken(blue, 0.3)} {...edge(darken(blue, 0.3), 1.4)} />
          <circle cx={x + 3} cy={y - 4} r={1.8} fill={darken(blue, 0.6)} />
          <Shine x={x - 9} y={y - 9} rx={4.5} ry={2.6} />
        </g>
      ))}
    </g>
  )
}

/** A shiny red apple with a brown stem and one green leaf. */
function Apple() {
  const red = '#ff4747'
  const skin = useShade(red, 0.35, 0.2)
  const leaf = useShade(GREEN, 0.3, 0.2)
  return (
    <g>
      <defs>{skin.def}{leaf.def}</defs>
      <ellipse {...groundShadow(50, 92, 30)} />
      <path d="M50 30 Q49 19 54 11" stroke="#7a5230" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      <path d="M53 19 Q60 6 78 9 Q71 23 53 19Z" fill={leaf.fill} {...edge(GREEN, 2.2)} />
      <path d="M50 28 C40 20 14 19 13 46 C12 70 30 92 42 91 C46 90.5 48 89 50 89 C52 89 54 90.5 58 91 C70 92 88 70 87 46 C86 19 60 20 50 28Z" fill={skin.fill} {...edge(red, 2.8)} />
      <path d="M44 27 Q50 32 56 27" stroke={darken(red, 0.25)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
      <Shine x={29} y={44} rx={8} ry={4.5} rot={-50} />
    </g>
  )
}

/** A bunch of purple grapes on a little stem, with a leaf and a curly tendril. */
function Grapes() {
  const purple = '#9256cc'
  const grape = useShade(purple, 0.45, 0.2)
  const leaf = useShade(GREEN, 0.3, 0.2)
  const bunch: Pt[] = [[26, 34], [43, 32], [60, 32], [76, 35], [34, 50], [51, 49], [68, 51], [42, 66], [59, 66], [50, 81]]
  return (
    <g>
      <defs>{grape.def}{leaf.def}</defs>
      <path d="M50 26 Q50 16 46 8" stroke="#7d5733" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      <path d="M48 18 Q38 12 34 18 Q31 24 37 25" stroke={ink(GREEN)} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M50 20 Q62 4 84 10 Q78 30 50 20Z" fill={leaf.fill} {...edge(GREEN, 2.2)} />
      {bunch.map(([x, y]) => (
        <g key={`${x},${y}`}>
          <circle cx={x} cy={y} r={11.5} fill={grape.fill} {...edge(purple, 2.3)} />
          <Shine x={x - 4} y={y - 4.5} rx={3.2} ry={2} />
        </g>
      ))}
    </g>
  )
}

/** An orange carrot on a slant, with a leafy green top. */
function Carrot() {
  const orange = '#ff8a2b'
  const body = useShade(orange, 0.35, 0.2)
  const leaf = useShade(GREEN, 0.3, 0.2)
  return (
    <g>
      <defs>{body.def}{leaf.def}</defs>
      <g transform="translate(-4 5) rotate(38 50 50)">
        <path d="M47 31 Q30 22 31 5 Q45 10 51 29Z" fill={leaf.fill} {...edge(GREEN, 2.2)} />
        <path d="M53 31 Q70 22 69 5 Q55 10 49 29Z" fill={leaf.fill} {...edge(GREEN, 2.2)} />
        <path d="M50 31 Q42 14 50 0 Q58 14 50 31Z" fill={leaf.fill} {...edge(GREEN, 2.2)} />
        <path d="M35 38 Q34 28 45 28 L55 28 Q66 28 65 38 Q62 63 53.5 90 Q50 97 46.5 90 Q38 63 35 38Z" fill={body.fill} {...edge(orange, 2.6)} />
        <path d="M37 47 Q42 49 46 47 M54 58 Q58 60 62 57 M40 68 Q44 70 47 68 M52 79 Q55 80 57 78" stroke={darken(orange, 0.22)} strokeWidth={2} fill="none" strokeLinecap="round" />
        <Shine x={42} y={42} rx={3.5} ry={8} rot={0} />
      </g>
    </g>
  )
}

/** A round red tomato with a green star-shaped top. */
function Tomato() {
  const red = '#ff5638'
  const skin = useShade(red, 0.35, 0.2)
  const green = '#4fb648'
  const leaf = useShade(green, 0.3, 0.2)
  return (
    <g>
      <defs>{skin.def}{leaf.def}</defs>
      <ellipse {...groundShadow(50, 92, 34)} />
      <path d="M50 31 C36 23 9 28 9 58 C9 82 29 92 50 92 C71 92 91 82 91 58 C91 28 64 23 50 31Z" fill={skin.fill} {...edge(red, 2.8)} />
      <path d="M42 33 Q26 40 22 60 M58 33 Q74 40 78 60" stroke={darken(red, 0.18)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
      <path d={leafCrown(50, 30, [[74, 31], [61, 42], [39, 42], [26, 31], [50, 19]], 0.35)} fill={leaf.fill} {...edge(green, 2.2)} />
      <path d="M50 29 Q50 20 53 15" stroke={ink(green)} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M50 29 Q50 20 53 15" stroke={darken(green, 0.05)} strokeWidth={2.8} fill="none" strokeLinecap="round" />
      <Shine x={27} y={48} rx={8} ry={4.5} rot={-45} />
    </g>
  )
}

/** A wedge of yellow cheese with holes. */
function Cheese() {
  const yellow = '#ffc93a'
  const front = useShade(yellow, 0.3, 0.12)
  const top = useShade(lighten(yellow, 0.38), 0.4, 0.04)
  const hole = (x: number, y: number, rx: number, ry: number, rot = 0) => (
    <g key={`${x},${y}`} transform={`rotate(${rot} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={darken(yellow, 0.2)} />
      <ellipse cx={x + rx * 0.18} cy={y + ry * 0.22} rx={rx * 0.72} ry={ry * 0.68} fill={darken(yellow, 0.07)} />
    </g>
  )
  // the front is a triangle (tall at the left, tip at the right); the cut top slopes down to the tip
  return (
    <g>
      <defs>{front.def}{top.def}</defs>
      <ellipse {...groundShadow(52, 89, 42)} />
      <path d="M12 36 L74 86 L90 74 L28 24Z" fill={top.fill} {...edge(yellow, 2.6)} />
      <path d="M12 86 L12 36 L74 86Z" fill={front.fill} {...edge(yellow, 2.8)} />
      {hole(27, 70, 7, 7)}
      {hole(45, 79.5, 4.5, 4.5)}
      {hole(21, 51, 3.5, 3.5)}
      {hole(20, 82, 2.6, 2.6)}
      {hole(57, 83, 1.9, 1.9)}
      {hole(38.6, 45, 5.5, 3, 39)}
      {hole(59.5, 63.1, 5, 2.8, 39)}
      {hole(27.8, 33.8, 3, 1.7, 39)}
      {hole(74, 73.5, 2.6, 1.5, 39)}
      <Shine x={49} y={52} rx={6} ry={2.4} rot={39} />
    </g>
  )
}

/** Two shiny red cherries hanging from joined stems, with a green leaf. */
function Cherries() {
  const red = '#e5233f'
  const skin = useShade(red, 0.45, 0.25)
  const stemC = '#6f9a3a'
  const leaf = useShade(GREEN, 0.3, 0.2)
  const stems = ['M30 56 Q33 30 58 12', 'M70 60 Q66 34 58 12']
  return (
    <g>
      <defs>{skin.def}{leaf.def}</defs>
      {stems.map((d) => <path key={d} d={d} stroke={ink(stemC)} strokeWidth={5} fill="none" strokeLinecap="round" />)}
      {stems.map((d) => <path key={d} d={d} stroke={stemC} strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
      <path d="M58 13 Q70 0 90 9 Q76 24 58 13Z" fill={leaf.fill} {...edge(GREEN, 2.2)} />
      <path d="M61 13 Q74 9 86 9" stroke={ink(GREEN)} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.6} />
      <circle cx={30} cy={70} r={20} fill={skin.fill} {...edge(red, 2.7)} />
      <circle cx={70} cy={73} r={19} fill={skin.fill} {...edge(red, 2.7)} />
      <path d="M25 53 Q30 56 35 53 M65 57 Q70 60 75 57" stroke={darken(red, 0.3)} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.5} />
      <Shine x={22} y={62} rx={5} ry={3.5} />
      <Shine x={62} y={65} rx={5} ry={3.5} />
    </g>
  )
}

/** A stack of fluffy pancakes with a pat of butter on top and syrup dripping down. */
function Pancakes() {
  const cakeC = '#eaa652'
  const cake = useShade(cakeC, 0.3, 0.15)
  const topC = '#f4bf6e'
  const top = useShade(topC, 0.35, 0.12)
  const syrupC = '#c46a1e'
  const syrup = useShade(syrupC, 0.4, 0.15)
  const butterC = '#ffe680'
  const ry = 9, h = 10
  const stack: [number, number, number][] = [[71, 38, 0], [61, 36, 1.5], [51, 39, -1], [41, 36, 1], [31, 37, 0]] // top y, half width, nudge
  const disc = (y: number, rx: number, dx: number) => {
    const x1 = 50 + dx - rx, x2 = 50 + dx + rx
    return `M${x1} ${y} A${rx} ${ry} 0 0 1 ${x2} ${y} L${x2} ${y + h} A${rx} ${ry} 0 0 1 ${x1} ${y + h}Z`
  }
  return (
    <g>
      <defs>{cake.def}{top.def}{syrup.def}</defs>
      <ellipse {...groundShadow(50, 92, 40)} />
      {stack.map(([y, rx, dx]) => (
        <g key={y}>
          <path d={disc(y, rx, dx)} fill={cake.fill} {...edge(cakeC, 2.4)} />
          <path d={`M${50 + dx - rx + 5} ${y + h * 0.6 + 3} Q${50 + dx} ${y + h * 0.6 + ry + 1} ${50 + dx + rx - 5} ${y + h * 0.6 + 3}`} stroke={lighten(cakeC, 0.4)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      ))}
      <ellipse cx={50} cy={31} rx={37} ry={ry} fill={top.fill} {...edge(cakeC, 2.4)} />
      <path d="M24 32 Q28 24 50 24 Q72 24 76 32 Q77 37 73 39 L73 47 Q73 50.5 70 50.5 Q67 50.5 67 47 L67 40.5 Q62 41.5 58 41.5 L58 60 Q58 63.5 54.5 63.5 Q51 63.5 51 60 L51 41.8 Q44 41.5 38 40.8 L38 51 Q38 54.5 35 54.5 Q32 54.5 32 51 L32 39.5 Q24 37 24 32Z" fill={syrup.fill} {...edge(syrupC, 2)} />
      <path d="M41 24 L46 20 L60 20 L55 24Z" fill={lighten(butterC, 0.5)} {...edge(butterC, 1.8)} />
      <path d="M55 24 L60 20 L60 28 L55 32Z" fill={darken(butterC, 0.06)} {...edge(butterC, 1.8)} />
      <rect x={41} y={24} width={14} height={8} rx={1.5} fill={butterC} {...edge(butterC, 1.8)} />
      <Shine x={34} y={29} rx={5} ry={2.2} rot={-10} />
    </g>
  )
}

/** A round chocolate chip cookie, golden brown and dotted with chips. */
function Cookie() {
  const doughC = '#e0a258'
  const dough = useShade(doughC, 0.35, 0.2)
  const chipC = '#5b3420'
  const chips: [number, number, number][] = [[34, 28, 5], [58, 23, 4.5], [71, 43, 5.2], [45, 47, 5], [26, 55, 4.6], [58, 65, 5.2], [38, 72, 4.4], [75, 63, 3.8], [50, 32, 3.2]]
  return (
    <g>
      <defs>{dough.def}</defs>
      <ellipse {...groundShadow(50, 92, 38)} />
      <path d={wobble(50, 51, 40, 1.8, 20, 2)} fill={darken(doughC, 0.2)} {...edge(doughC, 2.6)} />
      <path d={wobble(50, 46, 40, 1.8, 20, 2)} fill={dough.fill} {...edge(doughC, 2.6)} />
      {[[44, 22], [66, 30], [24, 42], [62, 52], [50, 78], [72, 74], [32, 64], [82, 50]].map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r={0.9} fill={darken(doughC, 0.25)} opacity={0.6} />)}
      {chips.map(([x, y, r], i) => (
        <g key={i}>
          <path d={wobble(x, y, r, r * 0.25, 7, i + 1)} fill={chipC} {...edge(chipC, 1.2)} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill="#fff" opacity={0.3} />
        </g>
      ))}
      <Shine x={30} y={22} rx={7} ry={3.5} />
    </g>
  )
}

/** A jam sandwich: two slices of bread with red jam peeking out (whole, so the kitchen can cut it into triangles). */
function Sandwich() {
  const crustC = '#d99a4e'
  const crust = useShade(crustC, 0.3, 0.18)
  const crumbC = '#fff1d2'
  const crumb = useShade(crumbC, 0.6, 0.06)
  const jamC = '#e8374f'
  const jam = useShade(jamC, 0.35, 0.15)
  return (
    <g>
      <defs>{crust.def}{crumb.def}{jam.def}</defs>
      <ellipse {...groundShadow(50, 91, 44)} />
      <path d="M10 74 L90 74 L90 84 Q90 89 85 89 L15 89 Q10 89 10 84Z" fill={crust.fill} {...edge(crustC, 2.5)} />
      <path d="M7 69 L93 69 L93 76 Q91 80 88 77 Q85 84 81 78 Q76 81 71 78 Q67 80 63 78 Q59 86 55 79 Q48 82 42 78 Q38 81 34 78 Q30 84 26 78 Q21 81 16 78 Q12 80 7 76Z" fill={jam.fill} {...edge(jamC, 2.2)} />
      <path d="M10 60 L90 60 L90 68 Q90 72 86 72 L14 72 Q10 72 10 68Z" fill={crust.fill} {...edge(crustC, 2.5)} />
      <path d="M10 62 L14 44 C5 43 5 30 22 28 C36 26 64 26 78 28 C95 30 95 43 86 44 L90 62Z" fill={crust.fill} {...edge(crustC, 2.6)} />
      <path d="M16 58.5 L19.5 41.5 C12.5 40.5 12.5 33.2 24 31.8 C37 30.3 63 30.3 76 31.8 C87.5 33.2 87.5 40.5 80.5 41.5 L84 58.5Z" fill={crumb.fill} />
      <Shine x={30} y={37} rx={8} ry={2.6} rot={-6} />
    </g>
  )
}

/** A tall cup of pink berry smoothie with a striped straw and a strawberry on the rim. */
function Smoothie() {
  const pinkC = '#ff88b8'
  const drink = useShade(pinkC, 0.35, 0.15)
  const glassC = '#bfe0f0'
  const strawC = '#3fbde6'
  const red = '#ff4560'
  const berry = useShade(red, 0.35, 0.2)
  const glass = 'M20 24 L80 24 L71.5 86 Q70.5 91 65 91 L35 91 Q29.5 91 28.5 86 Z'
  return (
    <g>
      <defs>{drink.def}{berry.def}</defs>
      <ellipse {...groundShadow(50, 92, 28)} />
      <path d="M54 40 L70 5" stroke={ink(strawC)} strokeWidth={8.5} strokeLinecap="round" />
      <path d="M54 40 L70 5" stroke="#fff" strokeWidth={5.5} strokeLinecap="round" />
      <path d="M54 40 L70 5" stroke={strawC} strokeWidth={5.5} strokeDasharray="4 4" />
      <path d={glass} fill="#eef8fd" opacity={0.7} />
      <path d="M23.5 33 Q29 28 35 32 Q41 27 47 32 Q53 27 59 32 Q65 27 71 32 Q75 29 76.5 33 L69 84 Q68 88 64 88 L36 88 Q32 88 31 84 Z" fill={drink.fill} />
      <path d="M23.5 33 Q29 28 35 32 Q41 27 47 32 Q53 27 59 32 Q65 27 71 32 Q75 29 76.5 33" stroke={lighten(pinkC, 0.45)} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d={glass} fill="none" {...edge(glassC, 2.6)} />
      <ellipse cx={50} cy={24} rx={30} ry={3.5} fill="#fff" opacity={0.5} {...edge(glassC, 2)} />
      <path d="M27 36 L33 82" stroke="#fff" strokeWidth={4} opacity={0.65} strokeLinecap="round" />
      <path d="M22 13 C17 10 11 12 12 19 C13 25 19 31 23 34 C27 30 33 24 33 18 C33 12 27 11 22 13Z" fill={berry.fill} {...edge(red, 2)} />
      {[[17, 18], [24, 19], [20, 25], [27, 25]].map(([x, y]) => <ellipse key={`${x},${y}`} cx={x} cy={y} rx={0.9} ry={1.4} fill="#ffe7a1" />)}
      <path d={leafCrown(22, 12, [[30, 13], [24, 17], [15, 14], [20, 7]], 0.35)} fill={GREEN} {...edge(GREEN, 1.4)} />
      <Shine x={40} y={44} rx={5} ry={3} />
    </g>
  )
}

/** A bowl of warm veggie soup with carrot coins, peas and potato, and a little steam. */
function Soup() {
  const bowlC = '#4aa0e0'
  const bowl = useShade(bowlC, 0.35, 0.2)
  const soupC = '#f29a3a'
  const soup = useShade(soupC, 0.3, 0.12)
  const carrots: Pt[] = [[31, 46], [56, 50.5], [70, 45]]
  const peas: Pt[] = [[42, 44], [46, 51], [64, 49.5], [25, 49], [77, 48.5], [52, 43.5]]
  const potatoes: Pt[] = [[37, 50], [61, 43]]
  return (
    <g>
      <defs>{bowl.def}{soup.def}</defs>
      <ellipse {...groundShadow(50, 92, 32)} />
      {[[36, 0], [50, -3], [64, 0]].map(([x, dy]) => (
        <path key={x} d={`M${x} ${30 + dy} q-5 -5 0 -10 q5 -5 0 -10`} stroke="#b9c8d8" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />
      ))}
      <path d="M34 84 L32 90 Q50 93 68 90 L66 84Z" fill={darken(bowlC, 0.1)} {...edge(bowlC, 2.4)} />
      <path d="M8 46 C8 72 28 87 50 87 C72 87 92 72 92 46Z" fill={bowl.fill} {...edge(bowlC, 2.8)} />
      <path d="M13 60 Q50 80 87 60" stroke={lighten(bowlC, 0.45)} strokeWidth={3} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={46} rx={42} ry={12} fill={lighten(bowlC, 0.55)} {...edge(bowlC, 2.8)} />
      <ellipse cx={50} cy={47.5} rx={37} ry={9} fill={soup.fill} />
      {carrots.map(([x, y]) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={4.6} ry={2.6} fill="#ff7f24" {...edge('#ff7f24', 1.2)} />
          <ellipse cx={x} cy={y} rx={2} ry={1.1} fill="#ffb066" />
        </g>
      ))}
      {potatoes.map(([x, y]) => <rect key={x} x={x - 2.5} y={y - 2} width={5} height={4} rx={1.2} fill="#fbe7a8" {...edge('#fbe7a8', 1)} />)}
      {peas.map(([x, y]) => <circle key={x} cx={x} cy={y} r={2.2} fill="#6cc24a" {...edge('#6cc24a', 1)} />)}
      <Shine x={22} y={62} rx={6} ry={3.5} />
    </g>
  )
}

/** A bowl of fruit salad: strawberries, banana slices, kiwi, grapes and blueberries heaped up high. */
function FruitSalad() {
  const bowlC = '#5ccbb5'
  const bowl = useShade(bowlC, 0.35, 0.2)
  const red = '#ff4560'
  const berry = useShade(red, 0.35, 0.2)
  const grapeC = '#9fd35a'
  const grape = useShade(grapeC, 0.4, 0.15)
  const blue = '#4f5bcb'
  const blueS = useShade(blue, 0.45, 0.25)
  const banana = (x: number, y: number, r: number) => (
    <g key={`b${x}`}>
      <circle cx={x} cy={y} r={r} fill="#fff2b0" {...edge('#f0d470', 1.8)} />
      <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke="#f3dd8c" strokeWidth={1.2} />
      {[0, 120, 240].map((a) => <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * r * 0.25} cy={y + Math.sin((a * Math.PI) / 180) * r * 0.25} r={0.8} fill="#b8a060" />)}
    </g>
  )
  const kiwi = (x: number, y: number, r: number) => (
    <g key={`k${x}`}>
      <circle cx={x} cy={y} r={r} fill="#8a6a3e" {...edge('#8a6a3e', 1.6)} />
      <circle cx={x} cy={y} r={r - 1.8} fill="#8fd14f" />
      <circle cx={x} cy={y} r={r * 0.32} fill="#e9f7c8" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4
        return <ellipse key={i} cx={x + Math.cos(a) * r * 0.52} cy={y + Math.sin(a) * r * 0.52} rx={0.7} ry={1.2} fill="#2b2140" transform={`rotate(${(i * 45) + 90} ${x + Math.cos(a) * r * 0.52} ${y + Math.sin(a) * r * 0.52})`} />
      })}
    </g>
  )
  const strawberry = (x: number, y: number, s: number, rot: number) => (
    <g key={`s${x}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 -6 C-4 -9 -11 -8 -11 -1 C-11 6 -4 11 0 14 C4 11 11 6 11 -1 C11 -8 4 -9 0 -6Z" fill={berry.fill} {...edge(red, 1.8)} />
      {[[-5, 0], [4, -1], [0, 5], [-2, -3], [5, 5]].map(([a, b]) => <ellipse key={`${a},${b}`} cx={a} cy={b} rx={0.8} ry={1.2} fill="#ffe7a1" />)}
      <path d="M-6 -7 Q0 -2 6 -7 Q2 -10 0 -12 Q-2 -10 -6 -7Z" fill={GREEN} {...edge(GREEN, 1.2)} />
    </g>
  )
  const ball = (x: number, y: number, r: number, fill: string, c: string) => (
    <g key={`g${x},${y}`}>
      <circle cx={x} cy={y} r={r} fill={fill} {...edge(c, 1.8)} />
      <circle cx={x - r * 0.35} cy={y - r * 0.38} r={r * 0.28} fill="#fff" opacity={0.55} />
    </g>
  )
  return (
    <g>
      <defs>{bowl.def}{berry.def}{grape.def}{blueS.def}</defs>
      <ellipse {...groundShadow(50, 92, 32)} />
      {strawberry(58, 21, 1.05, 12)}
      {banana(40, 25, 8.5)}
      {kiwi(25, 38, 11)}
      {ball(47, 34, 8, grape.fill, grapeC)}
      {ball(63, 33, 6, blueS.fill, blue)}
      {strawberry(76, 36, 1.1, 22)}
      {banana(17, 50, 9)}
      {strawberry(37, 45, 1.1, -14)}
      {ball(55, 45, 6.5, blueS.fill, blue)}
      {ball(68, 47, 8, grape.fill, grapeC)}
      {banana(82, 49, 9)}
      {ball(27, 56, 8, grape.fill, grapeC)}
      {banana(48, 56, 9)}
      {kiwi(70, 58, 10)}
      {ball(37, 59, 6, blueS.fill, blue)}
      {ball(59, 59, 5.5, blueS.fill, blue)}
      <path d="M8 54 A42 10 0 0 0 92 54 C92 76 72 89 50 89 C28 89 8 76 8 54Z" fill={bowl.fill} {...edge(bowlC, 2.8)} />
      <path d="M12 60 Q50 76 88 60" stroke={lighten(bowlC, 0.45)} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Shine x={22} y={68} rx={6} ry={3.5} />
    </g>
  )
}

/** A birthday cake with pink frosting, white icing drips, sprinkles and three lit candles. */
function BirthdayCake() {
  const pinkC = '#ff9ac4'
  const cake = useShade(pinkC, 0.35, 0.18)
  const plateC = '#e3ecf6'
  const plate = useShade(plateC, 0.6, 0.1)
  const icing = '#fffaf3'
  const cx = 50, top = 50, rx = 34, ry = 8.5, bottom = 80
  const arcY = (x: number) => top + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2))
  // the icing's lower edge: short scallops with longer drips
  const drips: [number, number][] = [[23, 7], [36, 11], [51, 8], [65, 12], [77, 6]]
  let lower = `M${cx - rx} ${top} L${cx - rx} ${top + 4}`
  drips.forEach(([x, len]) => {
    lower += ` Q${x - 7} ${(arcY(x - 7) + 6).toFixed(1)} ${x - 3} ${(arcY(x - 3) + 3).toFixed(1)}`
    lower += ` L${x - 3} ${(arcY(x) + len).toFixed(1)} A3 3 0 0 0 ${x + 3} ${(arcY(x) + len).toFixed(1)} L${x + 3} ${(arcY(x + 3) + 3).toFixed(1)}`
  })
  lower += ` Q${cx + rx - 2} ${top + 6} ${cx + rx} ${top + 3} L${cx + rx} ${top} A${rx} ${ry} 0 0 0 ${cx - rx} ${top}Z`
  const candles: [number, number, string][] = [[36, 52, '#6ec6ff'], [50, 49, '#ffd84a'], [64, 52, '#8be08a']]
  const sprinkles: [number, number, number, string][] = [[24, 70, 30, '#ffd84a'], [34, 76, -20, '#6ec6ff'], [46, 72, 60, '#ffffff'], [58, 77, -40, '#8be08a'], [70, 71, 15, '#b48cff'], [78, 66, -60, '#ffd84a'], [40, 82, 10, '#b48cff'], [64, 84, 70, '#6ec6ff']]
  return (
    <g>
      <defs>{cake.def}{plate.def}</defs>
      <ellipse {...groundShadow(50, 93, 40)} />
      <ellipse cx={50} cy={85} rx={44} ry={7} fill={plate.fill} {...edge('#c9d6e4', 2.4)} />
      <path d={`M${cx - rx} ${top} L${cx - rx} ${bottom} A${rx} ${ry} 0 0 0 ${cx + rx} ${bottom} L${cx + rx} ${top}Z`} fill={cake.fill} {...edge(pinkC, 2.6)} />
      {sprinkles.map(([x, y, r, c]) => (
        <rect key={`${x},${y}`} x={x - 2.8} y={y - 1.1} width={5.6} height={2.2} rx={1.1} fill={c} stroke={ink(c)} strokeWidth={0.5} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <path d={lower} fill={icing} {...edge('#e8d6c8', 2.2)} />
      {candles.map(([x, base, c]) => (
        <g key={x}>
          <rect x={x - 3} y={base - 20} width={6} height={20} rx={1.5} fill={c} {...edge(c, 1.6)} />
          {[4, 10, 16].map((d) => <path key={d} d={`M${x - 3} ${base - d + 2} L${x + 3} ${base - d - 1}`} stroke="#fff" strokeWidth={1.6} opacity={0.85} />)}
          <path d={`M${x} ${base - 20} L${x} ${base - 23}`} stroke="#2b2140" strokeWidth={1.4} strokeLinecap="round" />
          <path d={`M${x} ${base - 22} C${x - 5} ${base - 25} ${x - 3} ${base - 31} ${x} ${base - 37} C${x + 3} ${base - 31} ${x + 5} ${base - 25} ${x} ${base - 22}Z`} fill="#ffd23f" {...edge('#ffb02e', 1.4)} />
          <path d={`M${x} ${base - 23.5} C${x - 2.2} ${base - 25} ${x - 1.5} ${base - 28} ${x} ${base - 31} C${x + 1.5} ${base - 28} ${x + 2.2} ${base - 25} ${x} ${base - 23.5}Z`} fill="#ff8a2a" />
        </g>
      ))}
      <Shine x={28} y={64} rx={5} ry={7} rot={10} />
    </g>
  )
}

/** An empty plate seen from above, clean and white, with a fork and a knife beside it. */
function Plate() {
  const chinaC = '#eef3f9'
  const china = useShade(chinaC, 0.7, 0.08)
  const steelC = '#c3ccd7'
  const steel = useShade(steelC, 0.5, 0.15)
  return (
    <g>
      <defs>{china.def}{steel.def}</defs>
      <circle cx={50} cy={53} r={32} fill="#000" opacity={0.08} />
      <circle cx={50} cy={50} r={32} fill={china.fill} {...edge('#c9d6e4', 2.6)} />
      <circle cx={50} cy={50} r={27} fill="none" stroke="#8cc4ee" strokeWidth={2.2} />
      <circle cx={50} cy={50} r={20} fill={darken(chinaC, 0.03)} stroke={darken(chinaC, 0.12)} strokeWidth={2} />
      <Shine x={36} y={30} rx={7} ry={3.5} />
      <path d="M5 16 L5 31 Q5 39 9.2 41 L9 82 Q9 87 11.5 87 Q14 87 14 82 L13.8 41 Q18 39 18 31 L18 16 L15.4 16 L15.4 29 L12.8 29 L12.8 16 L10.2 16 L10.2 29 L7.6 29 L7.6 16Z" fill={steel.fill} {...edge(steelC, 1.8)} />
      <path d="M86 50 L86 18 Q86 13 90 13 Q95 15 95 34 L95 50Z" fill={steel.fill} {...edge(steelC, 1.8)} />
      <rect x={85.5} y={49} width={10} height={38} rx={5} fill={steel.fill} {...edge(steelC, 1.8)} />
    </g>
  )
}

/** A plain empty cup with a handle (nothing in it, no steam). */
function Cup() {
  const blue = '#5ab3ee'
  const china = useShade(blue, 0.35, 0.18)
  const insideC = '#e4f0f9'
  const inside = useShade(insideC, 0.5, 0.1)
  const handle = 'M70 44 C90 42 92 76 66 76'
  return (
    <g>
      <defs>{china.def}{inside.def}</defs>
      <ellipse {...groundShadow(48, 92, 30)} />
      <path d={handle} stroke={ink(blue)} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={handle} stroke={blue} strokeWidth={6.5} fill="none" strokeLinecap="round" />
      <path d="M12 30 L17 80 Q18 90 28 90 L58 90 Q68 90 69 80 L74 30Z" fill={china.fill} {...edge(blue, 2.8)} />
      <ellipse cx={43} cy={30} rx={31} ry={8} fill={inside.fill} {...edge(blue, 2.8)} />
      <path d="M15 31 Q43 23 71 31" stroke={darken(insideC, 0.12)} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      <Shine x={26} y={50} rx={4} ry={10} rot={-5} />
    </g>
  )
}

/** An empty glass jar with a red screw-top lid. */
function Jar() {
  const glassC = '#bfe2f2'
  const lidC = '#e2544a'
  const lid = useShade(lidC, 0.35, 0.2)
  return (
    <g>
      <defs>{lid.def}</defs>
      <ellipse {...groundShadow(50, 92, 32)} />
      <path d="M28 26 L72 26 Q72 32 78 34 Q84 37 84 46 L84 80 Q84 91 72 91 L28 91 Q16 91 16 80 L16 46 Q16 37 22 34 Q28 32 28 26Z" fill="#e6f5fc" fillOpacity={0.75} {...edge(glassC, 2.8)} />
      <path d="M28 32 Q50 35.5 72 32" stroke={ink(glassC)} strokeWidth={1.8} opacity={0.45} fill="none" strokeLinecap="round" />
      <path d="M20 84 Q50 89 80 84" stroke="#fff" strokeWidth={3} opacity={0.8} fill="none" strokeLinecap="round" />
      <path d="M24 46 L24 78" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      <path d="M32 50 L32 62" stroke="#fff" strokeWidth={3} opacity={0.8} strokeLinecap="round" />
      <path d="M76 50 L76 78" stroke="#fff" strokeWidth={2.5} opacity={0.7} strokeLinecap="round" />
      <rect x={24} y={10} width={52} height={17} rx={4} fill={lid.fill} {...edge(lidC, 2.6)} />
      {[32, 40, 48, 56, 64].map((x) => <path key={x} d={`M${x + 2} 14 L${x + 2} 23`} stroke={darken(lidC, 0.18)} strokeWidth={1.6} strokeLinecap="round" />)}
      <Shine x={33} y={15} rx={5} ry={2.5} rot={-10} />
    </g>
  )
}

/** A round honey pot with golden honey dripping over the top and a wooden dipper. */
function Honey() {
  const potC = '#e08a3c'
  const pot = useShade(potC, 0.35, 0.2)
  const honeyC = '#ffc52f'
  const honey = useShade(honeyC, 0.45, 0.12)
  const woodC = '#c78d55'
  return (
    <g>
      <defs>{pot.def}{honey.def}</defs>
      <ellipse {...groundShadow(50, 92, 34)} />
      <path d="M31 36 C14 42 8 58 12 72 C15 84 26 91 37 91 L63 91 C74 91 85 84 88 72 C92 58 86 42 69 36Z" fill={pot.fill} {...edge(potC, 2.8)} />
      <path d="M13 66 Q50 78 87 66" stroke={darken(potC, 0.15)} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M14 73 Q50 85 86 73" stroke={darken(potC, 0.15)} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
      <rect x={24} y={25} width={52} height={12} rx={6} fill={darken(potC, 0.05)} {...edge(potC, 2.6)} />
      <path d="M24 31 Q24 25 30 25 L70 25 Q76 25 76 31 L76 37 Q74 42 70.5 39 L70.5 49 Q70.5 53 67 53 Q63.5 53 63.5 49 L63.5 40.5 Q58 44 53.5 41.5 L53.5 56 Q53.5 60 50 60 Q46.5 60 46.5 56 L46.5 41.5 Q40 44 36.5 40.5 L36.5 46 Q36.5 49.5 33 49.5 Q29.5 49.5 29.5 46 L29.5 39.5 Q25 40 24 36Z" fill={honey.fill} {...edge(honeyC, 2.2)} />
      <ellipse cx={50} cy={28.5} rx={21} ry={3.2} fill={darken(honeyC, 0.18)} />
      <path d="M52 28 L78 5" stroke={ink(woodC)} strokeWidth={8} strokeLinecap="round" />
      <path d="M52 28 L78 5" stroke={woodC} strokeWidth={4.5} strokeLinecap="round" />
      <Shine x={27} y={56} rx={5} ry={8} rot={20} />
    </g>
  )
}

export const FOOD: Item[] = [
  { id: 'bread', name: 'loaf of bread', emoji: ['🍞'], Draw: Bread },
  { id: 'strawberry', name: 'strawberry', emoji: ['🍓'], Draw: Strawberry },
  { id: 'pizza', name: 'pizza', emoji: ['🍕'], Draw: Pizza },
  { id: 'ice-cream', name: 'ice cream', emoji: ['🍦'], Draw: IceCream },
  { id: 'egg', name: 'egg', emoji: ['🥚'], Draw: Egg },
  { id: 'chocolate-chip', name: 'chocolate chip', emoji: ['🍫'], Draw: ChocolateChip },
  { id: 'banana', name: 'banana', emoji: ['🍌'], Draw: Banana },
  { id: 'blueberry', name: 'blueberry', emoji: ['🫐'], Draw: Blueberry },
  { id: 'apple', name: 'apple', emoji: ['🍎'], Draw: Apple },
  { id: 'grapes', name: 'grapes', emoji: ['🍇'], Draw: Grapes },
  { id: 'carrot', name: 'carrot', emoji: ['🥕'], Draw: Carrot },
  { id: 'tomato', name: 'tomato', emoji: ['🍅'], Draw: Tomato },
  { id: 'cheese', name: 'cheese', emoji: ['🧀'], Draw: Cheese },
  { id: 'cherries', name: 'cherries', emoji: ['🍒'], Draw: Cherries },
  { id: 'pancakes', name: 'pancakes', emoji: ['🥞'], Draw: Pancakes },
  { id: 'cookie', name: 'cookie', emoji: ['🍪'], Draw: Cookie },
  { id: 'sandwich', name: 'sandwich', emoji: ['🥪'], Draw: Sandwich },
  { id: 'smoothie', name: 'smoothie', emoji: ['🥤'], Draw: Smoothie },
  { id: 'soup', name: 'soup', emoji: ['🍲'], Draw: Soup },
  { id: 'salad', name: 'fruit salad', emoji: ['🥗'], Draw: FruitSalad },
  { id: 'cake', name: 'birthday cake', emoji: ['🎂'], Draw: BirthdayCake },
  { id: 'plate', name: 'empty plate', emoji: ['🍽️', '🍽'], Draw: Plate },
  { id: 'cup', name: 'cup', emoji: ['☕'], Draw: Cup },
  { id: 'jar', name: 'jar', emoji: ['🫙'], Draw: Jar },
  { id: 'honey', name: 'honey', emoji: ['🍯'], Draw: Honey },
]
