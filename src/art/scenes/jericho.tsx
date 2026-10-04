// The Walls of Jericho: one picture per story page, both parts in order (see data/jericho.ts for the words).
// Part one (pages 1 to 6): God chooses Joshua, kind Rahab hides the two men Joshua sent and gets a red cord
// for her window, God's people cross the Jordan on dry ground, and God gives Joshua a strange plan. Part two
// (pages 7 to 12): God's people march round Jericho, day after day, seven times on the seventh day, shout,
// and the walls fall down flat; Rahab and her family are safe; everyone thanks God.
//
// For shared files later (they're the same on every page, and in the island's game, art/games/jericho.tsx):
//   people: JOSHUA, RAHAB, SPIES (the two men), RAHAB_FAMILY, PRIESTS (God's people are the Moses islands'
//           HEBREWS family and crowd, scenes/moses.tsx);
//   props:  Blowing (a ram's-horn trumpet at a priest's lips), HeldHorn, BoxCarriers (two priests carrying
//           God's special golden box), Jericho (the walled city seen from a little above, its walls a ring with
//           towers, a gate, houses inside and Rahab's house on the wall; `fall` brings the walls tumbling
//           down, all but Rahab's stretch), MarchingRound (God's people marching round it), StoneWall and
//           RahabsHouse (a stretch of the wall seen straight on), Flax, RedCord, Rubble, TallyMarks.
// God is never drawn as a person: His presence is light. Nobody is ever hurt: nobody stands on or under the
// walls when they fall, and everyone in the pictures is one of God's people, Rahab or her family.
import { memo, useId, type ReactNode } from 'react'
import { ink, lighten } from '../kit'
import { Person, SKIN, type Look, type Pose } from '../people'
import { GoldenBoxShape, RamsHorn } from '../items/isl-jericho'
import { Glow, Palm, Rays, Scene, Sparkles, Tap } from './kit'
import { Folk, Goat, Grip, HEBREWS, Heart, Notes, SilverHair } from './moses'
import { CampTent, FarCamp } from './manna'

const f1 = (n: number) => n.toFixed(1)
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
type Pt = [number, number]
const path = (p: Pt[]) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join(' ')
/** A number from 0 to 1 that looks random but is always the same for the same n. */
function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

// ---------- The cast ----------

/** Joshua, who led God's people after Moses: short dark hair and beard, a deep teal robe and a gold sash. */
export const JOSHUA: Look = { skin: SKIN.tan, hair: 'short', hairColor: '#3b2a20', beard: 'short', beardColor: '#3b2a20', robe: '#2e7f86', sash: '#f2c94c' }
/** Rahab, the kind woman whose house was on Jericho's wall: a marigold head scarf and a violet robe. */
export const RAHAB: Look = { skin: SKIN.medium, hair: 'covered', hairColor: '#2b1f18', wrap: '#f4a93a', robe: '#8e6ad0', sash: '#ffe7a3' }
/** The two men Joshua sent to look at Jericho (the spies): a sand-colored head cloth and a brown robe, and black curls and green. */
export const SPIES: Look[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#e2d2ac', beard: 'short', beardColor: '#4a3020', robe: '#9a6b45', sash: '#5f8fc0' },
  { skin: SKIN.deep, hair: 'curly', hairColor: '#1f1712', robe: '#6f9a5a', sash: '#e8c25a' },
]
/** Rahab's family, kept safe in her house: her father, her mother, her brother and her sister. */
export const RAHAB_FAMILY: Look[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#cdbb92', beard: 'long', beardColor: '#eeeae2', robe: '#a0703f', sash: '#e8c25a' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#eaa7bb', robe: '#c96f6a', sash: '#fff1d0' },
  { skin: SKIN.tan, hair: 'short', hairColor: '#2b1f18', robe: '#4f9a8a', sash: '#f2d38a' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#2b1f18', wrap: '#7cc0e8', robe: '#e58fb0', sash: '#ffffff' },
]
/** The priests, in white linen with white head cloths and bright sashes. */
const LINEN = '#f6f3ea'
export const PRIESTS: Look[] = [
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#ffffff', beard: 'short', beardColor: '#3b2a20', robe: LINEN, sash: '#3a6fc4' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#2b1f18', wrap: '#ffffff', beard: 'long', beardColor: '#4a3020', robe: LINEN, sash: '#7a4fb0' },
  { skin: '#e3b48c', hair: 'covered', hairColor: '#5a3a24', wrap: '#ffffff', beard: 'short', beardColor: '#5a3a24', robe: LINEN, sash: '#c0504d' },
  { skin: SKIN.deep, hair: 'covered', hairColor: '#1f1712', wrap: '#ffffff', robe: LINEN, sash: '#3a6fc4' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#ffffff', beard: 'long', beardColor: '#eeeae2', robe: LINEN, sash: '#7a4fb0' },
]

// ---------- Trumpets, and God's special golden box ----------

/** Sound coming out of a trumpet's bell at (x, y): three arcs fanning out upward (`flip`: up and to the left). */
export function Blast({ x, y, o = 1, s = 1, flip }: { x: number; y: number; o?: number; s?: number; flip?: boolean }) {
  const arcs = [10, 18, 26].map((r) => {
    const a0 = (-128 * Math.PI) / 180, a1 = (-42 * Math.PI) / 180
    return `M${f1(r * Math.cos(a0))} ${f1(r * Math.sin(a0))} A${r} ${r} 0 0 1 ${f1(r * Math.cos(a1))} ${f1(r * Math.sin(a1))}`
  }).join(' ')
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`} opacity={o} strokeLinecap="round" fill="none">
      <path d={arcs} stroke="#e8a830" strokeWidth={5.4} />
      <path d={arcs} stroke="#fff6c4" strokeWidth={2.8} />
    </g>
  )
}

/**
 * A priest blowing a ram's-horn trumpet (inside a Person with pose "point", in figure units): the horn from
 * the lips, out past the cheek to the right hand, then curving up to its bell at about (80, -128).
 */
export function Blowing({ look }: { look: Look }) {
  const my = look.beard ? -99.5 : -104.5
  return (
    <g>
      <RamsHorn c={[2, my, 34, my + 16, 72, -84, 80, -128]} w0={3.6} w1={15} />
      <Grip x={54} y={-91} skin={look.skin} />
    </g>
  )
}

/** A ram's-horn trumpet held across the front in both hands, ready to blow (a Person with pose "hold"). */
export const HeldHorn = ({ look }: { look: Look }) => (
  <g>
    <RamsHorn c={[-28, -70, -10, -52, 20, -50, 30, -84]} w0={3.2} w1={13} />
    <Grip x={-8} y={-60} skin={look.skin} />
    <Grip x={8} y={-59} skin={look.skin} />
  </g>
)

/** A mouth wide open, shouting (inside a Person). */
export const ShoutMouth = ({ beard }: { beard?: boolean }) => (
  <g>
    <ellipse cx={0} cy={beard ? -98.5 : -104} rx={5.2} ry={4.6} fill="#6b2a3a" stroke="#4a1a28" strokeWidth={1.4} />
    <ellipse cx={0} cy={beard ? -96.2 : -101.6} rx={3} ry={1.6} fill="#ff8fa3" />
  </g>
)

/**
 * God's special golden box carried by two priests, side on: one at each end of the carrying pole, which
 * runs through the box's rings at their hands. (x, y) = the ground under the box; in figure units the
 * priests stand at -76 and 76 (Persons at s = 1), and the whole thing is scaled by s. `glow`: God's light.
 */
export function BoxCarriers({ x, y, s = 1, facing = 'right', glow = true, looks = [PRIESTS[2], PRIESTS[3]] }: {
  x: number; y: number; s?: number; facing?: 'left' | 'right'; glow?: boolean; looks?: Look[]
}) {
  const pole = '#d39a2e'
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${facing === 'left' ? -s : s} ${s})`}>
      {glow && <Glow x={0} y={-92} r={92} color="#fff2a8" />}
      <Person x={-76} y={0} look={looks[0]} pose="hold" blinkDelay={0.7} />
      <Person x={76} y={0} look={looks[1]} pose="hold" blinkDelay={1.9} />
      <g transform="translate(0 -51) scale(0.95)"><GoldenBoxShape /></g>
      <rect x={-100} y={-63.5} width={200} height={7} rx={3.5} fill={pole} stroke={ink(pole)} strokeWidth={2.2} />
      <path d="M-96 -61.5 L96 -61.5" stroke={lighten(pole, 0.45)} strokeWidth={1.6} strokeLinecap="round" />
      {[[-84, looks[0]], [-68, looks[0]], [68, looks[1]], [84, looks[1]]].map(([hx, lk], i) => (
        <Grip key={i} x={hx as number} y={-60} skin={(lk as Look).skin} />
      ))}
    </g>
  )
}

// ---------- Jericho: the walled city, seen from a little above ----------
// Its walls go all the way round in a ring (an ellipse), with towers, a gate (shut tight), houses inside, and
// Rahab's house up on the wall with her window and its red cord. Local units: (0, 0) is the middle of the
// ring on the ground; angles go round from 0 (the right end) through π/2 (the front) and π (the left end).

const W = { face: '#e9c085', light: '#f8deae', dark: '#c4945a', line: '#93663a', mortar: '#c09058', top: '#f6e0b4', back: '#d5a86d', backTop: '#efd3a0' }
const NIGHT_W = { face: '#9a8fae', light: '#b8aec9', dark: '#6f6688', line: '#4f4766', mortar: '#7c7396', top: '#aea5c2', back: '#867c9c', backTop: '#a39abb' }
type WallColors = typeof W
const RX = 150, RY = 44, H = 82, TK = 13 // the wall: its outer face round the ground, its height and thickness
const IRX = RX - TK, IRY = RY - (TK * RY) / RX
const NSEG = 16 // stretches of wall in each half of the ring
const RUBBLE = 13 // how high a fallen stretch's heap of stones is
const STEP = Math.PI / NSEG
/** Where Rahab's house is: the line between front stretches 4 and 5, which never fall. */
export const RAHAB_T = 5 * STEP
const STANDING = new Set([4, 5])
const TOWERS_FRONT = [0.07, 0.4, 0.6, 0.93].map((k) => k * Math.PI)
const TOWERS_BACK = [1.18, 1.5, 1.82].map((k) => k * Math.PI)
const TH = H + 24 // a tower's height

const ring = (t: number, rx: number, ry: number, up = 0): Pt => [rx * Math.cos(t), ry * Math.sin(t) - up]
const arc = (t0: number, t1: number, rx: number, ry: number, up: number, n: number): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => ring(t0 + ((t1 - t0) * i) / n, rx, ry, up))

