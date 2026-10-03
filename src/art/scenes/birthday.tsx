// The birthday story: one illustration per page (the words are partyStory in data/birthday.ts). It's about
// whoever is having the birthday: their name on the bunting, their date on the calendar, their look, their
// family (the grown-ups, every brother and sister the story names, babies in someone's arms, pets) and their
// own Pals in party hats. God is never drawn as a person: His love is light (Glow, Rays, Sparkles).
// Some local props here (Room, PalAt, SittingKid, Little, Heart) are shared with the bedtime pictures.
import { useContext, useId, type ComponentType, type ReactNode } from 'react'
import PalArt from '../../components/PalArt'
import { palById } from '../../data/pals'
import { MONTHS } from '../../lib/birthday'
import { bannerName, pictured, PICTURED } from '../../lib/party'
import { numberWords } from '../../lib/spoken'
import { darken, ink, lighten } from '../kit'
import { PartyHatShape } from '../partyHat'
import { hatSpot, PAL_FACES, stageScale, type Species } from '../pals/faces'
import { Person, type Holding, type Look, type Pose } from '../people'
import { BuddyContext } from './buddy'
import { Balloon, Cake, Emoji, Flower, Glow, Moon, Rays, Scene, Sparkles, Sun, Tap, Tree, sparkle } from './kit'
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

const SLEEPY_CSS = '.bt-sleepy .pa-blink{animation:none!important;transform:scaleY(.14)!important;transform-box:fill-box;transform-origin:center}'
const BEAK = '#ffb347'

/** A big sleepy yawn on a Pal's mouth, in its species drawing's own coordinates (a dove opens its beak wide). */
function Yawn({ species }: { species: Species }) {
  const m = PAL_FACES[species].yawn
  return (
    <g>
      <ellipse cx={100} cy={m.y} rx={m.rx} ry={m.ry} fill="#6b2a3a" stroke="#2b2140" strokeWidth={2} />
      <ellipse cx={100} cy={m.y + m.ry * 0.45} rx={m.rx * 0.6} ry={m.ry * 0.35} fill="#ff8fa8" />
      {species === 'dove' && (
        <>
          <path d="M89 92 Q100 85 111 92 L100 98 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M93 105 Q100 103 107 105 L100 112 Z" fill={BEAK} stroke={ink(BEAK)} strokeWidth={2.5} strokeLinejoin="round" />
        </>
      )}
    </g>
  )
}

/**
 * One of the Ark Pals, nested like the map does. (x, y) is where its feet touch the ground.
 * id 'buddy' draws the player's own Pal (BuddyContext) in its current form; if another spot names
 * that same Pal, it shows Zippy instead so the picture doesn't have two of theirs (`exact` turns
 * that off, for pictures of all their own Pals). `hat`: a party hat on its head; `yawn`: a big yawn
 * (both placed for each kind of Pal, from art/pals/faces.ts).
 */
export function PalAt({ id, x, y, size = 110, stage = 0, sleepy, yawn, flip, hat, exact }: {
  id: string; x: number; y: number; size?: number; stage?: number; sleepy?: boolean; yawn?: boolean; flip?: boolean; hat?: boolean; exact?: boolean
}) {
  const buddy = useContext(BuddyContext)
  const shown = id === 'buddy' ? buddy.id : id === buddy.id && !exact ? 'zippy' : id
  const shownStage = id === 'buddy' ? buddy.stage : stage
  const pal = palById(shown)
  const h = hatSpot(pal.species, shownStage)
  return (
    <svg x={x - size / 2} y={y - size * 0.92} width={size} height={size} viewBox="0 0 200 200" overflow="visible" className={sleepy ? 'bt-sleepy' : undefined}>
      {sleepy && <style>{SLEEPY_CSS}</style>}
      <g transform={flip ? 'translate(200 0) scale(-1 1)' : undefined}>
        <PalArt pal={pal} stage={shownStage} size={200} />
        {(yawn || hat) && (
          // (the same scaling PalArt gives this stage, so the yawn and hat land on its face and head)
          <g transform={`translate(100 110) scale(${stageScale(shownStage)}) translate(-100 -110)`}>
            {yawn && <Yawn species={pal.species} />}
            {hat && <g transform={`translate(${h.x} ${h.y}) rotate(${h.tilt}) translate(-30 -63)`}><PartyHatShape /></g>}
          </g>
        )}
      </g>
    </svg>
  )
}

/** A Pal's name in the form it's in now (for what it says when tapped). */
const palName = (id: string, stage: number) => {
  const pal = palById(id)
  return pal.stages[Math.min(stage, pal.stages.length - 1)].name
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
      {/* (the same brown shoes as when they're standing) */}
      <ellipse cx={-11} cy={-3} rx={8} ry={4.5} fill="#7a5233" />
      <ellipse cx={11} cy={-3} rx={8} ry={4.5} fill="#7a5233" />
    </g>
  )
}

