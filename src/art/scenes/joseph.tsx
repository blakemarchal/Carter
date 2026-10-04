// Joseph's Coat: one picture per story page, both parts in order (see data/joseph.ts for the words).
// Built from the kit (./kit.tsx) and people (../people.tsx). God is never drawn as a person: His
// presence is light.
//
// The people here need a few things the shared Person can't draw yet, so `Figure` below is Person
// (the same body, face and proportions) plus: Joseph's coat of many colors (`coat` stripes on the robe
// and sleeves), faces for feelings (`mood`: grumpy brothers, a surprised Pharaoh, happy tears), crossed
// arms and hugs (`pose`, `reach`), kneeling (`kneel`), Egyptian dress (`collar`, `band`, `nemes`,
// `pleats`), and someone lying asleep (`Sleeper`). When people.tsx gains these, Figure can become Person.
import { useId, type CSSProperties, type ComponentType, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { SKIN, type Look } from '../people'
import { Basket, Glow, Moon, Palm, Rays, Scene, Sheep, Sparkles, Tap, sparkle } from './kit'

// ---------- The people ----------

type Pt = [number, number]

/**
 * Person's poses, and: `open` (arms out, welcoming), `cross` (arms crossed, grumpy), `hug` / `hug-right`
 * (both arms, or the right, out at the shoulders, round whoever stands beside; `reach` sets where the
 * hands go), `carry` (a hand up at the shoulder, steadying a sack), `present` (holding something up in
 * front by its top corners).
 */
export type JPose = 'stand' | 'wave' | 'pray' | 'arms-up' | 'hold' | 'point' | 'open' | 'cross' | 'hug' | 'hug-right' | 'carry' | 'present'
/** How someone feels: `joy` (eyes shut tight with smiling), `teary` (happy tears), `asleep`. */
export type Mood = 'happy' | 'grumpy' | 'sad' | 'wow' | 'asleep' | 'joy' | 'teary'
/** `crook`: Pharaoh's striped crook; `jar`: a big water jar held in front; `sack`: a sack on the shoulder (with `carry`). */
export type JHolding = 'staff' | 'stick' | 'crook' | 'jar' | 'sack'

export interface JLook extends Look {
  /** A coat of many colors: the robe in these stripes, top to bottom (the sleeves take three of them). */
  coat?: string[]
  /** A broad Egyptian collar of beads, in this color (gold), with rows of blue and red. */
  collar?: string
  /** A band round the head (a gold circlet), with a blue gem at the front. */
  band?: string
  /** Pharaoh's striped headdress, [cloth, stripes], over the head and down behind the ears to the shoulders. */
  nemes?: [string, string]
  /** Pleats down an Egyptian linen robe. */
  pleats?: boolean
}

/** Arms for each pose: the shoulder, (an elbow,) then the hand, left arm first (figure coordinates). */
const ARMS: Record<JPose, Pt[][]> = {
  stand: [[[-20, -86], [-30, -46]], [[20, -86], [30, -46]]],
  wave: [[[-20, -86], [-30, -46]], [[20, -86], [42, -128]]],
  pray: [[[-20, -86], [-6, -60]], [[20, -86], [6, -60]]],
  'arms-up': [[[-20, -86], [-42, -130]], [[20, -86], [42, -130]]],
  hold: [[[-20, -86], [-8, -60]], [[20, -86], [8, -60]]],
  point: [[[-20, -86], [-30, -46]], [[20, -86], [54, -90]]],
  open: [[[-20, -86], [-50, -60]], [[20, -86], [50, -60]]],
  // (the left forearm goes under the right; the right hand rests on the left elbow)
  cross: [[[-20, -86], [-27, -63], [21, -66]], [[20, -86], [27, -58], [-22, -60]]],
  hug: [[[-20, -86], [-60, -84]], [[20, -86], [60, -84]]],
  'hug-right': [[[-20, -86], [-30, -46]], [[20, -86], [60, -84]]],
  carry: [[[-20, -86], [-30, -46]], [[20, -86], [32, -70], [24, -100]]],
  present: [[[-20, -86], [-19, -64]], [[20, -86], [19, -64]]],
}
/** Holding the big jar: a hand on each side of it. */
const JAR_ARMS: Pt[][] = [[[-20, -86], [-21, -58]], [[20, -86], [21, -58]]]

const EYE = '#2b2140'
const COAT_INK = '#5a3a24'
const armPath = (pts: Pt[]) => `M${pts.map((p) => p.join(' ')).join(' L')}`
const armLength = (pts: Pt[]) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)
const uidOf = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')

/** One sleeve: a plain robe color, or the coat's stripes across it (shoulder, middle, cuff). */
function Sleeve({ pts, robe, stripes }: { pts: Pt[]; robe: string; stripes?: string[] }) {
  const d = armPath(pts)
  const common = { d, fill: 'none', strokeLinejoin: 'round' as const }
  if (!stripes) {
    return (
      <g>
        <path {...common} stroke={ink(robe)} strokeWidth={17} strokeLinecap="round" />
        <path {...common} stroke={robe} strokeWidth={14} strokeLinecap="round" />
        <path {...common} stroke={lighten(robe, 0.15)} strokeWidth={8} strokeLinecap="round" />
      </g>
    )
  }
  // Each later stripe is the same arm drawn again with a dash that starts further along it.
  const L = armLength(pts)
  const n = stripes.length
  return (
    <g>
      <path {...common} stroke={COAT_INK} strokeWidth={17} strokeLinecap="round" />
      <path {...common} stroke={stripes[0]} strokeWidth={14} strokeLinecap="round" />
      <path {...common} stroke={lighten(stripes[0], 0.25)} strokeWidth={7} strokeLinecap="round" />
      {stripes.slice(1).map((c, i) => {
        const a = (L * (i + 1)) / n
        const dash = `0 ${a.toFixed(1)} ${(L - a + 10).toFixed(1)} ${L.toFixed(1)}`
        return (
          <g key={i}>
            <path {...common} stroke={c} strokeWidth={14} strokeDasharray={dash} />
            <path {...common} stroke={lighten(c, 0.25)} strokeWidth={7} strokeDasharray={dash} />
            <path {...common} stroke={COAT_INK} strokeWidth={14} strokeDasharray={`0 ${(a - 0.7).toFixed(1)} 1.4 ${L.toFixed(1)}`} opacity={0.5} />
          </g>
        )
      })}
    </g>
  )
}

const ROBE = 'M-21 -92 Q0 -100 21 -92 L35 -10 Q0 -1 -35 -10 Z'
// (kneeling: the robe spreads out over the two knees on the ground)
const ROBE_KNEEL = 'M-21 -92 Q0 -100 21 -92 L35 -52 Q46 -44 38 -35 Q20 -30 2 -36 Q-20 -30 -38 -35 Q-46 -44 -35 -52 Z'

/** The coat of many colors in the shape `d`: curved bands top to bottom, softly shaded. */
function CoatBody({ d, stripes, top, bottom }: { d: string; stripes: string[]; top: number; bottom: number }) {
  const uid = uidOf(useId())
  const h = (bottom - top) / stripes.length
  return (
    <g>
      <defs>
        <clipPath id={`cc${uid}`}><path d={d} /></clipPath>
        <radialGradient id={`cs${uid}`} cx="35%" cy="25%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity={0.4} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#3b2414" stopOpacity={0.28} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#cc${uid})`}>
        {stripes.map((c, i) => {
          const y0 = top + i * h
          return <path key={i} d={`M-50 ${y0} Q0 ${y0 + 7} 50 ${y0} L50 ${y0 + h + 1} Q0 ${y0 + h + 8} -50 ${y0 + h + 1} Z`} fill={c} />
        })}
        {stripes.slice(1).map((_, i) => {
          const y0 = top + (i + 1) * h
          return <path key={i} d={`M-50 ${y0} Q0 ${y0 + 7} 50 ${y0}`} stroke={COAT_INK} strokeWidth={1.2} fill="none" opacity={0.5} />
        })}
        <rect x={-50} y={top - 10} width={100} height={bottom - top + 20} fill={`url(#cs${uid})`} />
      </g>
      <path d={d} fill="none" stroke={COAT_INK} strokeWidth={3} strokeLinejoin="round" />
    </g>
  )
}

/** A broad collar of beads round the neck and over the shoulders. */
function Collar({ color }: { color: string }) {
  return (
    <g>
      <path d="M-12 -97 Q0 -90 12 -97 L27 -92 Q0 -64 -27 -92 Z" fill={color} stroke={ink(color)} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-18 -92 Q0 -76 18 -92" stroke="#3f7fd0" strokeWidth={3.2} fill="none" />
      <path d="M-22 -91 Q0 -70 22 -91" stroke="#d0503f" strokeWidth={2.4} fill="none" strokeDasharray="2.4 2.6" />
    </g>
  )
}

/**
 * A head (figure coordinates: its middle at (0, -114), as Person draws it), with hair or headwear, and a
 * face for `mood`. Used by Figure, and by Sleeper for someone lying down.
 */
