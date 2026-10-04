// Elijah (1 Kings 17 and 18): one picture per story page, both parts in order (see data/elijah.ts for the words).
// Built from the kit (./kit.tsx) and people (../people.tsx): Figure (faces for feelings, reaching hands, things
// held), Kneel, SittingOnRock and Sitting. God is never drawn as a person: His care and His fire are light (Glow,
// Rays, Sparkles). Kept gentle: King Ahab is small and only surprised, the people who prayed to a pretend god just
// learn that God is real (nothing happens to them), and the widow's little boy is there beside his mom, alive and well.
//
// The cast (to move into people.tsx's PEOPLE): ELIJAH (wild dark curly hair, a long dark beard, a teal robe and a
// leather belt), the WIDOW of Zarephath (a faded blue head scarf over dark hair, and a patched terracotta robe: draw
// her with Widow), her little boy (WIDOWS_BOY), KING_AHAB (a red robe, a gold crown and a short black beard), Elijah's
// HELPER (the young man who saw the little cloud), the CALLERS (the people who prayed to a pretend god, in plum robes
// and cream head cloths) and FOLK (God's people on Mount Carmel).
// New props, for any island: Raven and PerchedRaven (bread or meat in the beak), Meat, Brook (flowing or dried up),
// Crag (an angular rock; `flat` to stand on), DeadTree (a bare tree with a perch), Cracks and Wilted (a dry land),
// StickBundle, FlourJar and OilJug, ClayOven, Elijah's altar of twelve stones and its parts (AltarRow, AltarWood,
// Ditch, DitchWater, Rivulets, JarsOnWood, LyingJar, Pour: the mini-game builds it from these), HeavenFire and
// StoneFlames (God's fire falling from heaven), Steam, Scorch, Carmel (the mountaintop by the sea), and Folk and Crowd
// (people far off, standing, cheering or kneeling).
import { useId, type ComponentProps, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { ink, useShade } from '../kit'
import { EyesUp, Figure, Kneel, LookingUp, Person, ShutEyes, SilverHair, Sitting, SittingOnRock, SKIN, type Look } from '../people'
import { Bread, Cloud, Flower, Glow, Palm, Rain, Rays, Rock, Scene, Sparkles, Sun, Tap } from './kit'
import './elijah.css'

type Pt = [number, number]
const f = (n: number) => n.toFixed(1)
const gid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '')
const css = (o: Record<string, string>) => o as CSSProperties

/** A repeatable run of "random" numbers from 0 to 1 (so a picture comes out the same every time). */
function seeded(seed: number) {
  let s = (seed * 7919 + 13) % 2147483647
  return () => (s = (s * 48271) % 2147483647) / 2147483647
}

/** A smooth closed outline through the points. */
function smooth(ps: Pt[]) {
  const n = ps.length
  const at = (i: number) => ps[(i + n) % n]
  return `M${f(ps[0][0])} ${f(ps[0][1])}` + ps.map((_, i) => {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    return ` C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`
  }).join('') + 'Z'
}

/** A tongue of flame (or a falling one, upside down in spirit): a teardrop, round at (0, 0) and pointed at (0, -h). */
export const flame = (w: number, h: number) =>
  `M0 ${-h} C${w * 0.35} ${-h * 0.62} ${w} ${-h * 0.42} ${w} ${-h * 0.18} C${w} ${-h * 0.02} ${w * 0.55} 0 0 0 C${-w * 0.55} 0 ${-w} ${-h * 0.02} ${-w} ${-h * 0.18} C${-w} ${-h * 0.42} ${-w * 0.35} ${-h * 0.62} 0 ${-h} Z`

// ---------- The people (the same on every page) ----------

/** Elijah, God's prophet: wild dark curly hair, a long dark beard, a teal robe and a leather belt. */
export const ELIJAH: Look = { skin: SKIN.tan, hair: 'curly', hairColor: '#3b2a20', beard: 'long', beardColor: '#3b2a20', robe: '#3e8a80', sash: '#7a4a24' }
/** The widow of Zarephath: a faded blue head scarf over dark hair, and a plain terracotta robe with a patch on it (draw her with Widow). */
export const WIDOW: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#9aaccc', robe: '#c4876a', sash: '#efe2c8' }
/** The widow's little boy. */
export const WIDOWS_BOY: Look = { skin: SKIN.medium, hair: 'short', hairColor: '#3b2a20', robe: '#8fb26a', sash: '#efe2c8', build: 'child' }
/** King Ahab: a red robe, a gold sash and crown, and a short black beard. Only ever surprised, never scary. */
export const KING_AHAB: Look = { skin: SKIN.medium, hair: 'short', hairColor: '#2b1f18', beard: 'short', beardColor: '#2b1f18', robe: '#b8434a', sash: '#f2c94c', crown: true }
/** Elijah's helper, a young man (he poured the water, and saw the little cloud). */
export const HELPER: Look = { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#f1e6cc', robe: '#d9a24a', sash: '#7a4a24' }
/** The people who prayed to a pretend god: plum robes, gold sashes and cream head cloths, so they're easy to spot. */
export const CALLERS: Look[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#2b1f18', wrap: '#f3ead8', beard: 'short', beardColor: '#2b1f18', robe: '#a3477e', sash: '#f2c94c' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#f3ead8', beard: 'long', beardColor: '#4a3020', robe: '#a3477e', sash: '#f2c94c' },
  { skin: '#e3b48c', hair: 'covered', hairColor: '#3b2a20', wrap: '#f3ead8', robe: '#a3477e', sash: '#f2c94c' },
  { skin: SKIN.deep, hair: 'covered', hairColor: '#2b1f18', wrap: '#f3ead8', beard: 'short', beardColor: '#2b1f18', robe: '#a3477e', sash: '#f2c94c' },
]
/** God's people on Mount Carmel. */
export const FOLK: Look[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#7cb0e0', robe: '#e6b85a', sash: '#a0612f' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#e8dcc0', beard: 'short', beardColor: '#4a3020', robe: '#5f8fc0', sash: '#f0d38a' },
  { skin: '#e3b48c', hair: 'covered', hairColor: '#3b2a20', wrap: '#e8668a', robe: '#7cb06a', sash: '#fff3d6' },
  { skin: SKIN.deep, hair: 'covered', hairColor: '#2b1f18', wrap: '#f5f0e6', beard: 'short', beardColor: '#2b1f18', robe: '#e07a5f', sash: '#5f8fc0' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#d9b56a', beard: 'long', beardColor: '#eeeae2', robe: '#9a8fd0', sash: '#f0d38a' },
  { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', robe: '#f29a9a', sash: '#fff3d6', build: 'child' },
]

type FigProps = Omit<ComponentProps<typeof Figure>, 'look'>

/** Elijah. */
export const Elijah = (p: FigProps) => <Figure {...p} look={ELIJAH} />

/** A patch sewn on a robe (in a Person's own units): she's poor. */
const Patch = () => (
  <g>
    <path d="M9 -31 L21 -32 L22 -20 L10 -19 Z" fill="#d9b88a" stroke="#9a7048" strokeWidth={1.4} strokeLinejoin="round" />
    <path d="M10.5 -29 l1.6 1.4 M13 -31 l0 2 M18 -31.4 l0 2 M20.6 -27 l-1.8 0.8 M20.8 -22.4 l-1.8 -0.6 M12 -20.6 l1.4 -1.4" stroke="#7a5233" strokeWidth={1} strokeLinecap="round" />
  </g>
)

/** The widow, with her dark hair peeking out under her scarf and the patch on her robe. */
export function Widow({ children, ...p }: FigProps) {
  return <Figure {...p} look={WIDOW}><SilverHair color="#3b2a20" /><Patch />{children}</Figure>
}

/** Where a figure at (fx, fy), `fs` big, facing `facing`, must reach to touch (tx, ty) in the picture: in its own units. */
const reach = (fx: number, fy: number, fs: number, tx: number, ty: number, facing: 'left' | 'right' = 'right'): Pt =>
  [((tx - fx) / fs) * (facing === 'left' ? -1 : 1), (ty - fy) / fs]

/** A surprised face, drawn over a bearded Person's own (in its units): a little round "Oh!" of a mouth. */
const Surprised = () => <ellipse cx={0} cy={-98.6} rx={2.8} ry={3.6} fill="#6b2a3a" stroke="#d0707e" strokeWidth={1.2} />

/** A mouth open wide, calling out (in a Figure's own units, over its own mouth). */
const Shout = ({ beard }: { beard?: boolean }) => (
  <ellipse cx={0} cy={beard ? -98.2 : -103.6} rx={beard ? 3.6 : 4.2} ry={beard ? 4.6 : 5.2} fill="#6b2a3a" stroke={beard ? '#d0707e' : '#4a1a2a'} strokeWidth={1.3} />
)

/** A big yawn, eyes shut (in a Person's own units; wrap the Person in a "dn-shut" group with ShutEyes): so tired. */
const Yawn = ({ beard }: { beard?: boolean }) => (
  <g>
    <ellipse cx={0} cy={beard ? -98 : -104} rx={beard ? 4 : 4.6} ry={beard ? 5.4 : 6} fill="#6b2a3a" stroke={beard ? '#d0707e' : '#4a1a2a'} strokeWidth={1.3} />
    <path d="M-12.5 -119.4 L-4.5 -122 M12.5 -119.4 L4.5 -122" stroke="#2b1f18" strokeWidth={2} strokeLinecap="round" />
  </g>
)

// ---------- Birds and food ----------

/**
 * The ravens' colors: near-black, with a blue sheen where the light catches them, like Crumbs (art/pals/raven.tsx).
 * `body` and `wing` are glossy fills: [lit, middle, shadow].
 */
const RAVEN = {
  body: ['#5c6b9e', '#2b2e40', '#17181f'], wing: ['#4f5c8c', '#24273a', '#131419'], far: '#1a1c28', belly: '#3b4262',
  sheen: '#86a2f0', feather: '#48537e', beak: '#4b4f62', beakTop: '#9399b2', beakLine: '#202230', leg: '#34374a', line: '#0f1018',
}

/** A glossy fill, lit at the top left and deep at the edges (three colors). Render `def` once in the same svg. */
function useGloss([light, mid, dark]: string[]) {
  const id = `gl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return {
    fill: `url(#${id})`,
    def: (
      <radialGradient key={id} id={id} cx="35%" cy="30%" r="78%">
        <stop offset="0" stopColor={light} /><stop offset="0.55" stopColor={mid} /><stop offset="1" stopColor={dark} />
      </radialGradient>
    ),
  }
}

/** A piece of meat on the bone, like a drumstick: the meat's middle at (0, 0), the bone to the right; about 32 long. */
export function Meat({ x = 0, y = 0, s = 1, a = 0 }: { x?: number; y?: number; s?: number; a?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <path d="M4 0 L15 0" stroke="#c9b48a" strokeWidth={6} strokeLinecap="round" />
      <path d="M4 0 L15 0" stroke="#f8f0de" strokeWidth={4} strokeLinecap="round" />
      <circle cx={16.5} cy={-2.6} r={3} fill="#f8f0de" stroke="#c9b48a" strokeWidth={1.2} />
      <circle cx={16.5} cy={2.6} r={3} fill="#f8f0de" stroke="#c9b48a" strokeWidth={1.2} />
      <path d="M-14 0 C-14 -8 -6 -10 0 -8 C6 -6 8 -3 8 0 C8 3 6 6 0 8 C-6 10 -14 8 -14 0 Z" fill="#b8643c" stroke="#7a3a22" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M-10 -3 C-7 -6 -2 -6 2 -4.5" stroke="#e09a68" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Food held in a raven's beak, its middle just past the beak's tip (at (0, 0)). */
const BeakFood = ({ food }: { food: 'bread' | 'meat' }) =>
  food === 'bread' ? <Bread x={4} y={3} s={0.52} /> : <Meat x={3} y={5} s={0.82} a={14} />

/** A raven's beak (big, a little hooked), with the light catching its top edge: its root at (x, y), pointing right. */
const RavenBeak = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 -4.5 Q9 -6 18 0.5 Q14 2.4 9.5 2.8 L0 4.5 Z" fill={RAVEN.beak} stroke={RAVEN.beakLine} strokeWidth={1.5} strokeLinejoin="round" />
    <path d="M2 -3.6 Q9 -4.6 15 -0.6" stroke={RAVEN.beakTop} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.85} />
    <path d="M1.5 0.4 L13 1.2" stroke={RAVEN.beakLine} strokeWidth={1.1} strokeLinecap="round" />
  </g>
)

/** A bright, friendly eye: its middle at (x, y). */
const RavenEye = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r={3.6} fill="#f6f7ff" />
    <circle cx={x + 0.8} cy={y} r={2.3} fill="#0f1018" />
    <circle cx={x + 0.1} cy={y - 0.9} r={0.85} fill="#fff" />
  </g>
)

/** A raven's wing raised in flight (facing right), from its shoulder at (9, -6): long rounded flight feathers fanned out at its tip (the "fingers"), the soft covert feathers over their roots. */
const WRIST: Pt = [-14, -33]
const PRIMARIES: Pt[] = [[-40, -60], [-48, -54], [-54, -46], [-57, -37]]
function RavenWing({ fill, plain }: { fill: string; plain?: boolean }) {
  const d = (p: Pt) => `M${WRIST[0]} ${WRIST[1]} L${p[0]} ${p[1]}`
  // (each flight feather's quill, from just past the wrist to near its tip, light enough to see on black)
  const quill = (p: Pt) => `M${f(WRIST[0] + (p[0] - WRIST[0]) * 0.35)} ${f(WRIST[1] + (p[1] - WRIST[1]) * 0.35)} L${f(WRIST[0] + (p[0] - WRIST[0]) * 0.86)} ${f(WRIST[1] + (p[1] - WRIST[1]) * 0.86)}`
  return (
    <g>
      {PRIMARIES.map((p, i) => <path key={i} d={d(p)} stroke={RAVEN.line} strokeWidth={10} strokeLinecap="round" />)}
      {PRIMARIES.map((p, i) => <path key={`f${i}`} d={d(p)} stroke={plain ? fill : RAVEN.wing[1]} strokeWidth={7} strokeLinecap="round" />)}
      {!plain && PRIMARIES.map((p, i) => <path key={`q${i}`} d={quill(p)} stroke={RAVEN.feather} strokeWidth={1.2} strokeLinecap="round" />)}
      <path d="M9 -6 C6 -18 -2 -28 -12 -36 C-20 -42 -30 -38 -34 -30 Q-38 -26 -36 -22 Q-38 -17 -33 -14 Q-32 -10 -26 -9 C-14 -7 -2 -6 9 -6 Z"
        fill={fill} stroke={RAVEN.line} strokeWidth={2} strokeLinejoin="round" />
      {!plain && <path d="M-33 -22 Q-20 -15 -6 -11" stroke={RAVEN.feather} strokeWidth={1.3} fill="none" strokeLinecap="round" />}
      {!plain && <path d="M2 -10 Q-8 -20 -18 -28" stroke={RAVEN.sheen} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.6} />}
    </g>
  )
}

/**
 * A raven flying (facing right, or `facing="left"`): a big glossy black bird with a blue sheen, the near wing in front
 * of its body and the far wing behind it, both beating from the shoulder; a wedge-shaped tail at the back, and a big
 * beak that can carry `food`. (x, y) = the middle of its body; about 110 from tail to beak at s = 1.
 */
export function Raven({ x, y, s = 1, facing = 'right', food }: { x: number; y: number; s?: number; facing?: 'left' | 'right'; food?: 'bread' | 'meat' }) {
  const body = useGloss(RAVEN.body)
  const wing = useGloss(RAVEN.wing)
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
        <defs>{body.def}{wing.def}</defs>
        {/* far wing, behind the body (tipped forward, so both show) */}
        <g transform="rotate(30 8 -7) scale(0.9)">
          <g className="sc-wing far" style={css({ '--o': '95% 100%' })}>
            <RavenWing fill={RAVEN.far} plain />
          </g>
        </g>
        {/* the wedge-shaped tail */}
        <path d="M-24 -3 L-47 -9 Q-55 -4 -58 2 Q-55 8 -47 12 L-24 8 Z" fill={wing.fill} stroke={RAVEN.line} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-30 2 L-52 2 M-30 -2 L-48 -6 M-30 6 L-48 9" stroke={RAVEN.feather} strokeWidth={1.2} strokeLinecap="round" />
        {/* body and head */}
        <path d="M-31 3 C-25 -11 1 -17 15 -11 C25 -6 23 9 7 12 C-8 16 -25 14 -31 3 Z" fill={body.fill} stroke={RAVEN.line} strokeWidth={2} />
        <path d="M-20 9 C-8 13 4 11 12 5" stroke={RAVEN.belly} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <circle cx={21} cy={-10} r={10.5} fill={body.fill} stroke={RAVEN.line} strokeWidth={2} />
        <path d="M13 -17 Q20 -21.5 27 -17.5" stroke={RAVEN.sheen} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />
        {/* the shaggy feathers at its throat */}
        <path d="M19 -1 l2 5 l2.5 -4 l2.5 3.5 l1 -5" stroke={RAVEN.line} strokeWidth={1.4} fill={RAVEN.body[1]} strokeLinejoin="round" />
        {/* what it carries, held in the tip of its beak */}
        {food && <g transform="translate(43 -8)"><BeakFood food={food} /></g>}
        <RavenBeak x={29} y={-10} />
        <RavenEye x={23.5} y={-12.6} />
        {/* near wing, in front, with its fingered tips */}
        <g className="sc-wing" style={css({ '--o': '95% 100%' })}>
          <RavenWing fill={wing.fill} />
        </g>
      </g>
    </g>
  )
}

