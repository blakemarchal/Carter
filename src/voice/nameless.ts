// A line with the family's names taken out, for when the narrator can't say a name (it isn't in the name library
// and the family hasn't recorded it): the narrator says the line without it, instead of the device's own voice
// reading all of it. "Way to go, Ella!" -> "Way to go!"; "Hi Ella! Welcome to the Ark!" -> "Hi! Welcome to the
// Ark!"; "Thank you, God, for making Ella!" -> "Thank you, God, for making you!". A sentence that's about the
// name ("Ella has the baby!", "It's Ella's birthday!") is left out; if nothing is left, the line is ''.
import { sentences } from './sentences'

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// (a name ends at the end of a word: not inside "Ellabelle")
const END = "(?![\\p{L}'’])"
const GREETING = '(Hi|Hello|Hey|Hooray|Goodnight|Good night|Good morning|Bye|Yay)'
// (the word before a name that goes with it: "dear Ella", "chef Ella", "baby Ella")
const TITLE = '(?:(?:dear|chef|baby|sweet|little)\\s+)?'
// (words a name follows as their object: "making Ella" -> "making you")
const OBJECT = '(to|for|with|making|made|love|loves|hug|hugs|see|meet|thank|thanks|help|helps)'

/** `text` without any of `names`, or '' if nothing sensible is left. */
export function withoutNames(text: string, names: string[]): string {
  const ns = [...new Set(names.map((n) => n.trim()).filter(Boolean))].sort((a, b) => b.length - a.length)
  if (!ns.length) return text
  const name = `(?:${ns.map(escape).join('|')})`
  // (any mention, "Ella's" too)
  const has = new RegExp(`(^|[^\\p{L}])${name}(?!\\p{L})`, 'iu')
  const out: string[] = []
  for (const s of sentences(text)) {
    if (!has.test(s)) {
      out.push(s)
      continue
    }
    let t = s
      // "…, Ella!" / "…, dear Ella." -> "…!"
      .replace(new RegExp(`,\\s*${TITLE}${name}${END}(?=\\s*[!.?…,])`, 'giu'), '')
      // "Hi Ella!" / "Hooray, Ella!" -> "Hi!"
      .replace(new RegExp(`^${GREETING},?\\s+${TITLE}${name}${END}(?=\\s*[!.?…,])`, 'iu'), '$1')
      // "for making Ella" -> "for making you"
      .replace(new RegExp(`\\b${OBJECT}\\s+${name}${END}(?![\\p{L}'’]|['’]s)`, 'giu'), '$1 you')
    // (a sentence still about the name, or a name on its own, is left out)
    if (has.test(t) || !/[\p{L}\p{N}]/u.test(t.replace(/^\W+|\W+$/gu, ''))) continue
    t = t.replace(/\s+([!.?…,])/g, '$1').replace(/,(?=[!.?…])/g, '').trim()
    out.push(t)
  }
  return out.join(' ')
}
