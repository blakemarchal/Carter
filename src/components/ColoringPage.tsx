// Coloring page: any befriended Pal, drawn as white shapes with outlines. Pick a color, tap a
// part to fill it. Colors are saved per Pal (by the shape's position in the drawing).
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import PalArt from './PalArt'
import { BackButton, BigButton } from './ui'
import { stageFor, type PalDef } from '../data/pals'
import { update, useProgress } from '../lib/progress'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'

const PALETTE = ['#ff6fae', '#ff5d5d', '#ffa64d', '#ffd34d', '#5fd39a', '#5fb7ff', '#9b8cff', '#a0612f', '#ffffff', '#3b2a4a']

export default function ColoringPage({ pal, onClose }: { pal: PalDef; onClose: () => void }) {
  const p = useProgress()
  const stage = stageFor(pal, p.pals[pal.id] ?? 0)
  const [color, setColor] = useState(PALETTE[0])
  const box = useRef<HTMLDivElement>(null)
  // Keyed by stage too: a grown Pal is a different drawing.
  const key = `${pal.id}:${stage}`
  const saved = p.colors[key] ?? {}

  const shapes = () => [...(box.current?.querySelectorAll('svg path, svg circle, svg ellipse, svg rect') ?? [])] as SVGElement[]

  // Paint saved colors back on.
  useEffect(() => {
    shapes().forEach((el, i) => { el.style.fill = saved[i] ?? '' })
  }, [saved, stage])

  useEffect(() => { speak(`Let's color ${pal.stages[stage].name}! Pick a color, then tap a part.`) }, [])

  const tap = (e: React.MouseEvent) => {
    const i = shapes().indexOf(e.target as SVGElement)
    if (i < 0) return
    sfx.pop()
    update((x) => ({ ...x, colors: { ...x.colors, [key]: { ...(x.colors[key] ?? {}), [i]: color } } }))
  }

  return (
    <div className="overlay coloring-page">
      <header className="home-head"><BackButton onClick={onClose} /><h2>🖍️ Color {pal.stages[stage].name}</h2><span /></header>
      <div className="coloring-main">
        <div ref={box} className="coloring" onClick={tap}>
          <PalArt pal={pal} stage={stage} size={420} />
        </div>
        <div className="palette">
          {PALETTE.map((c) => (
            <button key={c} className={`swatch ${c === color ? 'on' : ''}`} style={{ '--sw': c } as CSSProperties}
              onClick={() => { sfx.pop(); setColor(c) }} aria-label={`Color ${c}`} />
          ))}
          <BigButton color="white" onClick={() => update((x) => ({ ...x, colors: { ...x.colors, [key]: {} } }))}>🧽</BigButton>
        </div>
      </div>
    </div>
  )
}