export function Head({ look, mood = 'happy', blinkDelay = 0 }: { look: JLook; mood?: Mood; blinkDelay?: number }) {
  const skin = useShade(look.skin, 0.25, 0.12)
  const hair = useShade(look.hairColor, 0.25, 0.15)
  const nid = uidOf(useId())
  const bearded = !!look.beard
  const wrap = look.wrap ?? '#7cb0e0'
  const back = look.hair === 'long' || look.hair === 'covered'
  const closed = mood === 'asleep' || mood === 'joy' || mood === 'teary'
  const eyeRy = mood === 'grumpy' ? 3.2 : mood === 'wow' ? 5 : 4.2
  const eyeRx = mood === 'wow' ? 3.6 : 3.2
  const nemes = look.nemes
  const lip = bearded ? '#d0707e' : '#6b2a3a'
  return (
    <g>
      <defs>{skin.def}{hair.def}</defs>
      {back && !nemes && (
        <path d="M-26 -112 Q-30 -82 -22 -86 L22 -86 Q30 -82 26 -112 Z" fill={look.hair === 'covered' ? wrap : hair.fill} stroke={ink(look.hair === 'covered' ? wrap : look.hairColor)} strokeWidth={2.5} />
      )}
      {nemes && (
        <g>
          <defs><clipPath id={`nb${nid}`}><path d="M-25 -124 L-36 -86 Q0 -80 36 -86 L25 -124 Z" /></clipPath></defs>
          <path d="M-25 -124 L-36 -86 Q0 -80 36 -86 L25 -124 Z" fill={nemes[0]} />
          <g clipPath={`url(#nb${nid})`}>
            {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-40} y={-124 + i * 5} width={80} height={2.5} fill={nemes[1]} />)}
          </g>
          <path d="M-25 -124 L-36 -86 Q0 -80 36 -86 L25 -124 Z" fill="none" stroke={ink(nemes[0])} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      )}
      <circle cx={0} cy={-114} r={22} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2.5} />
      {!nemes && <circle cx={-21} cy={-112} r={4.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />}
      {!nemes && <circle cx={21} cy={-112} r={4.5} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2} />}
      {/* eyes */}
      {closed ? (
        <g stroke={EYE} strokeWidth={2.2} fill="none" strokeLinecap="round">
          {mood === 'asleep'
            ? <path d="M-11.5 -114 Q-8 -110.5 -4.5 -114 M4.5 -114 Q8 -110.5 11.5 -114" />
            : <path d="M-11.5 -113 Q-8 -118 -4.5 -113 M4.5 -113 Q8 -118 11.5 -113" />}
        </g>
      ) : (
        <g className="pa-blink" style={{ '--d': `${blinkDelay}s` } as CSSProperties}>
          <ellipse cx={-8} cy={-114} rx={eyeRx} ry={eyeRy} fill={EYE} />
          <ellipse cx={8} cy={-114} rx={eyeRx} ry={eyeRy} fill={EYE} />
          <circle cx={-9} cy={-116} r={1.2} fill="#fff" />
          <circle cx={7} cy={-116} r={1.2} fill="#fff" />
        </g>
      )}
      {/* brows, for feelings */}
      {(mood === 'grumpy' || mood === 'sad' || mood === 'wow') && (
        <path
          d={mood === 'grumpy' ? 'M-13.5 -123 L-4 -119.5 M13.5 -123 L4 -119.5' : mood === 'sad' ? 'M-12.5 -119.5 L-4 -123 M12.5 -119.5 L4 -123' : 'M-12 -123 Q-8 -127 -4 -124 M12 -123 Q8 -127 4 -124'}
          stroke={darken(look.hairColor === '#e8e4dc' ? '#9a9088' : look.hairColor, 0.1)} strokeWidth={2.4} fill="none" strokeLinecap="round"
        />
      )}
      {mood !== 'grumpy' && <ellipse cx={-13} cy={-106} rx={4} ry={2.6} fill="#ff7fb0" opacity={0.5} />}
      {mood !== 'grumpy' && <ellipse cx={13} cy={-106} rx={4} ry={2.6} fill="#ff7fb0" opacity={0.5} />}
      {bearded && (() => {
        const bc = look.beardColor ?? look.hairColor
        return (
          <g fill={bc} stroke={ink(bc)} strokeWidth={2} strokeLinejoin="round">
            {(look.hair === 'covered' || look.hair === 'bald') && <path d="M-23 -118 L-17 -104 L-13 -107 L-18 -119 Z M23 -118 L17 -104 L13 -107 L18 -119 Z" />}
            <path d={look.beard === 'long' ? 'M-18 -110 Q-20 -72 0 -66 Q20 -72 18 -110 Q10 -100 0 -101 Q-10 -100 -18 -110 Z' : 'M-17 -110 Q-16 -90 0 -88 Q16 -90 17 -110 Q10 -101 0 -102 Q-10 -101 -17 -110 Z'} />
            <path d="M-10 -103 Q-5 -108 0 -105 Q5 -108 10 -103 Q5 -101 0 -102.5 Q-5 -101 -10 -103 Z" strokeWidth={1.4} />
          </g>
        )
      })()}
      {/* mouth */}
      {mood === 'grumpy' ? (
        <path d={bearded ? 'M-4 -97.5 Q0 -101 4 -97.5' : 'M-5 -103 Q0 -107.5 5 -103'} stroke={lip} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      ) : mood === 'sad' ? (
        <path d={bearded ? 'M-3.5 -98 Q0 -100.5 3.5 -98' : 'M-4 -103.5 Q0 -106 4 -103.5'} stroke={lip} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      ) : mood === 'wow' ? (
        <ellipse cx={0} cy={bearded ? -98.5 : -104} rx={bearded ? 2.6 : 3} ry={bearded ? 3.2 : 3.8} fill="#6b2a3a" stroke={bearded ? '#d0707e' : '#4a1a2a'} strokeWidth={1.2} />
      ) : mood === 'joy' || mood === 'teary' ? (
        <path d={bearded ? 'M-4.5 -100 Q0 -93.5 4.5 -100 Q0 -98.5 -4.5 -100 Z' : 'M-6 -106 Q0 -98 6 -106 Q0 -104 -6 -106 Z'} fill="#6b2a3a" stroke={bearded ? '#d0707e' : '#4a1a2a'} strokeWidth={1.4} strokeLinejoin="round" />
      ) : (
        <path d={bearded ? 'M-3.5 -99 Q0 -96.5 3.5 -99' : 'M-5 -106 Q0 -101 5 -106'} stroke={lip} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      )}
      {/* hair and headwear */}
      {nemes ? (
        <g>
          <defs><clipPath id={`nt${nid}`}><path d="M-26 -110 Q-28 -147 0 -147 Q28 -147 26 -110 Q15 -126 0 -126 Q-15 -126 -26 -110 Z" /></clipPath></defs>
          <path d="M-26 -110 Q-28 -147 0 -147 Q28 -147 26 -110 Q15 -126 0 -126 Q-15 -126 -26 -110 Z" fill={nemes[0]} />
          <g clipPath={`url(#nt${nid})`}>
            {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-30 + i * 5.5} -150 L${-30 + i * 5.5 + (i - 5.5) * 1.6} -108`} stroke={nemes[1]} strokeWidth={2.4} />)}
          </g>
          <path d="M-26 -110 Q-28 -147 0 -147 Q28 -147 26 -110 Q15 -126 0 -126 Q-15 -126 -26 -110 Z" fill="none" stroke={ink(nemes[0])} strokeWidth={2.4} strokeLinejoin="round" />
          {/* the lappets hanging in front of the shoulders */}
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`scale(${sd} 1)`}>
              <path d="M21 -112 L31 -110 L33 -80 L23 -80 Z" fill={nemes[0]} stroke={ink(nemes[0])} strokeWidth={2} strokeLinejoin="round" />
              {[-104, -97, -90].map((sy) => <path key={sy} d={`M22.5 ${sy} L32 ${sy + 0.6}`} stroke={nemes[1]} strokeWidth={2.6} />)}
            </g>
          ))}
          <path d="M-24 -121 Q0 -130 24 -121" stroke={look.band ?? '#ffd34d'} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ) : look.hair === 'covered' ? (
        <path d="M-25 -112 Q-26 -142 0 -142 Q26 -142 25 -112 Q14 -128 0 -127 Q-14 -128 -25 -112 Z" fill={wrap} stroke={ink(wrap)} strokeWidth={2.5} />
      ) : look.hair === 'curly' ? (
        <g fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2}>
          {[[-16, -128], [-6, -134], [6, -134], [16, -128], [-21, -118], [21, -118]].map(([cx, cy]) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={8} />)}
        </g>
      ) : look.hair !== 'bald' ? (
        <path d="M-23 -112 Q-25 -139 0 -139 Q25 -139 23 -112 Q14 -125 0 -123 Q-14 -125 -23 -112 Z" fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2.5} />
      ) : null}
      {look.hair === 'ponytail' && !nemes && <ellipse cx={26} cy={-122} rx={9} ry={13} fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2} transform="rotate(25 26 -122)" />}
      {look.hair === 'pigtails' && !nemes && [-1, 1].map((d) => <ellipse key={d} cx={d * 27} cy={-112} rx={8} ry={12} fill={hair.fill} stroke={ink(look.hairColor)} strokeWidth={2} />)}
      {look.band && !nemes && (
        <g>
          <path d="M-23 -123 Q0 -131 23 -123" stroke={ink(look.band)} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M-23 -123 Q0 -131 23 -123" stroke={look.band} strokeWidth={3.6} fill="none" strokeLinecap="round" />
          <circle cx={0} cy={-127} r={3.2} fill="#3f7fd0" stroke={ink(look.band)} strokeWidth={1.4} />
        </g>
      )}
      {look.crown && <path d="M-16 -140 L-16 -154 L-8 -146 L0 -158 L8 -146 L16 -154 L16 -140 Z" fill="#ffd34d" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />}
      {nemes && <path d="M0 -121 q-4.5 -6 0 -12 q4.5 6 0 12 Z" fill="#ffd34d" stroke="#c99a10" strokeWidth={1.4} />}
      {mood === 'teary' && [-1, 1].map((sd) => (
        <g key={sd} transform={`scale(${sd} 1)`}>
          <path d="M-12.5 -110 Q-15.5 -104.5 -12.5 -102.5 Q-9.5 -104.5 -12.5 -110 Z" fill="#8fd0ff" stroke="#4a9ad8" strokeWidth={1} />
          <circle cx={-13.4} cy={-104.8} r={0.9} fill="#fff" />
        </g>
      ))}
    </g>
  )
}

/** Something held (figure coordinates; at the hand (x, y), or in front between the hands). */
function Held({ what, x, y }: { what: JHolding; x: number; y: number }) {
  switch (what) {
    case 'staff':
      return <path d={`M${x + 2} -146 Q${x + 12} -160 ${x + 2} -166 Q${x - 6} -162 ${x - 2} -154 M${x + 2} -146 L${x} -2`} stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
    case 'stick':
      return <path d={`M${x + 1} ${y - 8} L${x} -2`} stroke="#8a5a2e" strokeWidth={5} fill="none" strokeLinecap="round" />
    case 'crook': {
      // Pharaoh's crook, in gold and blue bands: leaning out from the hand, its hook curling back in at the top.
      const sg = x < 0 ? -1 : 1
      const tx = x + 12 * sg, ty = y - 80
      const d = `M${x - 6 * sg} ${y + 34} L${tx} ${ty} Q${tx + 3 * sg} ${ty - 17} ${tx - 9 * sg} ${ty - 17} Q${tx - 19 * sg} ${ty - 16} ${tx - 18 * sg} ${ty - 6}`
      return (
        <g>
          <path d={d} stroke="#1f3f78" strokeWidth={7.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} stroke="#ffd34d" strokeWidth={4.2} fill="none" strokeLinecap="round" strokeDasharray="5 4" />
        </g>
      )
    }
    case 'jar':
      return (
        <g transform={`translate(${x} ${y + 8})`}>
          <path d="M-9 -24 L9 -24 L8 -18 Q22 -12 20 4 Q18 20 0 22 Q-18 20 -20 4 Q-22 -12 -8 -18 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-17 -2 Q0 4 17 -2" stroke="#f2c08a" strokeWidth={3} fill="none" />
          <ellipse cx={0} cy={-24} rx={10} ry={3} fill="#6a3a1a" />
          <ellipse cx={-8} cy={-8} rx={3} ry={6} fill="#fff" opacity={0.3} />
        </g>
      )
    case 'sack':
      // On the shoulder, steadied by the hand.
      return (
        <g transform={`translate(${x + 2} ${y + 2}) rotate(-12)`}>
          <path d="M-20 -14 Q-6 -24 6 -20 Q24 -16 26 0 Q26 14 8 14 Q-12 14 -22 6 Q-28 -4 -20 -14 Z" fill="#d8b47a" stroke="#9a7442" strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-8 -4 q4 6 0 12 M8 -8 q-3 7 1 14" stroke="#b9925a" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      )
  }
}

/**
 * A person, drawn as Person draws them (origin at the feet; an adult is about 150 tall at s = 1), plus
 * the coat, moods, poses and Egyptian dress described at the top of this file.
 * `reach`: where the hands go instead of the pose's (figure coordinates; for hugs, a hand on a shoulder).
 * `heldHand`: which hand holds `holding` (1, the right, unless said). `kneel`: kneeling, bowed low.
 * `item`: something drawn in figure units between the arms and the hands (the hands go over it).
 */
export function Figure({ x, y, s = 1, look, pose = 'stand', mood = 'happy', holding, heldHand = 1, facing = 'right', blinkDelay = 0, kneel, reach, item, children }: {
  x: number; y: number; s?: number; look: JLook; pose?: JPose; mood?: Mood; holding?: JHolding; heldHand?: 0 | 1
  facing?: 'left' | 'right'; blinkDelay?: number; kneel?: boolean; reach?: [Pt | null, Pt | null]; item?: ReactNode; children?: ReactNode
}) {
  const build = look.build ?? 'adult'
  const scale = s * (build === 'child' ? 0.74 : build === 'giant' ? 1.55 : 1)
  const robe = useShade(look.robe, 0.3, 0.2)
  const skin = useShade(look.skin, 0.25, 0.12)
  const base = holding === 'jar' ? JAR_ARMS : ARMS[pose]
  const arms = base.map((pts, i) => (reach?.[i] ? [pts[0], reach[i]!] : pts))
  const inFront = holding === 'jar'
  const sleeves = look.coat ? [look.coat[4] ?? look.coat[0], look.coat[2] ?? look.coat[0], look.coat[0]] : undefined
  // Kneeling: everything above the knees comes down, and the head bows a little more.
  const drop = kneel ? 32 : 0
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -scale : scale} ${scale})`}>
      <defs>{robe.def}{skin.def}</defs>
      <g className="pa-breathe">
        {!kneel && (
          <g>
            <ellipse cx={-11} cy={-4} rx={10} ry={5} fill="#7a5233" />
            <ellipse cx={11} cy={-4} rx={10} ry={5} fill="#7a5233" />
          </g>
        )}
        <g transform={drop ? `translate(0 ${drop})` : undefined}>
          {look.coat ? (
            <CoatBody d={kneel ? ROBE_KNEEL : ROBE} stripes={look.coat} top={-100} bottom={kneel ? -30 : -2} />
          ) : (
            <path d={kneel ? ROBE_KNEEL : ROBE} fill={robe.fill} stroke={ink(look.robe)} strokeWidth={3} strokeLinejoin="round" />
          )}
          {kneel && <path d="M-36 -46 Q-18 -52 -4 -44 M36 -46 Q18 -52 4 -44" stroke={ink(look.robe)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />}
          {look.pleats && (
            <path d={kneel ? 'M-10 -54 L-14 -40 M0 -54 L0 -36 M10 -54 L14 -40' : 'M-12 -50 L-17 -10 M-4 -50 L-6 -6 M4 -50 L6 -6 M12 -50 L17 -10'} stroke={darken(look.robe, 0.12)} strokeWidth={1.6} strokeLinecap="round" />
          )}
          {look.sash && !kneel && <path d="M-27 -54 Q0 -47 27 -54 L28 -45 Q0 -38 -28 -45 Z" fill={look.sash} stroke={ink(look.sash)} strokeWidth={2} />}
          {/* arms */}
          {arms.map((pts, i) => (
            <g key={i}>
              <Sleeve pts={pts} robe={look.robe} stripes={sleeves} />
              {holding && !inFront && holding !== 'crook' && i === heldHand && <Held what={holding} x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1]} />}
            </g>
          ))}
          {holding && inFront && <Held what={holding} x={0} y={-62} />}
          {item}
          {/* hands (the left one tucked away when the arms are crossed) */}
          {pose !== 'pray' && arms.map((pts, i) => {
            if (pose === 'cross' && i === 0) return null
            const [hx, hy] = pts[pts.length - 1]
            return <circle key={i} cx={hx} cy={hy} r={7} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} />
          })}
          {look.collar && <Collar color={look.collar} />}
          <rect x={-6} y={-100} width={12} height={10} fill={look.skin} />
          {/* (kneeling, the head bows down low onto the chest, eyes lowered) */}
          <g transform={kneel ? 'translate(0 10)' : undefined}>
            <Head look={look} mood={kneel && mood === 'happy' ? 'asleep' : mood} blinkDelay={blinkDelay} />
          </g>
          {pose === 'pray' && (
            <g>
              <path d="M-7 -49 Q-9 -64 -1 -74 L1 -74 Q9 -64 7 -49 Q0 -46 -7 -49 Z" fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} strokeLinejoin="round" />
              <path d="M0 -73 L0 -50" stroke={ink(look.skin)} strokeWidth={1.4} />
            </g>
          )}
          {/* (a crook is held up in front of everything, so its hook shows beside the head) */}
          {holding === 'crook' && <Held what="crook" x={arms[heldHand][arms[heldHand].length - 1][0]} y={arms[heldHand][arms[heldHand].length - 1][1]} />}
          {holding === 'crook' && (() => {
            const [hx, hy] = arms[heldHand][arms[heldHand].length - 1]
            return <circle cx={hx} cy={hy} r={7} fill={skin.fill} stroke={ink(look.skin)} strokeWidth={2} />
          })()}
          {children}
        </g>
      </g>
    </g>
  )
}

