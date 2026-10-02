// A "friendly battle": answer questions to fill the Friendship meter. Nobody gets hurt.
//   1. A grumpy creature appears. She picks which of her Pals will help.
//   2. Each turn she picks a move (lib/moves.ts): basic (1 heart), brave (a trickier question,
//      2 hearts) or super (charged by 3 first-try answers in a row, 3 hearts), then answers a question.
//   3. When the meter is full, the creature becomes a friend and joins the Ark.
import { useEffect, useRef, useState } from 'react'
import PalArt from '../components/PalArt'
import MoveFx, { type Pt } from '../components/MoveFx'
import QuestionCard from '../components/QuestionCard'
import { BigButton, Confetti } from '../components/ui'
import { FRUIT_COLOR, PALS, palById, stageFor, type Move, type MoveKind } from '../data/pals'
import { makeQuestion, type Question } from '../lib/questions'
import { addPalXp, getProgress, MAX_LEVEL, update, useProgress, type Skill } from '../lib/progress'
import { battlesWon, CHARGE, movesFor, POWER, type MoveSlot } from '../lib/moves'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

const TARGET = 5 // hearts of friendship to win

type Phase = 'intro' | 'team' | 'pick' | 'question' | 'attack' | 'friends' | 'learned'

export default function FriendlyBattle({ foeId, foeIntro, onDone }: { foeId: string; foeIntro: string; onDone: () => void }) {
  const p = useProgress()
  const alive = useAlive()
  const foe = palById(foeId)
  const foeName = foe.stages[0].name
  // Her Pals who can help (not the creature itself, if she's befriended it before).
  const team = PALS.filter((x) => x.id in p.pals && x.id !== foeId)
  const [palId, setPalId] = useState<string | null>(null)
  const pal = palId ? palById(palId) : null
  const stage = pal ? stageFor(pal, p.pals[pal.id] ?? 0) : 0
  const name = pal ? pal.stages[stage].name : ''
  const slots = pal ? movesFor(pal, p) : []

  const [phase, setPhase] = useState<Phase>('intro')
  const [hearts, setHearts] = useState(0)
  const [charge, setCharge] = useState(0)
  const [turn, setTurn] = useState(0)
  const [kind, setKind] = useState<MoveKind>('basic')
  const [q, setQ] = useState<Question | null>(null)
  const [moveNo, setMoveNo] = useState(0) // restarts the move animation each time
  const [learned, setLearned] = useState<Move | null>(null)
  const arena = useRef<HTMLDivElement>(null)
  const [ends, setEnds] = useState<{ from: Pt; to: Pt }>({ from: { x: 12, y: 55 }, to: { x: 86, y: 50 } })

  /** Where the two Pals are right now (% of the arena), so the move flies from one to the other. */
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

  /** Start a turn: "Pick a move!", announcing any move she hasn't seen before. */
  const startTurn = (pl: typeof pal, first: boolean, superReady = false) => {
    if (!pl) return
    setPhase('pick')
    const fresh = movesFor(pl, getProgress()).filter((s) => s.known && s.kind !== 'basic' && !getProgress().movesSeen.includes(`${pl.id}:${s.kind}`))
    const nm = pl.stages[stageFor(pl, getProgress().pals[pl.id] ?? 0)].name
    if (fresh.length) speak(`${nm} knows a new move: ${fresh.map((s) => s.move.name).join(' and ')}! Pick a move!`)
    else if (superReady) speak('Your super move is ready!')
    else if (first) speak('Pick a move! Bigger moves fill more hearts, but the question is trickier.')
    else speak('Pick a move!')
  }

  const choosePal = async (id: string) => {
    sfx.pop()
    setPalId(id)
    update((x) => ({ ...x, battler: id }))
    const pl = palById(id)
    const nm = pl.stages[stageFor(pl, getProgress().pals[id] ?? 0)].name
    setPhase('intro')
    await speak(`Go, ${nm}! Let's help ${foeName} smile!`)
    if (alive.current) startTurn(pl, true)
  }

  useEffect(() => {
    ;(async () => {
      await speak(foeIntro)
      if (!alive.current) return
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

  const solved = async (firstTry: boolean) => {
    if (!pal) return
    const move = pal.moves[kind]
    const power = POWER[kind]
    const superMove = kind === 'super'
    const nextCharge = superMove ? 0 : firstTry ? Math.min(CHARGE, charge + 1) : Math.max(0, charge - 1)
    const nextHearts = Math.min(TARGET, hearts + power)
    measure()
    setMoveNo((n) => n + 1)
    setPhase('attack')
    sfx.move(move.fx, superMove)
    setCharge(nextCharge)
    // The meter fills when the move lands (MoveFx: about 0.6 s in).
    setTimeout(() => { if (alive.current) setHearts(nextHearts) }, 650)
    await Promise.all([speak(`${name} used ${move.name}!`), wait(superMove ? 1900 : 1700)])
    if (!alive.current) return
    // XP after the move, so if the Pal grows, the evolution scene follows the move instead of covering it.
    const stageBefore = stageFor(pal, getProgress().pals[pal.id] ?? 0)
    addPalXp(pal.id, 10 * power)
    // If it grew, the evolution scene announces the new super move, so the turn shouldn't too.
    if (stageFor(pal, getProgress().pals[pal.id] ?? 0) > stageBefore) {
      update((x) => ({ ...x, movesSeen: [...new Set([...x.movesSeen, `${pal.id}:super`])] }))
    }
    if (nextHearts < TARGET) {
      setTurn((t) => t + 1)
      const superKnown = movesFor(pal, getProgress()).find((s) => s.kind === 'super')!.known
      startTurn(pal, false, superKnown && nextCharge === CHARGE && charge < CHARGE)
      return
    }
    setPhase('friends')
    sfx.fanfare()
    await wait(400)
    await speak(`${foeName} is not grumpy anymore! ${foeName} wants to be your friend! ${foeName} joined your ark!`)
    if (!alive.current) return
    addPalXp(foe.id, 0)
    const firstWin = battlesWon(getProgress()) === 0
    update((x) => ({ ...x, battlesWon: battlesWon(x) + 1 }))
    if (!firstWin) return onDone()
    // The first win teaches every Pal its brave move: celebrate the helper's.
    setLearned(pal.moves.brave)
    setPhase('learned')
    sfx.sparkle()
    update((x) => ({ ...x, movesSeen: [...x.movesSeen, `${pal.id}:brave`] }))
    speak(`${name} learned a brave move: ${pal.moves.brave.name}! Brave moves fill two hearts!`)
  }

  const superKnown = slots.find((s) => s.kind === 'super')?.known
  return (
    <div className={`activity battle phase-${phase}`}>
      {(phase === 'friends' || phase === 'learned') && <Confetti />}
      <div ref={arena} className={`arena ${phase === 'attack' ? `arena-${pal?.moves[kind].fx} ${kind === 'super' ? 'super' : ''}` : ''}`}>
        <div className="fighter foe">
          <div className="meter"><span>💖 Friendship</span><i style={{ width: `${(hearts / TARGET) * 100}%` }} /></div>
          <div className="foe-hearts">{Array.from({ length: hearts }, (_, i) => <span key={i}>💖</span>)}</div>
          {/* The grumpy creature brightens a little with every heart of friendship. */}
          <div style={{ filter: phase === 'friends' || phase === 'learned' ? undefined : `saturate(${1 + hearts * 0.12}) brightness(${1 + hearts * 0.06})` }}>
            <PalArt pal={foe} mood={phase === 'friends' || phase === 'learned' ? 'happy' : 'grumpy'} size={170}
              className={phase === 'attack' ? 'hit' : phase === 'friends' ? 'befriend' : 'bob'} />
          </div>
          <div className="name">{foeName}</div>
        </div>
        <div className="fighter buddy">
          {pal ? (
            <>
              {superKnown && (
                <div className={`charge ${charge >= CHARGE ? 'full' : ''}`} aria-label="Super move charge">
                  {Array.from({ length: CHARGE }, (_, i) => <span key={i} className={i < charge ? 'on' : ''}>⚡</span>)}
                </div>
              )}
              <PalArt pal={pal} stage={stage} size={150} className={phase === 'attack' ? `move-${pal.moves[kind].fx}` : 'bob'} />
              <div className="name">{name}</div>
            </>
          ) : <div className="buddy-empty">?</div>}
        </div>
        {phase === 'attack' && pal && (
          <MoveFx key={moveNo} fx={pal.moves[kind].fx} move={pal.moves[kind].name} color={FRUIT_COLOR[pal.fruit]}
            superMove={kind === 'super'} hearts={POWER[kind]} from={ends.from} to={ends.to} />
        )}
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
                  <span className="mv-power">{'💖'.repeat(POWER[s.kind])}</span>
                  {s.known && s.kind === 'brave' && <span className="mv-tag">tricky question</span>}
                  {s.known && s.kind === 'super' && <span className="mv-tag">{ready ? 'READY!' : `${'⚡'.repeat(charge)}${'○'.repeat(CHARGE - charge)}`}</span>}
                </button>
              )
            })}
          </div>
        )}
        {phase === 'question' && q && <QuestionCard key={turn} q={q} onSolved={solved} quiet recordMisses={kind !== 'brave'} />}
        {phase === 'friends' && <div className="friends-banner">🤝 Friends! 🤝</div>}
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
