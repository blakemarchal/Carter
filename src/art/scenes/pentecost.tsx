// Pentecost (Acts 1:3–14 and Acts 2): one picture per story page, both parts in order (see data/pentecost.ts for the
// words). Part one, pages 1 to 5: Jesus alive, eating breakfast with His friends by the lake; His promise of the Helper on
// the hill near Jerusalem; going up to heaven until a cloud hides Him; the two angels; and the friends praying together in
// the room upstairs. Part two, pages 6 to 10: the sound like a mighty rushing wind; the little flames on each one; the
// crowd from many lands hearing about God's wonders in their own languages; Peter telling everyone about Jesus, and a great
// crowd believing; and God's family sharing, praying and eating together (with you, the child playing, there too).
// God is never drawn as a person: His presence is light (Glow, Rays, Sparkles). The Holy Spirit is never drawn as a person
// either: only as wind (Gust, soft swirls) and as little flames of warm light (SpiritFlame) resting just above each head,
// like candle lights, that never burn anything. Jesus is PEOPLE.jesus, the two angels are PEOPLE.angel, and Peter, Andrew,
// James, John and Mary, Jesus' mother, are PEOPLE's; so are Mary Magdalene, Thomas and Matthew, His friends from Easter
// Morning, and one more friend (PEOPLE.disciple).
// Shared with the mini-game (art/games/pentecost.tsx), and for other islands (they can move to kit.tsx and people.tsx):
// the women among Jesus' friends (FRIENDS), the visitors from many lands (VISITORS, VisitorFigure, Dress, FolkHat,
// FarCrowd), the faces Amazed and Speaking, SpiritFlame, Gust, GloryCloud, OliveTree, Roofs, FarTemple, FarJerusalem, the
// house with the room upstairs (UpperHouse) and WonderBubble.
import { useId, type ComponentProps, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import { darken, ink, lighten, useShade } from '../kit'
import { EyesUp, Figure, Kneel, Laughing, LaughFace, LookingUp, Person, PEOPLE, ShutEyes, SKIN, Sitting, SittingOnRock, type JLook, type JPose, type Look, type Mood, type Pose } from '../people'
import { Birds, Bread, Cloud, Emoji, Fish, FishingBoat, Folk, Glow, Heart, Rays, Rock, Scene, Sparkles, Sun, Tap } from './kit'
import { usePlayer } from './player'
import './pentecost.css'

const uid = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')
type Pt = [number, number]

// ---------- People ----------

/**
 * The women who prayed with Peter, Andrew, James, John and Mary, Jesus' mother, in the room upstairs (Acts 1:14: "with the
 * women"): Mary Magdalene (PEOPLE.maryMagdalene, from Easter Morning), and two more. No woman wears a blue head scarf like
 * Mary's. (Thomas and Matthew, PEOPLE's too, and PEOPLE.disciple are the other men there.)
 */
export const FRIENDS: Look[] = [
  PEOPLE.maryMagdalene,
  /** A woman with a coral head scarf and a sage-green robe. */
  { skin: SKIN.tan, hair: 'covered', hairColor: '#3b2a20', wrap: '#e8875a', robe: '#7fb48a', sash: '#f5e6c8' },
  /** A woman with a lilac head scarf and an amber robe. */
  { skin: '#e3b48c', hair: 'covered', hairColor: '#4a3020', wrap: '#b98ad0', robe: '#e6a157', sash: '#fff1d6' },
]

/** What a visitor wears on their head, over a Person's own hair or head cloth. */
export type Hat = 'turban' | 'keffiyeh' | 'cap' | 'band'

/** A visitor's look: a Person's (or a Figure's), and their own headwear, trims and drape. */
export interface Visitor extends JLook {
  hat?: Hat
  /** The hat's color (for a keffiyeh, its cord: the head cloth itself is `wrap`). */
  hatColor?: string
  /** A band of color round the hem of the robe. */
  hem?: string
  /** A band down the front of the robe, like a coat's. */
  front?: string
  /** A border along the edge of a head scarf. */
  edge?: string
  /** A white mantle draped over one shoulder (a toga), with a stripe of this color along its edge. */
  toga?: string
}

/**
 * The visitors from many lands, in Jerusalem for the feast (Acts 2:9–11): from Persia and Media in the east, Arabia, Egypt
 * and Libya in the south, and Crete, Rome, Asia, Cappadocia and Phrygia in the north and west. Each one is dressed as at
 * home (a turban, a head cloth with a cord, a felt cap, a head band, a toga, a bright veil), with every skin tone: never a
 * caricature, always the same friendly face as everyone else.
 */
export const VISITORS: Visitor[] = [
  /** 0. From Persia: a cream turban, a long dark beard, and a deep blue coat trimmed with gold. */
  { skin: '#d9a47a', hair: 'short', hairColor: '#2b1f18', beard: 'long', beardColor: '#2b1f18', robe: '#3f6fa8', sash: '#e8c25a', hat: 'turban', hatColor: '#f2e6c8', front: '#e8c25a', hem: '#e8c25a' },
  /** 1. From Arabia: a white head cloth held on with a dark cord, and a camel-colored robe. */
  { skin: '#b07850', hair: 'covered', hairColor: '#2b1f18', wrap: '#f7f2e6', beard: 'short', beardColor: '#1f1712', robe: '#d9b98a', sash: '#8a4a2a', hat: 'keffiyeh', hatColor: '#3a302c' },
  /** 2. From Rome: short hair and no beard, in a white toga with a purple stripe. */
  { skin: '#f2c9a6', hair: 'short', hairColor: '#5a3a24', robe: '#f4efe4', toga: '#7b4fa0' },
  /** 3. From Egypt: a lady with long black hair, in white linen with a beaded collar. */
  { skin: '#b9825a', hair: 'long', hairColor: '#1f1712', robe: '#fbf6ea', sash: '#2f8fb8', collar: '#e8c25a' },
  /** 4. From Crete: curly hair, a red head band, and a teal robe with a golden hem. */
  { skin: '#e8b890', hair: 'curly', hairColor: '#3b2a20', beard: 'short', beardColor: '#3b2a20', robe: '#3f9a96', sash: '#f0d38a', hat: 'band', hatColor: '#c0504d', hem: '#f0d38a' },
  /** 5. From Libya, near Cyrene: a white turban and a sunny orange robe. */
  { skin: '#7a4a30', hair: 'short', hairColor: '#1f1712', beard: 'short', beardColor: '#1f1712', robe: '#e07a3f', sash: '#f5f0e6', hat: 'turban', hatColor: '#fbf8f1', hem: '#9a4a24' },
  /** 6. From Asia: a raspberry veil with a gold edge, and a saffron robe. */
  { skin: '#e3b48c', hair: 'covered', hairColor: '#4a3020', wrap: '#c0466a', edge: '#f2c94c', robe: '#f3cf6a', sash: '#c0466a' },
  /** 7. From Media: an older man with a white beard, a rust-red felt cap and an olive-green coat. */
  { skin: '#c68b5e', hair: 'short', hairColor: '#d8d2c8', beard: 'long', beardColor: '#ece8e0', robe: '#6a8f4a', sash: '#e8c25a', hat: 'cap', hatColor: '#a8432f', hem: '#e8c25a' },
  /** 8. From Cappadocia: a teal veil edged with gold, and a purple robe. */
  { skin: '#c68b5e', hair: 'covered', hairColor: '#3b2a20', wrap: '#2f8f7a', edge: '#f2c94c', robe: '#8f5ba8', sash: '#f2c94c' },
  /** 9. A boy from far away, in a sunny robe. */
  { skin: '#8d5a3b', hair: 'curly', hairColor: '#1f1712', robe: '#f2b33d', sash: '#2f7fa8', build: 'child' },
  /** 10. A girl from far away, with pigtails and a bow. */
  { skin: '#d9a47a', hair: 'pigtails', hairColor: '#3b2a20', robe: '#ff8f9f', sash: '#ffffff', bow: '#ff6f9a', build: 'child' },
  /** 11. From Phrygia: a blue cap, a ginger beard, and an apricot robe. */
  { skin: '#e3b48c', hair: 'short', hairColor: '#7a4a24', beard: 'short', beardColor: '#7a4a24', robe: '#d98b4a', sash: '#2f6f9f', hat: 'cap', hatColor: '#2f6f9f', hem: '#2f6f9f' },
  /** 12. From Arabia: a lady in a deep navy veil with a gold edge, and a red robe. */
  { skin: '#b07850', hair: 'covered', hairColor: '#1f1712', wrap: '#2a3a6a', edge: '#e8c25a', robe: '#c0504d', sash: '#e8c25a' },
]

/** In a Person's (or Figure's) own units: just a visitor's hat, over their own hair or head cloth. */
export function VisitorHat({ v }: { v: Visitor }) {
  const c = v.hatColor ?? '#f2e6c8'
  switch (v.hat) {
    case 'turban':
      return (
        <g strokeLinejoin="round">
          <path d="M-24.5 -112 Q-31 -138 -14 -150 Q0 -158 15 -151 Q31 -140 24.5 -112 Q14 -124 0 -124.5 Q-14 -124 -24.5 -112 Z" fill={c} stroke={ink(c)} strokeWidth={2.4} />
          <path d="M-22.5 -124 Q-4 -138 23 -128 M-20 -137 Q0 -150 21 -140" stroke={darken(c, 0.16)} strokeWidth={2} fill="none" strokeLinecap="round" />
          <circle cx={1} cy={-130.5} r={3.4} fill="#e8c25a" stroke="#a8761c" strokeWidth={1.2} />
        </g>
      )
    case 'keffiyeh':
      return (
        <g fill="none" strokeLinecap="round">
          <path d="M-23.5 -128 Q0 -143 23.5 -128" stroke={c} strokeWidth={4.4} />
          <path d="M-24.5 -122.5 Q0 -137.5 24.5 -122.5" stroke={c} strokeWidth={3.6} />
        </g>
      )
    case 'cap':
      return (
        <g strokeLinejoin="round">
          <path d="M-21.5 -121 Q-23 -148 0 -149 Q23 -148 21.5 -121 Q0 -128 -21.5 -121 Z" fill={c} stroke={ink(c)} strokeWidth={2.4} />
          <path d="M-21.5 -125 Q0 -132 21.5 -125" stroke={darken(c, 0.2)} strokeWidth={3} fill="none" />
          <path d="M-10 -141 Q-4 -145 3 -144" stroke={lighten(c, 0.35)} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>
      )
    case 'band':
      return (
        <g fill="none" strokeLinecap="round">
          <path d="M-23.5 -123 Q0 -131 23.5 -123" stroke={ink(c)} strokeWidth={5.6} />
          <path d="M-23.5 -123 Q0 -131 23.5 -123" stroke={c} strokeWidth={3.4} />
        </g>
      )
    default:
      return null
  }
}

/** In a Person's (or Figure's) own units: a visitor's hat, the edge of their veil, and the trims and drape on their robe. */
export function Dress({ v }: { v: Visitor }) {
  return (
    <g>
      {v.hem && <path d="M-33.8 -17 Q0 -8 33.8 -17 L35 -10 Q0 -1 -35 -10 Z" fill={v.hem} />}
      {v.front && <path d="M-3.4 -93 L-4.2 -6.5 L4.2 -6.5 L3.4 -93 Z" fill={v.front} />}
      {v.toga && (
        <g fill="none" strokeLinecap="round">
          <path d="M-21 -90 Q-2 -79 8 -60 Q16 -42 30 -27" stroke={ink('#f4efe4')} strokeWidth={13} />
          <path d="M-21 -90 Q-2 -79 8 -60 Q16 -42 30 -27" stroke="#fbf8f1" strokeWidth={10} />
          <path d="M-19 -84.5 Q0 -73.5 10.5 -55 Q18 -38 31 -22.5" stroke={v.toga} strokeWidth={2.6} />
        </g>
      )}
      {v.edge && <path d="M-25 -112 Q-14 -128 0 -127 Q14 -128 25 -112" stroke={v.edge} strokeWidth={3.2} fill="none" strokeLinecap="round" />}
      <VisitorHat v={v} />
    </g>
  )
}

type FigureProps = ComponentProps<typeof Figure>

/** A visitor from far away: a Figure in their look, with their hat and trims (`children` drawn over them, in their units). */
export function VisitorFigure({ v, children, ...p }: Omit<FigureProps, 'look'> & { v: Visitor }) {
  return <Figure {...p} look={v}><Dress v={v} />{children}</Figure>
}

/** Visitors with hats, for the little people far off in a crowd. */
const HATTED = [VISITORS[0], VISITORS[7], VISITORS[5], VISITORS[11], VISITORS[4]]

/** A visitor's hat on one of the kit's little Folk (whose head is half a Person's): x, y, s (and `sit`) as the Folk's. */
export const FolkHat = ({ x, y, s = 1, sit, v }: { x: number; y: number; s?: number; sit?: boolean; v: Visitor }) => (
  <g transform={`translate(${x} ${y + (sit ? -38 : -54) * s}) scale(${s * 0.5}) translate(0 114)`}><VisitorHat v={v} /></g>
)

/**
 * Rows of little people far off in a crowd (the kit's Folk), every third one in a visitor's hat: [y, s, xs] for each row,
 * the farthest first. `wave`: about one in this many waves.
 */
export function FarCrowd({ rows, seed = 0, wave = 4 }: { rows: [number, number, number[]][]; seed?: number; wave?: number }) {
  let n = seed
  return (
    <g>
      {rows.map(([y, s, xs]) => xs.map((x, j) => {
        const i = n++
        const yy = y + (j % 2) * 3 * s
        return (
          <g key={`${y}-${j}`}>
            <Folk x={x} y={yy} s={s} i={i} wave={i % wave === 2} />
            {i % 3 === 0 && <FolkHat x={x} y={yy} s={s} v={HATTED[i % HATTED.length]} />}
          </g>
        )
      }))}
    </g>
  )
}

// ---------- Faces (in a Person's own units, drawn over their face) ----------

/** Amazed: eyebrows up and an "oh!" mouth over the smile (in the beard, colored `beard`); `skin` hides the smile. (As on Boy Jesus at the Temple.) */
export const Amazed = ({ skin, beard }: { skin: string; beard?: string }) => (
  <g>
    <path d="M-12.5 -121 Q-8.5 -125 -4.5 -122 M12.5 -121 Q8.5 -125 4.5 -122" stroke="#2b2140" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    {beard ? (
      <g>
        <ellipse cx={0} cy={-98.4} rx={5.6} ry={2.6} fill={beard} />
        <ellipse cx={0} cy={-98} rx={2.7} ry={3.3} fill="#6b2a3a" stroke="#d0707e" strokeWidth={1.1} />
      </g>
    ) : (
      <g>
        <ellipse cx={0} cy={-104.2} rx={6.8} ry={3.4} fill={skin} />
        <ellipse cx={0} cy={-103.6} rx={2.9} ry={3.6} fill="#6b2a3a" stroke="#4a1a2a" strokeWidth={1.1} />
      </g>
    )}
  </g>
)

/** Speaking happily, eyes open: a big open smile over the little one (in the beard, for someone bearded). */
export const Speaking = ({ beard }: { beard?: boolean }) => (
  beard
    ? <path d="M-5.5 -100.5 Q0 -92 5.5 -100.5 Q0 -98.5 -5.5 -100.5 Z" fill="#8a2f45" stroke="#d0707e" strokeWidth={1.4} strokeLinejoin="round" />
    : <path d="M-6 -106 Q0 -98 6 -106 Q0 -104 -6 -106 Z" fill="#8a2f45" stroke="#4a1a2a" strokeWidth={1.3} strokeLinejoin="round" />
)

// ---------- God's Spirit: the little flames and the wind ----------

/** Where a little flame sits over a Person's head, in their own units: its foot just above the top of their hair. */
export const FLAME_AT = -150

/**
 * A little flame of God's light (Acts 2:3), resting just above someone's head: small, soft and glowing, like a candle's
 * flame, with a warm glow round it. It never burns anything. (x, y) = its foot; h tall. Give it to a Person as a child at
 * (0, FLAME_AT). `d`: when it flickers.
 */
export function SpiritFlame({ x = 0, y = FLAME_AT, h = 30, d = 0 }: { x?: number; y?: number; h?: number; d?: number }) {
  const id = uid(useId())
  const drop = (k: number, up = 0) => {
    const w = h * 0.3 * k, hh = h * k, b = y - up
    return `M${x} ${b - hh} C${x + w * 0.35} ${b - hh * 0.72} ${x + w} ${b - hh * 0.52} ${x + w} ${b - hh * 0.3} C${x + w} ${b - hh * 0.08} ${x + w * 0.55} ${b} ${x} ${b} `
      + `C${x - w * 0.55} ${b} ${x - w} ${b - hh * 0.08} ${x - w} ${b - hh * 0.3} C${x - w} ${b - hh * 0.52} ${x - w * 0.35} ${b - hh * 0.72} ${x} ${b - hh} Z`
  }
  return (
    <g>
      <defs>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#fff4c0" stopOpacity={0.9} />
          <stop offset="0.45" stopColor="#ffd56e" stopOpacity={0.38} />
          <stop offset="1" stopColor="#ffc24a" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffbe48" />
          <stop offset="1" stopColor="#ff8f3a" />
        </linearGradient>
      </defs>
      <g className="pc-glow" style={{ animationDelay: `${-d}s` } as CSSProperties}>
        <circle cx={x} cy={y - h * 0.42} r={h * 0.92} fill={`url(#${id}g)`} />
      </g>
      <g className="pc-flicker" style={{ animationDelay: `${-d * 0.7}s` } as CSSProperties}>
        <path d={drop(1)} fill={`url(#${id}f)`} stroke="#ef7f2c" strokeWidth={h * 0.045} strokeLinejoin="round" />
        <path d={drop(0.68, h * 0.035)} fill="#ffd65c" />
        <path d={drop(0.38, h * 0.06)} fill="#fff9de" />
      </g>
    </g>
  )
}

/**
 * A swirl of the rushing wind from heaven (Acts 2:2): a long soft curve ending in a curl, pale and bright, with a gleam
 * running along it. (x, y) = where it starts; it blows to the right, `len` long (`flip`: to the left), turned `rot`
 * degrees; `w` thick, with a pale blue `edge` (`eo`: how strong). `d`: when it moves. Only ever swirls: the wind never
 * has a face.
 */
export function Gust({ x, y, len = 200, s = 1, flip, rot = 0, d = 0, w = 5, o = 0.9, edge = '#a9cfe8', eo }: {
  x: number; y: number; len?: number; s?: number; flip?: boolean; rot?: number; d?: number; w?: number; o?: number; edge?: string; eo?: number
}) {
  const L = len
  const path = `M0 0 C${L * 0.22} -16 ${L * 0.42} 14 ${L * 0.66} 0 C${L * 0.8} -8 ${L * 0.93} -8 ${L} -22 `
    + `C${L + 7} -36 ${L - 10} -48 ${L - 21} -38 C${L - 28} -31 ${L - 20} -21 ${L - 11} -27`
  return (
    <g className="pc-drift" style={{ animationDelay: `${-d}s` } as CSSProperties}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} stroke={edge} strokeWidth={w + 3.5} opacity={eo ?? o * 0.55} />
        <path d={path} stroke="#ffffff" strokeWidth={w} opacity={o * 0.85} />
        <path d={path} pathLength={100} className="pc-flow" stroke="#ffffff" strokeWidth={w * 0.75} style={{ animationDelay: `${-d * 0.6}s` } as CSSProperties} />
      </g>
    </g>
  )
}