/**
 * A raven perched (facing right, or `facing="left"`): standing tall on two legs with three toes forward on each foot,
 * its wing folded at its side and its tail pointing down behind. (x, y) = its feet on the perch; about 70 tall at s = 1.
 */
export function PerchedRaven({ x, y, s = 1, facing = 'right', food }: { x: number; y: number; s?: number; facing?: 'left' | 'right'; food?: 'bread' | 'meat' }) {
  const body = useGloss(RAVEN.body)
  const wing = useGloss(RAVEN.wing)
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{body.def}{wing.def}</defs>
      {/* legs and feet (three toes forward, one back) */}
      {[-3, 6].map((lx) => (
        <g key={lx} stroke={RAVEN.leg} strokeLinecap="round" fill="none">
          <path d={`M${lx} -16 L${lx - 1} -2`} strokeWidth={3} />
          <path d={`M${lx - 1} -1 l7 1 M${lx - 1} -1 l5.5 2.6 M${lx - 1} -1 l6 -1.4 M${lx - 1} -1 l-4 0.6`} strokeWidth={2} />
        </g>
      ))}
      {/* the tail, pointing down behind */}
      <path d="M-11 -25 L-29 -6 Q-28 -1 -23 0 L-4 -19 Z" fill={wing.fill} stroke={RAVEN.line} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-10 -21 L-25 -4" stroke={RAVEN.feather} strokeWidth={1.2} strokeLinecap="round" />
      {/* body, leaning forward a little */}
      <ellipse cx={1} cy={-31} rx={16} ry={21} transform="rotate(-24 1 -31)" fill={body.fill} stroke={RAVEN.line} strokeWidth={2} />
      <path d="M10 -40 C14 -30 12 -20 4 -14" stroke={RAVEN.belly} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* the wing folded at its side, its feather tips toward the tail */}
      <path d="M10 -43 C2 -46 -10 -40 -16 -28 C-19 -22 -21 -17 -22 -12 C-18 -14 -16 -13 -14 -12 C-12 -15 -9 -15 -7 -14 C-5 -17 -2 -17 0 -16 C6 -22 10 -32 10 -43 Z"
        fill={wing.fill} stroke={RAVEN.line} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M2 -24 Q-8 -20 -14 -13 M6 -30 Q-4 -26 -12 -18" stroke={RAVEN.feather} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <path d="M4 -38 Q-4 -32 -10 -22" stroke={RAVEN.sheen} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* head, throat feathers, beak and eye */}
      <circle cx={12} cy={-53} r={10.5} fill={body.fill} stroke={RAVEN.line} strokeWidth={2} />
      <path d="M5 -60 Q11 -64.5 18 -61" stroke={RAVEN.sheen} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d="M11 -44 l2 5 l2.5 -4 l2 3 l1 -4" stroke={RAVEN.line} strokeWidth={1.3} fill={RAVEN.body[1]} strokeLinejoin="round" />
      {food && <g transform="translate(34 -51)"><BeakFood food={food} /></g>}
      <RavenBeak x={20} y={-53} />
      <RavenEye x={14.6} y={-55.6} />
    </g>
  )
}

// ---------- A dry land ----------

/** Dry, cracked ground: a patch from x0 to x1, y0 to y1. */
export function Cracks({ x0, x1, y0, y1, seed = 9, n = 14, color = '#a8875a' }: { x0: number; x1: number; y0: number; y1: number; seed?: number; n?: number; color?: string }) {
  const rnd = seeded(seed)
  let d = ''
  for (let i = 0; i < n; i++) {
    const cx = x0 + rnd() * (x1 - x0), cy = y0 + rnd() * (y1 - y0)
    const k = 0.6 + ((cy - y0) / Math.max(1, y1 - y0)) * 0.6
    d += `M${f(cx)} ${f(cy)} l${f((8 + rnd() * 8) * k)} ${f((-2 + rnd() * 4) * k)} l${f((6 + rnd() * 6) * k)} ${f((3 + rnd() * 3) * k)} M${f(cx + 9 * k)} ${f(cy + 1)} l${f((-2 + rnd() * 3) * k)} ${f((5 + rnd() * 4) * k)} `
  }
  return <path d={d} stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
}

/** A little tuft of dried-up plants, brown and drooping: (x, y) its foot. */
export const Wilted = ({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 0 Q1 -18 9 -24 Q14 -26 16 -20 M-3 0 Q-6 -14 -13 -18 Q-17 -19 -18 -14 M2 0 Q5 -10 12 -11" stroke="#a8875a" strokeWidth={2} />
    <path d="M16 -20 Q17 -15 15 -11 M-18 -14 Q-18 -10 -16 -7" stroke="#8f7048" strokeWidth={3} />
    <path d="M-2 0 Q-12 -2 -16 2 Q-8 3 -2 0 Z" fill="#c2a06c" stroke="#9a7a4e" strokeWidth={1.2} />
  </g>
)

/** Tufts of grass: dry and straw-colored, or fresh and green. */
const Tufts = ({ spots, color = '#b8964e', s = 1 }: { spots: Pt[]; color?: string; s?: number }) => (
  <path d={spots.map(([x, y]) => `M${x - 6 * s} ${y} l${2 * s} ${-8 * s} M${x - 1 * s} ${y} l${1 * s} ${-11 * s} M${x + 4 * s} ${y} l${-1 * s} ${-8 * s} M${x + 8 * s} ${y} l${-3 * s} ${-6 * s}`).join(' ')}
    stroke={color} strokeWidth={2 * Math.min(1, s + 0.2)} fill="none" strokeLinecap="round" />
)

/** A bare, dry bush or little tree: brown twigs with a few last leaves. (x, y) its foot. */
function DryBush({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 L-2 -30 M-1 -16 L-16 -34 M-2 -30 L-10 -52 M-2 -30 L8 -50 M0 -12 L14 -28 M14 -28 L24 -36 M8 -50 L16 -60"
        stroke="#8a6840" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      {[[-16, -35], [-10, -53], [16, -61], [24, -37], [8, -50]].map(([lx, ly], i) => (
        <ellipse key={i} cx={lx} cy={ly} rx={4.2} ry={2.6} fill={i % 2 ? '#b9a25a' : '#a89a5a'} transform={`rotate(${i * 40 - 30} ${lx} ${ly})`} />
      ))}
    </g>
  )
}

/** A bare, dried-up little tree with a flat branch to perch on: (x, y) its foot; the perch runs out to (x + 40s, y - 62s). */
function DeadTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const d = 'M0 0 Q-4 -30 2 -62 M2 -62 Q-8 -80 -22 -90 M2 -62 Q6 -84 12 -98 M0 -38 Q-14 -46 -28 -44 M2 -62 L40 -63 M28 -63 Q32 -70 38 -76'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="#5e4028" strokeWidth={7} />
      <path d={d} stroke="#94704a" strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={12} ry={3} fill="#000" opacity={0.1} />
    </g>
  )
}

/** A soft, hot shimmer over the dry ground. */
const Heat = ({ spots }: { spots: Pt[] }) => (
  <g>
    {spots.map(([x, y], i) => (
      <g key={i} className="el-heat" style={{ animationDelay: `${-i * 0.7}s` }}>
        <path d={`M${x - 14} ${y} q7 -5 14 0 q7 5 14 0`} stroke="#fff6d8" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      </g>
    ))}
  </g>
)

/**
 * A craggy rock: blocky and angular, with a sunlit top face and a crack or two. (x, y) = the middle of its foot;
 * w wide and h tall. `flip`: mirrored; `flat`: a flatter top, h up, to stand on.
 */
export function Crag({ x, y, w = 100, h = 60, color = '#c8b393', seed = 1, flip, flat }: { x: number; y: number; w?: number; h?: number; color?: string; seed?: number; flip?: boolean; flat?: boolean }) {
  const shade = useShade(color, 0.2, 0.28)
  const rnd = seeded(seed)
  const shape: Pt[] = flat
    ? [[-0.5, 0], [-0.48, -0.42], [-0.4, -0.86], [-0.22, -1], [0.02, -0.99], [0.22, -1], [0.4, -0.9], [0.5, -0.4], [0.5, 0]]
    : [[-0.5, 0], [-0.48, -0.4], [-0.38, -0.78], [-0.16, -1], [0.06, -0.88], [0.24, -0.96], [0.41, -0.66], [0.5, -0.24], [0.5, 0]]
  const pts = shape.map(([px, py], i): Pt => [px * w + (i && i < 8 ? (rnd() - 0.5) * w * 0.06 : 0), py * h * (flat ? 1 : 0.9 + rnd() * 0.18)])
  const top = pts.slice(1, 8)
  const outline = `M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L')} Z`
  // the sunlit top face: along the top edge, and back along a line a little lower down
  const face = `M${top.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L')} ` + top.slice().reverse().map((p, i) => `L${f(p[0] * 0.84)} ${f(p[1] + h * (0.2 + 0.07 * (i % 2)))}`).join(' ') + ' Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <defs>{shade.def}</defs>
      <ellipse cx={0} cy={0} rx={w * 0.52} ry={4} fill="#000" opacity={0.1} />
      <path d={outline} fill={shade.fill} stroke={ink(color)} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={face} fill="#fff" opacity={0.2} />
      <path d={`M${f(w * 0.1)} ${f(-h * 0.72)} l${f(w * 0.06)} ${f(h * 0.24)} l${f(-w * 0.04)} ${f(h * 0.22)}`} stroke={ink(color)} strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      <path d={`M${f(-w * 0.3)} ${f(-h * 0.34)} l${f(w * 0.08)} ${f(h * 0.12)}`} stroke={ink(color)} strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.5} />
    </g>
  )
}

// ---------- The brook ----------

/**
 * The little brook Elijah stayed by (1 Kings 17:3): a stream winding down a rocky valley toward us, from (x0, y0)
 * far off to the bottom of the picture, with reeds along it. `dry`: it has dried up, and only a pale, cracked bed
 * of mud and pebbles is left.
 */
