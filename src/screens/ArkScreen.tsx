import { useEffect } from 'react'
import PalArt from '../components/PalArt'
import { BackButton } from '../components/ui'
import { FRUIT_COLOR, PALS, stageFor } from '../data/pals'
import { useProgress } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

export default function ArkScreen({ onBack }: { onBack: () => void }) {
  const p = useProgress()
  useEffect(() => { speak('Welcome to your Ark! Tap a Pal to say hi.') }, [])
  return (
    <div className="screen ark">
      <header><BackButton onClick={onBack} /><h2>🚢 My Ark Pals</h2><span /></header>
      <div className="pal-grid">
        {PALS.map((pal) => {
          const have = pal.id in p.pals
          const xp = p.pals[pal.id] ?? 0
          const st = stageFor(pal, xp)
          const next = pal.stages[st + 1]
          return (
            <button key={pal.id} className={`pal-card ${have ? '' : 'unknown'}`} style={{ ['--c' as string]: FRUIT_COLOR[pal.fruit] }}
              onClick={() => {
                sfx.pop()
                speak(have ? `${pal.stages[st].name} ${pal.intro}` : 'Who could this be? Keep exploring to find out!')
              }}>
              <PalArt pal={pal} stage={st} size={130} silhouette={!have} className={have ? 'bob' : ''} />
              <div className="name">{have ? pal.stages[st].name : '???'}</div>
              {have && <div className="fruit-tag">{pal.fruit}</div>}
              {have && next && (
                <div className="xp"><i style={{ width: `${Math.min(100, ((xp - pal.stages[st].xp) / (next.xp - pal.stages[st].xp)) * 100)}%` }} /></div>
              )}
            </button>
          )
        })}
      </div>
      <div className="stickers">{p.stickers.map((s) => <span key={s}>{s}</span>)}</div>
    </div>
  )
}