// ---------- Things in the pictures ----------

/** The soft cloud that hid Jesus as He went up to heaven (Acts 1:9): big, white and puffy, lit with gold. (x, y) = its middle; about 260 wide at s = 1. */
export function GloryCloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const id = uid(useId())
  const puffs: [number, number, number][] = [[-100, 10, 32], [-64, -8, 42], [-18, -22, 50], [32, -14, 46], [82, 2, 36], [112, 16, 24], [-38, 16, 38], [18, 18, 40], [64, 20, 30], [-84, 22, 26]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1={0} y1={-72} x2={0} y2={58}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#ffe6b8" />
        </linearGradient>
      </defs>
      {puffs.map(([px, py, r], i) => <circle key={`o${i}`} cx={px} cy={py} r={r + 3} fill="#efd3a0" />)}
      {puffs.map(([px, py, r], i) => <circle key={i} cx={px} cy={py} r={r} fill={`url(#${id}c)`} />)}
      <path d="M-40 -48 Q-20 -64 4 -60 M40 -40 Q58 -46 70 -34" stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  )
}

/** An olive tree, as on the Mount of Olives: a twisty gray trunk and a round crown of silvery-green leaves. (x, y) = the foot of its trunk; about 130 tall at s = 1. */
export function OliveTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const leaf = useShade('#97ab74', 0.3, 0.18)
  const puffs: [number, number, number][] = [[-38, -78, 26], [-14, -100, 30], [20, -102, 28], [44, -80, 24], [-20, -66, 22], [16, -64, 24]]
  const line = ink('#97ab74')
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>{leaf.def}</defs>
      <ellipse cx={0} cy={0} rx={34} ry={5} fill="#000" opacity={0.1} />
      <path d="M-11 0 Q-5 -18 -12 -34 Q-17 -48 -8 -62 L-1 -60 Q-6 -48 -1 -38 Q4 -50 1 -64 L9 -62 Q13 -46 6 -32 Q12 -16 11 0 Z" fill="#8f7f68" stroke="#5f5242" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-4 -12 Q-2 -22 -6 -30 M5 -18 Q7 -26 4 -34" stroke="#6f6250" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <g className="sc-sway">
        {puffs.map(([px, py, r], i) => <circle key={`o${i}`} cx={px} cy={py} r={r + 2.5} fill={line} />)}
        {puffs.map(([px, py, r], i) => <circle key={i} cx={px} cy={py} r={r} fill={leaf.fill} />)}
        {[[-40, -84], [-14, -108], [22, -110], [44, -88], [-24, -70], [14, -70], [0, -86]].map(([lx, ly], i) => (
          <path key={i} d={`M${lx - 6} ${ly} q6 -4 12 0`} stroke="#d9e4c2" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />
        ))}
        {[[-30, -92], [6, -112], [34, -94], [-8, -76], [26, -68], [-42, -70]].map(([ox, oy], i) => <ellipse key={i} cx={ox} cy={oy} rx={2.6} ry={3.2} fill="#4f5a32" />)}
      </g>
    </g>
  )
}