/** A hand, drawn again on top of someone else (a hug's hand on a shoulder): `look` is whose hand; scene units. */
function HandOn({ x, y, s = 1, look }: { x: number; y: number; s?: number; look: JLook }) {
  return <circle cx={x} cy={y} r={7 * s} fill={look.skin} stroke={ink(look.skin)} strokeWidth={2 * s} />
}

/**
 * Someone asleep, lying on their back under a blanket (the coat of many colors, or a plain cloth), the
 * head on a pillow. (x, y): the middle of the pillow's bottom, on the bed or the mat; the body
 * stretches out to the right, about 185 long at s = 1.
 */
export function Sleeper({ x, y, s = 1, look, blanket = '#e8dcc0' }: { x: number; y: number; s?: number; look: JLook; blanket?: string | string[] }) {
  const uid = uidOf(useId())
  const cover = 'M14 -2 Q12 -34 44 -36 Q96 -40 140 -32 Q158 -30 166 -42 Q182 -44 184 -26 Q186 -8 178 -2 Z'
  const stripes = Array.isArray(blanket) ? blanket : null
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-12} rx={34} ry={13} fill="#fffaf2" stroke="#d8cfc2" strokeWidth={2.5} />
      <g transform="translate(-2 -34) rotate(-62) translate(0 114) scale(0.95)">
        <Head look={look} mood="asleep" />
      </g>
      <defs><clipPath id={`bl${uid}`}><path d={cover} /></clipPath></defs>
      {stripes ? (
        <g>
          <g clipPath={`url(#bl${uid})`}>
            {stripes.map((c, i) => <path key={i} d={`M${14 + i * 30} -50 l30 0 l-6 52 l-30 0 Z`} fill={c} />)}
            <path d="M0 -60 L200 -60 L200 -26 Q100 -40 0 -26 Z" fill="#fff" opacity={0.22} />
          </g>
          <path d={cover} fill="none" stroke={COAT_INK} strokeWidth={3} strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <path d={cover} fill={blanket as string} stroke={ink(blanket as string)} strokeWidth={3} strokeLinejoin="round" />
          <path d="M40 -30 Q96 -36 140 -27" stroke={darken(blanket as string, 0.08)} strokeWidth={2} fill="none" />
        </g>
      )}
    </g>
  )
}

// ---------- The characters (to move into people.tsx's PEOPLE) ----------

/** Joseph's coat: red, orange, yellow, green, blue and purple, top to bottom (the colors the story names). */
export const COAT_COLORS = ['#ff5d5d', '#ffa64d', '#ffe14d', '#5fd39a', '#5fb7ff', '#a98cff']

const JOSEPH_FACE = { skin: SKIN.medium, hair: 'curly', hairColor: '#3b2a20' } as const

export const JOSEPH_PEOPLE = {
  /** Joseph at home, before the coat (and after it's taken): a young man, no beard, curly hair. */
  joseph: { ...JOSEPH_FACE, robe: '#d9c39a', sash: '#a0703f' },
  /** Joseph in his coat of many colors. */
  josephCoat: { ...JOSEPH_FACE, robe: '#ffa64d', coat: COAT_COLORS },
  /** Joseph working in Egypt: a plain white linen robe. */
  josephEgypt: { ...JOSEPH_FACE, robe: '#f7f2e6', sash: '#c9a46a', pleats: true },
  /** Joseph the ruler of Egypt: fine linen, a gold collar and a gold band round his head. */
  josephRuler: { ...JOSEPH_FACE, robe: '#fbf8ef', sash: '#3f7fd0', pleats: true, collar: '#ffd34d', band: '#ffd34d' },
  /** Jacob, Joseph's father: old, with a long white beard, a head cloth and a shepherd's staff. */
  jacob: { skin: SKIN.medium, hair: 'covered', hairColor: '#e8e4dc', wrap: '#efe6d2', beard: 'long', beardColor: '#f4f1ea', robe: '#5a7fb8', sash: '#e0b45a' },
  /** Benjamin, the youngest brother: a little boy. */
  benjamin: { skin: SKIN.medium, hair: 'short', hairColor: '#3b2a20', robe: '#8fc66a', sash: '#fff3c9', build: 'child' },
  /** Pharaoh, the king of Egypt: the striped headdress with a gold band, a gold collar, and his crook. */
  pharaoh: { skin: SKIN.tan, hair: 'short', hairColor: '#2b2020', robe: '#fbf8ef', sash: '#d0503f', pleats: true, collar: '#ffd34d', nemes: ['#ffd34d', '#2a5aa8'], band: '#ffd34d' },
  /** People of Egypt: workers, a little girl, and a kind old man. */
  egyptMan: { skin: SKIN.tan, hair: 'short', hairColor: '#1f1a1a', robe: '#f2ecdc', sash: '#5f8fc0', pleats: true },
  egyptMan2: { skin: SKIN.deep, hair: 'short', hairColor: '#1f1a1a', robe: '#efe6d0', sash: '#d0503f', pleats: true },
  egyptGirl: { skin: SKIN.tan, hair: 'pigtails', hairColor: '#1f1a1a', robe: '#f6efde', sash: '#ffa64d', collar: '#5fd39a', build: 'child' },
  oldMan: { skin: SKIN.tan, hair: 'bald', hairColor: '#e8e4dc', beard: 'short', beardColor: '#f2efe8', robe: '#e8dcc0', sash: '#8a6a3a' },
  /** A trader on the road to Egypt. */
  trader: { skin: SKIN.tan, hair: 'covered', hairColor: '#2b2020', wrap: '#d0503f', beard: 'short', beardColor: '#2b2020', robe: '#e0b45a', sash: '#5a3a24' },
} satisfies Record<string, JLook>

/**
 * Joseph's ten big brothers, eldest first (Reuben, Simeon, Levi, Judah, Dan, Naphtali, Gad, Asher,
 * Issachar, Zebulun): grown men with beards, each in his own earthy robe, so Joseph's bright coat stands out.
 */
export const BROTHERS: JLook[] = [
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8dcc0', beard: 'long', beardColor: '#3b2a20', robe: '#8f6a48', sash: '#c0504d' },
  { skin: SKIN.medium, hair: 'short', hairColor: '#2b2020', beard: 'short', robe: '#6b8f5a', sash: '#e0b45a' },
  { skin: SKIN.tan, hair: 'curly', hairColor: '#3b2a20', beard: 'short', robe: '#a85a4a', sash: '#e8dcc0' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#4a3020', wrap: '#c98448', beard: 'long', beardColor: '#4a3020', robe: '#5f7fa8', sash: '#f0d38a' },
  { skin: SKIN.deep, hair: 'short', hairColor: '#2b2020', beard: 'short', robe: '#9a7a4a', sash: '#5f8fc0' },
  { skin: SKIN.tan, hair: 'short', hairColor: '#4a3020', beard: 'short', robe: '#7a6aa8', sash: '#e0b45a' },
  { skin: SKIN.medium, hair: 'covered', hairColor: '#3b2a20', wrap: '#9cc07a', beard: 'short', beardColor: '#3b2a20', robe: '#b5794a', sash: '#6b8f5a' },
  { skin: SKIN.tan, hair: 'curly', hairColor: '#2b2020', beard: 'short', robe: '#c9a46a', sash: '#a0612f' },
  { skin: SKIN.medium, hair: 'short', hairColor: '#3b2a20', beard: 'long', robe: '#6f8f8a', sash: '#c98448' },
  { skin: SKIN.tan, hair: 'covered', hairColor: '#2b2020', wrap: '#7fa8d0', beard: 'short', beardColor: '#2b2020', robe: '#a07a5a', sash: '#e8dcc0' },
]

const P = JOSEPH_PEOPLE

// ---------- Things in the pictures ----------

/**
 * A bundle of grain (a sheaf): golden stalks tied round the middle, splayed out on the ground below the
 * tie, and the ears of grain fanned out above it. `bow` (degrees) bends the top over from the tie, as
 * the bundles in Joseph's dream bow down. (x, y): its foot on the ground; about 96 tall at s = 1.
 */
export function Sheaf({ x, y, s = 1, bow = 0 }: { x: number; y: number; s?: number; bow?: number }) {
  const gold = '#f0c75a', line = '#b8892a', ear = '#e8b440'
  // (a bowing bundle draws its ears closer together, so it bends over rather than fanning open)
  const k = 1 - Math.min(Math.abs(bow), 60) / 130
  const ears = [-34, -22, -11, 0, 11, 22, 34].map((a) => a * k)
  const at = (a: number, d: number): Pt => [Math.sin((a * Math.PI) / 180) * d, -40 - Math.cos((a * Math.PI) / 180) * d]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-1} rx={24} ry={3} fill="#000" opacity={0.1} />
      <path d="M-8 -40 L-21 -1 Q0 3 21 -1 L8 -40 Z" fill={gold} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
      {[-14, -7, 0, 7, 14].map((dx) => <path key={dx} d={`M${dx * 0.45} -40 L${dx} -2`} stroke={line} strokeWidth={1.3} opacity={0.7} />)}
      <g transform={`rotate(${bow} 0 -40)`}>
        {ears.map((a, i) => {
          const [ex, ey] = at(a, 44)
          return <path key={`s${i}`} d={`M${(Math.sin((a * Math.PI) / 180) * 5).toFixed(1)} -42 L${ex.toFixed(1)} ${ey.toFixed(1)}`} stroke={line} strokeWidth={4.6} strokeLinecap="round" />
        })}
        {ears.map((a, i) => {
          const [ex, ey] = at(a, 44)
          return <path key={`t${i}`} d={`M${(Math.sin((a * Math.PI) / 180) * 5).toFixed(1)} -42 L${ex.toFixed(1)} ${ey.toFixed(1)}`} stroke={gold} strokeWidth={2.4} strokeLinecap="round" />
        })}
        {ears.map((a, i) => {
          const [ex, ey] = at(a, 50)
          return (
            <g key={`e${i}`} transform={`translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${a.toFixed(1)})`}>
              <path d="M0 -16 L-2.5 -27 M0 -16 L0 -29 M0 -16 L2.5 -27" stroke={line} strokeWidth={1.1} strokeLinecap="round" />
              <ellipse cx={0} cy={-6} rx={5} ry={11} fill={ear} stroke={line} strokeWidth={1.8} />
              <path d="M-4 -10 L0 -7 L4 -10 M-4 -4 L0 -1 L4 -4" stroke={line} strokeWidth={1.1} fill="none" />
            </g>
          )
        })}
      </g>
      <path d="M-10 -46 Q0 -42 10 -46 L10 -36 Q0 -32 -10 -36 Z" fill="#a0612f" stroke="#6b4422" strokeWidth={2} strokeLinejoin="round" />
    </g>
  )
}

