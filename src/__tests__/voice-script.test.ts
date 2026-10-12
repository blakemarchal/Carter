// The recording script: every clip each house voice records, by queue, made from the game itself.
import { describe, expect, it } from 'vitest'
import { ISLANDS, loadIsland } from '../data/islands'
import gen from '../voice/lines.gen.json'
import { voiceLines } from '../voice/lines-source'
import { buildScript, fixedPieces, QUEUES, scriptCounts, type ScriptItem } from '../voice/script'
import { TEMPLATES, recordedParts } from '../voice/templates'
import { LIBRARY_NAMES } from '../voice/names'
import { keys } from '../voice/keys'

let script: ScriptItem[]
const get = async () => (script ??= buildScript(await Promise.all(ISLANDS.map((i) => loadIsland(i.id)))))

describe('the recording script', () => {
  it('lines.gen.json is up to date (if not: npm run voice-script)', () => {
    expect(voiceLines()).toEqual(gen)
  })

  it('records a line with slots a sentence at a time, and a line without them whole', () => {
    expect(fixedPieces('3 plus 4. How many in all?')).toEqual(['How many in all?'])
    expect(fixedPieces('Read the word. Then tap the picture that matches!')).toEqual(['Read the word. Then tap the picture that matches!'])
    expect(fixedPieces('47!')).toEqual([])
  })

  it('has every queue, each clip once per voice, in queue order', async () => {
    const s = await get()
    const ids = s.map((i) => `${i.voice}|${i.key}`)
    expect(new Set(ids).size).toBe(ids.length)
    const refs = s.map((i) => `${i.voice}|${i.ref}`)
    expect(new Set(refs).size).toBe(refs.length)
    const order = s.filter((i) => i.voice === 'mom').map((i) => QUEUES.indexOf(i.queue))
    expect(order).toEqual([...order].sort((a, b) => a - b))
    expect(new Set(s.filter((i) => i.voice === 'mom').map((i) => i.queue))).toEqual(new Set(QUEUES.filter((q) => q !== 'songs')))
  })

  it('Mom reads the story, prompts, praise and learning, every template part, and fills every slot', async () => {
    const s = await get()
    const mom = new Set(s.filter((i) => i.voice === 'mom').map((i) => i.key))
    expect(mom.has('Great job!')).toBe(true)
    for (const t of TEMPLATES.filter((t) => !t.role)) for (const [i] of recordedParts(t)) expect(mom.has(keys.part(t.id, i)), t.id).toBe(true)
    for (const n of LIBRARY_NAMES) expect(mom.has(keys.name(n, 'exclaim')) && mom.has(keys.name(n, 'mid')), n).toBe(true)
    for (let n = 0; n <= 140; n++) expect(mom.has(keys.number(n, 'exclaim')), String(n)).toBe(true)
    expect(mom.has(keys.sound('b')) && mom.has(keys.letter('b')) && mom.has(keys.pal('Zippy', 'mid'))).toBe(true)
    // (a story page as the game reads it: the first page of a part starts with its title)
    const noah = await loadIsland('noah')
    const first = noah.steps.find((x) => x.kind === 'story')!
    if (first.kind === 'story') expect(mom.has(`${first.title}. ${first.pages[0].text}`)).toBe(true)
  })

  it('Dad reads Grumbleshade, and the child the Pals’ own lines and the songs', async () => {
    const s = await get()
    const dad = s.filter((i) => i.voice === 'dad')
    expect(dad.some((i) => i.say.startsWith('It’s Grumbleshade') || i.say.startsWith("It's Grumbleshade"))).toBe(true)
    expect(dad.some((i) => i.key === keys.part('shade-making', 0))).toBe(true)
    expect(dad.some((i) => i.key === keys.pal('Zippy', 'mid'))).toBe(true)
    const child = s.filter((i) => i.voice === 'child')
    expect(child.map((i) => i.say)).toEqual(expect.arrayContaining(['Yes, please!', 'Hee hee! That tickles!']))
    expect(child.some((i) => i.queue === 'songs')).toBe(true)
    // (no one's real name in what's read: the name lines are templates)
    expect(s.filter((i) => i.queue !== 'names').some((i) => /\bOlivia\b/.test(i.say))).toBe(false)
  })

  it('counts lines and minutes per voice and queue', async () => {
    const c = scriptCounts(await get())
    expect(c.mom.names!.lines).toBeGreaterThan(2 * LIBRARY_NAMES.length)
    expect(c.mom.praise!.minutes).toBeGreaterThan(0)
    expect(Object.keys(c).sort()).toEqual(['child', 'dad', 'mom'])
  })

  it('names families use that aren’t in the library are recorded first in the Names queue', async () => {
    const islands = await Promise.all(ISLANDS.map((i) => loadIsland(i.id)))
    const s = buildScript(islands, { extraNames: ['Zxqvbn', 'Olivia'] }).filter((i) => i.voice === 'mom' && i.queue === 'names')
    expect(s.slice(0, 2).map((i) => i.say).sort()).toEqual(['Zxqvbn!', '…, Zxqvbn.'])
    expect(s.filter((i) => i.say === 'Olivia!')).toHaveLength(1) // (in the library already: not twice)
  })
})
