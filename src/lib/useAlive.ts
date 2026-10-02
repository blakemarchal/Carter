import { useEffect, useRef } from 'react'

/**
 * For async sequences (narration, counting): `alive.current` turns false when the component
 * unmounts, so a sequence can stop instead of talking over the next screen.
 *   await speak('...'); if (!alive.current) return
 */
export function useAlive() {
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])
  return alive
}
