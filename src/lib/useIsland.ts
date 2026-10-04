// An island's content (data/islands.ts loads it when it's first needed): undefined until it's here.
import { useEffect, useSyncExternalStore } from 'react'
import { loadIsland, loadedIsland, onIslandLoaded, type Island } from '../data/islands'

export function useIsland(id: string | undefined): Island | undefined {
  const isl = useSyncExternalStore(onIslandLoaded, () => (id ? loadedIsland(id) : undefined))
  useEffect(() => { if (id) loadIsland(id).catch(() => {}) }, [id])
  return isl
}

/** Every built island's content, once all of them have loaded (or undefined until then). */
export function useAllIslands(ids: string[]): Island[] | undefined {
  // (a string, so the snapshot stays the same until another island arrives; 'ready' even for no islands)
  const all = useSyncExternalStore(onIslandLoaded, () => (ids.every((id) => loadedIsland(id)) ? `ready:${ids.join()}` : ''))
  useEffect(() => { ids.forEach((id) => loadIsland(id).catch(() => {})) }, [ids.join()])
  return all ? ids.map((id) => loadedIsland(id)!) : undefined
}