/** A baby in a blanket (the birthday child as a newborn, or a baby brother or sister). `awake` opens the eyes and adds a giggly smile. */
export function Little({ x, y, s = 1, blanket = '#ffd0e6', skin = '#f6d2b8', bow, awake }: {
  x: number; y: number; s?: number; blanket?: string; skin?: string; bow?: string; awake?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={31} ry={18} fill={blanket} stroke={ink(blanket)} strokeWidth={2.5} />
      <path d="M-29 6 Q0 20 29 6" stroke={ink(blanket)} strokeWidth={2} fill="none" />
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

/** A wooden cradle on rockers with a baby tucked in (`children`, drawn at about (0, -60)). (x, y) = the rockers on the floor. */
export function Cradle({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  const wood = '#c98448'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-60 -8 Q0 12 60 -8" stroke={darken(wood, 0.15)} strokeWidth={7} fill="none" strokeLinecap="round" />
      {[-38, 38].map((lx) => <rect key={lx} x={lx - 4} y={-30} width={8} height={26} rx={3} fill={wood} stroke={ink(wood)} strokeWidth={2} />)}
      {/* the far rim (inside of the basket), then the baby, then the front tucked up over the blanket */}
      <ellipse cx={0} cy={-54} rx={60} ry={10} fill={darken(wood, 0.3)} stroke={ink(wood)} strokeWidth={2.5} />
      {children}
      <path d="M-62 -54 Q0 -32 62 -54 L54 -26 Q0 -10 -54 -26 Z" fill={wood} stroke={ink(wood)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-50 -38 Q0 -22 50 -38" stroke={lighten(wood, 0.25)} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d={heart(0, -30, 7)} fill="#ff9fc6" stroke="#e0709a" strokeWidth={1.5} />
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

/** A picnic blanket on the grass, seen from the front: (x0..x1) along its front edge at y. */
function Blanket({ x0, x1, y, depth = 30 }: { x0: number; x1: number; y: number; depth?: number }) {
  const c = '#ffb3cf', back = y - depth
  return (
    <g>
      <path d={`M${x0} ${y} L${x0 + depth} ${back} L${x1 + depth} ${back} L${x1} ${y} Z`} fill={c} stroke={ink(c)} strokeWidth={2.5} strokeLinejoin="round" />
      {Array.from({ length: Math.floor((x1 - x0) / 24) }, (_, i) => x0 + 12 + i * 24).map((sx) => (
        <path key={sx} d={`M${sx} ${y} L${sx + depth} ${back}`} stroke="#fff" strokeWidth={6} opacity={0.65} />
      ))}
      <path d={`M${x0 + depth * 0.5} ${y - depth * 0.5} L${x1 + depth * 0.5} ${y - depth * 0.5}`} stroke="#fff" strokeWidth={6} opacity={0.65} />
    </g>
  )
}

/** A shiny gold balloon of their new age (a star when we don't know it), tied on at its bottom. */
const NumberBalloon = ({ x, y, s = 1, n }: { x: number; y: number; s?: number; n?: number }) => {
  // the knot goes under the last digit, so a "10" isn't tied on in the gap between its digits
  const kx = n !== undefined && n >= 10 ? 30 : 0
  return (
    <g className="sc-float">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={`M${kx} 30 Q${kx - 10} 70 ${kx + 4} 110`} stroke="#8a7a99" strokeWidth={2} fill="none" />
        <text x={0} y={0} fontSize={110} fontWeight={900} fill="#ffd34d" stroke="#e0a800" strokeWidth={6} paintOrder="stroke" textAnchor="middle" dominantBaseline="middle" fontFamily="'Baloo 2', system-ui, sans-serif">{n ?? '★'}</text>
        <path d={`M${kx - 6} 23 L${kx + 6} 23 L${kx} 33 Z`} fill="#ffd34d" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />
        <ellipse cx={-14} cy={-22} rx={6} ry={12} fill="#fff" opacity={0.55} transform="rotate(20 -14 -22)" />
      </g>
    </g>
  )
}

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

/** The kit's meadow, drawn as a prop so light rays can shine behind it (no flower where the birthday child stands). */
const Meadow = () => (
  <g>
    <path d="M0 330 Q200 290 400 320 T800 310 L800 450 L0 450 Z" fill="#8fd18a" />
    <path d="M0 370 Q220 340 430 372 T800 360 L800 450 L0 450 Z" fill="#6cc46a" />
    {[[90, 400], [210, 420], [560, 410], [700, 395]].map(([x, y], i) => <Flower key={i} x={x} y={y} color={['#ff8cc0', '#ffd34d', '#ffffff'][i % 3]} />)}
  </g>
)

const heart = (x: number, y: number, r: number) =>
  `M${x} ${y + r * 0.9} C${x - r * 1.5} ${y - r * 0.1} ${x - r * 0.9} ${y - r * 1.25} ${x} ${y - r * 0.45} C${x + r * 0.9} ${y - r * 1.25} ${x + r * 1.5} ${y - r * 0.1} ${x} ${y + r * 0.9} Z`

/** A shiny heart, bobbing gently (God's love, a family's love). */
export const Heart = ({ x, y, r = 14, color = '#ff6fae', d = 0 }: { x: number; y: number; r?: number; color?: string; d?: number }) => (
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

/** A baby in the family's colors, held in someone's arms (centred, so the blanket covers the holder's sash). */
const HeldBaby = ({ p, look }: { p: PlayerArt; look: Look }) => <Little x={0} y={-60} s={1} blanket={lighten(look.robe, 0.45)} skin={p.look.skin} awake />

// ---------- Brothers and sisters ----------

const SIB_COLORS = ['#ffb347', '#5fd39a', '#c9a8ff', '#ff8cc0', '#5fb7ff', '#ffd34d', '#ff6b6b', '#8d7cff']
function hsl(hex: string) {
  const n = parseInt(hex.slice(1), 16), [r, g, b] = [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min
  if (!d) return { h: 0, l, grey: true }
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { h: (h * 60 + 360) % 360, l, grey: false }
}
/** Two robe colours a child could mix up. */
function alike(a: string, b: string) {
  const x = hsl(a), y = hsl(b)
  if (x.grey || y.grey) return x.grey === y.grey && Math.abs(x.l - y.l) < 0.15
  const dh = Math.abs(x.h - y.h)
  return Math.min(dh, 360 - dh) < 26 && Math.abs(x.l - y.l) < 0.18
}
/** Brothers' and sisters' looks with robes that differ from the birthday child's and from each other's. */
export function apartLooks(me: Look, sibs: Look[]): Look[] {
  const used = [me.robe]
  return sibs.map((l) => {
    const robe = used.some((u) => alike(u, l.robe)) ? SIB_COLORS.find((c) => !used.some((u) => alike(u, c))) ?? l.robe : l.robe
    used.push(robe)
    return robe === l.robe ? l : { ...l, robe, bow: l.bow ? darken(robe, 0.12) : undefined }
  })
}

/** The family as the birthday pictures show them: every brother and sister the story names (in robes that
 *  don't match the birthday child's), the babies, and the grown-ups. */
function family(p: PlayerArt) {
  const sibs = pictured(p.siblings)
  const big = sibs.filter((s) => !s.baby)
  const looks = apartLooks(p.look, big.map((s) => s.look))
  return {
    g1: p.grownups[0], g2: p.grownups[1],
    kids: big.map((s, i) => ({ ...s, look: looks[i] })),
    babies: sibs.filter((s) => s.baby),
    pets: p.pets.slice(0, PICTURED.pets),
  }
}

// ---------- Pets ----------

/** A goldfish in a round bowl of water on a little stand. (x, y) = the stand on the floor. */
function FishBowl({ x, y, s = 1, fish = '🐠' }: { x: number; y: number; s?: number; fish?: string }) {
  const glass = '#9fd0ee', wood = '#c98448'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-22} y={-9} width={44} height={9} rx={3} fill={wood} stroke={ink(wood)} strokeWidth={2} />
      <path d="M-15 -68 A31 31 0 1 0 15 -68" fill="#eaf7ff" fillOpacity={0.55} stroke={glass} strokeWidth={3} />
      <path d="M-28 -52 A31 31 0 1 0 28 -52 Z" fill="#7cc8f2" fillOpacity={0.55} />
      <path d="M-28 -52 Q-14 -56 0 -52 Q14 -48 28 -52" stroke="#bfe6fb" strokeWidth={2.5} fill="none" />
      <Emoji e={fish} x={0} y={-34} size={34} />
      <circle cx={10} cy={-56} r={2.5} fill="none" stroke="#fff" strokeWidth={1.5} />
      <circle cx={14} cy={-63} r={1.8} fill="none" stroke="#fff" strokeWidth={1.2} />
      <ellipse cx={0} cy={-68} rx={15} ry={3.5} fill="none" stroke={glass} strokeWidth={2.5} />
      <path d="M-22 -58 Q-26 -44 -20 -30" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  )
}

/** A little bird standing on its wooden perch. (x, y) = the perch's foot on the floor. */
function Perch({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wood = '#c98448'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-3} rx={18} ry={5} fill={darken(wood, 0.1)} stroke={ink(wood)} strokeWidth={2} />
      <rect x={-3.5} y={-78} width={7} height={75} rx={3} fill={wood} stroke={ink(wood)} strokeWidth={1.5} />
      <rect x={-24} y={-82} width={48} height={7} rx={3.5} fill={wood} stroke={ink(wood)} strokeWidth={2} />
      <Emoji e="🐦" x={0} y={-82 - 38 * 0.42} size={38} />
    </g>
  )
}

/** A round, golden hamster sitting up. (x, y) = the ground under it. */
function Hamster({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const fur = '#e8a85a', line = ink(fur), paw = '#f6c3b5'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((d) => <g key={d}><circle cx={d * 13} cy={-36} r={6.5} fill={fur} stroke={line} strokeWidth={2} /><circle cx={d * 13} cy={-36} r={3.2} fill="#ffb3c1" /></g>)}
      <ellipse cx={0} cy={-19} rx={22} ry={19} fill={fur} stroke={line} strokeWidth={2.5} />
      <ellipse cx={0} cy={-11} rx={13} ry={10} fill="#fff4e2" />
      {[-1, 1].map((d) => <ellipse key={`c${d}`} cx={d * 13} cy={-17} rx={4} ry={2.6} fill="#ff9fb0" opacity={0.7} />)}
      {[-1, 1].map((d) => <g key={`e${d}`}><circle cx={d * 7} cy={-24} r={2.7} fill="#2b2140" /><circle cx={d * 7 - 0.8} cy={-25} r={0.9} fill="#fff" /></g>)}
      <path d="M-2.2 -19.5 L2.2 -19.5 L0 -17 Z" fill="#e0708a" />
      <path d="M-3 -15.5 Q0 -13.5 3 -15.5" stroke="#6b2a3a" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {[-1, 1].map((d) => <ellipse key={`p${d}`} cx={d * 6} cy={-8} rx={3.6} ry={2.6} fill={paw} stroke={line} strokeWidth={1} />)}
      {[-1, 1].map((d) => <ellipse key={`f${d}`} cx={d * 9} cy={-1.5} rx={5} ry={2.4} fill={paw} />)}
    </g>
  )
}

/** A friendly turtle walking side-on (facing right). (x, y) = the ground under it. */
function Turtle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const shell = '#6cbf5a', skin = '#b5dd76'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-22, 10].map((lx) => <rect key={lx} x={lx} y={-12} width={9} height={12} rx={4} fill={darken(skin, 0.18)} />)}
      <path d="M-30 -9 L-39 -6 L-30 -3 Z" fill={skin} stroke={ink(skin)} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M24 -13 Q34 -28 44 -22 Q51 -14 42 -8 Q32 -5 24 -9 Z" fill={skin} stroke={ink(skin)} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={40} cy={-18} r={2.3} fill="#2b2140" />
      <path d="M41 -12 Q44 -10.5 47 -13" stroke="#6b2a3a" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M-32 -8 Q-30 -40 0 -42 Q30 -40 32 -8 Z" fill={shell} stroke={ink(shell)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-14 -9 L-10 -29 L10 -29 L14 -9 M-10 -29 L-21 -33 M10 -29 L21 -33 M0 -29 L0 -41" stroke={darken(shell, 0.22)} strokeWidth={2} fill="none" strokeLinejoin="round" />
      <rect x={-34} y={-11} width={68} height={6} rx={3} fill={darken(shell, 0.12)} stroke={ink(shell)} strokeWidth={1.5} />
      {[-18, 16].map((lx) => <rect key={`n${lx}`} x={lx} y={-8} width={9} height={9} rx={4} fill={skin} stroke={ink(skin)} strokeWidth={1.5} />)}
    </g>
  )
}

