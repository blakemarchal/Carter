// Turns on-screen text into text that reads well aloud.
// The Grok voice reads digits one by one ("10" -> "one zero") and spells out letter strings
// ("nnn" -> "N, N, N"), so numbers become words and letter sounds become IPA phonetics.

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

/** 0..9999 as words: 47 -> "forty-seven", 130 -> "one hundred thirty". */
export function numberWords(n: number): string {
  if (n < 0) return `minus ${numberWords(-n)}`
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '')
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} hundred` + (n % 100 ? ` ${numberWords(n % 100)}` : '')
  if (n < 10000) return `${numberWords(Math.floor(n / 1000))} thousand` + (n % 1000 ? ` ${numberWords(n % 1000)}` : '')
  return String(n)
}

/**
 * Letter sounds for phonics, written into narration as ⟦n⟧ (see `letterSound`).
 * `grok` is what's sent to the Grok voice, best first: a held sound for the letters you can hold (n, m, s, f, l,
 * r, v, z), a short "tuh" for the ones you can't, and the IPA last. (Sent as IPA alone, "t" came out as "two".)
 * The sound check page (owner only) can flag one, and scripts/warm-house-grok.mjs then makes it again with the
 * next prompt. `say` is the device voice's best attempt (it spells "nnn" out as "N, N, N", so never that).
 */
export const PHONICS: Record<string, { ipa: string; say: string; grok: string[] }> = {
  a: { ipa: 'æ', say: 'ah', grok: ['/æ/', 'aah', 'a, as in apple'] },
  b: { ipa: 'bə', say: 'buh', grok: ['buh', '/bə/'] },
  c: { ipa: 'kə', say: 'kuh', grok: ['kuh', '/kə/'] },
  d: { ipa: 'də', say: 'duh', grok: ['duh', '/də/'] },
  e: { ipa: 'ɛ', say: 'eh', grok: ['/ɛ/', 'eh', 'e, as in egg'] },
  f: { ipa: 'fː', say: 'fuh', grok: ['Fffff.', '/fː/', 'fuh'] },
  g: { ipa: 'ɡə', say: 'guh', grok: ['guh', '/ɡə/'] },
  h: { ipa: 'hə', say: 'huh', grok: ['huh', '/hə/'] },
  i: { ipa: 'ɪ', say: 'ih', grok: ['/ɪ/', 'ih', 'i, as in igloo'] },
  j: { ipa: 'dʒə', say: 'juh', grok: ['juh', '/dʒə/'] },
  k: { ipa: 'kə', say: 'kuh', grok: ['kuh', '/kə/'] },
  l: { ipa: 'lː', say: 'luh', grok: ['Lllll.', '/lː/', 'luh'] },
  m: { ipa: 'mː', say: 'muh', grok: ['Mmmmm.', '/mː/', 'muh'] },
  n: { ipa: 'nː', say: 'nuh', grok: ['Nnnnn.', '/nː/', 'nuh'] },
  o: { ipa: 'ɑ', say: 'aw', grok: ['/ɑ/', 'ah', 'o, as in octopus'] },
  p: { ipa: 'pə', say: 'puh', grok: ['puh', '/pə/'] },
  q: { ipa: 'kwə', say: 'kwuh', grok: ['kwuh', '/kwə/'] },
  r: { ipa: 'ɹː', say: 'ruh', grok: ['Rrrrr.', '/ɹː/', 'ruh'] },
  s: { ipa: 'sː', say: 'suh', grok: ['Sssss.', '/sː/', 'ss'] },
  t: { ipa: 'tə', say: 'tuh', grok: ['tuh', 'tuh.', '/tə/'] },
  u: { ipa: 'ʌ', say: 'uh', grok: ['/ʌ/', 'uh', 'u, as in umbrella'] },
  v: { ipa: 'vː', say: 'vuh', grok: ['Vvvvv.', '/vː/', 'vuh'] },
  w: { ipa: 'wə', say: 'wuh', grok: ['wuh', '/wə/'] },
  x: { ipa: 'ks', say: 'ks', grok: ['ks', '/ks/'] },
  y: { ipa: 'jə', say: 'yuh', grok: ['yuh', '/jə/'] },
  z: { ipa: 'zː', say: 'zuh', grok: ['Zzzzz.', '/zː/', 'zuh'] },
}

/** What Grok is asked to say for a letter's name, best first ("B." comes out as "bee"). */
export const LETTER_NAME_PROMPTS = (l: string): string[] => {
  const L = l.toUpperCase()
  const spelled: Record<string, string> = { a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'ef', g: 'jee', h: 'aitch', i: 'eye', j: 'jay', k: 'kay', l: 'el', m: 'em', n: 'en', o: 'oh', p: 'pee', q: 'cue', r: 'ar', s: 'ess', t: 'tee', u: 'you', v: 'vee', w: 'double-you', x: 'ex', y: 'why', z: 'zee' }
  return [`${L}.`, spelled[l.toLowerCase()], `${L}!`]
}

/** A letter's sound, to put inside narration: speak(`the ${letterSound('m')} sound`). */
export const letterSound = (letter: string) => `⟦${letter.toLowerCase()}⟧`

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}\u{20E3}]/gu

/**
 * Words spelled the same but said two ways, where the game only ever means one of them.
 * The dress-up bow (🎀) rhymes with "go"; voices tend to say the bend-at-the-waist "bow".
 * (Not "bow down", which is the other one.)
 */
const HETERONYMS: { re: RegExp; grok: string; device: string }[] = [
  { re: /\b([Bb])ows\b(?!\s+down)/g, grok: '/boʊz/', device: '$1eaus' },
  { re: /\b([Bb])ow\b(?!\s+down)/g, grok: '/boʊ/', device: '$1eau' },
]

/** The Bible's numbered books: 1 Samuel, 2 Kings, 1 John… */
const NUMBERED_BOOK = /\b([1-3]) (?=(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\b)/g

export function toSpoken(text: string, voice: 'grok' | 'device'): string {
  let out = text
  for (const h of HETERONYMS) out = out.replace(h.re, voice === 'grok' ? h.grok : h.device)
  return out
    .replace(/⟦([a-z])⟧/g, (_, l: string) => (voice === 'grok' ? PHONICS[l].grok[0].replace(/\.$/, '') : PHONICS[l].say))
    .replace(EMOJI, '')
    // Numbered books: "1 John 4:8" is said "First John", not "one John"
    .replace(NUMBERED_BOOK, (_, n: string) => `${['First', 'Second', 'Third'][Number(n) - 1]} `)
    .replace(/(\d+):(\d+)/g, '$1, $2') // Bible references: "Genesis 9:13" -> "Genesis nine, thirteen"
    .replace(/\d+/g, (d) => numberWords(Number(d)))
    .replace(/\s*&\s*/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim()
}
