// A friendly battle, G-rated Pokémon style. Grumbleshade, a pouty shadow, has made a creature
// grumpy. The creature isn't bad; the shadow is. Her Pal chases the shadow away with kindness:
//   1. Grumbleshade swoops in and hides inside the creature. She picks which Pal will help.
//   2. Her turn: pick a move (basic 1, brave 2 with a trickier question, super 3 when charged),
//      answer a question, and the move shrinks the creature's Shadow bar.
//   3. The shadow's turn: it puffs a grumpy move back. A first-try answer means her Pal dodges;
//      otherwise it loses a heart. A tired Pal eats a berry and bounces back: nobody ever loses.
//   4. Shadow gone: the creature smiles, and Grumbleshade floats away, saying the island's line about
//      why he's grumpy (data/shade.ts). Then she asks the creature to join the Ark. "Yes, please!"
//      She throws a Friend Ball: wobble, wobble, wobble… click!
// Grumbleshade's arc: on Easter Morning he doesn't float away. He hears that God loves everyone, even
// him, and his shadow turns to light: he's Gladshade, and joins her Ark. From then on the shadow in a
// battle is a little grumpy cloud, which pops into happy sparkles. Styles: FriendlyBattle.css.
// At a birthday party (`present`), the creature turns out to have been bringing a present.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import PalArt from '../components/PalArt'
import MoveFx, { type Pt } from '../components/MoveFx'
import QuestionCard from '../components/QuestionCard'
import { BigButton, Confetti } from '../components/ui'
import { FriendBall, Grumbleshade, GrumpyCloud, type ShadeFace } from '../art/battle'
import { FRUIT_COLOR, PALS, palById, stageFor, type Move, type MoveKind } from '../data/pals'
import { GLADSHADE, SHADE_SAY, shadeFor } from '../data/shade'
import { makeQuestion, type Question } from '../lib/questions'
import { addPalXp, getProgress, MAX_LEVEL, update, useProgress, type Skill } from '../lib/progress'
import { battlesWon, CHARGE, movesFor, POWER, type MoveSlot } from '../lib/moves'
import { preload, speak } from '../lib/speech'
import { setMood } from '../lib/music'
import { sfx } from '../lib/sfx'
import { useDrag, useDropTarget } from '../lib/drag'
import { pick, wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'
import './FriendlyBattle.css'

const SHADOW = 6 // the creature's Shadow bar
const ENERGY = 5 // her Pal's hearts
const SHADOW_MOVES = ['Grumpy Puff', 'Shadow Sneeze', 'Pouty Mist', 'Frown Fog', 'Grumble Gust']

type Phase = 'intro' | 'team' | 'pick' | 'question' | 'attack' | 'shadow' | 'freed' | 'finale' | 'ask' | 'throw' | 'caught' | 'learned'

/**
 * Easter Morning, after the shadow comes out of the creature: he listens, smiles, turns to light, and is
 * Gladshade; then he floats over to her side (`joined`), out of the way of the creature joining too.
 */
type FinaleShade = 'listen' | 'smile' | 'glow' | 'burst' | 'glad' | 'joined'
/**
 * Where the shadow is: swooping in, hiding inside the creature, chased out, drifting away with his line
 * (`leave`: floating off quickly, where there's no line), or the little grumpy cloud popping into sparkles.
 */
type Shade = 'arrive' | 'inside' | 'out' | 'drift' | 'leave' | 'pop' | 'gone' | FinaleShade

/** Sparkles streaming in to the middle (`in`, looping), or bursting out of it once (after `delay` seconds). */
function Sparkles({ out, n = 14, delay = 0 }: { out?: boolean; n?: number; delay?: number }) {
  const [parts] = useState(() => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.4
    const d = (out ? 80 : 120) + Math.random() * 60
    // (bursting out, they're happy sparkles: stars and hearts too)
    const c = out ? ['✨', '⭐', '✦', '💖'][i % 4] : i % 3 ? '✦' : '✨'
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, delay: delay + Math.random() * (out ? 0.2 : 1), c }
  }))
  return (
    <span className={`gs-sparkles ${out ? 'out' : 'in'}`} aria-hidden>
      {parts.map((s, i) => <i key={i} style={{ '--x': `${s.x}px`, '--y': `${s.y}px`, animationDelay: `${s.delay}s` } as CSSProperties}>{s.c}</i>)}
    </span>
  )
}

