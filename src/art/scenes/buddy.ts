// The Pal the player is playing with, for pictures that show "her" Pal (bedtime, the birthday party).
// Screens that show those pictures provide it; the default is Zippy.
import { createContext } from 'react'

export const BuddyContext = createContext<{ id: string; stage: number }>({ id: 'zippy', stage: 0 })