/** What a pet says when it's tapped. */
const petSays = (name: string, e: string): [string, string] => {
  switch (e) {
    case '🐶': return [`${name} says woof woof!`, 'pop']
    case '🐱': return [`${name} says meow!`, 'pop']
    case '🐰': return [`${name} goes hop, hop!`, 'plop']
    case '🐦': return [`${name} says tweet tweet!`, 'ding']
    case '🐠': case '🐟': return [`${name} goes blub, blub!`, 'plop']
    case '🐹': return [`${name} says squeak!`, 'pop']
    default: return [`Hello, ${name}!`, 'pop']
  }
}

/** A family pet, tappable, standing on the ground at (x, y): a dog, cat or bunny; a bird on its perch; a fish in its bowl; a hamster; a turtle. */
function Pet({ pet, x, y, s = 1 }: { pet: { name: string; emoji: string }; x: number; y: number; s?: number }) {
  const [say, sfx] = petSays(pet.name, pet.emoji)
  const size = 76 * s
  const body = pet.emoji === '🐠' || pet.emoji === '🐟' ? <FishBowl x={x} y={y} s={s} fish={pet.emoji} />
    : pet.emoji === '🐦' ? <Perch x={x} y={y} s={s} />
    : pet.emoji === '🐹' ? <Hamster x={x} y={y} s={s} />
    : pet.emoji === '🐢' ? <Turtle x={x} y={y} s={s * 0.9} />
    : <Emoji e={pet.emoji} x={x} y={y - size * 0.42} size={size} />
  return <Tap say={say} sfx={sfx}>{body}</Tap>
}