export function Brook({ dry, x0 = 470, y0 = 262 }: { dry?: boolean; x0?: number; y0?: number }) {
  const id = gid(useId())
  // its two banks, from far (narrow) to near (wide)
  const left = `M${x0 - 6} ${y0} C${x0 - 30} ${y0 + 40} ${x0 + 20} ${y0 + 70} ${x0 - 30} ${y0 + 110} C${x0 - 80} ${y0 + 150} ${x0 - 40} ${y0 + 175} ${x0 - 110} 460`
  const right = `L${x0 + 110} 460 C${x0 + 60} ${y0 + 175} ${x0 + 70} ${y0 + 140} ${x0 + 20} ${y0 + 110} C${x0 + 60} ${y0 + 70} ${x0 + 10} ${y0 + 40} ${x0 + 6} ${y0} Z`
  const bed = left + ' ' + right
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fd6f5" /><stop offset="1" stopColor="#4ea3df" /></linearGradient>
        <clipPath id={`${id}c`}><path d={bed} /></clipPath>
      </defs>
      {/* the banks: a band of damp earth (or dry dust) along the water */}
      <path d={bed} fill={dry ? '#e9dcbc' : '#9a7a52'} stroke={dry ? '#b8955e' : '#7a5a3a'} strokeWidth={8} strokeLinejoin="round" />
      {dry ? (
        <g clipPath={`url(#${id}c)`}>
          <path d={bed} fill="#efe4c8" />
          <Cracks x0={x0 - 100} x1={x0 + 100} y0={y0 + 24} y1={450} seed={4} n={26} color="#a8865a" />
          {[[x0 - 30, 420, 9], [x0 + 26, 396, 7], [x0 - 8, 352, 6], [x0 + 14, 446, 10], [x0 - 60, 446, 8], [x0 + 4, 312, 5]].map(([px, py, r], i) => (
            <ellipse key={i} cx={px} cy={py} rx={r} ry={r * 0.6} fill="#cfc6b6" stroke="#9a9080" strokeWidth={1.4} />
          ))}
        </g>
      ) : (
        <g clipPath={`url(#${id}c)`}>
          <path d={bed} fill={`url(#${id}w)`} />
          {/* ripples running down it */}
          {[[x0, y0 + 30, 6], [x0 - 10, y0 + 80, 10], [x0 - 34, y0 + 128, 14], [x0 - 20, y0 + 170, 18], [x0 - 50, 430, 22], [x0 + 20, 420, 16]].map(([rx, ry, w], i) => (
            <path key={i} className="sc-wave" d={`M${rx - w} ${ry} q${w / 2} -4 ${w} 0 q${w / 2} 4 ${w} 0`} stroke="#e8f7ff" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.85} />
          ))}
          {[[x0 - 24, 400, 8], [x0 + 30, 446, 9]].map(([px, py, r], i) => (
            <ellipse key={i} cx={px} cy={py} rx={r} ry={r * 0.55} fill="#b9b2a4" stroke="#7d766d" strokeWidth={1.4} />
          ))}
        </g>
      )}
    </g>
  )
}

/** Reeds along the water: green, or brown and drooping when it's dry. (x, y) their foot. */
function Reeds({ x, y, s = 1, dry, flip }: { x: number; y: number; s?: number; dry?: boolean; flip?: boolean }) {
  const c = dry ? '#b49a5e' : '#5aa850'
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="none" strokeLinecap="round">
      <path d={dry ? 'M0 0 Q2 -24 14 -34 M-6 0 Q-8 -20 -20 -28 M4 0 Q8 -18 20 -20' : 'M0 0 Q1 -26 6 -46 M-6 0 Q-10 -22 -16 -38 M4 0 Q10 -18 18 -34 M-2 0 Q-2 -16 -6 -30'}
        stroke={c} strokeWidth={3.2} />
      {!dry && <path d="M6 -46 l-1 -9 M-16 -38 l-2 -8" stroke="#8a5a32" strokeWidth={5} />}
    </g>
  )
}

// ---------- Sticks, bread, flour and oil ----------

/** A bundle of sticks held across in front (in a Figure's own units, as its `item`): `n` sticks about `w` long. */
const StickBundle = ({ w = 70, n = 5, y = -62 }: { w?: number; n?: number; y?: number }) => (
  <g strokeLinecap="round">
    {Array.from({ length: n }, (_, i) => {
      const dy = (i - (n - 1) / 2) * 3.4
      const tilt = ((i * 7) % 5) - 2
      return (
        <g key={i}>
          <path d={`M${-w / 2 + (i % 2) * 4} ${y + dy - tilt} L${w / 2 - ((i + 1) % 2) * 5} ${y + dy + tilt}`} stroke="#6b4422" strokeWidth={4.6} />
          <path d={`M${-w / 2 + (i % 2) * 4} ${y + dy - tilt} L${w / 2 - ((i + 1) % 2) * 5} ${y + dy + tilt}`} stroke="#a0703f" strokeWidth={2.6} />
        </g>
      )
    })}
    <path d={`M${-w * 0.36} ${y + 2} l6 -4`} stroke="#6b4422" strokeWidth={2} />
  </g>
)

/** Sticks lying on the ground: [x, y, angle, length] each. */
const GroundSticks = ({ sticks }: { sticks: [number, number, number, number][] }) => (
  <g strokeLinecap="round">
    {sticks.map(([x, y, a, l], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
        <path d={`M${-l / 2} 0 L${l / 2} 0 M${l * 0.15} 0 l6 -5`} stroke="#6b4422" strokeWidth={4.2} />
        <path d={`M${-l / 2} 0 L${l / 2} 0`} stroke="#a0703f" strokeWidth={2.2} />
      </g>
    ))}
  </g>
)

/**
 * The widow's big clay jar of flour, with soft white flour heaped up in its mouth (it never ran out, 1 Kings 17:16).
 * (x, y) = its foot; about 64 tall at s = 1.
 */
export function FlourJar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const clay = useShade('#c97a4c', 0.3, 0.22)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{clay.def}</defs>
      <ellipse cx={0} cy={0} rx={28} ry={4} fill="#000" opacity={0.14} />
      <path d="M-14 -56 L14 -56 L12 -48 Q30 -40 29 -20 Q28 -2 0 0 Q-28 -2 -29 -20 Q-30 -40 -12 -48 Z" fill={clay.fill} stroke="#7a3f22" strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M-26 -30 Q0 -22 26 -30" stroke="#f0c08a" strokeWidth={3.4} fill="none" />
      <path d="M-25 -24 Q0 -16 25 -24" stroke="#8a4a2a" strokeWidth={1.6} fill="none" strokeDasharray="3 4" />
      <ellipse cx={0} cy={-56} rx={15} ry={4.5} fill="#e8d6b8" stroke="#7a3f22" strokeWidth={2.2} />
      {/* the flour, heaped up */}
      <path d="M-13 -57 Q-10 -68 0 -70 Q10 -68 13 -57 Q0 -53 -13 -57 Z" fill="#fffdf6" stroke="#ddd2c0" strokeWidth={1.6} strokeLinejoin="round" />
      <ellipse cx={-14} cy={-36} rx={3.5} ry={8} fill="#fff" opacity={0.25} />
    </g>
  )
}

/** The widow's little jug of olive oil, a golden drop gathering at its spout. (x, y) = its foot; about 46 tall at s = 1. */
export function OilJug({ x, y, s = 1, drip = true }: { x: number; y: number; s?: number; drip?: boolean }) {
  const clay = useShade('#e0b45e', 0.32, 0.22)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{clay.def}</defs>
      <ellipse cx={0} cy={0} rx={18} ry={3} fill="#000" opacity={0.14} />
      {/* the handle at the back, then the jug and its spout */}
      <path d="M-11 -34 Q-26 -34 -24 -22 Q-23 -14 -14 -14" stroke="#8a5a22" strokeWidth={4.4} fill="none" strokeLinecap="round" />
      <path d="M-6 -42 L6 -42 L5 -36 Q19 -30 18 -14 Q17 -1 0 0 Q-17 -1 -18 -14 Q-19 -30 -5 -36 Z" fill={clay.fill} stroke="#8a5a22" strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M5 -38 Q14 -42 19 -46 Q17 -40 8 -34 Z" fill="#e0b45e" stroke="#8a5a22" strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={0} cy={-42} rx={6.5} ry={2.2} fill="#7a4a12" />
      <path d="M-15 -20 Q0 -15 15 -20" stroke="#fff3c8" strokeWidth={2.6} fill="none" opacity={0.7} />
      <ellipse cx={-9} cy={-24} rx={2.6} ry={6} fill="#fff" opacity={0.3} />
      {/* a drop of golden oil at the spout */}
      {drip && (
        <g transform="translate(19.5 -45)">
          <g className="el-drip">
            <path d="M0 0 Q-3 5 0 7 Q3 5 0 0 Z" fill="#ffcf3f" stroke="#c8961a" strokeWidth={0.9} />
          </g>
        </g>
      )}
    </g>
  )
}

/** A beehive-shaped clay oven with a warm glow in its little door. (x, y): the middle of its foot. */
function ClayOven({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const clay = useShade('#c98a5a', 0.25, 0.22)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{clay.def}</defs>
      <Glow x={0} y={-24} r={52} color="#ffcf7a" />
      <path d="M-46 0 Q-50 -58 0 -66 Q50 -58 46 0 Z" fill={clay.fill} stroke="#8a4f2a" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-30 -40 Q0 -50 30 -40 M-40 -20 Q0 -28 40 -20" stroke="#b5764a" strokeWidth={2} fill="none" opacity={0.7} />
      <path d="M-14 0 L-14 -16 Q0 -30 14 -16 L14 0 Z" fill="#ffb347" stroke="#8a4f2a" strokeWidth={2.4} />
      <path d="M-8 0 Q-6 -10 0 -14 Q6 -10 8 0 Z" fill="#ffe680" />
      <ellipse cx={-22} cy={-44} rx={5} ry={9} fill="#fff" opacity={0.18} transform="rotate(-25 -22 -44)" />
    </g>
  )
}

// ---------- Elijah's altar of twelve stones (1 Kings 18:31-35) ----------
// In "altar units": (0, 0) is the ground under the middle of the altar's front. Five big stones at the bottom, four on
// them and three on top (twelve), the wood on top of those, the ditch all round it, and the water poured over it all.
// The mini-game (art/games/elijah.tsx) builds the altar from these very pieces, so it looks the same.

export const ALTAR_ROWS = [{ n: 5, y: -17, h: 34 }, { n: 4, y: -46, h: 31 }, { n: 3, y: -73, h: 29 }] as const
const STONE_W = 44
const STONE_COLORS = ['#c9bfac', '#b9ae9b', '#d2c9b8', '#bfb4a0', '#cbbfa6', '#b6ad9e']

/** Where each of the twelve stones is: [x, y, w, h, seed], row by row from the bottom. */
export const ALTAR_STONES: [number, number, number, number, number][] = ALTAR_ROWS.flatMap((r, ri) =>
  Array.from({ length: r.n }, (_, i): [number, number, number, number, number] => [(i - (r.n - 1) / 2) * STONE_W, r.y, STONE_W + 3, r.h, ri * 5 + i + 1]))

/** A rounded block of stone's outline: (cx, cy) its middle, w by h, flatter underneath so it sits on what's below. */
function stonePath(cx: number, cy: number, w: number, h: number, seed: number) {
  const rnd = seeded(seed)
  const pts: Pt[] = Array.from({ length: 10 }, (_, i) => {
    const a = ((i + 0.5 + (rnd() - 0.5) * 0.3) / 10) * Math.PI * 2
    const c = Math.cos(a), s = Math.sin(a)
    const p = s > 0.25 ? 4.5 : 2.8 // (squarer underneath)
    const k = 1 / Math.pow(Math.abs(c) ** p + Math.abs(s) ** p, 1 / p)
    const j = 0.93 + rnd() * 0.08
    return [cx + c * k * (w / 2) * j, cy + s * k * (h / 2) * (s > 0 ? 1 : j)]
  })
  return smooth(pts)
}

/** One stone of the altar (one of ALTAR_STONES), shaded, with a light top edge and a crack or a speck. */
export function AltarStone({ stone: [cx, cy, w, h, seed] }: { stone: [number, number, number, number, number] }) {
  const color = STONE_COLORS[seed % STONE_COLORS.length]
  const shade = useShade(color, 0.3, 0.24)
  return (
    <g>
      <defs>{shade.def}</defs>
      <path d={stonePath(cx, cy, w, h, seed)} fill={shade.fill} stroke={ink(color)} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={`M${f(cx - w * 0.32)} ${f(cy - h * 0.2)} Q${f(cx - w * 0.14)} ${f(cy - h * 0.37)} ${f(cx + w * 0.08)} ${f(cy - h * 0.35)}`} stroke="#fff" strokeOpacity={0.5} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {seed % 3 === 0
        ? <path d={`M${f(cx + w * 0.12)} ${f(cy + h * 0.05)} l5 4 l-1 6`} stroke={ink(color)} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.7} />
        : <circle cx={cx - w * 0.15 + (seed % 4) * 4} cy={cy + h * 0.15} r={1.6} fill={ink(color)} opacity={0.45} />}
    </g>
  )
}

/** A row of the altar's stones (0 is the bottom: five big stones; 1: four more; 2: the last three). */
export function AltarRow({ row }: { row: 0 | 1 | 2 }) {
  const first = ALTAR_ROWS.slice(0, row).reduce((n, r) => n + r.n, 0)
  return <g>{ALTAR_STONES.slice(first, first + ALTAR_ROWS[row].n).map((s) => <AltarStone key={s[4]} stone={s} />)}</g>
}

