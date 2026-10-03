// A Pal's home on the Ark: pet it (hearts and giggles), feed it berries, dress it up, see its moves.
// Berries and dress-up things are dragged onto the Pal (a tap works too).
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import DressedPal from './DressedPal'
import ColoringPage from './ColoringPage'
import Kitchen from './Kitchen'
import { recipeFor } from '../data/recipes'
import { hungryPals } from '../lib/kitchen'
import { activeProfile } from '../lib/progress'
import { BackButton, BigButton } from './ui'
import { FRUIT_COLOR, palIntro, stageFor, type PalDef } from '../data/pals'
import { useProgress } from '../lib/progress'
import { movesFor, POWER } from '../lib/moves'
import { BERRIES, feed, feedsLeft, unlockedAccessories, ACCESSORIES, wear, type Accessory } from '../lib/care'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { fly, useDrag, useDropTarget } from '../lib/drag'
import { pick } from '../lib/util'

const PET_LINES = ['{name} loves that!', 'Hee hee! That tickles!', '{name} is so happy!', 'Aww, {name} wants a hug!']

type Carry = { kind: 'berry'; b: string } | { kind: 'acc'; a: Accessory }

/** A berry or a dress-up thing she can carry over to the Pal. */
function Carryable({ what, label, on, disabled, onGive }: {
  what: Carry; label: string; on?: boolean; disabled?: boolean; onGive: (what: Carry, el: HTMLElement | null) => boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const drag = useDrag({ data: what, disabled, onStart: sfx.lift, onDrop: (t) => t === 'home-pal' && onGive(what, null), onTap: () => onGive(what, ref.current) })
  return <button ref={ref} className={`home-btn ${on ? 'on' : ''}`} disabled={disabled} aria-label={label} {...drag}>{what.kind === 'berry' ? what.b : what.a.emoji}</button>
}

export default function PalHome({ pal, onClose }: { pal: PalDef; onClose: () => void }) {
  const p = useProgress()
  const stage = stageFor(pal, p.pals[pal.id] ?? 0)
  const name = pal.stages[stage].name
  const [hearts, setHearts] = useState(0) // bumps to replay the hearts animation
  const [anim, setAnim] = useState('')
  const [coloring, setColoring] = useState(false)
  const [cooking, setCooking] = useState(false)
  const left = feedsLeft(p, pal.id)
  const outfits = unlockedAccessories(p)
  const palBox = useRef<HTMLButtonElement | null>(null)
  const palTarget = useDropTarget('home-pal', undefined, 30)
  const palRef = useCallback((el: HTMLButtonElement | null) => { palBox.current = el; palTarget(el) }, [palTarget])

  const hungry = hungryPals(p, activeProfile().id).includes(pal.id)
  const dish = recipeFor(pal.fruit)
  useEffect(() => { speak(hungry ? `${name} is hungry! ${name} would love some ${dish.name}.` : palIntro(pal, stage)) }, [])

  const react = (cls: string, ms: number) => {
    setAnim(cls)
    setTimeout(() => setAnim(''), ms)
  }
  const pet = () => {
    sfx.good()
    setHearts((h) => h + 1)
    react('wiggle-happy', 700)
    speak(pick(PET_LINES).replaceAll('{name}', name))
  }

  const eat = () => {
    if (!feed(pal.id)) {
      sfx.oops()
      speak(`${name} is full! More berries tomorrow.`)
      return false
    }
    sfx.chomp()
    react('chomp', 650)
    setTimeout(() => { sfx.count(5); setHearts((h) => h + 1) }, 300)
    speak(left - 1 > 0 ? `Yum! ${name} loves berries!` : `Yum! ${name} is full now. Thank you!`)
    return true
  }
  const dress = (a: Accessory | null) => {
    sfx.pop()
    wear(pal.id, a?.id ?? null)
    if (a) react('wiggle-happy', 700)
    speak(a ? `${name} looks great in the ${a.name}!` : `${name} took it off.`)
  }
  /** Dropped on the Pal (el = null), or tapped (fly it over first). */
  const give = (what: Carry, el: HTMLElement | null) => {
    if (what.kind === 'acc' && p.outfits[pal.id] === what.a.id && el) {
      dress(null) // tapping what it's wearing takes it off
      return true
    }
    if (el && palBox.current) {
      if (what.kind === 'berry' && left <= 0) return eat()
      el.style.visibility = 'hidden'
      fly(el, palBox.current, { arc: 80, endScale: what.kind === 'berry' ? 0.4 : 0.8 }).then(() => {
        el.style.visibility = ''
        if (what.kind === 'berry') eat()
        else dress(what.a)
      })
      return true
    }
    if (what.kind === 'berry') return eat()
    dress(what.a)
    return true
  }

  return (
    <div className="overlay pal-home" style={{ '--c': FRUIT_COLOR[pal.fruit] } as CSSProperties}>
      <header className="home-head"><BackButton onClick={onClose} /><h2>{name}</h2><span className="fruit-tag">{pal.fruit} Pal</span></header>
      <div className="home-main">
        <div className="home-stage">
          <button ref={palRef} className={`home-pal ${anim}`} onClick={pet} aria-label={`Pet ${name}`}>
            <DressedPal pal={pal} stage={stage} size={260} outfit={p.outfits[pal.id]} />
          </button>
          {hearts > 0 && (
            <div className="home-hearts" key={hearts}>{['💖', '💗', '💕', '💖', '💗'].map((h, i) => <span key={i} style={{ '--i': i } as CSSProperties}>{h}</span>)}</div>
          )}
          <p className="home-hint">Tap {name} to pet! Drag a berry over for a snack.</p>
          <div className="leave-row">
            <BigButton color={hungry ? 'yellow' : 'white'} className={hungry ? 'k-hungry-btn' : ''} onClick={() => setCooking(true)}>🍳 Cook {dish.emoji}</BigButton>
            <BigButton color="white" onClick={() => setColoring(true)}>🖍️ Color me</BigButton>
          </div>
        </div>
        <div className="home-side">
          <div className="home-box">
            <h3>Berries <small>{Math.max(0, left)} left today</small></h3>
            <div className="home-row">{BERRIES.map((b) => <Carryable key={b} what={{ kind: 'berry', b }} label={`Give ${name} a berry`} disabled={left <= 0} onGive={give} />)}</div>
          </div>
          <div className="home-box">
            <h3>Dress up</h3>
            <div className="home-row">
              {outfits.map((a) => (
                <Carryable key={a.id} what={{ kind: 'acc', a }} label={a.name} on={p.outfits[pal.id] === a.id} onGive={give} />
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
      {cooking && <Kitchen pal={pal} hungry={hungry} onClose={() => setCooking(false)} />}
    </div>
  )
}