/** How far one stretch of wall has fallen (0 to 1) when the walls as a whole are `fall` of the way down. */
function stretchFall(fall: number, key: number) {
  if (fall <= 0) return 0
  if (fall >= 1) return 1
  return clamp01((fall - 0.42 * hash(key)) / 0.58)
}
/** How tall a stretch is when it has fallen p of the way (it gathers speed as it goes). */
const tallness = (p: number, full = H) => full - (full - RUBBLE) * p * p

/** A house inside the city: plastered walls, a flat roof seen from a little above, small dark windows. (x, y) = the middle of its foot. */
function TownHouse({ x, y, w, h, win = 1, plain }: { x: number; y: number; w: number; h: number; win?: number; plain?: boolean }) {
  const d = 6
  const l = x - w / 2, r = x + w / 2, t = y - h
  return (
    <g strokeLinejoin="round">
      <path d={`M${r} ${t} L${r + d} ${t - d * 0.7} L${r + d} ${y - d * 0.7} L${r} ${y} Z`} fill="#d8bd8e" stroke="#b08a56" strokeWidth={1.5} />
      <rect x={l} y={t} width={w} height={h} fill="#f0ddb5" stroke="#b08a56" strokeWidth={1.6} />
      <path d={`M${l} ${t} L${l + d} ${t - d * 0.7} L${r + d} ${t - d * 0.7} L${r} ${t} Z`} fill="#faefd6" stroke="#b08a56" strokeWidth={1.5} />
      {!plain && (
        <g>
          {Array.from({ length: Math.max(1, Math.floor(w / 10)) }, (_, i) => <circle key={i} cx={l + 5 + i * 10} cy={t + 4} r={1.6} fill="#8a6040" />)}
          {Array.from({ length: win }, (_, i) => <rect key={i} x={l + (w * (i + 0.5)) / win - 3.5} y={t + h * 0.3} width={7} height={8} rx={1.5} fill="#6b4a2e" />)}
        </g>
      )}
    </g>
  )
}

/** The houses inside Jericho: [x, ground y, width, height, windows]. Only their tops show over the front wall. */
const HOUSES: [number, number, number, number, number][] = [
  [-104, -12, 24, 44, 1], [-80, -22, 28, 58, 1], [-50, -27, 30, 52, 2], [-16, -30, 38, 74, 2], [24, -28, 28, 56, 1],
  [54, -22, 30, 50, 2], [92, -12, 22, 42, 1], [-64, -6, 28, 54, 1], [-28, -8, 26, 50, 1], [10, -9, 30, 52, 2],
]

/**
 * Jericho, its walls a ring round the city (see above). `fall` (0 to 1): the walls tumbling down, stretch by
 * stretch, in a cloud of dust, until they're heaps of stones flat on the ground; Rahab's stretch stays
 * standing. `cord`: the red cord in Rahab's window; `rahab`: Rahab looking out of it; `plain`: no stone
 * courses (for when it's far away); `night`: moonlit colors.
 */
export const Jericho = memo(function Jericho({ x, y, s = 1, fall = 0, cord = true, rahab = false, plain = false, night = false }: {
  x: number; y: number; s?: number; fall?: number; cord?: boolean; rahab?: boolean; plain?: boolean; night?: boolean
}) {
  const id = `jw${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const C: WallColors = night ? NIGHT_W : W
  const pf = Array.from({ length: NSEG }, (_, j) => (STANDING.has(j) ? 0 : stretchFall(fall, j)))
  const pb = Array.from({ length: NSEG }, (_, j) => stretchFall(fall, 100 + j))
  const hf = pf.map((p) => tallness(p))
  const hb = pb.map((p) => tallness(p))
  const segOf = (t: number) => Math.min(NSEG - 1, Math.max(0, Math.floor((((t % Math.PI) + Math.PI) % Math.PI) / STEP)))

  // the front of the wall: its top edge stretch by stretch, then back along its foot
  const frontTop = pf.flatMap((_, j) => arc(j * STEP, (j + 1) * STEP, RX, RY, hf[j], 3))
  const front = `${path(frontTop)} ${path(arc(Math.PI, 0, RX, RY, 0, 40)).replace('M', 'L')} Z`
  const backTop = pb.flatMap((_, j) => arc(Math.PI + j * STEP, Math.PI + (j + 1) * STEP, IRX, IRY, hb[j], 3))
  const back = `${path(backTop)} ${path(arc(2 * Math.PI, Math.PI, IRX, IRY, 0, 40)).replace('M', 'L')} Z`

  // stone courses: rows round the wall, and the joints between the stones, every other row offset
  const courses = (t0: number, rx: number, ry: number) => {
    let d = ''
    for (let k = 1; k < 6; k++) d += ` ${path(arc(t0, t0 + Math.PI, rx, ry, (k * H) / 6, 40))}`
    for (let k = 0; k < 6; k++) {
      for (let m = 0; m < 22; m++) {
        const t = t0 + ((m + (k % 2 ? 0.5 : 0.25)) * Math.PI) / 22
        const [jx, jy] = ring(t, rx, ry, (k * H) / 6)
        d += ` M${f1(jx)} ${f1(jy)} L${f1(jx)} ${f1(jy - H / 6)}`
      }
    }
    return d
  }

  // the walkway along the top of each stretch, between its outer and inner edges
  const band = (t0: number, t1: number, up: number, inner: 'far' | 'near') => {
    const outer = arc(t0, t1, RX, RY, up, 3), innerPts = arc(t1, t0, IRX, IRY, up, 3)
    return inner === 'far' ? `${path(outer)} ${path(innerPts).replace('M', 'L')} Z` : `${path(innerPts)} ${path(outer).replace('M', 'L')} Z`
  }

  // merlons (the blocks along the top), where there's no tower, gate or house
  const clear = (t: number) => !TOWERS_FRONT.some((tt) => Math.abs(tt - t) < 0.17) && !(t > 0.24 * Math.PI && t < 0.39 * Math.PI) && !TOWERS_BACK.some((tt) => Math.abs(tt - t) < 0.15)
  const merlon = (t: number, up: number, rx: number, ry: number, w: number, key: string) => {
    const [mx, my] = ring(t, rx, ry, up)
    return <rect key={key} x={f1(mx - w / 2)} y={f1(my - 9)} width={f1(w)} height={10} rx={1.2} fill={C.face} stroke={C.line} strokeWidth={1.4} />
  }

  const tower = (t: number, frontSide: boolean) => {
    const p = frontSide ? pf[segOf(t)] : pb[segOf(t)]
    if (p > 0.92) return null
    const hh = tallness(p, TH)
    const sn = Math.abs(Math.sin(t)), cs = Math.cos(t)
    const [bx, by0] = frontSide ? ring(t, RX, RY) : ring(t, IRX, IRY)
    const by = by0 + (frontSide ? 3 : 0)
    const wf = (frontSide ? 30 : 26) * sn + 7
    const ws = frontSide ? 13 * Math.abs(cs) : 0
    const toMiddle = bx > 0 ? -1 : 1 // its side that faces the middle shows
    const l = bx - wf / 2, r = bx + wf / 2
    const sx = toMiddle < 0 ? l : r
    const capL = Math.min(l, sx + toMiddle * ws) - 2, capR = Math.max(r, sx + toMiddle * ws) + 2
    // once it starts to fall, its top is broken and jagged
    const broken = p > 0.12
    const jag = (k: number) => (broken ? 9 * hash(t * 10 + k) : 0)
    const face = broken
      ? `M${f1(l)} ${f1(by)} L${f1(l)} ${f1(by - hh + jag(1))} L${f1(l + wf * 0.3)} ${f1(by - hh + 6 + jag(2))} L${f1(l + wf * 0.55)} ${f1(by - hh)} L${f1(l + wf * 0.8)} ${f1(by - hh + 5 + jag(3))} L${f1(r)} ${f1(by - hh + jag(4))} L${f1(r)} ${f1(by)} Z`
      : `M${f1(l)} ${f1(by)} L${f1(l)} ${f1(by - hh)} L${f1(r)} ${f1(by - hh)} L${f1(r)} ${f1(by)} Z`
    return (
      <g key={`t${f1(t)}`} strokeLinejoin="round">
        {ws > 0.5 && <path d={`M${f1(sx)} ${f1(by - hh + jag(5))} L${f1(sx + toMiddle * ws)} ${f1(by - hh - 4 + jag(6))} L${f1(sx + toMiddle * ws)} ${f1(by - 4)} L${f1(sx)} ${f1(by)} Z`} fill={C.dark} stroke={C.line} strokeWidth={1.5} />}
        <path d={face} fill={C.face} stroke={C.line} strokeWidth={1.6} />
        {!plain && [0.25, 0.5, 0.75].filter((k) => k * hh < hh - 8).map((k) => <path key={k} d={`M${f1(l)} ${f1(by - hh * k)} L${f1(r)} ${f1(by - hh * k)}`} stroke={C.mortar} strokeWidth={1} opacity={0.7} />)}
        {!broken && (
          <g>
            <rect x={f1(bx - 1.8)} y={f1(by - hh * 0.66)} width={3.6} height={10} rx={1.8} fill="#5a3f2a" />
            <rect x={f1(capL)} y={f1(by - hh - 6)} width={f1(capR - capL)} height={7} rx={1.5} fill={C.top} stroke={C.line} strokeWidth={1.5} />
            {[0.18, 0.5, 0.82].map((k) => <rect key={k} x={f1(capL + (capR - capL) * k - 3.5)} y={f1(by - hh - 15)} width={7} height={10} rx={1.2} fill={C.face} stroke={C.line} strokeWidth={1.4} />)}
          </g>
        )}
      </g>
    )
  }

  const [rhx, rhy] = ring(RAHAB_T, RX, RY) // Rahab's stretch, at the foot of the wall
  const gateP = Math.max(pf[7], pf[8])
  const cutFace = pf[6] > 0.35 // the stretch left of Rahab's has gone, so its broken end shows

  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`} strokeLinejoin="round">
      <defs>
        <linearGradient id={`${id}f`} gradientUnits="userSpaceOnUse" x1={-RX} y1={0} x2={RX} y2={0}>
          <stop offset="0" stopColor={C.dark} /><stop offset="0.42" stopColor={C.light} /><stop offset="0.7" stopColor={C.face} /><stop offset="1" stopColor={C.dark} />
        </linearGradient>
        <clipPath id={`${id}cf`}><path d={front} /></clipPath>
        <clipPath id={`${id}cb`}><path d={back} /></clipPath>
      </defs>
      <ellipse cx={0} cy={8} rx={RX + 14} ry={RY + 12} fill="#000" opacity={0.1} />

      {/* the far side of the ring: its inner face, the walkway and merlons along its top, and its towers */}
      <path d={back} fill={C.back} stroke={C.line} strokeWidth={1.8} />
      {!plain && <path d={courses(Math.PI, IRX, IRY)} stroke={C.mortar} strokeWidth={1} fill="none" opacity={0.6} clipPath={`url(#${id}cb)`} />}
      {pb.map((_, j) => <path key={`bb${j}`} d={band(Math.PI + j * STEP, Math.PI + (j + 1) * STEP, hb[j], 'near')} fill={C.backTop} stroke={C.line} strokeWidth={1.2} />)}
      {Array.from({ length: 18 }, (_, m) => Math.PI + ((m + 0.5) * Math.PI) / 18).filter((t) => clear(t) && pb[segOf(t)] < 0.05)
        .map((t, m) => merlon(t, H, RX, RY, 3 + 5 * Math.abs(Math.sin(t)), `bm${m}`))}
      {TOWERS_BACK.map((t) => tower(t, false))}
      {pb.map((p, j) => (p > 0.05 && p < 1 ? <Dust key={`bd${j}`} t={Math.PI + (j + 0.5) * STEP} p={p} rx={IRX} ry={IRY} /> : null))}

      {/* inside: the town */}
      <ellipse cx={0} cy={0} rx={IRX} ry={IRY} fill={night ? '#7f7898' : '#e5cd9a'} />
      {HOUSES.slice().sort((a, b) => a[1] - b[1]).map(([hx, hy, w, h, win], i) => <TownHouse key={i} x={hx} y={hy} w={w} h={h} win={win} plain={plain} />)}
      {!night && <><Palm x={-112} y={-4} s={0.36} /><Palm x={70} y={-30} s={0.32} /><Palm x={112} y={-2} s={0.3} /></>}

      {/* the near side: the walkway along its top, its outer face, the gate, merlons and towers */}
      {pf.map((_, j) => <path key={`fb${j}`} d={band(j * STEP, (j + 1) * STEP, hf[j], 'far')} fill={C.top} stroke={C.line} strokeWidth={1.2} />)}
      <path d={front} fill={`url(#${id}f)`} stroke={C.line} strokeWidth={2} />
      {!plain && <path d={courses(0, RX, RY)} stroke={C.mortar} strokeWidth={1.1} fill="none" opacity={0.75} clipPath={`url(#${id}cf)`} />}
      {gateP < 0.12 && <Gate />}
      {Array.from({ length: 20 }, (_, m) => ((m + 0.5) * Math.PI) / 20).filter((t) => clear(t) && pf[segOf(t)] < 0.05)
        .map((t, m) => merlon(t, H, RX, RY, 4 + 6 * Math.sin(t), `fm${m}`))}
      {TOWERS_FRONT.map((t) => tower(t, true))}

      {/* Rahab's house up on the wall, her window, and the red cord */}
      {cutFace && <path d={`${path([ring(6 * STEP, RX, RY), ring(6 * STEP, RX, RY, H), ring(6 * STEP, IRX, IRY, H), ring(6 * STEP, IRX, IRY)])} Z`} fill={C.dark} stroke={C.line} strokeWidth={1.6} />}
      <RingHouse x={rhx} y={rhy - H} c={C} />
      <g transform={`translate(${f1(rhx)} ${f1(rhy - H * 0.58)})`}>
        <rect x={-7.5} y={-7} width={15} height={14} rx={1.5} fill={night ? '#ffd970' : '#5a3f2a'} stroke="#7a5230" strokeWidth={2} />
        {rahab && <RahabPeeks />}
        <rect x={-9.5} y={6} width={19} height={3} rx={1} fill="#9a6b3e" />
        {cord && <RedCord x={3} y={8} len={30} w={2.6} />}
      </g>

      {/* the fallen stretches: heaps of stones, stones tumbling down, and dust */}
      {pf.map((p, j) => (p > 0.5 ? <Heap key={`fh${j}`} t0={j * STEP} t1={(j + 1) * STEP} up={hf[j]} p={p} c={C} /> : null))}
      {pf.map((p, j) => (p > 0 ? <Tumbling key={`ft${j}`} j={j} p={p} c={C} /> : null))}
      {pf.map((p, j) => (p > 0.05 && p < 1 ? <Dust key={`fd${j}`} t={(j + 0.5) * STEP} p={p} rx={RX} ry={RY} /> : null))}
    </g>
  )
})