/** The firewood on top of the altar: log ends stacked, four below and three on top. */
export const WOOD_LOGS: [number, number, number][] = [[-42, -100, 13.5], [-14, -100, 13.5], [14, -100, 13.5], [42, -100, 13.5], [-28, -124, 13], [0, -124, 13], [28, -124, 13]]
export function AltarWood() {
  return (
    <g>
      {/* the logs' sides, going back behind their ends */}
      <path d="M-55 -100 L-46 -112 L48 -112 L56 -100 Z M-41 -124 L-33 -134 L33 -134 L41 -124 Z" fill="#7a4e2c" stroke="#4a2f1c" strokeWidth={2} strokeLinejoin="round" />
      {WOOD_LOGS.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#8a5a33" stroke="#4a2f1c" strokeWidth={2.4} />
          <circle cx={x} cy={y} r={r * 0.76} fill="#e6bb80" stroke="#b9854a" strokeWidth={1.3} />
          <circle cx={x} cy={y} r={r * 0.46} fill="none" stroke="#c99a5e" strokeWidth={1.3} />
          <circle cx={x} cy={y} r={r * 0.15} fill="#b9854a" />
          <path d={`M${x + 1} ${y - 1} l${r * 0.55} ${-r * 0.32}`} stroke="#a8763e" strokeWidth={1.2} strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

/** The ditch round the altar: a ring in altar units (its middle line at y CY, its outside rx by ry, its inside irx by iry). */
const DITCH = { cy: -6, rx: 150, ry: 28, irx: 122, iry: 17 }
const ring = (rx: number, ry: number, irx: number, iry: number, cy = DITCH.cy, dy = 0) =>
  `M${-rx} ${cy} A${rx} ${ry} 0 1 0 ${rx} ${cy} A${rx} ${ry} 0 1 0 ${-rx} ${cy} Z M${-irx} ${cy + dy} A${irx} ${iry} 0 1 1 ${irx} ${cy + dy} A${irx} ${iry} 0 1 1 ${-irx} ${cy + dy} Z`

/**
 * What hides the far side of the ditch: the altar standing in front of it (the bottom row of stones, and the stones
 * above). Drawn as a mask, so the ditch can be drawn after the stones and still go behind them. (In the mini-game's
 * tray, and while it's carried, there's no altar in front, so elijah.css lifts the mask there: "el-behind".)
 */
function BehindAltar({ id, children, open }: { id: string; children: ReactNode; open?: boolean }) {
  if (open) return <g>{children}</g>
  return (
    <g>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-220} y={-220} width={440} height={300}>
          <rect x={-220} y={-220} width={440} height={300} fill="#fff" />
          <rect x={-104} y={-200} width={208} height={200} fill="#000" />
          {ALTAR_STONES.slice(0, 5).map(([cx, cy, w, h, seed]) => <path key={seed} d={stonePath(cx, cy, w - 2, h - 2, seed)} fill="#000" />)}
        </mask>
      </defs>
      <g className="el-behind" mask={`url(#${id})`}>{children}</g>
    </g>
  )
}

/** The ditch Elijah dug all round the altar (1 Kings 18:32): a ring of dug earth, heaped up round its outside. `open`: no altar in front (it's gone). */
export function Ditch({ open }: { open?: boolean }) {
  const id = gid(useId())
  const { cy, rx, ry, irx, iry } = DITCH
  return (
    <BehindAltar id={`${id}m`} open={open}>
      <defs><clipPath id={`${id}c`}><path d={ring(rx, ry, irx, iry)} clipRule="evenodd" /></clipPath></defs>
      {/* the dug-up earth heaped round the outside */}
      <path d={ring(rx + 9, ry + 6, rx - 2, ry - 2, cy, 0)} fill="#c49a62" fillRule="evenodd" />
      <path d={ring(rx, ry, irx, iry)} fill="#5e4128" fillRule="evenodd" stroke="#4a3220" strokeWidth={2} />
      {/* the inside wall we look down on, below the inner edge */}
      <g clipPath={`url(#${id}c)`}>
        <path d={ring(irx + 6, iry + 9, irx, iry, cy, 0).replace(`M${-(irx + 6)} ${cy}`, `M${-(irx + 6)} ${cy + 5}`)} fill="#8a6440" fillRule="evenodd" />
      </g>
      <ellipse cx={0} cy={cy} rx={irx} ry={iry} fill="none" stroke="#a07a4c" strokeWidth={2.4} />
      {/* clods along the rim */}
      {[[-140, 10], [-96, 20], [-30, 25], [44, 24], [104, 18], [142, 4], [-150, -10], [150, -14]].map(([dx, dy], i) => (
        <ellipse key={i} cx={dx} cy={dy + 3} rx={5} ry={3} fill="#a87e4c" stroke="#7a5a32" strokeWidth={1.2} />
      ))}
    </BehindAltar>
  )
}

/** The water filling the ditch all the way round (1 Kings 18:35). */
export function DitchWater({ open }: { open?: boolean }) {
  const id = gid(useId())
  const { cy, rx, ry, irx, iry } = DITCH
  return (
    <BehindAltar id={`${id}m`} open={open}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0f5" /><stop offset="1" stopColor="#4ea3df" /></linearGradient>
      </defs>
      <path d={ring(rx - 2, ry - 2, irx + 1, iry + 1)} fill={`url(#${id}g)`} fillRule="evenodd" stroke="#3f8fcf" strokeWidth={1.6} />
      {/* shine and ripples */}
      <path d={`M${-rx + 14} ${cy + 6} Q${-rx / 2} ${cy + ry - 2} 0 ${cy + ry - 3} Q${rx / 2} ${cy + ry - 2} ${rx - 14} ${cy + 6}`} stroke="#d9f1ff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeDasharray="14 10" opacity={0.85} />
      {[[-120, 8], [-60, 18], [10, 20], [76, 17], [128, 6]].map(([dx, dy], i) => (
        <path key={i} d={`M${dx - 7} ${cy + dy} q3.5 -3 7 0 q3.5 3 7 0`} stroke="#ffffff" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.8} />
      ))}
    </BehindAltar>
  )
}

/** Water running down the front of the stones from the wood, and drops on them: the altar is soaked. */
export function Rivulets() {
  const runs: Pt[][] = [
    [[-34, -88], [-30, -76], [-36, -64], [-31, -50], [-37, -36], [-32, -22], [-36, -6]],
    [[-6, -88], [-10, -74], [-4, -60], [-9, -44], [-3, -30], [-8, -14], [-4, -1]],
    [[24, -88], [28, -74], [22, -62], [27, -48], [21, -34], [26, -18], [21, -2]],
    [[50, -64], [54, -50], [48, -38], [53, -24], [48, -8]],
    [[-58, -62], [-62, -48], [-56, -36], [-61, -22], [-57, -6]],
  ]
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      {runs.map((r, i) => {
        const d = `M${r.map((p) => p.join(' ')).join(' L')}`
        return (
          <g key={i}>
            <path d={d} stroke="#6fbbef" strokeWidth={4} opacity={0.75} />
            <path d={d} stroke="#e3f5ff" strokeWidth={1.4} opacity={0.9} />
          </g>
        )
      })}
      {[[-74, -40], [72, -30], [-14, -40], [40, -76], [-46, -78], [86, -12]].map(([x, y], i) => (
        <path key={`d${i}`} d={`M${x} ${y - 4} Q${x - 3} ${y + 1} ${x} ${y + 3} Q${x + 3} ${y + 1} ${x} ${y - 4} Z`} fill="#8fd0f5" stroke="#3f8fcf" strokeWidth={0.8} />
      ))}
    </g>
  )
}

/** A clay water jar, upright, its middle at (0, 0) (mouth at the top, at y -24); about 44 wide and 46 tall. */
function WaterJar({ water = true }: { water?: boolean }) {
  const clay = useShade('#d98a5a', 0.3, 0.22)
  return (
    <g>
      <defs>{clay.def}</defs>
      <path d="M-9 -24 L9 -24 L8 -18 Q22 -12 20 4 Q18 20 0 22 Q-18 20 -20 4 Q-22 -12 -8 -18 Z" fill={clay.fill} stroke="#8a4a2a" strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-18 -2 Q0 5 18 -2" stroke="#f2c08a" strokeWidth={3} fill="none" />
      {[-1, 1].map((d) => <path key={d} d={`M${d * 8} -18 Q${d * 17} -20 ${d * 15} -10`} stroke="#8a4a2a" strokeWidth={3.2} fill="none" strokeLinecap="round" />)}
      <ellipse cx={0} cy={-24} rx={10} ry={3.2} fill={water ? '#4ea3df' : '#6a3a1a'} stroke="#8a4a2a" strokeWidth={1.6} />
      <ellipse cx={-9} cy={-6} rx={3} ry={6.5} fill="#fff" opacity={0.3} />
    </g>
  )
}

/** A water jar lying tipped over at (x, y) (its middle), `a` degrees round (100: its mouth to the right and a little down). */
export const LyingJar = ({ x, y, a }: { x: number; y: number; a: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}><WaterJar /></g>
)

/** Where a jar's mouth is when it lies at (x, y) turned `a` degrees. */
const mouthOf = (x: number, y: number, a: number): Pt => {
  const r = (a * Math.PI) / 180
  return [x + 24 * Math.sin(r), y - 24 * Math.cos(r)]
}

/** A stream of water pouring from (x1, y1), arcing through (cx, cy), down to (x2, y2), with a splash where it lands. */
export function Pour({ from, via, to, w = 7, splash = true }: { from: Pt; via: Pt; to: Pt; w?: number; splash?: boolean }) {
  const d = `M${f(from[0])} ${f(from[1])} Q${f(via[0])} ${f(via[1])} ${f(to[0])} ${f(to[1])}`
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="#4ea3df" strokeWidth={w + 2} opacity={0.5} />
      <path d={d} stroke="#8fd0f5" strokeWidth={w} />
      <g className="el-pour"><path d={d} stroke="#ffffff" strokeWidth={w * 0.32} strokeDasharray="8 16" opacity={0.95} /></g>
      {splash && (
        <g stroke="#d9f1ff" strokeWidth={2.2}>
          <path d={`M${to[0] - 12} ${to[1] - 2} q4 -8 8 -3 M${to[0] + 12} ${to[1] - 2} q-4 -8 -8 -3 M${to[0]} ${to[1] - 4} l0 -7`} />
        </g>
      )}
    </g>
  )
}

/**
 * The jars of water (the game's), lying tipped over on top of the wood, all poured out: a last few drops on the logs
 * below their mouths. (The water has run down the stones, Rivulets, into the ditch.)
 */
export const JARS: { x: number; y: number; a: number }[] = [{ x: -27, y: -154, a: -100 }, { x: 27, y: -154, a: 100 }]
export function JarsOnWood() {
  return (
    <g>
      {JARS.map((j) => <LyingJar key={j.x} {...j} />)}
      {JARS.map(({ x, y, a }) => {
        const [mx, my] = mouthOf(x, y, a)
        const side = Math.sign(x)
        return [[side * 3, 9], [side * 7, 19]].map(([dx, dy], i) => (
          <path key={`${x}${i}`} d={`M${f(mx + dx)} ${f(my + dy - 4)} Q${f(mx + dx - 3)} ${f(my + dy + 1)} ${f(mx + dx)} ${f(my + dy + 3)} Q${f(mx + dx + 3)} ${f(my + dy + 1)} ${f(mx + dx)} ${f(my + dy - 4)} Z`}
            fill="#8fd0f5" stroke="#3f8fcf" strokeWidth={0.8} />
        ))
      })}
    </g>
  )
}

/** Flames licking up along the tops of the altar's rows of stones (God's fire burnt up even the stones). In altar units. */
export function StoneFlames() {
  const spots: [number, number, number][] = [
    [-52, -86, 30], [-22, -88, 36], [12, -88, 34], [44, -86, 30],
    [-80, -60, 26], [-66, -61, 22], [68, -61, 22], [82, -60, 26],
    [-104, -33, 22], [-92, -34, 26], [92, -34, 26], [104, -33, 20],
  ]
  return (
    <g>
      {spots.map(([x, y, h], i) => (
        <g key={i} transform={`translate(${x} ${y + 4})`}>
          <g className="el-flame" style={{ animationDelay: `${-i * 0.17}s` }}>
            <path d={flame(h * 0.32, h)} fill="#ff9a3c" stroke="#ef7a2a" strokeWidth={1.6} strokeLinejoin="round" />
            <path d={flame(h * 0.2, h * 0.78)} fill="#ffcf4a" />
            <path d={flame(h * 0.1, h * 0.5)} fill="#fff6c8" />
          </g>
        </g>
      ))}
    </g>
  )
}

// ---------- God's fire from heaven (1 Kings 18:38) ----------

/** Tongues of fire falling down the beam: [x offset, delay, size]. */
const FALLING: [number, number, number][] = [[-30, 0, 0.9], [22, 0.45, 1.1], [-6, 0.9, 1], [40, 0.25, 0.8], [-44, 0.7, 0.75], [4, 1.15, 0.85]]

/** A big blaze of flames standing up at (0, 0), about `w` wide: warm and bright, with no smoke. */
function Blaze({ w = 150, h = 150 }: { w?: number; h?: number }) {
  const tongues: [number, number, number, number][] = [[-0.38, 0.62, 0.62, -14], [0.4, 0.66, 0.6, 14], [-0.18, 0.86, 0.8, -5], [0.2, 0.82, 0.78, 6], [0, 1, 1, 0], [-0.46, 0.4, 0.42, -22], [0.48, 0.42, 0.44, 22]]
  return (
    <g>
      {tongues.map(([dx, k, kw, rot], i) => (
        <g key={i} transform={`translate(${f(dx * w)} 0) rotate(${rot})`}>
          <g className="el-flame" style={{ animationDelay: `${-i * 0.23}s` }}>
            <path d={flame(w * 0.22 * kw, h * k)} fill="#ff9a3c" stroke="#ef7a2a" strokeWidth={2} strokeLinejoin="round" />
            <path d={flame(w * 0.15 * kw, h * k * 0.8)} fill="#ffcf4a" />
            <path d={flame(w * 0.08 * kw, h * k * 0.55)} fill="#fff6c8" />
          </g>
        </g>
      ))}
    </g>
  )
}

/**
 * God's fire falling from heaven onto the altar: the sky opens in warm, holy light (Glow and Rays: God is never
 * drawn), a broad beam of golden light comes down, tongues of fire fall down it, and a great bright blaze stands
 * on the altar. Warm and bright, never scary, and no smoke. (x, y) = where it lands (the top of the altar); `top`:
 * where the light opens in the sky; `k`: its size.
 */
