// Grown-ups' avatars: how a parent, grandparent or other grown-up looks in their round portrait
// (components/Avatar.tsx). Kept on the server with them (server/families.mjs), so it's the same on
// every device. Children's avatars are their story looks (lib/look.ts).
import { SKIN, type Hair, type Look } from '../art/people'
import type { KidLook } from './look'

export interface GrownupAvatar {
  skin: KidLook['skin']
  hair: 'short' | 'long' | 'curly' | 'ponytail' | 'bald'
  hairColor: string
  beard: 'none' | 'short' | 'long'
  /** Their clothes. */
  color: string
}

export const GROWNUP_HAIRS: GrownupAvatar['hair'][] = ['short', 'long', 'curly', 'ponytail', 'bald']
/** The usual hair colors, plus silver and white for grandparents. */
export const GROWNUP_HAIR_COLORS = ['#2b1d14', '#5a3a24', '#7a4a24', '#a8662f', '#d9a441', '#c0502a', '#a7a29b', '#e8e4dc']
export const GROWNUP_COLORS = ['#5fb7ff', '#3b6fa0', '#c9a8ff', '#ff8cc0', '#5fd39a', '#ffa64d', '#e06a5a', '#8f7a5a']

/** Quick starts: tap one, then change anything. */
export const AVATAR_PRESETS: { name: string; avatar: GrownupAvatar }[] = [
  { name: 'Mom', avatar: { skin: 'light', hair: 'long', hairColor: '#7a4a24', beard: 'none', color: '#c9a8ff' } },
  { name: 'Dad', avatar: { skin: 'light', hair: 'short', hairColor: '#5a3a24', beard: 'short', color: '#5fb7ff' } },
  { name: 'Grandma', avatar: { skin: 'light', hair: 'curly', hairColor: '#e8e4dc', beard: 'none', color: '#ff8cc0' } },
  { name: 'Grandpa', avatar: { skin: 'light', hair: 'short', hairColor: '#a7a29b', beard: 'short', color: '#8f7a5a' } },
]

const GRANDMA = /\b(nana|nanny|grandma|granny|gran|gigi|mimi|grammy|oma|abuela|nonna|bubbie|meemaw)\b/i
const GRANDPA = /\b(paw ?paw|papa|pop|pops|poppy|grandpa|grandad|granddad|gramps|opa|abuelo|nonno|pepaw)\b/i
const MOM = /\b(mom|mommy|mama|mum|mummy|mother)\b/i

/** A first avatar for a new grown-up, guessed from what the family calls them ("Nana", "Paw Paw"). */
export function guessAvatar(name: string): GrownupAvatar {
  const pick = (n: string) => AVATAR_PRESETS.find((p) => p.name === n)!.avatar
  if (GRANDMA.test(name)) return pick('Grandma')
  if (GRANDPA.test(name)) return pick('Grandpa')
  if (MOM.test(name)) return pick('Mom')
  return pick('Dad')
}

/** A stored avatar (or nothing yet) as something safe to draw. */
export function readAvatar(v: unknown, name = ''): GrownupAvatar {
  const a = (v ?? {}) as Partial<GrownupAvatar>
  const base = guessAvatar(name)
  return {
    skin: a.skin && a.skin in SKIN ? a.skin : base.skin,
    hair: a.hair && GROWNUP_HAIRS.includes(a.hair) ? a.hair : base.hair,
    hairColor: typeof a.hairColor === 'string' && /^#[0-9a-f]{6}$/i.test(a.hairColor) ? a.hairColor : base.hairColor,
    beard: a.beard === 'short' || a.beard === 'long' || a.beard === 'none' ? a.beard : base.beard,
    color: typeof a.color === 'string' && /^#[0-9a-f]{6}$/i.test(a.color) ? a.color : base.color,
  }
}

/** How a grown-up's avatar is drawn (art/people.tsx Person). */
export function avatarLook(a: GrownupAvatar): Look {
  return {
    skin: SKIN[a.skin], hair: a.hair as Hair, hairColor: a.hairColor, robe: a.color, sash: '#ffffff',
    beard: a.beard === 'none' ? undefined : a.beard, beardColor: a.hairColor,
  }
}
