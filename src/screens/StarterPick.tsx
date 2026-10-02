import { useEffect, useState } from 'react'
import PalArt from '../components/PalArt'
import { BigButton } from '../components/ui'
import { PALS } from '../data/pals'
import { chooseStarter } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

const starters = PALS.filter((p) => p.starter)

export default function StarterPick({ onDone }: { onDone: () => void }) {
  const [sel, setSel] = useState<string | null>(null)
  useEffect(() => {
    speak('Hi Carter! Welcome to the Ark! Choose your very first Ark Pal. Tap one to meet them!')
  }, [])
  const choose = (id: string) => {
    setSel(id)
    const p = starters.find((s) => s.id === id)!
    speak(`${p.stages[0].name} ${p.intro}`)
  }
  return (
    <div className="screen starter">
      <h2>Choose your first Ark Pal!</h2>
      <div className="starter-row">
        {starters.map((p) => (
          <button key={p.id} className={`starter-card ${sel === p.id ? 'sel' : ''}`} onClick={() => { sfx.pop(); choose(p.id) }}>
            <PalArt pal={p} size={170} className={sel === p.id ? 'bounce' : ''} />
            <div className="name">{p.stages[0].name}</div>
            <div className="fruit">{p.fruit}</div>
          </button>
        ))}
      </div>
      {sel && (
        <BigButton color="pink" onClick={() => {
          chooseStarter(sel)
          sfx.fanfare()
          speak(`You chose ${starters.find((s) => s.id === sel)!.stages[0].name}! Let's go on an adventure!`)
          onDone()
        }}>💖 I choose you!</BigButton>
      )}
    </div>
  )
}
