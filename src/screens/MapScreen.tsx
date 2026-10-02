import { useEffect } from 'react'
import PalArt from '../components/PalArt'
import { HoldButton } from '../components/ui'
import { ISLANDS } from '../data/islands'
import { palById, stageFor } from '../data/pals'
import { useProgress } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

export default function MapScreen({ onIsland, onArk, onParent }: { onIsland: (id: string) => void; onArk: () => void; onParent: () => void }) {
  const p = useProgress()
  const buddy = palById(p.starter ?? 'zippy')
  useEffect(() => { speak('Where should we go? Tap an island!') }, [])
  return (
    <div className="screen map">
      <header className="map-head">
        <button className="ark-btn" onClick={() => { sfx.pop(); onArk() }}>
          <PalArt pal={buddy} stage={stageFor(buddy, p.pals[buddy.id] ?? 0)} size={70} />
          <span>My Ark</span>
        </button>
        <h2>Adventure Map</h2>
        <HoldButton onHold={onParent} className="parent-gear">⚙️</HoldButton>
      </header>
      <div className="islands">
        {ISLANDS.map((isl, i) => {
          const done = p.islandsDone.includes(isl.id)
          return (
            <button key={isl.id} className={`island ${isl.ready ? '' : 'locked'} ${done ? 'done' : ''}`}
              style={{ ['--c' as string]: isl.color, ['--i' as string]: i }}
              onClick={() => {
                sfx.pop()
                if (isl.ready) onIsland(isl.id)
                else speak(`${isl.name} is coming soon!`)
              }}>
              <span className="isl-emoji">{isl.ready ? isl.emoji : '🔒'}</span>
              <span className="isl-name">{isl.name}</span>
              {done && <span className="isl-star">⭐</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
