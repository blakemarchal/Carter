// A Pal's move, as a picture: its own icon drawn (art/items) when there's a drawing for it, else the drawing for
// the kind of move it is (a breeze, stars, hearts…), so a move never shows as the device's emoji.
import Pic from './Pic'
import { itemForEmoji } from '../art/items'
import type { Move } from '../data/pals'

const BY_FX: Record<Move['fx'], string> = {
  wind: 'wind', stars: 'shining-star', hearts: 'heart', roll: 'ball', spark: 'light',
  bubbles: 'bubbles', rock: 'stone', leaf: 'leaf', flame: 'fire',
}

export default function MoveIcon({ move }: { move: Move }) {
  return itemForEmoji(move.icon) ? <Pic e={move.icon} /> : <Pic e={move.icon} art={BY_FX[move.fx]} />
}
