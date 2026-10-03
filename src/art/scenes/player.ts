// Who is in the pictures: the child playing (drawn from their profile), their family, and their Pals.
// Screens that show story pictures provide it (components/PlayerArt.tsx); the default is a generic child.
import { createContext, useContext } from 'react'
import type { Birthday } from '../../lib/birthday'
import { DEFAULT_LOOK } from '../../lib/look'
import { grownupLook, kidLook, type Look } from '../people'

export interface PlayerArt {
  name: string
  look: Look
  /** Mom and Dad (if the family has them in the stories). */
  grownups: { name: string; look: Look; role: 'mom' | 'dad' }[]
  siblings: { name: string; look: Look; baby: boolean }[]
  pets: { name: string; emoji: string }[]
  /** How old they're turning (only known at the party, once they've said). */
  age?: number
  birthday?: Birthday
  /** Their Pals, their buddy first: who comes to the party. */
  pals: { id: string; stage: number }[]
}

export const PlayerContext = createContext<PlayerArt>({
  name: 'Friend',
  look: kidLook(DEFAULT_LOOK),
  grownups: [{ name: 'Mom', look: grownupLook('mom', DEFAULT_LOOK), role: 'mom' }, { name: 'Dad', look: grownupLook('dad', DEFAULT_LOOK), role: 'dad' }],
  siblings: [],
  pets: [],
  pals: [{ id: 'zippy', stage: 0 }, { id: 'ember', stage: 0 }, { id: 'pip', stage: 0 }],
})

export const usePlayer = () => useContext(PlayerContext)