/** Jericho's gate, shut tight: a stone arch in the front of the wall, and two big wooden doors. */
function Gate() {
  return (
    <g strokeLinejoin="round">
      <path d="M-17 45 L-17 12 Q-17 -6 0 -6 Q17 -6 17 12 L17 45" fill="none" stroke="#d9b277" strokeWidth={7} />
      <path d="M-14 45 L-14 12 Q-14 -2 0 -2 Q14 -2 14 12 L14 45 Z" fill="#8a5a2e" stroke="#5e3a1c" strokeWidth={1.8} />
      <path d="M0 -2 L0 45 M-7 1 L-7 45 M7 1 L7 45" stroke="#6f4522" strokeWidth={1.2} />
      {[-10, -4, 4, 10].map((bx) => [18, 32].map((by) => <circle key={`${bx}${by}`} cx={bx} cy={by} r={1.2} fill="#e8c25a" />))}
      <path d="M-17 45 L-17 12 Q-17 -6 0 -6 Q17 -6 17 12 L17 45" fill="none" stroke="#93663a" strokeWidth={1.4} />
    </g>
  )
}

/** Rahab's little house up on Jericho's wall (in the ring): its upper room, with a flat roof and a window. (x, y) = the top of the wall under it. */
function RingHouse({ x, y, c }: { x: number; y: number; c: WallColors }) {
  const w = 30, h = 22, d = 5
  const l = x - w / 2, r = x + w / 2, t = y - h + 2
  return (
    <g strokeLinejoin="round">
      <path d={`M${f1(r)} ${f1(t)} L${f1(r + d)} ${f1(t - d * 0.7)} L${f1(r + d)} ${f1(y - 2)} L${f1(r)} ${f1(y + 2)} Z`} fill={c === W ? '#d8bd8e' : '#8a809f'} stroke={c.line} strokeWidth={1.5} />
      <rect x={f1(l)} y={f1(t)} width={w} height={h} fill={c === W ? '#f2dfb8' : '#aaa1c0'} stroke={c.line} strokeWidth={1.6} />
      <path d={`M${f1(l)} ${f1(t)} L${f1(l + d)} ${f1(t - d * 0.7)} L${f1(r + d)} ${f1(t - d * 0.7)} L${f1(r)} ${f1(t)} Z`} fill={c === W ? '#fbf1da' : '#bdb5d0'} stroke={c.line} strokeWidth={1.5} />
      <rect x={f1(x - 4)} y={f1(t + 6)} width={8} height={8} rx={1.4} fill={c === W ? '#6b4a2e' : '#ffd970'} />
      {/* bundles of flax drying on the roof */}
      <path d={`M${f1(l + 5)} ${f1(t - 2.5)} L${f1(l + 16)} ${f1(t - 3.5)} M${f1(l + 14)} ${f1(t - 1.8)} L${f1(r + 1)} ${f1(t - 2.8)}`} stroke="#d9b35a" strokeWidth={2.4} strokeLinecap="round" />
    </g>
  )
}

/** Rahab looking out of her window in the ring (in the window's units: its middle at (0, 0)). */
const RahabPeeks = () => (
  <g>
    <rect x={-6} y={0} width={12} height={7} fill={RAHAB.robe} />
    <circle cx={0} cy={-0.5} r={4.6} fill={RAHAB.skin} stroke={ink(RAHAB.skin)} strokeWidth={0.8} />
    <path d="M-5 -0.5 Q-5.5 -7 0 -7 Q5.5 -7 5 -0.5 Q2.5 -4 0 -4 Q-2.5 -4 -5 -0.5 Z" fill={RAHAB.wrap} stroke={ink(RAHAB.wrap!)} strokeWidth={0.7} />
    <circle cx={-1.6} cy={-0.6} r={0.7} fill="#2b2140" />
    <circle cx={1.6} cy={-0.6} r={0.7} fill="#2b2140" />
    <path d="M-1.2 1.4 Q0 2.4 1.2 1.4" stroke="#6b2a3a" strokeWidth={0.6} fill="none" />
  </g>
)

/** A heap of fallen stones along the foot of a stretch of the ring (from angle t0 to t1), its top at `up`. */
function Heap({ t0, t1, up, p, c }: { t0: number; t1: number; up: number; p: number; c: WallColors }) {
  return (
    <g opacity={clamp01((p - 0.5) * 3)}>
      {[0.15, 0.42, 0.68, 0.9].map((k, i) => {
        const [sx, sy] = ring(t0 + (t1 - t0) * k, RX, RY, up - 2)
        return <ellipse key={i} cx={f1(sx)} cy={f1(sy)} rx={7 - (i % 2)} ry={4.6} transform={`rotate(${(i % 3) * 14 - 12} ${f1(sx)} ${f1(sy)})`} fill={i % 2 ? c.face : c.light} stroke={c.line} strokeWidth={1.3} />
      })}
    </g>
  )
}

/**
 * Three stones tumbling off a falling stretch of the front wall (p: how far it has fallen), spinning as they
 * drop, with streaks above them, and landing on the ground just in front of it (where they stay).
 */