/** Pets along the front of a picture: the first two at the ends, more in front of the grown-ups. `flip`: start on the right. */
function Pets({ pets, ends, front, y, flip }: { pets: { name: string; emoji: string }[]; ends: [number, number]; front: [number, number]; y: number; flip?: boolean }) {
  const xs = flip ? [ends[1], ends[0], front[1], front[0]] : [ends[0], ends[1], front[0], front[1]]
  return <>{pets.map((pet, i) => <Pet key={pet.name + i} pet={pet} x={xs[i]} y={i < 2 ? y : y + 8} s={i < 2 ? 1 : 0.85} />)}</>
}

// ---------- Pages ----------

// 1. "Five years ago, on January eighth, a wonderful baby was born. It was you, <name>!"
function Page1() {
  const p = usePlayer()
  const [g1, g2] = p.grownups
  const month = p.birthday ? MONTHS[p.birthday.month - 1].slice(0, 3).toUpperCase() : '★'
  const name = bannerName(p.name)
  const span = Math.min(280, Math.max(150, name.length * 44 + 20))
  const baby = <Little x={0} y={-62} s={0.95} bow={p.look.bow} blanket={lighten(p.look.robe, 0.45)} skin={p.look.skin} />
  return (
    <Scene sky="dawn" ground="none" clouds={false}>
      <Room wall="#ffe6f0" win={{ x: 560, y: 80, w: 140, h: 120, night: true, snow: p.birthday ? [12, 1, 2].includes(p.birthday.month) : false }}>
        <Tap say="This is your birthday!" sfx="ding">
          <g>
            <rect x={110} y={84} width={96} height={104} rx={8} fill="#fff" stroke="#d9b8c8" strokeWidth={3} />
            <rect x={110} y={84} width={96} height={28} rx={8} fill="#ff6b6b" />
            <rect x={110} y={100} width={96} height={12} fill="#ff6b6b" />
            <text x={158} y={100} fontSize={17} fontWeight={800} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontFamily="'Baloo 2', system-ui, sans-serif">{month}</text>
            <text x={158} y={152} fontSize={56} fontWeight={900} fill="#e0577a" textAnchor="middle" dominantBaseline="middle" fontFamily="'Baloo 2', system-ui, sans-serif">{p.birthday?.day ?? '♥'}</text>
            <circle cx={132} cy={80} r={4} fill="#a07a8a" /><circle cx={184} cy={80} r={4} fill="#a07a8a" />
          </g>
        </Tap>
        <Bunting x0={380 - span / 2} x1={380 + span / 2} y={44} sag={18} letters={name} />
      </Room>
      <Glow x={370} y={300} r={130} color="#fff3c8" />
      <Tap say="Hello, little baby!" sfx="sparkle">
        {g1
          ? <Person x={350} y={428} s={1.5} look={g1.look} pose="hold">{baby}</Person>
          // nobody to hold the baby in the picture: a cozy cradle
          : <Cradle x={370} y={432} s={1.1}><Little x={0} y={-60} s={1.05} bow={p.look.bow} blanket={lighten(p.look.robe, 0.45)} skin={p.look.skin} /></Cradle>}
      </Tap>
      {g2 && <Tap say="We love you!" sfx="sparkle"><Person x={485} y={426} s={1.52} look={g2.look} facing="left" blinkDelay={1.4} /></Tap>}
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
      <Tap say="God made me!" sfx="sparkle"><Person x={400} y={418} s={1.85} look={p.look} pose="arms-up" /></Tap>
      {/* bright eyes */}
      <Sparkles spots={[[376, 258, 4], [424, 258, 4], [300, 160, 10], [520, 150, 12], [250, 260, 7], [560, 280, 8]]} />
      <Tap say="A smart brain!" sfx="ding"><Emoji e="💡" x={400} y={172} size={42} bob /></Tap>
      <Tap say="Tee hee hee!" sfx="pop">
        <g className="sc-float">
          <text x={512} y={218} fontSize={30} fill="#ff6fae" fontWeight={800} fontFamily="'Baloo 2', system-ui, sans-serif">♪</text>
          <text x={540} y={196} fontSize={24} fill="#c9a8ff" fontWeight={800} fontFamily="'Baloo 2', system-ui, sans-serif">♫</text>
        </g>
      </Tap>
      <Tap say="God loves you!" sfx="sparkle"><Heart x={268} y={200} r={14} d={0.4} /></Tap>
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
      <Tap say="Good morning, sun!" sfx="ding"><Sun x={150} y={80} s={0.7} /></Tap>
      <Moon x={660} y={80} s={0.75} />
      <g className="pa-twinkle">
        <path d={heart(400, 175, 92)} fill="#ff9fc6" opacity={0.32} />
      </g>
      <Glow x={400} y={200} r={150} color="#fff3d0" />
      <Tap say="God knows you, inside and out!" sfx="sparkle"><Heart x={400} y={160} r={30} /></Tap>
      <Tap say="I sit down." sfx="plop">
        <SittingKid x={270} y={418} s={1.5} look={p.look} pose="hold" blinkDelay={0.6}>
          <Book x={0} y={-58} s={0.9} />
        </SittingKid>
      </Tap>
      <path d="M330 300 Q400 250 470 290" stroke="#ff9fc6" strokeWidth={5} strokeDasharray="4 12" strokeLinecap="round" fill="none" />
      <path d="M462 276 L474 292 L454 296" stroke="#ff9fc6" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Tap say="I get up!" sfx="pop">
        <g className="sc-float">
          <Person x={540} y={410} s={1.5} look={p.look} pose="arms-up" blinkDelay={2} />
        </g>
      </Tap>
      <path d="M500 420 q-8 8 -16 4 M580 420 q8 8 16 4" stroke="#fff" strokeWidth={4} strokeLinecap="round" fill="none" />
      <Sparkles spots={[[310, 140, 8], [490, 130, 9], [600, 200, 6], [200, 220, 6]]} />
    </Scene>
  )
}