/** Grumbleshade on Easter Morning, where he was in the battle (styles: FriendlyBattle.css). */
function ShadeFinale({ shade }: { shade: 'out' | FinaleShade }) {
  const face: ShadeFace = shade === 'out' ? 'pout' : shade === 'listen' ? 'listen' : shade === 'smile' ? 'smile' : 'light'
  return (
    <div className={`gs-finale gs-${shade}`} aria-hidden>
      <div className="gs-rays" />
      <div className="gs-halo" />
      {(shade === 'listen' || shade === 'smile') && <span className="gs-hearts"><i>💛</i><i>💖</i><i>💛</i></span>}
      {shade === 'glad' || shade === 'joined'
        ? <div className="gs-pal"><PalArt pal={palById(GLADSHADE)} size={150} className="bob" /></div>
        : <div className="gs-body"><Grumbleshade size={150} face={face} /></div>}
      {shade === 'glow' && <Sparkles />}
      {shade === 'glad' && <Sparkles out n={16} />}
      <div className="gs-flash" />
    </div>
  )
}

export default function FriendlyBattle({ foeId, foeIntro, island, present, onDone }: {
  foeId: string; foeIntro: string
  /** The island the battle is on, for Grumbleshade's line there (data/shade.ts); none at a birthday party. */
  island?: string
  /** a birthday: what to say when the present comes out */ present?: string; onDone: () => void
}) {
  const p = useProgress()
  const alive = useAlive()
  const foe = palById(foeId)
  const foeName = foe.stages[0].name
  const [alreadyFriend] = useState(() => foeId in getProgress().pals)
  // Grumbleshade's arc: his line here, Easter Morning's finale, or (once he's Gladshade) a little grumpy cloud.
  const [arc] = useState(() => shadeFor(island, GLADSHADE in getProgress().pals))
  // Her Pals who can help (not the creature itself, if she's befriended it before).
  const team = PALS.filter((x) => x.id in p.pals && x.id !== foeId)
  const [palId, setPalId] = useState<string | null>(null)
  const pal = palId ? palById(palId) : null
  const stage = pal ? stageFor(pal, p.pals[pal.id] ?? 0) : 0
  const name = pal ? pal.stages[stage].name : ''
  const slots = pal ? movesFor(pal, p) : []

  const [phase, setPhase] = useState<Phase>('intro')
  const [shade, setShade] = useState<Shade>('arrive')
  const [shadow, setShadow] = useState(SHADOW)
  const [energy, setEnergy] = useState(ENERGY)
  const [charge, setCharge] = useState(0)
  const [turn, setTurn] = useState(0)
  const [kind, setKind] = useState<MoveKind>('basic')
  const [q, setQ] = useState<Question | null>(null)
  const [moveNo, setMoveNo] = useState(0) // restarts the move animation each time
  const [foeMove, setFoeMove] = useState('')
  const [palAnim, setPalAnim] = useState<'dodge' | 'hurt' | 'berry' | ''>('')
  const [ball, setBall] = useState<'' | 'fly' | 'land' | 'wobble' | 'done'>('')
  const [learned, setLearned] = useState<Move | null>(null)
  const [gift, setGift] = useState(false) // the birthday present, out from behind its back
  const arena = useRef<HTMLDivElement>(null)
  const [ends, setEnds] = useState<{ from: Pt; to: Pt }>({ from: { x: 12, y: 55 }, to: { x: 86, y: 50 } })

  /** Where the two Pals are right now (% of the arena), so moves fly from one to the other. */
  const measure = () => {
    const a = arena.current?.getBoundingClientRect()
    const b = arena.current?.querySelector('.fighter.buddy svg')?.getBoundingClientRect()
    const f = arena.current?.querySelector('.fighter.foe svg')?.getBoundingClientRect()
    if (!a || !b || !f) return
    const pt = (r: DOMRect) => ({ x: ((r.left + r.width / 2 - a.left) / a.width) * 100, y: ((r.top + r.height / 2 - a.top) / a.height) * 100 })
    setEnds({ from: pt(b), to: pt(f) })
  }

  // Basic moves are never new: every Pal has always known its first move.
  const isNew = (s: MoveSlot) => s.known && s.kind !== 'basic' && !!pal && !p.movesSeen.includes(`${pal.id}:${s.kind}`)

  /** Her turn: "Pick a move!", announcing any move she hasn't seen before. */
  const startTurn = (pl: typeof pal, first: boolean, superReady = false) => {
    if (!pl) return
    setPhase('pick')
    const fresh = movesFor(pl, getProgress()).filter((s) => s.known && s.kind !== 'basic' && !getProgress().movesSeen.includes(`${pl.id}:${s.kind}`))
    const nm = pl.stages[stageFor(pl, getProgress().pals[pl.id] ?? 0)].name
    if (fresh.length) speak(`${nm} knows a new move: ${fresh.map((s) => s.move.name).join(' and ')}! Pick a move!`)
    else if (superReady) speak('Your super move is ready!')
    else if (first) speak('Pick a move! Bigger moves are stronger, but the question is trickier.')
    else speak('Your turn! Pick a move!')
  }

  const choosePal = async (id: string) => {
    sfx.pop()
    setPalId(id)
    update((x) => ({ ...x, battler: id }))
    const pl = palById(id)
    const nm = pl.stages[stageFor(pl, getProgress().pals[id] ?? 0)].name
    setPhase('intro')
    await speak(`Go, ${nm}! Let's chase the ${arc.kind === 'cloud' ? 'grumpy cloud' : 'shadow'} away with kindness!`)
    if (alive.current) startTurn(pl, true)
  }

  // The story: the island's intro, then Grumbleshade (or the little grumpy cloud) swoops in and hides inside the creature.
  useEffect(() => {
    const swoop = arc.kind === 'cloud' ? SHADE_SAY.cloudIntro(foeName) : SHADE_SAY.intro(foeName)
    // (the lines for when the shadow is chased away download while she plays, so they start right away)
    const after = arc.kind === 'cloud' ? [SHADE_SAY.cloudChased(foeName)]
      : arc.kind === 'finale' ? [SHADE_SAY.chased(foeName), ...Object.values(SHADE_SAY.finale)]
      : arc.line ? [SHADE_SAY.chased(foeName), arc.line] : [SHADE_SAY.chasedPlain(foeName)]
    preload([swoop, ...after])
    ;(async () => {
      await speak(foeIntro)
      if (!alive.current) return
      sfx.shadowMove()
      await speak(swoop)
      if (!alive.current) return
      setShade('inside')
      if (team.length > 1) {
        setPhase('team')
        speak(`Who will help ${foeName}? Pick a Pal!`)
      } else choosePal(team[0]?.id ?? getProgress().starter ?? 'zippy')
    })()
  }, [])

  const pickMove = (s: MoveSlot) => {
    if (!s.known) { sfx.oops(); speak(s.hint); return }
    if (s.kind === 'super' && charge < CHARGE) {
      sfx.oops()
      const left = CHARGE - charge
      speak(`Answer ${left} more ${left === 1 ? 'question' : 'questions'} right on the first try to charge ${s.move.name}!`)
      return
    }
    sfx.pop()
    setKind(s.kind)
    // She's seen this Pal's moves now: the NEW badges can go.
    const seen = slots.filter((x) => x.known).map((x) => `${pal!.id}:${x.kind}`)
    update((x) => ({ ...x, movesSeen: [...new Set([...x.movesSeen, ...seen])] }))
    const skill: Skill = turn % 2 ? 'numbers' : 'reading'
    const base = getProgress().skills[skill]
    // Brave moves ask a question one level up.
    setQ(makeQuestion(skill, s.kind === 'brave' ? Math.min(MAX_LEVEL[skill], base + 1) : base))
    setPhase('question')
  }

  /** The shadow's turn: a grumpy puff. A first-try answer means her Pal dodges it. */
  const shadowTurn = async (dodge: boolean, chargeNow: number) => {
    if (!pal) return
    const mv = pick(SHADOW_MOVES)
    setFoeMove(mv)
    setPhase('shadow')
    setMoveNo((n) => n + 1)
    sfx.shadowMove()
    setTimeout(() => {
      if (!alive.current) return
      setPalAnim(dodge ? 'dodge' : 'hurt')
      if (dodge) sfx.dodge()
      else sfx.oof()
    }, 600)
    await Promise.all([speak(`${foeName} used ${mv}!`), wait(1600)])
    if (!alive.current) return
    let hearts = energy
    if (dodge) await speak(`${name} dodged it!`)
    else {
      hearts = energy - 1
      setEnergy(hearts)
      await speak(`Oof! ${name} lost a heart.`)
    }
    if (!alive.current) return
    if (hearts <= 0) {
      // Never a loss: a tired Pal munches a berry and bounces back.
      setPalAnim('berry')
      sfx.good()
      await speak(`${name} is tired! Here's a yummy berry. ${name} feels much better!`)
      setEnergy(ENERGY)
    }
    if (!alive.current) return
    setPalAnim('')
    setTurn((t) => t + 1)
    const superKnown = movesFor(pal, getProgress()).find((s) => s.kind === 'super')!.known
    startTurn(pal, false, superKnown && chargeNow === CHARGE)
  }

  const solved = async (firstTry: boolean) => {
    if (!pal) return
    const move = pal.moves[kind]
    const power = POWER[kind]
    const superMove = kind === 'super'
    const nextCharge = superMove ? 0 : firstTry ? Math.min(CHARGE, charge + 1) : Math.max(0, charge - 1)
    const nextShadow = Math.max(0, shadow - power)
    measure()
    setMoveNo((n) => n + 1)
    setPhase('attack')
    sfx.move(move.fx, superMove)
    setCharge(nextCharge)
    // The Shadow bar shrinks when the move lands (MoveFx: about 0.6 s in).
    setTimeout(() => { if (alive.current) setShadow(nextShadow) }, 650)
    await Promise.all([speak(`${name} used ${move.name}!${superMove ? " It's super strong!" : ''}`), wait(superMove ? 1900 : 1700)])
    if (!alive.current) return
    // XP after the move, so if the Pal grows, the evolution scene follows the move instead of covering it.
    const stageBefore = stageFor(pal, getProgress().pals[pal.id] ?? 0)
    addPalXp(pal.id, 10 * power)
    // If it grew, the evolution scene announces the new super move, so the turn shouldn't too.
    if (stageFor(pal, getProgress().pals[pal.id] ?? 0) > stageBefore) {
      update((x) => ({ ...x, movesSeen: [...new Set([...x.movesSeen, `${pal.id}:super`])] }))
    }
    if (nextShadow > 0) return shadowTurn(firstTry, nextCharge)
    freed()
  }

  /**
   * Easter Morning: Grumbleshade doesn't float away. He hears the happy news, smiles for the very first
   * time, and his shadow turns to light: he's Gladshade, and joins her Ark (about 20 seconds).
   */
  const finale = async () => {
    setPhase('finale')
    setMood('story')
    setShade('listen')
    await speak(SHADE_SAY.finale.listen)
    if (!alive.current) return
    await speak(SHADE_SAY.finale.whisper)
    if (!alive.current) return
    setShade('smile')
    sfx.sparkle()
    await speak(SHADE_SAY.finale.smile)
    if (!alive.current) return
    // His shadow turns to light…
    setShade('glow')
    sfx.sparkle()
    for (let i = 0; i < 8; i++) {
      await wait(190)
      if (!alive.current) return
      sfx.evolveTick(i)
    }
    setShade('burst')
    sfx.evolveBurst()
    await wait(450)
    if (!alive.current) return
    // …and he's Gladshade, a Pal on her Ark (the way a befriended creature joins).
    setShade('glad')
    setMood('home')
    sfx.fanfare()
    addPalXp(GLADSHADE, 0)
    await speak(SHADE_SAY.finale.glad)
    // (over to her side, with her Pal, so the creature can be asked to join too)
    if (alive.current) setShade('joined')
  }

  /** The shadow is gone: the creature is itself again, and Grumbleshade floats away with his line (data/shade.ts). */
  const freed = async () => {
    setPhase('freed')
    sfx.fanfare()
    if (arc.kind === 'cloud') {
      // The little grumpy cloud comes out, puffs up… and pops into happy sparkles.
      setShade('pop')
      setTimeout(() => { if (alive.current) sfx.sparkle() }, 1650)
      await speak(SHADE_SAY.cloudChased(foeName))
      if (alive.current) setShade('gone')
    } else if (arc.kind === 'finale') {
      setShade('out')
      await speak(SHADE_SAY.chased(foeName))
      if (!alive.current) return
      await finale()
    } else if (arc.line) {
      // He comes out, sulks for a moment, then drifts away while he says why he's grumpy.
      // (He finishes floating off by himself, even if the line is over first.)
      setShade('out')
      await speak(SHADE_SAY.chased(foeName))
      if (!alive.current) return
      setShade('drift')
      await speak(arc.line)
    } else {
      setShade('leave')
      await speak(SHADE_SAY.chasedPlain(foeName))
      if (alive.current) setShade('gone')
    }
    if (!alive.current) return
    if (present) {
      setGift(true)
      sfx.sparkle()
      await speak(present)
      if (!alive.current) return
    }
    if (alreadyFriend) {
      await speak(`${foeName} is so glad to see you again. Thank you, friend!`)
      return finish()
    }
    setPhase('ask')
    await speak(`${foeName}, would you like to join our ark?`)
    if (!alive.current) return
    await speak('Yes, please!', { pitch: 1.35 })
    if (alive.current) speak('Throw a Friend Ball!')
  }

  /**
   * Throw the Friend Ball: it flies over (or she carried it there herself), the creature zips inside,
   * wobble, wobble, wobble… click!
   */
  const thrown = useRef(false)
  const throwBall = async (carried = false) => {
    if (thrown.current) return
    thrown.current = true
    measure()
    sfx.throwBall()
    setPhase('throw')
    if (!carried) {
      setBall('fly')
      await wait(750)
      if (!alive.current) return
    }
    setBall('land')
    sfx.whoosh()
    await wait(700)
    setBall('wobble')
    for (let i = 0; i < 3; i++) {
      sfx.wobble()
      await wait(650)
      if (!alive.current) return
    }
    setBall('done')
    sfx.caught()
    setPhase('caught')
    addPalXp(foe.id, 0)
    await speak(`Gotcha! ${foeName} joined your ark!`)
  }

  /** After the battle: count the win, and the very first win teaches the helper's brave move. */
  const finish = () => {
    if (!pal) return onDone()
    const firstWin = battlesWon(getProgress()) === 0
    update((x) => ({ ...x, battlesWon: battlesWon(x) + 1 }))
    if (!firstWin) return onDone()
    setLearned(pal.moves.brave)
    setPhase('learned')
    sfx.sparkle()
    update((x) => ({ ...x, movesSeen: [...x.movesSeen, `${pal.id}:brave`] }))
    speak(`${name} learned a brave move: ${pal.moves.brave.name}! Brave moves are extra strong!`)
  }

  // The Friend Ball can be dragged onto the creature, as well as tapped.
  const foeTarget = useDropTarget('foe', (d) => d === 'ball', 60)
  const ballDrag = useDrag({ data: 'ball', disabled: phase !== 'ask', onStart: sfx.lift, onDrop: (t) => { if (t !== 'foe') return false; throwBall(true); return true }, onTap: () => throwBall() })
  const superKnown = slots.find((s) => s.kind === 'super')?.known
  // (the creature is happy as soon as the shadow is out of it)
  const happy = shade !== 'arrive' && shade !== 'inside'
  const caughtIn = ball === 'land' || ball === 'wobble' || ball === 'done'
  let shadeArt: ReactNode = null
  if (shade !== 'gone') {
    if (arc.kind === 'cloud') shadeArt = <GrumpyCloud size={120} className={`gshade cloud ${shade}`} />
    else if (arc.kind === 'finale' && shade !== 'arrive' && shade !== 'inside') shadeArt = <ShadeFinale shade={shade as 'out' | FinaleShade} />
    else shadeArt = <Grumbleshade size={150} className={`gshade ${shade}`} />
  }
  return (
    <div className={`activity battle phase-${phase}`}>
      {(phase === 'caught' || phase === 'learned' || (phase === 'freed' && alreadyFriend)) && <Confetti />}
      {(shade === 'glad' || shade === 'joined') && <Confetti count={50} />}
      <div ref={arena} className={`arena ${phase === 'attack' ? `arena-${pal?.moves[kind].fx} ${kind === 'super' ? 'super' : ''}` : ''}`}>
        <div className="fighter foe">
          <div className="info-box">
            <b>{foeName}</b>
            <div className="shadow-bar" aria-label="Shadow"><span>Shadow</span><i style={{ width: `${(shadow / SHADOW) * 100}%` }} /></div>
          </div>
          <div ref={foeTarget} className={`foe-body ${!happy ? 'shadowed' : ''}`} style={{ '--s': shadow / SHADOW } as CSSProperties}>
            {!happy && <span className="wisps" aria-hidden><i /><i /><i /></span>}
            <div className={caughtIn ? 'zip-in' : ''}>
              <PalArt pal={foe} mood={happy ? 'happy' : 'grumpy'} size={170}
                className={phase === 'attack' ? 'hit' : phase === 'shadow' ? 'foe-lunge' : happy ? 'befriend' : 'bob'} />
            </div>
            {phase === 'ask' && <div className="speech">Yes, please! 💖</div>}
            {gift && !caughtIn && <span className="foe-present" aria-hidden>🎁</span>}
          </div>
        </div>
        <div className="fighter buddy">
          {pal ? (
            <>
              <div className="info-box">
                <b>{name}</b>
                <span className="hearts">{Array.from({ length: ENERGY }, (_, i) => <i key={i}>{i < energy ? '❤️' : '🤍'}</i>)}</span>
                {superKnown && (
                  <span className={`charge ${charge >= CHARGE ? 'full' : ''}`} aria-label="Super move charge">
                    {Array.from({ length: CHARGE }, (_, i) => <span key={i} className={i < charge ? 'on' : ''}>⚡</span>)}
                  </span>
                )}
              </div>
              <div className={`pal-body ${palAnim}`}>
                <PalArt pal={pal} stage={stage} size={150} className={phase === 'attack' ? `move-${pal.moves[kind].fx}` : 'bob'} />
                {palAnim === 'berry' && <span className="berry-snack">🍓</span>}
                {palAnim === 'dodge' && <span className="dodge-word">Dodged!</span>}
              </div>
            </>
          ) : <div className="buddy-empty">?</div>}
        </div>
        {shadeArt}
        {shade === 'pop' && <div className="cloud-pop"><Sparkles out n={16} delay={1.6} /></div>}
        {phase === 'attack' && pal && (
          <MoveFx key={moveNo} fx={pal.moves[kind].fx} move={pal.moves[kind].name} color={FRUIT_COLOR[pal.fruit]}
            superMove={kind === 'super'} hearts={POWER[kind]} icon={pal.moves[kind].icon} from={ends.from} to={ends.to} />
        )}
        {phase === 'shadow' && <MoveFx key={moveNo} fx="shadow" move={foeMove} color="#6b4aa0" hearts={0} from={ends.to} to={ends.from} />}
        {ball && (
          <div className={`throw-ball ${ball}`} style={{ '--tx': `${ends.to.x}%`, '--ty': `${ends.to.y}%` } as CSSProperties}>
            <div className="throw-ball-y"><FriendBall size={64} open={ball === 'land'} /></div>
          </div>
        )}
        {ball === 'done' && <div className="caught-stars" style={{ left: `${ends.to.x}%` }}>✨⭐✨</div>}
      </div>
      <div className="battle-q">
        {phase === 'team' && (
          <div className="team-pick">
            <h2>Who will help?</h2>
            <div className="team-row">
              {team.map((t) => {
                const st = stageFor(t, p.pals[t.id] ?? 0)
                return (
                  <button key={t.id} className={`team-card ${p.battler === t.id ? 'last' : ''}`} style={{ ['--c' as string]: FRUIT_COLOR[t.fruit] }} onClick={() => choosePal(t.id)}>
                    <PalArt pal={t} stage={st} size={110} className="bob" />
                    <span className="name">{t.stages[st].name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {phase === 'pick' && (
          <div className="move-pick">
            {slots.map((s) => {
              const ready = s.kind !== 'super' || charge >= CHARGE
              return (
                <button key={s.kind} className={`move-btn ${s.kind} ${s.known ? '' : 'locked'} ${s.known && !ready ? 'charging' : ''} ${s.known && ready && s.kind === 'super' ? 'ready' : ''}`}
                  style={{ ['--c' as string]: pal ? FRUIT_COLOR[pal.fruit] : undefined }} onClick={() => pickMove(s)}>
                  {isNew(s) && <span className="mv-new">NEW</span>}
                  <span className="mv-icon">{s.known ? s.move.icon : '🔒'}</span>
                  <span className="mv-name">{s.known ? s.move.name : '???'}</span>
                  <span className="mv-power">{'⭐'.repeat(POWER[s.kind])}</span>
                  {s.known && s.kind === 'brave' && <span className="mv-tag">tricky question</span>}
                  {s.known && s.kind === 'super' && <span className="mv-tag">{ready ? 'READY!' : `${'⚡'.repeat(charge)}${'○'.repeat(CHARGE - charge)}`}</span>}
                </button>
              )
            })}
          </div>
        )}
        {phase === 'question' && q && <QuestionCard key={turn} q={q} onSolved={solved} quiet recordMisses={kind !== 'brave'} />}
        {/* (the creature: the shadow may still be on screen, floating off) */}
        {phase === 'freed' && <div className="friends-banner">☀️ {foeName} is happy again! ☀️</div>}
        {phase === 'finale' && (shade === 'glad' || shade === 'joined'
          ? <div key="glad" className="friends-banner finale">✨ Gladshade joined your Ark! ✨</div>
          : <div key="news" className="friends-banner finale">💛 God loves everyone! 💛</div>)}
        {phase === 'ask' && (
          <div className="throw-pick">
            <div className="ask-line">Would you like to join our Ark, {foeName}?</div>
            <div className="throw-btn">
              {/* only the ball is picked up (the words stay put) */}
              <span className="throw-grab" role="button" aria-label="Throw a Friend Ball" {...ballDrag}><FriendBall size={110} /></span>
              <span>Throw it to {foeName}!</span>
            </div>
          </div>
        )}
        {phase === 'caught' && (
          <div className="learned">
            <div className="learned-title">Gotcha!</div>
            <div className="learned-name">{foeName} joined your Ark!</div>
            <BigButton color="pink" onClick={finish}>Yay! 💖</BigButton>
          </div>
        )}
        {phase === 'learned' && learned && (
          <div className="learned">
            <div className="learned-icon">{learned.icon}</div>
            <div className="learned-title">New move!</div>
            <div className="learned-name">{learned.name}</div>
            <BigButton color="pink" onClick={onDone}>Yay! 💖</BigButton>
          </div>
        )}
      </div>
    </div>
  )
}