function Tumbling({ j, p, c }: { j: number; p: number; c: WallColors }) {
  const q = Math.min(1, p / 0.8)
  return (
    <g>
      {[0, 1, 2].map((k) => {
        const t = (j + 0.2 + k * 0.3) * STEP
        const [x0, y0] = ring(t, RX, RY, H - 4 - 22 * k)
        const [, yl] = ring(t, RX, RY, -5 - 4 * ((k + j) % 3))
        const d = (k + j) % 2 ? 1 : -1
        const x = x0 + d * (5 + 4 * k) * q
        const y = y0 + (yl - y0) * q * q
        const w = 13 - 2 * k + (j % 3), h = 9 - k
        return (
          <g key={k}>
            {q > 0.05 && q < 1 && (
              <path d={`M${f1(x - 4)} ${f1(y - 10 - 12 * q)} L${f1(x - 4)} ${f1(y - 6)} M${f1(x + 4)} ${f1(y - 13 - 14 * q)} L${f1(x + 4)} ${f1(y - 7)}`}
                stroke="#ffffff" strokeWidth={1.8} opacity={f1(0.85 * (1 - q))} strokeLinecap="round" />
            )}
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(d * 150 * q + 8 * k)})`}
              fill={k === 1 ? c.face : c.light} stroke={c.line} strokeWidth={1.3} />
          </g>
        )
      })}
    </g>
  )
}

/** Dust puffing up from a stretch of wall as it falls (p: how far it has fallen), at angle t round the ring; it settles as the stones do. */
function Dust({ t, p, rx, ry }: { t: number; p: number; rx: number; ry: number }) {
  const [x, y] = ring(t, rx, ry)
  const o = 0.85 * Math.sin(Math.PI * p) ** 0.7
  const g = 1 + 0.9 * p
  const puffs: [number, number, number][] = [[-12, -3 - 5 * p, 8], [2, -8 - 9 * p, 10], [14, -2 - 4 * p, 7], [-3, -21 - 16 * p, 7]]
  return (
    <g opacity={f1(o)}>
      <g fill="#e2cd9e">{puffs.map(([dx, dy, r], i) => <circle key={i} cx={f1(x + dx)} cy={f1(y + dy)} r={f1(r * g)} />)}</g>
      <g fill="#f3e7c8">{puffs.map(([dx, dy, r], i) => <circle key={i} cx={f1(x + dx - r * 0.25 * g)} cy={f1(y + dy - r * 0.3 * g)} r={f1(r * 0.62 * g)} />)}</g>
    </g>
  )
}

/** The red cord hanging from a window: from (x, y) down `len`, with a little knot at the top and a tassel. */
export function RedCord({ x, y, len, w = 3, sway = 0 }: { x: number; y: number; len: number; w?: number; sway?: number }) {
  const red = '#e0352c'
  const d = `M${f1(x)} ${f1(y)} C${f1(x + 2 + sway)} ${f1(y + len * 0.35)} ${f1(x - 2 + sway)} ${f1(y + len * 0.7)} ${f1(x + 1 + sway)} ${f1(y + len)}`
  return (
    <g strokeLinecap="round">
      <path d={d} fill="none" stroke={ink(red)} strokeWidth={w + 1.6} />
      <path d={d} fill="none" stroke={red} strokeWidth={w} />
      <circle cx={x} cy={y + w * 0.2} r={w * 0.9} fill={red} stroke={ink(red)} strokeWidth={w * 0.4} />
      <path d={`M${f1(x + 1 + sway)} ${f1(y + len)} l${f1(-w * 0.8)} ${f1(w * 1.8)} M${f1(x + 1 + sway)} ${f1(y + len)} l0 ${f1(w * 2)} M${f1(x + 1 + sway)} ${f1(y + len)} l${f1(w * 0.8)} ${f1(w * 1.8)}`} stroke={red} strokeWidth={w * 0.5} />
    </g>
  )
}

// ---------- God's people marching round Jericho ----------

const RXP = 218, RYP = 84, PY = 18 // the path round the city, outside its walls (Jericho's local units)
const DT = 0.235 // how far apart the marchers are (an angle round the path)
/** Where the first priest is (an angle round the path) when the march starts: front left, everyone after him round the front. */
export const MARCH_START = 0.93 * Math.PI
/** The walk round: one whole way round the city in this many beats (the game's tune). */
export const LAP_BEATS = 36

type Marcher = { id: string; slot: number } & (
  | { kind: 'priest'; look: Look }
  | { kind: 'box' }
  | { kind: 'person'; look: Look; grandma?: boolean }
  | { kind: 'folk'; i: number; child?: boolean }
)
/** The march: seven priests with seven trumpets, God's special golden box, Joshua, and God's people. */
export const MARCHERS: Marcher[] = [
  ...[0, 1, 2, 3, 4, 0, 1].map((k, i): Marcher => ({ id: `priest${i}`, slot: i, kind: 'priest', look: PRIESTS[k === 0 && i ? 3 : k] })),
  { id: 'box', slot: 7.8, kind: 'box' },
  { id: 'joshua', slot: 9.6, kind: 'person', look: JOSHUA },
  { id: 'dad', slot: 10.6, kind: 'person', look: HEBREWS.dad },
  { id: 'girl', slot: 11.45, kind: 'person', look: HEBREWS.girl },
  { id: 'mom', slot: 12.3, kind: 'person', look: HEBREWS.mom },
  { id: 'boy', slot: 13.15, kind: 'person', look: HEBREWS.boy },
  { id: 'grandpa', slot: 14.05, kind: 'person', look: HEBREWS.grandpa },
  { id: 'grandma', slot: 14.95, kind: 'person', look: HEBREWS.grandma, grandma: true },
  ...[3, 8, 1, 6, 9, 2, 5, 7].map((i, n): Marcher => ({ id: `folk${n}`, slot: 15.9 + n * 0.85, kind: 'folk', i, child: n % 3 === 1 })),
]
const isKid = (m: Marcher) => (m.kind === 'person' && m.look.build === 'child') || (m.kind === 'folk' && !!m.child)

/** One marcher, drawn at their feet (figure units: a grown-up is about 150 tall). */
const MarcherFig = memo(function MarcherFig({ m, facing, up }: { m: Marcher; facing: 'left' | 'right'; up: boolean }) {
  switch (m.kind) {
    case 'priest':
      return <Person x={0} y={0} look={m.look} pose="point" facing={facing} blinkDelay={m.slot * 0.37}><Blowing look={m.look} /></Person>
    case 'box':
      return <BoxCarriers x={0} y={0} facing={facing} />
    case 'person': {
      const pose: Pose = up ? 'arms-up' : 'stand'
      return <Person x={0} y={0} look={m.look} pose={pose} facing={facing} blinkDelay={m.slot * 0.29}>{m.grandma && <SilverHair />}{up && <ShoutMouth beard={!!m.look.beard} />}</Person>
    }
    case 'folk':
      return <Folk x={0} y={0} s={2.15} i={m.i} child={m.child} up={up} />
  }
})

/**
 * God's people marching round Jericho, and the city in the middle (Jericho's local units; place it with x, y, s).
 * `lead`: where the first priest is (an angle round the path); `lift`: how high they all are off the ground
 * this moment (a step on every beat), `hop`: how high the children hop; `blast`: the trumpets sounding (0 to
 * 1); `up`: everyone's arms up, shouting; `fall`, `rahab`: for the city. `taps`: what tapping some of them
 * says, by id; `without`: marchers to leave out.
 */
export function MarchingRound({ x, y, s = 1, lead = MARCH_START, lift = 0, hop = 0, blast = 0, up = false, fall = 0, rahab = false, plain, taps = {}, without = [], k = 0.42 }: {
  x: number; y: number; s?: number; lead?: number; lift?: number; hop?: number; blast?: number; up?: boolean; fall?: number; rahab?: boolean; plain?: boolean
  taps?: Record<string, [string, string]>; without?: string[]
  /** how big a grown-up is (as a Person's s) on the near side */
  k?: number
}) {
  const placed = MARCHERS.filter((m) => !without.includes(m.id)).map((m) => {
    const t = (((lead - m.slot * DT) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    const sn = Math.sin(t)
    return { m, t, near: sn > 0, x: RXP * Math.cos(t), y: PY + RYP * sn, depth: 0.84 + 0.08 * (sn + 1) }
  })
    // (Once the walls start to fall, the ones out of sight behind the city aren't drawn: with the far wall
    // down they'd seem to stand on the roofs. They were hidden a moment before, so nobody vanishes.)
    .filter((p) => !(fall > 0 && !p.near && Math.abs(p.x) < RX + 26))
  const draw = (list: typeof placed) => list.sort((a, b) => a.y - b.y).map(({ m, near, x: px, y: py, depth }) => {
    const facing = near ? 'left' : 'right'
    const sc = k * depth
    const up2 = up && m.kind !== 'priest' && m.kind !== 'box'
    const fig = (
      <g transform={`translate(${f1(px)} ${f1(py - lift - (isKid(m) ? hop : 0))}) scale(${sc.toFixed(3)})`}>
        <MarcherFig m={m} facing={facing} up={up2} />
        {m.kind === 'priest' && blast > 0.02 && <Blast x={facing === 'left' ? -84 : 84} y={-142} o={blast} s={1.25} flip={facing === 'left'} />}
      </g>
    )
    const tap = taps[m.id]
    return tap ? <Tap key={m.id} say={tap[0]} sfx={tap[1]}>{fig}</Tap> : <g key={m.id}>{fig}</g>
  })
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      {/* the path they've worn round the city */}
      <ellipse cx={0} cy={PY} rx={RXP} ry={RYP} fill="none" stroke="#e6d3a2" strokeWidth={22} opacity={0.75} />
      <ellipse cx={0} cy={PY} rx={RXP} ry={RYP} fill="none" stroke="#f1e3bd" strokeWidth={10} opacity={0.6} />
      {draw(placed.filter((p) => !p.near))}
      <Jericho x={0} y={0} fall={fall} rahab={rahab} plain={plain} />
      {draw(placed.filter((p) => p.near))}
    </g>
  )
}

// ---------- A stretch of Jericho's wall, seen straight on ----------

/** Big stones in rows, from x1 to x2, its foot at y and h tall, with merlons along the top. `night`: moonlit. */
export function StoneWall({ x1, x2, y, h, night, merlons = true }: { x1: number; x2: number; y: number; h: number; night?: boolean; merlons?: boolean }) {
  const id = `sw${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const C = night ? NIGHT_W : W
  const rowH = 26, stoneW = 52
  const rows = Math.ceil(h / rowH)
  let joints = ''
  for (let r = 0; r < rows; r++) {
    const yy = y - r * rowH
    if (r) joints += ` M${x1} ${yy} L${x2} ${yy}`
    for (let sx = x1 + (r % 2 ? stoneW / 2 : 0) + stoneW * 0.15 * hash(r); sx < x2; sx += stoneW) joints += ` M${f1(sx)} ${yy} L${f1(sx)} ${f1(Math.max(y - h, yy - rowH))}`
  }
  const top = y - h
  return (
    <g strokeLinejoin="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.light} /><stop offset="1" stopColor={C.face} /></linearGradient>
        <clipPath id={`${id}c`}><rect x={x1} y={top} width={x2 - x1} height={h} /></clipPath>
      </defs>
      {merlons && Array.from({ length: Math.floor((x2 - x1) / 40) + 1 }, (_, i) => x1 + 8 + i * 40).filter((mx) => mx + 22 <= x2 + 1).map((mx) => (
        <rect key={mx} x={mx} y={top - 20} width={24} height={22} rx={2} fill={C.face} stroke={C.line} strokeWidth={2.4} />
      ))}
      <rect x={x1} y={top} width={x2 - x1} height={h} fill={`url(#${id})`} stroke={C.line} strokeWidth={2.6} />
      <path d={joints} stroke={C.mortar} strokeWidth={1.6} fill="none" opacity={0.8} clipPath={`url(#${id}c)`} />
      <rect x={x1} y={top} width={x2 - x1} height={7} fill={C.top} stroke={C.line} strokeWidth={2} />
    </g>
  )
}

/**
 * Rahab's house on the wall, seen from outside the city: its upper room up on top of the wall (a flat roof,
 * a little window), and her window in the wall, with the red cord. (x, y) = the middle of the wall's top
 * under the house. `win`: how far down the wall her window is (the cord hangs from x + 14, from 28 below
 * that); `children`: someone in the window (in the window's own units: its middle at (0, 0), 60 wide and
 * 50 tall).
 */
export function RahabsHouse({ x, y, win = 64, cord = 150, night, children }: { x: number; y: number; win?: number; cord?: number; night?: boolean; children?: ReactNode }) {
  const id = `rw${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const C = night ? NIGHT_W : W
  const wall = night ? '#aaa1c0' : '#f2dfb8', roofC = night ? '#bdb5d0' : '#fbf1da', line = C.line
  const lit = night ? '#ffd970' : '#6b4a2e'
  return (
    <g strokeLinejoin="round">
      {/* the upper room */}
      <rect x={x - 62} y={y - 74} width={124} height={76} fill={wall} stroke={line} strokeWidth={2.6} />
      <rect x={x - 70} y={y - 84} width={140} height={12} rx={2} fill={roofC} stroke={line} strokeWidth={2.4} />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={x - 54 + i * 18} cy={y - 66} r={3} fill="#8a6040" />)}
      <rect x={x - 14} y={y - 54} width={28} height={26} rx={3} fill={lit} stroke={line} strokeWidth={2} />
      {night && <Glow x={x} y={y - 41} r={34} color="#ffd970" />}
      {/* her window in the wall, and the red cord tied to it */}
      <g transform={`translate(${x} ${y + win})`}>
        <defs><clipPath id={id}><rect x={-30} y={-25} width={60} height={50} rx={5} /></clipPath></defs>
        <rect x={-30} y={-25} width={60} height={50} rx={5} fill={lit} />
        {night && <Glow x={0} y={0} r={50} color="#ffd970" />}
        <g clipPath={`url(#${id})`}>{children}</g>
        <rect x={-30} y={-25} width={60} height={50} rx={5} fill="none" stroke="#7a5230" strokeWidth={5} />
        <rect x={-38} y={23} width={76} height={9} rx={3} fill="#a8783f" stroke="#6e4a26" strokeWidth={2} />
        {cord > 0 && <RedCord x={14} y={28} len={cord} w={5} />}
      </g>
    </g>
  )
}

/** A heap of fallen stones from x1 to x2 on the ground at y, about h high. */
export function Rubble({ x1, x2, y, h = 40, night }: { x1: number; x2: number; y: number; h?: number; night?: boolean }) {
  const C = night ? NIGHT_W : W
  const n = Math.max(3, Math.round((x2 - x1) / 30))
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => [x1 + ((x2 - x1) * i) / n, y - h * (0.55 + 0.45 * Math.sin((i / n) * Math.PI)) * (0.85 + 0.3 * hash(i + x1))])
  const mound = `M${x1 - 10} ${y} ${pts.map(([px, py]) => `L${f1(px)} ${f1(py)}`).join(' ')} L${x2 + 10} ${y} Z`
  const stones = Array.from({ length: n * 2 }, (_, i) => {
    const sx = x1 + ((x2 - x1) * (i + 0.5)) / (n * 2)
    const top = y - h * (0.55 + 0.45 * Math.sin(((i + 0.5) / (n * 2)) * Math.PI))
    const sy = top + (h * 0.75) * hash(i * 3.1 + x1)
    return [sx + 8 * (hash(i + 7) - 0.5), Math.min(y - 6, sy), hash(i * 5 + 1)] as const
  })
  return (
    <g strokeLinejoin="round">
      <path d={mound} fill={C.dark} stroke={C.line} strokeWidth={2.4} />
      {stones.map(([sx, sy, r], i) => (
        <rect key={i} x={-13} y={-8} width={26} height={16} rx={4} transform={`translate(${f1(sx)} ${f1(sy)}) rotate(${f1((r - 0.5) * 50)})`} fill={i % 3 ? C.face : C.light} stroke={C.line} strokeWidth={2} />
      ))}
    </g>
  )
}

// ---------- Other things in the story ----------

/**
 * A bundle of long flax stalks lying on its side, tied in the middle: narrow where it's tied and fanning out
 * at the ends, the cut ends on the left and the seed heads on the right. (x, y) = the middle of its bottom;
 * w long, about 2r thick; `a`: turned a little.
 */
export function Flax({ x, y, w = 90, r = 10, a = 0 }: { x: number; y: number; w?: number; r?: number; a?: number }) {
  const e = r + 2, m = r - 2, c = -r // half-thickness at the ends and the middle; its middle line
  const l = -w / 2, rr = w / 2
  const body = `M${l} ${c - e} Q${-w / 4} ${c - m - 1} 0 ${c - m} Q${w / 4} ${c - m - 1} ${rr} ${c - e} Q${rr + 7} ${c} ${rr} ${c + e}`
    + ` Q${w / 4} ${c + m + 1} 0 ${c + m} Q${-w / 4} ${c + m + 1} ${l} ${c + e} Q${l - 3} ${c} ${l} ${c - e} Z`
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${a})`} strokeLinecap="round" strokeLinejoin="round">
      <path d={body} fill="#e2c46e" stroke="#a8843a" strokeWidth={2} />
      {[-0.62, -0.22, 0.2, 0.6].map((k) => (
        <path key={k} d={`M${l + 3} ${f1(c + k * e)} Q${-w / 4} ${f1(c + k * (m + 0.6))} 0 ${f1(c + k * m)} Q${w / 4} ${f1(c + k * (m + 0.6))} ${rr - 3} ${f1(c + k * e)}`} stroke="#c09a44" strokeWidth={1.3} fill="none" opacity={0.85} />
      ))}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((k, i) => <circle key={k} cx={rr + 1 + (i % 2) * 2.5} cy={c + k * e} r={2.4} fill="#c9a24a" stroke="#a8843a" strokeWidth={1} />)}
      <rect x={-4} y={c - m - 2} width={8} height={2 * m + 4} rx={2.5} fill="#9a6b3e" stroke="#6e4a26" strokeWidth={1.4} />
    </g>
  )
}

/** Lines scratched in the sand to count with, side by side (little grooves, with the sand pushed up beside them). `count`: tapping them counts them aloud. */
export function TallyMarks({ x, y, n, count, s = 1 }: { x: number; y: number; n: number; count?: string; s?: number }) {
  return (
    <g>
      <ellipse cx={x + ((n - 1) * 17 * s) / 2 + 2 * s} cy={y - 4 * s} rx={((n - 1) * 17 * s) / 2 + 16 * s} ry={9 * s} fill="#f3e2b8" opacity={0.7} />
      {Array.from({ length: n }, (_, i) => {
        const mx = x + i * 17 * s
        const mark = (
          <g strokeLinecap="round">
            <path d={`M${f1(mx)} ${f1(y - 11 * s)} L${f1(mx + 2.5 * s)} ${f1(y)}`} stroke="#9a7a46" strokeWidth={3.6 * s} />
            <path d={`M${f1(mx + 2.8 * s)} ${f1(y - 10.5 * s)} L${f1(mx + 5.2 * s)} ${f1(y + 0.5 * s)}`} stroke="#fffaf0" strokeWidth={1.8 * s} opacity={0.9} />
          </g>
        )
        return count
          ? <Tap key={i} count={count} sfx="pop"><g>{mark}<rect x={mx - 7 * s} y={y - 20 * s} width={17 * s} height={28 * s} fill="#000" opacity={0} /></g></Tap>
          : <g key={i}>{mark}</g>
      })}
    </g>
  )
}

/** A stick held in the right hand (pose "point"), its end down in the sand (figure units). */
const Stick = ({ skin }: { skin: string }) => (
  <g>
    <path d="M50 -96 L80 -2" stroke="#8a5a2e" strokeWidth={5} strokeLinecap="round" />
    <Grip x={54} y={-90} skin={skin} />
  </g>
)

/** The Jordan valley far away: lilac mountains along the horizon at y, and a nearer line of olive hills. */
export function FarHills({ y, near = '#c9cf92' }: { y: number; near?: string }) {
  return (
    <g>
      <path d={`M-10 ${y} L-10 ${y - 30} Q60 ${y - 62} 130 ${y - 40} Q200 ${y - 78} 290 ${y - 46} Q360 ${y - 70} 430 ${y - 44} Q520 ${y - 84} 610 ${y - 50} Q690 ${y - 72} 810 ${y - 42} L810 ${y} Z`} fill="#d3c1dc" />
      <path d={`M-10 ${y + 6} Q120 ${y - 22} 260 ${y - 6} Q420 ${y - 30} 560 ${y - 8} Q690 ${y - 26} 810 ${y - 6} L810 ${y + 30} L-10 ${y + 30} Z`} fill={near} />
    </g>
  )
}

/** The plain round Jericho: soft grass from the horizon at y to the bottom of the picture. */
export function Plain({ y, color = '#d2d88f', near = '#bccf74' }: { y: number; color?: string; near?: string }) {
  return (
    <g>
      <path d={`M-10 ${y} Q200 ${y - 10} 400 ${y} T810 ${y} L810 460 L-10 460 Z`} fill={color} />
      <path d={`M-10 ${y + 110} Q240 ${y + 90} 470 ${y + 112} T810 ${y + 100} L810 460 L-10 460 Z`} fill={near} />
    </g>
  )
}

/** Little tufts of grass, at [x, y] spots. */
export const Tufts = ({ spots, color = '#8fae4e' }: { spots: Pt[]; color?: string }) => (
  <g stroke={color} strokeWidth={3} fill="none" strokeLinecap="round">
    {spots.map(([x, y]) => <path key={`${x},${y}`} d={`M${x} ${y} l-5 -11 M${x + 5} ${y} l1 -14 M${x + 10} ${y} l6 -10`} />)}
  </g>
)

/** The Jordan River flowing across the picture between y1 and y2, with reeds along its banks. */
function JordanRiver({ y1, y2 }: { y1: number; y2: number }) {
  const mid = (y1 + y2) / 2
  return (
    <g>
      <path d={`M-10 ${y1} Q200 ${y1 - 6} 400 ${y1} T810 ${y1 - 2} L810 ${y2} Q600 ${y2 + 6} 400 ${y2} T-10 ${y2 + 4} Z`} fill="#62b3e0" />
      <path d={`M-10 ${mid} Q200 ${mid - 8} 400 ${mid} T810 ${mid} L810 ${y2} Q600 ${y2 + 6} 400 ${y2} T-10 ${y2 + 4} Z`} fill="#4f9fd2" opacity={0.7} />
      {[[60, mid - 6], [210, mid + 8], [380, mid - 4], [540, mid + 9], [700, mid - 5]].map(([wx, wy], i) => (
        <path key={i} className="sc-wave" d={`M${wx} ${wy} q12 -7 24 0 q12 7 24 0`} stroke="#ffffff" strokeWidth={2.6} fill="none" opacity={0.75} strokeLinecap="round" />
      ))}
    </g>
  )
}

/** A clump of reeds at the water's edge. */
const ReedClump = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round" fill="none">
    <path d="M0 0 Q-6 -24 -12 -44 M4 0 Q4 -28 2 -54 M8 0 Q14 -22 22 -38" stroke="#5f9a4a" strokeWidth={4} />
    <path d="M-12 -44 l-1 -9 M2 -54 l0 -10" stroke="#9a6b3e" strokeWidth={5} />
  </g>
)

/** A soft cloud of God's light shining down on someone (light, never a person): rays from above, and sparkles. */
function GodsLight({ x, y, r = 520, spots }: { x: number; y: number; r?: number; spots?: [number, number, number?][] }) {
  return (
    <g>
      <Rays x={x} y={y} r={r} n={16} color="#fff6c0" opacity={0.3} />
      <Glow x={x} y={y + 40} r={170} color="#fff3b8" />
      {spots && <Sparkles spots={spots} />}
    </g>
  )
}

// ---------- The pages: part one ----------

// 1. "When Moses was very old, he died. God chose Joshua to lead His people. God said, 'Be strong and brave!
// I will be with you wherever you go.'" Joshua in God's light at the camp by the Jordan, God's people round him.
function Page1() {
  return (
    <Scene sky="day" ground="none">
      <FarHills y={262} />
      <FarCamp y={268} s={0.24} xs={[30, 110, 190, 560, 640, 720, 790]} />
      <Plain y={268} />
      <GodsLight x={330} y={-30} spots={[[268, 150, 9], [392, 128, 7], [300, 96, 6], [380, 196, 8]]} />
      {[[150, 312, 1], [182, 316, 4], [214, 312, 8], [470, 310, 6], [500, 314, 3]].map(([fx, fy, i]) => <Folk key={fx} x={fx} y={fy} s={0.62} i={i} child={i === 4} wave={i % 2 === 0} />)}
      <Tap say="Our tent is ready, right by the river!" sfx="pop">
        <CampTent x={640} y={346} s={0.56} />
      </Tap>
      <Tap say="Hooray! Joshua is our new leader!" sfx="good">
        <Person x={500} y={424} s={0.78} look={HEBREWS.dad} pose="wave" blinkDelay={0.5} />
        <Person x={574} y={430} s={0.78} look={HEBREWS.girl} pose="arms-up" blinkDelay={1.6} />
        <Person x={646} y={424} s={0.78} look={HEBREWS.mom} pose="stand" blinkDelay={2.3} />
        <Person x={722} y={430} s={0.78} look={HEBREWS.boy} pose="wave" blinkDelay={0.9} />
      </Tap>
      <Tap say="Maa! I will follow Joshua, too." sfx="pop">
        <Goat x={120} y={430} s={0.9} facing="right" />
      </Tap>
      <Tap say="God is with me! I will be strong and brave." sfx="sparkle">
        <Person x={330} y={420} s={1.02} look={JOSHUA} pose="pray" />
      </Tap>
      <Tufts spots={[[40, 446], [230, 440], [420, 448], [780, 444]]} />
    </Scene>
  )
}

// 2. "Across the Jordan River was a city called Jericho. It had great big, strong walls all the way around.
// Joshua sent two men to go and look at it." Jericho across the river; Joshua sends the two men off.
function Page2() {
  return (
    <Scene sky="day" ground="none">
      <FarHills y={206} near="#cdd394" />
      <path d="M-10 210 Q200 196 400 206 T810 202 L810 300 L-10 300 Z" fill="#cfd68e" />
      <Palm x={360} y={244} s={0.5} />
      <Palm x={746} y={236} s={0.46} />
      <Tap say="Look at those great big, strong walls!" sfx="wobble">
        <Jericho x={560} y={226} s={0.68} cord={false} />
      </Tap>
      <Palm x={420} y={262} s={0.56} />
      <Tap say="Splash, splash! The Jordan River." sfx="splash">
        <JordanRiver y1={286} y2={334} />
      </Tap>
      <path d="M-10 332 Q200 322 400 334 T810 330 L810 460 L-10 460 Z" fill="#d9cf98" />
      <path d="M-10 400 Q240 382 470 402 T810 392 L810 460 L-10 460 Z" fill="#cbc486" />
      {[[30, 338], [150, 336], [520, 338], [650, 334], [770, 337]].map(([rx, ry], i) => <ReedClump key={i} x={rx} y={ry} s={0.8} />)}
      <Tap say="Go and look at the city, and come back safe." sfx="good">
        <Person x={170} y={426} s={0.9} look={JOSHUA} pose="point" />
      </Tap>
      <Tap say="Goodbye, Joshua! We will be back soon." sfx="pop">
        <Person x={420} y={424} s={0.84} look={SPIES[0]} pose="wave" blinkDelay={1.1} />
        <Person x={510} y={428} s={0.84} look={SPIES[1]} pose="stand" holding="stick" blinkDelay={2.2} />
      </Tap>
      <Tufts spots={[[60, 446], [300, 444], [640, 448], [760, 440]]} />
    </Scene>
  )
}

// 3. "In Jericho lived a kind woman named Rahab. Her house was built right into the big wall! She hid the
// two men up on her roof, to keep them safe." Up on her flat roof, which is part of the city wall (its
// merlons and a tower right behind, and the land outside far below): the two men peeking out from behind
// the flax drying there, and Rahab bringing one more bundle to hide them.
function Page3() {
  const para = 262, roofBack = 304, roofFront = 404
  return (
    <Scene sky="day" ground="none">
      {/* outside the city, far below: the plain, the Jordan River, and the tents of God's people far away */}
      <FarHills y={212} />
      <path d="M-10 214 Q200 204 400 212 T810 210 L810 310 L-10 310 Z" fill="#cdd394" />
      <path d="M-10 240 Q160 232 330 240 T660 236 T810 240" stroke="#62b3e0" strokeWidth={7} fill="none" strokeLinecap="round" />
      <FarCamp y={236} s={0.11} xs={[470, 505, 540, 575, 610]} />
      {/* the top of the big city wall, all along behind her roof, and one of its towers */}
      <StoneWall x1={-10} x2={700} y={roofBack + 4} h={roofBack + 4 - para} />
      <Tap say="Rahab's house is part of the big wall!" sfx="wobble">
        <StoneWall x1={692} x2={810} y={roofBack + 4} h={roofBack + 4 - 172} />
      </Tap>
      {/* her flat roof, and the front of her house going down below it */}
      <rect x={-10} y={roofBack} width={820} height={roofFront - roofBack} fill="#efdcb2" />
      <path d={`M-10 ${roofBack + 1} L810 ${roofBack + 1}`} stroke="#c9a46a" strokeWidth={3} />
      {[[40, 336], [236, 388], [590, 330], [700, 384], [170, 330]].map(([cx, cy], i) => <path key={i} d={`M${cx} ${cy} q14 -4 28 0`} stroke="#dcc493" strokeWidth={2.4} fill="none" strokeLinecap="round" />)}
      <rect x={-10} y={roofFront} width={820} height={12} fill="#f7ead0" stroke="#c9a46a" strokeWidth={2} />
      <rect x={-10} y={roofFront + 12} width={820} height={40} fill="#e6cf9f" />
      {/* the way up: a square hole in the roof with the top of a ladder, and a water jar */}
      <path d="M56 362 L134 362 L142 394 L48 394 Z" fill="#5a3f2a" stroke="#a37a46" strokeWidth={2.4} strokeLinejoin="round" />
      <g stroke="#8a5a2e" strokeLinecap="round">
        <path d="M70 394 L76 318 M120 394 L114 318" strokeWidth={6} />
        <path d="M74 336 L116 336 M73 354 L117 354 M72 372 L118 372" strokeWidth={4.5} />
      </g>
      <path d="M166 392 L162 372 Q154 362 160 352 L166 346 L178 346 L184 352 Q190 362 182 372 L178 392 Z" fill="#d9875a" stroke="#9a5634" strokeWidth={2} strokeLinejoin="round" />
      {/* flax laid out to dry */}
      <Flax x={254} y={356} w={98} r={9} a={-3} />
      <Flax x={262} y={384} w={104} r={10} a={2} />
      {/* the two men, behind the pile of flax, and the pile */}
      <Tap say="Thank you, Rahab! You are so kind." sfx="pop">
        <Person x={392} y={384} s={0.64} look={SPIES[0]} pose="stand" blinkDelay={0.4} />
        <Person x={458} y={386} s={0.64} look={SPIES[1]} pose="stand" blinkDelay={1.7} />
      </Tap>
      <Tap say="A great hiding place, under the flax!" sfx="swish">
        <Flax x={364} y={398} w={96} r={11} a={-2} />
        <Flax x={444} y={400} w={100} r={11} a={2} />
        <Flax x={520} y={396} w={82} r={10} a={-3} />
        <Flax x={398} y={378} w={100} r={11} a={-2} />
        <Flax x={474} y={380} w={96} r={11} a={3} />
        <Flax x={436} y={360} w={92} r={10} a={-4} />
      </Tap>
      <Tap say="Shh! Hide here, under the flax. You will be safe." sfx="sparkle">
        <Person x={624} y={398} s={0.8} look={RAHAB} pose="hold" facing="left">
          <Flax x={0} y={-50} w={86} r={8} a={4} />
          <Grip x={-8} y={-60} skin={RAHAB.skin} /><Grip x={8} y={-60} skin={RAHAB.skin} />
        </Person>
      </Tap>
    </Scene>
  )
}

// 4. "Rahab said, 'I know your God is the real God. Please keep my family safe!' The men said, 'Tie this red
// cord in your window, and everyone in your house will be safe.'" Night, outside the wall: Rahab at her
// window, the red cord hanging from it down the wall, and the two men at the foot of the wall, one still
// holding the cord.
function Page4() {
  const top = 168, ground = 382, hx = 300, win = 70
  const cordX = hx + 14, cordTop = top + win + 28
  return (
    <Scene sky="night" ground="none" moon>
      <path d="M520 300 Q600 230 690 262 Q760 238 810 252 L810 400 L520 400 Z" fill="#3f3a74" />
      <path d={`M-10 ${ground} L810 ${ground} L810 460 L-10 460 Z`} fill="#5d5584" />
      <StoneWall x1={-10} x2={560} y={ground} h={ground - top} night />
      <Tap say="I know your God is the real God. Please keep my family safe!" sfx="sparkle">
        <RahabsHouse x={hx} y={top} win={win} night cord={ground - cordTop}>
          <Person x={0} y={62} s={0.6} look={RAHAB} pose="wave" />
        </RahabsHouse>
      </Tap>
      <Tap say="A red cord, tied in the window. That is the sign!" sfx="ding">
        <rect x={cordX - 12} y={cordTop} width={26} height={ground - cordTop} fill="#000" opacity={0} />
      </Tap>
      <Tap say="We promise! Everyone in your house will be safe." sfx="pop">
        <Person x={cordX - 54 * 0.72} y={436} s={0.72} look={SPIES[0]} pose="point" blinkDelay={0.6} />
        <Person x={hx + 150} y={438} s={0.72} look={SPIES[1]} pose="wave" blinkDelay={1.8} />
      </Tap>
    </Scene>
  )
}

/** The Jordan's water stopped by God, standing up in a heap upstream: a tall, rounded wall of water at the left, its face sloping down to the dry riverbed. */
function WaterHeap({ top = 150, foot = 372 }: { top?: number; foot?: number }) {
  const id = `wh${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const d = `M-10 ${foot} L-10 ${top + 30} Q20 ${top - 6} 70 ${top} Q118 ${top + 8} 138 ${top + 52} Q152 ${top + 110} 168 ${foot - 40} Q178 ${foot - 10} 204 ${foot} Z`
  const foam: Pt[] = [[-6, top + 26], [12, top + 12], [32, top + 3], [54, top], [76, top + 1], [98, top + 7], [116, top + 18], [130, top + 34]]
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8e6fa" /><stop offset="0.45" stopColor="#5bbcee" /><stop offset="1" stopColor="#2f86cf" /></linearGradient>
        <clipPath id={`${id}c`}><path d={d} /></clipPath>
      </defs>
      <Glow x={80} y={top + 90} r={160} color="#e8f8ff" />
      <path d={d} fill={`url(#${id})`} stroke="#2f74b4" strokeWidth={3} strokeLinejoin="round" />
      <g clipPath={`url(#${id}c)`} fill="none" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round">
        {[top + 50, top + 90, top + 130, top + 170].map((y, i) => <path key={y} d={`M${-20 + (i % 2) * 18} ${y} q20 -6 40 0 t40 0 t40 0 t40 0 t40 0`} />)}
        <path d={`M150 ${top + 60} Q164 ${top + 130} 190 ${foot}`} strokeOpacity={0.45} strokeWidth={5} />
      </g>
      {foam.map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy + 2} r={i % 2 ? 6 : 7.5} fill="#ffffff" stroke="#b5e2f7" strokeWidth={2} />)}
      <Sparkles spots={[[40, top - 20, 7], [110, top - 6, 6], [16, top + 60, 5], [96, top + 70, 6]]} color="#ffffff" />
    </g>
  )
}