/** Jerusalem's flat roofs, crowded together far off: [x, foot y, width, height] each, in warm stone. `warm`: in the evening light. */
export function Roofs({ spots, warm }: { spots: [number, number, number, number][]; warm?: boolean }) {
  const wall = warm ? '#efc69c' : '#ecd6aa', line = warm ? '#c38f68' : '#c9a873', dark = warm ? '#9a6448' : '#a07a4e'
  return (
    <g>
      {spots.map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x - w / 2} y={y - h} width={w} height={h} fill={i % 3 === 1 ? lighten(wall, 0.14) : i % 3 === 2 ? darken(wall, 0.04) : wall} stroke={line} strokeWidth={1.6} />
          <rect x={x - w / 2 - 1.5} y={y - h - 3} width={w + 3} height={4} fill={line} />
          <rect x={x + (i % 2 ? w * 0.1 : -w * 0.3)} y={y - h * (i % 2 ? 0.66 : 0.48)} width={Math.max(4, w * 0.17)} height={Math.max(5, h * 0.22)} rx={1.5} fill={dark} />
        </g>
      ))}
    </g>
  )
}

const GOLD = '#f2c440', GOLD_INK = '#a8761c', MARBLE = '#fbf6ea', MARBLE_INK = '#bba67c'

/** God's house, the temple, far off: white stone and gold, on its great platform with porches. (x, y) = the middle of the platform's foot; about 210 wide and 150 tall at s = 1. */
export function FarTemple({ x, y, s = 1, shine = true }: { x: number; y: number; s?: number; shine?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shine && <Glow x={0} y={-90} r={120} color="#fff2c0" />}
      <rect x={-100} y={-34} width={200} height={34} fill="#e9cf9c" stroke="#b08d55" strokeWidth={2} />
      <path d="M-100 -17 H100" stroke="#d6b77e" strokeWidth={1.4} />
      <rect x={-104} y={-40} width={208} height={7} fill="#f6ecd4" stroke={MARBLE_INK} strokeWidth={1.4} />
      {Array.from({ length: 21 }, (_, i) => <rect key={i} x={-99 + i * 9.6} y={-50} width={3} height={10} fill={MARBLE} stroke={MARBLE_INK} strokeWidth={0.6} />)}
      <rect x={-104} y={-54} width={208} height={5} fill="#f6ecd4" stroke={MARBLE_INK} strokeWidth={1} />
      <rect x={-72} y={-88} width={144} height={34} fill={MARBLE} stroke={MARBLE_INK} strokeWidth={1.6} />
      <rect x={-40} y={-134} width={80} height={80} fill={MARBLE} stroke={MARBLE_INK} strokeWidth={1.8} />
      <rect x={-43} y={-139} width={86} height={6} fill={GOLD} stroke={GOLD_INK} strokeWidth={1.2} />
      {[-36, -27, -18, -9, 0, 9, 18, 27, 36].map((px) => <path key={px} d={`M${px - 1.8} -139 L${px} -147 L${px + 1.8} -139 Z`} fill={GOLD} />)}
      <rect x={-74} y={-91} width={148} height={4} fill={GOLD} />
      <path d="M-13 -54 L-13 -100 Q0 -112 13 -100 L13 -54 Z" fill={GOLD} stroke={GOLD_INK} strokeWidth={1.4} />
    </g>
  )
}

/**
 * Jerusalem on its hill, across the valley: the city wall with towers and a gate, flat roofs packed inside, and God's
 * house shining on top. (x, y) = the bottom middle of the hill; at s = 1 the hill is 560 wide, and the temple's top is
 * about 300 up.
 */
export function FarJerusalem({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wallC = '#e6c792', wallInk = '#b08d55'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-280 0 Q-250 -60 -200 -96 Q-120 -146 0 -152 Q120 -146 200 -96 Q250 -60 280 0 Z" fill="#c8c27e" />
      <path d="M-280 0 Q-230 -36 -160 -50 Q0 -70 160 -50 Q230 -36 280 0 Z" fill="#b6b56e" />
      <Roofs spots={[[-196, -96, 30, 22], [-164, -108, 28, 26], [-132, -100, 26, 20], [-102, -116, 30, 24], [-150, -128, 24, 18], [-114, -136, 26, 20], [104, -114, 28, 24], [136, -104, 26, 20], [168, -98, 26, 20], [196, -92, 22, 16], [150, -124, 24, 18]]} />
      <FarTemple x={0} y={-126} s={0.86} />
      <path d="M-238 -64 Q-224 -86 -208 -90 L208 -90 Q224 -86 238 -64 L238 -42 L-238 -42 Z" fill={wallC} stroke={wallInk} strokeWidth={2.5} strokeLinejoin="round" />
      {Array.from({ length: 26 }, (_, i) => <rect key={i} x={-204 + i * 16} y={-98} width={9} height={9} fill={wallC} stroke={wallInk} strokeWidth={1.6} />)}
      {[-206, -96, 78, 204].map((tx) => (
        <g key={tx}>
          <rect x={tx - 14} y={-118} width={28} height={76} fill="#e0bd84" stroke={wallInk} strokeWidth={2.2} />
          {[-9, 0, 9].map((mx) => <rect key={mx} x={tx + mx - 3.5} y={-126} width={7} height={8} fill="#e0bd84" stroke={wallInk} strokeWidth={1.4} />)}
          <rect x={tx - 3} y={-104} width={6} height={10} rx={3} fill="#8a6040" />
        </g>
      ))}
      <path d="M-16 -42 L-16 -66 Q0 -82 16 -66 L16 -42 Z" fill="#6b4630" stroke={wallInk} strokeWidth={1.8} />
    </g>
  )
}

/** A speech bubble with a picture of one of God's wonders in it (Acts 2:11): the rainbow, a star, the big fish… (x, y) = its middle; `to` = where its tail points (whoever is talking). */
export function WonderBubble({ x, y, r = 26, to, e, art }: { x: number; y: number; r?: number; to: Pt; e: string; art?: string }) {
  const a = Math.atan2(to[1] - y, to[0] - x)
  const tip: Pt = [x + Math.cos(a) * (r + 16), y + Math.sin(a) * (r + 16)]
  const side = (da: number): Pt => [x + Math.cos(a + da) * r * 0.92, y + Math.sin(a + da) * r * 0.92]
  const [p1, p2] = [side(0.42), side(-0.42)]
  const tail = `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${tip[0].toFixed(1)} ${tip[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z`
  return (
    <g className="pa-float">
      <path d={tail} fill="#ffffff" stroke="#d4c2e2" strokeWidth={2.6} strokeLinejoin="round" />
      <circle cx={x} cy={y} r={r} fill="#ffffff" stroke="#d4c2e2" strokeWidth={2.6} />
      <path d={tail} fill="#ffffff" />
      <Emoji e={e} art={art} x={x} y={y} size={r * 1.5} />
    </g>
  )
}

// ---------- The house with the room upstairs ----------

const PLASTER = '#efd6a6', PLASTER_INK = '#c49a5e', PLASTER_DARK = '#e3c48e'
const STONE = '#dcc08c', STONE_INK = '#a8854f'
const WOOD = '#9a6a3a', WOOD_INK = '#6b4422'
const INSIDE = '#f7e4bd'

/** The house's heights, in its own units: the floor of the room upstairs (and the landing), the roof, and the top of the wall round the roof. */
export const HOUSE = { floor: -126, roof: -296, top: -324 }

