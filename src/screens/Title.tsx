import PalArt from '../components/PalArt'
import { palById } from '../data/pals'
import { useProfiles } from '../lib/progress'

/** Title screen. Tapping a player starts the game as them; each player has their own progress. */
export default function Title({ onStart }: { onStart: (profileId: string) => void }) {
  const { active, list } = useProfiles()
  return (
    <div className="screen title">
      <div className="title-pals">
        <PalArt pal={palById('zippy')} size={120} className="bob" />
        <PalArt pal={palById('ember')} size={140} className="bob d1" />
        <PalArt pal={palById('pebble')} size={120} className="bob d2" />
      </div>
      <h1>Carter&rsquo;s Ark<br /><span>Adventure</span></h1>
      <div className="who">Who&rsquo;s playing?</div>
      <div className="players">
        {list.map((pr) => (
          <button key={pr.id} className={`player ${pr.id === active ? 'last' : ''}`} onClick={() => onStart(pr.id)}>
            <span className="player-emoji">{pr.emoji}</span>
            <span className="player-name">{pr.name.trim() || 'Player'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
