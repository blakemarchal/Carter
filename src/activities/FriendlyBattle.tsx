// A "friendly battle": answer questions to fill the Friendship meter.
// Nobody gets hurt. When the meter is full, the grumpy creature becomes a friend and joins the Ark.
import { useEffect, useRef, useState } from 'react'
import PalArt from '../components/PalArt'
import MoveFx, { type Pt } from '../components/MoveFx'
import QuestionCard from '../components/QuestionCard'
import { FRUIT_COLOR, palById, stageFor } from '../data/pals'
import { makeQuestion } from '../lib/questions'
import { addPalXp, getProgress, useProgress, type Skill } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { Confetti } from '../components/ui'
import { wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

const HITS = 4

export default function FriendlyBattle({ foeId, foeIntro, onDone }: { foeId: string; foeIntro: string; onDone: () => void }) {
  const p = useProgress()
  const buddy = palById(p.starter ?? 'zippy')
  const buddyStage = stageFor(buddy, p.pals[buddy.id] ?? 0)
  const foe = palById(foeId)
  const [hits, setHits] = useState(0)
  const [moveNo, setMoveNo] = useState(0) // restarts the move animation each time
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
  const [phase, setPhase] = useState<'intro' | 'fight' | 'attack' | 'friends'>('intro')
  const skillFor = (n: number): Skill => (n % 2 ? 'numbers' : 'reading')
  const [q, setQ] = useState(() => makeQuestion('reading', getProgress().skills.reading))
  const alive = useAlive()

  useEffect(() => {
    ;(async () => {
      await speak(foeIntro)
      if (!alive.current) return
      await speak(`Go, ${buddy.stages[buddyStage].name}! Answer questions to use ${buddy.move} and fill the friendship meter!`)
      if (alive.current) setPhase('fight')
    })()
  }, [])

  const solved = async () => {
    const n = hits + 1
    measure()
    setMoveNo(n)
    setPhase('attack')
    sfx.move(buddy.fx)
    // The meter fills when the move lands (MoveFx: about 0.6 s in).
    setTimeout(() => { if (alive.current) setHits(n) }, 650)
    await Promise.all([speak(`${buddy.stages[buddyStage].name} used ${buddy.move}!`), wait(1700)])
    if (!alive.current) return
    // XP after the move, so if the Pal grows, the evolution scene follows the move instead of covering it.
    addPalXp(buddy.id, 10)
    if (n >= HITS) {
      setPhase('friends')
      sfx.fanfare()
      await wait(400)
      await speak(`${foe.stages[0].name} is not grumpy anymore! ${foe.stages[0].name} wants to be your friend! ${foe.stages[0].name} joined your ark!`)
      if (!alive.current) return
      addPalXp(foe.id, 0)
      onDone()
      return
    }
    const s = skillFor(n)
    setQ(makeQuestion(s, getProgress().skills[s]))
    setPhase('fight')
  }

  return (
    <div className={`activity battle phase-${phase}`}>
      {phase === 'friends' && <Confetti />}
      <div ref={arena} className={`arena ${phase === 'attack' ? `arena-${buddy.fx}` : ''}`}>
        <div className="fighter foe">
          <div className="meter"><span>💖 Friendship</span><i style={{ width: `${(hits / HITS) * 100}%` }} /></div>
          <div className="foe-hearts">{Array.from({ length: hits }, (_, i) => <span key={i}>💖</span>)}</div>
          {/* The grumpy creature brightens a little with every hit of friendship. */}
          <div style={{ filter: phase === 'friends' ? undefined : `saturate(${1 + hits * 0.15}) brightness(${1 + hits * 0.07})` }}>
            <PalArt pal={foe} mood={phase === 'friends' ? 'happy' : 'grumpy'} size={170}
              className={phase === 'attack' ? 'hit' : phase === 'friends' ? 'befriend' : 'bob'} />
          </div>
          <div className="name">{foe.stages[0].name}</div>
        </div>
        <div className="fighter buddy">
          <PalArt pal={buddy} stage={buddyStage} size={150} className={phase === 'attack' ? `move-${buddy.fx}` : 'bob'} />
          <div className="name">{buddy.stages[buddyStage].name}</div>
        </div>
        {phase === 'attack' && <MoveFx key={moveNo} fx={buddy.fx} move={buddy.move} color={FRUIT_COLOR[buddy.fruit]} from={ends.from} to={ends.to} />}
      </div>
      <div className="battle-q">
        {phase === 'fight' && <QuestionCard key={hits} q={q} onSolved={solved} quiet />}
        {phase === 'friends' && <div className="friends-banner">🤝 Friends! 🤝</div>}
      </div>
    </div>
  )
}
