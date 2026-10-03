import { useState } from 'react'
import PalArt from '../components/PalArt'
import { BirthdayPicker } from '../components/FamilyEditor'
import { palById } from '../data/pals'
import { isBirthday, sleepsToGo, type Birthday } from '../lib/birthday'
import { PLAYER_EMOJIS } from '../lib/look'
import { addProfile, useProfiles } from '../lib/progress'
import { sfx } from '../lib/sfx'
import { applyUpdate, useUpdateAvailable } from '../lib/update'

/** A brand-new device: add the first player (a grown-up can do the rest in the Parent Corner). */
function Welcome({ onDone }: { onDone: (id: string) => void }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(PLAYER_EMOJIS[0])
  const [birthday, setBirthday] = useState<Birthday | undefined>()
  return (
    <form className="welcome" onSubmit={(e) => {
      e.preventDefault()
      if (!name.trim()) return
      sfx.pop()
      onDone(addProfile(name.trim(), emoji, { birthday }))
    }}>
      <h2>Welcome! Who&rsquo;s playing?</h2>
      <input className="welcome-name" value={name} maxLength={16} placeholder="First name" aria-label="Player's first name" onChange={(e) => setName(e.target.value)} />
      <div className="welcome-emoji">
        {PLAYER_EMOJIS.map((x) => <button key={x} type="button" className={emoji === x ? 'on' : ''} aria-label={`Icon ${x}`} onClick={() => setEmoji(x)}>{x}</button>)}
      </div>
      <label className="welcome-bday">Birthday (optional, for a surprise party) <BirthdayPicker value={birthday} onChange={setBirthday} /></label>
      <button type="submit" className="big-btn pink" disabled={!name.trim()}>▶️ Let&rsquo;s play!</button>
      <p className="muted">For grown-ups: add more players, how they look in the stories, and your family&rsquo;s names in the Parent Corner (press and hold ⚙️ on the map).</p>
    </form>
  )
}

/** Title screen. Tapping a player starts the game as them; each player has their own progress. */
export default function Title({ onStart }: { onStart: (profileId: string) => void }) {
  const { active, list } = useProfiles()
  const update = useUpdateAvailable()
  return (
    <div className={`screen title ${list.length ? '' : 'welcoming'}`}>
      {update && <button className="update-pill" onClick={applyUpdate}>✨ Update ready: tap to update</button>}
      <div className="title-pals">
        <PalArt pal={palById('zippy')} size={120} className="bob" />
        <PalArt pal={palById('ember')} size={140} className="bob d1" />
        <PalArt pal={palById('pebble')} size={120} className="bob d2" />
      </div>
      <h1>Ark Pals<br /><span>Adventure</span></h1>
      {list.length ? (
        <>
          <div className="who">Who&rsquo;s playing?</div>
          <div className="players">
            {list.map((pr) => {
              const sleeps = sleepsToGo(pr.birthday)
              return (
                <button key={pr.id} className={`player ${pr.id === active ? 'last' : ''}`} onClick={() => onStart(pr.id)}>
                  <span className="player-emoji">{pr.emoji}</span>
                  <span className="player-name">{pr.name.trim() || 'Player'}</span>
                  {isBirthday(pr.birthday) && <span className="player-bday">🎂 Birthday!</span>}
                  {sleeps > 0 && <span className="player-bday soon">🎈 {sleeps} {sleeps === 1 ? 'sleep' : 'sleeps'}</span>}
                </button>
              )
            })}
          </div>
        </>
      ) : <Welcome onDone={onStart} />}
    </div>
  )
}