export function HeavenFire({ x, y, top = 0, k = 1, blaze = true }: { x: number; y: number; top?: number; k?: number; blaze?: boolean }) {
  const id = gid(useId())
  const fall = y - top - 40
  return (
    <g>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf2" stopOpacity={0.96} />
          <stop offset="0.55" stopColor="#fff0b0" stopOpacity={0.8} />
          <stop offset="1" stopColor="#ffd06a" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <Rays x={x} y={top + 20} r={520} n={20} color="#fff3c4" opacity={0.42} />
      <Glow x={x} y={top + 10} r={240 * k} color="#fff6d2" />
      {/* the beam: a wide soft one, and a bright one inside it */}
      <path d={`M${x - 80 * k} ${top} L${x + 80 * k} ${top} L${x + 128 * k} ${y + 6} L${x - 128 * k} ${y + 6} Z`} fill="#ffeaa0" opacity={0.32} />
      <path d={`M${x - 48 * k} ${top} L${x + 48 * k} ${top} L${x + 86 * k} ${y} L${x - 86 * k} ${y} Z`} fill={`url(#${id}b)`} />
      {/* tongues of fire falling */}
      {FALLING.map(([dx, d, s], i) => (
        <g key={i} transform={`translate(${f(x + dx * k)} ${f(y - 30 * k)})`}>
          <g className="el-fall" style={css({ '--fall': `${f(fall)}px`, animationDelay: `${-d}s` })}>
            <path d={flame(13 * s * k, 60 * s * k)} fill="#ffb347" stroke="#f08a2a" strokeWidth={1.8} />
            <path d={flame(8 * s * k, 44 * s * k)} fill="#ffe680" />
          </g>
        </g>
      ))}
      {blaze && <g transform={`translate(${x} ${y + 4}) scale(${k})`}><Blaze w={160} h={150} /></g>}
      <Sparkles spots={[[x - 120 * k, y - 60 * k, 10], [x + 126 * k, y - 90 * k, 12], [x - 90 * k, y - 170 * k, 9], [x + 96 * k, y - 200 * k, 8], [x + 150 * k, y - 20 * k, 7], [x - 150 * k, y - 10 * k, 8]]} color="#fff8d0" />
    </g>
  )
}

/** A soft white wisp rising (steam off the water, or from the embers). (x, y) its foot. */
export const Steam = ({ x, y, s = 1, d = 0 }: { x: number; y: number; s?: number; d?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g className="el-steam" style={{ animationDelay: `${-d}s` }}>
      <path d="M0 0 C-7 -8 6 -14 0 -22 C-6 -30 5 -36 0 -44" stroke="#ffffff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
    </g>
  </g>
)

/**
 * Where the altar stood, after God's fire: the stones, the wood and the water all burnt up (1 Kings 18:38). A dark,
 * warm patch of scorched ground with glowing embers and soft wisps, and the ditch, empty and dry. In altar units.
 */
export function Scorch() {
  const id = gid(useId())
  return (
    <g>
      <defs>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#5a3f30" /><stop offset="0.65" stopColor="#7a5a40" /><stop offset="1" stopColor="#8a6a48" stopOpacity={0} />
        </radialGradient>
      </defs>
      <Ditch open />
      <ellipse cx={0} cy={-6} rx={118} ry={17} fill={`url(#${id}g)`} />
      <Glow x={0} y={-10} r={110} color="#ffe2a0" />
      {[[-60, -8, 3.2], [-24, -2, 2.6], [8, -10, 3.4], [40, -4, 2.8], [72, -9, 2.4], [-88, -10, 2.2], [24, 2, 2], [-4, 4, 2.4]].map(([ex, ey, r], i) => (
        <g key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.3}s` }}>
          <circle cx={ex} cy={ey} r={r * 1.9} fill="#ffb347" opacity={0.35} />
          <circle cx={ex} cy={ey} r={r} fill="#ffd25a" />
        </g>
      ))}
      <Steam x={-40} y={-8} s={0.8} />
      <Steam x={30} y={-6} s={0.9} d={1.1} />
      <Steam x={80} y={-10} s={0.7} d={0.5} />
    </g>
  )
}

/** The pile of stones and wood the other people built for their pretend god: a rougher heap, with no fire on it. */
function HeapAltar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const stones: [number, number, number, number, number][] = [[-46, -14, 40, 28, 31], [-8, -15, 42, 30, 32], [32, -13, 38, 26, 33], [-26, -38, 38, 26, 34], [14, -40, 40, 26, 35], [-6, -60, 34, 22, 36]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={-6} cy={0} rx={74} ry={7} fill="#000" opacity={0.1} />
      {stones.map((st) => <AltarStone key={st[4]} stone={st} />)}
      {/* a few sticks of wood on top, and no fire at all */}
      <g strokeLinecap="round">
        {[[-30, -74, 30, -70], [-24, -80, 26, -84], [-14, -86, 22, -76]].map(([x1, y1, x2, y2], i) => (
          <g key={i}>
            <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#4a2f1c" strokeWidth={9} />
            <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#8a5a33" strokeWidth={6} />
          </g>
        ))}
      </g>
    </g>
  )
}

// ---------- People far off ----------

const FOLK_SKINS = ['#d9a47a', '#c68b5e', '#f0c9a8', '#8d5a3b', '#e3b48c']
const FOLK_ROBES = ['#e6b85a', '#7cb06a', '#5f8fc0', '#c98aa8', '#b5794a', '#e07a5f', '#9a8fd0', '#6fb7b0', '#d9b56a', '#f29a9a']
const FOLK_WRAPS = ['#f5f0e6', '#c0504d', '#7cb0e0', '#e8dcc0', '#d9b56a', '#a98cff']
const FOLK_HAIRS = ['#3b2a20', '#4a3020', '#2b1f18', '#5a3a24']

/**
 * Someone far off in a crowd (a small, simple figure; s = 1 is about 66 tall). `i` picks their colors; `caller`: one
 * of the people who prayed to a pretend god (a plum robe and a cream head cloth); `up`: both arms raised (cheering, or
 * calling out); `kneel`: kneeling, with their hands together. (x, y) = their feet (or knees).
 */
export function Folk({ x, y, s = 1, i = 0, caller, up, kneel, child }: { x: number; y: number; s?: number; i?: number; caller?: boolean; up?: boolean; kneel?: boolean; child?: boolean }) {
  const robe = caller ? '#a3477e' : FOLK_ROBES[i % FOLK_ROBES.length]
  const skin = FOLK_SKINS[(i * 7 + 2) % FOLK_SKINS.length]
  const covered = caller || (i * 5) % 3 !== 1
  const hair = FOLK_HAIRS[(i * 3) % FOLK_HAIRS.length]
  const wrap = caller ? '#f3ead8' : FOLK_WRAPS[(i * 11) % FOLK_WRAPS.length]
  const k = s * (child ? 0.72 : 1)
  const drop = kneel ? 16 : 0 // (kneeling: everything comes down)
  const hy = -54 + drop
  const cap = `M-12 ${hy} Q-13 ${hy - 15} 0 ${hy - 15} Q13 ${hy - 15} 12 ${hy} Q6 ${hy - 8} 0 ${hy - 7} Q-6 ${hy - 8} -12 ${hy} Z`
  const arm = (ax: number, ay: number, bx: number, by: number, key: string) => (
    <g key={key}>
      <path d={`M${ax} ${ay + drop} L${bx} ${by + drop}`} stroke={ink(robe)} strokeWidth={6.5} strokeLinecap="round" />
      <path d={`M${ax} ${ay + drop} L${bx} ${by + drop}`} stroke={robe} strokeWidth={4.5} strokeLinecap="round" />
      <circle cx={bx} cy={by + drop} r={3.4} fill={skin} stroke={ink(skin)} strokeWidth={1.5} />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {covered && <path d={`M-13 ${hy - 3} Q-16 ${hy + 15} -11 ${hy + 13} L11 ${hy + 13} Q16 ${hy + 15} 13 ${hy - 3} Z`} fill={wrap} stroke={ink(wrap)} strokeWidth={2} />}
      {kneel ? (
        <path d="M-12 -26 Q0 -30 12 -26 L19 -4 Q22 1 14 1 L-14 1 Q-22 1 -19 -4 Z" fill={robe} stroke={ink(robe)} strokeWidth={2.5} strokeLinejoin="round" />
      ) : (
        <g>
          <ellipse cx={-7} cy={-2} rx={6} ry={3} fill="#7a5233" />
          <ellipse cx={7} cy={-2} rx={6} ry={3} fill="#7a5233" />
          <path d="M-12 -42 Q0 -46 12 -42 L17 -4 Q0 0 -17 -4 Z" fill={robe} stroke={ink(robe)} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      )}
      {kneel && !up ? (
        <g>
          {arm(-10.5, -39, -3, -24, 'l')}
          {arm(10.5, -39, 3, -24, 'r')}
        </g>
      ) : (
        <g>
          {up ? arm(-10.5, -39, -19, -64, 'l') : arm(-10.5, -39, -17.5, -19, 'l')}
          {up ? arm(10.5, -39, 19, -64, 'r') : arm(10.5, -39, 17.5, -19, 'r')}
        </g>
      )}
      <circle cx={0} cy={hy} r={11} fill={skin} stroke={ink(skin)} strokeWidth={2} />
      <circle cx={-4} cy={hy} r={1.9} fill="#2b2140" />
      <circle cx={4} cy={hy} r={1.9} fill="#2b2140" />
      <ellipse cx={-7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <ellipse cx={7} cy={hy + 4} rx={2.6} ry={1.6} fill="#ff7fb0" opacity={0.55} />
      <path d={`M-3 ${hy + 5} Q0 ${hy + 8.5} 3 ${hy + 5}`} stroke="#6b2a3a" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d={cap} fill={covered ? wrap : hair} stroke={ink(covered ? wrap : hair)} strokeWidth={2} />
    </g>
  )
}

/** A crowd: rows of Folk, back to front. Each row: [y, s, xs]; `seed` varies the colors. */
export function Crowd({ rows, seed = 0, up, kneel, callers = [] }: { rows: [number, number, number[]][]; seed?: number; up?: number[]; kneel?: boolean; callers?: number[] }) {
  let n = 0
  return (
    <g>
      {rows.map(([y, s, xs]) => xs.map((x, j) => {
        const i = seed + n++
        return <Folk key={`${y}-${j}`} x={x} y={y + (j % 2) * 3 * s} s={s} i={i} up={up?.includes(i - seed)} kneel={kneel} caller={callers.includes(i - seed)} />
      }))}
    </g>
  )
}

// ---------- Mount Carmel ----------

/**
 * Mount Carmel (1 Kings 18:19): a wide, flat mountaintop high above the sea (far off on the left), with hills on the
 * right. After the long dry time its grass is dry and golden; `wet`: the rain has come, and it's green again.
 * `sky`: its colors, top and bottom; `back`: drawn in the sky, behind the land (the sun, clouds, a glow).
 */
export function Carmel({ sky, wet, back, children }: { sky: string[]; wet?: boolean; back?: ReactNode; children?: ReactNode }) {
  const id = gid(useId())
  const near = wet ? '#97cc78' : '#d6b96f'
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wet ? '#8aa8c4' : '#8fcdf0'} /><stop offset="1" stopColor={wet ? '#5a86b0' : '#4f9fd8'} /></linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wet ? '#a9d68a' : '#e4ca86'} /><stop offset="1" stopColor={near} /></linearGradient>
      </defs>
      <SkyFill colors={sky} />
      {back}
      {/* the sea, far below and far off */}
      <rect x={-10} y={236} width={630} height={70} fill={`url(#${id}w)`} />
      {[[60, 252], [170, 262], [300, 250], [420, 266], [110, 280], [250, 286]].map(([x, y]) => <path key={x} d={`M${x} ${y} q8 -4 16 0`} stroke="#e8f6ff" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />)}
      {/* hills along the coast, on the right */}
      <path d="M380 292 Q470 228 560 246 Q640 214 720 238 Q770 226 810 236 L810 320 L380 320 Z" fill={wet ? '#8fbf86' : '#bdbf86'} />
      <path d="M450 300 Q560 262 650 276 Q740 258 810 270 L810 330 L450 330 Z" fill={wet ? '#86b97a' : '#c9b878'} opacity={0.9} />
      {/* the mountaintop */}
      <path d="M-10 296 Q200 280 420 292 Q620 304 810 286 L810 460 L-10 460 Z" fill={`url(#${id}g)`} />
      <path d="M-10 296 Q200 280 420 292 Q620 304 810 286" stroke={wet ? '#7cb862' : '#c9ac64'} strokeWidth={3} fill="none" />
      <Tufts color={wet ? '#5fa84e' : '#b39550'} spots={[[40, 330], [150, 318], [262, 342], [380, 322], [520, 336], [640, 326], [760, 340], [90, 400], [700, 410], [320, 440], [560, 446], [20, 446], [770, 446]]} />
      {children}
    </Scene>
  )
}

/** Hot, dry skies, and Carmel's from midday to evening (top to bottom; a warm middle, so blue and gold never turn grey). */
const SKY: Record<'hot' | 'late' | 'noon' | 'fire' | 'after' | 'evening' | 'rain', string[]> = {
  hot: ['#a9d8f2', '#d9ecf0', '#fff0c4'],
  late: ['#8fbfec', '#f3e2c4', '#ffcf94'],
  noon: ['#9fd2f2', '#dcecee', '#ffecc0'],
  fire: ['#7484c8', '#d0b0d6', '#ffd09c'],
  after: ['#a8d6f2', '#e4eee2', '#fff0cc'],
  evening: ['#98c2ec', '#f6e4c8', '#ffd09e'],
  rain: ['#7a8aa6', '#a3afc2', '#c7d1de'],
}

/** The sky: a top-to-bottom blend of `colors`. */
function SkyFill({ colors }: { colors: string[] }) {
  const id = gid(useId())
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {colors.map((c, i) => <stop key={i} offset={i / Math.max(1, colors.length - 1)} stopColor={c} />)}
        </linearGradient>
      </defs>
      <rect width={800} height={450} fill={`url(#${id})`} />
    </>
  )
}

/** A hot sun with a soft haze round it. */
const HotSun = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g>
    <Glow x={x} y={y} r={110 * s} color="#fff3b8" />
    <Sun x={x} y={y} s={s} />
  </g>
)

// ---------- King Ahab's palace ----------

/** King Ahab's throne: a carved wooden chair with a red cushion and gold trim, on a stone dais. (x, y) = the middle of the dais's top (where the king's feet go). */
function Throne({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wood = useShade('#a0612f', 0.3, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{wood.def}</defs>
      {/* the back, rising above the king's head */}
      <path d="M-40 -32 L-40 -150 Q-40 -170 -20 -172 Q0 -186 20 -172 Q40 -170 40 -150 L40 -32 Z" fill={wood.fill} stroke="#5a3418" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-30 -36 L-30 -146 Q-30 -160 -14 -162 Q0 -172 14 -162 Q30 -160 30 -146 L30 -36 Z" fill="#c0404a" stroke="#7a2430" strokeWidth={2} />
      <circle cx={0} cy={-176} r={6} fill="#f2c94c" stroke="#b08a1a" strokeWidth={1.6} />
      {/* the seat, the arms and the legs */}
      <rect x={-46} y={-36} width={92} height={10} rx={3} fill={wood.fill} stroke="#5a3418" strokeWidth={2.5} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M${d * 44} -26 L${d * 44} 0`} stroke="#5a3418" strokeWidth={8} strokeLinecap="round" />
          <path d={`M${d * 44} -26 L${d * 44} 0`} stroke="#a0612f" strokeWidth={5} strokeLinecap="round" />
          <path d={`M${d * 40} -70 L${d * 54} -70 L${d * 54} -32`} stroke="#5a3418" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${d * 40} -70 L${d * 54} -70 L${d * 54} -32`} stroke="#a0612f" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={d * 54} cy={-71} r={5} fill="#f2c94c" stroke="#b08a1a" strokeWidth={1.4} />
        </g>
      ))}
    </g>
  )
}