/**
 * A shepherd family's tent (Jacob's home): long and low, of dark woven goat hair in stripes, held up by
 * poles so its roof dips between them, the front open in the middle with a rug at the door, and ropes
 * pegged out at the sides. (x, y): the middle of its front, on the ground; about 270 wide at s = 1.
 */
export function Tent({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const cloth = '#6b564a', stripe = '#8a7362', line = '#3e3028'
  const roof = 'M-128 -58 Q-110 -96 -66 -84 Q-34 -110 0 -92 Q34 -110 66 -84 Q110 -96 128 -58 Z'
  const uid = uidOf(useId())
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-128 -58 L-168 0 M128 -58 L168 0 M-66 -84 L-112 0 M66 -84 L112 0" stroke="#a08a6a" strokeWidth={1.8} />
      {[-168, -112, 112, 168].map((px) => <path key={px} d={`M${px} 2 l0 -9`} stroke="#6b4422" strokeWidth={3.5} strokeLinecap="round" />)}
      <path d="M-122 -60 L-124 0 L-34 0 L-30 -62 Z M30 -62 L34 0 L124 0 L122 -60 Z" fill={cloth} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-30 -62 L-34 0 L34 0 L30 -62 Z" fill="#2e2420" />
      <path d="M-26 -58 L-24 -4 M26 -58 L24 -4" stroke="#7a5233" strokeWidth={4} strokeLinecap="round" />
      <defs><clipPath id={`tr${uid}`}><path d={roof} /></clipPath></defs>
      <path d={roof} fill={cloth} />
      <g clipPath={`url(#tr${uid})`}>
        {[-100, -60, -20, 20, 60, 100].map((sx) => <rect key={sx} x={sx - 6} y={-120} width={12} height={70} fill={stripe} />)}
      </g>
      <path d={roof} fill="none" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      {[-66, 0, 66].map((px) => <circle key={px} cx={px} cy={px ? -86 : -94} r={3.5} fill="#7a5233" stroke={line} strokeWidth={1.5} />)}
      <path d="M-40 -2 L40 -2 L46 8 L-46 8 Z" fill="#c0504d" stroke="#8a3434" strokeWidth={2} strokeLinejoin="round" />
      <path d="M-34 3 L34 3" stroke="#f0d38a" strokeWidth={2} strokeDasharray="5 4" />
    </g>
  )
}

/**
 * A camel walking side-on (facing right, or left): one big hump with a striped blanket over it and
 * bundles tied on, a long neck curving up to a friendly face, knobbly knees and wide soft feet.
 * (x, y): its feet on the ground; about 150 long and 185 tall at s = 1, its nose at (118, -166).
 */
