// The birthday story: one illustration per page (see data/party.ts for the words). It's about whoever
// is having the birthday: their name on the bunting, their date on the calendar, their look, their
// family (the grown-ups, brothers and sisters, a baby to hold, pets) and their own Pals in party hats.
// God is never drawn as a person: His love is light (Glow, rays, Sparkles). Some local props here
// (Room, PalAt, SittingKid, Little) are shared with the bedtime pictures.
import { BuddyContext } from './buddy'
import { useContext, useId, type ComponentType, type ReactNode } from 'react'
import PalArt from '../../components/PalArt'
import { palById } from '../../data/pals'
import { MONTHS } from '../../lib/birthday'
import { darken, ink, lighten } from '../kit'
import { PartyHatShape } from '../partyHat'
import { Person, type Holding, type Look, type Pose } from '../people'
import { Balloon, Cake, Emoji, Flower, Glow, Moon, Scene, Sparkles, Sun, Tree, sparkle } from './kit'
import { usePlayer, type PlayerArt } from './player'

// ---------- Local props (some shared with bedtime.tsx) ----------

/** A cozy room: wall, baseboard and floorboards, with an optional window (day or a snowy/starry night). */
export function Room({ wall = '#ffe6f0', floor = '#e8c9a0', stripes = 0.5, win, children }: {
  wall?: string; floor?: string; /** opacity of the wallpaper stripes (0 = plain) */ stripes?: number
  win?: { x: number; y: number; w: number; h: number; night?: boolean; snow?: boolean; curtain?: string }
  children?: ReactNode
}) {
  const clip = `rm${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g>
      <rect x={0} y={0} width={800} height={360} fill={wall} />
      {stripes > 0 && Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 84 + 20} y={0} width={34} height={360} fill={lighten(wall, 0.35)} opacity={stripes} />)}
      <rect x={0} y={348} width={800} height={14} fill={lighten(wall, 0.5)} stroke={darken(wall, 0.12)} strokeWidth={2} />
      <rect x={0} y={362} width={800} height={88} fill={floor} />
      {[384, 410, 438].map((fy) => <path key={fy} d={`M0 ${fy} L800 ${fy}`} stroke={darken(floor, 0.1)} strokeWidth={2} />)}
      {win && (
        <g>
          <defs>
            <clipPath id={clip}><rect x={win.x} y={win.y} width={win.w} height={win.h} rx={10} /></clipPath>
            <linearGradient id={`${clip}g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={win.night ? '#18163f' : '#8fd3ff'} /><stop offset="1" stopColor={win.night ? '#3b3486' : '#e2f6ff'} />
            </linearGradient>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <rect x={win.x} y={win.y} width={win.w} height={win.h} fill={`url(#${clip}g)`} />
            {win.night && <Moon x={win.x + win.w * 0.7} y={win.y + win.h * 0.32} s={0.55} />}
            {win.night && [[0.2, 0.2], [0.42, 0.12], [0.3, 0.45], [0.85, 0.6]].map(([fx, fy], i) => (
              <path key={i} className="pa-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={sparkle(win.x + win.w * fx, win.y + win.h * fy, 4)} fill="#fff8d0" />
            ))}
            {!win.night && <ellipse cx={win.x + win.w * 0.35} cy={win.y + win.h * 0.35} rx={26} ry={10} fill="#fff" opacity={0.9} />}
            {win.snow && (
              <>
                {Array.from({ length: 12 }, (_, i) => <circle key={i} className="pa-float" style={{ animationDelay: `${(i % 4) * 0.5}s` }} cx={win.x + ((i * 37) % win.w)} cy={win.y + ((i * 53) % (win.h - 20)) + 6} r={3} fill="#fff" />)}
                <path d={`M${win.x} ${win.y + win.h - 16} Q${win.x + win.w / 2} ${win.y + win.h - 34} ${win.x + win.w} ${win.y + win.h - 14} L${win.x + win.w} ${win.y + win.h} L${win.x} ${win.y + win.h} Z`} fill="#f4f8ff" />
              </>
            )}
          </g>
          <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={10} fill="none" stroke="#fff" strokeWidth={9} />
          <path d={`M${win.x + win.w / 2} ${win.y} L${win.x + win.w / 2} ${win.y + win.h} M${win.x} ${win.y + win.h / 2} L${win.x + win.w} ${win.y + win.h / 2}`} stroke="#fff" strokeWidth={6} />
          <rect x={win.x - 12} y={win.y + win.h} width={win.w + 24} height={10} rx={4} fill="#fff" stroke={darken(wall, 0.15)} strokeWidth={2} />
          {[-1, 1].map((side) => {
            const c = win.curtain ?? '#ff9fc6'
            const ex = side < 0 ? win.x - 16 : win.x + win.w + 16
            return <path key={side} d={`M${ex} ${win.y - 12} L${ex + side * -34} ${win.y - 12} Q${ex + side * -14} ${win.y + win.h * 0.5} ${ex + side * -26} ${win.y + win.h + 8} L${ex} ${win.y + win.h + 8} Z`} fill={c} stroke={ink(c)} strokeWidth={2.5} strokeLinejoin="round" />
          })}
          <rect x={win.x - 30} y={win.y - 18} width={win.w + 60} height={8} rx={4} fill="#c98448" />
        </g>
      )}
      {children}
    </g>
  )
}