/** The steps up the outside of the house, from the landing (x 150 to 300, at the floor of the room upstairs) down to the street at x 482. */
const STAIRS = (() => {
  let d = 'M150 0 L150 -126 L300 -126'
  for (let i = 1; i <= 8; i++) {
    const yy = -126 + 15.75 * i, xx = 300 + 26 * (i - 1)
    d += ` L${xx} ${yy}`
    if (i < 8) d += ` L${xx + 26} ${yy}`
  }
  return `${d} Z`
})()
/** Where someone stands on the stairs: the top of step n (0 is the landing), at its middle. */
export const onStep = (n: number): Pt => [n === 0 ? 225 : 300 + 26 * (n - 1) + 13, -126 + 15.75 * n]

/**
 * The house in Jerusalem with the room upstairs (Acts 1:13), seen from the street: two floors of warm plaster with the
 * ends of the floor beams showing, a flat roof behind a low wall, a door and windows downstairs, and stone stairs up the
 * outside to a landing at the door of the room upstairs. (x, y) = the ground under the middle of its front; at s = 1 it's
 * 500 wide (the stairs reach 232 further right) and 324 tall. In house units:
 * `open`: the front of the room upstairs is open, so you can see in (from x -232 to 160; its floor at HOUSE.floor), and
 * `room` is drawn inside it. `roof`: drawn on the roof behind its wall (feet at HOUSE.roof: people show from the waist
 * up). `landing`: drawn on the landing and the stairs (feet at onStep(n)). People next to it are about 0.72 × s.
 */
export function UpperHouse({ x, y, s = 1, open, stairs = true, room, roof, landing }: {
  x: number; y: number; s?: number; open?: boolean; stairs?: boolean; room?: ReactNode; roof?: ReactNode; landing?: ReactNode
}) {
  const id = uid(useId())
  const wall = useShade(PLASTER, 0.16, 0.08)
  const beams = Array.from({ length: 11 }, (_, i) => -225 + i * 45)
  const lattice = (wx: number, wy: number, w: number, h: number) => (
    <g>
      <rect x={wx - w / 2} y={wy} width={w} height={h} rx={3} fill="#5a3a24" stroke={WOOD_INK} strokeWidth={2.5} />
      <path d={`M${wx - w / 2} ${wy + h / 3} H${wx + w / 2} M${wx - w / 2} ${wy + (2 * h) / 3} H${wx + w / 2} M${wx - w / 6} ${wy} V${wy + h} M${wx + w / 6} ${wy} V${wy + h}`} stroke="#b9895a" strokeWidth={3} />
      <rect x={wx - w / 2 - 5} y={wy + h} width={w + 10} height={6} rx={2} fill={PLASTER_DARK} stroke={PLASTER_INK} strokeWidth={1.6} />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        {wall.def}
        <linearGradient id={`${id}in`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99a5e" stopOpacity={0.55} />
          <stop offset="0.35" stopColor="#c99a5e" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* on the roof, behind its low wall */}
      {roof}
      <rect x={-258} y={-318} width={516} height={24} fill={wall.fill} stroke={PLASTER_INK} strokeWidth={3} />
      <rect x={-262} y={-324} width={524} height={9} rx={3} fill={PLASTER_DARK} stroke={PLASTER_INK} strokeWidth={2.2} />
      {/* upstairs */}
      {open ? (
        <g>
          <rect x={-232} y={-286} width={392} height={160} fill={INSIDE} />
          <rect x={-232} y={-286} width={392} height={160} fill={`url(#${id}in)`} />
          {/* a little high window, a woven hanging and a shelf of jars */}
          <path d="M-62 -244 L-62 -262 Q-46 -280 -30 -262 L-30 -244 Z" fill="#bfe6ff" stroke={WOOD_INK} strokeWidth={2.4} />
          <path d="M-46 -276 L-46 -244" stroke={WOOD_INK} strokeWidth={2} />
          <rect x={-178} y={-282} width={46} height={34} rx={2} fill="#efe2c4" stroke="#b8925a" strokeWidth={1.6} />
          {['#3b56a8', '#c8433f', '#e8b84a'].map((c, i) => <rect key={c} x={-178} y={-278 + i * 10} width={46} height={5} fill={c} opacity={0.85} />)}
          <rect x={56} y={-252} width={78} height={6} rx={2} fill={WOOD} stroke={WOOD_INK} strokeWidth={1.6} />
          <path d="M64 -252 Q60 -270 70 -276 L80 -276 Q90 -270 86 -252 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M100 -252 Q97 -266 105 -270 L115 -270 Q123 -266 120 -252 Z" fill="#c9a06a" stroke="#8a6a3a" strokeWidth={1.8} strokeLinejoin="round" />
          {/* the floor's edge, a rug on it */}
          <rect x={-232} y={-131} width={392} height={5} fill="#c98448" />
          <rect x={-212} y={-130} width={352} height={4} fill="#b8433f" />
          {room}
          {/* the frame: the beam across the top, the post at the left, and the wall at the right with the door */}
          <rect x={-250} y={-296} width={410} height={12} fill={WOOD} stroke={WOOD_INK} strokeWidth={2.4} />
          <rect x={-250} y={-296} width={18} height={170} fill={wall.fill} stroke={PLASTER_INK} strokeWidth={2.5} />
          <rect x={160} y={-296} width={90} height={170} fill={wall.fill} stroke={PLASTER_INK} strokeWidth={2.5} />
        </g>
      ) : (
        <g>
          <rect x={-250} y={-296} width={500} height={170} fill={wall.fill} stroke={PLASTER_INK} strokeWidth={3} />
          {[[-180, -250], [40, -230], [-60, -170]].map(([bx, by], i) => <path key={i} d={`M${bx} ${by} l22 0 M${bx + 8} ${by + 7} l18 0`} stroke={PLASTER_DARK} strokeWidth={2} strokeLinecap="round" />)}
          {lattice(-140, -252, 64, 54)}
          {lattice(10, -252, 64, 54)}
        </g>
      )}
      {/* the door of the room upstairs, onto the landing */}
      <path d="M178 -126 L178 -196 Q202 -218 226 -196 L226 -126 Z" fill="#7a5233" stroke={WOOD_INK} strokeWidth={2.6} />
      <path d="M202 -210 L202 -126" stroke={WOOD_INK} strokeWidth={1.8} />
      <circle cx={194} cy={-162} r={2.4} fill="#e8c25a" />
      {/* the floor beams between the floors */}
      <rect x={-254} y={-126} width={508} height={14} fill={PLASTER_DARK} stroke={PLASTER_INK} strokeWidth={2.4} />
      {beams.map((bx) => <circle key={bx} cx={bx} cy={-119} r={5} fill={WOOD} stroke={WOOD_INK} strokeWidth={1.6} />)}
      {/* downstairs: the door and a window, and stone along the foot of the wall */}
      <rect x={-250} y={-112} width={500} height={112} fill={wall.fill} stroke={PLASTER_INK} strokeWidth={3} />
      <rect x={-250} y={-14} width={500} height={14} fill={STONE} stroke={STONE_INK} strokeWidth={2} />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-226 + i * 50} -14 V0`} stroke={STONE_INK} strokeWidth={1.4} />)}
      <path d="M-176 0 L-176 -70 Q-150 -94 -124 -70 L-124 0 Z" fill="#7a5233" stroke={WOOD_INK} strokeWidth={2.6} />
      <path d="M-163 -82 L-163 0 M-137 -82 L-137 0" stroke={WOOD_INK} strokeWidth={1.4} opacity={0.7} />
      <circle cx={-132} cy={-40} r={2.6} fill="#e8c25a" />
      {lattice(-10, -86, 46, 36)}
      {/* the stairs up the outside, and the landing */}
      {stairs && (
        <g>
          <defs><clipPath id={`${id}st`}><path d={STAIRS} /></clipPath></defs>
          <path d={STAIRS} fill={STONE} />
          <g clipPath={`url(#${id}st)`} stroke="#c8a873" strokeWidth={1.6}>
            {[-100, -74, -48, -22].map((cy) => <path key={cy} d={`M150 ${cy} H520`} />)}
            {[[190, -113], [250, -113], [170, -87], [230, -87], [300, -87], [200, -61], [270, -61], [340, -61], [180, -35], [250, -35], [320, -35], [400, -35], [220, -9], [300, -9], [380, -9], [450, -9]].map(([jx, jy], i) => <path key={i} d={`M${jx} ${jy} v13`} />)}
          </g>
          <path d={STAIRS} fill="none" stroke={STONE_INK} strokeWidth={2.6} strokeLinejoin="round" />
          <path d="M152 -124 L298 -124" stroke="#f0dcb0" strokeWidth={3} strokeLinecap="round" />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${302 + 26 * i} ${-108.25 + 15.75 * i} h22`} stroke="#f0dcb0" strokeWidth={2.6} strokeLinecap="round" />)}
          {landing}
        </g>
      )}
    </g>
  )
}

// ---------- The room upstairs, inside ----------

/**
 * Inside the room upstairs, where Jesus' friends prayed and waited (Acts 1:13–14): warm plaster walls under wooden beams,
 * a big arched window looking out over Jerusalem's roofs to God's house (you can see the room is high up), a woven
 * hanging, a shelf of jars and a rug. `bright`: God's light pouring in at the window (the day the Spirit came);
 * `glow`: the whole room aglow. `inWindow`: drawn in the window, in scene units. `children`: the people.
 */
function UpperRoom({ bright, glow, inWindow, windowSay, children }: {
  bright?: boolean; glow?: boolean; inWindow?: ReactNode; windowSay?: [string, string]; children?: ReactNode
}) {
  const id = uid(useId())
  const win = 'M292 196 L292 116 Q292 46 400 46 Q508 46 508 116 L508 196 Z'
  const view = (
    <g>
      <g clipPath={`url(#${id}w)`}>
        <rect x={290} y={40} width={220} height={160} fill={`url(#${id}s)`} />
        {bright ? <Glow x={400} y={60} r={150} color="#fffbe0" /> : <Cloud x={350} y={86} s={0.38} slow />}
        <FarTemple x={448} y={188} s={0.42} shine={!!bright} />
        <Roofs spots={[[306, 200, 34, 30], [338, 200, 30, 22], [370, 200, 34, 34], [404, 200, 28, 18], [500, 200, 34, 28], [474, 200, 26, 16]]} />
        {inWindow}
      </g>
      <path d={win} fill="none" stroke="#8a5a30" strokeWidth={9} />
      <rect x={282} y={194} width={236} height={10} rx={3} fill="#a87444" stroke="#6b4422" strokeWidth={2} />
    </g>
  )
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <defs>
        <clipPath id={`${id}w`}><path d={win} /></clipPath>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bright ? '#fff6cf' : '#8fd3ff'} />
          <stop offset="1" stopColor={bright ? '#ffe7a6' : '#e2f6ff'} />
        </linearGradient>
      </defs>
      {/* the walls and the beams of the ceiling */}
      <rect x={0} y={0} width={800} height={300} fill="#efd7a8" />
      {[[120, 120, 90], [660, 90, 110], [420, 250, 140]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.6} fill="#e4c690" opacity={0.35} />)}
      <rect x={0} y={0} width={800} height={24} fill="#7a5233" />
      {[30, 210, 590, 770].map((bx) => <rect key={bx} x={bx - 9} y={0} width={18} height={30} rx={3} fill="#5f3f24" />)}
      {/* the window: the sky, Jerusalem's roofs below, and God's house far off */}
      {windowSay ? <Tap say={windowSay[0]} sfx={windowSay[1]}>{view}</Tap> : view}
      {/* a woven hanging, and a shelf with jars */}
      <rect x={196} y={46} width={66} height={92} rx={3} fill="#efe2c4" stroke="#b8925a" strokeWidth={2} />
      {['#3b56a8', '#c8433f', '#e8b84a', '#3b56a8'].map((c, i) => <rect key={i} x={196} y={56 + i * 20} width={66} height={9} fill={c} opacity={0.88} />)}
      <rect x={190} y={40} width={78} height={7} rx={3} fill="#9a6a3a" />
      <path d="M548 112 H690" stroke="#8a5a30" strokeWidth={7} strokeLinecap="round" />
      <path d="M566 108 Q561 84 573 76 L589 76 Q601 84 596 108 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M616 108 Q612 92 621 86 L635 86 Q644 92 640 108 Z" fill="#c9a06a" stroke="#8a6a3a" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M658 108 Q655 96 662 92 L672 92 Q679 96 676 108 Z" fill="#e2b85a" stroke="#9a7a2a" strokeWidth={2} strokeLinejoin="round" />
      {/* the floor, and a big rug */}
      <rect x={0} y={296} width={800} height={154} fill="#c99a62" />
      <path d="M0 296 H800" stroke="#a8804a" strokeWidth={3} />
      {[330, 370, 412].map((fy) => <path key={fy} d={`M0 ${fy} H800`} stroke="#b88a54" strokeWidth={1.6} opacity={0.6} />)}
      <path d="M60 318 L740 318 L790 446 L10 446 Z" fill="#b8433f" stroke="#8a2f2c" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M78 330 L722 330 L766 434 L34 434 Z" fill="none" stroke="#f0d38a" strokeWidth={3} />
      {(bright || glow) && <g opacity={glow ? 0.6 : 0.8}><Glow x={400} y={glow ? 230 : 120} r={glow ? 420 : 300} color="#fff3c4" /></g>}
      {children}
    </Scene>
  )
}

