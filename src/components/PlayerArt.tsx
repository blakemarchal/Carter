// Puts the player into the story pictures: their look, their family and their Pals (art/scenes/player.ts).
import { useMemo, type ReactNode } from 'react'
import { PlayerContext, type PlayerArt } from '../art/scenes/player'
import { grownupLook, kidLook, siblingLook } from '../art/people'
import { palById, stageFor } from '../data/pals'
import { castFor } from '../lib/party'
import { DEFAULT_LOOK, useFamily, useProfiles, useProgress, type FamilyCast, type Profile, type Progress } from '../lib/progress'

export function playerArt(me: Profile, players: Profile[], family: FamilyCast, p: Progress, age?: number): PlayerArt {
  const look = me.look ?? DEFAULT_LOOK
  const cast = castFor(me, players, family)
  const owned = Object.keys(p.pals)
  const buddy = p.battler ?? p.starter
  const ids = buddy && owned.includes(buddy) ? [buddy, ...owned.filter((id) => id !== buddy)] : owned
  return {
    name: me.name.trim() || 'Friend',
    look: kidLook(look),
    grownups: cast.grownups.map((g) => ({ ...g, look: grownupLook(g.role, look) })),
    siblings: cast.siblings.map((s, i) => ({ name: s.name, baby: s.baby, look: s.profile?.look ? kidLook(s.profile.look) : siblingLook(look, i) })),
    pets: cast.pets,
    age,
    birthday: me.birthday,
    pals: ids.map((id) => ({ id, stage: stageFor(palById(id), p.pals[id] ?? 0) })),
  }
}

/** The active player, for every picture inside. `age`: how old they're turning (at the party). */
export default function PlayerArtProvider({ age, children }: { age?: number; children: ReactNode }) {
  const p = useProgress()
  const { active, list } = useProfiles()
  const family = useFamily()
  const value = useMemo(() => {
    const me = list.find((x) => x.id === active) ?? { id: '', name: '', emoji: '🌈' }
    return playerArt(me, list, family, p, age)
  }, [p, active, list, family, age])
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
