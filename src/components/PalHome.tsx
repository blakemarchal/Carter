// A Pal's home on the Ark: pet it (hearts and giggles), feed it berries, dress it up, see its moves.
import { useEffect, useState, type CSSProperties } from 'react'
import DressedPal from './DressedPal'
import ColoringPage from './ColoringPage'
import { BackButton, BigButton } from './ui'
import { FRUIT_COLOR, palIntro, stageFor, type PalDef } from '../data/pals'
import { useProgress } from '../lib/progress'
import { movesFor, POWER } from '../lib/moves'
import { BERRIES, feed, feedsLeft, unlockedAccessories, ACCESSORIES, wear } from '../lib/care'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { pick } from '../lib/util'

const PET_LINES = ['{name} loves that!', 'Hee hee! That tickles!', '{name} is so happy!', 'Aww, {name} wants a hug!']

export default function PalHome({ pal, onClose }: { pal: PalDef; onClose: () => void }) {
  const p = useProgress()
  const stage = stageFor(pal, p.pals[pal.id] ?? 0)
  const name = pal.stages[stage].name
  const [hearts, setHearts] = useState(0) // bumps to replay the hearts animation
  const [anim, setAnim] = useState('')
  const [berry, setBerry] = useState<string | null>(null)
  const [coloring, setColoring] = useState(false)
  const left = feedsLeft(p, pal.id)
  const outfits = unlockedAccessories(p)

  useEffect(() => { speak(palIntro(pal, stage)) }, [])

  const pet = () => {
    sfx.good()
    setHearts((h) => h + 1)
    setAnim('wiggle-happy')
    setTimeout(() => setAnim(''), 700)
    speak(pick(PET_LINES).replaceAll('{name}', name))
  }

  const giveBerry = (b: string) => {
    if (!feed(pal.id)) {
      sfx.oops()
      return void speak(`${name} is full! More berries tomorrow.`)
    }
    setBerry(b)
    sfx.pop()
    setTimeout(() => { setBerry(null); setAnim('chomp'); sfx.count(5); setHearts((h) => h + 1) }, 550)
    setTimeout(() => setAnim(''), 1200)
    speak(left - 1 > 0 ? `Yum! ${name} loves berries!` : `Yum! ${name} is full now. Thank you!`)
  }

  const dress = (id: string | null) => {
    sfx.pop()
    wear(pal.id, id)
    const acc = ACCESSORIES.find((a) => a.id === id)
    speak(acc ? `${name} looks great in the ${acc.name}!` : `${name} took it off.`)
  }

  return (
    <div className="overlay pal-home" style={{ '--c': FRUIT_COLOR[pal.fruit] } as CSSProperties}>
      <header className="home-head"><BackButton onClick={onClose} /><h2>{name}</h2><span className="fruit-tag">{pal.fruit} Pal</span></header>
      <div className="home-main">
        <div className="home-stage">
          <button className={`home-pal ${anim}`} onClick={pet} aria-label={`Pet ${name}`}>
            <DressedPal pal={pal} stage={stage} size={260} outfit={p.outfits[pal.id]} />
          </button>
          {hearts > 0 && (
            <div className="home-hearts" key={hearts}>{['💖', '💗', '💕', '💖', '💗'].map((h, i) => <span key={i} style={{ '--i': i } as CSSProperties}>{h}</span>)}</div>
          )}
          {berry && <span className="home-berry">{berry}</span>}
          <p className="home-hint">Tap {name} to pet!</p>
          <BigButton color="white" onClick={() => setColoring(true)}>🖍️ Color me</BigButton>
        </div>
        <div className="home-side">
          <div className="home-box">
            <h3>Berries <small>{Math.max(0, left)} left today</small></h3>
            <div className="home-row">{BERRIES.map((b) => <button key={b} className="home-btn" disabled={left <= 0} onClick={() => giveBerry(b)}>{b}</button>)}</div>
          </div>
          <div className="home-box">
            <h3>Dress up</h3>
            <div className="home-row">
              {outfits.map((a) => (
                <button key={a.id} className={`home-btn ${p.outfits[pal.id] === a.id ? 'on' : ''}`} onClick={() => dress(p.outfits[pal.id] === a.id ? null : a.id)}>{a.emoji}</button>
              ))}
              {ACCESSORIES.length > outfits.length && <span className="home-more">+{ACCESSORIES.length - outfits.length} more to earn</span>}
            </div>
          </div>
          <div className="home-box">
            <h3>Moves</h3>
            <div className="home-moves">
              {movesFor(pal, p).map((s) => (
                <button key={s.kind} className={`home-move ${s.known ? '' : 'locked'}`} onClick={() => speak(s.known ? `${s.move.name}! It fills ${POWER[s.kind]} ${POWER[s.kind] === 1 ? 'heart' : 'hearts'}.` : s.hint)}>
                  <span>{s.known ? s.move.icon : '🔒'}</span>{s.known ? s.move.name : '???'} <small>{'💖'.repeat(POWER[s.kind])}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {coloring && <ColoringPage pal={pal} onClose={() => setColoring(false)} />}
    </div>
  )
}
