// Who's who on a birthday: the birthday child's family (for the story), whose birthday it is today
// (so the other players hear "Today is ___'s birthday!"), and the age stickers from each party.
import { isBirthday } from './birthday'
import type { FamilyCast, Profile } from './progress'

/** Players with these names are grown-ups trying the game, unless a parent says otherwise. */
const GROWNUP_NAME = /^(mom|mommy|mum|mummy|mama|momma|dad|daddy|papa|pop|grandma|grandpa|nana|granny|grown[- ]?up|parent|teacher|test|tester)$/i

/** A grown-up's player is never in the stories as a brother or sister. */
export const isGrownup = (p: Profile) => p.grownup ?? GROWNUP_NAME.test(p.name.trim())

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

export interface Cast {
  grownups: { name: string; role: 'mom' | 'dad' }[]
  /** The other children: players first (with their own looks), then the family list's brothers and sisters. */
  siblings: { name: string; baby: boolean; profile?: Profile }[]
  pets: { name: string; emoji: string }[]
}

/** The birthday child's family, from the family cast and the other players on the device. */
export function castFor(me: Profile, players: Profile[], family: FamilyCast): Cast {
  const grownups = (['mom', 'dad'] as const).filter((role) => family[role].trim()).map((role) => ({ name: family[role].trim(), role }))
  const kids = players
    .filter((p) => p.id !== me.id && !isGrownup(p) && p.name.trim())
    .map((p) => ({ name: p.name.trim(), baby: false, profile: p }))
  const more = family.siblings
    .filter((s) => s.name.trim() && !same(s.name, me.name) && !kids.some((k) => same(k.name, s.name)))
    .map((s) => ({ name: s.name.trim(), baby: !!s.baby }))
  return { grownups, siblings: [...kids, ...more], pets: family.pets.filter((p) => p.name.trim()) }
}

/** Everyone else whose birthday is today: other players, and brothers and sisters on the family list. */
export function othersBirthdayToday(me: Profile, players: Profile[], family: FamilyCast, now = new Date()): string[] {
  const names = [
    ...players.filter((p) => p.id !== me.id && isBirthday(p.birthday, now)).map((p) => p.name.trim()),
    ...family.siblings.filter((s) => isBirthday(s.birthday, now)).map((s) => s.name.trim()),
  ]
  return names.filter((n, i) => n && !same(n, me.name) && names.findIndex((m) => same(m, n)) === i)
}

/** "Sam", "Sam and Jo", "Sam, Jo and Kit". */
export const andList = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)

// ---------- Age stickers: "🎂5" is from the party for turning five ----------

export const ageSticker = (age: number) => `🎂${age}`
export function stickerAge(s: string) {
  const m = /^🎂(\d{1,2})$/.exec(s)
  return m ? Number(m[1]) : null
}
export const hasAgeSticker = (stickers: string[]) => stickers.some((s) => stickerAge(s) !== null)