// Everyone in the room upstairs (pages 5, 6 and 7), always in the same places: [who, look, x]. The four fishermen kneel in
// front; Mary, Jesus' mother, kneels in the middle of the second row with two friends; Thomas, a friend, Matthew and Mary
// Magdalene stand at the back.
type Who = 'andrew' | 'peter' | 'john' | 'james' | 'mary' | 'disciple' | 'thomas' | 'matthew' | 'maryMagdalene' | 'friend1' | 'friend2'
const BACK: [Who, Look, number][] = [['thomas', PEOPLE.thomas, 64], ['friend2', FRIENDS[2], 146], ['matthew', PEOPLE.matthew, 654], ['maryMagdalene', PEOPLE.maryMagdalene, 736]]
const MIDDLE: [Who, Look, number][] = [['friend1', FRIENDS[1], 205], ['mary', PEOPLE.mary, 400], ['disciple', PEOPLE.disciple, 595]]
const FRONT: [Who, Look, number][] = [['andrew', PEOPLE.andrew, 108], ['peter', PEOPLE.peter, 300], ['john', PEOPLE.john, 500], ['james', PEOPLE.james, 692]]
const ROWS = { back: { y: 300, s: 0.8 }, middle: { y: 352, s: 0.98 }, front: { y: 436, s: 1.12 } }
const beardOf = (l: Look) => (l.beard ? l.beardColor ?? l.hairColor : undefined)
/** What someone in a picture says when they're tapped: [line, sound]. */
type Says = Partial<Record<Who, [string, string]>>

type RoomTime = 'pray' | 'wind' | 'flames'

/** One of the friends in the room upstairs, kneeling at (x, y): praying, amazed at the wind (looking up, or round), or full of joy with a little flame. */
function Kneeler({ look, x, y, s, time, pose, up, d }: { look: Look; x: number; y: number; s: number; time: RoomTime; pose: Pose; up?: boolean; d: number }) {
  if (time === 'pray') return <Kneel x={x} y={y} s={s} look={look} pose="pray" blinkDelay={d} />
  if (time === 'wind') {
    const face = <Amazed skin={look.skin} beard={beardOf(look)} />
    return up
      ? <LookingUp><Kneel x={x} y={y} s={s} look={look} pose="wave" blinkDelay={d}><EyesUp />{face}</Kneel></LookingUp>
      : <Kneel x={x} y={y} s={s} look={look} pose={pose} blinkDelay={d}>{face}</Kneel>
  }
  return (
    <Laughing>
      <Kneel x={x} y={y} s={s} look={look} pose={pose} blinkDelay={d}>
        <LaughFace beard={!!look.beard} />
        <SpiritFlame d={d} />
      </Kneel>
    </Laughing>
  )
}

/** One of the friends standing at the back of the room: praying, amazed, or full of joy with a little flame. */
function Stander({ look, x, time, pose, d }: { look: Look; x: number; time: RoomTime; pose: JPose; d: number }) {
  const { y, s } = ROWS.back
  const mood: Mood = time === 'pray' ? 'happy' : time === 'wind' ? 'wow' : 'joy'
  return (
    <Figure x={x} y={y} s={s} look={look} pose={time === 'pray' ? 'pray' : pose} mood={mood} blinkDelay={d}>
      {time === 'flames' && <SpiritFlame d={d} />}
    </Figure>
  )
}

/** Everyone in the room upstairs, at one of three times: praying (eyes shut), when the wind came, or with their flames. `says`: tap lines. */
function RoomFolk({ time, says = {} }: { time: RoomTime; says?: Says }) {
  const backPose: JPose[] = time === 'wind' ? ['open', 'stand', 'open', 'stand'] : ['arms-up', 'pray', 'pray', 'arms-up']
  const midPose: Pose[] = time === 'wind' ? ['stand', 'wave', 'hold'] : ['pray', 'arms-up', 'pray']
  const frontPose: Pose[] = time === 'wind' ? ['stand', 'wave', 'wave', 'stand'] : ['arms-up', 'pray', 'arms-up', 'pray']
  const midUp = [false, true, false], frontUp = [false, true, true, false]
  const tap = (who: Who, el: ReactNode) => {
    const line = says[who]
    return line ? <Tap key={who} say={line[0]} sfx={line[1]}>{el}</Tap> : <g key={who}>{el}</g>
  }
  const people = (
    <g>
      {BACK.map(([who, look, x], i) => tap(who, <Stander look={look} x={x} time={time} pose={backPose[i]} d={i * 0.45} />))}
      {MIDDLE.map(([who, look, x], i) => tap(who, <Kneeler look={look} x={x} y={ROWS.middle.y} s={ROWS.middle.s} time={time} pose={midPose[i]} up={midUp[i]} d={0.3 + i * 0.55} />))}
      {FRONT.map(([who, look, x], i) => tap(who, <Kneeler look={look} x={x} y={ROWS.front.y} s={ROWS.front.s} time={time} pose={frontPose[i]} up={frontUp[i]} d={0.15 + i * 0.4} />))}
    </g>
  )
  return time === 'pray' ? <g className="dn-shut"><ShutEyes />{people}</g> : people
}

// ---------- Outdoors ----------

/** The Mount of Olives, across the valley from Jerusalem: a green hillside, rocks and flowers. */
function OliveHill({ warm }: { warm?: boolean }) {
  return (
    <g>
      <path d="M-10 300 Q170 268 340 300 Q520 334 640 352 Q730 364 810 360 L810 460 L-10 460 Z" fill={warm ? '#a8c47e' : '#9fca7c'} />
      <path d="M-10 384 Q240 356 470 386 Q640 406 810 396 L810 460 L-10 460 Z" fill={warm ? '#94b86a' : '#8cbf6c'} />
      {[[60, 420, '#ffffff'], [258, 436, '#ffd34d'], [590, 430, '#ff8cc0'], [730, 438, '#ffffff'], [420, 444, '#ffd34d']].map(([fx, fy, c], i) => (
        <g key={i} transform={`translate(${fx} ${fy})`}>
          <path d="M0 0 L0 -10" stroke="#3f9a4a" strokeWidth={2.4} />
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-15} rx={3.4} ry={5} fill={c as string} transform={`rotate(${a} 0 -11)`} />)}
          <circle cx={0} cy={-11} r={2.6} fill="#ffd34d" />
        </g>
      ))}
    </g>
  )
}

/** A Jerusalem street, the city's roofs behind and God's house far off: the sky, the roofs, and paving stones from `ground` down. */
function Street({ ground = 330, warm, children }: { ground?: number; warm?: boolean; children?: ReactNode }) {
  return (
    <g>
      <Roofs warm={warm} spots={[[30, ground, 70, 74], [96, ground, 64, 54], [156, ground, 58, 86], [214, ground, 62, 62], [276, ground, 70, 80], [340, ground, 60, 58], [520, ground, 70, 66], [586, ground, 62, 92], [646, ground, 64, 60], [712, ground, 70, 78], [778, ground, 60, 56]]} />
      {children}
      <rect x={0} y={ground} width={800} height={450 - ground} fill={warm ? '#e6c89a' : '#e9d3a6'} />
      {Array.from({ length: 6 }, (_, r) => {
        const yy = ground + 12 + r * ((450 - ground) / 6)
        return <path key={r} d={`M0 ${yy} H800`} stroke={warm ? '#d4b07c' : '#d8bd88'} strokeWidth={1.6} opacity={0.7} />
      })}
    </g>
  )
}

