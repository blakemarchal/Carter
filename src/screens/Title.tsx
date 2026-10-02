import PalArt from '../components/PalArt'
import { palById } from '../data/pals'
import { unlockSpeech } from '../lib/speech'

export default function Title({ onStart }: { onStart: () => void }) {
  return (
    <button className="screen title" onClick={() => { unlockSpeech(); onStart() }}>
      <div className="title-pals">
        <PalArt pal={palById('zippy')} size={120} className="bob" />
        <PalArt pal={palById('ember')} size={140} className="bob d1" />
        <PalArt pal={palById('pebble')} size={120} className="bob d2" />
      </div>
      <h1>Carter&rsquo;s Ark<br /><span>Adventure</span></h1>
      <div className="tap-start">👆 Tap to play!</div>
    </button>
  )
}