// 4. "Your family thanks God for you every day! <Mom> and <Dad> love you so much. And <brothers and sisters> give you big, giggly hugs! …"
//    Everyone the words name is here: brothers and sisters hug the birthday child (an arm round the shoulders),
//    the birthday child holds the baby, a second baby is in a grown-up's arms, and the pets are at the front.
//    With nobody in the family cast, the birthday child hugs their own Pal.
function Page4() {
  const p = usePlayer()
  const { g1, g2, kids, babies, pets } = family(p)
  const wide = kids.length > 2
  const gs = wide ? 1.36 : 1.46
  const gx: [number, number] = wide ? [128, 672] : kids.length ? [200, 600] : [230, 570]
  // A second baby: in a grown-up's arms, or a big brother's or sister's, or a cradle.
  const second = babies[1]
  const holder = second ? (g2 ? 'g2' : g1 ? 'g1' : kids.length ? 'k0' : 'cradle') : undefined
  const alone = !g1 && !kids.length && !babies.length
  // Brothers and sisters, nearest first: [x, facing]; the near two reach an arm round the birthday child's
  // shoulders, the far two round theirs. With one grown-up (on the left), the first one stands on the right.
  const oneSide = !!g1 && !g2
  const KID_AT: [number, 'left' | 'right'][] = [[318, 'right'], [482, 'left'], [239, 'right'], [561, 'left']]
  const SLOT = oneSide ? [1, 0, 3, 2] : [0, 1, 2, 3]
  const kid = (i: number) => {
    const k = kids[i]
    const [x, facing] = KID_AT[SLOT[i]]
    const holds = i === 0 && holder === 'k0'
    return (
      <Tap key={`${k.name}${i}`} say={holds ? `${k.name} has the baby!` : 'Big hug!'} sfx="pop">
        <Person x={holds ? x + (facing === 'right' ? -12 : 12) : x} y={434} s={1.45} look={k.look} pose={holds ? 'hold' : 'point'} facing={facing} blinkDelay={1.2 + i * 0.7}>
          {holds && <HeldBaby p={p} look={second.look} />}
        </Person>
      </Tap>
    )
  }
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
      {g1 && (
        <Tap say={holder === 'g1' ? 'Look at the baby!' : 'Thank you, God!'} sfx="sparkle">
          <Person x={gx[0]} y={428} s={gs} look={g1.look} pose={holder === 'g1' ? 'hold' : 'pray'} blinkDelay={0.8}>
            {holder === 'g1' && <HeldBaby p={p} look={second.look} />}
          </Person>
        </Tap>
      )}
      {g2 && (
        <Tap say={holder === 'g2' ? 'Look at the baby!' : 'Thank you, God!'} sfx="sparkle">
          <Person x={gx[1]} y={428} s={gs} look={g2.look} pose={holder === 'g2' ? 'hold' : 'pray'} facing="left" blinkDelay={1.9}>
            {holder === 'g2' && <HeldBaby p={p} look={second.look} />}
          </Person>
        </Tap>
      )}
      {holder === 'cradle' && <Cradle x={560} y={440} s={0.8}><Little x={0} y={-60} s={1.05} blanket={lighten(second.look.robe, 0.45)} skin={p.look.skin} awake /></Cradle>}
      {/* nobody in the family cast: the birthday child with a hand on their own Pal's head */}
      {alone && <Tap say="Happy birthday!" sfx="good"><PalAt id="buddy" x={478} y={438} size={150} /></Tap>}
      <Tap say={babies[0] ? `Hello, baby ${babies[0].name}!` : 'Thank you, God, for my family!'} sfx="sparkle">
        <Person x={400} y={434} s={1.6} look={p.look} pose={babies[0] ? 'hold' : alone ? 'point' : 'arms-up'}>
          {babies[0] && <HeldBaby p={p} look={babies[0].look} />}
        </Person>
      </Tap>
      {/* the near brother and sister after the birthday child, so their arms go round their shoulders */}
      {kids.map((_, i) => i < 2 && kid(i))}
      {kids.map((_, i) => i >= 2 && kid(i))}
      <Pets pets={pets} ends={wide ? [44, 756] : [66, 734]} front={wide ? [188, 612] : [130, 670]} y={442} flip={oneSide} />
      <Heart x={330} y={226} r={12} />
      <Heart x={470} y={214} r={15} color="#ff9fc6" d={0.6} />
      <Heart x={400} y={180} r={10} d={1.2} />
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
      <Tap say={p.age ? `You're ${numberWords(p.age)}!` : 'Hooray!'} sfx="pop"><NumberBalloon x={210} y={232} s={0.85} n={p.age} /></Tap>
      <Tap sfx="pop">
        <Balloon x={610} y={220} color="#5fb7ff" />
        <Balloon x={650} y={240} color="#ff6fae" s={0.9} />
        <Balloon x={575} y={250} color="#ffd34d" s={0.85} />
      </Tap>
      <Tap say="Hooray! It's my birthday!" sfx="fanfare">
        <Person x={320} y={420} s={1.65} look={p.look} pose="arms-up" />
        {/* a party popper going off in their hand */}
        <Emoji e="🎉" x={384} y={248} size={40} />
        <g stroke="#ff6fae" strokeWidth={3} fill="none" strokeLinecap="round">
          <path d="M398 232 q6 -10 0 -18 q-6 -8 2 -16" /><path d="M408 240 q10 -6 16 0 q6 6 14 0" stroke="#5fb7ff" /><path d="M394 226 q-2 -12 8 -16" stroke="#ffd34d" />
        </g>
      </Tap>
      <Table x={520} y={420} w={210} />
      <Tap say="Make a wish!" sfx="sparkle"><Cake x={520} y={354} s={0.95} candles={Math.min(12, p.age ?? 3)} /></Tap>
    </Scene>
  )
}

