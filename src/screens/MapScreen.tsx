// The Adventure Map: the voyage through the Bible, one sea at a time (data/seas.ts, lib/voyage.ts).
// Each sea is an ocean with its islands joined by a sea route; arrows at the sides sail to the sea
// before or after (the next opens once this sea's islands are done). Her Ark (with her Pal aboard)
// sits at the island she visited last; tapping an open island sails it there, then the island
// starts. Islands still ahead hide under clouds; ones not built yet say "coming soon". The daily
// voyage: a few new island visits a day (Parent Corner), then the crew rests (finished islands, the
// Ark, songs and bedtime stay open). In the week before their birthday, balloons are tied to the
// boat and their Pal counts the sleeps; on a brother's or sister's birthday, a banner says so.
// Styles: styles.css, "Map".
import { useEffect, useMemo, useRef, useState } from 'react'
import PalArt from '../components/PalArt'
import { HoldButton } from '../components/ui'
import { islandById, loadIsland, loadedIsland } from '../data/islands'
import { SEAS, islandSpots, seaOf, type SeaIsland } from '../data/seas'
import { currentSea, islandState, seaOpen, visitsLeft, type IslandState } from '../lib/voyage'
import { count } from '../lib/stats'
import { Emoji } from '../art/scenes/kit'
import { palById, stageFor } from '../data/pals'
import { activeProfile, savedStep, today, update, useFamily, useProfiles, useProgress } from '../lib/progress'
import { hungryPals } from '../lib/kitchen'
import { isBirthday, sleepsToGo } from '../lib/birthday'
import { andList, othersBirthdayToday } from '../lib/party'
import { numberWords } from '../lib/spoken'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

type P = [number, number]
/** An island on this sea's map: where it sits, and whether it's built yet. */
type MapIsland = SeaIsland & { at: P; color: string; built: boolean }

/** Where the boat docks at each island: in the water just right of it, clear of its name. */
const dock = (i: MapIsland): P => [i.at[0] + 134, i.at[1] + 6]
/** Built islands have content (data/islands.ts); the rest are coming soon. */
const built = (id: string) => !!islandById(id)

