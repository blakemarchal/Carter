// Every clip the house `grok` voice needs (docs/CLOUD-BRIEF.md, wave 11): Grok's "Ara" voice, made once on the
// server by scripts/warm-house-grok.mjs from public/voice/grok-list.json (npm run voice-script writes it from
// this). Grok stands in for every line until our own family records it (src/voice/roles.ts):
//   - every fixed line in the recording script (praise, prompts, story pages, learning), whole;
//   - every template's parts, and what fills the slots: numbers 0-140, letter names, letter sounds (on their own),
//     Pal names, the 1,062 library names (the SSA's public list: no family's data), and the names of things and
//     moves that activities say;
// so a line with a child's name is stitched in Grok too, and nothing about any family is ever sent to xAI.
// Each clip has its prompts, best first: a clip flagged on the sound check page is made again with the next one.
import { SEAS } from '../data/seas'
import { ISLANDS } from '../data/islands'
import { PALS } from '../data/pals'
import { CUT_SAY, RECIPES } from '../data/recipes'
import { SHADOW_MOVES } from '../data/shade'
import { ACCESSORIES } from '../lib/care'
import { LETTER_NAME_PROMPTS, numberWords, PHONICS, toSpoken } from '../lib/spoken'
import { keys } from './keys'
import { buildScript, type Gen, type IslandSource } from './script'
import { grokOnly } from './stitch'
import { recordedParts, TEMPLATES } from './templates'

export interface GrokClip {
  /** What the clip is (its fingerprint is made from this, as for every house clip). */
  key: string
  /** What to send to xAI, best first. */
  say: string[]
  /** Where it's from (the studio's script ref, or what kind of piece). */
  ref: string
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
/** Fields of the game's data that name a thing an activity says ("Where does the lion go?"). */
const ITEM_FIELDS = new Set(['say', 'plural', 'into', 'basket', 'what', 'foodName', 'word', 'names', 'others', 'name'])

/** Every thing's name the activities can say: from the islands' activities, the kitchen, dress-up, coins and the map. */
export function itemNames(islands: IslandSource[]): string[] {
  const out = new Set<string>()
  const add = (v: unknown) => {
    if (typeof v !== 'string' || !/\p{L}/u.test(v) || v.length > 60) return
    out.add(v.trim())
    // (said without its full stop too: "That's Noah praying to God. Which one comes next?")
    if (/[.!?]$/.test(v.trim())) out.add(v.trim().replace(/[.!?]+$/, ''))
  }
  const walk = (o: unknown, field = '') => {
    if (Array.isArray(o)) return o.forEach((x) => walk(x, field))
    if (o && typeof o === 'object') return Object.entries(o).forEach(([k, v]) => walk(v, k))
    if (ITEM_FIELDS.has(field)) add(o)
  }
  for (const isl of islands) for (const step of isl.steps) if (step.kind !== 'story' && step.kind !== 'verse') walk(step)
  for (const r of RECIPES) {
    add(r.name)
    walk(r.steps)
  }
  Object.values(CUT_SAY).forEach(add)
  for (const a of ACCESSORIES) add(a.name)
  for (const s of SEAS) { add(s.name); s.islands.forEach((i) => add(i.name)) }
  for (const i of ISLANDS) add(i.name)
  ;['penny', 'nickel', 'dime', 'quarter'].forEach(add)
  return [...out].sort()
}

/** Every move a Pal (or the shadow) can use. */
export const moveNames = (): string[] => [...new Set([...PALS.flatMap((p) => Object.values(p.moves).map((m) => m.name)), ...SHADOW_MOVES])].sort()

/** The whole list, each clip once. */
export function buildGrokList(islands: IslandSource[], gen?: Gen): GrokClip[] {
  const out = new Map<string, GrokClip>()
  const add = (key: string, say: string[], ref: string) => {
    const said = say.map((s) => s.trim()).filter(Boolean)
    if (!out.has(key) && said.length) out.set(key, { key, say: said, ref })
  }
  for (const it of buildScript(islands, gen ? { gen } : {})) {
    if (it.queue === 'songs') continue
    const [kind, a, take] = it.ref.split(':')
    if (kind === 'name' || kind === 'pal') add(it.key, [take === 'exclaim' ? `${a}!` : a], it.ref)
    else if (kind === 'num') add(it.key, [take === 'exclaim' ? `${cap(numberWords(Number(a)))}!` : numberWords(Number(a))], it.ref)
    else if (kind === 'letter') add(it.key, LETTER_NAME_PROMPTS(a), it.ref)
    else if (kind === 'sound') add(it.key, PHONICS[a].grok, it.ref)
    else if (it.queue === 'templates') add(it.key, [toSpoken(it.say, 'grok')], it.ref)
    else add(it.key, [toSpoken(it.key, 'grok')], it.ref)
  }
  // (the templates with things or moves in them: only Grok records those, for now)
  for (const tpl of TEMPLATES.filter(grokOnly)) for (const [i, said] of recordedParts(tpl)) add(keys.part(tpl.id, i), [toSpoken(said, 'grok')], `tpl:${tpl.id}:${i}`)
  for (const item of itemNames(islands)) {
    add(keys.item(item), [toSpoken(item, 'grok')], `item:${item}`)
    // (a thing said on its own, as an activity does when it's tapped or put in order)
    add(item, [toSpoken(item, 'grok')], `item-line:${item}`)
  }
  for (const m of moveNames()) add(keys.move(m), [m], `move:${m}`)
  return [...out.values()]
}

/** About how many characters xAI is asked for (what it charges by). */
export const grokCharacters = (list: GrokClip[]) => list.reduce((n, c) => n + c.say[0].length, 0)
