// Development only (npm run dev, then open /#gallery/...): every illustration and Pal on one page,
// animating, for checking art and motion. Not part of the built game.
//   #gallery/scenes/<island>   that island's story pictures (or "all")
//   #gallery/pals              every Pal at every stage
import { STORY_ART } from '../art/scenes'
import { BuddyContext } from '../art/scenes/buddy'
import PalArt from '../components/PalArt'
import { PALS } from '../data/pals'

export default function Gallery({ route }: { route: string }) {
  const [, kind, which] = route.split('/')
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
          <BuddyContext.Provider value={{ id: 'pip', stage: 1 }}><Art /></BuddyContext.Provider>
        </div>
      )))}
    </div>
  )
}
