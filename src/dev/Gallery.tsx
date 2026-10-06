// Development only (npm run dev, then open /#gallery/...): every illustration and Pal on one page,
// animating, for checking art and motion. Not part of the built game.
//   #gallery/scenes/<island>   that island's story pictures (or "all")
//   #gallery/scenes/<island>/family   the same, for a made-up family (baby, big sister, pets, turning 5)
//   #gallery/pals[/<id or species>]   every Pal at every stage (or just one)
//   #gallery/hats[/<id or species>]   the same with a party hat on and a yawn drawn where art/pals/faces.ts says
//   #gallery/items[/<group>]   every drawn item (art/items), large and at activity sizes
//   #gallery/game/<kind>[/<island>]   a mini-game mechanic, playable, with its demo kit or an island's
//   #gallery/kit/<island>      every piece of an island's mini-game kit, drawn in place
//   #gallery/learn/<skill>/<level>[/question|exercise]   one practice turn at that level, playable
import { STORY_ART } from '../art/scenes'
import { ISLANDS } from '../data/islands'
import { useAllIslands } from '../lib/useIsland'
import { BuddyContext } from '../art/scenes/buddy'
import { PlayerContext, type PlayerArt } from '../art/scenes/player'
import { grownupLook, kidLook, siblingLook } from '../art/people'
import PalArt from '../components/PalArt'
import Pic from '../components/Pic'
import { ITEM_GROUPS } from '../art/items'
import { PALS } from '../data/pals'
import type { KidLook } from '../lib/look'
import GameDemo from './GameDemo'
import DressedPal from '../components/DressedPal'
import { atStage, PAL_FACES, stageScale } from '../art/pals/faces'
import KitPreview from './KitPreview'
import LearnDemo from './LearnDemo'

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
  if (kind === 'game') return <GameDemo kind={which} island={variant} />
  if (kind === 'kit') return <KitPreview island={which} />
  if (kind === 'learn') return <LearnDemo skill={which} level={variant} mode={route.split('/')[4]} />
  if (kind === 'hats') {
    return (
      <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: '#fff', height: '100%', overflow: 'auto', alignContent: 'flex-start' }}>
        {PALS.filter((pal) => !which || pal.id === which || pal.species === which).flatMap((pal) => pal.stages.map((st, i) => {
          const m = PAL_FACES[pal.species].yawn
          const c = atStage(100, m.y, i)
          return (
            <div key={`${pal.id}-${i}`} data-name={`${pal.id} stage ${i} (${st.name}): hat and yawn`} style={{ position: 'relative', width: 200, height: 220, paddingTop: 20 }}>
              <DressedPal pal={pal} stage={i} size={200} outfit="partyhat" />
              <svg viewBox="0 0 200 200" width={200} height={200} style={{ position: 'absolute', left: 0, top: 20, pointerEvents: 'none' }}>
                <ellipse cx={c.x} cy={c.y} rx={m.rx * stageScale(i)} ry={m.ry * stageScale(i)} fill="#6b2a3a" opacity={0.7} />
              </svg>
            </div>
          )
        }))}
      </div>
    )
  }
  if (kind === 'items') {
    const groups = which ? { [which]: ITEM_GROUPS[which] ?? [] } : ITEM_GROUPS
    return (
      <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: '#fff', height: '100%', overflow: 'auto', alignContent: 'flex-start' }}>
        {Object.entries(groups).flatMap(([g, list]) => list.map((it) => (
          <div key={it.id} data-name={`${g}: ${it.id}`} style={{ width: 200, textAlign: 'center', fontSize: 13, background: '#f7f3fa', borderRadius: 12, padding: 6 }}>
            <div style={{ fontSize: 150, lineHeight: 1 }}><Pic e={it.emoji?.[0] ?? ''} art={it.id} /></div>
            <div style={{ fontSize: 40, display: 'flex', justifyContent: 'center', gap: 4 }}><Pic e="" art={it.id} /><span style={{ fontSize: 28 }}><Pic e="" art={it.id} /></span><span style={{ opacity: 0.8 }}>{it.emoji?.[0]}</span></div>
            <div><b>{it.id}</b> · {it.name}</div>
          </div>
        )))}
      </div>
    )
  }
  if (kind === 'pals') {
    return (
      <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: '#fff', height: '100%', overflow: 'auto' }}>
        {PALS.filter((pal) => !which || pal.id === which || pal.species === which).flatMap((pal) => pal.stages.map((st, i) => (
          <div key={`${pal.id}-${i}`} data-name={`${pal.id} stage ${i} (${st.name})`} style={{ textAlign: 'center', fontSize: 12 }}>
            <PalArt pal={pal} stage={i} size={150} />
            <div>{st.name}</div>
          </div>
        )))}
      </div>
    )
  }
  return <Scenes which={which} variant={variant} />
}

/** Story pictures: one island's (or the birthday party's or bedtime's), or every one of them. */
function Scenes({ which, variant }: { which?: string; variant?: string }) {
  const all = which === 'all' || !which
  const ids = all ? ISLANDS.map((i) => i.id) : STORY_ART[which] ? [] : [which]
  const loaded = useAllIslands(ids)
  if (!loaded) return null
  const sets = [...loaded.map((i) => [i.id, i.art] as const), ...Object.entries(STORY_ART).filter(([id]) => all || id === which)]
  return (
    <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: '#fff', height: '100%', overflow: 'auto' }}>
      {sets.flatMap(([id, art]) => art.map((Art, i) => (
        <div key={`${id}-${i}`} data-name={`${id} page ${i + 1}`} style={{ width: 560, height: 315, position: 'relative', overflow: 'hidden', borderRadius: 12, outline: '1px solid #ddd' }}>
          <BuddyContext.Provider value={{ id: 'pip', stage: 1 }}>
            {variant === 'family' ? <PlayerContext.Provider value={SAMPLE}><Art /></PlayerContext.Provider> : <Art />}
          </BuddyContext.Provider>
        </div>
      )))}
    </div>
  )
}
