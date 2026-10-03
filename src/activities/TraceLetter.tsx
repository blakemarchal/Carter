// Trace a big letter with a finger. We sample points inside the letter shape and count how many
// her painting covers; about 70% covered (and not much paint outside it) = traced. Scribbling
// mostly outside the letter starts over.
import { useEffect, useRef, useState } from 'react'
import { BigButton } from '../components/ui'
import { praise, speak } from '../lib/speech'
import { letterSound } from '../lib/spoken'
import { sfx } from '../lib/sfx'
import { wait } from '../lib/util'
import { useAlive } from '../lib/useAlive'

const SIZE = 420 // CSS px
const FONT = `800 380px "Baloo 2", system-ui, sans-serif`
const BRUSH = 40

/**
 * "the big D" or "the little d": said aloud, D and d sound the same. (The name is written as a
 * capital, as elsewhere, so the voice says the letter's name: a lone "a" would be read "uh".)
 */
const named = (l: string) => `the ${l === l.toUpperCase() ? 'big' : 'little'} ${l.toUpperCase()}`

export default function TraceLetter({ title, intro, letters, onDone }: { title: string; intro: string; letters: string[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [done, setDone] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const inside = useRef<[number, number][]>([]) // sample points inside the letter
  const outside = useRef<[number, number][]>([]) // sample points around it
  const paint = useRef<HTMLCanvasElement | null>(null) // offscreen copy of her strokes, for checking
  const last = useRef<[number, number] | null>(null)
  const alive = useAlive()
  const letter = letters[i]
  const dpr = Math.min(2, window.devicePixelRatio || 1)

  const setup = async () => {
    await document.fonts.load(FONT).catch(() => {})
    const c = canvas.current
    if (!c) return
    c.width = c.height = SIZE * dpr
    const g = c.getContext('2d')!
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, SIZE, SIZE)
    g.font = FONT
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = '#ffe0ef'
    g.fillText(letter, SIZE / 2, SIZE / 2 + 24)
    g.setLineDash([10, 12])
    g.lineWidth = 4
    g.strokeStyle = '#ff9ccc'
    g.strokeText(letter, SIZE / 2, SIZE / 2 + 24)
    g.setLineDash([])
    // Where the letter is: draw it on a small offscreen canvas and sample a grid.
    const m = document.createElement('canvas')
    m.width = m.height = SIZE
    const mg = m.getContext('2d')!
    mg.font = FONT
    mg.textAlign = 'center'
    mg.textBaseline = 'middle'
    mg.fillText(letter, SIZE / 2, SIZE / 2 + 24)
    const px = mg.getImageData(0, 0, SIZE, SIZE).data
    const ins: [number, number][] = [], outs: [number, number][] = []
    for (let y = 4; y < SIZE; y += 8) for (let x = 4; x < SIZE; x += 8) (px[(y * SIZE + x) * 4 + 3] > 128 ? ins : outs).push([x, y])
    inside.current = ins
    outside.current = outs
    paint.current = document.createElement('canvas')
    paint.current.width = paint.current.height = SIZE
  }

  useEffect(() => {
    setup()
    if (i === 0) speak(intro)
    else speak(`Now trace ${named(letter)}!`)
  }, [i])

  const pos = (e: React.PointerEvent): [number, number] => {
    const r = canvas.current!.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * SIZE, ((e.clientY - r.top) / r.height) * SIZE]
  }
  const stroke = (a: [number, number], b: [number, number]) => {
    for (const [g, color] of [[canvas.current!.getContext('2d')!, '#ff6fae'], [paint.current!.getContext('2d')!, '#000']] as const) {
      g.lineCap = g.lineJoin = 'round'
      g.lineWidth = BRUSH
      g.strokeStyle = color
      g.beginPath()
      g.moveTo(a[0], a[1])
      g.lineTo(b[0], b[1])
      g.stroke()
    }
  }

  const down = (e: React.PointerEvent) => {
    if (done) return
    try {
      canvas.current!.setPointerCapture(e.pointerId)
    } catch {
      /* not a capturable pointer: drawing still works */
    }
    last.current = pos(e)
    stroke(last.current, last.current)
  }
  const move = (e: React.PointerEvent) => {
    if (!last.current) return
    const p = pos(e)
    stroke(last.current, p)
    last.current = p
  }
  const up = async () => {
    if (!last.current) return
    last.current = null
    const px = paint.current!.getContext('2d')!.getImageData(0, 0, SIZE, SIZE).data
    const painted = (pts: [number, number][]) => pts.filter(([x, y]) => px[(y * SIZE + x) * 4 + 3] > 0).length
    const inHit = painted(inside.current)
    const outHit = painted(outside.current)
    const coverage = inHit / Math.max(1, inside.current.length)
    // Mostly on the letter: a little spill is fine, painting the whole page isn't tracing.
    const tidy = outHit <= inHit * 1.5
    if (coverage >= 0.7 && tidy) {
      setDone(true)
      sfx.fanfare()
      const l = letter.toLowerCase()
      await speak(`${praise()} That's ${named(letter)}! ${letter.toUpperCase()} says ${letterSound(l)}!`)
      if (!alive.current) return
      await wait(400)
      if (!alive.current) return
      if (i + 1 >= letters.length) return onDone()
      setDone(false)
      setI(i + 1)
    } else if (!tidy && outHit > 20) {
      sfx.oops()
      speak('Try to stay on the letter! Let\'s start again.')
      setup()
    }
  }

  return (
    <div className="activity trace">
      <h2>{title}</h2>
      <canvas ref={canvas} className={`trace-canvas ${done ? 'done' : ''}`} style={{ width: SIZE, height: SIZE }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      <div className="trace-tools">
        <button className="instruction" onClick={() => speak(`Trace ${named(letter)} with your finger!`)}>🔊 {letter}</button>
        <BigButton color="white" onClick={() => setup()}>🧽 Start over</BigButton>
      </div>
    </div>
  )
}