/** The king's ivory palace (1 Kings 22:39), with its doorway and banners. (x0, x1): its sides; y: its foot. */
function Palace({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const top = y - 190
  const mid = (x0 + x1) / 2
  const ivory = '#f6ecd6', line = '#cdb48a'
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={190} fill={ivory} stroke={line} strokeWidth={3} />
      {Array.from({ length: 7 }, (_, r) => <path key={r} d={`M${x0 + 3} ${top + 26 * (r + 1)} L${x1 - 3} ${top + 26 * (r + 1)}`} stroke="#ead9b8" strokeWidth={2} />)}
      {/* the top edge, with its little battlements */}
      <rect x={x0 - 8} y={top - 12} width={x1 - x0 + 16} height={14} rx={2} fill="#ecdcbc" stroke={line} strokeWidth={3} />
      {Array.from({ length: Math.floor((x1 - x0) / 34) + 1 }, (_, i) => <rect key={i} x={x0 - 6 + i * 34} y={top - 28} width={18} height={18} rx={2} fill="#ecdcbc" stroke={line} strokeWidth={2.5} />)}
      {/* windows */}
      {[x0 + 50, x1 - 50, mid - 120, mid + 120].filter((wx) => wx > x0 + 30 && wx < x1 - 30).map((wx) => (
        <path key={wx} d={`M${wx - 16} ${top + 96} L${wx - 16} ${top + 62} Q${wx} ${top + 42} ${wx + 16} ${top + 62} L${wx + 16} ${top + 96} Z`} fill="#5a6f9a" stroke={line} strokeWidth={3} />
      ))}
      {/* the doorway, with columns on each side and red banners */}
      <path d={`M${mid - 50} ${y} L${mid - 50} ${top + 90} Q${mid} ${top + 50} ${mid + 50} ${top + 90} L${mid + 50} ${y} Z`} fill="#6b4a32" stroke={line} strokeWidth={3} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={mid + d * 70 - 9} y={top + 40} width={18} height={150} fill="#fffaf0" stroke={line} strokeWidth={2.5} />
          <rect x={mid + d * 70 - 13} y={top + 34} width={26} height={9} rx={2} fill="#ecdcbc" stroke={line} strokeWidth={2} />
          <path d={`M${mid + d * 112 - 12} ${top + 14} L${mid + d * 112 + 12} ${top + 14} L${mid + d * 112 + 12} ${top + 70} L${mid + d * 112} ${top + 60} L${mid + d * 112 - 12} ${top + 70} Z`} fill="#c0404a" stroke="#7a2430" strokeWidth={2} strokeLinejoin="round" />
          <circle cx={mid + d * 112} cy={top + 34} r={5} fill="#f2c94c" />
        </g>
      ))}
    </g>
  )
}

// ---------- The pages ----------

