// Counting into a basket: "Put 5 stones in David's bag!" Tap a thing to drop it in (the narrator
// counts out loud), tap one in the basket to take it back out, then tap Done. Real counting:
// she has to stop at the right number.
import { useEffect, useRef, useState } from 'react'
import type { Thing } from '../data/islands'
import { BigButton } from '../components/ui'
import { praise, speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

export default function CountBasket({ title, intro, item, plural, basket, into = 'the basket', rounds, onDone }: {
  title: string; intro: string; item: Thing; plural: string; basket: string; into?: string; rounds: number[]; onDone: () => void
}) {
  const [round, setRound] = useState(0)
  const [inBasket, setInBasket] = useState(0)
  const [busy, setBusyState] = useState(true)
  // A ref as well as state, so two quick taps on Done can't both count.
  const busyRef = useRef(true)
  const setBusy = (b: boolean) => { busyRef.current = b; setBusyState(b) }
  const alive = useAlive()
  const target = rounds[round]
  const pile = Math.min(12, target + 3) // a few extra, so she has to stop at the right number

  const ask = (r: number) => speak(`Put ${rounds[r]} ${rounds[r] === 1 ? item.say : plural} in ${into}!`)

  useEffect(() => {
    ;(async () => {
      await speak(intro)
      if (!alive.current) return
      setBusy(false)
      ask(0)
    })()
  }, [])

  const add = () => {
    if (busy || inBasket >= pile) return
    const n = inBasket + 1
    setInBasket(n)
    sfx.count(n)
    speak(String(n))
  }
  const remove = () => {
    if (busy || inBasket === 0) return
    sfx.pop()
    const n = inBasket - 1
    setInBasket(n)
    speak(`Take one out. ${n}.`)
  }

  const done = async () => {
    if (busyRef.current) return
    if (inBasket < target) {
      sfx.oops()
      return void speak(`That's ${inBasket}. We need ${target}. Put in some more!`)
    }
    if (inBasket > target) {
      sfx.oops()
      return void speak(`Oops, that's ${inBasket}. Too many! Tap ${into} to take some out.`)
    }
    setBusy(true)
    sfx.good()
    await speak(`${target} ${target === 1 ? item.say : plural}! ${praise()}`)
    if (!alive.current) return
    if (round + 1 >= rounds.length) {
      sfx.fanfare()
      await wait(500)
      if (alive.current) onDone()
      return
    }
    setRound(round + 1)
    setInBasket(0)
    setBusy(false)
    ask(round + 1)
  }

  return (
    <div className="activity count-basket">
      <div className="practice-head">
        <span className="decor">{basket}</span>
        <h2>{title}</h2>
        <div className="count-goal" onClick={() => ask(round)}>Put <b>{target}</b> in!</div>
      </div>
      <div className="count-play">
        <div className="count-pile">
          {Array.from({ length: pile - inBasket }, (_, i) => (
            <button key={`${round}-${i}`} className="count-thing" onClick={add}>{item.emoji}</button>
          ))}
        </div>
        <button className="count-bin" onClick={remove} aria-label="Basket: tap to take one out">
          <span className="count-in">{Array.from({ length: inBasket }, (_, i) => <span key={i}>{item.emoji}</span>)}</span>
          <span className="count-bowl">{basket}</span>
          <span className="count-n" key={inBasket}>{inBasket}</span>
        </button>
      </div>
      <BigButton color="green" disabled={busy} onClick={done}>✅ Done!</BigButton>
    </div>
  )
}