export function Camel({ x, y, s = 1, facing = 'right', load = true }: { x: number; y: number; s?: number; facing?: 'left' | 'right'; load?: boolean }) {
  const FUR = '#d9a86a'
  const fur = useShade(FUR, 0.35, 0.18)
  const line = ink(FUR)
  const far = darken(FUR, 0.12)
  const leg = (lx: number, back: boolean) => {
    const c = back ? far : FUR
    // A long leg: a strong top, a knobbly knee, a thin shin, and a wide soft foot.
    const d = `M${lx - 8} -84 Q${lx - 7} -64 ${lx - 5} -50 Q${lx - 7.5} -45 ${lx - 5} -40 L${lx - 3.5} -9 L${lx + 3.5} -9 L${lx + 5} -40 Q${lx + 7.5} -45 ${lx + 5} -50 Q${lx + 7} -64 ${lx + 8} -84 Z`
    return (
      <g key={lx}>
        <path d={d} fill={c} stroke={line} strokeWidth={2.2} strokeLinejoin="round" />
        <ellipse cx={lx + 2} cy={-5} rx={9} ry={5} fill={back ? darken(far, 0.08) : '#c9965a'} stroke={line} strokeWidth={1.8} />
      </g>
    )
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <defs>{fur.def}</defs>
      <ellipse cx={0} cy={-1} rx={64} ry={5} fill="#000" opacity={0.1} />
      {[-40, 30].map((lx) => leg(lx, true))}
      <path d="M-60 -92 Q-70 -80 -66 -62" stroke={line} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M-66 -64 l-4 8 l6 -2 l4 6 l1 -10 Z" fill="#8a6a3a" />
      <path d="M-62 -92 Q-64 -112 -42 -118 Q-26 -156 4 -150 Q26 -146 34 -118 Q52 -112 56 -96 Q58 -74 30 -72 L-38 -72 Q-62 -72 -62 -92 Z" fill={fur.fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
      {[-26, 20].map((lx) => leg(lx, false))}
      {load && (
        <g>
          <path d="M-36 -122 Q-12 -150 22 -124 L26 -98 Q-6 -92 -38 -98 Z" fill="#c0504d" stroke="#8a3434" strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-35 -110 Q-6 -120 24 -110 M-37 -102 Q-6 -110 25 -101" stroke="#f0d38a" strokeWidth={3} fill="none" />
          {[-34, -22, -10, 2, 14, 24].map((tx) => <path key={tx} d={`M${tx} -97 l0 6`} stroke="#f0d38a" strokeWidth={2.2} strokeLinecap="round" />)}
          <ellipse cx={-44} cy={-104} rx={13} ry={16} fill="#b5946a" stroke="#7a5a3a" strokeWidth={2.2} />
          <path d="M-50 -116 Q-44 -112 -38 -116" stroke="#7a5a3a" strokeWidth={2} fill="none" />
          <ellipse cx={36} cy={-104} rx={11} ry={14} fill="#9cc07a" stroke="#6b8f5a" strokeWidth={2.2} />
        </g>
      )}
      <path d="M40 -112 Q58 -116 66 -138 Q72 -160 84 -170 L98 -158 Q86 -146 80 -128 Q72 -98 50 -92 Z" fill={fur.fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
      <path d="M80 -170 Q86 -184 102 -182 Q118 -180 122 -170 Q126 -160 116 -156 Q104 -152 94 -156 Q84 -160 80 -170 Z" fill={fur.fill} stroke={line} strokeWidth={2.8} strokeLinejoin="round" />
      <ellipse cx={86} cy={-180} rx={4} ry={7} fill="#c9965a" stroke={line} strokeWidth={1.8} transform="rotate(-30 86 -180)" />
      <circle cx={100} cy={-173} r={3.2} fill="#2b2140" /><circle cx={99} cy={-174.4} r={1.1} fill="#fff" />
      <path d="M96.5 -177.5 q3 -2.4 6 -0.4" stroke={line} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <ellipse cx={118} cy={-168} rx={2} ry={1.3} fill="#7a4a2a" />
      <path d="M108 -158 Q114 -155 120 -159" stroke="#7a4a2a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <ellipse cx={104} cy={-164} rx={4} ry={2.4} fill="#ff7fb0" opacity={0.45} />
    </g>
  )
}

/**
 * A cow standing side-on (facing right), for Pharaoh's dream: `fat` is round and well fed with a happy
 * face; skinny (`fat` false) is thin and hungry, its ribs showing and its head hanging low.
 * (x, y): its hooves on the ground; about 130 long at s = 1.
 */
export function DreamCow({ x, y, s = 1, fat, facing = 'right' }: { x: number; y: number; s?: number; fat?: boolean; facing?: 'left' | 'right' }) {
  const hide = fat ? '#fbf3e6' : '#e6d6bc', patch = fat ? '#a8683e' : '#9a8266', line = fat ? '#b5a08a' : '#a08a6e'
  const leg = (lx: number, back: boolean) => fat
    ? <rect key={lx} x={lx} y={-36} width={12} height={35} rx={4} fill={back ? '#e8dccb' : hide} stroke={line} strokeWidth={2} />
    : <rect key={lx} x={lx} y={-46} width={7} height={45} rx={3} fill={back ? '#d6c4a6' : hide} stroke={line} strokeWidth={2} />
  return (
    <g transform={`translate(${x} ${y}) scale(${facing === 'left' ? -s : s} ${s})`}>
      <ellipse cx={0} cy={-1} rx={fat ? 56 : 46} ry={4} fill="#000" opacity={0.1} />
      {(fat ? [-38, 22] : [-30, 20]).map((lx) => leg(lx, true))}
      <path d={fat ? 'M-52 -66 Q-66 -50 -62 -28' : 'M-44 -70 Q-54 -56 -52 -36'} stroke={line} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <ellipse cx={fat ? -62 : -52} cy={fat ? -26 : -34} rx={4.5} ry={7} fill={patch} />
      {fat ? (
        <g>
          <ellipse cx={-2} cy={-58} rx={56} ry={34} fill={hide} stroke={line} strokeWidth={2.6} />
          <path d="M-30 -86 Q-14 -66 -34 -38 Q-52 -46 -54 -64 Q-48 -82 -30 -86 Z" fill={patch} />
          <ellipse cx={14} cy={-72} rx={15} ry={10} fill={patch} />
          <ellipse cx={-10} cy={-30} rx={11} ry={6} fill="#ffc0cf" stroke="#e090a8" strokeWidth={1.5} />
        </g>
      ) : (
        <g>
          <path d="M-46 -72 Q-46 -84 -34 -82 Q-20 -76 0 -76 Q20 -76 30 -82 Q42 -84 44 -72 Q44 -50 30 -48 Q0 -44 -34 -48 Q-46 -52 -46 -72 Z" fill={hide} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
          {[-14, -4, 6].map((rx) => <path key={rx} d={`M${rx} -74 Q${rx - 4} -62 ${rx} -50`} stroke={line} strokeWidth={1.8} fill="none" strokeLinecap="round" />)}
          <ellipse cx={-30} cy={-68} rx={9} ry={7} fill={patch} opacity={0.8} />
        </g>
      )}
      {(fat ? [-48, 10] : [-38, 12]).map((lx) => leg(lx, false))}
      {(fat ? [-48, 10] : [-38, 12]).map((lx) => <rect key={`h${lx}`} x={lx} y={-6} width={fat ? 12 : 7} height={6} rx={2} fill="#5a4a44" />)}
      <g transform={fat ? 'translate(4 0)' : 'translate(-2 18) rotate(14 56 -80)'}>
        <path d="M50 -92 l6 -10 l4 8 Z M66 -92 l4 -10 l5 9 Z" fill="#f2e6c8" stroke="#c9b48a" strokeWidth={1.5} strokeLinejoin="round" />
        <ellipse cx={46} cy={-84} rx={9} ry={4} fill={hide} stroke={line} strokeWidth={2} transform={fat ? 'rotate(-25 46 -84)' : 'rotate(25 46 -84)'} />
        <rect x={48} y={-94} width={30} height={34} rx={13} fill={hide} stroke={line} strokeWidth={2.5} />
        <path d="M50 -92 Q60 -84 58 -74 Q50 -76 48 -84 Z" fill={patch} />
        <ellipse cx={66} cy={-64} rx={15} ry={9} fill="#ffc0cf" stroke="#e090a8" strokeWidth={2} />
        <circle cx={61} cy={-64} r={1.8} fill="#a05a6a" /><circle cx={71} cy={-64} r={1.8} fill="#a05a6a" />
        {fat ? (
          <g><circle cx={68} cy={-80} r={3} fill="#2b2140" /><circle cx={67} cy={-81} r={1} fill="#fff" /><ellipse cx={73} cy={-74} rx={3} ry={2} fill="#ff7fb0" opacity={0.5} /></g>
        ) : (
          <g><path d="M64.5 -80 Q68 -77.5 71.5 -80" stroke="#2b2140" strokeWidth={2.2} fill="none" strokeLinecap="round" /><path d="M64 -84 L71 -83" stroke="#8a7a66" strokeWidth={1.4} strokeLinecap="round" /></g>
        )}
      </g>
    </g>
  )
}

/** A pyramid far away: its sunny side and its shady side. (x, y): the middle of its base; `w` wide. */
export function Pyramid({ x, y, w = 120 }: { x: number; y: number; w?: number }) {
  const h = w * 0.62
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2} 0 L0 ${-h} L${w * 0.12} 0 Z`} fill="#f4d9a0" />
      <path d={`M${w * 0.12} 0 L0 ${-h} L${w / 2} 0 Z`} fill="#dcae6a" />
      {[0.25, 0.5, 0.75].map((t) => <path key={t} d={`M${-w / 2 + (w / 2) * t * 0.98} ${-h * t} L${w / 2 - (w / 2) * t * 0.98} ${-h * t}`} stroke="#c99a5a" strokeWidth={1.2} opacity={0.55} />)}
      <path d={`M${-w / 2} 0 L0 ${-h} L${w / 2} 0`} fill="none" stroke="#b98a4a" strokeWidth={2.2} strokeLinejoin="round" />
    </g>
  )
}

/**
 * A stone column of an Egyptian palace: painted bands near its foot and under its top, which opens out
 * like a papyrus flower, with a square block above. (x, y): its foot; `h` tall.
 */
export function Column({ x, y, h = 260, w = 40 }: { x: number; y: number; h?: number; w?: number }) {
  const stone = '#f0dfb6', line = '#b9975a'
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2 - 6} y={-10} width={w + 12} height={10} rx={3} fill="#e2cb94" stroke={line} strokeWidth={2} />
      <rect x={-w / 2} y={-h + 46} width={w} height={h - 56} fill={stone} stroke={line} strokeWidth={2.4} />
      {[-w / 4, 0, w / 4].map((fx) => <path key={fx} d={`M${fx} ${-h + 64} L${fx} -18`} stroke="#ddc590" strokeWidth={2} />)}
      {([[-40, '#3f7fd0'], [-30, '#d0503f'], [-h + 56, '#3f7fd0'], [-h + 64, '#5fae6a']] as const).map(([by, c]) => (
        <rect key={by} x={-w / 2} y={by} width={w} height={6} fill={c} />
      ))}
      <path d={`M${-w / 2} ${-h + 48} Q${-w / 2 - 22} ${-h + 22} ${-w / 2 - 16} ${-h + 10} L${w / 2 + 16} ${-h + 10} Q${w / 2 + 22} ${-h + 22} ${w / 2} ${-h + 48} Z`} fill="#8fcf8a" stroke="#4f9a5a" strokeWidth={2.4} strokeLinejoin="round" />
      {[-0.6, -0.2, 0.2, 0.6].map((t) => <path key={t} d={`M${t * w * 0.5} ${-h + 46} L${t * (w + 30)} ${-h + 12}`} stroke="#4f9a5a" strokeWidth={1.8} />)}
      <rect x={-w / 2 - 14} y={-h} width={w + 28} height={12} rx={2} fill="#e2cb94" stroke={line} strokeWidth={2.2} />
    </g>
  )
}

/** Pharaoh's throne, from the front: a tall golden back with a blue panel, golden arms, and a seat on lion's feet. (x, y): the floor under its middle. */
export function Throne({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const gold = useShade('#ffd34d', 0.35, 0.2)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{gold.def}</defs>
      <rect x={-58} y={-196} width={116} height={150} rx={14} fill={gold.fill} stroke="#c99a10" strokeWidth={3} />
      <rect x={-44} y={-182} width={88} height={122} rx={8} fill="#2a5aa8" stroke="#1f4580" strokeWidth={2.4} />
      {[-160, -136, -112, -88].map((ry) => <path key={ry} d={`M-44 ${ry} L44 ${ry}`} stroke="#ffd34d" strokeWidth={2.6} opacity={0.8} />)}
      <path d="M-74 -96 L-74 -56 L74 -56 L74 -96" fill="none" stroke="#c99a10" strokeWidth={14} strokeLinejoin="round" />
      <path d="M-74 -96 L-74 -56 L74 -56 L74 -96" fill="none" stroke="#ffd34d" strokeWidth={9} strokeLinejoin="round" />
      <rect x={-70} y={-62} width={140} height={20} rx={5} fill={gold.fill} stroke="#c99a10" strokeWidth={2.6} />
      {[-60, 60].map((lx) => (
        <g key={lx}>
          <rect x={lx - 7} y={-42} width={14} height={34} fill="#e8b830" stroke="#c99a10" strokeWidth={2.2} />
          <path d={`M${lx - 11} 0 Q${lx - 12} -10 ${lx} -10 Q${lx + 12} -10 ${lx + 11} 0 Z`} fill="#e8b830" stroke="#c99a10" strokeWidth={2.2} />
        </g>
      ))}
    </g>
  )
}

/**
 * An Egyptian storehouse for grain: a tall round mud-brick bin with a dome top, a little hatch up high
 * (heaped with grain when `full`), a door at the bottom and a ladder up the side.
 * (x, y): the middle of its foot; about 90 wide and 150 tall at s = 1.
 */
export function Granary({ x, y, s = 1, full = true, ladder = true }: { x: number; y: number; s?: number; full?: boolean; ladder?: boolean }) {
  const mud = useShade('#e2bd84', 0.3, 0.2)
  const line = '#a87e46'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{mud.def}</defs>
      <path d="M-44 0 L-44 -86 Q-44 -146 0 -150 Q44 -146 44 -86 L44 0 Z" fill={mud.fill} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      {[-26, -56, -86, -112].map((by, i) => <path key={by} d={`M${-40 + (i === 3 ? 10 : 0)} ${by} L${40 - (i === 3 ? 10 : 0)} ${by}`} stroke="#cfa66a" strokeWidth={2} />)}
      {[[-24, -40], [14, -40], [-6, -70], [26, -70], [-28, -100], [6, -100], [-12, -128], [16, -128]].map(([bx, by]) => <path key={`${bx}${by}`} d={`M${bx} ${by} l0 14`} stroke="#cfa66a" strokeWidth={2} />)}
      <ellipse cx={0} cy={-140} rx={16} ry={6} fill="#5a3e24" stroke={line} strokeWidth={2} />
      {full && <path d="M-15 -141 Q-10 -158 0 -160 Q10 -158 15 -141 Q0 -136 -15 -141 Z" fill="#f0c75a" stroke="#b8892a" strokeWidth={1.8} />}
      {full && [[-6, -150], [3, -153], [8, -146], [-2, -145]].map(([gx, gy]) => <ellipse key={`${gx}${gy}`} cx={gx} cy={gy} rx={2} ry={1.2} fill="#c9962a" />)}
      <path d="M-14 0 L-14 -26 Q-14 -36 0 -36 Q14 -36 14 -26 L14 0 Z" fill="#5a3e24" stroke={line} strokeWidth={2.4} />
      {full && <path d="M-14 0 L-14 -10 Q0 -20 14 -10 L14 0 Z" fill="#f0c75a" stroke="#b8892a" strokeWidth={1.6} />}
      {ladder && (
        <g>
          <path d="M50 2 L36 -118 M64 2 L50 -118" stroke="#8a5a2e" strokeWidth={4} strokeLinecap="round" />
          {[-12, -36, -60, -84, -106].map((ry) => <path key={ry} d={`M${49 + ry * 0.118} ${ry} l14 0`} stroke="#8a5a2e" strokeWidth={3} strokeLinecap="round" />)}
        </g>
      )}
    </g>
  )
}

/** A full sack of grain, tied at the top. (x, y): its bottom middle; about 56 tall at s = 1. */
export function GrainSack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-1} rx={24} ry={3.5} fill="#000" opacity={0.1} />
      <path d="M-8 -44 Q-28 -36 -26 -14 Q-25 0 0 0 Q25 0 26 -14 Q28 -36 8 -44 Z" fill="#d8b47a" stroke="#9a7442" strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M-9 -44 Q-12 -54 -4 -56 L4 -56 Q12 -54 9 -44 Z" fill="#d8b47a" stroke="#9a7442" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M-9 -45 Q0 -41 9 -45" stroke="#7a5233" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M-4 -56 Q0 -61 4 -56" fill="#f0c75a" stroke="#b8892a" strokeWidth={1.4} />
      <path d="M-14 -24 q4 8 0 16 M10 -28 q-4 8 1 18" stroke="#b9925a" strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A heap of golden grain. (x, y): the middle of its foot; `w` wide. */
export function GrainPile({ x, y, w = 120 }: { x: number; y: number; w?: number }) {
  const h = w * 0.42
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2} 0 Q${-w / 4} ${-h} 0 ${-h} Q${w / 4} ${-h} ${w / 2} 0 Z`} fill="#f0c75a" stroke="#b8892a" strokeWidth={2.4} strokeLinejoin="round" />
      {Array.from({ length: Math.round(w / 9) }, (_, i) => {
        const gx = -w / 2 + 12 + ((i * 37) % (w - 24)), gy = -4 - ((i * 23) % Math.max(8, h * 0.6))
        return <ellipse key={i} cx={gx} cy={gy} rx={2.4} ry={1.4} fill="#c9962a" transform={`rotate(${(i * 47) % 180} ${gx} ${gy})`} />
      })}
      <path d={`M${-w / 4} ${-h * 0.7} Q0 ${-h * 1.02} ${w / 6} ${-h * 0.8}`} stroke="#fff3c0" strokeWidth={3} fill="none" opacity={0.7} strokeLinecap="round" />
    </g>
  )
}

/**
 * A dream: a soft white cloud of a bubble, with little puffs trailing down to the dreamer's head, and the
 * dream drawn inside it (`children`, in scene units, clipped to the bubble). (x, y, w, h): its box (its
 * bumps reach about 20 beyond it); `from`: the dreamer's head; `to`: where the puffs meet the bubble (its
 * bottom left, unless said); `sky`: the dream's background.
 */