// 5. "Then God's people came to the Jordan River. When the priests carried God's special golden box into the
// water, God stopped the river! Everyone walked across on dry ground." The riverbed, dry between its banks,
// the water standing up in a heap upstream, the priests standing in the middle with the golden box, and
// God's people walking across.
function Page5() {
  const far = 262, near = 372
  return (
    <Scene sky="day" ground="none">
      <FarHills y={204} />
      <path d="M-10 206 Q200 194 400 204 T810 200 L810 272 L-10 272 Z" fill="#cdd394" />
      <Palm x={556} y={236} s={0.4} />
      <Jericho x={686} y={218} s={0.42} plain />
      {/* the riverbed, dry, between its two grassy banks, with ripples in the sand and pebbles */}
      <path d={`M-10 ${far} Q300 ${far - 8} 500 ${far + 2} T810 ${far - 4} L810 ${near} Q560 ${near - 10} 360 ${near + 2} T-10 ${near - 4} Z`} fill="#e6cd99" />
      <g stroke="#d1b37a" strokeWidth={2.4} fill="none" strokeLinecap="round">
        {[[230, 290], [520, 286], [660, 306], [250, 340], [470, 352], [700, 346], [330, 312]].map(([rx, ry]) => <path key={`${rx}${ry}`} d={`M${rx} ${ry} q10 -5 20 0 t20 0 t20 0`} />)}
      </g>
      {[[300, 300], [610, 330], [740, 318], [430, 296], [520, 360], [212, 362]].map(([px, py], i) => (
        <ellipse key={i} cx={px} cy={py} rx={8 - (i % 3) * 2} ry={4.6} fill="#cdb27c" stroke="#ab8c55" strokeWidth={1.4} />
      ))}
      <path d={`M190 ${far - 1} Q300 ${far - 9} 500 ${far + 1} T810 ${far - 5}`} stroke="#a7b866" strokeWidth={5} fill="none" />
      {[[240, far], [470, far + 2], [780, far - 3]].map(([rx, ry], i) => <ReedClump key={i} x={rx} y={ry} s={0.55} />)}
      <Tap say="Look! God stopped the river. The water stood up in a heap!" sfx="splash">
        <WaterHeap />
      </Tap>
      {/* God's people already over, on the far bank */}
      <Folk x={560} y={262} s={0.62} i={2} up />
      <Folk x={592} y={260} s={0.6} i={5} child up />
      <Folk x={620} y={262} s={0.62} i={7} wave />
      <Folk x={330} y={264} s={0.6} i={4} wave />
      <Tap say="God's special golden box! God is with us." sfx="sparkle">
        <BoxCarriers x={410} y={334} s={0.6} />
      </Tap>
      <Tap say="Dry ground! Our feet are not even wet." sfx="good">
        <Person x={572} y={354} s={0.64} look={HEBREWS.dad} pose="wave" blinkDelay={0.3} />
        <Person x={628} y={358} s={0.64} look={HEBREWS.girl} pose="arms-up" blinkDelay={1.2} />
        <Person x={686} y={354} s={0.64} look={HEBREWS.mom} pose="stand" blinkDelay={2.1} />
      </Tap>
      {/* the near bank */}
      <path d={`M-10 ${near - 4} Q160 ${near + 4} 360 ${near + 2} T810 ${near} L810 460 L-10 460 Z`} fill="#d3cb90" />
      <path d={`M-10 ${near - 4} Q160 ${near + 4} 360 ${near + 2} T810 ${near}`} stroke="#a7b866" strokeWidth={5} fill="none" />
      {[[214, near + 2], [520, near + 1], [760, near + 1]].map(([rx, ry], i) => <ReedClump key={i} x={rx} y={ry} s={0.7} />)}
      <Tap say="Maa! Dry ground for me, too." sfx="pop">
        <Goat x={150} y={432} s={0.84} facing="right" />
      </Tap>
      <Person x={300} y={436} s={0.74} look={HEBREWS.grandpa} pose="stand" holding="stick" blinkDelay={0.8} />
      <Person x={364} y={438} s={0.74} look={HEBREWS.boy} pose="wave" blinkDelay={1.5} />
      <Tufts spots={[[60, 446], [470, 448], [700, 444]]} />
    </Scene>
  )
}

