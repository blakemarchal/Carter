// Drag and drop for little fingers. Press on something and move: a copy of it lifts up and follows
// the finger in a layer above everything (the original fades back), and whatever it is over lights up.
// Let go on a spot that wants it and the copy glides in; anywhere else, it glides back home.
// A quick tap without moving calls onTap instead, so tapping keeps working everywhere.
//
//   const drag = useDrag({ data: '🍓', onDrop: (target) => target === 'bowl' && addOne(), onTap: addOne })
//   <button className="k-thing" {...drag}>🍓</button>
//   <div ref={useDropTarget('bowl')} className="bowl" />          (gets .drop-hover while hovered)
//
// Everything moves with the Web Animations API on copies outside React, so a drag costs no re-renders.
import { useCallback, useEffect, useRef, type PointerEvent as RPointerEvent } from 'react'

export interface Pt { x: number; y: number }

interface Target { el: HTMLElement; accepts: (data: unknown) => boolean; margin: number }
const targets = new Map<string, Target>()

/**
 * Marks an element as a place to drop things. `accepts` can turn some things away (no highlight,
 * and they go home); `margin` makes it easier to hit (px, default 24).
 */
export function useDropTarget(id: string, accepts?: (data: any) => boolean, margin = 24) {
  const acc = useRef(accepts)
  acc.current = accepts
  const mine = useRef<HTMLElement | null>(null)
  return useCallback((el: HTMLElement | null) => {
    if (el) {
      mine.current = el
      targets.set(id, { el, accepts: (d) => acc.current?.(d) ?? true, margin })
    } else {
      // Only remove our own registration (another screen may have taken this name since).
      if (targets.get(id)?.el === mine.current) targets.delete(id)
      mine.current = null
    }
  }, [id, margin])
}

function targetAt(p: Pt, data: unknown): [string, Target] | null {
  let best: [string, Target] | null = null
  let bestArea = Infinity
  for (const [id, t] of targets) {
    if (!t.el.isConnected || !t.accepts(data)) continue
    const r = t.el.getBoundingClientRect()
    const m = t.margin
    if (p.x < r.left - m || p.x > r.right + m || p.y < r.top - m || p.y > r.bottom + m) continue
    const area = r.width * r.height
    if (area < bestArea) (best = [id, t]), (bestArea = area) // the smallest one wins (a slot inside a tray)
  }
  return best
}

// ---------- copies that move (the dragged ghost, flights) ----------

/** A copy of `el`, at `rect`, in its own layer above everything. Returns the wrapper and the copy. */
function lift(el: Element, rect: DOMRect) {
  const wrap = document.createElement('div')
  wrap.className = 'drag-layer'
  wrap.style.cssText = `position:fixed;left:0;top:0;width:${rect.width}px;height:${rect.height}px;pointer-events:none;z-index:1000;transform:translate(${rect.left}px,${rect.top}px);`
  const copy = el.cloneNode(true) as HTMLElement
  const cs = getComputedStyle(el)
  copy.removeAttribute('data-drag')
  copy.removeAttribute('id')
  // Keep its look outside its usual parent: size and font come along explicitly.
  Object.assign(copy.style, {
    width: `${rect.width}px`, height: `${rect.height}px`, fontSize: cs.fontSize, lineHeight: cs.lineHeight,
    margin: '0', opacity: '1', animation: 'none', transition: 'none', position: 'static', transform: 'none', translate: 'none', scale: 'none', rotate: 'none',
  })
  copy.classList.add('drag-copy')
  wrap.appendChild(copy)
  document.body.appendChild(wrap)
  return { wrap, copy }
}

const at = (x: number, y: number) => `translate(${x}px, ${y}px)`

