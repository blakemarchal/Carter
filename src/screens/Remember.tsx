// The "Remember?" round (learn/remember.ts): a few quick questions on what the player already knows: a piece
// missing from a memory verse, a sight word to find, an animal's home or its baby's name. Nothing new is taught
// here, and a miss loses nothing (that thing just comes back sooner).
import { useEffect, useRef, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import Pic from '../components/Pic'
import { Arrow, BackButton, BigButton } from '../components/ui'
import { useAllIslands } from '../lib/useIsland'
import { addPalXp, getProgress, today, update } from '../lib/progress'
import { speak } from '../lib/speech'
import { count } from '../lib/stats'
import type { Question } from '../lib/questions'
import { CHEER, DONE_TODAY, INTRO, kindOf, planRound, questionFor, remembered, verseOf, type Verse } from '../learn/remember'

/** What a finished round gives the player's Pal (as much as a feeding). */
const ROUND_XP = 5

export default function Remember({ onBack }: { onBack: () => void }) {
  const [done] = useState(() => getProgress().islandsDone)
  const islands = useAllIslands(done)
  const day = today()
  // The round, once the finished islands' content (their verses, the animals in them) is here.
  const [round, setRound] = useState<{ id: string; q: Question }[] | null>(null)
  useEffect(() => {
    if (!islands || round) return
    const p = getProgress()
    const verses = islands.map(verseOf).filter((v): v is Verse => !!v)
    const ids = p.rememberDay === day ? [] : planRound(p, day, islands)
    setRound(ids.flatMap((id) => { const q = questionFor(id, verses); return q ? [{ id, q }] : [] }))
  }, [islands])

  const [n, setN] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  useEffect(() => {
    if (!round) return
    if (round.length) speak(INTRO).then(() => setStarted(true))
    else speak(DONE_TODAY)
  }, [round])

  // (play totals, if a parent turned them on: each question started and finished once)
  const counted = useRef({ started: -1, finished: -1 })
  useEffect(() => {
    if (round && started && !finished && counted.current.started !== n) { counted.current.started = n; count(`start:remember:${kindOf(round[n].id)}`) }
  }, [started, n])

  const next = (firstTry: boolean) => {
    if (!round) return
    const { id } = round[n]
    update((p) => remembered(p, id, firstTry, day))
    if (counted.current.finished !== n) {
      counted.current.finished = n
      count(`finish:remember:${kindOf(id)}`)
      if (firstTry) count(`right:remember:${kindOf(id)}`)
    }
    if (n + 1 < round.length) return setN(n + 1)
    const p = getProgress()
    update((x) => ({ ...x, rememberDay: day }))
    addPalXp(p.starter ?? 'zippy', ROUND_XP)
    setFinished(true)
    speak(CHEER)
  }

  return (
    <div className="screen remember">
      <header><BackButton onClick={onBack} /><h2><Pic e="💭" /> Remember?</h2><span /></header>
      {!round ? <p className="rm-wait">Get ready…</p>
        : !round.length ? (
          <div className="rm-done">
            <p>{DONE_TODAY}</p>
            <BigButton color="pink" onClick={onBack} aria-label="Back to the map"><Arrow dir="left" /></BigButton>
          </div>
        ) : finished ? (
          <div className="rm-done">
            <div className="rm-stars">{round.map((_, i) => <Pic key={i} e="⭐" />)}</div>
            <p>You remembered!</p>
            <BigButton color="pink" onClick={onBack} aria-label="Back to the map"><Arrow /></BigButton>
          </div>
        ) : (
          <div className="activity practice remember-round">
            <div className="practice-head">
              <div className="mini-dots">{round.map((_, i) => <span key={i} className={i < n ? 'done' : ''}>{i < n ? <Pic e="⭐" /> : '☆'}</span>)}</div>
            </div>
            {!started ? <button className="start-tap" onClick={() => setStarted(true)}><Pic e="👆" /> Tap to start</button>
              : <QuestionCard key={n} q={round[n].q} onSolved={next} record={false} />}
          </div>
        )}
    </div>
  )
}
