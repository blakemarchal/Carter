// Story questions: "Who did God keep safe?" with picture answers. Doesn't change her reading level.
import { useEffect, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import type { Thing } from '../data/islands'
import { speak } from '../lib/speech'
import type { Question } from '../lib/questions'
import { shuffle } from '../lib/util'

export default function Quiz({ title, questions, onDone }: {
  title: string; questions: { say: string; choices: Thing[]; answer: number }[]; onDone: () => void
}) {
  const [n, setN] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => { speak("Story time questions! Listen, then tap the picture.").then(() => setStarted(true)) }, [])

  // Shuffle the choices so the answer isn't always in the same place.
  const [qs] = useState<Question[]>(() => questions.map((x) => {
    const right = x.choices[x.answer]
    const choices = shuffle(x.choices).map((c) => ({ label: c.emoji, say: c.say, art: c.art }))
    return { skill: 'reading', say: x.say, visual: { kind: 'listen' }, choices, answer: choices.findIndex((c) => c.say === right.say && c.label === right.emoji) }
  }))

  const next = () => (n + 1 >= qs.length ? onDone() : setN(n + 1))
  return (
    <div className="activity practice quiz">
      <div className="practice-head">
        <span className="decor">❓</span>
        <h2>{title}</h2>
        <div className="mini-dots">{qs.map((_, i) => <span key={i}>{i < n ? '⭐' : '☆'}</span>)}</div>
      </div>
      {started ? <QuestionCard key={n} q={qs[n]} onSolved={next} record={false} /> : <button className="start-tap" onClick={() => setStarted(true)}>👆 Tap to start</button>}
    </div>
  )
}