// 6. "God gave Joshua a strange plan. 'March around Jericho once a day for six days. The priests will blow
// trumpets made from rams' horns. Everyone else must be very quiet.'" Joshua in God's light, listening;
// priests with their trumpets; Jericho behind.
function Page6() {
  return (
    <Scene sky="day" ground="none">
      <FarHills y={232} />
      <Plain y={252} />
      <Palm x={392} y={262} s={0.48} />
      <Tap say="Round and round the city, one time each day!" sfx="wobble">
        <ellipse cx={580} cy={272} rx={RXP * 0.76} ry={RYP * 0.76} fill="none" stroke="#e6d3a2" strokeWidth={10} opacity={0.6} />
        <Jericho x={580} y={258} s={0.76} />
        <path d={`M${f1(580 - RXP * 0.76)} 272 A${f1(RXP * 0.76)} ${f1(RYP * 0.76)} 0 0 0 ${f1(580 + RXP * 0.76)} 272`} fill="none" stroke="#ffffff" strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" />
      </Tap>
      <Palm x={760} y={276} s={0.54} />
      <GodsLight x={190} y={-30} spots={[[130, 150, 8], [250, 120, 7], [196, 84, 6]]} />
      <Tap say="A strange plan! But God's plans are always good." sfx="sparkle">
        <Person x={190} y={420} s={0.98} look={JOSHUA} pose="pray" />
      </Tap>
      <Tap say="Toot, toot! We will blow our trumpets." sfx="ding">
        <Person x={384} y={428} s={0.8} look={PRIESTS[0]} pose="point" blinkDelay={0.4}><Blowing look={PRIESTS[0]} /></Person>
        <Person x={470} y={432} s={0.8} look={PRIESTS[1]} pose="hold" blinkDelay={1.4}><HeldHorn look={PRIESTS[1]} /></Person>
      </Tap>
      <Tap say="Shh! We will be very, very quiet." sfx="pop">
        <Person x={620} y={432} s={0.78} look={HEBREWS.mom} pose="stand" blinkDelay={2.1} />
        <Person x={690} y={436} s={0.78} look={HEBREWS.girl} pose="stand" blinkDelay={0.9} />
      </Tap>
      <Tufts spots={[[40, 446], [290, 444], [560, 448], [780, 440]]} />
    </Scene>
  )
}

