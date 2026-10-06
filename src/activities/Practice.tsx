// A short themed run of adaptive questions for one skill, with the level's interactive exercises mixed in.
import { useEffect, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import ExerciseCard from '../learn/ExerciseCard'
import { makeTask } from '../learn/tasks'
import type { Task } from '../learn/types'
import { getProgress, type Skill } from '../lib/progress'
import { speak } from '../lib/speech'
import Pic from '../components/Pic'

export default function Practice({ skill, title, intro, count = 5, decor, theme, onDone }: {
  skill: Skill; title: string; intro: string; count?: number; decor: string; theme?: string; onDone: () => void
}) {
  const [n, setN] = useState(0)
  const [task, setTask] = useState<Task>(() => makeTask(skill, getProgress().skills[skill], theme))
  const [started, setStarted] = useState(false)

  useEffect(() => { speak(intro).then(() => setStarted(true)) }, [])

  const [asked, setAsked] = useState<Task[]>([])
  const next = () => {
    if (n + 1 >= count) return onDone()
    const done = [...asked, task]
    setAsked(done)
    setN(n + 1)
    setTask(makeTask(skill, getProgress().skills[skill], theme, done))
  }

  return (
    <div className={`activity practice ${skill}`}>
      <div className="practice-head">
        <span className="decor"><Pic e={decor} /></span>
        <h2>{title}</h2>
        <div className="mini-dots">{Array.from({ length: count }).map((_, i) => <span key={i} className={i < n ? 'done' : ''}>{i < n ? '⭐' : '☆'}</span>)}</div>
      </div>
      {!started ? <button className="start-tap" onClick={() => setStarted(true)}>👆 Tap to start</button>
        : task.type === 'exercise' ? <ExerciseCard key={n} ex={task.ex} onSolved={next} />
          : <QuestionCard key={n} q={task.q} onSolved={next} />}
    </div>
  )
}
