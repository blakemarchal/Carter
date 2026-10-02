// Which battle moves a Pal knows, and what each one does.
import { stageFor, type Move, type MoveKind, type PalDef } from '../data/pals'
import type { Progress } from './progress'

export const MOVE_KINDS: MoveKind[] = ['basic', 'brave', 'super']
/** Hearts of friendship each kind of move fills. */
export const POWER: Record<MoveKind, number> = { basic: 1, brave: 2, super: 3 }
/** First-try answers in a row that charge the super move. */
export const CHARGE = 3

export interface MoveSlot {
  kind: MoveKind
  move: Move
  known: boolean
  /** Spoken when she taps a move she hasn't learned yet. */
  hint: string
}

export const battlesWon = (p: Progress) => Math.max(p.battlesWon, p.islandsDone.length)

export function movesFor(pal: PalDef, p: Progress): MoveSlot[] {
  const name = pal.stages[stageFor(pal, p.pals[pal.id] ?? 0)].name
  const evolved = stageFor(pal, p.pals[pal.id] ?? 0) >= 1
  return [
    { kind: 'basic', move: pal.moves.basic, known: true, hint: '' },
    { kind: 'brave', move: pal.moves.brave, known: battlesWon(p) >= 1, hint: `Win a friendly battle, and ${name} will learn ${pal.moves.brave.name}!` },
    { kind: 'super', move: pal.moves.super, known: evolved, hint: `When ${name} grows, ${name} will learn ${pal.moves.super.name}!` },
  ]
}
