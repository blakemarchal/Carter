// The board every mini-game plays on: the 800 x 450 space of a story picture, letterboxed the same
// way (styles.css, "Mini-games"). Its children are layers stacked in order, each filling the board:
// a kit's backdrop (a whole <Scene>), then <BoardLayer>s of pieces in board units.
import type { ReactNode, SVGProps } from 'react'
import type { At } from './types'

/** The 16:9 board. */
export function Board({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="game-wrap">
      <div className={`game-board ${className}`}>{children}</div>
    </div>
  )
}

/** A layer of pieces, in board units (800 x 450), lined up exactly with the backdrop. */
export function BoardLayer({ children, className = '', ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" className={`game-layer pa-anim ${className}`} {...rest}>
      {children}
    </svg>
  )
}

/** Where a point on the screen (a finger) is on the board, through one of its layers. */
export function toBoard(layer: SVGSVGElement, clientX: number, clientY: number): At {
  const m = layer.getScreenCTM()
  if (!m) return [0, 0]
  const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse())
  return [p.x, p.y]
}