export function Dream({ x, y, w, h, from, to, sky = '#fff7d6', children }: { x: number; y: number; w: number; h: number; from: Pt; to?: Pt; sky?: string; children: ReactNode }) {
  const uid = uidOf(useId())
  // A scalloped cloud: bumps all round the box.
  const pts: Pt[] = []
  const n = Math.max(2, Math.round(w / 70)), m = Math.max(2, Math.round(h / 70))
  for (let i = 0; i < n; i++) pts.push([x + (w * i) / n, y])
  for (let i = 0; i < m; i++) pts.push([x + w, y + (h * i) / m])
  for (let i = n; i > 0; i--) pts.push([x + (w * i) / n, y + h])
  for (let i = m; i > 0; i--) pts.push([x, y + (h * i) / m])
  const d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} ` + pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length]
    const r = (Math.hypot(q[0] - p[0], q[1] - p[1]) * 0.6).toFixed(1)
    return `A${r} ${r} 0 0 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)}`
  }).join(' ') + ' Z'
  const [fx, fy] = from
  const near: Pt = to ?? [x + Math.min(w * 0.12, 60), y + h + 6]
  return (
    <g>
      {[0.2, 0.48, 0.76].map((t, i) => (
        <circle key={t} cx={fx + (near[0] - fx) * t} cy={fy + (near[1] - fy) * t} r={5 + i * 4} fill="#fff" stroke="#c9b8e8" strokeWidth={2.5} />
      ))}
      <defs><clipPath id={`dr${uid}`}><path d={d} /></clipPath></defs>
      <path d={d} fill="#fff" stroke="#c9b8e8" strokeWidth={8} strokeLinejoin="round" />
      <g clipPath={`url(#dr${uid})`}>
        <rect x={x - 40} y={y - 40} width={w + 80} height={h + 80} fill={sky} />
        {children}
      </g>
      <path d={d} fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
    </g>
  )
}

/** A speech bubble with its tail pointing at whoever is talking (`to`), and a little picture inside. */
function Bubble({ x, y, w, h, to, children }: { x: number; y: number; w: number; h: number; to: Pt; children?: ReactNode }) {
  const r = 22
  const tx = Math.min(Math.max(to[0], x + r + 24), x + w - r - 24)
  return (
    <g>
      <path
        d={`M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${tx + 14} L${to[0]} ${to[1]} L${tx - 12} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`}
        fill="#fff" stroke="#c9b8e8" strokeWidth={4} strokeLinejoin="round"
      />
      {children}
    </g>
  )
}

/** A woven sleeping mat, its fringe at the ends. (x, y): its middle; about 210 long at s = 1. */
export function Mat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-100 -8 Q-101 -14 -93 -14 L93 -14 Q101 -14 100 -8 L96 6 Q94 10 87 10 L-87 10 Q-94 10 -96 6 Z" fill="#dcbf86" stroke="#a8803e" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-92 -5 L92 -5 M-94 3 L94 3" stroke="#c49a52" strokeWidth={2} />
      <path d="M-100 -8 l-7 3 M-98 0 l-8 2 M-96 7 l-7 3 M100 -8 l7 3 M98 0 l8 2 M96 7 l7 3" stroke="#a8803e" strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

/** A heart, for love. (x, y): its middle. */
export function Heart({ x, y, s = 1, color = '#ff6f9f' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pa-twinkle">
        <path d="M0 12 C-22 -2 -20 -20 -9 -20 C-4 -20 -1 -16 0 -13 C1 -16 4 -20 9 -20 C20 -20 22 -2 0 12 Z" fill={color} stroke={ink(color)} strokeWidth={2.4} strokeLinejoin="round" />
        <ellipse cx={-8} cy={-12} rx={4} ry={2.6} fill="#fff" opacity={0.6} transform="rotate(-30 -8 -12)" />
      </g>
    </g>
  )
}

/** Joseph's coat held up by its shoulders, hanging down (figure units, for a Figure's `item` with pose "present"). */
function HeldCoat() {
  const uid = uidOf(useId())
  const d = 'M-20 -70 L20 -70 L30 -62 L42 -36 L32 -32 L23 -50 L28 -4 L-28 -4 L-23 -50 L-32 -32 L-42 -36 L-30 -62 Z'
  return (
    <g>
      <defs><clipPath id={`hc${uid}`}><path d={d} /></clipPath></defs>
      <g clipPath={`url(#hc${uid})`}>
        {COAT_COLORS.map((c, i) => <rect key={c} x={-50} y={-70 + i * 11} width={100} height={11.5} fill={c} />)}
        <rect x={-50} y={-70} width={100} height={70} fill="#fff" opacity={0.12} />
      </g>
      <path d={d} fill="none" stroke={COAT_INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-9 -70 Q0 -60 9 -70" stroke={COAT_INK} strokeWidth={2} fill="#7a5233" />
    </g>
  )
}

/** A painted wall of an Egyptian palace (a lotus frieze along the top), and its tiled floor from y = 340. */
function PalaceRoom({ night }: { night?: boolean }) {
  const wall = night ? '#4a4c8c' : '#f1dfb4'
  const frieze = night ? '#3a3c72' : '#e3c78c'
  const floor = night ? '#6e6488' : '#e3c48a'
  const tile = night ? '#5e5478' : '#d2b074'
  return (
    <g>
      <rect x={0} y={0} width={800} height={340} fill={wall} />
      <rect x={0} y={0} width={800} height={38} fill={frieze} />
      {Array.from({ length: 21 }, (_, i) => {
        const fx = i * 40 + 20
        const c = ['#3f7fd0', '#d0503f', '#5fae6a'][i % 3]
        return (
          <g key={i} opacity={night ? 0.7 : 1}>
            <path d={`M${fx} 32 L${fx - 10} 10 Q${fx} 16 ${fx + 10} 10 Z`} fill={c} />
            <circle cx={fx} cy={8} r={3} fill="#ffd34d" />
          </g>
        )
      })}
      <rect x={0} y={38} width={800} height={5} fill="#ffd34d" opacity={night ? 0.5 : 0.9} />
      <rect x={0} y={292} width={800} height={48} fill={night ? '#3e4078' : '#e2c890'} />
      <rect x={0} y={292} width={800} height={5} fill="#3f7fd0" opacity={night ? 0.6 : 1} />
      <rect x={0} y={334} width={800} height={6} fill="#ffd34d" opacity={night ? 0.5 : 0.9} />
      <rect x={0} y={340} width={800} height={110} fill={floor} />
      {[372, 410].map((ty) => <path key={ty} d={`M0 ${ty} L800 ${ty}`} stroke={tile} strokeWidth={2} />)}
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${i * 80 + (i % 2) * 20} 340 L${i * 80 - 30 + (i % 2) * 20} 450`} stroke={tile} strokeWidth={2} />)}
    </g>
  )
}

/** Pharaoh's bed, side-on: a golden frame on lion's legs, a soft white mattress, and a tall footboard. (x, y): the floor under its middle; the mattress top is 60 up. */
function RoyalBed({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={112} y={-112} width={16} height={84} rx={5} fill="#e8b830" stroke="#c99a10" strokeWidth={2.4} />
      <rect x={114} y={-104} width={12} height={58} rx={3} fill="#2a5aa8" />
      {[-112, 104].map((lx) => (
        <path key={lx} d={`M${lx} -34 L${lx} -10 Q${lx - 4} -2 ${lx - 10} 0 L${lx + 14} 0 Q${lx + 10} -6 ${lx + 10} -12 L${lx + 10} -34 Z`} fill="#e8b830" stroke="#c99a10" strokeWidth={2.2} strokeLinejoin="round" />
      ))}
      <rect x={-124} y={-42} width={248} height={14} rx={5} fill="#e8b830" stroke="#c99a10" strokeWidth={2.4} />
      <rect x={-120} y={-60} width={236} height={20} rx={9} fill="#fbf8ef" stroke="#cfc6b4" strokeWidth={2.4} />
      <path d="M-116 -46 L112 -46" stroke="#5fb7ff" strokeWidth={3} strokeDasharray="10 6" opacity={0.7} />
    </g>
  )
}

/** Tall papyrus reeds by the river, swaying. (x, y): their foot. */
function Reeds({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sc-sway">
        {[[-10, -64, -16], [0, -80, 0], [10, -60, 14]].map(([dx, h, tilt]) => (
          <g key={dx}>
            <path d={`M${dx} 0 Q${dx + tilt * 0.3} ${h / 2} ${dx + tilt * 0.6} ${h}`} stroke="#4f9a4a" strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M${dx + tilt * 0.6} ${h} l-9 -10 q9 -6 18 0 Z`} fill="#6cc46a" stroke="#3f8a3a" strokeWidth={1.4} strokeLinejoin="round" />
          </g>
        ))}
      </g>
    </g>
  )
}

/** A whitewashed Egyptian house: flat roof, a painted band, a doorway between two little columns, high windows. (x, y): the middle of its foot. */
function EgyptHouse({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-120} y={-150} width={240} height={150} fill="#f6ecd6" stroke="#c9a46a" strokeWidth={3} />
      <rect x={-128} y={-162} width={256} height={14} rx={3} fill="#e8d6ae" stroke="#c9a46a" strokeWidth={2.4} />
      <rect x={-120} y={-146} width={240} height={8} fill="#3f7fd0" />
      <path d="M-120 -134 L120 -134" stroke="#d0503f" strokeWidth={3} strokeDasharray="8 6" />
      {[-84, 84].map((wx) => <rect key={wx} x={wx - 14} y={-118} width={28} height={18} rx={3} fill="#5a4030" stroke="#c9a46a" strokeWidth={2} />)}
      <path d="M-26 0 L-26 -88 L26 -88 L26 0 Z" fill="#6b4a2e" stroke="#a8803e" strokeWidth={2.4} />
      <rect x={-34} y={-98} width={68} height={10} fill="#ffd34d" stroke="#c99a10" strokeWidth={1.8} />
      {[-44, 44].map((cx) => (
        <g key={cx}>
          <rect x={cx - 7} y={-88} width={14} height={88} fill="#efe0bc" stroke="#c9a46a" strokeWidth={2} />
          <path d={`M${cx - 7} -88 Q${cx - 13} -98 ${cx - 10} -102 L${cx + 10} -102 Q${cx + 13} -98 ${cx + 7} -88 Z`} fill="#8fcf8a" stroke="#4f9a5a" strokeWidth={1.8} />
        </g>
      ))}
    </g>
  )
}

/** A painting on the palace wall, of what Pharaoh's dream meant: fat cows and lots of food, then skinny cows and none. (x, y, w, h): its frame. */
function Mural({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#fbf1d8" stroke="#c99a10" strokeWidth={6} />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx={4} fill="none" stroke="#3f7fd0" strokeWidth={2.5} />
      <path d={`M${x + w / 2} ${y + 10} L${x + w / 2} ${y + h - 10}`} stroke="#c99a10" strokeWidth={4} />
      {/* lots of food */}
      <path d={`M${x + 12} ${y + h - 28} L${x + w / 2 - 8} ${y + h - 28}`} stroke="#9cc07a" strokeWidth={6} strokeLinecap="round" />
      <Sheaf x={x + 34} y={y + h - 26} s={0.5} />
      <GrainPile x={x + 72} y={y + h - 26} w={54} />
      <DreamCow x={x + w * 0.33} y={y + h - 24} s={0.5} fat />
      {/* no food */}
      <path d={`M${x + w / 2 + 8} ${y + h - 28} L${x + w - 12} ${y + h - 28}`} stroke="#d8b878" strokeWidth={6} strokeLinecap="round" />
      <DreamCow x={x + w * 0.69} y={y + h - 24} s={0.5} />
      <Basket x={x + w - 38} y={y + h - 46} s={0.6} />
    </g>
  )
}

/** A stone platform with a step, where a ruler stands. (x, y): the middle of its top; `w` wide. */
function Dais({ x, y, w = 220 }: { x: number; y: number; w?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={0} width={w} height={26} fill="#ead2a0" stroke="#b9975a" strokeWidth={2.6} />
      <rect x={-w / 2 - 18} y={26} width={w + 36} height={24} fill="#e2c890" stroke="#b9975a" strokeWidth={2.6} />
      <rect x={-w / 2} y={6} width={w} height={5} fill="#3f7fd0" opacity={0.8} />
    </g>
  )
}

