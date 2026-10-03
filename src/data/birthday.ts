// The birthday party (screens/BirthdayParty.tsx): its story, thank-you verse and battle, written for
// whoever's birthday it is. Nobody is written in: the name, date, age and family all come from the
// player's profile and the family cast in the Parent Corner. Pictures: art/scenes/birthday.tsx.
import type { StoryPage } from './islands'
import { birthdaySpoken, type Birthday } from '../lib/birthday'
import { andList, pictured, PICTURED } from '../lib/party'
import { numberWords } from '../lib/spoken'

export interface PartyPeople {
  name: string
  birthday?: Birthday
  /** How old they're turning (they tell us at the party). */
  age?: number
  /** What they call their grown-ups ("Mom", "Daddy"). */
  grownups: string[]
  siblings: { name: string; baby: boolean }[]
  pets: string[]
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const years = (n: number) => `${numberWords(n)} ${n === 1 ? 'year' : 'years'}`

/** No "!": StoryBook reads the first page as "<title>. <first page>". */
export const storyTitle = (name: string) => `Happy Birthday, ${name}`

export function partyStory(c: PartyPeople): StoryPage[] {
  const born = `${c.age ? cap(years(c.age)) + ' ago' : 'Not so long ago'}${c.birthday ? `, on ${birthdaySpoken(c.birthday)}` : ''}`
  // Only the brothers, sisters and pets the picture can show (art/scenes/birthday.tsx), so everyone named is there.
  const kids = pictured(c.siblings).map((s) => (s.baby ? `baby ${s.name}` : s.name))
  const pets = c.pets.slice(0, PICTURED.pets)
  const petsLine = pets.length ? `${andList(pets)} ${pets.length > 1 ? 'are' : 'is'} happy you're here!` : ''
  // With nobody in the family cast, the picture is the birthday child with their own Pal.
  const family = (c.grownups.length || kids.length ? [
    'Your family thanks God for you every day!',
    c.grownups.length ? `${andList(c.grownups)} ${c.grownups.length > 1 ? 'love' : 'loves'} you so much.` : 'They love you so much.',
    kids.length ? `And ${andList(kids)} ${kids.length > 1 ? 'give' : 'gives'} you big, giggly hugs!` : '',
    petsLine && `Even ${petsLine}`,
  ] : [
    'God gives you people who love you and thank Him for you every day!',
    'And all your Ark Pals love you, too.',
    petsLine && `Even ${petsLine}`,
  ]).filter(Boolean).join(' ')
  return [
    { scene: '👶🎀💗', bg: 'linear-gradient(#ffe0f0,#fff3c9)', text: `${born}, a wonderful baby was born. It was you, ${c.name}!` },
    { scene: '✨😊💗', bg: 'linear-gradient(#ffd6ec,#e6d9ff)', text: `God made you, ${c.name}! He made your bright eyes, your happy giggles, and your smart brain. God made you wonderfully!` },
    { scene: '✨🌍💗', bg: 'linear-gradient(#e6d9ff,#bfe6ff)', text: 'God knows you, inside and out. He knows when you sit down and when you get up. And God loves you so much, all the time, no matter what!' },
    { scene: '🏡💗🤗', bg: 'linear-gradient(#fff3c9,#ffe0f0)', text: family },
    { scene: '🎈🎂🎁', bg: 'linear-gradient(#ffe0f0,#fff0b3)', text: `And now it's your birthday!${c.age ? ` You're ${years(c.age)} old!` : ''} Hooray! It's party time!` },
    { scene: '🎉🧁🎈', bg: 'linear-gradient(#e6ffe9,#ffe0f0)', text: 'All your Ark Pals came to the party! They brought balloons, presents, and yummy cupcakes.' },
    { scene: '💗✨🎂', bg: 'linear-gradient(#ffd6ec,#fff3c9)', text: `Happy birthday, ${c.name}! God made you, God knows you, and God will love you forever and ever.` },
  ]
}

/** The thank-you moment, then the verse to build (World English Bible, public domain). */
export const thanksLine = (name: string) => `Thank you, God, for making ${name}!`
export const BIRTHDAY_VERSE = {
  ref: 'Psalm 139:14',
  chunks: ['I will give thanks to you,', 'for I am fearfully', 'and wonderfully made.'],
}

/** Sprinkles the cupcake Pal comes to their first party (and stays). */
export const PARTY_PAL = 'sprinkles'

/** The birthday battle: a grumpy balloon floats in, hiding something… */
export const PARTY_FOE = 'pouty'
export const partyFoeIntro = (name: string) =>
  `Oh no! A grumpy balloon named Pouty is floating to ${name}'s party. Pouty is hiding something! Let's help Pouty feel happy again.`
/** …and it turns out to be a present. */
export const presentLine = (foe: string, name: string) =>
  `And look what ${foe} was hiding: a birthday present, just for you! Happy birthday, ${name}!`
