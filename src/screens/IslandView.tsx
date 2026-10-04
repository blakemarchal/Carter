// An island, once its content has loaded (data/islands.ts loads each island when it's first needed;
// it takes a moment the first time, and it's kept after that). The island screen itself, with its
// activities and mini-games, loads with the first island too.
import { lazy, Suspense, useEffect, useState } from 'react'
import { BigButton } from '../components/ui'
import { loadIsland } from '../data/islands'
import { useIsland } from '../lib/useIsland'

const IslandScreen = lazy(() => import('./IslandScreen'))

function Sailing() {
  return (
    <div className="screen sailing">
      <div className="sailing-ark bob" aria-hidden>⛵</div>
      <p>Sailing to the island…</p>
    </div>
  )
}

export default function IslandView({ id, onExit }: { id: string; onExit: () => void }) {
  const isl = useIsland(id)
  const [failed, setFailed] = useState(false)
  useEffect(() => { loadIsland(id).catch(() => setFailed(true)) }, [id])
  if (failed && !isl) {
    return (
      <div className="screen sailing">
        <p>Oh no, the Ark couldn&rsquo;t reach this island. Check the internet, then try again!</p>
        <BigButton color="pink" onClick={onExit}>🗺️ Map</BigButton>
      </div>
    )
  }
  if (!isl) return <Sailing />
  return (
    <Suspense fallback={<Sailing />}>
      <IslandScreen island={isl} onExit={onExit} />
    </Suspense>
  )
}
