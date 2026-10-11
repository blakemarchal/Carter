// A short themed run of adaptive questions for one skill, with the level's interactive exercises mixed in.
import { useEffect, useRef, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import ExerciseCard from '../learn/ExerciseCard'
import { makeTask } from '../learn/tasks'
import type { Task } from '../learn/types'
import { getProgress, type Skill } from '../lib/progress'
import { speak } from '../lib/speech'
import { taskFinished, taskStarted } from '../lib/stats'
import Pic from '../components/Pic'

export default function Practice({ skill, title, intro, count = 5, decor, theme, onDone }: {
  skill: Skill; title: string; intro: string; count?: number; decor: string; theme?: string; onDone: () => void
}) {
  const [n, setN] = useState(0)
  // (each task with the level it was made for: play totals count it under that level)
  const [{ task, level }, setTask] = useState(() => {
    const level = getProgress().skills[skill]
    return { task: makeTask(skill, level, theme), level }
  })
  const [started, setStarted] = useState(false)

  useEffect(() => { speak(intro).then(() => setStarted(true)) }, [])

  // (play totals, if a parent turned them on: each turn started and finished once, as IslandScreen does)
  const counted = useRef({ started: -1, finished: -1 })
  useEffect(() => {
    if (started && counted.current.started !== n) { counted.current.started = n; taskStarted(task, skill, level) }
  }, [started, n])

  const [asked, setAsked] = useState<Task[]>([])
  const next = (firstTry: boolean) => {
    if (counted.current.finished !== n) { counted.current.finished = n; taskFinished(task, skill, level, firstTry) }
    if (n + 1 >= count) return onDone()
    const done = [...asked, task]
    setAsked(done)
    setN(n + 1)
    const lv = getProgress().skills[skill]
    setTask({ task: makeTask(skill, lv, theme, done), level: lv })
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
