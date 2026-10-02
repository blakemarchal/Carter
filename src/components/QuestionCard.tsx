import { useEffect, useState } from 'react'
import type { Question, Visual } from '../lib/questions'
import { letterSound } from '../lib/spoken'
import { praise, retry, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { recordAnswer } from '../lib/progress'
import { wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

function VisualView({ v, onSay }: { v: Visual; onSay: (s: string) => void }) {
  switch (v.kind) {
    case 'letter':
      return <div className="q-letter">{v.text}</div>
    case 'word':
      return (
        <div className="q-word">
          {v.text.split('').map((ch, i) => (
            <button key={i} className="q-word-letter" onClick={() => onSay(letterSound(ch))}>{ch}</button>
          ))}
        </div>
      )
    case 'emoji':
      return <div className="q-emoji">{v.items.map((e, i) => <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>{e}</span>)}</div>
    case 'sequence':
      return (
        <div className="q-seq">
          {v.nums.map((n, i) => <span key={i} className={n === null ? 'blank' : ''}>{n ?? '?'}</span>)}
        </div>
      )
    case 'sum':
      return (
        <div className="q-sum">
          <span className="grp">{Array(v.a).fill(v.emoji).map((e, i) => <i key={i} className={v.op === '-' && i >= v.a - v.b ? 'gone' : ''}>{e}</i>)}</span>
          {v.op === '+' && <><b>+</b><span className="grp">{Array(v.b).fill(v.emoji).map((e, i) => <i key={i}>{e}</i>)}</span></>}
          {v.op === '-' && <b>− {v.b}</b>}
        </div>
      )
    case 'listen':
      return <div className="q-listen">👂</div>
  }
}

/** Shows one question. No failure: wrong answers wiggle, and after two misses the answer glows. */
export default function QuestionCard({ q, onSolved, quiet }: { q: Question; onSolved: (firstTry: boolean) => void; quiet?: boolean }) {
  const [misses, setMisses] = useState(0)
  const [wrong, setWrong] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)
  const alive = useAlive()

  useEffect(() => { speak(q.say) }, [q])

  const choose = async (i: number) => {
    if (solved) return
    if (i === q.answer) {
      setSolved(true)
      sfx.good()
      recordAnswer(q.skill, misses === 0)
      if (!quiet) {
        await speak(`${q.choices[i].say}!`)
        if (alive.current) await speak(praise())
      }
      else await wait(500)
      if (alive.current) onSolved(misses === 0)
    } else {
      sfx.oops()
      setWrong(i)
      setMisses((m) => m + 1)
      speak(retry())
      setTimeout(() => setWrong(null), 600)
    }
  }

  const textChoices = q.choices.every((c) => /^[\w\s]+$/.test(c.label))
  return (
    <div className="q-card">
      <button className="q-prompt" onClick={() => speak(q.say)}>🔊</button>
      <VisualView v={q.visual} onSay={(s) => speak(s)} />
      <div className={`q-choices ${textChoices ? 'text' : 'pics'}`}>
        {q.choices.map((c, i) => (
          <button key={i}
            className={`q-choice ${wrong === i ? 'wiggle' : ''} ${misses >= 2 && i === q.answer ? 'glow' : ''} ${solved && i === q.answer ? 'right' : ''}`}
            onClick={() => choose(i)}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
