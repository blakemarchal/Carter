// The Ark: all her Pals (and silhouettes of ones still to find). Tap a Pal to visit its home
// (pet, feed, dress up). The mystery egg sits here once she's finished an island.
import { useEffect, useState } from 'react'
import DressedPal from '../components/DressedPal'
import PalArt from '../components/PalArt'
import PalHome from '../components/PalHome'
import HatchScene, { Egg } from '../components/HatchScene'
import StickerBook from '../components/StickerBook'
import { BackButton } from '../components/ui'
import { FRUIT_COLOR, PALS, palById, stageFor, type PalDef } from '../data/pals'
import { useProgress } from '../lib/progress'
import { EGG_DAYS, EGG_PAL, eggActive, eggReady, hatchEgg } from '../lib/care'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

export default function ArkScreen({ onBack }: { onBack: () => void }) {
  const p = useProgress()
  const [home, setHome] = useState<PalDef | null>(null)
  const [hatching, setHatching] = useState(false)
  const [book, setBook] = useState(false)
  useEffect(() => { speak('Welcome to your Ark! Tap a Pal to say hi.') }, [])

  const tapEgg = () => {
    sfx.pop()
    if (eggReady(p)) return setHatching(true)
    const left = EGG_DAYS - p.egg.warmth
    speak(`A mystery egg! It's getting warmer. Come play ${left === 1 ? 'one more day' : `${left} more days`} to help it hatch!`)
  }

  return (
    <div className="screen ark">
      <header>
        <BackButton onClick={onBack} />
        <h2>🚢 My Ark Pals</h2>
        <button className="ark-btn" onClick={() => { sfx.pop(); setBook(true) }}><span>⭐</span> Stickers</button>
      </header>
      {eggActive(p) && (
        <button className={`egg-card warm-${p.egg.warmth} ${eggReady(p) ? 'ready' : ''}`} onClick={tapEgg}>
          <Egg size={110} className="egg-wobble" />
          <span className="egg-text">
            <b>{eggReady(p) ? 'It’s hatching! Tap!' : 'Mystery Egg'}</b>
            <span className="egg-warmth">{Array.from({ length: EGG_DAYS }, (_, i) => <i key={i} className={i < p.egg.warmth ? 'on' : ''}>🔥</i>)}</span>
          </span>
        </button>
      )}
      <div className="pal-grid">
        {PALS.map((pal) => {
          const have = pal.id in p.pals
          // The egg's Pal stays a complete secret until it hatches.
          if (!have && pal.id === EGG_PAL) return null
          const xp = p.pals[pal.id] ?? 0
          const st = stageFor(pal, xp)
          const next = pal.stages[st + 1]
          return (
            <button key={pal.id} className={`pal-card ${have ? '' : 'unknown'}`} style={{ ['--c' as string]: FRUIT_COLOR[pal.fruit] }}
              onClick={() => {
                sfx.pop()
                if (have) setHome(pal)
                else speak('Who could this be? Keep exploring to find out!')
              }}>
              {have
                ? <DressedPal pal={pal} stage={st} size={120} outfit={p.outfits[pal.id]} className="bob" />
                : <PalArt pal={pal} stage={st} size={120} silhouette />}
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
      {home && <PalHome pal={home} onClose={() => { setHome(null); speak('Tap a Pal to say hi.') }} />}
      {book && <StickerBook onClose={() => setBook(false)} />}
      {hatching && <HatchScene pal={palById(EGG_PAL)} onDone={() => { hatchEgg(); setHatching(false) }} />}
    </div>
  )
}