/**
 * One of the Ark Pals, nested like the map does. (x, y) is where its feet touch the ground.
 * id 'buddy' draws the player's own Pal (BuddyContext) in its current form; if another spot names
 * that same Pal, it shows Zippy instead so the picture doesn't have two of theirs (`exact` turns
 * that off, for pictures of all their own Pals). `hat`: a party hat.
 */
export function PalAt({ id, x, y, size = 110, stage = 0, sleepy, yawn, flip, hat, exact }: {
  id: string; x: number; y: number; size?: number; stage?: number; sleepy?: boolean; yawn?: boolean; flip?: boolean; hat?: boolean; exact?: boolean
}) {
  const buddy = useContext(BuddyContext)
  const shown = id === 'buddy' ? buddy.id : id === buddy.id && !exact ? 'zippy' : id
  const shownStage = id === 'buddy' ? buddy.stage : stage
  return (
    <svg x={x - size / 2} y={y - size * 0.92} width={size} height={size} viewBox="0 0 200 200" overflow="visible" className={sleepy ? 'bt-sleepy' : undefined}>
      {sleepy && <style>{'.bt-sleepy .pa-blink{animation:none!important;transform:scaleY(.14)!important;transform-box:fill-box;transform-origin:center}'}</style>}
      <g transform={flip ? 'translate(200 0) scale(-1 1)' : undefined}>
        <PalArt pal={palById(shown)} stage={shownStage} size={200} />
      </g>
      {yawn && <ellipse cx={100} cy={105} rx={7} ry={9} fill="#6b2a3a" stroke="#2b2140" strokeWidth={2} />}
      {hat && <g transform="translate(76 -12) rotate(-12 30 66) scale(0.85)"><PartyHatShape /></g>}
    </svg>
  )
}

/** A child sitting on a little chair, front view: the Person from the hips up, a lap, and dangling legs. (x, y) = floor. */
export function SittingKid({ x, y, s = 1, look, pose = 'stand', holding, chair = '#c98448', blinkDelay = 0, children }: {
  x: number; y: number; s?: number; look: Look; pose?: Pose; holding?: Holding; chair?: string; blinkDelay?: number; children?: ReactNode
}) {
  const clip = `sk${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={clip}><rect x={-90} y={-220} width={180} height={194} /></clipPath></defs>
      <rect x={-30} y={-88} width={60} height={62} rx={12} fill={chair} stroke={ink(chair)} strokeWidth={3} />
      <rect x={-29} y={-24} width={7} height={24} rx={2} fill={darken(chair, 0.2)} />
      <rect x={22} y={-24} width={7} height={24} rx={2} fill={darken(chair, 0.2)} />
      <g clipPath={`url(#${clip})`}><Person x={0} y={8} s={1} look={look} pose={pose} holding={holding} blinkDelay={blinkDelay}>{children}</Person></g>
      <rect x={-36} y={-30} width={72} height={10} rx={5} fill={lighten(chair, 0.15)} stroke={ink(chair)} strokeWidth={3} />
      <path d="M-22 -36 L22 -36 Q27 -24 21 -17 L-21 -17 Q-27 -24 -22 -36 Z" fill={look.robe} stroke={ink(look.robe)} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={-15} y={-19} width={9} height={15} rx={4} fill={look.skin} stroke={ink(look.skin)} strokeWidth={1.5} />
      <rect x={6} y={-19} width={9} height={15} rx={4} fill={look.skin} stroke={ink(look.skin)} strokeWidth={1.5} />
      <ellipse cx={-11} cy={-3} rx={8} ry={4.5} fill="#ff5d9e" />
      <ellipse cx={11} cy={-3} rx={8} ry={4.5} fill="#ff5d9e" />
    </g>
  )
}