// 1. "Long ago, a man named Elijah loved God. But King Ahab and many of God's people forgot about God. So Elijah told
// the king, 'There will be no rain, not one drop, until God says so!'"
// Outside King Ahab's ivory palace, on a green day with a few white clouds: the king sits on his throne under a red
// canopy, surprised; Elijah stands before him, one hand raised to heaven.
function Page1() {
  const ax = 610, ay = 384
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Tap say="Bye-bye, rain clouds!" sfx="whoosh">
        <Cloud x={130} y={78} s={0.8} />
        <Cloud x={380} y={56} s={0.6} slow />
      </Tap>
      <path d="M-10 300 Q150 258 300 282 Q420 300 520 290 L520 340 L-10 340 Z" fill="#a8d8a0" />
      <Palace x0={440} x1={790} y={340} />
      <path d="M-10 336 Q200 318 420 336 Q620 350 810 334 L810 460 L-10 460 Z" fill="#8fd18a" />
      <path d="M-10 392 Q220 372 430 392 T810 386 L810 460 L-10 460 Z" fill="#7cc46a" />
      <Palm x={70} y={352} s={0.9} />
      {[[40, 420, '#ff8cc0'], [168, 446, '#ffd34d'], [460, 446, '#ffffff'], [760, 430, '#ff8cc0'], [250, 404, '#ffffff']].map(([x, y, c]) => <Flower key={x as number} x={x as number} y={y as number} color={c as string} />)}
      {/* the king's dais and canopy */}
      <path d={`M${ax - 96} ${ay + 26} L${ax + 96} ${ay + 26} L${ax + 86} ${ay + 12} L${ax - 86} ${ay + 12} Z`} fill="#e3d4b4" stroke="#b89a6a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M${ax - 80} ${ay + 12} L${ax + 80} ${ay + 12} L${ax + 72} ${ay} L${ax - 72} ${ay} Z`} fill="#efe2c4" stroke="#b89a6a" strokeWidth={2.5} strokeLinejoin="round" />
      {[-1, 1].map((d) => <path key={d} d={`M${ax + d * 84} ${ay + 8} L${ax + d * 84} ${ay - 214}`} stroke="#7a4a24" strokeWidth={6} strokeLinecap="round" />)}
      <path d={`M${ax - 100} ${ay - 206} Q${ax} ${ay - 236} ${ax + 100} ${ay - 206} L${ax + 100} ${ay - 186} Q${ax} ${ay - 214} ${ax - 100} ${ay - 186} Z`} fill="#c0404a" stroke="#7a2430" strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M${ax - 100} ${ay - 186} ${Array.from({ length: 8 }, (_, i) => `Q${ax - 100 + 25 * i + 12.5} ${ay - 176 - (i % 2 ? 0 : 2) - Math.sin(((i + 0.5) / 8) * Math.PI) * 20} ${ax - 100 + 25 * (i + 1)} ${ay - 186 - Math.sin(((i + 1) / 8) * Math.PI) * 26}`).join(' ')}`}
        stroke="#f2c94c" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Throne x={ax} y={ay} s={1} />
      <Tap say="What? No rain? Not one drop?" sfx="wobble">
        <SittingOnRock x={ax} y={ay} s={1} look={KING_AHAB} blinkDelay={0.6}><Surprised /></SittingOnRock>
      </Tap>
      <Tap say="There will be no rain, until God says so!" sfx="ding">
        <Elijah x={330} y={432} s={1.06} pose="wave" blinkDelay={1.2} />
      </Tap>
      <Tap say="Tweet! We love the rain." sfx="pop">
        <ellipse cx={256} cy={160} rx={46} ry={30} fill="transparent" />
        <path d="M228 168 q6 -6 12 0 q6 -6 12 0 M262 150 q5 -5 10 0 q5 -5 10 0" stroke="#5a6478" strokeWidth={2.4} fill="none" strokeLinecap="round" className="sc-float" />
      </Tap>
    </Scene>
  )
}

/**
 * The little valley where the brook ran (1 Kings 17:3): rocky sides coming down on the left and the right, far hills
 * between them, and the valley floor in front with the brook winding down it toward us (`dry`: it has dried up).
 * `back`: drawn in the sky (the sun, light from heaven); `far`: drawn on the far hills; `brook`: what the brook says
 * when it's tapped.
 */
function Valley({ dry, sky, back, far, brook, children }: {
  dry?: boolean; sky: string[]; back?: ReactNode; far?: ReactNode; brook?: string; children?: ReactNode
}) {
  const rock = dry ? '#d2b386' : '#c7aa82'
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <SkyFill colors={sky} />
      {back}
      {/* far hills, seen between the valley's sides */}
      <path d="M-10 262 Q140 240 300 252 Q420 238 520 254 Q660 236 810 250 L810 330 L-10 330 Z" fill={dry ? '#dcc590' : '#c9c892'} />
      {far}
      {/* the valley's two rocky sides */}
      <path d="M-10 150 Q80 160 160 200 Q250 246 330 280 Q362 292 392 300 L392 340 L-10 340 Z" fill={dry ? '#dabd86' : '#cfb07c'} />
      <path d="M810 160 Q730 170 650 206 Q560 250 490 284 Q462 296 440 302 L440 340 L810 340 Z" fill={dry ? '#cfae78' : '#c5a573'} />
      <Crag x={70} y={240} w={130} h={70} color={rock} seed={5} />
      <Crag x={232} y={282} w={100} h={50} color={rock} seed={7} flip />
      <Crag x={738} y={244} w={140} h={74} color={rock} seed={9} flip />
      <Crag x={588} y={284} w={96} h={48} color={rock} seed={11} />
      {/* the valley floor, and the brook down the middle of it */}
      <path d="M-10 322 Q200 300 410 302 Q610 300 810 320 L810 460 L-10 460 Z" fill={dry ? '#e3c992' : '#d8bf8a'} />
      {brook ? <Tap say={brook} sfx={dry ? 'wobble' : 'pop'}><Brook dry={dry} x0={416} y0={302} /></Tap> : <Brook dry={dry} x0={416} y0={302} />}
      {children}
    </Scene>
  )
}

// 2. "And no rain fell, for a long, dry time. The grass turned brown, and the ground cracked. But God took care of
// Elijah. He said, 'Go and stay by the little brook. You can drink its water.'"
// A wide, dry land under a hot sun: brown grass, cracked ground, wilted plants. On the right, out of a little rocky
// valley, the brook still runs, with green reeds beside it, in a soft light from heaven; Elijah walks toward it.
function Page2() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <SkyFill colors={SKY.hot} />
      <Tap say="Phew! It is so hot and dry." sfx="whoosh"><HotSun x={100} y={84} s={0.9} /></Tap>
      {/* God's light, shining on the brook */}
      <Rays x={680} y={-30} r={500} n={14} color="#fff6c8" opacity={0.42} />
      {/* far hills, all dry, and the rocky hill the brook comes out of */}
      <path d="M-10 262 Q140 232 300 254 Q440 236 560 256 Q680 236 810 250 L810 330 L-10 330 Z" fill="#d9c08a" />
      <path d="M540 304 Q600 230 690 226 Q770 226 810 244 L810 340 L540 340 Z" fill="#ccae7a" />
      <Crag x={614} y={304} w={118} h={70} color="#c7aa82" seed={3} />
      <Crag x={772} y={302} w={100} h={78} color="#c7aa82" seed={4} flip />
      {/* the dry land */}
      <path d="M-10 300 Q200 284 400 296 Q560 306 810 302 L810 460 L-10 460 Z" fill="#dcbf86" />
      <Glow x={694} y={372} r={140} color="#fff8d6" />
      <Tap say="Gurgle, gurgle! Fresh water for Elijah." sfx="pop"><Brook x0={694} y0={304} /></Tap>
      <Reeds x={588} y={428} s={1.15} />
      <Reeds x={604} y={372} s={0.85} flip />
      <Reeds x={790} y={430} s={1.1} flip />
      <Flower x={570} y={444} s={0.9} color="#ffd34d" />
      {/* everywhere else, dry and cracked */}
      <Cracks x0={20} x1={520} y0={350} y1={445} n={22} seed={3} />
      <Heat spots={[[200, 328], [330, 314], [70, 340], [470, 330]]} />
      <DryBush x={56} y={364} s={1.1} />
      <DryBush x={500} y={330} s={0.7} flip />
      <Tap say="I am so thirsty!" sfx="wobble">
        <Wilted x={150} y={410} s={1.3} />
        <Wilted x={236} y={442} s={1.1} flip />
      </Tap>
      <Wilted x={470} y={436} s={1.2} />
      <Tufts color="#b08f4c" spots={[[110, 380], [384, 370], [520, 404], [30, 432], [300, 418], [430, 344], [250, 352]]} />
      <Tap say="God will take care of me." sfx="ding">
        <Elijah x={404} y={428} s={1} holding="stick" blinkDelay={0.4} />
      </Tap>
    </Scene>
  )
}

// 3. "Every morning and every evening, God sent ravens to Elijah. Flap, flap! The big black birds brought him bread and
// meat to eat. And Elijah drank water from the brook."
// Early morning in the little valley, the sun just up: Elijah sits on a rock by the brook, his hand out for the bread a
// raven is bringing him; another raven flies in with meat, and a third waits on a rock with more bread.
function Page3() {
  return (
    <Valley sky={['#ffc6cc', '#ffeab4']}
      back={<><Sun x={416} y={258} s={0.62} /><Cloud x={620} y={72} s={0.55} slow /><Cloud x={150} y={60} s={0.45} /></>}>
      <Reeds x={300} y={408} s={1.1} />
      <Reeds x={548} y={436} s={1.2} flip />
      <Reeds x={490} y={344} s={0.8} flip />
      <Reeds x={352} y={330} s={0.7} />
      <Rock x={180} y={442} s={1} />
      <Tap say="Thank You, God, for my bread and meat!" sfx="ding">
        <SittingOnRock x={180} y={444} s={1} look={ELIJAH} pose="point" blinkDelay={0.8} />
      </Tap>
      <Tap say="Caw, caw! Here is your bread, Elijah!" sfx="pop">
        <Raven x={290} y={354} s={0.95} facing="left" food="bread" />
      </Tap>
      <Tap say="Caw! And here is some meat!" sfx="pop">
        <Raven x={470} y={200} s={0.9} facing="left" food="meat" />
      </Tap>
      <Crag x={660} y={428} w={120} h={58} color="#c7aa82" seed={17} />
      <Tap say="Caw! I have more bread for tonight!" sfx="pop">
        <PerchedRaven x={652} y={374} s={1.05} facing="left" food="bread" />
      </Tap>
    </Valley>
  )
}

// 4. "After a while, the little brook dried up. Then God said, 'Go to a town far away. A widow there will give you
// food.'"
// The same little valley under a hot sun: the brook is gone, its bed pale, cracked and pebbly, the reeds brown. Elijah
// stands in the dry bed looking up at God's light; a raven waits on a dry bush, and far away on the hills is the town
// God is sending him to.
function Page4() {
  return (
    <Valley dry sky={SKY.hot} brook="Oh no! All the water is gone." 
      back={<><Rays x={416} y={-40} r={520} n={16} color="#fff6c8" opacity={0.45} /><HotSun x={110} y={80} s={0.75} /></>}
      far={(
        <Tap say="There is a town, far, far away." sfx="pop">
          {[[386, 250, 20, 14], [406, 246, 16, 18], [426, 250, 18, 13], [446, 252, 14, 11]].map(([hx, hy, w, h]) => (
            <g key={hx}>
              <rect x={hx - w / 2} y={hy - h} width={w} height={h} fill="#f3e4c4" stroke="#c4a87a" strokeWidth={1.4} />
              <rect x={hx - 2.5} y={hy - 6} width={5} height={6} fill="#7a5a3a" />
            </g>
          ))}
        </Tap>
      )}>
      <Reeds x={300} y={408} s={1.1} dry />
      <Reeds x={548} y={436} s={1.2} dry flip />
      <Reeds x={490} y={344} s={0.8} dry flip />
      <Wilted x={226} y={392} s={1.1} />
      <Wilted x={640} y={384} s={1} flip />
      <Tap say="Caw! Goodbye, Elijah! God will take care of you." sfx="pop">
        <DeadTree x={110} y={420} s={1.3} />
        <PerchedRaven x={141} y={335} s={0.9} />
      </Tap>
      <Tap say="Where should I go now, God?" sfx="ding">
        <LookingUp>
          <Person x={580} y={432} s={1.04} look={ELIJAH} pose="wave" blinkDelay={0.4}><EyesUp /></Person>
        </LookingUp>
      </Tap>
    </Valley>
  )
}

/** The town gate of Zarephath: a stone wall with an arch, flat-roofed houses peeking over it. (x, y): the arch's foot. */
function TownGate({ x, y }: { x: number; y: number }) {
  const stone = '#efe1c2', line = '#b89a6a'
  return (
    <g>
      {([[x - 230, 96, 50], [x - 130, 80, 64], [x + 110, 100, 56], [x + 200, 76, 70]] as const).map(([hx, w, hh]) => (
        <g key={hx}>
          <rect x={hx - w / 2} y={y - 150 - hh} width={w} height={hh + 10} fill="#f3e7cc" stroke={line} strokeWidth={2.5} />
          <rect x={hx - w / 2 - 5} y={y - 156 - hh} width={w + 10} height={10} rx={2} fill="#e3d0a8" stroke={line} strokeWidth={2.5} />
          <rect x={hx - 9} y={y - 140 - hh * 0.6} width={18} height={16} rx={3} fill="#6b4a32" />
        </g>
      ))}
      <rect x={x - 420} y={y - 150} width={840} height={150} fill={stone} stroke={line} strokeWidth={3} />
      <path d={Array.from({ length: 5 }, (_, r) => `M${x - 420} ${y - 150 + 25 * (r + 1)} L${x + 420} ${y - 150 + 25 * (r + 1)}`).join(' ')} stroke="#dccaa2" strokeWidth={2} />
      <path d={Array.from({ length: 6 }, (_, r) => Array.from({ length: 20 }, (_, i) => `M${x - 420 + (r % 2) * 22 + i * 44} ${y - 150 + 25 * r} l0 25`).join(' ')).join(' ')} stroke="#dccaa2" strokeWidth={2} />
      {[-1, 1].map((d) => <rect key={d} x={x + d * 84 - 32} y={y - 190} width={64} height={190} fill="#ead9b4" stroke={line} strokeWidth={3} />)}
      {[-1, 1].map((d) => <rect key={`t${d}`} x={x + d * 84 - 38} y={y - 200} width={76} height={14} rx={3} fill="#e0caa0" stroke={line} strokeWidth={3} />)}
      <path d={`M${x - 64} ${y} L${x - 64} ${y - 104} Q${x} ${y - 176} ${x + 64} ${y - 104} L${x + 64} ${y} Z`} fill="#ead9b4" stroke={line} strokeWidth={3} />
      <path d={`M${x - 50} ${y} L${x - 50} ${y - 98} Q${x} ${y - 156} ${x + 50} ${y - 98} L${x + 50} ${y} Z`} fill="#6b4a32" stroke={line} strokeWidth={3} />
      <path d={`M${x - 50} ${y - 6} L${x + 50} ${y - 6}`} stroke="#5a3a24" strokeWidth={2} />
    </g>
  )
}

// 5. "At the town gate, the widow and her little boy were picking up sticks. 'Please, may I have a little bread?'
// Elijah asked. She said, 'I only have enough flour and oil for one last loaf.'"
// Outside the town gate on a hot, dry day: the widow holds a bundle of sticks, a little sad and worried, her little
// boy beside her with sticks too; Elijah, tired from his long walk, asks her kindly for some bread.
function Page5() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <SkyFill colors={SKY.hot} />
      <HotSun x={90} y={74} s={0.7} />
      <TownGate x={580} y={330} />
      <path d="M-10 312 Q120 300 250 318 L360 330 L810 330 L810 460 L-10 460 Z" fill="#e2c88e" />
      <path d="M-10 312 Q120 300 250 318 L360 330" stroke="#cbb07a" strokeWidth={3} fill="none" />
      <path d="M-10 396 Q240 376 480 394 T810 388 L810 460 L-10 460 Z" fill="#d9bb7e" />
      <Palm x={60} y={330} s={0.85} />
      <Cracks x0={30} x1={250} y0={356} y1={440} n={10} seed={8} />
      <Wilted x={170} y={372} s={1} />
      <Tufts color="#b39550" spots={[[120, 360], [200, 440], [700, 440], [760, 380], [440, 444]]} />
      <GroundSticks sticks={[[420, 444, 8, 40], [690, 420, -12, 34], [740, 446, 20, 30]]} />
      <Tap say="Please, may I have a little bread?" sfx="ding">
        <Elijah x={300} y={430} s={1.02} pose="open" holding="stick" heldHand={0} blinkDelay={0.9} />
      </Tap>
      <Tap say="I only have a little flour and a little oil." sfx="pop">
        <Widow x={500} y={432} s={1.02} pose="hold" mood="sad" facing="left" blinkDelay={0.3} item={<StickBundle w={74} n={5} />} />
      </Tap>
      <Tap say="I am helping my mom pick up sticks!" sfx="pop">
        <Figure x={600} y={436} s={1} look={WIDOWS_BOY} pose="hold" facing="left" blinkDelay={1.5} item={<StickBundle w={60} n={3} />} />
      </Tap>
    </Scene>
  )
}

/** The widow's little house, inside: a plastered room with a small window, a mat on the floor and the clay oven. */
function WidowsHouse({ children }: { children?: ReactNode }) {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <rect width={800} height={450} fill="#ecd7b0" />
      {[[90, 60, 130], [520, 40, 90], [690, 120, 60]].map(([x, y, w], i) => <path key={i} d={`M${x} ${y} l${w * 0.3} 6 l${w * 0.3} -4 l${w * 0.4} 5`} stroke="#d6bc8e" strokeWidth={2} fill="none" />)}
      {/* the window, with the sky outside and a beam of sunlight */}
      <rect x={120} y={92} width={110} height={90} rx={6} fill="#bfe6ff" stroke="#9a7048" strokeWidth={6} />
      <path d="M175 92 L175 182" stroke="#9a7048" strokeWidth={5} />
      <path d="M120 182 L80 450 L330 450 L230 182 Z" fill="#fff6d8" opacity={0.35} />
      {/* the floor */}
      <rect x={0} y={330} width={800} height={120} fill="#d9b98a" />
      <path d="M0 330 L800 330" stroke="#b9955e" strokeWidth={3} />
      <path d="M140 420 Q300 412 470 420 L500 446 L110 446 Z" fill="#c0504d" opacity={0.85} />
      <path d="M150 432 L480 432" stroke="#f0d38a" strokeWidth={3} strokeDasharray="10 7" />
      {/* a shelf with three fresh loaves on it: always enough */}
      <rect x={560} y={150} width={150} height={10} rx={2} fill="#a0703f" stroke="#6b4422" strokeWidth={2} />
      {[594, 636, 678].map((bx) => <Bread key={bx} x={bx} y={139} s={0.78} />)}
      <ClayOven x={690} y={360} s={1.15} />
      {children}
    </Scene>
  )
}

// 6. "'Don't be afraid,' said Elijah. 'God will not let your flour and oil run out.' So the widow shared her bread.
// And God made her flour and oil last and last, for all three of them!"
// In the widow's little house: she gives Elijah a round loaf of bread, happy; her little boy holds up his own piece;
// beside them, her jar of flour and jug of oil glow softly, still full.
function Page6() {
  const ey = 434, wy = 434, s = 1
  const ex = 300, wx = 452
  const meet: Pt = [376, 352]
  return (
    <WidowsHouse>
      <Glow x={180} y={366} r={130} color="#fff0b0" />
      <Tap say="Look! There is still more flour, and still more oil!" sfx="sparkle">
        <FlourJar x={150} y={404} s={1.15} />
        <OilJug x={214} y={406} s={1} />
        <Sparkles spots={[[104, 304, 9], [198, 300, 8], [150, 268, 7], [242, 336, 7]]} color="#fff3a0" />
      </Tap>
      <Tap say="Thank you for sharing your bread!" sfx="ding">
        <Elijah x={ex} y={ey} s={s} pose="hug-right" reach={[null, reach(ex, ey, s, meet[0] - 6, meet[1] + 4)]} blinkDelay={0.5} />
      </Tap>
      <Tap say="God takes care of us!" sfx="pop">
        <Widow x={wx} y={wy} s={s} pose="hug-right" mood="joy" facing="left" reach={[null, reach(wx, wy, s, meet[0] + 8, meet[1] + 2, 'left')]} blinkDelay={1.1} />
      </Tap>
      <Bread x={meet[0]} y={meet[1]} s={0.95} />
      <Tap say="Yum, yum! Thank You, God!" sfx="pop">
        <Person x={562} y={440} s={1} look={WIDOWS_BOY} pose="wave" holding="bread" blinkDelay={1.8} />
      </Tap>
    </WidowsHouse>
  )
}

// 7. "Remember? There was still no rain. Elijah called all the people to Mount Carmel. 'Let's see who the real God
// is!' he said. Some people prayed to a pretend god, all day long. But nothing happened."
// The mountaintop late in the day, the sun going down: beside their pile of stones and wood, the people in plum robes
// call out with their arms up (one has sat down, yawning, tired out); there's no fire at all. Everyone else watches,
// and Elijah speaks to them all.
function Page7() {
  return (
    <Carmel sky={SKY.late} back={<HotSun x={96} y={178} s={0.72} />}>
      <Crowd seed={3} rows={[[318, 0.62, [540, 572, 604, 636, 668, 700, 732, 764, 796]], [338, 0.7, [524, 564, 604, 684, 724, 764]]]} />
      {/* their pile of stones and wood, with no fire on it at all */}
      <Tap say="No fire at all. Nothing is happening." sfx="wobble"><HeapAltar x={236} y={384} s={1.12} /></Tap>
      <Tap say="Send fire! Send fire!" sfx="pop">
        <Figure x={96} y={406} s={0.86} look={CALLERS[0]} pose="arms-up" mood="wow" blinkDelay={0.3}><Shout beard /></Figure>
        <Figure x={338} y={392} s={0.8} look={CALLERS[1]} pose="arms-up" mood="wow" facing="left" blinkDelay={1.2}><Shout beard /></Figure>
        <Figure x={430} y={414} s={0.88} look={CALLERS[2]} pose="arms-up" mood="wow" facing="left" blinkDelay={0.7}><Shout /></Figure>
      </Tap>
      <Tap say="Yawn! I am so tired of calling." sfx="wobble">
        <g className="dn-shut"><ShutEyes /><Sitting x={520} y={440} s={0.82} look={CALLERS[3]} blinkDelay={2}><Yawn beard /></Sitting></g>
      </Tap>
      <Figure x={606} y={406} s={0.82} look={FOLK[1]} facing="left" blinkDelay={0.4} />
      <Figure x={640} y={416} s={0.84} look={FOLK[5]} facing="left" blinkDelay={1.4} />
      <Tap say="Let's see who the real God is!" sfx="ding">
        <Elijah x={722} y={436} s={1.04} pose="open" facing="left" blinkDelay={0.8} />
      </Tap>
    </Carmel>
  )
}

/** A big jar of water held in front (in a Figure's own units, as its `item`), tipped toward the altar to splash it on. */
const SPLASH = { x: 18, y: -74, a: 56, s: 1 }
const TippedJar = () => <g transform={`translate(${SPLASH.x} ${SPLASH.y}) rotate(${SPLASH.a}) scale(${SPLASH.s})`}><WaterJar /></g>
/** Where that jar's mouth is, and where the hands hold it (one under its foot, one under its belly), in Figure units. */
const SPLASH_MOUTH: Pt = [SPLASH.x + 24 * SPLASH.s * Math.sin((SPLASH.a * Math.PI) / 180), SPLASH.y - 24 * SPLASH.s * Math.cos((SPLASH.a * Math.PI) / 180)]
const SPLASH_HANDS: [Pt, Pt] = [[-1, -62], [24, -56]]

// 8. "Then Elijah built an altar to God with twelve big stones. He put wood on top and dug a ditch around it. 'Pour
// water all over it!' he said. Splash, splash! The water filled the ditch."
// Elijah's altar of twelve stones (tap each one to count them), the wood on top and the ditch round it, full of water.
// A helper on each side splashes a big jar of water over the wood, and it runs down the stones. Elijah points; the
// people watch.
function Page8() {
  const ax = 420, ay = 404, k = 0.8
  const top = ay - 137 * k
  const hy = 432, hs = 0.96
  const helpers = [{ x: 250, look: HELPER, side: -1 }, { x: 590, look: FOLK[3], side: 1 }]
  return (
    <Carmel sky={SKY.noon} back={<><Cloud x={640} y={70} s={0.5} slow /><Cloud x={190} y={96} s={0.42} /></>}>
      <Crowd seed={11} rows={[[322, 0.6, [40, 72, 104, 136, 656, 688, 720, 752, 784]], [342, 0.68, [20, 60, 100, 664, 704, 744, 784]]]} />
      <g transform={`translate(${ax} ${ay}) scale(${k})`}>
        {ALTAR_STONES.map((s) => <Tap key={s[4]} count="stones" sfx="pop"><AltarStone stone={s} /></Tap>)}
        <AltarWood />
        <Ditch />
        <Rivulets />
      </g>
      <Tap say="The ditch is full of water!" sfx="pop">
        <g transform={`translate(${ax} ${ay}) scale(${k})`}><DitchWater /></g>
      </Tap>
      <Tap say="Splash, splash! Here comes the water!" sfx="whoosh">
        {helpers.map((h, i) => {
          const m: Pt = [h.x - h.side * SPLASH_MOUTH[0] * hs, hy + SPLASH_MOUTH[1] * hs]
          const to: Pt = [ax + h.side * 28, top + 8]
          const via: Pt = [(m[0] + to[0]) / 2, Math.min(m[1], to[1]) - 70]
          return (
            <g key={i}>
              <Figure x={h.x} y={hy} s={hs} look={h.look} pose="hold" facing={h.side < 0 ? 'right' : 'left'} blinkDelay={i * 0.9} reach={SPLASH_HANDS} item={<TippedJar />} />
              <Pour from={m} via={via} to={to} w={6} />
              {[0.3, 0.55, 0.78].map((t, j) => {
                const px = (1 - t) * (1 - t) * m[0] + 2 * t * (1 - t) * via[0] + t * t * to[0]
                const py = (1 - t) * (1 - t) * m[1] + 2 * t * (1 - t) * via[1] + t * t * to[1]
                return <circle key={j} cx={px - h.side * (j - 1) * 6} cy={py - 9 + j * 3} r={2.4} fill="#bfe6ff" stroke="#4ea3df" strokeWidth={0.8} />
              })}
            </g>
          )
        })}
      </Tap>
      <Tap say="Pour water all over it!" sfx="ding">
        <Elijah x={112} y={436} s={1.04} pose="point" blinkDelay={0.6} />
      </Tap>
      <Figure x={716} y={432} s={0.94} look={FOLK[0]} facing="left" blinkDelay={1.6} />
    </Carmel>
  )
}

// 9. "Elijah prayed, 'Lord, show everyone that You are God.' Whoosh! God sent fire from heaven! It burned up the wood
// and the stones, and even all the water!"
// The sky opens in golden light over the altar, and God's fire comes down on it: a great bright blaze on the wood,
// flames all over the stones, and steam rising from the water in the ditch. Elijah prays with his arms up; the people
// gasp.
function Page9() {
  const ax = 430, ay = 404, k = 0.8
  const top = ay - 137 * k
  return (
    <Carmel sky={SKY.fire}>
      <Crowd seed={21} up={[1, 4, 7, 10]} rows={[[324, 0.6, [36, 68, 100, 132, 640, 672, 704, 736, 768]], [344, 0.68, [16, 56, 96, 660, 700, 740, 780]]]} />
      <g transform={`translate(${ax} ${ay}) scale(${k})`}>
        <AltarRow row={0} />
        <AltarRow row={1} />
        <AltarRow row={2} />
        <AltarWood />
        <Ditch />
        <DitchWater />
      </g>
      <Tap say="Whoosh! Fire from heaven!" sfx="sparkle">
        <HeavenFire x={ax} y={top + 6} top={-20} k={0.9} />
        <g transform={`translate(${ax} ${ay}) scale(${k})`}><StoneFlames /></g>
      </Tap>
      <Tap say="Sizzle! Even the water is burning up!" sfx="whoosh">
        {[[-112, 2, 1, 0], [104, 0, 1.1, 0.8], [-60, 20, 0.8, 1.5], [52, 20, 0.9, 0.4], [-2, 24, 0.8, 1.1]].map(([dx, dy, s, d], i) => (
          <Steam key={i} x={ax + dx} y={ay + dy} s={s} d={d} />
        ))}
      </Tap>
      <Tap say="Lord, show everyone that You are God!" sfx="ding">
        <Elijah x={170} y={436} s={1.06} pose="arms-up" mood="joy" blinkDelay={0.6} />
      </Tap>
      <Tap say="Wow! Look at that!" sfx="pop">
        <Figure x={650} y={430} s={0.96} look={FOLK[2]} mood="wow" facing="left" blinkDelay={0.4} />
        <Figure x={728} y={440} s={1} look={FOLK[4]} mood="wow" pose="arms-up" facing="left" blinkDelay={1.3} />
      </Tap>
    </Carmel>
  )
}

// 10. "When the people saw it, they knelt down and said, 'The Lord is God! The Lord is God!' Even the people who had
// prayed to the pretend god knew it now."
// Where the altar stood there's only warm, glowing, scorched ground and the empty ditch. Everyone kneels round it, the
// people in plum robes too, and Elijah, just behind it, raises his arms in thanks.
function Page10() {
  const ax = 420, ay = 388, k = 0.8
  return (
    <Carmel sky={SKY.after} back={<Glow x={420} y={60} r={260} color="#fff6d2" />}>
      <Crowd seed={31} kneel up={[0, 3, 6, 9, 12]} rows={[[320, 0.62, [30, 70, 110, 150, 600, 640, 680, 720, 760]], [344, 0.7, [20, 66, 112, 620, 666, 712, 758]]]} />
      <Tap say="Thank You, God, for showing everyone that You are God!" sfx="ding">
        <Elijah x={420} y={352} s={0.86} pose="arms-up" mood="joy" blinkDelay={0.6} />
      </Tap>
      <Tap say="The stones, the wood and the water are all gone!" sfx="sparkle">
        <g transform={`translate(${ax} ${ay}) scale(${k})`}><Scorch /></g>
      </Tap>
      <Tap say="The Lord is God! The Lord is God!" sfx="pop">
        <Kneel x={150} y={434} s={0.98} look={FOLK[0]} pose="arms-up" blinkDelay={0.4} />
        <Kneel x={252} y={440} s={0.92} look={FOLK[5]} pose="pray" blinkDelay={1.2} />
        <Kneel x={712} y={438} s={0.98} look={FOLK[2]} pose="arms-up" blinkDelay={0.9} />
      </Tap>
      <Tap say="Now we know. The Lord is the real God!" sfx="ding">
        <Kneel x={540} y={432} s={0.92} look={CALLERS[0]} pose="pray" blinkDelay={0.2} />
        <Kneel x={622} y={436} s={0.94} look={CALLERS[1]} pose="arms-up" blinkDelay={1.6} />
      </Tap>
      <Sparkles spots={[[300, 220, 9], [540, 210, 10], [420, 150, 8], [250, 300, 7], [600, 290, 7]]} />
    </Carmel>
  )
}

// 11. "Then Elijah prayed for rain. He prayed and prayed. At last, far out over the sea, a little cloud came up, as
// small as a hand."
// The top of Mount Carmel above the sea, late in the day: Elijah kneels and prays with his eyes shut; his helper stands
// on a rock, pointing out to sea at a tiny cloud rising over the water.
function Page11() {
  const id = gid(useId())
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fcdf0" /><stop offset="1" stopColor="#3f8fcf" /></linearGradient>
      </defs>
      <SkyFill colors={SKY.evening} />
      {/* the wide sea, far below */}
      <rect x={-10} y={214} width={820} height={150} fill={`url(#${id}w)`} />
      {[[60, 240], [200, 232], [340, 250], [500, 236], [640, 252], [120, 286], [420, 296], [700, 290], [260, 320]].map(([x, y]) => <path key={`${x}${y}`} d={`M${x} ${y} q10 -5 20 0`} stroke="#e8f6ff" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.8} />)}
      {/* (the sea answers a finger anywhere on it; the little cloud, over it, answers for itself) */}
      <Tap say="Swish, swoosh, goes the sea." sfx="whoosh">
        <rect x={-10} y={214} width={820} height={130} fill="transparent" />
        <path d="M296 266 q10 -5 20 0 M372 304 q10 -5 20 0 M176 314 q10 -5 20 0" stroke="#ffffff" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      </Tap>
      <Tap say="Here I come! A little cloud!" sfx="sparkle">
        <g className="el-rise">
          <Glow x={150} y={204} r={46} color="#ffffff" />
          <Cloud x={150} y={208} s={0.24} />
        </g>
      </Tap>
      {/* the mountaintop's edge, rocky, in front */}
      <path d="M-10 350 Q120 330 260 346 Q420 360 560 336 Q680 318 810 330 L810 460 L-10 460 Z" fill="#d6b96f" />
      <path d="M-10 350 Q120 330 260 346 Q420 360 560 336 Q680 318 810 330" stroke="#c4a35c" strokeWidth={3} fill="none" />
      <Crag x={606} y={396} w={176} h={60} color="#c7aa82" seed={21} flat />
      <Crag x={86} y={400} w={124} h={50} color="#c7aa82" seed={23} />
      <Tufts color="#b39550" spots={[[40, 430], [200, 404], [330, 446], [740, 436], [470, 412]]} />
      <Tap say="Look! A little cloud, as small as a hand!" sfx="ding">
        <Figure x={604} y={338} s={0.9} look={HELPER} pose="point" facing="left" mood="wow" blinkDelay={0.5} />
      </Tap>
      <Tap say="Please send the rain, God." sfx="ding">
        <g className="dn-shut"><ShutEyes /><Kneel x={322} y={436} s={1.16} look={ELIJAH} pose="pray" blinkDelay={0.7} /></g>
      </Tap>
    </Scene>
  )
}