/** Where an element's middle is, on screen. */
export function middle(el: Element): Pt {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

/**
 * Flies a copy of `from` to `to` (an element's middle, or a point) along a little arc, shrinking a
 * bit as it lands. Resolves when it arrives. Used when she taps instead of dragging, and for
 * serving food to a Pal.
 */
export function fly(from: Element, to: Element | Pt, { duration = 520, arc = 90, endScale = 0.6, fade = true } = {}): Promise<void> {
  const rect = from.getBoundingClientRect()
  const { wrap, copy } = lift(from, rect)
  const end = to instanceof Element ? middle(to) : to
  const sx = rect.left, sy = rect.top
  const ex = end.x - rect.width / 2, ey = end.y - rect.height / 2
  const frames: Keyframe[] = []
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    const x = sx + (ex - sx) * t
    const y = sy + (ey - sy) * t - arc * 4 * t * (1 - t) // a parabola: up, then down into the target
    frames.push({ transform: at(x, y) })
  }
  wrap.animate(frames, { duration, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' })
  const a = copy.animate(
    [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.12) rotate(-6deg)', opacity: 1, offset: 0.4 }, { transform: `scale(${endScale})`, opacity: fade ? 0.2 : 1 }],
    { duration, easing: 'ease-in', fill: 'forwards' },
  )
  return a.finished.then(() => wrap.remove(), () => wrap.remove())
}

let active = false // one drag at a time

export interface DragOptions<T> {
  data: T
  /** Dropped on target `id`: return false to send it home; anything else keeps it (the copy glides in). */
  onDrop: (id: string, at: Pt) => boolean | void
  /** A tap without dragging. */
  onTap?: () => void
  /** The drag started (after the finger moved a little). */
  onStart?: () => void
  /** Let go somewhere that isn't a target (it's going home). */
  onMiss?: () => void
  disabled?: boolean
  /** Where a kept drop lands: glide into the target's middle (default), or stay where it was let go. */
  landing?: 'middle' | 'here'
}

/**
 * Makes an element draggable: spread the result onto it. The element should look like the thing
 * being moved (its copy is what she drags).
 */
export function useDrag<T>(opts: DragOptions<T>) {
  const o = useRef(opts)
  o.current = opts
  const cleanup = useRef<(() => void) | null>(null)
  useEffect(() => () => cleanup.current?.(), [])

  const onPointerDown = useCallback((e: RPointerEvent<HTMLElement>) => {
    if (o.current.disabled || active || (e.pointerType === 'mouse' && e.button !== 0)) return
    const el = e.currentTarget
    const id = e.pointerId
    const start = { x: e.clientX, y: e.clientY }
    const t0 = performance.now()
    const rect = el.getBoundingClientRect()
    let ghost: ReturnType<typeof lift> | null = null
    let hover: [string, Target] | null = null
    let last = start
    active = true

    const setHover = (h: [string, Target] | null) => {
      if (h?.[0] === hover?.[0]) return
      hover?.[1].el.classList.remove('drop-hover')
      h?.[1].el.classList.add('drop-hover')
      hover = h
    }
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return
      last = { x: ev.clientX, y: ev.clientY }
      const dx = last.x - start.x, dy = last.y - start.y
      if (!ghost) {
        if (Math.hypot(dx, dy) < 8) return
        ghost = lift(el, rect)
        ghost.copy.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18) rotate(-5deg)' }], { duration: 140, fill: 'forwards', easing: 'ease-out' })
        ghost.copy.classList.add('lifted')
        el.style.opacity = '0.25'
        o.current.onStart?.()
      }
      ghost.wrap.style.transform = at(rect.left + dx, rect.top + dy)
      setHover(targetAt(last, o.current.data))
      ev.preventDefault()
    }
    const finish = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return
      done()
      if (!ghost) {
        if (ev.type === 'pointerup' && performance.now() - t0 < 700) o.current.onTap?.()
        return
      }
      const g = ghost
      const h = hover
      setHover(null)
      // `at` is where the middle of the dragged thing is (not the finger, which may hold it by a corner).
      const center = { x: rect.left + rect.width / 2 + last.x - start.x, y: rect.top + rect.height / 2 + last.y - start.y }
      const kept = h && ev.type === 'pointerup' ? o.current.onDrop(h[0], center) !== false : false
      const restore = () => { el.style.opacity = '' }
      if (kept && h && o.current.landing === 'here') {
        // It stays where she let go: the copy settles and gives way to the real thing there.
        g.copy.animate([{ transform: 'scale(1.18) rotate(-5deg)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }], { duration: 160, fill: 'forwards' })
          .finished.then(() => { g.wrap.remove(); restore() }, () => { g.wrap.remove(); restore() })
      } else if (kept && h) {
        // Glide into the target, shrinking as it goes in.
        const m = middle(h[1].el)
        const r = g.wrap.getBoundingClientRect()
        g.wrap.animate([{ transform: at(r.left, r.top) }, { transform: at(m.x - rect.width / 2, m.y - rect.height / 2) }], { duration: 170, easing: 'ease-in', fill: 'forwards' })
        g.copy.animate([{ transform: 'scale(1.18)', opacity: 1 }, { transform: 'scale(.5)', opacity: 0 }], { duration: 170, easing: 'ease-in', fill: 'forwards' })
          .finished.then(() => { g.wrap.remove(); restore() }, () => { g.wrap.remove(); restore() })
      } else {
        // Home again, with a little bounce. (If the original is gone, just fade.)
        if (!h) o.current.onMiss?.()
        const home = el.isConnected ? el.getBoundingClientRect() : rect
        const r = g.wrap.getBoundingClientRect()
        g.wrap.animate([{ transform: at(r.left, r.top) }, { transform: at(home.left, home.top) }], { duration: 320, easing: 'cubic-bezier(.3,1.35,.5,1)', fill: 'forwards' })
        g.copy.animate([{ transform: 'scale(1.18) rotate(-5deg)' }, { transform: 'scale(1)' }], { duration: 320, fill: 'forwards' })
          .finished.then(() => { g.wrap.remove(); restore() }, () => { g.wrap.remove(); restore() })
      }
    }
    const done = () => {
      active = false
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
      cleanup.current = null
    }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
    cleanup.current = () => {
      done()
      setHover(null)
      ghost?.wrap.remove()
      el.style.opacity = ''
    }
  }, [])

  return { onPointerDown, 'data-drag': '' }
}

/**
 * Shows how to drag: a hand carries a see-through copy of `from` to `to`, twice. For when she taps
 * something that wants dragging, or hasn't started yet.
 */
export async function showDrag(from: Element, to: Element) {
  const rect = from.getBoundingClientRect()
  const end = middle(to)
  for (let i = 0; i < 2; i++) {
    const { wrap, copy } = lift(from, rect)
    copy.style.opacity = '0.55'
    const hand = document.createElement('div')
    hand.textContent = '👆'
    hand.className = 'drag-hand'
    wrap.appendChild(hand)
    const frames = [
      { transform: at(rect.left, rect.top), offset: 0 },
      { transform: at(rect.left, rect.top), offset: 0.15 },
      { transform: at(end.x - rect.width / 2, end.y - rect.height / 2), offset: 0.8 },
      { transform: at(end.x - rect.width / 2, end.y - rect.height / 2), offset: 1 },
    ]
    const a = wrap.animate(frames, { duration: 1300, easing: 'ease-in-out' })
    copy.animate([{ opacity: 0.55 }, { opacity: 0.55, offset: 0.8 }, { opacity: 0 }], { duration: 1300 })
    await a.finished.catch(() => {})
    wrap.remove()
  }
}