/** A baby in a blanket (the birthday child as a newborn, or a baby brother or sister). `awake` opens the eyes and adds a giggly smile. */
export function Little({ x, y, s = 1, blanket = '#ffd0e6', skin = '#f6d2b8', bow, awake }: {
  x: number; y: number; s?: number; blanket?: string; skin?: string; bow?: string; awake?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={30} ry={18} fill={blanket} stroke={ink(blanket)} strokeWidth={2.5} />
      <path d="M-28 6 Q0 20 28 6" stroke={ink(blanket)} strokeWidth={2} fill="none" />
      <circle cx={-10} cy={-4} r={15} fill={skin} stroke={ink(skin)} strokeWidth={2} />
      {awake ? (
        <>
          <circle cx={-15} cy={-6} r={2.4} fill="#2b2140" />
          <circle cx={-4} cy={-6} r={2.4} fill="#2b2140" />
          <path d="M-14 1 Q-9.5 7 -5 1 Z" fill="#6b2a3a" />
        </>
      ) : (
        <path d="M-17 -6 q3 2.5 6 0 M-7 -6 q3 2.5 6 0" stroke="#2b2140" strokeWidth={2} fill="none" strokeLinecap="round" />
      )}
      <ellipse cx={-20} cy={0} rx={3.5} ry={2.2} fill="#ff7fb0" opacity={0.55} />
      <ellipse cx={0} cy={0} rx={3.5} ry={2.2} fill="#ff7fb0" opacity={0.55} />
      {bow && <path d="M-10 -18 l9 -6 l0 11 Z M-10 -18 l-9 -6 l0 11 Z" fill={bow} stroke={ink(bow)} strokeWidth={1.5} />}
    </g>
  )
}

/** A string of little flags, sagging between two points; `letters` puts one letter on each flag. */
function Bunting({ x0, x1, y, sag = 30, n, letters, colors = ['#ff6fae', '#ffd34d', '#5fb7ff', '#5fd39a', '#c9a8ff', '#ffa64d'] }: {
  x0: number; x1: number; y: number; sag?: number; n?: number; letters?: string; colors?: string[]
}) {
  const count = letters ? letters.length : n ?? 9
  const mx = (x0 + x1) / 2, my = y + sag * 2
  const at = (t: number) => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * mx + t ** 2 * x1, (1 - t) ** 2 * y + 2 * (1 - t) * t * my + t ** 2 * y]
  const w = Math.min(44, ((x1 - x0) / count) * 0.86)
  return (
    <g>
      <path d={`M${x0} ${y} Q${mx} ${my} ${x1} ${y}`} stroke="#a0806a" strokeWidth={2.5} fill="none" />
      {Array.from({ length: count }, (_, i) => {
        const [fx, fy] = at((i + 0.5) / count)
        const c = colors[i % colors.length]
        const ch = letters?.[i]
        if (ch === ' ') return null
        return (
          <g key={i} className="sc-sway">
            <path d={`M${fx - w / 2} ${fy - 2} L${fx + w / 2} ${fy - 2} L${fx} ${fy + w * 1.1} Z`} fill={c} stroke={ink(c)} strokeWidth={2} strokeLinejoin="round" />
            {ch && <text x={fx} y={fy + w * 0.36} fontSize={w * 0.56} fontWeight={800} fill="#fff" stroke={ink(c)} strokeWidth={1} paintOrder="stroke" textAnchor="middle" dominantBaseline="middle" fontFamily="'Baloo 2', system-ui, sans-serif">{ch}</text>}
          </g>
        )
      })}
    </g>
  )
}

/** The child's name for a banner: letters only, if it fits on the flags. */
const bannerName = (name: string) => {
  const up = name.toUpperCase().replace(/[^A-Z ]/g, '').trim()
  return up && up.length <= 10 ? up : 'HOORAY'
}