// ---------- The pages ----------

// 1. "Long ago, a man named Jacob had twelve sons. He loved his son Joseph very, very much."
// Every one of the twelve sons is here, to tap and count: ten big brothers, Joseph (his father's hand on
// his shoulder) and little Benjamin. Their tents are behind them on the hills.
const Page1 = () => {
  const jx = 402, jy = 440, js = 1.12 // Jacob
  const ox = 500, oy = 438, os = 1.08 // Joseph
  // Jacob's hand on Joseph's near shoulder, in Jacob's units.
  const hand: Pt = [(ox - 18 * os - jx) / js, (oy - 84 * os - jy) / js]
  return (
    <Scene sky="day" ground="hills" sun>
      <Tent x={170} y={276} s={0.62} />
      <Tent x={640} y={282} s={0.56} />
      <Tap say="Baa! Baa!" sfx="pop">
        <Sheep x={290} y={302} s={0.5} />
        <Sheep x={336} y={296} s={0.44} facing="left" />
      </Tap>
      {/* the big brothers, at the back, then in front */}
      {([[0, 52], [1, 140], [2, 228], [5, 572], [6, 660], [7, 748]] as const).map(([b, bx]) => (
        <Tap key={b} count="sons" sfx="pop"><Figure x={bx} y={348} s={0.74} look={BROTHERS[b]} blinkDelay={b * 0.7} /></Tap>
      ))}
      {([[3, 96], [4, 196], [8, 604], [9, 704]] as const).map(([b, bx]) => (
        <Tap key={b} count="sons" sfx="pop"><Figure x={bx} y={442} s={0.86} look={BROTHERS[b]} blinkDelay={b * 0.45} /></Tap>
      ))}
      <Tap count="sons" sfx="pop"><Figure x={312} y={440} s={1.1} look={P.benjamin} blinkDelay={1.3} /></Tap>
      <Tap count="sons" sfx="pop"><Figure x={ox} y={oy} s={os} look={P.joseph} blinkDelay={0.6} /></Tap>
      <Tap say="Joseph, my son, I love you so much!" sfx="good">
        <Figure x={jx} y={jy} s={js} look={P.jacob} pose="hug-right" reach={[null, hand]} holding="staff" heldHand={0} />
      </Tap>
      <Tap say="Jacob loved Joseph very, very much!" sfx="sparkle">
        <Heart x={452} y={258} s={1.05} />
      </Tap>
    </Scene>
  )
}

// 2. "One day, Jacob gave Joseph a beautiful coat. It had many colors: red, orange, yellow, green, blue,
// and purple!" Joseph throws his arms up in his new coat, its six colors top to bottom; his father beams.
const Page2 = () => (
  <Scene sky="day" ground="meadow" sun>
    <Tent x={706} y={336} s={0.66} />
    <Tap say="Baa! What a pretty coat!" sfx="pop">
      <Sheep x={78} y={424} s={0.9} />
    </Tap>
    <Tap say="This beautiful coat is for you, Joseph!" sfx="good">
      <Figure x={262} y={432} s={1.55} look={P.jacob} pose="open" mood="joy" />
    </Tap>
    <Glow x={500} y={286} r={170} color="#fff3c0" />
    <Tap say="Red, orange, yellow, green, blue, and purple! Thank you, Father!" sfx="sparkle">
      <Figure x={500} y={434} s={1.6} look={P.josephCoat} pose="arms-up" mood="joy" blinkDelay={0.8} />
    </Tap>
    <g pointerEvents="none"><Sparkles spots={[[408, 196, 9], [596, 190, 8], [610, 320, 6], [392, 330, 6], [500, 150, 7]]} /></g>
  </Scene>
)

// 3. "One night, Joseph had a dream. There were bundles of grain in a field. Joseph's bundle stood up
// tall, and his brothers' bundles all bowed down to it!" Joseph asleep under his coat; in the dream, his
// bundle stands tall in the light, and his eleven brothers' bundles bow to it from both sides.
const Page3 = () => (
  <Scene sky="night" ground="none" clouds={false}>
    <Tap say="Good night, Joseph!" sfx="sparkle"><Moon x={84} y={70} s={0.8} /></Tap>
    <path d="M0 368 Q220 336 430 362 T800 352 L800 450 L0 450 Z" fill="#2f5a4e" />
    <path d="M0 404 Q240 384 480 404 T800 398 L800 450 L0 450 Z" fill="#284e44" />
    <g opacity={0.8}><Tent x={712} y={398} s={0.5} /></g>
    <Dream x={268} y={24} w={496} h={284} from={[150, 352]} sky="#fff4c8">
      <rect x={220} y={178} width={600} height={160} fill="#efd27a" />
      <path d="M220 180 Q500 166 820 182" stroke="#e2bf5e" strokeWidth={6} fill="none" />
      {[[300, 250], [370, 300], [690, 246], [610, 302], [470, 236], [560, 230]].map(([gx, gy]) => <path key={gx} d={`M${gx} ${gy} l-4 -7 M${gx + 6} ${gy} l0 -8 M${gx + 12} ${gy} l4 -7`} stroke="#d4ae4a" strokeWidth={2} strokeLinecap="round" />)}
      <Glow x={515} y={196} r={118} color="#fff8c0" />
      <Tap say="All the other bundles bow down!" sfx="swish">
        {[300, 356, 412].map((sx) => <Sheaf key={sx} x={sx} y={214} s={0.64} bow={50} />)}
        {[620, 676, 732].map((sx) => <Sheaf key={sx} x={sx} y={214} s={0.64} bow={-50} />)}
        {[316, 382, 448].map((sx) => <Sheaf key={sx} x={sx} y={292} s={0.8} bow={46} />)}
        {[590, 660].map((sx) => <Sheaf key={sx} x={sx} y={292} s={0.8} bow={-46} />)}
      </Tap>
      <Tap say="Look! My bundle is standing up tall!" sfx="ding">
        <Sheaf x={518} y={270} s={1.3} />
      </Tap>
      <g pointerEvents="none"><Sparkles spots={[[470, 96, 7], [566, 90, 9], [518, 62, 6]]} /></g>
    </Dream>
    <Mat x={196} y={414} s={0.92} />
    <Tap say="Snore, snore. What a dream!" sfx="pop">
      <Sleeper x={112} y={408} s={0.84} look={P.josephCoat} blanket={COAT_COLORS} />
    </Tap>
  </Scene>
)

// 4. "Joseph told his brothers all about his dream. But his brothers did not like it. They were jealous of
// Joseph and his beautiful coat. Grumble, grumble!" Joseph tells it (his bubble shows the bowing bundles);
// all ten big brothers scowl with their arms crossed.
const Page4 = () => (
  <Scene sky="day" ground="meadow">
    <Tent x={744} y={330} s={0.55} />
    <Tap say="Hmph! Grumble, grumble!" sfx="wobble">
      {[0, 1, 2, 5, 6].map((b, i) => <Figure key={b} x={64 + i * 92} y={350} s={0.84} look={BROTHERS[b]} pose={i === 2 ? 'stand' : 'cross'} mood="grumpy" blinkDelay={i * 0.6} />)}
    </Tap>
    <Tap say="We do not like that dream one bit!" sfx="oof">
      {[3, 4, 7, 8, 9].map((b, i) => <Figure key={b} x={108 + i * 94} y={440} s={0.94} look={BROTHERS[b]} pose={i === 3 ? 'stand' : 'cross'} mood="grumpy" blinkDelay={i * 0.4 + 0.3} />)}
    </Tap>
    <Bubble x={506} y={58} w={250} h={146} to={[640, 254]}>
      <path d="M522 186 L740 186" stroke="#e2bf5e" strokeWidth={5} strokeLinecap="round" />
      <Sheaf x={572} y={186} s={0.66} bow={46} />
      <Sheaf x={631} y={188} s={0.9} />
      <Sheaf x={690} y={186} s={0.66} bow={-46} />
    </Bubble>
    <Tap say="My bundle stood up tall, and your bundles bowed down to it!" sfx="ding">
      <Figure x={662} y={438} s={1.3} look={P.josephCoat} pose="point" facing="left" />
    </Tap>
  </Scene>
)

// 5. "His brothers were so jealous that they took his coat. Then they sent Joseph far away, to a land
// called Egypt." Back home on the green hill, a brother holds up the coat; Joseph goes with traders and
// their camel along the desert road, toward Egypt's pyramids far away. God's light goes with him.
const Page5 = () => {
  const cx = 566, cy = 432, cs = 1.08 // the camel
  const tx = 728, ty = 436, ts = 1 // the trader leading it
  return (
    <Scene sky="day" ground="none">
      {/* far away: the desert, and Egypt's pyramids on the skyline */}
      <path d="M0 282 Q200 266 400 278 T800 272 L800 450 L0 450 Z" fill="#f2d39a" />
      <Tap say="Egypt is far, far away." sfx="whoosh">
        <Pyramid x={668} y={278} w={116} />
        <Pyramid x={756} y={280} w={84} />
      </Tap>
      <path d="M0 330 Q240 300 480 326 T800 318 L800 450 L0 450 Z" fill="#ebc887" />
      {/* home: a green hill */}
      <path d="M-10 460 L-10 228 Q70 196 156 212 Q232 228 268 286 Q296 334 326 374 Q350 412 366 460 Z" fill="#8fd18a" stroke="#6cae66" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-10 460 L-10 300 Q110 280 210 316 Q276 346 306 400 Q322 430 330 460 Z" fill="#7cc46a" />
      {/* the road to Egypt, from the foot of the hill */}
      <path d="M380 470 Q400 400 520 372 Q670 348 820 334" stroke="#f7e4b4" strokeWidth={46} fill="none" strokeLinecap="round" />
      {/* the brothers at home: one holds up Joseph's coat */}
      <Figure x={50} y={254} s={0.64} look={BROTHERS[3]} pose="cross" mood="grumpy" blinkDelay={0.4} />
      <Figure x={198} y={264} s={0.64} look={BROTHERS[2]} pose="cross" mood="grumpy" blinkDelay={1.2} />
      <Figure x={124} y={262} s={0.7} look={BROTHERS[1]} pose="present" mood="grumpy" item={<HeldCoat />} />
      {/* on the road to Egypt, with God's light */}
      <Glow x={424} y={318} r={110} color="#fff3c0" />
      <Tap say="I miss my home. But God is with me." sfx="good">
        <Figure x={424} y={436} s={1.12} look={P.joseph} mood="sad" />
      </Tap>
      <Tap say="Plod, plod, plod. Off to Egypt we go!" sfx="wobble">
        <Camel x={cx} y={cy} s={cs} />
      </Tap>
      <path d={`M${cx + 118 * cs} ${cy - 164 * cs} Q${tx + 30} ${ty - 160} ${tx + 54 * ts} ${ty - 92 * ts}`} stroke="#7a5233" strokeWidth={2.6} fill="none" />
      <Figure x={tx} y={ty} s={ts} look={P.trader} pose="point" />
    </Scene>
  )
}

// 6. "Far away in Egypt, God was with Joseph. Joseph worked hard, and he was kind to everyone." In Egypt
// (pyramids, palms, a whitewashed house), Joseph carries a heavy jar of water, and brings some to a kind
// old man; a little girl waves hello. God's light shines on Joseph.
const Page6 = () => (
  <Scene sky="day" ground="desert" sun>
    <Pyramid x={96} y={306} w={116} />
    <Pyramid x={182} y={310} w={80} />
    <EgyptHouse x={672} y={350} s={0.92} />
    <Palm x={44} y={396} s={1.1} />
    <Palm x={778} y={386} s={0.92} />
    <Rays x={396} y={-30} r={520} n={14} color="#fff6c0" opacity={0.3} />
    <Tap say="God is with Joseph!" sfx="sparkle"><Glow x={396} y={250} r={160} /></Tap>
    <Tap say="Hello, Joseph!" sfx="pop">
      <Figure x={230} y={436} s={1.08} look={P.egyptGirl} pose="wave" blinkDelay={1.1} />
    </Tap>
    <Tap say="Here is some cool water for you!" sfx="good">
      <Figure x={396} y={436} s={1.32} look={P.josephEgypt} holding="jar" />
    </Tap>
    <Tap say="Thank you, Joseph! You are so kind." sfx="pop">
      <Figure x={562} y={438} s={1.22} look={P.oldMan} pose="point" facing="left" holding="stick" heldHand={0} mood="joy">
        {/* a cup held out for some water */}
        <path d="M47 -104 L61 -104 L59 -90 L49 -90 Z" fill="#c98448" stroke="#8a5428" strokeWidth={1.8} strokeLinejoin="round" />
      </Figure>
    </Tap>
  </Scene>
)

