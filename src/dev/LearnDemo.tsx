// Development only: #gallery/learn/<skill>/<level>[/question|exercise] shows one turn of a practice
// round at that level, playable, with "Another" for a fresh one (see src/learn/levels.ts).
import { useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import ExerciseCard from '../learn/ExerciseCard'
import { LEVELS, exerciseFor } from '../learn/levels'
import { makeTask } from '../learn/tasks'
import type { Task } from '../learn/types'
import { makeQuestion } from '../lib/questions'
import type { Skill } from '../lib/progress'

function fresh(skill: Skill, level: number, mode?: string): Task {
  if (mode === 'exercise') {
    const ex = exerciseFor(skill, level)
    if (ex) return { type: 'exercise', ex }
  }
  if (mode === 'question' || mode === 'exercise') return { type: 'choice', q: makeQuestion(skill, level) }
  return makeTask(skill, level)
}

export default function LearnDemo({ skill = 'reading', level = '1', mode }: { skill?: string; level?: string; mode?: string }) {
  const s = (skill === 'numbers' ? 'numbers' : 'reading') as Skill
  const lvl = Math.max(1, Math.min(LEVELS[s].length, Number(level) || 1))
  const [n, setN] = useState(0)
  const [task, setTask] = useState(() => fresh(s, lvl, mode))
  const another = () => { setTask(fresh(s, lvl, mode)); setN(n + 1) }
  return (
    <div className="activity practice learn-demo" data-kind={task.type === 'exercise' ? task.ex.kind : 'question'}>
      <div className="practice-head">
        <h2>{s} {lvl}: {LEVELS[s][lvl - 1].label}</h2>
        <button className="learn-demo-next" onClick={another}>Another</button>
      </div>
      {task.type === 'exercise'
        ? <ExerciseCard key={n} ex={task.ex} onSolved={another} />
        : <QuestionCard key={n} q={task.q} onSolved={another} record={false} />}
    </div>
  )
}