// 6. "All your Ark Pals came to the party! They brought balloons, presents, and yummy cupcakes."
function Page6() {
  const p = usePlayer()
  // Their own Pals in party hats, their buddy next to them; a few friends fill in if they've only met one or two.
  const fill = ['zippy', 'ember', 'pebble', 'pip'].filter((id) => !p.pals.some((x) => x.id === id)).map((id) => ({ id, stage: 0 }))
  const pals = p.pals.length >= 3 ? p.pals.slice(0, 6) : [...p.pals, ...fill].slice(0, 4)
  const spots: [number, number, number][] = [[272, 416, 160], [528, 420, 160], [150, 420, 165], [652, 424, 150], [212, 344, 96], [590, 340, 96]]
  const pal = (i: number) => {
    const x = pals[i]
    return (
      <Tap key={x.id} say={`Happy birthday from ${palName(x.id, x.stage)}!`} sfx="good">
        <PalAt id={x.id} stage={x.stage} x={spots[i][0]} y={spots[i][1]} size={spots[i][2]} hat exact />
      </Tap>
    )
  }
  return (
    <Scene sky="day" ground="meadow">
      <Bunting x0={110} x1={690} y={60} sag={22} n={13} />
      <Tap sfx="pop">
        <Balloon x={296} y={150} color="#ff6fae" />
        <Balloon x={252} y={168} color="#ffd34d" s={0.9} />
        <Balloon x={654} y={196} color="#5fb7ff" s={0.85} />
      </Tap>
      <Blanket x0={430} x1={660} y={448} depth={30} />
      {/* the back row first */}
      {pals.map((_, i) => i >= 4 && pal(i))}
      {pals.map((_, i) => i < 4 && pal(i))}
      <Tap say="Thank you for coming!" sfx="good"><Person x={400} y={420} s={1.6} look={p.look} pose="wave" /></Tap>
      <Tap say="Presents!" sfx="ding">
        <Present x={205} y={436} s={0.85} color="#c9a8ff" />
        <Present x={108} y={438} s={0.7} color="#5fd39a" ribbon="#ff6fae" />
      </Tap>
      <Tap say="Yummy cupcakes!" sfx="chomp">
        <Cupcake x={474} y={440} s={0.95} />
        <Cupcake x={606} y={441} s={0.85} frost="#c9e8ff" />
      </Tap>
      <Confetti />
    </Scene>
  )
}