/** A little fire of coals on the beach, with two fish cooking over it and bread beside it (John 21:9). (x, y) = the middle of its foot. */
function BeachFire({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={44} ry={8} fill="#000" opacity={0.12} />
      {[[-34, -3], [-18, 3], [0, 5], [18, 3], [34, -3]].map(([sx, sy], i) => <ellipse key={i} cx={sx} cy={sy} rx={10} ry={7} fill="#b7aea2" stroke="#7d766d" strokeWidth={2} />)}
      <ellipse cx={0} cy={-6} rx={26} ry={7} fill="#e8743b" />
      <ellipse cx={0} cy={-7} rx={16} ry={4} fill="#ffc24a" />
      <path d="M-24 -4 L22 -14 M-22 -14 L24 -4" stroke="#7a5233" strokeWidth={7} strokeLinecap="round" />
      <g className="pc-flicker"><path d="M-8 -12 Q-14 -26 -4 -38 Q-2 -28 2 -24 Q6 -32 4 -40 Q16 -28 10 -12 Z" fill="#ffb347" stroke="#e8743b" strokeWidth={1.6} strokeLinejoin="round" /></g>
      <path d="M-3 -14 Q-6 -22 0 -28 Q4 -20 5 -14 Z" fill="#fff3b0" />
      {/* two forked sticks and a green stick across them, with the fish */}
      <path d="M-40 4 L-36 -46 M-36 -46 l-6 -8 M-36 -46 l5 -8 M40 4 L36 -46 M36 -46 l-5 -8 M36 -46 l6 -8" stroke="#7a5233" strokeWidth={3.4} strokeLinecap="round" fill="none" />
      <path d="M-44 -48 L44 -48" stroke="#6f8f3a" strokeWidth={3.4} strokeLinecap="round" />
      <Fish x={-16} y={-42} s={0.5} color="#e0a05a" />
      <Fish x={18} y={-42} s={0.5} color="#d98a4a" facing="left" />
    </g>
  )
}

const JESUS = PEOPLE.jesus

// ---------- Part one: Jesus makes a promise ----------

