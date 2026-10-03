// Development only (npm run dev, then open /#gallery/...): every illustration and Pal on one page,
// animating, for checking art and motion. Not part of the built game.
//   #gallery/scenes/<island>   that island's story pictures (or "all")
//   #gallery/scenes/<island>/family   the same, for a made-up family (baby, big sister, pets, turning 5)
//   #gallery/pals              every Pal at every stage
import { STORY_ART } from '../art/scenes'
import { BuddyContext } from '../art/scenes/buddy'
import { PlayerContext, type PlayerArt } from '../art/scenes/player'
import { grownupLook, kidLook, siblingLook } from '../art/people'
import PalArt from '../components/PalArt'
import { PALS } from '../data/pals'
import type { KidLook } from '../lib/look'

const LOOK: KidLook = { skin: 'tan', hair: 'pigtails', hairColor: '#2b1d14', color: '#8d7cff' }
const SAMPLE: PlayerArt = {
  name: 'Robin',
  look: kidLook(LOOK),
  grownups: [{ name: 'Mama', role: 'mom', look: grownupLook('mom', LOOK) }, { name: 'Papa', role: 'dad', look: grownupLook('dad', LOOK) }],
  siblings: [{ name: 'Jo', baby: false, look: siblingLook(LOOK, 0) }, { name: 'Bean', baby: true, look: siblingLook(LOOK, 1) }],
  pets: [{ name: 'Biscuit', emoji: '🐶' }, { name: 'Mittens', emoji: '🐱' }],
  age: 5,
  birthday: { month: 1, day: 8 },
  pals: [{ id: 'pip', stage: 1 }, { id: 'ember', stage: 0 }, { id: 'sprinkles', stage: 2 }, { id: 'lionel', stage: 0 }, { id: 'starling', stage: 1 }, { id: 'chilly', stage: 0 }],
}

export default function Gallery({ route }: { route: string }) {
  const [, kind, which, variant] = route.split('/')
  if (kind === 'pals') {
    return (
      <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: '#fff', height: '100%', overflow: 'auto' }}>
        {PALS.flatMap((pal) => pal.stages.map((st, i) => (
          <div key={`${pal.id}-${i}`} data-name={`${pal.id} stage ${i} (${st.name})`} style={{ textAlign: 'center', fontSize: 12 }}>
            <PalArt pal={pal} stage={i} size={150} />
            <div>{st.name}</div>
          </div>
        )))}
      </div>
    )
  }
  const islands = which === 'all' || !which ? Object.keys(STORY_ART) : [which]
  return (
    <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: '#fff', height: '100%', overflow: 'auto' }}>
      {islands.flatMap((id) => STORY_ART[id].map((Art, i) => (
        <div key={`${id}-${i}`} data-name={`${id} page ${i + 1}`} style={{ width: 560, height: 315, position: 'relative', overflow: 'hidden', borderRadius: 12, outline: '1px solid #ddd' }}>
          <BuddyContext.Provider value={{ id: 'pip', stage: 1 }}>
            {variant === 'family' ? <PlayerContext.Provider value={SAMPLE}><Art /></PlayerContext.Provider> : <Art />}
          </BuddyContext.Provider>
        </div>
      )))}
    </div>
  )
}