// 7. "Happy birthday, <name>! God made you, God knows you, and God will love you forever and ever."
//    The whole family cheering in a row on the grass (everyone's feet on the same ground), the birthday
//    child behind their cake, babies in arms, pets at the front.
function Page7() {
  const p = usePlayer()
  const { g1, g2, kids, babies, pets } = family(p)
  const wide = kids.length > 2
  const gs = wide ? 1.26 : 1.3
  // (with one grown-up on the left, the first brother or sister stands on the right; alone, the grown-up stands closer)
  const oneSide = !!g1 && !g2
  const gx: [number, number] = wide ? [100, 700] : oneSide && !kids.length ? [250, 620] : [180, 620]
  const KID_X = oneSide ? [500, 300, 595, 205] : [300, 500, 205, 595]
  // Who holds the babies: the grown-ups, then the big brothers and sisters; a cradle beside the cake if nobody can.
  const holders = [g2 && 'g2', g1 && 'g1', ...kids.map((_, i) => `k${i}`)].filter(Boolean) as string[]
  const held = (who: string) => { const i = holders.indexOf(who); return i >= 0 && i < babies.length ? babies[i] : undefined }
  const cradled = babies.slice(holders.length)
  const grown = (g: typeof g1, who: 'g1' | 'g2', x: number) => {
    if (!g) return null
    const baby = held(who)
    return (
      <Tap say="Happy birthday!" sfx="good">
        <Person x={x} y={420} s={gs} look={g.look} pose={baby ? 'hold' : 'arms-up'} facing={who === 'g2' ? 'left' : 'right'} blinkDelay={who === 'g1' ? 1.1 : 2.2}>
          {baby && <HeldBaby p={p} look={baby.look} />}
        </Person>
      </Tap>
    )
  }
  return (
    <Scene sky="glory" ground="none" clouds={false}>
      <Rays x={400} y={210} r={600} n={20} color="#ffffff" opacity={0.6} />
      <Meadow />
      <Flower x={120} y={430} color="#ff8cc0" />
      <Flower x={690} y={428} color="#ffd34d" />
      <Bunting x0={110} x1={690} y={44} sag={22} letters="HAPPY BIRTHDAY" />
      <Glow x={400} y={250} r={200} />
      {grown(g1, 'g1', gx[0])}
      {grown(g2, 'g2', gx[1])}
      {kids.map((k, i) => {
        const baby = held(`k${i}`)
        return (
          <Tap key={`${k.name}${i}`} say="Happy birthday!" sfx="pop">
            <Person x={KID_X[i]} y={426} s={1.4} look={k.look} pose={baby ? 'hold' : 'arms-up'} blinkDelay={0.5 + i * 0.6}>
              {baby && <HeldBaby p={p} look={baby.look} />}
            </Person>
          </Tap>
        )
      })}
      {cradled.map((b, i) => (
        <Cradle key={`${b.name}${i}`} x={i ? 250 : 550} y={440} s={0.75}><Little x={0} y={-60} s={1.05} blanket={lighten(b.look.robe, 0.45)} skin={p.look.skin} awake /></Cradle>
      ))}
      {/* nobody in the family cast: their own Pal celebrates with them */}
      {!g1 && !kids.length && !babies.length && <Tap say="Happy birthday!" sfx="good"><PalAt id="buddy" x={540} y={438} size={140} hat /></Tap>}
      <Tap say="It's my birthday!" sfx="fanfare"><Person x={400} y={424} s={1.5} look={p.look} pose="arms-up" /></Tap>
      <Tap say="Make a wish!" sfx="sparkle"><Cake x={400} y={447} s={0.85} candles={Math.min(12, p.age ?? 3)} /></Tap>
      <Pets pets={pets} ends={wide ? [40, 760] : [64, 736]} front={wide ? [150, 650] : [128, 672]} y={440} flip={oneSide} />
      <Heart x={300} y={170} r={16} />
      <Heart x={505} y={160} r={13} color="#ff9fc6" d={0.5} />
      <Heart x={400} y={128} r={11} d={1} />
      <Sparkles spots={[[250, 110, 9], [560, 100, 10], [330, 230, 6], [480, 220, 7]]} />
    </Scene>
  )
}

export const BIRTHDAY_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7]
