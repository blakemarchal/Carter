// Sticker book: a big scene where she drags her stickers anywhere. Positions are saved.
import { useEffect, useRef, useState } from 'react'
import { BackButton } from './ui'
import { update, useProgress } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

export default function StickerBook({ onClose }: { onClose: () => void }) {
  const p = useProgress()
  const scene = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ s: string; x: number; y: number } | null>(null)
  const placed = new Set(p.stickerSpots.map((x) => x.s))
  const tray = p.stickers.filter((s) => !placed.has(s))

  useEffect(() => {
    speak(p.stickers.length ? 'Your sticker book! Drag your stickers anywhere you like.' : 'Finish an island to earn your first sticker!')
  }, [])

  const where = (e: React.PointerEvent) => {
    const r = scene.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
  }
  const start = (s: string) => (e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    sfx.pop()
    setDrag({ s, ...where(e) })
  }
  const move = (e: React.PointerEvent) => { if (drag) setDrag({ ...drag, ...where(e) }) }
  const end = () => {
    if (!drag) return
    const inside = drag.x >= 0 && drag.x <= 100 && drag.y >= 0 && drag.y <= 100
    update((x) => ({
      ...x,
      stickerSpots: [...x.stickerSpots.filter((t) => t.s !== drag.s), ...(inside ? [{ s: drag.s, x: drag.x, y: drag.y }] : [])],
    }))
    if (inside) sfx.good()
    setDrag(null)
  }

  return (
    <div className="overlay sticker-book" onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
      <header className="home-head"><BackButton onClick={onClose} /><h2>⭐ My Sticker Book</h2><span /></header>
      <div ref={scene} className="sticker-scene">
        {p.stickerSpots.filter((t) => t.s !== drag?.s).map((t) => (
          <span key={t.s} className="placed-sticker" style={{ left: `${t.x}%`, top: `${t.y}%` }} onPointerDown={start(t.s)}>{t.s}</span>
        ))}
        {drag && <span className="placed-sticker dragging" style={{ left: `${drag.x}%`, top: `${drag.y}%` }}>{drag.s}</span>}
      </div>
      <div className="sticker-tray">
        {tray.length ? tray.map((s) => <span key={s} className="tray-sticker" onPointerDown={start(s)}>{s}</span>)
          : <span className="muted">{p.stickers.length ? 'All your stickers are on the page!' : 'No stickers yet.'}</span>}
      </div>
    </div>
  )
}
