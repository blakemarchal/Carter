// The birthday party: who's in the family story, whose birthday it is, and the words of the story.
import { describe, expect, it } from 'vitest'
import { castFor, isGrownup, othersBirthdayToday, stickerAge, ageSticker, hasAgeSticker } from '../lib/party'
import { partyStory } from '../data/birthday'
import type { FamilyCast, Profile } from '../lib/progress'

const kid: Profile = { id: 'robin', name: 'Robin', emoji: '🌈', birthday: { month: 1, day: 8 } }
const dad: Profile = { id: 'dad', name: 'Dad', emoji: '🧪' }
const sib: Profile = { id: 'jo', name: 'Jo', emoji: '🦁', birthday: { month: 3, day: 2 } }
const family: FamilyCast = { mom: 'Mommy', dad: 'Daddy', siblings: [{ name: 'Bean', baby: true, birthday: { month: 6, day: 1 } }, { name: 'jo' }], pets: [{ name: 'Biscuit', emoji: '🐶' }, { name: ' ', emoji: '🐱' }] }

describe('the family in the story', () => {
  it('leaves grown-up players out of the brothers and sisters', () => {
    expect(isGrownup(dad)).toBe(true)
    expect(isGrownup({ ...dad, grownup: false })).toBe(false)
    expect(isGrownup(kid)).toBe(false)
    const cast = castFor(kid, [kid, dad, sib], family)
    expect(cast.grownups).toEqual([{ name: 'Mommy', role: 'mom' }, { name: 'Daddy', role: 'dad' }])
    // Jo is a player (and on the family list too): only once. Bean is a baby.
    expect(cast.siblings.map((s) => [s.name, s.baby])).toEqual([['Jo', false], ['Bean', true]])
    expect(cast.pets.map((p) => p.name)).toEqual(['Biscuit'])
  })

  it('leaves out a parent with no name', () => {
    expect(castFor(kid, [kid], { ...family, dad: '' }).grownups.map((g) => g.name)).toEqual(['Mommy'])
  })
})

it('knows whose birthday it is today', () => {
  expect(othersBirthdayToday(kid, [kid, dad, sib], family, new Date(2027, 2, 2))).toEqual(['Jo'])
  expect(othersBirthdayToday(kid, [kid, dad, sib], family, new Date(2027, 5, 1))).toEqual(['Bean'])
  // Not your own birthday.
  expect(othersBirthdayToday(kid, [kid, dad, sib], family, new Date(2027, 0, 8))).toEqual([])
  expect(othersBirthdayToday(sib, [kid, dad, sib], family, new Date(2027, 0, 8))).toEqual(['Robin'])
})

it('age stickers', () => {
  expect(ageSticker(5)).toBe('🎂5')
  expect(stickerAge('🎂5')).toBe(5)
  expect(stickerAge('🎂')).toBeNull()
  expect(hasAgeSticker(['🌈', '🎂'])).toBe(false)
  expect(hasAgeSticker(['🌈', '🎂6'])).toBe(true)
})

describe('the birthday story', () => {
  it('tells it with their name, date, age and family', () => {
    const pages = partyStory({ name: 'Robin', birthday: { month: 1, day: 8 }, age: 5, grownups: ['Mommy', 'Daddy'], siblings: [{ name: 'Jo', baby: false }, { name: 'Bean', baby: true }], pets: ['Biscuit'] })
    expect(pages).toHaveLength(7)
    expect(pages[0].text).toBe('Five years ago, on January eighth, a wonderful baby was born. It was you, Robin!')
    expect(pages[3].text).toBe("Your family thanks God for you every day! Mommy and Daddy love you so much. And Jo and baby Bean give you big, giggly hugs! Even Biscuit is happy you're here!")
    expect(pages[4].text).toBe("And now it's your birthday! You're five years old! Hooray! It's party time!")
  })

  it('works with no family and no age', () => {
    const pages = partyStory({ name: 'Sam', grownups: [], siblings: [], pets: [] })
    expect(pages[0].text).toBe('Not so long ago, a wonderful baby was born. It was you, Sam!')
    expect(pages[3].text).toBe('Your family thanks God for you every day! They love you so much.')
    expect(pages[4].text).toBe("And now it's your birthday! Hooray! It's party time!")
  })

  it('one grown-up, one year', () => {
    const pages = partyStory({ name: 'Kit', age: 1, grownups: ['Mama'], siblings: [{ name: 'Lou', baby: false }], pets: [] })
    expect(pages[0].text.startsWith('One year ago,')).toBe(true)
    expect(pages[3].text).toBe('Your family thanks God for you every day! Mama loves you so much. And Lou gives you big, giggly hugs!')
  })
})