// 7. "One night, Pharaoh, the king of Egypt, had a strange dream. Seven fat cows came up out of the river.
// Then seven skinny cows came up, too!" Pharaoh asleep in his golden bed; in his dream, seven fat cows on
// the near bank of the river and seven skinny cows on the far bank (tap each to count them).
const Page7 = () => (
  <Scene sky="night" ground="none" clouds={false} stars={false}>
    <PalaceRoom night />
    {/* a window: the night sky */}
    <rect x={64} y={70} width={150} height={150} rx={6} fill="#1c1a48" stroke="#c9a46a" strokeWidth={6} />
    <Moon x={162} y={118} s={0.5} />
    <path d="M68 214 L114 172 L150 214 Z" fill="#141238" />
    {[[96, 98], [132, 150], [86, 140], [190, 186]].map(([sx, sy], i) => <path key={i} className="pa-twinkle" d={sparkle(sx, sy, i % 2 ? 4 : 6)} fill="#fff8d0" />)}
    <RoyalBed x={150} y={424} />
    <Tap say="Snore, snore. What a strange dream!" sfx="wobble">
      <Sleeper x={62} y={366} s={1} look={P.pharaoh} blanket="#f2ecdc" />
    </Tap>
    <Dream x={316} y={24} w={452} h={284} from={[96, 296]} to={[310, 236]} sky="#cfeeff">
      <rect x={290} y={90} width={500} height={60} fill="#9fdc8a" />
      <rect x={290} y={148} width={500} height={48} fill="#5fb7ff" />
      <path className="sc-wave" d="M330 166 q15 -6 30 0 t30 0 M460 178 q15 -6 30 0 t30 0 M610 168 q15 -6 30 0 t30 0" stroke="#e8f6ff" strokeWidth={2.6} fill="none" />
      <rect x={290} y={194} width={500} height={140} fill="#8fd18a" />
      <Reeds x={338} y={198} s={0.7} />
      <Reeds x={750} y={198} s={0.6} />
      {Array.from({ length: 7 }, (_, i) => (
        <Tap key={`s${i}`} count="skinny cows" sfx="pop"><DreamCow x={352 + i * 60} y={146} s={0.4} /></Tap>
      ))}
      {/* (the fat cows are wider than the gaps between them, so they're drawn from the right: each one's
          face comes in front of the next cow's tail, and all seven faces show to be counted) */}
      {Array.from({ length: 7 }, (_, k) => 6 - k).map((i) => (
        <Tap key={`f${i}`} count="fat cows" sfx="pop"><DreamCow x={352 + i * 61} y={292} s={0.46} fat /></Tap>
      ))}
    </Dream>
  </Scene>
)

// 8. "God helped Joseph explain the dream to Pharaoh. First there would be lots of food, like the fat
// cows. Then there would be no food, like the skinny cows." In the palace, Joseph points to a painting of
// what it means; God's light shines on him, and Pharaoh listens, amazed.
const Page8 = () => (
  <Scene sky="day" ground="none" clouds={false}>
    <PalaceRoom />
    <Column x={30} y={344} h={300} />
    <Column x={770} y={344} h={300} />
    <Tap say="Moo! Lots of food, and then none." sfx="pop">
      <Mural x={270} y={62} w={320} h={172} />
    </Tap>
    <Throne x={172} y={436} s={1.08} />
    <Tap say="Tell me, Joseph! What does my dream mean?" sfx="ding">
      <Figure x={172} y={436} s={1.3} look={P.pharaoh} holding="crook" heldHand={0} mood="wow" />
    </Tap>
    <Rays x={620} y={-40} r={500} n={12} color="#fff6c0" opacity={0.32} />
    <Glow x={620} y={300} r={130} color="#fff6c0" />
    <Tap say="God helps me know what the dream means." sfx="sparkle">
      <Figure x={620} y={436} s={1.3} look={P.josephEgypt} pose="point" facing="left" reach={[null, [56, -118]]} blinkDelay={0.7} />
    </Tap>
  </Scene>
)

// 9. "So Pharaoh put Joseph in charge of all the food. Joseph saved up lots and lots of grain in big
// storehouses." Joseph, now in fine clothes with a gold collar, shows where the grain goes; Pharaoh is
// proud of him; workers carry sacks to the storehouses, and the grain is heaped up high.
const Page9 = () => (
  <Scene sky="day" ground="desert" sun>
    <Tap say="Full of grain!" sfx="ding">
      {[436, 538, 640, 742].map((gx, i) => <Granary key={gx} x={gx} y={334 - (i % 2) * 8} s={0.92} ladder={i === 1 || i === 3} />)}
    </Tap>
    <Tap say="So much grain!" sfx="plop">
      <GrainPile x={692} y={440} w={160} />
      <GrainSack x={574} y={440} s={1} />
      <GrainSack x={616} y={444} s={0.86} />
    </Tap>
    <Tap say="Heave ho! Into the storehouse!" sfx="plop">
      <Figure x={414} y={438} s={1} look={P.egyptMan} pose="carry" holding="sack" />
      <Figure x={502} y={424} s={0.92} look={P.egyptMan2} pose="carry" holding="sack" blinkDelay={0.9} />
    </Tap>
    <Tap say="Well done, Joseph!" sfx="good">
      <Figure x={88} y={438} s={1.22} look={P.pharaoh} pose="open" />
    </Tap>
    <Tap say="Save the grain! Then there will be food for everyone." sfx="good">
      <Figure x={244} y={436} s={1.3} look={P.josephRuler} pose="point" blinkDelay={0.5} />
    </Tap>
  </Scene>
)

// 10. "Soon there was no food anywhere. Joseph's hungry brothers came to Egypt to buy food. They bowed down
// low, just like in Joseph's dream! But they did not know it was Joseph." All eleven brothers kneel low
// before Joseph at the storehouse; Joseph remembers the bundles bowing in his dream. (They kneel with
// their hands on their knees, not pressed together: hands together with eyes closed is how children are
// shown praying, and the brothers are bowing to a man, not praying to him.)
const Page10 = () => (
  <Scene sky="day" ground="desert">
    <Granary x={744} y={318} s={0.92} ladder={false} />
    <GrainSack x={566} y={352} s={0.9} />
    <Dais x={662} y={360} w={240} />
    <Tap say="Please, sir, may we buy some food?" sfx="pop">
      {[0, 1, 2, 4, 5].map((b, i) => <Figure key={b} x={62 + i * 92} y={352} s={0.84} look={BROTHERS[b]} kneel blinkDelay={i * 0.5} />)}
      {[3, 6, 7, 8, 9].map((b, i) => <Figure key={b} x={92 + i * 92} y={438} s={0.94} look={BROTHERS[b]} kneel blinkDelay={i * 0.3} />)}
      <Figure x={546} y={440} s={0.96} look={P.benjamin} kneel />
    </Tap>
    <Tap say="Just like my dream!" sfx="sparkle">
      <Dream x={336} y={30} w={226} h={122} from={[628, 196]} to={[548, 160]} sky="#fff4c8">
        <rect x={320} y={110} width={260} height={60} fill="#efd27a" />
        <Sheaf x={378} y={136} s={0.46} bow={50} />
        <Sheaf x={412} y={136} s={0.46} bow={50} />
        <Sheaf x={449} y={132} s={0.66} />
        <Sheaf x={486} y={136} s={0.46} bow={-50} />
        <Sheaf x={520} y={136} s={0.46} bow={-50} />
      </Dream>
    </Tap>
    <Tap say="These are my brothers! But they do not know me." sfx="wobble">
      <Figure x={662} y={362} s={1.2} look={P.josephRuler} pose="open" mood="wow" />
    </Tap>
  </Scene>
)

// 11. "Joseph said, 'I am Joseph, your brother!' He forgave his brothers, and they hugged and cried happy
// tears. God turned something bad into something good!" Joseph hugs little Benjamin and Judah close, and
// all the brothers cry happy tears; hearts and God's light all around.
const Page11 = () => {
  const jx = 400, jy = 440, js = 1.38 // Joseph
  const bx = 316, bs = 1.38 * 0.74 // Benjamin (a child)
  const kx = 492, ks = 1.26 // Judah
  // Joseph's hands on their far shoulders, and theirs round his waist, each in their own units.
  const left: Pt = [(bx - 18 * bs - jx) / js, (-84 * bs) / js]
  const right: Pt = [(kx + 19 * ks - jx) / js, (-84 * ks) / js]
  return (
    <Scene sky="glory" ground="none" clouds={false}>
      <PalaceRoom />
      <Rays x={400} y={-40} r={560} n={16} color="#fff6c0" opacity={0.34} />
      <Glow x={400} y={270} r={200} color="#fff3c0" />
      <Tap say="We are so sorry, Joseph! Thank you for forgiving us." sfx="pop">
        {([[0, 56, 'joy'], [1, 146, 'teary'], [2, 236, 'joy'], [5, 580, 'teary'], [6, 666, 'joy'], [7, 748, 'teary']] as const).map(([b, x, m], i) => (
          <Figure key={b} x={x} y={372} s={0.86} look={BROTHERS[b]} pose={i % 3 === 1 ? 'arms-up' : 'open'} mood={m} blinkDelay={i * 0.4} />
        ))}
        {([[4, 92, 'teary'], [8, 200, 'joy'], [9, 690, 'teary']] as const).map(([b, x, m], i) => (
          <Figure key={b} x={x} y={446} s={0.96} look={BROTHERS[b]} pose={i === 1 ? 'pray' : 'open'} mood={m} blinkDelay={i * 0.5 + 0.2} />
        ))}
      </Tap>
      <Tap say="I am Joseph, your brother! I forgive you." sfx="good">
        <Figure x={jx} y={jy} s={js} look={P.josephRuler} pose="hug" reach={[left, right]} mood="teary" />
      </Tap>
      <Tap say="My big brother Joseph!" sfx="pop">
        <Figure x={bx} y={jy} s={js} look={P.benjamin} pose="hug-right" reach={[null, [(jx - 30 - bx) / bs, (380 - jy) / bs]]} mood="teary" />
      </Tap>
      <Tap say="We love you, Joseph!" sfx="pop">
        <Figure x={kx} y={jy} s={ks} look={BROTHERS[3]} pose="hug-right" facing="left" reach={[null, [(kx - jx - 38) / ks, -72]]} mood="teary" />
      </Tap>
      <HandOn x={bx - 18 * bs} y={jy - 84 * bs} s={js} look={P.josephRuler} />
      <HandOn x={kx + 19 * ks} y={jy - 84 * ks} s={js} look={P.josephRuler} />
      <Tap say="God turned something bad into something good!" sfx="sparkle">
        {([[400, 150, 1.4], [252, 190, 1], [550, 186, 1], [150, 122, 0.8], [652, 114, 0.8], [318, 96, 0.7], [484, 84, 0.7]] as const).map(([hx, hy, hs]) => <Heart key={hx} x={hx} y={hy} s={hs} />)}
      </Tap>
      <g pointerEvents="none"><Sparkles spots={[[360, 70, 7], [440, 60, 6], [110, 210, 6], [700, 206, 6], [200, 76, 5], [610, 70, 5]]} /></g>
    </Scene>
  )
}

export const JOSEPH_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10, Page11]
