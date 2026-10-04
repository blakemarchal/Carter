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
 * `ipa` is read by the Grok voice; `say` is the device voice's best attempt.
 */
const PHONICS: Record<string, { ipa: string; say: string }> = {
  a: { ipa: 'æ', say: 'ah' }, b: { ipa: 'bə', say: 'buh' }, c: { ipa: 'kə', say: 'kuh' }, d: { ipa: 'də', say: 'duh' },
  e: { ipa: 'ɛ', say: 'eh' }, f: { ipa: 'fː', say: 'fff' }, g: { ipa: 'ɡə', say: 'guh' }, h: { ipa: 'hə', say: 'huh' },
  i: { ipa: 'ɪ', say: 'ih' }, j: { ipa: 'dʒə', say: 'juh' }, k: { ipa: 'kə', say: 'kuh' }, l: { ipa: 'lː', say: 'lll' },
  m: { ipa: 'mː', say: 'mmm' }, n: { ipa: 'nː', say: 'nnn' }, o: { ipa: 'ɑ', say: 'aw' }, p: { ipa: 'pə', say: 'puh' },
  q: { ipa: 'kwə', say: 'kwuh' }, r: { ipa: 'ɹː', say: 'rrr' }, s: { ipa: 'sː', say: 'sss' }, t: { ipa: 'tə', say: 'tuh' },
  u: { ipa: 'ʌ', say: 'uh' }, v: { ipa: 'vː', say: 'vvv' }, w: { ipa: 'wə', say: 'wuh' }, x: { ipa: 'ks', say: 'ks' },
  y: { ipa: 'jə', say: 'yuh' }, z: { ipa: 'zː', say: 'zzz' },
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
    .replace(/⟦([a-z])⟧/g, (_, l: string) => (voice === 'grok' ? `/${PHONICS[l].ipa}/` : PHONICS[l].say))
    .replace(EMOJI, '')
    // Numbered books: "1 John 4:8" is said "First John", not "one John"
    .replace(NUMBERED_BOOK, (_, n: string) => `${['First', 'Second', 'Third'][Number(n) - 1]} `)
    .replace(/(\d+):(\d+)/g, '$1, $2') // Bible references: "Genesis 9:13" -> "Genesis nine, thirteen"
    .replace(/\d+/g, (d) => numberWords(Number(d)))
    .replace(/\s*&\s*/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim()
}