/** A smooth curve through the docks (Catmull-Rom as cubic Béziers). */
function routePath(pts: P[]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`
  }
  return d
}

function Palm({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 Q4 -22 -2 -44" stroke="#9a6a3a" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-2 -44 q-22 -6 -30 8 q16 -12 30 -8Z M-2 -44 q20 -10 30 2 q-16 -8 -30 -2Z M-2 -44 q-8 -20 -26 -18 q16 2 26 18Z M-2 -44 q10 -22 26 -18 q-16 4 -26 18Z" fill="#3fb36b" />
    </g>
  )
}

/** A five-pointed star centred on (x, y). */
const starPath = (x: number, y: number, r: number) => Array.from({ length: 10 }, (_, i) => {
  const a = (Math.PI / 5) * i - Math.PI / 2, d = i % 2 ? r * 0.48 : r
  return `${i ? 'L' : 'M'}${(x + Math.cos(a) * d).toFixed(1)} ${(y + Math.sin(a) * d).toFixed(1)}`
}).join(' ') + 'Z'

/**
 * One island. The press-in effect scales the inner group around its own centre, and a still,
 * invisible hit area on top takes the tap: a CSS transform on the positioned group itself would
 * replace its position (SVG), sliding the island out from under her finger mid-tap.
 */
function IslandShape({ isl, state, pressed, stars, resting, fresh }: { isl: MapIsland; state: IslandState; pressed: boolean; stars: number; resting: boolean; fresh: boolean }) {
  const [x, y] = isl.at
  return (
    <g transform={`translate(${x} ${y})`} data-island={isl.id}>
    <g className={`map-island ${state} ${pressed ? 'pressed' : ''}`}>
      {state === 'next' && <ellipse className="map-ring" cx={0} cy={6} rx={104} ry={52} />}
      <ellipse cx={0} cy={14} rx={92} ry={40} fill="#3a9bd8" opacity={0.35} />
      <ellipse cx={0} cy={6} rx={86} ry={36} fill="#f6dfa2" />
      <path d="M-66 4 Q-60 -34 -14 -38 Q30 -46 60 -20 Q76 -4 62 8 Q20 20 -30 18 Q-62 16 -66 4Z" fill="#7ed68a" />
      <path d="M-40 -6 Q-20 -24 10 -22" stroke={isl.color} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.7} />
      <Palm x={-48} y={6} s={0.9} />
      <Palm x={54} y={4} s={0.8} flip />
      {/* The landmark: its drawing, or else the emoji. It was 54px emoji text on the baseline y = -12,
          which centres the picture about 19 units higher; Emoji centres on (x, y). */}
      <g className="map-landmark"><Emoji e={isl.emoji} art={isl.landmark} x={4} y={-31} size={54} /></g>
      {state === 'done' && (
        <g transform="translate(36 -64)">
          <line x1={0} y1={0} x2={0} y2={40} stroke="#7a5a3a" strokeWidth={4} />
          <path d="M0 0 L30 8 L0 16Z" fill="#ff6fae" />
        </g>
      )}
      {state === 'done' && stars > 0 && (
        <g transform="translate(0 84)" className="map-stars" aria-label={`${stars} stars`}>
          {[0, 1, 2].map((k) => <path key={k} d={starPath(-26 + k * 26, 0, 11)} fill={k < stars ? '#ffd34d' : '#ffffff'} stroke={k < stars ? '#e0a800' : '#c9d6e6'} strokeWidth={2} strokeLinejoin="round" opacity={k < stars ? 1 : 0.8} />)}
        </g>
      )}
      <g transform="translate(0 52)">
        <rect x={-isl.name.length * 6.2 - 14} y={-17} width={isl.name.length * 12.4 + 28} height={32} rx={16} className="map-label" />
        <text className="map-name" x={0} y={6} textAnchor="middle">{isl.name}</text>
      </g>
      {state === 'locked' && (
        <g className="map-fog">
          <circle cx={-44} cy={-6} r={34} /><circle cx={0} cy={-22} r={42} /><circle cx={46} cy={-4} r={34} />
          <rect x={-74} y={-8} width={148} height={40} rx={20} />
          <text x={0} y={8} textAnchor="middle" fontSize={34}>🔒</text>
        </g>
      )}
      {state === 'soon' && (
        <g transform="translate(0 84)">
          <rect x={-58} y={-14} width={116} height={26} rx={13} className="map-soon" />
          <text className="map-soon-text" x={0} y={5} textAnchor="middle">Coming soon</text>
        </g>
      )}
      {/* A finished island that has grown (more visits): "New!" where the pointer would be */}
      {state === 'done' && fresh && (
        <g transform="translate(4 -82)">
          <g className="map-new">
            <rect x={-40} y={-18} width={80} height={34} rx={17} />
            <text x={0} y={8} textAnchor="middle">New!</text>
          </g>
        </g>
      )}
      {state === 'next' && !resting && <text className="map-point" x={4} y={-70} textAnchor="middle">👇</text>}
      {state === 'next' && resting && <text className="map-point resting" x={4} y={-70} textAnchor="middle">🌙</text>}
    </g>
    <ellipse className="map-hit" cx={0} cy={0} rx={104} ry={70} />
    </g>
  )
}

/** Balloons tied to the boat, for a birthday (or the week before one). */
function BoatBalloons() {
  return (
    <g className="map-balloons" aria-hidden>
      {[[34, -142, '#ff6fae'], [62, -128, '#ffd34d'], [46, -168, '#5fb7ff']].map(([x, y, c], i) => (
        <g key={i} className={`map-balloon b${i}`}>
          <path d={`M22 -26 Q${(x as number) - 6} ${(y as number) + 50} ${x} ${(y as number) + 20}`} stroke="#8a7a99" strokeWidth={1.5} fill="none" />
          <ellipse cx={x as number} cy={y as number} rx={14} ry={17} fill={c as string} stroke="#00000026" strokeWidth={1.5} />
          <ellipse cx={(x as number) - 5} cy={(y as number) - 6} rx={3} ry={5} fill="#fff" opacity={0.6} />
          <path d={`M${(x as number) - 3} ${(y as number) + 17} l3 5 l3 -5 Z`} fill={c as string} />
        </g>
      ))}
    </g>
  )
}

/** What the boat's Pal is saying (a bubble above the boat). */
function Bubble({ text }: { text: string }) {
  const w = text.length * 11 + 36
  return (
    <g className="map-bubble" aria-hidden>
      <rect x={-w / 2} y={-34} width={w} height={42} rx={21} fill="#fff" stroke="#ff8cc0" strokeWidth={3} />
      <path d="M-10 6 L2 20 L10 6 Z" fill="#fff" stroke="#ff8cc0" strokeWidth={3} strokeLinejoin="round" />
      <rect x={-12} y={2} width={24} height={6} fill="#fff" />
      <text className="map-bubble-text" x={0} y={-12} textAnchor="middle" dominantBaseline="middle">{text}</text>
    </g>
  )
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)
const sleepsLine = (n: number) => `${cap(numberWords(n))} more ${n === 1 ? 'sleep' : 'sleeps'} until your birthday!`

function Boat({ palId, stage }: { palId: string; stage: number }) {
  return (
    <g className="map-boat-inner">
      <svg x={-34} y={-78} width={68} height={68} overflow="visible"><PalArt pal={palById(palId)} stage={stage} size={68} /></svg>
      <rect x={-30} y={-30} width={60} height={22} rx={5} fill="#c98448" stroke="#8a5428" strokeWidth={3} />
      <path d="M-58 -10 L58 -10 L42 16 L-42 16 Z" fill="#a0612f" stroke="#6f3f18" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-50 -2 L50 -2" stroke="#6f3f18" strokeWidth={2} />
    </g>
  )
}

/** `onParty`: their birthday party again (tapping "Happy birthday!" on their birthday). */
export default function MapScreen({ onIsland, onArk, onParent, onPlayers, onBedtime, onSing, onParty }: {
  onIsland: (id: string) => void; onArk: () => void; onParent: () => void; onPlayers: () => void; onBedtime: () => void; onSing: () => void
  onParty: () => void
}) {
  const p = useProgress()
  const me = activeProfile()
  const { list } = useProfiles()
  const family = useFamily()
  const buddy = palById(p.starter ?? 'zippy')
  const buddyName = buddy.stages[stageFor(buddy, p.pals[buddy.id] ?? 0)].name
  // Birthdays: their own (the week before, and the day), and anyone else's today.
  const sleeps = sleepsToGo(me.birthday)
  const myDay = isBirthday(me.birthday)
  const others = othersBirthdayToday(me, list, family)
  const route = useRef<SVGPathElement>(null)
  // Islands part-way through: they (and their seas) stay open, even if a new island appears before them.
  const started = Object.entries(p.islandStep).filter(([id, k]) => k > 0 && !p.islandsDone.includes(id)).map(([id]) => id)
  // The sea on screen: where the boat is (if that sea is open), else the one they're up to.
  const [sea, setSea] = useState(() => {
    const s = seaOf(p.mapAt)
    return s >= 0 && seaOpen(s, p.islandsDone, built, p.openAll, started) ? s : currentSea(p.islandsDone, built, p.openAll, started)
  })
  const def = SEAS[sea]
  const islands: MapIsland[] = useMemo(() => {
    const spots = islandSpots(def.islands.length)
    return def.islands.map((i, k) => ({ ...i, at: spots[k], color: islandById(i.id)?.color ?? def.color, built: built(i.id) }))
  }, [def])
  const docks = useMemo(() => islands.map(dock), [islands])
  const d = useMemo(() => routePath(docks), [docks])
  const startAt = Math.max(0, islands.findIndex((i) => i.id === p.mapAt))
  const [boat, setBoat] = useState<{ x: number; y: number; flip: boolean }>({ x: docks[startAt][0], y: docks[startAt][1], flip: false })
  const [sailing, setSailing] = useState(false)
  const [pressed, setPressed] = useState<number | null>(null)
  const at = useRef(startAt)
  // A new sea on screen: the boat waits at its island there (or the first one).
  useEffect(() => {
    const k = Math.max(0, islands.findIndex((i) => i.id === p.mapAt))
    at.current = k
    setBoat({ x: docks[k][0], y: docks[k][1], flip: false })
  }, [sea])
  const resting = visitsLeft(p.voyage, today(), p.dailyVisits) <= 0
  const prevOpen = sea > 0
  const nextOpen = sea + 1 < SEAS.length && seaOpen(sea + 1, p.islandsDone, built, p.openAll, started)
  const seaDone = islands.every((i) => !i.built || p.islandsDone.includes(i.id))

  useEffect(() => {
    // Said once a day: whose birthday it is today, or how many sleeps until theirs.
    const d = today()
    if (others.length && p.siblingSaid !== d) {
      update((x) => ({ ...x, siblingSaid: d }))
      speak(`Today is ${andList(others)}'s birthday! Tell ${others.length > 1 ? 'them' : others[0]} happy birthday!`)
    } else if (sleeps && p.countdownSaid !== d) {
      update((x) => ({ ...x, countdownSaid: d }))
      speak(`${buddyName} says: ${sleepsLine(sleeps)}`)
    } else {
      speak('Where should we go? Tap an island!')
      return
    }
    speak('Where should we go? Tap an island!', { interrupt: false })
  }, [])

  const states = islands.map((_, i) => islandState(sea, i, p.islandsDone, built, p.openAll, started))
  /** A finished island that has grown since (its version is newer than the one they finished). */
  const fresh = (id: string) => (islandById(id)?.version ?? 1) > (p.islandVersion?.[id] ?? 1)
  /** Whether going into an island now starts a new visit (rather than replaying, or finishing one). */
  const startsNewVisit = (id: string) => {
    if (p.islandsDone.includes(id)) return false
    const k = savedStep(p, id, islandById(id)?.version)
    return k === 0 || loadedIsland(id)?.steps[k - 1]?.kind === 'pause'
  }
  // This sea's islands start loading now, so each one opens right away when it's tapped.
  useEffect(() => { for (const i of def.islands) if (built(i.id)) loadIsland(i.id).catch(() => {}) }, [sea])
  const goSea = (n: number) => {
    if (sailing || n < 0 || n >= SEAS.length) return
    sfx.whoosh()
    setSea(n)
    speak(`${SEAS[n].name}! Tap an island!`)
  }

  /** Where along the route each dock is (by sampling the path). */
  const lengthAt = (pt: P) => {
    const path = route.current!
    const total = path.getTotalLength()
    let best = 0, bestD = Infinity
    for (let l = 0; l <= total; l += 4) {
      const q = path.getPointAtLength(l)
      const dd = (q.x - pt[0]) ** 2 + (q.y - pt[1]) ** 2
      if (dd < bestD) (bestD = dd), (best = l)
    }
    return best
  }

  const sailTo = (i: number) => {
    const path = route.current
    if (!path || i === at.current) return onIsland(islands[i].id)
    setSailing(true)
    sfx.whoosh()
    const from = lengthAt(docks[at.current]), to = lengthAt(docks[i])
    const ms = Math.min(2200, Math.max(900, Math.abs(to - from) * 2.2))
    const t0 = performance.now()
    let arrived = false
    const arrive = () => {
      if (arrived) return
      arrived = true
      at.current = i
      update((x) => ({ ...x, mapAt: islands[i].id }))
      setSailing(false)
      onIsland(islands[i].id)
    }
    const step = (now: number) => {
      if (arrived) return
      const k = Math.min(1, (now - t0) / ms)
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2 // ease in-out
      const l = from + (to - from) * e
      const q = path.getPointAtLength(l)
      const ahead = path.getPointAtLength(Math.max(0, Math.min(path.getTotalLength(), l + (to > from ? 4 : -4))))
      setBoat({ x: q.x, y: q.y, flip: ahead.x < q.x })
      if (k < 1) requestAnimationFrame(step)
      else arrive()
    }
    requestAnimationFrame(step)
    // Animation frames pause while the app is in the background; never leave her stuck at sea.
    setTimeout(arrive, ms + 400)
  }

  const tapIsland = async (i: number) => {
    if (sailing) return
    sfx.pop()
    const isl = islands[i]
    if (states[i] === 'soon') return void speak(`${isl.name} is coming soon!`)
    if (states[i] === 'locked') {
      const before = islands.slice(0, i).reverse().find((x) => x.built && !p.islandsDone.includes(x.id))
      speak(before ? `Finish ${before.name} first, then sail here!` : 'Finish the islands in the sea before this one first!')
      return
    }
    // (where an island's visits begin is in its content: load it first, if it hasn't loaded yet)
    if (resting) await loadIsland(isl.id).catch(() => {})
    if (resting && startsNewVisit(isl.id)) {
      count('rest-day')
      speak("The Ark is resting until tomorrow! You can play an island you've finished, visit your Pals, sing, or have a bedtime story.")
      return
    }
    sailTo(i)
  }

  return (
    <div className="screen map">
      <header className="map-head">
        <button className="ark-btn" onClick={() => { sfx.pop(); onArk() }}>
          <PalArt pal={buddy} stage={stageFor(buddy, p.pals[buddy.id] ?? 0)} size={70} />
          <span>My Ark</span>
          {hungryPals(p, me.id).length > 0 && <span className="hungry-badge small">🍽️</span>}
        </button>
        <div className="map-title">
          <h2>{def.name}</h2>
          <div className="sea-dots" aria-label={`Sea ${sea + 1} of ${SEAS.length}`}>
            {SEAS.map((x, k) => <i key={x.id} className={k === sea ? 'now' : seaOpen(k, p.islandsDone, built, p.openAll, started) ? 'open' : ''} />)}
          </div>
        </div>
        <div className="map-tools">
          <button className="who-chip" aria-label="Switch player" onClick={() => { sfx.pop(); onPlayers() }}>
            <span>{me.emoji}</span>{me.name.trim() || 'Player'}
          </button>
          <button className={`icon-btn music ${p.music ? '' : 'off'}`} aria-label={p.music ? 'Turn music off' : 'Turn music on'}
            onClick={() => { sfx.pop(); update((x) => ({ ...x, music: !x.music })) }}>{p.music ? '🎵' : '🔇'}</button>
          <button className="icon-btn music" aria-label="Sing-along" onClick={() => { sfx.pop(); onSing() }}>🎤</button>
          <button className="icon-btn music" aria-label="Bedtime story" onClick={() => { sfx.pop(); onBedtime() }}>🌙</button>
          <HoldButton onHold={onParent} className="parent-gear">⚙️</HoldButton>
        </div>
      </header>
      <div className="sea">
        {others.length > 0 && <div className="map-banner">🎂 Today is {andList(others)}&rsquo;s birthday! 🎉</div>}
        {resting && !others.length && states.includes('next') && <div className="map-banner rest">🌙 The crew is resting until tomorrow!</div>}
        {prevOpen && <button className="sea-arrow prev" aria-label={`Back to ${SEAS[sea - 1].name}`} onClick={() => goSea(sea - 1)}>◀</button>}
        {sea + 1 < SEAS.length && (
          <button className={`sea-arrow next ${nextOpen ? '' : 'locked'} ${nextOpen && seaDone ? 'go' : ''}`} aria-label={`On to ${SEAS[sea + 1].name}`}
            onClick={() => (nextOpen ? goSea(sea + 1) : (sfx.pop(), speak('Finish the islands in this sea, then sail on!')))}>{nextOpen ? '▶' : '🔒'}</button>
        )}
        <svg className="sea-map" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" key={sea}>
          <defs>
            <pattern id="waves" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M6 22 q10 -8 20 0 q10 8 20 0" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect className="sea-waves" x={-80} y={-40} width={1160} height={700} fill="url(#waves)" />
          {/* Things to spot: clouds, seagulls, a whale and a jumping fish */}
          <g className="sea-cloud c1"><ellipse cx={0} cy={0} rx={46} ry={18} /><ellipse cx={30} cy={-10} rx={30} ry={18} /><ellipse cx={-26} cy={-6} rx={24} ry={14} /></g>
          <g className="sea-cloud c2"><ellipse cx={0} cy={0} rx={38} ry={15} /><ellipse cx={24} cy={-8} rx={24} ry={14} /></g>
          <g className="sea-gull g1"><g className="gull-flap"><path d="M0 0 q8 -8 16 0 q8 -8 16 0" /></g></g>
          <g className="sea-gull g2"><g className="gull-flap slow"><path d="M0 0 q6 -6 12 0 q6 -6 12 0" /></g></g>
          <g className="sea-whale"><Emoji e="🐳" x={724} y={548} size={52} /></g>
          {/* A fish leaps out of the water and dives back in, with a splash each time. */}
          <ellipse className="sea-splash s1" cx={437} cy={598} rx={16} ry={5} />
          <ellipse className="sea-splash s2" cx={347} cy={598} rx={16} ry={5} />
          <g className="sea-fish">
            {/* drawn (not an emoji), so it faces the way it leaps on every device */}
            <g transform="translate(437 588)">
              <path d="M11 0 L25 -9 Q21 0 25 9 Z" fill="#ffb347" stroke="#c8641a" strokeWidth={2} strokeLinejoin="round" />
              <path d="M-2 -7 Q5 -16 10 -6 Z" fill="#ffb347" stroke="#c8641a" strokeWidth={2} strokeLinejoin="round" />
              <ellipse cx={0} cy={0} rx={15} ry={9.5} fill="#ff9f43" stroke="#c8641a" strokeWidth={2} />
              <path d="M2 -6 Q6 0 2 6" fill="none" stroke="#e07a28" strokeWidth={2} strokeLinecap="round" />
              <circle cx={-7} cy={-2} r={2.6} fill="#2b2140" />
              <circle cx={-7.8} cy={-2.8} r={0.9} fill="#fff" />
            </g>
          </g>
          <path ref={route} d={d} className="sea-route" />
          {islands.map((isl, i) => (
            <g key={isl.id} onClick={() => tapIsland(i)} style={{ cursor: 'pointer' }}
              onPointerDown={() => setPressed(i)} onPointerUp={() => setPressed(null)} onPointerCancel={() => setPressed(null)} onPointerLeave={() => setPressed(null)}>
              <IslandShape isl={isl} state={states[i]} pressed={pressed === i} stars={p.stars[isl.id] ?? 0} resting={resting} fresh={fresh(isl.id)} />
            </g>
          ))}
          <g transform={`translate(${boat.x} ${boat.y}) scale(${boat.flip ? -1 : 1} 1)`} onClick={() => { if (!sailing) { sfx.pop(); onArk() } }} style={{ cursor: 'pointer' }}>
            {(sleeps > 0 || myDay) && <BoatBalloons />}
            <Boat palId={buddy.id} stage={stageFor(buddy, p.pals[buddy.id] ?? 0)} />
          </g>
          {(sleeps > 0 || myDay) && !sailing && (
            // (beside the balloons, which are on the boat's front side)
            <g transform={`translate(${Math.min(Math.max(boat.x + (boat.flip ? 84 : -84), 120), 880)} ${Math.max(boat.y - 100, 50)})`}
              onClick={myDay ? () => { sfx.pop(); onParty() } : undefined} style={myDay ? { cursor: 'pointer' } : undefined}>
              <Bubble text={myDay ? '🎂 Happy birthday!' : `🎈 ${sleeps} more ${sleeps === 1 ? 'sleep' : 'sleeps'}!`} />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