// ---------- The pages: part two ----------

// 7. "Remember God's strange plan? Joshua and God's people did just what God said. They marched around
// Jericho one time. Toot, toot went the trumpets! Nobody else made a sound."
function Page7() {
  return (
    <Scene sky="day" ground="none">
      <FarHills y={200} />
      <Plain y={214} />
      <Palm x={60} y={300} s={0.62} />
      <Palm x={740} y={292} s={0.58} />
      <MarchingRound x={400} y={262} s={1.1} lead={MARCH_START + 0.12} blast={1}
        taps={{
          priest2: ['Toot, toot! We blow our trumpets, just like God said.', 'ding'],
          box: ["God's special golden box goes too.", 'sparkle'],
          joshua: ['Shh! Keep marching.', 'pop'],
          girl: ['Shh! I am being very quiet.', 'pop'],
        }} />
      <Tufts spots={[[30, 446], [200, 444], [610, 448], [780, 440]]} />
    </Scene>
  )
}

// 8. "The next day, they did it again. And the next day, and the next! Day after day, for six days, they
// marched around the city, just like God said." Evening at the camp: the boy has scratched one line in the
// sand for each day, six lines; the march comes home from Jericho in the sunset.
function Page8() {
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <Sparkles spots={[[90, 60, 6], [250, 34, 5], [690, 50, 6], [760, 120, 4]]} color="#fff8d0" />
      <Glow x={470} y={200} r={230} color="#ffd9a0" />
      <circle cx={470} cy={206} r={40} fill="#ffcf6a" stroke="#f5a83a" strokeWidth={3} />
      <path d="M-10 236 Q120 214 240 230 Q380 210 520 228 Q660 212 810 230 L810 260 L-10 260 Z" fill="#b6889e" />
      <path d="M-10 250 Q200 238 400 248 T810 246 L810 460 L-10 460 Z" fill="#c9b27e" />
      <Tap say="Goodnight, sun! Goodnight, Jericho!" sfx="sparkle">
        <Jericho x={430} y={252} s={0.5} plain />
      </Tap>
      {/* the march coming home along the path */}
      <path d="M520 268 Q600 300 640 340" stroke="#e2cc98" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.8} />
      {[[540, 280, 0], [560, 290, 4], [580, 302, 7], [598, 314, 2], [614, 326, 9]].map(([fx, fy, i]) => <Folk key={fx} x={fx} y={fy} s={0.4} i={i} />)}
      <path d="M-10 330 Q240 316 470 334 T810 326 L810 460 L-10 460 Z" fill="#d8c48e" />
      <Tap say="Home again! We obeyed God today." sfx="pop">
        <CampTent x={688} y={392} s={0.56} />
      </Tap>
      <Tap say="Well done, everyone. You obeyed God, day after day!" sfx="good">
        <Person x={520} y={430} s={0.84} look={JOSHUA} pose="wave" />
      </Tap>
      <Tap say="Six days! One line in the sand for every day." sfx="pop">
        <Person x={150} y={432} s={0.86} look={HEBREWS.boy} pose="point" blinkDelay={0.5}><Stick skin={HEBREWS.boy.skin} /></Person>
        <Person x={86} y={436} s={0.86} look={HEBREWS.girl} pose="arms-up" blinkDelay={1.4} />
      </Tap>
      <TallyMarks x={206} y={434} n={6} count="days" s={1.1} />
    </Scene>
  )
}