export function Present({ x, y, s = 1, color = '#5fb7ff', ribbon = '#ffd34d' }: { x: number; y: number; s?: number; color?: string; ribbon?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-24} y={-40} width={48} height={40} rx={4} fill={color} stroke={ink(color)} strokeWidth={3} />
      <rect x={-28} y={-50} width={56} height={13} rx={4} fill={lighten(color, 0.15)} stroke={ink(color)} strokeWidth={3} />
      <rect x={-5} y={-50} width={10} height={50} fill={ribbon} />
      <ellipse cx={-10} cy={-56} rx={11} ry={7} fill="none" stroke={ribbon} strokeWidth={5} transform="rotate(-20 -10 -56)" />
      <ellipse cx={10} cy={-56} rx={11} ry={7} fill="none" stroke={ribbon} strokeWidth={5} transform="rotate(20 10 -56)" />
    </g>
  )
}

function Cupcake({ x, y, s = 1, frost = '#ffd6e8' }: { x: number; y: number; s?: number; frost?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-16 0 L-20 -22 L20 -22 L16 0 Z" fill="#ff8cc0" stroke="#d0608e" strokeWidth={2.5} strokeLinejoin="round" />
      {[-10, 0, 10].map((sx) => <path key={sx} d={`M${sx} -20 L${sx * 0.8} -2`} stroke="#d0608e" strokeWidth={1.5} />)}
      <path d="M-24 -22 Q-27 -36 -12 -38 Q-8 -52 4 -46 Q20 -50 22 -36 Q28 -30 24 -22 Z" fill={frost} stroke={ink(frost)} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={3} cy={-50} r={5} fill="#ff5d5d" stroke="#c03a3a" strokeWidth={1.5} />
      {[[-12, -30, '#5fb7ff'], [6, -34, '#ffd34d'], [14, -27, '#5fd39a'], [-4, -40, '#c9a8ff']].map(([cx, cy, c], i) => <rect key={i} x={cx as number} y={cy as number} width={5} height={2.4} rx={1.2} fill={c as string} transform={`rotate(${i * 50} ${cx} ${cy})`} />)}
    </g>
  )
}

/** A party table with a scalloped cloth; things go on top at y - 64. */
function Table({ x, y, w = 200, cloth = '#ffffff' }: { x: number; y: number; w?: number; cloth?: string }) {
  return (
    <g>
      <rect x={x - w / 2 + 16} y={y - 40} width={10} height={40} fill="#a0703f" />
      <rect x={x + w / 2 - 26} y={y - 40} width={10} height={40} fill="#a0703f" />
      <path d={`M${x - w / 2} ${y - 66} L${x + w / 2} ${y - 66} L${x + w / 2} ${y - 36} ${Array.from({ length: 6 }, (_, i) => `Q${x + w / 2 - (i + 0.5) * (w / 6)} ${y - 22} ${x + w / 2 - (i + 1) * (w / 6)} ${y - 36}`).join(' ')} Z`}
        fill={cloth} stroke="#e8b0c8" strokeWidth={3} strokeLinejoin="round" />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={x - w / 2 + (i + 0.5) * (w / 6)} cy={y - 50} r={4} fill="#ff9fc6" />)}
    </g>
  )
}

/** A shiny gold balloon of their new age (a star when we don't know it). */
const NumberBalloon = ({ x, y, s = 1, n }: { x: number; y: number; s?: number; n?: number }) => (
  <g className="sc-float">
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 40 Q-10 80 4 120" stroke="#8a7a99" strokeWidth={2} fill="none" />
      <text x={0} y={0} fontSize={110} fontWeight={900} fill="#ffd34d" stroke="#e0a800" strokeWidth={6} paintOrder="stroke" textAnchor="middle" dominantBaseline="middle" fontFamily="'Baloo 2', system-ui, sans-serif">{n ?? '★'}</text>
      <ellipse cx={-14} cy={-22} rx={6} ry={12} fill="#fff" opacity={0.55} transform="rotate(20 -14 -22)" />
    </g>
  </g>
)

