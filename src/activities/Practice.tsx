// A short themed run of adaptive questions for one skill.
import { useEffect, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import { makeQuestion, type Question } from '../lib/questions'
import { getProgress, type Skill } from '../lib/progress'
import { speak } from '../lib/speech'

export default function Practice({ skill, title, intro, count = 5, decor, theme, onDone }: {
  skill: Skill; title: string; intro: string; count?: number; decor: string; theme?: string; onDone: () => void
}) {
  const [n, setN] = useState(0)
  const [q, setQ] = useState(() => makeQuestion(skill, getProgress().skills[skill], theme))
  const [started, setStarted] = useState(false)

  useEffect(() => { speak(intro).then(() => setStarted(true)) }, [])

  const [asked, setAsked] = useState<Question[]>([])
  const next = () => {
    if (n + 1 >= count) return onDone()
    const done = [...asked, q]
    setAsked(done)
    setN(n + 1)
    setQ(makeQuestion(skill, getProgress().skills[skill], theme, done))
  }

  return (
    <div className={`activity practice ${skill}`}>
      <div className="practice-head">
        <span className="decor">{decor}</span>
        <h2>{title}</h2>
        <div className="mini-dots">{Array.from({ length: count }).map((_, i) => <span key={i} className={i < n ? 'done' : ''}>{i < n ? '⭐' : '☆'}</span>)}</div>
      </div>
      {started ? <QuestionCard key={n} q={q} onSolved={next} /> : <button className="start-tap" onClick={() => setStarted(true)}>👆 Tap to start</button>}
    </div>
  )
}