// 1. "Jesus was alive! After Easter, He came to see His friends again and again, for forty days. They ate together and
//    talked together, and Jesus taught them all about God."
// Early morning by the lake: Peter's boat pulled up on the beach, a little fire with fish cooking, and Jesus on a rock,
// handing Peter some bread. Andrew, John and James are there too, eating and listening.
function Page1() {
  const id = uid(useId())
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3b5b0" /><stop offset="0.5" stopColor="#9fc3e0" /><stop offset="1" stopColor="#6fa7d8" /></linearGradient>
      </defs>
      <Cloud x={190} y={86} s={0.7} slow />
      <Cloud x={560} y={64} s={0.5} />
      <Sun x={640} y={190} s={0.6} />
      <path d="M-10 214 Q120 188 260 206 Q420 182 560 204 Q690 190 810 208 L810 240 L-10 240 Z" fill="#b39ac4" />
      <rect x={0} y={232} width={800} height={112} fill={`url(#${id}l)`} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${616 - i * 6} ${246 + i * 16} h${48 + i * 12}`} stroke="#fff2c4" strokeWidth={4} strokeLinecap="round" opacity={0.8} />)}
      {[[90, 262], [250, 280], [420, 258], [520, 300], [160, 310], [740, 292]].map(([wx, wy]) => <path key={wx} d={`M${wx} ${wy} q10 -5 20 0`} stroke="#ffffff" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.7} />)}
      <Birds spots={[[300, 120, 1], [336, 104, 0.8], [460, 90, 0.7]]} />
      <path d="M-10 330 Q200 312 420 326 Q620 338 810 320 L810 460 L-10 460 Z" fill="#f1d9a6" />
      <path d="M-10 330 Q200 312 420 326 Q620 338 810 320" stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.7} />
      {[[60, 420], [700, 440], [560, 446], [130, 438]].map(([px, py], i) => <ellipse key={i} cx={px} cy={py} rx={6} ry={3.6} fill="#d8bf8e" />)}
      <Tap say="That's Peter's fishing boat!" sfx="pop"><FishingBoat x={120} y={350} s={0.34} still /></Tap>
      <Tap say="Sizzle, sizzle! Fish for breakfast!" sfx="sizzle"><BeachFire x={296} y={428} s={0.95} /></Tap>
      <Rock x={420} y={426} s={0.98} />
      <Tap say="I am alive! Come and eat with Me." sfx="sparkle">
        <SittingOnRock x={420} y={426} s={0.98} look={JESUS} pose="point" holding="bread" blinkDelay={0.3}><Speaking beard /></SittingOnRock>
      </Tap>
      <Sitting x={198} y={432} s={0.96} look={PEOPLE.andrew} pose="hold" facing="right" blinkDelay={1.2} />
      <Tap say="Jesus is alive! Hooray!" sfx="good">
        <Sitting x={548} y={432} s={0.98} look={PEOPLE.peter} pose="point" facing="left" blinkDelay={0.7} />
      </Tap>
      <Sitting x={662} y={434} s={0.96} look={PEOPLE.john} pose="hold" holding="bread" facing="left" blinkDelay={1.6} />
      <Person x={752} y={440} s={0.98} look={PEOPLE.james} pose="wave" facing="left" blinkDelay={0.9} />
      <Bread x={350} y={436} s={0.62} />
    </Scene>
  )
}

// 2. "One day, up on a hill near Jerusalem, Jesus said to His friends, "Stay in Jerusalem, and wait. My Father will send
//    you the Helper I promised, the Holy Spirit. He will make you brave, to tell the whole world about Me!""
// The Mount of Olives, with Jerusalem and God's house across the valley: Jesus points to the city, and Peter, John, Andrew
// and James listen.
function Page2() {
  return (
    <Scene sky="day" ground="none">
      <Tap say="That's Jerusalem, with God's house on top!" sfx="sparkle"><FarJerusalem x={630} y={318} s={0.6} /></Tap>
      {/* the valley between the hills, in the shade */}
      <path d="M360 330 Q470 312 580 318 Q700 312 820 320 L820 350 L360 350 Z" fill="#9db676" />
      <OliveHill />
      <OliveTree x={56} y={318} s={0.92} />
      <OliveTree x={176} y={304} s={0.64} />
      <Figure x={90} y={432} s={0.98} look={PEOPLE.james} facing="right" blinkDelay={1.1} />
      <Figure x={180} y={438} s={0.98} look={PEOPLE.andrew} facing="right" blinkDelay={0.5} />
      <Tap say="We will wait, Jesus. We will!" sfx="good">
        <Figure x={272} y={436} s={1} look={PEOPLE.peter} pose="pray" facing="right" blinkDelay={0.2} />
      </Tap>
      <Figure x={362} y={440} s={0.96} look={PEOPLE.john} pose="hold" facing="right" blinkDelay={1.6} />
      <Tap say="Wait for the Helper. He is coming soon!" sfx="sparkle">
        <Figure x={474} y={428} s={1.06} look={JESUS} pose="point" facing="right" blinkDelay={0.8}><Speaking beard /></Figure>
      </Tap>
    </Scene>
  )
}

// 3. "Then Jesus lifted up His hands and blessed them. And as they watched, Jesus went up, up, up into heaven, and a
//    cloud hid Him."
// The same hilltop: Jesus rising into the bright sky with His hands lifted up, a soft white cloud wrapping round His feet,
// warm light all round; His friends look up, amazed and glad: the six who were at His special supper on Easter Morning
// (Matthew, Peter, John, Andrew, James and Thomas).
function Page3() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <rect x={0} y={0} width={800} height={450} fill="#fff6d8" opacity={0.35} />
      <Rays x={400} y={150} r={480} n={20} color="#fff3c0" opacity={0.6} />
      <Glow x={400} y={150} r={230} color="#fff8dc" />
      <FarJerusalem x={720} y={330} s={0.3} />
      <OliveHill />
      <OliveTree x={40} y={330} s={0.8} />
      <OliveTree x={770} y={366} s={0.7} />
      <Tap say="I love you. I will always be with you!" sfx="sparkle">
        <g>
          <Person x={400} y={214} s={0.86} look={JESUS} pose="arms-up" blinkDelay={0.4} />
          <GloryCloud x={400} y={222} s={0.62} />
        </g>
      </Tap>
      <Sparkles spots={[[300, 110, 9], [500, 96, 10], [270, 200, 7], [536, 196, 8], [400, 40, 8]]} />
      <LookingUp><Person x={110} y={440} s={0.96} look={PEOPLE.matthew} pose="wave" blinkDelay={0.6}><EyesUp /></Person></LookingUp>
      <Tap say="Look! Jesus is going up to heaven!" sfx="pop">
        <LookingUp><Person x={214} y={444} s={1} look={PEOPLE.peter} pose="wave" blinkDelay={0.2}><EyesUp /></Person></LookingUp>
      </Tap>
      <LookingUp><Figure x={320} y={446} s={0.98} look={PEOPLE.john} pose="pray" mood="wow" blinkDelay={1.4}><EyesUp /></Figure></LookingUp>
      <LookingUp><Person x={486} y={446} s={0.98} look={PEOPLE.andrew} pose="wave" facing="left" blinkDelay={0.9}><EyesUp /></Person></LookingUp>
      <Figure x={592} y={444} s={0.98} look={PEOPLE.james} pose="arms-up" mood="joy" blinkDelay={0.3} />
      <LookingUp><Person x={692} y={440} s={0.94} look={PEOPLE.thomas} pose="wave" facing="left" blinkDelay={1.1}><EyesUp /></Person></LookingUp>
    </Scene>
  )
}

// 4. "His friends kept looking up at the sky. Then two angels in white stood beside them. "Jesus went up to heaven,"
//    they said. "And one day, He will come back!""
// The same hilltop, the sky empty but for a soft cloud and its light: two angels stand beside the friends (Peter, John,
// Andrew, James and Thomas), one pointing up; the friends turn to them, amazed and happy.
function Page4() {
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Glow x={520} y={70} r={160} color="#fff6d0" />
      <GloryCloud x={520} y={78} s={0.36} />
      <Cloud x={160} y={90} s={0.6} slow />
      <FarJerusalem x={720} y={330} s={0.3} />
      <OliveHill />
      <OliveTree x={770} y={366} s={0.7} />
      <Tap say="Jesus went up to heaven. One day, He will come back!" sfx="sparkle">
        <Person x={92} y={436} s={0.98} look={PEOPLE.angel} pose="wave" blinkDelay={0.5} />
      </Tap>
      <Tap say="Why are you looking up at the sky?" sfx="sparkle">
        <Person x={262} y={440} s={0.98} look={PEOPLE.angel} pose="stand" blinkDelay={1.3} />
      </Tap>
      <Tap say="Angels! Jesus will come back!" sfx="good">
        <Figure x={384} y={444} s={1} look={PEOPLE.peter} pose="open" mood="wow" facing="left" blinkDelay={0.3} />
      </Tap>
      <Figure x={476} y={446} s={0.98} look={PEOPLE.john} pose="pray" mood="joy" facing="left" blinkDelay={1.2} />
      <LookingUp><Person x={566} y={444} s={0.98} look={PEOPLE.andrew} pose="wave" facing="left" blinkDelay={0.8}><EyesUp /></Person></LookingUp>
      <Figure x={654} y={442} s={0.98} look={PEOPLE.james} mood="wow" facing="left" blinkDelay={0.4} />
      <LookingUp><Person x={740} y={438} s={0.94} look={PEOPLE.thomas} pose="wave" facing="left" blinkDelay={1.5}><EyesUp /></Person></LookingUp>
    </Scene>
  )
}

// 5. "So the friends went back to Jerusalem, full of joy. In a room upstairs, they prayed together every day: Peter,
//    Andrew, James, John and many more, with Jesus' mother, Mary. They were waiting for the Helper, just like Jesus
//    said."
// Inside the room upstairs (Jerusalem's roofs below its window): eleven friends praying with their eyes shut, the four
// fishermen in front, Mary in the middle, and more friends all round (Thomas, Matthew and Mary Magdalene at the back).
function Page5() {
  return (
    <UpperRoom inWindow={<Birds spots={[[330, 90, 0.8], [356, 78, 0.6]]} />} windowSay={["We're way up high! Look at all the roofs.", 'pop']}>
      <RoomFolk time="pray" says={{
        peter: ['Dear God, we are waiting for the Helper.', 'ding'],
        mary: ["I love to pray with Jesus' friends.", 'ding'],
        john: ['Jesus always keeps His promises.', 'ding'],
      }} />
    </UpperRoom>
  )
}

/** The rushing wind indoors: swirls with a strong blue edge, so they show on the cream walls (as in the mini-game). */
const WIND = { edge: '#5f9fd8', eo: 0.9, o: 1 }

// 6. "Remember? Jesus' friends were waiting for the Helper. On the day of a big feast called Pentecost, they were all
//    together in the room upstairs. Suddenly, there was a sound from heaven, like a mighty rushing wind! Whoosh! It
//    filled the whole house."
// The same room: soft swirls of wind pour in at the bright window and fill the whole room, round everyone; they look up
// and round, amazed (never scared).
function Page6() {
  return (
    <UpperRoom bright inWindow={<g><Gust {...WIND} x={300} y={120} len={150} d={0.4} w={6} /><Gust {...WIND} x={330} y={170} len={120} d={1.2} w={6} /></g>}>
      <RoomFolk time="wind" says={{
        peter: ["What a sound! It's from heaven!", 'pop'],
        mary: ['Listen! The wind is filling the whole house!', 'pop'],
      }} />
      <Tap say="Whoosh! Whoosh!" sfx="whoosh">
        <g>
          <Gust {...WIND} x={292} y={110} len={250} flip rot={-6} d={0} w={7} />
          <Gust {...WIND} x={510} y={100} len={240} rot={6} d={0.8} w={7} />
          <Gust {...WIND} x={40} y={30} len={330} rot={2} d={1.6} w={6} />
          <Gust {...WIND} x={430} y={36} len={320} rot={-2} d={2.2} w={6} />
          <Gust {...WIND} x={792} y={168} len={140} flip rot={-4} d={0.5} w={6} />
          <Gust {...WIND} x={8} y={176} len={150} rot={4} d={1.1} w={6} />
          <Gust {...WIND} x={300} y={246} len={64} d={1.9} w={4.5} />
          <Gust {...WIND} x={524} y={232} len={64} flip d={2.6} w={4.5} />
        </g>
      </Tap>
    </UpperRoom>
  )
}

// 7. "Then little flames, like fire, came to rest on each one of them! The flames did not burn. They glowed softly, like
//    little lights. And they were all filled with the Holy Spirit."
// The same room, all aglow: a little flame of warm light rests just above every head (eleven of them), and everyone is
// full of joy, lifting up their hands or praying.
function Page7() {
  return (
    <UpperRoom bright glow>
      <Gust x={40} y={30} len={330} rot={2} d={1.6} w={3.5} o={0.5} />
      <Gust x={430} y={36} len={320} rot={-2} d={2.2} w={3.5} o={0.5} />
      <RoomFolk time="flames" says={{
        mary: ["A little flame of God's light! It doesn't burn at all.", 'sparkle'],
        john: ['Jesus kept His promise! The Helper is here!', 'good'],
        andrew: ['Praise God!', 'ding'],
      }} />
      <Sparkles spots={[[250, 210, 7], [560, 200, 8], [120, 160, 6], [690, 170, 6], [400, 30, 7]]} />
    </UpperRoom>
  )
}

// ---------- Part two, outside: the crowd from many lands ----------

/** The friends on the roof on page 8, in house units: [look, x, pose, speaking, a wonder to tell about]. */
const ON_ROOF: [Look, number, JPose, boolean, string | null][] = [
  [PEOPLE.mary, -196, 'arms-up', false, '🌈'], [PEOPLE.maryMagdalene, -118, 'pray', false, null], [PEOPLE.peter, -40, 'open', true, '💛'],
  [PEOPLE.john, 38, 'arms-up', true, '🐋'], [PEOPLE.james, 116, 'wave', true, '⭐'], [PEOPLE.andrew, 194, 'open', true, '🦁'],
]

// 8. "They began to speak in other languages that they had never learned! People from many lands were in Jerusalem for
//    the feast. A big crowd came running, and each one heard about God's wonders in their very own language!"
// Outside the house: Jesus' friends up on the roof, each with a little flame, telling about God's wonders (the bubbles:
// the rainbow, God's love, the big fish, the stars, the lions); the crowd from many lands fills the street, amazed and glad.
function Page8() {
  const hs = 0.88, hx = 214, hy = 452
  const ps = 0.72
  const roofY = hy + HOUSE.roof * hs
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Cloud x={610} y={64} s={0.7} />
      <Street ground={330}>
        <FarTemple x={690} y={304} s={0.5} />
      </Street>
      <FarCrowd seed={3} rows={[
        [350, 0.46, Array.from({ length: 13 }, (_, i) => 470 + i * 26)],
        [368, 0.52, Array.from({ length: 11 }, (_, i) => 458 + i * 31)],
      ]} />
      <UpperHouse x={hx} y={hy} s={hs}
        roof={ON_ROOF.map(([look, rx, pose, talk], i) => {
          const el = (
            <Figure key={rx} x={rx} y={HOUSE.roof} s={ps} look={look} pose={pose} mood={talk ? 'happy' : 'joy'} blinkDelay={i * 0.4}>
              {talk && <Speaking beard={!!look.beard} />}<SpiritFlame d={i * 0.5} />
            </Figure>
          )
          return rx === -40 ? <Tap key={rx} say="God loves everyone, everywhere!" sfx="sparkle">{el}</Tap> : el
        })}
      />
      <Tap say="God's wonders, in every language!" sfx="sparkle">
        <g>
          {ON_ROOF.map(([, rx, , , e], i) => e && (
            <WonderBubble key={rx} x={hx + rx * hs + 30} y={i % 2 ? 46 : 34} r={23} to={[hx + rx * hs + 4, roofY - 100 * ps * hs]} e={e} />
          ))}
        </g>
      </Tap>
      {/* (the back row's faces in the gaps between the front row's heads, where no hand or hat comes in front of them) */}
      {[[466, 2, 'wow', 'stand'], [568, 8, 'joy', 'wave'], [655, 1, 'wow', 'stand'], [756, 6, 'happy', 'stand']].map(([x, v, mood, pose], i) => (
        <VisitorFigure key={i} x={x as number} y={398} s={0.72} v={VISITORS[v as number]} mood={mood as Mood} pose={pose as JPose} facing="left" blinkDelay={i * 0.5} />
      ))}
      <VisitorFigure x={48} y={446} s={0.88} v={VISITORS[11]} mood="wow" pose="wave" blinkDelay={0.7} />
      <VisitorFigure x={140} y={448} s={0.9} v={VISITORS[12]} mood="joy" pose="arms-up" blinkDelay={1.3} />
      <Tap say="They are speaking my language!" sfx="pop">
        <VisitorFigure x={234} y={448} s={0.92} v={VISITORS[0]} pose="open" mood="wow" blinkDelay={0.3} />
      </Tap>
      <VisitorFigure x={330} y={448} s={0.9} v={VISITORS[4]} mood="happy" pose="wave" blinkDelay={1.6} />
      <VisitorFigure x={428} y={448} s={0.9} v={VISITORS[9]} mood="wow" pose="wave" facing="left" blinkDelay={0.6} />
      <Tap say="Wow! I can understand every word!" sfx="good">
        <VisitorFigure x={522} y={448} s={0.92} v={VISITORS[3]} mood="joy" pose="hold" facing="left" blinkDelay={1.2} />
      </Tap>
      <VisitorFigure x={614} y={448} s={0.9} v={VISITORS[7]} mood="wow" pose="stand" facing="left" blinkDelay={0.2} />
      <VisitorFigure x={706} y={446} s={0.92} v={VISITORS[5]} mood="happy" pose="stand" facing="left" blinkDelay={0.9} />
      <VisitorFigure x={770} y={448} s={0.86} v={VISITORS[10]} mood="joy" pose="arms-up" facing="left" blinkDelay={1.8} />
    </Scene>
  )
}

// 9. "Then Peter stood up and told the crowd all about Jesus: how God sent Him, how He died and rose again, and how much
//    God loves them. About three thousand people believed in Jesus that day!"
// Peter at the top of the stairs, his arms open wide, with John and Andrew beside the door (their little flames still
// glowing); a great crowd fills the street as far as you can see, happy, with hearts rising up.
function Page9() {
  const hs = 1.3, hx = -150, hy = 470
  const ps = 0.72
  const [, ly] = onStep(0)
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Rays x={560} y={-20} r={440} n={16} color="#fff6c8" opacity={0.45} />
      <Cloud x={650} y={70} s={0.7} />
      <Street ground={300}>
        <FarTemple x={700} y={286} s={0.46} />
      </Street>
      <FarCrowd seed={0} wave={5} rows={[
        [312, 0.3, Array.from({ length: 24 }, (_, i) => 300 + i * 21)],
        [322, 0.34, Array.from({ length: 22 }, (_, i) => 292 + i * 23.5)],
        [334, 0.38, Array.from({ length: 20 }, (_, i) => 288 + i * 26)],
        [350, 0.44, Array.from({ length: 17 }, (_, i) => 296 + i * 30)],
        [370, 0.52, Array.from({ length: 14 }, (_, i) => 306 + i * 36)],
      ]} />
      <UpperHouse x={hx} y={hy} s={hs}
        landing={(
          <g>
            <Figure x={168} y={ly} s={ps} look={PEOPLE.john} pose="pray" mood="joy" blinkDelay={0.9}><SpiritFlame d={0.4} /></Figure>
            <Figure x={226} y={ly} s={ps} look={PEOPLE.andrew} pose="stand" blinkDelay={1.4}><SpiritFlame d={1.2} /></Figure>
            <Tap say="Jesus is alive! God loves you so much!" sfx="sparkle">
              <Figure x={284} y={ly} s={ps} look={PEOPLE.peter} pose="open" facing="right" blinkDelay={0.2}><Speaking beard /><SpiritFlame d={0.8} /></Figure>
            </Tap>
          </g>
        )}
      />
      <FarCrowd seed={40} wave={4} rows={[[400, 0.64, Array.from({ length: 11 }, (_, i) => 330 + i * 46)]]} />
      <Tap say="We believe in Jesus!" sfx="good">
        <g>
          {[[372, 0, 'joy', 'arms-up'], [462, 7, 'happy', 'stand'], [552, 6, 'joy', 'arms-up'], [642, 11, 'happy', 'stand'], [732, 12, 'joy', 'arms-up']].map(([x, v, mood, pose], i) => (
            <VisitorFigure key={i} x={x as number} y={448} s={0.84} v={VISITORS[v as number]} mood={mood as Mood} pose={pose as JPose} facing="left" blinkDelay={i * 0.4} />
          ))}
        </g>
      </Tap>
      <Tap say="So many happy hearts!" sfx="sparkle">
        <g>
          <Heart x={430} y={210} s={0.7} shaded />
          <Heart x={560} y={180} s={0.85} color="#ffcf3f" shaded />
          <Heart x={690} y={220} s={0.65} shaded />
          <Heart x={350} y={250} s={0.5} color="#ffcf3f" shaded />
        </g>
      </Tap>
    </Scene>
  )
}

/** A little clay lamp, lit for the evening: (x, y) = the middle of its foot. */
function ClayLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={10} y={-16} r={26} color="#ffe9a0" />
      <path d="M-16 -2 Q-18 -12 -6 -14 L10 -14 Q20 -12 22 -8 L14 -6 Q8 0 -6 0 Q-14 0 -16 -2 Z" fill="#c98448" stroke="#8a5428" strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={-2} cy={-13} rx={5} ry={2} fill="#6b4422" />
      <g className="pc-flicker"><path d="M18 -10 Q14 -18 19 -26 Q24 -18 20 -10 Z" fill="#ffb347" stroke="#e8743b" strokeWidth={1.2} /></g>
    </g>
  )
}

// 10. "That was how the church began! God's family prayed together and shared what they had. They ate together in their
//     homes, with happy hearts. And God's Spirit is with us, too. He is our Helper, every day!"
// On a rooftop at sunset: God's family, old friends and new ones from many lands, sitting round a cloth with bread, fruit
// and fish to share. Peter passes bread along, a visitor gives thanks, and Mary holds out some bread to you (the child
// playing, reaching for it), right there with them. A soft breeze swirls by, and hearts rise up.
function Page10() {
  const me = usePlayer()
  const id = uid(useId())
  return (
    <Scene sky="dusk" ground="none" clouds={false}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb08a" /><stop offset="0.6" stopColor="#ffd6a0" /><stop offset="1" stopColor="#fff0c8" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={800} height={300} fill={`url(#${id}s)`} />
      <Sun x={118} y={212} s={0.55} />
      <Roofs warm spots={[[54, 286, 70, 56], [124, 286, 60, 42], [192, 286, 66, 70], [258, 286, 58, 46], [470, 286, 60, 50], [536, 286, 64, 64], [600, 286, 58, 44], [784, 286, 60, 52]]} />
      <FarTemple x={700} y={284} s={0.46} />
      <Gust x={170} y={92} len={300} rot={-4} d={0.5} w={4} o={0.75} edge="#f0b88a" />
      <Gust x={540} y={66} len={180} rot={6} d={1.4} w={3.5} o={0.7} edge="#f0b88a" />
      {/* the rooftop: its low wall at the back, plants in pots, and the floor */}
      <rect x={0} y={282} width={800} height={24} fill="#efcf9c" stroke="#c49a5e" strokeWidth={2.5} />
      <rect x={0} y={278} width={800} height={7} fill="#e3c08a" />
      {[[30, 278], [770, 278]].map(([px, py]) => (
        <g key={px}>
          <path d={`M${px - 10} ${py - 26} Q${px - 22} ${py - 44} ${px - 6} ${py - 50} M${px} ${py - 26} Q${px + 2} ${py - 52} ${px + 14} ${py - 56} M${px + 8} ${py - 26} Q${px + 22} ${py - 40} ${px + 18} ${py - 46}`} stroke="#4f9a4a" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={`M${px - 14} ${py - 26} L${px + 14} ${py - 26} L${px + 10} ${py} L${px - 10} ${py} Z`} fill="#c97a4a" stroke="#8a4a2a" strokeWidth={2} strokeLinejoin="round" />
        </g>
      ))}
      <rect x={0} y={306} width={800} height={144} fill="#ead2a2" />
      <path d="M0 344 H800 M0 390 H800" stroke="#d9bc86" strokeWidth={1.6} opacity={0.7} />
      {/* everyone round the cloth (two friends standing behind) */}
      <Person x={262} y={340} s={0.84} look={PEOPLE.andrew} pose="pray" blinkDelay={0.8} />
      <VisitorFigure x={673} y={340} s={0.84} v={VISITORS[3]} pose="wave" mood="joy" blinkDelay={1.5} />
      <Sitting x={92} y={388} s={0.92} look={VISITORS[1]} pose="hold" holding="bread" blinkDelay={0.4}><Dress v={VISITORS[1]} /></Sitting>
      <Sitting x={204} y={388} s={0.94} look={PEOPLE.peter} pose="point" holding="bread" blinkDelay={0.9} />
      <Tap say="Thank You, God, for my new family!" sfx="ding">
        <Sitting x={316} y={386} s={0.92} look={VISITORS[7]} pose="pray" blinkDelay={1.4}><Dress v={VISITORS[7]} /></Sitting>
      </Tap>
      <Tap say="This bread is for you!" sfx="ding">
        <Sitting x={428} y={386} s={0.92} look={PEOPLE.mary} pose="point" holding="bread" blinkDelay={0.2} />
      </Tap>
      <Tap say="I'm in God's family, too!" sfx="fanfare">
        <Person x={540} y={392} s={1.12} look={me.look} pose="point" facing="left" blinkDelay={0.5} />
      </Tap>
      <Sitting x={620} y={388} s={0.94} look={PEOPLE.john} pose="hold" blinkDelay={1.1} />
      <Sitting x={726} y={390} s={0.92} look={VISITORS[6]} pose="hold" holding="bread" blinkDelay={0.6}><Dress v={VISITORS[6]} /></Sitting>
      {/* the cloth, with the food on it */}
      <path d="M118 398 L682 398 L718 438 L82 438 Z" fill="#f6efe0" stroke="#c9b48a" strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M126 406 L674 406" stroke="#7cb0e0" strokeWidth={3} />
      <Tap say="Yum! Bread and grapes and fish." sfx="chomp">
        <g>
          <Bread x={176} y={420} s={0.62} />
          <Bread x={214} y={424} s={0.56} />
          <Emoji e="🍇" x={318} y={418} size={36} />
          <ellipse cx={420} cy={424} rx={34} ry={9} fill="#e9e2d4" stroke="#b9a98a" strokeWidth={2} />
          <Fish x={410} y={420} s={0.5} color="#e0a05a" />
          <Fish x={432} y={424} s={0.46} color="#d98a4a" facing="left" />
          <Bread x={540} y={422} s={0.6} />
          <path d="M600 426 Q596 408 606 402 L618 402 Q628 408 624 426 Z" fill="#d98a5a" stroke="#8a4a2a" strokeWidth={2} strokeLinejoin="round" />
        </g>
      </Tap>
      <ClayLamp x={660} y={430} s={0.9} />
      <Heart x={330} y={200} s={0.6} shaded />
      <Heart x={470} y={170} s={0.75} color="#ffcf3f" shaded />
      <Heart x={612} y={226} s={0.5} shaded />
    </Scene>
  )
}

/** Part one is pages 1 to 5; part two (data/pentecost.ts, `first: 5`) is pages 6 to 10. */
export const PENTECOST_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10]