// 9. "On the seventh day, they marched around Jericho seven times! Then the priests blew their trumpets, and
// Joshua said, 'Shout! God has given you the city!'"
function Page9() {
  return (
    <Scene sky="dawn" ground="none">
      <FarHills y={186} />
      <Plain y={200} />
      <MarchingRound x={470} y={230} s={0.92} lead={MARCH_START + 0.3} blast={1} without={['joshua']}
        taps={{
          priest3: ['Toooot! Toooot!', 'ding'],
        }} />
      <Tap say="Shout! God has given you the city!" sfx="good">
        <Person x={130} y={430} s={0.98} look={JOSHUA} pose="arms-up"><ShoutMouth beard /></Person>
      </Tap>
      <Tap say="Seven lines, for seven times around!" sfx="pop">
        <Person x={244} y={438} s={0.82} look={HEBREWS.boy} pose="point" blinkDelay={0.5}><Stick skin={HEBREWS.boy.skin} /></Person>
      </Tap>
      <TallyMarks x={300} y={440} n={7} count="times" s={0.9} />
      <Tap say="We are ready to shout!" sfx="pop">
        {[[650, 432, 3], [700, 436, 6], [752, 432, 9]].map(([fx, fy, i]) => <Folk key={fx} x={fx} y={fy} s={1.15} i={i} child={i === 6} wave />)}
      </Tap>
    </Scene>
  )
}

// 10. "So everybody shouted, as loud as they could. And the great big walls came tumbling down, flat on the
// ground! Crash!" The walls falling in a cloud of dust, all but Rahab's stretch; everyone cheering.
function Page10() {
  return (
    <Scene sky="day" ground="none">
      <Rays x={400} y={150} r={640} n={18} color="#fff6c0" opacity={0.32} />
      <FarHills y={200} />
      <Plain y={214} />
      <Tap say="Crash! Down came the great big walls!" sfx="whoosh">
        <MarchingRound x={400} y={262} s={1.1} lead={MARCH_START + 0.12} up fall={0.55} rahab
          taps={{ girl: ['Hooray! God did it!', 'good'], dad: ['Hooray!', 'good'], box: ['God is so strong!', 'sparkle'] }} />
      </Tap>
      <Tufts spots={[[30, 446], [200, 444], [610, 448], [780, 440]]} />
    </Scene>
  )
}

// 11. "But Rahab's house, with the red cord in the window, was safe. The two men brought Rahab and all her
// family out, safe and sound, just as they promised." Her stretch of wall still standing among the fallen
// stones, the red cord in the window; the two men leading Rahab and her father, mother, brother and sister
// out, toward the tents of God's people.
function Page11() {
  const top = 150, ground = 360, hx = 186, win = 66
  return (
    <Scene sky="day" ground="none">
      <FarHills y={248} />
      <path d={`M-10 250 Q200 240 400 250 T810 246 L810 ${ground + 6} L-10 ${ground + 6} Z`} fill="#cdd394" />
      <FarCamp y={296} s={0.2} xs={[600, 650, 700, 750, 800]} />
      <path d={`M-10 ${ground} L810 ${ground} L810 460 L-10 460 Z`} fill="#e3cc94" />
      <path d={`M-10 ${ground + 70} Q260 ${ground + 56} 520 ${ground + 72} T810 ${ground + 64} L810 460 L-10 460 Z`} fill="#d9c088" />
      <Rubble x1={-10} x2={88} y={ground} h={56} />
      <StoneWall x1={88} x2={284} y={ground} h={ground - top} />
      <Tap say="The red cord is still in the window. Rahab's house was safe!" sfx="ding">
        <RahabsHouse x={hx} y={top} win={win} cord={ground - top - win - 28} />
      </Tap>
      <Rubble x1={284} x2={560} y={ground} h={50} />
      <Tap say="We are all safe and sound!" sfx="good">
        <Person x={268} y={396} s={0.62} look={RAHAB_FAMILY[2]} pose="wave" blinkDelay={0.9} />
        <Person x={334} y={404} s={0.66} look={RAHAB_FAMILY[3]} pose="arms-up" blinkDelay={2.2} />
        <Person x={410} y={414} s={0.7} look={RAHAB_FAMILY[0]} pose="stand" holding="stick" blinkDelay={0.4} />
        <Person x={490} y={424} s={0.74} look={RAHAB_FAMILY[1]} pose="wave" blinkDelay={1.3} />
      </Tap>
      <Tap say="Thank you for keeping your promise!" sfx="sparkle">
        <Person x={578} y={432} s={0.8} look={RAHAB} pose="wave" />
      </Tap>
      <Tap say="This way! A promise is a promise." sfx="pop">
        <Person x={668} y={436} s={0.82} look={SPIES[0]} pose="point" blinkDelay={0.7} />
        <Person x={752} y={440} s={0.82} look={SPIES[1]} pose="wave" blinkDelay={1.6} />
      </Tap>
    </Scene>
  )
}

// 12. "Everyone thanked God. God was with Joshua, just as He promised. God always keeps His promises, and He is
// with you, too!" Everyone together in God's light, thanking Him: God's people, the priests with their
// trumpets, Joshua, and Rahab and her family; Jericho's walls flat behind them.
function Page12() {
  return (
    <Scene sky="glory" ground="none">
      <Rays x={400} y={-40} r={660} n={18} color="#fff6c0" opacity={0.42} />
      <FarHills y={232} />
      <Plain y={250} />
      <FarCamp y={262} s={0.2} xs={[40, 92, 144]} />
      <Jericho x={646} y={270} s={0.42} plain fall={1} />
      <Tap say="God always keeps His promises!" sfx="sparkle">
        <Glow x={400} y={92} r={140} color="#fff3b8" />
        <Heart x={400} y={104} s={1.5} />
        <Notes spots={[[300, 150, '#e8668a'], [500, 140, '#5f8fd0'], [352, 82], [452, 70, '#2fa59a']]} />
      </Tap>
      {[[150, 0], [196, 6], [244, 8], [500, 3], [548, 9], [596, 1]].map(([fx, i], n) => <Folk key={fx} x={fx} y={318 + (n % 2) * 4} s={0.56} i={i} child={n % 3 === 1} up />)}
      <Person x={322} y={388} s={0.62} look={PRIESTS[0]} pose="point" facing="left" blinkDelay={0.6}><Blowing look={PRIESTS[0]} /></Person>
      <Person x={476} y={388} s={0.62} look={PRIESTS[1]} pose="point" blinkDelay={1.6}><Blowing look={PRIESTS[1]} /></Person>
      <Tap say="Thank You, God! You were with us, just as You promised." sfx="good">
        <Person x={400} y={436} s={0.92} look={JOSHUA} pose="arms-up" />
      </Tap>
      <Tap say="Hooray! Thank You, God!" sfx="good">
        <Person x={46} y={432} s={0.76} look={HEBREWS.boy} pose="arms-up" blinkDelay={0.8} />
        <Person x={112} y={428} s={0.76} look={HEBREWS.mom} pose="pray" blinkDelay={2.0} />
        <Person x={182} y={432} s={0.76} look={HEBREWS.girl} pose="arms-up" blinkDelay={1.3} />
        <Person x={254} y={430} s={0.76} look={HEBREWS.dad} pose="arms-up" blinkDelay={0.4} />
      </Tap>
      <Tap say="Thank You, God, for keeping my family safe!" sfx="sparkle">
        <Person x={548} y={432} s={0.8} look={RAHAB} pose="pray" />
        <Person x={618} y={430} s={0.76} look={RAHAB_FAMILY[1]} pose="arms-up" blinkDelay={1.1} />
        <Person x={688} y={432} s={0.76} look={RAHAB_FAMILY[0]} pose="arms-up" blinkDelay={0.3} />
        <Person x={756} y={434} s={0.76} look={RAHAB_FAMILY[3]} pose="wave" blinkDelay={1.9} />
      </Tap>
    </Scene>
  )
}

export const JERICHO_ART = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11, Page12]
