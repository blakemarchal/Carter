// Sticker book: a big scene where she drags her stickers anywhere (and back to the tray to take them
// off). Positions are saved.
import { useCallback, useEffect, useRef } from 'react'
import { BackButton } from './ui'
import { update, useProgress } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { useDrag, useDropTarget, type Pt } from '../lib/drag'

type Place = (s: string, where: 'scene' | 'tray', at: Pt) => boolean

function Sticker({ s, spot, onPlace }: { s: string; spot?: { x: number; y: number }; onPlace: Place }) {
  const drag = useDrag({
    data: s, landing: 'here', onStart: sfx.lift,
    onDrop: (t, at) => (t === 'scene' || t === 'tray') && onPlace(s, t, at),
    onTap: () => speak(spot ? 'Drag it somewhere else, or back to the tray!' : 'Drag it onto the page!'),
  })
  return spot
    ? <span className="placed-sticker" style={{ left: `${spot.x}%`, top: `${spot.y}%` }} {...drag}>{s}</span>
    : <span className="tray-sticker" {...drag}>{s}</span>
}

export default function StickerBook({ onClose }: { onClose: () => void }) {
  const p = useProgress()
  const scene = useRef<HTMLDivElement | null>(null)
  const sceneTarget = useDropTarget('scene', undefined, 0)
  const trayTarget = useDropTarget('tray', (s: string) => p.stickerSpots.some((t) => t.s === s), 10)
  const sceneRef = useCallback((el: HTMLDivElement | null) => { scene.current = el; sceneTarget(el) }, [sceneTarget])
  const placed = new Set(p.stickerSpots.map((x) => x.s))
  const tray = p.stickers.filter((s) => !placed.has(s))

  useEffect(() => {
    speak(p.stickers.length ? 'Your sticker book! Drag your stickers anywhere you like.' : 'Finish an island to earn your first sticker!')
  }, [])

  const place: Place = (s, where, at) => {
    if (where === 'tray') {
      sfx.pop()
      update((x) => ({ ...x, stickerSpots: x.stickerSpots.filter((t) => t.s !== s) }))
      return true
    }
    const r = scene.current!.getBoundingClientRect()
    const x = Math.max(4, Math.min(96, ((at.x - r.left) / r.width) * 100))
    const y = Math.max(6, Math.min(94, ((at.y - r.top) / r.height) * 100))
    sfx.good()
    update((u) => ({ ...u, stickerSpots: [...u.stickerSpots.filter((t) => t.s !== s), { s, x, y }] }))
    return true
  }

  return (
    <div className="overlay sticker-book">
      <header className="home-head"><BackButton onClick={onClose} /><h2>⭐ My Sticker Book</h2><span /></header>
      <div ref={sceneRef} className="sticker-scene">
        {p.stickerSpots.map((t) => <Sticker key={t.s} s={t.s} spot={t} onPlace={place} />)}
      </div>
      <div ref={trayTarget} className="sticker-tray">
        {tray.length ? tray.map((s) => <Sticker key={s} s={s} onPlace={place} />)
          : <span className="muted">{p.stickers.length ? 'All your stickers are on the page!' : 'No stickers yet.'}</span>}
      </div>
    </div>
  )
}