// 12. "The little cloud grew and grew, and the sky turned dark. Then down came the rain! Splish, splash! The thirsty
// land drank and drank. God answers prayer, and God takes care of His people."
// Big soft rain clouds and rain pouring down on the mountaintop, already green again, with puddles everywhere. Elijah
// laughs with his arms up; the people dance and splash in the rain.
function Page12() {
  return (
    <Carmel wet sky={SKY.rain} back={<><Cloud x={160} y={70} s={1.5} grey /><Cloud x={460} y={56} s={1.7} grey slow /><Cloud x={720} y={86} s={1.3} grey /><Cloud x={320} y={130} s={1} grey slow /><Cloud x={620} y={150} s={0.9} grey /></>}>
      <Crowd seed={41} up={[0, 2, 5, 7, 9]} rows={[[324, 0.62, [30, 70, 110, 650, 690, 730, 770]], [346, 0.7, [50, 100, 620, 670, 720, 770]]]} />
      {/* puddles, with rings where the rain lands */}
      <Tap say="Splash! A big puddle!" sfx="pop">
        {[[300, 420, 70, 12], [560, 438, 60, 10], [120, 400, 46, 8], [690, 396, 50, 9]].map(([px, py, rx, ry], i) => (
          <g key={i}>
            <ellipse cx={px} cy={py} rx={rx} ry={ry} fill="#9cc8e8" stroke="#6fa6d0" strokeWidth={2} />
            {[-0.4, 0.3].map((t, j) => (
              <g key={j} transform={`translate(${px + t * rx} ${py + (j ? -2 : 2)})`}>
                <g className="el-ring" style={{ animationDelay: `${(i + j) * 0.4}s` }}>
                  <ellipse cx={0} cy={0} rx={10} ry={3} fill="none" stroke="#ffffff" strokeWidth={1.6} />
                </g>
              </g>
            ))}
          </g>
        ))}
      </Tap>
      <Flower x={210} y={446} color="#ffd34d" />
      <Flower x={470} y={448} color="#ff8cc0" />
      <Flower x={760} y={440} color="#ffffff" />
      <Tap say="Hooray! Thank You, God, for the rain!" sfx="pop">
        <Figure x={170} y={432} s={0.96} look={FOLK[2]} pose="arms-up" mood="joy" blinkDelay={0.3} />
        <Figure x={250} y={444} s={0.92} look={FOLK[5]} pose="arms-up" mood="joy" blinkDelay={1.1} />
        <Figure x={640} y={436} s={0.98} look={FOLK[1]} pose="arms-up" mood="joy" facing="left" blinkDelay={0.7} />
      </Tap>
      <Tap say="God answers prayer!" sfx="ding">
        <Elijah x={420} y={430} s={1.06} pose="arms-up" mood="joy" blinkDelay={0.5} />
      </Tap>
      <Tap say="We waited and waited. Now it is raining!" sfx="pop">
        <Figure x={730} y={442} s={0.94} look={HELPER} pose="open" mood="joy" facing="left" blinkDelay={1.5} />
      </Tap>
      <Rain heavy />
    </Carmel>
  )
}

export const ELIJAH_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]

/** Carmel's skies, for the mini-game's backdrop (so it matches the story's mountaintop). */
export const CARMEL_SKIES = SKY