const CONFETTI = [[150, 120], [230, 60], [320, 150], [470, 90], [560, 140], [640, 70], [700, 160], [380, 40], [260, 200], [520, 210]]
const Confetti = () => (
  <g>
    {CONFETTI.map(([cx, cy], i) => (
      // Tilted by the outer group; the twinkle (a CSS animation) on the inner one would otherwise undo the tilt.
      <g key={i} transform={`rotate(${i * 37} ${cx} ${cy})`}>
        <rect className="pa-twinkle" style={{ animationDelay: `${i * 0.25}s` }} x={cx} y={cy} width={10} height={5} rx={2}
          fill={['#ff6fae', '#ffd34d', '#5fb7ff', '#5fd39a', '#c9a8ff'][i % 5]} />
      </g>
    ))}
  </g>
)

/** Soft beams of light fanning out from (x, y); they turn very slowly. */
function Rays({ x, y, r = 560, n = 16, color = '#fff6b0', opacity = 0.28 }: { x: number; y: number; r?: number; n?: number; color?: string; opacity?: number }) {
  const w = (Math.PI * r) / n / 2.4
  return (
    <g className="pa-spin">
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M0 0 L${-w} ${-r} L${w} ${-r} Z`} transform={`translate(${x} ${y}) rotate(${(i * 360) / n})`} fill={color} opacity={opacity} />
      ))}
    </g>
  )
}

/** The kit's meadow, drawn as a prop so light rays can shine behind it. */
const Meadow = () => (
  <g>
    <path d="M0 330 Q200 290 400 320 T800 310 L800 450 L0 450 Z" fill="#8fd18a" />
    <path d="M0 370 Q220 340 430 372 T800 360 L800 450 L0 450 Z" fill="#6cc46a" />
    {[[90, 400], [210, 420], [560, 410], [700, 395], [380, 430]].map(([x, y], i) => <Flower key={i} x={x} y={y} color={['#ff8cc0', '#ffd34d', '#ffffff'][i % 3]} />)}
  </g>
)

const heart = (x: number, y: number, r: number) =>
  `M${x} ${y + r * 0.9} C${x - r * 1.5} ${y - r * 0.1} ${x - r * 0.9} ${y - r * 1.25} ${x} ${y - r * 0.45} C${x + r * 0.9} ${y - r * 1.25} ${x + r * 1.5} ${y - r * 0.1} ${x} ${y + r * 0.9} Z`

const Heart = ({ x, y, r = 14, color = '#ff6fae', d = 0 }: { x: number; y: number; r?: number; color?: string; d?: number }) => (
  <g className="sc-float" style={{ animationDelay: `${d}s` }}>
    <path d={heart(x, y, r)} fill={color} stroke={ink(color)} strokeWidth={2} />
    <ellipse cx={x - r * 0.45} cy={y - r * 0.35} rx={r * 0.2} ry={r * 0.13} fill="#fff" opacity={0.6} transform={`rotate(-35 ${x - r * 0.45} ${y - r * 0.35})`} />
  </g>
)

/** A little picture book held open. */
const Book = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -14 Q-14 -20 -30 -16 L-30 12 Q-14 8 0 14 Q14 8 30 12 L30 -16 Q14 -20 0 -14 Z" fill="#5fb7ff" stroke="#3b7fc0" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M0 -12 Q-12 -17 -26 -13 L-26 9 Q-12 6 0 11 Q12 6 26 9 L26 -13 Q12 -17 0 -12 Z" fill="#fffaf0" />
    <path d="M0 -12 L0 11" stroke="#d8cfc2" strokeWidth={2} />
    <path d="M-20 -6 L-6 -4 M-20 0 L-6 2 M6 -4 L20 -6 M6 2 L20 0" stroke="#c9b8a0" strokeWidth={2} strokeLinecap="round" />
  </g>
)

/** A baby in the family's colors. */
const babyOf = (p: PlayerArt, look: Look, awake = true) => ({ blanket: lighten(look.robe, 0.45), skin: p.look.skin, awake })

/** Their pets, sitting at the front of a picture. */
const Pets = ({ p, xs, y }: { p: PlayerArt; xs: number[]; y: number }) => (
  <>{p.pets.slice(0, xs.length).map((pet, i) => <Emoji key={pet.name + i} e={pet.emoji} x={xs[i]} y={y} size={54} />)}</>
)

// ---------- Pages ----------

// 1. "A long time ago, on <January eighth>, a wonderful baby was born. It was you, <name>!"
function Page1() {
  const p = usePlayer()
  const [g1, g2] = p.grownups
  const month = p.birthday ? MONTHS[p.birthday.month - 1].slice(0, 3).toUpperCase() : '★'
  const baby = <Little x={4} y={-62} s={0.95} bow={p.look.bow} blanket={lighten(p.look.robe, 0.45)} skin={p.look.skin} />
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      <Room wall="#ffe6f0" win={{ x: 560, y: 80, w: 140, h: 120, night: true, snow: p.birthday ? [12, 1, 2].includes(p.birthday.month) : false }}>
        <g>
          <rect x={110} y={84} width={96} height={104} rx={8} fill="#fff" stroke="#d9b8c8" strokeWidth={3} />
          <rect x={110} y={84} width={96} height={28} rx={8} fill="#ff6b6b" />
          <rect x={110} y={100} width={96} height={12} fill="#ff6b6b" />
          <text x={158} y={100} fontSize={17} fontWeight={800} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontFamily="'Baloo 2', system-ui, sans-serif">{month}</text>
          <text x={158} y={152} fontSize={56} fontWeight={900} fill="#e0577a" textAnchor="middle" dominantBaseline="middle" fontFamily="'Baloo 2', system-ui, sans-serif">{p.birthday?.day ?? '♥'}</text>
          <circle cx={132} cy={80} r={4} fill="#a07a8a" /><circle cx={184} cy={80} r={4} fill="#a07a8a" />
        </g>
        <Bunting x0={250} x1={510} y={44} sag={18} letters={bannerName(p.name)} />
      </Room>
      <Glow x={370} y={300} r={130} color="#fff3c8" />
      {g1 ? (
        <Person x={350} y={428} s={1.5} look={g1.look} pose="hold">{baby}</Person>
      ) : (
        // nobody to hold the baby in the picture: a cozy cradle
        <g>
          <path d="M290 396 Q350 448 410 396 Z" fill="#e8c9a0" stroke="#a0703f" strokeWidth={4} strokeLinejoin="round" />
          <Little x={354} y={384} s={1.1} bow={p.look.bow} blanket={lighten(p.look.robe, 0.45)} skin={p.look.skin} />
        </g>
      )}
      {g2 && <Person x={485} y={426} s={1.52} look={g2.look} facing="left" blinkDelay={1.4} />}
      <Heart x={280} y={200} r={14} />
      <Heart x={420} y={176} r={10} color="#ff9fc6" d={0.7} />
      <Sparkles spots={[[320, 240, 7], [400, 226, 5], [250, 280, 5]]} />
    </Scene>
  )
}

// 2. "God made you, <name>! He made your bright eyes, your happy giggles, and your smart brain. God made you wonderfully!"
function Page2() {
  const p = usePlayer()
  return (
    <Scene sky="glory" ground="none" clouds={false}>
      <Rays x={400} y={-20} r={600} n={18} />
      <Meadow />
      <Glow x={400} y={250} r={210} />
      <Person x={400} y={418} s={1.85} look={p.look} pose="arms-up" />
      <Sparkles spots={[[360, 262, 5], [440, 262, 5], [300, 160, 10], [520, 150, 12], [250, 260, 7], [560, 280, 8]]} />
      <Emoji e="💡" x={400} y={172} size={42} bob />
      <g className="sc-float">
        <text x={512} y={218} fontSize={30} fill="#ff6fae" fontWeight={800} fontFamily="'Baloo 2', system-ui, sans-serif">♪</text>
        <text x={540} y={196} fontSize={24} fill="#c9a8ff" fontWeight={800} fontFamily="'Baloo 2', system-ui, sans-serif">♫</text>
      </g>
      <Heart x={268} y={200} r={14} d={0.4} />
      <Flower x={180} y={410} color="#ff8cc0" s={1.3} />
      <Flower x={620} y={420} color="#ffd34d" s={1.3} />
    </Scene>
  )
}

// 3. "God knows you, inside and out. He knows when you sit down and when you get up. And God loves you so much, …"
function Page3() {
  const p = usePlayer()
  return (
    <Scene sky="day" ground="meadow">
      <Sun x={150} y={80} s={0.7} />
      <Moon x={660} y={80} s={0.75} />
      <g className="pa-twinkle">
        <path d={heart(400, 175, 92)} fill="#ff9fc6" opacity={0.32} />
      </g>
      <Glow x={400} y={200} r={150} color="#fff3d0" />
      <Heart x={400} y={160} r={30} />
      <SittingKid x={270} y={418} s={1.5} look={p.look} pose="hold" blinkDelay={0.6}>
        <Book x={0} y={-58} s={0.9} />
      </SittingKid>
      <path d="M330 300 Q400 250 470 290" stroke="#ff9fc6" strokeWidth={5} strokeDasharray="4 12" strokeLinecap="round" fill="none" />
      <path d="M462 276 L474 292 L454 296" stroke="#ff9fc6" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g className="sc-float">
        <Person x={540} y={410} s={1.5} look={p.look} pose="arms-up" blinkDelay={2} />
      </g>
      <path d="M500 420 q-8 8 -16 4 M580 420 q8 8 16 4" stroke="#fff" strokeWidth={4} strokeLinecap="round" fill="none" />
      <Sparkles spots={[[310, 140, 8], [490, 130, 9], [600, 200, 6], [200, 220, 6]]} />
    </Scene>
  )
}

// 4. "Your family thanks God for you every day! <Mom> and <Dad> love you so much. And <brothers and sisters> give you big, giggly hugs!"
function Page4() {
  const p = usePlayer()
  const [g1, g2] = p.grownups
  const baby = p.siblings.find((s) => s.baby)
  const kids = p.siblings.filter((s) => !s.baby).slice(0, 2)
  return (
    <Scene sky="day" ground="none" clouds={false}>
      <Room wall="#fff1cf" floor="#d9b98a" win={{ x: 330, y: 70, w: 140, h: 110, curtain: '#7cc6ff' }}>
        {[[150, 120, '#ff9fc6'], [650, 130, '#9ad0ff']].map(([fx, fy, c], i) => (
          <g key={i}>
            <rect x={(fx as number) - 34} y={(fy as number) - 28} width={68} height={56} rx={6} fill="#fff" stroke="#c98448" strokeWidth={5} />
            <path d={heart(fx as number, (fy as number) - 2, 14)} fill={c as string} />
          </g>
        ))}
      </Room>
      <Glow x={400} y={120} r={170} />
      {g1 && <Person x={215} y={428} s={1.48} look={g1.look} pose="pray" blinkDelay={0.8} />}
      {g2 && <Person x={585} y={428} s={1.45} look={g2.look} pose="pray" facing="left" blinkDelay={1.9} />}
      {kids.map((k, i) => <Person key={k.name} x={i ? 494 : 306} y={434} s={1.12} look={k.look} pose="wave" facing={i ? 'left' : 'right'} blinkDelay={1.2 + i} />)}
      <Person x={400} y={432} s={1.75} look={p.look} pose={baby ? 'hold' : 'arms-up'}>
        {baby && <Little x={6} y={-60} s={1} {...babyOf(p, baby.look)} />}
      </Person>
      <Pets p={p} xs={[110, 690]} y={412} />
      <Heart x={330} y={226} r={12} />
      <Heart x={470} y={214} r={15} color="#ff9fc6" d={0.6} />
      <Heart x={400} y={180} r={10} d={1.2} />
      {baby && (
        <g stroke="#ff8cc0" strokeWidth={3} strokeLinecap="round" fill="none">
          <path d="M446 300 q6 -4 10 2" /><path d="M450 314 q7 -2 10 4" />
        </g>
      )}
    </Scene>
  )
}

// 5. "And now it's your birthday! You're <five> years old! Hooray! It's party time!"
function Page5() {
  const p = usePlayer()
  return (
    <Scene sky="day" ground="meadow">
      <Tree x={110} y={372} s={1.1} />
      <Tree x={690} y={372} s={1.1} />
      <Bunting x0={140} x1={660} y={104} sag={24} n={11} />
      <Confetti />
      <NumberBalloon x={210} y={232} s={0.85} n={p.age} />
      <Balloon x={610} y={220} color="#5fb7ff" />
      <Balloon x={650} y={240} color="#ff6fae" s={0.9} />
      <Balloon x={575} y={250} color="#ffd34d" s={0.85} />
      <Person x={320} y={420} s={1.65} look={p.look} pose="arms-up" />
      <Table x={520} y={420} w={210} />
      <Cake x={520} y={354} s={0.95} candles={Math.min(10, p.age ?? 3)} />
      <Emoji e="🎉" x={430} y={200} size={44} bob />
    </Scene>
  )
}

// 6. "All your Ark Pals came to the party! They brought balloons, presents, and yummy cupcakes."
function Page6() {
  const p = usePlayer()
  // Her own Pals, in party hats (her buddy first); a few friends fill in if she has only met a few.
  const fill = ['zippy', 'ember', 'pebble', 'pip'].filter((id) => !p.pals.some((x) => x.id === id)).map((id) => ({ id, stage: 0 }))
  const pals = [...p.pals, ...fill].slice(0, 6)
  const spots: [number, number, number][] = [[150, 420, 165], [275, 416, 160], [528, 420, 160], [652, 424, 150], [212, 344, 96], [590, 340, 96]]
  return (
    <Scene sky="day" ground="meadow">
      <Bunting x0={110} x1={690} y={60} sag={22} n={13} />
      <Balloon x={296} y={150} color="#ff6fae" />
      <Balloon x={252} y={168} color="#ffd34d" s={0.9} />
      <Balloon x={606} y={96} color="#5fb7ff" s={0.85} />
      {/* the back row first */}
      {pals.map((pal, i) => i >= 4 && <PalAt key={pal.id} id={pal.id} stage={pal.stage} x={spots[i][0]} y={spots[i][1]} size={spots[i][2]} hat exact />)}
      {pals.map((pal, i) => i < 4 && <PalAt key={pal.id} id={pal.id} stage={pal.stage} x={spots[i][0]} y={spots[i][1]} size={spots[i][2]} hat exact />)}
      <Person x={400} y={420} s={1.6} look={p.look} pose="wave" />
      <Present x={205} y={426} s={0.85} color="#c9a8ff" />
      <Present x={108} y={428} s={0.7} color="#5fd39a" ribbon="#ff6fae" />
      <Cupcake x={470} y={428} s={0.95} />
      <Cupcake x={592} y={430} s={0.85} frost="#c9e8ff" />
      <Confetti />
    </Scene>
  )
}

// 7. "Happy birthday, <name>! God made you, God knows you, and God will love you forever and ever."
function Page7() {
  const p = usePlayer()
  const [g1, g2] = p.grownups
  const baby = p.siblings.find((s) => s.baby)
  const kids = p.siblings.filter((s) => !s.baby).slice(0, 2)
  return (
    <Scene sky="glory" ground="none" clouds={false}>
      <Rays x={400} y={210} r={600} n={20} color="#ffffff" opacity={0.35} />
      <Meadow />
      <Bunting x0={110} x1={690} y={44} sag={22} letters="HAPPY BIRTHDAY" />
      <Glow x={400} y={250} r={200} />
      {g1 && <Person x={205} y={418} s={1.28} look={g1.look} pose="arms-up" blinkDelay={1.1} />}
      {g2 && (
        <Person x={600} y={418} s={1.26} look={g2.look} pose={baby ? 'hold' : 'arms-up'} facing="left" blinkDelay={2.2}>
          {baby && <Little x={6} y={-62} s={0.9} {...babyOf(p, baby.look)} />}
        </Person>
      )}
      {kids.map((k, i) => <Person key={k.name} x={i ? 512 : 288} y={424} s={1.08} look={k.look} pose="arms-up" blinkDelay={0.5 + i} />)}
      <Person x={400} y={380} s={1.55} look={p.look} pose="arms-up" />
      <Cake x={400} y={430} s={1.15} candles={Math.min(10, p.age ?? 3)} />
      <Pets p={p} xs={[120, 680]} y={414} />
      <Heart x={300} y={170} r={16} />
      <Heart x={505} y={160} r={13} color="#ff9fc6" d={0.5} />
      <Heart x={400} y={128} r={11} d={1} />
      <Sparkles spots={[[250, 110, 9], [560, 100, 10], [330, 230, 6], [480, 220, 7]]} />
      <Flower x={120} y={430} color="#ff8cc0" />
      <Flower x={690} y={428} color="#ffd34d" />
    </Scene>
  )
}

export const BIRTHDAY_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
