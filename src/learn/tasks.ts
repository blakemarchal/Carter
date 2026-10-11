// What a practice round asks next: usually a question, and on levels with an exercise, often that.
import { makeQuestion } from '../lib/questions'
import type { Skill } from '../lib/progress'
import { EXERCISE_SHARE, exerciseFor } from './levels'
import type { Task } from './types'

const keyOf = (t: Task) => (t.type === 'exercise' ? `ex:${t.ex.key}` : `q:${t.q.say}|${JSON.stringify(t.q.visual)}`)

/** The next turn of a round, avoiding anything already asked in it (and not two exercises in a row). */
export function makeTask(skill: Skill, level: number, theme?: string, asked: Task[] = []): Task {
  const seen = new Set(asked.map(keyOf))
  const last = asked[asked.length - 1]
  if (last?.type !== 'exercise' && Math.random() < EXERCISE_SHARE) {
    for (let i = 0; i < 6; i++) {
      const ex = exerciseFor(skill, level, theme)
      if (!ex) break
      if (!seen.has(`ex:${ex.key}`)) return { type: 'exercise', ex }
    }
  }
  const questions = asked.flatMap((t) => (t.type === 'choice' ? [t.q] : []))
  return { type: 'choice', q: makeQuestion(skill, level, theme, questions) }
}
