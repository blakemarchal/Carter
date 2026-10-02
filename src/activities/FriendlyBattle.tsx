// A "friendly battle": answer questions to fill the Friendship meter.
// Nobody gets hurt. When the meter is full, the grumpy creature becomes a friend and joins the Ark.
import { useEffect, useState } from 'react'
import PalArt from '../components/PalArt'
import QuestionCard from '../components/QuestionCard'
import { palById, stageFor } from '../data/pals'
import { makeQuestion } from '../lib/questions'
import { addPalXp, getProgress, useProgress, type Skill } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { Confetti } from '../components/ui'
import { wait } from '../lib/util'

const HITS = 4

export default function FriendlyBattle({ foeId, foeIntro, onDone }: { foeId: string; foeIntro: string; onDone: () => void }) {
  const p = useProgress()
  const buddy = palById(p.starter ?? 'zippy')
  const buddyStage = stageFor(buddy, p.pals[buddy.id] ?? 0)
  const foe = palById(foeId)
  const [hits, setHits] = useState(0)
  const [phase, setPhase] = useState<'intro' | 'fight' | 'attack' | 'friends'>('intro')
  const skillFor = (n: number): Skill => (n % 2 ? 'numbers' : 'reading')
  const [q, setQ] = useState(() => makeQuestion('reading', getProgress().skills.reading))

  useEffect(() => {
    ;(async () => {
      await speak(foeIntro)
      await speak(`Go, ${buddy.stages[buddyStage].name}! Answer questions to use ${buddy.move} and fill the friendship meter!`)
      setPhase('fight')
    })()
  }, [])

  const solved = async () => {
    setPhase('attack')
    sfx.zap()
    addPalXp(buddy.id, 10)
    const n = hits + 1
    setHits(n)
    await speak(`${buddy.stages[buddyStage].name} used ${buddy.move}!`)
    if (n >= HITS) {
      setPhase('friends')
      sfx.fanfare()
      await wait(400)
      await speak(`${foe.stages[0].name} is not grumpy anymore! ${foe.stages[0].name} wants to be your friend! ${foe.stages[0].name} joined your ark!`)
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
      <div className="arena">
        <div className="fighter foe">
          <div className="meter"><span>💖 Friendship</span><i style={{ width: `${(hits / HITS) * 100}%` }} /></div>
          <PalArt pal={foe} mood={phase === 'friends' ? 'happy' : 'grumpy'} size={170} className={phase === 'attack' ? 'hit' : 'bob'} />
          <div className="name">{foe.stages[0].name}</div>
        </div>
        <div className="fighter buddy">
          <PalArt pal={buddy} stage={buddyStage} size={150} className={phase === 'attack' ? 'lunge' : 'bob'} />
          <div className="name">{buddy.stages[buddyStage].name}</div>
        </div>
        {phase === 'attack' && <div className="move-fx">✨💖✨</div>}
      </div>
      <div className="battle-q">
        {phase === 'fight' && <QuestionCard key={hits} q={q} onSolved={solved} quiet />}
        {phase === 'friends' && <div className="friends-banner">🤝 Friends! 🤝</div>}
      </div>
    </div>
  )
}
